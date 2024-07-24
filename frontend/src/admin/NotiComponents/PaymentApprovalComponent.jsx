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
import { GrFormView } from "react-icons/gr";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { IoIosClose } from 'react-icons/io';
import Select from "react-select";
import { options } from '../../components/Options';

function PaymentApprovalComponent() {

  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [deletedData, setDeletedData] = useState([]);
  const [filterBy, setFilterBy] = useState("Pending");
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [id, setId] = useState("");
  const [showAdminRemarks, setShowAdminRemarks] = useState(false);
  const [openPaymentApproval, setOpenPaymentApproval] = useState(false);
  const [ename, setEname] = useState("");
  const [designation, setDesignation] = useState("");
  const [branchOffice, setBranchOffice] = useState("");
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
  // const [data, setData] = useState(deletedData.filter((obj) => obj.request === false));
  // const [totalData, setTotalData] = useState(deletedData.filter((obj) => obj.request === false));

  const handleClosePaymentApproval = () => {
    setOpenPaymentApproval(false);
  };

  const handleCloseAdminRemarks = () => {
    setShowAdminRemarks(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!requestedCompanyName) newErrors.requestedCompanyName = "Company Name is required.";
    if (serviceType.length === 0) newErrors.serviceType = "At least one Service Type is required.";
    if (!minimumPrice) newErrors.minimumPrice = "Minimum Price is required.";
    if (!requestedPrice) newErrors.requestedPrice = "Requested Price is required.";
    if (!requesteType) newErrors.requesteType = "Requested Type is required.";

    setPaymentApprovalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchPaymentApprovalRequests = async () => {
    try {
      const response = await axios.get(`${secretKey}/requests/paymentApprovalRequestByBde`);
      const tempData = response.data.reverse();
      console.log("tempData", tempData);
      setData(tempData);
      // setDeletedData(tempData); // Assuming your data is returned as an array
      // setData(filterBy === "Pending" ? tempData.filter(obj => obj.request === false) : tempData.filter(obj => obj.request === true));
      // setTotalData(filterBy === "Pending" ? tempData.filter(obj => obj.request === false) : tempData.filter(obj => obj.request === true));

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchOnePaymentApprovalRequest = async (id) => {
    setId(id);
    try {
      const response = await axios.get(`${secretKey}/requests/fetchPaymentApprovalRequestFromId/${id}`);
      const data = response.data.data;
      // console.log("Fetched data is :", data);
      setEname(data.ename || "");
      setDesignation(data.designation || "");
      setBranchOffice(data.branchOffice || "");
      setRequestedCompanyName(data.companyName || "");
      setServiceType(data.serviceType || []);
      setMinimumPrice(data.minimumPrice || 0);
      setRequestedPrice(data.clientRequestedPrice || 0);
      setRequesteType(data.requestType || "");
      setReason(data.reason || "");
      setRemarks(data.remarks || "");
      setFile(data.attachment || "");
    } catch (error) {
      console.log("Error fetching request");
    }
  };

  const handleAccept = async () => {
    setAssigned("Approved");
    setShowAdminRemarks(true);
  };

  const handleReject = async () => {
    setAssigned("Rejected");
    setShowAdminRemarks(true);
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const formData = new FormData();
        formData.append('ename', ename);
        formData.append('designation', designation);
        formData.append('branchOffice', branchOffice);
        formData.append('companyName', requestedCompanyName);
        formData.append('serviceType', serviceType);
        formData.append('minimumPrice', minimumPrice);
        formData.append('clientRequestedPrice', requestedPrice);
        formData.append('requestType', requesteType);
        formData.append('reason', reason);
        formData.append('remarks', remarks);
        formData.append('adminRemarks', adminRemarks);
        formData.append('requestDate', new Date());
        formData.append('assigned', assigned);
        if (file) {
          formData.append('attachment', file);
        }

        const response = await axios.put(`${secretKey}/requests/paymentApprovalRequestByBde/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (assigned === 'Approved') {
          Swal.fire("Request Approved", "The payment approval request has been approved successfully.", "success");
        } else if (assigned === 'Rejected') {
          Swal.fire("Request Rejected", "The payment approval request has been rejected.", "success");
        } else {
          Swal.fire("Request Status Unknown", "The status of the payment approval request is unknown.", "warning");
        }
        // console.log("response", response.data);

        handleCloseAdminRemarks();
        handleClosePaymentApproval();
        fetchPaymentApprovalRequests();
      } catch (error) {
        console.log("Error Posting Payment Approval Request", error);
      }
    }
  };

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  // ------------------------------------------   Fetching Functions --------------------------------------------------
  useEffect(() => {
    fetchPaymentApprovalRequests();
  }, []);

  useEffect(() => {
    const socket = secretKey === "http://localhost:3001/api" ? io("http://localhost:3001") : io("wss://startupsahay.in", {
      secure: true, // Use HTTPS
      path: '/socket.io',
      reconnection: true,
      transports: ['websocket'],
    });

    socket.on("payment-approval-requets-accept", () => {
      //console.log("One delete request came")
      fetchPaymentApprovalRequests(); // Same condition
    });

    socket.on("payment-approval-requets-reject", () => {
      //console.log("One delete request came")
      fetchPaymentApprovalRequests(); // Same condition
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    setData(filterBy === "Pending" ? deletedData.filter(obj => obj.request === false) : deletedData.filter(obj => obj.request === true));
    //setTotalData(filterBy === "Pending" ? deletedData.filter(obj => obj.request === false) : deletedData.filter(obj => obj.request === true));
  }, [filterBy]);

  useEffect(() => {
    if (searchText !== "") {
      //setData(totalData.filter(obj => obj.ename.toLowerCase().includes(searchText.toLowerCase())));
    } else {
      //setData(totalData)
    }
  }, [searchText]);

  const handleAcceptDeleteRequest = async (Id, bookingIndex) => {
    // Assuming you have an API endpoint for deleting a company
    try {
      const response = await fetch(
        `${secretKey}/bookings/redesigned-delete-all-booking/${Id}/${bookingIndex}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire({
        title: "Booking Deleted Successfully",
        icon: "success",
      });
      //fetchDataDelete();

    } catch (error) {
      Swal.fire({
        title: "Error Deleting the booking!",
        icon: "error",
      });
      console.error("Error deleting booking:", error);
      //fetchDataDelete();
      // Optionally, you can show an error message to the user
    }
  };

  const handleDeleteRequest = async (Id, companyName) => {
    try {
      const response = await axios.post(`${secretKey}/requests/deleterequestbybde/${Id}`,
        companyName
      );
      console.log("Deleted company:", response.data);
      Swal.fire({ title: "Request Rejected", icon: "success" });
      //fetchDataDelete();

      // Handle success or update state as needed
    } catch (error) {
      console.error("Error deleting company:", error);
      // Handle error
    }
  };

  function formatDateNew(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return (
    <div className="my-card mt-2">
      <div className="my-card-head p-2">
        <div className="filter-area d-flex justify-content-between w-100">
          <div className="filter-by-bde d-flex align-items-center">
            <div className='mr-2'>
              <label htmlFor="search_bde ">BDE : </label>
            </div>
            <div className='Notification_filter'>
              <input type="text" name="search_bde" id="search_bde" value={searchText} onChange={(e) => setSearchText(e.target.value)} className='form-control col-sm-8' placeholder='Please Enter BDE name' />
            </div>
          </div>
          <div className="filter-by-date d-flex align-items-center">
            <div className='mr-2'>
              <label htmlFor="search_bde "> Filter By : </label>
            </div>
            <div className='Notification_filter'>
              <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)} style={{ border: "1px solid #ffc8c8 " }} name="filter_requests" id="filter_requests" className="form-select">
                <option value="Pending" selected>Pending</option>
                <option value="Completed" >Completed</option>
              </select>
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
                <th>Requested By</th>
                <th>Requested On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.length !== 0 ? data.map((obj, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td className="text-muted">
                    {obj.companyName}
                  </td>
                  <td className="text-muted">
                    <div className="Notification-date d-flex align-items-center justify-content-center">

                      <RxAvatar style={{ fontSize: '16px' }} />

                      <div style={{ marginLeft: '5px' }} className="noti-text">
                        <b>
                          {obj.ename}
                        </b>
                      </div>
                    </div>

                  </td>
                  <td className="text-muted">
                    <div className="Notification-date d-flex align-items-center justify-content-center">

                      <MdDateRange style={{ fontSize: '16px' }} />

                      <div style={{ marginLeft: '5px' }} className="noti-text">
                        <b>
                          {formatDateNew(obj.requestDate)}
                        </b>
                      </div>
                    </div>

                  </td>
                  <td>
                    {/* {filterBy === "Pending" && <div className='d-flex align-items-center justify-content-center'>
                      <div className="Notification_acceptbtn" onClick={() => handleAcceptDeleteRequest(obj.companyID, obj.bookingIndex)}>
                        <TiTick />
                      </div>
                      <div className="Notification_rejectbtn" onClick={() => handleDeleteRequest(obj._id , obj.companyName)}>
                        <ImCross />
                      </div>
                    </div>}
                    {filterBy === "Completed" && <div className='d-flex align-items-center justify-content-center'>
                      <div className="Notification_completedbtn">
                        <IoCheckmarkDoneCircle />
                      </div>
                    </div>} */}
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


            </tbody>
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
                        <input type="file"
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
                        )}
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
            onClick={handleAccept}
            className="btn btn-primary ms-auto"
          >
            Accept
          </button>
          <button
            style={{ width: "100vw", borderRadius: "0px" }}
            onClick={handleReject}
            className="btn btn-danger ms-auto"
          >
            Reject
          </button>
        </div>
      </Dialog>

      {/* Remarks pop up*/}
      <Dialog className='My_Mat_Dialog'
        open={showAdminRemarks}
        onClose={handleCloseAdminRemarks}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <div className='d-flex justify-content-between align-items-center'>
            <span>Admin Remarks</span>
            <IconButton edge="end" color="inherit" onClick={handleCloseAdminRemarks} aria-label="close">
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <div class="card-footer">
            <div class="mb-3 remarks-input">
              <textarea
                placeholder="Add Remarks Here...  "
                className="form-control"
                id="remarks-input"
                rows="3"
                onChange={(e) => setAdminRemarks(e.target.value)}
              ></textarea>
            </div>
          </div>
        </DialogContent>
        <button
          onClick={handleSubmit}
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

export default PaymentApprovalComponent;