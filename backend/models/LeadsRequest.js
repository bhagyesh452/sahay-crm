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
  },
  Remarks: {
    type: String,
    default: "No Remarks Added",
  },
  "Company Address":{
    type:String
  },
  'Director Name(First)':{
    type:String
  },
  'Director Number(First)':{
    type:Number
  },
  'Director Email(First)':{
    type:String
  },
  'Director Name(Second)':{
    type:String
  },
  'Director Number(Second)':{
    type:Number
  },
  'Director Email(Second)':{
    type:String
  },
  'Director Name(Third)':{
    type:String
  },
  'Director Number(Third)':{
    type:Number
  },
  'Director Email(Third)':{
    type:String
  },
  RequestStatus:{
    type:Boolean,
    default:"false"
  },

});

const CompanyRequestModel = mongoose.model("companyRequests", CompanySchema);

module.exports = CompanyRequestModel;
