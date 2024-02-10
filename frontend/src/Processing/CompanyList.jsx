
/*import React, { useState } from "react";
import './style_processing/main_processing.css';

function CompanyList({ companies, onCompanyClick }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [companyClasses, setCompanyClasses] = useState({});
  const [searchDate, setSearchDate] = useState("");
  const [companyData, setcompanyData] = useState(companies);


  const formatDatelatest = (inputDate) => {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Note: Month is zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const handleCompanyClick = (company) => {
    setCompanyClasses(prevClasses => ({
      ...prevClasses,
      [company]: "list-group-item list-group-item-action active"
    }));
    onCompanyClick(company);
  };

  const FilteredData = searchDate === "" ?

    companies.filter(obj => obj.companyName.toLowerCase().includes(searchTerm)) : companies.filter(obj => formatDatelatest(obj.bookingDate) === formatDatelatest(searchDate))

  console.log(FilteredData)

  return (
    <div className="card">
      <div className="card-header">
        <div className="input-icon search-name">
          <span className="input-icon-addon">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path><path d="M21 21l-6 -6"></path></svg>
          </span>
          <input type="text" value={searchTerm} className="form-control" placeholder="Search…" aria-label="Search in website" onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="input-icon search-date">
          <input
            type="date"
            value={searchDate}
            className="form-control"
            placeholder="Search…"
            aria-label="Search in website"
            onChange={(e) => {
              setSearchDate(e.target.value)

            }}
          />

        </div>
      </div>
      <div className="list-group list-group-flush list-group-hoverable">
        {FilteredData.map((company, index) => (
          <div className={companyClasses[company.companyName] || "list-group-item list-group-item-action"} key={index}>
            <div className="row align-items-center">
              <div className="col text-justify">
                <div className="p-booking-Cname">
                  <h3 className="m-0" onClick={() => handleCompanyClick(company.companyName)}>
                    {company.companyName}
                  </h3>
                </div>
                <div className="d-flex justify-content-between aligns-items-center mt-1">
                  <div className="time">
                    <label className="m-0">10:00 AM</label>
                  </div>
                  <div className="bookingdate">
                    <label className="m-0">
                      {company.bookingDate && (
                        <p>{formatDatelatest(company.bookingDate)}</p>
                      )}
                    </label>
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
import './style_processing/main_processing.css';

function CompanyList({ companies, onCompanyClick }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [companyClasses, setCompanyClasses] = useState({});
  const [searchDate, setSearchDate] = useState("");
  const [companyData, setcompanyData] = useState(companies);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });


  const formatDatelatest = (inputDate) => {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Note: Month is zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const handleCompanyClick = (company) => {
    setCompanyClasses(prevClasses => ({
      ...prevClasses,
      [company]: "list-group-item list-group-item-action active"
    }));
    onCompanyClick(company);
  };

  const FilteredData = !dateRange.startDate && !dateRange.endDate ?
  companies.filter(obj => obj.companyName.toLowerCase().includes(searchTerm)) :
  companies.filter(obj => {
    const companyNameMatch = obj.companyName.toLowerCase().includes(searchTerm);
    const dateMatch = dateRange.startDate && dateRange.endDate ?
      formatDatelatest(obj.bookingDate) >= formatDatelatest(dateRange.startDate) &&
      formatDatelatest(obj.bookingDate) <= formatDatelatest(dateRange.endDate) :
      true;
      console.log(obj.bookingDate)
      console.log(dateRange.startDate)
      console.log(dateRange.endDate)

    return companyNameMatch && dateMatch;
  });



  return (
    <div className="card">
      <div className="card-header search-date-header">
        <div className="input-icon search-name">
          <span className="input-icon-addon">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path><path d="M21 21l-6 -6"></path></svg>
          </span>
          <input type="text" value={searchTerm} className="form-control" placeholder="Search…" aria-label="Search in website" onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="input-icon search-date">
          {/* <input
            type="date"
            value={searchDate}
            className="form-control"
            placeholder="Search…"
            aria-label="Search in website"
            onChange={(e) => {
              setSearchDate(e.target.value)

            }}
          /> */}
          <input
            type="date"
            value={dateRange.startDate}
            className="form-control"
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
          />
          <span className="date-range-separator">to</span>
          <input
            type="date"
            value={dateRange.endDate}
            className="form-control"
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
          />

        </div>
      </div>
      <div className="list-group list-group-flush list-group-hoverable cmpy-list-body">
        {FilteredData.map((company, index) => (
          <div className={companyClasses[company.companyName] || "list-group-item list-group-item-action"} key={index}>
            <div className="row align-items-center">
              <div className="col text-justify">
                <div className="p-booking-Cname">
                  <h3 className="m-0" onClick={() => handleCompanyClick(company.companyName)}>
                    {company.companyName}
                  </h3>
                </div>
                <div className="d-flex justify-content-between aligns-items-center mt-1">
                  <div className="time">
                    <label className="m-0">{company.bookingTime && (
                      <p>{company.bookingTime}</p>)}</label>
                  </div>
                  <div className="bookingdate">
                    <label className="m-0">
                      {company.bookingDate && (
                        <p>{formatDatelatest(company.bookingDate)}</p>
                      )}
                    </label>
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

















