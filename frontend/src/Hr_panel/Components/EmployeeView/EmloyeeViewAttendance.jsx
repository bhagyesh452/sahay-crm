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
    const [months, setMonths] = useState([])

    const convertToDateInputFormat = (selectedDate) => {
        if (!selectedDate) return '';
        const date = new Date(selectedDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleYearChange = (e) => {
        monthArray(Number(e.target.value));
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
    const years = ["2024", "2025"];
    const monthArray = (selectedYear) => {
        const months = [];
        let date;

        // Check if the selected year is the current year
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth(); // Get the current month (0-based)

        if (selectedYear == currentYear) {
            date = new Date(); // Start from the current date
        } else {
            // If it's a future year, start from January
            date = new Date(selectedYear, 0); // 0 means January
        }

        // Loop through the months, starting from the calculated month
        for (let month = date.getMonth(); month <= 11; month++) {
            months.push(format(new Date(selectedYear, month), 'MMMM'));
        }
        setMonths(months);
        return months;
    };

    // for (let year = 2025; year <= currentYear; year--) {
    //     years.push(year);
    // }

    const getCurrentMonthName = () => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const currentMonthIndex = new Date().getMonth();
        return months[currentMonthIndex];
    };
    const formatDateForHolidayCheck = (year, month, day) => {
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    };
    const officialHolidays = [
        '2024-01-14', '2024-01-15', '2024-03-24', '2024-03-25',
        '2024-07-07', '2024-08-19', '2024-10-12',
        '2024-10-31', '2024-11-01', '2024-11-02', '2024-11-03', '2024-11-04', '2024-11-05'
    ]
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
                                        const { date: dayDate, inTime, outTime, workingHours, status, reasonValue, isAddedManually } = dayData;

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
                                                status,
                                                reasonValue,
                                                isAddedManually
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });

            // Function to find the previous working day
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
            // Function to find the next working day
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

            // Logic to handle empty days for the current month
            for (let date = 1; date <= (isCurrentMonth ? today : totalDays); date++) {
                if (!filledDates.has(date)) {
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
                    const formattedDate = `${selectedYear}-${monthNumber < 10 ? '0' + monthNumber : monthNumber}-${date < 10 ? '0' + date : date}`;
                    const isSunday = new Date(`${selectedYear}-${selectedMonth}-${date}`).getDay() === 0;
                    const isHoliday = officialHolidays.includes(formattedDate);

                    let status = ''; // Default status for empty days

                    if (isSunday) {
                        const prevWorkingDate = findPrevWorkingDay(selectedYear, monthNumber, date - 1);
                        const nextWorkingDate = findNextWorkingDay(selectedYear, monthNumber, date + 1);

                        // Fetch attendance status for the previous and next working day
                        const prevDayStatus = allAttendanceData.find(emp => emp._id === data._id)?.years
                            ?.find(yr => yr.year === prevWorkingDate.year)?.months
                            ?.find(mn => mn.month === getMonthName(prevWorkingDate.month))?.days
                            ?.find(d => d.date === prevWorkingDate.day)?.status;

                        const nextDayStatus = allAttendanceData.find(emp => emp._id === data._id)?.years
                            ?.find(yr => yr.year === nextWorkingDate.year)?.months
                            ?.find(mn => mn.month === getMonthName(nextWorkingDate.month))?.days
                            ?.find(d => d.date === nextWorkingDate.day)?.status;

                        // Determine Sunday status
                        if (
                            (prevDayStatus === "Leave" && nextDayStatus === "Leave") ||
                            (prevDayStatus === "Leave" && nextDayStatus === "Half Day") ||
                            (prevDayStatus === "Half Day" && nextDayStatus === "Leave")
                        ) {
                            status = "Sunday Leave"; // Sunday Leave

                        } else if (
                            (prevDayStatus === "Half Day" && nextDayStatus === "Half Day") ||
                            (prevDayStatus === "LCH" && nextDayStatus === "LCH") ||
                            (prevDayStatus === "LCH" && nextDayStatus === "Half Day") ||
                            (prevDayStatus === "Half Day" && nextDayStatus === "LCH")
                        ) {
                            status = "Sunday Half Day"; // Sunday Half Day

                        } else if (
                            prevDayStatus === "Present" || nextDayStatus === "Present"
                        ) {
                            status = "Sunday"; // Sunday Present

                        } else {
                            status = "Sunday"; // Regular Sunday

                        }
                    } else if (isHoliday) {
                        const prevWorkingDate = findPrevWorkingDay(selectedYear, monthNumber, date - 1);
                        const nextWorkingDate = findNextWorkingDay(selectedYear, monthNumber, date + 1);

                        // Fetch attendance status for the previous and next working day
                        const prevDayStatus = allAttendanceData.find(emp => emp._id === data._id)?.years
                            ?.find(yr => yr.year === prevWorkingDate.year)?.months
                            ?.find(mn => mn.month === getMonthName(prevWorkingDate.month))?.days
                            ?.find(d => d.date === prevWorkingDate.day)?.status;

                        const nextDayStatus = allAttendanceData.find(emp => emp._id === data._id)?.years
                            ?.find(yr => yr.year === nextWorkingDate.year)?.months
                            ?.find(mn => mn.month === getMonthName(nextWorkingDate.month))?.days
                            ?.find(d => d.date === nextWorkingDate.day)?.status;

                        // Determine Sunday status
                        if (
                            (prevDayStatus === "Leave" && nextDayStatus === "Leave") ||
                            (prevDayStatus === "Leave" && nextDayStatus === "Half Day") ||
                            (prevDayStatus === "Half Day" && nextDayStatus === "Leave")
                        ) {
                            status = "Official Holiday Leave"; // Sunday Leave

                        } else if (
                            (prevDayStatus === "Half Day" && nextDayStatus === "Half Day") ||
                            (prevDayStatus === "LCH" && nextDayStatus === "LCH") ||
                            (prevDayStatus === "LCH" && nextDayStatus === "Half Day") ||
                            (prevDayStatus === "Half Day" && nextDayStatus === "LCH")
                        ) {
                            status = "Official Holiday Half Day"; // Sunday Half Day
                        } else {
                            status = "Official Holiday"; // Regular Sunday
                        }
                    }

                    if (status) {
                        filteredData.push({
                            employeeName: name,
                            designation: designation,
                            date: date,
                            inTime: '',
                            outTime: '',
                            workingHours: '',
                            status: status ? status : "No Data"
                        });
                    }

                }
            }

            filteredData.sort((a, b) => new Date(`${selectedYear}-${selectedMonth}-${a.date}`) - new Date(`${selectedYear}-${selectedMonth}-${b.date}`));
            setAttendanceData(filteredData);
            const presentDates = new Set(); // Use a Set to store unique dates
            let hasLCH = false;
            //console.log("filteredData :", filteredData);
            let presentCount = 0;
            let lcCount = 0;
            let leaveCount = 0;
            let halfDayCount = 0;

            filteredData.forEach(data => {
                if (data.status === "LCH") {
                    hasLCH = true;
                }

                // Check for Present, LC statuses, and Sunday
                if (["Present", "LC1", "LC2", "LC3", "Sunday"].includes(data.status)) {
                    if (!presentDates.has(data.date)) {
                        presentDates.add(data.date); // Add unique date to the Set
                        presentCount++; // Increment present count only for unique dates
                    }
                }

                if (["LC1", "LC2", "LC3", "LCH"].includes(data.status)) {
                    lcCount++;
                }

                if (["Leave", "Sunday Leave", "Official Holiday Leave"].includes(data.status)) {
                    leaveCount++;
                }

                if (["Half Day", "LCH", "Sunday Half Day", "Official Holiday Half Day"].includes(data.status)) {
                    halfDayCount++;
                }
            });

            // Adjust counts based on LCH logic
            if (hasLCH) {
                halfDayCount = Math.min(halfDayCount, lcCount + (halfDayCount - lcCount));
            }

            // Update the state only once with final counts
            setAttendanceData(filteredData);
            setPresentCount(presentCount);
            setLcCount(lcCount);
            setLeaveCount(leaveCount);
            setHalfDayCount(halfDayCount);
            //console.log("Present counted for these dates:", presentDates);
        } catch (error) {
            console.log("Error fetching attendance record", error);
        }
    };

    useEffect(() => {
        fetchAttendance();
        monthArray(selectedYear);
    }, [selectedYear, selectedMonth, data._id]);

    const convertTo12HourFormat = (time) => {
        let [hours, minutes] = time.split(':').map(Number); // Split and convert to numbers
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert hour to 12-hour format
        return `${hours}:${String(minutes).padStart(2, '0')} ${ampm}`; // Ensure minutes are always two digits
    };
    console.log("attendanceData", attendanceData);

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
                            {months.map(month => (
                                <option key={month} value={month}>{month}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="d-flex align-items-center justify-content-start">
                    <div className="areport clr-bg-light-4299e1 ml-1">
                        <div>LC - {lcCount}</div>
                    </div>
                    <div className="areport clr-bg-light-1cba19 ml-1">
                        <div>P - {presentCount}</div>
                    </div>
                    <div className="areport clr-bg-light-e65b5b ml-1">
                        <div>L - {leaveCount}</div>
                    </div>
                    <div className="areport clr-bg-light-ffb900 ml-1">
                        <div>H - {halfDayCount}</div>
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
                                            <div className="form-control date-f text-center">
                                                {convertToDateInputFormat(
                                                    new Date(selectedYear, new Date(Date.parse(`${selectedMonth} 1, ${selectedYear}`)).getMonth(), emp.date)
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className='attendance-date-tbl'>                                          
                                            <div className="form-control in-time">
                                                {(() => {
                                                    console.log('inTime:', emp.inTime); // Console log the inTime value
                                                    return emp.inTime ? convertTo12HourFormat(emp.inTime) : "-"; // Display the inTime value or "-"
                                                })()}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className='attendance-date-tbl'>
                                            <div className="form-cantrol out-time">
                                                {emp.outTime ? convertTo12HourFormat(emp.outTime) : "-"}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {emp.workingHours ? emp.workingHours : "-"}
                                    </td>
                                    <td>
                                        <div
                                            className=
                                            {`
                                         ${(emp.status === "Present") && (emp.isAddedManually === true) ? "OverPStatus" : ""}
                                            ${(emp.status === "Half Day") && emp.isAddedManually === true ? "OverPStatus" : ""}
                                                 ${(emp.status === "Leave") && emp.isAddedManually === true ? "OverPStatus" : ""}
                                                 ${(emp.status.startsWith("LC")) && emp.isAddedManually === true ? "OverPStatus" : ""}
                                             `.trim()}>
                                            <span
                                                title={(() => {
                                                    if (emp.isAddedManually === true) {
                                                        if ((emp.status) === "Present") {
                                                            return emp.reasonValue || "Manually marked as Present";
                                                        } else if ((emp.status) === "Half Day") {
                                                            return emp.reasonValue || "Manually marked as Half Day";
                                                        } else if ((emp.status) === "Leave") {
                                                            return emp.reasonValue || "Manually marked as Leave";
                                                        } else if ((emp.status?.startsWith("LC"))) {
                                                            return emp.reasonValue || "Manually marked as LC (Late Complete)";
                                                        }
                                                    } else {
                                                        if (emp.status === "LCH") {
                                                            return "Late Coming Half Day"
                                                        } else if (emp.status === "LC1" || emp.status === "LC2" || emp.status === "LC3") {
                                                            return "Late Coming"
                                                        } else {
                                                            return emp.status
                                                        }
                                                    }

                                                })()}
                                                className={`badge ${(emp.status) === "Present" ? "badge-completed" :
                                                    (emp.status) === "Leave" ? "badge-under-probation" :
                                                        (emp.status) === "Half Day" ? "badge-half-day" :
                                                            (emp.status || emp.status) === "Half Day" ? "badge-half-day" :
                                                                (emp.status || emp.status) === "Sunday Leave" ||
                                                                    (emp.status || emp.status) === "Sunday Half Day" ||
                                                                    (emp.status || emp.status) === "Sunday" ||
                                                                    (emp.status || emp.status) === "Official Holiday Leave" ||
                                                                    (emp.status || emp.status) === "Official Holiday Half Day" ||
                                                                    (emp.status || emp.status) === "Official Holiday" ? "badge-Holiday" :
                                                                    (emp.status.startsWith("LC") || emp.status.startsWith("LC")) ? "badge-LC" : "badge-Nodata"
                                                    }`}>
                                                {emp.status}
                                            </span>
                                        </div>

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