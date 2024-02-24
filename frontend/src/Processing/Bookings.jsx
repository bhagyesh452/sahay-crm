
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

/*import React, { useState } from "react";
import './style_processing/main_processing.css'
import { pdfuploader } from "../documents/pdf1.pdf";
import Dashboard_processing from "./Dashboard_processing";
import { Link } from "react-router-dom";

const formatDate = (inputDate) => {
  const date = new Date(inputDate);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Note: Month is zero-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const CompanyDetails = ({ company }) => {

  const secretKey = process.env.REACT_APP_SECRET_KEY;

  const handleViewPdf = () => {
    const pathname = company.otherDocs[0];
    console.log(pathname);
    window.open(`${secretKey}/pdf/${pathname}`, "_blank");
  };

  return (
    <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3 class="card-title">Booking Details</h3>
            <Link to='/Processing/Dashboard_processing/addbookings'>
              <button
                className="btn btn-primary">
                Add Booking
              </button>
            </Link></div>
      <div className="card-body cmpy-d-body">
        {company ? (
          <div className="datagrid">
            {Object.entries(company)
              .filter(([key, value]) => key !== "_id" && (value || value === "")) // Exclude "id" field and empty/undefined values
              .map(([key, value]) => (
                // Render only if both key and value are present
                value && (
                  <div className="datagrid-item" key={key}>
                    <div className="datagrid-title">{key}</div>
                    <div className="datagrid-content">
                      {(key === "bookingDate" || key === "incoDate") ? formatDate(value) : value}
                    </div>
                  </div>
                )
              ))}
            <div className="datagrid-item">
              <div className="datagrid-title">Actions</div>
              <div className="datagrid-content">
                  <button className="btn btn-primary" onClick={handleViewPdf}>
                    View PDF
                  </button>
              </div>
            </div>
          </div>
        ) : (
          <p>Select a company from the list to view details.</p>
        )}
      </div>
    </div>
  );
};

export default CompanyDetails;



import React, { useState } from "react";
import './style_processing/main_processing.css'
import { pdfuploader } from "../documents/pdf1.pdf";
import Dashboard_processing from "./Dashboard_processing";
import { Link } from "react-router-dom";

const CompanyDetails = ({ company }) => {
  const [field, setField] = useState(false)

  const formatDatelatest = (inputDate) => {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const secretKey = process.env.REACT_APP_SECRET_KEY;
  console.log(company)

  const handleViewPdf = () => {
    const pathname = company.otherDocs[0];
    console.log(pathname);
    window.open(`${secretKey}/pdf/${pathname}`, "_blank");
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h3 class="card-title">Booking Details</h3>
        <Link to='/Processing/Dashboard_processing/addbookings'>
          <button
            className="btn btn-primary">
            Add Booking
          </button>
        </Link>
      </div>
      <div className="card-body">
        <div className="datagrid">
           {(company.bdeName || company.bdeName === " ") && (<div className="datagrid-item bdeName">
            <div className="datagrid-title">BDE Name</div>
            <div className="datagrid-content">{company.bdeName}</div>
          </div>)}

          {(company.bdeEmail || company.bdeEmail === " ") && (<div className="datagrid-item bdeEmail">
            <div className="datagrid-title">BDE Email</div>
            <div className="datagrid-content">{company.bdeEmail}</div>
          </div>)}

          {(company.bdmName || company.bdmName === " ") && (<div className="datagrid-item bdmName">
            <div className="datagrid-title">BDM Name</div>
            <div className="datagrid-content">{company.bdmName}</div>
          </div>)}

          {(company.bdmEmail || company.bdmEmail === " ") && (<div className="datagrid-item bdmEmail">
            <div className="datagrid-title">BDM Email</div>
            <div className="datagrid-content">{company.bdmEmail}</div>
          </div>)}

          {(company.bdmType || company.bdmType === " ") && (<div className="datagrid-item bdmType">
            <div className="datagrid-title">BDM Type</div>
            <div className="datagrid-content">{company.bdmType}</div>
          </div>)}

          {(company.bookingDate || company.bookingDate === " ") && (<div className="datagrid-item bookingDate">
            <div className="datagrid-title">Booking Date</div>
            <div className="datagrid-content">{formatDatelatest(company.bookingDate)}</div>
          </div>)}

          {(company.bookingSource || company.bookingSource === " ") && (<div className="datagrid-item bookingSource">
            <div className="datagrid-title">Booking Source</div>
            <div className="datagrid-content">{company.bookingSource}</div>
          </div>)}

          {(company.bookingtime|| company.bookingtime === " ") && (<div className="datagrid-item bookingTime">
            <div className="datagrid-title">Booking Time</div>
            <div className="datagrid-content">{company.bookingtime}</div>
          </div>)}
        
          {(company.cPANorGSTnum || company.cPANorGSTnum === " ") && (<div className="datagrid-item cPANorGSTnum">
            <div className="datagrid-title">CA PAN or GST</div>
            <div className="datagrid-content">{company.cPANorGSTnum}</div>
          </div>)}

          {(company.caCase || company.caCase === " ") && (<div className="datagrid-item caCase">
            <div className="datagrid-title">CA Case</div>
            <div className="datagrid-content">{company.caCase}</div>
          </div>)}

          {(company.caCommission || company.caCommission === " ") && (<div className="datagrid-item caComission">
            <div className="datagrid-title">CA Commision</div>
            <div className="datagrid-content">{company.caCommission}</div>
          </div>)}

          {(company.caEmail || company.caEmail === " ") && (<div className="datagrid-item caEmail">
            <div className="datagrid-title">CA Email</div>
            <div className="datagrid-content">{company.caEmail}</div>
          </div>)}

          {(company.caNumber || company.caNumber === " ") && (<div className="datagrid-item caNumber">
            <div className="datagrid-title">CA Number</div>
            <div className="datagrid-content">{company.caNumber}</div>
          </div>)}

          {(company.companyName || company.companyName === " ") && (<div className="datagrid-item companyName">
            <div className="datagrid-title">Company Name</div>
            <div className="datagrid-content">{company.companyName}</div>
          </div>)}


          {(company.companyEmail || company.companyEmail === " ") && (<div className="datagrid-item companyEmail">
            <div className="datagrid-title">Company Email</div>
            <div className="datagrid-content">{company.companyEmail}</div>
          </div>)}

          
          {(company.contactNumber|| company.contactNumber === " ") && (<div className="datagrid-item contactNumber">
            <div className="datagrid-title">Company contact</div>
            <div className="datagrid-content">{company.contactNumber}</div>
          </div>)}

          {(company.extraNotes|| company.extraNotes === " ") && (<div className="datagrid-item extraNotes">
            <div className="datagrid-title">Extra Notes</div>
            <div className="datagrid-content">{company.extraNotes}</div>
          </div>)}

          {(company.firstPayment|| company.firstPayment === " ") && (<div className="datagrid-item firstPayment">
            <div className="datagrid-title">First Payment</div>
            <div className="datagrid-content">{company.firstPayment}</div>
          </div>)}

          {(company.fourthPayment|| company.fourthPayment === " ") && (<div className="datagrid-item fourthPayment">
            <div className="datagrid-title">Fourth Payment</div>
            <div className="datagrid-content">{company.fourthPayment}</div>
          </div>)}

          {(company.incoDate|| company.incoDate === " ") && (<div className="datagrid-item incoDate">
            <div className="datagrid-title">Inco Date</div>
            <div className="datagrid-content">{formatDatelatest(company.incoDate)}</div>
          </div>)}

          {(company.originalTotalPayment || company.originalTotalPayment === " ") && (<div className="datagrid-item originalTotalPayment">
            <div className="datagrid-title">Original Total Payment</div>
            <div className="datagrid-content">{company.originalTotalPayment}</div>
          </div>)}

          {(company.otherDocs || company.otherDocs === " ") && (<div className="datagrid-item otherDocs">
            <div className="datagrid-title">Other Documents</div>
            <div className="datagrid-content">{company.otherDocs}</div>
          </div>)}
 
          {(company.paymentMethod || company.paymentMethod === " ") && (<div className="datagrid-item paymentMethod">
            <div className="datagrid-title">Payment Method</div>
            <div className="datagrid-content">{company.paymentMethod}</div>
          </div>)}


          {(company.paymentReceipt || company.paymentReceipt === " ") && (<div className="datagrid-item paymentReciept">
            <div className="datagrid-title">Payment Reciept</div>
            <div className="datagrid-content">{company.paymentReceipt}</div>
          </div>)}

          {(company.paymentRemarks || company.paymentRemarks === " ") && (<div className="datagrid-item paymentRemarks">
            <div className="datagrid-title">Payment Remarks</div>
            <div className="datagrid-content">{company.paymentRemarks}</div>
          </div>)}

          {(company.paymentTerms || company.paymentTerms === " ") && (<div className="datagrid-item paymentTerms">
            <div className="datagrid-title">Payment Terms</div>
            <div className="datagrid-content">{company.paymentTerms}</div>
          </div>)}

          {(company.secondPayment || company.secondPayment === " ") && (<div className="datagrid-item secondPayment">
            <div className="datagrid-title">Payment Second Payment</div>
            <div className="datagrid-content">{company.secondPayment}</div>
          </div>)}

          
          {(company.services || company.services === " ") && (<div className="datagrid-item services">
            <div className="datagrid-title">Services</div>
            <div className="datagrid-content">{company.services}</div>
          </div>)}

         
          {(company.supportedBy || company.supportedBy === " ") && (<div className="datagrid-item supportedBy">
            <div className="datagrid-title">Supported By</div>
            <div className="datagrid-content">{company.supportedBy}</div>
          </div>)}
 
          {(company.thirdPayment || company.thirdPayment === " ") && ( <div className="datagrid-item thirdPayment">
            <div className="datagrid-title">Third Payment</div>
            <div className="datagrid-content">{company.thirdPayment}</div>
          </div>)}

          {(company.totalPayment || company.totalPayment === " ") && ( <div className="datagrid-item totalPayment">
            <div className="datagrid-title">Total Payment</div>
            <div className="datagrid-content">{company.totalPayment}</div>
          </div>)}

          <div className="datagrid-item">
            <div className="datagrid-title">Actions</div>
            <div className="datagrid-content">
              <button className="btn btn-primary" onClick={handleViewPdf}>
                View PDF
              </button>
            </div>
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;*/

// import React, { useState } from "react";
// import './style_processing/main_processing.css';
// import DeleteIcon from "@mui/icons-material/Delete";
// import Swal from 'sweetalert2';
// import {
//   Button,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
// } from "@mui/material";

// function CompanyList({ companies, onCompanyClick }) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [companyClasses, setCompanyClasses] = useState({});
//   const [searchDate, setSearchDate] = useState("");
//   const [companyData, setcompanyData] = useState(companies);
//   const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });


//   const formatDatelatest = (inputDate) => {
//     const date = new Date(inputDate);
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Note: Month is zero-based
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };
//   const handleCompanyClick = (company) => {
//     setCompanyClasses(prevClasses => ({
//       [company]: "list-group-item list-group-item-action active"
//     }));
//     onCompanyClick(company);
//   };

//   console.log(companies)

//   const FilteredData = !dateRange.startDate && !dateRange.endDate ?
//     companies.filter(obj => obj.companyName.toLowerCase().includes(searchTerm.toLowerCase())) :
//     companies.filter(obj => {
//       const companyNameMatch = obj.companyName.toLowerCase().includes(searchTerm.toLowerCase());
//       const dateMatch = dateRange.startDate && dateRange.endDate ?
//         new Date(obj.bookingDate) >= new Date(dateRange.startDate) &&
//         new Date(obj.bookingDate) <= new Date(dateRange.endDate) :
//         true;

//       return companyNameMatch && dateMatch;
//     });

//     const secretKey = process.env.REACT_APP_SECRET_KEY;



// const handleDelete = (companyId, companyName) => {
//   const ename = localStorage.getItem("username");

//   // Show a SweetAlert confirmation dialog to the user
//   Swal.fire({
//     title: `Are you sure you want to request deletion for ${companyName}?`,
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonColor: '#3085d6',
//     cancelButtonColor: '#d33',
//     confirmButtonText: 'Yes, request deletion!'
//   }).then((result) => {
//     // Proceed with delete request only if the user confirms
//     if (result.isConfirmed) {
//       const date = new Date().toLocaleDateString();
//       const time = new Date().toLocaleTimeString();
//       const deleteRequestData = {
//         companyName,
//         companyId,
//         time,
//         date,
//         request: false, 
//         ename// You can customize this field as needed
//       };

//       // Make a request to store the delete request details
//       fetch(`${secretKey}/deleterequestbybde`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           // Add any additional headers if needed
//         },
//         body: JSON.stringify(deleteRequestData),
//       })
//         .then(response => {
//           if (response.ok) {
//             // Successfully stored delete request details
//             Swal.fire(
//               'Success!',
//               'Delete request details stored successfully',
//               'success'
//             );
//             // You can perform any additional actions here
//           } else {
//             // Handle error if storing delete request details fails
//             Swal.fire(
//               'Error!',
//               'Failed to store delete request details',
//               'error'
//             );
//           }
//         })
//         .catch(error => {
//           console.error('Error during delete request:', error);
//         });
//     }
//   });
// };



//   return (

//     <div className="card">
//       <div className="card-header search-date-header">
//         <div className="input-icon w-100">
//           <span className="input-icon-addon">
//             <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path><path d="M21 21l-6 -6"></path></svg>
//           </span>
//           <input type="text" value={searchTerm} className="form-control" placeholder="Search…" aria-label="Search in website" onChange={(e) => setSearchTerm(e.target.value)} />
//         </div>
//         <div className="input-icon d-flex align-items-center justify-content-between w-100 mt-2">
//           <div>
//             <input
//               type="date"
//               value={dateRange.startDate}
//               className="form-control"
//               onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
//             />
//           </div>
//           <div>
//             <span className="date-range-separator">to</span>
//           </div>
//           <div>
//             <input
//               type="date"
//               value={dateRange.endDate}
//               className="form-control"
//               onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
//             />
//           </div>
//         </div>
//       </div>
//       <div className="list-group list-group-flush list-group-hoverable cmpy-list-body">
//         {FilteredData.map((company, index) => (
//           <div className={companyClasses[company.companyName] || "list-group-item list-group-item-action"} key={index}>
//             <div className="align-items-center" onClick={() => handleCompanyClick(company.companyName)}>
//               <div className="p-booking-Cname d-flex align-items-center">
//                 <h4 className="m-0" title={company.companyName}>
//                   {company.companyName}
//                 </h4>
//                 <IconButton onClick={() => handleDelete(company._id , company.companyName)}>
//                   <DeleteIcon
//                     style={{
//                       width: "16px",
//                       height: "16px",
//                       color: "#bf0b0b",
//                     }}
//                   >
//                     Delete
//                   </DeleteIcon>
//                 </IconButton>
//               </div>
//               <div className="d-flex justify-content-between aligns-items-center mt-1">
//                 <div className="time">
//                   <label className="m-0">{company.bookingTime && (
//                     <p className="m-0">{company.bookingTime}</p>)}</label>
//                 </div>
//                 <div className="bookingdate">
//                   <label className="m-0">
//                     {company.bookingDate && (
//                       <p className="m-0">{formatDatelatest(company.bookingDate)}</p>
//                     )}
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default CompanyList;

// import React, { useState } from "react";
// import './style_processing/main_processing.css';
// import DeleteIcon from "@mui/icons-material/Delete";
// import axios from "axios";
// import Swal from 'sweetalert2';
// import {
//   IconButton,
// } from "@mui/material";

// function CompanyList({ companies, onCompanyClick }) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedField, setSelectedField] = useState("companyName");
//   const [companyClasses, setCompanyClasses] = useState({});
//   const [searchDisplay, setSearchDisplay] = useState(true); // State to manage the search field display
//   const [dateRangeDisplay, setDateRangeDisplay] = useState(false); // State to manage the date range field display
//   const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

//   const formatDatelatest = (inputDate) => {
//     const date = new Date(inputDate);
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };


//   const handleCompanyClick = (company , companyId) => {

//     setCompanyClasses(prevClasses => ({
//       [company]: "list-group-item list-group-item-action active"
//     }));
//     onCompanyClick(company);


//   // Make a PUT request to mark the company as read
//   axios.put(`${secretKey}/read/${company}`)
//     .then((response) => {
//       // Handle success if needed
//       console.log('Company marked as read:', response.data);

//       // Update the local state or trigger any necessary UI updates
//       // ...
//     })
//     .catch((error) => {
//       // Handle error if needed
//       console.error('Error marking company as read:', error);
//     });
// };


// const handleFieldChange = (value) => {
//   setSelectedField(value);
//   if (value === 'companyName' || value === "bdeName" || value === "services") {
//     setSearchDisplay(true);
//     setDateRangeDisplay(false);
//   } else if (value === 'bookingDate') {
//     setSearchDisplay(true);
//     setDateRangeDisplay(true);
//   } else {
//     setSearchDisplay(false);
//     setDateRangeDisplay(false);
//   }
// };

// const FilteredData = companies.filter((company) => {
//   const fieldValue = company[selectedField];
//   const searchTermLower = searchTerm.toLowerCase();

//   if (selectedField === "companyName" || selectedField === "bdeName" || selectedField === "services") {
//     let fieldValueLower = '';
//     if (selectedField === "services") {
//       fieldValueLower = Array.isArray(fieldValue) ? fieldValue.map(service => service.trim().toLowerCase()) : [];
//     } else {
//       fieldValueLower = typeof fieldValue === 'string' ? fieldValue.toLowerCase() : '';
//     }
//     if (Array.isArray(fieldValueLower)) {
//       return fieldValueLower.some(service => service.includes(searchTermLower));
//     } else {
//       return fieldValueLower.includes(searchTermLower);
//     }
//   } else if (selectedField === "bookingDate") {
//     const dateMatch = dateRange.startDate && dateRange.endDate ?
//       new Date(company.bookingDate) >= new Date(dateRange.startDate) &&
//       new Date(company.bookingDate) <= new Date(dateRange.endDate) :
//       true;
//     return dateMatch && fieldValue; // Include dateMatch along with fieldValue
//   }
//   return true;
// });

// const secretKey = process.env.REACT_APP_SECRET_KEY;



// const handleDelete = (companyId, companyName) => {
//   const ename = localStorage.getItem("username");

//   Swal.fire({
//     title: `Are you sure you want to request deletion for ${companyName}?`,
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonColor: '#3085d6',
//     cancelButtonColor: '#d33',
//     confirmButtonText: 'Yes, request deletion!'
//   }).then((result) => {
//     if (result.isConfirmed) {
//       const date = new Date().toLocaleDateString();
//       const time = new Date().toLocaleTimeString();
//       const deleteRequestData = {
//         companyName,
//         companyId,
//         time,
//         date,
//         request: false,
//         ename
//       };

//       fetch(`${secretKey}/deleterequestbybde`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(deleteRequestData),
//       })
//         .then(response => {
//           if (response.ok) {
//             Swal.fire(
//               'Success!',
//               'Delete request details stored successfully',
//               'success'
//             );
//           } else {
//             Swal.fire(
//               'Error!',
//               'Failed to store delete request details',
//               'error'
//             );
//           }
//         })
//         .catch(error => {
//           console.error('Error during delete request:', error);
//         });
//     }
//   });
// };

// return (
//   <div className="card">
//     <div className="card-header search-date-header">
//       <div className="d-flex justify-content-between align-items-center searchfields gap-5 w-100">
//         <div className="input-icon d-flex align-items-center justify-content-start w-100">
//           <select className="form-select"
//             value={selectedField}
//             onChange={(e) => handleFieldChange(e.target.value)}
//           >
//             <option value="companyName">Company Name</option>
//             <option value="bdeName">Bde Name</option>
//             <option value="services">Services</option>
//             <option value="bookingDate">Booking Date</option>
//           </select>
//         </div>
//         {searchDisplay && (
//           <div className="input-icon w-100 d-flex align-items-center justify-content-between">
//             <span className="input-icon-addon">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="icon"
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 strokeWidth="2"
//                 stroke="currentColor"
//                 fill="none"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
//                 <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
//                 <path d="M21 21l-6 -6"></path>
//               </svg>
//             </span>
//             <input
//               type="text"
//               value={searchTerm}
//               className="form-control"
//               placeholder="Search…"
//               aria-label="Search in website"
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         )}
//       </div>

//       {dateRangeDisplay && (<div className="input-icon d-flex align-items-center justify-content-between w-100 mt-2">
//         <div>
//           <input
//             type="date"
//             value={dateRange.startDate}
//             className="form-control"
//             onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
//           />
//         </div>
//         <div>
//           <span className="date-range-separator">to</span>
//         </div>
//         <div>
//           <input
//             type="date"
//             value={dateRange.endDate}
//             className="form-control"
//             onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
//           />
//         </div>
//       </div>)}
//     </div>

//     <div className="list-group list-group-flush list-group-hoverable cmpy-list-body cursor-pointer">
//       {FilteredData.map((company, index) => (
//         <div
//           className={`${companyClasses[company.companyName] || "list-group-item list-group-item-action"}`}
//           key={index}
//           style={{ 
//             backgroundColor: company.read === false && "rgb(237 238 249)",
//             boxShadow:company.read === false && "1px 1px 1px grey" , 
//             fontWeight:company.read === false && "700 !important" , 
//             fontFamily:company.red === false && "Merriweather, serif"

//           }}
//         >
//           <div className="align-items-center" onClick={() => handleCompanyClick(company.companyName , company._id)} >
//             <div className="p-booking-Cname d-flex align-items-center" >
//               <h4 className="m-0" title={company.companyName}>
//                 {company.companyName}
//               </h4>
//               <IconButton onClick={() => handleDelete(company._id, company.companyName)}>
//                 <DeleteIcon
//                   style={{
//                     width: "16px",
//                     height: "16px",
//                     color: "#bf0b0b",
//                   }}
//                 >
//                   Delete
//                 </DeleteIcon>
//               </IconButton>
//             </div>
//             <div className="d-flex justify-content-between aligns-items-center mt-1">
//               <div className="time">
//                 <label className="m-0">{company.bookingTime && (
//                   <p className="m-0">{company.bookingTime}</p>)}</label>
//               </div>
//               <div className="bookingdate">
//                 <label className="m-0">
//                   {company.bookingDate && (
//                     <p className="m-0">{formatDatelatest(company.bookingDate)}</p>
//                   )}
//                 </label>
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// );
// }

// export default CompanyList;



// import React, { useState, useEffect } from "react";
// import './style_processing/main_processing.css';
// import DeleteIcon from "@mui/icons-material/Delete";
// import axios from "axios";
// import Swal from 'sweetalert2';
// import {
//   IconButton,
// } from "@mui/material";

// function CompanyList({ companies, onCompanyClick }) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedField, setSelectedField] = useState("companyName");
//   const [companyClasses, setCompanyClasses] = useState({});
//   const [searchDisplay, setSearchDisplay] = useState(true); // State to manage the search field display
//   const [dateRangeDisplay, setDateRangeDisplay] = useState(false); // State to manage the date range field display
//   const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });


//   const formatDatelatest = (inputDate) => {
//     const date = new Date(inputDate);
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };


//   const handleCompanyClick = (company, companyId) => {

//     setCompanyClasses(prevClasses => ({
//       [company]: "list-group-item list-group-item-action active"
//     }));
//     onCompanyClick(company);


//     // Make a PUT request to mark the company as read
//     axios.put(`${secretKey}/read/${company}`)
//       .then((response) => {
//         // Handle success if needed
//         console.log('Company marked as read:', response.data);

//         // Update the local state or trigger any necessary UI updates
//         // ...
//       })
//       .catch((error) => {
//         // Handle error if needed
//         console.error('Error marking company as read:', error);
//       });
//   };


//   const handleFieldChange = (value) => {
//     setSelectedField(value);
//     if (value === 'companyName' || value === "bdeName" || value === "services") {
//       setSearchDisplay(true);
//       setDateRangeDisplay(false);
//     } else if (value === 'bookingDate') {
//       setSearchDisplay(true);
//       setDateRangeDisplay(true);
//     } else {
//       setSearchDisplay(false);
//       setDateRangeDisplay(false);
//     }
//   };

//   const FilteredData = companies.filter((company) => {
//     const fieldValue = company[selectedField];
//     const searchTermLower = searchTerm.toLowerCase();

//     if (selectedField === "companyName" || selectedField === "bdeName" || selectedField === "services") {
//       let fieldValueLower = '';
//       if (selectedField === "services") {
//         fieldValueLower = Array.isArray(fieldValue) ? fieldValue.map(service => service.trim().toLowerCase()) : [];
//       } else {
//         fieldValueLower = typeof fieldValue === 'string' ? fieldValue.toLowerCase() : '';
//       }
//       if (Array.isArray(fieldValueLower)) {
//         return fieldValueLower.some(service => service.includes(searchTermLower));
//       } else {
//         return fieldValueLower.includes(searchTermLower);
//       }
//     } else if (selectedField === "bookingDate") {
//       const dateMatch = dateRange.startDate && dateRange.endDate ?
//         new Date(company.bookingDate) >= new Date(dateRange.startDate) &&
//         new Date(company.bookingDate) <= new Date(dateRange.endDate) :
//         true;
//       return dateMatch && fieldValue; // Include dateMatch along with fieldValue
//     }
//     return true;
//   });

//   const secretKey = process.env.REACT_APP_SECRET_KEY;



//   const handleDelete = (companyId, companyName) => {
//     const ename = localStorage.getItem("username");

//     Swal.fire({
//       title: `Are you sure you want to request deletion for ${companyName}?`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, request deletion!'
//     }).then((result) => {
//       if (result.isConfirmed) {
//         const date = new Date().toLocaleDateString();
//         const time = new Date().toLocaleTimeString();
//         const deleteRequestData = {
//           companyName,
//           companyId,
//           time,
//           date,
//           request: false,
//           ename
//         };

//         fetch(`${secretKey}/deleterequestbybde`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(deleteRequestData),
//         })
//           .then(response => {
//             if (response.ok) {
//               Swal.fire(
//                 'Success!',
//                 'Delete request details stored successfully',
//                 'success'
//               );
//             } else {
//               Swal.fire(
//                 'Error!',
//                 'Failed to store delete request details',
//                 'error'
//               );
//             }
//           })
//           .catch(error => {
//             console.error('Error during delete request:', error);
//           });
//       }
//     });
//   };

//   return (
//     <div className="card">
//       <div className="card-header search-date-header">
//         <div className="d-flex justify-content-between align-items-center searchfields gap-5 w-100">
//           <div className="input-icon d-flex align-items-center justify-content-start w-100">
//             <select className="form-select"
//               value={selectedField}
//               onChange={(e) => handleFieldChange(e.target.value)}
//             >
//               <option value="companyName">Company Name</option>
//               <option value="bdeName">Bde Name</option>
//               <option value="services">Services</option>
//               <option value="bookingDate">Booking Date</option>
//             </select>
//           </div>
//           {searchDisplay && (
//             <div className="input-icon w-100 d-flex align-items-center justify-content-between">
//               <span className="input-icon-addon">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="icon"
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   strokeWidth="2"
//                   stroke="currentColor"
//                   fill="none"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
//                   <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
//                   <path d="M21 21l-6 -6"></path>
//                 </svg>
//               </span>
//               <input
//                 type="text"
//                 value={searchTerm}
//                 className="form-control"
//                 placeholder="Search…"
//                 aria-label="Search in website"
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           )}
//         </div>

//         {dateRangeDisplay && (<div className="input-icon d-flex align-items-center justify-content-between w-100 mt-2">
//           <div>
//             <input
//               type="date"
//               value={dateRange.startDate}
//               className="form-control"
//               onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
//             />
//           </div>
//           <div>
//             <span className="date-range-separator">to</span>
//           </div>
//           <div>
//             <input
//               type="date"
//               value={dateRange.endDate}
//               className="form-control"
//               onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
//             />
//           </div>
//         </div>)}
//       </div>

//       <div className="list-group list-group-flush list-group-hoverable cmpy-list-body cursor-pointer">
//         {FilteredData.map((company, index) => (
//           <div
//             className={`${companyClasses[company.companyName] || "list-group-item list-group-item-action"}`}
//             key={index}
//             style={{
//               backgroundColor: company.read === false && "rgb(237 238 249)",
//               boxShadow: company.read === false && "1px 1px 1px grey",
//               fontWeight: company.read === false && "700 !important",
//               fontFamily: company.red === false && "Merriweather, serif"

//             }}
//           >
//             <div className="align-items-center" onClick={() => handleCompanyClick(company.companyName, company._id)} >
//               <div className="p-booking-Cname d-flex align-items-center" >
//                 <h4 className="m-0" title={company.companyName}>
//                   {company.companyName}
//                 </h4>
//                 <IconButton onClick={() => handleDelete(company._id, company.companyName)}>
//                   <DeleteIcon
//                     style={{
//                       width: "16px",
//                       height: "16px",
//                       color: "#bf0b0b",
//                     }}
//                   >
//                     Delete
//                   </DeleteIcon>
//                 </IconButton>
//               </div>
//               <div className="d-flex justify-content-between aligns-items-center mt-1">
//                 <div className="time">
//                   <label className="m-0">{company.bookingTime && (
//                     <p className="m-0">{company.bookingTime}</p>)}</label>
//                 </div>
//                 <div className="bookingdate">
//                   <label className="m-0">
//                     {company.bookingDate && (
//                       <p className="m-0">{formatDatelatest(company.bookingDate)}</p>
//                     )}
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default CompanyList;

// import React, { useState, useEffect } from "react";
// import './style_processing/main_processing.css';
// import DeleteIcon from "@mui/icons-material/Delete";
// import axios from "axios";
// import Swal from 'sweetalert2';
// import {
//   IconButton,
// } from "@mui/material";
// import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// function CompanyList({ companies, onCompanyClick }) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedField, setSelectedField] = useState("companyName");
//   const [companyClasses, setCompanyClasses] = useState({});
//   const [searchDisplay, setSearchDisplay] = useState(true);
//   const [dateRangeDisplay, setDateRangeDisplay] = useState(false);
//   const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [perPage] = useState(10);

//   const formatDatelatest = (inputDate) => {
//     const date = new Date(inputDate);
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   const handleCompanyClick = (company, companyId) => {
//     setCompanyClasses(prevClasses => ({
//       [company]: "list-group-item list-group-item-action active"
//     }));
//     console.log(company)
//     onCompanyClick(company);
//     // Make a PUT request to mark the company as read
//     axios.put(`${secretKey}/read/${company}`)
//       .then((response) => {
//         console.log('Company marked as read:', response.data);
//       })
//       .catch((error) => {
//         console.error('Error marking company as read:', error);
//       });
//   };

//   const handleFieldChange = (value) => {
//     setSelectedField(value);
//     if (value === 'companyName' || value === "bdeName" || value === "services") {
//       setSearchDisplay(true);
//       setDateRangeDisplay(false);
//     } else if (value === 'bookingDate') {
//       setSearchDisplay(true);
//       setDateRangeDisplay(true);
//     } else {
//       setSearchDisplay(false);
//       setDateRangeDisplay(false);
//     }
//   };

//   const FilteredData = companies.filter((company) => {
//     const fieldValue = company[selectedField];
//     const searchTermLower = searchTerm.toLowerCase();

//     if (selectedField === "companyName" || selectedField === "bdeName" || selectedField === "services") {
//       let fieldValueLower = '';
//       if (selectedField === "services") {
//         fieldValueLower = Array.isArray(fieldValue) ? fieldValue.map(service => service.trim().toLowerCase()) : [];
//       } else {
//         fieldValueLower = typeof fieldValue === 'string' ? fieldValue.toLowerCase() : '';
//       }
//       if (Array.isArray(fieldValueLower)) {
//         return fieldValueLower.some(service => service.includes(searchTermLower));
//       } else {
//         return fieldValueLower.includes(searchTermLower);
//       }
//     } else if (selectedField === "bookingDate") {
//       const dateMatch = dateRange.startDate && dateRange.endDate ?
//         new Date(company.bookingDate) >= new Date(dateRange.startDate) &&
//         new Date(company.bookingDate) <= new Date(dateRange.endDate) :
//         true;
//       return dateMatch && fieldValue;
//     }
//     return true;
//   });

//   const secretKey = process.env.REACT_APP_SECRET_KEY;

//   const handleDelete = (companyId, companyName) => {
//     const ename = localStorage.getItem("username");

//     Swal.fire({
//       title: `Are you sure you want to request deletion for ${companyName}?`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, request deletion!'
//     }).then((result) => {
//       if (result.isConfirmed) {
//         const date = new Date().toLocaleDateString();
//         const time = new Date().toLocaleTimeString();
//         const deleteRequestData = {
//           companyName,
//           companyId,
//           time,
//           date,
//           request: false,
//           ename
//         };

//         fetch(`${secretKey}/deleterequestbybde`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(deleteRequestData),
//         })
//           .then(response => {
//             if (response.ok) {
//               Swal.fire(
//                 'Success!',
//                 'Delete request details stored successfully',
//                 'success'
//               );
//             } else {
//               Swal.fire(
//                 'Error!',
//                 'Failed to store delete request details',
//                 'error'
//               );
//             }
//           })
//           .catch(error => {
//             console.error('Error during delete request:', error);
//           });
//       }
//     });
//   };

//   // Calculate index of the last company on the current page
//   const indexOfLastCompany = currentPage * perPage;
//   // Calculate index of the first company on the current page
//   const indexOfFirstCompany = indexOfLastCompany - perPage;
//   // Slice the companies array to get the companies for the current page
//   const currentCompanies = FilteredData.slice(indexOfFirstCompany, indexOfLastCompany);

//   // Change page
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   return (
//     <div className="card">
//       <div className="card-header search-date-header">
//         <div className="d-flex justify-content-between align-items-center searchfields gap-5 w-100">
//           <div className="input-icon d-flex align-items-center justify-content-start w-100">
//             <select className="form-select"
//               value={selectedField}
//               onChange={(e) => handleFieldChange(e.target.value)}
//             >
//               <option value="companyName">Company Name</option>
//               <option value="bdeName">Bde Name</option>
//               <option value="services">Services</option>
//               <option value="bookingDate">Booking Date</option>
//             </select>
//           </div>
//           {searchDisplay && (
//             <div className="input-icon w-100 d-flex align-items-center justify-content-between">
//               <span className="input-icon-addon">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="icon"
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   strokeWidth="2"
//                   stroke="currentColor"
//                   fill="none"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
//                   <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
//                   <path d="M21 21l-6 -6"></path>
//                 </svg>
//               </span>
//               <input
//                 type="text"
//                 value={searchTerm}
//                 className="form-control"
//                 placeholder="Search…"
//                 aria-label="Search in website"
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           )}
//         </div>

//         {dateRangeDisplay && (<div className="input-icon d-flex align-items-center justify-content-between w-100 mt-2">
//           <div>
//             <input
//               type="date"
//               value={dateRange.startDate}
//               className="form-control"
//               onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
//             />
//           </div>
//           <div>
//             <span className="date-range-separator">to</span>
//           </div>
//           <div>
//             <input
//               type="date"
//               value={dateRange.endDate}
//               className="form-control"
//               onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
//             />
//           </div>
//         </div>)}
//       </div>

//       <div className="list-group list-group-flush list-group-hoverable cmpy-list-body cursor-pointer">
//         {currentCompanies.map((company, index) => (
//           <div
//             className={`${companyClasses[company.companyName] || "list-group-item list-group-item-action"}`}
//             key={index}
//             style={{
//               backgroundColor: company.read === false && "rgb(237 238 249)",
//               boxShadow: company.read === false && "1px 1px 1px grey",
//               fontWeight: company.read === false && "700 !important",
//               fontFamily: company.red === false && "Merriweather, serif"
//             }}
//           >
//             <div className="align-items-center" onClick={() => handleCompanyClick(company.companyName, company._id)} >
//               <div className="p-booking-Cname d-flex align-items-center" >
//                 <h4 className="m-0" title={company.companyName}>
//                   {company.companyName}
//                 </h4>
//                 <IconButton onClick={() => handleDelete(company._id, company.companyName)}>
//                   <DeleteIcon
//                     style={{
//                       width: "16px",
//                       height: "16px",
//                       color: "#bf0b0b",
//                     }}
//                   >
//                     Delete
//                   </DeleteIcon>
//                 </IconButton>
//               </div>
//               <div className="d-flex justify-content-between aligns-items-center mt-1">
//                 <div className="time">
//                   <label className="m-0">{company.bookingTime && (
//                     <p className="m-0">{company.bookingTime}</p>)}</label>
//                 </div>
//                 <div className="bookingdate">
//                   <label className="m-0">
//                     {company.bookingDate && (
//                       <p className="m-0">{formatDatelatest(company.bookingDate)}</p>
//                     )}
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//       {/* Pagination */}
//       <nav className="d-flex align-items-center justify-content-center mt-2">
//         <ul className="pagination">
//           <li className="page-item">
//             <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="page-link">
//               <FaArrowLeft />
//             </button>
//           </li>
//           {Array.from({ length: Math.ceil(FilteredData.length / perPage) }).map((_, index) => {
//             if (index + 1 === currentPage || index + 2 === currentPage || index + 3 === currentPage || index === currentPage) {
//               return (
//                 <li key={index} className="page-item ml-1">
//                   <button onClick={() => paginate(index + 1)} className={`page-link ${currentPage === index + 1 ? 'active' : ''}`} style={{
//                     backgroundColor: currentPage === index + 1 ? '#ffb900' : 'transparent',
//                     borderColor: currentPage === index + 1 ? '#ffb900' : 'transparent',
//                   }}>
//                     {index + 1}
//                   </button>
//                 </li>
//               );
//             } else if (index === currentPage - 4 || index === currentPage + 2) {
//               return <li key={index} className="li-ellipsis">...</li>;
//             }
//             return null;
//           })}
//           <li className="page-item">
//             <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(FilteredData.length / perPage)} className="page-link">
//               <FaArrowRight />
//             </button>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// }

// export default CompanyList;


// import React, { useState, useEffect } from "react";
// import './style_processing/main_processing.css';
// import DeleteIcon from "@mui/icons-material/Delete";
// import axios from "axios";
// import Swal from 'sweetalert2';
// import {
//   IconButton,
// } from "@mui/material";
// import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// function CompanyList({ companies, onCompanyClick }) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedField, setSelectedField] = useState("companyName");
//   const [companyClasses, setCompanyClasses] = useState({});
//   const [searchDisplay, setSearchDisplay] = useState(true);
//   const [dateRangeDisplay, setDateRangeDisplay] = useState(false);
//   const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [perPage] = useState(10);

//   const formatDatelatest = (inputDate) => {
//     const date = new Date(inputDate);
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   const handleCompanyClick = (company, companyId) => {
//     setCompanyClasses(prevClasses => ({
//       [company]: "list-group-item list-group-item-action active"
//     }));
//     console.log(company)
//     onCompanyClick(company);
//     // Make a PUT request to mark the company as read
//     axios.put(`${secretKey}/read/${company}`)
//       .then((response) => {
//         console.log('Company marked as read:', response.data);
//       })
//       .catch((error) => {
//         console.error('Error marking company as read:', error);
//       });
//   };

//   const handleFieldChange = (value) => {
//     setSelectedField(value);
//     if (value === 'companyName' || value === "bdeName" || value === "services") {
//       setSearchDisplay(true);
//       setDateRangeDisplay(false);
//     } else if (value === 'bookingDate') {
//       setSearchDisplay(true);
//       setDateRangeDisplay(true);
//     } else {
//       setSearchDisplay(false);
//       setDateRangeDisplay(false);
//     }
//   };

//   const FilteredData = companies.filter((company) => {
//     const fieldValue = company[selectedField];
//     const searchTermLower = searchTerm.toLowerCase();

//     if (selectedField === "companyName" || selectedField === "bdeName" || selectedField === "services") {
//       let fieldValueLower = '';
//       if (selectedField === "services") {
//         fieldValueLower = Array.isArray(fieldValue) ? fieldValue.map(service => service.trim().toLowerCase()) : [];
//       } else {
//         fieldValueLower = typeof fieldValue === 'string' ? fieldValue.toLowerCase() : '';
//       }
//       if (Array.isArray(fieldValueLower)) {
//         return fieldValueLower.some(service => service.includes(searchTermLower));
//       } else {
//         return fieldValueLower.includes(searchTermLower);
//       }
//     } else if (selectedField === "bookingDate") {
//       const dateMatch = dateRange.startDate && dateRange.endDate ?
//         new Date(company.bookingDate) >= new Date(dateRange.startDate) &&
//         new Date(company.bookingDate) <= new Date(dateRange.endDate) :
//         true;
//       return dateMatch && fieldValue;
//     }
//     return true;
//   });

//   const secretKey = process.env.REACT_APP_SECRET_KEY;

//   const handleDelete = (companyId, companyName) => {
//     const ename = localStorage.getItem("username");

//     Swal.fire({
//       title: `Are you sure you want to request deletion for ${companyName}?`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, request deletion!'
//     }).then((result) => {
//       if (result.isConfirmed) {
//         const date = new Date().toLocaleDateString();
//         const time = new Date().toLocaleTimeString();
//         const deleteRequestData = {
//           companyName,
//           companyId,
//           time,
//           date,
//           request: false,
//           ename
//         };

//         fetch(`${secretKey}/deleterequestbybde`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(deleteRequestData),
//         })
//           .then(response => {
//             if (response.ok) {
//               Swal.fire(
//                 'Success!',
//                 'Delete request details stored successfully',
//                 'success'
//               );
//             } else {
//               Swal.fire(
//                 'Error!',
//                 'Failed to store delete request details',
//                 'error'
//               );
//             }
//           })
//           .catch(error => {
//             console.error('Error during delete request:', error);
//           });
//       }
//     });
//   };

//   // Calculate index of the last company on the current page
//   const indexOfLastCompany = currentPage * perPage;
//   // Calculate index of the first company on the current page
//   const indexOfFirstCompany = indexOfLastCompany - perPage;
//   // Slice the companies array to get the companies for the current page
//   const currentCompanies = FilteredData.slice(indexOfFirstCompany, indexOfLastCompany);

//   // Change page
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   return (
//     <div className="card">
//       <div className="card-header search-date-header">
//         <div className="d-flex justify-content-between align-items-center searchfields gap-5 w-100">
//           <div className="input-icon d-flex align-items-center justify-content-start w-100">
//             <select className="form-select"
//               value={selectedField}
//               onChange={(e) => handleFieldChange(e.target.value)}
//             >
//               <option value="companyName">Company Name</option>
//               <option value="bdeName">Bde Name</option>
//               <option value="services">Services</option>
//               <option value="bookingDate">Booking Date</option>
//             </select>
//           </div>
//           {searchDisplay && (
//             <div className="input-icon w-100 d-flex align-items-center justify-content-between">
//               <span className="input-icon-addon">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="icon"
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   strokeWidth="2"
//                   stroke="currentColor"
//                   fill="none"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
//                   <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
//                   <path d="M21 21l-6 -6"></path>
//                 </svg>
//               </span>
//               <input
//                 type="text"
//                 value={searchTerm}
//                 className="form-control"
//                 placeholder="Search…"
//                 aria-label="Search in website"
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           )}
//         </div>

//         {dateRangeDisplay && (<div className="input-icon d-flex align-items-center justify-content-between w-100 mt-2">
//           <div>
//             <input
//               type="date"
//               value={dateRange.startDate}
//               className="form-control"
//               onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
//             />
//           </div>
//           <div>
//             <span className="date-range-separator">to</span>
//           </div>
//           <div>
//             <input
//               type="date"
//               value={dateRange.endDate}
//               className="form-control"
//               onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
//             />
//           </div>
//         </div>)}
//       </div>

//       <div className="list-group list-group-flush list-group-hoverable cmpy-list-body cursor-pointer">
//         {currentCompanies.map((company, index) => (
//           <div
//             className={`${companyClasses[company.companyName] || "list-group-item list-group-item-action"}`}
//             key={index}
//             style={{
//               backgroundColor: company.read === false && "rgb(237 238 249)",
//               boxShadow: company.read === false && "1px 1px 1px grey",
//               fontWeight: company.read === false && "700 !important",
//               fontFamily: company.red === false && "Merriweather, serif"
//             }}
//           >
//             <div className="align-items-center" onClick={() => handleCompanyClick(company.companyName, company._id)} >
//               <div className="p-booking-Cname d-flex align-items-center" >
//                 <h4 className="m-0" title={company.companyName}>
//                   {company.companyName}
//                 </h4>
//                 <IconButton onClick={() => handleDelete(company._id, company.companyName)}>
//                   <DeleteIcon
//                     style={{
//                       width: "16px",
//                       height: "16px",
//                       color: "#bf0b0b",
//                     }}
//                   >
//                     Delete
//                   </DeleteIcon>
//                 </IconButton>
//               </div>
//               <div className="d-flex justify-content-between aligns-items-center mt-1">
//                 <div className="time">
//                   <label className="m-0">{company.bookingTime && (
//                     <p className="m-0">{company.bookingTime}</p>)}</label>
//                 </div>
//                 <div className="bookingdate">
//                   <label className="m-0">
//                     {company.bookingDate && (
//                       <p className="m-0">{formatDatelatest(company.bookingDate)}</p>
//                     )}
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//       {/* Pagination */}
//       <nav className="d-flex align-items-center justify-content-center mt-2">
//         <ul className="pagination">
//           <li className="page-item">
//             <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="page-link">
//               <FaArrowLeft />
//             </button>
//           </li>
//           {Array.from({ length: Math.ceil(FilteredData.length / perPage) }).map((_, index) => {
//             if (index + 1 === currentPage || index + 2 === currentPage || index + 3 === currentPage || index === currentPage) {
//               return (
//                 <li key={index} className="page-item ml-1">
//                   <button onClick={() => paginate(index + 1)} className={`page-link ${currentPage === index + 1 ? 'active' : ''}`} style={{
//                     backgroundColor: currentPage === index + 1 ? '#ffb900' : 'transparent',
//                     borderColor: currentPage === index + 1 ? '#ffb900' : 'transparent',
//                   }}>
//                     {index + 1}
//                   </button>
//                 </li>
//               );
//             } else if (index === currentPage - 4 || index === currentPage + 2) {
//               return <li key={index} className="li-ellipsis">...</li>;
//             }
//             return null;
//           })}
//           <li className="page-item">
//             <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(FilteredData.length / perPage)} className="page-link">
//               <FaArrowRight />
//             </button>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// }

// export default CompanyList;




// import React, { useState } from "react";
// import './style_processing/main_processing.css'
// import { pdfuploader } from "../documents/pdf1.pdf";
// import Dashboard_processing from "./Dashboard_processing";
// import { Link } from "react-router-dom";
// import { FaRegFilePdf } from "react-icons/fa";
// import pdficon from './PDF-icon-1.png';
// import { MdDownload } from "react-icons/md";
// import { FaRegCopy } from "react-icons/fa";
// import { IoIosCloseCircleOutline } from "react-icons/io";
// import Papa from "papaparse";
// import * as XLSX from "xlsx";
// import Swal from "sweetalert2";
// import CloseIcon from "@mui/icons-material/Close";
// import axios from "axios";
// import PdfViewer from "./PdfViewer";
// import { pdfjs } from 'react-pdf';
// import {
//   Button,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
// } from "@mui/material";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url,
// ).toString();



// const CompanyDetails = ({ company }) => {
//   // const [field, setField] = useState(false)
//   const [isOpen, setIsOpen] = useState(false);
//   const [open, openchange] = useState(false);
//   const [csvdata, setCsvData] = useState([]);
//   const [excelData, setExcelData] = useState([]);

//   const formatDatelatest = (inputDate) => {
//     const date = new Date(inputDate);
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };



//   const secretKey = process.env.REACT_APP_SECRET_KEY;
//   const frontendKey = process.env.REACT_APP_FRONTEND_KEY;


//   // Function to close the popup
//   // const handleClosePopup = () => {
//   //   setIsOpen(false);
//   // };

//   const functionopenpopup = () => {
//     openchange(true);
//   };

//   const closepopup = () => {
//     openchange(false);

//     setCsvData([]);
//   };

//   const handleFileInputChange = (event) => {
//     const file = event.target.files[0];

//     if (
//       file &&
//       file.type ===
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     ) {
//       const reader = new FileReader();

//       reader.onload = (e) => {
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: "array" });

//         // Assuming there's only one sheet in the XLSX file
//         const sheetName = workbook.SheetNames[0];
//         const sheet = workbook.Sheets[sheetName];

//         const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

//         const formattedJsonData = jsonData
//           .slice(1) // Exclude the first row (header)
//           .map((row) => ({
//             "Sr. No": row[0],
//             "bdeName": row[1],
//             "bdeEmail": row[2],
//             "bdmName": row[3],
//             "bdmEmail": row[4], // Assuming the date is in column 'E' (0-based)
//             "bdmType": row[5],
//             "supportedBy": row[6],
//             "bookingDate": formatDateFromExcel(row[7]),
//             "caCase": row[8],
//             "caNumber": row[9],
//             "caEmail": row[10],
//             "caCommission": row[11],
//             "companyName": row[12],
//             "contactNumber": row[13],
//             "companyEmail": row[14],
//             "services": row[15],
//             "originalTotalPayment": row[16],
//             "totalPayment": row[17],
//             "paymentTerms": row[18],
//             "paymentMethod": row[19],
//             "firstPayment": row[20],
//             "secondPayment": row[21],
//             "thirdPayment": row[22],
//             "fourthPayment": row[23],
//             "paymentRemarks": row[24],
//             "paymentReceipt": row[25],
//             "bookingSource": row[26],
//             "cPANorGSTnum": row[27],
//             "incoDate": formatDateFromExcel(row[28]),
//             "extraNotes": row[29],
//             "otherDocs": row[30],
//             "bookingTime": formatTimeFromExcel(row[31]),
//           }));
//           const newFormattedData = formattedJsonData.filter((obj) => {
//             return obj.companyName !== "" && obj.companyName !== null && obj.companyName !== undefined;
//           });
//        setExcelData(newFormattedData)
//        console.log(newFormattedData)
//       };

//       reader.readAsArrayBuffer(file);
//     } else if (file.type === "text/csv") {
//       // CSV file
//       // const parsedCsvData = parseCsv(data);
//       console.log("everything is good")

//     } else {
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: "Something went wrong!",
//         footer: '<a href="#">Why do I have this issue?</a>',
//       });

//       console.error("Please upload a valid XLSX file.");
//     }
//   };

//   const parseCsv = (data) => {
//     // Use a CSV parsing library (e.g., Papaparse) to parse CSV data
//     // Example using Papaparse:
//     const parsedData = Papa.parse(data, { header: true });
//     return parsedData.data;
//   };
//   function formatTimeFromExcel(serialNumber) {
//     // Excel uses a fractional representation for time
//     const totalSeconds = Math.round(serialNumber * 24 * 60 * 60); // Convert days to seconds
//     const hours = Math.floor(totalSeconds / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const seconds = totalSeconds % 60;
    
//     // Format the time
//     const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
//     return formattedTime;
// }

//   function formatDateFromExcel(serialNumber) {
//     // Excel uses a different date origin (January 1, 1900)
//     const excelDateOrigin = new Date(Date.UTC(1900, 0, 0));
//     const millisecondsPerDay = 24 * 60 * 60 * 1000;

//     // Adjust for Excel leap year bug (1900 is not a leap year)
//     const daysAdjustment = serialNumber > 59 ? 1 : 0;

//     // Calculate the date in milliseconds
//     const dateMilliseconds =
//       excelDateOrigin.getTime() +
//       (serialNumber - daysAdjustment) * millisecondsPerDay;

//     // Create a Date object using the calculated milliseconds
//     const formattedDate = new Date(dateMilliseconds);

   
//     return formattedDate;
//   }


//   const transformedData = excelData.map(item => ({
//     "Company Name": item.companyName,
//     "Company Number": item.contactNumber,
//     "Company Email": item.companyEmail,
//     "Company Incorporation Date  ": item.incoDate,
//     ename: item.bdeName,
//     City:"NA",
//     State:"NA",
//     Status:"Matured"
//     // Add other fields as needed
//   }));
  
//   const handleSubmit = async () => {
//     try {
      
//       const response = await axios.post(`${secretKey}/upload/lead-form`, excelData);
//       await axios.post(`${secretKey}/leads`, transformedData)
//       console.log(response.data.successCounter , response.data.errorCounter)
//       if (response.data.errorCounter === 0){
//         Swal.fire({
//           title: "Success!",
//           html: `
//           <b> ${response.data.errorCounter} </b> Duplicate Entries found!,
//           </br>
//           <small>${response.data.successCounter} Data Added </small>
//         `,
//           icon: "success",
//         });
//       }else{
//         Swal.fire({
//           title: "Data Already exists!",
//           html: `
//           <b> ${response.data.errorCounter} </b> Duplicate Entries found!,
//           </br>
//           <small>${response.data.successCounter} Data Added </small>
//         `,
//           icon: "info",
//         });

//       }
     
//     } catch (error) {
//       console.error(error);
//       Swal.fire('Error uploading file.');
//     }
//   };


//   const handleViewPdfReciepts = (paymentreciept) => {
//     const pathname = paymentreciept;
//     console.log(pathname);
//     window.open(`${secretKey}/recieptpdf/${pathname}`, "_blank");
//   };

//   const handleViewPdOtherDocs = (pdfurl) => {
//     const pathname = pdfurl;
//     console.log(pathname);
//     window.open(`${secretKey}/otherpdf/${pathname}`, "_blank");
//   }
// // console.log(company.paymentReceipt)
//   const copyToClipboard = (value) => {
//     navigator.clipboard.writeText(value)

//       .then(() => {
//         console.log('Text successfully copied to clipboard:', value);
//         const alertElement = document.createElement('div');
//         alertElement.className = 'copy-alert';
//         alertElement.textContent = 'Copied!';

//         // Append the alert element to the document body
//         document.body.appendChild(alertElement);

//         // Remove the alert element after a short delay
//         setTimeout(() => {
//           document.body.removeChild(alertElement);
//         }, 2000); // Adjust the delay as needed (2 seconds in this example)
//       })
//   };


//   return (

//     <div className='card'>
//       <div className="card-header">
//         <div className="d-flex justify-content-between align-items-center w-100">
//           <div>
//             <h3 class="card-title">Booking Details</h3>
//           </div>
//           <div className="buttons d-flex align-items-center justify-content-around" style={{gap:"5px"}}>
//           <div>
//             <button
//               className="btn btn-primary"  onClick={functionopenpopup}>
//               + Import CSV
//             </button>
//           </div>
//             <div>
//               <Dialog open={open} onClose={closepopup} fullWidth maxWidth="sm">
//                 <DialogTitle>
//                   Import CSV DATA{" "}
//                   <IconButton onClick={closepopup} style={{ float: "right" }}>
//                     <CloseIcon color="primary"></CloseIcon>
//                   </IconButton>{" "}
//                 </DialogTitle>
//                 <DialogContent>
//                   <div className="maincon">
//                     <div
//                       style={{ justifyContent: "space-between" }}
//                       className="con1 d-flex"
//                     >
//                       <div style={{ paddingTop: "9px" }} className="uploadcsv">
//                         <label
//                           style={{ margin: "0px 0px 6px 0px" }}
//                           htmlFor="upload"
//                         >
//                           Upload CSV File
//                         </label>
//                       </div>
//                       <a href={frontendKey + "/BulkBookingFormat.xlsx"} download>
//                         Download Sample
//                       </a>
//                     </div>
//                     <div
//                       style={{ margin: "5px 0px 0px 0px" }}
//                       className="form-control"
//                     >
//                       <input
//                         type="file"
//                         name="csvfile
//                           "
//                         id="csvfile"
//                         onChange={handleFileInputChange}
//                       />
//                     </div>
//                   </div>
//                 </DialogContent>
//                 <button className="btn btn-primary" onClick={handleSubmit}>
//                   Submit
//                 </button>
//               </Dialog>
//             </div>
//           <div>
//             <Link to='/Processing/Dashboard_processing/addbookings'>
//               <button
//                 className="btn btn-primary">
//                 Add Booking
//               </button>
//             </Link>
//           </div>
//           </div>
//         </div>
//       </div>
//       <div className="card-body">

//         {/* ------------------------Booking info section------------- */}
//         <section>
//           <div className="row">
//             {(company.bdeName || company.bdeName === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">BDE Name :</div>
//                 <div className="fields-view-value">{company.bdeName}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.bdeName}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px" ,cursor:"pointer" }} />
//                   </span>
//                 </div>
//               </div>
//             </div>)}
//             {(company.bdeEmail || company.bdeEmail === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">BDE Email :</div>
//                 <div className="fields-view-value">{company.bdeEmail}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.bdeEmail}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px", cursor:"pointer" }} />
//                   </span>
//                 </div>
//               </div>
//             </div>)}

//             {(company.bdmName || company.bdmName === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">BDM Name :</div>
//                 <div className="fields-view-value" id="bdmNameValue">
//                   {`${company.bdmName}(${company.bdmType})`}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.bdmName}(${company.bdmType}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px",cursor:"pointer" }} />
//                   </span>
//                 </div>
//               </div>
//             </div>)}


//             {(company.bdmEmail || company.bdmEmail === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">BDM Email :</div>
//                 <div className="fields-view-value">{company.bdmEmail}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.bdmEmail}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px",cursor:"pointer"}} />
//                   </span>
//                 </div>
//               </div>
//             </div>)}
//           </div>
//           <div className="row mt-2">
//             {(company.bookingDate || company.bookingDate === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Booking Date :</div>
//                 <div className="fields-view-value">{formatDatelatest(company.bookingDate)}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${formatDatelatest(company.bookingDate)}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px",cursor:"pointer" }} />
//                   </span>
//                 </div>
//               </div>
//             </div>)}
//             {(company.bookingTime || company.bookingTime === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Booking Time :</div>
//                 <div className="fields-view-value">{company.bookingTime}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.bookingTime}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px",cursor:"pointer" }} />
//                   </span></div>
//               </div>
//             </div>)}
//           </div>
//         </section>
//         <hr className="m-0 mt-2 mb-2"></hr>

//         {/* --------------CA SECTION--------------------------- */}

//         <section>
//           <div className="row">
//             {(company.caCase || company.caCase === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Ca Case :</div>
//                 <div className="fields-view-value">{company.caCase}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.caCase}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px",cursor:"pointer" }} />
//                   </span></div>
//               </div>
//             </div>)}
//             {(company.caCommission || company.caCommission === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Ca Case :</div>
//                 <div className="fields-view-value">{company.caCommission}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.caCommission}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px",cursor:"pointer" }} />
//                   </span>
//                 </div>
//               </div>
//             </div>)}
//             {(company.caEmail || company.caEmail === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">CA Email :</div>
//                 <div className="fields-view-value">{company.caEmail}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.caEmail}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px",cursor:"pointer" }} />
//                   </span></div>
//               </div>
//             </div>)}
//             {(company.caNumber || company.caNumber === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">CA Number :</div>
//                 <div className="fields-view-value">{company.caNumber}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.caNumber}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px",cursor:"pointer" }} />
//                   </span></div>
//               </div>
//             </div>)}
//           </div>
//         </section>
//         <hr className="m-0 mt-2 mb-2"></hr>

//         {/* -------------------------------Company Details Section-------------------------------------------- */}

//         <section>
//           <div className="row">
//             {(company.companyName || company.companyName === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Company Name :</div>
//                 <div className="fields-view-value">{company.companyName}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.companyName}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px" ,cursor:"pointer"}} />
//                   </span>
//                 </div>
//               </div>
//             </div>)}
//             {(company.companyEmail || company.companyEmail === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Company Email :</div>
//                 <div className="fields-view-value">{company.companyEmail}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.companyEmail}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px" ,cursor:"pointer" }} />
//                   </span></div>
//               </div>
//             </div>)}
//             {(company.contactNumber || company.contactNumber === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Contact Number :</div>
//                 <div className="fields-view-value">{company.contactNumber}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.contactNumber}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px",cursor:"pointer" }} />
//                   </span>
//                 </div>
//               </div>
//             </div>)}
//             {(company.services || company.services === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view" id='fieldValue'>
//                 <div className="fields-view-title">Services :</div>
//                 <div className="fields-view-value" id="servicesValue">
//                   {company.services}
//                   <span className="copy-icon" onClick={() => copyToClipboard(company.services, 'servicesValue')}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px" ,cursor:"pointer"}} />
//                   </span>
//                 </div>
//               </div>

//             </div>)}
//           </div>
//         </section>
//         <hr className="m-0 mt-2 mb-2"></hr>
//         {/* --------------------------------Payment Details Section------------------------------ */}
//         <section>
//           <div className="row">
//             {(company.paymentTerms || company.paymentTerms === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Payment Terms :</div>
//                 <div className="fields-view-value">{company.paymentTerms}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.paymentTerms}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px",cursor:"pointer" }} />
//                   </span></div>
//               </div>
//             </div>)}
//             {(company.paymentMethod || company.paymentMethod === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Payment Method :</div>
//                 <div className="fields-view-value">{company.paymentMethod}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.paymentMethod}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px",cursor:"pointer" }} />
//                   </span>
//                 </div>
//               </div>

//             </div>)}
//             {(company.originalTotalPayment || company.originalTotalPayment === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Original Total Payment :</div>
//                 <div className="fields-view-value"><span style={{ color: 'black', fontWeight:"bolder",marginRight:"-120px"}}>&#8377;</span>{company.originalTotalPayment}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.originalTotalPayment}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px",cursor:"pointer" }} />
//                   </span></div>
//               </div>
//             </div>)}
//             {(company.totalPayment || company.totalPayment === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Total Payment :</div>
//                 <div className="fields-view-value"><span style={{ color: 'black', fontWeight:"bolder",marginRight:"-120px"}}>&#8377;</span>{company.totalPayment}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.totalPayment}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px" ,cursor:"pointer"}} />
//                   </span></div>
//               </div>
//             </div>)}
//           </div>
//           <div className="row">
//             {(company.firstPayment || company.firstPayment === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">First Payment :</div>
//                 <div className="fields-view-value"><span style={{ color: 'black', fontWeight:"bolder",marginRight:"-120px"}}>&#8377;</span>{company.firstPayment}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.firstPayment}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px",cursor:"pointer" }} />
//                   </span></div>
//               </div>
//             </div>)}
//             {(company.secondPayment || company.secondPayment === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Second Payment :</div>
//                 <div className="fields-view-value"><span style={{ color: 'black', fontWeight:"bolder",marginRight:"-120px"}}>&#8377;</span>{company.secondPayment}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.secondPayment}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px" ,cursor:"pointer"}} />
//                   </span></div>
//               </div>
//             </div>)}
//             {(company.thirdPayment || company.thirdPayment === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Third Payment :</div>
//                 <div className="fields-view-value"><span style={{ color: 'black', fontWeight:"bolder",marginRight:"-120px"}}>&#8377;</span>{company.thirdPayment}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.thirdPayment}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px" ,cursor:"pointer"}} />
//                   </span></div>
//               </div>
//             </div>)}
//             {(company.fourthPayment || company.fourthPayment === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Fourth Payment :</div>
//                 <div className="fields-view-value"><span style={{ color: 'black', fontWeight:"bolder",marginRight:"-120px"}}>&#8377;</span>{company.fourthPayment}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.fourthPayment}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px",cursor:"pointer" }} />
//                   </span></div>
//               </div>
//             </div>)}
//           </div>
//           <div className="row">
//             {(company.bookingSource || company.bookingSource === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Booking Source :</div>
//                 <div className="fields-view-value">{company.bookingSource}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.bookingSource}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px",cursor:"pointer" }} />
//                   </span></div>
//               </div>
//             </div>)}
//             {(company.cPANorGSTnum || company.cPANorGSTnum === " ") && (<div className="col-sm-3">

//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Pan or Gst :</div>
//                 <div className="fields-view-value">{company.cPANorGSTnum}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.cPANorGSTnum}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px" ,cursor:"pointer"}} />
//                   </span></div>
//               </div>
//             </div>)}
//             {(company.incoDate || company.incoDate === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Incorporation Date :</div>
//                 <div className="fields-view-value">{formatDatelatest(company.incoDate)}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${formatDatelatest(company.incoDate)}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px" ,cursor:"pointer"}} />
//                   </span>
//                 </div>
//               </div>
//             </div>)}
//             {(company.extraNotes || company.extraNotes === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Extra Notes :</div>
//                 <div className="fields-view-value">{company.extraNotes}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.extraNotes}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px",cursor:"pointer" }} />
//                   </span></div>
//               </div>
//             </div>)}
//           </div>
//         </section>

//         {/* -----------------------------------Recipets and Documents Section----------------------------- */}
//         {(company.paymentReceipt || company.otherDocs.length > 0) && (
//           <>
//             <hr className="m-0 mt-4 mb-2"></hr>
//             <section>
//               <div className="d-flex justify-content-between mb-0 flex-wrap">
//                 {company.paymentReceipt && (
//                   <div className="col-sm-3 column-width-reciept">
//                     <div className="booking-fields-view d-flex align-items-center flex-column cursor-pointer">
//                       <div className="fields-view-title mb-2 mt-2">Payment Receipts :</div>
//                       <div
//                         className="custom-image-div d-flex"
//                         onClick={() => {
//                           handleViewPdfReciepts(company.paymentReceipt);
//                         }}
//                       >
//                         {/* <img src={pdficon} alt="pdficon" /> */}

//                          <PdfViewer type="paymentrecieptpdf" path={company.paymentReceipt} />
                         

//                         <div className="d-flex align-items-center justify-content-center download-attachments cursor-pointer">
//                         <div className="pdf-div">Pdf</div>
//                           <div style={{overflow:"hidden" , textOverflow:"ellipsis" , textWrap:"nowrap"}} >Reciept</div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                 {company.otherDocs.map((object) => {
//                   const originalFilename = object.split('-').slice(1).join('-').replace('.pdf', '');
//                   return (
//                     <div className="col-sm-3 column-width-reciept" key={object}>
//                       <div className="booking-fields-view d-flex  align-items-center flex-column cursor-pointer">
//                         <div className="fields-view-title mb-2 mt-2">Attachments</div>
//                         <div
//                           className="custom-image-div d-flex justify-content-center" 
//                           onClick={() => {
//                             handleViewPdOtherDocs(object);
//                           }}
//                         >
//                           {/* <img src={pdficon} alt="pdficon" /> */}
                          
//                           <PdfViewer type="pdf" path={object} />
//                           <div className="d-flex align-items-center justify-content-center download-attachments cursor-pointer">
//                            <div className="pdf-div">Pdf</div>
//                             <div title={originalFilename} style={{overflow:"hidden" , textOverflow:"ellipsis" , textWrap:"nowrap"}} >{originalFilename}</div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </section></>
//         )}
//       </div>
//     </div>

//   )
// };

// export default CompanyDetails;





// import React, { useState, useEffect } from "react";
// import Navbar_processing from "./Navbar_processing";
// import Header_processing from "./Header_processing";
// import CompanyList from "./CompanyList";
// import CompanyDetails from "./CompanyDetails";
// import Form from "./Form";
// import { Link } from "react-router-dom";

// function Dashboard_processing() {
//   const [selectedCompanyId, setSelectedCompanyId] = useState(null);
//   const [companies, setCompanies] = useState([]);
//   const [companyDetails, setCompanyDetails] = useState(null);
//   const [bookingDates, setBookingDates] = useState([]);
//   const [bookingTime, setBookingTime] = useState([]);
  


//   const secretKey = process.env.REACT_APP_SECRET_KEY;

//   useEffect(() => {
//     // Fetch company names from the backend API
//     fetchCompanies();
//   }, []);

//   useEffect(() => {
//     // Fetch company details when selectedCompanyId changes
//     if (selectedCompanyId !== null) {
//       fetchCompanyDetails();
//     }
//   }, [selectedCompanyId]);

//   const fetchCompanies = async () => {
//     try {
//       const response = await fetch(`${secretKey}/companies`);
//       const data = await response.json();

  
//       // Extract unique booking dates from the fetched data
//       const uniqueBookingDates = Array.from(
//         new Set(data.map((company) => company.bookingDate))
//       );
//       const uniqueBookingTime = Array.from(
//         new Set(data.map((company) => company.bookingTime))
//       );
      
  
//       // Set the details of the first company by default if there are companies available
//       if (data.length !== 0) {
//         setSelectedCompanyId(data[0].companyName);
//       }
  
//       // Update the state with both companies and booking dates
//       setCompanies(data.reverse());
//       setBookingDates(uniqueBookingDates);
//       setBookingTime(uniqueBookingTime);
     
//     } catch (error) {
//       console.error("Error fetching companies:", error);
//     }
//   };
//   console.log(companies)

//   const markCompanyAsRead = (companyId) => {
//     const updatedCompanies = companies.map(company =>
//       company._id === companyId ? { ...company, unread: false } : company
//     );
//     setCompanies(updatedCompanies);
//   };


//   const fetchCompanyDetails = async () => {
//     try {
//       if (selectedCompanyId !== null) {
//         const response = await fetch(`${secretKey}/company/${selectedCompanyId}`);
//         const data = await response.json();
//         setCompanyDetails(data);
//       }
//     } catch (error) {
//       console.error("Error fetching company details:", error);
//     }
//   };

//   const handleCompanyClick = (companyId) => {
//     setSelectedCompanyId(companyId);
//   };

//   const formattedDates = bookingDates.map((date) =>
//     date
//       ? new Date(date).toLocaleDateString("en-GB", {
//           day: "2-digit",
//           month: "2-digit",
//           year: "numeric",
//         })
//       : ""
//   );


//   return (
//     <div>
//       <Header_processing data={companies} />
//       <Navbar_processing />
//        <div className="page-body">
//                 <div className="page-body">
//                     <div className="container-xl">
//                         <div className="processing-main row">
//                             <div className="col-sm-12"></div>
//                             <div className="col-sm-4">
//                                 <CompanyList
//                                     companies={companies} // Use the correct array
//                                     onCompanyClick={handleCompanyClick}
//                                     selectedBookingDate={formattedDates}
//                                     bookingTime={bookingTime}
                                   
//                                 />
//                             </div>
//                             <div className="col-sm-8">
//                                 {companyDetails ? (
//                                     <CompanyDetails company={companyDetails} />
//                                 ) : null}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//     </div>
//   );
// }

// export default Dashboard_processing;



// import React, { useState } from "react";
// import './style_processing/main_processing.css'
// import { pdfuploader } from "../documents/pdf1.pdf";
// import Dashboard_processing from "./Dashboard_processing";
// import { Link } from "react-router-dom";
// import { FaRegFilePdf } from "react-icons/fa";
// import pdficon from './PDF-icon-1.png';
// import { MdDownload } from "react-icons/md";
// import { FaRegCopy } from "react-icons/fa";
// import { IoIosCloseCircleOutline } from "react-icons/io";
// import Papa from "papaparse";
// import * as XLSX from "xlsx";
// import Swal from "sweetalert2";
// import CloseIcon from "@mui/icons-material/Close";
// import axios from "axios";
// import PdfViewer from "./PdfViewer";
// import { pdfjs } from 'react-pdf';
// import Nodata from './Nodata'
// import {
//   Button,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
// } from "@mui/material";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url,
// ).toString();



// const CompanyDetails = ({ company }) => {
//   // const [field, setField] = useState(false)
//   const [isOpen, setIsOpen] = useState(false);
//   const [open, openchange] = useState(false);
//   const [csvdata, setCsvData] = useState([]);
//   const [excelData, setExcelData] = useState([]);
//   const [displayForm, setDisplayForm] = useState(false)

//   const formatDatelatest = (inputDate) => {
//     const date = new Date(inputDate);
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };



//   const secretKey = process.env.REACT_APP_SECRET_KEY;
//   const frontendKey = process.env.REACT_APP_FRONTEND_KEY;


//   // Function to close the popup
//   // const handleClosePopup = () => {
//   //   setIsOpen(false);
//   // };

//   const functionopenpopup = () => {
//     openchange(true);
//   };

//   const closepopup = () => {
//     openchange(false);

//     setCsvData([]);
//   };

//   const handleFileInputChange = (event) => {
//     const file = event.target.files[0];

//     if (
//       file &&
//       file.type ===
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     ) {
//       const reader = new FileReader();

//       reader.onload = (e) => {
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: "array" });

//         // Assuming there's only one sheet in the XLSX file
//         const sheetName = workbook.SheetNames[0];
//         const sheet = workbook.Sheets[sheetName];

//         const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

//         const formattedJsonData = jsonData
//           .slice(1) // Exclude the first row (header)
//           .map((row) => ({
//             "Sr. No": row[0],
//             "bdeName": row[1],
//             "bdeEmail": row[2],
//             "bdmName": row[3],
//             "bdmEmail": row[4], // Assuming the date is in column 'E' (0-based)
//             "bdmType": row[5],
//             "supportedBy": row[6],
//             "bookingDate": formatDateFromExcel(row[7]),
//             "caCase": row[8],
//             "caNumber": row[9],
//             "caEmail": row[10],
//             "caCommission": row[11],
//             "companyName": row[12],
//             "contactNumber": row[13],
//             "companyEmail": row[14],
//             "services": row[15],
//             "originalTotalPayment": row[16],
//             "totalPayment": row[17],
//             "paymentTerms": row[18],
//             "paymentMethod": row[19],
//             "firstPayment": row[20],
//             "secondPayment": row[21],
//             "thirdPayment": row[22],
//             "fourthPayment": row[23],
//             "paymentRemarks": row[24],
//             "paymentReceipt": row[25],
//             "bookingSource": row[26],
//             "cPANorGSTnum": row[27],
//             "incoDate": formatDateFromExcel(row[28]),
//             "extraNotes": row[29],
//             "otherDocs": row[30],
//             "bookingTime": formatTimeFromExcel(row[31]),
//           }));
//         const newFormattedData = formattedJsonData.filter((obj) => {
//           return obj.companyName !== "" && obj.companyName !== null && obj.companyName !== undefined;
//         });
//         setExcelData(newFormattedData)
//         console.log(newFormattedData)
//       };

//       reader.readAsArrayBuffer(file);
//     } else if (file.type === "text/csv") {
//       // CSV file
//       // const parsedCsvData = parseCsv(data);
//       console.log("everything is good")

//     } else {
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: "Something went wrong!",
//         footer: '<a href="#">Why do I have this issue?</a>',
//       });

//       console.error("Please upload a valid XLSX file.");
//     }
//   };

//   const parseCsv = (data) => {
//     // Use a CSV parsing library (e.g., Papaparse) to parse CSV data
//     // Example using Papaparse:
//     const parsedData = Papa.parse(data, { header: true });
//     return parsedData.data;
//   };
//   function formatTimeFromExcel(serialNumber) {
//     // Excel uses a fractional representation for time
//     const totalSeconds = Math.round(serialNumber * 24 * 60 * 60); // Convert days to seconds
//     const hours = Math.floor(totalSeconds / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const seconds = totalSeconds % 60;

//     // Format the time
//     const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

//     return formattedTime;
//   }

//   function formatDateFromExcel(serialNumber) {
//     // Excel uses a different date origin (January 1, 1900)
//     const excelDateOrigin = new Date(Date.UTC(1900, 0, 0));
//     const millisecondsPerDay = 24 * 60 * 60 * 1000;

//     // Adjust for Excel leap year bug (1900 is not a leap year)
//     const daysAdjustment = serialNumber > 59 ? 1 : 0;

//     // Calculate the date in milliseconds
//     const dateMilliseconds =
//       excelDateOrigin.getTime() +
//       (serialNumber - daysAdjustment) * millisecondsPerDay;

//     // Create a Date object using the calculated milliseconds
//     const formattedDate = new Date(dateMilliseconds);


//     return formattedDate;
//   }


//   const transformedData = excelData.map(item => ({
//     "Company Name": item.companyName,
//     "Company Number": item.contactNumber,
//     "Company Email": item.companyEmail,
//     "Company Incorporation Date  ": item.incoDate,
//     ename: item.bdeName,
//     City: "NA",
//     State: "NA",
//     Status: "Matured"
//     // Add other fields as needed
//   }));

//   const handleSubmit = async () => {
//     try {

//       const response = await axios.post(`${secretKey}/upload/lead-form`, excelData);
//       await axios.post(`${secretKey}/leads`, transformedData)
//       console.log(response.data.successCounter, response.data.errorCounter)
//       if (response.data.errorCounter === 0) {
//         Swal.fire({
//           title: "Success!",
//           html: `
//           <b> ${response.data.errorCounter} </b> Duplicate Entries found!,
//           </br>
//           <small>${response.data.successCounter} Data Added </small>
//         `,
//           icon: "success",
//         });
//       } else {
//         Swal.fire({
//           title: "Data Already exists!",
//           html: `
//           <b> ${response.data.errorCounter} </b> Duplicate Entries found!,
//           </br>
//           <small>${response.data.successCounter} Data Added </small>
//         `,
//           icon: "info",
//         });

//       }

//     } catch (error) {
//       console.error(error);
//       Swal.fire('Error uploading file.');
//     }
//   };


//   const handleViewPdfReciepts = (paymentreciept) => {
//     const pathname = paymentreciept;
//     console.log(pathname);
//     window.open(`${secretKey}/recieptpdf/${pathname}`, "_blank");
//   };

//   const handleViewPdOtherDocs = (pdfurl) => {
//     const pathname = pdfurl;
//     console.log(pathname);
//     window.open(`${secretKey}/otherpdf/${pathname}`, "_blank");
//   }
//   // console.log(company.paymentReceipt)
//   const copyToClipboard = (value) => {
//     navigator.clipboard.writeText(value)

//       .then(() => {
//         console.log('Text successfully copied to clipboard:', value);
//         const alertElement = document.createElement('div');
//         alertElement.className = 'copy-alert';
//         alertElement.textContent = 'Copied!';

//         // Append the alert element to the document body
//         document.body.appendChild(alertElement);

//         // Remove the alert element after a short delay
//         setTimeout(() => {
//           document.body.removeChild(alertElement);
//         }, 2000); // Adjust the delay as needed (2 seconds in this example)
//       })
//   };
//   // ---------------------------tofetchdatainexcelfile---------------------------------

//   const exportData = async () => {
//     try {
//       const response = await axios.get(`${secretKey}/exportdatacsv`, { responseType: 'blob' });
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', 'leads.csv');
//       document.body.appendChild(link);
//       link.click();
//     } catch (error) {
//       console.error('Error downloading CSV:', error);
//     }
//   };

//   return (

//     <div className='card'>
//       <div className="card-header">
//         <div className="d-flex justify-content-between align-items-center w-100">
//           <div>
//             <h3 class="card-title">Booking Details</h3>
//           </div>
//           <div className="buttons d-flex align-items-center justify-content-around" style={{ gap: "5px" }}>
//             <div>
//               <button
//                 className="btn btn-primary mr-1" onClick={exportData}>
//                 + Export Csv
//               </button>
//             </div>
//             <div>
//               <button
//                 className="btn btn-primary" onClick={functionopenpopup}>
//                 + Import CSV
//               </button>
//             </div>
//             <div>
//               <Dialog open={open} onClose={closepopup} fullWidth maxWidth="sm">
//                 <DialogTitle>
//                   Import CSV DATA{" "}
//                   <IconButton onClick={closepopup} style={{ float: "right" }}>
//                     <CloseIcon color="primary"></CloseIcon>
//                   </IconButton>{" "}
//                 </DialogTitle>
//                 <DialogContent>
//                   <div className="maincon">
//                     <div
//                       style={{ justifyContent: "space-between" }}
//                       className="con1 d-flex"
//                     >
//                       <div style={{ paddingTop: "9px" }} className="uploadcsv">
//                         <label
//                           style={{ margin: "0px 0px 6px 0px" }}
//                           htmlFor="upload"
//                         >
//                           Upload CSV File
//                         </label>
//                       </div>
//                       <a href={frontendKey + "/AddBookingFormat.xlsx"} download>
//                         Download Sample
//                       </a>
//                     </div>
//                     <div
//                       style={{ margin: "5px 0px 0px 0px" }}
//                       className="form-control"
//                     >
//                       <input
//                         type="file"
//                         name="csvfile
//                           "
//                         id="csvfile"
//                         onChange={handleFileInputChange}
//                       />
//                     </div>
//                   </div>
//                 </DialogContent>
//                 <button className="btn btn-primary" onClick={handleSubmit}>
//                   Submit
//                 </button>
//               </Dialog>
//             </div>
//             <div>
//               <Link to='/Processing/Dashboard_processing/addbookings'>
//                 <button
//                   className="btn btn-primary">
//                   Add Booking
//                 </button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* ------------------------Booking info section------------- */}
//       {company !== null ? (<div className="card-body">
//         <section>
//           <div className="row">
//             {(company.bdeName || company.bdeName === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">BDE Name :</div>
//                 <div className="fields-view-value">{company.bdeName}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.bdeName}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px", cursor: "pointer" }} />
//                   </span>
//                 </div>
//               </div>
//             </div>)}
//             {(company.bdeEmail || company.bdeEmail === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">BDE Email :</div>
//                 <div className="fields-view-value">{company.bdeEmail}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.bdeEmail}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px", cursor: "pointer" }} />
//                   </span>
//                 </div>
//               </div>
//             </div>)}

//             {(company.bdmName || company.bdmName === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">BDM Name :</div>
//                 <div className="fields-view-value" id="bdmNameValue">
//                   {`${company.bdmName}(${company.bdmType})`}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.bdmName}(${company.bdmType}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px", cursor: "pointer" }} />
//                   </span>
//                 </div>
//               </div>
//             </div>)}


//             {(company.bdmEmail || company.bdmEmail === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">BDM Email :</div>
//                 <div className="fields-view-value">{company.bdmEmail}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.bdmEmail}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px", cursor: "pointer" }} />
//                   </span>
//                 </div>
//               </div>
//             </div>)}
//           </div>
//           <div className="row mt-2">
//             {(company.bookingDate || company.bookingDate === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Booking Date :</div>
//                 <div className="fields-view-value">{formatDatelatest(company.bookingDate)}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${formatDatelatest(company.bookingDate)}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px", cursor: "pointer" }} />
//                   </span>
//                 </div>
//               </div>
//             </div>)}
//             {(company.bookingTime || company.bookingTime === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Booking Time :</div>
//                 <div className="fields-view-value">{company.bookingTime}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.bookingTime}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px", cursor: "pointer" }} />
//                   </span></div>
//               </div>
//             </div>)}
//           </div>
//         </section>
//         <hr className="m-0 mt-2 mb-2"></hr>

//         {/* --------------CA SECTION--------------------------- */}

//         <section>
//           <div className="row">
//             {(company.caCase || company.caCase === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Ca Case :</div>
//                 <div className="fields-view-value">{company.caCase}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.caCase}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px", cursor: "pointer" }} />
//                   </span></div>
//               </div>
//             </div>)}
//             {(company.caCommission || company.caCommission === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Ca Case :</div>
//                 <div className="fields-view-value">{company.caCommission}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.caCommission}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px", cursor: "pointer" }} />
//                   </span>
//                 </div>
//               </div>
//             </div>)}
//             {(company.caEmail || company.caEmail === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">CA Email :</div>
//                 <div className="fields-view-value">{company.caEmail}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.caEmail}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px", cursor: "pointer" }} />
//                   </span></div>
//               </div>
//             </div>)}
//             {(company.caNumber || company.caNumber === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">CA Number :</div>
//                 <div className="fields-view-value">{company.caNumber}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.caNumber}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px", cursor: "pointer" }} />
//                   </span></div>
//               </div>
//             </div>)}
//           </div>
//         </section>
//         <hr className="m-0 mt-2 mb-2"></hr>

//         {/* -------------------------------Company Details Section-------------------------------------------- */}

//         <section>
//           <div className="row">
//             {(company.companyName || company.companyName === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Company Name :</div>
//                 <div className="fields-view-value">{company.companyName}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.companyName}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px", cursor: "pointer" }} />
//                   </span>
//                 </div>
//               </div>
//             </div>)}
//             {(company.companyEmail || company.companyEmail === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Company Email :</div>
//                 <div className="fields-view-value">{company.companyEmail}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.companyEmail}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px", cursor: "pointer" }} />
//                   </span></div>
//               </div>
//             </div>)}
//             {(company.contactNumber || company.contactNumber === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Contact Number :</div>
//                 <div className="fields-view-value">{company.contactNumber}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.contactNumber}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px", cursor: "pointer" }} />
//                   </span>
//                 </div>
//               </div>
//             </div>)}
//             {(company.services || company.services === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view" id='fieldValue'>
//                 <div className="fields-view-title">Services :</div>
//                 <div className="fields-view-value" id="servicesValue">
//                   {company.services}
//                   <span className="copy-icon" onClick={() => copyToClipboard(company.services, 'servicesValue')}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px", cursor: "pointer" }} />
//                   </span>
//                 </div>
//               </div>

//             </div>)}
//           </div>
//         </section>
//         <hr className="m-0 mt-2 mb-2"></hr>
//         {/* --------------------------------Payment Details Section------------------------------ */}
//         <section>
//           <div className="row">
//             {(company.paymentTerms || company.paymentTerms === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Payment Terms :</div>
//                 <div className="fields-view-value">{company.paymentTerms}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.paymentTerms}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px", cursor: "pointer" }} />
//                   </span></div>
//               </div>
//             </div>)}
//             {(company.paymentMethod || company.paymentMethod === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Payment Method :</div>
//                 <div className="fields-view-value">{company.paymentMethod}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.paymentMethod}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px", cursor: "pointer" }} />
//                   </span>
//                 </div>
//               </div>

//             </div>)}
//             {(company.originalTotalPayment || company.originalTotalPayment === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Original Total Payment :</div>
//                 <div className="fields-view-value"><span style={{ color: 'black', fontWeight: "bolder", marginRight: "-120px" }}>&#8377;</span>{company.originalTotalPayment}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.originalTotalPayment}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px", cursor: "pointer" }} />
//                   </span></div>
//               </div>
//             </div>)}
//             {(company.totalPayment || company.totalPayment === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Total Payment :</div>
//                 <div className="fields-view-value"><span style={{ color: 'black', fontWeight: "bolder", marginRight: "-120px" }}>&#8377;</span>{company.totalPayment}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.totalPayment}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px", cursor: "pointer" }} />
//                   </span></div>
//               </div>
//             </div>)}
//           </div>
//           <div className="row">
//             {(company.firstPayment || company.firstPayment === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">First Payment :</div>
//                 <div className="fields-view-value"><span style={{ color: 'black', fontWeight: "bolder", marginRight: "-120px" }}>&#8377;</span>{company.firstPayment}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.firstPayment}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px", cursor: "pointer" }} />
//                   </span></div>
//               </div>
//             </div>)}
//             {(company.secondPayment || company.secondPayment === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Second Payment :</div>
//                 <div className="fields-view-value"><span style={{ color: 'black', fontWeight: "bolder", marginRight: "-120px" }}>&#8377;</span>{company.secondPayment}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.secondPayment}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px", cursor: "pointer" }} />
//                   </span></div>
//               </div>
//             </div>)}
//             {(company.thirdPayment || company.thirdPayment === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Third Payment :</div>
//                 <div className="fields-view-value"><span style={{ color: 'black', fontWeight: "bolder", marginRight: "-120px" }}>&#8377;</span>{company.thirdPayment}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.thirdPayment}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px", cursor: "pointer" }} />
//                   </span></div>
//               </div>
//             </div>)}
//             {(company.fourthPayment || company.fourthPayment === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Fourth Payment :</div>
//                 <div className="fields-view-value"><span style={{ color: 'black', fontWeight: "bolder", marginRight: "-120px" }}>&#8377;</span>{company.fourthPayment}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.fourthPayment}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px", cursor: "pointer" }} />
//                   </span></div>
//               </div>
//             </div>)}
//           </div>
//           <div className="row">
//             {(company.bookingSource || company.bookingSource === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Booking Source :</div>
//                 <div className="fields-view-value">{company.bookingSource}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.bookingSource}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px", cursor: "pointer" }} />
//                   </span></div>
//               </div>
//             </div>)}
//             {(company.cPANorGSTnum || company.cPANorGSTnum === " ") && (<div className="col-sm-3">

//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Pan or Gst :</div>
//                 <div className="fields-view-value">{company.cPANorGSTnum}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.cPANorGSTnum}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px", cursor: "pointer" }} />
//                   </span></div>
//               </div>
//             </div>)}
//             {(company.incoDate || company.incoDate === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Incorporation Date :</div>
//                 <div className="fields-view-value">{formatDatelatest(company.incoDate)}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${formatDatelatest(company.incoDate)}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px", cursor: "pointer" }} />
//                   </span>
//                 </div>
//               </div>
//             </div>)}
//             {(company.extraNotes || company.extraNotes === " ") && (<div className="col-sm-3">
//               <div className="booking-fields-view">
//                 <div className="fields-view-title">Extra Notes :</div>
//                 <div className="fields-view-value">{company.extraNotes}
//                   <span className="copy-icon" onClick={() => copyToClipboard(`${company.extraNotes}`)}>
//                     {/* Replace with your clipboard icon */}
//                     <FaRegCopy style={{ width: "15px", height: "15px", marginLeft: "5px", cursor: "pointer" }} />
//                   </span></div>
//               </div>
//             </div>)}
//           </div>
//         </section>

//         {/* -----------------------------------Reciepts and Documents Section----------------------------- */}

//         {/* 
// ------------------------------------------------Reciepts Viewer Section---------------------------------------- */}

//         {(company.paymentReceipt || company.otherDocs.length > 0) && (
//           <>
//             <hr className="m-0 mt-4 mb-2 w-100"></hr>
//             <section>
//               <div className="d-flex justify-content-between mb-0 flex-wrap">
//                 {company.paymentReceipt && (
//                   <div className="col-sm-3 column-width-reciept">
//                     <div className="booking-fields-view d-flex align-items-center flex-column cursor-pointer">
//                       <div className="fields-view-title mb-2 mt-2">Payment Receipts :</div>
//                       <div
//                         className="custom-image-div d-flex "
//                         onClick={() => {
//                           handleViewPdfReciepts(company.paymentReceipt);
//                         }}
//                       >
//                         {/* <img src={pdficon} alt="pdficon" /> */}

//                         {company.paymentReceipt.endsWith(".pdf") ? (
//                           <PdfViewer type="paymentrecieptpdf" path={company.paymentReceipt} />
//                         ) : (
//                           <img src={`${secretKey}/recieptpdf/${company.paymentReceipt}`} alt="Receipt" style={{ width: "200px", height: "129px" }} />
//                         )}

//                         <div className="d-flex align-items-center justify-content-center download-attachments cursor-pointer">
//                           <div className="pdf-div">Pdf</div>
//                           <div style={{ overflow: "hidden", textOverflow: "ellipsis", textWrap: "nowrap" }} >Reciept</div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                 {company.otherDocs.map((object) => {
//                   const originalFilename = object.split('-').slice(1).join('-').replace('.pdf', '');
//                   return (
//                     <div className="col-sm-3 column-width-reciept" key={object}>
//                       <div className="booking-fields-view d-flex  align-items-center flex-column cursor-pointer">
//                         <div className="fields-view-title mb-2 mt-2">Attachments</div>
//                         <div
//                           className="custom-image-div d-flex justify-content-center"
//                           onClick={() => {
//                             handleViewPdOtherDocs(object);
//                           }}
//                         >
//                           {/* <img src={pdficon} alt="pdficon" /> */}
//                           {object.endsWith(".pdf") ? (
//                             <PdfViewer type="pdf" path={object} />
//                           ) : (
//                             <img src={`${secretKey}/otherpdf/${object}`} alt="Document" style={{ width: "200px", height: "129px" }} />
//                           )}
//                           <div className="d-flex align-items-center justify-content-center download-attachments cursor-pointer">
//                             <div className="pdf-div">Pdf</div>
//                             <div title={originalFilename} style={{ overflow: "hidden", textOverflow: "ellipsis", textWrap: "nowrap" }} >{originalFilename}</div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </section></>
//         )}
//       </div>) : (<Nodata />)}
//     </div>

//   )
// };

// export default CompanyDetails;





















































































































































































