const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const mime = require("mime-types");

// Create OAuth2 client
const oAuth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_HR_CLIENT_ID, // Replace with your OAuth2 client ID
            clientSecret: process.env.GOOGLE_HR_CLIENT_SECRET, // Replace with your OAuth2 client secret
    redirectUri: 'https://developers.google.com/oauthplayground' // Replace with your authorized redirect URI
  });

  // Set your OAuth2 refresh token
oAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_HR_REFRESH_TOKEN // Replace with your OAuth2 refresh token
});

async function createTransporter() {
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: 'hr@startupsahay.com', // Replace with your Gmail email ID
            clientId: process.env.GOOGLE_HR_CLIENT_ID, // Replace with your OAuth2 client ID
            clientSecret: process.env.GOOGLE_HR_CLIENT_SECRET, // Replace with your OAuth2 client secret
            refreshToken: process.env.GOOGLE_HR_REFRESH_TOKEN, // Replace with your OAuth2 refresh token
            accessToken: process.env.GOOGLE_HR_ACCESS_TOKEN // Use dynamically fetched OAuth2 access token
        }
    })
}

async function sendMailRecruiter(
    recipients,
    subject,
    text,
    html) {
    const transporter = await createTransporter();
    const info = await transporter.sendMail({
        from: '"Start-Up Sahay Private Limited" <hr@startupsahay.com>', // Replace with your Gmail email ID
        to: recipients.join(', '),
        // replyTo: 'bookings@startupsahay.com',
        subject,
        text,
        html,
      });

    return info;

}

module.exports = { sendMailRecruiter }
