import React, { useState, useEffect, useSyncExternalStore } from "react";
import RmofCertificationHeader from "../RM-CERT-COMPONENTS/RmofCertificationHeader";
import RmCertificationNavbar from "../RM-CERT-COMPONENTS/RmCertificationNavbar";
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
import RmofCertificationCompanyTaskManage from "./RmofCertificationCompanyTaskManage";
import { FaRegEye } from "react-icons/fa";
import { CiUndo } from "react-icons/ci";
import { FaWhatsapp } from "react-icons/fa";
import StatusDropdown from "../Extra-Components/status-dropdown";
import DscStatusDropdown from "../Extra-Components/dsc-status-dropdown";
import RmofCertificationGeneralPanel from "./RmofCertificationGeneralPanel";
import RmofCertificationProcessPanel from "./RmofCertificationProcessPanel";
import RmofCertificationSubmittedPanel from "./RmofCertificationSubmittedPanel";
import RmofCertificationApprovedPanel from "./RmofCertificationApprovedPanel";
import RmofCertificationDefaulterPanel from "./RmofCertificationDefaulterPanel";
import RmofCertificationHoldPanel from "./RmofCertificationHoldPanel";
import io from 'socket.io-client';
import RmofCertificationReadyToSubmitPanel from "./RmofCertificationReadyToSubmitPanel";
import * as XLSX from "xlsx";
import { LiaPagerSolid } from "react-icons/lia";

function RmofCertificationMyBookings() {
    const rmCertificationUserId = localStorage.getItem("rmCertificationUserId")
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
    const [totalDocumentsProcess, setTotalDocumentsProcess] = useState(0);
    const [totalDocumentsDefaulter, setTotalDocumentsDefaulter] = useState(0);
    const [totalDocumentsReadyToSubmit, setTotalDocumentsReadyToSubmit] = useState(0);
    const [totalDocumentsSubmitted, setTotalDocumentsSubmitted] = useState(0);
    const [totalDocumentsHold, setTotalDocumentsHold] = useState(0);
    const [totalDocumentsApproved, setTotalDocumentsApproved] = useState(0);
    const [noOfFilteredData, setnoOfFilteredData] = useState(0);
    const [showNoOfFilteredData, setShowNoOfFilteredData] = useState(true);
    const [openCompanyTaskComponent, setOpenCompanyTaskComponent] = useState(false)
    const [completeEmployeeInfo, setcompleteEmployeeInfo] = useState([])

    useEffect(() => {
        document.title = `AdminHead-Sahay-CRM`;
    }, []);

    useEffect(() => {
        const socket = secretKey === "http://localhost:3001/api" ? io("http://localhost:3001") : io("wss://startupsahay.in", {
            secure: true, // Use HTTPS
            path: '/socket.io',
            reconnection: true,
            transports: ['websocket'],
        });

        socket.on("rm-general-status-updated", (res) => {
            fetchRMServicesData(search)
        });

        socket.on("rm-recievedamount-updated", (res) => {
            fetchRMServicesData(search)
        });

        socket.on("rm-recievedamount-deleted", (res) => {
            fetchRMServicesData(search)
        });
        socket.on("booking-deleted", (res) => {
            fetchRMServicesData(search)
        });

        socket.on("booking-updated", (res) => {
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
            const userData = tempData.find((item) => item._id === rmCertificationUserId);
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
            const response = await axios.get(`${secretKey}/rm-services/rm-sevicesgetrequest`, {
                params: { search: searchQuery, page, activeTab: activeTab }
            });

            const {
                data,
                totalPages,
                totalDocumentsGeneral,
                totalDocumentsProcess,
                totalDocumentsDefaulter,
                totalDocumentsReadyToSubmit,
                totalDocumentsSubmitted,
                totalDocumentsHold,
                totalDocumentsApproved,

            } = response.data;
            //console.log("response", response.data)

            // If it's a search query, replace the data; otherwise, append for pagination
            if (page === 1) {
                // This is either the first page load or a search operation
                setRmServicesData(data);
            } else {
                // This is a pagination request
                setRmServicesData(prevData => [...prevData, ...data]);
            }
            setTotalDocumentsProcess(totalDocumentsProcess)
            setTotalDocumentsGeneral(totalDocumentsGeneral)
            setTotalDocumentsDefaulter(totalDocumentsDefaulter)
            setTotalDocumentsReadyToSubmit(totalDocumentsReadyToSubmit)
            setTotalDocumentsSubmitted(totalDocumentsSubmitted)
            setTotalDocumentsHold(totalDocumentsHold)
            setTotalDocumentsApproved(totalDocumentsApproved)
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

    //console.log("showiconfilter", showNoOfFilteredData)
    //console.log("nooffilterdata", noOfFilteredData)


    //----------------------------function to upload excel sheet----------------------------
    const handleFileUploadForChange = async (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const binaryStr = event.target.result;
                const workbook = XLSX.read(binaryStr, { type: 'binary' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const data = XLSX.utils.sheet_to_json(worksheet);

                try {
                    // Send the data to the backend to update the ename
                    const response = await axios.post(`${secretKey}/rm-services/upload-approved-data`, data);
                    if (response.status === 200) {
                        alert('Leads updated successfully!');
                    } else {
                        alert('Failed to update leads.');
                    }
                } catch (error) {
                    console.error('Error uploading file:', error);
                    alert('An error occurred while uploading the file.');
                }
            };

            reader.readAsBinaryString(file);
        }
    };

    const handleDeleteFile = async () => {
        try {
            const response = await axios.delete(`${secretKey}/rm-services/delete-directuploadedleads`)
            if (response.status === 200) {
                alert('Leads deleted successfully!');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('An error occurred while uploading the file.');
        }
    }


    return (
        <div>
            <RmofCertificationHeader id={employeeData._id} name={employeeData.ename} empProfile={employeeData.profilePhoto && employeeData.profilePhoto.length !== 0 && employeeData.profilePhoto[0].filename} gender={employeeData.gender} designation={employeeData.newDesignation} />
            <RmCertificationNavbar rmCertificationUserId={rmCertificationUserId} />

            {!openCompanyTaskComponent &&
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
                                                : activeTab === "InProcess"
                                                    ? totalDocumentsProcess
                                                    : activeTab === "ReadyToSubmit"
                                                        ? totalDocumentsReadyToSubmit
                                                        : activeTab === "Submited"
                                                            ? totalDocumentsSubmitted
                                                            : activeTab === "Approved"
                                                                ? totalDocumentsApproved
                                                                : activeTab === "Hold"
                                                                    ? totalDocumentsHold
                                                                    : activeTab === "Defaulter"
                                                                        ? totalDocumentsDefaulter
                                                                        : 0}
                                        </b>
                                    </div>
                                )}
                                {/* <div className="d-flex align-item-center justify-content-between">
                                    <div>
                                        <input type="file" accept=".xlsx, .xls,.csv" onChange={handleFileUploadForChange} style={{ display: 'none' }} id="fileInput" />
                                        <button type="button" className="btn mybtn" onClick={() => document.getElementById('fileInput').click()}>
                                            <LiaPagerSolid className="mr-1" />
                                            Upload Approved Leads
                                        </button>
                                    </div>
                                    <div>
                                        <input type="file" accept=".xlsx, .xls,.csv" style={{ display: 'none' }} id="fileInput" />
                                        <button type="button" className="btn mybtn" onClick={handleDeleteFile}>
                                            <LiaPagerSolid className="mr-1" />
                                            Delete Approved Leads
                                        </button>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                    <div className="page-body rm_Dtl_box m-0">
                        <div className="container-xl mt-2">
                            <div className="rm_main_card">
                                <div className="my-tab card-header" style={{ marginBottom: "-2px" }}>
                                    <ul class="nav nav-tabs rm_task_section_navtabs nav-fill p-0">
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
                                                        setActiveTab("InProcess")}
                                                >
                                                    <div className="rm_txt_tsn">
                                                        In Process
                                                    </div>
                                                    <div className="rm_tsn_bdge">
                                                        {totalDocumentsProcess}
                                                        {/* {rmServicesData ? rmServicesData.filter(item => item.mainCategoryStatus === "Process").length : 0} */}

                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                        <li class="nav-item rm_task_section_navitem">
                                            <a class="nav-link" data-bs-toggle="tab" href="#ReadyToSubmit"
                                                onClick={() => setActiveTab("ReadyToSubmit")}>
                                                <div className="d-flex align-items-center justify-content-between w-100">
                                                    <div className="rm_txt_tsn">
                                                        Ready To Submit
                                                    </div>
                                                    <div className="rm_tsn_bdge">
                                                        {/* {rmServicesData ? rmServicesData.filter(item => item.mainCategoryStatus === "Ready To Submit").length : 0} */}
                                                        {totalDocumentsReadyToSubmit}
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                        <li class="nav-item rm_task_section_navitem">
                                            <a class="nav-link" data-bs-toggle="tab" href="#Submited"
                                                onClick={() => setActiveTab("Submited")}>
                                                <div className="d-flex align-items-center justify-content-between w-100">
                                                    <div className="rm_txt_tsn">
                                                        Submited
                                                    </div>
                                                    <div className="rm_tsn_bdge">
                                                        {/* {rmServicesData ? rmServicesData.filter(item => item.mainCategoryStatus === "Submitted").length : 0} */}
                                                        {totalDocumentsSubmitted}
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                        <li class="nav-item rm_task_section_navitem">
                                            <a class="nav-link" data-bs-toggle="tab" href="#Approved"
                                                onClick={() => setActiveTab("Approved")}
                                            >
                                                <div className="d-flex align-items-center justify-content-between w-100">
                                                    <div className="rm_txt_tsn">
                                                        Approved
                                                    </div>
                                                    <div className="rm_tsn_bdge">
                                                        {/* {rmServicesData ? rmServicesData.filter(item => item.mainCategoryStatus === "Approved").length : 0} */}
                                                        {totalDocumentsApproved}
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                        <li class="nav-item rm_task_section_navitem">
                                            <a class="nav-link" data-bs-toggle="tab" href="#Hold"
                                                onClick={() => setActiveTab("Hold")}
                                            >
                                                <div className="d-flex align-items-center justify-content-between w-100">
                                                    <div className="rm_txt_tsn">
                                                        Hold
                                                    </div>
                                                    <div className="rm_tsn_bdge">
                                                        {/* {rmServicesData ? rmServicesData.filter(item => item.mainCategoryStatus === "Hold").length : 0} */}
                                                        {totalDocumentsHold}
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                        <li class="nav-item rm_task_section_navitem">
                                            <a class="nav-link" data-bs-toggle="tab" href="#Defaulter" onClick={() => setActiveTab("Defaulter")}>
                                                <div className="d-flex align-items-center justify-content-between w-100">
                                                    <div className="rm_txt_tsn">
                                                        Defaulter
                                                    </div>
                                                    <div className="rm_tsn_bdge">
                                                        {/* {rmServicesData ? rmServicesData.filter(item => item.mainCategoryStatus === "Defaulter").length : 0} */}
                                                        {totalDocumentsDefaulter}
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div class="tab-content card-body">
                                    <div class="tab-pane active" id="General">
                                        <RmofCertificationGeneralPanel
                                            showingFilterIcon={setShowNoOfFilteredData}
                                            totalFilteredData={activeTab === "General" ? setNoOfData : () => { }}
                                            searchText={search}
                                            activeTab={activeTab}
                                            showFilter={showFilterIcon.General}
                                            completeEmployeeInfo={completeEmployeeInfo}
                                        />
                                    </div>
                                    <div class="tab-pane" id="InProcess">
                                        <RmofCertificationProcessPanel
                                            showingFilterIcon={setShowNoOfFilteredData}
                                            totalFilteredData={activeTab === "InProcess" ? setNoOfData : () => { }}
                                            searchText={search}
                                            activeTab={activeTab}
                                            showFilter={showFilterIcon.InProcess}
                                            completeEmployeeInfo={completeEmployeeInfo}

                                        />
                                    </div>
                                    <div class="tab-pane" id="ReadyToSubmit">
                                        <RmofCertificationReadyToSubmitPanel
                                            showingFilterIcon={setShowNoOfFilteredData}
                                            totalFilteredData={activeTab === "ReadyToSubmit" ? setNoOfData : () => { }}
                                            activeTab={activeTab}
                                            searchText={search}
                                            rmServicesData={rmServicesData} showFilter={showFilterIcon.ReadyToSubmit}
                                            completeEmployeeInfo={completeEmployeeInfo}
                                             />
                                    </div>
                                    <div class="tab-pane" id="Submited">
                                        <RmofCertificationSubmittedPanel
                                            showingFilterIcon={setShowNoOfFilteredData}
                                            totalFilteredData={activeTab === "Submited" ? setNoOfData : () => { }}
                                            searchText={search}
                                            activeTab={activeTab}
                                            showFilter={showFilterIcon.Submited}
                                            completeEmployeeInfo={completeEmployeeInfo}
                                             />
                                    </div>
                                    <div class="tab-pane" id="Approved">
                                        <RmofCertificationApprovedPanel
                                            showingFilterIcon={setShowNoOfFilteredData}
                                            totalFilteredData={activeTab === "Approved" ? setNoOfData : () => { }}
                                            searchText={search}
                                            activeTab={activeTab}
                                            showFilter={showFilterIcon.Approved}
                                            completeEmployeeInfo={completeEmployeeInfo}

                                        />
                                    </div>
                                    <div class="tab-pane" id="Hold">
                                        <RmofCertificationHoldPanel
                                            showingFilterIcon={setShowNoOfFilteredData}
                                            totalFilteredData={activeTab === "Hold" ? setNoOfData : () => { }}
                                            searchText={search}
                                            activeTab={activeTab}
                                            showFilter={showFilterIcon.Hold}
                                            completeEmployeeInfo={completeEmployeeInfo}

                                        />
                                    </div>
                                    <div class="tab-pane" id="Defaulter">
                                        <RmofCertificationDefaulterPanel
                                            showingFilterIcon={setShowNoOfFilteredData}
                                            totalFilteredData={activeTab === "Defaulter" ? setNoOfData : () => { }}
                                            searchText={search}
                                            activeTab={activeTab}
                                            showFilter={showFilterIcon.Defaulter}
                                            completeEmployeeInfo={completeEmployeeInfo}
                                             />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
            {openCompanyTaskComponent &&
                <>
                    <RmofCertificationCompanyTaskManage />
                </>}
        </div>
    )
}

export default RmofCertificationMyBookings