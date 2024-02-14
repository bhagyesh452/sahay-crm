const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({

    bdeName: {
        type:String,
    },
    bdeEmail:{
        type:String,
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
    caCommission: String,
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

const DeletedModel = mongoose.model('DeletedDatabase', leadSchema);

module.exports = DeletedModel;
