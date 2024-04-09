import React from 'react'
import { useParams } from "react-router-dom";
import Header from '../Components/Header/Header.jsx'
import Navbar from '../Components/Navbar/Navbar.jsx';

function BdmDashboard() {
    const { userId } = useParams();







  return (
    <div>
      <Header/>
      <Navbar/>
    </div>
  )
}

export default BdmDashboard