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


function EmployeeGeneralLeads({
    generalData,
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
    handleShowCallHistory
}) {
    console.log("isLoaidng", isLoading)
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
    console.log("general hua")

    return (
        <div className="sales-panels-main">
            {!formOpen && !addFormOpen && (
                <>
                    <div className="table table-responsive table-style-3 m-0">
                        <table className="table table-vcenter table-nowrap" style={{width:"1800px"}}>
                            <thead>
                                <tr className="tr-sticky">
                                    <th className="rm-sticky-left-1">Sr. No</th>
                                    <th className="rm-sticky-left-2">Compnay Name</th>
                                    <th>Compnay No</th>
                                    <th>Call History</th>
                                    <th>Status</th>
                                    <th>Remarks</th>
                                    <th>Incorporation Date</th>
                                    <th>City</th>
                                    <th>State</th>
                                    <th>Compnay Email</th>
                                    <th>Assign Date</th>
                                </tr>
                            </thead>
                            {isLoading && dataStatus !== "All" ? (
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
                                    {generalData.map((company, index) => (
                                        <tr key={index} >
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
                                                <div key={company._id} className='d-flex align-items-center justify-content-between w-100' >
                                                    <p
                                                        className="rematkText text-wrap mb-0 mr-1"
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
                            {generalData && generalData.length === 0 && !isLoading && (
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
                </>)}
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

export default EmployeeGeneralLeads;