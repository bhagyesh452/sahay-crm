import React, { useState, useEffect } from "react";
import "../../dist/css/tabler.min.css?1684106062";
import "../../dist/css/tabler-payments.min.css?1684106062";
import "../../dist/css/tabler-vendors.min.css?1684106062";
import "../../dist/css/demo.min.css?1684106062";
import axios from 'axios';




const IndustryDropdown = ({ mainStatus, industry, setNewSubStatus, companyName, serviceName, refreshData, onIndustryChange }) => {
    const [status, setStatus] = useState(industry);
    const [statusClass, setStatusClass] = useState("created-status");
    const [options, setOptions] = useState([])
    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const aeronauticsOptions = [
        "Drones",
        "Space Technology",
        "Defence Equipment",
        "Aviation & Others",
        "Others"
    ];

    const agricultureOptions = [
        "Dairy Farming",
        "Organic Agriculture",
        "Agri-Tech",
        "Food Processing",
        "Horticulture",
        "Fisheries",
        "Animal Husbandry",
        "Others"
    ];


    const handleStatusChange = async (newStatus, statusClass, options) => {
        setStatus(newStatus);
        setStatusClass(statusClass);
        onIndustryChange(newStatus, options)
        //setNewSubStatus(newStatus);
    };

    return (
        <section className="rm_status_dropdown">
            <div className={`dropdown custom-dropdown status_dropdown`}>
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
                            onClick={() => handleStatusChange("Aeronautics/Aerospace & Defence", "created-status", aeronauticsOptions)}
                            href="#"
                        >
                            Aeronautics/Aerospace & Defence
                        </a>
                    </li>
                    <li>
                        <a
                            className="dropdown-item"
                            onClick={() => handleStatusChange("Agriculture", "created-status", agricultureOptions)}
                            href="#"
                        >
                            Agriculture
                        </a>
                    </li>
                </ul>
            </div>
        </section>
    );
};

export default IndustryDropdown;