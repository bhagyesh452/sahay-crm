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

const ContentWriterServiceistorySchema = new mongoose.Schema({
    companyName: {
        type: String
    },
    serviceName: {
        type: String
    },
    history: [historySchema]
});

const ContentWriterServiceHistoryModel = mongoose.model("ContentWriterServiceHistoryModel", ContentWriterServiceistorySchema);

module.exports = ContentWriterServiceHistoryModel;