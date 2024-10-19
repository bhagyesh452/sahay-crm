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


// router.post("/update-remarks/:id", async (req, res) => {
//   const { id } = req.params;
//   const { Remarks } = req.body;

//   try {
//     // Update remarks and fetch updated data in a single operation
//     await CompanyModel.findByIdAndUpdate(id, { Remarks: Remarks });

//     await TeamLeadsModel.findByIdAndUpdate(id, { Remarks: Remarks });

//     // Fetch updated data and remarks history
//     const updatedCompany = await CompanyModel.findById(id);
//     const remarksHistory = await RemarksHistory.find({ companyId: id });

//     res.status(200).json({ updatedCompany, remarksHistory });
//   } catch (error) {
//     console.error("Error updating remarks:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// router.post("/remarks-history/:companyId", async (req, res) => {
//   const { companyId } = req.params;
//   const { Remarks, bdeName, currentCompanyName } = req.body;

//   // Get the current date and time
//   const currentDate = new Date();
//   const time = `${currentDate.getHours()}:${currentDate.getMinutes()}`;
//   const date = currentDate.toISOString().split("T")[0]; // Get the date in YYYY-MM-DD format

//   try {
//     // Create a new RemarksHistory instance
//     const newRemarksHistory = new RemarksHistory({
//       time,
//       date,
//       companyID: companyId,
//       remarks: Remarks,
//       bdeName: bdeName,
//       companyName: currentCompanyName,
//       //bdmName: remarksBdmName,
//     });

//     //await TeamLeadsModel.findByIdAndUpdate(companyId, { bdmRemarks: Remarks });

//     // Save the new entry to MongoDB
//     await newRemarksHistory.save();
//     res.json({ success: true, message: "Remarks history added successfully" });
//   } catch (error) {
//     console.error("Error adding remarks history:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// });

// ------------------------------------------update-remarks-bdm-------------------------

router.post("/update-remarks/:id", async (req, res) => {
  const { id } = req.params;
  const { Remarks, bdeName, currentCompanyName, designation } = req.body;

  // Get the current date and time
  const currentDate = new Date();
  const time = `${currentDate.getHours()}:${currentDate.getMinutes()}`;
  const date = currentDate.toISOString().split("T")[0]; // Get the date in YYYY-MM-DD format

  try {
    // Update remarks in both CompanyModel and TeamLeadsModel
    await CompanyModel.findByIdAndUpdate(id, { Remarks: Remarks });
    await TeamLeadsModel.findByIdAndUpdate(id, { Remarks: Remarks });

    // Create a new RemarksHistory instance
    const newRemarksHistory = new RemarksHistory({
      time,
      date,
      companyID: id,
      remarks: Remarks,
      bdeName: bdeName,
      companyName: currentCompanyName,
    });

    // Save the new remarks history entry to MongoDB
    await newRemarksHistory.save();

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

    console.log(designation, newCompleteRemarks)

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
    const updatedCompany = await CompanyModel.findById(id);
    const remarksHistory = await RemarksHistory.find({ companyID: id });

    // Send the updated company and remarks history data back to the client
    res.status(200).json({ updatedCompany, remarksHistory });
  } catch (error) {
    console.error("Error updating remarks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --------------------------------remarks-history-bdm-------------------------------------

// router.post("/update-remarks-bdm/:id", async (req, res) => {
//   const { id } = req.params;
//   const { Remarks } = req.body;

//   try {
//     // Update remarks and fetch updated data in a single operation
//     await CompanyModel.findByIdAndUpdate(id, { bdmRemarks: Remarks });

//     await TeamLeadsModel.findByIdAndUpdate(id, { bdmRemarks: Remarks });

//     // Fetch updated data and remarks history
//     const updatedCompany = await CompanyModel.findById(id);
//     const remarksHistory = await RemarksHistory.find({ companyId: id });

//     res.status(200).json({ updatedCompany, remarksHistory });
//   } catch (error) {
//     console.error("Error updating remarks:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });


// router.post("/remarks-history-bdm/:companyId", async (req, res) => {
//   const { companyId } = req.params;
//   const { Remarks, remarksBdmName, currentCompanyName } = req.body;

//   // Get the current date and time
//   const currentDate = new Date();
//   const time = `${currentDate.getHours()}:${currentDate.getMinutes()}`;
//   const date = currentDate.toISOString().split("T")[0]; // Get the date in YYYY-MM-DD format

//   try {
//     // Create a new RemarksHistory instance
//     const newRemarksHistory = new RemarksHistory({
//       time,
//       date,
//       companyID: companyId,
//       bdmRemarks: Remarks,
//       bdmName: remarksBdmName,
//       companyName: currentCompanyName,
//     });

//     await TeamLeadsModel.findByIdAndUpdate(companyId, { bdmRemarks: Remarks });

//     // Save the new entry to MongoDB
//     await newRemarksHistory.save();
//     res.json({ success: true, message: "Remarks history added successfully" });
//   } catch (error) {
//     console.error("Error adding remarks history:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// });

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

    // Create a new RemarksHistory instance
    const newRemarksHistory = new RemarksHistory({
      time,
      date,
      companyID: id,
      bdmRemarks: Remarks,
      bdmName: remarksBdmName,
      companyName: currentCompanyName,
    });

    // Save the new entry to RemarksHistory collection
    await newRemarksHistory.save();
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

    console.log(designation, newCompleteRemarks)

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


router.delete("/delete-remarks-history/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Update remarks and fetch updated data in a single operation

    // Fetch updated data and remarks history
    const remarksHistory = await RemarksHistory.findByIdAndDelete({
      companyId: id,
    });

    res.status(200).json({ updatedCompany, remarksHistory });
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
    console.log("id", id, remarksHistory)
    res.json(remarksHistory);
  } catch (error) {
    console.error("Error fetching remarks history:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.delete("/remarks-history/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await RemarksHistory.findByIdAndDelete(id);
    res.json({ success: true, message: "Remarks deleted successfully" });
  } catch (error) {
    console.error("Error deleting remark:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;