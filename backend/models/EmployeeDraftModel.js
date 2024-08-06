const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  fieldname: String,
  originalname: String,
  encoding: String,
  mimetype: String,
  destination: String,
  filename: String,
  path: String,
  size: Number
});

// Define the schema
const EmployeeDraftSchema = new mongoose.Schema({
  activeStep: {
    type: Number,
  },
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
  currentAddress: {
    type: String
  },
  permanentAddress: {
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
  accountNo: {
    type: String
  },
  nameAsPerBankRecord: {
    type: String
  },
  ifscCode: {
    type: String
  },
  salary: {
    type: Number
  },
  firstMonthSalaryCondition: {
    type: String
  },
  firstMonthSalary: {
    type: Number
  },
  offerLetter: {
    type: [fileSchema]
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
    type: [fileSchema]
  },
  panCard: {
    type: [fileSchema]
  },
  educationCertificate: {
    type: [fileSchema]
  },
  relievingCertificate: {
    type: [fileSchema]
  },
  salarySlip: {
    type: [fileSchema]
  },
  offerLetter: {
    type: [fileSchema]
  },
  profilePhoto: {
    type: [fileSchema]
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
const EmployeeDraftModel = mongoose.model('EmployeeDraft', EmployeeDraftSchema);

module.exports = EmployeeDraftModel;