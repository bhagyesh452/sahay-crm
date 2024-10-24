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
const yourSchema = new mongoose.Schema({
  ename: {
    type: String
  },
  empFullName: {
    type: String
  },
  employeeID: {
    type: String,
    unique: true
  },
  dob: {
    type: Date
  },
  bloodGroup: {
    type: String,
    default: ""
  },
  gender: {
    type: String
  },
  personal_number: {
    type: String,
    // unique: true
  },
  personal_email: {
    type: String,
    // unique: true
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
  newDesignation: {
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
    // unique: true
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
  },
  showDialog: { 
    type: Boolean, 
    default: false 
  },
  showDialogDate:{
    type:Date
  },
  lastLoginTime: { 
    type: Date, 
    default: null 
  },
  lastShowDialogTime:{
    type:String
  },
  dialogCount: { 
    type: Number, 
    default: 0 
  },
  firstFetch:{
    type:Boolean
  }
});


// Add indexes for search fields
yourSchema.index({ ename: 1 });
yourSchema.index({ number: 1 });
yourSchema.index({ email: 1 });
yourSchema.index({ branchOffice: 1 });
yourSchema.index({ department: 1 });
yourSchema.index({ newDesignation: 1 });


// Create the model
const adminModel = mongoose.model('newemployeeinfos', yourSchema);

module.exports = adminModel;