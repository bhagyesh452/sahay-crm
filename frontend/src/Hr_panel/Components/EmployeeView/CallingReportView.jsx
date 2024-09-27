import React, { useState, useEffect, useRef } from 'react'
import { debounce } from "lodash";
import Calendar from "@mui/icons-material/Event";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from "moment";
// import moment from 'moment-timezone';
import { StaticDateRangePicker } from "@mui/x-date-pickers-pro/StaticDateRangePicker";
import dayjs from "dayjs";
import axios from "axios";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from 'react-router-dom';
//import FilterTableCallingReport from './FilterTableCallingReport';
import { BsFilter } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import jsPDF and jsPDF AutoTable for generating PDFs
import * as XLSX from 'xlsx';
import Nodata from '../../../components/Nodata';
import { format } from 'date-fns';

function CallingReportView({ employeeInformation }) {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const convertSecondsToHMS = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 3600 % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };
    const convertSecondsToHMSNew = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 3600 % 60;

        return `${String(hours).padStart(2, '0')}h:${String(minutes).padStart(2, '0')}m:${String(seconds).padStart(2, '0')}s`;
    };

    const convertHMSToSeconds = (hms) => {
        const [hours, minutes, seconds] = hms.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };

    const [callingData, setCallingData] = useState([])
    const [loading, setLoading] = useState(false)
    const fetchCallingDate = async () => {
        try {
            const response = await axios.get(`${secretKey}/employee/employee-calling-fetch/${employeeInformation.number}`);
            const data = response.data.data;

            if (Array.isArray(data) && data.length > 0) {
                // Safely access nested properties using optional chaining
                const dailyData = data[0]?.year?.[0]?.monthly_data?.[0]?.daily_data;

                if (dailyData) {
                    setCallingData(dailyData.sort((a, b) => new Date(a.date) - new Date(b.date))); // Set the data only if it exists
                    console.log("dailyData", dailyData);
                } else {
                    console.error("Daily data is missing or not in the expected structure");
                }
            } else {
                console.error("No data found for the employee");
            }
        } catch (err) {
            console.log("Error fetching calling data:", err);
        }
    };

    // console.log("callingData", callingData)
    //console.log("dailyData", dailyData);
    const getTargetTime = (joiningDate) => {
        // Parse the joining date to a Date object
        const joinDate = new Date(joiningDate);
        const today = new Date();

        // Calculate the difference in months
        const diffInMonths = (today.getFullYear() - joinDate.getFullYear()) * 12 + (today.getMonth() - joinDate.getMonth());

        // Determine the target time
        const targetTime = diffInMonths <= 1 ? "1:30:00" : "2:00:00";

        return targetTime;
    };

    const getTargetTimeNew = (joiningDate) => {
        // Parse the joining date to a Date object
        const joinDate = new Date(joiningDate);
        const today = new Date();

        // Calculate the difference in months
        const diffInMonths = (today.getFullYear() - joinDate.getFullYear()) * 12 + (today.getMonth() - joinDate.getMonth());

        // Determine the target time
        const targetTime = diffInMonths <= 1 ? "01h:30m:00s" : "02h:00m:00s";

        return targetTime;
    };
    const getTargetStatus = (totalDuration, targetTime) => {
        const targetSeconds = convertHMSToSeconds(targetTime);
        const totalSeconds = convertHMSToSeconds(totalDuration);

        return totalSeconds >= targetSeconds ? "Achieved" : "Failed";
    }
    const formatDateToDDMMYYYY = (date) => {
        const [year, month, day] = date.split('-');
        return `${day}-${month}-${year}`;
    };

    // Function to format date as DD-MM-YYYY
    const formatDateToDDMMYYYYNew = (dateObject) => {
        const day = String(dateObject.getDate()).padStart(2, '0');
        const month = String(dateObject.getMonth() + 1).padStart(2, '0');
        const year = dateObject.getFullYear();
        return `${day}-${month}-${year}`;
    };

    useEffect(() => {
        fetchCallingDate();
    }, [employeeInformation])

    // ------------------------filter functions------------------------------

    const year = new Date().getFullYear();
    const month = new Date().getMonth(); // Get the current month (0-based)

    const getCurrentMonthName = (monthIndex) => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return months[monthIndex];
    };

    const [selectedYear, setSelectedYear] = useState(year);
    const [months, setMonths] = useState([]); // Array of months to display in the dropdown
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthName(month));

    // Function to generate the array of months based on the selected year
    const generateMonthArray = (year) => {
        const monthArray = [];
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth(); // Get the current month (0-based)

        // If the selected year is the current year, show remaining months starting from the current month
        if (year === currentYear) {
            for (let m = currentMonth; m <= 11; m++) {
                monthArray.push(format(new Date(year, m), 'MMMM'));
            }
        } else {
            // For future years, show all 12 months
            for (let m = 0; m <= 11; m++) {
                monthArray.push(format(new Date(year, m), 'MMMM'));
            }
        }
        setMonths(monthArray); // Update the months array
    };

    // On component mount, set the months array for the current year
    useEffect(() => {
        generateMonthArray(year); // Populate the months array when the component mounts
    }, [year]);


    const handleYearChange = (e) => {
        const newYear = parseInt(e.target.value, 10);
        setSelectedYear(newYear);
        generateMonthArray(newYear); // Update the months based on the selected year

        // If a new year is selected, reset to the first month of that year
        setSelectedMonth(newYear === year ? getCurrentMonthName(month) : 'January');
    };

    const handleMonthChange = async (e) => {
        const emp_number = employeeInformation.number;
        const month = e.target.value;
        const monthNamesToNumbers = {
            "January": "01",
            "February": "02",
            "March": "03",
            "April": "04",
            "May": "05",
            "June": "06",
            "July": "07",
            "August": "08",
            "September": "09",
            "October": "10",
            "November": "11",
            "December": "12"
        };
        const monthNumber = monthNamesToNumbers[month];

        console.log("emp_number:", emp_number);
        console.log("year:", selectedYear);
        console.log("monthNumber:", monthNumber);

        setSelectedMonth(month);

        try {
            const response = await axios.get(`${secretKey}/employee/employee-calling/filter`, {
                params: {
                    emp_number: emp_number,
                    year: String(selectedYear),
                    month: monthNumber,
                },
            });
            console.log("response", response.data.data)
            if (response.status === 200) {

                const dailyData = response.data.data?.daily_data;

                if (dailyData) {
                    setCallingData(dailyData.sort((a, b) => new Date(a.date) - new Date(b.date))); // Sort by date
                    console.log("Filtered dailyData", dailyData);
                } else {
                    console.error("Daily data is missing or not in the expected structure");
                }
            }
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    // -----------------------------attendance data-----------------------------
    const currentYear = new Date().getFullYear();
    const currentMonth = format(new Date(), 'MMMM'); // e.g., 'August'

    //const [selectedYear, setSelectedYear] = useState(currentYear);
    //const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [leaveCount, setLeaveCount] = useState(0);
    const [presentCount, setPresentCount] = useState(0);
    const [halfDayCount, setHalfDayCount] = useState(0);
    const [lcCount, setLcCount] = useState(0);
    const [attendanceData, setAttendanceData] = useState([]);
    //const [months, setMonths] = useState([])

    const convertToDateInputFormat = (selectedDate) => {
        if (!selectedDate) return '';
        const date = new Date(selectedDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
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


    const formatDateForHolidayCheck = (year, month, day) => {
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    };
    const officialHolidays = [
        '2024-01-14', '2024-01-15', '2024-03-24', '2024-03-25',
        '2024-07-07', '2024-08-19', '2024-10-12',
        '2024-10-31', '2024-11-01', '2024-11-02', '2024-11-03', '2024-11-04', '2024-11-05'
    ]
    const monthNamesToNumbers = {
        "January": "01",
        "February": "02",
        "March": "03",
        "April": "04",
        "May": "05",
        "June": "06",
        "July": "07",
        "August": "08",
        "September": "09",
        "October": "10",
        "November": "11",
        "December": "12"
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
                if (employee._id === employeeInformation._id) {  // Check for the specific employee ID
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
                                                month: selectedMonth,
                                                year: selectedYear,
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
                    const monthNumber = monthNamesToNumbers[selectedMonth];
                    const formattedDate = `${selectedYear}-${monthNumber}-${date < 10 ? '0' + date : date}`;
                    const isSunday = new Date(`${selectedYear}-${selectedMonth}-${date}`).getDay() === 0;
                    const isHoliday = officialHolidays.includes(formattedDate);
                    // console.log("formatteddate" , formattedDate)

                    let status = ''; // Default status for empty days

                    if (isSunday) {
                        const prevWorkingDate = findPrevWorkingDay(selectedYear, monthNumber, date - 1);
                        const nextWorkingDate = findNextWorkingDay(selectedYear, monthNumber, date + 1);

                        // Fetch attendance status for the previous and next working day
                        const prevDayStatus = allAttendanceData.find(emp => emp._id === employeeInformation._id)?.years
                            ?.find(yr => yr.year === prevWorkingDate.year)?.months
                            ?.find(mn => mn.month === getMonthName(prevWorkingDate.month))?.days
                            ?.find(d => d.date === prevWorkingDate.day)?.status;

                        const nextDayStatus = allAttendanceData.find(emp => emp._id === employeeInformation._id)?.years
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
                        const prevDayStatus = allAttendanceData.find(emp => emp._id === employeeInformation._id)?.years
                            ?.find(yr => yr.year === prevWorkingDate.year)?.months
                            ?.find(mn => mn.month === getMonthName(prevWorkingDate.month))?.days
                            ?.find(d => d.date === prevWorkingDate.day)?.status;

                        const nextDayStatus = allAttendanceData.find(emp => emp._id === employeeInformation._id)?.years
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
                            month: selectedMonth,
                            year: selectedYear,
                            inTime: '',
                            outTime: '',
                            workingHours: '',
                            status: status ? status : "No Data",
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
    }, [selectedYear, selectedMonth, employeeInformation._id]);

    const convertTo12HourFormat = (time) => {
        let [hours, minutes] = time.split(':').map(Number); // Split and convert to numbers
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert hour to 12-hour format
        return `${hours}:${String(minutes).padStart(2, '0')} ${ampm}`; // Ensure minutes are always two digits
    };
    console.log("attendance", attendanceData);


    return (
        <div className="calling-report-view mt-3">
            <div className='d-flex mb-3 align-items-center justify-content-between pl-1 pr-1'>
                <div className='d-flex align-items-center justify-content-start'>
                    <div className='form-group'>
                        <select className='form-select'
                            value={selectedYear}
                            onChange={handleYearChange}
                        >
                            {/* <option disabled value="" selected>--Select Year--</option> Default option */}
                            <option value={2024}>2024</option>
                            <option value={2025}>2025</option>

                        </select>
                    </div>
                    <div className='form-group ml-1'>
                        <select className='form-select'
                            value={selectedMonth}
                            onChange={handleMonthChange}
                        >
                            {/* <option disabled value="" selected>--Select Month--</option> */}
                            {months.map(month => (
                                <option key={month} value={month}>{month}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="d-flex align-items-center justify-content-start">
                    <button className='btn action-btn-alert'>
                        Not Achieved:
                        {callingData && callingData.length > 0 ? (
                            // Map over dailyData and filter for "Failed" statuses
                            callingData.map((obj) => {
                                const totalDuration = convertSecondsToHMS(obj.total_duration);
                                const targetTime = getTargetTime(employeeInformation.jdate);

                                return getTargetStatus(totalDuration, targetTime);
                            })
                                .reduce((totalFailed, status) => {
                                    // Count how many are "Failed"
                                    return status === "Failed" ? totalFailed + 1 : totalFailed;
                                }, 0)
                        ) : 0}
                    </button>
                </div>
            </div>
            <div className='pl-1 pr-1'>
                <div className="table table-responsive table-style-2 m-0" style={{ maxHeight: "calc(100vh - 307px)", overflow: "auto" }}>
                    <table className="table table-vcenter table-nowrap">
                        <thead>
                            <tr className="tr-sticky">
                                <th>Sr. No</th>
                                <th>Date</th>
                                {/* <th>Outgoing</th>
                            <th>Incoming</th> */}
                                <th>Unique Clients</th>
                                <th>Total</th>
                                <th>Call Duration</th>
                                <th>Target</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        {loading ? (
                            <tbody>
                                <tr>
                                    <td colSpan="7" >
                                        <div className="LoaderTDSatyle w-100" >
                                            <ClipLoader
                                                color="lightgrey"
                                                loading
                                                size={30}
                                                aria-label="Loading Spinner"
                                                data-testid="loader"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        ) : callingData && callingData.length !== 0 ?
                            (
                                <tbody>
                                    {callingData.map((item, index) => {
                                        const targetTime = getTargetTime(employeeInformation.jdate);
                                        const status = getTargetStatus(convertSecondsToHMS(item.total_duration), targetTime);
                                        const badgeClass = status === "Achieved" ? 'badge-completed' : 'badge-leave';
                                        const dateObject = new Date(item.date);
                                        const isSunday = dateObject.getDay() === 0;
                                        // Format the item date to DD-MM-YYYY for comparison with officialHolidays
                                        const formattedDate = formatDateToDDMMYYYYNew(dateObject);

                                        // Check if the formatted date is in the officialHolidays array
                                        const isOfficialHoliday = officialHolidays.includes(formattedDate);
                                        const attendance = attendanceData.find((obj) => {
                                            // Construct the attendanceDate in "YYYY-MM-DD" format
                                            const attendanceDate = `${obj.year}-${monthNamesToNumbers[(obj.month)]}-${String(obj.date).padStart(2, '0')}`;
                                            const itemDate = new Date(item.date).toISOString().split("T")[0]; // Convert to YYYY-MM-DD format
                                            // console.log(itemDate, attendanceDate)
                                            return attendanceDate === itemDate; // Return the result of the comparison
                                        });
                                        // console.log("atte", attendance)
                                        return (
                                            <tr>
                                                <td>{index + 1}</td>
                                                <td>{formatDateToDDMMYYYY(item.date)}</td>
                                                <td>{(isSunday) || isOfficialHoliday || (attendance && attendance.status === "Leave") ? "-" : item.total_unique_clients}</td>
                                                <td>{(isSunday) || isOfficialHoliday || (attendance && attendance.status === "Leave") ? "-" : item.total_calls}</td>
                                                <td>{(isSunday) || isOfficialHoliday || (attendance && attendance.status === "Leave") ? "-" : convertSecondsToHMSNew(item.total_duration)}</td>
                                                <td>{(isSunday) || isOfficialHoliday || (attendance && attendance.status === "Leave") ? "-" : getTargetTimeNew(employeeInformation.jdate)}</td>
                                                <td>
                                                    <span className={attendance && attendance.status === "Leave" ? "badge badge-under-probation" :
                                                        attendance && (attendance.status === "Sunday" || attendance.status === "Sunday Half Day" ||attendance.status === "Sunday Leave") ? "badge badge-sunday" :
                                                            attendance && attendance.status === "Official Holiday" ? "badge badge-sunday" :
                                                                `badge ${badgeClass}`}
                                                    >
                                                        {attendance && (attendance.status === "Sunday" || attendance.status === "Sunday Half Day" ||attendance.status === "Sunday Leave") ? "Sunday" :
                                                            attendance && (attendance.status === "Official Holiday" || attendance.status === "Official Holiday Half Day" || attendance.status === "Official Holiday Leave") ? "Official Holiday" :
                                                                (attendance && attendance.status === "Leave") ? "Leave" :
                                                                    getTargetStatus(convertSecondsToHMS(item.total_duration), getTargetTime(employeeInformation.jdate))}
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })
                                    }

                                </tbody>
                            ) : (callingData.length === 0 && !loading && (
                                <tbody>
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: "center" }}>
                                            <Nodata />
                                        </td>
                                    </tr>
                                </tbody>
                            )
                            )}
                    </table>
                </div>
            </div>
        </div>
    );
}

export default CallingReportView;