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
// import "./styles/header.css"


function Header({ name, designation, empProfile }) {
  const { userId } = useParams();
  const [socketID, setSocketID] = useState("");
  const secretKey = process.env.REACT_APP_SECRET_KEY;





  useEffect(() => {
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
    socket.on("delete-leads-request-bde" , (res)=>{
      if(res.name === name){
        enqueueSnackbar(`Your Request of ${res.dAmount} Leads is Rejected!`, { variant: "reportComplete", persist: true });
        const audioplayer = new Audio(notification_audio);
        audioplayer.play();
      }
    })
    socket.on("data-assigned", (res) => {
      if (res === name) {
        enqueueSnackbar(`New Data Received!`, { variant: "reportComplete", persist: true });
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
        enqueueSnackbar(`Booking for ${res.companyName} has been Updated!`, {
          variant: 'info',
          autoHideDuration: 5000
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

  console.log("employeename", name)


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
            {/* <BellEmp name={name}/> */}
            {/* <Bella_Lagin name={name}/> */}


            {/* --------------------------notification-box-code--------------------- */}
            <Notification_box_employee name={name} />


            {/* --------------------------------display image code---------------------------- */}
            <Avatar src={`${secretKey}/employee/employeeImg/${name}/${encodeURIComponent(
              empProfile
            )}`} className="My-Avtar" sx={{ width: 36, height: 36 }} />
            <div className="nav-item dropdown">
              <button
                className="nav-link d-flex lh-1 text-reset p-0"
                data-bs-toggle="dropdown"
                aria-label="Open user menu"
              >
                <div className="d-xl-block ps-2">
                  <div style={{ textAlign: "left" }}>{name ? name : "Username"}</div>
                  <div style={{ textAlign: "left" }} className="mt-1 small text-muted">
                    {designation ? designation : "Admin"}
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
    </div>
  );
}

export default Header;
