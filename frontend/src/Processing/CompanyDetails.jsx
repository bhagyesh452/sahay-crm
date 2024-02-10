/*import React from "react";
import './style_processing/main_processing.css'

const CompanyDetails = ({ company }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Booking Details</h3>
      </div>
      <div className="card-body cmpy-d-b">
        {company ? (
          <div className="datagrid">
            {Object.entries(company).map(([key, value]) => (
              <div className="datagrid-item" key={key}>
                <div className="datagrid-title">{key}</div>
                <div className="datagrid-content">{value}</div>
              </div>
            ))}
          </div>
        ) : (
          <p>Select a company from the list to view details.</p>
        )}
      </div>
    </div>
  );
};

export default CompanyDetails;*/

import React from "react";
import './style_processing/main_processing.css'

// Other imports...

// Other imports...
const formatDatelatest = (inputDate) => {
  const date = new Date(inputDate);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Note: Month is zero-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const CompanyDetails = ({ company }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Booking Details</h3>
      </div>
      <div className="card-body cmpy-d-body">
        {company ? (
          <div className="datagrid cmpy-d-b-datagrid ">
            {Object.entries(company)
              .filter(([key, value]) => key !== "_id" && (value || value === "")) // Exclude "id" field and empty/undefined values
              .map(([key, value]) => (
                // Render only if both key and value are present
                value && (
                  <div className="datagrid-item cmpy-d-b-datagriditem " key={key}>
                    <div className="datagrid-title">{key}</div>
                    <div className="datagrid-content">
                      {/* Format date if key is "bookingDate" or "incoDate" */}
                      {/* {(key === "bookingDate" || key === "incoDate") ? new Date(value).toLocaleDateString() : value} */}
                      {(key === "bookingDate" || key === "incoDate") ? formatDatelatest(value) : value}
                    </div>
                  </div>
                )
              ))}
          </div>
        ) : (
          <p>Select a company from the list to view details.</p>
        )}
      </div>
    </div>
  );
};

export default CompanyDetails;













