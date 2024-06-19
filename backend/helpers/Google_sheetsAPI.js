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
    } else {
      return jsonData[header] ? jsonData[header] : "-";
    }
  });

  return data;
}

async function getCurrentRowCount() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A:A' // Get the first column to determine the current number of rows
    });
    return response.data.values ? response.data.values.length : 0;
  } catch (error) {
    console.error('Error fetching row count: ', error);
    throw error;
  }
}

async function appendDataToSheet(jsonData) {
  try {
    const currentRowCount = await getCurrentRowCount();
    const nextIndex = currentRowCount + 1; // Calculate the next index (row count includes header)

    const transformedData = transformData(jsonData);
    const indexedData = [nextIndex, ...transformedData];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A2', // Start appending data from the second row
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS', // Ensure new data inserts rows
      resource: {
        values: [indexedData],
      },
    });

    console.log('Data appended successfully.');
  } catch (error) {
    console.error('Error appending data: ', error);
    throw error; 
  }
}

module.exports = { appendDataToSheet };

