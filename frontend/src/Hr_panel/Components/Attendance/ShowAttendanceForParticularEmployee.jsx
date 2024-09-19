import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Nodata from '../../../components/Nodata';
import { GiCheckMark } from "react-icons/gi";
import Swal from 'sweetalert2';
import ClipLoader from 'react-spinners/ClipLoader';

function ShowAttendanceForParticularEmployee({ year, month, id, name, open, close }) {

    // console.log("Id is :", id);
    // console.log("Name is :", name);
    // console.log("Year is ", year);
    // console.log("Month is ", month);

    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const officialHolidays = [
        '2024-01-14', '2024-01-15', '2024-03-24', '2024-03-25',
        '2024-07-07', '2024-08-19', '2024-10-12',
        '2024-10-31', '2024-11-01', '2024-11-02', '2024-11-03', '2024-11-04', '2024-11-05'
    ]

    const convertToDateInputFormat = (selectedDate) => {
        if (!selectedDate) return '';
        const date = new Date(selectedDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [isLoading, setIsLoading] = useState(false);
    const [empId, setEmpId] = useState("");
    const [empName, setEmpName] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [designation, setDesignation] = useState("");
    const [department, setDepartment] = useState("");
    const [branchOffice, setBranchOffice] = useState("");

    const [employee, setEmployee] = useState([]);
    const [deletedEmployees, setDeletedEmployees] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [inputValues, setInputValues] = useState({});

    const handleInputChange = (id, field, value) => {
        setInputValues(prevValues => ({
            ...prevValues,
            [id]: {
                ...prevValues[id],
                [field]: value
            }
        }));
    };

    const fetchEmployees = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${secretKey}/employee/einfo`);
            setEmployee(res.data);
            res.data.map((emp) => {
                if (emp._id === id) {
                    setEmpId(emp._id);
                    setEmpName(emp.empFullName);
                    setEmployeeId(emp.employeeId);
                    setDesignation(emp.newDesignation);
                    setDepartment(emp.department);
                    setBranchOffice(emp.branchOffice);
                }
            });
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
            res.data.map((emp) => {
                if (emp._id === id) {
                    setEmpId(emp._id);
                    setEmpName(emp.empFullName);
                    setEmployeeId(emp.employeeId);
                    setDesignation(emp.newDesignation);
                    setDepartment(emp.department);
                    setBranchOffice(emp.branchOffice);
                }
            });
        } catch (error) {
            console.log("Error fetching employees data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (id, empId, name, designation, department, branch, date, inTime, outTime) => {
        console.log("Date is :", date)
        const selectedDate = new Date(date);
        const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
        // const formattedDate = date.toISOString().split('T')[0];
        console.log("Day is :", dayName)
        let workingHours, status;

        const convertToMinutes = (timeString) => {
            const [hours, minutes] = timeString.split(':').map(Number);
            return hours * 60 + minutes;
        };

        const inTimeMinutes = convertToMinutes(inTime);
        const outTimeMinutes = convertToMinutes(outTime);
        const comparisonTimeEarly = convertToMinutes("10:01"); // 10:00 AM
        const comparisonTimeLate = convertToMinutes("13:00"); // 1:00 PM

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
            // console.log("inTimeMinutes", inTimeMinutes)
            // console.log("outTimeMinutes", outTimeMinutes)

            const startBoundary = convertToMinutes("10:00"); // 10:00 AM
            const endBoundary = convertToMinutes("18:00"); // 6:00 PM
            const breakStart = convertToMinutes("13:00"); // 1:00 PM
            const breakEnd = convertToMinutes("13:45"); // 1:45 PM

            let actualInTime = Math.max(inTimeMinutes, startBoundary); // If inTime is earlier than 10 AM, consider it as 10:00
            let actualOutTime = Math.min(outTimeMinutes, endBoundary); // If outTime is later than 6 PM, consider it as 6:00 PM
            // console.log("actualInTime", actualInTime)
            // console.log("actualOutTime", actualOutTime)
            let workingMinutes = actualOutTime - actualInTime; // Subtract 45 minutes for the break
            // Subtract break time if inTime or outTime overlap with the break period
            if (actualInTime < breakEnd && actualOutTime > breakStart) {
                // If inTime is before the break end and outTime is after break start, subtract the overlap
                const overlapStart = Math.max(actualInTime, breakStart);
                const overlapEnd = Math.min(actualOutTime, breakEnd);
                const breakOverlap = overlapEnd - overlapStart;

                // Ensure breakOverlap is only subtracted if it's positive
                if (breakOverlap > 0) {
                    workingMinutes -= breakOverlap;
                }
            }
            // Ensure working minutes don't go negative
            if (workingMinutes < 0) {
                workingMinutes = 0;
            }

            return workingMinutes;
        };  

        const workingMinutes = calculateWorkingHours(inTime, outTime);
        // Define the boundaries for the new "LC" condition
        const lateArrivalStart = convertToMinutes("10:01"); // 10:01 AM
        const lateArrivalEnd = convertToMinutes("11:00");   // 11:00 AM
        const endTimeBoundary = convertToMinutes("18:00");  // 6:00 PM
        // Convert minutes back to HH:MM format for display
        const hours = Math.floor(workingMinutes / 60);
        const minutes = workingMinutes % 60;
        workingHours = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

        // console.log("intimeminutes", inTimeMinutes)
        // console.log("workingminutes", workingMinutes)
        if (
            (inTimeMinutes >= lateArrivalStart && inTimeMinutes <= lateArrivalEnd && outTimeMinutes >= endTimeBoundary) || // New LC condition
            ((inTimeMinutes >= comparisonTimeEarly && inTimeMinutes <= comparisonTimeLate) && workingMinutes >= 420)) {
            status = "LC";
        } else if (workingMinutes >= 420) { // 7 hours in minutes
            status = "Present";
        } else if (workingMinutes >= 210 && workingMinutes < 420) { // 7 hours
            status = "Half Day";
        } else {
            status = "Leave";
        }

        const payload = {
            id: id,
            employeeId: empId,
            ename: name,
            designation: designation,
            department: department,
            branchOffice: branch,
            attendanceDate: date,
            dayName: dayName,
            inTime: inTime,
            outTime: outTime,
            workingHours: workingHours,
            status: status
        };
        try {
            const res = await axios.post(`${secretKey}/attendance/addAttendance`, payload);
            console.log("Created attendance record is :", res.data);
            Swal.fire("success", "Attendance Successfully Added/Updated", "success");
        } catch (error) {
            console.log("Error adding attendance record", error);
            Swal.fire("error", "Error adding/updating attendance", "error");
        }
        fetchAttendance();
        console.log("Data to be send :", payload);
    };

    const calculateWorkingHours = (inTime, outTime) => {
        if (!inTime || !outTime) return "00:00"; // Ensure both times are available

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

        // Define boundaries for 10:00 AM and 6:00 PM
        const startBoundary = convertToMinutes("10:00");
        const endBoundary = convertToMinutes("18:00");
        const breakStart = convertToMinutes("13:00"); // 1:00 PM
        const breakEnd = convertToMinutes("13:45"); // 1:45 PM

        // Adjust inTime and outTime to fit within 10:00 AM to 6:00 PM
        const actualInTime = Math.max(inTimeMinutes, startBoundary); // If inTime is earlier than 10:00 AM, set it to 10:00 AM
        const actualOutTime = Math.min(outTimeMinutes, endBoundary); // If outTime is later than 6:00 PM, set it to 6:00 PM
        // console.log("inTimeMinutes", inTimeMinutes)
        // console.log("outTimeMinutes", outTimeMinutes)
        // console.log("actualInTime", actualInTime)
        // console.log("actualOutTime", actualOutTime)
        // Calculate working minutes and subtract 45 minutes for break
        let workingMinutes = actualOutTime - actualInTime;
        if (actualInTime < breakEnd && actualOutTime > breakStart) {
            // If inTime is before the break end and outTime is after break start, subtract the overlap
            const overlapStart = Math.max(actualInTime, breakStart);
            const overlapEnd = Math.min(actualOutTime, breakEnd);
            const breakOverlap = overlapEnd - overlapStart;

            // Ensure breakOverlap is only subtracted if it's positive
            if (breakOverlap > 0) {
                workingMinutes -= breakOverlap;
            }
        }
        //console.log("workingminutes", workingMinutes)
        // Ensure workingMinutes are not negative
        if (workingMinutes < 0) {
            workingMinutes = 0;
        }

        // Convert working minutes back to HH:MM format
        return formatToHHMM(workingMinutes);
    };
    // Function to format date for checking official holidays
    const formatDateForHolidayCheck = (year, month, day) => {
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    };
    const getCurrentMonthName = () => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const currentMonthIndex = new Date().getMonth();
        return months[currentMonthIndex];
    };

    // const fetchAttendance = async () => {
    //     setIsLoading(true);
    //     try {
    //         const res = await axios.get(`${secretKey}/attendance/viewAllAttendance`);
    //         const allAttendanceData = res.data.data;

    //         const totalDays = new Date(year, new Date(Date.parse(`${month} 1, ${year}`)).getMonth() + 1, 0).getDate();
    //         const today = new Date().getDate(); // Current date of the month
    //         const currentMonth = getCurrentMonthName();
    //         const isCurrentMonth = month === currentMonth;
    //         let name = "";
    //         let designation = "";

    //         const filteredData = [];
    //         const filledDates = new Set(); // To track dates with existing data

    //         // Collect all filled dates
    //         allAttendanceData.forEach(employee => {
    //             if (employee._id === id) {  // Check for the specific employee ID
    //                 employee.years.forEach(yearData => {
    //                     if (yearData.year === year) {  // Check for the specific year
    //                         yearData.months.forEach(monthData => {
    //                             if (monthData.month === month) {  // Check for the specific month
    //                                 monthData.days.forEach(dayData => {
    //                                     const { date: dayDate, inTime, outTime, workingHours, status } = dayData;

    //                                     filledDates.add(dayDate); // Add filled date to the set

    //                                     // Add data for the current month up to today or all data for past months
    //                                     if (isCurrentMonth && dayDate <= today || !isCurrentMonth) {

    //                                         name = employee.employeeName;
    //                                         designation = employee.designation;

    //                                         filteredData.push({
    //                                             _id: employee._id,
    //                                             employeeId: employee.employeeId,
    //                                             employeeName: employee.employeeName,
    //                                             designation: employee.designation,
    //                                             department: employee.department,
    //                                             branchOffice: employee.branchOffice,
    //                                             date: dayDate,
    //                                             inTime,
    //                                             outTime,
    //                                             workingHours,
    //                                             status
    //                                         });
    //                                     }
    //                                 });
    //                             }
    //                         });
    //                     }
    //                 });
    //             }
    //         });

    //         // Include dates with no data in current month
    //         if (isCurrentMonth) {
    //             for (let date = 1; date <= today; date++) {
    //                 if (!filledDates.has(date)) {
    //                     filteredData.push({
    //                         employeeName: name, // Example placeholder for missing data
    //                         designation: designation,
    //                         // department: '',
    //                         // branchOffice: '',
    //                         date: date,
    //                         inTime: '',
    //                         outTime: '',
    //                         workingHours: '',
    //                         status: ''
    //                     });
    //                 }
    //             }
    //         } else {
    //             // For past months, include all days from 1 to totalDays
    //             for (let date = 1; date <= totalDays; date++) {
    //                 if (!filledDates.has(date)) {
    //                     filteredData.push({
    //                         employeeName: name, // Example placeholder for missing data
    //                         designation: designation,
    //                         // department: '',
    //                         // branchOffice: '',
    //                         date: date,
    //                         inTime: '',
    //                         outTime: '',
    //                         workingHours: '',
    //                         status: ''
    //                     });
    //                 }
    //             }
    //         }

    //         filteredData.sort((a, b) => new Date(`${year}-${month}-${a.date}`) - new Date(`${year}-${month}-${b.date}`));
    //         setAttendanceData(filteredData);
    //     } catch (error) {
    //         console.log("Error fetching attendance record", error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const fetchAttendance = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${secretKey}/attendance/viewAllAttendance`);
            const allAttendanceData = res.data.data;

            const totalDays = new Date(year, new Date(Date.parse(`${month} 1, ${year}`)).getMonth() + 1, 0).getDate();
            const today = new Date().getDate(); // Current date of the month
            const currentMonth = getCurrentMonthName();
            const isCurrentMonth = month === currentMonth;
            let name = "";
            let designation = "";

            const filteredData = [];
            const filledDates = new Set(); // To track dates with existing data
            // Collect all filled dates
            allAttendanceData.forEach(employee => {
                if (employee._id === id) {  // Check for the specific employee ID
                    employee.years.forEach(yearData => {
                        if (yearData.year === year) {  // Check for the specific year
                            yearData.months.forEach(monthData => {
                                if (monthData.month === month) {  // Check for the specific month
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
                    const monthNumber = monthNamesToNumbers[month];
                    const formattedDate = `${year}-${monthNumber < 10 ? '0' + monthNumber : monthNumber}-${date < 10 ? '0' + date : date}`;
                    const isSunday = new Date(`${year}-${month}-${date}`).getDay() === 0;
                    const isHoliday = officialHolidays.includes(formattedDate);

                    let status = ''; // Default status for empty days

                    if (isSunday) {
                        const prevWorkingDate = findPrevWorkingDay(year, monthNumber, date - 1);
                        const nextWorkingDate = findNextWorkingDay(year, monthNumber, date + 1);

                        // Fetch attendance status for the previous and next working day
                        const prevDayStatus = allAttendanceData.find(emp => emp._id === id)?.years
                            ?.find(yr => yr.year === prevWorkingDate.year)?.months
                            ?.find(mn => mn.month === getMonthName(prevWorkingDate.month))?.days
                            ?.find(d => d.date === prevWorkingDate.day)?.status;

                        const nextDayStatus = allAttendanceData.find(emp => emp._id === id)?.years
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
                        const prevWorkingDate = findPrevWorkingDay(year, monthNumber, date - 1);
                        const nextWorkingDate = findNextWorkingDay(year, monthNumber, date + 1);

                        // Fetch attendance status for the previous and next working day
                        const prevDayStatus = allAttendanceData.find(emp => emp._id === id)?.years
                            ?.find(yr => yr.year === prevWorkingDate.year)?.months
                            ?.find(mn => mn.month === getMonthName(prevWorkingDate.month))?.days
                            ?.find(d => d.date === prevWorkingDate.day)?.status;

                        const nextDayStatus = allAttendanceData.find(emp => emp._id === id)?.years
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

                    filteredData.push({
                        employeeName: name,
                        designation: designation,
                        date: date,
                        inTime: '',
                        outTime: '',
                        workingHours: '',
                        status: status
                    });
                }
            }

            filteredData.sort((a, b) => new Date(`${year}-${month}-${a.date}`) - new Date(`${year}-${month}-${b.date}`));
            setAttendanceData(filteredData);
        } catch (error) {
            console.log("Error fetching attendance record", error);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchEmployees();
        fetchDeletedEmployees();
        fetchAttendance();
    }, [year, month, id]);

    const isDeleted = deletedEmployees.some(deletedEmp => deletedEmp._id === id);

    return (
        <div>
            <Dialog className='My_Mat_Dialog' fullWidth maxWidth="lg" open={() => open()}>
                <DialogTitle style={{ textAlign: "center" }}>
                    {`Attendance Details for ${name} for ${month} ${year}`}
                    <IconButton style={{ float: "right" }} onClick={() => {
                        close();
                    }}>
                        <CloseIcon color="primary"></CloseIcon>
                    </IconButton>{" "}
                </DialogTitle>

                <DialogContent>
                    <div className="table table-responsive table-style-2 m-0">
                        <table className="table table-vcenter table-nowrap">
                            <thead>

                                <tr className="tr-sticky">
                                    <th>Sr. No</th>
                                    <th>Employee Name</th>
                                    <th>Designation</th>
                                    <th>Date</th>
                                    <th>In Time</th>
                                    <th>Out Time</th>
                                    <th>Working Hours</th>
                                    <th>Status</th>
                                    {!isDeleted && <th>Action</th>}
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
                            ) : attendanceData.length !== 0 ? (
                                <tbody>
                                    {attendanceData.map((emp, index) => {
                                        const convertToMinutes = (timeString) => {
                                            const [hours, minutes] = timeString.split(':').map(Number);
                                            return hours * 60 + minutes;
                                        };
                                        //iconsole.log("attendanceData", attendanceData)
                                        const inTime = inputValues[emp.date]?.inTime || emp.inTime || "";
                                        const outTime = inputValues[emp.date]?.outTime || emp.outTime || "";
                                        const inTimeMinutes = convertToMinutes(inTime);
                                        const outTimeMinutes = convertToMinutes(outTime);
                                        //console.log("inTimeMinutes", inTimeMinutes)
                                        //console.log("outTimeMinutes", outTimeMinutes)

                                        const startBoundary = convertToMinutes("10:00"); // 10:00 AM
                                        const endBoundary = convertToMinutes("18:00"); // 6:00 PM
                                        let actualInTime = Math.max(inTimeMinutes, startBoundary); // If inTime is earlier than 10 AM, consider it as 10:00
                                        let actualOutTime = Math.min(outTimeMinutes, endBoundary); // If outTime is later than 6 PM, consider it as 6:00 PM
                                        //console.log("actualInTime", actualInTime)
                                        //console.log("actualOutTime", actualOutTime)

                                        // Calculate working hours only if both inTime and outTime are available
                                        const workingHours = calculateWorkingHours(inputValues[emp.date]?.inTime || emp.inTime, inputValues[emp.date]?.outTime || emp.outTime);
                                        const comparisonTimeEarly = convertToMinutes("10:01"); // 10:00 AM
                                        const comparisonTimeLate = convertToMinutes("13:00"); // 1:00 PM
                                        // Initialize status from the attendance data (emp.status)
                                        let status = emp.status || "No Data";
                                        const workingMinutes = (inputValues[emp.date]?.inTime || emp.inTime && inputValues[emp.date]?.outTime || emp.outTime) ? workingHours.split(':').reduce((acc, time) => (60 * acc) + +time) : 0;
                                        //console.log("workingminutes", workingMinutes)
                                        // if (inTimeMinutes >= comparisonTimeEarly & inTimeMinutes <= comparisonTimeLate) {
                                        //     status = "LC";
                                        // } else if (workingMinutes >= 420) { // 7 hours in minutes
                                        //     status = "Present";
                                        // } else if (workingMinutes >= 210 && workingMinutes < 420) { // 7 hours
                                        //     status = "Half Day";
                                        // } else {
                                        //     status = "Leave";
                                        // }
                                        // Function to check if a date is a Sunday
                                        const isSunday = (year, month, day) => {
                                            const date = new Date(year, month - 1, day);
                                            return date.getDay() === 0;
                                        };


                                        // Get the month number from the month name
                                        const monthNumber = new Date(Date.parse(`${month} 1, ${year}`)).getMonth() + 1;
                                        const formattedDate = new Date(year, monthNumber - 1, emp.date);
                                        const isDateSunday = isSunday(year, monthNumber, emp.date);
                                        const formattedDateHoliday = formatDateForHolidayCheck(year, monthNumber, emp.date)
                                        console.log("formatteddateholiday", formattedDateHoliday)
                                        const isOfficialHoliday = officialHolidays.includes(formattedDateHoliday)

                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="">
                                                            {(() => {
                                                                const names = (empName || "").trim().split(/\s+/);
                                                                if (names.length === 1) {
                                                                    return names[0];
                                                                }
                                                                return `${names[0] || ""} ${names[names.length - 1] || ""}`;
                                                            })()}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{designation === "Business Development Executive" && "BDE" ||
                                                    designation === "Business Development Manager" && "BDM" ||
                                                    designation}</td>
                                                <td>
                                                    <div className='attendance-date-tbl'>
                                                        <input
                                                            type="date"
                                                            className="form-control date-f"
                                                            value={convertToDateInputFormat(
                                                                new Date(year, new Date(Date.parse(`${month} 1, ${year}`)).getMonth(), emp.date)
                                                            )}
                                                            readOnly
                                                        />
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className='attendance-date-tbl'>
                                                        <input
                                                            type="time"
                                                            className={`form-control in-time ${isDateSunday || isDeleted || isOfficialHoliday ? 'disabled-field' : ''}`}
                                                            value={inTime}
                                                            onChange={(e) => handleInputChange(emp.date, 'inTime', e.target.value)}
                                                            disabled={isDateSunday || isDeleted || isOfficialHoliday}
                                                        />
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className='attendance-date-tbl'>
                                                        <input
                                                            type="time"
                                                            className={`form-control out-time ${isDateSunday || isDeleted || isOfficialHoliday ? 'disabled-field' : ''}`}
                                                            value={outTime}
                                                            onChange={(e) => handleInputChange(emp.date, 'outTime', e.target.value)}
                                                            disabled={isDateSunday || isDeleted || isOfficialHoliday}

                                                        />
                                                    </div>
                                                </td>
                                                <td>
                                                    {workingHours}
                                                </td>
                                                <td>
                                                    <span className={`badge ${(status) === "Present" ? "badge-completed" :
                                                        (status) === "Leave" ? "badge-leave" :
                                                            (status) === "Half Day" ? "badge-half-day" : 
                                                            (status) === "Sunday Leave"  || 
                                                            (status) === "Sunday Half Day" || 
                                                            (status) === "Sunday" ||
                                                            (status) === "Official Holiday Leave" ||
                                                            (status) === "Official Holiday Half Day" ||
                                                            (status) === "Official Holiday" ? "badge-Holiday" :
                                                            (status.startsWith("LC") || status.startsWith("LC")) ? "badge-LC" :"badge-Nodata"
                                                        }`}>
                                                        {status}
                                                    </span>
                                                </td>
                                                {!isDeleted && <td>
                                                    <button type="submit" className="action-btn action-btn-primary" onClick={() =>
                                                        handleSubmit(empId, employeeId, empName, designation, department, branchOffice,
                                                            convertToDateInputFormat(new Date(`${year}-${month}-${emp.date}`)),
                                                            inputValues[emp.date]?.inTime || emp.inTime,
                                                            inputValues[emp.date]?.outTime || emp.outTime,
                                                            //calculateWorkingHours(inputValues[emp.date]?.inTime || emp.inTime, inputValues[emp.date]?.outTime || emp.outTime)
                                                        )}
                                                    >
                                                        <GiCheckMark />
                                                    </button>
                                                </td>}
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            ) : (
                                <tbody>
                                    <tr>
                                        <td colSpan="12" style={{ textAlign: "center" }}>
                                            <Nodata />
                                        </td>
                                    </tr>
                                </tbody>
                            )}
                        </table>
                    </div>
                </DialogContent>

            </Dialog>
        </div>
    )
}

export default ShowAttendanceForParticularEmployee