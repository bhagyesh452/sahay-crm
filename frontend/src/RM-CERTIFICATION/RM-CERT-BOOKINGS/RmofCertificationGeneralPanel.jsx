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
    const secretKey = process.env.REACT_APP_SECRET_KEY;

    // Fetch Data Function
    const fetchData = async () => {
        setOpenBacdrop(true);
        try {
            const employeeResponse = await axios.get(`${secretKey}/employee/einfo`);
            const userData = employeeResponse.data.find((item) => item._id === rmCertificationUserId);
            setEmployeeData(userData);

            const servicesResponse = await axios.get(`${secretKey}/rm-services/rm-sevicesgetrequest`);
            setRmServicesData(servicesResponse.data.filter(item => item.mainCategoryStatus === "General"));
        } catch (error) {
            console.error("Error fetching data", error.message);
        } finally {
            setOpenBacdrop(false);
        }
    };

    // useEffect to fetch data on component mount
    useEffect(() => {
        fetchData();
    }, [rmCertificationUserId, secretKey]);

    const refreshData = () => {
        fetchData();
    };

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
                                    <th className="G_rm-sticky-left-1">Sr.No</th>
                                    <th className="G_rm-sticky-left-2">Booking Date</th>
                                    <th className="G_rm-sticky-left-3">Company Name</th>
                                    <th>Company Number</th>
                                    <th>Company Email</th>
                                    <th>CA Number</th>
                                    <th>Service Name</th>
                                    <th>Status</th>
                                    <th>DSC Applicable</th>
                                    <th>BDE Name</th>
                                    <th>BDM name</th>
                                    <th>Total Payment</th>
                                    <th>received Payment</th>
                                    <th>Pending Payment</th>
                                    <th className="rm-sticky-action">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rmServicesData.map((obj, index) => (
                                    <tr key={index}>
                                        <td className="G_rm-sticky-left-1">{index + 1}</td>
                                        <td className='G_rm-sticky-left-2'>{formatDatePro(obj.bookingDate)}</td>
                                        <td className="G_rm-sticky-left-3"><b>{obj["Company Name"]}</b></td>
                                        <td>
                                            <div className="d-flex align-items-center justify-content-center wApp">
                                                <div>{obj["Company Number"]}</div>
                                                <a style={{ marginLeft: '10px', lineHeight: '14px', fontSize: '14px' }}>
                                                    <FaWhatsapp />
                                                </a>
                                            </div>
                                        </td>
                                        <td>{obj["Company Email"]}</td>
                                        <td>
                                            <div className="d-flex align-items-center justify-content-center wApp">
                                                <div>{obj.caCase === "Yes" ? obj.caNumber : "Not Applicable"}</div>
                                                {obj.caCase === "Yes" && (
                                                    <a style={{ marginLeft: '10px', lineHeight: '14px', fontSize: '14px' }}>
                                                        <FaWhatsapp />
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td>{obj.serviceName}</td>
                                        <td>
                                            {obj.mainCategoryStatus && obj.subCategoryStatus && (
                                                <StatusDropdown
                                                    key={`${obj["Company Name"]}-${obj.serviceName}`}
                                                    mainStatus={obj.mainCategoryStatus}
                                                    subStatus={obj.subCategoryStatus}
                                                    setNewSubStatus={setNewStatus}
                                                    companyName={obj["Company Name"]}
                                                    serviceName={obj.serviceName}
                                                    refreshData={refreshData}
                                                />
                                            )}
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
                                        <td>₹ {obj.firstPayment ? obj.firstPayment.toLocaleString('en-IN') : obj.totalPaymentWGST.toLocaleString('en-IN')}</td>
                                        <td>₹ {(obj.totalPaymentWGST - (obj.firstPayment ? obj.firstPayment : 0)).toLocaleString('en-IN')}</td>
                                        <td className="rm-sticky-action">
                                            <div className="actions">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleOpenRemarksPopup(obj["Company Name"], obj.serviceName)}
                                                >
                                                    <FaRegEye />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => {
                                                        Swal.fire({
                                                            title: 'Are you sure?',
                                                            text: "You won't be able to revert this!",
                                                            icon: 'warning',
                                                            showCancelButton: true,
                                                            confirmButtonColor: '#3085d6',
                                                            cancelButtonColor: '#d33',
                                                            confirmButtonText: 'Yes, delete it!'
                                                        }).then(async (result) => {
                                                            if (result.isConfirmed) {
                                                                try {
                                                                    await axios.delete(`${secretKey}/rm-services/delete`, {
                                                                        data: { companyName: obj["Company Name"], serviceName: obj.serviceName }
                                                                    });
                                                                    refreshData();
                                                                    Swal.fire(
                                                                        'Deleted!',
                                                                        'The record has been deleted.',
                                                                        'success'
                                                                    );
                                                                } catch (error) {
                                                                    console.error("Error deleting record", error.message);
                                                                }
                                                            }
                                                        });
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : ( !openBacdrop && (
                        <table className='no_data_table'>
                                <div className='no_data_table_inner'>
                                    <Nodata />
                                </div>
                            </table>
                        )
                    )}
                </div>
            </div>

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
