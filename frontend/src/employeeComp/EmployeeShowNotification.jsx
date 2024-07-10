import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import EmpNav from './EmpNav';
import { useLocation, useParams } from "react-router-dom";
import axios from 'axios';
import EmployeeGeneralDataComponent from './EmployeeNotificationComponents/EmployeeGeneralDataComponent';
import EmployeeApproveDataComponent from './EmployeeNotificationComponents/EmployeeApproveDataComponent';
import EmployeeBookingEditCopmonent from './EmployeeNotificationComponents/EmployeeBookingEditCopmonent';
import EmployeeDeleteBookingComponent from './EmployeeNotificationComponents/EmployeeDeleteBookingComponent';





function EmployeeShowNotification() {
    const location = useLocation();
    const { userId } = useParams();
    const { employeeDataStatus } = location.state || {};
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [data, setData] = useState([]);
    const [employeeName, setEmployeeName] = useState("");
    const [dataType, setDataType] = useState(employeeDataStatus || "General");
   




    //------------------fetching function--------------------
    const fetchData = async () => {
        try {
            const response = await axios.get(`${secretKey}/employee/einfo`);


            // Set the retrieved data in the state
            const tempData = response.data;
            const userData = tempData.find((item) => item._id === userId);
            setEmployeeName(userData.ename)
            //console.log(userData);
            setData(userData);
            //console.log(userData.bdmName)
            //console.log("data" , userData)

        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };
    useEffect(() => {

        fetchData()
    }, [])




// console.log("boom" , employeeName)  






    return (
        <div>
            <Header name={data.ename} empProfile={data.employee_profile && data.employee_profile.length !== 0 && data.employee_profile[0].filename} designation={data.designation} />
            <EmpNav userId={userId} bdmWork={data.bdmWork} />
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
                                        dataType === "ApproveRequest"
                                            ? "nav-link item-act2-noti"
                                            : "nav-link"
                                    }
                                    style={dataType === "ApproveRequest" ? {
                                        color: "yellow",
                                        fontWeight: "bold",
                                        border: "1px solid yellow",
                                        backgroundColor: "yellow"
                                    } : {}}
                                    data-bs-toggle="tab"
                                    onClick={() => {
                                        setDataType("ApproveRequest");
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
                        </ul>
                    </div>
                    <div className="maincontent"  >
                        {dataType === "General" && <EmployeeGeneralDataComponent ename={employeeName} />}
                        {dataType === "ApproveRequest" && <EmployeeApproveDataComponent ename={employeeName} />}
                        {/* {dataType === "ApproveRequest" && <EmployeeApproveComponentPro ename={employeeName} />} */}
                        {dataType === "deleteBookingRequests" && <EmployeeDeleteBookingComponent ename={employeeName} />}
                        {dataType === "editBookingRequests" && <EmployeeBookingEditCopmonent ename={employeeName} />}
                        {/* {dataType === "editBookingRequests" &&
                            editData.length !== 0 && currentBooking && compareBooking &&
                            <EditBookingPreview requestedBooking={currentBooking} existingBooking={currentBooking.bookingIndex !== 0 ? compareBooking.moreBookings[(currentBooking.bookingIndex - 1)] : compareBooking} setCurrentBooking={setCurrentBooking} setCompareBooking={setCompareBooking} setCurrentCompany={setCurrentCompany} />
                        } */}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeeShowNotification