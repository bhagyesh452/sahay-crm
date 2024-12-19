const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    movedFromMainCategoryStatus: {
        type: String
    },
    movedToMainCategoryStatus: {
        type: String
    },
    mainCategoryStatus: {
        type: String
    },
    subCategoryStatus: {
        type: String
    },
    statusChangeDate: {
        type: Date
    }
});

const RMFundingHistorySchema = new mongoose.Schema({
    "Company Name": {
        type: String
    },
    serviceName: {
        type: String
    },
    history: [historySchema]
});

const RMFundingHistoryModel = mongoose.model("RMFundingHistory", RMFundingHistorySchema);

module.exports = RMFundingHistoryModel;
