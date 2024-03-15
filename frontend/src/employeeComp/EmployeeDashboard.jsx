import React, { useEffect, useState, CSSProperties } from "react";
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
import { ColorRing } from 'react-loader-spinner'
import Nodata from "../components/Nodata";

function EmployeeDashboard() {
  const { userId } = useParams();
  const [data, setData] = useState([]);
  const [isEditProjection, setIsEditProjection] = useState(false);
  const [projectingCompany, setProjectingCompany] = useState("");
  const [showBookingDate, setShowBookingDate] = useState(false)
  const [startDateAnother, setStartDateAnother] = useState(new Date());
  const [endDateAnother, setEndDateAnother] = useState(new Date());
  const [openProjection, setOpenProjection] = useState(false);
  const [socketID, setSocketID] = useState("");
  const [totalBooking, setTotalBooking] = useState([]);
  //const [uniqueArray, setuniqueArray] = useState([])
  const [filteredBooking, setFilteredBooking] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true);
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
  console.log(data)

  const fetchEmployeeData = async () => {
    fetch(`${secretKey}/edata-particular/${data.ename}`)
      .then((response) => response.json())
      .then((data) => {
        setEmpData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  console.log("empData", empData)

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

  const tableEmployee = data.ename;
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    fetchEmployeeData();
  }, [data]);
  const formattedDates =
    empData.length !== 0 &&
    empData.map((data) => formatDate(data.AssignDate));
  console.log("Formatted Dates", formattedDates);
  const uniqueArray = formattedDates && [...new Set(formattedDates)];

  // ---------------------------Bookings Part --------------------------------------
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(`${secretKey}/company-ename/${data.ename}`);
        setTotalBooking(response.data);
        setFilteredBooking(response.data);
      } catch (error) {
        console.error("Error fetching company details:", error.message);
      }
    };
    fetchBookingDetails();
  }, [data.ename]);

  console.log("filteredBookings", filteredBooking)

  const handleCloseIconClickAnother = () => {
    if (showBookingDate) {
      setShowBookingDate(false)
    }
  }
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
        console.log(response.data); // Log response for debugging
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

  const fetchFollowUpData = async () => {
    try {
      const response = await fetch(
        `${secretKey}/projection-data/${data.ename}`
      );
      const followdata = await response.json();
      setFollowData(followdata);
      setFollowDataFilter(followData)
    } catch (error) {
      console.error("Error fetching data:", error);
      return { error: "Error fetching data" };
    }
  };

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
    calculateSum(followData);

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
    setSelectedValues([]);
  };

  const handleProjectionSubmit = async () => {
    try {
      const finalData = {
        ...currentProjection,
        companyName: projectingCompany,
        ename: data.ename,
        offeredServices: selectedValues,
      };
      if (finalData.offeredServices.length === 0) {
        Swal.fire({ title: "Services is required!", icon: "warning" });
      } else if (finalData.remarks === "") {
        Swal.fire({ title: "Remarks is required!", icon: "warning" });
      } else if (finalData.totalPayment === 0) {
        Swal.fire({ title: "Payment is required!", icon: "warning" });
      } else if (finalData.offeredPrize === 0) {
        Swal.fire({ title: "Offered Prize is required!", icon: "warning" });
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
      }

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
      });
      fetchFollowUpData();

      // Log success message
    } catch (error) {
      console.error("Error updating or adding data:", error.message);
    }
  };

  // -------------------------------date-range-picker-------------------------------------------

  const handleIconClick = () => {
    if (!buttonToggle) {
      setDateRangeDisplay(true);
    } else {
      setDateRangeDisplay(false);
    }
    setButtonToggle(!buttonToggle);
  };

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  const handleSelect = (date) => {
    const filteredDataDateRange = followData.filter((product) => {
      const productDate = new Date(product["lastFollowUpdate"]);

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
  } = calculateSumFilter(filteredDataDateRange);

  //console.log("follow data:", currentProjection);
  // -----------------------------------------------------general-search--------------------------------------------

  function filterSearch(searchTerm) {
    setSearchTerm(searchTerm);
    setFilteredDataDateRange(followData.filter(company =>
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.offeredServices.some(service =>
        service.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      company.totalPayment.toString() === searchTerm ||
      company.offeredPrize.toString() === searchTerm ||
      company.estPaymentDate.includes(searchTerm)

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
        console.log("ascending is working")
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
        console.log("descending is working")
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

  return (
    <div>
      <Header name={data.ename} designation={data.designation} />
      <EmpNav userId={userId} />
      <div className="container-xl mt-2">
        <div className="card">
          <div className="card-header employeedashboard">
            <div className="d-flex justify-content-between">
              <div style={{ minWidth: '14vw' }} className="dashboard-title">
                <h2 style={{ marginBottom: '5px' }}>Your Dashboard</h2>
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
                    uniqueArray.length > 0 ? (
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
                        <td colSpan="11" style={{ textAlign: 'center' }}><Nodata/></td>
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
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* -----------------------------------------------projection dashboard-------------------------------------------------- */}

      <div className="container-xl mt-2">
        <div className="card">
          <div className="card-header employeedashboard d-flex align-items-center justify-content-between">
            <div className="dashboard-title">
              <h2 style={{ marginBottom: '5px' }}>Employee Dashboard</h2>
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
                {/* <CiSearch
                  style={{
                    width: "19px",
                    height: "20px",
                    marginRight: "5px",
                    color: "grey"
                  }}
                /> */}
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
                      width: "20px",
                      height: "20px",
                      color: "#bcbaba",
                      color: "black",
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
          {displayDateRange && (
            <div
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
                    <th>Estimated Payment Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDataDateRange ? (
                    // (
                    //   followData.map((obj, index) => (
                    //     <tr key={`row-${index}`}>
                    //       <td style={{
                    //         lineHeight: "32px",
                    //       }}>{index + 1}</td>
                    //       <td>{obj.companyName}</td>
                    //       <td>{obj.offeredServices.join(', ')}</td>
                    //       <td>{obj.totalPayment && obj.totalPayment.toLocaleString()}
                    //       </td>
                    //       <td>{obj.offeredPrize.toLocaleString()}
                    //       </td>
                    //       <td>{obj.estPaymentDate}
                    //       </td>
                    //     </tr>
                    //   ))) :
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
                        <td>{obj.estPaymentDate}</td>
                        <td>
                          <IconButton
                            onClick={() => {
                              functionopenprojection(obj.companyName);
                            }}
                          >
                            <EditIcon color="primary"></EditIcon>
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
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* -----------------------------------------------Booking dashboard-------------------------------------------------- */}


      <div className="container-xl mt-2">
        <div className="card">
          <div className="card-header employeedashboard d-flex align-items-center justify-content-between">
            <div>
              <h2>Bookings Dashboard</h2>
            </div>
            <div className="d-flex justify-content-between" style={{ gap: "10px" }}>
              <div className=" form-control d-flex justify-content-center align-items-center general-searchbar">
                <input
                  className=""
                  value={newSearchTerm}
                  onChange={(e) => filterSearchBooking(e.target.value)}
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
                <button onClick={() => setShowBookingDate(!showBookingDate)} style={{ border: "none", padding: "0px", backgroundColor: "white" }}>
                  <FaRegCalendar style={{ width: "20px", height: "20px", color: "#bcbaba", color: "black" }} />
                </button>
              </div>
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
                <tbody>
                  {filteredBooking ? (
                    <>
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
                    </>
                  ) : (
                    <tr>
                      <td style={{ position: "absolute", left: "50%", textAlign: 'center', verticalAlign: 'middle' }}>
                        <ScaleLoader
                          color="lightgrey"
                          loading
                          cssOverride={override}
                          size={10}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                      </td>
                    </tr>
                  )}

                </tbody>
                {
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
                        {filteredBooking

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
                      <th>-</th>
                      <th>-</th>
                      <th>-</th>
                    </tr>
                  </tfoot>
                }
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
          onClose={closeProjection}
        >
          <div style={{ width: "31em" }} className="container-xl">
            <div className="header d-flex justify-content-between align-items-center">
              <h1 style={{ marginBottom: "0px" }} className="title">
                Projection Form
              </h1>
              <IconButton>
                <EditIcon color="primary"></EditIcon>
              </IconButton>
            </div>
            <hr style={{ marginBottom: "10px" }} />
            <div className="body-projection">
              <div className="header mb-2">
                <strong style={{ fontSize: "20px" }}>
                  {projectingCompany}
                </strong>
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
                <strong>Offered prizes :</strong>
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
                  />
                </div>
              </div>
              <div className="label">
                <strong>Total Payment :</strong>
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
                  />
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
                  />
                </div>
              </div>
              <div className="submitBtn">
                <button
                  style={{ width: "100%" }}
                  type="submit"
                  class="btn btn-primary mb-3"
                  onClick={handleProjectionSubmit}
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

export default EmployeeDashboard;
