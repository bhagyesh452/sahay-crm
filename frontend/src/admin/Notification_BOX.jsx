import React, { useState, useEffect, useRef } from 'react';
import { CiBellOn } from "react-icons/ci";
import axios from 'axios'
import io from 'socket.io-client';
import dummyImg from "../static/EmployeeImg/office-man.png";
import { useNavigate } from 'react-router-dom';
import No_noti_image from "../assets/media/no_noti_image.jpg"

function Notification_BOX({ isDM }) {
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [showNotifications, setShowNotifications] = useState(false);
  const [total_notifications, setTotal_notifications] = useState([])
  const [total_notiCount, setTotal_notiCount] = useState(0);
  const navigate = useNavigate();
  const link = isDM ? "/datamanager/notification" : "/admin/notification"
  const notificationRef = useRef(null);


  //  ----------------------------------------  Functions -------------------------------------------

  const handleClickOutside = (event) => {
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setShowNotifications(false);
    }
  };


  const handleClick = async (state, index, id) => {

    navigate(link, { state: { dataStatus: state } });

    // Ensure that DOM manipulation happens after navigation
    setTimeout(() => {
      const element = document.getElementById(`${index}_card`);
      console.log(element)
      if (element) {
        element.classList.remove('unread');
      }
    }, 0);

    try {
      await axios.put(`${secretKey}/requests/update-notification/${id}`);
    } catch (err) {
      console.error("Error updating notification status", err);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return "Just Now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} min ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} d ago`;
    }
  }

  // --------------------------------------  Fetch functions --------------------------------------------



  const fetchNotification = async () => {
    try {
      const response = await axios.get(`${secretKey}/requests/get-notification`);
      setTotal_notifications(response.data.topUnreadNotifications);
      setTotal_notiCount(response.data.totalUnreadCount);

    } catch (err) {
      console.log("Error Fetching Notifications :-", err)
    }
  }
  // ------------------------------------  Socket IO Requests ----------------------------------------------------------------
  useEffect(() => {
    const socket = secretKey === "http://localhost:3001/api" ? io("http://localhost:3001") : io("wss://startupsahay.in", {
      secure: true, // Use HTTPS
      path: '/socket.io',
      reconnection: true,
      transports: ['websocket'],
    });

    socket.on("delete-booking-requested", (res) => {
      fetchNotification()
    });
    socket.on("newRequest", (res) => {
      fetchNotification()
    });
    socket.on("editBooking_requested", (res) => {
      fetchNotification()
    });
    socket.on("approve-request", (res) => {
      fetchNotification();
    });
    socket.on("bookingbooking-edit-request-delete" , (res)=>{
      fetchNotification();
    })

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);


  useEffect(() => {
    fetchNotification();
  }, [])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);




  return (
    <div className='position-relative'>
      <div onClick={toggleNotifications} onBlur={() => setShowNotifications(false)} className="notification-icon_final">
        <CiBellOn />
      </div>
      {total_notiCount > 0 && <div className='noti-badge'>
        {total_notiCount > 5 ? "5+" : total_notiCount}
      </div>}
      {showNotifications && (
        <div ref={notificationRef} className="notifications_final">
          <ul className='p-0'>
            <li className='noti-item-head'>
              <h4 className='m-0'>Notification</h4>
              <div className='unread-bdge'>{total_notiCount} Unread</div>
            </li>
            {
              total_notifications.length !== 0 ? total_notifications.map((obj, index) => (
                <li id={`${index}_card`} onClick={() =>
                  handleClick(
                    obj.requestType === "Data" ?
                      "General" :
                      obj.requestType === "Data Approve" ?
                        "AddRequest" :
                        obj.requestType === "Booking Edit" ?
                          "editBookingRequests" :
                          obj.requestType === "Data Approve" ?
                            "AddRequest" :
                            "deleteBookingRequests",
                    index,
                    obj._id)}
                  className={obj.status === "Unread" ? 'noti-item unread bdr-btm-eee' : 'noti-item bdr-btm-eee'}>
                  <div className='noti-User-profile'>
                    <img src={obj.img_url !== "no-image" ? `${secretKey}/employee/employeeImg/${obj.ename}/${encodeURIComponent(
                      obj.img_url
                    )}` : dummyImg} alt="noImg" />
                    <div className='noti-designation'>{obj.designation}</div>
                  </div>
                  <div className='noti-data'>
                    <p className='m-0 My_Text_Wrap' title=''><b>{obj.requestType}</b> Request Received from <b>{obj.ename}</b></p>
                    <div className='noti-time mt-1'>
                      {formatDate(obj.requestTime)}
                    </div>
                  </div>
                </li>
              )) : <>
                <div className='d-flex justify-content-center'>
                  <img style={{ maxHeight: "50%", maxWidth: "50%" }} src={No_noti_image} alt="No New Notification..." />
                </div>
              </>
            }
            <li className='noti-item-footer' onClick={() => {
              navigate(link);
            }}>
              See All
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Notification_BOX;
