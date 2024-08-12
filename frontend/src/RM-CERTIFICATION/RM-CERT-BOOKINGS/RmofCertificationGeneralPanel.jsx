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
import FilterableTable from '../Extra-Components/FilterableTable';

function RmofCertificationGeneralPanel({ showFilter }) {
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
    // Fetch Data Function
    const fetchData = async () => {
        setOpenBacdrop(true);
        try {

            const employeeResponse = await axios.get(`${secretKey}/employee/einfo`);
            const userData = employeeResponse.data.find((item) => item._id === rmCertificationUserId);
            setEmployeeData(userData);

            const servicesResponse = await axios.get(`${secretKey}/rm-services/rm-sevicesgetrequest`);
            const servicesData = servicesResponse.data;

            if (Array.isArray(servicesData)) {
                const filteredData = servicesData
                    .filter(item => item.mainCategoryStatus === "General")
                    .sort((a, b) => {
                        const dateA = new Date(a.addedOn);
                        const dateB = new Date(b.addedOn);
                        return dateB - dateA; // Sort in descending order
                    });
                setRmServicesData(filteredData);
                setcompleteRmData(filteredData)
                setdataToFilter(filteredData)
            } else {
                console.error("Expected an array for services data, but got:", servicesData);
            }

            //setRmServicesData(filteredData);
        } catch (error) {
            console.error("Error fetching data", error.message);
        } finally {
            setOpenBacdrop(false);
        }
    };



    useEffect(() => {
        const socket = secretKey === "http://localhost:3001/api" ? io("http://localhost:3001") : io("wss://startupsahay.in", {
            secure: true, // Use HTTPS
            path: '/socket.io',
            reconnection: true,
            transports: ['websocket'],
        });

        socket.on("rm-general-status-updated", (res) => {
            fetchData()
        });

        socket.on("rm-recievedamount-updated", (res) => {
            fetchData()
        });

        socket.on("booking-deleted", (res) => {
            fetchData()
        });

        socket.on("booking-updated", (res) => {
            fetchData()
        });


        return () => {
            socket.disconnect();
        };
    }, [newStatus]);



    const refreshData = () => {

        fetchData();
    };

    // useEffect to fetch data on component mount
    useEffect(() => {
        fetchData();
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
        try {
            const response = await axios.post(`${secretKey}/rm-services/post-remarks-for-rmofcertification`, {
                currentCompanyName,
                currentServiceName,
                changeRemarks,
                updatedOn: new Date()
            });
            if (response.status === 200) {
                fetchData();
                functionCloseRemarksPopup();
                Swal.fire(
                    'Remarks Added!',
                    'The remarks have been successfully added.',
                    'success'
                );
            }
        } catch (error) {
            console.log("Error Submitting Remarks", error.message);
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
                    fetchData();
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
    const [filteredData, setFilteredData] = useState(rmServicesData);
    const [filterField, setFilterField] = useState("")

    const handleFilter = (newData) => {
        setRmServicesData(newData);
    };
    const [activeFilterField, setActiveFilterField] = useState(null);
    const [filterPosition, setFilterPosition] = useState({ top: 10, left: 5 });
    const fieldRefs = useRef({});

    const handleFilterClick = (field) => {
        if (activeFilterField === field) {
            // Toggle off if the same field is clicked again
            setShowFilterMenu(!showFilterMenu);
        } else {
            // Set the active field and show filter menu
            setActiveFilterField(field);
            setShowFilterMenu(true);

            // Get the position of the clicked filter icon
            const rect = fieldRefs.current[field].getBoundingClientRect();
            setFilterPosition({ top: rect.bottom, left: rect.left });
        }
    };

    console.log("rmservicesdata" , rmServicesData)
  


    return (
        <div>
            <div className="RM-my-booking-lists">
                <div className="table table-responsive table-style-3 m-0">
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
                                            {showFilter &&
                                            <div className='RM_filter_icon'>
                                                <BsFilter onClick={() => handleFilterClick("bookingDate")} />
                                            </div>
                                            }
                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'bookingDate' && (
                                                <div
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableTable
                                                        data={rmServicesData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeRmData}
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
                                            {showFilter &&
                                            <div className='RM_filter_icon'>
                                                <BsFilter onClick={() => handleFilterClick("Company Name")} />
                                            </div>
                                            }
                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'Company Name' && (
                                                <div
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableTable
                                                        data={rmServicesData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeRmData}
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
                                            {showFilter &&
                                                <div className='RM_filter_icon'>
                                                    <BsFilter
                                                        onClick={() => handleFilterClick("Company Number")}
                                                    />
                                                </div>}
                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === "Company Number" && (
                                                <div
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableTable
                                                        data={rmServicesData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeRmData}
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
                                            {showFilter &&
                                                <div className='RM_filter_icon'>
                                                    <BsFilter
                                                        onClick={() => handleFilterClick("Company Email")}
                                                    />
                                                </div>}
                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'Company Email' && (
                                                <div
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableTable
                                                        data={rmServicesData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeRmData}
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
                                            {showFilter &&
                                                <div className='RM_filter_icon'>
                                                    <BsFilter
                                                        onClick={() => handleFilterClick("caNumber")}
                                                    />
                                                </div>}
                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'caNumber' && (
                                                <div
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableTable
                                                        data={rmServicesData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeRmData}
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
                                            {showFilter &&
                                                <div className='RM_filter_icon'>
                                                    <BsFilter
                                                        onClick={() => handleFilterClick("serviceName")}
                                                    />
                                                </div>}
                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'serviceName' && (
                                                <div
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableTable
                                                        data={rmServicesData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeRmData}
                                                        dataForFilter={rmServicesData}
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
                                            {showFilter &&
                                                <div className='RM_filter_icon'>
                                                    <BsFilter
                                                        onClick={() => handleFilterClick("subCategoryStatus")}
                                                    />
                                                </div>}
                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'subCategoryStatus' && (
                                                <div
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableTable
                                                        data={rmServicesData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeRmData}
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
                                            {showFilter &&
                                                <div className='RM_filter_icon'>
                                                    <BsFilter
                                                        onClick={() => handleFilterClick("withDSC")}
                                                    />
                                                </div>}
                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'withDSC' && (
                                                <div
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableTable
                                                        data={rmServicesData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeRmData}
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
                                            {showFilter &&
                                                <div className='RM_filter_icon'>
                                                    <BsFilter
                                                        onClick={() => handleFilterClick("bdeName")}
                                                    />
                                                </div>}
                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'bdeName' && (
                                                <div
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableTable
                                                        data={rmServicesData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeRmData}
                                                        dataForFilter={rmServicesData}
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
                                            {showFilter &&
                                                <div className='RM_filter_icon'>
                                                    <BsFilter
                                                        onClick={() => handleFilterClick("bdmName")}
                                                    />
                                                </div>}
                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'bdmName' && (
                                                <div
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableTable
                                                        data={rmServicesData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeRmData}
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
                                            {showFilter &&
                                                <div className='RM_filter_icon'>
                                                    <BsFilter
                                                        onClick={() => handleFilterClick("totalPaymentWGST")}
                                                    />
                                                </div>}
                                            {/* ---------------------filter component--------------------------- */}
                                            {showFilterMenu && activeFilterField === 'totalPaymentWGST' && (
                                                <div
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableTable
                                                        data={rmServicesData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeRmData}
                                                        dataForFilter={dataToFilter}
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
                                            {showFilter &&
                                                <div className='RM_filter_icon'>
                                                    <BsFilter
                                                        onClick={() => handleFilterClick("receivedPayment")}
                                                    />
                                                </div>}
                                          {/* ---------------------filter component--------------------------- */}
                                          {showFilterMenu && activeFilterField === 'receivedPayment' && (
                                                <div
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableTable
                                                        data={rmServicesData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeRmData}
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
                                            {showFilter &&
                                                <div className='RM_filter_icon'>
                                                    <BsFilter
                                                        onClick={() => handleFilterClick("pendingPayment")}

                                                    />
                                                </div>}
                                            {/* ---------------------filter component--------------------------- */}
                                          {showFilterMenu && activeFilterField === 'pendingPayment' && (
                                                <div
                                                    className="filter-menu"
                                                    style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                >
                                                    <FilterableTable
                                                        data={rmServicesData}
                                                        filterField={activeFilterField}
                                                        onFilter={handleFilter}
                                                        completeData={completeRmData}
                                                        dataForFilter={dataToFilter}
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

                                                <div>{obj.bdeName}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center justify-content-center">

                                                <div>{obj.bdmName}</div>
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
                        dataForFilter={dataToFilter}
                    />
                </div>
            )} */}
        </div>
    );
}

export default RmofCertificationGeneralPanel;
