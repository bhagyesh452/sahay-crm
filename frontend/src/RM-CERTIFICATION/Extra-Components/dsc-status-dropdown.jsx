import React, { useState , useEffect } from "react";
import "../../dist/css/tabler.min.css?1684106062";
import "../../dist/css/tabler-payments.min.css?1684106062";
import "../../dist/css/tabler-vendors.min.css?1684106062";
import "../../dist/css/demo.min.css?1684106062";
import axios from 'axios';


const DscStatusDropdown = ({ companyName , serviceName , mainStatus ,dscStatus}) => {
  const [status, setStatus] = useState(dscStatus);
  const [statusClass, setStatusClass] = useState("created-status");
  const secretKey = process.env.REACT_APP_SECRET_KEY;


  const handleStatusChange = async (newStatus, statusClass) => {
    setStatus(newStatus);
    setStatusClass(statusClass);
    

    try {
      let response;
      if (mainStatus === "Process") {
        
        response = await axios.post(`${secretKey}/rm-services/update-dsc-rmofcertification`, {
          companyName,
          serviceName,
          dscStatus : newStatus
        });
    } else if (mainStatus === "Submitted") {
      response = await axios.post(`${secretKey}/rm-services/update-dsc-rmofcertification`, {
        companyName,
        serviceName,
        dscStatus : newStatus
      });
    } else if (mainStatus === "Defaulter") {
      response = await axios.post(`${secretKey}/rm-services/update-dsc-rmofcertification`, {
        companyName,
        serviceName,
        dscStatus : newStatus
      });
    } else if (mainStatus === "Approved") {
      response = await axios.post(`${secretKey}/rm-services/update-dsc-rmofcertification`, {
        companyName,
        serviceName,
        dscStatus : newStatus
      });
    } 
      

      console.log("Status updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating status:", error.message);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Not Started":
        return "created-status";
      case "KYC Pending":
        return "support-status";
      case "KYC Incomplete":
        return "inprogress-status";
      case "Approved":
        return "finished-status";
      case "Not Applicable":
      case "KYC Rejected":
        return "rejected-status";
      case "KYC Document Pending":
        return "inprogress-status";
      default:
        return "created-status";
    }
  };

  useEffect(() => {
    setStatusClass(getStatusClass(dscStatus));
  }, [dscStatus]);


  return (
    <section className="rm_status_dropdown">
      <div className={`dropdown custom-dropdown status_dropdown ${statusClass}`}>
      <button
        className="btn dropdown-toggle w-100 d-flex align-items-center justify-content-between status__btn"
        type="button"
        id="dropdownMenuButton1"
        data-bs-toggle="dropdown" // Bootstrap data attribute to toggle dropdown
        aria-expanded="false"
      >
        {status}
      </button>
      <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
        <li>
          <a
            className="dropdown-item"
            onClick={() => handleStatusChange("Not Started", "created-status")}
            href="#"
          >
            Not Started
          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            onClick={() => handleStatusChange("KYC Pending", "support-status")}
            href="#"
          >
           KYC Pending
          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            onClick={() => handleStatusChange("KYC Incomplete", "inprogress-status")}
            href="#"
          >
            KYC Incomplete
          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            onClick={() => handleStatusChange("Approved", "finished-status")}
            href="#"
          >
            Approved
          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            onClick={() => handleStatusChange("Not Applicable", "rejected-status")}
            href="#"
          >
            Not Applicable

          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            onClick={() => handleStatusChange("KYC Rejected", "rejected-status")}
            href="#"
          >
            KYC Rejected

          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            onClick={() => handleStatusChange("KYC Document Pending", "inprogress-status")}
            href="#"
          >
            KYC Document Pending

          </a>
        </li>
      </ul>
    </div>
    </section>
  );
};

export default DscStatusDropdown;