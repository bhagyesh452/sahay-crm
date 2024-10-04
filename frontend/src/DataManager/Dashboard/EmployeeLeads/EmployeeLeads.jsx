import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../Components/Navbar/Navbar.jsx";
import Header from "../../Components/Header/Header.jsx";
import { useParams, useLocation } from "react-router-dom";
import { IconBoxPadding, IconChevronLeft, IconEye } from "@tabler/icons-react";
import PageviewIcon from '@mui/icons-material/Pageview';
import { IconChevronRight } from "@tabler/icons-react";
import { IconButton, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { options } from "../../../components/Options.js";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import { Link } from "react-router-dom";
import Select from "react-select";
import "../../../assets/styles.css";
// import "./styles/table.css";
import { Drawer } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import Swal from "sweetalert2";
//import LoginDetails from "../components/LoginDetails";
import Nodata from "../../Components/Nodata/Nodata.jsx";
//import EditForm from "../components/EditForm";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FilterListIcon from "@mui/icons-material/FilterList";
import { HiOutlineEye } from "react-icons/hi";
import { RiEditCircleFill } from "react-icons/ri";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { MdOutlineEditOff } from "react-icons/md";
import { HiChevronDoubleLeft } from "react-icons/hi";
import { HiChevronDoubleRight } from "react-icons/hi";
import { TbChevronLeftPipe } from "react-icons/tb";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import ScaleLoader from "react-spinners/ScaleLoader";
import ClipLoader from "react-spinners/ClipLoader";
//import LeadFormPreview from "./LeadFormPreview";
import Box from "@mui/material/Box";
//import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { AiOutlineTeam } from "react-icons/ai";
import { GoPerson } from "react-icons/go";
import { MdOutlinePersonPin } from "react-icons/md";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { MdDeleteOutline } from "react-icons/md";
import { IoFilterOutline } from "react-icons/io5";
import { MdOutlinePostAdd } from "react-icons/md";
import { RiShareForwardFill } from "react-icons/ri";
import { IoIosClose } from "react-icons/io";
import { Country, State, City } from 'country-state-city';




const secretKey = process.env.REACT_APP_SECRET_KEY;
const frontendKey = process.env.REACT_APP_FRONTEND_KEY;


function EmployeeLeads() {

    const { id } = useParams();
    const [myInfo, setMyInfo] = useState([]);
    const [openAssign, openchangeAssign] = useState(false);
    const [openAnchor, setOpenAnchor] = useState(false);
    const [openRemarks, openchangeRemarks] = useState(false);
    const [openlocation, openchangelocation] = useState(false);
    const [projectingCompany, setProjectingCompany] = useState("");
    const [maturedID, setMaturedID] = useState("");
    const [currentForm, setCurrentForm] = useState(null);
    const [openProjection, setOpenProjection] = useState(false);
    const [currentTab, setCurrentTab] = useState("Leads");
    const [bdmWorkOn, setBdmWorkOn] = useState(false)
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
    const [projectionData, setProjectionData] = useState([]);
    const [loginDetails, setLoginDetails] = useState([]);
    const [nowToFetch, setNowToFetch] = useState(false);
    const [employeeData, setEmployeeData] = useState([]);
    const [employeeName, setEmployeeName] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [dataStatus, setdataStatus] = useState("All");
    const [moreEmpData, setmoreEmpData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 500;
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const [searchText, setSearchText] = useState("");
    const [citySearch, setcitySearch] = useState("");
    const [visibility, setVisibility] = useState("none");
    const [visibilityOther, setVisibilityOther] = useState("block");
    const [visibilityOthernew, setVisibilityOthernew] = useState("none");
    const [subFilterValue, setSubFilterValue] = useState("");
    const [selectedField, setSelectedField] = useState("Company Name");
    const [newempData, setnewEmpData] = useState([]);
    const [openLogin, setOpenLogin] = useState(false);
    const [openCSV, openchangeCSV] = useState(false);
    const [maturedCompanyName, setMaturedCompanyName] = useState("");
    const [companies, setCompanies] = useState([]);
    const [month, setMonth] = useState(0);
    const [incoFilter, setIncoFilter] = useState("");
    const [openIncoDate, setOpenIncoDate] = useState(false);
    const [backButton, setBackButton] = useState(false);
    const [loading, setLoading] = useState(false)
    const [companiesLoading, setCompaniesLoading] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState()
    const [selectedEmployee2, setSelectedEmployee2] = useState()
    // const [updateData, setUpdateData] = useState({});
    const [eData, seteData] = useState([]);
    const [year, setYear] = useState(0);
    const [selectedRows, setSelectedRows] = useState([]);
    const [bdmName, setBdmName] = useState("Not Alloted");
    const [openAssignToBdm, setOpenAssignToBdm] = useState(false);
    const [branchName, setBranchName] = useState("");
    const userId = localStorage.getItem("dataManagerUserId");
    function formatDate(inputDate) {
        const options = { year: "numeric", month: "long", day: "numeric" };
        const formattedDate = new Date(inputDate).toLocaleDateString(
            "en-US",
            options
        );
        return formattedDate;
    }

    // States for filtered and searching data :
    const stateList = State.getStatesOfCountry("IN");
    const cityList = City.getCitiesOfCountry("IN");
    const [extraData, setExtraData] = useState([]);
    const [newData, setNewData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isSearch, setIsSearch] = useState(false);
    const [isFilter, setIsFilter] = useState(false);
    const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedStateCode, setSelectedStateCode] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState(City.getCitiesOfCountry("IN"));
    const [selectedNewCity, setSelectedNewCity] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedBDEName, setSelectedBDEName] = useState("");
    const [selectedAssignDate, setSelectedAssignDate] = useState(null);
    const [selectedAdminName, setSelectedAdminName] = useState("");
    const [daysInMonth, setDaysInMonth] = useState([]);
    const [selectedDate, setSelectedDate] = useState(0);
    const [selectedCompanyIncoDate, setSelectedCompanyIncoDate] = useState(null);
    const [openBacdrop, setOpenBacdrop] = useState(false);
    const [companyIncoDate, setCompanyIncoDate] = useState(null);
    const [monthIndex, setMonthIndex] = useState(0);
    const [leadHistoryData, setLeadHistoryData] = useState([])
    const currentYear = new Date().getFullYear();
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const years = Array.from({ length: currentYear - 1990 }, (_, index) => currentYear - index);

    const formatDateLeadHistory = (dateInput) => {
        console.log(dateInput)
        // Create a Date object if input is a string
        const date = new Date(dateInput);

        if (isNaN(date.getTime())) {
            console.error('Invalid date:', dateInput);
            return '';
        }

        // Get day, month, and year
        const day = date.getDate().toString().padStart(2, '0'); // Ensure two digits
        const month = date.toLocaleString('default', { month: 'long' }); // e.g., "August"
        const year = date.getFullYear();

        return `${day} ${month}, ${year}`;
    };

    function formatTime(timeString) {
        // Assuming timeString is in "3:23:14 PM" format
        const [time, period] = timeString.split(' ');
        const [hours, minutes, seconds] = time.split(':').map(Number);

        // Convert 24-hour format to 12-hour format
        const formattedHours = hours % 12 || 12; // Convert 0 hours to 12
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const formattedTime = `${formattedHours}:${formattedMinutes} ${period}`;

        return formattedTime;
    }

    // Function to calculate and format the time difference
    function timePassedSince(dateTimeString) {
        const entryTime = new Date(dateTimeString);
        const now = new Date();

        // Calculate difference in milliseconds
        const diffMs = now - entryTime;

        // Convert milliseconds to minutes and hours
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        // Format the difference
        if (diffDays > 0) {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        } else if (diffHours > 0) {
            return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else {
            return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
        }
    }

    useEffect(() => {
        document.title = `Dataanalyst-Sahay-CRM`;
    }, []);

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

    // Function to fetch employee details by id
    const fetchEmployeeDetails = async () => {
        try {
            const response = await axios.get(`${secretKey}/employee/einfo`);
            const response2 = await axios.get(`${secretKey}/employee/deletedemployeeinfo`);

            // Filter the response data to find _id values where designation is "Sales Executive" or "Sales Manager"
            const salesExecutivesIds = response.data
                .filter((employee) => employee.designation === "Sales Executive" || employee.designation === "Sales Manager")
                .map((employee) => employee._id);

            const salesExecutivesIds2 = response2.data
                .filter((employee) => employee.designation === "Sales Executive" || employee.designation === "Sales Manager")
                .map((employee) => employee._id);

            // Find the employee by id and set the name
            const selectedEmployee = response.data.find((employee) => employee._id === id);
            const selectedEmployee2 = response2.data.find((employee) => employee._id === id);

            if (selectedEmployee) {
                setSelectedEmployee(selectedEmployee)
                seteData(salesExecutivesIds);
            } else if (selectedEmployee2) {
                setSelectedEmployee2(selectedEmployee2)
                seteData(salesExecutivesIds2)
            }
            //console.log(selectedEmployee);
            //console.log(selectedEmployee2);

            if ((selectedEmployee && salesExecutivesIds.length > 0 && salesExecutivesIds[0] === selectedEmployee._id) ||
                (selectedEmployee2 && salesExecutivesIds2.length > 0 && salesExecutivesIds2[0] === selectedEmployee2._id)) {
                // If either selectedEmployee matches the condition or selectedEmployee2 matches the condition, set the visibility of the back button to false
                console.log("false")
                setBackButton(false); // assuming backButton is your back button element
            } else {
                console.log("true condition")
                // Otherwise, set the visibility to true
                setBackButton(true); // or any other appropriate display style
            }


            // Check if selectedEmployee or selectedEmployee2 is defined and then access their properties
            if (selectedEmployee && selectedEmployee._id) {
                //console.log("yahan nahi");
                setEmployeeName(selectedEmployee.ename);
                setBdmWorkOn(selectedEmployee.bdmWork);
                setBranchName(selectedEmployee.branchOffice);
            } else if (selectedEmployee2 && selectedEmployee2._id) {
                //console.log("yahan chala");
                setEmployeeName(selectedEmployee2.ename);
                setBdmWorkOn(selectedEmployee2.bdmWork);
                setBranchName(selectedEmployee2.branchOffice);
            } else {
                //console.log("yahan bhi");
                // Handle the case where no employee is found with the given id
                setEmployeeName("Employee not found");
            }
        } catch (error) {
            console.error("Error fetching employee details:", error.message);
        }
    };

    const functionopenAnchor = () => {
        setTimeout(() => {
            setOpenAnchor(true);
        }, 500);
    };

    const closeAnchor = () => {
        setOpenAnchor(false);
    };

    const fetchRedesignedFormData = async () => {
        try {
            //console.log(maturedID);
            const response = await axios.get(`${secretKey}/bookings/redesigned-final-leadData`);
            const data = response.data.find(obj => obj.company === maturedID);
            setCurrentForm(data);

        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };

    useEffect(() => {
        //console.log("Matured ID Changed", maturedID);
        if (maturedID) {
            fetchRedesignedFormData();
        }

    }, [maturedID])

    // useEffect(() => {
    //     if (employeeName) {
    //         const fetchCompanies = async () => {
    //             try {
    //                 setCompaniesLoading(true)
    //                 const response = await fetch(`${secretKey}/companies`);
    //                 const data = await response.json();

    //                 // Filter and format the data based on employeeName
    //                 const formattedData = data.companies
    //                     .filter(
    //                         (entry) =>
    //                             entry.bdeName === employeeName || entry.bdmName === employeeName
    //                     )
    //                     .map((entry) => ({
    //                         "Company Name": entry.companyName,
    //                         "Company Number": entry.contactNumber,
    //                         "Company Email": entry.companyEmail,
    //                         "Company Incorporation Date": entry.incoDate,
    //                         City: "NA",
    //                         State: "NA",
    //                         ename: employeeName,
    //                         AssignDate: entry.bookingDate,
    //                         Status: "Matured",
    //                         Remarks: "No Remarks Added",
    //                     }));
    //                 setCompanies(formattedData);
    //             } catch (error) {
    //                 console.error("Error fetching companies:", error);
    //                 setCompanies([]);
    //             } finally {
    //                 setCompaniesLoading(false)
    //             }
    //         };
    //         fetchCompanies();
    //     }
    // }, [employeeName]);

    // Function to fetch new data based on employee name
    const fetchNewData = async () => {
        try {

            setLoading(true);
            const response = await axios.get(`${secretKey}/company-data/employees/${employeeName}`);
            const response2 = await axios.get(`${secretKey}/company-data/leadDataHistoryInterested/${employeeName}`);
            const leadHistory = response2.data

            // Sort the data by AssignDate property
            const sortedData = response.data.sort((a, b) => {
                // Assuming AssignDate is a string representation of a date
                return new Date(b.AssignDate) - new Date(a.AssignDate);
            });
            setLeadHistoryData(leadHistory)
            setExtraData(sortedData);
            setNewData(sortedData);
            setmoreEmpData(sortedData);
            if (isFilter || isSearch) {
                setEmployeeData(filteredData);
            } else {
                setEmployeeData(
                    sortedData.filter(
                        (obj) =>
                            (obj.Status === "Busy" ||
                                obj.Status === "Not Picked Up" ||
                                obj.Status === "Untouched") &&
                            (obj.bdmAcceptStatus !== "Forwarded" &&
                                obj.bdmAcceptStatus !== "Accept" &&
                                obj.bdmAcceptStatus !== "Pending")
                    )
                );
            }
        } catch (error) {
            console.error("Error fetching new data:", error);
        } finally {
            setLoading(false);
        }
    };

    // console.log(moreEmpData.filter(
    //     (obj) =>
    //         (obj.Status === "Busy" ||
    //             obj.Status === "Not Picked Up" ||
    //             obj.Status === "Untouched") &&
    //         (obj.bdmAcceptStatus !== "Forwarded" &&
    //             obj.bdmAcceptStatus !== "Accept" &&
    //             obj.bdmAcceptStatus !== "Pending")));

    useEffect(() => {
        // Fetch employee details and related data when the component mounts or id changes
        fetchEmployeeDetails();
        fetchnewData();
        fetchRemarksHistory();
        fetchProjections();
        axios
            .get(`${secretKey}/loginDetails`)
            .then((response) => {
                // Update state with fetched login details
                setLoginDetails(response.data);
            })
            .catch((error) => {
                console.error("Error fetching login details:", error);
            });
    }, []);

    useEffect(() => {
        if (employeeName) {
            console.log("Employee found");
            fetchNewData();
        } else {
            console.log("No employees found");
        }
    }, [employeeName]);

    const handleSearch = (searchQuery) => {
        const searchQueryLower = searchQuery.toLowerCase();

        // Check if searchQuery is empty or null
        if (!searchQuery || searchQuery.trim().length === 0) {
            setIsSearch(false);
            setFilteredData(extraData); // Assuming extraData is your full dataset
            return;
        }

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
                            obj.Status === "Interested" &&
                            obj.bdmAcceptStatus === "NotForwarded" &&
                            obj.bdmAcceptStatus !== "Pending" &&
                            obj.bdmAcceptStatus !== "Accept"
                    )
                );
            } else if (dataStatus === 'FollowUp') {
                setEmployeeData(
                    filteredData.filter(
                        (obj) =>
                            obj.Status === "FollowUp" &&
                            obj.bdmAcceptStatus === "NotForwarded" &&
                            obj.bdmAcceptStatus !== "Pending" &&
                            obj.bdmAcceptStatus !== "Accept"
                    )
                )
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
                    setdataStatus('FollowUp')
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
        }

    }, [filteredData]);

    // const filteredData = employeeData.filter((company) => {
    //     const fieldValue = company[selectedField];

    //     if (selectedField === "State" && citySearch) {
    //         // Handle filtering by both State and City
    //         const stateMatches = fieldValue
    //             .toLowerCase()
    //             .includes(searchText.toLowerCase());
    //         const cityMatches = company.City.toLowerCase().includes(
    //             citySearch.toLowerCase()
    //         );
    //         return stateMatches && cityMatches;
    //     } else if (selectedField === "Company Incorporation Date  ") {
    //         // Assuming you have the month value in a variable named `month`
    //         if (month == 0) {
    //             return fieldValue.includes(searchText);
    //         } else if (year == 0) {
    //             return fieldValue.includes(searchText);
    //         }
    //         const selectedDate = new Date(fieldValue);
    //         const selectedMonth = selectedDate.getMonth() + 1; // Months are 0-indexed
    //         const selectedYear = selectedDate.getFullYear();

    //         // Use the provided month variable in the comparison
    //         return (
    //             selectedMonth.toString().includes(month) &&
    //             selectedYear.toString().includes(year)
    //         );
    //     } else if (selectedField === "Status" && searchText === "All") {
    //         // Display all data when Status is "All"
    //         return true;
    //     } else {
    //         // Your existing filtering logic for other fields
    //         if (typeof fieldValue === "string") {
    //             return fieldValue.toLowerCase().includes(searchText.toLowerCase());
    //         } else if (typeof fieldValue === "number") {
    //             return fieldValue.toString().includes(searchText);
    //         } else if (fieldValue instanceof Date) {
    //             // Handle date fields
    //             return fieldValue.includes(searchText);
    //         }

    //         return false;
    //     }
    // });


    const handleFieldChange = (event) => {
        if (event.target.value === "Company Incorporation Date  ") {
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
    const currentData = employeeData.slice(startIndex, endIndex);

    // useEffect(() => {
    //   // Fetch new data based on employee name when the name changes
    //   if (employeeName !== 'Employee not found') {
    //     fetchNewData();
    //   }
    // }, [employeeName]);

    // const handleCheckboxChange = (id, event) => {
    //     // If the id is 'all', toggle all checkboxes
    //     if (id === "all") {
    //         // If all checkboxes are already selected, clear the selection; otherwise, select all
    //         setSelectedRows((prevSelectedRows) =>
    //             prevSelectedRows.length === filteredData.length
    //                 ? []
    //                 : filteredData.map((row) => row._id)
    //         );
    //     } else {
    //         // Toggle the selection status of the row with the given id
    //         setSelectedRows((prevSelectedRows) => {
    //             // If the Ctrl key is pressed
    //             if (event.ctrlKey) {
    //                 //console.log("pressed");
    //                 const selectedIndex = filteredData.findIndex((row) => row._id === id);
    //                 const lastSelectedIndex = filteredData.findIndex((row) =>
    //                     prevSelectedRows.includes(row._id)
    //                 );

    //                 // Select rows between the last selected row and the current row
    //                 if (lastSelectedIndex !== -1 && selectedIndex !== -1) {
    //                     const start = Math.min(selectedIndex, lastSelectedIndex);
    //                     const end = Math.max(selectedIndex, lastSelectedIndex);
    //                     const idsToSelect = filteredData
    //                         .slice(start, end + 1)
    //                         .map((row) => row._id);

    //                     return prevSelectedRows.includes(id)
    //                         ? prevSelectedRows.filter((rowId) => !idsToSelect.includes(rowId))
    //                         : [...prevSelectedRows, ...idsToSelect];
    //                 }
    //             }

    //             // Toggle the selection status of the row with the given id
    //             return prevSelectedRows.includes(id)
    //                 ? prevSelectedRows.filter((rowId) => rowId !== id)
    //                 : [...prevSelectedRows, id];
    //         });
    //     }
    // };
    const handleCheckboxChange = (id, event) => {
        // If the id is 'all', toggle all checkboxes
        if (id === "all") {
            // If all checkboxes are already selected, clear the selection; otherwise, select all
            setSelectedRows((prevSelectedRows) =>
                prevSelectedRows.length === employeeData.length
                    ? []
                    : employeeData.map((row) => row._id)
            );
        } else {
            // Toggle the selection status of the row with the given id
            setSelectedRows((prevSelectedRows) => {
                // If the Ctrl key is pressed
                if (event.ctrlKey) {
                    //console.log("pressed");
                    const selectedIndex = employeeData.findIndex((row) => row._id === id);
                    const lastSelectedIndex = employeeData.findIndex((row) =>
                        prevSelectedRows.includes(row._id)
                    );

                    // Select rows between the last selected row and the current row
                    if (lastSelectedIndex !== -1 && selectedIndex !== -1) {
                        const start = Math.min(selectedIndex, lastSelectedIndex);
                        const end = Math.max(selectedIndex, lastSelectedIndex);
                        const idsToSelect = employeeData
                            .slice(start, end + 1)
                            .map((row) => row._id);

                        return prevSelectedRows.includes(id)
                            ? prevSelectedRows.filter((rowId) => !idsToSelect.includes(rowId))
                            : [...prevSelectedRows, ...idsToSelect];
                    }
                }

                // Toggle the selection status of the row with the given id
                return prevSelectedRows.includes(id)
                    ? prevSelectedRows.filter((rowId) => rowId !== id)
                    : [...prevSelectedRows, id];
            });
        }
    };

    // const [employeeSelection, setEmployeeSelection] = useState("Select Employee");
    const [newemployeeSelection, setnewEmployeeSelection] = useState("Not Alloted");

    const fetchnewData = async () => {
        try {
            const response = await axios.get(`${secretKey}/employee/einfo`);
            // Set the retrieved data in the state
            setnewEmpData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };

    const handleFilterIncoDate = () => {
        setOpenIncoDate(!openIncoDate);
    };

    useEffect(() => {
        if (employeeName) {
            fetchNewData();
        }
    }, [nowToFetch]);

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

    const fetchProjections = async () => {
        try {
            const response = await axios.get(`${secretKey}/projection/projection-data`);
            setProjectionData(response.data);
        } catch (error) {
            console.error("Error fetching Projection Data:", error.message);
        }
    };
    const functionOpenAssign = () => {
        openchangeAssign(true);
    };
    const closepopupAssign = () => {
        openchangeAssign(false);
    };
    const functionopenlocation = () => {
        openchangelocation(true);
    };
    const closepopuplocation = () => {
        openchangelocation(false);
    };
    const [selectedOption, setSelectedOption] = useState("direct");
    const [startRowIndex, setStartRowIndex] = useState(null);

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
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
                estPaymentDate: findOneprojection.estPaymentDate,
                totalPayment: findOneprojection.totalPayment,
                date: "",
                time: "",
            });
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
    };

    const handleUploadData = async (e) => {
        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();

        const csvdata = employeeData
            .filter((employee) => selectedRows.includes(employee._id))
            .map((employee) => ({
                ...employee,
                Status: "Untouched",
                Remarks: "No Remarks Added",
            }));

        try {
            Swal.fire({
                title: 'Assigning...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const response = await axios.post(`${secretKey}/company-data/assign-new`, {
                ename: newemployeeSelection,
                data: csvdata,
            });

            Swal.close();
            Swal.fire({
                title: "Data Sent!",
                text: "Data sent successfully!",
                icon: "success",
            });

            setnewEmployeeSelection("Not Alloted");
            fetchEmployeeDetails();
            fetchNewData();
            closepopupAssign();
            setSelectedRows([])
            setIsFilter(false)
            setIsSearch(false)
        } catch (error) {
            console.error("Error updating employee data:", error);
            Swal.close();
            Swal.fire({
                title: "Error!",
                text: "Failed to update employee data. Please try again later.",
                icon: "error",
            });
        }
    };

    //console.log(loginDetails);

    // const handleMouseDown = (id) => {
    //     // Initiate drag selection
    //     setStartRowIndex(filteredData.findIndex((row) => row._id === id));
    // };

    const handleMouseDown = (id) => {
        // Initiate drag selection
        setStartRowIndex(employeeData.findIndex((row) => row._id === id));
    }

    // const handleMouseEnter = (id) => {
    //     // Update selected rows during drag selection
    //     if (startRowIndex !== null) {
    //         const endRowIndex = filteredData.findIndex((row) => row._id === id);
    //         const selectedRange = [];
    //         const startIndex = Math.min(startRowIndex, endRowIndex);
    //         const endIndex = Math.max(startRowIndex, endRowIndex);

    //         for (let i = startIndex; i <= endIndex; i++) {
    //             selectedRange.push(filteredData[i]._id);
    //         }

    //         setSelectedRows(selectedRange);

    //         // Scroll the window vertically when dragging beyond the visible viewport
    //         const windowHeight = document.documentElement.clientHeight;
    //         const mouseY = window.event.clientY;
    //         const tableHeight = document.querySelector("table").clientHeight;
    //         const maxVisibleRows = Math.floor(
    //             windowHeight / (tableHeight / filteredData.length)
    //         );

    //         if (mouseY >= windowHeight - 20 && endIndex >= maxVisibleRows) {
    //             window.scrollTo(0, window.scrollY + 20);
    //         }
    //     }
    // };

    const handleMouseEnter = (id) => {
        // Update selected rows during drag selection
        if (startRowIndex !== null) {
            const endRowIndex = employeeData.findIndex((row) => row._id === id);
            const selectedRange = [];
            const startIndex = Math.min(startRowIndex, endRowIndex);
            const endIndex = Math.max(startRowIndex, endRowIndex);

            for (let i = startIndex; i <= endIndex; i++) {
                selectedRange.push(employeeData[i]._id);
            }

            setSelectedRows(selectedRange);

            // Scroll the window vertically when dragging beyond the visible viewport
            const windowHeight = document.documentElement.clientHeight;
            const mouseY = window.event.clientY;
            const tableHeight = document.querySelector("table").clientHeight;
            const maxVisibleRows = Math.floor(
                windowHeight / (tableHeight / employeeData.length)
            );

            if (mouseY >= windowHeight - 20 && endIndex >= maxVisibleRows) {
                window.scrollTo(0, window.scrollY + 20);
            }
        }
    };

    const handleMouseUp = () => {
        // End drag selection
        setStartRowIndex(null);
    };
    const [cid, setcid] = useState("");
    const [cstat, setCstat] = useState("");
    const [remarksHistory, setRemarksHistory] = useState([]);
    const [filteredRemarks, setFilteredRemarks] = useState([]);
    const fetchRemarksHistory = async () => {
        try {
            const response = await axios.get(`${secretKey}/remarks/remarks-history`);
            setRemarksHistory(response.data);
            setFilteredRemarks(response.data.filter((obj) => obj.companyID === cid));

            //console.log(response.data);
        } catch (error) {
            console.error("Error fetching remarks history:", error);
        }
    };

    const functionopenpopupremarks = (companyID, companyStatus) => {
        openchangeRemarks(true);
        setFilteredRemarks(
            remarksHistory.filter((obj) => obj.companyID === companyID)
        );
        // console.log(remarksHistory.filter((obj) => obj.companyID === companyID))

        setcid(companyID);
        setCstat(companyStatus);
    };

    const closepopupRemarks = () => {
        openchangeRemarks(false);
        setFilteredRemarks([]);
    };

    const handleChangeUrl = () => {
        const currId = id;
        //console.log(eData); // This is how the array looks like ['65bcb5ac2e8f74845bdc6211', '65bde8cf23df48d5fe3227ca']

        // Find the index of the currentId in the eData array
        const currentIndex = eData.findIndex((itemId) => itemId === currId);

        if (currentIndex !== -1) {
            // Calculate the next index in a circular manner
            const nextIndex = (currentIndex + 1) % eData.length;

            // Get the nextId from the eData array
            const nextId = eData[nextIndex];
            window.location.replace(`/dataanalyst/employeeLeads/${nextId}`);
            //setBackButton(nextId !== 0);
        } else {
            console.log("Current ID not found in eData array.");
        }
    };

    const handleDeleteBooking = async (companyId) => {
        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete this booking. This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel',
        });

        if (confirmDelete.isConfirmed) {
            try {
                const response = await fetch(`${secretKey}/bookings/redesigned-delete-booking/${companyId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                Swal.fire({
                    title: "Booking Deleted Successfully",
                    icon: 'success'
                })
                fetchNewData();
            } catch (error) {
                Swal.fire({
                    title: "Error Deleting the booking!",
                    icon: 'error'
                })
                console.error('Error deleting booking:', error);
                // Optionally, you can show an error message to the user
            }
        } else {
            console.log('No');
        }
    };

    const handleChangeUrlPrev = () => {
        const currId = id;
        //console.log(eData); // This is how the array looks like ['65bcb5ac2e8f74845bdc6211', '65bde8cf23df48d5fe3227ca']

        // Find the index of the currentId in the eData array
        const currentIndex = eData.findIndex((itemId) => itemId === currId);

        if (currentIndex !== -1) {
            // Calculate the previous index in a circular manner
            const prevIndex = (currentIndex - 1 + eData.length) % eData.length;

            if (currentIndex === 0) {

                // If it's the first page, navigate to the employees page
                window.location.replace(`/dataanalyst/newEmployees`);
                //setBackButton(false)
            } else {
                // Get the previousId from the eData array

                const prevId = eData[prevIndex];
                window.location.replace(`/dataanalyst/employeeLeads/${prevId}`);
            }
            //setBackButton(prevIndex !== 0);
        } else {
            console.log("Current ID not found in eData array.");
        }
    };

    const dataManagerName = localStorage.getItem("dataManagerName")
    console.log(dataManagerName)


    // ------------------------------panel-----------------------------------------

    function CustomTabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    CustomTabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }
    const location = useLocation();
    const [value, setValue] = React.useState(location.pathname === `/dataanalyst/employeeLeads/${id}` ? 0 : 1);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    //--------------------function to reverse assign-------------------------

    const handleReverseAssign = async (
        companyId,
        companyName,
        bdmAcceptStatus,
        empStatus,
        bdmName
    ) => {
        if (bdmAcceptStatus !== "NotForwarded") {
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
        }
    };

    // ----------------------------------filter functions----------------------------
    const functionCloseFilterDrawer = () => {
        setOpenFilterDrawer(false)
    }

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
                !selectedCompanyIncoDate
            ) {
                // If no filters are applied, reset the filter state and stop the backdrop
                setIsFilter(false);

            } else {
                // Update the employee data with the filtered results
                console.log(response.data);
                setFilteredData(response.data);
            }
        } catch (error) {
            console.log('Error applying filter', error.message);
        } finally {
            setOpenBacdrop(false);
            setOpenFilterDrawer(false);
        }
    };

    const handleClearFilter = () => {
        setIsFilter(false);
        functionCloseFilterDrawer();
        setSelectedStatus('');
        setSelectedState('');
        setSelectedNewCity('');
        setSelectedYear('');
        setSelectedMonth('');
        setSelectedDate(0);
        setSelectedAssignDate(null);
        setCompanyIncoDate(null);
        setSelectedCompanyIncoDate(null);
        fetchNewData();
        //fetchData(1, latestSortCount);
    };

    const handleCloseForwardBdmPopup = () => {
        setOpenAssignToBdm(false);
    };

    const handleForwardDataToBDM = async (bdmName) => {
        const data = employeeData.filter((employee) => selectedRows.includes(employee._id) && employee.Status !== "Untouched" && employee.Status !== "Busy" && employee.Status !== "Not Picked");
        // console.log("data is:", data);
        if (selectedRows.length === 0) {
            Swal.fire("Please Select the Company to Forward", "", "Error");
            setBdmName("Not Alloted");
            handleCloseForwardBdmPopup();
            return;
        }
        if (data.length === 0) {
            Swal.fire("Can Not Forward Untouched Company", "", "Error");
            setBdmName("Not Alloted");
            handleCloseForwardBdmPopup();
            return;
        }
        try {
            const response = await axios.post(`${secretKey}/bdm-data/leadsforwardedbyadmintobdm`, {
                data: data,
                name: bdmName
            });
            fetchNewData();
            Swal.fire("Company Forwarded", "", "success");
            setBdmName("Not Alloted");
            handleCloseForwardBdmPopup();
            setdataStatus("All");
            console.log("response data is:", response);
        } catch (error) {
            console.log("error fetching data", error.message);
        }
    };

    // console.log("User id is :", id);

    const fetchPersonalInfo = async () => {
        try {
            const res = await axios.get(`${secretKey}/employee/fetchEmployeeFromId/${userId}`);
            // console.log("Personal Info :", res.data.data);
            setMyInfo(res.data.data);
        } catch (error) {
            console.log("Error fetching employee data :", error);
        }
    };

    useEffect(() => {
        fetchPersonalInfo();
    }, []);

    return (
        <div>
            {/* <Header id={myInfo._id} name={myInfo.ename} empProfile={myInfo.profilePhoto && myInfo.profilePhoto.length !== 0 && myInfo.profilePhoto[0].filename} gender={myInfo.gender} designation={myInfo.newDesignation} />
            <Navbar name={dataManagerName} /> */}

            <div className="page-wrapper">
                <div
                    style={{
                        margin: "3px 0px 1px 0px",
                    }}
                    className="page-header d-print-none">
                    <div className="container-xl">
                        <div className="row g-2 align-items-center">
                            <div className="col d-flex justify-content-between">
                                {/* <!-- Page pre-title --> */}
                                <div className="d-flex">
                                    <IconButton>
                                        <IconChevronLeft onClick={handleChangeUrlPrev} />
                                    </IconButton>
                                    <h2 className="page-title">{employeeName}</h2>
                                    <div className="nextBtn">
                                        <IconButton onClick={handleChangeUrl}>
                                            < IconChevronRight style={{
                                                // backgroundColor: "#fbb900",
                                                // borderRadius: "5px",
                                                // padding: "2px",
                                                // color: "white"
                                            }} />
                                        </IconButton>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-center">

                                    {/* {selectedRows.length !== 0 && (
                                        <div className="request">
                                            <div className="btn-list">
                                                <button
                                                    onClick={functionOpenAssign}
                                                    className="btn btn-primary d-none d-sm-inline-block 2"
                                                >
                                                    Assign Data
                                                </button>
                                                <a
                                                    href="#"
                                                    className="btn btn-primary d-sm-none btn-icon"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#modal-report"
                                                    aria-label="Create new report"
                                                > */}
                                    {/* <!-- Download SVG icon from http://tabler-icons.io/i/plus --> */}
                                    {/* </a>
                                            </div>
                                        </div>
                                    )} */}

                                    {/* <div className="form-control sort-by" >
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
                                                                    if (a.Status === selectedOption) return -1;
                                                                    if (b.Status === selectedOption) return 1;
                                                                    return 0;
                                                                })
                                                        );
                                                        break;
                                                    case "Interested":
                                                        setdataStatus("Interested");
                                                        setEmployeeData(
                                                            moreEmpData
                                                                .filter((data) => data.Status === "Interested")
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
                                                                .filter((data) => data.Status === "FollowUp")
                                                                .sort((a, b) =>
                                                                    a.AssignDate.localeCompare(b.AssignDate)
                                                                )
                                                        );
                                                        break;
                                                    case "AssignDate":
                                                        setdataStatus("AssignDate");
                                                        setEmployeeData(
                                                            moreEmpData.sort((a, b) =>
                                                                b.AssignDate.localeCompare(a.AssignDate)
                                                            )
                                                        );
                                                        break;
                                                    case "Company Incorporation Date  ":
                                                        setdataStatus("CompanyIncorporationDate");
                                                        setEmployeeData(
                                                            moreEmpData.sort((a, b) =>
                                                                b["Company Incorporation Date  "].localeCompare(
                                                                    a["Company Incorporation Date  "]
                                                                )
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
                                            <option value="AssignDate">Assigned Date</option>
                                            <option value="Company Incorporation Date  ">
                                                C.Inco. Date
                                            </option>
                                        </select>
                                    </div> */}

                                    {backButton && <div><Link
                                        to={`/dataanalyst/newEmployees`}
                                        style={{ marginLeft: "10px" }}>
                                        <button className="btn btn-primary d-none d-sm-inline-block">
                                            <span><FaArrowLeft style={{ marginRight: "10px", marginBottom: "3px" }} /></span>
                                            Back
                                        </button>
                                    </Link></div>}
                                </div>
                            </div>
                            {/* <!-- Page title actions --> */}
                        </div>
                    </div>
                </div>

                <div className="container-xl card mt-2 mb-2" style={{ width: "95%" }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <a
                                href="#tabs-home-5"
                                onClick={() => {
                                    setCurrentTab("Leads")
                                    window.location.pathname = `/dataanalyst/employeeLeads/${id}`
                                }}
                                className={
                                    currentTab === "Leads"
                                        ? "nav-link"
                                        : "nav-link"
                                }
                                data-bs-toggle="tab"
                            ><Tab label={
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <MdOutlinePersonPin style={{ height: "24px", width: "19px", marginRight: "5px" }} />
                                    <span style={{ fontSize: "12px" }}>
                                        Leads </span>
                                </div>
                            } {...a11yProps(0)} /></a>
                            {bdmWorkOn && (<a
                                href="#tabs-activity-5"
                                onClick={() => {
                                    setCurrentTab("TeamLeads")
                                    window.location.pathname = `/datamanager/datamanagerside-employeeteamleads/${id}`
                                }}
                                className={
                                    currentTab === "TeamLeads"
                                        ? "nav-link"
                                        : "nav-link"
                                }
                                data-bs-toggle="tab"
                            ><Tab
                                    label={
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <AiOutlineTeam style={{ height: "24px", width: "19px", marginRight: "5px" }} />
                                            <span style={{ fontSize: "12px" }}>
                                                Team Leads</span>
                                        </div>
                                    }
                                    {...a11yProps(1)}
                                /></a>)}
                        </Tabs>
                    </Box>
                </div>
                {!openLogin && (
                    <div
                        onCopy={(e) => {
                            e.preventDefault();
                        }}
                        className="page-body"
                        style={{ marginTop: "0px " }}
                    >
                        <div className="container-xl">

                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <div className="d-flex align-items-center">
                                    <div className="btn-group" role="group" aria-label="Basic example">
                                        <button type="button"
                                            className={isFilter ? 'btn mybtn active' : 'btn mybtn'}
                                            onClick={() => setOpenFilterDrawer(true)}
                                        >
                                            <IoFilterOutline className='mr-1' /> Filter
                                        </button>
                                        {selectedRows.length !== 0 && (
                                            <button type="button" className="btn mybtn"
                                                onClick={functionOpenAssign}
                                            >
                                                <MdOutlinePostAdd className='mr-1' />Assign Leads
                                            </button>
                                        )}
                                        <button type="button" className="btn mybtn"
                                            onClick={() => setOpenAssignToBdm(true)}
                                        >
                                            <RiShareForwardFill className='mr-1' /> Forward to BDM
                                        </button>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center">
                                    {selectedRows.length !== 0 && (
                                        <div className="selection-data" >
                                            Total Data Selected : <b>{selectedRows.length}</b>
                                        </div>
                                    )}
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
                                                                obj.Status === "Untouched") && (
                                                                obj.bdmAcceptStatus !== "Forwarded" ||
                                                                obj.bdmAcceptStatus !== "Accept" ||
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
                                                            obj.Status === "Interested" &&
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
                                            <span>Interested </span>
                                            <span className="no_badge">
                                                {
                                                    ((isSearch || isFilter) ? filteredData : moreEmpData).filter(
                                                        (obj) =>
                                                            obj.Status === "Interested" &&
                                                            obj.bdmAcceptStatus === "NotForwarded"
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
                                            <span>Follow Up </span>

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
                                    </li>

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
                                            <span>Matured </span>
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
                                            <span>Not Interested </span>
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
                                            maxHeight: "60vh",
                                        }} id="table-default"
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

                                                    <th>
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                selectedRows.length !== 0
                                                            }
                                                            onChange={() => handleCheckboxChange("all")}
                                                        />
                                                    </th>


                                                    <th className="th-sticky">Sr.No</th>
                                                    <th className="th-sticky1">Company Name</th>
                                                    <th>Company Number</th>
                                                    <th>Status</th>
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
                                                        Assigned On
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
                                                    {(dataStatus === "FollowUp" && (<>
                                                       
                                                        <th>Status Modification Date</th>
                                                        <th>Age</th>
                                                    </>)) ||
                                                        (dataStatus === "Interested" && (<>
                                                            
                                                            <th>Status Modification Date</th>
                                                            <th>Age</th>
                                                        </>))}
                                                    {dataStatus === "Forwarded" && (<>
                                                        <th>BDM Name</th>
                                                        <th>Forwarded Date</th>
                                                        <th>Age</th>
                                                    </>)}
                                                    {dataStatus === "Forwarded" && (
                                                        <th>Action</th>
                                                    )}
                                                    {/* {(dataStatus === "Matured" && <th>Action</th>) ||
                                                        (dataStatus === "FollowUp" && <th>View Projection</th>) ||
                                                        (dataStatus === "Interested" && <th>View Projection</th>)} */}
                                                </tr>
                                            </thead>
                                            {loading ? (
                                                <tbody>
                                                    <tr>
                                                        <td colSpan="11" >
                                                            <div className="LoaderTDSatyle">
                                                                <ClipLoader
                                                                    color="lightgrey"
                                                                    loading
                                                                    size={35}
                                                                    height="25"
                                                                    width="25"
                                                                    aria-label="Loading Spinner"
                                                                    data-testid="loader"
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            ) : (
                                                <>
                                                    {currentData.length !== 0 && (
                                                        <tbody>
                                                            {currentData.map((company, index) => {
                                                                let matchingLeadHistory
                                                                if (Array.isArray(leadHistoryData)) {
                                                                    matchingLeadHistory = leadHistoryData.find(leadHistory => leadHistory._id === company._id);
                                                                    // Do something with matchingLeadHistory
                                                                } else {
                                                                    console.error("leadHistoryData is not an array");
                                                                }
                                                                return (
                                                                    <tr
                                                                        key={index}
                                                                        className={
                                                                            selectedRows.includes(company._id)
                                                                                ? "selected"
                                                                                : ""
                                                                        }
                                                                        style={{ border: "1px solid #ddd" }}
                                                                    >
                                                                        <td
                                                                            style={{
                                                                                position: "sticky",
                                                                                left: 0,
                                                                                zIndex: 1,
                                                                                background: "white",
                                                                            }}
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={selectedRows.includes(company._id)}
                                                                                onChange={(e) =>
                                                                                    handleCheckboxChange(company._id, e)
                                                                                }
                                                                                onMouseDown={() =>
                                                                                    handleMouseDown(company._id)
                                                                                }
                                                                                onMouseEnter={() =>
                                                                                    handleMouseEnter(company._id)
                                                                                }
                                                                                onMouseUp={handleMouseUp}
                                                                            />
                                                                        </td>

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
                                                                            {formatDate(
                                                                                company["Company Incorporation Date  "]
                                                                            )}
                                                                        </td>
                                                                        <td>{company["City"]}</td>
                                                                        <td>{company["State"]}</td>
                                                                        <td>{company["Company Email"]}</td>
                                                                        <td>{formatDate(company["AssignDate"])}</td>
                                                                        {/* {(dataStatus === "FollowUp" || dataStatus === "Interested") && (
                                                                        <td>
                                                                            {company && projectionData && projectionData.some(item => item.companyName === company["Company Name"]) ? (
                                                                                <IconButton>
                                                                                    <HiOutlineEye
                                                                                        onClick={() => {
                                                                                            functionopenprojection(company["Company Name"]);
                                                                                        }}
                                                                                        style={{ cursor: "pointer", width: "17px", height: "17px", color: "fbb900" }}
                                                                                    />
                                                                                </IconButton>
                                                                            ) : (
                                                                                <IconButton>
                                                                                    <HiOutlineEye
                                                                                        style={{ cursor: "pointer", width: "17px", height: "17px" }}
                                                                                        color="lightgrey"
                                                                                    />
                                                                                </IconButton>
                                                                            )}
                                                                        </td>
                                                                    )} */}
                                                                        {(dataStatus === "FollowUp" || dataStatus === "Interested") && (
                                                                            <>
                                                                                <td>
                                                                                    {matchingLeadHistory ? `${formatDateLeadHistory(matchingLeadHistory.date)} || ${formatTime(matchingLeadHistory.time)}` : "-"}
                                                                                </td>
                                                                                <td>
                                                                                    {matchingLeadHistory ? timePassedSince(matchingLeadHistory.date) : "-"}
                                                                                </td>

                                                                            </>
                                                                        )}
                                                                        {(dataStatus === "Forwarded") && (company.bdmAcceptStatus !== "NotForwarded") && (
                                                                            <td>
                                                                                <MdDeleteOutline
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
                                                                                    color="#f70000"
                                                                                />
                                                                            </td>
                                                                        )}
                                                                    </tr>
                                                                )
                                                            })}
                                                        </tbody>
                                                    )}
                                                </>
                                            )}
                                            {companiesLoading ? (
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <div className="LoaderTDSatyle">
                                                                <ClipLoader
                                                                    color="lightgrey"
                                                                    loading
                                                                    size={10}
                                                                    height="25"
                                                                    width="2"
                                                                    aria-label="Loading Spinner"
                                                                    data-testid="loader"
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>

                                                </tbody>
                                            ) : (
                                                <>
                                                    {dataStatus === "null" && companies.length !== 0 && (
                                                        <tbody>
                                                            {companies.map((company, index) => (
                                                                <tr
                                                                    key={index}
                                                                    className={
                                                                        selectedRows.includes(company._id)
                                                                            ? "selected"
                                                                            : ""
                                                                    }
                                                                    style={{ border: "1px solid #ddd" }}>
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
                                                                            }}>
                                                                            <p
                                                                                className="rematkText text-wrap m-0"
                                                                                title={company.Remarks}
                                                                            >
                                                                                {company.Remarks}
                                                                            </p>
                                                                            <span>
                                                                                <HiOutlineEye style={{
                                                                                    fontSize: "15px",
                                                                                    color: "#fbb900"
                                                                                    //backgroundColor: "lightblue",
                                                                                    // Additional styles for the "View" button
                                                                                }}
                                                                                    //className="btn btn-primary d-none d-sm-inline-block"
                                                                                    onClick={() => {
                                                                                        functionopenpopupremarks(
                                                                                            company._id,
                                                                                            company.Status
                                                                                        );
                                                                                    }} />
                                                                            </span>
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
                                                                        <IconButton>
                                                                            <RiEditCircleFill
                                                                                onClick={() => {
                                                                                    functionopenAnchor();
                                                                                    setMaturedCompanyName(
                                                                                        company["Company Name"]
                                                                                    );
                                                                                }}
                                                                                style={{ cursor: "pointer", width: "17px", height: "17px" }}
                                                                                color="lightgrey"
                                                                            />
                                                                        </IconButton>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    )}
                                                </>
                                            )}
                                            {currentData.length === 0 && !loading && (
                                                <tbody>
                                                    <tr>
                                                        <td colSpan="11" className="p-2">
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
                                                {Math.ceil(employeeData.length / itemsPerPage)}
                                            </span>

                                            <IconButton
                                                onClick={() =>
                                                    setCurrentPage((prevPage) =>
                                                        Math.min(
                                                            prevPage + 1,
                                                            Math.ceil(employeeData.length / itemsPerPage) - 1
                                                        )
                                                    )
                                                }
                                                disabled={
                                                    currentPage ===
                                                    Math.ceil(employeeData.length / itemsPerPage) - 1
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
                )}

                {/* Login Details */}
                {/* {openLogin && (
          <>
            <LoginDetails loginDetails={loginDetails} />
          </>
        )} */}
            </div>
            {/* ------------------------------- Assign data -------------------------- */}
            <Dialog
                open={openAssign}
                onClose={closepopupAssign}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Change BDE{" "}
                    <IconButton onClick={closepopupAssign} style={{ float: "right" }}>
                        <CloseIcon color="primary"></CloseIcon>
                    </IconButton>{" "}
                </DialogTitle>
                <DialogContent>
                    <div className="maincon">
                        <div className="con2 d-flex">
                            <div
                                style={
                                    selectedOption === "direct"
                                        ? {
                                            backgroundColor: "#e9eae9",
                                            margin: "10px 10px 0px 0px",
                                            cursor: "pointer",
                                        }
                                        : {
                                            backgroundColor: "white",
                                            margin: "10px 10px 0px 0px",
                                            cursor: "pointer",
                                        }
                                }
                                onClick={() => {
                                    setSelectedOption("direct");
                                }}
                                className="direct form-control"
                            >
                                <input
                                    type="radio"
                                    id="direct"
                                    value="direct"
                                    style={{
                                        display: "none",
                                    }}
                                    checked={selectedOption === "direct"}
                                    onChange={handleOptionChange}
                                />
                                <label htmlFor="direct">Move In General Data</label>
                            </div>
                            <div
                                style={
                                    selectedOption === "someoneElse"
                                        ? {
                                            backgroundColor: "#e9eae9",
                                            margin: "10px 0px 0px 0px",
                                            cursor: "pointer",
                                        }
                                        : {
                                            backgroundColor: "white",
                                            margin: "10px 0px 0px 0px",
                                            cursor: "pointer",
                                        }
                                }
                                className="indirect form-control"
                                onClick={() => {
                                    setSelectedOption("someoneElse");
                                }}
                            >
                                <input
                                    type="radio"
                                    id="someoneElse"
                                    value="someoneElse"
                                    style={{
                                        display: "none",
                                    }}
                                    checked={selectedOption === "someoneElse"}
                                    onChange={handleOptionChange}
                                />
                                <label htmlFor="someoneElse">Assign to Employee</label>
                            </div>
                        </div>
                    </div>
                    {/* <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <button onClick={handleButtonClick}>Choose File</button> */}

                    {selectedOption === "someoneElse" && (
                        <div>
                            {newempData.length !== 0 ? (
                                <>
                                    <div className="dialogAssign">
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                                margin: " 10px 0px 0px 0px",
                                            }}
                                            className="selector"
                                        >
                                            <label>Select an Employee</label>
                                            <div className="form-control">
                                                <select
                                                    style={{
                                                        width: "inherit",
                                                        border: "none",
                                                        outline: "none",
                                                    }}
                                                    value={newemployeeSelection}
                                                    onChange={(e) => {
                                                        setnewEmployeeSelection(e.target.value);
                                                    }}
                                                >
                                                    <option value="Not Alloted" disabled>
                                                        Select employee
                                                    </option>
                                                    {newempData.filter((item) =>
                                                        (item._id !== id)).map((item) => (
                                                            <option value={item.ename}>{item.ename}</option>
                                                        ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <h1>No Employees Found</h1>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
                <button onClick={handleUploadData} className="btn btn-primary">
                    Submit
                </button>
            </Dialog>

            {/* Dialog for location details */}
            <Dialog
                open={openlocation}
                onClose={closepopuplocation}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Location Details{" "}
                    <IconButton onClick={closepopuplocation} style={{ float: "right" }}>
                        <CloseIcon color="primary"></CloseIcon>
                    </IconButton>{" "}
                </DialogTitle>
                <DialogContent>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loginDetails.map((details, index) => (
                                <tr key={index}>
                                    <td>{details.ename}</td>
                                    <td>{details.date}</td>
                                    <td>{details.time}</td>
                                    <td>{details.address}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </DialogContent>
            </Dialog>

            {/* Remarks History Pop up */}
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
                                .reverse()
                                .map((historyItem) => (
                                    <div className="col-sm-12" key={historyItem._id}>
                                        <div className="card RemarkCard position-relative">
                                            <div className="d-flex justify-content-between">
                                                <div className="reamrk-card-innerText">
                                                    <pre>{historyItem.remarks}</pre>
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

            {/* View Bookings Page */}
            <Drawer anchor="right" open={openAnchor} onClose={closeAnchor}>
                <div className="LeadFormPreviewDrawar">
                    <div className="LeadFormPreviewDrawar-header">
                        <div className="Container">
                            <div className="d-flex justify-content-between align-items-center">
                                <div ><h2 className="title m-0 ml-1">Current LeadForm</h2></div>
                                <div>
                                    <IconButton onClick={closeAnchor}>
                                        <CloseIcon />
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        {/* <LeadFormPreview setOpenAnchor={setOpenAnchor} currentLeadForm={currentForm} /> */}
                    </div>
                </div>
            </Drawer>

            {/* Projecting drawer */}
            <Drawer
                style={{ top: "50px" }}
                anchor="right"
                open={openProjection}
                onClose={closeProjection}
            >
                <div style={{ width: "31em" }} className="container-xl">
                    <div className="header d-flex justify-content-between align-items-center" style={{ margin: "10px 0px" }}>
                        <h1 style={{ marginBottom: "0px", fontSize: "20px", }} className="title">
                            Projection Form
                        </h1>
                        <IconButton>
                            <IoClose onClick={closeProjection} style={{ width: "17px", height: "17px" }} />
                        </IconButton>
                    </div>
                    <hr style={{ margin: "0px" }} />
                    <div className="body-projection">
                        <div className="header mb-2">
                            <h1 style={{
                                fontSize: "14px",
                                textShadow: "none",
                                fontFamily: "sans-serif",
                                fontWeight: "400",

                                fontFamily: "Poppins, sans-serif",
                                margin: "10px 0px"
                            }}>{projectingCompany}</h1>
                        </div>
                        <div className="label">
                            <strong>Offered Services</strong>
                            <div className="services mb-3">
                                <Select
                                    isMulti
                                    options={options}
                                    value={
                                        currentProjection.offeredServices.length !== 0 &&
                                        currentProjection.offeredServices.map((value) => ({
                                            value,
                                            label: value,
                                        }))
                                    }
                                    placeholder="No Services Selected"
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="label">
                            <strong>Offered Prices (With GST)</strong>
                            <div className="services mb-3">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="0"
                                    value={currentProjection.offeredPrize}
                                //disabled
                                />
                            </div>
                        </div>
                        <div className="label">
                            <strong>Last Follow Up Date</strong>
                            <div className="services mb-3">
                                <input
                                    type="date"
                                    className="form-control"
                                    placeholder="Lasf followUp date is not mentioned"
                                    value={currentProjection.lastFollowUpdate}
                                //disabled
                                />
                            </div>
                        </div>
                        <div className="label">
                            <strong>Expected Price(With GST)</strong>
                            <div className="services mb-3">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Total Payment is not mentioned"
                                    value={currentProjection.totalPayment}

                                //disabled
                                />
                            </div>
                        </div>
                        <div className="label">
                            <strong>Payment Expected on</strong>
                            <div className="services mb-3">
                                <input
                                    type="date"
                                    className="form-control"
                                    placeholder="Estimated Date not mentioned"
                                    value={currentProjection.estPaymentDate}
                                //disabled
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </Drawer>

            {/* ------------------------------- Forward to BDM -------------------------- */}
            <Dialog
                open={openAssignToBdm}
                onClose={handleCloseForwardBdmPopup}
                fullWidth
                maxWidth="sm">
                <DialogTitle>
                    Forward to BDM{" "}
                    <IconButton onClick={handleCloseForwardBdmPopup} style={{ float: "right" }}>
                        <CloseIcon color="primary"></CloseIcon>
                    </IconButton>{" "}
                </DialogTitle>
                <DialogContent>
                    <div>
                        {newempData.length !== 0 ? (
                            <>
                                <div className="dialogAssign">
                                    <label>Forward to BDM</label>
                                    <div className="form-control">
                                        <select
                                            style={{
                                                width: "inherit",
                                                border: "none",
                                                outline: "none",
                                            }}
                                            value={bdmName}
                                            onChange={(e) => setBdmName(e.target.value)}
                                        >
                                            <option value="Not Alloted" disabled>
                                                Select a BDM
                                            </option>
                                            {newempData.filter((item) =>
                                                (item._id !== id && item.bdmWork || item.designation === "Sales Manager")
                                            ).map((item) => (
                                                <option value={item.ename}>{item.ename}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div>
                                <h1>No Employees Found</h1>
                            </div>
                        )}
                    </div>
                </DialogContent>
                <button onClick={() => handleForwardDataToBDM(bdmName)} className="btn btn-primary">
                    Submit
                </button>
            </Dialog>

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
        </div>
    );
}

export default EmployeeLeads;