import React, { useState } from "react";
import './style_processing/main_processing.css'
import { pdfuploader } from "../documents/pdf1.pdf";

// Other imports...

// Other imports...
const formatDate = (inputDate) => {
  const date = new Date(inputDate);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Note: Month is zero-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const CompanyDetails = ({ company }) => {
  const [pdfUrl, setPdfUrl] = useState(""); // Add this state variable
  const [formOpen , setformOpen] = useState(false); // Add this state variable

  // const handleViewPDF = () => {
  //   // Replace 'your-pdf-url' with the actual URL or logic to fetch the PDF URL
  //   const pdfUrl = '../documents/pdf1.pdf';
  //   setPdfUrl(pdfUrl);
  //   window.open(pdfUrl, '_blank', 'toolbar=0,location=0,menubar=0');
  //   console.log(pdfUrl)
  //   // Now, you can open a modal or redirect to a new page to display the PDF
  // };

  const handleViewPDF = () => {
    // Replace 'http://localhost:3001/api/pdf' with the actual API endpoint serving your PDF
    const pdfUrl = 'http://localhost:3001/api/pdf';
    window.open(pdfUrl, '_blank', 'toolbar=0,location=0,menubar=0');
  };

  return (
    <div className="card">
      <div className="card-header d-flex align-items-center cmpy-d-header">
        <h3 className="card-title">Booking Details</h3>
      </div>
      <div className="card-body cmpy-d-body">
        {company ? (
          <div className="datagrid cmpy-d-b-datagrid">
            {Object.entries(company)
              .filter(([key, value]) => key !== "_id" && (value || value === "")) // Exclude "id" field and empty/undefined values
              .map(([key, value]) => (
                // Render only if both key and value are present
                value && (
                  <div className="datagrid-item cmpy-d-b-datagriditem" key={key}>
                    <div className="datagrid-title">{key}</div>
                    <div className="datagrid-content">
                      {(key === "bookingDate" || key === "incoDate") ? formatDate(value) : value}
                    </div>
                  </div>
                )
              ))}
            {/* Add the "View PDF" button */}
            <div className="datagrid-item cmpy-d-b-datagriditem">
              <div className="datagrid-title">Actions</div>
              <div className="datagrid-content">
                <button className="btn btn-primary" onClick={handleViewPDF}>
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
























