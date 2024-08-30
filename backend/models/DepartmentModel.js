const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
    departmentName: {
        type: String
    },
    serviceName: {
        type: String
    },
    serviceDescription: {
        type: String
    },
    hideService: {
        type: Boolean,
        default: false
    },
});

const DepartmentModel = mongoose.model('Department', DepartmentSchema);
module.exports = DepartmentModel;