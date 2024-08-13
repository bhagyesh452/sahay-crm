import React, { useEffect, useState } from "react";
import axios from 'axios';
import AdminExecutiveHeader from "../Components/AdminExecutiveHeader";
import AdminExecutiveNavbar from "../Components/AdminExecutiveNavbar";


function AdminExecutiveDashboard() {
  //const { rmCertificationUserId } = useParams();
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [employeeData, setEmployeeData] = useState([])


  useEffect(() => {
    document.title = `AdminExecutive-Sahay-CRM`;
  }, []);

  const adminExecutiveUserId = localStorage.getItem("adminExecutiveUserId")
  console.log(adminExecutiveUserId)


  const fetchData = async () => {
    try {
      const response = await axios.get(`${secretKey}/employee/einfo`);
      // Set the retrieved data in the state
      const tempData = response.data;
      console.log(tempData)
      const userData = tempData.find((item) => item._id === adminExecutiveUserId);
      console.log(userData)
      setEmployeeData(userData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // console.log('employeeData', employeeData);

  return (
    <div>
      <AdminExecutiveHeader id={employeeData._id} 
      name={employeeData.ename} 
      empProfile={employeeData.profilePhoto && 
      employeeData.profilePhoto.length !== 0 && 
      employeeData.profilePhoto[0].filename} 
      gender={employeeData.gender} 
      designation={employeeData.newDesignation} 
      />
      <AdminExecutiveNavbar adminExecutiveUserId={adminExecutiveUserId} />
    </div>
  )
}

export default AdminExecutiveDashboard