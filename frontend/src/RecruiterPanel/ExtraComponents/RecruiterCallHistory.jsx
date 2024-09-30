import React, { useState, useEffect } from 'react';
import { IoMdArrowBack } from "react-icons/io";
import ClipLoader from "react-spinners/ClipLoader";
import { IconChevronRight, IconChevronLeft } from "@tabler/icons-react";
import { LuHistory } from "react-icons/lu";
import Nodata from '../../DataManager/Components/Nodata/Nodata';

function RecruiterCallHistory({ empName, clientNumber }) {
    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [callHistory, setCallHistory] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 100;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const formatTime = (timeString) => {
        // Split the input time string (HH:MM:SS) into hours, minutes, and seconds
        let [hours, minutes] = timeString.split(':');

        // Convert the string values to numbers
        hours = parseInt(hours);

        // Determine AM or PM
        const amOrPm = hours >= 12 ? 'PM' : 'AM';

        // Convert 24-hour time to 12-hour time
        hours = hours % 12 || 12; // Convert 0 (midnight) or 12 (noon) to 12

        // Return formatted time string in 12-hour format with hours and minutes
        return `${hours < 10 ? '0' + hours : hours} : ${minutes} ${amOrPm}`;
    };

    const formatDuration = (duration) => {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = duration % 60;
        return `${hours.toString().padStart(2, '0')}h : ${minutes.toString().padStart(2, '0')}m : ${seconds.toString().padStart(2, '0')}s`;
    };

    const today = new Date();
    const todayStartDate = new Date(today);
    const todayEndDate = new Date(today);

    // Set end timestamp to current date at 13:00 (1 PM) UTC
    todayEndDate.setUTCHours(13, 0, 0, 0);

    // Set start timestamp to 6 months before the current date at 04:00 (4 AM) UTC
    todayStartDate.setMonth(todayStartDate.getMonth() - 5);
    todayStartDate.setUTCHours(4, 0, 0, 0);

    // console.log("Start date is :", todayStartDate);
    // console.log("End date is :", todayEndDate);

    // Convert to Unix timestamps (seconds since epoch)
    const startTimestamp = Math.floor(todayStartDate.getTime() / 1000);
    const endTimestamp = Math.floor(todayEndDate.getTime() / 1000);

    const fetchEmployeeData = async () => {
        const apiKey = process.env.REACT_APP_API_KEY; // Ensure this is set in your .env file
        const url = 'https://api1.callyzer.co/v2/call-log/history';
      
        const body = {
          "call_from": startTimestamp,
          "call_to": endTimestamp,
          "call_types": ["Missed", "Rejected", "Incoming", "Outgoing"],
          "client_numbers": [clientNumber]
        };
      
        try {
          setIsLoading(true);
          // POST request to the call-log API
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          });
      
          // Check for errors in the POST request
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message || response.statusText}`);
          }
      
          // Process the POST response
          const data = await response.json();
          console.log("calldata", data);
          setCallHistory(data.result);
        } catch (err) {
          console.log(err);
        } finally {
          setIsLoading(false);
        }
      };


    console.log("callhistory", callHistory);
    console.log("clientNumber", clientNumber);




    const handleOpenModal = () => {
        fetchEmployeeData(); // This will explicitly fetch updated data
      };


    return (
        <div>
            <div className={'d-flex align-items-center justify-content-between'}>
                <button className='td_add_remarks_btn ml-1'
                    data-bs-toggle="modal"
                    data-bs-target="#myModal"
                    onClick={handleOpenModal}
                >
                    <LuHistory />
                </button>
            </div>
            {/* ------------------------------------------------------call history dialog------------------------------------------------------- */}
            <div className="modal" id="myModal">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <h4 className="modal-title">Call History For {empName}</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => setCallHistory([])}></button>
                        </div>

                        {/* Modal Body */}
                        <div className="modal-body">
                            {callHistory && callHistory.length > 0 ? (
                                <table className="table table-striped"
                                // style={{
                                //     width: "100%",
                                //     tableLayout: "fixed"
                                // }}
                                >
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th className="th-sticky1">Employee Name</th>
                                            <th>Employee Number (From)</th>
                                            <th>To Number</th>
                                            <th>Call Date</th>
                                            <th>Call Time</th>
                                            <th>Call Duration</th>
                                            <th>Call Type</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {callHistory.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td className="td-sticky1">{item.emp_name}</td>
                                                <td>{item.emp_number}</td>
                                                <td>{item.client_name} ({item.client_number})</td>
                                                <td>{formatDate(item.call_date)}</td>
                                                <td>{formatTime(item.call_time)}</td>
                                                <td>{formatDuration(item.duration)}</td>
                                                <td>{item.call_type}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div>
                                    <Nodata />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div >
    )
}

export default RecruiterCallHistory