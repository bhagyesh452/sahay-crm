const mongoose = require("mongoose");

const TodaysGeneralProjectionSchema = new mongoose.Schema({
    empId: {
      type: String  
    },
    empName: {
        type: String,
    },
    noOfCompany: {
        type: Number
    },
    noOfServiceOffered: {
        type: Number
    },
    totalOfferedPrice: {
        type: Number
    },
    totalCollectionExpected: {
        type: Number
    },
    date: {
        type: String
    },
    time: {
        type: String
    }
});

const TodaysGeneralProjectionModel = mongoose.model('TodaysCollection', TodaysGeneralProjectionSchema);

module.exports = TodaysGeneralProjectionModel;