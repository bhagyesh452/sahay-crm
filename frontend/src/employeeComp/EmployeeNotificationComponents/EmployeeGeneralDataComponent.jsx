import React, { useEffect, useState } from 'react';
import { MdDateRange } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import { RxAvatar } from "react-icons/rx";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FcOpenedFolder } from "react-icons/fc";
import Swal from "sweetalert2";
import axios from "axios";
import io from "socket.io-client";
import Nodata from "../../components/Nodata";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";


function EmployeeGeneralDataComponent({ ename }) {
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [requestData, setRequestData] = useState([]);
  const [search_requestData, setSearch_requestData] = useState([]);
  const [searchText, setSearchText] = useState("")



  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const fetchRequestGDetails = async () => {
    try {
      const response = await axios.get(`${secretKey}/requests/requestgdata/${ename}`)
      const data = response.data.reverse()
      console.log(response.data)
      setRequestData(data)

    } catch (error) {
      console.log("Error fetching request data", error.messgae)
    }
  }

  useEffect(() => {
    const socket = secretKey === "http://localhost:3001/api" ? io("http://localhost:3001") : io("wss://startupsahay.in", {
      secure: true, // Use HTTPS
      path:'/socket.io',
      reconnection: true, 
      transports: ['websocket'],
    });
    
    socket.on("data-sent", () => {
      fetchRequestGDetails()
      });

    socket.on("delete-leads-request-bde" , ()=>{
      fetchRequestGDetails()
    });
   
    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);


  useEffect(() => {
    fetchRequestGDetails()

  }, [])
























  return (
    <div className="my-card mt-2">
      <div className="my-card-head p-2">
        <div className="filter-area d-flex justify-content-between w-100">
          {/* <div className="filter-by-bde d-flex align-items-center">
            <div className='mr-2'>
              <label htmlFor="search_bde ">BDE : </label>
            </div>
            <div className='GeneralNoti-Filter'>
                    <input value={searchText} onChange={(e) => setSearchText(e.target.value)} type="text" name="search_bde" id="search_bde" className='form-control col-sm-8' placeholder='Please Enter BDE name' />
                </div>
          </div> */}
          {/* <div className="filter-by-date d-flex align-items-center">
            <div className='mr-2'>
              <label htmlFor="search_bde "> Filter By : </label>
            </div>
            <div className='GeneralNoti-Filter'>
                    <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)} name="filter_requests" id="filter_requests" className="form-select">
                        <option value="Pending" selected>Pending</option>
                        <option value="Completed" >Completed</option>
                    </select>
                </div>
          </div> */}
        </div>
      </div>
      <div className='my-card-body p-2'>
        <div className='Notification-table-main table-resposive'>
          <table className="table General-table m-0">
            <thead>
              <tr>
                <th>Sr. No</th>
                <th>Requested Data</th>
                <th>Requested On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requestData.length !== 0 ?
                requestData.map((obj, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td>
                      <div className="Notification-date d-flex align-items-center justify-content-center">
                        
                        <div style={{ marginLeft: '5px' }} className="noti-text">
                          <b>
                            {obj.dAmount}
                          </b>
                        </div>
                      </div>
                    </td>
                    <td><div className="Notification-date d-flex align-items-center justify-content-center">
                      <MdDateRange style={{ fontSize: '16px' }} />
                      <div style={{ marginLeft: '5px' }} className="noti-text">
                        <b>
                          {formatDate(obj.cDate)}
                        </b>
                      </div>
                    </div></td>
                    <td>
                      <div>
                        {!obj.assigned && <div className="Notification-folder-open">
                          Pending
                        </div>}
                      </div>
                      {obj.assigned && <div className='d-flex align-items-center justify-content-center'>
                        <div className="Notification_completedbtn">
                          Accepted
                        </div>
                      </div>}
                      </td>
                  </tr>
                ))
                : <tr>
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

    </div>
  )
}

export default EmployeeGeneralDataComponent