const mongoose = require('mongoose');


// Define the schema
const yourSchema = new mongoose.Schema({
ename:{
    type:String,
    required:true
},
requestType:{
    type:String,
    required:true
},
requestTime:{
    type:Date,
    required:true
},
designation:{
    type:String,
    required:true
},
status:{
    type:String,
    required:true
},
employee_status:{
    type:String,
    required:true
},
img_url:{
    type:String,
},
companyName:{
    type:String
},
employeeRequestType:{
    type:String,
},
paymentApprovalServices:{
    type:Array,
}

});



// Create the model
const NotiModel = mongoose.model('notification', yourSchema);

module.exports = NotiModel;