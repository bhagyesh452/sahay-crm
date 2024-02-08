/*import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import './style_processing/main_processing.css'
import { FaRegCalendarAlt } from "react-icons/fa";

function CompanyList({ companies, onCompanyClick, selectedBookingDate }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [companyClasses, setCompanyClasses] = useState({});

  const filteredCompanies = companies.filter(company =>
    company && company.toLowerCase().includes(searchTerm.toLowerCase())
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

  const formattedDate = selectedBookingDate ? new Date(selectedBookingDate).toLocaleDateString() : '';

  return (
    <div className="card">
      <div className="card-header">
        <div className="input-icon">
          <span className="input-icon-addon">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path><path d="M21 21l-6 -6"></path></svg>
          </span>
          <input type="text" value={searchTerm} className="form-control" placeholder="Search…" aria-label="Search in website" onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div id="date-picker-example" class="md-form md-outline input-with-post-icon datepicker" inline="true">
          <input placeholder="Select date" type="text" id="example" class="form-control" />
          <label for="example">Try me...</label>
          <i class="fas fa-calendar input-prefix"></i>
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
                      <p>{formattedDate}</p>
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

export default CompanyList;*/

import React, { useState } from "react";
import { FaSearch, FaRegCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './style_processing/main_processing.css';

function CompanyList({ companies, onCompanyClick, selectedBookingDate }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [companyClasses, setCompanyClasses] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  const filteredCompanies = companies.filter(company =>
    company &&
    company.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!selectedDate || new Date(company.bookingDate).toDateString() === selectedDate.toDateString())
  );

  const handleCompanyClick = (company) => {
    setCompanyClasses(prevClasses => ({
      ...prevClasses,
      [company]: "list-group-item list-group-item-action active"
    }));
    onCompanyClick(company);
  };

  const formattedDate = selectedBookingDate ? new Date(selectedBookingDate).toLocaleDateString() : '';

  return (
    <div className="card">
      <div className="card-header">
        <div className="input-icon">
          <span className="input-icon-addon">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path><path d="M21 21l-6 -6"></path></svg>
          </span>
          <input type="text" value={searchTerm} className="form-control" placeholder="Search…" aria-label="Search in website" onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="date-picker-icon">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText={<FaRegCalendarAlt />}
            className="form-control datepicker-icon"
            popperPlacement="bottom-end"
          />
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
                      <p>{formattedDate}</p>
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





