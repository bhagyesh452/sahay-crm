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

    const handleSubmit = async (id, empId, name, designation, department, branch, date, inTime, outTime, workingHours, status) => {
        console.log("Date is :", date)
        const selectedDate = new Date(date);
        const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
        // const formattedDate = date.toISOString().split('T')[0];
        console.log("Day is :", dayName)

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

        const [inHours, inMinutes] = inTime.split(':').map(Number);
        const [outHours, outMinutes] = outTime.split(':').map(Number);

        const inTimeMinutes = inHours * 60 + inMinutes;
        const outTimeMinutes = outHours * 60 + outMinutes;

        let workingMinutes = outTimeMinutes - inTimeMinutes - 45; // Subtract 45 minutes by default

        if (workingMinutes < 0) {
            workingMinutes += 24 * 60; // Adjust for overnight shifts
        }

        // Convert minutes back to HH:MM format
        const hours = Math.floor(workingMinutes / 60);
        const minutes = workingMinutes % 60;
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

    };

    // const fetchAttendance = async () => {
    //     setIsLoading(true);
    //     try {
    //         const res = await axios.get(`${secretKey}/attendance/viewAllAttendance`);
    //         const allAttendanceData = res.data.data;

    //         const totalDays = new Date(year, new Date(Date.parse(`${month} 1, ${year}`)).getMonth() + 1, 0).getDate();
    //         const today = new Date().getDate();
    //         const currentMonth = getCurrentMonthName();

    //         const filteredData = [];

    //         for (let date = 1; (!currentMonth ? date <= totalDays : date <= today); date++) {
    //             allAttendanceData.forEach(employee => {
    //                 if (employee._id === id) {  // Check for the specific employee ID
    //                     employee.years.forEach(yearData => {
    //                         if (yearData.year === year) {  // Check for the specific year
    //                             yearData.months.forEach(monthData => {
    //                                 if (monthData.month === month) {  // Check for the specific month
    //                                     monthData.days.forEach(dayData => {
    //                                         const { date, inTime, outTime, workingHours, status } = dayData;
    //                                         filteredData.push({
    //                                             employeeName: employee.employeeName,
    //                                             designation: employee.designation,
    //                                             department: employee.department,
    //                                             branchOffice: employee.branchOffice,
    //                                             date,
    //                                             inTime,
    //                                             outTime,
    //                                             workingHours,
    //                                             status
    //                                         });
    //                                     });
    //                                 }
    //                             });
    //                         }
    //                     });
    //                 }
    //             });
    //         }
    //         filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));
    //         setAttendanceData(filteredData);
    //     } catch (error) {
    //         console.log("Error fetching attendance record", error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const getCurrentMonthName = () => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const currentMonthIndex = new Date().getMonth();
        return months[currentMonthIndex];
    };

    const fetchAttendance = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${secretKey}/attendance/viewAttendance/${id}`);
            const attendanceData = res.data.data;  // This is now an object for a single employee
            console.log("Attendance data is:", attendanceData);
    
            const totalDays = new Date(year, new Date(Date.parse(`${month} 1, ${year}`)).getMonth() + 1, 0).getDate();
            const today = new Date().getDate();  // Current date of the month
            const currentMonth = getCurrentMonthName();
            const isCurrentMonth = month === currentMonth;
    
            let name = attendanceData.employeeName; // Get employee name directly from the fetched data
            let designation = attendanceData.designation;  // Get designation directly from the fetched data
            const filteredData = [];
            const filledDates = new Set();  // To track dates with existing data
    
            // Process attendance data
            attendanceData.years.forEach(yearData => {
                if (yearData.year === year) {  // Check for the specific year
                    yearData.months.forEach(monthData => {
                        if (monthData.month === month) {  // Check for the specific month
                            monthData.days.forEach(dayData => {
                                const { date: dayDate, inTime, outTime, workingHours, status } = dayData;
    
                                filledDates.add(dayDate);  // Add filled date to the set
    
                                // Add data for the current month up to today or all data for past months
                                if (isCurrentMonth && dayDate <= today || !isCurrentMonth) {
                                    filteredData.push({
                                        _id: attendanceData._id,
                                        employeeId: attendanceData.employeeId,
                                        employeeName: attendanceData.employeeName,
                                        designation: attendanceData.designation,
                                        department: attendanceData.department,
                                        branchOffice: attendanceData.branchOffice,
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
    
            // Include dates with no data in current month
            if (isCurrentMonth) {
                for (let date = 1; date <= today; date++) {
                    if (!filledDates.has(date)) {
                        filteredData.push({
                            employeeName: name, // Example placeholder for missing data
                            designation: designation,
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
                            date: date,
                            inTime: '',
                            outTime: '',
                            workingHours: '',
                            status: ''
                        });
                    }
                }
            }
    
            // Sort the filtered data by date
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
        fetchAttendance();
    }, [year, month, id]);

    return (
        <div>
            <Dialog className='My_Mat_Dialog' fullWidth maxWidth="md" open={() => open()}>
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
                                    <th>Action</th>
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

                                        const inTime = inputValues[emp.date]?.inTime || emp.inTime || "";
                                        const outTime = inputValues[emp.date]?.outTime || emp.outTime || "";

                                        // Calculate working hours only if both inTime and outTime are available
                                        const workingHours = calculateWorkingHours(inputValues[emp.date]?.inTime || emp.inTime, inputValues[emp.date]?.outTime || emp.outTime);

                                        // Determine the status
                                        let status;
                                        const workingMinutes = (inputValues[emp.date]?.inTime || emp.inTime && inputValues[emp.date]?.outTime || emp.outTime) ? workingHours.split(':').reduce((acc, time) => (60 * acc) + +time) : 0;
                                        if (workingMinutes >= 435) {
                                            status = "Present";
                                        } else if (workingMinutes >= 218 && workingMinutes <= 435) {
                                            status = "Half Day";
                                        } else if (workingMinutes <= 120) {
                                            status = "Leave";
                                        } else {
                                            status = "Leave";
                                        }

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
                                                            className='form-cantrol in-time'
                                                            value={inTime}
                                                            onChange={(e) => handleInputChange(emp.date, 'inTime', e.target.value)}
                                                        />
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className='attendance-date-tbl'>
                                                        <input
                                                            type="time"
                                                            className='form-cantrol out-time'
                                                            value={outTime}
                                                            onChange={(e) => handleInputChange(emp.date, 'outTime', e.target.value)}
                                                        />
                                                    </div>
                                                </td>
                                                <td>
                                                    {workingHours}
                                                </td>
                                                <td>
                                                    <span className={`badge ${(status) === "Present" ? "badge-completed" :
                                                        (status) === "Leave" ? "badge-under-probation" :
                                                            (status) === "Half Day" ? "badge-half-day" : ""
                                                        }`}>
                                                        {status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button type="submit" className="action-btn action-btn-primary" onClick={() =>
                                                        handleSubmit(empId, employeeId, empName, designation, department, branchOffice,
                                                            convertToDateInputFormat(new Date(`${year}-${month}-${emp.date}`)),
                                                            inputValues[emp.date]?.inTime || emp.inTime,
                                                            inputValues[emp.date]?.outTime || emp.outTime,
                                                            calculateWorkingHours(inputValues[emp.date]?.inTime || emp.inTime, inputValues[emp.date]?.outTime || emp.outTime),
                                                            status)}>
                                                        <GiCheckMark />
                                                    </button>
                                                </td>
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