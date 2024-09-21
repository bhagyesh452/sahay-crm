var express = require("express");
var router = express.Router();
const dotenv = require("dotenv");
const app = express();
dotenv.config();
const { exec } = require("child_process");
const { parse } = require('date-fns');
const moment = require('moment');

app.use(express.json());

const CompanyModel = require("../models/Leads.js");
const RemarksHistory = require("../models/RemarksHistory");
const TeamLeadsModel = require("../models/TeamLeads.js");
const RequestMaturedModel = require("../models/RequestMatured.js");
const InformBDEModel = require("../models/InformBDE.js");
const FollowUpModel = require('../models/FollowUp.js');
const RMCertificationModel = require('../models/RMCertificationServices.js');
const RedesignedDraftModel = require('../models/RedesignedDraftModel.js');
const RedesignedLeadformModel = require('../models/RedesignedLeadform.js');
const RMCertificationHistoryModel = require('../models/RMCerificationHistoryModel.js');
const AdminExecutiveModel = require('../models/AdminExecutiveModel.js');
const AdminExecutiveHistoryModel = require('../models/AdminExecutiveHistoryModel.js');
//const companyName = process.env.COMPANY_NAME
function runTestScript(companyName) {
  console.log("Company Name:", companyName);

  //Ensure the companyName is properly quoted to handle spaces or special characters
  const command = `set COMPANY_NAME=${companyName}&& npx playwright test ../tests --project=chromium --headed`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Script stderr: ${stderr}`);
      return;
    }
    console.log(`Script stdout: ${stdout}`);
  });
  
}

// runTestScript("MWL FOODS LLP")


router.get("/redesigned-final-leadData-rm", async (req, res) => {
  try {
    const allData = await RedesignedLeadformModel.aggregate([
      {
        $addFields: {
          isVisibleToRmOfCerification: {
            $ifNull: ["$isVisibleToRmOfCerification", true],
          },
          lastActionDateAsDate: {
            $dateFromString: {
              dateString: "$lastActionDate",
              onError: new Date(0), // Default to epoch if conversion fails
              onNull: new Date(0), // Default to epoch if null
            },
          },
        },
      },
      {
        $match: {
          isVisibleToRmOfCerification: true,
        },
      },
      {
        $sort: {
          lastActionDateAsDate: -1,
        },
      },
    ]);

    res.status(200).json(allData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

router.post("/post-rmservicesdata", async (req, res) => {
  const { dataToSend } = req.body;
  const publishDate = new Date();
  const socketIO = req.io;

  try {
    let createData = [];
    let existingRecords = [];
    let successEntries = 0;
    let failedEntries = 0;

    //console.log("dataToSend" , dataToSend)

    for (const item of dataToSend) {
      try {
        // Check if the record already exists
        const existingRecord = await RMCertificationModel.findOne({
          "Company Name": item["Company Name"],
          serviceName: item.serviceName,
        });

        const existingRecordofAdminExecutive =
          await AdminExecutiveModel.findOne({
            "Company Name": item["Company Name"],
            serviceName: item.serviceName,
          });

        if (!existingRecord) {
          if (existingRecordofAdminExecutive) {
            const data = {
              ...item,
              bookingPublishDate: publishDate,
              letterStatus: existingRecordofAdminExecutive.letterStatus,
              dscStatus: existingRecordofAdminExecutive.subCategoryStatus,
            };
            const newRecord = await RMCertificationModel.create(data);
            //console.log("newRecord" , newRecord)
            createData.push(newRecord);
            successEntries++;
          } else {
            const data = {
              ...item,
              bookingPublishDate: publishDate,
            };
            const newRecord = await RMCertificationModel.create(data);
            //console.log("newRecord" , newRecord)
            createData.push(newRecord);
            successEntries++;
          }
          //console.log("createdData" , data)
        } else {
          existingRecords.push(existingRecord);
          failedEntries++;
        }
      } catch (error) {
        console.error("Error saving record:", error.message);
        failedEntries++;
      }
    }
    socketIO.emit("rm-services-added");
    // Respond with success message and created data
    res.status(200).json({
      message: "Details added to RM services",
      data: createData,
      successEntries: successEntries,
      failedEntries: failedEntries,
      existingRecords: existingRecords,
    });
  } catch (error) {
    console.error("Error creating/updating data:", error);
    res.status(500).send("Error creating/updating data");
  }
});

router.post("/post-adminexecutivedata", async (req, res) => {
  const { dataToSend } = req.body;
  const publishDate = new Date();
  const socketIO = req.io;

  try {
    let createData = [];
    let existingRecords = [];
    let successEntries = 0;
    let failedEntries = 0;

    for (const item of dataToSend) {
      try {
        // Check if the record already exists in AdminExecutiveModel
        const existingRecord = await AdminExecutiveModel.findOne({
          "Company Name": item["Company Name"],
          serviceName: item.serviceName,
        });

        // Check if the record exists in RMCertificationModel
        const existingRecordofRmCert = await RMCertificationModel.findOne({
          "Company Name": item["Company Name"],
          serviceName: item.serviceName,
        });

        if (!existingRecord) {
          if (existingRecordofRmCert) {
            // If record exists in RMCertificationModel, create a new record in RMCertificationModel
            const data = {
              ...item,
              bookingPublishDate: publishDate,
              letterStatus: existingRecordofRmCert.letterStatus,
              subCategoryStatus: existingRecordofRmCert.dscStatus,
            };
            const newRecord = await AdminExecutiveModel.create(data);
            createData.push(newRecord);
          } else {
            // If record does not exist in both, create a new record in AdminExecutiveModel
            const data = {
              ...item,
              bookingPublishDate: publishDate,
            };
            const newRecord = await AdminExecutiveModel.create(data);
            createData.push(newRecord);
          }
          successEntries++;
        } else {
          // If record already exists, add to existingRecords array
          existingRecords.push(existingRecord);
          failedEntries++;
        }
      } catch (error) {
        console.error("Error processing record:", error.message);
        failedEntries++;
      }
    }

    // Emit event to notify the client that the operation is complete
    socketIO.emit("adminexecutive-services-added");

    // Respond with success message and created data
    res.status(200).json({
      message: "Details added to RM services",
      data: createData,
      successEntries: successEntries,
      failedEntries: failedEntries,
      existingRecords: existingRecords,
    });
  } catch (error) {
    console.error("Error creating/updating data:", error);
    res.status(500).send("Error creating/updating data");
  }
});


router.post("/post-rmservices-from-listview", async (req, res) => {
  const { dataToSend } = req.body;
  try {
    const existingRecord = await RMCertificationModel.findOne({
      "Company Name": dataToSend["Company Name"],
      serviceName: dataToSend.serviceName,
    });
    if (existingRecord) {
      res.status(400).json({ message: "Service has already been added" });
    } else {
      const createdRecord = await RMCertificationModel.create(dataToSend);
      res.status(200).json({
        message: "Details added successfully",
      });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", details: error.message });
    }

    // For all other errors, send a 500 status code
    res
      .status(500)
      .json({ message: "Error swapping services", details: error.message });
  }
});

router.get("/rm-sevicesgetrequest/justfortest", async (req, res) => {
  try {
    const response = await RMCertificationModel.find();
    res.status(200).json(response);
  } catch (error) {
    console.log("Error fetching data", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
router.get("/adminexecutivedata/justfortest", async (req, res) => {
  try {
    const response = await AdminExecutiveModel.find();
    res.status(200).json(response);
  } catch (error) {
    console.log("Error fetching data", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// router.get('/rm-sevicesgetrequest', async (req, res) => {
//   try {
//     const { search, page = 1, limit = 50, activeTab } = req.query; // Extract search, page, and limit from request
//     //console.log("search", search)
//     // Build query object
//     let query = {};
//     if (search) {
//       const regex = new RegExp(search, 'i'); // Case-insensitive search
//       const numberSearch = parseFloat(search); // Attempt to parse the search term as a number

//       query = {
//         $or: [
//           { "Company Name": regex }, // Match companyName field
//           { serviceName: regex },
//           { "Company Email": regex },
//           { bdeName: regex },
//           { bdmName: regex },
//           // Only include the number fields if numberSearch is a valid number
//           ...(isNaN(numberSearch) ? [] : [
//             { "Company Number": numberSearch }, // Match companyNumber field
//             { caNumber: numberSearch } // Match caNumber field
//           ])
//         ]
//       };
//     }
//     //console.log("query", query)
//     const skip = (page - 1) * limit; // Calculate how many documents to skip

//     // Fetch data with pagination
//     let response;
//     if (activeTab === "General") {
//       response = await RMCertificationModel.find({ ...query, mainCategoryStatus: activeTab })
//         .sort({ addedOn: -1 })
//         .skip(skip)
//         .limit(parseInt(limit));
//     } else {
//       response = await RMCertificationModel.find({ ...query, mainCategoryStatus: activeTab })
//         .sort({ dateOfChangingMainStatus: -1 })
//         .skip(skip)
//         .limit(parseInt(limit));
//     }

//     //console.log("response" , response)

//     const totalDocuments = await RMCertificationModel.countDocuments(query);

//     const totalDocumentsGeneral = await RMCertificationModel.countDocuments({ ...query, mainCategoryStatus: "General" });
//     const totalDocumentsProcess = await RMCertificationModel.countDocuments({ ...query, mainCategoryStatus: "Process" });
//     const totalDocumentsDefaulter = await RMCertificationModel.countDocuments({ ...query, mainCategoryStatus: "Defaulter" });
//     const totalDocumentsReadyToSubmit = await RMCertificationModel.countDocuments({ ...query, mainCategoryStatus: "Ready To Submit" });
//     const totalDocumentsSubmitted = await RMCertificationModel.countDocuments({ ...query, mainCategoryStatus: "Submitted" });
//     const totalDocumentsHold = await RMCertificationModel.countDocuments({ ...query, mainCategoryStatus: "Hold" });
//     const totalDocumentsApproved = await RMCertificationModel.countDocuments({ ...query, mainCategoryStatus: "Approved" });

//     res.status(200).json({
//       data: response,
//       totalDocuments,
//       totalDocumentsGeneral,
//       totalDocumentsProcess,
//       totalDocumentsDefaulter,
//       totalDocumentsReadyToSubmit,
//       totalDocumentsSubmitted,
//       totalDocumentsHold,
//       totalDocumentsApproved,
//       currentPage: parseInt(page),
//       totalPages: Math.ceil(totalDocuments / limit)
//     });
//   } catch (error) {
//     console.log("Error fetching data", error);
//     res.status(500).send({ message: "Internal Server Error" });
//   }
// });

// router.get('/rm-sevicesgetrequest', async (req, res) => {
//   try {
//     const { search, page = 1, limit = 50, activeTab } = req.query; // Extract search, page, and limit from request
//     //console.log("search", search)
//     // Build query object
//     let query = {};
//     if (search) {
//       const regex = new RegExp(search, 'i'); // Case-insensitive search
//       const numberSearch = parseFloat(search); // Attempt to parse the search term as a number

//       query = {
//         $or: [
//           { "Company Name": regex }, // Match companyName field
//           { serviceName: regex },
//           { "Company Email": regex },
//           { bdeName: regex },
//           { bdmName: regex },
//           // Only include the number fields if numberSearch is a valid number
//           ...(isNaN(numberSearch) ? [] : [
//             { "Company Number": numberSearch }, // Match companyNumber field
//             { caNumber: numberSearch } // Match caNumber field
//           ])
//         ]
//       };
//     }
//     //console.log("query", query)
//     const skip = (page - 1) * limit; // Calculate how many documents to skip

//     // Fetch data with pagination
//     let response;
//     if (activeTab === "General") {
//       response = await RMCertificationModel.find({ ...query, mainCategoryStatus: activeTab })
//         .sort({ addedOn: -1 })
//         .skip(skip)
//         .limit(parseInt(limit));
//     } else {
//       response = await RMCertificationModel.find({ ...query, mainCategoryStatus: activeTab })
//         .sort({ dateOfChangingMainStatus: -1 })
//         .skip(skip)
//         .limit(parseInt(limit));
//     }

//     //console.log("response" , response)

//     const totalDocuments = await RMCertificationModel.countDocuments(query);

//     const totalDocumentsGeneral = await RMCertificationModel.countDocuments({ ...query, mainCategoryStatus: "General" });
//     const totalDocumentsProcess = await RMCertificationModel.countDocuments({ ...query, mainCategoryStatus: "Process" });
//     const totalDocumentsDefaulter = await RMCertificationModel.countDocuments({ ...query, mainCategoryStatus: "Defaulter" });
//     const totalDocumentsReadyToSubmit = await RMCertificationModel.countDocuments({ ...query, mainCategoryStatus: "Ready To Submit" });
//     const totalDocumentsSubmitted = await RMCertificationModel.countDocuments({ ...query, mainCategoryStatus: "Submitted" });
//     const totalDocumentsHold = await RMCertificationModel.countDocuments({ ...query, mainCategoryStatus: "Hold" });
//     const totalDocumentsApproved = await RMCertificationModel.countDocuments({ ...query, mainCategoryStatus: "Approved" });

//     res.status(200).json({
//       data: response,
//       totalDocuments,
//       totalDocumentsGeneral,
//       totalDocumentsProcess,
//       totalDocumentsDefaulter,
//       totalDocumentsReadyToSubmit,
//       totalDocumentsSubmitted,
//       totalDocumentsHold,
//       totalDocumentsApproved,
//       currentPage: parseInt(page),
//       totalPages: Math.ceil(totalDocuments / limit)
//     });
//   } catch (error) {
//     console.log("Error fetching data", error);
//     res.status(500).send({ message: "Internal Server Error" });
//   }
// });

router.get('/rm-sevicesgetrequest-complete', async (req, res) => {
  try {
    const { search, page = 1, limit = 500, activeTab } = req.query; // Extract search, page, and limit from request
    //console.log("search", search)
    // Build query object
    let query = {};
    if (search) {
      const regex = new RegExp(search, 'i'); // Case-insensitive search
      const numberSearch = parseFloat(search); // Attempt to parse the search term as a number

      query = {
        $or: [
          { "Company Name": regex }, // Match companyName field
          { serviceName: regex },
          { "Company Email": regex },
          { bdeName: regex },
          { bdmName: regex },
          // Only include the number fields if numberSearch is a valid number
          ...(isNaN(numberSearch) ? [] : [
            { "Company Number": numberSearch }, // Match companyNumber field
            { caNumber: numberSearch } // Match caNumber field
          ])
        ]
      };
    }
    //console.log("query", query)
    const skip = (page - 1) * limit; // Calculate how many documents to skip

    // Fetch data with pagination
    let response;
    if (activeTab === "General") {
      response = await RMCertificationModel.find({ ...query, mainCategoryStatus: activeTab })
        .sort({ addedOn: -1 })
        .skip(skip)
        .limit(parseInt(limit));
    } else {
      response = await RMCertificationModel.find({ ...query, mainCategoryStatus: activeTab })
        .sort({ dateOfChangingMainStatus: -1 })
        .skip(skip)
        .limit(parseInt(limit));
    }

    //console.log("response" , response)

    const totalDocuments = await RMCertificationModel.countDocuments(query);

    const totalDocumentsGeneral = await RMCertificationModel.countDocuments({ ...query, mainCategoryStatus: "General" });
    const totalDocumentsProcess = await RMCertificationModel.countDocuments({ ...query, mainCategoryStatus: "Process" });
    const totalDocumentsDefaulter = await RMCertificationModel.countDocuments({ ...query, mainCategoryStatus: "Defaulter" });
    const totalDocumentsReadyToSubmit = await RMCertificationModel.countDocuments({ ...query, mainCategoryStatus: "Ready To Submit" });
    const totalDocumentsSubmitted = await RMCertificationModel.countDocuments({ ...query, mainCategoryStatus: "Submitted" });
    const totalDocumentsHold = await RMCertificationModel.countDocuments({ ...query, mainCategoryStatus: "Hold" });
    const totalDocumentsApproved = await RMCertificationModel.countDocuments({ ...query, mainCategoryStatus: "Approved" });

    res.status(200).json({
      data: response,
      totalDocuments,
      totalDocumentsGeneral,
      totalDocumentsProcess,
      totalDocumentsDefaulter,
      totalDocumentsReadyToSubmit,
      totalDocumentsSubmitted,
      totalDocumentsHold,
      totalDocumentsApproved,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalDocuments / limit)
    });
  } catch (error) {
    console.log("Error fetching data", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get('/rm-sevicesgetrequest', async (req, res) => {
  try {
    const { search, page = 1, limit = 500, activeTab, companyNames, serviceNames } = req.query; // Extract companyNames and serviceNames

    // Build query object
    let query = {};

    if (search) {
      const regex = new RegExp(search, 'i'); // Case-insensitive search
      const numberSearch = parseFloat(search); // Attempt to parse the search term as a number

      query = {
        $or: [
          { "Company Name": regex }, // Match companyName field
          { serviceName: regex },
          { "Company Email": regex },
          { bdeName: regex },
          { bdmName: regex },
          // Only include the number fields if numberSearch is a valid number
          ...(isNaN(numberSearch) ? [] : [
            { "Company Number": numberSearch }, // Match companyNumber field
            { caNumber: numberSearch } // Match caNumber field
          ])
        ]
      };
    }

    // Add filtering based on companyNames and serviceNames if provided
    if (companyNames) {
      const companyNamesArray = companyNames.split(','); // Convert to array
      query["Company Name"] = { $in: companyNamesArray };
    }

    if (serviceNames) {
      const serviceNamesArray = serviceNames.split(','); // Convert to array
      query.serviceName = { $in: serviceNamesArray };
    }

    const skip = (page - 1) * limit; // Calculate how many documents to skip

    // Fetch data with pagination
    let response;
    if (activeTab === "General") {
      response = await RMCertificationModel.find({ ...query, mainCategoryStatus: activeTab })
        .sort({ addedOn: -1 })
        .skip(skip)
        .limit(parseInt(limit));
    } else {
      response = await RMCertificationModel.find({ ...query, mainCategoryStatus: activeTab })
        .sort({ dateOfChangingMainStatus: -1 })
        .skip(skip)
        .limit(parseInt(limit));
    }

    const totalDocuments = await RMCertificationModel.countDocuments(query);

    const totalDocumentsGeneral = await RMCertificationModel.countDocuments({ ...query, mainCategoryStatus: "General" });
    const totalDocumentsProcess = await RMCertificationModel.countDocuments({ ...query, mainCategoryStatus: "Process" });
    const totalDocumentsDefaulter = await RMCertificationModel.countDocuments({ ...query, mainCategoryStatus: "Defaulter" });
    const totalDocumentsReadyToSubmit = await RMCertificationModel.countDocuments({ ...query, mainCategoryStatus: "Ready To Submit" });
    const totalDocumentsSubmitted = await RMCertificationModel.countDocuments({ ...query, mainCategoryStatus: "Submitted" });
    const totalDocumentsHold = await RMCertificationModel.countDocuments({ ...query, mainCategoryStatus: "Hold" });
    const totalDocumentsApproved = await RMCertificationModel.countDocuments({ ...query, mainCategoryStatus: "Approved" });

    res.status(200).json({
      data: response,
      totalDocuments,
      totalDocumentsGeneral,
      totalDocumentsProcess,
      totalDocumentsDefaulter,
      totalDocumentsReadyToSubmit,
      totalDocumentsSubmitted,
      totalDocumentsHold,
      totalDocumentsApproved,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalDocuments / limit)
    });
  } catch (error) {
    console.log("Error fetching data", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});





// router.get("/adminexecutivedata", async (req, res) => {
//   try {
//     const { search } = req.query; // Extract search query from request

//     // Build query object
//     let query = {};
//     if (search) {
//       const regex = new RegExp(search, 'i'); // Case-insensitive search
//       const numberSearch = parseFloat(search); // Attempt to parse the search term as a number

//       query = {
//         $or: [
//           { "Company Name": regex }, // Match companyName field
//           { serviceName: regex },
//           { "Company Email": regex },
//           { bdeName: regex },
//           { bdmName: regex },
//           // Only include the number fields if numberSearch is a valid number
//           ...(isNaN(numberSearch) ? [] : [
//             { "Company Number": numberSearch }, // Match companyNumber field
//             { caNumber: numberSearch } // Match caNumber field
//           ])
//         ]
//       };
//     }
//     // Fetch data from the database with an optional query filter
//     const response = await AdminExecutiveModel.find(query);
//     res.status(200).json(response);
//   } catch (error) {
//     console.log("Error fetching data", error);
//     res.status(500).send({ message: "Internal Server Error" });
//   }
// });
router.get('/adminexecutive-complete', async (req, res) => {
  try {
    const { search, page = 1, limit = 500, activeTab } = req.query; // Extract search, page, and limit from request
    //console.log("search", search)
    // Build query object
    let query = {};
    if (search) {
      const regex = new RegExp(search, 'i'); // Case-insensitive search
      const numberSearch = parseFloat(search); // Attempt to parse the search term as a number

      query = {
        $or: [
          { "Company Name": regex }, // Match companyName field
          { serviceName: regex },
          { "Company Email": regex },
          { bdeName: regex },
          { bdmName: regex },
          // Only include the number fields if numberSearch is a valid number
          ...(isNaN(numberSearch) ? [] : [
            { "Company Number": numberSearch }, // Match companyNumber field
            { caNumber: numberSearch } // Match caNumber field
          ])
        ]
      };
    }
    //console.log("query", query)
    const skip = (page - 1) * limit; // Calculate how many documents to skip

    // Fetch data with pagination
    let response;
    if (activeTab === "General") {
      response = await AdminExecutiveModel.find({ ...query, mainCategoryStatus: activeTab })
        .sort({ addedOn: -1 })
        .skip(skip)
        .limit(parseInt(limit));
    } else {
      response = await AdminExecutiveModel.find({ ...query, mainCategoryStatus: activeTab })
        .sort({ dateOfChangingMainStatus: -1 })
        .skip(skip)
        .limit(parseInt(limit));
    }

    //console.log("response" , response)

    const totalDocuments = await AdminExecutiveModel.countDocuments(query);

    const totalDocumentsGeneral = await AdminExecutiveModel.countDocuments({ ...query, mainCategoryStatus: "General" });
    const totalDocumentsProcess = await AdminExecutiveModel.countDocuments({ ...query, mainCategoryStatus: "Process" });
    const totalDocumentsDefaulter = await AdminExecutiveModel.countDocuments({ ...query, mainCategoryStatus: "Defaulter" });
    const totalDocumentsReadyToSubmit = await AdminExecutiveModel.countDocuments({ ...query, mainCategoryStatus: "Ready To Submit" });
    const totalDocumentsSubmitted = await AdminExecutiveModel.countDocuments({ ...query, mainCategoryStatus: "Submitted" });
    const totalDocumentsHold = await AdminExecutiveModel.countDocuments({ ...query, mainCategoryStatus: "Hold" });
    const totalDocumentsApproved = await AdminExecutiveModel.countDocuments({ ...query, mainCategoryStatus: "Approved" });

    res.status(200).json({
      data: response,
      totalDocuments,
      totalDocumentsGeneral,
      totalDocumentsProcess,
      totalDocumentsDefaulter,
      totalDocumentsReadyToSubmit,
      totalDocumentsSubmitted,
      totalDocumentsHold,
      totalDocumentsApproved,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalDocuments / limit)
    });
  } catch (error) {
    console.log("Error fetching data", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get('/adminexecutivedata', async (req, res) => {
  try {
    const { search, page = 1, limit = 500, activeTab, companyNames, serviceNames } = req.query; // Extract companyNames and serviceNames

    // Build query object
    let query = {};

    if (search) {
      const regex = new RegExp(search, 'i'); // Case-insensitive search
      const numberSearch = parseFloat(search); // Attempt to parse the search term as a number

      query = {
        $or: [
          { "Company Name": regex }, // Match companyName field
          { serviceName: regex },
          { "Company Email": regex },
          { bdeName: regex },
          { bdmName: regex },
          // Only include the number fields if numberSearch is a valid number
          ...(isNaN(numberSearch) ? [] : [
            { "Company Number": numberSearch }, // Match companyNumber field
            { caNumber: numberSearch } // Match caNumber field
          ])
        ]
      };
    }

    // Add filtering based on companyNames and serviceNames if provided
    if (companyNames) {
      const companyNamesArray = companyNames.split(','); // Convert to array
      query["Company Name"] = { $in: companyNamesArray };
    }

    if (serviceNames) {
      const serviceNamesArray = serviceNames.split(','); // Convert to array
      query.serviceName = { $in: serviceNamesArray };
    }

    const skip = (page - 1) * limit; // Calculate how many documents to skip

    // Fetch data with pagination
    let response;
    if (activeTab === "General") {
      response = await AdminExecutiveModel.find({ ...query, mainCategoryStatus: activeTab })
        .sort({ addedOn: -1 })
        .skip(skip)
        .limit(parseInt(limit));
    } else {
      response = await AdminExecutiveModel.find({ ...query, mainCategoryStatus: activeTab })
        .sort({ dateOfChangingMainStatus: -1 })
        .skip(skip)
        .limit(parseInt(limit));
    }
    //console.log(activeTab)
    //console.log(response)

    await AdminExecutiveModel.updateMany(
      { subCategoryStatus: { $in: ["KYC Pending", "KYC Incomplete", "KYC Rejected"] } },
      {
        $set:
        {
          mainCategoryStatus: "Application Submitted",
          previousMainCategoryStatus: "Process",
          previousSubCategoryStatus: "Process"
        }
      }
    );

    const totalDocuments = await AdminExecutiveModel.countDocuments(query);
    const totalDocumentsGeneral = await AdminExecutiveModel.countDocuments({ ...query, mainCategoryStatus: "General" });
    const totalDocumentsProcess = await AdminExecutiveModel.countDocuments({ ...query, mainCategoryStatus: "Process" });
    const totalDocumentsApplicationSubmitted = await AdminExecutiveModel.countDocuments({ ...query, mainCategoryStatus: "Application Submitted" });
    const totalDocumentsDefaulter = await AdminExecutiveModel.countDocuments({ ...query, mainCategoryStatus: "Defaulter" });
    const totalDocumentsHold = await AdminExecutiveModel.countDocuments({ ...query, mainCategoryStatus: "Hold" });
    const totalDocumentsApproved = await AdminExecutiveModel.countDocuments({ ...query, mainCategoryStatus: "Approved" });

    res.status(200).json({
      data: response,
      totalDocuments,
      totalDocumentsGeneral,
      totalDocumentsProcess,
      totalDocumentsApplicationSubmitted,
      totalDocumentsDefaulter,
      totalDocumentsHold,
      totalDocumentsApproved,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalDocuments / limit)
    });
  } catch (error) {
    console.log("Error fetching data", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
router.delete(`/delete-rm-services`, async (req, res) => {
  const { companyName, serviceName } = req.body;
  try {
    const response = await RMCertificationModel.findOneAndDelete({
      "Company Name": companyName,
      serviceName: serviceName,
    });
    if (response) {
      res
        .status(200)
        .json({ message: "Record Deleted Succesfully", deletedData: response });
    } else {
      res.status(400).json({ message: "Record Not Found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Redeisgned api for testing pagination
router.get("/redesigned-final-leadData-test", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const allData = await RedesignedLeadformModel.aggregate([
      {
        $addFields: {
          lastActionDateAsDate: {
            $dateFromString: {
              dateString: "$lastActionDate",
              onError: {
                $ifNull: ["$bookingDate", new Date(0)], // Default to epoch if bookingDate is null
              },
              onNull: {
                $ifNull: ["$bookingDate", new Date(0)], // Default to epoch if bookingDate is null
              },
            },
          },
        },
      },
      // {
      //   $sort: {
      //     lastActionDateAsDate: -1
      //   }
      // },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);
    const totalCount = await RedesignedLeadformModel.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);
    res.status(200).json({
      data: allData,
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

//api to search data
function escapeRegex(string) {
  return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

router.get("/search-booking-data", async (req, res) => {
  const { searchText, currentPage, itemsPerPage } = req.query;
  //console.log(searchText, currentPage, itemsPerPage);
  const page = parseInt(currentPage) || 1; // Page number
  const limit = parseInt(itemsPerPage) || 500; // Items per page
  const skip = (page - 1) * limit; // Number of documents to skip

  try {
    const searchTerm = searchText.trim();
    let query = {};
    if (searchTerm !== "") {
      if (!isNaN(searchTerm)) {
        query = { "Company Number": searchTerm };
      } else {
        const escapedSearchTerm = escapeRegex(searchTerm);
        query = {
          $or: [
            { "Company Name": { $regex: new RegExp(escapedSearchTerm, "i") } },
            // Add other fields you want to search with the query here
            // For example: { anotherField: { $regex: new RegExp(escapedSearchTerm, 'i') } }
          ],
        };
      }
    }
    const data = await RedesignedLeadformModel.find(query)
      .skip(skip)
      .limit(limit);

    // console.log("data", data);
    res.status(200).json({
      data,
      totalCount: await RedesignedLeadformModel.countDocuments(query),
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/filter-rmofcertification-bookings", async (req, res) => {
  const {
    selectedServiceName,
    selectedBdeName,
    selectedBdmName,
    selectedYear,
    monthIndex,
    bookingDate,
    bookingPublishDate,
  } = req.query;
  const page = parseInt(req.query.page) || 1; // Page number
  const limit = parseInt(req.query.limit) || 10; // Items per page
  const skip = (page - 1) * limit; // Number of documents to skip
  try {
    let baseQuery = {};
    if (selectedBdeName) baseQuery.bdeName = selectedBdeName;
    if (selectedBdmName) baseQuery.bdmName = selectedBdmName;
    if (selectedYear) {
      if (monthIndex !== "0") {
        const year = parseInt(selectedYear);
        const month = parseInt(monthIndex) - 1; // JavaScript months are 0-indexed
        const monthStartDate = new Date(year, month, 1);
        const monthEndDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
        baseQuery.bookingDate = {
          $gte: monthStartDate.toISOString().split("T")[0],
          $lt: new Date(monthEndDate.getTime() + 1).toISOString().split("T")[0],
        };
      } else {
        const yearStartDate = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
        const yearEndDate = new Date(`${selectedYear}-12-31T23:59:59.999Z`);
        baseQuery.bookingDate = {
          $gte: yearStartDate.toISOString().split("T")[0],
          $lt: new Date(yearEndDate.getTime() + 1).toISOString().split("T")[0],
        };
      }
    }

    if (bookingDate) {
      baseQuery.bookingDate = {
        $gte: new Date(bookingDate).toISOString().split("T")[0],
        $lt: new Date(
          new Date(bookingDate).setDate(new Date(bookingDate).getDate() + 1)
        )
          .toISOString()
          .split("T")[0],
      };
    }

    const data = await RedesignedLeadformModel.find(baseQuery)
      .skip(skip)
      .limit(limit)
      .lean();
    const dataCount = await RedesignedLeadformModel.countDocuments(baseQuery);
    //console.log(baseQuery);
    //console.log("data", data.length, dataCount);
    res.status(200).json({
      data: data,
      currentPage: page,
      totalPages: Math.ceil(dataCount / limit),
    });
  } catch (error) {
    console.log("Internal Server Error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// router.post("/postrmselectedservicestobookings/:CompanyName", async (req, res) => {
//   try {
//     const companyName = req.params.CompanyName;
//     const { rmServicesMainBooking, rmServicesMoreBooking } = req.body;
//     const socketIO = req.io;
//     console.log("rmservicesmainbooking" , rmServicesMainBooking)
//     console.log("rmservicesmorebooking" , rmServicesMoreBooking)
//     // Fetch the document
//     const document = await RedesignedLeadformModel.findOne({ "Company Name": companyName });

//     if (!document) {
//       console.error("Document not found");
//       return res.status(404).json({ message: "Document not found" });
//     }

//     // Update the servicesTakenByRmOfCertification
//     document.servicesTakenByRmOfCertification = rmServicesMainBooking;
//     console.log("documentofrmservicesmainbooking", document.servicesTakenByRmOfCertification)
//     // Iterate through moreBookings and update only relevant objects
//     document.moreBookings.forEach((booking, index) => {
//       const relevantServices = booking.services.filter(service =>
//         rmServicesMoreBooking.includes(service.serviceName)
//       );
//       console.log("relevantservices", relevantServices)

//       if (relevantServices.length > 0) {
//         document.moreBookings[index].servicesTakenByRmOfCertification = relevantServices.map(service => service.serviceName);
//       }
//     });
//     //console.log("document", document)
//     // Save the updated document
//     const updatedDocument = await document.save();

//     if (!updatedDocument) {
//       console.error("Failed to save the updated document");
//       return res.status(500).json({ message: "Failed to save the updated document" });
//     }

//     // Emit socket event
//     res.status(200).json({ message: "Document updated successfully", data: updatedDocument });
//   } catch (error) {
//     console.error("Error updating document:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.post(`/update-substatus-rmofcertification-changegeneral/`, async (req, res) => {
  const { companyName,
    serviceName,
    subCategoryStatus,
    mainCategoryStatus,
    previousMainCategoryStatus,
    previousSubCategoryStatus,
    dateOfChangingMainStatus,
    movedFromMainCategoryStatus,
    movedToMainCategoryStatus } = req.body;
  const socketIO = req.io;

  //console.log("here" , movedFromMainCategoryStatus,movedToMainCategoryStatus)

  try {
    const updatedCompany = await RMCertificationModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName
      },
      {
        subCategoryStatus: subCategoryStatus,
        mainCategoryStatus: mainCategoryStatus,
        lastActionDate: new Date(),
        dateOfChangingMainStatus: dateOfChangingMainStatus, // Ensure this field is included
        previousMainCategoryStatus: previousMainCategoryStatus,
        previousSubCategoryStatus: previousSubCategoryStatus
      },
      { new: true }
    );

    // if (!updatedCompany) {
    //   console.error("Failed to save the updated document");
    //   return res.status(400).json({ message: "Failed to save the updated document" });
    // }

    // // Log the updated company document
    //console.log("Company after update:", updatedCompany);

    const creatingNewCompany = await RMCertificationHistoryModel.create({
      "Company Name": companyName,
      serviceName: serviceName,
      history: [{
        movedFromMainCategoryStatus: movedFromMainCategoryStatus,
        movedToMainCategoryStatus: movedToMainCategoryStatus,
        mainCategoryStatus: mainCategoryStatus,
        subCategoryStatus: subCategoryStatus,
        statusChangeDate: new Date()
      }]
    });

    //console.log("newhistoryschema" , creatingNewCompany)



    // Emit socket event if needed
    //socketIO.emit('update', { companyName, serviceName });
    socketIO.emit('rm-general-status-updated', { companyName: companyName });
    res.status(200).json({ message: "Document updated successfully", data: updatedCompany });

  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/postrmselectedservicestobookings/:CompanyName",
  async (req, res) => {
    try {
      const companyName = req.params.CompanyName;
      const { rmServicesMainBooking, rmServicesMoreBooking } = req.body;

      const socketIO = req.io;
      //console.log("rmservicesmainbooking", rmServicesMainBooking);
      //console.log("rmservicesmorebooking", rmServicesMoreBooking);
      // Fetch the document
      const document = await RedesignedLeadformModel.findOne({
        "Company Name": companyName,
      });


      if (!document) {
        console.error("Document not found");
        return res.status(404).json({ message: "Document not found" });
      }

      // Update the servicesTakenByRmOfCertification for main bookings
      const uniqueMainServices = Array.from(
        new Set([
          ...document.servicesTakenByRmOfCertification,
          ...rmServicesMainBooking,
        ])
      );

      document.servicesTakenByRmOfCertification = uniqueMainServices;

      // Iterate through moreBookings and update only relevant objects
      document.moreBookings.forEach((booking, index) => {
        const relevantServices = booking.services.filter((service) =>
          rmServicesMoreBooking.includes(service.serviceName)
        );
        //console.log("relevantservices", relevantServices);
        if (relevantServices.length > 0) {
          const currentServices =
            booking.servicesTakenByRmOfCertification || [];
          const uniqueMoreBookingServices = Array.from(
            new Set([
              ...currentServices,
              ...relevantServices.map((service) => service.serviceName),
            ])
          );
          document.moreBookings[index].servicesTakenByRmOfCertification =
            uniqueMoreBookingServices;
        }
      });


      // Save the updated document
      const updatedDocument = await document.save();


      // if (!updatedDocument) {
      //   console.error("Failed to save the updated document");
      //   return res
      //     .status(500)
      //     .json({ message: "Failed to save the updated document" });
      // }

      // Emit socket event
      res.status(200).json({
        message: "Document updated successfully",
        data: updatedDocument,
      });
    } catch (error) {
      console.error("Error updating document:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.post("/postsdminselectedservicestobooking/:CompanyName",
  async (req, res) => {
    try {
      const companyName = req.params.CompanyName;
      const { adminServicesMainBooking, adminServicesMoreBooking } = req.body;
      const socketIO = req.io;
      //console.log("rmservicesmainbooking", adminServicesMainBooking);
      //console.log("rmservicesmorebooking", adminServicesMoreBooking);
      // Fetch the document
      const document = await RedesignedLeadformModel.findOne({
        "Company Name": companyName,
      });

      if (!document) {
        console.error("Document not found");
        return res.status(404).json({ message: "Document not found" });
      }

      // Update the servicesTakenByRmOfCertification for main bookings
      const uniqueMainServices = Array.from(
        new Set([
          ...document.servicesTakenByAdminExecutive,
          ...adminServicesMainBooking,
        ])
      );
      document.servicesTakenByAdminExecutive = uniqueMainServices;

      // Iterate through moreBookings and update only relevant objects
      document.moreBookings.forEach((booking, index) => {
        const relevantServices = booking.services.filter((service) =>
          adminServicesMoreBooking.includes(service.serviceName)
        );
        //console.log("relevantservices", relevantServices);
        if (relevantServices.length > 0) {
          const currentServices = booking.servicesTakenByAdminExecutive || [];
          const uniqueMoreBookingServices = Array.from(
            new Set([
              ...currentServices,
              ...relevantServices.map((service) => service.serviceName),
            ])
          );
          document.moreBookings[index].servicesTakenByAdminExecutive =
            uniqueMoreBookingServices;
        }
      });

      // Save the updated document
      const updatedDocument = await document.save();

      if (!updatedDocument) {
        console.error("Failed to save the updated document");
        return res
          .status(500)
          .json({ message: "Failed to save the updated document" });
      }

      // Emit socket event
      res.status(200).json({
        message: "Document updated successfully",
        data: updatedDocument,
      });
    } catch (error) {
      console.error("Error updating document:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.post(`/update-substatus-rmofcertification/`, async (req, res) => {
  const {
    companyName,
    serviceName,
    subCategoryStatus,
    mainCategoryStatus,
    previousMainCategoryStatus,
    previousSubCategoryStatus,
    SecondTimeSubmitDate,
    ThirdTimeSubmitDate,
    movedFromMainCategoryStatus,
    movedToMainCategoryStatus,
    lastAttemptSubmitted,
    submittedOn,
  } = req.body;
  const socketIO = req.io;
  //console.log(req.body);

  try {
    // Step 1: Find the company document in RMCertificationModel
    const findCompanyAdmin = await AdminExecutiveModel.findOne({
      ["Company Name"]: companyName,
      serviceName: serviceName,
    });
    const company = await RMCertificationModel.findOne({
      ["Company Name"]: companyName,
      serviceName: serviceName,
    });

    if (!company) {
      console.error("Company not found");
      return res.status(400).json({ message: "Company not found" });
    }

    // Determine the submittedOn date
    // let submittedOn = company.submittedOn;
    let updateFields = {}; // Fields to be updated

    if (subCategoryStatus !== "Undo") {
      // Conditionally include dateOfChangingMainStatus
      if (
        [
          "Process",
          "Approved",
          "Submitted",
          "Hold",
          "Defaulter",
          "Ready To Submit",
        ].includes(subCategoryStatus)
      ) {
        updateFields.dateOfChangingMainStatus = new Date();
      }

      // Step 2: Update the RMCertificationModel document
      const updatedCompany = await RMCertificationModel.findOneAndUpdate(
        { ["Company Name"]: companyName, serviceName: serviceName },
        {
          subCategoryStatus: subCategoryStatus,
          mainCategoryStatus: mainCategoryStatus,
          lastActionDate: new Date(),
          submittedOn: submittedOn,
          ...updateFields,
          previousMainCategoryStatus: previousMainCategoryStatus,
          previousSubCategoryStatus: previousSubCategoryStatus,
          SecondTimeSubmitDate: SecondTimeSubmitDate
            ? SecondTimeSubmitDate
            : company.SecondTimeSubmitDate,
          ThirdTimeSubmitDate: ThirdTimeSubmitDate
            ? ThirdTimeSubmitDate
            : company.ThirdTimeSubmitDate,
          lastAttemptSubmitted: lastAttemptSubmitted,
          submittedOn: submittedOn ? submittedOn : new Date(),
          letterStatus: findCompanyAdmin
            ? findCompanyAdmin.letterStatus
            : "Not Started",
          dscStatus: findCompanyAdmin
            ? findCompanyAdmin.subCategoryStatus
            : "Not Started",
        },
        { new: true }
      );

      // if (subCategoryStatus === "Approved") {
      //   console.log("hello wworld");
      //   runTestScript(companyName);
      // }
      //console.log("updatedcompany", updatedCompany);
      //console.log("submittedOn", submittedOn);

      if (!updatedCompany) {
        console.error("Failed to save the updated document");
        return res
          .status(400)
          .json({ message: "Failed to save the updated document" });
      }

      // Step 3: Find or create the history entry in RMCertificationHistoryModel
      let historyEntry = await RMCertificationHistoryModel.findOne({
        ["Company Name"]: companyName,
        serviceName: serviceName,
      });

      if (historyEntry) {
        // Push a new history record into the existing document
        historyEntry.history.push({
          movedFromMainCategoryStatus: movedFromMainCategoryStatus,
          movedToMainCategoryStatus: movedToMainCategoryStatus,
          mainCategoryStatus: mainCategoryStatus,
          subCategoryStatus: subCategoryStatus,
          statusChangeDate: new Date(),
        });
        const createCompany = await historyEntry.save();
        //console.log("history" , createCompany)
      } else {
        // Create a new document if not found
        const createCompany = await RMCertificationHistoryModel.create({
          "Company Name": companyName,
          serviceName: serviceName,
          history: [
            {
              movedFromMainCategoryStatus: movedFromMainCategoryStatus,
              movedToMainCategoryStatus: movedToMainCategoryStatus,
              mainCategoryStatus: mainCategoryStatus,
              subCategoryStatus: subCategoryStatus,
              statusChangeDate: new Date(),
            },
          ],
        });

        //console.log("history" , createCompany)
      }

      // Emit socket event
      socketIO.emit("rm-general-status-updated", {
        name: updatedCompany.bdeName,
        companyName: companyName,
      });
      res.status(200).json({
        message: "Document updated successfully",
        data: updatedCompany,
      });
    } else {
      // If subCategoryStatus is "Undo", update with previous statuses and no new date
      const updatedCompany = await RMCertificationModel.findOneAndUpdate(
        { ["Company Name"]: companyName, serviceName: serviceName },
        {
          subCategoryStatus:
            company.previousMainCategoryStatus === "General"
              ? "Untouched"
              : company.previousSubCategoryStatus,
          mainCategoryStatus: company.previousMainCategoryStatus,
          previousMainCategoryStatus: company.mainCategoryStatus,
          previousSubCategoryStatus: company.subCategoryStatus,
          lastActionDate: new Date(),
          submittedOn: company.submittedOn,
          dateOfChangingMainStatus: company.dateOfChangingMainStatus,
          Remarks: [],
          letterStatus: findCompanyAdmin
            ? findCompanyAdmin.letterStatus
            : "Not Started",
          dscStatus: findCompanyAdmin
            ? findCompanyAdmin.subCategoryStatus
            : "Not Started",
          contentStatus: "Not Started",
          contentWriter: "Drashti Thakkar",
          brochureStatus: "Not Applicable",
          brochureDesigner: "",
          nswsMailId: "",
          nswsPaswsord: "",
          websiteLink: "",
          industry: "",
          sector: "",
          lastAttemptSubmitted: "",
        },
        { new: true }
      );

      if (!updatedCompany) {
        console.error("Failed to save the updated document");
        return res
          .status(400)
          .json({ message: "Failed to save the updated document" });
      }

      // Emit socket event
      socketIO.emit("rm-general-status-updated", {
        name: updatedCompany.bdeName,
        companyName: companyName,
      });
      res.status(200).json({
        message: "Document updated successfully",
        data: updatedCompany,
      });
    }
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/update-substatus-adminexecutive-changegeneral/`, async (req, res) => {
  const {
    companyName,
    serviceName,
    subCategoryStatus,
    mainCategoryStatus,
    previousMainCategoryStatus,
    previousSubCategoryStatus,
    dateOfChangingMainStatus,
    movedFromMainCategoryStatus,
    movedToMainCategoryStatus } = req.body;
  const socketIO = req.io;

  //console.log("here" , movedFromMainCategoryStatus,movedToMainCategoryStatus)

  try {
    const updatedCompany = await AdminExecutiveModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName
      },
      {
        subCategoryStatus: subCategoryStatus,
        mainCategoryStatus: mainCategoryStatus,
        lastActionDate: new Date(),
        dateOfChangingMainStatus: dateOfChangingMainStatus, // Ensure this field is included
        previousMainCategoryStatus: previousMainCategoryStatus,
        previousSubCategoryStatus: previousSubCategoryStatus
      },
      { new: true }
    );

    const updateCompanyRm = await RMCertificationModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName
      },
      {
        dscStatus: subCategoryStatus
      },
      { new: true }
    )

    const creatingNewCompany = await AdminExecutiveHistoryModel.create({
      "Company Name": companyName,
      serviceName: serviceName,
      history: [{
        movedFromMainCategoryStatus: movedFromMainCategoryStatus,
        movedToMainCategoryStatus: movedToMainCategoryStatus,
        mainCategoryStatus: mainCategoryStatus,
        subCategoryStatus: subCategoryStatus,
        statusChangeDate: new Date()
      }]
    });

    // if (!updatedCompany) {
    //   console.error("Failed to save the updated document");
    //   return res.status(400).json({ message: "Failed to save the updated document" });
    // }

    // Emit socket event if needed
    //socketIO.emit('update', { companyName, serviceName });
    socketIO.emit('adminexecutive-general-status-updated', { updatedDocument: updateCompanyRm });
    res.status(200).json({ message: "Document updated successfully", data: updatedCompany });

  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/update-substatus-adminexecutive/`, async (req, res) => {
  const {
    companyName,
    serviceName,
    subCategoryStatus,
    letterStatus,
    dscPortal,
    dscType,
    dscValidity,
    mainCategoryStatus,
    previousMainCategoryStatus,
    previousSubCategoryStatus,
    movedFromMainCategoryStatus,
    movedToMainCategoryStatus,
    approvalTime,
  } = req.body;
  const socketIO = req.io;
  //console.log(req.body);

  try {
    // Step 1: Find the company document in RMCertificationModel
    const company = await AdminExecutiveModel.findOne({
      ["Company Name"]: companyName,
      serviceName: serviceName,
    });

    if (!company) {
      console.error("Company not found");
      return res.status(400).json({ message: "Company not found" });
    }

    // Determine the submittedOn date
    // let submittedOn = company.submittedOn;
    let updateFields = {}; // Fields to be updated

    if (subCategoryStatus !== "Undo") {
      // Conditionally include dateOfChangingMainStatus
      if (
        ["Process", "Approved", "Hold", "Defaulter", "Application Submitted"].includes(subCategoryStatus)
      ) {
        updateFields.dateOfChangingMainStatus = new Date();
      }

      // Step 2: Update the RMCertificationModel document
      const updatedCompany = await AdminExecutiveModel.findOneAndUpdate(
        { ["Company Name"]: companyName, serviceName: serviceName },
        {
          subCategoryStatus: subCategoryStatus,
          mainCategoryStatus: mainCategoryStatus,
          lastActionDate: new Date(),
          approvalTime: approvalTime,
          ...updateFields,
          previousMainCategoryStatus: previousMainCategoryStatus,
          previousSubCategoryStatus: previousSubCategoryStatus,
          approvalTime: approvalTime ? approvalTime : new Date(),
        },
        { new: true }
      );

      const updateCompanyRm = await RMCertificationModel.findOneAndUpdate(
        {
          ["Company Name"]: companyName,
          serviceName: serviceName,
        },
        {
          dscStatus: subCategoryStatus,
        },
        { new: true }
      );

      if(subCategoryStatus === "Approved"){
        console.log("hello world")
        runTestScript(companyName);
      }
    

      if (!updatedCompany) {
        console.error("Failed to save the updated document");
        return res.status(400).json({ message: "Failed to save the updated document" });
      }

      // // Step 3: Find or create the history entry in RMCertificationHistoryModel
      let historyEntry = await AdminExecutiveHistoryModel.findOne({ ["Company Name"]: companyName, serviceName: serviceName });

      if (historyEntry) {
        // Push a new history record into the existing document
        historyEntry.history.push({
          movedFromMainCategoryStatus: movedFromMainCategoryStatus,
          movedToMainCategoryStatus: movedToMainCategoryStatus,
          mainCategoryStatus: mainCategoryStatus,
          subCategoryStatus: subCategoryStatus,
          statusChangeDate: new Date()
        });
        const createCompany = await historyEntry.save();
        //console.log("history" , createCompany)
      } else {
        // Create a new document if not found
        const createCompany = await AdminExecutiveHistoryModel.create({
          "Company Name": companyName,
          serviceName: serviceName,
          history: [{
            movedFromMainCategoryStatus: movedFromMainCategoryStatus,
            movedToMainCategoryStatus: movedToMainCategoryStatus,
            mainCategoryStatus: mainCategoryStatus,
            subCategoryStatus: subCategoryStatus,
            statusChangeDate: new Date()
          }]
        });

        //console.log("history" , createCompany)
      }
      // Emit socket event
      socketIO.emit("adminexecutive-general-status-updated", {
        updatedDocument: updateCompanyRm
      });
      res.status(200).json({
        message: "Document updated successfully",
        data: updatedCompany,
      });
    } else {
      // If subCategoryStatus is "Undo", update with previous statuses and no new date
      const updatedCompany = await AdminExecutiveModel.findOneAndUpdate(
        { ["Company Name"]: companyName, serviceName: serviceName },
        {
          subCategoryStatus:
            company.previousMainCategoryStatus === "General"
              ? "Untouched"
              : company.previousSubCategoryStatus,
          mainCategoryStatus: company.previousMainCategoryStatus,
          // previousMainCategoryStatus: company.mainCategoryStatus,
          // previousSubCategoryStatus: company.subCategoryStatus,
          previousMainCategoryStatus: previousMainCategoryStatus,
          previousSubCategoryStatus: previousSubCategoryStatus,
          lastActionDate: new Date(),
          approvalTime: company.approvalTime,
          dateOfChangingMainStatus: company.dateOfChangingMainStatus,
          Remarks: [],
          dscStatus: "Not Started",
          // letterStatus: "Not Started",
          letterStatus: letterStatus,
          // dscPortal: "Drashti Thakkar",
          dscPortal: dscPortal,
          // dscType: "Not Applicable",
          dscType: dscType,
          // dscValidity: "",
          dscValidity: dscValidity,
          portalCharges: "",
          chargesPaidVia: "",
          expenseReimbursementStatus: "",
          tokenStoredInBox: "",
          courierStatus: "",
        },
        { new: true }
      );
      const updateCompanyRm = await RMCertificationModel.findOneAndUpdate(
        {
          ["Company Name"]: companyName,
          serviceName: serviceName,
        },
        {
          dscStatus: company.previousMainCategoryStatus,
        },
        { new: true }
      );

      if (!updatedCompany) {
        console.error("Failed to save the updated document");
        return res
          .status(400)
          .json({ message: "Failed to save the updated document" });
      }

      // Emit socket event
      socketIO.emit("adminexecutive-general-status-updated", {
        updatedDocument: updateCompanyRm
      });
      res.status(200).json({
        message: "Document updated successfully",
        data: updatedCompany,
      });
    }
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/update-dsc-rmofcertification/`, async (req, res) => {
  const { companyName, serviceName, dscStatus } = req.body;
  //console.log("dscStatus" , dscStatus)
  const socketIO = req.io;
  try {
    const company = await RMCertificationModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName,
      },
      {
        dscStatus: dscStatus,
      },
      { new: true }
    );
    if (!company) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    // Emit socket event
    //console.log("Emitting event: rm-general-status-updated", { name: company.bdeName, companyName: companyName });
    //socketIO.emit('rm-general-status-updated', { name: company.bdeName, companyName: companyName })
    res
      .status(200)
      .json({ message: "Document updated successfully", data: company });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/update-content-rmofcertification/`, async (req, res) => {
  const { companyName, serviceName, contentStatus } = req.body;
  //console.log("contentStatus", contentStatus, companyName, serviceName)
  const socketIO = req.io;

  try {
    // Find the company document
    const company = await RMCertificationModel.findOne({
      ["Company Name"]: companyName,
      serviceName: serviceName,
    });

    // Check if the company exists
    if (!company) {
      console.error("Company not found");
      return res.status(404).json({ message: "Company not found" });
    }

    // Determine the update values based on the contentStatus and brochureStatus
    let updateFields = { contentStatus: contentStatus };

    // if (contentStatus === "Approved") {
    //   if (company.brochureStatus === "Approved") {
    //     updateFields = {
    //       ...updateFields,
    //       mainCategoryStatus: "Ready To Submit",
    //       subCategoryStatus: "Ready To Submit"
    //     };
    //   }

    // }

    //console.log("updateFields", updateFields);

    // Perform the update
    const updatedCompany = await RMCertificationModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName,
      },
      updateFields,
      { new: true }
    );

    // Check if the update was successful
    if (!updatedCompany) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    // Send the response
    res
      .status(200)
      .json({ message: "Document updated successfully", data: updatedCompany });
  } catch (error) {
    console.error("Error updating document:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// router.post(`/update-letter-adminexecutive/`, async (req, res) => {
//   const { companyName, serviceName, letterStatus } = req.body;
//   //console.log("contentStatus", contentStatus, companyName, serviceName)
//   const socketIO = req.io;

//   try {
//     // Find the company document
//     const company = await AdminExecutiveModel.findOne({
//       ["Company Name"]: companyName,
//       serviceName: serviceName,
//     });

//     // Check if the company exists
//     if (!company) {
//       console.error("Company not found");
//       return res.status(404).json({ message: "Company not found" });
//     }

//     // Determine the update values based on the contentStatus and brochureStatus
//     let updateFields = { letterStatus: letterStatus };

//     // Perform the update
//     const updatedCompany = await AdminExecutiveModel.findOneAndUpdate(
//       {
//         ["Company Name"]: companyName,
//         serviceName: serviceName,
//       },
//       updateFields,
//       { new: true }
//     );

//     const updatedCompanyRm = await RMCertificationModel.findOneAndUpdate(
//       {
//         ["Company Name"]: companyName,
//         serviceName: serviceName,
//       },
//       updateFields,
//       { new: true }
//     );

//     // Check if the update was successful
//     if (!updatedCompany) {
//       console.error("Failed to save the updated document");
//       return res
//         .status(400)
//         .json({ message: "Failed to save the updated document" });
//     }

//     // Send the response
//     socketIO.emit("adminexecutive-letter-updated", {
//       updatedDocument: updatedCompanyRm, // send the updated document
//     });
//     res
//       .status(200)
//       .json({ message: "Document updated successfully", data: updatedCompany });
//   } catch (error) {
//     console.error("Error updating document:", error.message);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

router.post(`/update-letter-adminexecutive/`, async (req, res) => {
  const { companyName, serviceName, letterStatus } = req.body;
  const socketIO = req.io;

  try {
    // Find the company document in AdminExecutiveModel
    const company = await AdminExecutiveModel.findOne({
      ["Company Name"]: companyName,
      serviceName: serviceName,
    });

    // Check if the company exists
    if (!company) {
      console.error("Company not found");
      return res.status(404).json({ message: "Company not found" });
    }

    // Determine the update values based on letterStatus
    let updateFields = { letterStatus: letterStatus };

    if (letterStatus === "Letter Received") {
      // Update additional fields if letterStatus is "Letter Received"
      updateFields.subCategoryStatus = "Application Pending";
    }

    // Perform the update in AdminExecutiveModel
    const updatedCompany = await AdminExecutiveModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName,
      },
      updateFields,
      { new: true }
    );

    // Prepare update for RMCertificationModel
    let updateFieldsRm = { letterStatus: letterStatus };

    if (letterStatus === "Letter Received") {
      // Update dscStatus field if letterStatus is "Letter Received"
      updateFieldsRm.dscStatus = "Application Pending";
    }

    // Perform the update in RMCertificationModel
    const updatedCompanyRm = await RMCertificationModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName,
      },
      updateFieldsRm,
      { new: true }
    );

    // Check if the update was successful
    if (!updatedCompany) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    // Send the response and emit the update event
    socketIO.emit("adminexecutive-letter-updated", {
      updatedDocument: updatedCompanyRm,
      updatedDocumentAdmin: updatedCompany // send the updated document from RMCertificationModel
    });
    res
      .status(200)
      .json({ message: "Document updated successfully", data: updatedCompany });
  } catch (error) {
    console.error("Error updating document:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post(`/update-letter-rmcert/`, async (req, res) => {
  const { companyName, serviceName, letterStatus } = req.body;
  const socketIO = req.io;

  try {
    // Find the company document in AdminExecutiveModel
    const company = await RMCertificationModel.findOne({
      ["Company Name"]: companyName,
      serviceName: serviceName,
    });

    // Check if the company exists
    if (!company) {
      console.error("Company not found");
      return res.status(404).json({ message: "Company not found" });
    }

    // Determine the update values based on letterStatus
    let updateFields = { letterStatus: letterStatus };

    if (letterStatus === "Letter Received") {
      // Update additional fields if letterStatus is "Letter Received"
      updateFields.dscStatus = "Application Pending";
    }

    // Perform the update in AdminExecutiveModel
    const updatedCompanyRm = await RMCertificationModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName,
      },
      updateFields,
      { new: true }
    );

    // Prepare update for RMCertificationModel
    let updateFieldsAdmin = { letterStatus: letterStatus };

    if (letterStatus === "Letter Received") {
      // Update dscStatus field if letterStatus is "Letter Received"
      updateFieldsAdmin.subCategoryStatus = "Application Pending";
    }

    // Perform the update in RMCertificationModel
    const updatedCompanyAdmin = await AdminExecutiveModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName,
      },
      updateFieldsAdmin,
      { new: true }
    );

    // Check if the update was successful
    if (!updatedCompanyRm) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    // Send the response and emit the update event
    socketIO.emit("rmcert-letter-updated", {
      updatedDocument: updatedCompanyRm,
      updatedDocumentAdmin: updatedCompanyAdmin // send the updated document from RMCertificationModel
    });
    res
      .status(200)
      .json({ message: "Document updated successfully", data: updatedCompanyRm });
  } catch (error) {
    console.error("Error updating document:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.post(`/update-dscportal-adminexecutive/`, async (req, res) => {
  const { companyName, serviceName, dscPortal } = req.body;
  //console.log("contentStatus", contentStatus, companyName, serviceName)
  const socketIO = req.io;

  try {
    // Find the company document
    const company = await AdminExecutiveModel.findOne({
      ["Company Name"]: companyName,
      serviceName: serviceName,
    });

    // Check if the company exists
    if (!company) {
      console.error("Company not found");
      return res.status(404).json({ message: "Company not found" });
    }

    // Determine the update values based on the contentStatus and brochureStatus
    let updateFields = { dscPortal: dscPortal };

    // Perform the update
    const updatedCompany = await AdminExecutiveModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName,
      },
      updateFields,
      { new: true }
    );

    // Check if the update was successful
    if (!updatedCompany) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    // Send the response
    res
      .status(200)
      .json({ message: "Document updated successfully", data: updatedCompany });
  } catch (error) {
    console.error("Error updating document:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post(`/update-otpstatus-rmcert/`, async (req, res) => {
  const { companyName, serviceName, otpVerificationStatus } = req.body;
  //console.log("contentStatus", contentStatus, companyName, serviceName)
  const socketIO = req.io;


  try {
    // Find the company document
    const company = await RMCertificationModel.findOne({
      ["Company Name"]: companyName,
      serviceName: serviceName,
    });

    // Check if the company exists
    if (!company) {
      console.error("Company not found");
      return res.status(404).json({ message: "Company not found" });
    }

    // Determine the update values based on the contentStatus and brochureStatus
    let updateFields = { otpVerificationStatus: otpVerificationStatus };

    // Perform the update
    const updatedCompany = await RMCertificationModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName,
      },
      updateFields,
      { new: true }
    );

    // Check if the update was successful
    if (!updatedCompany) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    // Send the response
    res
      .status(200)
      .json({ message: "Document updated successfully", data: updatedCompany });
  } catch (error) {
    console.error("Error updating document:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post(`/post-save-phoneno-adminexecutive/`, async (req, res) => {
  const { companyName, serviceName, charges } = req.body;
  //console.log("contentStatus", contentStatus, companyName, serviceName)
  const socketIO = req.io;

  try {
    // Find the company document
    const company = await AdminExecutiveModel.findOne({
      ["Company Name"]: companyName,
      serviceName: serviceName,
    });

    // Check if the company exists
    if (!company) {
      console.error("Company not found");
      return res.status(404).json({ message: "Company not found" });
    }

    // Determine the update values based on the contentStatus and brochureStatus
    let updateFields = { dscPhoneNo: charges };

    // if (contentStatus === "Approved") {
    //   if (company.brochureStatus === "Approved") {
    //     updateFields = {
    //       ...updateFields,
    //       mainCategoryStatus: "Ready To Submit",
    //       subCategoryStatus: "Ready To Submit"
    //     };
    //   }

    // }

    //("updateFields", updateFields);

    // Perform the update
    const updatedCompany = await AdminExecutiveModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName,
      },
      updateFields,
      { new: true }
    );

    // Check if the update was successful
    if (!updatedCompany) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    // Send the response
    res
      .status(200)
      .json({ message: "Document updated successfully", data: updatedCompany });
  } catch (error) {
    console.error("Error updating document:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post(`/post-save-dscemailid-adminexecutive/`, async (req, res) => {
  const { companyName, serviceName, charges } = req.body;
  //console.log("contentStatus", contentStatus, companyName, serviceName)
  const socketIO = req.io;

  try {
    // Find the company document
    const company = await AdminExecutiveModel.findOne({
      ["Company Name"]: companyName,
      serviceName: serviceName,
    });

    // Check if the company exists
    if (!company) {
      console.error("Company not found");
      return res.status(404).json({ message: "Company not found" });
    }

    // Determine the update values based on the contentStatus and brochureStatus
    let updateFields = { dscEmailId: charges };

    //console.log("updateFields", updateFields);

    // Perform the update
    const updatedCompany = await AdminExecutiveModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName,
      },
      updateFields,
      { new: true }
    );

    // Check if the update was successful
    if (!updatedCompany) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    // Send the response
    res
      .status(200)
      .json({ message: "Document updated successfully", data: updatedCompany });
  } catch (error) {
    console.error("Error updating document:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post(`/post-save-otpinboxno-adminexecutive/`, async (req, res) => {
  const { companyName, serviceName, charges } = req.body;
  //console.log("contentStatus", contentStatus, companyName, serviceName)
  const socketIO = req.io;

  try {
    // Find the company document
    const company = await AdminExecutiveModel.findOne({
      ["Company Name"]: companyName,
      serviceName: serviceName,
    });

    //console.log("company", company)

    // Check if the company exists
    if (!company) {
      console.error("Company not found");
      return res.status(404).json({ message: "Company not found" });
    }

    // Determine the update values based on the contentStatus and brochureStatus
    let updateFields = { otpInboxNo: charges };

    //("updateFields", updateFields);

    // Perform the update
    const updatedCompany = await AdminExecutiveModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName,
      },
      updateFields,
      { new: true }
    );

    // Check if the update was successful
    if (!updatedCompany) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    // Send the response
    res
      .status(200)
      .json({ message: "Document updated successfully", data: updatedCompany });
  } catch (error) {
    console.error("Error updating document:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post(`/update-dscType-adminexecutive/`, async (req, res) => {
  const { companyName, serviceName, dscType } = req.body;
  //console.log("contentStatus", contentStatus, companyName, serviceName)
  const socketIO = req.io;

  try {
    // Find the company document
    const company = await AdminExecutiveModel.findOne({
      ["Company Name"]: companyName,
      serviceName: serviceName,
    });

    // Check if the company exists
    if (!company) {
      console.error("Company not found");
      return res.status(404).json({ message: "Company not found" });
    }

    // Determine the update values based on the contentStatus and brochureStatus
    let updateFields = { dscType: dscType };

    // if (contentStatus === "Approved") {
    //   if (company.brochureStatus === "Approved") {
    //     updateFields = {
    //       ...updateFields,
    //       mainCategoryStatus: "Ready To Submit",
    //       subCategoryStatus: "Ready To Submit"
    //     };
    //   }

    // }

    //console.log("updateFields", updateFields);

    // Perform the update
    const updatedCompany = await AdminExecutiveModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName,
      },
      updateFields,
      { new: true }
    );

    // Check if the update was successful
    if (!updatedCompany) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    // Send the response
    res
      .status(200)
      .json({ message: "Document updated successfully", data: updatedCompany });
  } catch (error) {
    console.error("Error updating document:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post(`/update-dscValidity-adminexecutive/`, async (req, res) => {
  const { companyName, serviceName, dscValidity } = req.body;
  //console.log("contentStatus", contentStatus, companyName, serviceName)
  const socketIO = req.io;

  try {
    // Find the company document
    const company = await AdminExecutiveModel.findOne({
      ["Company Name"]: companyName,
      serviceName: serviceName,
    });

    // Check if the company exists
    if (!company) {
      console.error("Company not found");
      return res.status(404).json({ message: "Company not found" });
    }

    // Determine the update values based on the contentStatus and brochureStatus
    let updateFields = { dscValidity: dscValidity };

    // if (contentStatus === "Approved") {
    //   if (company.brochureStatus === "Approved") {
    //     updateFields = {
    //       ...updateFields,
    //       mainCategoryStatus: "Ready To Submit",
    //       subCategoryStatus: "Ready To Submit"
    //     };
    //   }

    // }

    //console.log("updateFields", updateFields);

    // Perform the update
    const updatedCompany = await AdminExecutiveModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName,
      },
      updateFields,
      { new: true }
    );

    // Check if the update was successful
    if (!updatedCompany) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    // Send the response
    res
      .status(200)
      .json({ message: "Document updated successfully", data: updatedCompany });
  } catch (error) {
    console.error("Error updating document:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post(`/update-contentwriter-rmofcertification/`, async (req, res) => {
  const { companyName, serviceName, contentWriter } = req.body;
  //console.log("here", companyName, serviceName, contentWriter)
  //console.log("dscStatus" , contentStatus)
  const socketIO = req.io;
  try {
    const company = await RMCertificationModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName,
      },
      {
        contentWriter: contentWriter,
      },
      { new: true }
    );
    if (!company) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    // Emit socket event
    //console.log("Emitting event: rm-general-status-updated", { name: company.bdeName, companyName: companyName });
    //socketIO.emit('rm-general-status-updated', { name: company.bdeName, companyName: companyName })
    res
      .status(200)
      .json({ message: "Document updated successfully", data: company });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/update-brochuredesigner-rmofcertification/`, async (req, res) => {
  const { companyName, serviceName, brochureDesigner } = req.body;
  //console.log("here", companyName, serviceName, brochureDesigner)
  //console.log("dscStatus" , contentStatus)
  const socketIO = req.io;
  try {
    const company = await RMCertificationModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName,
      },
      {
        brochureDesigner: brochureDesigner,
      },
      { new: true }
    );
    if (!company) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    // Emit socket event
    //console.log("Emitting event: rm-general-status-updated", { name: company.bdeName, companyName: companyName });
    //socketIO.emit('rm-general-status-updated', { name: company.bdeName, companyName: companyName })
    res
      .status(200)
      .json({ message: "Document updated successfully", data: company });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/update-brochure-rmofcertification/`, async (req, res) => {
  const { companyName, serviceName, brochureStatus } = req.body;
  //console.log("brochureStatus", brochureStatus);
  const socketIO = req.io;

  try {
    // Find the company document
    const company = await RMCertificationModel.findOne({
      ["Company Name"]: companyName,
      serviceName: serviceName,
    });

    // Check if the company exists
    if (!company) {
      console.error("Company not found");
      return res.status(404).json({ message: "Company not found" });
    }

    // Determine the update values based on brochureStatus
    let updateFields = { brochureStatus: brochureStatus };

    // if (brochureStatus === "Approved") {
    //   if (company.contentStatus === "Approved") {
    //     updateFields = {
    //       ...updateFields,
    //       mainCategoryStatus: "Ready To Submit",
    //       subCategoryStatus: "Ready To Submit"
    //     };
    //   }

    // }
    //console.log("updateFields", updateFields);
    // Perform the update
    const updatedCompany = await RMCertificationModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName,
      },
      updateFields,
      { new: true }
    );

    // Check if the update was successful
    if (!updatedCompany) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    // Emit socket event
    //console.log("Emitting event: rm-general-status-updated", { name: updatedCompany.bdeName, companyName: companyName });
    //socketIO.emit('rm-general-status-updated', { name: updatedCompany.bdeName, companyName: companyName });

    res
      .status(200)
      .json({ message: "Document updated successfully", data: updatedCompany });
  } catch (error) {
    console.error("Error updating document:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/post-save-nswsemail/`, async (req, res) => {
  const { companyName, serviceName, email } = req.body;
  //console.log("dscStatus" ,email ,  currentCompanyName , currentServiceName)
  const socketIO = req.io;
  try {
    const company = await RMCertificationModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName,
      },
      {
        nswsMailId: email,
      },
      { new: true }
    );
    if (!company) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    // Emit socket event
    //console.log("Emitting event: rm-general-status-updated", { name: company.bdeName, companyName: companyName });
    //socketIO.emit('rm-general-status-updated', { name: company.bdeName, companyName: companyName })
    res
      .status(200)
      .json({ message: "Document updated successfully", data: company });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/post-save-nswsphoneno/`, async (req, res) => {
  const { companyName, serviceName, email } = req.body;
  //console.log("dscStatus" ,email ,  currentCompanyName , currentServiceName)
  const socketIO = req.io;
  try {
    const company = await RMCertificationModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName,
      },
      {
        nswsMobileNo: email,
      },
      { new: true }
    );
    if (!company) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    // Emit socket event
    //console.log("Emitting event: rm-general-status-updated", { name: company.bdeName, companyName: companyName });
    //socketIO.emit('rm-general-status-updated', { name: company.bdeName, companyName: companyName })
    res
      .status(200)
      .json({ message: "Document updated successfully", data: company });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/post-save-portalcharges-adminexecutive/`, async (req, res) => {
  const { companyName, serviceName, charges } = req.body;
  //console.log("dscStatus" ,email ,  currentCompanyName , currentServiceName)
  const socketIO = req.io;
  try {
    const company = await AdminExecutiveModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName,
      },
      {
        portalCharges: charges,
      },
      { new: true }
    );
    if (!company) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    // Emit socket event
    //console.log("Emitting event: rm-general-status-updated", { name: company.bdeName, companyName: companyName });
    //socketIO.emit('rm-general-status-updated', { name: company.bdeName, companyName: companyName })
    res
      .status(200)
      .json({ message: "Document updated successfully", data: company });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/post-save-portalchargespaidvia-adminexecutive/`,
  async (req, res) => {
    const { companyName, serviceName, chargesPaidV } = req.body;
    //console.log("dscStatus" ,email ,  currentCompanyName , currentServiceName)
    const socketIO = req.io;
    try {
      const company = await AdminExecutiveModel.findOneAndUpdate(
        {
          ["Company Name"]: companyName,
          serviceName: serviceName,
        },
        {
          chargesPaidVia: chargesPaidV,
        },
        { new: true }
      );
      if (!company) {
        console.error("Failed to save the updated document");
        return res
          .status(400)
          .json({ message: "Failed to save the updated document" });
      }

      // Emit socket event
      //console.log("Emitting event: rm-general-status-updated", { name: company.bdeName, companyName: companyName });
      //socketIO.emit('rm-general-status-updated', { name: company.bdeName, companyName: companyName })
      res
        .status(200)
        .json({ message: "Document updated successfully", data: company });
    } catch (error) {
      console.error("Error updating document:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.post(`/post-save-reimbursemnt-adminexecutive/`, async (req, res) => {
  const { companyName, serviceName, expenseReimbursementStatus } = req.body;
  //console.log("dscStatus" ,email ,  currentCompanyName , currentServiceName)
  const socketIO = req.io;
  try {
    const company = await AdminExecutiveModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName,
      },
      {
        expenseReimbursementStatus: expenseReimbursementStatus,
      },
      { new: true }
    );
    if (!company) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    // Emit socket event
    //console.log("Emitting event: rm-general-status-updated", { name: company.bdeName, companyName: companyName });
    //socketIO.emit('rm-general-status-updated', { name: company.bdeName, companyName: companyName })
    res
      .status(200)
      .json({ message: "Document updated successfully", data: company });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/post-save-reimbursemntdate-adminexecutive/`, async (req, res) => {
  const { cname, sname, value } = req.body;
  //console.log("date", value);
  //console.log("dscStatus" ,email ,  currentCompanyName , currentServiceName)
  const socketIO = req.io;
  try {
    const company = await AdminExecutiveModel.findOneAndUpdate(
      {
        ["Company Name"]: cname,
        serviceName: sname,
      },
      {
        expenseReimbursementDate: new Date(value),
      },
      { new: true }
    );
    if (!company) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    res
      .status(200)
      .json({ message: "Document updated successfully", data: company });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/post-save-nswsemail/`, async (req, res) => {
  const { currentCompanyName, currentServiceName, password } = req.body;
  //console.log("dscStatus" ,password ,  currentCompanyName , currentServiceName)
  const socketIO = req.io;
  try {
    const company = await RMCertificationModel.findOneAndUpdate(
      {
        ["Company Name"]: currentCompanyName,
        serviceName: currentServiceName,
      },
      {
        nswsPaswsord: password,
      },
      { new: true }
    );
    if (!company) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    // Emit socket event
    //console.log("Emitting event: rm-general-status-updated", { name: company.bdeName, companyName: companyName });
    //socketIO.emit('rm-general-status-updated', { name: company.bdeName, companyName: companyName })
    res
      .status(200)
      .json({ message: "Document updated successfully", data: company });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/post-save-nswspassword/`, async (req, res) => {
  const { companyName, serviceName, password } = req.body;

  const socketIO = req.io;
  try {
    const company = await RMCertificationModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName,
      },
      {
        nswsPaswsord: password,
      },
      { new: true }
    );
    if (!company) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }
    // Emit socket event
    //console.log("Emitting event: rm-general-status-updated", { name: company.bdeName, companyName: companyName });
    //socketIO.emit('rm-general-status-updated', { name: company.bdeName, companyName: companyName })
    res
      .status(200)
      .json({ message: "Document updated successfully", data: company });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/post-save-websitelink/`, async (req, res) => {
  const { companyName, serviceName, link, briefing } = req.body;

  const socketIO = req.io;
  try {
    const company = await RMCertificationModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName,
      },
      {
        websiteLink: link,
        companyBriefing: briefing,
      },
      { new: true }
    );
    if (!company) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }
    // Emit socket event
    //console.log("Emitting event: rm-general-status-updated", { name: company.bdeName, companyName: companyName });
    //socketIO.emit('rm-general-status-updated', { name: company.bdeName, companyName: companyName })
    res
      .status(200)
      .json({ message: "Document updated successfully", data: company });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/post-save-industry/`, async (req, res) => {
  const {
    companyName,
    serviceName,
    industryOption,
    isIndustryEnabled,
    sector,
  } = req.body;

  const socketIO = req.io;
  try {
    const company = await RMCertificationModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName,
      },
      {
        industry: industryOption,
        //isIndustryEnabled:isIndustryEnabled,
        sector: sector,
      },
      { new: true }
    );
    if (!company) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }
    // Emit socket event
    //console.log("Emitting event: rm-general-status-updated", { name: company.bdeName, companyName: companyName });
    socketIO.emit("rm-general-status-updated");
    res
      .status(200)
      .json({ message: "Document updated successfully", data: company });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/post-enable-industry/`, async (req, res) => {
  const { companyName, serviceName, isIndustryEnabled } = req.body;
  //console.log("dscStatus", serviceName, companyName, industryOption)
  const socketIO = req.io;
  try {
    const company = await RMCertificationModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName,
      },
      {
        isIndustryEnabled: isIndustryEnabled,
      },
      { new: true }
    );
    if (!company) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }
    // Emit socket event
    //console.log("Emitting event: rm-general-status-updated", { name: company.bdeName, companyName: companyName });
    //socketIO.emit('rm-industry-enabled')
    res.status(200).json({ message: "Document updated successfully", data: company });

  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/post-disasble-industry/`, async (req, res) => {
  const { companyName, serviceName, isIndustryEnabled } = req.body;

  const socketIO = req.io;
  try {
    const company = await RMCertificationModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName,
      },
      {
        isIndustryEnabled: isIndustryEnabled,
      },
      { new: true }
    );
    if (!company) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }
    // Emit socket event
    //console.log("Emitting event: rm-general-status-updated", { name: company.bdeName, companyName: companyName });
    //socketIO.emit('rm-industry-enabled')
    res.status(200).json({ message: "Document updated successfully", data: company });

  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/post-save-sector/`, async (req, res) => {
  const { companyName, serviceName, sectorOption, isIndustryEnabled } =
    req.body;


  const socketIO = req.io;
  try {
    const company = await RMCertificationModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName,
      },
      {
        sector: sectorOption,
        isIndustryEnabled: isIndustryEnabled,
      },
      { new: true }
    );
    if (!company) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }
    // Emit socket event
    //console.log("Emitting event: rm-general-status-updated", { name: company.bdeName, companyName: companyName });
    //socketIO.emit('rm-general-status-updated', { name: company.bdeName, companyName: companyName })
    res
      .status(200)
      .json({ message: "Document updated successfully", data: company });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/delete-remark-rmcert", async (req, res) => {
  const { remarks_id, companyName, serviceName } = req.body;

  try {
    const company = await RMCertificationModel.findOne({
      ["Company Name"]: companyName,
      serviceName: serviceName,
    });

    if (!company) {
      return res.status(404).json({ message: "Company or service not found" });
    }

    // Remove the specific remark from the array
    const updatedRemarks = company.Remarks.filter(
      (remark) => remark._id.toString() !== remarks_id
    );

    // Update the company document
    await RMCertificationModel.updateOne(
      { ["Company Name"]: companyName, serviceName: serviceName },
      { $set: { Remarks: updatedRemarks } }
    );

    res.status(200).json({ message: "Remark deleted successfully" });
  } catch (error) {
    console.error("Error deleting remark:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/delete-remark-adminexecutive", async (req, res) => {
  const { remarks_id, companyName, serviceName } = req.body;

  try {
    const company = await AdminExecutiveModel.findOne({
      ["Company Name"]: companyName,
      serviceName: serviceName,
    });

    if (!company) {
      return res.status(404).json({ message: "Company or service not found" });
    }

    // Remove the specific remark from the array
    const updatedRemarks = company.Remarks.filter(
      (remark) => remark._id.toString() !== remarks_id
    );

    // Update the company document
    await AdminExecutiveModel.updateOne(
      { ["Company Name"]: companyName, serviceName: serviceName },
      { $set: { Remarks: updatedRemarks } }
    );

    res.status(200).json({ message: "Remark deleted successfully" });
  } catch (error) {
    console.error("Error deleting remark:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/delete-remark-rmcert", async (req, res) => {
  const { remarks_id, companyName, serviceName } = req.body;

  try {
    const company = await RMCertificationModel.findOne({
      ["Company Name"]: companyName,
      serviceName: serviceName,
    });

    if (!company) {
      return res.status(404).json({ message: "Company or service not found" });
    }

    // Remove the specific remark from the array
    const updatedRemarks = company.Remarks.filter(
      (remark) => remark._id.toString() !== remarks_id
    );

    // Update the company document
    await RMCertificationModel.updateOne(
      { ["Company Name"]: companyName, serviceName: serviceName },
      { $set: { Remarks: updatedRemarks } }
    );

    res.status(200).json({ message: "Remark deleted successfully" });
  } catch (error) {
    console.error("Error deleting remark:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post(
  "/postmethodtoremovecompanyfromrmpanel/:companyName",
  async (req, res) => {
    const { companyName } = req.params;
    const { displayOfDateForRmCert } = req.body;
    const socketIO = req.io;
    //console.log("date", displayOfDateForRmCert);

    try {
      const updatedDocument = await RedesignedLeadformModel.findOneAndUpdate(
        { "Company Name": companyName },
        {
          isVisibleToRmOfCerification: false,
          displayOfDateForRmCert: displayOfDateForRmCert
            ? displayOfDateForRmCert
            : new Date(),
        },
        { new: true }
      );

      if (!updatedDocument) {
        return res.status(404).json({ message: "Document not found" });
      }

      res.status(200).json({
        message: "Document updated successfully",
        data: updatedDocument,
      });
    } catch (error) {
      console.error("Error updating data", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.post(
  "/postmethodtoremovecompanyfromadminexecutivepanel/:companyName",
  async (req, res) => {
    const { companyName } = req.params;
    const { displayOfDateForAdminExecutive } = req.body;
    const socketIO = req.io;
    //console.log("date", displayOfDateForAdminExecutive);

    try {
      const updatedDocument = await RedesignedLeadformModel.findOneAndUpdate(
        { "Company Name": companyName },
        {
          isVisibleToAdminExecutive: false,
          displayOfDateForAdminExecutive: displayOfDateForAdminExecutive
            ? displayOfDateForAdminExecutive
            : new Date(),
        },
        { new: true }
      );

      if (!updatedDocument) {
        return res.status(404).json({ message: "Document not found" });
      }

      res.status(200).json({
        message: "Document updated successfully",
        data: updatedDocument,
      });
    } catch (error) {
      console.error("Error updating data", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.post(
  "/postmethodtogetbackfromtrashbox/:companyName",
  async (req, res) => {
    const { companyName } = req.params;
    const socketIO = req.io;

    try {
      const updatedDocument = await RedesignedLeadformModel.findOneAndUpdate(
        { "Company Name": companyName },
        {
          isVisibleToRmOfCerification: true,
        },
        { new: true }
      );

      if (!updatedDocument) {
        return res.status(404).json({ message: "Document not found" });
      }
      socketIO.emit("rm-cert-company-taken-back-from-trashbox");
      res.status(200).json({
        message: "Document updated successfully",
        data: updatedDocument,
      });
    } catch (error) {
      console.error("Error updating data", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.post(
  "/postmethodtogetbackfromtrashboxadminexecutive/:companyName",
  async (req, res) => {
    const { companyName } = req.params;
    const socketIO = req.io;

    try {
      const updatedDocument = await RedesignedLeadformModel.findOneAndUpdate(
        { "Company Name": companyName },
        {
          isVisibleToAdminExecutive: true,
        },
        { new: true }
      );

      if (!updatedDocument) {
        return res.status(404).json({ message: "Document not found" });
      }
      socketIO.emit("rm-cert-company-taken-back-from-trashbox");
      res.status(200).json({
        message: "Document updated successfully",
        data: updatedDocument,
      });
    } catch (error) {
      console.error("Error updating data", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.post(
  "/postmethodtoremovelcompaniesfromtrashboxpemanently",
  async (req, res) => {
    const { permanentlDeleteDateFromRmCert } = req.body;
    const socketIO = req.io;

    //console.log("deletedata" , permanentlDeleteDateFromRmCert)

    try {
      const updatedDocument = await RedesignedLeadformModel.updateMany(
        {
          isVisibleToRmOfCerification: false,
        },
        {
          permanentlDeleteFromRmCert: true,
          permanentlDeleteDateFromRmCert: permanentlDeleteDateFromRmCert,
        },
        { new: true }
      );

      if (!updatedDocument) {
        return res.status(404).json({ message: "Document not found" });
      }
      socketIO.emit("rm-cert-completely-emtpy");
      res.status(200).json({
        message: "Document updated successfully",
        data: updatedDocument,
      });
    } catch (error) {
      console.error("Error updating data", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.post(
  "/postmethodtoremovelcompaniesfromtrashboxpemanentlyadminexecutive",
  async (req, res) => {
    const { permanentlDeleteDateFromAdminExecutive } = req.body;
    const socketIO = req.io;

    //console.log("deletedata" , permanentlDeleteDateFromRmCert)

    try {
      const updatedDocument = await RedesignedLeadformModel.updateMany(
        {
          isVisibleToAdminExecutive: false,
        },
        {
          permanentlDeleteFromAdminExecutive: true,
          permanentlDeleteDateFromAdminExecutive:
            permanentlDeleteDateFromAdminExecutive,
        },
        { new: true }
      );

      if (!updatedDocument) {
        return res.status(404).json({ message: "Document not found" });
      }
      socketIO.emit("rm-cert-completely-emtpy");
      res.status(200).json({
        message: "Document updated successfully",
        data: updatedDocument,
      });
    } catch (error) {
      console.error("Error updating data", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.post("/post-remarks-for-rmofcertification", async (req, res) => {
  const { currentCompanyName, currentServiceName, changeRemarks, updatedOn } =
    req.body;

  try {
    const updateDocument = await RMCertificationModel.findOneAndUpdate(
      {
        ["Company Name"]: currentCompanyName,
        serviceName: currentServiceName,
      },
      {
        $push: {
          Remarks: {
            remarks: changeRemarks,
            updatedOn: updatedOn,
          },
        },
      },
      { new: true } // Return the updated document
    );

    if (!updateDocument) {
      return res.status(404).json({ message: "Document not found" });
    }

    res
      .status(200)
      .json({ message: "Remarks added successfully", data: updateDocument });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/post-remarks-for-adminExecutive", async (req, res) => {
  const { companyName, serviceName, changeRemarks, updatedOn } = req.body;

  try {
    const updateDocument = await AdminExecutiveModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName,
      },
      {
        $push: {
          Remarks: {
            remarks: changeRemarks,
            updatedOn: updatedOn,
          },
        },
      },
      { new: true } // Return the updated document
    );

    if (!updateDocument) {
      return res.status(404).json({ message: "Document not found" });
    }

    res
      .status(200)
      .json({ message: "Remarks added successfully", data: updateDocument });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// router.post("/delete_company_from_taskmanager_and_send_to_recievedbox", async (req, res) => {
//   const { companyName, serviceName } = req.body;
//   const socketIO = req.io;
//   try {
//     // Find the document by companyName
//     const document = await RedesignedLeadformModel.findOne({ "Company Name": companyName });

//     if (!document) {
//       console.log("No service found")
//     }

//     // Remove serviceName from servicesTakenByRmOfCertification
//     const updatedServices = document.servicesTakenByRmOfCertification.filter(service => service !== serviceName);
//     document.servicesTakenByRmOfCertification = updatedServices;

//     // Remove serviceName from morebookings array of objects
//     document.moreBookings.forEach(booking => {
//       booking.servicesTakenByRmOfCertification = booking.servicesTakenByRmOfCertification.filter(service => service !== serviceName);
//     });

//     // Save the updated document
//     await document.save();

//     // Delete from RMCertificationModel
//     await RMCertificationModel.findOneAndDelete({
//       "Company Name": companyName,
//       serviceName: serviceName
//     });
//     socketIO.emit('rm-general-status-updated', { name: document.bdeName, companyName: companyName })
//     res.status(200).json({ message: "Company successfully deleted and service removed from RedesignedLeadModel" });
//   } catch (error) {
//     console.log("Error Deleting Company From Task Manager", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

router.post(
  "/delete_company_from_taskmanager_and_send_to_recievedbox",
  async (req, res) => {
    const { companyName, serviceName } = req.body;
    const socketIO = req.io;
    try {
      // Find the document by companyName
      const document = await RedesignedLeadformModel.findOne({
        "Company Name": companyName,
      });

      if (!document) {
        return res.status(404).json({ message: "Company not found" });
      }

      // Remove serviceName from servicesTakenByRmOfCertification
      const updatedServices = document.servicesTakenByRmOfCertification.filter(
        (service) => service !== serviceName
      );
      document.servicesTakenByRmOfCertification = updatedServices;

      // Remove serviceName from moreBookings array of objects
      document.moreBookings.forEach((booking) => {
        booking.servicesTakenByRmOfCertification =
          booking.servicesTakenByRmOfCertification.filter(
            (service) => service !== serviceName
          );
      });

      // Save the updated document
      await document.save();

      // Delete from RMCertificationModel
      const response2 = await RMCertificationModel.findOneAndDelete({
        "Company Name": companyName,
        serviceName: serviceName,
      });

      // If response2 is null, it means nothing was deleted from RMCertificationModel
      if (!response2) {
        console.log(
          "No matching document found in RMCertificationModel for deletion"
        );
      }

      // Emit the socket event
      socketIO.emit("rm-general-status-updated", {
        name: document.bdeName,
        companyName: companyName,
      });

      // Respond to the client
      res.status(200).json({
        message:
          "Company successfully deleted and service removed from RedesignedLeadModel",
      });
    } catch (error) {
      console.log("Error Deleting Company From Task Manager", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.post(
  "/delete_company_from_taskmanager_and_send_to_recievedbox-foradminexecutive",
  async (req, res) => {
    const { companyName, serviceName } = req.body;
    const socketIO = req.io;
    try {
      // Find the document by companyName
      const document = await RedesignedLeadformModel.findOne({
        "Company Name": companyName,
      });

      if (!document) {
        return res.status(404).json({ message: "Company not found" });
      }

      // Remove serviceName from servicesTakenByRmOfCertification
      const updatedServices = document.servicesTakenByAdminExecutive.filter(
        (service) => service !== serviceName
      );
      document.servicesTakenByAdminExecutive = updatedServices;

      // Remove serviceName from moreBookings array of objects
      document.moreBookings.forEach((booking) => {
        booking.servicesTakenByAdminExecutive =
          booking.servicesTakenByAdminExecutive.filter(
            (service) => service !== serviceName
          );
      });

      // Save the updated document
      await document.save();

      // Delete from RMCertificationModel
      const response2 = await AdminExecutiveModel.findOneAndDelete({
        "Company Name": companyName,
        serviceName: serviceName,
      });

      // If response2 is null, it means nothing was deleted from RMCertificationModel
      if (!response2) {
        console.log(
          "No matching document found in RMCertificationModel for deletion"
        );
      }

      // Emit the socket event
      socketIO.emit("adminexecutive-general-status-updated", {
        name: document.bdeName,
        companyName: companyName,
      });

      // Respond to the client
      res.status(200).json({
        message:
          "Company successfully deleted and service removed from RedesignedLeadModel",
      });
    } catch (error) {
      console.log("Error Deleting Company From Task Manager", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// router.post("/rmcertification-update-remainingpayments", async (req, res) => {
//   const { companyName, serviceName, pendingRecievedPayment, pendingRecievedPaymentDate } = req.body;
//   const socketIO = req.io;

//   try {
//     // Fetch the current records for validation
//     const company = await RMCertificationModel.findOne({
//       "Company Name": companyName,
//       serviceName: serviceName
//     });

//     const AdminExecutiveCompany = await AdminExecutiveModel.findOne({
//       "Company Name": companyName,
//       serviceName: serviceName
//     });

//     // if (!company || !AdminExecutiveCompany) {
//     //   return res.status(400).json({ message: "Company or service not found" });
//     // }

//     // Update the RMCertificationModel record
//     const updatedCompany = await RMCertificationModel.findOneAndUpdate(
//       { "Company Name": companyName, serviceName: serviceName },
//       {
//         $inc: { pendingRecievedPayment: pendingRecievedPayment },
//         pendingRecievedPaymentDate
//       },
//       { new: true }
//     );

//     // Update the AdminExecutiveModel record
//     const updatedCompanyAdminExecutive = await AdminExecutiveModel.findOneAndUpdate(
//       { "Company Name": companyName, serviceName: serviceName },
//       {
//         $inc: { pendingRecievedPayment: pendingRecievedPayment },
//         pendingRecievedPaymentDate
//       },
//       { new: true }
//     );
//     console.log("updatedcompanyh" , updatedCompanyAdminExecutive)
//     // if (!updatedCompany || !updatedCompanyAdminExecutive) {
//     //   return res.status(400).json({ message: "Failed to save the updated document" });
//     // }

//     // Emit socket event
//     socketIO.emit('rm-recievedamount-updated');
//     res.status(200).json({ message: "Pending Amount Added Successfully", data: updatedCompany });

//   } catch (error) {
//     console.error("Error submitting remaining payment", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

router.post("/rmcertification-update-remainingpayments", async (req, res) => {
  const {
    companyName,
    serviceName,
    pendingRecievedPayment,
    pendingRecievedPaymentDate,
  } = req.body;
  const socketIO = req.io;

  try {
    // Fetch the current record for validation
    const company = await RMCertificationModel.findOne({
      "Company Name": companyName,
      serviceName: serviceName,
    });

    // if (!company) {
    //   return res.status(400).json({ message: "Company or service not found" });
    // }

    // Validate that the pendingReceivedPayment does not exceed the total amount
    //const totalAmount = company.totalPaymentWGST; // Assuming this is the total amount
    const currentReceivedPayment = company.pendingRecievedPayment || 0;

    //console.log("totalAmount", totalAmount)
    //console.log(currentReceivedPayment)

    // if (pendingRecievedPayment + currentReceivedPayment > totalAmount) {
    //   return res.status(400).json({ message: "Pending received payment exceeds the total amount" });
    // }
    // Update the record if validation passes
    const updatedCompany = await RMCertificationModel.findOneAndUpdate(
      { "Company Name": companyName, serviceName: serviceName },
      {
        pendingRecievedPayment: pendingRecievedPayment + currentReceivedPayment,
        pendingRecievedPaymentDate,
      },
      { new: true }
    );

    //console.log("updatedcompany", updatedCompany);
    if (!updatedCompany) {
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }
    // Emit socket event
    socketIO.emit("rm-recievedamount-updated");

    res.status(200).json({
      message: "Pending Amount Added Successfully",
      data: updatedCompany,
    });
  } catch (error) {
    console.log("Error submitting remaining payment", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/adminexecutive-update-remainingpayments", async (req, res) => {
  const {
    companyName,
    serviceName,
    pendingRecievedPayment,
    pendingRecievedPaymentDate,
  } = req.body;
  const socketIO = req.io;

  try {
    // Fetch the current record for validation
    const company = await AdminExecutiveModel.findOne({
      "Company Name": companyName,
      serviceName: serviceName,
    });

    // if (!company) {
    //   return res.status(400).json({ message: "Company or service not found" });
    // }

    // Validate that the pendingReceivedPayment does not exceed the total amount
    //const totalAmount = company.totalPaymentWGST; // Assuming this is the total amount
    const currentReceivedPayment = company.pendingRecievedPayment || 0;

    //console.log("totalAmount", totalAmount)
    //console.log(currentReceivedPayment)

    // if (pendingRecievedPayment + currentReceivedPayment > totalAmount) {
    //   return res.status(400).json({ message: "Pending received payment exceeds the total amount" });
    // }
    // Update the record if validation passes
    const updatedCompany = await AdminExecutiveModel.findOneAndUpdate(
      { "Company Name": companyName, serviceName: serviceName },
      {
        pendingRecievedPayment: pendingRecievedPayment + currentReceivedPayment,
        pendingRecievedPaymentDate,
      },
      { new: true }
    );
    //console.log("adminupdated", updatedCompany);

    if (!updatedCompany) {
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }
    // Emit socket event
    socketIO.emit("rm-recievedamount-updated");

    res.status(200).json({
      message: "Pending Amount Added Successfully",
      data: updatedCompany,
    });
  } catch (error) {
    console.log("Error submitting remaining payment", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/sectors", async (req, res) => {
  try {
    const { industry } = req.query;

    // Validate industry query parameter
    if (!industry) {
      return res.status(400).json({ error: "Industry parameter is required" });
    }

    // Fetch sectors from the database based on the industry
    const sectors = await RMCertificationModel.find({ industry });

    // Send response with sectors
    res.json(sectors);
  } catch (error) {
    console.error("Error fetching sectors:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// -----------------update-leads-button-function-for emergency-use-only------------
// Helper function to convert decimal time to HH:MM:SS format
function decimalToTime(decimal) {
  const totalSeconds = Math.floor(decimal * 24 * 60 * 60); // Convert decimal days to seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Pad the values to ensure they are always two digits
  const paddedHours = String(hours).padStart(2, '0');
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}
// Function to parse the date and set the time to 00:00:00 to avoid time zone shifts

const excelSerialToJSDate = (serial) => {
  if (typeof serial !== 'number' || isNaN(serial)) {
    console.error("Invalid serial date:", serial);
    return undefined;
  }

  // Excel incorrectly assumes 1900 was a leap year, so we adjust the serial number accordingly
  let daysOffset = serial > 59 ? serial - 2 : serial - 1;

  // Add the daysOffset to the Excel base date (January 1, 1900)
  const excelStartDate = new Date(Date.UTC(1900, 0, 1)); // Using UTC to avoid time zone issues
  const jsDate = new Date(excelStartDate.getTime() + daysOffset * 24 * 60 * 60 * 1000);

  // Returning the date in ISO format (without time zone interference)
  return jsDate.toISOString().split('T')[0];
};


function combineDateAndTime(serialDate, serialTime) {
  // Convert Excel serial date to JavaScript Date object
  const datePart = excelSerialToJSDate(serialDate);

  // Convert Excel decimal time to hours, minutes, seconds
  const totalSeconds = serialTime * 24 * 60 * 60; // Excel decimal time represents a fraction of a day
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  // Combine date and time into a single Date object
  datePart.setUTCHours(hours, minutes, seconds, 0); // UTC to avoid timezone issues

  // Return combined date and time in ISO string format
  return datePart.toISOString(); // Outputs in "YYYY-MM-DDTHH:mm:ss.sssZ" format
}

router.post('/upload-approved-data', async (req, res) => {
  const data = req.body; // This should be the array of objects parsed from Excel

  try {
    const updates = data.map(async (item) => {
      try {

        const parsedSubmittedOn = item["Submitted On Date"]
          ? excelSerialToJSDate(item["Submitted On Date"])
          : undefined;
        const parsedBookingDate = item["Booking Date"]
          ? excelSerialToJSDate(item["Booking Date"])
          : undefined;

        await RMCertificationModel.create({
          "Company Name": item["Company Name"] ? item["Company Name"] : "",
          "Company Number": item["Company Number"],
          "Company Email": item["Company Email"],
          caNumber: item["CA Number"] ? item["CA Number"] : 0,
          serviceName: item["Services Name"],
          mainCategoryStatus: item["Status"] || "Approved",
          subCategoryStatus: item["Status"] || "Approved",
          websiteLink: item["Website Link/Brief"],
          withDSC: item["DSC Applicable"] === "Yes" ? true : false,
          letterStatus: item["Letter Status"] || "Not Started",
          dscStatus: item["DSC Status"] || "Not Started",
          contentWriter: item["Content Writer"] || "RonakKumar",
          contentStatus: item["Content Status"] || "Not Started",
          nswsMobileNo: item["NSWS Phone No"],
          nswsMailId: item["NSWS Email Id"],
          nswsPaswsord: item["NSWS Password"],
          City: item.City,
          State: item.State,
          industry: item.Industry,
          sector: item.Sector,
          lastAttemptSubmitted: item["No of Attempt"],
          submittedOn: parsedSubmittedOn,
          submittedTime: item["Submitted On Time"]
            ? decimalToTime(item["Submitted On Time"])
            : undefined,
          submittedBy: item["Submitted By"],
          bookingDate: item["Booking Date"]
            ? excelSerialToJSDate(item["Booking Date"])
            : undefined,
          bdeName: item["BDE Name"],
          bdmName: item["BDM Name"],
          totalPaymentWGST: item["Total Payment"],
          pendingNotRecievedPayment: item["Pending Payment"],
          pendingRecievedPaymentDate: item["Pending Recieved Payment Date"]
            ? new Date(item["Pending Recieved Payment Date"])
            : undefined,
          panNumber: item.panNumber ? item.panNumber : "",
          bdeEmail: item.bdeEmail ? item.bdeEmail : "",
          bdmType: item.bdmType ? item.bdmType : "",
          paymentMethod: item.paymentMethod,
          caCase: item.caCase ? item.caCase : "",
          caEmail: item.caEmail ? item.caEmail : "",
          totalPaymentWOGST: item.totalPaymentWOGST,
          withGST: item.withGST ? true : false,
          paymentTerms: item["Total Payment"] === item["Recieved Payment"] ? "Full Advanced" : "two-part",
          firstPayment: item["Recieved Payment"],
          secondPayment: item.secondPayment ? item.secondPayment : 0,
          thirdPayment: item.thirdPayment ? item.thirdPayment : 0,
          fourthPayment: item.fourthPayment ? item.fourthPayment : 0,
          secondPaymentRemarks: item.secondPaymentRemarks ? item.secondPaymentRemarks : "",
          thirdPaymentRemarks: item.thirdPaymentRemarks ? item.thirdPaymentRemarks : "",
          fourthPaymentRemarks: item.fourthPaymentRemarks,
          bookingPublishDate: item["Booking Date"],
          addedOn: parsedSubmittedOn,
          brochureStatus: item.brochureStatus || "Not Applicable",
          brochureDesigner: item.brochureDesigner ? item.brochureDesigner : "",
          companyBriefing: item.companyBriefing ? item.companyBriefing : "",
          lastActionDate: item.lastActionDate ? new Date(item.lastActionDate) : new Date(),
          dateOfChangingMainStatus: parsedSubmittedOn,
          previousMainCategoryStatus: item.previousMainCategoryStatus || "Direct",
          previousSubCategoryStatus: item.previousSubCategoryStatus || "Direct",
          SecondTimeSubmitDate: item.SecondTimeSubmitDate ? new Date(item.SecondTimeSubmitDate) : new Date(),
          ThirdTimeSubmitDate: item.ThirdTimeSubmitDate ? new Date(item.ThirdTimeSubmitDate) : new Date(),
          isIndustryEnabled: item.isIndustryEnabled ? item.isIndustryEnabled : false,
          otpVerificationStatus: item.otpVerificationStatus || "Both Done",
          isUploadedDirect: true
        });
      } catch (err) {
        console.error(`Failed to process company: ${item["Company Name"]}`);
        console.error("Error details:", err.message);
      }
    });

    await Promise.all(updates);

    res.status(200).json({ message: 'Data uploaded successfully' });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ error: 'Failed to upload data' });
  }
});

router.delete('/delete-directuploadedleads', async (req, res) => {
  try {
    const result = await RMCertificationModel.deleteMany({ "isUploadedDirect": true });

    // Sending response after deletion
    res.status(200).json({ message: 'Leads deleted successfully', deletedCount: result.deletedCount });
  } catch (error) {
    console.error("Error deleting company", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});





module.exports = router;
