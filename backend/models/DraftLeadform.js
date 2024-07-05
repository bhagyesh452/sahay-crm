const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({

   ename:{
    type:String,
    required :true
   },
    bdmName: {
        type:String,
    },
    bdmEmail:{
        type:String,
    },
    bdmType: String,
    supportedBy: Boolean,
    bookingDate: Date,
    caCase: String,
    caNumber: Number,
    caEmail: String,
    caCommission: Number,
    companyName: String,
    contactNumber: Number,
    companyEmail: String,
    services: Array,
    originalTotalPayment: Number,
    totalPayment: Number,
    paymentTerms: String,
    paymentMethod: String,
    firstPayment: Number,
    secondPayment: Number,
    thirdPayment: Number,
    fourthPayment: Number,
    paymentRemarks:String,
    paymentReceipt: String,
    bookingSource: String,
    cPANorGSTnum: String,
    incoDate: Date,
    extraNotes: String,
    otherDocs: Array,
    bookingTime: String
});

const DraftModel = mongoose.model('DraftLeadForm', leadSchema);

module.exports = DraftModel;
