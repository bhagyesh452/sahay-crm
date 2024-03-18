const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const nodemailer = require('nodemailer');
const cors = require('cors');
require("dotenv").config();

const router = express.Router();

// Enable CORS for all routes
router.use(cors());

// Configure Google OAuth 2.0 strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3001/api/auth/google/callback'
},
(accessToken, refreshToken, profile, done) => {
  // Store user profile data and credentials securely
  const user = {
    id: profile.id,
    email: profile.emails[0].value,
    accessToken: accessToken,
    refreshToken: refreshToken
  };
  return done(null, user);
}));

// Google OAuth login route with scope parameter
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })); // Include the desired scopes in the scope array

// Google OAuth callback route
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Redirect to dashboard or send a success response
    res.redirect('/dashboard');
  }
);

// Initialize Nodemailer transporter using user's credentials
function createTransporter(user) {
  return nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      type: 'OAuth2',
      user: user.email,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: user.refreshToken,
      accessToken: user.accessToken,
      expires: 3600 // Access token expiration time in seconds
    }
  });
}

// Send email route
router.post('/send-email', (req, res) => {
  // Authenticate user based on session or request data
  const user = req.user; // Assuming user is authenticated

  // Create Nodemailer transporter using user's credentials
  const transporter = createTransporter(user);

  // Send email using transporter
  transporter.sendMail({
    from: user.email,
    to: 'recipient@example.com',
    subject: 'Test Email',
    text: 'This is a test email sent from Nodemailer using Gmail OAuth 2.0.'
  }, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});

module.exports = router;
