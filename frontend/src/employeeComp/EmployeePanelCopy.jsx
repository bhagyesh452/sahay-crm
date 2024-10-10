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
import DeleteIcon from "@mui/icons-material/Delete";
import FontDownloadIcon from "@mui/icons-material/FontDownload";
import AttachmentIcon from "@mui/icons-material/Attachment";
import ImageIcon from "@mui/icons-material/Image";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IoIosClose } from "react-icons/io";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import Select from "react-select";
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
import Box from "@mui/material/Box";
import { IoFilterOutline } from "react-icons/io5";
import { TbFileImport } from "react-icons/tb";
import { TbFileExport } from "react-icons/tb";
import { TiUserAddOutline } from "react-icons/ti";
import { MdAssignmentAdd } from "react-icons/md";
import { MdOutlinePostAdd } from "react-icons/md";
import { MdOutlineDeleteSweep } from "react-icons/md";
import { Country, State, City } from 'country-state-city';
import TodaysCollection from "./TodaysCollection.jsx";
import { GoPlusCircle } from "react-icons/go";
import { jwtDecode } from "jwt-decode";
import { MdPayment } from "react-icons/md";
// import DrawerComponent from "../components/Drawer.js";
import CallHistory from "./CallHistory.jsx";
import { LuHistory } from "react-icons/lu";
import BdmMaturedCasesDialogBox from "./BdmMaturedCasesDialogBox.jsx";
import { IoMdClose } from "react-icons/io";
import ProjectionDialog from "./ExtraComponents/ProjectionDialog.jsx";

function EmployeePanelCopy() {
    const [moreFilteredData, setmoreFilteredData] = useState([]);
    const [isEditProjection, setIsEditProjection] = useState(false);
    const [projectingCompany, setProjectingCompany] = useState("");
    const [BDMrequests, setBDMrequests] = useState(null);
    const [openBooking, setOpenBooking] = useState(false);
    const [sortStatus, setSortStatus] = useState("");
    const [maturedID, setMaturedID] = useState("");
    const [currentForm, setCurrentForm] = useState(null);
    const [projectionData, setProjectionData] = useState([]);
    const [requestDeletes, setRequestDeletes] = useState([]);
    const [openLogin, setOpenLogin] = useState(false);
    const [requestData, setRequestData] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentProjection, setCurrentProjection] = useState({
        companyName: "",
        ename: "",
        offeredPrize: 0,
        offeredServices: [],
        lastFollowUpdate: "",
        totalPayment: 0,
        estPaymentDate: "",
        remarks: "",
        date: "",
        time: "",
        editCount: -1,
        totalPaymentError: "",
    });
    const [csvdata, setCsvData] = useState([]);
    const [dataStatus, setdataStatus] = useState("All");
    const [changeRemarks, setChangeRemarks] = useState("");
    const [open, openchange] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [expandYear, setExpandYear] = useState(0);
    const [bookingIndex, setBookingIndex] = useState(0);
    const [editMoreOpen, setEditMoreOpen] = useState(false);
    const [openCSV, openchangeCSV] = useState(false);
    const [openRemarks, openchangeRemarks] = useState(false);
    const [openAnchor, setOpenAnchor] = useState(false);
    const [openProjection, setOpenProjection] = useState(false);
    const [data, setData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
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
    const [redesignedData, setRedesignedData] = useState([])
    const [searchText, setSearchText] = useState("");
    const [citySearch, setcitySearch] = useState("");
    const [visibility, setVisibility] = useState("none");
    const [visibilityOther, setVisibilityOther] = useState("block");
    const [visibilityOthernew, setVisibilityOthernew] = useState("none");
    const [subFilterValue, setSubFilterValue] = useState("");
    const [openbdmRequest, setOpenbdmRequest] = useState(false);
    const [selectedField, setSelectedField] = useState("Company Name");
    const [cname, setCname] = useState("");
    const [cemail, setCemail] = useState("");
    const [companyAddress, setCompanyAddress] = useState("");
    const [directorNameFirst, setDirectorNameFirst] = useState("");
    const [directorNameSecond, setDirectorNameSecond] = useState("");
    const [directorNameThird, setDirectorNameThird] = useState("");
    const [directorNumberFirst, setDirectorNumberFirst] = useState(0);
    const [directorNumberSecond, setDirectorNumberSecond] = useState(0);
    const [directorNumberThird, setDirectorNumberThird] = useState(0);
    const [directorEmailFirst, setDirectorEmailFirst] = useState("");
    const [directorEmailSecond, setDirectorEmailSecond] = useState("");
    const [directorEmailThird, setDirectorEmailThird] = useState("");
    const [selectAllChecked, setSelectAllChecked] = useState(true);
    const [selectedYears, setSelectedYears] = useState([]);
    const [selectedMonths, setSelectedMonths] = useState([]);
    const [cnumber, setCnumber] = useState(0);
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [cidate, setCidate] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [month, setMonth] = useState(0);
    const [updateData, setUpdateData] = useState({});
    const [nowToFetch, setNowToFetch] = useState(false);
    const [RequestApprovals, setRequestApprovals] = useState([]);
    const [mapArray, setMapArray] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [selectedValues, setSelectedValues] = useState([]);
    const [currentRemarks, setCurrentRemarks] = useState("");
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
    const [editFormOpen, setEditFormOpen] = useState(false);
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

    const handleTogglePopup = () => {
        setIsOpen(false);
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

    const handleChangeMail = (e) => {
        const { name, value } = e.target;
        setEmailData({ ...emailData, [name]: value });
    };

    const handleSubmitMail = (e) => {
        e.preventDefault();
        setIsOpen(false);
    };
    //console.log(userId);

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


    const functionopenpopup = () => {
        openchange(true);
    };

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

    //console.log(totalBookings, "This is elon musk");

    const functionopenprojection = (comName) => {
        setProjectingCompany(comName);
        setOpenProjection(true);
        const findOneprojection =
            projectionData.length !== 0 &&
            projectionData.find((item) => item.companyName === comName);
        if (findOneprojection) {
            setCurrentProjection({
                companyName: findOneprojection.companyName,
                ename: findOneprojection.ename,
                offeredPrize: findOneprojection.offeredPrize,
                offeredServices: findOneprojection.offeredServices,
                lastFollowUpdate: findOneprojection.lastFollowUpdate,
                estPaymentDate: findOneprojection.estPaymentDate,
                remarks: findOneprojection.remarks,
                totalPayment: findOneprojection.totalPayment,
                date: "",
                time: "",
                editCount: findOneprojection.editCount,
            });
            setSelectedValues(findOneprojection.offeredServices);
        }
    };



    const closeProjection = () => {
        setOpenProjection(false);
        setProjectingCompany("");
        setCurrentProjection({
            companyName: "",
            ename: "",
            offeredPrize: "",
            offeredServices: "",
            totalPayment: 0,
            lastFollowUpdate: "",
            remarks: "",
            date: "",
            time: "",
        });
        setIsEditProjection(false);
        setSelectedValues([]);
    };
    const functionopenAnchor = () => {
        setTimeout(() => {
            setOpenAnchor(true);
        }, 1000);
    };

    const [cid, setcid] = useState("");
    const [cstat, setCstat] = useState("");
    const [currentCompanyName, setCurrentCompanyName] = useState("");
    const [bdeName, setBdeName] = useState("");

    const functionopenpopupremarks = (companyID, companyStatus, companyName, ename) => {
        openchangeRemarks(true);

        setFilteredRemarks(
            remarksHistory.filter((obj) => obj.companyID === companyID && obj.bdeName === ename)
        );
        // console.log(remarksHistory.filter((obj) => obj.companyID === companyID))
        setcid(companyID);
        setCstat(companyStatus);
        setCurrentCompanyName(companyName);
        setBdeName(ename)
    };

    // console.log("currentcompanyname", currentCompanyName);

    const [opeRemarksEdit, setOpenRemarksEdit] = useState(false);
    const [openPopupByBdm, setOpenPopupByBdm] = useState(false)
    const [filteredRemarksBdm, setFilteredRemarksBdm] = useState([])
    const [filteredRemarksBde, setFilteredRemarksBde] = useState([])



    const functionopenpopupremarksEdit = (
        companyID,
        companyStatus,
        companyName,
        ename
    ) => {

        setOpenRemarksEdit(true);
        setFilteredRemarksBde(
            remarksHistory.filter((obj) => obj.companyID === companyID && obj.bdeName === ename)
        );
        // console.log(remarksHistory.filter((obj) => obj.companyID === companyID))
        setcid(companyID);
        setCstat(companyStatus);
        setCurrentCompanyName(companyName);

    };

    const closePopUpRemarksEdit = () => {
        setOpenRemarksEdit(false);
        //setOpenPopupByBdm(false);
    };


    const [openRemarksBdm, setOpenRemarksBdm] = useState(false)

    const functionopenpopupremarksBdm = (
        companyID,
        companyStatus,
        companyName,
        bdmName
    ) => {
        setOpenRemarksBdm(true);
        setFilteredRemarksBdm(
            remarksHistory.filter((obj) => obj.companyID === companyID && obj.bdmName === bdmName)
        );
        // console.log(remarksHistory.filter((obj) => obj.companyID === companyID))
        setcid(companyID);
        setCstat(companyStatus);
        setCurrentCompanyName(companyName);
    };

    const closePopUpRemarksBdm = () => {
        setOpenRemarksBdm(false);
        //setOpenPopupByBdm(false);
    };


    const debouncedSetChangeRemarks = useCallback(
        debounce((value) => {
            setChangeRemarks(value);
        }, 300), // Adjust the debounce delay as needed (e.g., 300 milliseconds)
        [] // Empty dependency array to ensure the function is memoized
    );

    const [openNew, openchangeNew] = useState(false);

    const functionopenpopupNew = () => {
        openchangeNew(true);
    };
    const closeAnchor = () => {
        setOpenAnchor(false);
    };
    const functionopenpopupCSV = () => {
        openchangeCSV(true);
    };

    const closepopup = () => {
        openchange(false);
    };
    const closepopupCSV = () => {
        openchangeCSV(false);
    };
    const closepopupNew = () => {
        openchangeNew(false);
        setOpenFirstDirector(true);
        setOpenSecondDirector(false);
        setOpenThirdDirector(false);
        setFirstPlus(true);
        setSecondPlus(false);
        setOpenThirdMinus(false)
        fetchData();
        setErrorDirectorNumberFirst("");
        setErrorDirectorNumberSecond("");
        setErrorDirectorNumberThird("");
    };

    const closepopupRemarks = () => {
        openchangeRemarks(false);
        setFilteredRemarks([]);
    };



    //console.log(userId)

    const fetchData = async () => {
        try {
            const response = await axios.get(`${secretKey}/employee/einfo`);


            // Set the retrieved data in the state
            const tempData = response.data;
            const userData = tempData.find((item) => item._id === userId);
            setEmployeeName(userData.ename)
            //console.log(userData);
            setData(userData);
            setmoreFilteredData(userData);

            //console.log(userData.bdmName)

            // if (userData.bdmWork) {
            //   const bdmNames = response.data.filter((employee) => employee.branchOffice === userData.branchOffice && employee.bdmWork && !userData.ename.includes(employee.ename))
            //   //console.log(bdmNames)
            //   setBdmNames(bdmNames.map((obj) => obj.ename))
            // } else {
            //   const bdmNames = response.data.filter((employee) => employee.branchOffice === userData.branchOffice && employee.bdmWork)
            //   setBdmNames(bdmNames.map((obj) => obj.ename))
            //   //console.log(bdmNames)
            // }

            //console.log("data" , userData)

        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };

    useEffect(() => {
        fetchBDMbookingRequests();
        fetchRedesignedFormDataAll()
    }, [data.ename]);

    // console.log("This is elon musk" , BDMrequests);

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

    //console.log(projectionData)

    const fetchNewData = async (status) => {
        const cleanString = (str) => {
            return str.replace(/\u00A0/g, ' ').trim();
        };

        const cleanedEname = cleanString(data.ename);

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

    const handleSort = (sortType) => {
        switch (sortType) {
            case "oldest":
                setIncoFilter("oldest");
                setEmployeeData(
                    employeeData.sort((a, b) =>
                        a["Company Incorporation Date  "].localeCompare(
                            b["Company Incorporation Date  "]
                        )
                    )
                );
                break;
            case "newest":
                setIncoFilter("newest");
                setEmployeeData(
                    employeeData.sort((a, b) =>
                        b["Company Incorporation Date  "].localeCompare(
                            a["Company Incorporation Date  "]
                        )
                    )
                );
                break;
            case "none":
                setIncoFilter("none");
                setEmployeeData(
                    employeeData.sort((a, b) =>
                        b["AssignDate"].localeCompare(a["AssignDate"])
                    )
                );
                break;
            default:
                break;
        }
    };

    const handlenewFieldChange = (companyId, value) => {
        setUpdateData((prevData) => ({
            ...prevData,
            [companyId]: {
                ...prevData[companyId],
                Remarks: value,
                isButtonEnabled: true, // Enable the button when any field changes
            },
        }));
    };

    const handleDeleteRemarks = async (remarks_id, remarks_value) => {
        const mainRemarks = remarks_value === currentRemarks ? true : false;
        //console.log(mainRemarks);
        const companyId = cid;
        //console.log("Deleting Remarks with", remarks_id);
        try {
            // Send a delete request to the backend to delete the item with the specified ID
            await axios.delete(`${secretKey}/remarks/remarks-history/${remarks_id}`);
            if (mainRemarks) {
                await axios.delete(`${secretKey}/remarks/remarks-delete/${companyId}`);
            }
            // Set the deletedItemId state to trigger re-fetching of remarks history
            Swal.fire("Remarks Deleted");
            fetchRemarksHistory();
            fetchNewData(cstat);
        } catch (error) {
            console.error("Error deleting remarks:", error);
        }
    };
    const isUpdateButtonEnabled = (companyId) => {
        return updateData[companyId]?.isButtonEnabled || false;
    };

    const handleUpdate = async () => {
        // Now you have the updated Status and Remarks, perform the update logic
        //console.log(cid, cstat, changeRemarks);
        const Remarks = changeRemarks;
        if (Remarks === "") {
            Swal.fire({ title: "Empty Remarks!", icon: "warning" });
            return true;
        }
        try {
            // Make an API call to update the employee status in the database
            const response = await axios.post(`${secretKey}/remarks/update-remarks/${cid}`, {
                Remarks,
            });
            const response2 = await axios.post(
                `${secretKey}/remarks/remarks-history/${cid}`,
                {
                    Remarks,
                    bdeName,
                    currentCompanyName
                }
            );

            // Check if the API call was successful
            if (response.status === 200) {
                Swal.fire("Remarks updated!");
                setChangeRemarks("");
                // If successful, update the employeeData state or fetch data again to reflect changes
                fetchNewData(cstat);
                fetchRemarksHistory();
                // setCstat("");
                closepopupRemarks(); // Assuming fetchData is a function to fetch updated employee data
            } else {
                // Handle the case where the API call was not successful
                console.error("Failed to update status:", response.data.message);
            }
        } catch (error) {
            // Handle any errors that occur during the API call
            console.error("Error updating status:", error.message);
        }

        setUpdateData((prevData) => ({
            ...prevData,
            [companyId]: {
                ...prevData[companyId],
                isButtonEnabled: false,
            },
        }));

        // After updating, you can disable the button
    };

    const [freezeIndex, setFreezeIndex] = useState(null);

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


    // Request form for Employees

    //const [selectedYear, setSelectedYear] = useState("");
    const [companyType, setCompanyType] = useState("");
    const [numberOfData, setNumberOfData] = useState("");

    // const handleYearChange = (event) => {
    //   setSelectedYear(event.target.value);
    // };

    const handleCompanyTypeChange = (event) => {
        setCompanyType(event.target.value);
    };

    const handleNumberOfDataChange = (event) => {
        setNumberOfData(event.target.value);
    };
    function formatDateproper(inputDate) {
        const options = { month: "long", day: "numeric", year: "numeric" };
        const formattedDate = new Date(inputDate).toLocaleDateString(
            "en-US",
            options
        );
        return formattedDate;
    }
    const handleSubmit = async (event) => {
        const name = data.ename;
        const dateObject = new Date();
        const hours = dateObject.getHours().toString().padStart(2, "0");
        const minutes = dateObject.getMinutes().toString().padStart(2, "0");
        const cTime = `${hours}:${minutes}`;

        const cDate = formatDateproper(dateObject);
        event.preventDefault();
        if (selectedOption === "notgeneral") {
            try {
                // Make API call using Axios
                const response = await axios.post(
                    `${secretKey}/requests/requestData`,

                    {
                        selectedYear,
                        companyType,
                        numberOfData,
                        name,
                        cTime,
                        cDate,
                    }
                );

                //console.log("Data sent successfully:", response.data);
                Swal.fire("Success!", "Data Request Sent!", "success");
                closepopup();
            } catch (error) {
                console.error("Error:", error.message);
                Swal.fire("Error!", "Please try again later!", "error");
            }
        } else {
            try {
                // Make API call using Axios
                const response = await axios.post(`${secretKey}/requests/requestgData`, {
                    numberOfData,
                    name,
                    cTime,
                    cDate,
                });

                //console.log("Data sent successfully:", response.data);
                Swal.fire("Request sent!");
                closepopup();
            } catch (error) {
                console.error("Error:", error.message);
                Swal.fire("Please try again later!");
            }
        }
    };

    const [selectedOption, setSelectedOption] = useState("general");

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleSubmitData = async (e) => {

        e.preventDefault();
        if (cname === "") {
            Swal.fire("Please Enter Company Name");
        }
        else if (!cnumber && !/^\d{10}$/.test(cnumber)) {
            Swal.fire("Company Number is required");
        } else if (cemail === "") {
            Swal.fire("Company Email is required");
        } else if (city === "") {
            Swal.fire("City is required");
        } else if (state === "") {
            Swal.fire("State is required");
        } else if (directorNumberFirst !== 0 && !/^\d{10}$/.test(directorNumberFirst)) {
            Swal.fire("First Director Number should be 10 digits");
        } else if (directorNumberSecond !== 0 && !/^\d{10}$/.test(directorNumberSecond)) {
            Swal.fire("Second Director Number should be 10 digits");
        } else if (directorNumberThird !== 0 && !/^\d{10}$/.test(directorNumberThird)) {
            Swal.fire("Third Director Number should be 10 digits");
        } else {
            const dataToSend = {
                "Company Name": cname.toUpperCase().trim(),
                "Company Number": cnumber,
                "Company Email": cemail,
                "Company Incorporation Date  ": cidate, // Assuming the correct key is "Company Incorporation Date"
                City: city,
                State: state,
                ename: data.ename,
                AssignDate: new Date(),
                "Company Address": companyAddress,
                "Director Name(First)": directorNameFirst,
                "Director Number(First)": directorNumberFirst,
                "Director Email(First)": directorEmailFirst,
                "Director Name(Second)": directorNameSecond,
                "Director Number(Second)": directorNumberSecond,
                "Director Email(Second)": directorEmailSecond,
                "Director Name(Third)": directorNameThird,
                "Director Number(Third)": directorNumberThird,
                "Director Email(Third)": directorEmailThird,
                "UploadedBy": data.ename
            }
            await axios.post(`${secretKey}/requests/requestCompanyData`, dataToSend).then((response) => {
                //console.log("response", response);

                Swal.fire({
                    title: "Lead Request Sent!",
                    text: "Your Request has been sent to the Data Manager!",
                    html: 'Data Analyst Details:<br>Name: PavanSinh Vaghela<br>Number: 9998954896',
                    icon: "success",
                });
                fetchNewData();
                closepopupNew();
            })
                .catch((error) => {
                    console.error("Error sending data:", error);
                    Swal.fire({
                        title: "This lead already exists in the Start-Up Sahay's database.",
                        text: "For further assistance, please contact the Data Analyst.",
                        html: `Data Analyst Details:<br>Name: PavanSinh Vaghela<br>Number: 9998954896`,
                    });
                });
            // axios
            //   .post(`${secretKey}/manual`, {
            //     "Company Name": cname.toUpperCase().trim(),
            //     "Company Number": cnumber,
            //     "Company Email": cemail,
            //     "Company Incorporation Date  ": cidate, // Assuming the correct key is "Company Incorporation Date"
            //     City: city,
            //     State: state,
            //     ename: data.ename,
            //     AssignDate: new Date(),
            //     "Company Address": companyAddress,
            //     "Director Name(First)": directorNameFirst,
            //     "Director Number(First)": directorNumberFirst,
            //     "Director Email(First)": directorEmailFirst,
            //     "Director Name(Second)": directorNameSecond,
            //     "Director Number(Second)": directorNumberSecond,
            //     "Director Email(Second)": directorEmailSecond,
            //     "Director Name(Third)": directorNameThird,
            //     "Director Number(Third)": directorNumberThird,
            //     "Director Email(Third)": directorEmailThird,
            //     "UploadedBy": data.ename
            //   })
        }
    };

    const [openSecondDirector, setOpenSecondDirector] = useState(false);
    const [openFirstDirector, setOpenFirstDirector] = useState(true);
    const [openThirdDirector, setOpenThirdDirector] = useState(false);
    const [firstPlus, setFirstPlus] = useState(true);
    const [secondPlus, setSecondPlus] = useState(false);
    const [openThirdMinus, setOpenThirdMinus] = useState(false);

    const functionOpenSecondDirector = () => {
        setOpenSecondDirector(true);
        setFirstPlus(false);
        setSecondPlus(true);
    };
    const functionOpenThirdDirector = () => {
        setOpenSecondDirector(true);
        setOpenThirdDirector(true);
        setFirstPlus(false);
        setSecondPlus(false);
        setOpenThirdMinus(true);
    };

    const functionCloseSecondDirector = () => {
        setOpenFirstDirector(false);
        //setOpenThirdMinus(true);
        setOpenThirdMinus(false);
        setOpenSecondDirector(false);
        setSecondPlus(false);
        setFirstPlus(true);
    };
    const functionCloseThirdDirector = () => {
        setOpenSecondDirector(true);
        setOpenThirdDirector(false);
        setFirstPlus(false);
        setOpenThirdMinus(false);
        setSecondPlus(true);
    };

    // Function for Parsing Excel File
    const handleRequestDelete = async (companyId, companyName) => {
        const confirmDelete = await Swal.fire({
            title: "Are you sure?",
            text: "You are about to send a delete request. Are you sure you want to proceed?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, proceed!",
            cancelButtonText: "No, cancel",
        });

        if (confirmDelete.isConfirmed) {
            try {
                const sendingData = {
                    companyName,
                    companyId,
                    time: new Date().toLocaleTimeString(),
                    date: new Date().toLocaleDateString(),
                    ename: data.ename, // Replace 'Your Ename Value' with the actual value
                };

                const response = await fetch(`${secretKey}/requests/deleterequestbybde`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(sendingData),
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                Swal.fire({ title: "Delete Request Sent", icon: "success" });
                const responseData = await response.json();
                //console.log(responseData.message); // Log the response message
            } catch (error) {
                Swal.fire({ title: "Failed to send Request", icon: "error" });
                console.error("Error creating delete request:", error);
                // Handle the error as per your application's requirements
            }
        } else {
            console.log("No, cancel");
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (
            file &&
            file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });

                // Assuming there's only one sheet in the XLSX file
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                const formattedJsonData = jsonData
                    .slice(1) // Exclude the first row (header)
                    .map((row) => ({
                        "Sr. No": row[0],
                        "Company Name": row[1],
                        "Company Number": row[2],
                        "Company Email": row[3],
                        "Company Incorporation Date  ": formatDateFromExcel(row[4]), // Assuming the date is in column 'E' (0-based)
                        City: row[5],
                        State: row[6],
                        Status: row[7],
                        Remarks: row[8],
                        "Company Address": row[9],
                        "Director Name(First)": row[10],
                        "Director Number(First)": row[11],
                        "Director Email(First)": row[12],
                        "Director Name(Second)": row[13],
                        "Director Number(Second)": row[14],
                        "Director Email(Second)": row[15],
                        "Director Name(Third)": row[16],
                        "Director Number(Third)": row[17],
                        "Director Email(Third)": row[18],
                    }));

                setCsvData(formattedJsonData);
            };

            reader.readAsArrayBuffer(file);
        } else if (file.type === "text/csv") {
            // CSV file
            const parsedCsvData = parseCsv(data);
            setCsvData(parsedCsvData);
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
                footer: '<a href="#">Why do I have this issue?</a>',
            });

            console.error("Please upload a valid XLSX file.");
        }
    };

    const parseCsv = (data) => {
        // Use a CSV parsing library (e.g., Papaparse) to parse CSV data
        // Example using Papaparse:
        const parsedData = Papa.parse(data, { header: true });
        return parsedData.data;
    };
    function formatDateFromExcel(serialNumber) {
        // Excel uses a different date origin (January 1, 1900)
        const excelDateOrigin = new Date(Date.UTC(1900, 0, 0));
        const millisecondsPerDay = 24 * 60 * 60 * 1000;

        // Adjust for Excel leap year bug (1900 is not a leap year)
        const daysAdjustment = serialNumber > 59 ? 1 : 0;

        // Calculate the date in milliseconds
        const dateMilliseconds =
            excelDateOrigin.getTime() +
            (serialNumber - daysAdjustment) * millisecondsPerDay;

        // Create a Date object using the calculated milliseconds
        const formattedDate = new Date(dateMilliseconds);

        // Format the date as needed (you can use a library like 'date-fns' or 'moment' for more options)
        // const formattedDateString = formattedDate.toISOString().split('T')[0];

        return formattedDate;
    }
    // csvdata.map((item)=>{
    //   console.log(formatDateFromExcel(item["Company Incorporation Date  "]))
    // })


    const handleUploadData = async (e) => {
        const name = data.ename;
        const updatedCsvdata = csvdata.map((data) => ({
            ...data,
            ename: name,
        }));

        //console.log("updatedcsv", updatedCsvdata);

        if (updatedCsvdata.length !== 0) {
            // Move setLoading outside of the loop

            try {
                await axios.post(`${secretKey}/requests/requestCompanyData`, updatedCsvdata);

                Swal.fire({
                    title: "Request Sent!",
                    text: "Your Request has been successfully sent to the Admin",
                    icon: "success",
                });
            } catch (error) {
                if (error.response.status !== 500) {
                    Swal.fire("Some of the data are not unique");
                } else {
                    Swal.fire("Please upload unique data");
                }
                console.log("Error:", error);
            }

            // Move setLoading outside of the loop

            setCsvData([]);
        } else {
            Swal.fire("Please upload data");
        }
    };
    const fetchApproveRequests = async () => {
        try {
            const response = await axios.get(`${secretKey}/requests/requestCompanyData`);
            setRequestApprovals(response.data);
            const uniqueEnames = response.data.reduce((acc, curr) => {
                if (!acc.some((item) => item.ename === data.ename)) {
                    const [dateString, timeString] = formatDateAndTime(
                        curr.AssignDate
                    ).split(", ");
                    acc.push({ ename: data.ename, date: dateString, time: timeString });
                }
                return acc;
            }, []);
            setMapArray(uniqueEnames);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };
    const fetchRedesignedFormData = async () => {
        try {
            //console.log(maturedID);
            const response = await axios.get(
                `${secretKey}/bookings/redesigned-final-leadData`
            );

            const data = response.data.find((obj) => obj.company === maturedID);
            //console.log(data);
            setCurrentForm(data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };
    const fetchRedesignedFormDataAll = async () => {
        try {
            //console.log(maturedID);
            const response = await axios.get(
                `${secretKey}/bookings/redesigned-final-leadData`
            );

            setRedesignedData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };
    useEffect(() => {
        //console.log("Matured ID Changed", maturedID);
        if (maturedID) {
            fetchRedesignedFormData();
        }
    }, [maturedID]);
    //console.log("Current Form:", currentForm);
    const formatDateAndTime = (AssignDate) => {
        // Convert AssignDate to a Date object
        const date = new Date(AssignDate);

        // Convert UTC date to Indian time zone
        const options = { timeZone: "Asia/Kolkata" };
        const indianDate = date.toLocaleString("en-IN", options);
        return indianDate;
    };
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleProjectionSubmit = async () => {
        try {
            const newEditCount =
                currentProjection.editCount === -1
                    ? 0
                    : currentProjection.editCount + 1;

            const finalData = {
                ...currentProjection,
                companyName: projectingCompany,
                ename: data.ename,
                offeredServices: selectedValues,
                editCount: currentProjection.editCount + 1, // Increment editCount
            };

            if (finalData.offeredServices.length === 0) {
                Swal.fire({ title: "Services is required!", icon: "warning" });
            } else if (finalData.remarks === "") {
                Swal.fire({ title: "Remarks is required!", icon: "warning" });
            } else if (Number(finalData.totalPayment) === 0) {
                Swal.fire({ title: "Total Payment Can't be 0!", icon: "warning" });
            } else if (finalData.totalPayment === "") {
                Swal.fire({ title: "Total Payment Can't be 0", icon: "warning" });
            } else if (Number(finalData.offeredPrize) === 0) {
                Swal.fire({ title: "Offered Prize is required!", icon: "warning" });
            } else if (
                Number(finalData.totalPayment) > Number(finalData.offeredPrize)
            ) {
                Swal.fire({
                    title: "Total Payment cannot be greater than Offered Prize!",
                    icon: "warning",
                });
            } else if (finalData.lastFollowUpdate === null) {
                Swal.fire({
                    title: "Last FollowUp Date is required!",
                    icon: "warning",
                });
            } else if (finalData.estPaymentDate === 0) {
                Swal.fire({
                    title: "Estimated Payment Date is required!",
                    icon: "warning",
                });
            } else {
                // Send data to backend API
                const response = await axios.post(
                    `${secretKey}/projection/update-followup`,
                    finalData
                );
                Swal.fire({ title: "Projection Submitted!", icon: "success" });
                setOpenProjection(false);
                setCurrentProjection({
                    companyName: "",
                    ename: "",
                    offeredPrize: 0,
                    offeredServices: [],
                    lastFollowUpdate: "",
                    remarks: "",
                    date: "",
                    time: "",
                    editCount: newEditCount,
                    totalPaymentError: "", // Increment editCount
                });
                fetchProjections();
                setSelectedValues([]);
            }
        } catch (error) {
            console.error("Error updating or adding data:", error.message);
        }
    };

    // console.log(currentProjection)

    const [openIncoDate, setOpenIncoDate] = useState(false);

    const handleFilterIncoDate = () => {
        setOpenIncoDate(!openIncoDate);
    };
    const handleCloseIncoDate = () => {
        setOpenIncoDate(false);
    };
    const handleMarktrue = async () => {
        try {
            // Assuming 'id' is the ID of the object you want to mark as read
            const id = requestData._id;

            // Send a POST request to set the AssignRead property to true for the object with the given ID
            await axios.post(`${secretKey}/requests/setMarktrue/${id}`);

            // Optionally, you can also update the state or perform any other actions after successfully marking the object as read
        } catch (error) {
            // Handle any errors that occur during the API request
            console.error("Error marking object as read:", error);
        }
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

    // Call the function to create the new array
    const resultArray =
        moreEmpData.length !== 0 ? createNewArray(moreEmpData) : [];

    // Handle "Select All" checkbox change
    const handleSelectAllChange = (e) => {
        const isChecked = e.target.checked;
        setSelectAllChecked(isChecked);
        if (isChecked) {
            const newEmpData =
                dataStatus === "All"
                    ? moreEmpData.filter(
                        (obj) =>
                            obj.Status === "Untouched" ||
                            obj.Status === "Busy" ||
                            obj.Status === "Not Picked Up"
                    )
                    : dataStatus === "Interested"
                        ? moreEmpData.filter((obj) => obj.Status === "Interested")
                        : dataStatus === "Not Interested"
                            ? moreEmpData.filter(
                                (obj) => obj.Status === "Not Interested" || obj.Status === "Junk"
                            )
                            : dataStatus === "FollowUp"
                                ? moreEmpData.filter((obj) => obj.Status === "FollowUp")
                                : [];

            setEmployeeData(newEmpData);
            setSelectedYears([
                ...new Set(
                    newEmpData.map((data) =>
                        new Date(data["Company Incorporation Date  "])
                            .getFullYear()
                            .toString()
                    )
                ),
            ]);
            setSelectedMonths([]);
        } else {
            setEmployeeData([]);
            setSelectedYears([]);
            setSelectedMonths([]);
        }
    };

    // Handle year checkbox change
    const handleYearFilterChange = (e, selectedYear) => {
        const isChecked = e.target.checked;
        setSelectAllChecked(false); // Uncheck "Select All" when a year checkbox is clicked
        if (isChecked) {
            const newEmpData =
                dataStatus === "All"
                    ? moreEmpData.filter(
                        (obj) =>
                            obj.Status === "Untouched" ||
                            obj.Status === "Busy" ||
                            obj.Status === "Not Picked Up"
                    )
                    : dataStatus === "Interested"
                        ? moreEmpData.filter((obj) => obj.Status === "Interested")
                        : dataStatus === "Not Interested"
                            ? moreEmpData.filter(
                                (obj) => obj.Status === "Not Interested" || obj.Status === "Junk"
                            )
                            : dataStatus === "FollowUp"
                                ? moreEmpData.filter((obj) => obj.Status === "FollowUp")
                                : [];
            setSelectedYears([...selectedYears, selectedYear]); // Add selected year to the list
            const filteredData = newEmpData.filter(
                (data) =>
                    new Date(data["Company Incorporation Date  "]).getFullYear() ===
                    selectedYear
            );

            setEmployeeData([...employeeData, ...filteredData]); // Add filtered data to the existing employeeData
        } else {
            setSelectedYears(selectedYears.filter((year) => year !== selectedYear)); // Remove selected year from the list
            const filteredData = employeeData.filter(
                (data) =>
                    new Date(data["Company Incorporation Date  "]).getFullYear() !==
                    selectedYear
            );
            setEmployeeData(filteredData); // Update employeeData with filtered data
        }
    };

   
   

    // -----------------------------------------------------delete-projection-data-------------------------------

    const handleDelete = async (company) => {
        const companyName = company;
        //console.log(companyName);

        try {
            // Send a DELETE request to the backend API endpoint
            const response = await axios.delete(
                `${secretKey}/projection/delete-followup/${companyName}`
            );
            //console.log(response.data.message); // Log the response message
            // Show a success message after successful deletion

            setCurrentProjection({
                companyName: "",
                ename: "",
                offeredPrize: 0,
                offeredServices: [],
                lastFollowUpdate: "",
                totalPayment: 0,
                estPaymentDate: "",
                remarks: "",
                date: "",
                time: "",
            });
            setSelectedValues([]);
            fetchProjections();
        } catch (error) {
            console.error("Error deleting data:", error);
            // Show an error message if deletion fails
            console.log("Error!", "Follow Up Not Found.", "error");
        }
    };


    const formatDatePro = (dateString) => {
        const [day, month, year] = dateString.split("/");
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    };

    // ---------------------------------------------- For Editable Lead-form -----------------------------------------------------------

    const handleOpenEditForm = () => {
        setOpenBooking(false);
        setEditMoreOpen(true);
    };

    // --------------------------------------forward to bdm function---------------------------------------------\

    const [forwardedCompany, setForwardedCompany] = useState("");
    const [bdmNewAcceptStatus, setBdmNewAcceptStatus] = useState("");
    const [forwardCompanyId, setforwardCompanyId] = useState("");
    const [feedbakPoints, setFeedbackPoints] = useState("")
    const [feedbackRemarks, setFeedbackRemarks] = useState("")
    const [feedbackPopupOpen, setFeedbackPopupOpen] = useState(false)
    const [feedbackCompany, setFeedbackCompany] = useState("")

    const handleViewFeedback = (companyId, companyName, companyFeedbackRemarks, companyFeedbackPoints) => {
        setFeedbackPopupOpen(true)
        setFeedbackPoints(companyFeedbackPoints)
        setFeedbackRemarks(companyFeedbackRemarks)
        setFeedbackCompany(companyName)
    }

    //console.log(feedbakPoints)

    const closeFeedbackPopup = () => {
        setFeedbackPopupOpen(false)
    }
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

    const IOSSlider = styled(Slider)(({ theme }) => ({
        color: theme.palette.mode === 'dark' ? '#0a84ff' : '#007bff',
        height: 5,
        padding: '15px 0',
        '& .MuiSlider-thumb': {
            height: 20,
            width: 20,
            backgroundColor: '#fff',
            boxShadow: '0 0 2px 0px rgba(0, 0, 0, 0.1)',
            '&:focus, &:hover, &.Mui-active': {
                boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.1)',
                // Reset on touch devices, it doesn't add specificity
                '@media (hover: none)': {
                    boxShadow: iOSBoxShadow,
                },
            },
            '&:before': {
                boxShadow:
                    '0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)',
            },
        },
        '& .MuiSlider-valueLabel': {
            fontSize: 12,
            fontWeight: 'normal',
            top: -6,
            backgroundColor: 'unset',
            color: theme.palette.text.primary,
            '&::before': {
                display: 'none',
            },
            '& *': {
                background: 'transparent',
                color: theme.palette.mode === 'dark' ? '#fff' : '#000',
            },
        },
        '& .MuiSlider-track': {
            border: 'none',
            height: 5,
        },
        '& .MuiSlider-rail': {
            opacity: 0.5,
            boxShadow: 'inset 0px 0px 4px -2px #000',
            backgroundColor: '#d0d0d0',
        },
    }));

    const [confirmationPending, setConfirmationPending] = useState(false);
    const [bdeOldStatus, setBdeOldStatus] = useState("");
    const [openBdmNamePopup, setOpenBdmNamePopoup] = useState(false);
    const [selectedBDM, setSelectedBDM] = useState("");

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

    const handleForwardBdm = async () => {
        // Check if selectedBDM is not empty
        if (!selectedBDM) {
            // If selectedBDM is empty, show an error message
            Swal.fire("Error", "Please select at least one BDM", "error");
            return; // Exit the function early
        }

        const selectedDataWithBdm = currentData.filter(
            (company) => company["Company Name"] === forwardedCompany
        );
        //console.log("selecteddatawithbdm", selectedDataWithBdm);

        try {
            const response = await axios.post(`${secretKey}/bdm-data/forwardtobdmdata`, {
                selectedData: selectedDataWithBdm,
                bdmName: selectedBDM,
                companyId: forwardCompanyId,
                bdmAcceptStatus: bdmNewAcceptStatus,
                bdeForwardDate: new Date(),
                bdeOldStatus: bdeOldStatus,
                companyName: forwardedCompany,
                // Assuming bdmName is defined elsewhere in your component
            });
            const response2 = await axios.post(`${secretKey}/projection/post-followup-forwardeddata/${forwardedCompany}`, {
                caseType: "Forwarded",
                bdmName: selectedBDM
            })
            Swal.fire("Company Forwarded", "", "success");
            //console.log("bdeoldstatus", bdeOldStatus);
            fetchNewData(bdeOldStatus);
            closeBdmNamePopup();
        } catch (error) {
            console.log(error);
            Swal.fire("Error Assigning Data");
        }
    };




    //.log("selectedbdm", selectedBDM)

    // const handleConfirmAssign = ()=>{
    //   setOpenBdmNamePopoup(true);
    // }

    const closeBdmNamePopup = () => {
        setOpenBdmNamePopoup(false);
        setSelectedBDM("");
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

    // -------------------------------------------------add leads form validation and debounce correction----------------------------------

    const debouncedSetCname = debounce((value) => {
        setCname(value);
    }, 10);

    const debouncedSetEmail = debounce((value) => {
        setCemail(value);
    }, 10);

    const debouncedSetAddress = debounce((value) => {
        setCompanyAddress(value);
    }, 10);

    const debouncedSetIncoDate = debounce((value) => {
        setCidate(value);
    }, 10);

    const [errorCNumber, setErrorCNumber] = useState('');

    const debouncedSetCompanyNumber = debounce((value) => {
        if (/^\d{10}$/.test(value)) {
            setCnumber(value);
            setErrorCNumber('');
        } else {
            setErrorCNumber('Please enter a 10-digit number');
            setCnumber()
        }

    }, 10);

    const debouncedSetCity = debounce((value) => {
        setCity(value);
    }, 10);

    const debouncedSetState = debounce((value) => {
        setState(value);
    }, 10);

    const debounceSetFirstDirectorName = debounce((value) => {
        setDirectorNameFirst(value);
    }, 10);

    const [errorDirectorNumberFirst, setErrorDirectorNumberFirst] = useState("")
    const [errorDirectorNumberSecond, setErrorDirectorNumberSecond] = useState("")
    const [errorDirectorNumberThird, setErrorDirectorNumberThird] = useState("")

    const debounceSetFirstDirectorNumber = debounce((value) => {
        if (/^\d{10}$/.test(value)) {
            setDirectorNumberFirst(value)
            setErrorDirectorNumberFirst("")
        } else {
            setErrorDirectorNumberFirst('Please Enter 10 digit Number')
            setDirectorNumberFirst()
        }
    }, 10);

    const debounceSetFirstDirectorEmail = debounce((value) => {
        setDirectorEmailFirst(value);
    }, 10);

    const debounceSetSecondDirectorName = debounce((value) => {
        setDirectorNameSecond(value);
    }, 10);

    const debounceSetSecondDirectorNumber = debounce((value) => {
        if (/^\d{10}$/.test(value)) {
            setDirectorNumberSecond(value)
            setErrorDirectorNumberSecond("")
        } else {
            setErrorDirectorNumberSecond('Please Enter 10 digit Number')
            setDirectorNumberSecond()
        }
    }, 10);

    const debounceSetSecondDirectorEmail = debounce((value) => {
        setDirectorEmailSecond(value);
    }, 10);

    const debounceSetThirdDirectorName = debounce((value) => {
        setDirectorNameThird(value);
    }, 10);

    const debounceSetThirdDirectorNumber = debounce((value) => {
        if (/^\d{10}$/.test(value)) {
            setDirectorNumberThird(value)
            setErrorDirectorNumberThird("")
        } else {
            setErrorDirectorNumberThird('Please Enter 10 digit Number')
            setDirectorNumberThird()
        }
    }, 10);

    const debounceSetThirdDirectorEmail = debounce((value) => {
        setDirectorEmailThird(value);
    }, 10);






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

    /*************  ✨ Codeium Command ⭐  *************/
    /**
     * Closes the filter drawer
     * @function
     * @returns {undefined}
     */
    /******  f4793f48-67cd-4453-ae84-2b11f4d49cb5  *******/

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

    // Shows today's projection pop-up :
    const [shouldShowCollection, setShouldShowCollection] = useState(false);
    const [currentDate, setCurrentDate] = useState(getCurrentDate());
   

    // Function to get current date in YYYY-MM-DD format
    function getCurrentDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, "0");
        const day = now.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    // Shows today's projection pop-up when button is clicked :
    const [noOfCompany, setNoOfCompany] = useState("");
    const [noOfServiceOffered, setNoOfServiceOffered] = useState("");
    const [offeredPrice, setOffferedPrice] = useState("");
    const [expectedCollection, setExpectedCollection] = useState("");
    const [openTodaysColection, setOpenTodaysCollection] = useState(false);

    const [errors, setErrors] = useState({
        noOfCompany: "",
        noOfServiceOffered: "",
        offeredPrice: "",
        expectedCollection: ""
    });

    const closePopup = () => {
        setOpenTodaysCollection(false);
    };

    const handleClose = (event, reason) => {
        if (reason === 'backdropClick') {
            return;
        }
        closePopup();
    };

    const date = new Date();
    const todayDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const currentTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    const handleSubmitTodaysCollection = async () => {
        let formErrors = {
            noOfCompany: noOfCompany === "" ? "No. of Company is required" : "",
            noOfServiceOffered: noOfServiceOffered === "" ? "No. of Service Offered is required" : "",
            offeredPrice: offeredPrice === "" ? "Total Offered Price is required" : "",
            expectedCollection: expectedCollection === "" ? "Total Collection Expected is required" : ""
        };
        setErrors(formErrors);
        if (Object.values(formErrors).some(error => error !== "")) {
            return;
        }

        const payload = {
            empId: userId,
            noOfCompany: noOfCompany,
            noOfServiceOffered: noOfServiceOffered,
            totalOfferedPrice: offeredPrice,
            totalCollectionExpected: expectedCollection,
            date: todayDate,
            time: currentTime
        };


        try {
            const response = await axios.post(`${secretKey}/employee/addTodaysProjection`, payload);

            Swal.fire("Success!", "Data Successfully Added!", "success");
            setNoOfCompany("");
            setNoOfServiceOffered("");
            setOffferedPrice("");
            setExpectedCollection("");
            closePopup();
        } catch (error) {
            console.log("Error to send today's collection", error);
            Swal.fire("Error!", "Error to send today's collection!", "error");
        }
    };

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


    // Payment Approval Request :
    const [openPaymentApproval, setOpenPaymentApproval] = useState(false);
    const [requestedCompanyName, setRequestedCompanyName] = useState("");
    const [serviceType, setServiceType] = useState([]);
    const [minimumPrice, setMinimumPrice] = useState(0);
    const [requestedPrice, setRequestedPrice] = useState(0);
    const [requesteType, setRequesteType] = useState("");
    const [reason, setReason] = useState("");
    const [remarks, setRemarks] = useState("");
    const [file, setFile] = useState("");
    const [paymentApprovalErrors, setPaymentApprovalErrors] = useState({});

    const handleClosePaymentApproval = () => {
        setOpenPaymentApproval(false);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!requestedCompanyName) newErrors.requestedCompanyName = "Company Name is required.";
        if (serviceType.length === 0) newErrors.serviceType = "At least one Service Type is required.";
        if (!minimumPrice) newErrors.minimumPrice = "Minimum Price is required.";
        if (!requestedPrice) newErrors.requestedPrice = "Requested Price is required.";
        if (!requesteType) newErrors.requesteType = "Requested Type is required.";

        setPaymentApprovalErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePaymentApprovalSubmit = async () => {
        // console.log(data.ename, data.designation, data.branchOffice, requestedCompanyName, minimumPrice, requestedPrice, requesteType, reason, remarks);

        if (validateForm()) {
            try {
                // Create FormData instance
                const formData = new FormData();
                formData.append('ename', data.ename);
                formData.append('designation', data.designation);
                formData.append('branchOffice', data.branchOffice);
                formData.append('companyName', requestedCompanyName);
                formData.append('serviceType', serviceType);
                formData.append('minimumPrice', minimumPrice);
                formData.append('clientRequestedPrice', requestedPrice);
                formData.append('requestType', requesteType);
                formData.append('reason', reason);
                formData.append('remarks', remarks);
                formData.append('requestDate', new Date());
                formData.append('assigned', "Pending");
                if (file) {
                    formData.append('attachment', file);  // Append the file to FormData
                }

                const response = await axios.post(`${secretKey}/requests/paymentApprovalRequestByBde`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                Swal.fire("Request Sent");

                handleClosePaymentApproval();
                fetchNewData();
            } catch (error) {
                console.log("Error Posting Payment Approval Request", error);
            }
        }
    };

    return (
        <div>
            {shouldShowCollection && <TodaysCollection empId={userId} secretKey={secretKey} />}
            {/* <Header id={data._id} name={data.ename} empProfile={data.profilePhoto && data.profilePhoto.length !== 0 && data.profilePhoto[0].filename} gender={data.gender} designation={data.newDesignation} />
      <EmpNav userId={userId} bdmWork={data.bdmWork} /> */}
            {/* Dialog box for Request Data */}

            {!formOpen && !editFormOpen && !addFormOpen && !editMoreOpen && (
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
                                            <button type="button" className="btn mybtn"
                                                onClick={functionopenpopupNew}
                                            >
                                                <TiUserAddOutline className='mr-1' /> Add Leads
                                            </button>
                                        </div>
                                        <div className="btn-group" role="group" aria-label="Basic example">
                                            <button type="button"
                                                className={isFilter ? 'btn mybtn active' : 'btn mybtn'}
                                                onClick={() => setOpenFilterDrawer(true)}
                                            >
                                                <IoFilterOutline className='mr-1' /> Filter
                                            </button>
                                            <button type="button" className="btn mybtn"
                                                onClick={functionopenpopupCSV}

                                            >
                                                <TbFileImport className='mr-1' /> Import Leads
                                            </button>
                                            <button type="button" className="btn mybtn"
                                                onClick={functionopenpopup}
                                            >
                                                <MdOutlinePostAdd className='mr-1' /> Request Data
                                            </button>
                                            {/* <button type="button" className="btn mybtn"
                        onClick={() => setOpenTodaysCollection(true)}

                      >
                        <GoPlusCircle className='mr-1' /> Today's General Projection
                      </button> */}
                                            {/* <button type="button" className="btn mybtn"
                        onClick={() => setOpenPaymentApproval(true)}

                      >
                        <MdPayment className='mr-1' /> Payment Approval
                      </button> */}
                                        </div>
                                    </div>
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
                                                                                        {/* {dataStatus === "FollowUp" && (
                                              <>
                                                <option value="FollowUp">
                                                  Follow Up
                                                </option>
                                                <option value="Matured">
                                                  Matured
                                                </option>
                                              </>
                                            )} */}
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

                                                                        {(company.bdmAcceptStatus !== "Accept" ||
                                                                            (company.Status === "Matured" ||
                                                                                company.Status === "Not Interested" ||
                                                                                company.Status === "Busy" ||

                                                                                company.Status === "Not Picked Up" ||
                                                                                company.Status === "Junk")) && (
                                                                                <button
                                                                                    style={{ border: "transparent", background: "none" }}
                                                                                    onClick={() => {
                                                                                        functionopenpopupremarks(
                                                                                            company._id,
                                                                                            company.Status,
                                                                                            company["Company Name"],
                                                                                            company.ename
                                                                                        );
                                                                                        //setOpenPopupByBdm(false);
                                                                                        setCurrentRemarks(company.Remarks);
                                                                                        setCompanyId(company._id);
                                                                                    }}
                                                                                >
                                                                                    <EditIcon
                                                                                        onClick={() => {
                                                                                            functionopenpopupremarks(
                                                                                                company._id,
                                                                                                company.Status,
                                                                                                company["Company Name"]
                                                                                            );
                                                                                            //setOpenPopupByBdm(false);
                                                                                            setCurrentRemarks(company.Remarks);
                                                                                            setCompanyId(company._id);
                                                                                        }}
                                                                                        style={{
                                                                                            width: "12px",
                                                                                            height: "12px",
                                                                                            color: "rgb(139, 139, 139)"
                                                                                        }}

                                                                                    />
                                                                                </button>
                                                                            )}
                                                                        {company.bdmAcceptStatus === "Accept" && (company.Status !== "Matured" && company.Status !== "Not Interested" && company.Status !== "Busy" && company.Status !== "Busy" && company.Status !== "Not Picked Up" && company.Status !== "Junk") && (
                                                                            <button
                                                                                style={{ border: "transparent", background: "none" }}
                                                                                onClick={() => {
                                                                                    functionopenpopupremarksEdit(
                                                                                        company._id,
                                                                                        company.Status,
                                                                                        company["Company Name"],
                                                                                        company.ename
                                                                                    );
                                                                                    //setOpenPopupByBdm(false);
                                                                                    //setCurrentRemarks(company.Remarks);
                                                                                    setCompanyId(company._id);
                                                                                }}
                                                                            >
                                                                                <IconEye
                                                                                    style={{
                                                                                        width: "14px",
                                                                                        height: "14px",
                                                                                        color: "#d6a10c",
                                                                                        cursor: "pointer",
                                                                                    }}
                                                                                />
                                                                            </button>
                                                                        )}
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
                                                                        {/* {company.Status === "Matured" && (
                                      <span>Matured</span>
                                    )}
                                    {(company.Status === "Not Interested" ||
                                      company.Status === "Junk" ||
                                      company.Status === "Busy") && (
                                      <span></span>
                                    )} */}
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
                                                                {dataStatus === "Forwarded" && <td>
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
                                                                        <button
                                                                            style={{ border: "transparent", background: "none" }}
                                                                            onClick={() => {
                                                                                functionopenpopupremarksBdm(
                                                                                    company._id,
                                                                                    company.Status,
                                                                                    company["Company Name"],
                                                                                    company.bdmName
                                                                                );
                                                                                //setOpenPopupByBdm(true);
                                                                                //setCurrentRemarks(company.Remarks);
                                                                                setCompanyId(company._id);
                                                                            }}
                                                                        >
                                                                            <IconEye
                                                                                style={{
                                                                                    width: "14px",
                                                                                    height: "14px",
                                                                                    color: "#d6a10c",
                                                                                    cursor: "pointer",
                                                                                }}
                                                                            />
                                                                        </button>
                                                                    </div>
                                                                </td>}

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
                                                                        {company &&
                                                                            projectionData &&
                                                                            projectionData.some(
                                                                                (item) =>
                                                                                    item.companyName ===
                                                                                    company["Company Name"]
                                                                            ) ? (
                                                                            <button
                                                                                style={{ border: "transparent", background: "none" }}
                                                                            >
                                                                                <RiEditCircleFill
                                                                                    onClick={() => {
                                                                                        functionopenprojection(
                                                                                            company["Company Name"]
                                                                                        );
                                                                                    }}
                                                                                    style={{
                                                                                        cursor: "pointer",
                                                                                        width: "17px",
                                                                                        height: "17px",
                                                                                    }}
                                                                                    color="#fbb900"
                                                                                />
                                                                            </button>
                                                                        ) : (
                                                                            <button
                                                                                style={{ border: "transparent", background: "none" }}
                                                                            >
                                                                                <RiEditCircleFill
                                                                                    onClick={() => {
                                                                                        functionopenprojection(
                                                                                            company["Company Name"]
                                                                                        );
                                                                                        setIsEditProjection(true);
                                                                                    }}
                                                                                    style={{
                                                                                        cursor: "pointer",
                                                                                        width: "17px",
                                                                                        height: "17px",
                                                                                    }}
                                                                                />
                                                                            </button>
                                                                        )}
                                                                    </td>

                                                                </>}
                                                                {(dataStatus === "FollowUp" ||
                                                                    dataStatus === "Interested") && (
                                                                        <>
                                                                            <td>
                                                                                <ProjectionDialog
                                                                                    projectionCompanyName={company["Company Name"]}
                                                                                    projectionData={projectionData}
                                                                                    secretKey={secretKey}
                                                                                    data={data}
                                                                                    setIsEditProjection={setIsEditProjection}
                                                                                    fetchProjections={fetchProjections}
                                                                                    ename={data.ename}
                                                                                  
                                                                                />
                                                                            </td>
                                                                            <td>
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
                                                                    (company.feedbackPoints.length !== 0 || company.feedbackRemarks) ? (
                                                                        <td>
                                                                            <button
                                                                                style={{ border: "transparent", background: "none" }}
                                                                                onClick={() => {
                                                                                    handleViewFeedback(
                                                                                        company._id,
                                                                                        company["Company Name"],
                                                                                        company.feedbackRemarks,
                                                                                        company.feedbackPoints
                                                                                    )
                                                                                }}>
                                                                                <RiInformationLine style={{
                                                                                    cursor: "pointer",
                                                                                    width: "17px",
                                                                                    height: "17px",
                                                                                }} color="#fbb900" />
                                                                            </button>
                                                                        </td>
                                                                    ) : (
                                                                        <td>
                                                                            <button
                                                                                style={{ border: "transparent", background: "none" }}
                                                                                onClick={() => {
                                                                                    handleViewFeedback(
                                                                                        company._id,
                                                                                        company["Company Name"],
                                                                                        company.feedbackRemarks,
                                                                                        company.feedbackPoints
                                                                                    )
                                                                                }}>
                                                                                <RiInformationLine style={{
                                                                                    cursor: "pointer",
                                                                                    width: "17px",
                                                                                    height: "17px",
                                                                                }} color="lightgrey" />
                                                                            </button>
                                                                        </td>
                                                                    )
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

            {editFormOpen && (
                <>
                    <EditableLeadform
                        setFormOpen={setEditFormOpen}
                        companysName={currentForm["Company Name"]}
                        companysEmail={currentForm["Company Email"]}
                        companyNumber={currentForm["Company Number"]}
                        setNowToFetch={setNowToFetch}
                        companysInco={currentForm.incoDate}
                        employeeName={data.ename}
                        employeeEmail={data.email}
                        setDataStatus={setdataStatus}
                    />
                </>
            )}

            {editMoreOpen && (
                <>
                    <EditableMoreBooking
                        setFormOpen={setEditMoreOpen}
                        bookingIndex={bookingIndex}
                        companysName={currentForm["Company Name"]}
                        companysEmail={currentForm["Company Email"]}
                        companyNumber={currentForm["Company Number"]}
                        setNowToFetch={setNowToFetch}
                        companysInco={currentForm.incoDate}
                        employeeName={data.ename}
                        employeeEmail={data.email}
                        setDataStatus={setdataStatus}
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

            {/* Pop up for confirming bookings  */}
            <Dialog className='My_Mat_Dialog'
                open={openBooking}
                onClose={() => {
                    setOpenBooking(false);
                    setCurrentForm(null);
                }}
                fullWidth
                maxWidth="sm">
                <DialogTitle>
                    Choose Booking{" "}
                    <button
                        onClick={() => {
                            setOpenBooking(false);
                            setCurrentForm(null);
                        }}
                        style={{ float: "right" }}
                    >
                        <CloseIcon color="primary"></CloseIcon>
                    </button>{" "}
                </DialogTitle>

                <DialogContent>
                    <div className="bookings-content">
                        <div className="open-bookings d-flex align-items-center justify-content-around">
                            <div className="booking-1">
                                <label for="open-bookings "> Booking 1 </label>
                                <input
                                    onChange={() => setBookingIndex(0)}
                                    className="form-check-input ml-1"
                                    type="radio"
                                    name="open-bookings"
                                    id="open-bookings-1"
                                />
                            </div>
                            {currentForm &&
                                currentForm.moreBookings.map((obj, index) => (
                                    <div className="booking-2">
                                        <label for="open-bookings"> Booking {index + 2} </label>
                                        <input
                                            onChange={() => setBookingIndex(index + 1)}
                                            className="form-check-input ml-1"
                                            type="radio"
                                            name="open-bookings"
                                            id={`open-booking-${index + 2}`}
                                        />
                                    </div>
                                ))}
                        </div>

                        <div className="open-bookings-footer mt-2 d-flex justify-content-center">
                            <button
                                onClick={handleOpenEditForm}
                                style={{ textAlign: "center" }}
                                className="btn btn-primary"
                            >
                                Confirm Booking
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>


            {/* Request Data popup */}
            <Dialog className='My_Mat_Dialog' open={open} onClose={closepopup} fullWidth maxWidth="sm">
                <DialogTitle>
                    Request Data{" "}
                    <button onClick={closepopup} style={{ float: "right" }}>
                        <CloseIcon color="primary"></CloseIcon>
                    </button>{" "}
                </DialogTitle>
                <DialogContent>
                    <div className="container">
                        <div className="con2 row mb-3">
                            <div
                                style={
                                    selectedOption === "general"
                                        ? {
                                            backgroundColor: "#ffb900",
                                            margin: "10px 10px 0px 0px",
                                            cursor: "pointer",
                                            color: "white",
                                        }
                                        : {
                                            backgroundColor: "white",
                                            margin: "10px 10px 0px 0px",
                                            cursor: "pointer",
                                        }
                                }
                                onClick={() => {
                                    setSelectedOption("general");
                                }}
                                className="direct form-control col"
                            >
                                <input
                                    type="radio"
                                    id="general"
                                    value="general"
                                    style={{
                                        display: "none",
                                    }}
                                    checked={selectedOption === "general"}
                                    onChange={handleOptionChange}
                                />
                                <label htmlFor="general">General Data </label>
                            </div>
                        </div>
                        {selectedOption === "notgeneral" ? (
                            <>
                                <div className="mb-3 row">
                                    <label className="col-sm-3 form-label" htmlFor="selectYear">
                                        Select Year :
                                    </label>
                                    <select
                                        id="selectYear"
                                        name="selectYear"
                                        value={selectedYear}
                                        //onChange={handleYearChange}
                                        className="col form-select"
                                    >
                                        {[...Array(2025 - 1970).keys()].map((year) => (
                                            <option key={year} value={1970 + year}>
                                                {1970 + year}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3 row">
                                    <label className="form-label col-sm-3">Company Type :</label>
                                    <input
                                        type="radio"
                                        id="llp"
                                        name="companyType"
                                        value="LLP"
                                        checked={companyType === "LLP"}
                                        onChange={handleCompanyTypeChange}
                                        className="form-check-input"
                                    />
                                    <label htmlFor="llp" className="col">
                                        LLP
                                    </label>
                                    <input
                                        type="radio"
                                        id="pvtLtd"
                                        name="companyType"
                                        value="PVT LTD"
                                        checked={companyType === "PVT LTD"}
                                        onChange={handleCompanyTypeChange}
                                        className="form-check-input"
                                    />
                                    <label className="col" htmlFor="pvtLtd">
                                        PVT LTD
                                    </label>
                                </div>
                            </>
                        ) : (
                            <div></div>
                        )}

                        <div className="mb-3 row">
                            <label className="col-sm-3 form-label" htmlFor="numberOfData">
                                Number of Data :
                            </label>
                            <input
                                type="number"
                                id="numberOfData"
                                name="numberOfData"
                                className="form-control col"
                                value={numberOfData}
                                onChange={handleNumberOfDataChange}
                                min="1"
                                required
                            />
                        </div>
                    </div>
                </DialogContent>
                <div class="card-footer">
                    <button
                        style={{ width: "100%" }}
                        onClick={handleSubmit}
                        className="btn btn-primary bdr-radius-none"
                    >
                        Submit
                    </button>
                </div>
            </Dialog>
            {/* Remarks edit icon pop up*/}
            <Dialog className='My_Mat_Dialog'
                open={openRemarks}
                onClose={closepopupRemarks}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    <span style={{ fontSize: "14px" }}>
                        {currentCompanyName}'s Remarks
                    </span>
                    <button onClick={closepopupRemarks} style={{ float: "right" }}>
                        <CloseIcon color="primary"></CloseIcon>
                    </button>{" "}
                </DialogTitle>
                <DialogContent>
                    <div className="remarks-content">
                        {filteredRemarks.length !== 0 ? (
                            filteredRemarks.slice().map((historyItem) => (
                                <div className="col-sm-12" key={historyItem._id}>
                                    <div className="card RemarkCard position-relative">
                                        <div className="d-flex justify-content-between">
                                            <div className="reamrk-card-innerText">
                                                <pre className="remark-text">{historyItem.remarks}</pre>
                                                {historyItem.bdmName !== undefined && (
                                                    <pre className="remark-text">By BDM</pre>
                                                )}
                                            </div>
                                            <div className="dlticon">
                                                <DeleteIcon
                                                    style={{
                                                        cursor: "pointer",
                                                        color: "#f70000",
                                                        width: "14px",
                                                    }}
                                                    onClick={() => {
                                                        handleDeleteRemarks(
                                                            historyItem._id,
                                                            historyItem.remarks
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="d-flex card-dateTime justify-content-between">
                                            <div className="date">{historyItem.date}</div>
                                            <div className="time">{historyItem.time}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center overflow-hidden">
                                No Remarks History
                            </div>
                        )}
                    </div>

                    <div class="card-footer">
                        <div class="mb-3 remarks-input">
                            <textarea
                                placeholder="Add Remarks Here...  "
                                className="form-control"
                                id="remarks-input"
                                rows="3"
                                onChange={(e) => {
                                    debouncedSetChangeRemarks(e.target.value);
                                }}
                            ></textarea>
                        </div>

                    </div>
                </DialogContent>
                <button
                    onClick={handleUpdate}
                    type="submit"
                    className="btn btn-primary bdr-radius-none"
                    style={{ width: "100%" }}
                >
                    Submit
                </button>
            </Dialog>

            {/* --------------------------------------------------------------dialog to view remarks only on forwarded status---------------------------------- */}

            <Dialog className='My_Mat_Dialog'
                open={opeRemarksEdit}
                onClose={closePopUpRemarksEdit}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    <span style={{ fontSize: "14px" }}>
                        {currentCompanyName}'s Remarks
                    </span>
                    <button
                        onClick={closePopUpRemarksEdit}
                        style={{ float: "right" }}
                    >
                        <CloseIcon color="primary"></CloseIcon>
                    </button>{" "}
                </DialogTitle>
                <DialogContent>
                    <div className="remarks-content">
                        {filteredRemarksBde.length !== 0 ? (
                            filteredRemarksBde.slice().map((historyItem) => (
                                <div className="col-sm-12" key={historyItem._id}>
                                    <div className="card RemarkCard position-relative">
                                        <div className="d-flex justify-content-between">
                                            <div className="reamrk-card-innerText">
                                                <pre className="remark-text">{historyItem.remarks}</pre>
                                                {/* {historyItem.bdmName !== undefined && (
                          <pre className="remark-text">By BDM</pre>
                        )} */}
                                            </div>
                                        </div>

                                        <div className="d-flex card-dateTime justify-content-between">
                                            <div className="date">{historyItem.date}</div>
                                            <div className="time">{historyItem.time}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center overflow-hidden">
                                No Remarks History
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* ----------------------------------------dialog to view bdm remarks--------------------------------------------- */}
            <Dialog className='My_Mat_Dialog'
                open={openRemarksBdm}
                onClose={closePopUpRemarksBdm}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    <span style={{ fontSize: "14px" }}>
                        {currentCompanyName}'s Remarks
                    </span>
                    <button
                        onClick={closePopUpRemarksBdm}
                        style={{ float: "right" }}
                    >
                        <CloseIcon color="primary"></CloseIcon>
                    </button>{" "}
                </DialogTitle>
                <DialogContent>
                    <div className="remarks-content">

                        {filteredRemarksBdm.length !== 0 ? (
                            filteredRemarksBdm.slice().map((historyItem) => (
                                <div className="col-sm-12" key={historyItem._id}>

                                    <div className="card RemarkCard position-relative">
                                        <div className="d-flex justify-content-between">
                                            <div className="reamrk-card-innerText">
                                                <pre className="remark-text">{historyItem.bdmRemarks}</pre>
                                                {/* {historyItem.bdmName !== undefined && (
                          <pre className="remark-text">By BDM</pre>
                        )} */}
                                            </div>
                                        </div>

                                        <div className="d-flex card-dateTime justify-content-between">
                                            <div className="date">{historyItem.date}</div>
                                            <div className="time">{historyItem.time}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center overflow-hidden">
                                No Remarks History
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>


            <Dialog className='My_Mat_Dialog' open={openNew} onClose={closepopupNew} fullWidth maxWidth="md">
                <DialogTitle>
                    Company Info{" "}
                    <button onClick={closepopupNew} style={{ float: "right" }}>
                        <CloseIcon color="primary"></CloseIcon>
                    </button>{" "}
                </DialogTitle>
                <DialogContent>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label className="form-label">Company Name <span style={{ color: "red" }}>*</span></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="example-text-input"
                                                placeholder="Your Company Name"
                                                onChange={(e) => {
                                                    debouncedSetCname(e.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label className="form-label">Company Number <span style={{ color: "red" }}>*</span></label>
                                            <input
                                                type="number"
                                                placeholder="Enter Company's Phone No."
                                                onChange={(e) => {
                                                    debouncedSetCompanyNumber(e.target.value);
                                                }}
                                                className="form-control"
                                            />
                                            {errorCNumber && <p style={{ color: 'red' }}>{errorCNumber}</p>}
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label className="form-label">Company Email <span style={{ color: "red" }}>*</span></label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="example-text-input"
                                                placeholder="example@gmail.com"
                                                onChange={(e) => {
                                                    debouncedSetEmail(e.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Company Incorporation Date
                                            </label>
                                            <input
                                                onChange={(e) => {
                                                    debouncedSetIncoDate(e.target.value);
                                                }}
                                                type="date"
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="mb-3">
                                            <label className="form-label">City<span style={{ color: "red" }}>*</span></label>
                                            <input
                                                onChange={(e) => {
                                                    debouncedSetCity(e.target.value);
                                                }}
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Your City"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="mb-3">
                                            <label className="form-label">State<span style={{ color: "red" }}>*</span></label>
                                            <input
                                                onChange={(e) => {
                                                    debouncedSetState(e.target.value);
                                                }}
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Your State"
                                            //disabled={!isEditProjection}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <label className="form-label">Company Address</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="example-text-input"
                                                placeholder="Enter Your Address"
                                                onChange={(e) => {
                                                    debouncedSetAddress(e.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Director's Name(First)
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="example-text-input"
                                                placeholder="Your Company Name"
                                                onChange={(e) => {
                                                    debounceSetFirstDirectorName(e.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Director's Number(First)
                                            </label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="example-text-input"
                                                placeholder="example@gmail.com"
                                                onChange={(e) => {
                                                    debounceSetFirstDirectorNumber(e.target.value);
                                                }}
                                            />
                                            {errorDirectorNumberFirst && <p style={{ color: 'red' }}>{errorDirectorNumberFirst}</p>}
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Director's Email(First)
                                            </label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="example-text-input"
                                                placeholder="example@gmail.com"
                                                onChange={(e) => {
                                                    debounceSetFirstDirectorEmail(e.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {firstPlus && (
                                    <div className="d-flex align-items-center justify-content-end gap-2">
                                        <button
                                            onClick={() => {
                                                functionOpenSecondDirector();
                                            }}
                                            className="btn btn-primary d-none d-sm-inline-block"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="icon"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                stroke-width="2"
                                                stroke="currentColor"
                                                fill="none"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            >
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M12 5l0 14" />
                                                <path d="M5 12l14 0" />
                                            </svg>
                                        </button>

                                    </div>
                                )}

                                {openSecondDirector && (
                                    <div className="row">
                                        <div className="col-4">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Director's Name(Second)
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="example-text-input"
                                                    placeholder="Your Company Name"
                                                    onChange={(e) => {
                                                        debounceSetSecondDirectorName(e.target.value);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Director's Number(Second)
                                                </label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    name="example-text-input"
                                                    placeholder="example@gmail.com"
                                                    onChange={(e) => {
                                                        debounceSetSecondDirectorNumber(e.target.value);
                                                    }}
                                                />
                                                {errorDirectorNumberSecond && <p style={{ color: 'red' }}>{errorDirectorNumberSecond}</p>}
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Director's Email(Second)
                                                </label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    name="example-text-input"
                                                    placeholder="example@gmail.com"
                                                    onChange={(e) => {
                                                        debounceSetSecondDirectorEmail(e.target.value);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {secondPlus && (
                                    <div className="d-flex align-items-center justify-content-end gap-2">
                                        <button
                                            onClick={() => {
                                                functionOpenThirdDirector();
                                            }}
                                            className="btn btn-primary d-none d-sm-inline-block"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="icon"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                stroke-width="2"
                                                stroke="currentColor"
                                                fill="none"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            >
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M12 5l0 14" />
                                                <path d="M5 12l14 0" />
                                            </svg>
                                        </button>
                                        <button
                                            className="btn btn-primary d-none d-sm-inline-block"
                                            onClick={() => {
                                                functionCloseSecondDirector();
                                            }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="icon"
                                                width="24"
                                                height="24"
                                                fill="white"
                                                viewBox="0 0 448 512"
                                            >
                                                <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
                                            </svg>
                                        </button>
                                    </div>
                                )}

                                {openThirdDirector && (
                                    <div className="row">
                                        <div className="col-4">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Director's Name(Third)
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="example-text-input"
                                                    placeholder="Your Company Name"
                                                    onChange={(e) => {
                                                        debounceSetThirdDirectorName(e.target.value);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Director's Number(Third)
                                                </label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    name="example-text-input"
                                                    placeholder="example@gmail.com"
                                                    onChange={(e) => {
                                                        debounceSetThirdDirectorNumber(e.target.value);
                                                    }}
                                                />
                                                {errorDirectorNumberThird && <p style={{ color: 'red' }}>{errorDirectorNumberThird}</p>}
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Director's Email(Third)
                                                </label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    name="example-text-input"
                                                    placeholder="example@gmail.com"
                                                    onChange={(e) => {
                                                        debounceSetThirdDirectorEmail(e.target.value);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {openThirdMinus && (
                                    <button
                                        className="btn btn-primary d-none d-sm-inline-block"
                                        style={{ float: "right" }}
                                        onClick={() => {
                                            functionCloseThirdDirector();
                                        }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="icon"
                                            width="24"
                                            height="24"
                                            fill="white"
                                            viewBox="0 0 448 512"
                                        >
                                            <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <button className="btn btn-primary bdr-radius-none" onClick={handleSubmitData}>
                    Submit
                </button>
            </Dialog>

            {/* -------------------------- Import CSV File ---------------------------- */}
            <Dialog className='My_Mat_Dialog' open={openCSV} onClose={closepopupCSV} fullWidth maxWidth="sm">
                <DialogTitle>
                    Import CSV DATA{" "}
                    <button onClick={closepopupCSV} style={{ float: "right" }}>
                        <CloseIcon color="primary"></CloseIcon>
                    </button>{" "}
                </DialogTitle>
                <DialogContent>
                    <div className="maincon">
                        <div
                            style={{ justifyContent: "space-between" }}
                            className="con1 d-flex"
                        >
                            <label for="formFile" class="form-label">
                                Upload CSV File
                            </label>
                            <a href={frontendKey + "/AddLeads_EmployeeSample.xlsx"} download>
                                Download Sample
                            </a>
                        </div>

                        <div class="mb-3">
                            <input
                                onChange={handleFileChange}
                                className="form-control"
                                type="file"
                                id="formFile"
                            />
                        </div>
                    </div>
                </DialogContent>
                <button onClick={handleUploadData} className="btn btn-primary bdr-radius-none">
                    Submit
                </button>
            </Dialog>
            {/* -------------------------------------------------------------------------dialog for feedback remarks-------------------------------------- */}

            <Dialog className='My_Mat_Dialog'
                open={feedbackPopupOpen}
                onClose={closeFeedbackPopup}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="m-0" style={{ fontSize: "16px" }}>Feedback Of <span className="text-wrap" > {feedbackCompany}</span></div>
                        <div>
                            <button onClick={closeFeedbackPopup} style={{ float: "right" }}>
                                <CloseIcon color="primary"></CloseIcon>
                            </button>{" "}
                        </div>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <div className="remarks-content">
                        {(feedbackRemarks || feedbakPoints) && (
                            <div className="col-sm-12">
                                <div className="card RemarkCard position-relative">
                                    <div>A. How was the quality of Information?</div>
                                    <IOSSlider className="mt-4"
                                        aria-label="ios slider"
                                        disabled
                                        defaultValue={feedbakPoints[0]}
                                        min={0}
                                        max={10}
                                        valueLabelDisplay="on"
                                    />
                                </div>
                                <div className="card RemarkCard position-relative">
                                    <div>B. How was the clarity of communication with lead?</div>
                                    <IOSSlider className="mt-4"
                                        aria-label="ios slider"
                                        disabled
                                        defaultValue={feedbakPoints[1]}
                                        min={0}
                                        max={10}
                                        valueLabelDisplay="on"
                                    />
                                </div>
                                <div className="card RemarkCard position-relative">
                                    <div>C. How was the accuracy of lead qualification?</div>
                                    <IOSSlider className="mt-4"
                                        aria-label="ios slider"
                                        disabled
                                        defaultValue={feedbakPoints[2]}
                                        min={0}
                                        max={10}
                                        valueLabelDisplay="on"
                                    />
                                </div>
                                <div className="card RemarkCard position-relative">
                                    <div>D. How was engagement level of lead?</div>
                                    <IOSSlider className="mt-4"
                                        aria-label="ios slider"
                                        disabled
                                        defaultValue={feedbakPoints[3]}
                                        min={0}
                                        max={10}
                                        valueLabelDisplay="on"
                                    />
                                </div>
                                <div className="card RemarkCard position-relative">
                                    <div>E. Payment Chances?</div>
                                    <IOSSlider className="mt-4"
                                        aria-label="ios slider"
                                        disabled
                                        defaultValue={feedbakPoints[4]}
                                        min={0}
                                        max={100}
                                        valueLabelDisplay="on"
                                    />
                                </div>
                                <div className="card RemarkCard position-relative">
                                    <div className="d-flex justify-content-between">
                                        <div className="reamrk-card-innerText">
                                            <pre className="remark-text">{feedbackRemarks}</pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {openBdmNamePopup && (
                <>
                    <div
                        className="popup-overlay d-flex justify-content-center align-items-center"
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black backdrop
                            zIndex: 1000, // Ensure it is on top of other content
                        }}
                    >
                        <div
                            className="popup-content"
                            style={{
                                backgroundColor: "#fff",
                                paddingTop: "20px",
                                paddingLeft: "20px",
                                paddingRight: "20px",
                                borderRadius: "10px",
                                width: "800px",
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                                overflowY: "auto", // Add scrolling for larger content
                            }}
                        >
                            <div className="d-flex justify-content-between">
                                <h3>BDM Matured Cases</h3>
                                <div>
                                    {/* <button className="cursor-pointer d-flex align-items-center" onClick={() => setOpenBdmNamePopoup(false)}> */}
                                    <IoMdClose className="cursor-pointer" onClick={() => setOpenBdmNamePopoup(false)} />
                                    {/* </button> */}
                                </div>
                            </div>
                            <BdmMaturedCasesDialogBox
                                currentData={currentData}
                                //bdmData={bdmNames}
                                forwardedCompany={forwardedCompany}
                                forwardCompanyId={forwardCompanyId}
                                bdeOldStatus={bdeOldStatus}
                                bdmNewAcceptStatus={bdmNewAcceptStatus}
                                closeBdmNamePopup={closeBdmNamePopup}
                                fetchNewData={fetchNewData}
                            />
                        </div>
                    </div>
                </>
            )}

            {/* Drawer for Follow Up Projection  */}
            <div>
                {/* <Drawer
          style={{ top: "50px" }}
          anchor="right"
          open={openProjection}
          onClose={closeProjection}
        >
          <div style={{ width: "31em" }} className="container-xl">
            <div
              className="header d-flex justify-content-between align-items-center"
              style={{ margin: "10px 0px" }}
            >
              <h1
                style={{ marginBottom: "0px", fontSize: "23px" }}
                className="title"
              >
                Projection Form
              </h1>
              <div>
                {projectingCompany &&
                  projectionData &&
                  projectionData.some(
                    (item) => item.companyName === projectingCompany
                  ) ? (
                  <>
                    <button
                      onClick={() => {
                        setIsEditProjection(true);
                      }}
                    >
                      <EditIcon color="grey"></EditIcon>
                    </button>
                  </>
                ) : null}

                <button>
                  <IoClose onClick={closeProjection} />
                </button>
              </div>
            </div>
            <hr style={{ margin: "0px" }} />
            <div className="body-projection">
              <div className="header d-flex align-items-center justify-content-between">
                <div>
                  <h1
                    title={projectingCompany}
                    style={{
                      fontSize: "14px",
                      textShadow: "none",
                      fontFamily: "sans-serif",
                      fontWeight: "400",
                      fontFamily: "Poppins, sans-serif",
                      margin: "10px 0px",
                      width: "200px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {projectingCompany}
                  </h1>
                </div>
                <div>
                  <button
                    onClick={() => handleDelete(projectingCompany)}
                    className="btn btn-link"
                    style={{ color: "grey" }}
                  >
                    Clear Form
                  </button>
                </div>
              </div>
              <div className="label">
                <strong>
                  Offered Services{" "}
                  {selectedValues.length === 0 && (
                    <span style={{ color: "red" }}>*</span>
                  )}{" "}
                  :
                </strong>
                <div className="services mb-3">
                  <Select
                    isMulti
                    options={options}
                    onChange={(selectedOptions) => {
                      setSelectedValues(
                        selectedOptions.map((option) => option.value)
                      );
                    }}
                    value={selectedValues.map((value) => ({
                      value,
                      label: value,
                    }))}
                    placeholder="Select Services..."
                    isDisabled={!isEditProjection}
                  />
                </div>
              </div>
              <div className="label">
                <strong>
                  Offered Prices(With GST){" "}
                  {!currentProjection.offeredPrize && (
                    <span style={{ color: "red" }}>*</span>
                  )}{" "}
                  :
                </strong>
                <div className="services mb-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Please enter offered Prize"
                    value={currentProjection.offeredPrize}
                    onChange={(e) => {
                      setCurrentProjection((prevLeadData) => ({
                        ...prevLeadData,
                        offeredPrize: e.target.value,
                      }));
                    }}
                    disabled={!isEditProjection}
                  />
                </div>
              </div>
              <div className="label">
                <strong>
                  Expected Price (With GST)
                  {currentProjection.totalPayment === 0 && (
                    <span style={{ color: "red" }}>*</span>
                  )}{" "}
                  :
                </strong>
                <div className="services mb-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Please enter total Payment"
                    value={currentProjection.totalPayment}
                    onChange={(e) => {
                      const newTotalPayment = e.target.value;
                      if (
                        Number(newTotalPayment) <=
                        Number(currentProjection.offeredPrize)
                      ) {
                        setCurrentProjection((prevLeadData) => ({
                          ...prevLeadData,
                          totalPayment: newTotalPayment,
                          totalPaymentError: "",
                        }));
                      } else {
                        setCurrentProjection((prevLeadData) => ({
                          ...prevLeadData,
                          totalPayment: newTotalPayment,
                          totalPaymentError:
                            "Expected Price should be less than or equal to Offered Price.",
                        }));
                      }
                    }}
                    disabled={!isEditProjection}
                  />

                  <div style={{ color: "lightred" }}>
                    {currentProjection.totalPaymentError}
                  </div>
                </div>
              </div>

              <div className="label">
                <strong>
                  Last Follow Up Date{" "}
                  {!currentProjection.lastFollowUpdate && (
                    <span style={{ color: "red" }}>*</span>
                  )}
                  :{" "}
                </strong>
                <div className="services mb-3">
                  <input
                    type="date"
                    className="form-control"
                    placeholder="Please enter offered Prize"
                    value={currentProjection.lastFollowUpdate}
                    onChange={(e) => {
                      setCurrentProjection((prevLeadData) => ({
                        ...prevLeadData,
                        lastFollowUpdate: e.target.value,
                      }));
                    }}
                    disabled={!isEditProjection}
                  />
                </div>
              </div>
              <div className="label">
                <strong>
                  Payment Expected on{" "}
                  {!currentProjection.estPaymentDate && (
                    <span style={{ color: "red" }}>*</span>
                  )}
                  :
                </strong>
                <div className="services mb-3">
                  <input
                    type="date"
                    className="form-control"
                    placeholder="Please enter Estimated Payment Date"
                    value={currentProjection.estPaymentDate}
                    onChange={(e) => {
                      setCurrentProjection((prevLeadData) => ({
                        ...prevLeadData,
                        estPaymentDate: e.target.value,
                      }));
                    }}
                    disabled={!isEditProjection}
                  />
                </div>
              </div>
              <div className="label">
                <strong>
                  Remarks{" "}
                  {currentProjection.remarks === "" && (
                    <span style={{ color: "red" }}>*</span>
                  )}
                  :
                </strong>
                <div className="remarks mb-3">
                  <textarea
                    type="text"
                    className="form-control"
                    placeholder="Enter any Remarks"
                    value={currentProjection.remarks}
                    onChange={(e) => {
                      setCurrentProjection((prevLeadData) => ({
                        ...prevLeadData,
                        remarks: e.target.value,
                      }));
                    }}
                    disabled={!isEditProjection}
                  />
                </div>
              </div>
              <div className="submitBtn">
                <button
                  disabled={!isEditProjection}
                  onClick={handleProjectionSubmit}
                  style={{ width: "100%" }}
                  type="submit"
                  class="btn btn-primary mb-3"
                >
                  Submit
                </button>
              </div>
              <div>
              </div>
            </div>
          </div>
        </Drawer> */}

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

                <div className="compose-email">
                    {isOpen && (
                        <div className="compose-popup">
                            <div className="compose-header">
                                <h2 className="compose-title">New Email</h2>
                                <button className="close-btn" onClick={handleTogglePopup}>
                                    &times;
                                </button>
                            </div>
                            <form onSubmit={handleSubmitMail}>
                                <input
                                    type="email"
                                    name="to"
                                    className="compose-input"
                                    placeholder="To"
                                    value={emailData.to}
                                    onChange={handleChangeMail}
                                    required
                                />
                                <input
                                    type="text"
                                    name="subject"
                                    className="compose-input"
                                    placeholder="Subject"
                                    value={emailData.subject}
                                    onChange={handleChangeMail}
                                    required
                                />
                                <textarea
                                    name="body"
                                    className="compose-textarea"
                                    placeholder="Write your message here"
                                    value={emailData.body}
                                    onChange={handleChangeMail}
                                    required
                                ></textarea>

                                <div className="compose-more-options d-flex align-items-center ">
                                    <button
                                        //onClick={handleSendEmail}
                                        type="submit"
                                        className="send-btn"
                                    >
                                        Send
                                    </button>
                                    <div className="other-options d-flex">
                                        <div className="compose-formatting m-1">
                                            <FontDownloadIcon />
                                        </div>
                                        <div className="compose-attachments m-1">
                                            <AttachmentIcon />
                                        </div>
                                        <div className="compose-insert-files m-1">
                                            <ImageIcon />
                                        </div>
                                        <div className="compose-menuIcon m-1">
                                            <MoreVertIcon />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* --------------Dialog for todays general projetion----------------- */}
                <Dialog
                    className='My_Mat_Dialog'
                    open={openTodaysColection}
                    onClose={handleClose}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle>
                        Today's Project Collection{" "}
                        <button onClick={closePopup} style={{ float: "right" }}>
                            <CloseIcon color="primary" />
                        </button>
                    </DialogTitle>
                    <DialogContent>
                        <div className="modal-dialog modal-lg" role="document">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className='d-flex'>

                                        <div className="mb-3 col-6">
                                            <label className="form-label">No. Of Company</label>
                                            <input
                                                type="number"
                                                value={noOfCompany}
                                                className="form-control"
                                                placeholder="No. Of Company"
                                                required
                                                onChange={(e) => {
                                                    setNoOfCompany(e.target.value);
                                                    setErrors({ ...errors, noOfCompany: "" });
                                                }}
                                            />
                                            {errors.noOfCompany && <p className="text-danger">{errors.noOfCompany}</p>}
                                        </div>
                                        <div className="mb-3 col-6 mx-1">
                                            <label className="form-label">No. Of Service Offered</label>
                                            <input
                                                type="number"
                                                value={noOfServiceOffered}
                                                className="form-control"
                                                placeholder="No. Of Services"
                                                required
                                                onChange={(e) => {
                                                    setNoOfServiceOffered(e.target.value);
                                                    setErrors({ ...errors, noOfServiceOffered: "" });
                                                }}
                                            />
                                            {errors.noOfServiceOffered && <p className="text-danger">{errors.noOfServiceOffered}</p>}
                                        </div>
                                    </div>
                                    <div className='d-flex'>
                                        <div className="mb-3 col-6">
                                            <label className="form-label">Total Offered Price</label>
                                            <input
                                                type="number"
                                                value={offeredPrice}
                                                className="form-control"
                                                placeholder="Offered Price"
                                                required
                                                onChange={(e) => {
                                                    setOffferedPrice(e.target.value);
                                                    setErrors({ ...errors, offeredPrice: "" });
                                                }}
                                            />
                                            {errors.offeredPrice && <p className="text-danger">{errors.offeredPrice}</p>}
                                        </div>
                                        <div className="mb-3 col-6 mx-1">
                                            <label className="form-label">Total Collection Expected</label>
                                            <input
                                                type="number"
                                                value={expectedCollection}
                                                className="form-control"
                                                placeholder="Expected Collection"
                                                required
                                                onChange={(e) => {
                                                    setExpectedCollection(e.target.value);
                                                    setErrors({ ...errors, expectedCollection: "" });
                                                }}
                                            />
                                            {errors.expectedCollection && <p className="text-danger">{errors.expectedCollection}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                    <Button
                        className="btn btn-primary bdr-radius-none"
                        onClick={handleSubmitTodaysCollection}
                        variant="contained"
                    >
                        Submit
                    </Button>
                </Dialog>

                {/* -------------------- Dialog for payment request approval -------------------- */}
                <Dialog className='My_Mat_Dialog' open={openPaymentApproval} onClose={handleClosePaymentApproval} fullWidth maxWidth="md">
                    <DialogTitle>
                        Payment Approval{" "}
                        <button style={{ background: "none", border: "0px transparent", float: "right" }} onClick={handleClosePaymentApproval} >
                            <IoIosClose style={{
                                height: "36px",
                                width: "32px",
                                color: "grey"
                            }} />
                        </button>
                    </DialogTitle>

                    <DialogContent>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-body">

                                    <form action="/paymentApprovalRequestByBde" method="post" enctype="multipart/form-data">
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="mb-3">
                                                    <label className="form-label">Company Name <span style={{ color: "red" }}>*</span></label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="example-text-input"
                                                        placeholder="Your Company Name"
                                                        onChange={(e) => setRequestedCompanyName(e.target.value)}
                                                    />
                                                    {paymentApprovalErrors.requestedCompanyName && <div style={{ color: 'red' }}>{paymentApprovalErrors.requestedCompanyName}</div>}
                                                </div>
                                            </div>

                                            <div className="col-6">
                                                <div className="mb-3">
                                                    <label className="form-label">Service Type <span style={{ color: "red" }}>*</span></label>
                                                    <Select
                                                        isMulti
                                                        options={options}
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"
                                                        onChange={(selectedOptions) => setServiceType(selectedOptions.map(option => option.value))}
                                                    />
                                                    {paymentApprovalErrors.serviceType && <div style={{ color: 'red' }}>{paymentApprovalErrors.serviceType}</div>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-4">
                                                <div className="mb-3">
                                                    <label className="form-label">Minimum Price
                                                        <span style={{ color: "red" }}>*</span></label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="example-text-input"
                                                        placeholder="0"
                                                        onChange={(e) => setMinimumPrice(e.target.value)}
                                                    />
                                                    {paymentApprovalErrors.minimumPrice && <div style={{ color: 'red' }}>{paymentApprovalErrors.minimumPrice}</div>}
                                                </div>
                                            </div>

                                            <div className="col-4">
                                                <div className="mb-3">
                                                    <label className="form-label">Requested Price
                                                        <span style={{ color: "red" }}>*</span></label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="example-text-input"
                                                        placeholder="0"
                                                        onChange={(e) => setRequestedPrice(e.target.value)}
                                                    />
                                                    {paymentApprovalErrors.requestedPrice && <div style={{ color: 'red' }}>{paymentApprovalErrors.requestedPrice}</div>}
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="mb-3 form-group">
                                                    <label htmlFor="exampleFormControlSelect1" className="form-label">Requested Type
                                                        <span style={{ color: "red" }}>*</span>
                                                    </label>
                                                    <select
                                                        aria-label="Default select example"
                                                        className="form-select"  // Use the correct class for a select element
                                                        id="exampleFormControlSelect1"
                                                        onChange={(e) => setRequesteType(e.target.value)}
                                                    >
                                                        <option value="" disabled selected>Select requested type</option>
                                                        <option value="lesser price">Lesser Price</option>
                                                        <option value="payment term change">Payment Term Change</option>
                                                        <option value="gst/non-gst issue">GST/Non-GST Issue</option>
                                                    </select>
                                                    {paymentApprovalErrors.requesteType && (
                                                        <div style={{ color: 'red' }}>{paymentApprovalErrors.requesteType}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label className="form-label">Reason</label>
                                                    <textarea class="form-control"
                                                        id="exampleFormControlTextarea1"
                                                        rows="3"
                                                        onChange={(e) => setReason(e.target.value)}
                                                        placeholder="Reason for the discount, modification in payment terms, or GST/NON-GST issue"
                                                    ></textarea>
                                                </div>
                                            </div>

                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label className="form-label">Remarks</label>
                                                    <textarea class="form-control"
                                                        id="exampleFormControlTextarea1"
                                                        rows="3"
                                                        onChange={(e) => setRemarks(e.target.value)}
                                                    ></textarea>
                                                </div>
                                            </div>

                                            <div className="col-lg-4">
                                                <div className="mb-3">
                                                    <label className="form-label">Attachment</label>
                                                    <input type="file"
                                                        class="form-control-file"
                                                        id="exampleFormControlFile1"
                                                        name="attachment"
                                                        onChange={(e) => setFile(e.target.files[0])}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </DialogContent>
                    <button className="btn btn-primary bdr-radius-none"
                        onClick={handlePaymentApprovalSubmit}
                    >
                        Submit
                    </button>
                </Dialog>
            </div>
        </div>
    );
}

export default EmployeePanelCopy;
