import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import Navbar from "./Navbar";
import "../dist/css/tabler.min.css?1684106062";
import "../dist/css/tabler-flags.min.css?1684106062";
import "../dist/css/tabler-payments.min.css?1684106062";
import "../dist/css/tabler-vendors.min.css?1684106062";
import "../dist/css/demo.min.css?1684106062";

import "../assets/styles.css";
import "../assets/table.css";
// import EmployeeTable from "./EmployeeTable";
import { IoFilterOutline } from "react-icons/io5";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { GrDocumentStore } from "react-icons/gr";
import { AiOutlineTeam } from "react-icons/ai";
import { GoPerson } from "react-icons/go";
import { MdOutlinePersonPin } from "react-icons/md";
import Employee from './Employees.js'
import Team from './Team.js'
import DeletedEmployeePanel from "./DeletedEmployeePanel.jsx";
import { AiOutlineUserDelete } from "react-icons/ai";
import Employees from "./Employees.js";








function NewEmployee() {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [employee, setEmployee] = useState([]);
    const [deletedEmployee, setDeletedEmployee] = useState([]);
    const [addEmployeePopup, setAddEmployeePopup] = useState(false);

    useEffect(() => {
        document.title = `Admin-Sahay-CRM`;
    }, []);

    const fetchEmployee = async () => {
        try {
            const res = await axios.get(`${secretKey}/employee/einfo`);
            setEmployee(res.data);
            // console.log("Fetched Employees are:", employeeData);
        } catch (error) {
            console.log("Error fetching employees data:", error);
        }
    };

    const fetchDeletedEmployee = async () => {
        try {
            const res = await axios.get(`${secretKey}/employee/deletedemployeeinfo`);
            const deletedEmployeeData = res.data;
            setDeletedEmployee(deletedEmployeeData);
            // console.log("Fetched Deleted Employees are:", deletedEmployeeData);
        } catch (error) {
            console.log("Error fetching employees data:", error);
        }
    };

    useEffect(() => {
        fetchEmployee();
        fetchDeletedEmployee();
    }, []);

    function CustomTabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    CustomTabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const closeAddEmployeePopup = () => setAddEmployeePopup(false);
    
    return (
        <div>
            <Header />
            <Navbar number={1} />
            {/* New Code Of Employee */}

            <div className="page-wrapper">
                <div className="page-header rm_Filter m-0">
                    <div className="container-xl">
                        <div className="d-flex  justify-content-between">
                            <div className="d-flex w-100">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div class="input-icon ml-1">
                                        <span class="input-icon-addon">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon mybtn" width="18" height="18" viewBox="0 0 22 22" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                                                <path d="M21 21l-6 -6"></path>
                                            </svg>
                                        </span>
                                        <input className="form-control search-cantrol mybtn"
                                            placeholder="Search…" type="text" name="bdeName-search"
                                            id="bdeName-search" />
                                    </div>
                                </div>
                                <div className="btn-group ml-1" role="group" aria-label="Basic example">
                                    <button type="button" className="btn mybtn"  >
                                        <IoFilterOutline className='mr-1' /> Filter
                                    </button>
                                </div>
                            </div>
                            <div>
                                <button className="btn btn-primary" onClick={() => setAddEmployeePopup(true)}>+ Add Employee</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="page-body rm_Dtl_box m-0">
                    <div className="container-xl mt-2">
                        {/* tab list */}
                        <div className="my-tab card-header">
                            <ul class="nav nav-tabs hr_emply_list_navtabs nav-fill p-0">
                                <li class="nav-item hr_emply_list_navitem">
                                    <a class="nav-link active" data-bs-toggle="tab" href="#Employees">
                                        <div className="d-flex align-items-center justify-content-between w-100">
                                            <div className="rm_txt_tsn">
                                                Employees
                                            </div>
                                            <div className="rm_tsn_bdge">
                                                {employee.length || 0}
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li class="nav-item hr_emply_list_navitem">
                                    <a class="nav-link " data-bs-toggle="tab" href="#DeletedEmployees">
                                        <div className="d-flex align-items-center justify-content-between w-100">
                                            <div className="rm_txt_tsn">
                                                Deleted Employees
                                            </div>
                                            <div className="rm_tsn_bdge">
                                                {deletedEmployee.length || 0}
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li class="nav-item hr_emply_list_navitem">
                                    <a class="nav-link " data-bs-toggle="tab" href="#UpcommingEmployees">
                                        <div className="d-flex align-items-center justify-content-between w-100">
                                            <div className="rm_txt_tsn">
                                                Upcomming Employees
                                            </div>
                                            <div className="rm_tsn_bdge">
                                                0
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        {/* tab data */}
                        <div class="tab-content card-body">
                            <div class="tab-pane active" id="Employees">
                                <Employees
                                openAddEmployeePopup={addEmployeePopup} 
                                closeAddEmployeePopup={closeAddEmployeePopup} />
                            </div>
                            <div class="tab-pane" id="DeletedEmployees">
                                <DeletedEmployeePanel />
                            </div>
                            <div class="tab-pane" id="UpcommingEmployees">
                                <h1>Upcoming Employees</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {/* old code of employee */}
            <div className="page-wrapper d-none">
                <div className="container-xl">
                    <div className="card mt-3">
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab label={
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <MdOutlinePersonPin style={{ height: "24px", width: "19px", marginRight: "5px" }} />
                                        <span style={{ fontSize: "12px" }}>Employee List</span>
                                    </div>
                                } {...a11yProps(0)} />
                                <Tab
                                    label={
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <AiOutlineUserDelete style={{ height: "24px", width: "19px", marginRight: "5px" }} />
                                            <span style={{ fontSize: "12px" }}>Deleted Employees List</span>
                                        </div>
                                    }
                                    {...a11yProps(1)}
                                />
                                {/* <Tab
                                    label={
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <AiOutlineTeam style={{ height: "24px", width: "19px", marginRight: "5px" }} />
                                            <span style={{fontSize:"12px"}}>Teams</span>
                                        </div>
                                    }
                                    {...a11yProps(1)}
                                /> */}
                            </Tabs>
                        </Box>
                        <CustomTabPanel value={value} index={0}>
                            <Employee />
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={1}>
                            <DeletedEmployeePanel />
                        </CustomTabPanel>
                        {/* <CustomTabPanel value={value} index={1}>
                            <Team/>
                        </CustomTabPanel> */}
                    </div>
                </div>
            </div>

        </div>
    );
}

export default NewEmployee;
