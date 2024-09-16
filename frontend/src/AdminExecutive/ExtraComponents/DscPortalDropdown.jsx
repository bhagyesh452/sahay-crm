import React, { useState, useEffect } from "react";
import "../../dist/css/tabler.min.css?1684106062";
import "../../dist/css/tabler-payments.min.css?1684106062";
import "../../dist/css/tabler-vendors.min.css?1684106062";
import "../../dist/css/demo.min.css?1684106062";
import axios from 'axios';

const DscPortalDropdown = ({
  companyName,
  serviceName,
  mainStatus,
  subStatus,
  dscPortal,
  refreshData,
}) => {
  // State to manage the selected status and the corresponding CSS class
  const [status, setStatus] = useState(dscPortal);
  const [statusClass, setStatusClass] = useState('created-status');
  const secretKey = process.env.REACT_APP_SECRET_KEY;

  // Function to handle the dropdown item click
  const handleStatusChange = async (newStatus, statusClass) => {
    setStatus(newStatus);
    setStatusClass(`${statusClass}-status`);

    try {
      let response;
      if (mainStatus === "Process") {
        response = await axios.post(`${secretKey}/rm-services/update-dscportal-adminexecutive`, {
          companyName,
          serviceName,
          dscPortal: newStatus
        });
      } else if (mainStatus === "Defaulter") {
        response = await axios.post(`${secretKey}/rm-services/update-dscportal-adminexecutive`, {
          companyName,
          serviceName,
          dscPortal: newStatus
        });
      } else if (mainStatus === "Approved") {
        response = await axios.post(`${secretKey}/rm-services/update-dscportal-adminexecutive`, {
          companyName,
          serviceName,
          dscPortal: newStatus
        });
      } else if (mainStatus === "Hold") {
        response = await axios.post(`${secretKey}/rm-services/update-dscportal-adminexecutive`, {
          companyName,
          serviceName,
          dscPortal: newStatus
        });
        //console.log("statuschange", contentStatus, companyName, serviceName)
      }

      refreshData();
      console.log("Status updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating status:", error.message);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PANTASIGN":
        return "untouched_status";
      case "CARE4SIGN":
        return "cdbp-status";
      case "CAPRICORN":
        return "clnt_no_repond_status";
      case "EXTRATRUST":
        return "support-status";
      default:
        return "";
    }
  };

  useEffect(() => {
    setStatusClass(getStatusClass(dscPortal));
  }, [dscPortal]);




  return (
    <section className="rm_status_dropdown">
      <select
        className={(mainStatus === "Approved" || mainStatus === "Application Submitted") ? "disabled sec-indu-select sec-indu-select-white" : `form-select sec-indu-select ${status === "" ? "sec-indu-select-white" : "sec-indu-select-gray"}`}
        //className={`form-select sec-indu-select ${status === "" ? "sec-indu-select-white" : "sec-indu-select-gray"}`}
        aria-labelledby="dropdownMenuButton1"
        onChange={(e) => handleStatusChange(e.target.value)}
        value={!status ? "" : status}
      >
        <option value="" disabled>Select Portal</option>
        <option value="PANTASIGN">PANTASIGN</option>
        <option value="CARE4SIGN">CARE4SIGN</option>
        <option value="CAPRICORN">CAPRICORN</option>
        <option value="EXTRATRUST">EXTRATRUST</option>
        <option value="Vsign">Vsign</option>
      </select>
    </section>
  );
};

export default DscPortalDropdown;

