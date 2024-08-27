import React, { useState, useEffect } from "react";
import "../../dist/css/tabler.min.css?1684106062";
import "../../dist/css/tabler-payments.min.css?1684106062";
import "../../dist/css/tabler-vendors.min.css?1684106062";
import "../../dist/css/demo.min.css?1684106062";
import axios from 'axios';

const DscValidityDropdown = ({
  companyName,
  serviceName,
  mainStatus,
  subStatus,
  dscValidity,
  refreshData,
}) => {
  // State to manage the selected status and the corresponding CSS class
  const [status, setStatus] = useState(dscValidity);
  const [statusClass, setStatusClass] = useState('created-status');
  const secretKey = process.env.REACT_APP_SECRET_KEY;

  // Function to handle the dropdown item click
  const handleStatusChange = async(newStatus, statusClass) => {
    setStatus(newStatus);
    setStatusClass(`${statusClass}-status`);

    try {
      let response;
      if (mainStatus === "Process") {
        response = await axios.post(`${secretKey}/rm-services/update-dscValidity-adminexecutive`, {
          companyName,
          serviceName,
          dscValidity: newStatus
        });
      } else if (mainStatus === "Defaulter") {
        response = await axios.post(`${secretKey}/rm-services/update-dscValidity-adminexecutive`, {
          companyName,
          serviceName,
          dscValidity: newStatus
        });
      } else if (mainStatus === "Approved") {
        response = await axios.post(`${secretKey}/rm-services/update-dscValidity-adminexecutive`, {
          companyName,
          serviceName,
          dscValidity: newStatus
        });
      }  else if (mainStatus === "Hold") {
        response = await axios.post(`${secretKey}/rm-services/update-dscValidity-adminexecutive`, {
          companyName,
          serviceName,
          dscValidity: newStatus
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
      case "1 Years":
        return "untouched_status";
      case "2 Years":
        return "cdbp-status";
      case "3 Years":
        return "clnt_no_repond_status";
      default:
        return "";
    }
  };

  useEffect(() => {
    setStatusClass(getStatusClass(dscValidity));
  }, [dscValidity]);




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
          {!status ? "Select Validity" : status}
        </button>
        <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
          <li>
            <span className="dropdown-item disabled" style={{ cursor: 'not-allowed' }}>
              Select Validity
            </span>
          </li>
          <li>
            <a className="dropdown-item"
              onClick={() =>
                handleStatusChange('1 Years', 'untouched_status')} href="#"
            >
              1 Years
            </a>
          </li>
          <li>
            <a className="dropdown-item"
              onClick={() =>
                handleStatusChange('2 Years', 'cdbp-status')} href="#">
              2 Years
            </a>
          </li>
          <li>
            <a className="dropdown-item"
              onClick={() =>
                handleStatusChange('3 Years', 'clnt_no_repond_status')} href="#">
               3 Years
            </a>
          </li>
        </ul>
      </div> */}
       <select
                className={(mainStatus === "Approved") ? "disabled sec-indu-select sec-indu-select-white" : `form-select sec-indu-select ${status === "" ? "sec-indu-select-white" : "sec-indu-select-gray"}`}
                //className={`form-select sec-indu-select ${status === "" ? "sec-indu-select-white" : "sec-indu-select-gray"}`}
                aria-labelledby="dropdownMenuButton1"
                onChange={(e) => handleStatusChange(e.target.value)}
                value={!status ? "" : status}
            >
                <option value="" disabled>Select DSC Validity</option>
                <option value="1 Years">1 Year</option>
                <option value="2 Years">2 Year</option>
                <option value="3 Years">3 Year</option>
            </select>
    </section>
  );
};

export default DscValidityDropdown;

