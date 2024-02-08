/*import React, { useState, useEffect } from "react";
import Navbar_processing from "./Navbar_processing";
import Header_processing from "./Header_processing";
import CompanyList from "./CompanyList";
import CompanyDetails from "./CompanyDetails";
import '../dist/css/tabler.min.css?1684106062'



function Dashboard_processing() {
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [companyDetails, setCompanyDetails] = useState(null);

  useEffect(() => {
    // Fetch company names from the backend API
    fetchCompanies();
  }, []);

  useEffect(() => {
    // Fetch company details when selectedCompanyId changes
    if (selectedCompanyId !== null) {
      fetchCompanyDetails();
    }
  }, [selectedCompanyId]);

  const fetchCompanies = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/companies");
      const data = await response.json();
      console.log("Fetched companies:", data); // Log the fetched data
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchCompanyDetails = async () => {
    try {
      if (selectedCompanyId !== null) {
        const response = await fetch(`http://localhost:3001/api/company/${selectedCompanyId}`);
        const data = await response.json();
        setCompanyDetails(data);
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
    }
  };

  const handleCompanyClick = (companyId) => {
    setSelectedCompanyId(companyId);
  };

  return (
    <div >
       <Header_processing/>
       <Navbar_processing/>
      <div className="container-xl">
        <div className="row">
          <div className="col-md-4">
            <CompanyList companies={companies} onCompanyClick={handleCompanyClick} />
          </div>
          <div className="col-md-8">
            {companyDetails ? (
              <CompanyDetails company={companyDetails} />
            ) : (
              <p>Select a company to view details</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard_processing;

import React, { useState, useEffect } from "react";
import Navbar_processing from "./Navbar_processing";
import Header_processing from "./Header_processing";
import CompanyList from "./CompanyList";
import CompanyDetails from "./CompanyDetails";
import '../dist/css/tabler.min.css?1684106062';
import './style_processing/main_processing.css'



function Dashboard_processing() {
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [companyDetails, setCompanyDetails] = useState(null);

  useEffect(() => {
    // Fetch company names from the backend API
    fetchCompanies();
  }, []);

  useEffect(() => {
    // Fetch company details when selectedCompanyId changes
    if (selectedCompanyId !== null) {
      fetchCompanyDetails();
    }
  }, [selectedCompanyId]);

  const fetchCompanies = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/companies");
      const data = await response.json();
      console.log("Fetched companies:", data); // Log the fetched data
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchCompanyDetails = async () => {
    try {
      if (selectedCompanyId !== null) {
        const response = await fetch(`http://localhost:3001/api/company/${selectedCompanyId}`);
        const data = await response.json();
        setCompanyDetails(data);
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
    }
  };

  const handleCompanyClick = (companyId) => {
    setSelectedCompanyId(companyId);
  };

  return (
    <div >
      <Header_processing />
      <Navbar_processing />

      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row row-cards">
              <div class="col-sm-3">
                <div class="card">
                  <div class="card-status-top bg-red"></div>
                  <div class="card-header">
                    <h3 class="card-title"><CompanyList companies={companies} onCompanyClick={handleCompanyClick} /></h3>
                  </div>
                </div>
              </div>
              <div class="col-md">
                <div class="card">
                  <div class="card-status-top bg-green"></div>
                  <div class="card-header">
                    <h3 class="card-title">{companyDetails ? (
                      <CompanyDetails company={companyDetails} />
                    ) : (
                      <p>Select a company to view details</p>
                    )}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard_processing;

import React, { useState, useEffect } from "react";
import Navbar_processing from "./Navbar_processing";
import Header_processing from "./Header_processing";
import CompanyList from "./CompanyList";
import CompanyDetails from "./CompanyDetails";
import '../dist/css/tabler.min.css?1684106062';
import './style_processing/main_processing.css'



function Dashboard_processing() {
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [companyDetails, setCompanyDetails] = useState(null);

  useEffect(() => {
    // Fetch company names from the backend API
    fetchCompanies();
  }, []);

  useEffect(() => {
    // Fetch company details when selectedCompanyId changes
    if (selectedCompanyId !== null) {
      fetchCompanyDetails();
    }
  }, [selectedCompanyId]);

  const fetchCompanies = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/companies");
      const data = await response.json();
      console.log("Fetched companies:", data); // Log the fetched data
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchCompanyDetails = async () => {
    try {
      if (selectedCompanyId !== null) {
        const response = await fetch(`http://localhost:3001/api/company/${selectedCompanyId}`);
        const data = await response.json();
        setCompanyDetails(data);
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
    }
  };

  const handleCompanyClick = (companyId) => {
    setSelectedCompanyId(companyId);
  };

  return (
    <div >
      <Header_processing />
      <Navbar_processing />
      <div className="page-body">
        <div className="container-xl">
          <div className="processing-main row">
            <div className="col-sm-4">
              <div class="card">
                <div class="card-header">
                    <div class="input-icon">
                      <span class="input-icon-addon">
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path><path d="M21 21l-6 -6"></path></svg>
                      </span>
                      <input type="text" value="" class="form-control" placeholder="Search…" aria-label="Search in website"/>
                    </div>
              
                </div>
                <div class="list-group list-group-flush list-group-hoverable">
                  <div class="list-group-item">
                    <div class="row align-items-center">
                      <div class="col text-truncate">
                        <div className="p-booking-Cname">
                          <h3 className="m-0">Incscale Technologies Private Limited</h3>
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
                  <div class="list-group-item">
                    <div class="row align-items-center">
                      <div class="col text-truncate">
                        <div className="p-booking-Cname">
                          <h3 className="m-0">Incscale Technologies Private Limited</h3>
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
                </div>
              </div>
            </div>
            <div className="col-sm-8">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Booking Details</h3>
              </div>
              <div class="card-body">
                <div class="datagrid">
                  <div class="datagrid-item">
                    <div class="datagrid-title">Registrar</div>
                    <div class="datagrid-content">Third Party</div>
                  </div>
                  <div class="datagrid-item">
                    <div class="datagrid-title">Nameservers</div>
                    <div class="datagrid-content">Third Party</div>
                  </div>
                  <div class="datagrid-item">
                    <div class="datagrid-title">Port number</div>
                    <div class="datagrid-content">3306</div>
                  </div>
                  <div class="datagrid-item">
                    <div class="datagrid-title">Expiration date</div>
                    <div class="datagrid-content">–</div>
                  </div>
                  <div class="datagrid-item">
                    <div class="datagrid-title">Creator</div>
                    <div class="datagrid-content">
                      <div class="d-flex align-items-center">
                        Paweł Kuna
                      </div>
                    </div>
                  </div>
                  <div class="datagrid-item">
                    <div class="datagrid-title">Age</div>
                    <div class="datagrid-content">15 days</div>
                  </div>
                  <div class="datagrid-item">
                    <div class="datagrid-title">Edge network</div>
                    <div class="datagrid-content">
                      <span class="status status-green">
                        Active
                      </span>
                    </div>
                  </div>
                  <div class="datagrid-item">
                    <div class="datagrid-title">Avatars list</div>
                    <div class="datagrid-content">
                    </div>
                  </div>
                  <div class="datagrid-item">
                    <div class="datagrid-title">Checkbox</div>
                    <div class="datagrid-content">
                      <label class="form-check">
                        <input class="form-check-input" type="checkbox" checked=""/>
                        <span class="form-check-label">Click me</span>
                      </label>
                    </div>
                  </div>
                  <div class="datagrid-item">
                    <div class="datagrid-title">Icon</div>
                    <div class="datagrid-content">
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon text-green" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12l5 5l10 -10"></path></svg>
                      Checked
                    </div>
                  </div>
                  <div class="datagrid-item">
                    <div class="datagrid-title">Form control</div>
                    <div class="datagrid-content">
                      <input type="text" class="form-control form-control-flush" placeholder="Input placeholder"/>
                    </div>
                  </div>
                  <div class="datagrid-item">
                    <div class="datagrid-title">Longer description</div>
                    <div class="datagrid-content">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard_processing;*/

import React, { useState, useEffect } from "react";
import Navbar_processing from "./Navbar_processing";
import Header_processing from "./Header_processing";
import CompanyList from "./CompanyList";
import CompanyDetails from "./CompanyDetails";
import '../dist/css/tabler.min.css?1684106062';
import './style_processing/main_processing.css'



function Dashboard_processing() {
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [bookingDates, setBookingDates] = useState([]);
  const [selectedBookingDate, setSelectedBookingDate] = useState(null);


  useEffect(() => {
    // Fetch company names from the backend API
    fetchCompanies();
  }, []);

  useEffect(() => {
    // Fetch company details when selectedCompanyId changes
    if (selectedCompanyId !== null) {
      fetchCompanyDetails();
    }
  }, [selectedCompanyId]);

  /*const fetchCompanies = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/companies");
      const data = await response.json();
      console.log("Fetched companies:", data); // Log the fetched data
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };*/

  const fetchCompanies = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/companies");
      const data = await response.json();
      console.log(response.data)

      // Extract unique booking dates from the fetched data
      const uniqueBookingDates = Array.from(
        new Set(data.map(company => company.bookingDate))
      );

      // Update the state with both companies and booking dates
      setCompanies(data);
      setBookingDates(uniqueBookingDates);

      // If there are booking dates, set the selected booking date to the first one
      if (uniqueBookingDates.length > 0) {
        setSelectedBookingDate(uniqueBookingDates[0]);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchCompanyDetails = async () => {
    try {
      if (selectedCompanyId !== null) {
        const response = await fetch(`http://localhost:3001/api/company/${selectedCompanyId}`);
        const data = await response.json();
        setCompanyDetails(data);
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
    }
  };

  const handleCompanyClick = (companyId) => {
    setSelectedCompanyId(companyId);
  };

  return (
    <div >
      <Header_processing />
      <Navbar_processing />
      <div className="page-body">
        <div className="container-xl">
          <div className="processing-main row">
            <div className="col-sm-4">
              <CompanyList
                companies={companies.map(item => item.companyName)}  // Use the correct array
                onCompanyClick={handleCompanyClick}
                selectedBookingDate={selectedBookingDate}
              />
            </div>
            <div className="col-sm-8">
              <div>
                <h3 class="card-title">{companyDetails ? (
                  <CompanyDetails company={companyDetails} />
                ) : (
                  <div className="card-header">
                    <h3 className="card-title">Booking Details</h3>
                  </div>
                )}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard_processing;