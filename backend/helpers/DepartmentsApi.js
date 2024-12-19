const DepartmentsModel = require("../models/DepartmentsModel");
const express = require("express");
const router = express.Router();


//api to add department
router.post("/addDepartment", async (req, res) => {
    try {
        const {departmentName} = req.body;

         // Create a new department
         const newDepartment = new DepartmentsModel({ departmentName });

         // Save to the database
         const savedDepartment = await newDepartment.save();

        res.status(200).json({ result: true, message: "Department Successfully Added", data: savedDepartment });
    } catch (error) {
        res.status(500).json({ result: false, message: "Error adding department", error: error });
    }
});

//api to get unique departments
router.get("/getDepartments", async (req, res) => {
    try {
        const uniqueDepartments = await DepartmentsModel.distinct("departmentName");

        res.status(200).json({
            result: true,
            message: "Departments retrieved successfully",
            data: uniqueDepartments
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ result: false, message: "Error in getting departments", error: error });
    }
});

module.exports = router;
