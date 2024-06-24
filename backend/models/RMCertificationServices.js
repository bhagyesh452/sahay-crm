const mongoose = require('mongoose');

const RMCertificationServicesSchema = new mongoose.Schema({
    "Company Name": {
        type : String,
        required : true,
    },
    bookingPublishDate: {
        type: String,
      },
      bookingDate: {
        type: String,
        required: true,
      },
      "Company Email": {
        type: String,
        required: true,
      },
      "Company Number": {
        type: Number,
        required: true,
      },
      panNumber:{
        type:String,
        required:true
      },
      bdeName: {
        type: String,
        required: true,
      },
      bdmName: {
        type: String,
        required: true,
      },
      bdmType:{
        type:String,
      },
      bookingSource: {
        type: String,
        required: true,
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
})