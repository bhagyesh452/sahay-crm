const nodemailer = require("nodemailer");
const mime = require('mime-types');
const smtpTransport = require('nodemailer-smtp-transport');

const transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'alerts@startupsahay.com', // Your Gmail address
    clientId: '414406193938-89lakoke6o1l7ogs8ilodl0c25ev59os.apps.googleusercontent.com', // Your client ID
    clientSecret: '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', // Your client secret
  },
}));

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(recipients, subject, text, html, otherDocs, paymentReceipt) {
  const attachments = [];

  const processAttachments = (files, prefix) => {
    files.forEach((file, index) => {
      const mimeType = mime.lookup(file.originalname);

      if (mimeType) {
        attachments.push({
          filename: `${prefix}${index + 1}.${mime.extension(mimeType)}`,
          content: file, // Assuming file is a buffer, adjust if needed
        });
      } else {
        console.warn(`Unknown file type for ${file.originalname}`);
        // Handle unknown file type, for example, skip or log a warning
      }
    });
  };

  // Append files from otherDocs
  processAttachments(otherDocs, 'otherDocs');

  // Append files from paymentReceipt
  processAttachments(paymentReceipt, 'paymentReceipt');

  const info = await transporter.sendMail({
    from: 'alerts@startupsahay.com', // sender address
    to:recipients.join(', '),
    replyTo: 'bookings@startupsahay.com',
    subject, // Subject line
    text, // plain text body
    html, // html body
    attachments,
  });
}
 
module.exports = {sendMail}
