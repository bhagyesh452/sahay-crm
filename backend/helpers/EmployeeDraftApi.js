const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { route } = require("./EmployeeAPI");
const EmployeeDraftModel = require("../models/EmployeeDraftModel");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const { personalEmail } = req.params;
        const empName = `${personalEmail}`;
        let destinationPath = "";

        if (file.fieldname && empName) {
            destinationPath = `EmployeeDocs/${empName}`;
        }

        // Create the directory if it doesn't exist
        if (!fs.existsSync(destinationPath)) {
            fs.mkdirSync(destinationPath, { recursive: true });
        }

        cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
        const { personalEmail } = req.params;
        const empName = `${personalEmail}`;
        const uniqueSuffix = Date.now();
        cb(null, `${uniqueSuffix}-${empName}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

router.post("/saveEmployeeDraft", async (req, res) => {
    try {
        const { firstName, middleName, lastName, personalPhoneNo, personalEmail } = req.body;
        const updateData = {
            ...req.body,
            ename: `${firstName} ${middleName} ${lastName}`,
            personal_number: personalPhoneNo,
            personal_email: personalEmail,
            AddedOn: new Date()
        };

        // Check if the document already exists and update it, otherwise create a new one
        const result = await EmployeeDraftModel.findOneAndUpdate(
            { personal_email: personalEmail },
            updateData,
            { new: true, upsert: true } // upsert option creates a new document if no match is found
        );

        res.json(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/fetchEmployeeDraft/", async (req, res) => {

    try {
        if (!personalEmail) {
            return res.status(404).json({ result: false, message: "Email not found" });
        }
        const emp = await EmployeeDraftModel.find();

        if (!emp) {
            return res.status(404).json({ result: false, message: "Employee not found" });
        }

        res.status(200).json({ result: true, message: "Data successfully updated", data: emp });
    } catch (error) {
        res.status(500).json({ result: false, message: "Error updating employee", error: error.message });
    }
});

router.put("/updateEmployeeDraft/:empId", upload.fields([
    { name: "offerLetter", maxCount: 1 },
    { name: "aadharCard", maxCount: 1 },
    { name: "panCard", maxCount: 1 },
    { name: "educationCertificate", maxCount: 1 },
    { name: "relievingCertificate", maxCount: 1 },
    { name: "salarySlip", maxCount: 1 },
    { name: "profilePhoto", maxCount: 1 },
]), async (req, res) => {
    const { empId } = req.params;
    const { officialNo, officialEmail, joiningDate, branch, manager, firstMonthSalary, salaryCalculation, personName, relationship, personPhoneNo } = req.body;
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
    const relievingCertificateDetails = getFileDetails(req.files ? req.files["relievingCertificate"] : []);
    const salarySlipDetails = getFileDetails(req.files ? req.files["salarySlip"] : []);
    const profilePhotoDetails = getFileDetails(req.files ? req.files["profilePhoto"] : []);

    try {
        if (!empId) {
            return res.status(404).json({ result: false, message: "Employee not found" });
        }

        const formatDate = (dateStr) => {
            if (!dateStr) return null;
            const [day, month, year] = dateStr.split("-");
            return `${year}-${month}-${day}`;
          };
      
          const formattedDob = formatDate(dob);
          const formattedJoiningDate = formatDate(joiningDate);

          console.log("Formatted DOB:", formattedDob);
          console.log("Formatted Joining Date:", formattedJoiningDate);

        const emp = await EmployeeDraftModel.findOneAndUpdate(
            { _id: empId },
            {
                ...req.body,
                email: officialEmail,
                number: officialNo,
                jdate: new Date(formattedJoiningDate),
                branchOffice: branch,
                reportingManager: manager,
                firstMonthSalaryCondition: firstMonthSalary,
                firstMonthSalary: salaryCalculation,
                offerLetter: offerLetterDetails || [],
                personal_contact_person: personName,
                personal_contact_person_relationship: relationship,
                personal_contact_person_number: personPhoneNo,
                aadharCard: aadharCardDetails || [],
                panCard: panCardDetails || [],
                educationCertificate: educationCertificateDetails || [],
                relievingCertificate: relievingCertificateDetails || [],
                salarySlip: salarySlipDetails || [],
                profilePhoto: profilePhotoDetails || [],
            },
            { new: true } // This option returns the updated document
        );

        if (!emp) {
            return res.status(404).json({ result: false, message: "Employee not found" });
        }

        res.status(200).json({ result: true, message: "Data successfully updated", data: emp });
    } catch (error) {
        res.status(500).json({ result: false, message: "Error updating employee", error: error.message });
    }
});

router.delete("/deleteEmployeeDraft/:empId", async(req, res) => {
    const {empId} = req.params;

    try {
        if (!empId) {
            return res.status(404).json({ result: false, message: "Employee not found" });
        }
        const emp = await EmployeeDraftModel.findByIdAndDelete(empId);
        res.status(200).json({result: true, message: "Employee successfully deleted", data: emp});
    } catch (error) {
        res.status(500).json({result: false, message: "Error deleting employee", error: error});  
    }
});

module.exports = router;