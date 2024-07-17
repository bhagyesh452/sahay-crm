import React, { useEffect, useState } from 'react';
import { MdDateRange } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import { RxAvatar } from "react-icons/rx";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import Swal from "sweetalert2";
import axios from "axios";
import io from "socket.io-client";
import Nodata from "../../components/Nodata";
import ClipLoader from "react-spinners/ClipLoader";

function EmployeeDeleteBookingComponent({ ename }) {
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [bookingDeleteData, setBookingDeleteData] = useState([])
  const [filteredBookingDeleteData, setFilteredBookingDeleteData] = useState([])
  const [currentDataLoading, setCurrentDataLoading] = useState(false)
const [searchText, setSearchText] = useState("")


  function parseDateString(dateString) {
    const [day, month, year] = dateString.split("/").map(Number);
    return new Date(year, month - 1, day);
  }

  function formatDate(timestamp) {
    const date = parseDateString(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const fetchDataDelete = async () => {
    try {
      setCurrentDataLoading(true)
      const response = await axios.get(`${secretKey}/requests/deleterequestbybde/${ename}`)
      const tempData = response.data;
      console.log("response", tempData)
      setBookingDeleteData(tempData)
      setFilteredBookingDeleteData(tempData)
    } catch (error) {
      console.log("Internal Server Error", error.message)
    } finally {
      setCurrentDataLoading(false)
    }
  }

  useEffect(() => {
    if (ename) {
      fetchDataDelete();
    }
  }, [ename])

  useEffect(() => {
    const socket = secretKey === "http://localhost:3001/api" ? io("http://localhost:3001") : io("wss://startupsahay.in", {
      secure: true, // Use HTTPS
      path: '/socket.io',
      reconnection: true,
      transports: ['websocket'],
    });


    socket.on("delete-request-done", () => {
      fetchDataDelete(); // Same condition
    });

    socket.on("delete-request-done-ondelete", () => {
      fetchDataDelete(); // Same condition
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  console.log("bokkingdeletedata", bookingDeleteData)

  useEffect(() => {
    if (searchText) {
      console.log(searchText)
      console.log(filteredBookingDeleteData)
      const filteredData = filteredBookingDeleteData.filter(obj => {
        console.log(obj.companyName); // Log the company name
        return obj.companyName?.toLowerCase().includes(searchText.toLowerCase());
      });
      setBookingDeleteData(filteredData);
    } else {
      setBookingDeleteData(filteredBookingDeleteData); // Reset to original data if no search text
    }
  }, [searchText]);


  return (
    <div className="my-card mt-2">
      <div className="my-card-head p-2">
        <div className="filter-area d-flex justify-content-between w-100">
        <div className="filter-by-bde d-flex align-items-center">
          <div className='mr-2'>
            <label htmlFor="search_bde ">Company Name : </label>
          </div>
          <div className='Notification_filter'>
            <input type="text" name="search_bde" id="search_bde" value={searchText} onChange={(e) => setSearchText(e.target.value)} className='form-control col-sm-8' placeholder='Please Enter BDE name' />
          </div>
        </div>
        {/* <div className="filter-by-date d-flex align-items-center">
          <div className='mr-2'>
            <label htmlFor="search_bde "> Filter By : </label>
          </div>
          <div className='Notification_filter'>
            <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)} style={{ border: "1px solid #ffc8c8 " }} name="filter_requests" id="filter_requests" className="form-select">
              <option value="Pending" selected>Pending</option>
              <option value="Completed" >Completed</option>
            </select>
          </div>
        </div> */}
      </div>
      </div>
      <div className='my-card-body p-2'>
        <div className='Notification-table-main table-resposive'>
          <table className="table Notification-table m-0">
            <thead>
              <tr>
                <th>Sr. No</th>
                <th>Company Name</th>
                <th>Requested On</th>
                <th>Status</th>
              </tr>
            </thead>
            {currentDataLoading ? (<body>
              <tr>
                <td colSpan="4" >
                  <div className="LoaderTDSatyle">
                    <ClipLoader
                      color="lightgrey"
                      loading
                      size={30}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  </div>
                </td>
              </tr>
            </body>)
              :
              (<tbody>
                {bookingDeleteData.length !== 0 ? bookingDeleteData.map((obj, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td className="text-muted">
                      {obj.companyName}
                    </td>
                    <td className="text-muted">
                      <div className="Notification-date d-flex align-items-center justify-content-center">
                        <div style={{ marginLeft: '5px' }} className="noti-text">
                          <b>
                            {formatDate(obj.date)}
                          </b>
                        </div>
                      </div>

                    </td>
                    {obj.assigned ? (
                      obj.assigned === "Reject" ? (
                        <td id="colorRed">{obj.assigned}</td>
                      ) : (
                        <td>{obj.assigned}</td>
                      )
                    ) : <td></td>}
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
              </tbody>)}
          </table>
        </div>
      </div>

    </div>
  )
}

export default EmployeeDeleteBookingComponent