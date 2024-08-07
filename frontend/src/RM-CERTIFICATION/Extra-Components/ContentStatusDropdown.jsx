import React, { useState, useEffect } from "react";
import "../../dist/css/tabler.min.css?1684106062";
import "../../dist/css/tabler-payments.min.css?1684106062";
import "../../dist/css/tabler-vendors.min.css?1684106062";
import "../../dist/css/demo.min.css?1684106062";
import axios from 'axios';


const ContentStatusDropdown = ({ companyName, serviceName, mainStatus, contentStatus, writername, refreshData ,brochureStatus }) => {
  const [status, setStatus] = useState(contentStatus);
  const [statusClass, setStatusClass] = useState("untouched_status");
  const secretKey = process.env.REACT_APP_SECRET_KEY;


  const handleStatusChange = async (newStatus, statusClass) => {
    setStatus(newStatus);
    setStatusClass(statusClass);
    try {
      let response;
      if (mainStatus === "Process") {
        response = await axios.post(`${secretKey}/rm-services/update-content-rmofcertification`, {
          companyName,
          serviceName,
          contentStatus: newStatus
        });
      } else if (mainStatus === "Submitted") {
        response = await axios.post(`${secretKey}/rm-services/update-content-rmofcertification`, {
          companyName,
          serviceName,
          contentStatus: newStatus
        });
      } else if (mainStatus === "Defaulter") {
        response = await axios.post(`${secretKey}/rm-services/update-content-rmofcertification`, {
          companyName,
          serviceName,
          contentStatus: newStatus
        });
      } else if (mainStatus === "Approved") {
        response = await axios.post(`${secretKey}/rm-services/update-content-rmofcertification`, {
          companyName,
          serviceName,
          contentStatus: newStatus
        });
      } else if (mainStatus === "Hold") {
        response = await axios.post(`${secretKey}/rm-services/update-content-rmofcertification`, {
          companyName,
          serviceName,
          contentStatus: newStatus
        });
      } else if (mainStatus === "Ready To Submit") {
        response = await axios.post(`${secretKey}/rm-services/update-content-rmofcertification`, {
          companyName,
          serviceName,
          contentStatus: newStatus
        });
        //console.log("statuschange", contentStatus, companyName, serviceName)
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
      case "InApproved":
        return "rejected-status";
      case "Approved":
        return "approved-status";
      case "Not Applicable":
        return "e_task_assign";
      default:
        return "";
    }
  };

  useEffect(() => {
    if (writername === "Not Applicable") {
      setStatus("Not Applicable");
    } else {
      setStatus(contentStatus);
    }
  }, [contentStatus, writername]);

  useEffect(() => {
    setStatusClass(getStatusClass(contentStatus));
  }, [contentStatus]);

  // useEffect(() => {
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

  // console.log("contentstat" , contentStatus , brochureStatus)

  //console.log("writername", companyName, serviceName, writername, contentStatus)


  return (
    <section className="rm_status_dropdown">
      <div className={mainStatus === "Approved" ? "disabled" : `dropdown custom-dropdown status_dropdown ${statusClass}`}>
        <button
          className="btn dropdown-toggle w-100 d-flex align-items-center justify-content-between status__btn"
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle={!writername || writername === "Not Applicable" ? "Not Applicable" : "dropdown"} // Bootstrap data attribute to toggle dropdown// Bootstrap data attribute to toggle dropdown
          aria-expanded="false"
        >
          {status}
        </button>
        <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
          <li className={writername === "Drashti Thakkar" || "RonakKumar" ? "disabled" : ""}>
            <a
              className="dropdown-item"
              onClick={() => handleStatusChange("Not Applicable", "e_task_assign")}
              href="#"
              aria-disabled={writername === "Drashti Thakkar" || "RonakKumar"}
            >
              Not Applicable
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              onClick={() => handleStatusChange("Not Started", "untouched_status")}
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
              onClick={() => handleStatusChange("In Approval", "rejected-status")}
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
        </ul>
      </div>
    </section>
  );
};

export default ContentStatusDropdown;