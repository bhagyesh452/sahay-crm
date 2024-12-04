import React, { useState, useEffect } from "react";
import "../../dist/css/tabler.min.css?1684106062";
import "../../dist/css/tabler-payments.min.css?1684106062";
import "../../dist/css/tabler-vendors.min.css?1684106062";
import "../../dist/css/demo.min.css?1684106062";
import axios from 'axios';
import io from 'socket.io-client';
import Swal from "sweetalert2";
import { CgClose } from "react-icons/cg";
import { FaCheck } from "react-icons/fa6";
import { options } from "../../components/Options.js";
import Select from "react-select";
import EmployeeInterestedInformationDialog from "./EmployeeInterestedInformationDialog.jsx";
import { FaWhatsapp } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

const EmployeeStatusChange = ({
  companyName,
  id,
  refetch,
  companyStatus,
  mainStatus,
  isDeletedEmployeeCompany,
  cemail,
  cindate,
  cnum,
  ename,
  bdmName,
  bdmAcceptStatus,
  handleFormOpen,
  teamData,
  isBdmStatusChange,
  bdmStatus,
  setOpenBacdrop,
  previousStatus,
  activeFilterFields
}) => {

  // console.log("activeFilterFields" , activeFilterFields)

  const secretKey = process.env.REACT_APP_SECRET_KEY;

  const [status, setStatus] = useState(isBdmStatusChange && bdmStatus ? bdmStatus : companyStatus);
  const [statusClass, setStatusClass] = useState("");
  const [showDialog, setShowDialog] = useState(false); // State to control popup visibility
  const [selectedStatus, setSelectedStatus] = useState(""); // Store the selected status for the popup confirmation

  const handlebdmStatusChange = async (newStatus, statusClass) => {

    setStatus(newStatus);
    setStatusClass(statusClass);

    const title = `${ename} changed ${companyName} status from ${companyStatus} to ${newStatus}`;
    const DT = new Date();
    const date = DT.toLocaleDateString();
    const time = DT.toLocaleTimeString();
    const bdmStatusChangeDate = new Date();
    // console.log("isDeletd", isDeletedEmployeeCompany);
    try {

      if (newStatus === "Matured") {
        handleFormOpen(companyName, cemail, cindate, id, cnum, isDeletedEmployeeCompany, ename, bdmName);
        // return true;
      } else {
        const response = await axios.post(`${secretKey}/bdm-data/bdm-status-change/${id}`, {
          bdeStatus: companyStatus,
          bdmnewstatus: newStatus,
          title: title,
          date: date,
          time: time,
          bdmStatusChangeDate: bdmStatusChangeDate,
        });
        //("bdmAcceptStatus", bdmAcceptStatus, newStatus);

        const response2 = await axios.post(`${secretKey}/company-data/update-status/${id}`, {
          newStatus,
          title,
          date,
          time,
          bdmAcceptStatus,
        });

        // Check if the API call was successful
        if (response2.status === 200) {
          refetch();
        } else {
          // Handle the case where the API call was not successful
          console.error("Failed to update status:", response.data.message);
        }
      }
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error("Error updating status:", error.message);
    }
  };

  const handleStatusChange = async (newStatus, statusClass) => {
    setStatus(newStatus);
    setStatusClass(statusClass);
    
    //setNewSubStatus(newStatus);
    if (newStatus === "Matured") {
      handleFormOpen(companyName, cemail, cindate, id, cnum, isDeletedEmployeeCompany, ename);
      return true;
    }

    // Assuming `data` is defined somewhere in your code
    const title = `${ename} changed ${companyName} status from ${companyStatus} to ${newStatus}`;
    const DT = new Date();
    const date = DT.toLocaleDateString();
    const time = DT.toLocaleTimeString();

    //console.log(bdmAcceptStatus, "bdmAcceptStatus");
    try {
      setOpenBacdrop(true)
      let response;
      if (bdmAcceptStatus === "Accept") {
        if (newStatus === "Interested" || newStatus === "FollowUp" || newStatus === "Busy" || newStatus === "Not Picked Up") {
          // response = await axios.delete(`${secretKey}/bdm-data/post-deletecompany-interested/${id}`);
          const response2 = await axios.post(`${secretKey}/company-data/update-status/${id}`, {
            newStatus,
            title,
            date,
            time,
            previousStatus
          });

        } else if (newStatus === "Junk") {
          response = await axios.post(`${secretKey}/bdm-data/post-update-bdmstatusfrombde/${id}`, {
            newStatus
          });
          const response2 = await axios.post(`${secretKey}/company-data/update-status/${id}`, {
            newStatus,
            title,
            date,
            time,
            companyStatus,
            previousStatus
          });
        }
      }

      // If response is not already defined, make the default API call
      if (!response) {
        response = await axios.post(`${secretKey}/company-data/update-status/${id}`, {
          newStatus,
          title,
          date,
          time,
          companyStatus,
          previousStatus
        });
      }

      // Check if the API call was successful
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Status updated successfully!',
          confirmButtonText: 'OK'
        });
        // Assuming `fetchNewData` is a function to fetch updated employee data
        refetch();
      } else {
        // Handle the case where the API call was not successful
        console.error("Failed to update status:", response.data.message);
      }
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error("Error updating status:", error.message);
    } finally {
      setOpenBacdrop(false)
    }
  };

  const handleUndoStatus = async (newStatus, statusClass) => {
    setStatus(newStatus);
    setStatusClass(statusClass);
    setOpenBacdrop(true);

    const title = `${ename} changed ${companyName} status from ${companyStatus} to ${newStatus}`;
    const DT = new Date();
    const date = DT.toLocaleDateString();
    const time = DT.toLocaleTimeString();

    try {
      const response = await axios.post(`${secretKey}/company-data/update-undo-status/${id}`, {
        newStatus,
        title,
        date,
        time,
        companyStatus,
        previousStatus,
        ename
      });

      // console.log("API Response:", response);

      // Check if the API call was successful
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Status updated successfully!',
          confirmButtonText: 'OK'
        });

        // Assuming `refetch` is a function to fetch updated employee data
        refetch();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'Failed to update status.',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error("Error Response:", error?.response?.data);
      console.error("Error Message:", error.message);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'An error occurred while updating the status.',
        confirmButtonText: 'OK'
      });
    } finally {
      setOpenBacdrop(false);
    }
  };


  const getStatusClass = (mainStatus, subStatus) => {

    switch (mainStatus) {
      case "All":
        switch (subStatus) {
          case "Untouched":
            return "untouched_status";
          case "Docs/Info Sent (W)":
            return "created-status";
          case "Docs/Info Sent (E)":
            return "docs_sent_e-status";
          case "Docs/Info Sent (W&E)":
            return "incomplete_status";
          case "Not Picked Up":
            return "cdbp-status";
          case "Busy":
            return "dfaulter-status";
          case "Junk":
            return "support-status";
          case "Interested":
            return "ready_to_submit";
          case "FollowUp":
            return "clnt_no_repond_status";
          case "Not Interested":
            return "inprogress-status";
          default:
            return "";
        }
      case "Busy":
        switch (subStatus) {
          case "Untouched":
            return "untouched_status";
          case "Docs/Info Sent (W)":
            return "created-status";
          case "Docs/Info Sent (E)":
            return "docs_sent_e-status";
          case "Docs/Info Sent (W&E)":
            return "incomplete_status";
          case "Not Picked Up":
            return "cdbp-status";
          case "Busy":
            return "dfaulter-status";
          case "Interested":
            return "ready_to_submit";
          case "Not Interested":
            return "inprogress-status";
          default:
            return "";
        }
      case "UnderDocs":
        switch (subStatus) {
          case "Untouched":
            return "untouched_status";
          case "Docs/Info Sent (W)":
            return "created-status";
          case "Docs/Info Sent (E)":
            return "docs_sent_e-status";
          case "Docs/Info Sent (W&E)":
            return "incomplete_status";
          case "Not Picked Up":
            return "cdbp-status";
          case "Busy":
            return "dfaulter-status";
          case "Interested":
            return "ready_to_submit";
          case "Not Interested":
            return "inprogress-status";
          default:
            return "";
        }
      case "Interested":
        switch (subStatus) {
          case "FollowUp":
            return "clnt_no_repond_status";
          case "Interested":
            return "ready_to_submit";
          case "Matured":
            return "approved-status";
          case "Not Interested":
            return "inprogress-status";
          case "Busy":
            return "dfaulter-status";
          default:
            return "";
        }
      case "Forwarded":
        switch (subStatus) {
          case "FollowUp":
            return "clnt_no_repond_status";
          case "Interested":
            return "ready_to_submit";

          default:
            return "";
        }
      case "Not Interested":
        switch (subStatus) {
          case "Junk":
            return "support-status";
          case "Busy":
            return "dfaulter-status";
          case "Not Interested":
            return "inprogress-status";
          case "Not Picked Up":
            return "cdbp-status";
          default:
            return "";
        }
      default:
        return "";
    }
  };

  useEffect(() => {
    setStatusClass(getStatusClass(mainStatus, (isBdmStatusChange && bdmStatus ? bdmStatus : companyStatus)));
  }, [mainStatus, companyStatus, bdmStatus]);

  // ----------------------------------functions for modal--------------------------------
  const modalId = `modal-${companyName?.replace(/[^a-zA-Z0-9]/g, '')}`; // Generate a sanitized modal ID
  // console.log("modalId", modalId);
  

  // console.log("previousStatus", previousStatus)

  return (<>
    <section className="rm_status_dropdown"
    >
      <div className={
        mainStatus === "Forwarded" ? `disabled dropdown custom-dropdown status_dropdown ${statusClass}` :
          `dropdown custom-dropdown status_dropdown ${statusClass}`}>
        <button
          className="btn dropdown-toggle w-100 d-flex align-items-center justify-content-between status__btn"
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown" // Bootstrap data attribute to toggle dropdown
          aria-expanded="false"
        >
          {status}
        </button>
        {mainStatus === "All" ? (
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
                onClick={() => handleStatusChange("Not Interested", "inprogress-status")}
                href="#"
              >
                Not Interested
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Not Picked Up", "cdbp-status")}
                href="#"
              >
                Not Picked Up
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Busy", "dfaulter-status")}
                href="#"
              >
                Busy
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Junk", "support-status")}
                href="#"
              >
                Junk
              </a>
            </li>
            <li>
              <button
                className="dropdown-item"
                data-bs-toggle="modal"
                data-bs-target={`#${modalId}`} // Use dynamic modal ID
                value={status}
                onClick={(e) => {
                  setStatus("Interested");
                  setStatusClass("ready_to_submit");
                  console.log("Company Status:", e.target.value, status, companyStatus); // Log the companyStatus value
                }}
                href="#"
              >
                Interested
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                data-bs-toggle="modal"
                data-bs-target={`#${modalId}`} // Use dynamic modal ID
                value={status}
                onClick={(e) => {
                  setStatus("Docs/Info Sent (W)");
                  setStatusClass("created-status");
                  console.log("Company Status:", e.target.value, status); // Log the companyStatus value
                }}
                href="#"
              >
                Docs/Info Sent (W)
                {/* <FaWhatsapp className="ml-1" /> */}
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                data-bs-toggle="modal"
                data-bs-target={`#${modalId}`} // Use dynamic modal ID
                value={status}
                onClick={(e) => {
                  setStatus("Docs/Info Sent (E)");
                  setStatusClass("docs_sent_e-status");
                  console.log("Company Status:", e.target.value, status); // Log the companyStatus value
                }}
                href="#"
              >
                Docs/Info Sent (E)
                {/* <MdOutlineEmail className="ml-1" /> */}
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                data-bs-toggle="modal"
                data-bs-target={`#${modalId}`} // Use dynamic modal ID
                value={status}
                onClick={(e) => {
                  setStatus("Docs/Info Sent (W&E)");
                  setStatusClass("incomplete_status");
                  console.log("Company Status:", e.target.value, status); // Log the companyStatus value
                }}
                href="#"
              >
                Docs/Info Sent (W&E)
                {/* <FaWhatsapp className="ml-1" />
                <MdOutlineEmail className="ml-1" /> */}
              </button>
            </li>
          </ul>
        ) : mainStatus === "Busy" ? (
          <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
            {!isBdmStatusChange && 
          (  <>
          <li>
              <a
                className={`dropdown-item ${!previousStatus ? 'disabled' : ''}`} // Add 'disabled' class if previousStatus is undefined or empty
                onClick={() =>
                  previousStatus && // Ensure onClick is not called if previousStatus is undefined or empty
                  handleUndoStatus(
                    companyStatus,
                    getStatusClass(mainStatus, isBdmStatusChange && bdmStatus ? bdmStatus : companyStatus)
                  )
                }
                href="#"
              >
                Undo
              </a>
            </li>
             <li>
             <button
               className="dropdown-item"
               data-bs-toggle="modal"
               data-bs-target={`#${modalId}`} // Use dynamic modal ID
               value={companyStatus}
               onClick={(e) => {
                 setStatus("Docs/Info Sent (W)");
                 setStatusClass("created-status");
                 console.log("Company Status:", e.target.value); // Log the companyStatus value
               }}
               href="#"
             >
               Docs/Info Sent (W)
             </button>
           </li>
           <li>
             <button
               className="dropdown-item"
               data-bs-toggle="modal"
               data-bs-target={`#${modalId}`} // Use dynamic modal ID
               value={companyStatus}
               onClick={(e) => {
                 setStatus("Docs/Info Sent (E)");
                 setStatusClass("docs_sent_e-status");
                 console.log("Company Status:", e.target.value); // Log the companyStatus value
               }}
               href="#"
             >
               Docs/Info Sent (E)
             </button>
           </li>
           <li>
             <button
               className="dropdown-item"
               data-bs-toggle="modal"
               data-bs-target={`#${modalId}`} // Use dynamic modal ID
               value={companyStatus}
               onClick={(e) => {
                 setStatus("Docs/Info Sent (W&E)");
                 setStatusClass("incomplete_status");
                 console.log("Company Status:", e.target.value); // Log the companyStatus value
               }}
               href="#"
             >
               Docs/Info Sent (W&E)
             </button>
           </li>
          </>)}
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Not Picked Up", "cdbp-status")}
                href="#"
              >
                Not Picked Up
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Busy", "dfaulter-status")}
                href="#"
              >
                Busy
              </a>
            </li>
            <li>
              <button
                className="dropdown-item"
                data-bs-toggle="modal"
                data-bs-target={`#${modalId}`} // Use dynamic modal ID
                value={companyStatus}
                onClick={(e) => {
                  setStatus("Interested")
                  setStatusClass("ready_to_submit")
                }}
                href="#"
              >
                Interested
              </button>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => isBdmStatusChange ? handlebdmStatusChange("Not Interested", "inprogress-status") : handleStatusChange("Not Interested", "inprogress-status")}
                href="#"
              >
                Not Interested
              </a>
            </li>
          </ul>
        ) : mainStatus === "UnderDocs" ? (
          <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
            {!isBdmStatusChange && <li>
              <a
                className={`dropdown-item ${!previousStatus ? 'disabled' : ''}`} // Add 'disabled' class if previousStatus is undefined or empty
                onClick={() =>
                  previousStatus && // Ensure onClick is not called if previousStatus is undefined or empty
                  handleUndoStatus(
                    companyStatus,
                    getStatusClass(mainStatus, isBdmStatusChange && bdmStatus ? bdmStatus : companyStatus)
                  )
                }
                href="#"
              >
                Undo
              </a>
            </li>}
            <li>
              <button
                className="dropdown-item"
                data-bs-toggle="modal"
                data-bs-target={`#${modalId}`} // Use dynamic modal ID
                value={companyStatus}
                onClick={(e) => {
                  setStatus("Interested")
                  setStatusClass("ready_to_submit")
                }}
                href="#"
              >
                Interested
              </button>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Not Interested", "inprogress-status")}
                href="#"
              >
                Not Interested
              </a>
            </li>
          </ul>
        ) : mainStatus === "Interested" ? (
          <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
            {!isBdmStatusChange && <li>
              <a
                className={`dropdown-item ${!previousStatus ? 'disabled' : ''}`} // Add 'disabled' class if previousStatus is undefined or empty
                onClick={() =>
                  previousStatus && // Ensure onClick is not called if previousStatus is undefined or empty
                  handleUndoStatus(
                    companyStatus,
                    getStatusClass(mainStatus, isBdmStatusChange && bdmStatus ? bdmStatus : companyStatus)
                  )
                }
                href="#"
              >
                Undo
              </a>
            </li>}
            <li>
              <a
                className="dropdown-item"
                onClick={() => isBdmStatusChange ? handlebdmStatusChange("FollowUp", "clnt_no_repond_status") : handleStatusChange("FollowUp", "clnt_no_repond_status")}
                href="#"
              >
                Follow Up
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => isBdmStatusChange ? handlebdmStatusChange("Interested", "ready_to_submit") : handleStatusChange("Interested", "ready_to_submit")}
                href="#"
              >
                Interested
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => isBdmStatusChange ? handlebdmStatusChange("Matured", "approved-status") : handleStatusChange("Matured", "approved-status")}
                href="#"
              >
                Matured
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => isBdmStatusChange ? handlebdmStatusChange("Not Interested", "inprogress-status") : handleStatusChange("Not Interested", "inprogress-status")}
                href="#"
              >
                Not Interested
              </a>
            </li>
            {/* <li>
              <a
                className="dropdown-item"
                onClick={() => isBdmStatusChange ? handlebdmStatusChange("Busy", "dfaulter-status") : handleStatusChange("Busy", "dfaulter-status")}
                href="#"
              >
                Busy
              </a>
            </li> */}
          </ul>
        ) : mainStatus === "Forwarded" ? (
          <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
            <li>
              <a
                className="dropdown-item"
                // onClick={() => handleStatusChange("FollowUp", "clnt_no_repond_status")}
                href="#"
              >
                Follow Up
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                // onClick={() => handleStatusChange("Interested", "need_to_call")}
                href="#"
              >
                Interested
              </a>
            </li>
          </ul>
        ) : mainStatus === "Not Interested" ? (
          <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
            {!isBdmStatusChange && <li>
              <a
                className={`dropdown-item ${!previousStatus ? 'disabled' : ''}`} // Add 'disabled' class if previousStatus is undefined or empty
                onClick={() =>
                  previousStatus && // Ensure onClick is not called if previousStatus is undefined or empty
                  handleUndoStatus(
                    companyStatus,
                    getStatusClass(mainStatus, isBdmStatusChange && bdmStatus ? bdmStatus : companyStatus)
                  )
                }
                href="#"
              >
                Undo
              </a>
            </li>}
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Junk", "support-status")}
                href="#"
              >
                Junk
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Busy", "dfaulter-status")}
                href="#"
              >
                Busy
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Not Interested", "inprogress-status")}
                href="#"
              >
                Not Interested
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Not Picked Up", "cdbp-status")}
                href="#"
              >
                Not Picked Up
              </a>
            </li>
          </ul>
        ) : null}
      </div>
    </section>
    <EmployeeInterestedInformationDialog
      modalId={modalId}
      companyName={companyName}
      secretKey={secretKey}
      refetch={refetch}
      ename={ename}
      status={status}
      setStatus={setStatus}
      setStatusClass={setStatusClass}
      companyStatus={companyStatus}
      id={id}
      setOpenBacdrop={setOpenBacdrop}

    />
  </>);
};

export default EmployeeStatusChange;