const mongoose = require("mongoose");

const HrEmployeeSchema = new mongoose.Schema({
    fullName: {
        type: String,
        require: true
    },
    dob: {
        type: Date
    },
    gender: {
        type: String
    },
    personalPhoneNo: {
        type: String,
        unique: true
    },
    personalEmail: {
        type: String,
        unique: true
    },
    address: {
        type: String
    },
    department: {
        type: String
    },
    designation: {
        type: String
    },
    joiningDate: {
        type: Date
    },
    branchOffice: {
        type: String
    },
    employeementType: {
        type: String
    },
    reportingManager: {
        type: String
    },
    officialPhoneNo: {
        type: String,
        unique: true
    },
    officialEmail: {
        type: String,
        unique: true
    },
    bankName: {
        type: String
    },
    accountNo: {
        type: String
    },
    ifscCode: {
        type: String
    },
    salary: {
        type: Number
    },
    allowances: {
        type: String
    },
    deductions: {
        type: String
    },
    firstMonthSalaryCondition: {
        type: String
    },
    panNumber: {
        type: String
    },
    aadharNumber: {
        type: String
    },
    uanNumber: {
        type: String
    },
    emergencyContactName: {
        type: String
    },
    emergencyPersonRelationship: {
        type: String
    },
    emergencyContactNo: {
        type: String
    },
    aadharCard: {
        type: [String]
    },
    panCard: {
        type: [String]
    },
    educationCertificate: {
        type: [String]
    },
    relievingCertificate: {
        type: [String]
    },
    salarySlip: {
        type: [String]
    },
    offerLetter: {
        type: [String]
    },
    joiningLetter: {
        type: [String]
    },
    nda: {
        type: [String]
    },
});

const HrEmployeeModel = mongoose.model("HrEmployee", HrEmployeeSchema);

module.exports = HrEmployeeModel;