import React, { useState, useEffect } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Swal from 'sweetalert2';
import {
  IconButton,
} from "@mui/material";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Select from "react-select";
import Nodata from "../components/Nodata";



function CompanyListAdmin({ companies, onCompanyClick }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState("companyName");
  const [companyClasses, setCompanyClasses] = useState({});
  const [searchDisplay, setSearchDisplay] = useState(true);
  const [dateRangeDisplay, setDateRangeDisplay] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [searchbde, setSearchBde] = useState(false);
  const [enames, setEnames] = useState([])
  const [searchServices, setSearchServices] = useState(false)
  const [selectedValues, setSelectedValues] = useState([]);



  const secretKey = process.env.REACT_APP_SECRET_KEY;


  const formatDatelatest = (inputDate) => {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleCompanyClick = (company, companyId) => {
    setCompanyClasses(prevClasses => ({
      [company]: "list-group-item list-group-item-action active"
    }));


    onCompanyClick(company);
    // Make a PUT request to mark the company as read
    axios.put(`${secretKey}/read/${company}`)
      .then((response) => {
        console.log('Company marked as read:', response.data);
      })
      .catch((error) => {
        console.error('Error marking company as read:', error);
      });
  };


  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "blue"
        : state.isDisabled
          ? "#ffb900"
          : "white",
      color: state.isDisabled ? "white" : "black",

      // Add more styles as needed
    }),
  };
  const options = [
    {
      value: "Certification Services",
      label: "Certification Services",
      isDisabled: true,
    },
    { value: "Start-Up India Certificate", label: "Start-Up India Certificate" },
    { value: "MSME/UYDAM Certificate", label: "MSME/UYDAM Certificate 3" },
    { value: "ISO Certificate", label: "ISO Certificate" },
    { value: "IEC CODE Certificate", label: "IEC CODE Certificate" },
    { value: "BIS Certificate", label: "BIS Certificate" },
    { value: "NSIC Certificate", label: "NSIC Certificate" },
    { value: "FSSAI Certificate", label: "FSSAI Certificate" },
    { value: "APEDA Certificate", label: "APEDA Certificate" },
    { value: "GST Certificate", label: "GST Certificate" },
    {
      value: "Documentation Services",
      label: "Documentation Services",
      isDisabled: true,
    },
    { value: "Pitch Deck Development", label: "Pitch Deck Development" },
    { value: "Financial Modeling", label: "Financial Modeling" },
    { value: "DPR Developmen", label: "DPR Developmen" },
    { value: "CMA Report Development", label: "CMA Report Development" },
    { value: "Company Profile", label: "Company Profile" },
    { value: "Company Brochure", label: "Company Brochure" },
    { value: "Product Catalog", label: "Product Catalog" },
    {
      value: "Fund Raising Support Services",
      label: "Fund Raising Support Services",
      isDisabled: true,
    },
    { value: "Seed Funding Support", label: "Seed Funding Support" },
    { value: "Angel Funding Support", label: "Angel Funding Support" },
    { value: "VC Funding Support", label: "VC Funding Support" },
    { value: "Crowd Funding Support", label: "Crowd Funding Support" },
    { value: "Government Funding Support", label: "Government Funding Support" },
    { value: "Digital Marketing", label: "Digital Marketing", isDisabled: true },
    { value: "SEO Services", label: "SEO Services" },
    { value: "Branding Services", label: "Branding Services" },
    {
      value: "Social Promotion Management",
      label: "Social Promotion Management",
    },
    { value: "Email Marketing", label: "Email Marketing" },
    { value: "Digital Content", label: "Digital Content" },
    { value: "Lead Generation", label: "Lead Generation" },
    { value: "Whatsapp Marketing", label: "Whatsapp Marketing" },
    { value: "IT Services", label: "IT Services", isDisabled: true },
    { value: "Website Development", label: "Website Development" },
    { value: "App Design & Development", label: "App Design & Development" },
    {
      value: "Web Application Development",
      label: "Web Application Development",
    },
    { value: "Software Development", label: "Software Development" },
    { value: "CRM Development", label: "CRM Development" },
    { value: "ERP Development", label: "ERP Development" },
    { value: "E-Commerce Website", label: "E-Commerce Website" },
    { value: "Product Development", label: "Product Development" },
    {
      value: "Business Registration",
      label: "Business Registration",
      isDisabled: true,
    },
    {
      value: "Sole Proprietorship Registration",
      label: "Sole Proprietorship Registration",
    },
    {
      value: "Partnership Firm Registration",
      label: "Partnership Firm Registration",
    },
    { value: "LLP Firm Registration", label: "LLP Firm Registration" },
    {
      value: "Private Limited Registration",
      label: "hPrivate Limited Registrationh",
    },
    {
      value: "Public Company Registration",
      label: "Public Company Registration",
    },
    { value: "Nidhi Company Registration", label: "Nidhi Company Registration" },
    {
      value: "Producer Company Registration",
      label: "Producer Company Registration ",
    },
    { value: "Trademark & IP", label: "Trademark & IP", isDisabled: true },
    { value: "Trademark Registration", label: "Trademark Registration" },
    { value: "Copyright Registration", label: "Copyright Registration" },
    { value: "Patent Registration", label: "Patent Registration" },

    // Add more options as needed
  ];


  useEffect(() => {
    // Perform the data fetching only once when the component mounts
    fetch(`${secretKey}/einfo`)
      .then((response) => response.json())
      .then((data) => {
        // Extract 'ename' from each object in the array
        const enames = data.map((admin) => admin.ename);
        setEnames(enames);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleFieldChange = (value) => {
    setSelectedField(value);
    if (value === 'companyName') {
      setSearchServices(false)
      setSearchBde(false)
      setSearchDisplay(true);
      setDateRangeDisplay(false);
    } else if (value === 'bookingDate') {
      setSearchServices(false)
      setSearchBde(false)
      setSearchDisplay(true);
      setDateRangeDisplay(true);
    } else if (value == "bdeName") {
      setSearchServices(false)
      setSearchBde(true)
      setSearchDisplay(false);
      setDateRangeDisplay(false);
    } else if (value == "services") {
      setSearchServices(true)
      setSearchBde(false)
      setSearchDisplay(false);
      setDateRangeDisplay(false);
    }
    else {
      setSearchServices(false)
      setSearchBde(false)
      setSearchDisplay(true);
      setDateRangeDisplay(false);
    }
  };


  const FilteredData = companies.filter((company) => {
    const fieldValue = company[selectedField];

    if (selectedField === "companyName" || selectedField === "bdeName") {
      // Handle filtering by company name or Bde name
      return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (selectedField === "services") {
      const newselectedValues = selectedValues.join(',').toLowerCase();
      //console.log("fieldvalue:", fieldValue.join(',').toLowerCase())
      //console.log("newselectedvalue:", newselectedValues)
      return (fieldValue.join(",")).toLowerCase().includes(newselectedValues.toLowerCase());

    } else if (selectedField === "bookingDate") {
      // Handle filtering by booking date
      const dateMatch = dateRange.startDate && dateRange.endDate ?
        new Date(company.bookingDate) >= new Date(dateRange.startDate) &&
        new Date(company.bookingDate) <= new Date(dateRange.endDate) :
        true;
      return dateMatch && fieldValue;
    }
    return true;
  });



  const handleDelete = (companyId, companyName) => {
    const ename = localStorage.getItem("username");

    Swal.fire({
      title: `Are you sure you want to request deletion for ${companyName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, request deletion!'
    }).then((result) => {
      if (result.isConfirmed) {
        const date = new Date().toLocaleDateString();
        const time = new Date().toLocaleTimeString();
        const deleteRequestData = {
          companyName,
          companyId,
          time,
          date,
          request: false,
          ename
        };

        fetch(`${secretKey}/deleterequestbybde`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(deleteRequestData),
        })
          .then(response => {
            if (response.ok) {
              Swal.fire(
                'Success!',
                'Delete request details stored successfully',
                'success'
              );
            } else {
              Swal.fire(
                'Error!',
                'Failed to store delete request details',
                'error'
              );
            }
          })
          .catch(error => {
            console.error('Error during delete request:', error);
          });
      }
    });
  };

  // Calculate index of the last company on the current page
  const indexOfLastCompany = currentPage * perPage;
  // Calculate index of the first company on the current page
  const indexOfFirstCompany = indexOfLastCompany - perPage;
  // Slice the companies array to get the companies for the current page
  const currentCompanies = FilteredData.slice(indexOfFirstCompany, indexOfLastCompany);

  console.log(currentCompanies)


  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="card">
      <div className="card-header search-date-header">
        <div className="d-flex justify-content-between align-items-center searchfields gap-5 w-100">
          <div className="input-icon d-flex align-items-center justify-content-start w-100">
            <select className="form-select"
              value={selectedField}
              onChange={(e) => handleFieldChange(e.target.value)}
            >
              <option value="companyName">Company Name</option>
              <option value="bdeName">BDE Name</option>
              <option value="services">Services</option>
              <option value="bookingDate">Booking Date</option>
            </select>
          </div>

          {searchbde && (
            <div className="input-icon w-100 d-flex align-items-center justify-content-between">
              <select
                className="form-select"
                value={searchTerm}
                onChange={(e) => {

                  setSearchTerm(e.target.value)
                  // Update selectedField
                  // Update searchTerm directly
                }}
              >
                <option value="">Select BDE</option>
                {enames.map((name, index) => (
                  <option key={index} value={name} >{name}</option>
                ))}
              </select>
            </div>
          )}

          {searchDisplay && (
            <div className="input-icon w-100 d-flex align-items-center justify-content-between">
              <span className="input-icon-addon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                  <path d="M21 21l-6 -6"></path>
                </svg>
              </span>
              <input
                type="text"
                value={searchTerm}
                className="form-control"
                placeholder="Search…"
                aria-label="Search in website"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>
        {searchServices && (<div className="input-icon w-100 d-flex align-items-center mt-2 searchServices">
          <Select
            styles={{
              customStyles,
              // Add custom styles here
              container: (provided) => ({
                ...provided,
                // display: 'flex !important',
                // Apply display: flex with !important
                // Add other custom styles as needed
              }),
              // Add other styles as needed
              // Make sure to include the default styles for other elements
            }}

            isMulti
            options={options}
            onChange={(selectedOptions) => {
              setSelectedValues(
                selectedOptions.map((option) => option.value)
              );
            }}
            value={selectedValues.map((value) => ({ value, label: value }))}
            placeholder="Select Services..."
          >
          </Select>
        </div>)}

        {dateRangeDisplay && (<div className="input-icon d-flex align-items-center justify-content-between w-100 mt-2 gap-2">

          <input
            type="date"
            value={dateRange.startDate}
            className="form-control"
            style={{ paddingRight: "10px" }}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
          />
          <span className="date-range-separator">to</span>
          <input
            type="date"
            value={dateRange.endDate}
            className="form-control"
            style={{ paddingLeft: "10px" }}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
          />

        </div>)}
      </div>

      {companies !== null && companies.length > 0 ? (
        <div className="list-group list-group-flush list-group-hoverable cmpy-list-body cursor-pointer w-100">
          {currentCompanies.map((company, index) => (
            <div
              className={`${companyClasses[company.companyName] || "list-group-item list-group-item-action"}`}
              key={index}
              style={{
                backgroundColor: company.read === false && "rgb(237 238 249)",
                boxShadow: company.read === false && "1px 1px 1px grey",
                fontWeight: company.read === false && "700 !important",
                fontFamily: company.red === false && "Merriweather, serif"
              }}
            >
              <div className="align-items-center w-100" onClick={() => handleCompanyClick(company.companyName, company._id)} >
                <div className="card w-100">
                  <div className="card-header w-100 d-flex align-items-center justify-content-between" style={{ backgroundColor: "#f8efef" ,padding:"11px 0px" }}>
                    <div className="d-flex align-items-center justify-content-between p-booking-Cname" title={company.companyName} >
                      <div><h5 style={{ width: "310px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textWrap: "nowrap" ,fontSize:"14px" }}>{company.companyName}</h5>
                      {company.bdeName && (
                          <div className="m-0 bdeName-cmpy-list d-flex justify-content-between" title={company.bdeName} ><span><strong>BDE :</strong>{company.bdeName}</span> <span><strong>BDM :</strong>{company.bdmName}</span></div>)}
                    </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      {company.imported && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{ width: "14px", height: "14px", fill: "#0b6240" }}><path d="M128 64c0-35.3 28.7-64 64-64H352V128c0 17.7 14.3 32 32 32H512V448c0 35.3-28.7 64-64 64H192c-35.3 0-64-28.7-64-64V336H302.1l-39 39c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l80-80c9.4-9.4 9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l39 39H128V64zm0 224v48H24c-13.3 0-24-10.7-24-24s10.7-24 24-24H128zM512 128H384V0L512 128z" /></svg>}
                      <IconButton onClick={() => handleDelete(company._id, company.companyName)}>
                        <DeleteIcon
                          style={{
                            width: "16px",
                            height: "16px",
                            color: "#bf0b0b",
                          }}
                        >
                          Delete
                        </DeleteIcon>
                      </IconButton>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-lg-6 services-cmpy-list">
                      {company.services && (
                          <div className="m-0" style={{ maxWidth: "200px", overflow: "hidden" }}>
                            {company.services[0].split(',').map((service, index) => (
                              <div key={index} title={service.trim()} style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", textWrap: "nowrap" }}>
                                <span
                                  style={{ marginRight: "5px" }}
                                >
                                  ●</span>{service.trim()}
                              </div>
                            ))}
                          </div>
      )}
                        
                      </div>
                      <div className="col-lg-6 payments-cmpy-list">
                        <p><span style={{ color: "#336667" }}>Total Payment:</span>{company.totalPayment && (
                          <span > ₹{company.totalPayment.toLocaleString()}</span>)}</p>
                        <p><span style={{ color: "#336667" }}>Recieved Payment:</span>{company.firstPayment && (
                          <span > ₹{company.firstPayment === 0 ? company.totalPayment.toLocaleString() : company.firstPayment.toLocaleString()}</span>)}</p>
                        <p><span style={{ color: "#336667" }}>Pending Payment:</span>{company.totalPayment && (
                          <span > ₹{company.firstPayment === 0 ? 0 : (company.totalPayment - company.firstPayment).toLocaleString()}</span>)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer d-flex align-items-center justify-content-between w-100" style={{ display: "flex" }}>
                    <div className="time">
                      {company.bookingTime && (
                        <p className="m-0">{company.bookingTime}</p>)}
                    </div>
                    <div className="bookingdate">
                      {company.bookingDate && (
                        <p className="m-0">{formatDatelatest(company.bookingDate)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Nodata />
      )}




      {/*---------------------------------- Pagination-------------------------------------- */}


      <nav className="d-flex align-items-center justify-content-center mt-2">
        <ul className="pagination">
          <li className="page-item">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="page-link">
              <FaArrowLeft />
            </button>
          </li>
          {Array.from({ length: Math.ceil(FilteredData.length / perPage) }).map((_, index) => {
            if (index + 1 === currentPage || index + 2 === currentPage || index + 3 === currentPage || index === currentPage) {
              return (
                <li key={index} className="page-item ml-1">
                  <button onClick={() => paginate(index + 1)} className={`page-link ${currentPage === index + 1 ? 'active' : ''}`} style={{
                    backgroundColor: currentPage === index + 1 ? '#ffb900' : 'transparent',
                    borderColor: currentPage === index + 1 ? '#ffb900' : 'transparent',
                  }}>
                    {index + 1}
                  </button>
                </li>
              );
            } else if (index === currentPage - 4 || index === currentPage + 2) {
              return <li key={index} className="li-ellipsis">...</li>;
            }
            return null;
          })}
          <li className="page-item">
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(FilteredData.length / perPage)} className="page-link">
              <FaArrowRight />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default CompanyListAdmin;













































































































































































































































































































