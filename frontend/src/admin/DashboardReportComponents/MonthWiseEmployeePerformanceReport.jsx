import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nodata from '../../components/Nodata';
import ClipLoader from "react-spinners/ClipLoader";
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

function MonthWiseEmployeePerformanceReport() {

    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const monthsArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Get the current month as the default
    const currentMonth = new Date().toLocaleString("default", { month: "long" });

    const [employeeData, setEmployeeData] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [selectedMonths, setSelectedMonths] = useState([currentMonth]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedBranch, setSelectedBranch] = useState("");
    const [empPerformanceData, setEmpPerformanceData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    const yearsArray = [];
    for (let i = 2023; i <= new Date().getFullYear(); i++) {
        yearsArray.push(i);
    }

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-IN').format(amount);
    };

    const theme = useTheme();
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;

    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    function getStyles(name, employeeNames, theme) {
        return {
            fontWeight:
                employeeNames.indexOf(name) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    }

    const fetchEmployeeData = async () => {
        try {
            const res = await axios.get(`${secretKey}/employee/einfo`);
            // console.log("Employee data is :", res.data);
            const data = res.data;
            setEmployeeData(data.filter(employee => employee.designation === "Sales Executive" || employee.designation === "Sales Manager").map(employee => employee.ename));
        } catch (error) {
            console.log("Error fetching employee data:", error);
        }
    };

    useEffect(() => {
        fetchEmployeeData();
    }, []);

    const fetchEmployeePerformanceReport = async () => {
        try {
            const res = await axios.get(`${secretKey}/employee/monthWisePerformanceReport`, {
                params: {
                    branch: selectedBranch,
                    months: selectedMonths,
                    year: selectedYear,
                    employees: selectedEmployees
                }
            });
            console.log("Performance data is :", res.data.data);
            setEmpPerformanceData(res.data.data);
        } catch (error) {
            console.log("Error fetching performance data", error);
        }
    };

    useEffect(() => {
        fetchEmployeePerformanceReport();
    }, [selectedBranch, selectedMonths, selectedYear, selectedEmployees]);

    return (

        <div className="mt-3">
            <div className="card">
                <div className="card-header p-1 employeedashboard d-flex align-items-center justify-content-between">

                    <div className="dashboard-title pl-1"  >
                        <h2 className="m-0">
                            Month Wise Performance Report
                        </h2>
                    </div>

                    <div className="d-flex align-items-center pr-1">
                        <div className="filter-booking mr-1 d-flex align-items-center">
                            <div className="filter-main">
                                <select
                                    className="form-select"
                                    id={`branch-filter`}
                                    value={selectedBranch}
                                    onChange={(e) => setSelectedBranch(e.target.value)}
                                >
                                    <option value="" disabled selected>Select Branch</option>
                                    <option value={"Gota"}>Gota</option>
                                    <option value={"Sindhu Bhawan"}>Sindhu Bhawan</option>
                                    <option value="">None</option>
                                </select>
                            </div>
                        </div>

                        <div className="filter-booking mr-1 d-flex align-items-center">
                            <div className="filter-title mr-1">
                                <h2 className="m-0">Select Month :</h2>
                            </div>
                            <div className="filter-main">
                                <FormControl sx={{ ml: 1, minWidth: 200 }}>
                                    <InputLabel id="demo-select-small-label">Select Month</InputLabel>
                                    <Select
                                        className="form-control my-date-picker my-mul-select form-control-sm p-0"
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        multiple
                                        value={selectedMonths}
                                        onChange={(e) => setSelectedMonths(e.target.value)}
                                        input={<OutlinedInput label="Name" />}
                                        MenuProps={MenuProps}
                                    >
                                        {monthsArray.map((month) => (
                                            <MenuItem
                                                key={month}
                                                value={month}
                                                style={getStyles(month, selectedMonths, theme)}
                                            >
                                                {month}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>

                        <div className="filter-booking mr-1 d-flex align-items-center">
                            <div className="filter-title mr-1">
                                <h2 className="m-0">Select Year :</h2>
                            </div>
                            <div className="filter-main">
                                <select
                                    className="form-select"
                                    id={`branch-filter`}
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                >
                                    {yearsArray.map((year, index) => (
                                        <option key={index} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="filter-booking mr-1 d-flex align-items-center">
                            <div className="filter-title mr-1">
                                <h2 className="m-0">Select Employees :</h2>
                            </div>
                            <div className="filter-main">
                                <FormControl sx={{ ml: 1, minWidth: 200 }}>
                                    <InputLabel id="demo-select-small-label">Select Employee</InputLabel>
                                    <Select
                                        className="form-control my-date-picker my-mul-select form-control-sm p-0"
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        multiple
                                        value={selectedEmployees}
                                        onChange={(e) => setSelectedEmployees(e.target.value)}
                                        input={<OutlinedInput label="Name" />}
                                        MenuProps={MenuProps}
                                    >
                                        {employeeData.map((name) => (
                                            <MenuItem
                                                key={name}
                                                value={name}
                                                style={getStyles(name, selectedEmployees, theme)}
                                            >
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-body">
                    <div id="table-default" className="row tbl-scroll">
                        <table className="table-vcenter table-nowrap admin-dash-tbl"  >

                            <thead className="admin-dash-tbl-thead">
                                <tr>
                                    <th>Sr. No</th>
                                    <th>Name</th>
                                    <th>Branch</th>
                                    <th>Month</th>
                                    <th>Year</th>
                                    <th>Target</th>
                                    <th>Achievement</th>
                                    <th>Ratio</th>
                                    <th>Result</th>
                                </tr>
                            </thead>

                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="9">
                                            <div className="LoaderTDSatyle w-100">
                                                <ClipLoader
                                                    color="lightgrey"
                                                    isLoading
                                                    size={30}
                                                    aria-label="Loading Spinner"
                                                    data-testid="loader"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ) : empPerformanceData.length > 0 ? (
                                    empPerformanceData.map((employee, empIndex) => (
                                        employee.performance.map((performance, perfIndex) => (
                                            <tr key={`${empIndex}-${perfIndex}`}>
                                                <td>{empIndex + 1}</td>
                                                <td>{employee.name}</td>
                                                <td>{employee.branch}</td>
                                                <td>{performance.month}</td>
                                                <td>{performance.year}</td>
                                                <td>₹ {formatAmount(performance.amount)}</td>
                                                <td>₹ {formatAmount(performance.achievedAmount)}</td>
                                                <td>{Math.round(performance.ratio)}%</td>
                                                <td>{performance.result}</td>
                                            </tr>
                                        ))
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="text-center"><Nodata /></td>
                                    </tr>
                                )}
                            </tbody>

                            {empPerformanceData.length > 0 && (() => {
                                // Calculate total target, achievement, and ratio
                                const totalTarget = empPerformanceData.reduce(
                                    (total, employee) => total + employee.performance.reduce((sum, perf) => sum + Number(perf.amount || 0), 0),
                                    0
                                );
                                
                                const totalAchievement = empPerformanceData.reduce(
                                    (total, employee) => total + employee.performance.reduce((sum, perf) => sum + Number(perf.achievedAmount || 0), 0),
                                    0
                                );

                                const avgRatio = (totalAchievement / totalTarget) * 100;

                                // Determine result based on the average ratio
                                const result = (() => {
                                    if (avgRatio >= 250) return "Exceptional";
                                    if (avgRatio >= 200) return "Outstanding";
                                    if (avgRatio >= 150) return "Extraordinary";
                                    if (avgRatio >= 100) return "Excellent";
                                    if (avgRatio >= 75) return "Good";
                                    if (avgRatio >= 61) return "Average";
                                    if (avgRatio >= 41) return "Below Average";
                                    return "Poor";
                                })();

                                // Render the table footer
                                return (
                                    <tfoot className="admin-dash-tbl-tfoot">
                                        <tr style={{ fontWeight: 500 }}>
                                            <td colSpan="5">Total</td>
                                            <td>₹ {formatAmount(totalTarget)}</td>
                                            <td>₹ {formatAmount(totalAchievement)}</td>
                                            <td>{Math.round(avgRatio)}%</td>
                                            <td>{result}</td>
                                        </tr>
                                    </tfoot>
                                );
                            })()}

                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MonthWiseEmployeePerformanceReport;