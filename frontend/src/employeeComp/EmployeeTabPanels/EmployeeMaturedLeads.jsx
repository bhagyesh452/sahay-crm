import React, { useState, useEffect, useRef } from 'react';
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
import NewProjectionDialog from "../ExtraComponents/NewProjectionDialog";
import AdminRemarksDialog from '../../admin/ExtraComponent/AdminRemarksDialog';
import { IconButton } from "@mui/material";
import { RiEditCircleFill } from "react-icons/ri";
import FilterableComponentEmployee from '../ExtraComponents/FilterableComponentEmployee';
import { BsFilter } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";

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
    bdenumber,
    filteredData,
    filterMethod,
    completeGeneralData,
    dataToFilter,
    setMaturedData,
    setMaturedDataCount,
    setFilteredData,
    activeFilterField,
    setActiveFilterField,
    activeFilterFields,
    setActiveFilterFields,
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
    const [showNewAddProjection, setShowNewAddProjection] = useState(false);
    const [viewProjection, setViewProjection] = useState(false);
    const [isProjectionEditable, setIsProjectionEditable] = useState(false);
    const [projectionDataToBeFilled, setProjectionDataToBeFilled] = useState({});

    const handleCloseNewProjection = () => {
        setShowNewAddProjection(false);
    };

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

    // ----------------filter component----------------------
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    //const [activeFilterFields, setActiveFilterFields] = useState([]); // New state for active filter fields
    const [error, setError] = useState('');
    const [noOfAvailableData, setnoOfAvailableData] = useState(0);
    //const [activeFilterField, setActiveFilterField] = useState(null);
    const [filterPosition, setFilterPosition] = useState({ top: 10, left: 5 });
    const [isScrollLocked, setIsScrollLocked] = useState(false)
    const fieldRefs = useRef({});
    const filterMenuRef = useRef(null); // Ref for the filter menu container
    //const [filteredData, setFilteredData] = useState([]);

    const handleFilter = (newData) => {
        setFilteredData(newData)
        setMaturedData(newData);
        setMaturedDataCount(newData.length);
    };

    const handleFilterClick = (field) => {
        if (activeFilterField === field) {
            setShowFilterMenu(!showFilterMenu);
            setIsScrollLocked(!showFilterMenu);
        } else {
            setActiveFilterField(field);
            setShowFilterMenu(true);
            setIsScrollLocked(true);

            const rect = fieldRefs.current[field].getBoundingClientRect();
            setFilterPosition({ top: rect.bottom, left: rect.left });
        }
    };
    const isActiveField = (field) => activeFilterFields.includes(field);

    console.log("activeFilterFieldsInterested", activeFilterFields)

    useEffect(() => {
        if (typeof document !== 'undefined') {
            const handleClickOutside = (event) => {
                if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
                    setShowFilterMenu(false);
                    // setIsScrollLocked(false);
                }
            };

            document.addEventListener('mousedown', handleClickOutside);

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, []);


    return (
        <div className="sales-panels-main" onMouseUp={handleMouseUp}>
            {!formOpen && !addFormOpen && (
                <>
                    <div className="table table-responsive e-Leadtable-style m-0" onMouseUp={handleMouseUp}>
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
                                    <th className={(fordesignation === "admin" || fordesignation === "datamanager") ? "AEP-sticky-left-3" : "rm-sticky-left-2 "}>
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
                                            {showFilterMenu && activeFilterField === 'Company Name' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableComponentEmployee
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"Matured"}
                                                        data={maturedLeads}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeGeneralData}
                                                        showingMenu={setShowFilterMenu}
                                                        dataForFilter={dataToFilter}
                                                        refetch={refetch}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center position-relative'>
                                            <div ref={el => fieldRefs.current['Company Number'] = el}>
                                                Company No
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('Company Number') ? (
                                                    <FaFilter onClick={() => handleFilterClick("Company Number")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("Company Number")} />
                                                )}
                                            </div>

                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'Company Number' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableComponentEmployee
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"Matured"}
                                                        data={maturedLeads}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeGeneralData}
                                                        showingMenu={setShowFilterMenu}
                                                        dataForFilter={dataToFilter}
                                                        refetch={refetch}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                    <th>Call History</th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center position-relative'>
                                            <div ref={el => fieldRefs.current['Status'] = el}>
                                                Status
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('Status') ? (
                                                    <FaFilter onClick={() => handleFilterClick("Status")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("Status")} />
                                                )}
                                            </div>

                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'Status' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableComponentEmployee
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"Matured"}
                                                        data={maturedLeads}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeGeneralData}
                                                        showingMenu={setShowFilterMenu}
                                                        dataForFilter={dataToFilter}
                                                        refetch={refetch}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                    <th>Remarks</th>
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
                                            {showFilterMenu && activeFilterField === 'Company Incorporation Date  ' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableComponentEmployee
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"Matured"}
                                                        data={maturedLeads}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeGeneralData}
                                                        showingMenu={setShowFilterMenu}
                                                        dataForFilter={dataToFilter}
                                                        refetch={refetch}
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
                                            {showFilterMenu && activeFilterField === 'City' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableComponentEmployee
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"Matured"}
                                                        data={maturedLeads}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeGeneralData}
                                                        showingMenu={setShowFilterMenu}
                                                        dataForFilter={dataToFilter}
                                                        refetch={refetch}
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
                                            {showFilterMenu && activeFilterField === 'State' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableComponentEmployee
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"Matured"}
                                                        data={maturedLeads}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeGeneralData}
                                                        showingMenu={setShowFilterMenu}
                                                        dataForFilter={dataToFilter}
                                                        refetch={refetch}
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
                                            {showFilterMenu && activeFilterField === 'Company Email' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableComponentEmployee
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"Matured"}
                                                        data={maturedLeads}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeGeneralData}
                                                        showingMenu={setShowFilterMenu}
                                                        dataForFilter={dataToFilter}
                                                        refetch={refetch}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                    <th>
                                    <div className='d-flex align-items-center justify-content-center position-relative'>
                                            <div ref={el => fieldRefs.current['AssignDate'] = el}>
                                                Assign Date
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('AssignDate') ? (
                                                    <FaFilter onClick={() => handleFilterClick("AssignDate")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("AssignDate")} />
                                                )}
                                            </div>

                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'AssignDate' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableComponentEmployee
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"Matured"}
                                                        data={maturedLeads}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeGeneralData}
                                                        showingMenu={setShowFilterMenu}
                                                        dataForFilter={dataToFilter}
                                                        refetch={refetch}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                    <th>
                                    <div className='d-flex align-items-center justify-content-center position-relative'>
                                            <div ref={el => fieldRefs.current['bookingDate'] = el}>
                                                Booking Date
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('bookingDate') ? (
                                                    <FaFilter onClick={() => handleFilterClick("bookingDate")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("bookingDate")} />
                                                )}
                                            </div>

                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'bookingDate' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableComponentEmployee
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"Matured"}
                                                        data={maturedLeads}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeGeneralData}
                                                        showingMenu={setShowFilterMenu}
                                                        dataForFilter={dataToFilter}
                                                        refetch={refetch}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                    <th>
                                    <div className='d-flex align-items-center justify-content-center position-relative'>
                                            <div ref={el => fieldRefs.current['bookingPublishDate'] = el}>
                                                Booking Publish Date
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('bookingPublishDate') ? (
                                                    <FaFilter onClick={() => handleFilterClick("bookingPublishDate")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("bookingPublishDate")} />
                                                )}
                                            </div>

                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'bookingPublishDate' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableComponentEmployee
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"Matured"}
                                                        data={maturedLeads}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeGeneralData}
                                                        showingMenu={setShowFilterMenu}
                                                        dataForFilter={dataToFilter}
                                                        refetch={refetch}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </th>
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
                                                <div key={company._id}>

                                                    <div>
                                                        {fordesignation === "admin" || fordesignation === "datamanager" ? (
                                                            <AdminRemarksDialog
                                                                key={`${company["Company Name"]}-${index}`}
                                                                currentRemarks={company.Remarks}
                                                                companyID={company._id}
                                                                companyStatus={company.Status}
                                                                secretKey={secretKey}
                                                            />

                                                        ) : (<div className='d-flex align-items-center justify-content-between w-100'>
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
                                                        </div>
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
                                                {projectionData && projectionData
                                                    .sort((a, b) => new Date(b.projectionDate) - new Date(a.projectionDate)) // Sort by projectionDate in descending order
                                                    .some((item) => item.companyName === company["Company Name"]) ? (
                                                    <IconButton
                                                        onClick={() => {
                                                            // Find the latest projection for the specified company after sorting
                                                            const matchedItem = projectionData
                                                                .sort((a, b) => new Date(b.projectionDate) - new Date(a.projectionDate))
                                                                .find((item) => item.companyName === company["Company Name"]);

                                                            const paymentDate = new Date(matchedItem.estPaymentDate).setHours(0, 0, 0, 0);
                                                            const currentDate = new Date().setHours(0, 0, 0, 0);

                                                            // Check if payment date is before the current date
                                                            if (paymentDate >= currentDate) {
                                                                setIsProjectionEditable(true);  // Enable edit mode
                                                                setViewProjection(false); // Ensure view mode is off when editing
                                                                setShowNewAddProjection(true);  // Open new projection dialog
                                                                setProjectionDataToBeFilled(matchedItem); // Set matched item in the state
                                                                // console.log("Projection data to be updated :", matchedItem);
                                                            } else {
                                                                setIsProjectionEditable(false); // Disable edit mode
                                                                setViewProjection(true); // Open new projection dialog with disabled fields whose payment date is passed
                                                                setShowNewAddProjection(true);  // Open new projection dialog
                                                                setProjectionDataToBeFilled(matchedItem); // Set matched item in the state
                                                                // console.log("Projection data to be viewed :", matchedItem);
                                                            }
                                                        }}
                                                    >
                                                        <RiEditCircleFill
                                                            color={projectionData.find((item) => item.companyName === company["Company Name"] && new Date(item.estPaymentDate).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0))
                                                                ? "#fbb900"
                                                                : "lightgrey"}
                                                            style={{
                                                                width: "17px",
                                                                height: "17px",
                                                            }}
                                                        />
                                                    </IconButton>
                                                ) : (
                                                    <IconButton
                                                        onClick={() => {
                                                            setIsProjectionEditable(false); // Not opened in editing mode
                                                            setShowNewAddProjection(true);  // Open new projection dialog
                                                            setViewProjection(false); // Open new projection dialog with enabled fields
                                                            setProjectionDataToBeFilled(company); // Send whole company data when no match found
                                                            // console.log("Projection data to be added :", company);
                                                        }}
                                                    >
                                                        <RiEditCircleFill
                                                            color="grey"
                                                            style={{
                                                                width: "17px",
                                                                height: "17px",
                                                            }}
                                                        />
                                                    </IconButton>
                                                )}
                                                {/* <ProjectionDialog
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
                                                /> */}
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

            {showNewAddProjection && (
                <NewProjectionDialog
                    open={showNewAddProjection}
                    closepopup={handleCloseNewProjection}
                    projectionData={projectionDataToBeFilled}
                    isProjectionEditable={isProjectionEditable}
                    viewProjection={viewProjection}
                    fetchNewProjection={fetchProjections}
                />
            )}
        </div >
    );
}

export default EmployeeMaturedLeads;