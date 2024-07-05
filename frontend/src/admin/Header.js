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
import { SnackbarProvider, enqueueSnackbar , MaterialDesignContent } from 'notistack';
import notification_audio from "../assets/media/notification_tone.mp3"
import booking_audio from "../assets/media/moshi_moshi.mp3"    // Replace with Booking-received.mp3 
import Admin_logo from "../assets/media/admin_image.jpeg"
import ReportComplete from "../components/ReportComplete";
import Bella_Chao from "./Bella_Chao";

// import "./styles/header.css"


function Header({ name, designation}) {
 
  const secretKey = process.env.REACT_APP_SECRET_KEY;

  //console.log(name)
  //console.log(designation)

  // ------------------------------------  Socket IO Requests ----------------------------------------------------------------
  useEffect(() => {
    const socket = secretKey === "http://localhost:3001/api" ? io("http://localhost:3001") : io("wss://startupsahay.in", {
      secure: true, // Use HTTPS
      path:'/socket.io',
      reconnection: true, 
      transports: ['websocket'],
    });

    
    

    socket.on("delete-booking-requested", (res) => {
      enqueueSnackbar(`Booking Delete Request Received From ${res}`, {
        variant: 'reportComplete',
        persist:true
      });
    
      const audioplayer = new Audio(notification_audio);
      audioplayer.play();
    });
    socket.on("booking-submitted", (res) => {
      enqueueSnackbar(`Booking Received from ${res}`, { variant: "reportComplete" , persist:true });
    
      const audioplayer = new Audio(booking_audio);
      audioplayer.play();
    });
    socket.on("newRequest", (res) => {
      console.log("res" , res)
      enqueueSnackbar(`${res} Is Asking For 100 General Data`, {
        variant: 'reportComplete',
        persist:true
      });
    
      const audioplayer = new Audio(notification_audio);
      audioplayer.play();
    });
    socket.on("editBooking_requested", (res) => {
<<<<<<< HEAD
      enqueueSnackbar(`Booking Edit Request Received From ${res}`, {
=======
      console.log(res.bdeName , res.bdmName)
      enqueueSnackbar(`Booking Edit Request by ${res.bdeName}`, {
>>>>>>> 9482912086fe3a615b29493a6b702704138fe1e4
        variant: 'reportComplete',
        persist:true
      });
    
      const audioplayer = new Audio(notification_audio);
      audioplayer.play();
    });
    socket.on("approve-request", (res) => {
      enqueueSnackbar(`Lead Upload Request Received From ${res}`, {
        variant: 'reportComplete',
        persist:true
      });
    
      const audioplayer = new Audio(notification_audio);
      audioplayer.play();
    });
    
    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);
 
  const adminName = localStorage.getItem("adminName")

  const formatDateAndTime = (AssignDate) => {
    // Convert AssignDate to a Date object
    const date = new Date(AssignDate);

    // Convert UTC date to Indian time zone
    const options = { timeZone: "Asia/Kolkata" };
    const indianDate = date.toLocaleString("en-IN", options);
    return indianDate;
  };

  
  return (
    <div>
      <header className="navbar navbar-expand-md d-print-none">
        <div className="container-xl">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbar-menu"
            aria-controls="navbar-menu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
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
          <div style={{display:"flex" , alignItems:"center"}} className="navbar-nav flex-row order-md-last">
          {/* <Bellicon isAdmin={adminName ? true : false} data={requestData} gdata = {requestGData} adata={mapArray}/>
           */}
          <Bella_Chao/>
          
          <Avatar className="My-Avtar" sx={{ width: 36, height: 36 }} />
            <div className="nav-item dropdown">
              <button
                className="nav-link d-flex lh-1 text-reset p-0"
                data-bs-toggle="dropdown"
                aria-label="Open user menu"
              >
                
                <div className="d-xl-block ps-2">
                  <div style={{textTransform:"capitalize"}}>{adminName ? adminName : "Admin" }</div>
                  <div style={{textAlign:"left"}} className="mt-1 small text-muted">
                    {designation ? designation : "Admin"}
                  </div>
                </div>
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
            <Notification/>
            <div
              style={{ display: "flex", alignItems: "center" }}
              className="item"
            >             
            </div>
          </div>
        </div>
      </header>
      <SnackbarProvider  Components={{
        reportComplete: ReportComplete
      }} iconVariant={{
    success: '✅',
    error: '✖️',
    warning: '⚠️',
    info: 'ℹ️',
  }} maxSnack={3}>
   
    </SnackbarProvider>
    </div>
  );
}

export default Header;
