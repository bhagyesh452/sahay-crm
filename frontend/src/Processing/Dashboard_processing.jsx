
import React, { useState, useEffect } from "react";
import Navbar_processing from "./Navbar_processing";
import Header_processing from "./Header_processing";
import CompanyList from "./CompanyList";
import CompanyDetails from "./CompanyDetails";
import Form from "./Form";
import { Link } from "react-router-dom";
import socketIO from 'socket.io-client';

function Dashboard_processing() {
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [duplicateCompany, setduplicateCompany] = useState([]);
  const [bookingDates, setBookingDates] = useState([]);
  const [bookingTime, setBookingTime] = useState([]);
  
  const secretKey = process.env.REACT_APP_SECRET_KEY;

  useEffect(() => {
    // Fetch company names from the backend API
    fetchCompanies();
  }, []);

  useEffect(() => {
    const socket = socketIO.connect(`/socket.io`);

    // Listen for the 'welcome' event from the server
    socket.on('read', () => {
      fetchCompanies(); 
      //fetchCompanyDetails()// Log the welcome message received from the server
    });

    socket.on('viewpaymenteciept' , ()=>{
      fetchCompanyDetails();
    })

    socket.on('veiwotherdocs' , ()=>{
      fetchCompanyDetails();
    })

  socket.on('importcsv' , ()=>{
    fetchCompanies();
  })
  
  socket.on('companydeleted' , ()=>{
    fetchCompanies();
  })
    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
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
      const companyData = data.companies


      const uniqueBookingDates = Array.from(
        new Set(companyData.map((company) => company.bookingDate))
      );
      const uniqueBookingTime = Array.from(
        new Set(companyData.map((company) => company.bookingTime))
      );
      
  
      // Set the details of the first company by default if there are companies available
      // if (companyData.length !== 0) {
      //   setSelectedCompanyId(companyData[0].companyName);
      // }
  
      // Update the state with both companies and booking dates
      setCompanies(companyData.reverse());
      setBookingDates(uniqueBookingDates);
      setBookingTime(uniqueBookingTime);
     
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  // const markCompanyAsRead = (companyId) => {
  //   const updatedCompanies = companies.map(company =>
  //     company._id === companyId ? { ...company, unread: false } : company
  //   );
  //   setCompanies(updatedCompanies);
  // };


  const fetchCompanyDetails = async () => {
    try {
      if (selectedCompanyId !== null) {
        const response = await fetch(`${secretKey}/company/${selectedCompanyId}`);
        const response2 = await fetch(`${secretKey}/duplicate-company/${selectedCompanyId}`);
     
        const data = await response.json();
        const data2 = await response2.json()
        setCompanyDetails(data);
        setduplicateCompany(data2);
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
    }
  };

  const handleCompanyClick = (companyId) => {
    setSelectedCompanyId(companyId);
  };

  const formattedDates = bookingDates.map((date) =>
    date
      ? new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : ""
  );


  return (
    <div>
      <Header_processing data={companies} />
      <Navbar_processing />
       <div className="page-body">
                <div className="page-body">
                    <div className="container-xl">
                        <div className="processing-main row">
                            <div className="col-sm-12"></div>
                            <div className="col-sm-4">
                                <CompanyList
                                    companies={companies} // Use the correct array
                                    onCompanyClick={handleCompanyClick}
                                    selectedBookingDate={formattedDates}
                                    bookingTime={bookingTime}
                                />
                            </div>
                            <div className="col-sm-8">
                                    <CompanyDetails companyDetails={companyDetails} duplicateCompany={duplicateCompany}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>
  );
}

export default Dashboard_processing;