var express = require('express');
var router = express.Router()
const dotenv = require('dotenv')
const app = express();
dotenv.config();

app.use(express.json());

const CompanyModel = require("../models/Leads.js");
const RemarksHistory = require("../models/RemarksHistory");
const TeamLeadsModel = require("../models/TeamLeads.js");
const RequestMaturedModel = require("../models/RequestMatured.js");
const InformBDEModel = require("../models/InformBDE.js");
const FollowUpModel = require('../models/FollowUp.js');
const RMCertificationModel = require('../models/RMCertificationServices.js');
const RedesignedDraftModel = require('../models/RedesignedDraftModel.js');
//   router.post('/post-rmservicesdata', async (req, res) => {
//   const { dataToSend } = req.body;
//   const publishDate = new Date();
//   //console.log("Received data:", dataToSend); // Log received data to inspect

//   try {
//     const sheetData = dataToSend.map(item=>({
//         ...item,
//         bookingPublishDate:publishDate,
//     }))
//     const createData = await RMCertificationModel.insertMany(sheetData)
//     //console.log("Created:", createData);

//     // Respond with success message and created data
//     res.status(200).json({ message: "Details added to RM services", data: createData });
//   } catch (error) {
//     console.error("Error creating/updating data:", error);
//     res.status(500).send("Error creating/updating data");
//   }
// });

router.post('/post-rmservicesdata', async (req, res) => {
  const { dataToSend } = req.body;
  const publishDate = new Date();
  try {
    let createData = [];
    let existingRecords = [];
    let successEntries = 0;
    let failedEntries = 0;

    for (const item of dataToSend) {
      try {
        // Check if the record already exists
        const existingRecord = await RMCertificationModel.findOne({
          "Company Name": item["Company Name"],
          serviceName: item.serviceName
        });

        if (!existingRecord) {
          const data = {
            ...item,
            bookingPublishDate: publishDate
          };
          const newRecord = await RMCertificationModel.create(data);
          createData.push(newRecord);
          successEntries++;
        } else {
          existingRecords.push(existingRecord);
          failedEntries++;
        }
      } catch (error) {
        console.error("Error saving record:", error.message);
        failedEntries++;
      }
    }
    // Respond with success message and created data
    res.status(200).json({
      message: "Details added to RM services",
      data: createData,
      successEntries: successEntries,
      failedEntries: failedEntries,
      existingRecords: existingRecords
    });
  } catch (error) {
    console.error("Error creating/updating data:", error);
    res.status(500).send("Error creating/updating data");
  }
});

router.post('/post-rmservices-from-listview' , async(req,res)=>{
  const { dataToSend } = req.body;
  try{
    const existingRecord = await RMCertificationModel.findOne({
      "Company Name" : dataToSend["Company Name"],
      serviceName : dataToSend.serviceName
    })
    if(existingRecord){
         res.status(400).json({message : "Service has already been added"})
    }else{
      const createdRecord = await RMCertificationModel.create(dataToSend);
      res.status(200).json({
        message:"Details added successfully"
      })
    }
  }catch(error){
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', details: error.message });
    }

    // For all other errors, send a 500 status code
    res.status(500).json({ message: "Error swapping services", details: error.message });
  }

})

router.get(`/rm-sevicesgetrequest` , async(req , res)=>{
    try{
        const response = await RMCertificationModel.find()
        res.status(200).json(response)

    }catch(error){
        console.log("Error creating data" , error)
        res.status(500).send({message : "Internal Server Error"})
    }
})

router.delete(`/delete-rm-services` , async(req,res)=>{
  const { companyName , serviceName } = req.body;
  try{
    const response = await RMCertificationModel.findOneAndDelete(
      {
        "Company Name" : companyName,
        serviceName : serviceName
      }
    )
    if(response){
      res.status(200).json({message : "Record Deleted Succesfully" , deletedData : response})
    }else{
      res.status(400).json({message : "Record Not Found"})
    }

  }catch(error){
    res.status(500).json({message : "Internal Server Error"})
  }
})


  module.exports = router;