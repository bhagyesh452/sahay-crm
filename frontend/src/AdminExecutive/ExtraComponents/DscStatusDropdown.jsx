import React, { useState, useEffect } from 'react';
import "../../dist/css/tabler.min.css?1684106062";
import "../../dist/css/tabler-payments.min.css?1684106062";
import "../../dist/css/tabler-vendors.min.css?1684106062";
import "../../dist/css/demo.min.css?1684106062";
import axios from 'axios';
import io from 'socket.io-client';
import Swal from "sweetalert2";

const DscStatusDropdown = ({
  mainStatus,
  subStatus,
  setNewSubStatus,
  companyName,
  serviceName,
  refreshData,
  industry,
  sector,
  writername,
  designername,
  contentStatus,
  brochureStatus,
  dscType,
  dscValidity,
  dscPortal,
  letterStatus
}) => {

  console.log("letterStatus", letterStatus, companyName, subStatus)



  // State to manage the selected status and the corresponding CSS class
  const [status, setStatus] = useState(subStatus);
  const [statusClass, setStatusClass] = useState("");
  const secretKey = process.env.REACT_APP_SECRET_KEY;

  // Function to handle the dropdown item click
  const handleStatusChange = async (newStatus, statusClass) => {
    setStatus(newStatus);
    setStatusClass(statusClass);
    setNewSubStatus(newStatus);
    try {
      let response;
      let movedFromMainCategoryStatus;
      let movedToMainCategoryStatus;
      if (mainStatus === "General") {
        movedFromMainCategoryStatus = "General";
        movedToMainCategoryStatus = "Process";
        let expenseReimbursementStatus = "Unpaid"
        response = await axios.post(`${secretKey}/rm-services/update-substatus-adminexecutive-changegeneral`, {
          companyName,
          serviceName,
          subCategoryStatus: newStatus,
          mainCategoryStatus: "Process",
          previousMainCategoryStatus: "General",
          previousSubCategoryStatus: newStatus,
          dateOfChangingMainStatus: new Date(),
          movedFromMainCategoryStatus: movedFromMainCategoryStatus,
          movedToMainCategoryStatus: movedToMainCategoryStatus,
          expenseReimbursementStatus: expenseReimbursementStatus,
        });
        //console.log("movedfromstatus" , movedFromMainCategoryStatus , movedToMainCategoryStatus)
      } else if (mainStatus === "Process") {
        if (newStatus === "Defaulter") {
          movedFromMainCategoryStatus = "Process";
          movedToMainCategoryStatus = "Defaulter";
          response = await axios.post(`${secretKey}/rm-services/update-substatus-adminexecutive`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Defaulter",
            previousMainCategoryStatus: "Process",
            previousSubCategoryStatus: newStatus,
            movedFromMainCategoryStatus: movedFromMainCategoryStatus,
            movedToMainCategoryStatus: movedToMainCategoryStatus,
          });
        } else if (newStatus === "Hold") {
          movedFromMainCategoryStatus = "Process";
          movedToMainCategoryStatus = "Hold";
          response = await axios.post(`${secretKey}/rm-services/update-substatus-adminexecutive`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Hold",
            previousMainCategoryStatus: "Process",
            previousSubCategoryStatus: newStatus,
            movedFromMainCategoryStatus: movedFromMainCategoryStatus,
            movedToMainCategoryStatus: movedToMainCategoryStatus,
          });
        } else if (newStatus === "Undo") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-adminexecutive`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,

            //mainCategoryStatus: "Defaulter",
          });
        } else if (newStatus === "Application Submitted") {
          const conditions = {
            letterStatus: letterStatus === "Not Started",
            dscPortal: !dscPortal,
            dscType: dscType === "Not Applicable",
            dscValidity: !dscValidity

            // industryAndSector: serviceName === "Start-Up India Certificate" && !industry && !sector,
            // contentStatus: writername !== "Not Applicable" && (contentStatus !== "Completed" && contentStatus !== "Approved"),
            // brochureStatus: designername && designername !== "Not Applicable" && (brochureStatus !== "Completed" && brochureStatus !== "Approved")
          };
          const messages = [];

          // Check each condition and add appropriate messages
          if (conditions.letterStatus) {
            messages.push("Please select Letter Status!");
          }

          if (conditions.dscPortal) {
            messages.push("Please Select DSC Portal");
          }

          if (conditions.dscType) {
            messages.push("Please Select DSC Type");
          }
          if (conditions.dscValidity) {
            messages.push("Please Select DSC Validity");
          }
          if (messages.length > 0) {
            const title = "Error";
            const text = messages.join(" <br> ");
            Swal.fire({
              title: title,
              html: text,
              icon: "warning",
              button: "OK",
            }).then(() => {
              // Reset status and class only if conditions are met
              setStatus(subStatus);
              setStatusClass(statusClass);
              setNewSubStatus(subStatus);
            });
          } else {
            movedFromMainCategoryStatus = "Process";
            movedToMainCategoryStatus = "Application Submitted";
            response = await axios.post(`${secretKey}/rm-services/update-substatus-adminexecutive`, {
              companyName,
              serviceName,
              subCategoryStatus: newStatus,
              mainCategoryStatus: "Application Submitted",
              previousMainCategoryStatus: "Process",
              previousSubCategoryStatus: newStatus,
              movedFromMainCategoryStatus: movedFromMainCategoryStatus,
              movedToMainCategoryStatus: movedToMainCategoryStatus,
              approvalTime: new Date()
            });
          }
        } else {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-adminexecutive`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Process"
          });
        }
      } else if (mainStatus === "Application Submitted") {
        if (newStatus === "Approved") {
          movedFromMainCategoryStatus = "Application Submitted";
          movedToMainCategoryStatus = "Approved";
          response = await axios.post(`${secretKey}/rm-services/update-substatus-adminexecutive`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Approved",
            previousMainCategoryStatus: "Application Submitted",
            previousSubCategoryStatus: newStatus,
            movedFromMainCategoryStatus: movedFromMainCategoryStatus,
            movedToMainCategoryStatus: movedToMainCategoryStatus,
          });
        } else if (newStatus === "Hold") {
          movedFromMainCategoryStatus = "Application Submitted";
          movedToMainCategoryStatus = "Hold";
          response = await axios.post(`${secretKey}/rm-services/update-substatus-adminexecutive`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Hold",
            previousMainCategoryStatus: "Application Submitted",
            previousSubCategoryStatus: newStatus,
            movedFromMainCategoryStatus: movedFromMainCategoryStatus,
            movedToMainCategoryStatus: movedToMainCategoryStatus,
          });
        } else if (newStatus === "Defaulter") {
          movedFromMainCategoryStatus = "Application Submitted";
          movedToMainCategoryStatus = "Defaulter";
          response = await axios.post(`${secretKey}/rm-services/update-substatus-adminexecutive`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Defaulter",
            previousMainCategoryStatus: "Application Submitted",
            previousSubCategoryStatus: newStatus,
            movedFromMainCategoryStatus: movedFromMainCategoryStatus,
            movedToMainCategoryStatus: movedToMainCategoryStatus,
          });
        } else if (newStatus === "Undo") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-adminexecutive`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            //mainCategoryStatus: "Defaulter",
          });
        } else {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-adminexecutive`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Application Submitted",
          });
        }
      }
      else if (mainStatus === "Defaulter") {
        if (newStatus === "Working") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-adminexecutive`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Process"
          });
        } else if (newStatus === "Hold") {
          movedFromMainCategoryStatus = "Defaulter";
          movedToMainCategoryStatus = "Hold";
          response = await axios.post(`${secretKey}/rm-services/update-substatus-adminexecutive`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Hold",
            previousMainCategoryStatus: "Defaulter",
            previousSubCategoryStatus: newStatus,
            movedFromMainCategoryStatus: movedFromMainCategoryStatus,
            movedToMainCategoryStatus: movedToMainCategoryStatus,
          });
        } else if (newStatus === "Undo") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-adminexecutive`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            //mainCategoryStatus: "Defaulter",
          });
        } else {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-adminexecutive`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Defaulter"
          });
        }
      }
      else if (mainStatus === "Hold") {
        if (newStatus === "Hold") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-adminexecutive`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Hold"
          });
        } else if (newStatus === "Undo") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-adminexecutive`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            //mainCategoryStatus: "Defaulter",
          });
        } else if (newStatus === "Defaulter") {
          movedFromMainCategoryStatus = "Hold";
          movedToMainCategoryStatus = "Defaulter";
          response = await axios.post(`${secretKey}/rm-services/update-substatus-adminexecutive`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: newStatus,
            previousMainCategoryStatus: "Hold",
            previousSubCategoryStatus: newStatus,
            movedFromMainCategoryStatus: movedFromMainCategoryStatus,
            movedToMainCategoryStatus: movedToMainCategoryStatus,
          });
        } else if (newStatus === "Working") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-adminexecutive`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Process"
          });
        } else {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-adminexecutive`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Hold"
          });
        }
      }
      refreshData();
      console.log("Status updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating status:", error.message);
    }
  };

  const getStatusClass = (mainStatus, subStatus) => {
    switch (mainStatus) {
      case "General":
        switch (subStatus) {
          case "Call Done Docs Pending":
            return "untouched_status";
          case "Client Not Responding":
            return "cdbp-status";
          case "Need To Call":
            return "clnt_no_repond_status";
          case "Working":
            return "support-status";
          case "Defaulter":
            return "support-status";
          case "Hold":
            return "support-status";
          default:
            return "";
        }
      case "Process":
        switch (subStatus) {
          case "Call Done Docs Pending":
            return "untouched_status";
          case "Client Not Responding":
            return "cdbp-status";
          case "Need To Call":
            return "clnt_no_repond_status";
          case "Working":
            return "support-status";
          case "Hold":
            return "support-status";
          case "KYC Pending":
            return "support-status";
          case "KYC Rejected":
            return "need_to_call";
          case "KYC Incomplete":
            return "created-status";
          case "Approved":
            return "support-status";
          case "Defaulter":
            return "support-status";
          case "Undo":
            return "need_to_call";
          case "Application Pending":
            return "untouched_status";
          default:
            return "";
        }
      case "Defaulter":
        switch (subStatus) {
          case "Call Done Docs Pending":
            return "untouched_status";
          case "Client Not Responding":
            return "cdbp-status";
          case "Need To Call":
            return "clnt_no_repond_status";
          case "Working":
            return "support-status";
          case "Hold":
            return "support-status";
          case "KYC Pending":
            return "support-status";
          case "KYC Rejected":
            return "need_to_call";
          case "KYC Incomplete":
            return "created-status";
          case "Approved":
            return "support-status";
          case "Defaulter":
            return "support-status";
          case "Undo":
            return "need_to_call";
          default:
            return "";
        }
      case "Application Submitted":
        switch (subStatus) {
          case "KYC Rejected":
            return "need_to_call";
          case "KYC Incomplete":
            return "created-status";
          case "Approved":
            return "support-status";
        }
      case "Hold":
        switch (subStatus) {
          case "Call Done Docs Pending":
            return "untouched_status";
          case "Client Not Responding":
            return "cdbp-status";
          case "Need To Call":
            return "clnt_no_repond_status";
          case "Working":
            return "support-status";
          case "Hold":
            return "support-status";
          case "KYC Pending":
            return "support-status";
          case "KYC Rejected":
            return "need_to_call";
          case "KYC Incomplete":
            return "created-status";
          case "Approved":
            return "support-status";
          case "Defaulter":
            return "support-status";
          case "Undo":
            return "need_to_call";
          default:
            return "";
        }
      default:
        return "";
    }
  };

  useEffect(() => {
    setStatusClass(getStatusClass(mainStatus, subStatus));
  }, [mainStatus, subStatus]);








  return (
    <section className="rm_status_dropdown">
      <div className={`dropdown custom-dropdown status_dropdown ${statusClass}`}>
        <button
          className="btn dropdown-toggle w-100 d-flex align-items-center justify-content-between status__btn"
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {subStatus}
        </button>
        {mainStatus === "General" ? (
          <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
            <li>
              <a className="dropdown-item" onClick={() => handleStatusChange('Call Done Docs Pending', 'untouched_status')} href="#">
                Call Done Docs Pending
              </a>
            </li>
            <li>
              <a className="dropdown-item" onClick={() => handleStatusChange('Client Not Responding', 'cdbp-status')} href="#">
                Client Not Responding
              </a>
            </li>
            <li>
              <a className="dropdown-item" onClick={() => handleStatusChange('Need To Call', 'clnt_no_repond_status')} href="#">
                Need To Call
              </a>
            </li>
            <li>
              <a className="dropdown-item" onClick={() => handleStatusChange('Working', 'support-status')} href="#">
                Working
              </a>
            </li>

            {/* <li>
              <a className="dropdown-item" onClick={() => handleStatusChange('Hold', 'support-status')} href="#">
                Hold
              </a>
            </li>
            <li>
              <a className="dropdown-item" onClick={() => handleStatusChange('Defaulter', 'support-status')} href="#">
                Defaulter
              </a>
            </li> */}
          </ul>
        ) : mainStatus === "Process" ? (
          <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Call Done Docs Pending", "untouched_status")}
                href="#"
              >
                Call Done Docs Pending
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Client Not Responding", "cdbp-status")}
                href="#"
              >
                Client Not Responding
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange(" Need To Call", "clnt_no_repond_status")}
                href="#"
              >
                Need To Call
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Application Pending", "untouched_status")}
                href="#"
              >
                Application Pending
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Application Submitted", "untouched_status")}
                href="#"
              >
                Application Submitted
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Working", "support-status")}
                href="#"
              >
                Working
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Hold", "inprogress-status")}
                href="#"
              >
                Hold
              </a>
            </li>
            <li>
              <a className="dropdown-item" onClick={() => handleStatusChange('Defaulter', 'support-status')} href="#">
                Defaulter
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Undo", "e_task_assign")}
                href="#"
              >
                Undo
              </a>
            </li>
          </ul>
        ) : mainStatus === "Application Submitted" ? (
          <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("KYC Pending", "support-status")}
                href="#"
              >
                KYC Pending
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("KYC Rejected", "need_to_call")}
                href="#"
              >
                KYC Rejected
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("KYC Incomplete", "created-status")}
                href="#"
              >
                KYC Incomplete
              </a>
            </li>
            <li>
              <a className="dropdown-item" onClick={() => handleStatusChange('Approved', 'support-status')} href="#">
                Approved
              </a>
            </li>
            <li>
              <a className="dropdown-item" onClick={() => handleStatusChange('Defaulter', 'support-status')} href="#">
                Defaulter
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Hold", "inprogress-status")}
                href="#"
              >
                Hold
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Undo", "e_task_assign")}
                href="#"
              >
                Undo
              </a>
            </li>
          </ul>
        ) : mainStatus === "Hold" ? (
          <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Call Done Docs Pending", "untouched_status")}
                href="#"
              >
                Call Done Docs Pending
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Client Not Responding", "cdbp-status")}
                href="#"
              >
                Client Not Responding
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange(" Need To Call", "clnt_no_repond_status")}
                href="#"
              >
                Need To Call
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Working", "support-status")}
                href="#"
              >
                Working
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Hold", "inprogress-status")}
                href="#"
              >
                Hold
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("KYC Pending", "support-status")}
                href="#"
              >
                KYC Pending
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("KYC Rejected", "need_to_call")}
                href="#"
              >
                KYC Rejected
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("KYC Incomplete", "created-status")}
                href="#"
              >
                KYC Incomplete
              </a>
            </li>
            <li>
              <a className="dropdown-item" onClick={() => handleStatusChange('Approved', 'support-status')} href="#">
                Approved
              </a>
            </li>
            <li>
              <a className="dropdown-item" onClick={() => handleStatusChange('Defaulter', 'support-status')} href="#">
                Defaulter
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Undo", "e_task_assign")}
                href="#"
              >
                Undo
              </a>
            </li>
          </ul>
        ) : mainStatus === "Defaulter" && (
          <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Call Done Docs Pending", "untouched_status")}
                href="#"
              >
                Call Done Docs Pending
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Client Not Responding", "cdbp-status")}
                href="#"
              >
                Client Not Responding
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange(" Need To Call", "clnt_no_repond_status")}
                href="#"
              >
                Need To Call
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Working", "support-status")}
                href="#"
              >
                Working
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Hold", "inprogress-status")}
                href="#"
              >
                Hold
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("KYC Pending", "support-status")}
                href="#"
              >
                KYC Pending
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("KYC Rejected", "need_to_call")}
                href="#"
              >
                KYC Rejected
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("KYC Incomplete", "created-status")}
                href="#"
              >
                KYC Incomplete
              </a>
            </li>
            <li>
              <a className="dropdown-item" onClick={() => handleStatusChange('Approved', 'support-status')} href="#">
                Approved
              </a>
            </li>
            <li>
              <a className="dropdown-item" onClick={() => handleStatusChange('Defaulter', 'support-status')} href="#">
                Defaulter
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Undo", "e_task_assign")}
                href="#"
              >
                Undo
              </a>
            </li>
          </ul>
        )}
      </div>
    </section>
  );
};

export default DscStatusDropdown;
