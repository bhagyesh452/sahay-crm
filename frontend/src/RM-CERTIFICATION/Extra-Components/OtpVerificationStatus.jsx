import React, { useState, useEffect } from "react";
import "../../dist/css/tabler.min.css?1684106062";
import "../../dist/css/tabler-payments.min.css?1684106062";
import "../../dist/css/tabler-vendors.min.css?1684106062";
import "../../dist/css/demo.min.css?1684106062";
import axios from 'axios';

const OtpVerificationStatus = ({
  companyName,
  serviceName,
  mainStatus,
  subStatus,
  otpVerificationStatus,
  refreshData,
}) => {
  // State to manage the selected status and the corresponding CSS class
  const [status, setStatus] = useState(otpVerificationStatus);
  const [statusClass, setStatusClass] = useState('created-status');
  const secretKey = process.env.REACT_APP_SECRET_KEY;

  // Function to handle the dropdown item click
  const handleStatusChange = async (newStatus, statusClass) => {
    setStatus(newStatus);
    setStatusClass(`${statusClass}-status`);

    try {
      let response;
      if (mainStatus === "Process") {
        response = await axios.post(`${secretKey}/rm-services/update-otpstatus-rmcert`, {
          companyName,
          serviceName,
          otpVerificationStatus: newStatus
        });
      } else if (mainStatus === "Defaulter") {
        response = await axios.post(`${secretKey}/rm-services/update-otpstatus-rmcert`, {
          companyName,
          serviceName,
          otpVerificationStatus: newStatus
        });
      } else if (mainStatus === "Approved") {
        response = await axios.post(`${secretKey}/rm-services/update-otpstatus-rmcert`, {
          companyName,
          serviceName,
          otpVerificationStatus: newStatus
        });
      } else if (mainStatus === "Hold") {
        response = await axios.post(`${secretKey}/rm-services/update-otpstatus-rmcert`, {
          companyName,
          serviceName,
          otpVerificationStatus: newStatus
        });
        //console.log("statuschange", contentStatus, companyName, serviceName)
      }

      refreshData();
      console.log("Status updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating status:", error.message);
    }
  };




  return (
    <section className="rm_status_dropdown">
      <select
        className={(mainStatus === "Approved") ? "disabled sec-indu-select sec-indu-select-white" : `form-select sec-indu-select ${status === "" ? "sec-indu-select-white" : "sec-indu-select-gray"}`}
        //className={`form-select sec-indu-select ${status === "" ? "sec-indu-select-white" : "sec-indu-select-gray"}`}
        aria-labelledby="dropdownMenuButton1"
        onChange={(e) => handleStatusChange(e.target.value)}
        value={!status ? "" : status}
      >
        {/* <option value="" disabled>Select Status</option> */}
        <option value="Both Pending" selected>Both Pending </option>
        <option value="Both Done">Both Done</option>
        <option value="DSC Link Done, OTP Pending">DSC Link Done, OTP Pending</option>
        <option value="OTP Done, DSC Link Pending">OTP Done, DSC Link Pending</option>
        <option value="Not Applicable">Not Applicable</option>
      </select>
    </section>
  );
};

export default OtpVerificationStatus;

