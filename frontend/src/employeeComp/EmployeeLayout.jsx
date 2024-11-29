import React, { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import axios from "axios";
import Header from '../components/Header';
import EmpNav from './EmpNav';

function EmployeeLayout() {

    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const { userId } = useParams();
    const [data, setData] = useState([]);
    const [teamData, setTeamData] = useState([])

    const fetchData = async () => {
        try {
            const response = await axios.get(`${secretKey}/employee/fetchEmployeeFromId/${userId}`);
            console.log("response" , response.data.data);
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };

    

    // Fetch data once and pass it to Header and EmpNav
    useEffect(() => {
        fetchData();
    }, [userId]);

    // console.log("data" , data)

    return (
        <>
            <Header
                id={data._id}
                name={data.ename}
                empProfile={data.profilePhoto && data.profilePhoto.length !== 0 && data.profilePhoto[0].filename}
                gender={data.gender}
                designation={data.newDesignation}
                data={data}
            />
            <EmpNav 
            userId={userId} 
            bdmWork={data.bdmWork}
            isTeamLeadsVisible={data.isVisibleTeamLeads ? data.isVisibleTeamLeads : false}
            
            />
            {/* This will render the specific page content */}
            <Outlet />
        </>
    );
}

export default EmployeeLayout;