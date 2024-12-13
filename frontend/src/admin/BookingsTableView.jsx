import React, { useState, useEffect, useRef, useMemo } from "react";
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
import { FaRegEye } from "react-icons/fa";
import MaleEmployee from "../static/EmployeeImg/office-man.png";
import FemaleEmployee from "../static/EmployeeImg/woman.png";
import RemainingAmnt from "../static/my-images/money.png";
import { width } from "@mui/system";
import AdminBookingDetailDialog from "./ExtraComponent/AdminBookingDetailDialog.jsx";


function BookingsTableView({ isComingFromDataManager }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredDataNew, setFilteredData] = useState([]);
    const [fetchedBookingsData, setFetchedBookingsData] = useState([]);
    const [dataToFilter, setDataToFilter] = useState([]);
    const [completeBookingsData, setCompleteBookingsData] = useState([]);
    const itemsPerPage = 500;
    const [searchText, setSearchText] = useState(""); // State for search input
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const navigate = useNavigate();
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


    const [activeFilterFields, setActiveFilterFields] = useState([]); // New state for active filter fields
    const [activeFilterField, setActiveFilterField] = useState(null);

    useEffect(() => {
        if (!isComingFromDataManager) {
            document.title = `Admin-Sahay-CRM`;
        } else {
            document.title = `Datamanager-Sahay-CRM`;
        }

    }, []);


    const formatDatePro = (inputDate) => {
        const date = new Date(inputDate);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month}, ${year}`;
    };


    const { data: bookingsData, isLoading: isBookingDataLoading, isError: isBookingDataError, refetch: refetchBookingData } = useQuery({
        queryKey: ["bookingsData", currentPage, searchText],
        queryFn: async () => {
            const response = await axios.get(`${secretKey}/bookings/redesigned-final-leadData-tableView`, {
                params: { page: currentPage, limit: itemsPerPage, searchText }, // Pass currentPage and limit to the backend
            });
            return response.data; // Return the fetched data
        },
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        refetchInterval: 300000,  // Fetch the data after every 5 minutes
        refetchIntervalInBackground: true,  // Fetching the data in the background even the tab is not opened
    });

    useEffect(() => {
        if (bookingsData) {
            // Always set other data states
            setFetchedBookingsData(bookingsData?.data || []);
            // setDataToFilter(bookingsData?.data || []);
            setCompleteBookingsData(bookingsData?.data || []);

            // Only set filteredData when there is a search
            if (searchText && searchText.trim() !== "") {
                setFilteredData(bookingsData?.data || []);
            } else {
                setFilteredData([]);
            }
        }
    }, [bookingsData, searchText]);



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
        if (isComingFromDataManager) {
            navigate(`/dataanalyst/bookings`)
        } else {
            navigate(`/md/bookings`);
        }

    }

    // ------------filter functions------------------


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

                setDataToFilter(completeData); // Set it as filteredDataNew to work with filters

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
    // ==============================to open booking details dialog============================
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedCompanyName, setSelectedCompanyName] = useState(null);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const handleInformationClick = async (companyName) => {
        setSelectedCompanyName(companyName);
        setDialogOpen(true);
        setLoadingDetails(true);

        try {
            const response = await axios.get(`${secretKey}/bookings/redesigned-final-leadData/${companyName}`);
            setBookingDetails(response.data);
        } catch (error) {
            console.error("Error fetching booking details:", error);
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedCompanyName(null);
        setBookingDetails(null);
    };


    // =================================to find no of companies===========================
    const stats = useMemo(() => {
        // Use filteredData if a search is active, otherwise use all data
        const activeData = searchText && searchText.trim() !== "" ? filteredDataNew : fetchedBookingsData;

        if (!activeData || activeData.length === 0) {
            return {
                noOfBookings: 0,
                noOfCompanies: 0,
                noOfServices: 0,
                totalPayment: 0,
                totalFullAdvanceRecieved: 0,
                totalRemainingPaymentReceived: 0,
                totalRemainingPayment: 0,
            };
        }

        // Track unique bookings using a Set
        const uniqueBookings = new Set();

        activeData.forEach((item) => {
            const bookingIdentifier = `${item["Company Name"]}-${item.bookingDate}`;
            uniqueBookings.add(bookingIdentifier); // Add unique Company Name + bookingDate combination
        });

        const noOfBookings = uniqueBookings.size;
        const uniqueCompanies = new Set(activeData.map((data) => data["Company Name"]));
        const noOfCompanies = uniqueCompanies.size;
        const noOfServices = activeData.length;
        const totalPayment = activeData.reduce((sum, item) => sum + (item.totalPaymentWGST || 0), 0);
        const totalFullAdvanceRecieved = activeData.reduce((sum, item) => sum + (item.receivedAsFullAdvance || 0), 0);
        const totalRemainingPaymentReceived = activeData.reduce((sum, item) => sum + (item.receivedAsRemaining || 0), 0);
        const totalRemainingPayment = activeData.reduce((sum, item) => sum + (item.remainingAmount || 0), 0);

        return {
            noOfBookings,
            noOfCompanies,
            noOfServices,
            totalPayment,
            totalFullAdvanceRecieved,
            totalRemainingPaymentReceived,
            totalRemainingPayment,
        };
    }, [filteredDataNew, fetchedBookingsData, searchText]);


    // console.log("filteredDataNew", allServicesWithDetails);

    // console.log("data", bookingsData);
    // console.log("filteredDataNew", filteredDataNew)
    console.log("dataToFilter", dataToFilter);

    // console.log("bookingDetails", bookingDetails)

    return (
        <div>
            <div className="page-header mt-3">
                <div className="container-xl">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <div class="input-icon">
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
                        <div className="d-flex align-items-center mr-1">
                            {filteredDataNew && filteredDataNew.length !== 0 &&
                                (<>
                                    <div className="selection-data mr-1">Bookings: {stats.noOfBookings}</div>
                                    <div className="selection-data mr-1">Companies: {stats.noOfCompanies}</div>
                                    <div className="selection-data mr-1">Services: {stats.noOfServices}</div>
                                    <div className="selection-data mr-1">Total Payment: ₹{(parseInt(stats.totalPayment || 0, 10)).toLocaleString('en-IN')}</div>
                                    <div className="selection-data mr-1">Full Advance: ₹{(parseInt(stats.totalFullAdvanceRecieved || 0, 10)).toLocaleString('en-IN')}</div>
                                    <div className="selection-data mr-1">Remaining Received: ₹{(parseInt(stats.totalRemainingPaymentReceived || 0, 10)).toLocaleString('en-IN')}</div>
                                    <div className="selection-data mr-1">Pending Payment: ₹{(parseInt(stats.totalRemainingPayment || 0, 10)).toLocaleString('en-IN')}</div>
                                </>)
                            }

                            <div className="d-flex align-items-center">
                                <div className="btn-group" role="group" aria-label="Basic example">
                                    <button type="button" className="btn action-btn-primary" onClick={() => handleViewTableView()}>
                                        Grid View
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="page-body">
                <div className="sales-panels-main no-select">
                    <div className="container-xl mt-2">
                        <div className="table table-responsive e-Leadtable-style m-0" id="bknglisth" style={{ borderRadius: "6px", border: "1px solid #ccc" }}>
                            <table className="table table-vcenter table-nowrap" style={{ width: "max-content" }}>
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
                                                            setFilteredData={setFilteredData}
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
                                                            setFilteredData={setFilteredData}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                        <th>
                                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                                <div ref={el => fieldRefs.current['bookingIndex'] = el}>
                                                    Booking Number
                                                </div>

                                                <div className='RM_filter_icon'>
                                                    {isActiveField('bookingIndex') ? (
                                                        <FaFilter onClick={() => handleFilterClick("bookingIndex")} />
                                                    ) : (
                                                        <BsFilter onClick={() => handleFilterClick("bookingIndex")} />
                                                    )}
                                                </div>

                                                {/* ---------------------filter component--------------------------- */}
                                                {showFilterMenu && activeFilterField === 'bookingIndex' && (
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
                                                            setFilteredData={setFilteredData}
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
                                                            setFilteredData={setFilteredData}
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
                                                            setFilteredData={setFilteredData}
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
                                                            setFilteredData={setFilteredData}
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
                                                            setFilteredData={setFilteredData}
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
                                                            setFilteredData={setFilteredData}
                                                        />
                                                    </div>
                                                )}
                                            </div>
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
                                                            setFilteredData={setFilteredData}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                        <th>
                                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                                <div ref={el => fieldRefs.current['pendingReceivedAmount'] = el}>
                                                    Recieved Amount
                                                </div>

                                                <div className='RM_filter_icon'>
                                                    {isActiveField('pendingReceivedAmount') ? (
                                                        <FaFilter onClick={() => handleFilterClick("pendingReceivedAmount")} />
                                                    ) : (
                                                        <BsFilter onClick={() => handleFilterClick("pendingReceivedAmount")} />
                                                    )}
                                                </div>

                                                {/* ---------------------filter component--------------------------- */}
                                                {showFilterMenu && activeFilterField === 'pendingReceivedAmount' && (
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
                                                            setFilteredData={setFilteredData}
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
                                                            setFilteredData={setFilteredData}
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
                                                            setFilteredData={setFilteredData}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                        <th className="rm-sticky-action">
                                            Action
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
                                        {fetchedBookingsData?.map((obj, index) => {
                                            // const bdeProfilePhotoUrl = obj.bdeProfilePhoto?.length !== 0 && obj.bdeProfilePhoto !== null
                                            //     ? `${secretKey}/employee/fetchProfilePhoto/${obj.bdeEmpId}/${obj.bdeProfilePhoto?.[0]?.filename}`
                                            //     : MaleEmployee;
                                            // const bdmProfilePhotoUrl = obj.bdmProfilePhoto?.length !== 0 && obj.bdmProfilePhoto !== null
                                            //     ? `${secretKey}/employee/fetchProfilePhoto/${obj.bdmEmpId}/${obj.bdmProfilePhoto?.[0]?.filename}`
                                            //     : MaleEmployee;

                                            return (
                                                < tr key={index} >
                                                    <td className="rm-sticky-left-1">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                    <td className="rm-sticky-left-2">{obj["Company Name"]}</td>
                                                    <td>{formatDatePro(obj.bookingDate)}</td>
                                                    <td>{`Booking  ${obj.bookingIndex}`}</td>
                                                    <td>
                                                        <div className="ellipsis-cell" title={obj.serviceName}>
                                                            {obj.serviceName}
                                                        </div></td>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            {/* <div className="tbl-pro-img" style={{ height: '28px', width: '28px' }}>
                                                                <img src={bdeProfilePhotoUrl} className="profile-photo"></img>
                                                            </div> */}
                                                            <div>
                                                                {obj.bdeName}
                                                            </div>
                                                        </div>

                                                    </td>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            {/* <div className="tbl-pro-img" style={{ height: '28px', width: '28px' }}>
                                                                <img src={bdmProfilePhotoUrl} className="profile-photo"></img>
                                                            </div> */}
                                                            <div>
                                                                {obj.bdmName}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{obj.bdmType}</td>

                                                    <td>{obj.withGST ? "Yes" : "No"}</td>
                                                    <td>
                                                        <div className="bknglistviewtotalpayment">
                                                            ₹{(parseInt(obj.totalPaymentWGST || 0, 10))?.toLocaleString('en-IN')}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="bknglistviewreceivepayment">
                                                            <div className="d-flex align-items-center justify-content-center">
                                                                <div>
                                                                    ₹{(parseInt(obj.pendingReceivedAmount || 0, 10))?.toLocaleString('en-IN')}
                                                                </div>
                                                                {obj.receivedAsRemaining > 0 && (
                                                                    <div
                                                                        className="ml-1"
                                                                        title="Remaining Payment Received" style={{ width: '20px' }}
                                                                    >
                                                                        <img src={RemainingAmnt} alt="Remaining Amount Icon" style={{ width: '60%' }} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="bknglistviewpendingpayment">
                                                            ₹{(parseInt(obj.remainingAmount || 0, 10))?.toLocaleString('en-IN')}
                                                        </div>
                                                    </td>
                                                    <td>{obj["Company Number"]}</td>
                                                    <td>{obj["Company Email"]}</td>
                                                    <td className="rm-sticky-action">
                                                        <button className="action-btn action-btn-alert ml-1">
                                                            <FaRegEye
                                                                onClick={() => handleInformationClick(obj["Company Name"])}
                                                            />
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
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
            </div>

            {dialogOpen && (
                <AdminBookingDetailDialog
                    loadingDetails={loadingDetails}
                    dialogOpen={dialogOpen}
                    handleCloseDialog={handleCloseDialog}
                    selectedCompanyName={selectedCompanyName}
                    bookingDetails={bookingDetails ? bookingDetails : []}
                />
            )

            }
        </div>
    );
}

export default BookingsTableView;
