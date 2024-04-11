const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  serviceName: {
    type: String,
  },
  withDSC:{
    type:Boolean
  },
  totalPaymentWOGST: {
    type: Number,
  },
  totalPaymentWGST: {
    type: Number,
  },
  withGST:{
    type:Boolean
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
  secondPaymentRemarks:{
    type: String,
  },
  thirdPaymentRemarks:{
    type: String,
  },
  fourthPaymentRemarks:{
    type: String,
  },
  thirdPayment: {
    type: Number,
  },
  fourthPayment: {
    type: Number,
  },
  paymentRemarks: {
    type: String,
    default: "No payment remarks",
  },
  paymentCount:{
    type:Number
  }
});
const RedesignedDraftModelSchema = new mongoose.Schema({
  "Company Name": {
    type: String,
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
  bdmType:{
    type:String,
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
  requestBy:{
    type:String
  },
 requestDate:{
    type:String
 },
 bookingIndex:{
  type:Number,
  default:0
 }
});

const EditableDraftModel = mongoose.model(
  "EditableDraftModel",
  RedesignedDraftModelSchema
);

module.exports = EditableDraftModel;
