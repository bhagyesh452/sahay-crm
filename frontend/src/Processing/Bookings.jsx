
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