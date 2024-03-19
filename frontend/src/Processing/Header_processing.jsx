import React, { useEffect, useState } from "react";
import "../dist/css/tabler.min.css?1684106062";
import "../dist/css/tabler-flags.min.css?1684106062";
import "../dist/css/tabler-payments.min.css?1684106062";
import "../dist/css/tabler-vendors.min.css?1684106062";
import "../dist/css/demo.min.css?1684106062";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import myImage from "../static/logo.jpg";
import { useNavigate } from "react-router-dom";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
// import Notification from "../admin/Notification.js";
import Avatar from '@mui/material/Avatar';
import axios from "axios";
import Bellicon from "../admin/Bellicon.js";
import socketIO from 'socket.io-client';
import Processing_notification from './Processing_notification.js';
import Dashboard_processing from "./Dashboard_processing.jsx";
import CompanyList from "./CompanyList.jsx";
import {
  IconButton,
} from "@mui/material";
import Bellicon_processing from "./style_processing/Bellicon_processing.js";

// import "./styles/header.css"


function Header_processing({ name, designation, data }) {
  const [unreadCount, setUnreadCount] = useState(0); // State to hold the count of unread companies
  // console.log(data)
  const countUnreadCompanies = () => {

    if(data.length !== 0 || data !== undefined){
    const count = data.reduce((acc, company) => {
      if (!company.read) {
        return acc + 1;
      }
      return acc;
    }, 0);
    setUnreadCount(count);
  }}
  
  useEffect(() => {
    // Calculate the count of unread companies when the component mounts
  
    if(data){countUnreadCompanies()}

  }, [data]);

  //console.log("Data:" , data)

  const processingName = localStorage.getItem("username")

  const secretKey = process.env.REACT_APP_SECRET_KEY;
  useEffect(() => {
    const socket = socketIO.connect(`${secretKey}`);

    // Listen for the 'welcome' event from the server
    socket.on('welcome', (message) => {
      console.log(message); // Log the welcome message received from the server
    });
    fetchRequestDetails();
    fetchRequestGDetails();
    socket.on("newRequest", (newRequest) => {
      // Handle the new request, e.g., update your state
      console.log("New request received:", newRequest);

      // Fetch updated data when a new request is received
      fetchRequestDetails();
      fetchRequestGDetails();
    });
    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {

  }, []);


  const [requestData, setRequestData] = useState([]);
  const [requestGData, setRequestGData] = useState([]);

  const fetchRequestDetails = async () => {
    try {
      const response = await axios.get(`${secretKey}/requestData`);
      setRequestData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  const fetchRequestGDetails = async () => {
    try {
      const response = await axios.get(
        `${secretKey}/requestgData`
      );
      setRequestGData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
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
          <div style={{ display: "flex", alignItems: "center" }} className="navbar-nav flex-row order-md-last">
            {/* <IconButton>
           
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"></path><path d="M9 17v1a3 3 0 0 0 6 0v-1"></path></svg>
              <span style={{
              fontSize: "8px",
              borderRadius: "15px",
              marginBottom: "9px",
              padding: "2px"
            }} className="badge bg-red">{unreadCount}</span>
            </IconButton> */}

            <Bellicon_processing data={data}/>

            <Avatar sx={{ width: 32, height: 32 }} />
            <div className="nav-item dropdown">
              <button
                className="nav-link d-flex lh-1 text-reset p-0"
                data-bs-toggle="dropdown"
                aria-label="Open user menu"
              >

                <div className="d-xl-block ps-2">
                  <div style={{textTransform:"capitalize"}}>{processingName ? processingName : "Username"}</div>
                  <div style={{ textAlign: "left" }} className="mt-1 small text-muted">
                    {designation ? designation : "Processing-team"}
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
            <Processing_notification />
            <div
              style={{ display: "flex", alignItems: "center" }}
              className="item"
            >

            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header_processing;
