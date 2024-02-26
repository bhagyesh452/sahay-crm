const mongoose = require('mongoose');


const yourSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  date: {
    type: String,
  },
  time:{
    type:String
  }
});


const RecentUpdatesModel= mongoose.model('recent-updates', yourSchema);

module.exports = RecentUpdatesModel;