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

// router.post('/post-rmservicesdata', async (req, res) => {
//     const { dataToSend } = req.body;
//     const publishDate = new Date();
//     console.log("data" , dataToSend)
//     try {
//       const sheetData = { ...dataToSend, bookingPublishDate: publishDate };
//       const createData = await RMCertificationModel.create(sheetData);
//       console.log("created" , createData)
//       res.status(200).json({ message: "Details added to RM services", data: createData });
//     } catch (error) {
//       console.error("Error creating/updating data:", error);
//       res.status(500).send("Error creating/updating data");
//     }
//   });

  router.post('/post-rmservicesdata', async (req, res) => {
  const { dataToSend } = req.body;
  const publishDate = new Date();
  //console.log("Received data:", dataToSend); // Log received data to inspect

  try {
    const sheetData = dataToSend.map(item=>({
        ...item,
        bookingPublishDate:publishDate,
    }))
    const createData = await RMCertificationModel.insertMany(sheetData)
    //console.log("Created:", createData);

    // Respond with success message and created data
    res.status(200).json({ message: "Details added to RM services", data: createData });
  } catch (error) {
    console.error("Error creating/updating data:", error);
    res.status(500).send("Error creating/updating data");
  }
});

router.get(`/rm-sevicesgetrequest` , async(req , res)=>{
    try{
        const response = await RMCertificationModel.find()
        res.status(200).json(response)

    }catch(error){
        console.log("Error creating data" , error)
        res.status(500).send({message : "Internal Server Error"})
    }
})


  module.exports = router;