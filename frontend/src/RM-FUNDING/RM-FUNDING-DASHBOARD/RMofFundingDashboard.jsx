import React, { useEffect, useState } from "react";
import axios from 'axios';
//import RmofCertificationHeader from "../RM-CERT-COMPONENTS/RmofCertificationHeader";
import { useParams } from "react-router-dom";
import RmofFundingHeader from "../RM-FUNDING-COMPONENTS/RMofFundingHeader";
import RMofFundingNavbar from "../RM-FUNDING-COMPONENTS/RMofFundingNavbar";
//import RmCertificationNavbar from "../RM-CERT-COMPONENTS/RmCertificationNavbar";


function RmCertificationDashboard() {
  //const { rmCertificationUserId } = useParams();
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [employeeData, setEmployeeData] = useState([])

  const rmFundingUserId = localStorage.getItem("rmFundingUserId")
  console.log(rmFundingUserId)


  const fetchData = async () => {
    try {
      const response = await axios.get(`${secretKey}/employee/einfo`);
      // Set the retrieved data in the state
      const tempData = response.data;
      console.log(tempData)
      const userData = tempData.find((item) => item._id === rmFundingUserId);
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
     <RmofFundingHeader name={employeeData.ename} designation={employeeData.designation} />
       <RMofFundingNavbar/>
    </div>
  )
}

export default RmCertificationDashboard