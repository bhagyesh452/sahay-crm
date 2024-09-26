import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Select from "react-select";
import img from "../../static/logo.jpg";
import "../../assets/styles.css";
import axios from "axios";
// import { options } from "../components/Options";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";



function ApplicationForm() {
  return (
    <div className="basic-information-main">
         <div className="basic-info-page-header">
        <div className="container-xl d-flex align-items-center justify-content-between">
          <div className="basic-info-logo">
            <img src={img} alt="image" />
          </div>
          <div className="go-web-btn">
            <button className="btn btn-md btn-primary">
              <a
                href="https://www.startupsahay.com"
                rel="noopener noreferrer"
              >
                Go To Website
              </a>
            </button>
          </div>
        </div>
      </div>
      
    
    </div>
  )
}

export default ApplicationForm