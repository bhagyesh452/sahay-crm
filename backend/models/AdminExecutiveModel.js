const mongoose = require("mongoose");

const RemarksSchema = new mongoose.Schema({
    remarks: {
        type: String
    },
    updatedOn: {
        type: Date,
        default: new Date()
    },
    mainCategoryStatus: {
        type: String
    },
    subCategoryStatus: {
        type: String
    }
})

const AdminExecutiveServicesSchema = new mongoose.Schema({
    "Company Name": {
        type: String,
        required: true,
    },
    "Company Number": {
        type: Number,

    },
    "Company Email": {
        type: String,

    },
    panNumber: {
        type: String,

    },
    bdeName: {
        type: String,

    },
    bdeEmail: {
        type: String,
    },
    bdmName: {
        type: String,

    },
    bdmType: {
        type: String,
    },
    bookingDate: {
        type: String,

    },
    paymentMethod: {
        type: String,
    },
    caCase: {
        type: String,
    },
    caNumber: {
        type: Number,
    },
    caEmail: {
        type: String,
    },
    serviceName: {
        type: String,
        required: true,
    },
    totalPaymentWOGST: {
        type: Number,

    },
    totalPaymentWGST: {
        type: Number,

    },
    withGST: {
        type: Boolean
    },
    withDSC: {
        type: Boolean
    },
    paymentTerms: {
        type: String,
        required: true,
    },
    firstPayment: {
        type: Number,
    },
    secondPayment: {
        type: Number,
    },
    thirdPayment: {
        type: Number,
    },
    fourthPayment: {
        type: Number,
    },
    secondPaymentRemarks: {
        type: String,
    },
    thirdPaymentRemarks: {
        type: String,
    },
    fourthPaymentRemarks: {
        type: String,
    },
    pendingRecievedPayment: {
        type: Number,
    },
    pendingRecievedPaymentDate: {
        type: Date,
    },
    bookingPublishDate: {
        type: String,
    },
    mainCategoryStatus: {
        type: String,
        default: "General"
    },
    subCategoryStatus: {
        type: String,
        default: "Untouched"
    },
    addedOn: {
        type: Date,
        //default:new Date()
    },
    Remarks: [RemarksSchema],
    dscStatus: {
        type: String,
        default: "Not Started"
    },
    letterStatus: {
        type: String,
        default: "Not Started"
    },
    dscPortal: {
        type: String,
    },
    dscType: {
        type: String,
        default: "Not Applicable"
    },
    dscValidity: {
        type: String,
    },
    otpVerificationStatus: {
        type: String,
    },
    portalCharges: {
        type: Number
    },
    chargesPaidVia: {
        type: String
    },
    dscPhoneNo: {
        type: String
    },
    dscEmailId: {
        type: String
    },
    expenseReimbursementStatus: {
        type: String,
        default:"Unpaid"
    },
    expenseReimbursementDate: {
        type: Date
    },
    lastActionDate: {
        type: Date,
        default: new Date()
    },
    dateOfChangingMainStatus: {
        type: Date,
        default: new Date()
    },
    submittedOn: {
        type: Date
    },
    previousMainCategoryStatus: {
        type: String,
        default: "General"
    },
    previousSubCategoryStatus: {
        type: String,
        default: "Not Started"
    },
    approvalTime:{
        type:Date
    },
    tokenStoredInBox:{
        type:String
    },
    courierStatus:{
        type:String
    },
    otpInboxNo:{
        type:String
    },
});

const AdminExecutiveModel = mongoose.model("AdminExecutiveModel", AdminExecutiveServicesSchema)

module.exports = AdminExecutiveModel;