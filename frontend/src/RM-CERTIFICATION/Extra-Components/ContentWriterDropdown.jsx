import React, { useState, useEffect } from "react";
import "../../dist/css/tabler.min.css?1684106062";
import "../../dist/css/tabler-payments.min.css?1684106062";
import "../../dist/css/tabler-vendors.min.css?1684106062";
import "../../dist/css/demo.min.css?1684106062";
import axios from 'axios';



const ContentWriterDropdown = ({ mainStatus, subStatus, setNewSubStatus, companyName, serviceName }) => {
    const [status, setStatus] = useState("Drashti Thakkar");
    const [statusClass, setStatusClass] = useState("created-status");
    const secretKey = process.env.REACT_APP_SECRET_KEY;


    const handleStatusChange = async (newStatus, statusClass) => {
        setStatus(newStatus);
        setStatusClass(statusClass);
        setNewSubStatus(newStatus);
    };


    //console.log("mainStatus" , mainStatus)

    return (
        <section className="rm_status_dropdown">
            <div className={`dropdown custom-dropdown status_dropdown ${statusClass}`}>
                <button
                    className="btn dropdown-toggle w-100 d-flex align-items-center justify-content-between status__btn"
                    type="button"
                    id="dropdownMenuButton1"
                    //data-bs-toggle="dropdown" // Bootstrap data attribute to toggle dropdown
                    aria-expanded="false"
                >
                    {status}
                </button>
                <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
                    <li>
                        <a
                            className="dropdown-item"
                            onClick={() => handleStatusChange("Drashti Thakkar", "created-status")}
                            href="#"
                        >
                            Drashti Thakkar
                        </a>
                    </li>
                    <li>
                        <a
                            className="dropdown-item"
                            onClick={() => handleStatusChange("KYC Pending", "support-status")}
                            href="#"
                        >
                            Drashti Thakkar
                        </a>
                    </li>
                    <li>
                        <a
                            className="dropdown-item"
                            onClick={() => handleStatusChange("KYC Incomplete", "inprogress-status")}
                            href="#"
                        >
                            Drashti Thakkar
                        </a>
                    </li>
                   
                </ul>
            </div>
        </section>
    );
};

export default ContentWriterDropdown;