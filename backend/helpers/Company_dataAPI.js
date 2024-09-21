var express = require('express');
var router = express.Router()
const dotenv = require('dotenv')
dotenv.config();
const CompanyModel = require("../models/Leads");
const RemarksHistory = require("../models/RemarksHistory");
const RecentUpdatesModel = require("../models/RecentUpdates");
const TeamLeadsModel = require("../models/TeamLeads.js");
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




// router.post("/update-status/:id", async (req, res) => {
//   const { id } = req.params;
//   const { newStatus, title, date, time,oldStatus } = req.body; // Destructure the required properties from req.body

//   try {
//     // Update the status field in the database based on the employee id
//     await CompanyModel.findByIdAndUpdate(id, { Status: newStatus });

//     // Create and save a new document in the RecentUpdatesModel collection
//     const newUpdate = new RecentUpdatesModel({
//       title: title,
//       date: date,
//       time: time,
//     });
//     await newUpdate.save();



//     res.status(200).json({ message: "Status updated successfully" });
//   } catch (error) {
//     console.error("Error updating status:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// router.post("/update-status/:id", async (req, res) => {
//   const { id } = req.params;
//   const { newStatus, title, date, time, oldStatus } = req.body;

//   try {
//     // Find the company by ID in the CompanyModel to get the company details
//     const company = await CompanyModel.findById(id);
//     if (!company) {
//       return res.status(404).json({ error: "Company not found" });
//     }

//     // Update the status field in the CompanyModel
//     await CompanyModel.findByIdAndUpdate(id, {
//       Status: newStatus,
//     });

//     // Check if newStatus is either "FollowUp" or "Interested"
//     if (newStatus === "FollowUp" || newStatus === "Interested") {
//       // Find the company in LeadHistoryForInterestedandFollowModel
//       let leadHistory = await LeadHistoryForInterestedandFollowModel.findOne({
//         "Company Name": company["Company Name"],
//       });

//       if (leadHistory) {
//         // If the record exists, update old status, new status, date, and time
//         leadHistory.oldStatus = oldStatus;
//         leadHistory.newStatus = newStatus;
//       } else {
//         // If the record does not exist, create a new one with the company name, ename, and statuses
//         leadHistory = new LeadHistoryForInterestedandFollowModel({
//           _id: id,
//           "Company Name": company["Company Name"],
//           ename: company.ename,
//           oldStatus: oldStatus,
//           newStatus: newStatus,
//           date: new Date(),  // Convert the date string to a Date object
//           time: time,
//         });
//       }

//       // Save the lead history update
//       await leadHistory.save();
//     }

//     // Create and save a new document in the RecentUpdatesModel collection
//     // const newUpdate = new RecentUpdatesModel({
//     //   title: title,
//     //   date: date,
//     //   time: time,
//     // });
//     // await newUpdate.save();

//     res.status(200).json({ message: "Status updated successfully" });
//   } catch (error) {
//     console.error("Error updating status:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.post("/update-status/:id", async (req, res) => {
  const { id } = req.params;
  const { newStatus, title, date, time, oldStatus } = req.body;

  try {
    // Find the company by ID in the CompanyModel to get the company details
    const company = await CompanyModel.findById(id);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    // Update the status field in the CompanyModel
    await CompanyModel.findByIdAndUpdate(id, {
      Status: newStatus,
    });

    // Define an array of statuses for which the lead history should be deleted
    const deleteStatuses = ["Matured", "Not Interested", "Busy", "Junk", "Untouched", "Not Picked Up"];

    if (deleteStatuses.includes(newStatus)) {
      // Find the company in LeadHistoryForInterestedandFollowModel
      const leadHistory = await LeadHistoryForInterestedandFollowModel.findOne({
        "Company Name": company["Company Name"],
      });

      // If lead history exists, delete the document
      if (leadHistory) {
        await LeadHistoryForInterestedandFollowModel.deleteOne({
          "Company Name": company["Company Name"],
        });
      }

    } else if (newStatus === "FollowUp" || newStatus === "Interested") {
      // Check if newStatus is either "FollowUp" or "Interested"
      // Find the company in LeadHistoryForInterestedandFollowModel
      let leadHistory = await LeadHistoryForInterestedandFollowModel.findOne({
        "Company Name": company["Company Name"],
      });

      if (leadHistory) {
        // If the record exists, update old status, new status, date, and time
        leadHistory.oldStatus = oldStatus;
        leadHistory.newStatus = newStatus;
      } else {
        // If the record does not exist, create a new one with the company name, ename, and statuses
        leadHistory = new LeadHistoryForInterestedandFollowModel({
          _id: id,
          "Company Name": company["Company Name"],
          ename: company.ename,
          oldStatus: oldStatus,
          newStatus: newStatus,
          date: new Date(),  // Convert the date string to a Date object
          time: time,
        });
      }

      // Save the lead history update
      await leadHistory.save();
    }

    // Optionally, you can still create and save a new document in RecentUpdatesModel collection
    // const newUpdate = new RecentUpdatesModel({
    //   title: title,
    //   date: date,
    //   time: time,
    // });
    // await newUpdate.save();

    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/leadDataHistoryInterested/:ename", async (req, res) => {
  const { ename } = req.params;
  try {
    const lead = await LeadHistoryForInterestedandFollowModel.find({ ename: ename });

    console.log("Lead Data:", lead);
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

// 6. ADD Multiple Companies(Pata nai kyu he)
// router.post("/leads", async (req, res) => {
//   const csvData = req.body;
//   const currentDate = new Date();
//   const time = `${currentDate.getHours()}:${currentDate.getMinutes()}`;
//   const date = currentDate.toISOString().split("T")[0]; // Get the date in YYYY-MM-DD format
//   console.log("csvdata", csvData)
//   const socketIO = req.originalUrl;
//   //console.log("csvdata" , csvData)
//   let counter = 0;
//   let successCounter = 0;
//   let duplicateEntries = []; // Array to store duplicate entries

//   try {
//     for (const employeeData of csvData) {
//       //console.log("employee" , employeeData)
//       try {
//         const employeeWithAssignData = {
//           ...employeeData,
//           AssignDate: new Date(),
//           "Company Name": employeeData["Company Name"].toUpperCase(),
//         };
//         const employee = new CompanyModel(employeeWithAssignData);
//         const savedEmployee = await employee.save();
//         if (employeeData.Remarks !== "") {
//           const newRemarksHistory = new RemarksHistory({
//             time,
//             date,
//             companyID: employeeData._id,
//             remarks: Remarks,
//             bdeName: ename,
//             companyName: employeeData["Company Name"],
//             //bdmName: remarksBdmName,
//           });

//           //await TeamLeadsModel.findByIdAndUpdate(companyId, { bdmRemarks: Remarks });

//           // Save the new entry to MongoDB
//           await newRemarksHistory.save();
//         }
//         //console.log("saved" , savedEmployee)
//         successCounter++;

//       } catch (error) {
//         duplicateEntries.push(employeeData);
//         //console.log("kuch h ye" , duplicateEntries);
//         console.error("Error saving employee:", error.message);
//         counter++;
//       }
//     }

//     if (duplicateEntries.length > 0) {
//       //console.log("yahan chala csv pr")
//       //console.log(duplicateEntries , "duplicate")
//       const json2csvParser = new Parser();
//       // If there are duplicate entries, create and send CSV
//       const csvString = json2csvParser.parse(duplicateEntries);
//       // console.log(csvString , "csv")
//       res.setHeader("Content-Type", "text/csv");
//       res.setHeader(
//         "Content-Disposition",
//         "attachment; filename=DuplicateEntries.csv"
//       );
//       res.status(200).end(csvString);

//       //console.log("csvString" , csvString)
//     } else {
//       // console.log("yahan chala counter pr")
//       res.status(200).json({
//         message: "Data sent successfully",
//         counter: counter,
//         successCounter: successCounter,
//       });

//     }
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//     console.error("Error in bulk save:", error.message);
//   }
// });

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




router.delete("/newcompanynamedelete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Find the employee's data by id
    const employeeData = await adminModel.findById(id);
    //console.log("employee", employeeData)
    if (!employeeData) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Update companies where the employee's name matches
    await CompanyModel.updateMany(
      { ename: employeeData.ename },
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
    await TeamLeadsModel.deleteMany({ bdeName: employeeData.ename });

    // Delete the corresponding document from CompanyModel collection
    await CompanyModel.findByIdAndDelete(id);

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

    //console.log(employeeData)
    if (!employeeData) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Update companies where the employee's name matches
    const data = await CompanyModel.updateMany(
      { ename: employeeData.ename },
      {
        $set: {
          //ename: "Not Alloted",
          //bdmAcceptStatus: "NotForwarded",
          //feedbackPoints: [],
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
  } catch (error) {
    console.error("Error deleting employee data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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

//-------------------api to filter leads-----------------------------------
// router.get('/filter-leads', async (req, res) => {
//   const {
//       selectedStatus,
//       selectedState,
//       selectedNewCity,
//       selectedBDEName,
//       selectedAssignDate,
//       selectedUploadedDate,
//       selectedAdminName,
//       selectedYear,
//       selectedCompanyIncoDate,
//   } = req.query;
//   const page = parseInt(req.query.page) || 1; // Page number
//   const limit = parseInt(req.query.limit) || 500; // Items per page
//   const skip = (page - 1) * limit; // Number of documents to skip
// console.log(selectedBDEName)
//   try {
//       let query = {};

//       // Construct query object based on filters
//       if (selectedStatus) query.Status = selectedStatus;
//       if (selectedState) query.State = selectedState;
//       if (selectedNewCity) query.City = selectedNewCity;
//       if (selectedBDEName && selectedBDEName.trim() !== '') {
//         query.ename = new RegExp(`^${selectedBDEName.trim()}$`, 'i');
//       }
//       if (selectedAssignDate) {
//           query.AssignDate = {
//               $gte: new Date(selectedAssignDate).toISOString(),
//               $lt: new Date(new Date(selectedAssignDate).setDate(new Date(selectedAssignDate).getDate() + 1)).toISOString()
//           };
//       }
//       if (selectedAdminName && selectedAdminName.trim() !== '') query.UploadedBy = new RegExp(`^${selectedAdminName.trim()}$`, 'i');
//       if (selectedUploadedDate) {
//           query.AssignDate = {
//               $gte: new Date(selectedUploadedDate).toISOString(),
//               $lt: new Date(new Date(selectedUploadedDate).setDate(new Date(selectedUploadedDate).getDate() + 1)).toISOString()
//           };
//       }
//       if (selectedYear) {
//           const yearStartDate = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
//           const yearEndDate = new Date(`${selectedYear}-12-31T23:59:59.999Z`);
//           query["Company Incorporation Date  "] = {
//               $gte: yearStartDate,
//               $lt: yearEndDate
//           };
//       }
//       if (selectedCompanyIncoDate) {
//           query["Company Incorporation Date  "] = {
//               $gte: new Date(selectedCompanyIncoDate).toISOString(),
//               $lt: new Date(new Date(selectedCompanyIncoDate).setDate(new Date(selectedCompanyIncoDate).getDate() + 1)).toISOString()
//           };
//       }

//       console.log(query);

//       // Fetch assigned data
//       const assignedQuery = { ...query, ename: { $ne: 'Not Alloted' } };
//       console.log("assigned" , assignedQuery)
//       const assignedCount = await CompanyModel.countDocuments(assignedQuery);
//       const assignedData = await CompanyModel.find(assignedQuery).skip(skip).limit(limit).lean();

//       // Fetch unassigned data
//       const unassignedQuery = { ...query, ename: 'Not Alloted' };
//       const unassignedCount = await CompanyModel.countDocuments(unassignedQuery);
//       const unassignedData = await CompanyModel.find(unassignedQuery).skip(skip).limit(limit).lean();

//       res.status(200).json({
//           assigned: assignedData,
//           unassigned: unassignedData,
//           totalAssigned: assignedCount,
//           totalUnassigned: unassignedCount,
//           totalPages: Math.ceil((assignedCount + unassignedCount) / limit),  // Calculate total pages
//           currentPage: page  // Current page number
//       });

//   } catch (error) {
//       console.error('Error searching leads:', error);
//       res.status(500).json({ error: 'Internal server error' });
//   }
// });

// router.get('/filter-leads', async (req, res) => {
//   const {
//     selectedStatus,
//     selectedState,
//     selectedNewCity,
//     selectedBDEName,
//     selectedAssignDate,
//     selectedUploadedDate,
//     selectedExtractedDate,
//     selectedAdminName,
//     selectedYear,
//     monthIndex,
//     selectedCompanyIncoDate,
//     selectedBdmName,
//     selectedBdeForwardDate,
//     selectedFowradedStatus,
//     selectedStatusModificationDate,
//   } = req.query;

//   //console.log(selectedYear)

//   const page = parseInt(req.query.page) || 1; // Page number
//   const limit = parseInt(req.query.limit) || 500; // Items per page
//   const skip = (page - 1) * limit; // Number of documents to skip

//   try {
//     let baseQuery = {};

//     // Construct query object based on filters
//     if (selectedStatus) baseQuery.Status = selectedStatus;
//     if (selectedState) baseQuery.State = selectedState;
//     if (selectedNewCity) baseQuery.City = selectedNewCity;
//     if (selectedBdmName) baseQuery.bdmName = selectedBdmName;

//     if (selectedFowradedStatus === "Yes") {
//       baseQuery.bdmAcceptStatus = {
//         $in: ["Pending", "Accept"]
//       };
//     } else if (selectedFowradedStatus === "No") {
//       baseQuery.bdmAcceptStatus = "NotForwarded";
//     }

//     if (selectedAssignDate) {
//       baseQuery.AssignDate = {
//         $gte: new Date(selectedAssignDate).toISOString(),
//         $lt: new Date(new Date(selectedAssignDate).setDate(new Date(selectedAssignDate).getDate() + 1)).toISOString()
//       };
//     }
//     if (selectedAdminName && selectedAdminName.trim() !== '') {
//       baseQuery.UploadedBy = new RegExp(`^${selectedAdminName.trim()}$`, 'i');
//     }

//     if (selectedUploadedDate) {
//       baseQuery.UploadDate = {
//         $gte: new Date(selectedUploadedDate).toISOString(),
//         $lt: new Date(new Date(selectedUploadedDate).setDate(new Date(selectedUploadedDate).getDate() + 1)).toISOString()
//       };
//     }

//     if (selectedExtractedDate) {
//       baseQuery.extractedDate = {
//         $gte: new Date(selectedExtractedDate).toISOString(),
//         $lt: new Date(new Date(selectedExtractedDate).setDate(new Date(selectedExtractedDate).getDate() + 1)).toISOString()
//       };
//     }
//     console.log("selectedbdeforwaddate", selectedBdeForwardDate)
//     if (selectedBdeForwardDate) {
//       // Parse the selected date and add 1 day to correctly adjust for local time
//       const startOfDay = new Date(selectedBdeForwardDate);
//       startOfDay.setDate(startOfDay.getDate() + 1);
//       startOfDay.setHours(0, 0, 0, 0); // Start of the adjusted day (00:00:00.000)

//       // Create the end of the adjusted day (23:59:59.999)
//       const endOfDay = new Date(startOfDay);
//       endOfDay.setHours(23, 59, 59, 999);

//       console.log("start", startOfDay.toISOString()); // Debugging: Logs start of the adjusted day in UTC
//       console.log("end", endOfDay.toISOString()); // Debugging: Logs end of the adjusted day in UTC

//       baseQuery.bdeForwardDate = {
//         $gte: startOfDay.toISOString(),
//         $lt: endOfDay.toISOString()
//       };
//     }

//     if (selectedYear) {
//       if (monthIndex !== '0') {
//         const year = parseInt(selectedYear);
//         console.log("year", year)
//         const month = parseInt(monthIndex) - 1; // JavaScript months are 0-indexed
//         const monthStartDate = new Date(year, month, 1);
//         const monthEndDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
//         baseQuery["Company Incorporation Date  "] = {
//           $gte: monthStartDate,
//           $lt: monthEndDate
//         };
//       } else {
//         const yearStartDate = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
//         const yearEndDate = new Date(`${selectedYear}-12-31T23:59:59.999Z`);
//         baseQuery["Company Incorporation Date  "] = {
//           $gte: yearStartDate,
//           $lt: yearEndDate
//         };
//       }
//     }

//     if (selectedCompanyIncoDate) {
//       const selectedDate = new Date(selectedCompanyIncoDate);
//       const isEpochDate = selectedDate.getTime() === new Date('1970-01-01T00:00:00Z').getTime();
//       if (isEpochDate) {
//         // If the selected date is 01/01/1970, find documents with null "Company Incorporation Date"
//         baseQuery["Company Incorporation Date  "] = null;
//       } else {
//         // Otherwise, use the selected date to find documents within that day
//         baseQuery["Company Incorporation Date  "] = {
//           $gte: new Date(selectedDate).toISOString(),
//           $lt: new Date(new Date(selectedDate).setDate(selectedDate.getDate() + 1)).toISOString()
//         };
//       }
//     }

//     console.log(baseQuery);

//     let extractedData = [];
//     let extractedDataCount = 0;
//     if (!selectedBDEName || selectedBDEName.trim() === '') {
//       let extractedQuery = { ...baseQuery, ename: "Extracted" }
//       extractedDataCount = await CompanyModel.countDocuments(extractedQuery);
//       extractedData = await CompanyModel.find(extractedQuery).skip(skip).limit(limit).lean();
//     }

//     // Fetch assigned data
//     let assignedQuery = { ...baseQuery, ename: { $nin: ['Not Alloted', 'Extracted'] } };
//     if (selectedBDEName && selectedBDEName.trim() !== '') {
//       assignedQuery.ename = new RegExp(`^${selectedBDEName.trim()}$`, 'i');
//     }

//     const assignedCount = await CompanyModel.countDocuments(assignedQuery);
//     const assignedData = await CompanyModel.find(assignedQuery).skip(skip).limit(limit).lean();

//     // Fetch unassigned data only if selectedBDEName is not specified
//     let unassignedData = [];
//     let unassignedCount = 0;
//     if (!selectedBDEName || selectedBDEName.trim() === '') {
//       let unassignedQuery = { ...baseQuery, ename: 'Not Alloted' };
//       unassignedCount = await CompanyModel.countDocuments(unassignedQuery);
//       unassignedData = await CompanyModel.find(unassignedQuery).skip(skip).limit(limit).lean();
//     }

//     console.log("assignedquery", assignedQuery)
//     console.log("assgineddata", assignedData)
//     console.log("totalAssigned", assignedCount)

//     res.status(200).json({
//       assigned: assignedData,
//       unassigned: unassignedData,
//       extracted: extractedData,
//       extractedDataCount: extractedDataCount,
//       totalAssigned: assignedCount,
//       totalUnassigned: unassignedCount,
//       totalPages: Math.ceil((assignedCount + unassignedCount) / limit),  // Calculate total pages
//       currentPage: page  // Current page number
//     });

//   } catch (error) {
//     console.error('Error searching leads:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

router.get('/filter-leads', async (req, res) => {
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
      console.log("modificationdate", selectedStatusModificationDate);
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
    console.log("selectedAssignDate", selectedAssignDate)

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



//9. Filtere search for Reading Multiple Companies
// router.get('/search-leads', async (req, res) => {
//   try {
//     const { searchQuery } = req.query;
//     const { field } = req.query;
//     //console.log(searchQuery , "search")

//     let searchResults;
//     if (field === "Company Name" || field === "Company Email") {
//       if (searchQuery && searchQuery.trim() !== '') {
//         // Perform database query to search for leads matching the searchQuery
//         const query = {};
//         query[field] = { $regex: new RegExp(searchQuery, 'i') }; // Case-insensitive search

//         searchResults = await CompanyModel.find(query).limit(500).lean();
//       } else {
//         // If search query is empty, fetch 500 data from CompanyModel
//         searchResults = await CompanyModel.find().limit(500).lean();
//       }
//     }
//     else if (field === "Company Number") {
//       if (searchQuery && searchQuery.trim() !== '') {
//         // Check if the searchQuery is a valid number
//         const searchNumber = Number(searchQuery);

//         if (!isNaN(searchNumber)) {
//           // Perform database query to search for leads matching the searchQuery as a number
//           searchResults = await CompanyModel.find({
//             'Company Number': searchNumber
//           }).limit(500).lean();
//         } else {
//           // If the searchQuery is not a number, perform a regex search (if needed for some reason)
//           searchResults = await CompanyModel.find({
//             'Company Number': { $regex: new RegExp(searchQuery) } // Case-insensitive search
//           }).limit(500).lean();
//         }
//       } else {
//         // If search query is empty, fetch 500 data from CompanyModel
//         searchResults = await CompanyModel.find().limit(500).lean();
//       }
//     }
//     res.json(searchResults);
//   } catch (error) {
//     console.error('Error searching leads:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });
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
          query = { 'Company Number': searchTerm };
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
  //console.log(bdeNextFollowUpDate);
  try {
    await CompanyModel.findByIdAndUpdate(companyId, {
      bdeNextFollowUpDate: bdeNextFollowUpDate,
    });

    res.status(200).json({ message: "Date Updated successfully" });
  } catch (error) {
    console.error("Error fetching Date:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/employees/:ename", async (req, res) => {
  try {
    const employeeName = req.params.ename;
    console.log("Employee name:", employeeName);

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

  // If not assigned, post data to MongoDB or perform any desired action
  // const updatePromises = selectedObjects.map((obj) => {
  //   // Add AssignData property with the current date
  //   const updatedObj = {
  //     ...obj,
  //     ename: employeeSelection,
  //     AssignDate: new Date(),
  //   };
  //   return CompanyModel.updateOne({ _id: obj._id }, updatedObj);
  // });

  // Add the recent update to the RecentUpdatesModel


  // Execute all update promises
  // await Promise.all(updatePromises);

  res.json({ message: "Data posted successfully" });
});

router.put("/newcompanyname/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { ename } = req.body;
    // Validate if 'ename' is provided
    if (!ename) {
      return res.status(400).json({ error: "Ename is required for update" });
    }
    // Find and update the company data
    const updatedData = await CompanyModel.findByIdAndUpdate(
      id,
      { ename: ename },
      { new: true }
    );
    // Check if data was found and updated
    if (!updatedData) {
      return res.status(404).json({ error: "Company data not found" });
    }
    res.json({ message: "Company data updated successfully", updatedData });
  } catch (error) {
    console.error("Error updating company data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
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

router.get("/fetchLeads", async (req, res) => {
  try {
    // Aggregating the data based on ename and status
    const data = await CompanyModel.aggregate([
      {
        $match: {
          ename: { $ne: "Not Alloted" }, // Filter out Not Alloted
        },
      },
      {
        $group: {
          _id: {
            ename: "$ename",
            status: "$Status",
          },
          count: { $sum: 1 },
          lastAssignDate: { $max: "$AssignDate" }, // Get the latest AssignDate for each ename
        },
      },
      {
        $group: {
          _id: "$_id.ename",
          statusCounts: {
            $push: {
              status: "$_id.status",
              count: "$count",
            },
          },
          totalLeads: { $sum: "$count" },
          lastAssignDate: { $max: "$lastAssignDate" },
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
router.get("/fetchForwaredLeads", async (req, res) => {
  try {
    const data = await CompanyModel.aggregate([
      {
        $match: {
          ename: { $ne: "Not Alloted" }, // Filter out Not Alloted
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

    res.send(formattedData);
  } catch (error) {
    console.error("Error fetching data:", error.message);
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

module.exports = router;