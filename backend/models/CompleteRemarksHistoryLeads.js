const { timeStamp } = require("console");
const mongoose = require("mongoose");


const serviceRemarksSchema = new mongoose.Schema({
    companyID: {
        type: String,
        required: true,
    },
    "Company Name": {
        type: String
    },
    employeeName: {
        type: String
    },
    designation: {
        type: String
    },
    remarks: {
        type: String,
    },
    serviceName:{
        type:String
    },
},{
    timestamps:true
})

const remarksHistorySchema = new mongoose.Schema({
    companyID: {
        type: String,
        required: true,
    },
    "Company Name": {
        type: String
    },
    employeeName: {
        type: String
    },
    designation: {
        type: String
    },
    serviceWiseRemarks: [serviceRemarksSchema],
    remarks: {
        type: String,
    },
    bdmName: {
        type: String,
    },
    bdmRemarks: {
        type: String
    },
    bdeName: {
        type: String
    },

}, {
    timestamps: true
})

// Model creation
const CompleteRemarksHistoryLeads = mongoose.model("CompleteRemarksHistoryLeads", remarksHistorySchema);

module.exports = CompleteRemarksHistoryLeads;