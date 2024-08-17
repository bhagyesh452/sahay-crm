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
  const handleStatusChange = async(newStatus, statusClass) => {
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
      }  else if (mainStatus === "Hold") {
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
      <div className={mainStatus === "Approved" ? "disabled" : `dropdown custom-dropdown status_dropdown ${statusClass}`}>
        <button
          className="btn dropdown-toggle w-100 d-flex align-items-center justify-content-between status__btn"
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {!status ? "Select Portal" : status}
        </button>
        <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
          <li>
            <span className="dropdown-item disabled" style={{ cursor: 'not-allowed' }}>
              Select Portal
            </span>
          </li>
          <li>
            <a className="dropdown-item"
              onClick={() =>
                handleStatusChange('PANTASIGN', 'untouched_status')} href="#"
            >
              PANTASIGN
            </a>
          </li>
          <li>
            <a className="dropdown-item"
              onClick={() =>
                handleStatusChange('CARE4SIGN', 'cdbp-status')} href="#">
              CARE4SIGN
            </a>
          </li>
          <li>
            <a className="dropdown-item"
              onClick={() =>
                handleStatusChange('CAPRICORN', 'clnt_no_repond_status')} href="#">
              CAPRICORN
            </a>
          </li>
          <li>
            <a className="dropdown-item"
              onClick={() =>
                handleStatusChange('EXTRATRUST', 'support-status')} href="#">
              EXTRATRUST
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default DscPortalDropdown;

