
import React from "react";
import "../dist/css/tabler.min.css?1684106062";
import "../dist/css/tabler-flags.min.css?1684106062";
import "../dist/css/tabler-payments.min.css?1684106062";
import "../dist/css/tabler-vendors.min.css?1684106062";
import "../dist/css/demo.min.css?1684106062";
import { Link, useLocation } from "react-router-dom";
import analysislogo from '../dist/img/Analysis/analysis-logo.png'


function Navbar_processing() {
  // const active = number;
  const location = useLocation();
  return (
    <div>
      <header className="navbar-expand-md">
        <div className="collapse navbar-collapse" id="navbar-menu">
          <div className="navbar">
            <div className="container-xl">
              <ul className="navbar-nav">
                <li
                  className={
                    location.pathname === "/Processing/Dashboard_processing"
                      ? "nav-item active"
                      : "nav-item"
                  }
                >
                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to="/Processing/Dashboard_processing"
                  >
                    <a className="nav-link" href="./">
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        {/* <!-- Download SVG icon from http://tabler-icons.io/i/home --> */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-bar-graph" viewBox="0 0 16 16">
                          <path d="M10 13.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-6a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zm-2.5.5a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5zm-3 0a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5z" />
                          <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                        </svg>
                      </span>
                      <span className="nav-link-title">Bookings</span>
                    </a>
                  </Link>
                </li>
                <li
                  className={
                    location.pathname === "/Processing/Dashboard_processing"
                      ? "nav-item active"
                      : "nav-item"
                  }
                >
                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to="/Processing/analysis_dashboard"
                  >
                    <a className="nav-link" href="./">
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        {/* <!-- Download SVG icon from http://tabler-icons.io/i/home --> */}
                        {/* <svg
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
                        </svg> */}
                        <img src={analysislogo} alt="Logo" />
                      </span>
                      <span className="nav-link-title">Dashboard</span>
                    </a>
                  </Link>
                </li>
              </ul>

            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Navbar_processing;

