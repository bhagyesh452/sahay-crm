const mongoose = require('mongoose');

const PerformanceReportSchema = new mongoose.Schema({
    empId: {
        type: String
    },
    empName: {
        type: String
    },
    month: {
        type: String
    },
    target: {
        type: Number
    },
    achievement: {
        type: Number
    },
    ratio: {
        type: Number
    },
    result: {
        type: String
    }
});

const MonthlyPerformanceReportModel = mongoose.model('MonthlyPerformanceReport', PerformanceReportSchema);

module.exports = MonthlyPerformanceReportModel;