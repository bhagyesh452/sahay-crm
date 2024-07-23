import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Header from "./Header";
import { useState } from "react";
import NewCard from "./NewCard";
import axios from "axios";
import NewGCard from "./NewGcard";
import ApproveCard from "./ApproveCard";
import Nodata from "../components/Nodata";
import EditBookingsCard from "./EditBookingsCard";
import EditBookingPreview from "./EditBookingPreview";
import DeleteBookingComponent from "./NotiComponents/DeleteBookingComponent";
import io from "socket.io-client";
import General_dataComponent from "./NotiComponents/General_dataComponent";
import Manual_dataComponent from "./NotiComponents/Manual_dataComponent";
import Approve_dataComponents from "./NotiComponents/Approve_dataComponents";
import Booking_editComponents from "./NotiComponents/Booking_editComponents";
import { useLocation } from 'react-router-dom';
import PaymentApprovalComponent from "./NotiComponents/PaymentApprovalComponent";


function ShowNotification() {
  const location = useLocation();
  const { dataStatus } = location.state || {};
  const [RequestData, setRequestData] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [compareBooking, setCompareBooking] = useState(null);
  const [RequestGData, setRequestGData] = useState([]);
  const [bookingIndex, setBookingIndex] = useState(0);
  const [moreBookingCase, setMoreBookingCase] = useState(false);
  const [RequestApprovals, setRequestApprovals] = useState([]);
  const [currentCompany, setCurrentCompany] = useState("");
  const [openRequest, setOpenRequest] = useState(false);
  const [editData, setEditData] = useState([]);
  const [mapArray, setMapArray] = useState([]);
  const [dataType, setDataType] = useState(dataStatus || "General");
  const [deleteData, setDeleteData] = useState([]);
  const [fetchBookingRequests, setfetchBookingRequests] = useState(false);

  const [totalBookings, setTotalBookings] = useState([])
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const fetchRequestDetails = async () => {
    try {
      const response = await axios.get(`${secretKey}/requests/requestData`);
      setRequestData(response.data.reverse());
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  const fetchCompareBooking = async () => {
    try {
      const response = await axios.get(`${secretKey}/bookings/redesigned-final-leadData`);
      if (moreBookingCase) {
        const bookingObject = response.data.find(obj => obj["Company Name"] === currentCompany);
        setCompareBooking(bookingObject.moreBooking[bookingIndex - 1]);
      } else {
        setCompareBooking(response.data.find(obj => obj["Company Name"] === currentCompany));
      }

    } catch (error) {
      console.error("Error fetching Current Booking", error.message);
    }
  }
  
  useEffect(() => {
    fetchCompareBooking();
    setCurrentBooking(totalBookings.find(obj => obj["Company Name"] === currentCompany));
  }, [currentCompany]);

  const fetchRequestGDetails = async () => {
    try {
      const response = await axios.get(`${secretKey}/requests/requestgData`);
      setRequestGData(response.data.reverse());
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const fetchEditRequests = async () => {
    try {
      const response = await axios.get(`${secretKey}/bookings/editable-LeadData`);
      setTotalBookings(response.data);
      const uniqueEnames = response.data.reduce((acc, curr) => {
        if (!acc.some((item) => item.requestBy === curr.requestBy)) {
          const newDate = new Date(curr.requestDate).toLocaleDateString();
          const newTime = new Date(curr.requestDate).toLocaleTimeString();
          acc.push({
            ename: curr.requestBy,
            date: newDate,
            time: newTime,
            companyName: curr["Company Name"],
          });
        }
        return acc;
      }, []);
      setEditData(uniqueEnames);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchApproveRequests = async () => {
    try {
      const response = await axios.get(`${secretKey}/requests/requestCompanyData`);
      setRequestApprovals(response.data.reverse());
      const uniqueEnames = response.data.reduce((acc, curr) => {
        if (!acc.some((item) => item.ename === curr.ename)) {
          const [dateString, timeString] = formatDateAndTime(
            curr.AssignDate
          ).split(", ");
          acc.push({ ename: curr.ename, date: dateString, time: timeString });
        }
        return acc;
      }, []);
      setMapArray(uniqueEnames);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };


  const formatDateAndTime = (AssignDate) => {
    // Convert AssignDate to a Date object
    const date = new Date(AssignDate);

    // Convert UTC date to Indian time zone
    const options = { timeZone: "Asia/Kolkata" };
    const indianDate = date.toLocaleString("en-IN", options);
    return indianDate;
  };

  useEffect(() => {
    fetchRequestDetails();
    fetchRequestGDetails();
    fetchApproveRequests();

    fetchEditRequests();
  }, []);

  
  const [expandedRow, setExpandedRow] = useState(null);

  const handleRowClick = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };
  // setEnameArray(uniqueEnames);

  return (
    <div>
      {" "}
      <Header />
      <Navbar />
      <div className="page-wrapper">
        <div className="page-header">
          <div className="container-xl">
            {/* <!-- Page pre-title --> */}
            <h2 className="page-title">Notifications</h2>
          </div>
        </div>
        <div className="container-xl">
          <div class="card-header mt-2">
            <ul class="nav nav-tabs card-header-tabs nav-fill noti-nav" data-bs-toggle="tabs"  >
              <li class="nav-item data-heading">
                <a
                  href="#tabs-home-5"
                  className={
                    dataType === "General"
                      ? "nav-link item-act4-noti"
                      : "nav-link"
                  }
                  data-bs-toggle="tab"
                  onClick={() => {
                    setDataType("General");
                  }}
                >
                  General Data
                </a>
              </li>
              <li class="nav-item data-heading">
                <a
                  href="#tabs-home-5"
                  className={
                    dataType === "Manual"
                      ? "nav-link item-act3-noti"
                      : "nav-link"
                  }
                  data-bs-toggle="tab"
                  onClick={() => {
                    setDataType("Manual");
                  }}
                >
                  Manual Data
                </a>
              </li>
              <li class="nav-item data-heading">
                <a
                  href="#tabs-home-5"
                  className={
                    dataType === "AddRequest"
                      ? "nav-link item-act2-noti"
                      : "nav-link"
                  }
                  style={dataType === "AddRequest" ? {
                    color: "yellow",
                    fontWeight: "bold",
                    border: "1px solid yellow",
                    backgroundColor: "yellow"
                  } : {}}
                  data-bs-toggle="tab"
                  onClick={() => {
                    setDataType("AddRequest");
                  }}
                >
                  Approve Requests
                </a>
              </li>
              <li class="nav-item data-heading">
                <a
                  href="#tabs-home-5"
                  className={
                    dataType === "deleteBookingRequests"
                      ? "nav-link item-act-noti"
                      : "nav-link"
                  }
                  style={dataType === "deleteBookingRequests" ? {
                    color: "#ff8080",
                    fontWeight: "bold",
                    border: "1px solid #ffb0b0",
                    backgroundColor: "#fff4f4"
                  } : {}}
                  data-bs-toggle="tab"
                  onClick={() => {
                    setDataType("deleteBookingRequests");
                  }}
                >
                  Delete Booking Requests
                </a>
              </li>
              <li class="nav-item data-heading">
                <a
                  href="#tabs-home-5"
                  className={
                    dataType === "editBookingRequests"
                      ? "nav-link item-act5-noti"
                      : "nav-link"
                  }
                  data-bs-toggle="tab"
                  onClick={() => {
                    setDataType("editBookingRequests");
                  }}
                >
                  Bookings Edit Requests
                </a>
              </li>
              <li class="nav-item data-heading">
                <a
                  href="#tabs-home-5"
                  className={
                    dataType === "paymentApprovalRequests"
                      ? "nav-link item-act6-noti"
                      : "nav-link"
                  }
                  data-bs-toggle="tab"
                  onClick={() => {
                    setDataType("paymentApprovalRequests");
                  }}
                >
                Payment Approval Requests
                </a>
              </li>
            </ul>
          </div>
          <div className="maincontent"  >
            {dataType === "Manual" && <Manual_dataComponent />}
            {dataType === "General" && <General_dataComponent />}
            {dataType === "deleteBookingRequests" && <DeleteBookingComponent />}
            {dataType === "editBookingRequests" && <Booking_editComponents />}
            {dataType === "editBookingRequests" &&
              editData.length !== 0 && currentBooking && compareBooking &&
              <EditBookingPreview requestedBooking={currentBooking} existingBooking={currentBooking.bookingIndex !== 0 ? compareBooking.moreBookings[(currentBooking.bookingIndex - 1)] : compareBooking} setCurrentBooking={setCurrentBooking} setCompareBooking={setCompareBooking} setCurrentCompany={setCurrentCompany} />
            }
            {dataType === "AddRequest" && <Approve_dataComponents />}
            {dataType === "paymentApprovalRequests" && <PaymentApprovalComponent />}

          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowNotification;
