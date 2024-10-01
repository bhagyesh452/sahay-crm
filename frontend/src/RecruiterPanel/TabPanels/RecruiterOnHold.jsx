import React, { useState, useEffect, useCallback, useRef } from "react";
import { FaWhatsapp } from "react-icons/fa";

import { FaRegEye } from "react-icons/fa";
import axios from "axios";
import io from "socket.io-client";
import { Drawer, Icon, IconButton } from "@mui/material";
import { FaPencilAlt } from "react-icons/fa";
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormHelperText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import debounce from "lodash/debounce";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import Nodata from "../../components/Nodata";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { BsFilter } from "react-icons/bs";

import { FaFilter } from "react-icons/fa";
import RecruiterStatusDropdown from "../ExtraComponents/RecruiterStatusDropdown";
import { AiFillFilePdf } from "react-icons/ai"; // Importing a PDF icon from react-icons
import RecruiterInterviewStatus from "../ExtraComponents/RecruiterInterviewStatus";
import RecruiterRemarks from "../ExtraComponents/RecruiterRemarks";
import RecruiterCallHistory from "../ExtraComponents/RecruiterCallHistory";
import RecruiterFilter from "../ExtraComponents/RecruiterFilter";

function RecruiterOnHold({
    searchText,
    showFilter,
    onFilterToggle,
    totalFilteredData,
    showingFilterIcon,
    activeTab,
    completeEmployeeInfo
}) {
    const recruiterUserId = localStorage.getItem("recruiterUserId")
    const [employeeData, setEmployeeData] = useState([]);
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [currentDataLoading, setCurrentDataLoading] = useState(false);
    const [isFilter, setIsFilter] = useState(false);
    const [recruiterData, setRecruiterData] = useState([]);
    const [newStatusProcess, setNewStatusProcess] = useState("On Hold");
    const [openRemarksPopUp, setOpenRemarksPopUp] = useState(false);
    const [currentCompanyName, setCurrentCompanyName] = useState("");
    const [currentServiceName, setCurrentServiceName] = useState("");
    const [remarksHistory, setRemarksHistory] = useState([]);
    const [changeRemarks, setChangeRemarks] = useState("");
    const [historyRemarks, setHistoryRemarks] = useState([]);
    const [email, setEmail] = useState("");
    const [openEmailPopup, setOpenEmailPopup] = useState(false);
    const [password, setPassword] = useState("");
    const [openPasswordPopup, setOpenPasswordPopup] = useState(false);
    const [selectedIndustry, setSelectedIndustry] = useState("");
    const [sectorOptions, setSectorOptions] = useState([]);
    const [error, setError] = useState("");
    const [openBacdrop, setOpenBacdrop] = useState(false);
    const [completeRmData, setcompleteRmData] = useState([]);
    const [dataToFilter, setdataToFilter] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [filteredData, setFilteredData] = useState([]);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [isScrollLocked, setIsScrollLocked] = useState(false);
    const [currentFilterField, setCurrentFilterField] = useState(null)
    const [activeFilterField, setActiveFilterField] = useState(null);
    const [filterPosition, setFilterPosition] = useState({ top: 10, left: 5 });
    const fieldRefs = useRef({});
    const filterMenuRef = useRef(null); // Ref for the filter menu container
    const [activeFilterFields, setActiveFilterFields] = useState([]); // New state for active filter fields
    const [noOfAvailableData, setnoOfAvailableData] = useState(0)



    function formatDatePro(inputDate) {
        const date = new Date(inputDate);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month}, ${year}`;
    }

    function formatDate(dateString) {
        dateString = "2024-07-26"
        const [year, month, date] = dateString.split('-');
        return `${date}/${month}/${year}`
    }

    useEffect(() => {
        document.title = `Recruiter-Sahay-CRM`;
    }, []);

    useEffect(() => {
        const socket = secretKey === "http://localhost:3001/api" ? io("http://localhost:3001") : io("wss://startupsahay.in", {
            secure: true, // Use HTTPS
            path: '/socket.io',
            reconnection: true,
            transports: ['websocket'],
        });

        socket.on("recruiter-general-status-updated", (res) => {
            fetchData(searchText)
        });
        return () => {
            socket.disconnect();
        };
    }, [newStatusProcess]);

    const fetchData = async (searchQuery = "", page = 1, isFilter = false) => {
        setOpenBacdrop(true);
        try {
            const employeeResponse = await axios.get(`${secretKey}/employee/einfo`);
            const userData = employeeResponse.data.find((item) => item._id === recruiterUserId);
            setEmployeeData(userData);

            let params = { search: searchQuery, page, activeTab: "On Hold" };

            // If filtering is active, extract companyName and serviceName from filteredData
            if (isFilter && filteredData && filteredData.length > 0) {
                console.log("yahan chal rha", isFilter)
                const companyNames = filteredData.map(item => item["Company Name"]).join(',');
                const serviceNames = filteredData.map(item => item.serviceName).join(',');

                // Add filtered company names and service names to the params
                params.companyNames = companyNames;
                params.serviceNames = serviceNames;
            }

            const servicesResponse = await axios.get(`${secretKey}/recruiter/recruiter-data`, {
                params: params
            });

            const { data, totalPages } = servicesResponse.data;
            console.log("data", data)

            if (page === 1) {
                setRecruiterData(data);
                setcompleteRmData(data);
                setdataToFilter(data);
            } else {
                setRecruiterData(prevData => [...prevData, ...data]);
                setcompleteRmData(prevData => [...prevData, ...data]);
                setdataToFilter(prevData => [...prevData, ...data]);
            }

            setTotalPages(totalPages);

        } catch (error) {
            console.error("Error fetching data", error.message);
        } finally {
            setOpenBacdrop(false);
        }
    };

    useEffect(() => {
        fetchData(searchText, page);
    }, [recruiterUserId, secretKey]);

    useEffect(() => {
        fetchData(searchText, page);
    }, [searchText, page]);

    // useEffect(() => {
    //     setRecruiterData([])
    //     setPage(1)
    // }, [activeTab])

    // useEffect(()=>{
    //     fetchData(searchText , page)

    // },[activeFilterField])


    useEffect(() => {
        const handleScroll = debounce(() => {
            const tableContainer = document.querySelector('#processTable');

            if (tableContainer) {
                if (tableContainer.scrollTop + tableContainer.clientHeight >= tableContainer.scrollHeight - 50) {
                    if (page < totalPages) {
                        setPage(prevPage => prevPage + 1); // Load next page
                    }
                }
            }
        }, 200);

        const tableContainer = document.querySelector('#processTable');
        if (tableContainer) {
            tableContainer.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (tableContainer) {
                tableContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, [page, totalPages, filteredData]);





    const refreshData = () => {
        if (filteredData && filteredData.length > 0) {
            fetchData(searchText, 1, true)
        } else {
            fetchData(searchText, page, false);
        }

    };
    function formatDate(dateString) {
        const [year, month, date] = dateString.split('-');
        return `${date}/${month}/${year}`
    }

    const handleCloseBackdrop = () => {
        setOpenBacdrop(false)
    }






    //-------------------filter method-------------------------------

    const handleFilter = (newData) => {
        setFilteredData(newData)
        setRecruiterData(newData.filter(obj => obj.mainCategoryStatus === "On Hold"));
    };

    useEffect(() => {
        if (noOfAvailableData) {
            showingFilterIcon(true)
            totalFilteredData(noOfAvailableData)
        } else {
            showingFilterIcon(false)
            totalFilteredData(0)
        }

    }, [noOfAvailableData, activeTab])

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

        // // Update the active filter fields array
        // setActiveFilterFields(prevFields => {

        //     // Add the field if it's not active
        //     return [...prevFields, field];

        // });
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
    function handleDownload(filename, empFullName) {
        // Remove any spaces in the employee name to match the folder name
        const sanitizedEmpName = empFullName.replace(/\s+/g, '');
        // Construct the URL and open the file in a new tab
        window.open(`${secretKey}/recruiter/uploads/${empFullName}/${filename}`, "_blank");
    }

    console.log("onholddata", recruiterData)

    return (
        <div>
            <div className="RM-my-booking-lists">
                <div className="table table-responsive table-style-3 m-0" id="processTable">
                    {openBacdrop && (
                        <Backdrop
                            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={openBacdrop}
                        >
                            <CircularProgress color="inherit" />
                        </Backdrop>
                    )}
                    {recruiterData.length > 0 ? (
                        <table className="table table-vcenter table-nowrap rm_table">
                            <thead>
                                <tr className="tr-sticky">
                                    <th className="rm-sticky-left-1">
                                        <div className='d-flex align-items-center justify-content-center'>
                                            <div>
                                                Sr.No
                                            </div>
                                        </div>
                                    </th>
                                    <th className="rm-sticky-left-2">
                                        <div className='d-flex align-items-center justify-content-center position-relative'>
                                            <div ref={el => fieldRefs.current['empFullName'] = el}>
                                                Applicant Name
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('empFullName') ? (
                                                    <FaFilter onClick={() => handleFilterClick("empFullName")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("empFullName")} />
                                                )}
                                            </div>

                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'empFullName' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <RecruiterFilter
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"On Hold"}
                                                        data={recruiterData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeRmData}
                                                        showingMenu={setShowFilterMenu}
                                                        dataForFilter={dataToFilter}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center position-relative '>
                                            <div ref={el => fieldRefs.current['personal_number'] = el}>
                                                Contact Number
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('personal_number') ? (
                                                    <FaFilter onClick={() => handleFilterClick("personal_number")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("personal_number")} />
                                                )}
                                            </div>

                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'personal_number' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <RecruiterFilter
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"On Hold"}
                                                        data={recruiterData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeRmData}
                                                        showingMenu={setShowFilterMenu}
                                                        dataForFilter={dataToFilter}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center position-relative'>
                                            <div ref={el => fieldRefs.current['personal_email'] = el}>
                                                Email ID
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('personal_email') ? (
                                                    <FaFilter onClick={() => handleFilterClick("personal_email")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("personal_email")} />
                                                )}
                                            </div>

                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'personal_email' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <RecruiterFilter
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"UnderReview"}
                                                        data={recruiterData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeRmData}
                                                        showingMenu={setShowFilterMenu}
                                                        dataForFilter={dataToFilter}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center position-relative'>
                                            <div ref={el => fieldRefs.current['subCategoryStatus'] = el}>
                                                Status
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('subCategoryStatus') ? (
                                                    <FaFilter onClick={() => handleFilterClick("subCategoryStatus")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("subCategoryStatus")} />
                                                )}
                                            </div>

                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'subCategoryStatus' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <RecruiterFilter
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"On Hold"}
                                                        data={recruiterData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeRmData}
                                                        showingMenu={setShowFilterMenu}
                                                        dataForFilter={dataToFilter}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center position-relative'>
                                            <div ref={el => fieldRefs.current['interViewStatus'] = el}>
                                                Interview Staus
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('interViewStatus') ? (
                                                    <FaFilter onClick={() => handleFilterClick("interViewStatus")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("interViewStatus")} />
                                                )}
                                            </div>

                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'interViewStatus' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <RecruiterFilter
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"On Hold"}
                                                        data={recruiterData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeRmData}
                                                        showingMenu={setShowFilterMenu}
                                                        dataForFilter={dataToFilter}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center position-relative'>
                                            <div ref={el => fieldRefs.current['interViewDate'] = el}>
                                                Interview Date
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('interViewDate') ? (
                                                    <FaFilter onClick={() => handleFilterClick("interViewDate")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("interViewDate")} />
                                                )}
                                            </div>

                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'interViewDate' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <RecruiterFilter
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"On Hold"}
                                                        data={recruiterData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeRmData}
                                                        showingMenu={setShowFilterMenu}
                                                        dataForFilter={dataToFilter}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center position-relative'>
                                            <div ref={el => fieldRefs.current['subCategoryStatus'] = el}>
                                                Remarks
                                            </div>

                                             {/* <div className='RM_filter_icon'>
                                                {isActiveField('Company Email') ? (
                                                    <FaFilter onClick={() => handleFilterClick("Company Email")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("Company Email")} />
                                                )}
                                            </div> */}
                                            {/* ---------------------filter component--------------------------- */}
                                            {/* {showFilterMenu && activeFilterField === 'Company Email' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableTable
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"General"}
                                                        data={recruiterData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeRmData}
                                                        showingMenu={setShowFilterMenu}
                                                        dataForFilter={dataToFilter}
                                                    />
                                                </div>
                                            )} */}
                                        </div>
                                    </th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center position-relative'>
                                            <div ref={el => fieldRefs.current['appliedFor'] = el}>
                                                Applied For
                                            </div >

                                            <div className='RM_filter_icon'>
                                                {isActiveField('appliedFor') ? (
                                                    <FaFilter onClick={() => handleFilterClick("appliedFor")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("appliedFor")} />
                                                )}
                                            </div>

                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'appliedFor' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <RecruiterFilter
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"On Hold"}
                                                        data={recruiterData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeRmData}
                                                        showingMenu={setShowFilterMenu}
                                                        dataForFilter={dataToFilter}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center position-relative'>
                                            <div ref={el => fieldRefs.current['qualification'] = el}>
                                                Qualification
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('qualification') ? (
                                                    <FaFilter onClick={() => handleFilterClick("qualification")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("qualification")} />
                                                )}
                                            </div>

                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'qualification' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <RecruiterFilter
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"On Hold"}
                                                        data={recruiterData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeRmData}
                                                        showingMenu={setShowFilterMenu}
                                                        dataForFilter={dataToFilter}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center position-relative'>
                                            <div ref={el => fieldRefs.current['experience'] = el}>
                                                Experience
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('experience') ? (
                                                    <FaFilter onClick={() => handleFilterClick("experience")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("experience")} />
                                                )}
                                            </div>

                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'experience' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <RecruiterFilter
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"On Hold"}
                                                        data={recruiterData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeRmData}
                                                        showingMenu={setShowFilterMenu}
                                                        dataForFilter={dataToFilter}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                    {/* <th>Remark</th> */}
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center position-relative'>
                                            <div ref={el => fieldRefs.current['currentCTC'] = el}>
                                                Current CTC
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('currentCTC') ? (
                                                    <FaFilter onClick={() => handleFilterClick("currentCTC")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("currentCTC")} />
                                                )}
                                            </div>

                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'currentCTC' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <RecruiterFilter
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"On Hold"}
                                                        data={recruiterData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeRmData}
                                                        showingMenu={setShowFilterMenu}
                                                        dataForFilter={dataToFilter}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center position-relative'>
                                            <div ref={el => fieldRefs.current['expectedCTC'] = el}>
                                                Expected CTC
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('expectedCTC') ? (
                                                    <FaFilter onClick={() => handleFilterClick("expectedCTC")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("expectedCTC")} />
                                                )}
                                            </div>

                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'expectedCTC' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <RecruiterFilter
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"On Hold"}
                                                        data={recruiterData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeRmData}
                                                        showingMenu={setShowFilterMenu}
                                                        dataForFilter={dataToFilter}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center position-relative'>
                                            <div ref={el => fieldRefs.current['applicationSource'] = el}>
                                                Application Source
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('applicationSource') ? (
                                                    <FaFilter onClick={() => handleFilterClick("applicationSource")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("applicationSource")} />
                                                )}
                                            </div>

                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'applicationSource' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <RecruiterFilter
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"On Hold"}
                                                        data={recruiterData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeRmData}
                                                        showingMenu={setShowFilterMenu}
                                                        dataForFilter={dataToFilter}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center position-relative'>
                                            <div ref={el => fieldRefs.current['fillingDate'] = el}>
                                                Application Date
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('fillingDate') ? (
                                                    <FaFilter onClick={() => handleFilterClick("fillingDate")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("fillingDate")} />
                                                )}
                                            </div>
                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'fillingDate' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <RecruiterFilter
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"On Hold"}
                                                        data={recruiterData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeRmData}
                                                        showingMenu={setShowFilterMenu}
                                                        dataForFilter={dataToFilter}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                    <th>
                                        Call History
                                    </th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center position-relative'>
                                            <div ref={el => fieldRefs.current['uploadedCv'] = el}>
                                                Resume Attached
                                            </div>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {recruiterData && recruiterData.length !== 0 && recruiterData.map((obj, index) => (
                                    <tr key={index}>
                                        <td className="rm-sticky-left-1"><div className="rm_sr_no">{index + 1}</div></td>
                                        <td className='rm-sticky-left-2'>{obj.empFullName}</td>
                                        <td>
                                            <div className="d-flex align-items-center justify-content-center wApp">
                                                <div>{obj.personal_number}</div>
                                                <a
                                                    href={`https://wa.me/${obj.personal_number}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ marginLeft: '10px', lineHeight: '14px', fontSize: '14px' }}>
                                                    <FaWhatsapp />
                                                </a>
                                            </div></td>
                                        <td>
                                            {obj.personal_email}
                                        </td>
                                        <td>
                                            <div>
                                                {obj.mainCategoryStatus && obj.subCategoryStatus && (
                                                    <RecruiterStatusDropdown
                                                        key={`${obj.empFullName}-${obj.personal_email}-${obj.mainCategoryStatus}-${obj.subCategoryStatus}`} // Unique key
                                                        mainStatus={obj.mainCategoryStatus}
                                                        subStatus={obj.subCategoryStatus}
                                                        setNewSubStatus={setNewStatusProcess}
                                                        empName={obj.empFullName}
                                                        empEmail={obj.personal_email}
                                                        refreshData={refreshData}
                                                    />
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <RecruiterInterviewStatus
                                                key={`${obj.empFullName}-${obj.personal_email}-${obj.mainCategoryStatus}-${obj.subCategoryStatus}`} // Unique key
                                                mainStatus={obj.mainCategoryStatus}
                                                subStatus={obj.subCategoryStatus}
                                                setNewSubStatus={setNewStatusProcess}
                                                empName={obj.empFullName}
                                                empEmail={obj.personal_email}
                                                refreshData={refreshData}
                                                interViewStatus={obj.interViewStatus ? obj.interViewStatus : "Not Started"}
                                            />
                                        </td>
                                        <td>{obj.interViewDate ? formatDatePro(obj.interViewDate) : "Not Confirmed Yet"}</td>
                                        <td>
                                            <RecruiterRemarks
                                                key={`${obj.empFullName}-${obj.personal_email}-${obj.mainCategoryStatus}-${obj.subCategoryStatus}`} // Unique key
                                                mainStatus={obj.mainCategoryStatus}
                                                subStatus={obj.subCategoryStatus}
                                                setNewSubStatus={setNewStatusProcess}
                                                empName={obj.empFullName}
                                                empEmail={obj.personal_email}
                                                refreshData={refreshData}
                                                historyRemarks={obj.Remarks}
                                            />
                                        </td>
                                        <td>
                                            {obj.appliedFor}
                                        </td>

                                        <td>{obj.qualification}</td>
                                        <td>
                                            {obj.experience}
                                        </td>
                                        <td>
                                            {obj.currentCTC}
                                        </td>
                                        <td>
                                            {obj.expectedCTC}
                                        </td>
                                        <td>{obj.applicationSource}</td>
                                        <td>{formatDatePro(obj.fillingDate)}</td>
                                        <td><RecruiterCallHistory
                                            key={`${obj.empFullName}-${obj.personal_email}-${obj.mainCategoryStatus}-${obj.subCategoryStatus}`} // Unique key
                                            mainStatus={obj.mainCategoryStatus}
                                            subStatus={obj.subCategoryStatus}
                                            setNewSubStatus={setNewStatusProcess}
                                            empName={obj.empFullName}
                                            empEmail={obj.personal_email}
                                            refreshData={refreshData}
                                            clientNumber={obj.personal_number}

                                        /></td>
                                        <td>
                                            {obj.uploadedCV && obj.uploadedCV.length > 0 ? (
                                                <div onClick={() => handleDownload(obj.uploadedCV[0].filename, obj.empFullName)}>
                                                    <AiFillFilePdf size={20} style={{ color: "#ff0000" }} />
                                                </div>
                                            ) : (
                                                "No Resume"
                                            )}
                                        </td>


                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        !openBacdrop && (
                            <table className="no_data_table">
                                <div className="no_data_table_inner">
                                    <Nodata />
                                </div>
                            </table>
                        )
                    )}
                </div>
            </div>
            
        </div>
    );
}

export default RecruiterOnHold;
