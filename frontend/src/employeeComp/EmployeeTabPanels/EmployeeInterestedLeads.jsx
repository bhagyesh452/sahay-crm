import React , {useState , useEffect} from 'react';
import { LuHistory } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import { IconChevronLeft, IconEye } from "@tabler/icons-react";
import { IconChevronRight } from "@tabler/icons-react";
import Nodata from '../../components/Nodata';


function EmployeeInterestedLeads({ interestedData, isLoading, refetch, formatDateNew, startIndex, endIndex , totalPages , setCurrentPage , currentPage}) {
   
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
        <div className="RM-my-booking-lists">
            <div className="table table-responsive table-style-3 m-0">
                <table className="table table-vcenter table-nowrap">
                    <thead>
                        <tr className="tr-sticky">
                            <th>Sr. No</th>
                            <th>Compnay Name</th>
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
                    {isLoading ? (
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
                                        <LuHistory onClick={() => {
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
                                        {company.Status}
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
                                            {/* <RemarksDialog
                                            key={`${company["Company Name"]}-${index}`} // Using index or another field to create a unique key
                                        // currentCompanyName={company["Company Name"]}
                                        // remarksHistory={remarksHistory} // pass your remarks history data
                                        // companyId={company._id}
                                        // remarksKey="remarks" // Adjust this based on the type of remarks (general or bdm)
                                        // isEditable={company.bdmAcceptStatus !== "Accept"} // Allow editing if status is not "Accept"
                                        // bdmAcceptStatus={company.bdmAcceptStatus}
                                        // companyStatus={company.Status}
                                        // secretKey={secretKey}
                                        // fetchRemarksHistory={fetchRemarksHistory}
                                        // bdeName={company.ename}
                                        // fetchNewData={fetchNewData}
                                        // mainRemarks={company.Remarks}
                                        /> */}
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
        </div>
    );
}

export default EmployeeInterestedLeads;