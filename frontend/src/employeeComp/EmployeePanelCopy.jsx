import React, { useEffect, useState } from "react";
import EmpNav from "./EmpNav.js";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import notificationSound from "../assets/media/iphone_sound.mp3";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import axios from "axios";
import { IconChevronLeft, IconEye } from "@tabler/icons-react";
import { IconChevronRight } from "@tabler/icons-react";
import { Drawer } from "@mui/material";
import { IoIosClose } from "react-icons/io";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import Swal from "sweetalert2";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import Form from "../components/Form.jsx";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import "../assets/table.css";
import "../assets/styles.css";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import Nodata from "../components/Nodata.jsx";
import EditForm from "../components/EditForm.jsx";
import { useCallback } from "react";
import debounce from "lodash/debounce";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { options } from "../components/Options.js";
import FilterListIcon from "@mui/icons-material/FilterList";
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
import Edit from "@mui/icons-material/Edit";
import EditableLeadform from "../admin/EditableLeadform.jsx";
import AddLeadForm from "../admin/AddLeadForm.jsx";
import { FaWhatsapp } from "react-icons/fa";
import EditableMoreBooking from "../admin/EditableMoreBooking.jsx";
import { RiShareForwardBoxFill } from "react-icons/ri";
import { RiShareForward2Fill } from "react-icons/ri";
import { TiArrowBack } from "react-icons/ti";
import { TiArrowForward } from "react-icons/ti";
import { MdNotInterested } from "react-icons/md";
import { RiInformationLine } from "react-icons/ri";
import PropTypes from "prop-types";
import Slider, { SliderThumb } from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { IoFilterOutline } from "react-icons/io5";
import { Country, State, City } from 'country-state-city';
import { jwtDecode } from "jwt-decode";
import { MdPayment } from "react-icons/md";
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

    const [emailData, setEmailData] = useState({ to: "", subject: "", body: "" });
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
    const [extraData, setExtraData] = useState([])

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

    async function handleGoogleLogin() {
        const response = await fetch("http://localhost:6050/request", {
            method: "post",
        });

        const data = await response.json();
        //console.log(data);
        navigate(data.url);
    }


    useEffect(() => {
        document.title = `Employee-Sahay-CRM`;
    }, [data.ename]);

    const playNotificationSound = () => {
        const audio = new Audio(notificationSound);
        audio.play();
    };

    //console.log(nextFollowUpdate)

    function convertDateFormat(dateString) {
        // Check if dateString is undefined or null
        if (!dateString) {
            return "Invalid date";
        }

        // Split the date string by "/"
        var parts = dateString.split('/');

        // Check if parts has exactly 3 elements
        if (parts.length !== 3) {
            return "Invalid date format";
        }

        // Rearrange the parts to the desired format "YYYY-MM-DD"
        var formattedDate = parts[2] + '-' + parts[1] + '-' + parts[0];

        return formattedDate;
    }


    useEffect(() => {
        const socket = secretKey === "http://localhost:3001/api" ? io("http://localhost:3001") : io("wss://startupsahay.in", {
            secure: true, // Use HTTPS
            path: '/socket.io',
            reconnection: true,
            transports: ['websocket'],
        });
        socket.on("connect", () => {
            //console.log("Socket connected with ID:", socket.id);
            console.log('Connection Successful to socket io')
            setSocketID(socket.id);
        });

        socket.on("request-seen", () => {
            // Call fetchRequestDetails function to update request details
            fetchRequestDetails();
        });

        socket.on("data-sent", () => {
            fetchRequestDetails();
        });

        // Clean up the socket connection when the component unmounts
        return () => {
            socket.disconnect();
        };
    }, []);

    const fetchEditRequests = async () => {
        try {
            const response = await axios.get(`${secretKey}/bookings/editable-LeadData`);
            setTotalBookings(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    const fetchBDMbookingRequests = async () => {
        const bdeName = data.ename;
        try {
            const response = await axios.get(
                `${secretKey}/bdm-data/inform-bde-requests/${bdeName}`
            );
            setBDMrequests(response.data[0]);
            if (response.data.length !== 0) {
                setOpenbdmRequest(true);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const functionopenAnchor = () => {
        setTimeout(() => {
            setOpenAnchor(true);
        }, 1000);
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

    useEffect(() => {
        fetchBDMbookingRequests();
        fetchRedesignedFormDataAll()
    }, [data.ename]);
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

    const fetchNewData = async (status) => {
        const cleanString = (str) => {
            return str.replace(/\u00A0/g, ' ').trim();
        };

        const cleanedEname = cleanString(data.ename);
        console.log("fetchhuayahan")
        try {
            if (!status) {
                setLoading(true);
            }
            const response = await axios.get(`${secretKey}/company-data/employees/${cleanedEname}`);
            const tempData = response.data;
            const revertedData = response.data.filter((item) => item.RevertBackAcceptedCompanyRequest === 'Reject')
            setRevertedData(revertedData)
            const sortedData = response.data.sort((a, b) => {
                // Assuming AssignDate is a string representation of a date
                return new Date(b.AssignDate) - new Date(a.AssignDate);
            });
            setExtraData(sortedData)
            setmoreEmpData(sortedData);
            setTempData(tempData);
            setEmployeeData(
                tempData.filter(
                    (obj) =>
                        (obj.Status === "Busy" ||
                            obj.Status === "Not Picked Up" ||
                            obj.Status === "Untouched") &&
                        (obj.bdmAcceptStatus !== "Forwarded" &&
                            obj.bdmAcceptStatus !== "Accept" &&
                            obj.bdmAcceptStatus !== "Pending")));
            setdataStatus("All");
            if (sortStatus === "Untouched") {
                setEmployeeData(
                    sortedData
                        .filter((data) =>
                            ["Busy", "Untouched", "Not Picked Up"].includes(data.Status)
                        )
                        .sort((a, b) => {
                            if (a.Status === "Untouched") return -1;
                            if (b.Status === "Untouched") return 1;
                            return 0;
                        })
                );
            }
            if (sortStatus === "Busy") {
                setEmployeeData(
                    sortedData
                        .filter((data) =>
                            ["Busy", "Untouched", "Not Picked Up"].includes(data.Status)

                        )
                        .sort((a, b) => {
                            if (a.Status === "Busy") return -1;
                            if (b.Status === "Busy") return 1;
                            return 0;
                        })
                );
            }
            if (!status && sortStatus !== "") {
            }
            if (status === "Not Interested" || status === "Junk") {
                setEmployeeData(
                    tempData.filter(
                        (obj) => obj.Status === "Not Interested" || obj.Status === "Junk"
                    )
                );
                setdataStatus("NotInterested");
            }
            if (status === "FollowUp") {
                setEmployeeData(tempData.filter((obj) => obj.Status === "FollowUp" && obj.bdmAcceptStatus === "NotForwarded"));
                setdataStatus("FollowUp");
            }
            if (status === "Interested") {
                setEmployeeData(tempData.filter((obj) => (obj.Status === "Interested" || obj.Status === "FollowUp") && obj.bdmAcceptStatus === "NotForwarded"));
                setdataStatus("Interested");
            }
            if (status === "Forwarded") {
                //console.log("yahan chala")
                setEmployeeData(
                    moreEmpData
                        .filter((obj) => obj.bdmAcceptStatus !== "NotForwarded" && (obj.Status === "Interested" || obj.Status === "FollowUp"))
                );
                setdataStatus("Forwarded");
            }
            // setEmployeeData(tempData.filter(obj => obj.Status === "Busy" || obj.Status === "Not Picked Up" || obj.Status === "Untouched"))
        } catch (error) {
            console.error("Error fetching new data:", error);
        } finally {
            if (!status) {
                setLoading(false);
            }
            // Set loading to false regardless of success or error
        }
    };

    useEffect(() => {
        if (data.ename) {
            fetchNewData();
            setdataStatus("Matured");
            setEmployeeData(
                moreEmpData
                    .filter((obj) => obj.Status === "Matured")
                    .sort((a, b) => new Date(b.lastActionDate) - new Date(a.lastActionDate))
            );
        }


    }, [nowToFetch]);


    useEffect(() => {

        if (revertedData.length !== 0) {
            setOpenRevertBackRequestDialog(true)
        } else if (data.ename) {

            fetchNewData()
        }
    }, [data.ename, revertedData.length]);

    const fetchRequestDetails = async () => {
        try {
            const response = await axios.get(`${secretKey}/requests/requestgData`);
            const sortedData = response.data.sort((a, b) => {
                // Assuming 'timestamp' is the field indicating the time of creation or update
                return new Date(b.date) - new Date(a.date);
            });

            // Find the latest data object with Assignread property as false
            const latestData = sortedData.find((data) => data.AssignRead === false);

            // Set the latest data as an object
            setRequestData(latestData);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };
    useEffect(() => {
        fetchData();
    }, [userId]);

    useEffect(() => {
        fetchProjections();
    }, [data]);

    useEffect(() => {
        fetchRemarksHistory();
        fetchBookingDeleteRequests();
        fetchRequestDetails();
        fetchEditRequests();

        if (userId !== localStorage.getItem("userId")) {
            localStorage.removeItem("newtoken");
            window.location.replace("/");
        }

    }, []);


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

    useEffect(() => {
        if (filteredData.length !== 0) {
            //setEmployeeData(filteredData)
            if (dataStatus === 'All') {
                setEmployeeData(
                    filteredData.filter(
                        (obj) =>
                            obj.Status === "Busy" ||
                            obj.Status === "Not Picked Up" ||
                            obj.Status === "Untouched"
                    )
                );
            } else if (dataStatus === 'Interested') {
                setEmployeeData(
                    filteredData.filter(
                        (obj) =>
                            (obj.Status === "Interested" || obj.Status === "FollowUp") &&
                            obj.bdmAcceptStatus === "NotForwarded" &&
                            obj.bdmAcceptStatus !== "Pending" &&
                            obj.bdmAcceptStatus !== "Accept"
                    )
                );
            } else if (dataStatus === 'Matured') {
                setEmployeeData(
                    filteredData
                        .filter(
                            (obj) =>
                                obj.Status === "Matured" &&
                                (obj.bdmAcceptStatus === "NotForwarded" || obj.bdmAcceptStatus === "Pending" || obj.bdmAcceptStatus === "Accept")
                        )
                );
            } else if (dataStatus === 'Forwarded') {
                setEmployeeData(
                    filteredData
                        .filter(
                            (obj) =>
                                (obj.bdmAcceptStatus === 'Pending' || obj.bdmAcceptStatus === 'Accept') &&
                                obj.bdmAcceptStatus !== "NotForwarded" &&
                                obj.Status !== "Not Interested" &&
                                obj.Status !== "Busy" &&
                                obj.Status !== "Junk" &&
                                obj.Status !== "Not Picked Up" &&
                                obj.Status !== "Matured"
                        )
                        .sort((a, b) => new Date(b.bdeForwardDate) - new Date(a.bdeForwardDate))
                );
            } else if (dataStatus === 'NotInterested') {
                setEmployeeData(
                    filteredData.filter(
                        (obj) =>
                            (obj.Status === "Not Interested" ||
                                obj.Status === "Junk") &&
                            (obj.bdmAcceptStatus === "NotForwarded" || obj.bdmAcceptStatus === "Pending" || obj.bdmAcceptStatus === "Accept")
                    )
                );
            }
            if (filteredData.length === 1) {
                const currentStatus = filteredData[0].Status; // Access Status directly
                if ((filteredData[0].bdmAcceptStatus !== "Pending" && filteredData[0].bdmAcceptStatus !== 'Accept') &&
                    (currentStatus === 'Busy' || currentStatus === 'Not Picked Up' || currentStatus === 'Untouched')) {
                    setdataStatus('All')
                } else if ((filteredData[0].bdmAcceptStatus !== "Pending" && filteredData[0].bdmAcceptStatus !== 'Accept') &&
                    currentStatus === 'Interested') {
                    setdataStatus('Interested')
                } else if ((filteredData[0].bdmAcceptStatus !== "Pending" && filteredData[0].bdmAcceptStatus !== 'Accept') &&
                    currentStatus === 'FollowUp') {
                    setdataStatus('Interested')
                } else if ((filteredData[0].bdmAcceptStatus !== "Pending" && filteredData[0].bdmAcceptStatus !== 'Accept') && currentStatus === 'Matured') {
                    setdataStatus('Matured')
                } else if (filteredData[0].bdmAcceptStatus !== "NotForwarded" &&
                    currentStatus !== "Not Interested" &&
                    currentStatus !== "Busy" &&
                    currentStatus !== 'Junk' &&
                    currentStatus !== 'Not Picked Up' &&
                    currentStatus !== 'Matured') {
                    setdataStatus('Forwarded')
                } else if ((filteredData[0].bdmAcceptStatus !== "Pending" && filteredData[0].bdmAcceptStatus !== 'Accept') && currentStatus === 'Not Interested') {
                    setdataStatus('NotInterested')
                }
            }
        } else {
            setEmployeeData(filteredData)
        }

    }, [filteredData])
    const handleStatusChange = async (
        company,
        employeeId,
        newStatus,
        cname,
        cemail,
        cindate,
        cnum,
        oldStatus,
        bdmAcceptStatus,
        isDeletedEmployeeCompany,
        ename
    ) => {
        if (newStatus === "Matured") {
            // Assuming these are setter functions to update state or perform some action
            setCompanyName(cname);
            setCompanyEmail(cemail);
            setCompanyInco(cindate);
            setCompanyId(employeeId);
            setCompanyNumber(cnum);
            setDeletedEmployeeStatus(isDeletedEmployeeCompany)
            setNewBdeName(ename)
            console.log("is", isDeletedEmployeeCompany)
            console.log("company", company)
            // let isDeletedEmployeeCompany = true
            if (!isDeletedEmployeeCompany) {
                console.log("formchal")
                setFormOpen(true);
            } else {
                console.log("addleadfromchal")
                setAddFormOpen(true)
            }
            return true;
        }

        // Assuming `data` is defined somewhere in your code
        const title = `${data.ename} changed ${cname} status from ${oldStatus} to ${newStatus}`;
        const DT = new Date();
        const date = DT.toLocaleDateString();
        const time = DT.toLocaleTimeString();

        //console.log(bdmAcceptStatus, "bdmAcceptStatus");
        try {
            let response;
            if (bdmAcceptStatus === "Accept") {
                if (newStatus === "Interested" || newStatus === "FollowUp") {
                    response = await axios.delete(`${secretKey}/bdm-data/post-deletecompany-interested/${employeeId}`);
                    const response2 = await axios.post(
                        `${secretKey}/company-data/update-status/${employeeId}`,
                        {
                            newStatus,
                            title,
                            date,
                            time,

                        })
                    const response3 = await axios.post(`${secretKey}/bdm-data/post-bdmAcceptStatusupate/${employeeId}`, {
                        bdmAcceptStatus: "NotForwarded"
                    })

                    const response4 = await axios.post(`${secretKey}/projection/post-updaterejectedfollowup/${cname}`, {
                        caseType: "NotForwarded"
                    }
                    )

                } else if (newStatus === "Busy" || newStatus === "Junk" || newStatus === "Not Picked Up") {
                    response = await axios.post(`${secretKey}/bdm-data/post-update-bdmstatusfrombde/${employeeId}`, {
                        newStatus
                    });

                    //console.log(response.data)

                    const response2 = await axios.post(
                        `${secretKey}/company-data/update-status/${employeeId}`,
                        {
                            newStatus,
                            title,
                            date,
                            time,
                            oldStatus,
                        }
                    );

                }
            }

            // If response is not already defined, make the default API call
            if (!response) {
                response = await axios.post(
                    `${secretKey}/company-data/update-status/${employeeId}`,
                    {
                        newStatus,
                        title,
                        date,
                        time,
                        oldStatus,
                    }
                );
            }

            // Check if the API call was successful
            if (response.status === 200) {
                // Assuming `fetchNewData` is a function to fetch updated employee data
                fetchNewData(oldStatus);
            } else {
                // Handle the case where the API call was not successful
                console.error("Failed to update status:", response.data.message);
            }
        } catch (error) {
            // Handle any errors that occur during the API call
            console.error("Error updating status:", error.message);
        }
    };


    const fetchBookingDeleteRequests = async () => {
        try {
            const response = await axios.get(`${secretKey}/requests/deleterequestbybde`);
            setRequestDeletes(response.data); // Assuming your data is returned as an array
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

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

    const fetchRedesignedFormDataAll = async () => {
        try {
            //console.log(maturedID);
            const response = await axios.get(
                `${secretKey}/bookings/redesigned-final-leadData`
            );
            //const data = response.data.find((obj) => obj.company === maturedID);
            //console.log(data);
            setCurrentForm(data);
            setRedesignedData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };

    const formatDateAndTime = (AssignDate) => {
        // Convert AssignDate to a Date object
        const date = new Date(AssignDate);

        // Convert UTC date to Indian time zone
        const options = { timeZone: "Asia/Kolkata" };
        const indianDate = date.toLocaleString("en-IN", options);
        return indianDate;
    };
    
    const createNewArray = (data) => {
        let dataArray;

        if (dataStatus === "All") {
            // Filter data for all statuses
            dataArray = data.filter(
                (obj) =>
                    obj.Status === "Untouched" ||
                    obj.Status === "Busy" ||
                    obj.Status === "Not Picked Up"
            );
        } else if (dataStatus === "Interested") {
            // Filter data for Interested status
            dataArray = data.filter((obj) => obj.Status === "Interested");
        } else if (dataStatus === "Not Interested") {
            // Filter data for Not Interested status
            dataArray = data.filter((obj) => obj.Status === "Not Interested");
        } else {
            // Handle other cases if needed
            dataArray = data;
        }
        const newArray = [];

        // Iterate over each object in the original array
        dataArray.forEach((obj) => {
            const date = new Date(obj["Company Incorporation Date  "]);
            const year = date.getFullYear();
            const month = date.toLocaleString("default", { month: "short" });

            // Check if year already exists in newArray
            const yearIndex = newArray.findIndex((item) => item.year === year);
            if (yearIndex !== -1) {
                // Year already exists, check if month exists in the corresponding year's month array
                const monthIndex = newArray[yearIndex].month.findIndex(
                    (m) => m === month
                );
                if (monthIndex === -1) {
                    // Month doesn't exist, add it to the month array
                    newArray[yearIndex].month.push(month);
                }
            } else {
                // Year doesn't exist, create a new entry
                newArray.push({ year: year, month: [month] });
            }
        });

        return newArray;
    };

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
                fetchNewData(empStatus);
            } catch (error) {
                console.log("error reversing bdm forwarded data", error.message);
            }
        } else if (bdmAcceptStatus === "NotForwarded") {
            Swal.fire("Cannot Reforward Data");
        } else if (bdmAcceptStatus === "Accept") {
            Swal.fire("BDM already accepted this data!");
        }
    };
    // ------------------------------------- Request BDM functions --------------------------------
    const handleAcceptRequest = async () => {
        try {
            const id = BDMrequests._id;
            // Send a POST request to your backend API to update the object
            const response = await axios.post(
                `${secretKey}/requests/update-bdm-Request/${id}`,
                {
                    requestStatus: "Accepted",
                }
            );
            Swal.fire("Accepted!", "Successfully Accepted the Request", "success");
            setOpenbdmRequest(false);
            //console.log(response.data); // Log the response data if needed
            // Optionally, you can update the UI or perform any other actions after the request is successful
        } catch (error) {
            Swal.fire("Error!", "Error Accepting the Request", "error");
            setOpenbdmRequest(false);
            console.error("Error accepting request:", error);
            // Handle the error or display a message to the user
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
            fetchBDMbookingRequests()
            //console.log(response.data); // Log the response data if needed
            // Optionally, you can update the UI or perform any other actions after the request is successful
        } catch (error) {
            Swal.fire("Error!", "Error Rejecting the Request", "error");
            setOpenbdmRequest(false);
            console.error("Error rejecting request:", error);
            // Handle the error or display a message to the user
        }
    };

    // ------------------------------- Next Follow Up Date -------------------------------------------------------------------

    const functionSubmitNextFollowUpDate = async (nextFollowUpdate, companyId, companyStatus) => {

        const data = {
            bdeNextFollowUpDate: nextFollowUpdate
        }
        try {
            const resposne = await axios.post(`${secretKey}/company-data/post-bdenextfollowupdate/${companyId}`, data)

            //console.log(resposne.data)
            fetchNewData(companyStatus)

        } catch (error) {
            console.log("Error submitting Date", error)
        }

    }

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

                fetchNewData(bdeStatus);
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
            fetchNewData(status)
        } catch (error) {
            console.log("Error done ok", error)
        }

    }


    //console.log(feedbackRemarks, feedbakPo
    const functionCalculateBookingDate = (id) => {
        const bookingObj = redesignedData.find(company => company.company === id);
        return bookingObj ? formatDate(bookingObj.bookingDate) : "N/A"
    }
    const functionCalculatePublishDate = (id) => {
        const bookingObj = redesignedData.find(company => company.company === id);
        return bookingObj ? formatDate(bookingObj.bookingPublishDate) : "N/A"
    }

    //----------------filter for employee section-----------------------------
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

    const functionCloseFilterDrawer = () => {
        setOpenFilterDrawer(false)
    }

    const currentYear = new Date().getFullYear();
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    //Create an array of years from 2018 to the current year
    const years = Array.from({ length: currentYear - 1990 }, (_, index) => currentYear - index);

    useEffect(() => {
        let monthIndex;
        if (selectedYear && selectedMonth) {
            monthIndex = months.indexOf(selectedMonth);
            setMonthIndex(monthIndex + 1)
            const days = new Date(selectedYear, monthIndex + 1, 0).getDate();
            setDaysInMonth(Array.from({ length: days }, (_, i) => i + 1));
        } else {
            setDaysInMonth([]);
        }
    }, [selectedYear, selectedMonth]);

    useEffect(() => {
        if (selectedYear && selectedMonth && selectedDate) {
            const monthIndex = months.indexOf(selectedMonth) + 1;
            const formattedMonth = monthIndex < 10 ? `0${monthIndex}` : monthIndex;
            const formattedDate = selectedDate < 10 ? `0${selectedDate}` : selectedDate;
            const companyIncoDate = `${selectedYear}-${formattedMonth}-${formattedDate}`;
            setSelectedCompanyIncoDate(companyIncoDate);
        }
    }, [selectedYear, selectedMonth, selectedDate]);

    const handleFilterData = async (page = 1, limit = itemsPerPage) => {
        try {
            setIsFilter(true);
            setOpenBacdrop(true);

            const response = await axios.get(`${secretKey}/company-data/filter-employee-leads`, {
                params: {
                    employeeName,
                    selectedStatus,
                    selectedState,
                    selectedNewCity,
                    selectedYear,
                    monthIndex,
                    selectedAssignDate,
                    selectedCompanyIncoDate,
                    page,
                    limit
                }
            });

            if (
                !selectedStatus &&
                !selectedState &&
                !selectedNewCity &&
                !selectedYear &&
                !selectedCompanyIncoDate &&
                !selectedAssignDate
            ) {
                // If no filters are applied, reset the filter state and stop the backdrop
                setIsFilter(false);
            } else {
                // Update the employee data with the filtered results
                // console.log("response.data", response.data)
                setFilteredData(response.data)
            }
        } catch (error) {
            console.log('Error applying filter', error.message);
        } finally {
            setOpenBacdrop(false);
            setOpenFilterDrawer(false);
        }
    };
    // console.log("filteredData", filteredData)

    const handleClearFilter = () => {
        setIsFilter(false)
        setSelectedStatus('')
        setSelectedState('')
        setSelectedNewCity('')
        setSelectedYear('')
        setSelectedMonth('')
        setSelectedDate(0)
        setSelectedAssignDate(null)
        setCompanyIncoDate(null)
        setSelectedCompanyIncoDate(null)
        setFilteredData([])
        fetchNewData()
        //fetchData(1, latestSortCount)
    }
    // Function to get current date in YYYY-MM-DD format
    function getCurrentDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, "0");
        const day = now.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

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
    const fetchRemarksHistory = async () => {
        try {
            const response = await axios.get(`${secretKey}/remarks/remarks-history`);
            setRemarksHistory(response.data.reverse());
            setFilteredRemarks(
                response.data.filter((obj) => obj.companyID === cid).reverse()
            );

            //console.log(response.data);
        } catch (error) {
            console.error("Error fetching remarks history:", error);
        }
    };

    // -------------------request dialog functions-------------------
    const [open, openchange] = useState(false);
    const functionopenpopup = () => {
        openchange(true);
    };

    return (
        <div>

            {!formOpen && !addFormOpen && (
                <>
                    {!showCallHistory ? <div className="page-wrapper">
                        {BDMrequests && (
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
                        ))}

                        <div className="page-header d-print-none">
                            <div className="container-xl">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <div className="btn-group mr-2">
                                            {/* <button type="button" className="btn mybtn"
                                                onClick={functionopenpopupNew}
                                            >
                                                <TiUserAddOutline className='mr-1' /> Add Leads
                                            </button> */}
                                            <EmployeeAddLeadDialog
                                                secretKey={secretKey}
                                                fetchData={fetchData}
                                                ename={data.ename}
                                                fetchNewData={fetchNewData}
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
                                            /> }

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
                                </div>
                            </div>
                        </div>
                        <div
                            onCopy={(e) => {
                                e.preventDefault();
                            }}
                            className="page-body"
                        >
                            <div className="container-xl">
                                <div class="card-header my-tab">
                                    <ul
                                        class="nav nav-tabs card-header-tabs nav-fill p-0"
                                        data-bs-toggle="tabs"
                                    >
                                        <li class="nav-item data-heading">
                                            <a
                                                href="#tabs-home-5"
                                                onClick={() => {
                                                    setdataStatus("All");
                                                    setCurrentPage(0);
                                                    const mappedData = (isSearch || isFilter) ? filteredData : moreEmpData
                                                    setEmployeeData(
                                                        mappedData.filter(
                                                            (obj) =>
                                                                (obj.Status === "Busy" ||
                                                                    obj.Status === "Not Picked Up" ||
                                                                    obj.Status === "Untouched") &&
                                                                (obj.bdmAcceptStatus !== "Forwarded" &&
                                                                    obj.bdmAcceptStatus !== "Accept" &&
                                                                    obj.bdmAcceptStatus !== "Pending")
                                                        ).sort(
                                                            (a, b) =>
                                                                new Date(b.lastActionDate) -
                                                                new Date(a.lastActionDate)
                                                        )
                                                    );
                                                }}
                                                className={
                                                    dataStatus === "All"
                                                        ? "nav-link active item-act"
                                                        : "nav-link"
                                                }
                                                data-bs-toggle="tab"
                                            >
                                                General{" "}
                                                <span className="no_badge">
                                                    {
                                                        ((isSearch || isFilter) ? filteredData : moreEmpData).filter(
                                                            (obj) =>
                                                                (obj.Status === "Busy" ||
                                                                    obj.Status === "Not Picked Up" ||
                                                                    obj.Status === "Untouched") &&
                                                                (obj.bdmAcceptStatus !== "Forwarded" &&
                                                                    obj.bdmAcceptStatus !== "Accept" &&
                                                                    obj.bdmAcceptStatus !== "Pending")
                                                        ).length
                                                    }
                                                </span>
                                                {/* <span className="no_badge">
                                                  {totalCounts.untouched}
                                                </span> */}
                                            </a>
                                        </li>
                                        <li class="nav-item">
                                            <a
                                                href="#tabs-activity-5"
                                                onClick={() => {
                                                    setdataStatus("Interested");
                                                    setCurrentPage(0);
                                                    const mappedData = (isSearch || isFilter) ? filteredData : moreEmpData
                                                    setEmployeeData(
                                                        mappedData.filter(
                                                            (obj) =>
                                                                (obj.Status === "Interested" || obj.Status === "FollowUp") &&
                                                                obj.bdmAcceptStatus === "NotForwarded"
                                                        )
                                                    );
                                                }}
                                                className={
                                                    dataStatus === "Interested"
                                                        ? "nav-link active item-act"
                                                        : "nav-link"
                                                }
                                                data-bs-toggle="tab"
                                            >
                                                Interested
                                                <span className="no_badge">
                                                    {
                                                        ((isSearch || isFilter) ? filteredData : moreEmpData).filter(
                                                            (obj) =>
                                                                (obj.Status === "Interested" || obj.Status === "FollowUp") &&
                                                                obj.bdmAcceptStatus === "NotForwarded"
                                                        ).length
                                                    }
                                                </span>
                                                {/* <span className="no_badge">
                                                  {totalCounts.interested}
                                                </span> */}
                                            </a>
                                        </li>
                                        {/* <li class="nav-item">
                      <a
                        href="#tabs-activity-5"
                        onClick={() => {
                          setdataStatus("FollowUp");
                          setCurrentPage(0);
                          const mappedData = (isSearch || isFilter) ? filteredData : moreEmpData
                          setEmployeeData(
                            mappedData.filter(
                              (obj) =>
                                obj.Status === "FollowUp" &&
                                obj.bdmAcceptStatus === "NotForwarded"
                            )
                          );
                        }}
                        className={
                          dataStatus === "FollowUp"
                            ? "nav-link active item-act"
                            : "nav-link"
                        }
                        data-bs-toggle="tab"
                      >
                        Follow Up{" "}
                        <span className="no_badge">
                          {
                            ((isSearch || isFilter) ? filteredData : moreEmpData).filter(
                              (obj) =>
                                obj.Status === "FollowUp" &&
                                obj.bdmAcceptStatus === "NotForwarded"
                            ).length
                          }
                        </span>
                      </a>
                    </li> */}

                                        <li class="nav-item">
                                            <a
                                                href="#tabs-activity-5"
                                                onClick={() => {
                                                    setdataStatus("Matured");
                                                    setCurrentPage(0);
                                                    const mappedData = (isSearch || isFilter) ? filteredData : moreEmpData
                                                    setEmployeeData(
                                                        mappedData
                                                            .filter(
                                                                (obj) =>
                                                                    obj.Status === "Matured" &&
                                                                    (obj.bdmAcceptStatus === "NotForwarded" || obj.bdmAcceptStatus === "Pending" || obj.bdmAcceptStatus === "Accept")
                                                            )
                                                            .sort(
                                                                (a, b) =>
                                                                    new Date(b.lastActionDate) -
                                                                    new Date(a.lastActionDate)
                                                            )
                                                    );
                                                }}
                                                className={
                                                    dataStatus === "Matured"
                                                        ? "nav-link active item-act"
                                                        : "nav-link"
                                                }
                                                data-bs-toggle="tab"
                                            >
                                                Matured{" "}
                                                <span className="no_badge">
                                                    {" "}
                                                    {
                                                        ((isSearch || isFilter) ? filteredData : moreEmpData).filter(
                                                            (obj) =>
                                                                obj.Status === "Matured" &&
                                                                (obj.bdmAcceptStatus === "NotForwarded" ||
                                                                    obj.bdmAcceptStatus === "Pending" ||
                                                                    obj.bdmAcceptStatus === "Accept")
                                                        ).length
                                                    }
                                                </span>
                                                {/* <span className="no_badge">
                                                  {totalCounts.matured}
                                                </span> */}
                                            </a>
                                        </li>
                                        <li class="nav-item">
                                            <a
                                                href="#tabs-activity-5"
                                                onClick={() => {
                                                    setdataStatus("Forwarded");
                                                    setCurrentPage(0);
                                                    const mappedData = (isSearch || isFilter) ? filteredData : moreEmpData
                                                    setEmployeeData(
                                                        mappedData
                                                            .filter(
                                                                (obj) =>
                                                                    obj.bdmAcceptStatus !== "NotForwarded" &&
                                                                    obj.Status !== "Not Interested" &&
                                                                    obj.Status !== "Busy" &&
                                                                    obj.Status !== "Junk" &&
                                                                    obj.Status !== "Not Picked Up" &&
                                                                    obj.Status !== "Matured"
                                                            )
                                                            .sort((a, b) => new Date(b.bdeForwardDate) - new Date(a.bdeForwardDate))
                                                    );
                                                    //setdataStatus(obj.bdmAcceptStatus);
                                                }}
                                                className={
                                                    dataStatus === "Forwarded"
                                                        ? "nav-link active item-act"
                                                        : "nav-link"
                                                }
                                                data-bs-toggle="tab"
                                            >
                                                Bdm Forwarded{" "}
                                                <span className="no_badge">
                                                    {" "}
                                                    {
                                                        ((isSearch || isFilter) ? filteredData : moreEmpData).filter(
                                                            (obj) =>
                                                                obj.bdmAcceptStatus !== "NotForwarded" &&
                                                                obj.Status !== "Not Interested" && obj.Status !== "Busy" && obj.Status !== "Junk" && obj.Status !== "Not Picked Up" && obj.Status !== "Busy" &&
                                                                obj.Status !== "Matured"
                                                        ).length
                                                    }
                                                </span>
                                                {/* <span className="no_badge">
                                                  {totalCounts.forwarded}
                                                </span> */}
                                            </a>
                                        </li>
                                        <li class="nav-item">
                                            <a
                                                href="#tabs-activity-5"
                                                onClick={() => {
                                                    setdataStatus("NotInterested");
                                                    setCurrentPage(0);
                                                    const mappedData = (isSearch || isFilter) ? filteredData : moreEmpData
                                                    setEmployeeData(
                                                        mappedData.filter(
                                                            (obj) =>
                                                                (obj.Status === "Not Interested" ||
                                                                    obj.Status === "Junk") &&
                                                                (obj.bdmAcceptStatus === "NotForwarded" || obj.bdmAcceptStatus === "Pending" || obj.bdmAcceptStatus === "Accept")
                                                        )
                                                    );
                                                }}
                                                className={
                                                    dataStatus === "NotInterested"
                                                        ? "nav-link active item-act"
                                                        : "nav-link"
                                                }
                                                data-bs-toggle="tab"
                                            >
                                                Not-Interested{" "}
                                                <span className="no_badge">
                                                    {
                                                        ((isSearch || isFilter) ? filteredData : moreEmpData).filter(
                                                            (obj) =>
                                                                (obj.Status === "Not Interested" ||
                                                                    obj.Status === "Junk") &&
                                                                (obj.bdmAcceptStatus === "NotForwarded" || obj.bdmAcceptStatus === "Pending" || obj.bdmAcceptStatus === "Accept")
                                                        ).length
                                                    }
                                                </span>
                                                {/* <span className="no_badge">
                                                  {totalCounts.notInterested}
                                                </span> */}
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="card">
                                    <div className="card-body p-0">
                                        <div
                                            style={{
                                                overflowX: "auto",
                                                overflowY: "auto",
                                                maxHeight: "66vh",
                                            }}
                                        >
                                            <table
                                                style={{
                                                    width: "100%",
                                                    borderCollapse: "collapse",
                                                    border: "1px solid #ddd",
                                                }}
                                                className="table-vcenter table-nowrap"
                                            >
                                                <thead>
                                                    <tr className="tr-sticky">
                                                        <th className="th-sticky">Sr.No</th>
                                                        <th className="th-sticky1">Company Name</th>
                                                        <th>Company Number</th>
                                                        <th>Call History</th>
                                                        {dataStatus === "Forwarded" ? (<th>BDE Status</th>) : (<th>Status</th>)}
                                                        {dataStatus === "Forwarded" ? (<th>BDE Remarks</th>) : (<th>Remarks</th>)}
                                                        {dataStatus === "Forwarded" && <th>BDM Status</th>}
                                                        {dataStatus === "Forwarded" && <th>BDM Remarks</th>}
                                                        {dataStatus === "FollowUp" && (<th>Next FollowUp Date</th>)}

                                                        <th>
                                                            Incorporation Date
                                                        </th>

                                                        <th>City</th>
                                                        <th>State</th>
                                                        <th>Company Email</th>

                                                        <th>
                                                            Assigned Date
                                                            <SwapVertIcon
                                                                style={{
                                                                    height: "15px",
                                                                    width: "15px",
                                                                    cursor: "pointer",
                                                                }}
                                                                onClick={() => {
                                                                    const sortedData = [...employeeData].sort(
                                                                        (a, b) => {
                                                                            if (sortOrder === "asc") {
                                                                                return b.AssignDate.localeCompare(
                                                                                    a.AssignDate
                                                                                );
                                                                            } else {
                                                                                return a.AssignDate.localeCompare(
                                                                                    b.AssignDate
                                                                                );
                                                                            }
                                                                        }
                                                                    );
                                                                    setEmployeeData(sortedData);
                                                                    setSortOrder(
                                                                        sortOrder === "asc" ? "desc" : "asc"
                                                                    );
                                                                }}
                                                            />
                                                        </th>

                                                        {dataStatus === "Matured" && <><th>
                                                            Booking Date
                                                        </th>
                                                            <th>
                                                                Publish Date
                                                            </th></>}
                                                        {(dataStatus === "FollowUp" && (
                                                            <th>Add Projection</th>
                                                        )) || (dataStatus === "Interested" && (
                                                            <th>Add Projection</th>
                                                        )) || (dataStatus === "Matured" && (
                                                            <th>Add Projection</th>
                                                        ))}

                                                        {dataStatus === "Forwarded" && (<>
                                                            <th>BDM Name</th>
                                                            <th>Forwarded Date</th>
                                                        </>)}

                                                        {(dataStatus === "Forwarded" ||
                                                            dataStatus === "Interested" ||
                                                            dataStatus === "FollowUp") && (
                                                                <th>Forward to BDM</th>
                                                            )}
                                                        {dataStatus === "Forwarded" &&
                                                            (dataStatus !== "Interested" ||
                                                                dataStatus !== "FollowUp" ||
                                                                dataStatus !== "Untouched" ||
                                                                dataStatus !== "Matured" ||
                                                                dataStatus !== "Not Interested") && (
                                                                <th>Feedback</th>
                                                            )}
                                                    </tr>
                                                </thead>
                                                {loading ? (
                                                    <tbody>
                                                        <tr>
                                                            <td colSpan="11" >
                                                                <div className="LoaderTDSatyle w-100" >
                                                                    <ClipLoader
                                                                        color="lightgrey"
                                                                        loading
                                                                        size={30}
                                                                        aria-label="Loading Spinner"
                                                                        data-testid="loader"
                                                                    />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                ) : (
                                                    <tbody>
                                                        {currentData.map((company, index) => (
                                                            <tr
                                                                key={index}
                                                                style={{ border: "1px solid #ddd" }}
                                                            >
                                                                <td className="td-sticky">{startIndex + index + 1}</td>
                                                                <td className="td-sticky1">{company["Company Name"]}</td>
                                                                <td>
                                                                    <div className="d-flex align-items-center justify-content-between wApp">
                                                                        <div>{company["Company Number"]}</div>
                                                                        <a
                                                                            target="_blank"
                                                                            href={`https://wa.me/91${company["Company Number"]}`}
                                                                        >
                                                                            <FaWhatsapp />
                                                                        </a>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <LuHistory onClick={() => {
                                                                        setShowCallHistory(true);
                                                                        setClientNumber(company["Company Number"]);
                                                                    }}
                                                                        style={{
                                                                            cursor: "pointer",
                                                                            width: "15px",
                                                                            height: "15px",
                                                                        }}
                                                                        color="grey"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    {company["Status"] === "Matured" ? (
                                                                        <span>{company["Status"]}</span>
                                                                    ) : (
                                                                        <>
                                                                            {company.bdmAcceptStatus ===
                                                                                "NotForwarded" && (
                                                                                    <select
                                                                                        style={{
                                                                                            background: "none",
                                                                                            padding: ".4375rem .75rem",
                                                                                            border:
                                                                                                "1px solid var(--tblr-border-color)",
                                                                                            borderRadius:
                                                                                                "var(--tblr-border-radius)",
                                                                                        }}
                                                                                        value={company["Status"]}
                                                                                        onChange={(e) =>
                                                                                            handleStatusChange(
                                                                                                company,
                                                                                                company._id,
                                                                                                e.target.value,
                                                                                                company["Company Name"],
                                                                                                company["Company Email"],
                                                                                                company[
                                                                                                "Company Incorporation Date  "
                                                                                                ],
                                                                                                company["Company Number"],
                                                                                                company["Status"],
                                                                                                company.bdmAcceptStatus,
                                                                                                company.isDeletedEmployeeCompany,
                                                                                                company.ename
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        {(dataStatus !== "Interested" && dataStatus !== "FollowUp") &&
                                                                                            (<>
                                                                                                <option value="Not Picked Up">
                                                                                                    Not Picked Up
                                                                                                </option>
                                                                                                <option value="Junk">Junk</option>
                                                                                            </>
                                                                                            )}
                                                                                        <option value="Busy">Busy</option>

                                                                                        <option value="Not Interested">
                                                                                            Not Interested
                                                                                        </option>
                                                                                        {dataStatus === "All" && (
                                                                                            <>
                                                                                                <option value="Untouched">
                                                                                                    Untouched
                                                                                                </option>
                                                                                                <option value="Interested">
                                                                                                    Interested
                                                                                                </option>
                                                                                            </>
                                                                                        )}
                                                                                        {dataStatus === "Interested" && (
                                                                                            <>
                                                                                                <option value="Interested">
                                                                                                    Interested
                                                                                                </option>
                                                                                                {/* <option value="FollowUp">
                                                  Follow Up
                                                </option> */}
                                                                                                <option value="Matured">
                                                                                                    Matured
                                                                                                </option>
                                                                                            </>
                                                                                        )}

                                                                                    </select>
                                                                                )}
                                                                            {(company.bdmAcceptStatus !==
                                                                                "NotForwarded") &&
                                                                                (company.Status === "Interested" ||
                                                                                    company.Status === "FollowUp") && (
                                                                                    <span>{company.bdeOldStatus}</span>
                                                                                )}

                                                                            {(company.bdmAcceptStatus !==
                                                                                "NotForwarded") &&
                                                                                (company.Status === "Not Interested" || company.Status === "Junk" || company.Status === "Not Picked Up" || company.Status === "Busy") && (
                                                                                    <select
                                                                                        style={{
                                                                                            color: "rgb(139, 139, 139)",
                                                                                            background: "none",
                                                                                            padding: ".4375rem .75rem",
                                                                                            border:
                                                                                                "1px solid var(--tblr-border-color)",
                                                                                            borderRadius:
                                                                                                "var(--tblr-border-radius)",
                                                                                        }}
                                                                                        value={company["Status"]}
                                                                                        onChange={(e) =>
                                                                                            handleStatusChange(
                                                                                                company,
                                                                                                company._id,
                                                                                                e.target.value,
                                                                                                company["Company Name"],
                                                                                                company["Company Email"],
                                                                                                company[
                                                                                                "Company Incorporation Date  "
                                                                                                ],
                                                                                                company["Company Number"],
                                                                                                company["Status"],
                                                                                                company.bdmAcceptStatus,
                                                                                                company.isDeletedEmployeeCompany,
                                                                                                company.ename
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <option value="Not Picked Up">
                                                                                            Not Picked Up
                                                                                        </option>
                                                                                        <option value="Busy">Busy</option>
                                                                                        <option value="Junk">Junk</option>
                                                                                        <option value="Not Interested">
                                                                                            Not Interested
                                                                                        </option>
                                                                                        <option value="Interested">Interested</option>
                                                                                        {/* <option value="FollowUp">Follow Up</option> */}
                                                                                    </select>
                                                                                )}
                                                                        </>
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    <div
                                                                        key={company._id}
                                                                        style={{
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                            justifyContent: "space-between",
                                                                            width: "100px",
                                                                        }}
                                                                    >
                                                                        <p
                                                                            className="rematkText text-wrap m-0"
                                                                            title={company.Remarks}
                                                                        >
                                                                            {!company["Remarks"]
                                                                                ? "No Remarks"
                                                                                : company.Remarks}
                                                                        </p>
                                                                        <RemarksDialog
                                                                            key={`${company["Company Name"]}-${index}`} // Using index or another field to create a unique key
                                                                            currentCompanyName={company["Company Name"]}
                                                                            remarksHistory={remarksHistory} // pass your remarks history data
                                                                            companyId={company._id}
                                                                            remarksKey="remarks" // Adjust this based on the type of remarks (general or bdm)
                                                                            isEditable={company.bdmAcceptStatus !== "Accept"} // Allow editing if status is not "Accept"
                                                                            bdmAcceptStatus={company.bdmAcceptStatus}
                                                                            companyStatus={company.Status}
                                                                            secretKey={secretKey}
                                                                            fetchRemarksHistory={fetchRemarksHistory}
                                                                            bdeName={company.ename}
                                                                            fetchNewData={fetchNewData}
                                                                            mainRemarks={company.Remarks}
                                                                        />
                                                                    </div>
                                                                </td>
                                                                {dataStatus === "Forwarded" && (
                                                                    <td>
                                                                        {company.Status === "Interested" && (
                                                                            <span>Interested</span>
                                                                        )}
                                                                        {company.Status === "FollowUp" && (
                                                                            <span>FollowUp</span>
                                                                        )}

                                                                    </td>
                                                                )}
                                                                {dataStatus === "FollowUp" && <td>
                                                                    <input style={{ border: "none" }}
                                                                        type="date"
                                                                        value={formatDateNow(company.bdeNextFollowUpDate)}
                                                                        onChange={(e) => {
                                                                            //setNextFollowUpDate(e.target.value);
                                                                            functionSubmitNextFollowUpDate(e.target.value,
                                                                                company._id,
                                                                                company["Status"]
                                                                            );
                                                                        }}
                                                                    //className="hide-placeholder"
                                                                    /></td>}
                                                                {dataStatus === "Forwarded" &&
                                                                    <td>
                                                                        <div key={company._id}
                                                                            style={{
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                justifyContent: "space-between",
                                                                                width: "100px",
                                                                            }}>
                                                                            <p
                                                                                className="rematkText text-wrap m-0"
                                                                                title={company.remarks}
                                                                            >
                                                                                {!company.bdmRemarks
                                                                                    ? "No Remarks"
                                                                                    : company.bdmRemarks}
                                                                            </p>
                                                                            <RemarksDialog
                                                                                key={`${company["Company Name"]}-${index}`} // Using index or another field to create a unique key
                                                                                currentCompanyName={company["Company Name"]}
                                                                                filteredRemarks={filteredRemarks}
                                                                                companyId={company._id}
                                                                                remarksKey="bdmRemarks" // For BDM remarks
                                                                                isEditable={false} // Disable editing
                                                                                secretKey={secretKey}
                                                                                fetchRemarksHistory={fetchRemarksHistory}
                                                                                bdeName={company.ename}
                                                                                fetchNewData={fetchNewData}
                                                                                bdmName={company.bdmName}
                                                                                bdmAcceptStatus={company.bdmAcceptStatus}
                                                                                companyStatus={company.Status}
                                                                                remarksHistory={remarksHistory} // pass your remarks history data
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                }
                                                                <td>
                                                                    {formatDateNew(
                                                                        company["Company Incorporation Date  "]
                                                                    )}
                                                                </td>
                                                                <td>{company["City"]}</td>
                                                                <td>{company["State"]}</td>
                                                                <td>{company["Company Email"]}</td>
                                                                <td>{formatDateNew(company["AssignDate"])}</td>
                                                                {dataStatus === "Matured" && <>
                                                                    <td>{functionCalculateBookingDate(company._id)}</td>
                                                                    <td>{functionCalculatePublishDate(company._id)}</td>
                                                                    <td>
                                                                        <ProjectionDialog
                                                                            key={`${company["Company Name"]}-${index}`} // Using index or another field to create a unique key
                                                                            projectionCompanyName={company["Company Name"]}
                                                                            projectionData={projectionData}
                                                                            secretKey={secretKey}
                                                                            fetchProjections={fetchProjections}
                                                                            ename={data.ename}
                                                                            bdmAcceptStatus={company.bdmAcceptStatus}
                                                                            hasMaturedStatus={true}
                                                                            hasExistingProjection={projectionData?.some(
                                                                                (item) => item.companyName === company["Company Name"]
                                                                            )}

                                                                        />
                                                                    </td>

                                                                </>}
                                                                {(dataStatus === "FollowUp" ||
                                                                    dataStatus === "Interested") && (
                                                                        <>
                                                                            <td>
                                                                                <ProjectionDialog
                                                                                    key={`${company["Company Name"]}-${index}`} // Using index or another field to create a unique key
                                                                                    projectionCompanyName={company["Company Name"]}
                                                                                    projectionData={projectionData}
                                                                                    secretKey={secretKey}
                                                                                    fetchProjections={fetchProjections}
                                                                                    ename={data.ename}
                                                                                    bdmAcceptStatus={company.bdmAcceptStatus}
                                                                                    hasMaturedStatus={false}
                                                                                    hasExistingProjection={projectionData?.some(
                                                                                        (item) => item.companyName === company["Company Name"]
                                                                                    )}
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <BdmMaturedCasesDialogBox
                                                                                    currentData={currentData}
                                                                                    forwardedCompany={company["Company Name"]}
                                                                                    forwardCompanyId={company._id}
                                                                                    forwardedStatus={company.Status}
                                                                                    forwardedEName={company.ename}
                                                                                    bdeOldStatus={company.Status}
                                                                                    bdmNewAcceptStatus={"Pending"}
                                                                                    fetchNewData={fetchNewData}
                                                                                />
                                                                            </td>
                                                                        </>
                                                                    )}

                                                                {dataStatus === "Forwarded" && (<>
                                                                    {company.bdmName !== "NoOne" ? (<td>{company.bdmName}</td>) : (<td></td>)}
                                                                    <td>{formatDateNew(company.bdeForwardDate)}</td>
                                                                </>)}

                                                                {dataStatus === "Forwarded" && (
                                                                    <td>
                                                                        {company.bdmAcceptStatus === "NotForwarded" ? (<>

                                                                            <TiArrowForward
                                                                                onClick={() => {
                                                                                    handleConfirmAssign(
                                                                                        company._id,
                                                                                        company["Company Name"],
                                                                                        company.Status, // Corrected parameter name
                                                                                        company.ename,
                                                                                        company.bdmAcceptStatus
                                                                                    );
                                                                                }}
                                                                                style={{
                                                                                    cursor: "pointer",
                                                                                    width: "17px",
                                                                                    height: "17px",
                                                                                }}
                                                                                color="grey"
                                                                            />
                                                                        </>) : company.bdmAcceptStatus === "Pending" || company.bdmAcceptStatus === "Forwarded" ? (<>

                                                                            <TiArrowBack
                                                                                onClick={() => {
                                                                                    handleReverseAssign(
                                                                                        company._id,
                                                                                        company["Company Name"],
                                                                                        company.bdmAcceptStatus,
                                                                                        company.Status,
                                                                                        company.bdmName
                                                                                    )
                                                                                }}
                                                                                style={{
                                                                                    cursor: "pointer",
                                                                                    width: "17px",
                                                                                    height: "17px",
                                                                                }}
                                                                                color="#fbb900"
                                                                            />
                                                                        </>) :
                                                                            (company.bdmAcceptStatus === "Accept" && !company.RevertBackAcceptedCompanyRequest) ? (
                                                                                <>
                                                                                    <TiArrowBack
                                                                                        onClick={() => handleRevertAcceptedCompany(
                                                                                            company._id,
                                                                                            company["Company Name"],
                                                                                            company.Status
                                                                                        )}
                                                                                        style={{
                                                                                            cursor: "pointer",
                                                                                            width: "17px",
                                                                                            height: "17px",
                                                                                        }}
                                                                                        color="black" />
                                                                                </>) :
                                                                                (company.bdmAcceptStatus === 'Accept' && company.RevertBackAcceptedCompanyRequest === 'Send') ? (
                                                                                    <>
                                                                                        <TiArrowBack
                                                                                            style={{
                                                                                                cursor: "pointer",
                                                                                                width: "17px",
                                                                                                height: "17px",
                                                                                            }}
                                                                                            color="lightgrey" />
                                                                                    </>) : (<>
                                                                                        <TiArrowForward
                                                                                            onClick={() => {
                                                                                                // handleConfirmAssign(
                                                                                                //   company._id,
                                                                                                //   company["Company Name"],
                                                                                                //   company.Status, // Corrected parameter name
                                                                                                //   company.ename,
                                                                                                //   company.bdmAcceptStatus
                                                                                                // );
                                                                                            }}
                                                                                            style={{
                                                                                                cursor: "pointer",
                                                                                                width: "17px",
                                                                                                height: "17px",
                                                                                            }}
                                                                                            color="grey"
                                                                                        />
                                                                                    </>)}
                                                                    </td>
                                                                )}

                                                                {(dataStatus === "Forwarded" && company.bdmAcceptStatus !== "NotForwarded") ? (
                                                                    <td>
                                                                        <FeedbackDialog
                                                                            key={`${company["Company Name"]}-${index}`} // Using index or another field to create a unique key
                                                                            companyId={company._id}
                                                                            companyName={company["Company Name"]}
                                                                            feedbackRemarks={company.feedbackRemarks}
                                                                            feedbackPoints={company.feedbackPoints}
                                                                        />
                                                                    </td>
                                                                ) : null}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                )}
                                                {currentData.length === 0 && !loading && (
                                                    <tbody>
                                                        <tr>
                                                            <td colSpan="11" className="p-2 particular">
                                                                <Nodata />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                )}
                                            </table>
                                        </div>
                                        {currentData.length !== 0 && (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                }}
                                                className="pagination"
                                            >
                                                <button
                                                    onClick={() =>
                                                        setCurrentPage((prevPage) =>
                                                            Math.max(prevPage - 1, 0)
                                                        )
                                                    }
                                                    disabled={currentPage === 0}
                                                >
                                                    <IconChevronLeft />
                                                </button>
                                                <span>
                                                    Page {currentPage + 1} of{" "}
                                                    {Math.ceil(employeeData.length / itemsPerPage)}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        setCurrentPage((prevPage) =>
                                                            Math.min(
                                                                prevPage + 1,
                                                                Math.ceil(employeeData.length / itemsPerPage) -
                                                                1
                                                            )
                                                        )
                                                    }
                                                    disabled={
                                                        currentPage ===
                                                        Math.ceil(employeeData.length / itemsPerPage) - 1
                                                    }
                                                >
                                                    <IconChevronRight />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> : <CallHistory handleCloseHistory={hanleCloseCallHistory} clientNumber={clientNumber} />}
                </>
            )}

            {formOpen && (
                <>
                    <RedesignedForm
                        // matured={true}
                        // companysId={companyId}
                        setDataStatus={setdataStatus}
                        setFormOpen={setFormOpen}
                        companysName={companyName}
                        companysEmail={companyEmail}
                        companyNumber={companyNumber}
                        setNowToFetch={setNowToFetch}
                        companysInco={companyInco}
                        employeeName={data.ename}
                        employeeEmail={data.email}
                    />
                </>
            )}

            {addFormOpen && (
                <>
                    {" "}
                    <AddLeadForm
                        employeeEmail={data.email}
                        newBdeName={newBdeName}
                        isDeletedEmployeeCompany={deletedEmployeeStatus}
                        setFormOpen={setAddFormOpen}
                        companysName={companyName}
                        setNowToFetch={setNowToFetch}
                        setDataStatus={setdataStatus}
                        employeeName={data.ename}
                    />
                </>
            )}
            <div>
                {/* //----------------leads filter drawer------------------------------- */}
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
                </Drawer>
            </div>
        </div>
    );
}

export default EmployeePanelCopy;
