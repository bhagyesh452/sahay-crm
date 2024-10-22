var express = require("express");
var router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const adminModel = require("../models/Admin.js");
const PerformanceReportModel = require("../models/MonthlyPerformanceReportModel.js");
const TodaysProjectionModel = require("../models/TodaysGeneralProjection.js");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const EmployeeHistory = require("../models/EmployeeHistory");
const json2csv = require("json2csv").parse;
const deletedEmployeeModel = require("../models/DeletedEmployee.js");
const RedesignedLeadformModel = require("../models/RedesignedLeadform");
const CallingModel = require("../models/EmployeeCallingData.js");
const lastEmployeeIdsModel = require("../models/LastEmployeeId.js");
const cron = require('node-cron');
const axios = require('axios');
const fetch = require('node-fetch');
const { previousDay } = require("date-fns");
require('dotenv').config();
const { sendMailEmployees } = require("./sendMailEmployees");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // Determine the destination path based on the fieldname and company name
//     // const employeeName = req.params.employeeName;
//     const {firstName, lastName} = req.body;
//     const empName = `${firstName} ${lastName}`;
//     let destinationPath = "";

//     if (file.fieldname === "file" && empName) {
//       // destinationPath = `EmployeeImages/${employeeName}`;
//       destinationPath = `EmployeeDocs/${empName}`;
//     }

//     // Create the directory if it doesn't exist
//     if (!fs.existsSync(destinationPath)) {
//       fs.mkdirSync(destinationPath, { recursive: true });
//     }

//     cb(null, destinationPath);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now();
//     cb(null, uniqueSuffix + "-" + `${empName}-${file.originalname}`);
//   },
// });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // const { firstName, lastName } = req.body;
    // const empName = `${firstName}-${lastName}`;
    const { empId } = req.params;
    let destinationPath = "";

    if (file.fieldname && empId) {
      destinationPath = `EmployeeDocs/${empId}`;
    }

    // Create the directory if it doesn't exist
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }

    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    // const { firstName, lastName } = req.body;
    // const empName = `${firstName}-${lastName}`;
    const { empId } = req.params;
    const uniqueSuffix = Date.now();
    cb(null, `${uniqueSuffix}-${empId}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

router.put("/online-status/:id/:socketID", async (req, res) => {
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

router.post("/employee-history", async (req, res) => {
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

router.post("/post-bdmwork-request/:eid", async (req, res) => {
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

router.post("/post-bdmwork-revoke/:eid", async (req, res) => {
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

router.post("/einfo", upload.fields([
  { name: "offerLetter", maxCount: 1 },
  { name: "aadharCard", maxCount: 1 },
  { name: "panCard", maxCount: 1 },
  { name: "educationCertificate", maxCount: 1 },
  { name: "relievingCertificate", maxCount: 1 },
  { name: "salarySlip", maxCount: 1 },
  { name: "profilePhoto", maxCount: 1 },
]), async (req, res) => {
  try {
    // Step 1: Get the lastEmployeeId from lastEmployeeIdsModel
    let lastEmployeeIdRecord = await lastEmployeeIdsModel.findOne();
    // console.log("lastEmployeeIdRecord :", lastEmployeeIdRecord);

    // Step 2: Get the total count of employees
    const totalEmployees = await adminModel.countDocuments({});
    // console.log("totalEmployees :", totalEmployees);

    let newEmployeeID;

    // Step 3: If no record exists, generate employee ID from scratch, else increment the last one
    if (lastEmployeeIdRecord.lastEmployeeId === "SSPL0000") {
      // No last employee ID found, start with SSPL0001 + total count
      newEmployeeID = `SSPL${(totalEmployees + 1).toString().padStart(4, '0')}`;

      // Update lastEmployeeId in the collection with the new ID
      await lastEmployeeIdsModel.updateOne({}, { $set: { lastEmployeeId: newEmployeeID } });
    } else {
      // Last employee ID found, increment by 1
      let lastEmployeeID = lastEmployeeIdRecord.lastEmployeeId;

      // Extract the number part and increment
      let employeeNumber = parseInt(lastEmployeeID.replace("SSPL", ""), 10) + 1;

      // Generate new employee ID
      newEmployeeID = `SSPL${employeeNumber.toString().padStart(4, '0')}`;

      // Update lastEmployeeId in the collection with the new ID
      await lastEmployeeIdsModel.updateOne({}, { $set: { lastEmployeeId: newEmployeeID } });
    }

    const { personalInfo, employeementInfo, payrollInfo, emergencyInfo, empDocumentInfo, empId, employeeID, oldDesignation } = req.body;
    // console.log("Personal Info is :", personalInfo);
    // console.log("Employeement Info is :", employeementInfo);
    // console.log("Payroll info is :", payrollInfo);
    // console.log("Emergency info is :", emergencyInfo);
    // console.log("Employee document info is :", empDocumentInfo);
    // console.log("Employee id is :", empId);

    const getFileDetails = (fileArray) => fileArray ? fileArray.map(file => ({
      fieldname: file.fieldname,
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      destination: file.destination,
      filename: file.filename,
      path: file.path,
      size: file.size
    })) : [];

    const payrollInfoArray = Array.isArray(payrollInfo) ? payrollInfo : [payrollInfo];
    payrollInfoArray.forEach(info => {
      if (req?.files && req.files["offerLetter"]) {
        info.offerLetter = getFileDetails(req.files["offerLetter"]);
      }
    });

    const empDocumentInfoArray = Array.isArray(empDocumentInfo) ? empDocumentInfo : [empDocumentInfo];
    empDocumentInfoArray.forEach(info => {
      if (info?.fieldname === 'aadharCard') {
        info.aadharCard = getFileDetails(req.files ? req.files["aadharCard"] : []);
      } else if (info?.fieldname === 'panCard') {
        info.panCard = getFileDetails(req.files ? req.files["panCard"] : []);
      } else if (info?.fieldname === 'educationCertificate') {
        info.educationCertificate = getFileDetails(req.files ? req.files["educationCertificate"] : []);
      } else if (info?.fieldname === 'relievingCertificate') {
        info.relievingCertificate = getFileDetails(req.files ? req.files["relievingCertificate"] : []);
      } else if (info?.fieldname === 'salarySlip') {
        info.salarySlip = getFileDetails(req.files ? req.files["salarySlip"] : []);
      } else if (info?.fieldname === 'profilePhoto') {
        info.profilePhoto = getFileDetails(req.files ? req.files["profilePhoto"] : []);
      }
    });

    let newDesignation = employeementInfo?.designation || oldDesignation;

    if ((employeementInfo?.designation || oldDesignation) === "Business Development Executive" || employeementInfo?.designation === "Business Development Manager") {
      newDesignation = "Sales Executive";
    } else if ((employeementInfo?.designation || oldDesignation) === "Floor Manager") {
      newDesignation = "Sales Manager";
    } else if ((employeementInfo?.designation || oldDesignation) === "Data Analyst") {
      newDesignation = "Data Manager";
    } else if ((employeementInfo?.designation || oldDesignation) === "Admin Head") {
      newDesignation = "RM-Certification";
    } else if ((employeementInfo?.designation || oldDesignation) === "HR Manager") {
      newDesignation = "HR";
    } else {
      newDesignation = employeementInfo?.designation || oldDesignation;
    }

    const emp = {
      ...req.body,
      AddedOn: new Date(),
      _id: empId,
      employeeID: employeeID || newEmployeeID,

      ...(personalInfo?.firstName || personalInfo?.middleName || personalInfo?.lastName) && {
        ename: `${personalInfo?.firstName || ""} ${personalInfo?.lastName || ""}`,
        empFullName: `${personalInfo.firstName || ""} ${personalInfo.middleName || ""} ${personalInfo.lastName || ""}`
      },
      ...(personalInfo?.dob && { dob: personalInfo.dob }),
      ...(personalInfo?.gender && { gender: personalInfo.gender }),
      ...(personalInfo?.personalPhoneNo && { personal_number: personalInfo.personalPhoneNo }),
      ...(personalInfo?.personalEmail && { personal_email: personalInfo.personalEmail }),
      ...(personalInfo?.currentAddress && { currentAddress: personalInfo.currentAddress }),
      ...(personalInfo?.permanentAddress && { permanentAddress: personalInfo.permanentAddress }),
      ...(personalInfo?.bloodGroup && { bloodGroup: personalInfo.bloodGroup }),

      ...(employeementInfo?.empId && { empID: employeementInfo.empId }),
      ...(employeementInfo?.department && { department: employeementInfo.department }),
      ...(employeementInfo?.designation && { newDesignation: employeementInfo.designation }),
      ...({ designation: newDesignation }),
      ...(employeementInfo?.designation && {
        bdmWork:
          employeementInfo.designation === "Business Development Manager" ||
            employeementInfo.designation === "Floor Manager" ||
            oldDesignation === "Business Development Manager" ||
            oldDesignation === "Floor Manager" ? true : false
      }),
      ...(employeementInfo?.joiningDate && { jdate: employeementInfo.joiningDate }),
      ...(employeementInfo?.branch && { branchOffice: employeementInfo.branch }),
      ...(employeementInfo?.employeementType && { employeementType: employeementInfo.employeementType }),
      ...(employeementInfo?.manager && { reportingManager: employeementInfo.manager }),
      ...(employeementInfo?.officialNo && { number: employeementInfo.officialNo }),
      ...(employeementInfo?.officialEmail && { email: employeementInfo.officialEmail }),

      ...(payrollInfo?.accountNo && { accountNo: payrollInfo.accountNo }),
      ...(payrollInfo?.nameAsPerBankRecord && { nameAsPerBankRecord: payrollInfo.nameAsPerBankRecord }),
      ...(payrollInfo?.ifscCode && { ifscCode: payrollInfo.ifscCode }),
      ...(payrollInfo?.salary && { salary: payrollInfo.salary }),
      ...(payrollInfo?.firstMonthSalaryCondition && { firstMonthSalaryCondition: payrollInfo.firstMonthSalaryCondition }),
      ...(payrollInfo?.firstMonthSalary && { firstMonthSalary: payrollInfo.firstMonthSalary }),
      ...(payrollInfo?.panNumber && { panNumber: payrollInfo.panNumber }),
      ...(payrollInfo?.aadharNumber && { aadharNumber: payrollInfo.aadharNumber }),
      ...(payrollInfo?.uanNumber && { uanNumber: payrollInfo.uanNumber }),

      ...(emergencyInfo?.personName && { personal_contact_person: emergencyInfo.personName }),
      ...(emergencyInfo?.relationship && { personal_contact_person_relationship: emergencyInfo.relationship }),
      ...(emergencyInfo?.personPhoneNo && { personal_contact_person_number: emergencyInfo.personPhoneNo }),

      ...(payrollInfo?.offerLetter?.length > 0 && { offerLetter: payrollInfo.offerLetter || [] }),
      ...(empDocumentInfo?.aadharCard?.length > 0 && { aadharCard: empDocumentInfo.aadharCard || [] }),
      ...(empDocumentInfo?.panCard?.length > 0 && { panCard: empDocumentInfo.panCard || [] }),
      ...(empDocumentInfo?.educationCertificate?.length > 0 && { educationCertificate: empDocumentInfo.educationCertificate || [] }),
      ...(empDocumentInfo?.relievingCertificate?.length > 0 && { relievingCertificate: empDocumentInfo.relievingCertificate || [] }),
      ...(empDocumentInfo?.salarySlip?.length > 0 && { salarySlip: empDocumentInfo.salarySlip || [] }),
      ...(empDocumentInfo?.profilePhoto?.length > 0 && { profilePhoto: empDocumentInfo.profilePhoto || [] })
    };

    const result = await adminModel.create(emp);
    res.json(result); // Ensure you respond with the result

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post('/addemployee/hrside', async (req, res) => {
  try {
    // Extract employee details from request body
    const {
      email,
      number,
      ename,
      empFullName,
      department,
      oldDesignation,
      newDesignation,
      branchOffice,
      reportingManager,
      password,
      jdate,
      AddedOn,
      targetDetails,
      salary,
      gender,
      bdmWork
    } = req.body;
    console.log("adddedOn" , AddedOn)
    const newAddedOn = new Date(AddedOn);
    console.log("Received request for adding employee:", req.body);
    // Step 1: Find the record of the last generated employee ID
    let lastEmployeeIdRecord = await lastEmployeeIdsModel.findOne({});

    // Step 2: Get the total number of employees
    let totalEmployees = await adminModel.countDocuments();

    // Step 3: If no record exists, generate employee ID from scratch, else increment the last one
    let newEmployeeID;
    if (!lastEmployeeIdRecord || lastEmployeeIdRecord.lastEmployeeId === "SSPL0000") {
      // No last employee ID found, start with SSPL0001 + total count
      newEmployeeID = `SSPL${(totalEmployees + 1).toString().padStart(4, '0')}`;

      // Update or insert the lastEmployeeId in the collection with the new ID
      if (lastEmployeeIdRecord) {
        await lastEmployeeIdsModel.updateOne({}, { $set: { lastEmployeeId: newEmployeeID } });
      } else {
        await lastEmployeeIdsModel.create({ lastEmployeeId: newEmployeeID });
      }
    } else {
      // Last employee ID found, increment by 1
      let lastEmployeeID = lastEmployeeIdRecord.lastEmployeeId;

      // Extract the number part and increment
      let employeeNumber = parseInt(lastEmployeeID.replace("SSPL", ""), 10) + 1;

      // Generate new employee ID
      newEmployeeID = `SSPL${employeeNumber.toString().padStart(4, '0')}`;

      // Update lastEmployeeId in the collection with the new ID
      await lastEmployeeIdsModel.updateOne({}, { $set: { lastEmployeeId: newEmployeeID } });
    }

    // Step 4: Create a new employee document
    const newEmployee = new adminModel({
      email,
      number,
      employeeID: newEmployeeID,
      ename,
      empFullName,
      department,
      designation: oldDesignation,
      newDesignation,
      branchOffice,
      reportingManager,
      password,
      jdate,
      AddedOn: newAddedOn,
      targetDetails,
      bdmWork,
      salary,
      gender
    });

  console.log("newemployee" , newEmployee);

    // Step 5: Save the new employee to the database
    const result = await newEmployee.save();
    // Step 6: Send welcome email to the new employee
    const subject = `Welcome to Startup Sahay! Your CRM Login Details`;
    const html = `
        <p>Dear ${ename},</p>
        <p>Welcome to the team at Startup Sahay Private Limited! We’re excited to have you onboard.</p>
        <p>As part of your onboarding process, we’ve created your account in our CRM system to help you manage and track your tasks efficiently. Below are your login details:</p>
        <ul>
            <li>CRM URL: startupsahay.in</li>
            <li><b>Username:</b> ${email}</li>
            <li><b>Password:</b> ${password}</li>
        </ul>
         <p>How to Access the CRM:</p>
         <p> - Go to startupsahay.in.</p>
         <p> - Enter your business email ID as your username.</p>
         <p> - Use password mentioned above to log in</p>

         <p>If you encounter any issues while logging in or have any questions, feel free to reach out to the HR team or your team head.</p>
         <p>We’re here to help ensure you have a smooth start. Welcome again to Startup Sahay, and we look forward to working with you!</p>
           
        <p>Best regards,<br>HR Team</br><br>Start-Up Sahay Private Limited</p>
    `;

    // Send email using the sendMailEmployees function
    try {
      const emailInfo = await sendMailEmployees(
        [email],
        subject,
        "", // Empty text (use HTML version instead)
        html
      );

      console.log(`Email sent: ${emailInfo.messageId}`);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return res.status(500).json({ message: 'Employee added but email sending failed.' });
    }

    // Step 7: Send response
    res.status(200).json({
      message: "Employee created successfully",
      data: newEmployee
    });

  } catch (error) {
    console.log("Error creating employee:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
});

// router.post('/hr-bulk-add-employees', async (req, res) => {
//   try {
//     const { employeesData } = req.body;
//     console.log("employeesData", employeesData);

//     if (!employeesData || !Array.isArray(employeesData)) {
//       return res.status(400).json({ message: 'Invalid data format' });
//     }

//     let successCount = 0;
//     let failureCount = 0;
//     let failureDetails = [];

//     // Array to hold the promises for inserting each employee
//     const employeeInsertPromises = employeesData.map(async (employee) => {
//       try {
//         // Generate new employee ID using the existing logic
//         let lastEmployeeIdRecord = await lastEmployeeIdsModel.findOne({});
//         let totalEmployees = await adminModel.countDocuments();
//         let newEmployeeID;

//         if (!lastEmployeeIdRecord || lastEmployeeIdRecord.lastEmployeeId === "SSPL0000") {
//           newEmployeeID = `SSPL${(totalEmployees + 1).toString().padStart(4, '0')}`;
//           if (lastEmployeeIdRecord) {
//             await lastEmployeeIdsModel.updateOne({}, { $set: { lastEmployeeId: newEmployeeID } });
//           } else {
//             await lastEmployeeIdsModel.create({ lastEmployeeId: newEmployeeID });
//           }
//         } else {
//           let lastEmployeeID = lastEmployeeIdRecord.lastEmployeeId;
//           let employeeNumber = parseInt(lastEmployeeID.replace("SSPL", ""), 10) + 1;
//           newEmployeeID = `SSPL${employeeNumber.toString().padStart(4, '0')}`;
//           await lastEmployeeIdsModel.updateOne({}, { $set: { lastEmployeeId: newEmployeeID } });
//         }

//         // Generate a random password for the employee
//         const generateRandomPassword = (firstName) => {
//           const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit random number
//           return `${firstName}@Sahay#${randomNumber}`;
//         };
//         const generatedPassword = generateRandomPassword(employee.firstName);

//         // Add the new employee ID and password to the employee object
//         employee.employeeID = newEmployeeID;
//         employee.password = generatedPassword;

//         // Create a new employee document and save it to the database
//         const newEmployee = new adminModel(employee);
//         console.log("newEmployee", newEmployee);
//         await newEmployee.save();

//         // Step 6: Send welcome email to the new employee
//         const subject = `Welcome to Startup Sahay! Your CRM Login Details`;
//         const html = `
//           <p>Dear ${employee.firstName},</p>
//           <p>Welcome to the team at Startup Sahay Private Limited! We’re excited to have you onboard.</p>
//           <p>As part of your onboarding process, we’ve created your account in our CRM system to help you manage and track your tasks efficiently. Below are your login details:</p>
//           <ul>
//               <li><b>CRM URL:</b> <a href="https://startupsahay.in" target="_blank">https://startupsahay.in</a></li>
//               <li><b>Username:</b> ${employee.email}</li>
//               <li><b>Password:</b> ${generatedPassword}</li>
//           </ul>
//           <p>How to Access the CRM:</p>
//           <p>- Go to startupsahay.in.</p>
//           <p>- Enter your business email ID as your username.</p>
//           <p>- Use the password mentioned above to log in.</p>
//           <p>If you encounter any issues while logging in or have any questions, feel free to reach out to the HR team or your team head.</p>
//           <p>We’re here to help ensure you have a smooth start. Welcome again to Startup Sahay, and we look forward to working with you!</p>
//           <p>Best regards,<br>HR Team<br>Start-Up Sahay Private Limited</p>
//         `;

//         // Send email using the sendMailEmployees function
//         try {
//           const emailInfo = await sendMailEmployees(
//             [employee.email],
//             subject,
//             "", // Empty text (use HTML version instead)
//             html
//           );
//           console.log(`Email sent: ${emailInfo.messageId}`);
//         } catch (emailError) {
//           console.error('Error sending email:', emailError);
//           // Log error, but do not stop the loop for other employees
//         }

//         successCount++; // Increment success count if save was successful

//       } catch (error) {
//         console.error('Error adding employee:', employee.email, error.message);
//         failureCount++; // Increment failure count if an error occurred
//         failureDetails.push({
//           email: employee.email,
//           error: error.message
//         });
//       }
//     });

//     // Wait for all employees to be added
//     await Promise.all(employeeInsertPromises);

//     res.status(200).json({
//       message: 'Employees processed successfully',
//       successCount,
//       failureCount,
//       failureDetails
//     });
//   } catch (error) {
//     console.error('Error adding employees:', error.message);
//     res.status(500).json({ message: 'Internal server error', error: error.message });
//   }
// });

router.post('/hr-bulk-add-employees', async (req, res) => {
  try {
    const { employeesData } = req.body;

    if (!employeesData || !Array.isArray(employeesData)) {
      return res.status(400).json({ message: 'Invalid data format' });
    }

    let successCount = 0;
    let failureCount = 0;
    let failureDetails = [];

    // Fetch the last employee ID record once
    let lastEmployeeIdRecord = await lastEmployeeIdsModel.findOne({});
    let lastEmployeeID = lastEmployeeIdRecord ? lastEmployeeIdRecord.lastEmployeeId : "SSPL0000";

    let employeeNumber = parseInt(lastEmployeeID.replace("SSPL", ""), 10); // Extract the numeric part of the employee ID

    // Array to hold the promises for inserting each employee
    const employeeInsertPromises = employeesData.map(async (employee) => {
      try {
        // Increment the employee number for each new employee
        employeeNumber += 1;
        let newEmployeeID = `SSPL${employeeNumber.toString().padStart(4, '0')}`;

        // Generate a random password for the employee
        const generateRandomPassword = (firstName) => {
          const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit random number
          return `${firstName}@Sahay#${randomNumber}`;
        };
        const generatedPassword = generateRandomPassword(employee.firstName);

        // Add the new employee ID and password to the employee object
        employee.employeeID = newEmployeeID;
        employee.password = generatedPassword;

        // Create a new employee document and save it to the database
        const newEmployee = new adminModel(employee);
        await newEmployee.save();

        // Send the welcome email (same as in your original code)
        const subject = `Welcome to Startup Sahay! Your CRM Login Details`;
        const html = `
          <p>Dear ${employee.firstName},</p>
          <p>Welcome to the team at Startup Sahay Private Limited! We’re excited to have you onboard.</p>
          <p>As part of your onboarding process, we’ve created your account in our CRM system to help you manage and track your tasks efficiently. Below are your login details:</p>
          <ul>
              <li><b>CRM URL:</b> <a href="https://startupsahay.in" target="_blank">https://startupsahay.in</a></li>
              <li><b>Username:</b> ${employee.email}</li>
              <li><b>Password:</b> ${generatedPassword}</li>
          </ul>
          <p>How to Access the CRM:</p>
          <p>- Go to startupsahay.in.</p>
          <p>- Enter your business email ID as your username.</p>
          <p>- Use the password mentioned above to log in.</p>
          <p>If you encounter any issues while logging in or have any questions, feel free to reach out to the HR team or your team head.</p>
          <p>We’re here to help ensure you have a smooth start. Welcome again to Startup Sahay, and we look forward to working with you!</p>
          <p>Best regards,<br>HR Team<br>Start-Up Sahay Private Limited</p>
        `;

        try {
          const emailInfo = await sendMailEmployees([employee.email], subject, "", html);
          console.log(`Email sent: ${emailInfo.messageId}`);
        } catch (emailError) {
          console.error('Error sending email:', emailError);
        }

        successCount++;

      } catch (error) {
        console.error('Error adding employee:', employee.email, error.message);
        failureCount++;
        failureDetails.push({
          email: employee.email,
          error: error.message
        });
      }
    });

    // Wait for all employees to be added
    await Promise.all(employeeInsertPromises);

    // After all employees are processed, update the last employee ID to the highest one generated
    let finalEmployeeID = `SSPL${employeeNumber.toString().padStart(4, '0')}`;
    await lastEmployeeIdsModel.updateOne({}, { $set: { lastEmployeeId: finalEmployeeID } });

    res.status(200).json({
      message: 'Employees processed successfully',
      successCount,
      failureCount,
      failureDetails
    });
  } catch (error) {
    console.error('Error adding employees:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});



// router.post("/einfo", async (req, res) => {
//   try {
//     const { firstName, middleName, lastName, personalPhoneNo, personalEmail } = req.body;
//     const updateData = {
//       ...req.body,
//       ename: `${firstName} ${middleName} ${lastName}`,
//       personal_number: personalPhoneNo,
//       personal_email: personalEmail,
//       AddedOn: new Date()
//     };

//     // Check if the document already exists and update it, otherwise create a new one
//     const result = await adminModel.findOneAndUpdate(
//       { personal_email: personalEmail },
//       updateData,
//       { new: true, upsert: true } // upsert option creates a new document if no match is found
//     );

//     res.json(result);
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// Fetch employees from id :
router.get("/fetchEmployeeFromId/:empId", async (req, res) => {
  const { empId } = req.params;
  try {
    const emp = await adminModel.findById(empId);
    if (!emp) {
      res.status(404).json({ result: false, message: "Employee not found" });
    } else {
      res.status(200).json({ result: true, message: "Employee fetched successfully", data: emp });
    }
  } catch (error) {
    res.status(500).json({ result: true, message: "Error fetching employee", error: error });
  }
});

// Fetch Profile Photo :
router.get("/fetchProfilePhoto/:empId/:filename", (req, res) => {
  const { empId, filename } = req.params;
  const pdfPath = path.join(
    __dirname,
    `../EmployeeDocs/${empId}/${filename}`
  );

  // Check if the file exists
  fs.access(pdfPath, fs.constants.F_OK, (err) => {
    if (err) {
      // console.error(err);
      return res.status(404).json({ error: "File not found" });
    }

    // If the file exists, send it
    res.sendFile(pdfPath);
  });
});

router.get("/fetchEmployeeDocuments/:empId/:filename", (req, res) => {
  const { empId, filename } = req.params;
  const pdfPath = path.join(
    __dirname,
    `../EmployeeDocs/${empId}/${filename}`
  );

  // Check if the file exists
  fs.access(pdfPath, fs.constants.F_OK, (err) => {
    if (err) {
      // console.error(err);
      return res.status(404).json({ error: "File not found" });
    }

    // If the file exists, send it
    res.sendFile(pdfPath);
  });
});

router.put("/updateEmployeeFromId/:empId", upload.fields([
  { name: "offerLetter", maxCount: 1 },
  { name: "aadharCard", maxCount: 1 },
  { name: "panCard", maxCount: 1 },
  { name: "educationCertificate", maxCount: 1 },
  { name: "relievingCertificate", maxCount: 1 },
  { name: "salarySlip", maxCount: 1 },
  { name: "profilePhoto", maxCount: 1 },
]), async (req, res) => {

  const { empId } = req.params;
  const {
    firstName,
    middleName,
    lastName,
    dob,
    bloodGroup,
    personalPhoneNo,
    personalEmail,
    employeeID,
    department,
    designation,
    oldDesignation,
    employeementType,
    officialNo,
    officialEmail,
    joiningDate,
    branch,
    manager,
    nameAsPerBankRecord,
    salary,
    firstMonthSalaryCondition,
    firstMonthSalary,
    personName,
    relationship,
    personPhoneNo
  } = req.body;
  // console.log("Reqest file is :", req.files);

  const getFileDetails = (fileArray) => fileArray ? fileArray.map(file => ({
    fieldname: file.fieldname,
    originalname: file.originalname,
    encoding: file.encoding,
    mimetype: file.mimetype,
    destination: file.destination,
    filename: file.filename,
    path: file.path,
    size: file.size
  })) : [];

  const offerLetterDetails = getFileDetails(req.files ? req.files["offerLetter"] : []);
  const aadharCardDetails = getFileDetails(req.files ? req.files["aadharCard"] : []);
  const panCardDetails = getFileDetails(req.files ? req.files["panCard"] : []);
  const educationCertificateDetails = getFileDetails(req.files ? req.files["educationCertificate"] : []);
  const relievingCertificateDetails = getFileDetails(req.files ? req?.files["relievingCertificate"] : []);
  const salarySlipDetails = getFileDetails(req.files ? req?.files["salarySlip"] : []);
  const profilePhotoDetails = getFileDetails(req.files ? req?.files["profilePhoto"] : []);

  try {
    if (!empId) {
      return res.status(404).json({ result: false, message: "Employee not found" });
    }

    let newDesignation = designation;

    if ((designation || oldDesignation) === "Business Development Executive" || (designation || oldDesignation) === "Business Development Manager") {
      newDesignation = "Sales Executive";
    } else if ((designation || oldDesignation) === "Floor Manager") {
      newDesignation = "Sales Manager";
    } else if ((designation || oldDesignation) === "Data Analyst") {
      newDesignation = "Data Manager";
    } else if ((designation || oldDesignation) === "Admin Head") {
      newDesignation = "RM-Certification";
    } else if ((designation || oldDesignation) === "HR Manager") {
      newDesignation = "HR";
    } else {
      newDesignation = designation || oldDesignation;
    }

    const updateFields = {
      ...req.body,

      ...(firstName || middleName || lastName) && {
        ename: `${firstName || ""} ${lastName || ""}`,
        empFullName: `${firstName || ""} ${middleName || ""} ${lastName || ""}`
      },
      ...(dob && { dob }),
      ...(bloodGroup && { bloodGroup: bloodGroup }),
      ...(personalPhoneNo && { personal_number: personalPhoneNo }),
      ...(personalEmail && { personal_email: personalEmail }),

      ...(officialNo && { number: officialNo }),
      ...(officialEmail && { email: officialEmail }),
      ...(joiningDate && { jdate: joiningDate }),
      ...(branch && { branchOffice: branch }),
      ...(manager && { reportingManager: manager }),
      ...(employeeID && { employeeID: employeeID }),
      ...(department && { department: department }),
      ...(employeementType && { employeementType: employeementType }),
      ...(designation && { newDesignation: designation }),
      ...(designation && { designation: newDesignation }),
      ...(designation && {
        bdmWork:
          designation === "Business Development Manager" ||
            designation === "Floor Manager" ||
            oldDesignation === "Business Development Manager" ||
            oldDesignation === "Floor Manager" ? true : false
      }),

      ...(nameAsPerBankRecord && { nameAsPerBankRecord: nameAsPerBankRecord }),
      ...(salary && { salary }),
      ...(firstMonthSalaryCondition && { firstMonthSalaryCondition: firstMonthSalaryCondition }),
      ...(firstMonthSalary && { firstMonthSalary: firstMonthSalary }),

      ...(personName && { personal_contact_person: personName }),
      ...(relationship && { personal_contact_person_relationship: relationship }),
      ...(personPhoneNo && { personal_contact_person_number: personPhoneNo }),

      ...(offerLetterDetails.length > 0 && { offerLetter: offerLetterDetails }),
      ...(aadharCardDetails.length > 0 && { aadharCard: aadharCardDetails }),
      ...(panCardDetails.length > 0 && { panCard: panCardDetails }),
      ...(educationCertificateDetails.length > 0 && { educationCertificate: educationCertificateDetails }),
      ...(relievingCertificateDetails.length > 0 && { relievingCertificate: relievingCertificateDetails }),
      ...(salarySlipDetails.length > 0 && { salarySlip: salarySlipDetails }),
      ...(profilePhotoDetails.length > 0 && { profilePhoto: profilePhotoDetails })
    };

    const emp = await adminModel.findOneAndUpdate(
      { _id: empId },
      updateFields,
      { new: true } // Return the updated document
    );

    if (!emp) {
      console.log("Employee not found");
      return res.status(404).json({ result: false, message: "Employee not found" });
    }

    res.status(200).json({ result: true, message: "Data successfully updated", data: emp });
  } catch (error) {
    console.log("Error updating employee:", error);
    res.status(500).json({ result: false, message: "Error updating employee", error: error.message });
  }
});

// router.put("/savedeletedemployee", async (req, res) => {
//   const { dataToDelete } = req.body;

//   if (!dataToDelete || dataToDelete.length === 0) {
//     return res.status(400).json({ error: "No employee data to save" });
//   }
//   try {
//     const newLeads = await Promise.all(
//       dataToDelete.map(async (data) => {
//         // Retain the original _id
//         const newData = {
//           ...data,
//           _id: data._id,
//           deletedDate: new Date().toISOString(),
//         };

//         // Create a new document in the deletedEmployeeModel with the same _id
//         return await deletedEmployeeModel.create(newData);
//       })
//     );

//     res.status(200).json(newLeads);
//   } catch (error) {
//     console.error("Error saving deleted employee", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.put("/savedeletedemployee", upload.fields([
  { name: "offerLetter", maxCount: 1 },
  { name: "aadharCard", maxCount: 1 },
  { name: "panCard", maxCount: 1 },
  { name: "educationCertificate", maxCount: 1 },
  { name: "relievingCertificate", maxCount: 1 },
  { name: "salarySlip", maxCount: 1 },
  { name: "profilePhoto", maxCount: 1 },
]), async (req, res) => {
  try {
    const { dataToDelete, oldDesignation } = req.body;

    if (!dataToDelete || !Array.isArray(dataToDelete) || dataToDelete.length === 0) {
      return res.status(400).json({ error: "No employee data to save" });
    }

    console.log("Deleted data is :", dataToDelete);

    const getFileDetails = (fileArray) => fileArray ? fileArray.map(file => ({
      fieldname: file.fieldname,
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      destination: file.destination,
      filename: file.filename,
      path: file.path,
      size: file.size
    })) : [];

    const employees = await Promise.all(dataToDelete.map(async (data) => {
      let newDesignation = data.newDesignation;

      if (data.newDesignation === "Business Development Executive" || data.newDesignation === "Business Development Manager") {
        newDesignation = "Sales Executive";
      } else if (data.newDesignation === "Floor Manager") {
        newDesignation = "Sales Manager";
      } else if (data.newDesignation === "Data Analyst") {
        newDesignation = "Data Manager";
      } else if (data.newDesignation === "Admin Head") {
        newDesignation = "RM-Certification";
      } else if (data.newDesignation === "HR Manager") {
        newDesignation = "HR";
      } else {
        newDesignation = data.newDesignation;
      }

      const emp = {
        ...data,
        deletedDate: new Date(),

        // Personal Info
        ...(data.firstName || data.middleName || data.lastName) && {
          ename: `${data.firstName || ""} ${data.lastName || ""}`,
          empFullName: `${firstName || ""} ${middleName || ""} ${lastName || ""}`
        },
        ...(data.dob && { dob: data.dob }),
        ...(data.bloodGroup && { bloodGroup: data.bloodGroup }),
        ...(data.gender && { gender: data.gender }),
        ...(data?.personalPhoneNo && { personal_number: data.personalPhoneNo }),
        ...(data?.personalEmail && { personal_email: data.personalEmail }),
        ...(data?.currentAddress && { currentAddress: data.currentAddress }),
        ...(data?.permanentAddress && { permanentAddress: data.permanentAddress }),

        // Employment Info
        ...(data?.department && { department: data.department }),
        ...(data?.newDesignation && { newDesignation: data.newDesignation }),
        ...({ designation: newDesignation }),
        ...(data?.newDesignation && {
          bdmWork: data.newDesignation === "Business Development Manager" ||
            data.newDesignation === "Floor Manager" ||
            oldDesignation === "Business Development Manager" ||
            oldDesignation === "Floor Manager" ? true : false
        }),
        ...(data?.joiningDate && { jdate: data.joiningDate }),
        ...(data?.branch && { branchOffice: data.branch }),
        ...(data?.employeementType && { employeementType: data.employeementType }),
        ...(data?.manager && { reportingManager: data.manager }),
        ...(data?.officialNo && { number: data.officialNo }),
        ...(data?.officialEmail && { email: data.officialEmail }),

        // Payroll Info
        ...(data?.accountNo && { accountNo: data.accountNo }),
        ...(data?.nameAsPerBankRecord && { nameAsPerBankRecord: data.nameAsPerBankRecord }),
        ...(data?.ifscCode && { ifscCode: data.ifscCode }),
        ...(data?.salary && { salary: data.salary }),
        ...(data?.firstMonthSalaryCondition && { firstMonthSalaryCondition: data.firstMonthSalaryCondition }),
        ...(data?.firstMonthSalary && { firstMonthSalary: data.firstMonthSalary }),
        ...(data?.panNumber && { panNumber: data.panNumber }),
        ...(data?.aadharNumber && { aadharNumber: data.aadharNumber }),
        ...(data?.uanNumber && { uanNumber: data.uanNumber }),

        // Emergency Info
        ...(data?.personName && { personal_contact_person: data.personName }),
        ...(data?.relationship && { personal_contact_person_relationship: data.relationship }),
        ...(data?.personPhoneNo && { personal_contact_person_number: data.personPhoneNo }),

        // Document Info
        ...(req.files?.offerLetter && { offerLetter: getFileDetails(req.files.offerLetter) || [] }),
        ...(req.files?.aadharCard && { aadharCard: getFileDetails(req.files.aadharCard) || [] }),
        ...(req.files?.panCard && { panCard: getFileDetails(req.files.panCard) || [] }),
        ...(req.files?.educationCertificate && { educationCertificate: getFileDetails(req.files.educationCertificate) || [] }),
        ...(req.files?.relievingCertificate && { relievingCertificate: getFileDetails(req.files.relievingCertificate) || [] }),
        ...(req.files?.salarySlip && { salarySlip: getFileDetails(req.files.salarySlip) || [] }),
        ...(req.files?.profilePhoto && { profilePhoto: getFileDetails(req.files.profilePhoto) || [] })
      };
      if (data.empId) {
        emp._id = data.empId;
      }
      // Save employee to the deletedEmployeeModel (assuming it's defined elsewhere)
      await deletedEmployeeModel.create(emp);

      return emp;
    }));

    res.json(employees);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/deletedemployeeinfo", async (req, res) => {
  try {
    // Destructure query parameters
    // const { search } = req.query;
    // console.log("Search query :", search);

    // Create the filter object
    // const filter = {};

    // if (search) {
    // Define search conditions
    // const searchRegex = new RegExp(search, "i"); // case-insensitive search

    // Map search terms for designation
    //   let designationConditions = [];
    //   if (search.toLowerCase() === "bd") {
    //     // For BDE, match both Business Development Executive and Business Development Manager
    //     designationConditions = [
    //       { newDesignation: /Business Development Executive/i },
    //       { newDesignation: /Business Development Manager/i }
    //     ];
    //   } else if (search.toLowerCase() === "bde") {
    //     designationConditions = [{ newDesignation: /Business Development Executive/i }];
    //   } else if (search.toLowerCase() === "bdm") {
    //     designationConditions = [{ newDesignation: /Business Development Manager/i }];
    //   } else if (search.toLowerCase() === "business development executive") {
    //     designationConditions = [{ newDesignation: /Business Development Executive/i }];
    //   } else if (search.toLowerCase() === "business development manager") {
    //     designationConditions = [{ newDesignation: /Business Development Manager/i }];
    //   } else {
    //     designationConditions = [{ newDesignation: searchRegex }];
    //   }

    //   // Build the search query using $or
    //   filter.$or = [
    //     { ename: searchRegex },
    //     { number: searchRegex },
    //     { email: searchRegex },
    //     { branchOffice: searchRegex },
    //     { department: searchRegex },
    //     ...designationConditions
    //   ];
    // }

    // Perform the search query with projection
    // let data;
    // if(!search){
    // Fetch all data when there's no search.
    const data = await deletedEmployeeModel.find().lean();  // The .lean() method converts the results to plain JavaScript objects instead of Mongoose documents.
    // } else {
    //   // Search using filter
    //   data = await deletedEmployeeModel.find(filter).lean();
    // }
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// router.get("/searchDeletedEmployeeInfo", async (req, res) => {
//   try {
//     // Destructure query parameters
//     const { search } = req.query;
//     // console.log("Search query :", search);

//     // Create the filter object
//     const filter = {};

//     if (search) {
//       // Define search conditions
//       const searchRegex = new RegExp(search, "i"); // case-insensitive search

//       // Map search terms for designation
//       let designationConditions = [];
//       if (search.toLowerCase() === "bd") {
//         // For BDE, match both Business Development Executive and Business Development Manager
//         designationConditions = [
//           { newDesignation: /Business Development Executive/i },
//           { newDesignation: /Business Development Manager/i }
//         ];
//       } else if (search.toLowerCase() === "bde") {
//         designationConditions = [{ newDesignation: /Business Development Executive/i }];
//       } else if (search.toLowerCase() === "bdm") {
//         designationConditions = [{ newDesignation: /Business Development Manager/i }];
//       } else if (search.toLowerCase() === "business development executive") {
//         designationConditions = [{ newDesignation: /Business Development Executive/i }];
//       } else if (search.toLowerCase() === "business development manager") {
//         designationConditions = [{ newDesignation: /Business Development Manager/i }];
//       } else {
//         designationConditions = [{ newDesignation: searchRegex }];
//       }

//       // Build the search query using $or
//       filter.$or = [
//         { ename: searchRegex },
//         { number: searchRegex },
//         { email: searchRegex },
//         { branchOffice: searchRegex },
//         { department: searchRegex },
//         ...designationConditions
//       ];
//     }

//     const projection = {
//       profilePhoto: 1,
//       ename: 1,
//       number: 1,
//       email: 1,
//       branchOffice: 1,
//       department: 1,
//       newDesignation: 1,
//       designation: 1,
//       AddedOn: 1,
//       deletedDate: 1,
//       jdate: 1,
//       bdmWork: 1
//     };

//     // Perform the search query with projection
//     const data = await deletedEmployeeModel.find(filter, projection).lean();
//     res.json(data);
//   } catch (error) {
//     console.error("Error fetching data:", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

router.delete("/deleteemployeedromdeletedemployeedetails/:id", async (req, res) => {
  const { id: itemId } = req.params; // Correct destructuring
  console.log(itemId);
  try {
    const data = await deletedEmployeeModel.findByIdAndDelete(itemId);

    if (!data) {
      return res.status(404).json({ error: "Data not found" });
    } else {
      return res
        .status(200)
        .json({ message: "Data deleted successfully", data });
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
);

// router.put("/revertbackdeletedemployeeintomaindatabase", async (req, res) => {
//   const { dataToRevertBack } = req.body;

//   if (!dataToRevertBack || dataToRevertBack || Back.length === 0) {
//     return res.status(400).json({ error: "No employee data to save" });
//   }

//   try {
//     const newLeads = await Promise.all(
//       dataToRevertBack.map(async (data) => {
//         const newData = {
//           ...data,
//           _id: data._id,
//         };
//         return await adminModel.create(newData);
//       })
//     );

//     res.status(200).json(newLeads);
//   } catch (error) {
//     if (error.code === 11000) {
//       // Duplicate key error
//       console.error("Duplicate key error:", error.message);
//       return res.status(409).json({
//         error: "Duplicate key error. Document with this ID already exists.",
//       });
//     }
//     console.error("Error reverting back employee:", error.message);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.put("/revertbackdeletedemployeeintomaindatabase", upload.fields([
  { name: "offerLetter", maxCount: 1 },
  { name: "aadharCard", maxCount: 1 },
  { name: "panCard", maxCount: 1 },
  { name: "educationCertificate", maxCount: 1 },
  { name: "relievingCertificate", maxCount: 1 },
  { name: "salarySlip", maxCount: 1 },
  { name: "profilePhoto", maxCount: 1 },
]), async (req, res) => {
  try {
    const { dataToRevertBack, oldDesignation } = req.body;

    if (!dataToRevertBack || !Array.isArray(dataToRevertBack) || dataToRevertBack.length === 0) {
      return res.status(400).json({ error: "No employee data to save" });
    }

    // console.log("Deleted data is :", dataToDelete);
    // console.log("Reverted employee is :", dataToRevertBack);

    const getFileDetails = (fileArray) => fileArray ? fileArray.map(file => ({
      fieldname: file.fieldname,
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      destination: file.destination,
      filename: file.filename,
      path: file.path,
      size: file.size
    })) : [];

    const employees = await Promise.all(dataToRevertBack.map(async (data) => {
      let newDesignation = data.newDesignation;

      if (data.newDesignation === "Business Development Executive" || data.newDesignation === "Business Development Manager") {
        newDesignation = "Sales Executive";
      } else if (data.newDesignation === "Floor Manager") {
        newDesignation = "Sales Manager";
      } else if (data.newDesignation === "Data Analyst") {
        newDesignation = "Data Manager";
      } else if (data.newDesignation === "Admin Head") {
        newDesignation = "RM-Certification";
      } else if (data.newDesignation === "HR Manager") {
        newDesignation = "HR";
      } else {
        newDesignation = data.newDesignation;
      }

      const emp = {
        ...data,

        // Personal Info
        ...(data.firstName || data.middleName || data.lastName) && {
          ename: `${data.firstName || ""} ${data.lastName || ""}`,
          empFullName: `${firstName || ""} ${middleName || ""} ${lastName || ""}`
        },
        ...(data.dob && { dob: data.dob }),
        ...(data.bloodGroup && { dob: data.bloodGroup }),
        ...(data.gender && { gender: data.gender }),
        ...(data?.personalPhoneNo && { personal_number: data.personalPhoneNo }),
        ...(data?.personalEmail && { personal_email: data.personalEmail }),
        ...(data?.currentAddress && { currentAddress: data.currentAddress }),
        ...(data?.permanentAddress && { permanentAddress: data.permanentAddress }),

        // Employment Info
        ...(data?.department && { department: data.department }),
        ...(data?.newDesignation && { newDesignation: data.newDesignation }),
        ...({ designation: newDesignation }),
        ...(data?.newDesignation && {
          bdmWork: data.newDesignation === "Business Development Manager" ||
            data.newDesignation === "Floor Manager" ||
            oldDesignation === "Business Development Manager" ||
            oldDesignation === "Floor Manager" ? true : false
        }),
        ...(data?.joiningDate && { jdate: data.joiningDate }),
        ...(data?.branch && { branchOffice: data.branch }),
        ...(data?.employeementType && { employeementType: data.employeementType }),
        ...(data?.manager && { reportingManager: data.manager }),
        ...(data?.officialNo && { number: data.officialNo }),
        ...(data?.officialEmail && { email: data.officialEmail }),

        // Payroll Info
        ...(data?.accountNo && { accountNo: data.accountNo }),
        ...(data?.nameAsPerBankRecord && { nameAsPerBankRecord: data.nameAsPerBankRecord }),
        ...(data?.ifscCode && { ifscCode: data.ifscCode }),
        ...(data?.salary && { salary: data.salary }),
        ...(data?.firstMonthSalaryCondition && { firstMonthSalaryCondition: data.firstMonthSalaryCondition }),
        ...(data?.firstMonthSalary && { firstMonthSalary: data.firstMonthSalary }),
        ...(data?.panNumber && { panNumber: data.panNumber }),
        ...(data?.aadharNumber && { aadharNumber: data.aadharNumber }),
        ...(data?.uanNumber && { uanNumber: data.uanNumber }),

        // Emergency Info
        ...(data?.personName && { personal_contact_person: data.personName }),
        ...(data?.relationship && { personal_contact_person_relationship: data.relationship }),
        ...(data?.personPhoneNo && { personal_contact_person_number: data.personPhoneNo }),

        // Document Info
        ...(req.files?.offerLetter && { offerLetter: getFileDetails(req.files.offerLetter) || [] }),
        ...(req.files?.aadharCard && { aadharCard: getFileDetails(req.files.aadharCard) || [] }),
        ...(req.files?.panCard && { panCard: getFileDetails(req.files.panCard) || [] }),
        ...(req.files?.educationCertificate && { educationCertificate: getFileDetails(req.files.educationCertificate) || [] }),
        ...(req.files?.relievingCertificate && { relievingCertificate: getFileDetails(req.files.relievingCertificate) || [] }),
        ...(req.files?.salarySlip && { salarySlip: getFileDetails(req.files.salarySlip) || [] }),
        ...(req.files?.profilePhoto && { profilePhoto: getFileDetails(req.files.profilePhoto) || [] })
      };

      if (data.empId) {
        emp._id = data.empId;
      }

      return adminModel.create(emp);
    }));

    res.json(employees);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// router.get('/achieved-details/:ename', async (req, res) => {
//   const { ename } = req.params;

//   try {
//     const employeeData = await adminModel.findOne({ ename });
//     if (!employeeData) {
//       return res.status(404).json({ error: 'Admin not found' });
//     }

//     const redesignedData = await RedesignedLeadformModel.find();
//     if (!redesignedData) {
//       return res.status(404).json({ error: 'No redesigned data found' });
//     }

//     const calculateAchievedRevenue = (data, ename, filterBy = 'This Month') => {
//       let achievedAmount = 0;
//       let expanse = 0;
//       let caCommision = 0;
//       const today = new Date();

//       const isDateInRange = (date, filterBy) => {
//         const bookingDate = new Date(date);
//         switch (filterBy) {
//           case 'Today':
//             return bookingDate.toLocaleDateString() === today.toLocaleDateString();
//           case 'Last Month':
//             return bookingDate.getMonth() === (today.getMonth() === 0 ? 11 : today.getMonth() - 1);
//           case 'This Month':
//             return bookingDate.getMonth() === today.getMonth();
//           default:
//             return false;
//         }
//       };

//       const processBooking = (booking, ename) => {
//         if ((booking.bdeName === ename || booking.bdmName === ename) && isDateInRange(booking.bookingDate, filterBy)) {
//           if (booking.bdeName === booking.bdmName) {
//             achievedAmount += Math.round(booking.generatedReceivedAmount);
//             expanse += booking.services.reduce((sum, serv) => sum + (serv.expanse || 0), 0);
//             if (booking.caCase === "Yes") caCommision += parseInt(booking.caCommission);
//           } else if (booking.bdmType === "Close-by") {
//             achievedAmount += Math.round(booking.generatedReceivedAmount) / 2;
//             expanse += booking.services.reduce((sum, serv) => sum + ((serv.expanse || 0) / 2), 0);
//             if (booking.caCase === "Yes") caCommision += parseInt(booking.caCommission) / 2;
//           } else if (booking.bdmType === "Supported-by" && booking.bdeName === ename) {
//             achievedAmount += Math.round(booking.generatedReceivedAmount);
//             expanse += booking.services.reduce((sum, serv) => sum + (serv.expanse || 0), 0);
//             if (booking.caCase === "Yes") caCommision += parseInt(booking.caCommission);
//           }
//         }
//       };

//       data.forEach(mainBooking => {
//         processBooking(mainBooking, ename);
//         mainBooking.moreBookings.forEach(moreObject => processBooking(moreObject, ename));
//       });

//       return achievedAmount - expanse - caCommision;
//     };

//     const currentYear = new Date().getFullYear();
//     const currentMonth = new Date().getMonth();

//     const achievedObject = employeeData.achievedObject.filter(obj => !(obj.year === currentYear && obj.month === currentMonth));

//     const newAchievedObject = {
//       year: currentYear,
//       month: currentMonth,
//       achievedAmount: calculateAchievedRevenue(redesignedData, ename)
//     };

//     achievedObject.push(newAchievedObject);

//     const updateResult = await adminModel.updateOne({ ename }, {
//       $set: { achievedObject }
//     });

//     res.json({ updateResult });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// router.get('/achieved-details/:ename', async (req, res) => {
//   const { ename } = req.params;

//   try {
//     const employeeData = await adminModel.findOne({ ename });
//     if (!employeeData) {
//       return res.status(404).json({ error: 'Admin not found' });
//     }

//     const redesignedData = await RedesignedLeadformModel.find();
//     if (!redesignedData) {
//       return res.status(404).json({ error: 'No redesigned data found' });
//     }

//     const calculateAchievedRevenue = (data, ename, filterBy = 'Last Month') => {
//       let achievedAmount = 0;
//       let expanse = 0;
//       let caCommission = 0;
//       let remainingAmount = 0;
//       let remainingExpense = 0;
//       const today = new Date();

//       const isDateInRange = (date, filterBy) => {
//         const bookingDate = new Date(date);
//         switch (filterBy) {
//           case 'Today':
//             return bookingDate.toLocaleDateString() === today.toLocaleDateString();
//           case 'Last Month':
//             const lastMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
//             return bookingDate.getMonth() === lastMonth && bookingDate.getFullYear() === today.getFullYear();
//           case 'This Month':
//             return bookingDate.getMonth() === today.getMonth() && bookingDate.getFullYear() === today.getFullYear();
//           default:
//             return false;
//         }
//       };

//       const processBooking = (booking, ename) => {
//         if ((booking.bdeName === ename || booking.bdmName === ename) && isDateInRange(booking.bookingDate, filterBy)) {
//           if (booking.bdeName === booking.bdmName) {
//             achievedAmount += Math.round(booking.generatedReceivedAmount);
//             expanse += booking.services.reduce((sum, serv) => sum + (serv.expanse || 0), 0);
//             if (booking.caCase === "Yes") caCommission += parseInt(booking.caCommission);
//           } else if (booking.bdmType === "Close-by") {
//             achievedAmount += Math.round(booking.generatedReceivedAmount) / 2;
//             expanse += booking.services.reduce((sum, serv) => sum + ((serv.expanse || 0) / 2), 0);
//             if (booking.caCase === "Yes") caCommission += parseInt(booking.caCommission) / 2;
//           } else if (booking.bdmType === "Supported-by" && booking.bdeName === ename) {
//             achievedAmount += Math.round(booking.generatedReceivedAmount);
//             expanse += booking.services.reduce((sum, serv) => sum + (serv.expanse || 0), 0);
//             if (booking.caCase === "Yes") caCommission += parseInt(booking.caCommission);
//           }
//         }

//         if (booking.remainingPayments.length !== 0 && (booking.bdeName === ename || booking.bdmName === ename)) {
//           let remainingExpanseCondition = false;
//           switch (filterBy) {
//             case 'Today':
//               remainingExpanseCondition = booking.remainingPayments.some(item => new Date(item.paymentDate).toLocaleDateString() === today.toLocaleDateString());
//               break;
//             case 'Last Month':
//               remainingExpanseCondition = booking.remainingPayments.some(item => {
//                 const paymentDate = new Date(item.paymentDate);
//                 const lastMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
//                 return paymentDate.getMonth() === lastMonth && paymentDate.getFullYear() === today.getFullYear();
//               });
//               break;
//             case 'This Month':
//               remainingExpanseCondition = booking.remainingPayments.some(item => {
//                 const paymentDate = new Date(item.paymentDate);
//                 return paymentDate.getMonth() === today.getMonth() && paymentDate.getFullYear() === today.getFullYear();
//               });
//               break;
//             default:
//               break;
//           }

//           if (remainingExpanseCondition && filterBy === "Last Month") {
//             const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
//             const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
//             booking.services.forEach(serv => {
//               if (serv.expanseDate && new Date(serv.expanseDate) >= startDate && new Date(serv.expanseDate) <= endDate) {
//                 if (booking.bdeName !== booking.bdmName && booking.bdmType === "Close-by") {
//                   remainingExpense += serv.expanse / 2;
//                 } else if (booking.bdeName === booking.bdmName) {
//                   remainingExpense += serv.expanse;
//                 } else if (booking.bdeName !== booking.bdmName && booking.bdmType === "Supported-by" && booking.bdeName === ename) {
//                   remainingExpense += serv.expanse;
//                 }
//               }
//             });
//           }

//           booking.remainingPayments.forEach(remainingObj => {
//             let condition = false;
//             switch (filterBy) {
//               case 'Today':
//                 condition = new Date(remainingObj.paymentDate).toLocaleDateString() === today.toLocaleDateString();
//                 break;
//               case 'Last Month':
//                 condition = new Date(remainingObj.paymentDate).getMonth() === (today.getMonth() === 0 ? 11 : today.getMonth() - 1);
//                 break;
//               case 'This Month':
//                 condition = new Date(remainingObj.paymentDate).getMonth() === today.getMonth();
//                 break;
//               default:
//                 break;
//             }

//             if (condition) {
//               const findService = booking.services.find(service => service.serviceName === remainingObj.serviceName);
//               const tempAmount = findService.withGST ? Math.round(remainingObj.receivedPayment) / 1.18 : Math.round(remainingObj.receivedPayment);
//               if (booking.bdeName === booking.bdmName) {
//                 remainingAmount += Math.round(tempAmount);
//               } else if (booking.bdeName !== booking.bdmName && booking.bdmType === "Close-by") {
//                 remainingAmount += Math.round(tempAmount) / 2;
//               } else if (booking.bdeName !== booking.bdmName && booking.bdmType === "Supported-by" && booking.bdeName === ename) {
//                 remainingAmount += Math.round(tempAmount);
//               }
//             }
//           });
//         }
//       };

//       data.forEach(mainBooking => {
//         processBooking(mainBooking, ename);
//         mainBooking.moreBookings.forEach(moreObject => processBooking(moreObject, ename));
//       });

//       return achievedAmount + remainingAmount - expanse - remainingExpense - caCommission;
//     };

//     const currentYear = new Date().getFullYear();
//     const currentMonth = new Date().getMonth() + 1;  // Month is zero-indexed

//     const achievedAmount = calculateAchievedRevenue(redesignedData, ename);

//     const updateResult = await adminModel.updateOne(
//       {
//         ename,
//         'targetDetails.year': currentYear,
//         'targetDetails.month': currentMonth
//       },
//       {
//         $set: {
//           'targetDetails.$[elem].achievedAmount': achievedAmount
//         }
//       },
//       {
//         arrayFilters: [{ 'elem.year': currentYear, 'elem.month': currentMonth }]
//       }
//     );
//     console.log("achievedamont" , achievedAmount)
//     console.log(updateResult)

//     res.json({ updateResult });
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ error: error.message });
//   }
// });


// Function to calculate achieved revenue


// const calculateAchievedRevenue = (data, ename, filterBy = 'Last Month') => {
//   let achievedAmount = 0;
//   let expanse = 0;
//   let caCommission = 0;
//   let remainingAmount = 0;
//   let remainingExpense = 0;
//   const today = new Date();

//   const isDateInRange = (date, filterBy) => {
//     const bookingDate = new Date(date);
//     switch (filterBy) {
//       case 'Today':
//         return bookingDate.toLocaleDateString() === today.toLocaleDateString();
//       case 'Last Month':
//         const lastMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
//         return bookingDate.getMonth() === lastMonth && bookingDate.getFullYear() === today.getFullYear();
//       case 'This Month':
//         return bookingDate.getMonth() === today.getMonth() && bookingDate.getFullYear() === today.getFullYear();
//       default:
//         return false;
//     }
//   };

//   const processBooking = (booking, ename) => {
//     if ((booking.bdeName === ename || booking.bdmName === ename) && isDateInRange(booking.bookingDate, filterBy)) {
//       if (booking.bdeName === booking.bdmName) {
//         achievedAmount += Math.round(booking.generatedReceivedAmount);
//         expanse += booking.services.reduce((sum, serv) => sum + (serv.expanse || 0), 0);
//         if (booking.caCase === "Yes") caCommission += parseInt(booking.caCommission);
//       } else if (booking.bdmType === "Close-by") {
//         achievedAmount += Math.round(booking.generatedReceivedAmount) / 2;
//         expanse += booking.services.reduce((sum, serv) => sum + ((serv.expanse || 0) / 2), 0);
//         if (booking.caCase === "Yes") caCommission += parseInt(booking.caCommission) / 2;
//       } else if (booking.bdmType === "Supported-by" && booking.bdeName === ename) {
//         achievedAmount += Math.round(booking.generatedReceivedAmount);
//         expanse += booking.services.reduce((sum, serv) => sum + (serv.expanse || 0), 0);
//         if (booking.caCase === "Yes") caCommission += parseInt(booking.caCommission);
//       }
//     }else if (booking.remainingPayments.length !== 0 && (booking.bdeName === ename || booking.bdmName === ename)) {
//       let remainingExpanseCondition = false;
//       switch (filterBy) {
//         case 'Today':
//           remainingExpanseCondition = booking.remainingPayments.some(item => new Date(item.paymentDate).toLocaleDateString() === today.toLocaleDateString());
//           break;
//         case 'Last Month':
//           remainingExpanseCondition = booking.remainingPayments.some(item => {
//             const paymentDate = new Date(item.paymentDate);
//             const lastMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
//             return paymentDate.getMonth() === lastMonth && paymentDate.getFullYear() === today.getFullYear();
//           });
//           break;
//         case 'This Month':
//           remainingExpanseCondition = booking.remainingPayments.some(item => {
//             const paymentDate = new Date(item.paymentDate);
//             return paymentDate.getMonth() === today.getMonth() && paymentDate.getFullYear() === today.getFullYear();
//           });
//           break;
//         default:
//           break;
//       }

//       if (remainingExpanseCondition && filterBy === "Last Month") {
//         const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
//         const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
//         booking.services.forEach(serv => {
//           if (serv.expanseDate && new Date(serv.expanseDate) >= startDate && new Date(serv.expanseDate) <= endDate) {
//             if (booking.bdeName !== booking.bdmName && booking.bdmType === "Close-by") {
//               remainingExpense += serv.expanse / 2;
//             } else if (booking.bdeName === booking.bdmName) {
//               remainingExpense += serv.expanse;
//             } else if (booking.bdeName !== booking.bdmName && booking.bdmType === "Supported-by" && booking.bdeName === ename) {
//               remainingExpense += serv.expanse;
//             }
//           }
//         });
//       }

//       booking.remainingPayments.forEach(remainingObj => {
//         let condition = false;
//         switch (filterBy) {
//           case 'Today':
//             condition = new Date(remainingObj.paymentDate).toLocaleDateString() === today.toLocaleDateString();
//             break;
//           case 'Last Month':
//             condition = new Date(remainingObj.paymentDate).getMonth() === (today.getMonth() === 0 ? 11 : today.getMonth() - 1);
//             break;
//           case 'This Month':
//             condition = new Date(remainingObj.paymentDate).getMonth() === today.getMonth();
//             break;
//           default:
//             break;
//         }

//         if (condition) {
//           const findService = booking.services.find(service => service.serviceName === remainingObj.serviceName);
//           const tempAmount = findService.withGST ? Math.round(remainingObj.receivedPayment) / 1.18 : Math.round(remainingObj.receivedPayment);
//           if (booking.bdeName === booking.bdmName) {
//             remainingAmount += Math.round(tempAmount);
//           } else if (booking.bdeName !== booking.bdmName && booking.bdmType === "Close-by") {
//             remainingAmount += Math.round(tempAmount) / 2;
//           } else if (booking.bdeName !== booking.bdmName && booking.bdmType === "Supported-by" && booking.bdeName === ename) {
//             remainingAmount += Math.round(tempAmount);
//           }
//         }
//       });
//     }
//   };

//   data.forEach(mainBooking => {
//     processBooking(mainBooking, ename);
//     mainBooking.moreBookings.forEach(moreObject => processBooking(moreObject, ename));
//   });
//   console.log(achievedAmount,expanse,remainingAmount,)
//   console.log("function me achieved" ,achievedAmount + remainingAmount - expanse - remainingExpense - caCommission)

//   return achievedAmount + remainingAmount - expanse - remainingExpense - caCommission;
// };

// router.get('/achieved-details/:ename', async (req, res) => {
//   const { ename } = req.params;

//   try {
//     const employeeData = await adminModel.findOne({ ename });
//     if (!employeeData) {
//       return res.status(404).json({ error: 'Admin not found' });
//     }

//     const redesignedData = await RedesignedLeadformModel.find();
//     if (!redesignedData) {
//       return res.status(404).json({ error: 'No redesigned data found' });
//     }

//     const achievedAmount = calculateAchievedRevenue(redesignedData, ename);

//     console.log("achievedAmount" , achievedAmount)

//     const today = new Date();
//     const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//     const lastMonth = monthNames[today.getMonth() === 0 ? 11 : today.getMonth() - 1];

//     const targetDetailsUpdated = employeeData.targetDetails.map((targetDetail) => {
//       if (targetDetail.month === lastMonth) {
//         targetDetail.achievedAmount = achievedAmount;
//         targetDetail.ratio = Math.round((parseFloat(achievedAmount) / parseFloat(targetDetail.amount)) * 100);
//         const roundedRatio = Math.round(targetDetail.ratio);
//         if (roundedRatio === 0) {
//           targetDetail.result = "Poor";
//         } else if (roundedRatio > 0 && roundedRatio <= 40) {
//           targetDetail.result = "Poor";
//         } else if (roundedRatio >= 41 && roundedRatio <= 60) {
//           targetDetail.result = "Below Average";
//         } else if (roundedRatio >= 61 && roundedRatio <= 74) {
//           targetDetail.result = "Average";
//         } else if (roundedRatio >= 75 && roundedRatio <= 99) {
//           targetDetail.result = "Good";
//         } else if (roundedRatio >= 100 && roundedRatio <= 149) {
//           targetDetail.result = "Excellent";
//         } else if (roundedRatio >= 150 && roundedRatio <= 199) {
//           targetDetail.result = "Extraordinary";
//         } else if (roundedRatio >= 200 && roundedRatio <= 249) {
//           targetDetail.result = "Outstanding";
//         } else if (roundedRatio >= 250) {
//           targetDetail.result = "Exceptional";
//         }
//       }
//       return targetDetail;
//     });

//     // Update the employee data
//     const updateResult = await adminModel.findOneAndUpdate(
//       { ename },
//       { targetDetails: targetDetailsUpdated },
//       { new: true }
//     );

//     res.json({ updateResult });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });
// const calculateAchievedRevenue = (data, ename, filterBy) => {
//   let achievedAmount = 0;
//   let expanse = 0;
//   let caCommission = 0;
//   let remainingAmount = 0;
//   let remainingExpense = 0;
//   const today = new Date();

//   const isDateInRange = (date, filterBy) => {
//     const bookingDate = new Date(date);
//     switch (filterBy) {
//       case 'Today':
//         return bookingDate.toLocaleDateString() === today.toLocaleDateString();
//       case 'Last Month':
//         const lastMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
//         return bookingDate.getMonth() === lastMonth && bookingDate.getFullYear() === today.getFullYear();
//       case 'This Month':
//         return bookingDate.getMonth() === today.getMonth() && bookingDate.getFullYear() === today.getFullYear();
//       default:
//         return false;
//     }
//   };

//   const processBooking = (booking, ename) => {
//     if ((booking.bdeName === ename || booking.bdmName === ename) && isDateInRange(booking.bookingDate, filterBy)) {
//       if (booking.bdeName === booking.bdmName) {
//         achievedAmount += Math.round(booking.generatedReceivedAmount);
//         expanse += booking.services.reduce((sum, serv) => sum + (serv.expanse || 0), 0);
//         if (booking.caCase === "Yes") caCommission += parseInt(booking.caCommission);
//       } else if (booking.bdmType === "Close-by") {
//         achievedAmount += Math.round(booking.generatedReceivedAmount) / 2;
//         expanse += booking.services.reduce((sum, serv) => sum + ((serv.expanse || 0) / 2), 0);
//         if (booking.caCase === "Yes") caCommission += parseInt(booking.caCommission) / 2;
//       } else if (booking.bdmType === "Supported-by" && booking.bdeName === ename) {
//         achievedAmount += Math.round(booking.generatedReceivedAmount);
//         expanse += booking.services.reduce((sum, serv) => sum + (serv.expanse || 0), 0);
//         if (booking.caCase === "Yes") caCommission += parseInt(booking.caCommission);
//       }
//     } else if (booking.remainingPayments.length !== 0 && (booking.bdeName === ename || booking.bdmName === ename)) {
//       let remainingExpanseCondition = false;
//       switch (filterBy) {
//         case 'Today':
//           remainingExpanseCondition = booking.remainingPayments.some(item => new Date(item.paymentDate).toLocaleDateString() === today.toLocaleDateString());
//           break;
//         case 'Last Month':
//           remainingExpanseCondition = booking.remainingPayments.some(item => {
//             const paymentDate = new Date(item.paymentDate);
//             const lastMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
//             return paymentDate.getMonth() === lastMonth && paymentDate.getFullYear() === today.getFullYear();
//           });
//           break;
//         case 'This Month':
//           remainingExpanseCondition = booking.remainingPayments.some(item => {
//             const paymentDate = new Date(item.paymentDate);
//             return paymentDate.getMonth() === today.getMonth() && paymentDate.getFullYear() === today.getFullYear();
//           });
//           break;
//         default:
//           break;
//       }

//       if (remainingExpanseCondition && filterBy === "Last Month") {
//         const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
//         const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
//         booking.services.forEach(serv => {
//           if (serv.expanseDate && new Date(serv.expanseDate) >= startDate && new Date(serv.expanseDate) <= endDate) {
//             if (booking.bdeName !== booking.bdmName && booking.bdmType === "Close-by") {
//               remainingExpense += serv.expanse / 2;
//             } else if (booking.bdeName === booking.bdmName) {
//               remainingExpense += serv.expanse;
//             } else if (booking.bdeName !== booking.bdmName && booking.bdmType === "Supported-by" && booking.bdeName === ename) {
//               remainingExpense += serv.expanse;
//             }
//           }
//         });
//       }

//       booking.remainingPayments.forEach(remainingObj => {
//         let condition = false;
//         switch (filterBy) {
//           case 'Today':
//             condition = new Date(remainingObj.paymentDate).toLocaleDateString() === today.toLocaleDateString();
//             break;
//           case 'Last Month':
//             condition = new Date(remainingObj.paymentDate).getMonth() === (today.getMonth() === 0 ? 11 : today.getMonth() - 1);
//             break;
//           case 'This Month':
//             condition = new Date(remainingObj.paymentDate).getMonth() === today.getMonth();
//             break;
//           default:
//             break;
//         }

//         if (condition) {
//           const findService = booking.services.find(service => service.serviceName === remainingObj.serviceName);
//           const tempAmount = findService.withGST ? Math.round(remainingObj.receivedPayment) / 1.18 : Math.round(remainingObj.receivedPayment);
//           if (booking.bdeName === booking.bdmName) {
//             remainingAmount += Math.round(tempAmount);
//           } else if (booking.bdeName !== booking.bdmName && booking.bdmType === "Close-by") {
//             remainingAmount += Math.round(tempAmount) / 2;
//           } else if (booking.bdeName !== booking.bdmName && booking.bdmType === "Supported-by" && booking.bdeName === ename) {
//             remainingAmount += Math.round(tempAmount);
//           }
//         }
//       });
//     }
//   };

//   data.forEach(mainBooking => {
//     processBooking(mainBooking, ename);
//     mainBooking.moreBookings.forEach(moreObject => processBooking(moreObject, ename));
//   });

//   console.log("achieved", achievedAmount + remainingAmount - expanse - remainingExpense - caCommission);

//   return achievedAmount + remainingAmount - expanse - remainingExpense - caCommission;
// };

const functionCalculateAchievedRevenue = (redesignedData, ename, Filterby) => {
  //console.log("yahan chla achieved full function")
  let achievedAmount = 0;
  let remainingAmount = 0;
  let expanse = 0;
  let remainingExpense = 0;
  let remainingMoreExpense = 0;
  let add_caCommision = 0;
  const today = new Date();
  const cleanString = (str) => (str ? str.replace(/\s+/g, '').toLowerCase() : '');

  redesignedData.map((mainBooking) => {
    let condition = false;
    switch (Filterby) {
      case 'Today':
        condition = (new Date(mainBooking.bookingDate).toLocaleDateString() === today.toLocaleDateString())
        break;
      case 'Last Month':
        condition = (new Date(mainBooking.bookingDate).getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1)) && (new Date(mainBooking.bookingDate).getFullYear() === today.getFullYear())
        break;
      case 'This Month':
        condition = (new Date(mainBooking.bookingDate).getMonth() === today.getMonth()) && (new Date(mainBooking.bookingDate).getFullYear() === today.getFullYear())
        break;
      default:
        break;
    }
    if (condition && (cleanString(mainBooking.bdeName) === cleanString(ename) || cleanString(mainBooking.bdmName) === cleanString(ename))) {

      if (cleanString(mainBooking.bdeName) === cleanString(mainBooking.bdmName)) {
        //achievedAmount = achievedAmount + Math.round(mainBooking.generatedReceivedAmount);
        mainBooking.services.map(serv => {
          if (serv.paymentTerms === "Full Advanced") {
            achievedAmount = achievedAmount + serv.totalPaymentWOGST;
          } else {
            if (serv.withGST) {
              achievedAmount = achievedAmount + Math.round(serv.firstPayment / 1.18);
            } else {
              achievedAmount = achievedAmount + Math.round(serv.firstPayment);
            }
          }
          // console.log(serv.expanse , bdeName ,"this is services");
          let expanseDate = null
          if (serv.expanse) {
            expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);
            expanseDate.setHours(0, 0, 0, 0);
            let expanseCondition = false;
            switch (Filterby) {
              case 'Today':
                expanseCondition = (new Date(expanseDate).toLocaleDateString() === today.toLocaleDateString())
                break;
              case 'Last Month':
                expanseCondition = (new Date(expanseDate).getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1)) && (new Date(expanseDate).getFullYear() === today.getFullYear())
                break;
              case 'This Month':
                expanseCondition = (new Date(expanseDate).getMonth() === today.getMonth()) && (new Date(expanseDate).getFullYear() === today.getFullYear())
                break;
              default:
                break;
            }
            expanse = expanseCondition ? expanse + serv.expanse : expanse;
          }
        });
        if (mainBooking.caCase === "Yes") {
          add_caCommision += parseInt(mainBooking.caCommission)
        }
      } else if (cleanString(mainBooking.bdeName) !== cleanString(mainBooking.bdmName) && mainBooking.bdmType === "Close-by") {
        //achievedAmount = achievedAmount + Math.floor(mainBooking.generatedReceivedAmount) / 2;
        mainBooking.services.map(serv => {
          // console.log(serv.expanse , bdeName ,"this is services");
          if (serv.paymentTerms === "Full Advanced") {
            achievedAmount = achievedAmount + serv.totalPaymentWOGST / 2;
          } else {
            if (serv.withGST) {
              achievedAmount = achievedAmount + Math.round(serv.firstPayment / 1.18) / 2;
            } else {
              achievedAmount = achievedAmount + Math.round(serv.firstPayment) / 2;
            }
          }
          let expanseDate = null
          expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);
          expanseDate.setHours(0, 0, 0, 0);
          if (serv.expanse) {
            let expanseCondition = false;
            switch (Filterby) {
              case 'Today':
                expanseCondition = (expanseDate.toLocaleDateString() === today.toLocaleDateString())
                break;
              case 'Last Month':
                expanseCondition = (expanseDate.getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1)) && (expanseDate.getFullYear() === today.getFullYear())
                break;
              case 'This Month':
                expanseCondition = (expanseDate.getMonth() === today.getMonth()) && (expanseDate.getFullYear() === today.getFullYear())
                break;
              default:
                break;
            }
            expanse = expanseCondition ? expanse + serv.expanse / 2 : expanse;
          }
        });
        if (mainBooking.caCase === "Yes") {
          add_caCommision += parseInt(mainBooking.caCommission) / 2;
        }
      } else if (cleanString(mainBooking.bdeName) !== cleanString(mainBooking.bdmName) && mainBooking.bdmType === "Supported-by") {
        if (cleanString(mainBooking.bdeName) === cleanString(ename)) {
          //achievedAmount = achievedAmount + Math.round(mainBooking.generatedReceivedAmount);
          mainBooking.services.map(serv => {
            if (serv.paymentTerms === "Full Advanced") {
              achievedAmount = achievedAmount + serv.totalPaymentWOGST;
            } else {
              if (serv.withGST) {
                achievedAmount = achievedAmount + Math.round(serv.firstPayment / 1.18);
              } else {
                achievedAmount = achievedAmount + Math.round(serv.firstPayment);
              }
            }
            // console.log(serv.expanse , bdeName ,"this is services");
            let expanseDate = null
            expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);
            expanseDate.setHours(0, 0, 0, 0);
            if (serv.expanse) {
              let expanseCondition = false;
              switch (Filterby) {
                case 'Today':
                  expanseCondition = (expanseDate.toLocaleDateString() === today.toLocaleDateString())
                  break;
                case 'Last Month':
                  expanseCondition = (expanseDate.getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1)) && (expanseDate.getFullYear() === today.getFullYear())
                  break;
                case 'This Month':
                  expanseCondition = (expanseDate.getMonth() === today.getMonth()) && (expanseDate.getFullYear() === today.getFullYear())
                  break;
                default:
                  break;
              }
              expanse = expanseCondition ? expanse + serv.expanse : expanse;
            }
          });
          if (mainBooking.caCase === "Yes") {
            add_caCommision += parseInt(mainBooking.caCommission);
          }
        }
      }
    }
    if (mainBooking.remainingPayments.length !== 0 && (cleanString(mainBooking.bdeName) === cleanString(ename) || cleanString(mainBooking.bdmName) === cleanString(ename))) {
      let remainingExpanseCondition = false;
      switch (Filterby) {
        case 'Today':
          remainingExpanseCondition = mainBooking.remainingPayments.some(item => new Date(item.paymentDate).toLocaleDateString() === today.toLocaleDateString())
          break;
        case 'Last Month':
          remainingExpanseCondition = mainBooking.remainingPayments.some(item => new Date(item.paymentDate).getMonth() === (today.getMonth() === 0 ? 11 : today.getMonth() - 1))
          break;
        case 'This Month':
          remainingExpanseCondition = mainBooking.remainingPayments.some(item => new Date(item.paymentDate).getMonth() === today.getMonth() && new Date(item.paymentDate).getFullYear() === today.getFullYear())
          break;
        default:
          break;
      }

      if (remainingExpanseCondition && Filterby === "This Month") {
        const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
        mainBooking.services.forEach(serv => {
          if (serv.expanseDate && new Date(serv.expanseDate) >= startDate && new Date(serv.expanseDate) <= endDate) {
            if (cleanString(mainBooking.bdeName) !== cleanString(mainBooking.bdmName) && mainBooking.bdmType === "Close-by") {
              remainingExpense += serv.expanse / 2;
            } else if (cleanString(mainBooking.bdeName) === cleanString(mainBooking.bdmName)) {
              remainingExpense += serv.expanse;
            } else if (cleanString(mainBooking.bdeName) !== cleanString(mainBooking.bdmName) && mainBooking.bdmType === "Support-by" && mainBooking.bdemName === cleanString(ename)) {
              remainingExpense += serv.expanse;
            }
          }

        });
      }

      mainBooking.remainingPayments.map((remainingObj) => {
        let condition = false;
        switch (Filterby) {
          case 'Today':
            condition = (new Date(remainingObj.paymentDate).toLocaleDateString() === today.toLocaleDateString())
            break;
          case 'Last Month':
            condition = (new Date(remainingObj.paymentDate).getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1))
            break;
          case 'This Month':
            condition = (new Date(remainingObj.paymentDate).getMonth() === today.getMonth())
            break;
          default:
            break;
        }
        if (condition) {
          // Find the service from mainBooking.services
          const findService = mainBooking.services.find(service => service.serviceName === remainingObj.serviceName);
          console.log("findService", mainBooking["Company Name"], findService)
          // Check if findService is defined
          if (findService) {
            // Calculate the tempAmount based on whether GST is included
            const tempAmount = findService.withGST
              ? Math.round(remainingObj.receivedPayment) / 1.18
              : Math.round(remainingObj.receivedPayment);

            // Update remainingAmount based on conditions
            if (cleanString(mainBooking.bdeName) === cleanString(mainBooking.bdmName)) {
              remainingAmount += Math.round(tempAmount);
            } else if (cleanString(mainBooking.bdeName) !== cleanString(mainBooking.bdmName) && mainBooking.bdmType === "Close-by") {
              remainingAmount += Math.round(tempAmount) / 2;
            } else if (cleanString(mainBooking.bdeName) !== cleanString(mainBooking.bdmName) && mainBooking.bdmType === "Supported-by") {
              if (cleanString(mainBooking.bdeName) === cleanString(ename)) {
                remainingAmount += Math.round(tempAmount);
              }
            }
          } else {
            // Optional: Handle the case where findService is undefined
            console.warn(`Service with name ${remainingObj.serviceName} not found.`);
          }
        }
      })
    }

    mainBooking.moreBookings.map((moreObject) => {
      let condition = false;
      switch (Filterby) {
        case 'Today':
          condition = (new Date(moreObject.bookingDate).toLocaleDateString() === today.toLocaleDateString())
          break;
        case 'Last Month':
          condition = (new Date(moreObject.bookingDate).getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1))
          break;
        case 'This Month':
          condition = (new Date(moreObject.bookingDate).getMonth() === today.getMonth())
          break;
        default:
          break;
      }
      if (condition && (cleanString(moreObject.bdeName) === cleanString(ename) || cleanString(moreObject.bdmName) === cleanString(ename))) {

        if (cleanString(moreObject.bdeName) === cleanString(moreObject.bdmName)) {
          //achievedAmount = achievedAmount + Math.round(moreObject.generatedReceivedAmount);
          moreObject.services.map(serv => {
            if (serv.paymentTerms === "Full Advanced") {
              achievedAmount = achievedAmount + serv.totalPaymentWOGST;
            } else {
              if (serv.withGST) {
                achievedAmount = achievedAmount + Math.round(serv.firstPayment / 1.18);
              } else {
                achievedAmount = achievedAmount + Math.round(serv.firstPayment);
              }
            }
            // console.log(serv.expanse , bdeName ,"this is services");
            let expanseDate = null
            expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);
            expanseDate.setHours(0, 0, 0, 0);
            if (serv.expanse) {
              let expanseCondition = false;
              switch (Filterby) {
                case 'Today':
                  expanseCondition = (expanseDate.toLocaleDateString() === today.toLocaleDateString())
                  break;
                case 'Last Month':
                  expanseCondition = (expanseDate.getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1)) && (expanseDate.getFullYear() === today.getFullYear())
                  break;
                case 'This Month':
                  expanseCondition = (expanseDate.getMonth() === today.getMonth()) && (expanseDate.getFullYear() === today.getFullYear())
                  break;
                default:
                  break;
              }
              expanse = expanseCondition ? expanse + serv.expanse : expanse;
            }
          });
          if (moreObject.caCase === "Yes") {
            add_caCommision += parseInt(moreObject.caCommission);
          }
        } else if (cleanString(moreObject.bdeName) !== cleanString(moreObject.bdmName) && moreObject.bdmType === "Close-by") {
          //achievedAmount = achievedAmount + Math.round(moreObject.generatedReceivedAmount) / 2;
          moreObject.services.map(serv => {
            if (serv.paymentTerms === "Full Advanced") {
              achievedAmount = achievedAmount + serv.totalPaymentWOGST / 2;
            } else {
              if (serv.withGST) {
                achievedAmount = achievedAmount + Math.round(serv.firstPayment / 1.18) / 2;
              } else {
                achievedAmount = achievedAmount + Math.round(serv.firstPayment) / 2;
              }
            }
            // console.log(serv.expanse , bdeName ,"this is services");
            let expanseDate = null
            expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);
            expanseDate.setHours(0, 0, 0, 0);
            if (serv.expanse) {
              let expanseCondition = false;
              switch (Filterby) {
                case 'Today':
                  expanseCondition = (expanseDate.toLocaleDateString() === today.toLocaleDateString())
                  break;
                case 'Last Month':
                  expanseCondition = (expanseDate.getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1)) && (expanseDate.getFullYear() === today.getFullYear())
                  break;
                case 'This Month':
                  expanseCondition = (expanseDate.getMonth() === today.getMonth()) && (expanseDate.getFullYear() === today.getFullYear())
                  break;
                default:
                  break;
              }
              expanse = expanseCondition ? expanse + serv.expanse / 2 : expanse;
            }
          });
          if (moreObject.caCase === "Yes") {
            add_caCommision += parseInt(moreObject.caCommission) / 2;
          }
        } else if (cleanString(moreObject.bdeName) !== cleanString(moreObject.bdmName) && moreObject.bdmType === "Supported-by") {
          if (cleanString(moreObject.bdeName) === cleanString(ename)) {
            //achievedAmount = achievedAmount + Math.round(moreObject.generatedReceivedAmount);
            moreObject.services.map(serv => {
              if (serv.paymentTerms === "Full Advanced") {
                achievedAmount = achievedAmount + serv.totalPaymentWOGST;
              } else {
                if (serv.withGST) {
                  achievedAmount = achievedAmount + Math.round(serv.firstPayment / 1.18);
                } else {
                  achievedAmount = achievedAmount + Math.round(serv.firstPayment);
                }
              }
              // console.log(serv.expanse , bdeName ,"this is services");
              let expanseDate = null
              expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);
              expanseDate.setHours(0, 0, 0, 0);
              if (serv.expanse) {
                let expanseCondition = false;
                switch (Filterby) {
                  case 'Today':
                    expanseCondition = (expanseDate.toLocaleDateString() === today.toLocaleDateString())
                    break;
                  case 'Last Month':
                    expanseCondition = (expanseDate.getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1)) && (expanseDate.getFullYear() === today.getFullYear())
                    break;
                  case 'This Month':
                    expanseCondition = (expanseDate.getMonth() === today.getMonth()) && (expanseDate.getFullYear() === today.getFullYear())
                    break;
                  default:
                    break;
                }
                expanse = expanseCondition ? expanse + serv.expanse : expanse;
              }
            });
            if (moreObject.caCase === "Yes") {
              add_caCommision += parseInt(moreObject.caCommission);
            }
          }
        }
      }
      if (moreObject.remainingPayments.length !== 0 && (cleanString(moreObject.bdeName) === cleanString(ename) || cleanString(moreObject.bdmName) === cleanString(ename))) {

        let remainingExpanseCondition = false;
        switch (Filterby) {
          case 'Today':
            remainingExpanseCondition = moreObject.remainingPayments.some(item => new Date(item.paymentDate).toLocaleDateString() === today.toLocaleDateString())
            break;
          case 'Last Month':
            remainingExpanseCondition = moreObject.remainingPayments.some(item => new Date(item.paymentDate).getMonth() === (today.getMonth() === 0 ? 11 : today.getMonth() - 1))
            break;
          case 'This Month':
            remainingExpanseCondition = moreObject.remainingPayments.some(item => new Date(item.paymentDate).getMonth() === today.getMonth() && new Date(item.paymentDate).getFullYear() === today.getFullYear())
            break;
          default:
            break;
        }

        if (remainingExpanseCondition && Filterby === "This Month") {
          const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
          const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
          moreObject.services.forEach(serv => {

            if (serv.expanseDate && new Date(serv.expanseDate) >= startDate && new Date(serv.expanseDate) <= endDate) {
              if (cleanString(moreObject.bdeName) !== cleanString(moreObject.bdmName) && moreObject.bdmType === "Close-by") {
                remainingMoreExpense += serv.expanse / 2;
              } else if (cleanString(moreObject.bdeName) === cleanString(moreObject.bdmName)) {
                remainingMoreExpense += serv.expanse;
              } else if (cleanString(moreObject.bdeName) !== cleanString(moreObject.bdmName) && moreObject.bdmType === "Support-by" && moreObject.bdemName === cleanString(ename)) {
                remainingMoreExpense += serv.expanse;
              }
            }

          });
        }

        moreObject.remainingPayments.map((remainingObj) => {
          let condition = false;
          switch (Filterby) {
            case 'Today':
              condition = (new Date(remainingObj.paymentDate).toLocaleDateString() === today.toLocaleDateString())
              break;
            case 'Last Month':
              condition = (new Date(remainingObj.paymentDate).getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1))
              break;
            case 'This Month':
              condition = (new Date(remainingObj.paymentDate).getMonth() === today.getMonth())
              break;
            default:
              break;
          }
          if (condition) {

            const findService = moreObject.services.find((services) => services.serviceName === remainingObj.serviceName)
            const tempAmount = findService.withGST ? Math.round(remainingObj.receivedPayment) / 1.18 : Math.round(remainingObj.receivedPayment);
            if (cleanString(moreObject.bdeName) === cleanString(moreObject.bdmName)) {
              remainingAmount += Math.round(tempAmount);
            } else if (cleanString(moreObject.bdeName) !== cleanString(moreObject.bdmName) && moreObject.bdmType === "Close-by") {
              remainingAmount += Math.round(tempAmount) / 2;
            } else if (cleanString(moreObject.bdeName) !== cleanString(moreObject.bdmName) && moreObject.bdmType === "Supported-by") {
              if (cleanString(moreObject.bdeName) === cleanString(ename)) {
                remainingAmount += Math.round(tempAmount);
              }
            }
          }
        })
      }
    })
  })
  return achievedAmount + Math.round(remainingAmount) - expanse - remainingExpense - remainingMoreExpense - add_caCommision;
};

router.get('/achieved-details/:ename', async (req, res) => {
  const { ename } = req.params;

  try {
    const employeeData = await adminModel.findOne({ ename });
    if (!employeeData) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const redesignedData = await RedesignedLeadformModel.find();
    if (!redesignedData) {
      return res.status(404).json({ error: 'No redesigned data found' });
    }

    const lastMonthAchievedAmount = functionCalculateAchievedRevenue(redesignedData, ename, 'Last Month');
    const thisMonthAchievedAmount = functionCalculateAchievedRevenue(redesignedData, ename, 'This Month');

    const today = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const lastMonth = monthNames[today.getMonth() === 0 ? 11 : today.getMonth() - 1];
    const thisMonth = monthNames[today.getMonth()];

    // console.log("Last Month:", lastMonth);
    // console.log("This Month:", thisMonth);
    // console.log("Employee Target Details Before Update:", employeeData.targetDetails);

    const targetDetailsUpdated = employeeData.targetDetails.map((targetDetail) => {
      if (targetDetail.month === lastMonth) {
        targetDetail.achievedAmount = lastMonthAchievedAmount;
        targetDetail.ratio = Math.round((parseFloat(lastMonthAchievedAmount) / parseFloat(targetDetail.amount)) * 100);
        const roundedRatio = Math.round(targetDetail.ratio);
        if (roundedRatio === 0) {
          targetDetail.result = "Poor";
        } else if (roundedRatio > 0 && roundedRatio <= 40) {
          targetDetail.result = "Poor";
        } else if (roundedRatio >= 41 && roundedRatio <= 60) {
          targetDetail.result = "Below Average";
        } else if (roundedRatio >= 61 && roundedRatio <= 74) {
          targetDetail.result = "Average";
        } else if (roundedRatio >= 75 && roundedRatio <= 99) {
          targetDetail.result = "Good";
        } else if (roundedRatio >= 100 && roundedRatio <= 149) {
          targetDetail.result = "Excellent";
        } else if (roundedRatio >= 150 && roundedRatio <= 199) {
          targetDetail.result = "Extraordinary";
        } else if (roundedRatio >= 200 && roundedRatio <= 249) {
          targetDetail.result = "Outstanding";
        } else if (roundedRatio >= 250) {
          targetDetail.result = "Exceptional";
        }
      } else if (targetDetail.month === thisMonth) {
        targetDetail.achievedAmount = thisMonthAchievedAmount;
        targetDetail.ratio = Math.round((parseFloat(thisMonthAchievedAmount) / parseFloat(targetDetail.amount)) * 100);
        const roundedRatio = Math.round(targetDetail.ratio);
        if (roundedRatio === 0) {
          targetDetail.result = "Poor";
        } else if (roundedRatio > 0 && roundedRatio <= 40) {
          targetDetail.result = "Poor";
        } else if (roundedRatio >= 41 && roundedRatio <= 60) {
          targetDetail.result = "Below Average";
        } else if (roundedRatio >= 61 && roundedRatio <= 74) {
          targetDetail.result = "Average";
        } else if (roundedRatio >= 75 && roundedRatio <= 99) {
          targetDetail.result = "Good";
        } else if (roundedRatio >= 100 && roundedRatio <= 149) {
          targetDetail.result = "Excellent";
        } else if (roundedRatio >= 150 && roundedRatio <= 199) {
          targetDetail.result = "Extraordinary";
        } else if (roundedRatio >= 200 && roundedRatio <= 249) {
          targetDetail.result = "Outstanding";
        } else if (roundedRatio >= 250) {
          targetDetail.result = "Exceptional";
        }
      }
      return targetDetail;
    });

    // console.log("Employee Target Details After Update:", targetDetailsUpdated);

    // Update the employee data
    const updateResult = await adminModel.findOneAndUpdate(
      { ename },
      { targetDetails: targetDetailsUpdated },
      { new: true }
    );

    res.json({ updateResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


// 2. Read the Employee
router.get("/einfo", async (req, res) => {
  try {

    const data = await adminModel.find().lean();  // The .lean() method converts the results to plain JavaScript objects instead of Mongoose documents.

    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// router.get("/searchEmployee", async (req, res) => {
//   try {
//     // Destructure query parameters
//     const { search } = req.query;
//     // console.log("Search query :", search);

//     // Create the filter object
//     const filter = {};

//     if (search) {
//       // Define search conditions
//       const searchRegex = new RegExp(search, "i"); // case-insensitive search

//       // Map search terms for designation
//       let designationConditions = [];
//       if (search.toLowerCase() === "bd") {
//         // For BDE, match both Business Development Executive and Business Development Manager
//         designationConditions = [
//           { newDesignation: /Business Development Executive/i },
//           { newDesignation: /Business Development Manager/i }
//         ];
//       } else if (search.toLowerCase() === "bde") {
//         designationConditions = [{ newDesignation: /Business Development Executive/i }];
//       } else if (search.toLowerCase() === "bdm") {
//         designationConditions = [{ newDesignation: /Business Development Manager/i }];
//       } else if (search.toLowerCase() === "business development executive") {
//         designationConditions = [{ newDesignation: /Business Development Executive/i }];
//       } else if (search.toLowerCase() === "business development manager") {
//         designationConditions = [{ newDesignation: /Business Development Manager/i }];
//       } else {
//         designationConditions = [{ newDesignation: searchRegex }];
//       }

//       // Build the search query using $or
//       filter.$or = [
//         { ename: searchRegex },
//         { number: searchRegex },
//         { email: searchRegex },
//         { branchOffice: searchRegex },
//         { department: searchRegex },
//         ...designationConditions
//       ];
//     }

//     const projection = {
//       profilePhoto: 1,
//       ename: 1,
//       number: 1,
//       email: 1,
//       branchOffice: 1,
//       department: 1,
//       newDesignation: 1,
//       designation: 1,
//       AddedOn: 1,
//       Active: 1,
//       jdate: 1,
//       bdmWork: 1
//     };

//     // Perform the search query :
//     const data = await adminModel.find(filter, projection).lean();
//     res.json(data);
//   } catch (error) {
//     console.error("Error fetching data:", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


// 3. Update the Employee
// router.put("/einfo/:id", async (req, res) => {
//   const id = req.params.id;
//   const dataToSendUpdated = req.body;
//   console.log("updatedData", dataToSendUpdated)
//   try {
//     const updatedData = await adminModel.findByIdAndUpdate(id, dataToSendUpdated, {
//       new: true,
//     });

//     if (!updatedData) {
//       return res.status(404).json({ error: "Data not found" });
//     }

//     res.json({ message: "Data updated successfully", updatedData });
//   } catch (error) {
//     console.error("Error updating data:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.put("/einfo/:id", async (req, res) => {
  const id = req.params.id;
  const dataToSendUpdated = req.body;

  // Calculate ratio and result for each target detail
  dataToSendUpdated.targetDetails.forEach(target => {
    const amount = parseFloat(target.amount);
    const achievedAmount = parseFloat(target.achievedAmount);
    target.ratio = (achievedAmount / amount) * 100;

    // Determine the result based on the ratio
    const roundedRatio = Math.round(target.ratio);
    if (roundedRatio === 0) {
      target.result = "Poor";
    } else if (roundedRatio > 0 && roundedRatio <= 40) {
      target.result = "Poor";
    } else if (roundedRatio >= 41 && roundedRatio <= 60) {
      target.result = "Below Average";
    } else if (roundedRatio >= 61 && roundedRatio <= 74) {
      target.result = "Average";
    } else if (roundedRatio >= 75 && roundedRatio <= 99) {
      target.result = "Good";
    } else if (roundedRatio >= 100 && roundedRatio <= 149) {
      target.result = "Excellent";
    } else if (roundedRatio >= 150 && roundedRatio <= 199) {
      target.result = "Extraordinary";
    } else if (roundedRatio >= 200 && roundedRatio <= 249) {
      target.result = "Outstanding";
    } else if (roundedRatio >= 250) {
      target.result = "Exceptional";
    }
  });

  try {
    const updatedData = await adminModel.findByIdAndUpdate(id, dataToSendUpdated, {
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

router.post('/addbulktargetemployees', async (req, res) => {
  try {
    const { employeeData } = req.body;
    console.log("employeeData", employeeData)

    if (!employeeData || !Array.isArray(employeeData)) {
      return res.status(400).json({ message: 'Invalid data format' });
    }

    // Iterate over each employee data from the request
    for (const employee of employeeData) {
      const { email, year, month, amount, achievedAmount } = employee;

      // Find the employee by email
      let existingEmployee = await adminModel.findOne({ email });

      if (!existingEmployee) {
        console.error(`Employee not found: ${email}`);
        continue; // Skip to the next iteration if the employee is not found
      }

      // Find if target for the given year and month already exists
      let targetDetails = existingEmployee.targetDetails || [];
      let existingTargetIndex = targetDetails.findIndex(
        (target) => target.year === year && target.month === month
      );

      // If target for given year and month already exists, update it; otherwise, add a new entry
      if (existingTargetIndex !== -1) {
        targetDetails[existingTargetIndex] = {
          year,
          month,
          amount,
          achievedAmount: achievedAmount || 0,
          ratio: 0,
          result: "Poor" // You can calculate or update this based on some logic
        };
      } else {
        targetDetails.push({
          year,
          month,
          amount,
          achievedAmount: achievedAmount || 0,
          ratio: 0,
          result: "Poor"
        });
      }

      // Update employee record with modified targetDetails
      existingEmployee.targetDetails = targetDetails;

      // Save the updated employee record
      await existingEmployee.save();
    }

    res.status(200).json({ message: 'Employees target details updated successfully' });

  } catch (error) {
    console.error('Error updating employee targets:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
})


// 4. Delete an Employee
router.delete("/einfo/:id", async (req, res) => {
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

router.delete("/permanentDelete/:id", async (req, res) => {
  const itemId = req.params.id;
  console.log(itemId);
  try {
    const deletedData = await deletedEmployeeModel.findByIdAndDelete(itemId);

    if (!deletedData) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.status(200).json({ message: "Data deleted successfully", deletedData });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/einfo/:email/:password", async (req, res) => {
  const { email, password } = req.params;
  console.log(email, password)
  try {
    const data = await adminModel.findOne({ email: email, password: password });

    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: "Employee not found" });
    }
  } catch (error) {
    console.log("Error fetching employee data", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(
  "/employeeimages/:employeeName",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send("No files were uploaded");
      }

      const employeeName = req.params.employeeName;

      // Find the employee by name
      const employee = await adminModel.findOne({ ename: employeeName });

      if (!employee) {
        return res.status(404).send("Employee Not Found");
      }

      // Construct the file details to store
      const fileDetails = {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        uploadedAt: new Date(),
      };

      // Update the employee_profile array
      // employee.employee_profile(fileDetails);
      // await employee.save();

      employee.employee_profile = fileDetails;
      await employee.save();

      // Remove old employee images after uploading the new one
      removeOldEmployeeImages(employeeName, req.file.filename);

      // Handle other logic like saving to database or processing
      res.status(200).send({
        message: "File Uploaded Successfully",
        imageUrl: `/path/to/${req.file.filename}`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }

    // This function is remove the old employee profile image then store the latest employee profile image
    function removeOldEmployeeImages(employeeName, newFileName) {
      const directoryPath = path.join(
        __dirname,
        `../EmployeeImages/${employeeName}`
      );

      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          console.error("Error reading directory:", err);
          return;
        }

        files.forEach((file) => {
          if (file !== newFileName) {
            const filePath = path.join(directoryPath, file);

            fs.unlink(filePath, (err) => {
              if (err) {
                console.error("Error deleting file:", err);
              } else {
                console.log("Deleted old file:", file);
              }
            });
          }
        });
      });
    }
  }
);

router.get("/employeeImg/:employeeName/:filename", (req, res) => {
  const empName = req.params.employeeName;
  const fileName = req.params.filename;
  const pdfPath = path.join(
    __dirname,
    `../EmployeeImages/${empName}/${fileName}`
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

// Edit Employee Details by HR-Portal
router.post(
  "/post-employee-detail-byhr/:userId",
  async (req, res) => {
    const { userId } = req.params;
    const { personal_email, personal_number, personal_contact_person, currentAddress } = req.body;

    try {
      const updatedEmployee = await adminModel.findByIdAndUpdate(
        userId,
        {
          personal_email,
          personal_number,
          personal_contact_person,
          currentAddress,
        },
        { new: true } // This option returns the updated document
      );

      if (!updatedEmployee) {
        return res.status(404).send("Employee not found");
      }

      res.json(updatedEmployee);
    } catch (error) {
      console.error("Error updating employee details:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Adds record for today's projection :
router.post('/addTodaysProjection', async (req, res) => {
  try {
    const { empId, noOfCompany, noOfServiceOffered, totalOfferedPrice, totalCollectionExpected, date, time } = req.body;

    const employeeInfo = await adminModel.findOne({ _id: empId });

    if (!employeeInfo) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const todaysProjection = await TodaysProjectionModel.create({
      empId: empId,
      empName: employeeInfo.ename,
      noOfCompany: parseInt(noOfCompany),
      noOfServiceOffered: parseInt(noOfServiceOffered),
      totalOfferedPrice: parseInt(totalOfferedPrice),
      totalCollectionExpected: parseInt(totalCollectionExpected),
      date: date || new Date(),
      time: time || new Date()
    });
    res.status(200).json({ result: true, message: "Today's projection successfully added", data: todaysProjection });
  } catch (error) {
    res.status(500).json({ result: false, message: "Error adding today's projection :", error });
  }
});

// Displaying all the records for current date :
router.get('/showTodaysProjection', async (req, res) => {
  try {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1; // Months are zero-based
    const year = today.getFullYear();

    // Format the date as "d/m/yyyy"
    const formattedToday = `${day}/${month}/${year}`;

    const todaysProjection = await TodaysProjectionModel.find({
      date: formattedToday
    });

    res.status(200).json({ result: true, message: "Today's projection successfully fetched", data: todaysProjection });
  } catch (error) {
    res.status(500).json({ result: false, message: "Error displaying today's projection :", error });
  }
});

// Displaying records based on employee id :
router.get('/showEmployeeTodaysProjection/:empId', async (req, res) => {
  const { empId } = req.params;
  try {
    const todaysProjection = await TodaysProjectionModel.find({
      empId: empId
    });

    res.status(200).json({ result: true, message: "Today's projection successfully fetched", data: todaysProjection });
  } catch (error) {
    res.status(500).json({ result: false, message: "Error displaying today's projection :", error });
  }
});

// Update today's projection based on _id :
router.put('/updateTodaysProjection/:id', async (req, res) => {
  const { id } = req.params;
  const { empId, noOfCompany, noOfServiceOffered, totalOfferedPrice, totalCollectionExpected, date, time } = req.body;

  try {
    const employeeInfo = await adminModel.findOne({ _id: empId });

    if (!employeeInfo) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const updatedProjection = await TodaysProjectionModel.findByIdAndUpdate(id,
      {
        empId: empId,
        empName: employeeInfo.ename,
        noOfCompany: parseInt(noOfCompany),
        noOfServiceOffered: parseInt(noOfServiceOffered),
        totalOfferedPrice: parseInt(totalOfferedPrice),
        totalCollectionExpected: parseInt(totalCollectionExpected),
        date: date || new Date(),
        time: time || new Date()
      },
      { new: true } // When we use { new: true }, the response will contain the updated document:
    );

    if (updatedProjection) {
      res.status(200).json({ result: true, message: "Projection successfully updated", data: updatedProjection });
    } else {
      res.status(404).json({ result: false, message: "Projection not found" });
    }
  } catch (error) {
    res.status(500).json({ result: false, message: "Error updating today's projection", error });
  }
});

// Deleting today's projection based on _id :
router.delete('/deleteTodaysProjection/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProjection = await TodaysProjectionModel.findByIdAndDelete(id);

    if (deletedProjection) {
      res.status(200).json({ result: true, message: "Data successfully deleted", data: deletedProjection });
    } else {
      res.status(404).json({ result: false, message: "Data not found" });
    }
  } catch (error) {
    res.status(500).json({ result: false, message: "Error deleting data :", error });
  }
});

// -------------------calling api for employee profile----------------------
// router.post('/employee-calling/save', async (req, res) => {
//   const {
//     emp_number,
//     monthly_data, // This is an array of daily data
//     emp_code,
//     emp_country_code,
//     emp_name,
//     emp_tags
//   } = req.body;

//   const year = new Date().getFullYear(); // Get the current year (e.g., 2024)
//   const month = String(new Date().getMonth() + 1).padStart(2, '0'); // Get the current month as "01", "02", etc.

//   try {
//     // Find the employee by number
//     let employee = await CallingModel.findOne({ emp_number });

//     if (!employee) {
//       // If employee doesn't exist, create a new one with the current year and month data
//       employee = new CallingModel({
//         emp_code,
//         emp_country_code,
//         emp_name,
//         emp_number,
//         emp_tags,
//         year: [{
//           year: String(year),
//           monthly_data: [{
//             month: month,
//             daily_data: monthly_data // Assuming daily_data is an array of daily call logs
//           }]
//         }]
//       });
//     } else {
//       // If the employee exists, check if the year exists
//       const yearIndex = employee.year.findIndex(y => y.year === String(year));

//       if (yearIndex !== -1) {
//         // If the year exists, check if the month exists
//         const monthIndex = employee.year[yearIndex].monthly_data.findIndex(m => m.month === month);

//         if (monthIndex !== -1) {
//           // If the month exists, check if daily data for the same date already exists
//           monthly_data.forEach(newDailyData => {
//             const dateIndex = employee.year[yearIndex].monthly_data[monthIndex].daily_data.findIndex(d => d.date === newDailyData.date);

//             if (dateIndex !== -1) {
//               // If the daily data for the same date exists, update the existing data
//               employee.year[yearIndex].monthly_data[monthIndex].daily_data[dateIndex] = newDailyData;
//             } else {
//               // If the date does not exist, append the new daily data
//               employee.year[yearIndex].monthly_data[monthIndex].daily_data.push(newDailyData);
//             }
//           });
//         } else {
//           // If the month does not exist, create a new month with the daily data
//           employee.year[yearIndex].monthly_data.push({
//             month: month,
//             daily_data: monthly_data
//           });
//         }
//       } else {
//         // If the year does not exist, add a new year with the current month's data
//         employee.year.push({
//           year: String(year),
//           monthly_data: [{
//             month: month,
//             daily_data: monthly_data
//           }]
//         });
//       }
//     }

//     // Save or update the employee data
//     await employee.save();

//     res.status(200).json({ message: 'Data saved successfully' });
//   } catch (error) {
//     console.error('Error saving employee data:', error);
//     res.status(500).json({ message: 'Error saving employee data', error: error.message });
//   }
// });
// router.post('/employee-calling/save', async (req, res) => {
//   const {
//     emp_number,
//     monthly_data, // This is an array of daily data
//     emp_code,
//     emp_country_code,
//     emp_name,
//     emp_tags
//   } = req.body;

//   // Extract the month and year from the incoming data
//   const incomingYear = monthly_data.length > 0 ? new Date(monthly_data[0].date).getFullYear() : null;
//   const incomingMonth = monthly_data.length > 0 ? String(new Date(monthly_data[0].date).getMonth() + 1).padStart(2, '0') : null;

//   if (!incomingYear || !incomingMonth) {
//     return res.status(400).json({ message: 'Invalid data: Missing year or month in daily data' });
//   }

//   try {
//     // Find the employee by number
//     let employee = await CallingModel.findOne({ emp_number });

//     if (!employee) {
//       // If employee doesn't exist, create a new one with the incoming year and month data
//       employee = new CallingModel({
//         emp_code,
//         emp_country_code,
//         emp_name,
//         emp_number,
//         emp_tags,
//         year: [{
//           year: incomingYear.toString(),
//           monthly_data: [{
//             month: incomingMonth,
//             daily_data: monthly_data // Assuming daily_data is an array of daily call logs
//           }]
//         }]
//       });
//     } else {
//       // Check if the year exists
//       const yearIndex = employee.year.findIndex(y => y.year === incomingYear.toString());

//       if (yearIndex !== -1) {
//         // If the year exists, check if the month exists
//         const monthIndex = employee.year[yearIndex].monthly_data.findIndex(m => m.month === incomingMonth);

//         if (monthIndex !== -1) {
//           // If the month exists, check if daily data for the same date already exists
//           monthly_data.forEach(newDailyData => {
//             const dateIndex = employee.year[yearIndex].monthly_data[monthIndex].daily_data.findIndex(d => d.date === newDailyData.date);

//             if (dateIndex !== -1) {
//               // If the daily data for the same date exists, update the existing data
//               employee.year[yearIndex].monthly_data[monthIndex].daily_data[dateIndex] = newDailyData;
//             } else {
//               // If the date does not exist, append the new daily data
//               employee.year[yearIndex].monthly_data[monthIndex].daily_data.push(newDailyData);
//             }
//           });
//         } else {
//           // If the month does not exist, create a new month with the daily data
//           employee.year[yearIndex].monthly_data.push({
//             month: incomingMonth,
//             daily_data: monthly_data
//           });
//         }
//       } else {
//         // If the year does not exist, add a new year with the incoming month's data
//         employee.year.push({
//           year: incomingYear.toString(),
//           monthly_data: [{
//             month: incomingMonth,
//             daily_data: monthly_data
//           }]
//         });
//       }
//     }

//     // Save or update the employee data
//     await employee.save();

//     res.status(200).json({ message: 'Data saved successfully' });
//   } catch (error) {
//     console.error('Error saving employee data:', error);
//     res.status(500).json({ message: 'Error saving employee data', error: error.message });
//   }
// });

router.post('/employee-calling/save', async (req, res) => {
  const {
    emp_number,
    monthly_data, // This is an array of daily data
    emp_code,
    emp_country_code,
    emp_name,
    emp_tags
  } = req.body;

  // Extract the month and year from the incoming data
  const incomingYear = monthly_data.length > 0 ? new Date(monthly_data[0].date).getFullYear() : null;
  const incomingMonth = monthly_data.length > 0 ? String(new Date(monthly_data[0].date).getMonth() + 1).padStart(2, '0') : null;

  if (!incomingYear || !incomingMonth) {
    return res.status(400).json({ message: 'Invalid data: Missing year or month in daily data' });
  }

  try {
    // Find the employee by number
    let employee = await CallingModel.findOne({ emp_number });

    if (!employee) {
      // If employee doesn't exist, create a new one with the incoming year and month data
      employee = new CallingModel({
        emp_code,
        emp_country_code,
        emp_name,
        emp_number,
        emp_tags,
        year: [{
          year: incomingYear.toString(),
          monthly_data: [{
            month: incomingMonth,
            daily_data: monthly_data // Assuming daily_data is an array of daily call logs
          }]
        }]
      });
    } else {
      // Check if the year exists
      const yearIndex = employee.year.findIndex(y => y.year === incomingYear.toString());

      if (yearIndex !== -1) {
        // If the year exists, check if the month exists
        const monthIndex = employee.year[yearIndex].monthly_data.findIndex(m => m.month === incomingMonth);

        if (monthIndex !== -1) {
          // If the month exists, check if daily data for the same date already exists
          monthly_data.forEach(newDailyData => {
            const dateIndex = employee.year[yearIndex].monthly_data[monthIndex].daily_data.findIndex(d => d.date === newDailyData.date);

            if (dateIndex !== -1) {
              // If the daily data for the same date exists, update the existing data
              employee.year[yearIndex].monthly_data[monthIndex].daily_data[dateIndex] = newDailyData;
            } else {
              // If the date does not exist, append the new daily data
              employee.year[yearIndex].monthly_data[monthIndex].daily_data.push(newDailyData);
            }
          });
        } else {
          // If the month does not exist, create a new month with the daily data
          employee.year[yearIndex].monthly_data.push({
            month: incomingMonth,
            daily_data: [...monthly_data] // Use spread operator to avoid mutation
          });
        }
      } else {
        // If the year does not exist, add a new year with the incoming month's data
        employee.year.push({
          year: incomingYear.toString(),
          monthly_data: [{
            month: incomingMonth,
            daily_data: [...monthly_data] // Use spread operator to avoid mutation
          }]
        });
      }
    }

    // Save or update the employee data
    await employee.save();

    res.status(200).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving employee data:', error);
    res.status(500).json({ message: 'Error saving employee data', error: error.message });
  }
});

router.get(`/employee-calling-fetch/:number`, async (req, res) => {
  const { number } = req.params; // Accessing the number directly from req.paramscd backen
  try {
    const data = await CallingModel.find({ emp_number: String(number) });

    res.status(200).json({ message: 'Data fetched successfully', data: data });

  } catch (error) {
    console.error('Error saving employee data:', error);
    res.status(500).json({ message: 'Error saving employee data', error: error.message });
  }
})

// Endpoint to fetch data for a specific employee, year, and month
router.get('/employee-calling/filter', async (req, res) => {
  const { emp_number, year, month } = req.query;

  console.log("emp_number:", emp_number);
  console.log("year:", year);
  console.log("month:", month);

  try {
    // Find the employee by number and filter by year and month
    const employee = await CallingModel.findOne({
      emp_number: String(emp_number),
      'year.year': year,
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Find the specific month's data inside the year object
    const yearData = employee.year.find(y => y.year === year);
    if (!yearData) {
      return res.status(404).json({ message: `No data found for the year ${year}` });
    }

    const monthlyData = yearData.monthly_data.find(m => m.month === month);
    if (!monthlyData) {
      return res.status(404).json({ message: `No data found for the month ${month}` });
    }

    // console.log("data", monthlyData);
    res.status(200).json({ message: 'Data fetched successfully', data: monthlyData });
  } catch (error) {
    console.error('Error fetching employee data:', error);
    res.status(500).json({ message: 'Error fetching employee data', error: error.message });
  }
});


// --------------cron function for calling report------------------------

// Helper function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch daily data for a specific time range (9:30 AM to 7:30 PM)
const fetchDailyData = async (date, employeeNumber) => {
  const apiKey = process.env.REACT_APP_API_KEY;
  const url = 'https://api1.callyzer.co/v2/call-log/employee-summary';

  const startTimestamp = Math.floor(new Date(date).setUTCHours(4, 0, 0, 0) / 1000);  // 9:30 AM
  const endTimestamp = Math.floor(new Date(date).setUTCHours(13, 0, 0, 0) / 1000);  // 7:30 PM
  console.log("start", startTimestamp)
  console.log("end", endTimestamp)
  const body = {
    "call_from": startTimestamp,
    "call_to": endTimestamp,
    "call_types": ["Missed", "Rejected", "Incoming", "Outgoing"],
    "emp_numbers": [employeeNumber]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error: ${response.status} - ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    const dateString = date.toISOString().split('T')[0]; // Format YYYY-MM-DD

    // Append the date field to each result
    return data.result.map((entry) => ({
      ...entry,
      date: dateString // Add the date field
    }));
  } catch (err) {
    console.error('Error fetching daily data:', err.message);
    return null;
  }
};

// Save daily data to the database by appending to existing records
// Save daily data to the database by appending to existing records under year -> month -> daily_data
const saveDailyDataToDatabase = async (employeeNumber, dailyData) => {
  try {
    // Find the existing record for this employee
    const existingRecord = await CallingModel.findOne({ emp_number: employeeNumber });

    const date = new Date(dailyData[0].date); // Get the date from the daily data
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month in 'MM' format

    if (existingRecord) {
      // Find or create the year object
      let yearRecord = existingRecord.year.find(y => y.year === String(year));
      if (!yearRecord) {
        // If the year does not exist, create a new year entry
        yearRecord = { year: String(year), monthly_data: [] };
        existingRecord.year.push(yearRecord);
      }

      // Find or create the month object within the year
      let monthRecord = yearRecord.monthly_data.find(m => m.month === month);
      if (!monthRecord) {
        // If the month does not exist, create a new month entry
        monthRecord = { month: month, daily_data: [] };
        yearRecord.monthly_data.push(monthRecord);
      }

      // Append the new daily data to the existing daily_data array
      monthRecord.daily_data = [...monthRecord.daily_data, ...dailyData];
      await existingRecord.save();
    } else {
      // If no existing record, create a new one
      await CallingModel.create({
        emp_number: employeeNumber,
        year: [{
          year: String(year),
          monthly_data: [{
            month: month,
            daily_data: dailyData
          }]
        }]
      });
    }

    console.log(`Data saved successfully for employee ${employeeNumber}`);
  } catch (err) {
    console.error(`Error saving data for employee ${employeeNumber}:`, err.message);
  }
};
// Route for serving employee documents
router.get("/employeedocuments/:documenttype/:id/:filename", async (req, res) => {
  const { documenttype, id, filename } = req.params; // Extract document type, employee id, and filename from the request params

  // Construct the file path based on the document type, employee ID, and filename
  const filePath = path.join(__dirname, `../EmployeeDocs/${id}/${filename}`);


  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File not found: ${filePath}`, err);
      return res.status(404).json({ error: "File not found" });
    }

    // If the file exists, send it as a response
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error(`Error sending file: ${filePath}`, err);
        res.status(500).json({ error: "Error sending file" });
      }
    });
  });
});



module.exports = router;