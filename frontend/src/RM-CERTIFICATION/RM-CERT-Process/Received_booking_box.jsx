import React , {useState , useEffect} from 'react';
import axios from 'axios';
import RmofCertificationHeader from "../RM-CERT-COMPONENTS/RmofCertificationHeader";
import RmCertificationNavbar from "../RM-CERT-COMPONENTS/RmCertificationNavbar";


function Received_booking_box() {


    const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [employeeData, setEmployeeData] = useState([])

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
        <div className="booking-list-main">
            <div className="booking_list_Filter">
                <div className="container-xl">
                    <div className="row justify-content-between align-items-center">
                        <div className="col-2">
                            <div class="my-2 my-md-0 flex-grow-1 flex-md-grow-0 order-first order-md-last">
                                <div class="input-icon">
                                    <span class="input-icon-addon">
                                        <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="icon"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        stroke-width="2"
                                        stroke="currentColor"
                                        fill="none"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        >
                                        <path
                                            stroke="none"
                                            d="M0 0h24v24H0z"
                                            fill="none"
                                        ></path>
                                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                                        <path d="M21 21l-6 -6"></path>
                                        </svg>
                                    </span>
                                    <input
                                        type="text"
                                        class="form-control"
                                        placeholder="Search Company"
                                        aria-label="Search in website"
                                    
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-6 d-flex justify-content-end">
                            <button className='btn btn-primary'>All Booking</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-xl">
                <div className="booking_list_Dtl_box">
                    <div className="row m-0">
                        {/* --------booking list left Part---------*/}
                        <div className="col-4 p-0">
                            <div className="booking-list-card">
                                <div className="booking-list-heading">
                                    <div className="d-flex justify-content-between">
                                        <div className="b_dtl_C_name">Booking List</div>
                                    </div>
                                </div>
                                <div className="booking-list-body">
                                    <div className='rm_bking_list_box_item'>
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <div className='rm_bking_cmpny_name My_Text_Wrap'>
                                                Incscale Technologies Private Limited
                                            </div>
                                            <div>
                                                <button className='btn btn-sm btn-swap'>Swap</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>  
                            </div>
                        </div>
                         {/* --------booking Details Right Part---------*/}
                        <div className="col-8 p-0">
                            <div className="booking-deatils-card">
                                <div className="booking-deatils-heading">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="b_dtl_C_name">ABC PVT LTD</div>
                                    </div>
                                </div>
                                <div className="booking-deatils-body">

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Received_booking_box