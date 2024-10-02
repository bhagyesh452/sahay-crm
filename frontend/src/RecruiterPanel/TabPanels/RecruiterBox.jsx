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
import { FaRegEye } from "react-icons/fa";
import { CiUndo } from "react-icons/ci";
import { FaWhatsapp } from "react-icons/fa";

import io from 'socket.io-client';
import * as XLSX from "xlsx";
import { LiaPagerSolid } from "react-icons/lia";
import RecruiterHeader from "../Components/RecuiterHeader";
import RecruiterNavbar from "../Components/RecuiterNavbar";
import RecruiterGeneral from "./RecruiterGeneral";
import RecruiterUnderReview from "./RecuiterUndeReview";
import RecruiterOnHold from "./RecruiterOnHold";
import RecruiterDisqualified from "./RecruiterDisqualified";
import RecruiterRejected from "./RecruiterRejected";
import RecruiterSelected from "./RecruiterSelected";

function RecruiterBox() {
    const recruiterUserId = localStorage.getItem("recruiterUserId")
    const [employeeData, setEmployeeData] = useState([])
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [currentDataLoading, setCurrentDataLoading] = useState(false)
    const [rmServicesData, setRmServicesData] = useState([]);
    const [search, setSearch] = useState("");
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
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalDocumentsGeneral, setTotalDocumentsGeneral] = useState(0);
    const [totalDocumentsUnderReview, setTotalDocumentsUnderReview] = useState(0);
    const [totalDocumentsOnHold, setTotalDocumentsOnHold] = useState(0);
    const [totalDocumentsDisqualified, setTotalDocumentsDisqualified] = useState(0);
    const [totalDocumentsRejected, settotalDocumentsRejected] = useState(0);
    const [totalDocumentsSelected, settotalDocumentsSelected] = useState(0);
    const [noOfFilteredData, setnoOfFilteredData] = useState(0);
    const [showNoOfFilteredData, setShowNoOfFilteredData] = useState(true);
    const [openCompanyTaskComponent, setOpenCompanyTaskComponent] = useState(false)
    const [completeEmployeeInfo, setcompleteEmployeeInfo] = useState([])

    useEffect(() => {
        document.title = `Recruiter-Sahay-CRM`;
    }, []);

    useEffect(() => {
        const socket = secretKey === "http://localhost:3001/api" ? io("http://localhost:3001") : io("wss://startupsahay.in", {
            secure: true, // Use HTTPS
            path: '/socket.io',
            reconnection: true,
            transports: ['websocket'],
        });

        socket.on("recruiter-general-status-updated", (res) => {
            fetchRMServicesData(search)
        });
        socket.on("recruiter-application-submitted", (res) => {
            fetchRMServicesData(search)
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
            const userData = tempData.find((item) => item._id === recruiterUserId);
            //console.log(userData)
            setEmployeeData(userData);
            setcompleteEmployeeInfo(tempData);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };

    const fetchRMServicesData = async (searchQuery = "", page = 1) => {
        try {
            setCurrentDataLoading(true);
            const response = await axios.get(`${secretKey}/recruiter/recruiter-data`, {
                params: {
                    search: searchQuery,
                    page,
                    activeTab: activeTab
                }
            });
            const {
                data,
                totalPages,
                totalDocumentsGeneral,
                totalDocumentsUnderReview,
                totalDocumentsOnHold,
                totalDocumentsDisqualified,
                totalDocumentsRejected,
                totalDocumentsSelected,
                

            } = response.data;
            console.log("response", response.data)

            // If it's a search query, replace the data; otherwise, append for pagination
            if (page === 1) {
                // This is either the first page load or a search operation
                setRmServicesData(data);
            } else {
                // This is a pagination request
                setRmServicesData(prevData => [...prevData, ...data]);
            }
            setTotalDocumentsUnderReview(totalDocumentsUnderReview)
            setTotalDocumentsGeneral(totalDocumentsGeneral)
            setTotalDocumentsOnHold(totalDocumentsOnHold)
            setTotalDocumentsDisqualified(totalDocumentsDisqualified)
            settotalDocumentsRejected(totalDocumentsRejected)
            settotalDocumentsSelected(totalDocumentsSelected)
           
            setTotalPages(totalPages); // Update total pages
        } catch (error) {
            console.error("Error fetching data", error.message);
        } finally {
            setCurrentDataLoading(false);
        }
    };


    useEffect(() => {
        fetchRMServicesData("", page); // Fetch data initially
    }, [employeeData]);

    useEffect(() => {
        fetchRMServicesData(search, page); // Fetch data when search query changes
    }, [search]);

    const handleSearchChange = (event) => {
        setSearch(event.target.value); // Update search query state
    };

    useEffect(() => {
        fetchData();
    }, []);

    const setNoOfData = (number) => {
        //console.log("number", number)
        setnoOfFilteredData(number)
    }


    return (
        <div>
            <RecruiterHeader id={employeeData._id} name={employeeData.ename} empProfile={employeeData.profilePhoto && employeeData.profilePhoto.length !== 0 && employeeData.profilePhoto[0].filename} gender={employeeData.gender} designation={employeeData.newDesignation} />
            <RecruiterNavbar recruiterUserId={recruiterUserId} />


            <div className="page-wrapper rm-mybookingmain">
                <div className="page-header rm_Filter m-0">
                    <div className="container-xl">
                        <div className="d-flex aling-items-center justify-content-between">
                            <div className="d-flex align-items-center">
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
                                        id="bdeName-search"
                                        value={search}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                            </div>
                            {noOfFilteredData > 0 && (
                                <div className="selection-data">
                                    Result : <b>
                                        {noOfFilteredData} /
                                        {activeTab === "General"
                                            ? totalDocumentsGeneral
                                            : activeTab === "UnderReview"
                                                ? totalDocumentsUnderReview
                                                : activeTab === "On Hold"
                                                    ? totalDocumentsOnHold
                                                    : activeTab === "Disqualified"
                                                        ? totalDocumentsDisqualified
                                                        : activeTab === "Rejected"
                                                            ? totalDocumentsRejected
                                                            : activeTab === "Selected"
                                                                ? totalDocumentsSelected

                                                                : 0}
                                    </b>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="page-body rm_Dtl_box m-0">
                    <div className="container-xl mt-2">
                        <div className="rm_main_card">
                            <div className="my-tab card-header for_adminex" style={{ marginBottom: "-2px" }}>
                                <ul class="nav nav-tabs rm_task_section_navtabs for_adminex_navtabs nav-fill p-0">
                                    <li class="nav-item rm_task_section_navitem">
                                        <a class="nav-link active" data-bs-toggle="tab" href="#General"
                                            onClick={() =>
                                                setActiveTab("General")
                                            }
                                        >
                                            <div className="d-flex align-items-center justify-content-between w-100">
                                                <div className="rm_txt_tsn">
                                                    General
                                                </div>
                                                <div className="rm_tsn_bdge">
                                                    {totalDocumentsGeneral}
                                                    {/* {rmServicesData ? rmServicesData.filter(item => item.mainCategoryStatus === "General").length : 0} */}
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li class="nav-item rm_task_section_navitem">
                                        <a class="nav-link" data-bs-toggle="tab" href="#InProcess">
                                            <div className="d-flex align-items-center justify-content-between w-100"
                                                onClick={() =>
                                                    setActiveTab("UnderReview")}
                                            >
                                                <div className="rm_txt_tsn">
                                                    Under Review
                                                </div>
                                                <div className="rm_tsn_bdge">
                                                    {totalDocumentsUnderReview}
                                                    {/* {rmServicesData ? rmServicesData.filter(item => item.mainCategoryStatus === "Process").length : 0} */}

                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li class="nav-item rm_task_section_navitem">
                                        <a class="nav-link" data-bs-toggle="tab" href="#ReadyToSubmit"
                                            onClick={() => setActiveTab("on Hold")}>
                                            <div className="d-flex align-items-center justify-content-between w-100">
                                                <div className="rm_txt_tsn">
                                                    On Hold
                                                </div>
                                                <div className="rm_tsn_bdge">
                                                    {/* {rmServicesData ? rmServicesData.filter(item => item.mainCategoryStatus === "Ready To Submit").length : 0} */}
                                                    {totalDocumentsOnHold}
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li class="nav-item rm_task_section_navitem">
                                        <a class="nav-link" data-bs-toggle="tab" href="#Submited"
                                            onClick={() => setActiveTab("Disqualified")}>
                                            <div className="d-flex align-items-center justify-content-between w-100">
                                                <div className="rm_txt_tsn">
                                                    Disqualified
                                                </div>
                                                <div className="rm_tsn_bdge">
                                                    {/* {rmServicesData ? rmServicesData.filter(item => item.mainCategoryStatus === "Submitted").length : 0} */}
                                                    {totalDocumentsDisqualified}
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li class="nav-item rm_task_section_navitem">
                                        <a class="nav-link" data-bs-toggle="tab" href="#Approved"
                                            onClick={() => setActiveTab("Rejected")}
                                        >
                                            <div className="d-flex align-items-center justify-content-between w-100">
                                                <div className="rm_txt_tsn">
                                                    Rejected
                                                </div>
                                                <div className="rm_tsn_bdge">
                                                    {/* {rmServicesData ? rmServicesData.filter(item => item.mainCategoryStatus === "Approved").length : 0} */}
                                                    {totalDocumentsRejected}
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li class="nav-item rm_task_section_navitem">
                                        <a class="nav-link" data-bs-toggle="tab" href="#Hold"
                                            onClick={() => setActiveTab("Selected")}
                                        >
                                            <div className="d-flex align-items-center justify-content-between w-100">
                                                <div className="rm_txt_tsn">
                                                    Selected
                                                </div>
                                                <div className="rm_tsn_bdge">
                                                    {/* {rmServicesData ? rmServicesData.filter(item => item.mainCategoryStatus === "Hold").length : 0} */}
                                                    {totalDocumentsSelected}
                                                </div>
                                            </div>
                                        </a>
                                    </li>

                                </ul>
                            </div>
                            <div class="tab-content card-body">
                                <div class="tab-pane active" id="General">
                                    <RecruiterGeneral
                                        showingFilterIcon={setShowNoOfFilteredData}
                                        totalFilteredData={activeTab === "General" ? setNoOfData : () => { }}
                                        searchText={search}
                                        activeTab={activeTab}
                                        showFilter={showFilterIcon.General}
                                        completeEmployeeInfo={completeEmployeeInfo}
                                    />
                                </div>
                                <div class="tab-pane" id="InProcess">
                                    <RecruiterUnderReview
                                        showingFilterIcon={setShowNoOfFilteredData}
                                        totalFilteredData={activeTab === "UnderReview" ? setNoOfData : () => { }}
                                        searchText={search}
                                        activeTab={activeTab}
                                        showFilter={showFilterIcon.InProcess}
                                        completeEmployeeInfo={completeEmployeeInfo}

                                    />
                                </div>
                                <div class="tab-pane" id="ReadyToSubmit">
                                    <RecruiterOnHold
                                        showingFilterIcon={setShowNoOfFilteredData}
                                        totalFilteredData={activeTab === "On Hold" ? setNoOfData : () => { }}
                                        activeTab={activeTab}
                                        searchText={search}
                                        rmServicesData={rmServicesData} showFilter={showFilterIcon.ReadyToSubmit}
                                        completeEmployeeInfo={completeEmployeeInfo}
                                    />
                                </div>
                                <div class="tab-pane" id="Submited">
                                    <RecruiterDisqualified
                                        showingFilterIcon={setShowNoOfFilteredData}
                                        totalFilteredData={activeTab === "Disqualified" ? setNoOfData : () => { }}
                                        searchText={search}
                                        activeTab={activeTab}
                                        showFilter={showFilterIcon.Submited}
                                        completeEmployeeInfo={completeEmployeeInfo}
                                    />
                                </div>
                                <div class="tab-pane" id="Approved">
                                        <RecruiterRejected
                                            showingFilterIcon={setShowNoOfFilteredData}
                                            totalFilteredData={activeTab === "Rejected" ? setNoOfData : () => { }}
                                            searchText={search}
                                            activeTab={activeTab}
                                            showFilter={showFilterIcon.Approved}
                                            completeEmployeeInfo={completeEmployeeInfo}

                                        />
                                    </div>
                                    <div class="tab-pane" id="Hold">
                                        <RecruiterSelected
                                            showingFilterIcon={setShowNoOfFilteredData}
                                            totalFilteredData={activeTab === "Selected" ? setNoOfData : () => { }}
                                            searchText={search}
                                            activeTab={activeTab}
                                            showFilter={showFilterIcon.Hold}
                                            completeEmployeeInfo={completeEmployeeInfo}

                                        />
                                    </div>
                                    
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* {openCompanyTaskComponent &&
                <>
                    <RmofCertificationCompanyTaskManage />
                </>} */}
        </div>
    )
}

export default RecruiterBox