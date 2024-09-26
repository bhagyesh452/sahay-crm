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
import { format } from 'date-fns';

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

    const [callingData, setCallingData] = useState([])
    const fetchCallingDate = async () => {
        try {
            const response = await axios.get(`${secretKey}/employee/employee-calling-fetch/${employeeInformation.number}`);
            const data = response.data.data;

            if (Array.isArray(data) && data.length > 0) {
                // Safely access nested properties using optional chaining
                const dailyData = data[0]?.year?.[0]?.monthly_data?.[0]?.daily_data;

                if (dailyData) {
                    setCallingData(dailyData.sort((a, b) => new Date(a.date) - new Date(b.date))); // Set the data only if it exists
                    console.log("dailyData", dailyData);
                } else {
                    console.error("Daily data is missing or not in the expected structure");
                }
            } else {
                console.error("No data found for the employee");
            }
        } catch (err) {
            console.log("Error fetching calling data:", err);
        }
    };

    console.log("callingData", callingData)
    //console.log("dailyData", dailyData);
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

    useEffect(() => {
        fetchCallingDate();
    }, [employeeInformation])

    // ------------------------filter functions------------------------------

    const year = new Date().getFullYear();
    const month = new Date().getMonth(); // Get the current month (0-based)

    const getCurrentMonthName = (monthIndex) => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return months[monthIndex];
    };

    const [selectedYear, setSelectedYear] = useState(year);
    const [months, setMonths] = useState([]); // Array of months to display in the dropdown
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthName(month));

    // Function to generate the array of months based on the selected year
    const generateMonthArray = (year) => {
        const monthArray = [];
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth(); // Get the current month (0-based)

        // If the selected year is the current year, show remaining months starting from the current month
        if (year === currentYear) {
            for (let m = currentMonth; m <= 11; m++) {
                monthArray.push(format(new Date(year, m), 'MMMM'));
            }
        } else {
            // For future years, show all 12 months
            for (let m = 0; m <= 11; m++) {
                monthArray.push(format(new Date(year, m), 'MMMM'));
            }
        }
        setMonths(monthArray); // Update the months array
    };

    // On component mount, set the months array for the current year
    useEffect(() => {
        generateMonthArray(year); // Populate the months array when the component mounts
    }, [year]);


    const handleYearChange = (e) => {
        const newYear = parseInt(e.target.value, 10);
        setSelectedYear(newYear);
        generateMonthArray(newYear); // Update the months based on the selected year

        // If a new year is selected, reset to the first month of that year
        setSelectedMonth(newYear === year ? getCurrentMonthName(month) : 'January');
    };

    const handleMonthChange = async (e) => {
        const emp_number = employeeInformation.number;
        const month = e.target.value;
        const monthNamesToNumbers = {
            "January": "01",
            "February": "02",
            "March": "03",
            "April": "04",
            "May": "05",
            "June": "06",
            "July": "07",
            "August": "08",
            "September": "09",
            "October": "10",
            "November": "11",
            "December": "12"
        };
        const monthNumber = monthNamesToNumbers[month];

        console.log("emp_number:", emp_number);
        console.log("year:", selectedYear);
        console.log("monthNumber:", monthNumber);

        setSelectedMonth(month);

        try {
            const response = await axios.get(`${secretKey}/employee/employee-calling/filter`, {
                params: {
                    emp_number: emp_number,
                    year: String(selectedYear),
                    month: monthNumber,
                },
            });
            console.log("response", response.data.data)
            if (response.status === 200) {

                const dailyData = response.data.data?.daily_data;

                if (dailyData) {
                    setCallingData(dailyData.sort((a, b) => new Date(a.date) - new Date(b.date))); // Sort by date
                    console.log("Filtered dailyData", dailyData);
                } else {
                    console.error("Daily data is missing or not in the expected structure");
                }
            }
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };



    return (
        <div className="calling-report-view mt-3">
            <div className='d-flex mb-3 align-items-center justify-content-between pl-1 pr-1'>
                <div className='d-flex align-items-center justify-content-start'>
                    <div className='form-group'>
                        <select className='form-select'
                            value={selectedYear}
                            onChange={handleYearChange}
                        >
                            {/* <option disabled value="" selected>--Select Year--</option> Default option */}
                            <option value={2024}>2024</option>
                            <option value={2025}>2025</option>

                        </select>
                    </div>
                    <div className='form-group ml-1'>
                        <select className='form-select'
                            value={selectedMonth}
                            onChange={handleMonthChange}
                        >
                            {/* <option disabled value="" selected>--Select Month--</option> */}
                            {months.map(month => (
                                <option key={month} value={month}>{month}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="d-flex align-items-center justify-content-start">
                    <button className='btn action-btn-alert'>
                        Not Achieved:
                        {callingData && callingData.length > 0 ? (
                            // Map over dailyData and filter for "Failed" statuses
                            callingData.map((obj) => {
                                const totalDuration = convertSecondsToHMS(obj.total_duration);
                                const targetTime = getTargetTime(employeeInformation.jdate);

                                return getTargetStatus(totalDuration, targetTime);
                            })
                                .reduce((totalFailed, status) => {
                                    // Count how many are "Failed"
                                    return status === "Failed" ? totalFailed + 1 : totalFailed;
                                }, 0)
                        ) : 0}
                    </button>
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
                        ) : callingData && callingData.length !== 0 ?
                            (
                                <tbody>
                                    {callingData.map((item, index) => {
                                        const targetTime = getTargetTime(employeeInformation.jdate);
                                        const status = getTargetStatus(convertSecondsToHMS(item.total_duration), targetTime);
                                        const badgeClass = status === "Achieved" ? 'badge-completed' : 'badge-leave';
                                        const dateObject = new Date(item.date);
                                        const isSunday = dateObject.getDay() === 0;
                                        {}
                                        return (
                                            <tr>
                                                <td>{index + 1}</td>
                                                <td>{formatDateToDDMMYYYY(item.date)}</td>
                                                <td>{isSunday ? "Sunday" : item.total_unique_clients}</td>
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
                            ) : (callingData.length === 0 && !loading && (
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