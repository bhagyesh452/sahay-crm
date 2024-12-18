import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import Avatar from '@mui/material/Avatar';
import { IoChatbubblesOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import profile from "../static/avatars/013f.jpg"
import { LuSend } from "react-icons/lu";
import moment from "moment";


function Chat({ name, id, designation, profilePhoto, showChatBox, setShowChatBox, socket, messages, setMessages, bookingData, setBookingData, projectionData, setProjectionData, combinedMessages }) {

    // console.log("Booking data :", bookingData);
    // console.log("Projection data :", projectionData);
    // console.log("All messages are :", combinedMessages);

    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const [message, setMessage] = useState("");
    const [activeTab, setActiveTab] = useState("chats");
    const [employees, setEmployees] = useState([]);
    const [sideNavWidth, setSideNavWidth] = useState(0);
    const messagesEndRef = useRef(null); // Reference for the last message

    // Toggle function for open and close
    const toggleNav = () => {
        setSideNavWidth((prevWidth) => (prevWidth === 0 ? 500 : 0));
    };

    const fetchEmployees = async () => {
        try {
            const res = await axios.get(`${secretKey}/employee/einfo`);
            const data = res.data
                .filter((emp) => emp.newDesignation === "Business Development Executive" || emp.newDesignation === "Business Development Manager" || emp.newDesignation === "Floor Manager")
                .map((emp) => {
                    return {
                        id: emp._id,
                        name: emp.ename,
                        designation: emp.newDesignation,
                        profilePhoto: emp?.profilePhoto[0]?.filename,
                        active: emp.Active
                    };
                });
            console.log("Fetched employees are :", data);
            setEmployees(data);
        } catch (error) {
            console.log("Error fetching employees data :", error);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        const handleBookingData = (data) => {
            const filteredBookings = data.filter((item) => item.bookingBdeName); // Include only if bookingBdeName exists
            setBookingData((prevBookingData) => {
                const existingEntries = new Set(prevBookingData.map((item) => item.time));
                const newEntries = filteredBookings.filter((item) => !existingEntries.has(item.time));
                return [...prevBookingData, ...newEntries];
            });
        };

        const handleProjectionData = (data) => {
            const filteredProjections = data.filter((item) => item.projectionBdeName); // Include only if projectionBdeName exists
            setProjectionData((prevProjectionData) => {
                const existingEntries = new Set(prevProjectionData.map((item) => item.time));
                const newEntries = filteredProjections.filter((item) => !existingEntries.has(item.time));
                return [...prevProjectionData, ...newEntries];
            });
        };

        socket.on("more-bookings-received", handleBookingData);
        socket.on("booking-received", handleBookingData);
        socket.on("add-projection", handleProjectionData);

        return () => {
            socket.off("more-bookings-received", handleBookingData);
            socket.off("booking-received", handleBookingData);
            socket.off("add-projection", handleProjectionData);
        };
    }, [socket]);

    const getStatusIndicator = (userName) => {
        const matchedEmployee = employees.find((emp) => emp.name === userName);
        if (matchedEmployee) {
            return matchedEmployee.active.includes("GMT") ? (
                <div className="off"></div>
            ) : (
                <div className="on"></div>
            );
        }
        return null; // Return null if no match
    };

    const getProfileImage = (userName) => {
        const matchedEmployee = employees.find((emp) => emp.name === userName);
        if (matchedEmployee) {
            const id = matchedEmployee.id;
            const profilePhoto = matchedEmployee.profilePhoto;
            return (
                <img src={`${secretKey}/employee/fetchProfilePhoto/${id}/${encodeURIComponent(profilePhoto)}`}></img>
            )
        }
        return null; // Return null if no match
    };

    const getDesignation = (userName) => {
        const matchedEmployee = employees.find((emp) => emp.name === userName);
        if (matchedEmployee) {
            return (
                <label className="m-0">{matchedEmployee.designation}</label>
            );
        }
        return null; // Return null if no match
    };

    // Scroll to the latest message
    useEffect(() => {
        if (showChatBox && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [showChatBox]);

    const handleSend = (e) => {
        e.preventDefault();
        if (message.trim() && socket) {
            const msg = {
                text: message,
                sentByMe: true,
                userName: name,
                employeeId: id,
                profilePhoto, // Include profile photo
                designation, // Include designation
                time: new Date().toLocaleTimeString(),
            };
            setMessages((prevMessages) => [...prevMessages, msg]);
            socket.emit("message", msg);
            setMessage(""); // Reset input field
        }
    };

    useEffect(() => {
        if (socket && showChatBox) {
            socket.on("connect", () => {
                console.log(`User connected with id: ${socket.id}`);
            });

            return () => {
                console.log("Chat box closed");
            };
        }
    }, [socket, showChatBox]);

    return (
        // <div className={`chat-drawer ${showChatBox ? "open" : ""}`} style={{display:'none'}}>
        //     <div className="chat-header">
        //         <div className="chat-header-left">
        //             <span
        //                 className={`chat-link ${activeTab === "chats" ? "active" : ""}`}
        //                 onClick={() => setActiveTab("chats")}
        //             >
        //                 Chats
        //             </span>
        //             <span
        //                 className={`notifications-link ${activeTab === "notifications" ? "active" : ""}`}
        //                 onClick={() => setActiveTab("notifications")}
        //             >
        //                 Notifications
        //             </span>
        //         </div>
        //         <div>
        //             <IoMdClose
        //                 style={{ color: "white", fontSize: "30px", cursor: "pointer" }}
        //                 onClick={() => setShowChatBox(false)}
        //             />
        //         </div>
        //     </div>

        //     {/* {activeTab === "chats" && (
        //         <>
        //             <div className="messages-container">
        //                 {messages.map((msg, index) => {
        //                     return (
        //                         <>
        //                             <div key={index} className={`message-box ${msg.sentByMe ? "sender" : "receiver"}`}>
        //                                 <div className="message-header">
        //                                     {msg.employeeId && msg.profilePhoto ? (
        //                                         <>
        //                                             <Avatar
        //                                                 src={`${secretKey}/employee/fetchProfilePhoto/${msg.employeeId}/${encodeURIComponent(msg.profilePhoto)}`}
        //                                                 className="My-Avtar"
        //                                                 style={{ width: 36, height: 36 }}
        //                                             />
        //                                             {getStatusIndicator(msg.userName)}
        //                                         </>
        //                                     ) : (
        //                                         <>
        //                                             <Avatar className="My-Avtar" sx={{ width: 36, height: 36 }} />
        //                                             {getStatusIndicator(msg.userName)}
        //                                         </>
        //                                     )}
        //                                     <strong className="username">
        //                                         {msg.sentByMe ? "You" : msg.userName}
        //                                     </strong>
        //                                     <span>({msg.designation})</span>
        //                                 </div>

        //                                 <p>{msg.text}</p>

        //                                 <span className="message-time">{msg.time}</span>
        //                             </div>
        //                         </>
        //                     )
        //                 })}
        //                 <div ref={messagesEndRef} />
        //             </div>

        //             <div className="chat-footer">
        //                 <input
        //                     autoFocus
        //                     type="text"
        //                     placeholder="Type your message..."
        //                     value={message}
        //                     onChange={(e) => setMessage(e.target.value)}
        //                 />
        //                 <button onClick={handleSend}>Send</button>
        //             </div>
        //         </>
        //     )} */}

        //     {activeTab === "chats" && (
        //         <div>
        //             <div className="messages-container">
        //                 {messages.map((msg, index) => {
        //                     return (
        //                         <>
        //                             <div className={`message-header ${msg.sentByMe ? "sender-details" : "receiver-details"}`}>
        //                                 {msg.employeeId && msg.profilePhoto ? (
        //                                     <>
        //                                         <Avatar
        //                                             src={`${secretKey}/employee/fetchProfilePhoto/${msg.employeeId}/${encodeURIComponent(msg.profilePhoto)}`}
        //                                             className="My-Avtar"
        //                                             style={{ width: 36, height: 36 }}
        //                                         />
        //                                         {getStatusIndicator(msg.userName)}
        //                                     </>
        //                                 ) : (
        //                                     <>
        //                                         <Avatar className="My-Avtar" sx={{ width: 36, height: 36 }} />
        //                                         {getStatusIndicator(msg.userName)}
        //                                     </>
        //                                 )}
        //                                 <strong className="username">
        //                                     {msg.sentByMe ? "You" : msg.userName}
        //                                 </strong>
        //                             </div>

        //                             <div className={`designation-time ${msg.sentByMe ? "sender-details" : "receiver-details"}`}>
        //                                 <span className="designation">{msg.designation}</span>
        //                                 <span className="message-time">{msg.time}</span>
        //                             </div>

        //                             <div key={index} className={`message-box ${msg.sentByMe ? "sender" : "receiver"}`}>
        //                                 <p>{msg.text}</p>
        //                             </div>
        //                         </>
        //                     )
        //                 })}
        //                 <div ref={messagesEndRef} />
        //             </div>

        //             <div className="chat-footer">
        //                 <textarea
        //                     autoFocus
        //                     rows={1}
        //                     placeholder="Type your message..."
        //                     value={message}
        //                     onChange={(e) => setMessage(e.target.value)}
        //                 />
        //                 <button onClick={handleSend}>Send</button>
        //             </div>
        //         </div>
        //     )}

        //     {activeTab === "notifications" && (
        //         <div>
        //             <h1>Notifications</h1>
        //             <p>Here you can see all your notifications.</p>
        //         </div>
        //     )}
        // </div>


        <div>
            {/* Sidebar */}
            <div
                className="Chat_sidenav"
                style={{ width: `${sideNavWidth}px` }}
            >
                <div className="Chatbutton" onClick={toggleNav}>
                    <IoChatbubblesOutline />
                </div>
                <div className="Chat-sideinner">
                    <div className="Chat-sideinner-head">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                Notifications
                            </div>
                            <div style={{ lineHeight: '10px', cursor: 'pointer' }}>
                                <RxCross1 onClick={toggleNav} />
                            </div>
                        </div>
                    </div>

                    <div className="Chat-sideinner-body">
                        <ul class="nav nav-tabs cmpnyP_nav_tabs" id="chat_notfctn" role="tablist">

                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="Chat-tab" data-bs-toggle="tab" data-bs-target="#Chat" type="button" role="tab" aria-controls="Chat" aria-selected="true">
                                    <div className="d-flex align-items-center">
                                        <div>
                                            Chats
                                        </div>
                                        <div className="notfctn_no">
                                            10
                                        </div>
                                    </div>
                                </button>
                            </li>

                            <li class="nav-item d-none" role="presentation">
                                <button class="nav-link" id="notfctn-tab" data-bs-toggle="tab" data-bs-target="#notfctn" type="button" role="tab" aria-controls="notfctn" aria-selected="false">
                                    <div className="d-flex align-items-center">
                                        <div>
                                            Notifications
                                        </div>
                                        <div className="notfctn_no">
                                            5
                                        </div>
                                    </div>
                                </button>
                            </li>
                        </ul>
                        <div class="tab-content cmpnyP_tab_content" id="chat_notfctnContent">
                            <div class="tab-pane fade show active" id="Chat" role="tabpanel" aria-labelledby="Chat-tab">
                                <div className="side-chat-screen">

                                    {combinedMessages.map((msg, index) => (
                                        <div key={index} className="d-flex align-items-start chat-item">
                                            <div className="chat-profile-icon">
                                                {msg.bookingBdeName && <>
                                                    {getProfileImage(msg.bookingBdeName)}
                                                    {/* {getStatusIndicator(msg.bookingBdeName)} */}
                                                </>}

                                                {msg.projectionBdeName && <>
                                                    {getProfileImage(msg.projectionBdeName)}
                                                    {/* {getStatusIndicator(msg.projectionBdeName)} */}
                                                </>}

                                                {msg.text && <>
                                                    <img src={`${secretKey}/employee/fetchProfilePhoto/${msg.employeeId}/${encodeURIComponent(msg.profilePhoto)}`}></img>
                                                    {/* {getStatusIndicator(msg.userName)} */}
                                                </>}
                                                <div className="on"></div>
                                            </div>

                                            {msg.text ? <div className="chat-details">
                                                <div className="chat-details-head d-flex align-items-start justify-content-between">
                                                    <div className="chat-details-head-name">
                                                        <p className="m-0"><b>{msg.userName}</b></p>
                                                        <label className="m-0">{msg.designation}</label>
                                                    </div>
                                                    <div className="chat-details-head-time">
                                                        {msg.time}
                                                    </div>
                                                </div>
                                                <div className="chat-details-body">
                                                    <p>
                                                        {msg.text}
                                                    </p>
                                                </div>
                                            </div> : null}

                                            {msg.bookingBdeName ? <div className="chat-details">
                                                <div className="chat-details-head d-flex align-items-start justify-content-between">
                                                    <div className="chat-details-head-name">
                                                        <p className="m-0"><b>{msg.bookingBdeName}</b> added booking</p>
                                                        {getDesignation(msg.bookingBdeName)}
                                                    </div>
                                                    <div className="chat-details-head-time">
                                                        {msg.time}
                                                    </div>
                                                </div>
                                                <div className="chat-details-body">
                                                    <p>
                                                        Booking Received<br /><br />
                                                        BDE Name:- {msg.bookingBdeName}<br />
                                                        Close By:- {msg.closeBy}<br />
                                                        Booking Date:- {moment(msg.bookingDate).format('DD-MM-YYYY')}<br />
                                                        Service:- {msg.services?.join(", ")}<br />
                                                    </p>
                                                </div>
                                            </div> : null}

                                            {msg.projectionBdeName ? <div className="chat-details">
                                                <div className="chat-details-head d-flex align-items-start justify-content-between">
                                                    <div className="chat-details-head-name">
                                                        <p className="m-0"><b>{msg.projectionBdeName}</b> Add Projections</p>
                                                        {getDesignation(msg.projectionBdeName)}
                                                    </div>
                                                    <div className="chat-details-head-time">
                                                        {msg.time}
                                                    </div>
                                                </div>
                                                <div className="chat-details-body">
                                                    <p>
                                                        Today's Projection: {msg.projectionAmount}/-
                                                    </p>
                                                </div>
                                            </div> : null}
                                        </div>
                                    ))}

                                    {/* {messages.map((msg, index) => (
                                        <div key={index} className="d-flex align-items-start chat-item">
                                            <div className="chat-profile-icon">
                                                <img src={`${secretKey}/employee/fetchProfilePhoto/${msg.employeeId}/${encodeURIComponent(msg.profilePhoto)}`}></img>
                                                {getStatusIndicator(msg.userName)}
                                            </div>
                                            <div className="chat-details">
                                                <div className="chat-details-head d-flex align-items-start justify-content-between">
                                                    <div className="chat-details-head-name">
                                                        <p className="m-0"><b>{msg.userName}</b></p>
                                                        <label className="m-0">{msg.designation}</label>
                                                    </div>
                                                    <div className="chat-details-head-time">
                                                        {msg.time}
                                                    </div>
                                                </div>
                                                <div className="chat-details-body">
                                                    <p>
                                                        {msg.text}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {bookingData?.map((booking, index) => (
                                        <div key={index} className="d-flex align-items-start chat-item">
                                            <div className="chat-profile-icon">
                                                {getProfileImage(booking.bdeName)}
                                                {getStatusIndicator(booking.bdeName)}
                                            </div>
                                            <div className="chat-details">
                                                <div className="chat-details-head d-flex align-items-start justify-content-between">
                                                    <div className="chat-details-head-name">
                                                        <p className="m-0"><b>{booking.bdeName}</b> added booking</p>
                                                        {getDesignation(booking.bdeName)}
                                                    </div>
                                                    <div className="chat-details-head-time">
                                                        {booking.time}
                                                    </div>
                                                </div>
                                                <div className="chat-details-body">
                                                    <p>
                                                        Booking Received<br /><br />
                                                        BDE Name:- {booking.bdeName}<br />
                                                        Close By:- {booking.closeBy}<br />
                                                        Booking Date:- {moment(booking.bookingDate).format('DD-MM-YYYY')}<br />
                                                        Service:- {booking.services?.join(", ")}<br />
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {projectionData?.map((projection, index) => (
                                        <div key={index} className="d-flex align-items-start chat-item">
                                            <div className="chat-profile-icon">
                                                {getProfileImage(projection.bdeName)}
                                                {getStatusIndicator(projection.bdeName)}
                                            </div>
                                            <div className="chat-details">
                                                <div className="chat-details-head d-flex align-items-start justify-content-between">
                                                    <div className="chat-details-head-name">
                                                        <p className="m-0"><b>{projection.bdeName}</b> Add Projections</p>
                                                        {getDesignation(projection.bdeName)}
                                                    </div>
                                                    <div className="chat-details-head-time">
                                                        {projection.time}
                                                    </div>
                                                </div>
                                                <div className="chat-details-body">
                                                    <p>
                                                        Today's Projection: {projection.projectionAmount}/-
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))} */}

                                    <div className="d-flex align-items-start chat-item">
                                        <div className="chat-profile-icon">
                                            <img src={profile}></img>
                                            <div className="on"></div>
                                        </div>
                                        <div className="chat-details">
                                            <div className="chat-details-head d-flex align-items-start justify-content-between">
                                                <div className="chat-details-head-name">
                                                    <p className="m-0"><b>Shivangi Agrawal</b> added booking</p>
                                                    <label className="m-0">Team Lead (IT)</label>
                                                </div>
                                                <div className="chat-details-head-time">
                                                    2 min ago
                                                </div>
                                            </div>
                                            <div className="chat-details-body">
                                                <p>
                                                    Booking Received<br /><br />
                                                    BDE Name:- Bhratesh Darware<br />
                                                    Close By:- Yashesh Gajjar<br />
                                                    Booking Date:- 16-12-2024<br />
                                                    Service:- Seed Funding Support<br />
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-start chat-item">
                                        <div className="chat-profile-icon">
                                            <img src={profile}></img>
                                            <div className="on"></div>
                                        </div>
                                        <div className="chat-details">
                                            <div className="chat-details-head d-flex align-items-start justify-content-between">
                                                <div className="chat-details-head-name">
                                                    <p className="m-0"><b>Shivangi Agrawal</b> Add Projections</p>
                                                    <label className="m-0">Team Lead (IT)</label>
                                                </div>
                                                <div className="chat-details-head-time">
                                                    2 min ago
                                                </div>
                                            </div>
                                            <div className="chat-details-body">
                                                <p>
                                                    Today's Projection: 0/-
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div ref={messagesEndRef} />
                            </div>
                            <div class="tab-pane fade" id="notfctn" role="tabpanel" aria-labelledby="notfctn-tab">...</div>
                        </div>
                    </div>

                    {designation === "Managing Director" && <div className="Chat-sideinner-footer">
                        <div className="d-flex">
                            <div className="chattextbox">
                                <input type="text" placeholder="Type Your Message" value={message}
                                    onChange={(e) => setMessage(e.target.value)} />
                            </div>
                            <div className="chatsendbtn" onClick={handleSend}>
                                <button><LuSend /></button>
                            </div>
                        </div>
                    </div>}
                </div>

            </div>
        </div>
    );
}

export default Chat;