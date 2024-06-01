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

router.get("/forwardedbybdedata/:bdmName", async (req, res) => {
  const bdmName = req.params.bdmName;

  try {
    // Fetch data using lean queries to retrieve plain JavaScript objects
    const data = await TeamLeadsModel.find({
      bdmName: bdmName,
    }).lean();

    res.send(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/update-bdm-status/:id", async (req, res) => {
  const { id } = req.params;
  const {
    newBdmStatus,
    companyId,
    oldStatus,
    bdmAcceptStatus,
    bdmStatusChangeDate,
    bdmStatusChangeTime,
  } = req.body; // Destructure the required properties from req.body

  try {
    // Update the status field in the database based on the employee id
    await TeamLeadsModel.findByIdAndUpdate(id, {
      bdmStatus: oldStatus,
      bdmStatusChangeDate: new Date(bdmStatusChangeDate),
      bdmStatusChangeTime: bdmStatusChangeTime,
    });

    await CompanyModel.findByIdAndUpdate(id, {
      bdmAcceptStatus: bdmAcceptStatus,
      bdmStatusChangeDate: new Date(bdmStatusChangeDate),
      bdmStatusChangeTime: bdmStatusChangeTime,
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
  try {
    // Assuming TeamLeadsModel and CompanyModel are Mongoose models
    await TeamLeadsModel.findByIdAndDelete(id); // Corrected update

    await CompanyModel.findByIdAndUpdate(id, {
      bdmAcceptStatus: bdmAcceptStatus,
      bdmName: bdmName,
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
          bdmRemarks:"",
          RevertBackAcceptedCompanyRequest:"",
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

router.post(`/rejectrequestrevertbackcompany` , async(req , res)=>{
  const { companyId } = req.query;
  try{
    await CompanyModel.findOneAndUpdate(
      {_id : companyId},
      { $set :{
        RevertBackAcceptedCompanyRequest: "Reject",
      }}
    ) 
    await TeamLeadsModel.findOneAndUpdate(
      {_id : companyId},
      { $set :{
        RevertBackAcceptedCompanyRequest: "Reject",
      }}
    ) 
    res.status(200).json({ message : "Company Not Reverted Back"})
  }catch(error){
    res.status(500).json({error : "Internal Server Error"})
  }

})

//------------done request of reverted company--------------------------------

router.post(`/rejectedrequestdonebybdm` ,async(req , res)=>{
  const { companyId } = req.query;
  try{
    await CompanyModel.findOneAndUpdate(
      {_id : companyId},
      {
        $unset : {
          RevertBackAcceptedCompanyRequest : ""
        }
      }
    )
    await TeamLeadsModel.findOneAndUpdate(
      {_id : companyId},
      {
        $unset : {
          RevertBackAcceptedCompanyRequest : ""
        }
      }
    )

  }catch(error){
    res.status(500).json({error : "Internal Server Error"})
  }

})

module.exports = router;