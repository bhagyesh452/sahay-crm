import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoMdArrowRoundBack } from "react-icons/io";
import Nodata from '../../../components/Nodata';
import ClipLoader from 'react-spinners/ClipLoader';

function ShowAttendanceForParticularDate({ selectedDate, close }) {

    // console.log("Selected date is :", selectedDate);

    const date = new Date(selectedDate);
    const currentDay = date.getDate();
    const currentMonth = date.toLocaleString('default', { month: 'long' });
    const currentYear = date.getFullYear();

    const convertToDateInputFormat = (selectedDate) => {
        if (!selectedDate) return '';
        const date = new Date(selectedDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // console.log("Current day is :", currentDay);
    // console.log("Current month is :", currentMonth);
    // console.log("Current year is :", currentYear);

    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const [isLoading, setIsLoading] = useState(false);
    const [attendanceData, setAttendanceData] = useState([]);

    const fetchAttendance = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${secretKey}/attendance/viewAllAttendance`);
            const attendanceData = res.data.data;

            const filteredData = [];

            attendanceData.forEach(employee => {
                const { _id, years, employeeName, designation, department, branchOffice } = employee;

                years.forEach(yearData => {
                    if (yearData.year === currentYear) {
                        const { months } = yearData;

                        months.forEach(monthData => {
                            if (monthData.month === currentMonth) {
                                const { days } = monthData;

                                days.forEach(dayData => {
                                    const { date, inTime, outTime, workingHours, status } = dayData;

                                    if (date === currentDay) {
                                        filteredData.push({
                                            _id,
                                            employeeName,
                                            designation,
                                            department,
                                            branchOffice,
                                            attendanceDate: selectedDate,
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
    }, []);

    return (
        <div>
            <div className='d-flex justify-content-end'>
                <button
                    className='mb-1 mr-1 border-primary'
                    style={{ border: "1px solid", width: "50px" }}
                    onClick={close}>
                    <IoMdArrowRoundBack style={{ marginBottom: '3px', color: "ff9000" }} />
                </button>
            </div>

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
                                                        // Split the item.ename string into an array of words based on spaces
                                                        const names = (emp.employeeName || "").trim().split(/\s+/);

                                                        // Check if there's only one name or multiple names
                                                        if (names.length === 1) {
                                                            return names[0]; // If there's only one name, return it as-is
                                                        }

                                                        // Return the first and last name, or an empty string if not available
                                                        return `${names[0] || ""} ${names[names.length - 1] || ""}`;
                                                    })()}
                                                </div>
                                            </div>
                                        </td>
                                        <td>{emp.designation === "Business Development Executive" && "BDE" ||
                                            emp.designation === "Business Development Manager" && "BDM" ||
                                            emp.designation}</td>
                                        <td>{emp.department}</td>
                                        <td>{emp.branchOffice}</td>
                                        <td>
                                            <div className='attendance-date-tbl'>
                                                <input
                                                    type='date'
                                                    className='form-control date-f'
                                                    value={convertToDateInputFormat(selectedDate)}
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
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <div className='attendance-date-tbl'>
                                                <input
                                                    type='time'
                                                    className='form-cantrol out-time'
                                                    value={emp.outTime}
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
        </div>
    )
}

export default ShowAttendanceForParticularDate