import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../Components/Header/Header.jsx";
import Navbar from "../../Components/Navbar/Navbar.jsx";
import '../../../dist/css/tabler.min.css?1684106062';
//import "../../../dist/css/tabler.min.css?1684106062";
import "../../../dist/css/tabler-flags.min.css?1684106062";
import "../../../dist/css/tabler-payments.min.css?1684106062";
import "../../../dist/css/tabler-vendors.min.css?1684106062";
import "../../../dist/css/demo.min.css?1684106062";
import { IconTrash } from "@tabler/icons-react";
import "../../../assets/styles.css";
import "../../../assets/table.css";
// import EmployeeTable from "./EmployeeTable";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { GrDocumentStore } from "react-icons/gr";
import { AiOutlineTeam } from "react-icons/ai";
import { GoPerson } from "react-icons/go";
import { MdOutlinePersonPin } from "react-icons/md";
//import DeletedEmployeePanel from "./DeletedEmployeePanel.jsx";
import { AiOutlineUserDelete } from "react-icons/ai";
import { IoFilterOutline } from "react-icons/io5";
import Nodata from "../../Components/Nodata/Nodata.jsx";
import DataManager_Employees from '../Employees/DataManager_Employees.jsx'
import Datamanager_DeletedEmployeePanel from "./Datamanager_DeletedEmployeePanel.jsx";








function DatamanagerNewEmployee() {
    const userId = localStorage.getItem("dataManagerUserId");
    const [myInfo, setMyInfo] = useState([]);
    const [employee, setEmployee] = useState([]);
    const [deletedEmployee, setDeletedEmployee] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [employeeSearchResult, setEmployeeSearchResult] = useState([]);
    const [deletedEmployeeSearchResult, setDeletedEmployeeSearchResult] = useState([]);
    const secretKey = process.env.REACT_APP_SECRET_KEY;

    useEffect(() => {
        document.title = `Datamanager-Sahay-CRM`;
    }, []);

    // console.log("User id is :", userId);

    const fetchPersonalInfo = async () => {
        try {
            const res = await axios.get(`${secretKey}/employee/fetchEmployeeFromId/${userId}`);
            // console.log("Personal Info :", res.data.data);
            setMyInfo(res.data.data);
        } catch (error) {
            console.log("Error fetching employee data :", error);
        }
    };

    const fetchEmployee = async () => {
        try {
            const res = await axios.get(`${secretKey}/employee/einfo`);
            const data = res.data.filter((data) => data.newDesignation === "Business Development Executive" || data.newDesignation === "Business Development Manager");
            setEmployee(data);
            // console.log("Fetched Employees are:", employeeData);
            const result = data.filter((emp) => {
                return (
                    emp.ename?.toLowerCase().includes(searchValue) ||
                    emp.number?.toString().includes(searchValue) ||
                    emp.email?.toLowerCase().includes(searchValue) ||
                    emp.newDesignation?.toLowerCase().includes(searchValue) ||
                    emp.branchOffice?.toLowerCase().includes(searchValue)
                );
            });
            //   console.log("Search result from employee list is :", result);
            setEmployeeSearchResult(result);
        } catch (error) {
            console.log("Error fetching employees data:", error);
        }
    };

    const fetchDeletedEmployee = async () => {
        try {
            const res = await axios.get(`${secretKey}/employee/deletedemployeeinfo`);
            const data = res.data.filter((data) => data.newDesignation === "Business Development Executive" || data.newDesignation === "Business Development Manager");
            setDeletedEmployee(data);
            // console.log("Fetched Deleted Employees are:", deletedEmployeeData);
            const result = data.filter((emp) => {
                return (
                    emp.ename?.toLowerCase().includes(searchValue) ||
                    emp.number?.toString().includes(searchValue) ||
                    emp.email?.toLowerCase().includes(searchValue) ||
                    emp.newDesignation?.toLowerCase().includes(searchValue) ||
                    emp.branchOffice?.toLowerCase().includes(searchValue)
                );
            });
            //   console.log("Search result from deleted employee list is :", result);
            setDeletedEmployeeSearchResult(result);
        } catch (error) {
            console.log("Error fetching employees data:", error);
        }
    };

    useEffect(() => {
        fetchPersonalInfo();
    }, []);

    useEffect(() => {
        fetchEmployee();
        fetchDeletedEmployee();
    }, [searchValue]);

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


    return (
        <div>
            <Header id={myInfo._id} name={myInfo.ename} empProfile={myInfo.profilePhoto && myInfo.profilePhoto.length !== 0 && myInfo.profilePhoto[0].filename} gender={myInfo.gender} designation={myInfo.newDesignation} />
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
                                            id="bdeName-search"
                                            onChange={(e) => setSearchValue(e.target.value.toLowerCase())}
                                        />
                                    </div>
                                </div>
                                <div className="btn-group ml-1" role="group" aria-label="Basic example">
                                    <button type="button" className="btn mybtn"  >
                                        <IoFilterOutline className='mr-1' /> Filter
                                    </button>
                                </div>
                            </div>
                            {/* <div>
                                <button className="btn btn-primary" onClick={() => setAddEmployeePopup(true)}>+ Add Employee</button>
                            </div> */}
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
                                                {(searchValue.length !== "" ? employeeSearchResult : employee).length || 0}
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
                                                {(searchValue.length !== "" ? deletedEmployeeSearchResult : deletedEmployee).length || 0}
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
                                <DataManager_Employees searchValue={searchValue} />
                            </div>
                            <div class="tab-pane" id="DeletedEmployees">
                                <Datamanager_DeletedEmployeePanel searchValue={searchValue} />
                            </div>
                            <div class="tab-pane" id="UpcommingEmployees">
                                <h1>Upcoming Employees</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Old Code */}
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
                            <DataManager_Employees />
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={1}>
                            <Datamanager_DeletedEmployeePanel />
                        </CustomTabPanel>
                    </div>
                </div>
            </div>


        </div>
    );
}

export default DatamanagerNewEmployee;
