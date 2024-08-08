const mongoose = require('mongoose');

const isoTypeSchema = new mongoose.Schema({
  serviceID: {
    type: Number
  },
  type: {
    type: String
  },
  IAFtype1: {
    type: String
  },
  IAFtype2: {
    type: String
  },
  Nontype: {
    type: String
  }
})

const ServiceSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true,
  },
  totalPaymentWOGST: {
    type: Number,
    required: true,
  },
  isoTypeObject: [isoTypeSchema],
  totalPaymentWGST: {
    type: Number,
    required: true,
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
  paymentRemarks: {
    type: String,
    default: "No payment remarks",
  },
  expanse: {
    type: Number
  },
  expanseDate: {
    type: Date
  },

});

const RemarksSchema = new mongoose.Schema({
  remarks:{
    type:"String"
  },
  updatedOn:{
    type:Date,
    default:new Date()
  },
  mainCategoryStatus:{
    type:String
  },
  subCategoryStatus:{
    type:String
  }
})

const RMCertificationServicesSchema = new mongoose.Schema({
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
  pendingRecievedPayment:{
    type: Number,
  },
  pendingRecievedPaymentDate:{
    type:Date,
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
  addedOn:{
    type:Date,
    //default:new Date()
  },
  Remarks:[RemarksSchema],
  dscStatus:{
    type:String,
    default:"Not Started"
  },
  contentStatus:{
     type:String,
    default:"Not Started"
  },
  contentWriter:{
    type:String,
    default:"RonakKumar"
 },
  brochureStatus:{
    type:String,
   default:"Not Applicable"
 },
 brochureDesigner:{
  type:String,
},
  nswsMailId:{
    type:String
  },
  nswsPaswsord:{
    type:String
  },
  websiteLink:{
    type:String
  },
  companyBriefing:{
    type:String,
  },
  industry:{
    type:String
  },
  sector:{
    type:String
  },
  lastActionDate:{
    type:Date,
    default: new Date()
  },
  dateOfChangingMainStatus:{
    type:Date,
    default: new Date()
  },
  submittedOn:{
    type:Date
  },
  previousMainCategoryStatus:{
    type:String,
    default:"General"
  },
  previousSubCategoryStatus:{
    type:String,
    default:"Not Started"
  },
  SecondTimeSubmitDate:{
    type:Date,
  },
  ThirdTimeSubmitDate:{
    type:Date
  },
 lastAttemptSubmitted:{
  type:String,
 }
})

const RMCertificationModel = mongoose.model("RmCertificationModel", RMCertificationServicesSchema)

module.exports = RMCertificationModel;