import React, { useState, useEffect, useRef } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";
import Swal from "sweetalert2";
import Nodata from "../../components/Nodata";
import TeamLeadsRemarksDialog from "../ExtraComponents/TeamLeadsRemarksDialog";
import EmployeeInterestedInformationDialog from "../ExtraComponents/EmployeeInterestedInformationDialog";
import FilterableComponentEmployee from "../ExtraComponents/FilterableComponentEmployee";
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import { GrStatusGood } from "react-icons/gr";
import { IconButton } from "@mui/material";
import { FaEye } from "react-icons/fa";
import { BsFilter } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";


function TeamLeadsGeneral({
  secretKey,
  generalData,
  setGeneralData,
  setGeneralDataCount,
  dataToFilterGeneral,
  completeGeneralData,
  filteredDataGeneral,
  setFilteredDataGeneral,
  activeFilterFieldGeneral,
  setActiveFilterFieldGeneral,
  activeFilterFieldsGeneral,
  setActiveFilterFieldsGeneral,
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
  handleMouseUp,
  bdenumber,
  calculateAgeFromDate
}) {
  // Team Leads General Filtered States :
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  //const [activeFilterFields, setActiveFilterFields] = useState([]); // New state for active filter fields
  const [error, setError] = useState("");
  const [noOfAvailableData, setnoOfAvailableData] = useState(0);
  //const [activeFilterField, setActiveFilterField] = useState(null);
  const [filterPosition, setFilterPosition] = useState({ top: 10, left: 5 });
  const fieldRefs = useRef({});
  const filterMenuRef = useRef(null); // Ref for the filter menu container

  const handleFilter = (newData) => {
    // console.log("newData", newData);
    setFilteredDataGeneral(newData);
    setGeneralData(newData);
    setGeneralDataCount(newData.length);
  };

  const handleFilterClick = (field) => {
    if (activeFilterFieldGeneral === field) {
      setShowFilterMenu(!showFilterMenu);
      setIsScrollLocked(!showFilterMenu);
    } else {
      setActiveFilterFieldGeneral(field);
      setShowFilterMenu(true);
      setIsScrollLocked(true);
      const rect = fieldRefs.current[field].getBoundingClientRect();
      setFilterPosition({ top: rect.bottom, left: rect.left });
    }
  };

  const isActiveField = (field) => activeFilterFieldsGeneral.includes(field);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const handleClickOutside = (event) => {
        if (
          filterMenuRef.current &&
          !filterMenuRef.current.contains(event.target)
        ) {
          setShowFilterMenu(false);
          setIsScrollLocked(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, []);

  // console.log("activeFilterFieldsGeneral :", activeFilterFieldsGeneral);
  // console.log("generalData :" , generalData);

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

  const handleAcceptClick = async (
    companyId,
    cName,
    cemail,
    cdate,
    cnumber,
    oldStatus,
    newBdmStatus
  ) => {
    console.log("companyiD", companyId, oldStatus, newBdmStatus);
    const DT = new Date();
    try {
      const response = await axios.post(
        `${secretKey}/bdm-data/update-bdm-status/${companyId}`,
        {
          newBdmStatus,
          companyId,
          oldStatus,
          bdmAcceptStatus:
            oldStatus === "Matured" ? "MaturedAccepted" : "Accept",
          bdmStatusChangeDate: new Date(),
          bdmStatusChangeTime: DT.toLocaleTimeString(),
        }
      );

      const filteredProjectionData = projectionData.filter(
        (company) => company.companyName === cName
      );
      if (filteredProjectionData.length !== 0) {
        const response2 = await axios.post(
          `${secretKey}/projection/post-followupupdate-bdmaccepted/${cName}`,
          {
            caseType: "Recieved",
          }
        );
      }

      if (response.status === 200) {
        Swal.fire("Accepted");
        refetchTeamLeads();
      } else {
        console.error("Failed to update status:", response.data.message);
      }
    } catch (error) {
      console.log("Error updating status", error.message);
    }
  };

  return (
    <div className="sales-panels-main no-select">
      <div className="table table-responsive e-Leadtable-style m-0">
        <table
          className="table table-vcenter table-nowrap"
          style={{ width: "1800px" }}
        >
          <thead>
            <tr className="tr-sticky">
              {(newDesignation === "admin" ||
                newDesignation === "datamanager") && (
                  <th className="AEP-sticky-left-1">
                    <label className="table-check">
                      <input
                        type="checkbox"
                        checked={
                          selectedRows &&
                          generalData &&
                          selectedRows.length === generalData.length
                        }
                        onChange={(e) => handleCheckboxChange("all", e)}
                      />
                      <span class="table_checkmark"></span>
                    </label>
                  </th>
                )}
              <th
                className={
                  newDesignation === "admin" || newDesignation === "datamanager"
                    ? "AEP-sticky-left-2"
                    : "rm-sticky-left-1"
                }
              >
                Sr. No
              </th>
              <th
                className={
                  newDesignation === "admin" || newDesignation === "datamanager"
                    ? "AEP-sticky-left-3"
                    : "rm-sticky-left-2"
                }
              >
                <div className="d-flex align-items-center justify-content-center position-relative">
                  <div ref={(el) => (fieldRefs.current["Company Name"] = el)}>
                    Company Name
                  </div>

                  <div className="RM_filter_icon">
                    {isActiveField("Company Name") ? (
                      <FaFilter
                        onClick={() => handleFilterClick("Company Name")}
                      />
                    ) : (
                      <BsFilter
                        onClick={() => handleFilterClick("Company Name")}
                      />
                    )}
                  </div>

                  {/* ---------------------filter component--------------------------- */}
                  {showFilterMenu &&
                    activeFilterFieldGeneral === "Company Name" && (
                      <div
                        ref={filterMenuRef}
                        className="filter-menu"
                        style={{
                          top: `${filterPosition.top}px`,
                          left: `${filterPosition.left}px`,
                        }}
                      >
                        <FilterableComponentEmployee
                          noofItems={setnoOfAvailableData}
                          allFilterFields={setActiveFilterFieldsGeneral}
                          filteredData={filteredDataGeneral}
                          activeTab={"General"}
                          data={generalData}
                          filterField={activeFilterFieldGeneral}
                          onFilter={handleFilter}
                          completeData={completeGeneralData}
                          showingMenu={setShowFilterMenu}
                          dataForFilter={dataToFilterGeneral}
                          refetch={refetchTeamLeads}
                        />
                      </div>
                    )}
                </div>
              </th>
              <th>
                <div className="d-flex align-items-center justify-content-center position-relative">
                  <div ref={(el) => (fieldRefs.current["ename"] = el)}>
                    BDE Name
                  </div>

                  <div className="RM_filter_icon">
                    {isActiveField("ename") ? (
                      <FaFilter onClick={() => handleFilterClick("ename")} />
                    ) : (
                      <BsFilter onClick={() => handleFilterClick("ename")} />
                    )}
                  </div>

                  {/* ---------------------filter component--------------------------- */}
                  {showFilterMenu && activeFilterFieldGeneral === "ename" && (
                    <div
                      ref={filterMenuRef}
                      className="filter-menu"
                      style={{
                        top: `${filterPosition.top}px`,
                        left: `${filterPosition.left}px`,
                      }}
                    >
                      <FilterableComponentEmployee
                        noofItems={setnoOfAvailableData}
                        allFilterFields={setActiveFilterFieldsGeneral}
                        filteredData={filteredDataGeneral}
                        activeTab={"General"}
                        data={generalData}
                        filterField={activeFilterFieldGeneral}
                        onFilter={handleFilter}
                        completeData={completeGeneralData}
                        showingMenu={setShowFilterMenu}
                        dataForFilter={dataToFilterGeneral}
                        refetch={refetchTeamLeads}
                      />
                    </div>
                  )}
                </div>
              </th>
              <th>
                <div className="d-flex align-items-center justify-content-center position-relative">
                  <div ref={(el) => (fieldRefs.current["Status"] = el)}>
                    BDE Status
                  </div>

                  <div className="RM_filter_icon">
                    {isActiveField("Status") ? (
                      <FaFilter onClick={() => handleFilterClick("Status")} />
                    ) : (
                      <BsFilter onClick={() => handleFilterClick("Status")} />
                    )}
                  </div>

                  {/* ---------------------filter component--------------------------- */}
                  {showFilterMenu && activeFilterFieldGeneral === "Status" && (
                    <div
                      ref={filterMenuRef}
                      className="filter-menu"
                      style={{
                        top: `${filterPosition.top}px`,
                        left: `${filterPosition.left}px`,
                      }}
                    >
                      <FilterableComponentEmployee
                        noofItems={setnoOfAvailableData}
                        allFilterFields={setActiveFilterFieldsGeneral}
                        filteredData={filteredDataGeneral}
                        activeTab={"General"}
                        data={generalData}
                        filterField={activeFilterFieldGeneral}
                        onFilter={handleFilter}
                        completeData={completeGeneralData}
                        showingMenu={setShowFilterMenu}
                        dataForFilter={dataToFilterGeneral}
                        refetch={refetchTeamLeads}
                      />
                    </div>
                  )}
                </div>
              </th>
              <th>BDE Remarks</th>
              <th>
                <div className="d-flex align-items-center justify-content-center position-relative">
                  <div
                    ref={(el) =>
                      (fieldRefs.current["Company Incorporation Date  "] = el)
                    }
                  >
                    Incorporation Date
                  </div>

                  <div className="RM_filter_icon">
                    {isActiveField("Company Incorporation Date  ") ? (
                      <FaFilter
                        onClick={() =>
                          handleFilterClick("Company Incorporation Date  ")
                        }
                      />
                    ) : (
                      <BsFilter
                        onClick={() =>
                          handleFilterClick("Company Incorporation Date  ")
                        }
                      />
                    )}
                  </div>

                  {/* ---------------------filter component--------------------------- */}
                  {showFilterMenu &&
                    activeFilterFieldGeneral ===
                    "Company Incorporation Date  " && (
                      <div
                        ref={filterMenuRef}
                        className="filter-menu"
                        style={{
                          top: `${filterPosition.top}px`,
                          left: `${filterPosition.left}px`,
                        }}
                      >
                        <FilterableComponentEmployee
                          noofItems={setnoOfAvailableData}
                          allFilterFields={setActiveFilterFieldsGeneral}
                          filteredData={filteredDataGeneral}
                          activeTab={"General"}
                          data={generalData}
                          filterField={activeFilterFieldGeneral}
                          onFilter={handleFilter}
                          completeData={completeGeneralData}
                          showingMenu={setShowFilterMenu}
                          dataForFilter={dataToFilterGeneral}
                          refetch={refetchTeamLeads}
                        />
                      </div>
                    )}
                </div>
              </th>
              <th>
                <div className="d-flex align-items-center justify-content-center position-relative">
                  <div ref={(el) => (fieldRefs.current["City"] = el)}>City</div>

                  <div className="RM_filter_icon">
                    {isActiveField("City") ? (
                      <FaFilter onClick={() => handleFilterClick("City")} />
                    ) : (
                      <BsFilter onClick={() => handleFilterClick("City")} />
                    )}
                  </div>

                  {/* ---------------------filter component--------------------------- */}
                  {showFilterMenu && activeFilterFieldGeneral === "City" && (
                    <div
                      ref={filterMenuRef}
                      className="filter-menu"
                      style={{
                        top: `${filterPosition.top}px`,
                        left: `${filterPosition.left}px`,
                      }}
                    >
                      <FilterableComponentEmployee
                        noofItems={setnoOfAvailableData}
                        allFilterFields={setActiveFilterFieldsGeneral}
                        filteredData={filteredDataGeneral}
                        activeTab={"General"}
                        data={generalData}
                        filterField={activeFilterFieldGeneral}
                        onFilter={handleFilter}
                        completeData={completeGeneralData}
                        showingMenu={setShowFilterMenu}
                        dataForFilter={dataToFilterGeneral}
                        refetch={refetchTeamLeads}
                      />
                    </div>
                  )}
                </div>
              </th>
              <th>
                <div className="d-flex align-items-center justify-content-center position-relative">
                  <div ref={(el) => (fieldRefs.current["State"] = el)}>
                    State
                  </div>

                  <div className="RM_filter_icon">
                    {isActiveField("State") ? (
                      <FaFilter onClick={() => handleFilterClick("State")} />
                    ) : (
                      <BsFilter onClick={() => handleFilterClick("State")} />
                    )}
                  </div>

                  {/* ---------------------filter component--------------------------- */}
                  {showFilterMenu && activeFilterFieldGeneral === "State" && (
                    <div
                      ref={filterMenuRef}
                      className="filter-menu"
                      style={{
                        top: `${filterPosition.top}px`,
                        left: `${filterPosition.left}px`,
                      }}
                    >
                      <FilterableComponentEmployee
                        noofItems={setnoOfAvailableData}
                        allFilterFields={setActiveFilterFieldsGeneral}
                        filteredData={filteredDataGeneral}
                        activeTab={"General"}
                        data={generalData}
                        filterField={activeFilterFieldGeneral}
                        onFilter={handleFilter}
                        completeData={completeGeneralData}
                        showingMenu={setShowFilterMenu}
                        dataForFilter={dataToFilterGeneral}
                        refetch={refetchTeamLeads}
                      />
                    </div>
                  )}
                </div>
              </th>
              <th>
                <div className="d-flex align-items-center justify-content-center position-relative">
                  <div ref={(el) => (fieldRefs.current["bdeForwardDate"] = el)}>
                    BDE Forwarded Date
                  </div>

                  <div className="RM_filter_icon">
                    {isActiveField("bdeForwardDate") ? (
                      <FaFilter
                        onClick={() => handleFilterClick("bdeForwardDate")}
                      />
                    ) : (
                      <BsFilter
                        onClick={() => handleFilterClick("bdeForwardDate")}
                      />
                    )}
                  </div>

                  {/* ---------------------filter component--------------------------- */}
                  {showFilterMenu &&
                    activeFilterFieldGeneral === "bdeForwardDate" && (
                      <div
                        ref={filterMenuRef}
                        className="filter-menu"
                        style={{
                          top: `${filterPosition.top}px`,
                          left: `${filterPosition.left}px`,
                        }}
                      >
                        <FilterableComponentEmployee
                          noofItems={setnoOfAvailableData}
                          allFilterFields={setActiveFilterFieldsGeneral}
                          filteredData={filteredDataGeneral}
                          activeTab={"General"}
                          data={generalData}
                          filterField={activeFilterFieldGeneral}
                          onFilter={handleFilter}
                          completeData={completeGeneralData}
                          showingMenu={setShowFilterMenu}
                          dataForFilter={dataToFilterGeneral}
                          refetch={refetchTeamLeads}
                        />
                      </div>
                    )}
                </div>
              </th>
              {!newDesignation && <th className="rm-sticky-action">Action</th>}
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
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
              </tr>
            )}
            {generalData?.length !== 0 ? (
              generalData?.map((company, index) => (
                <tr
                  key={company._id}
                  onMouseDown={() => handleMouseDown(company._id)} // Start drag selection
                  onMouseOver={() => handleMouseEnter(company._id)} // Continue drag selection
                  onMouseUp={handleMouseUp} // End drag selection
                  id={
                    selectedRows && selectedRows.includes(company._id)
                      ? "selected_admin"
                      : ""
                  } // Highlight selected rows
                >
                  {(newDesignation === "admin" ||
                    newDesignation === "datamanager") && (
                      <td className="AEP-sticky-left-1">
                        <label className="table-check">
                          <input
                            type="checkbox"
                            checked={
                              selectedRows && selectedRows.includes(company._id)
                            }
                            onChange={(e) => handleCheckboxChange(company._id, e)}
                          />
                          <span class="table_checkmark"></span>
                        </label>
                      </td>
                    )}
                  <td
                    className={
                      newDesignation === "admin" ||
                        newDesignation === "datamanager"
                        ? "AEP-sticky-left-2"
                        : "rm-sticky-left-1 "
                    }
                  >
                    {startIndex + index + 1}
                  </td>
                  <td
                    className={
                      newDesignation === "admin" ||
                        newDesignation === "datamanager"
                        ? "AEP-sticky-left-3"
                        : "rm-sticky-left-2 "
                    }
                  >
                    {company["Company Name"]}
                  </td>
                  <td>{company.ename}</td>
                  <td>
                    <div className="d-flex justify-content-center">
                      <div
                        className={`${company.Status === "Not Picked Up"
                          ? "ep_notpickedup_status"
                          : company.Status === "Not Interested"
                            ? "dfault_notinterested-status"
                            : company.Status === "Busy"
                              ? "ep_busy_status"
                              : company.Status === "Untouched"
                                ? "ep_untouched_status"
                                : company.Status === "Interested"
                                  ? "dfault_interested-status"
                                  : company.Status === "FollowUp"
                                    ? "dfault_followup-status"
                                    : company.Status === "Matured"
                                      ? "dfault_approved-status"
                                      : "dfault_followup-status"
                          }`}
                      >
                        {company.Status}
                      </div>

                      {/* <div className="intersted-history-btn disabled"> */}
                      <div
                        className={
                          company.interestedInformation === null ||
                            company.interestedInformation.length === 0
                            ? company.Status === "Interested"
                              ? "intersted-history-btn disabled"
                              : company.Status === "FollowUp"
                                ? "followup-history-btn disabled"
                                : company.Status === "Matured"
                                  ? "matured-history-btn disabled"
                                  : company.Status === "Busy"
                                    ? "busy-history-btn disabled"
                                    : company.Status === "Not Picked Up"
                                      ? "notpickedup-history-btn disabled"
                                      : company.Status === "Not Interested"
                                        ? "notinterested-history-btn disabled"
                                        : company.Status === "Untouched"
                                          ? "untouched-history-btn disabled"
                                          : ""
                            : company.Status === "Interested"
                              ? "intersted-history-btn"
                              : company.Status === "FollowUp"
                                ? "followup-history-btn"
                                : company.Status === "Matured"
                                  ? "matured-history-btn"
                                  : company.Status === "Busy"
                                    ? "busy-history-btn"
                                    : company.Status === "Not Interested"
                                      ? "notinterested-history-btn"
                                      : company.Status === "Not Picked Up"
                                        ? "notpickedup-history-btn"
                                        : company.Status === "Untouched"
                                          ? "untouched-history-btn"
                                          : ""
                        }
                      >
                        <FaEye
                          key={company._id}
                          style={{ border: "transparent", background: "none" }}
                          data-bs-toggle="modal"
                          data-bs-target={`#${`modal-${company[
                            "Company Name"
                          ].replace(/\s+/g, "")}`}-info`}
                          title="Interested Information"
                          disabled={!company.interestedInformation}
                        />

                        <EmployeeInterestedInformationDialog
                          key={company._id}
                          modalId={`modal-${company["Company Name"].replace(
                            /\s+/g,
                            ""
                          )}-info`}
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
                    <div
                      key={company._id}
                      className="d-flex align-items-center justify-content-between w-100"
                    >
                      <p
                        className="rematkText text-wrap mb-0 mr-1"
                        title={company.Remarks}
                      >
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
                    <Tooltip
                      title={`Age: ${calculateAgeFromDate(company["Company Incorporation Date  "])}`}
                      arrow
                    >
                      <span>
                        {formatDateNew(company["Company Incorporation Date  "])}
                      </span>
                    </Tooltip>
                  </td>
                  <td>{company["City"]}</td>
                  <td>{company["State"]}</td>
                  <td>{formatDateNew(company.bdeForwardDate)}</td>
                  {!newDesignation && (
                    <td className="rm-sticky-action">
                      <IconButton
                        style={{
                          color: "green",
                          marginRight: "5px",
                          height: "25px",
                          width: "25px",
                        }}
                        onClick={(e) =>
                          handleAcceptClick(
                            company._id,
                            company["Company Name"],
                            company["Company Email"],
                            company["Company Incorporation Date  "],
                            company["Company Number"],
                            company["Status"],
                            company.bdmStatus
                          )
                        }
                      >
                        <GrStatusGood />
                      </IconButton>
                    </td>
                  )}
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
    </div>
  );
}

export default TeamLeadsGeneral;
