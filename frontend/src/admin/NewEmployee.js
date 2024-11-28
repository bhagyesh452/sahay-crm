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
import { useQuery } from "@tanstack/react-query";
import UpcomingEmployees from "../Hr_panel/Components/UpcomingEmployees.jsx";
import DialogAddRecentEmployee from "../Hr_panel/Components/Extra Components/DialogAddRecentEmployee.jsx";
import AddBulkTagretDialog from "../admin/ExtraComponent/AddBulkTagretDialog.jsx";
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import notification_audio from "../assets/media/notification_tone.mp3";
import io from "socket.io-client";


function NewEmployee() {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const adminName = localStorage.getItem("adminName");

    const [employee, setEmployee] = useState([]);
    const [employeeDataCount, setEmployeeDataCount] = useState(0);
    const [completeEmployeeData, setCompleteEmployeeData] = useState([]);
    const [dataToFilterEmployee, setDataToFilterEmployee] = useState([]);
    const [filteredDataEmployee, setFilteredDataEmployee] = useState([]);
    const [activeFilterFieldsEmployee, setActiveFilterFieldsEmployee] = useState([]);
    const [activeFilterFieldEmployee, setActiveFilterFieldEmployee] = useState(null);

    const [deletedEmployee, setDeletedEmployee] = useState([]);
    const [deletedEmployeeDataCount, setDeletedEmployeeDataCount] = useState(0);
    const [completeDeletedEmployeeData, setCompleteDeletedEmployeeData] = useState([]);
    const [dataToFilterDeletedEmployee, setDataToFilterDeletedEmployee] = useState([]);
    const [filteredDataDeletedEmployee, setFilteredDataDeletedEmployee] = useState([]);
    const [activeFilterFieldsDeletedEmployee, setActiveFilterFieldsDeletedEmployee] = useState([]);
    const [activeFilterFieldDeletedEmployee, setActiveFilterFieldDeletedEmployee] = useState(null);

    const [addEmployeePopup, setAddEmployeePopup] = useState(false);
    const [addBulkTarget, setAddBulkTarget] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [recruiterData, setRecruiterData] = useState([])
    const [page, setPage] = useState(1);
    const [currentDataLoading, setCurrentDataLoading] = useState(false);
    // const [employeeSearchResult, setEmployeeSearchResult] = useState([]);
    // const [deletedEmployeeSearchResult, setDeletedEmployeeSearchResult] = useState([]);

    useEffect(() => {
        document.title = `Admin-Sahay-CRM`;
    }, []);

    useEffect(()=>{
        const socket = secretKey === "http://localhost:3001/api" ? io("http://localhost:3001") : io("wss://startupsahay.in", {
            secure: true, // Use HTTPS
            path: '/socket.io',
            reconnection: true,
            transports: ['websocket'],
          });
          socket.on("employee-deleted-permanently", (res) => {
            
            //   enqueueSnackbar(`Employee Deleted Permanently 🔄`, { variant: "reportComplete", persist: true });
            //   const audioplayer = new Audio(notification_audio);
            //   audioplayer.play();
              refetchDeleted();
          });

          // Clean up the socket connection when the component unmounts
    return () => {
        socket.disconnect();
      };
    },[adminName])



    // Fetch active employees
    const { data: activeData, isLoading: isLoadingActive, isError: isErrorActive, refetch: refetchActive } = useQuery({
        queryKey: ["activeEmployees"],
        queryFn: () => axios.get(`${secretKey}/employee/einfo`),
        staleTime: 5 * 60 * 1000, // Optional: Cache data for 5 minutes to avoid unnecessary requests
        refetchInterval: 60 * 1000,  // Refetch every 1 minute
    });

    // Active employees filtering and setting
    useEffect(() => {
        if (activeData?.data) {
            const allEmployees = activeData.data;

            if (searchValue) {
                const filteredEmployees = allEmployees.filter((emp) => {
                    let designation = emp.newDesignation?.toLowerCase();
                    if (designation === "business development executive") {
                        designation = "bde";
                    } else if (designation === "business development manager") {
                        designation = "bdm";
                    }
                    return (
                        emp.ename?.toLowerCase().includes(searchValue) ||
                        emp.number?.toString().includes(searchValue) ||
                        emp.email?.toLowerCase().includes(searchValue) ||
                        emp.department?.toLowerCase().includes(searchValue) ||
                        designation.includes(searchValue) ||
                        emp.branchOffice?.toLowerCase().includes(searchValue)
                    );
                });

                if (adminName === "Saurav" || adminName === "Krunal Pithadia") {
                    const filteredByDesignation = filteredEmployees.filter(
                        (obj) => obj.designation === "Sales Executive" || obj.designation === "Sales Manager"
                    );
                    setEmployee(filteredByDesignation);
                    setEmployeeDataCount(filteredByDesignation.length);
                    setCompleteEmployeeData(filteredByDesignation);
                    setDataToFilterEmployee(filteredByDesignation);
                } else {
                    setEmployee(filteredEmployees);
                    setEmployeeDataCount(filteredEmployees.length);
                    setCompleteEmployeeData(filteredEmployees);
                    setDataToFilterEmployee(filteredEmployees);
                }
            } else {
                setEmployee(allEmployees); // Show all employees if no search value
                setEmployeeDataCount(allEmployees.length);
                setCompleteEmployeeData(allEmployees);
                setDataToFilterEmployee(allEmployees);
            }
        }
    }, [activeData?.data, searchValue]);

    // Fetch deleted employees
    const { data: deletedData, isLoading: isLoadingDeleted, isError: isErrorDeleted, refetch: refetchDeleted } = useQuery({
        queryKey: ["deletedEmployees"],
        queryFn: () => axios.get(`${secretKey}/employee/deletedemployeeinfo`), // Assuming this is your endpoint for deleted employees
        staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
        refetchInterval: 60 * 1000,  // Refetch every 1 minute
    });
    // console.log("deletedData", deletedData?.data);

    // Deleted employees filtering and setting
    useEffect(() => {
        if (deletedData?.data) {
            const allDeletedEmployees = deletedData.data;

            if (searchValue) {
                const filteredDeletedEmployees = allDeletedEmployees.filter((emp) => {
                    let designation = emp.newDesignation?.toLowerCase();
                    if (designation === "business development executive") {
                        designation = "bde";
                    } else if (designation === "business development manager") {
                        designation = "bdm";
                    }
                    return (
                        emp.ename?.toLowerCase().includes(searchValue) ||
                        emp.number?.toString().includes(searchValue) ||
                        emp.email?.toLowerCase().includes(searchValue) ||
                        emp.department?.toLowerCase().includes(searchValue) ||
                        designation.includes(searchValue) ||
                        emp.branchOffice?.toLowerCase().includes(searchValue)
                    );
                });
                setDeletedEmployee(filteredDeletedEmployees); // Set filtered deleted employees
                setDeletedEmployeeDataCount(filteredDeletedEmployees.length);
                setCompleteDeletedEmployeeData(filteredDeletedEmployees);
                setDataToFilterDeletedEmployee(filteredDeletedEmployees);
            } else {
                setDeletedEmployee(allDeletedEmployees); // Show all deleted employees if no search value
                setDeletedEmployeeDataCount(allDeletedEmployees.length); // Show all deleted employees if no search value
                setCompleteDeletedEmployeeData(allDeletedEmployees);
                setDataToFilterDeletedEmployee(allDeletedEmployees);
            }
        }
    }, [deletedData?.data, searchValue]);

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

    const fetchRecruiterData = async (searchQuery = "", page = 1) => {
        try {
            setCurrentDataLoading(true);
            const response = await axios.get(`${secretKey}/recruiter/recruiter-data-dashboard`);
            const {
                data,
            } = response.data;


            // If it's a search query, replace the data; otherwise, append for pagination
            if (page === 1) {
                // This is either the first page load or a search operation
                setRecruiterData(data);
            } else {
                // This is a pagination request
                setRecruiterData(prevData => [...prevData, ...data]);
            }
        } catch (error) {
            console.error("Error fetching data", error.message);
        } finally {
            setCurrentDataLoading(false);
        }
    };


    useEffect(() => {
        fetchRecruiterData("", page); // Fetch data initially
    }, []);

    return (
        <div>
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
                                            value={searchValue}
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
                            <div className="d-flex align-items-center">
                                <div className="mr-1">
                                    <DialogAddRecentEmployee
                                        refetch={refetchActive}
                                        isAdmin={true}
                                    />
                                    {/* <button className="btn btn-primary" onClick={() => setAddEmployeePopup(true)}>+ Add Employee</button> */}
                                </div>
                                <div>
                                    <AddBulkTagretDialog
                                        refetchActive={refetchActive} />
                                </div>
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
                                                {/* {(searchValue.length !== "" ? employeeSearchResult : employee).length || 0} */}
                                                {/* {employee?.length || 0} */}
                                                {employeeDataCount}
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
                                                {/* {(searchValue.length !== "" ? deletedEmployeeSearchResult : deletedEmployee).length || 0} */}
                                                {/* {deletedEmployee.length || 0} */}
                                                {deletedEmployeeDataCount}
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
                                                {recruiterData.filter((applicant) => {
                                                    return applicant.mainCategoryStatus === "Selected" && new Date(applicant.jdate) > new Date();
                                                }).length}
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
                                    closeAddEmployeePopup={closeAddEmployeePopup}
                                    searchValue={searchValue}
                                    employeeData={employee}
                                    setEmployeeData={setEmployee}
                                    setEmployeeDataCount={setEmployeeDataCount}
                                    dataToFilterEmployee={dataToFilterEmployee}
                                    completeEmployeeData={completeEmployeeData}
                                    filteredDataEmployee={filteredDataEmployee}
                                    setFilteredDataEmployee={setFilteredDataEmployee}
                                    activeFilterFieldEmployee={activeFilterFieldEmployee}
                                    setActiveFilterFieldEmployee={setActiveFilterFieldEmployee}
                                    activeFilterFieldsEmployee={activeFilterFieldsEmployee}
                                    setActiveFilterFieldsEmployee={setActiveFilterFieldsEmployee}
                                    isLoading={isLoadingActive}
                                    isError={isErrorActive}
                                    refetchActive={refetchActive}
                                    refetchDeleted={refetchDeleted}
                                />
                            </div>
                            <div class="tab-pane" id="DeletedEmployees">
                                <DeletedEmployeePanel
                                    searchValue={searchValue}
                                    deletedEmployee={deletedEmployee}
                                    setDeletedEmployee={setDeletedEmployee}
                                    setDeletedEmployeeDataCount={setDeletedEmployeeDataCount}
                                    dataToFilterDeletedEmployee={dataToFilterDeletedEmployee}
                                    completeDeletedEmployeeData={completeDeletedEmployeeData}
                                    filteredDataDeletedEmployee={filteredDataDeletedEmployee}
                                    setFilteredDataDeletedEmployee={setFilteredDataDeletedEmployee}
                                    activeFilterFieldDeletedEmployee={activeFilterFieldDeletedEmployee}
                                    setActiveFilterFieldDeletedEmployee={setActiveFilterFieldDeletedEmployee}
                                    activeFilterFieldsDeletedEmployee={activeFilterFieldsDeletedEmployee}
                                    setActiveFilterFieldsDeletedEmployee={setActiveFilterFieldsDeletedEmployee}
                                    isLoading={isLoadingDeleted}
                                    isError={isErrorDeleted}
                                    refetchActive={refetchActive}
                                    refetchDeleted={refetchDeleted}
                                />
                            </div>
                            <div class="tab-pane" id="UpcommingEmployees">
                                <UpcomingEmployees upcomingEmployees={recruiterData} dataLoading={currentDataLoading} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewEmployee;
