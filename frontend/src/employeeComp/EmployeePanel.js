import React, { useEffect, useState } from "react";
import EmpNav from "./EmpNav.js";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import notificationSound from '../assets/media/iphone_sound.mp3';
import Papa from "papaparse";
import * as XLSX from "xlsx";
import axios from "axios";
import { IconChevronLeft } from "@tabler/icons-react";
import { IconChevronRight } from "@tabler/icons-react";
import { Drawer, Icon, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import Select from "react-select";
import Swal from "sweetalert2";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import Form from "../components/Form.jsx";
import "../assets/table.css";
import "../assets/styles.css";
import Nodata from "../components/Nodata.jsx";
import EditForm from "../components/EditForm.jsx";
import { useCallback } from "react";
import debounce from "lodash/debounce";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { options } from "../components/Options.js";
import FilterListIcon from "@mui/icons-material/FilterList";
import socketIO from 'socket.io-client';

function EmployeePanel() {
  const [moreFilteredData, setmoreFilteredData] = useState([]);
  const [isEditProjection, setIsEditProjection] = useState(false);
  const [projectingCompany, setProjectingCompany] = useState("");
  const [sortStatus, setSortStatus] = useState("");
  const [projectionData, setProjectionData] = useState([]);
  const [requestData, setRequestData] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentProjection, setCurrentProjection] = useState({
    companyName: "",
    ename: "",
    offeredPrize: 0,
    offeredServices: [],
    lastFollowUpdate: "",
    totalPayment:0,
    estPaymentDate:"",
    remarks:"",
    date: "",
    time: "",
  });
  const [csvdata, setCsvData] = useState([]);
  const [dataStatus, setdataStatus] = useState("All");
  const [changeRemarks, setChangeRemarks] = useState("");
  const [open, openchange] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [openCSV, openchangeCSV] = useState(false);
  const [openRemarks, openchangeRemarks] = useState(false);
  const [openAnchor, setOpenAnchor] = useState(false);
  const [openProjection, setOpenProjection] = useState(false);
  const [data, setData] = useState([]);
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
  const [cnumber, setCnumber] = useState(0);
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [cidate, setCidate] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [month, setMonth] = useState(0);
  const [updateData, setUpdateData] = useState({});
  const [RequestApprovals, setRequestApprovals] = useState([]);
  const [mapArray, setMapArray] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [currentRemarks, setCurrentRemarks] = useState("");
  const itemsPerPage = 500;
  const [year, setYear] = useState(0);
  const [incoFilter, setIncoFilter] = useState("");
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const { userId } = useParams();
  console.log(userId);
  // const customStyles = {
  //   option: (provided, state) => ({
  //     ...provided,
  //     backgroundColor: state.isSelected
  //       ? "blue"
  //       : state.isDisabled
  //       ? "#ffb900"
  //       : "white",
  //     color: state.isDisabled ? "white" : "black",
  //     // Add more styles as needed
  //   }),
  // };
  const playNotificationSound = () => {
    const audio = new Audio(notificationSound);
    audio.play();
  };
  useEffect(() => {
    const socket = socketIO.connect('http://localhost:3001');

    // Listen for the 'request-seen' event from the server
    socket.on('request-seen', () => {
      // Call fetchRequestDetails function to update request details
      fetchRequestDetails();

    });
    socket.on('data-sent',()=>{
      fetchRequestDetails();
      playNotificationSound();

    
    })

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []); 
  const functionopenpopup = () => {
    openchange(true);
  };
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
        estPaymentDate:findOneprojection.estPaymentDate,
        remarks:findOneprojection.remarks,
        totalPayment:findOneprojection.totalPayment,
        date: "",
        time: "",
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
      totalPayment:0,
      lastFollowUpdate: "",
      remarks:"",
      date: "",
      time: "",
    });
    setIsEditProjection(false);
    setSelectedValues([]);
  };
  const functionopenAnchor = () => {
    setOpenAnchor(true);
  };

  const [cid, setcid] = useState("");
  const [cstat, setCstat] = useState("");
  const functionopenpopupremarks = (companyID, companyStatus) => {
    openchangeRemarks(true);
    setFilteredRemarks(
      remarksHistory.filter((obj) => obj.companyID === companyID)
    );
    // console.log(remarksHistory.filter((obj) => obj.companyID === companyID))

    setcid(companyID);
    setCstat(companyStatus);
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

      setData(userData);
      setmoreFilteredData(userData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  const fetchProjections = async () => {
    try {
      const response = await axios.get(`${secretKey}/projection-data`);
      setProjectionData(response.data);
    } catch (error) {
      console.error("Error fetching Projection Data:", error.message);
    }
  };
  const [moreEmpData, setmoreEmpData] = useState([]);

  const fetchNewData = async (status) => {
    try {
      const response = await axios.get(`${secretKey}/employees/${data.ename}`);
      const tempData = response.data;

      const sortedData = response.data.sort((a, b) => {
        // Assuming AssignDate is a string representation of a date
        return new Date(b.AssignDate) - new Date(a.AssignDate);
      });

      setmoreEmpData(sortedData);

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
      // setEmployeeData(tempData.filter(obj => obj.Status === "Busy" || obj.Status === "Not Picked Up" || obj.Status === "Untouched"))
    } catch (error) {
      console.error("Error fetching new data:", error);
    }
  };

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

    console.log(selectedField);
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

  useEffect(() => {
    if (data.ename) {
      console.log("Employee found");
      fetchNewData();
    } else {
      console.log("No employees found");
    }
  }, [data.ename]);

  const fetchRequestDetails = async () => {
    try {
      const response = await axios.get(`${secretKey}/requestgData`);
      const sortedData = response.data.sort((a, b) => {
        // Assuming 'timestamp' is the field indicating the time of creation or update
        return new Date(b.date) - new Date(a.date);
      });
      
      // Find the latest data object with Assignread property as false
      const latestData = sortedData.find(data => data.AssignRead === false);
      
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
  console.log(requestData);
  // const [locationAccess, setLocationAccess] = useState(false);
  useEffect(() => {
    fetchRemarksHistory();
    fetchProjections();
    fetchRequestDetails();
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

  console.log(companyName, companyInco);

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

    try {
      // Make an API call to update the employee status in the database
      const response = await axios.post(
        `${secretKey}/update-status/${employeeId}`,
        {
          newStatus,
        }
      );

      // Check if the API call was successful
      if (response.status === 200) {
        // Assuming fetchData is a function to fetch updated employee data
        console.log("Sort Status :", sortStatus);
        fetchNewData(oldStatus);

        // if(newStatus==="Interested"){
        //   setdataStatus("Interested");
        //   setEmployeeData(moreEmpData.filter(obj => obj.Status === "Interested"))
        // }
      } else {
        // Handle the case where the API call was not successful
        console.error("Failed to update status:", response.data.message);
      }
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error("Error updating status:", error.message);
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
    axios
      .post(`${secretKey}/manual`, {
        "Company Name": cname,
        "Company Number": cnumber,
        "Company Email": cemail,
        "Company Incorporation Date  ": cidate,
        City: city,
        State: state,
        ename: data.ename,
        AssignDate: new Date(),
      })
      .then((response) => {
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
        Swal.fire("Please Enter Unique data!");
      });
  };

  // Function for Parsing Excel File

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

  const handleProjectionSubmit = async () => {
    try {
      const finalData = {
        ...currentProjection,
        companyName: projectingCompany,
        ename: data.ename,
        offeredServices: selectedValues,
      };

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
        remarks:"",
        date: "",
        time: "",
      });
      fetchProjections();

      console.log(response.data); // Log success message
    } catch (error) {
      console.error("Error updating or adding data:", error.message);
    }
  };

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
      console.error('Error marking object as read:', error);
    }
  };
  return (
    <div>
      <Header name={data.ename} designation={data.designation} />
      <EmpNav userId={userId} />

      {/* Dialog box for Request Data */}
      {!formOpen ? (
        <>
          <div className="page-wrapper">
            <div className="page-header d-print-none">
              <div className="container-xl">
               {requestData!==null && requestData!==undefined && <div className="notification-bar">
                  <div className="noti-text">
                    <h1>You have just received {requestData.dAmount} data!</h1>                  
                  </div>
                  <div className="close-icon">
                    <IconButton onClick={handleMarktrue}>
                      <CloseIcon/>
                    </IconButton>
                  </div>
                 
                </div>}
                <div className="row g-2 align-items-center">
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                    className="features"
                  >
                    <div style={{ display: "flex" }} className="feature1">
                      <div
                        className="form-control mr-1"
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
                            style={{ display: visibility }}
                            type="date"
                            className="form-control"
                          />
                        </div>
                      )}

                      {visibilityOther === "block" ? (
                        <div
                          style={{
                            width: "20vw",
                            margin: "0px 10px",
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
                          />
                        </div>
                      ) : (
                        <div></div>
                      )}
                      {visibilityOthernew === "block" ? (
                        <div
                          style={{
                            width: "20vw",
                            margin: "0px 10px",
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
                                setEmployeeData(moreEmpData.filter(obj=>obj.Status === "Busy" || obj.Status === "Not Picked Up" || obj.Status === "Untouched"))
                              } else if (
                                e.target.value === "Junk" ||
                                e.target.value === "Not Interested"
                              ) {
                                setdataStatus("NotInterested");
                                setEmployeeData(moreEmpData.filter(obj=>obj.Status === "Not Interested" || obj.Status === "Junk"))
                              } else if (e.target.value === "Interested") {
                                setdataStatus("Interested");
                                setEmployeeData(moreEmpData.filter(obj=>obj.Status === "Interested"))
                              } else if (e.target.value === "Untouched") {
                                setdataStatus("All")
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
                            alignItems: "center",
                            fontSize: "16px",
                            fontFamily: "sans-serif",
                          }}
                          className="results ml-1"
                        >
                          {filteredData.length} results found
                        </div>
                      )}
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center" }}
                      className="feature2"
                    >
                      <div className="form-control mr-2 sort-by">
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
                              style={{ border: "none", outline: "none" }}
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
                          <div className="input-icon">
                            <input
                              type="number"
                              value={year}
                              defaultValue="Select Year"
                              className="form-control"
                              placeholder="Select Year.."
                              onChange={(e) => {
                                setYear(e.target.value);
                              }}
                              aria-label="Search in website"
                            />
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
                              (obj) => obj.Status === "Interested"
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
                        Interested{" "}
                        <span className="no_badge">
                          {
                            moreEmpData.filter(
                              (obj) => obj.Status === "Interested"
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
                              (obj) => obj.Status === "FollowUp"
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
                              (obj) => obj.Status === "FollowUp"
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
                            moreEmpData.filter(
                              (obj) => obj.Status === "Matured"
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
                        <span className="no_badge">{companies.length}</span>
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
                                obj.Status === "Not Interested" ||
                                obj.Status === "Junk"
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
                              (dataStatus === "FollowUp" && <th>Action</th>)}
                          </tr>
                        </thead>
                        {currentData.length !== 0 &&
                          dataStatus !== "Matured" && (
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
                                  <td>{company["Company Number"]}</td>
                                  <td>
                                    {company["Status"] === "Matured" ? (
                                      <span>{company["Status"]}</span>
                                    ) : (
                                      <select
                                        style={{
                                          width: "100px",
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
                                            company._id,
                                            e.target.value,
                                            company["Company Name"],
                                            company["Company Email"],
                                            company[
                                              "Company Incorporation Date  "
                                            ],
                                            company["Company Number"],
                                            company["Status"]
                                          )
                                        }
                                      >
                                        <option value="Not Picked Up">
                                          Not Picked Up
                                        </option>
                                        <option value="Busy">Busy </option>

                                        <option value="Junk">Junk</option>
                                        <option value="Not Interested">
                                          Not Interested
                                        </option>
                                        {dataStatus === "All" && (
                                          <>
                                            <option value="Untouched">
                                              Untouched{" "}
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
                                            <option value="FollowUp">
                                              Follow Up{" "}
                                            </option>
                                            <option value="Matured">
                                              Matured
                                            </option>
                                          </>
                                        )}

                                        {dataStatus === "FollowUp" && (
                                          <>
                                            <option value="FollowUp">
                                              Follow Up{" "}
                                            </option>
                                            <option value="Matured">
                                              Matured
                                            </option>
                                          </>
                                        )}
                                      </select>
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

                                      <IconButton
                                        onClick={() => {
                                          functionopenpopupremarks(
                                            company._id,
                                            company.Status
                                          );
                                          setCurrentRemarks(company.Remarks);
                                          setCompanyId(company._id);
                                        }}
                                      >
                                        <EditIcon
                                          style={{
                                            width: "12px",
                                            height: "12px",
                                          }}
                                        />
                                      </IconButton>
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

                                  {dataStatus === "FollowUp" && (
                                    <td>
                                      <button
                                        style={{
                                          padding: "5px",
                                          fontSize: "12px",
                                          backgroundColor: "lightblue",
                                          // Additional styles for the "View" button
                                        }}
                                        className="btn btn-primary d-none d-sm-inline-block"
                                        onClick={() => {
                                          functionopenprojection(
                                            company["Company Name"]
                                          );
                                        }}
                                      >
                                        View
                                      </button>
                                    </td>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          )}
                        {dataStatus === "Matured" && companies.length !== 0 && (
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
                                <td>{company["Company Email"]}</td>
                                <td>
                                  {formatDate(
                                    company["Company Incorporation Date"]
                                  )}
                                </td>
                                <td>{company["City"]}</td>
                                <td>{company["State"]}</td>
                                <td>{formatDate(company["AssignDate"])}</td>

                                <td>
                                  <button
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
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        )}
                        {currentData.length === 0 &&
                          dataStatus !== "Matured" && (
                            <tbody>
                              <tr>
                                <td colSpan="11" className="p-2 particular">
                                  <Nodata />
                                </td>
                              </tr>
                            </tbody>
                          )}
                        {companies.length === 0 && dataStatus === "Matured" && (
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
      ) : (
        <>
          <div className="page-wrapper">
            <div className="page-header d-print-none">
              <div
                style={{ justifyContent: "space-between" }}
                className="container-xl d-flex"
              >
                <div className="row g-2 align-items-center">
                  <div className="col">
                    {/* <!-- Page pre-title --> */}
                    <h2 className="page-title">Leadform</h2>
                  </div>
                </div>
                <div className="request">
                  <div className="btn-list">
                    <button
                      onClick={() => {
                        setFormOpen(false);
                      }}
                      className="btn btn-primary d-none d-sm-inline-block"
                    >
                      Back
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
            <div
              onCopy={(e) => {
                e.preventDefault();
              }}
              className="page-body"
            >
              <div className="container-xl">
                <Form
                  matured={true}
                  companysId={companyId}
                  companysName={companyName}
                  companysEmail={companyEmail}
                  companyNumber={companyNumber}
                  companysInco={companyInco}
                  employeeName={data.ename}
                  employeeEmail={data.email}
                />
              </div>
            </div>
          </div>
        </>
      )}

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
        maxWidth="sm"
      >
        <DialogTitle>
          Remarks
          <IconButton onClick={closepopupRemarks} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          <div className="remarks-content">
            {filteredRemarks.length !== 0 ? (
              filteredRemarks
                .slice()

                .map((historyItem) => (
                  <div className="col-sm-12" key={historyItem._id}>
                    <div className="card RemarkCard position-relative">
                      <div className="d-flex justify-content-between">
                        <div className="reamrk-card-innerText">
                          <pre className="remark-text">
                            {historyItem.remarks}
                          </pre>
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

      {/* ADD Leads starts here */}
      <Dialog open={openNew} onClose={closepopupNew} fullWidth maxWidth="sm">
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
              <a href={frontendKey + "/EmployeeSample.xlsx"} download>
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
        <div className="container-xl">
          <div className="header d-flex justify-content-between">
            <h1 className="title">LeadForm</h1>
            <IconButton>
              <EditIcon
                onClick={() => {
                  setIsEdit(true);
                }}
                color="primary"
              ></EditIcon>
            </IconButton>{" "}
          </div>
          <EditForm matured={isEdit} companysName={maturedCompanyName} />
        </div>
      </Drawer>
      {/* Drawer for Follow Up Projection  */}
      <div>
      <Drawer style={{top:'50px'}} anchor="right" open={openProjection} onClose={closeProjection}>
        <div style={{ width: "31em"  }} className="container-xl">
          <div className="header d-flex justify-content-between align-items-center">
            <h1 style={{marginBottom:'0px'}} className="title">Projection Form</h1>
            <IconButton
              onClick={() => {
                setIsEditProjection(true);
              }}
            >
              <EditIcon color="primary"></EditIcon>
            </IconButton>
            
          </div>
          <hr style={{marginBottom:'10px'}} />
          <div className="body-projection">
            <div className="header mb-2" >
              <strong style={{fontSize:'20px'}}>{projectingCompany}</strong>
            </div>
            <div className="label">
              <strong>Offered Services :</strong>
              <div className="services mb-3">
                <Select
                  // styles={{
                  //   customStyles,
                  //   container: (provided) => ({
                  //     border: "1px solid #ffb900",
                  //     borderRadius: "5px",
                  //   }),
                  // }}
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
                  disabled={!isEditProjection}
                />
              </div>
            </div>
            <div className="label">
              <strong>Offered prizes:</strong>
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
              <strong>Total Payment:</strong>
              <div className="services mb-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Please enter total Payment"
                  value={currentProjection.totalPayment}
                  onChange={(e) => {
                    setCurrentProjection((prevLeadData) => ({
                      ...prevLeadData,
                      totalPayment: e.target.value,
                    }));
                  }}
                  disabled={!isEditProjection}
                />
              </div>
            </div>
            <div className="label">
              <strong>Last Follow Up Date:</strong>
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
              <strong>Payment Expected on:</strong>
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
              <strong>Remarks:</strong>
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
          </div>
        </div>
      </Drawer>
      </div>
    </div>
  );
}

export default EmployeePanel;
