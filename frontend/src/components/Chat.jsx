import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import Avatar from '@mui/material/Avatar';

function Chat({ name, id, designation, profilePhoto, showChatBox, setShowChatBox, socket, messages, setMessages }) {

    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const [message, setMessage] = useState("");
    const [activeTab, setActiveTab] = useState("chats");
    const [employees, setEmployees] = useState([]);
    const messagesEndRef = useRef(null); // Reference for the last message

    const fetchEmployees = async () => {
        try {
            const res = await axios.get(`${secretKey}/employee/einfo`);
            const data = res.data
                .filter((emp) => emp.newDesignation === "Business Development Executive" || emp.newDesignation === "Business Development Manager" || emp.newDesignation === "Floor Manager")
                .map((emp) => {
                    return {
                        name: emp.ename,
                        active: emp.Active
                    };
                });
            // console.log("Fetched employees are :", data);
            setEmployees(data);
        } catch (error) {
            console.log("Error fetching employees data :", error);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const getStatusIndicator = (userName) => {
        const matchedEmployee = employees.find((emp) => emp.name === userName);
        if (matchedEmployee) {
            return matchedEmployee.active.includes("GMT") ? (
                <div className="offline"></div>
            ) : (
                <div className="online"></div>
            );
        }
        return null; // Return null if no match
    };

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
                time: new Date().toLocaleTimeString()
            };
            setMessages((prevMessages) => [...prevMessages, msg]);
            socket.emit("message", {
                text: message,
                userName: name,
                employeeId: id,
                profilePhoto, // Send to backend
                designation, // Send to backend
                time: new Date().toLocaleTimeString()
            });
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

    // Scroll to the latest message
    useEffect(() => {
        if (showChatBox && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, showChatBox]);

    return (
        <div className={`chat-drawer ${showChatBox ? "open" : ""}`}>
            <div className="chat-header">
                <div className="chat-header-left">
                    <span
                        className={`chat-link ${activeTab === "chats" ? "active" : ""}`}
                        onClick={() => setActiveTab("chats")}
                    >
                        Chats
                    </span>
                    <span
                        className={`notifications-link ${activeTab === "notifications" ? "active" : ""}`}
                        onClick={() => setActiveTab("notifications")}
                    >
                        Notifications
                    </span>
                </div>
                <div>
                    <IoMdClose
                        style={{ color: "white", fontSize: "30px", cursor: "pointer" }}
                        onClick={() => setShowChatBox(false)}
                    />
                </div>
            </div>

            {/* {activeTab === "chats" && (
                <>
                    <div className="messages-container">
                        {messages.map((msg, index) => {
                            return (
                                <>
                                    <div key={index} className={`message-box ${msg.sentByMe ? "sender" : "receiver"}`}>
                                        <div className="message-header">
                                            {msg.employeeId && msg.profilePhoto ? (
                                                <>
                                                    <Avatar
                                                        src={`${secretKey}/employee/fetchProfilePhoto/${msg.employeeId}/${encodeURIComponent(msg.profilePhoto)}`}
                                                        className="My-Avtar"
                                                        style={{ width: 36, height: 36 }}
                                                    />
                                                    {getStatusIndicator(msg.userName)}
                                                </>
                                            ) : (
                                                <>
                                                    <Avatar className="My-Avtar" sx={{ width: 36, height: 36 }} />
                                                    {getStatusIndicator(msg.userName)}
                                                </>
                                            )}
                                            <strong className="username">
                                                {msg.sentByMe ? "You" : msg.userName}
                                            </strong>
                                            <span>({msg.designation})</span>
                                        </div>

                                        <p>{msg.text}</p>

                                        <span className="message-time">{msg.time}</span>
                                    </div>
                                </>
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-footer">
                        <input
                            autoFocus
                            type="text"
                            placeholder="Type your message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button onClick={handleSend}>Send</button>
                    </div>
                </>
            )} */}

            {activeTab === "chats" && (
                <>
                    <div className="messages-container">
                        {messages.map((msg, index) => {
                            console.log("Socket id is :", socket.id);
                            return (
                                <>
                                    <div className={`message-header ${msg.sentByMe ? "sender-details" : "receiver-details"}`}>
                                        {msg.employeeId && msg.profilePhoto ? (
                                            <>
                                                <Avatar
                                                    src={`${secretKey}/employee/fetchProfilePhoto/${msg.employeeId}/${encodeURIComponent(msg.profilePhoto)}`}
                                                    className="My-Avtar"
                                                    style={{ width: 36, height: 36 }}
                                                />
                                                {getStatusIndicator(msg.userName)}
                                            </>
                                        ) : (
                                            <>
                                                <Avatar className="My-Avtar" sx={{ width: 36, height: 36 }} />
                                                {getStatusIndicator(msg.userName)}
                                            </>
                                        )}
                                        <strong className="username">
                                            {msg.sentByMe ? "You" : msg.userName}
                                        </strong>
                                    </div>

                                    <div className={`designation-time ${msg.sentByMe ? "sender-details" : "receiver-details"}`}>
                                        <span className="designation">{msg.designation}</span>
                                        <span className="message-time">{msg.time}</span>
                                    </div>

                                    <div key={index} className={`message-box ${msg.sentByMe ? "sender" : "receiver"}`}>
                                        <p>{msg.text}</p>
                                    </div>
                                </>
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-footer">
                        <textarea
                            autoFocus
                            rows={1}
                            placeholder="Type your message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button onClick={handleSend}>Send</button>
                    </div>
                </>
            )}

            {activeTab === "notifications" && (
                <div>
                    <h1>Notifications</h1>
                    <p>Here you can see all your notifications.</p>
                </div>
            )}
        </div>
    );
}

export default Chat;