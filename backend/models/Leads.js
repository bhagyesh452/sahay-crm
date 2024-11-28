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

// Define the schema for call logs
const callLogSchema = new mongoose.Schema({
  year: {
    type: Number, // Example: 2024
    required: true,
  },
  months: [
    {
      month: {
        type: String, // Example: "January", "February"
        required: true,
      },
      dates: [
        {
          date: {
            type: String, // Example: "2024-11-26"
            required: true,
          },
          details: [
            {

              call_date: {
                type: String, // Example: "Outgoing", "Incoming", "Missed"
              },
              call_time: {
                type: Number, // Duration in seconds
              },
              call_type: {
                type: String, // Client's phone number
              },
              client_country_code: {
                type: String, // Employee who made/received the call
              },
              client_name: {
                type: String, // Time of the call, e.g., "11:14:47"
              },
              client_number: {
                type: String, // Additional remarks
              },
              duration: {
                type: Number, // Additional remarks
              },
              emp_name: {
                type: String, // Additional remarks
              },
              emp_number: {
                type: String, // Additional remarks
              },
              callId: {
                type: String, // Additional remarks
              },
              modified_at: {
                type: String, // Additional remarks
              },
              modified_at: {
                type: String, // Additional remarks
              },
              syncedAt: {
                type: String, // When this data was synced
              },
            },
          ],
        },
      ],
    },
  ],
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
    type: Date,
    default: new Date()
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
  callLogsDetails:[callLogSchema],
  lastStatusOfExtractedEmployee: {
    type: String,
    default: ""
  },
  previousStatusToUndo: {
    type: String,
    default: ""
  },
  maturedCaseUploaded: {
    type: Boolean,
  },
  bdmNextFollowUpDate: {
    type: Date
  },
});

const CompanyModel = mongoose.model('newCdata', CompanySchema);

module.exports = CompanyModel;