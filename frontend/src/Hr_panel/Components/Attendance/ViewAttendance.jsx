import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Header from '../Header/Header';
import Navbar from '../Navbar/Navbar';
import EmpDfaullt from "../../../static/EmployeeImg/office-man.png";
import { FaPlus } from "react-icons/fa6";
import { IoFilterOutline } from "react-icons/io5";
import { format } from 'date-fns';
import { TiUserAddOutline } from "react-icons/ti";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";


function ViewAttendance() {

    return (
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
                                    2
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
                                    1
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
                        <table className="table table-vcenter table-nowrap attendance-table tbl-collps">
                            <thead className="tr-sticky">
                                <tr>
                                    <th className='hr-sticky-left-1'>Sr. No</th>
                                    <th className='hr-sticky-left-2'>Name</th>
                            
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
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>

                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
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
                                    <td className='hr-sticky-left-1'>
                                    2
                                    </td>
                                    <td className='hr-sticky-left-2'>
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
                                        <div className='l-leave'>
                                            A
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
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
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
                <div class="tab-pane" id="sbr">
                    <div className="table table-responsive table-style-4 m-0">
                        <table className="table table-vcenter table-nowrap attendance-table tbl-collps">
                            <thead className="tr-sticky">
                                <tr>
                                    <th className='hr-sticky-left-1'>Sr. No</th>
                                    <th className='hr-sticky-left-2'>Name</th>
                            
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
                                        <div className='p-add'>
                                            <FaPlus />
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
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
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
                                    <td className='hr-sticky-left-1'>
                                    2
                                    </td>
                                    <td className='hr-sticky-left-2'>
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
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='p-add'>
                                            <FaPlus />
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
            </div>
        </div>
    )

}


export default ViewAttendance;