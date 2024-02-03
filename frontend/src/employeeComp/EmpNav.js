import React from 'react';
import "../dist/css/tabler.min.css?1684106062";
import "../dist/css/tabler-flags.min.css?1684106062";
import "../dist/css/tabler-payments.min.css?1684106062";
import "../dist/css/tabler-vendors.min.css?1684106062";
import "../dist/css/demo.min.css?1684106062";
import { Link, useLocation, useParams } from "react-router-dom";

function EmpNav({userId}) {
    const location = useLocation();

    const frontendkey = process.env.REACT_APP_FRONTEND_KEY;
    const handleConvertedLeadsClick = () => {
      // Navigate to the /employee-data/:userId/converted-leads route
      window.location.replace(`/converted-leads/${userId}`);
    };
    const handleConvertedLeadsClicksame = () => {
      // Navigate to the /employee-data/:userId/converted-leads route
      window.location.replace(`/employee-data/${userId}`);
    };
    
  return (
    <div>
      <header className="navbar-expand-md">
        <div className="collapse navbar-collapse" id="navbar-menu">
          <div className="navbar">
            <div className="container-xl">
              <ul className="navbar-nav">
                <li onClick={handleConvertedLeadsClicksame}
                 className={
                  location.pathname === `/employee-data/${userId}` ? "nav-item active" : "nav-item"
                }
                >
                  {/* <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to={"/employee-data/"}
                  > */}
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
                      <span className="nav-link-title">Leads</span>
                    </a>
                  {/* </Link> */}
                </li>
                
                
                <li  className={
                  location.pathname === `/converted-leads/${userId}` ? "nav-item active" : "nav-item"
                } onClick={handleConvertedLeadsClick}
                  
                >
                  
                    <a  className="nav-link" href="#">
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
                      <span className="nav-link-title">Converted Leads</span>
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

export default EmpNav