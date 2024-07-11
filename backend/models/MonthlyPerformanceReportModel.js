const mongoose = require('mongoose');

const targetDetailsSchema = new mongoose.Schema({
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

const PerformanceReportSchema = new mongoose.Schema({
    empId: {
        type: String
    },
    empName: {
        type: String
    },
    targetDetails: [targetDetailsSchema]    
});

const MonthlyPerformanceReportModel = mongoose.model('MonthlyPerformanceReport', PerformanceReportSchema);

module.exports = MonthlyPerformanceReportModel;