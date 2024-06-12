import React, { useEffect, useState, CSSProperties, useRef } from "react";
import { useParams } from 'react-router-dom';
import Header from "../components/Header";
import EmpNav from "./EmpNav";
import axios from "axios";
import { options } from "../components/Options.js";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
//import { DateRangePicker } from "react-date-range";




function EmployeeProfile() {
    const { userId } = useParams();
    const { newtoken } = useParams();
    const [data, setdata] = useState([])
    const [employeeData, setEmployeeData] = useState([])
    const secretKey = process.env.REACT_APP_SECRET_KEY;



//-----------------fetching employee details----------------------------------
    const fetchEmployeeData =async()=>{
  
        try{
          const response = await axios.get(`${secretKey}/employee/einfo`)
          console.log(response.data)
          const tempData = response.data;
      const data = tempData.find((item) => item._id === userId);
          
          console.log(data)
          setEmployeeData(data)
          setdata(data)
      
      
        }catch(error){
          console.error("Error fetching employee data" , error)
      
        }
      }
      React.useEffect(()=>{
        fetchEmployeeData()
      },[])

console.log(data.ename , data.designation)






  return (
    <div>
        <Header name={data.ename} designation={data.designation} />
        <EmpNav userId={userId} bdmWork={data.bdmWork} />
    </div>
  )
}

export default EmployeeProfile