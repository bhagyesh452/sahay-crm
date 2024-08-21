import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Nodata from '../../../components/Nodata';
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
    const [attendanceData, setAttendanceData] = useState([]);

    const fetchAttendance = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${secretKey}/attendance/viewAllAttendance`);
            const allAttendanceData = res.data.data;

            const filteredData = [];

            allAttendanceData.forEach(employee => {
                if (employee._id === id) {  // Check for the specific employee ID
                    employee.years.forEach(yearData => {
                        if (yearData.year === year) {  // Check for the specific year
                            yearData.months.forEach(monthData => {
                                if (monthData.month === month) {  // Check for the specific month
                                    monthData.days.forEach(dayData => {
                                        const { date, inTime, outTime, workingHours, status } = dayData;
                                        filteredData.push({
                                            employeeName: employee.employeeName,
                                            designation: employee.designation,
                                            department: employee.department,
                                            branchOffice: employee.branchOffice,
                                            date,
                                            inTime,
                                            outTime,
                                            workingHours,
                                            status
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
            });

            setAttendanceData(filteredData);
        } catch (error) {
            console.log("Error fetching attendance record", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [year, month]);

    return (
        <div>
            <Dialog className='My_Mat_Dialog' fullWidth maxWidth="md" open={() => open()}>
                <DialogTitle style={{ textAlign: "center" }}>
                    {`Attendance Details for ${name}`}
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
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="">
                                                            {(() => {
                                                                const names = (emp.employeeName || "").trim().split(/\s+/);
                                                                if (names.length === 1) {
                                                                    return names[0];
                                                                }
                                                                return `${names[0] || ""} ${names[names.length - 1] || ""}`;
                                                            })()}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{emp.designation === "Business Development Executive" && "BDE" ||
                                                    emp.designation === "Business Development Manager" && "BDM" ||
                                                    emp.designation}</td>
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
                                                            type='time'
                                                            className='form-cantrol in-time'
                                                            value={emp.inTime}
                                                            readOnly
                                                        />
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className='attendance-date-tbl'>
                                                        <input
                                                            type='time'
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
