const mongoose = require('mongoose');


// Define the schema
const yourSchema = new mongoose.Schema({
  email: {
    type: String,
    unique:true
  },
  number: {
    type: String,
  },
  ename: {
    type: String,
  },
  jdate: {
    type: Date,
  },
  password: {
    type: String,
  },
  designation:{
    type: String
  },
  branchOffice:{
    type:String,
  },
  targetDetails:{
    type : Array
  },
  AddedOn:{
    type:String
  },
  Active:{
    type : String
  },
  refresh_token:{
    type:String
  },
  access_token:{
    type:String
  },
  bdmWork:{
    type:Boolean,
    default:false
  },
  employee_profile:{
    type:Array,
  },
  personal_email:{
    type:String,
    unique: true
  },
  personal_number:{
    type:String,
  },
  personal_contact_person:{
    type:String,
  },
  personal_address:{
    type: String,
  }
});



// Create the model
const adminModel = mongoose.model('newemployeeinfos', yourSchema);

module.exports = adminModel;