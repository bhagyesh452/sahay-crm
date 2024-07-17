const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;

let otpStorage = {};

router.post('/send-otp', async (req, res) => {
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

router.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    if (otpStorage[email] === otp) {
        res.status(200).send('OTP verified');
    } else {
        res.status(400).send('Invalid OTP');
    }
});

module.exports = router;