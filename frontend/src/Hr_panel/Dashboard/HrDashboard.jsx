import React, { useState, useEffect } from "react";
import Header from "../Components/Header/Header";
import Navbar from "../Components/Navbar/Navbar";
import Nodata from "../../components/Nodata";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Calendar from "@mui/icons-material/Event";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import OutlinedInput from '@mui/material/OutlinedInput';



function Dashboard() {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const userId = localStorage.getItem("hrUserId");
    const [loading, setLoading] = useState(false);
    const [myInfo, setMyInfo] = useState([]);
    const [employee, setEmployee] = useState([]);
    const [groupedEmployeeData, setGroupedEmployeeData] = useState([]);

    useEffect(() => {
        document.title = `HR-Sahay-CRM`;
    }, []);

    const formatSalary = (amount) => {
        return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(amount);
    };

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${secretKey}/employee/einfo`);
            const groupedData = processData(res.data);
            setEmployee(res.data);
            setGroupedEmployeeData(groupedData);
            console.log("Fetched employees are :", groupedData);
        } catch (error) {
            console.log("Error fetching employees data :", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPersonalInfo = async () => {
        try {
            const res = await axios.get(`${secretKey}/employee/fetchEmployeeFromId/${userId}`);
            // console.log("Fetched details is :", res.data.data);
            setMyInfo(res.data.data);
        } catch (error) {
            console.log("Error fetching employee details :", error);
        }
    };

    const processData = (employees) => {
        const groupedData = employees.reduce((acc, curr) => {
            const key = `${curr.branchOffice}-${curr.department}`;
            if (!acc[key]) {
                acc[key] = {
                    branch: curr.branchOffice,
                    department: curr.department,
                    maleCount: 0,
                    femaleCount: 0,
                    totalEmployees: 0,
                    totalSalary: 0,
                };
            }
            if (curr.gender === 'Male') {
                acc[key].maleCount += 1;
            } else if (curr.gender === 'Female') {
                acc[key].femaleCount += 1;
            }
            acc[key].totalEmployees += 1;
            acc[key].totalSalary += curr.salary;
            return acc;
        }, {});
        // return Object.values(groupedData);
        return Object.values(groupedData).sort((a, b) => {
            if (a.branch < b.branch) return -1;
            if (a.branch > b.branch) return 1;
            if (a.department < b.department) return -1;
            if (a.department > b.department) return 1;
            return 0;
        });
    };

    const calculateUniqueCount = (groupedEmployeeData, key) => {
        const uniqueSet = new Set();
        groupedEmployeeData.forEach(data => {
            uniqueSet.add(data[key]);
        });
        return uniqueSet.size;
    };

    const uniqueBranchCount = calculateUniqueCount(groupedEmployeeData, 'branch');
    const uniqueDepartmentCount = calculateUniqueCount(groupedEmployeeData, 'department');

    useEffect(() => {
        fetchPersonalInfo();
        fetchEmployees();
    }, []);

    return (
        <div>
            <Header id={myInfo._id} name={myInfo.ename} empProfile={myInfo.profilePhoto && myInfo.profilePhoto.length !== 0 && myInfo.profilePhoto[0].filename} gender={myInfo.gender} designation={myInfo.newDesignation} />
            <Navbar />
            <div className="card todays-booking totalbooking" id="totalbooking"   >

                <div className="card-header employeedashboard d-flex align-items-center justify-content-between p-1">

                    <div className="dashboard-title">
                        <h2 className="m-0 pl-1">
                            Employee Summary
                        </h2>
                    </div>
                    <div className="filter-booking d-flex align-items-center">
                        <div className="filter-booking mr-1 d-flex align-items-center" >
                            <div className="export-data">
                                {/* <button className="btn btn-link" 
                                    onClick={handleExportBookings}
                                    >
                                        Export CSV
                                    </button> */}
                            </div>
                            <div className="filter-title">
                                <h2 className="m-0 mr-2">
                                    {" "}
                                    Filter Branch : {"  "}
                                </h2>
                            </div>
                            <div className="filter-main ml-2">
                                <select
                                    className="form-select"
                                    id={`branch-filter`}
                                // onChange={(e) => {
                                //     if (e.target.value === "none") {
                                //         setEmployeeData(employeeDataFilter)
                                //     } else {
                                //         setEmployeeData(employeeDataFilter.filter(obj => obj.branchOffice === e.target.value))
                                //     }

                                // }}
                                >
                                    <option value="" disabled selected>
                                        Select Branch
                                    </option>

                                    <option value={"Gota"}>Gota</option>
                                    <option value={"Sindhu Bhawan"}>
                                        Sindhu Bhawan
                                    </option>
                                    <option value={"none"}>None</option>
                                </select>
                            </div>
                        </div>
                        <div class='input-icon mr-1'>
                            {/* <span class="input-icon-addon">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                                        <path d="M21 21l-6 -6"></path>
                                    </svg>
                                </span>
                                <input
                                    value={searchBookingBde}
                                    onChange={(e) => {
                                        setSearchBookingBde(e.target.value)
                                        debouncedFilterSearchThisMonthBookingBde(e.target.value)
                                    }}
                                    className="form-control"
                                    placeholder="Enter BDE Name..."
                                    type="text"
                                    name="bdeName-search"
                                    id="bdeName-search" /> */}
                        </div>
                        <div className="data-filter">
                            {/* <LocalizationProvider
                                    dateAdapter={AdapterDayjs} >
                                    <DemoContainer
                                        components={["SingleInputDateRangeField"]} sx={{
                                            padding: '0px',
                                            with: '220px'
                                        }}  >
                                        <DateRangePicker className="form-control my-date-picker form-control-sm p-0"
                                            onChange={(values) => {
                                                const startDateEmp = moment(values[0]).format(
                                                    "DD/MM/YYYY"
                                                );
                                                const endDateEmp = moment(values[1]).format(
                                                    "DD/MM/YYYY"
                                                );
                                                handleThisMonthBookingDateRange(values); // Call handleSelect with the selected values
                                            }}
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
                                </LocalizationProvider> */}
                        </div>
                        <div>
                            {/* <FormControl sx={{ ml: 1, minWidth: 200 }}>
                                    <InputLabel id="demo-select-small-label">Select Employee</InputLabel>
                                    <Select
                                        className="form-control my-date-picker my-mul-select form-control-sm p-0"
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        multiple
                                        value={monthBookingPerson}
                                        onChange={(event) => {
                                            setMonthBookingPerson(event.target.value)
                                            handleSelectThisMonthBookingEmployees(event.target.value)
                                        }}
                                        input={<OutlinedInput label="Name" />}
                                        MenuProps={MenuProps}
                                    >
                                        {options.map((name) => (
                                            <MenuItem
                                                key={name}
                                                value={name}
                                                style={getStyles(name, monthBookingPerson, theme)}
                                            >
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl> */}
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row tbl-scroll">
                        <table className="table-vcenter table-nowrap admin-dash-tbl" style={{ maxHeight: "400px" }}>
                            <thead className="admin-dash-tbl-thead">
                                <tr  >
                                    <th>SR. NO</th>
                                    <th>BRANCH</th>
                                    <th>Department</th>
                                    <th>Male Employees</th>
                                    <th>Female Employees</th>
                                    <th>Total Employees</th>
                                    <th>Monthly Salary</th>
                                </tr>
                            </thead>
                            {loading ? (
                                <tbody>
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
                                </tbody>
                            ) : groupedEmployeeData.length > 0 ? (
                                <>
                                    <tbody>
                                        {groupedEmployeeData.map((data, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{data.branch}</td>
                                                <td>{data.department}</td>
                                                <td>{data.maleCount}</td>
                                                <td>{data.femaleCount}</td>
                                                <td>{data.totalEmployees}</td>
                                                <td>₹ {formatSalary(data.totalSalary)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="admin-dash-tbl-tfoot">
                                        <tr>
                                            <td>Total:</td>
                                            <td>{uniqueBranchCount}</td>
                                            <td>{uniqueDepartmentCount}</td>
                                            <td>{groupedEmployeeData.reduce((total, data) => total + data.maleCount, 0)}</td>
                                            <td>{groupedEmployeeData.reduce((total, data) => total + data.femaleCount, 0)}</td>
                                            <td>{groupedEmployeeData.reduce((total, data) => total + data.totalEmployees, 0)}</td>
                                            <td>₹ {formatSalary(groupedEmployeeData.reduce((total, data) => total + data.totalSalary, 0))}</td>
                                        </tr>
                                    </tfoot>
                                </>

                            ) : (
                                <tbody>
                                    <tr>
                                        <td className="particular" colSpan="7">
                                            <Nodata />
                                        </td>
                                    </tr>
                                </tbody>
                            )}
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;