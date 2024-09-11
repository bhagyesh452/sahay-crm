import React, { useState, useEffect } from 'react'
import { debounce } from "lodash";
import Calendar from "@mui/icons-material/Event";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from "moment";
// import moment from 'moment-timezone';
import { StaticDateRangePicker } from "@mui/x-date-pickers-pro/StaticDateRangePicker";
import dayjs from "dayjs";
import axios from "axios";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from 'react-router-dom';

function EmployeeCompleteCallingReport() {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [selectedValue, setSelectedValue] = useState("")
    const [finalEmployeeData, setFinalEmployeeData] = useState([])
    const [newSortType, setNewSortType] = useState({
        forwardedcase: "none",
        interestedcase: "none",
        followupcase: "none",

    });
    const [employeeData, setEmployeeData] = useState([]);
    const [employeeDataFilter, setEmployeeDataFilter] = useState([]);
    const [employeeInfo, setEmployeeInfo] = useState([])
    const [forwardEmployeeData, setForwardEmployeeData] = useState([])
    const [forwardEmployeeDataFilter, setForwardEmployeeDataFilter] = useState([])
    const [forwardEmployeeDataNew, setForwardEmployeeDataNew] = useState([])
    const [employeeDataProjectionSummary, setEmployeeDataProjectionSummary] = useState([])
    const [teamLeadsData, setTeamLeadsData] = useState([])
    const [teamLeadsDataFilter, setTeamLeadsDataFilter] = useState([])
    const [companyDataTotal, setCompanyDataTotal] = useState([])
    const [companyData, setCompanyData] = useState([]);
    const [companyDataFilter, setcompanyDataFilter] = useState([]);
    const [followData, setfollowData] = useState([]);
    const [followDataToday, setfollowDataToday] = useState([]);
    const [followDataTodayNew, setfollowDataTodayNew] = useState([]);
    const [followDataFilter, setFollowDataFilter] = useState([])
    const [followDataNew, setFollowDataNew] = useState([])
    const [selectedDataRangeForwardedEmployee, setSelectedDateRangeForwardedEmployee] = useState([]);
    const [personName, setPersonName] = useState([])
    const [searchTermForwardData, setSearchTermForwardData] = useState("")
    const [bdeResegnedData, setBdeRedesignedData] = useState([])
    const [leadHistoryData, setLeadHistoryData] = useState([])
    const [filteredLeadHistoryData, setFilteredLeadHistoryData] = useState([])



    // --------------------------date formats--------------------------------------------
    function formatDateFinal(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function formatDateMonth(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }


    //----------------------fetching employees info--------------------------------------
    const [loading, setLoading] = useState(false)
    const [deletedEmployeeData, setDeletedEmployeeData] = useState([])


    const fetchEmployeeInfo = async () => {
        try {
            setLoading(true);

            // Fetch data using fetch and axios
            const response = await fetch(`${secretKey}/employee/einfo`);
            const response3 = await axios.get(`${secretKey}/employee/deletedemployeeinfo`);


            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const deletedData = response3.data;

            // Filter by designations
            const filteredData = data.filter(employee =>
                employee.designation === "Sales Executive" || employee.designation === "Sales Manager"
            );
            const filteredDeletedData = deletedData.filter(employee =>
                employee.designation === "Sales Executive" || employee.designation === "Sales Manager"
            );

            // Combine data from both responses
            const combinedForwardEmployeeData = [...filteredData, ...filteredDeletedData];

            // Set state values
            setDeletedEmployeeData(filteredDeletedData);
            setEmployeeData(filteredData);
            setEmployeeDataFilter(filteredData);
            setEmployeeInfo(filteredData);
            setForwardEmployeeData(combinedForwardEmployeeData); // Use combined data
            setForwardEmployeeDataFilter(combinedForwardEmployeeData);
            setForwardEmployeeDataNew(combinedForwardEmployeeData);
            setEmployeeDataProjectionSummary(filteredData);

        } catch (error) {
            console.error(`Error Fetching Employee Data `, error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        //fetchRedesignedBookings();
        fetchEmployeeInfo()
        // fetchCompanyData()
        //fetchFollowUpData();
    }, []);

    const [totalcalls, setTotalCalls] = useState(null);
    const [filteredTotalCalls, setFilteredTotalCalls] = useState(null);
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


    const handleDateChange = (e) => {
        setSelectDate(e.target.value);
    };

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

                setTotalCalls(data.result);
                setFilteredTotalCalls(data.result)

                // setTotalCalls(data.result);
                //console.log("data", data.result)

            } catch (err) {

                console.log(err)
            }
        };
        fetchEmployeeData();
    }, [employeeData]);

    // const fetchEmployeeData = async (startTimestamp, endTimestamp) => {
    //     console.log(startTimestamp, endTimestamp)
    //     const apiKey = process.env.REACT_APP_API_KEY; // Ensure this is set in your .env file
    //     const url = 'https://api1.callyzer.co/v2/call-log/employee-summary';

    //     const body = {
    //         "call_from": startTimestamp, // Use dynamic start timestamp
    //         "call_to": endTimestamp,     // Use dynamic end timestamp
    //         "call_types": ["Missed", "Rejected", "Incoming", "Outgoing"],
    //         "emp_numbers": employeeArray,
    //     }

    //     try {
    //         const response = await fetch(url, {
    //             method: 'POST',
    //             headers: {
    //                 'Authorization': `Bearer ${apiKey}`,
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(body)
    //         });

    //         if (!response.ok) {
    //             const errorData = await response.json();
    //             throw new Error(`Error: ${response.status} - ${errorData.message || response.statusText}`);
    //         }

    //         const data = await response.json();
    //         setTotalCalls(data.result);
    //         setFilteredTotalCalls(data.result);
    //         console.log("data", data.result);

    //     } catch (err) {
    //         console.error(err);
    //     }
    // };


    const convertSecondsToHMS = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 3600 % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    // -----------------------filter functions----------------------
    const shortcutsItems = [
        {
            label: "This Week",
            getValue: () => {
                const today = dayjs();
                return [today.startOf("week"), today.endOf("week")];
            },
        },
        {
            label: "Last Week",
            getValue: () => {
                const today = dayjs();
                const prevWeek = today.subtract(7, "day");
                return [prevWeek.startOf("week"), prevWeek.endOf("week")];
            },
        },
        {
            label: "Last 7 Days",
            getValue: () => {
                const today = dayjs();
                return [today.subtract(7, "day"), today];
            },
        },
        {
            label: "Current Month",
            getValue: () => {
                const today = dayjs();
                return [today.startOf("month"), today.endOf("month")];
            },
        },
        {
            label: "Next Month",
            getValue: () => {
                const today = dayjs();
                const startOfNextMonth = today.endOf("month").add(1, "day");
                return [startOfNextMonth, startOfNextMonth.endOf("month")];
            },
        },
        { label: "Reset", getValue: () => [null, null] },
    ];

    const handleSingleDateSelection = async (formattedDate) => {
        // Convert formattedDate to a timestamp if needed
        const startOfDay = moment(formattedDate, "DD/MM/YYYY").startOf('day').unix(); // Start of the day
        const endOfDay = moment(formattedDate, "DD/MM/YYYY").endOf('day').unix(); // End of the day
    
        // Set the timestamps
        const startTimestamp = startOfDay;
        const endTimestamp = endOfDay;
    
        console.log(startOfDay , endOfDay)
        console.log(startTimestamp , endTimestamp)
        // Fetch data based on the selected date
        const fetchEmployeeData = async () => {
            const apiKey = process.env.REACT_APP_API_KEY; // Ensure this is set in your .env file
            const url = 'https://api1.callyzer.co/v2/call-log/employee-summary';
    
            // Prepare the request body
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
                
                setTotalCalls(data.result);
                setFilteredTotalCalls(data.result);
    
                console.log("Data fetched:", data.result);
    
            } catch (err) {
                console.log(err);
            }
        };
    
        // Call the fetch function
        fetchEmployeeData();
    };
    






    return (
        <div>
            <div className="employee-dashboard">
                <div className="card">
                    <div className="card-header p-1 employeedashboard d-flex align-items-center justify-content-between">
                        <div className="dashboard-title pl-1"  >
                            <h2 className="m-0">
                                Employee Calling Report
                            </h2>
                        </div>
                        <div className="d-flex align-items-center pr-1">
                            <div className="data-filter">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker']} 
                                    sx={{ padding: '0px', width: '220px' }}>
                                        <DatePicker
                                            className="form-control my-date-picker form-control-sm p-0"
                                            onChange={(value) => {
                                                if (value) {
                                                    // Convert the selected date to Moment object
                                                    const selectedDate = moment(value.$d);

                                                    // Format as required
                                                    const formattedDate = selectedDate.format("DD/MM/YYYY");
                                                    console.log("Formatted Date:", formattedDate); // Debugging

                                                    // Call the function to handle the selected date and fetch data
                                                    handleSingleDateSelection(formattedDate);
                                                }
                                            }}
                                            label="Basic date picker"
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </div>
                        </div>
                    </div>
                    <div className='card-body'>
                        <div className="row tbl-scroll">
                            <table className="table-vcenter table-nowrap admin-dash-tbl">
                                <thead className="admin-dash-tbl-thead">
                                    <tr>
                                        <th>
                                            Sr.No
                                        </th>
                                        <th>BDE/BDM Name</th>
                                        <th >Branch Name</th>
                                        <th>Total Calls</th>
                                        <th>Unique Clients</th>
                                        <th>Total Call Duration</th>
                                        <th>Last Sync Time</th>
                                    </tr>
                                </thead>
                                {loading ?
                                    (<tbody>
                                        <tr>
                                            <td colSpan="12">
                                                <div className="LoaderTDSatyle">
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
                                    </tbody>) :
                                    (
                                        <tbody>
                                            {totalcalls && totalcalls.length !== 0 &&
                                                totalcalls
                                                    .filter((obj) => employeeData.some((data) => Number(data.number) === Number(obj.emp_number))) // Filter employees present in employeeData
                                                    .map((obj, index) => (
                                                        <tr key={`row-${index}`}>
                                                            <td style={{ color: "black", textDecoration: "none" }}>{index + 1}</td>
                                                            <td>{obj.emp_name}</td>
                                                            <td>
                                                                {employeeData.length > 0 &&
                                                                    employeeData.filter((data) => Number(data.number) === Number(obj.emp_number)).length > 0
                                                                    ? employeeData.filter((data) => Number(data.number) === Number(obj.emp_number))[0].branchOffice
                                                                    : "-"}
                                                            </td>
                                                            <td>{obj.total_calls}</td>
                                                            <td>{obj.total_unique_clients}</td>
                                                            <td>{convertSecondsToHMS(obj.total_duration)}</td>
                                                            <td>{obj.last_call_log.synced_at}</td>
                                                        </tr>
                                                    ))}
                                        </tbody>

                                    )}

                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeeCompleteCallingReport