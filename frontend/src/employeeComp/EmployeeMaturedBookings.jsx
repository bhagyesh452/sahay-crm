import React ,{useState , useEffect} from 'react';
import EmpNav from "./EmpNav.js";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import axios from 'axios';








function EmployeeMaturedBookings() {

    const [data , setData] = useState([])
    const { userId } = useParams();
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const frontendKey = process.env.REACT_APP_FRONTEND_KEY;


    console.log(userId)


    const fetchData = async () => {
        try {
          const response = await axios.get(`${secretKey}/einfo`);
      
          // Set the retrieved data in the state
          const tempData = response.data;
          console.log("tempData:", tempData); // Log tempData to check its content
          const userData = response.data.find((item) => item._id === userId);
          console.log("userData:", userData); // Log userData to check if it's null or contains the expected data
          setData(userData);
        } catch (error) {
          console.error("Error fetching data:", error.message);
        }
      };
      
      console.log("data:", data); // Log data to see if it's updated after fetching
      
      useEffect(() => {
        fetchData();

      }, [userId]);
      
//console.log(data[0].ename)

    return (
        <div>
            <Header name={data.ename} designation={data.designation} />
            <EmpNav userId={userId} bdmWork={data.bdmWork} />


        </div>
    )
}

export default EmployeeMaturedBookings