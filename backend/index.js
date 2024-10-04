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
const { sendMail3 } = require("./helpers/sendMail3");
const { sendMail4 } = require("./helpers/sendMail4");
const pdfAttachment = path.join("./helpers/src", './MITC.pdf');
const HTMLtoDOCX = require('html-to-docx');
const axios = require('axios');
const crypto = require("crypto");
const TeamModel = require("./models/TeamModel.js");
const TeamLeadsModel = require("./models/TeamLeads.js");
const RequestMaturedModel = require("./models/RequestMatured.js");
const InformBDEModel = require("./models/InformBDE.js");
const { dataform_v1beta1, servicecontrol_v2 } = require("googleapis");
const bookingsAPI = require("./helpers/bookingAPI.js");
const AdminLeadsAPI = require("./helpers/AdminLeadsAPI.js");
const RemarksAPI = require("./helpers/Remarks.js");
const bdmAPI = require("./helpers/bdmAPI.js");
const EmployeeAPI = require("./helpers/EmployeeAPI.js");
const ProjectionAPI = require("./helpers/ProjectionAPI.js");
const RequestAPI = require("./helpers/RequestAPI.js");
const companyAPI = require("./helpers/Company_dataAPI.js");
const ClientAPI = require("./helpers/ClientAPI.js");
const EmployeeDraftAPI = require("./helpers/EmployeeDraftApi.js");
const AttendanceAPI = require("./helpers/AttendanceApi.js");
const LastEmployeeIdAPI = require("./helpers/LastEmployeeIdChanger.js");
const DepartmentAPI = require("./helpers/DepartmentApi.js");
const ServicesDraftAPI = require("./helpers/ServicesDraftApi.js");
const ServicesAPI = require("./helpers/ServicesApi.js");
const ExpenseReportAPI = require("./helpers/ExpenseReportApi.js");
const TeamsAPI = require("./helpers/TeamsAPI.js");
const userModel = require("./models/CompanyBusinessInput.js");
const processAttachments = require("./helpers/sendMail3.js");
const { Parser } = require("json2csv");
const { file } = require("googleapis/build/src/apis/file/index.js");
const htmlDocx = require('html-docx-js');
const RMServicesAPI = require("./helpers/RMServicesApi.js")
const CustomerAPI = require("./helpers/CustomerApi.js")
const RecruiterAPI = require("./helpers/recruitmentAPI.js")

const { MongoClient } = require('mongodb');
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
app.use("/api/admin-leads", (req, res, next) => {
  req.io = socketIO;
  next();
}, AdminLeadsAPI);
app.use("/api/remarks", RemarksAPI);
app.use('/api/bookings', (req, res, next) => {
  req.io = socketIO;
  next();
}, bookingsAPI);
app.use('/api/company-data', (req, res, next) => {
  req.io = socketIO;
  next();
}, companyAPI);
app.use('/api/requests', (req, res, next) => {
  req.io = socketIO;
  next();
}, RequestAPI);
app.use('/api/teams', TeamsAPI)
app.use('/api/bdm-data', (req, res, next) => {
  req.io = socketIO;
  next();
}, bdmAPI)
app.use('/api/projection', ProjectionAPI)
app.use('/api/employee', EmployeeAPI)
app.use('/api/rm-services', (req, res, next) => {
  req.io = socketIO;
  next();
}, RMServicesAPI)
app.use('/api/clientform', ClientAPI)
app.use('/api/customer', CustomerAPI)
app.use('/api/employeeDraft', EmployeeDraftAPI);
app.use('/api/attendance', AttendanceAPI);
app.use('/api/lastEmployeeId', LastEmployeeIdAPI);
app.use('/api/department', DepartmentAPI);
app.use('/api/serviceDraft', ServicesDraftAPI);
app.use('/api/services', ServicesAPI);
app.use('/api/expense', ExpenseReportAPI);
app.use('/api/recruiter',(req,res,next)=>{
  req.io = socketIO;
  next();
}, RecruiterAPI);


// app.use(session({
//   secret: 'boombadaboom', // Replace with a secret key for session encryption
//   resave: false,
//   saveUninitialized: false,
// }));
// app.use(passport.initialize())
// app.use(passport.session());
// const http = process.env.GOOGLE_SPREADSHEET_ID === '1oPKUHyJr1BN1E_v5eQBJpr4JQiHx1MVkMyCEL-OrLxI' ? require('http').createServer(app)  : require('http').createServer({
//   cert: fs.readFileSync('/etc/letsencrypt/live/startupsahay.in/fullchain.pem'), 
//   key: fs.readFileSync('/etc/letsencrypt/live/startupsahay.in/privkey.pem'), 
// }, app);
const http = require('http').createServer(app)
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

//  ***********************************************   Format Dates   *********************************************************
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

// ************************************   Storage Section  ***********************************************

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
    else if (file.fieldname === "DirectorAdharCard" || file.fieldname === "DirectorPassportPhoto") {
      destinationPath = `ClientDocuments/${companyName}/DirectorDocs`;
    } else {
      destinationPath = `ClientDocuments/${companyName}/OtherDocs`
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

// ***************************************   Login Section  **********************************************
app.post("/api/admin/login-admin", async (req, res) => {
  const { username, password } = req.body;


  const user = await onlyAdminModel.findOne({
    admin_email: username,
    admin_password: password,
  });

  //console.log(user);
  if (user) {
    // Generate a JWT token
    // console.log("user is appropriate");
    const adminName = user.admin_name;
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, adminName });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// app.post("/api/employeelogin", async (req, res) => {
//   const { email, password } = req.body;
//   //console.log(email , password)
//   // Replace this with your actual Employee authentication logic
//   const user = await adminModel.findOne({
//     email: email,
//     password: password,
//     //designation: "Sales Executive",
//   });

//   if (!user) {
//     // If user is not found
//     return res.status(401).json({ message: "Invalid email or password" });
//   } else if (user.designation !== "Sales Executive") {
//     // If designation is incorrect
//     return res.status(401).json({ message: "Designation is incorrect" });
//   } else {
//     // If credentials are correct
//     const newtoken = jwt.sign({ employeeId: user._id }, secretKey, {
//       expiresIn: "3h",
//     });
//     res.json({ newtoken });
//     socketIO.emit("Employee-login");
//   }
// });

app.post("/api/employeelogin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Use .select() to limit fields retrieved from the database
    const user = await adminModel.findOne({ email, password }).select('email password designation').lean();

    if (!user) {
      // If user is not found
      return res.status(401).json({ message: "Invalid email or password" });
    } else if (user.designation !== "Sales Executive") {
      // If designation is incorrect
      return res.status(401).json({ message: "Designation is incorrect" });
    } else {
      // If credentials are correct
      const newtoken = jwt.sign({ employeeId: user._id }, secretKey, {
        expiresIn: "3h",
      });
      res.json({ newtoken });
      socketIO.emit("Employee-login");
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
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
  //console.log(user)M
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

app.post("/api/rmofcertificationlogin", async (req, res) => {
  const { email, password } = req.body;

  const user = await adminModel.findOne({
    email: email,
    password: password,
  });
  //console.log(user)
  if (!user) {
    // If user is not found
    return res.status(401).json({ message: "Invalid email or password" });
  } else if (user.designation !== "RM-Certification") {
    // If designation is incorrect
    return res.status(401).json({ message: "Designation is incorrect" });
  } else {
    // If credentials are correct
    const rmofcertificationToken = jwt.sign({ employeeId: user._id }, secretKey, {
      expiresIn: "10h",
    });
    //console.log(bdmToken)
    res.status(200).json({ rmofcertificationToken });
    //socketIO.emit("Employee-login");
  }
})

app.post("/api/recruiterlogin", async (req, res) => {
  const { email, password } = req.body;

  const user = await adminModel.findOne({
    email: email,
    password: password,
  });
  //console.log(user)
  if (!user) {
    // If user is not found
    return res.status(401).json({ message: "Invalid email or password" });
  } else if (user.designation !== "HR Recruiter") {
    // If designation is incorrect
    return res.status(401).json({ message: "Designation is incorrect" });
  } else {
    // If credentials are correct
    const recruiterToken = jwt.sign({ employeeId: user._id }, secretKey, {
      expiresIn: "10h",
    });
    //console.log(bdmToken)
    res.status(200).json({ recruiterToken });
    //socketIO.emit("Employee-login");
  }
})

/**************************************HR Login Portal API********************************************************************/

app.post("/api/hrlogin", async (req, res) => {
  const { email, password } = req.body;
  //console.log(email,password)
  const user = await adminModel.findOne({
    email: email,
    password: password,
  });
  //console.log(user)M
  if (!user) {
    // If user is not found
    return res.status(401).json({ message: "Invalid email or password" });
  } else if (user.designation !== "HR") {
    // If designation is incorrect
    return res.status(401).json({ message: "Designation is incorrect" });
  } else {
    // If credentials are correct
    const hrToken = jwt.sign({ employeeId: user._id }, secretKey, {
      expiresIn: "10h",
    });
    //console.log(bdmToken)
    res.status(200).json({ hrToken, hrUserId: user._id, ename: user.ename });
    //socketIO.emit("Employee-login");
  }
});

app.post("/api/adminexecutivelogin", async (req, res) => {
  const { email, password } = req.body;

  const user = await adminModel.findOne({
    email: email,
    password: password,
  });


  //console.log(user)
  if (!user) {
    // If user is not found
    return res.status(401).json({ message: "Invalid email or password" });
  } else if (user.designation !== "Admin Executive") {
    // If designation is incorrect
    return res.status(401).json({ message: "Designation is incorrect" });
  } else {
    // If credentials are correct
    const adminExecutiveToken = jwt.sign({ employeeId: user._id }, secretKey, {
      expiresIn: "10h",
    });
    //console.log(bdmToken)
    res.status(200).json({ adminExecutiveToken });
    //socketIO.emit("Employee-login");
  }
})

app.post("/api/rmoffundinglogin", async (req, res) => {
  const { email, password } = req.body;

  const user = await adminModel.findOne({
    email: email,
    password: password,
  });
  //console.log(user)
  if (!user) {
    // If user is not found
    return res.status(401).json({ message: "Invalid email or password" });
  } else if (user.designation !== "RM-Funding") {
    // If designation is incorrect
    return res.status(401).json({ message: "Designation is incorrect" });
  } else {
    // If credentials are correct
    const rmoffundingToken = jwt.sign({ employeeId: user._id }, secretKey, {
      expiresIn: "10h",
    });
    //console.log(bdmToken)
    res.status(200).json({ rmoffundingToken });
    //socketIO.emit("Employee-login");
  }
})

// -----------------calling api request---------------------

app.post('/api/fetch-api-data', async (req, res) => {
  const { emp_numbers } = req.body;
  //console.log("empnumber", emp_numbers)
  // External API URL (without query parameters)
  const externalApiUrl = " https://api1.callyzer.co/v2/employee/get"; // Assuming the external API expects the data in the body, not in the URL

  try {
    // Fetch data from the external API using axios with GET request and body
    const apiKey = "bc4e10cf-23dd-47e6-a1a3-2dd889b6dd46";
    const response = await axios({
      method: 'GET',
      url: externalApiUrl,
      data: { emp_numbers }, // Send the data in the body of the GET request
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
    });

    // Send the response from the external API back to the client
    // console.log(response.data)
    res.status(200).json(response.data);
  } catch (error) {
    // Handle any errors
    console.error('Error fetching data from external API:', error);
    res.status(500).json({ error: 'Failed to fetch data from external API' });
  }
});






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

// **************************************  Socket IO Active Status  **************************************************
// app.put("/api/employee/online-status/:id/:socketID", async (req, res) => {
//   const { id } = req.params;
//   const { socketID } = req.params;
//   console.log("kuhi", socketID);
//   try {
//     const admin = await adminModel.findByIdAndUpdate(
//       id,
//       { Active: socketID },
//       { new: true }
//     );
//     res.status(200).json(admin);
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
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
//  ******************************************************************* Login Details ***************************************************************************
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

//  *************************************************  Company Data POSTING Request  ******************************************************

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
    "CInumber",
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
      lead["CInumber"],
      lead["ename"],
      lead["AssignDate"],
      lead["Status"],
      `"${lead["Remarks"]}"`, // Enclose Remarks in double quotes
    ];
    csvData.push(rowData);
  });

  return csvData.map((row) => row.join(",")).join("\n");
}



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


app.delete(`/api/delete-bdmTeam/:teamId`, async (req, res) => {
  const teamId = req.params.teamId; // Correctly access teamId from req.params

  try {
    const existingData = await TeamModel.findById(teamId);


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



app.post(`/api/update-bdmstatusfrombde/:companyId`, async (req, res) => {
  const companyId = req.params.companyId;

  //console.log(companyId)
  const { newStatus } = req.body;
  //console.log(newStatus)                // Assuming the new status is under the key 'bdmStatus' in the request body
  try {
    const update = await TeamLeadsModel.findByIdAndUpdate(companyId, {
      bdmStatus: newStatus,
      Status: newStatus,
    });

    //console.log(update)

    res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/teaminfo/:teamId", async (req, res) => {
  const teamId = req.params.teamId;

  const dataToUpdated = req.body;



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


// ***************************************************************  Company Data's Hadi  *************************************************************

// 5. ADD Multiple Companies
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



// **************************************************************  Follow UPDATE content  **************************************************************

app.post("/api/delete-companies-teamleads-assignednew", async (req, res) => {
  try {
    // Extract the companyIds from the request body
    const { companyIds } = req.body;

    //console.log("companycom", companyIds)

    // Validate that companyIds is an array
    if (!Array.isArray(companyIds)) {
      return res
        .status(400)
        .json({ error: "Invalid input: companyIds must be an array" });
    }

    // Delete companies from the TeamLeadsModel using the companyIds
    const deleteResult = await TeamLeadsModel.deleteMany({
      _id: { $in: companyIds },
    });

    // Check if any companies were deleted
    if (deleteResult.deletedCount === 0) {
      return res
        .status(404)
        .json({ error: "No companies found with the provided IDs" });
    }

    // Respond with success message
    res.status(200).json({ message: "Companies deleted successfully" });
  } catch (error) {
    console.error("Error deleting companies:", error);
    res.status(500).json({ error: "Internal Server Error" });
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

// ********************************************************pdf files reader *************************************************************************************

app.get("/download/recieptpdf/:fileName", (req, res) => {
  const fileName = req.params.filePath;
  const filePath = path.join(__dirname, "uploads", fileName);
  // console.log(fileName);
  res.setHeader("Content-Disposition", attachment, (fileName = `${fileName}`));
  res.setHeader("Content-Type", "application/pdf");
  res.sendFile(filePath);
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




// // API endpoint
app.get('/api/generate-pdf-client', async (req, res) => {
  try {
    let htmlNewTemplate = fs.readFileSync('./helpers/client_mail.html', 'utf-8');


    // Ensure the directory exists

    const pdfFilePath = `./TestDocs/test.pdf`;
    const options = {
      childProcessOptions: {
        env: {
          OPENSSL_CONF: './dev/null',
        },
      },
    };

    pdf.create(htmlNewTemplate, options).toFile(pdfFilePath, async (err, response) => {
      if (err) {
        console.error('Error generating PDF:', err);
        return res.status(500).send('Error generating PDF');
      } else {
        console.log('Docx file created successfully');
        return res.status(200).send('Generated DOCX Successfully');
      }
    });
  } catch (error) {
    console.error('Error in endpoint:', error);
    res.status(500).send('Server error');
  }
});




/**************************************Employee Edit API - HR********************************************************************/





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
