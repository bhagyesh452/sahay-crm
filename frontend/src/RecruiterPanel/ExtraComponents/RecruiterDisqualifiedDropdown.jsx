import React, { useState, useEffect } from "react";
import "../../dist/css/tabler.min.css?1684106062";
import "../../dist/css/tabler-payments.min.css?1684106062";
import "../../dist/css/tabler-vendors.min.css?1684106062";
import "../../dist/css/demo.min.css?1684106062";
import axios from 'axios';
import RecruiterDisqualified from "../TabPanels/RecruiterDisqualified";


const RecruiterDisqualifiedDropdown = ({ empName, empEmail, mainStatus, disqualificationReason,  refreshData }) => {
  const [status, setStatus] = useState(disqualificationReason);
  const [statusClass, setStatusClass] = useState("untouched_status");
  const secretKey = process.env.REACT_APP_SECRET_KEY;


  const handleStatusChange = async (newStatus, statusClass) => {
    setStatus(newStatus);
    setStatusClass(statusClass);
    try {
      let response;
      if (mainStatus === "UnderReview") {
        response = await axios.post(`${secretKey}/recruiter/update-disqualified-recuitment`, {
          empName,
          empEmail,
          disqualificationReason: newStatus
        });
      } else if (mainStatus === "Disqualified") {
        response = await axios.post(`${secretKey}/recruiter/update-disqualified-recuitment`, {
          empName,
          empEmail,
          disqualificationReason: newStatus
        });
      } else if (mainStatus === "Rejected") {
        response = await axios.post(`${secretKey}/recruiter/update-disqualified-recuitment`, {
          empName,
          empEmail,
          disqualificationReason: newStatus
        });
      } else if (mainStatus === "Selected") {
        response = await axios.post(`${secretKey}/recruiter/update-disqualified-recuitment`, {
          empName,
          empEmail,
          disqualificationReason: newStatus
        });
      } else if (mainStatus === "On Hold") {
        response = await axios.post(`${secretKey}/recruiter/update-disqualified-recuitment`, {
          empName,
          empEmail,
          disqualificationReason: newStatus
        });
      }

      refreshData();
      //console.log("Status updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating status:", error.message);
    }
  };

  

  const getStatusClass = (status) => {
    switch (status) {
      case "Not Applicable":
        return "untouched_status";
      case "Didn't Appear":
        return "need_to_call";
      case "Pending":
        return "inprogress-status";
        case "Alloted":
          return "inprogress-status";
      case "Completed":
        return "approved-status";
      case "In Approval":
        return "created-status";
      case "Approved":
        return "approved-status";
      case "Not Applicable":
        return "e_task_assign";
      default:
        return "";
    }
  };

//   useEffect(() => {
//     if (writername === "Not Applicable") {
//       setStatus("Not Applicable");
//     } else {
//       setStatus(contentStatus);
//     }
//   }, [contentStatus, writername]);

  useEffect(() => {
    setStatusClass(getStatusClass(disqualificationReason));
  }, [disqualificationReason]);

 


  return (
    <section className="rm_status_dropdown">
       <select
        className={(mainStatus === "Approved" || mainStatus === "Application Submitted") ? "disabled sec-indu-select sec-indu-select-white" : `form-select sec-indu-select ${status === "" ? "sec-indu-select-white" : "sec-indu-select-gray"}`}
        //className={`form-select sec-indu-select ${status === "" ? "sec-indu-select-white" : "sec-indu-select-gray"}`}
        aria-labelledby="dropdownMenuButton1"
        onChange={(e) => handleStatusChange(e.target.value)}
        value={disqualificationReason}
      >
        <option value="" disabled>Select Disqualification Reason</option>
        <option value="Poor Communication">Poor Communication</option>
        <option value="Insufficient Experience ">Insufficient Experience </option>
        <option value="Background Check Issues( Caste/Competitors)">Background Check Issues( Caste/Competitors)</option>
        <option value="High Salary Expectations">High Salary Expectations</option>
        <option value="Out Of Age Criteria">Out Of Age Criteria</option>
        <option value="Lack Of Required Skills">Lack Of Required Skills</option>
        <option value="Qualification Shortfall">Qualification Shortfall</option>
        <option value="Application Criteria Not Met">Application Criteria Not Met</option>
      </select>
    </section>
  );
};

export default RecruiterDisqualifiedDropdown;