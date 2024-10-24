import React, { useState, useEffect } from "react";
import { LuHistory } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import Nodata from "../../components/Nodata";
import RemarksDialog from "../ExtraComponents/RemarksDialog";
import EmployeeStatusChange from "../ExtraComponents/EmployeeStatusChange";
import RedesignedForm from "../../admin/RedesignedForm";
import AddLeadForm from "../../admin/AddLeadForm";
import EmployeeNextFollowDate from "../ExtraComponents/EmployeeNextFollowUpDate";
import CallHistory from "../CallHistory";
import ProjectionDialog from "../ExtraComponents/ProjectionDialog";
import BdmMaturedCasesDialogBox from "../BdmMaturedCasesDialogBox";
import { MdOutlineWorkHistory } from "react-icons/md";
import EmployeeInterestedInformationDialog from "../ExtraComponents/EmployeeInterestedInformationDialog";
import { FaEye } from "react-icons/fa";


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
  fetchProjections,
  projectionData,
  handleOpenFormOpen,
  designation,
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
  // const [formOpen, setFormOpen] = useState(false);
  // //const [editFormOpen, setEditFormOpen] = useState(false);
  // const [addFormOpen, setAddFormOpen] = useState(false);
  const [deletedEmployeeStatus, setDeletedEmployeeStatus] = useState(false);
  const [newBdeName, setNewBdeName] = useState("");
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

  const modalId = `modal-${companyName.replace(/\s+/g, '')}`; // Generate a unique modal ID


  return (
    <div className="sales-panels-main" onMouseUp={handleMouseUp}>
      <>
        <div className="table table-responsive table-style-3 m-0">
          <table
            className="table table-vcenter table-nowrap"
            style={{ width: "2200px" }}
          >
            <thead>
              <tr className="tr-sticky">
                {(fordesignation === "admin" || fordesignation === "datamanager") && (
                  <th className="AEP-sticky-left-1">
                    <label className="table-check">
                      <input
                        type="checkbox"
                        checked={
                          selectedRows && interestedData && (selectedRows.length === interestedData.length)
                        }
                        onChange={(e) => handleCheckboxChange("all", e)}
                      />
                      <span class="table_checkmark"></span>
                    </label>
                  </th>
                )}
                <th
                  className={
                    (fordesignation === "admin" || fordesignation === "datamanager")
                      ? "AEP-sticky-left-2"
                      : "rm-sticky-left-1 "
                  }
                >
                  Sr. No
                </th>
                <th
                  className={
                    (fordesignation === "admin" || fordesignation === "datamanager")
                      ? "AEP-sticky-left-3"
                      : "rm-sticky-left-2 "
                  }
                >
                  Company Name
                </th>
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
                <th>Action</th>
                {/* <th>Add Projection</th>
                                {designation !== "Sales Manager" || fordesignation !== "admin" && (<th>Forward To Bdm</th>)} */}
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
                {interestedData && interestedData.map((company, index) => (
                  <tr
                    key={company._id}
                    style={{ border: "1px solid #ddd" }}
                    onMouseDown={() => handleMouseDown(company._id)} // Start drag selection
                    onMouseOver={() => handleMouseEnter(company._id)} // Continue drag selection
                    onMouseUp={handleMouseUp} // End drag selection
                    id={
                      selectedRows && selectedRows.includes(company._id) ? "selected_admin" : ""
                    } // Highlight selected rows
                  >
                    {(fordesignation === "admin" || fordesignation === "datamanager") && (
                      <td
                        className="AEP-sticky-left-1"
                        style={{
                          position: "sticky",
                          left: 0,
                          zIndex: 1,
                          background: "white",
                        }}
                      >
                        <label className="table-check">
                          <input
                            type="checkbox"
                            checked={selectedRows && selectedRows.includes(company._id)}
                            onChange={(e) => handleCheckboxChange(company._id, e)}
                            onMouseUp={handleMouseUp}
                          />
                          <span class="table_checkmark"></span>
                        </label>
                      </td>
                    )}
                    <td
                      className={
                        (fordesignation === "admin" || fordesignation === "datamanager")
                          ? "AEP-sticky-left-2"
                          : "rm-sticky-left-1 "
                      }
                    >
                      {startIndex + index + 1}
                    </td>
                    <td
                      className={
                        (fordesignation === "admin" || fordesignation === "datamanager")
                          ? "AEP-sticky-left-3"
                          : "rm-sticky-left-2 "
                      }
                    >
                      {company["Company Name"]}
                    </td>
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
                    <td>

                      <div className="d-flex align-items-center">
                        {(fordesignation === "admin" || fordesignation === "datamanager") ? (
                          <div
                            className={company.Status === "Interested" ? "dfault_interested-status" :
                              company.Status === "FollowUp" ? "dfault_followup-status" :
                                null}>
                            {company.Status}
                          </div>) : (
                          <EmployeeStatusChange
                            key={company._id}
                            companyName={company && company["Company Name"]}
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
                            isDeletedEmployeeCompany={
                              company.isDeletedEmployeeCompany
                            }
                            cemail={company["Company Email"]}
                            cindate={company["Incorporation Date"]}
                            cnum={company["Company Number"]}
                            ename={company.ename}
                            bdmAcceptStatus={company.bdmAcceptStatus}
                            handleFormOpen={handleOpenFormOpen}
                          />
                        )}
                        <div className={company.Status === "Interested" && company.interestedInformation ? 
                          "intersted-history-btn"
                          : company.Status === "FollowUp" && company.interestedInformation ? "followup-history-btn"  : 
                          company.Status === "FollowUp" && !company.interestedInformation ? "followup-history-btn disabled" :
                          "intersted-history-btn disabled"}>
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
                            refetch={refetch}
                            ename={company.ename}
                            secretKey={secretKey}
                            status={company.Status}
                            companyStatus={company.Status}
                            forView={true}
                            fordesignation={fordesignation}

                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div
                        key={company._id}
                        className="d-flex align-items-center justify-content-between w-100"
                      >
                        <p
                          className="rematkText text-wrap m-0"
                          title={company.Remarks}
                        >
                          {!company["Remarks"] ? "No Remarks" : company.Remarks}
                        </p>
                        <RemarksDialog
                          key={company._id}
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
                          bdmName={company.bdmName}
                          refetch={refetch}
                          mainRemarks={company.Remarks}
                          designation={designation}
                          fordesignation={fordesignation}
                        />
                      </div>
                    </td>
                    <td>
                      <EmployeeNextFollowDate
                        key={company._id}
                        id={company._id}
                        nextFollowDate={company.bdeNextFollowUpDate}
                        refetch={refetch}
                        status={company.Status}
                      />
                    </td>
                    <td>
                      {formatDateNew(company["Company Incorporation Date  "])}
                    </td>
                    <td>{company["City"]}</td>
                    <td>{company["State"]}</td>
                    <td>{company["Company Email"]}</td>
                    <td>{formatDateNew(company["AssignDate"])}</td>
                    <td>
                      <div className="d-flex align-items-center justify-content-between">
                        <ProjectionDialog
                          key={company._id}
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
                          userId={userId}
                        />
                        {
                          ((fordesignation !== "admin" && fordesignation !== "datamanager") && designation !== "Sales Manager") && (
                            <BdmMaturedCasesDialogBox
                              key={company._id}
                              currentData={interestedData}
                              forwardedCompany={company["Company Name"]}
                              forwardCompanyId={company._id}
                              forwardedStatus={company.Status}
                              forwardedEName={company.ename}
                              bdeOldStatus={company.Status}
                              bdmNewAcceptStatus={"Pending"}
                              fetchNewData={refetch}
                            />
                          )}

                      </div>
                    </td>
                  </tr>
                ))}

              </tbody>
            )}
            {interestedData && interestedData.length === 0 && !isLoading && (
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
        {interestedData && interestedData.length !== 0 && (
          <div className="pagination d-flex align-items-center justify-content-center w-100">
            <div>
              <button
                className="btn-pagination"
                onClick={prevPage}
                disabled={currentPage === 0}
              >
                <GoArrowLeft />
              </button>
            </div>
            <div className="ml-3 mr-3">
              Page {currentPage + 1} of {totalPages}
            </div>
            <div>
              <button
                className="btn-pagination"
                onClick={nextPage}
                disabled={currentPage >= totalPages - 1}
              >
                <GoArrowRight />
              </button>
            </div>
          </div>
        )}
      </>

    </div>
  );
}

export default EmployeeInterestedLeads;
