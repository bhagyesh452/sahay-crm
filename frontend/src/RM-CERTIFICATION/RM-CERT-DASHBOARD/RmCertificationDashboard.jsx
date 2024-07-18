import React, { useEffect, useState } from "react";
import axios from 'axios';
import RmofCertificationHeader from "../RM-CERT-COMPONENTS/RmofCertificationHeader";
import RmCertificationNavbar from "../RM-CERT-COMPONENTS/RmCertificationNavbar";


function RmCertificationDashboard() {
  //const { rmCertificationUserId } = useParams();
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [employeeData, setEmployeeData] = useState([])


  useEffect(() => {
    document.title = `RMOFCERT-Sahay-CRM`;
  }, []);
  
  const rmCertificationUserId = localStorage.getItem("rmCertificationUserId")
  console.log(rmCertificationUserId)


  const fetchData = async () => {
    try {
      const response = await axios.get(`${secretKey}/employee/einfo`);
      // Set the retrieved data in the state
      const tempData = response.data;
      console.log(tempData)
      const userData = tempData.find((item) => item._id === rmCertificationUserId);
      console.log(userData)
      setEmployeeData(userData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  console.log('employeeData', employeeData)



  return (
    <div>
      <RmofCertificationHeader name={employeeData.ename} designation={employeeData.designation} />
      <RmCertificationNavbar rmCertificationUserId={rmCertificationUserId}/>
    </div>
  )
}

export default RmCertificationDashboard