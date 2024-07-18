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
        </div>
    )
}

export default Dashboard;