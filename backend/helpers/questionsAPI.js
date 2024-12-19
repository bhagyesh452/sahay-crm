var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
const QuestionModel = require("../models/QuestionModel");
const multer = require("multer");
const xlsx = require("xlsx");
const EmployeeQuestionModel = require("../models/EmployeeQuestionModel")
const adminModel = require("../models/Admin");

// Middleware for handling Excel uploads
const upload = multer({ storage: multer.memoryStorage() });

router.post("/post_form_data", async (req, res) => {
    const socketIO = req.io;
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
        // Trim correctOption for clean formatting
        const trimmedCorrectOption = correctOption.trim();
        // Ensure wrongResponse starts correctly and append correctOption
        let updatedWrongResponse = wrongResponse.trim();

        // Define the standardized correct answer message
        const correctAnswerMessage = `❌ Your answer is incorrect. The correct answer is "${trimmedCorrectOption}".`;

        // // Remove ❌ or similar symbols and duplicate instances of the correctAnswerMessage
        //updatedWrongResponse = updatedWrongResponse.replace(/❌.*Your answer is incorrect\..*?<\/strong><\/p>/g, "").trim();

        // Define the regex to match only the "Your answer is incorrect" part
        const incorrectAnswerRegex = /❌.*Your answer is incorrect\..*?<\/p>/i;

        if (incorrectAnswerRegex.test(wrongResponse)) {
            // Remove only the incorrect answer part without touching other content
            updatedWrongResponse = wrongResponse.replace(incorrectAnswerRegex, "").trim();

            // Append the updated correctAnswerMessage
            updatedWrongResponse = `${correctAnswerMessage} ${updatedWrongResponse}`;
        } else {
            // If no "Your answer is incorrect" part exists, leave it unchanged
            updatedWrongResponse = wrongResponse;
        }


        console.log("wrongResponse", wrongResponse)
        console.log("updatedWrong", updatedWrongResponse)

        // Prepare question data
        const questionData = {
            question,
            options,
            correctOption,
            responses: {
                right: rightResponse,
                wrong: updatedWrongResponse,
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
        socketIO.emit(`excel_submitted`);
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
    const socketIO = req.io;
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
            let option1 = row['Option 1'];
            let option2 = row['Option 2'];
            let option3 = row['Option 3'];
            let option4 = row['Option 4'];
            let correctOption = row['Correct Option'];
            const rightResponse = row['Right Response'];
            const wrongResponse = row['Wrong Response'];

            // Convert numeric options back to string if they represent percentages
            const formatOption = (option) => {
                if (typeof option === 'number' && option >= 0 && option <= 1) {
                    // Convert fractions back to percentage format
                    return `${option * 100}%`;
                }
                return String(option).trim(); // Otherwise, return as string
            };

            option1 = formatOption(option1);
            option2 = formatOption(option2);
            option3 = formatOption(option3);
            option4 = formatOption(option4);
            correctOption = formatOption(correctOption); // Format correctOption consistently
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
            // Ensure Correct Option is a string and trim it
            const trimmedCorrectOption = String(row['Correct Option'] || "").trim();

            // Ensure Wrong Response is a string and trim it
            let updatedWrongResponse = String(row['Wrong Response'] || "").trim();

            // Remove ❌ or similar symbols if present
            if (updatedWrongResponse.startsWith("❌")) {
                updatedWrongResponse = updatedWrongResponse.substring(1).trim(); // Remove the cross symbol
            }

            // Check if the response already includes "Your answer is incorrect."
            if (updatedWrongResponse.startsWith("Your answer is incorrect.")) {
                // Check if it already includes the correct option
                if (!updatedWrongResponse.includes(trimmedCorrectOption)) {
                    updatedWrongResponse = `❌ Your answer is incorrect. The correct answer is "${trimmedCorrectOption}".` + updatedWrongResponse.substring("Your answer is incorrect.".length).trim();
                }
            } else {
                // Append the correct answer to the message
                updatedWrongResponse = `❌ Your answer is incorrect. The correct answer is "${trimmedCorrectOption}".` + (updatedWrongResponse ? ` ${updatedWrongResponse}` : "");
            }

            console.log("Original Wrong Response:", row['Wrong Response']);
            console.log("Updated Wrong Response:", updatedWrongResponse);
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
                    wrong: updatedWrongResponse,
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
        socketIO.emit(`excel_submitted`);
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

router.get("/available-slots", async (req, res) => {
    try {
        const slots = await QuestionModel.find({});
        const employees = await adminModel.find({}).select("ename email newDesignation _id number").lean();

        if (employees.length === 0) {
            return res.status(400).json({ message: "No employees found. Add employees to proceed." });
        }

        // Ensure all employees are initialized in EmployeeQuestionModel without duplicates
        const bulkOperations = [];
        for (const employee of employees) {
            bulkOperations.push({
                updateOne: {
                    filter: { email: employee.email }, // Match by email
                    update: {
                        $setOnInsert: {
                            name: employee.ename,
                            email: employee.email,
                            number: employee.number,
                            empId: employee._id,
                            assignedQuestions: [],
                        },
                    },
                    upsert: true, // Insert only if the document does not exist
                },
            });
        }

        // Perform bulk write operation to avoid duplicate entries
        await EmployeeQuestionModel.bulkWrite(bulkOperations);

        // Fetch all EmployeeQuestionModel entries
        const employeeQuestionData = await EmployeeQuestionModel.find({});

        // Check slot availability for every employee
        const slotAvailability = employees.map((employee) => {
            const employeeData = employeeQuestionData.find((e) => e.empId.toString() === employee._id.toString());
            const assignedQuestions = employeeData?.assignedQuestions || [];

            const availableSlots = slots.map((slot) => {
                const questionIds = slot.questions.map((q) => q._id.toString());

                const askedQuestions = assignedQuestions
                    .filter((q) => q.slotId.toString() === slot._id.toString())
                    .map((q) => q.questionId.toString());

                const unaskedQuestions = questionIds.filter((qId) => !askedQuestions.includes(qId));

                return {
                    slotId: slot._id,
                    slotIndex: slot.slotIndex.toUpperCase(),
                    isAvailable: unaskedQuestions.length > 0,
                };
            });

            return {
                employeeId: employee._id,
                employeeName: employee.ename,
                availableSlots: availableSlots.filter((slot) => slot.isAvailable), // Only send available slots
            };
        });

        res.status(200).json({ slotAvailability: slotAvailability }); // Send the array directly
    } catch (error) {
        console.error("Error fetching available slots:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

router.post("/push-questions", async (req, res) => {
    const socketIO = req.io;
    console.log("Processing push-questions...");
    try {
        const { assignedSlots } = req.body; // Map of employeeId -> slotId
        if (!assignedSlots || Object.keys(assignedSlots).length === 0) {
            return res.status(400).json({ message: "No slots assigned." });
        }

        const employeeIds = Object.keys(assignedSlots); // Extract employee IDs
        const employees = await adminModel.find({ _id: { $in: employeeIds } }); // Fetch employees

        const updates = []; // Array to store save operations

        for (const employee of employees) {
            const slotId = assignedSlots[employee._id.toString()]; // Match slotId with employee
            if (!slotId) {
                console.log(`No slotId assigned for employee: ${employee._id}`);
                continue; // Skip this employee if no slot is assigned
            }

            const slot = await QuestionModel.findById(slotId); // Fetch slot data
            if (!slot) {
                console.log(`Slot not found for slotId: ${slotId}`);
                continue; // Skip if slot doesn't exist
            }

            const employeeData = await EmployeeQuestionModel.findOne({ empId: employee._id }); // Fetch employee data
            if (!employeeData) {
                console.log(`No EmployeeQuestionModel found for employee: ${employee._id}`);
                continue; // Skip if employee data is not found
            }

            // Extract asked questions for this slot
            const askedQuestions = employeeData.assignedQuestions
                .filter((q) => q.slotId.toString() === slotId.toString())
                .map((q) => q.questionId.toString());

            // Get unasked questions
            const unaskedQuestions = slot.questions
                .map((q) => q._id.toString())
                .filter((qId) => !askedQuestions.includes(qId));

            if (unaskedQuestions.length === 0) {
                console.log(`No unasked questions available for employee: ${employee._id} in slot: ${slotId}`);
                continue; // Skip if no new questions are available
            }

            // Assign a random unasked question
            const randomIndex = Math.floor(Math.random() * unaskedQuestions.length);
            const questionToAssign = unaskedQuestions[randomIndex];
            const questionDetails = slot.questions.find((q) => q._id.toString() === questionToAssign);

            // Add question to assignedQuestions
            employeeData.assignedQuestions.push({
                slotIndex: slot.slotIndex,
                slotId: slot._id,
                questionId: questionToAssign,
                question: questionDetails.question,
                options: questionDetails.options,
                correctOption: questionDetails.correctOption,
                responses: questionDetails.responses,
                dateAssigned: new Date(),
                questionAnswered: false,
            });

            socketIO.emit(`question_assigned`, {
                id: employee._id, // Unique employee ID
                ename: employee.ename, // Employee name
                data: {
                    questionId: questionToAssign,
                    question: questionDetails.question, // Question text
                    options: questionDetails.options, // Question options
                    correctOption: questionDetails.correctOption, // Correct answer
                    responses: questionDetails.responses, // Any additional responses
                },
            });

            updates.push(employeeData.save()); // Add save operation to updates
        }

        await Promise.all(updates); // Save all updates concurrently

        res.status(200).json({ message: "Questions successfully assigned to employees." });
    } catch (error) {
        console.error("Error assigning questions:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

router.post("/submit-answer", async (req, res) => {
    const socketIO = req.io;
    try {
        const { empId, questionId, selectedAnswer } = req.body;
        console.log(req.body)

        if (!empId || !questionId || !selectedAnswer) {
            return res.status(400).json({ message: "Invalid data provided." });
        }

        // Find the employee document
        const employee = await EmployeeQuestionModel.findOne({ empId });

        if (!employee) {
            return res.status(404).json({ message: "Employee not found." });
        }

        // Locate the specific question within the assignedQuestions array
        const assignedQuestion = employee.assignedQuestions.find(
            (q) => q.questionId.toString() === questionId
        );

        if (!assignedQuestion) {
            return res.status(404).json({ message: "Question not found for this employee." });
        }

        // Trim both correctOption and selectedAnswer to handle spaces
        const trimmedCorrectOption = assignedQuestion.correctOption.trim();
        const trimmedSelectedAnswer = selectedAnswer.trim();

        // Update the answer and check correctness
        assignedQuestion.answerGiven = trimmedSelectedAnswer;
        assignedQuestion.questionAnswered = true;
        assignedQuestion.dateAnswered = new Date();
        assignedQuestion.isCorrect = trimmedCorrectOption === trimmedSelectedAnswer;

        // Save the updated employee document
        await employee.save();
        socketIO.emit(`employee_answer_submitted`);
        // Return feedback response
        return res.status(200).json({
            isCorrect: assignedQuestion.isCorrect,
            response: assignedQuestion.isCorrect
                ? assignedQuestion.responses.right || "Correct Answer!"
                : assignedQuestion.responses.wrong || "Wrong Answer. Try Again!",
        });
    } catch (error) {
        console.error("Error submitting answer:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// GET: Fetch responses for a specific question
router.get("/question-responses/:questionId", async (req, res) => {
    const { questionId } = req.params;

    try {
        // Fetch employees who answered the specific question
        const employeesWithAnswers = await EmployeeQuestionModel.find({
            "assignedQuestions.questionId": questionId,
        }).select("name assignedQuestions");

        // Process data to filter relevant question responses
        const responseList = [];
        employeesWithAnswers.forEach((employee) => {
            const question = employee.assignedQuestions.find(
                (q) => q.questionId.toString() === questionId
            );
            if (question) {
                responseList.push({
                    employeeName: employee.name,
                    answerGiven: question.answerGiven || "No Answer",
                    dateAnswered: question.dateAssigned,
                    isCorrect: question.isCorrect
                });
            }
        });

        // Send response
        if (responseList.length > 0) {
            res.status(200).json(responseList);
        } else {
            res.status(200).json([]); // No responses found
        }
    } catch (error) {
        console.error("Error fetching question responses:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/question-all-response", async (req, res) => {
    try {
        const data = await EmployeeQuestionModel.find({});
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post("/delete-question", async (req, res) => {
    const socketIO = req.io;
    try {
        const { questionId, slotIndex } = req.body;
        console.log(req.body)

        if (!questionId || !slotIndex) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // Find the slot document
        const slotDocument = await QuestionModel.findOne({ slotIndex });
        if (!slotDocument) {
            return res.status(404).json({ message: "Slot not found." });
        }

        // Find the question in the slot
        const questionIndex = slotDocument.questions.findIndex(
            (q) => q._id.toString() === questionId
        );

        if (questionIndex === -1) {
            return res.status(404).json({ message: "Question not found in the slot." });
        }

        // Remove the question from the QuestionModel
        slotDocument.questions.splice(questionIndex, 1);
        await slotDocument.save();

        // Update EmployeeQuestionModel
        await EmployeeQuestionModel.updateMany(
            { "assignedQuestions.questionId": questionId },
            { $set: { "assignedQuestions.$[elem].isDeletedQuestion": true } },
            { arrayFilters: [{ "elem.questionId": questionId }] }
        );
        socketIO.emit(`excel_submitted`);
        res.status(200).json({ message: "Question deleted successfully and marked as deleted in employee records." });
    } catch (error) {
        console.error("Error deleting question:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

router.put("/update-question", async (req, res) => {
    console.log("Incoming Request Body:", req.body);
    const socketIO = req.io;
    try {
        const { questionId, slot, question, options, correctOption, rightResponse, wrongResponse } = req.body;

        // Debugging individual fields
        if (!questionId) {
            return res.status(400).json({ message: "Missing required field: questionId" });
        }
        if (!slot) {
            return res.status(400).json({ message: "Missing required field: slot" });
        }
        if (!question) {
            return res.status(400).json({ message: "Missing required field: question" });
        }
        if (!options) {
            return res.status(400).json({ message: "Missing required field: options" });
        }
        if (options.length !== 4) {
            return res.status(400).json({ message: "Options must be an array of exactly 4 items" });
        }
        if (!correctOption) {
            return res.status(400).json({ message: "Missing required field: correctOption" });
        }
        if (!rightResponse) {
            return res.status(400).json({ message: "Missing required field: rightResponse" });
        }
        if (!wrongResponse) {
            return res.status(400).json({ message: "Missing required field: wrongResponse" });
        }

        // Find the slot document
        const slotDocument = await QuestionModel.findOne({ slotIndex: slot });
        if (!slotDocument) {
            return res.status(404).json({ message: "Slot not found." });
        }

        // Find the question in the slot
        const questionIndex = slotDocument.questions.findIndex((q) => q._id.toString() === questionId);
        if (questionIndex === -1) {
            return res.status(404).json({ message: "Question not found in the slot." });
        }

        const oldCorrectOption = slotDocument.questions[questionIndex].correctOption;

        // Update the question in the QuestionModel
        slotDocument.questions[questionIndex] = {
            ...slotDocument.questions[questionIndex].toObject(),
            question,
            options,
            correctOption,
            responses: {
                right: rightResponse,
                wrong: wrongResponse,
            },
        };

        await slotDocument.save();

        // Update the question in the EmployeeQuestionModel
        const employees = await EmployeeQuestionModel.find({
            "assignedQuestions.questionId": questionId,
        });

        for (const employee of employees) {
            employee.assignedQuestions.forEach((q) => {
                if (q.questionId.toString() === questionId) {
                    // Update all fields of the question
                    q.question = question;
                    q.options = options;
                    q.correctOption = correctOption;
                    q.responses = {
                        right: rightResponse,
                        wrong: wrongResponse,
                    };

                    // If the correct option has changed, update isCorrect but keep answerGiven intact
                    if (oldCorrectOption !== correctOption) {
                        q.isCorrect = q.answerGiven === correctOption;
                    }
                }
            });

            // Save the updated employee document
            await employee.save();
        }

        // Handle recreated questions with new IDs
        const recreatedEmployees = await EmployeeQuestionModel.find({
            "assignedQuestions.question": question, // Match recreated question by content
        });

        for (const employee of recreatedEmployees) {
            employee.assignedQuestions.forEach((q) => {
                if (q.question === question && q.questionId.toString() !== questionId) {
                    // Update the questionId to the new one
                    q.questionId = questionId;

                    // Update all other fields
                    q.options = options;
                    q.correctOption = correctOption;
                    q.responses = {
                        right: rightResponse,
                        wrong: wrongResponse,
                    };

                    // Recalculate isCorrect based on the new correctOption
                    q.isCorrect = q.answerGiven === correctOption;
                }
            });

            // Save the updated employee document
            await employee.save();
        }
        socketIO.emit(`excel_submitted`);
        res.status(200).json({ message: "Question updated successfully, and changes propagated to employees." });
    } catch (error) {
        console.error("Error updating question:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

router.get("/questions/unanswered/:empId", async (req, res) => {
    console.log("Received request to fetch the latest unanswered question for employee:", req.params.empId);
    try {
        const { empId } = req.params;

        // Find the employee data and filter for unanswered questions
        const employeeData = await EmployeeQuestionModel.findOne({
            empId: empId,
            "assignedQuestions.questionAnswered": false,
        });

        if (!employeeData) {
            console.log("No unanswered questions found for the employee.");
            return res.status(404).json({ message: "No unanswered questions found." });
        }

        // Extract the first unanswered question
        const latestUnansweredQuestion = employeeData.assignedQuestions
            .filter((q) => !q.questionAnswered && !q.isDeletedQuestion) // Filter unanswered and non-deleted questions
            .sort((a, b) => new Date(b.dateAssigned) - new Date(a.dateAssigned))[0]; // Get the latest by dateAssigned

        if (!latestUnansweredQuestion) {
            console.log("No unanswered questions available.");
            return res.status(404).json({ message: "No unanswered questions available." });
        }

        // Prepare the response structure
        const response = {
            id: employeeData._id, // Employee record ID
            ename: employeeData.name, // Employee name
            data: {
                questionId: latestUnansweredQuestion.questionId,
                question: latestUnansweredQuestion.question, // Question text
                options: latestUnansweredQuestion.options, // Question options
                correctOption: latestUnansweredQuestion.correctOption, // Correct answer
                responses: latestUnansweredQuestion.responses, // Right and Wrong responses
            },
        };

        console.log("Latest unanswered question:", response);
        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching unanswered questions:", error);
        res.status(500).json({ message: "Error fetching unanswered questions", error });
    }
});




module.exports = router;