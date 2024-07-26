const mongoose = require('mongoose');


// Define the schema
const yourSchema = new mongoose.Schema({
  ename: {
    type: String
  },
  dob: {
    type: Date
  },
  gender: {
    type: String
  },
  personal_number: {
    type: String,
    unique: true
  },
  personal_email: {
    type: String,
    unique: true
  },
  personal_address: {
    type: String
  },
  department: {
    type: String
  },
  designation: {
    type: String
  },
  jdate: {
    type: Date
  },
  branchOffice: {
    type: String
  },
  employeementType: {
    type: String
  },
  reportingManager: {
    type: String
  },
  number: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  bankName: {
    type: String
  },
  accountNo: {
    type: String
  },
  ifscCode: {
    type: String
  },
  salary: {
    type: Number
  },
  allowances: {
    type: String
  },
  deductions: {
    type: String
  },
  firstMonthSalaryCondition: {
    type: String
  },
  panNumber: {
    type: String
  },
  aadharNumber: {
    type: String
  },
  uanNumber: {
    type: String
  },
  personal_contact_person: {
    type: String
  },
  personal_contact_person_relationship: {
    type: String
  },
  personal_contact_person_number: {
    type: String
  },
  aadharCard: {
    type: [String]
  },
  panCard: {
    type: [String]
  },
  educationCertificate: {
    type: [String]
  },
  relievingCertificate: {
    type: [String]
  },
  salarySlip: {
    type: [String]
  },
  offerLetter: {
    type: [String]
  },
  joiningLetter: {
    type: [String]
  },
  nda: {
    type: [String]
  },
  targetDetails: {
    type: Array
  },
  AddedOn: {
    type: String
  },
  Active: {
    type: String
  },
  refresh_token: {
    type: String
  },
  access_token: {
    type: String
  },
  bdmWork: {
    type: Boolean,
    default: false
  },
  employee_profile: {
    type: Array
  }
});



// Create the model
const adminModel = mongoose.model('newemployeeinfos', yourSchema);

module.exports = adminModel;