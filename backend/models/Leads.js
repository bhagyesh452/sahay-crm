const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  "Company Name": {
    type: String,
    unique:true,
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
  City: {
    type: String,
    

  },
  State: {
    type: String,
    

  },
  ename:{
    type:String,
    default:"Not Alloted"
  },
  AssignDate: {
    type: Date
  }, 
  Status:{
    type:String,
    default:"Untouched"
  },
  Remarks:{
    type:String,
    default:"No Remarks Added"
  },
  lastActionDate:{
    type:String
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
  bdmAcceptStatus:{
    type:String,
    default:"NotForwarded"
  },
  bdeForwardDate:{
    type: String, 
    
  },
  bdeOldStatus:{
    type:String
  }

});

const CompanyModel = mongoose.model('newCdata', CompanySchema);

module.exports = CompanyModel;
