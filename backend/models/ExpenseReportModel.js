const mongoose = require("mongoose");

const ExpenseReportSchema = new mongoose.Schema({
    companyName: {
        type: String,
    },
    serviceName: {
        type: String
    },
    bookingDate: {
        type: Date
    },
    totalPayment: {
        type: String
    },
    receivedPayment: {
        type: String
    },
    remainingPayment: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

const ExpenseReportModel = mongoose.model('ExpenseReport', ExpenseReportSchema);
module.exports = ExpenseReportModel;