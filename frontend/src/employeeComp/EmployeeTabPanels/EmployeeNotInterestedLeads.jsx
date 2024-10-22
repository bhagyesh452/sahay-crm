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
import EmployeeNextFollowDate from '../ExtraComponents/EmployeeNextFollowUpDate';


function EmployeeNotInterestedLeads({
    notInterestedLeads,
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
    designation,
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

    return (
        <div className="sales-panels-main" onMouseUp={handleMouseUp}>
            {!formOpen && !addFormOpen && (
                <>
                    <div className="table table-responsive table-style-3 m-0">
                        <table className="table table-vcenter table-nowrap" style={{ width: "2200px" }}>
                            <thead>
                                <tr className="tr-sticky">
                                    {fordesignation === "admin" &&
                                        (
                                            <th>
                                                <label className='table-check'>
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            selectedRows.length === notInterestedLeads.length
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
                                    {designation !== "Sales Manager" && (
                                        <>
                                            <th>BDM FORWARDED</th>
                                            <th>BDM Name</th>
                                            <th>BDM Status</th>
                                            <th>BDM Remarks</th>
                                        </>
                                    )}
                                    <th>Incorporation Date</th>
                                    <th>City</th>
                                    <th>State</th>
                                    <th>Company Email</th>
                                    <th>Assign Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {notInterestedLeads.map((company, index) => (
                                    <tr key={company._id}
                                        // className={
                                        //     fordesignation === "admin" && selectedRows && selectedRows.includes(company._id)
                                        //         ? "selected"
                                        //         : ""
                                        // }
                                        style={{ border: "1px solid #ddd" }}
                                        onMouseDown={() => handleMouseDown(company._id)} // Start drag selection
                                        onMouseOver={() => handleMouseEnter(company._id)} // Continue drag selection
                                        onMouseUp={handleMouseUp} // End drag selection
                                        id={selectedRows.includes(company._id) ? 'selected_admin' : ''} // Highlight selected rows
                                    >
                                         {fordesignation === "admin" && (
                                            <td
                                                style={{
                                                    position: "sticky",
                                                    left: 0,
                                                    zIndex: 1,
                                                    background: "white",
                                                }}>
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
                                            <EmployeeStatusChange
                                                key={`${company["Company Name"]}-${index}`}
                                                companyName={company["Company Name"]}
                                                companyStatus={company.Status}
                                                id={company._id}
                                                refetch={refetch}
                                                mainStatus={dataStatus}
                                                setCompanyName={setCompanyName}
                                                setCompanyEmail={setCompanyEmail}
                                                setCompanyInco={setCompanyInco}
                                                setCompanyId={setCompanyId}
                                                setCompanyNumber={setCompanyNumber}
                                                setDeletedEmployeeStatus={setDeletedEmployeeStatus}
                                                setNewBdeName={setNewBdeName}
                                                isDeletedEmployeeCompany={company.isDeletedEmployeeCompany}
                                                setFormOpen={setFormOpen}
                                                setAddFormOpen={setAddFormOpen}
                                                cemail={company["Company Email"]}
                                                cindate={company["Incorporation Date"]}
                                                cnum={company["Company Number"]}
                                                ename={company.ename}
                                                bdmAcceptStatus={company.bdmAcceptStatus}
                                            />
                                        </td>
                                        <td>
                                            <div
                                                key={company._id} className='d-flex align-items-center justify-content-between w-100'  >
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
                                        {designation !== "Sales Manager" && (<>
                                            <td>
                                                {company.bdmAcceptStatus !== "NotForwarded" ? "Yes" : "No"}
                                            </td>
                                            <td>{company.bdmAcceptStatus !== "NotForwarded" ? company.bdmName : "-"}</td>
                                            <td>{company.bdmAcceptStatus !== "NotForwarded" ? company.Status : "-"}</td>
                                            <td>{company.bdmAcceptStatus !== "NotForwarded" ?
                                                <div key={company._id}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        width: "100px",
                                                    }}>
                                                    <p
                                                        className="rematkText text-wrap m-0"
                                                        title={company.remarks}
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
                                                </div> : "-"}</td>
                                        </>)}
                                        <td>
                                            {formatDateNew(
                                                company["Company Incorporation Date  "]
                                            )}
                                        </td>
                                        <td>{company["City"]}</td>
                                        <td>{company["State"]}</td>
                                        <td>{company["Company Email"]}</td>
                                        <td>{formatDateNew(company["AssignDate"])}</td>
                                    </tr>
                                ))}
                            </tbody>

                            {notInterestedLeads && notInterestedLeads.length === 0 && !isLoading && (
                                <tbody>
                                    <tr>
                                        <td colSpan="11" className="p-2 particular">
                                            <Nodata />
                                        </td>
                                    </tr>
                                </tbody>
                            )}
                        </table>
                    </div>
                    {notInterestedLeads && notInterestedLeads.length !== 0 && (
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

export default EmployeeNotInterestedLeads;