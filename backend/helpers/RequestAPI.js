var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
const path = require("path");
const multer = require('multer');
const fs = require("fs");
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
const NotiModel = require('../models/Notifications.js');
const adminModel = require('../models/Admin.js');
const { clouddebugger } = require('googleapis/build/src/apis/clouddebugger/index.js');
const PaymentApprovalRequestModel = require('../models/PaymentApprovalRequest.js');
//const PaymentApprovalRequest = require('../models/PaymentApprovalRequest.js')


router.post("/requestCompanyData", async (req, res) => {
  const csvData = req.body;

  const socketIO = req.io;
  let dataArray = [];
  if (Array.isArray(csvData)) {
    dataArray = csvData;
    console.log("dataArray", dataArray)
  } else if (typeof csvData === "object" && csvData !== null) {
    dataArray.push(csvData);
  } else {
    // Handle invalid input
    console.error("Invalid input: csvData must be an array or an object.");
  }
  const ename = dataArray[0].ename

  try {
    for (const employeeData of dataArray) {
      try {
        const employeeWithAssignData = {
          ...employeeData,
          AssignDate: new Date(),
          assigned: "Pending",
          requestDate: new Date(),
          UploadDate: new Date(),
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

    const GetEmployeeData = await adminModel.findOne({ ename: ename }).exec();
    let GetEmployeeProfile = "no-image"
    if (GetEmployeeData) {
      const EmployeeData = GetEmployeeData.employee_profile;
      console.log("Employee Data:", EmployeeData);

      if (EmployeeData && EmployeeData.length > 0) {
        GetEmployeeProfile = EmployeeData[0].filename;

      } else {
        GetEmployeeProfile = "no-image";
      }
    } else {
      GetEmployeeProfile = "no-image";
    }


    const requestCreate = {
      ename: ename,
      requestType: "Lead Upload",
      requestTime: new Date(),
      designation: "SE",
      status: "Unread",
      employee_status: "Unread",
      img_url: GetEmployeeProfile,
      companyName: "Approved Bulk Leads"
    }
    const addRequest = new NotiModel(requestCreate);
    const saveRequest = await addRequest.save();
    socketIO.emit('approve-request', ename);


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
  const socketIO = req.io;
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
    const GetEmployeeData = await adminModel.findOne({ ename: name }).exec();
    let GetEmployeeProfile = "no-image"
    if (GetEmployeeData) {
      const EmployeeData = GetEmployeeData.employee_profile;
      console.log("Employee Data:", EmployeeData);

      if (EmployeeData && EmployeeData.length > 0) {
        GetEmployeeProfile = EmployeeData[0].filename;

      } else {
        GetEmployeeProfile = "no-image";
      }
    } else {
      GetEmployeeProfile = "no-image";
    }

    const requestCreate = {
      ename: name,
      requestType: `${dAmonut} of `,
      requestTime: new Date(),
      designation: "SE",
      status: "Unread",
      img_url: GetEmployeeProfile
    }
    const addRequest = new NotiModel(requestCreate);
    const saveRequest = await addRequest.save();
    console.log("saved", savedRequest)

    // Emit a socket event to notify clients about the new request
    socketIO.emit("newRequest", savedRequest);

    res.status(200).json(savedRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//  ---------------------------------------------  Notification components ------------------------------------------

router.get("/get-notification", async (req, res) => {
  try {
    // Query to get the top 5 unread notifications sorted by requestTime
    const topUnreadNotifications = await NotiModel.find({ status: "Unread" })
      .sort({ requestTime: -1 })
      .limit(5);

    // Query to get the count of all unread notifications
    const totalUnreadCount = await NotiModel.countDocuments({ status: "Unread" });

    // Respond with both the top unread notifications and the total count
    res.status(200).json({
      topUnreadNotifications,
      totalUnreadCount
    });
  } catch (err) {
    console.error("Error fetching notifications", err);
    res.status(500).json({ message: "Error fetching notifications", error: err });
  }
});
router.get("/get-notification/:name", async (req, res) => {
  try {
    const { name } = req.params;
    console.log("name", name);

    // Query to get the top 5 unread notifications sorted by requestTime
    if (name) {
      const topUnreadNotifications = await NotiModel.find({
        ename: name,
        employee_status: "Unread",
        employeeRequestType: { $ne: null, $ne: "", $exists: true }
        //srequestType: { $ne: "Lead Upload" } // Corrected this line
      })
        .sort({ requestTime: -1 })
        .limit(5);
      //console.log("unred employee notification", topUnreadNotifications)
      // Query to get the count of all unread notifications for the specified ename
      const totalUnreadCount = await NotiModel.countDocuments({
        ename: name,
        employee_status: "Unread",
        employeeRequestType: { $ne: null, $ne: "", $exists: true }
      });

      // Respond with both the top unread notifications and the total count
      res.status(200).json({
        topUnreadNotifications,
        totalUnreadCount
      });

    }

  } catch (err) {
    console.error("Error fetching notifications", err);
    res.status(500).json({ message: "Error fetching notifications", error: err });
  }
});

router.put('/update-notification/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedNotification = await NotiModel.findByIdAndUpdate(
      id,
      { status: 'read' },
      { new: true } // Returns the updated document
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json(updatedNotification);
  } catch (err) {
    console.error("Error updating notification status", err);
    res.status(500).json({ message: "Error updating notification status", error: err });
  }
});

router.put('/update-notification-employee/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedNotification = await NotiModel.findByIdAndUpdate(
      id,
      { employee_status: 'read' },
      { new: true } // Returns the updated document
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json(updatedNotification);
  } catch (err) {
    console.error("Error updating notification status", err);
    res.status(500).json({ message: "Error updating notification status", error: err });
  }
});
router.post("/setMarktrue/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const socketIO = req.io;

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

  try {
    const { numberOfData, name, cTime, cDate } = req.body;
    const socketIO = req.io;
    // Create a new RequestModel instance
    const newRequest = new RequestGModel({
      dAmount: numberOfData,
      ename: name,
      cTime: cTime,
      cDate: cDate,
    });

    // Save the data to MongoDB
    const savedRequest = await newRequest.save();
    const GetEmployeeData = await adminModel.findOne({ ename: name }).exec();
    let GetEmployeeProfile = "no-image"
    if (GetEmployeeData) {
      const EmployeeData = GetEmployeeData.employee_profile;


      if (EmployeeData && EmployeeData.length > 0) {
        GetEmployeeProfile = EmployeeData[0].filename;

      } else {
        GetEmployeeProfile = "no-image";
      }
    } else {
      GetEmployeeProfile = "no-image";
    }

    const requestCreate = {
      ename: name,
      requestType: "Lead Data",
      requestTime: new Date(),
      designation: "SE",
      status: "Unread",
      employee_status: "Unread",
      img_url: GetEmployeeProfile,
    }
    const addRequest = new NotiModel(requestCreate);
    const saveRequest = await addRequest.save();


    socketIO.emit("newRequest", {
      name: name,
      dAmonut: numberOfData,
    });
    // Emit a socket.io message when a new request is posted
    // io.emit('newRequest', savedRequest);

    res.json(savedRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/gDataByAdmin", async (req, res) => {

  try {
    const { numberOfData, name, cTime, cDate } = req.body;
    const socketIO = req.io;
    // Create a new RequestModel instance
    const newRequest = new RequestGModel({
      dAmount: numberOfData,
      ename: name,
      cTime: cTime,
      cDate: cDate,
      assigned_status: "New Leads Assigned"
    });

    // Save the data to MongoDB
    const savedRequest = await newRequest.save();
    const GetEmployeeData = await adminModel.findOne({ ename: name }).exec();
    let GetEmployeeProfile = "no-image"
    if (GetEmployeeData) {
      const EmployeeData = GetEmployeeData.employee_profile;


      if (EmployeeData && EmployeeData.length > 0) {
        GetEmployeeProfile = EmployeeData[0].filename;

      } else {
        GetEmployeeProfile = "no-image";
      }
    } else {
      GetEmployeeProfile = "no-image";
    }

    const requestCreate = {
      ename: name,
      requestType: "Lead Upload",
      requestTime: new Date(),
      designation: "SE",
      status: "Unread",
      employee_status: "Unread",
      companyName: "Approved Bulk Leads",
      employeeRequestType: "Leads Are Assigned",
    };
    const addRequest = new NotiModel(requestCreate);
    const saveRequest = await addRequest.save();


    socketIO.emit("new-leads-assigned", {
      name: name,
      dAmonut: numberOfData,
    });
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

function parseDateString2(dateString) {
  return new Date(dateString); // This will correctly parse the date format
}

router.get('/requestgData/:ename', async (req, res) => {
  const { ename } = req.params;

  try {
    const sevenDaysAgo = getDate7DaysAgo();
    const allData = await RequestGModel.find({ ename });

    const filteredCompany = allData.filter(item => {
      const itemDate = parseDateString2(item.cDate);
      return itemDate >= sevenDaysAgo;
    });

    res.status(200).json(filteredCompany); // sReturn the filtered data
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
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

    const updateNotificationModel = await NotiModel.findOneAndUpdate(
      { companyName: "Number Leads Approved" },
      {
        $set: {
          employeeRequestType: "Leads Are Approved",
          employee_status: "Unread"
        }
      },
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
    const socketIO = req.io;

    // Update the 'read' property in the MongoDB model
    const updatedNotification = await RequestGModel.findByIdAndUpdate(
      id,
      { read, assigned },
      { new: true }
    );

    const updateNotificationModel = await NotiModel.findOneAndUpdate(
      { companyName: "Number Leads Approved" },
      {
        $set: {
          employeeRequestType: `${updatedNotification.dAmount} Leads Are Approved`,
          employee_status: "Unread"
        }
      },
      { new: true }
    )

    const name = updatedNotification.ename;
    if (!updatedNotification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    const GetEmployeeData = await adminModel.findOne({ ename: name }).exec();
    let GetEmployeeProfile = "no-image"
    if (GetEmployeeData) {
      const EmployeeData = GetEmployeeData.employee_profile;
      //console.log("Employee Data:", EmployeeData);

      if (EmployeeData && EmployeeData.length > 0) {
        GetEmployeeProfile = EmployeeData[0].filename;

      } else {
        GetEmployeeProfile = "no-image";
      }
    } else {
      GetEmployeeProfile = "no-image";
    }

    const requestCreate = {
      ename: name,
      requestType: "Lead Data",
      requestTime: new Date(),
      designation: "SE",
      status: "Unread",
      employee_status: "Unread",
      img_url: GetEmployeeProfile
    }
    const addRequest = new NotiModel(requestCreate);
    const saveRequest = await addRequest.save();
    socketIO.emit("data-sent", {
      name: name,
      dAmount: updatedNotification.dAmount
    });

    res.status(200).json(updatedNotification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// router.delete("/requestgData/:id", async (req, res) => {
//   const { id } = req.params;
//   try {

//     // Update the 'read' property in the MongoDB model
//     const updatedNotification = await RequestGModel.findByIdAndDelete(
//       id
//     );
//     res.status(200).json({ error: "Request Deleted" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.delete("/requestgData/:id", async (req, res) => {
  const { id } = req.params;
  const socketIO = req.io;

  try {
    // Find the document by its ID
    const notification = await RequestGModel.findById(id);

    const updateNotificationModel = await NotiModel.findOneAndUpdate(
      { companyName: "Number Leads Approved" },
      {
        $set: {
          employeeRequestType: `${notification.dAmount} Leads Are Rejected`,
          employee_status: "Unread"
        }
      },
      { new: true }
    )

    // If the document doesn't exist, return an error
    if (!notification) {
      return res.status(404).json({ error: "Request not found" });
    }

    // Use the data before deleting it
    // For example, you can log the data or emit it to a socket event
    socketIO.emit("delete-leads-request-bde", {
      name: notification.ename,
      dAmount: notification.dAmount,
      // add other properties you need to use here
    });

    // Delete the document after using its data
    await RequestGModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Request Deleted" });
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
      assigned
    } = req.body;
    const socketIO = req.io;

    // Check if the request already exists
    const findRequest = await RequestDeleteByBDE.findOne({
      companyName,
      bookingIndex,
      request: false,
    });
    console.log(findRequest)

    if (findRequest) {
      if (findRequest.assigned === "Reject") {
        return res.status(400).json({ message: "Request already rejected by admin" });
      } else {
        return res.status(400).json({ message: "Request already exists" });
      }
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
      assigned
    });

    // Save the delete request to the database
    await deleteRequest.save();

    const GetEmployeeData = await adminModel.findOne({ ename: ename }).exec();
    let GetEmployeeProfile = "no-image";
    if (GetEmployeeData) {
      const EmployeeData = GetEmployeeData.employee_profile;
      console.log("Employee Data:", EmployeeData);

      if (EmployeeData && EmployeeData.length > 0) {
        GetEmployeeProfile = EmployeeData[0].filename;
      }
    }

    const requestCreate = {
      ename: ename,
      requestType: "Booking Delete",
      requestTime: new Date(),
      designation: "SE",
      status: "Unread",
      employee_status: "Unread",
      img_url: GetEmployeeProfile,
      companyName: companyName
    };
    console.log("requestcreate", requestCreate)
    const addRequest = new NotiModel(requestCreate);
    await addRequest.save();

    socketIO.emit('delete-booking-requested', ename);
    res.status(200).json({ message: "Delete request created successfully" });
  } catch (error) {
    console.error("Error creating delete request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/deleterequestbybde", async (req, res) => {
  try {
    const company = await RequestDeleteByBDE.find({ assigned: "Pending" });
    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

function parseDateString(dateString) {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
}

function getDate7DaysAgo() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ensure the time is set to the start of the day
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  return sevenDaysAgo;
}
router.get("/deleterequestbybde/:ename", async (req, res) => {
  const { ename } = req.params;
  try {
    const sevenDaysAgo = getDate7DaysAgo();
    const company = await RequestDeleteByBDE.find({ ename });

    // Filter company based on the date field within the last 7 days
    const filteredCompany = company.filter(item => {
      const itemDate = parseDateString(item.date);
      return itemDate >= sevenDaysAgo;
    });

    console.log("company", filteredCompany);
    res.status(200).json(filteredCompany);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// router.get("/deleterequestbybde/:ename", async (req, res) => {
//   const { ename } = req.params;
//   try {
//     const company = await RequestDeleteByBDE.find({ename : ename});
//     //console.log("company" , company)
//     res.status(200).json(company);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.get("/editRequestByBde", async (req, res) => {
  try {
    const company = await BookingsRequestModel.find();
    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/deleterequestbybde/:id", async (req, res) => {
  const { companyName } = req.body
  try {
    const _id = req.params.id;
    const socketIO = req.io;
    // Find document by ID and update the assigned field
    const updatedCompany = await RequestDeleteByBDE.findOneAndUpdate(
      { _id: _id },
      { assigned: "Reject" },
      { new: true }
    );

    const updateNotification = await NotiModel.findOneAndUpdate(
      { companyName: companyName },
      {
        $set: {
          employeeRequestType: `Booking Request has been Rejected`,
          employee_status: "Unread"
        }
      },
      { new: true }
    )

    if (!updatedCompany) {
      return res.status(404).json({ error: "Company not found" });
    }

    socketIO.emit('delete-request-done-ondelete', {
      name: updatedCompany.ename,
      companyName: updatedCompany.companyName
    });

    // If document is updated successfully, return the updated document
    res.json(updatedCompany);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// router.delete("/delete-data/:ename", async (req, res) => {
//   const { ename } = req.params;
//   const socketIO = req.io;

//   try {
//     // Delete all data objects with the given ename
//     await CompanyRequestModel.deleteMany({ ename });
//     socketIO.emit('data-action-performed', ename)

//     // Send success response
//     res.status(200).send("Data deleted successfully");
//   } catch (error) {
//     // Send error response
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.post("/update-data/:ename", async (req, res) => {
  const { ename } = req.params;
  const updatedCsvData = req.body; // Ensure you're sending the CSV data in the request body
  const socketIO = req.io;
  const currentDate = new Date();
  const time = `${currentDate.getHours()}:${currentDate.getMinutes()}`;
  const date = currentDate.toISOString().split("T")[0]; // Get the date in YYYY-MM-DD format

  try {
    // Loop through each item in the CSV data
    for (const employeeData of updatedCsvData) {
      // Update the assigned field for each employee data
      await CompanyRequestModel.updateOne({ _id: employeeData._id }, { assigned: "Accept" });
    }

    const updateNotificationModel = await NotiModel.findOneAndUpdate(
      { companyName: "Approved Bulk Leads" },
      {
        $set: {
          employeeRequestType: "Leads Are Approved",
          employee_status: "Unread"
        }
      },
      { new: true }
    )

    // Emit an event to notify clients
    socketIO.emit('data-action-performed', ename);

    // Send success response
    res.status(200).send("Data updated successfully");
  } catch (error) {
    console.error("Error updating data:", error.message);
    // Send error response if any exception occurs
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.post("/update-data-ondelete/:ename", async (req, res) => {
  const { ename } = req.params;
  const updatedCsvData = req.body; // Ensure you're sending the CSV data in the request body
  const socketIO = req.io;
  const currentDate = new Date();
  const time = `${currentDate.getHours()}:${currentDate.getMinutes()}`;
  const date = currentDate.toISOString().split("T")[0]; // Get the date in YYYY-MM-DD format

  try {
    // Loop through each item in the CSV data
    for (const employeeData of updatedCsvData) {
      // Update the assigned field for each employee data
      await CompanyRequestModel.updateOne({ _id: employeeData._id }, { assigned: "Reject" });
    }
    const updateNotificationModel = await NotiModel.findOneAndUpdate(
      { companyName: "Approved Bulk Leads" },
      {
        $set: {
          employeeRequestType: "Leads Are Rejected",
          employee_status: "Unread"
        }
      },
      { new: true }
    )
    // Emit an event to notify clients
    socketIO.emit('data-action-performed-ondelete', ename);

    // Send success response
    res.status(200).send("Data updated successfully");
  } catch (error) {
    console.error("Error updating data:", error.message);
    // Send error response if any exception occurs
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
      const socketIO = req.io;
      const newData = req.body;
      const requestDate = new Date();
      const createdData = await EditableDraftModel.create({
        "Company Name": companyName,
        bookingIndex,
        requestDate,
        assigned: "Pending",
        ...newData,
      });
      const name = newData.bdeName;
      const bdmName = newData.bdmName;
      const GetEmployeeData = await adminModel.findOne({ ename: name }).exec();
      let GetEmployeeProfile = "no-image"
      if (GetEmployeeData) {
        const EmployeeData = GetEmployeeData.employee_profile;
        console.log("Employee Data:", EmployeeData);

        if (EmployeeData && EmployeeData.length > 0) {
          GetEmployeeProfile = EmployeeData[0].filename;

        } else {
          GetEmployeeProfile = "no-image";
        }
      } else {
        GetEmployeeProfile = "no-image";
      }

      const requestCreate = {
        ename: name,
        requestType: "Booking Edit",
        requestTime: new Date(),
        designation: "SE",
        status: "Unread",
        employee_status: "Unread",
        img_url: GetEmployeeProfile,
        companyName: companyName
      }
      const addRequest = new NotiModel(requestCreate);
      const saveRequest = await addRequest.save();

      socketIO.emit('editBooking_requested', {
        bdeName: name,
        bdmName: bdmName,
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
    const data = await CompanyRequestModel.find({ assigned: "Pending" });
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// router.get("/requestCompanyData/:ename", async (req, res) => {
//   const { ename } = req.params;
//   try {
//     const allData = await CompanyRequestModel.find({ ename: ename });
//     res.status(200).json(allData);
//   } catch (error) {
//     console.error("Error fetching data:", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

router.get("/requestCompanyData/:ename", async (req, res) => {
  const { ename } = req.params;
  try {
    const sevenDaysAgo = getDate7DaysAgo();
    const allData = await CompanyRequestModel.find({ ename: ename });
    const filteredCompany = allData.filter(item => {
      const itemDate = new Date(item.requestDate);
      return itemDate >= sevenDaysAgo;
    })
    //console.log("fileterd" , filteredCompany)
    res.status(200).json(filteredCompany)

  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
})

// Payment Approval Request APIs :
// Configure multer storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './Payment-Request');
//   },
//   filename: function (req, file, cb) {
//     // Ensure company name is included in the filename
//     const companyName = req.body.companyName.replace(/\s+/g, '-'); // Replace spaces with hyphens
//     const fileName = `${companyName}-${Date.now()}-${file.originalname}`;
//     cb(null, fileName);
//   }
// });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { companyName } = req.body;

    let destinationPath = path.resolve(__dirname, '../Payment-Request', companyName);

    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/paymentApprovalRequestByBde', upload.single('attachment'), async (req, res) => {
  const {
    ename,
    designation,
    branchOffice,
    companyName,
    serviceType,
    minimumPrice,
    clientRequestedPrice,
    requestType,
    reason,
    remarks,
    requestDate,
    assigned
  } = req.body;

  const attachments = req.file ? req.file.path : null; // Get the filename of the uploaded file

  // console.log(ename, designation, branchOffice, companyName, minimumPrice, clientRequestedPrice, requestType, reason, assigned, requestDate);
  // console.log("Attachment is :", attachments);

  const socketIO = req.io;

  try {
    const newRequest = new PaymentApprovalRequestModel({
      ename,
      designation,
      branchOffice,
      companyName,
      serviceType,
      minimumPrice,
      clientRequestedPrice,
      requestType,
      reason,
      remarks,
      requestDate,
      assigned,
      attachments
    });

    await newRequest.save();

    // Create new notification
    const GetEmployeeData = await adminModel.findOne({ ename: ename }).exec();
    let GetEmployeeProfile = "no-image";
    if (GetEmployeeData) {
      const EmployeeData = GetEmployeeData.employee_profile;
      if (EmployeeData && EmployeeData.length > 0) {
        GetEmployeeProfile = EmployeeData[0].filename;
      }
    }
    const requestCreate = {
      ename: ename,
      requestType: "Payment Approval",
      requestTime: new Date(),
      designation: designation,
      status: "Unread",
      employee_status: "Unread",
      img_url: GetEmployeeProfile,
      companyName:companyName,
      paymentApprovalServices:serviceType
    };
    const addRequest = new NotiModel(requestCreate);
    await addRequest.save();
    socketIO.emit("payment-approval-request", {
      name: ename,
      companyName: companyName,
    });
    res.status(201).json({ message: 'Payment approval request created successfully' });
  } catch (error) {
    console.error('Error creating payment approval request', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get("/paymentApprovalRequestByBde", async (req, res) => {
  try {
    // Retrieve all data from RequestModel
    const allData = await PaymentApprovalRequestModel.find();
    res.json(allData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/paymentApprovalRequestByBde/:ename", async (req, res) => {
  const { ename } = req.params;
  
  try {
    // Retrieve all data from RequestModel
    const allData = await PaymentApprovalRequestModel.find({ename : ename});
   
    res.status(200).json(allData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/fetchPaymentApprovalRequestFromId/:id", async (req, res) => {
  const { id } = req.params;
  try {

    const reqestedData = await PaymentApprovalRequestModel.findById(id);
    if (!reqestedData) {
      res.status(404).json({ result: false, message: "Request not found" });
    }
    res.status(200).json({ result: true, message: "Data successfully fetched", data: reqestedData });
  } catch (error) {
    res.status(500).json({ result: false, message: "Error fetching request", error: error });
  }
});

//---------payment approval accept api------------------------------
router.put('/paymentApprovalRequestAcceptByAdmin/:id', upload.single('attachment'), async (req, res) => {
  const {
    ename,
    designation,
    branchOffice,
    companyName,
    serviceType,
    minimumPrice,
    clientRequestedPrice,
    requestType,
    reason,
    remarks,
    adminRemarks,
    requestDate,
    assigned
  } = req.body;
  const socketIO = req.io;
  const attachment = req.file ? req.file.path : null; // Get the path of the uploaded file

  const { id } = req.params;

  const updatedData = {
    ename,
    designation,
    branchOffice,
    companyName,
    serviceType,
    minimumPrice,
    clientRequestedPrice,
    requestType,
    reason,
    remarks,
    adminRemarks,
    requestDate,
    assigned,
  };

  if (attachment) {
    updatedData.attachment = attachment;
  }

  try {
    const updatedRequest = await PaymentApprovalRequestModel.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Payment approval request not found' });
    }

    // Create new notification
    const { ename, designation, branchOffice } = req.body;
    const GetEmployeeData = await adminModel.findOne({ ename: ename }).exec();
    let GetEmployeeProfile = "no-image";
    if (GetEmployeeData) {
      const EmployeeData = GetEmployeeData.employee_profile;
      if (EmployeeData && EmployeeData.length > 0) {
        GetEmployeeProfile = EmployeeData[0].filename;
      }
    }
    const updateNotification = await NotiModel.findOneAndUpdate(
      {  
        companyName,
        ename,
        paymentApprovalServices: { $all: serviceType } 
      },
      {
        $set: {
          employeeRequestType: `Payment Approval Request has been ${assigned}`,
          employee_status: "Unread"
        }
      },
      { new: true }
    );
    if (assigned === "Approved") {
      socketIO.emit("payment-approval-requets-accept", {
        name: ename,
        companyName: companyName,
      });
    } else if (assigned === "Rejected") {
      socketIO.emit("payment-approval-requets-reject", {
        name: ename,
        companyName: companyName,
      });

    }
    res.status(200).json({ message: 'Payment approval request updated successfully', data: updatedRequest });
  } catch (error) {
    console.error('Error updating payment approval request', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//------------------viewpaymentapprovaldocs------------------------



module.exports = router;