var express = require('express');
var router = express.Router()
const dotenv = require('dotenv')
dotenv.config();
const CompanyModel = require("../models/Leads.js");

router.get('/', async function(req,res){
    try{
        res.status(200).json({message:"running"})
    }catch(err){
        console.log('Error logging in with OAuth2 user', err);
    }

})

router.post("/manual", async (req, res) => {
    const receivedData = req.body;
    //console.log("receiveddata" , receivedData)
  
    // console.log(receivedData);
  
    try {
      const employee = new CompanyModel(receivedData);
      const savedEmployee = await employee.save();
      // console.log("Data sent");
      res
        .status(200)
        .json(savedEmployee || { message: "Data sent successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
      console.error("Error saving employee:", error.message);
    }
  })

  router.get('/getIds', async (req, res) => {
    try {
      const { dataStatus } = req.query;
  
      let query = {};
      if (dataStatus === 'Unassigned') {
        query = { ename: 'Not Alloted' };
      } else if (dataStatus === 'Assigned') {
        query = { ename: { $ne: 'Not Alloted' } };
      }
  
      // Query the collection to get only the _id fields
      const getId = await CompanyModel.find(query, '_id');
  
      // Extract the _id values into an array
      const allIds = getId.map(doc => doc._id);
  
      // Send the array of IDs as a response
      res.status(200).json(allIds);
    } catch (error) {
      console.error('Error fetching IDs:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

  module.exports = router;