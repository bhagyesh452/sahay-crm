const mongoose = require('mongoose');


const RemarksSchema = new mongoose.Schema({
  remarks:{
    type:String
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
  City:{
    type:String,
  },
  State:{
    type:String
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
  letterStatus:{
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
nswsMobileNo:{
  type:String
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
  submittedTime:{
    type:String
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
 },
 isIndustryEnabled:{
  type:Boolean,
 },
 otpVerificationStatus: {
  type: String,
  default:"Both Pending"
},
})

const RMCertificationModel = mongoose.model("RmCertificationModel", RMCertificationServicesSchema)

module.exports = RMCertificationModel;