const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const mime = require("mime-types");
const fs = require("fs");
const path = require("path");

// Create OAuth2 client
// const oAuth2Client = new google.auth.OAuth2({
//   clientId: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   redirectUri: "https://developers.google.com/oauthplayground",
// });

const oAuth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: "https://developers.google.com/oauthplayground",
  });
  
  // oAuth2Client.setCredentials({
  //   refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  // });
  

// Set OAuth2 refresh token
oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

// Create Nodemailer transporter with OAuth2
// async function createTransporter() {
//   try {
//     const accessToken = await oAuth2Client.getAccessToken();
//     return nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 465,
//       secure: true,
//       auth: {
//         type: "OAuth2",
//         user: "alerts@startupsahay.com", // Replace with your Gmail email ID
//         clientId: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
//         accessToken: accessToken,
//       },
//     });
//   } catch (error) {
//     console.error("Error creating transporter:", error);
//     throw error;
//   }
// }

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
  
// Function to process attachments
// const processAttachments = (files) => {
//   const attachments = [];

//   files.forEach((file) => {
//     const mimeType = mime.lookup(file.filename);
//     const attachment = {
//       filename: file.originalname,
//       contentType: mimeType,
//       content: file,
//     };
//     attachments.push(attachment);
    
//   });

//   return attachments;
// };

// const processAttachments = (files) => {
//     const attachments = [];

//     files.forEach((file) => {
//         const mimeType = mime.lookup(file.filename);
//         const attachment = {
//             filename: file.filename,
//             contentType: mimeType,
//             path: file.path,
//         };
//         attachments.push(attachment);
//     });

//     return attachments;
// };
const processAttachments = (files) => {
  const attachments = [];
  
  if (Array.isArray(files)) {
      files.forEach((file) => {
          const mimeType = mime.lookup(file.filename);
          const attachment = {
              filename: file.filename,
              contentType: mimeType,
              path: file.path,
          };
          attachments.push(attachment);
      });
  } else {
      console.warn("Attachments are not an array or are undefined");
  }

  return attachments;
};


// Function to send email with attachments and CC
const sendMail4 = async (recipients, ccEmail, subject1, text1,htmlToSend , attachments) => {

  try {
    const ccEmailNew = ccEmail;
    ccEmailNew.push("admin@startupsahay.com")
    const transporter = await createTransporter();

    // Process attachments
    const processedAttachments = processAttachments(attachments);
    console.log("This is docs",processedAttachments)

    
    console.log(recipients);

    // Send email
    const info = await transporter.sendMail({
      from: '"Start-Up Sahay Private Limited" <alerts@startupsahay.com>',
      to: recipients.join(", "),
      cc: ccEmailNew,
      replyTo: "support@startupsahay.com",
      subject:subject1,
      text:text1,
      html:htmlToSend,
      attachments: processedAttachments
    });

    console.log("html" , htmlToSend)
    console.log(attachments)

    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = { sendMail4 };
