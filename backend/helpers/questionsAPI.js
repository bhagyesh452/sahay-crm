var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
const QuestionModel = require("../models/QuestionModel")


router.post("/post_form_data", async (req, res) => {
    try {
        const {
            question,
            option1,
            option2,
            option3,
            option4,
            correctOption,
            rightResponse,
            wrongResponse,
            slot,
        } = req.body;

        // Validate input
        if (
            !question ||
            !option1 ||
            !option2 ||
            !option3 ||
            !option4 ||
            correctOption === undefined ||
            !slot
        ) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Prepare the question object
        const questionData = {
            question,
            options: [option1, option2, option3, option4],
            correctOption: parseInt(correctOption),
            responses: {
                right: rightResponse,
                wrong: wrongResponse,
            },
        };

        // Find or create the slot
        let slotDocument = await QuestionModel.findOne({ slotIndex: slot });

        if (!slotDocument) {
            // Create a new slot if it doesn't exist
            slotDocument = new QuestionModel({
                slotIndex: slot,
                questions: [questionData],
            });
        } else {
            // Add question to the existing slot
            slotDocument.questions.push(questionData);
        }

        // Save the slot document
        await slotDocument.save();

        res.status(200).json({
            message: "Question added successfully",
            slot: slotDocument,
        });
    } catch (error) {
        console.error("Error adding question:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

router.get("/gets_all_questionData" , async(req,res)=>{
    try{
        const response = await QuestionModel.find({});
        res.status(200).json(response)
    }catch(error){
        res.status(500).json({message : "Internal Server Error"})
    }
})


module.exports = router;