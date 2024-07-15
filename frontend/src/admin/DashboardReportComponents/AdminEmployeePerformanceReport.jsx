import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminEmployeePerformanceReport() {

  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [empData, setEmpData] = useState([]);
  const [performanceData,  setPerformanceDate] = useState([]);

  const fetchEmployeePerformance = async () => {
    const response = await axios.get(`${secretKey}/employee/einfo`);
    console.log("Employee data is :", response.data);
    // console.log("Employee Target Details is :", response.data.targetDetails);
  };

  useEffect(()=>{
    fetchEmployeePerformance();
  }, []);

  return (
    <div>AdminEmployeePerformanceReport</div>
  )
}

export default AdminEmployeePerformanceReport