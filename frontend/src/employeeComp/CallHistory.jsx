import React, { useState, useEffect } from 'react';
import { IoMdArrowBack } from "react-icons/io";
import ClipLoader from "react-spinners/ClipLoader";
import Nodata from '../components/Nodata';
import { IconChevronRight, IconChevronLeft } from "@tabler/icons-react";
import { IconButton } from "@mui/material";

function CallHistory({ handleCloseHistory, clientNumber }) {

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
        return `${hours}:${minutes} ${amOrPm}`;
    };

    const formatDuration = (duration) => {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = duration % 60;
        return `${hours.toString().padStart(2, '0')}h : ${minutes.toString().padStart(2, '0')}m : ${seconds.toString().padStart(2, '0')}s`;
    };

    const handleSearch = (searchQuery) => {
        const searchData = callHistory.filter((data) => {
            return (
                data.emp_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                data.emp_number.toLowerCase().includes(searchQuery.toLowerCase())
            );
        })
        setSearchResult(searchData);
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

    let clientNumberArray = [clientNumber];

    useEffect(() => {
        const fetchEmployeeData = async () => {
            const apiKey = process.env.REACT_APP_API_KEY; // Ensure this is set in your .env file
            const url = 'https://api1.callyzer.co/v2/call-log/history';

            const body = {
                "call_from": startTimestamp,
                "call_to": endTimestamp,
                "call_types": ["Missed", "Rejected", "Incoming", "Outgoing"],
                "client_numbers": clientNumberArray
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

                // Construct the query parameters
                const queryParamsObject = {
                    "client_numbers": [],
                };
                let newData;
                const response2 = await fetch(`${secretKey}/fetch-api-data`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(queryParamsObject)
                });

                try {
                    setIsLoading(true);
                    const data = await response2.json();  // Await the response
                    //console.log('Data from external API:', data);
                    newData = data.result;  // Assign the data to newData
                } catch (error) {
                    console.error('Error:', error);  // Catch any errors
                }
                // console.log("New Data:", newData);

                // Assuming data.result from first response and newData from second have `emp_number` as common
                const mergedData = data.result?.map(client => {
                    const matchingClient = newData?.find(item => item.client_number === client.client_number);
                    if (matchingClient) {
                        return {
                            ...client, // Spread the fields from the first response
                            last_sync_req_at: matchingClient.last_sync_req_at // Add the field from second response
                        };
                    }
                    return client; // If no match, return the original object
                });
                setCallHistory(mergedData);

                // Check for errors in the GET request
                if (!response2.ok) {
                    const errorData = await response2.json();
                    throw new Error(`Error: ${response2.status} - ${errorData.message || response2.statusText}`);
                }
                // console.log("Merged Data:", mergedData);
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEmployeeData();
    }, [clientNumber]);

    // Calculate data for current page
    const currentData = (searchValue ? searchResult : callHistory).slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    return (
        <div>
            <div className="page-wrapper">
                <div className="page-header d-print-none">
                    <div className="container-xl">
                        <div className="d-flex align-items-center justify-content-between">

                            <div className="d-flex align-items-center">
                                <div className="btn-group mr-2">
                                    <button type="button" className="btn mybtn"
                                        onClick={handleCloseHistory}
                                    >
                                        <IoMdArrowBack className='mr-1' /> Back
                                    </button>
                                </div>
                            </div>

                            <div className="d-flex align-items-center">
                                <div class="input-icon ml-1">
                                    <span class="input-icon-addon">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon mybtn" width="18" height="18" viewBox="0 0 22 22" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                                            <path d="M21 21l-6 -6"></path>
                                        </svg>
                                    </span>
                                    <input
                                        value={searchValue}
                                        onChange={(e) => {
                                            setSearchValue(e.target.value.toLowerCase());
                                            handleSearch(e.target.value.toLowerCase());
                                        }}
                                        className="form-control search-cantrol mybtn"
                                        placeholder="Emplyee Name or Number"
                                        type="text"
                                        name="bdeName-search"
                                        id="bdeName-search" />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="page-body">
                    <div className="container-xl">

                        <div class="card-header my-tab">
                            <ul class="nav nav-tabs card-header-tabs nav-fill p-0"
                                data-bs-toggle="tabs">
                                <li class="nav-item data-heading">
                                    <a
                                        href="#tabs-home-5"
                                        className={"nav-link active item-act"}
                                        data-bs-toggle="tab"
                                    >
                                        Client's Calling History{" "}
                                        <span className="no_badge">{(searchValue ? searchResult : callHistory).length}</span>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="card">
                            <div className="card-body p-0">

                                <div
                                    style={{
                                        overflowX: "auto",
                                        overflowY: "auto",
                                        maxHeight: "66vh",
                                    }} className='call-history'
                                >
                                    <table
                                        style={{
                                            width: "100%",
                                            borderCollapse: "collapse",
                                            border: "1px solid #ddd",
                                        }}
                                        className="table-vcenter table-nowrap"
                                    >
                                        <thead>
                                            <tr className="tr-sticky">
                                                <th className="th-sticky">Sr.No</th>
                                                <th className="th-sticky1">Employee Name</th>
                                                <th>Employee Number</th>
                                                <th>To Number</th>
                                                <th>Date</th>
                                                <th>Time</th>
                                                <th>Duration</th>
                                                <th>Call Type</th>
                                            </tr>
                                        </thead>
                                        {isLoading ? (
                                            <tbody>
                                                <tr>
                                                    <td colSpan="8" >
                                                        <div className="LoaderTDSatyle w-100" >
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
                                            </tbody>
                                        ) : (
                                            <>
                                                <tbody>
                                                    {currentData.length > 0 ? (
                                                        currentData.map((item, index) => (
                                                            <tr key={index} style={{ border: "1px solid #ddd" }}>
                                                                <td className="td-sticky">{currentPage * itemsPerPage + index + 1}</td>
                                                                <td className="td-sticky1">{item.emp_name}</td>
                                                                <td>{item.emp_number}</td>
                                                                <td>{item.client_name} ({item.client_number})</td>
                                                                <td>{formatDate(item.call_date)}</td>
                                                                <td>{formatTime(item.call_time)}</td>
                                                                <td>{formatDuration(item.duration)}</td>
                                                                <td>{item.call_type}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="8" className="p-2 particular">
                                                                <Nodata />
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </>
                                        )}
                                    </table>
                                </div>

                                {/* Pagination controls */}
                                {currentData.length > 0 && (
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                        className="pagination"
                                    >
                                        <IconButton
                                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                                            disabled={currentPage === 0}
                                        >
                                            <IconChevronLeft />
                                        </IconButton>

                                        <span>Page {currentPage + 1} of {Math.ceil((searchValue ? searchResult : callHistory).length / itemsPerPage)}</span>

                                        <IconButton
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    (prev + 1) * itemsPerPage < (searchValue ? searchResult : callHistory).length ? prev + 1 : prev
                                                )
                                            }
                                            disabled={(currentPage + 1) * itemsPerPage >= (searchValue ? searchResult : callHistory).length}
                                        >
                                            <IconChevronRight />
                                        </IconButton>
                                    </div>
                                )}

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default CallHistory;