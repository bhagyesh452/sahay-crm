const mongoose = require("mongoose");
const { type } = require("os");

const RemarksSchema = new mongoose.Schema({
    remarks: {
        type: String,
        default: ""
    },
    updatedOn: {
        type: Date,
        default: new Date()
    },
})
const InterviewSchema = new mongoose.Schema({
    interViewDate: {
        type: Date,
        default: new Date()
    },
    updatedOn: {
        type: Date,
        default: new Date()
    },
})
const RecruitmentSchema = new mongoose.Schema({
    ename: {
        type: String,
        //required: true,
    },
    empFullName: {
        type: String,
        required: true,
    },
    employeeID: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    personal_email: {
        type: String,
        unique: true
    },
    personal_number: {
        type: String,
        unique: true
    },
    number: {
        type: String,
        // unique: true
    },
    appliedFor: {
        type: String,
        default: ""
    },
    qualification: {
        type: String,
        default: ""
    },
    experience: {
        type: String,
        default: ""
    },
    currentCTC: {
        type: String,
        default: ""
    },
    expectedCTC: {
        type: String,
        default: ""
    },
    applicationSource: {
        type: String,
        default: ""
    },
    notes: {
        type: String,
        default: ""
    },
    uploadedCV: {
        type: Array,
        default: []
    },
    fillingDate: {
        type: Date,
        default: new Date()
    },
    fiilingTime: {
        type: String,
        default: new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    },
    mainCategoryStatus: {
        type: String,
        default: "General"
    },
    subCategoryStatus: {
        type: String,
        default: "Untouched"
    },
    dateOfChangingMainStatus: {
        type: Date,
        //default:new Date()
    },
    dateOfChangingMainStatus: {
        type: Date,
        //default:new Date()
    },
    lastActionDate: {
        type: Date,
        //default:new Date()
    },
    interViewStatus: {
        type: String,
        default: ""
    },
    interViewDate: {
        type: Date,
        //default:new Date()
    },
    interViewDateArray:[InterviewSchema],
    Remarks: [RemarksSchema],
    disqualificationReason: {
        type: String,
        default: ""
    },
    rejectionReason: {
        type: String,
        default: ""
    },
    department: {
        type: String,
        default: ""
    },
    offeredSalary: {
        type: String,
        default: ""
    },
    firstMonthSalaryCondition: {
        type: String
    },
    jdate: {
        type: Date
    },
    branchOffice: {
        type: String,
        default: ""
    },
    offerLetterStatus: {
        type: String,
        default: ""
    },
    documentsSubmitted: {
        type: String,
        default: ""
    },
    employementStatus: {
        type: String,
        default: ""
    },
    exitDate: {
        type: Date,
    },
    previousMainCategoryStatus:{
        type:String,
        
    },
    previousSubCategoryStatus:{
        type:String,
       
    }

});

const RecruitmentModel = mongoose.model("recruitmentmodel", RecruitmentSchema);
module.exports = RecruitmentModel;