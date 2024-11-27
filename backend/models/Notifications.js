const mongoose = require('mongoose');


// Define the schema
const yourSchema = new mongoose.Schema({
ename:{
    type:String,
    required:true
},
actualEmployeeCalling:{
    type:String,
    default:""
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
    required:true,
    default:""
},
status:{
    type:String,
    required:true,
    default:""
},
employee_status:{
    type:String,
    default:""
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
},
callingBdmName : {
    type:String,
    default:""
}

});



// Create the model
const NotiModel = mongoose.model('notification', yourSchema);

module.exports = NotiModel;