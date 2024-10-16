import React, { useEffect } from "react";
import Header from "../../Components/Header/Header";
import Navbar from "../../Components/Navbar/Navbar";
import { useState } from "react";
import NewCard from "../../../admin/NewCard";
import axios from "axios";
import NewGCard from "../../../admin/NewGcard";
import ApproveCard from "../../../admin/ApproveCard";
import Nodata from "../../Components/Nodata/Nodata";
import EditBookingsCard from "../../../admin/EditBookingsCard";
import EditBookingPreview from "../../../admin/EditBookingPreview";
import DeleteBookingComponent from "../../../admin/NotiComponents/DeleteBookingComponent";
import Manual_dataComponent from "../../../admin/NotiComponents/Manual_dataComponent";
import General_dataComponent from "../../../admin/NotiComponents/General_dataComponent";
import Approve_dataComponents from "../../../admin/NotiComponents/Approve_dataComponents";
import Booking_editComponents from "../../../admin/NotiComponents/Booking_editComponents";
import PaymentApprovalComponent from "../../../admin/NotiComponents/PaymentApprovalComponent";



function NotificationDM() {
  const [RequestData, setRequestData] = useState([]);
  const [currentBooking , setCurrentBooking] = useState(null);
  const [compareBooking, setCompareBooking] = useState(null);
  const [RequestGData, setRequestGData] = useState([]);
  const [bookingIndex, setBookingIndex] = useState(0);
  const [moreBookingCase, setMoreBookingCase] = useState(false);
  const [RequestApprovals, setRequestApprovals] = useState([]);
  const [currentCompany, setCurrentCompany] = useState("");
  const [openRequest, setOpenRequest] = useState(false);
  const [editData, setEditData] = useState([]);
  const [mapArray, setMapArray] = useState([]);
  const [dataType, setDataType] = useState("General");
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
  const fetchCompareBooking = async()=>{
    try{
      const response = await axios.get(`${secretKey}/bookings/redesigned-final-leadData`);
      if(moreBookingCase){
        const bookingObject = response.data.find(obj=> obj["Company Name"] === currentCompany);
        setCompareBooking(bookingObject.moreBooking[bookingIndex-1]);
      }else{
        setCompareBooking(response.data.find(obj=> obj["Company Name"] === currentCompany));
      }
     
    }catch(error){
      console.error("Error fetching Current Booking" , error.message);
    }
  }
  // useEffect(() => {
  //   const socket = io("http://localhost:3001");
  

  //   socket.on("delete-booking-requested", () => {
  //     console.log("One delete request came")
  //     fetchDataDelete(); // Same condition
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);
  useEffect(() => {
    fetchCompareBooking();
   setCurrentBooking(totalBookings.find(obj=>obj["Company Name"] === currentCompany));
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

  // useEffect(()=>{
  //   if(fetchBookingRequests){
  //     fetchDataDelete();
  //     setfetchBookingRequests(false);
  //   }
  // },[fetchBookingRequests])
  const [expandedRow, setExpandedRow] = useState(null);

  const handleRowClick = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };
  const dataManagerName = localStorage.getItem("dataManagerName")
  return (
    <div>
      {" "}
      {/* <Header name={dataManagerName} />
      <Navbar /> */}
      
      <div className="page-wrapper">
        <div className="page-header">
          <div className="container-xl">
             {/* <!-- Page pre-title --> */}
             <h2 className="page-title">Notifications </h2>
          </div>
        </div>
        <div className="container-xl">
          <div class="card-header mt-2">
            <ul class="nav nav-tabs card-header-tabs nav-fill noti-nav"  data-bs-toggle="tabs"  >
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
            {dataType === "Manual" &&  <Manual_dataComponent/>}
            {/* {dataType === "Manual" &&
              RequestData.length !== 0 &&
              RequestData.map((company) => (s
                <NewCard
                  name={company.ename}
                  year={company.year}
                  ctype={company.ctype}
                  damount={company.dAmount}
                  id={company._id}
                  assignStatus={company.assigned}
                  cTime={company.cTime}
                  cDate={company.cDate}
                />
              ))} */}

            {/* {RequestGData.length !== 0 &&
              dataType === "General" &&
              RequestGData.map((company) => (
                <NewGCard
                  name={company.ename}
                  damount={company.dAmount}
                  id={company._id}
                  assignStatus={company.assigned}
                  cTime={company.cTime}
                  cDate={company.cDate}
                />
              ))} */}
              {dataType === "General" && <General_dataComponent/>}
            {/* {dataType === "deleteBookingRequests" &&
              deleteData.length !== 0 &&
              deleteData.map((company) => (
                <DeleteBookingsCard
                  request={company.request}
                  Id={company.companyID}
                  name={company.ename}
                  companyName={company.companyName}
                  date={company.date}
                  bookingIndex={company.bookingIndex}
                  time={company.time}
                />
              ))} */}
              {dataType === "deleteBookingRequests" && <DeleteBookingComponent/>}
              {dataType === "editBookingRequests" && <Booking_editComponents/>}
            {/* {dataType === "editBookingRequests" &&
              editData.length !== 0 && !currentBooking && !compareBooking &&
              editData.map((company) => (
                <EditBookingsCard                   
                  setCurrentCompany={setCurrentCompany}
                  date={company.date}
                  time={company.time}
                  name={company.ename} 
                  setBookingIndex = {setBookingIndex}
                  moreBookingCase={setMoreBookingCase}
                  bookingIndex={company.bookingIndex}
                  companyName={company.companyName}
                />
              ))}
              {dataType === "editBookingRequests" &&
              editData.length !== 0 && currentBooking && compareBooking &&
                <EditBookingPreview requestedBooking={currentBooking} existingBooking={currentBooking.bookingIndex!==0 ? compareBooking.moreBookings[(currentBooking.bookingIndex-1)] : compareBooking} setCurrentBooking={setCurrentBooking}  setCompareBooking={setCompareBooking} setCurrentCompany={setCurrentCompany}/>
              } */}
            {/* {mapArray.length !== 0 &&
              dataType === "AddRequest" &&
              mapArray.map((company) => (
                <ApproveCard
                  name={company.ename}
                  date={company.date}
                  time={company.time}
                /> 
              ))} */}
              {dataType === "AddRequest" &&  <Approve_dataComponents/>}
              {dataType === "paymentApprovalRequests" && <PaymentApprovalComponent />}

            {/* {RequestData.length === 0 && dataType === "Manual" && (
              <Nodata />
            )} */}
            {/* {RequestGData.length === 0 && dataType === "General" && (
              <span
                style={{
                  textAlign: "center",
                  fontSize: "25px",
                  fontWeight: "bold",
                }}
              >
                <Nodata />
              </span>
            )} */}
            
            {/* {deleteData.length === 0 &&
              dataType === "deleteBookingRequests" && (
                <span
                  style={{
                    textAlign: "center",
                    fontSize: "25px",
                    fontWeight: "bold",
                  }}
                >
                  <Nodata />
                </span>
              )} */}
         
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationDM;
