var express = require('express');
var router = express.Router()
const dotenv = require('dotenv')
dotenv.config();


const CompanyRequestModel = require("../models/LeadsRequest");
const RequestModel = require("../models/Request");
const RequestGModel = require("../models/RequestG");
const RequestDeleteByBDE = require("../models/Deleterequestbybde");
const BookingsRequestModel = require("../models/BookingsEdit");
const RecentUpdatesModel = require("../models/RecentUpdates");
const EditableDraftModel = require("../models/EditableDraftModel");
const TeamLeadsModel = require("../models/TeamLeads.js");
const RequestMaturedModel = require("../models/RequestMatured.js");
const InformBDEModel = require("../models/InformBDE.js");


router.post("/requestCompanyData", async (req, res) => {
  const csvData = req.body;
  let dataArray = [];
  if (Array.isArray(csvData)) {
    dataArray = csvData;
  } else if (typeof csvData === "object" && csvData !== null) {
    dataArray.push(csvData);
  } else {
    // Handle invalid input
    console.error("Invalid input: csvData must be an array or an object.");
  }

  try {
    for (const employeeData of dataArray) {
      try {
        const employeeWithAssignData = {
          ...employeeData,
          AssignDate: new Date(),
        };
        //console.log("employeedata" , employeeData)
        const employee = new CompanyRequestModel(employeeWithAssignData);
        const savedEmployee = await employee.save();
        //console.log("savedemployee" , savedEmployee)
      } catch (error) {
        console.error("Error saving employee:", error.message);
        // res.status(500).json({ error: 'Internal Server Error' });

        // Handle the error for this specific entry, but continue with the next one
      }
    }

    res.status(200).json({ message: "Data sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.error("Error in bulk save:", error.message);
  }
});

router.post("/change-edit-request/:companyName", async (req, res) => {
  const companyName = req.params.companyName;
  const companyObject = req.body;

  try {
    const updatedCompany = await CompanyRequestModel.findOneAndUpdate(
      { "Company Name": companyName },
      { $set: companyObject },
      { new: true }
    );

    res.status(200).json(updatedCompany);
  } catch (error) {
    console.error("Error updating company:", error);
    res.status(500).json({ error: "Error updating company" });
  }
});


router.post("/requestData", async (req, res) => {
  const { selectedYear, companyType, numberOfData, name, cTime, cDate } =
    req.body;

  try {
    // Create a new RequestModel instance
    const newRequest = new RequestModel({
      year: selectedYear,
      ctype: companyType,
      dAmount: numberOfData,
      ename: name,
      cTime: cTime,
      cDate: cDate,
      AssignRead: false,
    });

    // Save the data to MongoDB
    const savedRequest = await newRequest.save();

    // Emit a socket event to notify clients about the new request
    socketIO.emit("newRequest", savedRequest);

    res.json(savedRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/setMarktrue/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Find the object by ID and update the AssignRead property to true
    const updatedObject = await RequestGModel.findByIdAndUpdate(
      id,
      { AssignRead: true },
      { new: true } // Return the updated object after the update operation
    );
    // Optionally, you can send the updated object back in the response
    res.json(updatedObject);
    socketIO.emit("request-seen");
  } catch (error) {
    // Handle any errors that occur during the update operation
    console.error("Error updating object:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the object." });
  }
});

router.post("/requestgData", async (req, res) => {
  const { numberOfData, name, cTime, cDate } = req.body;

  try {
    // Create a new RequestModel instance
    const newRequest = new RequestGModel({
      dAmount: numberOfData,
      ename: name,
      cTime: cTime,
      cDate: cDate,
    });

    // Save the data to MongoDB
    const savedRequest = await newRequest.save();
    socketIO.emit("newRequest", savedRequest);
    // Emit a socket.io message when a new request is posted
    // io.emit('newRequest', savedRequest);

    res.json(savedRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/requestData", async (req, res) => {
  try {
    // Retrieve all data from RequestModel
    const allData = await RequestModel.find();
    res.json(allData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/requestgData", async (req, res) => {
  try {
    // Retrieve all data from RequestModel
    const allData = await RequestGModel.find();
    res.json(allData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/requestData/:id", async (req, res) => {
  const { id } = req.params;
  const { read, assigned } = req.body;

  try {
    // Update the 'read' property in the MongoDB model
    const updatedNotification = await RequestModel.findByIdAndUpdate(
      id,
      { read, assigned },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json(updatedNotification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/requestgData/:id", async (req, res) => {
  const { id } = req.params;
  const { read, assigned } = req.body;

  try {
    // Update the 'read' property in the MongoDB model
    const updatedNotification = await RequestGModel.findByIdAndUpdate(
      id,
      { read, assigned },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json(updatedNotification);
    socketIO.emit("data-sent");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
  
router.post("/deleterequestbybde", async (req, res) => {
  try {
    const {
      companyName,
      Id,
      companyID,
      time,
      date,
      request,
      ename,
      bookingIndex,
    } = req.body;
    const socketIO = req.io;

    // Check if the request already exists
    const findRequest = await RequestDeleteByBDE.findOne({
      companyName,
      bookingIndex,
      request: false,
    });
    if (findRequest) {
      return res.status(400).json({ message: "Request already exists" });
    }

    // Create a new delete request object
    const deleteRequest = new RequestDeleteByBDE({
      companyName,
      Id,
      companyID,
      time,
      date,
      request,
      ename,
      bookingIndex,
    });

    // Save the delete request to the database
    await deleteRequest.save();
    socketIO.emit('delete-booking-requested');
    res.status(200).json({ message: "Delete request created successfully" });
  } catch (error) {
    console.error("Error creating delete request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/deleterequestbybde", async (req, res) => {
  try {
    const company = await RequestDeleteByBDE.find();
    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/editRequestByBde", async (req, res) => {
  try {
    const company = await BookingsRequestModel.find();
    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/deleterequestbybde/:id", async (req, res) => {
  try {
    const companyName = req.params.cname;
    // Find document by company name and delete it
    const updatedCompany = await RequestDeleteByBDE.findOneAndUpdate(
      { companyName, request: undefined },
      { $set: { request: true } },
      { new: true }
    );
    if (!updatedCompany) {
      return res.status(404).json({ error: "Company not found" });
    }

    // If document is deleted successfully, return the deleted document
    res.json(updatedCompany);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/delete-data/:ename", async (req, res) => {
  const { ename } = req.params;

  try {
    // Delete all data objects with the given ename
    await CompanyRequestModel.deleteMany({ ename });

    // Send success response
    res.status(200).send("Data deleted successfully");
  } catch (error) {
    // Send error response
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/update-bdm-Request/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const { requestStatus } = req.body;

    // Find the BDM request by ID and update the requestStatus
    const updatedRequest = await RequestMaturedModel.findByIdAndUpdate(
      _id,
      { requestStatus },
      { new: true } // Return the updated document
    );
    const changeStatus = await TeamLeadsModel.findOneAndUpdate(
      {
        "Company Name": updatedRequest["Company Name"],
      },
      {
        bdmOnRequest: false,
      },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "BDM request not found" });
    }

    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error("Error updating BDM request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.delete("/delete-inform-Request/:id", async (req, res) => {
  try {
    const _id = req.params.id;

    // Find the BDM request by ID and delete it
    const deletedRequest = await InformBDEModel.findByIdAndDelete(_id);

    if (!deletedRequest) {
      return res.status(404).json({ message: "BDM request not found" });
    }

    res.status(200).json({ message: "BDM request deleted successfully" });
  } catch (error) {
    console.error("Error deleting BDM request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/edit-moreRequest/:companyName/:bookingIndex",
  async (req, res) => {
    try {
      const { companyName, bookingIndex } = req.params;
      const newData = req.body;
      const requestDate = new Date();
      const createdData = await EditableDraftModel.create({
        "Company Name": companyName,
        bookingIndex,
        requestDate,
        ...newData,
      });

      res.status(201).json(createdData);
    } catch (error) {
      console.error("Error creating data:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get("/recent-updates", async (req, res) => {
  try {
    // Fetch all data from the RecentUpdatesModel
    const recentUpdates = await RecentUpdatesModel.find();

    // Send the retrieved data as a response
    res.status(200).json(recentUpdates);
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error("Error fetching recent updates:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/requestCompanyData", async (req, res) => {
  try {
    const data = await CompanyRequestModel.find();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

  module.exports = router;