import React, { useState, useEffect } from "react";
import "../../dist/css/tabler.min.css?1684106062";
import "../../dist/css/tabler-payments.min.css?1684106062";
import "../../dist/css/tabler-vendors.min.css?1684106062";
import "../../dist/css/demo.min.css?1684106062";
import axios from 'axios';



const RecruiterEmployementStatus = ({ empName, empEmail, mainStatus, employementStatus,  refreshData }) => {
  const [status, setStatus] = useState(employementStatus);
  const [statusClass, setStatusClass] = useState("untouched_status");
  const secretKey = process.env.REACT_APP_SECRET_KEY;


  const handleStatusChange = async (newStatus, statusClass) => {
    setStatus(newStatus);
    setStatusClass(statusClass);
  
    try {
      let response;
       if (mainStatus === "Selected") {
        response = await axios.post(`${secretKey}/recruiter/update-employementStatus-recuitment`, {
          empName,
          empEmail,
          employementStatus: newStatus
        });
      }
      
      refreshData();
      //console.log("Status updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating status:", error.message);
    }
  };
  



  return (
    <section className="rm_status_dropdown">
       <select
        className={(mainStatus === "Approved" || mainStatus === "Application Submitted") ? "disabled sec-indu-select sec-indu-select-white" : `form-select sec-indu-select ${status === "" ? "sec-indu-select-white" : "sec-indu-select-gray"}`}
        //className={`form-select sec-indu-select ${status === "" ? "sec-indu-select-white" : "sec-indu-select-gray"}`}
        aria-labelledby="dropdownMenuButton1"
        onChange={(e) => handleStatusChange(e.target.value)}
        value={!status ? "" : status}
      >
        <option value="" disabled>Select Employement Status</option>
        <option value="Quit">Quit</option>
        <option value="Active">Active</option>
        <option value="Terminated">Terminated</option>
        <option value="On Notice Period">On Notice Period</option>
        <option value="Didn't Joined">Didn't Joined</option>
      </select>
    </section>
  );
};

export default RecruiterEmployementStatus;