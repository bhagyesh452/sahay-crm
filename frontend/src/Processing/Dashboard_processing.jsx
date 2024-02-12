/*import React, { useState, useEffect } from "react";
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

import React, { useState, useEffect } from "react";
import Navbar_processing from "./Navbar_processing";
import Header_processing from "./Header_processing";
import CompanyList from "./CompanyList";
import CompanyDetails from "./CompanyDetails";
import '../dist/css/tabler.min.css?1684106062';
import './style_processing/main_processing.css'
import Form from "./Form";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import Papa from "papaparse";



function Dashboard_processing() {
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [bookingDates, setBookingDates] = useState([]);
  const [bookingTime, setBookingTime] = useState([]);
  const [formOpen, setformOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [csvdata, setCsvData] = useState([]);

  // --------------Handle File Upload funtion------------------------------

    const handleFileUpload = (event) => {
     const file = event.target.files[0];
     setUploadedFile(file);
     // Check if FileReader is supported by the browser
     if (window.FileReader) {
       const reader = new FileReader();

       reader.onload = (e) => {
         // Read the content of the file
         const content = e.target.result;

         // Parse the content to extract the header (field names)
         const lines = content.split(/\r\n|\n/);
         const header = lines[0].split(',');

         // Retrieve fields from your database
        const databaseFields = ['Company Name', 'Company Number', 'Company Email' , 'City']; // Replace with actual field names

         // Check if the fields from the uploaded file match the database fields
        const isValidFile = header.every(field => databaseFields.includes(field.trim()));

         if (isValidFile) {
           // Perform further processing or set a state indicating the file is valid
           console.log('File is valid');
        } else {
           // Display an error or prevent further processing
           console.error('File fields do not match the database fields');
        }
     };
      // Read the file as text
       reader.readAsText(file);
    } else {
      // FileReader is not supported
      console.error('FileReader is not supported by your browser');
    }
   };


  //  const handleFileUpload = (event) => {
  //    const file = event.target.files[0];

  //    if (
  //     file &&
  //     file.type ===
  //      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  //   ) {
  //      const reader = new FileReader();

  //      reader.onload = (e) => {
  //        const data = new Uint8Array(e.target.result);
  //        const workbook = XLSX.read(data, { type: "array" });

  //        // Assuming there's only one sheet in the XLSX file
  //       const sheetName = workbook.SheetNames[0];
  //        const sheet = workbook.Sheets[sheetName];

  //       const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  //       const formattedJsonData = jsonData
  //         .slice(1) // Exclude the first row (header)
  //         .map((row) => ({
  //           "Sr. No": row[0],
  //           "Company Name": row[1],
  //           "Company Number": row[2],
  //           "Company Email": row[3],
  //           "Company Incorporation Date": formatDateFromExcel(row[4]), // Assuming the date is in column 'E' (0-based)
  //           City: row[5],
  //           State: row[6],
  //         }));

  //       setCsvData(formattedJsonData);
  //     };

  //     reader.readAsArrayBuffer(file);
  //   } else if (file.type === "text/csv") {
  //     // CSV file
  //     const reader = new FileReader();

  //     reader.onload = (e) => {
  //       const data = e.target.result;
  //       const parsedCsvData = parseCsv(data);
  //       setCsvData(parsedCsvData);
  //     };

  //     reader.readAsText(file);
  //   } else {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Oops...",
  //       text: "Please upload a valid XLSX or CSV file.",
  //       footer: '<a href="#">Why do I have this issue?</a>',
  //     });

  //     console.error("Please upload a valid XLSX or CSV file.");
  //   }
  // };

  // const parseCsv = (data) => {
  //   // Use a CSV parsing library (e.g., Papaparse) to parse CSV data
  //   // Example using Papaparse:
  //   const parsedData = Papa.parse(data, { header: true });
  //   return parsedData.data;
  // };

  // function formatDateFromExcel(serialNumber) {
  //   // Excel uses a different date origin (January 1, 1900)
  //   const excelDateOrigin = new Date(Date.UTC(1900, 0, 0));
  //   const millisecondsPerDay = 24 * 60 * 60 * 1000;

  //   // Adjust for Excel leap year bug (1900 is not a leap year)
  //   const daysAdjustment = serialNumber > 59 ? 1 : 0;

  //   // Calculate the date in milliseconds
  //   const dateMilliseconds =
  //     excelDateOrigin.getTime() +
  //     (serialNumber - daysAdjustment) * millisecondsPerDay;

  //   // Create a Date object using the calculated milliseconds
  //   const formattedDate = new Date(dateMilliseconds);

  //   // Format the date as needed (you can use a library like 'date-fns' or 'moment' for more options)
  //   // const formattedDateString = formattedDate.toISOString().split('T')[0];

  //   return formattedDate;
  // }

  // console.log(csvdata);



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
            <div className="col-sm-12 mb-3">

            </div>

            <div className="col-sm-4">
              <CompanyList
                companies={companies}  // Use the correct array
                onCompanyClick={handleCompanyClick}
                selectedBookingDate={formattedDates}
                bookingTime={bookingTime}
              />
            </div>
            <div className="col-sm-8">

               // Render the FormComponent when formOpen is true 

              {formOpen ? (
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
                          {!formOpen ? <><button className="btn btn-primary" onClick={() => { setformOpen(true) }}>
                            Add Booking
                          </button> </> :
                            <button className="btn btn-primary" onClick={() => { setformOpen(false) }}>Back
                            </button>
                          }
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

export default Dashboard_processing;*/

import React, { useState, useEffect } from "react";
import Navbar_processing from "./Navbar_processing";
import Header_processing from "./Header_processing";
import CompanyList from "./CompanyList";
import CompanyDetails from "./CompanyDetails";
import Form from "./Form";

function Dashboard_processing() {
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
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          setformOpen(true);
                        }}
                      >
                        Add Booking
                      </button>
                    ) : null}
                  </h3>
                </div>
              )}
              </div>
              {companyDetails ? (
                <CompanyDetails company={companyDetails} />
              ) : null}

              {/* {formOpen ? (
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
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          setformOpen(true);
                        }}
                      >
                        Add Booking
                      </button>
                    ) : null}
                  </h3>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard_processing;
