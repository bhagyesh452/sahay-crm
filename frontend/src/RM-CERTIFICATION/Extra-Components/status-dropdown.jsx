import React, { useState } from "react";

const StatusDropdown = () => {
  const [status, setStatus] = useState("Created");
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
          id={`dropdownMenuButton1-${status}`} // Making ID unique
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {status}
        </button>
        <div className="dropdown-menu status_change" aria-labelledby={`dropdownMenuButton1-${status}`}>
          <a
            className="dropdown-item"
            onClick={() => handleStatusChange("Created", "created-status")}
            href="#"
          >
            Created
          </a>
          <a
            className="dropdown-item"
            onClick={() => handleStatusChange("Support", "support-status")}
            href="#"
          >
            Support
          </a>
          <a
            className="dropdown-item"
            onClick={() => handleStatusChange("In Progress", "inprogress-status")}
            href="#"
          >
            In Progress
          </a>
          <a
            className="dropdown-item"
            onClick={() => handleStatusChange("Finished", "finished-status")}
            href="#"
          >
            Finished
          </a>
          <a
            className="dropdown-item"
            onClick={() => handleStatusChange("Rejected", "rejected-status")}
            href="#"
          >
            Rejected
          </a>
        </div>
      </div>
    </section>
  );
};

export default StatusDropdown;
