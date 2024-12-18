import React, { useEffect, useState, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import Header from "./Header";
import Navbar from "./Navbar";
import Chat from "../components/Chat";
import { IoChatboxEllipsesSharp } from "react-icons/io5";

function AdminLayout() {

    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const adminName = localStorage.getItem("adminName");

    const [data, setData] = useState([]);
    const [showChatBox, setShowChatBox] = useState(false);
    const [messages, setMessages] = useState([]);
    const [bookingData, setBookingData] = useState([]);
    const [projectionData, setProjectionData] = useState([]);
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
    }, [socket, showChatBox]);

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
                        chat.messageData
                            .filter((msg) => msg.message)
                            .map((msg) => ({
                                id: `${msg.message}-${msg.time}`, // Generate a unique ID
                                text: msg.message,
                                userName: msg.name,
                                employeeId: msg.employeeId,
                                sentByMe: msg.name === adminName, // Determine if sent by the current user
                                designation: msg.designation,
                                profilePhoto: msg.profilePhoto,
                                time: msg.time,
                            })
                        )
                    );
                    setMessages((prevMessages) => {
                        const existingIds = new Set(prevMessages.map((msg) => msg.id));
                        const uniqueOldMessages = oldMessages.filter((msg) => !existingIds.has(msg.id));
                        return [...uniqueOldMessages, ...prevMessages];
                    });

                    const oldBookings = response.data.data.flatMap((chat) =>
                        chat.messageData
                            .filter((booking) => booking.bookingBdeName) // Include only if bookingBdeName exists
                            .map((booking) => ({
                                id: `${booking.bookingDate}-${booking.time}`, // Unique ID
                                bookingBdeName: booking.bookingBdeName,
                                closeBy: booking.closeBy,
                                bookingDate: booking.bookingDate,
                                services: booking.services,
                                time: booking.time,
                            })
                        )
                    );
                    setBookingData((prevBookingData) => {
                        const existingIds = new Set(prevBookingData.map((booking) => booking.id));
                        const uniqueOldBookings = oldBookings.filter((booking) => !existingIds.has(booking.id));
                        return [...uniqueOldBookings, ...prevBookingData];
                    });

                    const oldProjections = response.data.data.flatMap((chat) =>
                        chat.messageData
                            .filter((projection) => projection.projectionBdeName) // Include only if projectionBdeName exists
                            .map((projection) => ({
                                id: `${projection.projectionAmount}-${projection.time}`, // Unique ID
                                projectionBdeName: projection.projectionBdeName,
                                projectionAmount: projection.projectionAmount,
                                time: projection.time,
                            })
                        )
                    );
                    setProjectionData((prevProjectionData) => {
                        const existingIds = new Set(prevProjectionData.map((projection) => projection.id));
                        const uniqueOldProjections = oldProjections.filter((projection) => !existingIds.has(projection.id));
                        return [...uniqueOldProjections, ...prevProjectionData];
                    });

                    setHasFetchedMessages(true); // Mark as fetched
                }
            } catch (error) {
                console.error("Error fetching old messages:", error);
            }
        }
    };

    useEffect(() => {
        handleShowChatBox();
    }, []);

    const combinedMessages = [...messages, ...bookingData, ...projectionData];

    return (
        <>
            <Header />
            <Navbar />
            {/* This will render the specific page content */}
            <Outlet />
            {/* <Chat
                name={adminName}
                designation={"Managing Director"}
                showChatBox={showChatBox}
                setShowChatBox={setShowChatBox}
                socket={socket}
                messages={messages}
                setMessages={setMessages}
                bookingData={bookingData}
                setBookingData={setBookingData}
                projectionData={projectionData}
                setProjectionData={setProjectionData}
                combinedMessages={combinedMessages}
            /> */}

            {/* <div className="position-fixed bottom-0 end-0 p-3">
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
                    name={adminName}
                    designation={"Managing Director"}
                    showChatBox={showChatBox}
                    setShowChatBox={setShowChatBox}
                    socket={socket}
                    messages={messages}
                    setMessages={setMessages}
                />
            )} */}
        </>
    );
}

export default AdminLayout;