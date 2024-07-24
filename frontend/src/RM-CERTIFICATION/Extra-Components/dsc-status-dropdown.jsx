import React, { useState } from "react";
import "../../dist/css/tabler.min.css?1684106062";
import "../../dist/css/tabler-payments.min.css?1684106062";
import "../../dist/css/tabler-vendors.min.css?1684106062";
import "../../dist/css/demo.min.css?1684106062";



const DscStatusDropdown = () => {
  const [status, setStatus] = useState("Not Started");
  const [statusClass, setStatusClass] = useState("created-status");

  const handleStatusChange = (newStatus, statusClass) => {
    setStatus(newStatus);
    setStatusClass(statusClass);
  };

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
      </ul>
    </div>
    </section>
  );
};

export default DscStatusDropdown;