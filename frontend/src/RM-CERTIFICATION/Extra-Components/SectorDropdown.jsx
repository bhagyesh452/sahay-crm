import React ,{useState , useEffect} from "react";
import "../../dist/css/tabler.min.css?1684106062";
import "../../dist/css/tabler-payments.min.css?1684106062";
import "../../dist/css/tabler-vendors.min.css?1684106062";
import "../../dist/css/demo.min.css?1684106062";
import axios from 'axios';

const SectorDropdown = ({ companyName, serviceName, refreshData, sector, sectorOptions , industry }) => {
    const [status, setStatus] = useState(sector);
    const [statusClass, setStatusClass] = useState("created-status");
    const [options, setOptions] = useState([])
    const secretKey = process.env.REACT_APP_SECRET_KEY;



    const handleStatusChange = async (sectorOption) => {
        setStatus(sectorOption);
        setStatusClass(statusClass);
        //onIndustryChange(industryOption, options)
        console.log(companyName , serviceName , sectorOption)
        try {
            const response = await axios.post(`${secretKey}/rm-services/post-save-sector`, {
                companyName,
                serviceName,
                sectorOption
            });
            if (response.status === 200) {
                refreshData();
                //setOpenEmailPopup(false); // Close the popup on success
            }


        } catch (error) {
            console.log("Error Sending Industry", error.message)

        }
        //setNewSubStatus(newStatus);
    };

    return (
        <div className="dropdown custom-dropdown status_dropdown">
            <button
                className="btn dropdown-toggle w-100 d-flex align-items-center justify-content-between status__btn"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                {status}
            </button>
            <ul className="dropdown-menu status_change" aria-labelledby="dropdownMenuButton1">
                {sectorOptions.map((option, index) => (
                    <li key={index}>
                        <a
                            className="dropdown-item"
                            href="#"
                            onClick={(e) => handleStatusChange(option)}
                        >
                            {option}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SectorDropdown;
