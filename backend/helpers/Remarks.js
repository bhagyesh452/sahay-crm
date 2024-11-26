var express = require('express');
var router = express.Router()
const dotenv = require('dotenv')
dotenv.config();

const CompanyModel = require("../models/Leads");
// const authRouter = require('./helpers/Oauth');
// const requestRouter = require('./helpers/request');
const RemarksHistory = require("../models/RemarksHistory");
const TeamLeadsModel = require("../models/TeamLeads.js");
const CompleteRemarksHistoryLeads = require('../models/CompleteRemarksHistoryLeads.js');
const axios = require('axios');





router.post("/update-remarks/:id", async (req, res) => {
  const { id } = req.params;
  const { Remarks, bdeName, currentCompanyName, designation } = req.body;
  const socketIO = req.io;

  // Get the current date and time
  const currentDate = new Date();
  const time = `${currentDate.getHours()}:${currentDate.getMinutes()}`;
  const date = currentDate.toISOString().split("T")[0]; // Get the date in YYYY-MM-DD format

  try {
    // Update remarks in both CompanyModel and TeamLeadsModel
    await CompanyModel.findByIdAndUpdate(id, { Remarks: Remarks });
    await TeamLeadsModel.findByIdAndUpdate(id, { Remarks: Remarks });

    // New object to be pushed
    const newCompleteRemarks = {
      companyID: id,
      "Company Name": currentCompanyName,
      employeeName: bdeName,
      designation: designation,
      remarks: Remarks,
      bdeName: bdeName,
      addedOn: new Date()
    };



    // Find existing remarks history for the company
    const existingCompleteRemarksHistory = await CompleteRemarksHistoryLeads.findOne({ companyID: id })
      .select("companyID"); // Only select companyID and remarks

    if (existingCompleteRemarksHistory) {

      // Check if the remarks array exists, and if not, initialize it
      if (!existingCompleteRemarksHistory.remarks) {
        existingCompleteRemarksHistory.remarks = [];
      }
      const saveEntry = await CompleteRemarksHistoryLeads.findOneAndUpdate(
        {
          companyID: id
        },
        {
          $push: {
            remarks: [newCompleteRemarks]

          }
        }
      )
    } else {
      // If the company doesn't exist, create a new entry with the new object
      const newCompleteRemarksHistory = new CompleteRemarksHistoryLeads({
        companyID: id,
        "Company Name": currentCompanyName,
        remarks: [newCompleteRemarks], // Store the general remarks
      });

      await newCompleteRemarksHistory.save();
    }
    // Fetch updated data and remarks history
    const updatedCompany = await CompanyModel.findById(id).lean();
    const remarksHistory = await RemarksHistory.find({ companyID: id }).lean();

    // Send the updated company and remarks history data back to the client
    socketIO.emit("employee__remarks_successfull_update", {
      message: `Status updated to "Not Interested" for company: ${updatedCompany["Company Name"]}`,
      updatedDocument: updatedCompany,
      ename : updatedCompany.ename
    })
    res.status(200).json({ updatedCompany, remarksHistory });
  } catch (error) {
    console.error("Error updating remarks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --------------------------------remarks-history-bdm-------------------------------------


router.post("/update-remarks-bdm/:id", async (req, res) => {
  const { id } = req.params;
  const { Remarks, remarksBdmName, currentCompanyName, designation, bdmWork } = req.body;

  // Get the current date and time
  const currentDate = new Date();
  const time = `${currentDate.getHours()}:${currentDate.getMinutes()}`;
  const date = currentDate.toISOString().split("T")[0]; // Get the date in YYYY-MM-DD format

  try {
    // Update bdmRemarks in both CompanyModel and TeamLeadsModel
    await CompanyModel.findByIdAndUpdate(id, { bdmRemarks: Remarks });
    await TeamLeadsModel.findByIdAndUpdate(id, { bdmRemarks: Remarks });

    // New object to be pushed
    const newCompleteRemarks = {
      companyID: id,
      "Company Name": currentCompanyName,
      employeeName: remarksBdmName,
      designation: designation,
      bdmRemarks: Remarks,
      bdmName: remarksBdmName,
      bdmWork: bdmWork,
      addedOn: new Date()
    };



    // Find existing remarks history for the company
    const existingCompleteRemarksHistory = await CompleteRemarksHistoryLeads.findOne({ companyID: id })
      .select("companyID"); // Only select companyID and remarks

    if (existingCompleteRemarksHistory) {
      console.log(existingCompleteRemarksHistory, id)
      // Check if the remarks array exists, and if not, initialize it
      if (!existingCompleteRemarksHistory.remarks) {
        existingCompleteRemarksHistory.remarks = [];
      }
      const saveEntry = await CompleteRemarksHistoryLeads.findOneAndUpdate({
        companyID: id
      },
        {
          $push: {
            remarks: [newCompleteRemarks]

          }
        })
      console.log(saveEntry)
    } else {
      // If the company doesn't exist, create a new entry with the new object
      const newCompleteRemarksHistory = new CompleteRemarksHistoryLeads({
        companyID: id,
        "Company Name": currentCompanyName,
        remarks: [newCompleteRemarks], // Store the general remarks
      });

      await newCompleteRemarksHistory.save();
    }

    // Fetch updated company data and remarks history
    const updatedCompany = await CompanyModel.findById(id);
    const remarksHistory = await RemarksHistory.find({ companyID: id });

    // Send the updated company and remarks history data back to the client
    res.status(200).json({ updatedCompany, remarksHistory });
  } catch (error) {
    console.error("Error updating bdmRemarks and adding to remarks history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/delete-bdm-remarks/:companyId", async (req, res) => {
  try {
    const { companyId } = req.params;
    const { remarksId } = req.query;

    console.log("Company ID is:", companyId);
    console.log("Remarks ID is:", remarksId);

    // Find the document by companyId
    const data = await CompleteRemarksHistoryLeads.findOne({ companyID: companyId });

    // Check if the company and remarks exist
    if (!data || !data.remarks || data.remarks.length === 0) {
      return res.status(404).json({ message: "Company or remarks not found." });
    }

    // Find the index of the remark to be deleted
    const remarkIndex = data.remarks.findIndex(remark => remark._id.toString() === remarksId);

    // If the remark is not found
    if (remarkIndex === -1) {
      return res.status(404).json({ message: "Remark not found." });
    }

    // Remove the remark from the array
    data.remarks.splice(remarkIndex, 1);

    // Save the updated document after removing the remark
    await data.save();

    // Check if the remarks array is empty after deletion
    let updatedBdmRemarks;
    if (data.remarks.length === 0) {
      // If no remarks left, set 'No Remarks Added' in the company collection
      updatedBdmRemarks = "No Remarks Added";
    } else {
      // If there are remarks left, use the bdmRemarks from the last remaining remark
      updatedBdmRemarks = data.remarks[data.remarks.length - 1].bdmRemarks;
    }

    // Update the company collection's bdmRemarks field
    await CompanyModel.findOneAndUpdate(
      { _id: companyId },
      { bdmRemarks: updatedBdmRemarks },
      { new: true }
    );

    console.log("Updated data after deletion:", data);

    // Return success response
    return res.status(200).json({
      message: "Remark deleted successfully.",
      updatedRemarks: data.remarks,
      updatedBdmRemarks
    });
  } catch (error) {
    console.error("Error deleting remark:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


router.delete("/delete-remarks-history/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Update remarks and fetch updated data in a single operation

    // Fetch updated data and remarks history
    const remarksHistory = await RemarksHistory.findByIdAndDelete({
      companyId: id,
    });

    res.status(200).json({ updatedCompany, remarksHistory, updatedLeadHistory });
  } catch (error) {
    console.error("Error updating remarks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/remarks-delete/:companyId", async (req, res) => {
  const { companyId } = req.params;

  try {
    // Find the company by companyId and update the remarks field
    const updatedCompany = await CompanyModel.findByIdAndUpdate(
      companyId,
      { Remarks: "No Remarks Added" },
      { new: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    res
      .status(200)
      .json({ message: "Remarks deleted successfully", updatedCompany });
  } catch (error) {
    console.error("Error deleting remarks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// -------------------------------bdm-remarks-delete--------------------------------------

router.delete("/remarks-delete-bdm/:companyId", async (req, res) => {
  const { companyId } = req.params;

  try {
    // Find the company by companyId and update the remarks field
    const updatedCompany = await TeamLeadsModel.findByIdAndUpdate(
      companyId,
      { bdmRemarks: "No Remarks Added" },
      { new: true }
    );

    const updatedCompanyMainModel = await CompanyModel.findByIdAndUpdate(
      companyId,
      { bdmRemarks: "No Remarks Added" },
      { new: true }
    );

    if (!updatedCompany || !updatedCompanyMainModel) {
      return res.status(404).json({ message: "Company not found" });
    }

    res
      .status(200)
      .json({ message: "Remarks deleted successfully", updatedCompany });
  } catch (error) {
    console.error("Error deleting remarks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// -------------------------------  Feedback Remarks  -----------------------------------

router.post("/post-feedback-remarks/:companyId", async (req, res) => {
  const companyId = req.params.companyId;
  const feedbackPoints = req.body.feedbackPoints;
  const feedbackRemarks = req.body.feedbackRemarks;
  //console.log("feedbackPoints" , feedbackPoints)
  try {
    await TeamLeadsModel.findByIdAndUpdate(companyId, {
      feedbackPoints: feedbackPoints,
      feedbackRemarks: feedbackRemarks,
    });

    await CompanyModel.findByIdAndUpdate(companyId, {
      feedbackPoints: feedbackPoints,
      feedbackRemarks: feedbackRemarks,
    });

    res.status(200).json({ message: "Feedback updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/post-feedback-remarks/:companyId", async (req, res) => {
  const companyId = req.params.companyId;
  const { feedbackPoints, feedbackRemarks } = req.body;

  try {
    await TeamLeadsModel.findByIdAndUpdate(companyId, {
      feedbackPoints: feedbackPoints,
      feedbackRemarks: feedbackRemarks,
    });

    await CompanyModel.findByIdAndUpdate(companyId, {
      feedbackPoints: feedbackPoints,
      feedbackRemarks: feedbackRemarks,
    });

    res.status(200).json({ message: "Feedback updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//  *************************************************   Remarks History   *************************************************************

router.get("/remarks-history", async (req, res) => {
  try {
    const remarksHistory = await RemarksHistory.find();
    res.json(remarksHistory);
  } catch (error) {
    console.error("Error fetching remarks history:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/remarks-history/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const remarksHistory = await RemarksHistory.find({ companyID: id });
    res.json(remarksHistory);
  } catch (error) {
    console.error("Error fetching remarks history:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
router.get("/remarks-history-complete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const remarksHistory = await CompleteRemarksHistoryLeads.find({ companyID: id });
    //console.log("id", id, remarksHistory)
    res.json(remarksHistory);
  } catch (error) {
    console.error("Error fetching remarks history:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/complete-new-remarks-history", async (req, res) => {
  try{
    const remarksHistory = await CompleteRemarksHistoryLeads.find();
    res.json(remarksHistory);
  }catch(error){
    console.error("Error fetching remarks history:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
 
})

router.delete("/remarks-history/:id", async (req, res) => {
  const { id } = req.params;
  const { companyId } = req.query;
  console.log("companyId", companyId, id)
  try {
    await RemarksHistory.findByIdAndDelete(id);
    //Now, find the corresponding document in CompleteRemarksHistoryLeads and remove the remark from the `remarks` array
    const updatedLeadHistory = await CompleteRemarksHistoryLeads.findOneAndUpdate(
      { companyID: companyId },
      { $pull: { remarks: { _id: id } } }, // Remove the remark from the remarks array
      { new: true } // Return the updated document
    );

    // // Check if the `remarks` array is empty after the deletion, and if so, optionally delete the document
    if (updatedLeadHistory.remarks.length === 0 && updatedLeadHistory.serviceWiseRemarks.length === 0) {
      await CompleteRemarksHistoryLeads.findOneAndDelete({ companyID: companyId });
    }
    res.json({ success: true, message: "Remarks deleted successfully" });
  } catch (error) {
    console.error("Error deleting remark:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post('/webhook', async(req, res) => {
  const { emp_numbers } = ["9054604529"];
  //console.log("empnumber", emp_numbers)
  // External API URL (without query parameters)
  
  const externalApiUrl = " https://api1.callyzer.co/v2/employee/get"; // Assuming the external API expects the data in the body, not in the URL

  try {
    // Fetch data from the external API using axios with GET request and body
    const apiKey = "bc4e10cf-23dd-47e6-a1a3-2dd889b6dd46";
    const response = await axios({
      method: 'GET',
      url: externalApiUrl,
      data: { emp_numbers }, // Send the data in the body of the GET request
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
    });

    // Send the response from the external API back to the client
    console.log(response.data)
    res.status(200).json(response.data);
  } catch (error) {
    // Handle any errors
    console.error('Error fetching data from external API:', error);
    res.status(500).json({ error: 'Failed to fetch data from external API' });
  }
});

module.exports = router;