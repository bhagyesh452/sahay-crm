import React, { useState } from "react";
import "../../dist/css/tabler.min.css?1684106062";
import "../../dist/css/tabler-payments.min.css?1684106062";
import "../../dist/css/tabler-vendors.min.css?1684106062";
import "../../dist/css/demo.min.css?1684106062";
import $ from 'jquery';



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
        data-bs-toggle="dropdown" // Bootstrap data attribute to toggle dropdown
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
      {/* <div class="btn-group">
        <button type="button" class="btn btn-danger">Action</button>
        <button type="button" class="btn btn-danger dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span class="sr-only">Toggle Dropdown</span>
        </button>
        <div class="dropdown-menu">
          <a class="dropdown-item" href="#">Action</a>
          <a class="dropdown-item" href="#">Another action</a>
          <a class="dropdown-item" href="#">Something else here</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="#">Separated link</a>
        </div>
      </div> */}

    </section>
  );
};

export default StatusDropdown;