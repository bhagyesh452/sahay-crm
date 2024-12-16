const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true ,unique:true},
    options: { type: [String], required: true },
    correctOption: { type: String, required: true }, // Index of the correct option
    responses: {
        right: { type: String },
        wrong: { type: String },
    },
    uploadedDate: { type: Date, default: Date.now },
});

const slotSchema = new mongoose.Schema({
    slotIndex: {
        type: String,
        required: true,
        unique:true
    },
    slotUploadDate: { type: Date, default: Date.now },
    questions: [questionSchema], // Embed the questions schema here
});

const QuestionModel = mongoose.model('AdminExcerciseQuestion', slotSchema);
module.exports = QuestionModel;