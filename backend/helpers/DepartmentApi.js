const DepartmentModel = require("../models/DepartmentModel");
const express = require("express");
const router = express.Router();

router.post("/addDepartment", async (req, res) => {
    try {
        const { departmentName, serviceName, serviceDescription } = req.body;

        // Check if department already exists
        const existingDepartment = await DepartmentModel.findOne({ departmentName });

        let data;
        if (existingDepartment && !existingDepartment.serviceName) {
            // If department exists but with default values, update it with new service details
            existingDepartment.serviceName = serviceName;
            existingDepartment.serviceDescription = serviceDescription;
            data = await existingDepartment.save();
        } else {
            // Otherwise, create a new department
            const newDepartment = new DepartmentModel({
                departmentName: departmentName,
                serviceName: serviceName || "",
                serviceDescription: serviceDescription || "",
            });
            data = await newDepartment.save();
        }

        res.status(200).json({ result: true, message: "Department Successfully Added", data: data });
    } catch (error) {
        res.status(500).json({ result: false, message: "Error adding department", error: error });
    }
});

router.get("/fetchDepartments", async (req, res) => {
    try {
        const data = await DepartmentModel.find();
        res.status(200).json({ result: true, message: "Department Successfully Fetched", data: data });
    } catch (error) {
        res.status(500).json({ result: false, message: "Error fetching department", error: error });
    }
});

router.get("/fetchServicesByDepartment", async (req, res) => {
    const { departmentName } = req.query; // Use query instead of params
    // console.log("Department name is :", departmentName);
    try {
        const data = await DepartmentModel.find({ departmentName: departmentName });

        if (!data) {
            return res.status(404).json({ result: false, message: "Department not found" });
        }

        res.status(200).json({ result: true, message: "Services successfully fetched", data: data });
    } catch (error) {
        res.status(500).json({ result: false, message: "Error fetching services", error: error.message });
    }
});

router.get("/fetchServicesByDepartment/:activeDepartment", async (req, res) => {
    const { activeDepartment } = req.params; // Use query instead of params
    // console.log("Department name is :", activeDepartment);
    try {
        const decodedDepartmentName = decodeURIComponent(activeDepartment);
        const data = await DepartmentModel.find({
            $or: [
                { departmentName: decodedDepartmentName }, // Exact match
                { departmentName: decodedDepartmentName.replace(/-/g, "/") } // Handle alternate names
            ]
        });

        if (!data) {
            return res.status(404).json({ result: false, message: "Department not found" });
        }

        res.status(200).json({ result: true, message: "Services successfully fetched", data: data });
    } catch (error) {
        res.status(500).json({ result: false, message: "Error fetching services", error: error.message });
    }
});

router.get("/fetchService/:serviceName", async (req, res) => {
    const { serviceName } = req.params; // Use query instead of params
    // console.log("Service name is :", serviceName);
    try {
        const data = await DepartmentModel.findOne({ serviceName: serviceName });

        if (!data) {
            return res.status(404).json({ result: false, message: "Service not found" });
        }

        res.status(200).json({ result: true, message: "Service successfully fetched", data: data });
    } catch (error) {
        res.status(500).json({ result: false, message: "Error fetching services", error: error.message });
    }
});

router.put("/updateServiceHideStatus/:serviceName", async (req, res) => {
    const { serviceName } = req.params;
    const { hideService } = req.body;  // Expecting the new hideService status

    try {
        const updatedService = await DepartmentModel.findOneAndUpdate(
            { serviceName },
            { hideService },
            { new: true }  // Return the updated document
        );

        if (!updatedService) {
            return res.status(404).json({ result: false, message: "Service not found" });
        }

        res.status(200).json({ result: true, message: "Service hide status updated", data: updatedService });
    } catch (error) {
        res.status(500).json({ result: false, message: "Error updating service hide status", error: error.message });
    }
});

router.put("/updateDepartmentInDepartmentModel/:departmentName", async (req, res) => {
    const {departmentName} = req.params;
    const {updatedDepartmentName} = req.body;

    // console.log("Old department name in department model :", departmentName);
    // console.log("UPdated department name in department model :", updatedDepartmentName);

    try {
        const decodedDepartmentName = decodeURIComponent(departmentName);
        const updateDepartment = await DepartmentModel.updateMany(
            { departmentName: decodedDepartmentName },
            { $set: { departmentName: updatedDepartmentName } }
        );
        res.status(200).json({result: true, message: "Department name updated successfully", data: updateDepartment});
    } catch (error) {
        res.status(500).json({result: false, message: "Error updating department name", error: error});
    }
});

router.put("/updateServiceInDepartmentModel/:serviceName", async (req, res) => {
    const {serviceName} = req.params;
    const {updatedDepartmentName, updatedServiceName, updatedServiceDescription} = req.body;

    // console.log("Old service name in department model :", serviceName);
    // console.log("Updated department name in department model :", updatedDepartmentName);
    // console.log("Updated service name in department model :", updatedServiceName);
    // console.log("Updated service description in department model :", updatedServiceDescription);

    try {
        const decodedServiceName = decodeURIComponent(serviceName);
        const updateService = await DepartmentModel.findOneAndUpdate(
            { serviceName: decodedServiceName },
            { $set: { departmentName: updatedDepartmentName, serviceName: updatedServiceName, serviceDescription: updatedServiceDescription } }
        );
        res.status(200).json({result: true, message: "Service name updated successfully", data: updateService});
    } catch (error) {
        res.status(500).json({result: false, message: "Error updating service name", error: error});
    }
});

// Deleting service from service name :
router.delete("/deleteServiceFromDepartmentModelUsingServiceName/:serviceName", async (req, res) => {
    const {serviceName} = req.params;
    try {
        const decodedServiceName = decodeURIComponent(serviceName);
        const deletedService = await DepartmentModel.findOneAndDelete({
            $or: [
                { serviceName: decodedServiceName }, // Exact match
                { serviceName: decodedServiceName.replace(/-/g, "/") } // Handle alternate names
            ]
        });
        res.status(200).json({result: true, message: "Service successfully deleted", data: deletedService});
    } catch (error) {
        res.status(500).json({result: false, message: "Error deleting service", error: error});
    }
});

// Deleting service from department name :
router.delete("/deleteServiceFromDepartmentModelUsingDepartmentName/:departmentName", async (req, res) => {
    const {departmentName} = req.params;
    
    try {
        const decodedDepartmentName = decodeURIComponent(departmentName);
        const deletedService = await DepartmentModel.findOneAndDelete({
            $or: [
                { departmentName: decodedDepartmentName }, // Exact match
                { departmentName: decodedDepartmentName.replace(/-/g, "/") } // Handle alternate names
            ]
        });
        res.status(200).json({result: true, message: "Department successfully deleted", data: deletedService});
    } catch (error) {
        res.status(500).json({result: false, message: "Error deleting department", error: error});
    }
});

module.exports = router;