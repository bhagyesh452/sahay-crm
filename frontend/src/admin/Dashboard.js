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
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
//import { DateRangePicker } from 'react-date-range';
import { FaChevronDown } from "react-icons/fa6";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { options } from "../components/Options.js";
import FilterListIcon from "@mui/icons-material/FilterList";
import { FaRegCalendar } from "react-icons/fa";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { FcDatabase } from "react-icons/fc";
import { MdPersonSearch } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { debounce } from "lodash";
import { Link } from "react-router-dom";
import ScaleLoader from "react-spinners/ScaleLoader";
import { MdHistory } from "react-icons/md";

import AnnouncementIcon from "@mui/icons-material/Announcement";
import { lastDayOfDecade, parse } from "date-fns";
import StatusInfo from "./StausInfo.js";
import Calendar from "@mui/icons-material/Event";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import moment from "moment";
import { StaticDateRangePicker } from "@mui/x-date-pickers-pro/StaticDateRangePicker";
import dayjs from "dayjs";
import { IoClose } from "react-icons/io5";
import Select from "react-select";

// import { LicenseInfo } from '@mui/x-date-pickers-pro';

// LicenseInfo.setLicenseKey(
//   'x0jTPl0USVkVZV0SsMjM1kDNyADM5cjM2ETPZJVSQhVRsIDN0YTM6IVREJ1T0b9586ef25c9853decfa7709eee27a1e',
// );

// import LoginAdmin from "./LoginAdmin";

function Dashboard() {
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [bookingDateFilter, setbookingDateFilter] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [bookingObject, setBookingObject] = useState([]);
  const [uniqueBDE, setUniqueBDE] = useState([]);
  const [redesignedData, setRedesignedData] = useState([]);
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
  const [followData, setfollowData] = useState([]);
  const [openProjectionTable, setopenProjectionTable] = useState(false);
  const [openProjectionHistoryTable, setopenProjectionHistoryTable] = useState(false);
  const [projectedEmployee, setProjectedEmployee] = useState([]);
  const [displayDateRange, setDateRangeDisplay] = useState(false);
  const [displayDateRangeEmployee, setDateRangeDisplayEmployee] = useState(false);
  const [buttonToggle, setButtonToggle] = useState(false);
  const [projectedDataDateRange, setProjectedDataDateRange] = useState([]);
  const [startDateEmployee, setStartDateEmployee] = useState(new Date());
  const [endDateEmployee, setEndDateEmployee] = useState(new Date());
  const [showBookingDate, setShowBookingDate] = useState(false);
  const [startDateAnother, setStartDateAnother] = useState(new Date());
  const [endDateAnother, setEndDateAnother] = useState(new Date());
  const [projectionEname, setProjectionEname] = useState("");
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
    totalLeads: "none",
  });

  const [searchOption, setSearchOption] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sideBar, setsideBar] = useState(false);
  const [displayArrow, setDisplayArrow] = useState(true);
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const convertedDate = date.toLocaleDateString();
    return convertedDate;
  };

  const dateRangePickerRef = useRef(null);
  const dateRangePickerProhectionRef = useRef(null);
  const dateRangePickerEmployeeRef = useRef(null);

  const [companyDataTotal , setCompanyDataTotal] = useState([])

  // https://startupsahay.in/api
  const fetchCompanyData = async () => {
    fetch(`${secretKey}/leads`)
      .then((response) => response.json())
      .then((data) => {
        setCompanyData(data.filter((obj) => obj.ename !== "Not Alloted"));
        setcompanyDataFilter(data.filter((obj) => obj.ename !== "Not Alloted"));
        setCompanyDataTotal(data.filter((obj) => obj.ename !== "Not Alloted"));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const [employeeInfo, setEmployeeInfo] = useState([])
  const [forwardEmployeeData, setForwardEmployeeData] = useState([])
  const [forwardEmployeeDataFilter, setForwardEmployeeDataFilter] = useState([])
  const [forwardEmployeeDataNew, setForwardEmployeeDataNew] = useState([])

  const fetchEmployeeInfo = async () => {
    fetch(`${secretKey}/einfo`)
      .then((response) => response.json())
      .then((data) => {
        setEmployeeData(data.filter((employee) => employee.designation === "Sales Executive"));
        setEmployeeDataFilter(data.filter((employee) => employee.designation === "Sales Executive"));
        setEmployeeInfo(data.filter((employee) => employee.designation === "Sales Executive"))
        setForwardEmployeeData(data.filter((employee) => employee.designation === "Sales Executive" || employee.designation === "Sales Manager"))
        setForwardEmployeeDataFilter(data.filter((employee) => employee.designation === "Sales Executive" || employee.designation === "Sales Manager"))
        setForwardEmployeeDataNew(data.filter((employee) => employee.designation === "Sales Executive" || employee.designation === "Sales Manager"))
        // setEmployeeDataFilter(data.filter)
      })
      .catch((error) => {
        console.error(`Error Fetching Employee Data `, error);
      });
  };

  const [teamLeadsData, setTeamLeadsData] = useState([])
  const [teamLeadsDataFilter, setTeamLeadsDataFilter] = useState([])

  const fetchTeamLeadsData = async () => {
    try {
      const response = await axios.get(`${secretKey}/teamleadsdata`)
      setTeamLeadsData(response.data)
      setTeamLeadsDataFilter(response.data)

      //console.log("teamleadsdata" , response.data)

    } catch (error) {
      console.log(error.messgae, "Error fetching team leads data")
    }
  }
  //console.log("forwardemployeedata" , forwardEmployeeData)

  useEffect(() => {
    fetchTeamLeadsData()
  }, [])


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
      //console.log(` startDate : ${startDateAnother} , endDate : ${endDateAnother}`, data);

      // Update state with the fetched data
      setBookingObject(data);
      setFilteredBooking(data);
    } catch (error) {
      console.error("Error Fetching Booking Details", error.message);
    }
  };

  const [bdeResegnedData, setBdeRedesignedData] = useState([])

  const fetchRedesignedBookings = async () => {
    try {
      const response = await axios.get(
        `${secretKey}/redesigned-final-leadData`
      );
      const bookingsData = response.data;
      setBdeRedesignedData(response.data);

      const getBDEnames = new Set();
      bookingsData.forEach((obj) => {
        // Check if the bdeName is already in the Set

        if (!getBDEnames.has(obj.bdeName)) {
          // If not, add it to the Set and push the object to the final array
          getBDEnames.add(obj.bdeName);
        }
      });
      setUniqueBDE(getBDEnames);
      setRedesignedData(bookingsData);
    } catch (error) {
      console.log("Error Fetching Bookings Data", error);
    }
  };
  const uniqueBDEobjects =
    employeeData.length !== 0 &&
    uniqueBDE.size !== 0 &&
    employeeData.filter((obj) => Array.from(uniqueBDE).includes(obj.ename));

  //console.log("Employee Data:- ", uniqueBDEobjects);
  useEffect(() => {
    // Call the fetchData function when the component mounts

    fetchCompanies();
    fetchRedesignedBookings();
    debouncedFetchCompanyData();
    debouncedFetchEmployeeInfo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [startDateAnother, endDateAnother]);

  useEffect(() => {
    fetchData();
  }, [showUpdates]);

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
      setShowBookingDate(false);
    }
  };
  const selectionRangeAnother = {
    startDate: startDateAnother,
    endDate: endDateAnother,
    key: "selection",
  };
  // const handleSelectAnother = (date) => {
  //   const filteredDataDateRange = bookingObject.filter((product) => {
  //     const productDate = new Date(product["bookingDate"]);
  //     return (
  //       productDate >= date.selection.startDate &&
  //       productDate <= date.selection.endDate
  //     );
  //   });
  //   setStartDateAnother(date.selection.startDate);
  //   setEndDateAnother(date.selection.endDate);
  //   setFilteredBooking(filteredDataDateRange);
  // };

  console.log(bookingObject);

  const handleSelectAnother = (values) => {
    console.log(values);
    if (values[1]) {
      const startDate = values[0].format("MM/DD/YYYY");
      const endDate = values[1].format("MM/DD/YYYY");

      const filteredDataDateRange = bookingObject.filter((product) => {
        const productDate = new Date(product["bookingDate"]).setHours(
          0,
          0,
          0,
          0
        );

        // Check if the formatted productDate is within the selected date range
        if (startDate === endDate) {
          // If both startDate and endDate are the same, filter for transactions on that day
          return new Date(productDate) === new Date(startDate);
        } else if (startDate !== endDate) {
          // If different startDate and endDate, filter within the range
          return (
            new Date(productDate) >= new Date(startDate) &&
            new Date(productDate) <= new Date(endDate)
          );
        } else {
          return false;
        }
      });
      setFilteredBooking(filteredDataDateRange);
    } else {
      return true;
    }
  };

  function formatDateFinal(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  //console.log("companyData", companyData)
  //console.log("employeeData", employeeData)

  // ----------------------------------projection-dashboard-----------------------------------------------

  const [followDataToday, setfollowDataToday] = useState([]);
  const [followDataFilter, setFollowDataFilter] = useState([])
  const [followDataNew, setFollowDataNew] = useState([])

  const fetchFollowUpData = async () => {
    try {
      const response = await fetch(`${secretKey}/projection-data`);
      const followdata = await response.json();
      setfollowData(followdata);
      setFollowDataFilter(followdata)
      setFollowDataNew(followdata)
      //console.log("followdata", followdata)
      setfollowDataToday(
        followdata
          .filter((company) => {
            // Assuming you want to filter companies with an estimated payment date for today
            const today = new Date().toISOString().split("T")[0]; // Get today's date in the format 'YYYY-MM-DD'
            return company.estPaymentDate === today;
          })
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      return { error: "Error fetching data" };
    }
  };





  const handleFilterBranchOffice = (branchName) => {
    // Filter the followdataToday array based on branchName
    if (branchName === "none") {


      setfollowDataToday(followData);
      setEmployeeData(employeeDataFilter)

    } else {
      //console.log("yahan chala")
      const filteredFollowData = followData.filter((obj) =>
        employeeData.some((empObj) => empObj.branchOffice === branchName && empObj.ename === obj.ename)
      );

      const filteredemployeedata = employeeInfo.filter(obj => obj.branchOffice === branchName)


      setfollowDataToday(filteredFollowData);
      setEmployeeData(filteredemployeedata)

      //console.log(filteredemployeedata)
    }
  };

  const [selectedValue, setSelectedValue] = useState("")

  const handleFilterForwardCaseBranchOffice = (branchName) => {
    if (branchName === "none") {
      setForwardEmployeeData(forwardEmployeeDataFilter)
      setCompanyDataTotal(companyDataFilter)
      setfollowData(followDataFilter)
      setTeamLeadsData(teamLeadsDataFilter)
    } else {
      const filteredData = forwardEmployeeDataNew.filter(obj => obj.branchOffice === branchName);

      //console.log("kuch to h" , filteredData , followDataFilter)

      const filteredFollowDataforwarded = followDataFilter.filter((obj) =>
        forwardEmployeeDataNew.some((empObj) =>
          empObj.branchOffice === branchName)
        )
      //console.log(filteredFollowData)
      const filteredCompanyData = companyDataFilter.filter(obj => (
        (obj.bdmAcceptStatus === "Pending" || obj.bdmAcceptStatus === "Accept") &&
        forwardEmployeeDataNew.some(empObj => empObj.branchOffice === branchName && empObj.ename === obj.ename)
      ));

      const filteredTeamLeadsData = teamLeadsDataFilter.filter((obj) => forwardEmployeeDataNew.some((empObj) => empObj.branchOffice === branchName && (empObj.ename === obj.ename || empObj.ename === obj.bdmName)))


      setForwardEmployeeData(filteredData)
      setCompanyDataTotal(filteredCompanyData)
      setfollowData(filteredFollowDataforwarded)
      setFollowDataNew(filteredFollowDataforwarded)
      setTeamLeadsData(filteredTeamLeadsData)
    }
  }


  
  const [searchTermForwardData, setSearchTermForwardData] = useState("")

  // Modified filterSearch function with debounce
  const filterSearchForwardData=(searchTerm)=> {
    //console.log(searchTerm)
    setSearchTermForwardData(searchTerm);

    setForwardEmployeeData(
      forwardEmployeeDataFilter.filter((company) =>
        company.ename.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

  

    setCompanyDataTotal(
      companyDataFilter.filter(
        (obj) =>
          (obj.bdmAcceptStatus === "Pending" || obj.bdmAcceptStatus === "Accept") &&
          forwardEmployeeDataNew.some((empObj) => (obj.ename === empObj.ename) &&
            empObj.ename.toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
    );

    setTeamLeadsData(
      teamLeadsDataFilter.filter((obj) =>
        forwardEmployeeDataNew.some(
          (empObj) =>
            (obj.bdmName === empObj.ename) &&
            empObj.ename.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
    // setfollowData(
    //   followDataFilter.filter(obj =>
    //     forwardEmployeeDataNew.some(empObj =>
    //       (empObj.ename === obj.ename || empObj.bdeName === obj.ename) &&
    //       (empObj.ename.toLowerCase().includes(searchTerm.toLowerCase()) || empObj.bdeName.toLowerCase().includes(searchTerm.toLowerCase()))
    //     )
    //   )
    // );

  }

  //console.log("followData", followData, followDataFilter)

  const [selectedValues, setSelectedValues] = useState([]);
  const debouncedFilterSearchForwardData = debounce(filterSearchForwardData, 100);

  const options = forwardEmployeeDataNew.map((obj) => ({ value: obj.ename, label: obj.ename }));

  //console.log("options", options);

  const handleSelectForwardedEmployeeData = (selectedEmployeeNames) => {

    const filteredForwardEmployeeData = forwardEmployeeDataFilter.filter((company) =>
      selectedEmployeeNames.includes(company.ename)
    );

    setForwardEmployeeData(filteredForwardEmployeeData);

    const filteredCompanyData = companyDataFilter.filter(
      (obj) =>
        (obj.bdmAcceptStatus === "Pending" || obj.bdmAcceptStatus === "Accept") &&
        forwardEmployeeDataNew.some((empObj) => empObj.ename === obj.ename && selectedEmployeeNames.includes(empObj.ename))
    );

    setCompanyData(filteredCompanyData);

    const filteredTeamLeadsData = teamLeadsDataFilter.filter((obj) =>
      selectedEmployeeNames.includes(obj.bdmName)
    );

    setTeamLeadsData(filteredTeamLeadsData);
  };

  // const handleSelectForwardedEmployeeData = (employeeName) => {

  //   console.log(employeeName, "employee ye h")

  //   setForwardEmployeeData(
  //     forwardEmployeeDataFilter.filter((company) =>
  //       company.ename === employeeName)
  //   )

  //   setCompanyData(
  //     companyDataFilter.filter(
  //       (obj) =>
  //         (obj.bdmAcceptStatus === "Pending" || obj.bdmAcceptStatus === "Accept") &&
  //         forwardEmployeeDataNew.some((empObj) => (obj.ename === empObj.ename) &&
  //           (empObj.ename === employeeName)
  //         )
  //     )
  //   );

  //   setTeamLeadsData(
  //     teamLeadsDataFilter.filter((obj) =>
  //       forwardEmployeeDataNew.some(
  //         (empObj) =>
  //           (obj.bdmName === empObj.ename) &&
  //           empObj.ename === employeeName)
  //     )
  //   )
  // }





  //console.log(followDataToday)

  useEffect(() => {
    fetchFollowUpData();
  }, []);

  const uniqueEnames = [...new Set(followDataToday.map((item) => item.ename))];

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
        accumulate[current.ename] = [
          accumulate[current.ename],
          current.companyName,
        ];
      }
    } else {
      accumulate[current.ename] = current.companyName;
    }
    return accumulate;
  }, []);

  //console.log(companiesByEname)

  const totalcompaniesByEname = followData.reduce((accumulate, current) => {
    accumulate = accumulate.concat(current.companyName);
    return accumulate;
  }, []);

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
          offeredPaymentSum: offeredPrize,
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
        accumulate[current.ename] = [
          accumulate[current.ename],
          current.estPaymentDate,
        ];
      }
    } else {
      accumulate[current.ename] = current.estPaymentDate;
    }
    return accumulate;
  }, []);

  //console.log(lastFollowDate)

  //console.log(followData)

  //console.log(projectionEname)

  const [projectedDataToday, setprojectedDataToday] = useState([]);

  const functionOpenProjectionTable = (ename) => {
    setProjectionEname(ename);
    //console.log("Ename:", ename)
    setopenProjectionTable(true);
    const projectedData = followData.filter((obj) => obj.ename === ename);
    console.log("projected", projectedData);
    const projectedDataDateRange = followDataToday.filter(
      (obj) => obj.ename === ename
    );
    const projectedDataToday = followDataToday.filter(
      (obj) => obj.ename === ename
    );
    //console.log(projectedDataDateRange)
    setProjectedEmployee(projectedData);
    setProjectedDataDateRange(projectedDataDateRange);
    setprojectedDataToday(projectedDataToday);
  };
  //console.log(projectedEmployee)
  // console.log("Date Range", projectedDataDateRange)

  console.log(projectedDataToday);
  const closeProjectionTable = () => {
    setopenProjectionTable(false);
  };

  const [completeProjectionTable, setCompleteProjectionTable] = useState(false);

  const functionCompleteProjectionTable = () => {
    setCompleteProjectionTable(true);
  };

  const closeCompleteProjectionTable = () => {
    setCompleteProjectionTable(false);
  };

  function calculateSumPopup(data) {
    const initialValue = {
      totalPaymentSumPopup: 0,
      offeredPaymentSumPopup: 0,
      offeredServicesPopup: [],
    };

    const sum = data.reduce((accumulator, currentValue) => {
      // Concatenate offeredServices from each object into a single array
      const offeredServicesPopup = accumulator.offeredServicesPopup.concat(
        currentValue.offeredServices
      );

      return {
        totalPaymentSumPopup:
          accumulator.totalPaymentSumPopup + currentValue.totalPayment,
        offeredPaymentSumPopup:
          accumulator.offeredPaymentSumPopup + currentValue.offeredPrize,
        offeredServicesPopup: offeredServicesPopup,
      };
    }, initialValue);

    // // Remove duplicate services from the array
    // sum.offeredServices = Array.from(new Set(sum.offeredServices));

    return sum;
  }

  //console.log("projecteddata" , projectedDataToday)

  // Calculate the sums
  const { totalPaymentSumPopup, offeredPaymentSumPopup, offeredServicesPopup } =
    calculateSumPopup(projectedEmployee);
  //console.log(totalPaymentSumPopup)
  //console.log(offeredPaymentSumPopup)
  // console.log(offeredServicesPopup)

  // ---------------------------------------------history of projection data--------------------------------------------

  const [viewHistoryCompanyName, setviewHistoryCompanyName] = useState("");
  const [historyDataCompany, sethistoryDataCompany] = useState([]);

  const handleViewHistoryProjection = (companyName) => {
    const companyHistoryName = companyName;

    setviewHistoryCompanyName(companyHistoryName);
    setopenProjectionTable(false);
    const companyDataProjection = projectedDataToday.find(
      (obj) => obj.companyName === companyHistoryName
    );
    // Check if the company data is found
    if (companyDataProjection) {
      // Check if the company data has a history field
      if (companyDataProjection.history) {
        // Access the history data
        const historyData = companyDataProjection.history;
        //console.log("History Data for", companyHistoryName, ":", historyData);
        sethistoryDataCompany(historyData);
        // Now you can use the historyData array as needed
      } else {
        console.log("No history found for", viewHistoryCompanyName);
      }
    } else {
      console.log(
        "Company",
        viewHistoryCompanyName,
        "not found in projectedDataToday"
      );
    }
    setopenProjectionHistoryTable(true);
    // Extract history from each object in followData
  };


  const latestDataForCompany = projectedDataToday.filter(
    (obj) => obj.companyName === viewHistoryCompanyName
  );

  //const latestDataForCompanyDateRange = projectedDataDateRange.filter(obj => obj.companyName === viewHistoryCompanyName);

  console.log("HistoryCompanyName", viewHistoryCompanyName);

  const closeProjectionHistoryTable = () => {
    setopenProjectionHistoryTable(false);
    setopenProjectionTable(true);
  };

  console.log(historyDataCompany);

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
    if (
      dateRangePickerRef.current &&
      !dateRangePickerRef.current.contains(event.target)
    ) {
      setShowBookingDate(false);
    }
  };

  // Add event listener when the component mounts
  useEffect(() => {
    const totalBookingElement = document.getElementById("totalbooking");

    if (totalBookingElement) {
      totalBookingElement.addEventListener("click", handleClickOutside);

      return () => {
        totalBookingElement.removeEventListener("click", handleClickOutside);
      };
    }
  }, []);

  const handleClickOutsideProjection = (event) => {
    if (
      dateRangePickerProhectionRef.current &&
      !dateRangePickerProhectionRef.current.contains(event.target)
    ) {
      setDateRangeDisplay(false);
    }
  };

  // Add event listener when the component mounts
  useEffect(() => {
    const totalBookingElement = document.getElementById(
      "projectionsummaryadmin"
    );
    if (totalBookingElement) {
      totalBookingElement.addEventListener(
        "click",
        handleClickOutsideProjection
      );
      // Remove event listener when the component unmounts
      return () => {
        totalBookingElement.removeEventListener(
          "click",
          handleClickOutsideProjection
        );
      };
    }
  }, []);

  const handleCloseIconClick = () => {
    if (displayDateRange) {
      setDateRangeDisplay(false);
    }
  };

  const handleClickOutsideEmployee = (event) => {
    if (
      dateRangePickerEmployeeRef.current &&
      !dateRangePickerEmployeeRef.current.contains(event.target)
    ) {
      setDateRangeDisplayEmployee(false);
    }
  };

  // Add event listener when the component mounts
  useEffect(() => {
    const totalBookingElement = document.getElementById(
      "employeedashboardadmin"
    );

    if (totalBookingElement) {
      totalBookingElement.addEventListener("click", handleClickOutsideEmployee);
      // Remove event listener when the component unmounts
      return () => {
        totalBookingElement.removeEventListener(
          "click",
          handleClickOutsideEmployee
        );
      };
    }
  }, []);

  const [selectedDateRange, setSelectedDateRange] = useState([]);

  //console.log(selectedDateRange)

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
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
    const filteredDataDateRange = followData.filter((product) => {
      const productDate = new Date(product["estPaymentDate"]);

      // Check if the productDate is within the selected date range
      return productDate >= startDate && productDate <= endDate;
    });

    // Set the startDate, endDate, and filteredDataDateRange states
    setStartDate(startDate);
    setEndDate(endDate);
    setFilteredDataDateRange(filteredDataDateRange);
  };

  useEffect(() => {
    // Filter followData based on the selected date range
    const filteredDataDateRange = followData.filter((product) => {
      const productDate = new Date(product["estPaymentDate"]);

      // Convert productDate to the sameformat as startDate and endDate
      const formattedProductDate = dayjs(productDate).startOf("day");
      const formattedStartDate = startDate
        ? dayjs(startDate).startOf("day")
        : null;
      const formattedEndDate = endDate ? dayjs(endDate).endOf("day") : null;

      // Check if the formatted productDate is within the selected date range
      if (
        formattedStartDate &&
        formattedEndDate &&
        formattedStartDate.isSame(formattedEndDate)
      ) {
        // If both startDate and endDate are the same, filter for transactions on that day
        return formattedProductDate.isSame(formattedStartDate);
      } else if (formattedStartDate && formattedEndDate) {
        // If different startDate and endDate, filter within the range
        return (
          formattedProductDate >= formattedStartDate &&
          formattedProductDate <= formattedEndDate
        );
      } else {
        // If either startDate or endDate is null, return false
        return false;
      }
    });

    setfollowDataToday(filteredDataDateRange);
  }, [startDate, endDate]);

  useEffect(() => {
    // Filter followData based on the selected date range
    const filteredDataDateRange = followData.filter((product) => {
      const productDate = new Date(product["estPaymentDate"]);

      // Convert productDate to the sameformat as startDate and endDate
      const formattedProductDate = dayjs(productDate).startOf("day");
      const formattedStartDate = startDate
        ? dayjs(startDate).startOf("day")
        : null;
      const formattedEndDate = endDate ? dayjs(endDate).endOf("day") : null;

      // Check if the formatted productDate is within the selected date range
      if (
        formattedStartDate &&
        formattedEndDate &&
        formattedStartDate.isSame(formattedEndDate)
      ) {
        // If both startDate and endDate are the same, filter for transactions on that day
        return formattedProductDate.isSame(formattedStartDate);
      } else if (formattedStartDate && formattedEndDate) {
        // If different startDate and endDate, filter within the range
        return (
          formattedProductDate >= formattedStartDate &&
          formattedProductDate <= formattedEndDate
        );
      } else {
        // If either startDate or endDate is null, return false
        return false;
      }
    });

    setfollowDataToday(filteredDataDateRange);
  }, [startDate, endDate]);

  // --------------------------------------daterangepickerfor employeedatareport----------------------------------

  const [selectedDateRangeEmployee, setSelectedDateRangeEmployee] = useState(
    []
  );

  const handleSelectEmployee = (values) => {
    console.log(values);
    if (values[1]) {
      const startDate = values[0].format("MM/DD/YYYY");
      const endDate = values[1].format("MM/DD/YYYY");

      const filteredDataDateRange = companyDataFilter.filter((product) => {
        const productDate = new Date(product.AssignDate).setHours(0, 0, 0, 0);

        // Check if the formatted productDate is within the selected date range
        if (startDate === endDate) {
          // If both startDate and endDate are the same, filter for transactions on that day
          return new Date(productDate) === new Date(startDate);
        } else if (startDate !== endDate) {
          // If different startDate and endDate, filter within the range
          return (
            new Date(productDate) >= new Date(startDate) &&
            new Date(productDate) <= new Date(endDate)
          );
        } else {
          return false;
        }
      });
      setCompanyData(filteredDataDateRange);
    } else {
      return true;
    }
  };

  // useEffect(() => {

  //   const filteredDataDateRange = companyDataFilter.filter(product => {
  //     const productDate = new Date(product["AssignDate"]);
  //     const newproductDate = formatDateNew(productDate)
  //     // Convert productDate to the sameformat as startDate and endDate
  //     const formattedProductDate = dayjs(newproductDate).startOf('day');
  //     const formattedStartDate = startDateEmployee ? dayjs(startDateEmployee).startOf('day') : null;
  //     const formattedEndDate = endDateEmployee ? dayjs(endDateEmployee).endOf('day') : null;

  //     console.log(formattedProductDate)
  //     console.log(formattedStartDate)
  //     console.log(formattedEndDate)

  //     // Check if the formatted productDate is within the selected date range
  //     if (formattedStartDate && formattedEndDate && formattedStartDate.isSame(formattedEndDate)) {
  //       // If both startDate and endDate are the same, filter for transactions on that day
  //       return formattedProductDate.isSame(formattedStartDate);
  //     } else if (formattedStartDate && formattedEndDate) {
  //       // If different startDate and endDate, filter within the range
  //       return formattedProductDate >= formattedStartDate && formattedProductDate <= formattedEndDate;
  //     } else {
  //       // If either startDate or endDate is null, return false
  //       return false;
  //     }
  //   });

  //   console.log("Filtered Data:", filteredDataDateRange);
  //   setCompanyData(filteredDataDateRange);
  //   setcompanyDataFilter(filteredDataDateRange);
  // }, [startDateEmployee, endDateEmployee]);

  function formatDateNew(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear();
    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
  }

  //console.log("companyData", companyData)

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

  const totalservicesByEnameDateRange = filteredDataDateRange.reduce(
    (acc, curr) => {
      // Concatenate all offeredServices into a single array
      acc = acc.concat(curr.offeredServices);
      return acc;
    },
    []
  );

  const totalservicesByEnameToday = followDataToday.reduce((acc, curr) => {
    // Concatenate all offeredServices into a single array
    acc = acc.concat(curr.offeredServices);
    return acc;
  }, []);

  //onsole.log(totalservicesByEnameDateRange)

  const companiesByEnameDateRange = filteredDataDateRange.reduce(
    (accumulate, current) => {
      if (accumulate[current.ename]) {
        if (Array.isArray(accumulate[current.ename])) {
          accumulate[current.ename].push(current.companyName);
        } else {
          accumulate[current.ename] = [
            accumulate[current.ename],
            current.companyName,
          ];
        }
      } else {
        accumulate[current.ename] = [current.companyName];
      }
      return accumulate;
    },
    []
  );

  const companiesByEnameToday = followDataToday.reduce(
    (accumulate, current) => {
      if (accumulate[current.ename]) {
        if (Array.isArray(accumulate[current.ename])) {
          accumulate[current.ename].push(current.companyName);
        } else {
          accumulate[current.ename] = [
            accumulate[current.ename],
            current.companyName,
          ];
        }
      } else {
        accumulate[current.ename] = [current.companyName];
      }
      return accumulate;
    },
    []
  );

  //console.log(companiesByEnameDateRange)

  const totalcompaniesByEnameDateRange = filteredDataDateRange.reduce(
    (accumulate, current) => {
      accumulate = accumulate.concat(current.companyName);
      return accumulate;
    },
    []
  );

  const totalcompaniesByEnameToday = followDataToday.reduce(
    (accumulate, current) => {
      accumulate = accumulate.concat(current.companyName);
      return accumulate;
    },
    []
  );

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
          offeredPaymentSum: offeredPrize,
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
          offeredPaymentSum: offeredPrize,
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
  Object.values(sumsDateRange).forEach(
    ({ totalPaymentSum, offeredPaymentSum }) => {
      totalTotalPaymentSumDateRange += totalPaymentSum;
      totalOfferedPaymentSumDateRange += offeredPaymentSum;
    }
  );

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
    const initialValue = {
      totalPaymentSumPopupDateRange: 0,
      offeredPaymentSumPopupDateRange: 0,
      offeredServicesPopupDateRange: [],
    };

    const sum = data.reduce((accumulator, currentValue) => {
      // Concatenate offeredServices from each object into a single array
      const offeredServicesPopupDateRange =
        accumulator.offeredServicesPopupDateRange.concat(
          currentValue.offeredServices
        );

      return {
        totalPaymentSumPopupDateRange:
          accumulator.totalPaymentSumPopupDateRange + currentValue.totalPayment,
        offeredPaymentSumPopupDateRange:
          accumulator.offeredPaymentSumPopupDateRange +
          currentValue.offeredPrize,
        offeredServicesPopupDateRange: offeredServicesPopupDateRange,
      };
    }, initialValue);

    // // Remove duplicate services from the array
    // sum.offeredServices = Array.from(new Set(sum.offeredServices));

    return sum;
  }

  // Calculate the sums
  const {
    totalPaymentSumPopupDateRange,
    offeredPaymentSumPopupDateRange,
    offeredServicesPopupDateRange,
  } = calculateSumPopupDateRange(projectedDataDateRange);
  // console.log(totalPaymentSumPopupDateRange)
  // console.log(offeredPaymentSumPopupDateRange)
  // console.log(offeredServicesPopupDateRange)

  function calculateSumPopupToday(data) {
    const initialValue = {
      totalPaymentSumPopupToday: 0,
      offeredPaymentSumPopupToday: 0,
      offeredServicesPopupToday: [],
    };

    const sum = data.reduce((accumulator, currentValue) => {
      // Concatenate offeredServices from each object into a single array
      const offeredServicesPopupToday =
        accumulator.offeredServicesPopupToday.concat(
          currentValue.offeredServices
        );

      return {
        totalPaymentSumPopupToday:
          accumulator.totalPaymentSumPopupToday + currentValue.totalPayment,
        offeredPaymentSumPopupToday:
          accumulator.offeredPaymentSumPopupToday + currentValue.offeredPrize,
        offeredServicesPopupToday: offeredServicesPopupToday,
      };
    }, initialValue);

    // // Remove duplicate services from the array
    // sum.offeredServices = Array.from(new Set(sum.offeredServices));

    return sum;
  }

  // Calculate the sums
  const {
    totalPaymentSumPopupToday,
    offeredPaymentSumPopupToday,
    offeredServicesPopupToday,
  } = calculateSumPopupToday(projectedDataToday);

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
    setOpenFilters((prevState) => {
      const updatedState = {};
      for (const key in prevState) {
        updatedState[key] = key === header ? !prevState[header] : false;
      }
      return updatedState;
    });
  };
  //-------------------------- Sort filteres for different status  -------------------------------------------------------------------------
  const handleSortUntouched = (sortBy1) => {
    setSortType((prevData) => ({
      ...prevData,
      untouched:
        prevData.untouched === "ascending"
          ? "descending"
          : prevData.untouched === "descending"
            ? "none"
            : "ascending",
    }));

    switch (sortBy1) {
      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {};
        companyData.forEach((company) => {
          if (company.Status === "Untouched") {
            untouchedCountAscending[company.ename] =
              (untouchedCountAscending[company.ename] || 0) + 1;
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
          if (company.Status === "Untouched") {
            untouchedCount[company.ename] =
              (untouchedCount[company.ename] || 0) + 1;
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
    setSortType((prevData) => ({
      ...prevData,
      notPickedUp:
        prevData.notPickedUp === "ascending"
          ? "descending"
          : prevData.notPickedUp === "descending"
            ? "none"
            : "ascending",
    }));

    switch (sortBy1) {
      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {};
        companyData.forEach((company) => {
          if (
            company.Status === "Not Picked Up"
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
            untouchedCountAscending[company.ename] =
              (untouchedCountAscending[company.ename] || 0) + 1;
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
          if (company.Status === "Not Picked Up") {
            untouchedCount[company.ename] =
              (untouchedCount[company.ename] || 0) + 1;
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
    setSortType((prevData) => ({
      ...prevData,
      busy:
        prevData.busy === "ascending"
          ? "descending"
          : prevData.busy === "descending"
            ? "none"
            : "ascending",
    }));
    switch (sortBy1) {
      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {};
        companyData.forEach((company) => {
          if (company.Status === "Busy") {
            untouchedCountAscending[company.ename] =
              (untouchedCountAscending[company.ename] || 0) + 1;
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
          if (company.Status === "Busy") {
            untouchedCount[company.ename] =
              (untouchedCount[company.ename] || 0) + 1;
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
    setSortType((prevData) => ({
      ...prevData,
      interested:
        prevData.interested === "ascending"
          ? "descending"
          : prevData.interested === "descending"
            ? "none"
            : "ascending",
    }));
    switch (sortBy1) {
      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {};
        companyData.forEach((company) => {
          if (
            company.Status === "Interested"
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
            untouchedCountAscending[company.ename] =
              (untouchedCountAscending[company.ename] || 0) + 1;
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
          if (company.Status === "Interested") {
            untouchedCount[company.ename] =
              (untouchedCount[company.ename] || 0) + 1;
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
    setSortType((prevData) => ({
      ...prevData,
      matured:
        prevData.matured === "ascending"
          ? "descending"
          : prevData.matured === "descending"
            ? "none"
            : "ascending",
    }));
    switch (sortBy1) {
      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {};
        companyData.forEach((company) => {
          if (
            company.Status === "Matured"
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
            untouchedCountAscending[company.ename] =
              (untouchedCountAscending[company.ename] || 0) + 1;
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
          if (company.Status === "Matured") {
            untouchedCount[company.ename] =
              (untouchedCount[company.ename] || 0) + 1;
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
    setSortType((prevData) => ({
      ...prevData,
      notInterested:
        prevData.notInterested === "ascending"
          ? "descending"
          : prevData.notInterested === "descending"
            ? "none"
            : "ascending",
    }));
    switch (sortBy1) {
      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {};
        companyData.forEach((company) => {
          if (
            company.Status === "Not Interested"
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
            untouchedCountAscending[company.ename] =
              (untouchedCountAscending[company.ename] || 0) + 1;
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
          if (company.Status === "Not Interested") {
            untouchedCount[company.ename] =
              (untouchedCount[company.ename] || 0) + 1;
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
    setSortType((prevData) => ({
      ...prevData,
      junk:
        prevData.junk === "ascending"
          ? "descending"
          : prevData.junk === "descending"
            ? "none"
            : "ascending",
    }));
    switch (sortBy1) {
      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {};
        companyData.forEach((company) => {
          if (company.Status === "Junk") {
            untouchedCountAscending[company.ename] =
              (untouchedCountAscending[company.ename] || 0) + 1;
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
          if (company.Status === "Junk") {
            untouchedCount[company.ename] =
              (untouchedCount[company.ename] || 0) + 1;
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
    setSortType((prevData) => ({
      ...prevData,
      followUp:
        prevData.followUp === "ascending"
          ? "descending"
          : prevData.followUp === "descending"
            ? "none"
            : "ascending",
    }));
    switch (sortBy1) {
      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {};
        companyData.forEach((company) => {
          if (
            company.Status === "Follow Up"
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
            untouchedCountAscending[company.ename] =
              (untouchedCountAscending[company.ename] || 0) + 1;
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
          if (company.Status === "FollowUp") {
            untouchedCount[company.ename] =
              (untouchedCount[company.ename] || 0) + 1;
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
    setSortType((prevData) => ({
      ...prevData,
      lastLead:
        prevData.lastLead === "ascending"
          ? "descending"
          : prevData.lastLead === "descending"
            ? "none"
            : "ascending",
    }));
    switch (sortBy1) {
      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {};
        companyData.forEach((company) => {
          untouchedCountAscending[company.ename] =
            (untouchedCountAscending[company.ename] || 0) + 1;
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
          untouchedCount[company.ename] =
            (untouchedCount[company.ename] || 0) + 1;
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
    setSortType((prevData) => ({
      ...prevData,
      totalLeads:
        prevData.totalLeads === "ascending" ? "descending" : "ascending",
    }));
    switch (sortBy1) {
      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {};
        companyData.forEach((company) => {
          untouchedCountAscending[company.ename] =
            (untouchedCountAscending[company.ename] || 0) + 1;
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
          untouchedCount[company.ename] =
            (untouchedCount[company.ename] || 0) + 1;
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
      setDateRangeDisplayEmployee(false);
    }
  };
  const selectionRangeEmployee = {
    startDate: startDateEmployee,
    endDate: endDateEmployee,
    key: "selection",
  };

  const [companyDataFilter, setcompanyDataFilter] = useState([]);

  // const handleSelectEmployee = (date) => {

  //   const filteredDataDateRange = companyDataFilter.filter(product => {
  //     const productDate = new Date(product["AssignDate"]);
  //     if (formatDate(date.selection.startDate) === formatDate(date.selection.endDate)) {
  //       //console.log(formatDate(date.selection.startDate))
  //       //console.log(formatDate(date.selection.endDate))
  //       //console.log(formatDate(productDate))
  //       return formatDate(productDate) === formatDate(date.selection.startDate);
  //     } else {
  //       return (
  //         productDate >= date.selection.startDate &&
  //         productDate <= date.selection.endDate
  //       );
  //     }
  //   });
  //   setStartDateEmployee(date.selection.startDate);
  //   setEndDateEmployee(date.selection.endDate);
  //   setCompanyData(filteredDataDateRange);
  //   setcompanyDataFilter(filteredDataDateRange)
  //   //console.log(filteredDataDateRange)
  // };

  // ------------------------------------------search bde name---------------------------------------------------

  const handleCloseSearch = () => {
    if (searchOption) {
      setSearchOption(false);
    }
  };

  const debouncedFilterSearch = debounce(filterSearch, 100);

  // Modified filterSearch function with debounce
  function filterSearch(searchTerm) {
    setSearchTerm(searchTerm);
    setEmployeeData(
      employeeDataFilter.filter((company) =>
        company.ename.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }



  //  ---------------------------------------------status info component-------------------------------------------------

  const numberFormatOptions = {
    style: "currency",
    currency: "INR", // Use the currency code for Indian Rupee (INR)
    minimumFractionDigits: 0, // Minimum number of fraction digits (adjust as needed)
    maximumFractionDigits: 2, // Maximum number of fraction digits (adjust as needed)
  };
  const shortcutsItems = [
    {
      label: "This Week",
      getValue: () => {
        const today = dayjs();
        return [today.startOf("week"), today.endOf("week")];
      },
    },
    {
      label: "Last Week",
      getValue: () => {
        const today = dayjs();
        const prevWeek = today.subtract(7, "day");
        return [prevWeek.startOf("week"), prevWeek.endOf("week")];
      },
    },
    {
      label: "Last 7 Days",
      getValue: () => {
        const today = dayjs();
        return [today.subtract(7, "day"), today];
      },
    },
    {
      label: "Current Month",
      getValue: () => {
        const today = dayjs();
        return [today.startOf("month"), today.endOf("month")];
      },
    },
    {
      label: "Next Month",
      getValue: () => {
        const today = dayjs();
        const startOfNextMonth = today.endOf("month").add(1, "day");
        return [startOfNextMonth, startOfNextMonth.endOf("month")];
      },
    },
    { label: "Reset", getValue: () => [null, null] },
  ];

  // -------------------------------------sorting projection summary-------------------------------------------
  const [incoFilterNew, setIncoFilterNew] = useState("");
  const [sortTypeProjection, setSortTypeProjection] = useState({
    totalCompanies: "ascending",
  });
  const [sortTypeServices, setSortTypeServices] = useState({
    offeredServices: "ascending",
  });

  const [sortTypePrice, setSortTypePrice] = useState({
    offeredPrice: "ascending",
  });

  const [sortTypeExpectedPayment, setSortTypeExpectedPayment] = useState({
    expectedPayment: "ascending",
  });

  const handleSortTotalCompanies = (newSortType) => {
    setSortTypeProjection(newSortType);
  };

  const handleSortOfferedServices = (newSortType) => {
    setSortTypeServices(newSortType);
  };

  const handleSortOffredPrize = (newSortType) => {
    setSortTypePrice(newSortType);
  };

  const handleSortExpectedPayment = (newSortType) => {
    console.log(newSortType);
    setSortTypeExpectedPayment(newSortType);
  };
  // const getTotalOfferedPrice = (ename) => {
  //   return followDataToday.reduce((totalOfferedPrice, partObj) => {
  //     if (partObj.ename === ename) {
  //       totalOfferedPrice += partObj.offeredPrize;
  //     }
  //     return totalOfferedPrice;
  //   }, 0);
  // };

  // // Function to get expected amount for a given ename
  // const getExpectedAmount = (ename) => {
  //   return followDataToday.reduce((totalPaymentSum, partObj) => {
  //     if (partObj.ename === ename) {
  //       totalPaymentSum += partObj.totalPayment;
  //     }
  //     return totalPaymentSum;
  //   }, 0);
  // };

  const sortedData = uniqueEnames.slice().sort((a, b) => {
    // Sorting logic for total companies
    if (sortTypeProjection === "ascending") {
      return (
        followDataToday.filter((partObj) => partObj.ename === a).length -
        followDataToday.filter((partObj) => partObj.ename === b).length
      );
    } else if (sortTypeProjection === "descending") {
      return (
        followDataToday.filter((partObj) => partObj.ename === b).length -
        followDataToday.filter((partObj) => partObj.ename === a).length
      );
    }

    // Sorting logic for offered services
    if (sortTypeServices === "ascending") {
      return (
        followDataToday.reduce((totalServicesA, partObj) => {
          if (partObj.ename === a) {
            totalServicesA += partObj.offeredServices.length;
          }
          return totalServicesA;
        }, 0) -
        followDataToday.reduce((totalServicesB, partObj) => {
          if (partObj.ename === b) {
            totalServicesB += partObj.offeredServices.length;
          }
          return totalServicesB;
        }, 0)
      );
    } else if (sortTypeServices === "descending") {
      return (
        followDataToday.reduce((totalServicesB, partObj) => {
          if (partObj.ename === b) {
            totalServicesB += partObj.offeredServices.length;
          }
          return totalServicesB;
        }, 0) -
        followDataToday.reduce((totalServicesA, partObj) => {
          if (partObj.ename === a) {
            totalServicesA += partObj.offeredServices.length;
          }
          return totalServicesA;
        }, 0)
      );
    }
    if (sortTypePrice === "ascending") {
      return (
        followDataToday.reduce((totalOfferedPriceA, partObj) => {
          if (partObj.ename === a) {
            totalOfferedPriceA += partObj.offeredPrize;
          }
          return totalOfferedPriceA;
        }, 0) -
        followDataToday.reduce((totalOfferedPriceB, partObj) => {
          if (partObj.ename === b) {
            totalOfferedPriceB += partObj.offeredPrize;
          }
          return totalOfferedPriceB;
        }, 0)
      );
    } else if (sortTypePrice === "descending") {
      return (
        followDataToday.reduce((totalOfferedPriceB, partObj) => {
          if (partObj.ename === b) {
            totalOfferedPriceB += partObj.offeredPrize;
          }
          return totalOfferedPriceB;
        }, 0) -
        followDataToday.reduce((totalOfferedPriceA, partObj) => {
          if (partObj.ename === a) {
            totalOfferedPriceA += partObj.offeredPrize;
          }
          return totalOfferedPriceA;
        }, 0)
      );
    }
    // Sorting logic for expected amount
    if (sortTypeExpectedPayment === "ascending") {
      return (
        followDataToday.reduce((totalExpectedPaymentA, partObj) => {
          if (partObj.ename === a) {
            totalExpectedPaymentA += partObj.totalPayment;
          }
          return totalExpectedPaymentA;
        }, 0) -
        followDataToday.reduce((totalExpectedPaymentB, partObj) => {
          if (partObj.ename === b) {
            totalExpectedPaymentB += partObj.totalPayment;
          }
          return totalExpectedPaymentB;
        }, 0)
      );
    } else if (sortTypeExpectedPayment === "descending") {
      return (
        followDataToday.reduce((totalExpectedPaymentB, partObj) => {
          if (partObj.ename === b) {
            totalExpectedPaymentB += partObj.totalPayment;
          }
          return totalExpectedPaymentB;
        }, 0) -
        followDataToday.reduce((totalExpectedPaymentA, partObj) => {
          if (partObj.ename === a) {
            totalExpectedPaymentA += partObj.totalPayment;
          }
          return totalExpectedPaymentA;
        }, 0)
      );
    }

    // If sortType is "none", return original order
    return 0;
  });

  //console.log("followDataToday" , followDataToday)

  const exportData = async () => {
    const sendingData = followData.filter((company) => {
      // Assuming you want to filter companies with an estimated payment date for today
      const today = new Date().toISOString().split("T")[0]; // Get today's date in the format 'YYYY-MM-DD'
      return company.estPaymentDate === today;
    });
    // console.log("kuchbhi" , sendingData)
    try {
      const response = await axios.post(
        `${secretKey}/followdataexport/`,
        sendingData
      );
      //console.log("response",response.data)
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "FollowDataToday.csv");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

  //console.log(followDataToday)

  // ------------------------------------------------------- Redesigned Total Bookings Functions ------------------------------------------------------------------
  let totalMaturedCount = 0;
  let totalTargetAmount = 0;
  let totalAchievedAmount = 0;
  const currentYear = new Date().getFullYear();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentMonth = monthNames[new Date().getMonth()];

  const functionCalculateMatured = (bdeName) => {
    let maturedCount = 0;
    const filteredRedesignedData = redesignedData.filter(
      (obj) => obj.bdeName === bdeName || (obj.bdmName === bdeName && obj.bdmType === "Close-by") || (obj.moreBookings.length !== 0 && obj.moreBookings.some(mainObj => mainObj.bdmName === bdeName && mainObj.bdmType === "Close-by"))
    );

    const moreFilteredData = filteredRedesignedData.filter(obj => monthNames[new Date(obj.bookingDate).getMonth()] === currentMonth)
    moreFilteredData.forEach((obj) => {
      if (obj.moreBookings.length === 0) {
        if (obj.bdeName !== obj.bdmName && obj.bdmType === "Close-by") {
          maturedCount += 0.5;
        } else {
          maturedCount += 1;
        }
      } else {
        if (obj.bdeName === bdeName || obj.bdmName === bdeName) {
          if (obj.bdeName !== obj.bdmName && obj.bdmType === "Close-by") {
            maturedCount += 0.5;
          } else {
            maturedCount += 1;
          }
        }
        obj.moreBookings.forEach((booking) => {
          if (booking.bdeName === bdeName || booking.bdmName === bdeName) {
            if (
              booking.bdeName !== booking.bdmName &&
              booking.bdmType === "Close-by"
            ) {
              maturedCount += 0.5;
            } else if (booking.bdeName === bdeName) {
              maturedCount += 1;
            }
          }
        });
      }
    });
    totalMaturedCount = totalMaturedCount + maturedCount;
    return maturedCount;
  };


  const functionCalculateAchievedAmount = (bdeName) => {
    let achievedAmount = 0;
    const filteredRedesignedData = redesignedData.filter(
      (obj) => obj.bdeName === bdeName || (obj.bdmName === bdeName && obj.bdmType === "Close-by") || (obj.moreBookings.length !== 0 && obj.moreBookings.some(mainObj => mainObj.bdmName === bdeName && mainObj.bdmType === "Close-by"))
    );

    const moreFilteredData = filteredRedesignedData.filter(obj => monthNames[new Date(obj.bookingDate).getMonth()] === currentMonth)

    moreFilteredData.forEach((obj) => {
      if (obj.moreBookings.length === 0) {
        if (obj.bdeName !== obj.bdmName && obj.bdmType === "Close-by") {
          achievedAmount += Math.round(obj.generatedReceivedAmount / 2);
        } else {
          achievedAmount += Math.round(obj.generatedReceivedAmount);
        }
      } else {
        if (obj.bdeName === bdeName || obj.bdmName === bdeName) {
          if (obj.bdeName !== obj.bdmName && obj.bdmType === "Close-by") {
            achievedAmount += Math.round(obj.generatedReceivedAmount / 2);
          } else {
            achievedAmount += Math.round(obj.generatedReceivedAmount);
          }
        }
        obj.moreBookings.forEach((booking) => {
          if (booking.bdeName === bdeName || booking.bdmName === bdeName) {
            if (
              booking.bdeName !== booking.bdmName &&
              booking.bdmType === "Close-by"
            ) {
              achievedAmount += Math.round(booking.generatedReceivedAmount / 2);
            } else {
              achievedAmount += Math.round(booking.generatedReceivedAmount);
            }
          }
        });
      }
    });
    totalAchievedAmount =
      Math.round(totalAchievedAmount) + Math.round(achievedAmount);
    return achievedAmount;
  };



  const functionGetAmount = (object) => {
    if (object.targetDetails.length !== 0) {
      const foundObject = object.targetDetails.find(
        (item) =>
          Math.round(item.year) === currentYear && item.month === currentMonth
      );
      totalTargetAmount =
        foundObject &&
        Math.round(totalTargetAmount) + Math.round(foundObject.amount);
      console.log(
        "This is total Amount",
        foundObject && foundObject.amount,
        totalTargetAmount
      );
      return foundObject ? foundObject.amount : 0;
    } else {
      return 0;
    }
  };

  function functionGetLastBookingDate(bdeName) {
    // Filter objects based on bdeName

    const filteredRedesignedData = redesignedData.filter(
      (obj) => (obj.bdeName === bdeName || (obj.bdmName === bdeName && obj.bdmType === "Close-by")) && monthNames[new Date(obj.bookingDate).getMonth()] === currentMonth
    );

    // Initialize variable to store the latest booking date
    let lastBookingDate = null;

    // Iterate through filtered data
    filteredRedesignedData.forEach((obj) => {
      if (obj.moreBookings && obj.moreBookings.length > 0) {
        // If moreBookings exist, find the latest bookingDate
        const latestBookingDate = obj.moreBookings.reduce(
          (latestDate, booking) => {
            const bookingDate = new Date(booking.bookingDate);
            return bookingDate > latestDate ? bookingDate : latestDate;
          },
          new Date(0)
        ); // Initialize with minimum date

        // Update lastBookingDate if latestBookingDate is later
        if (latestBookingDate > lastBookingDate || !lastBookingDate) {
          lastBookingDate = latestBookingDate;
        }
      } else {
        // If no moreBookings, directly consider bookingDate
        const bookingDate = new Date(obj.bookingDate);
        if (bookingDate > lastBookingDate || !lastBookingDate) {
          lastBookingDate = bookingDate;
        }
      }
    });

    // Return the formatted date string or an empty string if lastBookingDate is null
    return lastBookingDate ? formatDateFinal(lastBookingDate) : "No Booking";
  }

  let generatedTotalRevenue = 0;


  function functionCalculateGeneratedTotalRevenue(ename) {
    const filterData = bdeResegnedData.filter(obj => obj.bdeName === ename || (obj.bdmName === ename && obj.bdmType === "Close-by"));
    let generatedRevenue = 0;
    const requiredObj = companyData.filter((obj) => (obj.bdmAcceptStatus === "Accept") && obj.Status === "Matured");
    requiredObj.forEach((object) => {
      const newObject = filterData.find(value => value["Company Name"] === object["Company Name"] && value.bdeName === ename);
      if (newObject) {
        generatedRevenue = generatedRevenue + newObject.generatedReceivedAmount;
      }

    });
    generatedTotalRevenue = generatedTotalRevenue + generatedRevenue;
    return generatedRevenue;
    //  const generatedRevenue =  redesignedData.reduce((total, obj) => total + obj.receivedAmount, 0);
    //  console.log("This is generated Revenue",requiredObj);

  }

  // -----------------------------------employees forwarded case functions--------------------------------------------
  let generatedTotalProjection = 0;
  const functionCaluclateTotalForwardedProjection=(isBdm , employeeName)=>{
    
    const filteredFollowDataForward = isBdm ? followData.filter((company)=>company.ename === employeeName && company.bdmName !== employeeName &&  company.caseType === "Forwarded" ) : followData.filter((company)=>company.ename === employeeName && company.caseType === "Forwarded")
    const filteredFollowDataRecieved = isBdm ? followData.filter((company)=>company.ename === employeeName && company.bdmName !== employeeName &&  company.caseType === "Recieved" ) : followData.filter((company)=>(company.ename === employeeName || company.bdeName === employeeName) && company.caseType === "Recieved")
    const totalPaymentForwarded = filteredFollowDataForward.reduce((total , obj)=> total+obj.totalPayment , 0)
    const totalPaymentRecieved = filteredFollowDataRecieved.reduce((total , obj)=> total+obj.totalPayment/2 , 0)
    const finalPayment = totalPaymentForwarded + totalPaymentRecieved

    generatedTotalProjection = generatedTotalProjection + finalPayment;

    return finalPayment.toLocaleString();

  }

  let generatedTotalProjectionRecieved = 0;

  const functionCalculateTotalProjectionRecieved=(employeeName)=>{
    const filterFollowDataRecieved = followData.filter((company)=>company.bdmName === employeeName && company.caseType === "Recieved")
    const totalPaymentRecieved = filterFollowDataRecieved.reduce((total, obj) => total + obj.totalPayment / 2, 0)
    const finalPayment = totalPaymentRecieved
    //console.log(finalPayment)
    //console.log( filterFollowDataRecieved)
    generatedTotalProjectionRecieved = generatedTotalProjectionRecieved + finalPayment

    return finalPayment.toLocaleString();
  }



  return (
    <div className="admin-dashboard">
      <Header />
      <Navbar />
      <div className="page-wrapper">
        <div className="mb-3">
          <div className="">
            {/* <div className="recent-updates-icon">
              <IconButton
                style={{ backgroundColor: "#ffb900", color: "white" }}
                onClick={changeUpdate}
              >
                <AnnouncementIcon />
              </IconButton>
            </div> */}
            <div className="page-header d-print-none" >
              <div className="container-xl">
                <div className="row">
                  <div
                    style={{ display: showUpdates ? "block" : "none" }}
                    className="col-sm-4 card recent-updates m-2"
                  >
                    <div className="card-header">
                      <h2 className="m-0">Recent Updates</h2>
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
                  <div className="employee-dashboard mt-2">
                    <div className="card todays-booking totalbooking" id="totalbooking"   >
                      <div className="card-header employeedashboard d-flex align-items-center justify-content-between p-1">
                        <div className="dashboard-title">
                          <h2 className="m-0 pl-1">
                            This Month's Bookings
                          </h2>
                        </div>
                        <div className="filter-booking d-flex align-items-center pr-1" >
                          <div className="filter-title">
                            <h2 className="m-0 mr-2">
                              {" "}
                              Filter Branch : {"  "}
                            </h2>
                          </div>
                          <div className="filter-main ml-2">
                            <select
                              className="form-select"
                              id={`branch-filter`}
                              onChange={(e) => {
                                if (e.target.value === "none") {
                                  setEmployeeData(employeeDataFilter)
                                } else {
                                  setEmployeeData(employeeDataFilter.filter(obj => obj.branchOffice === e.target.value))
                                }

                              }}
                            >
                              <option value="" disabled selected>
                                Select Branch
                              </option>

                              <option value={"Gota"}>Gota</option>
                              <option value={"Sindhu Bhawan"}>
                                Sindhu Bhawan
                              </option>
                              <option value={"none"}>None</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="row tbl-scroll">
                          <table className="table-vcenter table-nowrap admin-dash-tbl">
                            <thead className="admin-dash-tbl-thead">
                              <tr  >
                                <th>SR.NO</th>
                                <th>BDE/BDM NAME</th>
                                <th>BRANCH</th>
                                <th>MATURED CASES</th>
                                <th>TARGET AMOUNT</th>
                                <th>ACHIEVED AMOUNT</th>
                                <th>TARGET/ACHIEVED RATIO</th>
                                <th>LAST BOOKING DATE</th>
                              </tr>
                            </thead>
                            {uniqueBDEobjects ? (
                              <>
                                <tbody>
                                  {employeeData &&
                                    employeeData
                                      .filter(
                                        (item) =>
                                          item.designation ===
                                          "Sales Executive" &&
                                          item.targetDetails.length !== 0 && item.targetDetails.find(target => target.year === (currentYear).toString() && target.month === (currentMonth.toString()))
                                      )
                                      .map((obj, index) => (
                                        <>
                                          <tr>
                                            <td>{index + 1}</td>
                                            <td>
                                              {obj.ename}
                                            </td>
                                            <td>{obj.branchOffice}</td>
                                            <td>
                                              {functionCalculateMatured(
                                                obj.ename
                                              )}
                                            </td>
                                            <td>
                                              ₹{" "}
                                              {Math.round(
                                                functionGetAmount(obj)
                                              ).toLocaleString()}
                                            </td>
                                            <td>
                                              ₹{" "}
                                              {functionCalculateAchievedAmount(
                                                obj.ename
                                              ).toLocaleString()}
                                            </td>
                                            <td>
                                              {" "}
                                              {(
                                                (functionCalculateAchievedAmount(
                                                  obj.ename
                                                ) /
                                                  functionGetAmount(obj)) *
                                                100
                                              ).toFixed(2)}{" "}
                                              %
                                            </td>
                                            <td>
                                              {functionGetLastBookingDate(
                                                obj.ename
                                              )}
                                            </td>
                                          </tr>
                                        </>
                                      ))}
                                  {/* {finalFilteredData.map((obj, index) => (
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
                                  ))} */}
                                </tbody>
                                <tfoot className="admin-dash-tbl-tfoot">
                                  <tr>
                                    <td
                                      colSpan={2}

                                    >
                                      Total:
                                    </td>
                                    <td>-</td>
                                    <td>
                                      {" "}
                                      {totalMaturedCount.toLocaleString()}
                                    </td>
                                    <td>
                                      ₹{" "}
                                      {(totalTargetAmount / 2).toLocaleString()}
                                    </td>
                                    <td>
                                      ₹{" "}
                                      {(
                                        totalAchievedAmount / 2
                                      ).toLocaleString()}
                                    </td>
                                    <td>
                                      {(
                                        (totalAchievedAmount /
                                          totalTargetAmount) *
                                        100
                                      ).toFixed(2)}{" "}
                                      %
                                    </td>
                                    <td>-</td>
                                  </tr>
                                </tfoot>
                                {/* <tfoot>
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
                                </tfoot> */}
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
                  </div>

                  {/* Employee side Dashboard Analysis */}
                  <div className="employee-dashboard mt-3" id="employeedashboardadmin">
                    <div className="card">
                      <div className="card-header p-1 employeedashboard d-flex align-items-center justify-content-between">
                        <div className="dashboard-title pl-1"  >
                          <h2 className="m-0">
                            Employees Data Report
                          </h2>
                        </div>
                        <div className="d-flex align-items-center pr-1">
                          <div class="input-icon mr-1">
                            <span class="input-icon-addon">
                              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                                <path d="M21 21l-6 -6"></path>
                              </svg>
                            </span>

                            <input
                              value={searchTerm}
                              onChange={(e) =>
                                debouncedFilterSearch(e.target.value)
                              }
                              className="form-control"
                              placeholder="Enter BDE Name..."
                              type="text"
                              name="bdeName-search"
                              id="bdeName-search" />
                          </div>
                          <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            sx={{
                              padding: '0px'
                            }}
                          >
                            <DemoContainer
                              components={["SingleInputDateRangeField"]} className="ddddd"
                            >
                              <DateRangePicker className="form-control my-date-picker form-control-sm p-0"
                                onChange={(values) => {
                                  const startDateEmp = moment(values[0]).format(
                                    "DD/MM/YYYY"
                                  );
                                  const endDateEmp = moment(values[1]).format(
                                    "DD/MM/YYYY"
                                  );
                                  setSelectedDateRangeEmployee([
                                    startDateEmp,
                                    endDateEmp,
                                  ]);
                                  handleSelectEmployee(values); // Call handleSelect with the selected values
                                }}
                                slots={{ field: SingleInputDateRangeField }}
                                slotProps={{
                                  shortcuts: {
                                    items: shortcutsItems,
                                  },
                                  actionBar: { actions: [] },
                                  textField: {
                                    InputProps: { endAdornment: <Calendar /> },
                                  },
                                }}
                              //calendars={1}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="row tbl-scroll">
                          <table className="table-vcenter table-nowrap admin-dash-tbl">
                            <thead className="admin-dash-tbl-thead" >
                              <tr>
                                <th> Sr. No </th>
                                <th>BDE/BDM Name</th>
                                <th
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    let newSortType;
                                    if (sortType.untouched === "ascending") {
                                      newSortType = "descending";
                                    } else if (
                                      sortType.untouched === "descending"
                                    ) {
                                      newSortType = "none";
                                    } else {
                                      newSortType = "ascending";
                                    }
                                    handleSortUntouched(newSortType);
                                  }}
                                >
                                  <div className="d-flex align-items-center justify-content-between">
                                    <div>Untouched</div>
                                    <div className="short-arrow-div">
                                      <ArrowDropUpIcon className="up-short-arrow"
                                        style={{
                                          color:
                                            sortType.untouched === "descending"
                                              ? "black"
                                              : "#9d8f8f",
                                        }}
                                      />
                                      <ArrowDropDownIcon className="down-short-arrow"
                                        style={{
                                          color:
                                            sortType.untouched === "ascending"
                                              ? "black"
                                              : "#9d8f8f",
                                        }}
                                      />
                                    </div>
                                  </div>
                                </th>
                                <th
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    let newSortType;
                                    if (sortType.busy === "ascending") {
                                      newSortType = "descending";
                                    } else if (
                                      sortType.untouched === "descending"
                                    ) {
                                      newSortType = "none";
                                    } else {
                                      newSortType = "ascending";
                                    }
                                    handleSortbusy(newSortType);
                                  }}
                                >
                                  <div className="d-flex align-items-center justify-content-between">
                                    <div>Busy</div>
                                    <div className="short-arrow-div">
                                      <ArrowDropUpIcon className="up-short-arrow"
                                        style={{
                                          color:
                                            sortType.untouched === "descending"
                                              ? "black"
                                              : "#9d8f8f",
                                        }}
                                      />
                                      <ArrowDropDownIcon className="down-short-arrow"
                                        style={{
                                          color:
                                            sortType.untouched === "ascending"
                                              ? "black"
                                              : "#9d8f8f",
                                        }}
                                      />
                                    </div>
                                  </div>
                                </th>
                                <th
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    let newSortType;
                                    if (sortType.notPickedUp === "ascending") {
                                      newSortType = "descending";
                                    } else if (
                                      sortType.notPickedUp === "descending"
                                    ) {
                                      newSortType = "none";
                                    } else {
                                      newSortType = "ascending";
                                    }
                                    handleSortNotPickedUp(newSortType);
                                  }}
                                >
                                  <div className="d-flex align-items-center justify-content-between">
                                    <div>Not Picked Up</div>
                                    <div className="short-arrow-div">
                                      <ArrowDropUpIcon className="up-short-arrow"
                                        style={{
                                          color:
                                            sortType.untouched === "descending"
                                              ? "black"
                                              : "#9d8f8f",
                                        }}
                                      />
                                      <ArrowDropDownIcon className="down-short-arrow"
                                        style={{
                                          color:
                                            sortType.untouched === "ascending"
                                              ? "black"
                                              : "#9d8f8f",
                                        }}
                                      />
                                    </div>
                                  </div>
                                </th>
                                <th
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    let newSortType;
                                    if (sortType.junk === "ascending") {
                                      newSortType = "descending";
                                    } else if (sortType.junk === "descending") {
                                      newSortType = "none";
                                    } else {
                                      newSortType = "ascending";
                                    }
                                    handleSortJunk(newSortType);
                                  }}
                                >
                                  <div className="d-flex align-items-center justify-content-between">
                                    <div>Junk</div>
                                    <div className="short-arrow-div">
                                      <ArrowDropUpIcon className="up-short-arrow"
                                        style={{
                                          color:
                                            sortType.untouched === "descending"
                                              ? "black"
                                              : "#9d8f8f",
                                        }}
                                      />
                                      <ArrowDropDownIcon className="down-short-arrow"
                                        style={{
                                          color:
                                            sortType.untouched === "ascending"
                                              ? "black"
                                              : "#9d8f8f",
                                        }}
                                      />
                                    </div>
                                  </div>
                                </th>
                                <th
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    let newSortType;
                                    if (sortType.followUp === "ascending") {
                                      newSortType = "descending";
                                    } else if (
                                      sortType.followUp === "descending"
                                    ) {
                                      newSortType = "none";
                                    } else {
                                      newSortType = "ascending";
                                    }
                                    handleSortFollowUp(newSortType);
                                  }}
                                >
                                  <div className="d-flex align-items-center justify-content-between">
                                    <div> Follow Up</div>
                                    <div className="short-arrow-div">
                                      <ArrowDropUpIcon className="up-short-arrow"
                                        style={{
                                          color:
                                            sortType.untouched === "descending"
                                              ? "black"
                                              : "#9d8f8f",
                                        }}
                                      />
                                      <ArrowDropDownIcon className="down-short-arrow"
                                        style={{
                                          color:
                                            sortType.untouched === "ascending"
                                              ? "black"
                                              : "#9d8f8f",
                                        }}
                                      />
                                    </div>
                                  </div>
                                </th>
                                <th
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    let newSortType;
                                    if (sortType.interested === "ascending") {
                                      newSortType = "descending";
                                    } else if (
                                      sortType.interested === "descending"
                                    ) {
                                      newSortType = "none";
                                    } else {
                                      newSortType = "ascending";
                                    }
                                    handleSortInterested(newSortType);
                                  }}
                                >
                                  <div className="d-flex align-items-center justify-content-between">
                                    <div>Interested</div>
                                    <div className="short-arrow-div">
                                      <ArrowDropUpIcon className="up-short-arrow"
                                        style={{
                                          color:
                                            sortType.untouched === "descending"
                                              ? "black"
                                              : "#9d8f8f",
                                        }}
                                      />
                                      <ArrowDropDownIcon className="down-short-arrow"
                                        style={{
                                          color:
                                            sortType.untouched === "ascending"
                                              ? "black"
                                              : "#9d8f8f",
                                        }}
                                      />
                                    </div>
                                  </div>
                                </th>
                                <th
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    let newSortType;
                                    if (
                                      sortType.notInterested === "ascending"
                                    ) {
                                      newSortType = "descending";
                                    } else if (
                                      sortType.notInterested === "descending"
                                    ) {
                                      newSortType = "none";
                                    } else {
                                      newSortType = "ascending";
                                    }
                                    handleSortNotInterested(newSortType);
                                  }}
                                >
                                  <div className="d-flex align-items-center justify-content-between">
                                    <div>Not Interested</div>
                                    <div className="short-arrow-div">
                                      <ArrowDropUpIcon className="up-short-arrow"
                                        style={{
                                          color:
                                            sortType.untouched === "descending"
                                              ? "black"
                                              : "#9d8f8f",
                                        }}
                                      />
                                      <ArrowDropDownIcon className="down-short-arrow"
                                        style={{
                                          color:
                                            sortType.untouched === "ascending"
                                              ? "black"
                                              : "#9d8f8f",
                                        }}
                                      />
                                    </div>
                                  </div>
                                </th>
                                <th
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    let newSortType;
                                    if (sortType.matured === "ascending") {
                                      newSortType = "descending";
                                    } else if (
                                      sortType.matured === "descending"
                                    ) {
                                      newSortType = "none";
                                    } else {
                                      newSortType = "ascending";
                                    }
                                    handleSortMatured(newSortType);
                                  }}
                                >
                                  <div className="d-flex align-items-center justify-content-between">
                                    <div>Matured</div>
                                    <div className="short-arrow-div">
                                      <ArrowDropUpIcon className="up-short-arrow"
                                        style={{
                                          color:
                                            sortType.untouched === "descending"
                                              ? "black"
                                              : "#9d8f8f",
                                        }}
                                      />
                                      <ArrowDropDownIcon className="down-short-arrow"
                                        style={{
                                          color:
                                            sortType.untouched === "ascending"
                                              ? "black"
                                              : "#9d8f8f",
                                        }}
                                      />
                                    </div>
                                  </div>
                                </th>
                                <th
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    let newSortType;
                                    if (sortType.totalLeads === "ascending") {
                                      newSortType = "descending";
                                    } else if (
                                      sortType.totalLeads === "descending"
                                    ) {
                                      newSortType = "none";
                                    } else {
                                      newSortType = "ascending";
                                    }
                                    handleSortTotalLeads(newSortType);
                                  }}
                                >
                                  <div className="d-flex align-items-center justify-content-between">
                                    <div>Total Leads</div>
                                    <div className="short-arrow-div">
                                      <ArrowDropUpIcon className="up-short-arrow"
                                        style={{
                                          color:
                                            sortType.untouched === "descending"
                                              ? "black"
                                              : "#9d8f8f",
                                        }}
                                      />
                                      <ArrowDropDownIcon className="down-short-arrow"
                                        style={{
                                          color:
                                            sortType.untouched === "ascending"
                                              ? "black"
                                              : "#9d8f8f",
                                        }}
                                      />
                                    </div>
                                  </div>
                                </th>
                                <th
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    let newSortType;
                                    if (sortType.lastLead === "ascending") {
                                      newSortType = "descending";
                                    } else if (
                                      sortType.lastLead === "descending"
                                    ) {
                                      newSortType = "none";
                                    } else {
                                      newSortType = "ascending";
                                    }
                                    handleSortLastLead(newSortType);
                                  }}
                                >
                                  <div className="d-flex align-items-center justify-content-between">
                                    <div>Last lead Assign Date</div>
                                    <div className="short-arrow-div">
                                      <ArrowDropUpIcon className="up-short-arrow"
                                        style={{
                                          color:
                                            sortType.untouched === "descending"
                                              ? "black"
                                              : "#9d8f8f",
                                        }}
                                      />
                                      <ArrowDropDownIcon className="down-short-arrow"
                                        style={{
                                          color:
                                            sortType.untouched === "ascending"
                                              ? "black"
                                              : "#9d8f8f",
                                        }}
                                      />
                                    </div>
                                  </div>
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
                                        key={`row-${index}-1`}
                                      >
                                        {index + 1}
                                      </td>
                                      <td key={`row-${index}-2`}>
                                        {obj.ename}
                                      </td>

                                      <td key={`row-${index}-3`}>
                                        <Link
                                          to={`/employeereport/${obj.ename}/Untouched`}
                                          style={{
                                            color: "black",
                                            textDecoration: "none",
                                          }}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {companyData
                                            .filter(
                                              (data) =>
                                                data.ename === obj.ename &&
                                                data.Status === "Untouched"
                                            )
                                            .length.toLocaleString()}
                                        </Link>
                                      </td>

                                      <td key={`row-${index}-4`}>
                                        <Link
                                          to={`/employeereport/${obj.ename}/Busy`}
                                          style={{
                                            color: "black",
                                            textDecoration: "none",
                                          }}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {companyData
                                            .filter(
                                              (data) =>
                                                data.ename === obj.ename &&
                                                data.Status === "Busy"
                                            )
                                            .length.toLocaleString()}
                                        </Link>
                                      </td>

                                      <td key={`row-${index}-5`}>
                                        <Link
                                          to={`/employeereport/${obj.ename}/Not Picked Up`}
                                          style={{
                                            color: "black",
                                            textDecoration: "none",
                                          }}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {companyData
                                            .filter(
                                              (data) =>
                                                data.ename === obj.ename &&
                                                data.Status === "Not Picked Up"
                                            )
                                            .length.toLocaleString()}
                                        </Link>
                                      </td>

                                      <td key={`row-${index}-6`}>
                                        <Link
                                          to={`/employeereport/${obj.ename}/Junk`}
                                          style={{
                                            color: "black",
                                            textDecoration: "none",
                                          }}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {companyData
                                            .filter(
                                              (data) =>
                                                data.ename === obj.ename &&
                                                data.Status === "Junk"
                                            )
                                            .length.toLocaleString()}
                                        </Link>
                                      </td>

                                      <td key={`row-${index}-7`}>
                                        <Link
                                          to={`/employeereport/${obj.ename}/FollowUp`}
                                          style={{
                                            color: "black",
                                            textDecoration: "none",
                                          }}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {companyData
                                            .filter(
                                              (data) =>
                                                data.ename === obj.ename &&
                                                data.Status === "FollowUp"
                                            )
                                            .length.toLocaleString()}
                                        </Link>
                                      </td>
                                      <td key={`row-${index}-8`}>
                                        <Link
                                          to={`/employeereport/${obj.ename}/Interested`}
                                          style={{
                                            color: "black",
                                            textDecoration: "none",
                                          }}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {companyData
                                            .filter(
                                              (data) =>
                                                data.ename === obj.ename &&
                                                data.Status === "Interested"
                                            )
                                            .length.toLocaleString()}
                                        </Link>
                                      </td>
                                      <td key={`row-${index}-9`}>
                                        <Link
                                          to={`/employeereport/${obj.ename}/Not Interested`}
                                          style={{
                                            color: "black",
                                            textDecoration: "none",
                                          }}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {companyData
                                            .filter(
                                              (data) =>
                                                data.ename === obj.ename &&
                                                data.Status === "Not Interested"
                                            )
                                            .length.toLocaleString()}
                                        </Link>
                                      </td>
                                      <td key={`row-${index}-10`}>
                                        <Link
                                          to={`/employeereport/${obj.ename}/Matured`}
                                          style={{
                                            color: "black",
                                            textDecoration: "none",
                                          }}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {companyData
                                            .filter(
                                              (data) =>
                                                data.ename === obj.ename &&
                                                data.Status === "Matured"
                                            )
                                            .length.toLocaleString()}
                                        </Link>
                                      </td>
                                      <td key={`row-${index}-11`}>
                                        <Link
                                          to={`/employeereport/${obj.ename}/complete`}
                                          style={{
                                            color: "black",
                                            textDecoration: "none",
                                          }}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {companyData
                                            .filter(
                                              (data) => data.ename === obj.ename
                                            )
                                            .length.toLocaleString()}
                                        </Link>
                                      </td>
                                      <td key={`row-${index}-12`}>
                                        {formatDateFinal(
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
                                            functionOpenEmployeeTable(
                                              obj.ename
                                            );
                                          }}
                                          style={{
                                            cursor: "pointer",
                                            marginRight: "-41px",
                                            marginLeft: "21px",
                                            fontSize: "17px",
                                          }}
                                        />
                                      </td>
                                    </tr>
                                  </React.Fragment>
                                ))}
                            </tbody>
                            {employeeData.length !== 0 &&
                              companyData.length !== 0 && (
                                <tfoot className="admin-dash-tbl-tfoot"    >
                                  <tr style={{ fontWeight: 500 }}>
                                    <td
                                      colSpan="2"
                                    >
                                      Total
                                    </td>
                                    <td>
                                      {companyData
                                        .filter(
                                          (partObj) =>
                                            partObj.Status === "Untouched"
                                        )
                                        .length.toLocaleString()}
                                    </td>
                                    <td>
                                      {companyData
                                        .filter(
                                          (partObj) => partObj.Status === "Busy"
                                        )
                                        .length.toLocaleString()}
                                    </td>
                                    <td>
                                      {companyData
                                        .filter(
                                          (partObj) =>
                                            partObj.Status === "Not Picked Up"
                                        )
                                        .length.toLocaleString()}
                                    </td>
                                    <td>
                                      {companyData
                                        .filter(
                                          (partObj) => partObj.Status === "Junk"
                                        )
                                        .length.toLocaleString()}
                                    </td>
                                    <td>
                                      {companyData
                                        .filter(
                                          (partObj) =>
                                            partObj.Status === "FollowUp"
                                        )
                                        .length.toLocaleString()}
                                    </td>
                                    <td>
                                      {companyData
                                        .filter(
                                          (partObj) =>
                                            partObj.Status === "Interested"
                                        )
                                        .length.toLocaleString()}
                                    </td>
                                    <td>
                                      {companyData
                                        .filter(
                                          (partObj) =>
                                            partObj.Status === "Not Interested"
                                        )
                                        .length.toLocaleString()}
                                    </td>
                                    <td>
                                      {companyData
                                        .filter(
                                          (partObj) =>
                                            partObj.Status === "Matured"
                                        )
                                        .length.toLocaleString()}
                                    </td>
                                    <td>
                                      {companyData.length.toLocaleString()}
                                    </td>
                                    <td>-</td>
                                  </tr>
                                </tfoot>
                              )}
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ----------------------------------Employees Forwarded Data Report Section----------------------------------------------- */}

                  <div className="employee-dashboard mt-3">
                    <div className="card">
                      <div className="card-header p-1 employeedashboard d-flex align-items-center justify-content-between">
                        <div className="dashboard-title pl-1"  >
                          <h2 className="m-0">
                            Employees Forwaded Data Report
                          </h2>
                        </div>
                        <div className="d-flex align-items-center pr-1">
                          <div class="input-icon mr-1">
                            <span class="input-icon-addon">
                              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                                <path d="M21 21l-6 -6"></path>
                              </svg>
                            </span>
                            <input
                              value={searchTermForwardData}
                              onChange={(e) =>
                                debouncedFilterSearchForwardData(e.target.value)
                              }
                              className="form-control"
                              placeholder="Enter BDE Name..."
                              type="text"
                              name="bdeName-search"
                              id="bdeName-search" />
                          </div>
                          <div className="filter-booking d-flex align-items-center">
                            <div className="filter-main">
                              <select
                                className="form-select"
                                id={`branch-filter`}
                                value={selectedValue}
                                onChange={(e) => {
                                  setSelectedValue(e.target.value)
                                  handleFilterForwardCaseBranchOffice(e.target.value)
                                }}
                              >
                                <option value="" disabled selected>
                                  Select Branch
                                </option>

                                <option value={"Gota"}>Gota</option>
                                <option value={"Sindhu Bhawan"}>
                                  Sindhu Bhawan
                                </option>
                                <option value={"none"}>None</option>
                              </select>
                            </div>
                          </div>
                          {/* <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            style={{ padding: "0px" }}
                          >
                            <DemoContainer
                              components={["SingleInputDateRangeField"]}
                            >
                              <DateRangePicker
                                onChange={(values) => {
                                  const startDateEmp = moment(values[0]).format(
                                    "DD/MM/YYYY"
                                  );
                                  const endDateEmp = moment(values[1]).format(
                                    "DD/MM/YYYY"
                                  );
                                  setSelectedDateRangeEmployee([
                                    startDateEmp,
                                    endDateEmp,
                                  ]);
                                  handleSelectEmployee(values); // Call handleSelect with the selected values
                                }}
                                slots={{ field: SingleInputDateRangeField }}
                                slotProps={{
                                  shortcuts: {
                                    items: shortcutsItems,
                                  },
                                  actionBar: { actions: [] },
                                  textField: {
                                    InputProps: { endAdornment: <Calendar /> },
                                  },
                                }}
                              //calendars={1}
                              />
                            </DemoContainer>
                          </LocalizationProvider> */}
                          {/* <div>
                            <select className="form-select mt-1" 
                              onChange={(e) => {
                                handleSelectForwardedEmployeeData(e.target.value); // You missed passing the value to the function
                              }}>
                              <option disabled value="">Select...</option>
                              {forwardEmployeeDataNew.map((obj) => (
                                <option key={obj.id} value={obj.ename}>
                                  {obj.ename}
                                </option>
                              ))}
                            </select>
                          </div> */}
                          <div className="services mt-1 mr-3" style={{ zIndex: "9999", display: "none" }}>
                            <Select
                              isMulti
                              options={options}
                              onChange={(selectedOptions) => {
                                setSelectedValues(selectedOptions.map((option) => option.value));
                                const selectedEmployeeNames = selectedOptions.map((option) => option.label);
                                handleSelectForwardedEmployeeData(selectedEmployeeNames);
                              }}
                              value={selectedValues.map((value) => ({ value, label: value }))}
                              placeholder="Select..."
                            />
                          </div>
                        </div>
                      </div>
                      <div className='card-body'>
                        <div className="row tbl-scroll">
                          <table className="table-vcenter table-nowrap admin-dash-tbl">
                            <thead className="admin-dash-tbl-thead">
                              <tr>
                                <th>
                                  Sr.No
                                </th>
                                <th>BDE/BDM Name</th>
                                <th >Branch Name</th>
                                <th >Forwarded Cases</th>
                                <th >Recieved Cases</th>
                                <th >Forwarded Case Projection</th>
                                <th >Recieved Case Projection</th>
                                <th >Matured Case</th>
                                <th>Generated Revenue</th>
                              </tr>
                            </thead>
                            <tbody>
                              {forwardEmployeeData.length !== 0 &&
                                forwardEmployeeData.map((obj, index) => (
                                  <tr key={`row-${index}`}>
                                    <td style={{
                                      color: "black",
                                      textDecoration: "none",
                                    }} >{index + 1}</td>
                                    <td >{obj.ename}</td>
                                    <td>{obj.branchOffice}</td>
                                    <td >
                                      {companyDataTotal.filter((company) => company.ename === obj.ename && (company.bdmAcceptStatus === "Pending" || company.bdmAcceptStatus === "Accept")).length}
                                    </td>
                                    <td >
                                      {teamLeadsData.filter((company) => company.bdmName === obj.ename).length}
                                    </td>
                                    <td>
                                      {/* ₹{(followData
                                      .filter(company => company.bdeName === obj.ename)
                                      .reduce((total, obj) => total + obj.totalPayment, 0)).toLocaleString()} */}
                                     {obj.bdmWork ? `₹${functionCaluclateTotalForwardedProjection(true , obj.ename)}` : `₹${functionCaluclateTotalForwardedProjection(false , obj.ename)}`}

                                    </td>

                                    <td>
                                      {/* ₹{followDataNew
                                      .filter(company => company.ename === obj.ename && company.bdeName)
                                      .reduce((total, obj) => total + obj.totalPayment, 0).toLocaleString()} */}
                                      ₹{functionCalculateTotalProjectionRecieved(obj.ename)}
                                    </td>

                                    <td>
                                      {companyDataTotal.filter((company) => company.ename === obj.ename && company.bdmAcceptStatus === "Accept" && company.Status === "Matured").length}
                                    </td>
                                    <td>₹ {Math.round(functionCalculateGeneratedTotalRevenue(obj.ename)).toLocaleString()}</td>
                                  </tr>
                                ))}
                            </tbody>
                            <tfoot className="admin-dash-tbl-tfoot"    >
                              <tr>
                                <td
                                  colSpan="3"
                                >
                                  Total
                                </td>
                                <td>
                                  {companyDataTotal.filter(company => company.bdmAcceptStatus === "Pending" || company.bdmAcceptStatus === "Accept").length}
                                </td>
                                <td>
                                  {teamLeadsData.length}
                                </td>
                                <td>
                                  {/* ₹{companyData
                                  .filter(company => company.bdmAcceptStatus === "Accept" || company.bdmAcceptStatus === "Pending")
                                  .reduce((total, company) => {
                                    const totalPayment = followData
                                      .filter(followCompany => followCompany.companyName === company["Company Name"] && followCompany.bdeName)
                                      .reduce((sum, obj) => sum + obj.totalPayment, 0);
                                    return total + totalPayment;
                                  }, 0)
                                } */}
                                ₹{generatedTotalProjection}

                                </td>
                                <td>
                                  {/* ₹{companyData
                                    .filter(company => company.bdmAcceptStatus === "Accept")
                                    .reduce((total, company) => {
                                      const totalPayment = followDataNew
                                        .filter(followCompany => followCompany.companyName === company["Company Name"])
                                        .reduce((sum, obj) => sum + obj.totalPayment, 0);
                                      return total + totalPayment;
                                    }, 0)
                                  } */}
                                  ₹{generatedTotalProjectionRecieved}
                                </td>
                                <td>
                                  {companyData.filter(company => company.bdmAcceptStatus === "Accept" && company.Status === "Matured").length}
                                </td>
                                <td>
                                 ₹ {Math.round(generatedTotalRevenue).toLocaleString()}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ------------------------projection-summary--------------------------------------------- */}

                  <div className="employee-dashboard mt-3"
                    id="projectionsummaryadmin"   >
                    <div className="card">
                      <div className="card-header p-1 employeedashboard d-flex align-items-center justify-content-between">
                        <div className="dashboard-title pl-1"  >
                          <h2 className="m-0">
                            Projection Summary
                          </h2>
                        </div>
                        <div className="d-flex align-items-center pr-1">
                          <div className="filter-booking mr-1 d-flex align-items-center">
                            <div className="filter-title mr-1">
                              <h2 className="m-0">
                                Filter Branch :
                              </h2>
                            </div>
                            <div className="filter-main">
                              <select
                                className="form-select"
                                id={`branch-filter`}
                                onChange={(e) => {
                                  handleFilterBranchOffice(e.target.value)
                                }}
                              >
                                <option value="" disabled selected>
                                  Select Branch
                                </option>

                                <option value={"Gota"}>Gota</option>
                                <option value={"Sindhu Bhawan"}>
                                  Sindhu Bhawan
                                </option>
                                <option value={"none"}>None</option>
                              </select>
                            </div>
                          </div>
                          <div className="date-filter">
                            <LocalizationProvider
                              dateAdapter={AdapterDayjs}
                              style={{ padding: "0px" }}
                            >
                              <DemoContainer components={["SingleInputDateRangeField"]}>
                                <DateRangePicker className="form-control my-date-picker form-control-sm p-0"
                                  onChange={(values) => {
                                    const startDate = moment(values[0]).format(
                                      "DD/MM/YYYY"
                                    );
                                    const endDate = moment(values[1]).format(
                                      "DD/MM/YYYY"
                                    );
                                    setSelectedDateRange([startDate, endDate]);
                                    handleSelect(values); // Call handleSelect with the selected values
                                  }}
                                  slots={{ field: SingleInputDateRangeField }}
                                  slotProps={{
                                    shortcuts: {
                                      items: shortcutsItems,
                                    },
                                    actionBar: { actions: [] },
                                    textField: {
                                      InputProps: { endAdornment: <Calendar /> },
                                    },
                                  }}
                                //calendars={1}
                                />
                              </DemoContainer>
                            </LocalizationProvider>
                          </div>


                        </div>
                        {/* <div className="form-control date-range-picker d-flex align-items-center justify-content-between">
                          <div>{`${formatDate(startDate)} - ${formatDate(endDate)}`}</div>
                          <button onClick={handleIconClick} style={{ border: "none", padding: "0px", backgroundColor: "white" }}>
                            <FaRegCalendar style={{ width: "20px", height: "20px", color: "#bcbaba", color: "black" }} />
                          </button>
                        </div> */}
                      </div>
                      <div className="card-body">
                        <div id="table-default" className="row tbl-scroll" >
                          <table className="table-vcenter table-nowrap admin-dash-tbl"  >
                            <thead className="admin-dash-tbl-thead">
                              <tr>
                                <th>
                                  Sr. No
                                </th>
                                <th>Employee Name</th>
                                <th>
                                  Total Companies
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
                                <th>
                                  Offered Services
                                  <SwapVertIcon
                                    style={{
                                      height: "15px",
                                      width: "15px",
                                      cursor: "pointer",
                                      marginLeft: "4px",
                                    }}
                                    onClick={() => {
                                      let newSortType;
                                      if (sortTypeServices === "ascending") {
                                        newSortType = "descending";
                                      } else if (sortTypeServices === "descending") {
                                        newSortType = "none";
                                      } else {
                                        newSortType = "ascending";
                                      }
                                      handleSortOfferedServices(newSortType);
                                    }}
                                  />
                                </th>
                                <th>
                                  Total Offered Price
                                  <SwapVertIcon
                                    style={{
                                      height: "15px",
                                      width: "15px",
                                      cursor: "pointer",
                                      marginLeft: "4px",
                                    }}
                                    onClick={() => {
                                      let newSortType;
                                      if (sortTypePrice === "ascending") {
                                        newSortType = "descending";
                                      } else if (sortTypePrice === "descending") {
                                        newSortType = "none";
                                      } else {
                                        newSortType = "ascending";
                                      }
                                      handleSortOffredPrize(newSortType);
                                    }}
                                  />
                                </th>
                                <th>
                                  Expected Amount
                                  <SwapVertIcon
                                    style={{
                                      height: "15px",
                                      width: "15px",
                                      cursor: "pointer",
                                      marginLeft: "4px",
                                    }}
                                    onClick={() => {
                                      let newSortType;
                                      if (sortTypeExpectedPayment === "ascending") {
                                        newSortType = "descending";
                                      } else if (
                                        sortTypeExpectedPayment === "descending"
                                      ) {
                                        newSortType = "none";
                                      } else {
                                        newSortType = "ascending";
                                      }
                                      handleSortExpectedPayment(newSortType);
                                    }}
                                  />
                                </th>
                                {/* <th>Est. Payment Date</th> */}
                              </tr>
                            </thead>
                            <tbody>
                              {sortedData && sortedData.length !== 0 ? (
                                <>
                                  {sortedData.map((obj, index) => (
                                    <tr key={`row-${index}`}>
                                      <td>{index + 1}</td>
                                      <td>{obj}</td>
                                      <td>
                                        {
                                          followDataToday.filter(
                                            (partObj) => partObj.ename === obj
                                          ).length
                                        }
                                        <FcDatabase
                                          onClick={() => {
                                            functionOpenProjectionTable(obj);
                                          }}
                                          style={{
                                            cursor: "pointer",
                                            marginRight: "-71px",
                                            marginLeft: "58px",
                                          }}
                                        />
                                      </td>
                                      <td>
                                        {followDataToday.reduce(
                                          (totalServices, partObj) => {
                                            if (partObj.ename === obj) {
                                              totalServices += partObj.offeredServices.length;
                                            }
                                            return totalServices;
                                          },
                                          0
                                        )}
                                      </td>
                                      <td>
                                        {followDataToday
                                          .reduce((totalOfferedPrize, partObj) => {
                                            if (partObj.ename === obj) {
                                              totalOfferedPrize += partObj.offeredPrize;
                                            }
                                            return totalOfferedPrize;
                                          }, 0)
                                          .toLocaleString("en-IN", numberFormatOptions)}
                                      </td>
                                      <td>
                                        {followDataToday
                                          .reduce((totalPaymentSum, partObj) => {
                                            if (partObj.ename === obj) {
                                              totalPaymentSum += partObj.totalPayment;
                                            }
                                            return totalPaymentSum;
                                          }, 0)
                                          .toLocaleString("en-IN", numberFormatOptions)}
                                      </td>
                                    </tr>
                                  ))}
                                  {/* Map employeeData with default fields */}
                                  {employeeData
                                    .filter((employee) => (employee.designation === "Sales Executive") && !sortedData.includes(employee.ename)) // Filter out enames already included in sortedData
                                    .map((employee, index) => (
                                      <tr key={`employee-row-${index}`}>
                                        <td>{sortedData.length + index + 1}</td>
                                        <td>{employee.ename}</td>
                                        <td>0 <FcDatabase
                                          onClick={() => {
                                            functionOpenProjectionTable(employee.ename);
                                          }}
                                          style={{
                                            cursor: "pointer",
                                            marginRight: "-71px",
                                            marginLeft: "58px",
                                          }}
                                        /></td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                      </tr>
                                    ))}
                                </>
                              ) : (
                                employeeData
                                  .filter((employee) => !sortedData.includes(employee.ename)) // Filter out enames already included in sortedData
                                  .map((employee, index) => (

                                    <tr key={`employee-row-${index}`}>
                                      <td>{index + 1}</td>
                                      <td>{employee.ename}</td>
                                      <td>0 <FcDatabase
                                        onClick={() => {
                                          functionOpenProjectionTable(employee.ename);
                                        }}
                                        style={{
                                          cursor: "pointer",
                                          marginRight: "-71px",
                                          marginLeft: "58px",
                                        }}
                                      /></td>
                                      <td>0</td>
                                      <td>0</td>
                                      <td>0</td>
                                    </tr>

                                  ))
                              )}
                            </tbody>
                            {sortedData && sortedData.length !== 0 && (
                              <tfoot className="admin-dash-tbl-tfoot"    >
                                <tr style={{ fontWeight: 500 }}>
                                  <td colSpan="2">
                                    Total
                                  </td>
                                  <td>
                                    {
                                      followDataToday.filter((partObj) => partObj.ename)
                                        .length
                                    }
                                    <FcDatabase
                                      onClick={() => {
                                        functionCompleteProjectionTable();
                                      }}
                                      style={{
                                        cursor: "pointer",
                                        marginRight: "-71px",
                                        marginLeft: "55px",
                                      }}
                                    />
                                  </td>
                                  <td>
                                    {followDataToday.reduce(
                                      (totalServices, partObj) => {
                                        totalServices += partObj.offeredServices.length;
                                        return totalServices;
                                      },
                                      0
                                    )}
                                  </td>
                                  <td>
                                    {followDataToday
                                      .reduce((totalOfferedPrize, partObj) => {
                                        totalOfferedPrize += partObj.offeredPrize;
                                        return totalOfferedPrize;
                                      }, 0)
                                      .toLocaleString("en-IN", numberFormatOptions)}
                                  </td>
                                  <td>
                                    {followDataToday
                                      .reduce((totalPaymentSum, partObj) => {
                                        totalPaymentSum += partObj.totalPayment;
                                        return totalPaymentSum;
                                      }, 0)
                                      .toLocaleString("en-IN", numberFormatOptions)}
                                  </td>
                                </tr>
                              </tfoot>
                            )}

                            {/* {sortedData && sortedData.length === 0 && (
                              <tbody>
                                <tr>
                                  <td className="particular" colSpan={9}>
                                    <Nodata />
                                  </td>
                                </tr>
                              </tbody>
                            )} */}
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
                              <td style={{ lineHeight: "32px" }}>
                                {index + 1}
                              </td>
                              <td>{`${formatDate(mainObj.bookingDate)}(${mainObj.bookingTime
                                })`}</td>
                              <td>{mainObj.bdeName}</td>
                              <td>{mainObj.companyName}</td>
                              <td>{mainObj.contactNumber}</td>
                              <td>{mainObj.companyEmail}</td>
                              <td>{mainObj.services[0]}</td>
                              <td>
                                ₹
                                {(mainObj.bdeName !== mainObj.bdmName
                                  ? mainObj.originalTotalPayment / 2
                                  : mainObj.originalTotalPayment
                                ).toLocaleString()}
                              </td>
                              <td>
                                ₹
                                {
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
                                ₹
                                {(mainObj.firstPayment !== 0
                                  ? mainObj.bdeName === mainObj.bdmName
                                    ? mainObj.originalTotalPayment -
                                    mainObj.firstPayment
                                    : (mainObj.originalTotalPayment -
                                      mainObj.firstPayment) /
                                    2
                                  : 0
                                ).toLocaleString()}{" "}
                              </td>
                              <td>
                                {mainObj.bdeName !== mainObj.bdmName
                                  ? "Yes"
                                  : "No"}
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
                                      onClick={() =>
                                        setExpand(mainObj.companyName)
                                      }
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
                                    ₹
                                    {(mainObj.firstPayment !== 0
                                      ? mainObj.firstPayment / 2
                                      : mainObj.originalTotalPayment / 2
                                    ).toLocaleString()}{" "}
                                  </td>
                                  <td>
                                    ₹
                                    {(mainObj.firstPayment !== 0
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
                          ₹
                          {filteredBooking
                            .filter((data) => data.bdeName === tableEmployee)
                            .reduce((total, obj) => {
                              return obj.bdeName === obj.bdmName
                                ? total + obj.originalTotalPayment
                                : total + obj.originalTotalPayment / 2;
                            }, 0)
                            .toLocaleString()}
                        </th>
                        <th>
                          ₹
                          {filteredBooking
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
                          ₹
                          {filteredBooking
                            .filter((data) => data.bdeName === tableEmployee)
                            .reduce((total, obj) => {
                              return obj.bdeName === obj.bdmName
                                ? obj.firstPayment === 0
                                  ? 0
                                  : total +
                                  (obj.originalTotalPayment -
                                    obj.firstPayment)
                                : obj.firstPayment === 0
                                  ? 0
                                  : total +
                                  (obj.originalTotalPayment -
                                    obj.firstPayment) /
                                  2;
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
                              <td>
                                {(mainObj.totalPayment / 2).toLocaleString()}
                              </td>
                              <td>
                                ₹
                                {(mainObj.firstPayment !== 0
                                  ? mainObj.firstPayment / 2
                                  : mainObj.totalPayment / 2
                                ).toLocaleString()}
                              </td>
                              <td>
                                ₹
                                {(mainObj.firstPayment !== 0
                                  ? mainObj.bdeName === mainObj.bdmName
                                    ? mainObj.originalTotalPayment -
                                    mainObj.firstPayment
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
                                {(
                                  mainObj.originalTotalPayment / 2
                                ).toLocaleString()}{" "}
                              </td>
                              <td>
                                ₹
                                {(mainObj.firstPayment !== 0
                                  ? mainObj.firstPayment / 2
                                  : mainObj.originalTotalPayment / 2
                                ).toLocaleString()}{" "}
                              </td>
                              <td>
                                ₹
                                {(mainObj.firstPayment !== 0
                                  ? mainObj.bdeName === mainObj.bdmName
                                    ? mainObj.originalTotalPayment -
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
                              <th>
                                {mainObj.originalTotalPayment.toLocaleString()}
                              </th>
                              <th>
                                ₹
                                {(mainObj.firstPayment !== 0
                                  ? mainObj.firstPayment
                                  : mainObj.originalTotalPayment
                                ).toLocaleString()}
                              </th>
                              <th>
                                ₹
                                {(mainObj.firstPayment !== 0
                                  ? mainObj.originalTotalPayment -
                                  mainObj.firstPayment
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
                  <strong>{selectedEmployee}</strong>
                </div>
                <div
                  style={{ cursor: "pointer" }}
                  className="closeIcon"
                  onClick={closeEmployeeTable}
                >
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
                          <td
                            style={{
                              lineHeight: "32px",
                            }}
                          >
                            {obj}
                          </td>
                          <td>
                            {properCompanyData
                              .filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Untouched"
                              )
                              .length.toLocaleString()}
                          </td>
                          <td>
                            {properCompanyData
                              .filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Busy"
                              )
                              .length.toLocaleString()}
                          </td>
                          <td>
                            {properCompanyData
                              .filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Not Picked Up"
                              )
                              .length.toLocaleString()}
                          </td>
                          <td>
                            {properCompanyData
                              .filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Junk"
                              )
                              .length.toLocaleString()}
                          </td>
                          <td>
                            {properCompanyData
                              .filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "FollowUp"
                              )
                              .length.toLocaleString()}
                          </td>
                          <td>
                            {properCompanyData
                              .filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Interested"
                              )
                              .length.toLocaleString()}
                          </td>
                          <td>
                            {properCompanyData
                              .filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Not Interested"
                              )
                              .length.toLocaleString()}
                          </td>
                          <td>
                            {properCompanyData
                              .filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Matured"
                              )
                              .length.toLocaleString()}
                          </td>
                          <td>
                            {properCompanyData
                              .filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj
                              )
                              .length.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                  {uniqueArray && (
                    <tfoot>
                      <tr style={{ fontWeight: 500 }}>
                        <td colSpan="2">Total</td>
                        <td>
                          {properCompanyData
                            .filter((partObj) => partObj.Status === "Untouched")
                            .length.toLocaleString()}
                        </td>

                        <td
                          style={{
                            lineHeight: "32px",
                          }}
                        >
                          {properCompanyData
                            .filter((partObj) => partObj.Status === "Busy")
                            .length.toLocaleString()}
                        </td>
                        <td>
                          {properCompanyData
                            .filter(
                              (partObj) => partObj.Status === "Not Picked Up"
                            )
                            .length.toLocaleString()}
                        </td>
                        <td>
                          {properCompanyData
                            .filter((partObj) => partObj.Status === "Junk")
                            .length.toLocaleString()}
                        </td>
                        <td>
                          {properCompanyData
                            .filter((partObj) => partObj.Status === "FollowUp")
                            .length.toLocaleString()}
                        </td>
                        <td>
                          {properCompanyData
                            .filter(
                              (partObj) => partObj.Status === "Interested"
                            )
                            .length.toLocaleString()}
                        </td>
                        <td>
                          {properCompanyData
                            .filter(
                              (partObj) => partObj.Status === "Not Interested"
                            )
                            .length.toLocaleString()}
                        </td>
                        <td>
                          {properCompanyData
                            .filter((partObj) => partObj.Status === "Matured")
                            .length.toLocaleString()}
                        </td>
                        <td>{properCompanyData.length.toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </DialogContent>
          </Dialog>

          {/* -------------------------------------projection-dashboard--------------------------------------------- */}

          <Dialog
            open={openProjectionTable}
            onClose={closeProjectionTable}
            fullWidth
            maxWidth="lg"
          >
            <DialogTitle>
              {projectionEname} Today's Report{" "}
              <IconButton
                onClick={closeProjectionTable}
                style={{ float: "right" }}
              >
                <CloseIcon color="primary"></CloseIcon>
              </IconButton>{" "}
            </DialogTitle>
            <DialogContent>
              <div
                id="table-default"
                style={{
                  overflowX: "auto",
                  overflowY: "auto",
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
                  <thead
                    style={{
                      position: "sticky", // Make the header sticky
                      top: "-1px", // Stick it at the top
                      backgroundColor: "#ffb900",
                      color: "black",
                      fontWeight: "bold",
                      zIndex: 1, // Ensure it's above other content
                    }}
                  >
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
                      <th>View History</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Map through uniqueEnames array to render rows */}

                    {projectedDataToday && projectedDataToday.length > 0
                      ? //   projectedDataDateRange.map((obj, Index) => (
                      //     <tr key={`sub-row-${Index}`}>
                      //       <td style={{ lineHeight: "32px" }}>{Index + 1}</td>
                      //       {/* Render other employee data */}
                      //       <td>{obj.ename}</td>
                      //       <td>{obj.companyName}</td>
                      //       <td>{obj.offeredServices.join(",")}</td>
                      //       <td>{obj.offeredPrize.toLocaleString('en-IN', numberFormatOptions)}</td>
                      //       <td>{obj.totalPayment.toLocaleString('en-IN', numberFormatOptions)}</td>
                      //       <td>{obj.estPaymentDate}</td>
                      //       <td>{obj.lastFollowUpdate}</td>
                      //       <td>{obj.remarks}</td>
                      //       <td><MdHistory style={{ width: "17px", height: "17px", color: "grey" }} onClick={() => handleViewHistoryNew(obj.companyName)} /></td>
                      //     </tr>
                      //   ))
                      // ) :

                      projectedDataToday.map((obj, Index) => (
                        <tr key={`sub-row-${Index}`}>
                          <td style={{ lineHeight: "32px" }}>{Index + 1}</td>
                          {/* Render other employee data */}
                          <td>{obj.ename}</td>
                          <td>{obj.companyName}</td>
                          <td>{obj.offeredServices.join(",")}</td>
                          <td>
                            {obj.offeredPrize.toLocaleString(
                              "en-IN",
                              numberFormatOptions
                            )}
                          </td>
                          <td>
                            {obj.totalPayment.toLocaleString(
                              "en-IN",
                              numberFormatOptions
                            )}
                          </td>
                          <td>{formatDateFinal(obj.estPaymentDate)}</td>
                          <td>{formatDateFinal(obj.lastFollowUpdate)}</td>
                          <td>{obj.remarks}</td>
                          <td>
                            <MdHistory
                              style={{
                                width: "17px",
                                height: "17px",
                                color: "grey",
                              }}
                              onClick={() =>
                                handleViewHistoryProjection(obj.companyName)
                              }
                            />
                          </td>
                        </tr>
                      ))
                      : null}
                  </tbody>
                  {projectedEmployee && (
                    <tfoot
                      style={{
                        position: "sticky", // Make the footer sticky
                        bottom: -1, // Stick it at the bottom
                        backgroundColor: "#f6f2e9",
                        color: "black",
                        fontWeight: 500,
                        zIndex: 2,
                      }}
                    >
                      <tr style={{ fontWeight: 500 }}>
                        <td style={{ lineHeight: "32px" }} colSpan="2">
                          Total
                        </td>
                        {/* <td>{projectedEmployee.length}</td> 
                        <td>
                          {projectedDataDateRange && projectedDataDateRange.length > 0 ? (projectedDataDateRange.length) : (projectedDataToday.length)}
                        </td>*/}
                        <td>{projectedDataToday.length}</td>
                        {/* <td>{offeredServicesPopup.length}
                    </td> 
                        <td>{projectedDataDateRange && projectedDataDateRange.length > 0 ? (offeredServicesPopupDateRange.length) : (offeredServicesPopupToday.length)}</td>
                        <td>{(offeredServicesPopupToday.length)}</td>*/}
                        <td>
                          {projectedDataToday.reduce(
                            (totalServices, partObj) => {
                              totalServices += partObj.offeredServices.length;
                              return totalServices;
                            },
                            0
                          )}
                        </td>
                        {/* <td>{totalPaymentSumPopup.toLocaleString()}
                    </td> 
                        <td>   &#8377;{projectedDataDateRange && projectedDataDateRange.length > 0 ? (offeredPaymentSumPopupDateRange.toLocaleString()) : (offeredPaymentSumPopupToday.toLocaleString())}</td>
                        <td>
                          &#8377;{projectedDataDateRange && projectedDataDateRange.length > 0 ? (totalPaymentSumPopupDateRange.toLocaleString()) : (totalPaymentSumPopupToday.toLocaleString())}
                        </td>
                        {/* <td>{offeredPaymentSumPopup.toLocaleString()}
                    </td> 
                        <td>   &#8377;{(offeredPaymentSumPopupToday.toLocaleString())}</td>
                         <td>
                          &#8377;{(totalPaymentSumPopupToday.toLocaleString())}
                        </td>*/}

                        <td>
                          &#8377;
                          {projectedDataToday.reduce(
                            (totalOfferedPrice, partObj) => {
                              return totalOfferedPrice + partObj.offeredPrize;
                            },
                            0
                          )}
                        </td>
                        <td>
                          &#8377;
                          {projectedDataToday.reduce(
                            (totalTotalPayment, partObj) => {
                              return totalTotalPayment + partObj.totalPayment;
                            },
                            0
                          )}
                        </td>
                        <td>-</td>
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

          {/* -------------------------------------------------------------complete projection--------------------------------------- */}
          <Dialog
            open={completeProjectionTable}
            onClose={closeCompleteProjectionTable}
            fullWidth
            maxWidth="lg"
          >
            <DialogTitle>
              Today's Report{" "}
              <IconButton
                onClick={closeCompleteProjectionTable}
                style={{ float: "right" }}
              >
                <CloseIcon color="primary"></CloseIcon>
              </IconButton>{" "}
              <button
                style={{ float: "right" }}
                className="btn btn-primary mr-1"
                onClick={exportData}
              >
                + Export CSV
              </button>
            </DialogTitle>
            <DialogContent>
              <div
                id="table-default"
                style={{
                  overflowX: "auto",
                  overflowY: "auto",
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
                  <thead
                    style={{
                      position: "sticky", // Make the header sticky
                      top: "-1px", // Stick it at the top
                      backgroundColor: "#ffb900",
                      color: "black",
                      fontWeight: "bold",
                      zIndex: 1, // Ensure it's above other content
                    }}
                  >
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
                      {/* <th>View History</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Map through uniqueEnames array to render rows */}

                    {followDataToday && followDataToday.length > 0
                      ? followDataToday.map((obj, Index) => (
                        <tr key={`sub-row-${Index}`}>
                          <td style={{ lineHeight: "32px" }}>{Index + 1}</td>
                          {/* Render other employee data */}
                          <td>{obj.ename}</td>
                          <td>{obj.companyName}</td>
                          <td>{obj.offeredServices.join(",")}</td>
                          <td>
                            {obj.offeredPrize.toLocaleString(
                              "en-IN",
                              numberFormatOptions
                            )}
                          </td>
                          <td>
                            {obj.totalPayment.toLocaleString(
                              "en-IN",
                              numberFormatOptions
                            )}
                          </td>
                          <td>{obj.estPaymentDate}</td>
                          <td>{obj.lastFollowUpdate}</td>
                          <td>{obj.remarks}</td>
                          {/* <td><MdHistory style={{ width: "17px", height: "17px", color: "grey" }} onClick={() => handleViewHistoryProjection(obj.companyName)} /></td> */}
                        </tr>
                      ))
                      : null}
                  </tbody>
                  {followDataToday && (
                    <tfoot
                      style={{
                        position: "sticky", // Make the footer sticky
                        bottom: -1, // Stick it at the bottom
                        backgroundColor: "#f6f2e9",
                        color: "black",
                        fontWeight: 500,
                        zIndex: 2,
                      }}
                    >
                      <tr style={{ fontWeight: 500 }}>
                        <td style={{ lineHeight: "32px" }} colSpan="2">
                          Total
                        </td>
                        <td>{followDataToday.length}</td>
                        <td>
                          {followDataToday.reduce((totalServices, partObj) => {
                            totalServices += partObj.offeredServices.length;
                            return totalServices;
                          }, 0)}
                        </td>
                        <td>
                          &#8377;
                          {followDataToday.reduce(
                            (totalOfferedPrice, partObj) => {
                              return totalOfferedPrice + partObj.offeredPrize;
                            },
                            0
                          )}
                        </td>
                        <td>
                          &#8377;
                          {followDataToday.reduce(
                            (totalTotalPayment, partObj) => {
                              return totalTotalPayment + partObj.totalPayment;
                            },
                            0
                          )}
                        </td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        {/* <td>-</td> */}
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </DialogContent>
          </Dialog>

          {/* ------------------------------------------------------projection history dialog------------------------------------------------------- */}

          <Dialog
            open={openProjectionHistoryTable}
            onClose={closeProjectionHistoryTable}
            fullWidth
            maxWidth="lg"
          >
            <DialogTitle>
              {viewHistoryCompanyName}
              <IconButton
                onClick={closeProjectionHistoryTable}
                style={{ float: "right" }}
              >
                <CloseIcon color="primary"></CloseIcon>
              </IconButton>{" "}
            </DialogTitle>
            <DialogContent>
              <div
                id="table-default"
                style={{
                  overflowX: "auto",
                  overflowY: "auto",
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
                  <thead
                    style={{
                      position: "sticky", // Make the header sticky
                      top: "-1px", // Stick it at the top
                      backgroundColor: "#ffb900",
                      color: "black",
                      fontWeight: "bold",
                      zIndex: 1, // Ensure it's above other content
                    }}
                  >
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
                      <th>Modified At</th>
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
                    {projectedDataToday && projectedDataToday.length > 0
                      ? historyDataCompany.map((obj, index) => (
                        <tr key={`sub-row-${index}`}>
                          <td style={{ lineHeight: "32px" }}>{index + 1}</td>
                          {/* Render other employee data */}
                          <td>{obj.modifiedAt}</td>
                          <td>{obj.data.companyName}</td>
                          <td>{obj.data.offeredServices.join(",")}</td>
                          <td>
                            {obj.data.offeredPrize.toLocaleString(
                              "en-IN",
                              numberFormatOptions
                            )}
                          </td>
                          <td>
                            {obj.data.totalPayment.toLocaleString(
                              "en-IN",
                              numberFormatOptions
                            )}
                          </td>
                          <td>{obj.data.estPaymentDate}</td>
                          <td>{obj.data.lastFollowUpdate}</td>
                          <td>{obj.data.remarks}</td>
                          {/* <td><MdHistory style={{ width: "17px", height: "17px", color: "grey" }} onClick={() => handleViewHistoryProjection} /></td> */}
                        </tr>
                      ))
                      : null}
                    {/* Additional rendering for latest data */}
                    {latestDataForCompany.map((obj, index) => (
                      <tr key={`sub-row-latest-${index}`}>
                        <td style={{ lineHeight: "32px" }}>
                          {historyDataCompany.length + index + 1}
                        </td>
                        {/* Render other employee data */}
                        <td>{obj.date}</td>
                        <td>{obj.companyName}</td>
                        <td>{obj.offeredServices.join(",")}</td>
                        <td>
                          {obj.offeredPrize.toLocaleString(
                            "en-IN",
                            numberFormatOptions
                          )}
                        </td>
                        <td>
                          {obj.totalPayment.toLocaleString(
                            "en-IN",
                            numberFormatOptions
                          )}
                        </td>
                        <td>{obj.estPaymentDate}</td>
                        <td>{obj.lastFollowUpdate}</td>
                        <td>{obj.remarks}</td>
                        {/* <td><MdHistory style={{ width: "17px", height: "17px", color: "grey" }} onClick={() => handleViewHistoryProjection} /></td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
