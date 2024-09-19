import React, { useState, useEffect, useRef } from 'react'
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
//import FilterTableCallingReport from './FilterTableCallingReport';
import { BsFilter } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import jsPDF and jsPDF AutoTable for generating PDFs
import * as XLSX from 'xlsx';
import Nodata from '../../../components/Nodata';


function CallingReportView({ employeeInformation }) {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [selectedValue, setSelectedValue] = useState("")
    const [finalEmployeeData, setFinalEmployeeData] = useState([])
    const [newSortType, setNewSortType] = useState({
        forwardedcase: "none",
        interestedcase: "none",
        followupcase: "none",

    });
    const [totalcalls, setTotalCalls] = useState(null);
    const [filteredTotalCalls, setFilteredTotalCalls] = useState(null);
    const [completeTotalCalls, setCompleteTotalCalls] = useState(null);
    const [totalMissedCalls, setTotalMissedCalls] = useState(null);
    //const [selectDate, setSelectDate] = useState(new Date().setUTCHours(0, 0, 0, 0))
    const [selectTime, setselectTime] = useState()
    const todayStartDate = new Date();
    const todayEndDate = new Date();
    const [selectDate, setSelectDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectStartTime, setSelectStartTime] = useState('00:00'); // Initialize to only time part
    const [selectEndTime, setSelectEndTime] = useState('23:59'); // Initialize to only time part
    const [employeeData, setEmployeeData] = useState([]);
    const [employeeDataFilter, setEmployeeDataFilter] = useState([]);
    const [employeeInfo, setEmployeeInfo] = useState([])
    const [forwardEmployeeData, setForwardEmployeeData] = useState([])
    const [forwardEmployeeDataFilter, setForwardEmployeeDataFilter] = useState([])
    const [forwardEmployeeDataNew, setForwardEmployeeDataNew] = useState([])
    const [employeeDataProjectionSummary, setEmployeeDataProjectionSummary] = useState([])
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [filteredData, setFilteredData] = useState(totalcalls);
    const [filterField, setFilterField] = useState("")
    const filterMenuRef = useRef(null); // Ref for the filter menu container
    const [activeFilterField, setActiveFilterField] = useState(null);
    const [filterPosition, setFilterPosition] = useState({ top: 10, left: 5 });
    const fieldRefs = useRef({});
    const [noOfAvailableData, setnoOfAvailableData] = useState(0)
    const [activeFilterFields, setActiveFilterFields] = useState([]); // New state for active filter fields
    const [loading, setLoading] = useState(false)
    const [deletedEmployeeData, setDeletedEmployeeData] = useState([])
    const [dailyData, setDailyData] = useState([]);
    const [error, setError] = useState(null);
    const convertSecondsToHMS = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 3600 % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const convertHMSToSeconds = (hms) => {
        const [hours, minutes, seconds] = hms.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };
    const fetchEmployeeInfo = async () => {
        try {
            //setLoading(true);

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
        } 
    };
    useEffect(() => {
        fetchEmployeeInfo()
    }, []);

    // Function to delay execution to handle rate limits
    const delay = (s) => new Promise(resolve => setTimeout(resolve, s));

    // Fetch data for a specific date and append the date field to each entry in the result
    const fetchDailyData = async (date) => {
        const apiKey = process.env.REACT_APP_API_KEY; // Ensure this is set in your .env file
        const url = 'https://api1.callyzer.co/v2/call-log/employee-summary';

        const startTimestamp = Math.floor(new Date(date).setUTCHours(4, 0, 0, 0) / 1000);
        const endTimestamp = Math.floor(new Date(date).setUTCHours(13, 0, 0, 0) / 1000);

        const body = {
            "call_from": startTimestamp,
            "call_to": endTimestamp,
            "call_types": ["Missed", "Rejected", "Incoming", "Outgoing"],
            "emp_numbers": [employeeInformation.number]
        };

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

            // Append the date field to each result
            return data.result.map((entry) => ({
                ...entry,
                date: date // Add the date field
            }));
        } catch (err) {
            console.error(err);
            setError(err.message);
            return null;
        }
    };

    // Fetch data for all days in a given month
    const fetchMonthlyData = async (startDate, endDate) => {
        setLoading(true);
        setError(null);

        let currentDate = new Date(startDate);
        const data = [];

        while (currentDate <= endDate) {
            const dateString = currentDate.toISOString().split('T')[0]; // Format YYYY-MM-DD

            const dailyResult = await fetchDailyData(dateString);
            if (dailyResult) {
                data.push(...dailyResult); // Push all daily results (with date field) into the array
            }

            currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
            await delay(1000); // Wait for 1 second to respect the rate limit
        }

        setDailyData(data);
        setLoading(false);
    };


    useEffect(() => {
        if (employeeInformation.number) {
            const startDate = new Date(); // Set your desired start date
            startDate.setDate(1); // Set to the first day of the month
            const endDate = new Date(); // Set to today's date (current date)
            // const endDate = new Date(startDate);
            // endDate.setMonth(endDate.getMonth() + 1);
            // endDate.setDate(0); // Set to the last day of the month

            fetchMonthlyData(startDate, endDate);
        }
    }, [employeeInformation]);


    console.log("dailyData", dailyData);
    const getTargetTime = (joiningDate) => {
        // Parse the joining date to a Date object
        const joinDate = new Date(joiningDate);
        const today = new Date();

        // Calculate the difference in months
        const diffInMonths = (today.getFullYear() - joinDate.getFullYear()) * 12 + (today.getMonth() - joinDate.getMonth());

        // Determine the target time
        const targetTime = diffInMonths <= 1 ? "1:30:00" : "2:00:00";

        return targetTime;
    };
    const getTargetStatus = (totalDuration, targetTime) => {
        const targetSeconds = convertHMSToSeconds(targetTime);
        const totalSeconds = convertHMSToSeconds(totalDuration);

        return totalSeconds >= targetSeconds ? "Achieved" : "Failed";
    }
    const formatDateToDDMMYYYY = (date) => {
        const [year, month, day] = date.split('-');
        return `${day}-${month}-${year}`;
    };


    return (
        <div className="calling-report-view mt-3">
            <div className='d-flex mb-3 align-items-center justify-content-between pl-1 pr-1'>
                <div className='d-flex align-items-center justify-content-start'>
                    <div className='form-group'>
                        <select className='form-select'>
                            <option disabled selected>--Select Year--</option>
                        </select>
                    </div>
                    <div className='form-group ml-1'>
                        <select className='form-select'>
                            <option disabled selected>--Select Month--</option>
                        </select>
                    </div>
                </div>
                <div className="d-flex align-items-center justify-content-start">
                    <button className='btn action-btn-alert'>Not Achieved: 2</button>
                </div>
            </div>
            <div className='pl-1 pr-1'>
                <div className="table table-responsive table-style-2 m-0" style={{ maxHeight: "calc(100vh - 307px)", overflow: "auto" }}>
                    <table className="table table-vcenter table-nowrap">
                        <thead>
                            <tr className="tr-sticky">
                                <th>Sr. No</th>
                                <th>Date</th>
                                {/* <th>Outgoing</th>
                            <th>Incoming</th> */}
                                <th>Unique Clients</th>
                                <th>Total</th>
                                <th>Call Duration</th>
                                <th>Target</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        {loading ? (
                           <tbody>
                           <tr>
                             <td colSpan="7" >
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
                        ) : dailyData && dailyData.length !== 0 ?
                            (<tbody>
                                {dailyData.map((item, index) => {
                                    const targetTime = getTargetTime(employeeInformation.jdate);
                                    const status = getTargetStatus(convertSecondsToHMS(item.total_duration), targetTime);
                                    const badgeClass = status === "Achieved" ? 'badge-completed' : 'badge-leave';
                                    return (
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td>{formatDateToDDMMYYYY(item.date)}</td>
                                            <td>{item.total_unique_clients}</td>
                                            <td>{item.total_calls}</td>
                                            <td>{convertSecondsToHMS(item.total_duration)}</td>
                                            <td>{getTargetTime(employeeInformation.jdate)}</td>
                                            <td>
                                            <span className={`badge ${badgeClass}`}>
                                                    {getTargetStatus(convertSecondsToHMS(item.total_duration), getTargetTime(employeeInformation.jdate))}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })
                                }

                            </tbody>
                            ) : (dailyData.length === 0 && !loading && (
                                <tbody>
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: "center" }}>
                                            <Nodata />
                                        </td>
                                    </tr>
                                </tbody>
                            )
                            )}
                    </table>
                </div>
            </div>
        </div>
    );
}

export default CallingReportView;