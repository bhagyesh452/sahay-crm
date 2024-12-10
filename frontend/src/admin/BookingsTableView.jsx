import React, { useState, useEffect, useRef } from "react";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { BsFilter } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";
import FilterableComponentEmployee from "../employeeComp/ExtraComponents/FilterableComponentEmployee";
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import FilterableTable from "../RM-CERTIFICATION/Extra-Components/FilterableTable.jsx";
import { HiInformationCircle } from "react-icons/hi2";


function BookingsTableView({ tableViewOpen }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [fetchedBookingsData, setFetchedBookingsData] = useState([]);
    const [dataToFilter, setDataToFilter] = useState([]);
    const [completeBookingsData, setCompleteBookingsData] = useState([]);
    const itemsPerPage = 500;
    const [searchText, setSearchText] = useState(""); // State for search input
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const navigate = useNavigate();

    useEffect(() => {
        document.title = `AdminHead-Sahay-CRM`;
    }, []);


    const formatDatePro = (inputDate) => {
        const date = new Date(inputDate);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month}, ${year}`;
    };


    const { data: bookingsData, isLoading: isBookingDataLoading, isError: isBookingDataError, refetch: refetchBookingData } = useQuery({
        queryKey: ["bookingsData", currentPage , searchText],
        queryFn: async () => {
            const response = await axios.get(`${secretKey}/bookings/redesigned-final-leadData-tableView`, {
                params: { page: currentPage, limit: itemsPerPage ,searchText}, // Pass currentPage and limit to the backend
            });
            return response.data; // Return the fetched data
        },
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        refetchInterval: 300000,  // Fetch the data after every 5 minutes
        refetchIntervalInBackground: true,  // Fetching the data in the background even the tab is not opened
    });

    useEffect(() => {
        setFetchedBookingsData(bookingsData?.data)
        setDataToFilter(bookingsData?.data)
        setCompleteBookingsData(bookingsData?.data)
    }, [bookingsData, refetchBookingData])



    const totalCount = bookingsData?.totalCount || 0;
    const data = bookingsData?.data || [];
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };


    const handleViewTableView = () => {
        navigate(`/md/bookings`);
    }

    // ------------filter functions------------------
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

    const [filteredDataNew, setFilteredData] = useState([]);
    const [activeFilterFields, setActiveFilterFields] = useState([]); // New state for active filter fields
    const [activeFilterField, setActiveFilterField] = useState(null);

    const handleFilter = (newData) => {
        console.log("newData", newData)
        setFilteredData(newData)
        setFetchedBookingsData(newData);
    };

    const handleFilterClick = async (field) => {
        if (filteredDataNew.length === 0) {
            try {
                // Fetch complete data without pagination
                const response = await axios.get(`${secretKey}/bookings/redesigned-final-leadData-tableView`, {
                    params: { page: 1, limit: 1000000 }, // Set a very high limit to fetch all data
                });

                // Update the state with the complete data
                const completeData = response.data?.data || [];
                //setCompleteBookingsData(completeData);
                setDataToFilter(completeData); // Set it as filteredDataNew to work with filters
                //setFetchedBookingsData(completeData); // Update main data source
            } catch (error) {
                console.error("Error fetching complete data:", error);
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

    const handleInformationClick = (companyName) => {
        // Redirect to BookingListView with the company name as a query parameter
        navigate(`/md/bookings`, { state: { searchText: companyName } });
    };

    // console.log("filteredDataNew", allServicesWithDetails);

    console.log("data", bookingsData);
    console.log("dataToFilter", dataToFilter);

    return (
        <div>
            <div className="page-header mt-3">
                <div className="container-xl">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <div class="input-icon ml-1">
                                <span class="input-icon-addon">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon mybtn" width="18" height="18" viewBox="0 0 22 22" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                                        <path d="M21 21l-6 -6"></path>
                                    </svg>
                                </span>
                                <input
                                    value={searchText}
                                    onChange={(e) => {
                                        setSearchText(e.target.value);
                                        setCurrentPage(1); // Reset to first page when search text changes
                                    }}
                                    className="form-control search-cantrol mybtn"
                                    placeholder="Search by Company Name, Number, or Email"
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <div className="btn-group" role="group" aria-label="Basic example">
                                <button type="button" className="btn btn-primary mr-1" onClick={() => handleViewTableView()}>
                                    Grid View
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="sales-panels-main no-select container-xl mt-2">
                <div className="table table-responsive e-Leadtable-style m-0">
                    <table className="table table-vcenter table-nowrap" style={{ width: "1800px" }}>
                        <thead>
                            <tr className="tr-sticky">
                                <th className="rm-sticky-left-1">Sr.No</th>
                                <th className="rm-sticky-left-2">
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
                                                <FilterableTable
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFields}
                                                    filteredData={filteredDataNew}
                                                    activeTab={"General"}
                                                    data={fetchedBookingsData}
                                                    filterField={activeFilterField}
                                                    onFilter={handleFilter}
                                                    completeData={completeBookingsData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilter}
                                                    refetch={refetchBookingData}
                                                    isComingFromAdmin={true}
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
                                        {showFilterMenu && activeFilterField === 'Company Number' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableTable
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFields}
                                                    filteredData={filteredDataNew}
                                                    activeTab={"General"}
                                                    data={fetchedBookingsData}
                                                    filterField={activeFilterField}
                                                    onFilter={handleFilter}
                                                    completeData={completeBookingsData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilter}
                                                    refetch={refetchBookingData}
                                                    isComingFromAdmin={true}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    <div className='d-flex align-items-center justify-content-center position-relative'>
                                        <div ref={el => fieldRefs.current['serviceName'] = el}>
                                            Service Name
                                        </div>

                                        <div className='RM_filter_icon'>
                                            {isActiveField('serviceName') ? (
                                                <FaFilter onClick={() => handleFilterClick("serviceName")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("serviceName")} />
                                            )}
                                        </div>

                                        {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterField === 'serviceName' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableTable
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFields}
                                                    filteredData={filteredDataNew}
                                                    activeTab={"General"}
                                                    data={fetchedBookingsData}
                                                    filterField={activeFilterField}
                                                    onFilter={handleFilter}
                                                    completeData={completeBookingsData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={fetchedBookingsData}
                                                    refetch={refetchBookingData}
                                                    isComingFromAdmin={true}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    <div className='d-flex align-items-center justify-content-center position-relative'>
                                        <div ref={el => fieldRefs.current['bdeName'] = el}>
                                            BDE Name
                                        </div>

                                        <div className='RM_filter_icon'>
                                            {isActiveField('bdeName') ? (
                                                <FaFilter onClick={() => handleFilterClick("bdeName")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("bdeName")} />
                                            )}
                                        </div>

                                        {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterField === 'bdeName' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableTable
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFields}
                                                    filteredData={filteredDataNew}
                                                    activeTab={"General"}
                                                    data={fetchedBookingsData}
                                                    filterField={activeFilterField}
                                                    onFilter={handleFilter}
                                                    completeData={completeBookingsData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilter}
                                                    refetch={refetchBookingData}
                                                    isComingFromAdmin={true}
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
                                                <FilterableTable
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFields}
                                                    filteredData={filteredDataNew}
                                                    activeTab={"General"}
                                                    data={fetchedBookingsData}
                                                    filterField={activeFilterField}
                                                    onFilter={handleFilter}
                                                    completeData={completeBookingsData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilter}
                                                    refetch={refetchBookingData}
                                                    isComingFromAdmin={true}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    <div className='d-flex align-items-center justify-content-center position-relative'>
                                        <div ref={el => fieldRefs.current['bdmType'] = el}>
                                            bdmType
                                        </div>

                                        <div className='RM_filter_icon'>
                                            {isActiveField('bdmType') ? (
                                                <FaFilter onClick={() => handleFilterClick("bdmType")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("bdmType")} />
                                            )}
                                        </div>

                                        {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterField === 'bdmType' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableTable
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFields}
                                                    filteredData={filteredDataNew}
                                                    activeTab={"General"}
                                                    data={fetchedBookingsData}
                                                    filterField={activeFilterField}
                                                    onFilter={handleFilter}
                                                    completeData={completeBookingsData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilter}
                                                    refetch={refetchBookingData}
                                                    isComingFromAdmin={true}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    <div className='d-flex align-items-center justify-content-center position-relative'>
                                        <div ref={el => fieldRefs.current['Booking Date'] = el}>
                                            Booking Date
                                        </div>

                                        <div className='RM_filter_icon'>
                                            {isActiveField('Booking Date') ? (
                                                <FaFilter onClick={() => handleFilterClick("Booking Date")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("Booking Date")} />
                                            )}
                                        </div>

                                        {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterField === 'Booking Date' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableTable
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFields}
                                                    filteredData={filteredDataNew}
                                                    activeTab={"General"}
                                                    data={fetchedBookingsData}
                                                    filterField={activeFilterField}
                                                    onFilter={handleFilter}
                                                    completeData={completeBookingsData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilter}
                                                    refetch={refetchBookingData}
                                                    isComingFromAdmin={true}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th> <div className='d-flex align-items-center justify-content-center position-relative'>
                                    <div ref={el => fieldRefs.current['caCase'] = el}>
                                        CA Case
                                    </div>

                                    <div className='RM_filter_icon'>
                                        {isActiveField('caCase') ? (
                                            <FaFilter onClick={() => handleFilterClick("caCase")} />
                                        ) : (
                                            <BsFilter onClick={() => handleFilterClick("caCase")} />
                                        )}
                                    </div>

                                    {/* ---------------------filter component--------------------------- */}
                                    {showFilterMenu && activeFilterField === 'caCase' && (
                                        <div
                                            ref={filterMenuRef}
                                            className="filter-menu"
                                            style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                        >
                                            <FilterableTable
                                                noofItems={setnoOfAvailableData}
                                                allFilterFields={setActiveFilterFields}
                                                filteredData={filteredDataNew}
                                                activeTab={"General"}
                                                data={fetchedBookingsData}
                                                filterField={activeFilterField}
                                                onFilter={handleFilter}
                                                completeData={completeBookingsData}
                                                showingMenu={setShowFilterMenu}
                                                dataForFilter={dataToFilter}
                                                refetch={refetchBookingData}
                                                isComingFromAdmin={true}
                                            />
                                        </div>
                                    )}
                                </div></th>
                                <th>
                                    <div className='d-flex align-items-center justify-content-center position-relative'>
                                        <div ref={el => fieldRefs.current['caNumber'] = el}>
                                            CA Number
                                        </div>

                                        <div className='RM_filter_icon'>
                                            {isActiveField('caNumber') ? (
                                                <FaFilter onClick={() => handleFilterClick("caNumber")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("caNumber")} />
                                            )}
                                        </div>

                                        {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterField === 'caNumber' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableTable
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFields}
                                                    filteredData={filteredDataNew}
                                                    activeTab={"General"}
                                                    data={fetchedBookingsData}
                                                    filterField={activeFilterField}
                                                    onFilter={handleFilter}
                                                    completeData={completeBookingsData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilter}
                                                    refetch={refetchBookingData}
                                                    isComingFromAdmin={true}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    <div className='d-flex align-items-center justify-content-center position-relative'>
                                        <div ref={el => fieldRefs.current['withGST'] = el}>
                                            With GST
                                        </div>

                                        <div className='RM_filter_icon'>
                                            {isActiveField('withGST') ? (
                                                <FaFilter onClick={() => handleFilterClick("withGST")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("withGST")} />
                                            )}
                                        </div>

                                        {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterField === 'withGST' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableTable
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFields}
                                                    filteredData={filteredDataNew}
                                                    activeTab={"General"}
                                                    data={fetchedBookingsData}
                                                    filterField={activeFilterField}
                                                    onFilter={handleFilter}
                                                    completeData={completeBookingsData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilter}
                                                    refetch={refetchBookingData}
                                                    isComingFromAdmin={true}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center position-relative'>
                                            <div ref={el => fieldRefs.current['totalPaymentWOGST'] = el}>
                                                Total Payment Without GST
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('totalPaymentWOGST') ? (
                                                    <FaFilter onClick={() => handleFilterClick("totalPaymentWOGST")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("totalPaymentWOGST")} />
                                                )}
                                            </div>

                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'totalPaymentWOGST' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableTable
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredDataNew}
                                                        activeTab={"General"}
                                                        data={fetchedBookingsData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeBookingsData}
                                                        showingMenu={setShowFilterMenu}
                                                        dataForFilter={dataToFilter}
                                                        refetch={refetchBookingData}
                                                        isComingFromAdmin={true}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                </th>
                                <th>
                                    <div className='d-flex align-items-center justify-content-center position-relative'>
                                        <div ref={el => fieldRefs.current['totalPaymentWGST'] = el}>
                                            Total Payment With GST
                                        </div>

                                        <div className='RM_filter_icon'>
                                            {isActiveField('totalPaymentWGST') ? (
                                                <FaFilter onClick={() => handleFilterClick("totalPaymentWGST")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("totalPaymentWGST")} />
                                            )}
                                        </div>

                                        {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterField === 'totalPaymentWGST' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableTable
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFields}
                                                    filteredData={filteredDataNew}
                                                    activeTab={"General"}
                                                    data={fetchedBookingsData}
                                                    filterField={activeFilterField}
                                                    onFilter={handleFilter}
                                                    completeData={completeBookingsData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilter}
                                                    refetch={refetchBookingData}
                                                    isComingFromAdmin={true}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    <div className='d-flex align-items-center justify-content-center position-relative'>
                                        <div ref={el => fieldRefs.current['remainingAmount'] = el}>
                                            Pending Amount
                                        </div>

                                        <div className='RM_filter_icon'>
                                            {isActiveField('remainingAmount') ? (
                                                <FaFilter onClick={() => handleFilterClick("remainingAmount")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("remainingAmount")} />
                                            )}
                                        </div>

                                        {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterField === 'remainingAmount' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableTable
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFields}
                                                    filteredData={filteredDataNew}
                                                    activeTab={"General"}
                                                    data={fetchedBookingsData}
                                                    filterField={activeFilterField}
                                                    onFilter={handleFilter}
                                                    completeData={completeBookingsData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilter}
                                                    refetch={refetchBookingData}
                                                    isComingFromAdmin={true}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    <div className='d-flex align-items-center justify-content-center position-relative'>
                                        <div ref={el => fieldRefs.current['pendingRecievedAmount'] = el}>
                                            Recieved Amount
                                        </div>

                                        <div className='RM_filter_icon'>
                                            {isActiveField('pendingRecievedAmount') ? (
                                                <FaFilter onClick={() => handleFilterClick("pendingRecievedAmount")} />
                                            ) : (
                                                <BsFilter onClick={() => handleFilterClick("pendingRecievedAmount")} />
                                            )}
                                        </div>

                                        {/* ---------------------filter component--------------------------- */}
                                        {showFilterMenu && activeFilterField === 'pendingRecievedAmount' && (
                                            <div
                                                ref={filterMenuRef}
                                                className="filter-menu"
                                                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                            >
                                                <FilterableTable
                                                    noofItems={setnoOfAvailableData}
                                                    allFilterFields={setActiveFilterFields}
                                                    filteredData={filteredDataNew}
                                                    activeTab={"General"}
                                                    data={fetchedBookingsData}
                                                    filterField={activeFilterField}
                                                    onFilter={handleFilter}
                                                    completeData={completeBookingsData}
                                                    showingMenu={setShowFilterMenu}
                                                    dataForFilter={dataToFilter}
                                                    refetch={refetchBookingData}
                                                    isComingFromAdmin={true}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>
                                    Booking
                                </th>
                            </tr>
                        </thead>
                        {isBookingDataLoading ? (
                            <tbody>
                                <tr>
                                    <td colSpan="14">
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
                            </tbody>
                        ) : (
                            <tbody>
                                {fetchedBookingsData?.map((obj, index) => (
                                    <tr key={index}>
                                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td className="rm-sticky-left-2">{obj["Company Name"]}</td>
                                        <td>{obj["Company Number"]}</td>
                                        <td>{obj.serviceName}</td>
                                        <td>{obj.bdeName}</td>
                                        <td>{obj.bdmName}</td>
                                        <td>{obj.bdmType}</td>
                                        <td>{formatDatePro(obj.bookingDate)}</td>
                                        <td>{obj.caCase ? "Yes" : "No"}</td>
                                        <td>{obj.caCase === "Yes" ? obj.caNumber : "Not Applicable"}</td>
                                        <td>{obj.withGST ? "Yes" : "No"}</td>
                                        <td>₹{(obj.totalPaymentWOGST.toLocaleString('en-IN'))}</td>
                                        <td>₹{(obj.totalPaymentWGST).toLocaleString('en-IN')}</td>
                                        <td>₹{(obj.remainingAmount).toLocaleString('en-IN')}</td>
                                        <td>₹{(obj.pendingRecievedAmount).toLocaleString('en-IN')}</td>
                                        <td>
                                            <HiInformationCircle
                                                style={{
                                                    cursor: "pointer",
                                                    width: "19px",
                                                    height: "20px",
                                                    color: "#95abb3",
                                                }}
                                                onClick={() => handleInformationClick(obj["Company Name"])}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </table>
                </div>
                {data && data.length !== 0 && (
                    <div className="pagination d-flex align-items-center justify-content-center w-100">
                        <div>
                            <button
                                className="btn-pagination"
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                            >
                                <GoArrowLeft />
                            </button>
                        </div>
                        <div className="ml-3 mr-3">
                            Page {currentPage} of {totalPages}
                        </div>
                        <div>
                            <button
                                className="btn-pagination"
                                onClick={handleNextPage}
                                disabled={currentPage >= totalPages}
                            >
                                <GoArrowRight />
                            </button>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}

export default BookingsTableView;
