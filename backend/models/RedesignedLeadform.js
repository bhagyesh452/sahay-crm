const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true,
  },
  totalPaymentWOGST: {
    type: Number,
    required: true,
  },
  totalPaymentWGST: {
    type: Number,
    required: true,
  },
  withGST:{
    type:Boolean
  },
  withDSC:{
    type:Boolean
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
  secondPaymentRemarks:{
    type: String,
  },
  thirdPaymentRemarks:{
    type: String,
  },
  fourthPaymentRemarks:{
    type: String,
  },
  paymentRemarks: {
    type: String,
    default: "No payment remarks",
  },
});

const TempSchema = new mongoose.Schema({
  "Company Name": {
    type: String,
    unique:true
  },
  "Company Number": {
    type: Number,
  },
  "Company Email": {
    type: String,
  },
  panNumber:{
    type:String,
  },
  gstNumber:{
    type:String
  },
  incoDate: {
    type: String,
  },
  bdeName: {
    type: String,
  },
  bdmType:{
    type:String,
  },
  bdeEmail: {
    type: String,
  },
  bdmName: {
    type: String,
  },
  otherBdmName:{
    type:String,
  },
  bdmEmail: {
    type: String,
  },
  bookingDate: {
    type: String,
  },
  bookingSource: {
    type: String,
  },
  otherBookingSource:{
    type:String,
  },
  numberOfServices: {
    type: Number,
  },
  services: [ServiceSchema],
  caCase: {
    type: String,
  },
  caNumber: {
    type: String,
  },
  caEmail: {
    type: String,
  },
  caCommission: {
    type: String,
  },
  paymentMethod: {
    type: String,
  },
  paymentReceipt: {
    type: Array,
  },
  extraNotes: {
    type: String,
  },
  totalAmount: {
    type: Number,
  },
  receivedAmount: {
    type: Number,
  },
  pendingAmount: {
    type: Number,
  },
  otherDocs : {
    type : Array
  },
  Step1Status: {
    type: Boolean,
    default:false
  },
  Step2Status: {
    type: Boolean,
    default:false
  },
  Step3Status: {
    type: Boolean,
    default:false
  },
  Step4Status: {
    type: Boolean,
    default:false
  },
  Step5Status: {
    type: Boolean,
    default:false
  },
});
const RedesignedLeadformSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'newcdatas',
        localField: 'Company Name',
        foreignField: 'Company Name',
        justOne: true,
        match: { Status: 'Matured' }
      },
  "Company Name": {
    type: String,
    required: true,
    unique:true
  },
  "Company Number": {
    type: Number,
    required: true,
  },
  "Company Email": {
    type: String,
    required: true,
  },
  panNumber:{
    type:String,
    required:true
  },
  gstNumber:{
    type:String
  },
  incoDate: {
    type: String,
    required: true,
  },
  bdeName: {
    type: String,
    required: true,
  },
  bdmName: {
    type: String,
    required: true,
  },
  bdeEmail: {
    type: String,
  },
  bdmType:{
    type:String,
  },
  bdmEmail: {
    type: String,
  },
  otherBdmName:{
    type:String,
  },
  bookingDate: {
    type: String,
    required: true,
  },
  bookingSource: {
    type: String,
    required: true,
  },
  numberOfServices: {
    type: Number,
    required: true,
  },
  services: [ServiceSchema],
  caCase: {
    type: String,
  },
  caNumber: {
    type: Number,
  },
  caEmail: {
    type: String,
  },
  caCommission: {
    type: String,
  },
  paymentMethod: {
    type: String,
  },
  paymentReceipt: {
    type : Array
  },otherDocs : {
    type : Array
  },
  extraNotes: {
    type: String,
  },
  totalAmount: {
    type: Number,
  },
  receivedAmount: {
    type: Number,
  },
  pendingAmount: {
    type: Number,
  },
  moreBookings:[TempSchema]
});

const RedesignedLeadformModel = mongoose.model(
  "RedesignedLeadform",
  RedesignedLeadformSchema
);

module.exports = RedesignedLeadformModel;
