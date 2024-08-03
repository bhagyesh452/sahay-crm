import React, { useState, useEffect } from "react";
import "../../dist/css/tabler.min.css?1684106062";
import "../../dist/css/tabler-payments.min.css?1684106062";
import "../../dist/css/tabler-vendors.min.css?1684106062";
import "../../dist/css/demo.min.css?1684106062";
import axios from 'axios';



const StatusDropdown = ({ mainStatus, subStatus, setNewSubStatus, companyName, serviceName, refreshData }) => {
  const [status, setStatus] = useState(subStatus);
  const [statusClass, setStatusClass] = useState("");
  const secretKey = process.env.REACT_APP_SECRET_KEY;


  const handleStatusChange = async (newStatus, statusClass) => {
    setStatus(newStatus);
    setStatusClass(statusClass);
    setNewSubStatus(newStatus);

    try {
      let response;
      if (mainStatus === "General") {
        response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification-changegeneral`, {
          companyName,
          serviceName,
          subCategoryStatus: newStatus,
          mainCategoryStatus: "Process",
          previousMainCategoryStatus: "General",
          previousSubCategoryStatus: newStatus,
          dateOfChangingMainStatus: new Date()
        });
      }
      else if (mainStatus === "Process") {
        if (newStatus === "Submitted") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Submitted",
            previousMainCategoryStatus: "Process",
            previousSubCategoryStatus: newStatus
          });
        } else if (newStatus === "Defaulter") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Defaulter",
            previousMainCategoryStatus: "Process",
            previousSubCategoryStatus: newStatus
          });
        } else if (newStatus === "Hold") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Hold",
            previousMainCategoryStatus: "Process",
            previousSubCategoryStatus: newStatus
          });
        } else if (newStatus === "Undo") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            //mainCategoryStatus: "Defaulter",
          });
        }
        else if (newStatus === "ReadyToSubmit") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "ReadyToSubmit",
          });
        } else {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Process"
          });
        }
      } 
      else if (mainStatus === "ReadyToSubmit") {
        if (newStatus === "Submitted") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Submitted",
            previousMainCategoryStatus: "ReadyToSubmit",
            previousSubCategoryStatus: newStatus
          });
        } else if (newStatus === "Defaulter") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Defaulter",
            previousMainCategoryStatus: "ReadyToSubmit",
            previousSubCategoryStatus: newStatus
          });
        } else if (newStatus === "Hold") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Hold",
            previousMainCategoryStatus: "ReadyToSubmit",
            previousSubCategoryStatus: newStatus
          });
        } else if (newStatus === "Undo") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            //mainCategoryStatus: "Defaulter",
          });
        }else if (newStatus === "Approved") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Approved",
          });
        }else if (newStatus === "ReadyToSubmit") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "ReadyToSubmit",
          });
        } else {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "ReadyToSubmit"
          });
        }
      } else if (mainStatus === "Submitted") {
        if (newStatus === "Approved") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Approved",
            previousMainCategoryStatus: "Submitted",
            previousSubCategoryStatus: newStatus
          });
        } else if (newStatus === "Defaulter") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Defaulter",
          });
        } else if (newStatus === "Undo") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            //mainCategoryStatus: "Defaulter",
          });
        } else {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Submitted"
          });
        }
      }
      else if (mainStatus === "Defaulter") {
        if (newStatus === "Working") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Defaulter"
          });
        } else if (newStatus === "Hold") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Hold"
          });
        } else if (newStatus === "Undo") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            //mainCategoryStatus: "Defaulter",
          });
        }
      }
      else if (mainStatus === "Hold") {
        if (newStatus === "Hold") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Hold"
          });
        } else if (newStatus === "Undo") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            //mainCategoryStatus: "Defaulter",
          });
        } else if (newStatus === "Defaulter") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: newStatus
          });
        } else if (newStatus === "Working") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Hold"
          });
        } else if (newStatus === "Submitted") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: newStatus
          });
        } else if (newStatus === "Process") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: newStatus
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
          case "Untouched":
            return "untouched_status";
          case "Call Done Brief Pending":
            return "cdbp-status";
          case "Client Not Responding":
            return "clnt_no_repond_status";
          case "Documents Pending":
            return "support-status";
          case "Need To Call":
            return "need_to_call";
          default:
            return "";
        }
      case "Process":
        switch (subStatus) {
          case "Call Done Brief Pending":
            return "cdbp-status";
          case "Client Not Responding":
            return "clnt_no_repond_status";
          case "Documents Pending":
            return "support-status";
          case "Ready To Submit":
            return "ready_to_submit";
          case "Submitted":
            return "submited-status";
          case "Working":
            return "inprogress-status";
          case "Defaulter":
            return "dfaulter-status";
          case "Hold":
            return "created-status";
          case "Need To Call":
            return "need_to_call";
          default:
            return "";
        }
      case "ReadyToSubmit":
        switch (subStatus) {
          case "ReadyToSubmit":
            return "ready_to_submit";
          case "Submitted":
            return "submited-status";
          case "Defaulter":
            return "dfaulter-status";
          case "Hold":
            return "created-status";
          case "Approved":
            return "approved-status";
          default:
            return "";
        }
      case "Submitted":
        switch (subStatus) {
          case "Submitted":
            return "submited-status";
          case "Incomplete":
            return "incomplete_status";
          case "Approved":
            return "approved-status";
          case "2nd Time Submitted":
            return "submited-status";
          case "3rd Time Submitted":
            return "submited-status";
          case "Rejected":
            return "rejected-status";
          case "Defaulter":
            return "dfaulter-status";
          default:
            return "";
        }
      case "Defaulter":
        switch (subStatus) {
          case "Working":
            return "inprogress-status";
          case "Defaulter":
            return "dfaulter-status";
          case "Hold":
            return "created-status";
          default:
            return "";
        }case "Hold":
        switch (subStatus) {
          case "Hold":
            return "created-status";
          case "Defaulter":
            return "dfaulter-status";
          case "Working":
            return "inprogress-status";
        }
      default:
        return "";
    }
  };

  useEffect(() => {
    setStatusClass(getStatusClass(mainStatus, subStatus));
  }, [mainStatus, subStatus]);


  //console.log("mainStatus" , mainStatus)

  return (
    <section className="rm_status_dropdown">
      <div className={`dropdown custom-dropdown status_dropdown ${statusClass}`}>
        <button
          className="btn dropdown-toggle w-100 d-flex align-items-center justify-content-between status__btn"
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown" // Bootstrap data attribute to toggle dropdown
          aria-expanded="false"
        >
          {status}
        </button>
        {mainStatus === "General" ? (
          <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Untouched", "untouched_status")}
                href="#"
              >
                Untouched
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Call Done Brief Pending", "cdbp-status")}
                href="#"
              >
                Call Done Brief Pending
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Client Not Responding", "clnt_no_repond_status")}
                href="#"
              >
                Client Not Responding
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Documents Pending", "support-status")}
                href="#"
              >
                Documents Pending
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Need To Call", "need_to_call")}
                href="#"
              >
                Need To Call
              </a>
            </li>
          </ul>
        ) : mainStatus === "Process" ? (
          <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Call Done Brief Pending", "cdbp-status")}
                href="#"
              >
                Call Done Brief Pending
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Client Not Responding", "clnt_no_repond_status")}
                href="#"
              >
                Client Not Responding
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Documents Pending", "support-status")}
                href="#"
              >
                Documents Pending
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("ReadyToSubmit", "ready_to_submit")}
                href="#"
              >
                Ready To Submit
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Submitted", "submited-status")}
                href="#"
              >
                Submitted
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Working", "inprogress-status")}
                href="#"
              >
                Working
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Defaulter", "dfaulter-status")}
                href="#"
              >
                Defaulter
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Need To Call", "need_to_call")}
                href="#"
              >
                Need To Call
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Hold", "created-status")}
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
        ) : mainStatus === "ReadyToSubmit" ? (
          <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("ReadyToSubmit", "ready_to_submit")}
                href="#"
              >
                Ready To Submit
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Submitted", "submited-status")}
                href="#"
              >
                Submitted
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
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Defaulter", "dfaulter-status")}
                href="#"
              >
                Defaulter
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Hold", "created-status")}
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
        ) : mainStatus === "Submitted" ? (
          <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Submitted", "submited-status")}
                href="#"
              >
                Submitted
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Incomplete", "incomplete_status")}
                href="#"
              >
                Incomplete
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
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("2nd Time Submitted", "submited-status")}
                href="#"
              >
                2nd Time Submitted
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("3rd Time Submitted", "submited-status")}
                href="#"
              >
                3rd Time Submitted
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Rejected", "rejected-status")}
                href="#"
              >
                Rejected
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Defaulter", "dfaulter-status")}
                href="#"
              >
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
        ) : mainStatus === "Hold" ? (
          <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Hold", "created-status")}
                href="#"
              >
                Hold
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Defaulter", "dfaulter-status")}
                href="#"
              >
                Defaulter
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Working", "inprogress-status")}
                href="#"
              >
                Working
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
                onClick={() => handleStatusChange("Working", "inprogress-status")}
                href="#"
              >
                Working
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Defaulter", "dfaulter-status")}
                href="#"
              >
                Defaulter
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Hold", "created-status")}
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
        )}


      </div>
    </section>
  );
};

export default StatusDropdown;