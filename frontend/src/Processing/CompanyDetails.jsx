/*import React from "react";

const CompanyDetails = ({ company }) => {
  return (
    <div>
      <h3>Company Details</h3>
      {company ? (
        <div>
          <p>Name: {company.name}</p>
          <p>Email: {company.email}</p>
          <p>Details: {company.details}</p>
          Add more details as needed 
        </div>
      ) : (
        <p>Select a company from the list to view details.</p>
      )}
    </div>
  );
};

export default CompanyDetails;

import React from "react";

const CompanyDetails = ({ company }) => {
  return (
    <div>
      <h3>Company Details</h3>
      {company ? (
        <div>
          <p>Name: {company.companyName}</p>
          <p>Contact Number: {company.contactNumber}</p>
          <p>Email: {company.companyEmail}</p>
           Add more details as needed 
        </div>
      ) : (
        <p>Select a company from the list to view details.</p>
      )}
    </div>
  );
};

export default CompanyDetails;
import React from "react";

const CompanyDetails = ({ company }) => {
  return (
    <div>
      <h3>Company Details</h3>
      {company ? (
        <div>
          <p>Name: {company.bdmName}</p>
          <p>Email: {company.bdmEmail}</p>
          <p>Type: {company.bdmType}</p>
          <p>Supported By: {company.supportedBy ? "Yes" : "No"}</p>
          <p>Booking Date: {company.bookingDate}</p>
          <p>CA Case: {company.caCase}</p>
          <p>CA Number: {company.caNumber}</p>
          <p>CA Email: {company.caEmail}</p>
          <p>CA Commission: {company.caCommission}</p>
          <p>Company Name: {company.companyName}</p>
          <p>Contact Number: {company.contactNumber}</p>
          <p>Company Email: {company.companyEmail}</p>
          <p>Services: {company.services.join(", ")}</p>
          <p>Original Total Payment: {company.originalTotalPayment}</p>
          <p>Total Payment: {company.totalPayment}</p>
          <p>Payment Terms: {company.paymentTerms}</p>
          <p>Payment Method: {company.paymentMethod}</p>
          <p>First Payment: {company.firstPayment}</p>
          <p>Second Payment: {company.secondPayment}</p>
          <p>Third Payment: {company.thirdPayment}</p>
          <p>Fourth Payment: {company.fourthPayment}</p>
          <p>Payment Remarks: {company.paymentRemarks}</p>
          <p>Booking Source: {company.bookingSource}</p>
          <p>PAN or GST Number: {company.cPANorGSTnum}</p>
          <p>Inco Date: {company.incoDate}</p>
          <p>Extra Notes: {company.extraNotes}</p>
        </div>
      ) : (
        <p>Select a company from the list to view details.</p>
      )}
    </div>
  );
};

export default CompanyDetails;

import React from "react";

const CompanyDetails = ({ company }) => {
  return (
    <div>
      <h3 className="mb-4">Company Details</h3>
      {company ? (
        <form>
          <div className="table-responsive">
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th scope="row">BDM Name</th>
                  <td>{company.bdmName}</td>
                </tr>
                <tr>
                  <th scope="row">BDM Email</th>
                  <td>{company.bdmEmail}</td>
                </tr>
                <tr>
                  <th scope="row">BDM Type</th>
                  <td>{company.bdmType}</td>
                </tr>
                <tr>
                  <th scope="row">Supported By</th>
                  <td>{company.supportedBy ? "Yes" : "No"}</td>
                </tr>
                 Add similar rows for other fields 
              </tbody>
            </table>
          </div>
        </form>
      ) : (
        <p>Select a company from the list to view details.</p>
      )}
    </div>
  );
};

export default CompanyDetails;

import React from "react";

const CompanyDetails = ({ company }) => {
  return (
    <div className="border rounded p-4">
      {company ? (
        <form>
          <div className="table-responsive">
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th scope="row">BDM Name</th>
                  <td>{company.bdmName}</td>
                </tr>
                <tr>
                  <th scope="row">BDM Email</th>
                  <td>{company.bdmEmail}</td>
                </tr>
                <tr>
                  <th scope="row">BDM Type</th>
                  <td>{company.bdmType}</td>
                </tr>
                <tr>
                  <th scope="row">Supported By</th>
                  <td>{company.supportedBy ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <th scope="row">Booking Date</th>
                  <td>{company.bookingDate}</td>
                </tr>
                <tr>
                  <th scope="row">CA Case</th>
                  <td>{company.caCase}</td>
                </tr>
                <tr>
                  <th scope="row">CA Number</th>
                  <td>{company.caNumber}</td>
                </tr>
                <tr>
                  <th scope="row">CA Email</th>
                  <td>{company.caEmail}</td>
                </tr>
                <tr>
                  <th scope="row">CA Commission</th>
                  <td>{company.caCommission}</td>
                </tr>
                <tr>
                  <th scope="row">Company Name</th>
                  <td>{company.companyName}</td>
                </tr>
                <tr>
                  <th scope="row">Contact Number</th>
                  <td>{company.contactNumber}</td>
                </tr>
                <tr>
                  <th scope="row">Company Email</th>
                  <td>{company.companyEmail}</td>
                </tr>
                
                <tr>
                  <th scope="row">Company Email</th>
                  <td>{company.companyEmail}</td>
                </tr>
                
                <tr>
                  <th scope="row">Company Email</th>
                  <td>{company.companyEmail}</td>
                </tr>
                
                <tr>
                  <th scope="row">Company Email</th>
                  <td>{company.companyEmail}</td>
                </tr>
                    <tr>
                  <th scope="row">Company Email</th>
                  <td>{company.companyEmail}</td>
                </tr>
                
                <tr>
                  <th scope="row">Company Email</th>
                  <td>{company.companyEmail}</td>
                </tr>
                
                <tr>
                  <th scope="row">Company Email</th>
                  <td>{company.companyEmail}</td>
                </tr>
               
                <tr>
                  <th scope="row">Company Email</th>
                  <td>{company.companyEmail}</td>
                </tr>
             
                <tr>
                  <th scope="row">Company Email</th>
                  <td>{company.companyEmail}</td>
                </tr>
               
                <tr>
                  <th scope="row">Company Email</th>
                  <td>{company.companyEmail}</td>
                </tr>
               
                <tr>
                  <th scope="row">Company Email</th>
                  <td>{company.companyEmail}</td>
                </tr>
               
                <tr>
                  <th scope="row">Company Email</th>
                  <td>{company.companyEmail}</td>
                </tr>
              
              </tbody>
            </table>
          </div>
        </form>
      ) : (
        <p className="text-center">Select a company from the list to view details.</p>
      )}
    </div>
  );
};

export default CompanyDetails;*/


import React from "react";

const CompanyDetails = ({ company }) => {
  return (
    <div>
      <h3>Company Details</h3>
      {company ? (
        <div>
          <p>Name: {company.bdmName}</p>
          <p>Email: {company.bdmEmail}</p>
          <p>Type: {company.bdmType}</p>
          <p>Supported By: {company.supportedBy ? "Yes" : "No"}</p>
          <p>Booking Date: {company.bookingDate}</p>
          <p>CA Case: {company.caCase}</p>
          <p>CA Number: {company.caNumber}</p>
          <p>CA Email: {company.caEmail}</p>
          <p>CA Commission: {company.caCommission}</p>
          <p>Company Name: {company.companyName}</p>
          <p>Contact Number: {company.contactNumber}</p>
          <p>Company Email: {company.companyEmail}</p>
          <p>Services: {company.services.join(", ")}</p>
          <p>Original Total Payment: {company.originalTotalPayment}</p>
          <p>Total Payment: {company.totalPayment}</p>
          <p>Payment Terms: {company.paymentTerms}</p>
          <p>Payment Method: {company.paymentMethod}</p>
          <p>First Payment: {company.firstPayment}</p>
          <p>Second Payment: {company.secondPayment}</p>
          <p>Third Payment: {company.thirdPayment}</p>
          <p>Fourth Payment: {company.fourthPayment}</p>
          <p>Payment Remarks: {company.paymentRemarks}</p>
          <p>Booking Source: {company.bookingSource}</p>
          <p>PAN or GST Number: {company.cPANorGSTnum}</p>
          <p>Inco Date: {company.incoDate}</p>
          <p>Extra Notes: {company.extraNotes}</p>
        </div>
      ) : (
        <p>Select a company from the list to view details.</p>
      )}
    </div>
  );
};

export default CompanyDetails;





