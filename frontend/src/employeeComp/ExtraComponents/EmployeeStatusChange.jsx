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

const EmployeeStatusChange = ({
  companyName,
  id,
  refetch,
  companyStatus,
  mainStatus,
  isDeletedEmployeeCompany,
  cemail,
  cindate,
  cnum, ename,
  bdmAcceptStatus,
  handleFormOpen,
}) => {
  const [status, setStatus] = useState(companyStatus);
  const [statusClass, setStatusClass] = useState("");
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [showDialog, setShowDialog] = useState(false); // State to control popup visibility
  const [selectedStatus, setSelectedStatus] = useState(""); // Store the selected status for the popup confirmation


  const handleStatusChange = async (
    newStatus,
    statusClass,

  ) => {
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
      let response;
      if (bdmAcceptStatus === "Accept") {
        if (newStatus === "Interested" || newStatus === "FollowUp" || newStatus === "Busy" || newStatus === "Not Picked Up") {
          response = await axios.delete(`${secretKey}/bdm-data/post-deletecompany-interested/${id}`);
          const response2 = await axios.post(
            `${secretKey}/company-data/update-status/${id}`,
            {
              newStatus,
              title,
              date,
              time,

            })
          const response3 = await axios.post(`${secretKey}/bdm-data/post-bdmAcceptStatusupate/${id}`, {
            bdmAcceptStatus: "NotForwarded"
          })

          const response4 = await axios.post(`${secretKey}/projection/post-updaterejectedfollowup/${companyName}`, {
            caseType: "NotForwarded"
          }
          )

        } else if (newStatus === "Junk") {
          response = await axios.post(`${secretKey}/bdm-data/post-update-bdmstatusfrombde/${id}`, {
            newStatus
          });
          const response2 = await axios.post(
            `${secretKey}/company-data/update-status/${id}`,
            {
              newStatus,
              title,
              date,
              time,
              companyStatus,
            }
          );

        }
      }
      // If response is not already defined, make the default API call
      if (!response) {
        response = await axios.post(
          `${secretKey}/company-data/update-status/${id}`,
          {
            newStatus,
            title,
            date,
            time,
            companyStatus,
          }
        );
      }

      // Check if the API call was successful
      if (response.status === 200) {
        // Assuming `fetchNewData` is a function to fetch updated employee data
        refetch();
      } else {
        // Handle the case where the API call was not successful
        console.error("Failed to update status:", response.data.message);
      }
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error("Error updating status:", error.message);
    }
  };

  const getStatusClass = (mainStatus, subStatus) => {

    switch (mainStatus) {
      case "All":
        switch (subStatus) {
          case "Untouched":
            return "untouched_status";
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
    setStatusClass(getStatusClass(mainStatus, companyStatus));
  }, [mainStatus, companyStatus]);

  // ----------------------------------functions for modal--------------------------------
  const modalId = `modal-${companyName.replace(/\s+/g, '')}`; // Generate a unique modal ID


  return (<>
    <section className="rm_status_dropdown" 
    style={{
      width: mainStatus === "Interested" ? "calc(100% - 32px)" : ""
    }}>
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
              <button
                className="dropdown-item"
                data-bs-toggle="modal"
                data-bs-target={`#${modalId}`} // Use dynamic modal ID
                onClick={(e) => {
                  setStatus("FollowUp")
                  setStatusClass("clnt_no_repond_status")
                }}
                href="#"
              >
                Follow Up
              </button>
            </li>
          </ul>
        ) : mainStatus === "Interested" ? (
          <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("FollowUp", "clnt_no_repond_status")}
                href="#"
              >
                Follow Up
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Interested", "ready_to_submit")}
                href="#"
              >
                Interested
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Matured", "approved-status")}
                href="#"
              >
                Matured
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
                onClick={() => handleStatusChange("Busy", "dfaulter-status")}
                href="#"
              >
                Busy
              </a>
            </li>
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
    />
  </>);
};

export default EmployeeStatusChange;