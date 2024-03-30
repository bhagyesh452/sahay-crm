import React, { useEffect, useState, CSSProperties, useRef } from "react";
import Header from "../components/Header";
import EmpNav from "./EmpNav";
import axios from "axios";
import { useParams } from "react-router-dom";
import { options } from "../components/Options.js";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import { FaRegCalendar } from "react-icons/fa";
import { Drawer, IconButton } from "@mui/material";
import Swal from "sweetalert2";
import Select from "react-select";
import EditIcon from "@mui/icons-material/Edit";
import { CiSearch } from "react-icons/ci";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ScaleLoader from "react-spinners/ScaleLoader";
import ClipLoader from "react-spinners/ClipLoader";
import AddCircle from "@mui/icons-material/AddCircle.js";
import io from "socket.io-client";
// import { ColorRing } from 'react-loader-spinner'
import Nodata from "../components/Nodata";
import { RiEditCircleFill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";


function EmployeeDashboard() {
  const { userId } = useParams();
  const [data, setData] = useState([]);
  const [isEditProjection, setIsEditProjection] = useState(false);
  const [projectingCompany, setProjectingCompany] = useState("");
  const [showBookingDate, setShowBookingDate] = useState(false)
  const [startDateAnother, setStartDateAnother] = useState(new Date());
  const [endDateAnother, setEndDateAnother] = useState(new Date());
  const [startDateTotalSummary, setStartDateTotalSummary] = useState(new Date());
  const [endDateTotalSummary, setEndDateTotalSummary] = useState(new Date());
  const [openProjection, setOpenProjection] = useState(false);
  const [socketID, setSocketID] = useState("");
  const [totalBooking, setTotalBooking] = useState([]);
  //const [uniqueArray, setuniqueArray] = useState([])
  const [filteredBooking, setFilteredBooking] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true);
  const [uniqueArrayLoading, setuniqueArrayLoading] = useState(false)
  const [projectionLoading, setprojectionLoading] = useState(false)
  const [currentProjection, setCurrentProjection] = useState({
    companyName: "",
    ename: "",
    offeredPrize: 0,
    offeredServices: [],
    lastFollowUpdate: "",
    estPaymentDate: "",
    date: "",
    time: "",
  });
  const [empData, setEmpData] = useState([]);
  const [followData, setFollowData] = useState([]);
  const [followDataFilter, setFollowDataFilter] = useState([]);
  const [displayDateRange, setDateRangeDisplay] = useState(false);
  const [buttonToggle, setButtonToggle] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filteredDataDateRange, setFilteredDataDateRange] = useState([]);
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
    totalLeads: 'ascending'
  });
  const [incoFilter, setIncoFilter] = useState("");
  const dateRangePickerRef = useRef(null);
  const dateRangePickerProhectionRef = useRef(null);
  const dateRangePickerProhectionSummaryRef = useRef(null);



  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const convertedDate = date.toLocaleDateString();
    return convertedDate;
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(`${secretKey}/einfo`);
      // Set the retrieved data in the state
      const tempData = response.data;
      const userData = tempData.find((item) => item._id === userId);

      setData(userData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const [tempData, setTempData] = useState([])
  const [loadingNew, setLoadingNew] = useState([])

// -------------------------api for contact number-------------------------------------------------------

  const fetchNewData = async () => {
    try {
      const response = await axios.get(`${secretKey}/employees/${data.ename}`);
      const tempData = response.data;
      setTempData(tempData);
    } catch (error) {
      console.error("Error fetching new data:", error);
    }
  };

  useEffect(() => {
    fetchNewData()
  }, [data])

  console.log("tempData" , tempData)


  //console.log(data)



  // const fetchEmployeeData = async () => {
  //   try {
  //     //setuniqueArrayLoading(true);
  //     const response = await fetch(`${secretKey}/edata-particular/${data.ename}`);
  //     const data = await response.json();
  //     setEmpData(data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     //setuniqueArrayLoading(false);
  //   }
  //   console.log("empData", empData);
  // };

  const fetchEmployeeData = async () => {
    setLoading(true)
    fetch(`${secretKey}/edata-particular/${data.ename}`)
      .then((response) => response.json())
      .then((data) => {
        setEmpData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
  };
  //console.log("empData", empData)

  // const fetchEmployeeData = async () => {
  //   try {
  //     const response = await fetch(`${secretKey}/edata-particular/${data.ename}`);
  //     const data = await response.json();
  //     setEmpData(data);
  //     setLoading(false); // Set loading to false when data is fetched
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     setLoading(false); // Also set loading to false in case of error
  //   }
  // };

 // const tableEmployee = data.ename;
  useEffect(() => {
    fetchData();
  }, []);


  useEffect(() => {
    setLoading(true);
    //setuniqueArrayLoading(true) // Set loading to true when useEffect is triggered
    fetchEmployeeData().then(() => setLoading(false)); // Set loading to false after data is fetched
  }, [data]);

  const formattedDates =
    empData.length !== 0 &&
    empData.map((data) => formatDate(data.AssignDate));
  //console.log("Formatted Dates", formattedDates);
  const uniqueArray = formattedDates && [...new Set(formattedDates)];

  // ---------------------------Bookings Part --------------------------------------

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        //setuniqueArrayLoading(true)// Set loading to true before fetching
        const response = await axios.get(`${secretKey}/company-ename/${data.ename}`);
        setTotalBooking(response.data);
        setFilteredBooking(response.data);
      } catch (error) {
        console.error("Error fetching company details:", error.message);
      } finally {
        setLoading(false);
        //setuniqueArrayLoading(false)// Set loading to false after fetching, regardless of success or failure
      }
    };

    fetchBookingDetails();
  }, [data.ename]);


  //console.log("filteredBookings", filteredBooking)

  const handleCloseIconClickAnother = () => {
    if (showBookingDate) {
      setShowBookingDate(false)
    }
  }

  const handleClickOutside = (event) => {
    if (dateRangePickerRef.current && !dateRangePickerRef.current.contains(event.target)) {
      setShowBookingDate(false);
    }
  };

  // Add event listener when the component mounts
  useEffect(() => {
    const totalBookingElement = document.getElementById('bookingdashboard');
    if (totalBookingElement) {
      totalBookingElement.addEventListener('click', handleClickOutside);
      // Remove event listener when the component unmounts
      return () => {
        totalBookingElement.removeEventListener('click', handleClickOutside);
      };

    }

  }, []);

  const handleClickOutsideProjectionSummary = (event) => {
    if (dateRangePickerProhectionSummaryRef.current && !dateRangePickerProhectionSummaryRef.current.contains(event.target)) {
      setdateRangeTotalSummary(false);
    }
  };

  // Add event listener when the component mounts
  useEffect(() => {
    const totalBookingElement = document.getElementById('projectiontotalsummary');
    if (totalBookingElement) {
      totalBookingElement.addEventListener('click', handleClickOutsideProjectionSummary);
      // Remove event listener when the component unmounts
      return () => {
        totalBookingElement.removeEventListener('click', handleClickOutsideProjectionSummary);
      };

    }

  }, []);

  useEffect(() => {
    const totalBookingElement = document.getElementById('bookingdashboard');
    if (totalBookingElement) {
      totalBookingElement.addEventListener('click', handleClickOutside);
      // Remove event listener when the component unmounts
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


  useEffect(() => {
    const socket = io('/socket.io');
    socket.on("connect", () => {
      console.log("Socket connected with ID:", socket.id);
      setSocketID(socket.id);
    });

    return () => {
      socket.disconnect();

    };
  }, []);
  const activeStatus = async () => {
    if (data._id && socketID) {
      try {

        const id = data._id;
        const response = await axios.put(`${secretKey}/online-status/${id}/${socketID}`);
        //console.log(response.data); // Log response for debugging
        return response.data; // Return response data if needed
      } catch (error) {
        console.error('Error:', error);
        throw error; // Throw error for handling in the caller function
      }
    }
  };
  useEffect(() => {
    const timerId = setTimeout(() => {
      activeStatus();
    }, 2000);

    return () => {
      clearTimeout(timerId);
    };
  }, [socketID]);

  const selectionRangeAnother = {
    startDate: startDateAnother,
    endDate: endDateAnother,
    key: "selection",
  };
  const handleSelectAnother = (date) => {
    const filteredDataDateRange = totalBooking.filter((product) => {
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

  // ---------------------------projectiondata-------------------------------------

  const [followDataToday, setfollowDataToday] = useState([])
  const [followDataTodayFilter, setfollowDataTodayFilter] = useState([])

  const fetchFollowUpData = async () => {
    try {
      setprojectionLoading(true);
      const response = await fetch(
        `${secretKey}/projection-data/${data.ename}`
      );
      const followdata = await response.json();
      setFollowData(followdata);
      setFollowDataFilter(followdata);
      setfollowDataToday(
        followdata.filter((company) => {
          // Assuming you want to filter companies with an estimated payment date for today
          const today = new Date().toISOString().split("T")[0]; // Get today's date in the format 'YYYY-MM-DD'
          return company.estPaymentDate === today;
        })
      );
      setfollowDataTodayFilter(
        followdata.filter((company) => {
          // Assuming you want to filter companies with an estimated payment date for today
          const today = new Date().toISOString().split("T")[0]; // Get today's date in the format 'YYYY-MM-DD'
          return company.estPaymentDate === today;
        })
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      return { error: "Error fetching data" };
    } finally {
      setprojectionLoading(false);
    }
  };

  console.log("ajki", followDataToday)


  // console.log(followData);

  function calculateSum(data) {
    const initialValue = {
      totalPaymentSum: 0,
      offeredPaymentSum: 0,
      offeredServices: [],
    };

    const sum = data.reduce((accumulator, currentValue) => {
      // Concatenate offeredServices from each object into a single array
      const offeredServices = accumulator.offeredServices.concat(
        currentValue.offeredServices
      );

      return {
        totalPaymentSum:
          accumulator.totalPaymentSum + currentValue.totalPayment,
        offeredPaymentSum:
          accumulator.offeredPaymentSum + currentValue.offeredPrize,
        offeredServices: offeredServices,
      };
    }, initialValue);

    // // Remove duplicate services from the array
    // sum.offeredServices = Array.from(new Set(sum.offeredServices));

    return sum;
  }

  // Calculate the sums
  const { totalPaymentSum, offeredPaymentSum, offeredServices } =
    calculateSum(followDataFilter);

  //console.log(totalPaymentSum , offeredPaymentSum , offeredServices)

  useEffect(() => {
    fetchFollowUpData();
  }, [data]);

  const functionopenprojection = (comName) => {
    setProjectingCompany(comName);
    setOpenProjection(true);
    const findOneprojection =
      followData.length !== 0 &&
      followData.find((item) => item.companyName === comName);
    if (findOneprojection) {
      setCurrentProjection({
        companyName: findOneprojection.companyName,
        ename: findOneprojection.ename,
        offeredPrize: findOneprojection.offeredPrize,
        offeredServices: findOneprojection.offeredServices,
        lastFollowUpdate: findOneprojection.lastFollowUpdate,
        estPaymentDate: findOneprojection.estPaymentDate,
        totalPayment: findOneprojection.totalPayment,
        remarks: findOneprojection.remarks,
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
      lastFollowUpdate: "",
      date: "",
      time: "",
    });
    setIsEditProjection(false);
    setSelectedValues([]);
  };

  console.log("currentprojection" , currentProjection)

  const handleProjectionSubmit = async () => {
    try {
      const finalData = {
        ...currentProjection,
        companyName: projectingCompany,
        ename: data.ename,
        offeredServices: selectedValues,
      };
      //console.log(Number(finalData.totalPayment) , Number(finalData.offeredPrize))
      if (finalData.offeredServices.length === 0) {
        Swal.fire({ title: "Services is required!", icon: "warning" });
      } else if (finalData.remarks === "") {
        Swal.fire({ title: 'Remarks is required!', icon: 'warning' });
      } else if (Number(finalData.totalPayment) === 0) {
        Swal.fire({ title: "Total Payment Can't be 0!", icon: 'warning' });
      } else if (finalData.totalPayment === "") {
        Swal.fire({ title: "Total Payment Can't be 0", icon: 'warning' });
      } else if (finalData.offeredPrize === "") {
        Swal.fire({ title: "Offred Price Can't be 0", icon: 'warning' });
      }else if (Number(finalData.offeredPrize) === 0) {
        Swal.fire({ title: 'Offered Prize is required!', icon: 'warning' });
      } else if (Number(finalData.totalPayment) > Number(finalData.offeredPrize)) {
        Swal.fire({ title: 'Total Payment cannot be greater than Offered Prize!', icon: 'warning' });
      } else if (finalData.lastFollowpdate === null) {
        Swal.fire({
          title: "Last FollowUp Date is required!",
          icon: "warning",
        });
      } else if (finalData.estPaymentDate === 0) {
        Swal.fire({
          title: "Estimated Payment Date is required!",
          icon: "warning",
        });
      }else{
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
          totalPaymentError:"",
          totalPayment:0
        });
        fetchFollowUpData();
      }

      // Send data to backend API
      
      // Log success message
    } catch (error) {
      console.error("Error updating or adding data:", error.message);
    }
  };

  // -------------------------------date-range-picker-------------------------------------------

  const [dateRangeTotalSummary, setdateRangeTotalSummary] = useState(false)

  const handleIconClick = () => {
    if (!buttonToggle) {
      setDateRangeDisplay(true);
    } else {
      setDateRangeDisplay(false);
    }
    setButtonToggle(!buttonToggle);
  };

  const handleIconClickTotalSummary = () => {
    if (!buttonToggle) {
      setdateRangeTotalSummary(true);
    } else {
      setdateRangeTotalSummary(false);
    }
    setButtonToggle(!buttonToggle);
  };

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  const selectionRangeTotalSummary = {
    startDate: startDateTotalSummary,
    endDate: endDateTotalSummary,
    key: "selection",
  };

  const handleSelect = (date) => {
    const filteredDataDateRange = followData.filter((product) => {
      const productDate = new Date(product["estPaymentDate"]);

      if (
        formatDate(date.selection.startDate) ===
        formatDate(date.selection.endDate)
      ) {
        return formatDate(productDate) == formatDate(date.selection.startDate);
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
    //console.log(filteredDataDateRange);
  };

  const handleSelectTotalSummary = (date) => {
    const filteredDataDateRange = followData.filter((product) => {
      const productDate = new Date(product["estPaymentDate"]);
      //console.log("productdate", productDate)

      if (
        formatDate(date.selection.startDate) ===
        formatDate(date.selection.endDate)
      ) {
        return formatDate(productDate) == formatDate(date.selection.startDate);
      } else {
        return (
          productDate >= date.selection.startDate &&
          productDate <= date.selection.endDate
        );
      }
    });
    setStartDateTotalSummary(date.selection.startDate);
    setEndDateTotalSummary(date.selection.endDate);
    setFollowDataFilter(filteredDataDateRange);
    //console.log(filteredDataDateRange);
  };
  //console.log(startDateTotalSummary)
  //console.log(endDateTotalSummary)


  // function calculateSumFilter(data) {
  //   const initialValue = {
  //     totalPaymentSumFilter: 0,
  //     offeredPaymentSumFilter: 0,
  //     offeredServicesFilter: [],
  //   };

  //   const sum = data.reduce((accumulator, currentValue) => {
  //     // Concatenate offeredServices from each object into a single array
  //     const offeredServices = accumulator.offeredServicesFilter.concat(
  //       currentValue.offeredServices
  //     );

  //     return {
  //       totalPaymentSumFilter:
  //         accumulator.totalPaymentSumFilter + currentValue.totalPayment,
  //       offeredPaymentSumFilter:
  //         accumulator.offeredPaymentSumFilter + currentValue.offeredPrize,
  //       offeredServicesFilter: offeredServices,
  //     };
  //   }, initialValue);

  //   // // Remove duplicate services from the array
  //   // sum.offeredServices = Array.from(new Set(sum.offeredServices));

  //   return sum;
  // }

  // // Calculate the sums
  // const {
  //   totalPaymentSumFilter,
  //   offeredPaymentSumFilter,
  //   offeredServicesFilter,
  // } = calculateSumFilter(filteredDataDateRange);


  function calculateSumFilter(data) {
    const initialValue = {
      totalPaymentSumFilter: 0,
      offeredPaymentSumFilter: 0,
      offeredServicesFilter: [],
    };

    const sum = data.reduce((accumulator, currentValue) => {
      // Concatenate offeredServices from each object into a single array
      const offeredServices = accumulator.offeredServicesFilter.concat(
        currentValue.offeredServices
      );

      return {
        totalPaymentSumFilter:
          accumulator.totalPaymentSumFilter + currentValue.totalPayment,
        offeredPaymentSumFilter:
          accumulator.offeredPaymentSumFilter + currentValue.offeredPrize,
        offeredServicesFilter: offeredServices,
      };
    }, initialValue);

    // // Remove duplicate services from the array
    // sum.offeredServices = Array.from(new Set(sum.offeredServices));

    return sum;
  }

  // Calculate the sums
  const {
    totalPaymentSumFilter,
    offeredPaymentSumFilter,
    offeredServicesFilter,
  } = calculateSumFilter(followDataTodayFilter);


  //console.log("follow data:", currentProjection);
  // -----------------------------------------------------general-search--------------------------------------------

  // function filterSearch(searchTerm) {
  //   setSearchTerm(searchTerm);
  //   setFilteredDataDateRange(followData.filter(company =>
  //     company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     company.offeredServices.some(service =>
  //       service.toLowerCase().includes(searchTerm.toLowerCase())
  //     ) ||
  //     company.totalPayment.toString() === searchTerm ||
  //     company.offeredPrize.toString() === searchTerm ||
  //     company.estPaymentDate.includes(searchTerm)

  //   ));
  // }


  function filterSearch(searchTerm) {
    setSearchTerm(searchTerm);
    setfollowDataTodayFilter(followDataToday.filter(company =>
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.offeredServices.some(service =>
        service.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      company.totalPayment.toString() === searchTerm ||
      company.offeredPrize.toString() === searchTerm ||
      company.estPaymentDate.includes(searchTerm)

    ));
  }


  const [searchTermTotalSummary, setsearchTermTotalSummary] = useState("")

  //console.log(followDataFilter)
  //console.log(followData)

  function filterSearchTotalSummary(searchTermTotalSummary) {
    setsearchTermTotalSummary(searchTermTotalSummary);
    //console.log(searchTermTotalSummary)
    setFollowDataFilter(followData.filter(company =>
      company.companyName.toLowerCase().includes(searchTermTotalSummary.toLowerCase()) ||
      company.offeredServices.some(service =>
        service.toLowerCase().includes(searchTermTotalSummary.toLowerCase())
      ) ||
      company.totalPayment.toString() === searchTermTotalSummary ||
      company.offeredPrize.toString() === searchTermTotalSummary ||
      company.estPaymentDate.includes(searchTermTotalSummary)
    ));
  }

  //console.log(filteredDataDateRange)
  const [newSearchTerm, setNewSearchTerm] = useState("")

  function filterSearchBooking(newSearchTerm) {
    setNewSearchTerm(newSearchTerm)
    setFilteredBooking(totalBooking.filter(company =>
      company.companyName.toLowerCase().includes(newSearchTerm.toLowerCase()) ||
      company.contactNumber.toString() === newSearchTerm ||
      company.companyEmail.toLowerCase().includes(newSearchTerm.toLowerCase()) ||
      company.services.some(service =>
        service.toLowerCase().includes(newSearchTerm.toLowerCase())) ||
      company.totalPayment.toString() === newSearchTerm ||
      //(company.firstPayment ? company.firstPayment.toString() : company.totalPayment.toString()) === newSearchTerm
      company.bdmName.toLowerCase().includes(newSearchTerm.toLowerCase()) ||
      new Date(company.bookingDate).toLocaleDateString().includes(newSearchTerm)
    ))
  }

  //  -----------------------------------sorting- your -dashboard-----------------------------------

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
        //console.log("ascending is working")
        empData.forEach((company) => {
          if (company.Status === "Untouched") {
            untouchedCountAscending[company.AssignDate] = (untouchedCountAscending[company.AssignDate] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses
        empData.sort((a, b) => {
          const countA = untouchedCountAscending[a.AssignDate] || 0;
          const countB = untouchedCountAscending[b.AssignDate] || 0;
          return countA - countB; // Sort in ascending order of "Untouched" count
        });
        break;

      case "descending":
        setIncoFilter("descending");
        const untouchedCount = {};
        //console.log("descending is working")
        empData.forEach((company) => {
          if ((company.Status === "Untouched")
          ) {
            untouchedCount[company.AssignDate] = (untouchedCount[company.AssignDate] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses
        empData.sort((a, b) => {
          const countA = untouchedCount[a.AssignDate] || 0;
          const countB = untouchedCount[b.AssignDate] || 0;
          return countB - countA; // Sort in descending order of "Untouched" count
        });
        break;

      case "none":
        setIncoFilter("none");

        break;

      default:
        break;

    }
  };

  const handleSortBusy = (sortBy1) => {
    setSortType(prevData => ({
      ...prevData,
      busy: prevData.busy === "ascending"
        ? "descending"
        : prevData.untouched === "descending"
          ? "none"
          : "ascending"
    }));
    switch (sortBy1) {
      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {}
        empData.forEach((company) => {
          if ((company.Status === "Busy")

          ) {
            untouchedCountAscending[company.AssignDate] = (untouchedCountAscending[company.AssignDate] || 0) + 1;
          }
        });
        // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
        empData.sort((a, b) => {
          const countA = untouchedCountAscending[a.AssignDate] || 0;
          const countB = untouchedCountAscending[b.AssignDate] || 0;
          return countA - countB; // Sort in ascending order of "Untouched" count
        });
        break;

      case "descending":
        setIncoFilter("descending");
        const untouchedCount = {};
        empData.forEach((company) => {
          if ((company.Status === "Busy")
          ) {
            untouchedCount[company.AssignDate] = (untouchedCount[company.AssignDate] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses
        empData.sort((a, b) => {
          const countA = untouchedCount[a.AssignDate] || 0;
          const countB = untouchedCount[b.AssignDate] || 0;
          return countB - countA; // Sort in descending order of "Untouched" count
        });
        break;

      case "none":
        setIncoFilter("none");

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
        empData.forEach((company) => {
          if ((company.Status === "Junk")

          ) {
            untouchedCountAscending[company.AssignDate] = (untouchedCountAscending[company.AssignDate] || 0) + 1;
          }
        });
        // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
        empData.sort((a, b) => {
          const countA = untouchedCountAscending[a.AssignDate] || 0;
          const countB = untouchedCountAscending[b.AssignDate] || 0;
          return countA - countB; // Sort in ascending order of "Untouched" count
        });
        break;

      case "descending":
        setIncoFilter("descending");
        const untouchedCount = {};
        empData.forEach((company) => {
          if ((company.Status === "Junk")
          ) {
            untouchedCount[company.AssignDate] = (untouchedCount[company.AssignDate] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses
        empData.sort((a, b) => {
          const countA = untouchedCount[a.AssignDate] || 0;
          const countB = untouchedCount[b.AssignDate] || 0;
          return countB - countA; // Sort in descending order of "Untouched" count
        });
        break;

      case "none":
        setIncoFilter("none");

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
        empData.forEach((company) => {
          if ((company.Status === "Not Picked Up")

          ) {
            untouchedCountAscending[company.AssignDate] = (untouchedCountAscending[company.AssignDate] || 0) + 1;
          }
        });
        // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
        empData.sort((a, b) => {
          const countA = untouchedCountAscending[a.AssignDate] || 0;
          const countB = untouchedCountAscending[b.AssignDate] || 0;
          return countA - countB; // Sort in ascending order of "Untouched" count
        });
        break;

      case "descending":
        setIncoFilter("descending");
        const untouchedCount = {};
        empData.forEach((company) => {
          if ((company.Status === "Not Picked Up")
          ) {
            untouchedCount[company.AssignDate] = (untouchedCount[company.AssignDate] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses
        empData.sort((a, b) => {
          const countA = untouchedCount[a.AssignDate] || 0;
          const countB = untouchedCount[b.AssignDate] || 0;
          return countB - countA; // Sort in descending order of "Untouched" count
        });
        break;

      case "none":
        setIncoFilter("none");

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
        empData.forEach((company) => {
          if ((company.Status === "FollowUp")

          ) {
            untouchedCountAscending[company.AssignDate] = (untouchedCountAscending[company.AssignDate] || 0) + 1;
          }
        });
        // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
        empData.sort((a, b) => {
          const countA = untouchedCountAscending[a.AssignDate] || 0;
          const countB = untouchedCountAscending[b.AssignDate] || 0;
          return countA - countB; // Sort in ascending order of "Untouched" count
        });
        break;

      case "descending":
        setIncoFilter("descending");
        const untouchedCount = {};
        empData.forEach((company) => {
          if ((company.Status === "FollowUp")
          ) {
            untouchedCount[company.AssignDate] = (untouchedCount[company.AssignDate] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses
        empData.sort((a, b) => {
          const countA = untouchedCount[a.AssignDate] || 0;
          const countB = untouchedCount[b.AssignDate] || 0;
          return countB - countA; // Sort in descending order of "Untouched" count
        });
        break;

      case "none":
        setIncoFilter("none");

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
        empData.forEach((company) => {
          if ((company.Status === "Interested")

          ) {
            untouchedCountAscending[company.AssignDate] = (untouchedCountAscending[company.AssignDate] || 0) + 1;
          }
        });
        // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
        empData.sort((a, b) => {
          const countA = untouchedCountAscending[a.AssignDate] || 0;
          const countB = untouchedCountAscending[b.AssignDate] || 0;
          return countA - countB; // Sort in ascending order of "Untouched" count
        });
        break;

      case "descending":
        setIncoFilter("descending");
        const untouchedCount = {};
        empData.forEach((company) => {
          if ((company.Status === "Interested")
          ) {
            untouchedCount[company.AssignDate] = (untouchedCount[company.AssignDate] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses
        empData.sort((a, b) => {
          const countA = untouchedCount[a.AssignDate] || 0;
          const countB = untouchedCount[b.AssignDate] || 0;
          return countB - countA; // Sort in descending order of "Untouched" count
        });
        break;

      case "none":
        setIncoFilter("none");

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
        empData.forEach((company) => {
          if ((company.Status === "Not Interested")

          ) {
            untouchedCountAscending[company.AssignDate] = (untouchedCountAscending[company.AssignDate] || 0) + 1;
          }
        });
        // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
        empData.sort((a, b) => {
          const countA = untouchedCountAscending[a.AssignDate] || 0;
          const countB = untouchedCountAscending[b.AssignDate] || 0;
          return countA - countB; // Sort in ascending order of "Untouched" count
        });
        break;

      case "descending":
        setIncoFilter("descending");
        const untouchedCount = {};
        empData.forEach((company) => {
          if ((company.Status === "Not Interested")
          ) {
            untouchedCount[company.AssignDate] = (untouchedCount[company.AssignDate] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses
        empData.sort((a, b) => {
          const countA = untouchedCount[a.AssignDate] || 0;
          const countB = untouchedCount[b.AssignDate] || 0;
          return countB - countA; // Sort in descending order of "Untouched" count
        });
        break;

      case "none":
        setIncoFilter("none");

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
        empData.forEach((company) => {
          if ((company.Status === "Matured")

          ) {
            untouchedCountAscending[company.AssignDate] = (untouchedCountAscending[company.AssignDate] || 0) + 1;
          }
        });
        // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
        empData.sort((a, b) => {
          const countA = untouchedCountAscending[a.AssignDate] || 0;
          const countB = untouchedCountAscending[b.AssignDate] || 0;
          return countA - countB; // Sort in ascending order of "Untouched" count
        });
        break;

      case "descending":
        setIncoFilter("descending");
        const untouchedCount = {};
        empData.forEach((company) => {
          if ((company.Status === "Matured")
          ) {
            untouchedCount[company.AssignDate] = (untouchedCount[company.AssignDate] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses
        empData.sort((a, b) => {
          const countA = untouchedCount[a.AssignDate] || 0;
          const countB = untouchedCount[b.AssignDate] || 0;
          return countB - countA; // Sort in descending order of "Untouched" count
        });
        break;

      case "none":
        setIncoFilter("none");

        break;

      default:
        break;

    }
  };
  const handleSortTotalLeads = (sortBy1) => {
    setSortType(prevData => ({
      ...prevData,
      totalLeads: prevData.totalLeads === "ascending"
        ? "descending"
        : prevData.totalLeads === "descending"
          ? "none"
          : "ascending"
    }));
    switch (sortBy1) {
      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {}
        empData.forEach((company) => {
          if ((company)

          ) {
            untouchedCountAscending[company.AssignDate] = (untouchedCountAscending[company.AssignDate] || 0) + 1;
          }
        });
        // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
        empData.sort((a, b) => {
          const countA = untouchedCountAscending[a.AssignDate] || 0;
          const countB = untouchedCountAscending[b.AssignDate] || 0;
          return countA - countB; // Sort in ascending order of "Untouched" count
        });
        break;

      case "descending":
        setIncoFilter("descending");
        const untouchedCount = {};
        empData.forEach((company) => {
          if ((company)
          ) {
            untouchedCount[company.AssignDate] = (untouchedCount[company.AssignDate] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses
        empData.sort((a, b) => {
          const countA = untouchedCount[a.AssignDate] || 0;
          const countB = untouchedCount[b.AssignDate] || 0;
          return countB - countA; // Sort in descending order of "Untouched" count
        });
        break;

      case "none":
        setIncoFilter("none");

        break;

      default:
        break;

    }
  };

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
    width: "20px",
  };


  // ---------------------------------------------delete Projection----------------------------------------------------\

  const handleDelete = async (company) => {
    const companyName = company;
    //console.log(companyName);

    try {
      // Send a DELETE request to the backend API endpoint
      const response = await axios.delete(`${secretKey}/delete-followup/${companyName}`);
      //console.log(response.data.message); // Log the response message
      // Show a success message after successful deletion
      //console.log('Deleted!', 'Your data has been deleted.', 'success');
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
      fetchFollowUpData();
      setIsEditProjection(true)
    } catch (error) {
      console.error('Error deleting data:', error);
      // Show an error message if deletion fails
      console.log('Error!', 'Follow Up Not Found.', 'error');
    }
  };
  //console.log("projections", currentProjection);
  //const containerRef = useRef();

  // const handleButtonClick = (dateRangePickerRef) => {
  //   console.log("hello world")
  //   setShowBookingDate(true);
  //   // Scroll the window to the position of the date range picker
  //   console.log(dateRangePickerRef.current)
  //   if (showBookingDate && dateRangePickerRef.current) {
  //     const { top } = dateRangePickerRef.current.getBoundingClientRect();

  //     window.scrollTo({
  //       top: window.scrollY + top,
  //       //bottom:"0px",
  //       behavior: "smooth" // You can change this to "auto" if you prefer instant scrolling
  //     });
  //   }
  // };




  return (
    <div>
      <Header name={data.ename} designation={data.designation} />
      <EmpNav userId={userId} />
      <div className="container-xl mt-2">
        <div className="card">
          <div className="card-header employeedashboard">
            <div className="d-flex justify-content-between">
              <div style={{ minWidth: '14vw' }} className="dashboard-title">
                <h2 style={{ marginBottom: '5px' }}>Data Summary</h2>
              </div>
              {/* <div className=" form-control d-flex justify-content-center align-items-center general-searchbar">
                <input
                  className=""
                  value={searchTerm}
                  // onChange={(e) => filterSearch(e.target.value)}
                  // placeholder="Enter BDE Name..."
                  style={{
                    border: "none",
                    padding:"0px"
                      // Add a bottom border for the input field itself
                   }}
                  type="text"
                  name="bdeName-search"
                  id="bdeName-search"
                />
                 <CiSearch
                  style={{
                    width: "19px",
                    height: "20px",
                    marginRight: "5px",
                    color: "grey"
                  }}
                /> 
              </div> */}
            </div>
          </div>
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
                    <th>Lead Assign Date</th>
                    <th>Untouched
                      <SwapVertIcon
                        style={{
                          height: "15px",
                          width: "15px",
                          cursor: "pointer",
                          marginLeft: "4px",
                        }}
                        onClick={(e) => {
                          let newSortType;
                          if (sortType.untouched === "ascending") {
                            newSortType = "descending";
                          } else if (sortType.untouched === "descending") {
                            newSortType = "none";
                          } else {
                            newSortType = "ascending";
                          }
                          handleSortUntouched(newSortType);
                        }}
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
                        onClick={(e) => {
                          let newSortType;
                          if (sortType.busy === "ascending") {
                            newSortType = "descending";
                          } else if (sortType.busy === "descending") {
                            newSortType = "none";
                          } else {
                            newSortType = "ascending";
                          }
                          handleSortBusy(newSortType);
                        }}
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
                        onClick={(e) => {
                          let newSortType;
                          if (sortType.notPickedUp === "ascending") {
                            newSortType = "descending";
                          } else if (sortType.notPickedUp === "descending") {
                            newSortType = "none";
                          } else {
                            newSortType = "ascending";
                          }
                          handleSortNotPickedUp(newSortType);
                        }}
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
                        onClick={(e) => {
                          let newSortType;
                          if (sortType.followUp === "ascending") {
                            newSortType = "descending";
                          } else if (sortType.followUp === "descending") {
                            newSortType = "none";
                          } else {
                            newSortType = "ascending";
                          }
                          handleSortFollowUp(newSortType);
                        }}
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
                        onClick={(e) => {
                          let newSortType;
                          if (sortType.interested === "ascending") {
                            newSortType = "descending";
                          } else if (sortType.interested === "descending") {
                            newSortType = "none";
                          } else {
                            newSortType = "ascending";
                          }
                          handleSortInterested(newSortType);
                        }}
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
                        onClick={(e) => {
                          let newSortType;
                          if (sortType.notInterested === "ascending") {
                            newSortType = "descending";
                          } else if (sortType.notInterested === "descending") {
                            newSortType = "none";
                          } else {
                            newSortType = "ascending";
                          }
                          handleSortNotInterested(newSortType);
                        }}
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
                        onClick={(e) => {
                          let newSortType;
                          if (sortType.matured === "ascending") {
                            newSortType = "descending";
                          } else if (sortType.matured === "descending") {
                            newSortType = "none";
                          } else {
                            newSortType = "ascending";
                          }
                          handleSortMatured(newSortType);
                        }}
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
                        onClick={(e) => {
                          let newSortType;
                          if (sortType.totalLeads === "ascending") {
                            newSortType = "descending";
                          } else if (sortType.totalLeads === "descending") {
                            newSortType = "none";
                          } else {
                            newSortType = "ascending";
                          }
                          handleSortTotalLeads(newSortType);
                        }}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {uniqueArray ? (
                    uniqueArray.length !== 0 ? (
                      uniqueArray.map((obj, index) => (
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
                              empData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Untouched"
                              ).length
                            }
                          </td>
                          <td>
                            {
                              empData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Busy"
                              ).length
                            }
                          </td>
                          <td>
                            {
                              empData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Not Picked Up"
                              ).length
                            }
                          </td>
                          <td>
                            {
                              empData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Junk"
                              ).length
                            }
                          </td>
                          <td>
                            {
                              empData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "FollowUp"
                              ).length
                            }
                          </td>
                          <td>
                            {
                              empData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Interested"
                              ).length
                            }
                          </td>
                          <td>
                            {
                              empData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Not Interested"
                              ).length
                            }
                          </td>
                          <td>
                            {
                              empData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Matured"
                              ).length
                            }
                          </td>
                          <td>
                            {
                              empData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj
                              ).length
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
                      cssOverride={override}
                      size={10}
                      height="25"
                      width="2"
                      style={{ width: "10px", height: "10px" }}
                      //cssOverride={{ margin: '0 auto', width: "35", height: "4" }} // Adjust the size here
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    /></td></tr>)
                  }
                </tbody>
                {uniqueArray && (
                  <tfoot>
                    <tr style={{ fontWeight: 500 }}>
                      <td style={{ lineHeight: "32px" }} colSpan="2">
                        Total
                      </td>
                      <td>
                        {
                          empData.filter(
                            (partObj) => partObj.Status === "Untouched"
                          ).length
                        }
                      </td>
                      <td>
                        {
                          empData.filter((partObj) => partObj.Status === "Busy")
                            .length
                        }
                      </td>
                      <td>
                        {
                          empData.filter(
                            (partObj) => partObj.Status === "Not Picked Up"
                          ).length
                        }
                      </td>
                      <td>
                        {
                          empData.filter((partObj) => partObj.Status === "Junk")
                            .length
                        }
                      </td>
                      <td>
                        {
                          empData.filter(
                            (partObj) => partObj.Status === "FollowUp"
                          ).length
                        }
                      </td>
                      <td>
                        {
                          empData.filter(
                            (partObj) => partObj.Status === "Interested"
                          ).length
                        }
                      </td>
                      <td>
                        {
                          empData.filter(
                            (partObj) => partObj.Status === "Not Interested"
                          ).length
                        }
                      </td>
                      <td>
                        {
                          empData.filter(
                            (partObj) => partObj.Status === "Matured"
                          ).length
                        }
                      </td>
                      <td>{empData.length}</td>
                    </tr>
                  </tfoot>
                )}
                {/* {uniqueArrayLoading ? (
                  <tbody>
                    <tr>
                      <td colSpan="11" style={{ height: "100px !important", padding: "80px !important" }}>
                        <ClipLoader
                          color="lightgrey"
                          loading
                          size={35}
                          height="25"
                          width="25"
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <>
                    <tbody>
                      {uniqueArray && uniqueArray.map((obj, index) => (
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
                              empData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Untouched"
                              ).length
                            }
                          </td>
                          <td>
                            {
                              empData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Busy"
                              ).length
                            }
                          </td>
                          <td>
                            {
                              empData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Not Picked Up"
                              ).length
                            }
                          </td>
                          <td>
                            {
                              empData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Junk"
                              ).length
                            }
                          </td>
                          <td>
                            {
                              empData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "FollowUp"
                              ).length
                            }
                          </td>
                          <td>
                            {
                              empData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Interested"
                              ).length
                            }
                          </td>
                          <td>
                            {
                              empData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Not Interested"
                              ).length
                            }
                          </td>
                          <td>
                            {
                              empData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Matured"
                              ).length
                            }
                          </td>
                          <td>
                            {
                              empData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj
                              ).length
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ fontWeight: 500 }}>
                        <td style={{ lineHeight: "32px" }} colSpan="2">
                          Total
                        </td>
                        <td>
                          {
                            empData.filter(
                              (partObj) => partObj.Status === "Untouched"
                            ).length
                          }
                        </td>
                        <td>
                          {
                            empData.filter((partObj) => partObj.Status === "Busy")
                              .length
                          }
                        </td>
                        <td>
                          {
                            empData.filter(
                              (partObj) => partObj.Status === "Not Picked Up"
                            ).length
                          }
                        </td>
                        <td>
                          {
                            empData.filter((partObj) => partObj.Status === "Junk")
                              .length
                          }
                        </td>
                        <td>
                          {
                            empData.filter(
                              (partObj) => partObj.Status === "FollowUp"
                            ).length
                          }
                        </td>
                        <td>
                          {
                            empData.filter(
                              (partObj) => partObj.Status === "Interested"
                            ).length
                          }
                        </td>
                        <td>
                          {
                            empData.filter(
                              (partObj) => partObj.Status === "Not Interested"
                            ).length
                          }
                        </td>
                        <td>
                          {
                            empData.filter(
                              (partObj) => partObj.Status === "Matured"
                            ).length
                          }
                        </td>
                        <td>{empData.length}</td>
                      </tr>
                    </tfoot>
                  </>
                )}
                {uniqueArray.length === 0 && !uniqueArrayLoading
                  (
                    <tbody>
                      <tr>
                        <td colSpan={9} className="p-2 particular">
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

      {/* -----------------------------------------------projection dashboard-------------------------------------------------- */}

      {/* <div className="container-xl mt-2 projectiondashboard" id="projectiondashboardemployee">
        <div className="card">
          <div className="card-header employeedashboard d-flex align-items-center justify-content-between">
            <div className="dashboard-title">
              <h2 style={{ marginBottom: '5px' }}>Projection Summary</h2>
            </div>
            <div className="d-flex justify-content-between" style={{ gap: "10px" }}>
              <div className=" form-control d-flex justify-content-center align-items-center general-searchbar">
                <input
                  className=""
                  value={searchTerm}
                  onChange={(e) => filterSearch(e.target.value)}
                  placeholder="Search here....."
                  style={{
                    border: "none",
                    padding: "0px"
                    // Add a bottom border for the input field itself
                  }}
                  type="text"
                  name="bdeName-search"
                  id="bdeName-search"
                />
               
              </div>
              <div
                className="form-control d-flex align-items-center justify-content-between date-range-picker">
                <div>{`${formatDate(startDate)} - ${formatDate(endDate)}`}</div>
                <button
                  onClick={handleIconClick}
                  style={{
                    border: "none",
                    padding: "0px",
                    backgroundColor: "white",
                  }}
                >
                  <FaRegCalendar
                    style={{
                      width: "17px",
                      height: "17px",
                      color: "#bcbaba",
                      color: "grey",
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
          {displayDateRange && (
            <div
            ref={dateRangePickerProhectionRef}
              className="position-absolute "
              style={{ zIndex: "1", top: "20%", left: "75%" }}
            >
              <DateRangePicker
                ranges={[selectionRange]}
                onClose={() => setDateRangeDisplay(false)}
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
                    <th>Offered Services</th>
                    <th>Total Offered Price</th>
                    <th>Expected Amount</th>
                    <th>Remarks</th>
                    <th>Last FollowUp Date</th>
                    <th>Estimated Payment Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDataDateRange ? (
                    filteredDataDateRange.map((obj, index) => (
                      <tr key={`row-${index}`}>
                        <td
                          style={{
                            lineHeight: "32px",
                          }}
                        >
                          {index + 1}
                        </td>
                        <td>{obj.companyName}</td>
                        <td>{obj.offeredServices.join(", ")}</td>
                        <td>
                          ₹
                          {obj.totalPayment &&
                            obj.totalPayment.toLocaleString()}
                        </td>
                        <td>₹{obj.offeredPrize.toLocaleString()}</td>
                        <td>{obj.remarks}</td>
                        <td>{obj.lastFollowUpdate}</td>
                        <td>{obj.estPaymentDate}</td>
                        <td>
                          <IconButton
                            onClick={() => {
                              functionopenprojection(obj.companyName);
                            }}
                          >
                            <RiEditCircleFill color="grey" style={{ width: "17px", height: "17px" }}></RiEditCircleFill>
                          </IconButton>
                        </td>
                      </tr>
                    ))
                  ) : (<tr>
                    <td style={{ position: "absolute", left: "50%", textAlign: 'center', verticalAlign: 'middle' }}>
                      <ScaleLoader
                        color="lightgrey"
                        loading
                        cssOverride={override}
                        size={10}
                        //cssOverride={{ margin: '0 auto', width: "35", height: "4" }} // Adjust the size here
                        aria-label="Loading Spinner"
                        data-testid="loader"
                      />
                    </td>
                  </tr>)}
                </tbody>
                {filteredDataDateRange && (
                  <tfoot>
                    <tr style={{ fontWeight: 500 }}>
                      <td style={{ lineHeight: "32px" }} colSpan="2">
                        Total
                      </td>
                      <td>{offeredServicesFilter.length}</td>
                      <td> ₹{totalPaymentSumFilter.toLocaleString()}</td>
                      <td>₹{offeredPaymentSumFilter.toLocaleString()}</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>
      </div> */}
      {/* --------------------------------------------------projection dashboard new------------------------------------ */}


      <div className="container-xl mt-2">
        <div className="row">
          <div className="col-12" id="projectiontotalsummary">
            <div className="card">
              <div className="card-header employeedashboard d-flex align-items-center justify-content-between">
                <div className="dashboard-title">
                  <h2 style={{ marginBottom: '5px' }}>Total Projection Summary</h2>
                </div>
                <div className="d-flex justify-content-between" style={{ gap: "10px" }}>
                  <div className=" form-control d-flex justify-content-center align-items-center general-searchbar input-icon" style={{ width: "50%" }}>
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
                      className=""
                      value={searchTermTotalSummary}
                      onChange={(e) => filterSearchTotalSummary(e.target.value)}
                      placeholder="Search here....."
                      style={{
                        border: "none",
                        padding: "0px 0px 0px 21px"
                        // Add a bottom border for the input field itself
                      }}
                      type="text"
                      name="bdeName-search"
                      id="bdeName-search"
                    />
                  </div>
                  <div
                    className="form-control d-flex align-items-center justify-content-between date-range-picker">
                    <div>{`${formatDate(startDateTotalSummary)} - ${formatDate(endDateTotalSummary)}`}</div>
                    <button
                      onClick={handleIconClickTotalSummary}
                      style={{
                        border: "none",
                        padding: "0px",
                        backgroundColor: "white",
                      }}
                    >
                      <FaRegCalendar
                        style={{
                          width: "17px",
                          height: "17px",
                          color: "#bcbaba",
                          color: "grey",
                        }}
                      />
                    </button>
                  </div>
                </div>
              </div>
              {dateRangeTotalSummary && (
                <div
                  ref={dateRangePickerProhectionSummaryRef}
                  className="position-absolute "
                  style={{ zIndex: "1000", top: "14%", left: "75%" }}
                >
                  <DateRangePicker
                    ranges={[selectionRangeTotalSummary]}
                    onClose={() => setdateRangeTotalSummary(false)}
                    onChange={handleSelectTotalSummary}
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
                    height: "30vh"
                  }}
                >
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      border: "1px solid #ddd",
                      marginBottom: "10px",
                    }}
                    className="table-vcenter table-nowrap">
                    <thead style={{ backgroundColor: "grey" }}>
                      <tr className="tr-sticky"
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
                        <th>Offered Services</th>
                        <th> Offered Price</th>
                        <th>Expected Amount</th>
                        <th>Remarks</th>
                        <th>Last FollowUp Date</th>
                        <th>Estimated Payment Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    {projectionLoading ? (
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
                      <>
                        {followDataFilter && followDataFilter.length > 0 ? (
                          <>
                            <tbody>
                              {followDataFilter.map((obj, index) => (
                                <tr key={`row-${index}`}>
                                  <td style={{
                                    lineHeight: "32px",
                                  }}>{index + 1}</td>
                                  <td>{obj.companyName}</td>
                                  <td>{obj.offeredServices.join(', ')}</td>
                                  <td>₹{obj.offeredPrize && obj.offeredPrize.toLocaleString()}</td>
                                  <td>₹{obj.totalPayment && obj.totalPayment.toLocaleString()}</td>
                                  <td>{obj.remarks}</td>
                                  <td>{obj.lastFollowUpdate}</td>
                                  <td>{obj.estPaymentDate}</td>
                                  <td>
                                    <IconButton
                                      onClick={() => {
                                        functionopenprojection(obj.companyName);
                                      }}
                                    >
                                      <RiEditCircleFill color="grey" style={{ width: "17px", height: "17px" }} />
                                    </IconButton>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            {followDataFilter && (
                              <tfoot>
                                <tr style={{ fontWeight: 500 }} className="tf-sticky">
                                  <td style={{ lineHeight: "32px" }} colSpan="2">
                                    Total
                                  </td>
                                  <td>{offeredServices.length}</td>
                                  <td>₹{offeredPaymentSum.toLocaleString()}</td>
                                  <td> ₹{totalPaymentSum.toLocaleString()}</td>
                                  <td>-</td>
                                  <td>-</td>
                                  <td>-</td>
                                  <td>-</td>
                                </tr>
                              </tfoot>
                            )}
                          </>
                        ) : (
                          <tr>
                            <td colSpan="11">
                              <Nodata />
                            </td>

                          </tr>
                        )}
                      </>
                    )}
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 mt-2" id="projectiondashboardemployee" >
            <div className="card">
              <div className="card-header employeedashboard d-flex align-items-center justify-content-between">
                <div className="dashboard-title">
                  <h2 style={{ marginBottom: '5px' }}>Todays's Projection Summary</h2>
                </div>
                <div className="d-flex justify-content-between" style={{ gap: "10px" }}>
                  <div className=" form-control d-flex justify-content-center align-items-center general-searchbar input-icon" style={{ marginRight: "26px", width: "100%" }}>
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
                      className=""
                      value={searchTerm}
                      onChange={(e) => filterSearch(e.target.value)}
                      placeholder="Search here....."
                      style={{
                        border: "none",
                        padding: "0px 0px 0px 21px"
                        // Add a bottom border for the input field itself
                      }}
                      type="text"
                      name="bdeName-search"
                      id="bdeName-search"
                    />
                  </div>
                  {/* <div className="form-control d-flex align-items-center justify-content-between date-range-picker">
                        <div>{`${formatDate(startDate)} - ${formatDate(endDate)}`}</div>
                        <button
                          onClick={handleIconClick}
                          style={{
                            border: "none",
                            padding: "0px",
                            backgroundColor: "white",
                          }}
                        >
                          <FaRegCalendar
                            style={{
                              width: "17px",
                              height: "17px",
                              color: "#bcbaba",
                              color: "grey",
                            }}
                          />
                        </button>
                      </div> */}
                </div>
              </div>
              {/* {displayDateRange && (
                    <div
                      ref={dateRangePickerProhectionRef}
                      className="position-absolute "
                      style={{ zIndex: "1", top: "20%", left: "75%" }}
                    >
                      <DateRangePicker
                        ranges={[selectionRange]}
                        onClose={() => setDateRangeDisplay(false)}
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
                      <tr className="tr-sticky"
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
                        <th>Contact Number</th>
                        <th>Offered Services</th>
                        <th>Total Offered Price</th>
                        <th>Expected Amount</th>
                        <th>Remarks</th>
                        <th>Last FollowUp Date</th>
                        <th>Estimated Payment Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    {projectionLoading ? (
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
                      <>
                        {followDataTodayFilter && followDataTodayFilter.length > 0 ? (
                          <>
                            <tbody>
                              {followDataTodayFilter.map((obj, index) => (
                                <tr key={`row-${index}`}>
                                  <td
                                    style={{
                                      lineHeight: "32px",
                                    }}
                                  >
                                    {index + 1}
                                  </td>
                                  <td>{obj.companyName}</td>
                                  <td>{
                                    tempData
                                      .filter(company => company["Company Name"] === obj.companyName)
                                      .map(filteredCompany => filteredCompany["Company Number"])
                                  }</td>
                                  <td>{obj.offeredServices.join(", ")}</td>
                                  <td>₹{obj.offeredPrize.toLocaleString()}</td>
                                  <td>
                                    ₹
                                    {obj.totalPayment &&
                                      obj.totalPayment.toLocaleString()}
                                  </td>
                                  <td>{obj.remarks}</td>
                                  <td>{obj.lastFollowUpdate}</td>
                                  <td>{obj.estPaymentDate}</td>
                                  <td>
                                    <IconButton
                                      onClick={() => {
                                        functionopenprojection(obj.companyName);
                                      }}
                                    >
                                      <RiEditCircleFill color="grey" style={{ width: "17px", height: "17px" }}></RiEditCircleFill>
                                    </IconButton>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr style={{ fontWeight: 500 }} className="tf-sticky">
                                <td style={{ lineHeight: "32px" }} colSpan="2">
                                  Total
                                </td>
                                <td>-</td>
                                <td>{offeredServicesFilter.length}</td>
                                <td>₹{offeredPaymentSumFilter.toLocaleString()}</td>
                                <td>₹{totalPaymentSumFilter.toLocaleString()}</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                              </tr>
                            </tfoot>
                          </>
                        ) : (
                          <tbody>
                            <tr>
                              <td className="particular" colSpan="11">
                                <Nodata />
                              </td>
                            </tr>
                          </tbody>
                        )}
                      </>
                    )}
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>

      {/* -----------------------------------------------Booking dashboard-------------------------------------------------- */}


      <div className="container-xl mt-2 bookingdashboard" id="bookingdashboard">
        <div className="card">
          <div className="card-header employeedashboard d-flex align-items-center justify-content-between">
            <div>
              <h2>Matured Clients Summary</h2>
            </div>
            <div className="d-flex justify-content-between" style={{ gap: "10px" }}>
              <div className=" form-control d-flex justify-content-center align-items-center general-searchbar input-icon" style={{ width: "50%" }}>
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
                  className=""
                  value={newSearchTerm}
                  onChange={(e) => filterSearchBooking(e.target.value)}
                  placeholder="Search here....."
                  style={{
                    border: "none",
                    padding: "0px 0px 0px 21px"
                    // Add a bottom border for the input field itself
                  }}
                  type="text"
                  name="bdeName-search"
                  id="bdeName-search"
                />
                {/* <CiSearch
                  style={{
                    width: "19px",
                    height: "20px",
                    marginRight: "5px",
                    color: "grey"
                  }} 
                /> */}
              </div>
              <div className="form-control d-flex align-items-center justify-content-between date-range-picker">
                <div style={{ cursor: 'pointer' }} onClick={() => setShowBookingDate(!showBookingDate)}>
                  {`${formatDate(startDateAnother)} - ${formatDate(endDateAnother)}`}
                </div>
                <button
                  style={{ border: "none", padding: "0px", backgroundColor: "white" }} onClick={() => setShowBookingDate(!showBookingDate)}>
                  <FaRegCalendar style={{ width: "17px", height: "17px", color: "#bcbaba", color: "grey" }} />
                </button>
              </div>
            </div>
          </div>
          {showBookingDate && <div
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
              direction="upward"
              ranges={[selectionRangeAnother]}
              onChange={handleSelectAnother}
              onClose={() => setShowBookingDate(false)}
              position="auto"
            />
          </div>}
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
                    <th style={{ lineHeight: "32px" }}>SR.NO</th>
                    <th>BOOKING DATE & TIME</th>
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
                {filteredBooking && filteredBooking.length > 0 ? (
                  <>
                    <tbody>
                      {filteredBooking.map((mainObj, index) => (
                        <tr key={index}>
                          <td style={{ lineHeight: "32px" }}>{index + 1}</td>
                          <td>{`${formatDate(mainObj.bookingDate)}(${mainObj.bookingTime})`}</td>
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
                            {(mainObj.firstPayment !== 0
                              ? mainObj.bdeName === mainObj.bdmName
                                ? mainObj.firstPayment // If bdeName and bdmName are the same
                                : mainObj.firstPayment / 2 // If bdeName and bdmName are different
                              : mainObj.bdeName === mainObj.bdmName
                                ? mainObj.originalTotalPayment // If firstPayment is 0 and bdeName and bdmName are the same
                                : mainObj.originalTotalPayment / 2
                            ).toLocaleString()}{" "}
                          </td>
                          <td>
                            ₹
                            {(mainObj.firstPayment !== 0
                              ? mainObj.bdeName === mainObj.bdmName
                                ? mainObj.originalTotalPayment - mainObj.firstPayment
                                : (mainObj.originalTotalPayment - mainObj.firstPayment) / 2
                              : 0
                            ).toLocaleString()}{" "}
                          </td>
                          <td>{mainObj.bdeName !== mainObj.bdmName ? "Yes" : "No"}</td>
                          <td>
                            {mainObj.bdeName !== mainObj.bdmName
                              ? mainObj.bdmType === "closeby"
                                ? `Closed by ${mainObj.bdmName}`
                                : `Supported by ${mainObj.bdmName}`
                              : `Self Closed`}{" "}
                          </td>
                          <td>{mainObj.paymentRemarks}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th colSpan={3}>
                          <strong>Total</strong>
                        </th>
                        <th>-</th>
                        <th>-</th>
                        <th>-</th>
                        <th>
                          ₹
                          {filteredBooking.reduce((total, obj) => {
                            return obj.bdeName === obj.bdmName
                              ? total + obj.originalTotalPayment
                              : total + obj.originalTotalPayment / 2;
                          }, 0).toLocaleString()}
                        </th>
                        <th>
                          ₹
                          {filteredBooking.reduce((total, obj) => {
                            return obj.bdeName === obj.bdmName
                              ? obj.firstPayment === 0
                                ? total + obj.originalTotalPayment
                                : total + obj.firstPayment
                              : obj.firstPayment === 0
                                ? total + obj.originalTotalPayment / 2
                                : total + obj.firstPayment / 2;
                          }, 0).toLocaleString()}
                        </th>
                        <th>
                          ₹
                          {filteredBooking.reduce((total, obj) => {
                            return obj.bdeName === obj.bdmName
                              ? obj.firstPayment === 0
                                ? total + obj.originalTotalPayment
                                : total + obj.firstPayment
                              : obj.firstPayment === 0
                                ? total + obj.originalTotalPayment / 2
                                : total + obj.firstPayment / 2;
                          }, 0).toLocaleString()}
                        </th>
                        <th>-</th>
                        <th>-</th>
                        <th>-</th>
                      </tr>
                    </tfoot>
                  </>
                ) : filteredBooking && filteredBooking.length === 0 && loading ? (
                  <tr>
                    <td colSpan={12} style={{ position: "absolute", left: "50%", textAlign: 'center', verticalAlign: 'middle' }}>
                      <ScaleLoader
                        color="lightgrey"
                        loading
                        cssOverride={override}
                        size={10}
                        height="25"
                        width="2"
                        aria-label="Loading Spinner"
                        data-testid="loader"
                      />
                    </td>
                  </tr>

                ) : (
                  <tr>
                    <td colSpan={12} style={{ textAlign: 'center' }}><Nodata /></td>
                  </tr>

                )}
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer for Follow Up Projection  */}
      <div>
        <Drawer
          style={{ top: "50px" }}
          anchor="right"
          open={openProjection}
          onClose={closeProjection}>
          <div style={{ width: "31em" }} className="container-xl">
            <div className="d-flex justify-content-between align-items-center" style={{ margin: "10px 0px" }}>
              <h1 style={{ marginBottom: "0px", fontSize: "20px", }} className="title">
                Projection Form
              </h1>
              <div>
                <IconButton onClick={() => {
                  setIsEditProjection(true);
                }}>
                  <EditIcon color="grey" style={{ width: "17px", height: "17px" }}></EditIcon>
                </IconButton>
                <IconButton>
                  <IoClose onClick={closeProjection} style={{ width: "17px", height: "17px" }} />
                </IconButton>
              </div>
            </div>
            <hr style={{ margin: "0px" }} />
            <div className="body-projection">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h1
                    title={projectingCompany} style={{
                      fontSize: "14px",
                      textShadow: "none",
                      fontWeight: "400",
                      fontFamily: "Poppins, sans-serif",
                      margin: "10px 0px",
                      width: "200px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                    {projectingCompany}
                  </h1>
                </div>
                <div>
                  <button
                    onClick={() => handleDelete(projectingCompany)}
                    className="btn btn-link" style={{ color: "grey" }}
                  >
                    Clear Form
                  </button>
                </div>

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
                    placeholder="Select Services..."
                    isDisabled={!isEditProjection}
                    onChange={(selectedOptions) => {
                      setSelectedValues(
                        selectedOptions.map((option) => option.value)
                      );
                    }}
                    value={selectedValues.map((value) => ({
                      value,
                      label: value,
                    }))}
                  />
                </div>
              </div>
              <div className="label">
                <strong>Offered Prices (With GST){!currentProjection.offeredPrize && (<span style={{color:"red"}}>*</span>)}{" "}
                  :</strong>
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
                <strong>Expected Price (With GST) {currentProjection.totalPayment === 0 && (
                    <span style={{ color: "red" }}>*</span>
                  )}{" "}
                  :</strong>
                <div className="services mb-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Please enter total Payment"
                    value={currentProjection.totalPayment}
                    onChange={(e) => {
                      const newTotalPayment = e.target.value
                      if(Number(newTotalPayment) <= Number(currentProjection.offeredPrize)){
                        setCurrentProjection((prevLeadData) => ({
                          ...prevLeadData,
                          totalPayment: newTotalPayment,
                          totalPaymentError:""
                        }));
                      }else{
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
                   <div style={{ color: "lightred" }}>{currentProjection.totalPaymentError}</div>
                </div>
              </div>
              <div className="label">
                <strong>Last Follow Up Date: </strong>
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
                <strong>Payment Expected on :</strong>
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
                <strong>Remarks :</strong>
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
                  style={{ width: "100%" }}
                  type="submit"
                  class="btn btn-primary mb-3"
                  onClick={handleProjectionSubmit}
                  disabled={!isEditProjection}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </Drawer>
      </div>
    </div >
  );
}

export default EmployeeDashboard;
