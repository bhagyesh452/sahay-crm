import React, { useState, useEffect } from "react";
import "../../dist/css/tabler.min.css?1684106062";
import "../../dist/css/tabler-payments.min.css?1684106062";
import "../../dist/css/tabler-vendors.min.css?1684106062";
import "../../dist/css/demo.min.css?1684106062";
import axios from 'axios';


const BrochureStatusDropdown = ({ companyName, serviceName, mainStatus, brochureStatus, designername , refreshData ,contentStatus}) => {
  const [status, setStatus] = useState(brochureStatus);
  const [statusClass, setStatusClass] = useState("created-status");
  const secretKey = process.env.REACT_APP_SECRET_KEY;


  const handleStatusChange = async (newStatus, statusClass) => {
    setStatus(newStatus);
    setStatusClass(statusClass);


    try {
      let response;
      if (mainStatus === "Process") {
        response = await axios.post(`${secretKey}/rm-services/update-brochure-rmofcertification`, {
          companyName,
          serviceName,
          brochureStatus: newStatus
        });
      } else if (mainStatus === "Submitted") {
        response = await axios.post(`${secretKey}/rm-services/update-brochure-rmofcertification`, {
          companyName,
          serviceName,
          brochureStatus: newStatus

        });
      } else if (mainStatus === "Defaulter") {
        response = await axios.post(`${secretKey}/rm-services/update-brochure-rmofcertification`, {
          companyName,
          serviceName,
          brochureStatus: newStatus

        });
      } else if (mainStatus === "Approved") {
        response = await axios.post(`${secretKey}/rm-services/update-brochure-rmofcertification`, {
          companyName,
          serviceName,
          brochureStatus: newStatus

        });
      } else if (mainStatus === "Hold") {
        response = await axios.post(`${secretKey}/rm-services/update-brochure-rmofcertification`, {
          companyName,
          serviceName,
          brochureStatus: newStatus

        });
      } else if (mainStatus === "Ready To Submit") {
        response = await axios.post(`${secretKey}/rm-services/update-brochure-rmofcertification`, {
          companyName,
          serviceName,
          brochureStatus: newStatus

        });
      }

      refreshData();
      //console.log("Status updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating status:", error.message);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Not Started":
        return "untouched_status";
      case "Working":
        return "need_to_call";
      case "Pending":
        return "inprogress-status";
      case "Completed":
        return "approved-status";
      case "In Approval":
        return "created-status";
      case "Approved":
        return "approved-status";
      case "Not Applicable":
        return "e_task_assign";
      default:
        return "created-status";
    }
  };

  useEffect(() => {
    setStatusClass(getStatusClass(brochureStatus));
  }, [brochureStatus]);

  // useEffect(() => {
  //   //console.log("useEffect triggered");

  //   const updateStatus = async () => {
  //     if (contentStatus === "Approved" && brochureStatus === "Approved") {
  //       try {
  //         //console.log("Updating status...");
  //         const response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
  //           companyName,
  //           serviceName,
  //           subCategoryStatus: "Ready To Submit",
  //           mainCategoryStatus: "Ready To Submit",
  //           previousMainCategoryStatus: mainStatus,
  //           previousSubCategoryStatus: status
  //         });
  //         ///console.log("Status updated successfully:", response.data);

  //         if (response.status === 200) {
  //           // Ensure refreshData is called correctly
  //           //console.log("Calling refreshData");
  //           await refreshData();
  //         } else {
  //           console.error("Failed to update status:", response.status);
  //         }
  //       } catch (error) {
  //         console.error("Error updating status:", error.message);
  //       }
  //     }
  //   };

  //   updateStatus();
  // }, [contentStatus, brochureStatus]);

  // console.log("brochurestat" , contentStatus , brochureStatus)


  return (
    <section className="rm_status_dropdown">
      <div className={mainStatus === "Approved" ? "disabled" : `dropdown custom-dropdown status_dropdown ${statusClass}`}>
        <button
          className="btn dropdown-toggle w-100 d-flex align-items-center justify-content-between status__btn"
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle={!designername || designername === "Not Applicable" ? "Not Applicable" : "dropdown"} // Bootstrap data attribute to toggle dropdown
          aria-expanded="false"
        >
          {status}
        </button>
        <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
          <li>
            <a
              className="dropdown-item"
              onClick={() => handleStatusChange("Not Started", "e_task_assign")}
              href="#"
            >
              Not Started
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              onClick={() => handleStatusChange("Working", "need_to_call")}
              href="#"
            >
              Working
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              onClick={() => handleStatusChange("Pending", "inprogress-status")}
              href="#"
            >
              Pending
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              onClick={() => handleStatusChange("Completed", "approved-status")}
              href="#"
            >
              Completed
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              onClick={() => handleStatusChange("In Approval", "created-status")}
              href="#"
            >
              In Approval

            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              onClick={() => handleStatusChange("Approved", "approved-status")}
              href="#"
            >
              Approved

            </a>
          </li>
          <li className={designername === "Drashti Thakkar" || "RonakKumar" ? "disabled" : ""}>
            <a
              className="dropdown-item"
              onClick={() => handleStatusChange("Not Applicable", "e_task_assign")}
              href="#"
              aria-disabled={designername === "Drashti Thakkar" || "RonakKumar"}
            >
              Not Applicable
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default BrochureStatusDropdown;