import React, { useState, useEffect } from "react";
import "../../dist/css/tabler.min.css?1684106062";
import "../../dist/css/tabler-payments.min.css?1684106062";
import "../../dist/css/tabler-vendors.min.css?1684106062";
import "../../dist/css/demo.min.css?1684106062";
import axios from 'axios';
import RecruiterDisqualified from "../TabPanels/RecruiterDisqualified";


const RecruiterDepartment = ({ empName, empEmail, mainStatus, department,  refreshData }) => {
  const [status, setStatus] = useState(department);
  const [statusClass, setStatusClass] = useState("untouched_status");
  const secretKey = process.env.REACT_APP_SECRET_KEY;


  const handleStatusChange = async (newStatus, statusClass) => {
    setStatus(newStatus);
    setStatusClass(statusClass);
    try {
      let response;
       if (mainStatus === "Rejected") {
        response = await axios.post(`${secretKey}/recruiter/update-department-recuitment`, {
          empName,
          empEmail,
          department: newStatus
        });
      }
      refreshData();
      //console.log("Status updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating status:", error.message);
    }
  };
  console.log("department" , department)



  return (
    <section className="rm_status_dropdown">
       <select
        className={(mainStatus === "Approved" || mainStatus === "Application Submitted") ? "disabled sec-indu-select sec-indu-select-white" : `form-select sec-indu-select ${status === "" ? "sec-indu-select-white" : "sec-indu-select-gray"}`}
        //className={`form-select sec-indu-select ${status === "" ? "sec-indu-select-white" : "sec-indu-select-gray"}`}
        aria-labelledby="dropdownMenuButton1"
        onChange={(e) => handleStatusChange(e.target.value)}
        value={!status ? "" : status}
      >
        <option value="" disabled>Select Department</option>
        <option value="Sales">Sales</option>
        <option value="Operation">Operation</option>
        <option value="IT">IT</option>
        <option value="HR">HR</option>
        <option value="Startup">Startup</option>
        <option value="Other">Other</option>
      </select>
    </section>
  );
};

export default RecruiterDepartment;