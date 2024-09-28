import React, { useState, useEffect } from "react";
import "../../dist/css/tabler.min.css?1684106062";
import "../../dist/css/tabler-payments.min.css?1684106062";
import "../../dist/css/tabler-vendors.min.css?1684106062";
import "../../dist/css/demo.min.css?1684106062";
import axios from 'axios';
import io from 'socket.io-client';
import Swal from "sweetalert2";



const RecruiterStatusDropdown = ({
    mainStatus,
    subStatus,
    setNewSubStatus,
    empName,
    empEmail,
    refreshData,
    industry,
    sector,
    writername,
    designername,
    contentStatus,
    brochureStatus,
    letterStatus,
    dscStatus,
    dscApplicable,
    otpStatus
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
                movedToMainCategoryStatus = "UnderReview";
                if (newStatus === "Disqualified") {
                    movedFromMainCategoryStatus = "General";
                    movedToMainCategoryStatus = "Disqualified";
                    response = await axios.post(`${secretKey}/recruiter/update-substatus-recruiter`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "Disqualified",
                        previousMainCategoryStatus: "General",
                        previousSubCategoryStatus: newStatus,
                        movedFromMainCategoryStatus: movedFromMainCategoryStatus,
                        movedToMainCategoryStatus: movedToMainCategoryStatus,
                    });
                } else if (newStatus === "OnHold") {
                    movedFromMainCategoryStatus = "General";
                    movedToMainCategoryStatus = "OnHold";
                    response = await axios.post(`${secretKey}/recruiter/update-substatus-recruiter`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "onHold",
                        previousMainCategoryStatus: "General",
                        previousSubCategoryStatus: newStatus,
                        movedFromMainCategoryStatus: movedFromMainCategoryStatus,
                        movedToMainCategoryStatus: movedToMainCategoryStatus,
                    });
                } else if (newStatus === "Rejected") {
                    movedFromMainCategoryStatus = "General";
                    movedToMainCategoryStatus = "Rejected";
                    response = await axios.post(`${secretKey}/recruiter/update-substatus-recruiter`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "Rejected",
                        previousMainCategoryStatus: "General",
                        previousSubCategoryStatus: newStatus,
                        movedFromMainCategoryStatus: movedFromMainCategoryStatus,
                        movedToMainCategoryStatus: movedToMainCategoryStatus,
                    });
                } else if (newStatus === "Selected") {
                    movedFromMainCategoryStatus = "General";
                    movedToMainCategoryStatus = "Selected";
                    response = await axios.post(`${secretKey}/recruiter/update-substatus-recruiter`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "Selected",
                        previousMainCategoryStatus: "General",
                        previousSubCategoryStatus: newStatus,
                        movedFromMainCategoryStatus: movedFromMainCategoryStatus,
                        movedToMainCategoryStatus: movedToMainCategoryStatus,
                    });
                }else if (newStatus === "Untouhced") {
                    movedFromMainCategoryStatus = "General";
                    movedToMainCategoryStatus = "General";
                    response = await axios.post(`${secretKey}/recruiter/update-substatus-recruiter`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "General",
                        previousMainCategoryStatus: "General",
                        previousSubCategoryStatus: newStatus,
                        movedFromMainCategoryStatus: movedFromMainCategoryStatus,
                        movedToMainCategoryStatus: movedToMainCategoryStatus,
                    });
                } else {
                    response = await axios.post(`${secretKey}/recruiter/update-substatus-recruiter-changegeneral`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "UnderReview",
                        previousMainCategoryStatus: "General",
                        previousSubCategoryStatus: newStatus,
                        dateOfChangingMainStatus: new Date(),
                        movedFromMainCategoryStatus: movedFromMainCategoryStatus,
                        movedToMainCategoryStatus: movedToMainCategoryStatus
                    });
                }
                // if (newStatus !== "Untouched") {
                //     response = await axios.post(`${secretKey}/recruiter/update-substatus-recruiter-changegeneral`, {
                //         empName,
                //         empEmail,
                //         subCategoryStatus: newStatus,
                //         mainCategoryStatus: newStatus,
                //         previousMainCategoryStatus: "General",
                //         previousSubCategoryStatus: newStatus,
                //         dateOfChangingMainStatus: new Date(),
                //         movedFromMainCategoryStatus: movedFromMainCategoryStatus,
                //         movedToMainCategoryStatus: movedToMainCategoryStatus
                //     });
                // } else (newStatus === "Disqualified") {
                //     movedFromMainCategoryStatus = "General";
                //     movedToMainCategoryStatus = "Disqualified";
                //     response = await axios.post(`${secretKey}/recruiter/update-substatus-recruiter`, {
                //         empName,
                //         empEmail,
                //         subCategoryStatus: newStatus,
                //         mainCategoryStatus: "Disqualified",
                //         previousMainCategoryStatus: "General",
                //         previousSubCategoryStatus: newStatus,
                //         movedFromMainCategoryStatus: movedFromMainCategoryStatus,
                //         movedToMainCategoryStatus: movedToMainCategoryStatus,
                //     });
                // }
                //console.log("movedfromstatus" , movedFromMainCategoryStatus , movedToMainCategoryStatus)
            }
            else if (mainStatus === "Process") {
                if (newStatus === "Submitted") {
                    if (empEmail === "Start-Up India Certificate" && !industry && !sector) {
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
                            empName,
                            empEmail,
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
                        empName,
                        empEmail,
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
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "Hold",
                        previousMainCategoryStatus: "Process",
                        previousSubCategoryStatus: newStatus,
                        movedFromMainCategoryStatus: movedFromMainCategoryStatus,
                        movedToMainCategoryStatus: movedToMainCategoryStatus,
                    });
                } else if (newStatus === "Undo") {
                    response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,

                        //mainCategoryStatus: "Defaulter",
                    });
                } else if (newStatus === "Ready To Submit") {
                    const conditions = {
                        industryAndSector: empEmail === "Start-Up India Certificate" && !industry && !sector,
                        contentStatus: writername !== "Not Applicable" && (contentStatus !== "Completed" && contentStatus !== "Approved"),
                        brochureStatus: designername && designername !== "Not Applicable" && (brochureStatus !== "Completed" && brochureStatus !== "Approved"),
                        letterStatus: dscApplicable && letterStatus && (empEmail === "Start-Up India Certificate" || empEmail === "Organization DSC" || empEmail === "Director DSC") && letterStatus !== "Letter Received",
                        dscStatus: dscApplicable && dscStatus && (empEmail === "Start-Up India Certificate" || empEmail === "Organization DSC" || empEmail === "Director DSC") && dscStatus !== "Approved",
                        otpStatus: otpStatus !== "Both Done",
                    };
                    const messages = [];

                    // Check each condition and add appropriate messages
                    if (conditions.industryAndSector) {
                        messages.push("Please select industry and sector!");
                    }

                    if (conditions.contentStatus) {
                        messages.push("Content status must be Completed or Approved");
                    }

                    if (conditions.brochureStatus) {
                        messages.push("Brochure status must be Completed or Approved");
                    }
                    if (conditions.letterStatus) {
                        messages.push("DSC Letter Status must be received !")
                    }
                    if (conditions.dscStatus) {
                        messages.push("DSC Status must be approved!")
                    }
                    if (conditions.otpStatus) {
                        messages.push("Otp Status must be Both Done!")
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
                            setStatusClass(getStatusClass(mainStatus, subStatus));
                            setNewSubStatus(subStatus);
                        });
                    } else {
                        movedFromMainCategoryStatus = "Process";
                        movedToMainCategoryStatus = "Ready To Submit";
                        response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
                            empName,
                            empEmail,
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
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "Process"
                    });
                }
            }else if (mainStatus === "Ready To Submit") {
                if (newStatus === "Submitted") {
                    movedFromMainCategoryStatus = "Ready To Submit";
                    movedToMainCategoryStatus = "Submitted";
                    response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "Submitted",
                        previousMainCategoryStatus: "Ready To Submit",
                        previousSubCategoryStatus: newStatus,
                        movedFromMainCategoryStatus: movedFromMainCategoryStatus,
                        movedToMainCategoryStatus: movedToMainCategoryStatus,
                        lastAttemptSubmitted: "1st",
                        submittedOn: new Date()
                    });
                } else if (newStatus === "Defaulter") {
                    movedFromMainCategoryStatus = "Ready To Submit";
                    movedToMainCategoryStatus = "Defaulter";
                    response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
                        empName,
                        empEmail,
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
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "Hold",
                        previousMainCategoryStatus: "Ready To Submit",
                        previousSubCategoryStatus: newStatus,
                        movedFromMainCategoryStatus: movedFromMainCategoryStatus,
                        movedToMainCategoryStatus: movedToMainCategoryStatus,
                    });
                } else if (newStatus === "Undo") {
                    response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        //mainCategoryStatus: "Defaulter",
                    });
                }
                else if (newStatus === "Ready To Submit") {
                    response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "Ready To Submit",
                    });
                } else {
                    response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
                        empName,
                        empEmail,
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
                        empName,
                        empEmail,
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
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "Defaulter",
                        previousMainCategoryStatus: "Submitted",
                        previousSubCategoryStatus: newStatus,
                        movedFromMainCategoryStatus: movedFromMainCategoryStatus,
                        movedToMainCategoryStatus: movedToMainCategoryStatus,
                    });
                } else if (newStatus === "Undo") {
                    response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        //mainCategoryStatus: "Defaulter",
                    });
                } else if (newStatus === "2nd Time Submitted") {
                    response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        ThirdTimeSubmitDate: new Date(),
                        SecondTimeSubmitDate: new Date(),
                        lastAttemptSubmitted: "2nd",
                        //mainCategoryStatus: "Defaulter",
                    });
                } else if (newStatus === "3rd Time Submitted") {
                    response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        ThirdTimeSubmitDate: new Date(),
                        SecondTimeSubmitDate: new Date(),
                        lastAttemptSubmitted: "3rd"
                        //mainCategoryStatus: "Defaulter",
                    });
                } else if (newStatus === "Submitted") {
                    response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        ThirdTimeSubmitDate: new Date(),
                        SecondTimeSubmitDate: new Date(),
                        lastAttemptSubmitted: "1st",
                        submittedOn: new Date()
                        //mainCategoryStatus: "Defaulter",
                    });
                }
                else {
                    response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "Submitted",
                        latestUpdateDate: new Date()
                    });
                }
            }
            else if (mainStatus === "Defaulter") {
                if (newStatus === "Working") {
                    response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "Process"
                    });
                } else if (newStatus === "Hold") {
                    movedFromMainCategoryStatus = "Defaulter";
                    movedToMainCategoryStatus = "Hold";
                    response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "Hold",
                        previousMainCategoryStatus: "Defaulter",
                        previousSubCategoryStatus: newStatus,
                        movedFromMainCategoryStatus: movedFromMainCategoryStatus,
                        movedToMainCategoryStatus: movedToMainCategoryStatus,
                    });
                } else if (newStatus === "Undo") {
                    response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        //mainCategoryStatus: "Defaulter",
                    });
                }
            }
            else if (mainStatus === "Hold") {
                if (newStatus === "Hold") {
                    response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "Hold"
                    });
                } else if (newStatus === "Undo") {
                    response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        //mainCategoryStatus: "Defaulter",
                    });
                } else if (newStatus === "Defaulter") {
                    movedFromMainCategoryStatus = "Hold";
                    movedToMainCategoryStatus = "Defaulter";
                    response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: newStatus,
                        previousMainCategoryStatus: "Hold",
                        previousSubCategoryStatus: newStatus,
                        movedFromMainCategoryStatus: movedFromMainCategoryStatus,
                        movedToMainCategoryStatus: movedToMainCategoryStatus,
                    });
                } else if (newStatus === "Working") {
                    response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "Process"
                    });
                } else if (newStatus === "Submitted") {
                    movedFromMainCategoryStatus = "Hold";
                    movedToMainCategoryStatus = "Defaulter";
                    response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
                        empName,
                        empEmail,
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
                        empName,
                        empEmail,
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


    //console.log("status all content and brochure", writername, designername, contentStatus, brochureStatus)



    const getStatusClass = (mainStatus, subStatus) => {
        switch (mainStatus) {
            case "General":
                switch (subStatus) {
                    case "Untouched":
                        return "untouched_status";
                    case "Interview Scheduled":
                        return "cdbp-status";
                    case "Disqualified":
                        return "clnt_no_repond_status";
                    case "Rejected":
                        return "support-status";
                    case "On Hold":
                        return "need_to_call";
                    case "Call Not Received":
                        return "clnt_no_repond_status";
                    case "Call Busy":
                        return "inprogress-status";
                    default:
                        return "";
                }
            case "Process":
                switch (subStatus) {
                    case "Call Done Brief Pending":
                        return "cdbp-status";
                    case "All Done DSC Pending":
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
                    case "Technical Issue":
                        return "e_task_assign";
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
                                onClick={() => handleStatusChange("Interview Scheduled", "cdbp-status")}
                                href="#"
                            >
                                Interview Scheduled
                            </a>
                        </li>
                        <li>
                            <a
                                className="dropdown-item"
                                onClick={() => handleStatusChange("Disqualified", "clnt_no_repond_status")}
                                href="#"
                            >
                                Disqualified
                            </a>
                        </li>
                        <li>
                            <a
                                className="dropdown-item"
                                onClick={() => handleStatusChange("Rejected", "support-status")}
                                href="#"
                            >
                                Rejected
                            </a>
                        </li>
                        <li>
                            <a
                                className="dropdown-item"
                                onClick={() => handleStatusChange("On Hold", "need_to_call")}
                                href="#"
                            >
                                On Hold
                            </a>
                        </li>
                        <li>
                            <a
                                className="dropdown-item"
                                onClick={() => handleStatusChange("Call Not Received", "need_to_call")}
                                href="#"
                            >
                                Call Not Received
                            </a>
                        </li>
                        <li>
                            <a
                                className="dropdown-item"
                                onClick={() => handleStatusChange("Call Busy", "need_to_call")}
                                href="#"
                            >
                                Call Busy
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
                                onClick={() => handleStatusChange("All Done DSC Pending", "cdbp-status")}
                                href="#"
                            >
                                All Done DSC Pending
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
                                onClick={() => handleStatusChange("Technical Issue", "e_task_assign")}
                                href="#"
                            >
                                Technical Issue
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

export default RecruiterStatusDropdown;