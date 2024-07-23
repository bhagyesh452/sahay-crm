const mongoose = require("mongoose");

const PaymentApprovalRequestSchema = new mongoose.Schema({
    ename: {
        type: String,
    },
    designation: {
        type: String
    },
    branchOffice: {
        type: String
    },
    companyName: {
        type: String
    },
    serviceType: {
        type: [String] // Array of strings
    },
    minimumPrice: {
        type: Number
    },
    clientRequestedPrice: {
        type: Number
    },
    requestType: {
        type: String,
        //enum: ["Lesser Price", "Payment Term Change", "GST/Non-GST Issue"] // Array of strings
    },
    reason: {
        type: String
    },
    remarks: {
        type: String
    },
    adminRemarks: {
        type: String
    },
    attachments: {
        type: [String] // Array of strings
    },
    assigned: {
        type: String
    },
    requestDate: {
        type: Date
    }
});

const PaymentApprovalRequestModel = mongoose.model('PaymentApprovalRequest', PaymentApprovalRequestSchema);

module.exports = PaymentApprovalRequestModel;