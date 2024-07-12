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
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
//import { DateRange } from '@mui/x-date-pickers-pro/models';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SingleInputTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputTimeRangeField';


function EmployeeCallLogs({ employeeData }) {
    //const [startTimestamp, setStartTimestamp] = useState(null);
    //const [endTimestamp, setEndTimestamp] = useState(null);
    // const [value, setValue] = useState([
    //     dayjs(`${selectDate}T00:00:00`),
    //     dayjs(`${selectDate}T23:59:59`),
    //   ]);
    const [totalcalls, setTotalCalls] = useState(null);
    const [totalMissedCalls, setTotalMissedCalls] = useState(null);
    //const [selectDate, setSelectDate] = useState(new Date().setUTCHours(0, 0, 0, 0))
    const [selectTime, setselectTime] = useState()
    const todayStartDate = new Date();
    const todayEndDate = new Date();
    const [selectDate, setSelectDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectStartTime, setSelectStartTime] = useState('00:00'); // Initialize to only time part
    const [selectEndTime, setSelectEndTime] = useState('23:59'); // Initialize to only time part

    //Set todayStartDate to the start of the day in UTC
    todayStartDate.setUTCHours(4, 0, 0, 0);

    //Set todayEndDate to the end of the day in UTC
    todayEndDate.setUTCHours(13, 0, 0, 0);

    // Convert to Unix timestamps (seconds since epoch)
    const startTimestamp = Math.floor(todayStartDate.getTime() / 1000);
    const endTimestamp = Math.floor(todayEndDate.getTime() / 1000);

    //

    //console.log("employee", employeeData)
    // ------------------------  Callizer API   -------------------------------------------


    // Combine date and time string

    const handleDateChange = (e) => {
        setSelectDate(e.target.value);
    };

    // useEffect(() => {
    //     if (selectDate) {
    //         // Combine date and time for start of the day in UTC
    //         const combinedDateTimeStart = new Date(`${selectDate}T00:00:00Z`);
    //         // Combine date and time for end of the day in UTC
    //         const combinedDateTimeEnd = new Date(`${selectDate}T23:59:59Z`);

    //         // Convert to Unix timestamps (seconds since epoch)
    //         const startTimestamp = Math.floor(combinedDateTimeStart.getTime() / 1000);
    //         const endTimestamp = Math.floor(combinedDateTimeEnd.getTime() / 1000);

    //         setStartTimestamp(startTimestamp);
    //         setEndTimestamp(endTimestamp);
    //     }
    // }, [selectDate]);

    // useEffect(() => {
    //     if (selectDate) {

    //         // Create start and end Date objects
    //         const combinedDateTimeStart = new Date(`${selectDate}T${selectStartTime}:00`);
    //         const combinedDateTimeEnd = new Date(`${selectDate}T${selectEndTime}:00`);

    //         // Convert to Unix timestamps (seconds since epoch)
    //         const startTimestamp = Math.floor(combinedDateTimeStart.getTime() / 1000);
    //         const endTimestamp = Math.floor(combinedDateTimeEnd.getTime() / 1000);

    //         setStartTimestamp(startTimestamp);
    //         setEndTimestamp(endTimestamp);
    //     }
    // }, [selectDate, selectStartTime, selectEndTime]);


    let employeeArray = []
    employeeArray.push(employeeData.number);

    useEffect(() => {
        const fetchEmployeeData = async () => {
            const apiKey = process.env.REACT_APP_API_KEY; // Ensure this is set in your .env file
            const url = 'https://api1.callyzer.co/v2/call-log/employee-summary';
            // const employeeArray = [];
            // employeeArray.push(employeeData.number);


            const body = {
                "call_from": startTimestamp,
                "call_to": endTimestamp,
                "call_types": ["Missed", "Rejected", "Incoming", "Outgoing"],
                "emp_numbers": employeeArray,
                // "working_hour_from": "00:00",
                // "working_hour_to": "20:59",
                // "is_exclude_numbers": true
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

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Error: ${response.status} - ${errorData.message || response.statusText}`);
                }
                const data = await response.json();
                // const data_missed = await response_missed.json();


                setTotalCalls(data.result);

            } catch (err) {

                console.log(err)
            }
        };
        fetchEmployeeData();
    }, [employeeData]);




    // console.log(selectDate)
    // console.log("startTime", selectStartTime)
    // console.log("endTime", selectEndTime)
    // //console.log(value)
    // console.log("totalcalls", totalcalls)
    // console.log("Start Timestamp:", startTimestamp);
    // console.log("End Timestamp:", endTimestamp);
    // console.log(typeof(totalcalls))

    const convertSecondsToHMS = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 3600 % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };


    return (
        <div>
            {totalcalls && <div className="dash-card" style={{ minHeight: '299px' }}>
                <div className="dash-card-head d-flex align-items-center justify-content-between">
                    <h2 className="m-0">
                        Today's Calling Report
                    </h2>
                    {/* <div className="dash-select-filter d-flex align-items-center">
                        <input type="date" class="form-select-sm my-filter-select mr-1"
                            onChange={(e) => {
                                setSelectDate(e.target.value)
                            }} />
                        <input style={{width:"60px"}} type="time" class="form-select form-select-sm my-filter-select"
                            onChange={(e) => {setSelectStartTime(e.target.value) }} />
                        <input style={{width:"60px"}} type="time" class="form-select form-select-sm my-filter-select"
                            onChange={(e) => {setSelectEndTime(e.target.value) }} />
                    </div> */}
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
                                        <div className="clr-000">
                                            {totalcalls[0].total_outgoing_calls} Calls</div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className="timer-I">
                                            <MdTimer />
                                        </div>
                                        <div className="clr-000">
                                            {convertSecondsToHMS(totalcalls[0].total_outgoing_duration)}
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
                                        <div className="clr-000">
                                            {totalcalls[0].total_incoming_calls} Calls</div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className="timer-I">
                                            <MdTimer />
                                        </div>
                                        <div className="clr-000">
                                            {convertSecondsToHMS(totalcalls[0].total_incoming_duration)}
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
                                        <div className="clr-000">{totalcalls[0].total_missed_calls} Calls</div>
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
                                        <div className="clr-000">{totalcalls[0].total_rejected_calls} Calls</div>
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
                                        <div className="clr-000">
                                            {totalcalls[0].total_calls} Calls</div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className="timer-I">
                                            <MdTimer />
                                        </div>
                                        <div className="clr-000">
                                            {convertSecondsToHMS(totalcalls[0].total_duration)}
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
                                        <div className="clr-000">{totalcalls[0].total_unique_clients} </div>
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