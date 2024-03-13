import React, { useEffect, useState } from "react";
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
import { DateRangePicker } from 'react-date-range';
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

import AnnouncementIcon from "@mui/icons-material/Announcement";
import { lastDayOfDecade } from "date-fns";
// import LoginAdmin from "./LoginAdmin";

function Dashboard() {
  const [recentUpdates, setRecentUpdates] = useState([]);
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
    untouched: "ascending",
    notPickedUp: "ascending",
    busy: "ascending",
    junk: "ascending",
    notInterested: "ascending",
    followUp: "ascending",
    matured: "ascending",
    interested: "ascending",
    lastLead: "ascending",
    totalLeads : 'ascending'
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
  const fetchData = async () => {
   if(showUpdates){ try {
      // Make a GET request to fetch recent updates data
      const response = await axios.get(`${secretKey}/recent-updates`);
      // Set the retrieved data in the state
      setRecentUpdates(response.data);
    } catch (error) {
      console.error("Error fetching recent updates:", error.message);
    }}else{
      setRecentUpdates([]);
    }
  };
  useEffect(() => {
 

    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${secretKey}/companies`);
        const today = new Date().toLocaleDateString();
        const data = response.data.companies;

        const filteredData = data.filter((company) => {
          // Assuming bookingDate is in the format of a string representing a date (e.g., "YYYY-MM-DD")
          const companyDate = formatDate(company.bookingDate);

          return companyDate === today;
        });

        setBookingObject(data);
        setFilteredBooking(filteredData);
      } catch (error) {
        console.error("Error Fetching Booking Details", error.message);
      }
    };

    // Call the fetchData function when the component mounts

    fetchCompanies();
    fetchCompanyData();
    fetchEmployeeInfo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

useEffect(()=>{
  fetchData();
} , [showUpdates])

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


  // ----------------------------------projection-dashboard-----------------------------------------------

  const fetchFollowUpData = async () => {

    try {
      const response = await fetch(`${secretKey}/projection-data`);
      const followdata = await response.json();
      setfollowData(followdata)
      console.log("followdata", followdata)
    } catch (error) {
      console.error('Error fetching data:', error);
      return { error: 'Error fetching data' };
    }
  }

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
  //console.log("Total totalPaymentSum:", totalTotalPaymentSum);
  //console.log("Total offeredPaymentSum:", totalOfferedPaymentSum);
  const functionOpenProjectionTable = (ename) => {
    //console.log("Ename:", ename)
    setopenProjectionTable(true);
    const projectedData = followData.filter(obj => obj.ename === ename);
    const projectedDataDateRange = filteredDataDateRange.filter(obj => obj.ename === ename)
    console.log(projectedDataDateRange)
    setProjectedEmployee(projectedData);
    setProjectedDataDateRange(projectedDataDateRange)
  };
  //console.log(projectedEmployee)
  console.log(projectedDataDateRange)

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


  const handleCloseIconClick = () => {
    if (displayDateRange) {
      setDateRangeDisplay(false)
    }
  }

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: 'selection',
  };

  const handleSelect = (date) => {
    const filteredDataDateRange = followData.filter(product => {
      const productDate = new Date(product["estPaymentDate"]);
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
    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);
    setFilteredDataDateRange(filteredDataDateRange);
    //console.log(filteredDataDateRange)
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

  //console.log(servicesByEnameDateRange)

  const totalservicesByEnameDateRange = filteredDataDateRange.reduce((acc, curr) => {
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

  //console.log(companiesByEnameDateRange)

  const totalcompaniesByEnameDateRange = filteredDataDateRange.reduce((accumulate, current) => {
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

  let totalTotalPaymentSumDateRange = 0;
  let totalOfferedPaymentSumDateRange = 0;

  // Iterate over the values of sumsDateRange object
  Object.values(sumsDateRange).forEach(({ totalPaymentSum, offeredPaymentSum }) => {
    totalTotalPaymentSumDateRange += totalPaymentSum;
    totalOfferedPaymentSumDateRange += offeredPaymentSum;
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
  console.log(totalPaymentSumPopupDateRange)
  console.log(offeredPaymentSumPopupDateRange)
  console.log(offeredServicesPopupDateRange)



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
      untouched: prevData.untouched === "ascending" ? "descending" : "ascending"
    }));
    switch (sortBy1) {

      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {}
        companyData.forEach((company) => {
          if ((company.Status === "Untouched") 
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

  // for busy
  
  const handleSortbusy = (sortBy1) => {
    setSortType(prevData => ({
      ...prevData,
      busy: prevData.busy === "ascending" ? "descending" : "ascending"
    }));
    switch (sortBy1) {

      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {}
        companyData.forEach((company) => {
          if ((company.Status === "Busy") 
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
      interested: prevData.interested === "ascending" ? "descending" : "ascending"
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
      matured: prevData.matured === "ascending" ? "descending" : "ascending"
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
      notInterested: prevData.notInterested === "ascending" ? "descending" : "ascending"
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
      junk: prevData.junk === "ascending" ? "descending" : "ascending"
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
      followUp: prevData.followUp === "ascending" ? "descending" : "ascending"
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
      followUp: prevData.followUp === "ascending" ? "descending" : "ascending"
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

  function filterSearch(searchTerm) {
    setSearchTerm(searchTerm)
    setEmployeeData(employeeDataFilter.filter(company =>
      company.ename.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  }

  // ------------------------------------------sidebar---------------------------------------------------------------

  const handleArrow=()=>{
    setDisplayArrow(false)
    setsideBar(true)
  }

  const handleArrowClose=()=>{
    setDisplayArrow(true)
    setsideBar(false)
  }

  return (
    <div>
      <Header />
      <Navbar />
      <div className="d-flex align-items-center">
        
        <div>
          <div className="page-wrapper">
            <div className="recent-updates-icon">
              <IconButton
                style={{ backgroundColor: "#ffb900", color: "white" }}
                onClick={changeUpdate}
              >
                <AnnouncementIcon />
              </IconButton>
            </div>
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
                  <div className="col card todays-booking m-2" >
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <div>
                        <h2>Total Booking</h2>
                      </div>
                      <div className=" form-control d-flex align-items-center justify-content-between" style={{ width: "15vw" }}>
                        <div style={{ cursor: 'pointer' }} onClick={() => setShowBookingDate(!showBookingDate)}>
                          {`${formatDate(startDateAnother)} - ${formatDate(endDateAnother)}`}
                        </div>
                        <button onClick={() => setShowBookingDate(!showBookingDate)} style={{ border: "none", padding: "0px", backgroundColor: "white" }}>
                          <FaRegCalendar style={{ width: "20px", height: "20px", color: "#bcbaba", color: "black" }} />
                        </button>
                      </div>
                    </div>
                    {showBookingDate && <div
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
                    </div>}
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
                  <div className="employee-dashboard ">
                    <div className="card">
                      <div className="card-header d-flex align-items-center justify-content-between">
                        <div className="d-flex justify-content-between">
                          <div style={{minWidth:'14vw'}} className="dashboard-title">
                          <h2 style={{marginBottom:'5px'}}>Employee Dashboard</h2>
                          </div>
                          <div className="dashboard-searchbar form-control d-flex justify-content-center align-items-center">
                            <input  value={searchTerm}
                                          onChange={(e) => filterSearch(e.target.value)} placeholder="Enter BDE Name..." style={{border:"none"}} type="text" name="bdeName-search" id="bdeName-search" />
                            <CiSearch style={{
                                        width: "19px",
                                        height: "20px",
                                        marginRight: "5px",
                                        color: "grey"
                                      }} />
                          </div>
                          

                        </div>
                        <div className="form-control d-flex align-items-center justify-content-between" style={{ width: "15vw" }}>
                          <div>{`${formatDate(startDateEmployee)} - ${formatDate(endDateEmployee)}`}</div>
                          <button onClick={() => setDateRangeDisplayEmployee(!displayDateRangeEmployee)} style={{ border: "none", padding: "0px", backgroundColor: "white" }}>
                            <FaRegCalendar style={{ width: "20px", height: "20px", color: "#bcbaba", color: "black" }} />
                          </button>
                        </div>
                      </div>
                      {displayDateRangeEmployee && (
                        <div className="position-absolute " style={{ zIndex: "1000", top: "15%", left: "75%" }} >
                          <DateRangePicker
                            ranges={[selectionRangeEmployee]}
                            onClose={() => setDateRangeDisplayEmployee(false)}
                            onChange={handleSelectEmployee}
                          />
                        </div>
                      )}
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
                                <th>Untouched
                                  <SwapVertIcon
                                    style={{
                                      height: "15px",
                                      width: "15px",
                                      cursor: "pointer",
                                      marginLeft: "4px",
                                    }}
                                    onClick={(e) => handleSortUntouched(sortType.untouched === "ascending" ? "descending" : 'ascending')}
                                  />
                                  
                                </th>
                                <th>Busy
                                  <SwapVertIcon
                                    style={{
                                      height: "15px",
                                      width: "15px",
                                      cursor: "pointer",
                                      marginLeft: "4px",
                                    }}
                                    onClick={(e) => handleSortbusy(sortType.busy === "ascending" ? "descending" : 'ascending')}
                                  />
                                  
                                </th>
                                <th>Not Picked Up
                                  <SwapVertIcon
                                    style={{
                                      height: "15px",
                                      width: "15px",
                                      cursor: "pointer",
                                      marginLeft: "4px",
                                    }}
                                    onClick={(e) => handleSortFollowUp(sortType.followUp === "ascending" ? "descending" : 'ascending')}
                                  />
                                 
                                </th>
                                <th>Junk
                                  <SwapVertIcon
                                    style={{
                                      height: "15px",
                                      width: "15px",
                                      cursor: "pointer",
                                      marginLeft: "4px",
                                    }}
                                    onClick={(e) => handleSortJunk(sortType.junk === "ascending" ? "descending" : 'ascending')}
                                  />
                                  
                                </th>
                                <th>Follow Up
                                  <SwapVertIcon
                                    style={{
                                      height: "15px",
                                      width: "15px",
                                      cursor: "pointer",
                                      marginLeft: "4px",
                                    }}
                                    onClick={(e) => handleSortFollowUp(sortType.followUp === "ascending" ? "descending" : 'ascending')}
                                  />
                                  
                                </th>
                                <th>Interested
                                  <SwapVertIcon
                                    style={{
                                      height: "15px",
                                      width: "15px",
                                      cursor: "pointer",
                                      marginLeft: "4px",
                                    }}
                                    onClick={(e) => handleSortInterested(sortType.interested === "ascending" ? "descending" : 'ascending')}
                                  />
                                 
                                </th>
                                <th>Not Interested
                                  <SwapVertIcon
                                    style={{
                                      height: "15px",
                                      width: "15px",
                                      cursor: "pointer",
                                      marginLeft: "4px",
                                    }}
                                    onClick={(e) => handleSortNotInterested(sortType.notInterested === "ascending" ? "descending" : 'ascending')}
                                  />
                                  
                                </th>
                                <th>Matured
                                  <SwapVertIcon
                                    style={{
                                      height: "15px",
                                      width: "15px",
                                      cursor: "pointer",
                                      marginLeft: "4px",
                                    }}
                                    onClick={(e) => handleSortMatured(sortType.matured === "ascending" ? "descending" : 'ascending')}
                                  />
                                  
                                </th>
                                <th>Total Leads
                                  <SwapVertIcon
                                    style={{
                                      height: "15px",
                                      width: "15px",
                                      cursor: "pointer",
                                      marginLeft: "4px",
                                    }}
                                    onClick={(e) => handleSortTotalLeads(sortType.totalLeads === "ascending" ? "descending" : 'ascending')}
                                  />
                                 
                                </th>
                                <th>Last Lead Assign Date
                                  <SwapVertIcon
                                    style={{
                                      height: "15px",
                                      width: "15px",
                                      cursor: "pointer",
                                      marginLeft: "4px",
                                    }}
                                    onClick={(e) => handleSortInterested(sortType.interested === "ascending" ? "descending" : 'ascending')}
                                  />
                                 
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
                                        }}
                                        key={`row-${index}-1`}
                                      >
                                        {index + 1}
                                      </td>
                                      <td key={`row-${index}-2`}>{obj.ename}</td>
                                      <td key={`row-${index}-3`}>
                                        {
                                          companyData.filter(
                                            (data) =>
                                              data.ename === obj.ename &&
                                              data.Status === "Untouched"
                                          ).length
                                        }
                                      </td>
                                      <td key={`row-${index}-4`}>
                                        {
                                          companyData.filter(
                                            (data) =>
                                              data.ename === obj.ename &&
                                              data.Status === "Busy"
                                          ).length
                                        }
                                      </td>
                                      <td key={`row-${index}-5`}>
                                        {
                                          companyData.filter(
                                            (data) =>
                                              data.ename === obj.ename &&
                                              data.Status === "Not Picked Up"
                                          ).length
                                        }
                                      </td>
                                      <td key={`row-${index}-6`}>
                                        {
                                          companyData.filter(
                                            (data) =>
                                              data.ename === obj.ename &&
                                              data.Status === "Junk"
                                          ).length
                                        }
                                      </td>
                                      <td key={`row-${index}-7`}>
                                        {
                                          companyData.filter(
                                            (data) =>
                                              data.ename === obj.ename &&
                                              data.Status === "FollowUp"
                                          ).length
                                        }
                                      </td>
                                      <td key={`row-${index}-8`}>
                                        {
                                          companyData.filter(
                                            (data) =>
                                              data.ename === obj.ename &&
                                              data.Status === "Interested"
                                          ).length
                                        }
                                      </td>
                                      <td key={`row-${index}-9`}>
                                        {
                                          companyData.filter(
                                            (data) =>
                                              data.ename === obj.ename &&
                                              data.Status === "Not Interested"
                                          ).length
                                        }
                                      </td>
                                      <td key={`row-${index}-10`}>
                                        {
                                          companyData.filter(
                                            (data) =>
                                              data.ename === obj.ename &&
                                              data.Status === "Matured"
                                          ).length
                                        }
                                      </td>
                                      <td key={`row-${index}-11`}>
                                        {
                                          companyData.filter(
                                            (data) => data.ename === obj.ename
                                          ).length
                                        }
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
                                          style={{ cursor: "pointer", marginRight: "-41px", marginLeft: "21px" , fontSize:'17px' }}
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
                                        companyData.filter(
                                          (partObj) =>
                                            partObj.Status === "Untouched"
                                        ).length
                                      }
                                    </td>
                                    <td>
                                      {
                                        companyData.filter(
                                          (partObj) => partObj.Status === "Busy"
                                        ).length
                                      }
                                    </td>
                                    <td>
                                      {
                                        companyData.filter(
                                          (partObj) =>
                                            partObj.Status === "Not Picked Up"
                                        ).length
                                      }
                                    </td>
                                    <td>
                                      {
                                        companyData.filter(
                                          (partObj) => partObj.Status === "Junk"
                                        ).length
                                      }
                                    </td>
                                    <td>
                                      {
                                        companyData.filter(
                                          (partObj) => partObj.Status === "FollowUp"
                                        ).length
                                      }
                                    </td>
                                    <td>
                                      {
                                        companyData.filter(
                                          (partObj) =>
                                            partObj.Status === "Interested"
                                        ).length
                                      }
                                    </td>
                                    <td>
                                      {
                                        companyData.filter(
                                          (partObj) =>
                                            partObj.Status === "Not Interested"
                                        ).length
                                      }
                                    </td>
                                    <td>
                                      {
                                        companyData.filter(
                                          (partObj) => partObj.Status === "Matured"
                                        ).length
                                      }
                                    </td>
                                    <td>{companyData.length}</td>
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
                      <div style={{cursor:'pointer'}} className="closeIcon" onClick={closeEmployeeTable}>
                        <CloseIcon/>
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
                          <td  style={{
                            lineHeight: "32px",
                          }}>{obj}</td>
                          <td>
                            {
                              properCompanyData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Untouched"
                              ).length
                            }
                          </td>
                          <td>
                            {
                              properCompanyData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Busy"
                              ).length
                            }
                          </td>
                          <td>
                            {
                              properCompanyData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Not Picked Up"
                              ).length
                            }
                          </td>
                          <td>
                            {
                              properCompanyData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Junk"
                              ).length
                            }
                          </td>
                          <td>
                            {
                              properCompanyData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "FollowUp"
                              ).length
                            }
                          </td>
                          <td>
                            {
                              properCompanyData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Interested"
                              ).length
                            }
                          </td>
                          <td>
                            {
                              properCompanyData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Not Interested"
                              ).length
                            }
                          </td>
                          <td>
                            {
                              properCompanyData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Matured"
                              ).length
                            }
                          </td>
                          <td>
                            {
                              properCompanyData.filter(
                                (partObj) => formatDate(partObj.AssignDate) === obj
                              ).length
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
                            properCompanyData.filter(
                              (partObj) => partObj.Status === "Untouched"
                            ).length
                          }
                        </td>
                      
                        <td
                          style={{
                            lineHeight: "32px",
                          }}
                        >
                          {
                            properCompanyData.filter(
                              (partObj) => partObj.Status === "Busy"
                            ).length
                          }
                        </td>
                        <td>
                          {
                            properCompanyData.filter(
                              (partObj) => partObj.Status === "Not Picked Up"
                            ).length
                          }
                        </td>
                        <td>
                          {
                            properCompanyData.filter(
                              (partObj) => partObj.Status === "Junk"
                            ).length
                          }
                        </td>
                        <td>
                          {
                            properCompanyData.filter(
                              (partObj) => partObj.Status === "FollowUp"
                            ).length
                          }
                        </td>
                        <td>
                          {
                            properCompanyData.filter(
                              (partObj) => partObj.Status === "Interested"
                            ).length
                          }
                        </td>
                        <td>
                          {
                            properCompanyData.filter(
                              (partObj) => partObj.Status === "Not Interested"
                            ).length
                          }
                        </td>
                        <td>
                          {
                            properCompanyData.filter(
                              (partObj) => partObj.Status === "Matured"
                            ).length
                          }
                        </td>
                        <td>{properCompanyData.length}</td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </DialogContent>
          </Dialog>

          {/* -------------------------------------projection-dashboard--------------------------------------------- */}

          <div className="container-xl mt-2" onClick={handleCloseIconClick}>
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between" >
                <div>
                  <h2>Projection Dashboard</h2>
                </div>
                <div className="form-control d-flex align-items-center justify-content-between" style={{ width: "15vw" }}>
                  <div>{`${formatDate(startDate)} - ${formatDate(endDate)}`}</div>
                  <button onClick={() => setDateRangeDisplay(!displayDateRange)} style={{ border: "none", padding: "0px", backgroundColor: "white" }}>
                    <FaRegCalendar style={{ width: "20px", height: "20px", color: "#bcbaba", color: "black" }} />
                  </button>
                </div>
              </div>
              {displayDateRange && (
                <div className="position-absolute " style={{ zIndex: "1", top: "15%", left: "75%" }} >
                  <DateRangePicker
                    ranges={[selectionRange]}
                    //onClose={() => setDateRangeDisplay(false)}
                    onChange={handleSelect}
                  />
                </div>
              )}
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
                        <th>Company Name</th>
                        <th>Total Companies</th>
                        <th>Offered Services</th>
                        <th>Total Offered Price</th>
                        <th>Expected Amount</th>
                        <th>Est. Payment Date</th>

                      </tr>
                    </thead>
                    <tbody>
                      {uniqueEnames &&
                        uniqueEnames.map((ename, index) => {
                          // Calculate the count of services for the current ename
                          const serviceCount = filteredDataDateRange && (
                            // If filteredDataDateRange is not empty, use servicesByEnameDateRange
                            servicesByEnameDateRange[ename] ? servicesByEnameDateRange[ename].length : 0
                          );
                          // const companyCount = companiesByEname[ename] ? companiesByEname[ename].length : 0;

                          const companyCount = filteredDataDateRange && (
                            // If filteredDataDateRange is not empty, use companiesByEnameDateRange
                            companiesByEnameDateRange[ename] ? companiesByEnameDateRange[ename].length : 0
                          );
                          //const totalPaymentByEname = sums[ename] ? sums[ename].totalPaymentSum : 0;
                          const totalPaymentByEname = filteredDataDateRange &&
                            (sumsDateRange[ename] ? sumsDateRange[ename].totalPaymentSum : 0);


                          //const offeredPrizeByEname = sums[ename] ? sums[ename].offeredPaymentSum : 0;
                          const offeredPrizeByEname = filteredDataDateRange.length &&
                            (sumsDateRange[ename] ? sumsDateRange[ename].offeredPaymentSum : 0)


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
                              <td>{totalPaymentByEname}</td>
                              <td>{offeredPrizeByEname}</td>
                              <td>{formattedDate}</td>

                            </tr>
                          );
                        })}

                    </tbody>
                    {followData && (
                      <tfoot>
                        <tr style={{ fontWeight: 500 }}>
                          <td style={{ lineHeight: '32px' }} colSpan="2">Total</td>
                          <td>{filteredDataDateRange && (
                            // If filteredDataDateRange is not empty, use totalServicesByEnameDateRange
                            totalcompaniesByEnameDateRange.length
                          )}
                          </td>
                          <td>
                            {filteredDataDateRange && (
                              // If filteredDataDateRange is not empty, use totalServicesByEnameDateRange
                              totalservicesByEnameDateRange.length
                            )}
                          </td>
                          {/* <td>{totalTotalPaymentSum.toLocaleString()}
                      </td> */}
                          <td>
                            {filteredDataDateRange && (
                              // If filteredDataDateRange is not empty, use totalServicesByEnameDateRange
                              totalTotalPaymentSumDateRange.toLocaleString()
                            )}
                          </td>

                          {/* <td>{totalOfferedPaymentSum.toLocaleString()}
                      </td> */}

                          <td>
                            {filteredDataDateRange.length && (
                              // If filteredDataDateRange is not empty, use totalServicesByEnameDateRange
                              totalOfferedPaymentSumDateRange.toLocaleString()
                            )}
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

                    {projectedDataDateRange &&
                      // (projectedEmployee.map((obj, Index) => (
                      //   <tr key={`sub-row-${Index}`}>
                      //     <td style={{ lineHeight: "32px" }}>{Index + 1}</td>
                      //     {/* Render other employee data */}
                      //     <td>{obj.ename}</td>
                      //     <td>{obj.companyName}</td>
                      //     <td>{obj.offeredServices.join(',')}</td>
                      //     <td>{obj.totalPayment.toLocaleString()}</td>
                      //     <td>{obj.offeredPrize.toLocaleString()}</td>
                      //     <td>{obj.estPaymentDate}</td>
                      //   </tr>
                      // ))) :
                      (projectedDataDateRange.map((obj, Index) => (
                        <tr key={`sub-row-${Index}`}>
                          <td style={{ lineHeight: "32px" }}>{Index + 1}</td>
                          {/* Render other employee data */}
                          <td>{obj.ename}</td>
                          <td>{obj.companyName}</td>
                          <td>{obj.offeredServices.join(',')}</td>
                          <td>{obj.totalPayment.toLocaleString()}</td>
                          <td>{obj.offeredPrize.toLocaleString()}</td>
                          <td>{obj.estPaymentDate}</td>
                          <td>{obj.lastFollowUpdate}</td>
                          <td>{obj.remarks}</td>
                        </tr>
                      )))
                    }
                  </tbody>
                  {projectedEmployee && (
                    <tfoot>
                      <tr style={{ fontWeight: 500 }}>
                        <td style={{ lineHeight: '32px' }} colSpan="2">Total</td>
                        {/* <td>{projectedEmployee.length}</td> */}
                        <td>
                          {projectedDataDateRange && projectedDataDateRange.length}
                        </td>
                        {/* <td>{offeredServicesPopup.length}
                    </td> */}
                        <td>{projectedDataDateRange && offeredServicesPopupDateRange.length}</td>
                        {/* <td>{totalPaymentSumPopup.toLocaleString()}
                    </td> */}
                        <td>
                          ₹{projectedDataDateRange && totalPaymentSumPopupDateRange.toLocaleString()}
                        </td>
                        {/* <td>{offeredPaymentSumPopup.toLocaleString()}
                    </td> */}
                        <td> ₹{projectedDataDateRange && offeredPaymentSumPopupDateRange.toLocaleString()}</td>
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
