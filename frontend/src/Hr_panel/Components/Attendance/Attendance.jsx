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
import { IoMdArrowRoundBack } from "react-icons/io";

function Attendance() {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const userId = localStorage.getItem("hrUserId");

    const [isLoading, setIsLoading] = useState(false);
    const [employee, setEmployee] = useState([]);
    const [myInfo, setMyInfo] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [monthDates, setMonthDates] = useState([]);

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
                <div className="page-header rm_Filter d-print-none m-0">
                    <div className="container-xl">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className='d-flex align-items-center justify-content-between'>
                                <div className='form-group ml-1'>
                                    <select className='form-select'>
                                        <option>--Select Year--</option>
                                        <option>2024</option>
                                    </select>
                                </div>
                                <div className='form-group ml-1'>
                                    <select className='form-select'>
                                        <option>--Select Month--</option>
                                        <option>January</option>
                                    </select>
                                </div>
                            </div>  
                            <div className='d-flex align-items-center justify-content-between'>
                                <div class="input-icon ml-1">
                                    <span class="input-icon-addon">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon mybtn" width="18" height="18" viewBox="0 0 22 22" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                                        <path d="M21 21l-6 -6"></path>
                                    </svg>
                                    </span>
                                    <input
                                    className="form-control search-cantrol mybtn"
                                    placeholder="Search…"
                                    type="text"
                                    name="bdeName-search"
                                    id="bdeName-search" />
                                </div>
                                <div className='btn-group ml-1'>
                                    <button type="button" class="btn mybtn" >
                                        <IoMdArrowRoundBack className='mr-1' /> Back
                                    </button>
                                    <button type="button" class="btn mybtn" >
                                        <TiUserAddOutline className='mr-1' /> Add Attendance
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-body m-0">
                    <div className="container-xl mt-2">
                        <ViewAttendance/>
                        <AddAttendance />
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Attendance