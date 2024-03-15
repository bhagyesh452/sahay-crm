import React from "react";
import Papa from "papaparse";
import Header from "./Header";
import Navbar from "./Navbar";
import axios from "axios";
import { IconChevronLeft } from "@tabler/icons-react";
import debounce from "lodash/debounce";
import { IconChevronRight } from "@tabler/icons-react";
import CircularProgress from "@mui/material/CircularProgress";
import UndoIcon from "@mui/icons-material/Undo";
import Box from "@mui/material/Box";
import { IconEye } from "@tabler/icons-react";
import { useRef, useState, useEffect } from "react";
import * as XLSX from "xlsx";
import DatePicker from "react-datepicker";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import "react-datepicker/dist/react-datepicker.css";
import "../assets/styles.css";
import Swal from "sweetalert2";

function RedesignedForm() {
  return (
    <div>
      <Header />
      <Navbar />
       <div className="redesigned-form">
      <div className="card">
        <div className="card-body">
          <div className="basic-details pulse-animation">
            <div className="company-Name">
              <label htmlFor="company-Name">Company Name:</label>
              <input
                type="text"
                name="company-Name"
                id="company-Name"
                className="form-control"
              />
            </div>
            <div className="contact-Number">
              <label htmlFor="contact-Number">Contact Number:</label>
              <input
                type="number"
                name="contact-Number"
                id="contact-Number"
                className="form-control"
              />
            </div>
            <div className="company-Email">
              <label htmlFor="company-Email">Company Email:</label>
              <input
                type="email"
                name="company-Email"
                id="company-Email"
                className="form-control"
              />
            </div>
            <div className="gst-pan">
              <label htmlFor="gst-pan">GST/PAN:</label>
              <input
                type="text"
                name="gst-pan"
                id="gst-pan"
                className="form-control"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default RedesignedForm;
