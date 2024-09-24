var express = require("express");
var router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const adminModel = require("../models/Admin.js");
const PerformanceReportModel = require("../models/MonthlyPerformanceReportModel.js");
const TodaysProjectionModel = require("../models/TodaysGeneralProjection.js");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const EmployeeHistory = require("../models/EmployeeHistory");
const json2csv = require("json2csv").parse;
const deletedEmployeeModel = require("../models/DeletedEmployee.js");
const RedesignedLeadformModel = require("../models/RedesignedLeadform");
const CallingModel = require("../models/EmployeeCallingData.js");
const cron = require("node-cron");
const axios = require("axios");

// Helper function to convert seconds to H:M:S
const convertSecondsToHMS = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 3600 % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };
  

  // Helper function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch daily data
const fetchDailyData = async (date, employeeNumber) => {
  const apiKey = process.env.REACT_APP_API_KEY;
  const url = 'https://api1.callyzer.co/v2/call-log/employee-summary';

  const startTimestamp = Math.floor(new Date(date).setUTCHours(4, 0, 0, 0) / 1000);
  const endTimestamp = Math.floor(new Date(date).setUTCHours(13, 0, 0, 0) / 1000);

  const body = {
    "call_from": startTimestamp,
    "call_to": endTimestamp,
    "call_types": ["Missed", "Rejected", "Incoming", "Outgoing"],
    "emp_numbers": [employeeNumber]
  };

  try {
    const response = await axios(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error: ${response.status} - ${errorData.message || response.statusText}`);
    }

    const data = await response.json();

    // Append the date field to each result
    return data.result.map((entry) => ({
      ...entry,
      date: date // Add the date field
    }));
  } catch (err) {
    console.error('Error fetching daily data:', err.message);
    return null;
  }
};

// Fetch monthly data
const fetchMonthlyData = async (employeeNumber, startDate, endDate) => {
  let currentDate = new Date(startDate);
  const data = [];

  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString().split('T')[0];

    const dailyResult = await fetchDailyData(dateString, employeeNumber);
    if (dailyResult) {
      data.push(...dailyResult);
    }

    currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    await delay(1000); // Delay to avoid hitting the rate limit
  }

  return data;
};

// Save data to the database
const saveMonthlyDataToDatabase = async (employeeNumber, monthlyData) => {
  try {
    const response = await axios.post(`${process.env.SECRET_KEY}/employee/employee-calling/save`, {
      emp_number: employeeNumber,
      monthly_data: monthlyData,
      emp_code: monthlyData[0].emp_code,
      emp_country_code: monthlyData[0].emp_country_code,
      emp_name: monthlyData[0].emp_name,
      emp_tags: monthlyData[0].emp_tags,
    });

    if (response.status !== 200) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    console.log(`Data saved successfully for employee ${employeeNumber}`);
  } catch (err) {
    console.error(`Error saving data for employee ${employeeNumber}:`, err.message);
  }
};

// Cron job to fetch and save data at 12 PM every day
cron.schedule('30 15 * * *', async () => {  // Runs every day at 12 PM
  console.log('Starting cron job to fetch and save daily data for all employees');

  try {
    // Fetch all employees with a number field
    const employees = await adminModel.find({ number: { $exists: true, $ne: null } });

    if (employees.length === 0) {
      console.log('No employees found with a number field');
      return;
    }

    // Loop through each employee
    for (const employee of employees) {
      const employeeNumber = employee.number;
      console.log(`Fetching data for employee: ${employeeNumber}`);

      const startDate = new Date();
      startDate.setDate(1); // Set to the first day of the month

      const endDate = new Date();
      endDate.setDate(new Date().getDate()); // Set to the current day of the month

      // Fetch and save data for each employee
      const monthlyData = await fetchMonthlyData(employeeNumber, startDate, endDate);
      if (monthlyData && monthlyData.length > 0) {
        await saveMonthlyDataToDatabase(employeeNumber, monthlyData);
      }

      console.log(`Finished processing for employee: ${employeeNumber}`);
      await delay(1000); // Optional delay between processing employees
    }

    console.log('Cron job finished');
  } catch (err) {
    console.error('Error fetching employee data:', err.message);
  }
});

module.exports = router;