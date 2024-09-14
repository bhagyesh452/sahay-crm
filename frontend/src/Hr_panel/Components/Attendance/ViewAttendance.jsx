import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MaleEmployee from "../../../static/EmployeeImg/office-man.png";
import FemaleEmployee from "../../../static/EmployeeImg/woman.png";
import { FaPlus } from "react-icons/fa6";
import ClipLoader from 'react-spinners/ClipLoader';
import { Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FaRegCalendarPlus } from "react-icons/fa6";
import { FcCancel } from "react-icons/fc";
import Swal from 'sweetalert2';
import Nodata from '../../../components/Nodata';
import { GiCheckMark } from "react-icons/gi";
import ShowAttendanceForParticularEmployee from './ShowAttendanceForParticularEmployee';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

function ViewAttendance({ year, month, date }) {

    const secretKey = process.env.REACT_APP_SECRET_KEY;

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

    // console.log("Current year is :", year);
    // console.log("Current month is :", month);

    const monthNumber = monthNamesToNumbers[month];

    // Calculate the number of days in the month
    const daysInMonth = new Date(year, monthNumber, 0).getDate();

    // Function to get the day of the week for a given date
    const getDayLabel = (day) => {
        const date = new Date(year, monthNumber - 1, day); // monthNumber is zero-indexed in JavaScript Date
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return `${day}-${daysOfWeek[date.getDay()]}`;
    };

    const selectedMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    // console.log("selectedMonthDays", selectedMonthDays)

    // Determine if there is any 'LCH' in the selected month


    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1; // JavaScript months are 0-based
    const currentYear = today.getFullYear();

    const [isLoading, setIsLoading] = useState(false);
    const [gotaBranchEmployees, setGotaBranchEmployees] = useState([]);
    const [sindhuBhawanBranchEmployees, setSindhuBhawanBranchEmployees] = useState([]);
    const [deletedEmployees, setDeletedEmployees] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showAttendanceForParticularEmployee, setShowAttendanceForParticularEmployee] = useState(false);
    const [disableInTime, setDisableInTime] = useState(false);
    const [disableOutTime, setDisableOutTime] = useState(false);
    const [disableOnLeave, setDisableOnLeave] = useState(false);
    const [isOnLeave, setIsOnLeave] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const [id, setId] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [empName, setEmpName] = useState("");
    const [branchOffice, setBranchOffice] = useState("");
    const [designation, setDesignation] = useState("");
    const [department, setDepartment] = useState("");
    const [attendanceDate, setAttendanceDate] = useState();
    const [dayName, setDayName] = useState("");
    const [workingHours, setWorkingHours] = useState("");
    const [status, setStatus] = useState("");
    const [inTime, setInTime] = useState("");
    const [originalInTime, setOriginalInTime] = useState("");
    const [outTime, setOutTime] = useState("");
    const [originalOutTime, setOriginalOutTime] = useState("");
    const [inTimeError, setInTimeError] = useState(""); // State for In Time error
    const [outTimeError, setOutTimeError] = useState(""); // State for Out Time error
    const [attendanceData, setAttendanceData] = useState({});

    const handleShowParticularEmployeeAttendance = (id, name) => {
        setShowAttendanceForParticularEmployee(true);
        setId(id);
        setEmpName(name);
    }

    const handleCloseParticularEmployeeAttendance = () => {
        setShowAttendanceForParticularEmployee(false);
    }

    const fetchEmployees = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${secretKey}/employee/einfo`);
            const data = res.data;
            setGotaBranchEmployees(data.filter((branch) => branch.branchOffice === "Gota"));
            setSindhuBhawanBranchEmployees(data.filter((branch) => branch.branchOffice === "Sindhu Bhawan"));
            fetchAttendance();
        } catch (error) {
            console.log("Error fetching employees", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDeletedEmployees = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${secretKey}/employee/deletedemployeeinfo`);
            setDeletedEmployees(res.data);
            fetchAttendance();
            // console.log("Fetched Deleted Employees are:", res.data);
        } catch (error) {
            console.log("Error fetching employees data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setIsDeleted(false);
        setInTimeError("");
        setOutTimeError("");
    };

    const handleCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        setIsOnLeave(isChecked);

        if (isChecked) {
            // If On Leave is checked, disable In Time and Out Time, and set default values
            setInTime("00:00");
            setOutTime("00:00");
            setWorkingHours("00:00");
            setStatus("Leave");
            setDisableInTime(true);
            setDisableOutTime(true);
        } else {
            if (originalInTime && originalOutTime) {
                setInTime(originalInTime);
                setOutTime(originalOutTime);
            }
            else {
                setInTime("");
                setOutTime("");
            }
            setDisableInTime(false);
            setDisableOutTime(false);
        }
    };

    const handleDayClick = (day, id, empName, empId, designation, department, branch, intime, outtime) => {

        // Format the date as "DD-MM-YYYY"
        const formattedDate = `${year}-${monthNumber < 10 ? '0' + monthNumber : monthNumber}-${day < 10 ? '0' + day : day}`;
        const date = new Date(year, monthNumber - 1, day); // monthNumber is zero-indexed in JavaScript Date
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = daysOfWeek[date.getDay()];

        setShowPopup(true);
        setId(id);
        setEmpName(empName);
        setInTime(intime);
        setOriginalInTime(intime);
        setOutTime(outtime);
        setOriginalOutTime(outtime);
        setEmployeeId(empId);
        setAttendanceDate(formattedDate);
        setDesignation(designation);
        setDepartment(department);
        setBranchOffice(branch);
        setDayName(dayName);

        const attendanceDetails = attendanceData[id]?.[year]?.[month]?.[day] || {};
        const status = attendanceDetails.status || "";

        // Disable In Time and Out Time based on status
        if (status === "Present" || status === "Leave" || status === "Half Day") {
            setDisableInTime(true);
            setDisableOutTime(true);
        } else {
            setDisableInTime(false);
            setDisableOutTime(false);
        }

        if (status === "Leave") {
            setDisableInTime(true);
            setDisableOutTime(true);
            setIsOnLeave(true); // Set the checkbox to true
        } else {
            setDisableInTime(false);
            setDisableOutTime(false);
            setIsOnLeave(false); // Set the checkbox to false
            setInTime(intime);
            setOutTime(outtime);
        }

        // console.log("Attendance date is :", formattedDate);
        // console.log("Day name is :", dayName);
    };

    const handleSubmit = async (id, empId, name, designation, department, branch, date, day, inTime, outTime) => {

        let hasError = false;

        // Validate In Time
        if (!inTime) {
            setInTimeError("In Time is required");
            hasError = true;
        } else {
            setInTimeError(""); // Clear the error if valid
        }

        // Validate Out Time
        if (!outTime) {
            setOutTimeError("Out Time is required");
            hasError = true;
        } else {
            setOutTimeError(""); // Clear the error if valid
        }

        // If there's an error, do not proceed with submission
        if (hasError) {
            return;
        }

        let workingHours, status;

        const convertToMinutes = (timeString) => {
            const [hours, minutes] = timeString.split(':').map(Number);
            return hours * 60 + minutes;
        };

        const inTimeMinutes = convertToMinutes(inTime);
        const outTimeMinutes = convertToMinutes(outTime);
        const comparisonTimeEarly = convertToMinutes("10:01"); // 10:00 AM
        const comparisonTimeLate = convertToMinutes("13:00"); // 1:00 PM

        if (isOnLeave) {
            inTime = "00:00";
            outTime = "00:00";
            workingHours = "00:00";
            status = "Leave";
        } else {
            // const workingHours = calculateWorkingHours(inTime, outTime);
            // const calculateWorkingHours = (inTime, outTime) => {
            //     const [inHours, inMinutes] = inTime.split(':').map(Number);
            //     const [outHours, outMinutes] = outTime.split(':').map(Number);


            //     const inTimeMinutes = inHours * 60 + inMinutes;
            //     const outTimeMinutes = outHours * 60 + outMinutes;

            //     let workingMinutes = outTimeMinutes - inTimeMinutes - 45; // Subtract 45 minutes by default

            //     if (workingMinutes < 0) {
            //         workingMinutes += 24 * 60; // Adjust for overnight shifts
            //     }

            //     return workingMinutes;
            // };

            const calculateWorkingHours = (inTime, outTime) => {
                const convertToMinutes = (timeString) => {
                    const [hours, minutes] = timeString.split(':').map(Number);
                    return hours * 60 + minutes;
                };

                const formatToHHMM = (minutes) => {
                    const hours = Math.floor(minutes / 60);
                    const mins = minutes % 60;
                    return `${hours}:${mins < 10 ? '0' : ''}${mins}`;
                };

                const inTimeMinutes = convertToMinutes(inTime);
                const outTimeMinutes = convertToMinutes(outTime);

                const startBoundary = convertToMinutes("10:00"); // 10:00 AM
                const endBoundary = convertToMinutes("18:00"); // 6:00 PM

                let actualInTime = Math.max(inTimeMinutes, startBoundary); // If inTime is earlier than 10 AM, consider it as 10:00
                let actualOutTime = Math.min(outTimeMinutes, endBoundary); // If outTime is later than 6 PM, consider it as 6:00 PM

                let workingMinutes = actualOutTime - actualInTime - 45; // Subtract 45 minutes for the break

                // Ensure working minutes don't go negative
                if (workingMinutes < 0) {
                    workingMinutes = 0;
                }

                return workingMinutes;
            };

            const workingMinutes = calculateWorkingHours(inTime, outTime);

            // Convert minutes back to HH:MM format for display
            const hours = Math.floor(workingMinutes / 60);
            const minutes = workingMinutes % 60;
            workingHours = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

            // console.log("intimeminutes", inTimeMinutes)
            console.log("workingminutes", workingMinutes)
            if (inTimeMinutes >= comparisonTimeEarly & inTimeMinutes <= comparisonTimeLate) {
                status = "LC";
            } else if (workingMinutes >= 420) { // 7 hours 15 minutes in minutes
                status = "Present";
            } else if (workingMinutes >= 210 && workingMinutes < 420) { // 7 hours 15 minutes / 2 in minutes
                status = "Half Day";
            } else {
                status = "Leave";
            }
            // console.log("status", status)
        }

        const payload = {
            id: id,
            employeeId: empId,
            ename: name,
            designation: designation,
            department: department,
            branchOffice: branch,
            attendanceDate: date,
            dayName: day,
            inTime: inTime,
            outTime: outTime,
            workingHours: workingHours,
            status: status
        };

        setShowPopup(false);
        setInTime("");
        setOutTime("");
        setInTimeError("");
        setOutTimeError("");
        setDisableInTime(true);
        setDisableOutTime(true);

        try {
            const res = await axios.post(`${secretKey}/attendance/addAttendance`, payload);
            // console.log("Created attendance record is :", res.data);
            Swal.fire("success", "Attendance Successfully Added/Updated", "success");
        } catch (error) {
            console.log("Error adding attendance record", error);
            Swal.fire("error", "Error adding/updating attendance", "error");
        }
        fetchAttendance();
    };

    const handleClear = async (id, empId, name, designation, department, branch, date) => {
        // Define the new attendance data based on the checkbox state
        const updatedData = { inTime: "", outTime: "", workingHours: "", status: "" };

        // Update the local state
        // setAttendanceData(prevState => ({
        //     ...prevState,
        //     [empId]: {
        //         ...prevState[empId],
        //         ...updatedData
        //     }
        // }));

        // Prepare the payload for the API request
        const selectedDate = new Date(date);
        const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

        const payload = {
            id: id,
            employeeId: empId,
            ename: name,
            designation: designation,
            department: department,
            branchOffice: branch,
            attendanceDate: date,
            dayName: dayName,
            inTime: updatedData.inTime,
            outTime: updatedData.outTime,
            workingHours: updatedData.workingHours,
            status: updatedData.status
        };

        // console.log("Payload is :", payload);
        try {
            const res = await axios.post(`${secretKey}/attendance/addAttendance`, payload);
            Swal.fire("Success", "Attendance Successfully Added/Updated", "success");
        } catch (error) {
            console.log("Error updating attendance record", error);
            Swal.fire("Error", "Error adding/updating attendance", "error");
        }

        fetchAttendance(); // Refresh the attendance data after updating
    };

    const fetchAttendance = async () => {
        try {
            const res = await axios.get(`${secretKey}/attendance/viewAllAttendance`);
            const attendanceData = res.data.data;

            const attendanceMap = {};

            attendanceData.forEach(employee => {
                const { _id, years } = employee;
                attendanceMap[_id] = {}; // Initialize object for each employee

                // Iterate through all years (to support full-year attendance fetching)
                years.forEach(yearData => {
                    const { months } = yearData;

                    months.forEach(monthData => {
                        const { days } = monthData;

                        days.forEach(dayData => {
                            const { date, inTime, outTime, workingHours, status } = dayData;

                            // Initialize year and month if not present
                            if (!attendanceMap[_id][yearData.year]) {
                                attendanceMap[_id][yearData.year] = {};
                            }
                            if (!attendanceMap[_id][yearData.year][monthData.month]) {
                                attendanceMap[_id][yearData.year][monthData.month] = {};
                            }

                            // Store the day's attendance
                            attendanceMap[_id][yearData.year][monthData.month][date] = {
                                inTime,
                                outTime,
                                workingHours,
                                status,
                            };
                        });
                    });
                });
            });

            setAttendanceData(attendanceMap);
        } catch (error) {
            console.log("Error fetching attendance record", error);
        }
    };

    //console.log("attendancedata", attendanceData)
    const getSundaysOfMonth = (year, month) => {
        const sundays = [];
        let date = new Date(year, month, 1);

        while (date.getMonth() === month) {
            if (date.getDay() === 0) { // Sunday
                sundays.push(new Date(date));
            }
            date.setDate(date.getDate() + 1);
        }

        return sundays;
    };

    const submitSundaysAttendance = async (employees, year, month) => {
        const sundays = getSundaysOfMonth(year, month);

        for (const sunday of sundays) {
            const formattedDate = sunday.toISOString().split('T')[0];
            const dayName = "Sunday";

            for (const employee of employees) {
                const payload = {
                    id: employee.id,
                    employeeId: employee.empId,
                    ename: employee.name,
                    designation: employee.designation,
                    department: employee.department,
                    branchOffice: employee.branch,
                    attendanceDate: formattedDate,
                    dayName: dayName,
                    inTime: "00:00",
                    outTime: "00:00",
                    workingHours: "00:00",
                    status: "Sunday"
                };

                try {
                    await axios.post(`${secretKey}/attendance/addAttendance`, payload);
                } catch (error) {
                    console.error(`Error adding attendance for ${employee.name} on ${formattedDate}:`, error);
                }
            }
        }
    };

    useEffect(() => {
        const initialize = async () => {
            await fetchEmployees();
            await fetchDeletedEmployees();
            await fetchAttendance();

            // // Submit Sundays' attendance for each branch's employees
            // const today = new Date();
            // const year = today.getFullYear();
            // const month = today.getMonth(); // 0 for January, 1 for February, etc.

            // await submitSundaysAttendance(gotaBranchEmployees, year, month);
            // await submitSundaysAttendance(sindhuBhawanBranchEmployees, year, month);
        };

        initialize();
    }, [year, month, showAttendanceForParticularEmployee]);

    const officialHolidays = [
        '14-01-2024', '15-01-2024', '24-03-2024', '25-03-2024',
        '07-07-2024', "10-08-2024", "09-08-2024", '19-08-2024', '12-10-2024', '31-10-2024',
        '01-11-2024', '02-11-2024', '03-11-2024', '04-11-2024', '05-11-2024'
    ];

    const formatDateForHolidayCheck = (year, month, day) => {
        const formattedDay = day < 10 ? '0' + day : day;
        const formattedMonth = month < 10 ? '0' + month : month;
        return `${formattedDay}-${formattedMonth}-${year}`;
    };


    return (
        <>
            <div>
                <div className="my-tab card-header">
                    <ul class="nav nav-tabs hr_emply_list_navtabs nav-fill p-0">
                        <li class="nav-item hr_emply_list_navitem">
                            <a class="nav-link active" data-bs-toggle="tab" href="#gota">
                                <div className="d-flex align-items-center justify-content-between w-100">
                                    <div className="rm_txt_tsn">
                                        Gota
                                    </div>
                                    <div className="rm_tsn_bdge">
                                        {gotaBranchEmployees.length || 0}
                                    </div>
                                </div>
                            </a>
                        </li>
                        <li class="nav-item hr_emply_list_navitem">
                            <a class="nav-link " data-bs-toggle="tab" href="#sbr">
                                <div className="d-flex align-items-center justify-content-between w-100">
                                    <div className="rm_txt_tsn">
                                        SBR
                                    </div>
                                    <div className="rm_tsn_bdge">
                                        {sindhuBhawanBranchEmployees.length || 0}
                                    </div>
                                </div>
                            </a>
                        </li>
                        <li class="nav-item hr_emply_list_navitem">
                            <a class="nav-link " data-bs-toggle="tab" href="#DeletedEmployees">
                                <div className="d-flex align-items-center justify-content-between w-100">
                                    <div className="rm_txt_tsn">
                                        Deleted
                                    </div>
                                    <div className="rm_tsn_bdge">
                                        {deletedEmployees.length || 0}
                                    </div>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Gota Employees Data */}
                <div class="tab-content card-body">
                    <div class="tab-pane active" id="gota">
                        <div className="table table-responsive table-style-4 m-0">
                            <table className="table table-vcenter table-nowrap attendance-table">
                                <thead className="tr-sticky">
                                    <tr>
                                        <th className='hr-sticky-left-1'>Sr. No</th>
                                        <th className='hr-sticky-left-2'>Name</th>

                                        {/* Generate table headers with day labels */}
                                        {selectedMonthDays.map(day => {
                                            const fullDate = new Date(`${day}-${month}-${year}`); // Assuming month is 1-based (January is 1)
                                            const isSunday = fullDate.getDay() === 0;
                                            return (
                                                <th className='th-day' key={day}>
                                                    <div className='d-flex align-items-center justify-content-between'>
                                                        <div>
                                                            {getDayLabel(day)}
                                                        </div>
                                                        <div className='view-attendance-th-icon'>
                                                            <FaRegCalendarPlus
                                                                onClick={() => !isSunday && date(fullDate, gotaBranchEmployees)} // Disable onClick for Sundays
                                                                style={{ color: isSunday ? 'gray' : 'inherit', cursor: isSunday ? 'not-allowed' : 'pointer' }} // Style adjustment for Sundays
                                                            />
                                                        </div>
                                                    </div>
                                                </th>
                                            );
                                        })}
                                        <th className='hr-sticky-action4'>
                                            <div className='l-lc'>
                                                LC
                                            </div>
                                        </th>
                                        <th className='hr-sticky-action3'>
                                            <div className='p-present'>
                                                P
                                            </div>
                                        </th>
                                        <th className='hr-sticky-action2'>
                                            <div className='l-leave'>
                                                L
                                            </div>
                                        </th>
                                        <th className='hr-sticky-action1'>
                                            <div className='H-Halfday'>
                                                H
                                            </div>
                                        </th>
                                    </tr>
                                </thead>

                                {isLoading ? (
                                    <tbody>
                                        <div className="LoaderTDSatyle w-100">
                                            <ClipLoader
                                                color="lightgrey"
                                                loading={true}
                                                size={30}
                                                aria-label="Loading Spinner"
                                                data-testid="loader"
                                            />
                                        </div>
                                    </tbody>
                                ) :
                                    gotaBranchEmployees.length !== 0 ? (
                                        <tbody>
                                            {gotaBranchEmployees.map((emp, index) => {
                                                const profilePhotoUrl = emp.profilePhoto?.length !== 0
                                                    ? `${secretKey}/employee/fetchProfilePhoto/${emp._id}/${emp.profilePhoto?.[0]?.filename}`
                                                    : emp.gender === "Male" ? MaleEmployee : FemaleEmployee;
                                                const empAttendance = attendanceData[emp._id] || {};
                                                // Track if 'LCH' is present in the specific month and year for the given employee
                                                // let hasLCH = false;

                                                // let presentCount = 0;
                                                // let leaveCount = 0;
                                                // let halfDayCount = 0;
                                                // let lcCount = 0;
                                                const joiningDate = new Date(emp.jdate);
                                                let presentCount = 0;
                                                let leaveCount = 0;
                                                let halfDayCount = 0;
                                                let lcCount = 0;
                                                let hasLCH = false;
                                                let lcStatusesAsPresent = 0;
                                                let lchCount = 0;

                                                // Initial pass to count all relevant statuses
                                                for (const day of selectedMonthDays) {
                                                    const formattedDate = `${year}-${monthNumber < 10 ? '0' + monthNumber : monthNumber}-${day < 10 ? '0' + day : day}`;
                                                    const attendanceDate = empAttendance[year]?.[month]?.[day] || {};

                                                    // Check if the day has attendance data
                                                    if (attendanceDate) {
                                                        const status = attendanceDate.status;

                                                        // Track if 'LCH' is present in the data
                                                        if (status === "LCH") {
                                                            hasLCH = true;
                                                        }

                                                        // Count statuses and log each 'Present' count
                                                        if (status === "Present") {
                                                            presentCount++;
                                                            console.log(`Present Count for ${formattedDate}: ${presentCount}`);
                                                        }
                                                        // Count LC statuses separately if LCH is present
                                                        if (status === "LC1" ||
                                                            status === "LC2" ||
                                                            status === "LC3" ||
                                                            status === "LCH"
                                                            ) {
                                                            lchCount++;
                                                           
                                                        }
                                                        // Count LC statuses separately if LCH is present
                                                        if (status === "LC1" ||
                                                            status === "LC2" ||
                                                            status === "LC3" 
                                                            ) {
                                                            lcCount++;
                                                            if (hasLCH) {
                                                                lcStatusesAsPresent++;
                                                            }
                                                        }

                                                        if (status === "Leave") {
                                                            leaveCount++;
                                                        }

                                                        if (status === "Half Day" ||
                                                            status === "LC1" ||
                                                            status === "LC2" ||
                                                            status === "LC3" ||
                                                            status === "LCH") {
                                                            halfDayCount++;
                                                        }
                                                    }
                                                }

                                                // Adjust presentCount based on the presence of 'LCH'
                                                if (hasLCH) {
                                                    // Remove LC statuses counted as Present if LCH is found
                                                    presentCount -= lcStatusesAsPresent;

                                                    // Ensure that halfDayCount includes LC counts if LCH is present
                                                    halfDayCount += lcCount;

                                                    halfDayCount -= lcCount;
                                                }

                                                // Ensure that halfDayCount does not exceed the sum of distinct categories
                                                halfDayCount = Math.min(halfDayCount, lcCount + (halfDayCount - lcCount));

                                                console.log(`Final Present Count: ${presentCount}`);
                                                console.log(`Final Leave Count: ${leaveCount}`);
                                                console.log(`Final Half Day Count: ${halfDayCount}`);

                                                return (
                                                    <tr key={index}>
                                                        <td className='hr-sticky-left-1'>{index + 1}</td>
                                                        <td className='hr-sticky-left-2'>
                                                            <div className="d-flex align-items-center">
                                                                <div className="tbl-pro-img">
                                                                    <img src={profilePhotoUrl} alt="Profile" className="profile-photo" />
                                                                </div>
                                                                <div onClick={() => handleShowParticularEmployeeAttendance(emp._id, emp.ename)} className="cursor-pointer">
                                                                    {emp.ename}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        {selectedMonthDays.map(day => {

                                                            const formattedDate = `${year}-${monthNumber < 10 ? '0' + monthNumber : monthNumber}-${day < 10 ? '0' + day : day}`;
                                                            const { attendanceDate = formattedDate } = empAttendance;
                                                            // console.log("empAttendance", empAttendance)

                                                            const currentYear = year; // Use the prop year instead of the current year
                                                            const currentMonth = month; // Use the prop month instead of the current month
                                                            const currentDay = new Date().getDate();
                                                            const myDate = new Date(attendanceDate).getDate();

                                                            const currentDate = new Date(); // Today's date
                                                            const selectedDate = new Date(`${currentYear}-${monthNumber < 10 ? '0' + monthNumber : monthNumber}-${day < 10 ? '0' + day : day}`);

                                                            const isFutureDate = selectedDate > currentDate;

                                                            // Format selected date for holiday check
                                                            const formattedSelectedDate = formatDateForHolidayCheck(currentYear, monthNumber, day);

                                                            // Check if selected date is an official holiday
                                                            const isHoliday = officialHolidays.includes(formattedSelectedDate);

                                                            const attendanceDetails = empAttendance[currentYear]?.[currentMonth]?.[myDate] || {
                                                                inTime: "",
                                                                outTime: "",
                                                                workingHours: "",
                                                                status: ""
                                                            };
                                                            //console.log("attendancedetails" , attendanceDetails ,emp.ename)
                                                            // if (attendanceDetails.status === "LC1" ||
                                                            //     attendanceDetails.status === "LC2" ||
                                                            //     attendanceDetails.status === "LC3" ||
                                                            //     attendanceDetails.status === "LCH") lcCount++
                                                            // if (attendanceDetails.status === "Present" ||
                                                            //     attendanceDetails.status === "LC1" ||
                                                            //     attendanceDetails.status === "LC2" ||
                                                            //     attendanceDetails.status === "LC3") presentCount++;
                                                            // if (attendanceDetails.status === "Leave") leaveCount++;
                                                            // if (attendanceDetails.status === "Half Day" ||
                                                            //     attendanceDetails.status === "LCH") halfDayCount++;

                                                            // console.log("Emp attendance details :", attendanceDetails);


                                                            const status = attendanceData[emp._id]?.status || attendanceDetails.status || "";
                                                            const intime = attendanceData[emp._id]?.inTime || attendanceDetails.inTime || "";
                                                            const outtime = attendanceData[emp._id]?.outTime || attendanceDetails.outTime || "";

                                                            return (
                                                                <td key={day}>
                                                                    <div
                                                                        onClick={() => handleDayClick(day, emp._id, emp.empFullName, emp.employeeId, emp.newDesignation, emp.department, emp.branchOffice, intime, outtime)}
                                                                        className={`
                                                                   ${status === "Present" ? "p-present" : ""}
                                                                       ${status === "Half Day" ? "H-Halfday" : ""}
                                                                            ${status === "Leave" ? "l-leave" : ""}
                                                                            ${status.startsWith("LC") ? "l-lc" : ""}
                                                                        `.trim()}
                                                                    >
                                                                        {status === "Present" ? "P" :
                                                                            status === "Half Day" ? "H" :
                                                                                status === "Leave" ? "L" :
                                                                                    status.startsWith("LC") ? status : ""
                                                                        }
                                                                    </div>
                                                                    {!status && (
                                                                        <div>
                                                                            {selectedDate < joiningDate ? (
                                                                                <div className='before-joining-icon'><FcCancel /></div>
                                                                            ) : isHoliday ? (
                                                                                // Logic for Official Holidays (OH)
                                                                                (() => {
                                                                                    let prevDay = day - 1;
                                                                                    let nextDay = day + 1;
                                                                                    // Function to find previous working day
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
                                                                                    const prevWorkingDate = findPrevWorkingDay(currentYear, monthNumber, prevDay);
                                                                                    const nextWorkingDate = findNextWorkingDay(currentYear, monthNumber, nextDay);

                                                                                    // Example to fetch status from attendance data for previous and next working days
                                                                                    const prevDayStatus = attendanceData[emp._id]?.[prevWorkingDate.year]?.[getMonthName(prevWorkingDate.month)]?.[prevWorkingDate.day]?.status;
                                                                                    const nextDayStatus = attendanceData[emp._id]?.[nextWorkingDate.year]?.[getMonthName(nextWorkingDate.month)]?.[nextWorkingDate.day]?.status;

                                                                                    // console.log("Previous Working Date:", prevWorkingDate);
                                                                                    // console.log("Next Working Date:", nextWorkingDate);
                                                                                    // console.log("Previous Day Status:", prevDayStatus);
                                                                                    // console.log("Next Day Status:", nextDayStatus);

                                                                                    if (
                                                                                        (prevDayStatus === "Leave" && nextDayStatus === "Leave") ||
                                                                                        (prevDayStatus === "Leave" && nextDayStatus === "Half Day") ||
                                                                                        (prevDayStatus === "Half Day" && nextDayStatus === "Leave")
                                                                                    ) {
                                                                                        return (
                                                                                            <>
                                                                                                <div className="sl-sunday">OHL</div> {/* Fill Sunday with "SL" if adjacent days meet the conditions */}
                                                                                                <div className="d-none">{leaveCount++}</div> {/* Increment leaveCount for Sunday */}
                                                                                            </>
                                                                                        );
                                                                                    } else if (
                                                                                        (prevDayStatus === "Half Day" && nextDayStatus === "Half Day") ||
                                                                                        (prevDayStatus === "LCH" && nextDayStatus === "LCH") ||
                                                                                        (prevDayStatus === "LCH" && nextDayStatus === "Half Day") ||
                                                                                        (prevDayStatus === "Half Day" && nextDayStatus === "LCH")
                                                                                    ) {
                                                                                        return (
                                                                                            <>
                                                                                                <div className="sh-sunday">OHH</div> {/* Fill Sunday with "SH" if both adjacent days are "Half-Day" */}
                                                                                                <div className="d-none">{halfDayCount++}</div> {/* Increment leaveCount for Sunday */}
                                                                                            </>
                                                                                        );
                                                                                    } else {
                                                                                        return <div className="s-sunday">OH</div>; // Default Sunday fill with "S"
                                                                                    }
                                                                                })()
                                                                            ) : selectedDate.getDay() === 0 ? ( // Logic for Sunday
                                                                                (() => {
                                                                                    let prevDay = day - 1;
                                                                                    let nextDay = day + 1;
                                                                                    // Function to find previous working day
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
                                                                                    const prevWorkingDate = findPrevWorkingDay(currentYear, monthNumber, prevDay);
                                                                                    const nextWorkingDate = findNextWorkingDay(currentYear, monthNumber, nextDay);

                                                                                    // Example to fetch status from attendance data for previous and next working days
                                                                                    const prevDayStatus = attendanceData[emp._id]?.[prevWorkingDate.year]?.[getMonthName(prevWorkingDate.month)]?.[prevWorkingDate.day]?.status;
                                                                                    const nextDayStatus = attendanceData[emp._id]?.[nextWorkingDate.year]?.[getMonthName(nextWorkingDate.month)]?.[nextWorkingDate.day]?.status;

                                                                                    // console.log("Previous Working Date:", prevWorkingDate);
                                                                                    // console.log("Next Working Date:", nextWorkingDate);
                                                                                    // console.log("Previous Day Status:", prevDayStatus);
                                                                                    // console.log("Next Day Status:", nextDayStatus);


                                                                                    if (
                                                                                        (prevDayStatus === "Leave" && nextDayStatus === "Leave") ||
                                                                                        (prevDayStatus === "Leave" && nextDayStatus === "Half Day") ||
                                                                                        (prevDayStatus === "Half Day" && nextDayStatus === "Leave")

                                                                                    ) {
                                                                                        return (
                                                                                            <>
                                                                                                <div className="sl-sunday">SL</div> {/* Fill Sunday with "SL" if adjacent days meet the conditions */}
                                                                                                <div className="d-none">{leaveCount++}</div> {/* Increment leaveCount for Sunday */}
                                                                                            </>
                                                                                        );
                                                                                    } else if (
                                                                                        (prevDayStatus === "Half Day" && nextDayStatus === "Half Day") ||
                                                                                        (prevDayStatus === "LCH" && nextDayStatus === "LCH") ||
                                                                                        (prevDayStatus === "LCH" && nextDayStatus === "Half Day") ||
                                                                                        (prevDayStatus === "Half Day" && nextDayStatus === "LCH")
                                                                                    ) {
                                                                                        return (
                                                                                            <>
                                                                                                <div className="sh-sunday">SH</div> {/* Fill Sunday with "SH" if both adjacent days are "Half-Day" */}
                                                                                                <div className="d-none">{halfDayCount++}</div> {/* Increment leaveCount for Sunday */}
                                                                                            </>
                                                                                        );
                                                                                    }
                                                                                    // else if (
                                                                                    //     (prevDayStatus === "Present" || nextDayStatus === "Half Day") ||
                                                                                    //     (prevDayStatus === "Leave" && nextDayStatus === "Present") ||
                                                                                    //     (prevDayStatus === "Half Day" && nextDayStatus === "Present") ||
                                                                                    //     (prevDayStatus === "Present" && nextDayStatus === "Present") ||
                                                                                    //     (prevDayStatus === "LC1" && nextDayStatus === "Present") ||
                                                                                    //     (prevDayStatus === "LC2" && nextDayStatus === "Present") ||
                                                                                    //     (prevDayStatus === "LC3" && nextDayStatus === "Present") ||
                                                                                    //     (prevDayStatus === "Present" && nextDayStatus === "LC1") ||
                                                                                    //     (prevDayStatus === "Present" && nextDayStatus === "LC2") ||
                                                                                    //     (prevDayStatus === "Present" && nextDayStatus === "LC2")
                                                                                    // ) {
                                                                                    //     return (
                                                                                    //         <>
                                                                                    //             <div className="s-sunday">S</div> {/* Fill Sunday with "SH" if both adjacent days are "Half-Day" */}
                                                                                    //             <div className="d-none">{presentCount++}</div> {/* Increment leaveCount for Sunday */}
                                                                                    //         </>
                                                                                    //     );
                                                                                    // }
                                                                                    else {
                                                                                        return (<>
                                                                                            <div className="s-sunday">S</div>
                                                                                            {/* <div className="d-none">{presentCount++}</div> */}

                                                                                        </>) // Default Sunday fill with "S"
                                                                                    }
                                                                                })()
                                                                            ) : (
                                                                                <button
                                                                                    className={`${isFutureDate ? 'p-disabled' : 'p-add'}`}
                                                                                    onClick={() => handleDayClick(day, emp._id, emp.empFullName, emp.employeeId, emp.newDesignation, emp.department, emp.branchOffice)}
                                                                                    disabled={isFutureDate} // Disable button for future dates
                                                                                >
                                                                                    {day <= daysInMonth && <FaPlus />}
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </td>
                                                            );
                                                        })}
                                                        <td className='hr-sticky-action4'>
                                                            {lchCount}
                                                        </td>
                                                        <td className='hr-sticky-action3'>
                                                            {presentCount}
                                                        </td>
                                                        <td className='hr-sticky-action2'>
                                                            {leaveCount}
                                                        </td>
                                                        <td className='hr-sticky-action1'>
                                                            {halfDayCount}
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    ) : (
                                        <tbody>
                                            <tr>
                                                <td colSpan="36" style={{ textAlign: "center" }}>
                                                    <Nodata />
                                                </td>
                                            </tr>
                                        </tbody>
                                    )}
                            </table>
                        </div>
                    </div>



                    {/* SBR Employees Data */}
                    <div class="tab-pane" id="sbr">
                        <div className="table table-responsive table-style-4 m-0">
                            <table className="table table-vcenter table-nowrap attendance-table tbl-collps attendance-tbl">
                                <thead className="tr-sticky">
                                    <tr>
                                        <th className='hr-sticky-left-1'>Sr. No</th>
                                        <th className='hr-sticky-left-2'>Name</th>

                                        {/* Generate table headers with day labels */}
                                        {selectedMonthDays.map(day => {
                                            const fullDate = new Date(`${day}-${month}-${year}`); // Assuming month is 1-based (January is 1)
                                            const isSunday = fullDate.getDay() === 0;
                                            return (
                                                <th className='th-day' key={day}>
                                                    <div className='d-flex align-items-center justify-content-between'>
                                                        <div>
                                                            {getDayLabel(day)}
                                                        </div>
                                                        <div className='view-attendance-th-icon'>
                                                            <FaRegCalendarPlus
                                                                onClick={() => !isSunday && date(fullDate, sindhuBhawanBranchEmployees)} // Disable onClick for Sundays
                                                                style={{ color: isSunday ? 'gray' : 'inherit', cursor: isSunday ? 'not-allowed' : 'pointer' }} // Style adjustment for Sundays
                                                            />
                                                        </div>
                                                    </div>
                                                </th>
                                            );
                                        })}
                                        <th className='hr-sticky-action4'>
                                            <div className='l-lc'>
                                                LC
                                            </div>
                                        </th>
                                        <th className='hr-sticky-action3'>
                                            <div className='p-present'>
                                                P
                                            </div>
                                        </th>
                                        <th className='hr-sticky-action2'>
                                            <div className='l-leave'>
                                                L
                                            </div>
                                        </th>
                                        <th className='hr-sticky-action1'>
                                            <div className='H-Halfday'>
                                                H
                                            </div>
                                        </th>
                                    </tr>
                                </thead>

                                {isLoading ? (
                                    <tbody>
                                        <div className="LoaderTDSatyle w-100">
                                            <ClipLoader
                                                color="lightgrey"
                                                loading={true}
                                                size={30}
                                                aria-label="Loading Spinner"
                                                data-testid="loader"
                                            />
                                        </div>
                                    </tbody>
                                ) : sindhuBhawanBranchEmployees.length !== 0 ? (
                                    <tbody>
                                        {sindhuBhawanBranchEmployees.map((emp, index) => {
                                            const profilePhotoUrl = emp.profilePhoto?.length !== 0
                                                ? `${secretKey}/employee/fetchProfilePhoto/${emp._id}/${emp.profilePhoto?.[0]?.filename}`
                                                : emp.gender === "Male" ? MaleEmployee : FemaleEmployee;
                                                const empAttendance = attendanceData[emp._id] || {};
                                            // let presentCount = 0;
                                            // let leaveCount = 0;
                                            // let halfDayCount = 0;
                                            // let lcCount = 0;
                                            const joiningDate = new Date(emp.jdate);
                                            let presentCount = 0;
                                                let leaveCount = 0;
                                                let halfDayCount = 0;
                                                let lcCount = 0;
                                                let hasLCH = false;
                                                let lcStatusesAsPresent = 0;
                                                let lchCount = 0;

                                                // Initial pass to count all relevant statuses
                                                for (const day of selectedMonthDays) {
                                                    const formattedDate = `${year}-${monthNumber < 10 ? '0' + monthNumber : monthNumber}-${day < 10 ? '0' + day : day}`;
                                                    const attendanceDate = empAttendance[year]?.[month]?.[day] || {};

                                                    // Check if the day has attendance data
                                                    if (attendanceDate) {
                                                        const status = attendanceDate.status;

                                                        // Track if 'LCH' is present in the data
                                                        if (status === "LCH") {
                                                            hasLCH = true;
                                                        }

                                                        // Count statuses and log each 'Present' count
                                                        if (status === "Present") {
                                                            presentCount++;
                                                            console.log(`Present Count for ${formattedDate}: ${presentCount}`);
                                                        }
                                                        // Count LC statuses separately if LCH is present
                                                        if (status === "LC1" ||
                                                            status === "LC2" ||
                                                            status === "LC3" ||
                                                            status === "LCH"
                                                            ) {
                                                            lchCount++;
                                                           
                                                        }
                                                        // Count LC statuses separately if LCH is present
                                                        if (status === "LC1" ||
                                                            status === "LC2" ||
                                                            status === "LC3" 
                                                            ) {
                                                            lcCount++;
                                                            if (hasLCH) {
                                                                lcStatusesAsPresent++;
                                                            }
                                                        }

                                                        if (status === "Leave") {
                                                            leaveCount++;
                                                        }

                                                        if (status === "Half Day" ||
                                                            status === "LC1" ||
                                                            status === "LC2" ||
                                                            status === "LC3" ||
                                                            status === "LCH") {
                                                            halfDayCount++;
                                                        }
                                                    }
                                                }

                                                // Adjust presentCount based on the presence of 'LCH'
                                                if (hasLCH) {
                                                    // Remove LC statuses counted as Present if LCH is found
                                                    presentCount -= lcStatusesAsPresent;

                                                    // Ensure that halfDayCount includes LC counts if LCH is present
                                                    halfDayCount += lcCount;

                                                    halfDayCount -= lcCount;
                                                }

                                                // Ensure that halfDayCount does not exceed the sum of distinct categories
                                                halfDayCount = Math.min(halfDayCount, lcCount + (halfDayCount - lcCount));


                                            return (
                                                <tr key={index}>
                                                    <td className='hr-sticky-left-1'>{index + 1}</td>
                                                    <td className='hr-sticky-left-2'>
                                                        <div className="d-flex align-items-center">
                                                            <div className="tbl-pro-img">
                                                                <img src={profilePhotoUrl} alt="Profile" className="profile-photo" />
                                                            </div>
                                                            <div className="d-flex align-items-center justify-content-center">
                                                                <div onClick={() => handleShowParticularEmployeeAttendance(emp._id, emp.ename)} className="cursor-pointer">
                                                                    {emp.ename}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {selectedMonthDays.map(day => {
                                                        //const empAttendance = attendanceData[emp._id] || {};
                                                        const formattedDate = `${year}-${monthNumber < 10 ? '0' + monthNumber : monthNumber}-${day < 10 ? '0' + day : day}`;
                                                        const { attendanceDate = formattedDate } = empAttendance;

                                                        const currentYear = year; // Use the prop year instead of the current year
                                                        const currentMonth = month; // Use the prop month instead of the current month
                                                        const currentDay = new Date().getDate();
                                                        const myDate = new Date(attendanceDate).getDate();

                                                        const currentDate = new Date(); // Today's date
                                                        const selectedDate = new Date(`${currentYear}-${monthNumber < 10 ? '0' + monthNumber : monthNumber}-${day < 10 ? '0' + day : day}`);

                                                        const isFutureDate = selectedDate > currentDate;

                                                        // Format selected date for holiday check
                                                        const formattedSelectedDate = formatDateForHolidayCheck(currentYear, monthNumber, day);

                                                        // Check if selected date is an official holiday
                                                        const isHoliday = officialHolidays.includes(formattedSelectedDate);

                                                        const attendanceDetails = empAttendance[currentYear]?.[currentMonth]?.[myDate] || {
                                                            inTime: "",
                                                            outTime: "",
                                                            workingHours: "",
                                                            status: ""
                                                        };
                                                        // if (attendanceDetails.status === "LC1" ||
                                                        //     attendanceDetails.status === "LC2" ||
                                                        //     attendanceDetails.status === "LC3" || attendanceDetails.status === "LCH") lcCount++
                                                        // if (attendanceDetails.status === "Present" ||
                                                        //     attendanceDetails.status === "LC1" ||
                                                        //     attendanceDetails.status === "LC2" ||
                                                        //     attendanceDetails.status === "LC3") presentCount++;
                                                        // if (attendanceDetails.status === "Leave") leaveCount++;
                                                        // if (attendanceDetails.status === "Half Day" ||
                                                        //     attendanceDetails.status === "LCH") halfDayCount++;

                                                        // console.log("Emp attendance details :", attendanceDetails);

                                                        const status = attendanceData[emp._id]?.status || attendanceDetails.status || "";
                                                        const intime = attendanceData[emp._id]?.inTime || attendanceDetails.inTime || "";
                                                        const outtime = attendanceData[emp._id]?.outTime || attendanceDetails.outTime || "";

                                                        return (
                                                            <td key={day}>
                                                                <div
                                                                    onClick={() => handleDayClick(day, emp._id, emp.empFullName, emp.employeeId, emp.newDesignation, emp.department, emp.branchOffice, intime, outtime)}
                                                                    className={`
                                                                   ${status === "Present" ? "p-present" : ""}
                                                                       ${status === "Half Day" ? "H-Halfday" : ""}
                                                                            ${status === "Leave" ? "l-leave" : ""}
                                                                            ${status.startsWith("LC") ? "l-lc" : ""}
                                                                        `.trim()}
                                                                >
                                                                    {status === "Present" ? "P" :
                                                                        status === "Half Day" ? "H" :
                                                                            status === "Leave" ? "L" :
                                                                                status.startsWith("LC") ? status : ""
                                                                    }
                                                                </div>
                                                                {!status && (
                                                                    <div>
                                                                        {selectedDate < joiningDate ? (
                                                                            <div className='before-joining-icon'><FcCancel /></div>
                                                                        ) : isHoliday ? (
                                                                            // Logic for Official Holidays (OH)
                                                                            (() => {
                                                                                let prevDay = day - 1;
                                                                                let nextDay = day + 1;
                                                                                // Function to find previous working day
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
                                                                                const prevWorkingDate = findPrevWorkingDay(currentYear, monthNumber, prevDay);
                                                                                const nextWorkingDate = findNextWorkingDay(currentYear, monthNumber, nextDay);

                                                                                // Example to fetch status from attendance data for previous and next working days
                                                                                const prevDayStatus = attendanceData[emp._id]?.[prevWorkingDate.year]?.[getMonthName(prevWorkingDate.month)]?.[prevWorkingDate.day]?.status;
                                                                                const nextDayStatus = attendanceData[emp._id]?.[nextWorkingDate.year]?.[getMonthName(nextWorkingDate.month)]?.[nextWorkingDate.day]?.status;

                                                                                // console.log("Previous Working Date:", prevWorkingDate);
                                                                                // console.log("Next Working Date:", nextWorkingDate);
                                                                                // console.log("Previous Day Status:", prevDayStatus);
                                                                                // console.log("Next Day Status:", nextDayStatus);
                                                                                if (
                                                                                    (prevDayStatus === "Leave" && nextDayStatus === "Leave") ||
                                                                                    (prevDayStatus === "Leave" && nextDayStatus === "Half Day") ||
                                                                                    (prevDayStatus === "Half Day" && nextDayStatus === "Leave")
                                                                                ) {
                                                                                    return (
                                                                                        <>
                                                                                            <div className="sl-sunday">OHL</div> {/* Fill Sunday with "SL" if adjacent days meet the conditions */}
                                                                                            <div className="d-none">{leaveCount++}</div> {/* Increment leaveCount for Sunday */}
                                                                                        </>
                                                                                    );
                                                                                } else if (
                                                                                    (prevDayStatus === "Half Day" && nextDayStatus === "Half Day") ||
                                                                                    (prevDayStatus === "LCH" && nextDayStatus === "LCH") ||
                                                                                    (prevDayStatus === "LCH" && nextDayStatus === "Half Day") ||
                                                                                    (prevDayStatus === "Half Day" && nextDayStatus === "LCH")
                                                                                ) {
                                                                                    return (
                                                                                        <>
                                                                                            <div className="sh-sunday">OHH</div> {/* Fill Sunday with "SH" if both adjacent days are "Half-Day" */}
                                                                                            <div className="d-none">{halfDayCount++}</div> {/* Increment leaveCount for Sunday */}
                                                                                        </>
                                                                                    );
                                                                                } else {
                                                                                    return <div className="s-sunday">OH</div>; // Default Sunday fill with "S"
                                                                                }
                                                                            })()
                                                                        ) : selectedDate.getDay() === 0 ? ( // Logic for Sunday
                                                                            (() => {
                                                                                let prevDay = day - 1;
                                                                                let nextDay = day + 1;
                                                                                // Function to find previous working day
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
                                                                                const prevWorkingDate = findPrevWorkingDay(currentYear, monthNumber, prevDay);
                                                                                const nextWorkingDate = findNextWorkingDay(currentYear, monthNumber, nextDay);

                                                                                // Example to fetch status from attendance data for previous and next working days
                                                                                const prevDayStatus = attendanceData[emp._id]?.[prevWorkingDate.year]?.[getMonthName(prevWorkingDate.month)]?.[prevWorkingDate.day]?.status;
                                                                                const nextDayStatus = attendanceData[emp._id]?.[nextWorkingDate.year]?.[getMonthName(nextWorkingDate.month)]?.[nextWorkingDate.day]?.status;

                                                                                // console.log("Previous Working Date:", prevWorkingDate);
                                                                                // console.log("Next Working Date:", nextWorkingDate);
                                                                                // console.log("Previous Day Status:", prevDayStatus);
                                                                                // console.log("Next Day Status:", nextDayStatus);

                                                                                if (
                                                                                    (prevDayStatus === "Leave" && nextDayStatus === "Leave") ||
                                                                                    (prevDayStatus === "Leave" && nextDayStatus === "Half Day") ||
                                                                                    (prevDayStatus === "Half Day" && nextDayStatus === "Leave")
                                                                                ) {
                                                                                    return (
                                                                                        <>
                                                                                            <div className="sl-sunday">SL</div> {/* Fill Sunday with "SL" if adjacent days meet the conditions */}
                                                                                            <div className="d-none">{leaveCount++}</div> {/* Increment leaveCount for Sunday */}
                                                                                        </>
                                                                                    );
                                                                                } else if (
                                                                                    (prevDayStatus === "Half Day" && nextDayStatus === "Half Day") ||
                                                                                    (prevDayStatus === "LCH" && nextDayStatus === "LCH") ||
                                                                                    (prevDayStatus === "LCH" && nextDayStatus === "Half Day") ||
                                                                                    (prevDayStatus === "Half Day" && nextDayStatus === "LCH")
                                                                                ) {
                                                                                    return (
                                                                                        <>
                                                                                            <div className="sh-sunday">SH</div> {/* Fill Sunday with "SH" if both adjacent days are "Half-Day" */}
                                                                                            <div className="d-none">{halfDayCount++}</div> {/* Increment leaveCount for Sunday */}
                                                                                        </>
                                                                                    );
                                                                                }
                                                                                else if (
                                                                                    (prevDayStatus === "Present" || nextDayStatus === "Half Day") ||
                                                                                    (prevDayStatus === "Leave" && nextDayStatus === "Present") ||
                                                                                    (prevDayStatus === "Half Day" && nextDayStatus === "Present") ||
                                                                                    (prevDayStatus === "Present" && nextDayStatus === "Present") ||
                                                                                    (prevDayStatus === "LC1" && nextDayStatus === "Present") ||
                                                                                    (prevDayStatus === "LC2" && nextDayStatus === "Present") ||
                                                                                    (prevDayStatus === "LC3" && nextDayStatus === "Present") ||
                                                                                    (prevDayStatus === "Present" && nextDayStatus === "LC1") ||
                                                                                    (prevDayStatus === "Present" && nextDayStatus === "LC2") ||
                                                                                    (prevDayStatus === "Present" && nextDayStatus === "LC2")
                                                                                ) {
                                                                                    return (
                                                                                        <>
                                                                                            <div className="s-sunday">S</div> {/* Fill Sunday with "SH" if both adjacent days are "Half-Day" */}
                                                                                            <div className="d-none">{presentCount++}</div> {/* Increment leaveCount for Sunday */}
                                                                                        </>
                                                                                    );
                                                                                } 
                                                                                // else {
                                                                                //     return (<>
                                                                                //         <div className="s-sunday">S</div>
                                                                                //         <div className="d-none">{presentCount++}</div>

                                                                                //     </>) // Default Sunday fill with "S"
                                                                                // }
                                                                            })()
                                                                        ) : (
                                                                            <button
                                                                                className={`${isFutureDate ? 'p-disabled' : 'p-add'}`}
                                                                                onClick={() => handleDayClick(day, emp._id, emp.empFullName, emp.employeeId, emp.newDesignation, emp.department, emp.branchOffice)}
                                                                                disabled={isFutureDate} // Disable button for future dates
                                                                            >
                                                                                {day <= daysInMonth && <FaPlus />}
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </td>
                                                        );
                                                    })}
                                                   <td className='hr-sticky-action4'>
                                                            {lchCount}
                                                        </td>
                                                    <td className='hr-sticky-action3'>
                                                        {presentCount}
                                                    </td>
                                                    <td className='hr-sticky-action2'>
                                                        {leaveCount}
                                                    </td>
                                                    <td className='hr-sticky-action1'>
                                                        {halfDayCount}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                ) : (
                                    <tbody>
                                        <tr>
                                            <td colSpan="36" style={{ textAlign: "center" }}>
                                                <Nodata />
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                            </table>
                        </div>
                    </div>



                    {/* Deleted Employees Data */}
                    <div class="tab-pane" id="DeletedEmployees">
                        <div className="table table-responsive table-style-4 m-0">
                            <table className="table table-vcenter table-nowrap attendance-table tbl-collps attendance-tbl">
                                <thead className="tr-sticky">
                                    <tr>
                                        <th className='hr-sticky-left-1'>Sr. No</th>
                                        <th className='hr-sticky-left-2'>Name</th>

                                        {/* Generate table headers with day labels */}
                                        {selectedMonthDays.map(day => {
                                            const fullDate = new Date(`${day}-${month}-${year}`); // Assuming month is 1-based (January is 1)
                                            const isSunday = fullDate.getDay() === 0;
                                            return (
                                                <th className='th-day' key={day}>
                                                    <div className='d-flex align-items-center justify-content-between'>
                                                        <div>
                                                            {getDayLabel(day)}
                                                        </div>
                                                        <div className='view-attendance-th-icon'>
                                                            <FaRegCalendarPlus
                                                                onClick={() => !isSunday && date(fullDate, deletedEmployees)} // Disable onClick for Sundays
                                                                style={{ color: isSunday ? 'gray' : 'inherit', cursor: isSunday ? 'not-allowed' : 'pointer' }} // Style adjustment for Sundays
                                                            />
                                                        </div>
                                                    </div>
                                                </th>
                                            );
                                        })}

                                        <th className='hr-sticky-action3'>
                                            <div className='p-present'>
                                                P
                                            </div>
                                        </th>
                                        <th className='hr-sticky-action2'>
                                            <div className='l-leave'>
                                                L
                                            </div>
                                        </th>
                                        <th className='hr-sticky-action1'>
                                            <div className='H-Halfday'>
                                                H
                                            </div>
                                        </th>
                                    </tr>
                                </thead>

                                {isLoading ? (
                                    <tbody>
                                        <div className="LoaderTDSatyle w-100">
                                            <ClipLoader
                                                color="lightgrey"
                                                loading={true}
                                                size={30}
                                                aria-label="Loading Spinner"
                                                data-testid="loader"
                                            />
                                        </div>
                                    </tbody>
                                ) : deletedEmployees.length !== 0 ? (
                                    <tbody>
                                        {deletedEmployees.map((emp, index) => {
                                            const profilePhotoUrl = emp.profilePhoto?.length !== 0
                                                ? `${secretKey}/employee/fetchProfilePhoto/${emp._id}/${emp.profilePhoto?.[0]?.filename}`
                                                : emp.gender === "Male" ? MaleEmployee : FemaleEmployee;

                                            let presentCount = 0;
                                            let leaveCount = 0;
                                            let halfDayCount = 0;
                                            const joiningDate = new Date(emp.jdate);

                                            return (
                                                <tr key={index}>
                                                    <td className='hr-sticky-left-1'>{index + 1}</td>
                                                    <td className='hr-sticky-left-2'>
                                                        <div className="d-flex align-items-center">
                                                            <div className="tbl-pro-img">
                                                                <img src={profilePhotoUrl} alt="Profile" className="profile-photo" />
                                                            </div>
                                                            <div className="d-flex align-items-center justify-content-center">
                                                                <div onClick={() => handleShowParticularEmployeeAttendance(emp._id, emp.ename)} className="cursor-pointer">
                                                                    {emp.ename}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {selectedMonthDays.map(day => {
                                                        const empAttendance = attendanceData[emp._id] || {};
                                                        const formattedDate = `${year}-${monthNumber < 10 ? '0' + monthNumber : monthNumber}-${day < 10 ? '0' + day : day}`;
                                                        const { attendanceDate = formattedDate } = empAttendance;

                                                        const currentYear = year; // Use the prop year instead of the current year
                                                        const currentMonth = month; // Use the prop month instead of the current month
                                                        const currentDay = new Date().getDate();
                                                        const myDate = new Date(attendanceDate).getDate();

                                                        const currentDate = new Date(); // Today's date
                                                        const selectedDate = new Date(`${currentYear}-${monthNumber < 10 ? '0' + monthNumber : monthNumber}-${day < 10 ? '0' + day : day}`);

                                                        const attendanceDetails = empAttendance[currentYear]?.[currentMonth]?.[myDate] || {
                                                            inTime: "",
                                                            outTime: "",
                                                            workingHours: "",
                                                            status: ""
                                                        };

                                                        if (attendanceDetails.status === "Present") presentCount++;
                                                        if (attendanceDetails.status === "Leave") leaveCount++;
                                                        if (attendanceDetails.status === "Half Day") halfDayCount++;

                                                        // console.log("Emp attendance details :", attendanceDetails);

                                                        const status = attendanceData[emp._id]?.status || attendanceDetails.status || "";
                                                        const intime = attendanceData[emp._id]?.inTime || attendanceDetails.inTime || "";
                                                        const outtime = attendanceData[emp._id]?.outTime || attendanceDetails.outTime || "";

                                                        return (
                                                            <td key={day}>
                                                                <div
                                                                    onClick={() => {
                                                                        setIsDeleted(true);
                                                                        handleDayClick(day, emp._id, emp.empFullName, emp.employeeId, emp.newDesignation, emp.department, emp.branchOffice, intime, outtime);
                                                                    }}
                                                                    className={`
                                                                    ${status === "Present" ? "p-present" : ""}
                                                                    ${status === "Half Day" ? "H-Halfday" : ""}
                                                                    ${status === "Leave" ? "l-leave" : ""}
                                                                    `.trim()}>
                                                                    {status === "Present" ? "P" :
                                                                        status === "Half Day" ? "H" :
                                                                            status === "Leave" ? "L" : ""}
                                                                </div>

                                                                {!status && <div>
                                                                    {selectedDate < joiningDate ? (
                                                                        <div className='before-joining-icon'><FcCancel /></div>
                                                                    ) : selectedDate.getDay() === 0 ? ( // Check if the day is Sunday (0 = Sunday)
                                                                        attendanceData[emp._id]?.[year]?.[month]?.[day - 1]?.status === "Leave" ||
                                                                            attendanceData[emp._id]?.[year]?.[month]?.[day + 1]?.status === "Leave" ? (
                                                                            <>
                                                                                <div className="l-leave">L</div>    {/* Fill Sunday with "L" if adjacent days have "Leave" */}
                                                                                <div className="d-none">{leaveCount++}</div> {/* Increment leaveCount for Sunday if adjacent days have Leave */}
                                                                            </>
                                                                        ) : (
                                                                            <div className="s-sunday">S</div> // Otherwise, fill with "S"
                                                                        )
                                                                    ) : (
                                                                        <button
                                                                            className='p-disabled'
                                                                            // onClick={() => handleDayClick(day, emp._id, emp.empFullName, emp.employeeId, emp.newDesignation, emp.department, emp.branchOffice)}
                                                                            disabled // Disable button for future dates
                                                                        >
                                                                            {day <= daysInMonth && <FaPlus />}
                                                                        </button>
                                                                    )}
                                                                </div>}
                                                            </td>
                                                        );
                                                    })}

                                                    <td className='hr-sticky-action3'>
                                                        {presentCount}
                                                    </td>
                                                    <td className='hr-sticky-action2'>
                                                        {leaveCount}
                                                    </td>
                                                    <td className='hr-sticky-action1'>
                                                        {halfDayCount}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                ) : (
                                    <tbody>
                                        <tr>
                                            <td colSpan="36" style={{ textAlign: "center" }}>
                                                <Nodata />
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            {/* Pop-up to be opened after click on plus button */}
            <Dialog className='My_Mat_Dialog' open={showPopup} fullWidth maxWidth="md">
                <DialogTitle>
                    {(originalInTime && originalOutTime || isDeleted) ? "Update attendance" : "Add attendance"}
                    <IconButton style={{ float: "right" }} onClick={() => {
                        handleClosePopup();
                        setInTime("");
                        setOutTime("");
                    }}>
                        <CloseIcon color="primary"></CloseIcon>
                    </IconButton>{" "}
                </DialogTitle>
                <DialogContent>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="mb-3">
                                    <div className='row'>
                                        <div className="col-lg-3">
                                            <div className='attendance-date-tbl'>
                                                <label className="form-label">Employee Name</label>
                                                <input
                                                    type="text"
                                                    name="empName"
                                                    className="form-control date-f mt-1"
                                                    placeholder="Employee name"
                                                    value={empName}
                                                    disabled
                                                // onChange={(e) => handleInputChange("firstName", e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-2">
                                            <div className='attendance-date-tbl'>
                                                <label className="form-label">Attendance Date</label>
                                                <input
                                                    type="date"
                                                    name="attendanceDate"
                                                    className="form-control date-f mt-1"
                                                    value={attendanceDate}
                                                    // onChange={(e) => setAttendanceDate(e.target.value)}
                                                    readOnly
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-2">
                                            <div className='attendance-date-tbl'>
                                                <label className="form-label">In Time</label>
                                                {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DemoContainer components={['TimePicker']}>
                                                        <TimePicker
                                                            // label="In Time"
                                                            value={dayjs(inTime)}
                                                            onChange={(newValue) => setInTime(newValue ? newValue.format('HH:mm') : '')}
                                                        />
                                                    </DemoContainer>
                                                </LocalizationProvider> */}
                                                <input
                                                    type="time"
                                                    name="inTime"
                                                    className="form-control in-time w-100"
                                                    value={inTime}
                                                    onChange={(e) => {
                                                        setInTime(e.target.value);
                                                        if (e.target.value) setInTimeError(""); // Clear error when valid
                                                    }}
                                                    disabled={isDeleted || isOnLeave}
                                                />
                                            </div>
                                            {inTimeError && <p className="text-danger">{inTimeError}</p>}
                                        </div>

                                        <div className="col-lg-2">
                                            <div className='attendance-date-tbl'>
                                                <label className="form-label">Out Time</label>
                                                {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DemoContainer components={['TimePicker']}>
                                                        <TimePicker
                                                            // label="Out Time"
                                                            value={dayjs(outTime)}
                                                            onChange={(newValue) => setOutTime(newValue ? newValue.format('HH:mm') : '')}
                                                        />
                                                    </DemoContainer>
                                                </LocalizationProvider> */}
                                                <input
                                                    type="time"
                                                    name="outTime"
                                                    className="form-control out-time w-100"
                                                    value={outTime}
                                                    onChange={(e) => {
                                                        setOutTime(e.target.value);
                                                        if (e.target.value) setOutTimeError(""); // Clear error when valid
                                                    }}
                                                    disabled={isDeleted || isOnLeave}
                                                />
                                            </div>
                                            {outTimeError && <p className="text-danger">{outTimeError}</p>}
                                        </div>
                                        <div className="col-lg-1">
                                            <label className="form-label mt-5 text-center">OR</label>
                                        </div>
                                        <div className="col-lg-2">
                                            <div className='attendance-date-tbl'>
                                                <label className="form-label">On Leave</label>
                                                <div className='leavecheck'>
                                                    <input type="checkbox" name="rGroup" value="1" id="r1"
                                                        checked={isOnLeave}
                                                        onChange={handleCheckboxChange}
                                                        disabled={disableOnLeave}
                                                    />
                                                    <label class="checkbox-alias" for="r1">
                                                        <div className='d-flex align-items-center justify-content-center'>
                                                            <div className='leavecheckicon mr-1'><GiCheckMark /></div>
                                                            <div>On Leave</div>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
                {!isDeleted &&
                    (
                        <div className='d-flex align-items-center'>

                            <Button className="btn btn-success bdr-radius-none w-50" variant="contained"
                                onClick={() => handleSubmit(id, employeeId, empName, designation, department, branchOffice, attendanceDate, dayName, inTime, outTime)}>
                                Submit
                            </Button>

                            <Button className="btn btn-danger bdr-radius-none w-50" variant="contained"
                                onClick={() => handleClear(id, employeeId, empName, designation, department, branchOffice, attendanceDate, inTime, outTime)}>
                                Clear
                            </Button>


                        </div>
                    )
                }
            </Dialog>

            {showAttendanceForParticularEmployee && <ShowAttendanceForParticularEmployee year={year} month={month} id={id} name={empName} open={handleShowParticularEmployeeAttendance} close={handleCloseParticularEmployeeAttendance} />}
        </>
    )
}

export default ViewAttendance;