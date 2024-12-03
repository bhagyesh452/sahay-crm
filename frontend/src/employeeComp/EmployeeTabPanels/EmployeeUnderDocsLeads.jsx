import React, { useState, useEffect, useRef } from 'react';
import { LuHistory } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from 'react-router-dom';
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import Nodata from '../../components/Nodata';
import EmployeeStatusChange from '../ExtraComponents/EmployeeStatusChange';
import RedesignedForm from '../../admin/RedesignedForm';
import AddLeadForm from '../../admin/AddLeadForm';
import RemarksDialog from '../ExtraComponents/RemarksDialog';
import FilterableComponentEmployee from '../ExtraComponents/FilterableComponentEmployee';
import { BsFilter } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import EmployeeInterestedInformationDialog from '../ExtraComponents/EmployeeInterestedInformationDialog';
import { FaEye } from "react-icons/fa";
import EmployeeNextFollowDate from '../ExtraComponents/EmployeeNextFollowUpDate';
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";


function EmployeeUnderDocsLeads({
    userId,
    underDocsData,
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
    designation,
    fordesignation,
    setSelectedRows,
    handleCheckboxChange,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    selectedRows,
    bdenumber,
    filteredData,
    //handleFilter,
    completeUnderDocsData,
    // dataToFilter,
    setUnderDocsData,
    setFilteredData,
    activeFilterField,
    setActiveFilterField,
    activeFilterFields,
    setActiveFilterFields,
    setUnderDocsDataCount,
    isCallHistoryEmpty,
    cleanString,
    calculateAgeFromDate

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
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [isScrollLocked, setIsScrollLocked] = useState(false)
    //const [activeFilterFields, setActiveFilterFields] = useState([]); // New state for active filter fields
    const [error, setError] = useState('');
    const [noOfAvailableData, setnoOfAvailableData] = useState(0);
    //const [activeFilterField, setActiveFilterField] = useState(null);
    const [filterPosition, setFilterPosition] = useState({ top: 10, left: 5 });
    const fieldRefs = useRef({});
    const filterMenuRef = useRef(null); // Ref for the filter menu container
    const [openBacdrop, setOpenBacdrop] = useState(false);
    const [dataToFilter, setDataToFilter] = useState([]);

    //const [filteredData, setFilteredData] = useState([]);
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

    //-------------------filter method-------------------------------

    const handleFilter = (newData) => {
        setFilteredData(newData)
        setUnderDocsData(newData);
        setUnderDocsDataCount(newData.length);
    };


    const handleFilterClick = async(field) => {
        if (filteredData.length === 0) {
            try {
                const response = await axios.get(
                    `${secretKey}/company-data/employees-underdocs/${cleanString(ename)}`, // Backend API endpoint
                    {
                        params: {
                            limit: 500, // Adjust the limit as required
                            // search: searchQuery, // Pass the search query if applicable
                        },
                    }
                );

                const { underdocsData } = response.data;
                console.log("interestedData", underdocsData)
                // setDataToFilter(underdocsData);
                setDataToFilter(underdocsData); // Update data based on the response
            } catch (error) {
                console.error("Error fetching Interested data:", error);
                // Handle error appropriately
            }

        }
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
        const fetchAndSaveCallHistory = async () => {
          console.log("Fetching and processing call history...");
    
          try {
            const apiKey = process.env.REACT_APP_API_KEY; // Ensure this is set in your .env file
            const url = "https://api1.callyzer.co/v2/call-log/history";
    
            // Extract company numbers from generalData
            const companyNumbers = underDocsData?.map((company) => String(company["Company Number"]));
    
            if (!companyNumbers || companyNumbers.length === 0) {
              console.warn("No company numbers available for fetching call history.");
              return;
            }
    
            const body = {
              call_from: startTimestamp,
              call_to: endTimestamp,
              call_types: ["Missed", "Rejected", "Incoming", "Outgoing"],
              client_numbers: companyNumbers,
            };
    
            // Fetch call history from the API
            const response = await fetch(url, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            });
    
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(`Error: ${response.status} - ${errorData.message || response.statusText}`);
            }
    
            const callHistoryData = await response.json();
            console.log("Fetched call history data:", callHistoryData.result);
    
            // Match call history with companies
            const callHistoryMap = {};
            callHistoryData?.result.forEach((call) => {
              const number = call.client_number;
    
              console.log("Processing call for client_number:", number);
    
              const matchedCompany = underDocsData?.find((company) => {
                const companyNumber = String(company["Company Number"] || "").trim().toLowerCase();
                const clientNumber = String(number || "").trim().toLowerCase();
                return companyNumber === clientNumber;
              });
    
              if (matchedCompany) {
                if (!callHistoryMap[number]) {
                  callHistoryMap[number] = [];
                }
                callHistoryMap[number].push(call);
              }
            });
    
            console.log("callHistoryMap:", callHistoryMap);
    
            // Save matched call history to database
            await Promise.all(
              underDocsData.map(async (company) => {
                const companyNumber = String(company["Company Number"]);
                const callHistoryForCompany = callHistoryMap[companyNumber] || [];
    
                if (callHistoryForCompany.length > 0) {
                  try {
                    await axios.post(`${secretKey}/remarks/save-client-call-history`, {
                      client_number: companyNumber,
                      callHistoryData: callHistoryForCompany,
                    });
                    console.log(`Call history for company ${companyNumber} saved successfully.`);
                  } catch (err) {
                    console.error(`Error saving call history for ${companyNumber}:`, err.response?.data || err.message);
                  }
                } else {
                  console.log(`No call history to save for company ${companyNumber}.`);
                }
              })
            );
    
            console.log("All call history saved successfully.");
          } catch (err) {
            console.error("Error fetching and saving call history:", err);
          }
        };
    
        fetchAndSaveCallHistory();
      }, [underDocsData]);

    // console.log("activeFilterFieldsUnderDocs", activeFilterFields)
    // console.log("underDocsData" , underDocsData)


    return (
        <div className="sales-panels-main no-select" onMouseUp={handleMouseUp}>
            {openBacdrop && (<Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBacdrop}
                onClick={() => setOpenBacdrop(false)}>
                <CircularProgress color="inherit" />
            </Backdrop>)}
            {!formOpen && !addFormOpen && (
                <>
                    <div className="table table-responsive e-Leadtable-style m-0">
                        <table className="table table-vcenter table-nowrap" style={{ width: "1800px" }}>
                            <thead>
                                <tr className="tr-sticky">
                                    {(fordesignation === "admin" || fordesignation === "datamanager") &&
                                        (
                                            <th className='AEP-sticky-left-1'>
                                                <label className='table-check'>
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            selectedRows && underDocsData && (selectedRows.length === underDocsData.length)
                                                        }
                                                        onChange={(e) => handleCheckboxChange("all", e)}
                                                    />
                                                    <span class="table_checkmark"></span>
                                                </label>
                                            </th>
                                        )}
                                    <th className={(fordesignation === "admin" || fordesignation === "datamanager") ? "AEP-sticky-left-2" : "rm-sticky-left-1"}>Sr. No</th>
                                    <th className={(fordesignation === "admin" || fordesignation === "datamanager") ? "AEP-sticky-left-3" : "rm-sticky-left-2"}>
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
                                                        activeTab={"UnderDocs"}
                                                        data={underDocsData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeUnderDocsData}
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
                                                        activeTab={"UnderDocs"}
                                                        data={underDocsData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeUnderDocsData}
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
                                                        activeTab={"UnderDocs"}
                                                        data={underDocsData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeUnderDocsData}
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
                                            <div ref={el => fieldRefs.current['bdeNextFollowUpDate'] = el}>
                                                Next FollowUp Date
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('bdeNextFollowUpDate') ? (
                                                    <FaFilter onClick={() => handleFilterClick("bdeNextFollowUpDate")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("bdeNextFollowUpDate")} />
                                                )}
                                            </div>

                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'bdeNextFollowUpDate' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableComponentEmployee
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"UnderDocs"}
                                                        data={underDocsData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeUnderDocsData}
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
                                                        activeTab={"UnderDocs"}
                                                        data={underDocsData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeUnderDocsData}
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
                                                        activeTab={"UnderDocs"}
                                                        data={underDocsData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeUnderDocsData}
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
                                                        activeTab={"UnderDocs"}
                                                        data={underDocsData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeUnderDocsData}
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
                                                        activeTab={"UnderDocs"}
                                                        data={underDocsData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeUnderDocsData}
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
                                                        activeTab={"UnderDocs"}
                                                        data={underDocsData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeUnderDocsData}
                                                        showingMenu={setShowFilterMenu}
                                                        dataForFilter={dataToFilter}
                                                        refetch={refetch}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            {
                                isLoading ? (
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
                                        {underDocsData && underDocsData.map((company, index) => (
                                            <tr key={company._id}
                                                onMouseDown={() =>
                                                    handleMouseDown(company._id)
                                                } // Start drag selection
                                                onMouseOver={() => handleMouseEnter(company._id)} // Continue drag selection
                                                onMouseUp={handleMouseUp} // End drag selection
                                                id={selectedRows && selectedRows.includes(company._id) ? 'selected_admin' : ''} // Highlight selected rows
                                            >
                                                {(fordesignation === "admin" || fordesignation === "datamanager") && (
                                                    <td className='AEP-sticky-left-1'>
                                                        <label className='table-check'>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedRows && selectedRows.includes(company._id)}
                                                                onChange={(e) => handleCheckboxChange(company._id, e)}
                                                            />
                                                            <span class="table_checkmark"></span>
                                                        </label>

                                                    </td>
                                                )}
                                                <td className={(fordesignation === "admin" || fordesignation === "datamanager") ? "AEP-sticky-left-2" : "rm-sticky-left-1 "}>{startIndex + index + 1}</td>
                                                <td className={(fordesignation === "admin" || fordesignation === "datamanager") ? "AEP-sticky-left-3" : "rm-sticky-left-2 "}>
                                                    <Link to={`/company-profile/${userId}`} className='text-decoration-none text-dark'>
                                                        {company["Company Name"]}
                                                    </Link>
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
                                                            // Check if call history is available and contains relevant data
                                                            const filteredCallHistory = (company.clientCallHistory || company.callHistoryData || []).filter(
                                                                (call) =>
                                                                    call.emp_number === bdenumber || call.emp_name?.trim().toLowerCase() === company.bdmName?.trim().toLowerCase()
                                                            );

                                                            if (filteredCallHistory.length > 0) {
                                                                handleShowCallHistory(
                                                                    company["Company Name"],
                                                                    company["Company Number"],
                                                                    bdenumber,
                                                                    company.bdmName,
                                                                    company.bdmAcceptStatus,
                                                                    company.bdeForwardDate,
                                                                    filteredCallHistory
                                                                );
                                                            }
                                                        }}
                                                        style={{
                                                            cursor:
                                                                (company.clientCallHistory || company.callHistoryData)?.some(
                                                                    (call) =>
                                                                        call.emp_number === bdenumber || call.emp_name?.trim().toLowerCase() === company.bdmName?.trim().toLowerCase()
                                                                )
                                                                    ? "pointer"
                                                                    : "not-allowed",
                                                            width: "15px",
                                                            height: "15px",
                                                            opacity:
                                                                (company.clientCallHistory || company.callHistoryData)?.some(
                                                                    (call) =>
                                                                        call.emp_number === bdenumber || call.emp_name?.trim().toLowerCase() === company.bdmName?.trim().toLowerCase()
                                                                )
                                                                    ? 1
                                                                    : 0.5, // Visual feedback for disabled state
                                                        }}
                                                        color={
                                                            (company.clientCallHistory || company.callHistoryData)?.some(
                                                                (call) =>
                                                                    call.emp_number === bdenumber || call.emp_name?.trim().toLowerCase() === company.bdmName?.trim().toLowerCase()
                                                            )
                                                                ? "grey"
                                                                : "lightgrey" // Change color based on availability
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        {(fordesignation === "admin" || fordesignation === "datamanager") ? (
                                                            <div
                                                                className={company.Status === "Docs/Info Sent (W)" ? "ep_docssent-w-status_status" :
                                                                    company.Status === "Docs/Info Sent (E)" ? "ep_notpickedup_status" :
                                                                        company.Status === "Docs/Info Sent (W&E)" ? "ep_docssent-we-status_status" : null}>
                                                                {company.Status}
                                                            </div>
                                                        ) : (
                                                            <EmployeeStatusChange
                                                                key={`${company["Company Name"]}-${index}`}
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
                                                                isDeletedEmployeeCompany={company.isDeletedEmployeeCompany}
                                                                setFormOpen={setFormOpen}
                                                                setAddFormOpen={setAddFormOpen}
                                                                cemail={company["Company Email"]}
                                                                cindate={company["Incorporation Date"]}
                                                                cnum={company["Company Number"]}
                                                                ename={company.ename}
                                                                bdmAcceptStatus={company.bdmAcceptStatus}
                                                                setOpenBacdrop={setOpenBacdrop}
                                                                previousStatus={company.previousStatusToUndo}
                                                            />
                                                        )}
                                                        <div
                                                            className={
                                                                (company.interestedInformation === null || company.interestedInformation.length === 0)
                                                                    ? (company.Status === "Docs/Info Sent (W)"
                                                                        ? "docs_w-history-btn disabled"
                                                                        : company.Status === "Docs/Info Sent (E)"
                                                                            ? "docs_e-history-btn disabled"
                                                                            : company.Status === "Docs/Info Sent (W&E)"
                                                                                ? "docs_eeew-history-btn disabled"
                                                                                : "")
                                                                    : (company.Status === "Docs/Info Sent (W)"
                                                                        ? "docs_w-history-btn"
                                                                        : company.Status === "Docs/Info Sent (E)"
                                                                            ? "docs_e-history-btn"
                                                                            : company.Status === "Docs/Info Sent (W&E)"
                                                                                ? "docs_eeew-history-btn"
                                                                                : "")
                                                            }
                                                        >

                                                            <FaEye
                                                                key={company._id}
                                                                style={{ border: "transparent", background: "none" }}
                                                                data-bs-toggle="modal"
                                                                data-bs-target={`#${`modal-${company["Company Name"].replace(/\s+/g, '')}`}-info`}
                                                                title="Interested Information"
                                                            //disabled={!company.interestedInformation}
                                                            />

                                                            <EmployeeInterestedInformationDialog
                                                                key={company._id}
                                                                modalId={`modal-${company["Company Name"].replace(/\s+/g, '')}-info`}
                                                                companyName={company["Company Name"]}
                                                                interestedInformation={company.interestedInformation} // Pass the interested information here
                                                                refetch={refetch}
                                                                ename={ename}
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
                                                            remarksKey="remarks" // Adjust this based on the type of remarks (UnderDocs or bdm)
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
                                                        key={company._id}
                                                        id={company._id}
                                                        nextFollowDate={company.bdeNextFollowUpDate}
                                                        refetch={refetch}
                                                        status={company.Status}
                                                    />
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
                                                <td>{formatDateNew(company["AssignDate"])}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                )
                            }
                            {underDocsData && underDocsData.length === 0 && !isLoading && (
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
                    {underDocsData && underDocsData.length !== 0 && (
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

export default EmployeeUnderDocsLeads;