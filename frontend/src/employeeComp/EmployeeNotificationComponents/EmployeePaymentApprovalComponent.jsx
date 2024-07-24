import React, { useEffect, useState } from 'react';
import { MdDateRange } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import { RxAvatar } from "react-icons/rx";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import Swal from "sweetalert2";
import axios from "axios";
import io from "socket.io-client";
import Nodata from "../../components/Nodata";
import ClipLoader from "react-spinners/ClipLoader";
import { GrFormView } from "react-icons/gr";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PdfImageViewerAdmin from "../../admin/PdfViewerAdmin";
import pdfimg from "../../static/my-images/pdf.png";
import { FcList } from "react-icons/fc";
import wordimg from "../../static/my-images/word.png";
import { IoIosClose } from 'react-icons/io';
import Select from "react-select";
import { options } from '../../components/Options';


function EmployeePaymentApprovalComponent({ ename }) {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [paymentApprovalData, setPaymentApprovalData] = useState([])
    const [filteredPaymentApprovalData, setFilteredPaymentApprovalData] = useState([])
    const [currentDataLoading, setCurrentDataLoading] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [openPaymentApproval, setOpenPaymentApproval] = useState(false);
    const [requestedCompanyName, setRequestedCompanyName] = useState("");
    const [serviceType, setServiceType] = useState([]);
    const [minimumPrice, setMinimumPrice] = useState(0);
    const [requestedPrice, setRequestedPrice] = useState(0);
    const [requesteType, setRequesteType] = useState("");
    const [reason, setReason] = useState("");
    const [remarks, setRemarks] = useState("");
    const [adminRemarks, setAdminRemarks] = useState("");
    const [file, setFile] = useState("");
    const [assigned, setAssigned] = useState("Pending");
    const [paymentApprovalErrors, setPaymentApprovalErrors] = useState({});
    const [alreadyAssigned, setAlreadyAssigned] = useState(false)
    const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [branchOffice, setBranchOffice] = useState("");
  const [id, setId] = useState("");

    function parseDateString(dateString) {
        const [day, month, year] = dateString.split("/").map(Number);
        return new Date(year, month - 1, day);
    }

    function formatDate(timestamp) {
        const date = parseDateString(timestamp);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    const fetchPaymentApprovalRequests = async () => {
        try {
            setCurrentDataLoading(true)
            const response = await axios.get(`${secretKey}/requests/paymentApprovalRequestByBde/${ename}`)
            const tempData = response.data;
            //console.log("tempData", tempData)
            setPaymentApprovalData(tempData)
            setFilteredPaymentApprovalData(tempData)
        } catch (error) {
            console.log("Internal Server Error", error.message)
        } finally {
            setCurrentDataLoading(false)
        }
    }

    console.log("paymentApproval", paymentApprovalData)

    useEffect(() => {
        if (ename) {
            fetchPaymentApprovalRequests();
        }
    }, [ename])

    useEffect(() => {
        const socket = secretKey === "http://localhost:3001/api" ? io("http://localhost:3001") : io("wss://startupsahay.in", {
            secure: true, // Use HTTPS
            path: '/socket.io',
            reconnection: true,
            transports: ['websocket'],
        });


        socket.on("payment-approval-request", () => {
            fetchPaymentApprovalRequests(); // Same condition
        });

        socket.on("payment-approval-requets-accept", () => {
            fetchPaymentApprovalRequests(); // Same condition
        });

        socket.on("payment-approval-requets-reject", () => {
            fetchPaymentApprovalRequests(); // Same condition
        });


        return () => {
            socket.disconnect();
        };
    }, []);



    useEffect(() => {
        if (searchText) {
            //console.log(searchText)
            //console.log(filteredPaymentApprovalData)
            const filteredData = filteredPaymentApprovalData.filter(obj => {
                //console.log(obj.companyName); // Log the company name
                return obj.companyName?.toLowerCase().includes(searchText.toLowerCase());
            });
            setPaymentApprovalData(filteredData);
        } else {
            setPaymentApprovalData(filteredPaymentApprovalData); // Reset to original data if no search text
        }
    }, [searchText]);

    function formatDateNew(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const fetchOnePaymentApprovalRequest = async (id) => {
        setId(id);
        try {
            const response = await axios.get(`${secretKey}/requests/fetchPaymentApprovalRequestFromId/${id}`);
            const data = response.data.data;
            const attachmentFilename = data.attachments && data.attachments[0] ? data.attachments[0].split('\\').pop().split('/').pop() : "";
            console.log("approvalData", data, data.attachments[0])
            if (data.assigned === "Approved" || data.assigned === "Rejected") {
                setAlreadyAssigned(true)
            }
            // console.log("Fetched data is :", data);
            setName(data.ename || "");
            setDesignation(data.designation || "");
            setBranchOffice(data.branchOffice || "");
            setRequestedCompanyName(data.companyName || "");
            setServiceType(data.serviceType || []);
            setMinimumPrice(data.minimumPrice || 0);
            setRequestedPrice(data.clientRequestedPrice || 0);
            setRequesteType(data.requestType || "");
            setReason(data.reason || "");
            setRemarks(data.remarks || "");
            setFile(attachmentFilename || "");
        } catch (error) {
            console.log("Error fetching request");
        }
    };

    useEffect(() => {
        fetchPaymentApprovalRequests();
    }, []);

    const handleClosePaymentApproval = () => {
        setOpenPaymentApproval(false);
        setAlreadyAssigned(false)
    };

    function handleViewApprovalDocs(approvaldocs, companyName) {
        const pathname = approvaldocs;
        //console.log(pathname);
        window.open(`${secretKey}/bookings/approvaldocsnew/${companyName}/${pathname}`, "_blank");
      }

    return (
        <div className="my-card mt-2">
            <div className="my-card-head p-2">
                <div className="filter-area d-flex justify-content-between w-100">
                    <div className="filter-by-bde d-flex align-items-center">
                        <div className='mr-2'>
                            <label htmlFor="search_bde ">Company Name : </label>
                        </div>
                        <div className='Notification_filter'>
                            <input type="text" name="search_bde" id="search_bde" value={searchText} onChange={(e) => setSearchText(e.target.value)} className='form-control col-sm-8' placeholder='Please Enter Company Name' />
                        </div>
                    </div>
                </div>
            </div>
            <div className='my-card-body p-2'>
                <div className='Notification-table-main table-resposive'>
                    <table className="table Payment-Notification-table m-0">
                        <thead>
                            <tr>
                                <th>Sr. No</th>
                                <th>Company Name</th>
                                <th>Requested On</th>
                                <th>Admin Remarks</th>
                                <th>Status</th>
                                <th>View</th>
                            </tr>
                        </thead>
                        {currentDataLoading ? (<body>
                            <tr>
                                <td colSpan="4" >
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
                        </body>)
                            :
                            (<tbody>
                                {paymentApprovalData.length !== 0 ? paymentApprovalData.map((obj, index) => (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td className="text-muted">
                                            {obj.companyName}
                                        </td>
                                        <td className="text-muted">
                                            <div className="Notification-date d-flex align-items-center justify-content-center">
                                                <div style={{ marginLeft: '5px' }} className="noti-text">
                                                    <b>
                                                        {formatDateNew(obj.requestDate)}
                                                    </b>
                                                </div>
                                            </div>

                                        </td>
                                        <td>{obj.adminRemarks && obj.adminRemarks !== "" ? obj.adminRemarks : "N/A"}</td>
                                        <td style={{ color: obj.assigned === "Rejected" ? "red" : "inherit" }}>
                                            {obj.assigned}
                                        </td>
                                        <td>
                                            <div>
                                                <GrFormView onClick={() => {
                                                    setOpenPaymentApproval(true)
                                                    fetchOnePaymentApprovalRequest(obj._id)
                                                }
                                                } style={{ width: "16px", height: "16px", cursor: "pointer" }} />
                                            </div>
                                        </td>
                                    </tr>
                                )) : <tr>
                                    <td colSpan={5}>
                                        <span
                                            style={{
                                                textAlign: "center",
                                                fontSize: "25px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            <Nodata />
                                        </span>
                                    </td>


                                </tr>}
                            </tbody>)}
                    </table>
                </div>
            </div>
            {/* -------------------- Dialog for payment request approval -------------------- */}
            <Dialog className='My_Mat_Dialog' open={openPaymentApproval} onClose={handleClosePaymentApproval} fullWidth maxWidth="md">
                <DialogTitle>
                    Payment Approval{" "}
                    <button style={{ background: "none", border: "0px transparent", float: "right" }} onClick={handleClosePaymentApproval} >
                        <IoIosClose style={{
                            height: "36px",
                            width: "32px",
                            color: "grey"
                        }} />
                    </button>
                </DialogTitle>

                <DialogContent>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-body">

                                <form action="/paymentApprovalRequestByBde" method="post" enctype="multipart/form-data">
                                    <div className="row">
                                        <div className="col-6">
                                            <div className="mb-3">
                                                <label className="form-label">Company Name <span style={{ color: "red" }}>*</span></label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="example-text-input"
                                                    placeholder="Your Company Name"
                                                    value={requestedCompanyName}
                                                    onChange={(e) => setRequestedCompanyName(e.target.value)}
                                                />
                                                {paymentApprovalErrors.requestedCompanyName && <div style={{ color: 'red' }}>{paymentApprovalErrors.requestedCompanyName}</div>}
                                            </div>
                                        </div>

                                        <div className="col-6">
                                            <div className="mb-3">
                                                <label className="form-label">Service Type <span style={{ color: "red" }}>*</span></label>
                                                <Select
                                                    isMulti
                                                    options={options}
                                                    className="basic-multi-select"
                                                    value={serviceType.map(value => ({ value, label: value }))}
                                                    onChange={(selectedOptions) => setServiceType(selectedOptions.map(option => option.value))}
                                                />
                                                {paymentApprovalErrors.serviceType && <div style={{ color: 'red' }}>{paymentApprovalErrors.serviceType}</div>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-4">
                                            <div className="mb-3">
                                                <label className="form-label">Minimum Price
                                                    <span style={{ color: "red" }}>*</span></label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="example-text-input"
                                                    placeholder="0"
                                                    value={minimumPrice}
                                                    onChange={(e) => setMinimumPrice(e.target.value)}
                                                />
                                                {paymentApprovalErrors.minimumPrice && <div style={{ color: 'red' }}>{paymentApprovalErrors.minimumPrice}</div>}
                                            </div>
                                        </div>

                                        <div className="col-4">
                                            <div className="mb-3">
                                                <label className="form-label">Requested Price
                                                    <span style={{ color: "red" }}>*</span></label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="example-text-input"
                                                    placeholder="0"
                                                    value={requestedPrice}
                                                    onChange={(e) => setRequestedPrice(e.target.value)}
                                                />
                                                {paymentApprovalErrors.requestedPrice && <div style={{ color: 'red' }}>{paymentApprovalErrors.requestedPrice}</div>}
                                            </div>
                                        </div>

                                        <div className="col-4">
                                            <div className="mb-3">
                                                <label className="form-label">Requested Type
                                                    <span style={{ color: "red" }}>*</span></label>
                                                <select className="form-control" id="exampleFormControlSelect1"
                                                    value={requesteType}
                                                    onChange={(e) => setRequesteType(e.target.value)}>
                                                    <option name="Select reqested type" disabled selected>Select reqested type</option>
                                                    <option name="lesser price">Lessar Price</option>
                                                    <option name="payment term change">Payment Term Change</option>
                                                    <option name="gst/non-gst issue">GST/Non-GST Issue</option>
                                                </select>
                                                {paymentApprovalErrors.requesteType && <div style={{ color: 'red' }}>{paymentApprovalErrors.requesteType}</div>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="mb-3">
                                                <label className="form-label">Reason</label>
                                                <textarea class="form-control"
                                                    id="exampleFormControlTextarea1"
                                                    rows="3"
                                                    value={reason}
                                                    onChange={(e) => setReason(e.target.value)}
                                                    placeholder="Reason for the discount, modification in payment terms, or GST/NON-GST issue"
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="col-lg-6">
                                            <div className="mb-3">
                                                <label className="form-label">Remarks</label>
                                                <textarea class="form-control"
                                                    id="exampleFormControlTextarea1"
                                                    rows="3"
                                                    value={remarks}
                                                    onChange={(e) => setRemarks(e.target.value)}
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="col-lg-4">
                                            <div className="mb-3">
                                                <label className="form-label">Attachment</label>
                                                {file && (
                                                    <div className="col-sm-4 mb-1">
                                                        <div className="booking-docs-preview">
                                                            <div
                                                                className="booking-docs-preview-img"
                                                                onClick={() => handleViewApprovalDocs(file, requestedCompanyName)}
                                                            >
                                                                {file && (
                                                                    (file.toLowerCase()).endsWith(".pdf") ? (
                                                                        <PdfImageViewerAdmin
                                                                            type="approvaldocs"
                                                                            path={file}
                                                                            companyName={requestedCompanyName}
                                                                        />
                                                                    ) : (
                                                                        (file.endsWith(".png") ||
                                                                            file.endsWith(".jpg") ||
                                                                            file.endsWith(".jpeg")) ? (
                                                                            <img
                                                                                src={`${secretKey}/bookings/approvaldocsnew/${requestedCompanyName}/${file}`}
                                                                                alt="Receipt Image"
                                                                            />
                                                                        ) : (
                                                                            <img
                                                                                src={wordimg}
                                                                                alt="Default Image"
                                                                            />
                                                                        )
                                                                    )
                                                                )
                                                                }
                                                            </div>
                                                            <div className="booking-docs-preview-text">
                                                                <p className="booking-img-name-txtwrap text-wrap m-auto m-0">
                                                                    {file}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}


                                                {/* <input type="file"
                          class="form-control-file"
                          id="exampleFormControlFile1"
                          name="attachment"
                          onChange={(e) => setFile(e.target.files[0])}
                          disabled
                        />
                        {file && (
                          <a href={`${secretKey}/${file}`} target="_blank" rel="noopener noreferrer">
                            {file}
                          </a>
                        )} */}
                                            </div>
                                        </div>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </DialogContent>
                <div className="d-flex">
                    <button
                        style={{ width: "100vw", borderRadius: "0px" }}
                        //onClick={handleAccept}
                        className="btn btn-primary ms-auto"
                        disabled
                    >
                        Submit
                    </button>
                </div>
            </Dialog>

        </div>
    )
}

export default EmployeePaymentApprovalComponent;