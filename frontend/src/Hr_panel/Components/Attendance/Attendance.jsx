import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Header from '../Header/Header';
import Navbar from '../Navbar/Navbar';
import { IoFilterOutline } from "react-icons/io5";

function Attendance() {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const userId = localStorage.getItem("hrUserId");
    const [myInfo, setMyInfo] = useState([]);

    const fetchPersonalInfo = async () => {
        try {
            const res = await axios.get(`${secretKey}/employee/fetchEmployeeFromId/${userId}`);
            // console.log("Fetched details is :", res.data.data);
            setMyInfo(res.data.data);
        } catch (error) {
            console.log("Error fetching employee details :", error);
        }
    };

    useEffect(() => {
        fetchPersonalInfo();
    }, []);

    return (
        <div>
            <Header id={myInfo._id} name={myInfo.ename} empProfile={myInfo.profilePhoto && myInfo.profilePhoto.length !== 0 && myInfo.profilePhoto[0].filename} gender={myInfo.gender} designation={myInfo.newDesignation} />
            <Navbar />
            <div className="page-wrapper">
                <div className="page-header rm_Filter m-0">
                    <div className="container-xl">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className='form-group'>
                                    <select className="form-select">
                                        <option>Select Month</option>
                                    </select>
                                </div>
                                <div className="btn-group ml-1" role="group" aria-label="Basic example">
                                    <button type="button" className="btn mybtn"  >
                                        <IoFilterOutline className='mr-1' /> Filter
                                    </button>
                                </div>
                            </div>
                            <div class="input-icon">
                                <span class="input-icon-addon">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon mybtn" width="18" height="18" viewBox="0 0 22 22" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                                        <path d="M21 21l-6 -6"></path>
                                    </svg>
                                </span>
                                <input
                                className="form-control search-cantrol mybtn"
                                placeholder="Search…"
                                type="text"
                                name="bdeName-search"
                                id="bdeName-search" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-body rm_Dtl_box m-0">
                    <div className="container-xl mt-2">
                        <div className="table table-responsive table-style-2 m-0">
                            <table className="table table-vcenter table-nowrap">
                                <thead>
                                    <tr className="tr-sticky">
                                        <th>Sr. No</th>
                                        <th>Employee Name</th>
                                        <th>Branch</th>
                                        <th>Designation</th>
                                        <th>1st Aug - Thursday</th>
                                        <th>2nd Aug - Friday</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>Nimesh Parekh</td>
                                        <td>Gota</td>
                                        <td>Head</td>
                                        <td>p</td>
                                        <td>p</td>
                                    </tr>
                                    <tr>
                                        <td>1</td>
                                        <td>Nimesh Parekh</td>
                                        <td>Gota</td>
                                        <td>Head</td>
                                        <td>p</td>
                                        <td>p</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Attendance
