var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
const moment = require('moment');
dotenv.config();

const adminModel = require("../models/Admin.js");
const DeletedEmployeeModel = require("../models/DeletedEmployee.js");
const CompanyModel = require("../models/Leads.js");
const ReDesignedLeadFormModel = require("../models/RedesignedLeadform.js");
const FollowUpModel = require('../models/FollowUp.js');
const RemarksHistory = require("../models/RemarksHistory");
const TeamLeadsModel = require("../models/TeamLeads.js");
const RequestMaturedModel = require("../models/RequestMatured.js");
const InformBDEModel = require("../models/InformBDE.js");
const LeadHistoryForInterestedandFollowModel = require('../models/LeadHistoryForInterestedandFollow.js');
const { Socket } = require('dgram');



router.get("/teamleadsdata", async (req, res) => {
  try {
    const data = await TeamLeadsModel.find()
    res.status(200).send(data)

  } catch (error) {
    console.log("error fetching team leads data", error.message)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.post("/forwardtobdmdata", async (req, res) => {
  const {
    selectedData,
    bdmName,
    companyId,
    bdmAcceptStatus,
    bdeForwardDate,
    bdeOldStatus,
    companyName,
  } = req.body;
  //console.log("selectedData", selectedData);
  //console.log(companyName)
  try {
    // Assuming TeamLeadsModel has a schema similar to the selectedData structure
    const newLeads = await Promise.all(
      selectedData.map(async (data) => {
        const newData = {
          ...data,
          bdmName,
          bdeForwardDate: new Date(bdeForwardDate),
        }; // Add bdmName to each data object
        return await TeamLeadsModel.create(newData);
      })
    );

    await CompanyModel.findByIdAndUpdate(
      { _id: companyId },
      {
        bdmAcceptStatus: bdmAcceptStatus,
        bdeForwardDate: new Date(bdeForwardDate),
        bdeOldStatus: bdeOldStatus,
        bdmName: bdmName,
        bdmStatus: "Untouched"
      }

    );
    res.status(201).json(newLeads);
  } catch (error) {
    console.error("Error creating new leads:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// router.get("/forwardedbybdedata/:bdmName", async (req, res) => {
//   const bdmName = req.params.bdmName;

//   try {
//     // Fetch data using lean queries to retrieve plain JavaScript objects
//     const data = await TeamLeadsModel.find({
//       bdmName: bdmName,
//     }).lean();

//     res.send(data);
//   } catch (error) {
//     console.error("Error fetching data:", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// router.get('/filter-employee-team-leads/:bdmName', async (req, res) => {
//   const bdmName = req.params.bdmName;
//   const {
//     selectedStatus,
//     selectedState,
//     selectedNewCity,
//     selectedAssignDate,
//     selectedCompanyIncoDate,
//     selectedYear,
//     monthIndex,
//   } = req.query;

//   const page = parseInt(req.query.page) || 1; // Page number

//   try {
//     let baseQuery = { bdmName }; // Start the query with bdmName filter

//     // Ensure the query is filtered by employeeName
//     if (employeeName) {
//       baseQuery.$or = [
//         { ename: employeeName }
//       ];

//       if (selectedStatus === 'Matured') {
//         baseQuery.$or.push(
//           { multiBdmName: { $in: [employeeName] } },
//           { maturedBdmName: employeeName }
//         );
//       }
//     }

//     // Add other filters only if employeeName is present
//     if (selectedStatus) baseQuery.Status = selectedStatus;
//     if (selectedState) baseQuery.State = selectedState;
//     if (selectedNewCity) baseQuery.City = selectedNewCity;
//     if (selectedAssignDate) {
//       baseQuery.AssignDate = {
//         $gte: new Date(selectedAssignDate).toISOString(),
//         $lt: new Date(new Date(selectedAssignDate).setDate(new Date(selectedAssignDate).getDate() + 1)).toISOString()
//       };
//     }
//     if (selectedYear) {
//       if (monthIndex !== '0') {
//         const year = parseInt(selectedYear);
//         const month = parseInt(monthIndex) - 1; // JavaScript months are 0-indexed
//         const monthStartDate = new Date(year, month, 1);
//         const monthEndDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
//         baseQuery["Company Incorporation Date"] = {
//           $gte: monthStartDate,
//           $lt: monthEndDate
//         };
//       } else {
//         const yearStartDate = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
//         const yearEndDate = new Date(`${selectedYear}-12-31T23:59:59.999Z`);
//         baseQuery["Company Incorporation Date"] = {
//           $gte: yearStartDate,
//           $lt: yearEndDate
//         };
//       }
//     }
//     if (selectedCompanyIncoDate) {
//       baseQuery["Company Incorporation Date"] = {
//         $gte: new Date(selectedCompanyIncoDate).toISOString(),
//         $lt: new Date(new Date(selectedCompanyIncoDate).setDate(new Date(selectedCompanyIncoDate).getDate() + 1)).toISOString()
//       };
//     }

//     console.log("Base Query:", JSON.stringify(baseQuery, null, 2));

//     const data = await TeamLeadsModel.find(baseQuery).lean();

//     console.log("Data Retrieved:", data);

//     res.status(200).json(data);
//   } catch (error) {
//     console.error('Error searching leads:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// router.get("/filter-employee-team-leads/:bdmName", async (req, res) => {
//   const bdmName = req.params.bdmName;
//   const {
//     selectedStatus,
//     selectedState,
//     selectedNewCity,
//     selectedBdeForwardDate,
//     selectedCompanyIncoDate,
//     selectedYear,
//     monthIndex,
//   } = req.query;
// console.log(selectedBdeForwardDate)
//   try {
//     // Start with the required bdmName filter
//     let baseQuery = { bdmName };

//     // Add additional filters if they are present
//     if (selectedStatus) baseQuery.bdmStatus = selectedStatus;

//     if (selectedState) baseQuery.State = selectedState;

//     if (selectedNewCity) baseQuery.City = selectedNewCity;

//     if (selectedBdeForwardDate) {
//       const startOfDay = new Date(selectedBdeForwardDate);
//       startOfDay.setHours(0, 0, 0, 0); // Set to midnight local time

//       const endOfDay = new Date(selectedBdeForwardDate);
//       endOfDay.setHours(23, 59, 59, 999); // Set to the end of the day local time

//       baseQuery.bdeForwardDate = {
//           $gte: startOfDay,
//           $lt: endOfDay
//       };
//   }

//     if (selectedYear) {
//       if (monthIndex !== '0') {
//         const year = parseInt(selectedYear);
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
//       baseQuery["Company Incorporation Date  "] = {
//         $gte: new Date(selectedCompanyIncoDate).toISOString(),
//         $lt: new Date(new Date(selectedCompanyIncoDate).setDate(new Date(selectedCompanyIncoDate).getDate() + 1)).toISOString()
//       };
//     }

//     console.log("Base Query:", JSON.stringify(baseQuery, null, 2));

//     const data = await TeamLeadsModel.find(baseQuery).lean();

//     console.log("Data Retrieved:", data);

//     res.send(data);
//   } catch (error) {
//     console.error("Error fetching data:", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

router.get("/forwardedbybdedata/:bdmName", async (req, res) => {
  const bdmName = req.params.bdmName;

  try {
    // Fetch data using lean queries to retrieve plain JavaScript objects
    const teamLeadsData = await TeamLeadsModel.find({
      bdmName: bdmName,
    }).lean();

    //console.log("teamLeads" , teamLeadsData)

    // Fetch the related company data from newcdatas collection
    const companyNames = teamLeadsData.map((lead) => lead["Company Name"]).filter(Boolean); // Remove any undefined or null values
    const enames = teamLeadsData.map((lead) => lead.ename);

    // Ensure that "Company Name" is being selected properly
    const newcdatasData = await CompanyModel.find({
      "Company Name": { $in: companyNames },
    }).select({ "Company Name": 1, isDeletedEmployeeCompany: 1 });

    const employee = await adminModel.find({
      ename: { $in: enames },
    }).select({ email: 1, ename: 1 });

    //console.log("ename", employee);

    // Create a lookup object for "Company Name" to isDeletedEmployeeCompany mapping
    const companyLookup = {};
    newcdatasData.forEach((company) => {
      if (company["Company Name"]) {
        companyLookup[company["Company Name"]] = company.isDeletedEmployeeCompany;
      }
    });

    const emailLookup = {};
    employee.forEach((emp) => {
      if (emp.ename) {
        emailLookup[emp.ename] = emp.email;
      }
    });

    //console.log("companylookup", companyLookup);

    // Update team leads data based on lookup, add isDeletedEmployeeCompany field if it doesn't exist
    for (const lead of teamLeadsData) {
      if (companyLookup.hasOwnProperty(lead["Company Name"])) {
        lead.isDeletedEmployeeCompany = companyLookup[lead["Company Name"]];
        lead.bdeEmail = emailLookup[lead.ename] || "";
      } else {
        lead.isDeletedEmployeeCompany = false; // Set default value if no matching company is found
        lead.bdeEmail = ""; // Set default value if no matching company is found
      }

      // Update the document in the TeamLeadsModel
      await TeamLeadsModel.updateOne(
        { _id: lead._id },
        {
          $set: {
            isDeletedEmployeeCompany: lead.isDeletedEmployeeCompany,
            bdeEmail: lead.bdeEmail,
          },
        }
      );
    }

    //console.log("teamleads", teamLeadsData);

    res.status(200).send(teamLeadsData);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// BDM Team Leads API :
router.get("/teamLeadsData/:bdmName", async (req, res) => {
  try {
    const { bdmName } = req.params;
    // const status = req.query.status;
    const state = req.query.state;
    const city = req.query.city;
    const searchQuery = req.query.searchQuery;
    const bdeForwardDate = req.query.bdeForwardDate;
    const incorporationDate = req.query.incorporationDate;
    const page = parseInt(req.query.page) || 1; // Page number
    const limit = parseInt(req.query.limit) || 500; // Default limit to 500

    // Calculate skip for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build common query object
    let commonQuery = {
      bdmName: bdmName,
    };

    // Add filters if provided
    if (searchQuery) {
      const isNumber = !isNaN(searchQuery);
      if (isNumber) {
        // Perform partial match by converting Company Number to string
        commonQuery.$expr = { $regexMatch: { input: { $toString: "$Company Number" }, regex: searchQuery, options: "i" } };
      } else {
        commonQuery["Company Name"] = { $regex: new RegExp(searchQuery, 'i') };
      }
    }
    if (state) commonQuery["State"] = state;
    if (city) commonQuery["City"] = city;
    if (bdeForwardDate) commonQuery["bdeForwardDate"] = { $gte: new Date(bdeForwardDate).toISOString() };
    if (incorporationDate) commonQuery["Company Incorporation Date"] = { $gte: new Date(incorporationDate).toISOString() };

    // Fetch paginated data for each status
    const [generalData, busyData, interestedData, maturedData, notInterestedData] = await Promise.all([
      CompanyModel.find({ ...commonQuery, bdmAcceptStatus: { $in: ["Pending", "MaturedPending", "Forwarded"] } })
        .sort({ bdeForwardDate: -1 })
        .skip(skip)
        .limit(limit),

      CompanyModel.find({
        ...commonQuery,
        bdmAcceptStatus: { $in: ["Accept", "MaturedAccepted"] },
        $or: [
          { Status: { $in: ["Busy", "Not Picked Up"] } },
          { bdmStatus: { $in: ["Busy", "Not Picked Up"] } },
        ],
      })
        .sort({ bdmStatusChangeDate: -1 }) // Sort by bdmStatusChangeDate descending
        .skip(skip) // Skip specified number of records
        .limit(limit), // Limit the number of records

      CompanyModel.find({
        ...commonQuery,
        $or: [
          // Condition for "Matured" status
          {
            $and: [
              { Status: { $in: ["Matured"] } },
              { bdmStatus: { $nin: ["Busy", "Not Picked Up"] } },
            ],
            bdmAcceptStatus: { $in: ["MaturedAccepted"] }
          },
          // Condition for "Interested" and "FollowUp" statuses
          {
            Status: { $in: ["Interested", "FollowUp"] },
            bdmAcceptStatus: { $in: ["Accept", "MaturedAccepted"] }
          }
        ]
      })
        .sort({ bdmStatusChangeDate: -1 })
        .skip(skip)
        .limit(limit),

      CompanyModel.find({ ...commonQuery, bdmAcceptStatus: { $in: ["Accept", "MaturedDone"] }, Status: "Matured" })
        .sort({ bdmStatusChangeDate: -1 })
        .skip(skip)
        .limit(limit),

      CompanyModel.find({
        ...commonQuery,
        bdmAcceptStatus: { $in: ["Accept", "MaturedAccepted"] },
        Status: { $in: ["Not Interested", "Junk"] },
        bdmStatus: { $ne: "Not Interested" } // Exclude records where bdmStatus is "Not Interested"
      })
        .sort({ bdmStatusChangeDate: -1 })
        .skip(skip)
        .limit(limit)
    ]);

    // Count total for each status category
    const [totalGeneral, totalBusy, totalInterested, totalMatured, totalNotInterested] = await Promise.all([
      CompanyModel.countDocuments({ ...commonQuery, bdmAcceptStatus: { $in: ["Pending", "MaturedPending", "Forwarded"] } }),

      // CompanyModel.countDocuments({ ...commonQuery, bdmAcceptStatus: { $in: ["Accept", "NotForwarded" , "MaturedAccepted"] }, Status: { $in: ["Busy", "Not Picked Up"] } }),
      CompanyModel.countDocuments({
        ...commonQuery,
        bdmAcceptStatus: { $in: ["Accept", "MaturedAccepted"] },
        $or: [
          { Status: { $in: ["Busy", "Not Picked Up"] } },
          { bdmStatus: { $in: ["Busy", "Not Picked Up"] } },
        ],
      }),

      // CompanyModel.countDocuments({ ...commonQuery, bdmAcceptStatus: "Accept", Status: { $in: ["Interested", "FollowUp"] } }),
      CompanyModel.countDocuments({
        ...commonQuery,
        $or: [
          // Condition for "Matured" status with specific bdmAcceptStatus values
          {
            $and: [
              { Status: { $in: ["Matured"] } },
              { bdmStatus: { $nin: ["Busy", "Not Picked Up"] } },
            ],
            bdmAcceptStatus: { $in: ["MaturedAccepted"] },
          },
          // Condition for "Interested" and "FollowUp" statuses with specific bdmAcceptStatus values
          {
            Status: { $in: ["Interested", "FollowUp"] },
            bdmAcceptStatus: { $in: ["Accept", "MaturedAccepted"] },
          },
        ],
      }),

      CompanyModel.countDocuments({ ...commonQuery, bdmAcceptStatus: { $in: ["Accept", "MaturedDone"] }, Status: "Matured" }),

      CompanyModel.countDocuments({ ...commonQuery, bdmAcceptStatus: { $in: ["Accept", "MaturedAccepted"] }, Status: { $in: ["Not Interested", "Junk"] }, bdmStatus: { $ne: "Not Interested" } }),
    ]);

    // Total pages calculation based on the largest dataset (generalData as reference)
    const totalGeneralPages = Math.ceil(totalGeneral / limit);
    const totalBusyPages = Math.ceil(totalBusy / limit);
    const totalInterestedPages = Math.ceil(totalInterested / limit);
    const totalMaturedPages = Math.ceil(totalMatured / limit);
    const totalNotInterestedPages = Math.ceil(totalNotInterested / limit);

    // Combine all data into a single field for easy access if needed
    const combinedData = [...generalData, ...busyData, ...interestedData, ...maturedData, ...notInterestedData];

    return res.status(200).json({
      currentPage: parseInt(page),
      perPage: parseInt(limit),
      totalCounts: totalGeneral + totalBusy + totalInterested + totalMatured + totalNotInterested,
      totalGeneral: totalGeneral,
      totalGeneralPages: totalGeneralPages,
      generalData: generalData.sort((a, b) => new Date(b.bdeForwardDate) - new Date(a.bdeForwardDate)) || [],
      totalBusy: totalBusy,
      totalBusyPages: totalBusyPages,
      busyData: busyData.sort((a, b) => new Date(b.bdmStatusChangeDate) - new Date(a.bdmStatusChangeDate)) || [],
      totalInterested: totalInterested,
      totalInterestedPages: totalInterestedPages,
      interestedData: interestedData.sort((a, b) => new Date(b.bdmStatusChangeDate) - new Date(a.bdmStatusChangeDate)) || [],
      totalMatured: totalMatured,
      totalMaturedPages: totalMaturedPages,
      maturedData: maturedData.sort((a, b) => new Date(b.bdmStatusChangeDate) - new Date(a.bdmStatusChangeDate)) || [],
      totalNotInterested: totalNotInterested,
      totalNotInterestedPages: totalNotInterestedPages,
      notInterestedData: notInterestedData.sort((a, b) => new Date(b.bdmStatusChangeDate) - new Date(a.bdmStatusChangeDate)) || [],
      data: combinedData // combined data of all statuses on this page
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/filter-employee-team-leads/:bdmName", async (req, res) => {
  const bdmName = req.params.bdmName;
  const {
    selectedStatus,
    selectedState,
    selectedNewCity,
    selectedBdeForwardDate,
    selectedCompanyIncoDate,
    selectedYear,
    monthIndex,
  } = req.query;

  //console.log(selectedBdeForwardDate);

  try {
    // Start with the required bdmName filter
    let baseQuery = { bdmName };

    // Add additional filters if they are present
    if (selectedStatus) baseQuery.bdmStatus = selectedStatus;
    if (selectedState) baseQuery.State = selectedState;
    if (selectedNewCity) baseQuery.City = selectedNewCity;

    if (selectedBdeForwardDate) {
      const startOfDay = new Date(selectedBdeForwardDate);
      startOfDay.setHours(0, 0, 0, 0); // Set to midnight local time

      const endOfDay = new Date(selectedBdeForwardDate);
      endOfDay.setHours(23, 59, 59, 999); // Set to the end of the day local time

      baseQuery.bdeForwardDate = {
        $gte: startOfDay,
        $lt: endOfDay
      };
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
      baseQuery["Company Incorporation Date  "] = {
        $gte: new Date(selectedCompanyIncoDate).toISOString(),
        $lt: new Date(new Date(selectedCompanyIncoDate).setDate(new Date(selectedCompanyIncoDate).getDate() + 1)).toISOString()
      };
    }

    //console.log("Base Query:", JSON.stringify(baseQuery, null, 2));

    const data = await TeamLeadsModel.find(baseQuery).lean();

    //console.log("Data Retrieved:", data);

    res.send(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


// router.post("/update-bdm-status/:id", async (req, res) => {
//   const { id } = req.params;
//   const socketIO = req.io;


//   //console.log(id)
//   const {
//     newBdmStatus,
//     companyId,
//     oldStatus,
//     bdmAcceptStatus,
//     bdmStatusChangeDate,
//     bdmStatusChangeTime,
//   } = req.body; // Destructure the required properties from req.body

//   console.log(req.body , oldStatus)
//   try {
//     // Update the status field in the database based on the employee id
//     await TeamLeadsModel.findByIdAndUpdate(id, {
//       bdmStatus: oldStatus === "Matured" || oldStatus === "Untouched" ? "Interested"  : oldStatus,
//       bdmStatusChangeDate: new Date(bdmStatusChangeDate),
//       bdmStatusChangeTime: bdmStatusChangeTime,
//     });

//     const companyToFind = await CompanyModel.findById(id).lean();
//     // console.log("companyToFind", companyToFind)
//     const company = await CompanyModel.findByIdAndUpdate(id, {
//       bdmStatus: oldStatus === "Matured" || oldStatus === "Untouched" ? "Interested"  : oldStatus,
//       bdmAcceptStatus: bdmAcceptStatus,
//       bdmStatusChangeDate: new Date(bdmStatusChangeDate),
//       bdmStatusChangeTime: bdmStatusChangeTime,
//       isDeletedEmployeeCompany: oldStatus === "Matured" ? true : companyToFind.isDeletedEmployeeCompany
//     });


//     socketIO.emit("bdmDataAcceptedRequest", {
//       ename: company.ename,
//       companyName: company["Company Name"]
//     });

//     //console.log(company.ename);

//     res.status(200).json({ message: "Status updated successfully" });
//   } catch (error) {
//     console.error("Error updating status:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }

//   //   // Fetch the BDM name and company name
//   //   const ename = company.ename;
//   //   const bdmName = company.bdmName;
//   //   const companyName = company["Company Name"];

//   //   // Fetch the ratio for the specific BDM from the `/bdmMaturedCases` aggregation
//   //   const bdmStats = await CompanyModel.aggregate([
//   //     { $match: { bdmAcceptStatus: "Accept", bdmName: bdmName } },
//   //     {
//   //       $group: {
//   //         _id: "$bdmName",
//   //         receivedCases: { $sum: 1 },
//   //         maturedCases: {
//   //           $sum: {
//   //             $cond: [{ $eq: ["$Status", "Matured"] }, 1, 0],
//   //           },
//   //         },
//   //       },
//   //     },
//   //     {
//   //       $addFields: {
//   //         ratio: {
//   //           $cond: [
//   //             { $eq: ["$receivedCases", 0] },
//   //             0,
//   //             { $multiply: [{ $divide: ["$maturedCases", "$receivedCases"] }, 100] },
//   //           ],
//   //         },
//   //       },
//   //     },
//   //   ]);

//   //   const ratio = bdmStats[0]?.ratio || 0;

//   //   // Emit socket event with BDM name, company name, and ratio
//   //   socketIO.emit("bdmDataAcceptedRequest", {
//   //     ename: ename,
//   //     companyName: companyName,
//   //     ratio: ratio.toFixed(2), // Send the ratio as a formatted value
//   //   });

//   //   res.status(200).json({ message: "Status updated successfully" });
//   // } catch (error) {
//   //   console.error("Error updating status:", error);
//   //   res.status(500).json({ error: "Internal Server Error" });
//   // }
// });

router.post("/update-bdm-status/:id", async (req, res) => {
  const { id } = req.params;
  const socketIO = req.io;

  const {
    newBdmStatus,
    companyId,
    oldStatus,
    bdmAcceptStatus,
    bdmStatusChangeDate,
    bdmStatusChangeTime,
  } = req.body;

  try {
    // Update the status field in the TeamLeadsModel based on the employee id
    await TeamLeadsModel.findByIdAndUpdate(id, {
      bdmStatus: oldStatus === "Untouched" || oldStatus === "Not Interested" || oldStatus === "Not Picked Up" || oldStatus === "Busy" ? "Interested" : oldStatus,
      bdmStatusChangeDate: new Date(bdmStatusChangeDate),
      bdmStatusChangeTime: bdmStatusChangeTime,
    });

    // Fetch the company to determine the current value of isDeletedEmployeeCompany
    const companyToFind = await CompanyModel.findById(id).lean();

    // Prepare the update object
    const updateFields = {
      bdmStatus: oldStatus === "Untouched" || oldStatus === "Not Interested" || oldStatus === "Not Picked Up" || oldStatus === "Busy" ? "Interested" : oldStatus,
      bdmAcceptStatus: bdmAcceptStatus,
      bdmStatusChangeDate: new Date(bdmStatusChangeDate),
      bdmStatusChangeTime: bdmStatusChangeTime,
      isDeletedEmployeeCompany: oldStatus === "Matured" ? true : companyToFind.isDeletedEmployeeCompany,
    };

    // If oldStatus is "Untouched", also update the status field to "Interested"
    if (oldStatus === "Untouched" || oldStatus === "Not Interested" || oldStatus === "Not Picked Up" || oldStatus === "Busy") {
      updateFields.Status = "Interested";
    }

    // Update the company model with the prepared fields
    const company = await CompanyModel.findByIdAndUpdate(id, {
      $set: updateFields,
    });

    // Emit socket event
    socketIO.emit("bdmDataAcceptedRequest", {
      ename: company.ename,
      companyName: company["Company Name"],
    });

    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.get(`/api/completeLeadsData`, async (req, res) => {
  try {
    const response = await TeamLeadsModel.find()
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
})

router.post("/bdm-status-change/:id", async (req, res) => {
  const { id } = req.params;
  const { bdeStatus, bdmnewstatus, title, date, time, bdmStatusChangeDate } =
    req.body; // Destructure the required properties from req.body

  try {
    // Update the status field in the database based on the employee id

    console.log("bdmnewstatus1", bdmnewstatus)
    // Conditionally delete from TeamLeadsModel if bdmnewstatus is "Busy"
    if (bdmnewstatus === "Not Interested") {
      console.log("bdmnewstatus", bdmnewstatus)
      await TeamLeadsModel.findByIdAndDelete(id);
    } else {
      await TeamLeadsModel.findByIdAndUpdate(id, {
        bdmStatus: bdmnewstatus,
        Status: bdmnewstatus,
        bdmStatusChangeDate: new Date(bdmStatusChangeDate),
        bdmStatusChangeTime: time,
      });
    }
    // const updateFields = {
    //   Status: bdmnewstatus,
    //   bdmStatusChangeDate: new Date(bdmStatusChangeDate),
    //   bdmStatusChangeTime: time,
    //   bdmStatus: bdmnewstatus
    // };


    // if (bdmnewstatus === "Not Interested") {
    //   updateFields.bdmAcceptStatus = "NotForwarded"
    //   updateFields.bdmStatus === "Not Interested"
    // }
    // //console.log("updateFie", updateFields)
    // // Update the CompanyModel
    // await CompanyModel.findByIdAndUpdate(id, {
    //   $set: updateFields
    // });

    if (bdmnewstatus === "Interested") {
      await LeadHistoryForInterestedandFollowModel.findOneAndUpdate(
        { _id: id },  // Query to find the document by ID
        {             // Update fields
          $set: {
            oldStatus: bdeStatus,
            newStatus: bdmnewstatus,
          },
        },
        { new: true } // Option to return the updated document
      );
    }


    if (bdmnewstatus === "Not Interested" || bdmnewstatus === "Junk" || bdmnewstatus === "Busy") {
      await LeadHistoryForInterestedandFollowModel.findOneAndDelete({
        _id: id
      })
    }

    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post(`/teamleads-reversedata/:id`, async (req, res) => {
  const id = req.params.id; // Corrected params extraction
  const { companyName, bdmAcceptStatus, bdmName } = req.body;
  try {
    // Assuming TeamLeadsModel and CompanyModel are Mongoose models
    await TeamLeadsModel.findByIdAndDelete(id); // Corrected update

    await CompanyModel.findByIdAndUpdate(
      id,
      {
        $set: {
          bdmAcceptStatus: bdmAcceptStatus, // Set this value
          bdmName: bdmName,                // Set this value
        },
        $unset: {
          bdmStatus: ""
        },
      },
      { new: true } // Return the updated document
    );

    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/teamleads-rejectdata/:id`, async (req, res) => {
  const id = req.params.id; // Corrected params extraction
  const { bdmAcceptStatus, bdmName, remarks } = req.body;
  //g(bdmName , remarks)
  try {
    // Assuming TeamLeadsModel and CompanyModel are Mongoose models
    await TeamLeadsModel.findByIdAndDelete(id); // Corrected update

    await CompanyModel.findByIdAndUpdate(id, {
      bdmAcceptStatus: bdmAcceptStatus,
      bdmName: bdmName,
      Remarks: remarks
    });

    await RemarksHistory.findByIdAndUpdate(id, {
      remarks: remarks,
    }); // Corrected update

    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete(`/post-deletecompany-interested/:companyId`, async (req, res) => {
  const companyId = req.params.companyId; // Correctly access teamId from req.params

  try {
    const existingData = await TeamLeadsModel.findById(companyId);
    //console.log("EXISITING DATA", existingData);

    if (existingData) {
      await TeamLeadsModel.findByIdAndDelete(companyId); // Use findByIdAndDelete to delete by ID
      res.status(200).json({ message: "Deleted Successfully" });
    } else {
      res.status(400).json({ error: "Team Does Not Exist" }); // Correct typo in error message
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/post-bdmAcceptStatusupate/:id", async (req, res) => {
  const { id } = req.params;
  const { bdmAcceptStatus } = req.body; // Destructure the required properties from req.body

  try {
    // Update the status field in the database based on the employee id
    await CompanyModel.findByIdAndUpdate(id, { bdmAcceptStatus: bdmAcceptStatus });

    // Create and save a new document in the RecentUpdatesModel collectio

    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/post-update-bdmstatusfrombde/:id", async (req, res) => {
  const { id } = req.params;
  const { newStatus } = req.body; // Destructure the required properties from req.body

  try {
    // Update the status field in the database based on the employee id
    await TeamLeadsModel.findByIdAndUpdate(id, { Status: newStatus });

    // Create and save a new document in the RecentUpdatesModel collectio

    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/post-bdmnextfollowupdate/:id`, async (req, res) => {
  const companyId = req.params.id;
  const bdmNextFollowUpDate = new Date(req.body.bdmNextFollowUpDate);
  try {
    await TeamLeadsModel.findByIdAndUpdate(companyId, {
      bdmNextFollowUpDate: bdmNextFollowUpDate,
    });

    res.status(200).json({ message: "Date Updated successfully" });
  } catch (error) {
    console.error("Error fetching Date:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/assign-leads-newbdm", async (req, res) => {
  const { newemployeeSelection, data, bdmAcceptStatus } = req.body;
  if (newemployeeSelection !== "Not Alloted") {
    try {
      // Add AssignDate property with the current date
      const updatedObj = {
        ...data,
        bdmName: newemployeeSelection,
        AssignDate: new Date(),
      };

      //console.log("updated" , updatedObj)

      // Update TeamLeadsModel for the specific data
      await TeamLeadsModel.updateOne({ _id: data._id }, updatedObj);

      await CompanyModel.findByIdAndUpdate(
        { _id: data._id },
        { bdmName: newemployeeSelection }
      );

      // Delete objects from RemarksHistory collection that match the "Company Name"
      //await RemarksHistory.deleteMany({ companyID: data._id });

      res.status(200).json({ message: "Data updated successfully" });
    } catch (error) {
      console.error("Error updating data:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    try {
      // If newemployeeSelection is "Not Alloted", delete the company record and update AssignDate
      const updatedObj = {
        ...data,
        ename: newemployeeSelection,
        AssignDate: new Date(),
        bdmAcceptStatus: bdmAcceptStatus,
        bdmName: "NoOne",
      };
      //console.log("updated" , updatedObj)
      // Delete the record from TeamLeadsModel
      await TeamLeadsModel.findByIdAndDelete({ _id: data._id });

      // Update the record in CompanyModel
      await CompanyModel.findByIdAndUpdate({ _id: data._id }, updatedObj);

      // Delete records from RemarksHistory collection that match the companyID
      await RemarksHistory.deleteMany({ companyID: data._id });

      res.status(200).json({ message: "Data updated successfully" });
    } catch (error) {
      console.error("Error updating data:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

router.post("/matured-case-request", async (req, res) => {
  try {
    // Extract data from the request body sent by the frontend
    const { companyName, requestStatus, bdeName, bdmName, date } = req.body;

    // Create a new instance of RequestMaturedModel
    const newRequest = new RequestMaturedModel({
      "Company Name": companyName,
      requestStatus,
      bdeName,
      bdmName,
      date,
    });
    // Save the new request to the database
    await newRequest.save();
    const changeStatus = await TeamLeadsModel.findOneAndUpdate(
      {
        "Company Name": companyName,
      },
      {
        bdmOnRequest: true,
      },
      { new: true }
    );
    // Send a success response back to the frontend
    res
      .status(200)
      .json({ success: true, message: "Request saved successfully" });
  } catch (error) {
    console.error("Error saving request:", error);
    res.status(500).json({ success: false, message: "Error saving request" });
  }
});

router.get("/inform-bde-requests/:bdeName", async (req, res) => {
  try {
    const bdeName = req.params.bdeName;
    const request = await InformBDEModel.find({
      bdeName,
    });
    res.status(200).json(request);
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Error fetching the data" });
  }
});

router.get("/api/matured-get-requests/:bdeName", async (req, res) => {
  try {
    const bdeName = req.params.bdeName;
    const request = await RequestMaturedModel.find({
      bdeName,
      requestStatus: "Pending",
    });
    res.status(200).json(request);
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Error fetching the data" });
  }
});
router.get("/matured-get-requests-byBDM/:bdmName", async (req, res) => {
  try {
    const bdmName = req.params.bdmName;
    const request = await RequestMaturedModel.find({
      bdmName,
      requestStatus: "Accepted",
    });
    res.status(200).json(request);
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Error fetching the data" });
  }
});

//--------------api for delete bdm from admin side------------------

router.post('/deletebdm-updatebdedata', async (req, res) => {
  const { companyId, companyName } = req.query; // Changed from req.params to req.body
  const socketIO = req.io;
  try {
    const exixtingData = await CompanyModel.findById(companyId);
    await CompanyModel.findOneAndUpdate(
      { _id: companyId }, // Corrected filter object
      {
        $set: {
          bdmAcceptStatus: "NotForwarded",
          feedbackPoints: [],
          multiBdmName: [],

        },
        $unset: {
          bdmName: "",
          bdeForwardDate: "",
          bdmStatusChangeDate: "",
          bdmStatusChangeTime: "",
          bdmRemarks: "",
          RevertBackAcceptedCompanyRequest: "",
        }
      }
    );

    await TeamLeadsModel.findOneAndDelete({ _id: companyId }); // Corrected filter object
    await FollowUpModel.findOneAndDelete({ companyName: companyName });
    await RemarksHistory.deleteOne({ companyID: companyId });
    socketIO.emit("revert-back-request-acceptedByBDM", {
      data: exixtingData
    });
    res.status(200).json({ message: "Company updated and deleted successfully" });
  } catch (error) {
    console.error("Error updating and deleting company:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API for deleting leads from bdm :
router.post("/delete-bdm-teamLeads", async (req, res) => {
  const companies = req.body.companies; // Array of company objects from frontend

  try {
    const bulkOperations = companies.map((company) => {
      return {
        updateOne: {
          filter: { _id: company._id },
          update: {
            $set: {
              Status: company.bdeOldStatus, // Update Status to bdeOldStatus
              bdmAcceptStatus: "NotForwarded",
              feedbackPoints: [],
              multiBdmName: [],
            },
            $unset: {
              bdeOldStatus: "",
              bdmName: "",
              bdeForwardDate: "",
              bdmStatusChangeDate: "",
              bdmStatusChangeTime: "",
              bdmRemarks: "",
              RevertBackAcceptedCompanyRequest: "",
            }
          }
        }
      };
    });

    // Perform bulk write operation to update multiple companies
    await CompanyModel.bulkWrite(bulkOperations);

    // Delete entries in TeamLeadsModel, FollowUpModel, and RemarksHistory for each company
    const companyIds = companies.map((company) => company._id);
    const companyNames = companies.map((company) => company.companyName);

    await TeamLeadsModel.deleteMany({ _id: { $in: companyIds } });
    await FollowUpModel.deleteMany({ companyName: { $in: companyNames } });
    // await RemarksHistory.deleteMany({ companyID: { $in: companyIds } });

    res.status(200).json({ message: "Companies updated and deleted successfully" });
  } catch (error) {
    console.error("Error updating and deleting companies:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//---------- request to reject revert back request -------------------------------------
router.post(`/rejectrequestrevertbackcompany`, async (req, res) => {
  const { companyId } = req.query;
  try {
    const company = await CompanyModel.findById(companyId);
    const socketIO = req.io;
    await CompanyModel.findOneAndUpdate(
      { _id: companyId },
      {
        $set: {
          RevertBackAcceptedCompanyRequest: "Reject",
        }
      }
    )
    await TeamLeadsModel.findOneAndUpdate(
      { _id: companyId },
      {
        $set: {
          RevertBackAcceptedCompanyRequest: "Reject",
        }
      }
    )
    socketIO.emit("rejectrequestrevertbackcompany", { data: company })
    res.status(200).json({ message: "Company Not Reverted Back" })
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }

})

//------------done request of reverted company--------------------------------

router.post(`/rejectedrequestdonebybdm`, async (req, res) => {
  const { companyId } = req.query;
  try {
    await CompanyModel.findOneAndUpdate(
      { _id: companyId },
      {
        $unset: {
          RevertBackAcceptedCompanyRequest: ""
        }
      }
    )
    await TeamLeadsModel.findOneAndUpdate(
      { _id: companyId },
      {
        $unset: {
          RevertBackAcceptedCompanyRequest: ""
        }
      }
    )

  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }

})

router.post("/leadsforwardedbyadmintobdm", async (req, res) => {
  const { data, name } = req.body;
  console.log("data", data, name);

  try {
    const updatePromises = data.map(async (company) => {
      const uploadDate = company.UploadDate === '$AssignDate' ? new Date() : company.UploadDate;

      // Update the company in CompanyModel
      const response = await CompanyModel.findByIdAndUpdate(company._id, {
        ...company,
        UploadDate: uploadDate, // Set UploadDate to current date if it was '$AssignDate'
        bdmAcceptStatus: "Pending",
        bdmName: name,
        bdeForwardDate: new Date(),
        bdeOldStatus: company.Status,
        bdmStatus: "Untouched"
      });

      console.log("CompanyModel response:", response);

      // Check if the company exists in TeamLeadsModel
      const teamLeadResponse = await TeamLeadsModel.findOneAndUpdate(
        { _id: company._id }, // Match the company by ID
        {
          ...company,
          bdmName: name,
          bdeForwardDate: new Date(),
          bdmStatus: "Untouched"
        },
        { upsert: true, new: true } // Create new entry if not found, return the updated/new document
      );

      console.log("TeamLeadsModel response:", teamLeadResponse);
    });

    await Promise.all(updatePromises);
    res.status(200).json({ message: "Data created and updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Floor manager received cases calculation :
router.get("/floorManagerReceivedCases/:floorManagerName", async (req, res) => {
  const { floorManagerName } = req.params;
  const { monthFilter } = req.query; // Extract monthFilter from query parameters
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-based index for months
  const currentYear = currentDate.getFullYear();

  let matchCriteria = { bdmName: floorManagerName }; // Default match criteria

  try {
    // Step 1: Aggregate the data for the given floor manager without date filtering
    const data = await CompanyModel.aggregate([
      {
        $match: matchCriteria // Use the matchCriteria directly for floor manager name
      },
      {
        $group: {
          _id: {
            status: "$Status",
            companyName: "$Company Name",
            bdeName: "$ename",
            bdmName: "$bdmName",
            bdmAcceptStatus: "$bdmAcceptStatus",
            bdeForwardDate: "$bdeForwardDate",
          },
          count: { $sum: 1 },
          generatedReceivedAmount: { $sum: "$receivedAmount" },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id.status",
          companyName: "$_id.companyName",
          bdeName: "$_id.bdeName",
          bdmName: "$_id.bdmName",
          bdmAcceptStatus: "$_id.bdmAcceptStatus",
          bdeForwardDate: "$_id.bdeForwardDate",
          count: 1,
          generatedReceivedAmount: 1,
        },
      },
    ]);

    // Step 2: Filter the aggregated data based on bdeForwardDate
    const filteredData = data.filter(item => {
      const bdeForwardDate = new Date(item.bdeForwardDate);
      let isInDateRange = false;

      if (monthFilter === 'current_month') {
        const startDate = new Date(currentYear, currentMonth, 1); // Start of current month
        const endDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59); // End of current month
        isInDateRange = bdeForwardDate >= startDate && bdeForwardDate <= endDate;
      } else if (monthFilter === 'last_month') {
        const startDate = new Date(currentYear, currentMonth - 1, 1); // Start of last month
        const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59); // End of last month
        isInDateRange = bdeForwardDate >= startDate && bdeForwardDate <= endDate;
      } else {
        // If no month filter is applied, consider all records
        isInDateRange = true;
      }

      return isInDateRange;
    });

    // Step 3: Extract company names of companies with status "Matured"
    const maturedCompanies = filteredData.filter(item => item.status === "Matured").map(item => item.companyName);

    // Step 4: Find corresponding generatedReceivedAmount from the redesigned lead form
    const leadFormData = await ReDesignedLeadFormModel.find({ "Company Name": { $in: maturedCompanies } }, { "Company Name": 1, "generatedReceivedAmount": 1 });

    // Step 5: Create a mapping of company names to generatedReceivedAmounts
    const receivedAmountsMap = leadFormData.reduce((acc, item) => {
      acc[item["Company Name"]] = item.generatedReceivedAmount;
      return acc;
    }, {});

    // Step 6: Augment the original data with the corresponding generatedReceivedAmount
    const responseData = filteredData.map(item => ({
      ...item,
      generatedReceivedAmount: item.status === "Matured" ? receivedAmountsMap[item.companyName] || 0 : item.generatedReceivedAmount
    }));

    // Step 7: Calculate summary
    const summary = {
      general: 0,
      generalCompanies: [],
      interested: 0,
      interestedCompanies: [],
      followUp: 0,
      followUpCompanies: [],
      matured: 0,
      maturedCompanies: [],
      notInterested: 0,
      notInterestedCompanies: [],
      total: 0,
      generatedReceivedAmountTotal: 0,
    };

    responseData.forEach(item => {
      // Aggregate totals based on status
      switch (item.status) {
        case "Interested":
          // Only count if bdmAcceptStatus is not "Pending"
          if (item.bdmAcceptStatus !== "Pending") {
            summary.interested += item.count;
            summary.interestedCompanies.push(item.companyName); // Add company to interestedCompanies
          }
          break;
        case "FollowUp":
          if (item.bdmAcceptStatus !== "Pending") {
            summary.followUp += item.count;
            summary.followUpCompanies.push(item.companyName); // Add company to followUpCompanies
          }
          break;
        case "Junk":
        case "Not Interested":
          summary.notInterested += item.count;
          summary.notInterestedCompanies.push(item.companyName); // Add company to notInterestedCompanies
          break;
        case "Matured":
          summary.matured += item.count;
          summary.maturedCompanies.push(item.companyName); // Add company to maturedCompanies
          break;
        default:
          break;
      }

      // Count general based on bdmAcceptStatus
      if (item.bdmAcceptStatus === "Pending") {
        summary.general += item.count;
        summary.generalCompanies.push(item.companyName); // Add company to generalCompanies
      }

      // Add generatedReceivedAmount to total
      summary.generatedReceivedAmountTotal += item.generatedReceivedAmount;
    });

    // Step 8: Calculate total statuses
    summary.total = summary.general + summary.interested + summary.followUp + summary.matured + summary.notInterested;

    res.status(200).json({ result: true, message: "Data fetched successfully", summary: summary, data: responseData });
  } catch (error) {
    res.status(400).json({ result: false, message: "Error fetching the data", error: error });
  }
});

// Floor manager current day received cases calculation :
router.get("/floorManagerReceivedCasesToday/:floorManagerName", async (req, res) => {
  const { floorManagerName } = req.params;
  const currentDate = new Date();
  const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0)); // Start of the current day
  const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999)); // End of the current day

  let matchCriteria = { bdmName: floorManagerName };

  try {
    const data = await CompanyModel.aggregate([
      {
        $match: matchCriteria
      },
      {
        $group: {
          _id: {
            status: "$Status",
            companyName: "$Company Name",
            bdeName: "$ename",
            bdmName: "$bdmName",
            bdmAcceptStatus: "$bdmAcceptStatus",
            bdeForwardDate: "$bdeForwardDate",
          },
          count: { $sum: 1 },
          generatedReceivedAmount: { $sum: "$receivedAmount" },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id.status",
          companyName: "$_id.companyName",
          bdeName: "$_id.bdeName",
          bdmName: "$_id.bdmName",
          bdmAcceptStatus: "$_id.bdmAcceptStatus",
          bdeForwardDate: "$_id.bdeForwardDate",
          count: 1,
          generatedReceivedAmount: 1,
        },
      },
    ]);

    // Step 2: Filter the aggregated data based on bdeForwardDate
    const filteredData = data.filter(item => {
      const bdeForwardDate = new Date(item.bdeForwardDate);
      let isInDateRange = false;

      if (!isInDateRange) {
        isInDateRange = bdeForwardDate >= startOfDay && bdeForwardDate <= endOfDay;
      }

      return isInDateRange;
    });

    // Step 3: Extract company names of companies with status "Matured"
    const maturedCompanies = filteredData.filter(item => item.status === "Matured").map(item => item.companyName);

    // Step 4: Find corresponding generatedReceivedAmount from the redesigned lead form
    const leadFormData = await ReDesignedLeadFormModel.find({ "Company Name": { $in: maturedCompanies } }, { "Company Name": 1, "generatedReceivedAmount": 1 });

    // Step 5: Create a mapping of company names to generatedReceivedAmounts
    const receivedAmountsMap = leadFormData.reduce((acc, item) => {
      acc[item["Company Name"]] = item.generatedReceivedAmount;
      return acc;
    }, {});

    // Step 6: Augment the original data with the corresponding generatedReceivedAmount
    const responseData = filteredData.map(item => ({
      ...item,
      generatedReceivedAmount: item.status === "Matured" ? receivedAmountsMap[item.companyName] || 0 : item.generatedReceivedAmount
    }));

    // Step 7: Calculate summary
    const summary = {
      general: 0,
      generalCompanies: [],
      interested: 0,
      interestedCompanies: [],
      followUp: 0,
      followUpCompanies: [],
      matured: 0,
      maturedCompanies: [],
      notInterested: 0,
      notInterestedCompanies: [],
      total: 0,
      generatedReceivedAmountTotal: 0,
    };

    responseData.forEach(item => {
      // Aggregate totals based on status
      switch (item.status) {
        case "Interested":
          // Only count if bdmAcceptStatus is not "Pending"
          if (item.bdmAcceptStatus !== "Pending") {
            summary.interested += item.count;
            summary.interestedCompanies.push(item.companyName); // Add company to interestedCompanies
          }
          break;
        case "FollowUp":
          if (item.bdmAcceptStatus !== "Pending") {
            summary.followUp += item.count;
            summary.followUpCompanies.push(item.companyName); // Add company to followUpCompanies
          }
          break;
        case "Junk":
        case "Not Interested":
          summary.notInterested += item.count;
          summary.notInterestedCompanies.push(item.companyName); // Add company to notInterestedCompanies
          break;
        case "Matured":
          summary.matured += item.count;
          summary.maturedCompanies.push(item.companyName); // Add company to maturedCompanies
          break;
        default:
          break;
      }

      // Count general based on bdmAcceptStatus
      if (item.bdmAcceptStatus === "Pending") {
        summary.general += item.count;
        summary.generalCompanies.push(item.companyName); // Add company to generalCompanies
      }

      // Add generatedReceivedAmount to total
      summary.generatedReceivedAmountTotal += item.generatedReceivedAmount;
    });

    // Step 8: Calculate total statuses
    summary.total = summary.general + summary.interested + summary.followUp + summary.matured + summary.notInterested;

    res.status(200).json({ result: true, message: "Data fetched successfully", summary: summary, data: responseData });
  } catch (error) {
    res.status(400).json({ result: false, message: "Error fetching today's data", error });
  }
});

// Floor manager projected amount calculation :
router.get("/floorManagerReceivedCasesProjectedAmount/:floorManagerName", async (req, res) => {
  const { floorManagerName } = req.params;
  const { monthFilter } = req.query; // Extract monthFilter from query parameters
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-based index for months
  const currentYear = currentDate.getFullYear();

  let matchCriteria = { bdmName: floorManagerName, caseType: "Recieved" }; // Match by bdmName and caseType "Received"

  try {
    // Step 1: Aggregate the data from followup collection
    const data = await FollowUpModel.aggregate([
      {
        $match: matchCriteria // Use the match criteria for floor manager and caseType
      },
      {
        $project: {
          companyName: 1,
          bdeName: 1,
          bdmName: 1,
          caseType: "$caseType", // Assuming caseType represents status
          followUpDate: "$lastFollowUpdate",
          projectedAmountTotal: "$totalPayment" // Assuming totalPayment represents amount received
        }
      }
    ]);

    // Step 2: Filter the aggregated data based on bdeForwardDate
    const filteredData = data.filter(item => {
      const followUpDate = new Date(item.followUpDate);
      let isInDateRange = false;

      if (monthFilter === 'current_month') {
        const startDate = new Date(currentYear, currentMonth, 1); // Start of current month
        const endDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59); // End of current month
        isInDateRange = followUpDate >= startDate && followUpDate <= endDate;
      } else if (monthFilter === 'last_month') {
        const startDate = new Date(currentYear, currentMonth - 1, 1); // Start of last month
        const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59); // End of last month
        isInDateRange = followUpDate >= startDate && followUpDate <= endDate;
      } else {
        // If no month filter is applied, consider all records
        isInDateRange = true;
      }

      return isInDateRange;
    });

    const summary = filteredData.reduce((summary, item) => {
      summary.total += item.projectedAmountTotal / 2;
      return summary;
    }, {
      total: 0
    });

    // Return final response with summary and filtered data
    res.status(200).json({ result: true, message: "Data fetched successfully", summary: summary, data: filteredData });
  } catch (error) {
    res.status(400).json({ result: false, message: "Error fetching the data", error: error });
  }
});

// Floor manager current day projected amount calculation :
router.get("/floorManagerProjectedAmountToday/:floorManagerName", async (req, res) => {
  const { floorManagerName } = req.params;
  const currentDate = new Date();
  const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0)); // Start of the current day
  const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999)); // End of the current day

  let matchCriteria = { bdmName: floorManagerName, caseType: "Recieved" }; // Match by bdmName and caseType "Received"

  try {
    // Step 1: Aggregate the data from followup collection
    const data = await FollowUpModel.aggregate([
      {
        $match: matchCriteria // Use the match criteria for floor manager and caseType
      },
      {
        $project: {
          companyName: 1,
          bdeName: 1,
          bdmName: 1,
          caseType: "$caseType", // Assuming caseType represents status
          followUpDate: "$lastFollowUpdate",
          projectedAmountTotal: "$totalPayment" // Assuming totalPayment represents amount received
        }
      }
    ]);

    // Step 2: Filter the aggregated data based on bdeForwardDate
    const filteredData = data.filter(item => {
      const followUpDate = new Date(item.followUpDate);
      let isInDateRange = false;

      if (!isInDateRange) {
        isInDateRange = followUpDate >= startOfDay && followUpDate <= endOfDay;
      }

      return isInDateRange;
    });

    const summary = filteredData.reduce((summary, item) => {
      summary.total += item.projectedAmountTotal / 2;
      return summary;
    }, {
      total: 0
    });

    res.status(200).json({ result: true, message: "Today's projected amounts fetched successfully", summary, data: filteredData });
  } catch (error) {
    res.status(400).json({ result: false, message: "Error fetching today's projected amounts", error });
  }
});

// Floor manager Projection Summary Report :
router.get("/floorManagerProjectionSummaryReport/:floorManagerName", async (req, res) => {
  try {
    const { floorManagerName } = req.params;
    const { startDate, endDate } = req.query;

    // Validate the date range
    const start = startDate ? moment(startDate).format('YYYY-MM-DD') : null;
    const end = endDate ? moment(endDate).format('YYYY-MM-DD') : null;

    // Step 1: Find the branch office of the floor manager from the 'newemployeeinfos' collection
    const floorManager = await adminModel.findOne({ ename: floorManagerName });
    if (!floorManager) {
      return res.status(404).json({ message: "Floor Manager not found" });
    }

    const floorManagerBranch = floorManager.branchOffice;

    // Step 2: Find all employees in the same branch office
    const employeesInBranch = await adminModel.find({ branchOffice: floorManagerBranch });
    const employeeNames = employeesInBranch
      .filter(emp => emp.newDesignation === "Business Development Executive" || emp.newDesignation === "Business Development Manager")
      .map(emp => emp.ename); // Extract employee names

    // Step 3: Prepare the match criteria for follow-up data
    const matchCriteria = {
      ename: { $in: employeeNames }, // Match employees
    };

    // Add date filtering if both startDate and endDate are provided
    if (start && end) {
      matchCriteria.estPaymentDate = {
        $gte: start,  // Use the start date from query params
        $lte: end    // Use the end date from query params
      };
    }

    // Step 4: Fetch and aggregate data from 'followupcollections' for employees in the same branch
    const followUpData = await FollowUpModel.aggregate([
      {
        $match: matchCriteria // Use the constructed match criteria
      },
      {
        $group: {
          _id: { ename: "$ename", companyName: "$companyName" }, // Group by employee name and company name
          offeredServices: { $push: "$offeredServices" }, // Collect offered services for each company
          totalOfferedPrice: { $sum: "$offeredPrize" }, // Sum offeredPrize per company
          totalPayment: { $sum: "$totalPayment" }, // Sum totalPayment per company
        }
      },
      {
        $group: {
          _id: "$_id.ename", // Group by employee name again
          companies: {
            $push: {
              companyName: "$_id.companyName", // Collect company name
              offeredServices: { $arrayElemAt: ["$offeredServices", 0] }, // Get offered services
              totalOfferedPrice: "$totalOfferedPrice", // Offered price per company
              totalPayment: "$totalPayment" // Total payment per company
            }
          }
        }
      }
    ]);

    // Step 5: Format the data to return, ensuring all employees are included
    const result = employeeNames.map(employeeName => {
      const employeeData = followUpData.find(data => data._id === employeeName);

      return {
        employeeName: employeeName,
        totalCompanies: employeeData ? employeeData.companies.length : 0,
        totalOfferedServices: employeeData ? employeeData.companies.reduce((sum, company) => sum + company.offeredServices.length, 0) : 0,
        companies: employeeData ? employeeData.companies.map(company => ({
          companyName: company.companyName,
          offeredServices: company.offeredServices, // List of offered services for this company
          totalOfferedPrice: company.totalOfferedPrice, // Total offered price for this company
          totalPayment: company.totalPayment // Total payment for this company
        })) : [], // Default to empty array if no company data
        totalOfferedPrice: employeeData ? employeeData.companies.reduce((sum, company) => sum + company.totalOfferedPrice, 0) : 0, // Sum offered price across all companies
        totalPayment: employeeData ? employeeData.companies.reduce((sum, company) => sum + company.totalPayment, 0) : 0 // Sum total payment across all companies
      };
    });

    res.status(200).json({ result: true, message: "Projected amounts fetched successfully", data: result });
  } catch (error) {
    console.error("Error fetching floor manager projection summary:", error);
    res.status(500).json({ result: false, message: "Error fetching floor manager projection summary", error: error });
  }
});

// Floor manager leads Report :
// router.get("/floorManagerLeadsReport", async (req, res) => {
//   try {
//     // Extract startDate and endDate from query parameters
//     const { startDate, endDate } = req.query;

//     // Convert startDate and endDate to ISO format to compare with AssignDate if they exist
//     const start = startDate ? new Date(startDate) : null;
//     const end = endDate ? new Date(endDate) : null;

//     // Step 1: Get employees with specific designations
//     const employees = await adminModel.find({
//       $or: [
//         { newDesignation: "Business Development Executive" },
//         { newDesignation: "Business Development Manager" },
//         { newDesignation: "Floor Manager" }
//       ]
//     });

//     const deletedEmployees = await DeletedEmployeeModel.find({
//       $or: [
//         { newDesignation: "Business Development Executive" },
//         { newDesignation: "Business Development Manager" },
//         { newDesignation: "Floor Manager" }
//       ]
//     });

//     const employeesData = [...employees, ...deletedEmployees];

//     // Step 2: Create a result object to store the leads data
//     const result = {};

//     // Iterate through each employee
//     for (const employee of employeesData) {
//       const employeeName = employee.ename;
//       const branchOffice = employee.branchOffice; // Assuming this field exists

//       // Initialize result for the employee if it doesn't exist
//       if (!result[employeeName]) {
//         result[employeeName] = {
//           employeeName: employeeName,
//           branchOffice: branchOffice,
//           interested: 0,
//           // interestedLeads: [],
//           followUp: 0,
//           // followUpLeads: [],
//           forwarded: 0,
//           // forwardedLeads: []
//         };
//       }

//       // Step 3: Prepare the query object for filtering companies
//       const query = {
//         ename: employeeName,
//         Status: { $in: ["Interested", "FollowUp"] },
//         bdmAcceptStatus: { $in: ["NotForwarded", "Pending", "Accept"] }
//       };

//       // Add AssignDate filtering only if startDate and endDate are provided
//       if (start && end) {
//         query.AssignDate = {
//           $gte: start,  // Greater than or equal to startDate
//           $lte: end     // Less than or equal to endDate
//         };
//       }

//       // Step 4: Filter companies based on the specified criteria and assign date
//       const companies = await CompanyModel.find(query);

//       // Step 5: Count leads and categorize them
//       companies.forEach(company => {
//         const companyName = company["Company Name"];
//         const companyStatus = company.Status;
//         const companyBdmAcceptStatus = company.bdmAcceptStatus;

//         if (companyStatus === "Interested" && companyBdmAcceptStatus === "NotForwarded") {
//           result[employeeName].interested++;
//           // result[employeeName].interestedLeads.push(companyName);
//         } else if (companyStatus === "FollowUp" && companyBdmAcceptStatus === "NotForwarded") {
//           result[employeeName].followUp++;
//           // result[employeeName].followUpLeads.push(companyName);
//         }

//         if (companyBdmAcceptStatus === "Pending" || companyBdmAcceptStatus === "Accept") {
//           result[employeeName].forwarded++;
//           // result[employeeName].forwardedLeads.push(companyName);
//         }
//       });
//     }

//     // Convert result object to an array
//     const response = Object.values(result);
//     res.status(200).json({ result: true, message: "Lead report fetched successfully", data: response });
//   } catch (error) {
//     console.error("Error fetching the data:", error);
//     res.status(500).json({ result: false, message: "Error fetching the data", error: error });
//   }
// });

router.get("/floorManagerLeadsReport", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // console.log("Start date :", start);
    // console.log("End date :", end);

    // Step 1: Aggregate on CompanyModel to get counts of interested, followup, and forwarded leads by employee
    const companyPipeline = [
      {
        $match: {
          Status: { $in: ["Interested", "FollowUp", "Busy", "Not Picked Up"] },
          bdmAcceptStatus: { $in: ["NotForwarded", "Pending", "Accept"] },
          ...(start && end ? { AssignDate: { $gte: start, $lte: end } } : {})
        }
      },
      {
        $group: {
          _id: "$ename",
          interested: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$Status", "Interested"] }, { $eq: ["$bdmAcceptStatus", "NotForwarded"] }] },
                1,
                0
              ]
            }
          },
          followUp: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$Status", "FollowUp"] }, { $eq: ["$bdmAcceptStatus", "NotForwarded"] }] },
                1,
                0
              ]
            }
          },
          forwarded: {
            $sum: {
              $cond: [
                { $or: [{ $eq: ["$bdmAcceptStatus", "Pending"] }, { $eq: ["$bdmAcceptStatus", "Accept"] }] },
                1,
                0
              ]
            }
          }
        }
      }
    ];

    // Step 2: Run the aggregation pipeline on the CompanyModel
    const companyData = await CompanyModel.aggregate(companyPipeline);
    const companyDataMap = companyData.reduce((acc, curr) => {
      acc[curr._id] = curr;
      return acc;
    }, {});

    // Step 3: Get employee details from adminModel and DeletedEmployeeModel
    const employees = await adminModel
      .find({
        newDesignation: { $in: ["Business Development Executive", "Business Development Manager", "Floor Manager"] }
      })
      .select("ename branchOffice newDesignation");

    const deletedEmployees = await DeletedEmployeeModel
      .find({
        newDesignation: { $in: ["Business Development Executive", "Business Development Manager", "Floor Manager"] }
      })
      .select("ename branchOffice newDesignation");

    const employeeData = [...employees, ...deletedEmployees];

    // Step 4: Merge company lead data with employee data and set defaults for missing counts
    const result = employeeData.map((employee) => {
      const employeeCounts = companyDataMap[employee.ename] || { interested: 0, followUp: 0, forwarded: 0 };
      return {
        employeeName: employee.ename,
        branchOffice: employee.branchOffice,
        designation: employee.newDesignation,
        interested: employeeCounts.interested,
        followUp: employeeCounts.followUp,
        forwarded: employeeCounts.forwarded
      };
    });

    res.status(200).json({ result: true, message: "Lead report fetched successfully", data: result });
  } catch (error) {
    console.error("Error fetching the data:", error);
    res.status(500).json({ result: false, message: "Error fetching the data", error });
  }
});

module.exports = router;