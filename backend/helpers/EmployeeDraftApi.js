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

router.post("/saveEmployeeDraft/", async (req, res) => {
    try {
        const { personalInfo,
            employeementInfo,
            payrollInfo,
            emergencyInfo,
            empDocumentInfo,
            activeStep } = req.body;
        const emp = {
            ...req.body,
            ename: `${personalInfo.firstName} ${personalInfo.middleName} ${personalInfo.lastName}`,
            dob: personalInfo.dob,
            personal_number: personalInfo.personalPhoneNo,
            personal_email: personalInfo.personalEmail,
            currentAddress: personalInfo.currentAddress,
            isAddressSame: personalInfo.isAddressSame,
            permanentAddress: personalInfo.permanentAddress,
            activeStep: activeStep,
            AddedOn: new Date()
        };

        // Check if the document already exists and update it, otherwise create a new one
        const result = await EmployeeDraftModel.create(emp
            // { new: true, upsert: true } // upsert option creates a new document if no match is found
        );

        res.json(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/fetchEmployeeDraft/", async (req, res) => {
    try {
        const emp = await EmployeeDraftModel.find();
        if (!emp) {
            return res.status(404).json({ result: false, message: "Employee not found" });
        }
        res.status(200).json({ result: true, message: "Data successfully updated", data: emp });
    } catch (error) {
        res.status(500).json({ result: false, message: "Error updating employee", error: error.message });
    }
});

// router.put("/updateEmployeeDraft/:empId", upload.fields([
//     { name: "offerLetter", maxCount: 1 },
//     { name: "aadharCard", maxCount: 1 },
//     { name: "panCard", maxCount: 1 },
//     { name: "educationCertificate", maxCount: 1 },
//     { name: "relievingCertificate", maxCount: 1 },
//     { name: "salarySlip", maxCount: 1 },
//     { name: "profilePhoto", maxCount: 1 },
// ]), async (req, res) => {
//     const { empId } = req.params;
//     const { firstName, middleName, lastName, dob, personalPhoneNo, personalEmail, officialNo, officialEmail, joiningDate, branch, manager, firstMonthSalary, salaryCalculation, personName, relationship, personPhoneNo, activeStep } = req.body;
//     // console.log("Reqest file is :", req.files);

//     console.log("Active step :", activeStep);
//     const getFileDetails = (fileArray) => fileArray ? fileArray.map(file => ({
//         fieldname: file.fieldname,
//         originalname: file.originalname,
//         encoding: file.encoding,
//         mimetype: file.mimetype,
//         destination: file.destination,
//         filename: file.filename,
//         path: file.path,
//         size: file.size
//     })) : [];

//     const offerLetterDetails = getFileDetails(req.files ? req.files["offerLetter"] : []);
//     const aadharCardDetails = getFileDetails(req.files ? req.files["aadharCard"] : []);
//     const panCardDetails = getFileDetails(req.files ? req.files["panCard"] : []);
//     const educationCertificateDetails = getFileDetails(req.files ? req.files["educationCertificate"] : []);
//     const relievingCertificateDetails = getFileDetails(req.files ? req.files["relievingCertificate"] : []);
//     const salarySlipDetails = getFileDetails(req.files ? req.files["salarySlip"] : []);
//     const profilePhotoDetails = getFileDetails(req.files ? req.files["profilePhoto"] : []);

//     try {
//         if (!empId) {
//             return res.status(404).json({ result: false, message: "Employee not found" });
//         }

//         const updateFields = {
//             ...req.body,
//             ...(activeStep && {activeStep: activeStep}),
//             ...(firstName || middleName || lastName) && {
//                 ename: `${firstName || ""} ${middleName || ""} ${lastName || ""}`
//             },
//             ...(dob && { dob }),
//             ...(personalPhoneNo && { personal_number: personalPhoneNo }),
//             ...(personalEmail && { personal_email: personalEmail }),

//             ...(officialNo && { number: officialNo }),
//             ...(officialEmail && { email: officialEmail }),
//             ...(joiningDate && { jdate: joiningDate }),
//             ...(branch && { branchOffice: branch }),
//             ...(manager && { reportingManager: manager }),

//             ...(firstMonthSalary && { firstMonthSalaryCondition: firstMonthSalary }),
//             ...(salaryCalculation && { firstMonthSalary: salaryCalculation }),

//             ...(personName && { personal_contact_person: personName }),
//             ...(relationship && { personal_contact_person_relationship: relationship }),
//             ...(personPhoneNo && { personal_contact_person_number: personPhoneNo }),

//             ...(offerLetterDetails.length > 0 && { offerLetter: offerLetterDetails }),
//             ...(aadharCardDetails.length > 0 && { aadharCard: aadharCardDetails }),
//             ...(panCardDetails.length > 0 && { panCard: panCardDetails }),
//             ...(educationCertificateDetails.length > 0 && { educationCertificate: educationCertificateDetails }),
//             ...(relievingCertificateDetails.length > 0 && { relievingCertificate: relievingCertificateDetails }),
//             ...(salarySlipDetails.length > 0 && { salarySlip: salarySlipDetails }),
//             ...(profilePhotoDetails.length > 0 && { profilePhoto: profilePhotoDetails })
//         };

//         const emp = await EmployeeDraftModel.findOneAndUpdate(
//             { _id: empId },
//             updateFields,
//             { new: true } // Return the updated document
//         );

//         if (!emp) {
//             return res.status(404).json({ result: false, message: "Employee not found" });
//         }

//         res.status(200).json({ result: true, message: "Data successfully updated", data: emp });
//     } catch (error) {
//         res.status(500).json({ result: false, message: "Error updating employee", error: error.message });
//     }
// });





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

    const personalInfo = req.body.personalInfo ? JSON.parse(req.body.personalInfo) : null;
    const employeementInfo = req.body.employeementInfo ? JSON.parse(req.body.employeementInfo) : null;
    const payrollInfo = req.body.payrollInfo ? JSON.parse(req.body.payrollInfo) : null;
    const emergencyInfo = req.body.emergencyInfo ? JSON.parse(req.body.emergencyInfo) : null;
    const { activeStep } = req.body;

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

        const updateFields = {
            ...req.body,
            ...(activeStep && { activeStep }),

            ...(personalInfo?.dob && { dob: personalInfo.dob }),
            ...(personalInfo?.personalPhoneNo && { personal_number: personalInfo.personalPhoneNo }),
            ...(personalInfo?.personalEmail && { personal_email: personalInfo.personalEmail }),
            ...(personalInfo?.currentAddress && { currentAddress: personalInfo.currentAddress }),
            ...(personalInfo?.isAddressSame && { isAddressSame: personalInfo.isAddressSame }),
            ...(personalInfo?.permanentAddress && { permanentAddress: personalInfo.permanentAddress }),

            ...(employeementInfo?.department && { department: employeementInfo.department }),
            ...(employeementInfo?.designation && { designation: employeementInfo.designation }),
            ...(employeementInfo?.joiningDate && { jdate: employeementInfo.joiningDate }),
            ...(employeementInfo?.branch && { branchOffice: employeementInfo.branch }),
            ...(employeementInfo?.employeementType && { employeementType: employeementInfo.employeementType }),
            ...(employeementInfo?.manager && { reportingManager: employeementInfo.manager }),
            ...(employeementInfo?.officialNo && { number: employeementInfo.officialNo }),
            ...(employeementInfo?.officialEmail && { email: employeementInfo.officialEmail }),

            ...(payrollInfo?.accountNo && { accountNo: payrollInfo.accountNo }),
            ...(payrollInfo?.bankName && { bankName: payrollInfo.bankName }),
            ...(payrollInfo?.ifscCode && { ifscCode: payrollInfo.ifscCode }),
            ...(payrollInfo?.salary && { salary: payrollInfo.salary }),
            ...(payrollInfo?.firstMonthSalary && { firstMonthSalaryCondition: payrollInfo.firstMonthSalary }),
            ...(payrollInfo?.salaryCalculation && { firstMonthSalary: payrollInfo.salaryCalculation }),
            ...(payrollInfo?.panNumber && { panNumber: payrollInfo.panNumber }),
            ...(payrollInfo?.aadharNumber && { aadharNumber: payrollInfo.aadharNumber }),
            ...(payrollInfo?.uanNumber && { uanNumber: payrollInfo.uanNumber }),

            ...(emergencyInfo?.personName && { personal_contact_person: emergencyInfo.personName }),
            ...(emergencyInfo?.relationship && { personal_contact_person_relationship: emergencyInfo.relationship }),
            ...(emergencyInfo?.personPhoneNo && { personal_contact_person_number: emergencyInfo.personPhoneNo }),

            ...(offerLetterDetails?.length > 0 && { offerLetter: offerLetterDetails }),
            ...(aadharCardDetails?.length > 0 && { aadharCard: aadharCardDetails }),
            ...(panCardDetails?.length > 0 && { panCard: panCardDetails }),
            ...(educationCertificateDetails?.length > 0 && { educationCertificate: educationCertificateDetails }),
            ...(relievingCertificateDetails?.length > 0 && { relievingCertificate: relievingCertificateDetails }),
            ...(salarySlipDetails?.length > 0 && { salarySlip: salarySlipDetails }),
            ...(profilePhotoDetails?.length > 0 && { profilePhoto: profilePhotoDetails })
        };

        const emp = await EmployeeDraftModel.findOneAndUpdate(
            { _id: empId },
            { $set: updateFields },
            { new: true } // Return the updated document
        );

        if (!emp) {
            return res.status(404).json({ result: false, message: "Employee not found" });
        }

        res.status(200).json({ result: true, message: "Data successfully updated", data: emp });
    } catch (error) {
        res.status(500).json({ result: false, message: "Error updating employee", error: error.message });
    }
});







router.delete("/deleteEmployeeDraft/:empId", async (req, res) => {
    const { empId } = req.params;

    try {
        if (!empId) {
            return res.status(404).json({ result: false, message: "Employee not found" });
        }
        const emp = await EmployeeDraftModel.findByIdAndDelete(empId);
        res.status(200).json({ result: true, message: "Employee successfully deleted", data: emp });
    } catch (error) {
        res.status(500).json({ result: false, message: "Error deleting employee", error: error });
    }
});

module.exports = router;