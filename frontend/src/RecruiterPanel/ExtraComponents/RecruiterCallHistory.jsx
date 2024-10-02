import React, { useState, useEffect } from 'react';
import { LuHistory } from "react-icons/lu";
import ClipLoader from "react-spinners/ClipLoader";
import Nodata from '../../DataManager/Components/Nodata/Nodata';

function RecruiterCallHistory({ empName, clientNumber }) {
    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const [isLoading, setIsLoading] = useState(false);
    const [callHistory, setCallHistory] = useState([]);
    const modalId = `modal-${empName.replace(/\s+/g, '')}-${clientNumber}`; // Generate a unique modal ID

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const formatTime = (timeString) => {
        let [hours, minutes] = timeString.split(':');
        hours = parseInt(hours);
        const amOrPm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours < 10 ? '0' + hours : hours} : ${minutes} ${amOrPm}`;
    };

    const formatDuration = (duration) => {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = duration % 60;
        return `${hours.toString().padStart(2, '0')}h : ${minutes.toString().padStart(2, '0')}m : ${seconds.toString().padStart(2, '0')}s`;
    };

    const fetchEmployeeData = async () => {
        const apiKey = process.env.REACT_APP_API_KEY;
        const url = 'https://api1.callyzer.co/v2/call-log/history';

        const today = new Date();
        const todayStartDate = new Date(today);
        const todayEndDate = new Date(today);
        todayEndDate.setUTCHours(13, 0, 0, 0);
        todayStartDate.setMonth(todayStartDate.getMonth() - 5);
        todayStartDate.setUTCHours(4, 0, 0, 0);

        const startTimestamp = Math.floor(todayStartDate.getTime() / 1000);
        const endTimestamp = Math.floor(todayEndDate.getTime() / 1000);

        const body = {
            "call_from": startTimestamp,
            "call_to": endTimestamp,
            "call_types": ["Missed", "Rejected", "Incoming", "Outgoing"],
            "client_numbers": [clientNumber]
        };

        try {
            setIsLoading(true);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error: ${response.status} - ${errorData.message || response.statusText}`);
            }

            const data = await response.json();
            setCallHistory(data.result);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = () => {
        fetchEmployeeData();
    };

    return (
        <div>
            <div className={'d-flex align-items-center justify-content-center'}>
                <a
                    style={{ textDecoration: "none" }}
                    data-bs-toggle="modal"
                    data-bs-target={`#${modalId}`} // Use dynamic modal ID
                    onClick={handleOpenModal}
                >
                    <LuHistory />
                </a>
            </div>
            {/* ------------------------------------------------------call history dialog------------------------------------------------------- */}
            <div className="modal" id={modalId}> {/* Use dynamic modal ID */}
                <div className="modal-dialog modal-xl modal-dialog-centered">
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <h4 className="modal-title">Call History For {empName}</h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                onClick={() => setCallHistory([])}
                            ></button>
                        </div>

                        {/* Modal Body */}
                        <div className="modal-body">
                            <div className='table table-responsive'>
                                {isLoading ? (
                                    <ClipLoader />
                                ) : callHistory && callHistory.length > 0 ? (
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Employee Name</th>
                                                <th>Employee Number (From)</th>
                                                <th>To Number</th>
                                                <th>Call Date</th>
                                                <th>Call Time</th>
                                                <th>Call Duration</th>
                                                <th>Call Type</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {callHistory.map((item, index) => {
                                                console.log("Call history item:", item, item.client_number); // Debug console log
                                                return (
                                                    <tr key={item.id}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.emp_name}</td>
                                                        <td>{item.emp_number}</td>
                                                        <td>{item.client_name} ({item.client_number})</td>
                                                        <td>{formatDate(item.call_date)}</td>
                                                        <td>{formatTime(item.call_time)}</td>
                                                        <td>{formatDuration(item.duration)}</td>
                                                        <td>{item.call_type}</td>
                                                    </tr>
                                                );
                                            })}
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
            </div>
        </div >
    );
}

export default RecruiterCallHistory;
