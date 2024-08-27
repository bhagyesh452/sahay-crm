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
})

const AdminExecutiveHistorySchema = new mongoose.Schema({
    "Company Name": {
        type: String
    },
    serviceName: {
        type: String
    },
    history: [historySchema]
})

const AdminExecutiveHistoryModel = mongoose.model("AdminExecutiveHistory" ,AdminExecutiveHistorySchema)

module.exports = AdminExecutiveHistoryModel;