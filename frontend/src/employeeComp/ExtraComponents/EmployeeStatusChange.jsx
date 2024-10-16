import React, { useState, useEffect } from "react";
import "../../dist/css/tabler.min.css?1684106062";
import "../../dist/css/tabler-payments.min.css?1684106062";
import "../../dist/css/tabler-vendors.min.css?1684106062";
import "../../dist/css/demo.min.css?1684106062";
import axios from 'axios';
import io from 'socket.io-client';
import Swal from "sweetalert2";



const EmployeeStatusChange = ({
  companyName,
  id,
  refetch,
  companyStatus,
  mainStatus,
  setCompanyName,
  setCompanyEmail,
  setCompanyInco,
  setCompanyId,
  setCompanyNumber,
  setDeletedEmployeeStatus,
  setNewBdeName,
  isDeletedEmployeeCompany,
  setFormOpen,
  setAddFormOpen,
  cemail,
  cindate,
  cnum, ename,
  bdmAcceptStatus
}) => {
  const [status, setStatus] = useState(companyStatus);
  const [statusClass, setStatusClass] = useState("");
  const secretKey = process.env.REACT_APP_SECRET_KEY;


  // const handleStatusChange = async (newStatus, statusClass) => {
  //   setStatus(newStatus);
  //   setStatusClass(statusClass);
  //   setNewSubStatus(newStatus);
  //   console.log("newStatus", newStatus)

  //   try {
  //     let response;
  //     let movedFromMainCategoryStatus;
  //     let movedToMainCategoryStatus;
  //     if (mainStatus === "General") {
  //       movedFromMainCategoryStatus = "General";
  //       movedToMainCategoryStatus = "Process";
  //       if (newStatus !== "Untouched") {
  //         response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification-changegeneral`, {
  //           companyName,
  //           serviceName,
  //           subCategoryStatus: newStatus,
  //           mainCategoryStatus: "Process",
  //           previousMainCategoryStatus: "General",
  //           previousSubCategoryStatus: newStatus,
  //           dateOfChangingMainStatus: new Date(),
  //           movedFromMainCategoryStatus: movedFromMainCategoryStatus,
  //           movedToMainCategoryStatus: movedToMainCategoryStatus
  //         });
  //       }
  //       //console.log("movedfromstatus" , movedFromMainCategoryStatus , movedToMainCategoryStatus)
  //     }
  //     else if (mainStatus === "Process") {
  //       if (newStatus === "Submitted") {
  //         if (serviceName === "Start-Up India Certificate" && !industry && !sector) {
  //           Swal.fire({
  //             title: "Error",
  //             text: "Please select industry and sector first",
  //             icon: "warning",
  //             button: "OK",
  //           });
  //           setStatus("Process");
  //           setStatusClass(statusClass);
  //           setNewSubStatus("Process");
  //           return;
  //         } else if (writername !== "Not Applicable" && (contentStatus !== "Completed" && contentStatus !== "Approved")) {
  //           Swal.fire({
  //             title: "Error",
  //             text: "Content status must be Completed or Approved",
  //             icon: "warning",
  //             button: "OK",
  //           });
  //           setStatus("Process");
  //           setStatusClass(statusClass);
  //           setNewSubStatus("Process");
  //           return;
  //         } else if (designername && designername !== "Not Applicable" && (brochureStatus !== "Completed" && brochureStatus !== "Approved")) {
  //           Swal.fire({
  //             title: "Error",
  //             text: "Brochure status must be Completed or Approved",
  //             icon: "warning",
  //             button: "OK",
  //           });
  //           setStatus("Process");
  //           setStatusClass(statusClass);
  //           setNewSubStatus("Process");
  //           return;
  //         } else {
  //           movedFromMainCategoryStatus = "Process";
  //           movedToMainCategoryStatus = "Submitted";
  //           response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
  //             companyName,
  //             serviceName,
  //             subCategoryStatus: newStatus,
  //             mainCategoryStatus: "Submitted",
  //             previousMainCategoryStatus: "Process",
  //             previousSubCategoryStatus: newStatus,
  //             movedFromMainCategoryStatus: movedFromMainCategoryStatus,
  //             movedToMainCategoryStatus: movedToMainCategoryStatus,
  //           });
  //         }
  //       } else if (newStatus === "Defaulter") {
  //         movedFromMainCategoryStatus = "Process";
  //         movedToMainCategoryStatus = "Defaulter";
  //         response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
  //           companyName,
  //           serviceName,
  //           subCategoryStatus: newStatus,
  //           mainCategoryStatus: "Defaulter",
  //           previousMainCategoryStatus: "Process",
  //           previousSubCategoryStatus: newStatus,
  //           movedFromMainCategoryStatus: movedFromMainCategoryStatus,
  //           movedToMainCategoryStatus: movedToMainCategoryStatus,
  //         });

  //       } else if (newStatus === "Hold") {
  //         movedFromMainCategoryStatus = "Process";
  //         movedToMainCategoryStatus = "Hold";
  //         response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
  //           companyName,
  //           serviceName,
  //           subCategoryStatus: newStatus,
  //           mainCategoryStatus: "Hold",
  //           previousMainCategoryStatus: "Process",
  //           previousSubCategoryStatus: newStatus,
  //           movedFromMainCategoryStatus: movedFromMainCategoryStatus,
  //           movedToMainCategoryStatus: movedToMainCategoryStatus,
  //         });
  //       } else if (newStatus === "Undo") {
  //         response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
  //           companyName,
  //           serviceName,
  //           subCategoryStatus: newStatus,

  //           //mainCategoryStatus: "Defaulter",
  //         });
  //       } else if (newStatus === "Ready To Submit") {
  //         const conditions = {
  //           industryAndSector: serviceName === "Start-Up India Certificate" && !industry && !sector,
  //           contentStatus: writername !== "Not Applicable" && (contentStatus !== "Completed" && contentStatus !== "Approved"),
  //           brochureStatus: designername && designername !== "Not Applicable" && (brochureStatus !== "Completed" && brochureStatus !== "Approved"),
  //           letterStatus: dscApplicable && letterStatus && (serviceName === "Start-Up India Certificate" || serviceName === "Organization DSC" || serviceName === "Director DSC") && letterStatus !== "Letter Received",
  //           dscStatus: dscApplicable && dscStatus && (serviceName === "Start-Up India Certificate" || serviceName === "Organization DSC" || serviceName === "Director DSC") && dscStatus !== "Approved",
  //           otpStatus:otpStatus !== "Both Done",
  //         };
  //         const messages = [];

  //         // Check each condition and add appropriate messages
  //         if (conditions.industryAndSector) {
  //           messages.push("Please select industry and sector!");
  //         }

  //         if (conditions.contentStatus) {
  //           messages.push("Content status must be Completed or Approved");
  //         }

  //         if (conditions.brochureStatus) {
  //           messages.push("Brochure status must be Completed or Approved");
  //         }
  //         if (conditions.letterStatus) {
  //           messages.push("DSC Letter Status must be received !")
  //         }
  //         if (conditions.dscStatus) {
  //           messages.push("DSC Status must be approved!")
  //         }
  //         if (conditions.otpStatus) {
  //           messages.push("Otp Status must be Both Done!")
  //         }
  //         if (messages.length > 0) {
  //           const title = "Error";
  //           const text = messages.join(" <br> ");
  //           Swal.fire({
  //             title: title,
  //             html: text,
  //             icon: "warning",
  //             button: "OK",
  //           }).then(() => {
  //             // Reset status and class only if conditions are met
  //             setStatus(subStatus);
  //             setStatusClass(getStatusClass(mainStatus, subStatus));
  //             setNewSubStatus(subStatus);
  //           });
  //         } else {
  //           movedFromMainCategoryStatus = "Process";
  //           movedToMainCategoryStatus = "Ready To Submit";
  //           response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
  //             companyName,
  //             serviceName,
  //             subCategoryStatus: newStatus,
  //             mainCategoryStatus: "Ready To Submit",
  //             previousMainCategoryStatus: "Process",
  //             previousSubCategoryStatus: newStatus,
  //             movedFromMainCategoryStatus: movedFromMainCategoryStatus,
  //             movedToMainCategoryStatus: movedToMainCategoryStatus,
  //           });
  //         }
  //       } else {
  //         response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
  //           companyName,
  //           serviceName,
  //           subCategoryStatus: newStatus,
  //           mainCategoryStatus: "Process"
  //         });
  //       }
  //     }
  //     else if (mainStatus === "Ready To Submit") {
  //       if (newStatus === "Submitted") {
  //         movedFromMainCategoryStatus = "Ready To Submit";
  //         movedToMainCategoryStatus = "Submitted";
  //         response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
  //           companyName,
  //           serviceName,
  //           subCategoryStatus: newStatus,
  //           mainCategoryStatus: "Submitted",
  //           previousMainCategoryStatus: "Ready To Submit",
  //           previousSubCategoryStatus: newStatus,
  //           movedFromMainCategoryStatus: movedFromMainCategoryStatus,
  //           movedToMainCategoryStatus: movedToMainCategoryStatus,
  //           lastAttemptSubmitted: "1st",
  //           submittedOn: new Date()
  //         });
  //       } else if (newStatus === "Defaulter") {
  //         movedFromMainCategoryStatus = "Ready To Submit";
  //         movedToMainCategoryStatus = "Defaulter";
  //         response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
  //           companyName,
  //           serviceName,
  //           subCategoryStatus: newStatus,
  //           mainCategoryStatus: "Defaulter",
  //           previousMainCategoryStatus: "Ready To Submit",
  //           previousSubCategoryStatus: newStatus,
  //           movedFromMainCategoryStatus: movedFromMainCategoryStatus,
  //           movedToMainCategoryStatus: movedToMainCategoryStatus,
  //         });
  //       } else if (newStatus === "Hold") {
  //         movedFromMainCategoryStatus = "Ready To Submit";
  //         movedToMainCategoryStatus = "Hold";
  //         response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
  //           companyName,
  //           serviceName,
  //           subCategoryStatus: newStatus,
  //           mainCategoryStatus: "Hold",
  //           previousMainCategoryStatus: "Ready To Submit",
  //           previousSubCategoryStatus: newStatus,
  //           movedFromMainCategoryStatus: movedFromMainCategoryStatus,
  //           movedToMainCategoryStatus: movedToMainCategoryStatus,
  //         });
  //       } else if (newStatus === "Undo") {
  //         response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
  //           companyName,
  //           serviceName,
  //           subCategoryStatus: newStatus,
  //           //mainCategoryStatus: "Defaulter",
  //         });
  //       }
  //       else if (newStatus === "Ready To Submit") {
  //         response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
  //           companyName,
  //           serviceName,
  //           subCategoryStatus: newStatus,
  //           mainCategoryStatus: "Ready To Submit",
  //         });
  //       } else {
  //         response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
  //           companyName,
  //           serviceName,
  //           subCategoryStatus: newStatus,
  //           mainCategoryStatus: "Ready To Submit"
  //         });
  //       }
  //     }
  //     else if (mainStatus === "Submitted") {
  //       if (newStatus === "Approved") {
  //         movedFromMainCategoryStatus = "Submitted";
  //         movedToMainCategoryStatus = "Approved";
  //         response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
  //           companyName,
  //           serviceName,
  //           subCategoryStatus: newStatus,
  //           mainCategoryStatus: "Approved",
  //           previousMainCategoryStatus: "Submitted",
  //           previousSubCategoryStatus: newStatus,
  //           movedFromMainCategoryStatus: movedFromMainCategoryStatus,
  //           movedToMainCategoryStatus: movedToMainCategoryStatus,
  //         });

  //       } else if (newStatus === "Defaulter") {
  //         movedFromMainCategoryStatus = "Submitted";
  //         movedToMainCategoryStatus = "Defaulter";
  //         response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
  //           companyName,
  //           serviceName,
  //           subCategoryStatus: newStatus,
  //           mainCategoryStatus: "Defaulter",
  //           previousMainCategoryStatus: "Submitted",
  //           previousSubCategoryStatus: newStatus,
  //           movedFromMainCategoryStatus: movedFromMainCategoryStatus,
  //           movedToMainCategoryStatus: movedToMainCategoryStatus,
  //         });
  //       } else if (newStatus === "Undo") {
  //         response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
  //           companyName,
  //           serviceName,
  //           subCategoryStatus: newStatus,
  //           //mainCategoryStatus: "Defaulter",
  //         });
  //       } else if (newStatus === "2nd Time Submitted") {
  //         response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
  //           companyName,
  //           serviceName,
  //           subCategoryStatus: newStatus,
  //           ThirdTimeSubmitDate: new Date(),
  //           SecondTimeSubmitDate: new Date(),
  //           lastAttemptSubmitted: "2nd",
  //           //mainCategoryStatus: "Defaulter",
  //         });
  //       } else if (newStatus === "3rd Time Submitted") {
  //         response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
  //           companyName,
  //           serviceName,
  //           subCategoryStatus: newStatus,
  //           ThirdTimeSubmitDate: new Date(),
  //           SecondTimeSubmitDate: new Date(),
  //           lastAttemptSubmitted: "3rd"
  //           //mainCategoryStatus: "Defaulter",
  //         });
  //       } else if (newStatus === "Submitted") {
  //         response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
  //           companyName,
  //           serviceName,
  //           subCategoryStatus: newStatus,
  //           ThirdTimeSubmitDate: new Date(),
  //           SecondTimeSubmitDate: new Date(),
  //           lastAttemptSubmitted: "1st",
  //           submittedOn: new Date()
  //           //mainCategoryStatus: "Defaulter",
  //         });
  //       }
  //       else {
  //         response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
  //           companyName,
  //           serviceName,
  //           subCategoryStatus: newStatus,
  //           mainCategoryStatus: "Submitted",
  //           latestUpdateDate: new Date()
  //         });
  //       }
  //     }
  //     else if (mainStatus === "Defaulter") {
  //       if (newStatus === "Working") {
  //         response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
  //           companyName,
  //           serviceName,
  //           subCategoryStatus: newStatus,
  //           mainCategoryStatus: "Process"
  //         });
  //       } else if (newStatus === "Hold") {
  //         movedFromMainCategoryStatus = "Defaulter";
  //         movedToMainCategoryStatus = "Hold";
  //         response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
  //           companyName,
  //           serviceName,
  //           subCategoryStatus: newStatus,
  //           mainCategoryStatus: "Hold",
  //           previousMainCategoryStatus: "Defaulter",
  //           previousSubCategoryStatus: newStatus,
  //           movedFromMainCategoryStatus: movedFromMainCategoryStatus,
  //           movedToMainCategoryStatus: movedToMainCategoryStatus,
  //         });
  //       } else if (newStatus === "Undo") {
  //         response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
  //           companyName,
  //           serviceName,
  //           subCategoryStatus: newStatus,
  //           //mainCategoryStatus: "Defaulter",
  //         });
  //       }
  //     }
  //     else if (mainStatus === "Hold") {
  //       if (newStatus === "Hold") {
  //         response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
  //           companyName,
  //           serviceName,
  //           subCategoryStatus: newStatus,
  //           mainCategoryStatus: "Hold"
  //         });
  //       } else if (newStatus === "Undo") {
  //         response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
  //           companyName,
  //           serviceName,
  //           subCategoryStatus: newStatus,
  //           //mainCategoryStatus: "Defaulter",
  //         });
  //       } else if (newStatus === "Defaulter") {
  //         movedFromMainCategoryStatus = "Hold";
  //         movedToMainCategoryStatus = "Defaulter";
  //         response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
  //           companyName,
  //           serviceName,
  //           subCategoryStatus: newStatus,
  //           mainCategoryStatus: newStatus,
  //           previousMainCategoryStatus: "Hold",
  //           previousSubCategoryStatus: newStatus,
  //           movedFromMainCategoryStatus: movedFromMainCategoryStatus,
  //           movedToMainCategoryStatus: movedToMainCategoryStatus,
  //         });
  //       } else if (newStatus === "Working") {
  //         response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
  //           companyName,
  //           serviceName,
  //           subCategoryStatus: newStatus,
  //           mainCategoryStatus: "Process"
  //         });
  //       } else if (newStatus === "Submitted") {
  //         movedFromMainCategoryStatus = "Hold";
  //         movedToMainCategoryStatus = "Defaulter";
  //         response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
  //           companyName,
  //           serviceName,
  //           subCategoryStatus: newStatus,
  //           mainCategoryStatus: newStatus,
  //           previousMainCategoryStatus: "Hold",
  //           previousSubCategoryStatus: newStatus,
  //           movedFromMainCategoryStatus: movedFromMainCategoryStatus,
  //           movedToMainCategoryStatus: movedToMainCategoryStatus,
  //           lastAttemptSubmitted: "1st"
  //         });
  //       } else if (newStatus === "Process") {
  //         movedFromMainCategoryStatus = "Hold";
  //         movedToMainCategoryStatus = "Defaulter";
  //         response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
  //           companyName,
  //           serviceName,
  //           subCategoryStatus: newStatus,
  //           mainCategoryStatus: newStatus,
  //           previousMainCategoryStatus: "Hold",
  //           previousSubCategoryStatus: newStatus,
  //           movedFromMainCategoryStatus: movedFromMainCategoryStatus,
  //           movedToMainCategoryStatus: movedToMainCategoryStatus,
  //         });
  //       }
  //     }
  //     refreshData();
  //     console.log("Status updated successfully:", response.data);
  //   } catch (error) {
  //     console.error("Error updating status:", error.message);
  //   }
  // };


  //console.log("status all content and brochure", writername, designername, contentStatus, brochureStatus)

  const handleStatusChange = async (
    // company,
    // employeeId,
    // newStatus,
    // cname,
    // cemail,
    // cindate,
    // cnum,
    // oldStatus,
    // bdmAcceptStatus,
    // isDeletedEmployeeCompany,
    // ename
    newStatus,
    statusClass,

  ) => {
    setStatus(newStatus);
    setStatusClass(statusClass);
    //setNewSubStatus(newStatus);
    if (newStatus === "Matured") {
      // Assuming these are setter functions to update state or perform some action
      setCompanyName(companyName);
      setCompanyEmail(cemail);
      setCompanyInco(cindate);
      setCompanyId(id);
      setCompanyNumber(cnum);
      setDeletedEmployeeStatus(isDeletedEmployeeCompany)
      setNewBdeName(ename)
      // console.log("is", isDeletedEmployeeCompany)
      // console.log("company", company)
      // let isDeletedEmployeeCompany = true
      if (!isDeletedEmployeeCompany) {
        console.log("formchal")
        setFormOpen(true);
      } else {
        console.log("addleadfromchal")
        setAddFormOpen(true)
      }
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
            return "need_to_call";
            case "FollowUp":
              return "clnt_no_repond_status";
          default:
            return "";
        }
      case "Interested":
        switch (subStatus) {
          case "FollowUp":
            return "clnt_no_repond_status";
          case "Interested":
            return "need_to_call";
          case "Matured":
            return "ready_to_submit";
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
            return "need_to_call";
          // case "Defaulter":
          //   return "dfaulter-status";
          // case "Hold":
          //   return "created-status";
          // case "Approved":
          //   return "approved-status";
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

  return (
    <section className="rm_status_dropdown">
      <div className={mainStatus === "Matured" ? `disabled dropdown custom-dropdown status_dropdown`
        : mainStatus === "Forwarded" ? `disabled dropdown custom-dropdown status_dropdown ${statusClass}` : 
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
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Interested", "need_to_call")}
                href="#"
              >
                Interested
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("FollowUp", "clnt_no_repond_status")}
                href="#"
              >
                Follow Up
              </a>
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
                onClick={() => handleStatusChange("Interested", "need_to_call")}
                href="#"
              >
                Interested
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                onClick={() => handleStatusChange("Matured", "ready_to_submit")}
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
        )  : null}
      </div>
    </section>
  );
};

export default EmployeeStatusChange;