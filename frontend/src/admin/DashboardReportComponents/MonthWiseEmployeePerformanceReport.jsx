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
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedBranch, setSelectedBranch] = useState("");
    const [empPerformanceData, setEmpPerformanceData] = useState([]);
    const [currentDataLoading, setCurrentDataLoading] = useState(false);


    const yearsArray = [];
    for (let i = 2023; i <= new Date().getFullYear(); i++) {
        yearsArray.push(i);
    }

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
                            <div className="filter-title mr-1">
                                <h2 className="m-0">Filter Branch :</h2>
                            </div>
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
                                    <option value={"none"}>None</option>
                                </select>
                            </div>
                        </div>

                        <div className="filter-booking mr-1 d-flex align-items-center">
                            <div className="filter-title mr-1">
                                <h2 className="m-0">Select Month :</h2>
                            </div>
                            <div className="filter-main">
                                <select
                                    className="form-select"
                                    id={`branch-filter`}
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                >
                                    {monthsArray.map((month, index) => (
                                        <option key={index} value={month}>{month}</option>
                                    ))}
                                </select>
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
                                    <th>Month</th>
                                    <th>Target</th>
                                    <th>Achievement</th>
                                    <th>Ratio</th>
                                    <th>Result</th>
                                </tr>
                            </thead>

                            {currentDataLoading ? (
                                <tbody>
                                    <tr>
                                        <td colSpan="7" >
                                            <div className="LoaderTDSatyle w-100" >
                                                <ClipLoader
                                                    color="lightgrey"
                                                    currentDataLoading
                                                    size={30}
                                                    aria-label="Loading Spinner"
                                                    data-testid="loader"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            ) : (
                                <>
                                    {/* <tbody>
                      {filteredData.length > 0 ? (
                        filteredData.map((employee, index) => {
                          const filteredTargetDetails = employee.targetDetails.filter((perData) => {
    
                            const monthYear = new Date(perData.year, new Date(Date.parse(perData.month + " 1, 2020")).getMonth(), 1);
                            const currentMonthYear = new Date(currentYear, new Date(Date.parse(currentMonth + " 1, 2020")).getMonth(), 1);
                            return monthYear <= currentMonthYear;
                          }).sort((a, b) => {
                            // Sort by year first, then by month in descending order
                            if (b.year !== a.year) {
                              return b.year - a.year;
                            } else {
                              return new Date(Date.parse(b.month + " 1, 2020")) - new Date(Date.parse(a.month + " 1, 2020"));
                            }
                          });
    
                          if (filteredTargetDetails.length === 0) return null;
    
                          return (
                            <React.Fragment key={employee._id}>
                              <tr onClick={() => toggleEmployeeDetails(employee._id)} style={{ cursor: 'pointer' }}>
                                <td>{index + 1}</td>
    
                                <td>{employee.ename}</td>
    
                                <td>{filteredTargetDetails.length}</td>
    
                                <td>₹ {new Intl.NumberFormat('en-IN').format(
                                  targetAmount = filteredTargetDetails.reduce((total, obj) => total + parseFloat(obj.amount || 0), 0)
                                )}</td>
    
                                <td>₹ {new Intl.NumberFormat('en-IN').format(
                                  achievedAmount = Math.floor(filteredTargetDetails.reduce((achieved, obj) => achieved + parseFloat(obj.achievedAmount || 0), 0))
                                )}</td>
    
                                <td>{Math.round((achievedAmount / targetAmount) * 100)}%</td>
    
                                <td>{(() => {
                                //   const ratio = Math.round((achievedAmount / targetAmount) * 100);
                                //   if (ratio >= 250) return "Exceptional";
                                //   if (ratio >= 200) return "Outstanding";
                                //   if (ratio >= 150) return "Extraordinary";
                                //   if (ratio >= 100) return "Excellent";
                                //   if (ratio >= 75) return "Good";
                                //   if (ratio >= 61) return "Average";
                                //   if (ratio >= 41) return "Below Average";
                                //   return "Poor";
                                })()}</td>
                              </tr>
                            </React.Fragment>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center"><Nodata /></td>
                        </tr>
                      )}
                    </tbody> */}

                                    <tfoot className="admin-dash-tbl-tfoot">
                                        <tr style={{ fontWeight: 500 }}>
                                            <td colSpan="1">Total</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                        </tr>
                                    </tfoot>
                                </>
                            )}

                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MonthWiseEmployeePerformanceReport;