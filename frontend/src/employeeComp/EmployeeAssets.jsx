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
import { Drawer, Icon, IconButton } from "@mui/material";
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
import EmployeeAssetDetails from "./EmployeeNotificationComponents/EmployeeAssetDetails.jsx";
// import DrawerComponent from "../components/Drawer.js";


function EmployeeAssets() {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const { userId } = useParams();
    const [data, setData] = useState([]);
    const [socketID, setSocketID] = useState("");
    const [requestData, setRequestData] = useState(null);

    useEffect(() => {
        document.title = `Employee-Sahay-CRM`;
      }, [data.ename]);
    
      const playNotificationSound = () => {
        const audio = new Audio(notificationSound);
        audio.play();
      };
    
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

      const fetchData = async () => {
        try {
          const response = await axios.get(`${secretKey}/employee/einfo`);
    
    
          // Set the retrieved data in the state
          const tempData = response.data;
          const userData = tempData.find((item) => item._id === userId);
         
          setData(userData);
    
        } catch (error) {
          console.error("Error fetching data:", error.message);
        }
      };

      useEffect(() => {
        fetchData();
      }, [userId]);

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

      // Shows today's projection pop-up :
  const [shouldShowCollection, setShouldShowCollection] = useState(false);
  const [currentDate, setCurrentDate] = useState(getCurrentDate());
  useEffect(() => {
    const checkAndShowCollection = () => {
      const designation = localStorage.getItem('designation');
      const loginTime = new Date(localStorage.getItem('loginTime'));
      const loginDate = localStorage.getItem('loginDate');

      const currentDateTime = new Date(); // Current date and time in local time

      // Extract current hour and minute
      const currentHour = currentDateTime.getHours();
      // console.log("Current hour is :", currentHour);

      // Get current date in YYYY-MM-DD format
      const newCurrentDate = getCurrentDate();

      // Check if there is an old collectionShown flag and remove it if the date has passed
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(`${userId}_`) && key.endsWith('_collectionShown')) {
          const storedDate = key.split('_')[1];
          if (storedDate !== newCurrentDate) {
            localStorage.removeItem(key);
          }
        }
      }

      // Check conditions to show the collection pop-up
      if (
        designation === 'Sales Executive' &&
        loginDate === newCurrentDate && // Check if it's the same login date
        currentHour >= 10 &&
        !localStorage.getItem(`${userId}_${newCurrentDate}_collectionShown`)
      ) {
        setShouldShowCollection(true);
        localStorage.setItem(`${userId}_${newCurrentDate}_collectionShown`, 'true'); // Set the flag to prevent showing again for this userId on this date
      }
    };

    const updateDateAndCheckCollection = () => {
      const newCurrentDate = getCurrentDate();
      if (newCurrentDate !== currentDate) {
        setCurrentDate(newCurrentDate);
      }
      checkAndShowCollection();
    };

    checkAndShowCollection(); // Call the function initially

    // Set an interval to check every minute
    const intervalId = setInterval(updateDateAndCheckCollection, 60000); // 60000 ms = 1 minute

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [userId, currentDate]); // Trigger when userId or currentDate changes

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
      console.log("Data successfully added :", response);
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
            console.log(`Token expires in ${timeToExpire} seconds`);
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

  //----------------routing page for details page open-------------------------
  const [openDetailsPage, setOpenDeatilsPage] = useState(false)

    return (
        <div>
            {shouldShowCollection && <TodaysCollection empId={userId} secretKey={secretKey} />}
            <Header id={data._id} name={data.ename} empProfile={data.profilePhoto && data.profilePhoto.length !== 0 && data.profilePhoto[0].filename} gender={data.gender} designation={data.newDesignation} />
            <EmpNav userId={userId} bdmWork={data.bdmWork} />
            {!openDetailsPage && (<div className="page-wrapper">
                <div className="page-header rm_Filter m-0">
                    <div className="container-xl">
                        <div className="d-flex  ">
                            <div className="d-flex w-100 justify-content-between">
                                <div className="btn-group ml-1" role="group" aria-label="Basic example">
                                    <button type="button" className="btn mybtn"  >
                                        <IoFilterOutline className='mr-1' /> Filter
                                    </button>
                                </div>
                                <div className="d-flex align-items-center justify-content-between">
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

                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-body rm_Dtl_box m-0">
                    <div className="container-xl">
                        <div className="my-card">
                            <div className="row m-0 E_assets_main">
                                <div className="col-lg-2 p-0">
                                    <div className="employee-assets-left">
                                        <ul class="nav flex-column">
                                            <li class="nav-item">
                                                <a class="nav-link sweep-to-right active" data-bs-toggle="tab" href="#Business_Registration">Business Registration</a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link sweep-to-right" data-bs-toggle="tab" href="#Certification_Services">Certification Services</a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link sweep-to-right" data-bs-toggle="tab" href="#Documentations_Services">Documentations Services</a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link sweep-to-right" data-bs-toggle="tab" href="#Fund_Raising_Services">Fund Raising Services</a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link sweep-to-right" data-bs-toggle="tab" href="#IT">IT Services</a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link sweep-to-right" data-bs-toggle="tab" href="#DigitalMarketing">Digital Marketing</a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link sweep-to-right" data-bs-toggle="tab" href="#ISO">ISO Services</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-lg-10 p-0">
                                    <div className="employee-assets-right">
                                        <div class="tab-content">
                                            <div class="tab-pane container active" id="Business_Registration">
                                                <div className="E_Start-Up_Assets_inner">

                                                    <div className="ESAI_data row">
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    Private Limited Registration
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Structure with limited liability, suitable for startups and medium to large businesses.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn" 
                                                                    onClick={
                                                                          ()=>{
                                                                            setOpenDeatilsPage(true)
                                                                          }
                                                                    }>
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    LLP Registration
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Hybrid structure offering limited liability and flexibility for small to medium businesses.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    LLP Firm Registration
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Application for Issue of Phytosanitary Certificate for Export of Agriculture Commodit...
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    OPC Registration
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Single-owner company with limited liability, ideal for solo entrepreneurs.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    Public Company Registration
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Large entity raising capital through public shares, suitable for large-scale businesses.

                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    Nidhi Company Registration
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    NBFC promoting savings and lending among members, with limited liability.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    Sole Proprietorship Registration
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Simple structure with complete control, ideal for individual-owned businesses.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    Producer Company Registration
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Structure for farmers/producers to pool resources, share profits, and scale operations.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="tab-pane container fade" id="Certification_Services">
                                                <div className="E_Start-Up_Assets_inner">

                                                    <div className="ESAI_data row">
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    Start-Up India Certificate
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Structure with limited liability, suitable for startups and medium to large businesses.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    MSME/UYDAM Certificate
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Hybrid structure offering limited liability and flexibility for small to medium businesses.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    IEC CODE Certificate
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Application for Issue of Phytosanitary Certificate for Export of Agriculture Commodit...
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    BIS Certificate
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Single-owner company with limited liability, ideal for solo entrepreneurs.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    NSIC Certificate
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Large entity raising capital through public shares, suitable for large-scale businesses.

                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    FSSAI Certificate
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    NBFC promoting savings and lending among members, with limited liability.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    APEDA Certificate
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Simple structure with complete control, ideal for individual-owned businesses.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    GST Certificate
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Structure for farmers/producers to pool resources, share profits, and scale operations.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="tab-pane container fade" id="Documentations_Services">
                                                <div className="E_Start-Up_Assets_inner">

                                                    <div className="ESAI_data row">
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    Pitch Deck Development
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Structure with limited liability, suitable for startups and medium to large businesses.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    Financial Modeling

                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Hybrid structure offering limited liability and flexibility for small to medium businesses.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    DPR Development

                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Application for Issue of Phytosanitary Certificate for Export of Agriculture Commodit...
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    CMA Report Development

                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Single-owner company with limited liability, ideal for solo entrepreneurs.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    Company Profile

                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Large entity raising capital through public shares, suitable for large-scale businesses.

                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    FSSAI Certificate
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    NBFC promoting savings and lending among members, with limited liability.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    APEDA Certificate
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Simple structure with complete control, ideal for individual-owned businesses.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    Company Brochure
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Structure for farmers/producers to pool resources, share profits, and scale operations.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    Product Catalog
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Structure for farmers/producers to pool resources, share profits, and scale operations.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="tab-pane container fade" id="Fund_Raising_Services">
                                                <div className="E_Start-Up_Assets_inner">

                                                    <div className="ESAI_data row">
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    Seed Funding Support
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Structure with limited liability, suitable for startups and medium to large businesses.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    I-CREATE Funding Support
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Hybrid structure offering limited liability and flexibility for small to medium businesses.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    DBS Funding


                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Application for Issue of Phytosanitary Certificate for Export of Agriculture Commodit...
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    Angel Funding Support


                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Single-owner company with limited liability, ideal for solo entrepreneurs.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    VC Funding Support


                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Large entity raising capital through public shares, suitable for large-scale businesses.

                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    Crowd Funding Support

                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    NBFC promoting savings and lending among members, with limited liability.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    Government Funding Support
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Simple structure with complete control, ideal for individual-owned businesses.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="tab-pane container fade" id="IT">
                                                <div className="E_Start-Up_Assets_inner">

                                                    <div className="ESAI_data row">
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    Website Development

                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Structure with limited liability, suitable for startups and medium to large businesses.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    App Design & Development

                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Hybrid structure offering limited liability and flexibility for small to medium businesses.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    Web Application Development
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Application for Issue of Phytosanitary Certificate for Export of Agriculture Commodit...
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    Software Development

                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Single-owner company with limited liability, ideal for solo entrepreneurs.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    E-Commerce Website


                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Large entity raising capital through public shares, suitable for large-scale businesses.

                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    Product Development


                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    NBFC promoting savings and lending among members, with limited liability.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <div className="ESAI_data_card mt-3">
                                                                <div className="ESAI_data_card_h">
                                                                    CRM Development
                                                                </div>
                                                                <div className="ESAI_data_card_b">
                                                                    Simple structure with complete control, ideal for individual-owned businesses.
                                                                </div>
                                                                <div className="ESAI_data_card_F">
                                                                    <button className="btn ESAI_data_card_F-btn">
                                                                        Know More
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="tab-pane container fade" id="DigitalMarketing">...</div>
                                            <div class="tab-pane container fade" id="ISO">...</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)}

            {openDetailsPage && (
                <EmployeeAssetDetails
                DetailsPage={setOpenDeatilsPage}/>
            )}
        </div>
    )
}


export default EmployeeAssets