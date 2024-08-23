const lastEmployeeIdModel = require("../models/LastEmployeeId");
const express = require("express");
const router = express.Router();

router.get(`/fetchLastEmployeeId`, async (req, res) => {
    try {
        const fetchedEmployeeId = await lastEmployeeIdModel.find();
        res.status(200).json({ result: true, message: "Id Successfully fetched", data: fetchedEmployeeId });
        if (fetchedEmployeeId.length === 0) {
            const defaultDocument = new lastEmployeeIdModel();
            await defaultDocument.save();
        }
    } catch (error) {
        res.status(500).json({ result: false, message: "Error fetching id", error: error });
    }
});

router.put('/changeLastEmployeeId', async (req, res) => {
    const { newEmployeeId } = req.body;
    try {
        const updateEmployeeId = await lastEmployeeIdModel.updateOne(
            {},  // Empty filter object to target the single existing document
            { $set: { lastEmployeeId: newEmployeeId } },  // Update the lastEmployeeId field
            { upsert: true }  // Ensure the document is created if it doesn't exist
        );

        res.status(200).json({ result: true, message: "Id Successfully updated", data: updateEmployeeId });
    } catch (error) {
        res.status(500).json({ result: false, message: "Error updating id", error: error });
    }
});

module.exports = router;