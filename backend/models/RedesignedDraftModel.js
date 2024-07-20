const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  serviceName: {
    type: String,
  },
  withDSC: {
    type: Boolean
  },
  totalPaymentWOGST: {
    type: Number,
  },
  totalPaymentWGST: {
    type: Number,
  },
  isoTypeObject: {
    type: Array,
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
  secondPaymentRemarks: {
    type: String,
  },
  thirdPaymentRemarks: {
    type: String,
  },
  fourthPaymentRemarks: {
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
  paymentCount: {
    type: Number
  }
});
const TempSchema = new mongoose.Schema({

  bdeName: {
    type: String,
  },
  bdmType: {
    type: String,
  },
  bdeEmail: {
    type: String,
  },
  bdmName: {
    type: String,
  },
  otherBdmName: {
    type: String,
  },
  bdmEmail: {
    type: String,
  },
  bookingDate: {
    type: String,
  },
  bookingTime: {
    type: Date,
  },
  bookingSource: {
    type: String,
  },
  otherBookingSource: {
    type: String,
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
    type: Number,
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
  generatedTotalAmount: {
    type: Number,
  },
  generatedReceivedAmount: {
    type: Number,
  },
  otherDocs: {
    type: Array
  },
  Step1Status: {
    type: Boolean,
    default: false
  },
  Step2Status: {
    type: Boolean,
    default: false
  },
  Step3Status: {
    type: Boolean,
    default: false
  },
  Step4Status: {
    type: Boolean,
    default: false
  },
  Step5Status: {
    type: Boolean,
    default: false
  },
});
const RedesignedDraftModelSchema = new mongoose.Schema({
  "Company Name": {
    type: String,
    unique: true
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
  gstNumber: {
    type: String
  },
  incoDate: {
    type: String,
  },
  bdeName: {
    type: String,
  },
  bdmType: {
    type: String,
  },
  bdeEmail: {
    type: String,
  },
  bdmName: {
    type: String,
  },
  otherBdmName: {
    type: String,
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
  otherBookingSource: {
    type: String,
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
    type: Number,
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
  generatedTotalAmount: {
    type: Number,
  },
  generatedReceivedAmount: {
    type: Number,
  },
  otherDocs: {
    type: Array
  },
  Step1Status: {
    type: Boolean,
    default: false
  },
  Step2Status: {
    type: Boolean,
    default: false
  },
  Step3Status: {
    type: Boolean,
    default: false
  },
  Step4Status: {
    type: Boolean,
    default: false
  },
  Step5Status: {
    type: Boolean,
    default: false
  },
  moreBookings: {
    type: TempSchema,
  },
});

const RedesignedDraftModel = mongoose.model(
  "RedesignedDraftModel",
  RedesignedDraftModelSchema
);

module.exports = RedesignedDraftModel;
