const DepartmentModel = require("../models/DepartmentModel");
const express = require("express");
const router = express.Router();

router.post("/addDepartment", async (req, res) => {
    try {
        const { departmentName, serviceName, serviceDescription } = req.body;
        const newDepartment = new DepartmentModel({
            departmentName: departmentName,
            serviceName: serviceName,
            serviceDescription: serviceDescription
        });

        // Save the department to the database
        const data = await newDepartment.save();
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

module.exports = router;