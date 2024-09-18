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
import FilterTableCallingReport from './FilterTableCallingReport';
import { BsFilter } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import jsPDF and jsPDF AutoTable for generating PDFs
import * as XLSX from 'xlsx';


function EmployeeCompleteCallingReport() {
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


    //Set todayStartDate to the start of the day in UTC
    todayStartDate.setUTCHours(4, 0, 0, 0);

    //Set todayEndDate to the end of the day in UTC
    todayEndDate.setUTCHours(13, 0, 0, 0);

    // Convert to Unix timestamps (seconds since epoch)
    const startTimestamp = Math.floor(todayStartDate.getTime() / 1000);
    const endTimestamp = Math.floor(todayEndDate.getTime() / 1000);

    let employeeArray = []
    employeeArray.push(employeeData.number);

    // useEffect(() => {
    //     const fetchEmployeeData = async () => {
    //         const apiKey = process.env.REACT_APP_API_KEY; // Ensure this is set in your .env file
    //         const url = 'https://api1.callyzer.co/v2/call-log/employee-summary';
    //         const urlEmployee = 'https://api1.callyzer.co/v2/employee/get';

    //         const body = {
    //             "call_from": startTimestamp,
    //             "call_to": endTimestamp,
    //             "call_types": ["Missed", "Rejected", "Incoming", "Outgoing"],
    //             "emp_numbers": employeeArray,
    //             // "working_hour_from": "00:00",
    //             // "working_hour_to": "20:59",
    //             // "is_exclude_numbers": true
    //         }

    //         try {
    //             setLoading(true)
    //             const response = await fetch(url, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Authorization': `Bearer ${apiKey}`,
    //                     'Content-Type': 'application/json'
    //                 },
    //                 body: JSON.stringify(body)
    //             });

    //             if (!response.ok) {
    //                 const errorData = await response.json();
    //                 throw new Error(`Error: ${response.status} - ${errorData.message || response.statusText}`);
    //             }
    //             // if (!response2.ok) {
    //             //     const errorData = await response2.json();
    //             //     throw new Error(`Error: ${response2.status} - ${errorData.message || response2.statusText}`);
    //             // }
    //             const data = await response.json();




    //             setTotalCalls(data.result);
    //             setFilteredTotalCalls(data.result)
    //             setCompleteTotalCalls(data.result)

    //             // setTotalCalls(data.result);
    //             //console.log("data", data.result)

    //         } catch (err) {

    //             console.log(err)
    //         } finally {
    //             setLoading(false)
    //         }
    //     };
    //     fetchEmployeeData();
    // }, [employeeData]);

    useEffect(() => {
        const fetchEmployeeData = async () => {
            const apiKey = process.env.REACT_APP_API_KEY; // Ensure this is set in your .env file
            const url = 'https://api1.callyzer.co/v2/call-log/employee-summary';

            const body = {
                "call_from": startTimestamp,
                "call_to": endTimestamp,
                "call_types": ["Missed", "Rejected", "Incoming", "Outgoing"],
                "emp_numbers": employeeArray
            };
            console.log("body", JSON.stringify(body));

            try {
                setLoading(true);

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
                setTotalCalls(data.result);
                setFilteredTotalCalls(data.result);
                setCompleteTotalCalls(data.result);

                // Construct the query parameters
                const queryParamsObject = {
                    "emp_numbers": ["9054102434"],
                };

                // Convert queryParamsObject to query string
                const queryParams = new URLSearchParams(queryParamsObject).toString();
                const urlEmployee = "https://api1.callyzer.co/v2/employee/get"
                const empNumbers = ["9054102434", "1234567890", "9876543210"];
                // const fullUrl = `${urlEmployee}?${queryParams}`;
                // console.log("queryParamas", queryParams);
                // console.log("fullUrl", fullUrl);

                // // GET request to the employee API
                // const response2 = await fetch(fullUrl, {
                //     method: 'GET', // Use GET for querying data
                //     headers: {
                //         'Authorization': `Bearer ${apiKey}`,
                //         'Content-Type': 'application/json'
                //     }
                // });
                //const urlEmployee = `https://api1.callyzer.co/v2/employee/get?emp_numbers=${JSON.stringify(empNumbers)}`;

                // const response2 = await axios({
                //     method: 'get',
                //     url: 'https://api1.callyzer.co/v2/employee/get',
                //     headers: {
                //         'Authorization': `Bearer ${apiKey}`,

                //         'Content-Type': 'application/json'
                //     },
                //     data: JSON.stringify(queryParamsObject)
                // });
                const response2 = fetch(`/${secretKey}/fetch-api-data`, {
                    method: 'POST',
                    headers: {
                        
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(queryParamsObject)
                })
                .then(response => response.json())
                .then(data => console.log('Data from external API:', data))
                .catch(error => console.error('Error:', error));

                // Check for errors in the GET request
                if (!response2.ok) {
                    const errorData = await response2.json();
                    throw new Error(`Error: ${response2.status} - ${errorData.message || response2.statusText}`);
                }

                // Process the GET response
                const newData = await response2.json();
                console.log(newData);

            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeData();
    }, [employeeData]);




    const convertSecondsToHMS = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 3600 % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    // -----------------------filter functions----------------------


    const handleSingleDateSelection = async (formattedDate) => {
        // Convert formattedDate to a moment object in IST timezone
        const date = moment(formattedDate, "DD/MM/YYYY").utcOffset('+05:30'); // Adjust to IST

        // Set specific times for start and end of the day in IST
        const startOfDay = date.set({ hour: 9, minute: 30, second: 0, millisecond: 0 }).unix(); // 9:30 AM IST
        const endOfDay = date.set({ hour: 18, minute: 30, second: 0, millisecond: 0 }).unix(); // 6:30 PM IST

        // Set the timestamps
        const startTimestamp = startOfDay;
        const endTimestamp = endOfDay;

        // console.log("Start of Day (UTC):", moment.unix(startOfDay).utc().format());
        // console.log("End of Day (UTC):", moment.unix(endOfDay).utc().format());
        // console.log("Start of Day (IST):", moment.unix(startOfDay).format());
        // console.log("End of Day (IST):", moment.unix(endOfDay).format());
        console.log(startTimestamp, endTimestamp)
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
                setLoading(true)
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
                setCompleteTotalCalls(data.result)
                console.log("Data fetched:", data.result);

            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false)
            }
        };
        // Call the fetch function
        fetchEmployeeData();
    };

    const formatDate = (dateString) => {
        // Parse the date string as IST
        const date = moment(dateString, "YYYY-MM-DD HH:mm:ss").utcOffset('+05:30');

        // Format the date
        return date.format('DD MMM YYYY, h:mm:ss A');
    };
    // const formatDate = (dateString) => {
    //     const date = new Date(dateString);
    //     const options = { 
    //         year: 'numeric', 
    //         month: 'long', 
    //         day: 'numeric', 
    //         hour: '2-digit', 
    //         minute: '2-digit', 
    //         second: '2-digit', 
    //         timeZoneName: 'short'
    //     };
    //     return date.toLocaleDateString('en-IN', options);
    // };

    const formatToIST = (dateString) => {
        // Remove the "IST" part and replace the space between date and time with "T"
        const cleanedDateString = dateString.replace(' IST', '').replace(' ', 'T');

        const utcDate = new Date(cleanedDateString);  // Parse the cleaned UTC date
        if (isNaN(utcDate)) {
            return 'Invalid Date'; // Handle invalid date
        }

        // Create a new Date object with the IST offset of +5:30 hours
        const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000));

        // Format the IST date
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        };
        return istDate.toLocaleString('en-IN', options);
    };


    // ------------------------------------filter functions-------------------------
    const handleFilter = (newData) => {
        setFilteredData(newData)
        setTotalCalls(newData);
    };


    const handleFilterClick = (field) => {
        if (activeFilterField === field) {
            setShowFilterMenu(!showFilterMenu);

        } else {
            setActiveFilterField(field);
            setShowFilterMenu(true);
            const rect = fieldRefs.current[field].getBoundingClientRect();
            setFilterPosition({ top: rect.bottom, left: rect.left });
        }
    };
    const isActiveField = (field) => activeFilterFields.includes(field);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            const handleClickOutside = (event) => {
                if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
                    setShowFilterMenu(false);

                }
            };
            document.addEventListener('mousedown', handleClickOutside);

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, []);
    console.log("totalcalls", totalcalls)

    // --------------------function to download pdf report----------------
    const handleDownloadPDF = () => {
        const doc = new jsPDF('l', 'mm', [297, 210]); // 'p' for portrait, 'mm' for units in millimeters, 'a4' for paper size

        // Add a heading
        doc.setFontSize(16);
        const pageWidth = doc.internal.pageSize.getWidth();
        const title = "Employee Calls Report";
        const titleWidth = doc.getStringUnitWidth(title) * doc.internal.scaleFactor;
        const titleX = (pageWidth - titleWidth) / 2.3;
        doc.text(title, titleX, 22); // Title centered horizontally at position (titleX, 22)

        // Define columns including Serial No
        const columns = ["Serial No", "Employee Name", "Branch Name", "Total Calls", "Unique Clients", "Total Duration", "Last Synced At"];

        // Map rows data
        const rows = totalcalls.filter(employee => employeeData
            .some(obj => Number(obj.number) === Number(employee.emp_number)))
            .map((call, index) => {
                // Find branch name based on emp_number
                const branch = employeeData.find(employee => Number(employee.number) === Number(call.emp_number))?.branchOffice || '-';

                return [
                    index + 1, // Serial number
                    call.emp_name || '-',
                    branch,
                    call.total_calls || 0,
                    call.total_unique_clients || 0,
                    convertSecondsToHMS(call.total_duration) || '00:00:00',
                    formatDate(call.last_call_log.synced_at) || "00:00:00"// Ensure formatDate is defined
                ];
            });

        // Add table with customized styles
        doc.autoTable({
            head: [columns],
            body: rows,
            margin: { top: 30 }, // Adjust top margin to fit the header
            styles: {
                cellPadding: 2,
                fontSize: 8, // Reduce font size to fit data on one page
                overflow: 'linebreak',
            },
            headStyles: {
                fillColor: [22, 160, 133], // Header background color
                fontSize: 10 // Slightly larger font for the header
            },
            rowPageBreak: 'avoid', // Avoid page breaks inside rows
            didDrawPage: () => {
                // Draw border around the entire page
                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();
                doc.setDrawColor(0, 0, 0); // Black color for border
                doc.setLineWidth(0.2); // Border width
                doc.rect(10, 10, pageWidth - 20, pageHeight - 20); // Draw border with margins
            }
        });

        // Save the PDF
        doc.save('employee-calls-report.pdf');
    };

    const handleDownloadExcel = () => {
        // Define the columns
        const columns = ["Serial No", "Employee Name", "Branch Name", "Total Calls", "Unique Clients", "Total Duration", "Last Synced At"];

        // Map rows data
        const rows = totalcalls.filter(employee => employeeData
            .some(obj => Number(obj.number) === Number(employee.emp_number)))
            .map((call, index) => {
                // Find branch name based on emp_number
                const branch = employeeData.find(employee => Number(employee.number) === Number(call.emp_number))?.branchOffice || '-';

                return [
                    index + 1, // Serial number
                    call.emp_name || '-',
                    branch,
                    call.total_calls || 0,
                    call.total_unique_clients || 0,
                    convertSecondsToHMS(call.total_duration) || '00:00:00',
                    formatDate(call.last_call_log.synced_at) || "00:00:00" // Ensure formatDate is defined
                ];
            });

        // Combine columns and rows
        const worksheetData = [columns, ...rows];

        // Create a new workbook and add the worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(wb, ws, 'Employee Calls Report');

        // Write the Excel file and trigger download
        XLSX.writeFile(wb, 'employee-calls-report.xlsx');
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
                            <div>
                                <button className="btn btn-primary mr-1"
                                    onClick={handleDownloadExcel}
                                >
                                    Download CSV
                                </button>

                            </div>
                            <div>
                                <button className="btn btn-primary mr-1"
                                    onClick={handleDownloadPDF}
                                >
                                    Download PDF
                                </button>

                            </div>
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
                                        // label="Basic date picker"
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </div>

                        </div>
                    </div>
                    <div className='card-body'>
                        <div className="tbl-scroll" style={{ width: "100%", height: "500px" }}>
                            <table className="table-vcenter table-nowrap admin-dash-tbl" style={{ width: "100%" }}>
                                <thead className="admin-dash-tbl-thead">
                                    <tr>
                                        <th>
                                            Sr.No
                                        </th>
                                        <th>
                                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                                <div ref={el => fieldRefs.current['emp_name'] = el}>
                                                    BDE/BDM Name
                                                </div>

                                                <div className='RM_filter_icon' style={{ color: "black" }}>
                                                    {isActiveField('emp_name') ? (
                                                        <FaFilter onClick={() => handleFilterClick("emp_name")} />
                                                    ) : (
                                                        <BsFilter onClick={() => handleFilterClick("emp_name")} />
                                                    )}
                                                </div>
                                                {/* ---------------------filter component--------------------------- */}
                                                {showFilterMenu && activeFilterField === 'emp_name' && (
                                                    <div
                                                        ref={filterMenuRef}
                                                        className="filter-menu"
                                                        style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                    >
                                                        <FilterTableCallingReport
                                                            //noofItems={setnoOfAvailableData}
                                                            allFilterFields={setActiveFilterFields}
                                                            filteredData={filteredData}
                                                            //activeTab={"None"}
                                                            employeeData={employeeData}
                                                            data={totalcalls}
                                                            filterField={activeFilterField}
                                                            onFilter={handleFilter}
                                                            completeData={completeTotalCalls}
                                                            showingMenu={setShowFilterMenu}
                                                            dataForFilter={filteredTotalCalls}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                        <th>
                                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                                <div ref={el => fieldRefs.current['branchOffice'] = el}>
                                                    Branch Name
                                                </div>

                                                <div className='RM_filter_icon' style={{ color: "black" }}>
                                                    {isActiveField('branchOffice') ? (
                                                        <FaFilter onClick={() => handleFilterClick("branchOffice")} />
                                                    ) : (
                                                        <BsFilter onClick={() => handleFilterClick("branchOffice")} />
                                                    )}
                                                </div>
                                                {/* ---------------------filter component--------------------------- */}
                                                {showFilterMenu && activeFilterField === 'branchOffice' && (
                                                    <div
                                                        ref={filterMenuRef}
                                                        className="filter-menu"
                                                        style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                    >
                                                        <FilterTableCallingReport
                                                            //noofItems={setnoOfAvailableData}
                                                            allFilterFields={setActiveFilterFields}
                                                            filteredData={filteredData}
                                                            //activeTab={"None"}
                                                            employeeData={employeeData}
                                                            data={totalcalls}
                                                            filterField={activeFilterField}
                                                            onFilter={handleFilter}
                                                            completeData={completeTotalCalls}
                                                            showingMenu={setShowFilterMenu}
                                                            dataForFilter={filteredTotalCalls}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                        <th>
                                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                                <div ref={el => fieldRefs.current['total_calls'] = el}>
                                                    Total Calls
                                                </div>

                                                <div className='RM_filter_icon' style={{ color: "black" }}>
                                                    {isActiveField('total_calls') ? (
                                                        <FaFilter onClick={() => handleFilterClick("total_calls")} />
                                                    ) : (
                                                        <BsFilter onClick={() => handleFilterClick("total_calls")} />
                                                    )}
                                                </div>
                                                {/* ---------------------filter component--------------------------- */}
                                                {showFilterMenu && activeFilterField === 'total_calls' && (
                                                    <div
                                                        ref={filterMenuRef}
                                                        className="filter-menu"
                                                        style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                    >
                                                        <FilterTableCallingReport
                                                            //noofItems={setnoOfAvailableData}
                                                            allFilterFields={setActiveFilterFields}
                                                            filteredData={filteredData}
                                                            //activeTab={"None"}
                                                            employeeData={employeeData}
                                                            data={totalcalls}
                                                            filterField={activeFilterField}
                                                            onFilter={handleFilter}
                                                            completeData={completeTotalCalls}
                                                            showingMenu={setShowFilterMenu}
                                                            dataForFilter={filteredTotalCalls}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                        <th>
                                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                                <div ref={el => fieldRefs.current['total_unique_clients'] = el}>
                                                    Unique Clients
                                                </div>

                                                <div className='RM_filter_icon' style={{ color: "black" }}>
                                                    {isActiveField('total_unique_clients') ? (
                                                        <FaFilter onClick={() => handleFilterClick("total_unique_clients")} />
                                                    ) : (
                                                        <BsFilter onClick={() => handleFilterClick("total_unique_clients")} />
                                                    )}
                                                </div>
                                                {/* ---------------------filter component--------------------------- */}
                                                {showFilterMenu && activeFilterField === 'total_unique_clients' && (
                                                    <div
                                                        ref={filterMenuRef}
                                                        className="filter-menu"
                                                        style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                    >
                                                        <FilterTableCallingReport
                                                            //noofItems={setnoOfAvailableData}
                                                            allFilterFields={setActiveFilterFields}
                                                            filteredData={filteredData}
                                                            //activeTab={"None"}
                                                            employeeData={employeeData}
                                                            data={totalcalls}
                                                            filterField={activeFilterField}
                                                            onFilter={handleFilter}
                                                            completeData={completeTotalCalls}
                                                            showingMenu={setShowFilterMenu}
                                                            dataForFilter={filteredTotalCalls}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                        <th>
                                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                                <div ref={el => fieldRefs.current['total_duration'] = el}>
                                                    Total Call Duration
                                                </div>

                                                <div className='RM_filter_icon' style={{ color: "black" }}>
                                                    {isActiveField('total_duration') ? (
                                                        <FaFilter onClick={() => handleFilterClick("total_duration")} />
                                                    ) : (
                                                        <BsFilter onClick={() => handleFilterClick("total_duration")} />
                                                    )}
                                                </div>
                                                {/* ---------------------filter component--------------------------- */}
                                                {showFilterMenu && activeFilterField === 'total_duration' && (
                                                    <div
                                                        ref={filterMenuRef}
                                                        className="filter-menu"
                                                        style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                    >
                                                        <FilterTableCallingReport
                                                            //noofItems={setnoOfAvailableData}
                                                            allFilterFields={setActiveFilterFields}
                                                            filteredData={filteredData}
                                                            //activeTab={"None"}
                                                            employeeData={employeeData}
                                                            data={totalcalls}
                                                            filterField={activeFilterField}
                                                            onFilter={handleFilter}
                                                            completeData={completeTotalCalls}
                                                            showingMenu={setShowFilterMenu}
                                                            dataForFilter={filteredTotalCalls}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                        <th>
                                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                                <div ref={el => fieldRefs.current['last_call_log.synced_at'] = el}>
                                                    Last Sync Time
                                                </div>

                                                <div className='RM_filter_icon' style={{ color: "black" }}>
                                                    {isActiveField('last_call_log.synced_at') ? (
                                                        <FaFilter onClick={() => handleFilterClick("last_call_log.synced_at")} />
                                                    ) : (
                                                        <BsFilter onClick={() => handleFilterClick("last_call_log.synced_at")} />
                                                    )}
                                                </div>
                                                {/* ---------------------filter component--------------------------- */}
                                                {showFilterMenu && activeFilterField === 'last_call_log.synced_at' && (
                                                    <div
                                                        ref={filterMenuRef}
                                                        className="filter-menu"
                                                        style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                    >
                                                        <FilterTableCallingReport
                                                            //noofItems={setnoOfAvailableData}
                                                            allFilterFields={setActiveFilterFields}
                                                            filteredData={filteredData}
                                                            //activeTab={"None"}
                                                            employeeData={employeeData}
                                                            data={totalcalls}
                                                            filterField={activeFilterField}
                                                            onFilter={handleFilter}
                                                            completeData={completeTotalCalls}
                                                            showingMenu={setShowFilterMenu}
                                                            dataForFilter={filteredTotalCalls}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </th>
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
                                                            <td>{formatDate(obj.last_call_log.synced_at)}</td>
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