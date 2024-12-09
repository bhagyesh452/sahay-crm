import React, { useState, useEffect, useRef } from "react";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { BsFilter } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";
import FilterableComponentEmployee from "../employeeComp/ExtraComponents/FilterableComponentEmployee";

function BookingsTableView({ tableViewOpen }) {
    const [currentPage, setCurrentPage] = useState(1);
    
    const [fetchedBookingsData, setFetchedBookingsData] = useState([]);
    const [dataToFilter, setDataToFilter] = useState([]);
    const [completeBookingsData, setCompleteBookingsData] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(500);
    const [searchText, setSearchText] = useState(""); // State for search input
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const navigate = useNavigate();

    useEffect(() => {
        document.title = `AdminHead-Sahay-CRM`;
    }, []);

    const allServicesWithDetails = [];

    const { data: bookingsData, isLoading: isBookingDataLoading, isError: isBookingDataError, refetch: refetchBookingData } = useQuery({
        queryKey: ["bookingsData"],
        queryFn: async () => {
            const response = await axios.get(`${secretKey}/bookings/redesigned-final-leadData-tableView`, {
                params: { currentPage, limit: itemsPerPage },
              });
              console.log(response.data);
              return response.data;
        },
        
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        refetchInterval: 300000,
        refetchIntervalInBackground: true,
    });

    useEffect(() => {
        setFetchedBookingsData(bookingsData)
        setDataToFilter(bookingsData)
        setCompleteBookingsData(bookingsData)
    }, [bookingsData])

    // Prepare data for rendering
    // Iterate over bookingData
    fetchedBookingsData?.forEach(booking => {
        // Add services from main booking with booking details
        booking.services.forEach(service => {
            allServicesWithDetails.push({
                "Company Name": booking["Company Name"],
                "Company Number": booking["Company Number"],
                "Company Email": booking["Company Email"],
                panNumber: booking.panNumber,
                bdeName: booking.bdeName,
                bdeEmail: booking.bdeEmail || '', // Make sure to handle optional fields if they are not always provided
                bdmName: booking.bdmName,
                bdmType: booking.bdmType || 'Close-by', // Default value if not provided
                bookingDate: booking.bookingDate,
                paymentMethod: booking.paymentMethod || '', // Make sure to handle optional fields if they are not always provided
                caCase: booking.caCase || false, // Default to false if not provided
                caNumber: booking.caNumber || 0, // Default to 0 if not provided
                caEmail: booking.caEmail || '', // Make sure to handle optional fields if they are not always provided
                serviceName: service.serviceName || '',
                totalPaymentWOGST: service.totalPaymentWOGST || 0, // Default to 0 if not provided
                totalPaymentWGST: service.totalPaymentWGST || 0,
                withGST: service.withGST, // Default to 0 if not provided
                firstPayment: service.firstPayment || 0, // Default to 0 if not provided
                secondPayment: service.secondPayment || 0, // Default to 0 if not provided
                thirdPayment: service.thirdPayment || 0, // Default to 0 if not provided
                fourthPayment: service.fourthPayment || 0,
                secondPaymentRemarks: service.secondPaymentRemarks || "",
                thirdPaymentRemarks: service.thirdPaymentRemarks || "",
                fourthPaymentRemarks: service.fourthPaymentRemarks || "", // Default to 0 if not provided
                bookingPublishDate: booking.bookingPublishDate || '', // Placeholder for bookingPublishDate, can be set if available
            });
        });

        // Iterate over moreBookings in each booking
        booking.moreBookings.forEach(moreBooking => {
            // Add services from moreBookings with booking and moreBooking details
            moreBooking.services.forEach(service => {
                allServicesWithDetails.push({
                    "Company Name": booking["Company Name"],
                    "Company Number": booking["Company Number"],
                    "Company Email": booking["Company Email"],
                    panNumber: booking.panNumber,
                    bdeName: moreBooking.bdeName,
                    bdeEmail: moreBooking.bdeEmail || '', // Make sure to handle optional fields if they are not always provided
                    bdmName: moreBooking.bdmName,
                    bdmType: moreBooking.bdmType || 'Close-by', // Default value if not provided
                    bookingDate: moreBooking.bookingDate,
                    paymentMethod: moreBooking.paymentMethod || '', // Make sure to handle optional fields if they are not always provided
                    caCase: moreBooking.caCase || false, // Default to false if not provided
                    caNumber: moreBooking.caNumber || 0, // Default to 0 if not provided
                    caEmail: moreBooking.caEmail || '', // Make sure to handle optional fields if they are not always provided
                    serviceName: service.serviceName || '',
                    totalPaymentWOGST: service.totalPaymentWOGST || 0, // Default to 0 if not provided
                    totalPaymentWGST: service.totalPaymentWGST || 0,
                    withGST: service.withGST, // Default to 0 if not provided
                    firstPayment: service.firstPayment || 0, // Default to 0 if not provided
                    secondPayment: service.secondPayment || 0, // Default to 0 if not provided
                    thirdPayment: service.thirdPayment || 0, // Default to 0 if not provided
                    fourthPayment: service.fourthPayment || 0,
                    secondPaymentRemarks: service.secondPaymentRemarks || "",
                    thirdPaymentRemarks: service.thirdPaymentRemarks || "",
                    fourthPaymentRemarks: service.fourthPaymentRemarks || "", // Default to 0 if not provided
                    bookingPublishDate: moreBooking.bookingPublishDate || '', // Placeholder for bookingPublishDate, can be set if available
                });
            });
        });
    });

    // Sort data by bookingDate in descending order
    allServicesWithDetails.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));

    // Filter data based on search input
    const filteredData = allServicesWithDetails.filter((item) => {
        return (
            item["Company Name"].toLowerCase().includes(searchText.toLowerCase()) ||
            item["Company Number"].toString().includes(searchText) ||
            item.serviceName.toLowerCase().includes(searchText.toLowerCase())
        );
    });

    // Pagination calculations
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredData.slice(startIndex, endIndex);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPagination = () => {
        const pagination = [];
        const maxPageButtons = 3;

        if (totalPages <= maxPageButtons) {
            for (let i = 1; i <= totalPages; i++) {
                pagination.push(
                    <li
                        key={i}
                        className={`page-item ${currentPage === i ? "active" : ""}`}
                        onClick={() => handlePageChange(i)}
                        style={{ cursor: "pointer", padding: "5px 10px", margin: "0 5px", border: "1px solid #ddd" }}
                    >
                        {i}
                    </li>
                );
            }
        } else {
            if (currentPage > 1) {
                pagination.push(
                    <li
                        key="prev"
                        className="page-item"
                        onClick={() => handlePageChange(currentPage - 1)}
                        style={{ cursor: "pointer", padding: "5px 10px", margin: "0 5px", border: "1px solid #ddd" }}
                    >
                        &lt;
                    </li>
                );
            }

            if (currentPage > 2) {
                pagination.push(
                    <li
                        key={1}
                        className="page-item"
                        onClick={() => handlePageChange(1)}
                        style={{ cursor: "pointer", padding: "5px 10px", margin: "0 5px", border: "1px solid #ddd" }}
                    >
                        1
                    </li>
                );

                if (currentPage > 3) {
                    pagination.push(
                        <li key="dots-prev" style={{ padding: "5px 10px", margin: "0 5px" }}>
                            ...
                        </li>
                    );
                }
            }

            const startPage = Math.max(1, currentPage - 1);
            const endPage = Math.min(totalPages, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
                pagination.push(
                    <li
                        key={i}
                        className={`page-item ${currentPage === i ? "active" : ""}`}
                        onClick={() => handlePageChange(i)}
                        style={{ cursor: "pointer", padding: "5px 10px", margin: "0 5px", border: "1px solid #ddd" }}
                    >
                        {i}
                    </li>
                );
            }

            if (currentPage < totalPages - 1) {
                if (currentPage < totalPages - 2) {
                    pagination.push(
                        <li key="dots-next" style={{ padding: "5px 10px", margin: "0 5px" }}>
                            ...
                        </li>
                    );
                }

                pagination.push(
                    <li
                        key={totalPages}
                        className="page-item"
                        onClick={() => handlePageChange(totalPages)}
                        style={{ cursor: "pointer", padding: "5px 10px", margin: "0 5px", border: "1px solid #ddd" }}
                    >
                        {totalPages}
                    </li>
                );
            }

            if (currentPage < totalPages) {
                pagination.push(
                    <li
                        key="next"
                        className="page-item"
                        onClick={() => handlePageChange(currentPage + 1)}
                        style={{ cursor: "pointer", padding: "5px 10px", margin: "0 5px", border: "1px solid #ddd" }}
                    >
                        &gt;
                    </li>
                );
            }
        }

        return pagination;
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

    console.log("filteredDataNew", bookingsData);

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
                                    // value={searchQuery}
                                    // onChange={(e) => {
                                    //     setSearchQuery(e.target.value);
                                    //     handleSearch(e.target.value)
                                    //     //handleFilterSearch(e.target.value)
                                    //     //setCurrentPage(0);
                                    // }}
                                    className="form-control search-cantrol mybtn"
                                    placeholder="Search…"
                                    type="text"
                                    name="bdeName-search"
                                    id="bdeName-search" />
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
                                                <FilterableComponentEmployee
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
                                                <FilterableComponentEmployee
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
                                                <FilterableComponentEmployee
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
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>BDE NAME</th>
                                <th>BDM NAME</th>
                                <th>BDM TYPE</th>
                                <th>BOOKING DATE</th>
                                <th>CA CASE</th>
                                <th>CA NUMBER</th>
                                <th>WITH GST</th>
                                <th>TOTAL PAYMENT WITHOUT GST</th>
                                <th>TOTAL PAYMENT WITH GST</th>
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
                                {currentItems.map((obj, index) => (
                                    <tr key={index}>
                                        <td className="rm-sticky-left-1">{startIndex + index + 1}</td>
                                        <td className="rm-sticky-left-2">{obj["Company Name"]}</td>
                                        <td>{obj["Company Number"]}</td>
                                        <td>{obj.serviceName}</td>
                                        <td>{obj.bdeName}</td>
                                        <td>{obj.bdmName}</td>
                                        <td>{obj.bdmType}</td>
                                        <td>{obj.bookingDate}</td>
                                        <td>{obj.caCase ? "Yes" : "No"}</td>
                                        <td>{obj.caNumber}</td>
                                        <td>{obj.withGST ? "Yes" : "No"}</td>
                                        <td>{obj.totalPaymentWOGST}</td>
                                        <td>{obj.totalPaymentWGST}</td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </table>
                </div>
            </div>
            <div className="pagination-container ">
                <ul className="pagination align-items-center justify-content-center mt-2">{renderPagination()}</ul>
            </div>
        </div>
    );
}

export default BookingsTableView;
