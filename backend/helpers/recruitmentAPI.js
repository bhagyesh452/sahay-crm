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
    const socketIO = req.io;
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
    const savedApplicationData = await newApplication.save();

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
          console.log(`Email sent: ${emailInfo.messageId}`)

        } catch (emailError) {
          console.error('Error sending email:', emailError);
          return res.status(500).json({ message: 'Application submitted, but failed to send email.' });
        }
      });
    }, 4000)

    // Send response after email is sent
    socketIO.emit('recruiter-application-submitted', { data: savedApplicationData });
    return res.status(200).json({ message: 'Application submitted successfully and email sent.' });
  } catch (error) {
    console.error('Error submitting application:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/recruiter-data', async (req, res) => {
  try {
    const { search, page = 1, limit = 5000, activeTab, companyNames, serviceNames } = req.query; // Extract companyNames and serviceNames

    // Build query object
    let query = {};

    if (search) {
      const regex = new RegExp(search, 'i'); // Case-insensitive search
      const numberSearch = parseFloat(search); // Attempt to parse the search term as a number

      query = {
        $or: [
          { "Company Name": regex }, // Match companyName field
          { serviceName: regex },
          { "Company Email": regex },
          { bdeName: regex },
          { bdmName: regex },
          // Only include the number fields if numberSearch is a valid number
          ...(isNaN(numberSearch) ? [] : [
            { "Company Number": numberSearch }, // Match companyNumber field
            { caNumber: numberSearch } // Match caNumber field
          ])
        ]
      };
    }

    // Add filtering based on companyNames and serviceNames if provided
    if (companyNames) {
      const companyNamesArray = companyNames.split(','); // Convert to array
      query["Company Name"] = { $in: companyNamesArray };
    }

    if (serviceNames) {
      const serviceNamesArray = serviceNames.split(','); // Convert to array
      query.serviceName = { $in: serviceNamesArray };
    }

    const skip = (page - 1) * limit; // Calculate how many documents to skip

    // Fetch data with pagination
    let response;
    if (activeTab === "General") {
      response = await RecruitmentModel.find({ ...query, mainCategoryStatus: activeTab })
        .sort({ fillingDate: -1 })
        .skip(skip)
        .limit(parseInt(limit));
    } else {
      response = await RecruitmentModel.find({ ...query, mainCategoryStatus: activeTab })
        .sort({ dateOfChangingMainStatus: -1 })
        .skip(skip)
        .limit(parseInt(limit));
    }

    const totalDocuments = await RecruitmentModel.countDocuments(query);

    const totalDocumentsGeneral = await RecruitmentModel.countDocuments({ ...query, mainCategoryStatus: "General" });
    const totalDocumentsUnderReview = await RecruitmentModel.countDocuments({ ...query, mainCategoryStatus: "UnderReview" });
    const totalDocumentsOnHold = await RecruitmentModel.countDocuments({ ...query, mainCategoryStatus: "On Hold" });
    const totalDocumentsDisqualified = await RecruitmentModel.countDocuments({ ...query, mainCategoryStatus: "Disqualified" });
    const totalDocumentsRejected = await RecruitmentModel.countDocuments({ ...query, mainCategoryStatus: "Rejected" });
    const totalDocumentsSelected = await RecruitmentModel.countDocuments({ ...query, mainCategoryStatus: "Selected" });
    //const totalDocuments = await RecruitmentModel.countDocuments({ ...query, mainCategoryStatus: "Approved" });

    res.status(200).json({
      data: response,
      totalDocuments,
      totalDocumentsGeneral,
      totalDocumentsUnderReview,
      totalDocumentsOnHold,
      totalDocumentsDisqualified,
      totalDocumentsRejected,
      totalDocumentsSelected,
      //totalDocumentsApproved,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalDocuments / limit)
    });
  } catch (error) {
    console.log("Error fetching data", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/uploads/:ename/:filename", (req, res) => {
  const filepath = req.params.filename;
  const ename = req.params.ename;
  const pdfPath = path.join(__dirname, `../RecruitmentApplicationForm/${ename}`, filepath);

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

router.post(`/update-substatus-recruiter-changegeneral/`, async (req, res) => {
  const {
    empName,
    empEmail,
    subCategoryStatus,
    mainCategoryStatus,
    previousMainCategoryStatus,
    previousSubCategoryStatus,
    dateOfChangingMainStatus,
    movedFromMainCategoryStatus,
    movedToMainCategoryStatus } = req.body;
  const socketIO = req.io;

  //console.log("here" , movedFromMainCategoryStatus,movedToMainCategoryStatus)

  try {
    const updatedCompany = await RecruitmentModel.findOneAndUpdate(
      {
        empFullName: empName,
        personal_email: empEmail
      },
      {
        subCategoryStatus: subCategoryStatus,
        mainCategoryStatus: mainCategoryStatus,
        lastActionDate: new Date(),
        dateOfChangingMainStatus: dateOfChangingMainStatus, // Ensure this field is included
        previousMainCategoryStatus: previousMainCategoryStatus,
        previousSubCategoryStatus: previousSubCategoryStatus
      },
      { new: true }
    );

    socketIO.emit('recruiter-general-status-updated', { empFullName: empName });
    res.status(200).json({ message: "Document updated successfully", data: updatedCompany });

  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/update-substatus-recruiter/`, async (req, res) => {
  const {
    empName,
    empEmail,
    subCategoryStatus,
    mainCategoryStatus,
    previousMainCategoryStatus,
    previousSubCategoryStatus,
    movedFromMainCategoryStatus,
    movedToMainCategoryStatus,
  } = req.body;
  const socketIO = req.io;
  //console.log(req.body);

  try {
    // Step 1: Find the company document in RMCertificationModel
    const company = await RecruitmentModel.findOne({
      empFullName: empName,
      personal_email: empEmail,
    });
   
    if (!company) {
      console.error("Company not found");
      return res.status(400).json({ message: "Company not found" });
    }

    // Determine the submittedOn date
    // let submittedOn = company.submittedOn;
    let updateFields = {}; // Fields to be updated

    if (subCategoryStatus !== "Undo") {
      // Conditionally include dateOfChangingMainStatus
      if (
        [
          "UnderReview",
          "Disqualified",
          "On Hold",
          "Rejected",
          "Selected",
        ].includes(subCategoryStatus)
      ) {
        updateFields.dateOfChangingMainStatus = new Date();
      }

      //Step 2: Update the RMCertificationModel document
      const updatedCompany = await RecruitmentModel.findOneAndUpdate(
        { empFullName: empName, personal_email: empEmail },
        {
          subCategoryStatus: subCategoryStatus,
          mainCategoryStatus: mainCategoryStatus,
          ...updateFields,
          previousMainCategoryStatus: previousMainCategoryStatus,
          previousSubCategoryStatus: previousSubCategoryStatus,
        },
        { new: true }
      );

     
      if (!updatedCompany) {
        console.error("Failed to save the updated document");
        return res
          .status(400)
          .json({ message: "Failed to save the updated document" });
      }
      // Emit socket event
      socketIO.emit("rm-general-status-updated", {
        empFullName: updatedCompany.empFullName,
        personal_email: updatedCompany.personal_email,
      });
      res.status(200).json({
        message: "Document updated successfully",
        data: updatedCompany,
      });
    } else {
      // If subCategoryStatus is "Undo", update with previous statuses and no new date
      const updatedCompany = await RecruitmentModel.findOneAndUpdate(
        { empFullName: empName, personal_email: empEmail },
        {
          subCategoryStatus:
            company.previousMainCategoryStatus === "General"
              ? "Untouched"
              : company.previousSubCategoryStatus,
          mainCategoryStatus: company.previousMainCategoryStatus,
          previousMainCategoryStatus: company.mainCategoryStatus,
          previousSubCategoryStatus: company.subCategoryStatus,
          lastActionDate: new Date(),
          submittedOn: company.submittedOn,
          dateOfChangingMainStatus: company.dateOfChangingMainStatus,
          Remarks: [],
          interViewStatus:""
        },
        { new: true }
      );

      if (!updatedCompany) {
        console.error("Failed to save the updated document");
        return res
          .status(400)
          .json({ message: "Failed to save the updated document" });
      }

      // Emit socket event
      socketIO.emit('recruiter-general-status-updated', { empFullName: empName });
      res.status(200).json({
        message: "Document updated successfully",
        data: updatedCompany,
      });
    }
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/update-interview-recuitment/`, async (req, res) => {
  const { empName, empEmail, interViewStatus } = req.body;
  //console.log("contentStatus", contentStatus, companyName, serviceName)
  const socketIO = req.io;

  try {
    // Find the company document
    const company = await RecruitmentModel.findOne(
      { empFullName: empName, 
        personal_email: empEmail 
      },
  );

    // Check if the company exists
    if (!company) {
      console.error("Company not found");
      return res.status(404).json({ message: "Company not found" });
    }

    // Determine the update values based on the contentStatus and brochureStatus
    let updateFields = { interViewStatus: interViewStatus };

    // Perform the update
    const updatedCompany = await RecruitmentModel.findOneAndUpdate(
      { empFullName: empName, 
        personal_email: empEmail 
      },
      updateFields,
      { new: true }
    );

    // Check if the update was successful
    if (!updatedCompany) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    // Send the response
    res
      .status(200)
      .json({ message: "Document updated successfully", data: updatedCompany });
  } catch (error) {
    console.error("Error updating document:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post(`/update-disqualified-recuitment/`, async (req, res) => {
  const { empName, empEmail, disqualificationReason } = req.body;
  //console.log("contentStatus", contentStatus, companyName, serviceName)
  const socketIO = req.io;

  try {
    // Find the company document
    const company = await RecruitmentModel.findOne(
      { 
        empFullName: empName, 
        personal_email: empEmail 
      },
  );

    // Check if the company exists
    if (!company) {
      console.error("Company not found");
      return res.status(404).json({ message: "Company not found" });
    }

    // Determine the update values based on the contentStatus and brochureStatus
    let updateFields = { disqualificationReason: disqualificationReason };

    // Perform the update
    const updatedCompany = await RecruitmentModel.findOneAndUpdate(
      { empFullName: empName, 
        personal_email: empEmail 
      },
      updateFields,
      { new: true }
    );

    // Check if the update was successful
    if (!updatedCompany) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    // Send the response
    res
      .status(200)
      .json({ message: "Document updated successfully", data: updatedCompany });
  } catch (error) {
    console.error("Error updating document:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post(`/post-save-interviewdate-recruiter/`, async (req, res) => {
  const { empName, empEmail,value } = req.body;
  //console.log("date", value);
  //console.log("dscStatus" ,email ,  currentCompanyName , currentServiceName)
  const socketIO = req.io;
  try {
    const company = await RecruitmentModel.findOneAndUpdate(
      { empFullName: empName, 
        personal_email: empEmail 
      },
      {
        interViewDate: new Date(value),
      },
      { new: true }
    );
    if (!company) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    res
      .status(200)
      .json({ message: "Document updated successfully", data: company });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/post-remarks-for-recruiter", async (req, res) => {
  const { empName, empEmail,changeRemarks, updatedOn } = req.body;

  try {
    const updateDocument = await RecruitmentModel.findOneAndUpdate(
      { empFullName: empName, 
        personal_email: empEmail 
      },
      {
        $push: {
          Remarks: {
            remarks: changeRemarks,
            updatedOn: updatedOn,
          },
        },
      },
      { new: true } // Return the updated document
    );

    if (!updateDocument) {
      return res.status(404).json({ message: "Document not found" });
    }

    res
      .status(200)
      .json({ message: "Remarks added successfully", data: updateDocument });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/delete-remark-recruiter", async (req, res) => {
  const { remarks_id, empName, empEmail} = req.body;

  try {
    const company = await RecruitmentModel.findOne(
      { empFullName: empName, 
        personal_email: empEmail 
      });

    if (!company) {
      return res.status(404).json({ message: "Company or service not found" });
    }

    // Remove the specific remark from the array
    const updatedRemarks = company.Remarks.filter(
      (remark) => remark._id.toString() !== remarks_id
    );

    // Update the company document
    await RecruitmentModel.updateOne(
      { empFullName: empName, 
        personal_email: empEmail 
      },
      { $set: { Remarks: updatedRemarks } }
    );

    res.status(200).json({ message: "Remark deleted successfully" });
  } catch (error) {
    console.error("Error deleting remark:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post(`/update-rejection-recuitment/`, async (req, res) => {
  const { empName, empEmail, rejectionReason } = req.body;
  //console.log("contentStatus", contentStatus, companyName, serviceName)
  const socketIO = req.io;

  try {
    // Find the company document
    const company = await RecruitmentModel.findOne(
      { 
        empFullName: empName, 
        personal_email: empEmail 
      },
  );

    // Check if the company exists
    if (!company) {
      console.error("Company not found");
      return res.status(404).json({ message: "Company not found" });
    }

    // Determine the update values based on the contentStatus and brochureStatus
    let updateFields = { rejectionReason: rejectionReason };

    // Perform the update
    const updatedCompany = await RecruitmentModel.findOneAndUpdate(
      { empFullName: empName, 
        personal_email: empEmail 
      },
      updateFields,
      { new: true }
    );

    // Check if the update was successful
    if (!updatedCompany) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    // Send the response
    res
      .status(200)
      .json({ message: "Document updated successfully", data: updatedCompany });
  } catch (error) {
    console.error("Error updating document:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post(`/update-department-recuitment/`, async (req, res) => {
  const { empName, empEmail, department } = req.body;
  //console.log("contentStatus", contentStatus, companyName, serviceName)
  const socketIO = req.io;

  try {
    // Find the company document
    const company = await RecruitmentModel.findOne(
      { 
        empFullName: empName, 
        personal_email: empEmail 
      },
  );

    // Check if the company exists
    if (!company) {
      console.error("Company not found");
      return res.status(404).json({ message: "Company not found" });
    }

    // Determine the update values based on the contentStatus and brochureStatus
    let updateFields = { department: department };

    // Perform the update
    const updatedCompany = await RecruitmentModel.findOneAndUpdate(
      { empFullName: empName, 
        personal_email: empEmail 
      },
      updateFields,
      { new: true }
    );

    // Check if the update was successful
    if (!updatedCompany) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    // Send the response
    res
      .status(200)
      .json({ message: "Document updated successfully", data: updatedCompany });
  } catch (error) {
    console.error("Error updating document:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post(`/post-save-offeredsalary/`, async (req, res) => {
  const { empName, empEmail, charges } = req.body;
  //console.log("dscStatus" ,email ,  currentCompanyName , currentServiceName)
  const socketIO = req.io;
  try {
    const company = await RecruitmentModel.findOneAndUpdate(
      { empFullName: empName, 
        personal_email: empEmail 
      },
      {
        offeredSalary: charges,
      },
      { new: true }
    );
    if (!company) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    // Emit socket event
    //console.log("Emitting event: rm-general-status-updated", { name: company.bdeName, companyName: companyName });
    //socketIO.emit('rm-general-status-updated', { name: company.bdeName, companyName: companyName })
    res
      .status(200)
      .json({ message: "Document updated successfully", data: company });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post(`/post-save-firstMonthSalaryCondition/`, async (req, res) => {
  const { empName, empEmail, charges } = req.body;
  //console.log("dscStatus" ,email ,  currentCompanyName , currentServiceName)
  const socketIO = req.io;
  try {
    const company = await RecruitmentModel.findOneAndUpdate(
      { empFullName: empName, 
        personal_email: empEmail 
      },
      {
        firstMonthSalaryCondition: charges,
      },
      { new: true }
    );
    if (!company) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    // Emit socket event
    //console.log("Emitting event: rm-general-status-updated", { name: company.bdeName, companyName: companyName });
    //socketIO.emit('rm-general-status-updated', { name: company.bdeName, companyName: companyName })
    res
      .status(200)
      .json({ message: "Document updated successfully", data: company });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post(`/post-save-joiningDate-recruiter/`, async (req, res) => {
  const { empName, empEmail,value } = req.body;
  //console.log("date", value);
  //console.log("dscStatus" ,email ,  currentCompanyName , currentServiceName)
  const socketIO = req.io;
  try {
    const company = await RecruitmentModel.findOneAndUpdate(
      { empFullName: empName, 
        personal_email: empEmail 
      },
      {
        jdate: new Date(value),
      },
      { new: true }
    );
    if (!company) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    res
      .status(200)
      .json({ message: "Document updated successfully", data: company });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(`/update-branch-recuitment/`, async (req, res) => {
  const { empName, empEmail, branchOffice } = req.body;
  //console.log("contentStatus", contentStatus, companyName, serviceName)
  const socketIO = req.io;

  try {
    // Find the company document
    const company = await RecruitmentModel.findOne(
      { 
        empFullName: empName, 
        personal_email: empEmail 
      },
  );

    // Check if the company exists
    if (!company) {
      console.error("Company not found");
      return res.status(404).json({ message: "Company not found" });
    }

    // Determine the update values based on the contentStatus and brochureStatus
    let updateFields = { branchOffice: branchOffice };

    // Perform the update
    const updatedCompany = await RecruitmentModel.findOneAndUpdate(
      { empFullName: empName, 
        personal_email: empEmail 
      },
      updateFields,
      { new: true }
    );

    // Check if the update was successful
    if (!updatedCompany) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    // Send the response
    res
      .status(200)
      .json({ message: "Document updated successfully", data: updatedCompany });
  } catch (error) {
    console.error("Error updating document:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post(`/update-offerletterstatus-recuitment/`, async (req, res) => {
  const { empName, empEmail, offerLetterStatus } = req.body;
  //console.log("contentStatus", contentStatus, companyName, serviceName)
  const socketIO = req.io;

  try {
    // Find the company document
    const company = await RecruitmentModel.findOne(
      { 
        empFullName: empName, 
        personal_email: empEmail 
      },
  );

    // Check if the company exists
    if (!company) {
      console.error("Company not found");
      return res.status(404).json({ message: "Company not found" });
    }

    // Determine the update values based on the contentStatus and brochureStatus
    let updateFields = { offerLetterStatus: offerLetterStatus };

    // Perform the update
    const updatedCompany = await RecruitmentModel.findOneAndUpdate(
      { empFullName: empName, 
        personal_email: empEmail 
      },
      updateFields,
      { new: true }
    );

    // Check if the update was successful
    if (!updatedCompany) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    // Send the response
    res
      .status(200)
      .json({ message: "Document updated successfully", data: updatedCompany });
  } catch (error) {
    console.error("Error updating document:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post(`/update-documentsSubmitted-recuitment/`, async (req, res) => {
  const { empName, empEmail, documentsSubmitted } = req.body;
  //console.log("contentStatus", contentStatus, companyName, serviceName)
  const socketIO = req.io;

  try {
    // Find the company document
    const company = await RecruitmentModel.findOne(
      { 
        empFullName: empName, 
        personal_email: empEmail 
      },
  );

    // Check if the company exists
    if (!company) {
      console.error("Company not found");
      return res.status(404).json({ message: "Company not found" });
    }

    // Determine the update values based on the contentStatus and brochureStatus
    let updateFields = { documentsSubmitted: documentsSubmitted };

    // Perform the update
    const updatedCompany = await RecruitmentModel.findOneAndUpdate(
      { empFullName: empName, 
        personal_email: empEmail 
      },
      updateFields,
      { new: true }
    );

    // Check if the update was successful
    if (!updatedCompany) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    // Send the response
    res
      .status(200)
      .json({ message: "Document updated successfully", data: updatedCompany });
  } catch (error) {
    console.error("Error updating document:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post(`/update-employementStatus-recuitment/`, async (req, res) => {
  const { empName, empEmail, employementStatus } = req.body;
  //console.log("contentStatus", contentStatus, companyName, serviceName)
  const socketIO = req.io;

  try {
    // Find the company document
    const company = await RecruitmentModel.findOne(
      { 
        empFullName: empName, 
        personal_email: empEmail 
      },
  );

    // Check if the company exists
    if (!company) {
      console.error("Company not found");
      return res.status(404).json({ message: "Company not found" });
    }

    // Determine the update values based on the contentStatus and brochureStatus
    let updateFields = { employementStatus: employementStatus };

    // Perform the update
    const updatedCompany = await RecruitmentModel.findOneAndUpdate(
      { empFullName: empName, 
        personal_email: empEmail 
      },
      updateFields,
      { new: true }
    );

    // Check if the update was successful
    if (!updatedCompany) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    // Send the response
    res
      .status(200)
      .json({ message: "Document updated successfully", data: updatedCompany });
  } catch (error) {
    console.error("Error updating document:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post(`/post-save-exitDate-recruiter/`, async (req, res) => {
  const { empName, empEmail,value } = req.body;
  //console.log("date", value);
  //console.log("dscStatus" ,email ,  currentCompanyName , currentServiceName)
  const socketIO = req.io;
  try {
    const company = await RecruitmentModel.findOneAndUpdate(
      { empFullName: empName, 
        personal_email: empEmail 
      },
      {
        exitDate: new Date(value),
      },
      { new: true }
    );
    if (!company) {
      console.error("Failed to save the updated document");
      return res
        .status(400)
        .json({ message: "Failed to save the updated document" });
    }

    res
      .status(200)
      .json({ message: "Document updated successfully", data: company });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;