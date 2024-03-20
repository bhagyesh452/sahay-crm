const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  serviceName: {
    type: String,
  },
  totalPaymentWOGST: {
    type: Number,
  },
  totalPaymentWGST: {
    type: Number,
  },
  paymentTerms: {
    type: String,
  },
  firstPayment: {
    type: String,
  },
  secondPayment: {
    type: String,
  },
  thirdPayment: {
    type: String,
  },
  fourthPayment: {
    type: String,
  },
  paymentRemarks: {
    type: String,
    default: "No payment remarks",
  },
});
const RedesignedDraftModelSchema = new mongoose.Schema({
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
  bdmName: {
    type: String,
  },
  bookingDate: {
    type: String,
  },
  bookingSource: {
    type: String,
  },
  numberOfServices: {
    type: Number,
  },
  services: [ServiceSchema],
  caCase: {
    type: Boolean,
    default: false,
  },
  caName: {
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
    type: String,
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
});

const RedesignedDraftModel = mongoose.model(
  "RedesignedDraftModel",
  RedesignedDraftModelSchema
);

module.exports = RedesignedDraftModel;
