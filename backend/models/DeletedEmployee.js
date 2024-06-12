const mongoose = require('mongoose')

const yourSchema = new mongoose.Schema({
    email : {
        type : String,
        unique:true
    },
    number: {
        type: String,
      },
      ename: {
        type: String,
      },
      jdate: {
        type: Date,
      },
      password: {
        type: String,
      },
      designation:{
        type: String
      },
      branchOffice:{
        type:String,
      },
      targetDetails:{
        type : Array
      },
      AddedOn:{
        type:String
      },
      Active:{
        type : String
      },
      refresh_token:{
        type:String
      },
      access_token:{
        type:String
      },
      bdmWork:{
        type:Boolean,
        default:false
      }
})

const deletedEmployeeModel = mongoose.model('deletedemployeedetail' , yourSchema)
module.exports = deletedEmployeeModel;