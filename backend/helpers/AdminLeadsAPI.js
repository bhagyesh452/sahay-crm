var express = require('express');
var router = express.Router()
const dotenv = require('dotenv')
dotenv.config();
const CompanyModel = require("../models/Leads.js");
const RecentUpdatesModel = require('../models/RecentUpdates.js')
const { exec } = require("child_process");
const TeamLeadsModel = require('../models/TeamLeads.js');
const FollowUpModel = require("../models/FollowUp");
const { Parser } = require('json2csv');
const RedesignedLeadformModel = require('../models/RedesignedLeadform.js');
const NotiModel = require('../models/Notifications.js');

function formatDateFinal(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const convertToCSV = (json) => {
  try {
    const parser = new Parser();
    return parser.parse(json);
  } catch (error) {
    console.error('Error converting to CSV:', error);
    throw error;
  }
};

router.get('/', async function (req, res) {
  try {
    res.status(200).json({ message: "running" })
  } catch (err) {
    console.log('Error logging in with OAuth2 user', err);
  }

})


// router.post('/update-ename', async (req, res) => {
//   const data = req.body;

//   try {
//     const updates = data.map(async (item) => {
//       const { 'Company Name': companyName } = item;

//       // Function to convert DD-MM-YYYY or Excel serial number to ISO format
//       const convertToISODate = (dateValue) => {
//         if (typeof dateValue === 'string') {
//           // Handle string in DD-MM-YYYY format
//           const [day, month, year] = dateValue.split('-');
//           return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
//         } else if (typeof dateValue === 'number') {
//           // Handle Excel serial numbers
//           const excelBaseDate = new Date(1900, 0, 1); // Excel base date: January 1, 1900
//           return new Date(excelBaseDate.getTime() + (dateValue - 2) * 86400000); // Adjust for 2-day difference
//         } else if (dateValue instanceof Date) {
//           // If it's already a Date object
//           return dateValue;
//         }
//         return new Date(); // Fallback to current date if dateValue is invalid
//       };

//       // Parse the date if provided in either DD-MM-YYYY format or as a serial number
//       const companyIncorporationDate = item["Company Incorporation Date"]
//         ? convertToISODate(item["Company Incorporation Date"])
//         : new Date(); // Default to current date if not provided

//       // Logging the incoming item for debugging


//       // Update or insert the company
//       const updateResult = await CompanyModel.findOneAndUpdate(
//         { "Company Name": companyName }, // Condition to find the company
//         {
//           $set: {
//             ename: item['ename'] || '', // Default ename or update from data
//             "Company Number": item["Company Number"] || '',
//             "Company Email": item["Company Email"] || '',
//             "Company Incorporation Date  ": companyIncorporationDate,  // Use the converted date
//             City: item["City"] || '',
//             State: item["State"] || '',
//             Status: item["Status"] || '',
//             Remarks: item["Remarks"] || '',
//             AssignDate: new Date(),
//             UploadDate: new Date(),
//             isUploadedManually: true,
//             UploadedBy: "Ronak Kumar",
//             isDeletedEmployeeCompany:true
//           }
//         },
//         { upsert: true, new: true } // Insert a new document if no match is found and return the updated/new doc
//       );

//       // After updating/creating the company, log it


//       // Create a new entry in RemarksHistory for this company
//       const newRemark = new RemarksHistory({
//         time: new Date().toLocaleTimeString(), // Set the current time
//         date: new Date().toISOString().split('T')[0], // Set the current date (ISO format)
//         companyID: updateResult._id, // Use the company's _id field
//         companyName: companyName, // Save the company name
//         remarks: item["Remarks"] || '', // Remarks from the input data
//         bdmName: item["bdmName"] || '', // Example, you can include more data if needed
//         bdmRemarks: item["bdmRemarks"] || '',
//         bdeName: item["ename"] || '',
//       });

//       // Save the remarks history entry
//       await newRemark.save();

//       const newCompleteRemarks = {
//         companyID: updateResult._id,
//         "Company Name": companyName,
//         employeeName: item["ename"],
//         designation: "Business Development Manager",
//         remarks: item["Remarks"],
//         bdeName: item["ename"],
//         addedOn: new Date()
//       };

//       // Find existing remarks history for the company
//     const existingCompleteRemarksHistory = await CompleteRemarksHistoryLeads.findOne({ companyID: updateResult._id })
//     .select("companyID"); // Only select companyID and remarks

//   if (existingCompleteRemarksHistory) {

//     // Check if the remarks array exists, and if not, initialize it
//     if (!existingCompleteRemarksHistory.remarks) {
//       existingCompleteRemarksHistory.remarks = [];
//     }
//     const saveEntry = await CompleteRemarksHistoryLeads.findOneAndUpdate(
//       {
//         companyID: updateResult._id
//       },
//       {
//         $push: {
//           remarks: [newCompleteRemarks]

//         }
//       }
//     )
//   } else {
//     // If the company doesn't exist, create a new entry with the new object
//     const newCompleteRemarksHistory = new CompleteRemarksHistoryLeads({
//       companyID: updateResult._id,
//       "Company Name": companyName,
//       remarks: [newCompleteRemarks], // Store the general remarks
//     });

//     await newCompleteRemarksHistory.save();
//   }
  

//     });

   
//     // Wait for all updates and remarks to complete
//     await Promise.all(updates);

//     //console.log('All companies and remarks updated/inserted successfully.');
//     res.status(200).json({ message: 'Ename and remarks updated or inserted successfully' });
//   } catch (error) {
//     console.error('Error updating or inserting ename/remarks:', error);
//     res.status(500).json({ error: 'Failed to update or insert ename and remarks' });
//   }
// });

router.post('/update-ename', async (req, res) => {
  const data = req.body;

  try {
    const updates = data.map(async (item) => {
      const { 'Company Name': companyName } = item;

      // Convert various date formats to ISO
      const convertToISODate = (dateValue) => {
        if (typeof dateValue === 'string') {
          const [day, month, year] = dateValue.split('-');
          return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
        } else if (typeof dateValue === 'number') {
          const excelBaseDate = new Date(1900, 0, 1);
          return new Date(excelBaseDate.getTime() + (dateValue - 2) * 86400000);
        } else if (dateValue instanceof Date) {
          return dateValue;
        }
        return null; // Return null for invalid dates
      };

      const companyIncorporationDate = item["Company Incorporation Date"]
        ? convertToISODate(item["Company Incorporation Date"])
        : null;

      // Update or insert company
      const updateResult = await CompanyModel.findOneAndUpdate(
        { "Company Name": companyName },
        {
          $set: {
            ename: item['ename'] || '',
            "Company Number": item["Company Number"] || '',
            "Company Email": item["Company Email"] || '',
            "Company Incorporation Date": companyIncorporationDate,
            City: item["City"] || '',
            State: item["State"] || '',
            Status: item["Status"] || '',
            Remarks: item["Remarks"] || '',
            AssignDate: new Date(),
            UploadDate: new Date(),
            isUploadedManually: true,
            UploadedBy: "Ronak Kumar",
            isDeletedEmployeeCompany: true,
            maturedCaseUploaded:true
          },
        },
        { upsert: true, new: true }
      );

      // Insert remarks history
      const newRemark = new RemarksHistory({
        time: new Date().toLocaleTimeString(),
        date: new Date().toISOString().split('T')[0],
        companyID: updateResult._id,
        companyName: companyName,
        remarks: item["Remarks"] || '',
        bdmName: item["bdmName"] || '',
        bdmRemarks: item["bdmRemarks"] || '',
        bdeName: item["ename"] || '',
      });

      await newRemark.save();

      // Insert or update CompleteRemarksHistoryLeads
      const newCompleteRemark = {
        companyID: updateResult._id,
        "Company Name": companyName,
        employeeName: item["ename"],
        designation: "Business Development Manager",
        remarks: item["Remarks"],
        bdeName: item["ename"],
        addedOn: new Date(),
      };

      const existingHistory = await CompleteRemarksHistoryLeads.findOne({ companyID: updateResult._id });
      if (existingHistory) {
        await CompleteRemarksHistoryLeads.updateOne(
          { companyID: updateResult._id },
          { $push: { remarks: newCompleteRemark } }
        );
      } else {
        const newHistory = new CompleteRemarksHistoryLeads({
          companyID: updateResult._id,
          "Company Name": companyName,
          remarks: [newCompleteRemark],
        });
        await newHistory.save();
      }
    });

    // Wait for all updates to complete
    await Promise.all(updates);

    res.status(200).json({ message: 'Ename and remarks updated or inserted successfully' });
  } catch (error) {
    console.error('Error updating or inserting ename/remarks:', error);
    res.status(500).json({ error: 'Failed to update or insert ename and remarks' });
  }
});





function formatDateFinal(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const convertToCSVNew = (leads) => {
  if (leads.length === 0) return '';

  const headers = Object.keys(leads[0]);
  const csvRows = [];

  // Add headers row
  csvRows.push(headers.join(','));

  // Add leads data rows
  for (const lead of leads) {
    const values = headers.map(header => {
      const escaped = ('' + lead[header]).replace(/"/g, '\\"'); // Escape quotes
      return `"${escaped}"`; // Wrap each value in double quotes
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
};

router.post('/exportEmployeeLeads', async (req, res) => {
  const { selectedRows } = req.body;


  try {
    const leads = await CompanyModel.find({
      _id: { $in: selectedRows },
    }).lean(); // Use .lean() to get plain JavaScript objects

    // Remove any internal properties
    const cleanedLeads = leads.map(({ __v, ...lead }) => lead);

    // Convert leads to CSV and send as response
    const csv = convertToCSVNew(cleanedLeads);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="AssginedLeads_Employee.csv"`);
    res.status(200).send(csv);

  } catch (error) {
    console.error('Error exporting leads:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/exportEmployeeTeamLeads', async (req, res) => {
  const { selectedRows } = req.body;


  try {
    const leads = await TeamLeadsModel.find({
      _id: { $in: selectedRows },
    }).lean(); // Use .lean() to get plain JavaScript objects

    // Remove any internal properties
    const cleanedLeads = leads.map(({ __v, ...lead }) => lead);

    // Convert leads to CSV and send as response
    const csv = convertToCSVNew(cleanedLeads);


    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="AssginedTeamLeads_Employee.csv"`);
    res.status(200).send(csv);

  } catch (error) {
    console.error('Error exporting leads:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/exportLeads', async (req, res) => {
  try {
    const {
      selectedRows,
      isFilter,
      dataStatus,
      selectedStatus,
      lastExtractedStatus,
      selectedState,
      selectedNewCity,
      selectedBDEName,
      selectedAssignDate,
      selectedUploadedDate,
      selectedAdminName,
      selectedYear,
      monthIndex,
      selectedCompanyIncoDate,
      isSearching,
      searchText,
    } = req.body;

    let query = {};

    // Start with selectedRows if exporting specific leads
    if (selectedRows && selectedRows.length > 0) {
      query._id = { $in: selectedRows };
    }

    // Construct query object based on filters if any filters are applied
    if (isFilter) {
      if (selectedStatus) query.Status = selectedStatus;
      if (lastExtractedStatus) baseQuery.lastStatusOfExtractedEmployee = lastExtractedStatus;
      if (selectedState) query.State = selectedState;
      if (selectedNewCity) query.City = selectedNewCity;
      if (selectedAssignDate) {
        query.AssignDate = {
          $gte: new Date(selectedAssignDate).toISOString(),
          $lt: new Date(new Date(selectedAssignDate).setDate(new Date(selectedAssignDate).getDate() + 1)).toISOString()
        };
      }
      if (selectedAdminName && selectedAdminName.trim() !== '') {
        query.UploadedBy = new RegExp(`^${selectedAdminName.trim()}$`, 'i');
      }
      if (selectedUploadedDate) {
        query.UploaDate = {
          $gte: new Date(selectedUploadedDate).toISOString(),
          $lt: new Date(new Date(selectedUploadedDate).setDate(new Date(selectedUploadedDate).getDate() + 1)).toISOString()
        };
      }
      if (selectedYear) {
        if (monthIndex !== '0') {
          const year = parseInt(selectedYear);
          const month = parseInt(monthIndex) - 1; // JavaScript months are 0-indexed
          const monthStartDate = new Date(year, month, 1);
          const monthEndDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
          query["Company Incorporation Date  "] = {
            $gte: monthStartDate,
            $lt: monthEndDate
          };
        } else {
          const yearStartDate = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
          const yearEndDate = new Date(`${selectedYear}-12-31T23:59:59.999Z`);
          query["Company Incorporation Date  "] = {
            $gte: yearStartDate,
            $lt: yearEndDate
          };
        }
      }

      if (selectedCompanyIncoDate) {

        const selectedDate = new Date(selectedCompanyIncoDate);
        const isEpochDate = selectedDate.getTime() === new Date('1970-01-01T00:00:00Z').getTime();

        if (isEpochDate) {

          // If the selected date is 01/01/1970, find documents with null "Company Incorporation Date"
          query["Company Incorporation Date  "] = null;
        } else {
          // Otherwise, use the selected date to find documents within that day
          query["Company Incorporation Date  "] = {
            $gte: new Date(selectedDate).toISOString(),
            $lt: new Date(new Date(selectedDate).setDate(selectedDate.getDate() + 1)).toISOString()
          };
        }
      }

      // Apply data status filters
      if (dataStatus === 'Unassigned') {
        query.ename = 'Not Alloted';
      } else if (dataStatus === 'Assigned') {
        query.ename = { $nin: ['Not Alloted', "Extracted"] };
      } else if (dataStatus === 'Extracted') {
        query.ename = "Extracted"
      }
    }

    // Apply search query if isSearching is true
    if (isSearching && searchText) {
      const searchTerm = searchText.trim();
      if (!isNaN(searchTerm)) {
        // Search by companyNumber if the query is a number
        query['Company Number'] = searchTerm;
      } else {
        // Escape special characters for regex search
        const escapedSearchTerm = escapeRegex(searchTerm);

        // Otherwise, perform a regex search on specified fields
        query.$or = [
          { 'Company Name': { $regex: new RegExp(escapedSearchTerm, 'i') } },
          { 'Company Email': { $regex: new RegExp(escapedSearchTerm, 'i') } }
          // Add other fields you want to search with the query here
          // For example: { anotherField: { $regex: new RegExp(escapedSearchTerm, 'i') } }
        ];
      }
    }
    // Add selectedBDEName filter
    if (selectedBDEName && selectedBDEName.trim() !== '') {
      query.ename = new RegExp(`^${selectedBDEName.trim()}$`, 'i');
    }
    // Query to get the leads to be exported
    const leads = await CompanyModel.find(query).lean();
    const tempLeads = leads.map(lead => {
      if (lead.AssignDate && lead["Company Incorporation Date  "]) {
        lead.AssignDate = formatDateFinal(lead.AssignDate);
        lead["Company Incorporation Date  "] = formatDateFinal(lead["Company Incorporation Date  "]);
      }
      const {
        Remarks,
        lastActionDate,
        bdmAcceptStatus,
        bdeForwardDate,
        bdeOldStatus,
        feedbackPoints,
        feedbackRemarks,
        bdeNextFollowUpDate,
        multiBdmName,
        bdmRemarks,
        bdmStatusChangeDate,
        bdmStatusChangeTime,
        RevertBackAcceptedCompanyRequest,
        isDeletedEmployeeCompany,
        __v,
        _id,
        ...filteredLeads
      } = lead;
      return filteredLeads;
    });

    //console.log("leads", tempLeads);

    // Convert leads to CSV and send as response
    const csv = convertToCSV(tempLeads);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${dataStatus === 'Assigned' ? 'AssignedLeads_Admin.csv' : 'UnAssignedLeads_Admin.csv'}`);
    res.status(200).send(csv);
  } catch (error) {
    console.error('Error exporting leads:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




router.post("/manual", async (req, res) => {
  const receivedData = req.body;


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

// router.get('/getIds', async (req, res) => {
//   try {
//     const { dataStatus } = req.query;

//     let query = {};
//     if (dataStatus === 'Unassigned') {
//       query = { ename: 'Not Alloted' };
//     } else if (dataStatus === 'Assigned') {
//       query = { ename: { $ne: 'Not Alloted' } };
//     }

//     // Query the collection to get only the _id fields
//     const getId = await CompanyModel.find(query, '_id');

//     // Extract the _id values into an array
//     const allIds = getId.map(doc => doc._id);

//     // Send the array of IDs as a response
//     res.status(200).json(allIds);
//   } catch (error) {
//     console.error('Error fetching IDs:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });
// router.get('/getIds', async (req, res) => {
//   try {
//     const {
//       dataStatus,
//       selectedStatus,
//       selectedState,
//       selectedNewCity,
//       selectedBDEName,
//       selectedAssignDate,
//       selectedUploadedDate,
//       selectedAdminName,
//       selectedYear,
//       selectedCompanyIncoDate
//     } = req.query;

//     let query = {};

//     // Construct query object based on filters
//     if (selectedStatus) query.Status = selectedStatus;
//     if (selectedState) query.State = selectedState;
//     if (selectedNewCity) query.City = selectedNewCity;
//     if (selectedAssignDate) {
//       query.AssignDate = {
//         $gte: new Date(selectedAssignDate).toISOString(),
//         $lt: new Date(new Date(selectedAssignDate).setDate(new Date(selectedAssignDate).getDate() + 1)).toISOString()
//       };
//     }
//     if (selectedAdminName && selectedAdminName.trim() !== '') {
//       query.UploadedBy = new RegExp(`^${selectedAdminName.trim()}$`, 'i');
//     }
//     if (selectedUploadedDate) {
//       query.UploadedDate = {
//         $gte: new Date(selectedUploadedDate).toISOString(),
//         $lt: new Date(new Date(selectedUploadedDate).setDate(new Date(selectedUploadedDate).getDate() + 1)).toISOString()
//       };
//     }
//     if (selectedYear) {
//       const yearStartDate = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
//       const yearEndDate = new Date(`${selectedYear}-12-31T23:59:59.999Z`);
//       query["Company Incorporation Date"] = {
//         $gte: yearStartDate,
//         $lt: yearEndDate
//       };
//     }
//     if (selectedCompanyIncoDate) {
//       query["Company Incorporation Date"] = {
//         $gte: new Date(selectedCompanyIncoDate).toISOString(),
//         $lt: new Date(new Date(selectedCompanyIncoDate).setDate(new Date(selectedCompanyIncoDate).getDate() + 1)).toISOString()
//       };
//     }

//     // Apply data status filters
//     if (dataStatus === 'Unassigned') {
//       query.ename = 'Not Alloted';
//     } else if (dataStatus === 'Assigned') {
//       query.ename = { $ne: 'Not Alloted' };
//     }

//     // Query the collection to get only the _id fields
//     const getId = await CompanyModel.find(query, '_id');

//     // Extract the _id values into an array
//     const allIds = getId.map(doc => doc._id);

//     // Send the array of IDs as a response
//     res.status(200).json(allIds);
//   } catch (error) {
//     console.error('Error fetching IDs:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

function escapeRegex(string) {
  return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

// router.get('/getIds', async (req, res) => {
//   try {
//     const {
//       dataStatus,
//       selectedStatus,
//       selectedState,
//       selectedNewCity,
//       selectedBDEName,
//       selectedAssignDate,
//       selectedUploadedDate,
//       selectedAdminName,
//       selectedYear,
//       monthIndex,
//       selectedCompanyIncoDate,
//       isFilter,
//       isSearching,
//       searchText
//     } = req.query;

//     let query = {};

//     // Construct query object based on filters
//     if (selectedStatus) query.Status = selectedStatus;
//     if (selectedState) query.State = selectedState;
//     if (selectedNewCity) query.City = selectedNewCity;
//     if (selectedAssignDate) {
//       query.AssignDate = {
//         $gte: new Date(selectedAssignDate).toISOString(),
//         $lt: new Date(new Date(selectedAssignDate).setDate(new Date(selectedAssignDate).getDate() + 1)).toISOString()
//       };
//     }
//     if (selectedAdminName && selectedAdminName.trim() !== '') {
//       query.UploadedBy = new RegExp(`^${selectedAdminName.trim()}$`, 'i');
//     }
//     if (selectedUploadedDate) {
//       query.UploadDate = {
//         $gte: new Date(selectedUploadedDate).toISOString(),
//         $lt: new Date(new Date(selectedUploadedDate).setDate(new Date(selectedUploadedDate).getDate() + 1)).toISOString()
//       };
//     }
//     if (selectedYear) {
//       if (monthIndex !== '0') {
//         const year = parseInt(selectedYear);
//         const month = parseInt(monthIndex) - 1; // JavaScript months are 0-indexed
//         const monthStartDate = new Date(year, month, 1);
//         const monthEndDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
//         query["Company Incorporation Date  "] = {
//           $gte: monthStartDate,
//           $lt: monthEndDate
//         };
//       } else {
//         const yearStartDate = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
//         const yearEndDate = new Date(`${selectedYear}-12-31T23:59:59.999Z`);
//         query["Company Incorporation Date  "] = {
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
//         query["Company Incorporation Date  "] = null;
//       } else {
//         // Otherwise, use the selected date to find documents within that day
//         query["Company Incorporation Date  "] = {
//           $gte: new Date(selectedDate).toISOString(),
//           $lt: new Date(new Date(selectedDate).setDate(selectedDate.getDate() + 1)).toISOString()
//         };
//       }
//     }

//     // Apply data status filters based on isFilter and isSearching
//     if (isFilter && dataStatus) {
//       if (dataStatus === 'Unassigned') {
//         query.ename = 'Not Alloted';
//       } else if (dataStatus === 'Assigned') {
//         query.ename = { $nin: ['Not Alloted', "Extracted"] };
//       } else if (dataStatus === "Extracted") {
//         query.ename = "Extracted"
//       }
//     }

//     // Apply search query if isSearching is true
//     if (isSearching && searchText) {
//       const searchTerm = searchText.trim();
//       if (!isNaN(searchTerm)) {
//         // Search by companyNumber if the query is a number
//         query['Company Number'] = searchTerm;
//       } else {
//         // Escape special characters for regex search
//         const escapedSearchTerm = escapeRegex(searchTerm);

//         // Otherwise, perform a regex search on specified fields
//         query.$or = [
//           { 'Company Name': { $regex: new RegExp(escapedSearchTerm, 'i') } },
//           { 'Company Email': { $regex: new RegExp(escapedSearchTerm, 'i') } }
//           // Add other fields you want to search with the query here
//           // For example: { anotherField: { $regex: new RegExp(escapedSearchTerm, 'i') } }
//         ];
//       }
//     }

//     // Add selectedBDEName filter
//     if (selectedBDEName && selectedBDEName.trim() !== '') {
//       query.ename = new RegExp(`^${selectedBDEName.trim()}$`, 'i');
//     }

//     // Query the collection to get only the _id fields
//     const getId = await CompanyModel.find(query, '_id');
//     //console.log("getId", getId)

//     // Extract the _id values into an array
//     const allIds = getId.map(doc => doc._id);

//     // If there's no search or filter query, send all IDs
//     if (!isFilter && !isSearching) {
//       res.status(200).json(allIds);
//       return;
//     }

//     // Fetch assigned and unassigned data if search or filter query exists
//     let assignedData = [];
//     let assignedCount = 0;
//     let unassignedData = [];
//     let unassignedCount = 0;
//     let extractedData = [];
//     let extractedDataCount = 0;
//     const limit = 500;

//     if (isFilter || isSearching) {

//       let extractedQuery = { ...query, ename: "Extracted" }
//       extractedDataCount = await CompanyModel.countDocuments(extractedQuery);
//       extractedData = await CompanyModel.find(extractedQuery).lean();

//       // Fetch assigned data
//       let assignedQuery = { ...query, ename: { $ne: "Not Alloted" } };
//       assignedCount = await CompanyModel.countDocuments(assignedQuery);
//       assignedData = await CompanyModel.find(assignedQuery).lean();

//       // Fetch unassigned data
//       if (!selectedBDEName || selectedBDEName.trim() === '') {
//         let unassignedQuery = { ...query, ename: 'Not Alloted' };
//         unassignedCount = await CompanyModel.countDocuments(unassignedQuery);
//         unassignedData = await CompanyModel.find(unassignedQuery).lean();
//       }
//     }

//     // console.log("query", query)
//     // console.log(allIds)

//     res.status(200).json({
//       allIds,
//       assigned: assignedData,
//       unassigned: unassignedData,
//       extracted: extractedData,
//       totalAssigned: assignedCount,
//       totalUnassigned: unassignedCount,
//       extractedDataCount: extractedDataCount,
//       totalPages: Math.ceil((assignedCount + unassignedCount) / limit),
//     });
//   } catch (error) {
//     console.error('Error fetching IDs:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

router.get('/getIds', async (req, res) => {
  try {
    const {
      dataStatus,
      selectedStatus,
      lastExtractedStatus,
      selectedState,
      selectedNewCity,
      selectedBDEName,
      selectedAssignDate,
      selectedUploadedDate,
      selectedAdminName,
      selectedYear,
      monthIndex,
      selectedCompanyIncoDate,
      isFilter,
      isSearching,
      searchText
    } = req.query;

    // Construct the main query object
    let query = {};

    // Apply filters if specified
    if (selectedStatus) query.Status = selectedStatus;
    if (lastExtractedStatus) baseQuery.lastStatusOfExtractedEmployee = lastExtractedStatus;
    if (selectedState) query.State = selectedState;
    if (selectedNewCity) query.City = selectedNewCity;
    if (selectedAssignDate) {
      const assignDate = new Date(selectedAssignDate);
      query.AssignDate = {
        $gte: assignDate.toISOString(),
        $lt: new Date(assignDate.setDate(assignDate.getDate() + 1)).toISOString(),
      };
    }
    if (selectedAdminName && selectedAdminName.trim() !== '') {
      query.UploadedBy = new RegExp(`^${selectedAdminName.trim()}$`, 'i');
    }
    if (selectedUploadedDate) {
      const uploadDate = new Date(selectedUploadedDate);
      query.UploadDate = {
        $gte: uploadDate.toISOString(),
        $lt: new Date(uploadDate.setDate(uploadDate.getDate() + 1)).toISOString(),
      };
    }
    if (selectedYear) {
      if (monthIndex !== '0') {
        const year = parseInt(selectedYear);
        const month = parseInt(monthIndex) - 1;
        query["Company Incorporation Date  "] = {
          $gte: new Date(year, month, 1),
          $lt: new Date(year, month + 1, 0, 23, 59, 59, 999),
        };
      } else {
        query["Company Incorporation Date  "] = {
          $gte: new Date(`${selectedYear}-01-01T00:00:00.000Z`),
          $lt: new Date(`${selectedYear}-12-31T23:59:59.999Z`),
        };
      }
    }
    if (selectedCompanyIncoDate) {
      const selectedDate = new Date(selectedCompanyIncoDate);
      const isEpochDate = selectedDate.getTime() === new Date('1970-01-01T00:00:00Z').getTime();
      query["Company Incorporation Date  "] = isEpochDate
        ? null
        : {
          $gte: selectedDate.toISOString(),
          $lt: new Date(selectedDate.setDate(selectedDate.getDate() + 1)).toISOString(),
        };
    }

    // Apply data status filters
    if (isFilter && dataStatus) {
      query.ename = dataStatus === 'Unassigned'
        ? 'Not Alloted'
        : dataStatus === 'Assigned'
          ? { $nin: ['Not Alloted', 'Extracted'] }
          : 'Extracted';
    }

    // Search query if searching is true
    if (isSearching && searchText) {
      const searchTerm = searchText.trim();
      if (!isNaN(searchTerm)) {
        query['Company Number'] = searchTerm;
      } else {
        const escapedSearchTerm = escapeRegex(searchTerm);
        query.$or = [
          { 'Company Name': { $regex: new RegExp(escapedSearchTerm, 'i') } },
          { 'Company Email': { $regex: new RegExp(escapedSearchTerm, 'i') } },
        ];
      }
    }

    // Filter by BDE Name if specified
    if (selectedBDEName && selectedBDEName.trim() !== '') {
      query.ename = new RegExp(`^${selectedBDEName.trim()}$`, 'i');
    }

    // Query for just the _id field initially for all IDs
    const getId = await CompanyModel.find(query, '_id').lean();
    const allIds = getId.map(doc => doc._id);

    // Return all IDs if no search or filter applied
    if (!isFilter && !isSearching) {
      return res.status(200).json(allIds);
    }

    // Fetch assigned, unassigned, and extracted data with counts
    const fetchDataByType = async (additionalQuery) =>
      CompanyModel.find({ ...query, ...additionalQuery }).limit(500).lean();

    const countDocumentsByType = async (additionalQuery) =>
      CompanyModel.countDocuments({ ...query, ...additionalQuery });

    const [extractedData, assignedData, unassignedData] = await Promise.all([
      fetchDataByType({ ename: 'Extracted' }),
      fetchDataByType({ ename: { $ne: 'Not Alloted' } }),
      fetchDataByType(!selectedBDEName ? { ename: 'Not Alloted' } : {}),
    ]);

    const [extractedDataCount, assignedCount, unassignedCount] = await Promise.all([
      countDocumentsByType({ ename: 'Extracted' }),
      countDocumentsByType({ ename: { $ne: 'Not Alloted' } }),
      countDocumentsByType(!selectedBDEName ? { ename: 'Not Alloted' } : {}),
    ]);

    res.status(200).json({
      allIds,
      assigned: assignedData,
      unassigned: unassignedData,
      extracted: extractedData,
      totalAssigned: assignedCount,
      totalUnassigned: unassignedCount,
      extractedDataCount: extractedDataCount,
      totalPages: Math.ceil((assignedCount + unassignedCount) / 500),
    });
  } catch (error) {
    console.error('Error fetching IDs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/getIdsleadinterestedleads', async (req, res) => {
  try {
    const {
      dataStatus,
      selectedStatus,
      selectedState,
      selectedNewCity,
      selectedBDEName,
      selectedAssignDate,
      selectedUploadedDate,
      selectedAdminName,
      selectedYear,
      monthIndex,
      selectedCompanyIncoDate,
      isFilter,
      isSearching,
      searchText
    } = req.query;

    // Construct the main query object
    let query = {};
    const leadHistoryCompany = await LeadHistoryForInterestedandFollowModel.distinct('Company Name');

    // Apply filters if specified
    if (selectedStatus) query.Status = selectedStatus;
    if (selectedState) query.State = selectedState;
    if (selectedNewCity) query.City = selectedNewCity;
    if (selectedAssignDate) {
      const assignDate = new Date(selectedAssignDate);
      query.AssignDate = {
        $gte: assignDate.toISOString(),
        $lt: new Date(assignDate.setDate(assignDate.getDate() + 1)).toISOString(),
      };
    }
    if (selectedAdminName && selectedAdminName.trim() !== '') {
      query.UploadedBy = new RegExp(`^${selectedAdminName.trim()}$`, 'i');
    }
    if (selectedUploadedDate) {
      const uploadDate = new Date(selectedUploadedDate);
      query.UploadDate = {
        $gte: uploadDate.toISOString(),
        $lt: new Date(uploadDate.setDate(uploadDate.getDate() + 1)).toISOString(),
      };
    }
    if (selectedYear) {
      if (monthIndex !== '0') {
        const year = parseInt(selectedYear);
        const month = parseInt(monthIndex) - 1;
        query["Company Incorporation Date  "] = {
          $gte: new Date(year, month, 1),
          $lt: new Date(year, month + 1, 0, 23, 59, 59, 999),
        };
      } else {
        query["Company Incorporation Date  "] = {
          $gte: new Date(`${selectedYear}-01-01T00:00:00.000Z`),
          $lt: new Date(`${selectedYear}-12-31T23:59:59.999Z`),
        };
      }
    }
    if (selectedCompanyIncoDate) {
      const selectedDate = new Date(selectedCompanyIncoDate);
      const isEpochDate = selectedDate.getTime() === new Date('1970-01-01T00:00:00Z').getTime();
      query["Company Incorporation Date  "] = isEpochDate
        ? null
        : {
          $gte: selectedDate.toISOString(),
          $lt: new Date(selectedDate.setDate(selectedDate.getDate() + 1)).toISOString(),
        };
    }

    // Apply data status filters
    if (isFilter && dataStatus) {
      query.ename = dataStatus === 'Unassigned'
        ? 'Not Alloted'
        : dataStatus === 'Assigned'
          ? { $nin: ['Not Alloted', 'Extracted'] }
          : 'Extracted';
    }

    // Search query if searching is true
    if (isSearching && searchText) {
      const searchTerm = searchText.trim();
      if (!isNaN(searchTerm)) {
        query['Company Number'] = searchTerm;
      } else {
        const escapedSearchTerm = escapeRegex(searchTerm);
        query.$or = [
          { 'Company Name': { $regex: new RegExp(escapedSearchTerm, 'i') } },
          { 'Company Email': { $regex: new RegExp(escapedSearchTerm, 'i') } },
        ];
      }
    }

    // Filter by BDE Name if specified
    if (selectedBDEName && selectedBDEName.trim() !== '') {
      query.ename = new RegExp(`^${selectedBDEName.trim()}$`, 'i');
    }

    // Add assignedData condition to the getId query
    const assignedDataCondition = {
      $and: [
        { ename: { $ne: 'Not Alloted' } },
        { ename: { $ne: 'Extracted' } },
        { Status: { $in: ['Interested', 'FollowUp'] } },
        { 'Company Name': { $in: leadHistoryCompany } }
      ]
    };

    // Query for just the _id field with the assignedData condition
    const getId = await CompanyModel.find({ ...query, ...assignedDataCondition }, '_id').lean();
    const allIds = getId.map(doc => doc._id);

    // Return all IDs if no search or filter applied
    if (!isFilter && !isSearching) {
      return res.status(200).json(allIds);
    }

    // Fetch assigned, unassigned, and extracted data with counts
    const fetchDataByType = async (additionalQuery) =>
      CompanyModel.find({ ...query, ...additionalQuery }).limit(500).lean();

    const countDocumentsByType = async (additionalQuery) =>
      CompanyModel.countDocuments({ ...query, ...additionalQuery });

    const [extractedData, assignedData, unassignedData] = await Promise.all([
      fetchDataByType({ ename: 'Extracted' }),
      fetchDataByType(assignedDataCondition),
      fetchDataByType(!selectedBDEName ? { ename: 'Not Alloted' } : {}),
    ]);

    const [extractedDataCount, assignedCount, unassignedCount] = await Promise.all([
      countDocumentsByType({ ename: 'Extracted' }),
      countDocumentsByType(assignedDataCondition),
      countDocumentsByType(!selectedBDEName ? { ename: 'Not Alloted' } : {}),
    ]);

    res.status(200).json({
      allIds,
      assigned: assignedData,
      unassigned: unassignedData,
      extracted: extractedData,
      totalAssigned: assignedCount,
      totalUnassigned: unassignedCount,
      extractedDataCount: extractedDataCount,
      totalPages: Math.ceil((assignedCount + unassignedCount) / 500),
    });
  } catch (error) {
    console.error('Error fetching IDs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post("/fetch-by-ids", async (req, res) => {
  const { ids } = req.body;
  try {
    const data = await CompanyModel.find({ _id: { $in: ids } }).lean();
    res.status(200).json(data);

  } catch (error) {
    console.error('Error fetching data by IDs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})




// router.post("/postAssignData", async (req, res) => {
//   const { employeeSelection, selectedObjects, title, date, time } = req.body;

//   // If not assigned, post data to MongoDB or perform any desired action
//   const updatePromises = selectedObjects.map((obj) => {
//     // Add AssignData property with the current date
//     const updatedObj = {
//       ...obj,
//       ename: employeeSelection,
//       AssignDate: new Date(),
//     };

//     return CompanyModel.updateOne({ _id: obj._id }, updatedObj);
//   });

//   // Add the recent update to the RecentUpdatesModel
//   const newUpdate = new RecentUpdatesModel({
//     title: title,
//     date: date,
//     time: time,
//   });
//   await newUpdate.save();

//   // Execute all update promises
//   await Promise.all(updatePromises);

//   res.json({ message: "Data posted successfully" });
// });

const mongoose = require('mongoose');
const RemarksHistory = require('../models/RemarksHistory.js');
const DeletedLeadsModel = require('../models/DeletedLeadsModel.js');
const LeadHistoryForInterestedandFollowModel = require('../models/LeadHistoryForInterestedandFollow.js');
const CompleteRemarksHistoryLeads = require('../models/CompleteRemarksHistoryLeads.js');

router.post("/postAssignData", async (req, res) => {
  const { employeeSelection, selectedObjects, title, date, time } = req.body;
  const socketIO = req.io;
  const dataSize = selectedObjects.length;
  // Helper function to perform bulk operations in parallel
  const executeBulkOperations = async (model, operations, batchSize = 100) => {
    for (let i = 0; i < operations.length; i += batchSize) {
      const batch = operations.slice(i, i + batchSize);
      await model.bulkWrite(batch);
    }
  };


  // Bulk operations for CompanyModel
  const bulkOperationsCompany = selectedObjects.map((obj) => {
    const updateOperation = {
      updateOne: {
        filter: { _id: obj._id },
        update: {
          $set: {
            ename: employeeSelection,
            AssignDate: new Date(),
            bdmAcceptStatus: "NotForwarded",
            feedbackPoints: [],
            multiBdmName: [],
            Status: "Untouched",
            extractedMultipleBde: obj.extractedMultipleBde || [],
          },
          $unset: {
            bdmName: "",
            bdeOldStatus: "",
            bdeForwardDate: "",
            bdmStatusChangeDate: "",
            bdmStatusChangeTime: "",
            bdmRemarks: "",
            RevertBackAcceptedCompanyRequest: "",
            Remarks: "",
          },
        },
      },
    };

    // Conditionally set `isDeletedEmployeeCompany` only if `obj.Status` is "Matured"
    if (obj.Status === "Matured") {
      updateOperation.updateOne.update.$set.isDeletedEmployeeCompany = true;
    }

    return updateOperation;
  });




  // Bulk operations for TeamLeadsModel
  const bulkOperationsTeamLeads = selectedObjects.map((obj) => ({
    deleteOne: {
      filter: { _id: obj._id }
    }
  }));

  // Bulk operations for FollowUpModel
  const bulkOperationsProjection = selectedObjects.map((obj) => ({
    deleteOne: {
      filter: { companyName: obj["Company Name"] }
    }
  }));

  // Bulk operations for LeadHistoryModel
  const bulkOperationsLeadHistory = selectedObjects.map((obj) => ({
    deleteOne: {
      filter: { "Company Name": obj["Company Name"] }
    }
  }));

  // Bulk operations for RedesignedLeadformModel
  const bulkOperationsRedesignedModel = selectedObjects.map((obj) => ({
    updateOne: {
      filter: { "Company Name": obj["Company Name"] },
      update: {
        $set: {
          isDeletedEmployeeCompany: true,
        }
      }
    }
  }));

  const bulkOperationsRemarksHistory = selectedObjects.map((obj) => ({
    deleteOne: {
      filter: { companyName: obj["Company Name"] }
    }
  }));


  try {
    // Perform bulk operations in parallel
    await Promise.all([
      executeBulkOperations(CompanyModel, bulkOperationsCompany),
      executeBulkOperations(TeamLeadsModel, bulkOperationsTeamLeads),
      executeBulkOperations(LeadHistoryForInterestedandFollowModel, bulkOperationsLeadHistory),
      executeBulkOperations(FollowUpModel, bulkOperationsProjection),
      executeBulkOperations(RedesignedLeadformModel, bulkOperationsRedesignedModel),
      executeBulkOperations(RemarksHistory, bulkOperationsRemarksHistory)
    ]);
    //socketIO.emit('data-assigned', { name: employeeSelection, length: dataSize });
    // Create a new entry in RecentUpdatesModel for each selected object
    const updatePromises = selectedObjects.map(async (obj) => {
      const existingUpdate = await RecentUpdatesModel.findOne({ "Company Name": obj["Company Name"] });
      if (!existingUpdate) {
        const newUpdate = new RecentUpdatesModel({
          _id: obj._id,
          title,
          "Company Name": obj["Company Name"],
          ename: employeeSelection,
          oldStatus: "Untouched",
          newStatus: "Untouched",
          properDate: new Date(),
          date,
          time
        });
        await newUpdate.save();
      }
    });

    await Promise.all(updatePromises);

    res.json({ message: "Data posted successfully" });
  } catch (error) {
    console.error("Error posting assign data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/postExtractedData", async (req, res) => {
  const { employeeSelection, selectedObjects, title, date, time } = req.body;
  const socketIO = req.io;
  const dataSize = selectedObjects.length;

  // Helper function to perform bulk operations in parallel
  const executeBulkOperations = async (model, operations, batchSize = 100) => {
    for (let i = 0; i < operations.length; i += batchSize) {
      const batch = operations.slice(i, i + batchSize);
      await model.bulkWrite(batch);
    }
  };


  const bulkOperationsCompany = selectedObjects.map((obj) => ({
    updateOne: {
      filter: { _id: obj._id },
      update: {
        $set: {
          ename: 'Extracted',
          AssignDate: new Date(),
          bdmAcceptStatus: "NotForwarded",
          feedbackPoints: [],
          //multiBdmName: [],
          Status: "Untouched",
          lastStatusOfExtractedEmployee: obj.Status,
          isDeletedEmployeeCompany: obj.Status === "Matured",
          extractedMultipleBde: obj.extractedMultipleBde && Array.isArray(obj.extractedMultipleBde)
            ? [...obj.extractedMultipleBde, obj.ename]
            : [obj.ename],
          lastAssignedEmployee: obj.ename,
          extractedDate: new Date()
        },
        $unset: {
          //bdmName: "",
          bdeOldStatus: "",
          bdeForwardDate: "",
          bdmStatusChangeDate: "",
          bdmStatusChangeTime: "",
          bdmRemarks: "",
          RevertBackAcceptedCompanyRequest: ""
        }
      }
    }
  }));
  //console.log("bulkOperationsCompany", bulkOperationsCompany);
  const bulkOperationsTeamLeads = selectedObjects.map((obj) => ({
    deleteOne: {
      filter: { _id: obj._id }
    }
  }));

  // Bulk operations for FollowUpModel
  const bulkOperationsProjection = selectedObjects.map((obj) => ({
    deleteOne: {
      filter: { companyName: obj["Company Name"] }
    }
  }));

  // Bulk operations for RedesignedLeadformModel
  const bulkOperationsRedesignedModel = selectedObjects.map((obj) => ({
    updateOne: {
      filter: { "Company Name": obj["Company Name"] },
      update: {
        $set: {
          isDeletedEmployeeCompany: true,
        }
      }
    }
  }));

  try {
    // Perform bulk operations in parallel
    await Promise.all([
      executeBulkOperations(CompanyModel, bulkOperationsCompany),
      executeBulkOperations(TeamLeadsModel, bulkOperationsTeamLeads),
      executeBulkOperations(FollowUpModel, bulkOperationsProjection),
      executeBulkOperations(RedesignedLeadformModel, bulkOperationsRedesignedModel)
    ]);
    //socketIO.emit('data-assigned', { name: employeeSelection, length: dataSize });
    // Process each selectedObject to check and update/create entries in RecentUpdatesModel
    for (const obj of selectedObjects) {
      const existingUpdate = await RecentUpdatesModel.findOne({ "Company Name": obj["Company Name"] });

      if (existingUpdate) {
        // Update the title if the company already exists
        await RecentUpdatesModel.updateOne(
          { "Company Name": obj["Company Name"] },
          {
            $set:
            {
              title,
              date,
              time
            }
          }
        );
      } else {
        // Create a new entry if the company doesn't exist
        const newUpdate = new RecentUpdatesModel({
          "Company Name": obj["Company Name"],
          _id: obj._id,
          title,
          ename: obj.ename,
          oldStatus: obj.Status,
          newStatus: obj.Status,
          properDate: new Date(),
          date,
          time
        });
        await newUpdate.save();
      }
    }

    res.json({ message: "Data posted successfully" });
  } catch (error) {
    console.error("Error posting assign data:", error);
    res.status(500).json({ error: "Internal server error" });
  }

})


// router.delete("/deleteAdminSelectedLeads", async (req, res) => {
//   const { selectedRows } = req.body;
//   console.log("selectedrows", selectedRows)
//   try {
//     // Use Mongoose to delete rows by their IDs
//     const response = await CompanyModel.deleteMany({ _id: { $in: selectedRows } });
//     const response2 = await TeamLeadsModel.deleteMany({ _id: { $in: selectedRows } })
//     const followModelResponse = await Promise.all(selectedRows.map(async (companyId) => {
//       const company = await CompanyModel.findById(companyId);
//       if (company) {
//         // Find and delete documents from followmodel collection based on company name
//         return FollowUpModel.deleteOne({ companyName: company['Company Name'] });
//       }
//       return null;
//     }));
//     //console.log(response)
//     res.status(200).json({
//       message:
//         "Rows deleted successfully and backup created successfully.",
//     });

//     // Trigger backup on the server
//     // exec(
//     //   `mongodump --db AdminTable --collection newcdatas --out ${process.env.BACKUP_PATH}`,
//     //   (error, stdout, stderr) => {
//     //     if (error) {
//     //       console.error("Error creating backup:", error);
//     //       // Respond with an error if backup fails
//     //       res.status(500).json({ error: "Error creating backup." });
//     //     } else {
//     //       // console.log("Backup created successfully:", stdout);
//     //       // Respond with success message if backup is successful
//     //       res.status(200).json({
//     //         message:
//     //           "Rows deleted successfully and backup created successfully.",
//     //       });
//     //     }
//     //   }
//     // );
//   } catch (error) {
//     console.error("Error deleting rows:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
router.delete("/deleteAdminSelectedLeads", async (req, res) => {
  const { selectedRows } = req.body;


  try {
    // Step 1: Find the documents to be deleted
    const companiesToDelete = await CompanyModel.find({ _id: { $in: selectedRows } });

    // Step 2: Create entries in DeletedLeadsModel with the same data
    const deletedLeads = companiesToDelete.map(company => ({
      ...company.toObject(), // Copy the company data
      deletedAt: new Date(), // Add a timestamp of deletion
    }));

    if (deletedLeads.length > 0) {
      await DeletedLeadsModel.insertMany(deletedLeads); // Insert multiple documents
    }

    // Step 3: Perform deletion from CompanyModel
    await CompanyModel.deleteMany({ _id: { $in: selectedRows } });

    // Optional: Perform other deletions or updates as needed
    await TeamLeadsModel.deleteMany({ _id: { $in: selectedRows } });

    const followModelResponse = await Promise.all(selectedRows.map(async (companyId) => {
      const company = await CompanyModel.findById(companyId);
      if (company) {
        return FollowUpModel.deleteOne({ companyName: company['Company Name'] });
      }
      return null;
    }));

    res.status(200).json({
      message: "Rows deleted successfully and backup created successfully.",
    });
  } catch (error) {
    console.error("Error deleting rows:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/deletedLeadsComplete", async (req, res) => {
  try {
    const deletedLeads = await DeletedLeadsModel.find(); // Fetch data from the DeletedLeadsModel
    res.status(200).json(deletedLeads); // Send the fetched data in the response
  } catch (error) {
    console.log("Error fetching Deleted Leads", error);
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