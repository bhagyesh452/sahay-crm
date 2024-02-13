const mongoose = require('mongoose');

const deleteSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  companyId: {
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
    required: false,
  },
});

const RequestDeleteByBDE = mongoose.model('RequestDeleteByBDE', deleteSchema);

module.exports = RequestDeleteByBDE;