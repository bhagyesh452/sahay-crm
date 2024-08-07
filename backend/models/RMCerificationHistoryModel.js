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

const RMCertificationHistorySchema = new mongoose.Schema({
    "Company Name": {
        type: String
    },
    serviceName: {
        type: String
    },
    history: [historySchema]
});

const RMCertificationHistoryModel = mongoose.model("RMCertificationHistory", RMCertificationHistorySchema);

module.exports = RMCertificationHistoryModel;
