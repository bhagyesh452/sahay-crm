import React, { useState, useEffect } from 'react'
import axios from 'axios';
import MaleEmployee from "../../../static/EmployeeImg/office-man.png";
import FemaleEmployee from "../../../static/EmployeeImg/woman.png";
import { GiCheckMark } from "react-icons/gi";
import ClipLoader from 'react-spinners/ClipLoader';
import Nodata from '../../../components/Nodata';

function AddAttendance({ year, month }) {

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

    // Convert month name to month number
    const monthNumber = monthNamesToNumbers[month];

    // Get the current date for the provided year and month
    const currentDate = new Date(year, monthNumber - 1, new Date().getDate() + 1);
    const formattedDate = currentDate.toISOString().split('T')[0]; // Format to YYYY-MM-DD

    const [isLoading, setIsLoading] = useState(false);
    const [employee, setEmployee] = useState([]);

    const [employeeId, setEmployeeId] = useState("");
    const [empName, setEmpName] = useState("");
    const [branchOffice, setBranchOffice] = useState("");
    const [designation, setDesignation] = useState("");
    const [department, setDepartment] = useState("");
    const [attendanceDate, setAttendanceDate] = useState(formattedDate);
    const [dayName, setDayName] = useState("");
    const [workingHours, setWorkingHours] = useState("");
    const [status, setStatus] = useState("Present");
    const [inTime, setInTime] = useState("");
    const [outTime, setOutTime] = useState("");

    const [attendanceData, setAttendanceData] = useState({});

    const fetchEmployees = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${secretKey}/employee/einfo`);
            setEmployee(res.data);
        } catch (error) {
            console.log("Error fetching employees", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (empId, field, value) => {
        setAttendanceData(prevState => ({
            ...prevState,
            [empId]: {
                ...prevState[empId],
                [field]: value,
            }
        }));
    };

    const calculateWorkingHours = (inTime, outTime) => {
        const inTimeDate = new Date(`1970-01-01T${inTime}:00`);
        const outTimeDate = new Date(`1970-01-01T${outTime}:00`);

        let differenceInMs = outTimeDate - inTimeDate;
        if (differenceInMs < 0) {
            // If outTime is past midnight, add 24 hours to outTime
            differenceInMs += 24 * 60 * 60 * 1000;
        }

        const hours = Math.floor(differenceInMs / (1000 * 60 * 60));
        const minutes = Math.floor((differenceInMs % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
    };

    const handleSubmit = async (id, empId, name, designation, department, branch, date, inTime, outTime, workingHours) => {

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
            console.log("Created attendance record is :", res.data);
        } catch (error) {
            console.log("Error adding attendance record", error);
        }

        // setInTime("");
        // setOutTime("");
        // setEmployeeId("");
        // setBranchOffice("");
        // setDesignation("");
        // setDepartment("")
        // setDayName("");
        // setWorkingHours("");
        // setStatus("");

        // console.log("Employee id :", empId);
        // console.log("Employee name :", name);
        // console.log("Employee designation :", designation);
        // console.log("Employee department :", department);
        // console.log("Employee branch :", branch);
        // console.log("Attendance date :", date);
        // console.log("Attendance day is :", dayName);
        // console.log("In time is :", inTime);
        // console.log("Out time is :", outTime);
        // console.log("Working hours :", workingHours);
        // console.log("Attendance status is :", status);

        // Clear data for the current employee after submission
        // setAttendanceData(prevState => ({
        //     ...prevState,
        //     [id]: {}
        // }));

        console.log("Data to be send :", payload);
    };

    useEffect(() => {
        fetchEmployees();
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
                    ) : employee.length !== 0 ? (
                        <tbody>
                            {employee.map((emp, index) => {
                                const profilePhotoUrl = emp.profilePhoto?.length !== 0
                                    ? `${secretKey}/employee/fetchProfilePhoto/${emp._id}/${emp.profilePhoto?.[0]?.filename}`
                                    : emp.gender === "Male" ? MaleEmployee : FemaleEmployee;

                                const empAttendance = attendanceData[emp._id] || {};
                                const { inTime = "", outTime = "", attendanceDate = formattedDate } = empAttendance;
                                const workingHours = calculateWorkingHours(inTime, outTime);

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
                                                    value={inTime}
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
                                                    value={outTime}
                                                    onChange={(e) =>
                                                        handleInputChange(emp._id, "outTime", e.target.value)
                                                    }
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            {(inTime && outTime) && workingHours}
                                        </td>
                                        <td>
                                            <span className='badge badge-completed'>{status}</span>
                                        </td>
                                        <td>
                                            <button type="submit" className="action-btn action-btn-primary" onClick={() =>
                                                handleSubmit(emp._id, emp.employeeId, emp.empFullName, emp.newDesignation, emp.department, emp.branchOffice, attendanceDate, inTime, outTime, workingHours)}>
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
        </div>
    )
}

export default AddAttendance;