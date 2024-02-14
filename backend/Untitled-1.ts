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


import React, { useState } from "react";
import './style_processing/main_processing.css'
import { pdfuploader } from "../documents/pdf1.pdf";
import Dashboard_processing from "./Dashboard_processing";
import { Link } from "react-router-dom";

const CompanyDetails = ({ company }) => {
  // const [field, setField] = useState(false)

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
    <div>
      <div className='card'>
        <div className="card-header">
          <div className="container-xl d-flex justify-content-between">
            <div className="row g-2">
              <div className="col">
                <h3 class="card-title">Booking Details</h3>
              </div>
            </div>
            <div className="row g-2">
              <div className="col">
                <Link to='/Processing/Dashboard_processing/addbookings'>
                  <button
                    className="btn btn-primary">
                    Add Booking
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="container-xl">
            <div className="bdesection d-flex align-items-center justify-content-between mt-1">
              <div className="row d-flex">
                <div className="d-flex">
                  {(company.bdeName || company.bdeName === " ") && (
                    <div className="datagrid-item bdeName d-flex align-items-center">
                      <div className="bde-title mr-1">BDE Name :</div>
                      <div className="bde-value">{company.bdeName}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="row g-2">
                <div className="col">
                {(company.bdeEmail || company.bdeEmail === " ") && (<div className="datagrid-item bdeEmail d-flex align-items-center">
                    <div className="bde-title mr-1">BDE Email :</div>
                    <div className="bde-value">{company.bdeEmail}</div>
                  </div>)}
                </div>
              </div>
            </div>
            <div className="bdmsection d-flex align-items-center justify-content-between mt-1">
              <div className="row d-flex">
                <div className="d-flex">
                  {(company.bdmName || company.bdmName === " ") && (
                    <div className="datagrid-item bdmName d-flex align-items-center">
                      <div className="bdm-title mr-1">BDM Name :</div>
                      <div className="bdm-value">{company.bdmName}({company.bdmType})</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="row g-2">
                <div className="col">
                {(company.bdmEmail || company.bdmEmail === " ") && (<div className="datagrid-item bdmEmail d-flex align-items-center">
                    <div className="bdm-title mr-1">BDM Email :</div>
                    <div className="bdm-value">{company.bdmEmail}</div>
                  </div>)}
                </div>
              </div>
            </div>
            <div className="booking-date-time d-flex align-items-center justify-content-between mt-1">
              <div className="row d-flex">
                <div className="d-flex">
                {(company.bookingDate || company.bookingDate === " ") && (
                    <div className="datagrid-item bookingDate d-flex align-items-center">
                      <div className="bookingdate-title mr-1">Booking Date :</div>
                      <div className="bookingdate-value">{formatDatelatest(company.bookingDate)}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="row g-2">
                <div className="col">
                {(company.bookingTime|| company.bookingtimee === " ") && ( <div className="datagrid-item bookingtime d-flex align-items-center">
                    <div className="bookingtime-title mr-1">Booking Time :</div>
                    <div className="bookingtime-value">{company.bookingTime}</div>
                  </div>)}
                </div>
              </div>
            </div>
          </div><hr></hr>
          <div className="bdesection d-flex align-items-center justify-content-between mt-1">
              <div className="row d-flex">
                <div className="d-flex">
                  {(company.bdeName || company.bdeName === " ") && (
                    <div className="datagrid-item bdeName d-flex align-items-center">
                      <div className="bde-title mr-1">BDE Name :</div>
                      <div className="bde-value">{company.bdeName}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="row g-2">
                <div className="col">
                {(company.bdeEmail || company.bdeEmail === " ") && (<div className="datagrid-item bdeEmail d-flex align-items-center">
                    <div className="bde-title mr-1">BDE Email :</div>
                    <div className="bde-value">{company.bdeEmail}</div>
                  </div>)}
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  )
};

export default CompanyDetails;

















