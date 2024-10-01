var express = require('express');
var router = express.Router()
const dotenv = require('dotenv')
dotenv.config();

const CompanyModel = require("../models/Leads.js");
const RemarksHistory = require("../models/RemarksHistory");
const TeamLeadsModel = require("../models/TeamLeads.js");
const RequestMaturedModel = require("../models/RequestMatured.js");
const InformBDEModel = require("../models/InformBDE.js");
const FollowUpModel = require('../models/FollowUp.js');
const LeadHistoryForInterestedandFollowModel = require('../models/LeadHistoryForInterestedandFollow.js');

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
  console.log(companyName)
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

    // Fetch the related company data from newcdatas collection
    const companyNames = teamLeadsData.map((lead) => lead["Company Name"]);

    const newcdatasData = await CompanyModel.find({
      "Company Name": { $in: companyNames },
    }).select("Company Name isDeletedEmployeeCompany");

    // Create a lookup object for companyName to isDeletedEmployeeCompany mapping
    const companyLookup = {};
    newcdatasData.forEach((company) => {
      companyLookup[company["Company Name"]] = company.isDeletedEmployeeCompany;
    });

    // Update team leads data based on lookup, add isDeletedEmployeeCompany field if it doesn't exist
    teamLeadsData.forEach((lead) => {
      if (companyLookup[lead["Company Name"]] !== undefined) {
        lead.isDeletedEmployeeCompany = companyLookup[lead["Company Name"]];
      }
    });

    res.status(200).send(teamLeadsData);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
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

  console.log(selectedBdeForwardDate);

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

    console.log("Base Query:", JSON.stringify(baseQuery, null, 2));

    const data = await TeamLeadsModel.find(baseQuery).lean();

    console.log("Data Retrieved:", data);

    res.send(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/update-bdm-status/:id", async (req, res) => {
  const { id } = req.params;
  const socketIO = req.io;
  
 
  console.log(id)
  const {
    newBdmStatus,
    companyId,
    oldStatus,
    bdmAcceptStatus,
    bdmStatusChangeDate,
    bdmStatusChangeTime,
  } = req.body; // Destructure the required properties from req.body

  console.log(req.body)
  try {
    // Update the status field in the database based on the employee id
    await TeamLeadsModel.findByIdAndUpdate(id, {
      bdmStatus: oldStatus,
      bdmStatusChangeDate: new Date(bdmStatusChangeDate),
      bdmStatusChangeTime: bdmStatusChangeTime,
    });

    const company = await CompanyModel.findByIdAndUpdate(id, {
      bdmAcceptStatus: bdmAcceptStatus,
      bdmStatusChangeDate: new Date(bdmStatusChangeDate),
      bdmStatusChangeTime: bdmStatusChangeTime,
    });

    socketIO.emit("bdmDataAcceptedRequest" , {
      ename : company.ename,
      companyName : company["Company Name"]
    })

    console.log(company.ename)

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
    await TeamLeadsModel.findByIdAndUpdate(id, {
      bdmStatus: bdmnewstatus,
      Status: bdmnewstatus,
      bdmStatusChangeDate: new Date(bdmStatusChangeDate),
      bdmStatusChangeTime: time,
    });

    await CompanyModel.findByIdAndUpdate(id, {
      Status: bdmnewstatus,
      bdmStatusChangeDate: new Date(bdmStatusChangeDate),
      bdmStatusChangeTime: time,
    });

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
    

    if(bdmnewstatus === "Not Interested" || bdmnewstatus === "Junk" || bdmnewstatus === "Busy"){
      await LeadHistoryForInterestedandFollowModel.findOneAndDelete({
        _id : id
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

    await CompanyModel.findByIdAndUpdate(id, {
      bdmAcceptStatus: bdmAcceptStatus,
      bdmName: bdmName,
    }); // Corrected update

    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/teamleads-rejectdata/:id`, async (req, res) => {
  const id = req.params.id; // Corrected params extraction
  const { bdmAcceptStatus, bdmName, remarks } = req.body;
  console.log(bdmName , remarks)
  try {
    // Assuming TeamLeadsModel and CompanyModel are Mongoose models
    await TeamLeadsModel.findByIdAndDelete(id); // Corrected update

    await CompanyModel.findByIdAndUpdate(id, {
      bdmAcceptStatus: bdmAcceptStatus,
      bdmName: bdmName,
      Remarks : remarks
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
    //console.log(existingData);

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

  try {
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

    res.status(200).json({ message: "Company updated and deleted successfully" });
  } catch (error) {
    console.error("Error updating and deleting company:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//---------- request to reject revert back request -------------------------------------

router.post(`/rejectrequestrevertbackcompany`, async (req, res) => {
  const { companyId } = req.query;
  try {
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
  console.log(data)
  try {
    const updatePromises = data.map(async (company) => {
      const uploadDate = company.UploadDate === '$AssignDate' ? new Date() : company.UploadDate;
      await CompanyModel.findByIdAndUpdate(company._id, {
        ...company,
        UploadDate: uploadDate, // Set UploadDate to current date if it was '$AssignDate'
        bdmAcceptStatus: "Forwarded",
        bdmName: name,
        bdeForwardDate: new Date(),
        bdeOldStatus: company.Status
      });

      await TeamLeadsModel.create({
        ...company,
        _id: company._id,
        bdmName: name,
        bdeForwardDate: new Date()
      });
    });

    await Promise.all(updatePromises);
    console.log("Updated Data is :", updatePromises);
    res.status(200).json({ message: "Data created and updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



module.exports = router;