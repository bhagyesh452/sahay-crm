const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const nodemailer = require("nodemailer");
const multer = require('multer');
const path = require('path');
const CompanyDataModel = require("../models/CompanyBusinessInput");
const LeadsModel = require("../models/RedesignedLeadform");

const secretKey = "your_secret_key"; // Replace with a secure key
let otpStorage = {};

// Send otp :
router.post("/send-otp", async (req, res) => {
    const { email } = req.body;

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with email
    otpStorage[email] = otp;

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'kmhthakkar@gmail.com',
            pass: 'shkc khna iiwo pkea',
        },
    });

    const mailOptions = {
        from: 'kmhthakkar@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('OTP sent');
    } catch (error) {
        res.status(500).send('Error sending OTP');
    }
});

// Verify otp :
router.post("/verify-otp", (req, res) => {
    const { email, otp } = req.body;

    if (otpStorage[email] === otp) {
        // Generate JWT token
        const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ message: 'OTP verified', token });
    } else {
        res.status(400).send('Invalid OTP');
    }
});

// Fetch company from it's email :
router.get("/fetch-lead-from-email/:email", async (req, res) => {
    const { email } = req.params;
    try {
        const lead = await LeadsModel.findOne({ "Company Email": email });
        if (!lead) {
            return res.status(404).json({ result: false, message: 'Company not found' });
        }
        res.status(200).json({ result: true, message: "Company fetched successfully", data: lead });
    } catch (error) {
        res.status(500).json({ result: false, message: "Error to fetch company", error: error });
    }
});

router.get("/customer/dashboard/:email", (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        res.status(200).send('Welcome to the dashboard');
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }
});

// Configure multer for file uploads
// Set up storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/save-company-data', upload.fields([
    { name: 'UploadMOA', maxCount: 1 },
    { name: 'UploadAOA', maxCount: 1 },
    { name: 'UploadPhotos', maxCount: 1 },
    { name: 'RelevantDocument', maxCount: 1 },
    { name: 'UploadAuditedStatement', maxCount: 1 },
    { name: 'UploadProvisionalStatement', maxCount: 1 },
    { name: 'UploadDeclaration', maxCount: 1 },
    { name: 'UploadRelevantDocs', maxCount: 1 }
]), async (req, res) => {
    try {
        const data = req.body;
        console.log("Data is :", data);

        // Handle file uploads
        // const fileFields = [
        //     'UploadMOA',
        //     'UploadAOA',
        //     'UploadPhotos',
        //     'RelevantDocument',
        //     'UploadAuditedStatement',
        //     'UploadProvisionalStatement',
        //     'UploadDeclaration',
        //     'UploadRelevantDocs'
        // ];

        // fileFields.forEach(field => {
        //     if (req.files[field]) {
        //         data[field] = req.files[field].map(file => file.path);
        //     } else {
        //         data[field] = [];
        //     }
        // });

        // Set formSubmitted to true
        data.formSubmitted = true;
        
        // Save or update the user in the database
        const user = await CompanyDataModel.findOneAndUpdate(
            { CompanyName: data.CompanyName },
            data,
            { new: true, upsert: true }
        );

        res.status(200).json({ result: true, message: 'Data saved successfully', data: user });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ result: false, message: 'Error saving data', error: error.message });
    }
});

router.get('/fetch-company-data/:companyName', async (req, res) => {
    const { companyName } = req.params;

    try {
        const companyData = await CompanyDataModel.findOne({ CompanyName: companyName });

        if (!companyData) {
            return res.status(404).json({ result: false, message: 'Company not found' });
        }

        res.status(200).json({ result: true, message: 'Company data fetched successfully', data: companyData });
    } catch (error) {
        console.error('Error fetching company data:', error);
        res.status(500).json({ result: false, message: 'Error fetching company data', error: error.message });
    }
});


module.exports = router;