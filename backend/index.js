const express = require("express");
const cors = require("cors");
const compression = require("compression");
const pdf = require("html-pdf");
const cron = require('node-cron');
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
const ChatModel = require("./models/ChatModel.js");
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
const RalationshipManagerAPI = require("./helpers/RelationshipManagerApi.js");
const GraphicDesignerAPI = require("./helpers/GraphicDesignerApi.js");
const FinanceAnalystAPI = require("./helpers/FinanceAnalystApi.js");
const ContentWriterAPI = require("./helpers/ContentWriterApi.js");
const ChatAPI = require("./helpers/ChatApi.js");
const TeamsAPI = require("./helpers/TeamsAPI.js");
const userModel = require("./models/CompanyBusinessInput.js");
const processAttachments = require("./helpers/sendMail3.js");
const { Parser } = require("json2csv");
const { file } = require("googleapis/build/src/apis/file/index.js");
const htmlDocx = require('html-docx-js');
const RMServicesAPI = require("./helpers/RMServicesApi.js")
const CustomerAPI = require("./helpers/CustomerApi.js")
const RecruiterAPI = require("./helpers/recruitmentAPI.js")
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const mime = require('mime-types');
const QuestionAPI = require("./helpers/questionsAPI")

// Create OAuth2 client
const oAuth2Client = new google.auth.OAuth2({
  clientId: process.env.GOOGLE_CLIENT_ID, // Replace with your OAuth2 client ID
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Replace with your OAuth2 client secret
  redirectUri: 'https://developers.google.com/oauthplayground' // Replace with your authorized redirect URI
});


// Set your OAuth2 refresh token
oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN // Replace with your OAuth2 refresh token
});


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
app.use("/api/remarks", (req, res, next) => {
  req.io = socketIO;
  next()
}, RemarksAPI);
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
app.use('/api/employee', (req, res, next) => {
  req.io = socketIO;
  next();
}, EmployeeAPI)
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
app.use('/api/relationshipManager', RalationshipManagerAPI);
app.use('/api/graphicDesigner', GraphicDesignerAPI);
app.use('/api/financeAnalyst', FinanceAnalystAPI);
app.use('/api/contentWriter', ContentWriterAPI);
app.use('/api/chats', ChatAPI);
app.use('/api/projection', (req, res, next) => {
  req.io = socketIO;
  next();
}, ProjectionAPI);
app.use('/api/recruiter', (req, res, next) => {
  req.io = socketIO;
  next();
}, RecruiterAPI);
app.use('/api/question_related_api', (req, res, next) => {
  req.io = socketIO;
  next();
}, QuestionAPI)


const http = require('http').createServer(app)
var socketIO = require("socket.io")(http, {
  cors: {
    origin: " * ",
    methods: ["GET", "POST"],
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
let otpStorage = {};

async function createTransporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: "alerts@startupsahay.com",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      accessToken: process.env.GOOGLE_ACCESS_TOKEN,
    },
  });
}

app.post("/api/admin/login-admin", async (req, res) => {
  const { email, password } = req.body;


  const user = await onlyAdminModel.findOne({
    admin_email: email,
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


app.post("/api/employeelogin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Use .select() to limit fields retrieved from the database
    const user = await adminModel.findOne({ email, password }).select('email password designation _id').lean();
    
    if (!user) {
      // If user is not found
      return res.status(401).json({ message: "Invalid email or password" });
    } else if (user.designation !== "Sales Executive") {
      // If designation is incorrect
      return res.status(401).json({ message: "Designation is incorrect" });
    } else {
      const newtoken = jwt.sign({ employeeId: user._id }, secretKey, {
        expiresIn: "3h",
      });
      res.status(200).json({ userId: user._id, newtoken: newtoken });
      // socketIO.emit("Employee-login");
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// Verify email and password before sending OTP
app.post("/api/verifyCredentials/admin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await onlyAdminModel
      .findOne({ admin_email: email, admin_password: password })
      .lean()
      .select('admin_email admin_password');

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    } else {
      res.status(200).json({ message: "Credentials verified" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

app.post("/api/sendOtp/admin", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await onlyAdminModel
      .findOne({ admin_email: email })
      .lean()
      .select('admin_email admin_password');
    if (!user) {
      return res.status(404).json({ message: "Email not registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const otpExpiry = Date.now() + 1 * 60 * 1000; // 10-minute expiry

    otpStore.set(email, { otp, otpExpiry });

    console.log("otpStore", otpStore)

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: 'otp@startupsahay.com', // Replace with your Gmail email ID
        clientId: process.env.GOOGLE_OTP_CLIENT_ID, // Replace with your OAuth2 client ID
        clientSecret: process.env.GOOGLE_OTP_CLIENT_SECRET, // Replace with your OAuth2 client secret
        refreshToken: process.env.GOOGLE_OTP_REFRESH_TOKEN, // Replace with your OAuth2 refresh token
        accessToken: process.env.GOOGLE_OTP_ACCESS_TOKEN // Use dynamically fetched OAuth2 access token
      }
    });

    await transporter.sendMail({
      from: '"Start-Up Sahay Private Limited" <otp@startupsahay.com>',
      to: email,
      subject: "Your OTP for Employee Login",
      text: `Your OTP is ${otp}. It is valid for 1 minute.`,
    });

    res.status(200).json({
      message: "OTP sent successfully",
      otpExpiry, // Return expiry timestamp
    });
  } catch (error) {
    console.log("error", error)
    res.status(500).json({ message: "Error sending OTP", error: error.message });
  }
});

// Verify email and password before sending OTP
app.post("/api/verifyCredentials", async (req, res) => {
  const { email, password, designations } = req.body;
  console.log(email, password, designations)

  try {
    const user = await adminModel
      .findOne({ email, password, designation: { $in: designations } }) // Use $in for multiple designations
      .lean()
      .select("email password designation");
    console.log("user", user)
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password or designation" });
    } else {
      res.status(200).json({ message: "Credentials verified" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

const otpStore = new Map(); // Key: email, Value: { otp, expiry }

app.post("/api/sendOtp", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await adminModel.findOne({ email }).lean();
    if (!user) {
      return res.status(404).json({ message: "Email not registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const otpExpiry = Date.now() + 1 * 60 * 1000; // 10-minute expiry

    otpStore.set(email, { otp, otpExpiry });

    console.log("otpStore", otpStore)

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: 'otp@startupsahay.com', // Replace with your Gmail email ID
        clientId: process.env.GOOGLE_OTP_CLIENT_ID, // Replace with your OAuth2 client ID
        clientSecret: process.env.GOOGLE_OTP_CLIENT_SECRET, // Replace with your OAuth2 client secret
        refreshToken: process.env.GOOGLE_OTP_REFRESH_TOKEN, // Replace with your OAuth2 refresh token
        accessToken: process.env.GOOGLE_OTP_ACCESS_TOKEN // Use dynamically fetched OAuth2 access token
      }
    });

    await transporter.sendMail({
      from: '"Start-Up Sahay Private Limited" <otp@startupsahay.com>',
      to: email,
      subject: "Your OTP for Login",
      text: `Your OTP is ${otp}. It is valid for 1 minute.`,
    });

    res.status(200).json({
      message: "OTP sent successfully",
      otpExpiry, // Return expiry timestamp
    });
  } catch (error) {
    console.log("error", error)
    res.status(500).json({ message: "Error sending OTP", error: error.message });
  }
});

app.post('/api/verifyOtp', (req, res) => {
  const { email, otp } = req.body;
  console.log("otpstore", otpStore)
  if (!otpStore.has(email)) {
    console.log("here in email")
    return res.status(404).json({ message: "OTP not found" });
  }

  const storedOtp = otpStore.get(email);

  console.log("storedotp", storedOtp)

  if (storedOtp.otp !== parseInt(otp) || storedOtp.expiry < Date.now()) {
    console.log("here in otp")
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  otpStore.delete(email); // Clear OTP after successful verification
  res.status(200).json({ message: "OTP verified successfully" });
});

app.post("/api/verifyCaptcha", async (req, res) => {
  const { token } = req.body;

  try {
    const secretKey = process.env.REACT_APP_GOOGLERECAPTCHA_KEY;

    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: secretKey,
          response: token,
        },
      }
    );

    if (!response.data.success) {
      return res.status(400).json({ message: "Invalid CAPTCHA" });
    }

    res.status(200).json({ message: "CAPTCHA verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying CAPTCHA", error: error.message });
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
    res.status(200).json({ newtoken: newtoken, dataManagerUserId: user._id });
    // socketIO.emit("Employee-login");
  }
});

// app.post("/api/datamanagerlogin", async (req, res) => {
//   const { email, password } = req.body;

//   // Replace with your DB logic
//   const user = await adminModel.findOne({ email, password });
//   if (!user) {
//     return res.status(401).json({ message: "Invalid email or password" });
//   }

//   if (user.designation !== "Data Manager") {
//     return res.status(401).json({ message: "Designation is incorrect" });
//   }

//   // Generate OTP and set expiration
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   const expirationTime = Date.now() + 90 * 1000; // 1:30 minute

//   otpStorage[email] = { otp, expiresAt: expirationTime };
//   console.log("Otp is :", otpStorage);

//   let transporter;
//   try {
//     transporter = await createTransporter();
//   } catch (error) {
//     return res.status(500).send('Error creating transporter');
//   }

//   const mailOptions = {
//     from: "alerts@startupsahay.com",
//     to: email,
//     subject: "Your OTP Code",
//     text: `Your OTP code is ${otp}. It is valid for 1:30 minute.`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.status(200).send("OTP sent");
//   } catch (error) {
//     res.status(500).send("Error sending OTP");
//   }
// });

// Verify OTP endpoint
app.post("/api/verify-otp", async (req, res) => {
  const { email, otp, captchaToken } = req.body;

  // Step 1: Validate OTP first
  const otpData = otpStorage[email];
  if (!otpData) {
    return res.status(400).send("OTP not found");
  }

  const { otp: storedOtp, expiresAt } = otpData;

  if (Date.now() > expiresAt) {
    delete otpStorage[email];
    return res.status(406).send("OTP has expired");
  }

  if (storedOtp === otp) {
    // OTP is correct; require CAPTCHA for additional security
    if (!captchaToken) {
      return res.status(200).json({ captchaRequired: true });
    }

    // Step 2: Validate CAPTCHA Token if provided
    const captchaSecretKey = process.env.REACT_APP_GOOGLERECAPTCHA_KEY;
    const captchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify`;

    const captchaResponse = await axios.post(captchaVerifyUrl, null, {
      params: {
        secret: captchaSecretKey,
        response: captchaToken,
      },
    });

    if (!captchaResponse.data.success) {
      return res.status(403).send("CAPTCHA validation failed");
    }

    // Both OTP and CAPTCHA are validated
    delete otpStorage[email];
    const token = jwt.sign({ email }, secretKey, { expiresIn: "1h" });
    return res.status(200).json({ message: "OTP verified", token, captchaRequired: false });
  } else {
    return res.status(400).send("Invalid OTP");
  }
});

app.post("/api/bdmlogin", async (req, res) => {
  const { email, password } = req.body;
  //console.log(email,password)
  const user = await adminModel.findOne({
    email: email,
    password: password,
  });
  // console.log("user" , user)
  //console.log(user)M
  if (!user) {
    // If user is not found
    return res.status(401).json({ message: "Invalid email or password" });
  } else if (user.designation !== "Sales Manager" && user.designation !== "Vice President") {
    // If designation is incorrect
    return res.status(401).json({ message: "Designation is incorrect" });
  } else {
    // If credentials are correct
    const bdmToken = jwt.sign({ employeeId: user._id }, secretKey, {
      expiresIn: "10h",
    });
    //console.log(bdmToken)
    res.status(200).json({ bdmToken: bdmToken, userId: user._id });
    //socketIO.emit("Employee-login");
  }
});

app.post("/api/relationshipmanagerlogin", async (req, res) => {
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
  } else if (user.designation !== "Relationship Manager") {
    // If designation is incorrect
    return res.status(401).json({ message: "Designation is incorrect" });
  } else {
    // If credentials are correct
    const relationshipManagerToken = jwt.sign({ employeeId: user._id }, secretKey, {
      expiresIn: "10h",
    });
    //console.log(bdmToken)
    res.status(200).json({ relationshipManagerToken: relationshipManagerToken, userId: user._id });
    //socketIO.emit("Employee-login");
  }
});

app.post("/api/graphicdesignerlogin", async (req, res) => {
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
  } else if (user.designation !== "Graphic Designer") {
    // If designation is incorrect
    return res.status(401).json({ message: "Designation is incorrect" });
  } else {
    // If credentials are correct
    const graphicDesignerToken = jwt.sign({ employeeId: user._id }, secretKey, {
      expiresIn: "10h",
    });
    //console.log(bdmToken)
    res.status(200).json({ graphicDesignerToken: graphicDesignerToken, userId: user._id });
    //socketIO.emit("Employee-login");
  }
});

app.post("/api/contentwriterlogin", async (req, res) => {
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
  } else if (user.designation !== "Content Writer") {
    // If designation is incorrect
    return res.status(401).json({ message: "Designation is incorrect" });
  } else {
    // If credentials are correct
    const contentwriterToken = jwt.sign({ employeeId: user._id }, secretKey, {
      expiresIn: "10h",
    });
    //console.log(bdmToken)
    res.status(200).json({ contentwriterToken: contentwriterToken, userId: user._id });
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

  try {
    // Find the user in the database
    const user = await adminModel.findOne({
      email: email,
      password: password,
    });

    if (!user) {
      // If user is not found
      return res.status(401).json({ message: "Invalid email or password" });
    } else if (user.designation !== "RM-Certification") {
      // If designation is incorrect
      return res.status(401).json({ message: "Designation is incorrect" });
    } else {
      // If credentials are correct
      const rmofcertificationToken = jwt.sign(
        { employeeId: user._id },
        secretKey,
        { expiresIn: "10h" }
      );

      // Return the token and user details
      res.status(200).json({
        rmofcertificationToken: rmofcertificationToken,
        rmCertificationUserId: user._id,
        ename: user.ename,
      });

      // Emit socket event for login (if needed)
      // socketIO.emit("Employee-login");
    }
  } catch (error) {
    // Handle errors
    console.error("Error in /api/rmofcertificationlogin:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


// app.post("/api/rmofcertificationlogin", async (req, res) => {
//   const { email, password } = req.body;

//   // Replace with your DB logic
//   const user = await adminModel.findOne({ email, password });
//   if (!user) {
//     return res.status(401).json({ message: "Invalid email or password" });
//   }

//   if (user.designation !== "RM-Certification") {
//     return res.status(401).json({ message: "Designation is incorrect" });
//   }

//   // Generate OTP and set expiration
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   const expirationTime = Date.now() + 90 * 1000; // 1:30 minute

//   otpStorage[email] = { otp, expiresAt: expirationTime };
//   console.log("Otp is :", otpStorage);

//   let transporter;
//   try {
//     transporter = await createTransporter();
//   } catch (error) {
//     return res.status(500).send('Error creating transporter');
//   }

//   const mailOptions = {
//     from: "alerts@startupsahay.com",
//     to: email,
//     subject: "Your OTP Code",
//     text: `Your OTP code is ${otp}. It is valid for 1:30 minute.`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.status(200).send("OTP sent");
//   } catch (error) {
//     res.status(500).send("Error sending OTP");
//   }
// });

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
    res.status(200).json({ recruiterToken: recruiterToken, recruiterUserId: user._id });
    //socketIO.emit("Employee-login");
  }
})

app.post("/api/adminexecutivelogin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user in the database
    const user = await adminModel.findOne({
      email: email,
      password: password,
    });

    if (!user) {
      // If user is not found
      return res.status(401).json({ message: "Invalid email or password" });
    } else if (user.designation !== "Admin Executive") {
      // If designation is incorrect
      return res.status(401).json({ message: "Designation is incorrect" });
    } else {
      // If credentials are correct
      const adminExecutiveToken = jwt.sign(
        { employeeId: user._id },
        secretKey,
        { expiresIn: "10h" }
      );

      // Send success response
      res
        .status(200)
        .json({ adminExecutiveToken: adminExecutiveToken, adminExecutiveUserId: user._id });
    }
  } catch (error) {
    // Handle errors
    console.error("Error in /api/adminexecutivelogin:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


// app.post("/api/adminexecutivelogin", async (req, res) => {
//   const { email, password } = req.body;

//   // Replace with your DB logic
//   const user = await adminModel.findOne({ email, password });
//   if (!user) {
//     return res.status(401).json({ message: "Invalid email or password" });
//   }

//   if (user.designation !== "Admin Executive") {
//     return res.status(401).json({ message: "Designation is incorrect" });
//   }

//   // Generate OTP and set expiration
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   const expirationTime = Date.now() + 90 * 1000; // 1:30 minute

//   otpStorage[email] = { otp, expiresAt: expirationTime };
//   console.log("Otp is :", otpStorage);

//   let transporter;
//   try {
//     transporter = await createTransporter();
//   } catch (error) {
//     return res.status(500).send('Error creating transporter');
//   }

//   const mailOptions = {
//     from: "alerts@startupsahay.com",
//     to: email,
//     subject: "Your OTP Code",
//     text: `Your OTP code is ${otp}. It is valid for 1:30 minute.`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.status(200).send("OTP sent");
//   } catch (error) {
//     res.status(500).send("Error sending OTP");
//   }
// });

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
    console.log(response.data)
    res.status(200).json(response.data);
  } catch (error) {
    // Handle any errors
    console.error('Error fetching data from external API:', error);
    res.status(500).json({ error: 'Failed to fetch data from external API' });
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

// ------------------------------------------------------team api end----------------------------------


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


/**************************************HR Login Portal API********************************************************************/

app.post("/api/hrlogin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch user with required fields
    const user = await adminModel
      .findOne({ email: email, password: password })
      .select("email password designation ename")
      .lean();

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if the designation is "HR"
    if (user.designation !== "HR") {
      return res.status(401).json({ message: "Designation is incorrect" });
    }

    // Generate JWT token
    const hrToken = jwt.sign({ employeeId: user._id }, secretKey, {
      expiresIn: "10h",
    });

    // Send success response
    res.status(200).json({ hrToken, userId: user._id, ename: user.ename });
  } catch (error) {
    console.error("Error in HR Login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// app.post("/api/hrlogin", async (req, res) => {
//   const { email, password } = req.body;

//   // Replace with your DB logic
//   const user = await adminModel.findOne({ email, password });
//   if (!user) {
//     return res.status(401).json({ message: "Invalid email or password" });
//   }

//   if (user.designation !== "HR") {
//     return res.status(401).json({ message: "Designation is incorrect" });
//   }

//   // Generate OTP and set expiration
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   const expirationTime = Date.now() + 90 * 1000; // 1:30 minute

//   otpStorage[email] = { otp, expiresAt: expirationTime };
//   console.log("Otp is :", otpStorage);

//   let transporter;
//   try {
//     transporter = await createTransporter();
//   } catch (error) {
//     return res.status(500).send('Error creating transporter');
//   }

//   const mailOptions = {
//     from: "alerts@startupsahay.com",
//     to: email,
//     subject: "Your OTP Code",
//     text: `Your OTP code is ${otp}. It is valid for 1:30 minute.`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.status(200).send("OTP sent");
//   } catch (error) {
//     res.status(500).send("Error sending OTP");
//   }
// });


/**************************************Employee Edit API - HR********************************************************************/





http.listen(3001, function () {
  console.log("Server started...");

  socketIO.on("connection", function (socket) {
    console.log("User connected: " + socket.id);
    socketIO.emit("employee-entered");

    socket.on("message", async (msg) => { // To receive and display message from front end.
      // Prepare the message data
      const messageData = {
        id: `${msg.text}-${new Date().toLocaleTimeString()}`,  // Use ISO timestamp for uniqueness
        text: msg.text,
        userName: msg.userName,
        employeeId: msg.employeeId,
        profilePhoto: msg.profilePhoto, // Include profilePhoto
        designation: msg.designation,  // Include designation
        senderId: socket.id,
        time: new Date().toLocaleTimeString(), // Store the current time of the message
      };

      socket.broadcast.emit('send-message-to-every-user', [messageData]); // To send message to user but not show same message to that user who is sending.
      // console.log(`Message : ${messageData.text}`);

      const currentDateStart = new Date().setHours(0, 0, 0, 0); // Start of the current day
      const currentDateEnd = new Date().setHours(23, 59, 59, 999); // End of the current day

      // adding message data in chat database
      try {
        // Find a chat within the date range for the current day
        const chat = await ChatModel.findOne({
          date: {
            $gte: new Date(currentDateStart),
            $lte: new Date(currentDateEnd),
          },
        });

        if (chat) {
          // If a chat exists, push the new message into the existing messageData array
          chat.messageData.push({
            name: msg.userName,
            employeeId: msg.employeeId,
            message: msg.text,
            time: messageData.time,
            profilePhoto: msg.profilePhoto, // Save profilePhoto
            designation: msg.designation,  // Save designation
          });
          await chat.save(); // Save the updated chat
        } else {
          // If no chat exists, create a new one
          const newChat = new ChatModel({
            messageData: [{
              name: msg.userName,
              employeeId: msg.employeeId,
              message: msg.text,
              time: messageData.time,
              profilePhoto: msg.profilePhoto, // Save profilePhoto
              designation: msg.designation,  // Save designation
            }]
          });
          await newChat.save(); // Save the new chat
        }

        // console.log("Message saved to database:", messageData.text);

      } catch (error) {
        console.log("Error saving message:", error);
      }
    });

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
