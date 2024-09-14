import React, { useEffect, useState, CSSProperties, useRef } from "react";
import { format } from 'date-fns';
import axios from "axios";

function EmployeeViewAttendance({ data }) {

    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const currentYear = new Date().getFullYear();
    const currentMonth = format(new Date(), 'MMMM'); // e.g., 'August'

    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [leaveCount, setLeaveCount] = useState(0);
    const [presentCount, setPresentCount] = useState(0);
    const [halfDayCount, setHalfDayCount] = useState(0);
    const [lcCount, setLcCount] = useState(0);
    const [attendanceData, setAttendanceData] = useState([]);

    const convertToDateInputFormat = (selectedDate) => {
        if (!selectedDate) return '';
        const date = new Date(selectedDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleYearChange = (e) => {
        setSelectedYear(Number(e.target.value));
        setLeaveCount(0);
        setPresentCount(0);
        setHalfDayCount(0);
        setLcCount(0);
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
        setLeaveCount(0);
        setPresentCount(0);
        setHalfDayCount(0);
        setLcCount(0);
    };

    // Generate the years array starting from 2020 to the current year
    const years = [];
    for (let year = 2020; year <= currentYear; year++) {
        years.push(year);
    }

    const getCurrentMonthName = () => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const currentMonthIndex = new Date().getMonth();
        return months[currentMonthIndex];
    };

    const fetchAttendance = async () => {
        try {
            const res = await axios.get(`${secretKey}/attendance/viewAllAttendance`);
            const allAttendanceData = res.data.data;

            const totalDays = new Date(selectedYear, new Date(Date.parse(`${selectedMonth} 1, ${selectedYear}`)).getMonth() + 1, 0).getDate();
            const today = new Date().getDate(); // Current date of the month
            const currentMonth = getCurrentMonthName();
            const isCurrentMonth = selectedMonth === currentMonth;
            let name = "";
            let designation = "";

            const filteredData = [];
            const filledDates = new Set(); // To track dates with existing data

            // Collect all filled dates
            allAttendanceData.forEach(employee => {
                if (employee._id === data._id) {  // Check for the specific employee ID
                    employee.years.forEach(yearData => {
                        if (yearData.year === selectedYear) {  // Check for the specific year
                            yearData.months.forEach(monthData => {
                                if (monthData.month === selectedMonth) {  // Check for the specific month
                                    monthData.days.forEach(dayData => {
                                        const { date: dayDate, inTime, outTime, workingHours, status } = dayData;

                                        filledDates.add(dayDate); // Add filled date to the set

                                        // Add data for the current month up to today or all data for past months
                                        if (isCurrentMonth && dayDate <= today || !isCurrentMonth) {

                                            name = employee.employeeName;
                                            designation = employee.designation;

                                            filteredData.push({
                                                _id: employee._id,
                                                employeeId: employee.employeeId,
                                                employeeName: employee.employeeName,
                                                designation: employee.designation,
                                                department: employee.department,
                                                branchOffice: employee.branchOffice,
                                                date: dayDate,
                                                inTime,
                                                outTime,
                                                workingHours,
                                                status
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });

            // Include dates with no data in current month
            if (isCurrentMonth) {
                for (let date = 1; date <= today; date++) {
                    if (!filledDates.has(date)) {
                        filteredData.push({
                            employeeName: name, // Example placeholder for missing data
                            designation: designation,
                            // department: '',
                            // branchOffice: '',
                            date: date,
                            inTime: '',
                            outTime: '',
                            workingHours: '',
                            status: ''
                        });
                    }
                }
            } else {
                // For past months, include all days from 1 to totalDays
                for (let date = 1; date <= totalDays; date++) {
                    if (!filledDates.has(date)) {
                        filteredData.push({
                            employeeName: name, // Example placeholder for missing data
                            designation: designation,
                            // department: '',
                            // branchOffice: '',
                            date: date,
                            inTime: '',
                            outTime: '',
                            workingHours: '',
                            status: ''
                        });
                    }
                }
            }

            filteredData.sort((a, b) => new Date(`${selectedYear}-${selectedMonth}-${a.date}`) - new Date(`${selectedYear}-${selectedMonth}-${b.date}`));
            setAttendanceData(filteredData);
            console.log("Filtered attendance data is :", filteredData);
            filteredData.forEach(data => {
                if (data.status === "Present") {
                    setPresentCount(prevCount => prevCount + 1);
                }
                if (data.status === "Leave") {
                    setLeaveCount(prevCount => prevCount + 1);
                }
                if (data.status === "LC1" || data.status === "LC2" || data.status === "LC3" || data.status === "LCH") {
                    setLcCount(prevCount => prevCount + 1);
                }
                if (data.status === "Half Day" || data.status === "LCH") {
                    setHalfDayCount(prevCount => prevCount + 1);
                }
            });
        } catch (error) {
            console.log("Error fetching attendance record", error);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [selectedYear, selectedMonth, data._id]);

    return (
        <div className="mt-3">
            <div className='d-flex mb-3 align-items-center justify-content-between'>
                <div className='d-flex align-items-center justify-content-start'>
                    <div className='form-group'>
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
                            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(month => (
                                <option key={month} value={month}>{month}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="d-flex align-items-center justify-content-start">
                    <div className="areport clr-bg-light-e65b5b">
                        <div>L - {leaveCount}</div>
                    </div>
                    <div className="areport clr-bg-light-1cba19 ml-1">
                        <div>P - {presentCount}</div>
                    </div>
                    <div className="areport clr-bg-light-ffb900 ml-1">
                        <div>H - {halfDayCount}</div>
                    </div>
                    <div className="areport clr-bg-light-4299e1 ml-1">
                        <div>LC - {lcCount}</div>
                    </div>
                </div>
            </div>
            <div className="table table-responsive table-style-2 m-0" style={{ height: "calc(100vh - 307px)", overflow: "auto" }}>
                <table className="table table-vcenter table-nowrap">
                    <thead>
                        <tr className="tr-sticky">
                            <th>Sr. No</th>
                            <th>Date</th>
                            <th>In Time</th>
                            <th>Out Time</th>
                            <th>Working Hours</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceData.map((emp, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className='attendance-date-tbl'>
                                            <input
                                                type="date"
                                                className="form-control date-f"
                                                value={convertToDateInputFormat(
                                                    new Date(selectedYear, new Date(Date.parse(`${selectedMonth} 1, ${selectedYear}`)).getMonth(), emp.date)
                                                )}
                                                readOnly
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='attendance-date-tbl'>
                                            <input
                                                type="time"
                                                className='form-cantrol in-time'
                                                value={emp.inTime}
                                                readOnly
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='attendance-date-tbl'>
                                            <input
                                                type="time"
                                                className='form-cantrol out-time'
                                                value={emp.outTime}
                                                readOnly
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        {emp.workingHours}
                                    </td>
                                    <td>
                                        <span className={`badge ${(emp.status) === "Present" ? "badge-completed" :
                                            (emp.status) === "Leave" ? "badge-under-probation" :
                                                (emp.status) === "Half Day" ? "badge-half-day" : ""
                                            }`}>
                                            {emp.status}
                                        </span>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EmployeeViewAttendance;