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
   

    const buffer = Buffer.from(files.buffer); // Convert ArrayBuffer to Buffer

    attachments.push({
        filename: `Self-Declaration.pdf`,
        content: buffer, // Use the converted Buffer
    });
    return attachments;
};
// Function to send email
const sendMail2 = async (recipients, subject, text, html, paymentReceipt) => {
    try {
      const transporter = await createTransporter();
      const paymentReceiptAttachments = processAttachments(paymentReceipt, 'paymentReceipt');
  
      const info = await transporter.sendMail({
        from: '"Start-Up Sahay Private Limited" <alerts@startupsahay.com>', // Replace with your Gmail email ID
        to: recipients.join(', '),
        replyTo: 'bookings@startupsahay.com',
        subject,
        text,
        html,
        attachments: paymentReceiptAttachments,
      });
  
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };

module.exports = { sendMail2 };
