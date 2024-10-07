import React, { useState, useEffect } from 'react';
import Nodata from '../components/Nodata';
import ClipLoader from 'react-spinners/ClipLoader';
import axios from 'axios';
import Swal from "sweetalert2";
import { useParams } from 'react-router-dom';
import { FaWhatsapp } from "react-icons/fa";

function BdmMaturedCasesDialogBox({ currentData, forwardedCompany, forwardCompanyId, bdeOldStatus, bdmNewAcceptStatus, closeBdmNamePopup, fetchNewData }) {

    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const { userId } = useParams();
    const [maturedCases, setMaturedCases] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedBdm, setSelectedBdm] = useState(null); // Track the selected BDM
    const [currentEmployeeName, setCurrentEmployeeName] = useState(null);

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
            closeBdmNamePopup();
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

    return (
        <div className="modal-body">
            <div className='table table-responsive'
                style={{ height: "50vh", overflow: "auto" }}>
                {isLoading ? (
                    <div className='d-flex justify-content-center align-items-center'>
                        <ClipLoader />
                    </div>
                ) : maturedCases && maturedCases.length > 0 ? (
                    <table className="table">
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
                        <tbody>
                            {maturedCases.map((item, index) => {
                                return (
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
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div>
                        <Nodata />
                    </div>
                )}
            </div>
            <div className='d-flex align-items-center justify-content-center mt-4'>
                <button className='btn btn-primary w-100' onClick={handleForwardBdm} disabled={!selectedBdm}>
                    Forward
                </button>
            </div>
        </div>
    );
}

export default BdmMaturedCasesDialogBox;