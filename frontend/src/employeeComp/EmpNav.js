import React, { useEffect, useState } from 'react';
import "../dist/css/tabler.min.css?1684106062";
import "../dist/css/tabler-flags.min.css?1684106062";
import "../dist/css/tabler-payments.min.css?1684106062";
import "../dist/css/tabler-vendors.min.css?1684106062";
import "../dist/css/demo.min.css?1684106062";
import { Link, useLocation, useParams } from "react-router-dom";
import BarChartIcon from '@mui/icons-material/BarChart';
import { BiBookContent } from "react-icons/bi";
import { AiOutlineTeam } from "react-icons/ai";
import { LiaDigitalTachographSolid } from "react-icons/lia";
import { VscGraph } from "react-icons/vsc";
import { GrDocumentStore } from "react-icons/gr";
import axios from 'axios';







function EmpNav({ userId, bdmWork }) {
  const location = useLocation();

  //console.log("bdmWORKON NAV", bdmWork)

  const frontendkey = process.env.REACT_APP_FRONTEND_KEY;
  const handleConvertedLeadsClick = () => {
    // Navigate to the /employee-data/:userId/converted-leads route
    window.location.replace(`/employee-team-leads/${userId}`);
  };
  const handleDashboardClick = () => {
    window.location.replace(`/employee-dashboard/${userId}`)
  }
  const handleConvertedLeadsClicksame = () => {
    // Navigate to the /employee-data/:userId/converted-leads route
    window.location.replace(`/employee-data/${userId}`);
  };

  const handleClickMyBookings = () => {
    window.location.replace(`/employee-bookings/${userId}`)
  }

  const handleClickReports = () => {
    window.location.replace(`/employee-reports/${userId}`)
  }

  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get(`${secretKey}/employee/einfo`);


  //     // Set the retrieved data in the state
  //     const tempData = response.data;
  //     const userData = tempData.find((item) => item._id === userId);
  //     setData(userData);
  //   } catch (error) {
  //     console.error("Error fetching data:", error.message);
  //   }
  // };
  // const secretKey = process.env.REACT_APP_SECRET_KEY;

  // useEffect(() => {
  //   if (userId) {
  //     fetchData()
  //   }
  // }, [userId])

  


  return (
    <div>
      <header className="navbar-expand-md">
        <div className="collapse navbar-collapse" id="navbar-menu">
          <div className="navbar">
            <div className="container-xl">
              <ul className="navbar-nav">
                <Link style={{ textDecoration: "none", color: "black" }} className={
                  location.pathname === `/employee-dashboard/${userId}` ? "nav-item active" : "nav-item"
                } to={`/employee-dashboard/${userId}`}>

                  <a className="nav-link" href="#">
                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                      {/* <!-- Download SVG icon from http://tabler-icons.io/i/home --> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
                        <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                        <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                      </svg>
                    </span>
                    <span className="nav-link-title">Dashboard</span>
                  </a>
                </Link>
                <Link to={`/employee-data/${userId}`}
                  className={
                    location.pathname === `/employee-data/${userId}` ? "nav-item active" : "nav-item"
                  }
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <a className="nav-link" href="#">
                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                      <GrDocumentStore style={{ height: "22px", width: "15px" }} />
                    </span>
                    <span className="nav-link-title">My Leads</span>
                  </a>
                  {/* </Link> */}
                </Link>


                {bdmWork && (
                  <Link style={{ textDecoration: "none", color: "black" }} className={
                    location.pathname === `/employee-team-leads/${userId}` ? "nav-item active" : "nav-item"
                  }
                    to={`/employee-team-leads/${userId}`}>

                    <a className="nav-link" href="#">
                      <span className="nav-link-icon d-md-none d-lg-inline-block">

                        <AiOutlineTeam style={{ height: "24px", width: "19px", marginRight: "5px" }} />
                      </span>
                      <span className="nav-link-title">Team Leads</span>
                    </a>

                  </Link>
                )}
                <Link style={{ textDecoration: "none", color: "black" }}
                  className={
                    location.pathname === `/employee-bookings/${userId}` ? "nav-item active" : "nav-item"
                  }
                  to={`/employee-bookings/${userId}`}
                >

                  <a className="nav-link" href="./">
                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                      <BiBookContent style={{ height: "24px", width: "19px" }} />
                    </span>
                    <span className="nav-link-title">My Bookings</span>
                  </a>

                </Link>
                <Link style={{ textDecoration: "none", color: "black" }}
                  className={
                    location.pathname === `/employee-reports/${userId}` ? "nav-item active" : "nav-item"
                  }
                  to={`/employee-reports/${userId}`}
                >
                  <a className="nav-link" href="#">
                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                      <VscGraph style={{ height: "24px", width: "19px" }} />
                    </span>
                    <span className="nav-link-title">Reports</span>
                  </a>

                </Link>
                {/* <Link style={{ textDecoration: "none", color: "black" }}
                  className={
                    location.pathname === `/employee-assets/${userId}` ? "nav-item active" : "nav-item"
                  }
                  to={`/employee-assets/${userId}`}
                >
                  <a className="nav-link" href="#">
                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                      <VscGraph style={{ height: "24px", width: "19px" }} />
                    </span>
                    <span className="nav-link-title">Assets</span>
                  </a>

                </Link> */}
              </ul>

            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

export default EmpNav