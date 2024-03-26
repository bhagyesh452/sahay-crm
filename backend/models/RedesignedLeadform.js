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
  paymentTerms: {
    type: String,
    required: true,
  },
  firstPayment: {
    type: String,
    required: true,
  },
  secondPayment: {
    type: String,
    required: true,
  },
  thirdPayment: {
    type: String,
    required: true,
  },
  fourthPayment: {
    type: String,
    required: true,
  },
  paymentRemarks: {
    type: String,
    default: "No payment remarks",
  },
});

const RedesignedLeadformSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company Model',
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
});

const RedesignedLeadformModel = mongoose.model(
  "RedesignedLeadform",
  RedesignedLeadformSchema
);

module.exports = RedesignedLeadformModel;
