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
import TeamLeadsRemarksDialog from '../ExtraComponents/TeamLeadsRemarksDialog';
import ProjectionDialog from '../ExtraComponents/ProjectionDialog';
import LeadFormPreview from '../../admin/LeadFormPreview';
import { Drawer } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IconEye } from "@tabler/icons-react";
import { IconButton } from "@mui/material";
import axios from "axios";
import EmployeeInterestedInformationDialog from "../ExtraComponents/EmployeeInterestedInformationDialog";
import { FaEye } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
import Cliploader from "react-spinners/ClipLoader";

function TeamLeadsMatured({
    secretKey,
    maturedData,
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
    projectionData
}) {

    const navigate = useNavigate();
    const { userId } = useParams();

    // const [formOpen, setFormOpen] = useState(false);
    // const [companyData, setCompanyData] = useState(null);
    // const [companyId, setCompanyId] = useState("");

    // const fetchRedesignedFormData = async () => {
    //     try {
    //         const response = await axios.get(`${secretKey}/bookings/redesigned-final-leadData`);
    //         const data = response.data.find((obj) => obj.company === companyId);
    //         console.log("Company Data :", data);
    //         setCompanyData(data);
    //     } catch (error) {
    //         console.error("Error fetching data:", error.message);
    //     }
    // };

    // useEffect(() => {
    //     //console.log("Matured ID Changed", maturedID);
    //     if (companyId) {
    //         fetchRedesignedFormData();
    //     }
    // }, [companyId]);

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

    return (
        <div className="sales-panels-main">
            <>
                <div className="table table-responsive table-style-3 m-0">
                    <table className="table table-vcenter table-nowrap" style={{ width: "1800px" }}>
                        <thead>
                            <tr className="tr-sticky">
                                <th className="rm-sticky-left-1">Sr. No</th>
                                <th className="rm-sticky-left-2">Compnay Name</th>
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
                                <th>Action</th>
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
                            {maturedData?.length !== 0 ? (
                                maturedData?.map((company, index) => (
                                    <tr key={index}>
                                        <td className="rm-sticky-left-1">{startIndex + index + 1}</td>
                                        <td className="rm-sticky-left-2">{company["Company Name"]}</td>
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
                                                <div className='dfault_approved-status'>
                                                    {company.Status}
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
                                            <div className='dfault_approved-status'>
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
                                            <IconButton style={{ marginRight: "5px" }}
                                                onClick={() => {
                                                    // setCompanyId(company._id);
                                                    // setTimeout(() => {
                                                    //     setFormOpen(true);
                                                    // }, 1000);
                                                    navigate(`/employee-bookings/${userId}`);
                                                }}
                                            >
                                                <IconEye
                                                    style={{
                                                        width: "14px",
                                                        height: "14px",
                                                        color: "#d6a10c",
                                                        cursor: "pointer",
                                                    }}
                                                />
                                            </IconButton>
                                        </td>
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

                {maturedData && maturedData.length !== 0 && (
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

            {/*  --------------------------------     Bookings View Sidebar   --------------------------------------------- */}
            {/* <Drawer anchor="right" open={formOpen}>
                <div style={{ minWidth: "60vw" }} className="LeadFormPreviewDrawar">
                    <div className="LeadFormPreviewDrawar-header">
                        <div className="Container">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h2 className="title m-0 ml-1">
                                        {companyData ? companyData["Company Name"] : "Company Name"}
                                    </h2>
                                </div>
                                <div>
                                    <IconButton onClick={() => setFormOpen(false)}>
                                        <CloseIcon />
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <LeadFormPreview setOpenAnchor={setFormOpen} currentLeadForm={companyData} />
                    </div>
                </div>
            </Drawer> */}

        </div>
    )
}

export default TeamLeadsMatured;