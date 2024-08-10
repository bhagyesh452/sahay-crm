import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Header from '../Header/Header';
import Navbar from '../Navbar/Navbar';
import Nodata from '../../../components/Nodata';
import ClipLoader from "react-spinners/ClipLoader";
import { IoFilterOutline } from "react-icons/io5";
import { format } from 'date-fns';
import { TiUserAddOutline } from "react-icons/ti";
import { FaEye } from "react-icons/fa";
import EmpDfaullt from "../../../static/EmployeeImg/office-man.png";
import FemaleEmployee from "../../../static/EmployeeImg/woman.png";
import AddAttendance from "../Attendance/AddAttendance"
import ViewAttendance from "../Attendance/ViewAttendance"

function Attendance() {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const userId = localStorage.getItem("hrUserId");

    const [isLoading, setIsLoading] = useState(false);
    const [employee, setEmployee] = useState([]);
    const [myInfo, setMyInfo] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [monthDates, setMonthDates] = useState([]);
    const [showAddAttendance, setShowAddAttendance] = useState(false);
    const [showViewAttendance, setShowViewAttendance] = useState(false);

    const fetchPersonalInfo = async () => {
        try {
            const res = await axios.get(`${secretKey}/employee/fetchEmployeeFromId/${userId}`);
            // console.log("Fetched details is :", res.data.data);
            setMyInfo(res.data.data);
        } catch (error) {
            console.log("Error fetching employee details :", error);
        }
    };

    const fetchEmployee = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${secretKey}/employee/einfo`);
            setEmployee(res.data);
            // console.log("Fetched Employees are:", employeeData);
        } catch (error) {
            console.log("Error fetching employees data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const generateDatesForMonth = (monthIndex) => {
        const currentYear = new Date().getFullYear();
        const date = new Date(currentYear, monthIndex, 0); // Last day of the selected month
        const totalDays = date.getDate();
        const dates = [];

        for (let i = 1; i <= totalDays; i++) {
            const currentDate = new Date(currentYear, monthIndex - 1, i);
            const formattedDate = format(currentDate, "do MMM - EEEE");
            dates.push(formattedDate);
        }

        setMonthDates(dates);
    };

    const handleMonthChange = (event) => {
        const monthIndex = parseInt(event.target.value);
        setSelectedMonth(monthIndex);
        generateDatesForMonth(monthIndex);
    };

    useEffect(() => {
        fetchEmployee();
        fetchPersonalInfo();
        generateDatesForMonth(selectedMonth); // Generate dates for the current month by default
    }, [selectedMonth]);

    return (
        <div>
            <Header id={myInfo._id} name={myInfo.ename} empProfile={myInfo.profilePhoto && myInfo.profilePhoto.length !== 0 && myInfo.profilePhoto[0].filename} gender={myInfo.gender} designation={myInfo.newDesignation} />
            <Navbar />
            <div className="page-wrapper">
                <div className="page-header  d-print-none">
                    <div className="container-xl">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className='btn-group'>
                                <button type="button" class="btn mybtn" onClick={() => {
                                    setShowAddAttendance(true);
                                    setShowViewAttendance(false);
                                }}
                                >
                                    <TiUserAddOutline className='mr-1' /> Add Attendance
                                </button>
                                <button type="button" class="btn mybtn" onClick={() => {
                                    setShowViewAttendance(true);
                                    setShowAddAttendance(false);
                                }}
                                >
                                    <FaEye className='mr-1' /> View Attendance
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-body m-0">
                    <div className="container-xl">
                        {showAddAttendance && <AddAttendance />}
                        {showViewAttendance && <ViewAttendance />}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Attendance