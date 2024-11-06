import React from 'react';
import { LuHistory } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import Nodata from '../../components/Nodata';
import TeamLeadsRemarksDialog from '../ExtraComponents/TeamLeadsRemarksDialog';
import EmployeeInterestedInformationDialog from "../ExtraComponents/EmployeeInterestedInformationDialog";
import { FaEye } from "react-icons/fa";

function TeamLeadsNotInterested({
    secretKey,
    notInterestedData,
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
                                                    checked={selectedRows && notInterestedData && (selectedRows.length === notInterestedData.length)}
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
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading && <tr>
                                <td colSpan="15">
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
                            {notInterestedData?.length !== 0 ? (
                                notInterestedData?.map((company, index) => (
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
                                            <div className='dfault_notinterested-status'>
                                                {company.Status}
                                            </div>
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
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={15} className="text-center">
                                        <Nodata />
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>

                {notInterestedData && notInterestedData.length !== 0 && (
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

export default TeamLeadsNotInterested;