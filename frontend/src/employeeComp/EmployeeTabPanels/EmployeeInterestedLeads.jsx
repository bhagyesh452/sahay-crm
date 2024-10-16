
import React, { useState, useEffect } from 'react';
import { LuHistory } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import { IconChevronLeft, IconEye } from "@tabler/icons-react";
import { IconChevronRight } from "@tabler/icons-react";
import Nodata from '../../components/Nodata';
import RemarksDialog from '../ExtraComponents/RemarksDialog';
import EmployeeStatusChange from '../ExtraComponents/EmployeeStatusChange';
import RedesignedForm from '../../admin/RedesignedForm';
import AddLeadForm from '../../admin/AddLeadForm';
import EmployeeNextFollowDate from '../ExtraComponents/EmployeeNextFollowUpDate';
import CallHistory from '../CallHistory';


function EmployeeInterestedLeads({
    interestedData,
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
    handleCloseCallHistory
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
    // const hanleCloseCallHistory = () => {
    //     setShowCallHistory(false);
    // };

    return (
        <div className="RM-my-booking-lists">
            {!formOpen && !addFormOpen && (
                <>
                    <div className="table table-responsive table-style-3 m-0">
                        <table className="table table-vcenter table-nowrap">
                            <thead>
                                <tr className="tr-sticky">
                                    <th>Sr. No</th>
                                    <th>Company Name</th>
                                    <th>Company No</th>
                                    <th>Call History</th>
                                    <th>Status</th>
                                    <th>Remarks</th>
                                    <th>Next FollowUp Date</th>
                                    <th>Incorporation Date</th>
                                    <th>City</th>
                                    <th>State</th>
                                    <th>Company Email</th>
                                    <th>Assign Date</th>
                                </tr>
                            </thead>
                            {isLoading && dataStatus !== "Interested" ? (
                                <tbody>
                                    <tr>
                                        <td colSpan="11" >
                                            <div className="LoaderTDSatyle w-100" >
                                                <ClipLoader
                                                    color="lightgrey"
                                                    loading
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
                                    {interestedData.map((company, index) => (
                                        <tr
                                            key={index}
                                            style={{ border: "1px solid #ddd" }}
                                        >
                                            <td className="td-sticky">{startIndex + index + 1}</td>
                                            <td className="td-sticky1">{company["Company Name"]}</td>
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
                                                    key={company._id}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        width: "100px",
                                                    }}
                                                >
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
                                            <td>
                                                <EmployeeNextFollowDate
                                                    key={`${company["Company Name"]}-${index}`}
                                                    companyName={company["Company Name"]}
                                                    id={company._id}
                                                    nextFollowDate={company.bdeNextFollowUpDate}
                                                    refetch={refetch}
                                                />
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
                                        </tr>
                                    ))}
                                </tbody>
                            )}
                            {interestedData && interestedData.length === 0 && !isLoading && (
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
                    {interestedData && interestedData.length !== 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} className="pagination">
                            <button onClick={prevPage} disabled={currentPage === 0}>
                                <IconChevronLeft />
                            </button>
                            <span>
                                Page {currentPage + 1} of {totalPages}
                            </span>
                            <button onClick={nextPage} disabled={currentPage >= totalPages - 1}>
                                <IconChevronRight />
                            </button>
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

export default EmployeeInterestedLeads;