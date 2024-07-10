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


function DeleteBookingComponent() {
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [deletedData, setDeletedData] = useState([]);
  const [filterBy, setFilterBy] = useState("Pending");
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState(deletedData.filter((obj) => obj.request === false));
  const [totalData, setTotalData] = useState(deletedData.filter((obj) => obj.request === false));
  const fetchDataDelete = async () => {
    try {
      const response = await axios.get(`${secretKey}/requests/deleterequestbybde`);
      const tempData = response.data.reverse();
      setDeletedData(tempData); // Assuming your data is returned as an array
      setData(filterBy === "Pending" ? tempData.filter(obj => obj.request === false) : tempData.filter(obj => obj.request === true));
      setTotalData(filterBy === "Pending" ? tempData.filter(obj => obj.request === false) : tempData.filter(obj => obj.request === true));

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }


  // ------------------------------------------   Fetching Functions --------------------------------------------------



  useEffect(() => {
    fetchDataDelete()
  }, [])
  
  useEffect(() => {
    const socket = secretKey === "http://localhost:3001/api" ? io("http://localhost:3001") : io("wss://startupsahay.in", {
      secure: true, // Use HTTPS
      path:'/socket.io',
      reconnection: true, 
      transports: ['websocket'],
    });


    socket.on("delete-booking-requested", () => {
      console.log("One delete request came")
      fetchDataDelete(); // Same condition
    });

    return () => {
      socket.disconnect();
    };
  }, []);


  useEffect(() => {
    setData(filterBy === "Pending" ? deletedData.filter(obj => obj.request === false) : deletedData.filter(obj => obj.request === true));
    setTotalData(filterBy === "Pending" ? deletedData.filter(obj => obj.request === false) : deletedData.filter(obj => obj.request === true));
  }, [filterBy])

  useEffect(() => {
    if (searchText !== "") {
      setData(totalData.filter(obj => obj.ename.toLowerCase().includes(searchText.toLowerCase())));
    } else {
      setData(totalData)
    }
  }, [searchText])

  const handleAcceptDeleteRequest = async (Id, bookingIndex) => {
    // Assuming you have an API endpoint for deleting a company
    try {
      const response = await fetch(
        `${secretKey}/bookings/redesigned-delete-all-booking/${Id}/${bookingIndex}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire({
        title: "Booking Deleted Successfully",
        icon: "success",
      });
      fetchDataDelete();

    } catch (error) {
      Swal.fire({
        title: "Error Deleting the booking!",
        icon: "error",
      });
      console.error("Error deleting booking:", error);
      fetchDataDelete();
      // Optionally, you can show an error message to the user
    }
  };

  const handleDeleteRequest = async (Id) => {
    try {
      const response = await axios.post(
        `${secretKey}/requests/deleterequestbybde/${Id}`
      );
      console.log("Deleted company:", response.data);
      Swal.fire({ title: "Request Rejected", icon: "success" });
      fetchDataDelete();

      // Handle success or update state as needed
    } catch (error) {
      console.error("Error deleting company:", error);
      // Handle error
    }
  };



  return (
    <div className="my-card mt-2">
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
          <div className="filter-by-date d-flex align-items-center">
            <div className='mr-2'>
              <label htmlFor="search_bde "> Filter By : </label>
            </div>
            <div className='Notification_filter'>
              <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)} style={{ border: "1px solid #ffc8c8 " }} name="filter_requests" id="filter_requests" className="form-select">
                <option value="Pending" selected>Pending</option>
                <option value="Completed" >Completed</option>
              </select>
            </div>
          </div>

        </div>
      </div>
      <div className='my-card-body p-2'>
        <div className='Notification-table-main table-resposive'>
          <table className="table Notification-table m-0">
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
              {data.length !== 0 ? data.map((obj, index) => (
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
                      <div className="Notification_acceptbtn" onClick={() => handleAcceptDeleteRequest(obj.companyID, obj.bookingIndex)}>
                        <TiTick />
                      </div>
                      <div className="Notification_rejectbtn" onClick={() => handleDeleteRequest(obj._id)}>
                        <ImCross />
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

    </div>
  )
}

export default DeleteBookingComponent