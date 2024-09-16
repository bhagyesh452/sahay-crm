import React, { useState, useEffect } from "react";
import "../../dist/css/tabler.min.css?1684106062";
import "../../dist/css/tabler-payments.min.css?1684106062";
import "../../dist/css/tabler-vendors.min.css?1684106062";
import "../../dist/css/demo.min.css?1684106062";
import axios from 'axios';

const DscTypeDropdown = ({
  companyName,
  serviceName,
  mainStatus,
  subStatus,
  dscType,
  refreshData,
}) => {
  // State to manage the selected status and the corresponding CSS class
  const [status, setStatus] = useState(dscType);
  const [statusClass, setStatusClass] = useState('created-status');
  const secretKey = process.env.REACT_APP_SECRET_KEY;

  // Function to handle the dropdown item click
  const handleStatusChange = async (newStatus, statusClass) => {
    setStatus(newStatus);
    setStatusClass(`${statusClass}-status`);

    try {
      let response;
      if (mainStatus === "Process") {
        response = await axios.post(`${secretKey}/rm-services/update-dscType-adminexecutive`, {
          companyName,
          serviceName,
          dscType: newStatus
        });
      } else if (mainStatus === "Defaulter") {
        response = await axios.post(`${secretKey}/rm-services/update-dscType-adminexecutive`, {
          companyName,
          serviceName,
          dscType: newStatus
        });
      } else if (mainStatus === "Approved") {
        response = await axios.post(`${secretKey}/rm-services/update-dscType-adminexecutive`, {
          companyName,
          serviceName,
          dscType: newStatus
        });
      } else if (mainStatus === "Hold") {
        response = await axios.post(`${secretKey}/rm-services/update-dscType-adminexecutive`, {
          companyName,
          serviceName,
          dscType: newStatus
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
      case "Only Signature":
        return "untouched_status";
      case "Only Encryption":
        return "cdbp-status";
      case "Combo":
        return "clnt_no_repond_status";
      default:
        return "";
    }
  };

  useEffect(() => {
    setStatusClass(getStatusClass(dscType));
  }, [dscType]);




  return (
    <section className="rm_status_dropdown">
      {/* <div className={mainStatus === "Approved" ? "disabled" : `dropdown custom-dropdown status_dropdown ${statusClass}`}>
        <button
          className="btn dropdown-toggle w-100 d-flex align-items-center justify-content-between status__btn"
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {status === "Not Applicable" ? " Select DSC Type" : status}
        </button>
        <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
          <li>
            <span className="dropdown-item disabled" style={{ cursor: 'not-allowed' }}>
              Select DSC Type
            </span>
          </li>
          <li>
            <a className="dropdown-item"
              onClick={() =>
                handleStatusChange('Only Signature', 'untouched_status')} href="#"
            >
              Only Signature
            </a>
          </li>
          <li>
            <a className="dropdown-item"
              onClick={() =>
                handleStatusChange('Only Encryption', 'cdbp-status')} href="#">
              Only Encryption
            </a>
          </li>
          <li>
            <a className="dropdown-item"
              onClick={() =>
                handleStatusChange('Combo', 'clnt_no_repond_status')} href="#">
              Combo
            </a>
          </li>
        </ul>
      </div> */}
      <select
        className={(mainStatus === "Approved" || mainStatus === "Application Submitted") ? "disabled sec-indu-select sec-indu-select-white" : `form-select sec-indu-select ${status === "" ? "sec-indu-select-white" : "sec-indu-select-gray"}`}
        //className={`form-select sec-indu-select ${status === "" ? "sec-indu-select-white" : "sec-indu-select-gray"}`}
        aria-labelledby="dropdownMenuButton1"
        onChange={(e) => handleStatusChange(e.target.value)}
        value={status === "Not Applicable" ? "" : status}
        //disabled={status === "Not Applicable"}
      >
        <option value="" disabled>Select DSC Type</option>
        <option value="Only Signature">Only Signature</option>
        <option value="Only Encryption">Only Encryption</option>
        <option value="Combo">Combo</option>
      </select>
    </section>
  );
};

export default DscTypeDropdown;
