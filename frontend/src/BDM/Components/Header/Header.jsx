import React, { useState, useEffect } from "react";
import '../../../dist/css/tabler.min.css?1684106062';
import "../../../dist/css/tabler-flags.min.css?1684106062";
import "../../../dist/css/tabler-payments.min.css?1684106062";
import "../../../dist/css/tabler-vendors.min.css?1684106062";
import "../../../dist/css/demo.min.css?1684106062";
import myImage from '../../../static/mainLogo.png';
import Avatar from '@mui/material/Avatar';
import Notification from "../../Components/Notification/Notification.jsx";
import MaleEmployee from "../../../static/EmployeeImg/office-man.png";
import FemaleEmployee from "../../../static/EmployeeImg/woman.png";

function Header({ name, id, designation, empProfile, gender }) {
  const secretKey = process.env.React_APP_SECRET_KEY;
 
  console.log("Employee name is :", name);
  console.log("Employee id is :", id);
  console.log("Employee gender is :", gender);
  console.log("Designation is :", designation);
  console.log("Employee profile :", empProfile);

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
            {/* <Bellicon data={requestData} gdata = {requestGData} adata={mapArray}/> */}
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
                aria-label="Open user menu">
                <div className="d-xl-block ps-2">
                  <div style={{ textTransform: "capitalize", textAlign: "left" }}>{name ? name : "Name"}</div>
                  <div style={{ textAlign: "left" }} className="mt-1 small text-muted">
                    {designation}
                  </div>
                </div>
                {/* <AiOutlineLogout style={{ width: "25px", height: "25px", marginLeft: "5px" }} onClick={() => handleLogout()} /> */}
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
            <Notification />
            <div
              style={{ display: "flex", alignItems: "center" }}
              className="item">
            </div>
          </div>
        </div>
      </header>
    </div>
  )




}

export default Header;