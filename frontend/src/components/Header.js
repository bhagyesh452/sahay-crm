import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../dist/css/tabler.min.css?1684106062";
import "../dist/css/tabler-flags.min.css?1684106062";
import "../dist/css/tabler-payments.min.css?1684106062";
import "../dist/css/tabler-vendors.min.css?1684106062";
import "../dist/css/demo.min.css?1684106062";
import myImage from "../static/mainLogo.png";
import Notification from "./Notification";
import Avatar from '@mui/material/Avatar';
import BellEmp from "./BellEmp";
import io from "socket.io-client";
import axios from "axios";
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import notification_audio from "../assets/media/notification_tone.mp3"
import ReportComplete from "./ReportComplete";
import Bella_Lagin from "./Bella_Lagin";
import Notification_box_employee from "./Notification_box_employee";
import MaleEmployee from "../static/EmployeeImg/office-man.png";
import FemaleEmployee from "../static/EmployeeImg/woman.png";
import ProjectionInformationDialog from "../employeeComp/ExtraComponents/ProjectionInformationDialog";
import { useNavigate } from 'react-router-dom';
// import "./styles/header.css"


function Header({ name, id, designation, empProfile, gender }) {
  const { userId } = useParams();
  const [socketID, setSocketID] = useState("");
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [data, setData] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogCount, setDialogCount] = useState(0);
  const [showDialogStatus, setShowDialogStatus] = useState(false);
  const navigate = useNavigate();
  // Fetch initial data when user logs in
  const fetchData = async () => {
    try {
      const response = await axios.get(`${secretKey}/employee/einfo`);
      const tempData = response.data;
      const userData = tempData.find((item) => item._id === userId);
      setData(userData);


    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };


  useEffect(() => {
    fetchData(); // Fetch user data on component mount
  }, []);


  useEffect(() => {
    fetchData();
    const socket = secretKey === "http://localhost:3001/api" ? io("http://localhost:3001") : io("wss://startupsahay.in", {
      secure: true, // Use HTTPS
      path: '/socket.io',
      reconnection: true,
      transports: ['websocket'],
    });

    socket.on("connect", () => {
      //console.log("Socket connected with ID:", socket.id);
      console.log('Connection Successful to socket io')
      setSocketID(socket.id);
    });

    socket.on("data-sent", (res) => {
      if (res.name === name) {
        enqueueSnackbar(`Your Request of ${res.dAmount} Leads is Accepted!PLEASE REFRESH 🔄`, { variant: "reportComplete", persist: true });
        const audioplayer = new Audio(notification_audio);
        audioplayer.play();
      }
    });

    socket.on("new-leads-assigned", (res) => {
      if (res.name === name) {
        enqueueSnackbar(`New Leads Assigned To You!PLEASE REFRESH 🔄`, { variant: "reportComplete", persist: true });
        const audioplayer = new Audio(notification_audio);
        audioplayer.play();
      }
    });

    socket.on("delete-leads-request-bde", (res) => {
      if (res.name === name) {
        enqueueSnackbar(`Your Request of ${res.dAmount} Leads is Rejected!`, { variant: "reportComplete", persist: true });
        const audioplayer = new Audio(notification_audio);
        audioplayer.play();
      }
    });

    socket.on("data-action-performed", (res) => {
      if (name === res) {
        enqueueSnackbar(`DATA REQUEST ACCEPTED! PLEASE REFRESH 🔄`, {
          variant: 'reportComplete',
          persist: true
        });
        const audioplayer = new Audio(notification_audio);
        audioplayer.play();
      }
    });

    socket.on("data-action-performed-ondelete", (res) => {
      if (name === res) {
        enqueueSnackbar(`DATA REQUEST REJECTED! PLEASE REFRESH 🔄`, {
          variant: 'reportComplete',
          persist: true
        });
        const audioplayer = new Audio(notification_audio);
        audioplayer.play();
      }
    });

    socket.on("delete-request-done", (res) => {
      if (res.name === name) {
        enqueueSnackbar(`Booking Delete Request Accepted for ${res.companyName}!`, {
          variant: 'reportComplete',
          persist: true
        });
        const audioplayer = new Audio(notification_audio);
        audioplayer.play();
      }
    });

    socket.on("delete-request-done-ondelete", (res) => {
      if (res.name === name) {
        enqueueSnackbar(`Booking Delete Request Rejected for ${res.companyName}!`, {
          variant: 'reportComplete',
          persist: true
        });
        const audioplayer = new Audio(notification_audio);
        audioplayer.play();
      }
    });

    socket.on("Remaining_Payment_Added", (res) => {
      if (name === res.name) {
        enqueueSnackbar(`Remaining Amount Received from ${res.companyName}`, {
          variant: 'warning',
          autoHideDuration: 5000
        });
        const audioplayer = new Audio(notification_audio);
        audioplayer.play();
      }
    });

    socket.on("expanse-added", (res) => {
      console.log("Expanse Added", "response :" + res.name, "Name" + name)
      if (name === res.name) {
        enqueueSnackbar(`Expanse Added in ${res.companyName} `, {
          variant: 'info',
          autoHideDuration: 5000
        });
        const audioplayer = new Audio(notification_audio);
        audioplayer.play();
      }
    });

    socket.on("booking-updated", (res) => {
      if (name === res.name) {
        enqueueSnackbar(`Booking Edit Request for ${res.companyName} has been Accepted!`, {
          variant: 'reportComplete',
          persist: true
        });
        const audioplayer = new Audio(notification_audio);
        audioplayer.play();
      }
    });

    socket.on("bookingbooking-edit-request-delete", async (res) => {
      if (name === res.name) {
        enqueueSnackbar(`Booking Edit Request for ${res.companyName} has been Rejected!`, {
          variant: 'reportComplete',
          persist: true
        });
        const audioplayer = new Audio(notification_audio);
        audioplayer.play();
      }
    });

    socket.on("bdmDataAcceptedRequest", (res) => {
      if (name === res.ename) {
        enqueueSnackbar(`BDM has accpeted ${res.companyName} 🔄`, {
          variant: 'reportComplete',
          persist: true
        });
        const audioplayer = new Audio(notification_audio);
        audioplayer.play();
      }
    });

    socket.on("payment-approval-requets-accept", (res) => {
      if (name === res.name) {
        enqueueSnackbar(`Payment Approval Request Accepted ! 🔄`, {
          variant: 'reportComplete',
          persist: true
        });
        const audioplayer = new Audio(notification_audio);
        audioplayer.play();
      }
    });

    socket.on("payment-approval-requets-reject", (res) => {
      if (name === res.name) {
        enqueueSnackbar(`Payment Approval Request Rejected ! 🔄`, {
          variant: 'reportComplete',
          persist: true
        });
        const audioplayer = new Audio(notification_audio);
        audioplayer.play();
      }
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [name]);

  useEffect(() => {
    const checkAndRunActiveStatus = () => {
      if (userId) {
        activeStatus();
      } else {
        const intervalId = setInterval(() => {
          if (userId) {
            activeStatus();
            clearInterval(intervalId);
          }
        }, 1000);
        return () => clearInterval(intervalId); // Cleanup interval on unmount
      }
    };

    const timerId = setTimeout(() => {
      checkAndRunActiveStatus();
    }, 2000);

    return () => {
      clearTimeout(timerId);
    };
  }, [socketID, userId]);


  // ----------------------------------   Functions  ----------------------------------------------

  const activeStatus = async () => {
    if (userId && socketID) {
      try {

        console.log("Request is sending for" + socketID + " " + userId)
        const response = await axios.put(
          `${secretKey}/employee/online-status/${userId}/${socketID}`
        );
        //console.log(response.data); // Log response for debugging
        return response.data; // Return response data if needed
      } catch (error) {
        console.error("Error:", error);
        throw error; // Throw error for handling in the caller function
      }
    } else {
      console.log(userId, socketID, "This is it")
    }
  };

  // ----------------call logs component------------------
  const [error, setError] = useState(null);


  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchDailyData = async (date, employeeNumber) => {
    const apiKey = process.env.REACT_APP_API_KEY; // Ensure this is set in your .env file
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

      console.log('Previous day data saved successfully');
    } catch (err) {
      console.error('Error saving data:', err.message);
    }
  };

  useEffect(() => {
    if (data.number) {
      // Calculate the previous day
      const previousDay = new Date();
      previousDay.setDate(previousDay.getDate() - 1);

      const fetchAndSaveData = async () => {
        const dailyData = await fetchDailyData(previousDay, data.number); // Fetch only for the previous day
        if (dailyData) {
          await saveMonthlyDataToDatabase(data.number, dailyData); // Save only the previous day's data
        }
      };

      fetchAndSaveData();
    }
  }, [data]);

  const storedData = JSON.parse(localStorage.getItem(userId)) || {};
  const [showPopup, setShowPopup] = useState(false);
  const [popupCount, setPopupCount] = useState(storedData.count || 0);
  const [lastPopupTime, setLastPopupTime] = useState(storedData.lastShown || null);
  //const [dialogCount, setDialogCount] = useState(0); // Count of how many times dialog has shown

  // Utility function to get the current date in 'YYYY-MM-DD' format
  const getTodayDate = () => new Date().toISOString().split("T")[0];

  // Load state from localStorage when the component mounts
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem(userId)) || {};
    const today = getTodayDate();
    console.log("here", storedData)

    // Reset if it's a new day
    if (storedData.date !== today) {
      localStorage.setItem(
        userId,
        JSON.stringify({ date: today, count: 0, lastShown: null, dismissed: false })
      );
      setPopupCount(0);
      setLastPopupTime(null);
    } else {
      setPopupCount(storedData.count || 0);
      setLastPopupTime(new Date(storedData.lastShown) || null);
    }
  }, [userId]);

  // Control when the popup is shown
  // useEffect(() => {
  //   const storedData = JSON.parse(localStorage.getItem(userId));
  //   const now = Date.now();
  //   const timeSinceLastPopup = lastPopupTime ? now - new Date(storedData.lastShown).getTime() : Infinity;
  //   if (!storedData || storedData.dismissed || storedData.popupCount >= 3) {
  //     console.log("1 yahan chala" , storedData , popupCount , lastPopupTime)
  //     return;  // Exit early if popup is dismissed
  //   }


  //   // Show the popup if 15 minutes have passed since the last popup and the count is < 3
  //   if (!storedData.dismissed && storedData.count < 3 && timeSinceLastPopup >= 1 * 60 * 1000) {
  //     console.log("2 yahan chala" , storedData , popupCount , lastPopupTime)
  //     setShowPopup(true);
  //   }
  // }, [lastPopupTime, popupCount]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem(userId));
    const now = Date.now();
    const timeSinceLastPopup = lastPopupTime ? now - new Date(storedData.lastShown).getTime() : Infinity;

    console.log("Stored Data:", storedData);
    console.log("Current Time:", now);
    console.log("Last Popup Time:", lastPopupTime);
    console.log("Time Since Last Popup:", timeSinceLastPopup);
    console.log("Popup Count:", storedData?.count);

    // Check if storedData is null or if popup is dismissed
    if (!storedData || storedData.dismissed || storedData.count >= 3) {
      console.log("Condition 1 met, exiting:", {
        dismissed: storedData?.dismissed,
        popupCount: storedData?.count,
      });
      setShowPopup(false)
      return;  // Exit early if popup is dismissed or count is 3 or more
    }

    // Show the popup if 15 minutes have passed since the last popup and the count is < 3
    if (!storedData.dismissed && storedData.count < 3 && timeSinceLastPopup >= 15 * 60 * 1000) {
      console.log("Condition 2 met, showing popup:", {
        dismissed: storedData.dismissed,
        popupCount: storedData.count,
        timeSinceLastPopup: timeSinceLastPopup,
      });
      setShowPopup(true);
    } else {
      console.log("Popup not shown. Conditions not met:", {
        dismissed: storedData.dismissed,
        count: storedData.count,
        timeSinceLastPopup: timeSinceLastPopup,
      });
    }
  }, [lastPopupTime, popupCount, userId]);


  // Set the next popup to appear 15 minutes after the current one closes
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem(userId));
    if (!storedData.dismissed && popupCount < 3) {
      const timer = setTimeout(() => {
        console.log("3 yahan chala", storedData, popupCount, lastPopupTime)
        setShowPopup(true);
      }, 15 * 60 * 1000); // 15 minutes from now

      return () => clearTimeout(timer); // Clean up the timer on component unmount
    }
  }, [popupCount, lastPopupTime]);

  // Handle the "Yes" button
  const handleYesClick = async () => {
    const storedData = JSON.parse(localStorage.getItem(userId));
    const newCount = storedData.count + 1;
    const now = new Date();

    // Update localStorage with new count and last shown time
    localStorage.setItem(
      userId,
      JSON.stringify({ ...storedData, count: newCount, lastShown: now })
    );
    setPopupCount(newCount);
    setLastPopupTime(now);
    setShowPopup(false);
    try {
      await axios.post(`${secretKey}/employee/projectionstatustoday/${userId}`, {
        projectionStatusForToday: "Pending",
        projectionDate: now // Use the current date directly
      });

      // Update component state

      navigate(`/employee-data/${userId}`);
    } catch (error) {
      console.error("Error updating projection status:", error);
      // Handle error (e.g., show a notification or alert)
    }
  };

  // Handle the "No" button to disable popups for the rest of the day
  // Handle the "No" button to disable popups for the rest of the day
  const handleNoClick = async () => {
    const storedData = JSON.parse(localStorage.getItem(userId)) || {};

    // Set count to 3 and dismissed to true, ensuring no further popups
    localStorage.setItem(userId, JSON.stringify({
      ...storedData,
      count: 3,  // Set count to maximum to prevent further popups
      dismissed: true,  // Mark dismissed as true
      lastShown: new Date(),  // Optionally set the lastShown timestamp
    }));
    // Update component state
    setPopupCount(3);
    setShowPopup(false)
    try {
      await axios.post(`${secretKey}/employee/projectionstatustoday-no/${userId}`, {
        projectionStatusForToday: "No",
        projectionDate: new Date() // Use the current date directly
      });

      
    } catch (error) {
      console.error("Error updating projection status:", error);
      // Handle error (e.g., show a notification or alert)
    }
    ;
  };




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
          <div style={{ display: "flex", alignItems: "center" }} className="navbar-nav flex-row order-md-last">



            {/* --------------------------notification-box-code--------------------- */}
            {name && <Notification_box_employee name={name} />}


            {/* --------------------------------display image code---------------------------- */}
            {empProfile ? <Avatar src={`${secretKey}/employee/fetchProfilePhoto/${id}/${encodeURIComponent(empProfile)}`}
              className="My-Avtar" sx={{ width: 36, height: 36 }} />
              : <Avatar
                src={gender === "Male" ? MaleEmployee : FemaleEmployee}
                className="My-Avtar" sx={{ width: 36, height: 36 }} />
            }

            <div className="nav-item dropdown">
              <button
                className="nav-link d-flex lh-1 text-reset p-0"
                data-bs-toggle="dropdown"
                aria-label="Open user menu"
              >
                <div className="d-xl-block ps-2">
                  <div style={{ textAlign: "left" }}>{name ? name : "Username"}</div>
                  {/* <div style={{ textAlign: "left" }} className="mt-1 small text-muted">
                    {designation ? designation : "Sales Executive"}
                  </div> */}
                  <div style={{ textAlign: "left" }} className="mt-1 small text-muted">
                    {designation === "Business Development Executive" ? "BDE" :
                      designation === "Business Development Manager" ? "BDM" :
                        designation}
                  </div>
                </div>
              </button>
            </div>


            {/* ------------------------three dots for logout and profile page component------------------- */}
            <Notification name={name} designation={designation} />
            <div
              style={{ display: "flex", alignItems: "center" }}
              className="item"
            >

            </div>
          </div>
        </div>
      </header>

      {/* ----------------------snackbar code---------------------------------  */}

      <SnackbarProvider Components={{
        reportComplete: ReportComplete
      }} maxSnack={3}>

      </SnackbarProvider>

      {/* -----------------showDialog---------------------------- */}

      <ProjectionInformationDialog
        handleYesClick={handleYesClick}
        handleNoClick={handleNoClick}
        showDialog={showPopup}

      />

    </div>
  );
}

export default Header;