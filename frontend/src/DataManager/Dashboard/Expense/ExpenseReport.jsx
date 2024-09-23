import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ClipLoader from "react-spinners/ClipLoader";
import Nodata from '../../Components/Nodata/Nodata';
import { MdDelete } from "react-icons/md";
import Swal from 'sweetalert2';
import Calendar from "@mui/icons-material/Event";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import moment from "moment";
import { StaticDateRangePicker } from "@mui/x-date-pickers-pro/StaticDateRangePicker";
import Header from '../../Components/Header/Header';
import Navbar from '../../Components/Navbar/Navbar';


function ExpenseReport() {

    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const userId = localStorage.getItem("dataManagerUserId");
    const dataManagerName = localStorage.getItem("dataManagerName");


    const [myInfo, setMyInfo] = useState([]);
    const [expenseReport, setExpenseReport] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [serviceName, setServiceName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [dateRange, setDateRange] = useState([null, null]);

    const formatSalary = (amount) => {
        return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const handleDateRangeChange = (newValue) => {
        setDateRange(newValue);
        if (newValue[0] && newValue[1]) {
            const startDateEmp = new Date(newValue[0]);
            const endDateEmp = new Date(newValue[1]);
        }
    };

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

    const storeExpenseReport = async () => {
        try {
            const res = await axios.get(`${secretKey}/bookings/fetchRemainingExpenseServices`);
            // console.log("Expense report is :", res.data);
            fetchExpenseReport();
        } catch (error) {
            console.log("Error fetching expesne report :", error);
        }
    };

    const fetchPersonalInfo = async () => {
        try {
            const res = await axios.get(`${secretKey}/employee/fetchEmployeeFromId/${userId}`);
            // console.log("Personal Info :", res.data.data);
            setMyInfo(res.data.data);
        } catch (error) {
            console.log("Error fetching employee data :", error);
        }
    };

    useEffect(() => {
        storeExpenseReport();
        fetchPersonalInfo();
    }, []);

    const fetchExpenseReport = async () => {
        try {
            setIsLoading(true);
            // Build the query parameters based on selected filters
            const params = {};
            if (serviceName) params.serviceName = serviceName;
            if (companyName) params.companyName = companyName;
            if (dateRange[0] && dateRange[1]) {
                params.startDate = new Date(dateRange[0]); // Start of the day
                params.endDate = new Date(dateRange[1]); // End of the day
                params.endDate.setHours(23, 59, 59, 999); // Set time to the end of the day

                // console.log("Sending Start Date:", params.startDate);
                // console.log("Sending End Date:", params.endDate);
            }

            const res = await axios.get(`${secretKey}/expense/fetchExpenseReports`, { params });
            // console.log("Expense report successfully fetched :", res.data.data);
            setExpenseReport(res.data.data.filter((data) => data.isDeleted === false));
        } catch (error) {
            console.log("Error fetching expense report:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Trigger fetching of expense report data when filter changes
    useEffect(() => {
        fetchExpenseReport();
    }, [serviceName, companyName, dateRange]); // Re-fetch whenever serviceName or companyName changes

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.put(`${secretKey}/expense/updateExpenseReportDeleteField/${id}`);
                    // console.log("Service successfully deleted :", res.data.data);
                    fetchExpenseReport();
                    Swal.fire('Deleted!', 'Service has been deleted', 'success');
                } catch (error) {
                    console.log("Error deleting service :", error);
                    Swal.fire('Error!', 'Error deleting service', 'error');
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled', 'Service data is safe', 'info');
            }
        });
    };

    const renderRows = () => {
        if (expenseReport.length === 0) {
            return (
                <tr>
                    <td colSpan="8"><Nodata /></td>
                </tr>
            );
        }

        return expenseReport.map((report, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{report.companyName}</td>
                <td>{report.serviceName}</td>
                <td>{formatDate(report.bookingDate)}</td>
                <td>₹ {formatSalary(report.totalPayment)}</td>
                <td>₹ {formatSalary(report.receivedPayment)}</td>
                <td>₹ {formatSalary(report.remainingPayment)}</td>
                <td className='cursor-pointer'><MdDelete onClick={() => handleDelete(report._id)} /></td>
            </tr>
        ));
    };

    return (
        <div>
            <Header id={myInfo._id} name={myInfo.ename} empProfile={myInfo.profilePhoto && myInfo.profilePhoto.length !== 0 && myInfo.profilePhoto[0].filename} gender={myInfo.gender} designation={myInfo.newDesignation} />
            <Navbar name={dataManagerName} />
            <div className="page-wrapper">

                <div className="page-header d-print-none">
                    <div className="container-xl my-2">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">

                                <div className="btn-group mr-2">
                                    <h2 className="m-0">
                                        Expense Report
                                    </h2>
                                </div>

                                <div class="btn-group mr-1" role="group" aria-label="Basic example">
                                    <select
                                        className="form-select"
                                        id={`branch-filter`}
                                        onChange={(e) => setServiceName(e.target.value)}
                                    >
                                        <option value="" selected>Select Service Name</option>
                                        <option value="Start-Up India Certificate">Start-Up India Certificate</option>
                                        <option value="ISO Certificate">ISO Certificate</option>
                                        <option value="IEC CODE Certificate">IEC CODE Certificate</option>
                                        <option value="FSSAI Certificate">FSSAI Certificate</option>
                                        <option value="APEDA Certificate">APEDA Certificate</option>
                                        <option value="Company Incorporation">Company Incorporation</option>
                                        <option value="Organization DSC">Organization DSC</option>
                                        <option value="Director DSC">Director DSC</option>
                                        <option value="Website Development">Website Development</option>
                                        <option value="App Design & Development">App Design & Development</option>
                                        <option value="Web Application Development">Web Application Development</option>
                                        <option value="Software Development">Software Development</option>
                                        <option value="CRM Development">CRM Development</option>
                                        <option value="ERP Development">ERP Development</option>
                                        <option value="E-Commerce Website">E-Commerce Website</option>
                                        <option value="GST Registration Application Support">GST Registration Application Support</option>
                                    </select>
                                </div>

                                <div class="btn-group" role="group" aria-label="Basic example">
                                    <LocalizationProvider
                                        dateAdapter={AdapterDayjs} >
                                        <DemoContainer
                                            components={["SingleInputDateRangeField"]} sx={{
                                                padding: '0px',
                                                with: '220px'
                                            }}  >
                                            <DateRangePicker
                                                className="form-control my-date-picker form-control-sm p-0"
                                                value={dateRange}
                                                onChange={handleDateRangeChange}
                                                slots={{ field: SingleInputDateRangeField }}
                                                slotProps={{
                                                    shortcuts: {
                                                        items: shortcutsItems,
                                                    },
                                                    actionBar: { actions: [] },
                                                    textField: {
                                                        InputProps: { endAdornment: <Calendar /> },
                                                    },
                                                }}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
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
                                        type="text"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        className="form-control search-cantrol mybtn"
                                        placeholder="Enter Company Name"
                                        name="bdeName-search"
                                        id="bdeName-search" />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="card mx-6">
                    <div className="card-body p-0">
                        <div id="table-default"
                            style={{
                                overflowX: "auto",
                                overflowY: "auto",
                                maxHeight: "60vh",
                            }}
                        >
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    border: "1px solid #ddd",
                                }}
                                className="table-vcenter table-nowrap "
                            >

                                <thead className="admin-dash-tbl-thead">
                                    <tr className="tr-sticky">
                                        <th>Sr. No</th>
                                        <th>Company Name</th>
                                        <th>Service Name</th>
                                        <th>Booking Date</th>
                                        <th>Total Payment</th>
                                        <th>Received Payment</th>
                                        <th>Remaining Payment</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="6">
                                                <div className="LoaderTDSatyle w-100">
                                                    <ClipLoader
                                                        color="lightgrey"
                                                        size={30}
                                                        aria-label="Loading Spinner"
                                                        data-testid="loader"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        renderRows()
                                    )}
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExpenseReport;