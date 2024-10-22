import React, { useState, useEffect } from 'react';
import { LuHistory } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import Nodata from '../../components/Nodata';
import RemarksDialog from '../ExtraComponents/RemarksDialog';
import EmployeeStatusChange from '../ExtraComponents/EmployeeStatusChange';
import RedesignedForm from '../../admin/RedesignedForm';
import AddLeadForm from '../../admin/AddLeadForm';
import { format } from 'date-fns';
import axios from "axios";
import Swal from "sweetalert2";
import { TiArrowBack } from "react-icons/ti";
import { TiArrowForward } from "react-icons/ti";
import { RiInformationLine } from "react-icons/ri";
import FeedbackDialog from '../ExtraComponents/FeedbackDialog';

function EmployeeForwardedLeads({
    forwardedLeads,
    isLoading,
    refetch,
    formatDateNew,
    startIndex,
    endIndex,
    totalPages,
    setCurrentPage,
    currentPage,
    secretKey,
    dataStatus,
    setdataStatus,
    ename,
    email,
    handleShowCallHistory,
    fordesignation,
    setSelectedRows,
    handleCheckboxChange,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    selectedRows,
}) {

    const [companyName, setCompanyName] = useState("");
    const [maturedCompanyName, setMaturedCompanyName] = useState("");
    const [companyEmail, setCompanyEmail] = useState("");
    const [companyInco, setCompanyInco] = useState(null);
    const [companyNumber, setCompanyNumber] = useState(0);
    const [companyId, setCompanyId] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    //const [editFormOpen, setEditFormOpen] = useState(false);
    const [addFormOpen, setAddFormOpen] = useState(false);
    const [deletedEmployeeStatus, setDeletedEmployeeStatus] = useState(false)
    const [newBdeName, setNewBdeName] = useState("")
    const [nowToFetch, setNowToFetch] = useState(false);

    const nextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage((prevPage) => prevPage + 1);
            refetch(); // Trigger a refetch when the page changes
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prevPage) => prevPage - 1);
            refetch(); // Trigger a refetch when the page changes
        }
    };
    // --------------------------------function to take company back forwarded to bdm and not accepted by bdm--------------------------
    const handleReverseAssign = async (
        companyId,
        companyName,
        bdmAcceptStatus,
        empStatus,
        bdmName
    ) => {
        if (bdmAcceptStatus === "Pending") {
            try {
                const response = await axios.post(
                    `${secretKey}/bdm-data/teamleads-reversedata/${companyId}`,
                    {
                        companyName,
                        bdmAcceptStatus: "NotForwarded",
                        bdmName: "NoOne" // Corrected parameter name
                    }
                );
                const response2 = await axios.post(`${secretKey}/projection/post-updaterejectedfollowup/${companyName}`, {
                    caseType: "NotForwarded"
                })
                // console.log("response", response.data);
                Swal.fire("Data Reversed");
                refetch();
            } catch (error) {
                console.log("error reversing bdm forwarded data", error.message);
            }
        } else if (bdmAcceptStatus === "NotForwarded") {
            Swal.fire("Cannot Reforward Data");
        } else if (bdmAcceptStatus === "Accept") {
            Swal.fire("BDM already accepted this data!");
        }
    };

    //----------- function to revert back company accepted by bdm ----------------------------
    const handleRevertAcceptedCompany = async (companyId, companyName, bdeStatus) => {
        // Show confirmation dialog
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You wan't to revert back this company!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, revert it!'
        });

        // If confirmed, proceed with the request
        if (result.isConfirmed) {
            try {
                const response = await axios.post(`${secretKey}/company-data/post-bderevertbackacceptedcompanyrequest`, null, {
                    params: {
                        companyId,
                        companyName
                    }
                });
                Swal.fire(
                    'Reverted!',
                    'The company request has been reverted back.',
                    'success'
                );

                refetch();
            } catch (error) {
                console.log("Error reverting back company", error);
                Swal.fire(
                    'Error!',
                    'There was an error reverting back the company request.',
                    'error'
                );
            }
        }
    };

    const [selectedCompanies, setSelectedCompanies] = useState([]); // Track selected companies
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartIndex, setDragStartIndex] = useState(null);
    const [startDragIndex, setStartDragIndex] = useState(null);
    const [lastSelectedIndex, setLastSelectedIndex] = useState(null);

    // Function to toggle individual checkbox selection
    const handleCheckboxToggle = (index) => {
        setSelectedCompanies((prevSelected) => {
            if (prevSelected.includes(index)) {
                return prevSelected.filter((i) => i !== index); // Deselect if already selected
            } else {
                return [...prevSelected, index]; // Select if not already selected
            }
        });
    };

    // Function to start dragging selection
    // const handleMouseDown = (index) => {
    //     setIsDragging(true);
    //     setStartDragIndex(index);
    //     setLastSelectedIndex(index);
    //     setSelectedCompanies([index]); // Start by selecting the initial company
    // };

    // // Function to handle selection during dragging
    // const handleMouseOver = (index) => {
    //     if (isDragging) {
    //         const range = getRange(startDragIndex, index);
    //         setSelectedCompanies(range); // Select the companies in the drag range
    //         setLastSelectedIndex(index);
    //     }
    // };

    // // Function to stop dragging selection
    // const handleMouseUp = () => {
    //     setIsDragging(false);
    //     setStartDragIndex(null);
    // };

    // // Helper function to get the range of selected indices
    // const getRange = (start, end) => {
    //     const range = [];
    //     for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
    //         range.push(i);
    //     }
    //     return range;
    // };

    // console.log("selectedCompanies", selectedCompanies);

    return (
        <div className="sales-panels-main" onMouseUp={handleMouseUp}>
            {!formOpen && !addFormOpen && (
                <>
                    <div className="table table-responsive table-style-3 m-0">
                        <table className="table table-vcenter table-nowrap" style={{ width: "2200px" }} onMouseLeave={handleMouseUp}>
                            <thead>
                                <tr className="tr-sticky">
                                    {fordesignation === "admin" &&
                                        (
                                            <th>
                                                <label className='table-check'>
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            selectedRows.length === forwardedLeads.length
                                                        }
                                                        onChange={(e) => handleCheckboxChange("all", e)}

                                                    />
                                                    <span class="table_checkmark"></span>
                                                </label>
                                            </th>
                                        )}
                                    <th className="rm-sticky-left-1">Sr. No</th>
                                    <th className="rm-sticky-left-2">Company Name</th>
                                    <th>Company No</th>
                                    <th>Call History</th>
                                    <th>BDE Status</th>
                                    <th>BDE Remarks</th>
                                    <th>BDM Status</th>
                                    <th>BDM Remarks</th>
                                    <th>Incorporation Date</th>
                                    <th>City</th>
                                    <th>State</th>
                                    <th>Company Email</th>
                                    <th>Assign Date</th>
                                    <th>BDM Name</th>
                                    <th>Forwarded Date</th>
                                    <th>Forward To BDM</th>
                                    <th className="rm-sticky-action">Feedback</th>
                                </tr>
                            </thead>

                            <tbody>
                                {forwardedLeads.map((company, index) => (
                                    <tr key={company._id}
                                        style={{ border: "1px solid #ddd" }}
                                        onMouseDown={() => handleMouseDown(company._id)} // Start drag selection
                                        onMouseOver={() => handleMouseEnter(company._id)} // Continue drag selection
                                        onMouseUp={handleMouseUp} // End drag selection
                                        id={selectedRows.includes(company._id) ? 'selected_admin' : ''} // Highlight selected rows
                                    >
                                        {fordesignation === "admin" && (
                                            <td>
                                                <label className='table-check'>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedRows.includes(
                                                            company._id
                                                        )}
                                                        onChange={(e) =>
                                                            handleCheckboxChange(company._id, e)
                                                        }
                                                        onMouseUp={handleMouseUp}
                                                    />
                                                    <span class="table_checkmark"></span>
                                                </label>

                                            </td>
                                        )}
                                        <td className="rm-sticky-left-1">{startIndex + index + 1}</td>
                                        <td className="rm-sticky-left-2">{company["Company Name"]}</td>
                                        <td>
                                            <div className="d-flex align-items-center justify-content-between wApp">
                                                <div>{company["Company Number"]}</div>
                                                <a
                                                    target="_blank"
                                                    href={`https://wa.me/91${company["Company Number"]}`}
                                                >
                                                    <FaWhatsapp />
                                                </a>
                                            </div>
                                        </td>
                                        <td>
                                            <LuHistory
                                                onClick={() => {
                                                    handleShowCallHistory(company["Company Name"], company["Company Number"]);
                                                }}
                                                style={{
                                                    cursor: "pointer",
                                                    width: "15px",
                                                    height: "15px",
                                                }}
                                                color="grey"
                                            />
                                        </td>
                                        <td>
                                            {company.bdeOldStatus}
                                        </td>
                                        <td>
                                            <div
                                                key={company._id} className='d-flex align-items-center justify-content-between w-100' >
                                                <p
                                                    className="rematkText text-wrap m-0"
                                                    title={company.Remarks}
                                                >
                                                    {!company["Remarks"]
                                                        ? "No Remarks"
                                                        : company.Remarks}
                                                </p>
                                                <RemarksDialog
                                                    key={`${company["Company Name"]}-${index}`} // Using index or another field to create a unique key
                                                    currentCompanyName={company["Company Name"]}
                                                    //remarksHistory={remarksHistory} // pass your remarks history data
                                                    companyId={company._id}
                                                    remarksKey="remarks" // Adjust this based on the type of remarks (general or bdm)
                                                    isEditable={company.bdmAcceptStatus !== "Accept"} // Allow editing if status is not "Accept"
                                                    bdmAcceptStatus={company.bdmAcceptStatus}
                                                    companyStatus={company.Status}
                                                    secretKey={secretKey}
                                                    //fetchRemarksHistory={fetchRemarksHistory}
                                                    bdeName={company.ename}
                                                    refetch={refetch}
                                                    mainRemarks={company.Remarks}
                                                />
                                            </div>
                                        </td>
                                        <td>{company.Status}</td>
                                        <td>
                                            <div key={company._id}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    width: "100px",
                                                }}>
                                                <p
                                                    className="rematkText text-wrap m-0"
                                                    title={company.bdmRemarks}
                                                >
                                                    {!company.bdmRemarks
                                                        ? "No Remarks"
                                                        : company.bdmRemarks}
                                                </p>
                                                <RemarksDialog
                                                    key={`${company["Company Name"]}-${index}`} // Using index or another field to create a unique key
                                                    currentCompanyName={company["Company Name"]}
                                                    //filteredRemarks={filteredRemarks}
                                                    companyId={company._id}
                                                    remarksKey="bdmRemarks" // For BDM remarks
                                                    isEditable={false} // Disable editing
                                                    secretKey={secretKey}
                                                    //fetchRemarksHistory={fetchRemarksHistory}
                                                    bdeName={company.ename}
                                                    fetchNewData={refetch}
                                                    bdmName={company.bdmName}
                                                    bdmAcceptStatus={company.bdmAcceptStatus}
                                                    companyStatus={company.Status}
                                                    mainRemarks={company.Remarks}
                                                //remarksHistory={remarksHistory} // pass your remarks history data
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            {formatDateNew(
                                                company["Company Incorporation Date  "]
                                            )}
                                        </td>
                                        <td>{company["City"]}</td>
                                        <td>{company["State"]}</td>
                                        <td>{company["Company Email"]}</td>
                                        <td>{formatDateNew(company["AssignDate"])}</td>
                                        <td>{company.bdmName}</td>
                                        <td>{formatDateNew(company.bdeForwardDate)}</td>
                                        <td>
                                            {company.bdmAcceptStatus === "NotForwarded" ? (<>
                                                <TiArrowForward
                                                    // onClick={() => {
                                                    //     handleConfirmAssign(
                                                    //         company._id,
                                                    //         company["Company Name"],
                                                    //         company.Status, // Corrected parameter name
                                                    //         company.ename,
                                                    //         company.bdmAcceptStatus
                                                    //     );
                                                    // }}
                                                    style={{
                                                        cursor: "pointer",
                                                        width: "17px",
                                                        height: "17px",
                                                    }}
                                                    color="grey"
                                                />
                                            </>) : company.bdmAcceptStatus === "Pending" || company.bdmAcceptStatus === "Forwarded" ? (<>

                                                <TiArrowBack
                                                    onClick={() => {
                                                        handleReverseAssign(
                                                            company._id,
                                                            company["Company Name"],
                                                            company.bdmAcceptStatus,
                                                            company.Status,
                                                            company.bdmName
                                                        )
                                                    }}
                                                    style={{
                                                        cursor: "pointer",
                                                        width: "17px",
                                                        height: "17px",
                                                    }}
                                                    color="#fbb900"
                                                />
                                            </>) :
                                                (company.bdmAcceptStatus === "Accept" && !company.RevertBackAcceptedCompanyRequest) ? (
                                                    <>
                                                        <TiArrowBack
                                                            onClick={() => handleRevertAcceptedCompany(
                                                                company._id,
                                                                company["Company Name"],
                                                                company.Status
                                                            )}
                                                            style={{
                                                                cursor: "pointer",
                                                                width: "17px",
                                                                height: "17px",
                                                            }}
                                                            color="black" />
                                                    </>) :
                                                    (company.bdmAcceptStatus === 'Accept' && company.RevertBackAcceptedCompanyRequest === 'Send') ? (
                                                        <>
                                                            <TiArrowBack
                                                                style={{
                                                                    cursor: "pointer",
                                                                    width: "17px",
                                                                    height: "17px",
                                                                }}
                                                                color="lightgrey" />
                                                        </>) : (<>
                                                            <TiArrowForward
                                                                onClick={() => {
                                                                }}
                                                                style={{
                                                                    cursor: "pointer",
                                                                    width: "17px",
                                                                    height: "17px",
                                                                }}
                                                                color="grey"
                                                            />
                                                        </>)}
                                        </td>
                                        <td className="rm-sticky-action">
                                            <FeedbackDialog
                                                key={`${company["Company Name"]}-${index}`} // Using index or another field to create a unique key
                                                companyId={company._id}
                                                companyName={company["Company Name"]}
                                                feedbackRemarks={company.feedbackRemarks ? company.feedbackRemarks : "No Remarks"}
                                                feedbackPoints={company.feedbackPoints ? company.feedbackPoints : "0"}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                            {forwardedLeads && forwardedLeads.length === 0 && !isLoading && (
                                <tbody>
                                    <tr>
                                        <td colSpan="17" className="p-2 particular">
                                            <Nodata />
                                        </td>
                                    </tr>
                                </tbody>
                            )}
                        </table>
                    </div>
                    {forwardedLeads && forwardedLeads.length !== 0 && (
                        <div className="pagination d-flex align-items-center justify-content-center w-100">
                            <div>
                                <button className='btn-pagination' onClick={prevPage} disabled={currentPage === 0}>
                                    <GoArrowLeft />
                                </button>
                            </div>
                            <div className='ml-3 mr-3'>
                                Page {currentPage + 1} of {totalPages}
                            </div>
                            <div>
                                <button className='btn-pagination' onClick={nextPage} disabled={currentPage >= totalPages - 1}>
                                    <GoArrowRight />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
            {formOpen && (
                <>
                    <RedesignedForm
                        // matured={true}
                        // companysId={companyId}
                        setDataStatus={setdataStatus}
                        setFormOpen={setFormOpen}
                        companysName={companyName}
                        companysEmail={companyEmail}
                        companyNumber={companyNumber}
                        setNowToFetch={setNowToFetch}
                        companysInco={companyInco}
                        employeeName={ename}
                        employeeEmail={email}
                    />
                </>
            )}
            {addFormOpen && (
                <>
                    {" "}
                    <AddLeadForm
                        employeeEmail={email}
                        newBdeName={newBdeName}
                        isDeletedEmployeeCompany={deletedEmployeeStatus}
                        setFormOpen={setAddFormOpen}
                        companysName={companyName}
                        setNowToFetch={setNowToFetch}
                        setDataStatus={setdataStatus}
                        employeeName={ename}
                    />
                </>
            )}
        </div>
    );
}

export default EmployeeForwardedLeads;