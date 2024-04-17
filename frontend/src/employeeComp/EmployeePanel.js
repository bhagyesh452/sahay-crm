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
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
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
// import DrawerComponent from "../components/Drawer.js";

function EmployeePanel() {
  const [moreFilteredData, setmoreFilteredData] = useState([]);
  const [isEditProjection, setIsEditProjection] = useState(false);
  const [projectingCompany, setProjectingCompany] = useState("");
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
  const [forwardEname, setForrwardEname] = useState("")
  const [forwardStatus, setForrwardStatus] = useState("")
  const [teamInfo, setTeamInfo] = useState([])
  const [bdmName, setBdmName] = useState("")

  const handleTogglePopup = () => {
    setIsOpen(false);
  };
  const loginwithgoogle = () => {
    window.open("http://localhost:6050/auth/google/callback");
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
  // const handleGoogleLogin = async () => {
  //   try {
  //     const { data } = await axios.get(`http://localhost:6050/request`);
  //     console.log(data); // Handle the response as needed
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };
  const handleChangeMail = (e) => {
    const { name, value } = e.target;
    setEmailData({ ...emailData, [name]: value });
  };

  const handleSubmitMail = (e) => {
    e.preventDefault();
    // Perform email sending logic here (e.g., using an API or backend)
    //console.log("Email Data:", emailData);
    // Close the compose popup after sending
    setIsOpen(false);
  };
  const [employeeData, setEmployeeData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [citySearch, setcitySearch] = useState("");
  const [visibility, setVisibility] = useState("none");
  const [visibilityOther, setVisibilityOther] = useState("block");
  const [visibilityOthernew, setVisibilityOthernew] = useState("none");
  const [subFilterValue, setSubFilterValue] = useState("");
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
  //console.log(userId);

  const playNotificationSound = () => {
    const audio = new Audio(notificationSound);
    audio.play();
  };
  useEffect(() => {
    const socket = io('wss://62.72.56.202/socket.io'); // Connects to the same host and port as the client
    socket.on("connect", () => {
      console.log("Socket connected with ID:", socket.id);
      setSocketID(socket.id);
    });

    socket.on("request-seen", () => {
      // Call fetchRequestDetails function to update request details
      fetchRequestDetails();
    });

    socket.on("data-sent", () => {
      fetchRequestDetails();
      playNotificationSound();
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);
  const functionopenpopup = () => {
    openchange(true);
  };

  //console.log("projectingcompnay", projectingCompany)

  //console.log("kuchlikho", currentProjection)
  const fetchEditRequests = async () => {
    try {
      const response = await axios.get(`${secretKey}/editable-LeadData`);
      setTotalBookings(response.data);
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

  // const functionopenprojection = (comName) => {
  //   setProjectingCompany(comName);
  //   setOpenProjection(true);
  //   const findOneprojection =
  //     projectionData.length !== 0 &&
  //     projectionData.find((item) => item.companyName === comName);
  //   if (findOneprojection) {
  //     setCurrentProjection({
  //       companyName: findOneprojection.companyName,
  //       ename: findOneprojection.ename,
  //       offeredPrize: findOneprojection.offeredPrize,
  //       offeredServices: findOneprojection.offeredServices,
  //       lastFollowUpdate: findOneprojection.lastFollowUpdate,
  //       estPaymentDate: findOneprojection.estPaymentDate,
  //       remarks: findOneprojection.remarks,
  //       totalPayment: findOneprojection.totalPayment,
  //       date: "",
  //       time: "",
  //       editCount: findOneprojection.editCount,
  //     });
  //     setSelectedValues(findOneprojection.offeredServices);

  //     // Dynamically update the color of the edit icon based on editCount
  //     let color;
  //     if (findOneprojection.editCount === 0) {
  //       color = "#fbb900"; // Yellow color
  //     } else if (findOneprojection.editCount === 1) {
  //       color = "green";
  //     } else {
  //       color = "red";
  //     }
  //     setEditIconColor(color); // assuming you have a state variable to manage icon color
  //   }
  // };
console.log(socketID, 'If this shows then boom');
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

  const functionopenpopupremarks = (companyID, companyStatus, companyName) => {
    openchangeRemarks(true);
    setFilteredRemarks(
      remarksHistory.filter((obj) => obj.companyID === companyID)
    );
    // console.log(remarksHistory.filter((obj) => obj.companyID === companyID))
    setcid(companyID);
    setCstat(companyStatus);
    setCurrentCompanyName(companyName);
  };
  // console.log("currentcompanyname", currentCompanyName);

  const [opeRemarksEdit, setOpenRemarksEdit] = useState(false)

  const functionopenpopupremarksEdit = (companyID, companyStatus, companyName) => {
    setOpenRemarksEdit(true);
    setFilteredRemarks(
      remarksHistory.filter((obj) => obj.companyID === companyID)
    );
    // console.log(remarksHistory.filter((obj) => obj.companyID === companyID))
    setcid(companyID);
    setCstat(companyStatus);
    setCurrentCompanyName(companyName);
  };

  const closePopUpRemarksEdit = () => {
    setOpenRemarksEdit(false)

  }




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
  };
  const closepopupRemarks = () => {
    openchangeRemarks(false);
    setFilteredRemarks([]);
  };

  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const frontendKey = process.env.REACT_APP_FRONTEND_KEY;

  const fetchData = async () => {
    try {
      const response = await axios.get(`${secretKey}/einfo`);

      // Set the retrieved data in the state
      const tempData = response.data;
      const userData = tempData.find((item) => item._id === userId);
      //console.log(tempData);
      setData(userData);
      setmoreFilteredData(userData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const fecthTeamData = async () => {
    const ename = data.ename
    //console.log("ename", ename)
    try {
      const response = await axios.get(`${secretKey}/teaminfo/${ename}`)

      //console.log("teamdata", response.data)
      setTeamInfo(response.data)
      setBdmName(response.data.bdmName)
      //setTeamDataFilter(response.data)

    } catch (error) {
      console.log("error Fetching data", error.message)
    }
  }

  // console.log("teaminfo", teamInfo)
  //console.log("bdmName", bdmName)

  useEffect(() => {
    fecthTeamData();
  }, [data.ename])





  const fetchProjections = async () => {
    try {
      const response = await axios.get(
        `${secretKey}/projection-data/${data.ename}`
      );
      setProjectionData(response.data);
    } catch (error) {
      console.error("Error fetching Projection Data:", error.message);
    }
  };
  //console.log(projectionData)
  const [moreEmpData, setmoreEmpData] = useState([]);
  const [tempData, setTempData] = useState([]);

  const fetchNewData = async (status) => {
    try {
      if (!status) {
        setLoading(true);
      }

      const response = await axios.get(`${secretKey}/employees/${data.ename}`);
      const tempData = response.data;
      //console.log("tempData", tempData)

      const sortedData = response.data.sort((a, b) => {
        // Assuming AssignDate is a string representation of a date
        return new Date(b.AssignDate) - new Date(a.AssignDate);
      });

      setmoreEmpData(sortedData);
      setTempData(tempData);
      setEmployeeData(
        tempData.filter(
          (obj) =>
            obj.Status === "Busy" ||
            obj.Status === "Not Picked Up" ||
            obj.Status === "Untouched"
        )
      );
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
        setEmployeeData(tempData.filter((obj) => obj.Status === "FollowUp"));
        setdataStatus("FollowUp");
      }
      if (status === "Interested") {
        setEmployeeData(tempData.filter((obj) => obj.Status === "Interested"));
        setdataStatus("Interested");
      }
      if (status === "Forwarded") {
        setdataStatus("Forwarded")
        setEmployeeData(
          moreEmpData
            .filter((obj) => obj.bdmAcceptStatus !== "NotForwarded")
            .sort(
              (a, b) =>
                new Date(b.lastActionDate) -
                new Date(a.lastActionDate)
            )
        );

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
    fetchNewData();
    setdataStatus("Matured");
    setEmployeeData(
      moreEmpData
        .filter((obj) => obj.Status === "Matured")
        .sort(
          (a, b) =>
            new Date(b.lastActionDate) -
            new Date(a.lastActionDate)
        )
    );

  }, [nowToFetch]);

  const handleFieldChange = (event) => {
    if (
      event.target.value === "Company Incorporation Date  " ||
      event.target.value === "AssignDate"
    ) {
      setSelectedField(event.target.value);
      setVisibility("block");
      setVisibilityOther("none");
      setSubFilterValue("");
      setVisibilityOthernew("none");
    } else if (event.target.value === "Status") {
      setSelectedField(event.target.value);
      setVisibility("none");
      setVisibilityOther("none");
      setSubFilterValue("");
      setVisibilityOthernew("block");
    } else {
      setSelectedField(event.target.value);
      setVisibility("none");
      setVisibilityOther("block");
      setSubFilterValue("");
      setVisibilityOthernew("none");
    }

    //console.log(selectedField);
  };

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    setCurrentPage(0);

    // Check if the dateValue is not an empty string
    if (dateValue) {
      const dateObj = new Date(dateValue);
      const formattedDate = dateObj.toISOString().split("T")[0];
      setSearchText(formattedDate);
    } else {
      // Handle the case when the date is cleared
      setSearchText("");
    }
  };
  const activeStatus = async () => {
    if (data._id && socketID) {
      try {
      
        const id = data._id;
        const response = await axios.put(
          `${secretKey}/online-status/${id}/${socketID}`
        );
        console.log(response.data); // Log response for debugging
        return response.data; // Return response data if needed
      } catch (error) {
        console.error("Error:", error);
        throw error; // Throw error for handling in the caller function
      }
    }
  };

  useEffect(() => {
    if (data.ename) {
      console.log("Employee found");
      fetchNewData();
    } else {
      console.log("No employees found");
    }
  }, [data.ename]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      activeStatus();
    }, 2000);

    return () => {
      clearTimeout(timerId);
    };
  }, [socketID]);

  const fetchRequestDetails = async () => {
    try {
      const response = await axios.get(`${secretKey}/requestgData`);
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
  const [remarksHistory, setRemarksHistory] = useState([]);
  const [filteredRemarks, setFilteredRemarks] = useState([]);
  const fetchRemarksHistory = async () => {
    try {
      const response = await axios.get(`${secretKey}/remarks-history`);
      setRemarksHistory(response.data);
      setFilteredRemarks(response.data.filter((obj) => obj.companyID === cid));

      console.log(response.data);
    } catch (error) {
      console.error("Error fetching remarks history:", error);
    }
  };

  // const [locationAccess, setLocationAccess] = useState(false);
  useEffect(() => {
    fetchProjections();
  }, [data]);

  useEffect(() => {
    fetchRemarksHistory();
    fetchBookingDeleteRequests();
    fetchRequestDetails();
    fetchEditRequests();

    // let watchId;
    // const successCallback = (position) => {
    //   const userLatitude = position.coords.latitude;
    //   const userLongitude = position.coords.longitude;

    //   // console.log("User Location:", userLatitude, userLongitude);
    //   if (
    //     Number(userLatitude.toFixed(3)) === 23.114 &&
    //     Number(userLongitude.toFixed(3)) === 72.541
    //   ) {
    //     setLocationAccess(true);
    //     // console.log("Location accessed")
    //   }
    //   // Now you can send these coordinates to your server for further processing
    // };
    // // console.log(localStorage.getItem("newtoken"), locationAccess);
    if (userId !== localStorage.getItem("userId")) {
      localStorage.removeItem("newtoken");
      window.location.replace("/");
    }
    // const errorCallback = (error) => {
    //   console.error("Geolocation error:", error.message);
    //   setLocationAccess(false);
    //   // Handle the error, e.g., show a message to the user
    // };

    // navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

    // // If you want to watch for continuous updates, you can use navigator.geolocation.watchPosition

    // // Cleanup function to clear the watch if the component unmounts
    // return () => {
    //   navigator.geolocation.clearWatch(watchId);
    // };
  }, []);
  // console.log(locationAccess);

  // console.log(employeeData);

  const filteredData = employeeData.filter((company) => {
    const fieldValue = company[selectedField];

    if (selectedField === "State" && citySearch) {
      // Handle filtering by both State and City
      const stateMatches = fieldValue
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const cityMatches = company.City.toLowerCase().includes(
        citySearch.toLowerCase()
      );
      return stateMatches && cityMatches;
    } else if (selectedField === "Company Incorporation Date  ") {
      // Assuming you have the month value in a variable named `month`
      if (month == 0) {
        return fieldValue.includes(searchText);
      } else if (year == 0) {
        return fieldValue.includes(searchText);
      }
      const selectedDate = new Date(fieldValue);
      const selectedMonth = selectedDate.getMonth() + 1; // Months are 0-indexed
      const selectedYear = selectedDate.getFullYear();

      // Use the provided month variable in the comparison
      return (
        selectedMonth.toString().includes(month) &&
        selectedYear.toString().includes(year)
      );
    } else if (selectedField === "AssignDate") {
      // Assuming you have the month value in a variable named `month`
      return fieldValue.includes(searchText);
    } else if (selectedField === "Status" && searchText === "All") {
      // Display all data when Status is "All"
      return true;
    } else {
      // Your existing filtering logic for other fields
      if (typeof fieldValue === "string") {
        return fieldValue.toLowerCase().includes(searchText.toLowerCase());
      } else if (typeof fieldValue === "number") {
        return fieldValue.toString().includes(searchText);
      } else if (fieldValue instanceof Date) {
        // Handle date fields
        return fieldValue.includes(searchText);
      }

      return false;
    }
  });

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

  //console.log(companyName, companyInco);

  const currentData = filteredData.slice(startIndex, endIndex);

  const handleStatusChange = async (
    employeeId,
    newStatus,
    cname,
    cemail,
    cindate,
    cnum,
    oldStatus
  ) => {
    if (newStatus === "Matured") {
      setCompanyName(cname);
      setCompanyEmail(cemail);
      setCompanyInco(cindate);
      setCompanyId(employeeId);
      setCompanyNumber(cnum);
      setFormOpen(true);
      return true;
    }
    const title = `${data.ename} changed ${cname} status from ${oldStatus} to ${newStatus}`;
    const DT = new Date();
    const date = DT.toLocaleDateString();
    const time = DT.toLocaleTimeString();
    try {
      // Make an API call to update the employee status in the database
      const response = await axios.post(
        `${secretKey}/update-status/${employeeId}`,
        {
          newStatus,
          title,
          date,
          time,
        }
      );

      // Check if the API call was successful
      if (response.status === 200) {
        // Assuming fetchData is a function to fetch updated employee data

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
      const response = await axios.get(`${secretKey}/deleterequestbybde`);
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
    console.log(mainRemarks);
    const companyId = cid;
    console.log("Deleting Remarks with", remarks_id);
    try {
      // Send a delete request to the backend to delete the item with the specified ID
      await axios.delete(`${secretKey}/remarks-history/${remarks_id}`);
      if (mainRemarks) {
        await axios.delete(`${secretKey}/remarks-delete/${companyId}`);
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
    console.log(cid, cstat, changeRemarks);
    const Remarks = changeRemarks;
    if (Remarks === "") {
      Swal.fire({ title: "Empty Remarks!", icon: "warning" });
      return true;
    }
    try {
      // Make an API call to update the employee status in the database
      const response = await axios.post(`${secretKey}/update-remarks/${cid}`, {
        Remarks,
      });
      const response2 = await axios.post(
        `${secretKey}/remarks-history/${cid}`,
        {
          Remarks,
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

  const handleFreezeIndexChange = (e) => {
    setFreezeIndex(Number(e.target.value));
  };

  const getCellStyle = (index) => {
    if (index === freezeIndex) {
      return {
        position: "sticky",
        left: 0,
        zIndex: 1,
        backgroundColor: "#f0f0f0",
      };
    }

    return {};
  };

  function formatDate(inputDate) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(inputDate).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  }

  // Request form for Employees

  const [selectedYear, setSelectedYear] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [numberOfData, setNumberOfData] = useState("");

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

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
          `${secretKey}/requestData`,

          {
            selectedYear,
            companyType,
            numberOfData,
            name,
            cTime,
            cDate,
          }
        );

        console.log("Data sent successfully:", response.data);
        Swal.fire("Request sent!");
        closepopup();
      } catch (error) {
        console.error("Error:", error.message);
        Swal.fire("Please try again later!");
      }
    } else {
      try {
        // Make API call using Axios
        const response = await axios.post(`${secretKey}/requestgData`, {
          numberOfData,
          name,
          cTime,
          cDate,
        });

        console.log("Data sent successfully:", response.data);
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

  const handleSubmitData = (e) => {
    e.preventDefault();

    if (cname === "") {
      Swal.fire("Please Enter Company Name");
    } else if (!cnumber) {
      Swal.fire("Company Number is required");
    } else if (cemail === "") {
      Swal.fire("Company Email is required");
    } else if (city === "") {
      Swal.fire("City is required");
    } else if (state === "") {
      Swal.fire("State is required");
    } else {
      axios
        .post(`${secretKey}/manual`, {
          "Company Name": cname,
          "Company Number": cnumber,
          "Company Email": cemail,
          "Company Incorporation Date": cidate, // Assuming the correct key is "Company Incorporation Date"
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
        })
        .then((response) => {
          console.log("response", response);
          console.log("Data sent Successfully");
          Swal.fire({
            title: "Data Added!",
            text: "Successfully added new Data!",
            icon: "success",
          });
          fetchNewData();
          closepopupNew();
        })
        .catch((error) => {
          console.error("Error sending data:", error);
          Swal.fire("An error occurred. Please try again later.");
        });
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

        const response = await fetch(`${secretKey}/deleterequestbybde`, {
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
        console.log(responseData.message); // Log the response message
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

  console.log("csv", csvdata);
  const handleUploadData = async (e) => {
    const name = data.ename;
    const updatedCsvdata = csvdata.map((data) => ({
      ...data,
      ename: name,
    }));
    console.log("updatedcsv", updatedCsvdata);

    if (updatedCsvdata.length !== 0) {
      // Move setLoading outside of the loop

      try {
        await axios.post(`${secretKey}/requestCompanyData`, updatedCsvdata);
        console.log("Data sent successfully");
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
      const response = await axios.get(`${secretKey}/requestCompanyData`);
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
      console.log(maturedID);
      const response = await axios.get(
        `${secretKey}/redesigned-final-leadData`
      );
      const data = response.data.find((obj) => obj.company === maturedID);
      console.log(data);
      setCurrentForm(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  useEffect(() => {
    console.log("Matured ID Changed", maturedID);
    if (maturedID) {
      fetchRedesignedFormData();
    }
  }, [maturedID]);

  console.log("Current Form:", currentForm);
  const formatDateAndTime = (AssignDate) => {
    // Convert AssignDate to a Date object
    const date = new Date(AssignDate);

    // Convert UTC date to Indian time zone
    const options = { timeZone: "Asia/Kolkata" };
    const indianDate = date.toLocaleString("en-IN", options);
    return indianDate;
  };
  useEffect(() => {
    const employeeName = data.ename;
    if (employeeName) {
      const fetchCompanies = async () => {
        try {
          const response = await fetch(`${secretKey}/companies`);
          const data = await response.json();

          // Filter and format the data based on employeeName
          const formattedData = data.companies
            .filter(
              (entry) =>
                entry.bdeName === employeeName || entry.bdmName === employeeName
            )
            .map((entry) => ({
              "Company Name": entry.companyName,
              "Company Number": entry.contactNumber,
              "Company Email": entry.companyEmail,
              "Company Incorporation Date": entry.incoDate,
              City: "NA",
              State: "NA",
              ename: employeeName,
              AssignDate: entry.bookingDate,
              Status: "Matured",
              Remarks: "No Remarks Added",
            }));

          setCompanies(formattedData);
        } catch (error) {
          console.error("Error fetching companies:", error);
          setCompanies([]);
        }
      };

      fetchCompanies();
    }
  }, [data]);

  console.log(companies);

  // const handleProjectionSubmit = async () => {
  //   try {

  //     const finalData = {
  //       ...currentProjection,
  //       companyName: projectingCompany,
  //       ename: data.ename,
  //       offeredServices: selectedValues,
  //     };
  //     if (finalData.offeredServices.length === 0) {
  //       Swal.fire({ title: 'Services is required!', icon: 'warning' });
  //     } else if (finalData.remarks === "") {
  //       Swal.fire({ title: 'Remarks is required!', icon: 'warning' });
  //     } else if (finalData.totalPayment === 0) {
  //       Swal.fire({ title: 'Payment is required!', icon: 'warning' });
  //     }
  //     else if (finalData.offeredPrize === 0) {
  //       Swal.fire({ title: 'Offered Prize is required!', icon: 'warning' });
  //     }
  //     else if (finalData.lastFollowUpdate === null) {
  //       Swal.fire({ title: 'Last FollowUp Date is required!', icon: 'warning' });
  //     }
  //     else if (finalData.estPaymentDate === 0) {
  //       Swal.fire({ title: 'Estimated Payment Date is required!', icon: 'warning' });
  //     }
  //     // Send data to backend API
  //     const response = await axios.post(
  //       `${secretKey}/update-followup`,
  //       finalData
  //     );
  //     Swal.fire({ title: "Projection Submitted!", icon: "success" });
  //     setOpenProjection(false);
  //     setCurrentProjection({
  //       companyName: "",
  //       ename: "",
  //       offeredPrize: 0,
  //       offeredServices: [],
  //       lastFollowUpdate: "",
  //       remarks: "",
  //       date: "",
  //       time: "",
  //       editCount:
  //     });
  //     fetchProjections();
  //     setSelectedValues([])

  //     // Log success message
  //   } catch (error) {
  //     console.error("Error updating or adding data:", error.message);
  //   }
  // };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleIconButtonClick = (comName) => {
    setProjectingCompany(comName);
    setIsDrawerOpen(true);
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
    setIsDrawerOpen(true);
  };

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
          `${secretKey}/update-followup`,
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
      await axios.post(`${secretKey}/setMarktrue/${id}`);

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

  // const handleYearFilterChange = (e, selectedYear) => {
  //   const isChecked = e.target.checked;

  //   // Filter the employeeData based on the selected year
  //   if (isChecked) {
  //     const filteredData = employeeData.filter((data) => {
  //       const year = new Date(
  //         data["Company Incorporation Date  "]
  //       ).getFullYear();
  //       return year.toString() === selectedYear.toString();
  //     });
  //     setEmployeeData(filteredData);
  //     console.log("Filtered Year data", filteredData);
  //   } else {
  //     // If the checkbox is unchecked, reset the filter
  //     // You can implement this according to your requirements
  //     // For example, if you want to reset to the original data, you can fetch it again from the server
  //     // setEmployeeData(originalEmployeeData);
  //   }
  // };
  // const handleMonthFilterChange = () => {
  //   console.log("Month is filtering");
  // };

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

  // Handle month checkbox change
  const handleMonthFilterChange = (e, selectedYear, selectedMonth) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedMonths([...selectedMonths, selectedMonth]);
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
      const filteredData = newEmpData.filter((data) => {
        const year = new Date(data["Company Incorporation Date  "])
          .getFullYear()
          .toString();
        const month = new Date(
          data["Company Incorporation Date  "]
        ).toLocaleString("default", { month: "short" });
        console.log("Year :", year, selectedYear.toString());
        console.log("Month :", month, selectedMonth.toString());
        return (
          year === selectedYear.toString() && month === selectedMonth.toString()
        );
      });
      setEmployeeData(filteredData);
    } else {
      setSelectedMonths(
        selectedMonths.filter((month) => month !== selectedMonth)
      );
      const filteredData = employeeData.filter((data) => {
        const year = new Date(data["Company Incorporation Date  "])
          .getFullYear()
          .toString();
        const month = new Date(
          data["Company Incorporation Date  "]
        ).toLocaleString("default", { month: "short" });

        return (
          year !== selectedYear.toString() || month !== selectedMonth.toString()
        );
      });
      setEmployeeData(filteredData);
    }
  };


  console.log("filtetredremarks", filteredRemarks)

  // -----------------------------------------------------delete-projection-data-------------------------------

  const handleDelete = async (company) => {
    const companyName = company;
    console.log(companyName);

    try {
      // Send a DELETE request to the backend API endpoint
      const response = await axios.delete(
        `${secretKey}/delete-followup/${companyName}`
      );
      console.log(response.data.message); // Log the response message
      // Show a success message after successful deletion
      console.log("Deleted!", "Your data has been deleted.", "success");
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
  //console.log("projections", currentProjection);

  const handleSendEmail = async () => {
    try {
      const response = await fetch(`${secretKey}/generate-pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/pdf",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }
      console.log("Mail Sent");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const formatDatePro = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };


  // ------------------------------------------------------payment-link-work-----------------------------------------

  const [paymentLink, setPaymentLink] = useState("");
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");

  // let cashfree;

  // let insitialzeSDK = async function () {

  //   cashfree = await load({
  //     mode: "sandbox",
  //   })
  // }

  // insitialzeSDK()

  // //let version = cashfree.version();

  // const getSessionId = async () => {
  //   try {
  //     let res = await axios.get(`${secretKey}/payment`)
  //     console.log(res.data)
  //     if (res.data && res.data.payment_session_id) {
  //       console.log(res.data)
  //       setOrderId(res.data.order_id)
  //       return res.data.payment_session_id
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // const verifyPayment = async () => {
  //   try {

  //     let res = await axios.post(`${secretKey}/verify`, {
  //       orderId: orderId
  //     })

  //     if (res && res.data) {
  //       alert("payment verified")
  //     }

  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  // const handlePayment = async (e) => {
  //   e.preventDefault()
  //   try {

  //     let sessionId = await getSessionId()
  //     let checkoutOptions = {
  //       paymentSessionId: sessionId,
  //       redirectTarget: "_modal",
  //     }

  //     cashfree.checkout(checkoutOptions).then((res) => {
  //       console.log("payment initialized")

  //       verifyPayment(orderId)
  //     })

  //   } catch (error) {
  //     console.log(error)
  //   }

  // }

  // const generatePaymentLink = async () => {
  //   try {
  //     const response = await axios.post(`${secretKey}/generatePaymentLink`, {
  //       orderId: '121',
  //       amount: 100, // Amount in INR
  //       customerName: 'John Doe',
  //       customerEmail: 'john@example.com',
  //       customerPhone: '9876543210',
  //     });
  //     console.log(response.data.paymentLink)
  //     setPaymentLink(response.data.paymentLink);
  //   } catch (error) {
  //     setError('Could not generate payment link');
  //   }
  // };

  // console.log(paymentLink)

  // ---------------------------------------------- For Editable Lead-form -----------------------------------------------------------
  const handleEditClick = async (company) => {
    try {
      const response = await axios.get(
        `${secretKey}/redesigned-final-leadData`
      );
      const data = response.data.find((obj) => obj.company === company);
      setCurrentForm(data);
      if (data.moreBookings.length !== 0) {
        setOpenBooking(true);
      } else {
        setEditFormOpen(true)
      }

    } catch (error) {
      console.error("Error fetching data:", error.message);
    }

  };

  const handleOpenEditForm = () => {
    setOpenBooking(false);
    setEditMoreOpen(true);
  }



  // --------------------------------------forward to bdm function---------------------------------------------\

  const [forwardedCompany, setForwardedCompany] = useState("")
  const [bdmNewAcceptStatus, setBdmNewAcceptStatus] = useState("")
  const [forwardCompanyId, setforwardCompanyId] = useState("")

  // const handleConfirmAssign = (companyId, companyName, companyStatus, ename, bdmAcceptStatus) => {
  //   console.log(companyName, companyStatus, ename, bdmAcceptStatus, companyId);

  //   if (companyStatus === "Interested" || companyStatus === "FollowUp") {
  //     Swal.fire({
  //       title: 'Are you sure?',
  //       text: `Do You Want to Forward this to ${bdmName}`, // Assuming `bdmName` is defined somewhere
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonColor: '#3085d6',
  //       cancelButtonColor: '#d33',
  //       confirmButtonText: 'Yes, proceed!'
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         console.log("Confirmed");
  //         setForrwardEname(ename)
  //         setForrwardStatus(companyStatus)
  //         setBdmNewAcceptStatus("Pending")
  //         setforwardCompanyId(companyId)
  //         setForwardedCompany(companyName)
  //         handleForwardBdm();
  //         // Perform the action here
  //       }
  //     });
  //   } else {
  //     alert("there is a error")
  //   }
  // };


  // // const handleForwardBdm = async() => {
  // //   const selectedData = currentData.filter((company) => company["Company Name"] === forwardedCompany);
  // //   console.log("selectedData", selectedData);
  // //     try {
  // //       const response = await axios.post(`${secretKey}/forwardtobdmdata`, selectedData);
  // //         console.log("response" , response.data)
  // //         Swal.fire("Data Assigned");
  // //       //openchangeEmp(false);
  // //       fetchNewData();

  // //     } catch(error){
  // //       console.log(error)
  // //       Swal.fire("Error Assigning Data");
  // //       fetchNewData()
  // //     }
  // // };

  // console.log(forwardedCompany, 'hayhsjshshsh')


  // const handleForwardBdm = async () => {
  //   console.log("selectedData", currentData, forwardedCompany);
  //   const selectedDataWithBdm = currentData.filter((company) => company["Company Name"] === forwardedCompany);
  //   try {
  //     const response = await axios.post(`${secretKey}/forwardtobdmdata`, {
  //       selectedData: selectedDataWithBdm,
  //       bdmName: bdmName,
  //       companyId: forwardCompanyId,
  //       bdmAcceptStatus: bdmNewAcceptStatus // Assuming bdmName is defined elsewhere in your component
  //     });
  //     console.log("response", response.data);
  //     Swal.fire("Data Forwarded");
  //     fetchNewData();
  //   } catch (error) {
  //     console.log(error);
  //     Swal.fire("Error Assigning Data");
  //     fetchNewData();
  //   }
  // };
  // const handleConfirmAssign = (companyId, companyName, companyStatus, ename, bdmAcceptStatus) => {
  //   console.log(companyName, companyStatus, ename, bdmAcceptStatus, companyId);

  //   if (companyStatus === "Interested" || companyStatus === "FollowUp" && bdmName) {
  //     Swal.fire({
  //       title: 'Are you sure?',
  //       text: `Do You Want to Forward this to ${bdmName}`, // Assuming `bdmName` is defined somewhere
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonColor: '#3085d6',
  //       cancelButtonColor: '#d33',
  //       confirmButtonText: 'Yes, proceed!'
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         console.log("Confirmed");
  //         setForrwardEname(ename)
  //         setForrwardStatus(companyStatus)
  //         setBdmNewAcceptStatus("Pending")
  //         setforwardCompanyId(companyId)
  //         setForwardedCompany(companyName)
  //         setConfirmationPending(true); // Set confirmation pending
  //       }
  //     });
  //   } else {
  //     Swal.fire("Your are not assigned to any bdm!")
  //   }
  // };


  const [confirmationPending, setConfirmationPending] = useState(false);

  const handleConfirmAssign = (companyId, companyName, companyStatus, ename, bdmAcceptStatus) => {
    console.log(companyName, companyStatus, ename, bdmAcceptStatus, companyId);

    if (companyStatus === "Interested" || companyStatus === "FollowUp" && bdmName) {
      // Assuming `bdmName` is defined somewhere
      setForrwardEname(ename);
      setForrwardStatus(companyStatus);
      setBdmNewAcceptStatus("Pending");
      setforwardCompanyId(companyId);
      setForwardedCompany(companyName);
      setConfirmationPending(true); // Set confirmation pending
    } else {
      Swal.fire("Your are not assigned to any bdm!");
    }
  };


  useEffect(() => {
    if (confirmationPending) {
      handleForwardBdm();
      setConfirmationPending(false); // Reset confirmation status
    }
  }, [confirmationPending]);

  const handleForwardBdm = async () => {
    //console.log("selectedData", currentData, forwardedCompany);
    const selectedDataWithBdm = currentData.filter((company) => company["Company Name"] === forwardedCompany);
    try {
      const response = await axios.post(`${secretKey}/forwardtobdmdata`, {
        selectedData: selectedDataWithBdm,
        bdmName: bdmName,
        companyId: forwardCompanyId,
        bdmAcceptStatus: bdmNewAcceptStatus,
        bdeForwardDate: Date.now() // Assuming bdmName is defined elsewhere in your component
      });

      //console.log("response", response.data);
      Swal.fire("Data Forwarded");
      fetchNewData("Forwarded");
      setdataStatus("Forwarded")
      setEmployeeData(
        moreEmpData
          .filter((obj) => obj.bdmAcceptStatus !== "NotForwarded")
          .sort(
            (a, b) =>
              new Date(b.lastActionDate) -
              new Date(a.lastActionDate)
          )
      );

    } catch (error) {
      console.log(error);
      Swal.fire("Error Assigning Data");

    }
  };

  console.log("datastatus", dataStatus)


  const handleReverseAssign = async (companyId, companyName, bdmAcceptStatus , empStatus) => {
    if (bdmAcceptStatus === "Pending") {
      try {
        const response = await axios.post(`${secretKey}/teamleads-reversedata/${companyId}`, {
          companyName,
          bdmAcceptStatus: "NotForwarded", // Corrected parameter name
        });
        // console.log("response", response.data);
        Swal.fire("Data Reversed");
        fetchNewData(empStatus);
        setdataStatus(empStatus)
        setEmployeeData(
          moreEmpData
            .filter((obj) => obj.Status !== empStatus)
            .sort(
              (a, b) =>
                new Date(b.lastActionDate) -
                new Date(a.lastActionDate)
            )
        );
      } catch (error) {
        console.log("error reversing bdm forwarded data", error.message);
      }
    } else if (bdmAcceptStatus === "NotForwarded") {
      Swal.fire("Cannot Reforward Data")
    } else if (bdmAcceptStatus === "Accept") {
      Swal.fire("BDM already accepted this data!")
    }
  };







  return (
    <div>
      <Header name={data.ename} designation={data.designation} />
      <EmpNav userId={userId} />
      {/* Dialog box for Request Data */}

      {!formOpen && !editFormOpen && !addFormOpen && !editMoreOpen && (
        <>
          <div className="page-wrapper">
            <div className="page-header d-print-none">
              <div className="container-xl">
                {requestData !== null && requestData !== undefined && (
                  <div className="notification-bar">
                    <div className="noti-text">
                      <h1>
                        You have just received {requestData.dAmount} data!
                      </h1>
                    </div>
                    <div className="close-icon">
                      <IconButton onClick={handleMarktrue}>
                        <CloseIcon />
                      </IconButton>
                    </div>
                  </div>
                )}
                <div className="row g-2 align-items-center">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                    className="features"
                  >
                    <div style={{ display: "flex" }} className="feature1">
                      {/* <button className="btn btn-primary" onClick={handleGoogleLogin} >
                        Gmail SignIn
                    </button>
                    <Dialog open={openLogin} onClose={()=>setOpenLogin(false)} >
                      <DialogTitle>
                      <h1>Login Page</h1>
                      </DialogTitle>
                      <DialogContent>
                      <div className="sign-in-google">

                           <p>Please sign in with your Google account.</p>
                          <button onClick={handleGoogleLogin} >Sign in with Google</button>
                               </div>
                      </DialogContent>

                    </Dialog> */}

                      <div
                        className="form-control"
                        style={{ height: "fit-content", width: "auto" }}
                      >
                        <select
                          style={{
                            border: "none",
                            outline: "none",
                            width: "fit-content",
                          }}
                          value={selectedField}
                          onChange={handleFieldChange}
                        >
                          <option value="Company Name">Company Name</option>
                          <option value="Company Number">Company Number</option>
                          <option value="Company Email">Company Email</option>
                          <option value="Company Incorporation Date  ">
                            Company Incorporation Date
                          </option>
                          <option value="City">City</option>
                          <option value="State">State</option>
                          <option value="Status">Status</option>
                          <option value="AssignDate">Assigned Date</option>
                        </select>
                      </div>
                      {visibility === "block" && (
                        <div>
                          <input
                            onChange={handleDateChange}
                            style={{
                              display: visibility,
                              width: "83%",
                              marginLeft: "10px",
                            }}
                            type="date"
                            className="form-control"
                          />
                        </div>
                      )}

                      {visibilityOther === "block" ? (
                        <div
                          style={{
                            //width: "20vw",
                            margin: "0px 0px 0px 9px",
                            display: visibilityOther,
                          }}
                          className="input-icon"
                        >
                          <span className="input-icon-addon">
                            {/* <!-- Download SVG icon from http://tabler-icons.io/i/search --> */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="icon"
                              width="20"
                              height="24"
                              viewBox="0 0 24 24"
                              stroke-width="2"
                              stroke="currentColor"
                              fill="none"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                              <path d="M21 21l-6 -6" />
                            </svg>
                          </span>
                          <input
                            type="text"
                            value={searchText}
                            onChange={(e) => {
                              setSearchText(e.target.value);
                              setCurrentPage(0);
                            }}
                            className="form-control"
                            placeholder="Search…"
                            aria-label="Search in website"
                            style={{ width: "60%" }}
                          />
                        </div>
                      ) : (
                        <div></div>
                      )}
                      {visibilityOthernew === "block" ? (
                        <div
                          style={{
                            //width: "20vw",
                            margin: "0px 0px 0px 9px",
                            display: visibilityOthernew,
                          }}
                          className="input-icon"
                        >
                          <select
                            value={searchText}
                            onChange={(e) => {
                              setSearchText(e.target.value);
                              // Set dataStatus based on selected option
                              if (
                                e.target.value === "All" ||
                                e.target.value === "Busy" ||
                                e.target.value === "Not Picked Up"
                              ) {
                                setdataStatus("All");
                                setEmployeeData(
                                  moreEmpData.filter(
                                    (obj) =>
                                      obj.Status === "Busy" ||
                                      obj.Status === "Not Picked Up" ||
                                      obj.Status === "Untouched"
                                  )
                                );
                              } else if (
                                e.target.value === "Junk" ||
                                e.target.value === "Not Interested"
                              ) {
                                setdataStatus("NotInterested");
                                setEmployeeData(
                                  moreEmpData.filter(
                                    (obj) =>
                                      obj.Status === "Not Interested" ||
                                      obj.Status === "Junk"
                                  )
                                );
                              } else if (e.target.value === "Interested") {
                                setdataStatus("Interested");
                                setEmployeeData(
                                  moreEmpData.filter(
                                    (obj) => obj.Status === "Interested"
                                  )
                                );
                              } else if (e.target.value === "Untouched") {
                                setdataStatus("All");
                                setEmployeeData(
                                  moreEmpData.filter(
                                    (obj) => obj.Status === "Untouched"
                                  )
                                );
                              }
                            }}
                            className="form-select"
                          >
                            <option value="All">All </option>
                            <option value="Busy">Busy </option>
                            <option value="Not Picked Up">
                              Not Picked Up{" "}
                            </option>
                            <option value="Junk">Junk</option>
                            <option value="Interested">Interested</option>
                            <option value="Not Interested">
                              Not Interested
                            </option>
                            <option value="Untouched">Untouched</option>
                          </select>
                        </div>
                      ) : (
                        <div></div>
                      )}
                      {searchText !== "" && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "end",
                            fontsize: "10px",
                            fontfamily: "Poppins",
                            //marginLeft: "-70px"
                          }}
                          className="results"
                        >
                          {filteredData.length} results found
                        </div>
                      )}
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center" }}
                      className="feature2"
                    >
                      <div
                        className="form-control mr-1 sort-by"
                        style={{ width: "190px" }}
                      >
                        <label htmlFor="sort-by">Sort By:</label>
                        <select
                          style={{
                            border: "none",
                            outline: "none",
                            color: "#666a66",
                          }}
                          name="sort-by"
                          id="sort-by"
                          onChange={(e) => {
                            setSortStatus(e.target.value);
                            const selectedOption = e.target.value;

                            switch (selectedOption) {
                              case "Busy":
                              case "Untouched":
                              case "Not Picked Up":
                                setdataStatus("All");
                                setEmployeeData(
                                  moreEmpData
                                    .filter((data) =>
                                      [
                                        "Busy",
                                        "Untouched",
                                        "Not Picked Up",
                                      ].includes(data.Status)
                                    )
                                    .sort((a, b) => {
                                      if (a.Status === selectedOption)
                                        return -1;
                                      if (b.Status === selectedOption) return 1;
                                      return 0;
                                    })
                                );
                                break;
                              case "Interested":
                                setdataStatus("Interested");
                                setEmployeeData(
                                  moreEmpData
                                    .filter(
                                      (data) => data.Status === "Interested"
                                    )
                                    .sort((a, b) =>
                                      a.AssignDate.localeCompare(b.AssignDate)
                                    )
                                );
                                break;
                              case "Not Interested":
                                setdataStatus("NotInterested");
                                setEmployeeData(
                                  moreEmpData
                                    .filter((data) =>
                                      ["Not Interested", "Junk"].includes(
                                        data.Status
                                      )
                                    )
                                    .sort((a, b) =>
                                      a.AssignDate.localeCompare(b.AssignDate)
                                    )
                                );
                                break;
                              case "FollowUp":
                                setdataStatus("FollowUp");
                                setEmployeeData(
                                  moreEmpData
                                    .filter(
                                      (data) => data.Status === "FollowUp"
                                    )
                                    .sort((a, b) =>
                                      a.AssignDate.localeCompare(b.AssignDate)
                                    )
                                );
                                break;

                              default:
                                // No filtering if default option selected
                                setdataStatus("All");
                                setEmployeeData(
                                  moreEmpData.sort((a, b) => {
                                    if (a.Status === selectedOption) return -1;
                                    if (b.Status === selectedOption) return 1;
                                    return 0;
                                  })
                                );
                                break;
                            }
                          }}
                        >
                          <option value="" disabled selected>
                            Select Status
                          </option>
                          <option value="Untouched">Untouched</option>
                          <option value="Busy">Busy</option>
                          <option value="Not Picked Up">Not Picked Up</option>
                          <option value="FollowUp">Follow Up</option>
                          <option value="Interested">Interested</option>
                          <option value="Not Interested">Not Interested</option>
                        </select>
                      </div>

                      {selectedField === "State" && (
                        <div style={{ width: "15vw" }} className="input-icon">
                          <span className="input-icon-addon">
                            {/* <!-- Download SVG icon from http://tabler-icons.io/i/search --> */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="icon"
                              width="20"
                              height="24"
                              viewBox="0 0 24 24"
                              stroke-width="2"
                              stroke="currentColor"
                              fill="none"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                              <path d="M21 21l-6 -6" />
                            </svg>
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            value={citySearch}
                            onChange={(e) => {
                              setcitySearch(e.target.value);
                              setCurrentPage(0);
                            }}
                            placeholder="Search City"
                            aria-label="Search in website"
                          />
                        </div>
                      )}
                      {selectedField === "Company Incorporation Date  " && (
                        <>
                          <div
                            style={{ width: "fit-content" }}
                            className="form-control"
                          >
                            <select
                              style={{
                                border: "none",
                                outline: "none",
                                marginRight: "10px",
                                width: "115px",
                                paddingLeft: "10px",
                              }}
                              onChange={(e) => {
                                setMonth(e.target.value);
                                setCurrentPage(0);
                              }}
                            >
                              <option value="" disabled selected>
                                Select Month
                              </option>
                              <option value="12">December</option>
                              <option value="11">November</option>
                              <option value="10">October</option>
                              <option value="9">September</option>
                              <option value="8">August</option>
                              <option value="7">July</option>
                              <option value="6">June</option>
                              <option value="5">May</option>
                              <option value="4">April</option>
                              <option value="3">March</option>
                              <option value="2">February</option>
                              <option value="1">January</option>
                            </select>
                          </div>
                          <div
                            className="input-icon  form-control"
                            style={{ margin: "0px 10px", width: "110px" }}
                          >
                            {/* <input
                            type="number"
                            value={year}
                            defaultValue="Select Year"
                            className="form-control"
                            placeholder="Select Year.."
                            onChange={(e) => {
                              setYear(e.target.value);
                            }}
                            aria-label="Search in website"
                          /> */}
                            <select
                              select
                              style={{ border: "none", outline: "none" }}
                              value={year}
                              onChange={(e) => {
                                setYear(e.target.value);
                                setCurrentPage(0); // Reset page when year changes
                              }}
                            >
                              <option value="">Select Year</option>
                              {[...Array(15)].map((_, index) => {
                                const yearValue = 2024 - index;
                                return (
                                  <option key={yearValue} value={yearValue}>
                                    {yearValue}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </>
                      )}

                      <div className="request" style={{ marginRight: "15px" }}>
                        <div className="btn-list">
                          <button
                            onClick={functionopenpopup}
                            className="btn btn-primary d-none d-sm-inline-block"
                          >
                            Request Data
                          </button>
                          <a
                            href="#"
                            className="btn btn-primary d-sm-none btn-icon"
                            data-bs-toggle="modal"
                            data-bs-target="#modal-report"
                            aria-label="Create new report"
                          >
                            {/* <!-- Download SVG icon from http://tabler-icons.io/i/plus --> */}
                          </a>
                        </div>
                      </div>
                      <div className="request" style={{ marginRight: "15px" }}>
                        <div className="btn-list">
                          <button
                            onClick={functionopenpopupNew}
                            className="btn btn-primary d-none d-sm-inline-block"
                          >
                            ADD Leads
                          </button>
                          <a
                            href="#"
                            className="btn btn-primary d-sm-none btn-icon"
                            data-bs-toggle="modal"
                            data-bs-target="#modal-report"
                            aria-label="Create new report"
                          >
                            {/* <!-- Download SVG icon from http://tabler-icons.io/i/plus --> */}
                          </a>
                        </div>
                      </div>
                      <div className="importCSV request">
                        <div className="btn-list">
                          <button
                            className="btn btn-primary d-none d-sm-inline-block"
                            onClick={functionopenpopupCSV}
                          >
                            {/* <!-- Download SVG icon from http://tabler-icons.io/i/plus --> */}
                            <svg
                              style={{
                                verticalAlign: "middle",
                              }}
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
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <path d="M12 5l0 14" />
                              <path d="M5 12l14 0" />
                            </svg>
                            Import CSV
                          </button>
                          <a
                            href="#"
                            className="btn btn-primary d-sm-none btn-icon"
                            data-bs-toggle="modal"
                            data-bs-target="#modal-report"
                            aria-label="Create new report"
                          >
                            {/* <!-- Download SVG icon from http://tabler-icons.io/i/plus --> */}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <!-- Page title actions --> */}
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
                          setEmployeeData(
                            moreEmpData.filter(
                              (obj) =>
                                obj.Status === "Busy" ||
                                obj.Status === "Not Picked Up" ||
                                obj.Status === "Untouched"
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
                            moreEmpData.filter(
                              (obj) =>
                                obj.Status === "Busy" ||
                                obj.Status === "Not Picked Up" ||
                                obj.Status === "Untouched"
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
                          setEmployeeData(
                            moreEmpData.filter(
                              (obj) => obj.Status === "Interested" && obj.bdmAcceptStatus === "NotForwarded"
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
                            moreEmpData.filter(
                              (obj) => obj.Status === "Interested" && obj.bdmAcceptStatus === "NotForwarded"
                            ).length
                          }
                        </span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a
                        href="#tabs-activity-5"
                        onClick={() => {
                          setdataStatus("FollowUp");
                          setCurrentPage(0);
                          setEmployeeData(
                            moreEmpData.filter(
                              (obj) => obj.Status === "FollowUp" && obj.bdmAcceptStatus === "NotForwarded"
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
                            moreEmpData.filter(
                              (obj) => obj.Status === "FollowUp" && obj.bdmAcceptStatus === "NotForwarded"
                            ).length
                          }
                        </span>
                      </a>
                    </li>

                    <li class="nav-item">
                      <a
                        href="#tabs-activity-5"
                        onClick={() => {
                          setdataStatus("Matured");
                          setCurrentPage(0);
                          setEmployeeData(
                            moreEmpData
                              .filter((obj) => obj.Status === "Matured" && obj.bdmAcceptStatus === "NotForwarded")
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
                            moreEmpData.filter(
                              (obj) => obj.Status === "Matured" && obj.bdmAcceptStatus === "NotForwarded"
                            ).length
                          }
                        </span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a
                        href="#tabs-activity-5"
                        onClick={() => {
                          setdataStatus("Forwarded")
                          setCurrentPage(0);
                          setEmployeeData(
                            moreEmpData
                              .filter((obj) => obj.bdmAcceptStatus !== "NotForwarded")
                              .sort(
                                (a, b) =>
                                  new Date(b.lastActionDate) -
                                  new Date(a.lastActionDate)
                              )

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
                            moreEmpData.filter(
                              (obj) => obj.bdmAcceptStatus !== "NotForwarded"
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
                          setEmployeeData(
                            moreEmpData.filter(
                              (obj) =>
                                obj.Status === "Not Interested" ||
                                obj.Status === "Junk"
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
                            moreEmpData.filter(
                              (obj) =>
                                (obj.Status === "Not Interested" ||
                                  obj.Status === "Junk") && (obj.bdmAcceptStatus === "NotForwarded")
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
                            <th>Status</th>
                            <th>Remarks</th>

                            <th>
                              Incorporation Date
                              <FilterListIcon
                                style={{
                                  height: "15px",
                                  width: "15px",
                                  cursor: "pointer",
                                  marginLeft: "4px",
                                }}
                                // onClick={() => {
                                //   setEmployeeData(
                                //     [...moreEmpData].sort((a, b) =>
                                //       b[
                                //         "Company Incorporation Date  "
                                //       ].localeCompare(
                                //         a["Company Incorporation Date  "]
                                //       )
                                //     )
                                //   );
                                // }}
                                onClick={handleFilterIncoDate}
                              />
                              {openIncoDate && (
                                <div className="inco-filter">
                                  <div
                                    className="inco-subFilter"
                                    onClick={(e) => handleSort("oldest")}
                                  >
                                    <SwapVertIcon style={{ height: "16px" }} />
                                    Oldest
                                  </div>

                                  <div
                                    className="inco-subFilter"
                                    onClick={(e) => handleSort("newest")}
                                  >
                                    <SwapVertIcon style={{ height: "16px" }} />
                                    Newest
                                  </div>

                                  <div
                                    style={{ marginLeft: "5px" }}
                                    className="inco-subFilter d-flex"
                                  >
                                    <div style={{ marginRight: "5px" }}>
                                      <input
                                        type="checkbox"
                                        name="year-filter"
                                        id={`year-filter-all`}
                                        checked={selectAllChecked}
                                        onChange={(e) =>
                                          handleSelectAllChange(e)
                                        }
                                      />
                                    </div>
                                    <div className="year-val">Select All</div>
                                  </div>

                                  {resultArray.length !== 0 &&
                                    resultArray.map((obj) => (
                                      <div key={obj.year}>
                                        <div
                                          style={{ marginLeft: "5px" }}
                                          className="inco-subFilter d-flex"
                                        >
                                          <div style={{ marginRight: "5px" }}>
                                            <input
                                              type="checkbox"
                                              name="year-filter"
                                              id={`year-filter-${obj.year}`}
                                              checked={selectedYears.includes(
                                                obj.year
                                              )}
                                              onChange={(e) =>
                                                handleYearFilterChange(
                                                  e,
                                                  obj.year
                                                )
                                              }
                                            />
                                          </div>
                                          <div className="year-val">
                                            {obj.year}
                                          </div>
                                          {expandYear !== obj.year && (
                                            <div
                                              className="expand-year d-flex"
                                              onClick={() => {
                                                setExpandYear(obj.year);
                                              }}
                                            >
                                              <AddCircle
                                                style={{ height: "15px" }}
                                              />
                                            </div>
                                          )}
                                          {expandYear === obj.year && (
                                            <div
                                              className="expand-year d-flex"
                                              onClick={() => {
                                                setExpandYear(0);
                                              }}
                                            >
                                              <RemoveCircleIcon
                                                style={{ height: "15px" }}
                                              />
                                            </div>
                                          )}
                                        </div>
                                        {obj.month.length !== 0 &&
                                          expandYear === obj.year &&
                                          obj.month.map((month) => (
                                            <div
                                              key={`${obj.year}-${month}`}
                                              style={{ marginLeft: "25px" }}
                                              className="inco-subFilter d-flex"
                                            >
                                              <div
                                                style={{ marginRight: "5px" }}
                                              >
                                                <input
                                                  type="checkbox"
                                                  name="month-filter"
                                                  id={`month-filter-${month}`}
                                                  checked={selectedMonths.includes(
                                                    month
                                                  )}
                                                  onChange={(e) =>
                                                    handleMonthFilterChange(
                                                      e,
                                                      obj.year,
                                                      month
                                                    )
                                                  }
                                                />
                                              </div>
                                              <div className="month-val">
                                                {month}
                                              </div>
                                            </div>
                                          ))}
                                      </div>
                                    ))}

                                  <div
                                    className="inco-subFilter"
                                    onClick={(e) => handleSort("none")}
                                  >
                                    <SwapVertIcon style={{ height: "16px" }} />
                                    None
                                  </div>
                                </div>
                              )}
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

                            {(dataStatus === "Matured" && <th>Action</th>) ||
                              (dataStatus === "FollowUp" && (
                                <th>Add Projection</th>
                              )) ||
                              (dataStatus === "Interested" && (
                                <th>Add Projection</th>
                              ))}

                            {(dataStatus === "Forwarded" || dataStatus === "Interested" || dataStatus === "FollowUp") && (
                              <th>Forward to BDM</th>
                            )}
                          </tr>
                        </thead>
                        {loading ? (
                          <tbody>
                            <tr>
                              <td colSpan="11" className="LoaderTDSatyle">
                                <ClipLoader
                                  color="lightgrey"
                                  loading
                                  size={30}
                                  aria-label="Loading Spinner"
                                  data-testid="loader"
                                />
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
                                <td className="td-sticky">
                                  {startIndex + index + 1}
                                </td>
                                <td className="td-sticky1">
                                  {company["Company Name"]}
                                </td>
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
                                  {company["Status"] === "Matured" ? (
                                    <span>{company["Status"]}</span>
                                  ) : (
                                    <>
                                      {company.bdmAcceptStatus === "NotForwarded" && (
                                        <select
                                          style={{
                                            background: "none",
                                            padding: ".4375rem .75rem",
                                            border: "1px solid var(--tblr-border-color)",
                                            borderRadius: "var(--tblr-border-radius)",
                                          }}
                                          value={company["Status"]}
                                          onChange={(e) =>
                                            handleStatusChange(
                                              company._id,
                                              e.target.value,
                                              company["Company Name"],
                                              company["Company Email"],
                                              company["Company Incorporation Date  "],
                                              company["Company Number"],
                                              company["Status"]
                                            )
                                          }
                                        >
                                          <option value="Not Picked Up">Not Picked Up</option>
                                          <option value="Busy">Busy</option>
                                          <option value="Junk">Junk</option>
                                          <option value="Not Interested">Not Interested</option>
                                          {dataStatus === "All" && (
                                            <>
                                              <option value="Untouched">Untouched</option>
                                              <option value="Interested">Interested</option>
                                            </>
                                          )}
                                          {dataStatus === "Interested" && (
                                            <>
                                              <option value="Interested">Interested</option>
                                              <option value="FollowUp">Follow Up</option>
                                              <option value="Matured">Matured</option>
                                            </>
                                          )}
                                          {dataStatus === "FollowUp" && (
                                            <>
                                              <option value="FollowUp">Follow Up</option>
                                              <option value="Matured">Matured</option>
                                            </>
                                          )}
                                        </select>
                                      )}
                                      {company.bdmAcceptStatus !== "NotForwarded" && (
                                        <select
                                          disabled
                                          style={{
                                            background: "none",
                                            padding: ".4375rem .75rem",
                                            border: "1px solid var(--tblr-border-color)",
                                            borderRadius: "var(--tblr-border-radius)",
                                          }}
                                        >
                                          <option value="">Company Forwarded to BDM</option>
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

                                    {company.bdmAcceptStatus !== "Accept" && (<IconButton
                                      onClick={() => {
                                        functionopenpopupremarks(
                                          company._id,
                                          company.Status,
                                          company["Company Name"]
                                        );
                                        setCurrentRemarks(company.Remarks);
                                        setCompanyId(company._id);
                                      }}>
                                      <EditIcon
                                        onClick={() => {
                                          functionopenpopupremarks(
                                            company._id,
                                            company.Status,
                                            company["Company Name"]
                                          );
                                          setCurrentRemarks(company.Remarks);
                                          setCompanyId(company._id);
                                        }}
                                        style={{
                                          width: "12px",
                                          height: "12px",
                                        }}
                                      />
                                    </IconButton>)}
                                    {company.bdmAcceptStatus === "Accept" && (
                                      <IconButton
                                        onClick={() => {
                                          functionopenpopupremarksEdit(
                                            company._id,
                                            company.Status,
                                            company["Company Name"]
                                          );
                                          setCurrentRemarks(company.Remarks);
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
                                      </IconButton>
                                    )}
                                  </div>
                                </td>

                                <td>
                                  {formatDate(
                                    company["Company Incorporation Date  "]
                                  )}
                                </td>
                                <td>{company["City"]}</td>
                                <td>{company["State"]}</td>
                                <td>{company["Company Email"]}</td>
                                <td>{formatDate(company["AssignDate"])}</td>
                                {(dataStatus === "FollowUp" ||
                                  dataStatus === "Interested") && (<>
                                    {company.bdmAcceptStatus === "NotForwarded" ? (
                                      <td>
                                        {company &&
                                          projectionData &&
                                          projectionData.some(
                                            (item) =>
                                              item.companyName ===
                                              company["Company Name"]
                                          ) ? (
                                          <IconButton>
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
                                          </IconButton>
                                        ) : (
                                          <IconButton>
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
                                          </IconButton>
                                        )}
                                      </td>) : (
                                      <td>
                                        <IconButton>
                                          <RiEditCircleFill
                                            style={{
                                              cursor: "pointer",
                                              width: "17px",
                                              height: "17px",
                                              alignItems: "center",
                                              color: "black"
                                            }}
                                          />
                                        </IconButton>
                                      </td>
                                    )}
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
                                  </>)}
                                {
                                  dataStatus === "Forwarded" && (
                                    <td>
                                      {company.bdmAcceptStatus === "NotForwarded" ? (
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
                                      ) : company.bdmAcceptStatus === "Pending" ? (
                                        <TiArrowBack
                                          onClick={() => {
                                            handleReverseAssign(
                                              company._id,
                                              company["Company Name"],
                                              company.bdmAcceptStatus,
                                              company.Status,
                                            )
                                          }}
                                          style={{
                                            cursor: "pointer",
                                            width: "17px",
                                            height: "17px",
                                          }}
                                          color="#fbb900"
                                        />
                                      ) : company.bdmAcceptStatus === "Accept" ? (
                                        <MdNotInterested style={{
                                          cursor: "pointer",
                                          width: "17px",
                                          height: "17px",
                                        }}
                                          color="red" />
                                      ) : <TiArrowForward
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
                                      />}
                                    </td>

                                  )
                                }

                                {dataStatus === "Matured" && (
                                  <>
                                    <td>
                                      <div className="d-flex">
                                        <IconButton
                                          style={{ marginRight: "5px" }}
                                          onClick={() => {
                                            setMaturedID(company._id);

                                            functionopenAnchor();
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
                                        </IconButton>

                                        <IconButton
                                          onClick={() => {
                                            handleRequestDelete(
                                              company._id,
                                              company["Company Name"]
                                            );
                                          }}
                                          disabled={requestDeletes.some(
                                            (item) =>
                                              item.companyId === company._id &&
                                              item.request === undefined
                                          )}
                                        >
                                          <DeleteIcon
                                            style={{
                                              cursor: "pointer",
                                              color: "#f70000",
                                              width: "14px",
                                              height: "14px",
                                            }}
                                          />
                                        </IconButton>
                                        <IconButton
                                          onClick={() => {
                                            handleEditClick(company._id)
                                          }}
                                        // onClick={() => {
                                        //   setMaturedID(company._id);
                                        //   setTimeout(() => {
                                        //     setEditFormOpen(true);
                                        //   }, 1000);
                                        // }}
                                        // disabled={totalBookings.some(
                                        //   (obj) =>
                                        //     obj["Company Name"] ===
                                        //     company["Company Name"]
                                        // )}
                                        >
                                          <Edit
                                            style={{
                                              cursor: "pointer",
                                              color: "#109c0b",
                                              width: "14px",
                                              height: "14px",
                                            }}
                                          />
                                        </IconButton>
                                        <IconButton
                                          onClick={() => {
                                            setCompanyName(
                                              company["Company Name"]
                                            );
                                            setAddFormOpen(true);
                                          }}
                                        >
                                          <AddCircleIcon
                                            style={{
                                              cursor: "pointer",
                                              color: "#4f5b74",
                                              width: "14px",
                                              height: "14px",
                                            }}
                                          />
                                        </IconButton>
                                      </div>
                                    </td>
                                  </>
                                )}
                                {/* <td onClick={()=>setIsOpen(true)}><MailOutlineIcon style={{cursor:'pointer'}}/></td> */}
                              </tr>
                            ))}
                          </tbody>
                        )}
                        {dataStatus === "null" && companies.length !== 0 && (
                          <tbody>
                            {companies.map((company, index) => (
                              <tr
                                key={index}
                                style={{ border: "1px solid #ddd" }}
                              >
                                <td className="td-sticky">
                                  {startIndex + index + 1}
                                </td>
                                <td className="td-sticky1">
                                  {company["Company Name"]}
                                </td>
                                <td>{company["Company Number"]}</td>
                                <td>
                                  <span>{company["Status"]}</span>
                                </td>
                                <td>
                                  <div
                                    key={company._id}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <p
                                      className="rematkText text-wrap m-0"
                                      title={company.Remarks}
                                    >
                                      {company.Remarks}
                                    </p>
                                  </div>
                                </td>

                                <td>
                                  {formatDate(
                                    company["Company Incorporation Date"]
                                  )}
                                </td>
                                <td>{company["City"]}</td>
                                <td>{company["State"]}</td>
                                <td>{company["Company Email"]}</td>
                                <td>{formatDate(company["AssignDate"])}</td>

                                <td>
                                  {/* <button
                                  style={{
                                    padding: "5px",
                                    fontSize: "12px",
                                    backgroundColor: "lightblue",
                                    // Additional styles for the "View" button
                                  }}
                                  className="btn btn-primary d-none d-sm-inline-block"
                                  onClick={() => {
                                    functionopenAnchor();
                                    setMaturedCompanyName(
                                      company["Company Name"]
                                    );
                                  }}
                                >
                                  View
                                </button> */}
                                  <HiOutlineEye
                                    style={{
                                      fontSize: "15px",
                                      color: "#fbb900",
                                      //backgroundColor: "lightblue",
                                      // Additional styles for the "View" button
                                    }}
                                    //className="btn btn-primary d-none d-sm-inline-block"
                                    onClick={() => {
                                      functionopenAnchor();
                                      setMaturedCompanyName(
                                        company["Company Name"]
                                      );
                                    }}
                                  />
                                </td>
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
                        {/* {companies.length === 0 && !loading && dataStatus === "Matured" && (
                        <tbody>
                          <tr>
                            <td colSpan="11" className="p-2 particular">
                              <Nodata />
                            </td>
                          </tr>
                        </tbody>
                      )} */}
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
                        <IconButton
                          onClick={() =>
                            setCurrentPage((prevPage) =>
                              Math.max(prevPage - 1, 0)
                            )
                          }
                          disabled={currentPage === 0}
                        >
                          <IconChevronLeft />
                        </IconButton>
                        <span>
                          Page {currentPage + 1} of{" "}
                          {Math.ceil(filteredData.length / itemsPerPage)}
                        </span>

                        <IconButton
                          onClick={() =>
                            setCurrentPage((prevPage) =>
                              Math.min(
                                prevPage + 1,
                                Math.ceil(filteredData.length / itemsPerPage) -
                                1
                              )
                            )
                          }
                          disabled={
                            currentPage ===
                            Math.ceil(filteredData.length / itemsPerPage) - 1
                          }
                        >
                          <IconChevronRight />
                        </IconButton>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
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
          <EditableMoreBooking setFormOpen={setEditMoreOpen}
            bookingIndex={bookingIndex}
            companysName={currentForm["Company Name"]}
            companysEmail={currentForm["Company Email"]}
            companyNumber={currentForm["Company Number"]}
            setNowToFetch={setNowToFetch}
            companysInco={currentForm.incoDate}
            employeeName={data.ename}
            employeeEmail={data.email}
            setDataStatus={setdataStatus} />
        </>
      )}
      {addFormOpen && (
        <>
          {" "}
          <AddLeadForm
            setFormOpen={setAddFormOpen}
            companysName={companyName}
            setNowToFetch={setNowToFetch}
            setDataStatus={setdataStatus}
          />
        </>
      )}

      {/* Pop up for confirming bookings  */}
      <Dialog
        open={openBooking}
        onClose={() => {
          setOpenBooking(false)
          setCurrentForm(null)
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Choose Booking{" "}
          <IconButton
            onClick={() => {
              setOpenBooking(false)
              setCurrentForm(null)
            }}
            style={{ float: "right" }}
          >
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
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
              {currentForm && currentForm.moreBookings.map((obj, index) => (
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
              <button onClick={handleOpenEditForm} style={{ textAlign: "center" }} className="btn btn-primary">
                Confirm Booking
              </button>
            </div>
          </div>

        </DialogContent>
      </Dialog>
      {/* Request Data popup */}
      <Dialog open={open} onClose={closepopup} fullWidth maxWidth="sm">
        <DialogTitle>
          Request Data{" "}
          <IconButton onClick={closepopup} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
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
              <div
                style={
                  selectedOption === "notgeneral"
                    ? {
                      backgroundColor: "#ffb900",
                      margin: "10px 0px 0px 0px",
                      cursor: "pointer",
                      color: "white",
                    }
                    : {
                      backgroundColor: "white",
                      margin: "10px 0px 0px 0px",
                      cursor: "pointer",
                    }
                }
                className="notgeneral form-control col"
                onClick={() => {
                  setSelectedOption("notgeneral");
                }}
              >
                <input
                  type="radio"
                  id="notgeneral"
                  value="notgeneral"
                  style={{
                    display: "none",
                  }}
                  checked={selectedOption === "notgeneral"}
                  onChange={handleOptionChange}
                />
                <label htmlFor="notgeneral">Manual</label>
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
                    onChange={handleYearChange}
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
            className="btn btn-primary"
          >
            Submit
          </button>
        </div>
      </Dialog>
      {/* --------------------------  Inco-filter ---------------- */}
      {/* <Dialog
        open={openIncoDate}
        onClose={handleCloseIncoDate}
        fullWidth
        maxWidth="xs"
      >
        <DialogContent>
          <div>
            <input
              type="checkbox"
              onChange={(e) => {
                setIncoFilter(e.target.value);

                setEmployeeData(
                  employeeData.sort((a, b) =>
                    a["Company Incorporation Date  "].localeCompare(
                      b["Company Incorporation Date  "]
                    )
                  )
                );
              }}
              name="oldest"
              id="oldest"
              value="oldest"
              checked={incoFilter === "oldest"}
            />{" "}
            Oldest
          </div>
          <div>
            <input
              onChange={(e) => {
                setIncoFilter(e.target.value);
                setEmployeeData(
                  employeeData.sort((a, b) =>
                    b["Company Incorporation Date  "].localeCompare(
                      a["Company Incorporation Date  "]
                    )
                  )
                );
              }}
              type="checkbox"
              value="newest"
              name="newest"
              id="newest"
              checked={incoFilter === "newest"}
            />
            Newest
          </div>
          <div>
            <input
              onChange={(e) => {
                setIncoFilter(e.target.value);
                setEmployeeData(
                  employeeData.sort((a, b) =>
                    b["AssignDate"].localeCompare(a["AssignDate"])
                  )
                );
              }}
              type="checkbox"
              value="removeFilter"
              name="removeFilter"
              id="removeFilter"
              checked={incoFilter === "removeFilter"}
            />
            None
          </div>
        </DialogContent>
      </Dialog> */}

      {/* Remarks edit icon pop up*/}
      <Dialog
        open={openRemarks}
        onClose={closepopupRemarks}
        fullWidth
        maxWidth="sm">
        <DialogTitle>
          <span style={{ fontSize: "14px" }}>
            {currentCompanyName}'s Remarks
          </span>
          <IconButton onClick={closepopupRemarks} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
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
            <button
              onClick={handleUpdate}
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              Submit
            </button>
          </div>
        </DialogContent>
      </Dialog>


      {/* --------------------------------------------------------------dialog to view remarks only on forwarded status---------------------------------- */}

      <Dialog
        open={opeRemarksEdit}
        onClose={closePopUpRemarksEdit}
        fullWidth
        maxWidth="sm">
        <DialogTitle>
          <span style={{ fontSize: "14px" }}>
            {currentCompanyName}'s Remarks
          </span>
          <IconButton onClick={closePopUpRemarksEdit} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
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
                      </div>
                      {/* <div className="dlticon">
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
                      </div> */}
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

          {/* <div class="card-footer">
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
            <button
              onClick={handleUpdate}
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              Submit
            </button>
          </div> */}
        </DialogContent>
      </Dialog>

      {/* ADD Leads starts here */}

      {/* <Dialog open={openNew} onClose={closepopupNew} fullWidth maxWidth="sm">
        <DialogTitle>
          Company Info{" "}
          <IconButton onClick={closepopupNew} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Company Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="example-text-input"
                    placeholder="Your Company Name"
                    onChange={(e) => {
                      setCname(e.target.value);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Company Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="example-text-input"
                    placeholder="example@gmail.com"
                    onChange={(e) => {
                      setCemail(e.target.value);
                    }}
                  />
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Company Number</label>
                      <input
                        type="number"
                        onChange={(e) => {
                          setCnumber(e.target.value);
                        }}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Company Incorporation Date
                      </label>
                      <input
                        onChange={(e) => {
                          setCidate(e.target.value);
                        }}
                        type="date"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">City</label>
                      <input
                        onChange={(e) => {
                          setCity(e.target.value);
                        }}
                        type="text"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">State</label>
                      <input
                        onChange={(e) => {
                          setState(e.target.value);
                        }}
                        type="text"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <button onClick={handleSubmitData} className="btn btn-primary">
          Submit
        </button>
      </Dialog> */}
      <Dialog open={openNew} onClose={closepopupNew} fullWidth maxWidth="md">
        <DialogTitle>
          Company Info{" "}
          <IconButton onClick={closepopupNew} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <div className="row">
                  <div className="col-4">
                    <div className="mb-3">
                      <label className="form-label">Company Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="example-text-input"
                        placeholder="Your Company Name"
                        onChange={(e) => {
                          setCname(e.target.value);
                        }}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="mb-3">
                      <label className="form-label">Company Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="example-text-input"
                        placeholder="example@gmail.com"
                        onChange={(e) => {
                          setCemail(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="mb-3">
                      <label className="form-label">Company Address</label>
                      <input
                        type="email"
                        className="form-control"
                        name="example-text-input"
                        placeholder="example@gmail.com"
                        onChange={(e) => {
                          setCompanyAddress(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Company Number</label>
                      <input
                        type="number"
                        onChange={(e) => {
                          setCnumber(e.target.value);
                        }}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Company Incorporation Date
                      </label>
                      <input
                        onChange={(e) => {
                          setCidate(e.target.value);
                        }}
                        type="date"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">City</label>
                      <input
                        onChange={(e) => {
                          setCity(e.target.value);
                        }}
                        type="text"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">State</label>
                      <input
                        onChange={(e) => {
                          setState(e.target.value);
                        }}
                        type="text"
                        className="form-control"
                      //disabled={!isEditProjection}
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
                          setDirectorNameFirst(e.target.value);
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
                          setDirectorNumberFirst(e.target.value);
                        }}
                      />
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
                          setDirectorEmailFirst(e.target.value);
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
                    {/* <button className="btn btn-primary d-none d-sm-inline-block">
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
                    </button> */}
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
                            setDirectorNameSecond(e.target.value);
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
                            setDirectorNumberSecond(e.target.value);
                          }}
                        />
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
                            setDirectorEmailSecond(e.target.value);
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
                            setDirectorNameThird(e.target.value);
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
                            setDirectorNumberThird(e.target.value);
                          }}
                        />
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
                            setDirectorEmailThird(e.target.value);
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
        <button className="btn btn-primary" onClick={handleSubmitData}>
          Submit
        </button>
      </Dialog>

      {/* -------------------------- Import CSV File ---------------------------- */}
      <Dialog open={openCSV} onClose={closepopupCSV} fullWidth maxWidth="sm">
        <DialogTitle>
          Import CSV DATA{" "}
          <IconButton onClick={closepopupCSV} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
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
          {/* <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <button onClick={handleButtonClick}>Choose File</button> */}
        </DialogContent>
        <button onClick={handleUploadData} className="btn btn-primary">
          Submit
        </button>
      </Dialog>

      {/* Side Drawer for Edit Booking Requests */}
      <Drawer anchor="right" open={openAnchor} onClose={closeAnchor}>
        <div style={{ minWidth: "60vw" }} className="LeadFormPreviewDrawar">
          <div className="LeadFormPreviewDrawar-header">
            <div className="Container">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="title m-0 ml-1">
                    {currentForm ? currentForm["Company Name"] : "Company Name"}
                  </h2>
                </div>
                <div>
                  <IconButton onClick={closeAnchor}>
                    <CloseIcon />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
          <div>
            <LeadFormPreview
              setOpenAnchor={setOpenAnchor}
              currentLeadForm={currentForm}
            />
          </div>
        </div>
      </Drawer>

      {/* Drawer for Follow Up Projection  */}
      <div>
        <Drawer
          style={{ top: "50px" }}
          anchor="right"
          open={openProjection}
          onClose={closeProjection}>
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
                    <IconButton
                      onClick={() => {
                        setIsEditProjection(true);
                      }}
                    >
                      <EditIcon color="grey"></EditIcon>
                    </IconButton>
                  </>
                ) : null}
                {/* <IconButton
                  onClick={() => {
                    setIsEditProjection(true);
                  }}>
                  <EditIcon color="grey"></EditIcon>
                </IconButton> */}
                {/* <IconButton onClick={() => handleDelete(projectingCompany)}>
                  <DeleteIcon
                    style={{
                      width: "16px",
                      height: "16px",
                      color: "#bf0b0b",
                    }}
                  >
                    Delete
                  </DeleteIcon>
                </IconButton> */}
                <IconButton>
                  <IoClose onClick={closeProjection} />
                </IconButton>
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
                <button>Pay now</button>
                {/* <button onClick={generatePaymentLink}>Generate Payment Link</button>
                {paymentLink && <a href={paymentLink} target="_blank" rel="noopener noreferrer">Proceed to Payment</a>}
                {error && <p>{error}</p>} */}
              </div>
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
                    onClick={handleSendEmail}
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
      </div>
    </div>
  );
}

export default EmployeePanel;
