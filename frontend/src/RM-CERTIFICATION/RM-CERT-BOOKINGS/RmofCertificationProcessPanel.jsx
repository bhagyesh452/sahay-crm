import React, { useState, useEffect, useCallback } from 'react';
import { FaWhatsapp } from "react-icons/fa";
import StatusDropdown from "../Extra-Components/status-dropdown";
import DscStatusDropdown from "../Extra-Components/dsc-status-dropdown";
import ContentWriterDropdown from '../Extra-Components/ContentWriterDropdown';
import { FaRegEye } from "react-icons/fa";
import { CiUndo } from "react-icons/ci";
import axios from 'axios';
import io from 'socket.io-client';
import { Drawer, Icon, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import debounce from "lodash/debounce";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentStatusDropdown from '../Extra-Components/ContentStatusDropdown';
import NSWSEmailInput from '../Extra-Components/NSWSEmailInput';
import { VscSaveAs } from "react-icons/vsc";

function RmofCertificationProcessPanel() {

    const rmCertificationUserId = localStorage.getItem("rmCertificationUserId")
    const [employeeData, setEmployeeData] = useState([])
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [currentDataLoading, setCurrentDataLoading] = useState(false)
    const [isFilter, setIsFilter] = useState(false)
    const [rmServicesData, setRmServicesData] = useState([])
    const [newStatusProcess, setNewStatusProcess] = useState("Process")
    const [openRemarksPopUp, setOpenRemarksPopUp] = useState(false);
    const [currentCompanyName, setCurrentCompanyName] = useState("")
    const [currentServiceName, setCurrentServiceName] = useState("")
    const [remarksHistory, setRemarksHistory] = useState([])
    const [changeRemarks, setChangeRemarks] = useState("");
    const [historyRemarks, setHistoryRemarks] = useState([]);
    const [email, setEmail] = useState('');
    const [openEmailPopup, setOpenEmailPopup] = useState(false)


    function formatDate(dateString) {
        dateString = "2024-07-26"
        const [year, month, date] = dateString.split('-');
        return `${date}/${month}/${year}`
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
            fetchRMServicesData()
        });


        return () => {
            socket.disconnect();
        };
    }, [newStatusProcess]);


    const fetchData = async () => {
        try {
            const response = await axios.get(`${secretKey}/employee/einfo`);
            // Set the retrieved data in the state
            const tempData = response.data;
            console.log(tempData)
            const userData = tempData.find((item) => item._id === rmCertificationUserId);
            console.log(userData)
            setEmployeeData(userData);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };

    const fetchRMServicesData = async () => {
        try {
            setCurrentDataLoading(true)
            const response = await axios.get(`${secretKey}/rm-services/rm-sevicesgetrequest`)
            setRmServicesData(response.data.filter(item => item.mainCategoryStatus === "Process"))
            //console.log(response.data)
        } catch (error) {
            console.error("Error fetching data", error.message)
        } finally {
            setCurrentDataLoading(false)
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchRMServicesData()

    }, [employeeData])



    function formatDate(dateString) {
        const [year, month, date] = dateString.split('-');
        return `${date}/${month}/${year}`
    }

    //------------------------Remarks Popup Section-----------------------------
    const handleOpenRemarksPopup = async (companyName, serviceName) => {
        console.log("RemarksPopup")
    }
    const functionCloseRemarksPopup = () => {
        setOpenRemarksPopUp(false)
    }
    const debouncedSetChangeRemarks = useCallback(
        debounce((value) => {
            setChangeRemarks(value);
        }, 300), // Adjust the debounce delay as needed (e.g., 300 milliseconds)
        [] // Empty dependency array to ensure the function is memoized
    );

    const handleSubmitRemarks = async () => {
        console.log("changeremarks", changeRemarks)
        try {
            const response = await axios.post(`${secretKey}/rm-services/post-remarks-for-rmofcertification`, {
                currentCompanyName,
                currentServiceName,
                changeRemarks,
                updatedOn: new Date()
            });

            console.log("response", response.data);

            if (response.status === 200) {
                fetchRMServicesData();
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


    console.log("setnewsubstatus", newStatusProcess)

    const handleSubmitNSWSEmail = async (companyName, serviceName) => {
        console.log("email", email)
        try {
            const response = await axios.post(`${secretKey}/rm-services/post-save-nswsemail`, {
                companyName,
                serviceName,
                email
            });
            if (response.status === 200) {
                Swal.fire(
                    'Email Added!',
                    'The remarks have been successfully added.',
                    'success'
                );
            }
        } catch (error) {
            console.error("Error saving email:", error.message);

        }
    };




    const mycustomloop = Array(20).fill(null); // Create an array with 10 elements

    return (
        <div>
            <div className="RM-my-booking-lists">
                <div className="table table-responsive table-style-3 m-0">
                    <table className="table table-vcenter table-nowrap rm_table_inprocess">
                        <thead>
                            <tr className="tr-sticky">
                                <th className="rm-sticky-left-1">Sr.No</th>
                                <th className="rm-sticky-left-2">Booking Date</th>
                                <th className="rm-sticky-left-3">Company Name</th>
                                <th>Company Number</th>
                                <th>Company Email</th>
                                <th>CA Number</th>
                                <th>Service Name</th>
                                <th>Status</th>
                                <th>Remark</th>
                                <th>DSC Applicable</th>
                                <th>DSC Status</th>
                                <th>Content Writer</th>
                                <th>Content Status</th>
                                <th>Brochure Designer</th>
                                <th>Brochure Status</th>
                                <th>NSWS Email Id</th>
                                <th>NSWS Password</th>
                                <th>BDE Name</th>
                                <th>BDM name</th>
                                <th>Total Payment</th>
                                <th>received Payment</th>
                                <th>Pending Payment</th>
                                {/* <th className="rm-sticky-action">Action</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {rmServicesData && rmServicesData.map((obj, index) => (
                                <tr key={index}>
                                    <td className="rm-sticky-left-1"><div className="rm_sr_no">{index + 1}</div></td>
                                    <td className="rm-sticky-left-2">{formatDate(obj.bookingDate)}</td>

                                    <td className="rm-sticky-left-3"><b>{obj["Company Name"]}</b></td>

                                    <td>
                                        <div className="d-flex align-items-center justify-content-center wApp">
                                            <div>{obj["Company Number"]}</div>
                                            <a style={{ marginLeft: '10px', lineHeight: '14px', fontSize: '14px' }}>
                                                <FaWhatsapp />
                                            </a>
                                        </div>
                                    </td>
                                    <td>{obj["Company Email"]}</td>
                                    <td>{obj.caCase === "Yes" ? obj.caNumber : "Not Applicable"}</td>
                                    <td><b>{obj.serviceName}</b></td>
                                    <td>
                                        <div>

                                            {obj.mainCategoryStatus && obj.subCategoryStatus && (
                                                <StatusDropdown
                                                    mainStatus={obj.mainCategoryStatus}
                                                    subStatus={obj.subCategoryStatus}
                                                    setNewSubStatus={setNewStatusProcess}
                                                    companyName={obj["Company Name"]}
                                                    serviceName={obj.serviceName}
                                                />
                                            )}
                                        </div>
                                    </td>
                                    <td className="d-flex align-items-center justify-content-center wApp" >
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
                                        <button className='bdr-none' style={{ lineHeight: '10px', fontSize: '10px', backgroundColor: "transparent" }}
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
                                            <EditIcon style={{ width: "12px", height: "12px" }} />
                                        </button>




                                    </td>
                                    <td>{obj.withDSC ? "Yes" : "No"}</td>
                                    <td>
                                        <div>{obj.withDSC ? (
                                            <DscStatusDropdown
                                                companyName={obj["Company Name"]}
                                                serviceName={obj.serviceName}
                                                mainStatus={obj.mainCategoryStatus}
                                                dscStatus={obj.dscStatus}
                                            />) :
                                            ("Not Applicable")}</div>
                                    </td>
                                    <td><ContentWriterDropdown /></td>
                                    <td><ContentStatusDropdown
                                        companyName={obj["Company Name"]}
                                        serviceName={obj.serviceName}
                                        mainStatus={obj.mainCategoryStatus}
                                        contentStatus={obj.contentStatus}
                                    /></td>
                                    <td>Brochure Designer</td>
                                    <td>Brochure Status</td>
                                    <td className="d-flex align-items-center justify-content-center wApp">
                                        {openEmailPopup ? (<NSWSEmailInput
                                            companyName={obj["Company Name"]}
                                            serviceName={obj.serviceName}
                                            mainStatus={obj.mainCategoryStatus}
                                            nswsemail={obj.nswsMailId}
                                            emailPopupOpen={setOpenEmailPopup}
                                            openedPopup={openEmailPopup}
                                        />) : (
                                            <button className='bdr-none' style={{ lineHeight: '10px', fontSize: '10px', backgroundColor: "transparent" }}
                                            onClick={(e) => {
                                               setOpenEmailPopup(true)
                                            }}
                                        > Please Add Email Address
                                        <VscSaveAs style={{ width: "12px", height: "12px" }} />
                                        </button> 
                                        )}
                                        {/* <input type="email"
                                            value={obj.nswsMailId ? obj.nswsMailId : email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter NSWS Email Id"
                                        />
                                        <button className='bdr-none' style={{ lineHeight: '10px', fontSize: '10px', backgroundColor: "transparent" }}
                                            onClick={(e) => {
                                                handleSubmitNSWSEmail(
                                                    obj["Company Name"],
                                                    obj.serviceName
                                                )
                                            }}
                                        >
                                            <VscSaveAs style={{ width: "12px", height: "12px" }} />
                                        </button> */}
                                    </td>
                                    <td>NSWS Password</td>
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
                                    <td>₹ {obj.totalPaymentWGST}/-</td>
                                    <td>₹ {obj.firstPayment ? obj.firstPayment : obj.totalPaymentWGST}/-</td>
                                    <td>₹ {obj.firstPayment ? (obj.totalPaymentWGST - obj.firstPayment) : 0}/-</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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

export default RmofCertificationProcessPanel