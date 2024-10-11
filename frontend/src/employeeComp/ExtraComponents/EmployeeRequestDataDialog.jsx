import React ,{useState , useEffect} from 'react';
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { IoClose } from "react-icons/io5";
import Swal from "sweetalert2";
import axios from 'axios';
import { MdOutlinePostAdd } from "react-icons/md";
import debounce from "lodash/debounce";


function EmployeeRequestDataDialog({secretKey , ename  , setOpenChange , open}) {
    const [selectedOption, setSelectedOption] = useState("general");
    const [selectedYear, setSelectedYear] = useState("")
    const [companyType, setCompanyType] = useState("");
    const [numberOfData, setNumberOfData] = useState("");
    function formatDateproper(inputDate) {
        const options = { month: "long", day: "numeric", year: "numeric" };
        const formattedDate = new Date(inputDate).toLocaleDateString(
            "en-US",
            options
        );
        return formattedDate;
    }
    const closepopup = () => {
        setOpenChange(false);
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleCompanyTypeChange = (event) => {
        setCompanyType(event.target.value);
    };

    const handleNumberOfDataChange = (event) => {
        setNumberOfData(event.target.value);
    };

    const handleSubmit = async (event) => {
        const name = ename;
        const dateObject = new Date();
        const hours = dateObject.getHours().toString().padStart(2, "0");
        const minutes = dateObject.getMinutes().toString().padStart(2, "0");
        const cTime = `${hours}:${minutes}`;

        const cDate = formatDateproper(dateObject);
        event.preventDefault();
        if (selectedOption === "notgeneral") {
            try {
                // Make API call using Axios
                const response = await axios.post(
                    `${secretKey}/requests/requestData`,

                    {
                        selectedYear,
                        companyType,
                        numberOfData,
                        name,
                        cTime,
                        cDate,
                    }
                );

                //console.log("Data sent successfully:", response.data);
                Swal.fire("Success!", "Data Request Sent!", "success");
                closepopup();
            } catch (error) {
                console.error("Error:", error.message);
                Swal.fire("Error!", "Please try again later!", "error");
            }
        } else {
            try {
                // Make API call using Axios
                const response = await axios.post(`${secretKey}/requests/requestgData`, {
                    numberOfData,
                    name,
                    cTime,
                    cDate,
                });

                //console.log("Data sent successfully:", response.data);
                Swal.fire("Request sent!");
                closepopup();
            } catch (error) {
                console.error("Error:", error.message);
                Swal.fire("Please try again later!");
            }
        }
    };
    return (
        <div>
            {/* Request Data popup */}
            <Dialog className='My_Mat_Dialog' open={open} onClose={closepopup} fullWidth maxWidth="sm">
                <DialogTitle>
                    Request Data{" "}
                    <button onClick={closepopup}  style={{backgroundColor: "transparent" , border:"none" , float:"right"}}>
                        <IoClose color="primary"></IoClose>
                    </button>{" "}
                </DialogTitle>
                <DialogContent>
                    <div className="container">
                        <div className="con2 row mb-3">
                            <div
                                style={
                                    selectedOption === "general"
                                        ? {
                                            backgroundColor: "#ffb900",
                                            margin: "10px 10px 0px 0px",
                                            cursor: "pointer",
                                            color: "white",
                                        }
                                        : {
                                            backgroundColor: "white",
                                            margin: "10px 10px 0px 0px",
                                            cursor: "pointer",
                                        }
                                }
                                onClick={() => {
                                    setSelectedOption("general");
                                }}
                                className="direct form-control col"
                            >
                                <input
                                    type="radio"
                                    id="general"
                                    value="general"
                                    style={{
                                        display: "none",
                                    }}
                                    checked={selectedOption === "general"}
                                    onChange={handleOptionChange}
                                />
                                <label htmlFor="general">General Data </label>
                            </div>
                        </div>
                        {selectedOption === "notgeneral" ? (
                            <>
                                <div className="mb-3 row">
                                    <label className="col-sm-3 form-label" htmlFor="selectYear">
                                        Select Year :
                                    </label>
                                    <select
                                        id="selectYear"
                                        name="selectYear"
                                        value={selectedYear}
                                        //onChange={handleYearChange}
                                        className="col form-select"
                                    >
                                        {[...Array(2025 - 1970).keys()].map((year) => (
                                            <option key={year} value={1970 + year}>
                                                {1970 + year}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3 row">
                                    <label className="form-label col-sm-3">Company Type :</label>
                                    <input
                                        type="radio"
                                        id="llp"
                                        name="companyType"
                                        value="LLP"
                                        checked={companyType === "LLP"}
                                        onChange={handleCompanyTypeChange}
                                        className="form-check-input"
                                    />
                                    <label htmlFor="llp" className="col">
                                        LLP
                                    </label>
                                    <input
                                        type="radio"
                                        id="pvtLtd"
                                        name="companyType"
                                        value="PVT LTD"
                                        checked={companyType === "PVT LTD"}
                                        onChange={handleCompanyTypeChange}
                                        className="form-check-input"
                                    />
                                    <label className="col" htmlFor="pvtLtd">
                                        PVT LTD
                                    </label>
                                </div>
                            </>
                        ) : (
                            <div></div>
                        )}

                        <div className="mb-3 row">
                            <label className="col-sm-3 form-label" htmlFor="numberOfData">
                                Number of Data :
                            </label>
                            <input
                                type="number"
                                id="numberOfData"
                                name="numberOfData"
                                className="form-control col"
                                value={numberOfData}
                                onChange={handleNumberOfDataChange}
                                min="1"
                                required
                            />
                        </div>
                    </div>
                </DialogContent>
                <div class="card-footer">
                    <button
                        style={{ width: "100%" }}
                        onClick={handleSubmit}
                        className="btn btn-primary bdr-radius-none"
                    >
                        Submit
                    </button>
                </div>
            </Dialog>
        </div>
    )
}

export default EmployeeRequestDataDialog