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
    serviceName: {
        type: String
    },
    bdeName:{
        type:String
    },
    bdmName:{
        type:String
    },
    addedOn:{
        type:Date
    }
}, {
    timestamps: true
})

const remarksSchema = new mongoose.Schema({
    employeeName: {
        type: String
    },
    designation: {
        type: String
    },
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
    bdmWork:{
        type:Boolean,
        default:false
    },
    addedOn:{
        type:Date
    }
}, {
    timestamps: true
})


const remarksHistorySchema = new mongoose.Schema({
    companyID: {
        type: String,
        required: true,
    },
    "Company Name": {
        type: String
    },
    serviceWiseRemarks: [serviceRemarksSchema],
    remarks: [remarksSchema]
}, {
    timestamps: true
})

// Model creation
const CompleteRemarksHistoryLeads = mongoose.model("CompleteRemarksHistoryLeads", remarksHistorySchema);

module.exports = CompleteRemarksHistoryLeads;