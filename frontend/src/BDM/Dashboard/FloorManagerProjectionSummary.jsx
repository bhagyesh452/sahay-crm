import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import Calendar from "@mui/icons-material/Event";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ClipLoader from "react-spinners/ClipLoader";
import Nodata from '../Components/NoData/NoData.jsx';

function FloorManagerProjectionSummary() {

    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const floorManagerName = localStorage.getItem('bdmName');
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;

    const [projectionSummary, setProjectionSummary] = useState([]);
    const [originalData, setOriginalData] = useState([]); // State to hold the original data
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedEmployeeNames, setSelectedEmployeeNames] = useState([]);
    const [searchedEmployeeName, setSearchedEmployeeName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [newSortType, setNewSortType] = useState({
        totalCompanies: "none",
        totalOfferedServices: "none",
        totalOfferedPrice: "none",
        totalExpectedAmount: "none",
    });

    const formatSalary = (amount) => {
        return new Intl.NumberFormat('en-IN').format(amount);
    };

    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
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

    const fetchProjectionSummary = async (dates) => {
        if (dates) {
            // console.log("Selected start date :", dates[0]);
            // console.log("Selected end date :", dates[1]);

            const startDate = dates[0] ? dayjs(dates[0]).format("YYYY-MM-DD") : "";
            const endDate = dates[1] ? dayjs(dates[1]).format("YYYY-MM-DD") : "";

            // console.log("Formatted Start Date :", startDate);
            // console.log("Formatted End Date :", endDate);

            setStartDate(startDate);
            setEndDate(endDate);
        }
        try {
            setIsLoading(true);
            const res = await axios.get(`${secretKey}/bdm-data/floorManagerProjectionSummaryReport/${floorManagerName}`, {
                params: { startDate, endDate }
            });
            // console.log("Projection Summary :", res.data.data);
            setProjectionSummary(res.data.data);
            setOriginalData(res.data.data); // Store original data
        } catch (error) {
            setIsLoading(false);
            console.log("Error fetching projection summary :", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectionSummary();
    }, [startDate, endDate]);

    // Function to filter employees based on selected employee names
    const filterBySelectedEmployees = (employees) => {
        if (selectedEmployeeNames.length > 0) {
            return employees.filter(emp => selectedEmployeeNames.includes(emp.employeeName));
        }
        return employees;
    };

    // Function to filter employees based on searched name
    const filterBySearchedName = (employees) => {
        if (searchedEmployeeName.trim()) {
            return employees.filter(emp =>
                emp.employeeName.toLowerCase().includes(searchedEmployeeName.toLowerCase())
            );
        }
        return employees;
    };

    // Function to get filtered employees
    const getFilteredEmployees = () => {
        return filterBySearchedName(filterBySelectedEmployees(projectionSummary));
    };

    // Function to sort data based on a key
    const sortData = (key, order) => {
        return [...projectionSummary].sort((a, b) => {
            if (order === "ascending") {
                return a[key] - b[key];
            } else if (order === "descending") {
                return b[key] - a[key];
            }
            return 0; // Default case, no sorting
        });
    };

    // Sorting total companies :
    const handleSortTotalCompanies = (sortType) => {
        if (sortType === "none") {
            setProjectionSummary(originalData); // Reset to original data
        } else {
            setProjectionSummary(sortData('totalCompanies', sortType));
        }
    };

    // Sorting offered services :
    const handleSortOfferedServices = (sortType) => {
        if (sortType === "none") {
            setProjectionSummary(originalData); // Reset to original data
        } else {
            setProjectionSummary(sortData('totalOfferedServices', sortType));
        }
    };

    // Sorting offered price :
    const handleSortOffredPrice = (sortType) => {
        if (sortType === "none") {
            setProjectionSummary(originalData); // Reset to original data
        } else {
            setProjectionSummary(sortData('totalOfferedPrice', sortType));
        }
    };

    // Sorting expected amount :
    const handleSortExpectedAmount = (sortType) => {
        if (sortType === "none") {
            setProjectionSummary(originalData); // Reset to original data
        } else {
            setProjectionSummary(sortData('totalPayment', sortType));
        }
    };

    return (
        <div>
            <div className='container-xl mt-3'>
                <div className="employee-dashboard">
                    <div className="card">
                        <div className="card-header p-1 employeedashboard d-flex align-items-center justify-content-between">
                            <div className="dashboard-title pl-1"  >
                                <h2 className="m-0">
                                    Projection Summary
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
                                        value={searchedEmployeeName}
                                        onChange={(e) => setSearchedEmployeeName(e.target.value)}
                                        className="form-control"
                                        placeholder="Enter BDE/BDM Name..."
                                        type="text"
                                        name="bdeName-search"
                                        id="bdeName-search" />
                                </div>

                                <div className="data-filter">
                                    <LocalizationProvider
                                        dateAdapter={AdapterDayjs} >
                                        <DemoContainer
                                            components={["SingleInputDateRangeField"]} sx={{
                                                padding: '0px',
                                                with: '220px'
                                            }}  >
                                            <DateRangePicker className="form-control my-date-picker form-control-sm p-0"
                                                onChange={(values) => fetchProjectionSummary(values)}
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
                                                calendars={1}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </div>

                                <div>
                                    <FormControl sx={{ ml: 1, minWidth: 200 }}>
                                        <InputLabel id="demo-select-small-label">Select Employee</InputLabel>
                                        <Select
                                            className="form-control my-date-picker my-mul-select form-control-sm p-0"
                                            labelId="demo-multiple-name-label"
                                            id="demo-multiple-name"
                                            multiple
                                            value={selectedEmployeeNames}
                                            onChange={(e) => setSelectedEmployeeNames(e.target.value)}
                                            input={<OutlinedInput label="Name" />}
                                            MenuProps={MenuProps}
                                        >
                                            {projectionSummary.map((name) => (
                                                <MenuItem key={name.employeeName} value={name.employeeName}>
                                                    {name.employeeName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                        </div>

                        <div className='card-body'>
                            <div className="row tbl-scroll">

                                <table className="admin-dash-tbl">
                                    <thead className="admin-dash-tbl-thead">
                                        <tr>
                                            <th>Sr.No</th>
                                            <th>Employee Name</th>

                                            <th style={{ cursor: "pointer" }}
                                                onClick={(e) => {
                                                    let updatedSortType;
                                                    if (newSortType.totalCompanies === "ascending") {
                                                        updatedSortType = "descending";
                                                    } else if (newSortType.totalCompanies === "descending") {
                                                        updatedSortType = "none";
                                                    } else {
                                                        updatedSortType = "ascending";
                                                    }
                                                    setNewSortType((prevData) => ({
                                                        ...prevData,
                                                        totalCompanies: updatedSortType,
                                                    }));
                                                    handleSortTotalCompanies(updatedSortType);
                                                }}><div className="d-flex align-items-center justify-content-between">
                                                    <div>Total Companies</div>
                                                    <div className="short-arrow-div">
                                                        <ArrowDropUpIcon className="up-short-arrow"
                                                            style={{ color: newSortType.totalCompanies === "descending" ? "black" : "#9d8f8f" }}
                                                        />
                                                        <ArrowDropDownIcon className="down-short-arrow"
                                                            style={{ color: newSortType.totalCompanies === "ascending" ? "black" : "#9d8f8f" }}
                                                        />
                                                    </div>
                                                </div>
                                            </th>

                                            <th style={{ cursor: "pointer" }}
                                                onClick={(e) => {
                                                    let updatedSortType;
                                                    if (newSortType.totalOfferedServices === "ascending") {
                                                        updatedSortType = "descending";
                                                    } else if (newSortType.totalOfferedServices === "descending") {
                                                        updatedSortType = "none";
                                                    } else {
                                                        updatedSortType = "ascending";
                                                    }
                                                    setNewSortType((prevData) => ({
                                                        ...prevData,
                                                        totalOfferedServices: updatedSortType,
                                                    }));
                                                    handleSortOfferedServices(updatedSortType);
                                                }}><div className="d-flex align-items-center justify-content-between">
                                                    <div>Offered Services</div>
                                                    <div className="short-arrow-div">
                                                        <ArrowDropUpIcon className="up-short-arrow"
                                                            style={{ color: newSortType.totalOfferedServices === "descending" ? "black" : "#9d8f8f" }}
                                                        />
                                                        <ArrowDropDownIcon className="down-short-arrow"
                                                            style={{ color: newSortType.totalOfferedServices === "ascending" ? "black" : "#9d8f8f" }}
                                                        />
                                                    </div>
                                                </div>
                                            </th>

                                            <th style={{ cursor: "pointer" }}
                                                onClick={(e) => {
                                                    let updatedSortType;
                                                    if (newSortType.totalOfferedPrice === "ascending") {
                                                        updatedSortType = "descending";
                                                    } else if (newSortType.totalOfferedPrice === "descending") {
                                                        updatedSortType = "none";
                                                    } else {
                                                        updatedSortType = "ascending";
                                                    }
                                                    setNewSortType((prevData) => ({
                                                        ...prevData,
                                                        totalOfferedPrice: updatedSortType,
                                                    }));
                                                    handleSortOffredPrice(updatedSortType);
                                                }}><div className="d-flex align-items-center justify-content-between">
                                                    <div>Total Offered Price</div>
                                                    <div className="short-arrow-div">
                                                        <ArrowDropUpIcon className="up-short-arrow"
                                                            style={{ color: newSortType.totalOfferedPrice === "descending" ? "black" : "#9d8f8f" }}
                                                        />
                                                        <ArrowDropDownIcon className="down-short-arrow"
                                                            style={{ color: newSortType.totalOfferedPrice === "ascending" ? "black" : "#9d8f8f" }}
                                                        />
                                                    </div>
                                                </div>
                                            </th>

                                            <th style={{ cursor: "pointer" }}
                                                onClick={(e) => {
                                                    let updatedSortType;
                                                    if (newSortType.totalExpectedAmount === "ascending") {
                                                        updatedSortType = "descending";
                                                    } else if (newSortType.totalExpectedAmount === "descending") {
                                                        updatedSortType = "none";
                                                    } else {
                                                        updatedSortType = "ascending";
                                                    }
                                                    setNewSortType((prevData) => ({
                                                        ...prevData,
                                                        totalExpectedAmount: updatedSortType,
                                                    }));
                                                    handleSortExpectedAmount(updatedSortType);
                                                }}><div className="d-flex align-items-center justify-content-between">
                                                    <div>Expected Amount</div>
                                                    <div className="short-arrow-div">
                                                        <ArrowDropUpIcon className="up-short-arrow"
                                                            style={{ color: newSortType.totalExpectedAmount === "descending" ? "black" : "#9d8f8f" }}
                                                        />
                                                        <ArrowDropDownIcon className="down-short-arrow"
                                                            style={{ color: newSortType.totalExpectedAmount === "ascending" ? "black" : "#9d8f8f" }}
                                                        />
                                                    </div>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan="6">
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
                                        ) : (
                                            <>
                                                {getFilteredEmployees().length > 0 ? (
                                                    getFilteredEmployees().map((emp, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{emp.employeeName}</td>
                                                            <td>{emp.totalCompanies}</td>
                                                            <td>{emp.totalOfferedServices}</td>
                                                            <td>{formatSalary(emp.totalOfferedPrice)}</td>
                                                            <td>{formatSalary(emp.totalPayment)}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="6">
                                                            <Nodata />
                                                        </td>
                                                    </tr>
                                                )}
                                            </>
                                        )}
                                    </tbody>

                                    {getFilteredEmployees().length > 0 && <tfoot className="admin-dash-tbl-tfoot">
                                        <tr>
                                            <td colSpan={2}>Total</td>
                                            <td>{getFilteredEmployees().reduce((sum, emp) => sum + (emp.totalCompanies || 0), 0)}</td>
                                            <td>{getFilteredEmployees().reduce((sum, emp) => sum + (emp.totalOfferedServices || 0), 0)}</td>
                                            <td>₹ {formatSalary(getFilteredEmployees().reduce((sum, emp) => sum + (emp.totalOfferedPrice || 0), 0))}</td>
                                            <td>₹ {formatSalary(getFilteredEmployees().reduce((sum, emp) => sum + (emp.totalPayment || 0), 0))}</td>
                                        </tr>
                                    </tfoot>}
                                </table>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default FloorManagerProjectionSummary;