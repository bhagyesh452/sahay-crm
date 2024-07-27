import React, { useState, useEffect } from "react";
import "../../dist/css/tabler.min.css?1684106062";
import "../../dist/css/tabler-payments.min.css?1684106062";
import "../../dist/css/tabler-vendors.min.css?1684106062";
import "../../dist/css/demo.min.css?1684106062";
import axios from 'axios';



const ContentWriterDropdown = ({ mainStatus, subStatus, setNewSubStatus, companyName, serviceName }) => {
    const [status, setStatus] = useState(subStatus);
    const [statusClass, setStatusClass] = useState("created-status");
    const secretKey = process.env.REACT_APP_SECRET_KEY;


    const handleStatusChange = async (newStatus, statusClass) => {
        setStatus(newStatus);
        setStatusClass(statusClass);
        setNewSubStatus(newStatus);

        try {
            //   let response;
            //   if (mainStatus === "General") {
            //     response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            //       companyName,
            //       serviceName,
            //       subCategoryStatus: newStatus,
            //       mainCategoryStatus: "Process"
            //     });
            //   } else if (mainStatus === "Process") {
            //     if (newStatus === "Submitted") {
            //       response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            //         companyName,
            //         serviceName,
            //         subCategoryStatus: newStatus,
            //         mainCategoryStatus: "Submitted"
            //       });
            //     } else if (newStatus === "Defaulter") {
            //       response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            //         companyName,
            //         serviceName,
            //         subCategoryStatus: newStatus,
            //         mainCategoryStatus: "Defaulter"
            //       });
            //     } else {
            //       response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            //         companyName,
            //         serviceName,
            //         subCategoryStatus: newStatus,
            //         mainCategoryStatus: "Process"
            //       });
            //     }
            //   } else if (mainStatus === "Submitted") {
            //     if (newStatus === "Approved") {
            //       response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            //         companyName,
            //         serviceName,
            //         subCategoryStatus: newStatus,
            //         mainCategoryStatus: "Approved"
            //       });
            //     } else if (newStatus === "Defaulter") {
            //       response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            //         companyName,
            //         serviceName,
            //         subCategoryStatus: newStatus,
            //         mainCategoryStatus: "Defaulter"
            //       });
            //     } else {
            //       response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            //         companyName,
            //         serviceName,
            //         subCategoryStatus: newStatus,
            //         mainCategoryStatus: "Submitted"
            //       });
            //     }
            //   }else if (mainStatus === "Defaulter") {
            //     if (newStatus === "Working") {
            //       response = await axios.post(`${secretKey}/rm-services/update-substatus-rmofcertification`, {
            //         companyName,
            //         serviceName,
            //         subCategoryStatus: newStatus,
            //         mainCategoryStatus: "Defaulter"
            //       });
            //     }  
            //   }

            //   console.log("Status updated successfully:", response.data);
        } catch (error) {
            console.error("Error updating status:", error.message);
        }
    };


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
                <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
                    <li>
                        <a
                            className="dropdown-item"
                            onClick={() => handleStatusChange("Not Started", "created-status")}
                            href="#"
                        >
                            Not Started
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
                            onClick={() => handleStatusChange("KYC Incomplete", "inprogress-status")}
                            href="#"
                        >
                            KYC Incomplete
                        </a>
                    </li>
                    <li>
                        <a
                            className="dropdown-item"
                            onClick={() => handleStatusChange("Approved", "finished-status")}
                            href="#"
                        >
                            Approved
                        </a>
                    </li>
                    <li>
                        <a
                            className="dropdown-item"
                            onClick={() => handleStatusChange("Not Applicable", "rejected-status")}
                            href="#"
                        >
                            Not Applicable

                        </a>
                    </li>
                    <li>
                        <a
                            className="dropdown-item"
                            onClick={() => handleStatusChange("KYC Rejected", "rejected-status")}
                            href="#"
                        >
                            KYC Rejected

                        </a>
                    </li>
                    <li>
                        <a
                            className="dropdown-item"
                            onClick={() => handleStatusChange("KYC Document Pending", "inprogress-status")}
                            href="#"
                        >
                            KYC Document Pending

                        </a>
                    </li>
                </ul>
            </div>
        </section>
    );
};

export default ContentWriterDropdown;