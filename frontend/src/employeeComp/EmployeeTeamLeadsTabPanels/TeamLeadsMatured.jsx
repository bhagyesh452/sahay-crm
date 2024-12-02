import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";
import Nodata from '../../components/Nodata';
import TeamLeadsRemarksDialog from '../ExtraComponents/TeamLeadsRemarksDialog';
import EmployeeInterestedInformationDialog from "../ExtraComponents/EmployeeInterestedInformationDialog";
import FilterableComponentEmployee from '../ExtraComponents/FilterableComponentEmployee';
import { IconButton } from "@mui/material";
import { IconEye } from "@tabler/icons-react";
import { LuHistory } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import { FaEye } from "react-icons/fa";
import { BsFilter } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";


function TeamLeadsMatured({
    secretKey,
    maturedData,
    setMaturedData,
    setMaturedDataCount,
    dataToFilterMatured,
    completeMaturedData,
    filteredDataMatured,
    setFilteredDataMatured,
    activeFilterFieldMatured,
    setActiveFilterFieldMatured,
    activeFilterFieldsMatured,
    setActiveFilterFieldsMatured,
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

    const navigate = useNavigate();
    const { userId } = useParams();

    // Team Leads Matured Filtered States :
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
        setFilteredDataMatured(newData);
        setMaturedData(newData);
        setMaturedDataCount(newData.length);
    };

    const handleFilterClick = (field) => {
        if (activeFilterFieldMatured === field) {
            setShowFilterMenu(!showFilterMenu);
            setIsScrollLocked(!showFilterMenu);
        } else {
            setActiveFilterFieldMatured(field);
            setShowFilterMenu(true);
            setIsScrollLocked(true);
            const rect = fieldRefs.current[field].getBoundingClientRect();
            setFilterPosition({ top: rect.bottom, left: rect.left });
        }
    };

    const isActiveField = (field) => activeFilterFieldsMatured.includes(field);

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

    // console.log("activeFilterFieldsMatured :", activeFilterFieldsMatured);
    // console.log("maturedData :" , maturedData);

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

     // ----------------call history data-----------------------------
     const [callHistoryMap, setCallHistoryMap] = useState()

     // Date Setup for API
     const today = new Date();
     const todayStartDate = new Date(today);
     const todayEndDate = new Date(today);
 
     // Set end timestamp to current date at 13:00 (1 PM) UTC
     todayEndDate.setUTCHours(13, 0, 0, 0);
 
     // Set start timestamp to 6 months before the current date at 04:00 (4 AM) UTC
     todayStartDate.setMonth(todayStartDate.getMonth() - 5);
     todayStartDate.setUTCHours(4, 0, 0, 0);
 
     // Convert to Unix timestamps (seconds since epoch)
     const startTimestamp = Math.floor(todayStartDate.getTime() / 1000);
     const endTimestamp = Math.floor(todayEndDate.getTime() / 1000);
 
     useEffect(() => {
         const fetchEmployeeData = async () => {
             const apiKey = process.env.REACT_APP_API_KEY; // Ensure this is set in your .env file
             const url = 'https://api1.callyzer.co/v2/call-log/history';
             const companyNumbers = maturedData?.map(
                 (company) => String(company["Company Number"])
             );
 
             if (companyNumbers.length > 0) {
                 const body = {
                     "call_from": startTimestamp,
                     "call_to": endTimestamp,
                     "call_types": ["Missed", "Rejected", "Incoming", "Outgoing"],
                     "client_numbers": companyNumbers
                 };
                 try {
 
                     // POST request to the call-log API
                     const response = await fetch(url, {
                         method: 'POST',
                         headers: {
                             'Authorization': `Bearer ${apiKey}`,
                             'Content-Type': 'application/json'
                         },
                         body: JSON.stringify(body)
                     });
 
                     // Check for errors in the POST request
                     if (!response.ok) {
                         const errorData = await response.json();
                         throw new Error(`Error: ${response.status} - ${errorData.message || response.statusText}`);
                     }
 
                     // Process the POST response
                     const data = await response.json();
                     console.log("data.result is :", data.result);
                     const callHistoryMap = {};
                     data?.result.forEach((call) => {
                         const number = call.client_number;
                         console.log("Processing call for client_number:", number);
                         console.log("Call object:", call);
 
                         const matchedCompany = maturedData.find((company) => {
                             const companyNumber = String(company["Company Number"] || "").trim().toLowerCase();
                             const clientNumber = String(number || "").trim().toLowerCase();
                             const empNumber = call.emp_number ? String(call.emp_number).trim().toLowerCase() : "";
                             const empName = call.emp_name ? String(call.emp_name).trim().toLowerCase() : "";
                             const bdeNumberProp = String(bdenumber || "").trim().toLowerCase(); // Use prop value
 
                             return (
                                 companyNumber === clientNumber &&
                                 ((bdeNumberProp && bdeNumberProp === empNumber) ||
                                     (company.bdmName && company.bdmName.trim().toLowerCase() === empName))
                             );
                         });
 
                         console.log("Matched company:", matchedCompany);
 
                         if (matchedCompany) {
                             if (!callHistoryMap[number]) {
                                 callHistoryMap[number] = [];
                             }
                             callHistoryMap[number].push(call);
                         }
                     });
                     console.log("callHistoryMap", callHistoryMap)
 
                     const updatedGeneralLeads = maturedData.map((company) => {
                         const companyNumber = String(company["Company Number"]);
                         return {
                             ...company,
                             callHistoryData: callHistoryMap[companyNumber] || [],
                         };
                     });
 
                     setMaturedData(updatedGeneralLeads); // Update with enriched data
                 } catch (err) {
                     console.log(err);
                 } finally {
                     // setIsLoading(false);
                 }
 
             }
 
 
         };
         fetchEmployeeData();
     }, [maturedData]);

    return (
        <div className="sales-panels-main no-select">
            <div className="table table-responsive e-Leadtable-style m-0">
                <table className="table table-vcenter table-nowrap" style={{ width: "1800px" }}>
                    <thead>
                        <tr className="tr-sticky">
                            {(newDesignation === "admin" || newDesignation === "datamanager") &&
                                (
                                    <th className='AEP-sticky-left-1'>
                                        <label className='table-check'>
                                            <input type="checkbox"
                                                checked={selectedRows && maturedData && (selectedRows.length === maturedData.length)}
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
                                    {showFilterMenu && activeFilterFieldMatured === 'Company Name' && (
                                        <div
                                            ref={filterMenuRef}
                                            className="filter-menu"
                                            style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                        >
                                            <FilterableComponentEmployee
                                                noofItems={setnoOfAvailableData}
                                                allFilterFields={setActiveFilterFieldsMatured}
                                                filteredData={filteredDataMatured}
                                                activeTab={"Matured"}
                                                data={maturedData}
                                                filterField={activeFilterFieldMatured}
                                                onFilter={handleFilter}
                                                completeData={completeMaturedData}
                                                showingMenu={setShowFilterMenu}
                                                dataForFilter={dataToFilterMatured}
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
                                    {showFilterMenu && activeFilterFieldMatured === 'ename' && (
                                        <div
                                            ref={filterMenuRef}
                                            className="filter-menu"
                                            style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                        >
                                            <FilterableComponentEmployee
                                                noofItems={setnoOfAvailableData}
                                                allFilterFields={setActiveFilterFieldsMatured}
                                                filteredData={filteredDataMatured}
                                                activeTab={"Matured"}
                                                data={maturedData}
                                                filterField={activeFilterFieldMatured}
                                                onFilter={handleFilter}
                                                completeData={completeMaturedData}
                                                showingMenu={setShowFilterMenu}
                                                dataForFilter={dataToFilterMatured}
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
                                    {showFilterMenu && activeFilterFieldMatured === 'Company Number' && (
                                        <div
                                            ref={filterMenuRef}
                                            className="filter-menu"
                                            style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                        >
                                            <FilterableComponentEmployee
                                                noofItems={setnoOfAvailableData}
                                                allFilterFields={setActiveFilterFieldsMatured}
                                                filteredData={filteredDataMatured}
                                                activeTab={"Matured"}
                                                data={maturedData}
                                                filterField={activeFilterFieldMatured}
                                                onFilter={handleFilter}
                                                completeData={completeMaturedData}
                                                showingMenu={setShowFilterMenu}
                                                dataForFilter={dataToFilterMatured}
                                                refetch={refetchTeamLeads}
                                            />
                                        </div>
                                    )}
                                </div>
                            </th>
                            <th>Call History</th>
                            <th>BDE Status</th>
                            <th>BDE Remarks</th>
                            <th>BDM Status</th>
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
                                    {showFilterMenu && activeFilterFieldMatured === 'Company Incorporation Date  ' && (
                                        <div
                                            ref={filterMenuRef}
                                            className="filter-menu"
                                            style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                        >
                                            <FilterableComponentEmployee
                                                noofItems={setnoOfAvailableData}
                                                allFilterFields={setActiveFilterFieldsMatured}
                                                filteredData={filteredDataMatured}
                                                activeTab={"Matured"}
                                                data={maturedData}
                                                filterField={activeFilterFieldMatured}
                                                onFilter={handleFilter}
                                                completeData={completeMaturedData}
                                                showingMenu={setShowFilterMenu}
                                                dataForFilter={dataToFilterMatured}
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
                                    {showFilterMenu && activeFilterFieldMatured === 'City' && (
                                        <div
                                            ref={filterMenuRef}
                                            className="filter-menu"
                                            style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                        >
                                            <FilterableComponentEmployee
                                                noofItems={setnoOfAvailableData}
                                                allFilterFields={setActiveFilterFieldsMatured}
                                                filteredData={filteredDataMatured}
                                                activeTab={"Matured"}
                                                data={maturedData}
                                                filterField={activeFilterFieldMatured}
                                                onFilter={handleFilter}
                                                completeData={completeMaturedData}
                                                showingMenu={setShowFilterMenu}
                                                dataForFilter={dataToFilterMatured}
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
                                    {showFilterMenu && activeFilterFieldMatured === 'State' && (
                                        <div
                                            ref={filterMenuRef}
                                            className="filter-menu"
                                            style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                        >
                                            <FilterableComponentEmployee
                                                noofItems={setnoOfAvailableData}
                                                allFilterFields={setActiveFilterFieldsMatured}
                                                filteredData={filteredDataMatured}
                                                activeTab={"Matured"}
                                                data={maturedData}
                                                filterField={activeFilterFieldMatured}
                                                onFilter={handleFilter}
                                                completeData={completeMaturedData}
                                                showingMenu={setShowFilterMenu}
                                                dataForFilter={dataToFilterMatured}
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
                                    {showFilterMenu && activeFilterFieldMatured === 'Company Email' && (
                                        <div
                                            ref={filterMenuRef}
                                            className="filter-menu"
                                            style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                        >
                                            <FilterableComponentEmployee
                                                noofItems={setnoOfAvailableData}
                                                allFilterFields={setActiveFilterFieldsMatured}
                                                filteredData={filteredDataMatured}
                                                activeTab={"Matured"}
                                                data={maturedData}
                                                filterField={activeFilterFieldMatured}
                                                onFilter={handleFilter}
                                                completeData={completeMaturedData}
                                                showingMenu={setShowFilterMenu}
                                                dataForFilter={dataToFilterMatured}
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
                                    {showFilterMenu && activeFilterFieldMatured === 'bdeForwardDate' && (
                                        <div
                                            ref={filterMenuRef}
                                            className="filter-menu"
                                            style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                        >
                                            <FilterableComponentEmployee
                                                noofItems={setnoOfAvailableData}
                                                allFilterFields={setActiveFilterFieldsMatured}
                                                filteredData={filteredDataMatured}
                                                activeTab={"Matured"}
                                                data={maturedData}
                                                filterField={activeFilterFieldMatured}
                                                onFilter={handleFilter}
                                                completeData={completeMaturedData}
                                                showingMenu={setShowFilterMenu}
                                                dataForFilter={dataToFilterMatured}
                                                refetch={refetchTeamLeads}
                                            />
                                        </div>
                                    )}
                                </div>
                            </th>
                            <th className="rm-sticky-action">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {isLoading && <tr>
                            <td colSpan="16">
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
                                                        onClick={() => {
                                                            if (company.callHistoryData?.length > 0) {
                                                                handleShowCallHistory(
                                                                    company["Company Name"],
                                                                    company["Company Number"],
                                                                    bdenumber,
                                                                    company.bdmName,
                                                                    company.bdmAcceptStatus,
                                                                    company.bdeForwardDate,
                                                                    company.callHistoryData // Pass call history data
                                                                );
                                                            }
                                                        }}
                                                        style={{
                                                            cursor: company.callHistoryData?.length > 0 ? "pointer" : "not-allowed",
                                                            width: "15px",
                                                            height: "15px",
                                                            opacity: company.callHistoryData?.length > 0 ? 1 : 0.5, // Visual feedback for disabled state
                                                        }}
                                                        color={company.callHistoryData?.length > 0 ? "grey" : "lightgrey"} // Change color based on availability
                                                    />
                                                </td>
                                    <td>
                                        <div className="d-flex justify-content-center">
                                            <div className='dfault_approved-status'>
                                                {company.Status}
                                            </div>

                                            <div className={company.interestedInformation.length !== 0 ? "matured-history-btn" : "matured-history-btn disabled"}>
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
                                                newDesignation={newDesignation}
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
                                    <td>{company["Company Email"]}</td>
                                    <td>{formatDateNew(company.bdeForwardDate)}</td>
                                    <td className="rm-sticky-action">
                                        <IconButton style={{ marginRight: "5px" }}
                                            onClick={() => {
                                                // setCompanyId(company._id);
                                                // setTimeout(() => {
                                                //     setFormOpen(true);
                                                // }, 1000);
                                                navigate(newDesignation === "admin" ? `/md/bookings` : `/employee-bookings/${userId}`);
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
                                <td colSpan={16} className="text-center">
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
    );
}

export default TeamLeadsMatured;