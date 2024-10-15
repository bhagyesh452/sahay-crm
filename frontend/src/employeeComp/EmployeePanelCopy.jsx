import React, { useEffect, useState,useCallback } from "react";
import EmpNav from "./EmpNav.js";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import notificationSound from "../assets/media/iphone_sound.mp3";
import axios from "axios";
// import { IconChevronLeft, IconEye } from "@tabler/icons-react";
// import { IconChevronRight } from "@tabler/icons-react";
// import { Drawer } from "@mui/material";
// import { IoIosClose } from "react-icons/io";
// import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import Swal from "sweetalert2";
import "../assets/table.css";
import "../assets/styles.css";
import Nodata from "../components/Nodata.jsx";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import io from "socket.io-client";
import AddCircle from "@mui/icons-material/AddCircle.js";
import { HiOutlineEye } from "react-icons/hi";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { RiEditCircleFill } from "react-icons/ri";
import { IoCloseCircleOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import ScaleLoader from "react-spinners/ScaleLoader";
import ClipLoader from "react-spinners/ClipLoader";
import RedesignedForm from "../admin/RedesignedForm.jsx";
import LeadFormPreview from "../admin/LeadFormPreview.jsx";
import AddLeadForm from "../admin/AddLeadForm.jsx";
import { FaWhatsapp } from "react-icons/fa";
import { TiArrowBack } from "react-icons/ti";
import { TiArrowForward } from "react-icons/ti";
import PropTypes from "prop-types";
import Tooltip from "@mui/material/Tooltip";
import { IoFilterOutline } from "react-icons/io5";
import { Country, State, City } from 'country-state-city';
import { jwtDecode } from "jwt-decode";
// import DrawerComponent from "../components/Drawer.js";
import CallHistory from "./CallHistory.jsx";
import { LuHistory } from "react-icons/lu";
import BdmMaturedCasesDialogBox from "./BdmMaturedCasesDialogBox.jsx";
import ProjectionDialog from "./ExtraComponents/ProjectionDialog.jsx";
import FeedbackDialog from "./ExtraComponents/FeedbackDialog.jsx";
import CsvImportDialog from "./ExtraComponents/ImportCSVDialog.jsx";
import EmployeeAddLeadDialog from "./ExtraComponents/EmployeeAddLeadDialog.jsx";
import EmployeeRequestDataDialog from "./ExtraComponents/EmployeeRequestDataDialog.jsx";
import RemarksDialog from "./ExtraComponents/RemarksDialog.jsx";
import { MdOutlinePostAdd } from "react-icons/md";
import EmployeeGeneralLeads from "./EmployeeTabPanels/EmployeeGeneralLeads.jsx";
import { useQuery } from '@tanstack/react-query';
import EmployeeInterestedLeads from "./EmployeeTabPanels/EmployeeInterestedLeads.jsx";
import EmployeeMaturedLeads from "./EmployeeTabPanels/EmployeeMaturedLeads.jsx";
import debounce from 'lodash/debounce';

function EmployeePanelCopy() {
    const [moreFilteredData, setmoreFilteredData] = useState([]);
    const [isEditProjection, setIsEditProjection] = useState(false);
    const [projectingCompany, setProjectingCompany] = useState("");
    const [BDMrequests, setBDMrequests] = useState(null);
    const [openBooking, setOpenBooking] = useState(false);
    const [sortStatus, setSortStatus] = useState("");
    //const [maturedID, setMaturedID] = useState("");
    const [currentForm, setCurrentForm] = useState(null);

    const [projectionData, setProjectionData] = useState([]);
    const [requestDeletes, setRequestDeletes] = useState([]);
    const [openLogin, setOpenLogin] = useState(false);
    const [requestData, setRequestData] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [csvdata, setCsvData] = useState([]);
    const [dataStatus, setdataStatus] = useState("All");
    const [changeRemarks, setChangeRemarks] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [expandYear, setExpandYear] = useState(0);
    const [bookingIndex, setBookingIndex] = useState(0);
    const [editMoreOpen, setEditMoreOpen] = useState(false);
    const [openCSV, openchangeCSV] = useState(false);
    const [openRemarks, openchangeRemarks] = useState(false);
    const [openAnchor, setOpenAnchor] = useState(false);
    const [openProjection, setOpenProjection] = useState(false);
    const [data, setData] = useState([]);
    const [forwardEname, setForrwardEname] = useState("");
    const [forwardStatus, setForrwardStatus] = useState("");
    const [teamInfo, setTeamInfo] = useState([]);
    const [bdmName, setBdmName] = useState("");
    const [openRevertBackRequestDialog, setOpenRevertBackRequestDialog] = useState(false)
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const frontendKey = process.env.REACT_APP_FRONTEND_KEY;
    const [isFilter, setIsFilter] = useState(false)
    const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
    const [employeeName, setEmployeeName] = useState("");
    const [showCallHistory, setShowCallHistory] = useState(false);
    const [clientNumber, setClientNumber] = useState("");
    const [employeeData, setEmployeeData] = useState([]);
    const [nowToFetch, setNowToFetch] = useState(false);
    const [redesignedData, setRedesignedData] = useState([])
    const [openbdmRequest, setOpenbdmRequest] = useState(false);
    const [selectAllChecked, setSelectAllChecked] = useState(true);
    const [selectedYears, setSelectedYears] = useState([]);
    const [selectedMonths, setSelectedMonths] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [mapArray, setMapArray] = useState([]);
    const [totalBookings, setTotalBookings] = useState([]);
    const itemsPerPage = 500;
    const [year, setYear] = useState(0);
    const [socketID, setSocketID] = useState("");
    const [incoFilter, setIncoFilter] = useState("");
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const { userId } = useParams();
    const [nextFollowUpdate, setNextFollowUpDate] = useState(null)
    const [filteredData, setFilteredData] = useState([]);
    const [isSearch, setIsSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("")
    const [remarksHistory, setRemarksHistory] = useState([]);
    const [filteredRemarks, setFilteredRemarks] = useState([]);
    const [moreEmpData, setmoreEmpData] = useState([]);
    const [tempData, setTempData] = useState([]);
    const [revertedData, setRevertedData] = useState([]);
    const [bdmNames, setBdmNames] = useState([]);
    const [companyName, setCompanyName] = useState("");
    const [maturedCompanyName, setMaturedCompanyName] = useState("");
    const [companyEmail, setCompanyEmail] = useState("");
    const [companyInco, setCompanyInco] = useState(null);
    const [companyNumber, setCompanyNumber] = useState(0);
    const [companyId, setCompanyId] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    //const [editFormOpen, setEditFormOpen] = useState(false);
    const [addFormOpen, setAddFormOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [extraData, setExtraData] = useState([]);
    const stateList = State.getStatesOfCountry("IN")
    const cityList = City.getCitiesOfCountry("IN")
    const [selectedStateCode, setSelectedStateCode] = useState("")
    const [selectedState, setSelectedState] = useState("")
    const [selectedCity, setSelectedCity] = useState(City.getCitiesOfCountry("IN"))
    const [selectedNewCity, setSelectedNewCity] = useState("")
    const [selectedYear, setSelectedYear] = useState("")
    const [selectedMonth, setSelectedMonth] = useState("")
    const [selectedStatus, setSelectedStatus] = useState("")
    const [selectedBDEName, setSelectedBDEName] = useState("")
    const [selectedAssignDate, setSelectedAssignDate] = useState(null)
    const [selectedAdminName, setSelectedAdminName] = useState("")
    const [daysInMonth, setDaysInMonth] = useState([]);
    const [selectedDate, setSelectedDate] = useState(0)
    const [selectedCompanyIncoDate, setSelectedCompanyIncoDate] = useState(null)
    const [openBacdrop, setOpenBacdrop] = useState(false)
    const [companyIncoDate, setCompanyIncoDate] = useState(null);
    const [monthIndex, setMonthIndex] = useState(0)

    //console.log(companyName, companyInco);

    const currentData = employeeData.slice(startIndex, endIndex);
    const [deletedEmployeeStatus, setDeletedEmployeeStatus] = useState(false)
    const [newBdeName, setNewBdeName] = useState("")


    const hanleCloseCallHistory = () => {
        setShowCallHistory(false);
    };



    function navigate(url) {
        window.location.href = url;
    }



    useEffect(() => {
        document.title = `Employee-Sahay-CRM`;
    }, [data.ename]);

    // useEffect(() => {
    //     const socket = secretKey === "http://localhost:3001/api" ? io("http://localhost:3001") : io("wss://startupsahay.in", {
    //         secure: true, // Use HTTPS
    //         path: '/socket.io',
    //         reconnection: true,
    //         transports: ['websocket'],
    //     });
    //     socket.on("connect", () => {
    //         //console.log("Socket connected with ID:", socket.id);
    //         console.log('Connection Successful to socket io')
    //         setSocketID(socket.id);
    //     });

    //     socket.on("request-seen", () => {
    //         // Call fetchRequestDetails function to update request details
    //         //fetchRequestDetails();
    //     });

    //     socket.on("data-sent", () => {
    //         //fetchRequestDetails();
    //     });

    //     // Clean up the socket connection when the component unmounts
    //     return () => {
    //         socket.disconnect();
    //     };
    // }, []);


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

    useEffect(() => {
        fetchData();

    }, [userId]);


    const handleSearch = (searchQuery) => {
        const searchQueryLower = searchQuery.toLowerCase();

        // Check if searchQuery is empty or null
        if (!searchQuery || searchQuery.trim().length === 0) {
            setIsSearch(false);
            setFilteredData(extraData); // Assuming extraData is your full dataset
            return;
        }
        setIsFilter(false);
        setIsSearch(true);
        const filtered = extraData.filter((company) => {
            const companyName = company["Company Name"];
            const companyNumber = company["Company Number"];
            const companyEmail = company["Company Email"];
            const companyState = company.State;
            const companyCity = company.City;

            // Check each field for a match
            if (companyName && companyName.toString().toLowerCase().includes(searchQueryLower)) {
                return true;
            }
            if (companyNumber && companyNumber.toString().includes(searchQueryLower)) {
                return true;
            }
            if (companyEmail && companyEmail.toString().toLowerCase().includes(searchQueryLower)) {
                return true;
            }
            if (companyState && companyState.toString().toLowerCase().includes(searchQueryLower)) {
                return true;
            }
            if (companyCity && companyCity.toString().toLowerCase().includes(searchQueryLower)) {
                return true;
            }

            return false;
        });

        setFilteredData(filtered);
    };

    // useEffect(() => {
    //     if (filteredData.length !== 0) {
    //         //setEmployeeData(filteredData)
    //         if (dataStatus === 'All') {
    //             setEmployeeData(
    //                 filteredData.filter(
    //                     (obj) =>
    //                         obj.Status === "Busy" ||
    //                         obj.Status === "Not Picked Up" ||
    //                         obj.Status === "Untouched"
    //                 )
    //             );
    //         } else if (dataStatus === 'Interested') {
    //             setEmployeeData(
    //                 filteredData.filter(
    //                     (obj) =>
    //                         (obj.Status === "Interested" || obj.Status === "FollowUp") &&
    //                         obj.bdmAcceptStatus === "NotForwarded" &&
    //                         obj.bdmAcceptStatus !== "Pending" &&
    //                         obj.bdmAcceptStatus !== "Accept"
    //                 )
    //             );
    //         } else if (dataStatus === 'Matured') {
    //             setEmployeeData(
    //                 filteredData
    //                     .filter(
    //                         (obj) =>
    //                             obj.Status === "Matured" &&
    //                             (obj.bdmAcceptStatus === "NotForwarded" || obj.bdmAcceptStatus === "Pending" || obj.bdmAcceptStatus === "Accept")
    //                     )
    //             );
    //         } else if (dataStatus === 'Forwarded') {
    //             setEmployeeData(
    //                 filteredData
    //                     .filter(
    //                         (obj) =>
    //                             (obj.bdmAcceptStatus === 'Pending' || obj.bdmAcceptStatus === 'Accept') &&
    //                             obj.bdmAcceptStatus !== "NotForwarded" &&
    //                             obj.Status !== "Not Interested" &&
    //                             obj.Status !== "Busy" &&
    //                             obj.Status !== "Junk" &&
    //                             obj.Status !== "Not Picked Up" &&
    //                             obj.Status !== "Matured"
    //                     )
    //                     .sort((a, b) => new Date(b.bdeForwardDate) - new Date(a.bdeForwardDate))
    //             );
    //         } else if (dataStatus === 'NotInterested') {
    //             setEmployeeData(
    //                 filteredData.filter(
    //                     (obj) =>
    //                         (obj.Status === "Not Interested" ||
    //                             obj.Status === "Junk") &&
    //                         (obj.bdmAcceptStatus === "NotForwarded" || obj.bdmAcceptStatus === "Pending" || obj.bdmAcceptStatus === "Accept")
    //                 )
    //             );
    //         }
    //         if (filteredData.length === 1) {
    //             const currentStatus = filteredData[0].Status; // Access Status directly
    //             if ((filteredData[0].bdmAcceptStatus !== "Pending" && filteredData[0].bdmAcceptStatus !== 'Accept') &&
    //                 (currentStatus === 'Busy' || currentStatus === 'Not Picked Up' || currentStatus === 'Untouched')) {
    //                 setdataStatus('All')
    //             } else if ((filteredData[0].bdmAcceptStatus !== "Pending" && filteredData[0].bdmAcceptStatus !== 'Accept') &&
    //                 currentStatus === 'Interested') {
    //                 setdataStatus('Interested')
    //             } else if ((filteredData[0].bdmAcceptStatus !== "Pending" && filteredData[0].bdmAcceptStatus !== 'Accept') &&
    //                 currentStatus === 'FollowUp') {
    //                 setdataStatus('Interested')
    //             } else if ((filteredData[0].bdmAcceptStatus !== "Pending" && filteredData[0].bdmAcceptStatus !== 'Accept') && currentStatus === 'Matured') {
    //                 setdataStatus('Matured')
    //             } else if (filteredData[0].bdmAcceptStatus !== "NotForwarded" &&
    //                 currentStatus !== "Not Interested" &&
    //                 currentStatus !== "Busy" &&
    //                 currentStatus !== 'Junk' &&
    //                 currentStatus !== 'Not Picked Up' &&
    //                 currentStatus !== 'Matured') {
    //                 setdataStatus('Forwarded')
    //             } else if ((filteredData[0].bdmAcceptStatus !== "Pending" && filteredData[0].bdmAcceptStatus !== 'Accept') && currentStatus === 'Not Interested') {
    //                 setdataStatus('NotInterested')
    //             }
    //         }
    //     } else {
    //         setEmployeeData(filteredData)
    //     }

    // }, [filteredData])


    function formatDate(inputDate) {
        const options = { year: "numeric", month: "long", day: "numeric" };
        const formattedDate = new Date(inputDate).toLocaleDateString(
            "en-US",
            options
        );
        return formattedDate;
    }

    function formatDateNew(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function formatDateNow(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }



    // --------------------------------------forward to bdm function---------------------------------------------\

    const [forwardedCompany, setForwardedCompany] = useState("");
    const [bdmNewAcceptStatus, setBdmNewAcceptStatus] = useState("");
    const [forwardCompanyId, setforwardCompanyId] = useState("");
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


    const [bdeOldStatus, setBdeOldStatus] = useState("");
    const [openBdmNamePopup, setOpenBdmNamePopoup] = useState(false);

    const handleConfirmAssign = (
        companyId,
        companyName,
        companyStatus,
        ename,
        bdmAcceptStatus
    ) => {
        //console.log(companyName, companyStatus, ename, bdmAcceptStatus, companyId);

        if (
            companyStatus === "Interested" ||
            (companyStatus === "FollowUp")
        ) {
            // Assuming `bdmName` is defined somewhere
            setOpenBdmNamePopoup(true);
            setBdeOldStatus(companyStatus);
            setForrwardEname(ename);
            setForrwardStatus(companyStatus);
            setBdmNewAcceptStatus("Pending");
            setforwardCompanyId(companyId);
            setForwardedCompany(companyName);
            //setConfirmationPending(true); // Set confirmation pending
        } else {
            Swal.fire("Your are not assigned to any bdm!");
        }
    };

    const handleReverseAssign = async (
        companyId,
        companyName,
        bdmAcceptStatus,
        empStatus,
        bdmName
    ) => {
        if (bdmAcceptStatus === "Pending") {
            try {
                const response = await axios.post(
                    `${secretKey}/bdm-data/teamleads-reversedata/${companyId}`,
                    {
                        companyName,
                        bdmAcceptStatus: "NotForwarded",
                        bdmName: "NoOne" // Corrected parameter name
                    }
                );
                const response2 = await axios.post(`${secretKey}/projection/post-updaterejectedfollowup/${companyName}`, {
                    caseType: "NotForwarded"
                })
                // console.log("response", response.data);
                Swal.fire("Data Reversed");
                //fetchNewData(empStatus);
            } catch (error) {
                console.log("error reversing bdm forwarded data", error.message);
            }
        } else if (bdmAcceptStatus === "NotForwarded") {
            Swal.fire("Cannot Reforward Data");
        } else if (bdmAcceptStatus === "Accept") {
            Swal.fire("BDM already accepted this data!");
        }
    };

    const handleDoneInform = async () => {
        try {
            const id = BDMrequests._id;
            // Send a DELETE request to your backend API to delete the object
            const response = await axios.delete(
                `${secretKey}/requests/delete-inform-Request/${id}`
            );

            setOpenbdmRequest(false);
            //fetchBDMbookingRequests()
            //console.log(response.data); // Log the response data if needed
            // Optionally, you can update the UI or perform any other actions after the request is successful
        } catch (error) {
            Swal.fire("Error!", "Error Rejecting the Request", "error");
            setOpenbdmRequest(false);
            console.error("Error rejecting request:", error);
            // Handle the error or display a message to the user
        }
    };

    //----------- function to revert back company accepted by bdm ----------------------------
    const handleRevertAcceptedCompany = async (companyId, companyName, bdeStatus) => {
        // Show confirmation dialog
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You wan't to revert back this company!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, revert it!'
        });

        // If confirmed, proceed with the request
        if (result.isConfirmed) {
            try {
                const response = await axios.post(`${secretKey}/company-data/post-bderevertbackacceptedcompanyrequest`, null, {
                    params: {
                        companyId,
                        companyName
                    }
                });
                Swal.fire(
                    'Reverted!',
                    'The company request has been reverted back.',
                    'success'
                );

                //fetchNewData(bdeStatus);
            } catch (error) {
                console.log("Error reverting back company", error);
                Swal.fire(
                    'Error!',
                    'There was an error reverting back the company request.',
                    'error'
                );
            }
        }
    };

    const handleDoneRejectedRequest = async (companyId, status) => {
        try {
            const reponse = await axios.post(`${secretKey}/bdm-data/rejectedrequestdonebybdm`, null, {
                params: {
                    companyId
                }
            })
            //fetchNewData(status)
        } catch (error) {
            console.log("Error done ok", error)
        }

    }

    //----------------filter for employee section-----------------------------

    // const functionCloseFilterDrawer = () => {
    //     setOpenFilterDrawer(false)
    // }

    // const currentYear = new Date().getFullYear();
    // const months = [
    //     "January", "February", "March", "April", "May", "June",
    //     "July", "August", "September", "October", "November", "December"
    // ];
    // //Create an array of years from 2018 to the current year
    // const years = Array.from({ length: currentYear - 1990 }, (_, index) => currentYear - index);

    // useEffect(() => {
    //     let monthIndex;
    //     if (selectedYear && selectedMonth) {
    //         monthIndex = months.indexOf(selectedMonth);
    //         setMonthIndex(monthIndex + 1)
    //         const days = new Date(selectedYear, monthIndex + 1, 0).getDate();
    //         setDaysInMonth(Array.from({ length: days }, (_, i) => i + 1));
    //     } else {
    //         setDaysInMonth([]);
    //     }
    // }, [selectedYear, selectedMonth]);

    // useEffect(() => {
    //     if (selectedYear && selectedMonth && selectedDate) {
    //         const monthIndex = months.indexOf(selectedMonth) + 1;
    //         const formattedMonth = monthIndex < 10 ? `0${monthIndex}` : monthIndex;
    //         const formattedDate = selectedDate < 10 ? `0${selectedDate}` : selectedDate;
    //         const companyIncoDate = `${selectedYear}-${formattedMonth}-${formattedDate}`;
    //         setSelectedCompanyIncoDate(companyIncoDate);
    //     }
    // }, [selectedYear, selectedMonth, selectedDate]);

    // const handleFilterData = async (page = 1, limit = itemsPerPage) => {
    //     try {
    //         setIsFilter(true);
    //         setOpenBacdrop(true);

    //         const response = await axios.get(`${secretKey}/company-data/filter-employee-leads`, {
    //             params: {
    //                 employeeName,
    //                 selectedStatus,
    //                 selectedState,
    //                 selectedNewCity,
    //                 selectedYear,
    //                 monthIndex,
    //                 selectedAssignDate,
    //                 selectedCompanyIncoDate,
    //                 page,
    //                 limit
    //             }
    //         });

    //         if (
    //             !selectedStatus &&
    //             !selectedState &&
    //             !selectedNewCity &&
    //             !selectedYear &&
    //             !selectedCompanyIncoDate &&
    //             !selectedAssignDate
    //         ) {
    //             // If no filters are applied, reset the filter state and stop the backdrop
    //             setIsFilter(false);
    //         } else {
    //             // Update the employee data with the filtered results
    //             // console.log("response.data", response.data)
    //             setFilteredData(response.data)
    //         }
    //     } catch (error) {
    //         console.log('Error applying filter', error.message);
    //     } finally {
    //         setOpenBacdrop(false);
    //         setOpenFilterDrawer(false);
    //     }
    // };
    // // console.log("filteredData", filteredData)

    // const handleClearFilter = () => {
    //     setIsFilter(false)
    //     setSelectedStatus('')
    //     setSelectedState('')
    //     setSelectedNewCity('')
    //     setSelectedYear('')
    //     setSelectedMonth('')
    //     setSelectedDate(0)
    //     setSelectedAssignDate(null)
    //     setCompanyIncoDate(null)
    //     setSelectedCompanyIncoDate(null)
    //     setFilteredData([])
    //     //fetchNewData()
    //     //fetchData(1, latestSortCount)
    // }
    // // Function to get current date in YYYY-MM-DD format
    // function getCurrentDate() {
    //     const now = new Date();
    //     const year = now.getFullYear();
    //     const month = (now.getMonth() + 1).toString().padStart(2, "0");
    //     const day = now.getDate().toString().padStart(2, "0");
    //     return `${year}-${month}-${day}`;
    // }

    // // Auto logout functionality :
    // useEffect(() => {
    //     // Function to check token expiry and initiate logout if expired
    //     const checkTokenExpiry = () => {
    //         const token = localStorage.getItem("newtoken");
    //         if (token) {
    //             try {
    //                 const decoded = jwtDecode(token);
    //                 const currentTime = Date.now() / 1000; // Get current time in seconds
    //                 if (decoded.exp < currentTime) {
    //                     // console.log("Decode Expirary :", decoded.exp);
    //                     // Token expired, perform logout actions
    //                     // console.log("Logout called");
    //                     handleLogout();
    //                 } else {
    //                     // Token not expired, continue session
    //                     const timeToExpire = decoded.exp - currentTime;

    //                 }
    //             } catch (error) {
    //                 console.error("Error decoding token:", error);
    //                 // console.log("Logout called");
    //                 handleLogout(); // Handle invalid token or decoding errors
    //             }
    //         }
    //     };

    //     // Initial check on component mount
    //     checkTokenExpiry();

    //     // Periodically check token expiry (e.g., every minute)
    //     const interval = setInterval(checkTokenExpiry, 60000); // 60 seconds

    //     return () => clearInterval(interval); // Cleanup interval on unmount
    // }, []);

    // const handleLogout = () => {
    //     // Clear local storage and redirect to login page
    //     localStorage.removeItem("newtoken");
    //     localStorage.removeItem("userId");
    //     // localStorage.removeItem("designation");
    //     // localStorage.removeItem("loginTime");
    //     // localStorage.removeItem("loginDate");
    //     window.location.replace("/"); // Redirect to login page
    // };


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
            queryKey: ['newData', cleanString(data.ename), dataStatus, currentPage],
            queryFn: async () => {
                const skip = currentPage * itemsPerPage; // Calculate skip based on current page
                const response = await axios.get(`${secretKey}/company-data/employees-new/${cleanString(data.ename)}`, {
                    params: {
                        dataStatus: dataStatus,
                        limit: itemsPerPage,
                        skip: skip
                    } // Send dataStatus as a query parameter
                });
                return response.data; // Directly return the data
            },
            enabled: !!data.ename, // Only fetch if data.ename is available
            staleTime: 60000, // Cache for 5 minutes
            cacheTime: 60000, // Cache for 5 minutes
        }
    );

    useEffect(() => {
        if (queryData) {
            // Assuming queryData now contains both data and revertedData
            setFetchedData(queryData.data); // Update the fetched data
            setRevertedData(queryData.revertedData); // Set revertedData based on response
            setmoreEmpData(queryData.data);
            setEmployeeData(queryData.data);
            setTotalCounts(queryData.totalCounts);
            setTotalPages(Math.ceil(queryData.totalPages)); // Calculate total pages
        }
    }, [queryData, dataStatus, currentPage]);

    // Create a debounced version of refetch
    const debouncedRefetch = useCallback(debounce(() => {
        refetch();
    }, 300), [refetch]);

    const handleDataStatusChange = useCallback((status) => {
        setdataStatus(status);
        setCurrentPage(0); // Reset to the first page
        debouncedRefetch(); // Call the debounced refetch function
    }, [debouncedRefetch]);

    console.log("fetcgeheddata", fetchedData)
    console.log("dataStatus", dataStatus)

    return (
        <div>



            {!showCallHistory ? <div className="page-wrapper">
                {/* {BDMrequests && (
                            <Dialog open={openbdmRequest}>
                                <DialogContent>
                                    <div className="request-bdm-card">
                                        <div className="request-title m-2 d-flex justify-content-between">
                                            <div className="request-content mr-2">
                                                {BDMrequests.bdmName} has Matured the case of{" "}
                                                <b>{BDMrequests["Company Name"]}</b>.
                                            </div>
                                            <div className="request-time">
                                                {new Date(BDMrequests.date).toLocaleTimeString(
                                                    "en-US",
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: false,
                                                    }
                                                )}
                                            </div>
                                        </div>
                                        <div className="request-reply">
                                            <button
                                                onClick={handleDoneInform}
                                                className="request-accept"
                                            >
                                                Ok
                                            </button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                        {revertedData.length !== 0 && revertedData.map((item) => (
                            <Dialog key={item._id} open={openRevertBackRequestDialog}>
                                <DialogContent sx={{ width: "lg" }}>
                                    <div className="request-bdm-card">
                                        <div className="request-title m-2 d-flex justify-content-between">
                                            <div className="request-content mr-2">
                                                {item.ename} has rejected the request of reverted company.
                                                <b>{item["Company Name"]}</b>.
                                            </div>
                                        </div>
                                        <div className="request-reply d-flex">
                                            <button
                                                onClick={() => {
                                                    setOpenRevertBackRequestDialog(false)
                                                    handleDoneRejectedRequest(
                                                        item._id,
                                                        item.Status
                                                    )
                                                }
                                                }

                                                className="request-accept"
                                            >
                                                ok
                                            </button>

                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        ))} */}

                <div className="page-wrapper">
                    <div className="page-header rm_Filter m-0">
                        <div className="container-xl">
                            {/* <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <div className="btn-group mr-2">
                                                <EmployeeAddLeadDialog
                                                    secretKey={secretKey}
                                                    fetchData={fetchData}
                                                    ename={data.ename}
                                                    //fetchNewData={//fetchNewData}
                                                />
                                            </div>
                                            <div className="btn-group" role="group" aria-label="Basic example">
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
                                    </div> */}
                        </div>
                    </div>
                    <div className="page-body  m-0">
                        <div className="container-xl mt-2">
                            <div className="my-tab card-header">
                                <ul className="nav nav-tabs hr_emply_list_navtabs nav-fill p-0" data-bs-toggle="tabs">
                                    <li class="nav-item hr_emply_list_navitem">
                                        <a class="nav-link active" data-bs-toggle="tab" href="#k"
                                            onClick={() => handleDataStatusChange("All")}
                                        >
                                            <div className="d-flex align-items-center justify-content-between w-100">
                                                <div className="rm_txt_tsn">
                                                    General
                                                </div>
                                                <div className="rm_tsn_bdge">
                                                    {totalCounts.untouched}
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li class="nav-item hr_emply_list_navitem">
                                        <a class="nav-link" data-bs-toggle="tab" href="#Interested"
                                            onClick={() => handleDataStatusChange("Interested")}
                                        >
                                            <div className="d-flex align-items-center justify-content-between w-100">
                                                <div className="rm_txt_tsn">
                                                    Interested
                                                </div>
                                                <div className="rm_tsn_bdge">
                                                    {totalCounts.interested}
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li class="nav-item hr_emply_list_navitem">
                                        <a class="nav-link" data-bs-toggle="tab" href="#Matured"
                                            onClick={() => handleDataStatusChange("Matured")}>
                                            <div className="d-flex align-items-center justify-content-between w-100">
                                                <div className="rm_txt_tsn">
                                                    Matured
                                                </div>
                                                <div className="rm_tsn_bdge">
                                                    {totalCounts.matured}
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li class="nav-item hr_emply_list_navitem">
                                        <a class="nav-link" data-bs-toggle="tab" href="#BDM_Forwarded">
                                            <div className="d-flex align-items-center justify-content-between w-100">
                                                <div className="rm_txt_tsn">
                                                    BDM Forwarded
                                                </div>
                                                <div className="rm_tsn_bdge">
                                                    {totalCounts.forwarded}
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li class="nav-item hr_emply_list_navitem">
                                        <a class="nav-link" data-bs-toggle="tab" href="#Not_Interested">
                                            <div className="d-flex align-items-center justify-content-between w-100">
                                                <div className="rm_txt_tsn">
                                                    Not Interested
                                                </div>
                                                <div className="rm_tsn_bdge">
                                                    {totalCounts.notInterested}
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="tab-content card-body">
                                <div class="tab-pane active" id="k">
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
                                    />
                                </div>
                                <div class="tab-pane" id="Interested">
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
                                    />
                                </div>
                                <div class="tab-pane" id="Matured">
                                    <EmployeeMaturedLeads
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
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> : <CallHistory handleCloseHistory={hanleCloseCallHistory} clientNumber={clientNumber} />

            }
            <div>
                {/* //----------------leads filter drawer-------------------------------
                <Drawer
                    style={{ top: "50px" }}
                    anchor="left"
                    open={openFilterDrawer}
                    onClose={functionCloseFilterDrawer}>
                    <div style={{ width: "31em" }}>
                        <div className="d-flex justify-content-between align-items-center container-xl pt-2 pb-2">
                            <h2 className="title m-0">
                                Filters
                            </h2>
                            <div>
                                <button style={{ background: "none", border: "0px transparent" }} onClick={() => functionCloseFilterDrawer()}>
                                    <IoIosClose style={{
                                        height: "36px",
                                        width: "32px",
                                        color: "grey"
                                    }} />
                                </button>
                            </div>
                        </div>
                        <hr style={{ margin: "0px" }} />
                        <div className="body-Drawer">
                            <div className='container-xl mt-2 mb-2'>
                                <div className='row'>
                                    <div className='col-sm-12 mt-3'>
                                        <div className='form-group'>
                                            <label for="exampleFormControlInput1" class="form-label">Status</label>
                                            <select class="form-select form-select-md" aria-label="Default select example"
                                                value={selectedStatus}
                                                onChange={(e) => {
                                                    setSelectedStatus(e.target.value)
                                                }}
                                            >
                                                <option selected value='Select Status'>Select Status</option>
                                                <option value='Not Picked Up'>Not Picked Up</option>
                                                <option value="Busy">Busy</option>
                                                <option value="Junk">Junk</option>
                                                <option value="Not Interested">Not Interested</option>
                                                <option value="Untouched">Untouched</option>
                                                <option value="Interested">Interested</option>
                                                <option value="Matured">Matured</option>
                                                <option value="FollowUp">Followup</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className='col-sm-12 mt-2'>
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <div className='form-group w-50 mr-1'>
                                                <label for="exampleFormControlInput1" class="form-label">State</label>
                                                <select class="form-select form-select-md" aria-label="Default select example"
                                                    value={selectedState}
                                                    onChange={(e) => {
                                                        setSelectedState(e.target.value)
                                                        setSelectedStateCode(stateList.filter(obj => obj.name === e.target.value)[0]?.isoCode);
                                                        setSelectedCity(City.getCitiesOfState("IN", stateList.filter(obj => obj.name === e.target.value)[0]?.isoCode))
                                                        //handleSelectState(e.target.value)
                                                    }}
                                                >
                                                    <option value=''>State</option>
                                                    {stateList.length !== 0 && stateList.map((item) => (
                                                        <option value={item.name}>{item.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className='form-group w-50'>
                                                <label for="exampleFormControlInput1" class="form-label">City</label>
                                                <select class="form-select form-select-md" aria-label="Default select example"
                                                    value={selectedNewCity}
                                                    onChange={(e) => {
                                                        setSelectedNewCity(e.target.value)
                                                    }}
                                                >
                                                    <option value="">City</option>
                                                    {selectedCity.lenth !== 0 && selectedCity.map((item) => (
                                                        <option value={item.name}>{item.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-sm-12 mt-2'>
                                        <div className='form-group'>
                                            <label for="assignon" class="form-label">Assign On</label>
                                            <input type="date" class="form-control" id="assignon"
                                                value={selectedAssignDate}
                                                placeholder="dd-mm-yyyy"
                                                defaultValue={null}
                                                onChange={(e) => setSelectedAssignDate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className='col-sm-12 mt-2'>
                                        <label class="form-label">Incorporation Date</label>
                                        <div className='row align-items-center justify-content-between'>
                                            <div className='col form-group mr-1'>
                                                <select class="form-select form-select-md" aria-label="Default select example"
                                                    value={selectedYear}
                                                    onChange={(e) => {
                                                        setSelectedYear(e.target.value)
                                                    }}
                                                >
                                                    <option value=''>Year</option>
                                                    {years.length !== 0 && years.map((item) => (
                                                        <option>{item}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className='col form-group mr-1'>
                                                <select class="form-select form-select-md" aria-label="Default select example"
                                                    value={selectedMonth}
                                                    disabled={selectedYear === ""}
                                                    onChange={(e) => {
                                                        setSelectedMonth(e.target.value)
                                                    }}
                                                >
                                                    <option value=''>Month</option>
                                                    {months && months.map((item) => (
                                                        <option value={item}>{item}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className='col form-group mr-1'>
                                                <select class="form-select form-select-md" aria-label="Default select example"
                                                    disabled={selectedMonth === ''}
                                                    value={selectedDate}
                                                    onChange={(e) => setSelectedDate(e.target.value)}
                                                >
                                                    <option value=''>Date</option>
                                                    {daysInMonth.map((day) => (
                                                        <option key={day} value={day}>{day}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="footer-Drawer d-flex justify-content-between align-items-center">
                            <button className='filter-footer-btn btn-clear'
                                onClick={handleClearFilter}
                            >Clear Filter</button>
                            <button className='filter-footer-btn btn-yellow'
                                onClick={handleFilterData}
                            >Apply Filter</button>
                        </div>
                    </div>
                </Drawer> */}
            </div>
        </div>
    );
}

export default EmployeePanelCopy;




