
const express = require("express");
const router = express.Router();
const multer = require('multer');
const ServiceModel = require("../models/ServiceModel");
const path = require('path');
const fs = require("fs");
const mime = require("mime-types");

// Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, '../ServicesDocs');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure multer to save files in the 'ServicesDocs' folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const serviceDir = path.join(uploadDir, req.params.id); // Folder for specific service
        if (!fs.existsSync(serviceDir)) {
            fs.mkdirSync(serviceDir, { recursive: true });
        }
        // cb(null, 'ServicesDocs/');
        cb(null, serviceDir);
    },

    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Add a timestamp to avoid overwriting
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit files to 10MB
});

// POST request to add a new service
router.post('/addservice', async (req, res) => {
    try {
        const { departmentName, serviceName, serviceDescription } = req.body;

        // Create a new service document
        const newService = new ServiceModel({
            departmentName,
            serviceName,
            serviceDescription
        });

        // Save to the database
        const savedService = await newService.save();
        res.status(201).json({ result: true, message: "Service created successfully ", data: savedService });
    } catch (error) {
        res.status(500).json({ result: false, message: 'Error adding service', error: error.message });
    }
});

// GET request to retrieve all services
router.get('/getallservices', async (req, res) => {
    try {
        const services = await ServiceModel.find();
        res.status(200).json({ result: true, message: "All Services Retrieved", data: services });
    } catch (error) {
        res.status(500).json({ result: false, message: 'Error fetching services', error: error.message });
    }
});


// GET request to retrieve a specific service by ID
router.get('/getspecificservice/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the service document by ID
        const service = await ServiceModel.findById(id);

        if (!service) {
            return res.status(404).json({ result: false, message: "Service not found" });
        }

        res.status(200).json({ result: true, message: "Service retrieved successfully", service });
    } catch (error) {
        console.error("Error fetching service:", error);
        res.status(500).json({ result: false, message: "Error fetching service", error: error.message });
    }
});

// Route to update service with file upload
router.put('/addmoreservices/:id', upload.array('documents', 10), async (req, res) => {
    try {
        const { id } = req.params;

        // Debug logs
        console.log('req.body:', req.body);
        console.log('req.files:', req.files);

        // Parse JSON fields
        let detailsPart, teamInfo;
        try {
            detailsPart = req.body.detailsPart ? JSON.parse(req.body.detailsPart) : null;
            teamInfo = req.body.teamInfo ? JSON.parse(req.body.teamInfo) : null;
        } catch (error) {
            return res.status(400).json({
                result: false,
                message: 'Invalid JSON format for detailsPart or teamInfo',
            });
        }

        // Validate required fields
        if (!detailsPart || !teamInfo) {
            return res.status(400).json({
                result: false,
                message: 'Invalid or missing detailsPart or teamInfo',
            });
        }

        const service = await ServiceModel.findById(id);

        if (!service) {
            return res.status(404).json({
                result: false,
                message: 'Service not found',
            });
        }

        const existingDocuments = service.teamInfo.documents || [];

        // Append uploaded file names to teamInfo documents
        const uploadedFiles = req.files
            ? req.files.map(file => ({
                fieldName: file.fieldName,
                originalname: file.originalname,
                encoding: file.encoding,
                mimetype: file.mimetype,
                destination: file.destination,
                filename: file.filename,
                path: 'ServicesDocs/' + file.filename, // Relative path
                size: file.size,
            }))
            : [];

        teamInfo.documents = [
            ...existingDocuments,
            ...(Array.isArray(teamInfo.documents) ? teamInfo.documents : []), // Ensure it's an array
            ...uploadedFiles,
        ];

        // Update the service document in MongoDB
        const updatedService = await ServiceModel.findByIdAndUpdate(
            id,
            { $set: { detailsPart, teamInfo } },
            { new: true } // Return the updated document
        );

        if (!updatedService) {
            return res.status(404).json({
                result: false,
                message: 'Service not found',
            });
        }

        res.status(200).json({
            result: true,
            message: 'Service updated successfully',
            data: updatedService,
        });
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({
            result: false,
            message: 'Error updating service',
            error: error.message,
        });
    }
});

// router.get("/fetchServiceDocuments/:id/:filename", (req, res) => {
//   const { id, filename } = req.params;
//   const pdfPath = path.join(
//     __dirname,
//     `../ServicesDocs/${id}/${filename}`
//   );

//   // Check if the file exists
//   fs.access(pdfPath, fs.constants.F_OK, (err) => {
//     if (err) {
//       // console.error(err);
//       return res.status(404).json({ error: "File not found" });
//     }

//     // If the file exists, send it
//     res.sendFile(pdfPath);
//   });
// });



// router.get("/fetchServiceDocuments/:id/:filename", (req, res) => {
//     const { id, filename } = req.params;
//     const pdfPath = path.join(__dirname, `../ServicesDocs/${id}/${filename}`);
  
//     // Check if the file exists
//     fs.access(pdfPath, fs.constants.F_OK, (err) => {
//       if (err) {
//         return res.status(404).json({ error: "File not found" });
//       }
  
//       // Set headers to force download
//       res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
//       res.setHeader("Content-Type", "application/pdf");
  
//       // If the file exists, send it
//       res.sendFile(pdfPath);
//     });
//   });

router.get("/fetchServiceDocuments/:id/:filename", (req, res) => {
    const { id, filename } = req.params;
    const filePath = path.join(__dirname, `../ServicesDocs/${id}/${filename}`);

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ error: "File not found" });
        }

        // Get MIME type from mime-types package
        const mimeType = mime.lookup(filePath) || "application/octet-stream";

        // Set the Content-Type header dynamically
        res.setHeader("Content-Type", mimeType);

        // Stream the file to the response
        res.sendFile(filePath);
    });
});
  

// DELETE API to delete a service by ID
router.delete('/delete/:id', async (req, res) => {
    const serviceId = req.params.id; // Extract the service ID from the request params

    try {
        // Check if the service exists
        const service = await ServiceModel.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Delete the service
        await ServiceModel.findByIdAndDelete(serviceId);
        return res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error('Error deleting service:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});




module.exports = router;