const mongoose = require("mongoose");

const lastEmployeeIdSchema = new mongoose.Schema({
    lastEmployeeId: {
        type: String,
        default: "SSPL0000"
    }
});

const lastEmployeeIdModel = mongoose.model('LastEmployeeId', lastEmployeeIdSchema);

module.exports = lastEmployeeIdModel;