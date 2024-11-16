import React, { useEffect, useState } from "react";
import "../dist/css/tabler.min.css?1684106062";
import "../dist/css/tabler-flags.min.css?1684106062";
import "../dist/css/tabler-payments.min.css?1684106062";
import "../dist/css/tabler-vendors.min.css?1684106062";
import "../dist/css/demo.min.css?1684106062";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import myImage from "../static/mainLogo.png";
import { useNavigate } from "react-router-dom";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import Notification from "./Notification";
import Avatar from '@mui/material/Avatar';
import axios from "axios";
import Bellicon from "./Bellicon";
import io from 'socket.io-client';
import { SnackbarProvider, enqueueSnackbar, MaterialDesignContent } from 'notistack';
import notification_audio from "../assets/media/iphone_sound.mp3"
import Admin_logo from "../assets/media/admin_image.jpeg"
import ReportComplete from "../components/ReportComplete";
import Notification_BOX from "./Notification_BOX";
import booking_audio from "../assets/media/Booking-received.mp3"

// import "./styles/header.css"


function Header({ name, designation }) {

  const secretKey = process.env.REACT_APP_SECRET_KEY;


  //console.log(name)
  //console.log(designation)

  // ------------------------------------  Socket IO Requests ----------------------------------------------------------------
  useEffect(() => {
    const socket = secretKey === "http://localhost:3001/api" ? io("http://localhost:3001") : io("wss://startupsahay.in", {
      secure: true, // Use HTTPS
      path: '/socket.io',
      reconnection: true,
      transports: ['websocket'],
    });




    socket.on("delete-booking-requested", (res) => {
      enqueueSnackbar(`Booking Delete Request Received From ${res}`, {
        variant: 'reportComplete',
        persist: true
      });

      const audioplayer = new Audio(notification_audio);
      audioplayer.play();
    });
    socket.on("booking-submitted", (res) => {
      enqueueSnackbar(`Booking Received from ${res}`, { variant: "reportComplete", persist: true });

      const audioplayer = new Audio(booking_audio);
      audioplayer.play();
    });

    socket.on("newRequest", (res) => {
    
      
      enqueueSnackbar(`${res.name} Is Asking For Data`, {
        variant: 'reportComplete',
        persist: true
      });

      const audioplayer = new Audio(notification_audio);
      audioplayer.play();
    });
    socket.on("editBooking_requested", (res) => {
      enqueueSnackbar(`Booking Edit Request Received From ${res.bdeName}`, {
        variant: 'reportComplete',
        persist: true
      });

      const audioplayer = new Audio(notification_audio);
      audioplayer.play();
    });
    socket.on("approve-request", (res) => {
      enqueueSnackbar(`Lead Upload Request Received From ${res}`, {
        variant: 'reportComplete',
        persist: true
      });

      const audioplayer = new Audio(notification_audio);
      audioplayer.play();
    });

    socket.on("payment-approval-request" , (res)=>{
      enqueueSnackbar(`Payment Approval Requests Recieved From ${res.name}`, {
        variant: 'reportComplete',
        persist: true
      });

      const audioplayer = new Audio(notification_audio);
      audioplayer.play();
    })
    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  const adminName = localStorage.getItem("adminName")
  const [totalEmployees, setTotalEmployees] = useState([])
  // Fetch initial data when user logs in
  const fetchData = async () => {
    try {
      const response = await axios.get(`${secretKey}/employee/einfo`);
      const tempData = response.data;
      
      // Set total employees
      setTotalEmployees(tempData);
  
      // Create an array of employee numbers from the total employees data
      const employeeNumbers = tempData.map((item) => item.number); // Extract the 'number' field
  
      // You can use employeeNumbers array now
      // console.log("Employee Numbers: ", employeeNumbers);
  
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const formatDateAndTime = (AssignDate) => {
    // Convert AssignDate to a Date object
    const date = new Date(AssignDate);

    // Convert UTC date to Indian time zone
    const options = { timeZone: "Asia/Kolkata" };
    const indianDate = date.toLocaleString("en-IN", options);
    return indianDate;
  };

  const [error, setError] = useState(null);
  const fetchMonthlyData = async (employeeNumber, startDate, endDate) => {
    let currentDate = new Date(startDate);
    const data = [];

    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split('T')[0]; // Format YYYY-MM-DD

      const dailyResult = await fetchDailyData(dateString, employeeNumber);
      if (dailyResult) {
        data.push(...dailyResult); // Push all daily results (with date field) into the array
      }

      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
      await delay(1000); // Wait for 1 second to respect the rate limit
    }

    return data;
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchDailyData = async (date, employeeNumber) => {
    const apiKey = process.env.REACT_APP_API_KEY; // Ensure this is set in your .env file
    const url = 'https://api1.callyzer.co/v2/call-log/employee-summary';

    const startTimestamp = Math.floor(new Date(date).setUTCHours(4, 0, 0, 0) / 1000);
    const endTimestamp = Math.floor(new Date(date).setUTCHours(13, 0, 0, 0) / 1000);

    // console.log("start", startTimestamp)
    // console.log("end", endTimestamp)
    const body = {
      "call_from": startTimestamp,
      "call_to": endTimestamp,
      "call_types": ["Missed", "Rejected", "Incoming", "Outgoing"],
      "emp_numbers": [employeeNumber]
    };

    try {
      const response = await fetch(url, {
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
      const dateString = date.toISOString().split('T')[0]; // Format YYYY-MM-DD

      // Append the date field to each result
      return data.result.map((entry) => ({
        ...entry,
        date: dateString // Add the date field
      }));
    } catch (err) {
      console.error(err);
      setError(err.message);
      return null;
    }
  };

  

  const saveMonthlyDataToDatabase = async (employeeNumber, dailyData) => {
    try {
      const response = await axios.post(`${secretKey}/employee/employee-calling/save`, {
        emp_number: employeeNumber,
        monthly_data: dailyData,  // This will now only include the previous day's data
        emp_code: dailyData[0].emp_code,
        emp_country_code: dailyData[0].emp_country_code,
        emp_name: dailyData[0].emp_name,
        emp_tags: dailyData[0].emp_tags,
      });

      if (response.status !== 200) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      // console.log('Previous day data saved successfully');
    } catch (err) {
      console.error('Error saving data:', err.message);
    }
  };

  const officialHolidays = [
    '2024-01-14', '2024-01-15', '2024-03-24', '2024-03-25',
    '2024-07-07', '2024-08-19', '2024-10-12',
    '2024-10-31', '2024-11-01', '2024-11-02', '2024-11-03', '2024-11-04', '2024-11-05'
];

const isHolidayOrSunday = (date) => {
  const dateString = date.toISOString().split('T')[0]; // Format YYYY-MM-DD
  const day = date.getDay(); // 0 = Sunday, 6 = Saturday
  return officialHolidays.includes(dateString) || day === 0; // Check if it's a holiday or Sunday
};

// useEffect(() => {
 
//     const employeeNumbers = totalEmployees.map((item) => item.number); // Extract the 'number' field

//     // Set the target date (2024-10-05 in this case)
//     const targetDate = new Date();
//     console.log("Target Date: ", targetDate);

//     // Check if the target date is a holiday or weekend, and adjust accordingly
//     const previousWorkingDay = new Date(targetDate); // Copy the target date
//     while (isHolidayOrSunday(previousWorkingDay)) {
//       previousWorkingDay.setDate(previousWorkingDay.getDate() - 1); // Move to the previous working day
//     }

//     console.log("Final Adjusted Previous Working Day:", previousWorkingDay); // This will show the last working day

//     const fetchAndSaveData = async () => {
//       // Loop through employee numbers and fetch/save data for each
//       for (let empNumber of employeeNumbers) {
//         const dailyData = await fetchDailyData(previousWorkingDay, empNumber); // Fetch for the adjusted previous working day
//         if (dailyData) {
//           await saveMonthlyDataToDatabase(empNumber, dailyData); // Save the data for this employee
//         }
//       }
//     };

//     fetchAndSaveData();
  
// }, [totalEmployees]);


useEffect(() => {
 
  const employeeNumbers = totalEmployees.map((item) => item.number); // Extract the 'number' field

      // Calculate the previous day
      const previousDay = new Date();
      console.log("previousDay", previousDay);
      previousDay.setDate(previousDay.getDate() - 1);

      // Find the last working day
      while (isHolidayOrSunday(previousDay)) {
          previousDay.setDate(previousDay.getDate() - 1); // Move to the previous day
      }

      const fetchAndSaveData = async () => {
          // Loop through employee numbers and fetch/save data for each
          for (let empNumber of employeeNumbers) {
              const dailyData = await fetchDailyData(previousDay, empNumber); // Fetch for the last working day
              if (dailyData) {
                  await saveMonthlyDataToDatabase(empNumber, dailyData); // Save the data for this employee
              }
          }
      };

      fetchAndSaveData();
 
}, [totalEmployees]);

  return (
    <div>
      <header className="navbar navbar-expand-md d-print-none">
        <div className="container-xl">

          {/* -------------left-side-startupsahay-image-code-------------------- */}

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

            
          {/* --------------------------notification-box-code--------------------- */}
          <div style={{ display: "flex", alignItems: "center" }} className="navbar-nav flex-row order-md-last">
            {/* <Bellicon isAdmin={adminName ? true : false} data={requestData} gdata = {requestGData} adata={mapArray}/>
           */}
            <Notification_BOX />
            
            {/* --------------------------------display image code---------------------------- */}
            <Avatar className="My-Avtar" sx={{ width: 36, height: 36 }} />
            <div className="nav-item dropdown">
              <button
                className="nav-link d-flex lh-1 text-reset p-0"
                data-bs-toggle="dropdown"
                aria-label="Open user menu"
              >

                <div className="d-xl-block ps-2">
                  <div style={{ textTransform: "capitalize", textAlign: "left"}}>{adminName ? adminName : "Admin"}</div>
                  <div style={{ textAlign: "left" }} className="mt-1 small text-muted">
                    {designation ? designation : "Managing Director"}
                  </div>
                </div>
              </button>
            </div>



{/* ------------------------three dots for logout and profile page component------------------- */}
            <Notification />

          </div>
        </div>
      </header>


     
     {/* ----------------------snackbar code---------------------------------  */}
      <SnackbarProvider Components={{ reportComplete: ReportComplete }}
        iconVariant={{
          success: '✅',
          error: '✖️',
          warning: '⚠️',
          info: 'ℹ️ ',
        }}
        maxSnack={5}>
      </SnackbarProvider>
    </div>
  );
}

export default Header;
