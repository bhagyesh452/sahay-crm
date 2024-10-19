import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import notificationSound from "../assets/media/iphone_sound.mp3";
import axios from "axios";
import "../assets/table.css";
import "../assets/styles.css";
import RedesignedForm from "../admin/RedesignedForm.jsx";
import LeadFormPreview from "../admin/LeadFormPreview.jsx";
import AddLeadForm from "../admin/AddLeadForm.jsx";
import PropTypes from "prop-types";
import Tooltip from "@mui/material/Tooltip";
import { IoFilterOutline } from "react-icons/io5";
// import DrawerComponent from "../components/Drawer.js";
import CallHistory from "./CallHistory.jsx";
import EmployeeAddLeadDialog from "./ExtraComponents/EmployeeAddLeadDialog.jsx";
import EmployeeRequestDataDialog from "./ExtraComponents/EmployeeRequestDataDialog.jsx";
import { MdOutlinePostAdd } from "react-icons/md";
import EmployeeGeneralLeads from "./EmployeeTabPanels/EmployeeGeneralLeads.jsx";
import { useQuery } from '@tanstack/react-query';
import EmployeeInterestedLeads from "./EmployeeTabPanels/EmployeeInterestedLeads.jsx";
import EmployeeMaturedLeads from "./EmployeeTabPanels/EmployeeMaturedLeads.jsx";
import debounce from 'lodash/debounce';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import EmployeeForwardedLeads from "./EmployeeTabPanels/EmployeeForwardedLeads.jsx";
import EmployeeNotInterestedLeads from "./EmployeeTabPanels/EmployeeNotInterestedLeads.jsx";
import { jwtDecode } from "jwt-decode";

function EmployeeTeamLeadsCopy() {

    const { userId } = useParams();
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const frontendKey = process.env.REACT_APP_FRONTEND_KEY;

    const [moreFilteredData, setmoreFilteredData] = useState([]);
    //const [maturedID, setMaturedID] = useState("");
    const [currentForm, setCurrentForm] = useState(null);
    const [projectionData, setProjectionData] = useState([]);
    const [dataStatus, setdataStatus] = useState("All");
    const [data, setData] = useState([]);
    const [isFilter, setIsFilter] = useState(false);
    const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
    const [employeeName, setEmployeeName] = useState("");
    const [showCallHistory, setShowCallHistory] = useState(false);
    const [clientNumber, setClientNumber] = useState("");
    const [employeeData, setEmployeeData] = useState([]);
    const [nowToFetch, setNowToFetch] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [moreEmpData, setmoreEmpData] = useState([]);
    const [revertedData, setRevertedData] = useState([]);
    const [formOpen, setFormOpen] = useState(false);
    //const [editFormOpen, setEditFormOpen] = useState(false);
    const [addFormOpen, setAddFormOpen] = useState(false);
    const [openBacdrop, setOpenBacdrop] = useState(false);
    const [activeTabId, setActiveTabId] = useState("All"); // Track active tab ID
    const [companyName, setCompanyName] = useState("");
    const [maturedCompanyName, setMaturedCompanyName] = useState("");
    const [companyEmail, setCompanyEmail] = useState("");
    const [companyInco, setCompanyInco] = useState(null);
    const [companyNumber, setCompanyNumber] = useState(0);
    const [companyId, setCompanyId] = useState("");
    const [deletedEmployeeStatus, setDeletedEmployeeStatus] = useState(false);
    const [newBdeName, setNewBdeName] = useState("");

    const itemsPerPage = 500;
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return (
        <div>
            <div className="page-wrapper">
                <div className="page-wrapper">
                    <div className="page-header mt-3">
                        <div className="container-xl">
                            <div className="d-flex align-items-center justify-content-between">

                                <div className="d-flex align-items-center">
                                    <div className="btn-group" role="group" aria-label="Basic example">
                                        <button type="button" className={isFilter ? 'btn mybtn active' : 'btn mybtn'}
                                        // onClick={() => setOpenFilterDrawer(true)}
                                        >
                                            <IoFilterOutline className='mr-1' /> Filter
                                        </button>
                                        {/* {open &&
                                            <EmployeeRequestDataDialog
                                                secretKey={secretKey}
                                                ename={data.ename}
                                                setOpenChange={openchange}
                                                open={open}
                                            />} */}
                                    </div>
                                </div>

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
                                            // value={searchQuery}
                                            // onChange={(e) => {
                                            //     setSearchQuery(e.target.value);
                                            //     handleSearch(e.target.value);
                                            // }}
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

                    <div onCopy={(e) => {
                        e.preventDefault();
                    }}

                        className="page-body">
                        <div className="container-xl">
                            <div class="card-header my-tab">
                                <ul class="nav nav-tabs sales-nav-tabs card-header-tabs nav-fill p-0" data-bs-toggle="tabs">
                                    <li class="nav-item sales-nav-item data-heading" 
                                    // ref={allTabRef}
                                    >
                                        <a
                                            href="#general"
                                            // ref={allTabRef} // Attach the ref to the anchor tag
                                            // onClick={() => handleDataStatusChange("All", allTabRef)}
                                            className={`nav-link  ${dataStatus === "All" ? "active item-act" : ""}`}
                                            data-bs-toggle="tab"
                                        >
                                            <div>General</div>
                                            <div className="no_badge">
                                                {/* {totalCounts.untouched} */}
                                                0
                                            </div>

                                        </a>
                                    </li>

                                    <li class="nav-item sales-nav-item data-heading" 
                                    // ref={interestedTabRef}
                                    >
                                        <a
                                            href="#Interested"
                                            // ref={interestedTabRef} // Attach the ref to the anchor tag
                                            // onClick={() => handleDataStatusChange("Interested", interestedTabRef)}
                                            className={`nav-link ${dataStatus === "Interested" ? "active item-act" : ""}`}
                                            data-bs-toggle="tab"
                                        >
                                            Interested
                                            <span className="no_badge">
                                                {/* {totalCounts.interested} */}
                                                0
                                            </span>
                                        </a>
                                    </li>

                                    <li class="nav-item sales-nav-item data-heading" 
                                    // ref={maturedTabRef}
                                    >
                                        <a
                                            href="#Matured"
                                            // ref={maturedTabRef} // Attach the ref to the anchor tag
                                            // onClick={() => handleDataStatusChange("Matured", maturedTabRef)}
                                            className={`nav-link ${dataStatus === "Matured" ? "active item-act" : ""}`}
                                            data-bs-toggle="tab"
                                        >
                                            Matured
                                            <span className="no_badge">
                                                {/* {totalCounts.matured} */}
                                                0
                                            </span>
                                        </a>
                                    </li>
                                    <li class="nav-item sales-nav-item data-heading">
                                        <a
                                            href="#Forwarded"
                                            // ref={forwardedTabRef} // Attach the ref to the anchor tag
                                            // onClick={() => handleDataStatusChange("Forwarded", forwardedTabRef)}
                                            className={`nav-link ${dataStatus === "Forwarded" ? "active item-act" : ""}`}
                                            data-bs-toggle="tab"
                                        >
                                            Forwarded
                                            <span className="no_badge">
                                                {/* {totalCounts.forwarded} */}
                                                0
                                            </span>
                                        </a>
                                    </li>
                                    <li class="nav-item sales-nav-item data-heading">
                                        <a
                                            href="#NotInterested"
                                            // ref={notInterestedTabRef} // Attach the ref to the anchor tag
                                            // onClick={() => handleDataStatusChange("Not Interested", notInterestedTabRef)}
                                            className={`nav-link ${dataStatus === "Not Interested" ? "active item-act" : ""}`}
                                            data-bs-toggle="tab"
                                        >
                                            Not Interested
                                            <span className="no_badge">
                                                {/* {totalCounts.notInterested } */}
                                                0
                                            </span>
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* <div className="tab-content card-body">
                                <div className={`tab-pane ${dataStatus === "All" ? "active" : ""}`} id="general">
                                    {activeTabId === "All" && dataStatus === "All" && (<EmployeeGeneralLeads
                                        generalData={fetchedData}
                                        isLoading={isLoading}
                                        refetch={refetch}
                                        formatDateNew={formatDateNew}
                                        startIndex={startIndex}
                                        endIndex={endIndex}
                                        totalPages={totalPages}
                                        setCurrentPage={setCurrentPage}
                                        currentPage={currentPage}
                                        dataStatus={dataStatus}
                                        setdataStatus={setdataStatus}
                                        ename={data.ename}
                                        email={data.email}
                                        secretKey={secretKey}
                                        handleShowCallHistory={handleShowCallHistory}
                                        designation={data.designation}
                                    />)}

                                </div>
                                <div className={`tab-pane ${dataStatus === "Interested" ? "active" : ""}`} id="Interested">
                                    {activeTabId === "Interested" && dataStatus === "Interested" && (<EmployeeInterestedLeads
                                        interestedData={fetchedData}
                                        isLoading={isLoading}
                                        refetch={refetch}
                                        formatDateNew={formatDateNew}
                                        startIndex={startIndex}
                                        endIndex={endIndex}
                                        totalPages={totalPages}
                                        setCurrentPage={setCurrentPage}
                                        currentPage={currentPage}
                                        secretKey={secretKey}
                                        dataStatus={dataStatus}
                                        ename={data.ename}
                                        email={data.email}
                                        setdataStatus={setdataStatus}
                                        handleShowCallHistory={handleShowCallHistory}
                                        fetchProjections={fetchProjections}
                                        projectionData={projectionData}
                                        handleOpenFormOpen={handleOpenFormOpen}
                                        designation={data.designation}
                                    />)}
                                </div>

                                <div className={`tab-pane ${dataStatus === "Matured" ? "active" : ""}`} id="Matured">
                                    {activeTabId === "Matured" && (<EmployeeMaturedLeads
                                        maturedLeads={fetchedData}
                                        isLoading={isLoading}
                                        refetch={refetch}
                                        formatDateNew={formatDateNew}
                                        startIndex={startIndex}
                                        endIndex={endIndex}
                                        totalPages={totalPages}
                                        setCurrentPage={setCurrentPage}
                                        currentPage={currentPage}
                                        secretKey={secretKey}
                                        dataStatus={dataStatus}
                                        ename={data.ename}
                                        email={data.email}
                                        setdataStatus={setdataStatus}
                                        handleShowCallHistory={handleShowCallHistory}
                                        fetchProjections={fetchProjections}
                                        projectionData={projectionData}
                                        designation={data.designation}
                                    />)}
                                </div>

                                <div className={`tab-pane ${dataStatus === "Forwarded" ? "active" : ""}`} id="Forwarded">
                                    {activeTabId === "Forwarded" && (<EmployeeForwardedLeads
                                        forwardedLeads={fetchedData}
                                        isLoading={isLoading}
                                        refetch={refetch}
                                        formatDateNew={formatDateNew}
                                        startIndex={startIndex}
                                        endIndex={endIndex}
                                        totalPages={totalPages}
                                        setCurrentPage={setCurrentPage}
                                        currentPage={currentPage}
                                        secretKey={secretKey}
                                        dataStatus={dataStatus}
                                        ename={data.ename}
                                        email={data.email}
                                        setdataStatus={setdataStatus}
                                        handleShowCallHistory={handleShowCallHistory}
                                        designation={data.designation}
                                    />)}
                                </div>

                                <div className={`tab-pane ${dataStatus === "Not Interested" ? "active" : ""}`} id="NotInterested">
                                    {activeTabId === "Not Interested" && (<EmployeeNotInterestedLeads
                                        notInterestedLeads={fetchedData}
                                        isLoading={isLoading}
                                        refetch={refetch}
                                        formatDateNew={formatDateNew}
                                        startIndex={startIndex}
                                        endIndex={endIndex}
                                        totalPages={totalPages}
                                        setCurrentPage={setCurrentPage}
                                        currentPage={currentPage}
                                        secretKey={secretKey}
                                        dataStatus={dataStatus}
                                        ename={data.ename}
                                        email={data.email}
                                        setdataStatus={setdataStatus}
                                        handleShowCallHistory={handleShowCallHistory}
                                        designation={data.designation}
                                    />)}

                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeeTeamLeadsCopy;