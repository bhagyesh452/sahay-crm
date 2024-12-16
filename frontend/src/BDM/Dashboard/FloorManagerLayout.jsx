import React, { useEffect, useState, useMemo } from "react";
import { Outlet, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import Header from '../Components/Header/Header.jsx'
import Navbar from '../Components/Navbar/Navbar.jsx';
import Chat from "../../components/Chat.jsx";
import { IoChatboxEllipsesSharp } from "react-icons/io5";

function FloorManagerLayout() {

    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const { userId } = useParams();
    const [data, setData] = useState([]);
    const [showChatBox, setShowChatBox] = useState(false);
    const [messages, setMessages] = useState([]);
    const [hasFetchedMessages, setHasFetchedMessages] = useState(false); // Prevent duplicate fetches
    const [unseenCount, setUnseenCount] = useState(0); // Counter for unseen messages

    // Persistent socket connection
    const socket = useMemo(() => {
        const options = {
            autoConnect: false,
            reconnection: true,
            transports: ["websocket"],
        };

        return secretKey === "http://localhost:3001/api"
            ? io("http://localhost:3001", options)
            : io("wss://startupsahay.in", { ...options, secure: true, path: "/socket.io" });
    }, [secretKey]);

    useEffect(() => {
        // Connect socket on component mount
        socket.connect();

        // Log connection
        socket.on("connect", () => {
            console.log(`Connected with socket ID: ${socket.id}`);
        });

        // Listen for messages
        const handleNewMessages = (msgArray) => {
            setMessages((prevMessages) => {
                const existingIds = new Set(prevMessages.map((msg) => msg.id));
                const newMessages = msgArray.filter((msg) => !existingIds.has(msg.id)); // Avoid duplicates

                // Update unseen count only if the chatbox is closed
                if (!showChatBox && newMessages.length > 0) {
                    setUnseenCount((prevCount) => prevCount + newMessages.length);
                }

                return [...prevMessages, ...newMessages];
            });
        };

        // Attach event listener
        socket.on("send-message-to-every-user", handleNewMessages);

        // Cleanup event listener and socket on unmount
        return () => {
            socket.off("send-message-to-every-user", handleNewMessages); // Remove specific listener
            socket.disconnect();
            console.log("Socket cleanup done");
        };
    }, [socket]);

    // Retrieve unseenCount from localStorage when the component mounts
    useEffect(() => {
        const storedUnseenCount = localStorage.getItem("unseenCount");
        if (storedUnseenCount !== null) {
            setUnseenCount(parseInt(storedUnseenCount, 10));
        }
    }, []);

    // Store unseenCount in localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("unseenCount", unseenCount);
    }, [unseenCount]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${secretKey}/employee/fetchEmployeeFromId/${userId}`);
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };

    // Fetch data once and pass it to Header and EmpNav
    useEffect(() => {
        fetchData();
    }, [userId]);

    const handleShowChatBox = async () => {
        setShowChatBox((prev) => !prev);

        if (!showChatBox) {
            setUnseenCount(0); // Reset unseen count when chatbox is opened
        }

        // Fetch messages from database if chat box is opened for the first time
        if (!hasFetchedMessages && !showChatBox) {
            try {
                const response = await axios.get(`${secretKey}/chats/getAllChats`);
                if (response.data.result) {
                    const oldMessages = response.data.data.flatMap((chat) =>
                        chat.messageData.map((msg) => ({
                            id: `${msg.message}-${msg.time}`, // Generate a unique ID
                            text: msg.message,
                            userName: msg.name,
                            employeeId: msg.employeeId,
                            sentByMe: msg.name === data.ename, // Determine if sent by the current user
                            designation: msg.designation,
                            profilePhoto: msg.profilePhoto,
                            time: msg.time
                        }))
                    );
                    setMessages((prevMessages) => {
                        const existingIds = new Set(prevMessages.map((msg) => msg.id));
                        const uniqueOldMessages = oldMessages.filter((msg) => !existingIds.has(msg.id));
                        return [...uniqueOldMessages, ...prevMessages];
                    });
                    setHasFetchedMessages(true); // Mark as fetched
                }
            } catch (error) {
                console.error("Error fetching old messages:", error);
            }
        }
    };

    return (
        <>
            <Header
                id={data._id}
                name={data.ename}
                empProfile={data.profilePhoto && data.profilePhoto.length !== 0 && data.profilePhoto[0].filename}
                gender={data.gender}
                designation={data.newDesignation}
                data={data}
            />
            <Navbar userId={userId} bdmWork={data.bdmWork} />
            {/* This will render the specific page content */}
            <Outlet />

            <div className="position-fixed bottom-0 end-0 p-3">
                <div style={{ position: "relative" }}>
                    <IoChatboxEllipsesSharp style={{ fontSize: "30px", color: "gray", cursor: "pointer" }} onClick={handleShowChatBox} />
                    {unseenCount > 0 && (
                        <span className="unseen-message-count">
                            {unseenCount}
                        </span>
                    )}
                </div>
            </div>

            {showChatBox && (
                <Chat
                    name={data.ename}
                    id={data._id}
                    designation={data.newDesignation}
                    profilePhoto={data.profilePhoto && data.profilePhoto.length !== 0 && data.profilePhoto[0].filename}
                    showChatBox={showChatBox}
                    setShowChatBox={setShowChatBox}
                    socket={socket}
                    messages={messages}
                    setMessages={setMessages}
                />
            )}
        </>
    );
}

export default FloorManagerLayout;