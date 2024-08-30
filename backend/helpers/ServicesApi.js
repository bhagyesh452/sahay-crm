const express = require("express");
const router = express.Router();
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

router.get("/fetchServices", async (req, res) => {
    try {
        const services = await ServicesModel.find();
        res.status(200).json({result: true, message: "Services successfully fetched", data: services});
    } catch (error) {
        res.status(500).json({result: false, message: "Error fetching services", error: error});
    }
});

router.get("/fetchServiceFromServiceName/:serviceName", async (req, res) => {
    const {serviceName} = req.params;
    try {
        const service = await ServicesModel.findOne({serviceName: serviceName});
        res.status(200).json({result: true, message: "Service successfully fetched", data: service});
    } catch (error) {
        res.status(500).json({result: false, message: "Error fetching service", error: error});
    }
});

module.exports = router;