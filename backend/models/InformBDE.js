const mongoose = require('mongoose');


const yourSchema = new mongoose.Schema({
 bdeName: {
    type: String,
    required : true
  },
  bdmName: {
    type: String,
    required : true
  },
  "Company Name":{
    type:String,
    required : true
  },
  date:{
    type:Date
  }
});

// Create the model
const InformBDEModel= mongoose.model('Inform-BDE', yourSchema);

module.exports = InformBDEModel;