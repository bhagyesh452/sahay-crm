import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import Header from "../Components/Header/Header";
import Navbar from "../Components/Navbar/Navbar";
import { IoFilterOutline } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import { CiUndo } from "react-icons/ci";
import axios from "axios";

function Dashboard() {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const userId = localStorage.getItem("hrUserId");
    const [myInfo, setMyInfo] = useState([]);

    useEffect(() => {
        document.title = `HR-Sahay-CRM`;
    }, []);

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
            <h1>HR Dashboard</h1>
        </div>
    )
}

export default Dashboard;