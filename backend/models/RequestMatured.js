const mongoose = require('mongoose');

const yourSchema = new mongoose.Schema({
  bdmName: {
    type: String,
  },
  date: {
    type: String,
  },
  "Company Name":{
    type:String
  },
  time:{
    type:String
  },
  requestStatus:{
    type:String
  },
  bdeName:{
    type:String
  }
});


const RequestMaturedModel= mongoose.model('request-matured', yourSchema);

module.exports = RequestMaturedModel;