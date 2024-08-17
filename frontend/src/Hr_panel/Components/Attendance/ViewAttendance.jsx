import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MaleEmployee from "../../../static/EmployeeImg/office-man.png";
import FemaleEmployee from "../../../static/EmployeeImg/woman.png";
import { FaPlus } from "react-icons/fa6";
import ClipLoader from 'react-spinners/ClipLoader';
import { Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FaRegCalendarPlus } from "react-icons/fa6";
import { LuMailPlus } from "react-icons/lu";
import Swal from 'sweetalert2';
import { HiMiniViewfinderCircle } from "react-icons/hi2";
import Nodata from '../../../components/Nodata';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

function ViewAttendance({ year, month }) {

    const secretKey = process.env.REACT_APP_SECRET_KEY;

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

    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1; // JavaScript months are 0-based
    const currentYear = today.getFullYear();

    const [isLoading, setIsLoading] = useState(false);
    const [gotaBranchEmployees, setGotaBranchEmployees] = useState([]);
    const [sindhuBhawanBranchEmployees, setSindhuBhawanBranchEmployees] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

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
    const [outTime, setOutTime] = useState("");

    const [attendanceData, setAttendanceData] = useState({});

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

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleDayClick = (day, id, empName, empId, designation, department, branch) => {
        setShowPopup(true);
        setId(id);
        setEmpName(empName);
        setEmployeeId(empId)
        // Format the date as "DD-MM-YYYY"
        const formattedDate = `${year}-${monthNumber < 10 ? '0' + monthNumber : monthNumber}-${day < 10 ? '0' + day : day}`;
        const date = new Date(year, monthNumber - 1, day); // monthNumber is zero-indexed in JavaScript Date
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = daysOfWeek[date.getDay()];

        setAttendanceDate(formattedDate);
        setDesignation(designation);
        setDepartment(department);
        setBranchOffice(branch);
        // setWorkingHours("4:00");
        // setStatus("Half Day");
        setDayName(dayName);
        // console.log("Attendance date is :", formattedDate);
        // console.log("Day name is :", dayName);
    };

    const handleSubmit = async (id, empId, name, designation, department, branch, date, day, inTime, outTime) => {

        // const workingHours = calculateWorkingHours(inTime, outTime);
        const calculateWorkingHours = (inTime, outTime) => {
            const [inHours, inMinutes] = inTime.split(':').map(Number);
            const [outHours, outMinutes] = outTime.split(':').map(Number);

            const inTimeMinutes = inHours * 60 + inMinutes;
            const outTimeMinutes = outHours * 60 + outMinutes;

            let workingMinutes = outTimeMinutes - inTimeMinutes - 45; // Subtract 45 minutes by default

            if (workingMinutes < 0) {
                workingMinutes += 24 * 60; // Adjust for overnight shifts
            }

            return workingMinutes;
        };

        const workingMinutes = calculateWorkingHours(inTime, outTime);

        // Convert minutes back to HH:MM format for display
        const hours = Math.floor(workingMinutes / 60);
        const minutes = workingMinutes % 60;
        const workingHours = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

        let status;
        if (workingMinutes >= 435) { // 7 hours 15 minutes in minutes
            status = "Present";
        } else if (workingMinutes >= 218) { // 7 hours 15 minutes / 2 in minutes
            status = "Half Day";
        } else if (workingMinutes <= 120) { // 2 hours in minutes
            status = "Leave";
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
            dayName: day,
            inTime: inTime,
            outTime: outTime,
            workingHours: workingHours,
            status: status
        };

        setShowPopup(false);
        setInTime("");
        setOutTime("");

        try {
            const res = await axios.post(`${secretKey}/attendance/addAttendance`, payload);
            console.log("Created attendance record is :", res.data);
            Swal.fire("success", "Attendance Successfully Added/Updated", "success");
        } catch (error) {
            console.log("Error adding attendance record", error);
            Swal.fire("error", "Error adding/updating attendance", "error");
        }
        fetchAttendance();
        // console.log("Employee id :", empId);
        // console.log("Employee name :", name);
        // console.log("Employee designation :", designation);
        // console.log("Employee department :", department);
        // console.log("Employee branch :", branch);
        // console.log("Attendance date :", date);
        // console.log("Attendance day is :", day);
        // console.log("In time is :", inTime);
        // console.log("Out time is :", outTime);
        // console.log("Working hours :", workingHours);
        // console.log("Attendance status is :", status);

        console.log("Data to be send :", payload);
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
        // fetchAttendance();
    }, []);

    // console.log("Gota employees are :", gotaBranchEmployees);
    // console.log("Sindhu Bhawan employees are :", sindhuBhawanBranchEmployees);

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
                                        1
                                    </div>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="tab-content card-body">
                    <div class="tab-pane active" id="gota">
                        <div className="table table-responsive table-style-4 m-0">
                            <table className="table table-vcenter table-nowrap attendance-table">
                                <thead className="tr-sticky">
                                    <tr>
                                        <th className='hr-sticky-left-1'>Sr. No</th>
                                        <th className='hr-sticky-left-2'>Name</th>

                                        {/* Generate table headers with day labels */}
                                        {selectedMonthDays.map(day => (
                                            <th className='th-day' key={day}>
                                                <div className='d-flex align-items-center justify-content-between'>
                                                    <div>
                                                        {getDayLabel(day)}
                                                    </div>
                                                    <div className='view-attendance-th-icon'>
                                                        <FaRegCalendarPlus />
                                                    </div>
                                                </div>
                                            </th>
                                        ))}
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
                                ) : gotaBranchEmployees.length !== 0 ? (
                                    <tbody>
                                        {gotaBranchEmployees.map((emp, index) => {
                                            const profilePhotoUrl = emp.profilePhoto?.length !== 0
                                                ? `${secretKey}/employee/fetchProfilePhoto/${emp._id}/${emp.profilePhoto?.[0]?.filename}`
                                                : emp.gender === "Male" ? MaleEmployee : FemaleEmployee;

                                            return (
                                                <tr key={index}>
                                                    <td className='hr-sticky-left-1'>{index + 1}</td>
                                                    <td className='hr-sticky-left-2'>
                                                        <div className="d-flex align-items-center">
                                                            <div className="tbl-pro-img">
                                                                <img src={profilePhotoUrl} alt="Profile" className="profile-photo" />
                                                            </div>
                                                            <div className="">
                                                                {emp.ename}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {selectedMonthDays.map(day => {
                                                        const empAttendance = attendanceData[emp._id] || {};
                                                        const formattedDate = `${year}-${monthNumber < 10 ? '0' + monthNumber : monthNumber}-${day < 10 ? '0' + day : day}`;
                                                        const { attendanceDate = formattedDate } = empAttendance;
                                                        
                                                        const currentYear = new Date().getFullYear();
                                                        const currentMonth = new Date().toLocaleString('default', { month: 'long' });
                                                        const currentDate = new Date().getDate();
                                                        const myDate = new Date(attendanceDate).getDate();

                                                        const attendanceDetails = empAttendance[currentYear]?.[currentMonth]?.[myDate] || {
                                                            inTime: "",
                                                            outTime: "",
                                                            workingHours: "",
                                                            status: ""
                                                        };

                                                        console.log("Emp attendance details :", attendanceDetails);

                                                        const status = attendanceData[emp._id]?.status || attendanceDetails.status || "";
                                                        // Determine if the button should be disabled
                                                        const isFutureDate =
                                                            year > currentYear ||
                                                            (year === currentYear && monthNumber > currentMonth) ||
                                                            (year === currentYear && monthNumber === currentMonth && day > currentDay);

                                                        return (
                                                            <td key={day}>
                                                                <div className={`
                                                                    ${status === "Present" ? "p-present" : ""}
                                                                    ${status === "Half Day" ? "H-Halfday" : ""}
                                                                    ${status === "Leave" ? "l-leave" : ""}
                                                                    `.trim()}>
                                                                    {status === "Present" ? "P" :
                                                                        status === "Half Day" ? "H" :
                                                                            status === "Leave" ? "L" : ""}
                                                                </div>

                                                                {!status && <div>
                                                                    <button
                                                                        className={day <= daysInMonth ? 'p-add' : ''}
                                                                        onClick={() => handleDayClick(day, emp._id, emp.empFullName, emp.employeeId, emp.newDesignation, emp.department, emp.branchOffice)}
                                                                        disabled={isFutureDate} // Disable button for future dates
                                                                    >
                                                                        {day <= daysInMonth && <FaPlus />}
                                                                    </button>
                                                                </div>}
                                                            </td>
                                                        );
                                                    })}
                                                    
                                                    <td className='hr-sticky-action3'>
                                                        25
                                                    </td>
                                                    <td className='hr-sticky-action2'>
                                                        3
                                                    </td>
                                                    <td className='hr-sticky-action1'>
                                                        2
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



                    {/* SBR Data */}
                    <div class="tab-pane" id="sbr">
                        <div className="table table-responsive table-style-4 m-0">
                            <table className="table table-vcenter table-nowrap attendance-table tbl-collps attendance-tbl">
                                <thead className="tr-sticky">
                                    <tr>
                                        <th className='hr-sticky-left-1'>Sr. No</th>
                                        <th className='hr-sticky-left-2'>Name</th>

                                        {/* Generate table headers with day labels */}
                                        {selectedMonthDays.map(day => (
                                            <th key={day}>{getDayLabel(day)}</th>
                                        ))}
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

                                            return (
                                                <tr key={index}>
                                                    <td className='hr-sticky-left-1'>{index + 1}</td>
                                                    <td className='hr-sticky-left-2'>
                                                        <div className="d-flex align-items-center">
                                                            <div className="tbl-pro-img">
                                                                <img src={profilePhotoUrl} alt="Profile" className="profile-photo" />
                                                            </div>
                                                            <div className="d-flex align-items-center justify-content-center">
                                                                <div>{emp.ename}</div>
                                                                <div>
                                                                    <LuMailPlus />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    {selectedMonthDays.map(day => {
                                                        // Determine if the button should be disabled
                                                        const isFutureDate =
                                                            year > currentYear ||
                                                            (year === currentYear && monthNumber > currentMonth) ||
                                                            (year === currentYear && monthNumber === currentMonth && day > currentDay);

                                                        return (
                                                            <td key={day}>
                                                                <div>
                                                                    <button
                                                                        className={day <= daysInMonth ? 'p-add' : ''}
                                                                        onClick={() => handleDayClick(day, emp._id, emp.empFullName, emp.employeeId, emp.newDesignation, emp.department, emp.branchOffice)}
                                                                        disabled={isFutureDate} // Disable button for future dates
                                                                    >
                                                                        {day <= daysInMonth && <FaPlus />}
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        );
                                                    })}
                                                    <td className='hr-sticky-action3'>
                                                        25
                                                    </td>
                                                    <td className='hr-sticky-action2'>
                                                        3
                                                    </td>
                                                    <td className='hr-sticky-action1'>
                                                        2
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
            <Dialog className='My_Mat_Dialog' open={showPopup} fullWidth maxWidth="sm">
                <DialogTitle>
                    Add attendance {" "}
                    <IconButton style={{ float: "right" }} onClick={() => {
                        handleClosePopup();
                        setInTime("");
                        setOutTime("");
                    }}>
                        <CloseIcon color="primary"></CloseIcon>
                    </IconButton>{" "}
                </DialogTitle>
                <DialogContent>
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="mb-3">
                                    <div className="d-flex">
                                        <div className="col-6 me-1">
                                            <label className="form-label">Employee Name</label>
                                            <input
                                                type="text"
                                                name="empName"
                                                className="form-control mt-1"
                                                placeholder="Employee name"
                                                value={empName}
                                                disabled
                                            // onChange={(e) => handleInputChange("firstName", e.target.value)}
                                            />
                                        </div>

                                        <div className="col-6 me-1">
                                            <label className="form-label">Attendance Date</label>
                                            <input
                                                type="date"
                                                name="attendanceDate"
                                                className="form-control mt-1"
                                                value={attendanceDate}
                                                disabled
                                            // onChange={(e) => handleInputChange("middleName", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="d-flex mt-3">
                                        <div className="col-6 me-1">
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
                                                className="form-control mt-1"
                                                value={inTime}
                                                onChange={(e) => setInTime(e.target.value)}
                                            />
                                        </div>

                                        <div className="col-6 me-1">
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
                                                className="form-control mt-1"
                                                value={outTime}
                                                onChange={(e) => setOutTime(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <Button className="btn btn-primary bdr-radius-none" variant="contained" onClick={() => handleSubmit(id, employeeId, empName, designation, department, branchOffice, attendanceDate, dayName, inTime, outTime)}>
                    Submit
                </Button>
            </Dialog>
        </>
    )
}

export default ViewAttendance;