const mongoose = require('mongoose');

const DepartmentsSchema = new mongoose.Schema({
    departmentName: {
        type: String
    },
    // hideService: {
    //     type: Boolean,
    //     default: false
    // },
});

const DepartmentsModel = mongoose.model('Departments', DepartmentsSchema);
module.exports = DepartmentsModel;