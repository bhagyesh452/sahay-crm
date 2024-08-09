import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Header from '../Header/Header';
import Navbar from '../Navbar/Navbar';

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
            <h1>Employee Attendance</h1>
        </div>
    )
}

export default Attendance
