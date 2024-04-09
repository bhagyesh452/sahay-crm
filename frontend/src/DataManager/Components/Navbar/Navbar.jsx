import React from "react";
import "../../../dist/css/tabler.min.css?1684106062";
import "../../../dist/css/tabler-flags.min.css?1684106062";
import "../../../dist/css/tabler-payments.min.css?1684106062";
import "../../../dist/css/tabler-vendors.min.css?1684106062";
import "../../../dist/css/demo.min.css?1684106062";
import { Link, useLocation } from "react-router-dom";
import { GrDocumentStore } from "react-icons/gr";
import { BsFillPersonVcardFill } from "react-icons/bs";
import dashboardicon from '../../../dist/img/dashboardicon/dashboardico0n.jpg'


function Navbar() {
  // const active = number;
  const location = useLocation();
  //console.log(name, designation)
  
  const datamanagerUserId = localStorage.getItem("dataManagerUserId")
  
  return (
    <div>
      <header className="navbar-expand-md">
        <div className="collapse navbar-collapse" id="navbar-menu">
          <div className="navbar">
            <div className="container-xl p-0">
              <ul className="navbar-nav">
                <li className="nav-item"
                class = {
                  location.pathname === `/datamanager-dashboard/${datamanagerUserId}` ? "nav-item active" : "nav-item"
                }>
                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                     to={{
                      pathname : `/datamanager-dashboard/${datamanagerUserId}`
                     }}
                   
                  >
                    <a className="nav-link" href="./">
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        <img src={dashboardicon} style={{opacity:"0.5"}}/>
                      </span>
                      <span className="nav-link-title">Dashboard</span>
                    </a>
                  </Link>
                </li>
                <li className="nav-item"
                  class={
                    location.pathname === "/datamanager/manageleads/" ? "nav-item active" : "nav-item"
                  }>
                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to={{
                      pathname: `/datamanager/manageleads/`,
                    }}
                  >
                    <a className="nav-link" href="./">
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        <GrDocumentStore style={{height:"22px" , width:"15px"}} />
                      </span>
                      <span className="nav-link-title">Manage Leads</span>
                    </a>
                  </Link>
                </li>
                <li
                  className={
                    location.pathname.startsWith("/datamanager/employees/")
                      ? "nav-item active"
                      : "nav-item"
                  }>
                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to="/datamanager/employees/"
                  >
                    <a className="nav-link" href="./">
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        <BsFillPersonVcardFill style={{width:"19px" , height:"23px"}} />
                      </span>
                      <span className="nav-link-title active"> Employees </span>
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

export default Navbar;
