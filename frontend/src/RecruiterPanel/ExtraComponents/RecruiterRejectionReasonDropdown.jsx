import React, { useState, useEffect } from "react";
import "../../dist/css/tabler.min.css?1684106062";
import "../../dist/css/tabler-payments.min.css?1684106062";
import "../../dist/css/tabler-vendors.min.css?1684106062";
import "../../dist/css/demo.min.css?1684106062";
import axios from 'axios';
import RecruiterDisqualified from "../TabPanels/RecruiterDisqualified";


const RecruiterRejectionReasonDropdown = ({ empName, empEmail, mainStatus, rejectionReason,  refreshData }) => {
  const [status, setStatus] = useState(rejectionReason);
  const [statusClass, setStatusClass] = useState("untouched_status");
  const secretKey = process.env.REACT_APP_SECRET_KEY;


  const handleStatusChange = async (newStatus, statusClass) => {
    setStatus(newStatus);
    setStatusClass(statusClass);
    try {
      let response;
       if (mainStatus === "Rejected") {
        response = await axios.post(`${secretKey}/recruiter/update-rejection-recuitment`, {
          empName,
          empEmail,
          rejectionReason: newStatus
        });
      }
      refreshData();
      //console.log("Status updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating status:", error.message);
    }
  };
  console.log("rejectionreason" , rejectionReason)



  return (
    <section className="rm_status_dropdown">
       <select
        className={(mainStatus === "Approved" || mainStatus === "Application Submitted") ? "disabled sec-indu-select sec-indu-select-white" : `form-select sec-indu-select ${status === "" ? "sec-indu-select-white" : "sec-indu-select-gray"}`}
        //className={`form-select sec-indu-select ${status === "" ? "sec-indu-select-white" : "sec-indu-select-gray"}`}
        aria-labelledby="dropdownMenuButton1"
        onChange={(e) => handleStatusChange(e.target.value)}
        value={!status ? "" : status}
      >
        <option value="" disabled>Select Rejection Reason</option>
        <option value="Interview Performance Issues">Interview Performance Issues</option>
        <option value="Poor Communication">Poor Communication</option>
        <option value="Inconsistent Employment History">Inconsistent Employment History</option>
        <option value="High Salary Expectations">High Salary Expectations</option>
        <option value="Out Of Age Criteria">Out Of Age Criteria</option>
        <option value="Lack Of Necessary Skills">Lack Of Necessary Skills</option>
        <option value="Background Check Issues( Caste/Competitors)">Background Check Issues( Caste/Competitors)</option>
      </select>
    </section>
  );
};

export default RecruiterRejectionReasonDropdown;