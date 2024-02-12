
import React, { useState, useEffect } from "react";
import Navbar_processing from "./Navbar_processing";
import Header_processing from "./Header_processing";
import CompanyList from "./CompanyList";
import CompanyDetails from "./CompanyDetails";
import Form from "./Form";
import { Link } from "react-router-dom";



const Bookings = () => {
    const [selectedCompanyId, setSelectedCompanyId] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [companyDetails, setCompanyDetails] = useState(null);
    const [bookingDates, setBookingDates] = useState([]);
    const [bookingTime, setBookingTime] = useState([]);
    const [formOpen, setformOpen] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);

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

            // Extract unique booking dates from the fetched data
            const uniqueBookingDates = Array.from(
                new Set(data.map((company) => company.bookingDate))
            );
            const uniqueBookingTime = Array.from(
                new Set(data.map((company) => company.bookingTime))
            );

            // Set the details of the first company by default if there are companies available
            if (data.length !== 0) {
                setSelectedCompanyId(data[0].companyName);
            }

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
            <Header_processing />
            <Navbar_processing />
            {/* <div className="page-body">
                {!formOpen ? (<div className="container-xl">
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
                            <div>
                                {formOpen ? (
                                    <>
                                        <div className="d-flex align-items-center cmpy-dash-header ">
                                            <h3 className="card-title">Booking Details</h3>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    setformOpen(false);
                                                }}
                                            >
                                                Close Form
                                            </button>
                                        </div>
                                        <Form onClose={() => setformOpen(false)} />
                                    </>
                                ) : (
                                    <div>
                                        <h3 class="card-title">
                                            {!formOpen ? (
                                                <div className="d-flex align-items-center cmpy-dash-header ">
                                                    <h3>Booking Details</h3>
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() => {
                                                            setformOpen(true);
                                                        }}
                                                    >
                                                        Add Booking
                                                    </button></div>
                                            ) : null}
                                        </h3>
                                    </div>
                                )}
                            </div>
                            {companyDetails ? (
                                <CompanyDetails company={companyDetails} />
                            ) : null}
                        </div>
                    </div>
                </div>) : (
                    <div className="page-wrapper bookings-form">
                        
                            <div className="d-flex align-items-center cmpy-dash-header ">
                                <h3 className="card-title">Booking Details</h3>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setformOpen(false);
                                    }}
                                >
                                    Close Form
                                </button>
                            </div>
                        
                        <Form onClose={() => setformOpen(false)}  /></div>

                )}
            </div> */}
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
                                <div>
                                    <div>
                                        <h3 class="card-title">
                                            <div className="d-flex align-items-center cmpy-dash-header ">
                                                <h3>Booking Details</h3>
                                                <Link to='/Processing/Dashboard_processing/addbookings'>
                                                    <button
                                                        className="btn btn-primary">
                                                        Add Booking
                                                    </button>
                                                </Link></div>
                                        </h3>
                                    </div>
                                </div>
                                {companyDetails ? (
                                    <CompanyDetails company={companyDetails} />
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Bookings;