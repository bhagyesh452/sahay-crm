const mongoose = require('mongoose');


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

const RMCertificationServicesSchema = new mongoose.Schema({
  "Company Name": {
    type: String,
  },
  "Company Number": {
    type: Number,
  },
  "Company Email": {
    type: String,
  },
  caNumber: {
    type: Number,
  },
  serviceName: {
    type: String,
    required: true,
  },
  mainCategoryStatus: {
    type: String,
    default: "General"
  },
  subCategoryStatus: {
    type: String,
    default: "Untouched"
  },
  websiteLink: {
    type: String
  },
  withDSC: {
    type: Boolean
  },
  letterStatus: {
    type: String,
    default: "Not Started"
  },
  dscStatus: {
    type: String,
    default: "Not Started"
  },
  contentWriter: {
    type: String,
    default: "RonakKumar"
  },
  contentStatus: {
    type: String,
    default: "Not Started"
  },
  nswsMobileNo: {
    type: String
  },
  nswsMailId: {
    type: String
  },
  nswsPaswsord: {
    type: String
  },
  City: {
    type: String,
  },
  State: {
    type: String
  },
  industry: {
    type: String
  },
  sector: {
    type: String
  },
  lastAttemptSubmitted: {
    type: String,
  },
  submittedOn: {
    type: Date
  },
  submittedTime: {
    type: String
  },
  submittedBy: {
    type: String
  },
  bookingDate: {
    type: String,
  },
  bdeName: {
    type: String,
  },
  bdmName: {
    type: String,
  },
  totalPaymentWGST: {
    type: Number,
  },
  pendingRecievedPayment: {
    type: Number,
  },
  pendingNotRecievedPayment:{
    type:Number
  },
  pendingRecievedPaymentDate: {
    type: Date,
  },
  panNumber: {
    type: String,
  },
  bdeEmail: {
    type: String,
  },
  bdmType: {
    type: String,
  },
  paymentMethod: {
    type: String,
  },
  caCase: {
    type: String,
  },
  caEmail: {
    type: String,
  },
  totalPaymentWOGST: {
    type: Number,
  },
  withGST: {
    type: Boolean
  },
  paymentTerms: {
    type: String,
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
  bookingPublishDate: {
    type: String,
  },
  addedOn: {
    type: Date,
    //default:new Date()
  },
  Remarks: [RemarksSchema],
  brochureStatus: {
    type: String,
    default: "Not Applicable"
  },
  brochureDesigner: {
    type: String,
  },
  companyBriefing: {
    type: String,
  },
  lastActionDate: {
    type: Date,
    default: new Date()
  },
  dateOfChangingMainStatus: {
    type: Date,
    default: new Date()
  },
  previousMainCategoryStatus: {
    type: String,
    default: "General"
  },
  previousSubCategoryStatus: {
    type: String,
    default: "Not Started"
  },
  SecondTimeSubmitDate: {
    type: Date,
  },
  ThirdTimeSubmitDate: {
    type: Date
  },
  lastAttemptSubmitted: {
    type: String,
  },
  isIndustryEnabled: {
    type: Boolean,
  },
  otpVerificationStatus: {
    type: String,
    default: "Both Pending"
  },
})

const RMCertificationModel = mongoose.model("RmCertificationModel", RMCertificationServicesSchema)

module.exports = RMCertificationModel;