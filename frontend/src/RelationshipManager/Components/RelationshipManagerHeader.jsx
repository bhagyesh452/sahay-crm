import React from "react";
import '../../dist/css/tabler.min.css?1684106062';
import "../../dist/css/tabler-flags.min.css?1684106062";
import "../../dist/css/tabler-payments.min.css?1684106062";
import "../../dist/css/tabler-vendors.min.css?1684106062";
import "../../dist/css/demo.min.css?1684106062";
import Avatar from '@mui/material/Avatar';
import MaleEmployee from "../../static/EmployeeImg/office-man.png";
import FemaleEmployee from "../../static/EmployeeImg/woman.png";
import myImage from '../../static/mainLogo.png';
import RelationshipManagerNotification from "./RelationshipManagerNotification";

function RelationshipManagerHeader({ name, id, designation, empProfile, gender }) {

  const secretKey = process.env.REACT_APP_SECRET_KEY;

  return (
    <div>
      <header className="navbar navbar-expand-md d-print-none">
        <div className="container-xl">

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
            {empProfile ? <Avatar src={`${secretKey}/employee/fetchProfilePhoto/${id}/${encodeURIComponent(empProfile)}`}
              className="My-Avtar" style={{ width: 36, height: 36 }} />
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

            <RelationshipManagerNotification />

            <div style={{ display: "flex", alignItems: "center" }} className="item">
            </div>

          </div>
        </div>
      </header>
    </div>
  );
}

export default RelationshipManagerHeader;