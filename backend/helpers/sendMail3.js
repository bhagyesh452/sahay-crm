const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const mime = require("mime-types");

// Create OAuth2 client
const oAuth2Client = new google.auth.OAuth2({
  clientId: process.env.GOOGLE_CLIENT_ID, // Replace with your OAuth2 client ID
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Replace with your OAuth2 client secret
  redirectUri: "https://developers.google.com/oauthplayground", // Replace with your authorized redirect URI
});

// Set your OAuth2 refresh token
oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN, // Replace with your OAuth2 refresh token
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
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: "alerts@startupsahay.com", // Replace with your Gmail email ID
      clientId: process.env.GOOGLE_CLIENT_ID, // Replace with your OAuth2 client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Replace with your OAuth2 client secret
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN, // Replace with your OAuth2 refresh token
      accessToken: process.env.GOOGLE_ACCESS_TOKEN, // Use dynamically fetched OAuth2 access token
    },
  });
}


const processAttachments = (files) => {
  const attachments = [];


  files.forEach((file) => {
    const mimeType = mime.lookup(file.filename);
    const attachment = {
      filename: file.originalname,
      contentType: mimeType,
      content: file,
    };

    attachments.push(attachment);
  });

  return attachments;
};

// Function to send email
const sendMail3 = async (
  recipients,
  subject,
  text,
  html,
  attachment1,
  attachment2,
  attachment3,
  attachment4,
  attachment5,
  attachment6,
  attachment7,
  attachment8,
  attachment9,
  attachment10
) => {
  try {
    const newRecepients = recipients;
    newRecepients.push("nisargpatel@startupsahay.com")
    const transporter = await createTransporter();
    const paymentReceiptAttachments = processAttachments(attachment1);
    const paymentReceiptAttachments2 = processAttachments(attachment2);
    const paymentReceiptAttachments3 = processAttachments(attachment3);
    const paymentReceiptAttachments4 = processAttachments(attachment4);
    const paymentReceiptAttachments5 = processAttachments(attachment5);
    const paymentReceiptAttachments6 = processAttachments(attachment6);
    const paymentReceiptAttachments7 = processAttachments(attachment7);
    const paymentReceiptAttachments8 = processAttachments(attachment8);
    const paymentReceiptAttachments9 = processAttachments(attachment9);
    const paymentReceiptAttachments10 = processAttachments(attachment10);
    // console.log(paymentReceiptAttachments);
    // console.log(paymentReceiptAttachments2);
    // console.log(paymentReceiptAttachments3);
    // console.log(paymentReceiptAttachments4);
    // console.log(paymentReceiptAttachments5);
    // console.log(paymentReceiptAttachments6);
    // console.log(paymentReceiptAttachments7);
    // console.log(paymentReceiptAttachments8);
    // console.log(paymentReceiptAttachments9);
    // console.log(paymentReceiptAttachments10);
    const info = await transporter.sendMail({
      from: '"Start-Up Sahay Private Limited" <alerts@startupsahay.com>', // Replace with your Gmail email ID
      to: recipients.join(", "),
      replyTo: "shivangi@startupsahay.com",
      subject,
      text,
      html,
      attachments: [
        ...paymentReceiptAttachments,
        ...paymentReceiptAttachments2,
        ...paymentReceiptAttachments3,
        ...paymentReceiptAttachments4,
        ...paymentReceiptAttachments5,
        ...paymentReceiptAttachments6,
        ...paymentReceiptAttachments7,
        ...paymentReceiptAttachments8,
        ...paymentReceiptAttachments9,
        ...paymentReceiptAttachments10
      ],
    });


    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = { sendMail3 };
