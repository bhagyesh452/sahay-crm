const mongoose = require('mongoose');

const deleteSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  Id:{
    type:String,
    required:true
  },
  companyID: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  request: {
    type: Boolean,
    default:false,
  },
  ename:{
    type:String,
    required:true,
  },
  bookingIndex:{
    type : Number,
    required:true
  },
  assigned:{
    type:String,
  }
});

const RequestDeleteByBDE = mongoose.model('RequestDeleteByBDE', deleteSchema);

module.exports = RequestDeleteByBDE;