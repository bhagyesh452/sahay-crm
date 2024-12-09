const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  title: {
    type: String,
  },
  "Company Name": {
    type: String,
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
    type:String
  },
  date: {
    type: String,
  },
  time:{
    type:String
  },
});
const yourSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  "Company Name": {
    type: String,
    unique: false, // Ensure there's no unique: true
  },
  ename:{
    type:String
  },
  oldStatus:{
    type:String
  },
  newStatus:{
    type:String
  },
  properDate: {
    type: Date,
  },
  date: {
    type: String,
  },
  time:{
    type:String
  },
  history:[historySchema]
});


const RecentUpdatesModel= mongoose.model('recent-updates', yourSchema);

module.exports = RecentUpdatesModel;