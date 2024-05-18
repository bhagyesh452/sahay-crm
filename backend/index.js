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
const bookingsAPI = require("./helpers/bookingAPI.js")
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
    const { dataStatus } = req.query

    //console.log("dataStatus" , dataStatus)
    // Query the database to get paginated data
    let query = {};
   
    if (dataStatus === "Unassigned") {
      query = { ename: "Not Alloted" };
      
    } else if (dataStatus === "Assigned") {
      query = { ename: { $ne: "Not Alloted" } };
      
    }
    const employees = await CompanyModel.find(query)
      .skip(skip)
      .limit(limit);
    // console.log("employees" , employees)
    // Get total count of documents for pagination
    const unAssignedCount = await CompanyModel.countDocuments({ ename: "Not Alloted" });
    const assignedCount = await CompanyModel.countDocuments({ename: { $ne: "Not Alloted" }});
    const totalCount = await CompanyModel.countDocuments(query)
    //console.log(unAssignedCount , assignedCount)
    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);
    // Return paginated data along with pagination metadata
    res.json({
      data: employees,
      currentPage: page,
      totalPages: totalPages,
      unAssignedCount : unAssignedCount,
      assignedCount : assignedCount
    });
  } catch (error) {
    console.error('Error fetching employee data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/search-leads', async (req, res) => {
  try {
    const { searchQuery } = req.query;
    console.log(searchQuery , "search")
    
    let searchResults;
    if (searchQuery && searchQuery.trim() !== '') {
      // Perform database query to search for leads matching the searchQuery
      searchResults = await CompanyModel.find({
        'Company Name': { $regex: new RegExp(searchQuery, 'i') } // Case-insensitive search
      }).limit(500).lean();
    } else {
      // If search query is empty, fetch 500 data from CompanyModel
      searchResults = await CompanyModel.find().limit(500).lean();
    }

    res.json(searchResults);
  } catch (error) {
    console.error('Error searching leads:', error);
    res.status(500).json({ error: 'Internal server error' });
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

// --------------------api for importing excel data on processing dashboard----------------------------
// app.get("/api/booking-model-filter", async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;

//     // Convert start and end dates to JavaScript Date objects
//     const formattedStartDate = new Date(startDate);
//     const formattedEndDate = new Date(endDate);

//     // Convert the start date to match the format of the bookingDate field
//     const formattedBookingStartDate = formattedStartDate
//       .toISOString()
//       .split("T")[0];

//     // Define the filter criteria based on the date range
//     let filterCriteria = {};
//     if (formattedStartDate.getTime() === formattedEndDate.getTime()) {
//       // If start and end dates are the same, filter by a single date
//       filterCriteria = { bookingDate: formattedBookingStartDate };
//     } else {
//       // If start and end dates are different, filter by a date range
//       filterCriteria = {
//         bookingDate: {
//           $gte: formattedBookingStartDate,
//           $lte: formattedEndDate.toISOString().split("T")[0],
//         },
//       };
//     }

//     // Fetch leads from the database filtered by the specified date range
//     const leads = await LeadModel.find(filterCriteria);

//     res.json({ leads });
//   } catch (error) {
//     console.error("Error fetching leads:", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


// app.post("/api/accept-booking-request/:companyName", async (req, res) => {
//   const companyName = req.params.companyName;
//   const requestData = req.body;

//   try {
//     // Find the data to be moved from BookingsRequestModel

//     // Update leadModel data with data from BookingsRequestModel
//     const { _id, ...updatedData } = requestData;

//     // Update leadModel data with data from BookingsRequestModel
//     const updatedLead = await LeadModel.findOneAndUpdate(
//       { companyName },
//       { $set: updatedData },
//       { new: true }
//     );

//     // Delete the data from BookingsRequestModel
//     await BookingsRequestModel.findOneAndDelete({ companyName });

//     // Send success response with the updated lead data
//     res.status(200).json(updatedLead);
//   } catch (error) {
//     console.error("Error accepting booking request:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });
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



// ----------------------------api to download csv from processing dashboard--------------------------



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
app.use("/api/bookings" , bookingsAPI)


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
