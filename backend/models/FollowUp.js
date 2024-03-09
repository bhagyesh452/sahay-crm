const mongoose = require('mongoose');

// Define the schema
const CompanySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true
  },
  ename:{
    type:String,
    required:true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  offeredServices: {
    type: [String],
    default: []
  },
  offeredPrize: {
    type: Number,
    required: true
  },
  lastFollowUpdate: {
    type: String,
    required: true
  },
  totalPayment:{
    type:Number,
    required:true
  },
  estPaymentDate:{
    type:String,
    required:true
  },
  remarks:{
    type:String,
<<<<<<< HEAD
    default:"no remarks added"
=======
    required:true
>>>>>>> b41092a18069d94425d6576af1a9f34ea515b2ed
  }

});


const FollowUpModel = mongoose.model('FollowupCollection', CompanySchema);

module.exports = FollowUpModel;
