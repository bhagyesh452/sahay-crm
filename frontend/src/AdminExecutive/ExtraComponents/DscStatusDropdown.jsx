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
          <li><a className="dropdown-item" onClick={() => handleStatusChange('Untouched', 'untouched_status')} href="#">Created</a></li>
          <li><a className="dropdown-item" onClick={() => handleStatusChange('Support', 'cdbp-status')} href="#">Support</a></li>
          <li><a className="dropdown-item" onClick={() => handleStatusChange('In Progress', 'clnt_no_repond_status')} href="#">In Progress</a></li>
          <li><a className="dropdown-item" onClick={() => handleStatusChange('Finished', 'support-status')} href="#">Finished</a></li>
        </ul>
      </div>
    </section>
  );
};

export default DscStatusDropdown;
