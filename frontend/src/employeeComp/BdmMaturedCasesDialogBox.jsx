import React, { useState, useEffect } from 'react';
import Nodata from '../components/Nodata';
import ClipLoader from 'react-spinners/ClipLoader';
import axios from 'axios';
import Swal from "sweetalert2";
import { useParams } from 'react-router-dom';
import { FaWhatsapp } from "react-icons/fa";
import { TiArrowForward } from "react-icons/ti";

function BdmMaturedCasesDialogBox({ currentData, forwardedCompany, forwardCompanyId, forwardedStatus, forwardedEName, bdeOldStatus, bdmNewAcceptStatus, fetchNewData }) {

    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const { userId } = useParams();
    const modalId = `modal-${forwardedCompany.replace(/\s+/g, '')}-${forwardCompanyId}`; // Generate a unique modal ID

    const [maturedCases, setMaturedCases] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedBdm, setSelectedBdm] = useState(null); // Track the selected BDM
    const [searchQuery, setSearchQuery] = useState("");
    const [currentEmployeeName, setCurrentEmployeeName] = useState(null);
    const [searchedData, setSearchedData] = useState([]); // New state for searched data

    // Fetch current employee based on userId
    const fetchCurrentEmployee = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${secretKey}/employee/fetchEmployeeFromId/${userId}`);
            const data = res.data.data;
            setCurrentEmployeeName(data.ename);
            // console.log("Current employee is :", data);
        } catch (error) {
            console.log("Error fetching current employee:", error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch matured cases and filter out current employee
    const fetchMaturedCases = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${secretKey}/company-data/bdmMaturedCases`);
            // Only set matured cases if currentEmployeeName is defined
            if (currentEmployeeName) {
                setMaturedCases(res.data.data.filter((item) => item.bdmName !== currentEmployeeName));
            }
        } catch (error) {
            console.log("Error fetching matured cases:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = () => {
        const searchedResult = maturedCases.filter((data) =>
            data.bdmName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchedData(searchedResult); // Set filtered data based on the search query
    };

    useEffect(() => {
        handleSearch();
    }, [searchQuery]);
    
    // Fetch current employee first, then fetch the matured cases
    useEffect(() => {
        fetchCurrentEmployee();
    }, []);

    // Fetch matured cases after current employee name is set
    useEffect(() => {
        if (currentEmployeeName) {
            fetchMaturedCases();
        }
    }, [currentEmployeeName]);

    const handleForwardBdm = async () => {
        const selectedDataWithBdm = currentData.filter((company) => company["Company Name"] === forwardedCompany);

        try {
            const response = await axios.post(`${secretKey}/bdm-data/forwardtobdmdata`, {
                selectedData: selectedDataWithBdm,
                bdmName: selectedBdm,
                companyId: forwardCompanyId,
                bdmAcceptStatus: bdmNewAcceptStatus,
                bdeForwardDate: new Date(),
                bdeOldStatus: bdeOldStatus,
                companyName: forwardedCompany,
            });
            const response2 = await axios.post(`${secretKey}/projection/post-followup-forwardeddata/${forwardedCompany}`, {
                caseType: "Forwarded",
                bdmName: selectedBdm
            });
            Swal.fire("success", "Company Forwarded", "success");
            fetchNewData(bdeOldStatus);
        } catch (error) {
            console.log(error);
            Swal.fire("Error", "Error Assigning Data", "error");
        }
    };

    const handleCheckboxChange = (bdmName) => {
        // Only set the selected BDM if it is different from the current one
        if (selectedBdm !== bdmName) {
            setSelectedBdm(bdmName);
        }
    };

    const handleOpenModal = () => {
        fetchMaturedCases();
    };

    return (
        <div>
            <div className={'d-flex align-items-center justify-content-center'}>
                <a
                    style={{ textDecoration: "none" }}
                    data-bs-toggle="modal"
                    data-bs-target={`#${modalId}`} // Use dynamic modal ID
                    onClick={handleOpenModal}
                >
                    <TiArrowForward
                        style={{
                            cursor: "pointer",
                            width: "17px",
                            height: "17px",
                        }}
                        color="grey"
                    />
                </a>
            </div>

            <div className="modal" id={modalId}>
                <div className="modal-dialog modal-xl modal-dialog-centered">
                    <div className="modal-content">

                        {/* Modal Header */}
                        <div className="modal-header">
                            <h4 className="modal-title">
                                BDM Matured Cases
                            </h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                onClick={() => setSelectedBdm(null)}
                            ></button>
                        </div>

                        <div className="modal-body">
                            <div className='table table-responsive' style={{ height: "50vh", overflow: "auto" }}>

                                <div class="input-icon float-end mb-3">
                                    <input
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            handleSearch();
                                        }}
                                        className="form-control search-cantrol mybtn"
                                        placeholder="Enter BDM Name"
                                        type="text"
                                        name="bdeName-search"
                                        id="bdeName-search" />
                                </div>

                                <table className="table">
                                    {/* Render the table header regardless of loading or data state */}
                                    <thead>
                                        <tr className='tr-sticky'>
                                            <th>#</th>
                                            <th>Sr. No</th>
                                            <th>BDM Name</th>
                                            <th>Number</th>
                                            <th>Received Cases</th>
                                            <th>Matured Cases</th>
                                            <th>Ratio</th>
                                        </tr>
                                    </thead>

                                    {/* Render table body or loader based on the state */}
                                    {isLoading ? (
                                        <tbody>
                                            <tr>
                                                <td colSpan="7">
                                                    <div className='d-flex justify-content-center align-items-center'>
                                                        <ClipLoader />
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    ) : (searchQuery ? searchedData : maturedCases).length > 0 ? (
                                        <tbody>
                                            {(searchQuery ? searchedData : maturedCases).map((item, index) => (
                                                <tr key={item.bdmName}>
                                                    <td className='p-2'>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedBdm === item.bdmName} // Only this checkbox is selected
                                                            onChange={() => handleCheckboxChange(item.bdmName)} // Avoid unchecking the same item
                                                        />
                                                    </td>
                                                    <td className='p-2'>{index + 1}</td>
                                                    <td className='p-2'>{item.bdmName}</td>
                                                    <td className='p-2'>
                                                        <a
                                                            target="_blank"
                                                            className="text-decoration-none text-dark"
                                                            href={`https://wa.me/91${item.bdmNumber}`}
                                                        >
                                                            {item.bdmNumber}
                                                            <FaWhatsapp className="text-success w-25 mb-1" />
                                                        </a>
                                                    </td>
                                                    <td className='p-2'>{item.receivedCases}</td>
                                                    <td className='p-2'>{item.maturedCases}</td>
                                                    <td className='p-2'>{item.ratio} %</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    ) : (
                                        <tbody>
                                            <tr>
                                                <td colSpan="7">
                                                    <Nodata />
                                                </td>
                                            </tr>
                                        </tbody>
                                    )}
                                </table>

                            </div>
                        </div>

                        <div className="modal-footer p-0 m-0">
                            <button
                                className='btn btn-primary w-100'
                                onClick={handleForwardBdm}
                                disabled={!selectedBdm}
                                data-bs-dismiss="modal" // This will close the modal after clicking Forward
                            >
                                Forward
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default BdmMaturedCasesDialogBox;