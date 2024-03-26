const nodemailer = require("nodemailer");
const mime = require('mime-types');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    // TODO: replace user and pass values from <https://forwardemail.net>
    user: "nimesh@incscale.in",
    pass: "jipaefozdbqwzlhu",
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(recipients, subject, text, html, otherDocs, paymentReceipt) {
  const attachments = [];

  const processAttachments = (files, prefix) => {
    if(files){
      files.map((file, index) => {
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
    }else{
      console.log("No documents")
    }
  
  
  };

  // Append files from otherDocs
  console.log("Before Sending: " , otherDocs)
  processAttachments(otherDocs, 'otherDocs');

  // Append files from paymentReceipt
  processAttachments(paymentReceipt, 'paymentReceipt');

  const info = await transporter.sendMail({
    from: 'nimesh@incscale.in', // sender address
    to:recipients.join(', '),
    replyTo: 'bookings@startupsahay.com',
    subject, // Subject line
    text, // plain text body
    html, // html body
    attachments,
  });
}
 
module.exports = {sendMail}
