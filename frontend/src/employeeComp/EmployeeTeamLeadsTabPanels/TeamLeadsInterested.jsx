import React from 'react';
import { LuHistory } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import Nodata from '../../components/Nodata';
import TeamLeadsRemarksDialog from '../ExtraComponents/TeamLeadsRemarksDialog';
import EmployeeStatusChange from '../ExtraComponents/EmployeeStatusChange';
import ProjectionDialog from '../ExtraComponents/ProjectionDialog';
import FeedbackDialog from '../ExtraComponents/FeedbackDialog';
import EmployeeInterestedInformationDialog from "../ExtraComponents/EmployeeInterestedInformationDialog";
import { FaEye } from "react-icons/fa";

function TeamLeadsInterested({
    secretKey,
    interestedData,
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
    fetchProjections,
    projectionData,
    teamData,
    handleOpenFormOpen,
    newDesignation,
    selectedRows,
    setSelectedRows,
    handleCheckboxChange,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp
}) {

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    function timePassedSince(dateTimeString) {
        const entryTime = new Date(dateTimeString);
        const now = new Date();

        // Calculate difference in milliseconds
        const diffMs = now - entryTime;

        // Convert milliseconds to minutes and hours
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        // Format the difference
        if (diffDays > 0) {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        } else if (diffHours > 0) {
            return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else {
            return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
        }
    }

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

    return (
        <div className="sales-panels-main">
            <>
                <div className="table table-responsive e-Leadtable-style m-0">
                    <table className="table table-vcenter table-nowrap" style={{ width: "1800px" }}>
                        <thead>
                            <tr className="tr-sticky">
                                {(newDesignation === "admin" || newDesignation === "datamanager") &&
                                    (
                                        <th className='AEP-sticky-left-1'>
                                            <label className='table-check'>
                                                <input type="checkbox"
                                                    checked={selectedRows && interestedData && (selectedRows.length === interestedData.length)}
                                                    onChange={(e) => handleCheckboxChange("all", e)}
                                                />
                                                <span class="table_checkmark"></span>
                                            </label>
                                        </th>
                                    )}
                                <th className={(newDesignation === "admin" || newDesignation === "datamanager") ? "AEP-sticky-left-2" : "rm-sticky-left-1"}>Sr. No</th>
                                <th className={(newDesignation === "admin" || newDesignation === "datamanager") ? "AEP-sticky-left-3" : "rm-sticky-left-2"}>Compnay Name</th>
                                <th>BDE Name</th>
                                <th>Company Number</th>
                                <th>Call History</th>
                                <th>BDE Status</th>
                                <th>BDE Remarks</th>
                                <th>BDM Status</th>
                                <th>BDM Remarks</th>
                                <th>Incorporation Date</th>
                                <th>City</th>
                                <th>State</th>
                                <th>Compnay Email</th>
                                <th>BDE Forwarded Date</th>
                                <th>Add Projection</th>
                                <th>Add Feedback</th>
                                {newDesignation && <>
                                    <th>Status Modification Date</th>
                                    <th>Age</th>
                                </>}
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading && <tr>
                                <td colSpan="17">
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
                            {interestedData?.length !== 0 ? (
                                interestedData?.map((company, index) => (
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
                                        <td className={(newDesignation === "admin" || newDesignation === "datamanager") ? "AEP-sticky-left-2" : "rm-sticky-left-1"}>{startIndex + index + 1}</td>
                                        <td className={(newDesignation === "admin" || newDesignation === "datamanager") ? "AEP-sticky-left-3" : "rm-sticky-left-2"}>{company["Company Name"]}</td>
                                        <td>{company.ename}</td>
                                        <td>
                                            <div className="d-flex align-items-center justify-content-between wApp">
                                                <div>{company["Company Number"]}</div>
                                                <a target="_blank" href={`https://wa.me/91${company["Company Number"]}`}>
                                                    <FaWhatsapp />
                                                </a>
                                            </div>
                                        </td>
                                        <td>
                                            <LuHistory
                                                onClick={() => handleShowCallHistory(company["Company Name"], company["Company Number"])}
                                                style={{
                                                    cursor: "pointer",
                                                    width: "15px",
                                                    height: "15px",
                                                }}
                                                color="grey"
                                            />
                                        </td>
                                        <td>
                                            <div className="d-flex justify-content-center">
                                                <div className={`${company.bdeOldStatus === "Interested" ? "dfault_interested-status" : "dfault_followup-status"}`}>
                                                    {company.bdeOldStatus ? company.bdeOldStatus : company.Status}
                                                </div>

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
                                        <td>
                                            {newDesignation ?
                                                <div className={`${company.Status === "Interested" ? "dfault_interested-status" : "dfault_followup-status"}`}>
                                                    {company.Status}
                                                </div>
                                                : <EmployeeStatusChange
                                                    key={`${company["Company Name"]}-${index}`}
                                                    companyName={company["Company Name"]}
                                                    id={company._id}
                                                    refetch={refetchTeamLeads}
                                                    companyStatus={company.Status}
                                                    mainStatus={dataStatus}
                                                    isDeletedEmployeeCompany={company.isDeletedEmployeeCompany}
                                                    cemail={company["Company Email"]}
                                                    cindate={company["Incorporation Date"]}
                                                    cnum={company["Company Number"]}
                                                    ename={company.ename}
                                                    bdmName={company.bdmName}
                                                    bdmAcceptStatus={company.bdmAcceptStatus}
                                                    teamData={teamData}
                                                    handleFormOpen={handleOpenFormOpen}
                                                    isBdmStatusChange={true}
                                                />}
                                        </td>
                                        <td>
                                            <div key={company._id} className='d-flex align-items-center justify-content-between w-100' >
                                                <p className="rematkText text-wrap mb-0 mr-1" title={company.bdmRemarks}>
                                                    {!company["bdmRemarks"] ? "No Remarks" : company.bdmRemarks}
                                                </p>
                                                <TeamLeadsRemarksDialog
                                                    companyName={company["Company Name"]}
                                                    companyId={company._id}
                                                    remarksKey="bdmRemarks"
                                                    isEditable={true}
                                                    bdmAcceptStatus={company.bdmAcceptStatus}
                                                    companyStatus={company.Status}
                                                    name={company.bdmName}
                                                    mainRemarks={company.Remarks}
                                                    designation={designation}
                                                    bdmRemarks={company.bdmRemarks}
                                                    newDesignation={newDesignation}
                                                    refetch={refetchTeamLeads}
                                                />
                                            </div>
                                        </td>
                                        <td>{formatDateNew(company["Company Incorporation Date  "])}</td>
                                        <td>{company["City"]}</td>
                                        <td>{company["State"]}</td>
                                        <td>{company["Company Email"]}</td>
                                        <td>{formatDateNew(company.bdeForwardDate)}</td>
                                        <td>
                                            <ProjectionDialog
                                                key={`${company["Company Name"]}-${index}`} // Using index or another field to create a unique key
                                                projectionCompanyName={company["Company Name"]}
                                                projectionData={projectionData}
                                                secretKey={secretKey}
                                                fetchProjections={fetchProjections}
                                                ename={company.ename}
                                                bdmAcceptStatus={company.bdmAcceptStatus}
                                                hasMaturedStatus={false}
                                                hasExistingProjection={projectionData?.some(
                                                    (item) => item.companyName === company["Company Name"]
                                                )}
                                                newDesignation={newDesignation}
                                                isBdmProjection={true}
                                            /></td>
                                        <td>
                                            <FeedbackDialog
                                                companyId={company._id}
                                                companyName={company["Company Name"]}
                                                feedbackRemarks={company.feedbackRemarks}
                                                feedbackPoints={company.feedbackPoints}
                                                refetchTeamLeads={refetchTeamLeads}
                                                newDesignation={newDesignation}
                                                isEditable={true}
                                            />
                                        </td>
                                        {newDesignation && <>
                                            <td>{formatDate(company.bdmStatusChangeDate)} || {company.bdmStatusChangeTime}</td>
                                            <td>{timePassedSince(company.bdmStatusChangeDate)}</td>
                                        </>}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={17} className="text-center">
                                        <Nodata />
                                    </td>
                                </tr>
                            )
                            }
                        </tbody>

                    </table>
                </div>

                {interestedData && interestedData.length !== 0 && (
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

export default TeamLeadsInterested;