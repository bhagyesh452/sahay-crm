import React, { useState, useEffect } from 'react'
import axios from 'axios';
import EmpDfaullt from "../../../static/EmployeeImg/office-man.png";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";


function ViewAttendance() {

    return (
        <div>
            <div className='hr_a_slct_month mb-3 mt-2'>
                <div className='d-flex align-items-center justify-content-center'>
                    <div className='LarrowMpnth'>
                        <FaChevronLeft />
                    </div>
                    <div className='hasmonth'>
                        January
                    </div>
                    <div className='RarrowMpnth'>
                        <FaChevronRight />
                    </div>
                </div>
            </div>
            <div className="table table-responsive table-style-4 m-0">
                <table className="table table-vcenter table-nowrap attendance-table">
                    <thead className="tr-sticky">
                        <tr>
                            <th className='hr-sticky-left-1' rowSpan={2}>Sr. No</th>
                            <th className='hr-sticky-left-2' rowSpan={2}>Name</th>
                            <th rowSpan={2}>Branch</th>
                            <th colSpan={30}>Dates</th>
                            <th className='hr-sticky-action' colSpan={3}>Total</th>
                        </tr>
                        <tr style={{zIndex:'0'}}>
                            {Array.from({ length: 30 }, (_, i) => (
                                <th key={i + 1}>{i + 1}</th>
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
                    <tbody>
                        <tr>
                            <td className='hr-sticky-left-1'>
                                1
                            </td>
                            <td className='hr-sticky-left-2'>
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
                                Gota
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='l-leave'>
                                    A
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='l-leave'>
                                    A
                                </div>
                            </td>
                            <td>
                                <div className='l-leave'>
                                    A
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='H-Halfday'>
                                   H
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='H-Halfday'>
                                   H
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>

                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
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
                        <tr>
                            <td className='rm-sticky-left-1'>
                                1
                            </td>
                            <td className='rm-sticky-left-2'>
                                <div className="d-flex align-items-center">
                                    <div className="tbl-pro-img">
                                        <img src={EmpDfaullt}  alt="Profile"  className="profile-photo" />
                                    </div>
                                    <div className="">
                                        Jitendra Balsaniya  
                                    </div>
                                </div>
                            </td>
                            <td>
                                Gota
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                           
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>

                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='l-leave'>
                                    A
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='l-leave'>
                                    A
                                </div>
                            </td>
                            <td>
                                <div className='l-leave'>
                                    A
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='H-Halfday'>
                                   H
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='H-Halfday'>
                                   H
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
                            <td>
                                <div className='p-present'>
                                    P
                                </div>
                            </td>
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
                    </tbody>
                </table>
            </div>
        </div>
    )

}


export default ViewAttendance;