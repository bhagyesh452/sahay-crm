import React, { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import axios from "axios";
import RelationshipManagerHeader from "./RelationshipManagerHeader";
import RelationshipManagerNavbar from "./RelationshipManagerNavbar";

function RelationshipManagerLayout() {

    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const { userId } = useParams();
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${secretKey}/employee/fetchEmployeeFromId/${userId}`);
            console.log("Response data is :", response.data.data);
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };

    // Fetch data once and pass it to Header and EmpNav
    useEffect(() => {
        fetchData();
    }, [userId]);

    return (
        <>
            <RelationshipManagerHeader
                id={data._id}
                name={data.ename}
                empProfile={data.profilePhoto && data.profilePhoto.length !== 0 && data.profilePhoto[0].filename}
                gender={data.gender}
                designation={data.newDesignation}
                data={data}
            />
            <RelationshipManagerNavbar userId={userId} />
            {/* This will render the specific page content */}
            <Outlet />
        </>
    );
}

export default RelationshipManagerLayout;