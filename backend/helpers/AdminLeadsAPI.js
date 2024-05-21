var express = require('express');
var router = express.Router()
const dotenv = require('dotenv')
dotenv.config();
const CompanyModel = require("../models/Leads.js");
const RecentUpdatesModel = require('../models/RecentUpdates.js')
const { exec } = require("child_process");



router.get('/', async function(req,res){
    try{
        res.status(200).json({message:"running"})
    }catch(err){
        console.log('Error logging in with OAuth2 user', err);
    }

})
router.post("/exportLeads/", async (req, res) => {
  try {
    const selectedIds = req.body;

    const leads = await CompanyModel.find({
      _id: { $in: selectedIds },
    });

    const csvData = [];
    // Push the headers as the first row
    csvData.push([
      "SR. NO",
      "Company Name",
      "Company Number",
      "Company Email",
      "Company Incorporation Date  ",
      "City",
      "State",
      "Company Address",
      "Director Name(First)",
      "Director Number(First)",
      "Director Email(First)",
      "Director Name(Second)",
      "Director Number(Second)",
      "Director Email(Second)",
      "Director Name(Third)",
      "Director Number(Third)",
      "Director Email(Third)",
      "ename",
      "AssignDate",
      "Status",
      "Remarks",
    ]);

    // Push each lead as a row into the csvData array
    leads.forEach((lead, index) => {
      const rowData = [
        index + 1,
        lead["Company Name"],
        lead["Company Number"],
        lead["Company Email"],
        lead["Company Incorporation Date  "],
        lead["City"],
        lead["State"],
        `"${lead["Company Address"]}"`,
        lead["Director Name(First)"],
        lead["Director Number(First)"],
        lead["Director Email(First)"],
        lead["Director Name(Second)"],
        lead["Director Number(Second)"],
        lead["Director Email(Second)"],
        lead["Director Name(Third)"],
        lead["Director Number(Third)"],
        lead["Director Email(Third)"],
        lead["AssignDate"],
        lead["Status"],
        `"${lead["Remarks"]}"`,
      ];
      csvData.push(rowData);
      // console.log("rowData:" , rowData)
    });

    // Use fast-csv to stringify the csvData array
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=UnAssignedLeads_Admin.csv"
    );

    const csvString = csvData.map((row) => row.join(",")).join("\n");
    // Send response with CSV data
    // Send response with CSV data
    //console.log(csvString)
    res.status(200).end(csvString);
    // console.log(csvString)
    // Here you're ending the response
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});


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

  router.post("/postAssignData", async (req, res) => {
    const { employeeSelection, selectedObjects, title, date, time } = req.body;
    // If not assigned, post data to MongoDB or perform any desired action
    const updatePromises = selectedObjects.map((obj) => {
      // Add AssignData property with the current date
      const updatedObj = {
        ...obj,
        ename: employeeSelection,
        AssignDate: new Date(),
      };
      return CompanyModel.updateOne({ _id: obj._id }, updatedObj);
    });
  
    // Add the recent update to the RecentUpdatesModel
    const newUpdate = new RecentUpdatesModel({
      title: title,
      date: date,
      time: time,
    });
    await newUpdate.save();
  
    // Execute all update promises
    await Promise.all(updatePromises);
  
    res.json({ message: "Data posted successfully" });
  });

  router.delete("/deleteAdminSelectedLeads", async (req, res) => {
    const { selectedRows } = req.body;
  
    try {
      // Use Mongoose to delete rows by their IDs
      await CompanyModel.deleteMany({ _id: { $in: selectedRows } });
      res.status(200).json({
        message:
          "Rows deleted successfully and backup created successfully.",
      });
      // Trigger backup on the server
      // exec(
      //   `mongodump --db AdminTable --collection newcdatas --out ${process.env.BACKUP_PATH}`,
      //   (error, stdout, stderr) => {
      //     if (error) {
      //       console.error("Error creating backup:", error);
      //       // Respond with an error if backup fails
      //       res.status(500).json({ error: "Error creating backup." });
      //     } else {
      //       // console.log("Backup created successfully:", stdout);
      //       // Respond with success message if backup is successful
      //       res.status(200).json({
      //         message:
      //           "Rows deleted successfully and backup created successfully.",
      //       });
      //     }
      //   }
      // );
    } catch (error) {
      console.error("Error deleting rows:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.get('/searchCompany', async (req, res) => {
    try {
      const { id } = req.query;
  
      // Check if ID is provided and is a valid MongoDB ObjectId
  
      // Search for the company in the database
      const company = await CompanyModel.findById(id);
  
      // Return the company data
      res.status(200).json(company);
    } catch (error) {
      console.error('Error searching for company:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
  

  module.exports = router;