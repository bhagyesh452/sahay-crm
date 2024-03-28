import React, { useEffect, useState, useRef } from "react";
import Navbar from "./Navbar";
import Header from "./Header";
import axios from "axios";
import Nodata from "../components/Nodata";
import "../assets/styles.css";
import { IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ViewListIcon from "@mui/icons-material/ViewList";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IconEye } from "@tabler/icons-react";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
//import { DateRangePicker } from 'react-date-range';
import { FaChevronDown } from "react-icons/fa6";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { options } from "../components/Options.js";
import FilterListIcon from "@mui/icons-material/FilterList";
import { FaRegCalendar } from "react-icons/fa";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { FcDatabase } from "react-icons/fc";
import { MdPersonSearch } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { debounce } from 'lodash';
import { Link } from 'react-router-dom'
import ScaleLoader from "react-spinners/ScaleLoader";

import AnnouncementIcon from "@mui/icons-material/Announcement";
import { lastDayOfDecade } from "date-fns";
import StatusInfo from './StausInfo.js'
import Calendar from '@mui/icons-material/Event';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import moment from 'moment'
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import dayjs from 'dayjs';
import { IoClose } from "react-icons/io5";
// import { LicenseInfo } from '@mui/x-date-pickers-pro';


// LicenseInfo.setLicenseKey(
//   'x0jTPl0USVkVZV0SsMjM1kDNyADM5cjM2ETPZJVSQhVRsIDN0YTM6IVREJ1T0b9586ef25c9853decfa7709eee27a1e',
// );


// import LoginAdmin from "./LoginAdmin";

function Dashboard() {
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [bookingDateFilter, setbookingDateFilter] = useState(new Date().toISOString().slice(0, 10));
  const [bookingObject, setBookingObject] = useState([]);
  const [openTable, setOpenTable] = useState(false);
  const [openEmployeeTable, setOpenEmployeeTable] = useState(false);
  const [filteredBooking, setFilteredBooking] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [employeeDataFilter, setEmployeeDataFilter] = useState([]);
  const [expand, setExpand] = useState("");
  const [companyData, setCompanyData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [dateRange, setDateRange] = useState("by-today");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filteredDataDateRange, setFilteredDataDateRange] = useState([]);
  const [showUpdates, setShowUpdates] = useState(false);
  const [followData, setfollowData] = useState([])
  const [openProjectionTable, setopenProjectionTable] = useState(false)
  const [projectedEmployee, setProjectedEmployee] = useState([]);
  const [displayDateRange, setDateRangeDisplay] = useState(false)
  const [displayDateRangeEmployee, setDateRangeDisplayEmployee] = useState(false)
  const [buttonToggle, setButtonToggle] = useState(false);
  const [projectedDataDateRange, setProjectedDataDateRange] = useState([])
  const [startDateEmployee, setStartDateEmployee] = useState(new Date());
  const [endDateEmployee, setEndDateEmployee] = useState(new Date());
  const [showBookingDate, setShowBookingDate] = useState(false)
  const [startDateAnother, setStartDateAnother] = useState(new Date());
  const [endDateAnother, setEndDateAnother] = useState(new Date());
  const [sortType, setSortType] = useState({
    untouched: "none",
    notPickedUp: "none",
    busy: "none",
    junk: "none",
    notInterested: "none",
    followUp: "none",
    matured: "none",
    interested: "none",
    lastLead: "none",
    totalLeads: 'none'
  });

  const [searchOption, setSearchOption] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sideBar, setsideBar] = useState(false)
  const [displayArrow, setDisplayArrow] = useState(true)
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const convertedDate = date.toLocaleDateString();
    return convertedDate;
  };

  const dateRangePickerRef = useRef(null);
  const dateRangePickerProhectionRef = useRef(null);
  const dateRangePickerEmployeeRef = useRef(null);

  // https://startupsahay.in/api
  const fetchCompanyData = async () => {
    fetch(`${secretKey}/leads`)
      .then((response) => response.json())
      .then((data) => {
        setCompanyData(data.filter((obj) => obj.ename !== "Not Alloted"));
        setcompanyDataFilter(data.filter((obj) => obj.ename !== "Not Alloted"));

      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const fetchEmployeeInfo = async () => {
    fetch(`${secretKey}/einfo`)
      .then((response) => response.json())
      .then((data) => {
        setEmployeeData(data);
        setEmployeeDataFilter(data)
        // setEmployeeDataFilter(data.filter)
      })
      .catch((error) => {
        console.error(`Error Fetching Employee Data `, error);
      });
  };
  const debounceDelay = 300;

  // Wrap the fetch functions with debounce
  const debouncedFetchCompanyData = debounce(fetchCompanyData, debounceDelay);
  const debouncedFetchEmployeeInfo = debounce(fetchEmployeeInfo, debounceDelay);
  const fetchData = async () => {
    if (showUpdates) {
      try {
        // Make a GET request to fetch recent updates data
        const response = await axios.get(`${secretKey}/recent-updates`);
        // Set the retrieved data in the state
        setRecentUpdates(response.data);
      } catch (error) {
        console.error("Error fetching recent updates:", error.message);
      }
    } else {
      setRecentUpdates([]);
    }
  };
  const fetchCompanies = async () => {
    try {
      let url;
      if (startDateAnother === endDateAnother) {
        // If start and end dates are the same, fetch data for a single date
        url = `${secretKey}/booking-model-filter?date=${startDateAnother}`;
      } else {
        // If start and end dates are different, fetch data for a date range
        url = `${secretKey}/booking-model-filter?startDate=${startDateAnother}&endDate=${endDateAnother}`;
      }

      const response = await axios.get(url);
      const data = response.data.leads;
      console.log(` startDate : ${startDateAnother} , endDate : ${endDateAnother}`, data);

      // Update state with the fetched data
      setBookingObject(data);
      setFilteredBooking(data);
    } catch (error) {
      console.error("Error Fetching Booking Details", error.message);
    }
  };
  useEffect(() => {




    // Call the fetchData function when the component mounts

    fetchCompanies();
    debouncedFetchCompanyData();
    debouncedFetchEmployeeInfo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    fetchCompanies();
  }, [startDateAnother, endDateAnother])

  useEffect(() => {
    fetchData();
  }, [showUpdates])

  const uniqueBdeNames = new Set();

  const formatTime = (date, time) => {
    const currentDate = new Date().toLocaleDateString();
    const newTime = new Date().toLocaleTimeString();
    const pm =
      time !== undefined
        ? time.toLowerCase().includes("pm")
          ? true
          : false
        : newTime;
    const currentDateTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (date === currentDate) {
      const [hour, minute, second] = time.split(/:| /).map(Number);
      const formattedHour = pm ? hour + 12 : hour;
      const formattedTime = `${formattedHour}:${minute}`;
      return formattedTime;
    } else if (date === currentDate - 1) {
      return "Yesterday";
    } else {
      return date;
    }
  };
  const changeUpdate = () => {
    setShowUpdates(!showUpdates);
  };

  const handleChangeDate = (filter) => {
    setDateRange(filter);
    const today = new Date(); // Current date

    if (filter === "by-week") {
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000); // Date 7 days ago

      const newfilteredData = bookingObject.filter((company) => {
        const companyDate = new Date(company.bookingDate);
        return companyDate >= lastWeek && companyDate <= today;
      });
      setFilteredBooking(newfilteredData);
    } else if (filter === "by-month") {
      const lastMonth = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        today.getDate()
      ); // Date 1 month ago

      const newfilteredData = bookingObject.filter((company) => {
        const companyDate = new Date(company.bookingDate);
        return companyDate >= lastMonth && companyDate <= today;
      });
      setFilteredBooking(newfilteredData);
    } else if (filter === "by-year") {
      const lastYear = new Date(
        today.getFullYear() - 1,
        today.getMonth(),
        today.getDate()
      ); // Date 1 year ago

      const newfilteredData = bookingObject.filter((company) => {
        const companyDate = new Date(company.bookingDate);
        return companyDate >= lastYear && companyDate <= today;
      });
      setFilteredBooking(newfilteredData);
    } else if (filter === "by-today") {
      const newfilteredData = bookingObject.filter((company) => {
        const companyDate = new Date(company.bookingDate);
        return companyDate.toLocaleDateString() === today.toLocaleDateString();
      });
      setFilteredBooking(newfilteredData);
    }
  };
  const finalFilteredData = [];

  filteredBooking.forEach((obj) => {
    // Check if the bdeName is already in the Set

    if (!uniqueBdeNames.has(obj.bdeName)) {
      // If not, add it to the Set and push the object to the final array
      uniqueBdeNames.add(obj.bdeName);
      finalFilteredData.push(obj);
    }
  });
  const [expandedRow, setExpandedRow] = useState(null);
  const [tableEmployee, setTableEmployee] = useState("");

  const handleRowClick = (index, tableEmployee) => {
    setExpandedRow(expandedRow === index ? null : index);
    setTableEmployee(tableEmployee);
    functionOpenTable();
  };
  const handleExpandRowClick = (index) => {
    setExpand(index);
  };
  // Now finalFilteredData contains an array of objects with unique bdeNames

  const functionOpenTable = () => {
    setOpenTable(true);
  };
  const functionOpenEmployeeTable = (employee) => {
    setOpenEmployeeTable(true);
    setSelectedEmployee(employee);
  };
  const closeEmployeeTable = () => {
    setOpenEmployeeTable(false);
  };
  const closeTable = () => {
    setOpenTable(false);
    setExpand("");
  };

  const formattedDates =
    companyData.length !== 0 &&
    selectedEmployee !== "" &&
    companyData
      .filter((data) => data.ename === selectedEmployee) // Filter data based on ename
      .map((data) => formatDate(data.AssignDate));

  const uniqueArray = formattedDates && [...new Set(formattedDates)];

  const properCompanyData =
    selectedEmployee !== "" &&
    companyData.filter((obj) => obj.ename === selectedEmployee);

  const handleCloseIconClickAnother = () => {
    if (showBookingDate) {
      setShowBookingDate(false)
    }
  }
  const selectionRangeAnother = {
    startDate: startDateAnother,
    endDate: endDateAnother,
    key: "selection",
  };
  const handleSelectAnother = (date) => {
    const filteredDataDateRange = bookingObject.filter((product) => {
      const productDate = new Date(product["bookingDate"]);
      return (
        productDate >= date.selection.startDate &&
        productDate <= date.selection.endDate
      );
    });
    setStartDateAnother(date.selection.startDate);
    setEndDateAnother(date.selection.endDate);
    setFilteredBooking(filteredDataDateRange);
  };

  //console.log("companyData", companyData)
  //console.log("employeeData", employeeData)

  // ----------------------------------projection-dashboard-----------------------------------------------

  const [followDataToday, setfollowDataToday] = useState([])


  const fetchFollowUpData = async () => {

    try {
      const response = await fetch(`${secretKey}/projection-data`);
      const followdata = await response.json();
      setfollowData(followdata)
      //console.log("followdata", followdata)
      setfollowDataToday(
        followdata.filter((company) => {
          // Assuming you want to filter companies with an estimated payment date for today
          const today = new Date().toISOString().split("T")[0]; // Get today's date in the format 'YYYY-MM-DD'
          return company.estPaymentDate === today;
        })
      );

    } catch (error) {
      console.error('Error fetching data:', error);
      return { error: 'Error fetching data' };
    }
  }

  console.log(followDataToday)

  useEffect(() => {
    fetchFollowUpData();
  }, []);

  const uniqueEnames = [...new Set(followData.map(item => item.ename))];

  const servicesByEname = followData.reduce((acc, curr) => {
    // Check if ename already exists in the accumulator
    if (acc[curr.ename]) {
      // If exists, concatenate the services array
      acc[curr.ename] = acc[curr.ename].concat(curr.offeredServices);
    } else {
      // If not exists, create a new entry with the services array
      acc[curr.ename] = curr.offeredServices;
    }
    return acc;
  }, []);

  //console.log(servicesByEname)

  const totalservicesByEname = followData.reduce((acc, curr) => {
    // Concatenate all offeredServices into a single array
    acc = acc.concat(curr.offeredServices);
    return acc;
  }, []);

  //console.log(totalservicesByEname);


  const companiesByEname = followData.reduce((accumulate, current) => {
    if (accumulate[current.ename]) {
      if (Array.isArray(accumulate[current.ename])) {
        accumulate[current.ename].push(current.companyName);
      } else {
        accumulate[current.ename] = [accumulate[current.ename], current.companyName];
      }
    } else {
      accumulate[current.ename] = current.companyName;
    }
    return accumulate;
  }, []);

  //console.log(companiesByEname)


  const totalcompaniesByEname = followData.reduce((accumulate, current) => {
    accumulate = accumulate.concat(current.companyName);
    return accumulate
  }, [])

  //console.log(totalcompaniesByEname)

  function calculateSum(data) {
    const initialValue = {};

    const sum = data.reduce((accumulator, current) => {
      const { ename, totalPayment, offeredPrize } = current;

      // If the ename already exists in the accumulator, accumulate the totalPayment and offeredPrize
      if (accumulator[ename]) {
        accumulator[ename].totalPaymentSum += totalPayment;
        accumulator[ename].offeredPaymentSum += offeredPrize;
      } else {
        // If the ename does not exist in the accumulator, initialize it
        accumulator[ename] = {
          totalPaymentSum: totalPayment,
          offeredPaymentSum: offeredPrize
        };
      }
      return accumulator;
    }, initialValue);


    return sum;
  }

  // Calculate the sums
  const sums = calculateSum(followData);

  //console.log("sum", sums)

  let totalTotalPaymentSum = 0;
  let totalOfferedPaymentSum = 0;

  for (const key in sums) {
    totalTotalPaymentSum += sums[key].totalPaymentSum;
    totalOfferedPaymentSum += sums[key].offeredPaymentSum;
  }

  const lastFollowDate = followData.reduce((accumulate, current) => {
    if (accumulate[current.ename]) {
      if (Array.isArray(accumulate[current.ename])) {
        accumulate[current.ename].push(current.estPaymentDate);
      } else {
        accumulate[current.ename] = [accumulate[current.ename], current.estPaymentDate];
      }
    } else {
      accumulate[current.ename] = current.estPaymentDate;
    }
    return accumulate;
  }, []);

  console.log(lastFollowDate)

  console.log(followData)

  const [projectionEname, setProjectionEname] = useState("")
  console.log(projectionEname)

  const [projectedDataToday, setprojectedDataToday] = useState([])
  //console.log("Total totalPaymentSum:", totalTotalPaymentSum);
  //console.log("Total offeredPaymentSum:", totalOfferedPaymentSum);
  const functionOpenProjectionTable = (ename) => {
    setProjectionEname(ename)
    //console.log("Ename:", ename)
    setopenProjectionTable(true);
    const projectedData = followData.filter(obj => obj.ename === ename);
    const projectedDataDateRange = filteredDataDateRange.filter(obj => obj.ename === ename)
    const projectedDataToday = followDataToday.filter(obj => obj.ename === ename)
    console.log(projectedDataDateRange)
    setProjectedEmployee(projectedData);
    setProjectedDataDateRange(projectedDataDateRange)
    setprojectedDataToday(projectedDataToday)
  };
  //console.log(projectedEmployee)
  //console.log(projectedDataDateRange)

  console.log(projectedDataToday)
  const closeProjectionTable = () => {
    setopenProjectionTable(false);
  };

  function calculateSumPopup(data) {
    const initialValue = { totalPaymentSumPopup: 0, offeredPaymentSumPopup: 0, offeredServicesPopup: [] };

    const sum = data.reduce((accumulator, currentValue) => {
      // Concatenate offeredServices from each object into a single array
      const offeredServicesPopup = accumulator.offeredServicesPopup.concat(currentValue.offeredServices);

      return {
        totalPaymentSumPopup: accumulator.totalPaymentSumPopup + currentValue.totalPayment,
        offeredPaymentSumPopup: accumulator.offeredPaymentSumPopup + currentValue.offeredPrize,
        offeredServicesPopup: offeredServicesPopup
      };
    }, initialValue);

    // // Remove duplicate services from the array
    // sum.offeredServices = Array.from(new Set(sum.offeredServices));

    return sum;
  }

  // Calculate the sums
  const { totalPaymentSumPopup, offeredPaymentSumPopup, offeredServicesPopup } = calculateSumPopup(projectedEmployee);
  //console.log(totalPaymentSumPopup)
  //console.log(offeredPaymentSumPopup)
  // console.log(offeredServicesPopup)

  // --------------------------------- date-range-picker-------------------------------------

  const handleIconClick = () => {
    if (!buttonToggle) {
      setDateRangeDisplay(true);
    } else {
      setDateRangeDisplay(false);
    }
    setButtonToggle(!buttonToggle);
  };


  const handleClickOutside = (event) => {
    if (dateRangePickerRef.current && !dateRangePickerRef.current.contains(event.target)) {
      setShowBookingDate(false);
    }
  };

  // Add event listener when the component mounts
  useEffect(() => {
    const totalBookingElement = document.getElementById('totalbooking');

    if (totalBookingElement) {
      totalBookingElement.addEventListener('click', handleClickOutside);

      return () => {
        totalBookingElement.removeEventListener('click', handleClickOutside);
      };
    }
  }, []);

  const handleClickOutsideProjection = (event) => {
    if (dateRangePickerProhectionRef.current && !dateRangePickerProhectionRef.current.contains(event.target)) {
      setDateRangeDisplay(false);
    }
  };

  // Add event listener when the component mounts
  useEffect(() => {
    const totalBookingElement = document.getElementById('projectionsummaryadmin');
    if (totalBookingElement) {
      totalBookingElement.addEventListener('click', handleClickOutsideProjection);
      // Remove event listener when the component unmounts
      return () => {
        totalBookingElement.removeEventListener('click', handleClickOutsideProjection);
      };

    }

  }, []);




  const handleCloseIconClick = () => {
    if (displayDateRange) {
      setDateRangeDisplay(false)
    }
  }

  const handleClickOutsideEmployee = (event) => {
    if (dateRangePickerEmployeeRef.current && !dateRangePickerEmployeeRef.current.contains(event.target)) {
      setDateRangeDisplayEmployee(false)
    }
  };

  // Add event listener when the component mounts
  useEffect(() => {
    const totalBookingElement = document.getElementById('employeedashboardadmin');

    if (totalBookingElement) {
      totalBookingElement.addEventListener('click', handleClickOutsideEmployee);
      // Remove event listener when the component unmounts
      return () => {
        totalBookingElement.removeEventListener('click', handleClickOutsideEmployee);
      };

    }

  }, []);

  const [selectedDateRange, setSelectedDateRange] = useState([]);
  console.log(selectedDateRange)

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: 'selection',
  };

  // const handleSelect = (date) => {
  //   const filteredDataDateRange = followData.filter(product => {
  //     const productDate = new Date(product["estPaymentDate"]);
  //     if (formatDate(date.selection.startDate) === formatDate(date.selection.endDate)) {
  //       console.log(formatDate(date.selection.startDate))
  //       console.log(formatDate(date.selection.endDate))
  //       console.log(formatDate(productDate))
  //       return formatDate(productDate) === formatDate(date.selection.startDate);
  //     } else {
  //       return (
  //         productDate >= date.selection.startDate &&
  //         productDate <= date.selection.endDate
  //       );
  //     }
  //   });
  //   setStartDate(date.selection.startDate);
  //   setEndDate(date.selection.endDate);
  //   setFilteredDataDateRange(filteredDataDateRange);
  //   //console.log(filteredDataDateRange)
  // };

  const handleSelect = (values) => {
    // Extract startDate and endDate from the values array
    const startDate = values[0];
    const endDate = values[1];

    // Filter followData based on the selected date range
    const filteredDataDateRange = followData.filter(product => {
      const productDate = new Date(product["estPaymentDate"]);

      // Check if the productDate is within the selected date range
      return (
        productDate >= startDate &&
        productDate <= endDate
      );
    });

    // Set the startDate, endDate, and filteredDataDateRange states
    setStartDate(startDate);
    setEndDate(endDate);
    setFilteredDataDateRange(filteredDataDateRange);
  };

  //console.log("kuch" , filteredDataDateRange)

  const servicesByEnameDateRange = filteredDataDateRange.reduce((acc, curr) => {
    // Check if ename already exists in the accumulator
    if (acc[curr.ename]) {
      // If exists, concatenate the services array
      acc[curr.ename] = acc[curr.ename].concat(curr.offeredServices);
    } else {
      // If not exists, create a new entry with the services array
      acc[curr.ename] = curr.offeredServices;
    }
    return acc;
  }, []);


  const servicesByEnameToday = followDataToday.reduce((acc, curr) => {
    // Check if ename already exists in the accumulator
    if (acc[curr.ename]) {
      // If exists, concatenate the services array
      acc[curr.ename] = acc[curr.ename].concat(curr.offeredServices);
    } else {
      // If not exists, create a new entry with the services array
      acc[curr.ename] = curr.offeredServices;
    }
    return acc;
  }, []);

  //console.log(servicesByEnameDateRange)

  const totalservicesByEnameDateRange = filteredDataDateRange.reduce((acc, curr) => {
    // Concatenate all offeredServices into a single array
    acc = acc.concat(curr.offeredServices);
    return acc;
  }, []);

  const totalservicesByEnameToday = followDataToday.reduce((acc, curr) => {
    // Concatenate all offeredServices into a single array
    acc = acc.concat(curr.offeredServices);
    return acc;
  }, []);


  //onsole.log(totalservicesByEnameDateRange)

  const companiesByEnameDateRange = filteredDataDateRange.reduce((accumulate, current) => {
    if (accumulate[current.ename]) {
      if (Array.isArray(accumulate[current.ename])) {
        accumulate[current.ename].push(current.companyName);
      } else {
        accumulate[current.ename] = [accumulate[current.ename], current.companyName];
      }
    } else {
      accumulate[current.ename] = [current.companyName];
    }
    return accumulate;
  }, []);

  const companiesByEnameToday = followDataToday.reduce((accumulate, current) => {
    if (accumulate[current.ename]) {
      if (Array.isArray(accumulate[current.ename])) {
        accumulate[current.ename].push(current.companyName);
      } else {
        accumulate[current.ename] = [accumulate[current.ename], current.companyName];
      }
    } else {
      accumulate[current.ename] = [current.companyName];
    }
    return accumulate;
  }, []);

  //console.log(companiesByEnameDateRange)

  const totalcompaniesByEnameDateRange = filteredDataDateRange.reduce((accumulate, current) => {
    accumulate = accumulate.concat(current.companyName);
    return accumulate
  }, [])

  const totalcompaniesByEnameToday = followDataToday.reduce((accumulate, current) => {
    accumulate = accumulate.concat(current.companyName);
    return accumulate
  }, [])

  //console.log(totalcompaniesByEnameDateRange)


  function calculateSumDateRange(data) {
    const initialValue = {};

    const sum = data.reduce((accumulator, current) => {
      const { ename, totalPayment, offeredPrize } = current;

      // If the ename already exists in the accumulator, accumulate the totalPayment and offeredPrize
      if (accumulator[ename]) {
        accumulator[ename].totalPaymentSum += totalPayment;
        accumulator[ename].offeredPaymentSum += offeredPrize;
      } else {
        // If the ename does not exist in the accumulator, initialize it
        accumulator[ename] = {
          totalPaymentSum: totalPayment,
          offeredPaymentSum: offeredPrize
        };
      }
      return accumulator;
    }, initialValue);


    return sum;
  }

  // Calculate the sums
  const sumsDateRange = calculateSumDateRange(filteredDataDateRange);

  //console.log(sumsDateRange)
  function calculateSumToday(data) {
    const initialValue = {};

    const sum = data.reduce((accumulator, current) => {
      const { ename, totalPayment, offeredPrize } = current;

      // If the ename already exists in the accumulator, accumulate the totalPayment and offeredPrize
      if (accumulator[ename]) {
        accumulator[ename].totalPaymentSum += totalPayment;
        accumulator[ename].offeredPaymentSum += offeredPrize;
      } else {
        // If the ename does not exist in the accumulator, initialize it
        accumulator[ename] = {
          totalPaymentSum: totalPayment,
          offeredPaymentSum: offeredPrize
        };
      }
      return accumulator;
    }, initialValue);


    return sum;
  }

  // Calculate the sums
  const sumsToday = calculateSumToday(followDataToday);





  let totalTotalPaymentSumDateRange = 0;
  let totalOfferedPaymentSumDateRange = 0;

  // Iterate over the values of sumsDateRange object
  Object.values(sumsDateRange).forEach(({ totalPaymentSum, offeredPaymentSum }) => {
    totalTotalPaymentSumDateRange += totalPaymentSum;
    totalOfferedPaymentSumDateRange += offeredPaymentSum;
  });


  let totalTotalPaymentSumToday = 0;
  let totalOfferedPaymentSumToday = 0;

  // Iterate over the values of sumsDateRange object
  Object.values(sumsToday).forEach(({ totalPaymentSum, offeredPaymentSum }) => {
    totalTotalPaymentSumToday += totalPaymentSum;
    totalOfferedPaymentSumToday += offeredPaymentSum;
  });


  //console.log("Total Total Payment Sum Date Range:", totalTotalPaymentSumDateRange);
  //console.log("Total Offered Payment Sum Date Range:", totalOfferedPaymentSumDateRange);

  function calculateSumPopupDateRange(data) {
    const initialValue = { totalPaymentSumPopupDateRange: 0, offeredPaymentSumPopupDateRange: 0, offeredServicesPopupDateRange: [] };

    const sum = data.reduce((accumulator, currentValue) => {
      // Concatenate offeredServices from each object into a single array
      const offeredServicesPopupDateRange = accumulator.offeredServicesPopupDateRange.concat(currentValue.offeredServices);

      return {
        totalPaymentSumPopupDateRange: accumulator.totalPaymentSumPopupDateRange + currentValue.totalPayment,
        offeredPaymentSumPopupDateRange: accumulator.offeredPaymentSumPopupDateRange + currentValue.offeredPrize,
        offeredServicesPopupDateRange: offeredServicesPopupDateRange
      };
    }, initialValue);

    // // Remove duplicate services from the array
    // sum.offeredServices = Array.from(new Set(sum.offeredServices));

    return sum;
  }

  // Calculate the sums
  const { totalPaymentSumPopupDateRange, offeredPaymentSumPopupDateRange, offeredServicesPopupDateRange } = calculateSumPopupDateRange(projectedDataDateRange);
  // console.log(totalPaymentSumPopupDateRange)
  // console.log(offeredPaymentSumPopupDateRange)
  // console.log(offeredServicesPopupDateRange)


  function calculateSumPopupToday(data) {
    const initialValue = { totalPaymentSumPopupToday: 0, offeredPaymentSumPopupToday: 0, offeredServicesPopupToday: [] };

    const sum = data.reduce((accumulator, currentValue) => {
      // Concatenate offeredServices from each object into a single array
      const offeredServicesPopupToday = accumulator.offeredServicesPopupToday.concat(currentValue.offeredServices);

      return {
        totalPaymentSumPopupToday: accumulator.totalPaymentSumPopupToday + currentValue.totalPayment,
        offeredPaymentSumPopupToday: accumulator.offeredPaymentSumPopupToday + currentValue.offeredPrize,
        offeredServicesPopupToday: offeredServicesPopupToday
      };
    }, initialValue);

    // // Remove duplicate services from the array
    // sum.offeredServices = Array.from(new Set(sum.offeredServices));

    return sum;
  }

  // Calculate the sums
  const { totalPaymentSumPopupToday, offeredPaymentSumPopupToday, offeredServicesPopupToday } = calculateSumPopupToday(projectedDataToday);



  // -------------------------------------------------------------sorting ascending-descending------------------------------------------

  const [incoFilter, setIncoFilter] = useState("");
  const [originalEmployeeData, setOriginalEmployeeData] = useState([]);
  const [openFilters, setOpenFilters] = useState({
    untouched: false,
    busy: false,
    notPickedUp: false,
    junk: false,
    followUp: false,
    interested: false,
    notInterested: false,
    matured: false,
    totalLeads: false,
    lastleadassign: false,
  });


  const handleFilterIncoDate = (header) => {
    setOpenFilters(prevState => {
      const updatedState = {};
      for (const key in prevState) {
        updatedState[key] = key === header ? !prevState[header] : false;
      }
      return updatedState;
    });
  };
  //-------------------------- Sort filteres for different status  -------------------------------------------------------------------------
  const handleSortUntouched = (sortBy1) => {
    setSortType(prevData => ({
      ...prevData,
      untouched: prevData.untouched === "ascending"
        ? "descending"
        : prevData.untouched === "descending"
          ? "none"
          : "ascending"
    }));

    switch (sortBy1) {

      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {}
        companyData.forEach((company) => {
          if ((company.Status === "Untouched")
          ) {
            untouchedCountAscending[company.ename] = (untouchedCountAscending[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
        employeeData.sort((a, b) => {
          const countA = untouchedCountAscending[a.ename] || 0;
          const countB = untouchedCountAscending[b.ename] || 0;
          return countA - countB; // Sort in ascending order of "Untouched" count
        });

        break;
      case "descending":
        setIncoFilter("descending");
        const untouchedCount = {};
        companyData.forEach((company) => {
          if ((company.Status === "Untouched")
          ) {
            untouchedCount[company.ename] = (untouchedCount[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses
        employeeData.sort((a, b) => {
          const countA = untouchedCount[a.ename] || 0;
          const countB = untouchedCount[b.ename] || 0;
          return countB - countA; // Sort in descending order of "Untouched" count
        });
        break;
      case "none":
        setIncoFilter("none");
        if (originalEmployeeData.length > 0) {
          // Restore to previous state
          setEmployeeData(originalEmployeeData);
        }
        break;
      default:
        break;

    }
  };
  const handleSortNotPickedUp = (sortBy1) => {
    setSortType(prevData => ({
      ...prevData,
      notPickedUp: prevData.notPickedUp === "ascending"
        ? "descending"
        : prevData.notPickedUp === "descending"
          ? "none"
          : "ascending"
    }));

    switch (sortBy1) {

      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {}
        companyData.forEach((company) => {
          if ((company.Status === "Not Picked Up")
            // (openFilters.busy && company.Status === "Busy") ||
            // (openFilters.notPickedUp && company.Status === "Not Picked Up") ||
            // (openFilters.junk && company.Status === "Junk") ||
            // (openFilters.followUp && company.Status === "FollowUp") ||
            // (openFilters.interested && company.Status === "Interested") ||
            // (openFilters.notInterested && company.Status === "Not Interested") ||
            // (openFilters.matured && company.Status === "Matured") ||
            // (openFilters.totalLeads) ||
            // (openFilters.lastleadassign)
          ) {
            untouchedCountAscending[company.ename] = (untouchedCountAscending[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
        employeeData.sort((a, b) => {
          const countA = untouchedCountAscending[a.ename] || 0;
          const countB = untouchedCountAscending[b.ename] || 0;
          return countA - countB; // Sort in ascending order of "Untouched" count
        });
        // ||
        // (openFilters.busy && company.Status === "Busy") ||
        // (openFilters.notPickedUp && company.Status === "Not Picked Up") ||
        // (openFilters.junk && company.Status === "Junk") ||
        // (openFilters.followUp && company.Status === "FollowUp") ||
        // (openFilters.interested && company.Status === "Interested") ||
        // (openFilters.notInterested && company.Status === "Not Interested") ||
        // (openFilters.matured && company.Status === "Matured") ||
        // (openFilters.totalLeads) ||
        // (openFilters.lastleadassign)
        break;
      case "descending":
        setIncoFilter("descending");
        const untouchedCount = {};
        companyData.forEach((company) => {
          if ((company.Status === "Not Picked Up")
          ) {
            untouchedCount[company.ename] = (untouchedCount[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses
        employeeData.sort((a, b) => {
          const countA = untouchedCount[a.ename] || 0;
          const countB = untouchedCount[b.ename] || 0;
          return countB - countA; // Sort in descending order of "Untouched" count
        });
        break;
      case "none":
        setIncoFilter("none");
        if (originalEmployeeData.length > 0) {
          // Restore to previous state
          setEmployeeData(originalEmployeeData);
        }
        break;
      default:
        break;

    }
  };

  // for busy

  const handleSortbusy = (sortBy1) => {
    setSortType(prevData => ({
      ...prevData,
      busy: prevData.busy === "ascending"
        ? "descending"
        : prevData.busy === "descending"
          ? "none"
          : "ascending"
    }));
    switch (sortBy1) {

      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {}
        companyData.forEach((company) => {
          if ((company.Status === "Busy")

          ) {
            untouchedCountAscending[company.ename] = (untouchedCountAscending[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
        employeeData.sort((a, b) => {
          const countA = untouchedCountAscending[a.ename] || 0;
          const countB = untouchedCountAscending[b.ename] || 0;
          return countA - countB; // Sort in ascending order of "Untouched" count
        });

        break;
      case "descending":
        setIncoFilter("descending");
        const untouchedCount = {};
        companyData.forEach((company) => {
          if ((company.Status === "Busy")
          ) {
            untouchedCount[company.ename] = (untouchedCount[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses
        employeeData.sort((a, b) => {
          const countA = untouchedCount[a.ename] || 0;
          const countB = untouchedCount[b.ename] || 0;
          return countB - countA; // Sort in descending order of "Untouched" count
        });
        break;
      case "none":
        setIncoFilter("none");
        if (originalEmployeeData.length > 0) {
          // Restore to previous state
          setEmployeeData(originalEmployeeData);
        }
        break;
      default:
        break;

    }
  };
  const handleSortInterested = (sortBy1) => {
    setSortType(prevData => ({
      ...prevData,
      interested: prevData.interested === "ascending"
        ? "descending"
        : prevData.interested === "descending"
          ? "none"
          : "ascending"
    }));
    switch (sortBy1) {

      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {}
        companyData.forEach((company) => {
          if ((company.Status === "Interested")
            // (openFilters.busy && company.Status === "Busy") ||
            // (openFilters.notPickedUp && company.Status === "Not Picked Up") ||
            // (openFilters.junk && company.Status === "Junk") ||
            // (openFilters.followUp && company.Status === "FollowUp") ||
            // (openFilters.interested && company.Status === "Interested") ||
            // (openFilters.notInterested && company.Status === "Not Interested") ||
            // (openFilters.matured && company.Status === "Matured") ||
            // (openFilters.totalLeads) ||
            // (openFilters.lastleadassign)
          ) {
            untouchedCountAscending[company.ename] = (untouchedCountAscending[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
        employeeData.sort((a, b) => {
          const countA = untouchedCountAscending[a.ename] || 0;
          const countB = untouchedCountAscending[b.ename] || 0;
          return countA - countB; // Sort in ascending order of "Untouched" count
        });
        // ||
        // (openFilters.busy && company.Status === "Busy") ||
        // (openFilters.notPickedUp && company.Status === "Not Picked Up") ||
        // (openFilters.junk && company.Status === "Junk") ||
        // (openFilters.followUp && company.Status === "FollowUp") ||
        // (openFilters.interested && company.Status === "Interested") ||
        // (openFilters.notInterested && company.Status === "Not Interested") ||
        // (openFilters.matured && company.Status === "Matured") ||
        // (openFilters.totalLeads) ||
        // (openFilters.lastleadassign)
        break;
      case "descending":
        setIncoFilter("descending");
        const untouchedCount = {};
        companyData.forEach((company) => {
          if ((company.Status === "Interested")
          ) {
            untouchedCount[company.ename] = (untouchedCount[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses
        employeeData.sort((a, b) => {
          const countA = untouchedCount[a.ename] || 0;
          const countB = untouchedCount[b.ename] || 0;
          return countB - countA; // Sort in descending order of "Untouched" count
        });
        break;
      case "none":
        setIncoFilter("none");
        if (originalEmployeeData.length > 0) {
          // Restore to previous state
          setEmployeeData(originalEmployeeData);
        }
        break;
      default:
        break;

    }
  };
  const handleSortMatured = (sortBy1) => {
    setSortType(prevData => ({
      ...prevData,
      matured: prevData.matured === "ascending"
        ? "descending"
        : prevData.matured === "descending"
          ? "none"
          : "ascending"
    }));
    switch (sortBy1) {

      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {}
        companyData.forEach((company) => {
          if ((company.Status === "Matured")
            // (openFilters.busy && company.Status === "Busy") ||
            // (openFilters.notPickedUp && company.Status === "Not Picked Up") ||
            // (openFilters.junk && company.Status === "Junk") ||
            // (openFilters.followUp && company.Status === "FollowUp") ||
            // (openFilters.interested && company.Status === "Interested") ||
            // (openFilters.notInterested && company.Status === "Not Interested") ||
            // (openFilters.matured && company.Status === "Matured") ||
            // (openFilters.totalLeads) ||
            // (openFilters.lastleadassign)
          ) {
            untouchedCountAscending[company.ename] = (untouchedCountAscending[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
        employeeData.sort((a, b) => {
          const countA = untouchedCountAscending[a.ename] || 0;
          const countB = untouchedCountAscending[b.ename] || 0;
          return countA - countB; // Sort in ascending order of "Untouched" count
        });
        // ||
        // (openFilters.busy && company.Status === "Busy") ||
        // (openFilters.notPickedUp && company.Status === "Not Picked Up") ||
        // (openFilters.junk && company.Status === "Junk") ||
        // (openFilters.followUp && company.Status === "FollowUp") ||
        // (openFilters.interested && company.Status === "Interested") ||
        // (openFilters.notInterested && company.Status === "Not Interested") ||
        // (openFilters.matured && company.Status === "Matured") ||
        // (openFilters.totalLeads) ||
        // (openFilters.lastleadassign)
        break;
      case "descending":
        setIncoFilter("descending");
        const untouchedCount = {};
        companyData.forEach((company) => {
          if ((company.Status === "Matured")
          ) {
            untouchedCount[company.ename] = (untouchedCount[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses
        employeeData.sort((a, b) => {
          const countA = untouchedCount[a.ename] || 0;
          const countB = untouchedCount[b.ename] || 0;
          return countB - countA; // Sort in descending order of "Untouched" count
        });
        break;
      case "none":
        setIncoFilter("none");
        if (originalEmployeeData.length > 0) {
          // Restore to previous state
          setEmployeeData(originalEmployeeData);
        }
        break;
      default:
        break;

    }
  };
  const handleSortNotInterested = (sortBy1) => {
    setSortType(prevData => ({
      ...prevData,
      notInterested: prevData.notInterested === "ascending"
        ? "descending"
        : prevData.notInterested === "descending"
          ? "none"
          : "ascending"
    }));
    switch (sortBy1) {

      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {}
        companyData.forEach((company) => {
          if ((company.Status === "Not Interested")
            // (openFilters.busy && company.Status === "Busy") ||
            // (openFilters.notPickedUp && company.Status === "Not Picked Up") ||
            // (openFilters.junk && company.Status === "Junk") ||
            // (openFilters.followUp && company.Status === "FollowUp") ||
            // (openFilters.interested && company.Status === "Interested") ||
            // (openFilters.notInterested && company.Status === "Not Interested") ||
            // (openFilters.matured && company.Status === "Matured") ||
            // (openFilters.totalLeads) ||
            // (openFilters.lastleadassign)
          ) {
            untouchedCountAscending[company.ename] = (untouchedCountAscending[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
        employeeData.sort((a, b) => {
          const countA = untouchedCountAscending[a.ename] || 0;
          const countB = untouchedCountAscending[b.ename] || 0;
          return countA - countB; // Sort in ascending order of "Untouched" count
        });
        // ||
        // (openFilters.busy && company.Status === "Busy") ||
        // (openFilters.notPickedUp && company.Status === "Not Picked Up") ||
        // (openFilters.junk && company.Status === "Junk") ||
        // (openFilters.followUp && company.Status === "FollowUp") ||
        // (openFilters.interested && company.Status === "Interested") ||
        // (openFilters.notInterested && company.Status === "Not Interested") ||
        // (openFilters.matured && company.Status === "Matured") ||
        // (openFilters.totalLeads) ||
        // (openFilters.lastleadassign)
        break;
      case "descending":
        setIncoFilter("descending");
        const untouchedCount = {};
        companyData.forEach((company) => {
          if ((company.Status === "Not Interested")
          ) {
            untouchedCount[company.ename] = (untouchedCount[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses
        employeeData.sort((a, b) => {
          const countA = untouchedCount[a.ename] || 0;
          const countB = untouchedCount[b.ename] || 0;
          return countB - countA; // Sort in descending order of "Untouched" count
        });
        break;
      case "none":
        setIncoFilter("none");
        if (originalEmployeeData.length > 0) {
          // Restore to previous state
          setEmployeeData(originalEmployeeData);
        }
        break;
      default:
        break;

    }
  };
  const handleSortJunk = (sortBy1) => {
    setSortType(prevData => ({
      ...prevData,
      junk: prevData.junk === "ascending"
        ? "descending"
        : prevData.junk === "descending"
          ? "none"
          : "ascending"
    }));
    switch (sortBy1) {

      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {}
        companyData.forEach((company) => {
          if ((company.Status === "Junk")

          ) {
            untouchedCountAscending[company.ename] = (untouchedCountAscending[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
        employeeData.sort((a, b) => {
          const countA = untouchedCountAscending[a.ename] || 0;
          const countB = untouchedCountAscending[b.ename] || 0;
          return countA - countB; // Sort in ascending order of "Untouched" count
        });
        // ||
        // (openFilters.busy && company.Status === "Busy") ||
        // (openFilters.notPickedUp && company.Status === "Not Picked Up") ||
        // (openFilters.junk && company.Status === "Junk") ||
        // (openFilters.followUp && company.Status === "FollowUp") ||
        // (openFilters.interested && company.Status === "Interested") ||
        // (openFilters.notInterested && company.Status === "Not Interested") ||
        // (openFilters.matured && company.Status === "Matured") ||
        // (openFilters.totalLeads) ||
        // (openFilters.lastleadassign)
        break;
      case "descending":
        setIncoFilter("descending");
        const untouchedCount = {};
        companyData.forEach((company) => {
          if ((company.Status === "Junk")
          ) {
            untouchedCount[company.ename] = (untouchedCount[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses
        employeeData.sort((a, b) => {
          const countA = untouchedCount[a.ename] || 0;
          const countB = untouchedCount[b.ename] || 0;
          return countB - countA; // Sort in descending order of "Untouched" count
        });
        break;
      case "none":
        setIncoFilter("none");
        if (originalEmployeeData.length > 0) {
          // Restore to previous state
          setEmployeeData(originalEmployeeData);
        }
        break;
      default:
        break;

    }
  };
  const handleSortFollowUp = (sortBy1) => {
    setSortType(prevData => ({
      ...prevData,
      followUp: prevData.followUp === "ascending"
        ? "descending"
        : prevData.followUp === "descending"
          ? "none"
          : "ascending"
    }));
    switch (sortBy1) {

      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {}
        companyData.forEach((company) => {
          if ((company.Status === "Follow Up")
            // (openFilters.busy && company.Status === "Busy") ||
            // (openFilters.notPickedUp && company.Status === "Not Picked Up") ||
            // (openFilters.junk && company.Status === "Junk") ||
            // (openFilters.followUp && company.Status === "FollowUp") ||
            // (openFilters.interested && company.Status === "Interested") ||
            // (openFilters.notInterested && company.Status === "Not Interested") ||
            // (openFilters.matured && company.Status === "Matured") ||
            // (openFilters.totalLeads) ||
            // (openFilters.lastleadassign)
          ) {
            untouchedCountAscending[company.ename] = (untouchedCountAscending[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
        employeeData.sort((a, b) => {
          const countA = untouchedCountAscending[a.ename] || 0;
          const countB = untouchedCountAscending[b.ename] || 0;
          return countA - countB; // Sort in ascending order of "Untouched" count
        });
        // ||
        // (openFilters.busy && company.Status === "Busy") ||
        // (openFilters.notPickedUp && company.Status === "Not Picked Up") ||
        // (openFilters.junk && company.Status === "Junk") ||
        // (openFilters.followUp && company.Status === "FollowUp") ||
        // (openFilters.interested && company.Status === "Interested") ||
        // (openFilters.notInterested && company.Status === "Not Interested") ||
        // (openFilters.matured && company.Status === "Matured") ||
        // (openFilters.totalLeads) ||
        // (openFilters.lastleadassign)
        break;
      case "descending":
        setIncoFilter("descending");
        const untouchedCount = {};
        companyData.forEach((company) => {
          if ((company.Status === "FollowUp")
          ) {
            untouchedCount[company.ename] = (untouchedCount[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses
        employeeData.sort((a, b) => {
          const countA = untouchedCount[a.ename] || 0;
          const countB = untouchedCount[b.ename] || 0;
          return countB - countA; // Sort in descending order of "Untouched" count
        });
        break;
      case "none":
        setIncoFilter("none");
        if (originalEmployeeData.length > 0) {
          // Restore to previous state
          setEmployeeData(originalEmployeeData);
        }
        break;
      default:
        break;

    }
  };
  const handleSortLastLead = (sortBy1) => {
    setSortType(prevData => ({
      ...prevData,
      lastLead: prevData.lastLead === "ascending"
        ? "descending"
        : prevData.lastLead === "descending"
          ? "none"
          : "ascending"
    }));
    switch (sortBy1) {

      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {}
        companyData.forEach((company) => {

          untouchedCountAscending[company.ename] = (untouchedCountAscending[company.ename] || 0) + 1;

        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
        employeeData.sort((a, b) => {
          const countA = untouchedCountAscending[a.ename] || 0;
          const countB = untouchedCountAscending[b.ename] || 0;
          return countA - countB; // Sort in ascending order of "Untouched" count
        });
        // ||
        // (openFilters.busy && company.Status === "Busy") ||
        // (openFilters.notPickedUp && company.Status === "Not Picked Up") ||
        // (openFilters.junk && company.Status === "Junk") ||
        // (openFilters.followUp && company.Status === "FollowUp") ||
        // (openFilters.interested && company.Status === "Interested") ||
        // (openFilters.notInterested && company.Status === "Not Interested") ||
        // (openFilters.matured && company.Status === "Matured") ||
        // (openFilters.totalLeads) ||
        // (openFilters.lastleadassign)
        break;
      case "descending":
        setIncoFilter("descending");
        const untouchedCount = {};
        companyData.forEach((company) => {

          untouchedCount[company.ename] = (untouchedCount[company.ename] || 0) + 1;

        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses
        employeeData.sort((a, b) => {
          const countA = untouchedCount[a.ename] || 0;
          const countB = untouchedCount[b.ename] || 0;
          return countB - countA; // Sort in descending order of "Untouched" count
        });
        break;
      case "none":
        setIncoFilter("none");
        if (originalEmployeeData.length > 0) {
          // Restore to previous state
          setEmployeeData(originalEmployeeData);
        }
        break;
      default:
        break;

    }
  };
  const handleSortTotalLeads = (sortBy1) => {
    setSortType(prevData => ({
      ...prevData,
      totalLeads: prevData.totalLeads === "ascending" ? "descending" : "ascending"
    }));
    switch (sortBy1) {

      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {}
        companyData.forEach((company) => {

          untouchedCountAscending[company.ename] = (untouchedCountAscending[company.ename] || 0) + 1;

        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
        employeeData.sort((a, b) => {
          const countA = untouchedCountAscending[a.ename] || 0;
          const countB = untouchedCountAscending[b.ename] || 0;
          return countA - countB; // Sort in ascending order of "Untouched" count
        });
        // ||
        // (openFilters.busy && company.Status === "Busy") ||
        // (openFilters.notPickedUp && company.Status === "Not Picked Up") ||
        // (openFilters.junk && company.Status === "Junk") ||
        // (openFilters.followUp && company.Status === "FollowUp") ||
        // (openFilters.interested && company.Status === "Interested") ||
        // (openFilters.notInterested && company.Status === "Not Interested") ||
        // (openFilters.matured && company.Status === "Matured") ||
        // (openFilters.totalLeads) ||
        // (openFilters.lastleadassign)
        break;
      case "descending":
        setIncoFilter("descending");
        const untouchedCount = {};
        companyData.forEach((company) => {

          untouchedCount[company.ename] = (untouchedCount[company.ename] || 0) + 1;

        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses
        employeeData.sort((a, b) => {
          const countA = untouchedCount[a.ename] || 0;
          const countB = untouchedCount[b.ename] || 0;
          return countB - countA; // Sort in descending order of "Untouched" count
        });
        break;
      case "none":
        setIncoFilter("none");
        if (originalEmployeeData.length > 0) {
          // Restore to previous state
          setEmployeeData(originalEmployeeData);
        }
        break;
      default:
        break;

    }
  };
  useEffect(() => {
    setOriginalEmployeeData([...employeeData]); // Store original state of employeeData
  }, [employeeData]);

  const handleIconClickEmployee = () => {
    if (!buttonToggle) {
      setDateRangeDisplayEmployee(true);
    } else {
      setDateRangeDisplayEmployee(false);
    }
    setButtonToggle(!buttonToggle);
  };

  const handleCloseIconClickEmployee = () => {
    if (displayDateRangeEmployee) {
      setDateRangeDisplayEmployee(false)
    }
  }
  const selectionRangeEmployee = {
    startDate: startDateEmployee,
    endDate: endDateEmployee,
    key: 'selection',
  };

  const [companyDataFilter, setcompanyDataFilter] = useState([])

  const handleSelectEmployee = (date) => {
    const filteredDataDateRange = companyDataFilter.filter(product => {
      const productDate = new Date(product["AssignDate"]);
      if (formatDate(date.selection.startDate) === formatDate(date.selection.endDate)) {
        console.log(formatDate(date.selection.startDate))
        console.log(formatDate(date.selection.endDate))
        console.log(formatDate(productDate))
        return formatDate(productDate) === formatDate(date.selection.startDate);
      } else {
        return (
          productDate >= date.selection.startDate &&
          productDate <= date.selection.endDate
        );
      }
    });
    setStartDateEmployee(date.selection.startDate);
    setEndDateEmployee(date.selection.endDate);
    setCompanyData(filteredDataDateRange);
    setcompanyDataFilter(filteredDataDateRange)
    //console.log(filteredDataDateRange)
  };



  // ------------------------------------------search bde name---------------------------------------------------

  const handleCloseSearch = () => {
    if (searchOption) {
      setSearchOption(false)
    }
  }

  const debouncedFilterSearch = debounce(filterSearch, 100);

  // Modified filterSearch function with debounce
  function filterSearch(searchTerm) {
    setSearchTerm(searchTerm);
    setEmployeeData(employeeDataFilter.filter(company =>
      company.ename.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  }

  //  ---------------------------------------------status info component-------------------------------------------------


  const numberFormatOptions = {
    style: 'currency',
    currency: 'INR', // Use the currency code for Indian Rupee (INR)
    minimumFractionDigits: 0, // Minimum number of fraction digits (adjust as needed)
    maximumFractionDigits: 2, // Maximum number of fraction digits (adjust as needed)
  };
  const shortcutsItems = [
    {
      label: 'This Week',
      getValue: () => {
        const today = dayjs();
        return [today.startOf('week'), today.endOf('week')];
      },
    },
    {
      label: 'Last Week',
      getValue: () => {
        const today = dayjs();
        const prevWeek = today.subtract(7, 'day');
        return [prevWeek.startOf('week'), prevWeek.endOf('week')];
      },
    },
    {
      label: 'Last 7 Days',
      getValue: () => {
        const today = dayjs();
        return [today.subtract(7, 'day'), today];
      },
    },
    {
      label: 'Current Month',
      getValue: () => {
        const today = dayjs();
        return [today.startOf('month'), today.endOf('month')];
      },
    },
    {
      label: 'Next Month',
      getValue: () => {
        const today = dayjs();
        const startOfNextMonth = today.endOf('month').add(1, 'day');
        return [startOfNextMonth, startOfNextMonth.endOf('month')];
      },
    },
    { label: 'Reset', getValue: () => [null, null] },
  ];


  // -------------------------------------sorting projection summary-------------------------------------------
  const [incoFilterNew, setIncoFilterNew] = useState("");
  const [sortTypeProjection, setSortTypeProjection] = useState({
    totalCompanies: "ascending",
  });

  const handleSortTotalCompanies = (newSortType) => {
    setSortTypeProjection(newSortType);
  };


  const sortedData = uniqueEnames.slice().sort((a, b) => {
    const totalCompaniesA = followDataToday.filter(
      (partObj) => partObj.ename === a
    ).length;
    const totalCompaniesB = followDataToday.filter(
      (partObj) => partObj.ename === b
    ).length;
  
    if (sortTypeProjection === "ascending") {
      return totalCompaniesA - totalCompaniesB;
    } else if (sortTypeProjection === "descending") {
      return totalCompaniesB - totalCompaniesA;
    }
    // If sortTypeProjection is "none", return original order
    return 0;
  });
  
  


  // const handleSortTotalCompanies = (sortBy1) => {
  //   setSortTypeProjection(prevData => ({
  //     ...prevData,
  //     totalCompanies: prevData.totalCompanies === "ascending"
  //       ? "descending"
  //       : prevData.totalCompanies === "descending"
  //         ? "none"
  //         : "ascending"
  //   }));
  //   switch (sortBy1) {
  //     case "ascending":
  //       setIncoFilterNew("ascending");
  //       const untouchedCountAscending = {}
  //       //console.log("ascending is working")
  //       followDataToday.forEach((company) => {
  //         if (company) {
  //           untouchedCountAscending[company.ename] = (untouchedCountAscending[company.ename] || 0) + 1;
  //         }
  //       });

  //       // Step 2: Sort employeeData based on the count of "Untouched" statuses
  //       followDataToday.sort((a, b) => {
  //         const countA = untouchedCountAscending[a.ename] || 0;
  //         const countB = untouchedCountAscending[b.ename] || 0;
  //         return countA - countB; // Sort in ascending order of "Untouched" count
  //       });
  //       break;

  //     case "descending":
  //       setIncoFilterNew("descending");
  //       const untouchedCount = {};
  //       //console.log("descending is working")
  //       followDataToday.forEach((company) => {
  //         if ((company)
  //         ) {
  //           untouchedCount[company.ename] = (untouchedCount[company.ename] || 0) + 1;
  //         }
  //       });

  //       // Step 2: Sort employeeData based on the count of "Untouched" statuses
  //       followDataToday.sort((a, b) => {
  //         const countA = untouchedCount[a.ename] || 0;
  //         const countB = untouchedCount[b.ename] || 0;
  //         return countB - countA; // Sort in descending order of "Untouched" count
  //       });
  //       break;

  //     case "none":
  //       setIncoFilter("none");

  //       break;

  //     default:
  //       break;

  //   }
  // };



  return (
    <div>
      <Header />
      <Navbar />
      <div className="d-flex align-items-center">

        <div>
          <div className="page-wrapper">
            {/* <div className="recent-updates-icon">
              <IconButton
                style={{ backgroundColor: "#ffb900", color: "white" }}
                onClick={changeUpdate}
              >
                <AnnouncementIcon />
              </IconButton>
            </div> */}
            <div className="page-header d-print-none">
              <div className="container-xl">
                <div className="row">
                  <div
                    style={{ display: showUpdates ? "block" : "none" }}
                    className="col-sm-4 card recent-updates m-2"
                  >
                    <div className="card-header">
                      <h2>Recent Updates</h2>
                    </div>

                    <div className="card-body">
                      {recentUpdates.length !== 0 ? (
                        recentUpdates.map((obj) => (
                          <div className="row update-card ">
                            <div className="col">
                              <div className="text-truncate">
                                <strong>{obj.title}</strong>
                              </div>
                              <div className="text-muted">
                                {" "}
                                {formatTime(obj.date, obj.time)}
                              </div>
                            </div>
                            <div className="col-auto align-self-center">
                              <div className="badge bg-primary"></div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div>
                          <Nodata />
                        </div>
                      )}
                    </div>
                  </div>
                  {/*------------------------------------------------------ Bookings Dashboard ------------------------------------------------------------ */}
                  <div className="col card todays-booking m-2 totalbooking" id='totalbooking' >
                    <div className="card-header employeedashboard d-flex align-items-center justify-content-between">
                      <div>
                        <h2>Total Booking</h2>
                      </div>
                      <div className=" form-control date-range-picker d-flex align-items-center justify-content-between">
                        <div style={{ cursor: 'pointer' }} onClick={() => setShowBookingDate(!showBookingDate)}>
                          {`${formatDate(startDateAnother)} - ${formatDate(endDateAnother)}`}
                        </div>
                        <button onClick={() => setShowBookingDate(!showBookingDate)} style={{ border: "none", padding: "0px", backgroundColor: "white" }}>
                          <FaRegCalendar style={{ width: "17px", height: "17px", color: "#bcbaba", color: "grey" }} />
                        </button>
                      </div>
                    </div>
                    {/* {showBookingDate && <div
                      ref={dateRangePickerRef}
                      style={{
                        position: "absolute",
                        top: "65px",
                        zIndex: 9,
                        right: "157px",
                      }}
                      className="booking-filter"
                    >
                      <DateRangePicker
                        ranges={[selectionRangeAnother]}
                        onChange={handleSelectAnother}
                        onClose={() => setShowBookingDate(false)}
                      />
                    </div>} */}
                    <div className="card-body">
                      <div
                        className="row"
                        style={{
                          overflowX: "auto",
                          overflowY: "auto",
                          maxHeight: "60vh",
                          lineHeight: "32px",
                        }}
                      >
                        <table
                          style={{
                            position: "sticky",
                            width: "100%",
                            borderCollapse: "collapse",
                            border: "1px solid #ddd",
                            marginBottom: "5px",
                            lineHeight: "32px",
                          }}
                          className="table-vcenter table-nowrap"
                        >
                          <thead style={{ lineHeight: "32px" }}>
                            <tr
                              style={{
                                backgroundColor: "#ffb900",
                                color: "black",
                                fontWeight: "bold",
                              }}
                            >
                              <th style={{ lineHeight: "32px" }}>SR.NO</th>
                              <th>BDE NAME</th>
                              <th>MATURED CASES</th>
                              <th>NUM OF UNIQUE SERVICES OFFERED</th>
                              <th>TOTAL PAYMENT</th>
                              <th>RECEIVED PAYMENT</th>
                              <th>PENDING PAYMENT</th>
                            </tr>
                          </thead>
                          {finalFilteredData.length !== 0 ? (
                            <>
                              <tbody>
                                {finalFilteredData.map((obj, index) => (
                                  <>
                                    <tr style={{ position: "relative" }}>
                                      <td style={{ lineHeight: "32px" }}>
                                        {index + 1}
                                      </td>
                                      <td>{obj.bdeName}</td>
                                      <td>
                                        <div className="row">
                                          <div
                                            style={{ textAlign: "right" }}
                                            className="col"
                                          >
                                            {filteredBooking.filter((data) => {
                                              return (
                                                data.bdeName === obj.bdeName &&
                                                data.bdeName === data.bdmName
                                              );
                                            }).length +
                                              filteredBooking.filter((data) => {
                                                return (
                                                  data.bdeName === obj.bdeName &&
                                                  data.bdeName !== data.bdmName
                                                );
                                              }).length /
                                              2}{" "}
                                          </div>
                                          <div className="col-sm-5">
                                            <IconEye
                                              style={{
                                                cursor: "pointer",
                                                marginLeft: "5px",
                                                height: "17px",
                                              }}
                                              onClick={() =>
                                                handleRowClick(index, obj.bdeName)
                                              }
                                            />
                                          </div>
                                        </div>
                                      </td>

                                      <td>
                                        {
                                          filteredBooking
                                            .filter(
                                              (data) => data.bdeName === obj.bdeName
                                            ) // Filter objects with bdeName same as myName
                                            .reduce((totalServices, obj) => {
                                              // Use reduce to calculate the total number of services
                                              return (
                                                totalServices +
                                                (obj.services && obj.services[0]
                                                  ? obj.services[0]
                                                    .split(",")
                                                    .map((service) =>
                                                      service.trim()
                                                    ).length
                                                  : 0)
                                              );
                                            }, 0) // Initialize totalServices as 0
                                        }
                                      </td>
                                      <td>
                                        {" "}
                                        ₹{
                                          filteredBooking
                                            .filter(
                                              (data) => data.bdeName === obj.bdeName
                                            ) // Filter objects with bdeName same as myName
                                            .reduce((totalPayments, obj1) => {
                                              // Use reduce to calculate the total of totalPayments
                                              return (
                                                totalPayments +
                                                (obj1.bdeName === obj1.bdmName && obj.bdmType !== "closeby"
                                                  ? obj1.originalTotalPayment !== 0
                                                    ? obj1.originalTotalPayment
                                                    : 0
                                                  : obj1.originalTotalPayment !== 0
                                                    ? obj1.originalTotalPayment / 2
                                                    : 0)
                                              );
                                            }, 0)
                                            .toLocaleString() // Initialize totalPayments as 0
                                        }
                                      </td>
                                      <td>
                                        ₹{
                                          filteredBooking
                                            .filter(
                                              (data) => data.bdeName === obj.bdeName
                                            ) // Filter objects with bdeName same as obj.bdeName
                                            .reduce((totalPayments, obj1) => {
                                              // Use reduce to calculate the total of totalPayments
                                              return (
                                                totalPayments +
                                                (obj1.firstPayment === 0
                                                  ? obj1.bdeName === obj1.bdmName
                                                    ? obj1.originalTotalPayment / 2 // If bdeName and bdmName are the same
                                                    : obj1.originalTotalPayment // If bdeName and bdmName are different
                                                  : obj1.bdeName === obj1.bdmName
                                                    ? obj1.originalTotalPayment// If bdeName and bdmName are the same
                                                    : obj1.originalTotalPayment / 2) // If bdeName and bdmName are different
                                              );
                                            }, 0)
                                            .toLocaleString() // Initialize totalPayments as 0
                                        }
                                      </td>
                                      <td>
                                        ₹{
                                          filteredBooking
                                            .filter(
                                              (data) => data.bdeName === obj.bdeName
                                            ) // Filter objects with bdeName same as obj.bdeName
                                            .reduce((totalPayments, obj1) => {
                                              // Use reduce to calculate the total of totalPayments
                                              return (
                                                totalPayments +
                                                (obj1.firstPayment !== 0
                                                  ? obj1.bdeName !== obj1.bdmName
                                                    ? (obj1.originalTotalPayment -
                                                      obj1.firstPayment) /
                                                    2 // If bdeName and bdmName are the same
                                                    : obj1.originalTotalPayment -
                                                    obj1.firstPayment // If bdeName and bdmName are different
                                                  : 0) // If bdeName and bdmName are different
                                              );
                                            }, 0)
                                            .toLocaleString() // Initialize totalPayments as 0
                                        }
                                      </td>
                                    </tr>
                                  </>
                                ))}
                              </tbody>

                              <tfoot>
                                <tr style={{ fontWeight: "500" }}>
                                  <td colSpan={2} style={{ lineHeight: "32px" }}>
                                    Total:{finalFilteredData.length}
                                  </td>

                                  <td>
                                    {filteredBooking.filter((data) => {
                                      return data.bdeName === data.bdmName;
                                    }).length +
                                      filteredBooking.filter((data) => {
                                        return data.bdeName !== data.bdmName;
                                      }).length /
                                      2}
                                  </td>
                                  <td>
                                    {filteredBooking.reduce((totalLength, obj) => {
                                      // Split the services string by commas and calculate the length of the resulting array
                                      const serviceLength =
                                        obj.services[0].split(",").length;
                                      // Add the length of services for the current object to the total length
                                      return totalLength + serviceLength;
                                    }, 0)}
                                  </td>

                                  <td>
                                    ₹{filteredBooking
                                      .reduce((totalPayment, obj) => {
                                        // Add the totalPayment of the current object to the totalPayment accumulator
                                        const finalPayment =
                                          obj.bdeName === obj.bdmName
                                            ? obj.originalTotalPayment
                                            : obj.originalTotalPayment / 2;
                                        return totalPayment + finalPayment;
                                      }, 0)
                                      .toLocaleString()}
                                  </td>

                                  <td>
                                    ₹{filteredBooking
                                      .reduce((totalFirstPayment, obj) => {
                                        // If firstPayment is 0, count totalPayment instead
                                        const paymentToAdd =
                                          obj.firstPayment === 0
                                            ? obj.bdeName === obj.bdmName
                                              ? obj.originalTotalPayment
                                              : obj.originalTotalPayment / 2
                                            : obj.bdeName === obj.bdmName
                                              ? obj.firstPayment
                                              : obj.firstPayment / 2;
                                        // Add the paymentToAdd to the totalFirstPayment accumulator
                                        return totalFirstPayment + paymentToAdd;
                                      }, 0)
                                      .toLocaleString()}
                                  </td>
                                  <td>
                                    ₹{filteredBooking
                                      .reduce((totalFirstPayment, obj) => {
                                        // If firstPayment is 0, count totalPayment instead

                                        const paymentToAdd =
                                          obj.bdeName === obj.bdmName
                                            ? obj.firstPayment === 0
                                              ? 0
                                              : obj.originalTotalPayment - obj.firstPayment
                                            : obj.firstPayment === 0
                                              ? 0
                                              : obj.originalTotalPayment - obj.firstPayment;

                                        // Add the paymentToAdd to the totalFirstPayment accumulator
                                        return totalFirstPayment + paymentToAdd;
                                      }, 0)
                                      .toLocaleString()}
                                  </td>
                                </tr>
                              </tfoot>
                            </>
                          ) : (
                            <tbody>
                              <tr>
                                <td className="particular" colSpan={9}>
                                  <Nodata />
                                </td>
                              </tr>
                            </tbody>
                          )}
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Employee side Dashboard Analysis */}
                  <div className="employee-dashboard" id="employeedashboardadmin">
                    <div className="card">
                      <div className="card-header employeedashboard d-flex align-items-center justify-content-between">
                        <div className="d-flex justify-content-between">
                          <div style={{ minWidth: '14vw' }} className="dashboard-title">
                            <h2 style={{ marginBottom: '5px' }}>Employees Data Report</h2>
                          </div>
                        </div>
                        <div className="d-flex gap-2">

                          <div className="general-searchbar form-control d-flex justify-content-center align-items-center input-icon">
                            <span className="input-icon-addon">
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
                                stroke-linejoin="round">
                                <path
                                  stroke="none"
                                  d="M0 0h24v24H0z"
                                  fill="none"
                                />
                                <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                                <path d="M21 21l-6 -6" />
                              </svg>
                            </span>
                            <input value={searchTerm}
                              onChange={(e) => debouncedFilterSearch(e.target.value)} placeholder="Enter BDE Name..." style={{ border: "none", padding: "0px 0px 0px 21px", width: "100%" }} type="text" name="bdeName-search" id="bdeName-search" />
                            {/* <CiSearch style={{
                              width: "19px",
                              height: "20px",
                              marginRight: "5px",
                              color: "grey"
                            }} /> */}
                          </div>
                          <div className="form-control d-flex align-items-center justify-content-between date-range-picker">
                            <div>{`${formatDate(startDateEmployee)} - ${formatDate(endDateEmployee)}`}</div>
                            <button onClick={() => setDateRangeDisplayEmployee(!displayDateRangeEmployee)} style={{ border: "none", padding: "0px", backgroundColor: "white" }}>
                              <FaRegCalendar style={{ width: "17px", height: "17px", color: "#bcbaba", color: "grey" }} />
                            </button>
                          </div>
                        </div>
                      </div>
                      {/* {displayDateRangeEmployee && (
                        <div ref={dateRangePickerEmployeeRef} className="position-absolute " style={{ zIndex: "1000", top: "13%", left: "73%" }} >
                          <DateRangePicker
                            ranges={[selectionRangeEmployee]}
                            onClose={() => setDateRangeDisplayEmployee(false)}
                            onChange={handleSelectEmployee}
                          />
                        </div>
                      )} */}
                      <div className="card-body">
                        <div
                          className="row"
                          style={{
                            overflowX: "auto",
                            overflowY: "auto",
                            maxHeight: "60vh",
                            lineHeight: "32px",
                          }}
                        >
                          <table
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                              border: "1px solid #ddd",
                              marginBottom: "5px",
                              lineHeight: "32px",
                              position: "relative", // Make the table container relative
                            }}
                            className="table-vcenter table-nowrap"
                          >
                            {/* <thead>
                          <tr
                            style={{
                              backgroundColor: "#ffb900",
                              color: "white",
                              fontWeight: "bold",

                            }}
                          > */}
                            <thead
                              style={{
                                position: "sticky", // Make the header sticky
                                top: '-1px', // Stick it at the top
                                backgroundColor: "#ffb900",
                                color: "black",
                                fontWeight: "bold",
                                zIndex: 1, // Ensure it's above other content
                              }}
                            >
                              <tr>
                                <th
                                  style={{
                                    lineHeight: "32px",
                                  }}
                                >
                                  Sr. No
                                </th>
                                <th>BDE/BDM Name

                                </th>
                                <th style={{ cursor: 'pointer' }} onClick={(e) => {
                                  let newSortType;
                                  if (sortType.untouched === "ascending") {
                                    newSortType = "descending";
                                  } else if (sortType.untouched === "descending") {
                                    newSortType = "none";
                                  } else {
                                    newSortType = "ascending";
                                  }
                                  handleSortUntouched(newSortType);
                                }}>Untouched

                                  <ArrowDropUpIcon style={{ color: sortType.untouched === "descending" ? "black" : "#9d8f8f", marginRight: "-24px", marginTop: "-11px" }} />

                                  <ArrowDropDownIcon style={{ color: sortType.untouched === "ascending" ? "black" : "#9d8f8f", marginTop: "3px" }} />
                                </th>
                                <th style={{ cursor: 'pointer' }} onClick={(e) => {
                                  let newSortType;
                                  if (sortType.busy === "ascending") {
                                    newSortType = "descending";
                                  } else if (sortType.untouched === "descending") {
                                    newSortType = "none";
                                  } else {
                                    newSortType = "ascending";
                                  }
                                  handleSortbusy(newSortType);
                                }}>Busy

                                  <ArrowDropUpIcon style={{ color: sortType.busy === "descending" ? "black" : "#9d8f8f", marginRight: "-24px", marginTop: "-11px" }} />

                                  <ArrowDropDownIcon style={{ color: sortType.busy === "ascending" ? "black" : "#9d8f8f", marginTop: "3px" }} />
                                </th>
                                <th style={{ cursor: 'pointer' }} onClick={(e) => {
                                  let newSortType;
                                  if (sortType.notPickedUp === "ascending") {
                                    newSortType = "descending";
                                  } else if (sortType.notPickedUp === "descending") {
                                    newSortType = "none";
                                  } else {
                                    newSortType = "ascending";
                                  }
                                  handleSortNotPickedUp(newSortType);
                                }}>Not Picked Up

                                  <ArrowDropUpIcon style={{ color: sortType.notPickedUp === "descending" ? "black" : "#9d8f8f", marginRight: "-24px", marginTop: "-11px" }} />

                                  <ArrowDropDownIcon style={{ color: sortType.notPickedUp === "ascending" ? "black" : "#9d8f8f", marginTop: "3px" }} />
                                </th>
                                <th style={{ cursor: 'pointer' }} onClick={(e) => {
                                  let newSortType;
                                  if (sortType.junk === "ascending") {
                                    newSortType = "descending";
                                  } else if (sortType.junk === "descending") {
                                    newSortType = "none";
                                  } else {
                                    newSortType = "ascending";
                                  }
                                  handleSortJunk(newSortType);
                                }}>Junk

                                  <ArrowDropUpIcon style={{ color: sortType.junk === "descending" ? "black" : "#9d8f8f", marginRight: "-24px", marginTop: "-11px" }} />

                                  <ArrowDropDownIcon style={{ color: sortType.junk === "ascending" ? "black" : "#9d8f8f", marginTop: "3px" }} />
                                </th>
                                <th style={{ cursor: 'pointer' }} onClick={(e) => {
                                  let newSortType;
                                  if (sortType.followUp === "ascending") {
                                    newSortType = "descending";
                                  } else if (sortType.followUp === "descending") {
                                    newSortType = "none";
                                  } else {
                                    newSortType = "ascending";
                                  }
                                  handleSortFollowUp(newSortType);
                                }}>Follow Up

                                  <ArrowDropUpIcon style={{ color: sortType.followUp === "descending" ? "black" : "#9d8f8f", marginRight: "-24px", marginTop: "-11px" }} />

                                  <ArrowDropDownIcon style={{ color: sortType.followUp === "ascending" ? "black" : "#9d8f8f", marginTop: "3px" }} />
                                </th>
                                <th style={{ cursor: 'pointer' }} onClick={(e) => {
                                  let newSortType;
                                  if (sortType.interested === "ascending") {
                                    newSortType = "descending";
                                  } else if (sortType.interested === "descending") {
                                    newSortType = "none";
                                  } else {
                                    newSortType = "ascending";
                                  }
                                  handleSortInterested(newSortType);
                                }}>Interested

                                  <ArrowDropUpIcon style={{ color: sortType.interested === "descending" ? "black" : "#9d8f8f", marginRight: "-24px", marginTop: "-11px" }} />

                                  <ArrowDropDownIcon style={{ color: sortType.interested === "ascending" ? "black" : "#9d8f8f", marginTop: "3px" }} />
                                </th>
                                <th style={{ cursor: 'pointer' }} onClick={(e) => {
                                  let newSortType;
                                  if (sortType.notInterested === "ascending") {
                                    newSortType = "descending";
                                  } else if (sortType.notInterested === "descending") {
                                    newSortType = "none";
                                  } else {
                                    newSortType = "ascending";
                                  }
                                  handleSortNotInterested(newSortType);
                                }}>Not Interested

                                  <ArrowDropUpIcon style={{ color: sortType.notInterested === "descending" ? "black" : "#9d8f8f", marginRight: "-24px", marginTop: "-11px" }} />

                                  <ArrowDropDownIcon style={{ color: sortType.notInterested === "ascending" ? "black" : "#9d8f8f", marginTop: "3px" }} />
                                </th>
                                <th style={{ cursor: 'pointer' }} onClick={(e) => {
                                  let newSortType;
                                  if (sortType.matured === "ascending") {
                                    newSortType = "descending";
                                  } else if (sortType.matured === "descending") {
                                    newSortType = "none";
                                  } else {
                                    newSortType = "ascending";
                                  }
                                  handleSortMatured(newSortType);
                                }}>Matured

                                  <ArrowDropUpIcon style={{ color: sortType.matured === "descending" ? "black" : "#9d8f8f", marginRight: "-24px", marginTop: "-11px" }} />

                                  <ArrowDropDownIcon style={{ color: sortType.matured === "ascending" ? "black" : "#9d8f8f", marginTop: "3px" }} />
                                </th>
                                <th style={{ cursor: 'pointer' }} onClick={(e) => {
                                  let newSortType;
                                  if (sortType.totalLeads === "ascending") {
                                    newSortType = "descending";
                                  } else if (sortType.totalLeads === "descending") {
                                    newSortType = "none";
                                  } else {
                                    newSortType = "ascending";
                                  }
                                  handleSortTotalLeads(newSortType);
                                }}>Total Leads

                                  <ArrowDropUpIcon style={{ color: sortType.totalLeads === "descending" ? "black" : "#9d8f8f", marginRight: "-24px", marginTop: "-11px" }} />

                                  <ArrowDropDownIcon style={{ color: sortType.totalLeads === "ascending" ? "black" : "#9d8f8f", marginTop: "3px" }} />
                                </th>
                                <th style={{ cursor: 'pointer' }} onClick={(e) => {
                                  let newSortType;
                                  if (sortType.lastLead === "ascending") {
                                    newSortType = "descending";
                                  } else if (sortType.lastLead === "descending") {
                                    newSortType = "none";
                                  } else {
                                    newSortType = "ascending";
                                  }
                                  handleSortLastLead(newSortType);
                                }}>Last lead Assign Date

                                  <ArrowDropUpIcon style={{ color: sortType.lastLead === "descending" ? "black" : "#9d8f8f", marginRight: "-24px", marginTop: "-11px" }} />

                                  <ArrowDropDownIcon style={{ color: sortType.lastLead === "ascending" ? "black" : "#9d8f8f", marginTop: "3px" }} />
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {employeeData.length !== 0 &&
                                companyData.length !== 0 &&
                                employeeData.map((obj, index) => (
                                  <React.Fragment key={index}>
                                    <tr>
                                      <td
                                        style={{
                                          lineHeight: "32px",
                                          color: "black",
                                          textDecoration: "none"
                                        }}
                                        key={`row-${index}-1`}
                                      >
                                        {index + 1}
                                      </td>
                                      <td key={`row-${index}-2`}>{obj.ename}</td>

                                      <td key={`row-${index}-3`} >
                                        <Link to={`/admindashboard/${obj.ename}/Untouched`} style={{
                                          color: "black",
                                          textDecoration: "none"
                                        }}
                                          target="_blank"
                                          rel="noopener noreferrer">
                                          {
                                            (companyData.filter(
                                              (data) =>
                                                data.ename === obj.ename &&
                                                data.Status === "Untouched"
                                            ).length).toLocaleString()
                                          }
                                        </Link>
                                      </td>


                                      <td key={`row-${index}-4`}>
                                        <Link to={`/admindashboard/${obj.ename}/Busy`} style={{
                                          color: "black",
                                          textDecoration: "none"
                                        }}
                                          target="_blank"
                                          rel="noopener noreferrer">
                                          {
                                            (companyData.filter(
                                              (data) =>
                                                data.ename === obj.ename &&
                                                data.Status === "Busy"
                                            ).length).toLocaleString()
                                          }
                                        </Link>
                                      </td>


                                      <td key={`row-${index}-5`}>
                                        <Link
                                          to={`/admindashboard/${obj.ename}/Not Picked Up`}
                                          style={{ color: "black", textDecoration: "none" }}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {
                                            (companyData.filter(
                                              (data) =>
                                                data.ename === obj.ename &&
                                                data.Status === "Not Picked Up"
                                            ).length).toLocaleString()
                                          }
                                        </Link>
                                      </td>


                                      <td key={`row-${index}-6`}>
                                        <Link to={`/admindashboard/${obj.ename}/Junk`} style={{
                                          color: "black",
                                          textDecoration: "none"
                                        }}
                                          target="_blank"
                                          rel="noopener noreferrer">
                                          {
                                            (companyData.filter(
                                              (data) =>
                                                data.ename === obj.ename &&
                                                data.Status === "Junk"
                                            ).length).toLocaleString()
                                          }
                                        </Link>
                                      </td>

                                      <td key={`row-${index}-7`}>
                                        <Link to={`/admindashboard/${obj.ename}/FollowUp`} style={{
                                          color: "black",
                                          textDecoration: "none"
                                        }}
                                          target="_blank"
                                          rel="noopener noreferrer">
                                          {
                                            (companyData.filter(
                                              (data) =>
                                                data.ename === obj.ename &&
                                                data.Status === "FollowUp"
                                            ).length).toLocaleString()
                                          }
                                        </Link>
                                      </td>
                                      <td key={`row-${index}-8`}>
                                        <Link to={`/admindashboard/${obj.ename}/Interested`} style={{
                                          color: "black",
                                          textDecoration: "none"
                                        }}
                                          target="_blank"
                                          rel="noopener noreferrer">
                                          {
                                            (companyData.filter(
                                              (data) =>
                                                data.ename === obj.ename &&
                                                data.Status === "Interested"
                                            ).length).toLocaleString()
                                          }
                                        </Link>
                                      </td>
                                      <td key={`row-${index}-9`}>
                                        <Link to={`/admindashboard/${obj.ename}/Not Interested`} style={{
                                          color: "black",
                                          textDecoration: "none"
                                        }}
                                          target="_blank"
                                          rel="noopener noreferrer">
                                          {
                                            (companyData.filter(
                                              (data) =>
                                                data.ename === obj.ename &&
                                                data.Status === "Not Interested"
                                            ).length).toLocaleString()
                                          }
                                        </Link>
                                      </td>
                                      <td key={`row-${index}-10`}>
                                        <Link to={`/admindashboard/${obj.ename}/Matured`} style={{
                                          color: "black",
                                          textDecoration: "none"
                                        }}
                                          target="_blank"
                                          rel="noopener noreferrer">

                                          {
                                            (companyData.filter(
                                              (data) =>
                                                data.ename === obj.ename &&
                                                data.Status === "Matured"
                                            ).length).toLocaleString()
                                          }
                                        </Link>
                                      </td>
                                      <td key={`row-${index}-11`}>
                                        <Link to={`/admindashboard/${obj.ename}/complete`} style={{
                                          color: "black",
                                          textDecoration: "none"
                                        }}
                                          target="_blank"
                                          rel="noopener noreferrer">
                                          {
                                            (companyData.filter(
                                              (data) => data.ename === obj.ename
                                            ).length).toLocaleString()
                                          }
                                        </Link>
                                      </td>
                                      <td key={`row-${index}-12`}>
                                        {formatDate(
                                          companyData
                                            .filter(
                                              (data) => data.ename === obj.ename
                                            )
                                            .reduce(
                                              (latestDate, data) => {
                                                return latestDate.AssignDate >
                                                  data.AssignDate
                                                  ? latestDate
                                                  : data;
                                              },
                                              { AssignDate: 0 }
                                            ).AssignDate
                                        )}
                                        <OpenInNewIcon
                                          onClick={() => {
                                            functionOpenEmployeeTable(obj.ename);

                                          }}
                                          style={{ cursor: "pointer", marginRight: "-41px", marginLeft: "21px", fontSize: '17px' }}
                                        />
                                      </td>
                                    </tr>
                                  </React.Fragment>
                                ))}
                            </tbody>
                            {employeeData.length !== 0 &&
                              companyData.length !== 0 && (
                                <tfoot style={{
                                  position: "sticky", // Make the footer sticky
                                  bottom: -1, // Stick it at the bottom
                                  backgroundColor: "#f6f2e9",
                                  color: "black",
                                  fontWeight: 500,
                                  zIndex: 2, // Ensure it's above the content
                                }}>
                                  <tr style={{ fontWeight: 500 }}>
                                    <td style={{ lineHeight: "32px" }} colSpan="2">
                                      Total
                                    </td>
                                    <td>
                                      {
                                        (companyData.filter(
                                          (partObj) =>
                                            partObj.Status === "Untouched"
                                        ).length).toLocaleString()
                                      }
                                    </td>
                                    <td>
                                      {
                                        (companyData.filter(
                                          (partObj) => partObj.Status === "Busy"
                                        ).length).toLocaleString()
                                      }
                                    </td>
                                    <td>
                                      {
                                        (companyData.filter(
                                          (partObj) =>
                                            partObj.Status === "Not Picked Up"
                                        ).length).toLocaleString()
                                      }
                                    </td>
                                    <td>
                                      {
                                        (companyData.filter(
                                          (partObj) => partObj.Status === "Junk"
                                        ).length).toLocaleString()
                                      }
                                    </td>
                                    <td>
                                      {
                                        (companyData.filter(
                                          (partObj) => partObj.Status === "FollowUp"
                                        ).length).toLocaleString()
                                      }
                                    </td>
                                    <td>
                                      {
                                        (companyData.filter(
                                          (partObj) =>
                                            partObj.Status === "Interested"
                                        ).length).toLocaleString()
                                      }
                                    </td>
                                    <td>
                                      {
                                        (companyData.filter(
                                          (partObj) =>
                                            partObj.Status === "Not Interested"
                                        ).length).toLocaleString()
                                      }
                                    </td>
                                    <td>
                                      {
                                        (companyData.filter(
                                          (partObj) => partObj.Status === "Matured"
                                        ).length).toLocaleString()
                                      }
                                    </td>
                                    <td>{(companyData.length).toLocaleString()}</td>
                                    <td>-</td>
                                  </tr>
                                </tfoot>
                              )}
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pop Up for Expanding the Data */}

          <Dialog open={openTable} onClose={closeTable} fullWidth maxWidth="lg">
            <DialogContent>
              <div
                id="table-default"
                style={{
                  overflowX: "auto",
                  overflowY: "auto",
                  maxHeight: "60vh",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    border: "1px solid #ddd",
                    marginBottom: "10px",
                  }}
                  className="table-vcenter table-nowrap"
                >
                  <thead stSyle={{ backgroundColor: "grey" }}>
                    <tr
                      style={{
                        backgroundColor: "#ffb900",
                        color: "black",
                        fontWeight: "bold",
                      }}
                    >
                      <th style={{ lineHeight: "32px" }}>SR.NO</th>
                      <th>BOOKING DATE & TIME</th>
                      <th>BDE NAME</th>
                      <th>COMPANY NAME</th>
                      <th>COMPANY NUMBER</th>
                      <th>COMPANY EMAIL</th>
                      <th>SERVICES</th>
                      <th>TOTAL PAYMENT</th>
                      <th>RECEIVED PAYMENT</th>
                      <th>PENDING PAYMENT</th>
                      <th>50/50 CASE</th>
                      <th>CLOSED/SUPPORTED BY</th>
                      <th>REMARKS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expand === "" &&
                      filteredBooking
                        .filter((data) => data.bdeName === tableEmployee)
                        .map((mainObj, index) => (
                          <>
                            <tr>
                              <td style={{ lineHeight: "32px" }}>{index + 1}</td>
                              <td>{`${formatDate(mainObj.bookingDate)}(${mainObj.bookingTime
                                })`}</td>
                              <td>{mainObj.bdeName}</td>
                              <td>{mainObj.companyName}</td>
                              <td>{mainObj.contactNumber}</td>
                              <td>{mainObj.companyEmail}</td>
                              <td>{mainObj.services[0]}</td>
                              <td>
                                ₹{(mainObj.bdeName !== mainObj.bdmName
                                  ? mainObj.originalTotalPayment / 2
                                  : mainObj.originalTotalPayment
                                ).toLocaleString()}
                              </td>
                              <td>
                                ₹{
                                  (mainObj.firstPayment !== 0
                                    ? mainObj.bdeName === mainObj.bdmName
                                      ? mainObj.firstPayment // If bdeName and bdmName are the same
                                      : mainObj.firstPayment / 2 // If bdeName and bdmName are different
                                    : mainObj.bdeName === mainObj.bdmName
                                      ? mainObj.originalTotalPayment // If firstPayment is 0 and bdeName and bdmName are the same
                                      : mainObj.originalTotalPayment / 2
                                  ).toLocaleString() // If firstPayment is 0 and bdeName and bdmName are different
                                }
                              </td>
                              <td>
                                {" "}
                                ₹{(mainObj.firstPayment !== 0
                                  ? mainObj.bdeName === mainObj.bdmName
                                    ? mainObj.originalTotalPayment - mainObj.firstPayment
                                    : (mainObj.originalTotalPayment -
                                      mainObj.firstPayment) /
                                    2
                                  : 0
                                ).toLocaleString()}{" "}
                              </td>
                              <td>
                                {mainObj.bdeName !== mainObj.bdmName ? "Yes" : "No"}
                              </td>
                              <td>
                                {mainObj.bdeName !== mainObj.bdmName
                                  ? mainObj.bdmType === "closeby"
                                    ? `Closed by ${mainObj.bdmName}`
                                    : `Supported by ${mainObj.bdmName}`
                                  : `Self Closed`}{" "}
                                {mainObj.bdeName !== mainObj.bdmName &&
                                  mainObj.bdmType === "closeby" && (
                                    <AddCircleIcon
                                      onClick={() => setExpand(mainObj.companyName)}
                                      style={{ cursor: "pointer" }}
                                    />
                                  )}
                              </td>
                              <td>{mainObj.paymentRemarks}</td>
                            </tr>
                            {expand === index && (
                              <>
                                <tr>
                                  <td style={{ lineHeight: "32px" }}>{`${index + 1
                                    }(${1})`}</td>
                                  <td>{`${formatDate(mainObj.bookingDate)}(${mainObj.bookingTime
                                    })`}</td>
                                  <td>{mainObj.bdmName}</td>
                                  <td>{mainObj.companyName}</td>
                                  <td>{mainObj.contactNumber}</td>
                                  <td>{mainObj.companyEmail}</td>
                                  <td>{mainObj.services[0]}</td>
                                  <td>
                                    {" "}
                                    {(
                                      mainObj.totalPayment / 2
                                    ).toLocaleString()}{" "}
                                  </td>
                                  <td>
                                    ₹{(mainObj.firstPayment !== 0
                                      ? mainObj.firstPayment / 2
                                      : mainObj.originalTotalPayment / 2
                                    ).toLocaleString()}{" "}
                                  </td>
                                  <td>
                                    ₹{(mainObj.firstPayment !== 0
                                      ? mainObj.bdeName === mainObj.bdmName
                                        ? mainObj.totalPayment -
                                        mainObj.firstPayment
                                        : (mainObj.originalTotalPayment -
                                          mainObj.firstPayment) /
                                        2
                                      : 0
                                    ).toLocaleString()}{" "}
                                  </td>
                                  <td>{"Yes"}</td>
                                  <td>{`${mainObj.bdeName}'s Case`}</td>
                                  <td>{mainObj.paymentRemarks}</td>
                                </tr>
                              </>
                            )}
                          </>
                        ))}
                  </tbody>
                  {expand === "" && (
                    <tfoot>
                      <tr>
                        <th colSpan={3}>
                          <strong>Total</strong>
                        </th>
                        <th>-</th>
                        <th>-</th>
                        <th>-</th>
                        <th>-</th>
                        <th>
                          ₹{filteredBooking
                            .filter((data) => data.bdeName === tableEmployee)
                            .reduce((total, obj) => {
                              return obj.bdeName === obj.bdmName
                                ? total + obj.originalTotalPayment
                                : total + obj.originalTotalPayment / 2;
                            }, 0)
                            .toLocaleString()}
                        </th>
                        <th>
                          ₹{filteredBooking
                            .filter((data) => data.bdeName === tableEmployee)
                            .reduce((total, obj) => {
                              return obj.bdeName === obj.bdmName
                                ? obj.firstPayment === 0
                                  ? total + obj.originalTotalPayment
                                  : total + obj.firstPayment
                                : obj.firstPayment === 0
                                  ? total + obj.originalTotalPayment / 2
                                  : total + obj.firstPayment / 2;
                            }, 0)
                            .toLocaleString()}
                        </th>
                        <th>
                          ₹{filteredBooking
                            .filter((data) => data.bdeName === tableEmployee)
                            .reduce((total, obj) => {
                              return obj.bdeName === obj.bdmName
                                ? obj.firstPayment === 0
                                  ? 0
                                  : total + (obj.originalTotalPayment - obj.firstPayment)
                                : obj.firstPayment === 0
                                  ? 0
                                  : total + (obj.originalTotalPayment - obj.firstPayment) / 2;
                            }, 0)
                            .toLocaleString()}
                        </th>
                        <th>-</th>
                        <th>-</th>
                        <th>-</th>
                      </tr>
                    </tfoot>
                  )}
                  <tbody>
                    {expand !== "" &&
                      filteredBooking
                        .filter(
                          (obj) =>
                            obj.bdeName === tableEmployee &&
                            obj.companyName === expand
                        )
                        .map((mainObj, index) => (
                          <>
                            <tr key={mainObj._id}>
                              <td style={{ lineHeight: "32px" }}>{`${index + 1
                                }`}</td>
                              <td>{`${formatDate(mainObj.bookingDate)}(${mainObj.bookingTime
                                })`}</td>
                              <td>{mainObj.bdeName}</td>
                              <td>{mainObj.companyName}</td>
                              <td>{mainObj.contactNumber}</td>
                              <td>{mainObj.companyEmail}</td>
                              <td>{mainObj.services}</td>
                              <td>{(mainObj.totalPayment / 2).toLocaleString()}</td>
                              <td>
                                ₹{(mainObj.firstPayment !== 0
                                  ? mainObj.firstPayment / 2
                                  : mainObj.totalPayment / 2
                                ).toLocaleString()}
                              </td>
                              <td>
                                ₹{(mainObj.firstPayment !== 0
                                  ? mainObj.bdeName === mainObj.bdmName
                                    ? mainObj.originalTotalPayment - mainObj.firstPayment
                                    : (mainObj.originalTotalPayment -
                                      mainObj.firstPayment) /
                                    2
                                  : 0
                                ).toLocaleString()}
                              </td>
                              <td>Yes</td>
                              <td>
                                {`Closed by ${mainObj.bdmName}`}{" "}
                                <RemoveCircleIcon
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setExpand("");
                                  }}
                                />{" "}
                              </td>
                              <td>{mainObj.paymentRemarks}</td>
                            </tr>
                            <tr>
                              <td style={{ lineHeight: "32px" }}>{`${index + 2
                                }`}</td>
                              <td>{`${formatDate(mainObj.bookingDate)}(${mainObj.bookingTime
                                })`}</td>
                              <td>{mainObj.bdmName}</td>
                              <td>{mainObj.companyName}</td>
                              <td>{mainObj.contactNumber}</td>
                              <td>{mainObj.companyEmail}</td>
                              <td>{mainObj.services[0]}</td>
                              <td>
                                {" "}
                                {(mainObj.originalTotalPayment / 2).toLocaleString()}{" "}
                              </td>
                              <td>
                                ₹{(mainObj.firstPayment !== 0
                                  ? mainObj.firstPayment / 2
                                  : mainObj.originalTotalPayment / 2
                                ).toLocaleString()}{" "}
                              </td>
                              <td>
                                ₹{(mainObj.firstPayment !== 0
                                  ? mainObj.bdeName === mainObj.bdmName
                                    ? mainObj.originalTotalPayment - mainObj.firstPayment
                                    : (mainObj.originalTotalPayment -
                                      mainObj.firstPayment) /
                                    2
                                  : 0
                                ).toLocaleString()}{" "}
                              </td>
                              <td>{"Yes"}</td>
                              <td>{`${mainObj.bdeName}'s Case`}</td>
                              <td>{mainObj.paymentRemarks}</td>
                            </tr>
                          </>
                        ))}
                  </tbody>
                  <tfoot>
                    {expand !== "" &&
                      filteredBooking
                        .filter(
                          (obj) =>
                            obj.bdeName === tableEmployee &&
                            obj.companyName === expand
                        )
                        .map((mainObj, index) => (
                          <>
                            <tr key={mainObj._id}>
                              <th colSpan={3}>Total :</th>
                              <th>-</th>
                              <th>-</th>
                              <th>-</th>
                              <th>-</th>
                              <th>{mainObj.originalTotalPayment.toLocaleString()}</th>
                              <th>
                                ₹{(mainObj.firstPayment !== 0
                                  ? mainObj.firstPayment
                                  : mainObj.originalTotalPayment
                                ).toLocaleString()}
                              </th>
                              <th>
                                ₹{(mainObj.firstPayment !== 0
                                  ? mainObj.originalTotalPayment - mainObj.firstPayment
                                  : 0
                                ).toLocaleString()}
                              </th>
                              <th>-</th>
                              <th>-</th>
                              <th>-</th>
                            </tr>
                          </>
                        ))}
                  </tfoot>
                </table>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog
            open={openEmployeeTable}
            onClose={closeEmployeeTable}
            fullWidth
            maxWidth="lg"
          >
            <DialogTitle>
              <div className="title-header d-flex justify-content-between">
                <div className="title-name">
                  <strong>
                    {selectedEmployee}
                  </strong>
                </div>
                <div style={{ cursor: 'pointer' }} className="closeIcon" onClick={closeEmployeeTable}>
                  <IoClose />
                </div>
              </div>

            </DialogTitle>
            <DialogContent>
              <div
                id="table-default"
                style={{
                  overflowX: "auto",
                  overflowY: "auto",
                  maxHeight: "60vh",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    border: "1px solid #ddd",
                    marginBottom: "10px",
                  }}
                  className="table-vcenter table-nowrap"
                >
                  <thead stSyle={{ backgroundColor: "grey" }}>
                    <tr
                      style={{
                        backgroundColor: "#ffb900",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      <th
                        style={{
                          lineHeight: "32px",
                        }}
                      >
                        Sr. No
                      </th>
                      <th>Lead Assign Date</th>
                      <th>Untouched</th>
                      <th>Busy</th>
                      <th>Not Picked Up</th>
                      <th>Junk</th>
                      <th>Follow Up</th>
                      <th>Interested</th>
                      <th>Not Interested</th>
                      <th>Matured</th>
                      <th>Total Leads</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uniqueArray &&
                      uniqueArray.map((obj, index) => (
                        <tr key={`row-${index}`}>
                          <td>{index + 1}</td>
                          <td style={{
                            lineHeight: "32px",
                          }}>{obj}</td>
                          <td>
                            {
                              (properCompanyData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Untouched"
                              ).length).toLocaleString()
                            }
                          </td>
                          <td>
                            {
                              (properCompanyData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Busy"
                              ).length).toLocaleString()
                            }
                          </td>
                          <td>
                            {
                              (properCompanyData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Not Picked Up"
                              ).length).toLocaleString()
                            }
                          </td>
                          <td>
                            {
                              (properCompanyData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Junk"
                              ).length).toLocaleString()
                            }
                          </td>
                          <td>
                            {
                              (properCompanyData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "FollowUp"
                              ).length).toLocaleString()
                            }
                          </td>
                          <td>
                            {
                              (properCompanyData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Interested"
                              ).length).toLocaleString()
                            }
                          </td>
                          <td>
                            {
                              (properCompanyData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Not Interested"
                              ).length).toLocaleString()
                            }
                          </td>
                          <td>
                            {
                              (properCompanyData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Matured"
                              ).length).toLocaleString()
                            }
                          </td>
                          <td>
                            {
                              (properCompanyData.filter(
                                (partObj) => formatDate(partObj.AssignDate) === obj
                              ).length).toLocaleString()
                            }
                          </td>
                        </tr>
                      ))}
                  </tbody>
                  {uniqueArray && (
                    <tfoot>
                      <tr style={{ fontWeight: 500 }}>
                        <td colSpan="2">Total</td>
                        <td>
                          {
                            (properCompanyData.filter(
                              (partObj) => partObj.Status === "Untouched"
                            ).length).toLocaleString()
                          }
                        </td>

                        <td
                          style={{
                            lineHeight: "32px",
                          }}
                        >
                          {
                            (properCompanyData.filter(
                              (partObj) => partObj.Status === "Busy"
                            ).length).toLocaleString()
                          }
                        </td>
                        <td>
                          {
                            (properCompanyData.filter(
                              (partObj) => partObj.Status === "Not Picked Up"
                            ).length).toLocaleString()
                          }
                        </td>
                        <td>
                          {
                            (properCompanyData.filter(
                              (partObj) => partObj.Status === "Junk"
                            ).length).toLocaleString()
                          }
                        </td>
                        <td>
                          {
                            (properCompanyData.filter(
                              (partObj) => partObj.Status === "FollowUp"
                            ).length).toLocaleString()
                          }
                        </td>
                        <td>
                          {
                            (properCompanyData.filter(
                              (partObj) => partObj.Status === "Interested"
                            ).length).toLocaleString()
                          }
                        </td>
                        <td>
                          {
                            (properCompanyData.filter(
                              (partObj) => partObj.Status === "Not Interested"
                            ).length).toLocaleString()
                          }
                        </td>
                        <td>
                          {
                            (properCompanyData.filter(
                              (partObj) => partObj.Status === "Matured"
                            ).length).toLocaleString()
                          }
                        </td>
                        <td>{(properCompanyData.length).toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </DialogContent>
          </Dialog>

          {/* -------------------------------------projection-dashboard--------------------------------------------- */}

          <div className="container-xl mt-2 projectionsummaryadmin" id="projectionsummaryadmin">
            <div className="card">
              <div className="card-header employeedashboard d-flex align-items-center justify-content-between" >
                <div>
                  <h2>Projection Summary</h2>
                </div>
                <div style={{ m: 1, width: '40ch', padding: "0px", marginRight: "30px" }}>
                  {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['SingleInputDateRangeField']}>
                      <DateRangePicker className="mydatepickerinput"
                        onChange={(values) => {
                          const startDate = moment(values[0]).format('DD/MM/YYYY');
                          const endDate = moment(values[1]).format('DD/MM/YYYY');
                          setSelectedDateRange([startDate, endDate]);
                          handleSelect(values); // Call handleSelect with the selected values
                        }}
                        slots={{ field: SingleInputDateRangeField }}
                        slotProps={{ textField: { InputProps: { endAdornment: <Calendar /> } } }}
                      />
                    </DemoContainer>
                  </LocalizationProvider> */}
                  <LocalizationProvider dateAdapter={AdapterDayjs} style={{ padding: "0px" }}>
                    <DemoContainer components={['SingleInputDateRangeField']}>
                      <DateRangePicker
                        slots={{ field: SingleInputDateRangeField }}
                        slotProps={{
                          shortcuts: {
                            items: shortcutsItems,
                          },
                          actionBar: { actions: [] },
                          textField: { InputProps: { endAdornment: <Calendar /> } }
                        }}
                      //calendars={1}
                      />
                    </DemoContainer>
                  </LocalizationProvider>

                </div>
                {/* <div className="form-control date-range-picker d-flex align-items-center justify-content-between">
                  <div>{`${formatDate(startDate)} - ${formatDate(endDate)}`}</div>
                  <button onClick={handleIconClick} style={{ border: "none", padding: "0px", backgroundColor: "white" }}>
                    <FaRegCalendar style={{ width: "20px", height: "20px", color: "#bcbaba", color: "black" }} />
                  </button>
                </div> */}
              </div>
              {/* {displayDateRange && (
                <div ref={dateRangePickerProhectionRef} className="position-absolute " style={{ zIndex: "1", top: "15%", left: "75%" }} >
                  <DateRangePicker
                    ranges={[selectionRange]}
                    //onClose={() => setDateRangeDisplay(false)}
                    onChange={handleSelect}
                  />
                </div>
              )} */}
              <div className="card-body">
                <div
                  id="table-default"
                  style={{
                    overflowX: "auto",
                    overflowY: "auto",
                    maxHeight: "60vh",
                  }}
                >
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      border: "1px solid #ddd",
                      marginBottom: "10px",
                    }}
                    className="table-vcenter table-nowrap"
                  >
                    <thead style={{
                      position: "sticky", // Make the header sticky
                      top: '-1px', // Stick it at the top
                      backgroundColor: "#ffb900",
                      color: "black",
                      fontWeight: "bold",
                      zIndex: 1, // Ensure it's above other content
                    }}>
                      <tr
                        style={{
                          backgroundColor: "#ffb900",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        <th
                          style={{
                            lineHeight: "32px",
                          }}
                        >
                          Sr. No
                        </th>
                        <th>Company Name</th>
                        <th>Total Companies
                        <SwapVertIcon
                        style={{
                          height: "15px",
                          width: "15px",
                          cursor: "pointer",
                          marginLeft: "4px",
                        }}
                        onClick={() => {
                          let newSortType;
                          if (sortTypeProjection === "ascending") {
                            newSortType = "descending";
                          } else if (sortTypeProjection === "descending") {
                            newSortType = "none";
                          } else {
                            newSortType = "ascending";
                          }
                          handleSortTotalCompanies(newSortType);
                        }}
                      />

                        </th>
                        <th>Offered Services</th>
                        <th>Total Offered Price</th>
                        <th>Expected Amount</th>
                        {/* <th>Est. Payment Date</th> */}

                      </tr>
                    </thead>
                    {/* <tbody>
                      {uniqueEnames &&
                        uniqueEnames.map((ename, index) => {
                          // Calculate the count of services for the current ename
                          // const serviceCount = filteredDataDateRange && (
                          //   // If filteredDataDateRange is not empty, use servicesByEnameDateRange
                          //   servicesByEnameDateRange[ename] ? servicesByEnameDateRange[ename].length : 0
                          // );
                          // const companyCount = companiesByEname[ename] ? companiesByEname[ename].length : 0;
                          let serviceCount;
                          if (filteredDataDateRange && filteredDataDateRange.length > 0) {
                            // If filteredDataDateRange is not empty, use companiesByEname
                            serviceCount = servicesByEnameDateRange[ename] ? servicesByEnameDateRange[ename].length : 0
                          } else {
                            // If filteredDataDateRange is empty, use followDataToday
                            serviceCount = servicesByEnameToday[ename] ? servicesByEnameToday[ename].length : 0
                          }

                          // const companyCount = filteredDataDateRange && (
                          //   // If filteredDataDateRange is not empty, use companiesByEnameDateRange
                          //   companiesByEnameDateRange[ename] ? companiesByEnameDateRange[ename].length : 0
                          // );
                          let companyCount;
                          if (filteredDataDateRange && filteredDataDateRange.length > 0) {
                            // If filteredDataDateRange is not empty, use companiesByEname
                            companyCount = companiesByEnameDateRange[ename] ? companiesByEnameDateRange[ename].length : 0
                          } else {
                            // If filteredDataDateRange is empty, use followDataToday
                            companyCount = companiesByEnameToday[ename] ? companiesByEnameToday[ename].length : 0
                          }
                          let totalPaymentByEname;
                          if (filteredDataDateRange && filteredDataDateRange.length > 0) {
                            // If filteredDataDateRange is not empty, use companiesByEname
                            totalPaymentByEname = (sumsDateRange[ename] ? sumsDateRange[ename].totalPaymentSum : 0)
                          } else {
                            // If filteredDataDateRange is empty, use followDataToday
                            totalPaymentByEname = (sumsToday[ename] ? sumsToday[ename].totalPaymentSum : 0)
                          }
                          let offeredPrizeByEname;
                          if (filteredDataDateRange && filteredDataDateRange.length > 0) {
                            // If filteredDataDateRange is not empty, use companiesByEname
                            offeredPrizeByEname = (sumsDateRange[ename] ? sumsDateRange[ename].offeredPaymentSum : 0)
                          } else {
                            // If filteredDataDateRange is empty, use followDataToday
                            offeredPrizeByEname = (sumsToday[ename] ? sumsToday[ename].offeredPaymentSum : 0)
                          }






                          //const totalPaymentByEname = sums[ename] ? sums[ename].totalPaymentSum : 0;
                          // const totalPaymentByEname = filteredDataDateRange &&
                          //   (sumsDateRange[ename] ? sumsDateRange[ename].totalPaymentSum : 0);


                          //const offeredPrizeByEname = sums[ename] ? sums[ename].offeredPaymentSum : 0;
                          // const offeredPrizeByEname = filteredDataDateRange.length &&
                          //   (sumsDateRange[ename] ? sumsDateRange[ename].offeredPaymentSum : 0)


                          const lastFollowDates = lastFollowDate[ename] || []; // Assuming lastFollowDate[ename] is an array of dates or undefined

                          // Get the latest date from the array
                          let latestDate;

                          if (Array.isArray(lastFollowDates) && lastFollowDates.length > 0) {
                            latestDate = new Date(Math.max(...lastFollowDates.map(date => new Date(date))));
                          } else if (lastFollowDates instanceof Date) {
                            // If lastFollowDates is a single date, directly assign it to latestDate
                            latestDate = lastFollowDates;
                          } else {
                            // Handle the case when lastFollowDates is not an array or a date
                            latestDate = new Date(); // Assigning current date as default value
                          }

                          // Format the latest date into a string
                          const formattedDate = latestDate.toLocaleDateString(); //


                          return (
                            <tr key={`row-${index}`}>
                              <td style={{ lineHeight: "32px" }}>{index + 1}</td>
                              <td>{ename}</td>
                              <td>{companyCount}
                                <FcDatabase
                                  onClick={() => {
                                    functionOpenProjectionTable(ename);
                                  }}
                                  style={{ cursor: "pointer", marginRight: "-71px", marginLeft: "58px" }}
                                /></td>
                              <td>{serviceCount}</td>
                              <td>  {totalPaymentByEname.toLocaleString('en-IN', numberFormatOptions)}</td>
                              <td>  {offeredPrizeByEname.toLocaleString('en-IN', numberFormatOptions)}</td>
                              <td>{filteredDataDateRange.length !== 0 ? formattedDate : new Date().toLocaleDateString()}</td>

                            </tr>
                          );
                        })}

                    </tbody>
                    {followData && (
                      <tfoot style={{
                        position: "sticky", // Make the footer sticky
                        bottom: -1, // Stick it at the bottom
                        backgroundColor: "#f6f2e9",
                        color: "black",
                        fontWeight: 500,
                        zIndex: 2, // Ensure it's above the content
                      }}>
                        <tr style={{ fontWeight: 500 }}>
                          <td style={{ lineHeight: '32px' }} colSpan="2">Total</td>
                          <td>{filteredDataDateRange && filteredDataDateRange.length > 0 ? (
                            totalcompaniesByEnameDateRange.length
                          ) : (totalcompaniesByEnameToday.length)
                          }
                          </td>
                          <td>
                            {filteredDataDateRange && filteredDataDateRange.length > 0 ? (
                              // If filteredDataDateRange is not empty, use totalServicesByEnameDateRange
                              totalservicesByEnameDateRange.length
                            ) : (totalservicesByEnameToday.length)}
                          </td>
                          // <td>{totalTotalPaymentSum.toLocaleString()}</td> 
                          <td>
                            {filteredDataDateRange && filteredDataDateRange.length > 0 ? (
                              // If filteredDataDateRange is not empty, use totalServicesByEnameDateRange
                              totalTotalPaymentSumDateRange.toLocaleString('en-IN', numberFormatOptions)
                            ) : (totalTotalPaymentSumToday.toLocaleString('en-IN', numberFormatOptions))}
                          </td>

                          // <td>{totalOfferedPaymentSum.toLocaleString()}</td>

                          <td>
                            {filteredDataDateRange.length && filteredDataDateRange.length > 0 ? (
                              // If filteredDataDateRange is not empty, use totalServicesByEnameDateRange
                              totalOfferedPaymentSumDateRange.toLocaleString('en-IN', numberFormatOptions)
                            ) : (totalOfferedPaymentSumToday.toLocaleString('en-IN', numberFormatOptions))}
                          </td>
                          <td>-</td>

                        </tr>
                      </tfoot>
                    )} */}
                    <tbody>
                      {sortedData ? (
                        sortedData.length !== 0 ? (
                          sortedData.map((obj, index) => (
                            <tr key={`row-${index}`}>
                              <td
                                style={{
                                  lineHeight: "32px",
                                }}
                              >
                                {index + 1}
                              </td>
                              <td>{obj}</td>
                              <td>
                                {
                                  followDataToday.filter(
                                    (partObj) =>
                                      partObj.ename === obj
                                  ).length
                                }
                                <FcDatabase
                                  onClick={() => {
                                    functionOpenProjectionTable(obj);
                                  }}
                                  style={{ cursor: "pointer", marginRight: "-71px", marginLeft: "58px" }}
                                />
                              </td>
                              <td>
                                {
                                  followDataToday.reduce((totalServices, partObj) => {
                                    if (partObj.ename === obj) {
                                      totalServices += partObj.offeredServices.length;
                                    }
                                    return totalServices;
                                  }, 0)
                                }
                              </td>
                              <td>
                                {
                                  followDataToday.reduce((totalOfferedPrize, partObj) => {
                                    if (partObj.ename === obj) {
                                      totalOfferedPrize += partObj.offeredPrize;
                                    }
                                    return totalOfferedPrize;
                                  }, 0)
                                }
                              </td>
                              <td>
                                {
                                  followDataToday.reduce((totalPaymentSum, partObj) => {
                                    if (partObj.ename === obj) {
                                      totalPaymentSum += partObj.totalPayment;
                                    }
                                    return totalPaymentSum;
                                  }, 0)
                                }
                              </td>
                            </tr>
                          ))) : (
                          <tr>
                            <td colSpan="11" style={{ textAlign: 'center' }}><Nodata /></td>
                          </tr>
                        )
                      ) : (<tr style={{ minHeight: "350px" }}><td colSpan={11}>
                        <ScaleLoader
                          color="lightgrey"
                          loading
                          size={10}
                          height="25"
                          width="2"
                          style={{ width: "10px", height: "10px" }}
                          //cssOverride={{ margin: '0 auto', width: "35", height: "4" }} // Adjust the size here
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                      </td></tr>)
                      }
                    </tbody>
                    {uniqueEnames && (
                      <tfoot >
                        <tr style={{ fontWeight: 500 }}>
                          <td style={{ lineHeight: "32px" }} colSpan="2">
                            Total
                          </td>
                          <td>
                            {
                              followDataToday.filter(
                                (partObj) => partObj.ename
                              ).length
                            }
                          </td>
                          <td>
                            {
                              followDataToday.reduce((totalServices, partObj) => {

                                totalServices += partObj.offeredServices.length;

                                return totalServices;
                              }, 0)
                            }
                          </td>
                          <td>
                            {
                              followDataToday.reduce((totalOfferedPrize, partObj) => {

                                totalOfferedPrize += partObj.offeredPrize;
                                return totalOfferedPrize;
                              }, 0)
                            }
                          </td>
                          <td>
                            {
                              followDataToday.reduce((totalPaymentSum, partObj) => {

                                totalPaymentSum += partObj.totalPayment;

                                return totalPaymentSum;
                              }, 0)
                            }
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>
            </div>
          </div>
          <Dialog
            open={openProjectionTable}
            onClose={closeProjectionTable}
            fullWidth
            maxWidth="lg"
          >
            <DialogContent>
              <div
                id="table-default"
                style={{
                  overflowX: "auto",
                  overflowY: "auto",
                  maxHeight: "60vh",
                }}
              >
                <div className="title-header d-flex justify-content-between">
                  <div className="title-name">
                    <strong>
                      {projectionEname} Today's Report
                    </strong>
                  </div>
                  <div style={{ cursor: 'pointer' }} className="closeIcon" onClick={closeProjectionTable}>
                    <IoClose style={{ width: "17px", height: "17px", marginBottom: "20px" }} />
                  </div>
                </div>



                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    border: "1px solid #ddd",
                    marginBottom: "10px",
                  }}
                  className="table-vcenter table-nowrap"
                >
                  <thead style={{
                    position: "sticky", // Make the header sticky
                    top: '-1px', // Stick it at the top
                    backgroundColor: "#ffb900",
                    color: "black",
                    fontWeight: "bold",
                    zIndex: 1, // Ensure it's above other content
                  }}>
                    <tr
                      style={{
                        backgroundColor: "#ffb900",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      <th
                        style={{
                          lineHeight: "32px",
                        }}
                      >
                        Sr. No
                      </th>
                      <th>BDE Name</th>
                      <th>Company Name</th>
                      <th>Offered Services</th>
                      <th>Total Offered Price</th>
                      <th>Expected Amount</th>
                      <th>Estimated Payment Date</th>
                      <th>Last Follow Up Date</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Map through uniqueEnames array to render rows */}

                    {
                      projectedDataDateRange && projectedDataDateRange.length > 0 ? (
                        projectedDataDateRange.map((obj, Index) => (
                          <tr key={`sub-row-${Index}`}>
                            <td style={{ lineHeight: "32px" }}>{Index + 1}</td>
                            {/* Render other employee data */}
                            <td>{obj.ename}</td>
                            <td>{obj.companyName}</td>
                            <td>{obj.offeredServices.join(",")}</td>
                            <td>&#8377;{obj.totalPayment.toLocaleString()}</td>
                            <td>&#8377;{obj.offeredPrize.toLocaleString()}</td>
                            <td>{obj.estPaymentDate}</td>
                            <td>{obj.lastFollowUpdate}</td>
                            <td>{obj.remarks}</td>
                          </tr>
                        ))
                      ) : (
                        projectedDataToday.map((obj, Index) => (
                          <tr key={`sub-row-${Index}`}>
                            <td style={{ lineHeight: "32px" }}>{Index + 1}</td>
                            {/* Render other employee data */}
                            <td>{obj.ename}</td>
                            <td>{obj.companyName}</td>
                            <td>{obj.offeredServices.join(",")}</td>
                            <td>&#8377;{obj.totalPayment.toLocaleString()}</td>
                            <td>&#8377;{obj.offeredPrize.toLocaleString()}</td>
                            <td>{obj.estPaymentDate}</td>
                            <td>{obj.lastFollowUpdate}</td>
                            <td>{obj.remarks}</td>
                          </tr>
                        ))
                      )
                    }
                  </tbody>
                  {projectedEmployee && (
                    <tfoot style={{
                      position: "sticky", // Make the footer sticky
                      bottom: -1, // Stick it at the bottom
                      backgroundColor: "#f6f2e9",
                      color: "black",
                      fontWeight: 500,
                      zIndex: 2
                    }}>
                      <tr style={{ fontWeight: 500 }}>
                        <td style={{ lineHeight: '32px' }} colSpan="2">Total</td>
                        {/* <td>{projectedEmployee.length}</td> */}
                        <td>
                          {projectedDataDateRange && projectedDataDateRange.length > 0 ? (projectedDataDateRange.length) : (projectedDataToday.length)}
                        </td>
                        {/* <td>{offeredServicesPopup.length}
                    </td> */}
                        <td>{projectedDataDateRange && projectedDataDateRange.length > 0 ? (offeredServicesPopupDateRange.length) : (offeredServicesPopupToday.length)}</td>
                        {/* <td>{totalPaymentSumPopup.toLocaleString()}
                    </td> */}
                        <td>
                          &#8377;{projectedDataDateRange && projectedDataDateRange.length > 0 ? (totalPaymentSumPopupDateRange.toLocaleString()) : (totalPaymentSumPopupToday.toLocaleString())}
                        </td>
                        {/* <td>{offeredPaymentSumPopup.toLocaleString()}
                    </td> */}
                        <td>   &#8377;{projectedDataDateRange && projectedDataDateRange.length > 0 ? (offeredPaymentSumPopupDateRange.toLocaleString()) : (offeredPaymentSumPopupToday.toLocaleString())}</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div >
  );
}

export default Dashboard;
