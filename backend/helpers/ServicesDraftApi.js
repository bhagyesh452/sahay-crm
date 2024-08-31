const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const ServicesDraftModel = require("../models/ServicesDraftModel");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const { id } = req.params;
        let destinationPath = "";

        if (file.fieldname && id) {
            destinationPath = `ServicesDocs/${id}`;
        }

        // Create the directory if it doesn't exist
        if (!fs.existsSync(destinationPath)) {
            fs.mkdirSync(destinationPath, { recursive: true });
        }

        cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
        const { id } = req.params;
        const uniqueSuffix = Date.now();
        cb(null, `${uniqueSuffix}-${id}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

router.post("/saveServiceDraft", async (req, res) => {
    try {
        const { departmentName, serviceName  } = req.body;
        const service = {
            ...req.body,
            departmentName: departmentName,
            serviceName: serviceName,
        };

        // Check if the document already exists and update it, otherwise create a new one
        const result = await ServicesDraftModel.create(service
            // { new: true, upsert: true } // upsert option creates a new document if no match is found
        );

        res.json(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/fetchServiceDraft", async (req, res) => {
    try {
        const service = await ServicesDraftModel.find();
        if (!service) {
            return res.status(404).json({ result: false, message: "Service not found" });
        }
        res.status(200).json({ result: true, message: "Data successfully fetched", data: service });
    } catch (error) {
        res.status(500).json({ result: false, message: "Error fetching services", error: error.message });
    }
});

router.put("/updateServiceDraft/:id", upload.fields([
    { name: "document", maxCount: 20 },
]), async (req, res) => {

    const { id } = req.params;
    const { departmentName, serviceName, objectives, benefits, requiredDocuments, eligibilityRequirements, process, deliverables, timeline, employeeName, headName, portfolio, activeStep } = req.body;

    // Helper function to get file details
    const getFileDetails = (fileArray) => fileArray ? fileArray.map(file => ({
        fieldname: file.fieldname,
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        destination: file.destination,
        filename: file.filename,
        path: file.path,
        size: file.size
    })) : [];

    // Retrieve document details from uploaded files
    const documentDetails = getFileDetails(req.files?.document);

    try {
        if (!id) {
            return res.status(404).json({ result: false, message: "Service not found" });
        }

        const updateFields = {
            ...req.body,
            ...(activeStep && { activeStep }),

            ...(departmentName && { departmentName }),
            ...(serviceName && { serviceName }),

            ...(objectives && { objectives }),
            ...(benefits && { benefits }),
            
            ...(requiredDocuments && { requiredDocuments }),
            ...(eligibilityRequirements && { eligibilityRequirements }),
            
            ...(process && { process }),
            ...(deliverables && { deliverables }),
            ...(timeline && { timeline }),
            
            ...(portfolio && { portfolio }),
            ...(documentDetails.length > 0 && { documents: documentDetails })
        };

        // Ensure employeeName and headName are arrays
        if (employeeName) {
            updateFields['$addToSet'] = {
                'concernTeam.employeeNames': { $each: Array.isArray(employeeName) ? employeeName : [employeeName] }
            };
        }

        if (headName) {
            updateFields['$addToSet'] = {
                ...updateFields['$addToSet'],
                'concernTeam.headNames': { $each: Array.isArray(headName) ? headName : [headName] }
            };
        }

        // Update the service document
        const service = await ServicesDraftModel.findOneAndUpdate(
            { _id: id },
            updateFields,
            { new: true } // Return the updated document
        );

        if (!service) {
            return res.status(404).json({ result: false, message: "Service not found" });
        }

        res.status(200).json({ result: true, message: "Data successfully updated", data: service });
    } catch (error) {
        res.status(500).json({ result: false, message: "Error updating service", error: error.message });
    }
});

router.delete("/deleteServiceDraft/:id", async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) {
            return res.status(404).json({ result: false, message: "Service not found" });
        }
        const service = await ServicesDraftModel.findByIdAndDelete(id);
        res.status(200).json({ result: true, message: "Service successfully deleted", data: service });
    } catch (error) {
        res.status(500).json({ result: false, message: "Error deleting service", error: error });
    }
});

module.exports = router;