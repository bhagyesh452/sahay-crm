import React, { useState, useEffect } from "react";
import "../../dist/css/tabler.min.css?1684106062";
import "../../dist/css/tabler-payments.min.css?1684106062";
import "../../dist/css/tabler-vendors.min.css?1684106062";
import "../../dist/css/demo.min.css?1684106062";
import axios from 'axios';
import io from 'socket.io-client';
import Swal from "sweetalert2";



const StatusDropdown = ({ mainStatus,
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
  brochureStatus
}) => {
  const [status, setStatus] = useState(subStatus);
  const [statusClass, setStatusClass] = useState("");
  const secretKey = process.env.REACT_APP_SECRET_KEY;



  const handleStatusChange = async (newStatus, statusClass) => {
    setStatus(newStatus);
    setStatusClass(statusClass);
    setNewSubStatus(newStatus);
    console.log("newStatus", newStatus)

    try {
      let response;
      let movedFromMainCategoryStatus;
      let movedToMainCategoryStatus;
      if (mainStatus === "General") {
        movedFromMainCategoryStatus = "General";
        movedToMainCategoryStatus = "Process";
        response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification-changegeneral`, {
          companyName,
          serviceName,
          subCategoryStatus: newStatus,
          mainCategoryStatus: "Process",
          previousMainCategoryStatus: "General",
          previousSubCategoryStatus: newStatus,
          dateOfChangingMainStatus: new Date(),
          movedFromMainCategoryStatus: movedFromMainCategoryStatus,
          movedToMainCategoryStatus: movedToMainCategoryStatus
        });
        //console.log("movedfromstatus" , movedFromMainCategoryStatus , movedToMainCategoryStatus)
      }
      else if (mainStatus === "Process") {
        if (newStatus === "Submitted") {
          if (serviceName === "Start-Up India Certificate" && !industry && !sector) {
            Swal.fire({
              title: "Error",
              text: "Please select industry and sector first",
              icon: "warning",
              button: "OK",
            });
            setStatus("Process");
            setStatusClass(statusClass);
            setNewSubStatus("Process");
            return;
          } else if (writername !== "Not Applicable" && (contentStatus !== "Completed" && contentStatus !== "Approved")) {
            Swal.fire({
              title: "Error",
              text: "Content status must be Completed or Approved",
              icon: "warning",
              button: "OK",
            });
            setStatus("Process");
            setStatusClass(statusClass);
            setNewSubStatus("Process");
            return;
          } else if (designername && designername !== "Not Applicable" && (brochureStatus !== "Completed" && brochureStatus !== "Approved")) {
            Swal.fire({
              title: "Error",
              text: "Brochure status must be Completed or Approved",
              icon: "warning",
              button: "OK",
            });
            setStatus("Process");
            setStatusClass(statusClass);
            setNewSubStatus("Process");
            return;
          } else {
            movedFromMainCategoryStatus = "Process";
            movedToMainCategoryStatus = "Submitted";
            response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
              companyName,
              serviceName,
              subCategoryStatus: newStatus,
              mainCategoryStatus: "Submitted",
              previousMainCategoryStatus: "Process",
              previousSubCategoryStatus: newStatus,
              movedFromMainCategoryStatus: movedFromMainCategoryStatus,
              movedToMainCategoryStatus: movedToMainCategoryStatus,
            });
          }
        } else if (newStatus === "Defaulter") {
            movedFromMainCategoryStatus = "Process";
            movedToMainCategoryStatus = "Defaulter";
            response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
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
            response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
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
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,

            //mainCategoryStatus: "Defaulter",
          });
        } else if (newStatus === "Ready To Submit") {
          if (serviceName === "Start-Up India Certificate" && !industry && !sector) {
            Swal.fire({
              title: "Error",
              text: "Please select industry and sector first",
              icon: "warning",
              button: "OK",
            });
            setStatus("Process");
            setStatusClass(statusClass);
            setNewSubStatus("Process");
          } else if (writername !== "Not Applicable" && (contentStatus !== "Completed" && contentStatus !== "Approved")) {
            Swal.fire({
              title: "Error",
              text: "Content status must be Completed or Approved",
              icon: "warning",
              button: "OK",
            });
            setStatus("Process");
            setStatusClass(statusClass);
            setNewSubStatus("Process");
            return;
          } else if (designername && designername !== "Not Applicable" && (brochureStatus !== "Completed" && brochureStatus !== "Approved")) {
            Swal.fire({
              title: "Error",
              text: "Brochure status must be Completed or Approved",
              icon: "warning",
              button: "OK",
            });
            setStatus("Process");
            setStatusClass(statusClass);
            setNewSubStatus("Process");
            return;
          } else {
            movedFromMainCategoryStatus = "Process";
            movedToMainCategoryStatus = "Ready To Submit";
            response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
              companyName,
              serviceName,
              subCategoryStatus: newStatus,
              mainCategoryStatus: "Ready To Submit",
              previousMainCategoryStatus: "Process",
              previousSubCategoryStatus: newStatus,
              movedFromMainCategoryStatus: movedFromMainCategoryStatus,
              movedToMainCategoryStatus: movedToMainCategoryStatus,
            });
          }
        } else {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Process"
          });
        }
      } 
      else if (mainStatus === "Ready To Submit") {
        if (newStatus === "Submitted") {
          movedFromMainCategoryStatus = "Ready To Submit";
          movedToMainCategoryStatus = "Submitted";
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Submitted",
            previousMainCategoryStatus: "Ready To Submit",
            previousSubCategoryStatus: newStatus,
            movedFromMainCategoryStatus: movedFromMainCategoryStatus,
            movedToMainCategoryStatus: movedToMainCategoryStatus,
            lastAttemptSubmitted: "1st"
          });
        } else if (newStatus === "Defaulter") {
          movedFromMainCategoryStatus = "Ready To Submit";
          movedToMainCategoryStatus = "Defaulter";
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Defaulter",
            previousMainCategoryStatus: "Ready To Submit",
            previousSubCategoryStatus: newStatus,
            movedFromMainCategoryStatus: movedFromMainCategoryStatus,
            movedToMainCategoryStatus: movedToMainCategoryStatus,
          });
        } else if (newStatus === "Hold") {
          movedFromMainCategoryStatus = "Ready To Submit";
          movedToMainCategoryStatus = "Hold";
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Hold",
            previousMainCategoryStatus: "Ready To Submit",
            previousSubCategoryStatus: newStatus,
            movedFromMainCategoryStatus: movedFromMainCategoryStatus,
            movedToMainCategoryStatus: movedToMainCategoryStatus,
          });
        } else if (newStatus === "Undo") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            //mainCategoryStatus: "Defaulter",
          });
        }
        else if (newStatus === "Ready To Submit") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Ready To Submit",
          });
        } else {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Ready To Submit"
          });
        }
      } 
      else if (mainStatus === "Submitted") {
        if (newStatus === "Approved") {
          movedFromMainCategoryStatus = "Submitted";
          movedToMainCategoryStatus = "Approved";
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Approved",
            previousMainCategoryStatus: "Submitted",
            previousSubCategoryStatus: newStatus,
            movedFromMainCategoryStatus: movedFromMainCategoryStatus,
            movedToMainCategoryStatus: movedToMainCategoryStatus,
          });
        } else if (newStatus === "Defaulter") {
          movedFromMainCategoryStatus = "Submitted";
          movedToMainCategoryStatus = "Defaulter";
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Defaulter",
            previousMainCategoryStatus: "Submitted",
            previousSubCategoryStatus: newStatus,
            movedFromMainCategoryStatus: movedFromMainCategoryStatus,
            movedToMainCategoryStatus: movedToMainCategoryStatus,
          });
        } else if (newStatus === "Undo") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            //mainCategoryStatus: "Defaulter",
          });
        } else if (newStatus === "2nd Time Submitted") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            ThirdTimeSubmitDate: new Date(),
            SecondTimeSubmitDate: new Date(),
            lastAttemptSubmitted: "2nd",
            //mainCategoryStatus: "Defaulter",
          });
        } else if (newStatus === "3rd Time Submitted") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            ThirdTimeSubmitDate: new Date(),
            SecondTimeSubmitDate: new Date(),
            lastAttemptSubmitted: "3rd"
            //mainCategoryStatus: "Defaulter",
          });
        }
        else {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Submitted",
            latestUpdateDate: new Date()
          });
        }
      }
      else if (mainStatus === "Defaulter") {
        if (newStatus === "Working") {
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Process"
          });
        } else if (newStatus === "Hold") {
          movedFromMainCategoryStatus = "Defaulter";
          movedToMainCategoryStatus = "Hold";
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
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
          movedFromMainCategoryStatus = "Hold";
          movedToMainCategoryStatus = "Defaulter";
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
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
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: "Process"
          });
        } else if (newStatus === "Submitted") {
          movedFromMainCategoryStatus = "Hold";
          movedToMainCategoryStatus = "Defaulter";
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: newStatus,
            previousMainCategoryStatus: "Hold",
            previousSubCategoryStatus: newStatus,
            movedFromMainCategoryStatus: movedFromMainCategoryStatus,
            movedToMainCategoryStatus: movedToMainCategoryStatus,
            lastAttemptSubmitted: "1st"
          });
        } else if (newStatus === "Process") {
          movedFromMainCategoryStatus = "Hold";
          movedToMainCategoryStatus = "Defaulter";
          response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            companyName,
            serviceName,
            subCategoryStatus: newStatus,
            mainCategoryStatus: newStatus,
            previousMainCategoryStatus: "Hold",
            previousSubCategoryStatus: newStatus,
            movedFromMainCategoryStatus: movedFromMainCategoryStatus,
            movedToMainCategoryStatus: movedToMainCategoryStatus,
          });
        }
      }
      refreshData();
      console.log("Status updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating status:", error.message);
    }
  };


  console.log("status all content and brochure", writername, designername, contentStatus, brochureStatus)



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
      case "Ready To Submit":
        switch (subStatus) {
          case "Ready To Submit":
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



  // useEffect(() => {
  //   //console.log("useEffect triggered");

  //   const updateStatus = async () => {
  //     if ( contentStatus === "Approved" && brochureStatus === "Approved") {
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
  // }, [contentStatus, brochureStatus ,tabStopCondition]);

  // useEffect(() => {
  //   // Function to update status
  //   const updateStatus = async (newStatus, nextTab) => {
  //     if (contentStatus === "Approved" && brochureStatus === "Approved") {
  //       try {
  //         // Log to verify that the function is called
  //         console.log("Updating status...");

  //         const response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
  //           companyName,
  //           serviceName,
  //           subCategoryStatus: newStatus,
  //           mainCategoryStatus: newStatus,
  //           previousMainCategoryStatus: mainStatus,
  //           previousSubCategoryStatus: status,
  //           activeTab: nextTab
  //         });

  //         setActiveTab(nextTab);

  //         // Log to verify the response
  //         console.log("Status updated successfully:", response.data);

  //         if (response.status === 200) {
  //           // Ensure refreshData is called correctly
  //           console.log("Calling refreshData");
  //           await refreshData();
  //         } else {
  //           console.error("Failed to update status:", response.status);
  //         }
  //       } catch (error) {
  //         console.error("Error updating status:", error.message);
  //       }
  //     }
  //   };

  //   if (activeTabCurrent === "Submitted" || activeTabCurrent === "Process") {
  //     updateStatus("Ready To Submit", "Ready To Submit");
  //   } else if (activeTabCurrent === "ReadyToSubmit") {
  //     updateStatus(status, "Submitted");
  //   }
  // }, [contentStatus, brochureStatus, activeTabCurrent,mainStatus]);








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
                onClick={() => handleStatusChange("Ready To Submit", "ready_to_submit")}
                href="#"
              >
                Ready To Submit
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
        ) : mainStatus === "Ready To Submit" ? (
          <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Ready To Submit", "ready_to_submit")}
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