import React, { useState, useEffect } from 'react'
import axios from 'axios';
import EmpDfaullt from "../../../static/EmployeeImg/office-man.png";



function ViewAttendance() {

    return (
        <div>
            <div className="table table-responsive table-style-2 m-0">
                <table className="table table-vcenter table-nowrap">
                    <thead>
                        <tr className="tr-sticky">
                            <th rowSpan={2}>Sr. No</th>
                            <th rowSpan={2}>Employee Name</th>
                            <th rowSpan={2}>Designation</th>
                            <th rowSpan={2}>Branch</th>
                            <th colSpan={30}>Dates</th>
                            <th rowSpan={2}>Total</th>
                        </tr>
                        <tr className="tr-sticky">
                            {Array.from({ length: 30 }, (_, i) => (
                                <th key={i + 1}>{i + 1}</th>
                            ))}
                            
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
                                Gota
                            </td>
                            
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )

}


export default ViewAttendance;