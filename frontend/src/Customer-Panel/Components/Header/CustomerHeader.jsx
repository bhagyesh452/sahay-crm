import React, { useEffect, useState } from "react";
import "../../../dist/css/tabler.min.css?1684106062";
import "../../../dist/css/tabler-flags.min.css?1684106062";
import "../../../dist/css/tabler-payments.min.css?1684106062";
import "../../../dist/css/tabler-vendors.min.css?1684106062";
import "../../../dist/css/demo.min.css?1684106062";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import myImage from "../../../static/mainLogo.png";
import { useNavigate } from "react-router-dom";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import CustomerNotification from "../Notification/CustomerNotification";
import Avatar from '@mui/material/Avatar';
import axios from "axios";
// import Bellicon from "./Bellicon";
import io from 'socket.io-client';
import { SnackbarProvider, enqueueSnackbar, MaterialDesignContent } from 'notistack';
// import notification_audio from "../assets/media/iphone_sound.mp3"
// import Admin_logo from "../assets/media/admin_image.jpeg";
// import ReportComplete from "../components/ReportComplete";
// import Notification_BOX from "./Notification_BOX";
// import booking_audio from "../assets/media/Booking-received.mp3"

// import "./styles/header.css"


function CustomerHeader({ name, designation }) {

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
            //   const audioplayer = new Audio(notification_audio);
            //   audioplayer.play();
        });

        socket.on("booking-submitted", (res) => {
            enqueueSnackbar(`Booking Received from ${res}`, { variant: "reportComplete", persist: true });
            //   const audioplayer = new Audio(booking_audio);
            //   audioplayer.play();
        });

        socket.on("newRequest", (res) => {
            console.log("res", res)
            enqueueSnackbar(`${res.name} Is Asking For ${res.dAmonut} General Data`, {
                variant: 'reportComplete',
                persist: true
            });
            //   const audioplayer = new Audio(notification_audio);
            //   audioplayer.play();
        });

        socket.on("editBooking_requested", (res) => {
            enqueueSnackbar(`Booking Edit Request Received From ${res.bdeName}`, {
                variant: 'reportComplete',
                persist: true
            });
            //   const audioplayer = new Audio(notification_audio);
            //   audioplayer.play();
        });

        socket.on("approve-request", (res) => {
            enqueueSnackbar(`Lead Upload Request Received From ${res}`, {
                variant: 'reportComplete',
                persist: true
            });

            //   const audioplayer = new Audio(notification_audio);
            //   audioplayer.play();
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

    const companyName = localStorage.getItem("companyName");
    const companyEmail = localStorage.getItem("companyEmail");

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


                    {/* --------------------------notification-box-code--------------------- */}
                    <div style={{ display: "flex", alignItems: "center" }} className="navbar-nav flex-row order-md-last">

                        {/* --------------------------------display image code---------------------------- */}
                        <Avatar className="My-Avtar" sx={{ width: 36, height: 36 }} />
                        <div className="nav-item dropdown">
                            <button
                                className="nav-link d-flex lh-1 text-reset p-0"
                                data-bs-toggle="dropdown"
                                aria-label="Open user menu"
                            >

                                <div className="d-xl-block ps-2">
                                    <div style={{ textTransform: "capitalize" }}>{companyName}</div>
                                    <div style={{ textAlign: "left" }} className="mt-1 small text-muted">{companyEmail}</div>
                                </div>
                            </button>
                        </div>
                        {/* ------------------------three dots for logout and profile page component------------------- */}
                        <CustomerNotification />

                    </div>
                </div>
            </header>



            {/* ----------------------snackbar code---------------------------------  */}
            {/* <SnackbarProvider Components={{ reportComplete: ReportComplete }}
        iconVariant={{
          success: '✅',
          error: '✖️',
          warning: '⚠️',
          info: 'ℹ️ ',
        }}
        maxSnack={5}>
      </SnackbarProvider> */}
        </div>
    );
}

export default CustomerHeader;
