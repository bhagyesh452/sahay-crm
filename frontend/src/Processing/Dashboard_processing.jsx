import React, { useState, useEffect } from "react";
import Navbar_processing from "./Navbar_processing";
import Header_processing from "./Header_processing";
import CompanyList from "./CompanyList";
import CompanyDetails from "./CompanyDetails";
import '../dist/css/tabler.min.css?1684106062';
import './style_processing/main_processing.css'
import Form from "./Form";



function Dashboard_processing() {
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [bookingDates, setBookingDates] = useState([]);
  const [bookingTime, setBookingTime] = useState([]);
  const [formOpen, setformOpen] = useState(false);


  const secretKey = process.env.REACT_APP_SECRET_KEY;


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
      const response = await fetch(`${secretKey}/companies`);
      const data = await response.json();
      console.log(response.data)

      // Extract unique booking dates from the fetched data
      const uniqueBookingDates = Array.from(new Set(data.map(company => company.bookingDate)));
      const uniqueBookingTime = Array.from(new Set(data.map(company => company.bookingTime)));

      // Update the state with both companies and booking dates
      setCompanies(data);
      setBookingDates(uniqueBookingDates);
      setBookingTime(uniqueBookingTime);

    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };
  const fetchCompanyDetails = async () => {
    try {
      if (selectedCompanyId !== null) {
        const response = await fetch(`${secretKey}/company/${selectedCompanyId}`);
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



  const formattedDates = bookingDates.map(date =>
    date ? new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }) : ''
  );

  return (
    <div >
      <Header_processing />
      <Navbar_processing />
      <div className="page-body">
        <div className="container-xl">
          <div className="processing-main row">
            <div className="col-sm-4">
              <CompanyList
                companies={companies}  // Use the correct array
                onCompanyClick={handleCompanyClick}
                selectedBookingDate={formattedDates}
                bookingTime={bookingTime}
              />
            </div>
            <div className="col-sm-8">

              {formOpen ? (
                // Render the FormComponent when formOpen is true

                <>
                <div className="d-flex align-items-center cmpy-dash-header ">
                <h3 className="card-title">Booking Details</h3>
                <button className="btn btn-primary" onClick={() => { setformOpen(false) }}>Close Form
                </button></div>
                  <Form onClose={() => setformOpen(false)} /></>
              ) : (
                <div>
                  <h3 class="card-title">
                    {companyDetails ? (
                      <CompanyDetails company={companyDetails} />
                    ) : (
                      <div className="card-header d-flex align-items-center cmpy-dash-header">
                        <h3 className="card-title">Booking Details</h3>
                        <div className="datagrid-content">
                          {!formOpen ? <button className="btn btn-primary" onClick={() => { setformOpen(true) }}>
                            Add Booking
                          </button> :
                            <button className="btn btn-primary" onClick={() => { setformOpen(false) }}>Back
                            </button>}
                        </div>
                      </div>
                    )}
                  </h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard_processing;
