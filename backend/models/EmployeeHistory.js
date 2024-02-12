const mongoose = require('mongoose');

// Create a Mongoose schema
const EmployeeHistorySchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  ename: {
    type: String,
    required: true,
  },
});

// Create the "RemarksHistory" model using the schema
const EmployeeHistory = mongoose.model('EmployeeHistory', EmployeeHistorySchema);

// Export the model
module.exports = EmployeeHistory;
