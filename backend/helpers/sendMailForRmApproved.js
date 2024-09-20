const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const mime = require("mime-types");

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

  async function createTransporter() {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          
      }
    })
  }