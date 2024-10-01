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
}) => {
    const [status, setStatus] = useState(subStatus);
    const [statusClass, setStatusClass] = useState("");
    const secretKey = process.env.REACT_APP_SECRET_KEY;


    const handleStatusChange = async (newStatus, statusClass) => {
        setStatus(newStatus);
        setStatusClass(statusClass);
        setNewSubStatus(newStatus);
        //console.log("newStatus", newStatus)

        try {
            let response;
            let movedFromMainCategoryStatus;
            let movedToMainCategoryStatus;
            if (mainStatus === "General") {
                movedFromMainCategoryStatus = "General";
                movedToMainCategoryStatus = "UnderReview";
                if (newStatus === "Disqualified" || newStatus === "Not Looking For Job" || newStatus === "Junk") {
                    movedFromMainCategoryStatus = "General";
                    movedToMainCategoryStatus = "Disqualified";
                    response = await axios.post(`${secretKey}/recruiter/update-substatus-recruiter`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "Disqualified",
                        previousMainCategoryStatus: "General",
                        //previousSubCategoryStatus: "Untouched",
                        movedFromMainCategoryStatus: movedFromMainCategoryStatus,
                        movedToMainCategoryStatus: movedToMainCategoryStatus,
                    });
                } else if (newStatus === "On Hold") {
                    movedFromMainCategoryStatus = "General";
                    movedToMainCategoryStatus = "On Hold";
                    response = await axios.post(`${secretKey}/recruiter/update-substatus-recruiter`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "On Hold",
                        previousMainCategoryStatus: "General",
                        //previousSubCategoryStatus: "Untouched",
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
                        //previousSubCategoryStatus: "Untouched",
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
                        //previousSubCategoryStatus: "Untouched",
                        movedFromMainCategoryStatus: movedFromMainCategoryStatus,
                        movedToMainCategoryStatus: movedToMainCategoryStatus,
                    });
                } else if (newStatus === "Untouched") {
                    movedFromMainCategoryStatus = "General";
                    movedToMainCategoryStatus = "General";
                    response = await axios.post(`${secretKey}/recruiter/update-substatus-recruiter`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "General",
                        previousMainCategoryStatus: "General",
                        //previousSubCategoryStatus: "Untouched",
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
                        //previousSubCategoryStatus: "Untouched",
                        dateOfChangingMainStatus: new Date(),
                        movedFromMainCategoryStatus: movedFromMainCategoryStatus,
                        movedToMainCategoryStatus: movedToMainCategoryStatus
                    });
                }
            }
            else if (mainStatus === "UnderReview") {
                if (newStatus === "Disqualified") {
                    movedFromMainCategoryStatus = "UnderReview";
                    movedToMainCategoryStatus = "Disqualified";
                    response = await axios.post(`${secretKey}/recruiter/update-substatus-recruiter`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "Disqualified",
                        previousMainCategoryStatus: "UnderReview",
                        //previousSubCategoryStatus: newStatus,
                        movedFromMainCategoryStatus: movedFromMainCategoryStatus,
                        movedToMainCategoryStatus: movedToMainCategoryStatus,
                    });
                } else if (newStatus === "Selected") {
                    movedFromMainCategoryStatus = "UnderReview";
                    movedToMainCategoryStatus = "Selected";
                    response = await axios.post(`${secretKey}/recruiter/update-substatus-recruiter`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "Selected",
                        previousMainCategoryStatus: "UnderReview",
                        //previousSubCategoryStatus: newStatus,
                        movedFromMainCategoryStatus: movedFromMainCategoryStatus,
                        movedToMainCategoryStatus: movedToMainCategoryStatus,
                    });
                } else if (newStatus === "On Hold") {
                    movedFromMainCategoryStatus = "UnderReview";
                    movedToMainCategoryStatus = "On Hold";
                    response = await axios.post(`${secretKey}/recruiter/update-substatus-recruiter`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "On Hold",
                        previousMainCategoryStatus: "UnderReview",
                        //previousSubCategoryStatus: newStatus,
                        movedFromMainCategoryStatus: movedFromMainCategoryStatus,
                        movedToMainCategoryStatus: movedToMainCategoryStatus,
                    });
                } else if (newStatus === "Rejected") {
                    movedFromMainCategoryStatus = "UnderReview";
                    movedToMainCategoryStatus = "Rejected";
                    response = await axios.post(`${secretKey}/recruiter/update-substatus-recruiter`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "Rejected",
                        previousMainCategoryStatus: "UnderReview",
                        //previousSubCategoryStatus: newStatus,
                        movedFromMainCategoryStatus: movedFromMainCategoryStatus,
                        movedToMainCategoryStatus: movedToMainCategoryStatus,
                    });
                } else if (newStatus === "Undo") {
                    response = await axios.post(`${secretKey}/recruiter/update-substatus-recruiter`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        //mainCategoryStatus: "Defaulter",
                    });
                } else {
                    movedFromMainCategoryStatus = "General";
                    movedToMainCategoryStatus = "UnderReview";
                    response = await axios.post(`${secretKey}/recruiter/update-substatus-recruiter`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "UnderReview",
                        movedFromMainCategoryStatus: movedFromMainCategoryStatus,
                        movedToMainCategoryStatus: movedToMainCategoryStatus,
                        previousMainCategoryStatus: "General",
                        //previousSubCategoryStatus: newStatus,
                    });
                }
            }
            else if (mainStatus === "On Hold") {
                if (newStatus === "Disqualified") {
                    movedFromMainCategoryStatus = "On Hold";
                    movedToMainCategoryStatus = "Disqualified";
                    response = await axios.post(`${secretKey}/recruiter/update-substatus-recruiter`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "Disqualified",
                        previousMainCategoryStatus: "On Hold",
                        //previousSubCategoryStatus: newStatus,
                        movedFromMainCategoryStatus: movedFromMainCategoryStatus,
                        movedToMainCategoryStatus: movedToMainCategoryStatus,
                    });

                } else if (newStatus === "Rejected") {
                    movedFromMainCategoryStatus = "On Hold";
                    movedToMainCategoryStatus = "Rejected";
                    response = await axios.post(`${secretKey}/recruiter/update-substatus-recruiter`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "Rejected",
                        previousMainCategoryStatus: "On Hold",
                        //previousSubCategoryStatus: newStatus,
                        movedFromMainCategoryStatus: movedFromMainCategoryStatus,
                        movedToMainCategoryStatus: movedToMainCategoryStatus,
                    });
                } else if (newStatus === "Selected") {
                    movedFromMainCategoryStatus = "On Hold";
                    movedToMainCategoryStatus = "Selected";
                    response = await axios.post(`${secretKey}/recruiter/update-substatus-recruiter`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "Selected",
                        previousMainCategoryStatus: "On Hold",
                        //previousSubCategoryStatus: newStatus,
                        movedFromMainCategoryStatus: movedFromMainCategoryStatus,
                        movedToMainCategoryStatus: movedToMainCategoryStatus,
                    });
                } else if (newStatus === "UnderReview") {
                    movedFromMainCategoryStatus = "On Hold";
                    movedToMainCategoryStatus = "UnderReview";
                    response = await axios.post(`${secretKey}/recruiter/update-substatus-recruiter`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "UnderReview",
                        previousMainCategoryStatus: "On Hold",
                        //previousSubCategoryStatus: newStatus,
                        movedFromMainCategoryStatus: movedFromMainCategoryStatus,
                        movedToMainCategoryStatus: movedToMainCategoryStatus,
                    });
                } else if (newStatus === "Undo") {
                    response = await axios.post(`${secretKey}/recruiter/update-substatus-recruiter`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        //mainCategoryStatus: "On Hold",
                    });
                } else {
                    response = await axios.post(`${secretKey}/recruiter/update-substatus-recruiter`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "On Hold",
                        latestUpdateDate: new Date()
                    });
                }
            }
            else if (mainStatus === "Disqualified") {
                if (newStatus === "Disqualified") {
                    response = await axios.post(`${secretKey}/recruiter/update-substatus-recruiter`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "Disqualified"
                    });
                } else if (newStatus === "Undo") {
                    response = await axios.post(`${secretKey}/recruiter/update-substatus-recruiter`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        //mainCategoryStatus: "Disqualified",
                    });
                }
            }
            else if (mainStatus === "Rejected") {
                if (newStatus === "Rejected") {
                    response = await axios.post(`${secretKey}/recruiter/update-substatus-recruiter`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "Rejected"
                    });
                } else if (newStatus === "Undo") {
                    response = await axios.post(`${secretKey}/recruiter/update-substatus-recruiter`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        //mainCategoryStatus: "Defaulter",
                    });
                }

            }
            else if (mainStatus === "Selected") {
                if (newStatus === "Selected") {
                    response = await axios.post(`${secretKey}/recruiter/update-substatus-recruiter`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        mainCategoryStatus: "Selected"
                    });
                } else if (newStatus === "Undo") {
                    response = await axios.post(`${secretKey}/recruiter/update-substatus-recruiter`, {
                        empName,
                        empEmail,
                        subCategoryStatus: newStatus,
                        //mainCategoryStatus: "Defaulter",
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
                    case "Call Done":
                        return "cdbp-status";
                    case "UnderReview":
                        return "cdbp-status";
                    case "Not Looking For Job":
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
                    case "Junk":
                        return "need_to_call";

                    default:
                        return "";
                }
            case "UnderReview":
                switch (subStatus) {
                    case "InterView Scheduled":
                        return "cdbp-status";
                    case "Call Not Recieved":
                        return "cdbp-status";
                    case "Disqualified":
                        return "clnt_no_repond_status";
                    case "Switched Off":
                        return "support-status";
                    case "Selected":
                        return "ready_to_submit";
                    case "Undo":
                        return "inprogress-status";
                    case "On Hold":
                        return "dfaulter-status";
                    case "Rejected":
                        return "need_to_call";
                    case "Junk":
                        return "need_to_call";
                    case "Call Busy":
                        return "inprogress-status";
                    default:
                        return "";
                }
            case "On Hold":
                switch (subStatus) {
                    case "On Hold":
                        return "ready_to_submit";
                    case "UnderReview":
                        return "submited-status";
                    case "Selected":
                        return "dfaulter-status";
                    case "Rejected":
                        return "need_to_call";
                    case "Disqualified":
                        return "clnt_no_repond_status";
                    default:
                        return "";
                }
            case "Disqualified":
                switch (subStatus) {
                    case "Disqualified":
                        return "clnt_no_repond_status";
                    case "Junk":
                        return "need_to_call";
                    case "Not Looking For Job":
                        return "cdbp-status";
                    default:
                        return "";
                }
            case "Rejected":
                switch (subStatus) {
                    case "Rejected":
                        return "need_to_call";
                    default:
                        return "";
                }case "Selected":
                switch (subStatus) {
                    case "Selected":
                        return "ready_to_submit";
                    case "Didn't Joined":
                        return "e_task_assign";
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
                        <li>
                            <a
                                className="dropdown-item"
                                onClick={() => handleStatusChange("Call Done", "cdbp-status")}
                                href="#"
                            >
                                Call Done
                            </a>
                        </li>
                        <li>
                            <a
                                className="dropdown-item"
                                onClick={() => handleStatusChange("UnderReview", "cdbp-status")}
                                href="#"
                            >
                                Under Review
                            </a>
                        </li>
                        <li>
                            <a
                                className="dropdown-item"
                                onClick={() => handleStatusChange("Not Looking For Job", "cdbp-status")}
                                href="#"
                            >
                                Not Looking For Job
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
                                onClick={() => handleStatusChange("Junk", "need_to_call")}
                                href="#"
                            >
                                Junk
                            </a>
                        </li>
                    </ul>
                ) : mainStatus === "UnderReview" ? (
                    <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
                        <li>
                            <a
                                className="dropdown-item"
                                onClick={() => handleStatusChange("InterView Scheduled", "cdbp-status")}
                                href="#"
                            >
                                InterView Scheduled
                            </a>
                        </li>
                        <li>
                            <a
                                className="dropdown-item"
                                onClick={() => handleStatusChange("Call Not Recieved", "cdbp-status")}
                                href="#"
                            >
                                Call Not Recieved
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
                                onClick={() => handleStatusChange("Switched Off", "support-status")}
                                href="#"
                            >
                                Switched Off
                            </a>
                        </li>
                        <li>
                            <a
                                className="dropdown-item"
                                onClick={() => handleStatusChange("Selected", "ready_to_submit")}
                                href="#"
                            >
                                Selected
                            </a>
                        </li>
                        <li>
                            <a
                                className="dropdown-item"
                                onClick={() => handleStatusChange("Undo", "inprogress-status")}
                                href="#"
                            >
                                Undo
                            </a>
                        </li>
                        <li>
                            <a
                                className="dropdown-item"
                                onClick={() => handleStatusChange("On Hold", "dfaulter-status")}
                                href="#"
                            >
                                On Hold
                            </a>
                        </li>
                        <li>
                            <a
                                className="dropdown-item"
                                onClick={() => handleStatusChange("Rejected", "need_to_call")}
                                href="#"
                            >
                                Rejected
                            </a>
                        </li>
                    </ul>
                ) : mainStatus === "On Hold" ? (
                    <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
                        <li>
                            <a
                                className="dropdown-item"
                                onClick={() => handleStatusChange("On Hold", "ready_to_submit")}
                                href="#"
                            >
                                On Hold
                            </a>
                        </li>
                        <li>
                            <a
                                className="dropdown-item"
                                onClick={() => handleStatusChange("Under Review", "submited-status")}
                                href="#"
                            >
                                Under Review
                            </a>
                        </li>
                        <li>
                            <a
                                className="dropdown-item"
                                onClick={() => handleStatusChange("Selected", "dfaulter-status")}
                                href="#"
                            >
                                Selected
                            </a>
                        </li>
                        <li>
                            <a
                                className="dropdown-item"
                                onClick={() => handleStatusChange("Rejected", "need_to_call")}
                                href="#"
                            >
                                Rejected
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
                                onClick={() => handleStatusChange("Undo", "e_task_assign")}
                                href="#"
                            >
                                Undo
                            </a>
                        </li>
                    </ul>
                ) : mainStatus === "Disqualified" ? (
                    <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
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
                                onClick={() => handleStatusChange("Undo", "e_task_assign")}
                                href="#"
                            >
                                Undo
                            </a>
                        </li>
                    </ul>
                ) : mainStatus === "Rejected" ? (
                    <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
                        <li>
                            <a
                                className="dropdown-item"
                                onClick={() => handleStatusChange("Rejected", "need_to_call")}
                                href="#"
                            >
                                Rejected
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
                ) : mainStatus === "Selected" && (
                    <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
                        <li>
                            <a
                                className="dropdown-item"
                                onClick={() => handleStatusChange("Selected", "ready_to_submit")}
                                href="#"
                            >
                                Selected
                            </a>
                        </li>
                        <li>
                            <a
                                className="dropdown-item"
                                onClick={() => handleStatusChange("Didn't Joined", "e_task_assign")}
                                href="#"
                            >
                                Didn't Joined
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