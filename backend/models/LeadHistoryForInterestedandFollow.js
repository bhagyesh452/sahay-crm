const mongoose = require("mongoose");

const LeadHistorySchema = new mongoose.Schema({
    "Company Name": {
        type: String,
        unique:true
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
      date: {
        type: Date,
      },
      time:{
        type:String
      },
      Count:{
        type:Number
      }
})

const LeadHistoryForInterestedandFollowModel = mongoose.model("leadHistoryForInterestedandFollow" ,LeadHistorySchema )

module.exports = LeadHistoryForInterestedandFollowModel;