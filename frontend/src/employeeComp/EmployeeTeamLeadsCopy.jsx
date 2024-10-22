import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import notificationSound from "../assets/media/iphone_sound.mp3";
import axios from "axios";
import "../assets/table.css";
import "../assets/styles.css";
import CallHistory from "./CallHistory.jsx";
import RedesignedForm from "../admin/RedesignedForm.jsx";
import LeadFormPreview from "../admin/LeadFormPreview.jsx";
import TeamLeadsGeneral from "./EmployeeTeamLeadsTabPanels/TeamLeadsGeneral.jsx";
import TeamLeadsInterested from "./EmployeeTeamLeadsTabPanels/TeamLeadsInterested.jsx";
import TeamLeadsMatured from "./EmployeeTeamLeadsTabPanels/TeamLeadsMatured.jsx";
import TeamLeadsNotInterested from "./EmployeeTeamLeadsTabPanels/TeamLeadsNotInterested.jsx";
import PropTypes from "prop-types";
import Tooltip from "@mui/material/Tooltip";
import { IoFilterOutline } from "react-icons/io5";
// import DrawerComponent from "../components/Drawer.js";
import { MdOutlinePostAdd } from "react-icons/md";
import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash/debounce';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { jwtDecode } from "jwt-decode";

function EmployeeTeamLeadsCopy() {

    const { userId } = useParams();
    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const [moreFilteredData, setmoreFilteredData] = useState([]);
    //const [maturedID, setMaturedID] = useState("");
    const [currentForm, setCurrentForm] = useState(null);
    const [projectionData, setProjectionData] = useState([]);
    const [dataStatus, setDataStatus] = useState("General");
    const [data, setData] = useState([]);
    const [isFilter, setIsFilter] = useState(false);
    const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
    const [employeeName, setEmployeeName] = useState("");
    const [showCallHistory, setShowCallHistory] = useState(false);
    const [clientNumber, setClientNumber] = useState("");
    const [employeeData, setEmployeeData] = useState([]);
    const [nowToFetch, setNowToFetch] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [moreEmpData, setmoreEmpData] = useState([]);
    const [revertedData, setRevertedData] = useState([]);
    const [formOpen, setFormOpen] = useState(false);
    const [addFormOpen, setAddFormOpen] = useState(false);
    const [openBacdrop, setOpenBacdrop] = useState(false);
    const [activeTabId, setActiveTabId] = useState("General"); // Track active tab ID
    const [companyName, setCompanyName] = useState("");
    const [maturedCompanyName, setMaturedCompanyName] = useState("");
    const [companyEmail, setCompanyEmail] = useState("");
    const [companyInco, setCompanyInco] = useState(null);
    const [companyNumber, setCompanyNumber] = useState(0);
    const [companyId, setCompanyId] = useState("");
    const [deletedEmployeeStatus, setDeletedEmployeeStatus] = useState(false);
    const [newBdeName, setNewBdeName] = useState("");
    const [teamData, setTeamData] = useState([]);

    const itemsPerPage = 500;
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // -------------------------call history functions-------------------------------------
    const allTabRef = useRef(null); // Ref for the Matured tab
    const interestedTabRef = useRef(null); // Ref for the Interested tab
    const maturedTabRef = useRef(null); // Ref for the Matured tab
    const notInterestedTabRef = useRef(null); // Ref for the Matured tab

    function formatDateNew(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const handleShowCallHistory = (companyName, clientNumber) => {
        setShowCallHistory(true);
        setClientNumber(clientNumber);
    };

    const hanleCloseCallHistory = () => {
        setShowCallHistory(false);
        if (activeTabId === "Interested" && interestedTabRef.current) {
            interestedTabRef.current.click(); // Trigger the Interested tab click
        } else if (activeTabId === "Matured" && maturedTabRef.current) {
            maturedTabRef.current.click(); // Trigger the Matured tab click
        } else if (activeTabId === "General" && allTabRef.current) {
            allTabRef.current.click(); // Trigger the Matured tab click
        } else if (activeTabId === "Not Interested" && notInterestedTabRef.current) {
            notInterestedTabRef.current.click(); // Trigger the Matured tab click
        }
    };

    const handleOpenFormOpen = (cname, cemail, cindate, employeeId, cnum, isDeletedEmployeeCompany, ename) => {
        setCompanyName(cname);
        setCompanyEmail(cemail);
        setCompanyInco(cindate);
        setCompanyId(employeeId);
        setCompanyNumber(cnum);
        setDeletedEmployeeStatus(isDeletedEmployeeCompany)
        setNewBdeName(ename)
        if (!isDeletedEmployeeCompany) {
            console.log("formchal")
            setFormOpen(true);
        } else {
            console.log("addleadfromchal")
            setAddFormOpen(true)
        }
    };

    const handleCloseFormOpen = () => {
        setFormOpen(false);
        setAddFormOpen(false);
        setCompanyName("");
        setCompanyEmail("");
        setCompanyInco("");
        setCompanyId("");
        setCompanyNumber("");
        setDeletedEmployeeStatus("")
        setNewBdeName("")
        if (activeTabId === "Interested" && interestedTabRef.current) {
            interestedTabRef.current.click(); // Trigger the Interested tab click
        } else if (activeTabId === "Matured" && maturedTabRef.current) {
            maturedTabRef.current.click(); // Trigger the Matured tab click
        } else if (activeTabId === "General" && allTabRef.current) {
            allTabRef.current.click(); // Trigger the Matured tab click
        } else if (activeTabId === "Not Interested" && notInterestedTabRef.current) {
            notInterestedTabRef.current.click(); // Trigger the Matured tab click
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(`${secretKey}/employee/fetchEmployeeFromId/${userId}`);
            // Set the retrieved data in the state
            const userData = response.data.data;
            setEmployeeName(userData.ename)
            //console.log(userData);
            setData(userData);
            setmoreFilteredData(userData);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };

    const fetchTeamLeadsData = async () => {
        try {
            const response = await axios.get(`${secretKey}/bdm-data/forwardedbybdedata/${employeeName}`);
            setTeamData(response.data);
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(()=>{
        if (employeeName) {
            fetchTeamLeadsData();
        }
    }, [employeeName]);

    const fetchProjections = async () => {
        try {
            const response = await axios.get(`${secretKey}/projection/projection-data`);
            setProjectionData(response.data);
        } catch (error) {
            console.error("Error fetching Projection Data:", error.message);
        }
    };

    const { data: teamLeadsData, isLoading: isTeamLeadsLoading, isError: isTeamLeadsError, refetch: refetchTeamLeads } = useQuery({
        queryKey: ["teamLeadsData", data.ename, dataStatus, currentPage, searchQuery],
        queryFn: async () => {
            const res = await axios.get(`${secretKey}/bdm-data/teamLeadsData/${data.ename}`, {
                params: {
                    status: dataStatus,
                    companyName: searchQuery, // Send the search query as a parameter
                    page: currentPage + 1, // Send current page for pagination
                    limit: itemsPerPage, // Set the limit of records per page
                }
            });
            return res;
        },
        enabled: !!data.ename,  // Only fetch data when ename is available
        refetchOnWindowFocus: false,  // Prevent fetching on window focus
        keepPreviousData: true, // This helps prevent a loading state when moving between pages
    });

    console.log("Team leads data is :", teamLeadsData?.data);

    useEffect(() => {
        fetchData();
        fetchProjections();
    }, []);

    // const debouncedRefetch = useCallback(debounce(() => {
    //     refetch();
    // }, 300), [refetch]);

    // const handleDataStatusChange = useCallback((status, tabRef) => {
    //     setDataStatus(status);
    //     setCurrentPage(0); // Reset to the first page
    //     // debouncedRefetch(); // Call the debounced refetch function
    //     setActiveTabId(status)
    //     if (tabRef && tabRef.current) {
    //         tabRef.current.click(); // Programmatically click the anchor tag to trigger Bootstrap tab switch
    //     }
    // }, []);

    // Auto logout functionality :
    useEffect(() => {
        // Function to check token expiry and initiate logout if expired
        const checkTokenExpiry = () => {
            const token = localStorage.getItem("newtoken");
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    const currentTime = Date.now() / 1000; // Get current time in seconds
                    if (decoded.exp < currentTime) {
                        // console.log("Decode Expirary :", decoded.exp);
                        // Token expired, perform logout actions
                        // console.log("Logout called");
                        handleLogout();
                    } else {
                        // Token not expired, continue session
                        const timeToExpire = decoded.exp - currentTime;

                    }
                } catch (error) {
                    console.error("Error decoding token:", error);
                    // console.log("Logout called");
                    handleLogout(); // Handle invalid token or decoding errors
                }
            }
        };

        // Initial check on component mount
        checkTokenExpiry();

        // Periodically check token expiry (e.g., every minute)
        const interval = setInterval(checkTokenExpiry, 60000); // 60 seconds

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    const handleLogout = () => {
        // Clear local storage and redirect to login page
        localStorage.removeItem("newtoken");
        localStorage.removeItem("userId");
        // localStorage.removeItem("designation");
        // localStorage.removeItem("loginTime");
        // localStorage.removeItem("loginDate");
        window.location.replace("/"); // Redirect to login page
    };

    return (
        <div>
            {!showCallHistory && !formOpen && !addFormOpen ? (
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
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
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

                        <div onCopy={(e) => e.preventDefault()} className="page-body">

                            <div className="container-xl">
                                <div class="card-header my-tab">
                                    <ul class="nav nav-tabs sales-nav-tabs card-header-tabs nav-fill p-0" data-bs-toggle="tabs">
                                        <li class="nav-item sales-nav-item data-heading" ref={allTabRef}>
                                            <a
                                                href="#general"
                                                ref={allTabRef} // Attach the ref to the anchor tag
                                                // onClick={() => handleDataStatusChange("All", allTabRef)}
                                                onClick={() => {
                                                    setDataStatus("General");
                                                    setActiveTabId("General");
                                                }}
                                                className={`nav-link  ${dataStatus === "General" ? "active item-act" : ""}`}
                                                data-bs-toggle="tab"
                                            >
                                                <div>General</div>
                                                <div className="no_badge">
                                                    {teamLeadsData?.data?.totalGeneral || 0}
                                                </div>

                                            </a>
                                        </li>

                                        <li class="nav-item sales-nav-item data-heading" ref={interestedTabRef}>
                                            <a
                                                href="#Interested"
                                                ref={interestedTabRef}
                                                // onClick={() => handleDataStatusChange("Interested", interestedTabRef)}
                                                onClick={() => {
                                                    setDataStatus("Interested");
                                                    setActiveTabId("Interested");
                                                }}
                                                className={`nav-link ${dataStatus === "Interested" ? "active item-act" : ""}`}
                                                data-bs-toggle="tab"
                                            >
                                                Interested
                                                <span className="no_badge">
                                                    {teamLeadsData?.data?.totalInterested || 0}
                                                </span>
                                            </a>
                                        </li>

                                        <li class="nav-item sales-nav-item data-heading" ref={maturedTabRef}>
                                            <a
                                                href="#Matured"
                                                ref={maturedTabRef}
                                                // onClick={() => handleDataStatusChange("Matured", maturedTabRef)}
                                                onClick={() => {
                                                    setDataStatus("Matured");
                                                    setActiveTabId("Matured");
                                                }}
                                                className={`nav-link ${dataStatus === "Matured" ? "active item-act" : ""}`}
                                                data-bs-toggle="tab"
                                            >
                                                Matured
                                                <span className="no_badge">
                                                    {teamLeadsData?.data?.totalMatured || 0}
                                                </span>
                                            </a>
                                        </li>

                                        <li class="nav-item sales-nav-item data-heading">
                                            <a
                                                href="#NotInterested"
                                                ref={notInterestedTabRef}
                                                // onClick={() => handleDataStatusChange("Not Interested", notInterestedTabRef)}
                                                onClick={() => {
                                                    setDataStatus("Not Interested");
                                                    setActiveTabId("Not Interested");
                                                }}
                                                className={`nav-link ${dataStatus === "Not Interested" ? "active item-act" : ""}`}
                                                data-bs-toggle="tab"
                                            >
                                                Not Interested
                                                <span className="no_badge">
                                                    {teamLeadsData?.data?.totalNotInterested || 0}
                                                </span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <div className="tab-content card-body">
                                    <div className={`tab-pane ${dataStatus === "General" ? "active" : ""}`} id="general">
                                        {activeTabId === "General" && dataStatus === "General" && (<TeamLeadsGeneral
                                            secretKey={secretKey}
                                            generalData={teamLeadsData?.data?.data}
                                            // isLoading={isLoading}
                                            refetchTeamLeads={refetchTeamLeads}
                                            formatDateNew={formatDateNew}
                                            startIndex={startIndex}
                                            endIndex={endIndex}
                                            totalPages={teamLeadsData?.data?.totalPages}
                                            setCurrentPage={setCurrentPage}
                                            currentPage={currentPage}
                                            dataStatus={dataStatus}
                                            setDataStatus={setDataStatus}
                                            ename={data.ename}
                                            email={data.email}
                                            designation={data.designation}
                                            handleShowCallHistory={handleShowCallHistory}
                                            projectionData={projectionData}
                                        />)}
                                    </div>

                                    <div className={`tab-pane ${dataStatus === "Interested" ? "active" : ""}`} id="Interested">
                                        {activeTabId === "Interested" && dataStatus === "Interested" && (<TeamLeadsInterested
                                            secretKey={secretKey}
                                            interestedData={teamLeadsData?.data?.data}
                                            // isLoading={isLoading}
                                            refetchTeamLeads={refetchTeamLeads}
                                            formatDateNew={formatDateNew}
                                            startIndex={startIndex}
                                            endIndex={endIndex}
                                            totalPages={teamLeadsData?.data?.totalPages}
                                            setCurrentPage={setCurrentPage}
                                            currentPage={currentPage}
                                            dataStatus={dataStatus}
                                            setDataStatus={setDataStatus}
                                            ename={data.ename}
                                            email={data.email}
                                            designation={data.designation}
                                            handleShowCallHistory={handleShowCallHistory}
                                            fetchProjections={fetchProjections}
                                            projectionData={projectionData}
                                            teamData={teamData}
                                            handleOpenFormOpen={handleOpenFormOpen}
                                        />)}
                                    </div>

                                    <div className={`tab-pane ${dataStatus === "Matured" ? "active" : ""}`} id="Matured">
                                        {activeTabId === "Matured" && (<TeamLeadsMatured
                                            secretKey={secretKey}
                                            maturedData={teamLeadsData?.data?.data}
                                            // isLoading={isLoading}
                                            refetchTeamLeads={refetchTeamLeads}
                                            formatDateNew={formatDateNew}
                                            startIndex={startIndex}
                                            endIndex={endIndex}
                                            totalPages={teamLeadsData?.data?.totalPages}
                                            setCurrentPage={setCurrentPage}
                                            currentPage={currentPage}
                                            dataStatus={dataStatus}
                                            setDataStatus={setDataStatus}
                                            ename={data.ename}
                                            email={data.email}
                                            designation={data.designation}
                                            handleShowCallHistory={handleShowCallHistory}
                                            fetchProjections={fetchProjections}
                                            projectionData={projectionData}
                                        />)}
                                    </div>

                                    <div className={`tab-pane ${dataStatus === "Not Interested" ? "active" : ""}`} id="NotInterested">
                                        {activeTabId === "Not Interested" && (<TeamLeadsNotInterested
                                            secretKey={secretKey}
                                            notInterestedData={teamLeadsData?.data?.data}
                                            // isLoading={isLoading}
                                            refetchTeamLeads={refetchTeamLeads}
                                            formatDateNew={formatDateNew}
                                            startIndex={startIndex}
                                            endIndex={endIndex}
                                            totalPages={teamLeadsData?.data?.totalPages}
                                            setCurrentPage={setCurrentPage}
                                            currentPage={currentPage}
                                            dataStatus={dataStatus}
                                            setDataStatus={setDataStatus}
                                            ename={data.ename}
                                            email={data.email}
                                            designation={data.designation}
                                            handleShowCallHistory={handleShowCallHistory}
                                        />)}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            ) : showCallHistory ? (
                <CallHistory
                    handleCloseHistory={hanleCloseCallHistory}
                    clientNumber={clientNumber}
                />
            ) : formOpen ? (
                <RedesignedForm
                    isEmployee={true}
                    companysName={companyName}
                    companysEmail={companyEmail}
                    companyNumber={companyNumber}
                    setNowToFetch={refetchTeamLeads}
                    companysInco={companyInco}
                    employeeName={data.ename}
                    employeeEmail={data.email}
                    handleCloseFormOpen={handleCloseFormOpen}
                />
            ) : null
            }

            {/* --------------------------------backdrop------------------------- */}
            {isTeamLeadsLoading && (
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}

        </div>
    );
}

export default EmployeeTeamLeadsCopy;