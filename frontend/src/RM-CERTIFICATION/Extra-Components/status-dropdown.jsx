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
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {status}
        </button>
        <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
          <li>
            <a
              className="dropdown-item"
              onClick={() => handleStatusChange("Created", "created-status")}
              href="#"
            >
              Created
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              onClick={() => handleStatusChange("Support", "support-status")}
              href="#"
            >
              Support
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              onClick={() => handleStatusChange("In Progress", "inprogress-status")}
              href="#"
            >
              In Progress
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              onClick={() => handleStatusChange("Finished", "finished-status")}
              href="#"
            >
              Finished
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              onClick={() => handleStatusChange("Rejected", "rejected-status")}
              href="#"
            >
              Rejected
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default StatusDropdown;