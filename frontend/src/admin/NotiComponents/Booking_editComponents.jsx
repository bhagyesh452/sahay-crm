import React, { useEffect, useState } from 'react';
import { MdDateRange } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import { RxAvatar } from "react-icons/rx";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import Swal from "sweetalert2";
import axios from "axios";
import io from "socket.io-client";
import { TbViewportWide } from "react-icons/tb";
import Nodata from "../../components/Nodata";
import EditBookingPreview from '../EditBookingPreview';


function Booking_editComponents() {
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [deletedData, setDeletedData] = useState([]);
  const [filterBy, setFilterBy] = useState("Pending");
  const [searchText, setSearchText] = useState("");
 const [totalBookings, setTotalBookings] = useState([]);
 const [currentBooking , setCurrentBooking] = useState(null);
 const [bookingIndex, setBookingIndex] = useState(0);
 const [compareBooking, setCompareBooking] = useState(null);
 const [currentCompany, setCurrentCompany] = useState("");
 const [moreBookingCase, setMoreBookingCase] = useState(false);
 const [nowToFetch, setNowToFetch] = useState(false)
 const [editData, setEditData] = useState([])


  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }


  // ------------------------------------------   Fetching Functions --------------------------------------------------
  const fetchCompareBooking = async()=>{
    try{
      const response = await axios.get(`${secretKey}/bookings/redesigned-final-leadData`);
      if(moreBookingCase){
        const bookingObject = response.data.find(obj=> obj["Company Name"] === currentCompany);
        setCompareBooking(bookingObject.moreBooking[bookingIndex-1]);
      }else{
        setCompareBooking(response.data.find(obj=> obj["Company Name"] === currentCompany));
      }
     
    }catch(error){
      console.error("Error fetching Current Booking" , error.message);
    }
  }

  const fetchEditRequests = async () => {
    try {
      const response = await axios.get(`${secretKey}/bookings/editable-LeadData`);
      setTotalBookings(response.data);
      const uniqueEnames = response.data.reduce((acc, curr) => {
        if (!acc.some((item) => item.requestBy === curr.requestBy)) {
          const newDate = new Date(curr.requestDate).toLocaleDateString();
          const newTime = new Date(curr.requestDate).toLocaleTimeString();
          acc.push({
            ename: curr.requestBy,
            date: newDate,
            time: newTime,
            companyName: curr["Company Name"],
          });
        }
        return acc;
      }, []);
      setEditData(uniqueEnames);
    } catch (error) {
      console.error("Error fetching data:", error); 
    }
  };

  //  ----------------------------------  Use Effect Conditions  ----------------------------------------

  useEffect(() => {
   if(nowToFetch){
    setCurrentCompany("");
    setCompareBooking(null);
    setCurrentBooking(null);
    fetchEditRequests()
    setNowToFetch(false)
   }
  }, [nowToFetch])
  
  useEffect(() => {
    fetchCompareBooking();
   setCurrentBooking(totalBookings.find(obj=>obj["Company Name"] === currentCompany));
  }, [currentCompany]);

  useEffect(() => {
    fetchEditRequests()
  }, [])
  useEffect(() => {
    const socket = secretKey === "http://localhost:3001/api" ? io("http://localhost:3001") : io("wss://startupsahay.in", {
      secure: true, // Use HTTPS
      path:'/socket.io',
      reconnection: true, 
      transports: ['websocket'],
    });

    return () => {
      socket.disconnect();
    };
  }, []);


  return (
    <div className="my-card mt-2">
     {!currentBooking && !compareBooking && <>
      <div className="my-card-head p-2">
        <div className="filter-area d-flex justify-content-between w-100">
          <div className="filter-by-bde d-flex align-items-center">
            <div className='mr-2'>
              <label htmlFor="search_bde ">BDE : </label>
            </div>
            <div className='Notification_filter'>
              <input type="text" name="search_bde" id="search_bde" value={searchText} onChange={(e) => setSearchText(e.target.value)} className='form-control col-sm-8' placeholder='Please Enter BDE name' />
            </div>
          </div>
        </div>
      </div>
      <div className='my-card-body p-2'>
        <div className='Notification-table-main table-resposive'>
          <table className="table EditRequest-table m-0">
            <thead>
              <tr>
                <th>Sr. No</th>
                <th>Company Name</th>
                <th>Requested By</th>
                <th>Requested On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {editData.length !== 0 ? editData.map((obj, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td className="text-muted">
                    {obj.companyName}
                  </td>
                  <td className="text-muted">
                    <div className="Notification-date d-flex align-items-center justify-content-center">

                      <RxAvatar style={{ fontSize: '16px' }} />

                      <div style={{ marginLeft: '5px' }} className="noti-text">
                        <b>

                          {obj.ename}
                        </b>

                      </div>
                    </div>

                  </td>
                  <td className="text-muted">
                    <div className="Notification-date d-flex align-items-center justify-content-center">

                      <MdDateRange style={{ fontSize: '16px' }} />

                      <div style={{ marginLeft: '5px' }} className="noti-text">
                        <b>
                          {formatDate(obj.date)}
                        </b>
                      </div>
                    </div>

                  </td>
                  <td>
                    {filterBy === "Pending" && <div className='d-flex align-items-center justify-content-center'>
                      <div className='expand-btn' onClick={()=>setCurrentCompany(obj.companyName)}>
                      <TbViewportWide  />
                      </div>
                    </div>}
                    {filterBy === "Completed" && <div className='d-flex align-items-center justify-content-center'>
                      <div className="Notification_completedbtn">
                        <IoCheckmarkDoneCircle />
                      </div>
                    </div>}
                  </td>
                </tr>
              )) : <tr>
                <td colSpan={5}>
                  <span
                    style={{
                      textAlign: "center",
                      fontSize: "25px",
                      fontWeight: "bold",
                    }}
                  >
                    <Nodata />
                  </span>
                </td>


              </tr>}


            </tbody>
          </table>
        </div>
      </div>
      </>}
      {currentBooking && compareBooking && <div className="maincontent">
      <EditBookingPreview setNowToFetch={setNowToFetch} requestedBooking={currentBooking} existingBooking={currentBooking.bookingIndex!==0 ? compareBooking.moreBookings[(currentBooking.bookingIndex-1)] : compareBooking} setCurrentBooking={setCurrentBooking}  setCompareBooking={setCompareBooking} setCurrentCompany={setCurrentCompany}/>
      </div>}
    </div>
  )
}

export default Booking_editComponents