import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaWhatsapp } from "react-icons/fa";
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
import FilterableTable from '../../RM-CERTIFICATION/Extra-Components/FilterableTable.jsx';
import { FaFilter } from "react-icons/fa";
import { AiFillFilePdf } from "react-icons/ai"; // Importing a PDF icon from react-icons
import RecruiterStatusDropdown from '../ExtraComponents/RecruiterStatusDropdown.jsx';
import RecruiterCallHistory from '../ExtraComponents/RecruiterCallHistory.jsx';
import RecruiterFilter from '../ExtraComponents/RecruiterFilter.jsx';
//import FilterableTable from '../Extra-Components/FilterableTable';

function RecruiterGeneral({ searchText, showFilter, activeTab, totalFilteredData, showingFilterIcon, completeEmployeeInfo }) {
    const recruiterUserId = localStorage.getItem("recruiterUserId")
    const [employeeData, setEmployeeData] = useState([]);
    const [recruiterData, setRecruiterData] = useState([]);
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



    const fetchData = async (searchQuery = "", page = 1, isFilter = false) => {
        setOpenBacdrop(true);
        try {
            const employeeResponse = await axios.get(`${secretKey}/employee/einfo`);
            const userData = employeeResponse.data.find((item) => item._id === recruiterUserId);

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

            const servicesResponse = await axios.get(`${secretKey}/recruiter/recruiter-data`, {
                params: params
            });

            const { data, totalPages } = servicesResponse.data;


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

    console.log("recruiterDatageneral", recruiterData)
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
        document.title = `Recruiter-Sahay-CRM`;
    }, []);

    useEffect(() => {
        const socket = secretKey === "http://localhost:3001/api" ? io("http://localhost:3001") : io("wss://startupsahay.in", {
            secure: true, // Use HTTPS
            path: '/socket.io',
            reconnection: true,
            transports: ['websocket'],
        });
        const updateDocumentInState = (updatedDocument) => {
            //console.log(updatedDocument)
            setRecruiterData(prevData => prevData.map(item =>
                item._id === updatedDocument._id ? updatedDocument : item
            ));
            setcompleteRmData(prevData => prevData.map(item =>
                item._id === updatedDocument._id ? updatedDocument : item
            ));
            setdataToFilter(prevData => prevData.map(item =>
                item._id === updatedDocument._id ? updatedDocument : item
            ));
        };
        socket.on("recruiter-general-status-updated", (res) => {
            fetchData(searchText)
        });
        socket.on("recruiter-application-submitted", (res) => {
            fetchData(searchText)
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
    }, [recruiterUserId, secretKey]);

    const formatDatePro = (inputDate) => {
        const date = new Date(inputDate);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month}, ${year}`;
    };



    // ------------------------------------------------function to send service back to recieved box --------------------------------



    //-------------------filter method-------------------------------

    const handleFilter = (newData) => {
        setFilteredData(newData)
        setRecruiterData(newData.filter(obj => obj.mainCategoryStatus === "General"));

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


    function handleDownload(filename, empFullName) {
        // Remove any spaces in the employee name to match the folder name
        const sanitizedEmpName = empFullName.replace(/\s+/g, '');
        // Construct the URL and open the file in a new tab
        window.open(`${secretKey}/recruiter/uploads/${empFullName}/${filename}`, "_blank");
    }
    //console.log("noofavaibaledatageneral" , noOfAvailableData)
    //console.log("recruiterDatageneral" , recruiterData)

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
                                                        activeTab={"General"}
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
                                                        activeTab={"General"}
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
                                            {showFilterMenu && activeFilterField === "personal_email" && (
                                                <div
                                                    ref={filterMenuRef}
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <RecruiterFilter
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
                                            )}
                                        </div>
                                    </th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center position-relative'>
                                            <div ref={el => fieldRefs.current['subCategoryStatus'] = el}>
                                                Status
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
                                                    <RecruiterFilter
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
                                            )}
                                        </div>
                                    </th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center position-relative'>
                                            <div ref={el => fieldRefs.current['appliedFor'] = el}>
                                                Applied For
                                            </div >

                                            {/* <div className='RM_filter_icon'>
                                                {isActiveField('caNumber') ? (
                                                    <FaFilter onClick={() => handleFilterClick("caNumber")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("caNumber")} />
                                                )}
                                            </div> */}
                                            {/* ---------------------filter component--------------------------- */}
                                            {/* {showFilterMenu && activeFilterField === 'caNumber' && (
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
                                            <div ref={el => fieldRefs.current['quaification'] = el}>
                                                Qualification
                                            </div>

                                            {/* <div className='RM_filter_icon'>
                                                {isActiveField('serviceName') ? (
                                                    <FaFilter onClick={() => handleFilterClick("servicesName")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("serviceName")} />
                                                )}
                                            </div> */}
                                            {/* ---------------------filter component--------------------------- */}
                                            {/* {showFilterMenu && activeFilterField === 'serviceName' && (
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
                                            <div ref={el => fieldRefs.current['subCategoryStatus'] = el}>
                                                Experience
                                            </div>

                                            <div className='RM_filter_icon'>
                                                {isActiveField('subCategoryStatus') ? (
                                                    <FaFilter onClick={() => handleFilterClick("subCategoryStatus")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("subCategoryStatus")} />
                                                )}
                                            </div>
                                            {/* ---------------------filter component--------------------------- */}
                                            {/* {showFilterMenu && activeFilterField === 'subCategoryStatus' && (
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
                                    {/* <th>Remark</th> */}
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center position-relative'>
                                            <div ref={el => fieldRefs.current['currentCTC'] = el}>
                                                Current CTC
                                            </div>

                                            {/* <div className='RM_filter_icon'>
                                                {isActiveField('withDSC') ? (
                                                    <FaFilter onClick={() => handleFilterClick("withDSC")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("withDSC")} />
                                                )}
                                            </div> */}
                                            {/* ---------------------filter component--------------------------- */}
                                            {/* {showFilterMenu && activeFilterField === 'withDSC' && (
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
                                            <div ref={el => fieldRefs.current['expectedCTC'] = el}>
                                                Expected CTC
                                            </div>

                                            {/* <div className='RM_filter_icon'>
                                                {isActiveField('bdeName') ? (
                                                    <FaFilter onClick={() => handleFilterClick("bdeName")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("bdeName")} />
                                                )}
                                            </div> */}
                                            {/* ---------------------filter component--------------------------- */}
                                            {/* {showFilterMenu && activeFilterField === 'bdeName' && (
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
                                            <div ref={el => fieldRefs.current['applicationSource'] = el}>
                                                Application Source
                                            </div>

                                            {/* <div className='RM_filter_icon'>
                                                {isActiveField('bdmName') ? (
                                                    <FaFilter onClick={() => handleFilterClick("bdmName")} />
                                                ) : (
                                                    <BsFilter onClick={() => handleFilterClick("bdmName")} />
                                                )}
                                            </div> */}
                                            {/* ---------------------filter component--------------------------- */}
                                            {/* {showFilterMenu && activeFilterField === 'bdmName' && (
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
                                    <th>Application Date</th>
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
                                                        setNewSubStatus={setNewStatus}
                                                        empName={obj.empFullName}
                                                        empEmail={obj.personal_email}
                                                        refreshData={refreshData}
                                                    />
                                                )}
                                            </div>
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

        </div>
    );
}

export default RecruiterGeneral;
