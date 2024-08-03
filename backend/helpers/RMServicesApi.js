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
const RedesignedLeadformModel = require('../models/RedesignedLeadform.js');
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

router.get("/redesigned-final-leadData-rm", async (req, res) => {
  try {
    const allData = await RedesignedLeadformModel.aggregate([
      {
        $addFields: {
          isVisibleToRmOfCerification: {
            $ifNull: ["$isVisibleToRmOfCerification", true]
          },
          lastActionDateAsDate: {
            $dateFromString: {
              dateString: "$lastActionDate",
              onError: new Date(0),  // Default to epoch if conversion fails
              onNull: new Date(0)    // Default to epoch if null
            }
          }
        }
      },
      {
        $match: {
          isVisibleToRmOfCerification: true
        }
      },
      {
        $sort: {
          lastActionDateAsDate: -1
        }
      }
    ]);

    res.status(200).json(allData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

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

router.post('/post-rmservices-from-listview', async (req, res) => {
  const { dataToSend } = req.body;
  try {
    const existingRecord = await RMCertificationModel.findOne({
      "Company Name": dataToSend["Company Name"],
      serviceName: dataToSend.serviceName
    })
    if (existingRecord) {
      res.status(400).json({ message: "Service has already been added" })
    } else {
      const createdRecord = await RMCertificationModel.create(dataToSend);
      res.status(200).json({
        message: "Details added successfully"
      })
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', details: error.message });
    }

    // For all other errors, send a 500 status code
    res.status(500).json({ message: "Error swapping services", details: error.message });
  }

})

router.get("/rm-sevicesgetrequest", async (req, res) => {
  try {
    const response = await RMCertificationModel.find().sort({ addedOn: -1 });
    res.status(200).json(response);
  } catch (error) {
    console.log("Error fetching data", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.delete(`/delete-rm-services`, async (req, res) => {
  const { companyName, serviceName } = req.body;
  try {
    const response = await RMCertificationModel.findOneAndDelete(
      {
        "Company Name": companyName,
        serviceName: serviceName
      }
    )
    if (response) {
      res.status(200).json({ message: "Record Deleted Succesfully", deletedData: response })
    } else {
      res.status(400).json({ message: "Record Not Found" })
    }

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" })
  }
})

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
                $ifNull: ["$bookingDate", new Date(0)] // Default to epoch if bookingDate is null
              },
              onNull: {
                $ifNull: ["$bookingDate", new Date(0)] // Default to epoch if bookingDate is null
              }
            }
          }
        }
      },
      // {
      //   $sort: {
      //     lastActionDateAsDate: -1
      //   }
      // },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ]);
    const totalCount = await RedesignedLeadformModel.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);
    res.status(200).json({
      data: allData,
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

//api to search data
function escapeRegex(string) {
  return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

router.get("/search-booking-data", async (req, res) => {
  const { searchText, currentPage, itemsPerPage } = req.query;
  console.log(searchText, currentPage, itemsPerPage);
  const page = parseInt(currentPage) || 1; // Page number
  const limit = parseInt(itemsPerPage) || 500; // Items per page
  const skip = (page - 1) * limit; // Number of documents to skip

  try {
    const searchTerm = searchText.trim();
    let query = {};
    if (searchTerm !== '') {
      if (!isNaN(searchTerm)) {
        query = { 'Company Number': searchTerm };
      } else {
        const escapedSearchTerm = escapeRegex(searchTerm);
        query = {
          $or: [
            { 'Company Name': { $regex: new RegExp(escapedSearchTerm, 'i') } },
            // Add other fields you want to search with the query here
            // For example: { anotherField: { $regex: new RegExp(escapedSearchTerm, 'i') } }
          ]
        };
      }
    }
    const data = await RedesignedLeadformModel.find(query).skip(skip).limit(limit);
    console.log("query", query);
    // console.log("data", data);
    res.status(200).json({
      data,
      totalCount: await RedesignedLeadformModel.countDocuments(query)
    });

  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/filter-rmofcertification-bookings", async (req, res) => {
  const { selectedServiceName,
    selectedBdeName,
    selectedBdmName,
    selectedYear,
    monthIndex,
    bookingDate,
    bookingPublishDate
  } = req.query;
  const page = parseInt(req.query.page) || 1; // Page number
  const limit = parseInt(req.query.limit) || 10; // Items per page
  const skip = (page - 1) * limit; // Number of documents to skip
  try {
    let baseQuery = {};
    if (selectedBdeName) baseQuery.bdeName = selectedBdeName;
    if (selectedBdmName) baseQuery.bdmName = selectedBdmName;
    if (selectedYear) {
      if (monthIndex !== '0') {
        const year = parseInt(selectedYear);
        const month = parseInt(monthIndex) - 1; // JavaScript months are 0-indexed
        const monthStartDate = new Date(year, month, 1);
        const monthEndDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
        baseQuery.bookingDate = {
          $gte: monthStartDate.toISOString().split('T')[0],
          $lt: new Date(monthEndDate.getTime() + 1).toISOString().split('T')[0]
        };
      } else {
        const yearStartDate = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
        const yearEndDate = new Date(`${selectedYear}-12-31T23:59:59.999Z`);
        baseQuery.bookingDate = {
          $gte: yearStartDate.toISOString().split('T')[0],
          $lt: new Date(yearEndDate.getTime() + 1).toISOString().split('T')[0]
        }
      }
    }

    if (bookingDate) {
      baseQuery.bookingDate = {
        $gte: new Date(bookingDate).toISOString().split('T')[0],
        $lt: new Date(new Date(bookingDate).setDate(new Date(bookingDate).getDate() + 1)).toISOString().split('T')[0]
      };
    }

    const data = await RedesignedLeadformModel.find(baseQuery).skip(skip).limit(limit).lean()
    const dataCount = await RedesignedLeadformModel.countDocuments(baseQuery);
    console.log(baseQuery)
    console.log("data", data.length, dataCount)
    res.status(200).json({
      data: data,
      currentPage: page,
      totalPages: Math.ceil((dataCount) / limit)
    })

  } catch (error) {
    console.log("Internal Server Error", error)
    res.status(500).json({ message: "Internal Server Error" })
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

router.post("/postrmselectedservicestobookings/:CompanyName", async (req, res) => {
  try {
    const companyName = req.params.CompanyName;
    const { rmServicesMainBooking, rmServicesMoreBooking } = req.body;
    const socketIO = req.io;
    console.log("rmservicesmainbooking", rmServicesMainBooking)
    console.log("rmservicesmorebooking", rmServicesMoreBooking)
    // Fetch the document
    const document = await RedesignedLeadformModel.findOne({ "Company Name": companyName });

    if (!document) {
      console.error("Document not found");
      return res.status(404).json({ message: "Document not found" });
    }

    // Update the servicesTakenByRmOfCertification for main bookings
    const uniqueMainServices = Array.from(new Set([
      ...document.servicesTakenByRmOfCertification,
      ...rmServicesMainBooking
    ]));
    document.servicesTakenByRmOfCertification = uniqueMainServices;

    // Iterate through moreBookings and update only relevant objects
    document.moreBookings.forEach((booking, index) => {
      const relevantServices = booking.services.filter(service =>
        rmServicesMoreBooking.includes(service.serviceName)
      );
      console.log("relevantservices", relevantServices)
      if (relevantServices.length > 0) {
        const currentServices = booking.servicesTakenByRmOfCertification || [];
        const uniqueMoreBookingServices = Array.from(new Set([
          ...currentServices,
          ...relevantServices.map(service => service.serviceName)
        ]));
        document.moreBookings[index].servicesTakenByRmOfCertification = uniqueMoreBookingServices;
      }
    });

    // Save the updated document
    const updatedDocument = await document.save();

    if (!updatedDocument) {
      console.error("Failed to save the updated document");
      return res.status(500).json({ message: "Failed to save the updated document" });
    }

    // Emit socket event
    res.status(200).json({ message: "Document updated successfully", data: updatedDocument });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/update-substatus-rmofcertification-changegeneral/`, async (req, res) => {
  const { companyName, serviceName, subCategoryStatus, mainCategoryStatus, previousMainCategoryStatus, previousSubCategoryStatus , dateOfChangingMainStatus } = req.body;
  const socketIO = req.io;

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
    console.log("Company after update:", updatedCompany);

    // Emit socket event if needed
    //socketIO.emit('update', { companyName, serviceName });
    socketIO.emit('rm-general-status-updated', {companyName: companyName });
    res.status(200).json({ message: "Document updated successfully", data: updatedCompany });

  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.post(`/update-substatus-rmofcertification/`, async (req, res) => {
  const { companyName, serviceName, subCategoryStatus, mainCategoryStatus, previousMainCategoryStatus, previousSubCategoryStatus } = req.body;
  const socketIO = req.io;

  try {
    // Step 1: Find the company document
    const company = await RMCertificationModel.findOne({ ["Company Name"]: companyName, serviceName: serviceName });

    if (!company) {
      console.error("Company not found");
      return res.status(400).json({ message: "Company not found" });
    }

    // Step 2: Determine the submittedOn date
    let submittedOn = company.submittedOn;
    let updateFields = {}; // Fields to be updated

    if (subCategoryStatus !== "Undo") {
      submittedOn = (mainCategoryStatus === "Submitted")
        ? company.submittedOn || new Date()  // Use existing submittedOn or current date
        : (subCategoryStatus === "Submitted")
          ? new Date()  // Set to current date if subCategoryStatus is "Submitted"
          : company.submittedOn;  // Retain existing submittedOn otherwise

      // Conditionally include dateOfChangingMainStatus
      if (["Process", "Approved", "Submitted", "Hold", "Defaulter"].includes(subCategoryStatus))  {
        updateFields.dateOfChangingMainStatus = new Date();
      }

      // Step 3: Update the document with the calculated dates
      const updatedCompany = await RMCertificationModel.findOneAndUpdate(
        {
          ["Company Name"]: companyName,
          serviceName: serviceName
        },
        {
          subCategoryStatus: subCategoryStatus,
          mainCategoryStatus: mainCategoryStatus,
          lastActionDate: new Date(),
          submittedOn: submittedOn,
          ...updateFields, // Conditionally include dateOfChangingMainStatus
          previousMainCategoryStatus: previousMainCategoryStatus,
          previousSubCategoryStatus: previousSubCategoryStatus
        },
        { new: true }
      );

      if (!updatedCompany) {
        console.error("Failed to save the updated document");
        return res.status(400).json({ message: "Failed to save the updated document" });
      }

      // Emit socket event
      socketIO.emit('rm-general-status-updated', { name: updatedCompany.bdeName, companyName: companyName });
      res.status(200).json({ message: "Document updated successfully", data: updatedCompany });

    } else {
      // If subCategoryStatus is "Undo", update with previous statuses and no new date
      const updatedCompany = await RMCertificationModel.findOneAndUpdate(
        {
          ["Company Name"]: companyName,
          serviceName: serviceName
        },
        {
          subCategoryStatus: company.previousMainCategoryStatus === "General" ? "Untouched" : company.previousSubCategoryStatus,  // Keep existing subCategoryStatus
          mainCategoryStatus: company.previousMainCategoryStatus,  // Restore previous mainCategoryStatus
          lastActionDate: new Date(),
          submittedOn: company.submittedOn,
          dateOfChangingMainStatus: company.dateOfChangingMainStatus, // Retain existing date
          Remarks: [],
          dscStatus: "Not Started",
          contentStatus: "Not Started",
          contentWriter: "",
          brochureStatus: "Not Started",
          brochureDesigner: "",
          nswsMailId: "",
          nswsPaswsord: "",
          websiteLink: "",
          industry: "",
          sector: ""  // Retain existing submittedOn
        },
        { new: true }
      );

      if (!updatedCompany) {
        console.error("Failed to save the updated document");
        return res.status(400).json({ message: "Failed to save the updated document" });
      }

      // Emit socket event
      socketIO.emit('rm-general-status-updated', { name: updatedCompany.bdeName, companyName: companyName });
      res.status(200).json({ message: "Document updated successfully", data: updatedCompany });
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
        serviceName: serviceName
      },
      {
        dscStatus: dscStatus
      },
      { new: true }
    )
    if (!company) {
      console.error("Failed to save the updated document");
      return res.status(400).json({ message: "Failed to save the updated document" });
    }

    // Emit socket event
    //console.log("Emitting event: rm-general-status-updated", { name: company.bdeName, companyName: companyName });
    //socketIO.emit('rm-general-status-updated', { name: company.bdeName, companyName: companyName })
    res.status(200).json({ message: "Document updated successfully", data: company });

  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

router.post(`/update-content-rmofcertification/`, async (req, res) => {
  const { companyName, serviceName, contentStatus } = req.body;
  //console.log("dscStatus" , contentStatus)
  const socketIO = req.io;
  try {
    const company = await RMCertificationModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName
      },
      {
        contentStatus: contentStatus
      },
      { new: true }
    )
    if (!company) {
      console.error("Failed to save the updated document");
      return res.status(400).json({ message: "Failed to save the updated document" });
    }

    // Emit socket event
    //console.log("Emitting event: rm-general-status-updated", { name: company.bdeName, companyName: companyName });
    //socketIO.emit('rm-general-status-updated', { name: company.bdeName, companyName: companyName })
    res.status(200).json({ message: "Document updated successfully", data: company });

  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/update-contentwriter-rmofcertification/`, async (req, res) => {
  const { companyName, serviceName, contentWriter } = req.body;
  console.log("here", companyName, serviceName, contentWriter)
  //console.log("dscStatus" , contentStatus)
  const socketIO = req.io;
  try {
    const company = await RMCertificationModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName
      },
      {
        contentWriter: contentWriter
      },
      { new: true }
    )
    if (!company) {
      console.error("Failed to save the updated document");
      return res.status(400).json({ message: "Failed to save the updated document" });
    }

    // Emit socket event
    //console.log("Emitting event: rm-general-status-updated", { name: company.bdeName, companyName: companyName });
    //socketIO.emit('rm-general-status-updated', { name: company.bdeName, companyName: companyName })
    res.status(200).json({ message: "Document updated successfully", data: company });

  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/update-brochuredesigner-rmofcertification/`, async (req, res) => {
  const { companyName, serviceName, brochureDesigner } = req.body;
  console.log("here", companyName, serviceName, brochureDesigner)
  //console.log("dscStatus" , contentStatus)
  const socketIO = req.io;
  try {
    const company = await RMCertificationModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName
      },
      {
        brochureDesigner: brochureDesigner
      },
      { new: true }
    )
    if (!company) {
      console.error("Failed to save the updated document");
      return res.status(400).json({ message: "Failed to save the updated document" });
    }

    // Emit socket event
    //console.log("Emitting event: rm-general-status-updated", { name: company.bdeName, companyName: companyName });
    //socketIO.emit('rm-general-status-updated', { name: company.bdeName, companyName: companyName })
    res.status(200).json({ message: "Document updated successfully", data: company });

  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/update-brochure-rmofcertification/`, async (req, res) => {
  const { companyName, serviceName, brochureStatus } = req.body;
  //console.log("dscStatus" , contentStatus)
  const socketIO = req.io;
  try {
    const company = await RMCertificationModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName
      },
      {
        brochureStatus: brochureStatus
      },
      { new: true }
    )
    if (!company) {
      console.error("Failed to save the updated document");
      return res.status(400).json({ message: "Failed to save the updated document" });
    }

    // Emit socket event
    //console.log("Emitting event: rm-general-status-updated", { name: company.bdeName, companyName: companyName });
    //socketIO.emit('rm-general-status-updated', { name: company.bdeName, companyName: companyName })
    res.status(200).json({ message: "Document updated successfully", data: company });

  } catch (error) {
    console.error("Error updating document:", error);
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
        serviceName: serviceName
      },
      {
        nswsMailId: email
      },
      { new: true }
    )
    if (!company) {
      console.error("Failed to save the updated document");
      return res.status(400).json({ message: "Failed to save the updated document" });
    }

    // Emit socket event
    //console.log("Emitting event: rm-general-status-updated", { name: company.bdeName, companyName: companyName });
    //socketIO.emit('rm-general-status-updated', { name: company.bdeName, companyName: companyName })
    res.status(200).json({ message: "Document updated successfully", data: company });

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
        serviceName: currentServiceName
      },
      {
        nswsPaswsord: password
      },
      { new: true }
    )
    if (!company) {
      console.error("Failed to save the updated document");
      return res.status(400).json({ message: "Failed to save the updated document" });
    }

    // Emit socket event
    //console.log("Emitting event: rm-general-status-updated", { name: company.bdeName, companyName: companyName });
    //socketIO.emit('rm-general-status-updated', { name: company.bdeName, companyName: companyName })
    res.status(200).json({ message: "Document updated successfully", data: company });

  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/post-save-nswspassword/`, async (req, res) => {
  const { companyName, serviceName, password } = req.body;
  //console.log("dscStatus" ,password , companyName , serviceName)
  const socketIO = req.io;
  try {
    const company = await RMCertificationModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName
      },
      {
        nswsPaswsord: password
      },
      { new: true }
    )
    if (!company) {
      console.error("Failed to save the updated document");
      return res.status(400).json({ message: "Failed to save the updated document" });
    }
    // Emit socket event
    //console.log("Emitting event: rm-general-status-updated", { name: company.bdeName, companyName: companyName });
    //socketIO.emit('rm-general-status-updated', { name: company.bdeName, companyName: companyName })
    res.status(200).json({ message: "Document updated successfully", data: company });

  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/post-save-websitelink/`, async (req, res) => {
  const { companyName, serviceName, link, briefing } = req.body;
  console.log("dscStatus", serviceName, companyName, link)
  const socketIO = req.io;
  try {
    const company = await RMCertificationModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName
      },
      {
        websiteLink: link,
        companyBriefing: briefing

      },
      { new: true }
    )
    if (!company) {
      console.error("Failed to save the updated document");
      return res.status(400).json({ message: "Failed to save the updated document" });
    }
    // Emit socket event
    //console.log("Emitting event: rm-general-status-updated", { name: company.bdeName, companyName: companyName });
    //socketIO.emit('rm-general-status-updated', { name: company.bdeName, companyName: companyName })
    res.status(200).json({ message: "Document updated successfully", data: company });

  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/post-save-industry/`, async (req, res) => {
  const { companyName, serviceName, industryOption } = req.body;
  console.log("dscStatus", serviceName, companyName, industryOption)
  const socketIO = req.io;
  try {
    const company = await RMCertificationModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName
      },
      {
        industry: industryOption
      },
      { new: true }
    )
    if (!company) {
      console.error("Failed to save the updated document");
      return res.status(400).json({ message: "Failed to save the updated document" });
    }
    // Emit socket event
    //console.log("Emitting event: rm-general-status-updated", { name: company.bdeName, companyName: companyName });
    //socketIO.emit('rm-general-status-updated', { name: company.bdeName, companyName: companyName })
    res.status(200).json({ message: "Document updated successfully", data: company });

  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/post-save-sector/`, async (req, res) => {
  const { companyName, serviceName, sectorOption } = req.body;
  console.log("dscStatus", serviceName, companyName, sectorOption)
  const socketIO = req.io;
  try {
    const company = await RMCertificationModel.findOneAndUpdate(
      {
        ["Company Name"]: companyName,
        serviceName: serviceName
      },
      {
        sector: sectorOption
      },
      { new: true }
    )
    if (!company) {
      console.error("Failed to save the updated document");
      return res.status(400).json({ message: "Failed to save the updated document" });
    }
    // Emit socket event
    //console.log("Emitting event: rm-general-status-updated", { name: company.bdeName, companyName: companyName });
    //socketIO.emit('rm-general-status-updated', { name: company.bdeName, companyName: companyName })
    res.status(200).json({ message: "Document updated successfully", data: company });

  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete('/delete-remark-rmcert', async (req, res) => {
  const { remarks_id, companyName, serviceName } = req.body;

  try {
    const company = await RMCertificationModel.findOne({
      ["Company Name"]: companyName,
      serviceName: serviceName
    });

    if (!company) {
      return res.status(404).json({ message: "Company or service not found" });
    }

    // Remove the specific remark from the array
    const updatedRemarks = company.Remarks.filter(remark => remark._id.toString() !== remarks_id);

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


router.post("/postmethodtoremovecompanyfromrmpanel/:companyName", async (req, res) => {
  const { companyName } = req.params;

  try {
    const updatedDocument = await RedesignedLeadformModel.findOneAndUpdate(
      { "Company Name": companyName },
      { isVisibleToRmOfCerification: false },
      { new: true }
    );

    if (!updatedDocument) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json({ message: "Document updated successfully", data: updatedDocument });
  } catch (error) {
    console.error("Error updating data", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/post-remarks-for-rmofcertification", async (req, res) => {
  const { currentCompanyName, currentServiceName, changeRemarks, updatedOn } = req.body;

  try {
    const updateDocument = await RMCertificationModel.findOneAndUpdate(
      {
        ["Company Name"]: currentCompanyName,
        serviceName: currentServiceName
      },
      {
        $push: {
          Remarks: {
            remarks: changeRemarks,
            updatedOn: updatedOn
          }
        }
      },
      { new: true } // Return the updated document
    );

    if (!updateDocument) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json({ message: "Remarks added successfully", data: updateDocument });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/delete_company_from_taskmanager_and_send_to_recievedbox", async (req, res) => {
  const { companyName, serviceName } = req.body;
  try {
    // Find the document by companyName
    const document = await RedesignedLeadformModel.findOne({ "Company Name": companyName });
    
    if (!document) {
      console.log("No service found")
    }

    // Remove serviceName from servicesTakenByRmOfCertification
    const updatedServices = document.servicesTakenByRmOfCertification.filter(service => service !== serviceName);
    document.servicesTakenByRmOfCertification = updatedServices;

    // Remove serviceName from morebookings array of objects
    document.moreBookings.forEach(booking => {
      booking.servicesTakenByRmOfCertification = booking.servicesTakenByRmOfCertification.filter(service => service !== serviceName);
    });

    // Save the updated document
    await document.save();

    // Delete from RMCertificationModel
    await RMCertificationModel.findOneAndDelete({
      "Company Name": companyName,
      serviceName: serviceName
    });

    res.status(200).json({ message: "Company successfully deleted and service removed from RedesignedLeadModel" });
  } catch (error) {
    console.log("Error Deleting Company From Task Manager", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});










module.exports = router;