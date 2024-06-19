const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
require("dotenv").config();

// Load client secrets from a local file.
const credentialsPath = path.join(__dirname, 'googlesheet' , 'googlesheet.json');
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

// Define the required scopes
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Authenticate with the Google API
const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  SCOPES
);

// Google Sheets API setup
const sheets = google.sheets({ version: 'v4', auth });
const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID; 


function transformData(jsonData) {
  const headers = ["bookingDate", "bookingPublishDate", "Company Name", "Company Email", "Company Number", "panNumber",
    "bdeName", "bdmName", "bookingSource", "numberOfServices", "totalAmount", "receivedAmount", "pendingAmount", "paymentMethod",
    "caCase", "caNumber", "caEmail", "caCommission"
  ];


  jsonData.services.forEach((serviceObj, index) => {
    headers.push(`services[${index}].serviceName`);
    headers.push(`services[${index}].totalPaymentWOGST`);
    headers.push(`services[${index}].totalPaymentWGST`);
    headers.push(serviceObj.paymentTerms === "Full Advanced" ? `services[${index}].totalPaymentWGST` : `services[${index}].firstPayment`);
    headers.push(`services[${index}].secondPayment`);
    headers.push(`services[${index}].thirdPayment`);
    headers.push(`services[${index}].fourthPayment`);
  });

  const data = headers.map(header => {
    if (header.startsWith("services")) {
      const [_, serviceIndex, serviceProp] = header.match(/services\[(\d+)\]\.(.*)/);
      return jsonData.services[serviceIndex][serviceProp] ? jsonData.services[serviceIndex][serviceProp] : "-";
    }   
    else {
      return jsonData[header] ? jsonData[header] : "-";
    }
  });
  return [data];
}


async function appendDataToSheet(data) {
  try {
    const transformedData = transformData(data);
    
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A1', 
      valueInputOption: 'RAW',
      resource: {
        values: transformedData,
      },
    });
  } catch (error) {
    console.error('Error appending data: ', error);
    throw error; // Re-throw error to handle it in the route
  }
}

module.exports = { appendDataToSheet };
