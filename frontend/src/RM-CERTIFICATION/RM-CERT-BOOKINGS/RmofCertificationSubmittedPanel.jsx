
import React, { useState, useEffect, useCallback } from 'react';
import { FaWhatsapp } from "react-icons/fa";
import StatusDropdown from "../Extra-Components/status-dropdown";
import DscStatusDropdown from "../Extra-Components/dsc-status-dropdown";
import { FaRegEye } from "react-icons/fa";
import { CiUndo } from "react-icons/ci";
import axios from 'axios';
import io from 'socket.io-client';
import { Drawer, Icon, IconButton } from "@mui/material";
import { FaPencilAlt } from "react-icons/fa";
import { Button, Dialog, DialogContent, DialogTitle, FormHelperText } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import debounce from "lodash/debounce";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentWriterDropdown from '../Extra-Components/ContentWriterDropdown';
import ContentStatusDropdown from '../Extra-Components/ContentStatusDropdown';
import { VscSaveAs } from "react-icons/vsc";
import NSWSEmailInput from '../Extra-Components/NSWSEmailInput';
import NSWSPasswordInput from '../Extra-Components/NSWSPasswordInput';
import WebsiteLink from '../Extra-Components/WebsiteLink';
import IndustryDropdown from '../Extra-Components/Industry-Dropdown';
import SectorDropdown from '../Extra-Components/SectorDropdown';
import BrochureStatusDropdown from '../Extra-Components/BrochureStatusDropdown';
import BrochureDesignerDropdown from '../Extra-Components/BrochureDesignerDrodown';
import Nodata from '../../components/Nodata';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';



function RmofCertificationSubmittedPanel() {
    const rmCertificationUserId = localStorage.getItem("rmCertificationUserId")
    const [employeeData, setEmployeeData] = useState([])
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [currentDataLoading, setCurrentDataLoading] = useState(false)
    const [isFilter, setIsFilter] = useState(false)
    const [rmServicesData, setRmServicesData] = useState([])
    const [newStatusSubmitted, setNewStatusSubmitted] = useState("Submitted")
    const [openRemarksPopUp, setOpenRemarksPopUp] = useState(false);
    const [currentCompanyName, setCurrentCompanyName] = useState("")
    const [currentServiceName, setCurrentServiceName] = useState("")
    const [remarksHistory, setRemarksHistory] = useState([])
    const [changeRemarks, setChangeRemarks] = useState("");
    const [historyRemarks, setHistoryRemarks] = useState([])
    const [email, setEmail] = useState('');
    const [openEmailPopup, setOpenEmailPopup] = useState(false);
    const [selectedIndustry, setSelectedIndustry] = useState("");
    const [sectorOptions, setSectorOptions] = useState([]);
    const [error, setError] = useState('')
    const [openBacdrop, setOpenBacdrop] = useState(false)

    function formatDatePro(inputDate) {
        const date = new Date(inputDate);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month}, ${year}`;
    }

    function formatDateNew(inputDate) {
        const date = new Date(inputDate);
        const day = String(date.getUTCDate()).padStart(2, '0'); // Ensures day is two digits
        const month = date.toLocaleString('en-US', { month: 'long' });
        const year = date.getUTCFullYear();
        return `${day} ${month}, ${year}`;
    }

    const formatTime = (dateString) => {
        //const dateString = "Sat Jun 29 2024 15:15:12 GMT+0530 (India Standard Time)";
        const date = new Date(dateString)
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';

        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;

        const strTime = `${hours}:${minutes} ${ampm}`;
        return strTime;
    }

    useEffect(() => {
        document.title = `RMOFCERT-Sahay-CRM`;
    }, []);

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
        return () => {
            socket.disconnect();
        };
    }, [newStatusSubmitted]);


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
                    .filter(item => item.mainCategoryStatus === "Submitted")
                    .sort((a, b) => {
                        const dateA = new Date(a.dateOfChangingMainStatus);
                        const dateB = new Date(b.dateOfChangingMainStatus);
                        return dateB - dateA; // Sort in descending order
                    });
                setRmServicesData(filteredData);
            } else {
                console.error("Expected an array for services data, but got:", servicesData);
            }
        } catch (error) {
            console.error("Error fetching data", error.message);
        } finally {
            setOpenBacdrop(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [rmCertificationUserId, secretKey]);

    const refreshData = () => {
        fetchData();
    };

    function formatDate(dateString) {
        const [year, month, date] = dateString.split('-');
        return `${date}/${month}/${year}`
    }


    //console.log("setnewsubstatus", newStatusSubmitted)

    const handleOpenRemarksPopup = async (companyName, serviceName) => {
        console.log("RemarksPopup")
    }
    const functionCloseRemarksPopup = () => {
        setChangeRemarks('')
        setError('')
        setOpenRemarksPopUp(false)
    }
    const debouncedSetChangeRemarks = useCallback(
        debounce((value) => {
            setChangeRemarks(value);
        }, 300), // Adjust the debounce delay as needed (e.g., 300 milliseconds)
        [] // Empty dependency array to ensure the function is memoized
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
                    fetchData();
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
                fetchData();
                functionCloseRemarksPopup();
            }
            // Refresh the list
        } catch (error) {
            console.error("Error deleting remark:", error);
        }
    };


    const handleIndustryChange = (industry, options) => {
        setSelectedIndustry(industry);
        setSectorOptions(options);
    };

    const formatDateISO = (date) => {
        // Customize the date formatting as needed
        return new Intl.DateTimeFormat('en-US').format(date);
    }

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
                        <table className="table table-vcenter table-nowrap rm_table_submited">
                            <thead>
                                <tr className="tr-sticky">
                                    <th className="rm-sticky-left-1">Sr.No</th>
                                    <th className="rm-sticky-left-2">Company Name</th>
                                    <th>Company Number</th>
                                    <th>Company Email</th>
                                    <th>CA Number</th>
                                    <th>Service Name</th>
                                    <th>Status</th>
                                    <th>Remark</th>
                                    <th>Website Link/Brief</th>
                                    <th>DSC Applicable</th>
                                    <th>DSC Status</th>
                                    <th>Content Writer</th>
                                    <th>Content Status</th>
                                    <th>Brochure Designer</th>
                                    <th>Brochure Status</th>
                                    <th>NSWS Email Id</th>
                                    <th>NSWS Password</th>
                                    <th>Industry</th>
                                    <th>Sector</th>
                                    <th>Booking Date</th>
                                    <th>BDE Name</th>
                                    <th>BDM name</th>
                                    <th>Total Payment</th>
                                    <th>received Payment</th>
                                    <th>Pending Payment</th>
                                    <th>No of Attempt</th>
                                    <th>Submitted On</th>
                                    <th>Submitted By</th>
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
                                                        setNewSubStatus={setNewStatusSubmitted}
                                                        companyName={obj["Company Name"]}
                                                        serviceName={obj.serviceName}
                                                        refreshData={refreshData}
                                                        contentStatus={obj.contentStatus ? obj.contentStatus : "Not Started"}
                                                        brochureStatus={obj.brochureStatus ? obj.brochureStatus : "Not Started"}
                                                        activeTabCurrent={obj.activeTab ? obj.activeTab : ""}
                                                        tabStopCondition={false}
                                                    />
                                                )}
                                            </div>
                                        </td>
                                        <td className='td_of_remarks'>
                                            <div className="d-flex align-items-center justify-content-between wApp">
                                                <div
                                                    className="My_Text_Wrap"
                                                    title={obj.Remarks && obj.Remarks.length > 0 ? obj.Remarks.sort((a, b) => new Date(b.updatedOn) - new Date(a.updatedOn))[0].remarks : "No Remarks"}
                                                >
                                                    {
                                                        obj.Remarks && obj.Remarks.length > 0
                                                            ? obj.Remarks
                                                                .sort((a, b) => new Date(b.updatedOn) - new Date(a.updatedOn))[0].remarks
                                                            : "No Remarks"
                                                    }
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
                                        </td>
                                        <td className='td_of_weblink'>
                                            <WebsiteLink
                                                key={`${obj["Company Name"]}-${obj.serviceName}`} // Unique key
                                                companyName={obj["Company Name"]}
                                                serviceName={obj.serviceName}
                                                refreshData={refreshData}
                                                companyBriefing={obj.companyBriefing ? obj.companyBriefing : ""}
                                                websiteLink={obj.websiteLink ? obj.websiteLink : obj.companyBriefing ? obj.companyBriefing : obj["Company Email"]}

                                            />
                                        </td>
                                        <td>{obj.withDSC ? "Yes" : "No"}</td>
                                        <td>
                                            <div>{obj.withDSC ? (
                                                // <DscStatusDropdown 
                                                // companyName = {obj["Company Name"]}
                                                // serviceName = {obj.serviceName}
                                                // mainStatus = {obj.mainCategoryStatus}
                                                // dscStatus = {obj.dscStatus}
                                                // />
                                                "Not Started"
                                            ) :
                                                ("Not Applicable")}</div>
                                        </td>
                                        <td>
                                            <ContentWriterDropdown
                                                key={`${obj["Company Name"]}-${obj.serviceName}`} // Unique key
                                                companyName={obj["Company Name"]}
                                                serviceName={obj.serviceName}
                                                mainStatus={obj.mainCategoryStatus}
                                                writername={obj.contentWriter ? obj.contentWriter : "Not Applicable"}
                                                refreshData={refreshData}
                                            /></td>
                                        <td>
                                            <ContentStatusDropdown
                                                key={`${obj["Company Name"]}-${obj.serviceName}`} // Unique key
                                                companyName={obj["Company Name"]}
                                                serviceName={obj.serviceName}
                                                mainStatus={obj.mainCategoryStatus}
                                                contentStatus={obj.contentWriter === "Not Applicable" ? "Not Applicable" : obj.contentStatus}
                                                brochureStatus={obj.brochureStatus ? obj.brochureStatus : "Not Started"}
                                                writername={obj.contentWriter}
                                                refreshData={refreshData}
                                            /></td>
                                        <td>
                                            <BrochureDesignerDropdown
                                                key={`${obj["Company Name"]}-${obj.serviceName}`} // Unique key
                                                companyName={obj["Company Name"]}
                                                serviceName={obj.serviceName}
                                                mainStatus={obj.mainCategoryStatus}
                                                designername={obj.brochureDesigner ? obj.brochureDesigner : "Not Applicable"}
                                                refreshData={refreshData}
                                            />
                                        </td>
                                        <td>
                                            <BrochureStatusDropdown
                                                key={`${obj["Company Name"]}-${obj.serviceName}`} // Unique key
                                                companyName={obj["Company Name"]}
                                                serviceName={obj.serviceName}
                                                mainStatus={obj.mainCategoryStatus}
                                                contentStatus={obj.contentStatus ? obj.contentStatus : "Not Started"}
                                                brochureStatus={obj.brochureStatus}
                                                designername={obj.brochureDesigner}
                                                refreshData={refreshData}
                                            /></td>
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
                                                nswsPassword={obj.nswsPaswsord ? obj.nswsPaswsord : "Please Enter Password"}
                                            />
                                        </td>

                                        <td>
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
                                                (parseInt(obj.firstPayment || 0, 10) + parseInt(obj.pendingRecievedPayment || 0, 10))
                                                    .toLocaleString('en-IN')
                                            )}
                                        </td>
                                        <td>
                                            ₹ {(
                                                (parseInt(obj.totalPaymentWGST || 0, 10) -
                                                    (parseInt(obj.firstPayment || 0, 10) +
                                                        parseInt(obj.pendingRecievedPayment || 0, 10)))
                                            ).toLocaleString('en-IN')
                                            }
                                        </td>
                                        <td>cd
                                            {obj.subCategoryStatus === "2nd Time Submitted" ? "2nd" :
                                                obj.subCategoryStatus === "3rd Time Submitted" ? "3rd" :
                                                    "1st"}
                                        </td>
                                        <td>
                                            {obj.subCategoryStatus === "Submitted" ? (
                                                obj.submittedOn ? `${formatDateNew(obj.submittedOn)} | ${formatTime(obj.submittedOn)}` : `${formatDateNew(new Date())} | ${formatTime(new Date())}`
                                            ) : obj.subCategoryStatus === "2nd Time Submitted" ? (
                                                obj.SecondTimeSubmitDate ? `${formatDateNew(obj.SecondTimeSubmitDate)} | ${formatTime(obj.SecondTimeSubmitDate)}` : `${formatDateNew(new Date())} | ${formatTime(new Date())}`
                                            ) : obj.subCategoryStatus === "3rd Time Submitted" ? (
                                                obj.ThirdTimeSubmitDate ? `${formatDateNew(obj.ThirdTimeSubmitDate)} | ${formatTime(obj.ThirdTimeSubmitDate)}` : `${formatDateNew(new Date())} | ${formatTime(new Date())}`
                                            ) : obj.ThirdTimeSubmitDate ? `${formatDateNew(obj.ThirdTimeSubmitDate)} | ${formatTime(obj.ThirdTimeSubmitDate)}` : null}
                                        </td>
                                 <td>{employeeData ? employeeData.ename : "RM-CERT"}</td>
                                        <td className="rm-sticky-action">
                                            <button className="action-btn action-btn-primary">
                                                <FaRegEye />
                                            </button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>)
                        :
                        (!openBacdrop && (
                            <table className='no_data_table'>
                                <div className='no_data_table_inner'>
                                    <Nodata />
                                </div>
                            </table>)
                        )}
                </div>
            </div>
            {/* --------------------------------------------------------------dialog to view remarks only on forwarded status---------------------------------- */}

            <Dialog className='My_Mat_Dialog'
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
            </Dialog>
        </div>
    )
}

export default RmofCertificationSubmittedPanel;