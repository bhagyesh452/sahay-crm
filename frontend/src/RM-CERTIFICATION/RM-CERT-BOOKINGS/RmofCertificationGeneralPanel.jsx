import React, { useState, useEffect, useCallback } from 'react';
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

function RmofCertificationGeneralPanel() {
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
    const secretKey = process.env.REACT_APP_SECRET_KEY;


    // Fetch Data Function
    const fetchData = async () => {
        setOpenBacdrop(true);
        try {
            console.log("Fetching data...");
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
            } else {
                console.error("Expected an array for services data, but got:", servicesData);
            }
            console.log("Fetched general services data:", servicesData);
            //setRmServicesData(filteredData);
        } catch (error) {
            console.error("Error fetching data", error.message);
        } finally {
            setOpenBacdrop(false);
        }
    };

    console.log("generaldata" , rmServicesData)

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
                                            <div className='RM_filter_icon'>
                                                <BsFilter />
                                            </div>
                                        </div>
                                    </th>
                                    <th className="G_rm-sticky-left-2">
                                        <div className='d-flex align-items-center justify-content-center'>
                                            <div>
                                                Booking Date
                                            </div>
                                            <div className='RM_filter_icon'>
                                                <BsFilter />
                                            </div>
                                        </div>
                                    </th>
                                    <th className="G_rm-sticky-left-3">
                                        <div className='d-flex align-items-center justify-content-center'>
                                            <div>
                                                Company Name
                                            </div>
                                            <div className='RM_filter_icon'>
                                                <BsFilter />
                                            </div>
                                        </div>
                                    </th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center'>
                                            <div>
                                                Company Number
                                            </div>
                                            <div className='RM_filter_icon'>
                                                <BsFilter />
                                            </div>
                                        </div>
                                    </th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center'>
                                            <div>
                                                Company Email
                                            </div>
                                            <div className='RM_filter_icon'>
                                                <BsFilter />
                                            </div>
                                        </div>
                                    </th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center'>
                                            <div>
                                                CA Number
                                            </div>
                                            <div className='RM_filter_icon'>
                                                <BsFilter />
                                            </div>
                                        </div>
                                    </th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center'>
                                            <div>
                                                Service Name
                                            </div>
                                            <div className='RM_filter_icon'>
                                                <BsFilter />
                                            </div>
                                        </div>
                                    </th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center'>
                                            <div>
                                                Status
                                            </div>
                                            <div className='RM_filter_icon'>
                                                <BsFilter />
                                            </div>
                                        </div>
                                    </th>
                                    {/* <th>Remark</th> */}
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center'>
                                            <div>
                                                DSC Applicable
                                            </div>
                                            <div className='RM_filter_icon'>
                                                <BsFilter />
                                            </div>
                                        </div>  
                                    </th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center'>
                                            <div>
                                                BDE Name
                                            </div>
                                            <div className='RM_filter_icon'>
                                                <BsFilter />
                                            </div>
                                        </div>  
                                    </th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center'>
                                            <div>
                                                BDM Name
                                            </div>
                                            <div className='RM_filter_icon'>
                                                <BsFilter />
                                            </div>
                                        </div>
                                    </th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center'>
                                            <div>
                                                Total Payment
                                            </div>
                                            <div className='RM_filter_icon'>
                                                <BsFilter />
                                            </div>
                                        </div>
                                    </th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center'>
                                            <div>
                                                received Payment
                                            </div>
                                            <div className='RM_filter_icon'>
                                                <BsFilter />
                                            </div>
                                        </div>
                                    </th>
                                    <th>
                                        <div className='d-flex align-items-center justify-content-center'>
                                            <div>
                                            Pending Payment
                                            </div>
                                            <div className='RM_filter_icon'>
                                                <BsFilter />
                                            </div>
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
                                        <td>₹ {obj.totalPaymentWGST.toLocaleString('en-IN')}</td>
                                        <td>₹ {obj.firstPayment ? ((parseInt(obj.firstPayment)) + (parseInt(obj.pendingRecievedPayment))).toLocaleString('en-IN') : obj.totalPaymentWGST.toLocaleString('en-IN')}</td>
                                        <td>₹ {obj.firstPayment ? ((parseInt(obj.totalPaymentWGST) - parseInt(obj.firstPayment) - parseInt(obj.pendingRecievedPayment)).toLocaleString('en-IN')) : 0}</td>
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
        </div>
    );
}

export default RmofCertificationGeneralPanel;
