const mongoose = require('mongoose');

const informationSchema = new mongoose.Schema({
  "Company Name": {
    type: String,
  },
  ename: {
    type: String
  },
  mainQuestion: {
    type: Array,
  },
  // Option 1: Client asked to send documents/information on WhatsApp for review
  clientWhatsAppRequest: {
    nextFollowUpDate: {
      type: Date, // Calendar field for follow-up date
    },
    remarks: {
      type: String, // Remark Box for additional comments
    },
    date: {
      type: Date, // Date for when this information was added
      // default: Date.now,
    },
  },
  // Option 2: Client asked to send documents/information via email for review
  clientEmailRequest: {
    nextFollowUpDate: {
      type: Date, // Calendar field for follow-up date
    },
    remarks: {
      type: String, // Remark Box for additional comments
    },
    date: {
      type: Date, // Date for when this information was added
      // default: Date.now,
    },
  },
  // Option 3: Interested in one of our services
  interestedInServices: {
    servicesPitched: {
      type: Array, // Checkbox list for services pitched
    },
    servicesInterestedIn: {
      type: Array, // Checkbox list for services client is interested in
    },
    offeredPrice: {
      type: String, // Text field for offered price
    },
    nextFollowUpDate: {
      type: Date, // Calendar field for follow-up date
    },
    remarks: {
      type: String, // Remark Box for additional comments
    },
    date: {
      type: Date, // Date for when this information was added
      // default: Date.now,
    },
  },
  // Option 4: Interested, but doesn't need the service right now
  interestedButNotNow: {
    servicesPitched: {
      type: Array, // Checkbox list for services pitched
    },
    servicesInterestedIn: {
      type: [String], // Checkbox list for services client is interested in
    },
    offeredPrice: {
      type: String, // Text field for offered price
    },
    nextFollowUpDate: {
      type: Date, // Calendar field for follow-up date
    },
    remarks: {
      type: String, // Remark Box for additional comments
    },
    date: {
      type: Date, // Date for when this information was added
      // default: Date.now,
    },
  },
}, {
  timestamps: true,
});

const CompanySchema = new mongoose.Schema({
  "Company Name": {
    type: String,
    unique: true,
  },
  "Company Number": {
    type: Number,
  },
  "Company Email": {
    type: String,
  },
  "Company Incorporation Date  ": {
    type: Date,
  },
  CInumber: {
    type: Number,
  },
  City: {
    type: String,
  },
  State: {
    type: String,
  },
  ename: {
    type: String,
    default: "Not Alloted"
  },
  AssignDate: {
    type: Date
  },
  UploadDate: {
    type: Date
  },
  Status: {
    type: String,
    default: "Untouched"
  },
  Remarks: {
    type: String,
    default: "No Remarks Added"
  },
  lastActionDate: {
    type: String
  },
  "Company Address": {
    type: String
  },
  'Director Name(First)': {
    type: String
  },
  'Director Number(First)': {
    type: Number
  },
  'Director Email(First)': {
    type: String
  },
  'Director Name(Second)': {
    type: String
  },
  'Director Number(Second)': {
    type: Number
  },
  'Director Email(Second)': {
    type: String
  },
  'Director Name(Third)': {
    type: String
  },
  'Director Number(Third)': {
    type: Number
  },
  'Director Email(Third)': {
    type: String
  },
  bdmAcceptStatus: {
    type: String,
    default: "NotForwarded"
  },
  bdeForwardDate: {
    type: String,
  },
  bdeOldStatus: {
    type: String
  },
  // feedbackPoints:{
  //   type:Number
  // },
  feedbackPoints: {
    type: Array, // Define feedbackPoints as an array of numbers
    // Default array with five elements initialized to 0
  },
  feedbackRemarks: {
    type: String
  },
  UploadedBy: {
    type: String
  },
  bdmName: {
    type: String,
    default: "NoOne"
  },
  bdeNextFollowUpDate: {
    type: Date
  },
  maturedBdmName: {
    type: String
  },
  multiBdmName: {
    type: Array
  },
  bdmRemarks: {
    type: String
  },
  bdmStatus: {
    type: String,
    default: ""
  },
  bdmStatusChangeDate: {
    type: String,
  },
  bdmStatusChangeTime: {
    type: String,
  },
  RevertBackAcceptedCompanyRequest: {
    type: String,
  },
  isDeletedEmployeeCompany: {
    type: Boolean,
    default: false,
  },
  extractedMultipleBde: {
    type: Array,
  },
  lastAssignedEmployee: {
    type: String
  },
  extractedDate: {
    type: Date
  },
  isUploadedManually: {
    type: Boolean,
  },
  lastActionDate: {
    type: Date,
    default: new Date()
  },
  interestedInformation: [informationSchema],
  lastStatusOfExtractedEmployee: {
    type: String,
    default: ""
  },
  previousStatusToUndo: {
    type: String,
    default: ""
  },
  maturedCaseUploaded:{
    type:Boolean,
  }
});

const CompanyModel = mongoose.model('newCdata', CompanySchema);

module.exports = CompanyModel;