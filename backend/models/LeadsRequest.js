const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  "Company Name": {
    type: String,
    unique: true,
    required:true
  },
  "Company Number": {
    type: Number,
    required:true
  },
  "Company Email": {
    type: String,
    required:true
  },
  "Company Incorporation Date  ": {
    type: Date,
    required:true
  },
  City: {
    type: String,
    required:true
  },
  State: {
    type: String,
    required:true
  },
  ename: {
    type: String,
    default: "Not Alloted",
  
  },
  AssignDate: {
    type: Date,
  },
  Status: {
    type: String,
    default: "Untouched",
    required:true
  },
  Remarks: {
    type: String,
    default: "No Remarks Added",
  },
  RequestStatus:{
    type:Boolean,
    default:"false"
  }
});

const CompanyRequestModel = mongoose.model("companyRequests", CompanySchema);

module.exports = CompanyRequestModel;
