
/*import React from "react";


function CompanyList({ companies, onCompanyClick }) {
  return (
    <div>
      <h2>Company List</h2>
      <ul>
        {companies.map((company, index) => (
          <li key={index} onClick={() => onCompanyClick(company)}>
            {company}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CompanyList;

import React from "react";

function CompanyList({ companies, onCompanyClick }) {
  return (
    <div className="text-center p-3 border rounded">
      <h2 className="mb-3" style={{ backgroundColor: "#007BFF", color: "#fff", padding: "10px" }}>
        Company List
      </h2>
      <div className="list-group">
        {companies.map((company, index) => (
          <button
            key={index}
            type="button"
            className="list-group-item list-group-item-action"
            onClick={() => onCompanyClick(company)}
          >
            {company}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CompanyList;
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

function CompanyList({ companies, onCompanyClick }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCompanies = companies.filter(company =>
    company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="text-center p-3">
      <div className="col-12">
        <div className="card">
          <div className="my-2 my-md-0 flex-grow-1 flex-md-grow-0 order-first order-md-last">
            <form action="./" method="get" autoComplete="off" noValidate>
              <div className="input-icon">
                <span className="input-icon-addon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /></svg>
                </span>
                <input type="text" className="form-control" placeholder="Search..." value={searchTerm} aria-label="Search in website" onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </form>
          </div>
          <div className="list-group list-group-flush overflow-auto" style={{ maxHeight: "35rem" }}>
            {filteredCompanies.map((company, index) => (
              <div className="list-group-item" key={index}>
                <div className="row">
                  <div className="col text-truncate">
                    <a href="#" className="text-body d-block" onClick={() => onCompanyClick(company)}>
                      {company}
                    </a>
                    <div className="text-muted text-truncate mt-n1">real time</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyList;



import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import './style_processing/main_processing.css'

function CompanyList({ companies, onCompanyClick }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [companyClasses, setCompanyClasses] = useState({});

  const filteredCompanies = companies.filter(company =>
    company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCompanyClick = (company) => {
    // Add or update the class for the clicked company
    setCompanyClasses(prevClasses => ({
      ...prevClasses,
      [company]: "list-group-item list-group-item-action active"
    }));

    // Call the original onCompanyClick function
    onCompanyClick(company);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="input-icon">
          <span className="input-icon-addon">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path><path d="M21 21l-6 -6"></path></svg>
          </span>
          <input type="text" value={searchTerm} className="form-control" placeholder="Search…" aria-label="Search in website" onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>
      <div className="list-group list-group-flush list-group-hoverable">
        {filteredCompanies.map((company, index) => (
          <div className={companyClasses[company] || "list-group-item list-group-item-action"} key={index}>
            <div className="row align-items-center">
              <div className="col text-justify">
                <div className="p-booking-Cname">
                  <h3 className="m-0" onClick={() => handleCompanyClick(company)}>
                    {company}
                  </h3>
                </div>
                <div className="d-flex justify-content-between aligns-items-center mt-1">
                  <div className="time">
                    <label className="m-0">10:00 AM</label>
                  </div>
                  <div className="date">
                    <label className="m-0">10th Jun 20232</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompanyList;*/


import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import './style_processing/main_processing.css'

function CompanyList({ companies, onCompanyClick,selectedBookingDate}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [companyClasses, setCompanyClasses] = useState({});

  const filteredCompanies = companies.filter(company =>
    company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCompanyClick = (company) => {
    // Add or update the class for the clicked company
    setCompanyClasses(prevClasses => ({
      ...prevClasses,
      [company]: "list-group-item list-group-item-action active"
    }));

    // Call the original onCompanyClick function
    onCompanyClick(company);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="input-icon">
          <span className="input-icon-addon">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path><path d="M21 21l-6 -6"></path></svg>
          </span>
          <input type="text" value={searchTerm} className="form-control" placeholder="Search…" aria-label="Search in website" onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>
      <div className="list-group list-group-flush list-group-hoverable">
        {filteredCompanies.map((company, index) => (
          <div className={companyClasses[company] || "list-group-item list-group-item-action"} key={index}>
            <div className="row align-items-center">
              <div className="col text-justify">
                <div className="p-booking-Cname">
                  <h3 className="m-0" onClick={() => handleCompanyClick(company)}>
                    {company}
                  </h3>
                </div>
                <div className="d-flex justify-content-between aligns-items-center mt-1">
                  <div className="time">
                    <label className="m-0">10:00 AM</label>
                  </div>
                  <div className="bookingdate">
                    <label className="m-0">{selectedBookingDate && (
                      <p>Selected Booking Date: {selectedBookingDate}</p>
                    )}</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompanyList;


