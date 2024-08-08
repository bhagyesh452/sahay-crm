import React , {useState , useEffect} from "react";
import { useParams } from 'react-router-dom';
import Header from "../Components/Header/Header";
import Navbar from "../Components/Navbar/Navbar";
import { IoFilterOutline } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import { CiUndo } from "react-icons/ci";

function Dashboard(){

    const userId = localStorage.getItem("hrUserId");
    // const [myInfo, setMy]
    useEffect(() => {
        document.title = `HR-Sahay-CRM`;
      }, []);
    return(
        <div>
            <Header  />
            <Navbar />
            <h1>HR Dashboard</h1>
        </div>
    )
}

export default Dashboard;