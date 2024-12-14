var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
const QuestionModel = require("../models/QuestionModel");
const multer = require("multer");
const xlsx = require("xlsx");
const EmployeeQuestionModel = require("../models/EmployeeQuestionModel")

// Middleware for handling Excel uploads
const upload = multer({ storage: multer.memoryStorage() });

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

router.post("/upload-questions_excel", upload.single("file"), async (req, res) => {
    try {
        const { slot } = req.body;

        if (!slot) {
            console.log("Slot not provided.");
            return res.status(400).json({ message: "Slot is required." });
        }

        const file = req.file;
        if (!file) {
            console.log("Excel file not provided.");
            return res.status(400).json({ message: "Excel file is required." });
        }

        // Parse Excel file
        console.log("Parsing Excel file...");
        const workbook = xlsx.read(file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        console.log("Excel data parsed:", data);

        let skippedDuplicates = 0;
        let skippedInvalid = 0;
        const validQuestions = [];

        for (const [index, row] of data.entries()) {
            console.log(`Processing row ${index + 1}:`, row);
        
            // Map the Excel keys to match expected keys
            const question = row['Question'];
            const option1 = row['Option 1'];
            const option2 = row['Option 2'];
            const option3 = row['Option 3'];
            const option4 = row['Option 4'];
            const correctOption = row['Correct Option'];
            const rightResponse = row['Right Response'];
            const wrongResponse = row['Wrong Response'];
        
            // Validate fields
            if (!question || !option1 || !option2 || !option3 || !option4 || !correctOption) {
                console.log(`Row ${index + 1} skipped: Missing required fields.`);
                skippedInvalid++;
                continue;
            }
        
            const options = [option1, option2, option3, option4];
            if (!options.includes(correctOption)) {
                console.log(`Row ${index + 1} skipped: Correct option '${correctOption}' not in options.`, options);
                skippedInvalid++;
                continue;
            }
        
            // Check for duplicate questions in the database
            const exists = await QuestionModel.findOne({
                "questions.question": question,
            });
            if (exists) {
                console.log(`Row ${index + 1} skipped: Duplicate question detected.`, question);
                skippedDuplicates++;
                continue;
            }
        
            console.log(`Row ${index + 1} valid.`);
            validQuestions.push({
                question,
                options,
                correctOption,
                responses: {
                    right: rightResponse,
                    wrong: wrongResponse,
                },
            });
        }

        console.log("Valid questions prepared:", validQuestions);

        // Check if the total valid questions exceed the maximum allowed
        let slotDocument = await QuestionModel.findOne({ slotIndex: slot });
        if (!slotDocument) {
            console.log(`Slot '${slot}' not found. Creating new slot...`);
            slotDocument = new QuestionModel({ slotIndex: slot, questions: [] });
        }

        const currentQuestionCount = slotDocument.questions.length;
        console.log(`Current question count in slot '${slot}':`, currentQuestionCount);

        if (currentQuestionCount + validQuestions.length > 45) {
            console.log(`Cannot add ${validQuestions.length} questions. Slot capacity exceeded.`);
            return res.status(400).json({
                message: `Cannot add ${validQuestions.length} questions. The slot can only hold ${45 - currentQuestionCount} more questions.`,
            });
        }

        // Save valid questions to the slot
        console.log(`Adding ${validQuestions.length} questions to slot '${slot}'...`);
        slotDocument.questions.push(...validQuestions);
        await slotDocument.save();
        console.log(`Questions added successfully to slot '${slot}'.`);

        res.status(200).json({
            message: "Excel uploaded successfully.",
            totalUploaded: validQuestions.length,
            skippedInvalid,
            skippedDuplicates,
        });
    } catch (error) {
        console.error("Error processing Excel upload:", error);
        res.status(500).json({ message: "Internal Server Error", error });
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