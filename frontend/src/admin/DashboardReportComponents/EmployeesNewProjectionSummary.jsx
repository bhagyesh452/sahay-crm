import React, { useState, useEffect, useRef } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import moment from "moment";
import { useParams } from "react-router-dom";
import axios from "axios";
import Calendar from "@mui/icons-material/Event";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { IconButton } from "@mui/material";
import { RiEditCircleFill } from "react-icons/ri";
import dayjs from "dayjs";
import Nodata from '../../components/Nodata';
import { FcDatabase } from "react-icons/fc";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MdHistory } from "react-icons/md";


function EmployeesNewProjectionSummary() {

    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const { userId } = useParams();

    const formatDate = (dateString) => {
        if (!dateString) return "N/A"; // Handle undefined or null dates
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Invalid Date"; // Handle invalid date formats
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} , ${year}`;
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-IN').format(amount);
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

    const [isLoading, setIsLoading] = useState(false);
    const [showProjectionDialog, setShowProjectionDialog] = useState(false);
    const [isProjectionEditable, setIsProjectionEditable] = useState(false);
    const [editableProjectionData, setEditableProjectionData] = useState({});
    const [totalEmployees, setTotalEmployees] = useState([]);
    const [projection, setProjection] = useState([]);
    const [companyName, setCompanyName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    const [employeeProjectionData, setEmployeeProjectionData] = useState([])
    const [projectionEname, setProjectionEname] = useState("")
    const [openProjectionTable, setOpenProjectionTable] = useState(false);
    const [historyData, setHistoryData] = useState([])
    const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
    const [historyCompanyName, setHistoryCompanyName] = useState("");
    const [addedOnDate, setAddedOnDate] = useState(null);
    const [filteredProjection, setFilteredProjection] = useState([]);
    const [completeProjection, setCompleteProjection] = useState([]);
    const [filteredData, setFilteredData] = useState([])
    const [branchSearchTerm, setBranchSearchTerm] = useState(''); // Branch office search term
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [filterField, setFilterField] = useState("")
    const filterMenuRef = useRef(null); // Ref for the filter menu container
    const [activeFilterField, setActiveFilterField] = useState(null);
    const [filterPosition, setFilterPosition] = useState({ top: 10, left: 5 });
    const fieldRefs = useRef({});
    const [cleared, setCleared] = useState(false);
    const [activeFilterFields, setActiveFilterFields] = useState([]); // New state for active filter fields
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState("")

    const fetchEmployee = async () => {
        try {
            const res2 = await axios.get(`${secretKey}/employee/einfo`);
            let employees = res2.data.filter(
                (employee) => employee.newDesignation === "Business Development Executive" || employee.newDesignation === "Business Development Manager"
            );

            setTotalEmployees(employees);
        } catch (error) {
            console.log("Unexpected error in fetchEmployee:", error);
        }
    };
    const fetchNewProjection = async (values) => {
        if (values) {
            if (values[0] === null && values[1] === null) {
                setStartDate('');
                setEndDate('');
            } else {
                const startDate = new Date(values[0]);
                const endDate = new Date(values[1]);
                setStartDate(startDate);
                setEndDate(endDate);
            }
        }

        try {
            setIsLoading(true);
            const res = await axios.get(`${secretKey}/company-data/getProjection`, {
                params: {
                    companyName,
                    startDate: startDate || '',
                    endDate: endDate || ''
                }
            });
            console.log("Total projection data is :", res.data.data);

            // Transform the data to calculate the required metrics
            const summary = res.data.data.reduce((acc, company) => {
                const isShared = (company.bdeName !== company.bdmName) && !(company.bdmName === "Vaibhav Acharya" || company.bdmName === "Vishal Goel");


                // Initialize each employee's data if not already in summary
                [company.bdeName, company.bdmName].forEach((employeeName) => {
                    if (!acc[employeeName]) {
                        acc[employeeName] = {
                            total_companies: 0,
                            total_offered_price: 0,
                            total_estimated_payment: 0,
                            total_services: 0,
                        };
                    }
                });

                const serviceCount = company.offeredServices ? company.offeredServices.length : 0;

                if (isShared) {
                    // For shared companies, add 0.5 to company count for each employee
                    acc[company.bdeName].total_companies += 0.5;
                    acc[company.bdmName].total_companies += 0.5;

                    // Add half of the price and payment amounts to each employee
                    acc[company.bdeName].total_offered_price += (company.offeredPrice || 0) * 0.5;
                    acc[company.bdmName].total_offered_price += (company.offeredPrice || 0) * 0.5;

                    acc[company.bdeName].total_estimated_payment += (company.totalPayment || 0) * 0.5;
                    acc[company.bdmName].total_estimated_payment += (company.totalPayment || 0) * 0.5;

                    // Add full service count to each employee without dividing
                    acc[company.bdeName].total_services += serviceCount;
                    acc[company.bdmName].total_services += serviceCount;
                } else {
                    // For non-shared companies, add full count to the single employee
                    acc[company.bdeName].total_companies += 1;

                    acc[company.bdeName].total_offered_price += company.offeredPrice || 0;
                    acc[company.bdeName].total_estimated_payment += company.totalPayment || 0;
                    acc[company.bdeName].total_services += serviceCount;
                }

                return acc;
            }, {});

            // Convert the summary object to an array for easier display
            const summaryArray = Object.entries(summary).map(([ename, values]) => ({
                ename,
                total_companies: values.total_companies,
                total_offered_price: values.total_offered_price,
                total_estimated_payment: values.total_estimated_payment,
                total_services: values.total_services,
            }));

            console.log("Employee Projection Summary:", summaryArray);
            setProjection(summaryArray.filter(data => totalEmployees.some((employee) => employee.ename === data.ename)));
            setFilteredProjection(summaryArray.filter(data => totalEmployees.some((employee) => employee.ename === data.ename)));
        } catch (error) {
            console.log("Error to fetch new projection:", error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenProjectionsForEmployee = async (employeeName) => {
        setProjectionEname(employeeName); // Store the employee name for dialog title
        try {
            setIsLoading(true);
            const res = await axios.get(`${secretKey}/company-data/getProjection/${employeeName}`, {
                params: {
                    companyName,

                }
            });
            console.log("Projection data is :", res.data.data);
            setEmployeeProjectionData(res.data.data);
            setOpenProjectionTable(true); // Open the dialog
        } catch (error) {
            console.log("Error to fetch new projection :", error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }
    const closeProjectionTable = () => setOpenProjectionTable(false);

    useEffect(() => {
        fetchEmployee();
    }, []);

    useEffect(() => {
        // Fetch projections only when totalEmployees has data
        if (totalEmployees && totalEmployees.length > 0) {
            fetchNewProjection();
        }
    }, [totalEmployees]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };


    // ----------projection history function-----------------------------------
    const handleViewHistory = (companyId) => {
        // Find the specific projection that matches the companyId
        const selectedProjection = employeeProjectionData.find(projection => projection._id === companyId);
        console.log("selectedProjection", selectedProjection)
        setHistoryCompanyName(selectedProjection.companyName)
        setAddedOnDate(selectedProjection.addedOnDate)

        // Set history data if found; otherwise, set an empty array
        setHistoryData(selectedProjection ? selectedProjection.history || [] : []);

        // Open the history dialog
        setOpenHistoryDialog(true);
        setOpenProjectionTable(false);
    };

    const handleCloseHistoryDialog = () => {
        setOpenHistoryDialog(false);
        setOpenProjectionTable(true);
    }

    // ----------search function---------------------------------
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        const searchValue = e.target.value.toLowerCase();
        const filteredData = filteredProjection.filter((proj) =>
            proj.ename.toLowerCase().includes(searchValue)
        );
        setProjection(filteredData);
    };

    return (
        <div>
            <div className="col-12 mt-2" id="projectiondashboardemployee">
                <div className="card">
                    <div className="card-header p-1 employeedashboard d-flex align-items-center justify-content-between">
                        
                        <div className="dashboard-title pl-1">
                            <h2 className="m-0">
                                Total Projection Summary
                            </h2>
                        </div>

                        <div className="d-flex align-items-center pr-1">
                            <div class="input-icon mr-1">
                                <span class="input-icon-addon">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                                        <path d="M21 21l-6 -6"></path>
                                    </svg>
                                </span>
                                <input
                                    className="form-control"
                                    value={searchTerm} // bind to searchTerm
                                    onChange={handleSearch} // bind to handleSearch
                                    placeholder="Search by Employee Name..."
                                    type="text"
                                    name="employee-search"
                                    id="employee-search"
                                />
                            </div>

                            {/* <div className="data-filter">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker']} sx={{ padding: '0px', width: '220px' }}>
                                        <DatePicker
                                            className="form-control my-date-picker form-control-sm p-0"
                                            format="DD/MM/YYYY" // Ensures the DatePicker displays and accepts DD/MM/YYYY format
                                            onChange={(value) => {
                                                if (value) {
                                                    // Use dayjs to handle the date conversion and format
                                                    const selectedDate = dayjs(value);

                                                    // Format the selected date to 'YYYY-MM-DD' for backend compatibility
                                                    const formattedDate = selectedDate.format("YYYY-MM-DD");

                                                    // Pass the correctly formatted date to your handler
                                                    handleSingleDateSelection(formattedDate);
                                                }
                                            }}
                                            slotProps={{
                                                field: {
                                                    clearable: true,
                                                    onClear: () => {
                                                        setCleared(true);
                                                        fetchNewProjection(new Date()); // Reset to today's date if cleared
                                                        setSelectedDate(new Date());
                                                    }
                                                },
                                            }}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </div> */}
                        </div>
                    </div>

                    <div className="card-body">
                        <div id="table-default" className="row tbl-scroll">
                            <table className="table-vcenter table-nowrap admin-dash-tbl">
                                <thead className="admin-dash-tbl-thead">
                                    <tr className="tr-sticky"
                                        style={{ 
                                            backgroundColor: "#ffb900",
                                            color: "white",
                                            fontWeight: "bold",
                                        }}>
                                        <th>Sr. No</th>
                                        <th>Employee Name</th>
                                        <th>Total Companies</th>
                                        <th>Offered Services</th>
                                        <th>Total Offered Price</th>
                                        <th>Total Estimated Amount</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {isLoading && <tr>
                                        <td colSpan="11" className="LoaderTDSatyle">
                                            <ClipLoader
                                                color="lightgrey"
                                                loading
                                                size={30}
                                                aria-label="Loading Spinner"
                                                data-testid="loader"
                                            />
                                        </td>
                                    </tr>}

                                    {projection && projection.length > 0 ? (
                                        projection.map((data, index) => (

                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{data.ename}</td>
                                                    <td>
                                                        {data.total_companies}
                                                        <FcDatabase className='ml-1' onClick={() => handleOpenProjectionsForEmployee(data.ename)} />
                                                    </td>
                                                    <td>{data.total_services}</td>
                                                    <td>{formatCurrency(data.total_offered_price)}</td>
                                                    <td>{formatCurrency(data.total_estimated_payment)}</td>
                                                </tr>
                                            ))
                                    ) : (
                                        <tr>
                                            <td className="particular" colSpan="12">
                                                <Nodata />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>

                                {projection && projection.length > 0 && (
                                    <tfoot className="admin-dash-tbl-tfoot">
                                        <tr style={{ fontWeight: 500 }} className="tf-sticky">
                                            <td colSpan="2">Total</td>
                                            <td>{projection.reduce((total, item) => total + item.total_companies, 0)}</td>
                                            <td>{projection.reduce((total, item) => total + item.total_services, 0)}</td>
                                            <td>₹ {formatAmount(projection.reduce((total, item) => total + item.total_offered_price, 0))}</td>
                                            <td>₹ {formatAmount(projection.reduce((total, item) => total + item.total_estimated_payment, 0))}</td>
                                        </tr>
                                    </tfoot>
                                )}

                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* -------------------------------------projection-dashboard--------------------------------------------- */}
            <Dialog
                open={openProjectionTable}
                onClose={closeProjectionTable}
                fullWidth
                maxWidth="lg"
                isDisabled={!openHistoryDialog}
            >
                <DialogTitle>
                    {projectionEname}'s Today's Report{" "}
                    <IconButton
                        onClick={closeProjectionTable}
                        style={{ float: "right" }}
                    >
                        <CloseIcon color="primary" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <div
                        id="table-default"
                        style={{
                            overflowX: "auto",
                            overflowY: "auto",
                        }}
                    >
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                border: "1px solid #ddd",
                                marginBottom: "10px",
                            }}
                            className="table-vcenter table-nowrap"
                        >
                            <thead
                                style={{
                                    position: "sticky",
                                    top: "-1px",
                                    backgroundColor: "#ffb900",
                                    color: "black",
                                    fontWeight: "bold",
                                    zIndex: 1,
                                }}
                            >
                                <tr
                                    style={{
                                        backgroundColor: "#ffb900",
                                        color: "white",
                                        fontWeight: "bold",
                                    }}
                                >
                                    <th>Sr. No</th>
                                    <th>Company Name</th>
                                    <th>BDE Name</th>
                                    <th>BDM Name</th>
                                    <th>Offered Services</th>
                                    <th>Total Offered Price</th>
                                    <th>Expected Amount</th>
                                    <th>Employee Payment</th>
                                    <th>Last Follow Up Date</th>
                                    <th>Estimated Payment Date</th>
                                    <th>Remarks</th>
                                    <th>Added On</th>
                                    <th>Modified On</th>
                                    <th>Is Matured Case</th>
                                    <th>View History</th>

                                </tr>
                            </thead>
                            <tbody>
                                {employeeProjectionData && employeeProjectionData.length > 0 ? (
                                    employeeProjectionData.map((data, index) => (
                                        <tr key={data._id}>
                                            <td>{index + 1}</td>
                                            <td>{data.companyName}</td>
                                            <td>{data.bdeName}</td>
                                            <td>{data.bdmName}</td>
                                            <td>{data.offeredServices.join(', ')}</td>
                                            <td>{formatCurrency(data.offeredPrice)}</td>
                                            <td>{formatCurrency(data.totalPayment)}</td>
                                            <td>{formatCurrency(data.employeePayment)}</td>
                                            <td>{formatDate(new Date(data.lastFollowUpdate))}</td>
                                            <td>{formatDate(new Date(data.estPaymentDate))}</td>
                                            <td>{data.remarks}</td>
                                            <td>{formatDate(new Date(data.addedOnDate))}</td>
                                            
                                            <td>{formatDate(new Date(data.projectionDate))}</td>
                                            <td>{data.isPreviousMaturedCase === "true" ? "YES" : data.isPreviousMaturedCase === "false" ? "NO" : "-"}</td>
                                            <td>
                                                {/* View History button or link (replace with your a ctual logic) */}
                                                <MdHistory
                                                    onClick={() => handleViewHistory(data._id)}
                                                />

                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="12">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </DialogContent>
            </Dialog>

            {/* --------------------history dialog---------------------------- */}
            <Dialog open={openHistoryDialog} onClose={handleCloseHistoryDialog} fullWidth maxWidth="lg">
                <DialogTitle>
                    {historyCompanyName}'s History
                    <IconButton onClick={handleCloseHistoryDialog} style={{ float: "right" }}>
                        <CloseIcon color="primary" />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <div 
                        id="table-default"
                        style={{ overflowX: "auto", overflowY: "auto" }}>
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                border: "1px solid #ddd",
                                marginBottom: "10px",
                            }}
                            className="table-vcenter table-nowrap"
                        >
                            <thead
                                style={{
                                    position: "sticky",
                                    top: "-1px",
                                    backgroundColor: "#ffb900",
                                    color: "black",
                                    fontWeight: "bold",
                                    zIndex: 1,
                                }}
                            >
                                <tr
                                    style={{
                                        backgroundColor: "#ffb900",
                                        color: "white",
                                        fontWeight: "bold",
                                    }}
                                >
                                    <th>Sr. No</th>
                                    <th>Company Name</th>
                                    <th>BDE Name</th>
                                    <th>BDM Name</th>
                                    <th>Offered Services</th>
                                    <th>Total Offered Price</th>
                                    <th>Expected Amount</th>
                                    <th>Employee Payment</th>
                                    <th>Last Follow Up Date</th>
                                    <th>Estimated Payment Date</th>
                                    <th>Remarks</th>
                                    <th>Added On</th>
                                    <th>Modified On</th>
                                    <th>Is Matured Case</th>
                                </tr>
                            </thead>

                            <tbody>
                                {historyData && historyData.length > 0 ? (
                                    historyData.map((entry, index) => (
                                        <tr key={entry._id || index}>
                                            <td>{index + 1}</td>
                                            <td>{historyCompanyName}</td>
                                            <td>{entry.data.bdeName}</td>
                                            <td>{entry.data.bdmName}</td>
                                            <td>{entry.data.offeredServices.join(', ')}</td>
                                            <td>{formatCurrency(entry.data.offeredPrice)}</td>
                                            <td>{formatCurrency(entry.data.totalPayment)}</td>
                                            <td>{entry.data.bdeName === entry.data.bdmName ? formatCurrency(entry.data.totalPayment) : formatCurrency((entry.data.totalPayment) / 2)}</td>
                                            <td>{formatDate(new Date(entry.data.lastFollowUpdate))}</td>
                                            <td>{formatDate(new Date(entry.data.estPaymentDate))}</td>
                                            <td>{entry.data.remarks}</td>
                                            <td>{formatDate(addedOnDate)}</td>
                                            <td>{formatDate(new Date(entry.modifiedAt))}</td>
                                            <td>{entry.data.isPreviousMaturedCase === "true" ? "YES" : entry.data.isPreviousMaturedCase === "false" ? "NO" : "-"}</td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8">No history available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default EmployeesNewProjectionSummary;