import React, { useState , useEffect} from "react";
import "../../dist/css/tabler.min.css?1684106062";
import "../../dist/css/tabler-payments.min.css?1684106062";
import "../../dist/css/tabler-vendors.min.css?1684106062";
import "../../dist/css/demo.min.css?1684106062";
import axios from 'axios';


const ContentStatusDropdown = ({ companyName , serviceName , mainStatus ,contentStatus}) => {
  const [status, setStatus] = useState(contentStatus);
  const [statusClass, setStatusClass] = useState("created-status");
  const secretKey = process.env.REACT_APP_SECRET_KEY;


  const handleStatusChange = async (newStatus, statusClass) => {
    setStatus(newStatus);
    setStatusClass(statusClass);
    

    try {
      let response;
      if (mainStatus === "Process") {
        response = await axios.post(`${secretKey}/rm-services/update-content-rmofcertification`, {
          companyName,
          serviceName,
          contentStatus : newStatus
        });
    } else if (mainStatus === "Submitted") {
      response = await axios.post(`${secretKey}/rm-services/update-content-rmofcertification`, {
        companyName,
        serviceName,
        contentStatus : newStatus
      });
    } else if (mainStatus === "Defaulter") {
      response = await axios.post(`${secretKey}/rm-services/update-content-rmofcertification`, {
        companyName,
        serviceName,
        contentStatus : newStatus
      });
    } else if (mainStatus === "Approved") {
      response = await axios.post(`${secretKey}/rm-services/update-content-rmofcertification`, {
        companyName,
        serviceName,
        contentStatus : newStatus
      });
    } else if (mainStatus === "Hold") {
      response = await axios.post(`${secretKey}/rm-services/update-content-rmofcertification`, {
        companyName,
        serviceName,
        contentStatus : newStatus
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
      case "Working":
        return "rejected-status";
      case "Pending":
        return "inprogress-status";
      case "Completed":
        return "finished-status";
      case "InApproved":
        return "rejected-status";
      case "Approved":
        return "support-status";
      default:
        return "created-status";
    }
  };

  useEffect(() => {
    setStatusClass(getStatusClass(contentStatus));
  }, [contentStatus]);


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
            onClick={() => handleStatusChange("Working", "rejected-status")}
            href="#"
          >
           Working
          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            onClick={() => handleStatusChange("Pending", "inprogress-status")}
            href="#"
          >
            Pending
          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            onClick={() => handleStatusChange("Completed", "finished-status")}
            href="#"
          >
            Completed
          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            onClick={() => handleStatusChange("In Approval", "rejected-status")}
            href="#"
          >
            In Approval

          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            onClick={() => handleStatusChange("Approved", "support-status")}
            href="#"
          >
            Approved

          </a>
        </li>
      </ul>
    </div>
    </section>
  );
};

export default ContentStatusDropdown;