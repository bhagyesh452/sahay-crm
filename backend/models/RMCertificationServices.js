const mongoose = require('mongoose');

const isoTypeSchema = new mongoose.Schema({
  serviceID:{
    type:Number
  },
  type:{
    type:String
  },
  IAFtype1:{
    type:String
  },
  IAFtype2:{
    type:String
  },
  Nontype:{
    type:String
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
  expanse:{
    type:Number
  },
  expanseDate:{
    type:Date
  }
});

const RMCertificationServicesSchema = new mongoose.Schema({
    "Company Name": {
        type : String,
        required : true,
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
    bdeName: {
      type: String,
      
    },
    bdeEmail: {
      type: String,
    },
    bdmName: {
      type: String,
     
    },
    bdmType:{
      type:String,
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
      withGST:{
        type:Boolean
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
      bookingPublishDate: {
        type: String,
      },
})

const RMCertificationModel = mongoose.model("RmCertificationModel" , RMCertificationServicesSchema)

module.exports = RMCertificationModel;