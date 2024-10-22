import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaWhatsapp } from "react-icons/fa";
import StatusDropdown from "../Extra-Components/status-dropdown";
import DscStatusDropdown from "../Extra-Components/dsc-status-dropdown";
import ContentWriterDropdown from '../Extra-Components/ContentWriterDropdown';
import { FaRegEye } from "react-icons/fa";
import axios from 'axios';
import io from 'socket.io-client';
import { Drawer, Icon, IconButton } from "@mui/material";
import { FaPencilAlt } from "react-icons/fa";
import { Button, Dialog, DialogContent, DialogTitle, FormHelperText } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import debounce from "lodash/debounce";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentStatusDropdown from '../Extra-Components/ContentStatusDropdown';
import NSWSEmailInput from '../Extra-Components/NSWSEmailInput';
import { VscSaveAs } from "react-icons/vsc";
import NSWSPasswordInput from '../Extra-Components/NSWSPasswordInput';
import WebsiteLink from '../Extra-Components/WebsiteLink';
import IndustryDropdown from '../Extra-Components/Industry-Dropdown';
import SectorDropdown from '../Extra-Components/SectorDropdown';
import BrochureStatusDropdown from '../Extra-Components/BrochureStatusDropdown';
import BrochureDesignerDropdown from '../Extra-Components/BrochureDesignerDrodown';
import Nodata from '../../components/Nodata';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
//import FilterableTable from '../Extra-Components/FilterableTable';
import { BsFilter } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";
import FilterableTable from '../Extra-Components/FilterableTable';
import NSWSMobileNo from '../Extra-Components/NSWSMobileNo';
import OtpVerificationStatus from '../Extra-Components/OtpVerificationStatus';
import DscLetterStatusAdHead from '../Extra-Components/DscLetterStatusAdHead';
import RMRemarksDialog from '../Extra-Components/RMRemarksDialog';


function RmofCertificationReadyToSubmitPanel({
    searchText,
    showFilter,
    activeTab,
    totalFilteredData,
    showingFilterIcon,
    completeEmployeeInfo
}) {

    const rmCertificationUserId = localStorage.getItem("rmCertificationUserId")
    const [employeeData, setEmployeeData] = useState([])
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [currentDataLoading, setCurrentDataLoading] = useState(false)
    const [isFilter, setIsFilter] = useState(false)
    const [rmServicesData, setRmServicesData] = useState([])
    const [newStatusProcess, setNewStatusProcess] = useState("Ready To Submit")
    const [openRemarksPopUp, setOpenRemarksPopUp] = useState(false);
    const [currentCompanyName, setCurrentCompanyName] = useState("")
    const [currentServiceName, setCurrentServiceName] = useState("")
    const [remarksHistory, setRemarksHistory] = useState([])
    const [changeRemarks, setChangeRemarks] = useState("");
    const [historyRemarks, setHistoryRemarks] = useState([]);
    const [email, setEmail] = useState('');
    const [openEmailPopup, setOpenEmailPopup] = useState(false);
    const [password, setPassword] = useState('');
    const [openPasswordPopup, setOpenPasswordPopup] = useState(false);
    const [selectedIndustry, setSelectedIndustry] = useState("");
    const [sectorOptions, setSectorOptions] = useState([]);
    const [error, setError] = useState('')
    const [openBacdrop, setOpenBacdrop] = useState(false);
    const [completeRmData, setcompleteRmData] = useState([])
    const [dataToFilter, setdataToFilter] = useState([]);
    const [activeFilterFields, setActiveFilterFields] = useState([]); // New state for active filter fields
    const [isScrollLocked, setIsScrollLocked] = useState(false);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [filteredData, setFilteredData] = useState(rmServicesData);
    const [filterField, setFilterField] = useState("")
    const filterMenuRef = useRef(null); // Ref for the filter menu container
    const [activeFilterField, setActiveFilterField] = useState(null);
    const [filterPosition, setFilterPosition] = useState({ top: 10, left: 5 });
    const fieldRefs = useRef({});
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
        document.title = `AdminHead-Sahay-CRM`;
    }, []);

    useEffect(() => {
        const socket = secretKey === "http://localhost:3001/api" ? io("http://localhost:3001") : io("wss://startupsahay.in", {
            secure: true, // Use HTTPS
            path: '/socket.io',
            reconnection: true,
            transports: ['websocket'],
        });

        socket.on("rm-general-status-updated", (res) => {
            fetchData(searchText)
        });

        socket.on("rm-industry-enabled", (res) => {
            if (filteredData && filteredData.length > 0) {
                fetchData(searchText, 1, true)
            } else {
                fetchData(searchText, page, false)
            }
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
        const updateDocumentInState = (updatedDocument) => {
            console.log(updatedDocument)
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
        socket.on("adminexecutive-general-status-updated", (res) => {
            //console.log("res" , res)
            if (res.updatedDocument) {
                updateDocumentInState(res.updatedDocument);
            }
        });
        socket.on("adminexecutive-letter-updated", (res) => {
            //console.log("res" , res)
            if (res.updatedDocument) {
                updateDocumentInState(res.updatedDocument);
            }
        });
        socket.on("lead-updated-by-admin", (res) => {
            //console.log("res" , res)
            if (res.updatedDocument) {
                updateDocumentInState(res.updatedDocument);
            }
        });
        return () => {
            socket.disconnect();
        };
    }, [newStatusProcess]);


    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    // Fetch Data Function

    // const fetchData = async (searchQuery = "", page = 1) => {
    //     setOpenBacdrop(true);
    //     try {

    //         const employeeResponse = await axios.get(`${secretKey}/employee/einfo`);
    //         const userData = employeeResponse.data.find((item) => item._id === rmCertificationUserId);
    //         setEmployeeData(userData);

    //         const servicesResponse = await axios.get(`${secretKey}/rm-services/rm-sevicesgetrequest`, {
    //             params: { search: searchQuery, page, activeTab: "Ready To Submit" }
    //         });
    //         const { data, totalPages } = servicesResponse.data;
    //         console.log("response", servicesResponse.data)

    //         // If it's a search query, replace the data; otherwise, append for pagination
    //         if (page === 1) {
    //             // This is either the first page load or a search operation
    //             setRmServicesData(data);
    //         } else {
    //             // This is a pagination request
    //             setRmServicesData(prevData => [...prevData, ...data]);
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

            let params = { search: searchQuery, page, activeTab: "Ready To Submit" };

            // If filtering is active, extract companyName and serviceName from filteredData
            if (isFilter && filteredData && filteredData.length > 0) {
                console.log("yahan chal rha", isFilter)
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
            console.log("data", data)
            console.log("response", servicesResponse)

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


    useEffect(() => {
        const tableContainer = document.querySelector('#readyToSubmitTable');

        const handleScroll = debounce(() => {
            if (tableContainer.scrollTop + tableContainer.clientHeight >= tableContainer.scrollHeight - 50) {
                if (page < totalPages) {
                    setPage(prevPage => prevPage + 1); // Load next page
                }
            }
        }, 200);

        tableContainer.addEventListener('scroll', handleScroll);
        return () => tableContainer.removeEventListener('scroll', handleScroll);
    }, [page, totalPages, filteredData]);

    useEffect(() => {
        fetchData(searchText, page);
    }, [searchText, page]);


    useEffect(() => {
        fetchData(searchText);
    }, [rmCertificationUserId, secretKey]);


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

    // //------------------------Remarks Popup Section-----------------------------
    // const handleOpenRemarksPopup = async (companyName, serviceName) => {
    //     console.log("RemarksPopup")
    // }
    // const functionCloseRemarksPopup = () => {
    //     setChangeRemarks('')
    //     setError('')
    //     setOpenRemarksPopUp(false)
    // }
    // const debouncedSetChangeRemarks = useCallback(
    //     debounce((value) => {
    //         setChangeRemarks(value);
    //     }, 300), // Adjust the debounce delay as needed (e.g., 300 milliseconds)
    //     [] // Empty dependency array to ensure the function is memoized
    // );

    // const handleSubmitRemarks = async () => {
    //     console.log("changeremarks", changeRemarks)
    //     try {
    //         if (changeRemarks) {
    //             const response = await axios.post(`${secretKey}/rm-services/post-remarks-for-rmofcertification`, {
    //                 currentCompanyName,
    //                 currentServiceName,
    //                 changeRemarks,
    //                 updatedOn: new Date()
    //             });

    //             //console.log("response", response.data);

    //             if (response.status === 200) {
    //                 if (filteredData && filteredData.length > 0) {
    //                     fetchData(searchText, page, true);
    //                 } else {
    //                     console.log("yahan chal yr")
    //                     fetchData(searchText, page, false);
    //                 }
    //                 functionCloseRemarksPopup();
    //             }
    //         } else {
    //             setError('Remarks Cannot Be Empty!')
    //         }

    //     } catch (error) {
    //         console.log("Error Submitting Remarks", error.message);
    //     }
    // };

    // const handleDeleteRemarks = async (remarks_id) => {
    //     try {
    //         const response = await axios.delete(`${secretKey}/rm-services/delete-remark-rmcert`, {
    //             data: { remarks_id, companyName: currentCompanyName, serviceName: currentServiceName }
    //         });
    //         if (response.status === 200) {
    //             if (filteredData && filteredData.length > 0) {
    //                 fetchData(searchText, page, true);
    //             } else {
    //                 fetchData(searchText, page, false);
    //             }

    //             functionCloseRemarksPopup();
    //         }
    //         // Refresh the list
    //     } catch (error) {
    //         console.error("Error deleting remark:", error);
    //     }
    // };



    //--------------------function for industry change--------------------------

    const handleIndustryChange = (industry, options) => {
        setSelectedIndustry(industry);
        setSectorOptions(options);
    };

    const handleCloseBackdrop = () => {
        setOpenBacdrop(false)
    }

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

    // ------------filter functions----------------------------

    // useEffect(() => {
    //     setShowFilterMenu(showFilter);
    // }, [showFilter]);

    const handleFilter = (newData) => {
        console.log("newData", newData)
        setFilteredData(newData)
        setRmServicesData(newData.filter(obj => obj.mainCategoryStatus === "Ready To Submit"));
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
    }, []);



    return (
        <div>
            <div className="RM-my-booking-lists">
                <div className="table table-responsive table-style-3 m-0" id="readyToSubmitTable">
                    {openBacdrop && (
                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={openBacdrop}
                        >
                            <CircularProgress color="inherit" />
                        </Backdrop>
                    )}
                    {rmServicesData.length > 0 ? (
                        <table className="table table-vcenter table-nowrap rm_table_inprocess">
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
                                                        filteredData={filteredData}
                                                        activeTab={"Ready To Submit"}
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
                                        <div className='d-flex align-items-center justify-content-center position-relative '>
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
                                                        activeTab={"Ready To Submit"}
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
                                                        activeTab={"Ready To Submit"}
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
                                                        activeTab={"Ready To Submit"}
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
                                                        activeTab={"Ready To Submit"}
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
                                                        activeTab={"Ready To Submit"}
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
                                    <th>Remark</th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center position-relative'>
                                            <div ref={el => fieldRefs.current['websiteLink'] = el}>
                                                Website Link/Brief
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('websiteLink') ? (
                                                    <FaFilter onClick={() => handleFilterClick("websiteLink")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("websiteLink")} />
                                                )}
                                            </div>
                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'websiteLink' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableTable
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"Ready To Submit"}
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
                                                        activeTab={"Ready To Submit"}
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
                                            <div ref={el => fieldRefs.current['letterStatus'] = el}>
                                                Letter Status
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('letterStatus') ? (
                                                    <FaFilter onClick={() => handleFilterClick("letterStatus")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("letterStatus")} />
                                                )}
                                            </div>
                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'letterStatus' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableTable
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"Ready To Submit"}
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
                                            <div ref={el => fieldRefs.current['dscStatus'] = el}>
                                                DSC Status
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('dscStatus') ? (
                                                    <FaFilter onClick={() => handleFilterClick("dscStatus")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("dscStatus")} />
                                                )}
                                            </div>
                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'dscStatus' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableTable
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"Ready To Submit"}
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
                                            <div ref={el => fieldRefs.current['contentWriter'] = el}>
                                                Content Writer
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('contentWriter') ? (
                                                    <FaFilter onClick={() => handleFilterClick("contentWriter")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("contentWriter")} />
                                                )}
                                            </div>
                                            {showFilterMenu && activeFilterField === 'contentWriter' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableTable
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"Ready To Submit"}
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
                                            <div ref={el => fieldRefs.current['contentStatus'] = el}>
                                                Content Status
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('contentStatus') ? (
                                                    <FaFilter onClick={() => handleFilterClick("contentStatus")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("contentStatus")} />
                                                )}
                                            </div>
                                            {showFilterMenu && activeFilterField === 'contentStatus' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableTable
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"Ready To Submit"}
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
                                    <th className='d-none'>
                                        <div className='d-flex align-items-center justify-content-center position-relative'>
                                            <div ref={el => fieldRefs.current['brochureDesigner'] = el}>
                                                Brochure Designer
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('brochureDesigner') ? (
                                                    <FaFilter onClick={() => handleFilterClick("brochureDesigner")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("brochureDesigner")} />
                                                )}
                                            </div>
                                            {showFilterMenu && activeFilterField === 'brochureDesigner' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableTable
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"Ready To Submit"}
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
                                    <th className="d-none">
                                        <div className='d-flex align-items-center justify-content-center position-relative'>
                                            <div ref={el => fieldRefs.current['brochureStatus'] = el}>
                                                Brochure Status
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('brochureStatus') ? (
                                                    <FaFilter onClick={() => handleFilterClick("brochureStatus")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("brochureStatus")} />
                                                )}
                                            </div>
                                            {showFilterMenu && activeFilterField === 'brochureStatus' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableTable
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"Ready To Submit"}
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
                                            <div ref={el => fieldRefs.current['nswsPhoneNo'] = el}>
                                                NSWS Phone No
                                            </div>

                                            <div className='RM_filter_icon'>
                                                <BsFilter
                                                    onClick={() => handleFilterClick("nswsPhoneNo")}
                                                />
                                            </div>
                                            {showFilterMenu && activeFilterField === 'nswsPhoneNo' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableTable
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"Ready To Submit"}
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
                                            <div ref={el => fieldRefs.current['nswsMailId'] = el}>
                                                NSWS Email Id
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('nswsMailId') ? (
                                                    <FaFilter onClick={() => handleFilterClick("nswsMailId")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("nswsMailId")} />
                                                )}
                                            </div>
                                            {showFilterMenu && activeFilterField === 'nswsMailId' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableTable
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"Ready To Submit"}
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
                                            <div ref={el => fieldRefs.current['nswsPaswsord'] = el}>
                                                NSWS Password
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('nswsPaswsord') ? (
                                                    <FaFilter onClick={() => handleFilterClick("nswsPaswsord")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("nswsPaswsord")} />
                                                )}
                                            </div>
                                            {showFilterMenu && activeFilterField === 'nswsPaswsord' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableTable
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"Ready To Submit"}
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
                                        <div className="d-flex align-items-center justify-content-center position-relative">
                                            <div ref={el => fieldRefs.current['otpVerificationStatus'] = el}>
                                                OTP/DSC Verification Status
                                            </div>
                                            <div className='otpVerificationStatus'>
                                                {isActiveField('otpVerificationStatus') ? (
                                                    <FaFilter onClick={() => handleFilterClick("otpVerificationStatus")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("otpVerificationStatus")} />
                                                )}
                                            </div>
                                            {showFilterMenu && activeFilterField === 'otpVerificationStatus' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableTable
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"Ready To Submit"}
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
                                            <div ref={el => fieldRefs.current['industry'] = el}>
                                                Industry
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('industry') ? (
                                                    <FaFilter onClick={() => handleFilterClick("industry")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("industry")} />
                                                )}
                                            </div>
                                            {showFilterMenu && activeFilterField === 'industry' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableTable
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"Ready To Submit"}
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
                                            <div ref={el => fieldRefs.current['sector'] = el}>
                                                Sector
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('sector') ? (
                                                    <FaFilter onClick={() => handleFilterClick("sector")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("sector")} />
                                                )}
                                            </div>
                                            {showFilterMenu && activeFilterField === 'sector' && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableTable
                                                        noofItems={setnoOfAvailableData}
                                                        allFilterFields={setActiveFilterFields}
                                                        filteredData={filteredData}
                                                        activeTab={"Ready To Submit"}
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
                                        <div
                                            className='d-flex align-items-center justify-content-center position-relative'
                                        >
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
                                        </div></th>
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
                                                        activeTab={"Ready To Submit"}
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
                                                        activeTab={"Ready To Submit"}
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
                                                        activeTab={"Ready To Submit"}
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
                                            <div ref={el => fieldRefs.current['receivedPayment'] = el}>
                                                Recieved Payment
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
                                                        activeTab={"Ready To Submit"}
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
                                                        activeTab={"Ready To Submit"}
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
                                    <th className="rm-sticky-action">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rmServicesData && rmServicesData.map((obj, index) => (
                                    <tr key={index}>
                                        <td className="rm-sticky-left-1"><div className="rm_sr_no">{index + 1}</div></td>
                                        <td className="rm-sticky-left-2"><b>{obj["Company Name"]}</b></td>
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
                                                        key={`${obj["Company Name"]}-${obj.serviceName}`} // Unique key
                                                        mainStatus={obj.mainCategoryStatus}
                                                        subStatus={obj.subCategoryStatus}
                                                        setNewSubStatus={setNewStatusProcess}
                                                        companyName={obj["Company Name"]}
                                                        serviceName={obj.serviceName}
                                                        refreshData={refreshData}
                                                        industry={obj.industry}
                                                        sector={obj.sector}
                                                    />
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                        <RMRemarksDialog
                                            key={`${obj["Company Name"]}-${obj.serviceName}`} // Unique key
                                            companyName={obj["Company Name"]}
                                            serviceName={obj.serviceName}
                                            refreshData={refreshData}
                                            historyRemarks={obj.Remarks}
                                            ename={employeeData.ename}
                                            designation={employeeData.designation}
                                            bdeName={obj.bdeName}
                                            bdmName={obj.bdmName}
                                        />
                                        </td>
                                       
                                        {/* <td className='td_of_remarks'>
                                            <div className="d-flex align-items-center justify-content-between wApp">
                                                <div className="d-flex align-items-center justify-content-between wApp">
                                                    {(() => {
                                                        // Check and sort remarks
                                                        let remarksValue = "No Remarks";
                                                        if (obj.Remarks && obj.Remarks.length > 0) {
                                                            console.log("obj.remarks" , obj.Remarks)
                                                            remarksValue = obj.Remarks
                                                                .sort((a, b) => new Date(b.updatedOn) - new Date(a.updatedOn))[0].remarks;
                                                        }

                                                        console.log('Sorted Remarks:', remarksValue); // Log the value of the remarks
                                                        
                                                        return (
                                                            <div
                                                                className="My_Text_Wrap"
                                                                title={remarksValue}
                                                            >
                                                                {remarksValue}
                                                            </div>
                                                        );
                                                    })()}
                                                </div>

                                                <button className='td_add_remarks_btn'
                                                    onClick={() => {
                                                        setOpenRemarksPopUp(true)
                                                        setCurrentCompanyName(obj["Company Name"])
                                                        setCurrentServiceName(obj.serviceName)
                                                        setHistoryRemarks(obj.Remarks)
                                                        handleOpenRemarksPopup(
                                                            obj["Company Name"],
                                                            obj.serviceName
                                                        )
                                                    }}
                                                >
                                                    <FaPencilAlt />
                                                </button>
                                            </div>
                                        </td> */}
                                        <td className="td_of_weblink">
                                            <WebsiteLink
                                                key={`${obj["Company Name"]}-${obj.serviceName}`} // Unique key
                                                companyName={obj["Company Name"]}
                                                serviceName={obj.serviceName}
                                                refreshData={refreshData}
                                                onlyLink={obj.websiteLink ? obj.websiteLink : ""}
                                                websiteLink={
                                                    obj.websiteLink
                                                        ? obj.websiteLink
                                                        : obj.companyBriefing
                                                            ? obj.companyBriefing
                                                            : ""
                                                }
                                                companyBriefing={
                                                    obj.companyBriefing ? obj.companyBriefing : ""
                                                }
                                            />
                                        </td>
                                        <td>{obj.withDSC ? "Yes" : "No"}</td>
                                        <td>
                                            {obj.withDSC ? (<DscLetterStatusAdHead
                                                key={`${obj["Company Name"]}-${obj.serviceName}`} // Unique key
                                                companyName={obj["Company Name"]}
                                                serviceName={obj.serviceName}
                                                mainStatus={obj.mainCategoryStatus}
                                                letterStatus={obj.letterStatus}
                                                refreshData={refreshData}
                                            />) : "Not Applicable"}
                                        </td>
                                        <td>
                                            <div>{obj.withDSC ? (
                                                obj.dscStatus
                                            ) :
                                                "Not Applicable"}</div>
                                        </td>
                                        <td>
                                            <ContentWriterDropdown
                                                key={`${obj["Company Name"]}-${obj.serviceName}`} // Unique key
                                                companyName={obj["Company Name"]}
                                                serviceName={obj.serviceName}
                                                mainStatus={obj.mainCategoryStatus}
                                                writername={obj.contentWriter ? obj.contentWriter : "Drashti Thakkar"}
                                                refreshData={refreshData}
                                            /></td>
                                        <td>
                                            <ContentStatusDropdown
                                                key={`${obj["Company Name"]}-${obj.serviceName}`} // Unique key
                                                companyName={obj["Company Name"]}
                                                serviceName={obj.serviceName}
                                                mainStatus={obj.mainCategoryStatus}
                                                contentStatus={obj.contentWriter === "Not Applicable" ? "Not Applicable" : obj.contentStatus}
                                                writername={obj.contentWriter}
                                                refreshData={refreshData}
                                            /></td>
                                        {/* For Brochure */}
                                        <td className="d-none">
                                            <BrochureDesignerDropdown
                                                key={`${obj["Company Name"]}-${obj.serviceName}`} // Unique key
                                                companyName={obj["Company Name"]}
                                                serviceName={obj.serviceName}
                                                mainStatus={obj.mainCategoryStatus}
                                                designername={obj.brochureDesigner ? obj.brochureDesigner : "Not Applicable"}
                                                refreshData={refreshData}
                                            />
                                        </td>
                                        <td className="d-none">
                                            <BrochureStatusDropdown
                                                key={`${obj["Company Name"]}-${obj.serviceName}`} // Unique key
                                                companyName={obj["Company Name"]}
                                                serviceName={obj.serviceName}
                                                mainStatus={obj.mainCategoryStatus}
                                                brochureStatus={obj.brochureStatus}
                                                designername={obj.brochureDesigner}
                                                refreshData={refreshData}
                                            /></td>

                                        <td>
                                            <NSWSMobileNo
                                                key={`${obj["Company Name"]}-${obj.serviceName}`} // Unique key
                                                companyName={obj["Company Name"]}
                                                serviceName={obj.serviceName}
                                                refreshData={refreshData}
                                                nswsMobileNo={obj.nswsMobileNo ? obj.nswsMobileNo : obj["Company Number"]} />
                                        </td>
                                        <td className='td_of_NSWSeMAIL'>
                                            <NSWSEmailInput
                                                key={`${obj["Company Name"]}-${obj.serviceName}`} // Unique key
                                                companyName={obj["Company Name"]}
                                                serviceName={obj.serviceName}
                                                refreshData={refreshData}
                                                nswsMailId={obj.nswsMailId ? obj.nswsMailId : obj["Company Email"]}
                                            />
                                        </td>
                                        <td className='td_of_weblink'>
                                            <NSWSPasswordInput
                                                key={`${obj["Company Name"]}-${obj.serviceName}`} // Unique key
                                                companyName={obj["Company Name"]}
                                                serviceName={obj.serviceName}
                                                refresData={refreshData}
                                                nswsPassword={obj.nswsPaswsord ? obj.nswsPaswsord : "Enter Password"}
                                            />
                                        </td>
                                        <td>
                                            <OtpVerificationStatus
                                                key={`${obj["Company Name"]}-${obj.serviceName}`} // Unique key
                                                mainStatus={obj.mainCategoryStatus}
                                                subStatus={obj.subCategoryStatus}
                                                companyName={obj["Company Name"]}
                                                serviceName={obj.serviceName}
                                                refreshData={refreshData}
                                                otpVerificationStatus={obj.otpVerificationStatus}
                                            />
                                        </td>
                                        <td className='td_of_Industry'>
                                            <IndustryDropdown
                                                key={`${obj["Company Name"]}-${obj.serviceName}`} // Unique key
                                                companyName={obj["Company Name"]}
                                                serviceName={obj.serviceName}
                                                refreshData={refreshData}
                                                onIndustryChange={handleIndustryChange}
                                                industry={obj.industry === "Select Industry" ? "" : obj.industry} // Set to "" if obj.industry is "Select Industry"
                                                mainStatus={obj.mainCategoryStatus}
                                            /></td>
                                        <td className='td_of_Industry'>
                                            <SectorDropdown
                                                key={`${obj["Company Name"]}-${obj.serviceName}`} // Unique key
                                                companyName={obj["Company Name"]}
                                                serviceName={obj.serviceName}
                                                refreshData={refreshData}
                                                sectorOptions={sectorOptions}
                                                industry={obj.industry || "Select Industry"} // Default to "Select Industry" if industry is not provided
                                                sector={obj.sector || ""} // Default to "" if sector is not provided
                                                mainStatus={obj.mainCategoryStatus}
                                            />
                                        </td>
                                        <td>{formatDatePro(obj.bookingDate)}</td>
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
                                                onClick={() => (
                                                    handleRevokeCompanyToRecievedBox(
                                                        obj["Company Name"],
                                                        obj.serviceName
                                                    )
                                                )}

                                            ><FaRegEye /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    ) :
                        (!openBacdrop &&
                            <table className='no_data_table'>
                                <div className='no_data_table_inner'>
                                    <Nodata />
                                </div>
                            </table>
                        )}
                </div>
            </div>
            {/* --------------------------------------------------------------dialog to view remarks only on forwarded status---------------------------------- */}

            {/* <Dialog className='My_Mat_Dialog'
                open={openRemarksPopUp}
                onClose={functionCloseRemarksPopup}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    <span style={{ fontSize: "14px" }}>
                        {currentCompanyName}'s Remarks
                    </span>
                    <IconButton onClick={functionCloseRemarksPopup} style={{ float: "right" }}>
                        <CloseIcon color="primary"></CloseIcon>
                    </IconButton>{" "}
                </DialogTitle>
                <DialogContent>
                    <div className="remarks-content">
                        {historyRemarks.length !== 0 && (
                            historyRemarks.slice().map((historyItem) => (
                                <div className="col-sm-12" key={historyItem._id}>
                                    <div className="card RemarkCard position-relative">
                                        <div className="d-flex justify-content-between">
                                            <div className="reamrk-card-innerText">
                                                <pre className="remark-text">{historyItem.remarks}</pre>
                                            </div>
                                            <div className="dlticon">
                                                <DeleteIcon
                                                    style={{
                                                        cursor: "pointer",
                                                        color: "#f70000",
                                                        width: "14px",
                                                    }}
                                                    onClick={() => {
                                                        handleDeleteRemarks(
                                                            historyItem._id,
                                                            historyItem.remarks
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="d-flex card-dateTime justify-content-between">
                                            <div className="date">{new Date(historyItem.updatedOn).toLocaleDateString('en-GB')}</div>
                                            <div className="time">{new Date(historyItem.updatedOn).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        {remarksHistory && remarksHistory.length === 0 && (
                            <div class="card-footer">
                                <div class="mb-3 remarks-input">
                                    <textarea
                                        placeholder="Add Remarks Here...  "
                                        className="form-control"
                                        id="remarks-input"
                                        rows="3"
                                        onChange={(e) => {
                                            debouncedSetChangeRemarks(e.target.value);
                                        }}
                                    ></textarea>
                                </div>
                                {error && <FormHelperText error>{error}</FormHelperText>}

                            </div>
                        )}
                    </div>

                </DialogContent>
                <button
                    onClick={handleSubmitRemarks}
                    type="submit"
                    className="btn btn-primary bdr-radius-none"
                    style={{ width: "100%" }}
                >
                    Submit
                </button>
            </Dialog> */}

        </div>
    )
}

export default RmofCertificationReadyToSubmitPanel;