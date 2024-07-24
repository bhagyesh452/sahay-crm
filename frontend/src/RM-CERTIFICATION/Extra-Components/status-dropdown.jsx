import React, { useState } from "react";
import "../../dist/css/tabler.min.css?1684106062";
import "../../dist/css/tabler-payments.min.css?1684106062";
import "../../dist/css/tabler-vendors.min.css?1684106062";
import "../../dist/css/demo.min.css?1684106062";



const StatusDropdown = () => {
  const [status, setStatus] = useState("Untouch");
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
            onClick={() => handleStatusChange("Untouch", "created-status")}
            href="#"
          >
            Untouch
          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            onClick={() => handleStatusChange("Call Done Brief Pending", "support-status")}
            href="#"
          >
           Call Done Brief Pending
          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            onClick={() => handleStatusChange("Client Not Responding", "inprogress-status")}
            href="#"
          >
            Client Not Responding
          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            onClick={() => handleStatusChange("Documents Pending", "docs-pending")}
            href="#"
          >
            Documents Pending
          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            onClick={() => handleStatusChange("Ready To Submit", "rejected-status")}
            href="#"
          >
            Ready To Submit
          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            onClick={() => handleStatusChange("Submitted", "rejected-status")}
            href="#"
          >
            Submitted
          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            onClick={() => handleStatusChange("Submitted", "finished-status")}
            href="#"
          >
            Submitted
          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            onClick={() => handleStatusChange("Working", "finished-status")}
            href="#"
          >
            Working
          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            onClick={() => handleStatusChange("Defaulter", "finished-status")}
            href="#"
          >
            Defaulter
          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            onClick={() => handleStatusChange("Need To Call", "rejected-status")}
            href="#"
          >
            Need To Call
          </a>
        </li>
      </ul>
    </div>
    </section>
  );
};

export default StatusDropdown;