import React, { useState, useEffect } from 'react'
import axios from 'axios';
import MaleEmployee from "../../../static/EmployeeImg/office-man.png";
import FemaleEmployee from "../../../static/EmployeeImg/woman.png";
import { GiCheckMark } from "react-icons/gi";
import ClipLoader from 'react-spinners/ClipLoader';
import Nodata from '../../../components/Nodata';
import Swal from 'sweetalert2';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

function AddAttendance({ year, month, date, employeeData }) {

    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const AntSwitch = styled(Switch)(({ theme }) => ({
        width: 28,
        height: 16,
        padding: 0,
        display: 'flex',
        '&:active': {
            '& .MuiSwitch-thumb': {
                width: 15,
            },
            '& .MuiSwitch-switchBase.Mui-checked': {
                transform: 'translateX(9px)',
            },
        },
        '& .MuiSwitch-switchBase': {
            padding: 2,
            '&.Mui-checked': {
                transform: 'translateX(12px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                    opacity: 1,
                    backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
                },
            },
        },
        '& .MuiSwitch-thumb': {
            boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
            width: 12,
            height: 12,
            borderRadius: 6,
            transition: theme.transitions.create(['width'], {
                duration: 200,
            }),
        },
        '& .MuiSwitch-track': {
            borderRadius: 16 / 2,
            opacity: 1,
            backgroundColor:
                theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
            boxSizing: 'border-box',
        },
    }));

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
    // console.log("Current date is :", date);

    const convertToDateInputFormat = (selectedDate) => {
        if (!selectedDate) return '';
        const date = new Date(selectedDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    // Convert month name to month number
    const monthNumber = monthNamesToNumbers[month];

    // Get the current date for the provided year and month
    const currentDate = new Date(year, monthNumber - 1, new Date().getDate() + 1);
    const formattedDate = currentDate.toISOString().split('T')[0]; // Format to YYYY-MM-DD

    const [isLoading, setIsLoading] = useState(false);
    const [employee, setEmployee] = useState([]);

    const [id, setId] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [empName, setEmpName] = useState("");
    const [branchOffice, setBranchOffice] = useState("");
    const [designation, setDesignation] = useState("");
    const [department, setDepartment] = useState("");
    const [attendanceDate, setAttendanceDate] = useState(formattedDate);
    const [dayName, setDayName] = useState("");
    const [inTimeNow, setInTimeNow] = useState(null);
    const [outTime, setOutTime] = useState("");
    const [workingHours, setWorkingHours] = useState("");
    const [isOnLeave, setIsOnLeave] = useState(false);
    const [status, setStatus] = useState("");

    const [attendanceData, setAttendanceData] = useState({});

    const fetchEmployees = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${secretKey}/employee/einfo`);
            setEmployee(res.data);
            fetchAttendance();
        } catch (error) {
            console.log("Error fetching employees", error);
        } finally {
            setIsLoading(false);
        }
    };

    // const handleInputChange = (empId, field, value) => {
    //     setAttendanceData(prevState => ({
    //         ...prevState,
    //         [empId]: {
    //             ...prevState[empId],
    //             [field]: value,
    //         }
    //     }));
    // };

    // const handleCheckboxChange = (empId, isChecked) => {
    //     setIsOnLeave(isChecked);
    //     if (isChecked) {
    //         console.log("Inside if condition");
    //         // When "On Leave" is checked, set values to "00:00" and "Leave"
    //         setAttendanceData(prevState => ({
    //             ...prevState,
    //             [empId]: {
    //                 ...prevState[empId],
    //                 inTime: "00:00",
    //                 outTime: "00:00",
    //                 workingHours: "00:00",
    //                 status: "Leave"
    //             }
    //         }));

    //     } else {
    //         console.log("Inside else condition");
    //         setIsOnLeave(isChecked);
    //         setAttendanceData(prevState => ({
    //             ...prevState,
    //             [empId]: {
    //                 ...prevState[empId],
    //                 inTime: "",
    //                 outTime: "",
    //                 workingHours: "",
    //                 status: ""
    //             }
    //         }));
    //     }
    // };


    const handleCheckboxChange = async (isChecked, id, empId, name, designation, department, branch, date, inTime, outTime, workingHours, status) => {
        setIsOnLeave(isChecked);

        // Define the new attendance data based on the checkbox state
        const updatedData = isChecked
            ? { inTime: "00:00", outTime: "00:00", workingHours: "00:00", status: "Leave" }
            : { inTime: "", outTime: "", workingHours: "", status: "" };

        // Update the local state
        setAttendanceData(prevState => ({
            ...prevState,
            [empId]: {
                ...prevState[empId],
                ...updatedData
            }
        }));

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

        console.log("Payload is :", payload);
        try {
            const res = await axios.post(`${secretKey}/attendance/addAttendance`, payload);
            Swal.fire("Success", "Attendance Successfully Added/Updated", "success");
        } catch (error) {
            console.log("Error updating attendance record", error);
            Swal.fire("Error", "Error adding/updating attendance", "error");
        }

        fetchAttendance(); // Refresh the attendance data after updating
    };


    const handleInputChange = (empId, field, value) => {
        // Parse the year and month from the date input if the field is attendanceDate
        let newYear = year;
        let newMonth = month;

        if (field === 'attendanceDate') {
            const dateParts = value.split('-');
            if (dateParts.length === 3) {
                newYear = dateParts[0];
                newMonth = new Date(value).toLocaleString('default', { month: 'long' });
            }
        }

        setAttendanceData(prevState => ({
            ...prevState,
            [empId]: {
                ...prevState[empId],
                [field]: value,
                ...(field === 'attendanceDate' && { currentYear: newYear, currentMonth: newMonth })
            }
        }));
    };

    const handleSubmit = async (id, empId, name, designation, department, branch, date, inTime, outTime, workingHours, status) => {

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
            inTime: inTime,
            outTime: outTime,
            workingHours: workingHours,
            status: status
        };
        try {
            const res = await axios.post(`${secretKey}/attendance/addAttendance`, payload);
            // console.log("Created attendance record is :", res.data);
            Swal.fire("success", "Attendance Successfully Added/Updated", "success");
        } catch (error) {
            console.log("Error adding attendance record", error);
            Swal.fire("error", "Error adding/updating attendance", "error");
        }
        fetchAttendance();
        console.log("Data to be send :", payload);
    };

    // const calculateWorkingHours = (inTime, outTime) => {
    //     if (!inTime || !outTime) return "00:00"; // Ensure both times are available

    //     const [inHours, inMinutes] = inTime.split(':').map(Number);
    //     const [outHours, outMinutes] = outTime.split(':').map(Number);

    //     const inTimeMinutes = inHours * 60 + inMinutes;
    //     const outTimeMinutes = outHours * 60 + outMinutes;

    //     let workingMinutes = outTimeMinutes - inTimeMinutes - 45; // Subtract 45 minutes by default

    //     if (workingMinutes < 0) {
    //         workingMinutes += 24 * 60; // Adjust for overnight shifts
    //     }

    //     // Convert minutes back to HH:MM format
    //     const hours = Math.floor(workingMinutes / 60);
    //     const minutes = workingMinutes % 60;
    //     return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

    // };

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

        // Adjust inTime and outTime to fit within 10:00 AM to 6:00 PM
        const actualInTime = Math.max(inTimeMinutes, startBoundary); // If inTime is earlier than 10:00 AM, set it to 10:00 AM
        const actualOutTime = Math.min(outTimeMinutes, endBoundary); // If outTime is later than 6:00 PM, set it to 6:00 PM
        console.log("inTimeMinutes", inTimeMinutes)
        console.log("outTimeMinutes", outTimeMinutes)
        console.log("actualInTime", actualInTime)
        console.log("actualOutTime", actualOutTime)
        // Calculate working minutes and subtract 45 minutes for break
        let workingMinutes = actualOutTime - actualInTime;
        console.log("workingminutes", workingMinutes)
        // Ensure workingMinutes are not negative
        if (workingMinutes < 0) {
            workingMinutes = 0;
        }

        // Convert working minutes back to HH:MM format
        return formatToHHMM(workingMinutes);
    };

    const fetchAttendance = async () => {
        try {
            const res = await axios.get(`${secretKey}/attendance/viewAllAttendance`);
            const attendanceData = res.data.data;

            const attendanceMap = {};
            attendanceData.forEach(employee => {
                const { _id, years } = employee;
                attendanceMap[_id] = {}; // Initialize object for each employee

                years.forEach(yearData => {
                    const { year, months } = yearData;

                    months.forEach(monthData => {
                        const { month, days } = monthData;

                        days.forEach(dayData => {
                            const { date, inTime, outTime, workingHours, status } = dayData;

                            if (!attendanceMap[_id][year]) {
                                attendanceMap[_id][year] = {};
                            }
                            if (!attendanceMap[_id][year][month]) {
                                attendanceMap[_id][year][month] = {};
                            }

                            attendanceMap[_id][year][month][date] = {
                                inTime,
                                outTime,
                                workingHours,
                                status
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

    useEffect(() => {
        fetchEmployees();
        fetchAttendance();
    }, []);

    useEffect(() => {
        const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
        setAttendanceData(prevState => {
            const updatedData = {};
            Object.keys(prevState).forEach(empId => {
                updatedData[empId] = {
                    ...prevState[empId],
                    attendanceDate: formattedDate,
                    dayName: dayName
                };
            });
            return updatedData;
        });
    }, [formattedDate]);

    const [isDeleted, setIsDeleted] = useState(false);

    useEffect(() => {
        let deletedFound = false;
        employeeData.forEach((emp) => {
            if (emp.deletedDate) {
                deletedFound = true;
            }
        });
        setIsDeleted(deletedFound);
    }, [employeeData]);

    return (
        <div>
            <div className="table table-responsive table-style-2 m-0">
                <table className="table table-vcenter table-nowrap">
                    <thead>
                        <tr className="tr-sticky">
                            <th>Sr. No</th>
                            <th>Employee Name</th>
                            <th>Designation</th>
                            <th>Department</th>
                            <th>Branch</th>
                            <th>Date</th>
                            <th>In Time</th>
                            <th>Out Time</th>
                            <th>On Leave</th>
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
                    ) : employeeData.length !== 0 ? (
                        <tbody>
                            {employeeData.map((emp, index) => {
                                const profilePhotoUrl = emp.profilePhoto?.length !== 0
                                    ? `${secretKey}/employee/fetchProfilePhoto/${emp._id}/${emp.profilePhoto?.[0]?.filename}`
                                    : emp.gender === "Male" ? MaleEmployee : FemaleEmployee;

                                const empAttendance = attendanceData[emp._id] || {};
                                // console.log("Emp attendance is :", empAttendance);

                                const attendanceDate = empAttendance.attendanceDate || !date ? formattedDate : convertToDateInputFormat(date);

                                const currentYear = empAttendance.currentYear || year; // Use year prop or stored value
                                const currentMonth = empAttendance.currentMonth || month; // Use month prop or stored value
                                const currentDate = new Date().getDate();
                                const myDate = new Date(attendanceDate).getDate();

                                const attendanceDetails = empAttendance[currentYear]?.[currentMonth]?.[myDate] || {
                                    inTime: "",
                                    outTime: "",
                                    workingHours: "",
                                    status: ""
                                };
                                const convertToMinutes = (timeString) => {
                                    const [hours, minutes] = timeString.split(':').map(Number);
                                    return hours * 60 + minutes;
                                };
                                const inTime = attendanceData[emp._id]?.inTime || attendanceDetails.inTime || "";
                                const outTime = attendanceData[emp._id]?.outTime || attendanceDetails.outTime || "";
                                const inTimeMinutes = convertToMinutes(inTime);
                                const outTimeMinutes = convertToMinutes(outTime);
                                const comparisonTimeEarly = convertToMinutes("10:01"); // 10:00 AM
                                const comparisonTimeLate = convertToMinutes("13:00"); // 1:00 PM

                                // console.log("Emp attendance details :", attendanceDetails);

                                // Calculate working hours only if both inTime and outTime are available
                                const workingHours = (inTime && outTime && !isOnLeave) ? calculateWorkingHours(inTime, outTime) : "00:00";

                                let onLeave = attendanceData[emp._id]?.status === "Leave" || attendanceDetails.status === "Leave" || "";

                                // Determine the status
                                let status;
                                const workingMinutes = (inTime && outTime) ? workingHours.split(':').reduce((acc, time) => (60 * acc) + +time) : 0;
                                console.log("intimeminutes", inTimeMinutes)

                                if (inTimeMinutes >= comparisonTimeEarly & inTimeMinutes <= comparisonTimeLate) {
                                    status = "LC";
                                } else if (workingMinutes >= 420) { // 7 hours 15 minutes in minutes
                                    status = "Present";
                                } else if (workingMinutes >= 210 && workingMinutes < 420) { // 7 hours 15 minutes / 2 in minutes
                                    status = "Half Day";
                                } else {
                                    status = "Leave";
                                }
                                console.log("status", status)

                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="tbl-pro-img">
                                                    <img src={profilePhotoUrl} alt="Profile" className="profile-photo" />
                                                </div>
                                                <div className="">
                                                    {emp.ename}
                                                </div>
                                            </div>
                                        </td>
                                        <td>{emp.newDesignation === "Business Development Executive" && "BDE" ||
                                            emp.newDesignation === "Business Development Manager" && "BDM" ||
                                            emp.newDesignation}</td>
                                        <td>{emp.department}</td>
                                        <td>{emp.branchOffice}</td>
                                        <td>
                                            <div className='attendance-date-tbl'>
                                                <input
                                                    type='date'
                                                    className='form-control date-f'
                                                    value={attendanceDate}
                                                    disabled={date}
                                                    onChange={(e) =>
                                                        handleInputChange(emp._id, "attendanceDate", e.target.value)
                                                    }
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <div className='attendance-date-tbl'>
                                                <input
                                                    type='time'
                                                    className='form-cantrol in-time'
                                                    // value={attendanceDetails.inTime || inTime}
                                                    value={inTime}
                                                    disabled={emp.deletedDate || onLeave}
                                                    onChange={(e) =>
                                                        handleInputChange(emp._id, "inTime", e.target.value)
                                                    }
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <div className='attendance-date-tbl'>
                                                <input
                                                    type='time'
                                                    className='form-cantrol out-time'
                                                    // value={attendanceDetails.outTime || outTime}
                                                    value={outTime}
                                                    disabled={emp.deletedDate || onLeave}
                                                    onChange={(e) =>
                                                        handleInputChange(emp._id, "outTime", e.target.value)
                                                    }
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <Stack direction="row" spacing={10} alignItems="center" justifyContent="center">
                                                <AntSwitch
                                                    checked={onLeave}
                                                    onChange={(e) => handleCheckboxChange(
                                                        e.target.checked,
                                                        emp._id,
                                                        emp.employeeId,
                                                        emp.empFullName,
                                                        emp.newDesignation,
                                                        emp.department,
                                                        emp.branchOffice,
                                                        attendanceDate,
                                                        inTime,
                                                        outTime,
                                                        workingHours,
                                                        status)}
                                                    inputProps={{ 'aria-label': 'ant design' }} />
                                                {/* <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={onLeave}
                                                            // onChange={(e) => handleCheckboxChange(emp._id, e.target.checked)}
                                                            onChange={(e) => handleCheckboxChange(e.target.checked,emp._id, emp.employeeId, emp.empFullName, emp.newDesignation, emp.department, emp.branchOffice, attendanceDate, inTime, outTime, workingHours, status)}
                                                        />
                                                    }
                                                /> */}
                                            </Stack>
                                        </td>
                                        <td>
                                            {attendanceDetails.workingHours || workingHours}
                                        </td>
                                        <td>
                                            <span className={`badge ${(attendanceDetails.status || status) === "Present" ? "badge-completed" :
                                                (attendanceDetails.status || status) === "Leave" ? "badge-under-probation" :
                                                    (attendanceDetails.status || status) === "Half Day" ? "badge-half-day" : "badge-half-day"

                                                }`}>
                                                {attendanceDetails.status || status}
                                            </span>
                                        </td>
                                        {!emp.deletedDate && <td>
                                            <button type="submit" className="action-btn action-btn-primary" onClick={() =>
                                                handleSubmit(emp._id, emp.employeeId, emp.empFullName, emp.newDesignation, emp.department, emp.branchOffice, attendanceDate, inTime, outTime, workingHours, status)}>
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
        </div>
    )
}

export default AddAttendance;