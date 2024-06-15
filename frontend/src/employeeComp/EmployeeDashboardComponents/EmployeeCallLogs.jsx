import React, { useEffect, useState } from "react";
import { VscCallOutgoing } from "react-icons/vsc";
import { VscCallIncoming } from "react-icons/vsc";
import { TbPhoneCall } from "react-icons/tb";
import { HiOutlinePhoneMissedCall } from "react-icons/hi";
import { MdOutlineCallMissedOutgoing } from "react-icons/md";
import { MdTimer } from "react-icons/md";
import { IoCall } from "react-icons/io5";
import { IoBan } from "react-icons/io5";
import { LuUser2 } from "react-icons/lu";

function EmployeeCallLogs({ employeeData }) {
    const [totalcalls, setTotalCalls] = useState(null);
    const [totalMissedCalls, setTotalMissedCalls] = useState(null);
    const todayStartDate = new Date();
    const todayEndDate = new Date();
    
    // Set todayStartDate to the start of the day in UTC
    todayStartDate.setUTCHours(0, 0, 0, 0);
    
    // Set todayEndDate to the end of the day in UTC
    todayEndDate.setUTCHours(23, 59, 59, 999);
    
    // Convert to Unix timestamps (seconds since epoch)
    const startTimestamp = Math.floor(todayStartDate.getTime() / 1000);
    const endTimestamp = Math.floor(todayEndDate.getTime() / 1000);
    

    // ------------------------  Callizer API   -------------------------------------------

    useEffect(() => {
        const fetchEmployeeData = async () => {
            const apiKey = process.env.REACT_APP_API_KEY; // Ensure this is set in your .env file
            const url = 'https://api1.callyzer.co/v2/call-log/analysis';
            const missed_url = "https://api1.callyzer.co/v2/call-log/not-pickup-by-client";
            const employeeArray = [];
            employeeArray.push(employeeData.number);
          

            const body = {
                "call_from": startTimestamp,
                "call_to": endTimestamp,
                "emp_numbers":employeeArray,
                "working_hour_from":"00:00",
                "working_hour_to":"20:59",    
                "is_exclude_numbers": true
            }
            const body_missed = {
                "call_from": startTimestamp,
                "call_to": startTimestamp,
                "call_types": ["Missed","Rejected","Incoming","Outgoing"],
                "emp_numbers":employeeArray,
                "emp_tags": [],
                "is_exclude_numbers": true,
                "page_no":1,
                "page_size":10
            }

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                });
                // const response_missed = await fetch(missed_url, {
                //     method: 'POST',
                //     headers: {
                //         'Authorization': `Bearer ${apiKey}`,
                //         'Content-Type': 'application/json'
                //     },
                //     body: JSON.stringify(body_missed)
                // });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Error: ${response.status} - ${errorData.message || response.statusText}`);
                }
                // if (!response_missed.ok) {
                //     const errorData = await response_missed.json();
                //     throw new Error(`Error: ${response_missed.status} - ${errorData.message || response_missed.statusText}`);
                // }

                const data = await response.json();
                // const data_missed = await response_missed.json();


                setTotalCalls(data.result);
                // setTotalMissedCalls(data_missed.result)
            } catch (err) {

                console.log(err)
            }
        };

        fetchEmployeeData();
    }, [employeeData]);

    console.log(totalMissedCalls)
   
    return (
        <div>
            {totalcalls && <div className="dash-card" style={{ minHeight: '299px' }}>
                <div className="dash-card-head d-flex align-items-center justify-content-between">
                    <h2 className="m-0">
                        Your Call Report
                    </h2>
                    <div className="dash-select-filter">
                        <select class="form-select form-select-sm my-filter-select"
                            aria-label=".form-select-sm example"
                        >
                            <option value="Today">Today</option>
                            <option value="This Month">This Month</option>
                            <option value="Last Month">Last Month</option>
                        </select>
                    </div>
                </div>

                <div className="dash-card-body">
                    <div className="row">
                        <div className="col-lg-6 mb-1 mt-2">
                            <div className="call-d-card clr-bg-light-ff8800">
                                <div className="call-d-card-head d-flex align-items-center">
                                    <div className="clr-ff8800 mr-1">
                                        <VscCallOutgoing />
                                    </div>
                                    <div className="clr-ff8800">
                                        Outgoing Calls
                                    </div>
                                </div>
                                <div className="call-d-card-body d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <div className="clr-000">{totalcalls.
                                            top_dialer.total_outgoing_calls
                                        } Calls</div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className="timer-I">
                                            <MdTimer />
                                        </div>
                                        <div className="clr-000">
                                           {totalcalls.highest_total_duration.total_outgoing_duration} s
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 mb-1 mt-2">
                            <div className="call-d-card clr-bg-light-1cba19">
                                <div className="call-d-card-head d-flex align-items-center">
                                    <div className="clr-1cba19 mr-1">
                                        <VscCallIncoming />
                                    </div>
                                    <div className="clr-1cba19">
                                        Incoming Calls
                                    </div>
                                </div>
                                <div className="call-d-card-body d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <div className="clr-000">{totalcalls.
                                            top_answered.total_incoming_calls
                                        } Call</div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className="timer-I">
                                            <MdTimer />
                                        </div>
                                        <div className="clr-000">
                                        {totalcalls.highest_total_duration.total_incoming_duration} s
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 mb-1 mt-2">
                            <div className="call-d-card clr-bg-light-e65b5b">
                                <div className="call-d-card-head d-flex align-items-center">
                                    <div className="clr-e65b5b mr-1">
                                        <MdOutlineCallMissedOutgoing />
                                    </div>
                                    <div className="clr-e65b5b">
                                        Missed Calls
                                    </div>
                                </div>
                                <div className="call-d-card-body d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <div className="clr-000">8 Call</div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className="timer-I">

                                        </div>
                                        <div className="clr-000">

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 mb-1 mt-2">
                            <div className="call-d-card clr-bg-light-a0b1ad">
                                <div className="call-d-card-head d-flex align-items-center">
                                    <div className="clr-a0b1ad mr-1">
                                        <IoBan />
                                    </div>
                                    <div className="clr-a0b1ad">
                                        Rejected Calls
                                    </div>
                                </div>
                                <div className="call-d-card-body d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <div className="clr-000">8 Call</div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className="timer-I">

                                        </div>
                                        <div className="clr-000">

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 mb-1 mt-2">
                            <div className="call-d-card clr-bg-light-4299e1">
                                <div className="call-d-card-head d-flex align-items-center">
                                    <div className="clr-4299e1 mr-1">
                                        <TbPhoneCall />
                                    </div>
                                    <div className="clr-4299e1">
                                        Total Calls
                                    </div>
                                </div>
                                <div className="call-d-card-body d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <div className="clr-000">8 Call</div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className="timer-I">
                                            <MdTimer />
                                        </div>
                                        <div className="clr-000">
                                            1h 56m 45s
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 mb-1 mt-2">
                            <div className="call-d-card clr-bg-light-ffb900">
                                <div className="call-d-card-head d-flex align-items-center">
                                    <div className="clr-ffb900 mr-1">
                                        <LuUser2 />
                                    </div>
                                    <div className="clr-ffb900">
                                        Unique Clients
                                    </div>
                                </div>
                                <div className="call-d-card-body d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <div className="clr-000">290</div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className="timer-I">

                                        </div>
                                        <div className="clr-000">

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default EmployeeCallLogs