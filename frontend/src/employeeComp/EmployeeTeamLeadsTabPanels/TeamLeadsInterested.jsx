import React, { useState, useEffect, useRef } from 'react';
import { LuHistory } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import Nodata from '../../components/Nodata';
import TeamLeadsRemarksDialog from '../ExtraComponents/TeamLeadsRemarksDialog';
import EmployeeStatusChange from '../ExtraComponents/EmployeeStatusChange';
import ProjectionDialog from '../ExtraComponents/ProjectionDialog';
import NewProjectionDialog from '../ExtraComponents/NewProjectionDialog';
import FeedbackDialog from '../ExtraComponents/FeedbackDialog';
import EmployeeInterestedInformationDialog from "../ExtraComponents/EmployeeInterestedInformationDialog";
import FilterableComponentEmployee from '../ExtraComponents/FilterableComponentEmployee';
import { FaEye } from "react-icons/fa";
import { IconButton } from "@mui/material";
import { RiEditCircleFill } from "react-icons/ri";
import { BsFilter } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";

function TeamLeadsInterested({
    secretKey,
    employeeName,
    interestedData,
    setInterestedData,
    setInterestedDataCount,
    dataToFilterInterested,
    completeInterestedData,
    filteredDataInterested,
    setFilteredDataInterested,
    activeFilterFieldInterested,
    setActiveFilterFieldInterested,
    activeFilterFieldsInterested,
    setActiveFilterFieldsInterested,
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

    const [isFilledFromTeamLeads, setIsFilledFromTeamLeads] = useState(false);
    const [showNewAddProjection, setShowNewAddProjection] = useState(false);
    const [viewProjection, setViewProjection] = useState(false);
    const [isProjectionEditable, setIsProjectionEditable] = useState(false);
    const [projectionDataToBeFilled, setProjectionDataToBeFilled] = useState({});

    // Team Leads Interested Filtered States :
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [isScrollLocked, setIsScrollLocked] = useState(false)
    //const [activeFilterFields, setActiveFilterFields] = useState([]); // New state for active filter fields
    const [error, setError] = useState('');
    const [noOfAvailableData, setnoOfAvailableData] = useState(0);
    //const [activeFilterField, setActiveFilterField] = useState(null);
    const [filterPosition, setFilterPosition] = useState({ top: 10, left: 5 });
    const fieldRefs = useRef({});
    const filterMenuRef = useRef(null); // Ref for the filter menu container

    const handleFilter = (newData) => {
        // console.log("newData", newData);
        setFilteredDataInterested(newData);
        setInterestedData(newData);
        setInterestedDataCount(newData.length);
    };

    const handleFilterClick = (field) => {
        if (activeFilterFieldInterested === field) {
            setShowFilterMenu(!showFilterMenu);
            setIsScrollLocked(!showFilterMenu);
        } else {
            setActiveFilterFieldInterested(field);
            setShowFilterMenu(true);
            setIsScrollLocked(true);
            const rect = fieldRefs.current[field].getBoundingClientRect();
            setFilterPosition({ top: rect.bottom, left: rect.left });
        }
    };

    const isActiveField = (field) => activeFilterFieldsInterested.includes(field);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            const handleClickOutside = (event) => {
                if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
                    setShowFilterMenu(false);
                    setIsScrollLocked(false);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, []);

    // console.log("activeFilterFieldsInterested :", activeFilterFieldsInterested);
    // console.log("interestedData :" , interestedData);

    const handleCloseNewProjection = () => {
        setShowNewAddProjection(false);
    };

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
                                <th className={(newDesignation === "admin" || newDesignation === "datamanager") ? "AEP-sticky-left-3" : "rm-sticky-left-2"}>
                                    <div className='d-flex align-items-center justify-content-center position-relative'>
                                        <div ref={el => fieldRefs.current['Company Name'] = el}>
                                            Company Name
                                        </div>

                                        <div className='RM_filter_icon'>
                                            {isActiveField('Company Name') ? (
                                                <FaFilter onClick={() => handleFilterClick("Company Name")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("Company Name")} />
                                            )}
                                        </div>

                                        {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterFieldInterested === 'Company Name' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableComponentEmployee
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFieldsInterested}
                                                    filteredData={filteredDataInterested}
                                                    activeTab={"Interested"}
                                                    data={interestedData}
                                                    filterField={activeFilterFieldInterested}
                                                    onFilter={handleFilter}
                                                    completeData={completeInterestedData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilterInterested}
                                                    refetch={refetchTeamLeads}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    <div className='d-flex align-items-center justify-content-center position-relative'>
                                        <div ref={el => fieldRefs.current['ename'] = el}>
                                            BDE Name
                                        </div>

                                        <div className='RM_filter_icon'>
                                            {isActiveField('ename') ? (
                                                <FaFilter onClick={() => handleFilterClick("ename")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("ename")} />
                                            )}
                                        </div>

                                        {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterFieldInterested === 'ename' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableComponentEmployee
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFieldsInterested}
                                                    filteredData={filteredDataInterested}
                                                    activeTab={"Interested"}
                                                    data={interestedData}
                                                    filterField={activeFilterFieldInterested}
                                                    onFilter={handleFilter}
                                                    completeData={completeInterestedData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilterInterested}
                                                    refetch={refetchTeamLeads}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    <div className='d-flex align-items-center justify-content-center position-relative'>
                                        <div ref={el => fieldRefs.current['Company Number'] = el}>
                                            Company Number
                                        </div>

                                        <div className='RM_filter_icon'>
                                            {isActiveField('Company Number') ? (
                                                <FaFilter onClick={() => handleFilterClick("Company Number")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("Company Number")} />
                                            )}
                                        </div>

                                        {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterFieldInterested === 'Company Number' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableComponentEmployee
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFieldsInterested}
                                                    filteredData={filteredDataInterested}
                                                    activeTab={"Interested"}
                                                    data={interestedData}
                                                    filterField={activeFilterFieldInterested}
                                                    onFilter={handleFilter}
                                                    completeData={completeInterestedData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilterInterested}
                                                    refetch={refetchTeamLeads}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>Call History</th>
                                <th>
                                    <div className='d-flex align-items-center justify-content-center position-relative'>
                                        <div ref={el => fieldRefs.current['bdeOldStatus'] = el}>
                                            BDE Status
                                        </div>

                                        <div className='RM_filter_icon'>
                                            {isActiveField('bdeOldStatus') ? (
                                                <FaFilter onClick={() => handleFilterClick("bdeOldStatus")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("bdeOldStatus")} />
                                            )}
                                        </div>

                                        {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterFieldInterested === 'bdeOldStatus' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableComponentEmployee
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFieldsInterested}
                                                    filteredData={filteredDataInterested}
                                                    activeTab={"Interested"}
                                                    data={interestedData}
                                                    filterField={activeFilterFieldInterested}
                                                    onFilter={handleFilter}
                                                    completeData={completeInterestedData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilterInterested}
                                                    refetch={refetchTeamLeads}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>BDE Remarks</th>
                                <th>
                                    <div className='d-flex align-items-center justify-content-center position-relative'>
                                        <div ref={el => fieldRefs.current['Status'] = el}>
                                            BDM Status
                                        </div>

                                        <div className='RM_filter_icon'>
                                            {isActiveField('Status') ? (
                                                <FaFilter onClick={() => handleFilterClick("Status")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("Status")} />
                                            )}
                                        </div>

                                        {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterFieldInterested === 'Status' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableComponentEmployee
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFieldsInterested}
                                                    filteredData={filteredDataInterested}
                                                    activeTab={"Interested"}
                                                    data={interestedData}
                                                    filterField={activeFilterFieldInterested}
                                                    onFilter={handleFilter}
                                                    completeData={completeInterestedData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilterInterested}
                                                    refetch={refetchTeamLeads}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>BDM Remarks</th>
                                <th>
                                    <div className='d-flex align-items-center justify-content-center position-relative'>
                                        <div ref={el => fieldRefs.current['Company Incorporation Date  '] = el}>
                                            Incorporation Date
                                        </div>

                                        <div className='RM_filter_icon'>
                                            {isActiveField('Company Incorporation Date  ') ? (
                                                <FaFilter onClick={() => handleFilterClick("Company Incorporation Date  ")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("Company Incorporation Date  ")} />
                                            )}
                                        </div>

                                        {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterFieldInterested === 'Company Incorporation Date  ' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableComponentEmployee
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFieldsInterested}
                                                    filteredData={filteredDataInterested}
                                                    activeTab={"Interested"}
                                                    data={interestedData}
                                                    filterField={activeFilterFieldInterested}
                                                    onFilter={handleFilter}
                                                    completeData={completeInterestedData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilterInterested}
                                                    refetch={refetchTeamLeads}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    <div className='d-flex align-items-center justify-content-center position-relative'>
                                        <div ref={el => fieldRefs.current['City'] = el}>
                                            City
                                        </div>

                                        <div className='RM_filter_icon'>
                                            {isActiveField('City') ? (
                                                <FaFilter onClick={() => handleFilterClick("City")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("City")} />
                                            )}
                                        </div>

                                        {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterFieldInterested === 'City' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableComponentEmployee
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFieldsInterested}
                                                    filteredData={filteredDataInterested}
                                                    activeTab={"Interested"}
                                                    data={interestedData}
                                                    filterField={activeFilterFieldInterested}
                                                    onFilter={handleFilter}
                                                    completeData={completeInterestedData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilterInterested}
                                                    refetch={refetchTeamLeads}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    <div className='d-flex align-items-center justify-content-center position-relative'>
                                        <div ref={el => fieldRefs.current['State'] = el}>
                                            State
                                        </div>

                                        <div className='RM_filter_icon'>
                                            {isActiveField('State') ? (
                                                <FaFilter onClick={() => handleFilterClick("State")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("State")} />
                                            )}
                                        </div>

                                        {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterFieldInterested === 'State' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableComponentEmployee
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFieldsInterested}
                                                    filteredData={filteredDataInterested}
                                                    activeTab={"Interested"}
                                                    data={interestedData}
                                                    filterField={activeFilterFieldInterested}
                                                    onFilter={handleFilter}
                                                    completeData={completeInterestedData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilterInterested}
                                                    refetch={refetchTeamLeads}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    <div className='d-flex align-items-center justify-content-center position-relative'>
                                        <div ref={el => fieldRefs.current['Company Email'] = el}>
                                            Company Email
                                        </div>

                                        <div className='RM_filter_icon'>
                                            {isActiveField('Company Email') ? (
                                                <FaFilter onClick={() => handleFilterClick("Company Email")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("Company Email")} />
                                            )}
                                        </div>

                                        {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterFieldInterested === 'Company Email' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableComponentEmployee
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFieldsInterested}
                                                    filteredData={filteredDataInterested}
                                                    activeTab={"Interested"}
                                                    data={interestedData}
                                                    filterField={activeFilterFieldInterested}
                                                    onFilter={handleFilter}
                                                    completeData={completeInterestedData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilterInterested}
                                                    refetch={refetchTeamLeads}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    <div className='d-flex align-items-center justify-content-center position-relative'>
                                        <div ref={el => fieldRefs.current['bdeForwardDate'] = el}>
                                            BDE Forwarded Date
                                        </div>

                                        <div className='RM_filter_icon'>
                                            {isActiveField('bdeForwardDate') ? (
                                                <FaFilter onClick={() => handleFilterClick("bdeForwardDate")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("bdeForwardDate")} />
                                            )}
                                        </div>

                                        {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterFieldInterested === 'bdeForwardDate' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableComponentEmployee
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFieldsInterested}
                                                    filteredData={filteredDataInterested}
                                                    activeTab={"Interested"}
                                                    data={interestedData}
                                                    filterField={activeFilterFieldInterested}
                                                    onFilter={handleFilter}
                                                    completeData={completeInterestedData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilterInterested}
                                                    refetch={refetchTeamLeads}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                {newDesignation && <>
                                    <th>Status Modification Date</th>
                                    <th>Age</th>
                                </>}
                                <th className="rm-sticky-action">Action</th>
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

                                                <div className={
                                                    (company.interestedInformation === null || company.interestedInformation.length === 0)
                                                        ? (company.bdeOldStatus === "Interested"
                                                            ? "intersted-history-btn disabled"
                                                            : company.bdeOldStatus === "FollowUp"
                                                                ? "followup-history-btn disabled"
                                                                : "")
                                                        : (company.bdeOldStatus === "Interested"
                                                            ? "intersted-history-btn"
                                                            : company.bdeOldStatus === "FollowUp"
                                                                ? "followup-history-btn"
                                                                : "")
                                                }>
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
                                        {newDesignation && <>
                                            <td>{formatDate(company.bdmStatusChangeDate)} || {company.bdmStatusChangeTime}</td>
                                            <td>{timePassedSince(company.bdmStatusChangeDate)}</td>
                                        </>}
                                        <td className="rm-sticky-action">
                                            <div className="d-flex align-items-center justify-content-between">
                                                {projectionData && projectionData
                                                    .sort((a, b) => new Date(b.projectionDate) - new Date(a.projectionDate)) // Sort by projectionDate in descending order
                                                    .some((item) => item.companyName === company["Company Name"]) ? (
                                                    <IconButton
                                                        onClick={() => {
                                                            const matchedItem = projectionData
                                                                .sort((a, b) => new Date(b.projectionDate) - new Date(a.projectionDate))
                                                                .find((item) => item.companyName === company["Company Name"]);

                                                            const paymentDate = new Date(matchedItem.estPaymentDate).setHours(0, 0, 0, 0);
                                                            const currentDate = new Date().setHours(0, 0, 0, 0);

                                                            // Check if payment date is before the current date
                                                            if (paymentDate >= currentDate) {
                                                                setIsFilledFromTeamLeads(true); // To set bde name for that companies projection
                                                                setIsProjectionEditable(newDesignation ? false : true);  // Enable edit mode
                                                                setViewProjection(newDesignation ? true : false); // Open new projection dialog with disabled fields when new designation is admin or data manager
                                                                setShowNewAddProjection(true);  // Open new projection dialog
                                                                setProjectionDataToBeFilled(matchedItem); // Set matched item in the state
                                                                // console.log("Projection data to be updated :", matchedItem);
                                                            } else {
                                                                setIsFilledFromTeamLeads(true); // To set bde name for that companies projection
                                                                setIsProjectionEditable(false); // Disable edit mode
                                                                newDesignation && setViewProjection(true); // Open new projection dialog with disabled fields when new designation is admin or data manager
                                                                setShowNewAddProjection(true);  // Open new projection dialog
                                                                setProjectionDataToBeFilled(newDesignation ? matchedItem : company); // Set matched item in the state
                                                                // console.log("Projection data to be viewed :", matchedItem);
                                                            }
                                                        }}
                                                    >
                                                        <RiEditCircleFill
                                                            color={projectionData.find((item) => item.companyName === company["Company Name"] && new Date(item.estPaymentDate).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0))
                                                                ? "#fbb900"
                                                                : newDesignation ? "#fbb900" : "grey"}
                                                            style={{
                                                                width: "17px",
                                                                height: "17px",
                                                            }}
                                                            title={newDesignation ? "View Projection"
                                                                : projectionData.find((item) => item.companyName === company["Company Name"] && new Date(item.estPaymentDate).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0))
                                                                    ? "Update Projection" : "Add Projection"}
                                                        />
                                                    </IconButton>
                                                ) : (
                                                    <IconButton
                                                        onClick={() => {
                                                            setIsFilledFromTeamLeads(true); // To set bde name for that companies projection
                                                            setIsProjectionEditable(false); // Not opened in editing mode
                                                            setShowNewAddProjection(true);  // Open new projection dialog
                                                            setViewProjection(false); // Open new projection dialog with enabled fields
                                                            setProjectionDataToBeFilled(company); // Send whole company data when no match found
                                                            // console.log("Projection data to be added :", company);
                                                        }}
                                                        disabled={newDesignation}
                                                    >
                                                        <RiEditCircleFill
                                                            color={newDesignation ? "lightgrey" : "grey"}
                                                            style={{
                                                                width: "17px",
                                                                height: "17px",
                                                            }}
                                                            title={newDesignation ? "View Projection" : "Add Projection"}

                                                        />
                                                    </IconButton>
                                                )}

                                                {/* <ProjectionDialog
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
                                            /> */}

                                                <FeedbackDialog
                                                    companyId={company._id}
                                                    companyName={company["Company Name"]}
                                                    feedbackRemarks={company.feedbackRemarks}
                                                    feedbackPoints={company.feedbackPoints}
                                                    refetchTeamLeads={refetchTeamLeads}
                                                    newDesignation={newDesignation}
                                                    isEditable={true}
                                                />
                                            </div>
                                        </td>
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

            {showNewAddProjection && (
                <NewProjectionDialog
                    open={showNewAddProjection}
                    closepopup={handleCloseNewProjection}
                    projectionData={projectionDataToBeFilled}
                    isProjectionEditable={isProjectionEditable}
                    viewProjection={viewProjection}
                    fetchNewProjection={fetchProjections}
                    isFilledFromTeamLeads={isFilledFromTeamLeads}
                    employeeName={employeeName}
                />
            )}
        </div>
    );
}

export default TeamLeadsInterested;