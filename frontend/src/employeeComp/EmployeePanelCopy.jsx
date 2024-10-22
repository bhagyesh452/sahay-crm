import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams , Link } from "react-router-dom";
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
import { FaCircleChevronRight } from "react-icons/fa6";
import { FaCircleChevronLeft } from "react-icons/fa6";
import { IoIosArrowDropleft } from "react-icons/io";
import { MdOutlinePersonPin } from "react-icons/md";
import { AiOutlineTeam } from "react-icons/ai";
import { RiShareForwardFill } from "react-icons/ri";
import Swal from "sweetalert2";
import AssignLeads from "../admin/ExtraComponent/AssignLeads.jsx";
import ForwardToBdmDialog from "../admin/ExtraComponent/ForwardToBdmDialog.jsx";

function EmployeePanelCopy({ fordesignation }) {
    const [moreFilteredData, setmoreFilteredData] = useState([]);
    //const [maturedID, setMaturedID] = useState("");
    const [currentForm, setCurrentForm] = useState(null);
    const [projectionData, setProjectionData] = useState([]);
    const [dataStatus, setdataStatus] = useState("All");
    const [data, setData] = useState([]);
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const frontendKey = process.env.REACT_APP_FRONTEND_KEY;
    const [isFilter, setIsFilter] = useState(false)
    const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
    const [employeeName, setEmployeeName] = useState("");
    const [showCallHistory, setShowCallHistory] = useState(false);
    const [clientNumber, setClientNumber] = useState("");
    const [employenewEmpData, setEmployenewEmpData] = useState([]);
    const [nowToFetch, setNowToFetch] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 50;
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const { userId } = useParams();
    const [searchQuery, setSearchQuery] = useState("")

    const [moreEmpData, setmoreEmpData] = useState([]);

    const [revertedData, setRevertedData] = useState([]);
    const [formOpen, setFormOpen] = useState(false);
    //const [editFormOpen, setEditFormOpen] = useState(false);
    const [addFormOpen, setAddFormOpen] = useState(false)
    const [openBacdrop, setOpenBacdrop] = useState(false)
    const [activeTabId, setActiveTabId] = useState("All"); // Track active tab ID
    const [companyName, setCompanyName] = useState("");
    const [maturedCompanyName, setMaturedCompanyName] = useState("");
    const [companyEmail, setCompanyEmail] = useState("");
    const [companyInco, setCompanyInco] = useState(null);
    const [companyNumber, setCompanyNumber] = useState(0);
    const [companyId, setCompanyId] = useState("");
    const [deletedEmployeeStatus, setDeletedEmployeeStatus] = useState(false)
    const [newBdeName, setNewBdeName] = useState("")
    const [newEmpData, setNewEmpData] = useState([])
    const { id } = useParams();


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


    function navigate(url) {
        window.location.href = url;
    }



    useEffect(() => {
        if (userId && data.designation === "Sales Executive") {
            document.title = `Employee-Sahay-CRM`;
        } else if (userId && data.designation === "Sales Manager") {
            document.title = `Floor-Manager-Sahay-CRM`;
        } else {
            document.title = `Admin-Sahay-CRM`;
        }
    }, [data.ename]);


    const fetchData = async () => {
        let fetchingId;
        if (userId) {
            fetchingId = userId
        } else {
            fetchingId = id
        }
        try {
            const completeEmployess = await axios.get(`${secretKey}/employee/einfo`);
            const response = await axios.get(`${secretKey}/employee/fetchEmployeeFromId/${fetchingId}`);
            // Set the retrieved data in the state
            const userData = response.data.data;
            setEmployeeName(userData.ename)
            //console.log(userData);
            setData(userData);
            setmoreFilteredData(userData);
            setNewEmpData(completeEmployess.data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };



    useEffect(() => {
        fetchData();
        fetchProjections();
    }, []);

    const fetchProjections = async () => {
        try {
            const response = await axios.get(
                `${secretKey}/projection/projection-data/${data.ename}`
            );
            setProjectionData(response.data);
        } catch (error) {
            console.error("Error fetching Projection Data:", error.message);
        }
    };

    function formatDateNew(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }



    // --------------------------------------forward to bdm function---------------------------------------------\

    const [cid, setcid] = useState("");

    function ValueLabelComponent(props) {
        const { children, value } = props;

        return (
            <Tooltip enterTouchDelay={0} placement="top" title={value}>
                {children}
            </Tooltip>
        );
    }

    ValueLabelComponent.propTypes = {
        children: PropTypes.element.isRequired,
        value: PropTypes.number.isRequired,
    };

    const iOSBoxShadow =
        '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

    // -------------------request dialog functions-------------------
    const [open, openchange] = useState(false);
    const functionopenpopup = () => {
        openchange(true);
    };

    // Fetch employee data using React Query
    const [fetchedData, setFetchedData] = useState([]);
    const [totalCounts, setTotalCounts] = useState({
        untouched: 0,
        interested: 0,
        matured: 0,
        forwarded: 0,
        notInterested: 0
    });
    const [totalPages, setTotalPages] = useState(0)
    const cleanString = (str) => {
        return typeof str === 'string' ? str.replace(/\u00A0/g, ' ').trim() : '';
    };

    const { data: queryData, isLoading, isError, refetch } = useQuery(
        {
            queryKey: ['newData', cleanString(data.ename), currentPage, searchQuery], // Add searchQuery to the queryKey
            queryFn: async () => {
                const skip = currentPage * itemsPerPage; // Calculate skip based on current page
                const response = await axios.get(`${secretKey}/company-data/employees-new/${cleanString(data.ename)}`, {
                    params: {
                        dataStatus: dataStatus,
                        limit: itemsPerPage,
                        skip: skip,
                        search: searchQuery // Send the search query as a parameter
                    }
                });
                return response.data; // Directly return the data
            },
            // staleTime: 300000, // Cache for 1 minute
            // cacheTime: 300000, // Cache for 1 minute
            refetchOnWindowFocus: false,
            keepPreviousData: true
        }
    );

    // Handle search
    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrentPage(0); // Reset to the first page on search
        refetch(); // Refetch the data
    };

    useEffect(() => {
        if (isLoading) {
            setOpenBacdrop(true); // Set openBackDrop to true when loading
        } else {
            setOpenBacdrop(false); // Set openBackDrop to false when not loading
        }

        if (queryData) {
            // Assuming queryData now contains both data and revertedData
            setFetchedData(queryData.data); // Update the fetched data
            setRevertedData(queryData.revertedData); // Set revertedData based on response
            setmoreEmpData(queryData.data);
            setEmployenewEmpData(queryData.data);
            setTotalCounts(queryData.totalCounts);
            setTotalPages(Math.ceil(queryData.totalPages)); // Calculate total pages
        }
    }, [isLoading, queryData, dataStatus, currentPage]);

    // Create a debounced version of refetch
    const debouncedRefetch = useCallback(debounce(() => {
        refetch();
    }, 300), [refetch]);

    const handlnewEmpDataStatusChange = useCallback((status, tabRef) => {
        setdataStatus(status);
        setCurrentPage(0); // Reset to the first page
        debouncedRefetch(); // Call the debounced refetch function
        setActiveTabId(status)
        if (tabRef && tabRef.current) {
            tabRef.current.click(); // Programmatically click the anchor tag to trigger Bootstrap tab switch
        }
    }, [debouncedRefetch]);

    const handleCloseBackdrop = () => {
        setOpenBacdrop(false)
    }

    // -------------------------call history functions-------------------------------------
    const interestedTabRef = useRef(null); // Ref for the Interested tab
    const maturedTabRef = useRef(null); // Ref for the Matured tab
    const allTabRef = useRef(null); // Ref for the Matured tab
    const notInterestedTabRef = useRef(null); // Ref for the Matured tab
    const forwardedTabRef = useRef(null); // Ref for the Matured tab
    const handleShowCallHistory = (companyName, clientNumber) => {
        setShowCallHistory(true)
        setClientNumber(clientNumber)
    }

    const hanleCloseCallHistory = () => {
        setShowCallHistory(false);
        if (activeTabId === "Interested" && interestedTabRef.current) {
            interestedTabRef.current.click(); // Trigger the Interested tab click
        } else if (activeTabId === "Matured" && maturedTabRef.current) {
            maturedTabRef.current.click(); // Trigger the Matured tab click
        } else if (activeTabId === "All" && allTabRef.current) {
            allTabRef.current.click(); // Trigger the Matured tab click
        } else if (activeTabId === "Not Interested" && notInterestedTabRef.current) {
            notInterestedTabRef.current.click(); // Trigger the Matured tab click
        } else if (activeTabId === "Forwarded" && forwardedTabRef.current) {
            forwardedTabRef.current.click(); // Trigger the Matured tab click
        }
    };

    // -----------------matured leads--------------------------

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
    }

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
        debouncedRefetch();
        if (activeTabId === "Interested" && interestedTabRef.current) {
            interestedTabRef.current.click(); // Trigger the Interested tab click
        } else if (activeTabId === "Matured" && maturedTabRef.current) {
            maturedTabRef.current.click(); // Trigger the Matured tab click
        } else if (activeTabId === "All" && allTabRef.current) {
            allTabRef.current.click(); // Trigger the Matured tab click
        } else if (activeTabId === "Not Interested" && notInterestedTabRef.current) {
            notInterestedTabRef.current.click(); // Trigger the Matured tab click
        } else if (activeTabId === "Forwarded" && forwardedTabRef.current) {
            forwardedTabRef.current.click(); // Trigger the Matured tab click
        }
    }

    // -------------------------------------------checkbox change funtions-----------------------

    const [selectedRows, setSelectedRows] = useState([]);
    const [startRowIndex, setStartRowIndex] = useState(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const handleCheckboxChange = (id, event) => {
        // If the id is 'all', toggle all checkboxes
        if (id === "all") {
            // If all checkboxes are already selected, clear the selection; otherwise, select all
            setSelectedRows((prevSelectedRows) =>
                prevSelectedRows.length === fetchedData.length
                    ? []
                    : fetchedData.map((row) => row._id)
            );
        } else {
            // Toggle the selection status of the row with the given id
            setSelectedRows((prevSelectedRows) => {
                // If the Ctrl key is pressed
                if (event.ctrlKey) {
                    //console.log("pressed");
                    const selectedIndex = fetchedData.findIndex((row) => row._id === id);
                    const lastSelectedIndex = fetchedData.findIndex((row) =>
                        prevSelectedRows.includes(row._id)
                    );

                    // Select rows between the last selected row and the current row
                    if (lastSelectedIndex !== -1 && selectedIndex !== -1) {
                        const start = Math.min(selectedIndex, lastSelectedIndex);
                        const end = Math.max(selectedIndex, lastSelectedIndex);
                        const idsToSelect = fetchedData
                            .slice(start, end + 1)
                            .map((row) => row._id);

                        return prevSelectedRows.includes(id)
                            ? prevSelectedRows.filter((rowId) => !idsToSelect.includes(rowId))
                            : [...prevSelectedRows, ...idsToSelect];
                    }
                }

                // Toggle the selection status of the row with the given id
                return prevSelectedRows.includes(id)
                    ? prevSelectedRows.filter((rowId) => rowId !== id)
                    : [...prevSelectedRows, id];
            });
        }
    };


    const handleMouseDown = (id) => {
        // Initiate drag selection
        setStartRowIndex(fetchedData.findIndex((row) => row._id === id));
    };

    const handleMouseEnter = (id) => {
        if (startRowIndex !== null && fordesignation === "admin") {
            const endRowIndex = fetchedData.findIndex(row => row._id === id);

            // Ensure startRowIndex and endRowIndex are valid and within array bounds
            const validStartIndex = Math.min(startRowIndex, endRowIndex);
            const validEndIndex = Math.max(startRowIndex, endRowIndex);

            // Only proceed if valid indices
            if (validStartIndex >= 0 && validEndIndex < fetchedData.length) {
                const selectedRange = [];
                for (let i = validStartIndex; i <= validEndIndex; i++) {
                    if (fetchedData[i] && fetchedData[i]._id) {
                        // Ensure that fetchedData[i] is not undefined and has an _id
                        selectedRange.push(fetchedData[i]._id);
                    }
                }

                setSelectedRows(selectedRange); // Update selected rows
            }
        }
    };

    const handleMouseUp = () => {
        // End drag selection
        setStartRowIndex(null);
    };

    // console.log("fordesignation", fordesignation)
    // console.log("fetcgeheddata", fetchedData)
    // console.log("dataStatus", dataStatus)

    // -----------------------------assign leads functions---------------------------
    const [openAssign, openchangeAssign] = useState(false);
    const [selectedOption, setSelectedOption] = useState("direct");
    const [newemployeeSelection, setnewEmployeeSelection] = useState("Not Alloted");

    const functionOpenAssign = () => {
        openchangeAssign(true);
    };
    const closepopupAssign = () => {
        openchangeAssign(false);
    };
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleUploadData = async (e) => {
        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();

        const csvdata = employenewEmpData
            .filter((employee) => selectedRows.includes(employee._id))
            .map((employee) => ({
                ...employee,
                //Status: "Untouched",
                Remarks: "No Remarks Added",
            }));
        console.log(csvdata)

        try {
            Swal.fire({
                title: 'Assigning...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            const response = await axios.post(`${secretKey}/company-data/assign-new`, {
                ename: selectedOption === "extractedData" ? "Extracted" : newemployeeSelection,
                data: csvdata,
            });

            Swal.close();
            Swal.fire({
                title: "Data Sent!",
                text: "Data sent successfully!",
                icon: "success",
            });


            setnewEmployeeSelection("Not Alloted");
            closepopupAssign();
            setSelectedRows([])
            refetch()
            //   setIsFilter(false)
            //   setIsSearch(false)
        } catch (error) {
            console.error("Error updating employee data:", error);
            Swal.close();
            Swal.fire({
                title: "Error!",
                text: "Failed to update employee data. Please try again later.",
                icon: "error",
            });
        }
    };

    // ----------------forward to bdm popup------------------
    const [openAssignToBdm, setOpenAssignToBdm] = useState(false);
    const [bdmName, setBdmName] = useState("Not Alloted");
    const handleCloseForwardBdmPopup = () => {
        setOpenAssignToBdm(false);
    };
    const handleForwardDataToBDM = async (bdmName) => {
        const data = employenewEmpData.filter((employee) => selectedRows.includes(employee._id));
        // console.log("data is:", data);
        if (selectedRows.length === 0) {
            Swal.fire("Please Select the Company to Forward", "", "Error");
            setBdmName("Not Alloted");
            handleCloseForwardBdmPopup();
            return;
        }
        try {
            Swal.fire({
                title: 'Assigning...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            const response = await axios.post(`${secretKey}/bdm-data/leadsforwardedbyadmintobdm`, {
                data: data,
                name: bdmName
            });
            Swal.close();
            Swal.fire({
                title: "Data Sent!",
                text: "Data sent successfully!",
                icon: "success",
            });
            refetch()
            setBdmName("Not Alloted");
            handleCloseForwardBdmPopup();
            setSelectedRows([]);
            //setdataStatus("All");

        } catch (error) {
            console.log("error fetching data", error.message);
            Swal.close();
            Swal.fire({
                title: "Error!",
                text: "Failed to update employee data. Please try again later.",
                icon: "error",
            });
        }
    };

    // -----------------------functions to change url--------------------------
    const handleChangeUrlPrev = () => {
        const currId = id;
        const salesExecutivesIds = newEmpData
      .filter((employee) => employee.designation === "Sales Executive" || employee.designation === "Sales Manager")
      .map((employee) => employee._id);
        //console.log(newEmpData); // This is how the array looks like ['65bcb5ac2e8f74845bdc6211', '65bde8cf23df48d5fe3227ca']

        // Find the index of the currentId in the newEmpData array
        const currentIndex = salesExecutivesIds.findIndex((itemId) => itemId === currId);

        if (currentIndex !== -1) {
            // Calculate the previous index in a circular manner
            const prevIndex = (currentIndex - 1 + salesExecutivesIds.length) % salesExecutivesIds.length;

            if (currentIndex === 0) {
                // If it's the first page, navigate to the employees page
                window.location.replace(`/managing-director/user`);
                //setBackButton(false)
            } else {
                // Get the previousId from the salesExecutivesIds array
                const prevId = salesExecutivesIds[prevIndex];
                window.location.replace(`/managing-director/employees/${prevId}`);
            }
            //setBackButton(prevIndex !== 0);
        } else {
            console.log("Current ID not found in newEmpData array.");
        }
    };

    const handleChangeUrl = () => {
        const currId = id;
        // Filter the response data to find _id values where designation is "Sales Executive" or "Sales Manager"
      const salesExecutivesIds = newEmpData
      .filter((employee) => employee.designation === "Sales Executive" || employee.designation === "Sales Manager")
      .map((employee) => employee._id);
      
        //console.log(newEmpData); // This is how the array looks like ['65bcb5ac2e8f74845bdc6211', '65bde8cf23df48d5fe3227ca']

        // Find the index of the currentId in the newEmpData array
        const currentIndex = salesExecutivesIds.findIndex((itemId) => itemId === currId);

        if (currentIndex !== -1) {
            // Calculate the next index in a circular manner
            const nextIndex = (currentIndex + 1) % salesExecutivesIds.length;

            // Get the nextId from the salesExecutivesIds array
            const nextId = salesExecutivesIds[nextIndex];
            window.location.replace(`/managing-director/employees/${nextId}`);
            //setBackButton(nextId !== 0);
        } else {
            console.log("Current ID not found in newEmpData array.");
        }
    };
    console.log("selectedRows", selectedRows)

    return (
        <div>
            {!showCallHistory && !formOpen && !addFormOpen ?
                (<div className="page-wrapper">
                    <div className="page-wrapper">
                        <div className="page-header mt-3">
                            <div className="container-xl">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <div >
                                            {fordesignation === "admin" ? (
                                                <>
                                                    <div className="btn-group mr-1" role="group" aria-label="Basic example">
                                                        <button className="btn mybtn">
                                                            <FaCircleChevronLeft 
                                                            className="ep_right_button" 
                                                            onClick={handleChangeUrlPrev}  
                                                            />
                                                        </button>
                                                        <button className="btn mybtn"><b>{data.ename}</b></button>
                                                        <button className="btn mybtn">
                                                            <FaCircleChevronRight 
                                                            className="ep_left_button"
                                                            onClick={handleChangeUrl} 
                                                            />
                                                            </button>
                                                    </div>
                                                    <div className="btn-group" role="group" aria-label="Basic example">

                                                        <button onClick={() => {
                                                            window.location.pathname = `/managing-director/employees/${id}`
                                                        }}
                                                            type="button"
                                                            className={window.location.pathname === `/managing-director/employees/${id}` && data.bdmWork ? "btn mybtn active" : "btn mybtn"}

                                                        >
                                                            <MdOutlinePersonPin

                                                                className='mr-1' /> Leads
                                                        </button>
                                                        {data.bdmWork &&
                                                            <button type="button"
                                                                className={window.location.pathname === `/managing-director/employeeleads/${id}` ? "btn mybtn active" : "btn mybtn"}

                                                                onClick={() => {
                                                                    window.location.pathname = `/managing-director/employeeleads/${id}`
                                                                }}
                                                            >
                                                                <AiOutlineTeam
                                                                    className='mr-1' /> Team Leads
                                                            </button>}
                                                    </div>
                                                </>

                                            ) : (
                                                <EmployeeAddLeadDialog
                                                    secretKey={secretKey}
                                                    fetchData={fetchData}
                                                    ename={data.ename}
                                                    refetch={refetch}

                                                />
                                            )}

                                        </div>

                                        {fordesignation !== "admin" && (
                                            <div className="btn-group" role="group" aria-label="Basic example">
                                                {/* <button data-bs-toggle="modal" data-bs-target="#staticBackdrop">Popup</button> */}
                                                <button type="button"
                                                    className={isFilter ? 'btn mybtn active' : 'btn mybtn'}
                                                    onClick={() => setOpenFilterDrawer(true)}
                                                >
                                                    <IoFilterOutline className='mr-1' /> Filter
                                                </button>
                                                <button type="button" className="btn mybtn"
                                                    onClick={functionopenpopup}
                                                >
                                                    <MdOutlinePostAdd className='mr-1' /> Request Data
                                                </button>
                                                {open &&
                                                    <EmployeeRequestDataDialog
                                                        secretKey={secretKey}
                                                        ename={data.ename}
                                                        setOpenChange={openchange}
                                                        open={open}
                                                    />}

                                            </div>
                                        )}
                                    </div>
                                    <div className="d-flex align-items-center">
                                        {fordesignation === "admin" && (
                                            <>
                                                {selectedRows.length !== 0 && (
                                                    <div className="selection-data mr-1" >
                                                        Total Data Selected : <b>{selectedRows.length}</b>
                                                    </div>
                                                )}
                                                <div className="btn-group mr-1" role="group" aria-label="Basic example">
                                                    <Link

                                                        to={`/managing-director/user`}
                                                        style={{ marginLeft: "10px" }}
                                                    >
                                                        <button type="button" className="btn mybtn"

                                                        >
                                                            <IoIosArrowDropleft className='mr-1' /> Back
                                                        </button>
                                                        </Link>
                                                </div>

                                                <div className="btn-group" role="group" aria-label="Basic example">
                                                    {/* <button data-bs-toggle="modal" data-bs-target="#staticBackdrop">Popup</button> */}

                                                    <button type="button" className="btn mybtn"
                                                        onClick={() => { setOpenAssignToBdm(true) }}
                                                    >
                                                        <RiShareForwardFill className='mr-1' /> Forward To BDM
                                                    </button>
                                                    {
                                                        openAssignToBdm && (
                                                            <ForwardToBdmDialog
                                                                openAssignToBdm={openAssignToBdm}
                                                                handleCloseForwardBdmPopup={handleCloseForwardBdmPopup}
                                                                handleForwardDataToBDM={handleForwardDataToBDM}
                                                                setBdmName={setBdmName}
                                                                bdmName={bdmName}
                                                                newempData={newEmpData}
                                                                id={fordesignation === "admin" ? id : userId}
                                                                branchName={data.branchOffice}
                                                            />
                                                        )
                                                    }
                                                    <button type="button" className="btn mybtn"
                                                        onClick={functionOpenAssign}
                                                    >
                                                        <MdOutlinePostAdd className='mr-1' /> Assign Leads
                                                    </button>
                                                    {
                                                        openAssign && (
                                                            <AssignLeads
                                                                openAssign={openAssign}
                                                                closepopupAssign={closepopupAssign}
                                                                selectedOption={selectedOption}
                                                                setSelectedOption={setSelectedOption}
                                                                newemployeeSelection={newemployeeSelection}
                                                                setnewEmployeeSelection={setnewEmployeeSelection}
                                                                handleOptionChange={handleOptionChange}
                                                                handleUploadData={handleUploadData}
                                                                newempData={newEmpData}
                                                            />
                                                        )
                                                    }
                                                </div>
                                            </>
                                        )}
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
                                                onChange={(e) => {
                                                    setSearchQuery(e.target.value);
                                                    handleSearch(e.target.value)
                                                    //handleFilterSearch(e.target.value)
                                                    //setCurrentPage(0);
                                                }}
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
                                    <ul class="nav nav-tabs sales-nav-tabs card-header-tabs nav-fill p-0"
                                        data-bs-toggle="tabs">
                                        <li class="nav-item sales-nav-item data-heading" ref={allTabRef}>
                                            <a
                                                href="#general"
                                                ref={allTabRef} // Attach the ref to the anchor tag
                                                onClick={() => handlnewEmpDataStatusChange("All", allTabRef)}
                                                className={`nav-link  ${dataStatus === "All" ? "active item-act" : ""}`}
                                                data-bs-toggle="tab"
                                            >

                                                <div>General</div>
                                                <div className="no_badge">
                                                    {totalCounts.untouched}
                                                </div>

                                            </a>
                                        </li>
                                        <li class="nav-item sales-nav-item data-heading" ref={interestedTabRef}>
                                            <a
                                                href="#Interested"
                                                ref={interestedTabRef} // Attach the ref to the anchor tag
                                                onClick={() => handlnewEmpDataStatusChange("Interested", interestedTabRef)}
                                                className={`nav-link ${dataStatus === "Interested" ? "active item-act" : ""}`}
                                                data-bs-toggle="tab"
                                            >
                                                Interested
                                                <span className="no_badge">
                                                    {totalCounts.interested}
                                                </span>
                                            </a>
                                        </li>
                                        <li class="nav-item sales-nav-item data-heading" ref={maturedTabRef}>
                                            <a
                                                href="#Matured"
                                                ref={maturedTabRef} // Attach the ref to the anchor tag
                                                onClick={() => handlnewEmpDataStatusChange("Matured", maturedTabRef)}
                                                className={`nav-link ${dataStatus === "Matured" ? "active item-act" : ""}`}
                                                data-bs-toggle="tab"
                                            >
                                                Matured
                                                <span className="no_badge">
                                                    {totalCounts.matured}
                                                </span>
                                            </a>
                                        </li>
                                        {data.designation !== "Sales Manager" &&
                                            (<li class="nav-item sales-nav-item data-heading">
                                                <a
                                                    href="#Forwarded"
                                                    ref={forwardedTabRef} // Attach the ref to the anchor tag
                                                    onClick={() => handlnewEmpDataStatusChange("Forwarded", forwardedTabRef)}
                                                    className={`nav-link ${dataStatus === "Forwarded" ? "active item-act" : ""}`}
                                                    data-bs-toggle="tab"
                                                >
                                                    Forwarded
                                                    <span className="no_badge">
                                                        {totalCounts.forwarded}
                                                    </span>
                                                </a>
                                            </li>)
                                        }
                                        <li class="nav-item sales-nav-item data-heading">
                                            <a
                                                href="#NotInterested"
                                                ref={notInterestedTabRef} // Attach the ref to the anchor tag
                                                onClick={() => handlnewEmpDataStatusChange("Not Interested", notInterestedTabRef)}
                                                className={`nav-link ${dataStatus === "Not Interested" ? "active item-act" : ""}`}
                                                data-bs-toggle="tab"
                                            >
                                                Not Interested
                                                <span className="no_badge">
                                                    {totalCounts.notInterested}
                                                </span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="tab-content card-body">
                                    <div className={`tab-pane ${dataStatus === "All" ? "active" : ""}`} id="general">
                                        {activeTabId === "All" && dataStatus === "All" && (
                                            <EmployeeGeneralLeads
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
                                                fordesignation={fordesignation}
                                                setSelectedRows={setSelectedRows}
                                                handleCheckboxChange={handleCheckboxChange}
                                                handleMouseDown={handleMouseDown}
                                                handleMouseEnter={handleMouseEnter}
                                                handleMouseUp={handleMouseUp}
                                                selectedRows={selectedRows}
                                            />)}
                                    </div>
                                    <div className={`tab-pane ${dataStatus === "Interested" ? "active" : ""}`} id="Interested">
                                        {activeTabId === "Interested" && dataStatus === "Interested" && (
                                            <EmployeeInterestedLeads
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
                                                fordesignation={fordesignation}
                                                setSelectedRows={setSelectedRows}
                                                handleCheckboxChange={handleCheckboxChange}
                                                handleMouseDown={handleMouseDown}
                                                handleMouseEnter={handleMouseEnter}
                                                handleMouseUp={handleMouseUp}
                                                selectedRows={selectedRows}
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
                                            fordesignation={fordesignation}
                                            setSelectedRows={setSelectedRows}
                                            handleCheckboxChange={handleCheckboxChange}
                                            handleMouseDown={handleMouseDown}
                                            handleMouseEnter={handleMouseEnter}
                                            handleMouseUp={handleMouseUp}
                                            selectedRows={selectedRows}
                                        />)}
                                    </div>
                                    <div className={`tab-pane ${dataStatus === "Forwarded" ? "active" : ""}`} id="Forwarded">
                                        {activeTabId === "Forwarded" && (
                                            <EmployeeForwardedLeads
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
                                                fordesignation={fordesignation}
                                                setSelectedRows={setSelectedRows}
                                                handleCheckboxChange={handleCheckboxChange}
                                                handleMouseDown={handleMouseDown}
                                                handleMouseEnter={handleMouseEnter}
                                                handleMouseUp={handleMouseUp}
                                                selectedRows={selectedRows}
                                            />)}
                                    </div>
                                    <div className={`tab-pane ${dataStatus === "Not Interested" ? "active" : ""}`} id="NotInterested">
                                        {activeTabId === "Not Interested" && (
                                            <EmployeeNotInterestedLeads
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
                                                fordesignation={fordesignation}
                                                setSelectedRows={setSelectedRows}
                                                handleCheckboxChange={handleCheckboxChange}
                                                handleMouseDown={handleMouseDown}
                                                handleMouseEnter={handleMouseEnter}
                                                handleMouseUp={handleMouseUp}
                                                selectedRows={selectedRows}
                                            />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>) : showCallHistory ?
                    (<CallHistory
                        handleCloseHistory={hanleCloseCallHistory}
                        clientNumber={clientNumber}
                    />)
                    : formOpen ? (
                        <RedesignedForm
                            isEmployee={true}
                            companysName={companyName}
                            companysEmail={companyEmail}
                            companyNumber={companyNumber}
                            setNowToFetch={refetch}
                            companysInco={companyInco}
                            employeeName={data.ename}
                            employeeEmail={data.email}
                            handleCloseFormOpen={handleCloseFormOpen}
                        />
                    ) : addFormOpen ? (
                        <AddLeadForm
                            isEmployee={true}
                            employeeEmail={data.email}
                            newBdeName={newBdeName}
                            isDeletedEmployeeCompany={deletedEmployeeStatus}
                            setFormOpen={setAddFormOpen}
                            companysName={companyName}
                            setNowToFetch={refetch}
                            setDataStatus={setdataStatus}
                            employeeName={data.ename}
                            handleCloseFormOpen={handleCloseFormOpen}
                        />
                    ) : null
            }

            {/* --------------------------------backdrop------------------------- */}
            {openBacdrop && (<Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBacdrop}
                onClick={handleCloseBackdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>)}
        </div>
    );
}

export default EmployeePanelCopy;



