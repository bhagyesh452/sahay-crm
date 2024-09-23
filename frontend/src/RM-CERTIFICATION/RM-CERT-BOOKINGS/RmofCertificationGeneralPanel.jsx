import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaWhatsapp } from "react-icons/fa";
import StatusDropdown from "../Extra-Components/status-dropdown";
import { FaRegEye } from "react-icons/fa";
import { CiUndo } from "react-icons/ci";
import axios from 'axios';
import { Drawer, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import debounce from "lodash/debounce";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import Nodata from '../../components/Nodata';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import io from 'socket.io-client';
import { BsFilter } from "react-icons/bs";
import FilterableTable from '../Extra-Components/FilterableTable.jsx';
import { FaFilter } from "react-icons/fa";

//import FilterableTable from '../Extra-Components/FilterableTable';

function RmofCertificationGeneralPanel({ searchText, showFilter, activeTab, totalFilteredData, showingFilterIcon,completeEmployeeInfo }) {
    const rmCertificationUserId = localStorage.getItem("rmCertificationUserId");
    const [employeeData, setEmployeeData] = useState([]);
    const [rmServicesData, setRmServicesData] = useState([]);
    const [newStatus, setNewStatus] = useState("Untouched");
    const [openRemarksPopUp, setOpenRemarksPopUp] = useState(false);
    const [currentCompanyName, setCurrentCompanyName] = useState("");
    const [currentServiceName, setCurrentServiceName] = useState("");
    const [remarksHistory, setRemarksHistory] = useState([]);
    const [changeRemarks, setChangeRemarks] = useState("");
    const [openBacdrop, setOpenBacdrop] = useState(false);
    const [newStatusProcess, setNewStatusProcess] = useState("General")
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [completeRmData, setcompleteRmData] = useState([])
    const [dataToFilter, setdataToFilter] = useState([])
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isScrollLocked, setIsScrollLocked] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [activeFilterFields, setActiveFilterFields] = useState([]); // New state for active filter fields
    const [error, setError] = useState('');
    const [noOfAvailableData, setnoOfAvailableData] = useState(0);
    const [filterField, setFilterField] = useState("")
    const [activeFilterField, setActiveFilterField] = useState(null);
    const [filterPosition, setFilterPosition] = useState({ top: 10, left: 5 });
    const fieldRefs = useRef({});
    const filterMenuRef = useRef(null); // Ref for the filter menu container
    







    // Fetch Data Function

    // const fetchData = async (searchQuery = "", page = 1, activeTab = "General") => {
    //     setOpenBacdrop(true);
    //     try {

    //         const employeeResponse = await axios.get(`${secretKey}/employee/einfo`);
    //         const userData = employeeResponse.data.find((item) => item._id === rmCertificationUserId);
    //         setEmployeeData(userData);

    //         const servicesResponse = await axios.get(`${secretKey}/rm-services/rm-sevicesgetrequest`, {
    //             params: { search: searchQuery, page, activeTab: activeTab }
    //         });
    //         const { data, totalPages } = servicesResponse.data;
    //         console.log("response", servicesResponse.data)

    //         // If it's a search query, replace the data; otherwise, append for pagination
    //         if (page === 1) {
    //             // This is either the first page load or a search operation
    //             setRmServicesData(data);
    //             setcompleteRmData(data);
    //             setdataToFilter(data);
    //         } else {
    //             // This is a pagination request
    //             setRmServicesData(prevData => [...prevData, ...data]);
    //             setcompleteRmData(prevData => [...prevData, ...data]);
    //             setdataToFilter(prevData => [...prevData, ...data])
    //         }
    //         setTotalPages(totalPages)

    //     } catch (error) {
    //         console.error("Error fetching data", error.message);
    //     } finally {
    //         setOpenBacdrop(false);
    //     }
    // };

    const fetchData = async (searchQuery = "", page = 1, isFilter = false) => {
        setOpenBacdrop(true);
        try {
            const employeeResponse = await axios.get(`${secretKey}/employee/einfo`);
            const userData = employeeResponse.data.find((item) => item._id === rmCertificationUserId);
           
            setEmployeeData(userData);

            let params = { search: searchQuery, page, activeTab: "General" };

            // If filtering is active, extract companyName and serviceName from filteredData
            if (isFilter && filteredData && filteredData.length > 0) {
                //console.log("yahan chal rha", isFilter)
                const companyNames = filteredData.map(item => item["Company Name"]).join(',');
                const serviceNames = filteredData.map(item => item.serviceName).join(',');

                // Add filtered company names and service names to the params
                params.companyNames = companyNames;
                params.serviceNames = serviceNames;
            }

            const servicesResponse = await axios.get(`${secretKey}/rm-services/rm-sevicesgetrequest`, {
                params: params
            });

            const { data, totalPages } = servicesResponse.data;


            if (page === 1) {
                setRmServicesData(data);
                setcompleteRmData(data);
                setdataToFilter(data);
            } else {
                setRmServicesData(prevData => [...prevData, ...data]);
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
   

    // useEffect(() => {
    //     const handleScroll = debounce(() => {
    //         const tableContainer = document.querySelector('#generalTable');
    //         if (tableContainer.scrollTop + tableContainer.clientHeight >= tableContainer.scrollHeight - 50) {
    //             if (page < totalPages) {
    //                 setPage(prevPage => prevPage + 1); // Load next page
    //             }
    //         }
    //     }, 200);
    //     const tableContainer = document.querySelector('#generalTable');
    //     if (tableContainer) {
    //         tableContainer.addEventListener('scroll', handleScroll);
    //       }
    //     return () => tableContainer.removeEventListener('scroll', handleScroll);
    // }, [page, totalPages, filteredData]);


    useEffect(() => {
        fetchData(searchText, page);
    }, [searchText, page]);


    useEffect(() => {
        const socket = secretKey === "http://localhost:3001/api" ? io("http://localhost:3001") : io("wss://startupsahay.in", {
            secure: true, // Use HTTPS
            path: '/socket.io',
            reconnection: true,
            transports: ['websocket'],
        });
        const updateDocumentInState = (updatedDocument) => {
            //console.log(updatedDocument)
            setRmServicesData(prevData => prevData.map(item =>
                item._id === updatedDocument._id ? updatedDocument : item
            ));
            setcompleteRmData(prevData => prevData.map(item =>
                item._id === updatedDocument._id ? updatedDocument : item
            ));
            setdataToFilter(prevData => prevData.map(item =>
                item._id === updatedDocument._id ? updatedDocument : item
            ));
        };
        socket.on("rm-general-status-updated", (res) => {
            fetchData(searchText)
        });

        socket.on("rm-recievedamount-updated", (res) => {
            fetchData(searchText)
        });

        socket.on("rm-recievedamount-deleted", (res) => {
            fetchData(searchText)
        });

        socket.on("booking-deleted", (res) => {
            fetchData(searchText)
        });

        socket.on("booking-updated", (res) => {
            fetchData(searchText)
        });
        socket.on("lead-updated-by-admin", (res) => {
            //console.log("res" , res)
            if (res.updatedDocument) {
                console.log("res", res)
                updateDocumentInState(res.updatedDocument);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [newStatus]);


    const refreshData = () => {
        if (filteredData && filteredData.length > 0) {
            fetchData(searchText, 1, true)
        } else {
            fetchData(searchText, page, false);
        }
    };

    // useEffect to fetch data on component mount
    useEffect(() => {
        fetchData(searchText);
    }, [rmCertificationUserId, secretKey]);

    const formatDatePro = (inputDate) => {
        const date = new Date(inputDate);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month}, ${year}`;
    };

    const formatDate = (dateString) => {
        const [year, month, date] = dateString.split('-');
        return `${date}/${month}/${year}`;
    };

    // Remarks Popup Section
    const handleOpenRemarksPopup = async (companyName, serviceName) => {
        setCurrentCompanyName(companyName);
        setCurrentServiceName(serviceName);
        setOpenRemarksPopUp(true);

        try {
            const response = await axios.get(`${secretKey}/rm-services/get-remarks`, {
                params: { companyName, serviceName }
            });
            setRemarksHistory(response.data);
        } catch (error) {
            console.error("Error fetching remarks", error.message);
        }
    };

    const functionCloseRemarksPopup = () => {
        setOpenRemarksPopUp(false);
    };

    const debouncedSetChangeRemarks = useCallback(
        debounce((value) => {
            setChangeRemarks(value);
        }, 300),
        []
    );

    const handleSubmitRemarks = async () => {
        //console.log("changeremarks", changeRemarks)
        try {
            if (changeRemarks) {
                const response = await axios.post(`${secretKey}/rm-services/post-remarks-for-rmofcertification`, {
                    currentCompanyName,
                    currentServiceName,
                    changeRemarks,
                    updatedOn: new Date()
                });

                //console.log("response", response.data);

                if (response.status === 200) {
                    if (filteredData && filteredData.length > 0) {
                        fetchData(searchText, page, true);
                    } else {
                        fetchData(searchText, page, false);
                    }
                    functionCloseRemarksPopup();
                    // Swal.fire(
                    //     'Remarks Added!',
                    //     'The remarks have been successfully added.',
                    //     'success'
                    // );
                }
            } else {
                setError('Remarks Cannot Be Empty!')
            }

        } catch (error) {
            console.log("Error Submitting Remarks", error.message);
        }
    };

    const handleDeleteRemarks = async (remarks_id) => {
        try {
            const response = await axios.delete(`${secretKey}/rm-services/delete-remark-rmcert`, {
                data: { remarks_id, companyName: currentCompanyName, serviceName: currentServiceName }
            });
            if (response.status === 200) {
                if (filteredData && filteredData.length > 0) {
                    fetchData(searchText, page, true);
                } else {
                    fetchData(searchText, page, false);
                }

                functionCloseRemarksPopup();
            }
            // Refresh the list
        } catch (error) {
            console.error("Error deleting remark:", error);
        }
    };

    // ------------------------------------------------function to send service back to recieved box --------------------------------

    const handleRevokeCompanyToRecievedBox = async (companyName, serviceName) => {
        try {
            // Show confirmation dialog
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to revert the company back to the received box?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, revert it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            });

            // Check if the user confirmed the action
            if (result.isConfirmed) {
                const response = await axios.post(`${secretKey}/rm-services/delete_company_from_taskmanager_and_send_to_recievedbox`, {
                    companyName,
                    serviceName
                });

                if (response.status === 200) {
                    fetchData(searchText);
                    Swal.fire(
                        'Company Reverted Back!',
                        'Company has been sent back to the received box.',
                        'success'
                    );
                } else {
                    Swal.fire(
                        'Error',
                        'Failed to revert the company back to the received box.',
                        'error'
                    );
                }
            } else {
                Swal.fire(
                    'Cancelled',
                    'The company has not been reverted.',
                    'info'
                );
            }

        } catch (error) {
            console.log("Error Deleting Company from task manager", error.message);
            Swal.fire(
                'Error',
                'An error occurred while processing your request.',
                'error'
            );
        }
    };

    //-------------------filter method-------------------------------

    const handleFilter = (newData) => {
        setFilteredData(newData)
        setRmServicesData(newData.filter(obj => obj.mainCategoryStatus === "General"));

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


    //console.log("noofavaibaledatageneral" , noOfAvailableData)
    //console.log("rmservicesdatageneral" , rmServicesData)

    return (
        <div>
            <div className="RM-my-booking-lists">
                <div className="table table-responsive table-style-3 m-0" id="generalTable">
                    {openBacdrop && (
                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={openBacdrop}
                        >
                            <CircularProgress color="inherit" />
                        </Backdrop>
                    )}
                    {rmServicesData.length > 0 ? (
                        <table className="table table-vcenter table-nowrap rm_table">
                            <thead>
                                <tr className="tr-sticky">
                                    <th className="G_rm-sticky-left-1">
                                        <div className='d-flex align-items-center justify-content-center'>
                                            <div>
                                                Sr.No
                                            </div>
                                        </div>
                                    </th>
                                    <th className="G_rm-sticky-left-2">
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
                                                        filteredData={filteredData}
                                                        activeTab={"General"}
                                                        data={rmServicesData}
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
                                    <th className="G_rm-sticky-left-3">
                                        <div className='d-flex align-items-center justify-content-center position-relative '>
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
                                                        filteredData={filteredData}
                                                        activeTab={"General"}
                                                        data={rmServicesData}
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
                                            {showFilterMenu && activeFilterField === "Company Number" && (
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
                                                        data={rmServicesData}
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
                                                        filteredData={filteredData}
                                                        activeTab={"General"}
                                                        data={rmServicesData}
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
                                            <div ref={el => fieldRefs.current['caNumber'] = el}>
                                                CA Number
                                            </div >

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
                                                        filteredData={filteredData}
                                                        activeTab={"General"}
                                                        data={rmServicesData}
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
                                            <div ref={el => fieldRefs.current['serviceName'] = el}>
                                                Service Name
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('serviceName') ? (
                                                    <FaFilter onClick={() => handleFilterClick("servicesName")} />
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
                                                        filteredData={filteredData}
                                                        activeTab={"General"}
                                                        data={rmServicesData}
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
                                                    <FilterableTable
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"General"}
                                                        data={rmServicesData}
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
                                            <div ref={el => fieldRefs.current['withDSC'] = el}>
                                                DSC Applicable
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('withDSC') ? (
                                                    <FaFilter onClick={() => handleFilterClick("withDSC")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("withDSC")} />
                                                )}
                                            </div>
                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'withDSC' && (
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
                                                        data={rmServicesData}
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
                                                        filteredData={filteredData}
                                                        activeTab={"General"}
                                                        data={rmServicesData}
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
                                                        filteredData={filteredData}
                                                        activeTab={"General"}
                                                        data={rmServicesData}
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
                                            <div ref={el => fieldRefs.current['totalPaymentWGST'] = el}>
                                                Total Payment
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
                                                        filteredData={filteredData}
                                                        activeTab={"General"}
                                                        data={rmServicesData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeRmData}
                                                        showingMenu={setShowFilterMenu} dataForFilter={dataToFilter}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center position-relative'>
                                            <div ref={el => fieldRefs.current['receivedPayment'] = el}>
                                                Received Payment
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('receivedPayment') ? (
                                                    <FaFilter onClick={() => handleFilterClick("receivedPayment")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("receivedPayment")} />
                                                )}
                                            </div>
                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'receivedPayment' && (
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
                                                        data={rmServicesData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeRmData}
                                                        showingMenu={setShowFilterMenu} dataForFilter={dataToFilter}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center position-relative'>
                                            <div ref={el => fieldRefs.current['pendingPayment'] = el}>
                                                Pending Payment
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('pendingPayment') ? (
                                                    <FaFilter onClick={() => handleFilterClick("pendingPayment")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("pendingPayment")} />
                                                )}
                                            </div>
                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'pendingPayment' && (
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
                                                        data={rmServicesData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeRmData}
                                                        showingMenu={setShowFilterMenu} dataForFilter={dataToFilter}
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
                            <tbody>
                                {rmServicesData && rmServicesData.length !== 0 && rmServicesData.map((obj, index) => (
                                    <tr key={index}>
                                        <td className="G_rm-sticky-left-1"><div className="rm_sr_no">{index + 1}</div></td>
                                        <td className='G_rm-sticky-left-2'>{formatDatePro(obj.bookingDate)}</td>
                                        <td className="G_rm-sticky-left-3"><b>{obj["Company Name"]}</b></td>
                                        <td>
                                            <div className="d-flex align-items-center justify-content-center wApp">
                                                <div>{obj["Company Number"]}</div>
                                                <a
                                                    href={`https://wa.me/${obj["Company Number"]}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ marginLeft: '10px', lineHeight: '14px', fontSize: '14px' }}>
                                                    <FaWhatsapp />
                                                </a>
                                            </div>
                                        </td>
                                        <td>{obj["Company Email"]}</td>
                                        <td>
                                            <div className="d-flex align-items-center justify-content-center wApp">
                                                <div>{obj.caCase === "Yes" ? obj.caNumber : "Not Applicable"}</div>
                                                {obj.caCase === "Yes" && (
                                                    <a
                                                        href={`https://wa.me/${obj.caNumber}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{ marginLeft: '10px', lineHeight: '14px', fontSize: '14px' }}>
                                                        <FaWhatsapp />
                                                    </a>
                                                )}
                                            </div>
                                        </td>

                                        <td>{obj.serviceName}</td>
                                        <td>
                                            <div>
                                                {obj.mainCategoryStatus && obj.subCategoryStatus && (
                                                    <StatusDropdown
                                                        key={`${obj["Company Name"]}-${obj.serviceName}-${obj.mainCategoryStatus}-${obj.subCategoryStatus}`} // Unique key
                                                        mainStatus={obj.mainCategoryStatus}
                                                        subStatus={obj.subCategoryStatus}
                                                        setNewSubStatus={setNewStatus}
                                                        companyName={obj["Company Name"]}
                                                        serviceName={obj.serviceName}
                                                        refreshData={refreshData}
                                                    />
                                                )}
                                            </div>
                                        </td>
                                        <td>{obj.withDSC ? "Yes" : "No"}</td>
                                        <td>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <div>
                                                    {obj.bdeName}
                                                    {
                                                        completeEmployeeInfo
                                                            .filter((employee) => employee.ename === obj.bdeName)
                                                            .map((employee) => (
                                                                <a
                                                                    key={employee.number} // Add a unique key for rendering a list
                                                                    href={`https://wa.me/${employee.number}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    style={{ marginLeft: '10px', lineHeight: '14px', fontSize: '14px' }}
                                                                >
                                                                    <FaWhatsapp />
                                                                </a>
                                                            ))
                                                    }
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center justify-content-center">

                                                <div>
                                                    {obj.bdmName}
                                                {
                                                        completeEmployeeInfo
                                                            .filter((employee) => employee.ename === obj.bdmName)
                                                            .map((employee) => (
                                                                <a
                                                                    key={employee.number} // Add a unique key for rendering a list
                                                                    href={`https://wa.me/${employee.number}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    style={{ marginLeft: '10px', lineHeight: '14px', fontSize: '14px' }}
                                                                >
                                                                    <FaWhatsapp />
                                                                </a>
                                                            ))
                                                    }
                                                </div>
                                            </div>
                                        </td>
                                        <td>₹ {parseInt(obj.totalPaymentWGST || 0, 10).toLocaleString('en-IN')}</td>
                                        <td>
                                            ₹ {(
                                                (parseInt(
                                                    (obj.paymentTerms === 'Full Advanced' ? obj.totalPaymentWGST : obj.firstPayment) || 0,
                                                    10
                                                ) + parseInt(obj.pendingRecievedPayment || 0, 10))
                                                    .toLocaleString('en-IN')
                                            )}
                                        </td>
                                        <td>
                                            ₹ {(
                                                (parseInt(obj.totalPaymentWGST || 0, 10) -
                                                    (parseInt(
                                                        (obj.paymentTerms === 'Full Advanced' ? obj.totalPaymentWGST : obj.firstPayment) || 0,
                                                        10
                                                    ) + parseInt(obj.pendingRecievedPayment || 0, 10)))
                                            ).toLocaleString('en-IN')}
                                        </td>
                                        <td className="rm-sticky-action">
                                            <button className="action-btn action-btn-primary"
                                            //onClick={() => setOpenCompanyTaskComponent(true)}
                                            >
                                                <FaRegEye />
                                            </button>
                                            <button className="action-btn action-btn-danger ml-1"
                                                onClick={() => (
                                                    handleRevokeCompanyToRecievedBox(
                                                        obj["Company Name"],
                                                        obj.serviceName
                                                    )
                                                )}
                                            >
                                                <CiUndo />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (!openBacdrop && (
                        <table className='no_data_table'>
                            <div className='no_data_table_inner'>
                                <Nodata />
                            </div>
                        </table>
                    )
                    )}
                </div>
            </div>
            {/* ------------------------------------remarks popup-------------------------------------------------------------------- */}
            <Dialog
                open={openRemarksPopUp}
                onClose={functionCloseRemarksPopup}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>
                    Remarks History
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={functionCloseRemarksPopup}
                        aria-label="close"
                        sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <div>
                        <h5>Company Name: {currentCompanyName}</h5>
                        <h5>Service Name: {currentServiceName}</h5>
                        {remarksHistory.length > 0 ? (
                            <ul>
                                {remarksHistory.map((remark, index) => (
                                    <li key={index}>
                                        <b>{formatDate(remark.updatedOn)}:</b> {remark.remarks}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No remarks found for this company and service.</p>
                        )}
                        <textarea
                            rows="4"
                            cols="50"
                            placeholder="Add your remarks here..."
                            onChange={(e) => debouncedSetChangeRemarks(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmitRemarks}
                            style={{ marginTop: '10px' }}
                        >
                            Submit Remarks
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ---------------------filter component---------------------------
            {showFilterMenu && (
                <div
                    className="filter-menu"
                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                >
                    <FilterableTable
                        data={rmServicesData}
                        filterField={filterField}
                        onFilter={handleFilter}
                        completeData={completeRmData}
                        showingMenu={setShowFilterMenu}dataForFilter={dataToFilter}
                    />
                </div>
            )} */}
        </div>
    );
}

export default RmofCertificationGeneralPanel;
