const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const ServicesModel = require("../models/ServicesModel");

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

// Create new service :
router.post("/addServices/:id", upload.fields([
    { name: "document", maxCount: 20 },
]), async (req, res) => {
    try {
        // Parse JSON data from form fields
        const departmentInfo = JSON.parse(req.body.departmentInfo);
        const objectivesInfo = JSON.parse(req.body.objectivesInfo);
        const requirementsInfo = JSON.parse(req.body.requirementsInfo);
        const processInfo = JSON.parse(req.body.processInfo);
        const teamInfo = JSON.parse(req.body.teamInfo);
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ result: false, message: "ID is required to create a service" });
        }

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

        // Prepare the service data to be saved
        const serviceData = {
            _id: id,
            departmentName: departmentInfo.departmentName,
            serviceName: departmentInfo.serviceName,

            objectives: objectivesInfo.objectives,
            benefits: objectivesInfo.benefits,

            requiredDocuments: requirementsInfo.requiredDocuments,
            eligibilityRequirements: requirementsInfo.eligibilityRequirements,

            process: processInfo.process,
            deliverables: processInfo.deliverables,
            timeline: processInfo.timeline,

            concernTeam: {
                employeeNames: Array.isArray(teamInfo.employeeName) ? teamInfo.employeeName : [teamInfo.employeeName],
                headNames: Array.isArray(teamInfo.headName) ? teamInfo.headName : [teamInfo.headName],
            },
            portfolio: teamInfo.portfolio,
            documents: documentDetails,
        };

        // Create a new service with the specified _id
        const newService = new ServicesModel(serviceData);

        // Save the new service
        await newService.save();

        res.status(200).json({ result: true, message: "Service successfully created", data: newService });
    } catch (error) {
        res.status(500).json({ result: false, message: "Error creating service", error: error.message });
    }
});

// Fetch all the services :
router.get("/fetchServices", async (req, res) => {
    try {
        const services = await ServicesModel.find();
        res.status(200).json({ result: true, message: "Services successfully fetched", data: services });
    } catch (error) {
        res.status(500).json({ result: false, message: "Error fetching services", error: error });
    }
});

// Fetch service from service name :
// router.get("/fetchServiceFromServiceName/:serviceName", async (req, res) => {
//     const { serviceName } = req.params;
//     try {
//         const service = await ServicesModel.findOne({ serviceName: serviceName });
//         res.status(200).json({ result: true, message: "Service successfully fetched", data: service });
//     } catch (error) {
//         res.status(500).json({ result: false, message: "Error fetching service", error: error });
//     }
// });
router.get("/fetchServiceFromServiceName/:serviceName", async (req, res) => {
    const { serviceName } = req.params;

    try {
        // Decode the service name in case it was URL-encoded
        const decodedServiceName = decodeURIComponent(serviceName);

        // Search for the service name, handling the slash replacement logic
        const service = await ServicesModel.findOne({
            $or: [
                { serviceName: decodedServiceName }, // Exact match
                { serviceName: decodedServiceName.replace(/-/g, "/") } // Handle alternate names
            ]
        });

        if (!service) {
            return res.status(404).json({ result: false, message: "Service not found" });
        }

        res.status(200).json({ result: true, message: "Service successfully fetched", data: service });
    } catch (error) {
        res.status(500).json({ result: false, message: "Error fetching service", error: error });
    }
});

// Fetching documents from services
router.get("/fetchDocuments/:id/:filename", (req, res) => {
    const { id, filename } = req.params;
    const pdfPath = path.join(
        __dirname,
        `../ServicesDocs/${id}/${filename}`
    );

    // Check if the file exists
    fs.access(pdfPath, fs.constants.F_OK, (err) => {
        if (err) {
            // console.error(err);
            return res.status(404).json({ error: "File not found" });
        }

        // If the file exists, send it
        res.sendFile(pdfPath);
    });
});

// Updating service from serviceName
router.put("/updateService/:serviceName/:id", upload.fields([
    { name: "document", maxCount: 20 },
]), async (req, res) => {
    try {
        const { serviceName } = req.params;

        const { departmentName, objectives, benefits, requiredDocuments, eligibilityRequirements, process, deliverables, timeline, portfolio } = req.body;

        const teamInfo = req.body.teamInfo ? JSON.parse(req.body.teamInfo) : {};
        const { employeeName, headName } = teamInfo;

        if (!serviceName) {
            return res.status(400).json({ result: false, message: "Service name is required to update the service" });
        }

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
        const documentDetails = getFileDetails(req.files ? req.files["document"] : []);

        // Prepare the service data to be updated
        const updatedServiceData = {
            ...req.body,

            ...(departmentName && { departmentName: departmentName }),
            ...(serviceName && { serviceName: serviceName }),

            ...(objectives && { objectives: objectives }),
            ...(benefits && { benefits: benefits }),

            ...(requiredDocuments && { requiredDocuments: requiredDocuments }),
            ...(eligibilityRequirements && { eligibilityRequirements: eligibilityRequirements }),

            ...(process && { process: process }),
            ...(deliverables && { deliverables: deliverables }),
            ...(timeline && { timeline: timeline }),

            concernTeam: {
                ...(employeeName && { employeeNames: Array.isArray(employeeName) ? employeeName : [employeeName] }),
                ...(headName && { headNames: Array.isArray(headName) ? headName : [headName] })
            },
            ...(portfolio && { portfolio: portfolio }),
            ...(documentDetails.length > 0 && { documents: documentDetails })
        };

        // Find the service by serviceName and update it
        const updatedService = await ServicesModel.findOneAndUpdate(
            { serviceName: serviceName }, // Find by serviceName
            updatedServiceData, // Update with this data
            { new: true } // Return the updated document
        );

        if (!updatedService) {
            return res.status(404).json({ result: false, message: "Service not found" });
        }

        res.status(200).json({ result: true, message: "Service successfully updated", data: updatedService });
    } catch (error) {
        res.status(500).json({ result: false, message: "Error updating service", error: error.message });
    }
});

router.put("/updateDepartmentInServiceModel/:departmentName", async (req, res) => {
    const { departmentName } = req.params;
    const { updatedDepartmentName } = req.body;

    // console.log("Old department name in service model :", departmentName);
    // console.log("UPdated department name in service model :", updatedDepartmentName);

    try {
        const updateDepartment = await ServicesModel.updateMany(
            { departmentName: departmentName },
            { $set: { departmentName: updatedDepartmentName } }
        );
        res.status(200).json({ result: true, message: "Department name updated successfully", data: updateDepartment });
    } catch (error) {
        res.status(500).json({ result: false, message: "Error updating department name", error: error });
    }
});

router.put("/updateServiceInServiceModel/:serviceName", async (req, res) => {
    const { serviceName } = req.params;
    const { updatedDepartmentName, updatedServiceName } = req.body;

    // console.log("Old service name in department model :", serviceName);
    // console.log("Updated department name in department model :", updatedDepartmentName);
    // console.log("Updated service name in department model :", updatedServiceName);

    try {
        const updateService = await ServicesModel.findOneAndUpdate(
            { serviceName: serviceName },
            { $set: { departmentName: updatedDepartmentName, serviceName: updatedServiceName } }
        );
        res.status(200).json({ result: true, message: "Service name updated successfully", data: updateService });
    } catch (error) {
        res.status(500).json({ result: false, message: "Error updating service name", error: error });
    }
});

router.delete("/deleteServiceFromServiceModel/:serviceName", async (req, res) => {
    const { serviceName } = req.params;
    try {
        const deletedService = await ServicesModel.findOneAndDelete(
            { serviceName: serviceName });
        res.status(200).json({ result: true, message: "Service successfully deleted", data: deletedService });
    } catch (error) {
        res.status(500).json({ result: false, message: "Error deleting service", error: error });
    }
});

module.exports = router;