const mongoose = require('mongoose');

// Define the schema
const CompanySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true
  },
  companyId: {
    type: String,
  },
  ename: {
    type: String,
    required: true
  },
  date: {
    type: Date,
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
  offeredPrice: {
    type: Number,
    required: true
  },
  totalPayment: {
    type: Number,
    required: true
  },
  lastFollowUpdate: {
    type: Date,
    required: true
  },
  estPaymentDate: {
    type: Date,
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
  bdeName: {
    type: String,
  },
  bdmName: {
    type: String
  },
  caseType: {
    type: String,
    default: "NotForwarded"
  },
  isPreviousMaturedCase: {
    type: String,
    default: false,
  },
  history: [{
    modifiedAt: { type: String, default: Date.now() },
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
        type: Date,
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
      offeredPrice: {
        type: Number,
        required: true
      },
      totalPayment: {
        type: Number,
        required: true
      },
      lastFollowUpdate: {
        type: Date,
        required: true
      },
      estPaymentDate: {
        type: Date,
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
      bdeName: {
        type: String,
      },
      bdmName: {
        type: String
      },
      caseType: {
        type: String,
        default: "NotForwarded"
      },
      isPreviousMaturedCase: {
        type: String,
        default: false,
      },
    },
  }],
});


const NewFollowUpModel = mongoose.model('Projection', CompanySchema);

module.exports = NewFollowUpModel;