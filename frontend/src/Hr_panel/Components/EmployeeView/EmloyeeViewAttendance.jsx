import React, { useEffect, useState, CSSProperties, useRef } from "react";

function EmployeeViewAttendance()
{
    return (
        <div className="mt-3">
            <div className='d-flex mb-3 align-items-center justify-content-between'>
                <div className='d-flex align-items-center justify-content-start'>
                    <div className='form-group'>
                        <select className='form-select'>
                            <option disabled selected>--Select Year--</option>
                        </select>
                    </div>  
                    <div className='form-group ml-1'>
                        <select className='form-select'>
                            <option disabled selected>--Select Month--</option>
                        </select>
                    </div>
                </div>
                <div className="d-flex align-items-center justify-content-start">
                    <div className="areport clr-bg-light-e65b5b">
                        <div>L - 02</div>
                    </div>
                    <div className="areport clr-bg-light-1cba19 ml-1">
                        <div>P - 02</div>
                    </div>
                    <div className="areport clr-bg-light-ffb900 ml-1">
                        <div>H - 02</div>
                    </div>
                    <div className="areport clr-bg-light-4299e1 ml-1">
                        <div>LC - 02</div>
                    </div>
                </div>
            </div>
            <div className="table table-responsive table-style-2 m-0" style={{height:"374px", overflow:"auto"}}>
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
                        <tr>
                            <td>
                                1
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input
                                        type="date"
                                        className="form-control date-f"
                                        readOnly
                                    />
                                </div>
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input
                                        type="time"
                                        className='form-cantrol in-time'
                                    />
                                </div>
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input
                                        type="time"
                                        className='form-cantrol out-time'
                                    />
                                </div>
                            </td>
                            <td>
                               10
                            </td>
                            <td>
                               <span className="badge badge-under-probation">Leave</span> 
                            </td>
                        </tr>
                        <tr>
                            <td>
                                2
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input
                                        type="date"
                                        className="form-control date-f"
                                        readOnly
                                    />
                                </div>
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input
                                        type="time"
                                        className='form-cantrol in-time'
                                    />
                                </div>
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input
                                        type="time"
                                        className='form-cantrol out-time'
                                    />
                                </div>
                            </td>
                            <td>
                               10
                            </td>
                            <td>
                               <span className="badge badge-under-probation">Leave</span> 
                            </td>
                        </tr>
                        <tr>
                            <td>
                                3
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input
                                        type="date"
                                        className="form-control date-f"
                                        readOnly
                                    />
                                </div>
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input
                                        type="time"
                                        className='form-cantrol in-time'
                                    />
                                </div>
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input
                                        type="time"
                                        className='form-cantrol out-time'
                                    />
                                </div>
                            </td>
                            <td>
                               10
                            </td>
                            <td>
                               <span className="badge badge-under-probation">Leave</span> 
                            </td>
                        </tr>
                        <tr>
                            <td>
                                1
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input
                                        type="date"
                                        className="form-control date-f"
                                        readOnly
                                    />
                                </div>
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input
                                        type="time"
                                        className='form-cantrol in-time'
                                    />
                                </div>
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input
                                        type="time"
                                        className='form-cantrol out-time'
                                    />
                                </div>
                            </td>
                            <td>
                               10
                            </td>
                            <td>
                               <span className="badge badge-under-probation">Leave</span> 
                            </td>
                        </tr>
                        <tr>
                            <td>
                                2
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input
                                        type="date"
                                        className="form-control date-f"
                                        readOnly
                                    />
                                </div>
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input
                                        type="time"
                                        className='form-cantrol in-time'
                                    />
                                </div>
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input
                                        type="time"
                                        className='form-cantrol out-time'
                                    />
                                </div>
                            </td>
                            <td>
                               10
                            </td>
                            <td>
                               <span className="badge badge-under-probation">Leave</span> 
                            </td>
                        </tr>
                        <tr>
                            <td>
                                3
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input
                                        type="date"
                                        className="form-control date-f"
                                        readOnly
                                    />
                                </div>
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input
                                        type="time"
                                        className='form-cantrol in-time'
                                    />
                                </div>
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input
                                        type="time"
                                        className='form-cantrol out-time'
                                    />
                                </div>
                            </td>
                            <td>
                               10
                            </td>
                            <td>
                               <span className="badge badge-under-probation">Leave</span> 
                            </td>
                        </tr>
                        <tr>
                            <td>
                                1
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input
                                        type="date"
                                        className="form-control date-f"
                                        readOnly
                                    />
                                </div>
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input
                                        type="time"
                                        className='form-cantrol in-time'
                                    />
                                </div>
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input
                                        type="time"
                                        className='form-cantrol out-time'
                                    />
                                </div>
                            </td>
                            <td>
                               10
                            </td>
                            <td>
                               <span className="badge badge-under-probation">Leave</span> 
                            </td>
                        </tr>
                        <tr>
                            <td>
                                2
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input
                                        type="date"
                                        className="form-control date-f"
                                        readOnly
                                    />
                                </div>
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input
                                        type="time"
                                        className='form-cantrol in-time'
                                    />
                                </div>
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input
                                        type="time"
                                        className='form-cantrol out-time'
                                    />
                                </div>
                            </td>
                            <td>
                               10
                            </td>
                            <td>
                               <span className="badge badge-under-probation">Leave</span> 
                            </td>
                        </tr>
                        <tr>
                            <td>
                                3
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input
                                        type="date"
                                        className="form-control date-f"
                                        readOnly
                                    />
                                </div>
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input
                                        type="time"
                                        className='form-cantrol in-time'
                                    />
                                </div>
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input
                                        type="time"
                                        className='form-cantrol out-time'
                                    />
                                </div>
                            </td>
                            <td>
                               10
                            </td>
                            <td>
                               <span className="badge badge-under-probation">Leave</span> 
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EmployeeViewAttendance;