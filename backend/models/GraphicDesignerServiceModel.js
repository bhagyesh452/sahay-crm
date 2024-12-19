const mongoose = require("mongoose");

const GraphicDesignerServiceSchema = new mongoose.Schema({
    "Company Name": {
        type: String,
        required: true
    },
    "Company Number": {
        type: String,
        required: true
    },
    "Company Email": {
        type: String,
        required: true
    },
    "Company Incorporation Date  ": {
        type: Date
    },
    companyId: {
        type: String,
        required: true
    },
    bookingId: {
        type: String,
        required: true
    },
    serviceName: {
        type: String,
        required: true,
        unique: true
    },
    bookingDate: {
        type: Date,
        required: true
    },
    bookingNumber: {
        type: String,
        required: true
    },
    bookingNotes: {
        type: String
    },
    bookingDocuments: {
        type: [String]
    },
    caCase: {
        type: Boolean,
        default: false
    },
    caNumber: {
        type: String
    },
    bdeName: {
        type: String,
        required: true
    },
    bdmName: {
        type: String,
        required: true
    },
    graphicDesignerName: {
        type: String
    },
    graphicDesignerId: {
        type: String
    },
    graphicDesignerNumber: {
        type: String
    },
    graphicDesignerEmail: {
        type: String
    },
    contentWriterName: {
        type: String
    },
    contentWriterStatus: {
        type: String
    },
    contentDoneDate: {
        type: Date
    },
    businessInputStatus: {
        type: Boolean,
        default: false
    },
    businessInputStatusDate: {
        type: Date
    },
    mainCategoryStatus: {
        type: String,
        default: "General"
    },
    mainCategoryStatusChangeDate: {
        type: Date
    },
    previousMainCategoryStatus: {
        type: String,
    },
    previousMainCategoryStatusChangeDate: {
        type: Date
    },
    subCategoryStatus: {
        type: String,
        default: "Untouched"
    },
    subCategoryStatusChangeDate: {
        type: Date
    },
    previousSubCategoryStatus: {
        type: String,
    },
    previousSubCategoryStatusChangeDate: {
        type: Date
    },
    rmAssignDate: {
        type: Date
    },
    GraphicDesignerAcceptedDate: {
        type: Date
    },
    isAccepted: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String
    },
    remarks: {
        type: String
    }
});

const GraphicDesignerServiceModel = mongoose.model("GraphicDesignerServiceModel", GraphicDesignerServiceSchema);
module.exports = GraphicDesignerServiceModel;