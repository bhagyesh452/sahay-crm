const mongoose = require('mongoose');

// Define the schema
const CompanySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true
  },
  ename: {
    type: String,
    required: true
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
  totalPayment: {
    type: Number,
    required: true
  },
  estPaymentDate: {
    type: String,
    required: true
  },
  remarks: {
    type: String,
    default: "no remarks added"
  },
  editCount: {
    type: Number,
    default: 0
  },
  history: [{
    modifiedAt: { type: String, default: Date.now },
    data: {
      companyName: {
        type: String,
        required: true
      },
      ename: {
        type: String,
        required: true
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
      totalPayment: {
        type: Number,
        required: true
      },
      estPaymentDate: {
        type: String,
        required: true
      },
      remarks: {
        type: String,
        default: "no remarks added"
      },
      editCount: {
        type: Number,
        default: 0
      }
    },
  }],
});


const FollowUpModel = mongoose.model('FollowupCollection', CompanySchema);

module.exports = FollowUpModel;
