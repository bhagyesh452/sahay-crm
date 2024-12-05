import React, { useState, useEffect } from "react";
import "../../dist/css/tabler.min.css?1684106062";
import "../../dist/css/tabler-payments.min.css?1684106062";
import "../../dist/css/tabler-vendors.min.css?1684106062";
import "../../dist/css/demo.min.css?1684106062";
import axios from 'axios';


const RecruiterInterviewStatus = ({ 
  empName, 
  empEmail, 
  mainStatus, 
  interViewStatus,  
  refreshData 
}) => {
  const [status, setStatus] = useState(interViewStatus);
  const [statusClass, setStatusClass] = useState("untouched_status");
  const secretKey = process.env.REACT_APP_SECRET_KEY;


  const handleStatusChange = async (newStatus, statusClass) => {
    setStatus(newStatus);
    setStatusClass(statusClass);
    try {
      let response;
      if (mainStatus === "UnderReview") {
        response = await axios.post(`${secretKey}/recruiter/update-interview-recuitment`, {
          empName,
          empEmail,
          interViewStatus: newStatus
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
    setStatusClass(getStatusClass(interViewStatus));
  }, [interViewStatus]);

 //console.log("interViewStatus", interViewStatus)


  return (
    <section className="rm_status_dropdown">
       <select
        className={(mainStatus === "Disqualified" || mainStatus === "Selected" || mainStatus === "Rejected" || mainStatus === "On Hold") ? "disabled sec-indu-select sec-indu-select-white" : `form-select sec-indu-select ${status === "" ? "sec-indu-select-white" : "sec-indu-select-gray"}`}
        //className={`form-select sec-indu-select ${status === "" ? "sec-indu-select-white" : "sec-indu-select-gray"}`}
        aria-labelledby="dropdownMenuButton1"
        onChange={(e) => handleStatusChange(e.target.value)}
        value={interViewStatus === "" ? "Not Applicable" :interViewStatus}
      >
        <option value="" disabled>Select Interview Status</option>
        <option value="Not Applicable">Not Applicable</option>
        <option value="Didn't Appear">Didn't Appear</option>
        <option value="Canceled">Canceled</option>
        <option value="Taken By Palak">Taken By Palak</option>
        <option value="Taken By Hiral">Taken By Hiral</option>
        <option value="Taken By Vaibhav">Taken By Vaibhav</option>
        <option value="Taken By Mr. Saurav">Taken By Mr. Saurav</option>
        <option value="Taken By Mr. Rahul">Taken By Mr. Rahul</option>
        <option value="Taken By Mr. Nimesh">Taken By Mr. Nimesh</option>
        <option value="Taken By Palak & Mr. Nimesh">Taken By Palak & Mr. Nimesh</option>
        <option value="Taken By Palak & Mr. Rahul">Taken By Palak & Mr. Rahul</option>
        <option value="Taken By Palak & Mr. Vaibhav">Taken By Palak & Mr. Vaibhav</option>
      </select>
    </section>
  );
};

export default RecruiterInterviewStatus;