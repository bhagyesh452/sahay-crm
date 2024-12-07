var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const cron = require('node-cron');
const CompanyModel = require("../models/Leads");
const RemarksHistory = require("../models/RemarksHistory");
const RecentUpdatesModel = require("../models/RecentUpdates");
const TeamLeadsModel = require("../models/TeamLeads.js");
const ProjectionModel = require("../models/NewProjections.js");
const { Parser } = require('json2csv');
const { State } = require('country-state-city');
const FollowUpModel = require('../models/FollowUp.js');
const adminModel = require("../models/Admin");
const jwt = require('jsonwebtoken');
const RedesignedDraftModel = require('../models/RedesignedDraftModel.js');
const RedesignedLeadformModel = require('../models/RedesignedLeadform.js');
const DeletedLeadsModel = require('../models/DeletedLeadsModel.js');
const LeadHistoryForInterestedandFollowModel = require('../models/LeadHistoryForInterestedandFollow.js');
const RMCertificationModel = require('../models/RMCertificationServices.js');
const AdminExecutiveModel = require('../models/AdminExecutiveModel.js');
const RedesignedLeadModel = require('../models/RedesignedLeadform.js');
const ForwardedLeadsModel = require('../models/FollowUp.js');
const DailyEmployeeProjection = require('../models/DailyEmployeeProjection.js');
const mongoose = require('mongoose');
const deletedEmployeeModel = require('../models/DeletedEmployee.js');

const secretKey = process.env.SECRET_KEY || "mydefaultsecret";

// const authenticateToken = (req, res, next) => {
//   console.log('Headers:', req.headers);
//   const authHeader = req.headers['Authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   console.log('Token:', token);

//   if (!token) {
//     console.log('No token provided');
//     return res.status(401).json({ message: "Access Denied" });
//   }

//   jwt.verify(token, secretKey, (err, user) => {
//     if (err) {
//       console.log('Token verification failed:', err.message);
//       return res.status(403).json({ message: "Invalid Token" });
//     }
//     req.user = user;
//     next();
//   });
// };

// 7. Read Muultiple Companies 
router.get("/leads", async (req, res) => {
  try {
    // Fetch data using lean queries to retrieve plain JavaScript objects
    const data = await CompanyModel.find().lean();

    res.send(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/leads/interestedleads", async (req, res) => {
  try {
    // Fetch all company names from LeadHistoryModel
    const leadHistoryCompany = await LeadHistoryForInterestedandFollowModel.distinct('Company Name')

    // Fetch companies from CompanyModel whose names are in leadCompanyNames
    const data = await CompanyModel.find({
      "Company Name": { $in: leadHistoryCompany }
    }).lean();

    res.send(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/leads/interestedleads/followupleads", async (req, res) => {
  try {
    // Fetch all company names from LeadHistoryModel
    const leadHistoryCompany = await LeadHistoryForInterestedandFollowModel.distinct('Company Name')

    // Fetch companies from CompanyModel whose names are in leadCompanyNames
    const data = await CompanyModel.find({
      Status: { $in: ["Interested", "FollowUp"] }
    }).lean();

    res.send(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/update-status/:id", async (req, res) => {
  const { id } = req.params;
  const { newStatus, title, date, time, oldStatus } = req.body;
  const socketIO = req.io;

  try {
    // Fetch the company and perform validations
    const company = await CompanyModel.findById(id)
      .lean()
    // .select({ "bdmAcceptStatus": 1, "Status": 1, "ename": 1, "Company Name": 1 });
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    let shouldEmitSocket = false; // Flag for socket emission
    const updates = {}; // Object to collect updates for CompanyModel
    const deleteStatuses = ["Matured", "Not Interested", "Busy", "Junk", "Untouched", "Not Picked Up"];
    const promises = []; // Array to collect all async operations

    // console.log("bdmAcceptStatus", company.bdmAcceptStatus, newStatus, company.Status);

    // Case: Not Interested with MaturedAccepted
    if (newStatus === "Not Interested" && (company.bdmAcceptStatus === "Accept")) {

      shouldEmitSocket = true; // Set flag for socket emission
      updates.lastActionDate = new Date();
      updates.bdmStatus = newStatus;
      // updates.bdmAcceptStatus = "NotForwarded";
      updates.Status = newStatus;
      // console.log("workinghere", updates)
      promises.push(
        CompanyModel.findByIdAndUpdate(id, {
          $set: updates,
          $unset: {
            // bdmStatus: newStatus , 
            previousStatusToUndo: ""
          },
        }),
        TeamLeadsModel.findByIdAndDelete(id)
      );
    } else if (newStatus === "Not Interested" && (company.bdmAcceptStatus === "MaturedAccepted")) {

      shouldEmitSocket = true; // Set flag for socket emission
      updates.lastActionDate = new Date();
      // updates.bdmStatus = newStatus;
      updates.bdmAcceptStatus = "NotForwarded";
      //updates.Status = newStatus;
      // console.log("workinghere", updates)
      promises.push(
        CompanyModel.findByIdAndUpdate(id, {
          $set: updates,
          $unset: {
            bdmStatus: "",
            previousStatusToUndo: ""
          },
        }),
        TeamLeadsModel.findByIdAndDelete(id)
      );
    }
    // Case: Busy/FollowUp/Interested with MaturedAccepted
    else if (
      ["Busy", "Not Picked Up", "FollowUp", "Interested"].includes(newStatus) &&
      company.bdmAcceptStatus === "MaturedAccepted"
    ) {
      updates.bdmStatus = newStatus;
      updates.lastActionDate = new Date();

      promises.push(
        CompanyModel.findByIdAndUpdate(id, {
          $set: updates,
        })
      );
    }
    // Default case
    else {
      updates.Status = newStatus;
      updates.AssignDate = new Date();
      updates.bdmStatus = newStatus;
      updates.lastActionDate = new Date();
      updates.previousStatusToUndo = company.Status;
      // console.log("workinghereelse", updates)
      promises.push(
        CompanyModel.findByIdAndUpdate(id, {
          $set: updates,
        })
      );
    }

    // Handle lead history for specific statuses
    if (deleteStatuses.includes(newStatus)) {
      promises.push(
        LeadHistoryForInterestedandFollowModel.deleteOne({
          "Company Name": company["Company Name"],
        })
      );
    } else if (["FollowUp", "Interested"].includes(newStatus)) {
      promises.push(
        LeadHistoryForInterestedandFollowModel.updateOne(
          { "Company Name": company["Company Name"] },
          {
            $set: {
              oldStatus: oldStatus || "Interested",
              newStatus: newStatus,
              date: new Date(),
              time: time,
            },
          },
          { upsert: true }
        )
      );
    }

    // Add a new entry in RecentUpdatesModel
    promises.push(
      RecentUpdatesModel.create({
        title: title || `Status updated for ${company["Company Name"]}`,
        "Company Name": company["Company Name"],
        ename: company.ename,
        oldStatus: oldStatus || company.Status,
        newStatus: newStatus,
        properDate: new Date(),
        date: date || new Date().toLocaleDateString(),
        time: time || new Date().toLocaleTimeString(),
        history: [
          {
            title: `Updated to ${newStatus}`,
            "Company Name": company["Company Name"],
            ename: company.ename,
            date: date || new Date().toLocaleDateString(),
            time: time || new Date().toLocaleTimeString(),
          },
        ],
      })
    );

    // Execute all async operations concurrently
    await Promise.all(promises);

    // Fetch the updated company document
    const updatedCompany = await CompanyModel.findById(id).lean();
    // Emit the socket message only if the flag is set
    if (shouldEmitSocket) {
      socketIO.emit("bdm-moved-to-notinterested", {
        message: `Status updated to "Not Interested" for company: ${company["Company Name"]}`,
        companyName: company["Company Name"],
        ename: company.ename,
        newStatus,
        date,
        time,
      });
    }
    // socketIO.emit("employee_lead_status_successfull_update", {
    //   message: `Status updated to "Not Interested" for company: ${company["Company Name"]}`,
    //   updatedDocument: updatedCompany,
    //   companyName: company["Company Name"],
    //   ename: company.ename,
    //   newStatus,
    //   date,
    //   time,
    // })
    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.post("/update-undo-status/:id", async (req, res) => {
  const { id } = req.params;
  const { newStatus, title, date, time, companyStatus, previousStatus, ename } = req.body;
  const socketIO = req.io;
  try {
    // Find the company by ID in the CompanyModel to get the company details
    const company = await CompanyModel.findById(id);
    const leadHistory = await LeadHistoryForInterestedandFollowModel.findById(id)
    let nextFollowUpDate = null;
    if (company) {
      // Look for the `nextFollowUpDate` field in all possible sub-objects
      nextFollowUpDate =
        company.interestedInformation?.clientWhatsAppRequest?.nextFollowUpDate ||
        company.interestedInformation?.clientEmailRequest?.nextFollowUpDate ||
        // company.interestedInformation.interestedInServices?.nextFollowUpDate ||
        // company.interestedInformation.interestedButNotNow?.nextFollowUpDate ||
        null;

      console.log("Extracted Next Follow-Up Date:", nextFollowUpDate);
    }

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    // Check if previousStatus is "Interested"
    if (previousStatus === "Interested") {
      // Find the object in the interestedInformation array that matches `ename`
      const info = company.interestedInformation.find(info => info.ename === ename);

      if (info) {
        console.log("info:", JSON.stringify(info, null, 2)); // Log the full `info` object for debugging

        // Check if `interestedInServices` or `interestedButNotNow` fields are effectively empty
        const isWhatsAppEmpty =
          !info.interestedInServices ||
          (Array.isArray(info.interestedInServices.servicesPitched) &&
            info.interestedInServices.servicesPitched.length === 0 &&
            Array.isArray(info.interestedInServices.servicesInterestedIn) &&
            info.interestedInServices.servicesInterestedIn.length === 0 &&
            !info.interestedInServices.remarks
            && !info.interestedInServices.nextFollowUpDate
            && !info.interestedInServices.offeredPrice
          );

        const isEmailEmpty =
          !info.interestedButNotNow ||
          (Array.isArray(info.interestedButNotNow.servicesPitched) &&
            info.interestedButNotNow.servicesPitched.length === 0 &&
            Array.isArray(info.interestedButNotNow.servicesInterestedIn) &&
            info.interestedButNotNow.servicesInterestedIn.length === 0 &&
            !info.interestedButNotNow.remarks
            && !info.interestedButNotNow.nextFollowUpDate
            && !info.interestedButNotNow.offeredPrice);

        console.log("isWhatsAppEmpty:", isWhatsAppEmpty); // Log result of WhatsApp check
        console.log("isEmailEmpty:", isEmailEmpty); // Log result of Email check

        if (isWhatsAppEmpty && isEmailEmpty) {
          // Return an error if both fields are empty
          return res.status(400).json({
            message:
              "Please ensure that either 'interestedInServices' or 'interestedButNotNow' fields are filled before undoing the status.",
          });
        }
      }
    }

    if (
      ["Busy", "Not Picked Up", "Not Interested", "Junk", "FollowUp"].includes(company.Status) &&
      ["Interested"].includes(previousStatus)
    ) {
      let leadHistory = await LeadHistoryForInterestedandFollowModel.findById(id);

      if (leadHistory) {
        // If the record exists, update old status, new status, date, and time
        leadHistory.oldStatus = "Interested";
        leadHistory.newStatus = company.Status; // Update with current status
        leadHistory.date = new Date();
        leadHistory.time = new Date().toLocaleTimeString();

        await leadHistory.save();
        console.log("Updated leadHistory:", leadHistory);
      } else {
        // If the record does not exist, create a new one
        leadHistory = new LeadHistoryForInterestedandFollowModel({
          _id: id,
          "Company Name": company["Company Name"],
          ename: company.ename,
          oldStatus: "Interested",
          newStatus: company.Status,
          date: new Date(),
          time: new Date().toLocaleTimeString(),
        });

        await leadHistory.save();
        console.log("Created new leadHistory:", leadHistory);
      }
    }
    // Check if `company.Status` is "Busy" and `previousStatus` matches the criteria
    if (
      ["Busy", "Not Picked Up", "Not Interested", "Junk", "FollowUp"].includes(company.Status) &&
      ["Interested", "Docs/Info Sent (W)", "Docs/Info Sent (E)", "Docs/Info Sent (W&E)"].includes(previousStatus)
    ) {
      await CompanyModel.findByIdAndUpdate(
        id,
        {
          $set: {
            Status: previousStatus, // Restore previous status
            lastActionDate: new Date(), // Update the last action date
            previousStatusToUndo: company.Status,
          },
        },
        { new: true } // Return the updated document
      );
    } else if (
      ["Docs/Info Sent (W)", "Docs/Info Sent (E)", "Docs/Info Sent (W&E)", "Interested"].includes(previousStatus)
    ) {
      // Find the index of the object in the array where `ename` matches
      const index = company.interestedInformation.findIndex(info => info.ename === ename);

      if (index !== -1) {
        // Prepare the update object to unset specific fields
        const updateQuery = {};
        updateQuery[`interestedInformation.${index}.interestedInServices`] = "";
        updateQuery[`interestedInformation.${index}.interestedButNotNow`] = "";

        // Update the company document with specific fields unset
        await CompanyModel.findByIdAndUpdate(
          id,
          {
            $set: {
              Status: previousStatus, // Restore previous status
              lastActionDate: new Date(), // Update the last action date
              previousStatusToUndo: company.Status,
              bdeNextFollowUpDate: nextFollowUpDate ? nextFollowUpDate : ""
            },
            $unset: updateQuery, // Unset specific fields
          },
          { new: true } // Return the updated document
        );
        if (leadHistory) {
          await LeadHistoryForInterestedandFollowModel.findByIdAndDelete(id);
        }
      }
    } else {
      // Remove the entire object from the array if `previousStatus` does not match the criteria
      await CompanyModel.findByIdAndUpdate(
        id,
        {
          $set: {
            Status: previousStatus, // Restore previous status
            lastActionDate: new Date(), // Update the last action date
            previousStatusToUndo: company.Status,
          },
          $pull: {
            interestedInformation: { ename: ename }, // Remove the entire object with matching `ename`
          },
        },

        { new: true } // Return the updated document
      );
      if (leadHistory) {
        await LeadHistoryForInterestedandFollowModel.findByIdAndDelete(id);
      }
    }

    // Create a new record in the `recent-updates` collection
    const newUpdate = await RecentUpdatesModel.create({
      title,
      "Company Name": company["Company Name"],
      ename,
      newStatus: previousStatus,
      oldStatus:newStatus || company.Status,
      properDate: new Date(),
      date: date || new Date().toISOString().substr(0, 10),
      time: time || new Date().toLocaleTimeString(),
      history: [{
        title,
        "Company Name": company["Company Name"],
        "Company Number": company["Company Number"],
        "Company Email": company["Company Email"],
        "Company Incorporation Date": company["Company Incorporation Date"],
        City: company.City,
        State: company.State,
        ename,
        date: date || new Date().toISOString().substr(0, 10),
        time: time || new Date().toLocaleTimeString(),
      }],
    });

    console.log("New Update Created:", newUpdate);

    const updatedCompany = await CompanyModel.findById(id);
    console.log("Updated Company:", updatedCompany);
    socketIO.emit("employee_lead_status_successfull_update", {
      message: `Status updated to "Not Interested" for company: ${company["Company Name"]}`,
      updatedDocument: updatedCompany,
      companyName: updatedCompany["Company Name"],
      ename: updatedCompany.ename,
      newStatus,
      date,
      time,
    })
    res.status(200).json({ message: "Status updated successfully", updatedCompany });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.get("/leadDataHistoryInterested/:ename", async (req, res) => {
  const { ename } = req.params;
  try {
    const lead = await LeadHistoryForInterestedandFollowModel.find({ ename: ename });

    // console.log("Lead Data:", lead);
    res.status(200).send(lead);
  } catch (error) {
    console.error("Error Fetching:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/leadDataHistoryInterested", async (req, res) => {
  try {
    const findAllLeads = await LeadHistoryForInterestedandFollowModel.find({})
    if (findAllLeads) {
      res.status(200).send(findAllLeads)
    }

  } catch (error) {
    console.error("Errorfetchingleads", error)
    res.status(500).json({ error: "Internal Server Error" })

  }
})



router.get("/specific-ename-status/:ename/:status", async (req, res) => {
  const ename = req.params.ename;
  const status = req.params.status;

  try {
    // Fetch data using lean queries to retrieve plain JavaScript objects
    if (status === "complete") {
      const data = await CompanyModel.find({ ename: ename }).lean();

      res.send(data);
      //console.log("Data" ,data)
    } else {
      const data = await CompanyModel.find({
        ename: ename,
        Status: status,
      }).lean();

      res.send(data);
      //console.log("Data" ,data)
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


// 2. Read a Company
router.get("/leads/:companyName", async (req, res) => {
  const companyName = req.params.companyName;
  try {
    // Fetch data using lean queries to retrieve plain JavaScript objects
    const data = await CompanyModel.findOne({
      "Company Name": companyName,
    }).lean();

    res.send(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 3. Update a Company 
router.put("/leads/:id", async (req, res) => {
  const id = req.params.id;
  const { data } = req.body
  let oldCompanyName = "";
  const socketIO = req.io;
  //req.body["Company Incorporation Date  "] = new Date(req.body["Company Incorporation Date  "]);

  try {
    req.body["Company Incorporation Date  "] = new Date(
      req.body["Company Incorporation Date "]
    );

    const existingData = await CompanyModel.findById(id);
    oldCompanyName = existingData["Company Name"];

    const updatedData = await CompanyModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    // Update RMCertificationModel
    let updateRMCertificationCompanyDetails;
    if (existingData["Company Name"]) {
      updateRMCertificationCompanyDetails = await RMCertificationModel.updateMany(
        {
          $or: [
            { leadId: id },
            { "Company Name": oldCompanyName } // Fallback to company name
          ]
        },
        req.body
      );
    }

    // Update AdminExecutiveModel
    let updateAdminExecutiveCompanyDetails;
    if (existingData["Company Name"]) {
      updateAdminExecutiveCompanyDetails = await AdminExecutiveModel.updateMany(
        {
          $or: [
            { leadId: id },
            { "Company Name": oldCompanyName } // Fallback to company name
          ]
        },
        req.body
      );
    }


    const updateRedesignedLeadFormDetails = await RedesignedLeadModel.findOneAndUpdate(
      { company: id },
      req.body
    );

    // Prepare the new history record
    const newHistoryEntry = {
      title: `Name of ${existingData["Company Name"]} updated to ${req.body["Company Name"]}`,
      "Company Name": req.body["Company Name"],
      "Company Number": req.body["Company Number"],
      "Company Email": req.body["Company Email"],
      "Company Incorporation Date ": req.body["Company Incorporation Date "],
      City: req.body.City,
      State: req.body.State,
      ename: req.body.ename || "Unknown", // Handle if ename is not provided
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };

    // Check if the entry exists in RecentUpdatesModel
    let recentUpdate = await RecentUpdatesModel.findById(id);
    if (!recentUpdate) {
      // Create a new entry if it doesn't exist, with an empty history array
      recentUpdate = new RecentUpdatesModel({
        _id: existingData._id,
        title: `Name of ${existingData["Company Name"]} updated to ${req.body["Company Name"]}`,
        "Company Name": req.body["Company Name"],
        ename: req.body.ename || "Unknown",
        oldStatus: "Untouched",
        newStatus: "Untouched",
        properDate: new Date(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        history: [], // Empty history for new entries
      });
    }
    // Push the new history entry into the history array if the document already exists
    if (recentUpdate) {
      recentUpdate.history.push(newHistoryEntry);
      await recentUpdate.save();
    }
    if (!updatedData) {
      return res.status(404).json({ error: "Data not found" });
    }
    socketIO.emit("lead-updated-by-admin", {
      updatedDocument: updateRMCertificationCompanyDetails,
      updatedDocumentAdmin: updateAdminExecutiveCompanyDetails // send the updated document from RMCertificationModel
    });
    res.status(200).json({ message: "Data updated successfully", updatedData, updateRMCertificationCompanyDetails, updateAdminExecutiveCompanyDetails, updateRedesignedLeadFormDetails });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// 4. Delete a Company
router.delete("/leads/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Use findByIdAndDelete to delete the document by its ID
    const deletedData = await CompanyModel.findByIdAndDelete(id);
    if (!deletedData) {
      return res.status(404).json({ error: "Data not found" });
    }

    // Create a new entry in DeletedLeadsModel with the deleted data
    const deletedLead = {
      ...deletedData.toObject(), // Convert Mongoose document to a plain JavaScript object
      deletedAt: new Date(), // Add timestamp of deletion
    };

    // Insert the deleted lead into DeletedLeadsModel
    await DeletedLeadsModel.create(deletedLead);

    res.json({ message: "Data deleted successfully", deletedData });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/deleted-leads", async (req, res) => {
  try {
    const deletedLeads = await DeletedLeadsModel.find(); // Fetch data from the database
    res.status(200).json({
      message: "Data Fetched Successfully",
      data: deletedLeads, // Return the fetched data
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      message: "Failed to fetch data",
      error: error.message, // Include error message for debugging
    });
  }
});

router.post("/leads", async (req, res) => {
  const csvData = req.body;
  const currentDate = new Date();
  const time = `${currentDate.getHours()}:${currentDate.getMinutes()}`;
  const date = currentDate.toISOString().split("T")[0]; // Get the date in YYYY-MM-DD format

  let counter = 0;
  let successCounter = 0;
  let duplicateEntries = []; // Array to store duplicate entries

  try {
    for (const employeeData of csvData) {
      try {
        const employeeWithAssignData = {
          ...employeeData,
          "Company Name": employeeData["Company Name"].toUpperCase(),
        };

        const employee = new CompanyModel(employeeWithAssignData);
        const savedEmployee = await employee.save();

        if (employeeData.Remarks !== "") {
          const newRemarksHistory = new RemarksHistory({
            time,
            date,
            companyID: savedEmployee._id, // Use savedEmployee._id instead of employeeData._id
            remarks: employeeData.Remarks,
            bdeName: employeeData.ename, // Ensure this is coming from employeeData
            companyName: employeeData["Company Name"],
          });

          await newRemarksHistory.save();
        }

        successCounter++;
      } catch (error) {
        duplicateEntries.push(employeeData);
        console.error("Error saving employee:", error.message);
        counter++;
      }
    }

    if (duplicateEntries.length > 0) {
      const json2csvParser = new Parser();
      const csvString = json2csvParser.parse(duplicateEntries);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=DuplicateEntries.csv"
      );
      res.status(200).end(csvString);
    } else {
      res.status(200).json({
        message: "Data sent successfully",
        counter: counter,
        successCounter: successCounter,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.error("Error in bulk save:", error.message);
  }
});

router.delete("/newcompanynamedelete/:ename", async (req, res) => {
  const ename = req.params.ename;
  console.log("id", ename);

  try {
    // // Find the employee's data by id
    // const employeeData = await deletedEmployeeModel.findOne({_id : id});
    // console.log("employee", employeeData)
    // if (!employeeData) {
    //   return res.status(404).json({ error: "Employee not found" });
    // }

    // Update companies where the employee's name matches
    await CompanyModel.updateMany(
      { ename: ename },
      {
        $set: {
          ename: "Not Alloted",
          bdmAcceptStatus: "NotForwarded",
          feedbackPoints: [],
          multiBdmName: [],
          Status: "Untouched",
        },
        $unset: {
          bdmName: "",
          bdeOldStatus: "",
          bdeForwardDate: "",
          bdmStatusChangeDate: "",
          bdmStatusChangeTime: "",
          bdmRemarks: "",
          RevertBackAcceptedCompanyRequest: ""
        },
      }
    );
    // Delete documents from TeamLeadsModel where the employee's name matches
    await TeamLeadsModel.deleteMany({ bdeName: ename });

    // Delete the corresponding document from CompanyModel collection
    //await CompanyModel.findByIdAndDelete(id);

    res.json({ message: "Employee data deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.put("/updateCompanyForDeletedEmployeeWithMaturedStatus/:id", async (req, res) => {
  const itemId = req.params.id;
  // console.log("Id is :", itemId);
  try {
    const employeeData = await CompanyModel.findById(itemId)

    console.log("employeeData", employeeData)

    //console.log(employeeData)
    if (!employeeData) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Update companies where the employee's name matches
    const data = await CompanyModel.updateMany(
      { ename: employeeData.ename },
      {
        $set: {
          multiBdmName: [...employeeData.multiBdmName, employeeData.ename],
          //Status: "Untouched",
          isDeletedEmployeeCompany: true
        },
        $unset: {
          // bdmName: "",
          // bdeOldStatus: "",
          // bdeForwardDate: "",
          // bdmStatusChangeDate: "",
          // bdmStatusChangeTime: "",
          // bdmRemarks: "",
          // RevertBackAcceptedCompanyRequest: ""
        },
      }
    );

    const data2 = await CompanyModel.updateMany(
      { bdmName: employeeData.bdmName },
      {
        $set: {
          //ename: "Not Alloted",
          bdmAcceptStatus: "Pending",
          //feedbackPoints: [],
          // multiBdmName: [...employeeData.multiBdmName, employeeData.ename],
          // //Status: "Untouched",
          // isDeletedEmployeeCompany: true
        },
      }
    );

    const data3 = await TeamLeadsModel.deleteMany(
      { bdmName: employeeData.bdmName }
    )
  } catch (error) {
    console.error("Error deleting employee data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// router.put("/updateBdmStatusAfterDeleting", async (req, res) => {
//   const { dataToDelete } = req.body; // Ensure dataToDelete is passed in the request body

//   try {

//       const bdmName = dataToDelete.ename;

//       // Update the BDMAcceptStatus to 'Pending' in the Company model
//       const updatedCompanies = await CompanyModel.updateMany(
//           { bdmName: bdmName },
//           { $set: { bdmAcceptStatus: 'Pending' } }
//       );

//       console.log("updatedCompanies" , updatedCompanies)

//       // Delete entries in the TeamLeads model where BDMName matches
//       const deletedTeamLeads = await TeamLeadsModel.deleteMany({ bdmName: bdmName });

//     res.status(200).json({
//           message: "BDM status updated and related team leads deleted successfully.",
//           updatedCompaniesCount: updatedCompanies.modifiedCount,
//           deletedTeamLeadsCount: deletedTeamLeads.deletedCount
//       });
//   } catch (error) {
//       console.error("Error updating BDM status or deleting team leads:", error);
//       res.status(500).json({ message: "An error occurred.", error });
//   }
// });


//8. Read Multiple companies New
router.get('/new-leads', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Page number
    const limit = parseInt(req.query.limit) || 500; // Items per page
    const skip = (page - 1) * limit; // Number of documents to skip
    const { dataStatus, sort, sortPattern } = req.query;
    //console.log(sort)
    // Query the database to get paginated data
    let query = {};

    if (dataStatus === "Unassigned") {
      query = { ename: "Not Alloted" };
    } else if (dataStatus === "Assigned") {
      query = { $and: [{ ename: { $ne: "Not Alloted" } }, { ename: { $ne: "Extracted" } }] };
    } else if (dataStatus === "Extracted") {
      query = { ename: "Extracted" };
    }

    let sortQuery = {};
    if (sort && sortPattern === 'IncoDate' && (sort === 'ascending' || sort === 'descending')) {
      if (sort === 'ascending') {
        sortQuery = { "Company Incorporation Date  ": 1 }; // Sort in ascending order by Company Incorporation Date
      } else {
        sortQuery = { "Company Incorporation Date  ": -1 }; // Sort in descending order by Company Incorporation Date
      }
    } else if (sort && sortPattern === 'AssignDate' && (sort === 'ascending' || sort === 'descending')) {
      if (sort === 'ascending') {
        sortQuery = { AssignDate: 1 }; // Sort in ascending order by Company Incorporation Date
      } else {
        sortQuery = { AssignDate: -1 }; // Sort in descending order by Company Incorporation Date
      }
    }

    let employees;
    if (Object.keys(sortQuery).length !== 0) {
      employees = await CompanyModel.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit).lean();
    } else {
      employees = await CompanyModel.find(query)
        .sort({ AssignDate: -1 }) // Default sorting in descending order by AssignDate
        .skip(skip)
        .limit(limit).lean();
    }

    // Get total count of documents for pagination
    const unAssignedCount = await CompanyModel.countDocuments({ ename: "Not Alloted" });
    const assignedCount = await CompanyModel.countDocuments({
      $and: [{ ename: { $ne: "Not Alloted" } }, { ename: { $ne: "Extracted" } }]
    });
    const extractedCount = await CompanyModel.countDocuments({ ename: "Extracted" });
    const totalCount = await CompanyModel.countDocuments(query);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Return paginated data along with pagination metadata
    res.json({
      data: employees,
      currentPage: page,
      totalPages: totalPages,
      unAssignedCount: unAssignedCount,
      assignedCount: assignedCount,
      extractedCount: extractedCount
    });
  } catch (error) {
    console.error('Error fetching employee data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/new-leads/interested-followup', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Page number
    const limit = parseInt(req.query.limit) || 500; // Items per page
    const skip = (page - 1) * limit; // Number of documents to skip
    const { dataStatus, sort, sortPattern } = req.query;
    //console.log(sort)
    // Query the database to get paginated data
    let query = {};
    const leadHistoryCompany = await LeadHistoryForInterestedandFollowModel.distinct('Company Name')
    if (dataStatus === "Unassigned") {
      query = { ename: "Not Alloted" };
    } else if (dataStatus === "Assigned") {
      query = {
        $and: [
          { ename: { $ne: "Not Alloted" } },
          { ename: { $ne: "Extracted" } },
          { Status: { $in: ["Interested", "FollowUp"] } },
          { "Company Name": { $in: leadHistoryCompany } }
        ]
      };
    } else if (dataStatus === "Extracted") {
      query = { ename: "Extracted" };
    }

    let sortQuery = {};
    if (sort && sortPattern === 'IncoDate' && (sort === 'ascending' || sort === 'descending')) {
      if (sort === 'ascending') {
        sortQuery = { "Company Incorporation Date  ": 1 }; // Sort in ascending order by Company Incorporation Date
      } else {
        sortQuery = { "Company Incorporation Date  ": -1 }; // Sort in descending order by Company Incorporation Date
      }
    } else if (sort && sortPattern === 'AssignDate' && (sort === 'ascending' || sort === 'descending')) {
      if (sort === 'ascending') {
        sortQuery = { AssignDate: 1 }; // Sort in ascending order by Company Incorporation Date
      } else {
        sortQuery = { AssignDate: -1 }; // Sort in descending order by Company Incorporation Date
      }
    }

    let employees;
    if (Object.keys(sortQuery).length !== 0) {
      employees = await CompanyModel.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit).lean();
    } else {
      employees = await CompanyModel.find(query)
        .sort({ AssignDate: -1 }) // Default sorting in descending order by AssignDate
        .skip(skip)
        .limit(limit).lean();
    }

    // Get total count of documents for pagination
    const unAssignedCount = await CompanyModel.countDocuments({ ename: "Not Alloted" });
    const assignedCount = await CompanyModel.countDocuments({
      $and: [
        { ename: { $ne: "Not Alloted" } },
        { ename: { $ne: "Extracted" } },
        { Status: { $in: ["Interested", "FollowUp"] } },
        { "Company Name": { $in: leadHistoryCompany } }
      ]
    });
    const extractedCount = await CompanyModel.countDocuments({ ename: "Extracted" });
    const totalCount = await CompanyModel.countDocuments(query);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Return paginated data along with pagination metadata
    res.json({
      data: employees,
      currentPage: page,
      totalPages: totalPages,
      unAssignedCount: unAssignedCount,
      assignedCount: assignedCount,
      extractedCount: extractedCount
    });
  } catch (error) {
    console.error('Error fetching employee data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
function timePassedSince(dateTimeString) {
  const entryTime = new Date(dateTimeString);
  const now = new Date();

  // Calculate difference in milliseconds
  const diffMs = now - entryTime;

  // Convert milliseconds to minutes and hours
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Format the difference
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  }
}

// CSV Download Route
// router.get('/download-csv', async (req, res) => {
//   try {
//     // Query to find distinct company names in lead history
//     const leadHistoryCompany = await LeadHistoryForInterestedandFollowModel.distinct('Company Name');

//     // Main query to fetch companies with specific status
//     const query = {
//       $and: [
//         { Status: { $in: ["Interested", "FollowUp"] } },
//         { "Company Name": { $in: leadHistoryCompany } }
//       ]
//     };

//     // Fetch employees based on the query
//     const employees = await CompanyModel.find(query)
//       .sort({ AssignDate: -1 }) // Sort by AssignDate
//       .lean();

//     // Check if there are any employees to download
//     if (!employees || employees.length === 0) {
//       return res.status(404).json({ error: 'No data available for CSV download' });
//     }

//     // Fetch lead history data for the matched companies
//     const leadHistoryData = await LeadHistoryForInterestedandFollowModel.find({
//       'Company Name': { $in: leadHistoryCompany }
//     }).lean(); // Adjust field selection based on your model

//     // Create a map for quick access to lead history dates
//     const leadHistoryMap = leadHistoryData.reduce((acc, item) => {
//       acc[item['Company Name']] = item.date; // Assuming 'date' is the correct field name
//       return acc;
//     }, {});

//     // Format the data (e.g., format dates and include leadHistoryDate and Age)
//     const formattedEmployees = employees.map(emp => {
//       const statusModificationDate = leadHistoryMap[emp["Company Name"]];
//       return {
//         ...emp,
//         "Company Incorporation Date": emp["Company Incorporation Date  "] ? new Date(emp["Company Incorporation Date  "]).toLocaleDateString() : '',
//         "AssignDate": emp.AssignDate ? new Date(emp.AssignDate).toLocaleDateString() : '',
//         "Status Modification Date": statusModificationDate ? new Date(statusModificationDate).toLocaleDateString() : '', // Include leadHistoryDate
//         "Age": statusModificationDate ? timePassedSince(statusModificationDate) : '' ,// Calculate Age,
//         "BDM Forwarded" :(emp.bdmAcceptStatus === "Pending" || emp.bdmAcceptStatus === "Forwarded" || emp.bdmAcceptStatus === "Accept") ?
//           "Yes" : "No",
//           "BDM Name": emp.bdmName ? emp.bdmName : "-",
//           "BDE Forward Date" : emp.bdeForwardDate ? new Date(emp.bdeForwardDate).toLocaleDateString() : "-",
//           'Forwarded Age': (emp.bdmAcceptStatus === "Pending" || emp.bdmAcceptStatus === "Forwarded" || emp.bdmAcceptStatus === "Accept") ? timePassedSince(emp.bdeForwardDate) : "-",
//       };
//     });

//     // Transform the data into a format suitable for CSV
//     const fields = [
//       'Company Name',
//       'Company Number',
//       'Company Email',
//       'Company Incorporation Date', // Adjust header name if needed
//       'City',
//       'State',
//       'ename',
//       'Status',
//       'UploadedBy',
//       'AssignDate',
//       'Status Modification Date', // Change to match the new field name
//       'Age', // Add Age to the fields
//       'BDM Forwarded',
//       'BDM Name',
//       'BDE Forward Date',
//       'Forwarded Age'
//     ];

//     const json2csvParser = new Parser({ fields });
//     const csv = json2csvParser.parse(formattedEmployees);

//     // Set headers to prompt for download
//     res.header('Content-Type', 'text/csv');
//     res.attachment('companies.csv'); // The file will be downloaded as 'companies.csv'
//     res.send(csv);
//   } catch (error) {
//     console.error('Error generating CSV:', error);
//     res.status(500).json({ error: 'Failed to generate CSV' });
//   }
// });

router.get('/download-csv', async (req, res) => {
  try {
    const leadHistoryCompany = await LeadHistoryForInterestedandFollowModel.distinct('Company Name');

    const query = {
      $and: [
        { Status: { $in: ["Interested", "FollowUp"] } },
        { "Company Name": { $in: leadHistoryCompany } }
      ]
    };

    const employees = await CompanyModel.find(query)
      .sort({ AssignDate: -1 })
      .lean();

    if (!employees || employees.length === 0) {
      return res.status(404).json({ error: 'No data available for CSV download' });
    }

    const leadHistoryData = await LeadHistoryForInterestedandFollowModel.find({
      'Company Name': { $in: leadHistoryCompany }
    }).lean();

    const leadHistoryMap = leadHistoryData.reduce((acc, item) => {
      acc[item['Company Name']] = item.date;
      return acc;
    }, {});

    const formattedEmployees = employees.map(emp => {
      const statusModificationDate = leadHistoryMap[emp["Company Name"]];
      return {
        ...emp,
        "Company Incorporation Date": emp["Company Incorporation Date  "]
          ? new Date(emp["Company Incorporation Date  "]).toISOString().split('T')[0]
          : '',
        "AssignDate": emp.AssignDate
          ? new Date(emp.AssignDate).toISOString().split('T')[0]
          : '',
        "Status Modification Date": statusModificationDate
          ? new Date(statusModificationDate).toISOString().split('T')[0]
          : '',
        "Age": statusModificationDate
          ? timePassedSince(statusModificationDate)
          : '',
        "BDM Forwarded": (emp.bdmAcceptStatus === "Pending" || emp.bdmAcceptStatus === "Forwarded" || emp.bdmAcceptStatus === "Accept")
          ? "Yes"
          : "No",
        "BDM Name": emp.bdmName || "-",
        "BDE Forward Date": emp.bdeForwardDate
          ? new Date(emp.bdeForwardDate).toISOString().split('T')[0]
          : "-",
        'Forwarded Age': (emp.bdmAcceptStatus === "Pending" || emp.bdmAcceptStatus === "Forwarded" || emp.bdmAcceptStatus === "Accept")
          ? timePassedSince(emp.bdeForwardDate)
          : "-",
      };
    });

    const fields = [
      'Company Name',
      'Company Number',
      'Company Email',
      'Company Incorporation Date',
      'City',
      'State',
      'ename',
      'Status',
      'UploadedBy',
      'AssignDate',
      'Status Modification Date',
      'Age',
      'BDM Forwarded',
      'BDM Name',
      'BDE Forward Date',
      'Forwarded Age'
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(formattedEmployees);

    res.header('Content-Type', 'text/csv');
    res.attachment('companies.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error generating CSV:', error);
    res.status(500).json({ error: 'Failed to generate CSV' });
  }
});




//-------------------api to filter leads-----------------------------------

router.get('/filter-leads', async (req, res) => {
  const {
    selectedStatus,
    lastExtractedStatus,
    selectedState,
    selectedNewCity,
    selectedBDEName,
    selectedAssignDate,
    selectedUploadedDate,
    selectedExtractedDate,
    selectedAdminName,
    selectedYear,
    monthIndex,
    selectedCompanyIncoDate,
    selectedBdmName,
    selectedBdeForwardDate,
    selectedFowradedStatus,
    selectedStatusModificationDate,
    isInterestedSection
  } = req.query;

  const page = parseInt(req.query.page) || 1; // Page number
  const limit = parseInt(req.query.limit) || 500; // Items per page
  const skip = (page - 1) * limit; // Number of documents to skip

  try {
    let baseQuery = {};

    // Construct query object based on filters
    if (selectedStatus) baseQuery.Status = selectedStatus;
    if (lastExtractedStatus) baseQuery.lastStatusOfExtractedEmployee = lastExtractedStatus;
    if (selectedState) baseQuery.State = selectedState;
    if (selectedNewCity) baseQuery.City = selectedNewCity;
    if (selectedBdmName) baseQuery.bdmName = selectedBdmName;

    if (selectedFowradedStatus === "Yes") {
      baseQuery.bdmAcceptStatus = {
        $in: ["Forwarded", "Pending", "Accept"]
      };
    } else if (selectedFowradedStatus === "No") {
      baseQuery.bdmAcceptStatus = "NotForwarded";
    }

    if (selectedAssignDate) {
      baseQuery.AssignDate = {
        $gte: new Date(selectedAssignDate).toISOString(),
        $lt: new Date(new Date(selectedAssignDate).setDate(new Date(selectedAssignDate).getDate() + 1)).toISOString()
      };
    }

    if (selectedAdminName && selectedAdminName.trim() !== '') {
      baseQuery.UploadedBy = new RegExp(`^${selectedAdminName.trim()}$`, 'i');
    }

    if (selectedUploadedDate) {
      baseQuery.UploadDate = {
        $gte: new Date(selectedUploadedDate).toISOString(),
        $lt: new Date(new Date(selectedUploadedDate).setDate(new Date(selectedUploadedDate).getDate() + 1)).toISOString()
      };
    }

    if (selectedExtractedDate) {
      baseQuery.extractedDate = {
        $gte: new Date(selectedExtractedDate).toISOString(),
        $lt: new Date(new Date(selectedExtractedDate).setDate(new Date(selectedExtractedDate).getDate() + 1)).toISOString()
      };
    }

    if (selectedBdeForwardDate) {
      const dateString = new Date(selectedBdeForwardDate).toDateString(); // "Tue Sep 03 2024"
      baseQuery.bdeForwardDate = new RegExp(`^${dateString}`, 'i'); // Matches the start of the string
    }

    if (selectedYear) {
      if (monthIndex !== '0') {
        const year = parseInt(selectedYear);
        const month = parseInt(monthIndex) - 1; // JavaScript months are 0-indexed
        const monthStartDate = new Date(year, month, 1);
        const monthEndDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
        baseQuery["Company Incorporation Date  "] = {
          $gte: monthStartDate,
          $lt: monthEndDate
        };
      } else {
        const yearStartDate = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
        const yearEndDate = new Date(`${selectedYear}-12-31T23:59:59.999Z`);
        baseQuery["Company Incorporation Date  "] = {
          $gte: yearStartDate,
          $lt: yearEndDate
        };
      }
    }

    if (selectedCompanyIncoDate) {
      const selectedDate = new Date(selectedCompanyIncoDate);
      const isEpochDate = selectedDate.getTime() === new Date('1970-01-01T00:00:00Z').getTime();
      if (isEpochDate) {
        baseQuery["Company Incorporation Date  "] = null;
      } else {
        baseQuery["Company Incorporation Date  "] = {
          $gte: new Date(selectedDate).toISOString(),
          $lt: new Date(new Date(selectedDate).setDate(selectedDate.getDate() + 1)).toISOString()
        };
      }
    }

    // If selectedStatusModificationDate is provided, query LeadHistoryModel and find corresponding companies
    if (selectedStatusModificationDate) {
      const matchingLeadHistory = await LeadHistoryForInterestedandFollowModel.find({
        date: {
          $gte: new Date(new Date(selectedStatusModificationDate).setHours(0, 0, 0, 0)).toISOString(),
          $lt: new Date(new Date(selectedStatusModificationDate).setHours(23, 59, 59, 999)).toISOString()
        }
      });
      const companyNames = matchingLeadHistory.map(lead => lead["Company Name"]);

      if (companyNames.length > 0) {
        baseQuery["Company Name"] = { $in: companyNames };
      } else {
        return res.status(200).json({
          assigned: [],
          unassigned: [],
          extracted: [],
          extractedDataCount: 0,
          totalAssigned: 0,
          totalUnassigned: 0,
          totalPages: 0,
          currentPage: page
        });
      }
    }

    // Now, perform the query on CompanyModel
    let extractedData = [];
    let extractedDataCount = 0;
    if (!selectedBDEName || selectedBDEName.trim() === '') {
      let extractedQuery = { ...baseQuery, ename: "Extracted" };
      extractedDataCount = await CompanyModel.countDocuments(extractedQuery);
      extractedData = await CompanyModel.find(extractedQuery).skip(skip).limit(limit).lean();
    }

    // Fetch assigned data
    let assignedQuery = { ...baseQuery, ename: { $nin: ['Not Alloted', 'Extracted'] } };
    if (selectedBDEName && selectedBDEName.trim() !== '') {
      assignedQuery.ename = new RegExp(`^${selectedBDEName.trim()}$`, 'i');
    }

    const assignedCount = await CompanyModel.countDocuments(assignedQuery);
    const assignedData = await CompanyModel.find(assignedQuery).skip(skip).limit(limit).lean();

    // Fetch unassigned data only if selectedBDEName is not specified
    let unassignedData = [];
    let unassignedCount = 0;
    if (!selectedBDEName || selectedBDEName.trim() === '') {
      let unassignedQuery = { ...baseQuery, ename: 'Not Alloted' };
      unassignedCount = await CompanyModel.countDocuments(unassignedQuery);
      unassignedData = await CompanyModel.find(unassignedQuery).skip(skip).limit(limit).lean();
    }

    res.status(200).json({
      assigned: assignedData,
      unassigned: unassignedData,
      extracted: extractedData,
      extractedDataCount: extractedDataCount,
      totalAssigned: assignedCount,
      totalUnassigned: unassignedCount,
      totalPages: Math.ceil((assignedCount + unassignedCount) / limit),  // Calculate total pages
      currentPage: page  // Current page number
    });

  } catch (error) {
    console.error('Error searching leads:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/filter-leads/interestedleads', async (req, res) => {
  const {
    selectedStatus,
    selectedState,
    selectedNewCity,
    selectedBDEName,
    selectedAssignDate,
    selectedUploadedDate,
    selectedExtractedDate,
    selectedAdminName,
    selectedYear,
    monthIndex,
    selectedCompanyIncoDate,
    selectedBdmName,
    selectedBdeForwardDate,
    selectedFowradedStatus,
    selectedStatusModificationDate
  } = req.query;

  const page = parseInt(req.query.page) || 1; // Page number
  const limit = parseInt(req.query.limit) || 500; // Items per page
  const skip = (page - 1) * limit; // Number of documents to skip

  try {
    let baseQuery = {};

    // Add base filters
    if (selectedStatus) baseQuery.Status = selectedStatus;
    if (selectedState) baseQuery.State = selectedState;
    if (selectedNewCity) baseQuery.City = selectedNewCity;
    if (selectedBdmName) baseQuery.bdmName = selectedBdmName;

    // Handle forwarded status
    if (selectedFowradedStatus === "Yes") {
      baseQuery.bdmAcceptStatus = { $in: ["Forwarded", "Pending", "Accept"] };
    } else if (selectedFowradedStatus === "No") {
      baseQuery.bdmAcceptStatus = "NotForwarded";
    }

    // Handle date filters
    if (selectedAssignDate) {
      baseQuery.AssignDate = {
        $gte: new Date(selectedAssignDate).toISOString(),
        $lt: new Date(new Date(selectedAssignDate).setDate(new Date(selectedAssignDate).getDate() + 1)).toISOString(),
      };
    }

    if (selectedUploadedDate) {
      baseQuery.UploadDate = {
        $gte: new Date(selectedUploadedDate).toISOString(),
        $lt: new Date(new Date(selectedUploadedDate).setDate(new Date(selectedUploadedDate).getDate() + 1)).toISOString(),
      };
    }

    if (selectedBdeForwardDate) {
      const dateString = new Date(selectedBdeForwardDate).toDateString();
      baseQuery.bdeForwardDate = new RegExp(`^${dateString}`, 'i');
    }

    // Handle company incorporation date filter
    if (selectedYear) {
      if (monthIndex !== '0') {
        const year = parseInt(selectedYear);
        const month = parseInt(monthIndex) - 1;
        const monthStartDate = new Date(year, month, 1);
        const monthEndDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
        baseQuery["Company Incorporation Date  "] = {
          $gte: monthStartDate,
          $lt: monthEndDate,
        };
      } else {
        const yearStartDate = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
        const yearEndDate = new Date(`${selectedYear}-12-31T23:59:59.999Z`);
        baseQuery["Company Incorporation Date  "] = {
          $gte: yearStartDate,
          $lt: yearEndDate,
        };
      }
    }

    if (selectedCompanyIncoDate) {
      const selectedDate = new Date(selectedCompanyIncoDate);
      const isEpochDate = selectedDate.getTime() === new Date('1970-01-01T00:00:00Z').getTime();
      if (isEpochDate) {
        baseQuery["Company Incorporation Date  "] = null;
      } else {
        baseQuery["Company Incorporation Date  "] = {
          $gte: new Date(selectedDate).toISOString(),
          $lt: new Date(new Date(selectedDate).setDate(selectedDate.getDate() + 1)).toISOString(),
        };
      }
    }

    // Handle status modification date filter
    if (selectedStatusModificationDate) {
      // console.log("modificationdate", selectedStatusModificationDate);
      const matchingLeadHistory = await LeadHistoryForInterestedandFollowModel.find({
        date: {
          $gte: new Date(new Date(selectedStatusModificationDate).setHours(0, 0, 0, 0)).toISOString(),
          $lt: new Date(new Date(selectedStatusModificationDate).setHours(23, 59, 59, 999)).toISOString(),
        },
      });

      const companyNamesFromStatusModification = matchingLeadHistory.map((lead) => lead["Company Name"]);

      if (companyNamesFromStatusModification.length > 0) {
        // Combine with existing Company Name filter
        if (baseQuery["Company Name"]) {
          baseQuery["Company Name"] = {
            $in: [...new Set([...baseQuery["Company Name"].$in, ...companyNamesFromStatusModification])],
          };
        } else {
          baseQuery["Company Name"] = { $in: companyNamesFromStatusModification };
        }
      }
    } else {
      // If selectedStatusModificationDate is not provided, use the general company query
      const leadHistoryCompanies = await LeadHistoryForInterestedandFollowModel.distinct('Company Name');

      if (leadHistoryCompanies.length > 0) {
        if (baseQuery["Company Name"]) {
          baseQuery["Company Name"] = {
            $in: [...new Set([...baseQuery["Company Name"].$in, ...leadHistoryCompanies])],
          };
        } else {
          baseQuery["Company Name"] = { $in: leadHistoryCompanies };
        }
      }
    }

    // Now apply selectedBDEName filter if it exists
    if (selectedBDEName && selectedBDEName.trim() !== '') {
      baseQuery.ename = new RegExp(`^${selectedBDEName.trim()}$`, 'i');
    }

    // Fetch extracted, assigned, and unassigned data...
    let extractedData = [];
    let extractedDataCount = 0;
    if (!selectedBDEName || selectedBDEName.trim() === '') {
      let extractedQuery = { ...baseQuery, ename: "Extracted" };
      extractedDataCount = await CompanyModel.countDocuments(extractedQuery);
      extractedData = await CompanyModel.find(extractedQuery).skip(skip).limit(limit).lean();
    }
    // Fetch assigned data
    let assignedQuery = { ...baseQuery, ename: { $nin: ['Not Alloted', 'Extracted'] } };
    if (selectedBDEName && selectedBDEName.trim() !== '') {
      assignedQuery.ename = new RegExp(`^${selectedBDEName.trim()}$`, 'i');
    }

    const assignedCount = await CompanyModel.countDocuments(assignedQuery);
    const assignedData = await CompanyModel.find(assignedQuery).skip(skip).limit(limit).lean();

    // Fetch unassigned data only if selectedBDEName is not specified
    let unassignedData = [];
    let unassignedCount = 0;
    if (!selectedBDEName || selectedBDEName.trim() === '') {
      let unassignedQuery = { ...baseQuery, ename: 'Not Alloted' };
      unassignedCount = await CompanyModel.countDocuments(unassignedQuery);
      unassignedData = await CompanyModel.find(unassignedQuery).skip(skip).limit(limit).lean();
    }

    // Send response
    res.status(200).json({
      assigned: assignedData,
      unassigned: unassignedData,
      extracted: extractedData,
      extractedDataCount: extractedDataCount,
      totalAssigned: assignedCount,
      totalUnassigned: unassignedCount,
      totalPages: Math.ceil((assignedCount + unassignedCount) / limit),
      currentPage: page,
    });

  } catch (error) {
    console.error('Error searching leads:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




router.get('/filter-employee-leads', async (req, res) => {
  const {
    employeeName,
    selectedStatus,
    selectedState,
    selectedNewCity,
    selectedYear,
    monthIndex,
    selectedAssignDate,
    selectedCompanyIncoDate,
  } = req.query;

  const page = parseInt(req.query.page) || 1; // Page number

  try {
    let baseQuery = {};

    // Ensure the query is filtered by employeeName
    if (employeeName) {
      baseQuery.$or = [
        { ename: employeeName }
      ];

      if (selectedStatus === 'Matured') {
        baseQuery.$or.push(
          { multiBdmName: { $in: [employeeName] } },
          { maturedBdmName: employeeName }
        );
      }
    }

    // Add other filters only if employeeName is present
    if (selectedStatus) baseQuery.Status = selectedStatus;
    if (selectedState) baseQuery.State = selectedState;
    if (selectedNewCity) baseQuery.City = selectedNewCity;
    // console.log("selectedAssignDate", selectedAssignDate)

    if (selectedYear) {
      if (monthIndex !== '0') {

        const year = parseInt(selectedYear);
        const month = parseInt(monthIndex) - 1; // JavaScript months are 0-indexed
        const monthStartDate = new Date(year, month, 1);
        const monthEndDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
        baseQuery["Company Incorporation Date  "] = {
          $gte: monthStartDate,
          $lt: monthEndDate
        };
      } else {
        const yearStartDate = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
        const yearEndDate = new Date(`${selectedYear}-12-31T23:59:59.999Z`);
        baseQuery["Company Incorporation Date  "] = {
          $gte: yearStartDate,
          $lt: yearEndDate
        };
      }
    }
    if (selectedCompanyIncoDate) {
      baseQuery["Company Incorporation Date  "] = {
        $gte: new Date(selectedCompanyIncoDate).toISOString(),
        $lt: new Date(new Date(selectedCompanyIncoDate).setDate(new Date(selectedCompanyIncoDate).getDate() + 1)).toISOString()
      };
    }
    if (selectedAssignDate) {
      baseQuery.AssignDate = {
        $gte: new Date(selectedAssignDate).toISOString(),
        $lt: new Date(new Date(selectedAssignDate).setDate(new Date(selectedAssignDate).getDate() + 1)).toISOString()
      };
    }

    // console.log("basequery" , baseQuery);


    const data = await CompanyModel.find(baseQuery).lean();
    // console.log("data" , data.length)

    res.status(200).json(data);
  } catch (error) {
    console.error('Error searching leads:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function escapeRegex(string) {
  return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

router.get('/search-leads', async (req, res) => {
  try {
    const { searchQuery } = req.query;
    const page = parseInt(req.query.page) || 1; // Page number
    const limit = parseInt(req.query.limit) || 500; // Items per page
    const skip = (page - 1) * limit; // Number of documents to skip


    let searchResults;
    let assignedData = [];
    let assignedCount = 0;
    let unassignedData = [];
    let unassignedCount = 0;
    let extractedData = [];
    let extractedDataCount = 0;


    if (searchQuery) {
      const searchTerm = searchQuery.trim();
      let query = {};

      if (searchTerm !== '') {
        if (!isNaN(searchTerm)) {
          // query = { 'Company Number': searchTerm };  // Search by exact number
          query.$expr = { $regexMatch: { input: { $toString: "$Company Number" }, regex: searchQuery, options: "i" } }; // Search by partial number
        } else {
          const escapedSearchTerm = escapeRegex(searchTerm);
          query = {
            $or: [
              { 'Company Name': { $regex: new RegExp(escapedSearchTerm, 'i') } },
              { 'Company Email': { $regex: new RegExp(escapedSearchTerm, 'i') } },
              // Add other fields you want to search with the query here
              // For example: { anotherField: { $regex: new RegExp(escapedSearchTerm, 'i') } }
            ]
          };
        }
      }

      let extractedQuery = { ...query, ename: "Extracted" }
      extractedDataCount = await CompanyModel.countDocuments(extractedQuery);
      extractedData = await CompanyModel.find(extractedQuery).skip(skip).limit(limit).lean();

      // Fetch assigned data
      let assignedQuery = { ...query, ename: { $nin: ["Not Alloted", "Extracted"] } };
      assignedCount = await CompanyModel.countDocuments(assignedQuery);
      assignedData = await CompanyModel.find(assignedQuery).skip(skip).limit(limit).lean();

      // Fetch unassigned data
      let unassignedQuery = { ...query, ename: 'Not Alloted' };
      unassignedCount = await CompanyModel.countDocuments(unassignedQuery);
      unassignedData = await CompanyModel.find(unassignedQuery).skip(skip).limit(limit).lean();
    }
    // else {
    //   searchResults = await CompanyModel.find().limit(500).lean();
    // }

    res.status(200).json({
      assigned: assignedData,
      unassigned: unassignedData,
      extracted: extractedData,
      extractedDataCount: extractedDataCount,
      totalAssigned: assignedCount,
      totalUnassigned: unassignedCount,
      totalPages: Math.ceil((assignedCount + unassignedCount) / limit),
      currentPage: page,
    });

    //console.log(assignedCount , unassignedCount)

  } catch (error) {
    console.error("Error searching leads", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

//10. Search for Specific Company
router.get("/specific-company/:companyId", async (req, res) => {
  try {
    const companyId = req.params.companyId;
    // Assuming CompanyModel.findById() is used to find a company by its ID
    const company = await CompanyModel.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.json(company);
  } catch (error) {
    console.error("Error fetching company:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



//11. Assign company to new employee
// router.post("/assign-new", async (req, res) => {
//   const { data } = req.body;
//   const { ename } = req.body;
//   //console.log("data" , data)
//   //console.log("ename" , ename
//   try {
//     // Add AssignDate property with the current date
//     for (const employeeData of data) {
//       //console.log("employee" , employeeData)
//       try {
//         const companyName = employeeData["Company Name"];
//         const employee = await CompanyModel.findOneAndUpdate(
//           { "Company Name": companyName }, 
//           { $set: 
//             { 
//               ename: ename,
//               bdmAcceptStatus:"NotForwarded",
//               feedbackPoints:[],
//               multiBdmName:[],
//               Status:"Untouched"
//              },
//              $unset:{
//               bdmName:"",
//               bdeOldStatus:"",
//               bdeForwardDate:""
//              }

//         });

//         const deleteTeams = await TeamLeadsModel.findByIdAndDelete(employee._id);
//         const deleteFoolowUp = await FollowUpModel.findOneAndDelete(employee["Company Name"])
//         //console.log("newemployee" , employee)
//         await RemarksHistory.deleteOne({ companyID: employee._id });

//         //console.log("saved" , savedEmployee)

//       } catch (error) {

//         //console.log("kuch h ye" , duplicateEntries);
//         console.error("Error Assigning Data:", error.message);

//       }
//     }
//     res.status(200).json({ message: "Data updated successfully" });
//   } catch (error) {
//     console.error("Error updating data:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// router.post("/assign-new", async (req, res) => {
//   const { data, ename } = req.body;

//   try {
//     const bulkOperations = data.map((employeeData) => ({
//       updateOne: {
//         filter: { "Company Name": employeeData["Company Name"] },
//         update: {
//           $set: {
//             ename: ename,
//             bdmAcceptStatus: "NotForwarded",
//             feedbackPoints: [],
//             multiBdmName: [...employeeData.multiBdmName, employeeData.ename],
//             Status: "Untouched",
//             AssignDate: new Date()
//           },
//           $unset: {
//             bdmName: "",
//             bdeOldStatus: "",
//             bdeForwardDate: "",
//             bdmStatusChangeDate: "",
//             bdmStatusChangeTime: "",
//             bdmRemarks: "",
//             RevertBackAcceptedCompanyRequest: ""
//           },
//         },
//       },
//     }));

//     // Perform bulk write operation
//     await CompanyModel.bulkWrite(bulkOperations);

//     // Perform deletions in TeamLeadsModel and FollowUpModel
//     const deletionPromises = data.map(async (employeeData) => {
//       const companyName = employeeData["Company Name"];
//       const employee = await CompanyModel.findOne({ "Company Name": companyName });

//       if (employee) {
//         await TeamLeadsModel.findByIdAndDelete(employee._id);
//         await FollowUpModel.findOneAndDelete({ companyName: employee["Company Name"] });
//         await RemarksHistory.deleteOne({ companyID: employee._id });
//       }
//     });



//     // Execute all deletion promises
//     await Promise.all(deletionPromises);

//     res.status(200).json({ message: "Data updated successfully" });
//   } catch (error) {
//     console.error("Error updating data:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

router.post("/assign-new", async (req, res) => {
  const { data, ename } = req.body;

  try {
    const bulkOperations = data.map((employeeData) => {
      let updateFields;
      if (employeeData.Status === 'Matured') {
        updateFields = {
          ename: ename,
          bdmAcceptStatus: "NotForwarded",
          feedbackPoints: [],
          multiBdmName: [...employeeData.multiBdmName, employeeData.ename],
          Status: "Untouched",
          AssignDate: new Date(),
          isDeletedEmployeeCompany: true,
        }
      } else {
        updateFields = {
          ename: ename,
          bdmAcceptStatus: "NotForwarded",
          feedbackPoints: [],
          multiBdmName: [...employeeData.multiBdmName, employeeData.ename],
          Status: "Untouched",
          AssignDate: new Date(),
          extractedDate: ename === "Extracted" ? new Date() : null,
          lastAssignedEmployee: ename === "Extracted" ? employeeData.ename : null,
          extractedMultipleBde: employeeData.extractedMultipleBde && Array.isArray(employeeData.extractedMultipleBde)
            ? [...employeeData.extractedMultipleBde, employeeData.ename]
            : [employeeData.ename],
        }
      }
      return {
        updateOne: {
          filter: { "Company Name": employeeData["Company Name"] },
          update: {
            $set: updateFields,
            $unset: {
              bdmName: "",
              bdeOldStatus: "",
              bdeForwardDate: "",
              bdmStatusChangeDate: "",
              bdmStatusChangeTime: "",
              bdmRemarks: "",
              RevertBackAcceptedCompanyRequest: "",
              Remarks: ""
            },
          },
        },
      };
    });

    // Perform bulk write operation
    await CompanyModel.bulkWrite(bulkOperations);

    // Perform deletions in TeamLeadsModel and FollowUpModel
    const deletionPromises = data.map(async (employeeData) => {
      const companyName = employeeData["Company Name"];
      const employee = await CompanyModel.findOne({ "Company Name": companyName });

      if (employee) {
        await TeamLeadsModel.findByIdAndDelete(employee._id);
        await FollowUpModel.findOneAndDelete({ companyName: employee["Company Name"] });
        await RemarksHistory.deleteOne({ companyID: employee._id });
        await LeadHistoryForInterestedandFollowModel.findOneAndDelete({ "Company Name": employee["Company Name"] })
        await RedesignedLeadformModel.findOneAndUpdate(
          { "Company Name": employee["Company Name"] },  // Filter criteria
          { $set: { isDeletedEmployeeCompany: true } }  // Update operation
        );
      }
    });

    // Execute all deletion promises
    await Promise.all(deletionPromises);

    res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.post(`/post-bdenextfollowupdate/:id`, async (req, res) => {
  const companyId = req.params.id;
  const bdeNextFollowUpDate = new Date(req.body.bdeNextFollowUpDate);
  const socketIO = req.io;
  //console.log(bdeNextFollowUpDate);
  try {
    await CompanyModel.findByIdAndUpdate(companyId, {
      bdeNextFollowUpDate: bdeNextFollowUpDate,
    });

    const updatedCompany = await CompanyModel.findById(companyId).lean();
    socketIO.emit("employee__nextfollowupdate_successfull_update", {
      message: `Status updated to "Not Interested" for company: ${updatedCompany["Company Name"]}`,
      updatedDocument: updatedCompany,
      ename: updatedCompany.ename
    })
    res.status(200).json({ message: "Date Updated successfully" });
  } catch (error) {
    console.error("Error fetching Date:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/employees-data/:ename", async (req, res) => {
  try {
    const employeeName = req.params.ename;
    // console.log("Employee name:", employeeName);

    // Fetch data from CompanyModel where ename matches employeeName
    const data = await CompanyModel.find({
      $or: [
        { ename: employeeName },
        { $and: [{ maturedBdmName: employeeName }, { Status: "Matured" }] },
        { $and: [{ multiBdmName: { $in: [employeeName] } }, { Status: "Matured" }] }
      ]
    });

    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/employees/:ename", async (req, res) => {
  try {
    const employeeName = req.params.ename;
    // console.log("Employee name:", employeeName);

    // Fetch data from CompanyModel where ename matches employeeName
    const data = await CompanyModel.find({
      $or: [
        { ename: employeeName },
        { $and: [{ maturedBdmName: employeeName }, { Status: "Matured" }] },
        { $and: [{ multiBdmName: { $in: [employeeName] } }, { Status: "Matured" }] }
      ]
    });

    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/employees-interested/:ename", async (req, res) => {
  try {
    const employeeName = req.params.ename;
    const search = req.query.search ? req.query.search.toLowerCase() : ""; // Extract the search query

    // Base query for employee-related data
    let baseQuery = {
      ename: employeeName,
      $or: [
        { ename: employeeName },
        { $and: [{ maturedBdmName: employeeName }, { Status: "Matured" }] },
        { $and: [{ multiBdmName: { $in: [employeeName] } }, { Status: "Matured" }] },
      ],
    };

    // Apply searching for company name
    if (search !== "") {
      const escapedSearch = escapeRegex(search);

      baseQuery = {
        $and: [
          baseQuery,
          {
            $or: [
              { "Company Name": { $regex: new RegExp(escapedSearch, "i") } },
              { "Company Email": { $regex: new RegExp(escapedSearch, "i") } },
              {
                $expr: {
                  $regexMatch: {
                    input: { $toString: "$Company Number" },
                    regex: `^${escapedSearch}`,
                    options: "i",
                  },
                },
              },
            ],
          },
        ],
      };
    }

    const interestedData = await CompanyModel.find({
      ...baseQuery,
      bdmAcceptStatus: { $in: ["NotForwarded", undefined] },
      Status: { $in: ["Interested", "FollowUp"] },
    })
      .sort({ lastActionDate: -1 }) // Sort by last action date in descending order
      .lean();

    res.status(200).json({
      interestedData,
      totalCount: interestedData.length, // Include total count of fetched data
    });
  } catch (error) {
    console.error("Error fetching Interested data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/employees-general/:ename", async (req, res) => {
  try {
    const employeeName = req.params.ename;
    const search = req.query.search ? req.query.search.toLowerCase() : ""; // Extract the search query

    // Base query for employee-related data
    let baseQuery = {
      ename: employeeName,
      $or: [
        { ename: employeeName },
        { $and: [{ maturedBdmName: employeeName }, { Status: "Matured" }] },
        { $and: [{ multiBdmName: { $in: [employeeName] } }, { Status: "Matured" }] },
      ],
    };

    // Apply searching for company name
    if (search !== "") {
      const escapedSearch = escapeRegex(search);

      baseQuery = {
        $and: [
          baseQuery,
          {
            $or: [
              { "Company Name": { $regex: new RegExp(escapedSearch, "i") } },
              { "Company Email": { $regex: new RegExp(escapedSearch, "i") } },
              {
                $expr: {
                  $regexMatch: {
                    input: { $toString: "$Company Number" },
                    regex: `^${escapedSearch}`,
                    options: "i",
                  },
                },
              },
            ],
          },
        ],
      };
    }

    const generalData = await CompanyModel.find({
      ...baseQuery,
      bdmAcceptStatus: { $nin: ["Forwarded", "Pending", "Accept"] },
      Status: { $in: ["Untouched"] },
    })
      .sort({ AssignDate: -1 }) // Sort by assign date in descending order
      .lean();

    res.status(200).json({
      generalData,
      totalCount: generalData.length, // Include total count of fetched data
    });
  } catch (error) {
    console.error("Error fetching General data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/employees-notinterested/:ename", async (req, res) => {
  try {
    const employeeName = req.params.ename;
    const search = req.query.search ? req.query.search.toLowerCase() : "";

    let baseQuery = {
      ename: employeeName,
      $or: [
        { ename: employeeName },
        { $and: [{ maturedBdmName: employeeName }, { Status: "Matured" }] },
        { $and: [{ multiBdmName: { $in: [employeeName] } }, { Status: "Matured" }] },
      ],
    };

    if (search !== "") {
      const escapedSearch = escapeRegex(search);
      baseQuery = {
        $and: [
          baseQuery,
          {
            $or: [
              { "Company Name": { $regex: new RegExp(escapedSearch, "i") } },
              { "Company Email": { $regex: new RegExp(escapedSearch, "i") } },
              {
                $expr: {
                  $regexMatch: {
                    input: { $toString: "$Company Number" },
                    regex: `^${escapedSearch}`,
                    options: "i",
                  },
                },
              },
            ],
          },
        ],
      };
    }

    const notInterestedData = await CompanyModel.find({
      ...baseQuery,
      Status: { $in: ["Not Interested", "Junk"] },
      bdmAcceptStatus: { $nin: ["Pending", "MaturedPending"] },
    })
      .sort({ lastActionDate: -1 })
      .lean();

    res.status(200).json({
      notInterestedData,
      totalCount: notInterestedData.length,
    });
  } catch (error) {
    console.error("Error fetching Not Interested data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/employees-matured/:ename", async (req, res) => {
  try {
    const employeeName = req.params.ename;
    const search = req.query.search ? req.query.search.toLowerCase() : "";

    let baseQuery = {
      ename: employeeName,
      $or: [
        { maturedBdmName: employeeName },
        { $and: [{ multiBdmName: { $in: [employeeName] } }, { Status: "Matured" }] },
      ],
    };

    if (search !== "") {
      const escapedSearch = escapeRegex(search);
      baseQuery = {
        $and: [
          baseQuery,
          {
            $or: [
              { "Company Name": { $regex: new RegExp(escapedSearch, "i") } },
              { "Company Email": { $regex: new RegExp(escapedSearch, "i") } },
              {
                $expr: {
                  $regexMatch: {
                    input: { $toString: "$Company Number" },
                    regex: `^${escapedSearch}`,
                    options: "i",
                  },
                },
              },
            ],
          },
        ],
      };
    }

    const maturedData = await CompanyModel.find({
      ...baseQuery,
      Status: { $in: ["Matured"] },
      bdmAcceptStatus: {
        $in: ["NotForwarded", "Pending", "MaturedPending", "MaturedAccepted", "MaturedDone", undefined],
      },
    })
      .sort({ lastActionDate: -1 })
      .lean();

    res.status(200).json({
      maturedData,
      totalCount: maturedData.length,
    });
  } catch (error) {
    console.error("Error fetching Matured data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/employees-underdocs/:ename", async (req, res) => {
  try {
    const employeeName = req.params.ename;
    const search = req.query.search ? req.query.search.toLowerCase() : "";

    let baseQuery = {
      ename: employeeName,
      $or: [
        { ename: employeeName },
        { $and: [{ maturedBdmName: employeeName }, { Status: "Matured" }] },
        { $and: [{ multiBdmName: { $in: [employeeName] } }, { Status: "Matured" }] },
      ],
    };

    if (search !== "") {
      const escapedSearch = escapeRegex(search);
      baseQuery = {
        $and: [
          baseQuery,
          {
            $or: [
              { "Company Name": { $regex: new RegExp(escapedSearch, "i") } },
              { "Company Email": { $regex: new RegExp(escapedSearch, "i") } },
              {
                $expr: {
                  $regexMatch: {
                    input: { $toString: "$Company Number" },
                    regex: `^${escapedSearch}`,
                    options: "i",
                  },
                },
              },
            ],
          },
        ],
      };
    }

    const underdocsData = await CompanyModel.find({
      ...baseQuery,
      Status: { $in: ["Docs/Info Sent (W)", "Docs/Info Sent (E)", "Docs/Info Sent (W&E)"] },
      bdmAcceptStatus: { $in: ["NotForwarded", undefined] },
    })
      .sort({ lastActionDate: -1 })
      .lean();

    res.status(200).json({
      underdocsData,
      totalCount: underdocsData.length,
    });
  } catch (error) {
    console.error("Error fetching UnderDocs data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/employees-forwarded/:ename", async (req, res) => {
  try {
    const employeeName = req.params.ename;
    const search = req.query.search ? req.query.search.toLowerCase() : "";

    let baseQuery = {
      ename: employeeName,
      $or: [
        { ename: employeeName },
        { $and: [{ maturedBdmName: employeeName }, { Status: "Matured" }] },
        { $and: [{ multiBdmName: { $in: [employeeName] } }, { Status: "Matured" }] },
      ],
    };

    if (search !== "") {
      const escapedSearch = escapeRegex(search);
      baseQuery = {
        $and: [
          baseQuery,
          {
            $or: [
              { "Company Name": { $regex: new RegExp(escapedSearch, "i") } },
              { "Company Email": { $regex: new RegExp(escapedSearch, "i") } },
              {
                $expr: {
                  $regexMatch: {
                    input: { $toString: "$Company Number" },
                    regex: `^${escapedSearch}`,
                    options: "i",
                  },
                },
              },
            ],
          },
        ],
      };
    }

    const forwardedData = await CompanyModel.find({
      ...baseQuery,
      $or: [
        {
          Status: { $in: ["Matured", "Busy", "Not Picked Up"] },
          bdmAcceptStatus: { $in: ["MaturedPending", "MaturedAccepted"] },
        },
        {
          Status: { $in: ["Interested", "FollowUp", "Busy", "Not Picked Up"] },
          bdmAcceptStatus: { $in: ["Forwarded", "Pending", "Accept"] },
        },
      ],
    })
      .sort({ lastActionDate: -1 })
      .lean();

    res.status(200).json({
      forwardedData,
      totalCount: forwardedData.length,
    });
  } catch (error) {
    console.error("Error fetching Forwarded data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/employees-new/:ename", async (req, res) => {
  try {
    const employeeName = req.params.ename;
    const limit = parseInt(req.query.limit) || 500; // Default limit to 500
    const skip = parseInt(req.query.skip) || 0; // Default skip to 0
    const search = req.query.search ? req.query.search.toLowerCase() : ""; // Extract the search query

    // Base query for employee-related data, ensuring 'ename' is part of the query
    let baseQuery = {
      ename: employeeName, // Always filter by the provided ename
      $or: [
        { ename: employeeName },
        { $and: [{ maturedBdmName: employeeName }, { Status: "Matured" }] },
        { $and: [{ multiBdmName: { $in: [employeeName] } }, { Status: "Matured" }] }
      ]
    };

    // Apply searching for company name
    if (search !== '') {
      const escapedSearch = escapeRegex(search);

      // Combine search conditions with existing baseQuery
      baseQuery = {
        $and: [
          baseQuery, // Keep the original ename condition
          {
            $or: [
              { 'Company Name': { $regex: new RegExp(escapedSearch, 'i') } },
              { 'Company Email': { $regex: new RegExp(escapedSearch, 'i') } },
              {
                $expr: {
                  $regexMatch: {
                    input: { $toString: "$Company Number" }, // Convert Company Number to string
                    regex: `^${escapedSearch}`,             // Use template literals for the escaped search
                    options: "i"                            // Case-insensitive search
                  }
                }
              }
            ]
          }
        ]
      };
    }
    // Define maturedData logic separately to avoid overlaps
    const maturedQuery = {
      $and: [
        {
          $or: [
            {
              maturedBdmName: employeeName,
              $expr: { $ne: ["$ename", "$maturedBdmName"] }, // Ensure maturedBdmName is distinct
            },
            {
              ename: employeeName,
              Status: "Matured",
              bdmAcceptStatus: {
                $in: [
                  "NotForwarded",
                  "Pending",
                  "Accept",
                  "MaturedPending",
                  "MaturedAccepted",
                  "MaturedDone",
                  undefined,
                ],
              },
            },
          ],
        },
        // Exclude search-specific matches to prevent overlap
        search !== ""
          ? {
            $or: [
              { "Company Name": { $regex: new RegExp(escapeRegex(search), "i") } },
              { "Company Email": { $regex: new RegExp(escapeRegex(search), "i") } },
              {
                $expr: {
                  $regexMatch: {
                    input: { $toString: "$Company Number" },
                    regex: `^${escapeRegex(search)}`,
                    options: "i",
                  },
                },
              },
            ],
          }
          : {},
      ],
    };

    // Fetch data for each status category
    const [generalData, busyData, underdocsData, interestedData, forwardedData, maturedData, notInterestedData] = await Promise.all([
      CompanyModel.find({
        ...baseQuery,
        bdmAcceptStatus: { $nin: ["Forwarded", "Pending", "Accept"] },
        Status: { $in: ["Untouched"] }
      })
        .sort({ AssignDate: -1 })
        .skip(skip)
        .limit(limit),

      CompanyModel.find({
        ...baseQuery,
        bdmAcceptStatus: "NotForwarded",
        Status: { $in: ["Busy", "Not Picked Up"] }
      })
        .sort({ lastActionDate: -1 })
        .skip(skip)
        .limit(limit),

      CompanyModel.find({
        ...baseQuery,
        bdmAcceptStatus: { $in: ["NotForwarded", undefined] },
        Status: { $in: ["Docs/Info Sent (W)", "Docs/Info Sent (E)", "Docs/Info Sent (W&E)"] }
      })
        .sort({ lastActionDate: -1 })
        .skip(skip)
        .limit(limit),

      CompanyModel.find({
        ...baseQuery,
        Status: { $in: ["Interested", "FollowUp"] },
        bdmAcceptStatus: { $in: ["NotForwarded", undefined] }
      })
        .sort({ lastActionDate: -1 })
        .skip(skip)
        .limit(limit),

      CompanyModel.find({
        ...baseQuery,
        $or: [
          // Condition for "Matured" status
          {
            Status: { $in: ["Matured", "Busy", "Not Picked Up"] },
            bdmAcceptStatus: { $in: ["MaturedPending", "MaturedAccepted"] }
          },
          // Condition for "Interested" and "FollowUp" statuses
          {
            Status: { $in: ["Interested", "FollowUp", "Busy", "Not Picked Up"] },
            bdmAcceptStatus: { $in: ["Forwarded", "Pending", "Accept"] }
          },
          {
            Status: { $in: ["Untouched", "Busy", "Not Interested", "Not Picked Up"] },
            bdmAcceptStatus: { $in: ["Pending"] }
          }
        ]
      })
        .sort({ lastActionDate: -1 })
        .skip(skip)
        .limit(limit),

      CompanyModel.find({
        ...maturedQuery,
      })
        .sort({ lastActionDate: -1 })
        .skip(skip)
        .limit(limit),

      CompanyModel.find({
        ...baseQuery,
        Status: { $in: ["Not Interested", "Junk"] },
        bdmAcceptStatus: { $nin: ["Pending", "MaturedPending"] }, // Use $nin for excluding multiple values
      })
        .sort({ lastActionDate: -1 })
        .skip(skip)
        .limit(limit)
    ]);
    // Fetch redesigned data for matching companies
    const allCompanyIds = [
      ...maturedData.map(item => item._id),
    ];

    const redesignedData = await RedesignedLeadformModel.find({ company: { $in: allCompanyIds } })
      .select("company bookingDate bookingPublishDate")
      .lean();

    // Create map for redesigned data for quick access
    const redesignedMap = redesignedData.reduce((acc, item) => {
      acc[item.company] = {
        bookingDate: item.bookingDate,
        bookingPublishDate: item.bookingPublishDate
      };
      return acc;
    }, {});

    // Update matured data with booking information
    const updatedMaturedData = maturedData.map(item => ({
      ...item._doc, // Spread the original _doc object to include all fields
      bookingDate: redesignedMap[item._id]?.bookingDate || null,
      bookingPublishDate: redesignedMap[item._id]?.bookingPublishDate || null,
    }));

    const combinedData = [...generalData, ...busyData, ...underdocsData, ...interestedData, ...maturedData, ...notInterestedData, ...forwardedData];
    // Count documents for each category
    const [notInterestedCount, interestedCount, underdocsCount, maturedCount, forwardedCount, busyCount, untouchedCount] = await Promise.all([
      CompanyModel.countDocuments({
        ...baseQuery,
        Status: { $in: ["Not Interested", "Junk"] },
        bdmAcceptStatus: { $nin: ["Pending", "MaturedPending"] }, // Use $nin for excluding multiple values
      }),
      CompanyModel.countDocuments({ ...baseQuery, Status: { $in: ["Interested", "FollowUp"] }, bdmAcceptStatus: { $in: ["NotForwarded", undefined] } }),
      CompanyModel.countDocuments({
        ...baseQuery,
        bdmAcceptStatus: { $in: ["NotForwarded", undefined] },
        Status: { $in: ["Docs/Info Sent (W)", "Docs/Info Sent (E)", "Docs/Info Sent (W&E)"] }
      }),
      CompanyModel.countDocuments({
        ...maturedQuery,
      }),
      CompanyModel.countDocuments({
        ...baseQuery,
        $or: [
          // Condition for "Matured" status with specific bdmAcceptStatus values
          {
            Status: { $in: ["Matured", "Busy", "Not Picked Up"] },
            bdmAcceptStatus: { $in: ["MaturedPending", "MaturedAccepted"] },
          },
          // Condition for "Interested" and "FollowUp" statuses with specific bdmAcceptStatus values
          {
            Status: { $in: ["Interested", "FollowUp", "Busy", "Not Picked Up"] },
            bdmAcceptStatus: { $in: ["Forwarded", "Pending", "Accept"] },
          },
          {
            Status: { $in: ["Untouched", "Busy", "Not Interested", "Not Picked Up"] },
            bdmAcceptStatus: { $in: ["Pending"] }
          }
        ],
      }),
      CompanyModel.countDocuments({ ...baseQuery, Status: { $in: ["Busy", "Not Picked Up"] }, bdmAcceptStatus: "NotForwarded" }),
      CompanyModel.countDocuments({ ...baseQuery, Status: { $in: ["Untouched"] }, bdmAcceptStatus: { $nin: ["Forwarded", "Pending", "Accept", undefined] } })
    ]);

    // Total pages calculation based on the largest dataset (generalData as reference)
    const totalGeneralPages = Math.ceil(untouchedCount / limit);
    const totalBusyPages = Math.ceil(busyCount / limit);
    const totalUndrocsPages = Math.ceil(underdocsCount / limit);
    const totalInterestedPages = Math.ceil(interestedCount / limit);
    const totalMaturedPages = Math.ceil(maturedCount / limit);
    const totalForwardedCount = Math.ceil(forwardedCount / limit);
    const totalNotInterestedPages = Math.ceil(notInterestedCount / limit);
    // Return response with data categorized separately
    res.status(200).json({
      generalData,
      busyData,
      underdocsData,
      interestedData,
      forwardedData,
      maturedData: updatedMaturedData, // Include updated matured data with booking information
      notInterestedData,
      totalCounts: {
        notInterested: notInterestedCount,
        interested: interestedCount,
        matured: maturedCount,
        forwarded: forwardedCount,
        busy: busyCount,
        untouched: untouchedCount,
        underdocs: underdocsCount
      },
      totalGeneralPages: totalGeneralPages,
      totalBusyPages: totalBusyPages,
      totalUndrocsPages: totalUndrocsPages,
      totalInterestedPages: totalInterestedPages,
      totalForwardedCount: totalForwardedCount,
      totalMaturedPages: totalMaturedPages,
      totalNotInterestedPages: totalNotInterestedPages,
      data: combinedData,
      totalPages: Math.ceil((untouchedCount + busyCount + interestedCount + maturedCount + forwardedCount + notInterestedCount) / limit), // Adjust this based on your pagination needs
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// router.get("/employees-new/:ename", async (req, res) => {
//   try {
//     const employeeName = req.params.ename;
//     const limit = parseInt(req.query.limit) || 500; // Default limit to 500
//     const skip = parseInt(req.query.skip) || 0; // Default skip to 0
//     const search = req.query.search ? req.query.search.toLowerCase() : ""; // Extract the search query

//     // Base query for employee-related data, ensuring 'ename' is part of the query
//     let baseQuery = {
//       ename: employeeName, // Always filter by the provided ename
//       $or: [
//         { ename: employeeName },
//         { $and: [{ maturedBdmName: employeeName }, { Status: "Matured" }] },
//         { $and: [{ multiBdmName: { $in: [employeeName] } }, { Status: "Matured" }] }
//       ]
//     };

//     // Apply searching for company name
//     if (search !== '') {
//       const escapedSearch = escapeRegex(search);

//       // Combine search conditions with existing baseQuery
//       baseQuery = {
//         $and: [
//           baseQuery, // Keep the original ename condition
//           {
//             $or: [
//               { 'Company Name': { $regex: new RegExp(escapedSearch, 'i') } },
//               { 'Company Email': { $regex: new RegExp(escapedSearch, 'i') } },
//               {
//                 $expr: {
//                   $regexMatch: {
//                     input: { $toString: "$Company Number" }, // Convert Company Number to string
//                     regex: `^${escapedSearch}`,             // Use template literals for the escaped search
//                     options: "i"                            // Case-insensitive search
//                   }
//                 }
//               }
//             ]
//           }
//         ]
//       };
//     }
//     const classifiedIds = new Set(); // To track IDs already classified
//     // Fetch data for each status category
//     const [generalData, busyData, underdocsData, interestedData, forwardedData, notInterestedData] = await Promise.all([
//       CompanyModel.find({
//         ...baseQuery,
//         bdmAcceptStatus: { $nin: ["Forwarded", "Pending", "Accept"] },
//         Status: { $in: ["Untouched"] },
//       })
//         .sort({ AssignDate: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean()
//         .then((data) => {
//           data.forEach((item) => classifiedIds.add(item._id.toString())); // Track IDs
//           return data;
//         }),

//       CompanyModel.find({
//         ...baseQuery,
//         bdmAcceptStatus: "NotForwarded",
//         Status: { $in: ["Busy", "Not Picked Up"] },
//         _id: { $nin: Array.from(classifiedIds) }, // Exclude already classified
//       })
//         .sort({ lastActionDate: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean()
//         .then((data) => {
//           data.forEach((item) => classifiedIds.add(item._id.toString())); // Track IDs
//           return data;
//         }),

//       CompanyModel.find({
//         ...baseQuery,
//         bdmAcceptStatus: { $in: ["NotForwarded", undefined] },
//         Status: { $in: ["Docs/Info Sent (W)", "Docs/Info Sent (E)", "Docs/Info Sent (W&E)"] },
//         _id: { $nin: Array.from(classifiedIds) }, // Exclude already classified
//       })
//         .sort({ lastActionDate: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean()
//         .then((data) => {
//           data.forEach((item) => classifiedIds.add(item._id.toString())); // Track IDs
//           return data;
//         }),

//       CompanyModel.find({
//         ...baseQuery,
//         Status: { $in: ["Interested", "FollowUp"] },
//         bdmAcceptStatus: { $in: ["NotForwarded", undefined] },
//         _id: { $nin: Array.from(classifiedIds) }, // Exclude already classified
//       })
//         .sort({ lastActionDate: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean()
//         .then((data) => {
//           data.forEach((item) => classifiedIds.add(item._id.toString())); // Track IDs
//           return data;
//         }),

//       CompanyModel.find({
//         ...baseQuery,
//         $or: [
//           {
//             Status: { $in: ["Matured", "Busy", "Not Picked Up"] },
//             bdmAcceptStatus: { $in: ["MaturedPending", "MaturedAccepted"] },
//           },
//           {
//             Status: { $in: ["Interested", "FollowUp", "Busy", "Not Picked Up"] },
//             bdmAcceptStatus: { $in: ["Forwarded", "Pending", "Accept"] },
//           },
//         ],
//         _id: { $nin: Array.from(classifiedIds) }, // Exclude already classified
//       })
//         .sort({ lastActionDate: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean()
//         .then((data) => {
//           data.forEach((item) => classifiedIds.add(item._id.toString())); // Track IDs
//           return data;
//         }),
//       CompanyModel.find({
//         ...baseQuery,
//         Status: { $in: ["Not Interested", "Junk"] },
//         bdmAcceptStatus: { $nin: ["Pending", "MaturedPending"] },
//         _id: { $nin: Array.from(classifiedIds) }, // Exclude already classified
//       })
//         .sort({ lastActionDate: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean()
//         .then((data) => {
//           data.forEach((item) => classifiedIds.add(item._id.toString())); // Track IDs
//           return data;
//         }),
//     ]);

//     const maturedData = await CompanyModel.find({
//       _id: { $nin: Array.from(classifiedIds) }, // Exclude already classified
//       $or: [
//         {
//           $and: [
//             { maturedBdmName: employeeName },
//             { $expr: { $ne: ["$ename", "$maturedBdmName"] } },
//           ],
//         },
//         {
//           ...baseQuery,
//           bdmAcceptStatus: {
//             $in:
//               ["NotForwarded", "Pending", "MaturedPending", "MaturedAccepted", "MaturedDone", undefined]
//           },
//           Status: { $in: ["Matured"] },
//         },
//       ],

//     })
//       .sort({ lastActionDate: -1 })
//       .skip(skip)
//       .limit(limit)
//       .lean();
//     // Fetch redesigned data for matching companies
//     const allCompanyIds = [
//       ...maturedData.map(item => item._id),
//     ];


//     const redesignedData = await RedesignedLeadformModel.find({ company: { $in: allCompanyIds } })
//       .select("company bookingDate bookingPublishDate")
//       .lean();

//     // Create map for redesigned data for quick access
//     const redesignedMap = redesignedData.reduce((acc, item) => {
//       acc[item.company] = {
//         bookingDate: item.bookingDate,
//         bookingPublishDate: item.bookingPublishDate
//       };
//       return acc;
//     }, {});

//     // Update matured data with booking information
//     const updatedMaturedData = maturedData.map(item => ({
//       ...item, // Spread the original _doc object to include all fields
//       bookingDate: redesignedMap[item._id]?.bookingDate || null,
//       bookingPublishDate: redesignedMap[item._id]?.bookingPublishDate || null
//     }));

//     // Debug output
//     // console.log("Matured Data:", maturedData); // Should match the actual count (6 in this case)
//     // console.log("Updated Matured Data:", updatedMaturedData);

//     const combinedData = [...generalData, ...busyData, ...underdocsData, ...interestedData, ...maturedData, ...notInterestedData, ...forwardedData];
//     // Count documents for each category, excluding already classified IDs
//     // Separate sets for tracking classified IDs during counting
//     const countClassifiedIds = new Set(); // Start with the existing classified IDs

//     // Count documents for each category with independent tracking of classified IDs
//     const [
//       notInterestedCount,
//       interestedCount,
//       underdocsCount,
//       forwardedCount,
//       busyCount,
//       untouchedCount
//     ] = await Promise.all([
//       CompanyModel.find({
//         ...baseQuery,
//         _id: { $nin: Array.from(countClassifiedIds) }, // Exclude already classified
//         Status: { $in: ["Not Interested", "Junk"] },
//         bdmAcceptStatus: { $nin: ["Pending", "MaturedPending"] },
//       }).lean()
//         .then((data) => {
//           data.forEach((item) => countClassifiedIds.add(item._id.toString())); // Track IDs for exclusion
//           return data.length; // Return count
//         }),

//       CompanyModel.find({
//         ...baseQuery,
//         _id: { $nin: Array.from(countClassifiedIds) }, // Exclude already classified
//         Status: { $in: ["Interested", "FollowUp"] },
//         bdmAcceptStatus: { $in: ["NotForwarded", undefined] },
//       }).lean()
//         .then((data) => {
//           data.forEach((item) => countClassifiedIds.add(item._id.toString())); // Track IDs for exclusion
//           return data.length; // Return count
//         }),

//       CompanyModel.find({
//         ...baseQuery,
//         _id: { $nin: Array.from(countClassifiedIds) }, // Exclude already classified
//         bdmAcceptStatus: { $in: ["NotForwarded", undefined] },
//         Status: { $in: ["Docs/Info Sent (W)", "Docs/Info Sent (E)", "Docs/Info Sent (W&E)"] },
//       }).lean()
//         .then((data) => {
//           data.forEach((item) => countClassifiedIds.add(item._id.toString())); // Track IDs for exclusion
//           return data.length; // Return count
//         }),

//       CompanyModel.find({
//         ...baseQuery,
//         _id: { $nin: Array.from(countClassifiedIds) }, // Exclude already classified
//         $or: [
//           {
//             Status: { $in: ["Matured", "Busy", "Not Picked Up"] },
//             bdmAcceptStatus: { $in: ["MaturedPending", "MaturedAccepted"] },
//           },
//           {
//             Status: { $in: ["Interested", "FollowUp", "Busy", "Not Picked Up"] },
//             bdmAcceptStatus: { $in: ["Forwarded", "Pending", "Accept"] },
//           },
//           // {
//           //   Status: { $in: ["Untouched", "Busy", "Not Interested", "Not Picked Up"] },
//           //   bdmAcceptStatus: { $in: ["Pending"] },
//           // },
//         ],
//       }).lean()
//         .then((data) => {
//           data.forEach((item) => countClassifiedIds.add(item._id.toString())); // Track IDs for exclusion
//           return data.length; // Return count
//         }),

//       CompanyModel.find({
//         ...baseQuery,
//         _id: { $nin: Array.from(countClassifiedIds) }, // Exclude already classified
//         Status: { $in: ["Busy", "Not Picked Up"] },
//         bdmAcceptStatus: "NotForwarded",
//       }).lean()
//         .then((data) => {
//           data.forEach((item) => countClassifiedIds.add(item._id.toString())); // Track IDs for exclusion
//           return data.length; // Return count
//         }),

//       CompanyModel.find({
//         ...baseQuery,
//         _id: { $nin: Array.from(countClassifiedIds) }, // Exclude already classified
//         Status: { $in: ["Untouched"] },
//         bdmAcceptStatus: { $nin: ["Forwarded", "Pending", "Accept", undefined] },
//       }).lean()
//         .then((data) => {
//           data.forEach((item) => countClassifiedIds.add(item._id.toString())); // Track IDs for exclusion
//           return data.length; // Return count
//         }),
//     ]);

//     const maturedCount = await CompanyModel.find({
//       _id: { $nin: Array.from(countClassifiedIds) }, // Exclude already classified
//       $or: [
//         {
//           $and: [
//             { maturedBdmName: employeeName },
//             { $expr: { $ne: ["$ename", "$maturedBdmName"] } },
//           ],
//         },
//         {
//           ...baseQuery,
//           bdmAcceptStatus: {
//             $in: [
//               "NotForwarded",
//               "Pending",
//               "Accept",
//               "MaturedPending",
//               "MaturedAccepted",
//               "MaturedDone",
//               undefined,
//             ],
//           },
//           Status: { $in: ["Matured"] },
//         },
//       ],
//     }).lean()
//       .then((data) => {
//         data.forEach((item) => countClassifiedIds.add(item._id.toString())); // Track IDs for exclusion
//         return data.length; // Return count
//       });

//     // Total pages calculation based on the largest dataset (generalData as reference)
//     const totalGeneralPages = Math.ceil(untouchedCount / limit);
//     const totalBusyPages = Math.ceil(busyCount / limit);
//     const totalUndrocsPages = Math.ceil(underdocsCount / limit);
//     const totalInterestedPages = Math.ceil(interestedCount / limit);
//     const totalMaturedPages = Math.ceil(maturedCount / limit);
//     const totalForwardedCount = Math.ceil(forwardedCount / limit);
//     const totalNotInterestedPages = Math.ceil(notInterestedCount / limit);
//     // Return response with data categorized separately
//     res.status(200).json({
//       generalData,
//       busyData,
//       underdocsData,
//       interestedData,
//       forwardedData,
//       maturedData: updatedMaturedData, // Include updated matured data with booking information
//       notInterestedData,
//       totalCounts: {
//         notInterested: notInterestedCount,
//         interested: interestedCount,
//         matured: maturedCount,
//         forwarded: forwardedCount,
//         busy: busyCount,
//         untouched: untouchedCount,
//         underdocs: underdocsCount
//       },
//       totalGeneralPages: totalGeneralPages,
//       totalBusyPages: totalBusyPages,
//       totalUndrocsPages: totalUndrocsPages,
//       totalInterestedPages: totalInterestedPages,
//       totalForwardedCount: totalForwardedCount,
//       totalMaturedPages: totalMaturedPages,
//       totalNotInterestedPages: totalNotInterestedPages,
//       data: combinedData,
//       totalPages: Math.ceil((untouchedCount + busyCount + interestedCount + maturedCount + forwardedCount + notInterestedCount) / limit), // Adjust this based on your pagination needs
//     });
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.post("/postData", async (req, res) => {
  const { selectedObjects, employeeSelection } = req.body
  const bulkOperations = selectedObjects.map((employeeData) => ({
    updateOne: {
      filter: { "Company Name": employeeData["Company Name"] },
      update: {
        $set: {
          ename: employeeSelection,
          AssignDate: new Date()
        }
      },
    },
  }));
  await CompanyModel.bulkWrite(bulkOperations);

  res.json({ message: "Data posted successfully" });
});


router.get("/card-leads", async (req, res) => {
  try {
    const { dAmount } = req.query; // Get the dAmount parameter from the query

    // Fetch data from the database with the specified limit
    const data = await CompanyModel.find({
      ename: { $in: ["Select Employee", "Not Alloted"] },
    })
      .limit(parseInt(dAmount))
      .lean();

    // Send the data as the API response
    res.send(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/edata-particular/:ename", async (req, res) => {
  try {
    const { ename } = req.params;
    const filteredEmployeeData = await CompanyModel.find({
      $or: [{ ename: ename },
      { $and: [{ maturedBdmName: ename }, { Status: "Matured" }] },
      ],
    });
    res.json(filteredEmployeeData);
  } catch (error) {
    console.error("Error fetching employee data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post('/post-bderevertbackacceptedcompanyrequest', async (req, res) => {
  const { companyId, companyName } = req.query;
  try {
    await CompanyModel.findOneAndUpdate(
      { _id: companyId },
      { $set: { RevertBackAcceptedCompanyRequest: "Send" } }
    );

    await TeamLeadsModel.findOneAndUpdate(
      { _id: companyId },
      { $set: { RevertBackAcceptedCompanyRequest: "Send" } }
    );

    res.status(200).json({ message: "Company request reverted back successfully" });
  } catch (error) {
    console.error("Error reverting back company request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/get-bde-name-for-mybookings/:companyName", async (req, res) => {
  const { companyName } = req.params;

  try {
    // Find the company by name
    const company = await CompanyModel.findOne({ "Company Name": companyName });

    // If the company is found, send the BDE name
    if (company) {
      res.status(200).json({ bdeName: company.ename }); // Assuming the BDE name is stored in the `bdeName` field
    } else {
      // If the company is not found, send a 404 response
      res.status(404).json({ error: "Company not found" });
    }
  } catch (error) {
    // Handle any errors that occur during the query
    console.error("Error fetching company:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// router.get("/fetchLeads", async (req, res) => {
//   try {
//     // Aggregating the data based on ename and status
//     const data = await CompanyModel.aggregate([
//       {
//         $match: {
//           ename: { $ne: "Not Alloted" }, // Filter out Not Alloted
//         },
//       },
//       {
//         $group: {
//           _id: {
//             ename: "$ename",
//             status: "$Status",
//           },
//           count: { $sum: 1 },
//           lastAssignDate: { $max: "$AssignDate" }, // Get the latest AssignDate for each ename
//         },
//       },
//       {
//         $group: {
//           _id: "$_id.ename",
//           statusCounts: {
//             $push: {
//               status: "$_id.status",
//               count: "$count",
//             },
//           },
//           totalLeads: { $sum: "$count" },
//           lastAssignDate: { $max: "$lastAssignDate" },
//         },
//       },
//       {
//         $sort: { _id: 1 }, // Sort by ename
//       },
//     ]);

//     res.send(data);
//   } catch (error) {
//     console.error("Error fetching data:", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

router.get("/fetchLeads", async (req, res) => {
  try {
    const data = await CompanyModel.aggregate([
      {
        $match: {
          ename: { $ne: "Not Alloted" }, // Filter out "Not Alloted"
        },
      },
      {
        $addFields: {
          statusCategory: {
            $switch: {
              branches: [
                {
                  case: { $and: [{ $eq: ["$Status", "Interested"] }, { $eq: ["$bdmAcceptStatus", "NotForwarded"] }] },
                  then: "Interested",
                },
                {
                  case: { $and: [{ $eq: ["$Status", "FollowUp"] }, { $eq: ["$bdmAcceptStatus", "NotForwarded"] }] },
                  then: "FollowUp",
                },
                {
                  case: {
                    $and: [
                      { $in: ["$Status", ["Interested", "FollowUp"]] },
                      { $in: ["$bdmAcceptStatus", ["Accept", "Pending"]] },
                    ],
                  },
                  then: "Forwarded",
                },
                { case: { $eq: ["$Status", "Untouched"] }, then: "Untouched" },
                { case: { $eq: ["$Status", "Busy"] }, then: "Busy" },
                { case: { $eq: ["$Status", "Not Picked Up"] }, then: "Not Picked Up" },
                { case: { $eq: ["$Status", "Junk"] }, then: "Junk" },
                { case: { $eq: ["$Status", "Not Interested"] }, then: "Not Interested" },
                { case: { $eq: ["$Status", "Matured"] }, then: "Matured" },
                {
                  case: { $in: ["$Status", ["Docs/Info Sent (W&E)", "Docs/Info Sent (W)", "Docs/Info Sent (E)"]] },
                  then: "Under Docs",
                },
              ],
              default: "Other",
            },
          },
        },
      },
      {
        $group: {
          _id: {
            ename: "$ename",
            statusCategory: "$statusCategory",
          },
          count: { $sum: 1 },
          lastAssignDate: { $max: "$AssignDate" }, // Get the latest AssignDate
        },
      },
      {
        $group: {
          _id: "$_id.ename",
          statusCounts: {
            $push: {
              status: "$_id.statusCategory",
              count: "$count",
            },
          },
          lastAssignDate: { $max: "$lastAssignDate" },
        },
      },
      {
        $addFields: {
          // Calculate total leads by summing up counts from statusCounts
          totalLeads: {
            $sum: {
              $map: {
                input: "$statusCounts",
                as: "item",
                in: "$$item.count",
              },
            },
          },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by ename
      },
    ]);

    res.send(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Fetch data for forwarded and received cases :
router.get("/fetchForwardedLeads", async (req, res) => {
  try {
    const data = await CompanyModel.aggregate([
      {
        $match: {
          ename: { $ne: "Not Alloted" }, // Filter out Not Alloted
          Status: { $in: ["Interested", "FollowUp", "Busy", "Not Picked Up"] }, // Filter out statuses
          bdmAcceptStatus: { $in: ["Accept", "Pending"] } // Match "Accept" or "Pending" status
        }
      },
      // Join with Employee collection for 'ename'
      {
        $lookup: {
          from: "newemployeeinfos", // Employee collection
          localField: "ename", // CompanyModel's 'ename'
          foreignField: "ename", // newemployeeinfos' 'ename'
          as: "employeeDetailsEname" // Output field for joined data from 'ename'
        }
      },
      // Join with Employee collection for 'bdmName'
      {
        $lookup: {
          from: "newemployeeinfos", // Employee collection
          localField: "bdmName", // CompanyModel's 'bdmName'
          foreignField: "ename", // newemployeeinfos' 'ename'
          as: "employeeDetailsBdmName" // Output field for joined data from 'bdmName'
        }
      },
      // Group by ename and bdmName and count occurrences
      {
        $group: {
          _id: {
            ename: "$ename",
            bdmName: "$bdmName",
            branchOfficeBDE: "$employeeDetailsEname.branchOffice", // Get branchOffice for BDE
            branchOfficeBDM: "$employeeDetailsBdmName.branchOffice" // Get branchOffice for BDM
          },
          forwardedCount: { $sum: { $cond: [{ $ne: [{ $size: "$employeeDetailsEname" }, 0] }, 1, 0] } },
          receivedCount: { $sum: { $cond: [{ $ne: [{ $size: "$employeeDetailsBdmName" }, 0] }, 1, 0] } }
        }
      },
      // Group by 'ename' and 'bdmName' to accumulate counts
      {
        $group: {
          _id: {
            ename: "$_id.ename",
            bdmName: "$_id.bdmName",
            branchOfficeBDE: "$_id.branchOfficeBDE",
            branchOfficeBDM: "$_id.branchOfficeBDM"
          },
          forwardedCases: { $sum: "$forwardedCount" },
          receivedCases: { $sum: "$receivedCount" }
        }
      },
      // Prepare the final output
      {
        $project: {
          _id: 0,
          bdeName: "$_id.ename",
          bdmName: "$_id.bdmName",
          branchOfficeBDE: "$_id.branchOfficeBDE", // Include branchOffice for BDE
          branchOfficeBDM: "$_id.branchOfficeBDM", // Include branchOffice for BDM
          forwardedCases: 1,
          receivedCases: 1
        }
      }
    ]);

    // Format the data to include designation information
    const formattedData = data.map((item) => {
      let result = [];
      if (item.bdeName && item.forwardedCases !== 0) {
        result.push({ name: item.bdeName, forwardedCases: item.forwardedCases, designation: "BDE", branchOffice: item.branchOfficeBDE[0] });
      }
      if (item.bdmName && item.receivedCases !== 0) {
        result.push({ name: item.bdmName, receivedCases: item.receivedCases, designation: "BDM", branchOffice: item.branchOfficeBDM[0] });
      }
      return result;
    }).flat();

    // Sort the formatted data by name in ascending order
    const sortedData = formattedData.sort((a, b) => a.name.localeCompare(b.name));
    res.send(sortedData);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch forwarded leads projection :
router.get("/fetchForwardedLeadsProjection", async (req, res) => {
  try {
    // Fetch forwarded leads first
    const forwardedLeads = await CompanyModel.aggregate([
      {
        $match: {
          bdmAcceptStatus: { $in: ["Accept", "Pending"] },
          Status: { $in: ["Interested", "FollowUp", "Busy", "Not Picked Up"] },
        },
      },
      {
        $lookup: {
          from: "newemployeeinfos",
          localField: "ename",
          foreignField: "ename",
          as: "employee_info",
        },
      },
      {
        $match: {
          "employee_info": { $ne: [] },
        },
      },
      {
        $group: {
          _id: "$ename",
          totalForwardedCases: { $sum: 1 },
          companies: { $push: "$Company Name" },
        },
      },
      {
        $project: {
          _id: 0,
          ename: "$_id",
          totalForwardedCases: 1,
          companies: 1,
        },
      },
    ]);

    if (!forwardedLeads || forwardedLeads.length === 0) {
      return res.status(404).json({ error: "No forwarded leads found" });
    }

    // Extract companies from forwarded leads
    const companies = forwardedLeads.flatMap((lead) => lead.companies);

    // Fetch projections for the companies
    const projections = await ProjectionModel.aggregate([
      {
        $match: {
          companyName: { $in: companies }, // Filter projections by company names
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id
          companyName: 1, // Include company name
          ename: 1,
          offeredServices: 1,
          offeredPrice: 1,
          totalPayment: 1,
          lastFollowUpdate: 1,
          estPaymentDate: 1,
          remarks: 1,
          bdeName: 1,
          bdmName: 1,
          caseType: 1,
          isPreviousMaturedCase: 1,
          history: 1,
        },
      },
    ]);

    res.status(200).json({ forwardedLeads, projections });
  } catch (error) {
    console.error("Error fetching projections:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch data for forwarded and received case projection :
router.get("/fetchForwardedLeadsAmount", async (req, res) => {
  try {
    const data = await ForwardedLeadsModel.aggregate([
      {
        $match: {
          caseType: "Recieved", // Filter for "Recieved" case type
        },
      },
      {
        $group: {
          _id: {
            bdeName: "$bdeName",
            bdmName: "$bdmName",
          },
          totalPayment: { $sum: "$totalPayment" }, // Total payment for each pair
          count: { $sum: 1 }, // Count the number of entries for each pair
        },
      },
      {
        $addFields: {
          avgPayment: { $divide: ["$totalPayment", 2] }, // Calculate average payment for each pair
        },
      },
    ]);

    // Create a result array to hold the total amounts and designation for each BDE and BDM
    let result = [];

    data.forEach((item) => {
      const { bdeName, bdmName } = item._id;
      const avgPayment = item.avgPayment;

      // For BDE (Business Development Executive)
      if (bdeName) {
        result.push({
          name: bdeName,
          totalAmount: avgPayment,
          designation: "BDE",
        });
      }

      // For BDM (Business Development Manager)
      if (bdmName) {
        result.push({
          name: bdmName,
          totalAmount: avgPayment,
          designation: "BDM",
        });
      }
    });

    // Ensure the final result matches the required structure
    res.send(result);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch data for matured cases and generated received amounts :
router.get("/fetchMaturedCases", async (req, res) => {
  try {
    const maturedCompanies = await CompanyModel.aggregate([
      {
        $match: {
          Status: 'Matured', // Filter companies with 'Matured' status
        },
      },
      {
        $lookup: {
          from: 'redesignedleadforms',
          let: { ename: '$ename', company: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$company', '$$company'] }, // Matching company ID
                  ],
                },
              },
            },
            {
              $project: {
                _id: 0,
                bdeName: 1,
                bdmName: 1,
                bdmType: 1,
                moreBookings: 1,
                services: 1, // Include services from parent array
              },
            },
          ],
          as: 'leadForms',
        },
      },
      {
        $addFields: {
          maturedCases: {
            $reduce: {
              input: "$leadForms",
              initialValue: {
                count: 0,
                services: [],
              },
              in: {
                maturedCase: {
                  $cond: [
                    { $eq: ["$$this.bdmName", "$ename"] },
                    { $add: ["$$value.count", 1] },
                    {
                      $cond: [
                        { $eq: ["$$this.bdmType", "Close-by"] },
                        { $add: ["$$value.count", 0.5] },
                        { $add: ["$$value.count", 1] }
                      ]
                    }
                  ]
                },
                services: {
                  $concatArrays: [
                    "$$value.services",
                    {
                      $map: {
                        input: "$$this.services",
                        as: "service",
                        in: {
                          serviceName: "$$service.serviceName",
                          generatedReceivedAmount: {
                            $cond: [
                              { $eq: ["$$this.bdmName", "$ename"] },
                              // "$$service.totalPaymentWOGST", // Full amount if ename matches bdmName
                              "$$service.totalPaymentWOGST", // Full amount if ename matches bdmName
                              {
                                $cond: [
                                  { $eq: ["$$this.bdmType", "Close-by"] },
                                  { $divide: ["$$service.totalPaymentWOGST", 2] }, // Half amount if bdmType is Close-by
                                  "$$service.totalPaymentWOGST" // Full amount if bdmType is Supported-by
                                ]
                              }
                            ]
                          }
                        }
                      }
                    },
                    {
                      $map: {
                        input: "$$this.moreBookings",
                        as: "booking",
                        in: {
                          serviceName: { $arrayElemAt: ["$$booking.services.serviceName", 0] },
                          generatedReceivedAmount: {
                            $cond: [
                              { $eq: ["$$booking.bdmName", "$ename"] },
                              "$$booking.generatedReceivedAmount",
                              {
                                $cond: [
                                  { $eq: ["$$booking.bdmType", "Close-by"] },
                                  { $divide: ["$$booking.generatedReceivedAmount", 2] },
                                  "$$booking.generatedReceivedAmount"
                                ]
                              }
                            ]
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          companyName: '$Company Name',
          ename: 1,
          bdeName: { $arrayElemAt: ["$leadForms.bdeName", 0] },
          bdmName: { $arrayElemAt: ["$leadForms.bdmName", 0] },
          bdmType: { $arrayElemAt: ["$leadForms.bdmType", 0] },
          Status: 1,
          maturedCases: 1,
        },
      },
    ]);

    res.status(200).json(maturedCompanies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetching bdm matured cases data :
router.get("/bdmMaturedCases", async (req, res) => {
  try {
    // Step 1: Fetch employees who are BDM or Floor Managers
    const employees = await adminModel.find({
      newDesignation: { $in: ["Business Development Manager", "Floor Manager", "Business Development Executive"] },
      bdmWork: true, // Condition for bdmWork to be true
      ename: { $nin: ["DIRECT", "TEST ACCOUNT"] } // Exclude ename values "DIRECT" and "TEST ACCOUNT"
    }).select("ename number bdmWork"); // Select ename, number, and bdmWork fields

    const employeeData = employees.map(emp => ({
      name: emp.ename,
      bdmNumber: emp.number
    }));

    const employeeNames = employeeData.map(emp => emp.name); // Extract only the names for filtering

    // Step 2: Aggregation pipeline to calculate matured cases with company names
    const bdmStats = await CompanyModel.aggregate([
      {
        // Match only cases where bdmAcceptStatus is "Accept"
        $match: {
          bdmAcceptStatus: "Accept", // Only "Accept" cases
        }
      },
      {
        // Group by BDM Name
        $group: {
          _id: "$bdmName", // Group by bdmName
          receivedCases: { $sum: 1 }, // Total number of received cases
          receivedCompanies: { $push: "$Company Name" }, // Collect company names for received cases
          maturedCases: {
            $sum: {
              $cond: [
                { $eq: ["$Status", "Matured"] }, // Only count cases where status is "Matured"
                1,
                0
              ]
            }
          },
          maturedCompanies: {
            $push: {
              $cond: [
                { $eq: ["$Status", "Matured"] }, // Only collect company names where status is "Matured"
                "$Company Name",
                null
              ]
            }
          }
        }
      },
      {
        // Add fields to calculate the ratio of matured cases to received cases
        $addFields: {
          ratio: {
            $cond: [
              { $eq: ["$receivedCases", 0] }, // Avoid division by zero
              0,
              { $multiply: [{ $divide: ["$maturedCases", "$receivedCases"] }, 100] }
            ]
          },
          maturedCompanies: {
            $filter: {
              input: "$maturedCompanies",
              as: "company",
              cond: { $ne: ["$$company", null] } // Filter out null values in matured companies
            }
          }
        }
      },
      {
        // Filter results to only include those bdmNames present in the employee collection
        $match: {
          _id: { $in: employeeNames }
        }
      },
      {
        // Sort by matured cases in descending order
        $sort: {
          maturedCases: -1 // Sort by ratio in descending order
        }
      },
      {
        // Project the final fields
        $project: {
          bdmName: "$_id",
          receivedCases: 1,
          maturedCases: 1,
          ratio: { $round: ["$ratio", 2] }, // Round ratio to 2 decimal places
          // receivedCompanies: 1,
          // maturedCompanies: 1 // Return the array of matured company names
        }
      }
    ]);

    // Step 3: Prepare the final response
    let finalStats = employeeData.map(({ name, bdmNumber }) => {
      const stat = bdmStats.find(stat => stat.bdmName === name);
      return {
        bdmName: name,
        bdmNumber: bdmNumber || "N/A",
        receivedCases: stat ? stat.receivedCases : 0,
        maturedCases: stat ? stat.maturedCases : 0,
        ratio: stat ? stat.ratio.toFixed(2) : (0).toFixed(2),
        receivedCompanies: stat ? stat.receivedCompanies : [], // List of companies for received cases
        maturedCompanies: stat ? stat.maturedCompanies : [] // List of companies for matured cases
      };
    });

    // Sort the finalStats based on the ratio in descending order
    finalStats = finalStats.sort((a, b) => parseFloat(b.maturedCases) - parseFloat(a.maturedCases));

    // Return the final result
    res.status(200).json({ result: true, message: "Data fetched successfully", data: finalStats });
  } catch (error) {
    res.status(500).json({ result: false, message: "Error fetching data", error: error });
  }
});

// POST route to add/update interestedInformation
router.post('/company/:companyName/interested-info', async (req, res) => {
  const companyName = req.params.companyName; // Extract company name from params
  const { newInterestedInfo, status, id, ename, date, time } = req.body; // Data from the request body
  const socketIO = req.io;
  // console.log("Request Body:", req.body);

  try {
    const existingCompany = await CompanyModel.findById(id);
    if (!existingCompany) {
      // console.log("Company not found for ID:", id);
      return res.status(404).json({ message: 'Company not found' });
    }

    // Extract `nextFollowUpDate` from `newInterestedInfo`
    let nextFollowUpDate = null;

    if (newInterestedInfo) {
      nextFollowUpDate =
        newInterestedInfo.clientWhatsAppRequest?.nextFollowUpDate ||
        newInterestedInfo.clientEmailRequest?.nextFollowUpDate ||
        newInterestedInfo.interestedInServices?.nextFollowUpDate ||
        newInterestedInfo.interestedButNotNow?.nextFollowUpDate ||
        null;

      // console.log("Extracted Next Follow-Up Date:", nextFollowUpDate);
    }

    // console.log("Existing Company Data:", existingCompany);

    const existingInfoArray = existingCompany.interestedInformation || [];
    // console.log("Existing Interested Information:", existingInfoArray);

    // Check if an entry with the same `ename` already exists
    const existingIndex = existingInfoArray.findIndex(info => info.ename === ename);

    if (existingIndex !== -1) {
      // If `ename` exists, update the existing object
      const existingInfo = existingInfoArray[existingIndex];

      // Perform a selective merge: only update fields in `newInterestedInfo` that are non-empty
      const mergedInfo = { ...existingInfo };

      for (const key in newInterestedInfo) {
        if (typeof newInterestedInfo[key] === 'object' && !Array.isArray(newInterestedInfo[key])) {
          // Deep merge for nested objects
          mergedInfo[key] = {
            ...(existingInfo[key] || {}),
            ...Object.fromEntries(
              Object.entries(newInterestedInfo[key]).map(([subKey, subValue]) => {
                if (Array.isArray(subValue)) {
                  // Preserve existing array if new array is empty
                  return [subKey, subValue.length > 0 ? subValue : existingInfo[key]?.[subKey] || []];
                }
                return [subKey, subValue !== '' && subValue !== null ? subValue : existingInfo[key]?.[subKey]];
              })
            ),
          };

          // Update the `date` field if any other field within this object is updated
          const isFieldUpdated = Object.entries(newInterestedInfo[key]).some(
            ([innerKey, innerValue]) => innerKey !== 'date' && innerValue !== '' && innerValue !== null
          );

          if (isFieldUpdated) {
            mergedInfo[key].date = new Date(); // Update date only if other fields in the object are updated
          }
        } else if (Array.isArray(newInterestedInfo[key])) {
          // Handle array fields: retain existing array if the new array is empty
          mergedInfo[key] = newInterestedInfo[key].length > 0 ? newInterestedInfo[key] : existingInfo[key];
        } else if (newInterestedInfo[key] !== '' && newInterestedInfo[key] !== null) {
          // Update only if the value is not empty
          mergedInfo[key] = newInterestedInfo[key];
        }
      }

      // console.log("Merged Existing Info with Updated Date Logic:", mergedInfo);

      // Replace the existing entry with the merged one
      existingInfoArray[existingIndex] = mergedInfo;
    } else {
      // If `ename` does not exist, add newInterestedInfo as a new object
      existingInfoArray.push(newInterestedInfo);
      // console.log("Added New Info:", newInterestedInfo);
    }

    // Prepare update fields
    const updateFields = {
      interestedInformation: existingInfoArray,
      lastActionDate: new Date(),
      previousStatusToUndo: existingCompany.Status,
      bdeNextFollowUpDate: nextFollowUpDate, // Update the bdeNextFollowDate field
    };

    if (existingCompany.bdmAcceptStatus === "MaturedAccepted" || existingCompany.bdmAcceptStatus === "Accept") {
      updateFields.bdmStatus = status;
    } else {
      updateFields.Status = status;
    }

    // console.log("Update Fields to be set:", updateFields);

    // Update the company document
    const updatedCompany = await CompanyModel.findOneAndUpdate(
      { "Company Name": companyName },
      {
        $set: updateFields,
      },
      { new: true, upsert: true } // Return updated document or create if not exists
    );

    // console.log("Updated Company Data:", updatedCompany);

    if (status === "FollowUp" || status === "Interested") {
      let leadHistory = await LeadHistoryForInterestedandFollowModel.findOne({
        "Company Name": companyName,
      });

      if (leadHistory) {
        leadHistory.oldStatus = "Untouched";
        leadHistory.newStatus = status;
      } else {
        leadHistory = new LeadHistoryForInterestedandFollowModel({
          _id: id,
          "Company Name": companyName,
          ename: ename,
          oldStatus: "Untouched",
          newStatus: status,
          date: new Date(),
          time: time,
        });
      }

      await leadHistory.save();
    }

    if (updatedCompany) {
      socketIO.emit("employee_lead_status_successfull_update", {
        message: `Status updated to "Not Interested" for company: ${updatedCompany["Company Name"]}`,
        updatedDocument: updatedCompany,
      })
      res.status(200).json({
        message: 'Interested information added/updated successfully',
        updatedCompany,
      });
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (error) {
    console.error("Error updating interested information:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});






// Search Company API For Leads
router.get('/companies/searchforLeads/:employeeName', async (req, res) => {
  const { employeeName } = req.params;
  const { name } = req.query;

  // Check if the name is provided
  if (!name) {
    return res.status(400).json({ found: false, companies: [] });
  }

  try {
    // Find companies by name and employee name (if provided) in a case-insensitive manner
    const query = { "Company Name": new RegExp(name, 'i') };
    if (employeeName) {
      query.ename = employeeName;
    }

    // Execute the query with a limit of 10 results for performance
    const companies = await CompanyModel.find(query).limit(10);

    // Respond with the found companies
    return res.json({ found: companies.length > 0, companies });
  } catch (error) {
    console.error("Error searching for companies:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Search Company API For Team Leads
router.get('/companies/searchforTeamLeads/:employeeName', async (req, res) => {
  const { employeeName } = req.params;
  const { name } = req.query;

  // Check if the name is provided
  if (!name) {
    return res.status(400).json({ found: false, companies: [] });
  }

  try {
    // Find companies by name and employee name (if provided) in a case-insensitive manner
    const query = { "Company Name": new RegExp(name, 'i') };
    if (employeeName) {
      query.bdmName = employeeName;
    }

    // Execute the query with a limit of 10 results for performance
    const companies = await TeamLeadsModel.find(query).limit(10); // Limit results for performance

    // Respond with the found companies
    return res.json({ found: companies.length > 0, companies });
  } catch (error) {
    console.error("Error searching for companies:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add projection :
router.post('/addProjection/:companyName', async (req, res) => {
  const { companyName } = req.params;
  const payload = req.body;

  try {
    // Check if a projection entry exists for the company
    let existingCompany = await ProjectionModel.findOne({ companyName });

    if (existingCompany) {
      // Add the existing main data to the history array
      const newHistoryEntry = {
        data: {
          // companyId : companyId,
          ename: existingCompany.ename,
          date: existingCompany.date,
          time: existingCompany.time,
          offeredServices: existingCompany.offeredServices,
          offeredPrice: existingCompany.offeredPrice,
          totalPayment: existingCompany.totalPayment,
          offeredPriceWithGst: existingCompany.offeredPriceWithGst || 0,
          totalPaymentWithGst: existingCompany.totalPaymentWithGst || 0,
          lastFollowUpdate: existingCompany.lastFollowUpdate,
          estPaymentDate: existingCompany.estPaymentDate,
          remarks: existingCompany.remarks,
          bdeName: existingCompany.bdeName,
          bdmName: existingCompany.bdmName,
          caseType: existingCompany.caseType,
          lastAddedOnDate: existingCompany.addedOnDate,
          isPreviousMaturedCase: existingCompany.isPreviousMaturedCase,
        }
      };

      // Update the history array and replace main data with new data
      const updatedCompany = await ProjectionModel.findByIdAndUpdate(
        existingCompany._id,
        {
          $push: { history: newHistoryEntry },
          companyId: payload.companyId,
          ename: payload.ename,
          date: payload.date,
          time: payload.time,
          offeredServices: payload.offeredServices,
          offeredPrice: payload.offeredPrice,
          totalPayment: payload.totalPayment,
          offeredPriceWithGst: payload.offeredPriceWithGst || 0,
          totalPaymentWithGst: payload.totalPaymentWithGst || 0,
          lastFollowUpdate: payload.lastFollowUpdate,
          estPaymentDate: payload.estPaymentDate,
          remarks: payload.remarks,
          bdeName: payload.bdeName,
          bdmName: payload.bdmName,
          caseType: payload.caseType,
          isPreviousMaturedCase: payload.isPreviousMaturedCase,
          addedOnDate: payload.addedOnDate,
        },
        { new: true, upsert: true }
      );

      res.json({ result: true, message: "Projection updated and added to history", data: updatedCompany });
    } else {
      // Create a new entry if the company doesn't exist
      const newCompany = new ProjectionModel({
        companyId: payload.companyId,
        companyName: payload.companyName,
        ename: payload.ename,
        date: payload.date,
        time: payload.time,
        offeredServices: payload.offeredServices,
        offeredPrice: payload.offeredPrice,
        totalPayment: payload.totalPayment,
        offeredPriceWithGst: payload.offeredPriceWithGst || 0,
        totalPaymentWithGst: payload.totalPaymentWithGst || 0,
        lastFollowUpdate: payload.lastFollowUpdate,
        estPaymentDate: payload.estPaymentDate,
        remarks: payload.remarks,
        bdeName: payload.bdeName,
        bdmName: payload.bdmName,
        caseType: payload.caseType,
        isPreviousMaturedCase: payload.isPreviousMaturedCase,
        addedOnDate: payload.addedOnDate,
        history: []
      });

      await newCompany.save();
      res.json({ result: true, message: "New company projection added", data: newCompany });
    }

  } catch (error) {
    res.status(500).json({ result: false, message: "Internal server error", error: error.message });
    console.log(error);
  }
});

router.post('/addDailyProjection/:ename', async (req, res) => {
  const { ename } = req.params;
  const {
    companyId,
    companyName,
    bdeName,
    bdmName,
    offeredServices,
    estimatedPaymentDate,
    offeredPrice,
    expectedPrice,
    offeredPriceWithGst,
    expectedPriceWithGst,
    remarks,
  } = req.body.projectionData;

  try {
    // Normalize the estimatedPaymentDate
    const normalizedDate = new Date(estimatedPaymentDate);
    // normalizedDate.setHours(0, 0, 0, 0);

    // Find or create the employee's daily projection
    let dailyProjection = await DailyEmployeeProjection.findOne({ ename });

    if (!dailyProjection) {
      // If no record exists, create a new document for the employee with the projection
      dailyProjection = new DailyEmployeeProjection({
        ename,
        projectionsByDate: [
          {
            estimatedPaymentDate: normalizedDate,
            result: "Added", // Set result to "Added" since we are adding a projection
            projections: [
              {
                companyId,
                companyName,
                bdeName,
                bdmName,
                offeredServices,
                offeredPrice,
                expectedPrice,
                offeredPriceWithGst,
                expectedPriceWithGst,
                remarks,
              },
            ],
          },
        ],
      });
    } else {
      // Remove the company from any existing date entries to prevent duplicates
      dailyProjection.projectionsByDate.forEach((entry) => {
        entry.projections = entry.projections.filter(
          (proj) => proj.companyId.toString() !== companyId.toString()
        );
      });

      // Remove any date entries that no longer have projections
      dailyProjection.projectionsByDate = dailyProjection.projectionsByDate.filter(
        (entry) => entry.projections.length > 0
      );

      // Find any existing date entry for this estimatedPaymentDate
      let dateEntry = dailyProjection.projectionsByDate.find(
        (entry) => entry.estimatedPaymentDate.getTime() === normalizedDate.getTime()
      );

      if (dateEntry) {
        // If a date entry exists, update the projection and set result to "Added"
        dateEntry.projections.push({
          companyId,
          companyName,
          bdeName,
          bdmName,
          offeredServices,
          offeredPrice,
          expectedPrice,
          offeredPriceWithGst,
          expectedPriceWithGst,
          remarks,
        });
        dateEntry.result = "Added"; // Update result to "Added"
      } else {
        // Otherwise, create a new date entry with the projection and result
        dailyProjection.projectionsByDate.push({
          estimatedPaymentDate: normalizedDate,
          result: "Added",
          projections: [
            {
              companyId,
              companyName,
              bdeName,
              bdmName,
              offeredServices,
              offeredPrice,
              expectedPrice,
              offeredPriceWithGst,
              expectedPriceWithGst,
              remarks,
            },
          ],
        });
      }
    }

    await dailyProjection.save();
    res.json({ result: true, message: "Daily projection updated successfully", data: dailyProjection });
  } catch (error) {
    console.error("Error updating daily projection:", error);
    res.status(500).json({ result: false, message: "Internal server error", error: error.message });
  }
});

router.post('/updateDailyProjection/:ename', async (req, res) => {
  const { ename } = req.params;
  let {
    companyId,
    companyName,
    bdeName,
    bdmName,
    offeredServices,
    estimatedPaymentDate,
    offeredPrice,
    expectedPrice,
    offeredPriceWithGst,
    expectedPriceWithGst,
    remarks
  } = req.body.projectionData;

  console.log("companyId", companyId);
  try {
    // Normalize the estimatedPaymentDate
    const normalizedDate = new Date(estimatedPaymentDate);

    // Find the employee's daily projection or create a new one if not found
    let dailyProjection = await DailyEmployeeProjection.findOne({ ename });
    if (!dailyProjection) {
      // Create a new daily projection if it doesn't exist
      dailyProjection = new DailyEmployeeProjection({
        ename,
        projectionsByDate: [{
          estimatedPaymentDate: normalizedDate,
          result: "Added",
          projections: [{ companyId, companyName, bdeName, bdmName, offeredServices, offeredPrice, expectedPrice, offeredPriceWithGst, expectedPriceWithGst, remarks }]
        }]
      });
    } else {
      let existingDateIndex;
      let existingProjectionIndex;
      let existingEntryDate;

      // Check for any existing projection with the same companyId
      dailyProjection.projectionsByDate.forEach((dateEntry, dateIndex) => {
        dateEntry.projections.forEach((proj, projIndex) => {
          if (proj.companyId.toString() === companyId.toString()) {
            existingDateIndex = dateIndex;
            existingProjectionIndex = projIndex;
            existingEntryDate = dateEntry.estimatedPaymentDate;
          }
        });
      });

      if (existingDateIndex !== undefined) {
        // The projection exists; check if the date has changed
        if (existingEntryDate.getTime() !== normalizedDate.getTime()) {
          // If the projection date is changed, remove it from the current date entry
          const projectionsArray = dailyProjection.projectionsByDate[existingDateIndex].projections;
          projectionsArray.splice(existingProjectionIndex, 1);

          // Check if this was the only projection for this date
          if (projectionsArray.length === 0) {
            // If so, remove the entire projectionsByDate entry
            dailyProjection.projectionsByDate.splice(existingDateIndex, 1);
          } else {
            // Otherwise, update `result` to "Not Added Yet" for the current date
            dailyProjection.projectionsByDate[existingDateIndex].result = "Added";
          }

          // Add a new entry for the updated date or add to an existing entry for that date
          let newDateEntry = dailyProjection.projectionsByDate.find(entry =>
            entry.estimatedPaymentDate.getTime() === normalizedDate.getTime()
          );

          if (newDateEntry) {
            // If a new date entry already exists, push the new projection
            newDateEntry.projections.push({
              companyId, companyName, bdeName, bdmName, offeredServices, offeredPrice, expectedPrice, offeredPriceWithGst, expectedPriceWithGst, remarks
            });
            newDateEntry.result = "Added"; // Update result for the new date entry
          } else {
            // Create a new date entry if none exists for the updated date
            dailyProjection.projectionsByDate.push({
              estimatedPaymentDate: normalizedDate,
              result: "Added",
              projections: [{
                companyId, companyName, bdeName, bdmName, offeredServices, offeredPrice, expectedPrice, offeredPriceWithGst, expectedPriceWithGst, remarks
              }]
            });
          }
        } else {
          // If the date hasn't changed, simply update the existing projection details
          dailyProjection.projectionsByDate[existingDateIndex].projections[existingProjectionIndex] = {
            companyId, companyName, bdeName, bdmName, offeredServices, offeredPrice, expectedPrice, offeredPriceWithGst, expectedPriceWithGst, remarks
          };
          dailyProjection.projectionsByDate[existingDateIndex].result = "Added";
        }
      } else {
        // If no existing projection is found for this companyId, add a new one for the specified date
        const dateEntry = dailyProjection.projectionsByDate.find(entry =>
          entry.estimatedPaymentDate.getTime() === normalizedDate.getTime()
        );

        if (dateEntry) {
          dateEntry.projections.push({
            companyId, companyName, bdeName, bdmName, offeredServices, offeredPrice, expectedPrice, offeredPriceWithGst, expectedPriceWithGst, remarks
          });
          dateEntry.result = "Added";
        } else {
          dailyProjection.projectionsByDate.push({
            estimatedPaymentDate: normalizedDate,
            result: "Added",
            projections: [{
              companyId, companyName, bdeName, bdmName, offeredServices, offeredPrice, expectedPrice, offeredPriceWithGst, expectedPriceWithGst, remarks
            }]
          });
        }
      }
    }

    await dailyProjection.save();
    res.json({ result: true, message: "Daily projection updated successfully", data: dailyProjection });
  } catch (error) {
    console.error("Error updating daily projection:", error);
    res.status(500).json({ result: false, message: "Internal server error", error: error.message });
  }
});

// Endpoint to set projection count to zero for an employee on a specific date
router.post('/setProjectionCountToZero', async (req, res) => {
  const { employeeName, date } = req.body;

  try {
    // Normalize the date to check only for the day, ignoring the time
    const normalizedDate = new Date(date);
    // normalizedDate.setHours(0, 0, 0, 0);

    // Find the employee's daily projection data
    let dailyProjection = await DailyEmployeeProjection.findOne({ ename: employeeName });

    if (!dailyProjection) {
      // If no record exists for the employee, create it with a "Not Added Yet" result
      dailyProjection = new DailyEmployeeProjection({
        ename: employeeName,
        projectionsByDate: [
          {
            estimatedPaymentDate: normalizedDate,
            result: "Not Added Yet",
            projections: [] // Empty array as no projections are added
          }
        ]
      });
    } else {
      // Check if there’s already an entry for the given date
      const dateEntry = dailyProjection.projectionsByDate.find(
        entry => entry.estimatedPaymentDate.getTime() === normalizedDate.getTime()
      );

      if (dateEntry) {
        // If an entry exists, set result to "Added" if there are projections, otherwise "Not Added Yet"
        dateEntry.result = dateEntry.projections.length > 0 ? "Added" : "Not Added Yet";
      } else {
        // Add a new date entry with "Not Added Yet" if no entry exists for the date
        dailyProjection.projectionsByDate.push({
          estimatedPaymentDate: normalizedDate,
          result: "Not Added Yet",
          projections: []
        });
      }
    }

    await dailyProjection.save();
    res.json({ result: true, message: "Projection status updated for today", data: dailyProjection });
  } catch (error) {
    console.error("Error setting projection count to zero:", error);
    res.status(500).json({ result: false, message: "Internal server error", error: error.message });
    console.log(error)
  }
});

// Fetch all the projections :
router.get('/getProjection', async (req, res) => {
  try {
    const data = await ProjectionModel.find();
    res.json({ result: true, message: "Projection fetched successfully", data: data });
  } catch (error) {
    res.status(500).json({ result: false, message: "Error fetching projection", error: error });
  }
});

// Fetch projection for particular employee for current day :
router.get('/getCurrentDayProjection/:employeeName', async (req, res) => {
  const { employeeName } = req.params;
  const { companyName, date } = req.query;

  try {
    // If no date is provided, use the current day
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Build the query with dynamic filtering
    const query = {
      $or: [
        { bdeName: employeeName },
        { bdmName: employeeName },
        { "history.data.bdeName": employeeName },
        { "history.data.bdmName": employeeName }
      ],
      estPaymentDate: { $gte: targetDate, $lte: endOfDay }
    };

    // Add company name filter if provided
    if (companyName) {
      query.companyName = { $regex: companyName, $options: 'i' }; // 'i' for case-insensitive search
    }

    // Fetch data from the database
    const projections = await ProjectionModel.find(query);

    // Array to hold filtered results for the specific employee
    const projectionSummary = [];

    // Process each projection document
    projections.forEach(projection => {
      const { bdeName, bdmName, totalPayment, totalPaymentWithGst, estPaymentDate, history, _id, date } = projection;

      // Check main entry for employee relevance and date range
      if ((bdeName === employeeName || bdmName === employeeName) &&
        estPaymentDate >= targetDate && estPaymentDate <= endOfDay) {

        let mainEmployeePayment = 0;
        if (bdeName === bdmName && bdeName === employeeName) {
          mainEmployeePayment = totalPaymentWithGst ? totalPaymentWithGst : totalPayment;
        } else if (bdeName === employeeName || bdmName === employeeName) {
          mainEmployeePayment = totalPaymentWithGst ? (totalPaymentWithGst / 2) : (totalPayment / 2);
        }

        // Collect relevant dates for calculating `addedOnDate`
        const relevantDates = [new Date(date)]; // Start with main document date

        // Add history dates up to `estPaymentDate`
        history.forEach(entry => {
          const historyDate = new Date(entry.data.date);
          if (historyDate <= new Date(estPaymentDate)) {
            relevantDates.push(historyDate);
          }
        });

        // Find the oldest date in relevant dates
        const addedOnDate = new Date(Math.min(...relevantDates.map(d => d.getTime())));

        projectionSummary.push({
          _id,
          projectionDate: projection.date,
          companyName: projection.companyName,
          offeredServices: projection.offeredServices,
          offeredPrice: projection.offeredPrice,
          totalPayment: projection.totalPayment,
          offeredPriceWithGst: projection.offeredPriceWithGst || 0,
          totalPaymentWithGst: projection.totalPaymentWithGst || 0,
          employeePayment: mainEmployeePayment,
          bookingAmount: projection.bookingAmount || 0,
          bdeName,
          bdmName,
          lastFollowUpdate: projection.lastFollowUpdate,
          estPaymentDate: projection.estPaymentDate,
          remarks: projection.remarks,
          caseType: projection.caseType,
          isPreviousMaturedCase: projection.isPreviousMaturedCase,
          history: projection.history,
          addedOnDate // The oldest date found up to `estPaymentDate`
        });
      }
    });

    res.status(200).json({ result: true, message: "Projection data fetched successfully", data: projectionSummary });
  } catch (error) {
    res.status(500).json({ result: false, message: "Error fetching projection", error: error.message });
    console.log(error);
  }
});

// Check if projections exist for an employee on a specific date
router.get('/checkEmployeeProjectionForDate/:employeeName', async (req, res) => {
  const { employeeName } = req.params;
  const { date } = req.query;
  console.log("employeeName", employeeName)
  try {
    // If no date is provided, use the current day
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Build query to check if there are projections for the day
    const query = {
      $or: [
        { bdeName: employeeName },
        { bdmName: employeeName },
      ],
      estPaymentDate: { $gte: targetDate, $lte: endOfDay }
    };

    const projections = await ProjectionModel.find(query);

    if (projections.length > 0) {
      // Send back the company names in case projections are found
      const companyNames = projections.map(proj => proj.companyName);
      res.status(200).json({
        result: true,
        hasProjections: true,
        companyNames
      });
    } else {
      res.status(200).json({
        result: true,
        hasProjections: false
      });
    }
  } catch (error) {
    res.status(500).json({
      result: false,
      message: "Error checking projections",
      error: error.message
    });
  }
});

// Fetching all projections for current day :
router.get('/getCurrentDayProjection', async (req, res) => {
  const { companyName, date } = req.query;
  console.log("date", date)
  try {
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const query = {
      estPaymentDate: { $gte: startOfDay, $lte: endOfDay },
    };

    if (companyName) {
      query.companyName = { $regex: companyName, $options: 'i' };
    }

    const projections = await ProjectionModel.find(query);
    res.status(200).json({ result: true, message: "Projection data fetched successfully", data: projections });
  } catch (error) {
    res.status(500).json({ result: false, message: "Error fetching projection", error: error.message });
  }
});

// Endpoint to fetch today's projections for all employees
router.get('/getDailyEmployeeProjections', async (req, res) => {
  const { date } = req.query;
  console.log("Requested date:", date);

  try {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const dailyProjections = await DailyEmployeeProjection.find({});

    const response = dailyProjections
      .map(employeeProjection => {
        const { ename, projectionsByDate } = employeeProjection;

        const dateProjection = projectionsByDate.find(dateEntry => {
          const entryDate = new Date(dateEntry.estimatedPaymentDate);
          entryDate.setHours(0, 0, 0, 0);
          return entryDate.getTime() === targetDate.getTime();
        });

        if (dateProjection) {
          return {
            ename,
            total_companies: dateProjection.projections.length,
            total_offered_price: dateProjection.projections.reduce((sum, proj) => sum + proj.offeredPrice, 0),
            total_estimated_payment: dateProjection.projections.reduce((sum, proj) => sum + proj.expectedPrice, 0),
            total_services: dateProjection.projections.reduce((sum, proj) => sum + (proj.offeredServices.length || 0), 0),
            result: dateProjection.result || "Added",
          };
        } else {
          return null; // Return null if no projection found for the date
        }
      })
      .filter(Boolean); // Filter out any null values

    // Only return a response if there are valid projections for the date
    if (response.length > 0) {
      res.status(200).json({ result: true, message: "Daily employee projections fetched successfully", data: response });
    } else {
      res.status(200).json({ result: true, message: "No projections found for the specified date", data: [] });
    }
  } catch (error) {
    res.status(500).json({ result: false, message: "Internal server error", error: error.message });
  }
});

// Fetch projection for particular employee :
router.get('/getProjection/:employeeName', async (req, res) => {
  const { employeeName } = req.params;
  const { companyName } = req.query;

  try {
    const query = {
      $and: [
        // Ensure the employee is not deleted or the field does not exist
        {
          $or: [
            { isDeletedEmployee: false }, // Explicitly check if it's false
            { isDeletedEmployee: { $exists: false } }, // Check if the field does not exist
          ],
        },
        {
          $or: [
            { bdeName: employeeName },
            { bdmName: employeeName },
            { "history.data.bdeName": employeeName },
            { "history.data.bdmName": employeeName },
          ],
        },
      ],
    };

    if (companyName) {
      query.companyName = { $regex: companyName, $options: 'i' };
    }

    const projections = await ProjectionModel.find(query);
    const projectionSummary = [];

    projections.forEach(projection => {
      const { bdeName, bdmName, totalPayment, totalPaymentWithGst, history, _id, addedOnDate, companyName } = projection;

      // Set employee payment calculation for main object
      let mainEmployeePayment = 0;
      if (bdeName === bdmName && bdeName === employeeName) {
        mainEmployeePayment = totalPaymentWithGst ? totalPaymentWithGst : totalPayment;
      } else if (bdeName === employeeName || bdmName === employeeName) {
        mainEmployeePayment = totalPaymentWithGst ? (totalPaymentWithGst / 2) : (totalPayment / 2);
      }

      // Normalize addedOnDate if it exists
      let addedOnDateOnly = null;
      if (addedOnDate) {
        addedOnDateOnly = new Date(addedOnDate);
        addedOnDateOnly.setHours(0, 0, 0, 0);
      }

      // Main data
      const mainData = {
        _id,
        projectionDate: projection.date,
        companyName,
        offeredServices: projection.offeredServices,
        offeredPrice: projection.offeredPrice,
        totalPayment: projection.totalPayment,
        offeredPriceWithGst: projection.offeredPriceWithGst || 0,
        totalPaymentWithGst: projection.totalPaymentWithGst || 0,
        employeePayment: mainEmployeePayment,
        bookingAmount: projection.bookingAmount || 0,
        bdeName,
        bdmName,
        lastFollowUpdate: projection.lastFollowUpdate,
        estPaymentDate: projection.estPaymentDate,
        remarks: projection.remarks,
        caseType: projection.caseType,
        isPreviousMaturedCase: projection.isPreviousMaturedCase,
        addedOnDate: addedOnDateOnly,
        history: history || []
      };

      // Group history records by lastAddedOnDate
      const historyByDate = history.reduce((acc, entry) => {
        // Normalize lastAddedOnDate if it exists
        const lastAddedOnDateOnly = entry.data.lastAddedOnDate ? new Date(entry.data.lastAddedOnDate) : null;
        if (lastAddedOnDateOnly) {
          lastAddedOnDateOnly.setHours(0, 0, 0, 0);
          const dateKey = lastAddedOnDateOnly.toISOString();

          if (!acc[dateKey]) {
            acc[dateKey] = [];
          }
          acc[dateKey].push(entry.data);
        }
        return acc;
      }, {});

      // Add main data first if there's no exact match in history for addedOnDate
      if (addedOnDateOnly) {
        const mainDateKey = addedOnDateOnly.toISOString();
        projectionSummary.push(mainData);

        // Add only the latest history record for each unique lastAddedOnDate, skipping if it matches addedOnDate
        Object.entries(historyByDate).forEach(([dateKey, records]) => {
          if (dateKey !== mainDateKey) {
            const latestRecord = records.sort((a, b) => new Date(b.date) - new Date(a.date))[0];

            let historyEmployeePayment = 0;
            if (latestRecord.bdeName === latestRecord.bdmName && latestRecord.bdeName === employeeName) {
              historyEmployeePayment = latestRecord.totalPaymentWithGst ? latestRecord.totalPaymentWithGst : latestRecord.totalPayment;
            } else if (latestRecord.bdeName === employeeName || latestRecord.bdmName === employeeName) {
              historyEmployeePayment = latestRecord.totalPaymentWithGst ? (latestRecord.totalPaymentWithGst / 2) : (latestRecord.totalPayment / 2);
            }

            projectionSummary.push({
              _id: latestRecord._id || _id,
              projectionDate: latestRecord.date,
              companyName,
              offeredServices: latestRecord.offeredServices,
              offeredPrice: latestRecord.offeredPrice,
              totalPayment: latestRecord.totalPayment,
              offeredPriceWithGst: latestRecord.offeredPriceWithGst || 0,
              totalPaymentWithGst: latestRecord.totalPaymentWithGst || 0,
              employeePayment: historyEmployeePayment,
              bookingAmount: latestRecord.bookingAmount || 0,
              bdeName: latestRecord.bdeName,
              bdmName: latestRecord.bdmName,
              lastFollowUpdate: latestRecord.lastFollowUpdate,
              estPaymentDate: latestRecord.estPaymentDate,
              remarks: latestRecord.remarks,
              caseType: latestRecord.caseType,
              isPreviousMaturedCase: latestRecord.isPreviousMaturedCase,
              addedOnDate: latestRecord.lastAddedOnDate,
            });
          }
        });
      } else {
        // If addedOnDateOnly is invalid, just push the main data as-is
        projectionSummary.push(mainData);
      }
    });

    res.status(200).json({ result: true, message: "Projection data fetched successfully", data: projectionSummary });
  } catch (error) {
    res.status(500).json({ result: false, message: "Error fetching projection", error: error.message });
    console.log(error)
  }
});

// Update projection and add to history :
router.put('/updateProjection/:companyName', async (req, res) => {
  const { companyName } = req.params;
  const {
    date,
    time,
    ename,
    bdeName,
    bdmName,
    offeredServices,
    offeredPrice,
    totalPayment,
    offeredPriceWithGst,
    totalPaymentWithGst,
    lastFollowUpdate,
    estPaymentDate,
    remarks,
    caseType,
    isPreviousMaturedCase,
  } = req.body;

  try {
    // Find the main projection document by companyId
    let projection = await ProjectionModel.findOne({ companyName: companyName });

    if (projection) {
      // Push current main data to the history array before replacing it
      projection.history.push({
        data: {
          ename: projection.ename,
          date: projection.date,
          time: projection.time,
          offeredServices: projection.offeredServices,
          offeredPrice: projection.offeredPrice,
          totalPayment: projection.totalPayment,
          offeredPriceWithGst: projection.offeredPriceWithGst || 0,
          totalPaymentWithGst: projection.totalPaymentWithGst || 0,
          bookingAmount: projection.bookingAmount || 0,
          lastFollowUpdate: projection.lastFollowUpdate,
          estPaymentDate: projection.estPaymentDate,
          bdeName: projection.bdeName,
          bdmName: projection.bdmName,
          remarks: projection.remarks,
          caseType: projection.caseType,
          isPreviousMaturedCase: projection.isPreviousMaturedCase,
          lastAddedOnDate: projection.addedOnDate,
          // updatedAt: new Date()  // Optional timestamp for history entry
        },
      });

      // Update the main projection data with new values from the request
      projection.ename = ename;
      projection.date = date;
      projection.time = time;
      projection.offeredServices = offeredServices;
      projection.offeredPrice = offeredPrice;
      projection.totalPayment = totalPayment;
      projection.offeredPriceWithGst = offeredPriceWithGst;
      projection.totalPaymentWithGst = totalPaymentWithGst;
      projection.lastFollowUpdate = lastFollowUpdate;
      projection.estPaymentDate = estPaymentDate;
      projection.bdeName = bdeName;
      projection.bdmName = bdmName;
      projection.remarks = remarks;
      projection.caseType = caseType;
      projection.isPreviousMaturedCase = isPreviousMaturedCase;

      // Save the updated projection document
      await projection.save();
      return res.status(200).json({ result: true, message: "Projection updated and added to history", data: projection });
    }

    // If no document is found, return an error
    res.status(404).json({ result: false, message: "Projection not found" });
  } catch (error) {
    res.status(500).json({ result: false, message: "Error updating projection", error: error.message });
  }
});

// Fetch those leads whose status in Not Interested and Junk
const fetchLeads = async () => {
  try {
    const notInterestedLeads = await CompanyModel.find({
      Status: { $in: ["Not Interested", "Junk"] } // Proper usage of $in
    });
    return notInterestedLeads;
  } catch (error) {
    console.log('Error fetching leads:', error);
    // throw error; // Re-throw the error to handle it where this function is called
  }
};

// Schedule the Task to Run Automatically at 12 PM
// cron.schedule('0 10 * * *', async () => {
cron.schedule('45 23 * * *', async () => { // (11:45 PM)
  console.log('Running scheduled task at 11:45 PM');
  const currentDate = new Date();

  // Fetching leads for automatic update
  try {
    const leads = await fetchLeads();

    if (leads.length === 0) {
      console.log('No leads found with status "Not Interested" or "Junk".');
      return;
    }

    for (let lead of leads) {
      await CompanyModel.findOneAndUpdate(
        { "Company Name": lead["Company Name"] },
        {
          $set: {
            Status: 'Untouched',
            ename: 'Extracted',
            bdmAcceptStatus: 'NotForwarded',
            lastAssignedEmployee: lead.ename,
            extractedDate: currentDate,
          },
        },
        // { upsert: true }
      );
    }
    console.log('Leads updated successfully by cron job!');
  } catch (error) {
    console.error('Error updating leads in cron job:', error);
  }
});

module.exports = router;