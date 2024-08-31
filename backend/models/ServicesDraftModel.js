const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    fieldname: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    destination: String,
    filename: String,
    path: String,
    size: Number
});

const ServicesDraftSchema = new mongoose.Schema({
    activeStep: {
        type: String
    },
    departmentName: {
        type: String
    },
    serviceName: {
        type: String
    },
    objectives: {
        type: String
    },
    benefits: {
        type: String
    },
    requiredDocuments: {
        type: String
    },
    eligibilityRequirements: {
        type: String
    },
    process: {
        type: String
    },
    deliverables: {
        type: String
    },
    timeline: {
        type: String
    },
    concernTeam: {
        employeeNames: [String],  // Array of employee names
        headNames: [String]        // Array of head names
    },
    portfolio: {
        type: String
    },
    documents: {
        type: [fileSchema]
    }
});

const ServicesDraftModel = mongoose.model('ServicesDraft', ServicesDraftSchema);
module.exports = ServicesDraftModel;