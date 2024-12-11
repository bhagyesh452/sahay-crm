import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Nodata from '../../components/Nodata';
import ClipLoader from "react-spinners/ClipLoader";
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { BsFilter } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";
import MonthWiseEmployeePerformanceReportFilter from './MonthWiseEmployeePerformanceReportFilter';

function MonthWiseEmployeePerformanceReport() {

    const secretKey = process.env.REACT_APP_SECRET_KEY;

    // const monthsArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Get the current month as the default
    const currentMonth = new Date().toLocaleString("default", { month: "long" });
    const currentYear = new Date().getFullYear();

    const yearsArray = [];
    for (let i = 2023; i <= new Date().getFullYear(); i++) {
        yearsArray.push(i);
    }

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-IN').format(amount);
    };

    // const [employeeData, setEmployeeData] = useState([]);
    // const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [selectedMonths, setSelectedMonths] = useState([currentMonth]);
    const [selectedYears, setSelectedYears] = useState([currentYear]);
    // const [selectedBranch, setSelectedBranch] = useState("");
    const [searchedEmployee, setSearchedEmployee] = useState("");
    const [empPerformanceData, setEmpPerformanceData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Filtered States
    const fieldRefs = useRef({});
    const filterMenuRef = useRef(null); // Ref for the filter menu container
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [filteredData, setFilteredData] = useState(empPerformanceData);
    const [activeFilterField, setActiveFilterField] = useState(null);
    const [filterPosition, setFilterPosition] = useState({ top: 10, left: 5 });
    const [activeFilterFields, setActiveFilterFields] = useState([]); // New state for active filter fields
    const [completeMergedData, setCompleteMergedData] = useState([]);
    const [mergedDataForFilter, setMergedDataForFilter] = useState([]);

    // ------------------------------------filter functions-------------------------
    const handleFilter = (newData) => {
        setFilteredData(newData)
        setEmpPerformanceData(newData);
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

    // const fetchEmployeeData = async () => {
    //     try {
    //         const res = await axios.get(`${secretKey}/employee/einfo`);
    //         // console.log("Employee data is :", res.data);
    //         const data = res.data;
    //         setEmployeeData(data.filter(employee => employee.designation === "Sales Executive" || employee.designation === "Sales Manager").map(employee => employee.ename));
    //     } catch (error) {
    //         console.log("Error fetching employee data:", error);
    //     }
    // };

    // useEffect(() => {
    //     fetchEmployeeData();
    // }, []);

    const fetchEmployeePerformanceReport = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${secretKey}/employee/monthWisePerformanceReport`, {
                params: {
                    // branch: selectedBranch,
                    months: selectedMonths,
                    years: selectedYears,
                    // employees: selectedEmployees
                    employee: searchedEmployee
                }
            });

            // console.log("Performance data is :", res.data.data);
            setEmpPerformanceData(res.data.data);
            setCompleteMergedData(res.data.data);
            setMergedDataForFilter(res.data.data);
        } catch (error) {
            setIsLoading(false);
            console.log("Error fetching performance data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployeePerformanceReport();
    }, [searchedEmployee]);

    return (
        <div>
            <div className="employee-dashboard" id="employeedashboardadmin">
                <div className="card">
                    <div className="card-header p-1 employeedashboard d-flex align-items-center justify-content-between">

                        <div className="dashboard-title pl-1"  >
                            <h2 className="m-0">
                                Month Wise Performance Report
                            </h2>
                        </div>

                        <div className="d-flex align-items-center pr-1">
                            {/* <div className="filter-booking mr-1 d-flex align-items-center">
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
                            </div> */}

                            {/* <div className="filter-booking mr-1 d-flex align-items-center">
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
                            </div> */}

                            {/* <div className="filter-booking mr-1 d-flex align-items-center">
                                <div className="filter-title mr-1">
                                    <h2 className="m-0">Select Year :</h2>
                                </div>
                                <div className="filter-main">
                                    <select
                                        className="form-select"
                                        id={`branch-filter`}
                                        value={selectedYears}
                                        onChange={(e) => setSelectedYears(e.target.value)}
                                    >
                                        {yearsArray.map((year, index) => (
                                            <option key={index} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                            </div> */}

                            {/* <div className="filter-booking mr-1 d-flex align-items-center">
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
                            </div> */}

                            <div class="input-icon mr-1">
                                <span class="input-icon-addon">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                                        <path d="M21 21l-6 -6"></path>
                                    </svg>
                                </span>
                                <input
                                    value={searchedEmployee}
                                    onChange={(e) => setSearchedEmployee(e.target.value)}
                                    className="form-control"
                                    placeholder="Enter Employee Name..."
                                    type="text"
                                    name="bdeName-search"
                                    id="bdeName-search"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card-body">
                        <div id="table-default" className="tbl-scroll" style={{ width: "100%", height: "500px" }}>
                            <table className="table-vcenter table-nowrap admin-dash-tbl w-100">

                                <thead className="admin-dash-tbl-thead">
                                    <tr>
                                        <th>Sr. No</th>

                                        <th>
                                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                                <div ref={el => fieldRefs.current['name'] = el}>
                                                    Name
                                                </div>
                                                <div className='RM_filter_icon' style={{ color: "black" }}>
                                                    {isActiveField('name') ? (
                                                        <FaFilter onClick={() => handleFilterClick("name")} />
                                                    ) : (
                                                        <BsFilter onClick={() => handleFilterClick("name")} />
                                                    )}
                                                </div>
                                                {/* ---------------------filter component--------------------------- */}
                                                {showFilterMenu && activeFilterField === 'name' && (
                                                    <div
                                                        ref={filterMenuRef}
                                                        className="filter-menu"
                                                        style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                    >
                                                        <MonthWiseEmployeePerformanceReportFilter
                                                            filterField={activeFilterField}
                                                            filteredData={filteredData}
                                                            onFilter={handleFilter}
                                                            completeData={completeMergedData}
                                                            empPerformanceData={empPerformanceData}
                                                            dataForFilter={mergedDataForFilter}
                                                            allFilterFields={setActiveFilterFields}
                                                            showingMenu={setShowFilterMenu}
                                                            selectedYears={selectedYears}
                                                            setSelectedMonths={setSelectedMonths}
                                                            selectedMonths={selectedMonths}
                                                            setSelectedYears={setSelectedYears}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </th>

                                        <th>
                                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                                <div ref={el => fieldRefs.current['branch'] = el}>
                                                    Branch
                                                </div>
                                                <div className='RM_filter_icon' style={{ color: "black" }}>
                                                    {isActiveField('branch') ? (
                                                        <FaFilter onClick={() => handleFilterClick("branch")} />
                                                    ) : (
                                                        <BsFilter onClick={() => handleFilterClick("branch")} />
                                                    )}
                                                </div>
                                                {/* ---------------------filter component--------------------------- */}
                                                {showFilterMenu && activeFilterField === 'branch' && (
                                                    <div
                                                        ref={filterMenuRef}
                                                        className="filter-menu"
                                                        style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                    >
                                                        <MonthWiseEmployeePerformanceReportFilter
                                                            filterField={activeFilterField}
                                                            filteredData={filteredData}
                                                            onFilter={handleFilter}
                                                            completeData={completeMergedData}
                                                            empPerformanceData={empPerformanceData}
                                                            dataForFilter={mergedDataForFilter}
                                                            allFilterFields={setActiveFilterFields}
                                                            showingMenu={setShowFilterMenu}
                                                            selectedYears={selectedYears}
                                                            setSelectedMonths={setSelectedMonths}
                                                            selectedMonths={selectedMonths}
                                                            setSelectedYears={setSelectedYears}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </th>

                                        <th>
                                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                                <div ref={el => fieldRefs.current['month-year'] = el}>
                                                    Month-Year
                                                </div>
                                                <div className='RM_filter_icon' style={{ color: "black" }}>
                                                    {isActiveField('') ? (
                                                        <FaFilter onClick={() => handleFilterClick("month-year")} />
                                                    ) : (
                                                        <BsFilter onClick={() => handleFilterClick("month-year")} />
                                                    )}
                                                </div>
                                                {/* ---------------------filter component--------------------------- */}
                                                {showFilterMenu && activeFilterField === 'month-year' && (
                                                    <div
                                                        ref={filterMenuRef}
                                                        className="filter-menu"
                                                        style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                    >
                                                        <MonthWiseEmployeePerformanceReportFilter
                                                            filterField={activeFilterField}
                                                            filteredData={filteredData}
                                                            onFilter={handleFilter}
                                                            completeData={completeMergedData}
                                                            empPerformanceData={empPerformanceData}
                                                            dataForFilter={mergedDataForFilter}
                                                            allFilterFields={setActiveFilterFields}
                                                            showingMenu={setShowFilterMenu}
                                                            selectedYears={selectedYears}
                                                            setSelectedMonths={setSelectedMonths}
                                                            selectedMonths={selectedMonths}
                                                            setSelectedYears={setSelectedYears}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </th>

                                        <th>
                                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                                <div ref={el => fieldRefs.current['amount'] = el}>
                                                    Target
                                                </div>
                                                <div className='RM_filter_icon' style={{ color: "black" }}>
                                                    {isActiveField('amount') ? (
                                                        <FaFilter onClick={() => handleFilterClick("amount")} />
                                                    ) : (
                                                        <BsFilter onClick={() => handleFilterClick("amount")} />
                                                    )}
                                                </div>
                                                {/* ---------------------filter component--------------------------- */}
                                                {showFilterMenu && activeFilterField === 'amount' && (
                                                    <div
                                                        ref={filterMenuRef}
                                                        className="filter-menu"
                                                        style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                    >
                                                        <MonthWiseEmployeePerformanceReportFilter
                                                            filterField={activeFilterField}
                                                            filteredData={filteredData}
                                                            onFilter={handleFilter}
                                                            completeData={completeMergedData}
                                                            empPerformanceData={empPerformanceData}
                                                            dataForFilter={mergedDataForFilter}
                                                            allFilterFields={setActiveFilterFields}
                                                            showingMenu={setShowFilterMenu}
                                                            selectedYears={selectedYears}
                                                            setSelectedMonths={setSelectedMonths}
                                                            selectedMonths={selectedMonths}
                                                            setSelectedYears={setSelectedYears}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </th>

                                        <th>
                                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                                <div ref={el => fieldRefs.current['achievedAmount'] = el}>
                                                    Achievement
                                                </div>
                                                <div className='RM_filter_icon' style={{ color: "black" }}>
                                                    {isActiveField('achievedAmount') ? (
                                                        <FaFilter onClick={() => handleFilterClick("achievedAmount")} />
                                                    ) : (
                                                        <BsFilter onClick={() => handleFilterClick("achievedAmount")} />
                                                    )}
                                                </div>
                                                {/* ---------------------filter component--------------------------- */}
                                                {showFilterMenu && activeFilterField === 'achievedAmount' && (
                                                    <div
                                                        ref={filterMenuRef}
                                                        className="filter-menu"
                                                        style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                    >
                                                        <MonthWiseEmployeePerformanceReportFilter
                                                            filterField={activeFilterField}
                                                            filteredData={filteredData}
                                                            onFilter={handleFilter}
                                                            completeData={completeMergedData}
                                                            empPerformanceData={empPerformanceData}
                                                            dataForFilter={mergedDataForFilter}
                                                            allFilterFields={setActiveFilterFields}
                                                            showingMenu={setShowFilterMenu}
                                                            selectedYears={selectedYears}
                                                            setSelectedMonths={setSelectedMonths}
                                                            selectedMonths={selectedMonths}
                                                            setSelectedYears={setSelectedYears}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </th>

                                        <th>
                                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                                <div ref={el => fieldRefs.current['ratio'] = el}>
                                                    Ratio
                                                </div>
                                                <div className='RM_filter_icon' style={{ color: "black" }}>
                                                    {isActiveField('ratio') ? (
                                                        <FaFilter onClick={() => handleFilterClick("ratio")} />
                                                    ) : (
                                                        <BsFilter onClick={() => handleFilterClick("ratio")} />
                                                    )}
                                                </div>
                                                {/* ---------------------filter component--------------------------- */}
                                                {showFilterMenu && activeFilterField === 'ratio' && (
                                                    <div
                                                        ref={filterMenuRef}
                                                        className="filter-menu"
                                                        style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                    >
                                                        <MonthWiseEmployeePerformanceReportFilter
                                                            filterField={activeFilterField}
                                                            filteredData={filteredData}
                                                            onFilter={handleFilter}
                                                            completeData={completeMergedData}
                                                            empPerformanceData={empPerformanceData}
                                                            dataForFilter={mergedDataForFilter}
                                                            allFilterFields={setActiveFilterFields}
                                                            showingMenu={setShowFilterMenu}
                                                            selectedYears={selectedYears}
                                                            setSelectedMonths={setSelectedMonths}
                                                            selectedMonths={selectedMonths}
                                                            setSelectedYears={setSelectedYears}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </th>

                                        <th>
                                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                                <div ref={el => fieldRefs.current['result'] = el}>
                                                    Result
                                                </div>
                                                <div className='RM_filter_icon' style={{ color: "black" }}>
                                                    {isActiveField('result') ? (
                                                        <FaFilter onClick={() => handleFilterClick("result")} />
                                                    ) : (
                                                        <BsFilter onClick={() => handleFilterClick("result")} />
                                                    )}
                                                </div>
                                                {/* ---------------------filter component--------------------------- */}
                                                {showFilterMenu && activeFilterField === 'result' && (
                                                    <div
                                                        ref={filterMenuRef}
                                                        className="filter-menu"
                                                        style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                    >
                                                        <MonthWiseEmployeePerformanceReportFilter
                                                            filterField={activeFilterField}
                                                            filteredData={filteredData}
                                                            onFilter={handleFilter}
                                                            completeData={completeMergedData}
                                                            empPerformanceData={empPerformanceData}
                                                            dataForFilter={mergedDataForFilter}
                                                            allFilterFields={setActiveFilterFields}
                                                            showingMenu={setShowFilterMenu}
                                                            selectedYears={selectedYears}
                                                            setSelectedMonths={setSelectedMonths}
                                                            selectedMonths={selectedMonths}
                                                            setSelectedYears={setSelectedYears}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="8">
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
                                                    <td>{performance.month}-{performance.year}</td>
                                                    <td>₹ {formatAmount(performance.amount)}</td>
                                                    <td>₹ {formatAmount(Math.round(performance.achievedAmount))}</td>
                                                    <td>{Math.round(performance.ratio)}%</td>
                                                    <td>{performance.result}</td>
                                                </tr>
                                            ))
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="text-center"><Nodata /></td>
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
                                                <td colSpan="4">Total</td>
                                                <td>₹ {formatAmount(totalTarget)}</td>
                                                <td>₹ {formatAmount(Math.round(totalAchievement))}</td>
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
        </div>
    );
}

export default MonthWiseEmployeePerformanceReport;