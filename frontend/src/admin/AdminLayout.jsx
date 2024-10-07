import React, { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Navbar from "./Navbar";

function AdminLayout() {

    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const { adminName } = useParams();
    const [data, setData] = useState([]);

    

    return (
        <>
            <Header
            />
            <Navbar />
            {/* This will render the specific page content */}
            <Outlet />
        </>
    );
}

export default AdminLayout;