import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header/Header';
import Navbar from '../Navbar/Navbar';
import { format } from 'date-fns';
import { TiUserAddOutline } from "react-icons/ti";
import AddAttendance from "../Attendance/AddAttendance"
import ViewAttendance from "../Attendance/ViewAttendance"
import { IoMdArrowRoundBack } from "react-icons/io";

function Attendance() {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const userId = localStorage.getItem("hrUserId");

    useEffect(() => {
        document.title = `HR-Sahay-CRM`;
    }, []);

    const currentYear = new Date().getFullYear();
    const currentMonth = format(new Date(), 'MMMM'); // e.g., 'August'

    const [isLoading, setIsLoading] = useState(false);
    const [employee, setEmployee] = useState([]);
    const [myInfo, setMyInfo] = useState([]);
    const [employeeInfo, setEmployeeInfo] = useState([]);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [months, setMonths] = useState([])
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedDate, setSelectedDate] = useState("");
    const [showAddAttendance, setShowAddAttendance] = useState(false);

    const fetchSelectedDate = (date, employeeData) => {
        // console.log("Selected date from attendance component is :", date);
        setSelectedDate(date);
        setEmployeeInfo(employeeData);
        // console.log("Fetched employees are :", employeeData);
        setShowAddAttendance(true);
    };

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

    const handleYearChange = (e) => {
        setSelectedYear(Number(e.target.value));
        monthArray(Number(e.target.value));
    };
    const monthArray = (selectedYear) => {
        const months = [];
        let date;
    
        // Check if the selected year is the current year
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth(); // Get the current month (0-based)
    
        if (selectedYear === currentYear) {
            // Start from the previous month (or current month if it's January)
            const startMonth = currentMonth > 0 ? currentMonth - 1 : 0;
    
            for (let month = startMonth; month <= 11; month++) {
                months.push(format(new Date(selectedYear, month), 'MMMM'));
            }
        } else {
            // For other years, include all months
            for (let month = 0; month <= 11; month++) {
                months.push(format(new Date(selectedYear, month), 'MMMM'));
            }
        }
    
        setMonths(months);
        return months;
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    // Generate the years array starting from 2020 to the current year
    const years = ["2024" , "2025"];
    // for (let year = 2020; year <= currentYear; year++) {
    //     years.push(year);
    // }

    useEffect(() => {
        fetchEmployee();
        fetchPersonalInfo();
        monthArray(currentYear);
    }, []);

    return (
        <div>
            {/* <Header id={myInfo._id} name={myInfo.ename} empProfile={myInfo.profilePhoto && myInfo.profilePhoto.length !== 0 && myInfo.profilePhoto[0].filename} gender={myInfo.gender} designation={myInfo.newDesignation} />
            <Navbar /> */}
            <div className="page-wrapper">
                <div className="page-header rm_Filter d-print-none m-0">
                    <div className="container-xl">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className='d-flex align-items-center justify-content-between'>
                                <div className='form-group ml-1'>
                                    <select className='form-select' value={selectedYear} onChange={handleYearChange}>
                                        <option disabled>--Select Year--</option>
                                        {years.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='form-group ml-1'>
                                    <select className='form-select' value={selectedMonth} onChange={handleMonthChange}>
                                        <option disabled>--Select Month--</option>
                                        {months.map(month => (
                                            <option key={month} value={month}>{month}</option>
                                        ))}
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
                                <div className="btn-group ml-1">
                                    {showAddAttendance && (
                                        <button
                                            type="button"
                                            className="btn mybtn"
                                            onClick={() => {
                                                setShowAddAttendance(false);
                                                setEmployeeInfo([]);
                                                setSelectedDate("");
                                            }}>
                                            <IoMdArrowRoundBack className='mr-1' /> Back
                                        </button>
                                    )}
                                    {!showAddAttendance &&
                                        <button type="button" className="btn mybtn" onClick={() => {
                                            setShowAddAttendance(true);
                                            setEmployeeInfo(employee);
                                        }}>
                                            <TiUserAddOutline className='mr-1' /> Add Attendance
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-body m-0">
                    <div className="container-xl mt-2">
                        {(!showAddAttendance) && 
                        <ViewAttendance 
                        year={selectedYear}
                         month={selectedMonth} 
                         date={fetchSelectedDate} />}
                        {showAddAttendance && 
                        <AddAttendance 
                        year={selectedYear} 
                        month={selectedMonth} 
                        date={selectedDate} 
                        employeeData={employeeInfo} />}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Attendance