const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const nodemailer = require("nodemailer");
const multer = require('multer');
const path = require('path');
const fs = require("fs");
const CompanyDataModel = require("../models/CompanyBusinessInput");
const LeadsModel = require("../models/RedesignedLeadform");

const secretKey = "your_secret_key"; // Replace with a secure key
let otpStorage = {};

async function createTransporter() {
    return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            type: "OAuth2",
            user: "otp@startupsahay.com",
        clientId: process.env.GOOGLE_OTP_CLIENT_ID, // Replace with your OAuth2 client ID
        clientSecret: process.env.GOOGLE_OTP_CLIENT_SECRET, // Replace with your OAuth2 client secret
        refreshToken: process.env.GOOGLE_OTP_REFRESH_TOKEN, // Replace with your OAuth2 refresh token
        accessToken: process.env.GOOGLE_OTP_ACCESS_TOKEN // Use dynamically fetched OAuth2 access token
        },
    });
}

// Send otp :
// router.post("/send-otp", async (req, res) => {
//     const { email } = req.body;

//     // Generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     // Store OTP with email
//     otpStorage[email] = otp;

//     // Configure nodemailer
//     const transporter = nodemailer.createTransport({
//         service: 'Gmail',
//         auth: {
//             user: 'alert@startupsahay.com',
//             pass: 'shkc khna iiwo pkea',
//         },
//     });

//     const mailOptions = {
//         from: 'kmhthakkar@gmail.com',
//         to: email,
//         subject: 'Your OTP Code',
//         text: `Your OTP code is ${otp}`,
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         res.status(200).send('OTP sent');
//     } catch (error) {
//         res.status(500).send('Error sending OTP');
//     }
// });

router.post("/send-otp", async (req, res) => {
    const { email } = req.body;

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration time (10 minutes from now)
    const expirationTime = Date.now() + 10 * 60 * 1000; // 10 minutes in milliseconds

    // Store OTP with expiration timestamp
    otpStorage[email] = { otp, expiresAt: expirationTime };

    // Store OTP with email
    // otpStorage[email] = otp;

    // Configure nodemailer
    let transporter;
    try {
        transporter = await createTransporter();
    } catch (error) {
        return res.status(500).send('Error creating transporter');
    }

    const mailOptions = {
        from: 'otp@startupsahay.com',
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
    // const { email, otp } = req.body;

    // if (otpStorage[email] === otp) {
    //     // Generate JWT token
    //     const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
    //     res.status(200).json({ message: 'OTP verified', token });
    // } else {
    //     res.status(400).send('Invalid OTP');
    // }

    // Valid otp for 10 Minutes :
    const { email, otp } = req.body;

    const otpData = otpStorage[email];

    // Check if OTP exists
    if (!otpData) {
        return res.status(400).send('OTP not found');
    }

    const { otp: storedOtp, expiresAt } = otpData;

    // Check if the OTP has expired
    if (Date.now() > expiresAt) {
        delete otpStorage[email]; // Optionally remove expired OTP
        return res.status(400).send('OTP has expired');
    }

    // Verify OTP
    if (storedOtp === otp) {
        // Generate JWT token
        const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
        delete otpStorage[email]; // Optionally remove OTP after successful verification
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
    destination: function (req, file, cb) {
        // Determine the destination path based on the fieldname and company name
        const companyName = req.params.CompanyName;
        let destinationPath = "";

        if (file.fieldname === "otherDocs") {
            destinationPath = `BookingsDocument/${companyName}/ExtraDocs`;
        } else if (file.fieldname === "paymentReceipt") {
            destinationPath = `BookingsDocument/${companyName}/PaymentReceipts`;
        } else if (
            file.fieldname === "DirectorAdharCard" ||
            file.fieldname === "DirectorPassportPhoto"
        ) {
            destinationPath = `Client/ClientDocuments/${companyName}/DirectorDocs`;
        } else {
            destinationPath = `Client/ClientDocuments/${companyName}/OtherDocs`;
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

router.post('/save-company-data',
    upload.fields([
        { name: "DirectorPassportPhoto", maxCount: 10 },
        { name: "DirectorAdharCard", maxCount: 10 },
        { name: "UploadMOA", maxCount: 1 },
        { name: "UploadAOA", maxCount: 1 },
        { name: "UploadPhotos", maxCount: 1 },
        { name: "RelevantDocument", maxCount: 1 },
        { name: "UploadAuditedStatement", maxCount: 1 },
        { name: "UploadProvisionalStatement", maxCount: 1 },
        { name: "UploadDeclaration", maxCount: 1 },
        { name: "UploadRelevantDocs", maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            const DirectorPassportPhoto = req.files["DirectorPassportPhoto"] || [];
            const DirectorAdharCard = req.files["DirectorAdharCard"] || [];
            const UploadMOA = req.files["UploadMOA"] || [];
            const UploadAOA = req.files["UploadAOA"] || [];
            const UploadPhotos = req.files["UploadPhotos"] || [];
            const RelevantDocument = req.files["RelevantDocument"] || [];
            const UploadAuditedStatement = req.files["UploadAuditedStatement"] || [];
            const UploadProvisionalStatement = req.files["UploadProvisionalStatement"] || [];
            const UploadDeclaration = req.files["UploadDeclaration"] || [];
            const UploadRelevantDocs = req.files["UploadRelevantDocs"] || [];

            const {
                CompanyName,
                CompanyEmail,
                CompanyNo,
                BrandName,
                WebsiteLink,
                CompanyAddress,
                CompanyPanNumber,
                SelectServices,
                SocialMedia,
                FacebookLink,
                InstagramLink,
                LinkedInLink,
                YoutubeLink,
                CompanyActivities,
                ProductService,
                CompanyUSP,
                ValueProposition,
                TechnologyInvolved,
                TechnologyDetails,
                ProductPhoto,
                AnyIpFiledResponse,
                RelevantDocumentComment,
                ItrStatus,
                DirectInDirectMarket,
                BusinessModel,
                Finance,
                FinanceCondition,
                DirectorDetails,
            } = req.body;

            const updatedData = {
                CompanyName,
                CompanyEmail,
                CompanyNo,
                BrandName,
                WebsiteLink,
                CompanyAddress,
                CompanyPanNumber,
                SelectServices,
                SocialMedia,
                FacebookLink,
                InstagramLink,
                LinkedInLink,
                YoutubeLink,
                CompanyActivities,
                ProductService,
                CompanyUSP,
                ValueProposition,
                TechnologyInvolved,
                TechnologyDetails,
                ProductPhoto,
                AnyIpFiledResponse,
                RelevantDocumentComment,
                ItrStatus,
                DirectInDirectMarket,
                BusinessModel,
                Finance,
                FinanceCondition,
                DirectorDetails: DirectorDetails.map((director, index) => ({
                    ...director,
                    DirectorPassportPhoto: DirectorPassportPhoto[index],
                    DirectorAdharCard: DirectorAdharCard[index],
                })),
                UploadMOA: UploadMOA[0],
                UploadAOA: UploadAOA[0],
                UploadPhotos: UploadPhotos[0],
                RelevantDocument: RelevantDocument[0],
                UploadAuditedStatement: UploadAuditedStatement[0],
                UploadProvisionalStatement: UploadProvisionalStatement[0],
                UploadDeclaration: UploadDeclaration[0],
                UploadRelevantDocs: UploadRelevantDocs[0],
            };

            // Save or update the user in the database
            const user = await CompanyDataModel.findOneAndUpdate(
                { CompanyName },
                updatedData,
                { new: true, upsert: true }
            );

            res.status(200).json({ result: true, message: 'Data saved successfully', data: user });
        } catch (error) {
            console.error('Error saving data:', error);
            res.status(500).json({ result: false, message: 'Error saving data', error: error.message });
        }
    });

// router.post('/save-company-data',
//     upload.fields([
//         { name: "DirectorPassportPhoto", maxCount: 1 },
//         { name: "DirectorAdharCard", maxCount: 1 },
//         { name: "UploadMOA", maxCount: 1 },
//         { name: "UploadAOA", maxCount: 1 },
//         { name: "UploadPhotos", maxCount: 1 },
//         { name: "RelevantDocument", maxCount: 1 },
//         { name: "UploadAuditedStatement", maxCount: 1 },
//         { name: "UploadProvisionalStatement", maxCount: 1 },
//         { name: "UploadDeclaration", maxCount: 1 },
//         { name: "UploadRelevantDocs", maxCount: 1 },
//     ]),
//     async (req, res) => {
//         try {
//             // Process uploaded files and form fields
//             const DirectorDetails = req.body.DirectorDetails;

//             const updatedData = {
//                 ...req.body,
//                 DirectorDetails: DirectorDetails.map((director, index) => ({
//                     ...director,
//                     DirectorPassportPhoto: req.files["DirectorPassportPhoto"] ? req.files["DirectorPassportPhoto"][index] : undefined,
//                     DirectorAdharCard: req.files["DirectorAdharCard"] ? req.files["DirectorAdharCard"][index] : undefined,
//                 })),
//                 UploadMOA: req.files["UploadMOA"] ? req.files["UploadMOA"][0] : undefined,
//                 UploadAOA: req.files["UploadAOA"] ? req.files["UploadAOA"][0] : undefined,
//                 UploadPhotos: req.files["UploadPhotos"] ? req.files["UploadPhotos"][0] : undefined,
//                 RelevantDocument: req.files["RelevantDocument"] ? req.files["RelevantDocument"][0] : undefined,
//                 UploadAuditedStatement: req.files["UploadAuditedStatement"] ? req.files["UploadAuditedStatement"][0] : undefined,
//                 UploadProvisionalStatement: req.files["UploadProvisionalStatement"] ? req.files["UploadProvisionalStatement"][0] : undefined,
//                 UploadDeclaration: req.files["UploadDeclaration"] ? req.files["UploadDeclaration"][0] : undefined,
//                 UploadRelevantDocs: req.files["UploadRelevantDocs"] ? req.files["UploadRelevantDocs"][0] : undefined,
//             };

//             // Save or update the user in the database
//             const user = await CompanyDataModel.findOneAndUpdate(
//                 { CompanyName: req.body.CompanyName },
//                 updatedData,
//                 { new: true, upsert: true }
//             );

//             res.status(200).json({ result: true, message: 'Data saved successfully', data: user });
//         } catch (error) {
//             console.error('Error saving data:', error);
//             res.status(500).json({ result: false, message: 'Error saving data', error: error.message });
//         }
//     });



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

// Fetching customer documents :
router.get('/fetch-documents/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const directorData = await CompanyDataModel.findById(id);
        if (!directorData) {
            return res.status(404).json({ message: 'Data not found' });
        }
        res.status(200).json(directorData);
        // console.log("Director details :", directorData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error });
    }
});

// Fetching terms and condition documents :
router.get("/fetchTermsAndConditions", (req, res) => {
    const pdfPath = path.join(
        __dirname,
        `./src/MITC.pdf`
    );

    console.log("PDF path is :", pdfPath);

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

module.exports = router;