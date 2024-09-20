const ExpenseReportModel = require("../models/ExpenseReportModel");
const express = require("express");
const router = express.Router();

router.get("/fetchExpenseReports", async (req, res) => {
    try {
        const { serviceName, companyName } = req.query;

        // Build the query object dynamically based on filter criteria
        let query = {};

        if (serviceName) {
            query.serviceName = {
                $regex: new RegExp(serviceName, "i") // Case-insensitive regex search
            };
        }

        if (companyName) {
            query.companyName = {
                $regex: new RegExp(companyName, "i") // Case-insensitive regex search
            };
        }

        // Fetch the data based on the query
        const expenseReports = await ExpenseReportModel.find(query);

        // Return the filtered/searched data
        res.status(200).json({ result: true, message: "Expense report successfully fetched", data: expenseReports });
    } catch (error) {
        res.status(500).json({ result: false, message: "Error fetching expense report", error: error });
    }
});

router.put("/updateExpenseReportDeleteField/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const updatedExpenseReport = await ExpenseReportModel.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true } // Returns the updated document
        );
        
        res.status(200).json({ result: true, message: "Expense report successfully updated", data: updatedExpenseReport });
    }
    catch (error) {
        res.status(500).json({ result: false, message: "Error updating expense report", error: error });
    }
});

module.exports = router;