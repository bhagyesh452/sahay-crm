import React, { useState, useEffect } from "react";
import '../../../dist/css/tabler.min.css?1684106062';
import "../../../dist/css/tabler-flags.min.css?1684106062";
import "../../../dist/css/tabler-payments.min.css?1684106062";
import "../../../dist/css/tabler-vendors.min.css?1684106062";
import "../../../dist/css/demo.min.css?1684106062";
import myImage from '../../../static/mainLogo.png';
import Avatar from '@mui/material/Avatar';
import Notification from "../../Components/Notification/Notification.jsx";
import MaleEmployee from "../../../static/EmployeeImg/office-man.png";
import FemaleEmployee from "../../../static/EmployeeImg/woman.png";
import axios from 'axios'
import { useParams } from "react-router-dom";

function Header({ name, id, designation, empProfile, gender }) {
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const bdmUserId = useParams();
  const [data, setData] = useState([])
//   const fetchData = async () => {
//     try {
//       console.log("kitni br fetch hua")
//       const response = await axios.get(`${secretKey}/employee/einfo`);
//       // Set the retrieved data in the state
//       const tempData = response.data;
      
//       const userData = tempData.find((item) => item._id === bdmUserId.userId);
//       console.log("id" , bdmUserId)
//       console.log("tempdata" , userData)
//       setData(userData);
//     } catch (error) {
//       console.error("Error fetching data:", error.message);
//     }
//   };
//   const [error, setError] = useState(null);
//   const convertSecondsToHMS = (totalSeconds) => {
//     const hours = Math.floor(totalSeconds / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const seconds = totalSeconds % 3600 % 60;

//     return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
//   };

//   const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

//   const fetchDailyData = async (date , employeeNumber) => {
//     const apiKey = process.env.REACT_APP_API_KEY; // Ensure this is set in your .env file
//     const url = 'https://api1.callyzer.co/v2/call-log/employee-summary';

//     const startTimestamp = Math.floor(new Date(date).setUTCHours(4, 0, 0, 0) / 1000);
//     const endTimestamp = Math.floor(new Date(date).setUTCHours(13, 0, 0, 0) / 1000);

//     const body = {
//         "call_from": startTimestamp,
//         "call_to": endTimestamp,
//         "call_types": ["Missed", "Rejected", "Incoming", "Outgoing"],
//         "emp_numbers": [employeeNumber]
//     };

//     try {
//         const response = await fetch(url, {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Bearer ${apiKey}`,
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(body)
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(`Error: ${response.status} - ${errorData.message || response.statusText}`);
//         }

//         const data = await response.json();

//         // Append the date field to each result
//         return data.result.map((entry) => ({
//             ...entry,
//             date: date // Add the date field
//         }));
//     } catch (err) {
//         console.error(err);
//         setError(err.message);
//         return null;
//     }
// };
//   const fetchMonthlyData = async (employeeNumber, startDate, endDate) => {
//     let currentDate = new Date(startDate);
//     const data = [];

//     while (currentDate <= endDate) {
//       const dateString = currentDate.toISOString().split('T')[0]; // Format YYYY-MM-DD

//       const dailyResult = await fetchDailyData(dateString, employeeNumber);
//       if (dailyResult) {
//         data.push(...dailyResult); // Push all daily results (with date field) into the array
//     }

//       currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
//       await delay(1000); // Wait for 1 second to respect the rate limit
//     }

//     return data;
//   };

//   const saveMonthlyDataToDatabase = async (employeeNumber, monthlyData) => {
//     try {
//       const response = await axios.post(`${secretKey}/employee/employee-calling/save`, {
//         emp_number: employeeNumber,
//         monthly_data: monthlyData,
//         emp_code:monthlyData[0].emp_code,
//         emp_country_code:monthlyData[0].emp_country_code,
//         emp_name: monthlyData[0].emp_name,
//         emp_tags:monthlyData[0].emp_tags,
//       });
  
//       // Check the HTTP status for success
//       if (response.status !== 200) {
//         throw new Error(`Error: ${response.status} - ${response.statusText}`);
//       }
  
//       console.log('Data saved successfully');
//     } catch (err) {
//       console.error('Error saving data:', err.message);
//     }
//   };
//   useEffect(() => {
//     if (data.number !== undefined) {
//       const startDate = new Date();
//       startDate.setDate(1); // Set to the first day of the month
//       const endDate = new Date(startDate);
//       endDate.setMonth(endDate.getMonth());
//       endDate.setDate(new Date().getDate()); // Set to the last day of the month

//       const fetchAndSaveData = async () => {
//         const monthlyData = await fetchMonthlyData(data.number, startDate, endDate);
//         await saveMonthlyDataToDatabase(data.number, monthlyData);
//       };

//       fetchAndSaveData();
//     }
//   },[data]);

//   useEffect(()=>{
//     fetchData()
//   },[bdmUserId])
//   console.log("data" , data)

  return (
    <div>
      <header className="navbar navbar-expand-md d-print-none">
        <div className="container-xl">
          {/* <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbar-menu"
            aria-controls="navbar-menu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button> */}
          <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
            <a href=".">
              <img
                src={myImage}
                width="110"
                height="32"
                alt="Start-Up Sahay"
                className="navbar-brand-image"
              />
            </a>
          </h1>

          <div style={{ display: "flex", alignItems: "center" }} className="navbar-nav flex-row order-md-last">
            {/* <Bellicon data={requestData} gdata = {requestGData} adata={mapArray}/> */}
            {empProfile ? <Avatar src={`${secretKey}/employee/fetchProfilePhoto/${id}/${encodeURIComponent(empProfile)}`}
              className="My-Avtar" style={{ width: 36, height: 36 }} />
              : <Avatar
                src={gender === "Male" ? MaleEmployee : FemaleEmployee}
                className="My-Avtar" sx={{ width: 36, height: 36 }} />
            }

            <div className="nav-item dropdown">
              <button
                className="nav-link d-flex lh-1 text-reset p-0"
                data-bs-toggle="dropdown"
                aria-label="Open user menu">
                <div className="d-xl-block ps-2">
                  <div style={{ textTransform: "capitalize", textAlign: "left" }}>{name ? name : "Name"}</div>
                  <div style={{ textAlign: "left" }} className="mt-1 small text-muted">
                    {designation}
                  </div>
                </div>
                {/* <AiOutlineLogout style={{ width: "25px", height: "25px", marginLeft: "5px" }} onClick={() => handleLogout()} /> */}
              </button>
              <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                <a href="#" className="dropdown-item">
                  Status
                </a>
                <a href="#" className="dropdown-item">
                  Profile
                </a>
                <a href="#" className="dropdown-item">
                  Feedback
                </a>
                <div className="dropdown-divider"></div>
                <a href="#" className="dropdown-item">
                  Settings
                </a>
                <a href="#" className="dropdown-item">
                  Logout
                </a>
              </div>
            </div>
            <Notification />
            <div
              style={{ display: "flex", alignItems: "center" }}
              className="item">
            </div>
          </div>
        </div>
      </header>
    </div>
  )




}

export default Header;