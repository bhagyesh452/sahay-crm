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
import ClipLoader from "react-spinners/ClipLoader";
import '../../assets/styles.css'

function EmployeeBookingEditCopmonent({ ename }) {
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [editableBookingData, setEditableBookingData] = useState([])
  const [currentDataLoading, setCurrentDataLoading] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [filterEditableBookingData, setFilterEditableBookingData] = useState([])
  const [editableCompanyData, setEditableCompanyData] = useState([])



  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const fetchEditRequests = async () => {
    try {
      setCurrentDataLoading(true)
      const response = await axios.get(`${secretKey}/bookings/editable-LeadData/${ename}`);
      const tempData = response.data;
      setEditableBookingData(tempData)
      setFilterEditableBookingData(tempData)
      setEditableCompanyData(tempData)

    } catch (error) {
      console.log("Error fetching data", error.message)
    } finally {
      setCurrentDataLoading(false)
    }
  }

  useEffect(() => {
    if (ename) {
      fetchEditRequests();
    }
  }, [ename])

  useEffect(() => {
    const socket = secretKey === "http://localhost:3001/api" ? io("http://localhost:3001") : io("wss://startupsahay.in", {
      secure: true, // Use HTTPS
      path: '/socket.io',
      reconnection: true,
      transports: ['websocket'],
    });
    socket.on("booking-updated", () => {
      fetchEditRequests();
    });
    socket.on("bookingbooking-edit-request-delete", () => {
      fetchEditRequests();
    })

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (searchText) {
      console.log(searchText)
      const filteredData = filterEditableBookingData.filter(obj => {
        console.log(obj["Company Name"]); // Log the company name
        return obj["Company Name"]?.toLowerCase().includes(searchText.toLowerCase());
      });
      setEditableBookingData(filteredData);
    } else {
      setEditableBookingData(editableCompanyData);
    }
  }, [searchText]);
  

  console.log(editableBookingData)



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
        </div>
      </div>
      <div className='my-card-body p-2'>
        <div className='Notification-table-main table-resposive'>
          <table className="table EditRequest-table m-0">
            <thead>
              <tr>
                <th>Sr. No</th>
                <th>Company Name</th>
                <th>Requested On</th>
                <th>Status</th>
              </tr>
            </thead>
            {currentDataLoading ? (<tbody>
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
            </tbody>)
              :
              (<tbody>
                {editableBookingData.length !== 0 ? editableBookingData.map((obj, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td className="text-muted">
                      {obj["Company Name"]}
                    </td>
                    <td className="text-muted">
                      <div className="Notification-date d-flex align-items-center justify-content-center">

                        <MdDateRange style={{ fontSize: '16px' }} />

                        <div style={{ marginLeft: '5px' }} className="noti-text">
                          <b>
                            {formatDate(obj.requestDate)}
                          </b>
                        </div>
                      </div>
                    </td>
                    <td className="text-muted">
                      {obj.assigned && obj.assigned === "Reject" ? (
                        <div className="Notification-date d-flex align-items-center justify-content-center">
                          <div style={{ marginLeft: '5px' }} >
                            <b id="colorRed">
                              {obj.assigned}
                            </b>
                          </div>
                        </div>
                      ) : (
                        <div className="Notification-date d-flex align-items-center justify-content-center">
                          <div style={{ marginLeft: '5px' }} className="noti-text">
                            <b>
                              {obj.assigned}
                            </b>
                          </div>
                        </div>
                      )}
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
              </tbody>)}
          </table>
        </div>
      </div>

    </div>
  )
}

export default EmployeeBookingEditCopmonent