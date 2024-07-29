import React , {useState , useEffect} from "react";
import { useParams } from 'react-router-dom';
import Header from "../Components/Header/Header";
import Navbar from "../Components/Navbar/Navbar";

function Dashboard(){
    useEffect(() => {
        document.title = `HR-Sahay-CRM`;
      }, []);
    return(
        <div>
            <Header  />
            <Navbar />
            <h1>Dashboard</h1>
        </div>
    )
}

export default Dashboard;