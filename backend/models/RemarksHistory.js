const mongoose = require('mongoose');

// Create a Mongoose schema
const remarksHistorySchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  companyID: {
    type: String,
    required: true,
  },
  remarks: {
    type: String,
  },
  bdmName:{
    type:String,
  },
  bdmRemarks:{
    type:String
  },
  bdeName:{
    type:String
  },
  companyName:{
    type:String
  },
});

// Create the "RemarksHistory" model using the schema
const RemarksHistory = mongoose.model('RemarksHistory', remarksHistorySchema);

// Export the model
module.exports = RemarksHistory;
