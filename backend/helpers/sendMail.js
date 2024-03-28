const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const mime = require('mime-types');

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


// Get OAuth2 access token
// async function getAccessToken() {
//   try {
//     const tokenResponse = await oAuth2Client.getRequestHeaders();
//     return tokenResponse.Authorization;
//   } catch (error) {
//     console.error('Error fetching access token:', error.message);
//     throw error;
//   }
// }

// Create Nodemailer transporter with OAuth2
async function createTransporter() {
  // const accessToken = await getAccessToken();
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: 'alerts@startupsahay.com', // Replace with your Gmail email ID
      clientId: process.env.GOOGLE_CLIENT_ID, // Replace with your OAuth2 client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Replace with your OAuth2 client secret
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN, // Replace with your OAuth2 refresh token
      accessToken: process.env.GOOGLE_ACCESS_TOKEN // Use dynamically fetched OAuth2 access token
    }
  });
}

// Function to process and attach files
const processAttachments = (files, prefix) => {
  const attachments = [];
  if (files) {
    files.forEach((file, index) => {
      const mimeType = mime.lookup(file.originalname);
      if (mimeType) {
        attachments.push({
          filename: `${prefix}${index + 1}.${mime.extension(mimeType)}`,
          content: file, // Assuming file is a buffer
        });
      } else {
        console.warn(`Unknown file type for ${file.originalname}`);
      }
    });
  }
  return attachments;
};

// Function to send email
async function sendMail(recipients, subject, text, html, otherDocs, paymentReceipt) {
  const transporter = await createTransporter();

  const otherDocsAttachments = processAttachments(otherDocs, 'otherDocs');
  const paymentReceiptAttachments = processAttachments(paymentReceipt, 'paymentReceipt');

  const info = await transporter.sendMail({
    from: '"Start-Up Sahay Private Limited" <alerts@startupsahay.com>', // Replace with your Gmail email ID
    to: recipients.join(', '),
    replyTo: 'bookings@startupsahay.com',
    subject,
    text,
    html,
    attachments: [...otherDocsAttachments, ...paymentReceiptAttachments],
  });

  return info;
}

module.exports = { sendMail };
