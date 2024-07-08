import React from 'react';
import "../../dist/css/tabler.min.css?1684106062";
import "../../dist/css/tabler-flags.min.css?1684106062";
import "../../dist/css/tabler-payments.min.css?1684106062";
import "../../dist/css/tabler-vendors.min.css?1684106062";
import "../../dist/css/demo.min.css?1684106062";
import { Link, useLocation, useParams } from "react-router-dom";
import BarChartIcon from '@mui/icons-material/BarChart';
import { BiBookContent } from "react-icons/bi";
import { AiOutlineTeam } from "react-icons/ai";
import { LiaDigitalTachographSolid } from "react-icons/lia";
import { VscGraph } from "react-icons/vsc";
import { GrDocumentStore } from "react-icons/gr";
import { FaList } from "react-icons/fa6";
import { FaTableCellsLarge } from "react-icons/fa6";

function RmCertificationNavbar({ rmCertificationUserId }) {
  const location = useLocation();

  //console.log("bdmWORKON NAV", bdmWork)

  const frontendkey = process.env.REACT_APP_FRONTEND_KEY;
  // const handleConvertedLeadsClick = () => {
  //   // Navigate to the /employee-data/:userId/converted-leads route
  //   window.location.replace(`/employee-team-leads/${userId}`);
  // };
  const handleDashboardClick = () => {
    window.location.replace(`/rmofcertification/dashboard-rmofcertification/${rmCertificationUserId}`)
  }
  // const handleConvertedLeadsClicksame = () => {
  //   // Navigate to the /employee-data/:userId/converted-leads route
  //   window.location.replace(`/employee-data/${userId}`);
  // };

  const handleClickBookings = () => {
    window.location.replace(`/rmofcertification/rmofcertification-bookings/${rmCertificationUserId}`)
  }

  const handleClickMyBookings = () => {
    window.location.replace(`/rmofcertification/rmofcertification-mybookings/${rmCertificationUserId}`)
  }

  return (
    <div>
      <header className="navbar-expand-md">
        <div className="collapse navbar-collapse" id="navbar-menu">
          <div className="navbar">
            <div className="container-xl">
              <ul className="navbar-nav">
                <li className={
                  location.pathname === `/rmofcertification/dashboard-rmofcertification/${rmCertificationUserId}` ? "nav-item active" : "nav-item"
                }
                  onClick={handleDashboardClick}>

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
                </li>
                <Link style={{ textDecoration: "none", color: "black" }}
                    to= {`/rmofcertification/received-booking-box/${rmCertificationUserId}`}>
                      <a className="nav-link" href="./">
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
                      <span className="nav-link-title">Bookings</span>
                    </a>
                </Link>
                {/* <li
                  className={
                    location.pathname === `/rmofcertification/rmofcertification-bookings/${rmCertificationUserId}` ? "nav-item active" : "nav-item"
                  }
                  onClick={handleClickBookings}
                >

                  <a className="nav-link" href="#">
                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                      <BiBookContent style={{ height: "24px", width: "19px" }} />
                    </span>
                    <span className="nav-link-title">Bookings</span>
                  </a>

                </li> */}
                <li
                  className={
                    location.pathname === `/rmofcertification/rmofcertification-mybookings/${rmCertificationUserId}` ? "nav-item active" : "nav-item"
                  }
                  onClick={handleClickMyBookings}
                >

                  <a className="nav-link" href="#">
                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                      <BiBookContent style={{ height: "24px", width: "19px" }} />
                    </span>
                    <span className="nav-link-title">My Bookings</span>
                  </a>

                </li>
              </ul>

            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

export default RmCertificationNavbar