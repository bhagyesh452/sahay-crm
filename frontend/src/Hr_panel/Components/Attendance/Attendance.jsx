import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Header/Header';
import Navbar from '../Navbar/Navbar';
import { format, getMonth } from 'date-fns';
import { TiUserAddOutline } from "react-icons/ti";
import AddAttendance from "../Attendance/AddAttendance"
import ViewAttendance from "../Attendance/ViewAttendance"
import { IoMdArrowRoundBack } from "react-icons/io";
import * as XLSX from 'xlsx';
import { MdFileDownload } from "react-icons/md";


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
    const years = ["2024", "2025"];
    // for (let year = 2020; year <= currentYear; year++) {
    //     years.push(year);
    // }

    useEffect(() => {
        fetchEmployee();
        fetchPersonalInfo();
        monthArray(currentYear);
    }, []);

    const [attendanceData, setAttendanceData] = useState({});

    function getMonthName(monthNumber) {
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        return monthNames[monthNumber - 1]; // Subtract 1 since array indices start from 0
    }

    const monthNamesToNumbers = {
        "January": 1,
        "February": 2,
        "March": 3,
        "April": 4,
        "May": 5,
        "June": 6,
        "July": 7,
        "August": 8,
        "September": 9,
        "October": 10,
        "November": 11,
        "December": 12
    };

    const monthNumber = monthNamesToNumbers[selectedMonth];

    const officialHolidays = [
        '14-01-2024', '15-01-2024', '24-03-2024', '25-03-2024',
        '07-07-2024', '19-08-2024', '12-10-2024', '31-10-2024',
        '01-11-2024', '02-11-2024', '03-11-2024', '04-11-2024', '05-11-2024'
    ];

    const formatDateForHolidayCheck = (year, month, day) => {
        const formattedDay = day < 10 ? '0' + day : day;
        const formattedMonth = month < 10 ? '0' + month : month;
        return `${formattedDay}-${formattedMonth}-${year}`;
    };

   

    const fetchAttendance = async () => {
        try {
            const res = await axios.get(`${secretKey}/attendance/viewAllAttendance`);
            const attendanceData = res.data.data;
            const currentYear = new Date().getFullYear();

            // Filter attendance data for the given month (passed as a prop)
            const structuredAttendance = [];

            attendanceData.forEach(employee => {
                const { employeeName, years } = employee;

                years.forEach(yearData => {
                    if (yearData.year === currentYear) {
                        yearData.months.forEach(monthData => {
                            if (monthData.month === selectedMonth) {  // Use the month prop to filter

                                // Create three rows for each employee
                                const statusRow = {
                                    "Sr. No": employee._id,  // Adjust this based on your data
                                    "Employee Name": employeeName,
                                };
                                const inTimeRow = { "Employee Name": "In Time" };
                                const outTimeRow = { "Employee Name": "Out Time" };

                                // Step 1: Create a placeholder for all days in the month (1 to last day of the month)
                                const totalDaysInMonth = new Date(currentYear, monthNumber, 0).getDate();

                                // Step 2: Iterate through all days in the month in ascending order
                                for (let day = 1; day <= totalDaysInMonth; day++) {
                                    const selectedDate = new Date(currentYear, monthNumber - 1, day);
                                    const dayKey = `${day}-${selectedDate.toLocaleString('default', { weekday: 'short' })}`;

                                    // Check if the day already exists in the attendance data
                                    const dayData = monthData.days.find(d => d.date === day);

                                    // console.log("dayData is :", dayData);
                                    // Step 3: If day is found in the attendance data
                                    if (dayData) {
                                        statusRow[dayKey] = dayData.status || '';
                                        inTimeRow[dayKey] = dayData.inTime || '';
                                        outTimeRow[dayKey] = dayData.outTime || '';
                                    } else {
                                        // Step 4: Apply Sunday/Holiday logic if the day is not in attendance data
                                        const isSunday = selectedDate.getDay() === 0;
                                        const formattedSelectedDate = formatDateForHolidayCheck(currentYear, monthNumber, day);
                                        const isHoliday = officialHolidays.includes(formattedSelectedDate);

                                        if (isSunday || isHoliday) {
                                            let prevDay = day - 1;
                                            let nextDay = day + 1;
                                            const findPrevWorkingDay = (year, month, startDay) => {
                                                let currentDay = startDay;
                                                let currentMonth = month;
                                                let currentYear = year;

                                                while (true) {
                                                    if (currentDay < 1) {
                                                        currentMonth--;
                                                        if (currentMonth < 1) {
                                                            currentMonth = 12;
                                                            currentYear--;
                                                        }
                                                        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
                                                        currentDay = daysInPrevMonth;
                                                    }

                                                    const formattedDate = formatDateForHolidayCheck(currentYear, currentMonth, currentDay);
                                                    const dateToCheck = new Date(currentYear, currentMonth - 1, currentDay);
                                                    const isSunday = dateToCheck.getDay() === 0;
                                                    const isHoliday = officialHolidays.includes(formattedDate);

                                                    if (!isSunday && !isHoliday) {
                                                        break;
                                                    }

                                                    currentDay--;
                                                }

                                                return { day: currentDay, month: currentMonth, year: currentYear };
                                            };

                                            // Function to find next working day
                                            const findNextWorkingDay = (year, month, startDay) => {
                                                let currentDay = startDay;
                                                let currentMonth = month;
                                                let currentYear = year;

                                                while (true) {
                                                    const daysInCurrentMonth = new Date(currentYear, currentMonth, 0).getDate();

                                                    if (currentDay > daysInCurrentMonth) {
                                                        currentMonth++;
                                                        if (currentMonth > 12) {
                                                            currentMonth = 1;
                                                            currentYear++;
                                                        }
                                                        currentDay = 1; // Reset to the first day of the next month
                                                    }

                                                    const formattedDate = formatDateForHolidayCheck(currentYear, currentMonth, currentDay);
                                                    const dateToCheck = new Date(currentYear, currentMonth - 1, currentDay);
                                                    const isSunday = dateToCheck.getDay() === 0;
                                                    const isHoliday = officialHolidays.includes(formattedDate);

                                                    if (!isSunday && !isHoliday) {
                                                        break;
                                                    }

                                                    currentDay++;
                                                }

                                                return { day: currentDay, month: currentMonth, year: currentYear };
                                            };
                                            // Find previous and next working days
                                            const prevWorkingDate = findPrevWorkingDay(currentYear, monthNumber, prevDay);
                                            const nextWorkingDate = findNextWorkingDay(currentYear, monthNumber, nextDay);

                                            // Fetch attendance status for the previous and next working day
                                            const prevDayStatus = attendanceData.find(emp => emp._id === employee._id)?.years
                                                ?.find(yr => yr.year === prevWorkingDate.year)?.months
                                                ?.find(mn => mn.month === getMonthName(prevWorkingDate.month))?.days
                                                ?.find(d => d.date === prevWorkingDate.day)?.status;

                                            const nextDayStatus = attendanceData.find(emp => emp._id === employee._id)?.years
                                                ?.find(yr => yr.year === nextWorkingDate.year)?.months
                                                ?.find(mn => mn.month === getMonthName(nextWorkingDate.month))?.days
                                                ?.find(d => d.date === nextWorkingDate.day)?.status;

                                            console.log(prevWorkingDate, nextWorkingDate, prevDayStatus, nextDayStatus);
                                            // Apply sandwich logic for Sundays
                                            if (isSunday) {
                                                if (
                                                    (prevDayStatus === "Leave" && nextDayStatus === "Leave") ||
                                                    (prevDayStatus === "Leave" && nextDayStatus === "Half Day") ||
                                                    (prevDayStatus === "Half Day" && nextDayStatus === "Leave")
                                                ) {
                                                    statusRow[dayKey] = 'SL';  // Sunday Leave
                                                } else if (
                                                    (prevDayStatus === "Half Day" && nextDayStatus === "Half Day") ||
                                                    (prevDayStatus === "LCH" && nextDayStatus === "LCH") ||
                                                    (prevDayStatus === "LCH" && nextDayStatus === "Half Day") ||
                                                    (prevDayStatus === "Half Day" && nextDayStatus === "LCH")
                                                ) {
                                                    statusRow[dayKey] = 'SH';  // Sunday Half Day
                                                } else {
                                                    statusRow[dayKey] = 'S';  // Normal Sunday
                                                }
                                            }

                                            // Apply sandwich logic for Holidays
                                            if (isHoliday) {
                                                if (
                                                    (prevDayStatus === "Leave" && nextDayStatus === "Leave") ||
                                                    (prevDayStatus === "Leave" && nextDayStatus === "Half Day") ||
                                                    (prevDayStatus === "Half Day" && nextDayStatus === "Leave")
                                                ) {
                                                    statusRow[dayKey] = 'OHL';  // Official Holiday Leave
                                                } else if (
                                                    (prevDayStatus === "Half Day" && nextDayStatus === "Half Day") ||
                                                    (prevDayStatus === "LCH" && nextDayStatus === "LCH") ||
                                                    (prevDayStatus === "LCH" && nextDayStatus === "Half Day") ||
                                                    (prevDayStatus === "Half Day" && nextDayStatus === "LCH")
                                                ) {
                                                    statusRow[dayKey] = 'OHH';  // Official Holiday Half Day
                                                } else {
                                                    statusRow[dayKey] = 'OH';  // Normal Holiday
                                                }
                                            }
                                        }
                                    }
                                }
                                console.log("statusRow", statusRow);

                                // Step 5: Push three rows per employee (status, in time, out time)
                                structuredAttendance.push(statusRow);
                                structuredAttendance.push(inTimeRow);
                                structuredAttendance.push(outTimeRow);
                            }
                        });
                    }
                });
            });

            // Step 6: Set the final structured data in state
            setAttendanceData(structuredAttendance);
        } catch (error) {
            console.log("Error fetching attendance data", error);
        }
    };

    const downloadExcel = () => {
        const currentYear = new Date().getFullYear();
        const monthNumber = new Date(`${selectedMonth} 1, ${currentYear}`).getMonth() + 1;  
        const totalDaysInMonth = new Date(currentYear, monthNumber, 0).getDate();  
        const columns = ['Sr. No', 'Employee Name'];
    
        const worksheet = XLSX.utils.json_to_sheet(attendanceData, { header: columns });
    
        let rowIndex = 1;  
    
        if (attendanceData && attendanceData.length > 0) {
            for (let i = 0; i < attendanceData.length; i += 3) {
                const statusRow = attendanceData[i];
                const inTimeRow = attendanceData[i + 1];
                const outTimeRow = attendanceData[i + 2];
    
                const srNo = statusRow['Sr. No'];  
                const employeeName = statusRow['Employee Name'];  
    
                worksheet[`A${rowIndex + 1}`] = { v: srNo };  
                worksheet['!merges'] = worksheet['!merges'] || [];
                worksheet['!merges'].push({
                    s: { r: rowIndex, c: 0 },  
                    e: { r: rowIndex + 2, c: 0 }  
                });
    
                worksheet[`B${rowIndex + 1}`] = { v: employeeName };  
                worksheet[`B${rowIndex + 2}`] = { v: "In Time" };     
                worksheet[`B${rowIndex + 3}`] = { v: "Out Time" };    
    
                for (let dayIndex = 2; dayIndex < columns.length; dayIndex++) {
                    const dayKey = columns[dayIndex];  
    
                    worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: dayIndex })] = { v: statusRow[dayKey] || '' };
                    worksheet[XLSX.utils.encode_cell({ r: rowIndex + 1, c: dayIndex })] = { v: inTimeRow[dayKey] || '' };
                    worksheet[XLSX.utils.encode_cell({ r: rowIndex + 2, c: dayIndex })] = { v: outTimeRow[dayKey] || '' };
    
                    // Highlight Sundays and OH statuses
                    if (dayIndex % 7 === 2) { // Assuming columns start at index 2 for the first Sunday
                        worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: dayIndex })].s = { fill: { fgColor: { argb: "FFFF00" } } }; // Yellow for Sundays
                        worksheet[XLSX.utils.encode_cell({ r: rowIndex + 1, c: dayIndex })].s = { fill: { fgColor: { argb: "FFFF00" } } }; // Yellow for In Time
                        worksheet[XLSX.utils.encode_cell({ r: rowIndex + 2, c: dayIndex })].s = { fill: { fgColor: { argb: "FFFF00" } } }; // Yellow for Out Time
                    }
                    
                    if (statusRow[dayKey] === 'OH' || statusRow[dayKey] === 'S') { // Highlight OH status
                        worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: dayIndex })].s = { fill: { fgColor: { argb: "FF0000" } } }; // Red for OH status
                    }
                }
    
                rowIndex += 3;
            }
        } else {
            console.log("No attendance data found!");
        }
    
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `Attendance Data_${selectedMonth}`);
    
        XLSX.writeFile(workbook, `Employee_Attendance_${selectedMonth}_${currentYear}.xlsx`);
    };
    
    
    
    
    
    

    useEffect(() => {
        fetchAttendance();
    }, [selectedMonth])

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
                                <div className='form-group ml-1'>
                                    <button type="button" className="btn mybtn"
                                        onClick={downloadExcel}>
                                        <MdFileDownload className='mr-1' /> Download Excel
                                    </button>
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