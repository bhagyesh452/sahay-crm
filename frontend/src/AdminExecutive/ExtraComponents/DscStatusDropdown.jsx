import React, { useState } from 'react';

const DscStatusDropdown = () => {
  // State to manage the selected status and the corresponding CSS class
  const [selectedStatus, setSelectedStatus] = useState('Created');
  const [statusClass, setStatusClass] = useState('created-status');

  // Function to handle the dropdown item click
  const handleStatusChange = (statusText, statusClass) => {
    setSelectedStatus(statusText);
    setStatusClass(`${statusClass}-status`);
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
          {selectedStatus}
        </button>
        <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
          <li>
            <a className="dropdown-item" onClick={() => handleStatusChange('Untouched', 'untouched_status')} href="#">
              Call Done Docs Pending
            </a>
          </li>
          <li>
            <a className="dropdown-item" onClick={() => handleStatusChange('Support', 'cdbp-status')} href="#">
               Client Not Responding
            </a>
          </li>
          <li>
            <a className="dropdown-item" onClick={() => handleStatusChange('In Progress', 'clnt_no_repond_status')} href="#">
              Need To Call
            </a>
          </li>
          <li>
            <a className="dropdown-item" onClick={() => handleStatusChange('Finished', 'support-status')} href="#">
              Working
            </a>
          </li>

          <li>
            <a className="dropdown-item" onClick={() => handleStatusChange('Finished', 'support-status')} href="#">
              Hold
            </a>
          </li>
          <li>
            <a className="dropdown-item" onClick={() => handleStatusChange('Finished', 'support-status')} href="#">
             Defaulter
            </a>
          </li>
          <li>
            <a className="dropdown-item" onClick={() => handleStatusChange('Finished', 'support-status')} href="#">
              Approved
            </a>
          </li>
          <li>
            <a className="dropdown-item" onClick={() => handleStatusChange('Finished', 'support-status')} href="#">
               KYC Pending
            </a>
          </li>
          <li>
            <a className="dropdown-item" onClick={() => handleStatusChange('Finished', 'support-status')} href="#">
                KYC Rejected
            </a>
          </li>
          <li>
            <a className="dropdown-item" onClick={() => handleStatusChange('Finished', 'support-status')} href="#">
                KYC Incomplete
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default DscStatusDropdown;
