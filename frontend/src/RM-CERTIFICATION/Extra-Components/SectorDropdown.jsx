import React from "react";
import "../../dist/css/tabler.min.css?1684106062";
import "../../dist/css/tabler-payments.min.css?1684106062";
import "../../dist/css/tabler-vendors.min.css?1684106062";
import "../../dist/css/demo.min.css?1684106062";

const SectorDropdown = ({ sectorOptions }) => {
    return (
        <div className="dropdown custom-dropdown status_dropdown">
            <button
                className="btn dropdown-toggle w-100 d-flex align-items-center justify-content-between status__btn"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                Select Sector
            </button>
            <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
                {sectorOptions.map((option, index) => (
                    <li key={index}>
                        <a className="dropdown-item" href="#">
                            {option}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SectorDropdown;
