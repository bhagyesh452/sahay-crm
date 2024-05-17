const express = require("express");
const cors = require("cors");
const compression = require("compression");
const pdf = require("html-pdf");
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
const json2csv = require("json2csv").parse;
const fastCsv = require("fast-csv");
const RecentUpdatesModel = require("./models/RecentUpdates");
const FollowUpModel = require("./models/FollowUp");
const DraftModel = require("./models/DraftLeadform");
const { type } = require("os");
const LeadModel_2 = require("./models/Leadform_2");
const RedesignedLeadformModel = require("./models/RedesignedLeadform");
const EditableDraftModel = require("./models/EditableDraftModel");
const RedesignedDraftModel = require("./models/RedesignedDraftModel");
const { sendMail2 } = require("./helpers/sendMail2");
//const axios = require('axios');
const crypto = require("crypto");
const TeamModel = require("./models/TeamModel.js");
const TeamLeadsModel = require("./models/TeamLeads.js");
const RequestMaturedModel = require("./models/RequestMatured.js");
const InformBDEModel = require("./models/InformBDE.js");
const { dataform_v1beta1 } = require("googleapis");
// const { Cashfree } = require('cashfree-pg');

// const http = require('http');
// const socketIo = require('socket.io');
require("dotenv").config();

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(compression());
app.use(
  express.urlencoded({
    extended: true,
  })
);

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

  const user = await onlyAdminModel.findOne({
    admin_email: username,
    admin_password: password,
  });
  console.log("user", user);
  //console.log(user);
  if (user) {
    // Generate a JWT token
    // console.log("user is appropriate");
    const adminName = user.admin_name;
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1h",
    });
    console.log(adminName, token);
    res.status(200).json({ token, adminName });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
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

// -------------------------------api for payment link---------------------------------

// const CASHFREE_API_KEY = '218584e2c3a22f9395f52faa1b485812';
// const CASHFREE_SECRET_KEY = 'd501ddfae2bdb6fabb52844038e67b592fb09398';

// app.post('/api/generatePaymentLink', async (req, res) => {
//   console.log(req.body)
//   try {
//     const { orderId, amount, customerName, customerEmail, customerPhone } = req.body;

//     const data = {
//       appId: CASHFREE_API_KEY,
//       orderId,
//       orderAmount: amount.toString(),
//       orderCurrency: 'INR',
//       orderNote: 'Payment for services',
//       customerName,
//       customerPhone,
//       customerEmail,
//     };
//     const config = {
//       headers: {
//         'Content-Type': 'application/json',
//         'x-client-id': CASHFREE_API_KEY,
//         'x-client-secret': CASHFREE_SECRET_KEY,
//       },
//     };

//     const response = await axios.post('https://test.cashfree.com/api/v1/order/create', data, config);
//     const paymentLink = response.data;
//     console.log(paymentLink)
//     res.json({ paymentLink });
//   } catch (error) {
//     console.error('Error generating payment link:', error);
//     res.status(500).json({ error: 'Could not generate payment link' });
//   }
// });
// ---------------------------------------------------------- Kam ka code -------------------------------------------------------
// Cashfree.XClientId = process.env.CLIENT_ID;
// Cashfree.XClientSecret = process.env.CLIENT_SECRET;
// Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

// function generateOrderId() {
//   const uniqueId = crypto.randomBytes(16).toString('hex');

//   const hash = crypto.createHash('sha256');
//   hash.update(uniqueId);

//   const orderId = hash.digest('hex');
//   console.log(orderId)
//   return orderId.substr(0, 12);
// }

// app.get('/api/payment', async (req, res) => {

//   try {

//     let request = {
//       "order_amount": 1.00,
//       "order_currency": "INR",
//       "order_id": await generateOrderId(),
//       "customer_details": {
//         "customer_id": "webcodder01",
//         "customer_phone": "9999999999",
//         "customer_name": "Web Codder",
//         "customer_email": "webcodder@example.com"
//       },
//     }

//     Cashfree.PGCreateOrder("2022-09-01", request).then(response => {
//       console.log(response.data);
//       res.json(response.data);

//     }).catch(error => {
//       console.error(error.response.data.message);
//     })

//   } catch (error) {
//     console.log(error);
//   }

// })

// app.post('/api/verify', async (req, res) => {
//   try {

//     let { orderId } = req.body;

//     Cashfree.PGOrderFetchPayments("2023-08-01", orderId).then((response) => {

//       res.json(response.data);
//     }).catch(error => {
//       console.error(error.response.data.message);
//     })

//   } catch (error) {
//     console.log(error);
//   }
// })

//----------------------------------------------------- Kam Ka code End -------------------------------------------------------------

app.post("/api/employeelogin", async (req, res) => {
  const { email, password } = req.body;
  //console.log(email , password)
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
    socketIO.emit("Employee-login");
  }
});

app.post("/api/datamanagerlogin", async (req, res) => {
  const { email, password } = req.body;

  // Replace this with your actual Employee authentication logic
  const user = await adminModel.findOne({
    email: email,
    password: password,
    //designation: "Sales Executive",
  });
  //console.log(user)

  if (!user) {
    //console.log("not user condition")
    return res.status(401).json({ message: "Invalid email or password" });
  } else if (user.designation !== "Data Manager") {
    // If designation is incorrect

    return res.status(401).json({ message: "Designation is incorrect" });
  } else {
    //console.log("user condition")
    const newtoken = jwt.sign({ employeeId: user._id }, secretKey, {
      expiresIn: "10h",
    });
    //console.log(newtoken)
    res.status(200).json({ newtoken });
    // socketIO.emit("Employee-login");
  }
});

app.post("/api/bdmlogin", async (req, res) => {
  const { email, password } = req.body;
  //console.log(email,password)
  const user = await adminModel.findOne({
    email: email,
    password: password,
  });
  //console.log(user)
  if (!user) {
    // If user is not found
    return res.status(401).json({ message: "Invalid email or password" });
  } else if (user.designation !== "Sales Manager") {
    // If designation is incorrect
    return res.status(401).json({ message: "Designation is incorrect" });
  } else {
    // If credentials are correct
    const bdmToken = jwt.sign({ employeeId: user._id }, secretKey, {
      expiresIn: "10h",
    });
    //console.log(bdmToken)
    res.status(200).json({ bdmToken });
    //socketIO.emit("Employee-login");
  }
});

// app.post("/api/datamanagerlogin", async (req, res) => {
//   const { email, password } = req.body;
//   console.log(email,password)
//   // Replace this with your actual Employee authentication logic
//   const user = await adminModel.findOne({
//     email: email,
//     password: password,
//     designation: "Data Manager",
//   });
//   // console.log(user);

//   if (user) {
//     const newtoken = jwt.sign({ employeeId: user._id }, secretKey, {
//       expiresIn: "10h",
//     });
//     res.json({ newtoken });
//     //socketIO.emit('Employee-login');

//   } else {
//     res.status(401).json({ message: "Invalid credentials" });
//   }
// });

app.put("/api/online-status/:id/:socketID", async (req, res) => {
  const { id } = req.params;
  const { socketID } = req.params;
  console.log("kuhi", socketID);
  try {
    const admin = await adminModel.findByIdAndUpdate(
      id,
      { Active: socketID },
      { new: true }
    );
    res.status(200).json(admin);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.put("/api/online-status/:id/disconnect", async (req, res) => {
  const { id } = req.params;
  const date = new Date().toString();
  try {
    const admin = await adminModel.findByIdAndUpdate(
      id,
      { Active: date },
      { new: true }
    );
    res.status(200).json(admin);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
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

// app.post("/api/leads", async (req, res) => {
//   const csvData = req.body;
//   let counter = 0;
//   let sucessCounter = 0;

//   try {
//     for (const employeeData of csvData) {
//       try {
//         const employeeWithAssignData = {
//           ...employeeData,
//           AssignDate: new Date(),
//         };
//         const employee = new CompanyModel(employeeWithAssignData);
//         const savedEmployee = await employee.save();
//         sucessCounter++;
//       } catch (error) {
//         console.error("Error saving employee:", error.message);
//         counter++;
//         // res.status(500).json({ error: 'Internal Server Error' });

//         // Handle the error for this specific entry, but continue with the next one
//       }
//     }
//     res.status(200).json({
//       message: "Data sent successfully",
//       counter: counter,
//       sucessCounter: sucessCounter,
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//     console.error("Error in bulk save:", error.message);
//   }
// });

app.post("/api/leads", async (req, res) => {
  const csvData = req.body;
  //console.log("csvdata" , csvData)
  let counter = 0;
  let successCounter = 0;
  let duplicateEntries = []; // Array to store duplicate entries

  try {
    for (const employeeData of csvData) {
      //console.log("employee" , employeeData)
      try {
        const employeeWithAssignData = {
          ...employeeData,
          AssignDate: new Date(),
          "Company Name": employeeData["Company Name"].toUpperCase(),
        };
        const employee = new CompanyModel(employeeWithAssignData);
        //console.log("newemployee" , employee)
        const savedEmployee = await employee.save();
        //console.log("saved" , savedEmployee)
        successCounter++;
      } catch (error) {
        duplicateEntries.push(employeeData);
        //console.log("kuch h ye" , duplicateEntries);
        console.error("Error saving employee:", error.message);
        counter++;
      }
    }
    if (duplicateEntries.length > 0) {
      // If there are duplicate entries, create and send CSV
      const csvString = createCSVString(duplicateEntries);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=DuplicateEntries.csv"
      );
      res.status(200).end(csvString);

      //console.log("csvString" , csvString)
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

function createCSVString(data) {
  const csvData = [];
  // Push the headers as the first row
  csvData.push([
    "Company Name",
    "Company Number",
    "Company Email",
    "Company Incorporation Date",
    "City",
    "State",
    `"${lead["Company Address"]}"`,
    "Director Name(First)",
    "Director Number(First)",
    "Director Email(First)",
    "Director Name(Second)",
    "Director Number(Second)",
    "Director Email(Second)",
    "Director Name(Third)",
    "Director Number(Third)",
    "Director Email(Third)",
    "ename",
    "AssignDate",
    "Status",
    `"${lead["Remarks"]}"`,
  ]);

  // Push each duplicate entry as a row into the csvData array
  data.forEach((lead) => {
    const rowData = [
      lead["Company Name"],
      lead["Company Number"],
      lead["Company Email"],
      lead["Company Incorporation Date"],
      lead["City"],
      lead["State"],
      `"${lead["Company Address"]}"`, // Enclose Company Address in double quotes
      lead["Director Name(First)"],
      lead["Director Number(First)"],
      lead["Director Email(First)"],
      lead["Director Name(Second)"],
      lead["Director Number(Second)"],
      lead["Director Email(Second)"],
      lead["Director Name(Third)"],
      lead["Director Number(Third)"],
      lead["Director Email(Third)"],
      lead["ename"],
      lead["AssignDate"],
      lead["Status"],
      `"${lead["Remarks"]}"`, // Enclose Remarks in double quotes
    ];
    csvData.push(rowData);
  });

  return csvData.map((row) => row.join(",")).join("\n");
}

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

app.get("/api/employee-history/:companyName", async (req, res) => {
  try {
    // Extract the companyName from the URL parameter
    const { companyName } = req.params;

    // Query the database to find all data with matching companyName
    const employeeHistory = await EmployeeHistory.find({ companyName });

    // Respond with the fetched data
    res.json(employeeHistory);
  } catch (error) {
    // Handle errors
    console.error("Error fetching employee history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/specific-company/:companyId", async (req, res) => {
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
// app.get("/api/insert-bdmName", async (req, res) => {
//   try {
//     // Find RedesignedLeadformModel documents where bdmName and bdeName are not the same
//     const redesignedData = await RedesignedLeadformModel.find({
//       $expr: { $ne: ["$bdmName", "$bdeName"] }
//     });

//     // Iterate over each document in redesignedData
//     for (const doc of redesignedData) {
//       // Update the corresponding CompanyModel document with maturedBdmName
//       await CompanyModel.findByIdAndUpdate(
//         { _id: doc.company },
//         { $set: { maturedBdmName: doc.bdmName } }
//       );
//     }
//     const remarksHistories = await RemarksHistory.find();
//     for(const doc of remarksHistories){
//      const obj = await CompanyModel.findById({
//         _id: doc.companyID
//       });
//       if(obj){
//         await RemarksHistory.findByIdAndUpdate({_id:doc._id},{$set:{bdeName:obj.ename}});
//       }
//     }

//     // Send the updated redesignedData as a response
//     res.json(redesignedData);

//   } catch (error) {
//     console.error("Error fetching company:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

app.post("/api/requestCompanyData", async (req, res) => {
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

app.post("/api/change-edit-request/:companyName", async (req, res) => {
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

app.post("/api/manual", async (req, res) => {
  const receivedData = req.body;
  //console.log("receiveddata" , receivedData)

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

    await TeamLeadsModel.findByIdAndUpdate(id, { Remarks: Remarks });

    // Fetch updated data and remarks history
    const updatedCompany = await CompanyModel.findById(id);
    const remarksHistory = await RemarksHistory.find({ companyId: id });

    res.status(200).json({ updatedCompany, remarksHistory });
  } catch (error) {
    console.error("Error updating remarks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ------------------------------------------update-remarks-bdm-------------------------

app.post("/api/update-remarks-bdm/:id", async (req, res) => {
  const { id } = req.params;
  const { Remarks } = req.body;

  try {
    // Update remarks and fetch updated data in a single operation
    await CompanyModel.findByIdAndUpdate(id, { bdmRemarks: Remarks });

    await TeamLeadsModel.findByIdAndUpdate(id, { bdmRemarks: Remarks });

    // Fetch updated data and remarks history
    const updatedCompany = await CompanyModel.findById(id);
    const remarksHistory = await RemarksHistory.find({ companyId: id });

    res.status(200).json({ updatedCompany, remarksHistory });
  } catch (error) {
    console.error("Error updating remarks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --------------------------------remarks-history-bdm-------------------------------------

app.post("/api/remarks-history-bdm/:companyId", async (req, res) => {
  const { companyId } = req.params;
  const { Remarks, remarksBdmName, currentCompanyName } = req.body;

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
      bdmRemarks: Remarks,
      bdmName: remarksBdmName,
      companyName: currentCompanyName,
    });

    await TeamLeadsModel.findByIdAndUpdate(companyId, { bdmRemarks: Remarks });

    // Save the new entry to MongoDB
    await newRemarksHistory.save();
    res.json({ success: true, message: "Remarks history added successfully" });
  } catch (error) {
    console.error("Error adding remarks history:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.delete("/api/delete-remarks-history/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Update remarks and fetch updated data in a single operation

    // Fetch updated data and remarks history
    const remarksHistory = await RemarksHistory.findByIdAndDelete({
      companyId: id,
    });

    res.status(200).json({ updatedCompany, remarksHistory });
  } catch (error) {
    console.error("Error updating remarks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/remarks-delete/:companyId", async (req, res) => {
  const { companyId } = req.params;

  try {
    // Find the company by companyId and update the remarks field
    const updatedCompany = await CompanyModel.findByIdAndUpdate(
      companyId,
      { Remarks: "No Remarks Added" },
      { new: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    res
      .status(200)
      .json({ message: "Remarks deleted successfully", updatedCompany });
  } catch (error) {
    console.error("Error deleting remarks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// -------------------------------bdm-remarks-delete--------------------------------------

app.delete("/api/remarks-delete-bdm/:companyId", async (req, res) => {
  const { companyId } = req.params;

  try {
    // Find the company by companyId and update the remarks field
    const updatedCompany = await TeamLeadsModel.findByIdAndUpdate(
      companyId,
      { bdmRemarks: "No Remarks Added" },
      { new: true }
    );

    const updatedCompanyMainModel = await CompanyModel.findByIdAndUpdate(
      companyId,
      { bdmRemarks: "No Remarks Added" },
      { new: true }
    );

    if (!updatedCompany || !updatedCompanyMainModel) {
      return res.status(404).json({ message: "Company not found" });
    }

    res
      .status(200)
      .json({ message: "Remarks deleted successfully", updatedCompany });
  } catch (error) {
    console.error("Error deleting remarks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/einfo", async (req, res) => {
  try {
    adminModel.create(req.body).then((respond) => {
      res.json(respond);
      console.log("newemployee", req.body);
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

app.post("/api/post-bdmwork-request/:eid", async (req, res) => {
  const eid = req.params.eid;
  const { bdmWork } = req.body;

  //console.log("bdmwork" , bdmWork)// Extract bdmWork from req.body
  try {
    await adminModel.findByIdAndUpdate(eid, { bdmWork: bdmWork });
    // Assuming you're returning updatedCompany and remarksHistory after update
    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating BDM work:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/post-bdmwork-revoke/:eid", async (req, res) => {
  const eid = req.params.eid;
  const { bdmWork } = req.body;

  try {
    await adminModel.findByIdAndUpdate(eid, { bdmWork: bdmWork });

    res.status(200).json({ message: "Status Updated Successfully" });
  } catch (error) {
    console.error("error updating bdm work", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --------------------------api for teams----------------------------------------

// app.post('/api/teaminfo', async (req, res) => {
//   try {
//       const teamData = req.body;
//       console.log(teamData)
//       const newTeam = await TeamModel.create(teamData);
//       res.status(201).json(newTeam);
//       console.log("newTeam" , newTeam)
//   } catch (error) {
//       console.error('Error creating team:', error.message);
//       res.status(500).json({ message: "Duplicate Entries Found" });
//   }
// });

// app.post('/api/teaminfo', async (req, res) => {
//   try {
//     const teamData = req.body;
//     //console.log(teamData);
//     // Assuming `formatDate()` is a function that formats the current date
//     const newTeam = await TeamModel.create({ modifiedAt: formatDate(Date.now()),...teamData});
//     console.log("newTeam", newTeam);
//     res.status(201).json(newTeam);
//   } catch (error) {
//     console.error('Error creating team:', error.message);
//     res.status(500).json({ message: "Duplicate Entries Found" });
//   }
// });

app.post("/api/teaminfo", async (req, res) => {
  const teamData = req.body;
  // Assuming `formatDate()` is a function that formats the current date

  try {
    const newTeam = await TeamModel.create({
      modifiedAt: formatDate(Date.now()),
      ...teamData,
    });
    //console.log("newTeam", newTeam);
    res.status(201).json(newTeam);
  } catch (error) {
    console.error("Error creating team:", error.message);
    if (teamData.teamName === "") {
      return res.status(500).json({ message: "Please Enter Team Name" });
    } else {
      return res.status(500).json({ message: "Duplicate Entries Found" });
    }
  }
});

app.get("/api/teaminfo", async (req, res) => {
  try {
    const data = await TeamModel.find();
    //console.log("teamdata" , data)
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/teaminfo/:ename", async (req, res) => {
  const ename = req.params.ename;
  //console.log(ename)
  //console.log(ename)
  try {
    // Fetch data using lean queries to retrieve plain JavaScript objects
    const data = await TeamModel.findOne({
      "employees.ename": ename, // Using dot notation to query field inside array of objects
    }).lean();

    res.send(data);
    //console.log("ename wala data" ,data)
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// app.post("/api/forwardtobdmdata", async (req, res) => {
//   const selectedData = req.body;
//   console.log("selectedData" , selectedData)

//   try {
//     // Assuming TeamLeadsModel has a schema similar to the selectedData structure
//     const newLead = await TeamLeadsModel.create(selectedData);
//     console.log("newLead" , newLead)
//     res.status(201).json(newLead);
//   } catch (error) {
//     console.error('Error creating new lead:', error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

app.post("/api/forwardtobdmdata", async (req, res) => {
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

    // await FollowUpModel.findOneAndUpdate( { companyName : companyName },
    // {
    //   $set: {
    //     bdmName: bdmName,
    //   },
    // },
    // { new: true })


    //console.log("newLeads", newLeads);
    res.status(201).json(newLeads);
  } catch (error) {
    console.error("Error creating new leads:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/forwardedbybdedata/:bdmName", async (req, res) => {
  const bdmName = req.params.bdmName;
  //console.log(bdmName)
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

app.get("/api/teamleadsdata", async (req, res) => {
  try {
    const data = await TeamLeadsModel.find()
    res.status(200).send(data)

  } catch (error) {
    console.log("error fetching team leads data", error.message)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.post("/api/update-bdm-status/:id", async (req, res) => {
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

app.post("/api/bdm-status-change/:id", async (req, res) => {
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
app.post(`/api/teamleads-reversedata/:id`, async (req, res) => {
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

app.post(`/api/teamleads-rejectdata/:id`, async (req, res) => {
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

// app.delete("/api/delete-followup/:companyName", async (req, res) => {
//   try {
//     // Extract the company name from the request parameters
//     const { companyName } = req.params;

//     // Check if a document with the given company name exists
//     const existingData = await FollowUpModel.findOne({ companyName });

//     if (existingData) {
//       // If the document exists, delete it
//       await FollowUpModel.findOneAndDelete({ companyName });
//       res.status(200).json({ message: "Data deleted successfully" });
//     } else {
//       // If no document with the given company name exists, return a 404 Not Found response
//       res.status(404).json({ error: "Company not found" });
//     }
//   } catch (error) {
//     // If there's an error during the deletion process, send a 500 Internal Server Error response
//     console.error("Error deleting data:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

app.delete(`/api/delete-bdmTeam/:teamId`, async (req, res) => {
  const teamId = req.params.teamId; // Correctly access teamId from req.params

  try {
    const existingData = await TeamModel.findById(teamId);
    console.log(existingData);

    if (existingData) {
      await TeamModel.findByIdAndDelete(teamId); // Use findByIdAndDelete to delete by ID
      res.status(200).json({ message: "Deleted Successfully" });
    } else {
      res.status(400).json({ error: "Team Does Not Exist" }); // Correct typo in error message
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// app.delete(`/api/delete-bdm-busy/:companyId`, async (req, res) => {
//   const companyId = req.params.companyId; // Correctly access teamId from req.params

//   try {
//     const existingData = await TeamLeadsModel.findById(companyId);
//     console.log(existingData);

//     if (existingData) {
//       await TeamLeadsModel.findByIdAndDelete(companyId); // Use findByIdAndDelete to delete by ID
//       res.status(200).json({ message: "Deleted Successfully" });
//     } else {
//       res.status(400).json({ error: "Team Does Not Exist" }); // Correct typo in error message
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

app.delete(`/api/post-deletecompany-interested/:companyId`, async (req, res) => {
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

app.post("/api/post-bdmAcceptStatusupate/:id", async (req, res) => {
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

app.post(`/api/update-bdmstatusfrombde/:companyId`, async (req, res) => {
  const companyId = req.params.companyId;

  //console.log(companyId)
  const { newStatus } = req.body;
  //console.log(newStatus)                // Assuming the new status is under the key 'bdmStatus' in the request body
  try {
    const update = await TeamLeadsModel.findByIdAndUpdate(companyId, { bdmStatus: newStatus, Status: newStatus });

    //console.log(update)

    res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post(`/api/post-followup-forwardeddata/:cname`, async (req, res) => {
  const companyName = req.params.cname;
  const { caseType, bdmName } = req.body;
  try {
    const updatedFollowUp = await FollowUpModel.findOneAndUpdate(
      { companyName: companyName },
      {
        $set: {
          caseType: caseType,
          bdmName: bdmName
        }
      },
      { new: true }
    );
    res.status(200).json(updatedFollowUp); // Assuming you want to send the updated data back
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post(`/api/post-updaterejectedfollowup/:cname`, async (req, res) => {
  const companyName = req.params.cname;
  const { caseType } = req.body;
  try {
    const updatedFollowUp = await FollowUpModel.findOneAndUpdate(
      { companyName: companyName },
      {
        $set: {
          caseType: caseType,
        },
        $unset: {
          bdmName: " "
        }
      },
      { new: true }
    );
    res.status(200).json(updatedFollowUp); // Assuming you want to send the updated data back
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post(`/api/post-followupupdate-bdmaccepted/:cname`, async (req, res) => {
  const companyName = req.params.cname;
  const { caseType } = req.body;
  try {
    const updatedFollowUp = await FollowUpModel.findOneAndUpdate(
      { companyName: companyName },
      {
        $set: {
          caseType: caseType,
        }
      },
      { new: true }
    );
    res.status(200).json(updatedFollowUp); // Assuming you want to send the updated data back
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




app.put("/api/teaminfo/:teamId", async (req, res) => {
  const teamId = req.params.teamId;

  const dataToUpdated = req.body;

  console.log("Update", dataToUpdated);

  try {
    const updatedData = await TeamModel.findByIdAndUpdate(
      teamId,
      dataToUpdated,
      {
        new: true,
      }
    );
    if (!updatedData) {
      return res.status(404).json({ error: "Data not found" });
    } else {
      res.json({ message: "Data updated successfully", updatedData });
    }
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/post-feedback-remarks/:companyId", async (req, res) => {
  const companyId = req.params.companyId;
  const feedbackPoints = req.body.feedbackPoints;
  const feedbackRemarks = req.body.feedbackRemarks;
  //console.log("feedbackPoints" , feedbackPoints)
  try {
    await TeamLeadsModel.findByIdAndUpdate(companyId, {
      feedbackPoints: feedbackPoints,
      feedbackRemarks: feedbackRemarks,
    });

    await CompanyModel.findByIdAndUpdate(companyId, {
      feedbackPoints: feedbackPoints,
      feedbackRemarks: feedbackRemarks,
    });

    res.status(200).json({ message: "Feedback updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/post-feedback-remarks/:companyId", async (req, res) => {
  const companyId = req.params.companyId;
  const { feedbackPoints, feedbackRemarks } = req.body;

  try {
    await TeamLeadsModel.findByIdAndUpdate(companyId, {
      feedbackPoints: feedbackPoints,
      feedbackRemarks: feedbackRemarks,
    });

    await CompanyModel.findByIdAndUpdate(companyId, {
      feedbackPoints: feedbackPoints,
      feedbackRemarks: feedbackRemarks,
    });

    res.status(200).json({ message: "Feedback updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ------------------------------------------------------team api end----------------------------------

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

app.get('/api/new-leads', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Page number
    const limit = parseInt(req.query.limit) || 500; // Items per page
    const skip = (page - 1) * limit; // Number of documents to skip

    // Query the database to get paginated data
    const employees = await CompanyModel.find()
      .skip(skip)
      .limit(limit);

    // Get total count of documents for pagination
    const totalCount = await CompanyModel.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);
    console.log(employees)
    console.log(totalCount)
    console.log(totalPages)
    console.log(page)
    // Return paginated data along with pagination metadata
    res.json({
      data: employees,
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount,
    });
  } catch (error) {
    console.error('Error fetching employee data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// app.get("/api/new-leads", async (req, res) => {
//   try {
//     const { page, limit } = req.query;
//     const pageNumber = parseInt(page) || 1;
//     const itemsPerPage = parseInt(limit) || 50;
//     const startIndex = (pageNumber-1) * itemsPerPage;
// console.log(page)
//     const data = await CompanyModel.find()
//       .skip(startIndex)
//       .limit(itemsPerPage)
//       .lean();

//     res.send(data);
//   } catch (error) {
//     console.error("Error fetching data:", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


app.get("/api/leads/:companyName", async (req, res) => {
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

// ------------------------------api to get leads on the basis of ename------------------------

app.get("/api/specific-ename-status/:ename/:status", async (req, res) => {
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

// app.get("/api/new-leads", async (req, res) => {
//   try {
//     const { startIndex, endIndex } = req.query;
//     const start = parseInt(startIndex) || 0;
//     const end = parseInt(endIndex) || 500;

//     const data = await CompanyModel.find({ ename: "Not Alloted" })
//       .skip(start)
//       .limit(end - start)
//       .lean();

//     res.send(data);
//   } catch (error) {
//     console.error("Error fetching data:", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

app.get("/api/leads2", async (req, res) => {
  try {
    // Get the query parameters for pagination
    const { startIndex, endIndex } = req.query;

    // Convert startIndex and endIndex to numbers
    const start = parseInt(startIndex);
    const end = parseInt(endIndex);

    // Fetch data using lean queries to retrieve plain JavaScript objects
    const data = await CompanyModel.find()
      .skip(start)
      .limit(end - start)
      .lean();

    // Send the data as the API response
    res.send(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/api/projection-data", async (req, res) => {
  try {
    // Fetch all data from the FollowUpModel
    const followUps = await FollowUpModel.find();

    //console.log(query)
    // Return the data as JSON response
    res.json(followUps);
  } catch (error) {
    // If there's an error, send a 500 internal server error response
    console.error("Error fetching FollowUp data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get(`/api/projection-data-company/:companyName`, async (req, res) => {
  const companyName = req.params.companyName;

  try {
    const response = await FollowUpModel.find({
      companyName: companyName
    })
    res.json(response);

  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }

})

app.get("/api/card-leads", async (req, res) => {
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

app.get("/api/projection-data/:ename", async (req, res) => {
  try {
    const ename = req.params.ename;
    // Fetch data from the FollowUpModel based on the employeeName if provided
    const followUps = await FollowUpModel.find({
      $or: [
        { ename: ename }, // First condition
        { bdeName: ename }, // Second condition
        { bdmName: ename }, // Second condition
        // Add more conditions if needed
      ],
    });
    // Return the data as JSON response
    res.json(followUps);
  } catch (error) {
    // If there's an error, send a 500 internal server error response
    console.error("Error fetching FollowUp data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ----------------------------------api to delete projection data-----------------------------------

app.delete("/api/delete-followup/:companyName", async (req, res) => {
  try {
    // Extract the company name from the request parameters
    const { companyName } = req.params;

    // Check if a document with the given company name exists
    const existingData = await FollowUpModel.findOne({ companyName });

    if (existingData) {
      // If the document exists, delete it
      await FollowUpModel.findOneAndDelete({ companyName });
      res.status(200).json({ message: "Data deleted successfully" });
    } else {
      // If no document with the given company name exists, return a 404 Not Found response
      res.status(404).json({ error: "Company not found" });
    }
  } catch (error) {
    // If there's an error during the deletion process, send a 500 Internal Server Error response
    console.error("Error deleting data:", error);
    res.status(500).json({ error: "Internal server error" });
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
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatDateNew(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const formattedDay = day < 10 ? "0" + day : day;
  const formattedMonth = month < 10 ? "0" + month : month;
  return `${formattedDay}/${formattedMonth}/${year}`;
}

app.post("/api/update-followup", async (req, res) => {
  try {
    const { companyName } = req.body;
    const todayDate = new Date();
    const time = todayDate.toLocaleTimeString();
    const date = todayDate.toLocaleDateString();
    const finalData = { ...req.body, date, time };

    console.log(finalData)

    // Check if a document with companyName exists
    const existingData = await FollowUpModel.findOne({ companyName });

    if (existingData) {
      // Update existing document
      const previousData = { ...existingData.toObject() };
      //console.log(previousData)
      existingData.history.push({
        modifiedAt: formatDate(Date.now()),
        data: previousData,
      });
      console.log(existingData);
      existingData.set(finalData);
      await existingData.save();
      res.status(200).json({ message: "Data updated successfully" });
    } else {
      // Create new document
      const newData = new FollowUpModel(finalData);
      await newData.save();
      res.status(201).json({ message: "New data added successfully" });
    }
  } catch (error) {
    console.error("Error updating or adding data:", error);
    res.status(500).json({ error: "Internal server error" });
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
    req.body["Company Incorporation Date  "] = new Date(
      req.body["Company Incorporation Date "]
    );
    const updatedData = await CompanyModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    console.log(updatedData);

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

app.post(`/api/post-bdenextfollowupdate/:id`, async (req, res) => {
  const companyId = req.params.id;

  const bdeNextFollowUpDate = new Date(req.body.bdeNextFollowUpDate);

  console.log(bdeNextFollowUpDate);

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

app.post(`/api/post-bdmnextfollowupdate/:id`, async (req, res) => {
  const companyId = req.params.id;

  const bdmNextFollowUpDate = new Date(req.body.bdmNextFollowUpDate);

  console.log(bdmNextFollowUpDate);

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
    await RemarksHistory.deleteMany({ companyID: data._id });

    res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Define the route handler for deleting companies
// Assuming you have already set up your Express app and imported necessary modules

// Import the TeamLeadsModel
// Define the route handler for deleting companies


app.post('/api/delete-companies-teamleads-assignednew', async (req, res) => {
  try {
    // Extract the companyIds from the request body
    const { companyIds } = req.body;

    console.log("companycom", companyIds)

    // Validate that companyIds is an array
    if (!Array.isArray(companyIds)) {
      return res.status(400).json({ error: 'Invalid input: companyIds must be an array' });
    }

    // Delete companies from the TeamLeadsModel using the companyIds
    const deleteResult = await TeamLeadsModel.deleteMany({ _id: { $in: companyIds } });

    // Check if any companies were deleted
    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ error: 'No companies found with the provided IDs' });
    }

    // Respond with success message
    res.status(200).json({ message: 'Companies deleted successfully' });
  } catch (error) {
    console.error('Error deleting companies:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.post("/api/assign-leads-newbdm", async (req, res) => {
  const { newemployeeSelection, data, bdmAcceptStatus } = req.body;

  console.log(newemployeeSelection, data, bdmAcceptStatus);

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
    const data = await CompanyModel.find({
      $or: [
        { ename: employeeName },
        { maturedBdmName: employeeName },
        { multiBdmName: { $in: [employeeName] } },
      ],
    });
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
app.post("/api/setMarktrue/:id", async (req, res) => {
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

app.get("/api/edata-particular/:ename", async (req, res) => {
  try {
    const { ename } = req.params;
    const filteredEmployeeData = await CompanyModel.find({
      $or: [{ ename: ename }, { maturedBdmName: ename }],
    });
    res.json(filteredEmployeeData);
  } catch (error) {
    console.error("Error fetching employee data:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
  const { Remarks, bdeName, currentCompanyName } = req.body;

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
      bdeName: bdeName,
      companyName: currentCompanyName,
      //bdmName: remarksBdmName,
    });

    //await TeamLeadsModel.findByIdAndUpdate(companyId, { bdmRemarks: Remarks });

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

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // Determine the destination path based on the fieldname and company name
//     const companyName = req.params.companyName;
//     let destinationPath = "";

//     if (file.fieldname === "otherDocs") {
//       destinationPath = `./${companyName}/ExtraDocs`;
//     } else if (file.fieldname === "paymentReceipt") {
//       destinationPath = `./${companyName}/PaymentReceipts`;
//     }

//     // Create the directory if it doesn't exist
//     if (!fs.existsSync(destinationPath)) {
//       fs.mkdirSync(destinationPath, { recursive: true });
//     }

//     cb(null, destinationPath);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now();
//     cb(null, uniqueSuffix + "-" + file.originalname);
//   },
// });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine the destination path based on the fieldname and company name
    const companyName = req.params.CompanyName;
    let destinationPath = "";

    if (file.fieldname === "otherDocs") {
      destinationPath = `BookingsDocument/${companyName}/ExtraDocs`;
    } else if (file.fieldname === "paymentReceipt") {
      destinationPath = `BookingsDocument/${companyName}/PaymentReceipts`;
    }

    // Create the directory if it doesn't exist
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }

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
        paymentMethod: paymentMethod[0],
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
        otherDocs,
        paymentReceipt,
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
        paymentMethod: paymentMethod[0],
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
app.get("/api/booking-model-filter", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Convert start and end dates to JavaScript Date objects
    const formattedStartDate = new Date(startDate);
    const formattedEndDate = new Date(endDate);

    // Convert the start date to match the format of the bookingDate field
    const formattedBookingStartDate = formattedStartDate
      .toISOString()
      .split("T")[0];

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
          $lte: formattedEndDate.toISOString().split("T")[0],
        },
      };
    }

    // Fetch leads from the database filtered by the specified date range
    const leads = await LeadModel.find(filterCriteria);

    res.json({ leads });
  } catch (error) {
    console.error("Error fetching leads:", error.message);
    res.status(500).json({ error: "Internal server error" });
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

        socketIO.emit("importcsv", employee);
        // console.log(excelData)
        // Increment the success counter
        successCounter++;
      } catch (error) {
        // If an error occurs during data insertion, check if it's due to duplicate companyName
        if (
          error.code === 11000 &&
          error.keyPattern &&
          error.keyPattern.companyName
        ) {
          // Duplicate companyName detected, save the data to LeadModel_2
          try {
            await LeadModel_2.create(data);
            console.log(
              "Data saved to LeadModel_2 due to duplicate companyName:",
              data
            );
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
    res.status(200).json({
      message: "Data sent successfully",
      successCounter,
      errorCounter,
    });
  } catch (error) {
    // If an error occurs at the outer try-catch block, handle it here
    console.error("Error saving employees:", error.message);
    res.status(500).json({ error: "Internal Server Error", errorCounter });
  }
});

app.post("/api/accept-booking-request/:companyName", async (req, res) => {
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
    console.error("Error accepting booking request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.get("/api/drafts-search/:companyName", async (req, res) => {
  const companyName = req.params.companyName;

  try {
    // Find draft data for the company name
    const draft = await DraftModel.findOne({ companyName });

    // Send the draft data as response
    res.status(200).json(draft);
  } catch (error) {
    console.error("Error fetching draft:", error);
    res.status(500).json({ message: "Internal Server Error" });
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
      companies: companies,
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

      await CompanyModel.findOneAndDelete({ "Company Name": companyName });

      socketIO.emit("companydeleted");

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

    res.status(200).json({ message: "Delete request created successfully" });
  } catch (error) {
    console.error("Error creating delete request:", error);
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

app.get("/api/pdf/:CompanyName/:filename", (req, res) => {
  const filepath = req.params.filename;
  const companyName = req.params.CompanyName;
  const pdfPath = path.join(
    __dirname,
    `BookingsDocument/${companyName}/ExtraDocs`,
    filepath
  );

  // Read the PDF file
  fs.readFile(pdfPath, (err, data) => {
    if (err) {
      console.error("Error reading PDF file:", err);
      res.status(500).send("Internal Server Error");
    } else {
      // Set the response headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline; filename=example.pdf");
      res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, private"
      );

      // Send the PDF file data
      res.sendFile(pdfPath);
    }
  });
});

app.get("/api/paymentrecieptpdf/:CompanyName/:filename", (req, res) => {
  const filepath = req.params.filename;
  const companyName = req.params.CompanyName;
  const pdfPath = path.join(
    __dirname,
    `BookingsDocument/${companyName}/PaymentReceipts`,
    filepath
  );
  console.log(pdfPath);
  // Read the PDF file
  fs.readFile(pdfPath, (err, data) => {
    if (err) {
      console.error("Error reading PDF file:", err);
      res.status(500).send("Internal Server Error");
    } else {
      // Set the response headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline; filename=example.pdf");
      res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, private"
      );
      // Send the PDF file data
      res.sendFile(pdfPath);
    }
  });
});

app.get("/api/recieptpdf/:CompanyName/:filename", (req, res) => {
  const filepath = req.params.filename;
  const companyName = req.params.CompanyName;
  const pdfPath = path.join(
    __dirname,
    `BookingsDocument/${companyName}/PaymentReceipts`,
    filepath
  );

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

app.get("/api/otherpdf/:CompanyName/:filename", (req, res) => {
  const filepath = req.params.filename;
  const companyName = req.params.CompanyName;
  const pdfPath = path.join(
    __dirname,
    `BookingsDocument/${companyName}/ExtraDocs`,
    filepath
  );

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
});

// ---------------------------to update the read status of companies-------------------------------------

app.put("/api/read/:companyName", async (req, res) => {
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
      res.status(404).json({ error: "Company not found" });
    }
  } catch (error) {
    console.error("Error updating company:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ----------------------------api to download csv from processing dashboard--------------------------

app.get("/api/exportdatacsv", async (req, res) => {
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
      "BOOKING TIME",
    ]);

    const baseDocumentURL = "https://startupsahay.in/api/recieptpdf/";
    const DocumentURL = "https://startupsahay.in/api/otherpdf/";

    // Push each lead as a row into the csvData array
    leads.forEach((lead, index) => {
      const otherDocsUrls = lead.otherDocs.map((doc) => `${DocumentURL}${doc}`);
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
        `"${lead.services.join(",")}"`,
        lead.originalTotalPayment,
        lead.totalPayment,
        lead.paymentTerms,
        lead.paymentMethod,
        lead.firstPayment,
        lead.secondPayment,
        lead.thirdPayment,
        lead.fourthPayment,
        lead.paymentRemarks,
        lead.paymentReceipt ? `${baseDocumentURL}${lead.paymentReceipt}` : "", // ? baseDocumentURL + lead.paymentReceipt : '',  Concatenate base URL with document name
        lead.bookingSource,
        lead.cPANorGSTnum,
        lead.incoDate,
        lead.extraNotes,
        `"${otherDocsUrls.join(",")}"`, // Assuming otherDocs is an array
        lead.bookingTime,
      ];
      csvData.push(rowData);
      // console.log("rowData:" , rowData)
    });

    // Use fast-csv to stringify the csvData array
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=leads.csv");

    const csvString = csvData.map((row) => row.join(",")).join("\n");
    // Send response with CSV data
    // Send response with CSV data
    res.status(200).end(csvString);
    // console.log(csvString)
    // Here you're ending the response
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/exportLeads/", async (req, res) => {
  try {
    const selectedIds = req.body;

    const leads = await CompanyModel.find({
      _id: { $in: selectedIds },
    });

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
      "Company Address",
      "Director Name(First)",
      "Director Number(First)",
      "Director Email(First)",
      "Director Name(Second)",
      "Director Number(Second)",
      "Director Email(Second)",
      "Director Name(Third)",
      "Director Number(Third)",
      "Director Email(Third)",
      "ename",
      "AssignDate",
      "Status",
      "Remarks",
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
        `"${lead["Company Address"]}"`,
        lead["Director Name(First)"],
        lead["Director Number(First)"],
        lead["Director Email(First)"],
        lead["Director Name(Second)"],
        lead["Director Number(Second)"],
        lead["Director Email(Second)"],
        lead["Director Name(Third)"],
        lead["Director Number(Third)"],
        lead["Director Email(Third)"],
        lead["AssignDate"],
        lead["Status"],
        `"${lead["Remarks"]}"`,
      ];
      csvData.push(rowData);
      // console.log("rowData:" , rowData)
    });

    // Use fast-csv to stringify the csvData array
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=UnAssignedLeads_Admin.csv"
    );

    const csvString = csvData.map((row) => row.join(",")).join("\n");
    // Send response with CSV data
    // Send response with CSV data
    //console.log(csvString)
    res.status(200).end(csvString);
    // console.log(csvString)
    // Here you're ending the response
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/followdataexport/", async (req, res) => {
  try {
    const leads = req.body;

    // const leads = await FollowUpModel.find({
    // });

    const csvData = [];
    // Push the headers as the first row
    csvData.push([
      "SR. NO",
      "Employee Name",
      "Company Name",
      "Offered Services",
      "Offered Prize",
      "Expected Amount",
      "Estimated Payment Date",
      "Last Follow Up Date",
      "Remarks",
    ]);

    // Push each lead as a row into the csvData array
    leads.forEach((lead, index) => {
      const rowData = [
        index + 1,
        lead.ename,
        lead.companyName,
        `"${lead.offeredServices.join(",")}"`,
        lead.offeredPrize,
        lead.totalPayment,
        lead.estPaymentDate,
        lead.lastFollowUpdate,
        lead.remarks,
      ];
      csvData.push(rowData);
      // console.log("rowData:" , rowData)
    });

    // Use fast-csv to stringify the csvData array
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=FollowDataToday.csv"
    );

    const csvString = csvData.map((row) => row.join(",")).join("\n");
    // Send response with CSV data
    // Send response with CSV data
    //console.log(csvString)
    res.status(200).end(csvString);
    // console.log(csvString)
    // Here you're ending the response
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post(
  "/api/uploadotherdocsAttachment/:CompanyName/:bookingIndex",
  upload.fields([
    { name: "otherDocs", maxCount: 50 },
    { name: "paymentReceipt", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const companyName = req.params.CompanyName;
      const bookingIndex = parseInt(req.params.bookingIndex); // Convert to integer

      // Check if company name is provided
      if (!companyName) {
        return res.status(404).send("Company name not provided");
      }

      // Find the company by its name
      const company = await RedesignedLeadformModel.findOne({
        "Company Name": companyName,
      });

      // Check if company exists
      if (!company) {
        return res.status(404).send("Company not found");
      }

      // Get the uploaded files
      const newOtherDocs = req.files["otherDocs"] || []; // Default to empty array

      // Check if bookingIndex is valid
      if (bookingIndex === 0) {
        // Update the main company's otherDocs directly
        company.otherDocs = company.otherDocs.concat(newOtherDocs);
      } else if (
        bookingIndex > 0 &&
        bookingIndex <= company.moreBookings.length
      ) {
        // Update the otherDocs in the appropriate moreBookings object
        company.moreBookings[bookingIndex - 1].otherDocs =
          company.moreBookings[bookingIndex - 1].otherDocs.concat(newOtherDocs);
      } else {
        return res.status(400).send("Invalid booking index");
      }

      // Save the updated company document
      await company.save();

      // Emit socket event
      socketIO.emit("veiwotherdocs", company);

      res.status(200).send("Documents uploaded and updated successfully!");
    } catch (error) {
      console.error("Error updating otherDocs:", error);
      res.status(500).send("Error updating otherDocs.");
    }
  }
);

app.post("/api/redesigned-leadform", async (req, res) => {
  try {
    const newData = req.body; // Assuming the request body contains the data to be saved

    // Find the related company based on companyName
    const companyData = await CompanyModel.findOne({
      "Company Name": newData["Company Name"],
      Status: "Matured",
    });

    if (!companyData) {
      return res
        .status(404)
        .json({ message: 'Company not found or status is not "Matured"' });
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
    res.status(500).json({ message: "Internal Server Error" });
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

app.get("/api/redesigned-leadData/:CompanyName", async (req, res) => {
  try {
    const companyName = req.params.CompanyName;

    // Check if the company exists in RedesignedDraftModel
    const existingData = await RedesignedDraftModel.findOne({
      "Company Name": companyName,
    });

    if (existingData) {
      // If company exists in RedesignedDraftModel, return the data
      return res.json(existingData);
    }

    // If company not found in RedesignedDraftModel, search in RedesignedLeadformModel
    const newData = await RedesignedLeadformModel.findOne({
      "Company Name": companyName,
    });

    if (!newData) {
      // If company not found in RedesignedLeadformModel, return 404
      return res.status(404).json({ error: "Company not found" });
    }
    const TempDataObject = {
      "Company Name": companyName,
      Step1Status: true,
      Step2Status: true,
      Step3Status: true,
      Step4Status: true,
      Step5Status: true,
      services: newData.services,
      "Company Email": newData["Company Email"],
      "Company Number": newData["Company Number"],
      incoDate: newData.incoDate,
      panNumber: newData.panNumber,
      gstNumber: newData.gstNumber,
      bdeName: newData.bdeName,
      bdeEmail: newData.bdeEmail,
    };
    // Create a new object with the same company name in RedesignedDraftModel
    const createData = await RedesignedDraftModel.create({
      "Company Name": companyName,
      Step1Status: true,
      Step2Status: true,
      Step3Status: true,
      Step4Status: true,
      Step5Status: true,
      services: newData.services,
      "Company Email": newData["Company Email"],
      "Company Number": newData["Company Number"],
      incoDate: newData.incoDate,
      panNumber: newData.panNumber,
      gstNumber: newData.gstNumber,
      bdeName: newData.bdeName,
      bdeEmail: newData.bdeEmail,
    });
    res.json(TempDataObject);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Error fetching data" });
  }
});

app.post("/api/redesigned-importData", async (req, res) => {
  try {
    const data = req.body;
    let leadData = [];

    // Loop through each data object in the array
    for (const item of data) {
      const companyName = item["Company Name"];
      let companyID = "";
      // Find the object with the given company name in RedesignedLeadformModel
      let existingData = await RedesignedLeadformModel.findOne({
        "Company Name": companyName,
      });
      const companyExists = await CompanyModel.findOne({
        "Company Name": companyName,
      });
      if (companyExists) {
        companyExists.Status = "Matured";
        const updatedData = await companyExists.save();
        companyID = updatedData._id;
      } else {
        const basicData = new CompanyModel({
          "Company Name": item["Company Name"],
          "Company Email": item["Company Email"],
          "Company Number": item["Company Number"],
          ename: item.bdeName,
          "Company Incorporation Date  ": item.incoDate,
          AssignDate: new Date(),
          Status: "Matured",
          Remarks: item.extraRemarks,
        });
        const storedData = await basicData.save();
        companyID = storedData._id;
      }

      // Create an array to store services data
      const services = [];

      // Loop through each service index (1 to 5)
      for (let i = 1; i <= 5; i++) {
        // Check if the serviceName exists for the current index
        if (item[`${i}serviceName`]) {
          const service = {
            serviceName: item[`${i}serviceName`],
            totalPaymentWOGST: item[`${i}TotalAmount`],
            totalPaymentWGST:
              item[`${i}GST`] === "YES"
                ? item[`${i}TotalAmount`] + item[`${i}TotalAmount`] * 0.18
                : item[`${i}TotalAmount`],
            withGST: item[`${i}GST`] === "YES",
            withDSC:
              item[`${i}serviceName`] === "Start-Up India Certificate With DSC",
            paymentTerms:
              item[`${i}PaymentTerms`] === "PART-PAYMENT"
                ? "two-part"
                : "Full Advanced",
            firstPayment: item[`${i}FirstPayment`],
            secondPayment: item[`${i}SecondPayment`],
            thirdPayment: item[`${i}ThirdPayment`],
            fourthPayment: item[`${i}FourthPayment`],
            paymentRemarks: item[`${i}PaymentRemarks`],
          };
          services.push(service);
        }
      }

      // Save other data with same property names
      // const otherData = {
      //   "Company Name": item["Company Name"],
      //   "Company Email": item["Company Email"],
      //   "Company Number": item["Company Number"],
      //   incoDate: item.incoDate,
      //   panNumber: item.panNumber,
      //   gstNumber: item.gstNumber,
      //   bdeName: item.bdeName,
      //   bdeEmail: item.bdeEmail,
      //   bdmType: item.bdmType,
      //   bdmEmail: item.bdmEmail,
      //   bookingDate: item.bookingDate,
      //   bookingSource: item.bookingSource,
      //   otherBookingSource: item.otherBookingSource,
      //   services: services,
      //   numberOfServices: services.length,
      //   caCase: item.caCase,
      //   caCommission: item.caCommission,
      //   caNumber: item.caNumber,
      //   caEmail: item.caEmail,
      //   totalAmount: item.totalPayment,
      //   pendingAmount: item.pendingPayment,
      //   receivedAmount: item.receivedPayment,
      //   paymentMethod: item.receivedAmount,
      //   extraRemarks: item.extraRemarks,
      // };

      if (!existingData) {
        // Create a new object if it doesn't exist
        console.log(item);
        const lmao = new RedesignedLeadformModel({
          company: companyID,
          "Company Name": item["Company Name"],
          "Company Email": item["Company Email"],
          "Company Number": item["Company Number"],
          incoDate: item.incoDate,
          panNumber: item.panNumber,
          gstNumber: item.gstNumber,
          bdeName: item.bdeName,
          bdeEmail: item.bdeEmail,
          bdmType: item.bdmType,
          bdmName: item.bdmName,
          bdmEmail: item.bdmEmail,
          bookingDate: item.bookingDate,
          bookingSource: item.leadSource,
          otherBookingSource: item.otherBookingSource,
          services: services,
          numberOfServices: services.length,
          caCase: item.caCase,
          caCommission: item.caCommission,
          caNumber: item.caNumber,
          caEmail: item.caEmail,
          totalAmount: item.totalPayment,
          pendingAmount: item.pendingPayment,
          receivedAmount: item.receivedPayment,
          paymentMethod: item.receivedAmount,
          extraRemarks: item.extraRemarks,
        });
        await lmao.save();
      } else {
        existingData.moreBookings.push({
          "Company Name": item["Company Name"],
          "Company Email": item["Company Email"],
          "Company Number": item["Company Number"],
          incoDate: item.incoDate,
          panNumber: item.panNumber,
          gstNumber: item.gstNumber,
          bdeName: item.bdeName,
          bdeEmail: item.bdeEmail,
          bdmType: item.bdmType,
          bdmEmail: item.bdmEmail,
          bookingDate: item.bookingDate,
          bookingSource: item.bookingSource,
          otherBookingSource: item.otherBookingSource,
          services: services,
          numberOfServices: services.length,
          caCase: item.caCase,
          caCommission: item.caCommission,
          caNumber: item.caNumber,
          caEmail: item.caEmail,
          totalAmount: item.totalPayment,
          pendingAmount: item.pendingPayment,
          receivedAmount: item.receivedPayment,
          paymentMethod: item.receivedAmount,
          extraRemarks: item.extraRemarks,
        });
        await existingData.save();
      }
      // Update existing data or add to moreBookings

      // Save the updated data
    }
    res.status(200).send("Data imported and updated successfully!");
  } catch (error) {
    console.error("Error importing data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post(
  "/api/redesigned-leadData/:CompanyName/:step",
  upload.fields([
    { name: "otherDocs", maxCount: 50 },
    { name: "paymentReceipt", maxCount: 2 },
  ]),
  async (req, res) => {
    try {
      const companyName = req.params.CompanyName;
      const newData = req.body;
      const Step = req.params.step;
      if (Step === "step1") {
        const existingData = await RedesignedDraftModel.findOne({
          "Company Name": companyName,
        });

        if (existingData) {
          // Update existing data if found
          const updatedData = await RedesignedDraftModel.findOneAndUpdate(
            { "Company Name": companyName },
            {
              $set: {
                "Company Email":
                  newData["Company Email"] || existingData["Company Email"],
                "Company Number":
                  newData["Company Number"] || existingData["Company Number"],
                incoDate: newData.incoDate || existingData.incoDate,
                panNumber: newData.panNumber || existingData.panNumber,
                gstNumber: newData.gstNumber || existingData.gstNumber,
                bdeName: newData.bdeName || existingData.bdeName,
                bdeEmail: newData.bdeEmail || existingData.bdeEmail,
              },
            },
            { new: true }
          );
          res.status(200).json(updatedData);
          return true; // Respond with updated data
        } else {
          // Create new data if not found
          const createdData = await RedesignedDraftModel.create({
            "Company Email": newData["Company Email"],
            "Company Name": newData["Company Name"],
            "Company Number": newData["Company Number"],
            incoDate: newData.incoDate,
            panNumber: newData.panNumber,
            gstNumber: newData.gstNumber,
            bdeName: newData.bdeName,
            bdeEmail: newData.bdeEmail,
            Step1Status: true,
          });
          res.status(201).json(createdData); // Respond with created data
          return true;
        }
      } else if (Step === "step2") {
        const existingData = await RedesignedDraftModel.findOne({
          "Company Name": companyName,
        });
        if (existingData) {
          const updatedData = await RedesignedDraftModel.findOneAndUpdate(
            { "Company Name": companyName },
            {
              $set: {
                bdeName: newData.bdeName || existingData.bdeName,
                bdeEmail: newData.bdeEmail || existingData.bdeEmail,
                bdmName: newData.bdmName || existingData.bdmName,
                otherBdmName: newData.otherBdmName || existingData.otherBdmName,
                bdmType: newData.bdmType || existingData.bdmType,
                bdmEmail: newData.bdmEmail || existingData.bdmEmail,
                bookingDate: newData.bookingDate || existingData.bookingDate,
                bookingSource:
                  newData.bookingSource || existingData.bookingSource,
                otherBookingSource:
                  newData.otherBookingSource || existingData.otherBookingSource,
                Step2Status: true,
              },
            },
            { new: true }
          );
          res.status(200).json(updatedData);
          return true; // Respond with updated data
        }
      } else if (Step === "step3") {
        const existingData = await RedesignedDraftModel.findOne({
          "Company Name": companyName,
        });
        if (existingData) {
          // Update existing data if found
          const updatedData = await RedesignedDraftModel.findOneAndUpdate(
            { "Company Name": companyName },
            {
              $set: {
                services: newData.services || existingData.services,
                numberOfServices:
                  newData.numberOfServices || existingData.numberOfServices,
                caCase: newData.caCase,
                caCommission: newData.caCommission,
                caNumber: newData.caNumber,
                caEmail: newData.caEmail,
                totalAmount: newData.totalAmount || existingData.totalAmount,
                pendingAmount:
                  newData.pendingAmount || existingData.pendingAmount,
                receivedAmount:
                  newData.receivedAmount || existingData.receivedAmount,
                generatedTotalAmount:
                  newData.generatedTotalAmount ||
                  existingData.generatedTotalAmount,
                generatedReceivedAmount:
                  newData.generatedReceivedAmount ||
                  existingData.generatedReceivedAmount || 0,
                Step3Status: true,
              },
            },
            { new: true }
          );
          res.status(200).json(updatedData);
          return true; // Respond with updated data
        }
      } else if (Step === "step4") {
        const existingData = await RedesignedDraftModel.findOne({
          "Company Name": companyName,
        });

        newData.otherDocs =
          req.files["otherDocs"] === undefined ||
            req.files["otherDocs"].length === 0
            ? []
            : req.files["otherDocs"].map((file) => file);
        newData.paymentReceipt =
          req.files["paymentReceipt"] === undefined ||
            req.files["paymentReceipt"].length === 0
            ? []
            : req.files["paymentReceipt"].map((file) => file);

        if (existingData) {
          // Update existing data if found
          const updatedData = await RedesignedDraftModel.findOneAndUpdate(
            { "Company Name": companyName },
            {
              $set: {
                totalAmount: newData.totalAmount || existingData.totalAmount,
                pendingAmount:
                  newData.pendingAmount || existingData.pendingAmount,
                receivedAmount:
                  newData.receivedAmount || existingData.receivedAmount,
                paymentReceipt:
                  newData.paymentReceipt || existingData.paymentReceipt,
                otherDocs: newData.otherDocs || existingData.otherDocs,
                paymentMethod: newData.paymentMethod || newData.paymentMethod,
                extraNotes: newData.extraNotes || existingData.extraNotes,
                Step4Status: true,
              },
            },
            { new: true }
          );
          res.status(200).json(updatedData);
          return true; // Respond with updated data
        }
      } else if (Step === "step5") {
        const updatedData = await RedesignedDraftModel.findOneAndUpdate(
          { "Company Name": companyName },
          {
            $set: {
              Step5Status: true,
            },
          },
          { new: true }
        );
        res.status(200).json(updatedData);
        return true; // R
      }
      // Add uploaded files information to newData

      newData.otherDocs =
        req.files["otherDocs"] === undefined
          ? ""
          : req.files["otherDocs"].map((file) => file);
      newData.paymentReceipt =
        req.files["paymentReceipt"] === undefined
          ? ""
          : req.files["paymentReceipt"].map((file) => file);

      // Search for existing data by Company Name
      const existingData = await RedesignedDraftModel.findOne({
        "Company Name": companyName,
      });

      if (existingData) {
        // Update existing data if found
        const updatedData = await RedesignedDraftModel.findOneAndUpdate(
          { "Company Name": companyName },
          { $set: newData },
          { new: true }
        );
        res.status(200).json(updatedData); // Respond with updated data
      } else {
        // Create new data if not found
        const createdData = await RedesignedDraftModel.create({
          ...newData,
          companyName,
        });
        res.status(201).json(createdData); // Respond with created data
      }
    } catch (error) {
      console.error("Error creating/updating data:", error);
      res.status(500).send("Error creating/updating data"); // Send an error response
    }
  }
);

app.post(
  "/api/redesigned-addmore-booking/:CompanyName/:step",
  upload.fields([
    { name: "otherDocs", maxCount: 50 },
    { name: "paymentReceipt", maxCount: 2 },
  ]),
  async (req, res) => {
    try {
      const companyName = req.params.CompanyName;
      const newData = req.body;
      const Step = req.params.step;
      if (Step === "step2") {
        const existingData = await RedesignedDraftModel.findOne({
          "Company Name": companyName,
        });
        console.log("Second Step Working");
        if (existingData) {
          const updatedData = await RedesignedDraftModel.findOneAndUpdate(
            { "Company Name": companyName },
            {
              $set: {
                "moreBookings.bdeName": newData.bdeName || "",
                "moreBookings.bdeEmail": newData.bdeEmail || "",
                "moreBookings.bdmName": newData.bdmName || "",
                "moreBookings.otherBdmName": newData.otherBdmName || "",
                "moreBookings.bdmEmail": newData.bdmEmail || "",
                "moreBookings.bdmType": newData.bdmType || "",
                "moreBookings.bookingDate": newData.bookingDate || "",
                "moreBookings.bookingSource": newData.bookingSource || "",
                "moreBookings.otherBookingSource":
                  newData.otherBookingSource || "",
                "moreBookings.Step2Status": true,
              },
            },
            { new: true }
          );
          res.status(200).json(updatedData);
          return true; // Respond with updated data
        } else {
          res.status(404).json("Company Not found");
          return true;
        }
      } else if (Step === "step3") {
        const existingData = await RedesignedDraftModel.findOne({
          "Company Name": companyName,
        });
        console.log("Third step Working");
        if (existingData) {
          const updatedData = await RedesignedDraftModel.findOneAndUpdate(
            { "Company Name": companyName },
            {
              $set: {
                "moreBookings.services":
                  newData.services || existingData.moreBookings.services,
                "moreBookings.numberOfServices":
                  newData.numberOfServices ||
                  existingData.moreBookings.numberOfServices,
                "moreBookings.caCase": newData.caCase,
                "moreBookings.caCommission": newData.caCommission,
                "moreBookings.caNumber": newData.caNumber,
                "moreBookings.caEmail": newData.caEmail,
                "moreBookings.totalAmount":
                  newData.totalAmount || existingData.moreBookings.totalAmount,
                "moreBookings.pendingAmount":
                  newData.pendingAmount ||
                  existingData.moreBookings.pendingAmount,
                "moreBookings.receivedAmount":
                  newData.receivedAmount ||
                  existingData.moreBookings.receivedAmount,

                "moreBookings.generatedReceivedAmount":
                  newData.generatedReceivedAmount ||
                  existingData.moreBookings.generatedReceivedAmount,
                "moreBookings.generatedTotalAmount":
                  newData.generatedTotalAmount ||
                  existingData.moreBookings.generatedTotalAmount,
                "moreBookings.Step3Status": true,
              },
            },
            { new: true }
          );
          res.status(200).json(updatedData);
          return true; // Respond with updated data
        } else {
          res.status(404).json("Company Not found");
          return true;
        }
      } else if (Step === "step4") {
        const existingData = await RedesignedDraftModel.findOne({
          "Company Name": companyName,
        });
        newData.otherDocs =
          req.files["otherDocs"] === undefined
            ? []
            : req.files["otherDocs"].map((file) => file);
        newData.paymentReceipt =
          req.files["paymentReceipt"] === undefined
            ? []
            : req.files["paymentReceipt"].map((file) => file);
        if (existingData) {
          const updatedData = await RedesignedDraftModel.findOneAndUpdate(
            { "Company Name": companyName },
            {
              $set: {
                "moreBookings.totalAmount":
                  newData.totalAmount || existingData.moreBookings.totalAmount,
                "moreBookings.pendingAmount":
                  newData.pendingAmount ||
                  existingData.moreBookings.pendingAmount,
                "moreBookings.receivedAmount":
                  newData.receivedAmount ||
                  existingData.moreBookings.receivedAmount,
                "moreBookings.Step4Status": true,
                "moreBookings.paymentReceipt":
                  newData.paymentReceipt ||
                  existingData.moreBookings.paymentReceipt,
                "moreBookings.otherDocs":
                  newData.otherDocs || existingData.moreBookings.otherDocs,
                "moreBookings.paymentMethod":
                  newData.paymentMethod ||
                  existingData.moreBookings.paymentMethod,
                "moreBookings.extraNotes":
                  newData.extraNotes || existingData.moreBookings.extraNotes,
              },
            },
            { new: true }
          );
          res.status(200).json(updatedData);
          return true; // Respond with updated data
        } else {
          res.status(404).json("Company Not found");
          return true;
        }
      } else if (Step === "step5") {
        const existingData = await RedesignedLeadformModel.findOne({
          "Company Name": companyName,
        });
        const companyData = await CompanyModel.findOne({
          "Company Name": newData["Company Name"],
        });
        if (companyData) {
          const multiBdmName = [];
          if (companyData.maturedBdmName !== newData.bdmName) {
            multiBdmName.push(newData.bdmName);
            await CompanyModel.findByIdAndUpdate(companyData._id, {
              multiBdmName: multiBdmName,
            });
          }
        }
        if (existingData) {
          const updatedData = await RedesignedLeadformModel.findOneAndUpdate(
            { "Company Name": companyName },
            {
              $set: {
                moreBookings: [...existingData.moreBookings, newData],
              },
            },
            { new: true }
          );
          const removeDraft = await RedesignedDraftModel.findOneAndUpdate(
            {
              "Company Name": companyName,
            },
            {
              $set: {
                moreBookings: [],
              },
            },
            { new: true }
          );
          const totalAmount = newData.services.reduce(
            (acc, curr) => acc + parseInt(curr.totalPaymentWGST),
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
            let servicesHtml = "";
            for (let i = 0; i < newData.services.length; i++) {
              const displayPaymentTerms =
                newData.services[i].paymentTerms === "Full Advanced"
                  ? "none"
                  : "flex";
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
              ${newData.services[i].serviceName === "Start Up Certificate"
                  ? newData.services[i].withDSC
                    ? "Start Up Certificate With DSC"
                    : "Start Up Certificate Without DCS"
                  : newData.services[i].serviceName
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
                ₹ ${parseInt(
                  newData.services[i].totalPaymentWGST
                ).toLocaleString()}
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
              ${newData.services[i].withGST ? "Yes" : "No"}
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
                ${newData.services[i].paymentTerms === "Full Advanced"
                  ? "Full Advanced"
                  : "Part-Payment"
                }
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
                ₹ ${parseInt(newData.services[i].firstPayment).toLocaleString()}
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
                ₹ ${parseInt(
                  newData.services[i].secondPayment
                ).toLocaleString()} - ${isNaN(new Date(newData.services[i].secondPaymentRemarks))
                  ? newData.services[i].secondPaymentRemarks
                  : `Payment On ${newData.services[i].secondPaymentRemarks}`
                }
            </div>
          </div>
        </div>
        <div style="display: ${newData.services[i].thirdPayment === 0 ? "none" : "flex"
                }; flex-wrap: wrap">
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
                ₹ ${Number(newData.services[i].thirdPayment).toFixed(2)} - ${isNaN(new Date(newData.services[i].thirdPaymentRemarks))
                  ? newData.services[i].thirdPaymentRemarks
                  : `Payment On ${newData.services[i].thirdPaymentRemarks}`
                }
            </div>
          </div>
        </div>
        <div style="display: ${newData.services[i].fourthPayment === 0 ? "none" : "flex"
                }; flex-wrap: wrap">
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
                ₹ ${parseInt(
                  newData.services[i].fourthPayment
                ).toLocaleString()} - ${isNaN(new Date(newData.services[i].fourthPaymentRemarks))
                  ? newData.services[i].fourthPaymentRemarks
                  : `Payment On ${newData.services[i].fourthPaymentRemarks}`
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
          const serviceNames = newData.services
            .map((service, index) => `${service.serviceName}`)
            .join(" , ");
          const isAdmin = newData.isAdmin;
          const visibility = newData.bookingSource !== "Other" && "none";
          const servicesHtmlContent = renderServices();
          const recipients = isAdmin ? ["nimesh@incscale.in"] : [
            newData.bdeEmail,
            newData.bdmEmail,
            "bookings@startupsahay.com",
            "documents@startupsahay.com",
          ];

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
                      ${formatDate(newData["incoDate"])}
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
                    Company's PAN/GST Number:
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
                      ${newData.bdeEmail}
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
                      ${newData.bdmEmail}
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
                    BDM Type
                  </div>
                </div>
                <div style="width: 75%">
                  <div style="
                        border: 1px solid #ccc;
                        font-size: 12px;
                        padding: 5px 10px;
                      ">
                       ${newData.bdmType === "Close-by"
              ? "Closed-by"
              : "Supported-by"
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
                      ${newData.otherBookingSource}
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
            <div style="display: flex; flex-wrap: wrap">
                <div style="width: 25%">
                  <div style="
                        border: 1px solid #ccc;
                        font-size: 12px;
                        padding: 5px 10px;
                      ">
                    CA Case
                  </div>
                </div>
                <div style="width: 75%">
                  <div style="
                        border: 1px solid #ccc;
                        font-size: 12px;
                        padding: 5px 10px;
                      ">
                      ${newData.caCase}
                  </div>
                </div>
            </div>
             <div style="display: ${newData.caCase === "Yes" ? "flex" : "none"
            }; flex-wrap: wrap">
                <div style="width: 25%">
                  <div style="
                        border: 1px solid #ccc;
                        font-size: 12px;
                        padding: 5px 10px;
                      ">
                    CA Number
                  </div>
                </div>
                <div style="width: 75%">
                  <div style="
                        border: 1px solid #ccc;
                        font-size: 12px;
                        padding: 5px 10px;
                      ">
                      ${newData.caNumber}
                  </div>
                </div>
            </div>
            <div style="display: ${newData.caCase === "Yes" ? "flex" : "none"
            }; flex-wrap: wrap">
                <div style="width: 25%">
                  <div style="
                        border: 1px solid #ccc;
                        font-size: 12px;
                        padding: 5px 10px;
                      ">
                    CA Email
                  </div>
                </div>
                <div style="width: 75%">
                  <div style="
                        border: 1px solid #ccc;
                        font-size: 12px;
                        padding: 5px 10px;
                      ">
                      ${newData.caEmail}
                  </div>
                </div>
            </div>
            <div style="display: ${newData.caCase === "Yes" ? "flex" : "none"
            }; flex-wrap: wrap">
                <div style="width: 25%">
                  <div style="
                        border: 1px solid #ccc;
                        font-size: 12px;
                        padding: 5px 10px;
                      ">
                    CA Commission
                  </div>
                </div>
                <div style="width: 75%">
                  <div style="
                        border: 1px solid #ccc;
                        font-size: 12px;
                        padding: 5px 10px;
                      ">
                      ${newData.caCommission}
                  </div>
                </div>
            </div>

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
                      ₹ ${parseInt(totalAmount).toLocaleString()}
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
                      ₹ ${parseInt(receivedAmount).toLocaleString()}
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
                     ₹ ${parseInt(pendingAmount).toLocaleString()}
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
                    ${newData.extraNotes !== "" ? newData.extraNotes : "N/A"}
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
          const renderServiceList = () => {
            let servicesHtml = "";
            for (let i = 0; i < newData.services.length; i++) {
              servicesHtml += `
              <span>Service ${i + 1}: ${newData.services[i].serviceName}</span>,  
              `;
            }
            return servicesHtml;
          };
          const renderPaymentDetails = () => {
            let servicesHtml = "";
            let paymentServices = "";
            const serviceLength = newData.services.length > 2 ? 2 : newData.services.length
            for (let i = 0; i < serviceLength; i++) {
              const Amount =
                newData.services[i].paymentTerms === "Full Advanced"
                  ? newData.services[i].totalPaymentWGST
                  : newData.services[i].firstPayment;
              let rowSpan;
      
              if (newData.services[i].paymentTerms === "two-part") {
                if (
                  newData.services[i].thirdPayment !== 0 &&
                  newData.services[i].fourthPayment === 0
                ) {
                  rowSpan = 2;
                } else if (newData.services[i].fourthPayment !== 0) {
                  rowSpan = 3;
                }
              } else {
                rowSpan = 1;
              }
      
              if (rowSpan === 3) {
                paymentServices = `
              <tr>
                <td style="border-right:1px solid #ddd">₹${parseInt(newData.services[i].secondPayment).toLocaleString()}/-</td>
                <td>${newData.services[i].secondPaymentRemarks}</td>
              </tr>
              <tr>
               <td style="border-right:1px solid #ddd">₹${parseInt(newData.services[i].thirdPayment).toLocaleString()}/-</td>
               <td>${newData.services[i].thirdPaymentRemarks}</td>
              </tr>
              <tr>
               <td style="border-right:1px solid #ddd">₹${parseInt(newData.services[i].fourthPayment).toLocaleString()}/-</td>
               <td>${newData.services[i].fourthPaymentRemarks}</td>
              </tr>
              `;
              } else if (rowSpan === 2) {
                paymentServices = `
              <tr>
                <td style="border-right:1px solid #ddd">₹${parseInt(newData.services[i].secondPayment).toLocaleString()}/-</td>
                <td >${newData.services[i].secondPaymentRemarks}</td>
              </tr>
              <tr>
                <td style="border-right:1px solid #ddd">₹${parseInt(newData.services[i].thirdPayment).toLocaleString()}/-</td>
                <td >${newData.services[i].thirdPaymentRemarks}</td>
              </tr>
              `;
              } else {
                paymentServices = `
              <tr>
                <td >₹${parseInt(newData.services[i].secondPayment).toLocaleString()}/-</td>
                <td>${newData.services[i].paymentTerms !== "Full Advanced"
                    ? newData.services[i].secondPaymentRemarks
                    : "100% Advance Payment"
                  }</td>
              </tr>
              `;
              }
              servicesHtml += `
              <table class="table table-bordered">
                  <thead>
                    <td colspan="4">Service Name : ${newData.services[i].serviceName
                }</td>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Total Payment</td>
                      <td>Advanced Payment</td>
                      <td>Pending payment</td>
                      <td>Remarks</td>
                    </tr>
                    <tr>
                          <th rowspan='4'>₹ ${newData.services[i].totalPaymentWGST
                } /-</th>
                          <th rowspan='4'>₹ ${newData.services[i].paymentTerms === "Full Advanced"
                  ? parseInt(newData.services[i].totalPaymentWGST).toLocaleString()
                  : parseInt(newData.services[i].firstPayment).toLocaleString()
                }/-</th>
                    </tr>
                    ${paymentServices}
                  </tbody>
              </table>
              `;
            }
            return servicesHtml;
          };
          const renderMorePaymentDetails = () => {
            let servicesHtml = "";
            let paymentServices = "";
      
            for (let i = 2; i < newData.services.length; i++) {
              const Amount =
                newData.services[i].paymentTerms === "Full Advanced"
                  ? newData.services[i].totalPaymentWGST
                  : newData.services[i].firstPayment;
              let rowSpan;
      
              if (newData.services[i].paymentTerms === "two-part") {
                if (
                  newData.services[i].thirdPayment !== 0 &&
                  newData.services[i].fourthPayment === 0
                ) {
                  rowSpan = 2;
                } else if (newData.services[i].fourthPayment !== 0) {
                  rowSpan = 3;
                }
              } else {
                rowSpan = 1;
              }
      
              if (rowSpan === 3) {
                paymentServices = `
              <tr>
                <td>₹${parseInt(newData.services[i].secondPayment).toLocaleString()}/-</td>
                <td>${newData.services[i].secondPaymentRemarks}</td>
              </tr>
              <tr>
               <td>₹${parseInt(newData.services[i].thirdPayment).toLocaleString()}/-</td>
               <td>${newData.services[i].thirdPaymentRemarks}</td>
              </tr>
              <tr>
               <td>₹${parseInt(newData.services[i].fourthPayment).toLocaleString()}/-</td>
               <td>${newData.services[i].fourthPaymentRemarks}</td>
              </tr>
              `;
              } else if (rowSpan === 2) {
                paymentServices = `
              <tr>
                <td>₹${parseInt(newData.services[i].secondPayment).toLocaleString()}/-</td>
                <td>${newData.services[i].secondPaymentRemarks}</td>
              </tr>
              <tr>
                <td>₹${parseInt(newData.services[i].thirdPayment).toLocaleString()}/-</td>
                <td>${newData.services[i].thirdPaymentRemarks}</td>
              </tr>
              `;
              } else {
                paymentServices = `
              <tr>
                <td>₹${parseInt(newData.services[i].secondPayment).toLocaleString()}/-</td>
                <td>${newData.services[i].paymentTerms !== "Full Advanced"
                    ? newData.services[i].secondPaymentRemarks
                    : "100% Advance Payment"
                  }</td>
              </tr>
              `;
              }
      
              servicesHtml += `
              <table class="table table-bordered">
                  <thead>
                    <td colspan="4">Service Name : ${newData.services[i].serviceName
                }</td>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Total Payment</td>
                      <td>Advanced Payment</td>
                      <td>Pending payment</td>
                      <td>Remarks</td>
                    </tr>
                    <tr>
                          <th rowspan='4'>₹ ${parseInt(newData.services[i].totalPaymentWGST).toLocaleString()
                } /-</th>
                          <th rowspan='4'>₹ ${newData.services[i].paymentTerms === "Full Advanced"
                  ? parseInt(newData.services[i].totalPaymentWGST).toLocaleString()
                  : parseInt(newData.services[i].firstPayment).toLocaleString()
                }/-</th>
                    </tr>
                    ${paymentServices}
                  </tbody>
              </table>
              `;
            }
            return servicesHtml;
          };
          const allowedServiceNames = [
            "Seed Funding Support",
            "Angel Funding Support",
            "VC Funding Support",
            "Crowd Funding Support",
            "I-Create",
            "Nidhi Seed Support Scheme",
            "Nidhi Prayash Yojna",
            "NAIF",
            "Raftaar",
            "CSR Funding",
            "Stand-Up India",
            "PMEGP",
            "USAID",
            "UP Grant",
            "DBS Grant",
            "MSME Innovation",
            "MSME Hackathon",
            "Gujarat Grant",
            "CGTMSC",
            "Mudra Loan",
            "SIDBI Loan",
            "Incubation Support",
          ];
          const AuthorizedName = newData.services.some((service) => {
            const tempServices = [...allowedServiceNames, "Income Tax Exemption"];
            return tempServices.includes(service);
          })
            ? "Shubhi Banthiya"
            : "Dhruvi Gohel";
      
          console.log(newData.services);
          const newPageDisplay = newData.services.some((service) => {
            const tempServices = [
              ...allowedServiceNames,
              "Income Tax Exemption",
              "Start-Up India Certificate",
            ];
            return tempServices.includes(service.serviceName);
          })
            ? 'style="display:block'
            : 'style="display:none';
      
          console.log(newPageDisplay);
      
      
      
          const renderServiceKawali = () => {
            let servicesHtml = "";
            let fundingServices = "";
            let fundingServicesArray = "";
            let incomeTaxServices = "";
      
            for (let i = 0; i < newData.services.length; i++) {
              if (
                newData.services[i].serviceName === "Start-Up India Certificate"
              ) {
                servicesHtml = `
                <p class="Declaration_text_head mt-2">
                <b>
                  Start-Up India Certification Acknowledgement:
                </b>
              </p>
              <p class="Declaration_text_data">
              I, Director of ${newData["Company Name"]}, acknowledge START-UP SAHAY PRIVATE LIMITED's assistance in obtaining the Start-up India certificate, including document preparation and application support. I understand they charge a fee for their services. I acknowledge that the certificate is issued by the government free of charge and that START-UP SAHAY hasn't misled me about this.
              </p>
              
              `;
              } else if (
                allowedServiceNames.includes(newData.services[i].serviceName)
              ) {
                fundingServicesArray += `${newData.services[i].serviceName},`;
                fundingServices = `
                <p class="Declaration_text_head mt-2">
                <b>
                ${newData.services[i].serviceName} Acknowledgement:   
                </b>
              </p>
              <p class="Declaration_text_data">
              I, Director of ${newData["Company Name"]}, engage START-UP SAHAY PRIVATE LIMITED for ${newData.services[i].serviceName}. They'll provide document creation and Application support, utilizing their resources and expertise. I understand there's a fee for their services, not as government fees, Approval of the application is up to the Concerned authorities. START-UP SAHAY PRIVATE LIMITED has not assured me of application approval.
              </p>
              
              `;
              } else if (
                newData.services[i].serviceName === "Income Tax Exemption"
              ) {
            
                incomeTaxServices = `
                <p class="Declaration_text_head mt-2">
                <b>
                Income Tax Exemption Services Acknowledgement:   
                </b>
              </p>
              <p class="Declaration_text_data">
              I, Director of ${newData["Company Name"]}, acknowledge START-UP SAHAY PRIVATE LIMITED's assistance in obtaining the Certificate of Eligibility for the 3-year tax exemption under the 80IAC Income Tax Act. Their services include document preparation and application support, for which they charge a fee. I understand that government fees are not involved. START-UP SAHAY has provided accurate information about the approval process, and the decision rests with the relevant authorities.
              </p>
            `;
              } else {
                servicesHtml += `
            <br>
            `;
              }
            }
      
            if (fundingServicesArray !== "") {
              servicesHtml += `
              <p class="Declaration_text_head mt-2">
              <b>
              ${fundingServicesArray} Acknowledgement:    
              </b>
            </p>
            <p class="Declaration_text_data">
            I, Director of ${newData["Company Name"]}, engage START-UP SAHAY PRIVATE LIMITED for ${fundingServicesArray}. They'll provide document creation and Application support, utilizing their resources and expertise. I understand there's a fee for their services, not as government fees, Approval of the application is up to the concerned department/authorities. START-UP SAHAY PRIVATE LIMITED has not assured me of application approval.
            </p>
          `;
            } 
            if (incomeTaxServices !== "") {
              servicesHtml += `
              <p class="Declaration_text_head mt-2">
              <b>
              Income Tax Exemption Services Acknowledgement:     
              </b>
            </p>
            <p class="Declaration_text_data">
            I, Director of ${newData["Company Name"]}, acknowledge that START-UP SAHAY PRIVATE LIMITED is assisting me in obtaining the Certificate of Eligibility for the 3-year tax exemption under the 80IAC Income Tax Act. These services involve preparing necessary documents and applications, and utilizing their infrastructure, experience, manpower, and expertise. I understand there's a fee for their services, not as government fees. START-UP SAHAY has provided accurate information regarding the approval process. The decision regarding the application approval rests with the concerned authorities.
            </p>
        `;
            }
            return servicesHtml;
          };
          const conditional = newData.services.length < 2 ? `<div class="Declaration_text">
      <p class="Declaration_text_data">
        I confirm that the outlined payment details and terms accurately represent the agreed-upon arrangements between ${newData["Company Name"]} and START-UP SAHAY PRIVATE LIMITED. The charges are solely for specified services, and no additional services will be provided without separate payment, even in the case of rejection.
      </p>
      </div>` : "";
          const serviceKawali = renderServiceKawali();
          const currentDate = new Date();
      
          const dateOptions = { day: "numeric", month: "long", year: "numeric" };
          const todaysDate = currentDate.toLocaleDateString("en-US", dateOptions);
          const mainPageHtml = `
              <div class="PDF_main">
                <section>
                  <div class="date_div">
                    <p>${todaysDate}</p>
                  </div>
                  <div class="pdf_heading">
                    <h3>Self Declaration</h3>
                  </div>
                  <div class="Declaration_text">
                    ${serviceKawali}
                    <p class="Declaration_text_data">
                      I, understands that because of government regulations and portal, I have no objections if the
                      process takes longer than initially committed, knowing it's just how government schemes
                      related process works.
                    </p>
                    <p class="Declaration_text_data">
                    As I am unfamiliar with the process, I give START-UP SAHAY PRIVATE LIMITED permission to submit the online or offline application in the concerned department on my behalf, if required.
                    </p>
                  </div>
               
                  
                </section>
              
              </div>
            `;
          const totalPaymentHtml = newData.services.length < 2 ? ` <div class="table-data">
      <table class="table table-bordered">
        <thead>
          <th colspan="3">Total Payment Details</th>
        </thead>
        <tbody>
          <tr>
            <td>Total Payment</td>
            <td>Advanced Payment</td>
            <td>Pending Payment</td>
          </tr>
          <tr><td>₹ ${parseInt(totalAmount).toLocaleString()}/-</td>
            <td>₹ ${parseInt(receivedAmount).toLocaleString()}/-</td>
            <td>₹ ${parseInt(pendingAmount).toLocaleString()}/-</td>
          </tr>
        </tbody>
      </table>
      </div>` : ""
          const mainPage =
            newPageDisplay === 'style="display:block' ? mainPageHtml : "";
          const bdNames =
            newData.bdeName == newData.bdmName
              ? newData.bdeName
              : `${newData.bdeName} && ${newData.bdmName}`;
          const waitpagination =
            newPageDisplay === 'style="display:block' ? "Page 2/2" : "Page 1/1";
          const pagination = newData.services.length > 1 ? "Page 2/3" : waitpagination
          // Render services HTML content
          const serviceList = renderServiceList();
          const paymentDetails = renderPaymentDetails();
          const morePaymentDetails = renderMorePaymentDetails();
          const thirdPage = newData.services.length > 1 ? ` <div class="PDF_main">
          <section>
            ${morePaymentDetails}
             <div class="table-data">
      <table class="table table-bordered">
        <thead>
          <th colspan="3">Total Payment Details</th>
        </thead>
        <tbody>
          <tr>
            <td>Total Payment</td>
            <td>Advanced Payment</td>
            <td>Pending Payment</td>
          </tr>
          <tr> <td>  ₹ ${parseInt(totalAmount).toLocaleString()}/-</td>
            <td>₹ ${parseInt(receivedAmount).toLocaleString()}/-</td>
            <td>₹ ${parseInt(pendingAmount).toLocaleString()}/-</td>
          </tr>
        </tbody>
      </table>
      </div>
            <div class="Declaration_text">
              <p class="Declaration_text_data">
                I confirm that the outlined payment details and terms accurately represent the agreed-upon arrangements between ${newData["Company Name"]} and START-UP SAHAY PRIVATE LIMITED. The charges are solely for specified services, and no additional services will be provided without separate payment, even in the case of rejection.
              </p>
            </div>
           
      
          </section>
        </div>` : "";
      
          // const htmlTemplate = fs.readFileSync("./helpers/template.html", "utf-8");
          const servicesShubhi = [
            "Pitch Deck Development ",
            "Financial Modeling",
            "DPR Development",
            "CMA Report Development",
            "Company Profile Write-Up",
            "Company Brochure",
            "Product Catalog",
            "Logo Design",
            "Business Card Design",
            "Letter Head Design",
            "Broucher Design",
            "Business Profile",
            "Seed Funding Support",
            "Angel Funding Support",
            "VC Funding Support",
            "Crowd Funding Support",
            "I-Create",
            "Nidhi Seed Support Scheme  ",
            "Nidhi Prayash Yojna",
            "NAIF",
            "Raftaar",
            "CSR Funding",
            "Stand-Up India",
            "PMEGP",
            "USAID",
            "UP Grant",
            "DBS Grant",
            "MSME Innovation",
            "MSME Hackathon",
            "Gujarat Grant",
            "CGTMSC",
            "Income Tax Exemption",
            "Mudra Loan",
            "SIDBI Loan",
            "Incubation Support",
            "Digital Marketing",
            "SEO Services",
            "Branding Services",
            "Social Promotion Management",
            "Email Marketing",
            "Digital Content",
            "Lead Generation",
            "Whatsapp Marketing",
            "Website Development",
            "App Design & Development",
            "Web Application Development",
            "Software Development",
            "CRM Development",
            "ERP Development",
            "E-Commerce Website",
            "Product Development"
          ];
          const mailName = newData.services.some((service) => {
            return servicesShubhi.includes(service.serviceName);
          })
            ? "Shubhi Banthiya"
            : "Dhruvi Gohel";
      
          const AuthorizedEmail =
            mailName === "Dhruvi Gohel"
              ? "dhruvi@startupsahay.com"
              : "rm@startupsahay.com";
          const AuthorizedNumber =
            mailName === "Dhruvi Gohel" ? "+919016928702" : "+919998992601";
      
          const htmlNewTemplate = fs.readFileSync("./helpers/templatev2.html", "utf-8");
          const filledHtml = htmlNewTemplate
            .replace("{{Company Name}}", newData["Company Name"])
            .replace("{{Company Name}}", newData["Company Name"])
            .replace("{{Company Name}}", newData["Company Name"])
            .replace("{{Company Name}}", newData["Company Name"])
            .replace("{{Company Name}}", newData["Company Name"])
            .replace("{{Services}}", serviceList)
            .replace("{{page-display}}", newPageDisplay)
            .replace("{{pagination}}", pagination)
            .replace("{{Authorized-Person}}", mailName)
            .replace("{{Authorized-Number}}", AuthorizedNumber)
            .replace("{{Authorized-Email}}", AuthorizedEmail)
            .replace("{{Main-page}}", mainPage)
            .replace("{{Total-Payment}}", totalPaymentHtml)
            .replace("{{Service-Details}}", paymentDetails)
            .replace("{{Third-Page}}", thirdPage)
            .replace("{{Company Number}}", newData["Company Number"])
            .replace("{{Conditional}}", conditional)
            .replace("{{Company Email}}", newData["Company Email"]);
            
      
          //   console.log("This is html file reading:-", filledHtml);
          const pdfFilePath = `./GeneratedDocs/${newData["Company Name"]}.pdf`;
          const pagelength = newData.services.length===1 && mailName === "Dhruvi Gohel" ? 1 ? newData.services.length===1 && mailName === "Shubhi Banthiya" : 2 : 3
          const options = {
            format: "A4", // Set the page format to A4 size
            orientation: "portrait", // Set the page orientation to portrait (or landscape if needed)
            border: "10mm", // Set the page border size (e.g., 10mm)
            header: {
              height: "70px",
              contents: ``, // Customize the header content
            },
            paginationOffset: 1,       // Override the initial pagination number
      "footer": {
        "height": "100px",
        "contents": {
          first: `<div><p>Client's Signature:__________________________________</p><p style="text-align: center;">Page 1/${pagelength}</p></div>`,
          2: `<div><p>Client's Signature:__________________________________</p><p style="text-align: center;">Page 2/${pagelength}</p></div>`, // Any page number is working. 1-based index
          3: `<div><p>Client's Signature:__________________________________</p><p style="text-align: center;">Page 3/3</p></div>`, // Any page number is working. 1-based index
          default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
          last: '<span style="color: #444;">2</span>/<span>2</span>'
        }
      },
            childProcessOptions: {
              env: {
                OPENSSL_CONF: "./dev/null",
              },
            },
          };
      
          pdf
            .create(filledHtml, options)
            .toFile(pdfFilePath, async (err, response) => {
              if (err) {
                console.error("Error generating PDF:", err);
                res.status(500).send("Error generating PDF");
              } else {
                try {
                  setTimeout(() => {
                    const mainBuffer = fs.readFileSync(pdfFilePath);
                    sendMail2(
                      ["nimesh@incscale.in", "bhagyesh@startupsahay.com", "kumarronak597@gmail.com"],
                      `${newData["Company Name"]} | ${serviceNames} | ${newData.bookingDate}`,
                      ``,
                      `
                        <div class="container">
      
                          <p>Dear ${newData["Company Name"]},</p>
                          <p style="margin-top:20px;">We are thrilled to extend a warm welcome to Start-Up Sahay Private Limited as our esteemed client!</p>
                          <p>Following your discussion with ${bdNames}, we understand that you have opted for ${serviceNames} from Start-Up Sahay Private Limited. We are delighted to have you on board and are committed to providing you with exceptional service and support.</p>
                          <p>In the attachment, you will find important information related to the services you have selected, including your company details, chosen services, and payment terms and conditions. This document named Self-Declaration is designed to be printed on your company letterhead, and we kindly request that you sign and stamp the copy to confirm your agreement.</p>
                          <p>Please review this information carefully. If you notice any discrepancies or incorrect details, kindly inform us as soon as possible so that we can make the necessary corrections and expedite the process.</p>
                          <p style="display:${serviceNames == "Start-Up India Certificate"
                        ? "none"
                        : "block"
                      }">To initiate the process of the services you have taken from us, we require some basic information about your business. This will help us develop the necessary documents for submission in the relevant scheme. Please fill out the form at <a href="https://startupsahay.com/basic-information/" class="btn" target="_blank">Basic Information Form</a>. Please ensure to upload the scanned copy of the signed and stamped <b> Self-Declaration </b> copy while filling out the basic information form.</p>
                          <p style="display:${serviceNames == "Start-Up India Certificate"
                        ? "none"
                        : "block"
                      }">If you encounter any difficulties in filling out the form, please do not worry. Our backend admin executives will be happy to assist you over the phone to ensure a smooth process.</p>
                          <p >Your decision to choose Start-Up Sahay Private Limited is greatly appreciated, and we assure you that we will do everything possible to meet and exceed your expectations. If you have any questions or need assistance at any point, please feel free to reach out to us.</p>
                          <div class="signature">
                              <div>Best regards,</div>
                              <div>${mailName} – Relationship Manager</div>
                              <div> ${mailName === "Dhruvi Gohel" ? "+919016928702" : "+919998992601"}</div>
                              <div>Start-Up Sahay Private Limited</div>
                          </div>
                      </div>
                    `,
                      mainBuffer
                    );
                  }, 4000);
                } catch (emailError) {
                  console.error("Error sending email:", emailError);
                  res.status(500).send("Error sending email with PDF attachment");
                }
              }
            });
      
          // Send success response
          res.status(201).send("Data sent");
        } else {
          res.status(404).json("Company Not found");
          return true;
        }
      } else {
        res.status(200).json("No Action Done");
      }
    } catch (error) {
      console.error("Error creating/updating data:", error);
      res.status(500).send("Error creating/updating data"); // Send an error response
    }
  }
);

// ---------------------------- BDM Booking Request Section -----------------------------------------------

app.post("/api/matured-case-request", async (req, res) => {
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

// app.get("/api/matured-get-requests", async (req, res) => {
//   try {
//     const request = await RequestMaturedModel.find();
//     res.status(200).json(request);
//   } catch (error) {
//     res
//       .status(400)
//       .json({ success: false, message: "Error fetching the data" });
//   }
// });
app.get("/api/inform-bde-requests/:bdeName", async (req, res) => {
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
app.get("/api/matured-get-requests/:bdeName", async (req, res) => {
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
app.get("/api/matured-get-requests-byBDM/:bdmName", async (req, res) => {
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

app.post("/api/update-bdm-Request/:id", async (req, res) => {
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
// app.delete("/api/delete-bdm-Request/:id", async (req, res) => {
//   try {
//     const _id = req.params.id;

//     // Find the BDM request by ID and delete it
//     const deletedRequest = await RequestMaturedModel.findByIdAndDelete(_id);
//     const changeStatus = await TeamLeadsModel.findOneAndUpdate(
//       {
//         "Company Name": deletedRequest["Company Name"],
//       },
//       {
//         bdmOnRequest: false,
//       },
//       { new: true }
//     );

//     if (!deletedRequest) {
//       return res.status(404).json({ message: "BDM request not found" });
//     }

//     res.status(200).json({ message: "BDM request deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting BDM request:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });
app.delete("/api/delete-inform-Request/:id", async (req, res) => {
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

// --------------------------------------- Redesigned Form Section -----------------------------------------------
app.post(
  "/api/redesigned-edit-leadData/:CompanyName/:step",
  upload.fields([
    { name: "otherDocs", maxCount: 50 },
    { name: "paymentReceipt", maxCount: 2 },
  ]),
  async (req, res) => {
    try {
      const companyName = req.params.CompanyName;
      const newData = req.body;
      const Step = req.params.step;
      console.log(Step, newData);
      if (Step === "step1") {
        const existingData = await EditableDraftModel.findOne({
          "Company Name": companyName,
        });

        if (existingData) {
          // Update existing data if found
          const updatedData = await EditableDraftModel.findOneAndUpdate(
            { "Company Name": companyName },
            {
              $set: {
                "Company Email":
                  newData["Company Email"] || existingData["Company Email"],
                "Company Name":
                  newData["Company Name"] || existingData["Company Name"],
                "Company Number":
                  newData["Company Number"] || existingData["Company Number"],
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
          const createdData = await EditableDraftModel.create({
            "Company Email": newData["Company Email"],
            "Company Name": newData["Company Name"],
            "Company Number": newData["Company Number"],
            incoDate: newData.incoDate,
            panNumber: newData.panNumber,
            gstNumber: newData.gstNumber,
            Step1Status: true,
          });
          res.status(201).json(createdData); // Respond with created data
          return true;
        }
      } else if (Step === "step2") {
        const existingData = await EditableDraftModel.findOne({
          "Company Name": companyName,
        });
        console.log("Second Step Working");
        if (existingData) {
          const updatedData = await EditableDraftModel.findOneAndUpdate(
            { "Company Name": companyName },
            {
              $set: {
                bdeName: newData.bdeName || "",
                bdeEmail: newData.bdeEmail || "",
                bdmName: newData.bdmName || "",
                otherBdmName: newData.otherBdmName || "",
                bdmEmail: newData.bdmEmail || "",
                bookingDate: newData.bookingDate || "",
                bookingSource: newData.bookingSource || "",
                otherBookingSource: newData.otherBookingSource || "",
                Step2Status: true,
              },
            },
            { new: true }
          );
          res.status(200).json(updatedData);
          return true; // Respond with updated data
        } else {
          const createdData = await EditableDraftModel.create({
            "Company Name": companyName || existingData["Company Name"],
            bdeName: newData.bdeName || "",
            bdeEmail: newData.bdeEmail || "",
            bdmName: newData.bdmName || "",
            otherBdmName: newData.otherBdmName || "",
            bdmEmail: newData.bdmEmail || "",
            bookingDate: newData.bookingDate || "",
            bookingSource: newData.bookingSource || "",
            otherBookingSource: newData.otherBookingSource || "",
            Step2Status: true,
          });
          res.status(200).json(createdData);
          return true;
        }
      } else if (Step === "step3") {
        const existingData = await EditableDraftModel.findOne({
          "Company Name": companyName,
        });

        if (existingData) {
          // Update existing data if found
          const updatedData = await EditableDraftModel.findOneAndUpdate(
            { "Company Name": companyName },
            {
              $set: {
                services: newData.services || existingData.services,
                numberOfServices:
                  newData.numberOfServices || existingData.numberOfServices,
                caCase: newData.caCase,
                caCommission: newData.caCommission,
                caNumber: newData.caNumber,
                caEmail: newData.caEmail,
                totalAmount: newData.totalAmount || existingData.totalAmount,
                pendingAmount:
                  newData.pendingAmount || existingData.pendingAmount,
                receivedAmount:
                  newData.receivedAmount || existingData.receivedAmount,
                Step3Status: true,
              },
            },
            { new: true }
          );
          res.status(200).json(updatedData);
          return true; // Respond with updated data
        } else {
          const createdData = await EditableDraftModel.create({
            "Company Name": companyName || existingData["Company Name"],
            services: newData.services || existingData.services,
            numberOfServices:
              newData.numberOfServices || existingData.numberOfServices,
            caCase: newData.caCase,
            caCommission: newData.caCommission,
            caNumber: newData.caNumber,
            caEmail: newData.caEmail,
            totalAmount: newData.totalAmount || existingData.totalAmount,
            pendingAmount: newData.pendingAmount || existingData.pendingAmount,
            receivedAmount:
              newData.receivedAmount || existingData.receivedAmount,
            Step3Status: true,
          });
          res.status(200).json(createdData);
          return true;
        }
      } else if (Step === "step4") {
        const existingData = await EditableDraftModel.findOne({
          "Company Name": companyName,
        });

        newData.otherDocs =
          req.files["otherDocs"] === undefined
            ? []
            : req.files["otherDocs"].map((file) => file);
        newData.paymentReceipt =
          req.files["paymentReceipt"] === undefined
            ? []
            : req.files["paymentReceipt"].map((file) => file);
        if (existingData) {
          // Update existing data if found
          const updatedData = await EditableDraftModel.findOneAndUpdate(
            { "Company Name": companyName },
            {
              $set: {
                totalAmount: newData.totalAmount || existingData.totalAmount,
                pendingAmount:
                  newData.pendingAmount || existingData.pendingAmount,
                receivedAmount:
                  newData.receivedAmount || existingData.receivedAmount,
                paymentReceipt:
                  newData.paymentReceipt || existingData.paymentReceipt,
                otherDocs: newData.otherDocs || existingData.otherDocs,
                paymentMethod: newData.paymentMethod || newData.paymentMethod,
                extraNotes: newData.extraNotes || newData.extraNotes,
                Step4Status: true,
              },
            },
            { new: true }
          );
          res.status(200).json(updatedData);
          return true; // Respond with updated data
        } else {
          const createdData = await EditableDraftModel.create({
            "Company Name": companyName || existingData["Company Name"],
            totalAmount: newData.totalAmount || existingData.totalAmount,
            pendingAmount: newData.pendingAmount || existingData.pendingAmount,
            receivedAmount:
              newData.receivedAmount || existingData.receivedAmount,
            paymentReceipt:
              newData.paymentReceipt || existingData.paymentReceipt,
            otherDocs: newData.otherDocs || existingData.otherDocs,
            paymentMethod: newData.paymentMethod || newData.paymentMethod,
            extraNotes: newData.extraNotes || newData.extraNotes,
            Step4Status: true,
          });
          res.status(200).json(createdData);
          return true;
        }
      } else if (Step === "step5") {
        const existingData = await EditableDraftModel.findOne({
          "Company Name": companyName,
        });
        if (existingData) {
          const date = new Date();
          console.log(newData.requestBy);

          const updatedData = await EditableDraftModel.findOneAndUpdate(
            { "Company Name": companyName },
            {
              $set: {
                Step5Status: true,
                requestBy: newData.requestBy,
                requestDate: date,
                services:
                  existingData.services.length !== 0
                    ? existingData.services
                    : newData.services,
              },
            },
            { new: true }
          );
          res.status(200).json(updatedData);
          return true;
        } else {
          res.status(200).json({ message: "No Changes made" });
          return true;
        }
      }
      // Add uploaded files information to newData
    } catch (error) {
      console.error("Error creating/updating data:", error);
      res.status(500).send("Error creating/updating data"); // Send an error response
    }
  }
);

app.post(
  "/api/edit-moreRequest/:companyName/:bookingIndex",
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
app.get("/api/editable-LeadData", async (req, res) => {
  try {
    const data = await EditableDraftModel.find(); // Fetch all data from the collection
    res.json(data); // Send the data as JSON response
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
app.get("/api/redesigned-final-leadData", async (req, res) => {
  try {
    const allData = await RedesignedLeadformModel.find();
    res.status(200).json(allData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});
app.get("/api/redesigned-final-leadData/:companyName", async (req, res) => {
  try {
    const companyName = req.params.companyName;
    const allData = await RedesignedLeadformModel.findOne({
      "Company Name": companyName,
    });

    res.status(200).json(allData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});
app.delete("/api/redesigned-delete-booking/:companyId", async (req, res) => {
  try {
    const companyId = req.params.companyId;
    // Find and delete the booking with the given companyId
    const deletedBooking = await RedesignedLeadformModel.findOneAndDelete({
      company: companyId,
    });
    const updateMainBooking = await CompanyModel.findByIdAndUpdate(
      companyId,
      { $set: { Status: "Interested" } },
      { new: true }
    );
    if (deletedBooking) {
      const deleteDraft = await RedesignedDraftModel.findOneAndDelete({
        "Company Name": deletedBooking["Company Name"],
      });
    } else {
      return res.status(404).send("Booking not found");
    }
    res.status(200).send("Booking deleted successfully");
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.delete(
  "/api/redesigned-delete-all-booking/:companyId/:bookingIndex",
  async (req, res) => {
    try {
      const companyID = req.params.companyId;
      const bookingIndex = req.params.bookingIndex;
      // Find and delete the booking with the given companyId
      if (bookingIndex == 0) {
        console.log("I am here in 0 index");
        const deletedBooking = await RedesignedLeadformModel.findOneAndDelete({
          company: companyID,
        });
        const updateMainBooking = await CompanyModel.findByIdAndUpdate(
          companyID,
          { $set: { Status: "Interested" } },
          { new: true }
        );
        if (deletedBooking) {
          const deleteDraft = await RedesignedDraftModel.findOneAndDelete({
            "Company Name": deletedBooking["Company Name"],
          });
          const deleterequest = await RequestDeleteByBDE.findOneAndUpdate(
            {
              companyName: deletedBooking["Company Name"],
              request: false,
              bookingIndex: 0,
            },
            {
              $set: {
                request: true,
              },
            }
          );
        } else {
          return res.status(404).send("Booking not found");
        }
      } else {
        console.log("I am here in 1 index");
        const moreObject = await RedesignedLeadformModel.findOne({
          company: companyID,
        });
        const moreID = moreObject.moreBookings[bookingIndex - 1]._id;
        const deletedBooking = await RedesignedLeadformModel.findOneAndUpdate(
          { company: companyID },
          { $pull: { moreBookings: { _id: moreID } } },
          { new: true }
        );
        const deleterequest = await RequestDeleteByBDE.findOneAndUpdate(
          {
            companyName: moreObject["Company Name"],
            request: false,
            bookingIndex: bookingIndex,
          },
          {
            $set: {
              request: true,
            },
          }
        );

        return res.status(200).send("booking Deleted Successfuly");
      }

      res.status(200).send("Booking deleted successfully");
    } catch (error) {
      console.error("Error deleting booking:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Deleting booking for particular id
app.delete(
  "/api/redesigned-delete-particular-booking/:company/:companyId",
  async (req, res) => {
    try {
      const company = req.params.company;
      const companyId = req.params.companyId;

      const updatedLeadForm = await RedesignedLeadformModel.findOneAndUpdate(
        { company: company },
        { $pull: { moreBookings: { _id: companyId } } },
        { new: true }
      );

      if (!updatedLeadForm) {
        return res.status(404).send("Booking not found");
      }

      res.status(200).send("Booking deleted successfully");
    } catch (error) {
      console.error("Error deleting booking:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);
// Backend: API endpoint for deleting a draft
app.delete("/api/redesigned-delete-model/:companyName", async (req, res) => {
  try {
    const companyName = req.params.companyName;
    // Assuming RedesignedDraftModel is your Mongoose model for drafts
    const deletedDraft = await RedesignedDraftModel.findOneAndDelete({
      "Company Name": companyName,
    });
    if (deletedDraft) {
      console.log("Draft deleted successfully:", deletedDraft);
      res.status(200).json({ message: "Draft deleted successfully" });
    } else {
      console.error("Draft not found or already deleted");
      res.status(404).json({ error: "Draft not found or already deleted" });
    }
  } catch (error) {
    console.error("Error deleting draft:", error);
    res.status(500).json({ error: "Error deleting draft" });
  }
});

app.post("/api/redesigned-final-leadData/:CompanyName", async (req, res) => {
  try {
    const newData = req.body;
    const isAdmin = newData.isAdmin;
    console.log("Admin :-", isAdmin)
    const companyData = await CompanyModel.findOne({
      "Company Name": newData["Company Name"],
    });
    const teamData = await TeamLeadsModel.findOne({
      "Company Name": newData["Company Name"],
    });
    if (companyData) {
      newData.company = companyData._id;
    }
    // Create a new entry in the database
    const createdData = await RedesignedLeadformModel.create(newData);
    const date = new Date();
    if (companyData) {
      await CompanyModel.findByIdAndUpdate(companyData._id, {
        Status: "Matured",
        lastActionDate: date,
        ename: newData.bdeName,
        maturedBdmName: newData.bdmName,
      });
    }
    if (teamData) {
      await TeamLeadsModel.findByIdAndUpdate(
        teamData._id,
        {
          bdmStatus: "Matured",
          Status: "Matured",
        },
        { new: true }
      );
      const date = new Date();
      await InformBDEModel.create({
        bdeName: teamData.ename,
        bdmName: teamData.bdmName,
        "Company Name": teamData["Company Name"],
        date: date,
      });
    }

    const totalAmount = newData.services.reduce(
      (acc, curr) => acc + parseInt(curr.totalPaymentWGST),
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
      let servicesHtml = "";
      for (let i = 0; i < newData.services.length; i++) {
        const displayPaymentTerms =
          newData.services[i].paymentTerms === "Full Advanced"
            ? "none"
            : "flex";
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
            ${newData.services[i].serviceName === "Start-Up India Certificate"
            ? newData.services[i].withDSC
              ? "Start-Up India Certificate With DSC"
              : "Start-Up India Certificate Without DSC"
            : newData.services[i].serviceName
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
              ₹ ${parseInt(
            newData.services[i].totalPaymentWGST
          ).toLocaleString()}
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
            ${newData.services[i].withGST ? "Yes" : "No"}
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
           ${newData.services[i].paymentTerms === "Full Advanced"
            ? "Full Advanced"
            : "Part-Payment"
          }
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
              ₹ ${parseInt(newData.services[i].firstPayment).toLocaleString()}
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
              ₹ ${parseInt(
            newData.services[i].secondPayment
          ).toLocaleString()} - ${isNaN(new Date(newData.services[i].secondPaymentRemarks))
            ? newData.services[i].secondPaymentRemarks
            : `Payment On ${newData.services[i].secondPaymentRemarks}`
          }
          </div>
        </div>
      </div>
      <div style="display: ${newData.services[i].thirdPayment === 0 ? "none" : "flex"
          }; flex-wrap: wrap">
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
              ₹ ${parseInt(
            newData.services[i].thirdPayment
          ).toLocaleString()} - ${isNaN(new Date(newData.services[i].thirdPaymentRemarks))
            ? newData.services[i].thirdPaymentRemarks
            : `Payment On ${newData.services[i].thirdPaymentRemarks}`
          }
          </div>
        </div>
      </div>
      <div style="display: ${newData.services[i].fourthPayment === 0 ? "none" : "flex"
          }; flex-wrap: wrap">
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
              ₹ ${parseInt(
            newData.services[i].fourthPayment
          ).toLocaleString()} - ${isNaN(new Date(newData.services[i].fourthPaymentRemarks))
            ? newData.services[i].fourthPaymentRemarks
            : `Payment On ${newData.services[i].fourthPaymentRemarks}`
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
    const visibility = newData.bookingSource !== "Other" && "none";
    // Send email to recipients
    const recipients = !isAdmin ? [
      newData.bdeEmail,
      newData.bdmEmail,
      "bookings@startupsahay.com",
      "documents@startupsahay.com",
    ] : ["nimesh@incscale.in"];

    const serviceNames = newData.services
      .map((service, index) => `${service.serviceName}`)
      .join(" , ");

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
                    ${formatDate(newData["incoDate"])}
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
                  Company's PAN/GST Number:
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
                    ${newData.bdeEmail}
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
                    ${newData.bdmEmail}
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
                  BDM Type
                </div>
              </div>
              <div style="width: 75%">
                <div style="
                      border: 1px solid #ccc;
                      font-size: 12px;
                      padding: 5px 10px;
                    ">
                    ${newData.bdmType === "Close-by"
        ? "Closed-by"
        : "Supported-by"
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
                    ${newData.otherBookingSource}
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
            <div style="display: flex; flex-wrap: wrap">
                <div style="width: 25%">
                  <div style="
                        border: 1px solid #ccc;
                        font-size: 12px;
                        padding: 5px 10px;
                      ">
                    CA Case
                  </div>
                </div>
                <div style="width: 75%">
                  <div style="
                        border: 1px solid #ccc;
                        font-size: 12px;
                        padding: 5px 10px;
                      ">
                      ${newData.caCase}
                  </div>
                </div>
            </div>
             <div style="display: ${newData.caCase === "Yes" ? "flex" : "none"
      }; flex-wrap: wrap">
                <div style="width: 25%">
                  <div style="
                        border: 1px solid #ccc;
                        font-size: 12px;
                        padding: 5px 10px;
                      ">
                    CA Number
                  </div>
                </div>
                <div style="width: 75%">
                  <div style="
                        border: 1px solid #ccc;
                        font-size: 12px;
                        padding: 5px 10px;
                      ">
                      ${newData.caNumber}
                  </div>
                </div>
            </div>
            <div style="display: ${newData.caCase === "Yes" ? "flex" : "none"
      }; flex-wrap: wrap">
                <div style="width: 25%">
                  <div style="
                        border: 1px solid #ccc;
                        font-size: 12px;
                        padding: 5px 10px;
                      ">
                    CA Email
                  </div>
                </div>
                <div style="width: 75%">
                  <div style="
                        border: 1px solid #ccc;
                        font-size: 12px;
                        padding: 5px 10px;
                      ">
                      ${newData.caEmail}
                  </div>
                </div>
            </div>
            <div style="display: ${newData.caCase === "Yes" ? "flex" : "none"
      }; flex-wrap: wrap">
                <div style="width: 25%">
                  <div style="
                        border: 1px solid #ccc;
                        font-size: 12px;
                        padding: 5px 10px;
                      ">
                    CA Commission
                  </div>
                </div>
                <div style="width: 75%">
                  <div style="
                        border: 1px solid #ccc;
                        font-size: 12px;
                        padding: 5px 10px;
                      ">
                      ${newData.caCommission}
                  </div>
                </div>
            </div>

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
                    ₹ ${parseInt(totalAmount).toLocaleString()}
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
                    ₹ ${parseInt(receivedAmount).toLocaleString()}
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
                   ₹ ${parseInt(pendingAmount).toLocaleString()}
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

    const renderServiceList = () => {
      let servicesHtml = "";
      for (let i = 0; i < newData.services.length; i++) {
        servicesHtml += `
        <span>Service ${i + 1}: ${newData.services[i].serviceName}</span>,  
        `;
      }
      return servicesHtml;
    };
    const renderPaymentDetails = () => {
      let servicesHtml = "";
      let paymentServices = "";
      const serviceLength = newData.services.length > 2 ? 2 : newData.services.length
      for (let i = 0; i < serviceLength; i++) {
        const Amount =
          newData.services[i].paymentTerms === "Full Advanced"
            ? newData.services[i].totalPaymentWGST
            : newData.services[i].firstPayment;
        let rowSpan;

        if (newData.services[i].paymentTerms === "two-part") {
          if (
            newData.services[i].thirdPayment !== 0 &&
            newData.services[i].fourthPayment === 0
          ) {
            rowSpan = 2;
          } else if (newData.services[i].fourthPayment !== 0) {
            rowSpan = 3;
          }
        } else {
          rowSpan = 1;
        }

        if (rowSpan === 3) {
          paymentServices = `
        <tr>
          <td style="border-right:1px solid #ddd">₹${parseInt(newData.services[i].secondPayment).toLocaleString()}/-</td>
          <td>${newData.services[i].secondPaymentRemarks}</td>
        </tr>
        <tr>
         <td style="border-right:1px solid #ddd">₹${parseInt(newData.services[i].thirdPayment).toLocaleString()}/-</td>
         <td>${newData.services[i].thirdPaymentRemarks}</td>
        </tr>
        <tr>
         <td style="border-right:1px solid #ddd">₹${parseInt(newData.services[i].fourthPayment).toLocaleString()}/-</td>
         <td>${newData.services[i].fourthPaymentRemarks}</td>
        </tr>
        `;
        } else if (rowSpan === 2) {
          paymentServices = `
        <tr>
          <td style="border-right:1px solid #ddd">₹${parseInt(newData.services[i].secondPayment).toLocaleString()}/-</td>
          <td >${newData.services[i].secondPaymentRemarks}</td>
        </tr>
        <tr>
          <td style="border-right:1px solid #ddd">₹${parseInt(newData.services[i].thirdPayment).toLocaleString()}/-</td>
          <td >${newData.services[i].thirdPaymentRemarks}</td>
        </tr>
        `;
        } else {
          paymentServices = `
        <tr>
          <td >₹${parseInt(newData.services[i].secondPayment).toLocaleString()}/-</td>
          <td>${newData.services[i].paymentTerms !== "Full Advanced"
              ? newData.services[i].secondPaymentRemarks
              : "100% Advance Payment"
            }</td>
        </tr>
        `;
        }
        servicesHtml += `
        <table class="table table-bordered">
            <thead>
              <td colspan="4">Service Name : ${newData.services[i].serviceName
          }</td>
            </thead>
            <tbody>
              <tr>
                <td>Total Payment</td>
                <td>Advanced Payment</td>
                <td>Pending payment</td>
                <td>Remarks</td>
              </tr>
              <tr>
                    <th rowspan='4'>₹ ${newData.services[i].totalPaymentWGST
          } /-</th>
                    <th rowspan='4'>₹ ${newData.services[i].paymentTerms === "Full Advanced"
            ? parseInt(newData.services[i].totalPaymentWGST).toLocaleString()
            : parseInt(newData.services[i].firstPayment).toLocaleString()
          }/-</th>
              </tr>
              ${paymentServices}
            </tbody>
        </table>
        `;
      }
      return servicesHtml;
    };
    const renderMorePaymentDetails = () => {
      let servicesHtml = "";
      let paymentServices = "";

      for (let i = 2; i < newData.services.length; i++) {
        const Amount =
          newData.services[i].paymentTerms === "Full Advanced"
            ? newData.services[i].totalPaymentWGST
            : newData.services[i].firstPayment;
        let rowSpan;

        if (newData.services[i].paymentTerms === "two-part") {
          if (
            newData.services[i].thirdPayment !== 0 &&
            newData.services[i].fourthPayment === 0
          ) {
            rowSpan = 2;
          } else if (newData.services[i].fourthPayment !== 0) {
            rowSpan = 3;
          }
        } else {
          rowSpan = 1;
        }

        if (rowSpan === 3) {
          paymentServices = `
        <tr>
          <td>₹${parseInt(newData.services[i].secondPayment).toLocaleString()}/-</td>
          <td>${newData.services[i].secondPaymentRemarks}</td>
        </tr>
        <tr>
         <td>₹${parseInt(newData.services[i].thirdPayment).toLocaleString()}/-</td>
         <td>${newData.services[i].thirdPaymentRemarks}</td>
        </tr>
        <tr>
         <td>₹${parseInt(newData.services[i].fourthPayment).toLocaleString()}/-</td>
         <td>${newData.services[i].fourthPaymentRemarks}</td>
        </tr>
        `;
        } else if (rowSpan === 2) {
          paymentServices = `
        <tr>
          <td>₹${parseInt(newData.services[i].secondPayment).toLocaleString()}/-</td>
          <td>${newData.services[i].secondPaymentRemarks}</td>
        </tr>
        <tr>
          <td>₹${parseInt(newData.services[i].thirdPayment).toLocaleString()}/-</td>
          <td>${newData.services[i].thirdPaymentRemarks}</td>
        </tr>
        `;
        } else {
          paymentServices = `
        <tr>
          <td>₹${parseInt(newData.services[i].secondPayment).toLocaleString()}/-</td>
          <td>${newData.services[i].paymentTerms !== "Full Advanced"
              ? newData.services[i].secondPaymentRemarks
              : "100% Advance Payment"
            }</td>
        </tr>
        `;
        }

        servicesHtml += `
        <table class="table table-bordered">
            <thead>
              <td colspan="4">Service Name : ${newData.services[i].serviceName
          }</td>
            </thead>
            <tbody>
              <tr>
                <td>Total Payment</td>
                <td>Advanced Payment</td>
                <td>Pending payment</td>
                <td>Remarks</td>
              </tr>
              <tr>
                    <th rowspan='4'>₹ ${parseInt(newData.services[i].totalPaymentWGST).toLocaleString()
          } /-</th>
                    <th rowspan='4'>₹ ${newData.services[i].paymentTerms === "Full Advanced"
            ? parseInt(newData.services[i].totalPaymentWGST).toLocaleString()
            : parseInt(newData.services[i].firstPayment).toLocaleString()
          }/-</th>
              </tr>
              ${paymentServices}
            </tbody>
        </table>
        `;
      }
      return servicesHtml;
    };
    const allowedServiceNames = [
      "Seed Funding Support",
      "Angel Funding Support",
      "VC Funding Support",
      "Crowd Funding Support",
      "I-Create",
      "Nidhi Seed Support Scheme",
      "Nidhi Prayash Yojna",
      "NAIF",
      "Raftaar",
      "CSR Funding",
      "Stand-Up India",
      "PMEGP",
      "USAID",
      "UP Grant",
      "DBS Grant",
      "MSME Innovation",
      "MSME Hackathon",
      "Gujarat Grant",
      "CGTMSC",
      "Mudra Loan",
      "SIDBI Loan",
      "Incubation Support",
    ];
    const AuthorizedName = newData.services.some((service) => {
      const tempServices = [...allowedServiceNames, "Income Tax Exemption"];
      return tempServices.includes(service);
    })
      ? "Shubhi Banthiya"
      : "Dhruvi Gohel";

    console.log(newData.services);
    const newPageDisplay = newData.services.some((service) => {
      const tempServices = [
        ...allowedServiceNames,
        "Income Tax Exemption",
        "Start-Up India Certificate",
      ];
      return tempServices.includes(service.serviceName);
    })
      ? 'style="display:block'
      : 'style="display:none';

    console.log(newPageDisplay);



    const renderServiceKawali = () => {
      let servicesHtml = "";
      let fundingServices = "";
      let fundingServicesArray = "";
      let incomeTaxServices = "";

      for (let i = 0; i < newData.services.length; i++) {
        if (
          newData.services[i].serviceName === "Start-Up India Certificate"
        ) {
          servicesHtml = `
          <p class="Declaration_text_head mt-2">
          <b>
            Start-Up India Certification Acknowledgement:
          </b>
        </p>
        <p class="Declaration_text_data">
        I, Director of ${newData["Company Name"]}, acknowledge START-UP SAHAY PRIVATE LIMITED's assistance in obtaining the Start-up India certificate, including document preparation and application support. I understand they charge a fee for their services. I acknowledge that the certificate is issued by the government free of charge and that START-UP SAHAY hasn't misled me about this.
        </p>
        
        `;
        } else if (
          allowedServiceNames.includes(newData.services[i].serviceName)
        ) {
          fundingServicesArray += `${newData.services[i].serviceName},`;
          fundingServices = `
          <p class="Declaration_text_head mt-2">
          <b>
          ${newData.services[i].serviceName} Acknowledgement:   
          </b>
        </p>
        <p class="Declaration_text_data">
        I, Director of ${newData["Company Name"]}, engage START-UP SAHAY PRIVATE LIMITED for ${newData.services[i].serviceName}. They'll provide document creation and Application support, utilizing their resources and expertise. I understand there's a fee for their services, not as government fees, Approval of the application is up to the Concerned authorities. START-UP SAHAY PRIVATE LIMITED has not assured me of application approval.
        </p>
        
        `;
        } else if (
          newData.services[i].serviceName === "Income Tax Exemption"
        ) {
      
          incomeTaxServices = `
          <p class="Declaration_text_head mt-2">
          <b>
          Income Tax Exemption Services Acknowledgement:   
          </b>
        </p>
        <p class="Declaration_text_data">
        I, Director of ${newData["Company Name"]}, acknowledge START-UP SAHAY PRIVATE LIMITED's assistance in obtaining the Certificate of Eligibility for the 3-year tax exemption under the 80IAC Income Tax Act. Their services include document preparation and application support, for which they charge a fee. I understand that government fees are not involved. START-UP SAHAY has provided accurate information about the approval process, and the decision rests with the relevant authorities.
        </p>
      `;
        } else {
          servicesHtml += `
      <br>
      `;
        }
      }

      if (fundingServicesArray !== "") {
        servicesHtml += `
        <p class="Declaration_text_head mt-2">
        <b>
        ${fundingServicesArray} Acknowledgement:    
        </b>
      </p>
      <p class="Declaration_text_data">
      I, Director of ${newData["Company Name"]}, engage START-UP SAHAY PRIVATE LIMITED for ${fundingServicesArray}. They'll provide document creation and Application support, utilizing their resources and expertise. I understand there's a fee for their services, not as government fees, Approval of the application is up to the concerned department/authorities. START-UP SAHAY PRIVATE LIMITED has not assured me of application approval.
      </p>
    `;
      } 
      if (incomeTaxServices !== "") {
        servicesHtml += `
        <p class="Declaration_text_head mt-2">
        <b>
        Income Tax Exemption Services Acknowledgement:     
        </b>
      </p>
      <p class="Declaration_text_data">
      I, Director of ${newData["Company Name"]}, acknowledge that START-UP SAHAY PRIVATE LIMITED is assisting me in obtaining the Certificate of Eligibility for the 3-year tax exemption under the 80IAC Income Tax Act. These services involve preparing necessary documents and applications, and utilizing their infrastructure, experience, manpower, and expertise. I understand there's a fee for their services, not as government fees. START-UP SAHAY has provided accurate information regarding the approval process. The decision regarding the application approval rests with the concerned authorities.
      </p>
  `;
      }
      return servicesHtml;
    };
    const conditional = newData.services.length < 2 ? `<div class="Declaration_text">
<p class="Declaration_text_data">
  I confirm that the outlined payment details and terms accurately represent the agreed-upon arrangements between ${newData["Company Name"]} and START-UP SAHAY PRIVATE LIMITED. The charges are solely for specified services, and no additional services will be provided without separate payment, even in the case of rejection.
</p>
</div>` : "";
    const serviceKawali = renderServiceKawali();
    const currentDate = new Date();

    const dateOptions = { day: "numeric", month: "long", year: "numeric" };
    const todaysDate = currentDate.toLocaleDateString("en-US", dateOptions);
    const mainPageHtml = `
        <div class="PDF_main">
          <section>
            <div class="date_div">
              <p>${todaysDate}</p>
            </div>
            <div class="pdf_heading">
              <h3>Self Declaration</h3>
            </div>
            <div class="Declaration_text">
              ${serviceKawali}
              <p class="Declaration_text_data">
                I, understands that because of government regulations and portal, I have no objections if the
                process takes longer than initially committed, knowing it's just how government schemes
                related process works.
              </p>
              <p class="Declaration_text_data">
              As I am unfamiliar with the process, I give START-UP SAHAY PRIVATE LIMITED permission to submit the online or offline application in the concerned department on my behalf, if required.
              </p>
            </div>
         
            
          </section>
        
        </div>
      `;
    const totalPaymentHtml = newData.services.length < 2 ? ` <div class="table-data">
<table class="table table-bordered">
  <thead>
    <th colspan="3">Total Payment Details</th>
  </thead>
  <tbody>
    <tr>
      <td>Total Payment</td>
      <td>Advanced Payment</td>
      <td>Pending Payment</td>
    </tr>
    <tr><td>₹ ${parseInt(totalAmount).toLocaleString()}/-</td>
      <td>₹ ${parseInt(receivedAmount).toLocaleString()}/-</td>
      <td>₹ ${parseInt(pendingAmount).toLocaleString()}/-</td>
    </tr>
  </tbody>
</table>
</div>` : ""
    const mainPage =
      newPageDisplay === 'style="display:block' ? mainPageHtml : "";
    const bdNames =
      newData.bdeName == newData.bdmName
        ? newData.bdeName
        : `${newData.bdeName} && ${newData.bdmName}`;
    const waitpagination =
      newPageDisplay === 'style="display:block' ? "Page 2/2" : "Page 1/1";
    const pagination = newData.services.length > 1 ? "Page 2/3" : waitpagination
    // Render services HTML content
    const serviceList = renderServiceList();
    const paymentDetails = renderPaymentDetails();
    const morePaymentDetails = renderMorePaymentDetails();
    const thirdPage = newData.services.length > 1 ? ` <div class="PDF_main">
    <section>
      ${morePaymentDetails}
       <div class="table-data">
<table class="table table-bordered">
  <thead>
    <th colspan="3">Total Payment Details</th>
  </thead>
  <tbody>
    <tr>
      <td>Total Payment</td>
      <td>Advanced Payment</td>
      <td>Pending Payment</td>
    </tr>
    <tr> <td>  ₹ ${parseInt(totalAmount).toLocaleString()}/-</td>
      <td>₹ ${parseInt(receivedAmount).toLocaleString()}/-</td>
      <td>₹ ${parseInt(pendingAmount).toLocaleString()}/-</td>
    </tr>
  </tbody>
</table>
</div>
      <div class="Declaration_text">
        <p class="Declaration_text_data">
          I confirm that the outlined payment details and terms accurately represent the agreed-upon arrangements between ${newData["Company Name"]} and START-UP SAHAY PRIVATE LIMITED. The charges are solely for specified services, and no additional services will be provided without separate payment, even in the case of rejection.
        </p>
      </div>
     

    </section>
  </div>` : "";

    // const htmlTemplate = fs.readFileSync("./helpers/template.html", "utf-8");
    const servicesShubhi = [
      "Pitch Deck Development ",
      "Financial Modeling",
      "DPR Development",
      "CMA Report Development",
      "Company Profile Write-Up",
      "Company Brochure",
      "Product Catalog",
      "Logo Design",
      "Business Card Design",
      "Letter Head Design",
      "Broucher Design",
      "Business Profile",
      "Seed Funding Support",
      "Angel Funding Support",
      "VC Funding Support",
      "Crowd Funding Support",
      "I-Create",
      "Nidhi Seed Support Scheme  ",
      "Nidhi Prayash Yojna",
      "NAIF",
      "Raftaar",
      "CSR Funding",
      "Stand-Up India",
      "PMEGP",
      "USAID",
      "UP Grant",
      "DBS Grant",
      "MSME Innovation",
      "MSME Hackathon",
      "Gujarat Grant",
      "CGTMSC",
      "Income Tax Exemption",
      "Mudra Loan",
      "SIDBI Loan",
      "Incubation Support",
      "Digital Marketing",
      "SEO Services",
      "Branding Services",
      "Social Promotion Management",
      "Email Marketing",
      "Digital Content",
      "Lead Generation",
      "Whatsapp Marketing",
      "Website Development",
      "App Design & Development",
      "Web Application Development",
      "Software Development",
      "CRM Development",
      "ERP Development",
      "E-Commerce Website",
      "Product Development"
    ];
    const mailName = newData.services.some((service) => {
      return servicesShubhi.includes(service.serviceName);
    })
      ? "Shubhi Banthiya"
      : "Dhruvi Gohel";

    const AuthorizedEmail =
      mailName === "Dhruvi Gohel"
        ? "dhruvi@startupsahay.com"
        : "rm@startupsahay.com";
    const AuthorizedNumber =
      mailName === "Dhruvi Gohel" ? "+919016928702" : "+919998992601";

    const htmlNewTemplate = fs.readFileSync("./helpers/templatev2.html", "utf-8");
    const filledHtml = htmlNewTemplate
      .replace("{{Company Name}}", newData["Company Name"])
      .replace("{{Company Name}}", newData["Company Name"])
      .replace("{{Company Name}}", newData["Company Name"])
      .replace("{{Company Name}}", newData["Company Name"])
      .replace("{{Company Name}}", newData["Company Name"])
      .replace("{{Services}}", serviceList)
      .replace("{{page-display}}", newPageDisplay)
      .replace("{{pagination}}", pagination)
      .replace("{{Authorized-Person}}", mailName)
      .replace("{{Authorized-Number}}", AuthorizedNumber)
      .replace("{{Authorized-Email}}", AuthorizedEmail)
      .replace("{{Main-page}}", mainPage)
      .replace("{{Total-Payment}}", totalPaymentHtml)
      .replace("{{Service-Details}}", paymentDetails)
      .replace("{{Third-Page}}", thirdPage)
      .replace("{{Company Number}}", newData["Company Number"])
      .replace("{{Conditional}}", conditional)
      .replace("{{Company Email}}", newData["Company Email"]);
      

    //   console.log("This is html file reading:-", filledHtml);
    const pdfFilePath = `./GeneratedDocs/${newData["Company Name"]}.pdf`;
    const pagelength = newData.services.length===1 && mailName === "Dhruvi Gohel" ? 1 ? newData.services.length===1 && mailName === "Shubhi Banthiya" : 2 : 3
    const options = {
      format: "A4", // Set the page format to A4 size
      orientation: "portrait", // Set the page orientation to portrait (or landscape if needed)
      border: "10mm", // Set the page border size (e.g., 10mm)
      header: {
        height: "70px",
        contents: ``, // Customize the header content
      },
      paginationOffset: 1,       // Override the initial pagination number
"footer": {
  "height": "100px",
  "contents": {
    first: `<div><p>Client's Signature:__________________________________</p><p style="text-align: center;">Page 1/${pagelength}</p></div>`,
    2: `<div><p>Client's Signature:__________________________________</p><p style="text-align: center;">Page 2/${pagelength}</p></div>`, // Any page number is working. 1-based index
    3: `<div><p>Client's Signature:__________________________________</p><p style="text-align: center;">Page 3/3</p></div>`, // Any page number is working. 1-based index
    default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
    last: '<span style="color: #444;">2</span>/<span>2</span>'
  }
},
      childProcessOptions: {
        env: {
          OPENSSL_CONF: "./dev/null",
        },
      },
    };

    pdf
      .create(filledHtml, options)
      .toFile(pdfFilePath, async (err, response) => {
        if (err) {
          console.error("Error generating PDF:", err);
          res.status(500).send("Error generating PDF");
        } else {
          try {
            setTimeout(() => {
              const mainBuffer = fs.readFileSync(pdfFilePath);
              sendMail2(
                ["nimesh@incscale.in", "bhagyesh@startupsahay.com", "kumarronak597@gmail.com"],
                `${newData["Company Name"]} | ${serviceNames} | ${newData.bookingDate}`,
                ``,
                `
                  <div class="container">

                    <p>Dear ${newData["Company Name"]},</p>
                    <p style="margin-top:20px;">We are thrilled to extend a warm welcome to Start-Up Sahay Private Limited as our esteemed client!</p>
                    <p>Following your discussion with ${bdNames}, we understand that you have opted for ${serviceNames} from Start-Up Sahay Private Limited. We are delighted to have you on board and are committed to providing you with exceptional service and support.</p>
                    <p>In the attachment, you will find important information related to the services you have selected, including your company details, chosen services, and payment terms and conditions. This document named Self-Declaration is designed to be printed on your company letterhead, and we kindly request that you sign and stamp the copy to confirm your agreement.</p>
                    <p>Please review this information carefully. If you notice any discrepancies or incorrect details, kindly inform us as soon as possible so that we can make the necessary corrections and expedite the process.</p>
                    <p style="display:${serviceNames == "Start-Up India Certificate"
                  ? "none"
                  : "block"
                }">To initiate the process of the services you have taken from us, we require some basic information about your business. This will help us develop the necessary documents for submission in the relevant scheme. Please fill out the form at <a href="https://startupsahay.com/basic-information/" class="btn" target="_blank">Basic Information Form</a>. Please ensure to upload the scanned copy of the signed and stamped <b> Self-Declaration </b> copy while filling out the basic information form.</p>
                    <p style="display:${serviceNames == "Start-Up India Certificate"
                  ? "none"
                  : "block"
                }">If you encounter any difficulties in filling out the form, please do not worry. Our backend admin executives will be happy to assist you over the phone to ensure a smooth process.</p>
                    <p >Your decision to choose Start-Up Sahay Private Limited is greatly appreciated, and we assure you that we will do everything possible to meet and exceed your expectations. If you have any questions or need assistance at any point, please feel free to reach out to us.</p>
                    <div class="signature">
                        <div>Best regards,</div>
                        <div>${mailName} – Relationship Manager</div>
                        <div> ${mailName === "Dhruvi Gohel" ? "+919016928702" : "+919998992601"}</div>
                        <div>Start-Up Sahay Private Limited</div>
                    </div>
                </div>
              `,
                mainBuffer
              );
            }, 4000);
          } catch (emailError) {
            console.error("Error sending email:", emailError);
            res.status(500).send("Error sending email with PDF attachment");
          }
        }
      });

    // Send success response
    res.status(201).send("Data sent");
  } catch (error) {
    console.error("Error creating/updating data:", error);
    res.status(500).send("Error creating/updating data"); // Send an error response
  }
});
// function generatePdf(htmlContent) {
//   return

//     pdf.create(htmlContent).toStream(function(err, stream){
//       stream.pipe(fs.createWriteStream('./foo.pdf'));
//     });

// }

function generatePdf(htmlContent) {
  if (!htmlContent) {
    console.error("Error: HTML content is required");
    return; // Exit the function if htmlContent is not provided
  } else {
    pdf
      .create(htmlContent, { format: "Letter" })
      .toFile("./foo5.pdf", function (err, res) {
        if (err) return console.log(err);
        console.log(res);
      });
  }
}
app.post(
  "/api/update-redesigned-final-form/:CompanyName",
  upload.fields([
    { name: "otherDocs", maxCount: 50 },
    { name: "paymentReceipt", maxCount: 1 },
  ]),
  async (req, res) => {
    // Assuming updatedBooking contains the updated data
    const companyName = req.params.CompanyName; // Get the _id from the request parameters
    const {
      _id,
      moreBookings,
      step4changed,
      otherDocs,
      paymentReceipt,
      remainingPayments,
      ...boom
    } = req.body;
    const newOtherDocs = req.files["otherDocs"] || [];
    const newPaymentReceipt = req.files["paymentReceipt"] || [];
    const updatedDocWithoutId = {
      ...boom,
      otherDocs: newOtherDocs,
      paymentReceipt: newPaymentReceipt,
      remainingPayments: []
    };
    const updatedDocs = {
      ...boom, remainingPayments: []
    }
    const goingToUpdate =
      step4changed === "true" ? updatedDocWithoutId : updatedDocs;

    try {
      // Find the document by _id and update it with the updatedBooking data

      const updatedDocument = await RedesignedLeadformModel.findOneAndUpdate(
        {
          "Company Name": companyName,
        },
        goingToUpdate,
        // Set all properties except "moreBookings"
        { new: true } // Return the updated document
      );

      if (!updatedDocument) {
        return res.status(404).json({ error: "Document not found" });
      }
      const deleteFormRequest = await EditableDraftModel.findOneAndDelete({
        "Company Name": companyName,
      });

      res
        .status(200)
        .json({ message: "Document updated successfully", updatedDocument });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
app.put(
  "/api/update-more-booking/:CompanyName/:bookingIndex",
  upload.fields([
    { name: "otherDocs", maxCount: 50 },
    { name: "paymentReceipt", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { CompanyName, bookingIndex } = req.params;
      const { otherDocs, paymentReceipt, step4changed, remainingPayments, ...newData } = req.body;

      const newOtherDocs = req.files["otherDocs"] || [];
      const newPaymentReceipt = req.files["paymentReceipt"] || [];
      const latestData = {
        ...newData,
        otherDocs: newOtherDocs,
        paymentReceipt: newPaymentReceipt,
      };

      const dataToSend = step4changed === "true" ? latestData : newData;
      // Find the document by companyName
      const existingDocument = await RedesignedLeadformModel.findOne({
        "Company Name": CompanyName,
      });
      const moreDocument = existingDocument.moreBookings[bookingIndex - 1];
      if (!existingDocument) {
        return res.status(404).json({ error: "Document not found" });
      }
      console.log("This is sending :", dataToSend, step4changed)
      // Update the booking in moreBookings array at the specified index
      const updatedDocument = step4changed === "true" ? await RedesignedLeadformModel.findOneAndUpdate(
        {
          "Company Name": CompanyName,
        },
        {
          [`moreBookings.${bookingIndex - 1}`]: {
            bdeName: newData.bdeName, bdmType: newData.bdmType, bdeEmail: newData.bdeEmail, bdmName: newData.bdmName, otherBdmName: newData.otherBdmName, bdmEmail: newData.bdmEmail, bookingDate: newData.bookingDate, bookingSource: newData.bookingSource, otherBookingSource: newData.otherBookingSource, numberOfServices: newData.numberOfServices, services: newData.services, caCase: newData.caCase, caNumber: newData.caNumber, caEmail: newData.caEmail, caCommission: newData.caCommission,
            paymentMethod: newData.paymentMethod, totalAmount: newData.totalAmount, receivedAmount: newData.receivedAmount, pendingAmount: newData.pendingAmount,
            generatedTotalAmount: newData.generatedTotalAmount, generatedReceivedAmount: newData.generatedReceivedAmount, Step1Status: newData.Step1Status, Step2Status: newData.Step2Status, Step3Status: newData.Step3Status, Step4Status: newData.Step4Status, Step5Status: newData.Step5Status, remainingPayments: [], otherDocs: newOtherDocs, paymentReceipt: newPaymentReceipt
          }
        }) : await RedesignedLeadformModel.findOneAndUpdate(
          {
            "Company Name": CompanyName,
          },
          {
            [`moreBookings.${bookingIndex - 1}`]: {
              bdeName: newData.bdeName, bdmType: newData.bdmType, bdeEmail: newData.bdeEmail, bdmName: newData.bdmName, otherBdmName: newData.otherBdmName, bdmEmail: newData.bdmEmail, bookingDate: newData.bookingDate, bookingSource: newData.bookingSource, otherBookingSource: newData.otherBookingSource, numberOfServices: newData.numberOfServices, services: newData.services, caCase: newData.caCase, caNumber: newData.caNumber, caEmail: newData.caEmail, caCommission: newData.caCommission,
              paymentMethod: newData.paymentMethod, totalAmount: newData.totalAmount, receivedAmount: newData.receivedAmount, pendingAmount: newData.pendingAmount,
              generatedTotalAmount: newData.generatedTotalAmount, generatedReceivedAmount: newData.generatedReceivedAmount, Step1Status: newData.Step1Status, Step2Status: newData.Step2Status, Step3Status: newData.Step3Status, Step4Status: newData.Step4Status, Step5Status: newData.Step5Status, remainingPayments: [], otherDocs: moreDocument.otherDocs, paymentReceipt: moreDocument.paymentReceipt
            }
          },
          // Set all properties except "moreBookings"
          { new: true } // Return the updated document
        );
      const deleteFormRequest = await EditableDraftModel.findOneAndDelete({
        "Company Name": CompanyName,
      });

      res.status(200).json(updatedDocument);
    } catch (error) {
      console.error("Error updating more booking:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);
app.delete(
  "/api/delete-redesigned-booking-request/:CompanyName",
  async (req, res) => {
    try {
      const companyName = req.params.CompanyName;
      const deleteFormRequest = await EditableDraftModel.findOneAndDelete({
        "Company Name": companyName,
      });
      res.status(200).json({ message: "Document updated successfully" });
    } catch {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

//  ------------------------------------------- Update more bookings Payment -------------------------------------------------------------------

app.post(
  "/api/redesigned-submit-morePayments/:CompanyName",
  upload.fields([
    { name: "otherDocs", maxCount: 50 },
    { name: "paymentReceipt", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const objectData = req.body;
      console.log("Object Data:", objectData);

      const newPaymentReceipt = req.files["paymentReceipt"] || [];
      const companyName = objectData["Company Name"];
      const bookingIndex = objectData.bookingIndex;

      const sendingObject = {
        serviceName: objectData.serviceName,
        remainingAmount: objectData.remainingAmount,
        paymentMethod: objectData.paymentMethod,
        extraRemarks: objectData.extraRemarks,
        totalPayment: objectData.pendingAmount,
        receivedPayment: objectData.receivedAmount,
        pendingPayment: objectData.remainingAmount,
        paymentReceipt: newPaymentReceipt,
        withGST: objectData.withGST,
        paymentDate: objectData.paymentDate
      };
      console.log("Sending Object:", sendingObject, bookingIndex);

      if (bookingIndex == 0) {
        console.log("Hi guyz");
        const findObject = await RedesignedLeadformModel.findOne({
          "Company Name": companyName,
        })
        const findService = findObject.services.find((obj) => obj.serviceName === objectData.serviceName)
        const newReceivedAmount = parseInt(findObject.receivedAmount) + parseInt(objectData.receivedAmount);
        const newPendingAmount = parseInt(findObject.pendingAmount) - parseInt(objectData.receivedAmount);
        const newGeneratedReceivedAmount = findService.withGST ? parseInt(findObject.generatedReceivedAmount) + parseInt(objectData.receivedAmount) / 1.18 : parseInt(findObject.generatedReceivedAmount) + parseInt(objectData.receivedAmount);


        console.log(newReceivedAmount, newPendingAmount)
        // Handle updating RedesignedLeadformModel for bookingIndex 0
        // Example code: Uncomment and replace with your logic
        await RedesignedLeadformModel.updateOne(
          { "Company Name": companyName },
          {
            $set: {
              receivedAmount: newReceivedAmount,
              pendingAmount: newPendingAmount,
              generatedReceivedAmount: newGeneratedReceivedAmount
            },
          }
        );

        // Push sendingObject into remainingPayments array
        const updatedObject = await RedesignedLeadformModel.findOneAndUpdate(
          { "Company Name": companyName },
          { $push: { remainingPayments: sendingObject } },
          { new: true }
        );

        return res.status(200).send("Successfully submitted more payments.");
      } else {
        const mainObject = await RedesignedLeadformModel.findOne({
          "Company Name": companyName,
        })
        const findObject = mainObject.moreBookings[bookingIndex - 1];
        const findService = findObject.services.find((obj) => obj.serviceName === objectData.serviceName)
        const newReceivedAmount = parseInt(findObject.receivedAmount) + parseInt(objectData.receivedAmount);
        const newPendingAmount = parseInt(findObject.pendingAmount) - parseInt(objectData.receivedAmount);
        const newGeneratedReceivedAmount = findService.withGST ? parseInt(findObject.generatedReceivedAmount) + parseInt(objectData.receivedAmount) / 1.18 : parseInt(findObject.generatedReceivedAmount) + parseInt(objectData.receivedAmount);
        findObject.remainingPayments.$push

        console.log(newReceivedAmount, newPendingAmount)
        // Handle updating RedesignedLeadformModel for bookingIndex 0
        // Example code: Uncomment and replace with your logic



        // Push sendingObject into remainingPayments array
        await RedesignedLeadformModel.updateOne(
          { "Company Name": companyName },
          {
            $set: {
              [`moreBookings.${bookingIndex - 1}.receivedAmount`]: newReceivedAmount,
              [`moreBookings.${bookingIndex - 1}.pendingAmount`]: newPendingAmount,
              [`moreBookings.${bookingIndex - 1}.generatedReceivedAmount`]: newGeneratedReceivedAmount
            }
          }
        );
        const updatedObject = await RedesignedLeadformModel.updateOne(
          { "Company Name": companyName },
          {
            $push: {
              [`moreBookings.${bookingIndex - 1}.remainingPayments`]: sendingObject,

            }
          },


        );


        return res.status(200).send("Successfully submitted more payments.");
      }
    } catch (error) {
      console.error("Error submitting more payments:", error);
      return res.status(500).send("Internal Server Error.");
    }
  }
);
app.post(
  "/api/redesigned-update-morePayments/:CompanyName",
  upload.fields([
    { name: "otherDocs", maxCount: 50 },
    { name: "paymentReceipt", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const objectData = req.body;
      console.log("Object Data:", objectData);

      const newPaymentReceipt = req.files["paymentReceipt"] || [];
      const companyName = objectData["Company Name"];
      const bookingIndex = objectData.bookingIndex;

      const sendingObject = {
        serviceName: objectData.serviceName,
        remainingAmount: objectData.remainingAmount,
        paymentMethod: objectData.paymentMethod,
        extraRemarks: objectData.extraRemarks,
        totalPayment: objectData.pendingAmount,
        receivedPayment: objectData.receivedAmount,
        pendingPayment: objectData.remainingAmount,
        paymentReceipt: newPaymentReceipt,
        withGST: objectData.withGST,
        paymentDate: objectData.paymentDate
      };
      console.log("Sending Object:", sendingObject, bookingIndex);

      if (bookingIndex == 0) {
        console.log("Hi guyz");
        const findObject = await RedesignedLeadformModel.findOne({
          "Company Name": companyName,
        });
        const paymentObject = findObject.remainingPayments[findObject.remainingPayments.length - 1];
        const newReceivedAmount = parseInt(findObject.receivedAmount) - parseInt(paymentObject.receivedPayment) + parseInt(sendingObject.receivedPayment);
        const newPendingAmount = parseInt(findObject.pendingAmount) + parseInt(paymentObject.receivedPayment) - parseInt(sendingObject.receivedPayment);
        const findService = findObject.services.find((obj) => obj.serviceName === objectData.serviceName);
        // const newReceivedAmount = parseInt(findObject.receivedAmount) + parseInt(objectData.receivedAmount);
        // const newPendingAmount = parseInt(findObject.pendingAmount) - parseInt(objectData.receivedAmount);

        const newGeneratedReceivedAmount = findService.withGST ? parseInt(findObject.generatedReceivedAmount) - parseInt(paymentObject.receivedPayment) / 1.18 + parseInt(objectData.receivedAmount) / 1.18 : parseInt(findObject.generatedReceivedAmount) - parseInt(paymentObject.receivedPayment) / 1.18 + parseInt(objectData.receivedAmount);


        console.log(newReceivedAmount, newPendingAmount)
        // Handle updating RedesignedLeadformModel for bookingIndex 0
        // Example code: Uncomment and replace with your logic

        findObject.remainingPayments[findObject.remainingPayments.length - 1] = sendingObject;
        const updateResult = await findObject.save();
        await RedesignedLeadformModel.updateOne(
          { "Company Name": companyName },
          {
            $set: {
              receivedAmount: newReceivedAmount,
              pendingAmount: newPendingAmount,
              generatedReceivedAmount: newGeneratedReceivedAmount,

            },
          }
        );

        // Push sendingObject into remainingPayments array
        // const updatedObject = await RedesignedLeadformModel.findOneAndUpdate(
        //   { "Company Name": companyName },
        //   { $push: { remainingPayments: sendingObject } },
        //   { new: true }
        // );

        return res.status(200).send("Successfully submitted more payments.");
      } else {
        console.log("Hi guyz");
        const mainObject = await RedesignedLeadformModel.findOne({
          "Company Name": companyName,
        })
        const findObject = mainObject.moreBookings[bookingIndex - 1];
        const paymentObject = findObject.remainingPayments[findObject.remainingPayments.length - 1];
        const newReceivedAmount = parseInt(findObject.receivedAmount) - parseInt(paymentObject.receivedPayment) + parseInt(sendingObject.receivedPayment);
        const newPendingAmount = parseInt(findObject.pendingAmount) + parseInt(paymentObject.receivedPayment) - parseInt(sendingObject.receivedPayment);
        const findService = findObject.services.find((obj) => obj.serviceName === objectData.serviceName);
        // const newReceivedAmount = parseInt(findObject.receivedAmount) + parseInt(objectData.receivedAmount);
        // const newPendingAmount = parseInt(findObject.pendingAmount) - parseInt(objectData.receivedAmount);

        const newGeneratedReceivedAmount = findService.withGST ? parseInt(findObject.generatedReceivedAmount) - parseInt(paymentObject.receivedPayment) / 1.18 + parseInt(objectData.receivedAmount) / 1.18 : parseInt(findObject.generatedReceivedAmount) - parseInt(paymentObject.receivedPayment) + parseInt(objectData.receivedAmount);


        console.log(newReceivedAmount, newPendingAmount)
        // Handle updating RedesignedLeadformModel for bookingIndex 0
        // Example code: Uncomment and replace with your logic

        // findObject.remainingPayments[findObject.remainingPayments.length-1] = sendingObject;


        const updateResult = await findObject.save();
        await RedesignedLeadformModel.updateOne(
          { "Company Name": companyName },
          {
            $set: {
              [`moreBookings.${bookingIndex - 1}.receivedAmount`]: newReceivedAmount,
              [`moreBookings.${bookingIndex - 1}.pendingAmount`]: newPendingAmount,
              [`moreBookings.${bookingIndex - 1}.generatedReceivedAmount`]: newGeneratedReceivedAmount,
              [`moreBookings.${bookingIndex - 1}.remainingPayments.${findObject.remainingPayments.length - 1}`]: sendingObject
            }
          }
        );

        // Push sendingObject into remainingPayments array
        // const updatedObject = await RedesignedLeadformModel.findOneAndUpdate(
        //   { "Company Name": companyName },
        //   { $push: { remainingPayments: sendingObject } },
        //   { new: true }
        // );

        return res.status(200).send("Successfully submitted more payments.");
      }
    } catch (error) {
      console.error("Error submitting more payments:", error);
      return res.status(500).send("Internal Server Error.");
    }
  }
);
app.post('/api/redesigned-submit-expanse/:CompanyName', async (req, res) => {
  const data = req.body;
  const companyName = req.params.CompanyName;
  const bookingIndex = data.bookingIndex; // Assuming the bookingIndex is in the request body
  const mainObject = await RedesignedLeadformModel.findOne({ "Company Name": companyName });
  const serviceID = data.serviceID


  if (!mainObject) {
    return res.status(404).json({ error: "Company not found" });
  }

  if (bookingIndex === 0) {

    const findServices = mainObject.services
    const serviceObject = findServices.filter(service => (service._id).toString() === serviceID)[0];



    if (!serviceObject) {
      return res.status(404).json({ error: "Service not found" });
    }

    // Update the serviceObject with new expanse amount
    const expanse = data.expanseAmount
    const updatedServiceObject = {
      serviceName: serviceObject.serviceName, // Spread operator to copy all properties from serviceObject
      totalPaymentWOGST: serviceObject.totalPaymentWOGST, // Spread operator to copy all properties from serviceObject
      totalPaymentWGST: serviceObject.totalPaymentWGST, // Spread operator to copy all properties from serviceObject
      withGST: serviceObject.withGST, // Spread operator to copy all properties from serviceObject
      withDSC: serviceObject.withDSC, // Spread operator to copy all properties from serviceObject
      paymentTerms: serviceObject.paymentTerms, // Spread operator to copy all properties from serviceObject
      firstPayment: serviceObject.firstPayment, // Spread operator to copy all properties from serviceObject
      secondPayment: serviceObject.secondPayment, // Spread operator to copy all properties from serviceObject
      thirdPayment: serviceObject.thirdPayment, // Spread operator to copy all properties from serviceObject
      fourthPayment: serviceObject.fourthPayment, // Spread operator to copy all properties from serviceObject
      secondPaymentRemarks: serviceObject.secondPaymentRemarks, // Spread operator to copy all properties from serviceObject
      thirdPaymentRemarks: serviceObject.thirdPaymentRemarks, // Spread operator to copy all properties from serviceObject
      fourthPaymentRemarks: serviceObject.fourthPaymentRemarks, // Spread operator to copy all properties from serviceObject
      paymentRemarks: serviceObject.paymentRemarks,
      _id: serviceObject._id,// Spread operator to copy all properties from serviceObject
      expanse: parseInt(expanse) // Update the expanse property with the value of the expanse variable
    };

    // Update the services array in mainObject with the updated serviceObject
    const updatedServices = mainObject.services.map(service => {
      if (service._id == serviceID) {
        return updatedServiceObject;
      }
      return service;
    });

    // Update the mainObject with the updated services array
    const updatedMainObject = await RedesignedLeadformModel.findOneAndUpdate(
      { "Company Name": companyName },
      { services: updatedServices },
      { new: true } // Return the updated document
    );

    res.status(200).json(updatedMainObject);
  } else {
    const moreObject = mainObject.moreBookings[bookingIndex - 1];
    const findServices = moreObject.services
    const serviceObject = findServices.filter(service => (service._id).toString() === serviceID)[0];

    if (!serviceObject) {
      return res.status(404).json({ error: "Service not found" });
    }

    // Update the serviceObject with new expanse amount
    const expanse = data.expanseAmount
    const updatedServiceObject = {
      serviceName: serviceObject.serviceName, // Spread operator to copy all properties from serviceObject
      totalPaymentWOGST: serviceObject.totalPaymentWOGST, // Spread operator to copy all properties from serviceObject
      totalPaymentWGST: serviceObject.totalPaymentWGST, // Spread operator to copy all properties from serviceObject
      withGST: serviceObject.withGST, // Spread operator to copy all properties from serviceObject
      withDSC: serviceObject.withDSC, // Spread operator to copy all properties from serviceObject
      paymentTerms: serviceObject.paymentTerms, // Spread operator to copy all properties from serviceObject
      firstPayment: serviceObject.firstPayment, // Spread operator to copy all properties from serviceObject
      secondPayment: serviceObject.secondPayment, // Spread operator to copy all properties from serviceObject
      thirdPayment: serviceObject.thirdPayment, // Spread operator to copy all properties from serviceObject
      fourthPayment: serviceObject.fourthPayment, // Spread operator to copy all properties from serviceObject
      secondPaymentRemarks: serviceObject.secondPaymentRemarks, // Spread operator to copy all properties from serviceObject
      thirdPaymentRemarks: serviceObject.thirdPaymentRemarks, // Spread operator to copy all properties from serviceObject
      fourthPaymentRemarks: serviceObject.fourthPaymentRemarks, // Spread operator to copy all properties from serviceObject
      paymentRemarks: serviceObject.paymentRemarks,
      _id: serviceObject._id,// Spread operator to copy all properties from serviceObject
      expanse: parseInt(expanse) // Update the expanse property with the value of the expanse variable
    };
    console.log(updatedServiceObject);
    // Update the services array in mainObject with the updated serviceObject
    const updatedServices = moreObject.services.map(service => {
      if (service._id == serviceID) {
        return updatedServiceObject;
      }
      return service;
    });

    // Update the mainObject with the updated services array
    const updatedMainObj = await RedesignedLeadformModel.updateOne(
      { "Company Name": companyName },
      {
        $set: {
          [`moreBookings.${bookingIndex - 1}.services`]: updatedServices,

        }
      }
    );

    res.status(200).json(updatedMainObj);
  }
});



app.delete('/api/redesigned-delete-morePayments/:companyName/:bookingIndex/:serviceName', async (req, res) => {
  const companyName = req.params.companyName;

  const bookingIndex = req.params.bookingIndex;
  const serviceName = req.params.serviceName;
  console.log("bookingIndex", bookingIndex)

  const findCompany = await RedesignedLeadformModel.findOne({ "Company Name": companyName });
  if (bookingIndex == 0) {
    try {
      console.log("bhoom")
      const newCompany = findCompany;
      const tempObject = newCompany.remainingPayments.filter(rmpayments => rmpayments.serviceName === serviceName);
      const remainingObject = tempObject[tempObject.length - 1];

      const newReceivedAmount = parseInt(newCompany.receivedAmount) - parseInt(remainingObject.receivedPayment);
      const newPendingAmount = parseInt(newCompany.pendingAmount) + parseInt(remainingObject.receivedPayment);
      const findService = newCompany.services.find((obj) => obj.serviceName === remainingObject.serviceName);
      const newGeneratedReceivedAmount = findService.withGST ? parseInt(newCompany.generatedReceivedAmount) - parseInt(remainingObject.receivedPayment) / 1.18 : parseInt(newCompany.generatedReceivedAmount) - parseInt(remainingObject.receivedPayment);
      console.log("this is the required object", newGeneratedReceivedAmount);
      const newRemainingArray = newCompany.remainingPayments.filter(boom => boom._id !== remainingObject._id);
      console.log("This will be the object ", newRemainingArray)

      // findCompany.moreBookings[bookingIndex - 1].remainingPayments.pop(); // Delete the last object from remainingPayments array
      // const updateResult = await findCompany.save();

      const newUpdatedArray = await RedesignedLeadformModel.findOneAndUpdate({ "Company Name": companyName }, {
        $set: {
          receivedAmount: newReceivedAmount,
          pendingAmount: newPendingAmount,
          generatedReceivedAmount: newGeneratedReceivedAmount,
          remainingPayments: newRemainingArray,
        }
      })

      return res.status(200).send("Successfully deleted last payment.");
    } catch (error) {
      console.error("Error deleting more payments:", error);
      return res.status(500).send("Internal Server Error.");
    }

  } else {
    try {

      const newCompany = findCompany.moreBookings[bookingIndex - 1];
      const tempObject = newCompany.remainingPayments.filter(rmpayments => rmpayments.serviceName === serviceName);
      const remainingObject = tempObject[tempObject.length - 1];


      const newReceivedAmount = parseInt(newCompany.receivedAmount) - parseInt(remainingObject.receivedPayment);
      const newPendingAmount = parseInt(newCompany.pendingAmount) + parseInt(remainingObject.receivedPayment);

      const findService = newCompany.services.find((obj) => obj.serviceName === remainingObject.serviceName);
      const newGeneratedReceivedAmount = findService.withGST ? parseInt(newCompany.generatedReceivedAmount) - parseInt(remainingObject.receivedPayment) / 1.18 : parseInt(newCompany.generatedReceivedAmount) - parseInt(remainingObject.receivedPayment);
      console.log("this is the required object", newGeneratedReceivedAmount);
      const newRemainingArray = newCompany.remainingPayments.filter(boom => boom._id !== remainingObject._id);
      console.log("This will be the object ", newRemainingArray)

      // findCompany.moreBookings[bookingIndex - 1].remainingPayments.pop(); // Delete the last object from remainingPayments array
      // const updateResult = await findCompany.save();

      const newUpdatedArray = await RedesignedLeadformModel.findOneAndUpdate({ "Company Name": companyName }, {
        $set: {
          [`moreBookings.${bookingIndex - 1}.receivedAmount`]: newReceivedAmount,
          [`moreBookings.${bookingIndex - 1}.pendingAmount`]: newPendingAmount,
          [`moreBookings.${bookingIndex - 1}.generatedReceivedAmount`]: newGeneratedReceivedAmount,
          [`moreBookings.${bookingIndex - 1}.remainingPayments`]: newRemainingArray,
        }
      })

      return res.status(200).send("Successfully deleted last payment.");
    } catch (error) {
      console.error("Error deleting more payments:", error);
      return res.status(500).send("Internal Server Error.");
    }
  }
})

app.get("/api/generate-pdf", async (req, res) => {
  const clientName = "Miya bhai";
  const clientAddress = "Ohio";
  const senderName = "Chaganlal";
  let count = 1;
  try {

    const newData = {
      "_id": "6639e5c70fd94d7cf1b77faf",
      "company": "662b34c407c516eaf61c6740",
      "Company Name": "AMBUJA CEMENT SOLUTIONS PRIVATE LIMITED",
      "Company Number": 9962159051,
      "Company Email": "abc@gmail.com",
      "panNumber": "cgvb",
      "gstNumber": "",
      "incoDate": "2023-07-31T00:00:00.000Z",
      "bdeName": "Aakash",
      "bdmName": "Aakash",
      "bdeEmail": "bhagyesh@startupsahay.com",
      "bdmType": "Close-by",
      "bdmEmail": "bhagyesh@startupsahay.com",
      "bookingDate": "2024-05-07",
      "bookingSource": "Reference",
      "numberOfServices": 2,
      "services": [
          {
              "serviceName": "Start-Up India Certificate",
              "totalPaymentWOGST": 20000,
              "totalPaymentWGST": 23600,
              "withGST": true,
              "withDSC": true,
              "paymentTerms": "two-part",
              "firstPayment": 10000,
              "secondPayment": 10000,
              "thirdPayment": 1800,
              "fourthPayment": 1800,
              "secondPaymentRemarks": "After Application",
              "thirdPaymentRemarks": "",
              "fourthPaymentRemarks": "",
              "paymentRemarks": "",
              "expanse": 100,
              "_id": "663a121cf012a01385573381"
          },
          {
              "serviceName": "ISO Certificate",
              "totalPaymentWOGST": 20000,
              "totalPaymentWGST": 23600,
              "withGST": true,
              "withDSC": true,
              "paymentTerms": "two-part",
              "firstPayment": 10000,
              "secondPayment": 10000,
              "thirdPayment": 1800,
              "fourthPayment": 1800,
              "secondPaymentRemarks": "After Application",
              "thirdPaymentRemarks": "",
              "fourthPaymentRemarks": "",
              "paymentRemarks": "",
              "expanse": 100,
              "_id": "663a121cf012a01385573381"
          }
      ],
      "caCase": "No",
      "paymentMethod": "PayU",
      "paymentReceipt": [],
      "otherDocs": [],
      "extraNotes": "test",
      "totalAmount": 25960,
      "receivedAmount": 11000,
      "pendingAmount": 14960,
      "__v": 0,
      "moreBookings": [],
      "remainingPayments": [],
      "generatedReceivedAmount": 9322.033898305084,
      "generatedTotalAmount": 22000
  }
  
  const totalAmount = newData.services.reduce(
    (acc, curr) => acc + parseInt(curr.totalPaymentWGST),
    0
  );
  const receivedAmount = newData.services.reduce((acc, curr) => {
    return curr.paymentTerms === "Full Advanced"
      ? acc + parseInt(curr.totalPaymentWGST)
      : acc + parseInt(curr.firstPayment);
  }, 0);
  const pendingAmount = totalAmount - receivedAmount;
    const renderServiceList = () => {
      let servicesHtml = "";
      for (let i = 0; i < newData.services.length; i++) {
        servicesHtml += `
        <span>Service ${i + 1}: ${newData.services[i].serviceName}</span>,  
        `;
      }
      return servicesHtml;
    };
    const renderPaymentDetails = () => {
      let servicesHtml = "";
      let paymentServices = "";
      const serviceLength = newData.services.length > 2 ? 2 : newData.services.length
      for (let i = 0; i < serviceLength; i++) {
        const Amount =
          newData.services[i].paymentTerms === "Full Advanced"
            ? newData.services[i].totalPaymentWGST
            : newData.services[i].firstPayment;
        let rowSpan;

        if (newData.services[i].paymentTerms === "two-part") {
          if (
            newData.services[i].thirdPayment !== 0 &&
            newData.services[i].fourthPayment === 0
          ) {
            rowSpan = 2;
          } else if (newData.services[i].fourthPayment !== 0) {
            rowSpan = 3;
          }
        } else {
          rowSpan = 1;
        }

        if (rowSpan === 3) {
          paymentServices = `
        <tr>
          <td style="border-right:1px solid #ddd">₹${parseInt(newData.services[i].secondPayment).toLocaleString()}/-</td>
          <td>${newData.services[i].secondPaymentRemarks}</td>
        </tr>
        <tr>
         <td style="border-right:1px solid #ddd">₹${parseInt(newData.services[i].thirdPayment).toLocaleString()}/-</td>
         <td>${newData.services[i].thirdPaymentRemarks}</td>
        </tr>
        <tr>
         <td style="border-right:1px solid #ddd">₹${parseInt(newData.services[i].fourthPayment).toLocaleString()}/-</td>
         <td>${newData.services[i].fourthPaymentRemarks}</td>
        </tr>
        `;
        } else if (rowSpan === 2) {
          paymentServices = `
        <tr>
          <td style="border-right:1px solid #ddd">₹${parseInt(newData.services[i].secondPayment).toLocaleString()}/-</td>
          <td >${newData.services[i].secondPaymentRemarks}</td>
        </tr>
        <tr>
          <td style="border-right:1px solid #ddd">₹${parseInt(newData.services[i].thirdPayment).toLocaleString()}/-</td>
          <td >${newData.services[i].thirdPaymentRemarks}</td>
        </tr>
        `;
        } else {
          paymentServices = `
        <tr>
          <td >₹${parseInt(newData.services[i].secondPayment).toLocaleString()}/-</td>
          <td>${
            newData.services[i].paymentTerms !== "Full Advanced"
              ? newData.services[i].secondPaymentRemarks
              : "100% Advance Payment"
          }</td>
        </tr>
        `;
        }
        servicesHtml += `
        <table class="table table-bordered">
            <thead>
              <td colspan="4">Service Name : ${
                newData.services[i].serviceName
              }</td>
            </thead>
            <tbody>
            <tr>
              <td>Total Payment</td>
              <td>Advanced Payment</td>
              <td>Advanced Payment</td>
              <td>Pending payment</td>
              <td>Remarks</td>
            </tr>
            <tr>
                  <th rowspan='4'>₹ ${newData.services[i].totalPaymentWGST
            } /-</th>
                  <th rowspan='4'>₹ ${newData.services[i].paymentTerms === "Full Advanced"
              ? parseInt(
                newData.services[i].totalPaymentWGST
              ).toLocaleString()
              : parseInt(newData.services[i].firstPayment).toLocaleString()
            }/-</th>
            </tr>
            ${paymentServices}
          </tbody>
        </table>
        `;
      }
      return servicesHtml;
    };
  
    const renderMorePaymentDetails = () => {
      let servicesHtml = "";
      let paymentServices = "";
     
      for (let i = 2; i < newData.services.length; i++) {
        const Amount =
          newData.services[i].paymentTerms === "Full Advanced"
            ? newData.services[i].totalPaymentWGST
            : newData.services[i].firstPayment;
        let rowSpan;

        if (newData.services[i].paymentTerms === "two-part") {
          if (
            newData.services[i].thirdPayment !== 0 &&
            newData.services[i].fourthPayment === 0
          ) {
            rowSpan = 2;
          } else if (newData.services[i].fourthPayment !== 0) {
            rowSpan = 3;
          }
        } else {
          rowSpan = 1;
        }

        if (rowSpan === 3) {
          paymentServices = `
        <tr>
          <td>₹${parseInt(newData.services[i].secondPayment).toLocaleString()}/-</td>
          <td>${newData.services[i].secondPaymentRemarks}</td>
        </tr>
        <tr>
         <td>₹${parseInt(newData.services[i].thirdPayment).toLocaleString()}/-</td>
         <td>${newData.services[i].thirdPaymentRemarks}</td>
        </tr>
        <tr>
         <td>₹${parseInt(newData.services[i].fourthPayment).toLocaleString()}/-</td>
         <td>${newData.services[i].fourthPaymentRemarks}</td>
        </tr>
        `;
        } else if (rowSpan === 2) {
          paymentServices = `
        <tr>
          <td>₹${parseInt(newData.services[i].secondPayment).toLocaleString()}/-</td>
          <td>${newData.services[i].secondPaymentRemarks}</td>
        </tr>
        <tr>
          <td>₹${parseInt(newData.services[i].thirdPayment).toLocaleString()}/-</td>
          <td>${newData.services[i].thirdPaymentRemarks}</td>
        </tr>
        `;
        } else {
          paymentServices = `
        <tr>
          <td>₹${parseInt(newData.services[i].secondPayment).toLocaleString()}/-</td>
          <td>${
            newData.services[i].paymentTerms !== "Full Advanced"
              ? newData.services[i].secondPaymentRemarks
              : "100% Advance Payment"
          }</td>
        </tr>
        `;
        }
        
        servicesHtml += `
        <table class="table table-bordered" style="margin-top:0px">
            <thead>
              <td colspan="4">Service Name : ${
                newData.services[i].serviceName
              }</td>
            </thead>
            <tbody>
              <tr>
                <td>Total Payment</td>
                <td>Advanced Payment</td>
                <td>Pending payment</td>
                <td>Remarks</td>
              </tr>
              <tr>
                    <td rowspan='4'>₹ ${
                     parseInt( newData.services[i].totalPaymentWGST).toLocaleString()
                    } /-</td>
                    <td rowspan='4'>₹ ${
                      newData.services[i].paymentTerms === "Full Advanced"
                        ? parseInt(newData.services[i].totalPaymentWGST).toLocaleString()
                        : parseInt(newData.services[i].firstPayment).toLocaleString()
                    }/-</td>
              
                  ${paymentServices}
              </tr>
            </tbody>
        </table>
        `;
      }
      return servicesHtml;
    };
    const allowedServiceNames = [
      "Seed Funding Support",
      "Angel Funding Support",
      "VC Funding Support",
      "Crowd Funding Support",
      "I-Create",
      "Nidhi Seed Support Scheme",
      "Nidhi Prayash Yojna",
      "NAIF",
      "Raftaar",
      "CSR Funding",
      "Stand-Up India",
      "PMEGP",
      "USAID",
      "UP Grant",
      "DBS Grant",
      "MSME Innovation",
      "MSME Hackathon",
      "Gujarat Grant",
      "CGTMSC",
      "Mudra Loan",
      "SIDBI Loan",
      "Incubation Support",
    ];
    const AuthorizedName = newData.services.some((service) => {
      const tempServices = [...allowedServiceNames, "Income Tax Exemption"];
      return tempServices.includes(service);
    })
      ? "Shubhi Banthiya"
      : "Dhruvi Gohel";

    console.log(newData.services);
    const newPageDisplay = newData.services.some((service) => {
      const tempServices = [
        ...allowedServiceNames,
        "Income Tax Exemption",
        "Start-Up India Certificate",
      ];
      return tempServices.includes(service.serviceName);
    })
      ? 'style="display:block'
      : 'style="display:none';

    console.log(newPageDisplay);
  
  

    const renderServiceKawali = () => {
      let servicesHtml = "";
      let fundingServices = "";
      let fundingServicesArray = "";
      let incomeTaxServices = "";

      for (let i = 0; i < newData.services.length; i++) {
        if (
          newData.services[i].serviceName === "Start-Up India Certificate"
        ) {
          servicesHtml = `
          <p class="Declaration_text_head mt-2">
          <b>
            Start-Up India Certification Acknowledgement:
          </b>
        </p>
        <p class="Declaration_text_data">
          I, Director of ${newData["Company Name"]} , acknowledge that START-UP
          SAHAY PRIVATE LIMITED is assisting me in obtaining the Start-up India certificate by providing
          consultancy services. These services involve preparing necessary documents and content for
          the application, utilizing their infrastructure, experience, manpower, and expertise. I

          understand that START-UP SAHAY charges a fee for these services. I am aware that the Start-
          up India certificate is issued free of charge by the government, and I have not been charged

          for its issuance. START-UP SAHAY PRIVATE LIMITED has not misled me regarding this matter.
        </p>
        
        `;
        } else if (
          allowedServiceNames.includes(newData.services[i].serviceName)
        ) {
          fundingServicesArray += `${newData.services[i].serviceName},`;
          fundingServices = `
          <p class="Declaration_text_head mt-2">
          <b>
          ${newData.services[i].serviceName}  Acknowledgement:   
          </b>
        </p>
        <p class="Declaration_text_data">
        I, Director of ${newData["Company Name"]}, engage START-UP SAHAY PRIVATE LIMITED for ${newData.services[i].serviceName}. They'll provide document creation and Application support, utilizing their resources and expertise. I understand there's a fee for their services, not as government fees, Approval of the application is up to the Concerned authorities. START-UP SAHAY PRIVATE LIMITED has not assured me of application approval.
        </p>
        
        `;
        } else if (
          newData.services[i].serviceName === "Income Tax Exemption"
        ) {
          incomeTaxServices = `
          <p class="Declaration_text_head mt-2">
          <b>
          Income Tax Exemption Services Acknowledgement:   
          </b>
        </p>
        <p class="Declaration_text_data">
        I, Director of ${newData["Company Name"]}, acknowledge that START-UP SAHAY PRIVATE LIMITED is assisting me in obtaining the Certificate of Eligibility for the 3-year tax exemption under the 80IAC Income Tax Act. These services involve preparing necessary documents and content for the application, utilizing their infrastructure, experience, manpower, and expertise. I understand there's a fee for their services, not as government fees. START-UP SAHAY PRIVATE LIMITED has provided accurate information regarding the approval process. The decision regarding the application approval rests with the concerned authorities.
        </p>
      `;
        } else {
          servicesHtml += `
      <br>
      `;
        }
      }

      if (fundingServicesArray !== "") {
        servicesHtml += `
        <p class="Declaration_text_head mt-2">
        <b>
        ${fundingServicesArray} Acknowledgement:    
        </b>
      </p>
      <p class="Declaration_text_data">
      I, Director of ${newData["Company Name"]}, engage START-UP SAHAY PRIVATE LIMITED for ${fundingServicesArray}. They'll provide document creation and Application support, utilizing their resources and expertise. I understand there's a fee for their services, not as government fees, Approval of the application is up to the concerned department/authorities. START-UP SAHAY PRIVATE LIMITED has not assured me of application approval.
      </p>
    `;
      } else if (incomeTaxServices !== "") {
        servicesHtml += `
        <p class="Declaration_text_head mt-2">
        <b>
        Income Tax Exemption Services Acknowledgement:     
        </b>
      </p>
      <p class="Declaration_text_data">
      I, Director of ${newData["Company Name"]}, acknowledge that START-UP SAHAY PRIVATE LIMITED is assisting me in obtaining the Certificate of Eligibility for the 3-year tax exemption under the 80IAC Income Tax Act. These services involve preparing necessary documents and content for the application, utilizing their infrastructure, experience, manpower, and expertise. I understand there's a fee for their services, not as government fees. START-UP SAHAY PRIVATE LIMITED has provided accurate information regarding the approval process. The decision regarding the application approval rests with the concerned authorities.
      </p>
  `;
      }
      return servicesHtml;
    };
const conditional = newData.services.length < 2 ?  `<div class="Declaration_text">
<p class="Declaration_text_data">
  I confirm that the outlined payment details and terms accurately represent the agreed-upon arrangements between ${newData["Company Name"]} and START-UP SAHAY PRIVATE LIMITED. The charges are solely for specified services, and no additional services will be provided without separate payment, even in the case of rejection.
</p>
</div>` : "";
    const serviceKawali = renderServiceKawali();
    const currentDate = new Date();

    const dateOptions = { day: "numeric", month: "long", year: "numeric" };
    const todaysDate = currentDate.toLocaleDateString("en-US", dateOptions);
    const mainPageHtml = `
    <div class="PDF_main">
    <section>
      <div class="date_div">
        <p>${todaysDate}</p>
      </div>
      <div class="pdf_heading">
        <h3>Self Declaration</h3>
      </div>
      <div class="Declaration_text">
        ${serviceKawali}
        <p class="Declaration_text_data">
          I, understands that because of government regulations and portal, I have no objections if the
          process takes longer than initially committed, knowing it's just how government schemes
          related process works.
        </p>
        <p class="Declaration_text_data">
          I, authorize START-UP SAHAY PRIVATE LIMITED to submit the Start-up India certificate
          application if required on my behalf, as I am not familiar with the process.
        </p>
      </div>
      
      
    </section>
  
  </div>
      `;
const totalPaymentHtml = newData.services.length <2 ? ` <div class="table-data">
<table class="table table-bordered">
  <thead>
    <th colspan="3">Total Payment Details</th>
  </thead>
  <tbody>
    <tr>
      <td>Total Payment</td>
      <td>Advanced Payment</td>
      <td>Pending Payment</td>
    </tr>
    <tr>
      <td>₹ ${parseInt(totalAmount).toLocaleString()}/-</td>
      <td>₹ ${parseInt(receivedAmount).toLocaleString()}/-</td>
      <td>₹ ${parseInt(pendingAmount).toLocaleString()}/-</td>
    </tr>
  </tbody>
</table>
</div>` : ""
    const mainPage =
      newPageDisplay === 'style="display:block' ? mainPageHtml : "";
    const bdNames =
      newData.bdeName == newData.bdmName
        ? newData.bdeName
        : `${newData.bdeName} && ${newData.bdmName}`;
    const waitpagination =
      newPageDisplay === 'style="display:block' ? "Page 2/2" : "Page 1/1";
      const pagination = newData.services.length > 1 ? "Page 2/3" : waitpagination
    // Render services HTML content
    const serviceList = renderServiceList();
    const paymentDetails = renderPaymentDetails();
    const morePaymentDetails = renderMorePaymentDetails();
    const thirdPage = newData.services.length > 1 ? ` <div class="PDF_main" style="margin:0px">
    <section>
      ${morePaymentDetails}
       <div class="table-data">
<table class="table table-bordered">
  <thead>
    <th colspan="3">Total Payment Details</th>
  </thead>
  <tbody>
    <tr>
      <td>Total Payment</td>
      <td>Advanced Payment</td>
      <td>Pending Payment</td>
    </tr>
    <tr> 
      <td>₹ ${parseInt(totalAmount).toLocaleString()}/-</td>
      <td>₹ ${parseInt(receivedAmount).toLocaleString()}/-</td>
      <td>₹ ${parseInt(pendingAmount).toLocaleString()}/-</td>
    </tr>
  </tbody>
</table>
</div>
      <div class="Declaration_text">
        <p class="Declaration_text_data">
          I confirm that the outlined payment details and terms accurately represent the agreed-upon arrangements between ${newData["Company Name"]} and START-UP SAHAY PRIVATE LIMITED. The charges are solely for specified services, and no additional services will be provided without separate payment, even in the case of rejection.
        </p>
      </div>
     

    </section>
  </div>` : "";

    // const htmlTemplate = fs.readFileSync("./helpers/template.html", "utf-8");
    const servicesShubhi = [
      "Pitch Deck Development ",
      "Financial Modeling",
      "DPR Development",
      "CMA Report Development",
      "Company Profile Write-Up",
      "Company Brochure",
      "Product Catalog",
      "Logo Design",
      "Business Card Design",
      "Letter Head Design",
      "Broucher Design",
      "Business Profile",
      "Seed Funding Support",
      "Angel Funding Support",
      "VC Funding Support",
      "Crowd Funding Support",
      "I-Create",
      "Nidhi Seed Support Scheme  ",
      "Nidhi Prayash Yojna",
      "NAIF",
      "Raftaar",
      "CSR Funding",
      "Stand-Up India",
      "PMEGP",
      "USAID",
      "UP Grant",
      "DBS Grant",
      "MSME Innovation",
      "MSME Hackathon",
      "Gujarat Grant",
      "CGTMSC",
      "Income Tax Exemption",
      "Mudra Loan",
      "SIDBI Loan",
      "Incubation Support",
      "Digital Marketing",
      "SEO Services",
      "Branding Services",
      "Social Promotion Management",
      "Email Marketing",
      "Digital Content",
      "Lead Generation",
      "Whatsapp Marketing",
      "Website Development",
      "App Design & Development",
      "Web Application Development",
      "Software Development",
      "CRM Development",
      "ERP Development",
      "E-Commerce Website",
      "Product Development"
    ];
    const mailName = newData.services.some((service) => {
      return servicesShubhi.includes(service.serviceName);
    })
      ? "Shubhi Banthiya"
      : "Dhruvi Gohel";

      const AuthorizedEmail =
      mailName === "Dhruvi Gohel"
        ? "dhruvi@startupsahay.com"
        : "rm@startupsahay.com";
        const AuthorizedNumber =
        mailName === "Dhruvi Gohel" ? "+919016928702" : "+919998992601";
    
    const htmlNewTemplate = fs.readFileSync("./helpers/demo.html", "utf-8");
    const filledHtml = htmlNewTemplate
      .replace("{{Company Name}}", newData["Company Name"])
      .replace("{{Company Name}}", newData["Company Name"])
      .replace("{{Company Name}}", newData["Company Name"])
      .replace("{{Company Name}}", newData["Company Name"])
      .replace("{{Company Name}}", newData["Company Name"])
      .replace("{{Services}}", serviceList)
      .replace("{{page-display}}", newPageDisplay)
      .replace("{{pagination}}", pagination)
      .replace("{{Authorized-Person}}", mailName)
      .replace("{{Authorized-Number}}", AuthorizedNumber)
      .replace("{{Authorized-Email}}", AuthorizedEmail)
      .replace("{{Main-page}}", mainPage)
      .replace("{{Total-Payment}}", totalPaymentHtml)
      .replace("{{Service-Details}}", paymentDetails)
      .replace("{{Third-Page}}", thirdPage)
      .replace("{{Company Number}}", newData["Company Number"])
      .replace("{{Conditional}}", conditional);

      let currentPage = 1; // Initialize current page number

    
      
      const options = {
        format: "A4", // Set the page format to A4 size
        orientation: "portrait", // Set the page orientation to portrait (or landscape if needed)
        border: "10mm", // Set the page border size (e.g., 10mm)
        header: {
          height: "55px",
          contents: ``, // Customize the header content
        },
        paginationOffset: 1,       // Override the initial pagination number
  "footer": {
    "height": "100px",
    "contents": {
      first: `<div><p>Client's Signature:__________________________________</p><p style="text-align: center;">Page 1/${newData.services.length > 1 ? "3" : "2"}</p></div>`,
      2: `<div><p>Client's Signature:__________________________________</p><p style="text-align: center;">Page 2/${newData.services.length > 1 ? "3" : "2"}</p></div>`, // Any page number is working. 1-based index
      3: `<div><p>Client's Signature:__________________________________</p><p style="text-align: center;">Page 3/3</p></div>`, // Any page number is working. 1-based index
      default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
      last: '<span style="color: #444;">2</span>/<span>2</span>'
    }
  },
        childProcessOptions: {
          env: {
            OPENSSL_CONF: "./dev/null",
          },
        },
      };
      
      const pdfFilePath = `./test1.pdf`;
      
      pdf.create(filledHtml, options).toFile(pdfFilePath, async (err, response) => {
        if (err) {
          console.error("Error generating PDF:", err);
          res.status(500).send("Error generating PDF");
        } else {
          try {
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
              "Content-Disposition",
              "attachment; filename=generated_document.pdf"
            );
            res.send(response); // Send the PDF file
          } catch (emailError) {
            console.error("Error sending email:", emailError);
            res
              .status(500)
              .send("Error sending email with PDF attachment");
          }
        }
      });
      
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error generating PDF");
  }
});

http.listen(3001, function () {
  console.log("Server started...");

  socketIO.on("connection", function (socket) {
    console.log("User connected: " + socket.id);
    socketIO.emit("employee-entered");

    socket.on("disconnect", async function () {
      const date = new Date().toString();
      console.log("User disconnected: " + socket.id);
      socketIO.emit("user-disconnected");
      try {
        await adminModel.updateOne({ Active: socket.id }, { Active: date });
        console.log("Admin updated: " + socket.id);
      } catch (error) {
        console.error("Error updating admin:", error);
      }
    });
  });
});
