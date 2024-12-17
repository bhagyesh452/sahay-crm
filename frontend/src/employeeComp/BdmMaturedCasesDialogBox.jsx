import React, { useState, useEffect } from 'react';
import Nodata from '../components/Nodata';
import ClipLoader from 'react-spinners/ClipLoader';
import { Dialog, DialogTitle, DialogContent,DialogActions } from "@mui/material";
import axios from 'axios';
import Swal from "sweetalert2";
import { useParams } from 'react-router-dom';
import { FaWhatsapp } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { TiArrowForward } from "react-icons/ti";

function BdmMaturedCasesDialogBox({ 
    open, 
    closepopup, 
    currentData, 
    forwardedCompany, 
    forwardCompanyId, 
    forwardedStatus, 
    forwardedEName, 
    bdeOldStatus, 
    bdmNewAcceptStatus, 
    fetchNewData , 
    forwardingPerson,
    selectedRows,
    setSelectedRows
    //handleForwardDataToBDM
 }) {

    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const { userId } = useParams();
    // const modalId = open

    const [maturedCases, setMaturedCases] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedBdm, setSelectedBdm] = useState(null); // Track the selected BDM
    const [searchQuery, setSearchQuery] = useState("");
    const [currentEmployeeName, setCurrentEmployeeName] = useState(null);
    const [searchedData, setSearchedData] = useState([]); // New state for searched data
    const [showSuccessModal, setShowSuccessModal] = useState(false); // To trigger success modal
    const [selectedBdmRatio, setSelectedBdmRatio] = useState(0); // Store the ratio of selected BDM

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
                setMaturedCases(res.data.data.filter((item) => item.bdmName !== currentEmployeeName ));
            }else{
                setMaturedCases(res.data.data.filter((item) => item.bdmName !== forwardedEName));
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
        }else if(forwardingPerson === "admin"){
           fetchMaturedCases(); 
        }
    }, [currentEmployeeName , forwardingPerson]);

    const handleForwardDataToBDM = async () => {
        const data = currentData.filter((employee) => selectedRows.includes(employee._id));
        // console.log("data is:", data);
        if (selectedRows.length === 0) {
            Swal.fire("Please Select the Company to Forward", "", "Error");
            setSelectedBdm("Not Alloted");
            closepopup();
            return;
        }
        try {
            Swal.fire({
                title: 'Assigning...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            const response = await axios.post(`${secretKey}/bdm-data/leadsforwardedbyadmintobdm`, {
                data: data,
                name: selectedBdm
            });
            Swal.close();
            Swal.fire({
                title: "Data Sent!",
                text: "Data sent successfully!",
                icon: "success",
            });
            fetchNewData()
            setSelectedBdm(null);
            closepopup();
            setSelectedRows([]);
            //setdataStatus("All");

        } catch (error) {
            console.log("error fetching data", error.message);
            Swal.close();
            Swal.fire({
                title: "Error!",
                text: "Failed to update employee data. Please try again later.",
                icon: "error",
            });
        }
    };

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
            // Find the ratio for the selected BDM
            const selectedBdmData = maturedCases.find((item) => item.bdmName === selectedBdm);
            const ratio = selectedBdmData ? selectedBdmData.ratio : 0;
            setSelectedBdmRatio(ratio); // Store the ratio for success message

            // Show success modal
            setShowSuccessModal(true);
            fetchNewData(bdeOldStatus);
            setSelectedBdm(null);
            closepopup();
            Swal.fire("Lead Forwarded Successful!!", `By forwarding this lead to ${selectedBdm}, you raised the chances of closing it by ${ratio}%`, "success");
        } catch (error) {
            console.log(error);
            Swal.fire("Error", "Error Forwarding Lead", "error");
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

    if (!open) return null; // Prevent rendering if not open


    return (
        <div>
            <Dialog className='My_Mat_Dialog' open={open} fullWidth maxWidth="sm">
                <DialogTitle>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div>
                            BDM Matured Cases
                        </div>
                        <div className='d-flex align-items-center'>
                            <div>
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
                            <button onClick={closepopup} className='btn btn-link' style={{fontSize:'20px',padding:'0'}}>
                                <IoClose color="primary"></IoClose>
                            </button>{" "}
                        </div>
                    </div>
                </DialogTitle>

                <DialogContent>
                    <div className='table table-responsive table-style-2 m-0'>
                        <table className="table">
                            {/* Render the table header regardless of loading or data state */}
                            <thead>
                                <tr className='tr-sticky'>
                                    <th>#</th>
                                    <th>Sr. No</th>
                                    <th>BDM Name</th>
                                    {/* <th>Number</th> */}
                                    <th>Received</th>
                                    <th>Matured</th>
                                    <th>Lead Closing Ratio</th>
                                </tr>
                            </thead>

                            {/* Render table body or loader based on the state */}
                            {isLoading ? (
                                <tbody>
                                    <tr>
                                        <td colSpan="7" style={{ height: "50vh", overflow: "auto" }}>
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
                                            <td className='p-2' style={{width:"180px"}}>
                                            <a
                                                    target="_blank"
                                                    className="text-decoration-none text-dark"
                                                    href={`https://wa.me/91${item.bdmNumber}`}
                                                >
                                                    {item.bdmName}
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
                </DialogContent>
                <div className='d-flex w-100 m-0 mt-1'>
                    <button style={{ border: "none", borderRadius: "0px" }}
                        className='btn btn-danger w-50 m-0'
                        // data-bs-dismiss="modal"  // This will close the modal after clicking Forward
                        onClick={() => {
                            setSelectedBdm(null);
                            closepopup();
                        }}
                    >
                        Cancel
                    </button>
                    <button style={{ border: "none", borderRadius: "0px" }}
                        className='btn btn-primary w-50 m-0'
                        onClick={forwardingPerson === "admin" ? handleForwardDataToBDM : handleForwardBdm}
                        disabled={!selectedBdm}
                    // data-bs-dismiss="modal" // This will close the modal after clicking Forward
                    >
                        Forward
                    </button>
                </div>
            </Dialog>
        </div>

    );
}

export default BdmMaturedCasesDialogBox;