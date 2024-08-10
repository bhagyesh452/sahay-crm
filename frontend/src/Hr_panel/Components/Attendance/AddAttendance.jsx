import React, { useState, useEffect } from 'react'
import axios from 'axios';
import EmpDfaullt from "../../../static/EmployeeImg/office-man.png";



function AddAttendance() {

    return (
        <div>
            <div className="table table-responsive table-style-2 m-0">
                <table className="table table-vcenter table-nowrap">
                    <thead>
                        <tr className="tr-sticky">
                            <th> Sr. No </th>
                            <th> Employee Name  </th>
                            <th>  Designation </th>
                            <th>  Department </th>
                            <th> Branch </th>
                            <th> Date </th>
                            <th> In Time  </th>
                            <th> Out Time  </th>
                            <th>  Working Hours </th>
                            <th>  Result </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                1
                            </td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <div className="tbl-pro-img">
                                        <img src={EmpDfaullt}  alt="Profile"  className="profile-photo" />
                                    </div>
                                    <div className="">
                                        Vasant Desai
                                    </div>
                                </div>
                            </td>
                            <td>
                                BDE
                            </td>
                            <td>
                                Sales
                            </td>
                            <td>
                                Gota
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input type='date' className='form-cantrol date-f'/>
                                </div>
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input type='time' className='form-cantrol in-time'/>
                                </div>
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input type='time' className='form-cantrol out-time'/>
                                </div>
                            </td>
                            <td>
                                09:12:00
                            </td>
                            <td>
                                <span className='badge badge-completed'>Present</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                1
                            </td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <div className="tbl-pro-img">
                                        <img src={EmpDfaullt}  alt="Profile"  className="profile-photo" />
                                    </div>
                                    <div className="">
                                        Vasant Desai
                                    </div>
                                </div>
                            </td>
                            <td>
                                BDE
                            </td>
                            <td>
                                Sales
                            </td>
                            <td>
                                Gota
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input type='date' className='form-cantrol date-f'/>
                                </div>
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input type='time' className='form-cantrol in-time'/>
                                </div>
                            </td>
                            <td>
                                <div className='attendance-date-tbl'>
                                    <input type='time' className='form-cantrol out-time'/>
                                </div>
                            </td>
                            <td>
                                09:12:00
                            </td>
                            <td>
                                <span className='badge badge-completed'>Present</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )

}


export default AddAttendance;