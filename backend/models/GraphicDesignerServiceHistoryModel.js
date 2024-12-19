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

const GraphicDesignerServiceistorySchema = new mongoose.Schema({
    companyName: {
        type: String
    },
    serviceName: {
        type: String
    },
    history: [historySchema]
});

const GraphicDesignerServiceHistoryModel = mongoose.model("GraphicDesignerServiceHistoryModel", GraphicDesignerServiceistorySchema);

module.exports = GraphicDesignerServiceHistoryModel;