var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
const QuestionModel = require("../models/QuestionModel")


router.post("/post_form_data", async (req, res) => {
    try {
        console.log("Received request body:", req.body);

        const { question, options, correctOption, rightResponse, wrongResponse, slot } = req.body;

        // Validate input
        if (!question || !options || options.length !== 4 || !correctOption || !slot) {
            console.log("Validation failed: Missing required fields.");
            return res.status(400).json({ message: "Missing required fields." });
        }

        // Validate correctOption
        if (!options.includes(correctOption)) {
            console.log(`Validation failed: Correct option '${correctOption}' is not in options`, options);
            return res.status(400).json({ message: "Correct option must match one of the provided options." });
        }

        console.log("Validation successful. Checking for existing question...");

        // Check if question already exists in the slot
        let existingQuestion = await QuestionModel.findOne({
            slotIndex: slot,
            "questions.question": question,
        });

        if (existingQuestion) {
            console.log(`Duplicate question detected in slot '${slot}':`, question);
            return res.status(400).json({ message: "This question already exists in the slot." });
        }

        console.log("Question is unique. Preparing question data...");

        // Prepare question data
        const questionData = {
            question,
            options,
            correctOption,
            responses: {
                right: rightResponse,
                wrong: wrongResponse,
            },
        };

        console.log("Prepared question data:", questionData);

        // Find or create the slot
        let slotDocument = await QuestionModel.findOne({ slotIndex: slot });
        console.log("Slot document found:", slotDocument);

        if (!slotDocument) {
            console.log(`Slot '${slot}' not found. Creating new slot...`);
            slotDocument = new QuestionModel({
                slotIndex: slot,
                questions: [questionData],
            });
        } else {
            console.log(`Slot '${slot}' exists. Adding question to slot...`);
            slotDocument.questions.push(questionData);
        }

        console.log("Saving slot document...");
        await slotDocument.save();

        console.log("Slot document saved successfully:", slotDocument);

        res.status(200).json({
            message: "Question added successfully.",
            slot: slotDocument,
        });
    } catch (error) {
        console.error("Error during request processing:", error);
        res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
});





router.get("/gets_all_questionData", async (req, res) => {
    try {
        const response = await QuestionModel.find({});
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
})


module.exports = router;