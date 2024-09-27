var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
const multer = require("multer");
dotenv.config(); // Load environment variables from .env file
const CompanyModel = require("../models/Leads.js");
const pdf = require("html-pdf");
const fs = require("fs");
const path = require("path");
const { sendMail } = require("./sendMail.js");
const RequestDeleteByBDE = require("../models/Deleterequestbybde.js");
const RedesignedLeadformModel = require("../models/RedesignedLeadform.js");
const EditableDraftModel = require("../models/EditableDraftModel.js");
const RedesignedDraftModel = require("../models/RedesignedDraftModel.js");
const { sendMail2 } = require("./sendMail2.js");
const TeamLeadsModel = require("../models/TeamLeads.js");
const InformBDEModel = require("../models/InformBDE.js");
const { Parser } = require('json2csv');
const { appendDataToSheet, appendRemainingDataToSheet } = require('./Google_sheetsAPI.js');
const NotiModel = require('../models/Notifications.js');
const RMCertificationModel = require('../models/RMCertificationServices.js');
const mongoose = require('mongoose'); // Import mongoose
const AdminExecutiveModel = require('../models/AdminExecutiveModel.js');
const FollowUpModel = require('../models/FollowUp.js');
const LeadHistoryForInterestedandFollowModel = require('../models/LeadHistoryForInterestedandFollow.js');
const ObjectId = mongoose.Types.ObjectId;
const ExpenseReportModel = require("../models/ExpenseReportModel.js");
const RecruitmentModel = require('../models/RecruitmentModel.js');
const { sendMailRecruiter } = require('./sendMailRecruiter.js');


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const employeeName = req.body.empFullName; // Using employee full name from the request body
    let destinationPath = path.resolve(__dirname, '../RecruitmentApplicationForm', employeeName);

    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }

    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); // Adding a unique identifier to avoid conflicts
  }
});

const upload = multer({ storage: storage });

router.post('/application-form/save', upload.single('uploadedCV'), async (req, res) => {
  try {
    const {
      empFullName,
      personal_email,
      personal_number,
      appliedFor,
      qualification,
      experience,
      currentCTC,
      expectedCTC,
      applicationSource,
      notes
    } = req.body;

    // Validate required fields
    if (!empFullName || !personal_email || !personal_number || !appliedFor ||
      !qualification || !experience || !currentCTC || !expectedCTC || !applicationSource) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    // Extract the filename from the uploaded file
    const uploadedFileName = req.file ? req.file.filename : '';
    // Create a new application object
    const newApplication = new RecruitmentModel({
      empFullName,
      personal_email,
      personal_number,
      appliedFor,
      qualification,
      experience,
      currentCTC,
      expectedCTC,
      applicationSource,
      notes,
      uploadedCV: req.file ? req.file : '',
      fillingDate: new Date(),
      fillingTime: new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
    });

    // Save the application to the database
    await newApplication.save();

    // Define the path for the PDF
    setTimeout(() => {
      const pdfPath = path.join(__dirname, `../RecruitmentApplicationForm/${empFullName}`, req.file.filename);

      // Check if the PDF exists
      fs.access(pdfPath, fs.constants.F_OK, async (err) => {
        if (err) {
          console.error(`PDF file not found: ${pdfPath}`);
          return res.status(500).json({ message: 'PDF not found, cannot send email.' });
        }

        // Prepare email content
        const attachments = [{
          filename: `${req.file.originalname}`,
          path: pdfPath
        }];
        const subject = `Congratulations! Your Application has been submitted!`;
        const html = `
          <p>Dear ${empFullName},</p>
          <h1>Your Application has been submitted!</h1>
          <p>Thank you for choosing Start-Up Sahay. We look forward to continuing to support you!</p>
          <p>Best regards,<br>Start-Up Sahay Private Limited</p>`;

        try {
          // Send email
          const emailInfo = await sendMailRecruiter(
            [personal_email],
            subject,
            "",
            html,
            attachments
          );
          console.log(`Email sent: ${emailInfo.messageId}`);

          // Send response after email is sent
          return res.status(201).json({ message: 'Application submitted successfully and email sent.' });

        } catch (emailError) {
          console.error('Error sending email:', emailError);
          return res.status(500).json({ message: 'Application submitted, but failed to send email.' });
        }
      });
    }, 4000)


  } catch (error) {
    console.error('Error submitting application:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;