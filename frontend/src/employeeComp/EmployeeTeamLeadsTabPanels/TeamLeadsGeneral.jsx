import React, { useState } from 'react';
import { LuHistory } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import { GrStatusGood } from "react-icons/gr";
import { IconButton } from "@mui/material";
import Nodata from '../../components/Nodata';
import EmployeeStatusChange from '../ExtraComponents/EmployeeStatusChange';
import RedesignedForm from '../../admin/RedesignedForm';
import AddLeadForm from '../../admin/AddLeadForm';
import TeamLeadsRemarksDialog from '../ExtraComponents/TeamLeadsRemarksDialog';
import axios from "axios";
import Swal from "sweetalert2";
import EmployeeInterestedInformationDialog from "../ExtraComponents/EmployeeInterestedInformationDialog";
import { FaEye } from "react-icons/fa";
import Cliploader from "react-spinners/ClipLoader";

function TeamLeadsGeneral({
    secretKey,
    generalData,
    isLoading,
    refetchTeamLeads,
    formatDateNew,
    startIndex,
    endIndex,
    totalPages,
    setCurrentPage,
    currentPage,
    dataStatus,
    setDataStatus,
    ename,
    email,
    designation,
    handleShowCallHistory,
    projectionData,
    newDesignation,
    selectedRows,
    setSelectedRows,
    handleCheckboxChange,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp
}) {

    const nextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage((prevPage) => prevPage + 1);
            refetchTeamLeads(); // Trigger a refetch when the page changes
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prevPage) => prevPage - 1);
            refetchTeamLeads(); // Trigger a refetch when the page changes
        }
    };

    // console.log("Current page is :", currentPage);
    // console.log("Total pages are :", totalPages);

    const handleAcceptClick = async (companyId, cName, cemail, cdate, cnumber, oldStatus, newBdmStatus) => {
        console.log(companyId)
        const DT = new Date();
        try {
            const response = await axios.post(`${secretKey}/bdm-data/update-bdm-status/${companyId}`, {
                newBdmStatus,
                companyId,
                oldStatus,
                bdmAcceptStatus: "Accept",
                bdmStatusChangeDate: new Date(),
                bdmStatusChangeTime: DT.toLocaleTimeString()
            });

            const filteredProjectionData = projectionData.filter((company) => company.companyName === cName);
            if (filteredProjectionData.length !== 0) {
                const response2 = await axios.post(`${secretKey}/projection/post-followupupdate-bdmaccepted/${cName}`, {
                    caseType: "Recieved"
                });
            }

            if (response.status === 200) {
                Swal.fire("Accepted");
                refetchTeamLeads();
            } else {
                console.error("Failed to update status:", response.data.message);
            }
        } catch (error) {
            console.log("Error updating status", error.message)
        }
    };

    return (
        <div className="sales-panels-main">
            <>
                <div className="table table-responsive table-style-3 m-0">
                    <table className="table table-vcenter table-nowrap" style={{ width: "1800px" }}>
                        <thead>
                            <tr className="tr-sticky">
                                {(newDesignation === "admin" || newDesignation === "datamanager") &&
                                    (
                                        <th className='AEP-sticky-left-1'>
                                            <label className='table-check'>
                                                <input type="checkbox"
                                                    checked={selectedRows && generalData && (selectedRows.length === generalData.length)}
                                                    onChange={(e) => handleCheckboxChange("all", e)}
                                                />
                                                <span class="table_checkmark"></span>
                                            </label>
                                        </th>
                                    )}
                                <th className={(newDesignation === "admin" || newDesignation === "datamanager") ? "AEP-sticky-left-2" : "rm-sticky-left-1 "}>Sr. No</th>
                                <th className={(newDesignation === "admin" || newDesignation === "datamanager") ? "AEP-sticky-left-3" : "rm-sticky-left-1 "}>Compnay Name</th>
                                <th>BDE Name</th>
                                <th>BDE Status</th>
                                <th>BDE Remarks</th>
                                <th>Incorporation Date</th>
                                <th>City</th>
                                <th>State</th>
                                <th>BDE Forwarded Date</th>
                                {!newDesignation && <th>Action</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading && <tr>
                                <td colSpan="11">
                                    <div className="LoaderTDSatyle">
                                        <ClipLoader
                                            color="lightgrey"
                                            loading
                                            size={30}
                                            aria-label="Loading Spinner"
                                            data-testid="loader"
                                        />
                                    </div>
                                </td>
                            </tr>}
                            {generalData?.length !== 0 ? (
                                generalData?.map((company, index) => (
                                    <tr key={company._id}
                                        onMouseDown={() => handleMouseDown(company._id)} // Start drag selection
                                        onMouseOver={() => handleMouseEnter(company._id)} // Continue drag selection
                                        onMouseUp={handleMouseUp} // End drag selection
                                        id={selectedRows && selectedRows.includes(company._id) ? 'selected_admin' : ''} // Highlight selected rows
                                    >
                                        {(newDesignation === "admin" || newDesignation === "datamanager") && (
                                            <td className='AEP-sticky-left-1'>
                                                <label className='table-check'>
                                                    <input type="checkbox"
                                                        checked={selectedRows && selectedRows.includes(company._id)}
                                                        onChange={(e) => handleCheckboxChange(company._id, e)}
                                                    />
                                                    <span class="table_checkmark"></span>
                                                </label>

                                            </td>
                                        )}
                                        <td className={(newDesignation === "admin" || newDesignation === "datamanager") ? "AEP-sticky-left-2" : "rm-sticky-left-1 "}>{startIndex + index + 1}</td>
                                        <td className={(newDesignation === "admin" || newDesignation === "datamanager") ? "AEP-sticky-left-3" : "rm-sticky-left-2 "}>{company["Company Name"]}</td>
                                        <td>{company.ename}</td>
                                        <td>
                                            <div className="d-flex justify-content-center">
                                                <div className={`${company.Status === "Interested" ? "dfault_interested-status" : "dfault_followup-status"}`}>
                                                    {company.Status}
                                                </div>

                                                {/* <div className="intersted-history-btn disabled"> */}
                                                <div className={company.interestedInformation.length !== 0 ? "intersted-history-btn" : "intersted-history-btn disabled"}>
                                                    <FaEye
                                                        key={company._id}
                                                        style={{ border: "transparent", background: "none" }}
                                                        data-bs-toggle="modal"
                                                        data-bs-target={`#${`modal-${company["Company Name"].replace(/\s+/g, '')}`}-info`}
                                                        title="Interested Information"
                                                        disabled={!company.interestedInformation}
                                                    />

                                                    <EmployeeInterestedInformationDialog
                                                        key={company._id}
                                                        modalId={`modal-${company["Company Name"].replace(/\s+/g, '')}-info`}
                                                        companyName={company["Company Name"]}
                                                        interestedInformation={company.interestedInformation} // Pass the interested information here
                                                        refetch={refetchTeamLeads}
                                                        ename={company.ename}
                                                        secretKey={secretKey}
                                                        status={company.Status}
                                                        companyStatus={company.Status}
                                                        forView={true}
                                                    />
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <div key={company._id} className='d-flex align-items-center justify-content-between w-100' >
                                                <p className="rematkText text-wrap mb-0 mr-1" title={company.Remarks}>
                                                    {!company["Remarks"] ? "No Remarks" : company.Remarks}
                                                </p>
                                                <TeamLeadsRemarksDialog
                                                    companyName={company["Company Name"]}
                                                    companyId={company._id}
                                                    remarksKey="remarks"
                                                    isEditable={false}
                                                    bdmAcceptStatus={company.bdmAcceptStatus}
                                                    companyStatus={company.Status}
                                                    name={company.ename}
                                                    mainRemarks={company.Remarks}
                                                    designation={designation}
                                                    bdeRemarks={company.Remarks}
                                                    refetch={refetchTeamLeads}
                                                />
                                            </div>
                                        </td>
                                        <td>{formatDateNew(company["Company Incorporation Date  "])}</td>
                                        <td>{company["City"]}</td>
                                        <td>{company["State"]}</td>
                                        <td>{formatDateNew(company.bdeForwardDate)}</td>
                                        {!newDesignation && <td>
                                            <IconButton style={{ color: "green", marginRight: "5px", height: "25px", width: "25px" }}
                                                onClick={(e) => handleAcceptClick(
                                                    company._id,
                                                    company["Company Name"],
                                                    company["Company Email"],
                                                    company["Company Incorporation Date  "],
                                                    company["Company Number"],
                                                    company["Status"],
                                                    company.bdmStatus
                                                )}
                                            >
                                                <GrStatusGood />
                                            </IconButton>
                                        </td>}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={11} className="text-center">
                                        <Nodata />
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>

                {generalData && generalData.length !== 0 && (
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
        </div>
    );
}

export default TeamLeadsGeneral;