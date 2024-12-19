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

const ServiceSchema = new mongoose.Schema({
    departmentName: {
        type: String
    },
    serviceName: {
        type: String
    },
    serviceDescription: {
        type: String
    },
    detailsPart: [ // Step 1 details
        {
            heading: { type: String },
            details: { type: String },
        }
    ],
    teamInfo: { // Step 2 details
        salesMarketingPersons: [{ type: String }],
        backendPersons: [{ type: String }],
        portfolio: [{ type: String }],
        documents: [fileSchema],
    },
});

const ServiceModel = mongoose.model('Service', ServiceSchema);
module.exports = ServiceModel;
