import React, { useState, useEffect } from 'react';
import Nodata from '../../components/Nodata';
import { FcDatabase } from "react-icons/fc";
import { debounce } from "lodash";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import moment from "moment";
import { StaticDateRangePicker } from "@mui/x-date-pickers-pro/StaticDateRangePicker";
import dayjs from "dayjs";
import { IoClose } from "react-icons/io5";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import Calendar from "@mui/icons-material/Event";
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { options } from "../../components/Options.js";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { IconButton } from "@mui/material";
import { MdHistory } from "react-icons/md";
import CloseIcon from "@mui/icons-material/Close";
import axios from 'axios';
import ClipLoader from "react-spinners/ClipLoader";
import { axisClasses } from '@mui/x-charts';
import Swal from "sweetalert2";
import { IconTrash } from "@tabler/icons-react";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

function EmployeesProjectionSummary() {
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [followDataToday, setfollowDataToday] = useState([]);
  const [followDataTodayNew, setfollowDataTodayNew] = useState([]);
  const [followDataFilter, setFollowDataFilter] = useState([])
  const [followDataNew, setFollowDataNew] = useState([])
  const [followData, setfollowData] = useState([]);
  const [searchTermProjection, setSearchTermProjection] = useState("")
  const [selectedDateRange, setSelectedDateRange] = useState([]);
  const [projectionNames, setProjectionNames] = useState([])
  const [completeProjectionTable, setCompleteProjectionTable] = useState(false);
  const [employeeDataProjectionSummary, setEmployeeDataProjectionSummary] = useState([])
  const [employeeInfo, setEmployeeInfo] = useState([])
  const [employeeData, setEmployeeData] = useState([])
  const [employeeDataFilter, setEmployeeDataFilter] = useState([])
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [openProjectionTable, setopenProjectionTable] = useState(false);
  const [openProjectionHistoryTable, setopenProjectionHistoryTable] = useState(false);
  const [projectedEmployee, setProjectedEmployee] = useState([]);
  const [filteredDataDateRange, setFilteredDataDateRange] = useState([]);
  const [projectionEname, setProjectionEname] = useState("");
  const [projectedDataToday, setprojectedDataToday] = useState([]);
  const [projectedDataDateRange, setProjectedDataDateRange] = useState([]);
  const [viewHistoryCompanyName, setviewHistoryCompanyName] = useState("");
  const [historyDataCompany, sethistoryDataCompany] = useState([]);

  //--------------------date formats--------------------------------
  function formatDateFinal(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function formatDateMonth(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }


  //-----------------------fetching Employee Data------------------------------------------
  const [loading, setLoading] = useState(false)
  const fetchEmployeeInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${secretKey}/employee/einfo`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      setEmployeeData(data.filter((employee) => employee.designation === "Sales Executive" || employee.designation === "Sales Manager"));
      setEmployeeDataFilter(data.filter((employee) => employee.designation === "Sales Executive" || employee.designation === "Sales Manager"));
      setEmployeeInfo(data.filter((employee) => employee.designation === "Sales Executive" || employee.designation === "Sales Manager"))
      setEmployeeDataProjectionSummary(data.filter((employee) => employee.designation === "Sales Executive" || employee.designation === "Sales Manager"))
      // setEmployeeDataFilter(data.filter)

    } catch (error) {
      console.error(`Error Fetching Employee Data `, error);
    } finally {
      setLoading(false)
    }
  };

  const debounceDelay = 300;

  //const debouncedFetchEmployeeInfo = debounce(fetchEmployeeInfo, debounceDelay);

  useEffect(() => {
    fetchEmployeeInfo()
  }, [])

  //-----------------------------------fetching function follow up data-----------------------------------

  // const fetchFollowUpData = async () => {
  //   try {
  //     setLoading(true)
  //     const response = await fetch(`${secretKey}/projection/projection-data`);

  //     const followdata = await response.json();
  //     setfollowData(followdata);
  //     setFollowDataFilter(followdata)
  //     setFollowDataNew(followdata)
  //     //console.log("followdata", followdata)
  //     setfollowDataToday(
  //       followdata
  //         .filter((company) => {
  //           // Assuming you want to filter companies with an estimated payment date for today
  //           const today = new Date().toISOString().split("T")[0]; // Get today's date in the format 'YYYY-MM-DD'
  //           return company.estPaymentDate === today;
  //         })
  //     );
  //     setfollowDataTodayNew(
  //       followdata
  //         .filter((company) => {
  //           // Assuming you want to filter companies with an estimated payment date for today
  //           const today = new Date().toISOString().split("T")[0]; // Get today's date in the format 'YYYY-MM-DD'
  //           return company.estPaymentDate === today;
  //         })
  //     );
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     return { error: "Error fetching data" };
  //   } finally {
  //     setLoading(false)
  //   }
  // };

  const fetchFollowUpData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${secretKey}/projection/projection-data`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const followdata = await response.json();
      setfollowData(followdata);
      setFollowDataFilter(followdata);
      setFollowDataNew(followdata);

      // Get today's date
      const today = new Date().toISOString().split("T")[0]; // Format 'YYYY-MM-DD'

      // Filter follow data for today's estimated payment date
      const filteredFollowData = followdata.filter(company => company.estPaymentDate === today);

      // Create a map of employee names to their projection statuses
      const projectionStatusMap = Object.fromEntries(
        employeeData.map(emp => [emp.ename, emp.projectionStatusForToday || "No"]) // Default to "no"
      );
      console.log("projectionStatusMap", projectionStatusMap, employeeData)

      // Merge projectionStatusToday into followDataToday
      const updatedFollowDataToday = filteredFollowData.map(company => ({
        ...company,
        projectionStatusForToday: projectionStatusMap[company.ename] || "No" // Default to "no" if not found
      }));

      setfollowDataToday(updatedFollowDataToday);
      setfollowDataTodayNew(updatedFollowDataToday);

    } catch (error) {
      console.error("Error fetching data:", error);
      return { error: "Error fetching data" };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUpData();
  }, [employeeData]);


  //--------------------filter branch office function--------------------------------------
  const handleFilterBranchOffice = (branchName) => {
    // Filter the followdataToday array based on branchName
    if (branchName === "none") {
      setfollowDataToday(followData);
      setEmployeeDataProjectionSummary(employeeDataFilter)

    } else {
      //console.log("yahan chala")
      const filteredFollowData = followData.filter((obj) =>
        employeeData.some((empObj) => empObj.branchOffice === branchName && empObj.ename === obj.ename)
      );

      const filteredemployeedata = employeeInfo.filter(obj => obj.branchOffice === branchName)


      setfollowDataToday(filteredFollowData);
      setEmployeeDataProjectionSummary(filteredemployeedata)

      //console.log(filteredemployeedata)
    }
  };

  //---------------------filter particular bde ---------------------------------------

  const filterSearchProjection = (searchTerm) => {
    setSearchTermProjection(searchTerm)
    const fileteredData = followData.filter((company) => company.ename.toLowerCase().includes(searchTerm.toLowerCase()))
    console.log("filteredData", fileteredData)
    const filteredEmployee = employeeDataFilter.filter((company) => company.ename.toLowerCase().includes(searchTerm.toLowerCase()))
    console.log(filteredEmployee, "filtereEmployee")
    setfollowDataToday(fileteredData)
    setEmployeeData(filteredEmployee)
    setEmployeeDataProjectionSummary(filteredEmployee)
  }
  const debouncedFilterSearchProjection = debounce(filterSearchProjection, 100);

  //-------------------------date -range filter function-------------------------------------------
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
    // {
    //   label: "Next Month",
    //   getValue: () => {
    //     const today = dayjs();
    //     const startOfNextMonth = today.endOf("month").add(1, "day");
    //     return [startOfNextMonth, startOfNextMonth.endOf("month")];
    //   },
    // },
    { label: "Reset", getValue: () => [null, null] },
  ];
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

  //-----------------------------------filter multiple employee selection function----------------------------------

  const options = employeeDataFilter.map((obj) => obj.ename);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  function getStyles(name, projectionNames, theme) {
    return {
      fontWeight:
        projectionNames.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const theme = useTheme();

  const handleSelectProjectionSummary = (selectedEmployeeNames) => {
    const filteredProjectionData = followData.filter((company) => selectedEmployeeNames.includes((company.ename || company.bdeName) && (company.ename || company.bdmName)))
    const filteredEmployees = employeeDataFilter.filter((company) => selectedEmployeeNames.includes((company.ename || company.bdeName) && (company.ename || company.bdmName)))
    //console.log(filteredProjectionData, "projectiondata")
    //console.log(filteredEmployees, "employees")
    if (filteredProjectionData.length > 0 || filteredEmployees.length > 0) {
      setfollowDataToday(filteredProjectionData);
      setEmployeeDataProjectionSummary(filteredEmployees)
    } else if (filteredProjectionData.length === 0 || filteredEmployees.length === 0) {
      setfollowDataToday(followDataTodayNew)
      setEmployeeDataProjectionSummary(employeeDataFilter)
    }
  };


  // -------------------------------------sorting projection summary-------------------------------------------
  const uniqueEnames = [
    ...new Set(
      followDataToday.flatMap((item) => [item.ename, item.bdmName, item.bdeName].filter(Boolean))
    ),
  ];

  console.log("uniqueEnames", uniqueEnames)

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
    //console.log(newSortType);
    setSortTypeExpectedPayment(newSortType);
  };
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

  console.log("soretdData", sortedData)
  //------------------------projection table open functions--------------------------------------------------
  const functionCompleteProjectionTable = () => {
    setCompleteProjectionTable(true);
  };

  const closeCompleteProjectionTable = () => {
    setCompleteProjectionTable(false);
  };

  const functionOpenProjectionTable = (ename) => {
    setProjectionEname(ename);
    //console.log("Ename:", ename)
    setopenProjectionTable(true);
    const projectedData = followData.filter((obj) => obj.ename === ename || obj.bdeName === ename || obj.bdmName === ename);
    //console.log("projected", projectedData);
    const projectedDataDateRange = followDataToday.filter(
      (obj) => obj.ename === ename || obj.bdeName === ename || obj.bdmName === ename
    );
    const projectedDataToday = followDataToday.filter(
      (obj) => obj.ename === ename || obj.bdeName === ename || obj.bdmName === ename
    );
    //console.log(projectedDataDateRange)
    setProjectedEmployee(projectedData);
    setProjectedDataDateRange(projectedDataDateRange);
    setprojectedDataToday(projectedDataToday);
  };
  const closeProjectionTable = () => {
    setopenProjectionTable(false);
  };

  // --------------------------------fucntion for history projection table--------------------------------
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

  const closeProjectionHistoryTable = () => {
    setopenProjectionHistoryTable(false);
    setopenProjectionTable(true);
  };

  //----------------------------csv exporting functions------------------------------------------

  const exportData = async () => {
    const sendingData = followData.filter((company) => {
      // Assuming you want to filter companies with an estimated payment date for today
      const today = new Date().toISOString().split("T")[0]; // Get today's date in the format 'YYYY-MM-DD'
      return company.estPaymentDate === today;
    });
    // console.log("kuchbhi" , sendingData)
    try {
      const response = await axios.post(
        `${secretKey}/projection/followdataexport/`,
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

  // Today's Projection :
  const [todaysProjection, setTodaysProjection] = useState([]);
  const [sortedTodaysProjection, setSortedTodaysProjection] = useState([]);
  const [isDateSelected, setIsDateSelected] = useState("false");
  const [sortTodaysProjection, setSortTodaysProjection] = useState({
    noOfCompany: "none",
    noOfServiceOffered: "none",
    offeredPrice: "none",
    expectedCollection: "none"
  });

  // fetch today's projection
  const fetchTodaysProjection = async () => {
    try {
      const response = await axios.get(`${secretKey}/employee/showTodaysProjection`);
      // console.log("Today's projection is :", response.data.data);
      setTodaysProjection(response.data.data);
    } catch (error) {
      console.log("Error to fetch today's projection :", error);
    }
  };

  // Functions for Filtering and Sorting :
  const handleSortCompanies = (type) => {
    let sortedData = todaysProjection;
    if (type === "ascending") {
      const ascendingSort = sortedData.sort((a, b) => a.noOfCompany - b.noOfCompany);
      // console.log("Ascending sort in company :", ascendingSort);
    } else if (type === "descending") {
      const descendingSort = sortedData.sort((a, b) => b.noOfCompany - a.noOfCompany);
      // console.log("Descending sort in company :", descendingSort);
    } else if (type === "none") {
      const data = sortedData;
      // console.log("Without sort in company :", data);
    }
    setSortedTodaysProjection(sortedData);
  };

  const handleSortServices = (type) => {
    let sortedData = todaysProjection;
    if (type === "ascending") {
      const ascendingSort = sortedData.sort((a, b) => a.noOfServiceOffered - b.noOfServiceOffered);
      // console.log("Ascending sort in services :", ascendingSort);
    } else if (type === "descending") {
      const descendingSort = sortedData.sort((a, b) => b.noOfServiceOffered - a.noOfServiceOffered);
      // console.log("Descending sort in service :", descendingSort);
    } else if (type === "none") {
      const data = sortedData;
      // console.log("Without sort in service :", data);
    }
    setSortedTodaysProjection(sortedData);
  };

  const handleSortOfferedPrice = (type) => {
    let sortedData = todaysProjection;
    if (type === "ascending") {
      const ascendingSort = sortedData.sort((a, b) => a.totalOfferedPrice - b.totalOfferedPrice);
      // console.log("Ascending sort in offered price :", ascendingSort);
    } else if (type === "descending") {
      const descendingSort = sortedData.sort((a, b) => b.totalOfferedPrice - a.totalOfferedPrice);
      // console.log("Descending sort in offered price :", descendingSort);
    } else if (type === "none") {
      const data = sortedData;
      // console.log("Without sort in offered price :", data);
    }
    setSortedTodaysProjection(sortedData);
  };

  const handleSortExpectedCollection = (type) => {
    let sortedData = todaysProjection;
    if (type === "ascending") {
      const ascendingSort = sortedData.sort((a, b) => a.totalCollectionExpected - b.totalCollectionExpected);
      // console.log("Ascending sort in expected collection :", ascendingSort);
    } else if (type === "descending") {
      const descendingSort = sortedData.sort((a, b) => b.totalCollectionExpected - a.totalCollectionExpected);
      // console.log("Descending sort in expected collection :", descendingSort);
    } else if (type === "none") {
      const data = sortedData;
      // console.log("Without sort in expected collection :", data);
    }
    setSortedTodaysProjection(sortedData);
  };

  const handleDateFilter = () => {

  };


  const handleNameFilter = (selectedEmpName) => {
    console.log("Selected name is :", selectedEmpName);
    const filteredTodayProjectionWithEmpName = todaysProjection.filter((item) => item.empName.to === selectedEmpName.includes().toString());
    console.log("Today's projection filter by using employee name :", filteredTodayProjectionWithEmpName);
    if (filteredTodayProjectionWithEmpName.length > 0) {
      setSortedTodaysProjection(filteredTodayProjectionWithEmpName);
    } else {
      setSortedTodaysProjection(todaysProjection)
    }
  };

  // Deleting today's projection :
  const handleDeleteTodaysProjection = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to remove this item?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${secretKey}/employee/deleteTodaysProjection/${id}`)
          console.log("Data successfully deleted :", response.data.data);
          Swal.fire("Success!", "Data Successfully Deleted!", "success");
          fetchTodaysProjection();
        } catch (error) {
          console.error("Error deleting today's projection :", error);
          Swal.fire("Error!", "Error deleting today's projection!", "error");
        }
      }
    })
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchTodaysProjection();
  }, []);

  // Sort the data when todaysProjection changes
  useEffect(() => {
    const sortedData = [...todaysProjection].sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split('/');
      const [dayB, monthB, yearB] = b.date.split('/');
      const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
      const dateB = new Date(`${yearB}-${monthB}-${dayB}`);
      return dateB - dateA;
    });
    setSortedTodaysProjection(sortedData);
  }, [todaysProjection]);

  console.log("sortedData", sortedData)
  console.log("followDataToday", followDataToday)


  return (
    <div>
      <div className="employee-dashboard"
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
              <div class="input-icon mr-1">
                <span class="input-icon-addon">
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                    <path d="M21 21l-6 -6"></path>
                  </svg>
                </span>
                <input
                  value={searchTermProjection}
                  onChange={(e) =>
                    debouncedFilterSearchProjection(e.target.value)
                  }
                  className="form-control"
                  placeholder="Enter BDE Name..."
                  type="text"
                  name="bdeName-search"
                  id="bdeName-search" />
              </div>
              <div className="date-filter">
                <LocalizationProvider dateAdapter={AdapterDayjs}  >
                  <DemoContainer components={["SingleInputDateRangeField"]} sx={{
                    padding: '0px',
                    with: '220px'
                  }}>
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
              <div>
                <FormControl sx={{ ml: 1, minWidth: 200 }}>
                  <InputLabel id="demo-select-small-label">Select Employee</InputLabel>
                  <Select
                    className="form-control my-date-picker my-mul-select form-control-sm p-0"
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    value={projectionNames}
                    onChange={(event) => {
                      setProjectionNames(event.target.value)
                      handleSelectProjectionSummary(event.target.value)
                    }}
                    input={<OutlinedInput label="Name" />}
                    MenuProps={MenuProps}
                  >
                    {options.map((name) => (
                      <MenuItem
                        key={name}
                        value={name}
                        style={getStyles(name, projectionNames, theme)}
                      >
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div id="table-default" className="row tbl-scroll">
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
                    <th>
                      Projection Status
                    </th>

                  </tr>
                </thead>
                {loading ?
                  (<tbody>
                    <tr>
                      <td colSpan="12">
                        <div className="LoaderTDSatyle">
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
                  </tbody>) :
                  (
                    <tbody>
                      {sortedData && sortedData.length !== 0 ? (
                        <>
                          {sortedData.map((obj, index) => (
                            <tr key={`row-${index}`}>
                              <td>{index + 1}</td>
                              <td>{obj}</td>
                              <td>
                                {
                                  followDataToday.filter((partObj) =>
                                    partObj.ename === obj ||
                                    partObj.bdeName === obj ||
                                    partObj.bdmName === obj
                                  ).reduce((count, partObj) => {
                                    if (partObj.caseType === "Recieved") {
                                      return count + 0.5;  // Increment by 0.5 to effectively halve the count for "Recieved"
                                    }
                                    return count + 1;  // Increment by 1 for other cases
                                  }, 0)
                                }
                                <FcDatabase
                                  onClick={() => {
                                    // Check if obj exists in any of the fields before calling the function
                                    const isObjInData = followDataToday.some(
                                      (partObj) =>
                                        partObj.ename === obj ||
                                        partObj.bdeName === obj ||
                                        partObj.bdmName === obj
                                    );

                                    if (isObjInData) {
                                      functionOpenProjectionTable(obj);
                                    }
                                  }}
                                  style={{
                                    cursor: "pointer",
                                    marginRight: "-71px",
                                    marginLeft: "58px",
                                  }}
                                />
                              </td>
                              <td>
                                {followDataToday.reduce((totalServices, partObj) => {
                                  if (
                                    partObj.ename === obj ||
                                    partObj.bdeName === obj ||
                                    partObj.bdmName === obj
                                  ) {
                                    let sumServices = partObj.offeredServices.length;
                                    if (partObj.caseType === "Recieved") {
                                      sumServices /= 2
                                    }
                                    totalServices += sumServices;
                                  }
                                  return totalServices;
                                }, 0)}
                              </td>
                              <td>
                                {followDataToday
                                  .reduce((totalOfferedPrize, partObj) => {
                                    if (partObj.ename === obj ||
                                      partObj.bdeName === obj ||
                                      partObj.bdmName === obj
                                    ) {
                                      let prize = partObj.offeredPrize;

                                      // If caseType is "Recieved", divide the prize by 2
                                      if (partObj.caseType === "Recieved") {
                                        prize /= 2;
                                      }

                                      totalOfferedPrize += prize;
                                    }
                                    return totalOfferedPrize;
                                  }, 0)
                                  .toLocaleString("en-IN", numberFormatOptions)}
                              </td>
                              <td>
                                {followDataToday
                                  .reduce((totalPaymentSum, partObj) => {
                                    if (partObj.ename === obj ||
                                      partObj.bdeName === obj ||
                                      partObj.bdmName === obj
                                    ) {
                                      let prize = partObj.totalPayment;
                                      if (partObj.caseType === "Recieved") {
                                        prize /= 2
                                      }
                                      totalPaymentSum += prize;
                                    }
                                    return totalPaymentSum;
                                  }, 0)
                                  .toLocaleString("en-IN", numberFormatOptions)}
                              </td>
                              <td>
                                {/* Look up projectionStatusForToday for the employee */}
                                {
                                  followDataToday.find(partObj => partObj.ename === obj)
                                    ? followDataToday.find(partObj => partObj.ename === obj).projectionStatusForToday
                                    : "No"
                                }
                              </td>

                              {/* <td>-</td> */}
                            </tr>
                          ))}
                          {/* Map employeeData with default fields */}
                          {employeeDataProjectionSummary
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
                                <td>
                                  {employee.projectionStatusForToday ? employee.projectionStatusForToday : "No"}
                                </td>
                                {/* <td>0</td> */}
                              </tr>
                            ))}
                        </>
                      ) : (
                        employeeDataProjectionSummary
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
                              <td>
                                {employee.projectionStatusForToday ? employee.projectionStatusForToday : "No"}
                              </td>
                            </tr>

                          ))
                      )}
                    </tbody>
                  )}
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
                    <td>-</td>
                    {/* <td>0</td> */}
                  </tr>
                </tfoot>
                {((sortedData && !loading && sortedData.length === 0) && employeeData.length === 0) && (
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


        {/* Today's Collection */}
        <div className="card mt-2">
          <div className="card-header p-1 employeedashboard d-flex align-items-center justify-content-between">
            <div className="dashboard-title pl-1"  >
              <h2 className="m-0">
                Today's Projection
              </h2>
            </div>
            <div className="d-flex align-items-center pr-1">
              <div className="date-filter">
                <LocalizationProvider dateAdapter={AdapterDayjs}  >
                  <DemoContainer components={["SingleInputDateRangeField"]} sx={{
                    padding: '0px',
                    with: '220px'
                  }}>
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
                      calendars={1}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
              <div>
                <FormControl sx={{ ml: 1, minWidth: 200 }}>
                  <InputLabel id="demo-select-small-label">Select Employee</InputLabel>
                  <Select
                    className="form-control my-date-picker my-mul-select form-control-sm p-0"
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    value={projectionNames}
                    onChange={(event) => {
                      setProjectionNames(event.target.value)
                      handleNameFilter(event.target.value)
                    }}
                    input={<OutlinedInput label="Name" />}
                    MenuProps={MenuProps}
                  >
                    {options.map((name) => (
                      <MenuItem
                        key={name}
                        value={name}
                        style={getStyles(name, projectionNames, theme)}
                      >
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div id="table-default" className="row tbl-scroll">
              <table className="table-vcenter table-nowrap admin-dash-tbl"  >
                <thead className="admin-dash-tbl-thead">
                  <tr>
                    <th>
                      Sr. No
                    </th>
                    <th>Employee Name</th>
                    <th>
                      No. Of Companies
                      <SwapVertIcon
                        style={{
                          height: "15px",
                          width: "15px",
                          cursor: "pointer",
                          marginLeft: "4px",
                        }}
                        onClick={(e) => {
                          let updatedSortType;
                          if (sortTodaysProjection.noOfCompany === "ascending") {
                            updatedSortType = "descending";
                          } else if (sortTodaysProjection.noOfCompany === "descending") {
                            updatedSortType = "none";
                          } else {
                            updatedSortType = "ascending";
                          }
                          setSortTodaysProjection((prev) => ({
                            ...prev,
                            noOfCompany: updatedSortType
                          }))
                          handleSortCompanies(updatedSortType);
                        }}
                      />
                    </th>
                    <th>
                      Services Offered
                      <SwapVertIcon
                        style={{
                          height: "15px",
                          width: "15px",
                          cursor: "pointer",
                          marginLeft: "4px",
                        }}
                        onClick={(e) => {
                          let updatedSortType;
                          if (sortTodaysProjection.noOfServiceOffered === "ascending") {
                            updatedSortType = "descending";
                          } else if (sortTodaysProjection.noOfServiceOffered === "descending") {
                            updatedSortType = "none";
                          } else {
                            updatedSortType = "ascending";
                          }
                          setSortTodaysProjection((prev) => ({
                            ...prev,
                            noOfServiceOffered: updatedSortType
                          }))
                          handleSortServices(updatedSortType);
                        }}
                      />
                    </th>
                    <th>
                      Offered Price
                      <SwapVertIcon
                        style={{
                          height: "15px",
                          width: "15px",
                          cursor: "pointer",
                          marginLeft: "4px",
                        }}
                        onClick={(e) => {
                          let updatedSortType;
                          if (sortTodaysProjection.offeredPrice === "ascending") {
                            updatedSortType = "descending";
                          } else if (sortTodaysProjection.offeredPrice === "descending") {
                            updatedSortType = "none";
                          } else {
                            updatedSortType = "ascending";
                          }
                          setSortTodaysProjection((prev) => ({
                            ...prev,
                            offeredPrice: updatedSortType
                          }))
                          handleSortOfferedPrice(updatedSortType);
                        }}
                      />
                    </th>
                    <th>
                      Expected Collection
                      <SwapVertIcon
                        style={{
                          height: "15px",
                          width: "15px",
                          cursor: "pointer",
                          marginLeft: "4px",
                        }}
                        onClick={(e) => {
                          let updatedSortType;
                          if (sortTodaysProjection.expectedCollection === "ascending") {
                            updatedSortType = "descending";
                          } else if (sortTodaysProjection.expectedCollection === "descending") {
                            updatedSortType = "none";
                          } else {
                            updatedSortType = "ascending";
                          }
                          setSortTodaysProjection((prev) => ({
                            ...prev,
                            expectedCollection: updatedSortType
                          }))
                          handleSortExpectedCollection(updatedSortType);
                        }}
                      />
                    </th>
                    <th>Action</th>

                  </tr>
                </thead>
                {loading ? (
                  <tbody>
                    <tr>
                      <td colSpan="12">
                        <div className="LoaderTDSatyle">
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
                    {todaysProjection && todaysProjection.length !== 0 ? (
                      todaysProjection.map((obj, index) => (
                        <tr key={`row-${index}`}>
                          <td>{index + 1}</td>
                          <td>{obj.empName}</td>
                          <td>{obj.noOfCompany}</td>
                          <td>{obj.noOfServiceOffered}</td>
                          <td>{obj.totalOfferedPrice.toLocaleString("en-IN", numberFormatOptions)}</td>
                          <td>{obj.totalCollectionExpected.toLocaleString("en-IN", numberFormatOptions)}</td>
                          <td>
                            <div className="d-flex justify-content-center align-items-center">
                              <div className="icons-btn">
                                <IconButton
                                  onClick={() => handleDeleteTodaysProjection(obj._id)}
                                >
                                  <IconTrash
                                    style={{
                                      cursor: "pointer",
                                      color: "red",
                                      width: "14px",
                                      height: "14px",
                                    }}
                                  />
                                </IconButton>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="particular" colSpan={9}>
                          <Nodata />
                        </td>
                      </tr>
                    )}
                  </tbody>
                )}
                <tfoot className="admin-dash-tbl-tfoot"    >
                  <tr style={{ fontWeight: 500 }}>
                    <td colSpan="1">
                      Total
                    </td>
                    <td>
                      {
                        todaysProjection.filter((partObj) => partObj.empName).length
                      }
                    </td>
                    <td>
                      {todaysProjection.reduce(
                        (noOfCompany, partObj) => {
                          noOfCompany += partObj.noOfCompany;
                          return noOfCompany;
                        },
                        0
                      )}
                    </td>
                    <td>
                      {todaysProjection
                        .reduce((offeredServices, partObj) => {
                          offeredServices += partObj.noOfServiceOffered;
                          return offeredServices;
                        }, 0
                        )}
                    </td>
                    <td>
                      {todaysProjection
                        .reduce((offeredPrice, partObj) => {
                          offeredPrice += partObj.totalOfferedPrice;
                          return offeredPrice;
                        }, 0).toLocaleString("en-IN", numberFormatOptions)}
                    </td>
                    <td>
                      {todaysProjection
                        .reduce((expectedPrice, partObj) => {
                          expectedPrice += partObj.totalCollectionExpected;
                          return expectedPrice;
                        }, 0).toLocaleString("en-IN", numberFormatOptions)}
                    </td>
                    <td>-</td>
                  </tr>
                </tfoot>

              </table>
            </div>
          </div>
        </div>
      </div>

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
                  <th>BDM Name</th>
                  <th>Company Name</th>
                  <th>Offered Services</th>
                  <th>Total Offered Price</th>
                  <th>Expected Amount</th>
                  <th>Estimated Payment Date</th>
                  <th>Last Follow Up Date</th>
                  <th>Remarks</th>
                  <th>View History</th>
                  <th>BDM Forwarded Case</th>
                </tr>
              </thead>
              <tbody>

                {/* Map through uniqueEnames array to render rows */}
                {projectedDataToday && projectedDataToday.length > 0
                  ?

                  projectedDataToday.map((obj, Index) => (
                    <tr key={`sub-row-${Index}`}>
                      <td style={{ lineHeight: "32px" }}>{Index + 1}</td>
                      {/* Render other employee data */}
                      <td>{obj.caseType === "Recieved" ? obj.bdeName || obj.ename : obj.ename}</td>
                      <td>{obj.caseType === "Recieved" ? obj.bdmName || obj.bdeName : obj.ename}</td>
                      <td>{obj.companyName}</td>
                      <td>{obj.offeredServices.join(",")}</td>
                      <td>
                        {obj.caseType === "Recieved" ?
                          ((obj.offeredPrize) / 2).toLocaleString(
                            "en-IN",
                            numberFormatOptions
                          ) :
                          obj.offeredPrize.toLocaleString(
                            "en-IN",
                            numberFormatOptions
                          )}
                      </td>
                      <td>
                        {/* {obj.totalPayment.toLocaleString(
                          "en-IN",
                          numberFormatOptions
                        )} */}
                        {obj.caseType === "Recieved" ?
                          ((obj.totalPayment) / 2).toLocaleString(
                            "en-IN",
                            numberFormatOptions
                          ) :
                          obj.totalPayment.toLocaleString(
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
                      <td>{obj.caseType === "Recieved" ? "Yes" : "No"}</td>
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
                    <td style={{ lineHeight: "32px" }} colSpan="3">
                      Total
                    </td>
                    <td>{projectedDataToday.length}</td>
                    <td>
                      {projectedDataToday.reduce(
                        (totalServices, partObj) => {
                          totalServices += partObj.offeredServices.length;
                          return totalServices;
                        },
                        0
                      )}
                    </td>
                    <td>
                      &#8377;

                      {projectedDataToday.reduce((totalTotalPayment, partObj) => {
                        // Check if caseType is "Received" and halve the totalPayment if true
                        const payment = partObj.caseType === "Recieved" ? partObj.offeredPrize / 2 : partObj.offeredPrize;

                        // Add the payment to the total
                        return totalTotalPayment + payment;
                      }, 0)}
                    </td>
                    {/* <td>
                      &#8377;
                      {projectedDataToday.reduce(
                        (totalTotalPayment, partObj) => {
                          return totalTotalPayment + partObj.totalPayment;
                        },
                        0
                      )}
                     
                    </td> */}
                    <td>
                      &#8377;
                      {projectedDataToday.reduce((totalTotalPayment, partObj) => {
                        // Check if caseType is "Received" and halve the totalPayment if true
                        const payment = partObj.caseType === "Recieved" ? partObj.totalPayment / 2 : partObj.totalPayment;

                        // Add the payment to the total
                        return totalTotalPayment + payment;
                      }, 0)}
                    </td>

                    <td>-</td>
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
  )
}

export default EmployeesProjectionSummary