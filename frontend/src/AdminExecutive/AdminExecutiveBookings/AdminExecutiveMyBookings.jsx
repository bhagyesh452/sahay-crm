import React, { useState, useEffect, useSyncExternalStore } from "react";
import axios from 'axios';
import { IoFilterOutline } from "react-icons/io5";
import ClipLoader from "react-spinners/ClipLoader";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import '../../assets/table.css';
import '../../assets/styles.css';
import dummyImg from "../../static/EmployeeImg/office-man.png";
import { Link } from "react-router-dom";
import { useIsFocusVisible } from "@mui/material";
//import RmofCertificationCompanyTaskManage from "./RmofCertificationCompanyTaskManage";
import { FaRegEye } from "react-icons/fa";
import { CiUndo } from "react-icons/ci";
import { FaWhatsapp } from "react-icons/fa";
// import RmofCertificationGeneralPanel from "./RmofCertificationGeneralPanel";
// import RmofCertificationProcessPanel from "./RmofCertificationProcessPanel";
// import RmofCertificationSubmittedPanel from "./RmofCertificationSubmittedPanel";
// import RmofCertificationApprovedPanel from "./RmofCertificationApprovedPanel";
// import RmofCertificationDefaulterPanel from "./RmofCertificationDefaulterPanel";
// import RmofCertificationHoldPanel from "./RmofCertificationHoldPanel";
import io from 'socket.io-client';
//import RmofCertificationReadyToSubmitPanel from "./RmofCertificationReadyToSubmitPanel";
import AdminExecutiveHeader from "../Components/AdminExecutiveHeader";
import AdminExecutiveNavbar from "../Components/AdminExecutiveNavbar";
import AdminExecutiveGeneralPanel from "./AdminExecutiveGeneralPanel";
import AdminExecutiveProcessPanel from "./AdminExecutiveProcessPanel";
import AdminExecutiveHoldPanel from "./AdminExecutiveHoldPanel";
import AdminExecutiveDefaulterPanel from "./AdminExecutiveDefaulterPanel";
import AdminExecutiveApprovedPanel from "./AdminExecutiveApprovedPanel";

function AdminExecutiveMyBookings() {
    const adminExecutiveUserId = localStorage.getItem("adminExecutiveUserId")
    const [employeeData, setEmployeeData] = useState([])
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [currentDataLoading, setCurrentDataLoading] = useState(false)
    const [isFilter, setIsFilter] = useState(false)
    const [rmServicesData, setRmServicesData] = useState([]);
    const [showFilterIconGeneral, setShowFilterIconGeneral] = useState(false)
    const [showFilterIconProcess, setShowFilterIconProcess] = useState(false)
    const [showFilterIconReadyToSubmit, setShowFilterIconReadyToSubmit] = useState(false)
    const [showFilterIconSubmitted, setShowFilterIconSubmitted] = useState(false)
    const [showFilterIconDefaulter, setShowFilterIconDefaulter] = useState(false)
    const [showFilterIconHold, setShowFilterIconHold] = useState(false)
    const [showFilterIconApproved, setShowFilterIconApproved] = useState(false)
    //const [showFilterIcon, setShowFilterIcon] = useState(false)
    const [activeTab, setActiveTab] = useState("General");
    const [showFilterIcon, setShowFilterIcon] = useState({
        General: false,
        InProcess: false,
        ReadyToSubmit: false,
        Submited: false,
        Approved: false,
        Hold: false,
        Defaulter: false
    });


    useEffect(() => {
        document.title = `AdminExecutive-Sahay-CRM`;
    }, []);

    useEffect(() => {
        const socket = secretKey === "http://localhost:3001/api" ? io("http://localhost:3001") : io("wss://startupsahay.in", {
            secure: true, // Use HTTPS
            path: '/socket.io',
            reconnection: true,
            transports: ['websocket'],
        });

        socket.on("adminexecutive-general-status-updated", (res) => {
            console.log("socketChala")
            fetchRMServicesData()
        });

        return () => {
            socket.disconnect();
        };
    }, []);


    const fetchData = async () => {
        try {
            const response = await axios.get(`${secretKey}/employee/einfo`);
            // Set the retrieved data in the state
            const tempData = response.data;
            //console.log(tempData)
            const userData = tempData.find((item) => item._id === adminExecutiveUserId);
            //console.log(userData)
            setEmployeeData(userData);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };

    const fetchRMServicesData = async () => {
        try {
            setCurrentDataLoading(true)
            const response = await axios.get(`${secretKey}/rm-services/adminexecutivedata`)
            setRmServicesData(response.data)
            //console.log(response.data)
        } catch (error) {
            console.error("Error fetching data", error.message)
        } finally {
            setCurrentDataLoading(false)
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchRMServicesData()

    }, [employeeData])

    const handleDeleteRmBooking = async (companyName, serviceName) => {
        // Display confirmation dialog using SweetAlert
        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${serviceName} for ${companyName}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        });

        // Proceed with deletion if user confirms
        if (confirmDelete.isConfirmed) {
            try {
                // Send delete request to backend
                const response = await axios.delete(`${secretKey}/rm-services/delete-rm-services`, {
                    data: { companyName, serviceName }
                });

                //console.log(response.data);
                Swal.fire('Deleted!', 'The record has been deleted.', 'success');
                fetchData();
                // Handle UI updates or further actions after deletion
            } catch (error) {
                console.error("Error Deleting Company", error.message);
                Swal.fire('Error!', 'Failed to delete the record.', 'error');
                // Handle error scenario, e.g., show an error message or handle error state
            }
        } else {
            // Handle cancel or dismiss scenario if needed
            Swal.fire('Cancelled', 'Delete operation cancelled.', 'info');
        }
    };


    //console.log("servicesdata", rmServicesData)

    //---------date format------------------------

    function formatDatePro(inputDate) {
        const options = { year: "numeric", month: "long", day: "numeric" };
        const formattedDate = new Date(inputDate).toLocaleDateString(
            "en-US",
            options
        );
        return formattedDate;
    }

    function formatDate(dateString) {
        dateString = "2024-07-26"
        const [year, month, date] = dateString.split('-');
        return `${date}/${month}/${year}`
    }

    const handleTabClick = (tab) => {
        if (activeTab === tab) {
            // Double-click detected
            setShowFilterIcon((prevState) => ({
                ...prevState,
                [tab]: !prevState[tab] // Toggle the filter icon state
            }));
        } else {
            // Single-click detected
            setActiveTab(tab);
            setShowFilterIcon({
                General: tab === "General",
                InProcess: tab === "InProcess",
                ReadyToSubmit: tab === "ReadyToSubmit",
                Submitted: tab === "Submited",
                Approved: tab === "Approved",
                Hold: tab === "Hold",
                Defaulter: tab === "Defaulter"
            });
        }
    };

    //console.log("showFilter", showFilterIcon)



    const mycustomloop = Array(20).fill(null); // Create an array with 10 elements
    const [openCompanyTaskComponent, setOpenCompanyTaskComponent] = useState(false)

    return (
        <div>
            <AdminExecutiveHeader name={employeeData.ename} designation={employeeData.designation} />
            <AdminExecutiveNavbar adminExecutiveUserId={adminExecutiveUserId} />

            {!openCompanyTaskComponent &&
                <div className="page-wrapper rm-mybookingmain">
                    <div className="page-header rm_Filter m-0">
                        <div className="container-xl">
                            <div className="d-flex aling-items-center justify-content-between">
                                {/* <div className="btn-group" role="group" aria-label="Basic example">
                                    <button type="button" className="btn mybtn"
                                        onClick={() => handleTabClick(activeTab)}
                                    >
                                        <IoFilterOutline className='mr-1' /> Filter
                                    </button>
                                </div> */}
                                <div className="d-flex align-items-center">
                                    {/* {selectedRows.length !== 0 && (
                                    <div className="selection-data" >
                                        Total Data Selected : <b>{selectedRows.length}</b>
                                    </div>
                                )} */}
                                    <div class="input-icon ml-1">
                                        <span class="input-icon-addon">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon mybtn" width="18" height="18" viewBox="0 0 22 22" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                                                <path d="M21 21l-6 -6"></path>
                                            </svg>
                                        </span>
                                        <input
                                            className="form-control search-cantrol mybtn"
                                            placeholder="Search…"
                                            type="text"
                                            name="bdeName-search"
                                            id="bdeName-search" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="page-body rm_Dtl_box m-0">
                        <div className="container-xl mt-2">
                            <div className="rm_main_card">
                                <div className="my-tab card-header for_adminex" style={{ marginBottom: "-2px" }}>
                                    <ul class="nav nav-tabs rm_task_section_navtabs for_adminex_navtabs  nav-fill p-0">
                                        <li class="nav-item rm_task_section_navitem">
                                            <a class="nav-link active" data-bs-toggle="tab" href="#General"
                                                onClick={() => setActiveTab("General")}
                                            >
                                                <div className="d-flex align-items-center justify-content-between w-100">
                                                    <div className="rm_txt_tsn">
                                                        General
                                                    </div>
                                                    <div className="rm_tsn_bdge">
                                                        {rmServicesData ? rmServicesData.filter(item => item.mainCategoryStatus === "General").length : 0}
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                        <li class="nav-item rm_task_section_navitem">
                                            <a class="nav-link" data-bs-toggle="tab" href="#InProcess">
                                                <div className="d-flex align-items-center justify-content-between w-100">
                                                    <div className="rm_txt_tsn">
                                                        In Process
                                                    </div>
                                                    <div className="rm_tsn_bdge">
                                                    {rmServicesData ? rmServicesData.filter(item => item.mainCategoryStatus === "Process").length : 0}
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                        <li class="nav-item rm_task_section_navitem">
                                            <a class="nav-link" data-bs-toggle="tab" href="#Approved">
                                               
                                                <div className="d-flex align-items-center justify-content-between w-100">
                                                    <div className="rm_txt_tsn">
                                                        Approved
                                                    </div>
                                                    <div className="rm_tsn_bdge">
                                                    {rmServicesData ? rmServicesData.filter(item => item.mainCategoryStatus === "Approved").length : 0}
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                        <li class="nav-item rm_task_section_navitem">
                                            <a class="nav-link" data-bs-toggle="tab" href="#Hold">
                                                <div className="d-flex align-items-center justify-content-between w-100">
                                                    <div className="rm_txt_tsn">
                                                        Hold
                                                    </div>
                                                    <div className="rm_tsn_bdge">
                                                    {rmServicesData ? rmServicesData.filter(item => item.mainCategoryStatus === "Hold").length : 0}

                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                        <li class="nav-item rm_task_section_navitem">
                                            <a class="nav-link" data-bs-toggle="tab" href="#Defaulter">
                                                <div className="d-flex align-items-center justify-content-between w-100">
                                                    <div className="rm_txt_tsn">
                                                        Defaulter
                                                    </div>
                                                    <div className="rm_tsn_bdge">
                                                    {rmServicesData ? rmServicesData.filter(item => item.mainCategoryStatus === "Defaulter").length : 0}


                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div class="tab-content card-body">
                                    <div class="tab-pane active" id="General">
                                        <AdminExecutiveGeneralPanel rmServicesData={rmServicesData} showFilter={showFilterIcon.General} />
                                    </div>
                                    <div class="tab-pane" id="InProcess">
                                        <AdminExecutiveProcessPanel/>
                                    </div>
                                    <div class="tab-pane" id="Approved">
                                       <AdminExecutiveApprovedPanel/>
                                    </div>
                                    <div class="tab-pane" id="Hold">
                                        <AdminExecutiveHoldPanel/>
                                    </div>
                                    <div class="tab-pane" id="Defaulter">
                                        <AdminExecutiveDefaulterPanel/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
            {/* {openCompanyTaskComponent &&
                <>
                    <RmofCertificationCompanyTaskManage />
                </>} */}
        </div>
    )
}

export default AdminExecutiveMyBookings