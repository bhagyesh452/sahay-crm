import React ,{useState , useEffect}from 'react'
import { useParams } from "react-router-dom";
import Header from '../Components/Header/Header.jsx'
import Navbar from '../Components/Navbar/Navbar.jsx';
import axios from "axios";

function BdmDashboard() {
    const { userId } = useParams();
    const [data, setData] = useState([])
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const frontendKey = process.env.REACT_APP_FRONTEND_KEY;
    //const bdmName = localStorage.getItem("bdmName")


    const fetchData = async () => {
      try {
        const response = await axios.get(`${secretKey}/einfo`);
  
        // Set the retrieved data in the state
        const tempData = response.data;
        const userData = tempData.find((item) => item._id === userId);
        console.log(tempData);
        setData(userData);
        //setmoreFilteredData(userData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    useEffect(()=>{
      fetchData()

    },[])

    console.log(data)

    //console.log(userId)







  return (
    <div>
      <Header bdmName={data.ename}/>
      <Navbar userId={userId}/>
    </div>
  )
}

export default BdmDashboard