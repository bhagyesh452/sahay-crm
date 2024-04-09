const mongoose = require('mongoose');

const employee = new mongoose.Schema({
    ename: {
        type: String,
        unique:true,
        required:true
    },
    // email: String,
    // number: String,
    // jdate: String,
    // password: String,
    // designation: String,
    branchOffice: String
});

const teamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        unique:true,
        required:true
    },
    branchOffice:{
        type:String,
        required:true
      },
    bdmName: {
        type: String,
        unique:true,
        required:true
    },
   
    // bdmEmail: {
    //     type: String,
       
    // },
    // bdmNumber: {
    //     type: String,
       
    // },
    // bdmjDate:{
    //     type:String,
        
    // },
    // designation:{
    //     type:String
    // },
    //   AddedOn:{
    //     type:String
    //   },
    employees: [employee]
});

const TeamModel = mongoose.model('Team', teamSchema);

module.exports = TeamModel;