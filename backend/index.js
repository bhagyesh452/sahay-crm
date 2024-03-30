const express = require("express");
const cors = require("cors");
const compression = require('compression');
// const { Server } = require("socket.io");
// const http = require("http");
// const server = http.createServer(app);
// const session = require('express-session');
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const { OAuth2Client } = require('google-auth-library');
// const nodemailer = require('nodemailer');
const mongoose = require("mongoose");
// const googleAuthRouter = require('./helpers/googleAuth');
const adminModel = require("./models/Admin");
const CompanyModel = require("./models/Leads");
const CompanyRequestModel = require("./models/LeadsRequest");
const RequestModel = require("./models/Request");
const path = require("path");
const fs = require("fs");
const RequestGModel = require("./models/RequestG");
const { exec } = require("child_process");
const jwt = require("jsonwebtoken");
const onlyAdminModel = require("./models/AdminTable");
const LeadModel = require("./models/Leadform");
const DeletedDatabase = require("./models/DeletedCollection");
const { sendMail } = require("./helpers/sendMail");
const { mailFormat } = require("./helpers/mailFormat");
const multer = require("multer");
// const authRouter = require('./helpers/Oauth');
// const requestRouter = require('./helpers/request');
const RemarksHistory = require("./models/RemarksHistory");
const EmployeeHistory = require("./models/EmployeeHistory");
const LoginDetails = require("./models/loginDetails");
const RequestDeleteByBDE = require("./models/Deleterequestbybde");
const BookingsRequestModel = require("./models/BookingsEdit");
const json2csv = require('json2csv').parse;
const fastCsv = require('fast-csv');
const RecentUpdatesModel = require("./models/RecentUpdates");
const FollowUpModel = require("./models/FollowUp");
const DraftModel = require("./models/DraftLeadform");
const { type } = require("os");
const LeadModel_2 = require("./models/Leadform_2");
const RedesignedLeadformModel = require("./models/RedesignedLeadform");
const RedesignedDraftModel = require("./models/RedesignedDraftModel");


// const http = require('http');
// const socketIo = require('socket.io');
require("dotenv").config();

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(compression());
// app.use(session({
//   secret: 'boombadaboom', // Replace with a secret key for session encryption
//   resave: false,
//   saveUninitialized: false,
// }));
// app.use(passport.initialize())
// app.use(passport.session());
var http = require("http").createServer(app);
var socketIO = require("socket.io")(http, {
  cors: {
    origin: " * ",
  },
});
// const server = http.createServer(app);
// const io = socketIo(server);

mongoose

  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.log(err);
  });
// const secretKey = 'random32numberjsonwebtokenrequire';
const secretKey = process.env.SECRET_KEY || "mydefaultsecret";

app.get("/api", (req, res) => {
  console.log(req.url);
  res.send("hello from backend!");
});

app.post("/api/admin/login-admin", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  // Simulate user authentication (replace with actual authentication logic)
  // (u) => u.email === username && u.password === password
  // const user = await adminModel.find();

  const user = await onlyAdminModel.findOne({
    admin_email: username,
    admin_password: password,
  });
  //console.log(user);
  if (user) {
    // Generate a JWT token
    // console.log("user is appropriate");
    const adminName = user.admin_name
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1h",
    });
    res.json({ token , adminName });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Login for employee

// app.post("/api/employeelogin", async (req, res) => {
//   const { email, password } = req.body;

//   // Replace this with your actual Employee authentication logic
//   const user = await adminModel.findOne({
//     email: email,
//     password: password,
//     designation: "Sales Executive",
//   });
//   // console.log(user);

//   if (user) {
//     const newtoken = jwt.sign({ employeeId: user._id }, secretKey, {
//       expiresIn: "10h",
//     });
//     res.json({ newtoken });
//     socketIO.emit('Employee-login');
   
    
//   } else {
//     res.status(401).json({ message: "Invalid credentials" });
//   }
// });

app.post("/api/employeelogin", async (req, res) => {
  const { email, password } = req.body;

  // Replace this with your actual Employee authentication logic
  const user = await adminModel.findOne({
    email: email,
    password: password,
    //designation: "Sales Executive",
  });

  if (!user) {
    // If user is not found
    return res.status(401).json({ message: "Invalid email or password" });
  } else if (user.designation !== "Sales Executive") {
    // If designation is incorrect
    return res.status(401).json({ message: "Designation is incorrect" });
  } else {
    // If credentials are correct
    const newtoken = jwt.sign({ employeeId: user._id }, secretKey, {
      expiresIn: "10h",
    });
    res.json({ newtoken });
    socketIO.emit('Employee-login');
  }
});







app.put('/api/online-status/:id/:socketID', async (req, res) => {
  const { id } = req.params;
  const { socketID }  = req.params;
console.log(socketID)
  try {
    const admin = await adminModel.findByIdAndUpdate(id, { Active: socketID }, { new: true });
    res.status(200).json(admin);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.put('/api/online-status/:id/disconnect', async (req, res) => {
  const { id } = req.params;
  const date = new Date().toString();
  try {
    const admin = await adminModel.findByIdAndUpdate(id, { Active: date }, { new: true });
    res.status(200).json(admin);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post("/api/processingLogin", async (req, res) => {
  const { username, password } = req.body;

  // Replace this with your actual Employee authentication logic
  const user = await adminModel.findOne({
    email: username,
    password: password,
    designation: "Admin Team",
  });

  if (user) {
    const ename = user.ename;
    const processingToken = jwt.sign({ employeeId: user._id }, secretKey, {
      expiresIn: "10h",
    });
    res.json({ processingToken, ename });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

const deleteAllData = async () => {
  try {
    const result = await CompanyModel.deleteMany({});
    // console.log(` documents deleted successfully.`);
  } catch (error) {
    console.error("Error deleting documents:", error.message);
  } finally {
    mongoose.connection.close();
  }
};

// deleteAllData();

app.post("/api/leads", async (req, res) => {
  const csvData = req.body;
  let counter = 0;
  let sucessCounter = 0;

  try {
    for (const employeeData of csvData) {
      try {
        const employeeWithAssignData = {
          ...employeeData,
          AssignDate: new Date(),
        };
        const employee = new CompanyModel(employeeWithAssignData);
        const savedEmployee = await employee.save();
        sucessCounter++;
      } catch (error) {
        console.error("Error saving employee:", error.message);
        counter++;
        // res.status(500).json({ error: 'Internal Server Error' });

        // Handle the error for this specific entry, but continue with the next one
      }
    }

    res.status(200).json({
      message: "Data sent successfully",
      counter: counter,
      sucessCounter: sucessCounter,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.error("Error in bulk save:", error.message);
  }
});
app.post("/api/employee-history", async (req, res) => {
  const csvData = req.body;

  try {
    for (const employeeData of csvData) {
      try {
        const employee = new EmployeeHistory(employeeData);
        const savedEmployee = await employee.save();
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
app.get('/api/employee-history/:companyName', async (req, res) => {
  try {
    // Extract the companyName from the URL parameter
    const { companyName } = req.params;

    // Query the database to find all data with matching companyName
    const employeeHistory = await EmployeeHistory.find({ companyName });

    // Respond with the fetched data
    res.json(employeeHistory);
  } catch (error) {
    // Handle errors
    console.error('Error fetching employee history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/api/specific-company/:companyId', async (req, res) => {
  try {
    const companyId = req.params.companyId;
    // Assuming CompanyModel.findById() is used to find a company by its ID
    const company = await CompanyModel.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post("/api/requestCompanyData", async (req, res) => {
  const csvData = req.body;

  try {
    for (const employeeData of csvData) {
      try {
        const employeeWithAssignData = {
          ...employeeData,
          AssignDate: new Date(),
        };
        const employee = new CompanyRequestModel(employeeWithAssignData);
        const savedEmployee = await employee.save();
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

app.post("/api/manual", async (req, res) => {
  const receivedData = req.body;

  // console.log(receivedData);

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
});

app.post("/api/update-status/:id", async (req, res) => {
  const { id } = req.params;
  const { newStatus, title, date, time } = req.body; // Destructure the required properties from req.body

  try {
    // Update the status field in the database based on the employee id
    await CompanyModel.findByIdAndUpdate(id, { Status: newStatus });
    
    // Create and save a new document in the RecentUpdatesModel collection
    const newUpdate = new RecentUpdatesModel({
      title: title,
      date: date,
      time: time,
    });
    await newUpdate.save();

    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/api/update-remarks/:id", async (req, res) => {
  const { id } = req.params;
  const { Remarks } = req.body;

  try {
    // Update remarks and fetch updated data in a single operation
    await CompanyModel.findByIdAndUpdate(id, { Remarks: Remarks });

    // Fetch updated data and remarks history
    const updatedCompany = await CompanyModel.findById(id);
    const remarksHistory = await RemarksHistory.find({ companyId: id });

    res.status(200).json({ updatedCompany, remarksHistory });
  } catch (error) {
    console.error("Error updating remarks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.delete("/api/delete-remarks-history/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Update remarks and fetch updated data in a single operation
  

    // Fetch updated data and remarks history
    const remarksHistory = await RemarksHistory.findByIdAndDelete({ companyId: id });

    res.status(200).json({ updatedCompany, remarksHistory });
  } catch (error) {
    console.error("Error updating remarks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete('/api/remarks-delete/:companyId', async (req, res) => {
  const { companyId } = req.params;
  
  try {
    // Find the company by companyId and update the remarks field
    const updatedCompany = await CompanyModel.findByIdAndUpdate(companyId, { Remarks: "No Remarks Added" }, { new: true });

    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({ message: "Remarks deleted successfully", updatedCompany });
  } catch (error) {
    console.error("Error deleting remarks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/api/einfo", async (req, res) => {
  try {
    adminModel.create(req.body).then((respond) => {
      res.json(respond);
      //console.log("respond" , respond)
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/einfo", async (req, res) => {
  try {
    const data = await adminModel.find();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/api/leads", async (req, res) => {
  try {
    // Fetch data using lean queries to retrieve plain JavaScript objects
    const data = await CompanyModel.find().lean();

    res.send(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/api/leads/:companyName", async (req, res) => {
  const companyName = req.params.companyName;
  try {
    // Fetch data using lean queries to retrieve plain JavaScript objects
    const data = await CompanyModel.findOne({"Company Name" : companyName}).lean();
  
    res.send(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ------------------------------api to get leads on the basis of ename------------------------

app.get("/api/specific-ename-status/:ename/:status", async (req, res) => {
  const ename = req.params.ename;
  const status = req.params.status
  
  try {
    // Fetch data using lean queries to retrieve plain JavaScript objects
    if(status === "complete"){
       const data = await CompanyModel.find({"ename" : ename}).lean();
  
    res.send(data);
    //console.log("Data" ,data)

    }else{
      const data = await CompanyModel.find({"ename" : ename ,"Status" : status}).lean();
  
    res.send(data);
    //console.log("Data" ,data)

    }
    
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});





app.get("/api/new-leads", async (req, res) => {
  try {
    const { startIndex, endIndex } = req.query;
    const start = parseInt(startIndex) || 0;
    const end = parseInt(endIndex) || 500;

    const data = await CompanyModel.find({ ename: "Not Alloted" })
      .skip(start)
      .limit(end - start)
      .lean();

    res.send(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/leads2", async (req, res) => {
  try {
    // Get the query parameters for pagination
    const { startIndex, endIndex } = req.query;

    // Convert startIndex and endIndex to numbers
    const start = parseInt(startIndex);
    const end = parseInt(endIndex);

    // Fetch data using lean queries to retrieve plain JavaScript objects
    const data = await CompanyModel.find().skip(start).limit(end - start).lean();

    // Send the data as the API response
    res.send(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get('/api/projection-data', async (req, res) => {
  try {
    // Fetch all data from the FollowUpModel
    const followUps = await FollowUpModel.find();
   
    //console.log(query)
    // Return the data as JSON response
    res.json(followUps);
  } catch (error) {
    // If there's an error, send a 500 internal server error response
    console.error('Error fetching FollowUp data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get("/api/card-leads", async (req, res) => {
  try {
    const { dAmount } = req.query; // Get the dAmount parameter from the query

    // Fetch data from the database with the specified limit
    const data = await CompanyModel.find({ ename: { $in: ["Select Employee", "Not Alloted"] } }).limit(parseInt(dAmount)).lean();

    // Send the data as the API response
    res.send(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get('/api/projection-data/:ename', async (req, res) => {
  try {
    const ename = req.params.ename;
    // Fetch data from the FollowUpModel based on the employeeName if provided
    const followUps = await FollowUpModel.find({ename : ename});
    // Return the data as JSON response
    res.json(followUps);
  } catch (error) {
    // If there's an error, send a 500 internal server error response
    console.error('Error fetching FollowUp data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ----------------------------------api to delete projection data-----------------------------------

app.delete('/api/delete-followup/:companyName', async (req, res) => {
  try {
    // Extract the company name from the request parameters
    const { companyName } = req.params;
    
    // Check if a document with the given company name exists
    const existingData = await FollowUpModel.findOne({ companyName });

    if (existingData) {
      // If the document exists, delete it
      await FollowUpModel.findOneAndDelete({ companyName });
      res.status(200).json({ message: 'Data deleted successfully' });
    } else {
      // If no document with the given company name exists, return a 404 Not Found response
      res.status(404).json({ error: 'Company not found' });
    }
  } catch (error) {
    // If there's an error during the deletion process, send a 500 Internal Server Error response
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Backend API to update or add data to FollowUpModel
// app.post('/api/update-followup', async (req, res) => {
//   try {
//     const { companyName } = req.body;
//     const todayDate = new Date();
//     const time = todayDate.toLocaleTimeString();
//     const date = todayDate.toLocaleDateString();
//     const finalData = { ...req.body, date, time };
   
//     // Check if a document with companyName exists
//     const existingData = await FollowUpModel.findOne({ companyName });
    
//     if (existingData) {
//       // Update existing document
//       await FollowUpModel.findOneAndUpdate({ companyName }, finalData);
//       res.status(200).json({ message: 'Data updated successfully' });
//     } else {
//       // Create new document
//       await FollowUpModel.create(finalData);
//       res.status(201).json({ message: 'New data added successfully' });
//     }
//   } catch (error) {
//     console.error('Error updating or adding data:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // January is 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

app.post('/api/update-followup', async (req, res) => {
  try {
    const { companyName } = req.body;
    const todayDate = new Date();
    const time = todayDate.toLocaleTimeString();
    const date = todayDate.toLocaleDateString();
    const finalData = { ...req.body, date, time };
   
    // Check if a document with companyName exists
    const existingData = await FollowUpModel.findOne({ companyName });
    
    if (existingData) {
      // Update existing document
      const previousData = { ...existingData.toObject() };
      //console.log(previousData)
      existingData.history.push({ modifiedAt: formatDate(Date.now()), data: previousData });
      console.log(existingData)
      existingData.set(finalData);
      await existingData.save();
      res.status(200).json({ message: 'Data updated successfully' });
    } else {
      // Create new document
      const newData = new FollowUpModel(finalData);
      await newData.save();
      res.status(201).json({ message: 'New data added successfully' });
    }
  } catch (error) {
    console.error('Error updating or adding data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get("/api/requestCompanyData", async (req, res) => {
  try {
    const data = await CompanyRequestModel.find();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/einfo/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Use findByIdAndDelete to delete the document by its ID
    const deletedData = await adminModel.findByIdAndDelete(id);

    if (!deletedData) {
      return res.status(404).json({ error: "Data not found" });
    }

    res.json({ message: "Data deleted successfully", deletedData });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// delete from leads

app.delete("/api/leads/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Use findByIdAndDelete to delete the document by its ID
    const deletedData = await CompanyModel.findByIdAndDelete(id);
    if (!deletedData) {
      return res.status(404).json({ error: "Data not found" });
    }

    res.json({ message: "Data deleted successfully", deletedData });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// delete selected rows

app.delete("/api/delete-rows", async (req, res) => {
  const { selectedRows } = req.body;

  try {
    // Use Mongoose to delete rows by their IDs
    await CompanyModel.deleteMany({ _id: { $in: selectedRows } });

    // Trigger backup on the server
    exec(
      `mongodump --db AdminTable --collection newcdatas --out ${process.env.BACKUP_PATH}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error("Error creating backup:", error);
          // Respond with an error if backup fails
          res.status(500).json({ error: "Error creating backup." });
        } else {
          // console.log("Backup created successfully:", stdout);
          // Respond with success message if backup is successful
          res.status(200).json({
            message:
              "Rows deleted successfully and backup created successfully.",
          });
        }
      }
    );
  } catch (error) {
    console.error("Error deleting rows:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/undo", (req, res) => {
  // Run mongorestore command to restore the data
  exec(
    `mongorestore --uri "mongodb://localhost:27017/AdminTable" --nsInclude "AdminTable.newcdatas" ${process.env.BACKUP_PATH}\newcdatas.bson
  `,
    (error, stdout, stderr) => {
      if (error) {
        console.error("Error restoring data:", error);
        res.status(500).json({ error: "Error restoring data." });
      } else {
        // console.log("Data restored successfully:", stdout);
        res.status(200).json({ message: "Data restored successfully." });
      }
    }
  );
});

app.put("/api/einfo/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const updatedData = await adminModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedData) {
      return res.status(404).json({ error: "Data not found" });
    }

    res.json({ message: "Data updated successfully", updatedData });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/leads/:id", async (req, res) => {
  const id = req.params.id;
  //req.body["Company Incorporation Date  "] = new Date(req.body["Company Incorporation Date  "]);

  try {
    req.body["Company Incorporation Date  "] = new Date(req.body["Company Incorporation Date "]);
    const updatedData = await CompanyModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    console.log(updatedData)

    if (!updatedData) {
      return res.status(404).json({ error: "Data not found" });
    }

    res.json({ message: "Data updated successfully", updatedData });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// app.put('/ecompany/:ename', async (req, res) => {
//   const name = req.params.id;

//   try {
//     const updatedData = await CompanyModel.find({ename : name}, { new: true });

//     if (!updatedData) {
//       return res.status(404).json({ error: 'Data not found' });
//     }

//     res.json({ message: 'Data updated successfully', updatedData });
//   } catch (error) {
//     console.error('Error updating data:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// Assigning data

app.post("/api/postData", async (req, res) => {
  const { employeeSelection, selectedObjects, title, date, time } = req.body;
  // If not assigned, post data to MongoDB or perform any desired action
  const updatePromises = selectedObjects.map((obj) => {
    // Add AssignData property with the current date
    const updatedObj = {
      ...obj,
      ename: employeeSelection,
      AssignDate: new Date(),
    };
    return CompanyModel.updateOne({ _id: obj._id }, updatedObj);
  });

  // Add the recent update to the RecentUpdatesModel
  const newUpdate = new RecentUpdatesModel({
    title: title,
    date: date,
    time: time,
  });
  await newUpdate.save();

  // Execute all update promises
  await Promise.all(updatePromises);

  res.json({ message: "Data posted successfully" });
});

app.get("/api/recent-updates", async (req, res) => {
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


app.delete("/api/delete-data/:ename", async (req, res) => {
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

app.post("/api/assign-new", async (req, res) => {
  const { newemployeeSelection, data } = req.body;

  try {
    // Add AssignDate property with the current date
    const updatedObj = {
      ...data,
      ename: newemployeeSelection,
      AssignDate: new Date(),
    };

    // Update CompanyModel for the specific data
    await CompanyModel.updateOne({ _id: data._id }, updatedObj);

    // Delete objects from RemarksHistory collection that match the "Company Name"
    await RemarksHistory.deleteMany({ companyID : data._id });

    res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.post("/api/company", async (req, res) => {
  const { newemployeeSelection, csvdata } = req.body;

  try {
    const insertedCompanies = [];
    let counter = 0;
    for (const company of csvdata) {
      // Check for duplicate based on some unique identifier, like company name
      const isDuplicate = await CompanyModel.exists({
        "Company Name": company["Company Name"].trim().toLowerCase(),
      });

      if (!isDuplicate) {
        // If not a duplicate, add ename and insert into the database
        const companyWithEname = {
          ...company,
          ename: newemployeeSelection,
          AssignDate: new Date(),
        };

        const insertedCompany = await CompanyModel.create(companyWithEname);
        insertedCompanies.push(insertedCompany);
      } else {
        console.log(
          `Duplicate entry found for company name: ${company["Company Name"]}. Skipped.`
        );
        counter++;
      }
    }

    res.json(insertedCompanies, counter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// get the company data,
app.get("/api/employees/:ename", async (req, res) => {
  try {
    const employeeName = req.params.ename;

    // Fetch data from companyModel where ename matches employeeName
    const data = await CompanyModel.find({ ename: employeeName });
    //console.log(data)
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// for inserting more values to einfo
app.put("/api/neweinfo/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const existingData = await adminModel.findById(id);

    if (!existingData) {
      return res.status(404).json({ error: "Data not found" });
    }

    // Map the incoming data to a format suitable for comparison
    const incomingData = req.body.cInfo.map((data) => ({
      "Company Name": data["Company Name"],
      "Company Number": data["Company Number"],
      "Company Incorporation Date  ": data["Company Incorporation Date  "],
      "Company Email": data["Company Email"],
      City: data.City,
      State: data.State,
    }));

    // Filter out existing entries from the incoming data
    const newData = incomingData.filter((data) => {
      return !existingData.cInfo.some((existing) => {
        return (
          existing["Company Name"] === data["Company Name"] &&
          existing["Company Number"] === data["Company Number"] &&
          existing["Company Incorporation Date  "] ===
            data["Company Incorporation Date  "] &&
          existing["Company Email"] === data["Company Email"] &&
          existing.City === data.City &&
          existing.State === data.State
        );
      });
    });

    // Add the filtered data to the existing array
    existingData.cInfo.push(...newData);

    // Save the updated document
    const updatedData = await existingData.save();

    res.json({ message: "Data updated successfully", updatedData });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/newcompanyname/:id", async (req, res) => {
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

// api call for employee requesting for the data

app.post("/api/requestData", async (req, res) => {
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
      AssignRead:false
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
app.post('/api/setMarktrue/:id', async (req, res) => {
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
    socketIO.emit('request-seen');
  } catch (error) {
    // Handle any errors that occur during the update operation
    console.error('Error updating object:', error);
    res.status(500).json({ error: 'An error occurred while updating the object.' });
  }
});
app.post("/api/requestgData", async (req, res) => {
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

app.get("/api/requestData", async (req, res) => {
  try {
    // Retrieve all data from RequestModel
    const allData = await RequestModel.find();
    res.json(allData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/api/requestgData", async (req, res) => {
  try {
    // Retrieve all data from RequestModel
    const allData = await RequestGModel.find();
    res.json(allData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/requestData/:id", async (req, res) => {
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

app.put("/api/requestgData/:id", async (req, res) => {
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

app.get('/api/edata-particular/:ename', async (req, res) => {
  try {
    const { ename } = req.params;
    const filteredEmployeeData = await CompanyModel.find({ ename }); 
    res.json(filteredEmployeeData);
  } catch (error) {
    console.error('Error fetching employee data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete("/api/newcompanynamedelete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Find the document by id and update the ename field to null or an empty string
    const updatedData = await CompanyModel.findByIdAndUpdate(
      id,
      { ename: "Not Alloted" },
      { new: true }
    );

    res.json({ message: "Ename deleted successfully", updatedData });
  } catch (error) {
    console.error("Error deleting ename:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/api/remarks-history/:companyId", async (req, res) => {
  const { companyId } = req.params;
  const { Remarks } = req.body;

  // Get the current date and time
  const currentDate = new Date();
  const time = `${currentDate.getHours()}:${currentDate.getMinutes()}`;
  const date = currentDate.toISOString().split("T")[0]; // Get the date in YYYY-MM-DD format

  try {
    // Create a new RemarksHistory instance
    const newRemarksHistory = new RemarksHistory({
      time,
      date,
      companyID: companyId,
      remarks: Remarks,
    });

    // Save the new entry to MongoDB
    await newRemarksHistory.save();

    res.json({ success: true, message: "Remarks history added successfully" });
  } catch (error) {
    console.error("Error adding remarks history:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
app.get("/api/remarks-history", async (req, res) => {
  try {
    const remarksHistory = await RemarksHistory.find();
    res.json(remarksHistory);
  } catch (error) {
    console.error("Error fetching remarks history:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
app.delete("/api/remarks-history/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await RemarksHistory.findByIdAndDelete(id);
    res.json({ success: true, message: "Remarks deleted successfully" });
  } catch (error) {
    console.error("Error deleting remark:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine the destination path based on the fieldname
    const destinationPath =
      file.fieldname === "otherDocs" ? "./ExtraDocs" : "./PaymentReceipts";
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post(
  "/api/lead-form",
  upload.fields([
    { name: "otherDocs", maxCount: 50 },
    { name: "paymentReceipt", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        bdmName,
        bdmEmail,
        bdmType,
        supportedBy,
        bookingDate,
        caCase,
        caNumber,
        caEmail,
        caCommission,
        companyName,
        contactNumber,
        companyEmail,
        services,
        originalTotalPayment,
        totalPayment,
        paymentTerms,
        paymentMethod,
        firstPayment,
        secondPayment,
        thirdPayment,
        fourthPayment,
        paymentRemarks,
        bookingSource,
        cPANorGSTnum,
        incoDate,
        extraNotes,
        empName,
        empEmail,
        bookingTime,
      } = req.body;
      const bdeName = empName;
      const bdeEmail = empEmail;

   
      const otherDocs =
        req.files["otherDocs"] && req.files["otherDocs"].length > 0
          ? req.files["otherDocs"].map((file) => file.filename)
          : [];

      const extraDocuments = req.files["otherDocs"];
      const paymentDoc = req.files["paymentReceipt"];
      // console.log(extraDocuments, paymentDoc);
      const paymentReceipt = req.files["paymentReceipt"]
        ? req.files["paymentReceipt"][0].filename
        : null; // Array of files for 'file2'

      // Your processing logic here

      const employee = new LeadModel({
        bdeName,
        bdeEmail,
        bdmName,
        bdmEmail,
        bdmType,
        supportedBy,
        bookingDate,
        caCase,
        caNumber,
        caEmail,
        caCommission,
        companyName,
        contactNumber,
        companyEmail,
        services,
        originalTotalPayment,
        totalPayment,
        paymentTerms,
        paymentMethod : paymentMethod[0],
        firstPayment,
        secondPayment,
        thirdPayment,
        fourthPayment,
        paymentRemarks,
        bookingSource,
        cPANorGSTnum,
        incoDate,
        extraNotes,
        bookingTime,
        otherDocs,
        paymentReceipt,
      });

      const display = caCase === "No" ? "none" : "flex";
      const displayPayment = paymentTerms === "Full Advanced" ? "none" : "flex";

      const savedEmployee = await employee.save();

      // const recipients = [
      //   "bookings@startupsahay.com",
      //   "documents@startupsahay.com",
      //   `${bdmEmail}`,
      //   `${bdeName}`,
      // ];

      // sendMail(
      //   recipients,
      //   "Mail received",
      //   ``,
      //   `<div style="width: 80%; margin: 50px auto;">
      //       <h2 style="text-align: center;">Lead Information</h2>
      //       <div style="display: flex;">
      //           <div style="width: 48%;">
      //               <label>BDE Name:</label>
      //               <div style="    padding: 8px 10px;
      //                   background: #fff7e8;
      //                   margin-top: 10px;
      //                   border-radius: 6px;
      //                   color: #724f0d;">
      //                   ${empName}
      //               </div>
      //           </div>
      //           <div style="width: 48%;margin-left: 15px;">
      //               <label>BDE Email Address:</label>
      //               <div style="    padding: 8px 10px;
      //                   background: #fff7e8;
      //                   margin-top: 10px;
      //                   border-radius: 6px;
      //                   color: #724f0d;">
      //                   ${empEmail}
      //               </div>
      //           </div>
      //       </div>
      //       <div style="display: flex; margin-top: 20px;">
      //           <div style="width: 48%;">
      //               <label>BDM Name:</label>
      //               <div style=" padding: 8px 10px;
      //                   background: #fff7e8;
      //                   margin-top: 10px;
      //                   border-radius: 6px;
      //                   color: #724f0d;">
      //                   ${bdmName}
      //               </div>
      //           </div>
      //           <div style="width: 48%;margin-left: 15px;">
      //               <label>BDM Email Address:</label>
      //               <div style="    padding: 8px 10px;
      //                   background: #fff7e8;
      //                   margin-top: 10px;
      //                   border-radius: 6px;
      //                   color: #724f0d;">
      //                   ${bdmEmail}
      //               </div>
      //           </div>
      //       </div>
      //       <div style="height: 1px; background-color: #bbbbbb; margin: 20px 0px;">
      //       </div>
      //       <div style="display: flex; margin-top: 20px;">
      //           <div style="width: 48%;">
      //               <label>Booking Date:</label>
      //               <div style=" padding: 8px 10px;
      //                   background: #fff7e8;
      //                   margin-top: 10px;
      //                   border-radius: 6px;
      //                   color: #724f0d;">
      //                   ${bookingDate}
      //               </div>
      //           </div>

      //       </div>

      //       <div style="height: 1px; background-color: #bbbbbb; margin: 20px 0px;">
      //       </div>

      //       <div style="display: flex; margin-top: 20px;" id="cacase">
      //           <div style="width: 48%;">
      //               <label>CA Case: ${caCase}</label>

      //           </div>

      //       </div>
      //       <div id="ca-case-option" style="display: ${display}; margin-top: 20px;" >
      //           <div style="width: 30%;">
      //               <label>Enter CA's number:</label>
      //               <div style=" padding: 8px 10px;
      //                   background: #fff7e8;
      //                   margin-top: 10px;
      //                   border-radius: 6px;
      //                   color: #724f0d;">
      //                   ${caNumber}
      //               </div>
      //           </div>
      //           <div style="width: 30%; margin-left: 10px;">
      //               <label>Enter CA's Email:</label>
      //               <div style=" padding: 8px 10px;
      //                   background: #fff7e8;
      //                   margin-top: 10px;
      //                   border-radius: 6px;
      //                   color: #724f0d;">
      //                   ${caEmail}
      //               </div>
      //           </div>
      //           <div style="width: 38%; margin-left: 10px;">
      //               <label>Enter CA's Commission:</label>
      //               <div style=" padding: 8px 10px;
      //                   background: #fff7e8;
      //                   margin-top: 10px;
      //                   border-radius: 6px;
      //                   color: #724f0d;">
      //                   ${caCommission}
      //               </div>
      //           </div>

      //       </div>
      //       <div style="height: 1px; background-color: #bbbbbb; margin: 20px 0px;">
      //       </div>

      //       <div style="display: flex; margin-top: 20px;">
      //           <div style="width: 30%;">
      //               <label>Enter Company's Name:</label>
      //               <div style=" padding: 8px 10px;
      //                   background: #fff7e8;
      //                   margin-top: 10px;
      //                   border-radius: 6px;
      //                   color: #724f0d;">
      //                   ${companyName}
      //               </div>
      //           </div>
      //           <div style="width: 30%; margin-left: 10px;">
      //               <label>Enter Contact Number:</label>
      //               <div style=" padding: 8px 10px;
      //                   background: #fff7e8;
      //                   margin-top: 10px;
      //                   border-radius: 6px;
      //                   color: #724f0d;">
      //                   ${contactNumber}
      //               </div>
      //           </div>
      //           <div style="width: 38%; margin-left: 10px;">
      //               <label>Enter Company's Email id:</label>
      //               <div style=" padding: 8px 10px;
      //                   background: #fff7e8;
      //                   margin-top: 10px;
      //                   border-radius: 6px;
      //                   color: #724f0d;">
      //                   ${companyEmail}
      //               </div>
      //           </div>

      //       </div>

      //       <div style="display: flex; margin-top: 20px;">
      //           <div style="width: 48%;">
      //               <label>Services:</label>
      //               <div style=" padding: 8px 10px;
      //                   background: #fff7e8;
      //                   margin-top: 10px;
      //                   border-radius: 6px;
      //                   color: #724f0d;">
      //                   ${services}
      //               </div>
      //           </div>

      //       </div>
      //       <div style="height: 1px; background-color: #bbbbbb; margin: 20px 0px;">
      //       </div>
      //       <div style="display: flex; margin-top: 20px;">
      //           <div style="width: 48%; ">
      //               <label>Total Payment:</label>
      //               <div style=" padding: 8px 10px;
      //                   background: #fff7e8;
      //                   margin-top: 10px;
      //                   border-radius: 6px;
      //                   color: #724f0d;">
      //                   ${originalTotalPayment}
      //               </div>
      //           </div>
      //           <div style="width: 48%;  margin-left: 10px;">
      //               <label>Total Payment Including GST</label>
      //               <div style=" padding: 8px 10px;
      //                   background: #fff7e8;
      //                   margin-top: 10px;
      //                   border-radius: 6px;
      //                   color: #724f0d;">
      //                   ${totalPayment}
      //               </div>
      //           </div>

      //       </div>
      //       <div style="display: flex; margin-top: 20px;">
      //           <div style="width: 48%; ">
      //               <label>Payment Terms: ${paymentTerms}</label>

      //           </div>

      //       </div>
      //       <div style="display: ${displayPayment}; margin-top: 20px;">
      //           <div style="width: 24%; ">
      //               <label>First Payment:</label>
      //               <div style=" padding: 8px 10px;
      //                   background: #fff7e8;
      //                   margin-top: 10px;
      //                   border-radius: 6px;
      //                   color: #724f0d;">
      //                   ${firstPayment}
      //               </div>
      //               <small style="background: #e7e7e7;
      //               padding: 2px 8px;
      //               margin: 4px 0;
      //               color: rgb(63, 66, 21);
      //               display: inline-block;
      //               border-radius: 4px;">
      //               ${(firstPayment * 100) / totalPayment}% Amount
      //               </small>
      //           </div>
      //           <div style="width: 24%;  margin-left: 10px;">
      //               <label>Second Payment</label>
      //               <div style=" padding: 8px 10px;
      //                   background: #fff7e8;
      //                   margin-top: 10px;
      //                   border-radius: 6px;
      //                   color: #724f0d;">
      //                   ${secondPayment}
      //               </div>
      //               <small style="background: #e7e7e7;
      //               padding: 2px 8px;
      //               margin: 4px 0;
      //               color: rgb(63, 66, 21);
      //               display: inline-block;
      //               border-radius: 4px;">
      //               ${(secondPayment * 100) / totalPayment}% Amount
      //               </small>
      //           </div>
      //           <div style="width: 24%;  margin-left: 10px;">
      //               <label>Third Payment</label>
      //               <div style=" padding: 8px 10px;
      //                   background: #fff7e8;
      //                   margin-top: 10px;
      //                   border-radius: 6px;
      //                   color: #724f0d;">
      //                   ${thirdPayment}
      //               </div>
      //               <small style="background: #e7e7e7;
      //               padding: 2px 8px;
      //               margin: 4px 0;
      //               color: rgb(63, 66, 21);
      //               display: inline-block;
      //               border-radius: 4px;">
      //               ${(thirdPayment * 100) / totalPayment}% Amount
      //               </small>
      //           </div>
      //           <div style="width: 24%;  margin-left: 10px;">
      //               <label>Fourth Payment</label>
      //               <div style=" padding: 8px 10px;
      //                   background: #fff7e8;
      //                   margin-top: 10px;
      //                   border-radius: 6px;
      //                   color: #724f0d;">
      //                   ${fourthPayment}
      //               </div>
      //               <small style="background: #e7e7e7;
      //               padding: 2px 8px;
      //               margin: 4px 0;
      //               color: rgb(63, 66, 21);
      //               display: inline-block;
      //               border-radius: 4px;">
      //               ${(fourthPayment * 100) / totalPayment}% Amount
      //               </small>
      //           </div>

      //       </div>
      //       <div style="display: flex; margin-top: 20px;">
      //       <div style="width: 33%; ">
      //               <label>Payment Remarks:</label>
      //               <div style=" padding: 8px 10px;
      //                   background: #fff7e8;
      //                   margin-top: 10px;
      //                   border-radius: 6px;
      //                   color: #724f0d;">
      //                   ${paymentRemarks}
      //               </div>
      //           </div>

      //  </div>
      //       <div style="height: 1px; background-color: #bbbbbb; margin: 20px 0px;">
      //       </div>

      //       <div style="display: flex; margin-top: 20px;">
      //           <div style="width: 33%; ">
      //               <label>Payment Method:</label>
      //               <div style=" padding: 8px 10px;
      //                   background: #fff7e8;
      //                   margin-top: 10px;
      //                   border-radius: 6px;
      //                   color: #724f0d;">
      //                   ${paymentMethod[0]}
      //               </div>
      //           </div>
      //           <div style="width: 33%;  margin-left: 10px;">
      //               <label>Booking Source</label>
      //               <div style=" padding: 8px 10px;
      //                   background: #fff7e8;
      //                   margin-top: 10px;
      //                   border-radius: 6px;
      //                   color: #724f0d;">
      //                   ${bookingSource}
      //               </div>
      //           </div>
      //           <div style="width: 33%;  margin-left: 10px;">
      //               <label>Company Pan or GST number</label>
      //               <div style=" padding: 8px 10px;
      //                   background: #fff7e8;
      //                   margin-top: 10px;
      //                   border-radius: 6px;
      //                   color: #724f0d;">
      //                   ${cPANorGSTnum}
      //               </div>
      //           </div>

      //       </div>
      //       <div style="display: flex; margin-top: 20px;">
      //           <div style="width: 48%; ">
      //               <label>Company Incorporation Date:</label>
      //               <div style=" padding: 8px 10px;
      //                   background: #fff7e8;
      //                   margin-top: 10px;
      //                   border-radius: 6px;
      //                   color: #724f0d;">
      //                   ${incoDate}
      //               </div>
      //           </div>
      //           <div style="width: 48%;  margin-left: 10px;">
      //               <label>Any Extra Notes</label>
      //               <div style=" padding: 8px 10px;
      //                   background: #fff7e8;
      //                   margin-top: 10px;
      //                   border-radius: 6px;
      //                   color: #724f0d;">
      //                   ${extraNotes}
      //               </div>
      //           </div>

      //       </div>

      //   </div>

      //   `,
      //   extraDocuments,
      //   paymentDoc
      // );

      console.log("Data sent Via Email");
      res
        .status(200)
        .json(savedEmployee || { message: "Data sent successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
      console.error("Error saving employee:", error.message);
    }
  }
);
app.post(
  "/api/lead-form2",
  upload.fields([
    { name: "otherDocs", maxCount: 50 },
    { name: "paymentReceipt", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        bdmName,
        bdmEmail,
        bdmType,
        supportedBy,
        bookingDate,
        caCase,
        caNumber,
        caEmail,
        caCommission,
        companyName,
        contactNumber,
        companyEmail,
        services,
        originalTotalPayment,
        totalPayment,
        paymentTerms,
        paymentMethod,
        firstPayment,
        secondPayment,
        thirdPayment,
        fourthPayment,
        paymentRemarks,
        bookingSource,
        cPANorGSTnum,
        incoDate,
        extraNotes,
        empName,
        empEmail,
        bookingTime,
        otherDocs ,
        paymentReceipt
      } = req.body;
      const bdeName = empName;
      const bdeEmail = empEmail;


      const employee = new BookingsRequestModel({
        bdeName,
        bdeEmail,
        bdmName,
        bdmEmail,
        bdmType,
        supportedBy,
        bookingDate,
        caCase,
        caNumber,
        caEmail,
        caCommission,
        companyName,
        contactNumber,
        companyEmail,
        services,
        originalTotalPayment,
        totalPayment,
        paymentTerms,
        paymentMethod : paymentMethod[0],
        firstPayment,
        secondPayment,
        thirdPayment,
        fourthPayment,
        paymentRemarks,
        bookingSource,
        cPANorGSTnum,
        incoDate,
        extraNotes,
        bookingTime,
        otherDocs,
        paymentReceipt,
      });

      const display = caCase === "No" ? "none" : "flex";
      const displayPayment = paymentTerms === "Full Advanced" ? "none" : "flex";

      const savedEmployee = await employee.save();

      // console.log("Data Request Sent Successfully");
      res
        .status(200)
        .json(savedEmployee || { message: "Data sent successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
      console.error("Error saving employee:", error.message);
    }
  }
);

// --------------------api for importing excel data on processing dashboard----------------------------
app.get('/api/booking-model-filter', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Convert start and end dates to JavaScript Date objects
    const formattedStartDate = new Date(startDate);
    const formattedEndDate = new Date(endDate);

    // Convert the start date to match the format of the bookingDate field
    const formattedBookingStartDate = formattedStartDate.toISOString().split('T')[0];

    // Define the filter criteria based on the date range
    let filterCriteria = {};
    if (formattedStartDate.getTime() === formattedEndDate.getTime()) {
      // If start and end dates are the same, filter by a single date
      filterCriteria = { bookingDate: formattedBookingStartDate };
    } else {
      // If start and end dates are different, filter by a date range
      filterCriteria = {
        bookingDate: {
          $gte: formattedBookingStartDate,
          $lte: formattedEndDate.toISOString().split('T')[0]
        }
      };
    }

    // Fetch leads from the database filtered by the specified date range
    const leads = await LeadModel.find(filterCriteria);

    res.json({ leads });
  } catch (error) {
    console.error('Error fetching leads:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.post("/api/upload/lead-form", async (req, res) => {
  let successCounter = 0;
  let errorCounter = 0;

  try {
    const excelData = req.body; // Assuming req.body is an array of objects


    for (const data of excelData) {
      try {
        // Destructure data object
        const {
          bdeName,
          bdeEmail,
          bdmName,
          bdmEmail,
          bdmType,
          supportedBy,
          bookingDate,
          caCase,
          caNumber,
          caEmail,
          caCommission,
          companyName,
          contactNumber,
          companyEmail,
          services,
          originalTotalPayment,
          totalPayment,
          paymentTerms,
          paymentMethod,
          firstPayment,
          secondPayment,
          thirdPayment,
          fourthPayment,
          paymentRemarks,
          bookingSource,
          cPANorGSTnum,
          incoDate,
          extraNotes,
          bookingTime,
          imported,
        } = data;

        // Create a new LeadModel instance with the data
        const employee = new LeadModel({
          bdeName,
          bdeEmail,
          bdmName,
          bdmEmail,
          bdmType,
          supportedBy,
          bookingDate,
          caCase,
          caNumber,
          caEmail,
          caCommission,
          companyName,
          contactNumber,
          companyEmail,
          services,
          originalTotalPayment,
          totalPayment,
          paymentTerms,
          paymentMethod,
          firstPayment,
          secondPayment,
          thirdPayment,
          fourthPayment,
          paymentRemarks,
          bookingSource,
          cPANorGSTnum,
          incoDate,
          extraNotes,
          bookingTime,
          imported,
        });

        // Save the employee data to the database
        await employee.save();

        socketIO.emit('importcsv' , employee)
        // console.log(excelData)
        // Increment the success counter
        successCounter++;
      } catch (error) {
        // If an error occurs during data insertion, check if it's due to duplicate companyName
        if (error.code === 11000 && error.keyPattern && error.keyPattern.companyName) {
          // Duplicate companyName detected, save the data to LeadModel_2
          try {
            await LeadModel_2.create(data);
            console.log("Data saved to LeadModel_2 due to duplicate companyName:", data);
            successCounter++; // Increment success counter as data was successfully saved to LeadModel_2
          } catch (err) {
            // Error saving to LeadModel_2
            console.error("Error saving data to LeadModel_2:", err.message);
            errorCounter++; // Increment error counter
          }
        } else {
          // Error other than duplicate companyName, increment error counter
          errorCounter++;
          console.error("Error saving employee:", error.message);
        }
      }
    }

    // Respond with success and error counters
    res.status(200).json({ message: "Data sent successfully", successCounter, errorCounter });
  } catch (error) {
    // If an error occurs at the outer try-catch block, handle it here
    console.error("Error saving employees:", error.message);
    res.status(500).json({ error: "Internal Server Error", errorCounter });
  }
});

app.post('/api/accept-booking-request/:companyName', async (req, res) => {
  const companyName = req.params.companyName;
  const requestData = req.body;

  try {
    // Find the data to be moved from BookingsRequestModel

    // Update leadModel data with data from BookingsRequestModel
    const { _id, ...updatedData } = requestData;

    // Update leadModel data with data from BookingsRequestModel
    const updatedLead = await LeadModel.findOneAndUpdate(
      { companyName },
      { $set: updatedData },
      { new: true }
    );

    // Delete the data from BookingsRequestModel
    await BookingsRequestModel.findOneAndDelete({ companyName });

    // Send success response with the updated lead data
    res.status(200).json(updatedLead);
  } catch (error) {
    console.error('Error accepting booking request:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.get('/api/drafts-search/:companyName', async (req, res) => {
  const companyName = req.params.companyName;

  try {
    // Find draft data for the company name
    const draft = await DraftModel.findOne({ companyName });

    // Send the draft data as response
    res.status(200).json(draft);
  } catch (error) {
    console.error('Error fetching draft:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ---------------------------api to fetch companies in processing dashboard-----------------------------------

app.get("/api/companies", async (req, res) => {
  try {
    // Fetch all companies from the LeadModel
    const companies = await LeadModel.find();
    // Count the total number of companies
    const totalCompanies = companies.length;
    
    // Construct response JSON with company names and count
    const response = {
      totalCompanies: totalCompanies,
      companies: companies
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching companies:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/company/:companyName", async (req, res) => {
  const companyName = req.params.companyName;

  try {
    // Fetch details for the specified company name from the LeadModel
    const companyDetails = await LeadModel.findOne({ companyName });

    if (!companyDetails) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.json(companyDetails);
  } catch (error) {
    console.error("Error fetching company details:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/api/company-ename/:ename", async (req, res) => {
  const bdeName = req.params.ename;

  try {
    // Fetch details for the specified company name from the LeadModel
    const companyDetails = await LeadModel.find({ bdeName });
    if (!companyDetails) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.json(companyDetails);
  } catch (error) {
    console.error("Error fetching company details:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/api/duplicate-company/:companyName", async (req, res) => {
  const companyName = req.params.companyName;

  try {
    // Fetch details for the specified company name from the LeadModel
    const companyDetails = await LeadModel_2.find({ companyName }).lean();

    if (!companyDetails) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.json(companyDetails);
  } catch (error) {
    console.error("Error fetching company details:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.delete("/api/reverse-delete/:companyName", async (req, res) => {
  try {
    const { companyName } = req.params;

    // Find the deleted company by companyName in DeletedModel
    const deletedCompany = await DeletedDatabase.findOneAndDelete({
      companyName,
    });

    if (deletedCompany) {
      // Move the deleted company from DeletedModel to LeadModel
      await LeadModel.create(deletedCompany.toObject());
      res.json({ message: "Company restored successfully" });
    } else {
      res.status(404).json({ message: "Company not found in deleted records" });
    }
  } catch (error) {
    console.error("Error reversing delete:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/company-delete/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const deletedCompany = await LeadModel.findByIdAndDelete({ _id });
    if (deletedCompany) {
      // Move the deleted company to the DeletedModel collection
      await DeletedDatabase.create(deletedCompany.toObject());
      // Find the same company name in the CompanyModel and update its Status to "Untouched"
      const companyName = deletedCompany.companyName;

      await CompanyModel.findOneAndDelete(
        { "Company Name": companyName },
       
      );

      socketIO.emit('companydeleted')

      res.status(200).json({ message: "Company Deleted Successfully" });
    } else {
      res.status(404).json({ message: "Company not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/deleterequestbybde", async (req, res) => {
  try {
    const { companyName, companyId, time, date, request, ename } = req.body;
    // console.log(req.body);
    // Create a new instance of the RequestDeleteByBDE model
    const deleteRequest = new RequestDeleteByBDE({
      companyName,
      companyId,
      time,
      date,
      request,
      ename,
    });
    socketIO.emit('DeleteRequest');
    // Save the delete request to the database
    await deleteRequest.save();

    res.json({ message: "Delete request created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/deleterequestbybde", async (req, res) => {
  try {
    const company = await RequestDeleteByBDE.find();
    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/api/editRequestByBde", async (req, res) => {
  try {
    const company = await BookingsRequestModel.find();
    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/deleterequestbybde/:cname", async (req, res) => {
  try {
    const companyName = req.params.cname;

    // Find document by company name and delete it
    const updatedCompany = await RequestDeleteByBDE.findOneAndUpdate(
      { companyName },
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

app.post("/api/loginDetails", (req, res) => {
  const { ename, date, time, address } = req.body;
  const newLoginDetails = new LoginDetails({ ename, date, time, address });
  newLoginDetails
    .save()
    .then((savedLoginDetails) => {
      // console.log("Login details saved to database:", savedLoginDetails);
      res.json(savedLoginDetails);
    })
    .catch((error) => {
      console.error("Failed to save login details to database:", error);
      res.status(500).json({ error: "Failed to save login details" });
    });
});

app.get("/api/loginDetails", (req, res) => {
  LoginDetails.find()
    .then((loginDetails) => {
      res.json(loginDetails);
    })
    .catch((error) => {
      console.error("Failed to fetch login details from database:", error);
      res.status(500).json({ error: "Failed to fetch login details" });
    });
});

// ------------------------------------pdf files reader-------------------------------------

app.get('/api/pdf/:filename', (req, res) => {
  const filepath = req.params.filename;
  const pdfPath = path.join(__dirname, 'ExtraDocs' , filepath);

  // Read the PDF file
  fs.readFile(pdfPath, (err, data) => {
    if (err) {
      console.error('Error reading PDF file:', err);
      res.status(500).send('Internal Server Error');
    } else {
      // Set the response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=example.pdf');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');

      // Send the PDF file data
      res.sendFile(pdfPath);
    }
  });
});

app.get('/api/paymentrecieptpdf/:filename', (req, res) => {
  const filepath = req.params.filename;
  const pdfPath = path.join(__dirname, 'PaymentReceipts' , filepath);
  console.log(pdfPath)
  // Read the PDF file
  fs.readFile(pdfPath, (err, data) => {
    if (err) { 
      console.error('Error reading PDF file:', err);
      res.status(500).send('Internal Server Error');
    } else {
      // Set the response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=example.pdf');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      // Send the PDF file data
      res.sendFile(pdfPath);
    }
  });
});


app.get("/api/recieptpdf/:filename", (req, res) => {
  const filepath = req.params.filename;
  const pdfPath = path.join(__dirname, "PaymentReceipts", filepath);

  // Check if the file exists
  fs.access(pdfPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(err);
      return res.status(404).json({ error: "File not found" });
    }

    // If the file exists, send it
    res.sendFile(pdfPath);
  });
});

app.get("/api/otherpdf/:filename", (req, res) => {
  const filepath = req.params.filename;
  const pdfPath = path.join(__dirname, "ExtraDocs", filepath);

  // Check if the file exists
  fs.access(pdfPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(err);
      return res.status(404).json({ error: "File not found" });
    }

    // If the file exists, send it
    res.sendFile(pdfPath);
  });
});

app.get("/download/recieptpdf/:fileName", (req, res) => {
  const fileName = req.params.filePath;
  const filePath = path.join(__dirname, "uploads", fileName);
  // console.log(fileName);
  res.setHeader("Content-Disposition", attachment, (fileName = `${fileName}`));
  res.setHeader("Content-Type", "application/pdf");
  res.sendFile(filePath);
  }
);

// ---------------------------to update the read status of companies-------------------------------------


app.put('/api/read/:companyName', async (req, res) => {
  const companyName = req.params.companyName;
  // console.log(companyName)
  try {
    // Find the company in the database based on its name
    const companyDetails = await LeadModel.findOne({ companyName });
    // console.log(companyDetails)

    // If company is found, update its read status to true
    if (companyDetails) {
      companyDetails.read = true; // Update the read status to true
      // Save the updated company back to the database
      await companyDetails.save();
      socketIO.emit("read", companyDetails);
      res.json(companyDetails); // Send the updated company as the response

    } else {
      // If company is not found, return a 404 error
      res.status(404).json({ error: 'Company not found' });
    }
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ----------------------------api to download csv from processing dashboard--------------------------

app.get('/api/exportdatacsv', async (req, res) => {
  try {
    const leads = await LeadModel.find({});
    const csvData = [];

    // Push the headers as the first row
    csvData.push([
      "SR. NO",
      "BDE NAME",
      "BDE'S EMAIL ID",
      "BDM NAME",
      "BDM'S EMAIL ID",
      "BDM TYP",
      "SUPPORTED BY",
      "BOOKING DATE",
      "CA CASE? (Yes Or No)",
      "CA NUMBER",
      "CA'S EMAIL ID",
      "CA'S CAMMISSION",
      "COMPANY NAME",
      "COMPANY'S NUMBER",
      "COMPANY'S EMAIL ID",
      "SERVICES",
      "TOTAL PAYMENT WITH GST",
      "TOTAL PAYMENT WITHOUT GST",
      "PAYMENT TERMS",
      "PAYMENT METHOD",
      "FIRST PAYMENT",
      "SECOND PAYMENT",
      "THIRD PAYMENT",
      "FOURTH PAYMENT",
      "PAYMENT REMARK",
      "PAYMENT RECEIPT",
      "BOOKING SOURCE",
      "COMPANY PAN OR GST NUMBER",
      "INCORPORATION DATE",
      "EXTRA NOTES IF ANY",
      "OTHER DOCS",
      "BOOKING TIME"
    ]);


    const baseDocumentURL = "https://startupsahay.in/api/recieptpdf/";
    const DocumentURL = "https://startupsahay.in/api/otherpdf/";
    
    // Push each lead as a row into the csvData array
    leads.forEach((lead, index) => {
      const otherDocsUrls = lead.otherDocs.map(doc => `${DocumentURL}${doc}`);
      const rowData = [
        index + 1,
        lead.bdeName,
        lead.bdeEmail,
        lead.bdmName,
        lead.bdmEmail,
        lead.bdmType,
        lead.supportedBy,
        lead.bookingDate,
        lead.caCase,
        lead.caNumber,
        lead.caEmail,
        lead.caCommission,
        lead.companyName,
        lead.contactNumber,
        lead.companyEmail,
        `"${lead.services.join(',')}"`, 
        lead.originalTotalPayment,
        lead.totalPayment,
        lead.paymentTerms,
        lead.paymentMethod,
        lead.firstPayment,
        lead.secondPayment,
        lead.thirdPayment,
        lead.fourthPayment,
        lead.paymentRemarks,
        lead.paymentReceipt ? `${baseDocumentURL}${lead.paymentReceipt}` : '',            // ? baseDocumentURL + lead.paymentReceipt : '',  Concatenate base URL with document name
        lead.bookingSource,
        lead.cPANorGSTnum,
        lead.incoDate,
        lead.extraNotes,
        `"${otherDocsUrls.join(',')}"`, // Assuming otherDocs is an array
        lead.bookingTime
      ];
      csvData.push(rowData);
      // console.log("rowData:" , rowData)
    });

    // Use fast-csv to stringify the csvData array
    res.setHeader('Content-Type' , 'text/csv')
    res.setHeader('Content-Disposition' , 'attachment; filename=leads.csv')
    
    const csvString = csvData.map(row => row.join(',')).join('\n');
    // Send response with CSV data
    // Send response with CSV data
    res.status(200).end(csvString);
    // console.log(csvString)
     // Here you're ending the response

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/api/exportLeads/:dataType' , async (req , res)=>{
  try {
    const dataType = req.params.dataType;
    const selectedIds = req.query.selectedRows;

    const leads =   await CompanyModel.find({ 
      _id: { $in: selectedIds }
  }) ;

    const csvData = [];

    // Push the headers as the first row
    csvData.push([
      "SR. NO",
      "Company Name",
      "Company Number",
      "Company Email",
      "Company Incorporation Date  ",
      "City",
      "State",
      "ename",
      "AssignDate", 
      "Status",
      "Remarks"
    ]);

    // Push each lead as a row into the csvData array
    leads.forEach((lead, index) => {
      const rowData = [
        index + 1,
        lead["Company Name"],
        lead["Company Number"],
        lead["Company Email"],
        lead["Company Incorporation Date  "],
        lead["City"],
        lead["State"],
        lead["ename"],
        lead["AssignDate"],
        lead['Status'],
        lead["Remarks"],
      ];
      csvData.push(rowData);
      // console.log("rowData:" , rowData)
    });

    // Use fast-csv to stringify the csvData array
    res.setHeader('Content-Type' , 'text/csv')
    if(dataType=== "Assigned"){
      res.setHeader('Content-Disposition' , 'attachment; filename=AssignedData.csv');
    }else{
      res.setHeader('Content-Disposition' , 'attachment; filename=UnassignedData.csv');
    }
 
    
    const csvString = csvData.map(row => row.join(',')).join('\n');
    // Send response with CSV data
    // Send response with CSV data
    res.status(200).end(csvString);
    // console.log(csvString)
     // Here you're ending the response

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
  
})

// ------------------------------api to upload docs from processing window------------------------------

app.post('/api/uploadAttachment/:companyName', upload.fields([
  { name: "otherDocs", maxCount: 50 },
  { name: "paymentReceipt", maxCount: 1 },
]), async (req, res) => {
  try {
      const companyName = req.params.companyName;

      // Check if company name is provided
      if (!companyName) {
          return res.status(404).send("Company name not provided");
      }

      // Find the company by its name
      const company = await LeadModel.findOne({ companyName });
      // console.log(company)
      // Check if company exists
      if (!company) {
          return res.status(404).send("Company not found");
      }

      // const paymentDoc = req.files["paymentReceipt"];

      // Update the payment receipt field of the company document
      const paymentReceipt = req.files["paymentReceipt"]
          ? req.files["paymentReceipt"][0].filename
          : null;
      // console.log(paymentReceipt)
      // console.log(req.files)

      // Update the payment receipt field in the company document
      company.paymentReceipt = paymentReceipt;
      
      await company.save();

      socketIO.emit("viewpaymenteciept" , company)

      res.status(200).send('Payment receipt updated successfully!');
  } catch (error) {
      console.error('Error updating payment receipt:', error);
      res.status(500).send('Error updating payment receipt.');
  }
});

app.post('/api/uploadotherdocsAttachment/:companyName', upload.fields([
  { name: "otherDocs", maxCount: 50 },
  { name: "paymentReceipt", maxCount: 1 },
]), async (req, res) => {
  try {
      const companyName = req.params.companyName;

      // Check if company name is provided
      if (!companyName) {
          return res.status(404).send("Company name not provided");
      }

      // Find the company by its name
      const company = await LeadModel.findOne({ companyName });
      // console.log(company)
      // Check if company exists
      if (!company) {
          return res.status(404).send("Company not found");
      }

      // const paymentDoc = req.files["paymentReceipt"];

      // Update the payment receipt field of the company document
      const newOtherDocs =
      req.files["otherDocs"] && req.files["otherDocs"].length > 0
        ? req.files["otherDocs"].map((file) => file.filename)
        : [];

    // Append new filenames to the existing otherDocs array
    company.otherDocs = company.otherDocs.concat(newOtherDocs);

      
      await company.save();

      socketIO.emit("veiwotherdocs" , company)

      res.status(200).send('Documents uploaded updated successfully!');
  } catch (error) {
      console.error('Error updating payment receipt:', error);
      res.status(500).send('Error updating payment receipt.');
  }
});

app.post('/api/redesigned-leadform', async (req, res) => {
  try {
    const newData = req.body; // Assuming the request body contains the data to be saved

    // Find the related company based on companyName
    const companyData = await CompanyModel.findOne({ 'Company Name': newData["Company Name"], 'Status': 'Matured' });

    if (!companyData) {
      return res.status(404).json({ message: 'Company not found or status is not "Matured"' });
    }

    // Add company data to the lead form data
    newData.company = companyData._id;

    // Create a new instance of RedesignedLeadformModel with the combined data
    const leadForm = new RedesignedLeadformModel(newData);

    // Save the lead form data to the database
    const savedLeadForm = await leadForm.save();

    res.status(201).json(savedLeadForm); // Respond with the saved data
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// Use the googleAuth router for Google OAuth routes

// app.get('/dashboard', async function(req, res, next) {
//   const code = req.query.code;

//   console.log(code);
//   // try {
//   //   const oAuth2Client = new OAuth2Client(
//   //     process.env.GOOGLE_CLIENT_ID,
//   //     process.env.GOOGLE_CLIENT_SECRET,
//   //     'http://localhost:3001/auth/google/callback'
//   //   );

//   //   const { tokens } = await oAuth2Client.getToken(code);
//   //   // Set the access token on the OAuth2 client
//   //   oAuth2Client.setCredentials(tokens);

//   //   console.info('Tokens acquired.');
//   //   console.log('Access Token:', tokens.access_token);
//   //   console.log('Refresh Token:', tokens.refresh_token);
    
//   //   // Get user data using the access token
//   //   await getUserData(tokens.access_token);
//   // } catch (err) {
//   //   console.log('Error logging in with OAuth2 user', err);
//   // }

//   // res.redirect(303, 'http://localhost:5173/');
// });

// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: '/auth/google/callback',
//   scope: ["profile", "email"],
//   accessType: 'offline', 
// },
// async (accessToken, refreshToken, profile, done) => {
//   console.log('accessToken:', accessToken);
//   console.log('refreshToken:', refreshToken);
//   await getUserData(accessToken);

//   const user = {
//     id: profile.id,
//     email: profile.emails[0].value,
//   };
//   console.log("user:", user);
//   return done(null, user);
// }));

// async function getUserData(access_token) {
//   try {
//     const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
//     const data = await response.json();
//     console.log("All the data", data);
//   } catch (error) {
//     console.error('Error fetching user data:', error);
//   }
// }

// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

// app.get('/auth/google',
//   passport.authenticate('google', { 
//     scope: ['profile', 'email', 'offline_access'], // Include 'offline_access' scope
//     prompt: 'consent' 
//   }));

// // Google OAuth callback route
// app.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   (req, res) => {
//     // Check if the referer header is present in the request
//     const referer = req.headers.referer;

//     if (referer) {
//       // Redirect to the previous page
//       res.redirect('/dashboard');
//     } else {
//       // If referer is not available, redirect to a default URL
//       res.redirect('/'); // You can change this to any default URL you prefer
//     }
//   }
// );

// app.use('/oauth', authRouter);
// app.use('/request', requestRouter);

// // Initialize Nodemailer transporter using user's credentials
// function createTransporter(user) {
//   return nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       type: 'OAuth2',
//       user: user.email,
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       refreshToken: user.refreshToken,
//       accessToken: user.accessToken
//     }
//   });
// }


// // Send email route
// app.post('/api/send-email', (req, res) => {
//   // Authenticate user based on session or request data
//   const user = req.body; // Assuming user is authenticated
//   // Create Nodemailer transporter using user's credentials
//   const transporter = createTransporter(user);
//   console.log(transporter)
//   // Send email using transporter
//   transporter.sendMail({
//     from: user.email,
//     to: 'aakashseth454@gmail.com',
//     subject: 'Test Email',
//     text: 'This is a test email sent from Nodemailer using Gmail OAuth 2.0.'
//   }, (error, info) => {
//     if (error) {
//       console.error(error);
//       res.status(500).send('Error sending email');
//     } else {
//       console.log('Email sent:', info.response);
//       res.status(200).send('Email sent successfully');
//     }
//   });
// });


// ---------------------------------------------------- New Booking Form  ---------------------------------------------------------------

app.get('/api/redesigned-leadData/:CompanyName', async (req, res) => {
  try {
    const CompanyName = req.params.CompanyName;
    const data = await RedesignedDraftModel.find({"Company Name": CompanyName});
    res.json(data);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

app.post('/api/redesigned-leadData/:CompanyName/:step', upload.fields([
  { name: "otherDocs", maxCount: 50 },
  { name: "paymentReceipt", maxCount: 2 },
]), async (req, res) => {
  try {
    const companyName = req.params.CompanyName;
    const newData = req.body;
    const Step = req.params.step
    if (Step === "step1") {
      const existingData = await RedesignedDraftModel.findOne({ "Company Name": companyName });
    
      if (existingData) {
        // Update existing data if found
        const updatedData = await RedesignedDraftModel.findOneAndUpdate(
          { "Company Name": companyName },
          {
            $set: {
              "Company Email": newData["Company Email"] || existingData["Company Email"],
              "Company Name": newData["Company Name"] || existingData["Company Name"],
              "Company Number": newData["Company Number"] || existingData["Company Number"],
              incoDate: newData.incoDate || existingData.incoDate,
              panNumber: newData.panNumber || existingData.panNumber,
              gstNumber: newData.gstNumber || existingData.gstNumber,
            },
          },
          { new: true }
        );
        res.status(200).json(updatedData);
        return true; // Respond with updated data
      } else {
        // Create new data if not found
        const createdData = await RedesignedDraftModel.create({
          "Company Email": newData["Company Email"] ,
          "Company Name": newData["Company Name"],
          "Company Number": newData["Company Number"],
          incoDate: newData.incoDate ,
          panNumber: newData.panNumber ,
          gstNumber: newData.gstNumber,
          Step1Status:true
        },);
        res.status(201).json(createdData); // Respond with created data
        return true;
      }
    } else if (Step === "step2") {
      const existingData = await RedesignedDraftModel.findOne({ "Company Name": companyName });
    
      if (existingData) {
        // Update existing data if found
        const updatedData = await RedesignedDraftModel.findOneAndUpdate(
          { "Company Name": companyName },
          {
            $set: {
              bdeName: newData.bdeName || existingData.bdeName,
              bdeEmail: newData.bdeEmail || existingData.bdeEmail,
              bdmName: newData.bdmName || existingData.bdmName,
              bdmEmail: newData.bdmEmail || existingData.bdmEmail,
              bookingDate: newData.bookingDate || existingData.bookingDate,
              bookingSource: newData.bookingSource || existingData.bookingSource,
              Step2Status:true
            }            
          },
          { new: true }
        );
        res.status(200).json(updatedData);
        return true; // Respond with updated data
      } 
    }else if (Step === "step3") {
      const existingData = await RedesignedDraftModel.findOne({ "Company Name": companyName });
    
      if (existingData) {
        // Update existing data if found
        const updatedData = await RedesignedDraftModel.findOneAndUpdate(
          { "Company Name": companyName },
          {
            $set: {
              services:newData.services || existingData.services,
              numberOfServices : newData.numberOfServices || existingData.numberOfServices,
              caCase:newData.caCase,
              caCommission:newData.caCommission,
              caNumber:newData.caNumber,
              caEmail:newData.caEmail,
              totalAmount: newData.totalAmount || existingData.totalAmount,
              pendingAmount: newData.pendingAmount || existingData.pendingAmount,
              receivedAmount: newData.receivedAmount || existingData.receivedAmount,
              Step3Status:true
            }            
          },
          { new: true }
        );
        res.status(200).json(updatedData);
        return true; // Respond with updated data
      } 
    }
    else if (Step === "step4") {
      const existingData = await RedesignedDraftModel.findOne({ "Company Name": companyName });
      newData.otherDocs = req.files['otherDocs'] === undefined ? "" : req.files['otherDocs'].map(file => file);
      newData.paymentReceipt = req.files['paymentReceipt'] === undefined ? "" : req.files['paymentReceipt'].map(file => file);
      if (existingData) {
        // Update existing data if found
        const updatedData = await RedesignedDraftModel.findOneAndUpdate(
          { "Company Name": companyName },
          {
            $set: {
              totalAmount: newData.totalAmount || existingData.totalAmount,
              pendingAmount: newData.pendingAmount || existingData.pendingAmount,
              receivedAmount: newData.receivedAmount || existingData.receivedAmount,
              paymentReceipt: newData.paymentReceipt || existingData.paymentReceipt,
              otherDocs: newData.otherDocs || existingData.otherDocs,
              paymentMethod:newData.paymentMethod || newData.paymentMethod,
              extraNotes:newData.extraNotes || newData.extraNotes,
              Step4Status:true
            }            
          },
          { new: true }
        );
        res.status(200).json(updatedData);
        return true; // Respond with updated data
      } 
    }else if (Step === "step5"){
      const updatedData = await RedesignedDraftModel.findOneAndUpdate(
        { "Company Name": companyName },
        {
          $set: {
            Step5Status:true
          }            
        },
        { new: true }
      );
      res.status(200).json(updatedData);
      return true; // R
    }
    // Add uploaded files information to newData

    newData.otherDocs = req.files['otherDocs'] === undefined ? "" : req.files['otherDocs'].map(file => file);
    newData.paymentReceipt = req.files['paymentReceipt'] === undefined ? "" : req.files['paymentReceipt'].map(file => file);


    // Search for existing data by Company Name
    const existingData = await RedesignedDraftModel.findOne({ "Company Name" : companyName });

    if (existingData) {
      // Update existing data if found
      const updatedData = await RedesignedDraftModel.findOneAndUpdate(
        { "Company Name" : companyName },
        { $set: newData },
        { new: true }
      );
      res.status(200).json(updatedData); // Respond with updated data
    } else {
      // Create new data if not found
      const createdData = await RedesignedDraftModel.create({ ...newData, companyName });
      res.status(201).json(createdData); // Respond with created data
    }
  } catch (error) {
    console.error('Error creating/updating data:', error);
    res.status(500).send('Error creating/updating data'); // Send an error response
  }
});

// app.post('/api/redesigned-final-leadData/:CompanyName', async (req, res) => {
//   try {
 
//     const newData = req.body;
//     const createdData = await RedesignedLeadformModel.create(newData);

//     const renderServices = ()=>{
//       const services = [];
     
//         for(let i = 0; i < newData.numberOfServices; i++){
//           services.push(
            
//           )

//         }
      
//     }
//     res.status(201).send("Data sent"); 
  
//      const recipients = [
//         `${newData.bdmEmail}`,
//         `${newData.bdeName}`,
//       ];
//     sendMail(
//         recipients,
//         "Mail received",
//         ``,
//         ` <div style="width: 100%; padding: 20px 20px; background: #f6f8fb;">
//         <h3 style="text-align: center">Booking Form Deatils</h3>
//         <div style="
//               width: 95%;
//               margin: 0 auto;
//               padding: 20px 20px;
//               background: #fff;
//               border-radius: 10px;
//             ">
//           <!--Step One Start-->
//           <div style="width: 98%; margin: 0 auto">
//             <!-- Step's heading -->
//             <div style="display: flex; align-items: center">
//               <div style="
//                     width: 30px;
//                     height: 30px;
//                     line-height: 30px;
//                     border-radius: 100px;
//                     background: #fbb900;
//                     text-align: center;
//                     font-weight: bold;
//                     color: #fff;
//                   ">
//                 1
//               </div>
//               <div style="margin-left: 10px">Company's Basic Informations</div>
//             </div>
//             <!-- Step's Table -->
//             <div style="
//                   background: #f7f7f7;
//                   padding: 15px;
//                   border-radius: 10px;
//                   position: relative;
//                   margin-top: 15px;
//                 ">
//               <div style="display: flex; flex-wrap: wrap">
//                 <div style="width: 25%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                     Company Name
//                   </div>
//                 </div>
//                 <div style="width: 75%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                     ${newData["Company Name"]}
//                   </div>
//                 </div>
//               </div>
//               <div style="display: flex; flex-wrap: wrap">
//                 <div style="width: 25%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                     Email Address:
//                   </div>
//                 </div>
//                 <div style="width: 75%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                       ${newData["Company Email"]}
//                   </div>
//                 </div>
//               </div>
//               <div style="display: flex; flex-wrap: wrap">
//                 <div style="width: 25%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                     Phone No:
//                   </div>
//                 </div>
//                 <div style="width: 75%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                       ${newData["Company Number"]}
//                   </div>
//                 </div>
//               </div>
    
//               <div style="display: flex; flex-wrap: wrap">
//                 <div style="width: 25%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                     Incorporation date:
//                   </div>
//                 </div>
//                 <div style="width: 75%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                       ${newData["incoDate"]}
//                   </div>
//                 </div>
//               </div>
//               <div style="display: flex; flex-wrap: wrap">
//                 <div style="width: 25%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                     Company's PAN:
//                   </div>
//                 </div>
//                 <div style="width: 75%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                       ${newData.panNumber}
//                   </div>
//                 </div>
//               </div>
//               <div style="display: flex; flex-wrap: wrap">
//                 <div style="width: 25%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                     Company's GST:
//                   </div>
//                 </div>
//                 <div style="width: 75%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                       ${newData.gstNumber}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <!--Step One End-->
    
    
//           <!--Step Two Start-->
//           <div style="width: 98%; margin: 10px auto">
//             <!-- Step's heading -->
//             <div style="display: flex; align-items: center">
//               <div style="
//                     width: 30px;
//                     height: 30px;
//                     line-height: 30px;
//                     border-radius: 100px;
//                     background: #fbb900;
//                     text-align: center;
//                     font-weight: bold;
//                     color: #fff;
//                   ">
//                 2
//               </div>
//               <div style="margin-left: 10px">Booking Details</div>
//             </div>
//             <!-- Step's Table -->
//             <div style="
//                   background: #f7f7f7;
//                   padding: 15px;
//                   border-radius: 10px;
//                   position: relative;
//                   margin-top: 15px;
//                 ">
//               <div style="display: flex; flex-wrap: wrap">
//                 <div style="width: 25%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                     BDE Name:
//                   </div>
//                 </div>
//                 <div style="width: 75%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                       ${newData.bdeName}
//                   </div>
//                 </div>
//               </div>
//               <div style="display: flex; flex-wrap: wrap">
//                 <div style="width: 25%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                     BDE Email
//                   </div>
//                 </div>
//                 <div style="width: 75%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                       ${newData.bdmEmail ? newData.bdmEmail : "-"}
//                   </div>
//                 </div>
//               </div>
//               <div style="display: flex; flex-wrap: wrap">
//                 <div style="width: 25%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                     BDM Name
//                   </div>
//                 </div>
//                 <div style="width: 75%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                       ${newData.bdmName}
//                   </div>
//                 </div>
//               </div>
    
//               <div style="display: flex; flex-wrap: wrap">
//                 <div style="width: 25%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                     BDM Email
//                   </div>
//                 </div>
//                 <div style="width: 75%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                       ${newData.bdmEmail ? newData.bdmEmail : "-"}
//                   </div>
//                 </div>
//               </div>
//               <div style="display: flex; flex-wrap: wrap">
//                 <div style="width: 25%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                    Booking Date
//                   </div>
//                 </div>
//                 <div style="width: 75%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                       ${newData.bookingDate}
//                   </div>
//                 </div>
//               </div>
//               <div style="display: flex; flex-wrap: wrap">
//                 <div style="width: 25%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                     Lead Source
//                   </div>
//                 </div>
//                 <div style="width: 75%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                       ${newData.bookingSource}
//                   </div>
//                 </div>
//               </div>
//               <div style="display: flex; flex-wrap: wrap">
//                 <div style="width: 25%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                     Other Lead Source
//                   </div>
//                 </div>
//                 <div style="width: 75%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                       ${newData.bookingSource}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <!-- Step 2 Ends -->
    
    
//           <!--Step 3 Start-->
//           <div style="width: 98%; margin: 10px auto">
//             <!-- Step's heading -->
//             <div style="display: flex; align-items: center">
//               <div style="
//                     width: 30px;
//                     height: 30px;
//                     line-height: 30px;
//                     border-radius: 100px;
//                     background: #fbb900;
//                     text-align: center;
//                     font-weight: bold;
//                     color: #fff;
//                   ">
//                 3
//               </div>
//               <div style="margin-left: 10px">Services And Payment Details</div>
//             </div>
//             <!-- Step's Table -->
//             <div style="
//                   background: #f7f7f7;
//                   padding: 15px;
//                   border-radius: 10px;
//                   position: relative;
//                   margin-top: 15px;
//                 ">
//               <div style="display: flex; flex-wrap: wrap">
//                 <div style="width: 25%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                     Total Selected Services
//                   </div>
//                 </div>
//                 <div style="width: 75%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                       ${newData.numberOfServices}
//                   </div>
//                 </div>
//               </div>
//              ${renderServices()}
             
//             </div>
//           </div>
//           <!-- Step 3 Ends -->
    
//           <!--Step 4 Start-->
//           <div style="width: 98%; margin: 10px auto">
//             <!-- Step's heading -->
//             <div style="display: flex; align-items: center">
//               <div style="
//                     width: 30px;
//                     height: 30px;
//                     line-height: 30px;
//                     border-radius: 100px;
//                     background: #fbb900;
//                     text-align: center;
//                     font-weight: bold;
//                     color: #fff;
//                   ">
//                 4
//               </div>
//               <div style="margin-left: 10px">Payment Summery</div>
//             </div>
//             <!-- Step's Table -->
//             <div style="
//                   background: #f7f7f7;
//                   padding: 15px;
//                   border-radius: 10px;
//                   position: relative;
//                   margin-top: 15px;
//                 ">
//               <div style="display: flex; flex-wrap: wrap">
//                 <div style="width: 33%; display: flex;">
//                   <div style="width: 25%">
//                     <div style="
//                           border: 1px solid #ccc;
//                           font-size: 12px;
//                           padding: 5px 10px;
//                         ">
//                       Total Payment
//                     </div>
//                   </div>
//                   <div style="width: 75%">
//                     <div style="
//                           border: 1px solid #ccc;
//                           font-size: 12px;
//                           padding: 5px 10px;
//                         ">
//                       ₹ 38000
//                     </div>
//                   </div>
//                 </div>
//                 <div style="width: 34%; display: flex;">
//                   <div style="width: 28%">
//                     <div style="
//                           border: 1px solid #ccc;
//                           font-size: 12px;
//                           padding: 5px 10px;
//                         ">
//                      Received Payment
//                     </div>
//                   </div>
//                   <div style="width: 72%">
//                     <div style="
//                           border: 1px solid #ccc;
//                           font-size: 12px;
//                           padding: 5px 10px;
//                         ">
//                       ₹ 38000
//                     </div>
//                   </div>
    
//                 </div>
//                 <div style="width: 33%; display: flex;">
//                   <div style="width: 28%">
//                     <div style="
//                           border: 1px solid #ccc;
//                           font-size: 12px;
//                           padding: 5px 10px;
//                         ">
//                       Pending Payment
//                     </div>
//                   </div>
//                   <div style="width: 72%">
//                     <div style="
//                           border: 1px solid #ccc;
//                           font-size: 12px;
//                           padding: 5px 10px;
//                         ">
//                      ₹ 38000
//                     </div>
//                   </div>
    
//                 </div>
                
//               </div>
//               <div style="display: flex; flex-wrap: wrap; margin-top: 20px;">
//                 <div style="width: 25%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                    Payment Method
//                   </div>
//                 </div>
//                 <div style="width: 75%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                     With DSC
//                   </div>
//                 </div>
//               </div>
//               <div style="display: flex; flex-wrap: wrap">
//                 <div style="width: 25%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                   Extra Remarks
//                   </div>
//                 </div>
//                 <div style="width: 75%">
//                   <div style="
//                         border: 1px solid #ccc;
//                         font-size: 12px;
//                         padding: 5px 10px;
//                       ">
//                     XYZ
//                   </div>
//                 </div>
//               </div>
    
          
             
//             </div>
//           </div>
//           <!-- Step 4 Ends -->
//         </div>
//       </div>
        

//         `,
//         newData.otherDocs,
//         newData.paymentReceipt
//       );
   
//   } catch (error) {
//     console.error('Error creating/updating data:', error);
//     res.status(500).send('Error creating/updating data'); // Send an error response
//   }
// });
app.get('/api/redesigned-final-leadData', async (req, res) => {
  try {
    
    const allData = await RedesignedLeadformModel.find();
    res.status(200).json(allData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});
// Backend: API endpoint for deleting a draft
app.delete('/api/redesigned-delete-model/:companyName', async (req, res) => {
  try {
    const companyName = req.params.companyName;
    // Assuming RedesignedDraftModel is your Mongoose model for drafts
    const deletedDraft = await RedesignedDraftModel.findOneAndDelete({ "Company Name": companyName });
    if (deletedDraft) {
      console.log('Draft deleted successfully:', deletedDraft);
      res.status(200).json({ message: 'Draft deleted successfully' });
    } else {
      console.error('Draft not found or already deleted');
      res.status(404).json({ error: 'Draft not found or already deleted' });
    }
  } catch (error) {
    console.error('Error deleting draft:', error);
    res.status(500).json({ error: 'Error deleting draft' });
  }
});

app.post('/api/redesigned-final-leadData/:CompanyName', async (req, res) => {
  try {
    const newData = req.body;
    const companyData = await CompanyModel.findOne({ 'Company Name': newData['Company Name'] });
    if (companyData) {
      newData.company = companyData._id; // Assuming 'company' field in RedesignedLeadformModel stores the _id of the CompanyModel
    }
    // Create a new entry in the database
    const createdData = await RedesignedLeadformModel.create(newData);
    const date = new Date().toLocaleDateString();
    if (companyData) {
      await CompanyModel.findByIdAndUpdate(companyData._id, { Status: 'Matured' , lastActionDate : date });
    }
    
    const totalAmount = newData.services.reduce(
      (acc, curr) => 
      
        acc + parseInt(curr.totalPaymentWGST),
      0
    );
    const receivedAmount = newData.services.reduce((acc, curr) => {
      return curr.paymentTerms === "Full Advanced"
        ? acc + parseInt(curr.totalPaymentWGST)
        : acc + parseInt(curr.firstPayment);
    }, 0);
    const pendingAmount = totalAmount - receivedAmount;
    // Render services HTML
    const renderServices = () => {
      let servicesHtml = '';
      for (let i = 0; i < newData.services.length; i++) {
        const displayPaymentTerms = newData.services[i].paymentTerms==="Full Advanced" ? "none" : "flex"
        servicesHtml += `
        <div>
        <div style="display: flex; flex-wrap: wrap; margin-top: 20px;">
        <div style="width: 25%">
          <div style="
                border: 1px solid #ccc;
                font-size: 12px;
                padding: 5px 10px;
              ">
            Services Name
          </div>
        </div>
        <div style="width: 75%">
          <div style="
                border: 1px solid #ccc;
                font-size: 12px;
                padding: 5px 10px;
              ">
            ${newData.services[i].
              serviceName === "Start Up Certificate" ? newData.services[i].withDSC ? "Start Up Certificate With DSC" : "Start Up Certificate" : newData.services[i].serviceName
              }
          </div>
        </div>
      </div>
      <div style="display: flex; flex-wrap: wrap">
        <div style="width: 25%">
          <div style="
                border: 1px solid #ccc;
                font-size: 12px;
                padding: 5px 10px;
              ">
          Total Amount
          </div>
        </div>
        <div style="width: 75%">
          <div style="
                border: 1px solid #ccc;
                font-size: 12px;
                padding: 5px 10px;
              ">
            ${newData.services[i].
              totalPaymentWGST
              }
          </div>
        </div>
      </div>

      <div style="display: flex; flex-wrap: wrap">
        <div style="width: 25%">
          <div style="
                border: 1px solid #ccc;
                font-size: 12px;
                padding: 5px 10px;
              ">
           With GST
          </div>
        </div>
        <div style="width: 75%">
          <div style="
                border: 1px solid #ccc;
                font-size: 12px;
                padding: 5px 10px;
              ">
            ${newData.services[i].withGST}
          </div>
        </div>
      </div>
      <div style="display: flex; flex-wrap: wrap">
        <div style="width: 25%">
          <div style="
                border: 1px solid #ccc;
                font-size: 12px;
                padding: 5px 10px;
              ">
           Payment Terms
          </div>
        </div>
        <div style="width: 75%">
          <div style="
                border: 1px solid #ccc;
                font-size: 12px;
                padding: 5px 10px;
              ">
           ${newData.services[i].paymentTerms}
          </div>
        </div>
      </div>
      <div style="display: ${displayPaymentTerms}; flex-wrap: wrap">
        <div style="width: 25%">
          <div style="
                border: 1px solid #ccc;
                font-size: 12px;
                padding: 5px 10px;
              ">
           First Payment
          </div>
        </div>
        <div style="width: 75%">
          <div style="
                border: 1px solid #ccc;
                font-size: 12px;
                padding: 5px 10px;
              ">
            ${newData.services[i].firstPayment}
          </div>
        </div>
      </div>
      <div style="display: ${displayPaymentTerms}; flex-wrap: wrap">
        <div style="width: 25%">
          <div style="
                border: 1px solid #ccc;
                font-size: 12px;
                padding: 5px 10px;
              ">
           Second Payment
          </div>
        </div>
        <div style="width: 75%">
          <div style="
                border: 1px solid #ccc;
                font-size: 12px;
                padding: 5px 10px;
              ">
            ${newData.services[i].secondPayment}
          </div>
        </div>
      </div>
      <div style="display: ${displayPaymentTerms}; flex-wrap: wrap">
        <div style="width: 25%">
          <div style="
                border: 1px solid #ccc;
                font-size: 12px;
                padding: 5px 10px;
              ">
           Third Payment
          </div>
        </div>
        <div style="width: 75%">
          <div style="
                border: 1px solid #ccc;
                font-size: 12px;
                padding: 5px 10px;
              ">
            ${newData.services[i].thirdPayment}
          </div>
        </div>
      </div>
      <div style="display: ${displayPaymentTerms}; flex-wrap: wrap">
        <div style="width: 25%">
          <div style="
                border: 1px solid #ccc;
                font-size: 12px;
                padding: 5px 10px;
              ">
           Fourth Payment
          </div>
        </div>
        <div style="width: 75%">
          <div style="
                border: 1px solid #ccc;
                font-size: 12px;
                padding: 5px 10px;
              ">
            ${newData.services[i].fourthPayment}
          </div>
        </div>
      </div>
      <div style="display: flex; flex-wrap: wrap">
        <div style="width: 25%">
          <div style="
                border: 1px solid #ccc;
                font-size: 12px;
                padding: 5px 10px;
              ">
           Payment Remarks
          </div>
        </div>
        <div style="width: 75%">
          <div style="
                border: 1px solid #ccc;
                font-size: 12px;
                padding: 5px 10px;
              ">
            ${newData.services[i].paymentRemarks}
          </div>
        </div>
      </div>
      </div>
        `;

      }
      return servicesHtml;
    };

    // Render services HTML content
    const servicesHtmlContent = renderServices();
    const visibility = newData.bookingSource!=="Other" && 'none';
    // Send email to recipients
    const recipients = [newData.bdeEmail, newData.bdmEmail,'bookings@startupsahay.com'];
    const serviceNames = newData.services.map((service, index) => `${service.serviceName}`).join(' , ');

console.log(serviceNames);

    sendMail(
      recipients,
      `${newData["Company Name"]} | ${serviceNames} | ${newData.bookingDate}`,
      ``,
      ` <div style="width: 98%; padding: 20px 10px; background: #f6f8fb;margin:0 auto">
      <h3 style="text-align: center">Booking Form Deatils</h3>
      <div style="
            width: 95%;
            margin: 0 auto;
            padding: 20px 10px;
            background: #fff;
            border-radius: 10px;
          ">
        <!--Step One Start-->
        <div style="width: 98%; margin: 0 auto">
          <!-- Step's heading -->
          <div style="display: flex; align-items: center">
            <div style="
                  width: 30px;
                  height: 30px;
                  line-height: 30px;
                  border-radius: 100px;
                  background: #fbb900;
                  text-align: center;
                  font-weight: bold;
                  color: #fff;
                ">
              1
            </div>
            <div style="margin-left: 10px">Company's Basic Informations</div>
          </div>
          <!-- Step's Table -->
          <div style="
                background: #f7f7f7;
                padding: 15px;
                border-radius: 10px;
                position: relative;
                margin-top: 15px;
              ">
            <div style="display: flex; flex-wrap: wrap">
              <div style="width: 25%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                  Company Name
                </div>
              </div>
              <div style="width: 75%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                  ${newData["Company Name"]}
                </div>
              </div>
            </div>
            <div style="display: flex; flex-wrap: wrap">
              <div style="width: 25%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                  Email Address:
                </div>
              </div>
              <div style="width: 75%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                    ${newData["Company Email"]}
                </div>
              </div>
            </div>
            <div style="display: flex; flex-wrap: wrap">
              <div style="width: 25%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                  Phone No:
                </div>
              </div>
              <div style="width: 75%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                    ${newData["Company Number"]}
                </div>
              </div>
            </div>
  
            <div style="display: flex; flex-wrap: wrap">
              <div style="width: 25%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                  Incorporation date:
                </div>
              </div>
              <div style="width: 75%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                    ${newData["incoDate"]}
                </div>
              </div>
            </div>
            <div style="display: flex; flex-wrap: wrap">
              <div style="width: 25%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                  Company's PAN:
                </div>
              </div>
              <div style="width: 75%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                    ${newData.panNumber}
                </div>
              </div>
            </div>
            <div style="display: flex; flex-wrap: wrap">
              <div style="width: 25%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                  Company's GST:
                </div>
              </div>
              <div style="width: 75%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                    ${newData.gstNumber}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--Step One End-->
  
  
        <!--Step Two Start-->
        <div style="width: 98%; margin: 10px auto">
          <!-- Step's heading -->
          <div style="display: flex; align-items: center">
            <div style="
                  width: 30px;
                  height: 30px;
                  line-height: 30px;
                  border-radius: 100px;
                  background: #fbb900;
                  text-align: center;
                  font-weight: bold;
                  color: #fff;
                ">
              2
            </div>
            <div style="margin-left: 10px">Booking Details</div>
          </div>
          <!-- Step's Table -->
          <div style="
                background: #f7f7f7;
                padding: 15px;
                border-radius: 10px;
                position: relative;
                margin-top: 15px;
              ">
            <div style="display: flex; flex-wrap: wrap">
              <div style="width: 25%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                  BDE Name:
                </div>
              </div>
              <div style="width: 75%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                    ${newData.bdeName}
                </div>
              </div>
            </div>
            <div style="display: flex; flex-wrap: wrap">
              <div style="width: 25%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                  BDE Email
                </div>
              </div>
              <div style="width: 75%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                    ${newData.bdeEmail ? newData.bdeEmail : "-"}
                </div>
              </div>
            </div>
            <div style="display: flex; flex-wrap: wrap">
              <div style="width: 25%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                  BDM Name
                </div>
              </div>
              <div style="width: 75%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                    ${newData.bdmName}
                </div>
              </div>
            </div>
  
            <div style="display: flex; flex-wrap: wrap">
              <div style="width: 25%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                  BDM Email
                </div>
              </div>
              <div style="width: 75%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                    ${newData.bdmEmail ? newData.bdmEmail : "-"}
                </div>
              </div>
            </div>
            <div style="display: flex; flex-wrap: wrap">
              <div style="width: 25%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                 Booking Date
                </div>
              </div>
              <div style="width: 75%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                    ${newData.bookingDate}
                </div>
              </div>
            </div>
            <div style="display: flex; flex-wrap: wrap">
              <div style="width: 25%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                  Lead Source
                </div>
              </div>
              <div style="width: 75%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                    ${newData.bookingSource}
                </div>
              </div>
            </div>
            <div style="display: flex; flex-wrap: wrap; display: ${visibility}">
              <div style="width: 25%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                  Other Lead Source
                </div>
              </div>
              <div style="width: 75%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                    ${newData.bookingSource}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Step 2 Ends -->
  
  
        <!--Step 3 Start-->
        <div style="width: 98%; margin: 10px auto">
          <!-- Step's heading -->
          <div style="display: flex; align-items: center">
            <div style="
                  width: 30px;
                  height: 30px;
                  line-height: 30px;
                  border-radius: 100px;
                  background: #fbb900;
                  text-align: center;
                  font-weight: bold;
                  color: #fff;
                ">
              3
            </div>
            <div style="margin-left: 10px">Services And Payment Details</div>
          </div>
          <!-- Step's Table -->
          <div style="
                background: #f7f7f7;
                padding: 15px;
                border-radius: 10px;
                position: relative;
                margin-top: 15px;
              ">
            <div style="display: flex; flex-wrap: wrap">
              <div style="width: 25%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                  Total Selected Services
                </div>
              </div>
              <div style="width: 75%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                    ${newData.services.length}
                </div>
              </div>
            </div>
           ${servicesHtmlContent}
           
          </div>
        </div>
        <!-- Step 3 Ends -->
  
        <!--Step 4 Start-->
        <div style="width: 98%; margin: 10px auto">
          <!-- Step's heading -->
          <div style="display: flex; align-items: center">
            <div style="
                  width: 30px;
                  height: 30px;
                  line-height: 30px;
                  border-radius: 100px;
                  background: #fbb900;
                  text-align: center;
                  font-weight: bold;
                  color: #fff;
                ">
              4
            </div>
            <div style="margin-left: 10px">Payment Summery</div>
          </div>
          <!-- Step's Table -->
          <div style="
                background: #f7f7f7;
                padding: 15px;
                border-radius: 10px;
                position: relative;
                margin-top: 15px;
              ">
            <div style="display: flex; flex-wrap: wrap">
              <div style="width: 33.33%; display: flex;">
                <div style="width: 50%">
                  <div style="
                        border: 1px solid #ccc;
                        font-size: 12px;
                        padding: 5px 10px;
                      ">
                    Total Payment
                  </div>
                </div>
                <div style="width: 50%">
                  <div style="
                        border: 1px solid #ccc;
                        font-size: 12px;
                        padding: 5px 10px;
                      ">
                    ₹ ${totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>
              <div style="width: 33.33%; display: flex;">
                <div style="width: 50%">
                  <div style="
                        border: 1px solid #ccc;
                        font-size: 12px;
                        padding: 5px 10px;
                      ">
                   Received Payment
                  </div>
                </div>
                <div style="width: 50%">
                  <div style="
                        border: 1px solid #ccc;
                        font-size: 12px;
                        padding: 5px 10px;
                      ">
                    ₹ ${receivedAmount.toFixed(2)}
                  </div>
                </div>
  
              </div>
              <div style="width: 33.33%; display: flex;">
                <div style="width: 50%">
                  <div style="
                        border: 1px solid #ccc;
                        font-size: 12px;
                        padding: 5px 10px;
                      ">
                    Pending Payment
                  </div>
                </div>
                <div style="width: 50%">
                  <div style="
                        border: 1px solid #ccc;
                        font-size: 12px;
                        padding: 5px 10px;
                      ">
                   ₹ ${pendingAmount.toFixed(2)}
                  </div>
                </div>
  
              </div>
              
            </div>
            <div style="display: flex; flex-wrap: wrap; margin-top: 20px;">
              <div style="width: 25%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                 Payment Method
                </div>
              </div>
              <div style="width: 75%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                  ${newData.paymentMethod}
                </div>
              </div>
            </div>
            <div style="display: flex; flex-wrap: wrap">
              <div style="width: 25%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                Extra Remarks
                </div>
              </div>
              <div style="width: 75%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                  ${newData.extraNotes}
                </div>
              </div>
            </div>
  
        
           
          </div>
        </div>
        <!-- Step 4 Ends -->
      </div>
    </div>
      

      `,
      newData.otherDocs,
      newData.paymentReceipt
    );
 

    // Send success response
    res.status(201).send('Data sent');
  } catch (error) {
    console.error('Error creating/updating data:', error);
    res.status(500).send('Error creating/updating data'); // Send an error response
  }
});

http.listen(3001, function () {
  console.log("Server started...");

  socketIO.on("connection", function (socket) {
    console.log("User connected: " + socket.id);
    socketIO.emit('employee-entered'); 

    socket.on("disconnect", async function () {
      const date = new Date().toString();
      console.log("User disconnected: " + socket.id);
      socketIO.emit("user-disconnected");
      try {
        await adminModel.updateOne({ Active: socket.id }, { Active: date });
        console.log('Admin updated: ' + socket.id);
      } catch (error) {
        console.error('Error updating admin:', error);
      }
    });
  });
});



