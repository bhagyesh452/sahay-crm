import React, { useState, useEffect } from 'react';
import { LuHistory } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import Nodata from '../../components/Nodata';
import EmployeeStatusChange from '../ExtraComponents/EmployeeStatusChange';
import RedesignedForm from '../../admin/RedesignedForm';
import AddLeadForm from '../../admin/AddLeadForm';
import RemarksDialog from '../ExtraComponents/RemarksDialog';
import ProjectionDialog from '../ExtraComponents/ProjectionDialog';
import AdminRemarksDialog from '../../admin/ExtraComponent/AdminRemarksDialog';


function EmployeeMaturedLeads({
    maturedLeads,
    isLoading,
    refetch,
    formatDateNew,
    startIndex,
    endIndex,
    totalPages,
    setCurrentPage,
    currentPage,
    dataStatus,
    setdataStatus,
    ename,
    email,
    secretKey,
    handleShowCallHistory,
    fetchProjections,
    projectionData,
    fordesignation,
    setSelectedRows,
    handleCheckboxChange,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    selectedRows,
    userId,
    bdenumber
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

    console.log("matutered hua", bdenumber)


    return (
        <div className="sales-panels-main" onMouseUp={handleMouseUp}>
            {!formOpen && !addFormOpen && (
                <>
                    <div className="table table-responsive table-style-3 m-0" onMouseUp={handleMouseUp}>
                        <table className="table table-vcenter table-nowrap" style={{ width: "2200px" }}>
                            <thead>
                                <tr className="tr-sticky">
                                    {(fordesignation === "admin" || fordesignation === "datamanager") &&
                                        (
                                            <th className='AEP-sticky-left-1'>
                                                <label className='table-check'>
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            selectedRows && maturedLeads && selectedRows.length === maturedLeads.length
                                                        }
                                                        onChange={(e) => handleCheckboxChange("all", e)}
                                                    />
                                                    <span class="table_checkmark"></span>
                                                </label>
                                            </th>
                                        )}
                                    <th className={(fordesignation === "admin" || fordesignation === "datamanager") ? "AEP-sticky-left-2" : "rm-sticky-left-1 "}>Sr. No</th>
                                    <th className={(fordesignation === "admin" || fordesignation === "datamanager") ? "AEP-sticky-left-3" : "rm-sticky-left-2 "}>company Name</th>
                                    <th>company No</th>
                                    <th>Call History</th>
                                    <th>Status</th>
                                    <th>Remarks</th>
                                    <th>Incorporation Date</th>
                                    <th>City</th>
                                    <th>State</th>
                                    <th>Company Email</th>
                                    <th>Assign Date</th>
                                    <th>Booking Date</th>
                                    <th>Booking Publish Date</th>
                                    <th className="rm-sticky-action">Add Projections</th>
                                </tr>
                            </thead>
                            {isLoading ? (
                                <tbody>
                                    <tr>
                                        <td colSpan="11">
                                            <div className="LoaderTDSatyle w-100">
                                                <ClipLoader
                                                    color="lightgrey"
                                                    loading={true}
                                                    size={30}
                                                    aria-label="Loading Spinner"
                                                    data-testid="loader"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>

                            ) : (
                                <tbody>
                                    {maturedLeads && maturedLeads.map((company, index) => (
                                        <tr key={company._id}
                                            style={{ border: "1px solid #ddd" }}
                                            onMouseDown={() => handleMouseDown(company._id)} // Start drag selection
                                            onMouseOver={() => handleMouseEnter(company._id)} // Continue drag selection
                                            onMouseUp={handleMouseUp} // End drag selection
                                            id={selectedRows && selectedRows.includes(company._id) ? 'selected_admin' : ''} // Highlight selected rows 
                                        >
                                            {(fordesignation === "admin" || fordesignation === "datamanager") && (
                                                <td
                                                    className='AEP-sticky-left-1'
                                                    style={{
                                                        position: "sticky",
                                                        left: 0,
                                                        zIndex: 1,
                                                        background: "white",
                                                    }}>
                                                    <label className='table-check'>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedRows && selectedRows.includes(
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
                                            <td className={(fordesignation === "admin" || fordesignation === "datamanager") ? "AEP-sticky-left-2" : "rm-sticky-left-1 "}>{startIndex + index + 1}</td>
                                            <td className={(fordesignation === "admin" || fordesignation === "datamanager") ? "AEP-sticky-left-3" : "rm-sticky-left-2 "}>{company["Company Name"]}</td>
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
                                                        handleShowCallHistory(
                                                            company["Company Name"],
                                                            company["Company Number"],
                                                            bdenumber,
                                                            company.bdmName

                                                        );
                                                        // setShowCallHistory(true);
                                                        // setClientNumber(company["Company Number"]);
                                                    }}
                                                    style={{
                                                        cursor: "pointer",
                                                        width: "15px",
                                                        height: "15px",
                                                    }}
                                                    color="grey"
                                                />
                                            </td>
                                            <td >
                                                <div className="dfault_approved-status">
                                                    {company.Status}
                                                </div>
                                            </td>
                                            <td>
                                                <div key={company._id} className='d-flex align-items-center justify-content-between w-100'>

                                                    <div>
                                                        {fordesignation === "admin" || fordesignation === "datamanager" ? (
                                                            <AdminRemarksDialog
                                                                key={`${company["Company Name"]}-${index}`}
                                                                currentRemarks={company.Remarks}
                                                                companyID={company._id}
                                                                companyStatus={company.Status}
                                                                secretKey={secretKey}
                                                            />

                                                        ) : (<>
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
                                                                remarksKey={company.bdmAcceptStatus === "Accept" ? "bdmRemarks" : "remarks"} // Adjust this based on the type of remarks (general or bdm)
                                                                isEditable={company.bdmAcceptStatus !== "Accept"} // Allow editing if status is not "Accept"
                                                                bdmAcceptStatus={company.bdmAcceptStatus}
                                                                companyStatus={company.Status}
                                                                secretKey={secretKey}
                                                                //fetchRemarksHistory={fetchRemarksHistory}
                                                                bdeName={ename}
                                                                refetch={refetch}
                                                                mainRemarks={company.Remarks}
                                                                fordesignation={fordesignation}
                                                                bdmName={company.bdmName}

                                                            />
                                                        </>
                                                        )}
                                                    </div>
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
                                            <td>{formatDateNew(company.bookingDate)}</td>
                                            <td>{formatDateNew(company.bookingPublishDate)}</td>
                                            <td className="rm-sticky-action">
                                                <ProjectionDialog
                                                    key={`${company["Company Name"]}-${index}`} // Using index or another field to create a unique key
                                                    projectionCompanyName={company["Company Name"]}
                                                    projectionData={projectionData}
                                                    secretKey={secretKey}
                                                    fetchProjections={fetchProjections}
                                                    ename={ename}
                                                    bdmAcceptStatus={company.bdmAcceptStatus}
                                                    hasMaturedStatus={true}
                                                    hasExistingProjection={projectionData?.some(
                                                        (item) => item.companyName === company["Company Name"]
                                                    )}
                                                    userId={userId}
                                                    fordesignation={fordesignation}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            )}
                            {maturedLeads && maturedLeads.length === 0 && !isLoading && (
                                <tbody>
                                    <tr>
                                        <td colSpan="14" className="p-2 particular">
                                            <Nodata />
                                        </td>
                                    </tr>
                                </tbody>
                            )}
                        </table>

                    </div>
                    {maturedLeads && maturedLeads.length !== 0 && (
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
                </>)
            }
            {
                formOpen && (
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
                )
            }
            {
                addFormOpen && (
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
                )
            }
        </div >
    );
}

export default EmployeeMaturedLeads;