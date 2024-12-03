import React, { useState, useEffect, useRef } from 'react';
import { LuHistory } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import Nodata from '../../components/Nodata';
import RemarksDialog from '../ExtraComponents/RemarksDialog';
import EmployeeStatusChange from '../ExtraComponents/EmployeeStatusChange';
import RedesignedForm from '../../admin/RedesignedForm';
import AddLeadForm from '../../admin/AddLeadForm';
import { format } from 'date-fns';
import axios from "axios";
import Swal from "sweetalert2";
import { TiArrowBack } from "react-icons/ti";
import { TiArrowForward } from "react-icons/ti";
import { RiInformationLine } from "react-icons/ri";
import FeedbackDialog from '../ExtraComponents/FeedbackDialog';
import FilterableComponentEmployee from "../ExtraComponents/FilterableComponentEmployee";
import { BsFilter } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";
import EmployeeInterestedInformationDialog from '../ExtraComponents/EmployeeInterestedInformationDialog';
import { FaEye } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";

function EmployeeForwardedLeads({
    forwardedLeads,
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
    fordesignation,
    setSelectedRows,
    handleCheckboxChange,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    selectedRows,
    bdenumber,
    filteredData,
    filterMethod,
    completeGeneralData,
    // dataToFilter,
    setForwardedData,
    setForwardedDataCount,
    setFilteredData,
    activeFilterField,
    setActiveFilterField,
    activeFilterFields,
    setActiveFilterFields,
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
    // --------------------------------function to take company back forwarded to bdm and not accepted by bdm--------------------------
    const handleReverseAssign = async (
        companyId,
        companyName,
        bdmAcceptStatus,
        empStatus,
        bdmName
    ) => {
        if (bdmAcceptStatus === "Pending" || bdmAcceptStatus === "MaturedPending") {
            try {
                const response = await axios.post(
                    `${secretKey}/bdm-data/teamleads-reversedata/${companyId}`,
                    {
                        companyName,
                        bdmAcceptStatus: "NotForwarded",
                        bdmName: "NoOne" // Corrected parameter name
                    }
                );
                // const response2 = await axios.post(`${secretKey}/
                //     /post-updaterejectedfollowup/${companyName}`, {
                //     caseType: "NotForwarded"
                // })
                // // console.log("response", response.data);
                Swal.fire("Data Reversed");
                refetch();
            } catch (error) {
                console.log("error reversing bdm forwarded data", error.message);
            }
        } else if (bdmAcceptStatus === "NotForwarded") {
            Swal.fire("Cannot Reforward Data");
        } else if (bdmAcceptStatus === "Accept") {
            Swal.fire("BDM already accepted this data!");
        }
    };

    //----------- function to revert back company accepted by bdm ----------------------------
    const handleRevertAcceptedCompany = async (companyId, companyName, bdeStatus) => {
        // Show confirmation dialog
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You wan't to revert back this company!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, revert it!'
        });

        // If confirmed, proceed with the request
        if (result.isConfirmed) {
            try {
                const response = await axios.post(`${secretKey}/company-data/post-bderevertbackacceptedcompanyrequest`, null, {
                    params: {
                        companyId,
                        companyName
                    }
                });
                Swal.fire(
                    'Reverted!',
                    'The company request has been reverted back.',
                    'success'
                );

                refetch();
            } catch (error) {
                console.log("Error reverting back company", error);
                Swal.fire(
                    'Error!',
                    'There was an error reverting back the company request.',
                    'error'
                );
            }
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
    const [dataToFilter, setDataToFilter] = useState([]);
    // const [filteredData, setFilteredData] = useState([]);

    const handleFilter = (newData) => {
        setFilteredData(newData)
        setForwardedData(newData);
        setForwardedDataCount(newData.length);
    };

    const handleFilterClick = async (field) => {
        if (filteredData.length === 0) {
            try {
                const response = await axios.get(
                    `${secretKey}/company-data/employees-forwarded/${cleanString(ename)}`, // Backend API endpoint
                    {
                        params: {
                            limit: 500, // Adjust the limit as required
                            // search: searchQuery, // Pass the search query if applicable
                        },
                    }
                );

                const { forwardedData } = response.data;
                console.log("interestedData", forwardedData)
                // setDataToFilter(forwardedData);
                setDataToFilter(forwardedData); // Update data based on the response
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

    // console.log("activeFilterFieldsInterested", activeFilterFields)

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
                const companyNumbers = forwardedLeads?.map((company) => String(company["Company Number"]));

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

                    const matchedCompany = forwardedLeads?.find((company) => {
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
                    forwardedLeads.map(async (company) => {
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
    }, [forwardedLeads]);

    console.log("forwardedLeads", forwardedLeads)


    return (
        <div className="sales-panels-main no-select" onMouseUp={handleMouseUp}>
            {!formOpen && !addFormOpen && (
                <>
                    <div className="table table-responsive e-Leadtable-style m-0">
                        <table className="table table-vcenter table-nowrap" style={{ width: "2200px" }} onMouseLeave={handleMouseUp}>
                            <thead>
                                <tr className="tr-sticky">
                                    {(fordesignation === "admin" || fordesignation === "datamanager") &&
                                        (
                                            <th className='AEP-sticky-left-1'>
                                                <label className='table-check'>
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            selectedRows && forwardedLeads && (selectedRows.length === forwardedLeads.length)
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
                                                        activeTab={"Forwarded"}
                                                        data={forwardedLeads}
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
                                                        activeTab={"Forwarded"}
                                                        data={forwardedLeads}
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
                                            {showFilterMenu && activeFilterField === 'bdeOldStatus' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableComponentEmployee
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"Forwarded"}
                                                        data={forwardedLeads}
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
                                    <th>BDE Remarks</th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center position-relative'>
                                            <div ref={el => fieldRefs.current['bdmStatus'] = el}>
                                                BDM Status
                                            </div>
                                            <div className='RM_filter_icon'>
                                                {isActiveField('bdmStatus') ? (
                                                    <FaFilter onClick={() => handleFilterClick("bdmStatus")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("bdmStatus")} />
                                                )}
                                            </div>

                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'bdmStatus' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableComponentEmployee
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"Forwarded"}
                                                        data={forwardedLeads}
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
                                                        activeTab={"Forwarded"}
                                                        data={forwardedLeads}
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
                                                        activeTab={"Forwarded"}
                                                        data={forwardedLeads}
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
                                                        activeTab={"Forwarded"}
                                                        data={forwardedLeads}
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
                                                        activeTab={"Forwarded"}
                                                        data={forwardedLeads}
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
                                                        activeTab={"Forwarded"}
                                                        data={forwardedLeads}
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
                                            <div ref={el => fieldRefs.current['bdmName'] = el}>
                                                BDM Name
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('bdmName') ? (
                                                    <FaFilter onClick={() => handleFilterClick("bdmName")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("bdmName")} />
                                                )}
                                            </div>

                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'bdmName' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableComponentEmployee
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"Forwarded"}
                                                        data={forwardedLeads}
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
                                            <div ref={el => fieldRefs.current['bdeForwardDate'] = el}>
                                                Forwarded Date
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('bdeForwardDate') ? (
                                                    <FaFilter onClick={() => handleFilterClick("bdeForwardDate")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("bdeForwardDate")} />
                                                )}
                                            </div>

                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'bdeForwardDate' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableComponentEmployee
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"Forwarded"}
                                                        data={forwardedLeads}
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
                                    {(fordesignation !== "admin" && fordesignation !== "datamanager") &&
                                        <th>Forward To BDM</th>
                                    }
                                    <th className="rm-sticky-action">Feedback</th>
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
                                    {forwardedLeads && forwardedLeads.map((company, index) => (
                                        <tr key={company._id}
                                            style={{ border: "1px solid #ddd" }}
                                            onMouseDown={() => handleMouseDown(company._id)} // Start drag selection
                                            onMouseOver={() => handleMouseEnter(company._id)} // Continue drag selection
                                            onMouseUp={handleMouseUp} // End drag selection
                                            id={selectedRows && selectedRows.includes(company._id) ? 'selected_admin' : ''} // Highlight selected rows
                                        >
                                            {(fordesignation === "admin" || fordesignation === "datamanager") && (
                                                <td className='AEP-sticky-left-1'>
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
                                                                ? "#fbb900" : "#000000" // Change color based on availability
                                                        }
                                                    />
                                                </td>
                                            <td style={{ width: "200px" }}>
                                                {/* <div
                                                    className={company.bdeOldStatus === "Interested" ? "dfault_interested-status" :
                                                        company.bdeOldStatus === "FollowUp" ? "dfault_followup-status" :
                                                            null}
                                                            >
                                                    {company.bdeOldStatus}
                                                </div> */}
                                                <div className="d-flex align-items-center justify-content-between">

                                                    <div
                                                        className={`${company.bdeOldStatus === "Not Picked Up"
                                                            ? "ep_notpickedup_status"
                                                            : company.bdeOldStatus === "Not Interested"
                                                                ? "dfault_notinterested-status"
                                                                : company.bdeOldStatus === "Busy"
                                                                    ? "ep_busy_status"
                                                                    : company.bdeOldStatus === "Untouched"
                                                                        ? "ep_untouched_status"
                                                                        : company.bdeOldStatus === "Interested"
                                                                            ? "dfault_interested-status"
                                                                            : company.bdeOldStatus === "FollowUp"
                                                                                ? "dfault_followup-status"
                                                                                : company.bdeOldStatus === "Matured"
                                                                                    ? "dfault_approved-status"
                                                                                    : "dfault_followup-status"
                                                            }`}
                                                    >
                                                        {company.bdeOldStatus}
                                                    </div>


                                                    <div
                                                        className={
                                                            (company.interestedInformation === null || company.interestedInformation.length === 0)
                                                                ? (company.bdeOldStatus === "Interested"
                                                                    ? "intersted-history-btn disabled"
                                                                    : company.bdeOldStatus === "FollowUp"
                                                                        ? "followup-history-btn disabled"
                                                                        : company.bdeOldStatus === "Matured"
                                                                            ? "matured-history-btn disabled"
                                                                            : company.bdeOldStatus === "Not Picked Up"
                                                                                ? "notpickedup-history-btn disabled"
                                                                                : company.bdeOldStatus === "Not Interested"
                                                                                    ? "notinterested-history-btn disabled"
                                                                                    : company.bdeOldStatus === "Busy"
                                                                                        ? "busy-history-btn disabled"
                                                                                        : company.bdeOldStatus === "Untouched"
                                                                                            ? "untouched-history-btn disabled"
                                                                                            : "")
                                                                : (company.bdeOldStatus === "Interested"
                                                                    ? "intersted-history-btn"
                                                                    : company.bdeOldStatus === "FollowUp"
                                                                        ? "followup-history-btn"
                                                                        : company.bdeOldStatus === "Matured"
                                                                            ? "matured-history-btn"
                                                                            : company.bdeOldStatus === "Not Picked Up"
                                                                                ? "notpickedup-history-btn"
                                                                                : company.bdeOldStatus === "Not Interested"
                                                                                    ? "notinterested-history-btn"
                                                                                    : company.bdeOldStatus === "Busy"
                                                                                        ? "busy-history-btn"
                                                                                        : company.bdeOldStatus === "Untouched"
                                                                                            ? "untouched-history-btn"
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
                                                <div
                                                    key={company._id} className='d-flex align-items-center justify-content-between w-100' >
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
                                                        fordesignation={fordesignation}

                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <div
                                                    className={company.Status === "Interested" || company.bdmStatus === "Interested" ? "dfault_interested-status" :
                                                        company.Status === "FollowUp" || company.bdmStatus === "FollowUp" ? "dfault_followup-status" :
                                                            company.Status === "Busy" || company.bdmStatus === "Busy" ? "dfault_busy-status" :
                                                                company.Status === "Not Picked Up" || company.bdmStatus === "Not Picked Up" ? "dfault_not-pickedup-status" :
                                                                    company.bdmStatus && company.bdmStatus === "Untouched" ? "dfault_untouched-status" :
                                                                        company.bdmStatus && company.bdmStatus === "Interested" ? "dfault_interested-status" :
                                                                            company.bdmStatus && company.bdmStatus === "FollowUp" ? "dfault_followup-status" :
                                                                                company.bdmStatus && company.bdmStatus === "Busy" ? "dfault_busy-status" :
                                                                                    company.bdmStatus && company.bdmStatus === "Untouched" ? "ep_untouched_status" :
                                                                                        null}>
                                                    {company.bdmStatus ? company.bdmStatus : company.Status}
                                                </div>
                                            </td>
                                            <td>
                                                <div key={company._id}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        width: "100px",
                                                    }}>
                                                    <p
                                                        className="rematkText text-wrap m-0"
                                                        title={company.bdmRemarks}
                                                    >
                                                        {!company.bdmRemarks
                                                            ? "No Remarks"
                                                            : company.bdmRemarks}
                                                    </p>
                                                    <RemarksDialog
                                                        key={`${company["Company Name"]}-${index}`} // Using index or another field to create a unique key
                                                        currentCompanyName={company["Company Name"]}
                                                        //filteredRemarks={filteredRemarks}
                                                        companyId={company._id}
                                                        remarksKey="bdmRemarks" // For BDM remarks
                                                        isEditable={false} // Disable editing
                                                        secretKey={secretKey}
                                                        //fetchRemarksHistory={fetchRemarksHistory}
                                                        bdeName={company.ename}
                                                        fetchNewData={refetch}
                                                        bdmName={company.bdmName}
                                                        bdmAcceptStatus={company.bdmAcceptStatus}
                                                        companyStatus={company.Status}
                                                        mainRemarks={company.Remarks}
                                                        fordesignation={fordesignation}

                                                    //remarksHistory={remarksHistory} // pass your remarks history data
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
                                            <td>{formatDateNew(company["AssignDate"])}</td>
                                            <td>{company.bdmName}</td>
                                            <td>{formatDateNew(company.bdeForwardDate)}</td>
                                            {(fordesignation !== "admin" && fordesignation !== "datamanager") && (<td>
                                                {company.bdmAcceptStatus === "NotForwarded" ? (<>
                                                    <TiArrowForward
                                                        style={{
                                                            cursor: "pointer",
                                                            width: "17px",
                                                            height: "17px",
                                                        }}
                                                        className='disabled'
                                                        color="lightgrey"
                                                    />
                                                </>) : company.bdmAcceptStatus === "Pending" || company.bdmAcceptStatus === "Forwarded" || company.bdmAcceptStatus === "MaturedPending" ? (<>

                                                    <TiArrowBack
                                                        onClick={() => {
                                                            handleReverseAssign(
                                                                company._id,
                                                                company["Company Name"],
                                                                company.bdmAcceptStatus,
                                                                company.Status,
                                                                company.bdmName
                                                            )
                                                        }}
                                                        style={{
                                                            cursor: "pointer",
                                                            width: "17px",
                                                            height: "17px",
                                                        }}
                                                        color="#fbb900"
                                                    />
                                                </>) :
                                                    ((company.bdmAcceptStatus === "Accept" || company.bdmAcceptStatus === "MaturedAccepted") && !company.RevertBackAcceptedCompanyRequest) ? (
                                                        <>
                                                            <TiArrowBack
                                                                onClick={() => handleRevertAcceptedCompany(
                                                                    company._id,
                                                                    company["Company Name"],
                                                                    company.Status
                                                                )}
                                                                style={{
                                                                    cursor: "pointer",
                                                                    width: "17px",
                                                                    height: "17px",
                                                                }}
                                                                color="black" />
                                                        </>) :
                                                        (company.bdmAcceptStatus === 'Accept' && company.RevertBackAcceptedCompanyRequest === 'Send') ? (
                                                            <>
                                                                <TiArrowBack
                                                                    style={{
                                                                        cursor: "pointer",
                                                                        width: "17px",
                                                                        height: "17px",
                                                                    }}
                                                                    className='disabled'
                                                                    color="lightgrey" />
                                                            </>) : (<>
                                                                <TiArrowBack
                                                                    onClick={() => {
                                                                    }}
                                                                    style={{
                                                                        cursor: "pointer",
                                                                        width: "17px",
                                                                        height: "17px",
                                                                    }}
                                                                    className='disabled'
                                                                    color="lightgrey"
                                                                />
                                                            </>)}
                                            </td>)}
                                            <td className="rm-sticky-action">
                                                <FeedbackDialog
                                                    key={`${company["Company Name"]}-${index}`} // Using index or another field to create a unique key
                                                    companyId={company._id}
                                                    companyName={company["Company Name"]}
                                                    feedbackRemarks={company.feedbackRemarks ? company.feedbackRemarks : "No Remarks"}
                                                    feedbackPoints={company.feedbackPoints ? company.feedbackPoints : "0"}
                                                    isEmployeeFeedback={true}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            )}
                            {forwardedLeads && forwardedLeads.length === 0 && !isLoading && (
                                <tbody>
                                    <tr>
                                        <td colSpan="17" className="p-2 particular">
                                            <Nodata />
                                        </td>
                                    </tr>
                                </tbody>
                            )}
                        </table>
                    </div>
                    {forwardedLeads && forwardedLeads.length !== 0 && (
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
            )
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
        </div >
    );
}

export default EmployeeForwardedLeads;