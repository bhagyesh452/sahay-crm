import React, { useState, useEffect } from 'react';
import Header from "./Header";
import Navbar from "./Navbar";
import ClipLoader from "react-spinners/ClipLoader";
import axios from 'axios';
import { IconChevronLeft } from "@tabler/icons-react";
import debounce from 'lodash/debounce';
import { IconChevronRight } from "@tabler/icons-react";
import * as XLSX from "xlsx";
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    IconButton,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Nodata from '../components/Nodata';
import { Page } from 'react-pdf';
import { IoFilterOutline } from "react-icons/io5";
import { TbFileImport } from "react-icons/tb";
import { TbFileExport } from "react-icons/tb";
import { TiUserAddOutline } from "react-icons/ti";
import { MdAssignmentAdd } from "react-icons/md";
import { MdOutlinePostAdd } from "react-icons/md";
import { MdOutlineDeleteSweep } from "react-icons/md";
import Swal from "sweetalert2";
import Papa from "papaparse";
// import DeleteIcon from "@mui/icons-material/Delete";
// import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Link, json } from "react-router-dom";
import { IconEye } from "@tabler/icons-react";
import { MdDeleteOutline } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";
import { BsFillArrowLeftSquareFill } from 'react-icons/bs';
import { IoIosClose } from "react-icons/io";
import { Drawer, colors } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Country, State, City } from 'country-state-city';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { RiSendToBack } from 'react-icons/ri';
import { dateCalendarClasses } from '@mui/x-date-pickers/DateCalendar/dateCalendarClasses';
import { LiaPagerSolid } from "react-icons/lia";
import InterestedFollowUpLeads from './InterestedFollowUpLeads';
import AdminRemarksDialog from './ExtraComponent/AdminRemarksDialog';
import { LuHistory } from "react-icons/lu";
import CallHistory from '../employeeComp/CallHistory';

function TestLeads() {
    const [currentDataLoading, setCurrentDataLoading] = useState(false)
    const [data, setData] = useState([])
    const [mainData, setmainData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [completeLeads, setCompleteLeads] = useState([]);
    const [totalCount, setTotalCount] = useState()
    const itemsPerPage = 500;
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const [searchText, setSearchText] = useState("")
    const [dataStatus, setDataStatus] = useState("Unassigned");
    const [totalCompaniesUnassigned, setTotalCompaniesUnaasigned] = useState(0)
    const [totalCompaniesAssigned, setTotalCompaniesAssigned] = useState(0)
    const [empData, setEmpData] = useState([])
    const frontendKey = process.env.REACT_APP_FRONTEND_KEY;
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [remarksHistory, setRemarksHistory] = useState([]);
    const [filteredRemarks, setFilteredRemarks] = useState([]);
    const [cid, setcid] = useState("");
    const [cstat, setCstat] = useState("");
    const [isSearching, setIsSearching] = useState(false)
    const [newSortType, setNewSortType] = useState({
        incoDate: "none",
        assignDate: "none"
    })
    const [sortPattern, setSortPattern] = useState("IncoDate")
    const [isFilter, setIsFilter] = useState(false)
    const [assignedData, setAssignedData] = useState([])
    const [unAssignedData, setunAssignedData] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [totalExtractedCount, setTotalExtractedCount] = useState(0)
    const [extractedData, setExtractedData] = useState([])
    const [openInterestFollowPage, setOpenInterestFollowPage] = useState(false)

    //--------------------function to fetch Total Leads ------------------------------

    useEffect(() => {
        document.title = `Admin-Sahay-CRM`;
    }, []);

    const fetchTotalLeads = async () => {
        const response = await axios.get(`${secretKey}/company-data/leads`)
        setCompleteLeads(response.data)
    }

    //--------------------function to fetch Data ------------------------------
    const fetchData = async (page, sortType) => {
        try {
            setCurrentDataLoading(true)
            //console.log("dataStatus", dataStatus)
            const response = await axios.get(`${secretKey}/company-data/new-leads?page=${page}&limit=${itemsPerPage}&dataStatus=${dataStatus}&sort=${sortType}&sortPattern=${sortPattern}`);
            setData(response.data.data);
            setTotalCount(response.data.totalPages)
            setTotalCompaniesUnaasigned(response.data.unAssignedCount)
            setTotalCompaniesAssigned(response.data.assignedCount)
            setTotalExtractedCount(response.data.extractedCount)
            setmainData(response.data.data.filter((item) => item.ename === "Not Alloted"));
            //console.log("mainData", mainData)
            //setDataStatus("Unassigned")

            // Set isLoading back to false after data is fetched
            //setIsLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error.message);
            // Set isLoading back to false if an error occurs
            //setIsLoading(false);
        } finally {
            setCurrentDataLoading(false)
        }
    };
    //--------------------function to fetch employee data ------------------------------
    const [newEmpData, setNewEmpData] = useState([])

    const fetchEmployeesData = async () => {
        try {
            const response = await axios.get(`${secretKey}/employee/einfo`)
            setEmpData(response.data)
            setNewEmpData(response.data.filter(obj => obj.designation === 'Sales Executive' || obj.designation === 'Sales Manager'))
        } catch (error) {
            console.log("Error fetching data", error.message)
        }
    }
    //--------------------function to fetch remarks history ------------------------------

    // const fetchRemarksHistory = async () => {
    //     try {
    //         const response = await axios.get(`${secretKey}/remarks/remarks-history`);

    //         setRemarksHistory(response.data);
    //         setFilteredRemarks(response.data.filter((obj) => obj.companyID === cid));


    //     } catch (error) {
    //         console.error("Error fetching remarks history:", error);
    //     }
    // };
    console.log("remarksHisory", remarksHistory)
    console.log("filtered", filteredRemarks)


    const latestSortCount = sortPattern === "IncoDate" ? newSortType.incoDate : newSortType.assignDate

    useEffect(() => {
        if (!isSearching && !isFilter) {
            fetchData(1, latestSortCount)
            fetchTotalLeads()
            fetchEmployeesData()
            //fetchRemarksHistory()
        }

    }, [dataStatus, isSearching, sortPattern, isFilter])

    //--------------------function to change pages ------------------------------


    const handleNextPage = () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        if (isFilter) {
            handleFilterData(nextPage, itemsPerPage);

        } else if (isSearching) {
            handleFilterSearch(nextPage, itemsPerPage)
        } else {
            fetchData(nextPage, latestSortCount);
        }
    };

    const handlePreviousPage = () => {
        const prevPage = currentPage - 1;
        setCurrentPage(prevPage);
        if (isFilter) {
            handleFilterData(prevPage, itemsPerPage);
        } else if (isSearching) {
            handleFilterSearch(prevPage, itemsPerPage);
        } else {
            fetchData(prevPage, latestSortCount);
        }
    };

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const page = 1;
                const limit = 500;
                let response;

                if (isFilter) {
                    response = await axios.get(`${secretKey}/company-data/filter-leads`, {
                        params: {
                            selectedStatus,
                            selectedState,
                            selectedNewCity,
                            selectedBDEName,
                            selectedAssignDate,
                            selectedUploadedDate,
                            selectedAdminName,
                            selectedYear,
                            monthIndex,
                            selectedCompanyIncoDate,
                            page,
                            limit
                        }
                    });
                } else if (isSearching) {
                    response = await axios.get(`${secretKey}/company-data/search-leads`, {
                        params: {
                            searchQuery: searchText,
                            page,
                            limit,
                        }
                    });

                    if (response) {
                        setTotalExtractedCount(response.data.extractedDataCount);
                        setTotalCompaniesUnaasigned(response.data.totalUnassigned);
                        setTotalCompaniesAssigned(response.data.totalAssigned);

                        if (dataStatus === "Unassigned") {
                            setunAssignedData(response.data.unassigned);
                        } else if (dataStatus === "Extracted") {
                            setExtractedData(response.data.extracted);
                        } else {
                            setAssignedData(response.data.assigned);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching leads:", error);
            }
        };

        if (isFilter || isSearching) {
            fetchLeads();
        }
    }, [dataStatus]);

    //const currentData = mainData.slice(startIndex, endIndex);

    function formatDateFinal(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    //--------------------function to filter company name ------------------------------
    // const handleFilterSearch = async (searchQuery) => {
    //     try {
    //         setCurrentDataLoading(true);
    //         setIsSearching(true);
    //         setIsFilter(false);
    //         const response = await axios.get(`${secretKey}/company-data/search-leads`, {
    //             params: { searchQuery, field: "Company Name" }
    //         });

    //         if (!searchQuery.trim()) {
    //             // If search query is empty, reset data to mainData
    //             setIsSearching(false)
    //             fetchData(1, latestSortCount)
    //         } else {
    //             // Set data to the search results
    //             setData(response.data);
    //             if (response.data.length > 0) {
    //                 if (response.data[0].ename === 'Not Alloted') {
    //                     setDataStatus('Unassigned')
    //                 } else {
    //                     setDataStatus('Assigned')
    //                 }
    //             }
    //         }
    //     } catch (error) {
    //         console.error('Error searching leads:', error.message);
    //     } finally {
    //         setCurrentDataLoading(false);

    //     }
    // };

    const handleFilterSearch = async (searchQuery, page = 1, limit = itemsPerPage) => {

        try {
            setCurrentDataLoading(true);
            setIsSearching(true);
            setIsFilter(false);
            handleClearFilter()
            const response = await axios.get(`${secretKey}/company-data/search-leads`, {
                params: {
                    searchQuery,
                    page,
                    limit
                }
            });
            if (!searchQuery.trim()) {
                setIsSearching(false);
                fetchData(1, latestSortCount)
            } else {
                setAssignedData(response.data.assigned)
                setExtractedData(response.data.extracted)
                setTotalExtractedCount(response.data.extractedDataCount)
                setunAssignedData(response.data.unassigned)
                setTotalCompaniesAssigned(response.data.totalAssigned)
                setTotalCompaniesUnaasigned(response.data.totalUnassigned)
                setTotalCount(response.data.totalPages)
                setCurrentPage(1)

                if (response.data.assigned.length > 0 || response.data.unassigned.length > 0 || response.data.extracted.length > 0) {
                    if (response.data.unassigned.length > 0 && response.data.unassigned[0].ename === 'Not Alloted') {
                        setDataStatus('Unassigned');
                    } else if (response.data.extracted.length > 0 && response.data.extracted[0].ename === 'Extracted') {
                        setDataStatus('Extracted');
                    } else {
                        setDataStatus("Assigned")
                    }
                }
            }
        } catch (error) {
            console.error('Error searching leads', error.message)
        } finally {
            setCurrentDataLoading(false)
        }
    }




    //--------------------function to add leads-------------------------------------
    const [openAddLeadsDialog, setOpenAddLeadsDialog] = useState(false)
    const [error, setError] = useState('');
    const [errorDirectorNumberFirst, setErrorDirectorNumberFirst] = useState("")
    const [errorDirectorNumberSecond, setErrorDirectorNumberSecond] = useState("")
    const [errorDirectorNumberThird, setErrorDirectorNumberThird] = useState("")
    const [openSecondDirector, setOpenSecondDirector] = useState(false)
    const [openFirstDirector, setOpenFirstDirector] = useState(true)
    const [openThirdDirector, setOpenThirdDirector] = useState(false)
    const [firstPlus, setFirstPlus] = useState(true)
    const [secondPlus, setSecondPlus] = useState(false)
    const [openThirdMinus, setOpenThirdMinus] = useState(false)
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
    const [cnumber, setCnumber] = useState(0);
    const [state, setState] = useState("");
    const [openRemarks, openchangeRemarks] = useState(false);
    const [city, setCity] = useState("");
    const [cidate, setCidate] = useState(null);

    function closeAddLeadsDialog() {
        setOpenAddLeadsDialog(false)
        setOpenFirstDirector(true);
        setOpenSecondDirector(false);
        setOpenThirdDirector(false);
        setFirstPlus(true);
        setSecondPlus(false);
        setOpenThirdMinus(false)
        //fetchData(1);
        setError('')
        setErrorDirectorNumberFirst("");
        setErrorDirectorNumberSecond("");
        setErrorDirectorNumberThird("");
    }

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
        setFirstPlus(true)
    }
    const functionCloseThirdDirector = () => {
        setOpenSecondDirector(true);
        setOpenThirdDirector(false);
        setFirstPlus(false);
        setOpenThirdMinus(false)
        setSecondPlus(true)
    }

    const handleSubmitData = (e) => {
        e.preventDefault();

        if (cname === "") {
            Swal.fire("Please Enter Company Name");
        } else if (!cnumber && !/^\d{10}$/.test(cnumber)) {
            Swal.fire("Company Number is required");
        } else if (cemail === "") {
            Swal.fire("Company Email is required");
        } else if (city === "") {
            Swal.fire("City is required");
        } else if (state === "") {
            Swal.fire("State is required");
        } else if (directorNumberFirst !== 0 && !/^\d{10}$/.test(directorNumberFirst)) {
            Swal.fire("First Director Number should be 10 digits");
        } else if (directorNumberSecond !== 0 && !/^\d{10}$/.test(directorNumberSecond)) {
            Swal.fire("Second Director Number should be 10 digits");
        } else if (directorNumberThird !== 0 && !/^\d{10}$/.test(directorNumberThird)) {
            Swal.fire("Third Director Number should be 10 digits");
        } else {
            const adminName = localStorage.getItem("adminName")
            axios
                .post(`${secretKey}/admin-leads/manual`, {
                    "Company Name": cname.toUpperCase().trim(),
                    "Company Number": cnumber,
                    "Company Email": cemail,
                    "Company Incorporation Date  ": cidate, // Assuming the correct key is "Company Incorporation Date"
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
                    UploadedBy: adminName ? adminName : "Admin"
                })
                .then((response) => {
                    //console.log("response", response);
                    console.log("Data sent Successfully");
                    Swal.fire({
                        title: "Data Added!",
                        text: "Successfully added new Data!",
                        icon: "success",
                    });
                    fetchData(1, latestSortCount);
                    closeAddLeadsDialog();
                })
                .catch((error) => {
                    console.error("Error sending data:", error);
                    Swal.fire("An error occurred. Please try again later.");
                });
        }
    };

    //------------------------------function add leads through csv-----------------------------------

    const [openBulkLeadsCSVPopup, setOpenBulkLeadsCSVPopup] = useState(false)
    const [selectedOption, setSelectedOption] = useState("direct");
    const [csvdata, setCsvData] = useState([]);
    const [newemployeeSelection, setnewEmployeeSelection] = useState("Not Alloted");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    function closeBulkLeadsCSVPopup() {
        setOpenBulkLeadsCSVPopup(false)
        setCsvData([])
    }

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
                const adminName = localStorage.getItem("adminName")
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
                        "Company Address": row[7],
                        "Director Name(First)": row[8],
                        "Director Number(First)": row[9],
                        "Director Email(First)": row[10],
                        "Director Name(Second)": row[11],
                        "Director Number(Second)": row[12],
                        "Director Email(Second)": row[13],
                        "Director Name(Third)": row[14],
                        "Director Number(Third)": row[15],
                        "Director Email(Third)": row[16],
                        "UploadedBy": adminName ? adminName : "Admin"
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

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
    //console.log("selectedOption" , selectedOption)
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

    const handleUploadData = async (e) => {
        const adminName = localStorage.getItem("adminName") || "Admin";
        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();
        const properDate = new Date();

        if (!csvdata.length) {
            Swal.fire("Please upload data");
            return;
        }

        const updatedCsvdata = csvdata.map(data => ({
            ...data,
            ename: newemployeeSelection,
            AssignDate: properDate,
            // UploadDate:properDate,
            UploadedBy: adminName
        }));

        const updatedCsvData2 = csvdata.map(data => ({
            ...data,
            UploadDate: properDate
        }))

        const newArray = updatedCsvdata.map(data => ({
            date: currentDate,
            time: currentTime,
            ename: newemployeeSelection,
            companyName: data["Company Name"]
        }));

        setLoading(true);
        setOpenBacdrop(true);
        closeBulkLeadsCSVPopup();


        try {
            let response;
            if (selectedOption === "someoneElse") {
                console.log("updatedcsvdata", updatedCsvdata)
                response = await axios.post(`${secretKey}/company-data/leads`, updatedCsvdata);
                await axios.post(`${secretKey}/employee/employee-history`, newArray);
            } else {
                console.log("updatedcsvdata2", updatedCsvData2)
                response = await axios.post(`${secretKey}/company-data/leads`, updatedCsvData2);
            }

            //const response = await axios.post(`${secretKey}/company-data/leads`, selectedOption === "someoneElse" ? updatedCsvdata : csvdata);
            handleResponse(response, newArray);
            fetchData(1, latestSortCount);
            resetForm();
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
            setOpenBacdrop(false);
            setCsvData([]);
        }
    };

    const handleResponse = (response, newArray) => {
        const counter = response.data.counter;
        const successCounter = response.data.sucessCounter;

        if (counter === 0) {
            Swal.fire({
                title: selectedOption === "someoneElse" ? "Data Send!" : "Data Added!",
                text: selectedOption === "someoneElse" ? "Data successfully sent to the Employee" : "Data Successfully added to the Leads",
                icon: "success"
            });
        } else {
            const lines = response.data.split('\n');
            const numberOfDuplicateEntries = lines.length - 1;
            const noofSuccessEntries = newArray.length - numberOfDuplicateEntries;

            Swal.fire({
                title: 'Do you want to download the duplicate entries report?',
                html: `Successful Entries: ${noofSuccessEntries}<br>Duplicate Entries: ${numberOfDuplicateEntries}<br>Click Yes to download the report.`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            }).then(result => {
                if (result.isConfirmed) {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "DuplicateEntriesLeads.csv");
                    document.body.appendChild(link);
                    link.click();
                }
            });
        }
    };

    const handleError = (error) => {
        if (error.response && error.response.status !== 500) {
            setErrorMessage(error.response.data.error);
            Swal.fire("Some of the data are not unique");
        } else {
            setErrorMessage("An error occurred. Please try again.");
            Swal.fire("Please upload unique data");
        }
        console.error("Error:", error);
    };

    const resetForm = () => {
        closeBulkLeadsCSVPopup();
        setnewEmployeeSelection("Not Alloted");
    };



    //----------------------function for export leads data-------------------------------------
    const [selectedRows, setSelectedRows] = useState([]);
    const [startRowIndex, setStartRowIndex] = useState(null);
    const [allIds, setAllIds] = useState([])



    const handleCheckboxChange = async (id) => {
        try {
            let response;
            if (id === "all") {
                setOpenBacdrop(true)
                response = await axios.get(`${secretKey}/admin-leads/getIds`, {
                    params: {
                        dataStatus,
                        selectedStatus,
                        selectedState,
                        selectedNewCity,
                        selectedBDEName,
                        selectedAssignDate,
                        selectedUploadedDate,
                        selectedAdminName,
                        selectedYear,
                        monthIndex,
                        selectedCompanyIncoDate,
                        isFilter,
                        isSearching,
                        searchText
                    }
                });
            } else {
                setSelectedRows((prevSelectedRows) => {
                    if (prevSelectedRows.includes(id)) {
                        return prevSelectedRows.filter((rowId) => rowId !== id);
                    } else {
                        return [...prevSelectedRows, id];
                    }
                });
                return;
            }
            // Process response
            const { data } = response;
            console.log(data)
            // Handle response data as needed
            setAllIds(data.allIds);
            setSelectedRows((prevSelectedRows) =>
                prevSelectedRows.length === data.allIds.length ? [] : data.allIds
            );
        } catch (error) {
            // Handle errors
            console.error('Error:', error);
        } finally {
            setOpenBacdrop(false)
        }
    };



    const handleMouseDown = (id) => {
        // Initiate drag selection
        let index;
        if (isFilter || isSearching) {
            if (dataStatus === 'Unassigned') {
                index = unAssignedData.findIndex((row) => row._id === id);
            } else if (dataStatus === 'Assigned') {
                index = assignedData.findIndex((row) => row._id === id);
            } else if (dataStatus === "Extracted") {
                index = extractedData.findIndex((row) => row._id === id);
            }
        } else {
            index = data.findIndex((row) => row._id === id);
        }

        setStartRowIndex(index);
    };

    //console.log(data)


    const handleMouseEnter = (id) => {
        // Update selected rows during drag selection
        if (startRowIndex !== null) {
            let endRowIndex, dataSet;

            if (isFilter || isSearching) {
                if (dataStatus === 'Unassigned') {
                    dataSet = unAssignedData;
                } else if (dataStatus === 'Assigned') {
                    dataSet = assignedData;
                } else if (dataStatus === "Extracted") {
                    dataSet = extractedData;
                }
            } else {
                dataSet = data;
            }

            if (dataSet) {
                endRowIndex = dataSet.findIndex((row) => row._id === id);
                const selectedRange = [];
                const startIndex = Math.min(startRowIndex, endRowIndex);
                const endIndex = Math.max(startRowIndex, endRowIndex);

                for (let i = startIndex; i <= endIndex; i++) {
                    selectedRange.push(dataSet[i]._id);
                }

                setSelectedRows(selectedRange);
            }
        }
    };


    const handleMouseUp = () => {
        // End drag selection
        setStartRowIndex(null);
    };


    const exportData = async () => {
        try {
            setOpenBacdrop(true)
            const response = await axios.post(
                `${secretKey}/admin-leads/exportLeads/`,
                {
                    selectedRows,
                    isFilter,
                    dataStatus,
                    selectedStatus,
                    selectedState,
                    selectedNewCity,
                    selectedBDEName,
                    selectedAssignDate,
                    selectedUploadedDate,
                    selectedAdminName,
                    selectedYear,
                    monthIndex,
                    selectedCompanyIncoDate,
                    isSearching,
                    searchText,
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            dataStatus === "Assigned"
                ? link.setAttribute("download", "AssignedLeads_Admin.csv")
                : link.setAttribute("download", "UnAssignedLeads_Admin.csv");
            document.body.appendChild(link);
            link.click();
            //setSelectedRows([])
        } catch (error) {
            console.error("Error downloading CSV:", error);
        } finally {
            setOpenBacdrop(false)
        }
    };

    //console.log(selectedRows)

    //--------------------function to assign leads to employees---------------------
    const [openAssignLeadsDialog, setOpenAssignLeadsDialog] = useState(false)
    const [employeeSelection, setEmployeeSelection] = useState("Not Alloted")

    function closeAssignLeadsDialog() {
        setOpenAssignLeadsDialog(false)
        fetchData(1, latestSortCount)
        setEmployeeSelection("Not Alloted")
    }



    const handleconfirmAssign = async () => {
        let selectedObjects = [];

        // Check if no data is selected
        if (selectedRows.length === 0) {
            Swal.fire("Empty Data!");
            closeAssignLeadsDialog();
            return; // Exit the function early if no data is selected
        }

        try {
            // Fetch selected data directly from the server
            const response = await axios.post(`${secretKey}/admin-leads/fetch-by-ids`, { ids: selectedRows });
            selectedObjects = response.data;

            if (selectedOption === "someoneElse" || selectedOption === "direct") {
                const alreadyAssignedData = selectedObjects.filter(
                    (obj) => obj.ename && obj.ename !== "Not Alloted"
                );

                // If all selected data is not already assigned, proceed with assignment
                if (alreadyAssignedData.length === 0) {
                    handleAssignData();
                    return; // Exit the function after handling assignment
                }

                // If some selected data is already assigned, show confirmation dialog
                const userConfirmed = window.confirm(
                    `Some data is already assigned. Do you want to continue?`
                );

                if (userConfirmed) {
                    handleAssignData();
                }

            } else if (selectedOption === "extractedData") {
                //setEmployeeSelection("Extracted")
                // console.log("Inside extracted data");
                handleExtractData();
            } else {
                return true;
            }
        } catch (error) {
            console.error('Error fetching selected data:', error);
            Swal.fire('Error fetching data. Please try again.');
        }
    };

    const handleExtractData = async () => {
        const title = `${selectedRows.length} data extracted to ${employeeSelection}`;
        const DT = new Date();
        const date = DT.toLocaleDateString();
        const time = DT.toLocaleTimeString();
        const currentDataStatus = dataStatus
        console.log("currentDataStatus", currentDataStatus)
        const response = await axios.post(`${secretKey}/admin-leads/fetch-by-ids`, { ids: selectedRows });
        const dataToSend = response.data;
        // console.log("Data to send is :", dataToSend);
        try {
            setOpenBacdrop(true);
            setOpenAssignLeadsDialog(false);
            const response2 = await axios.post(`${secretKey}/admin-leads/postExtractedData`, {
                employeeSelection,
                selectedObjects: dataToSend,
                title,
                date,
                time
            });

            // console.log("Assigned data is :", response2.data);

            if (isFilter) {
                handleFilterData(1, itemsPerPage);
            } else if (isSearching) {
                handleFilterSearch(1, itemsPerPage)
            } else {
                fetchData(1, latestSortCount)
            }

            Swal.fire("Data Assigned");
            setOpenAssignLeadsDialog(false);
            setSelectedRows([]);
            setDataStatus(currentDataStatus);
            setEmployeeSelection("Extracted");

        } catch (error) {
            console.log("Error Fetching Data", error.message)

        } finally {
            setOpenBacdrop(false)
        }
    }
    function formatDateproper(inputDate) {
        const options = { month: "long", day: "numeric", year: "numeric" };
        const formattedDate = new Date(inputDate).toLocaleDateString(
            "en-US",
            options
        );
        return formattedDate;
    }

    const handleAssignData = async () => {
        const title = `${selectedRows.length} data assigned to ${employeeSelection}`;
        const DT = new Date();
        const date = DT.toLocaleDateString();
        const time = DT.toLocaleTimeString();
        const currentDataStatus = dataStatus
        const dateObject = new Date();
        const hours = dateObject.getHours().toString().padStart(2, "0");
        const minutes = dateObject.getMinutes().toString().padStart(2, "0");
        const cTime = `${hours}:${minutes}`;
        const cDate = formatDateproper(dateObject);

        const tempStatusData = dataStatus === "Unassigned" ? unAssignedData : assignedData
        const tempFilter = (!isFilter && !isSearching) ? data : tempStatusData;
        //const dataToSend = tempFilter.filter((row) => selectedRows.includes(row._id));
        const response = await axios.post(`${secretKey}/admin-leads/fetch-by-ids`, { ids: selectedRows });
        const dataToSend = response.data;
        // console.log("length", dataToSend.length)
        // console.log("Assigning extracted data from admin side :", dataToSend);

        try {
            setOpenBacdrop(true)
            setOpenAssignLeadsDialog(false)
            const response2 = await axios.post(`${secretKey}/admin-leads/postAssignData`, {
                employeeSelection,
                selectedObjects: dataToSend,
                title,
                date,
                time
            });
            // console.log("Assigned data from admin side is :", response2.data);

            const response = await axios.post(`${secretKey}/requests/gDataByAdmin`, {
                numberOfData: dataToSend.length,
                name: employeeSelection,
                cTime,
                cDate,
            });

            if (isFilter) {
                handleFilterData(1, itemsPerPage);
            } else if (isSearching) {
                handleFilterSearch(1, itemsPerPage)
            } else {
                fetchData(1, latestSortCount)
            }

            Swal.fire("Data Assigned");
            setOpenAssignLeadsDialog(false);
            setSelectedRows([]);
            setDataStatus(currentDataStatus);
            setEmployeeSelection("Not Alloted");
        } catch (err) {
            console.log("Internal server Error", err);
            Swal.fire("Error Assigning Data");
        } finally {
            setOpenBacdrop(false)
        }
    };


    //-------------------------function to delete leads-------------------------

    const handleDeleteSelection = async () => {
        if (selectedRows.length !== 0) {
            // Show confirmation dialog using SweetAlert2
            Swal.fire({
                title: "Confirm Deletion",
                text: "Are you sure you want to delete the selected rows?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete",
                cancelButtonText: "No, cancel",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {

                        Swal.fire({
                            title: 'Deleting...',
                            allowOutsideClick: false,
                            didOpen: () => {
                                Swal.showLoading();
                            }
                        });
                        // If user confirms, proceed with deletion
                        const response = await axios.delete(`${secretKey}/admin-leads/deleteAdminSelectedLeads`, {
                            data: { selectedRows }, // Pass selected rows to the server
                        });

                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Selected rows have been deleted.',
                            icon: 'success',
                        });
                        //console.log(response.data)
                        // Store backup process
                        // After deletion, fetch updated data
                        await fetchData(1, latestSortCount);
                        setSelectedRows([]); // Clear selectedRows state
                    } catch (error) {
                        console.error("Error deleting rows:", error.message);
                    }
                }
            });
        } else {
            // If no rows are selected, show an alert
            Swal.fire("Select some rows first!");
        }
    };

    // ---------------------function to delete particular lead----------------------------------
    const handleDeleteClick = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Confirm Deletion',
                text: 'Are you sure you want to delete this item?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel'
            });

            if (result.isConfirmed) {
                await axios.delete(`${secretKey}/company-data/leads/${id}`);

                Swal.fire(
                    'Deleted!',
                    'The item has been deleted.',
                    'success'
                );

                // Refresh the data after successful deletion
                fetchData(1, latestSortCount);
            }
        } catch (error) {
            console.error("Error deleting data:", error);

            Swal.fire(
                'Error!',
                'An error occurred while deleting the item.',
                'error'
            );
        }
    };

    //----------------------function to modify leads----------------------------------------
    const [openLeadsModifyPopUp, setOpenLeadsModifyPopUp] = useState(false)
    const [selectedDataId, setSelectedDataId] = useState()
    const [companyEmail, setCompanyEmail] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [companyIncoDate, setCompanyIncoDate] = useState(null);
    const [companyCity, setCompnayCity] = useState("");
    const [companyState, setCompnayState] = useState("");
    const [companynumber, setCompnayNumber] = useState("");
    const [isEditProjection, setIsEditProjection] = useState(false);
    const [cAddress, setCAddress] = useState("");
    const [directorNameFirstModify, setDirectorNameFirstModify] = useState("")
    const [directorNumberFirstModify, setDirectorNumberFirstModify] = useState("")
    const [directorEmailFirstModify, setDirectorEmailFirstModify] = useState("")
    const [directorNameSecondModify, setDirectorNameSecondModify] = useState("")
    const [directorNumberSecondModify, setDirectorNumberSecondModify] = useState("")
    const [directorEmailSecondModify, setDirectorEmailSecondModify] = useState("")
    const [directorNameThirdModify, setDirectorNameThirdModify] = useState("")
    const [directorNumberThirdModify, setDirectorNumberThirdModify] = useState("")
    const [directorEmailThirdModify, setDirectorEmailThirdModify] = useState("")
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [errorCompnayNumber, setErrorCompnayNumber] = useState('');
    const [errorDirectorNumberFirstModify, setErrorDirectorNumberFirstModify] = useState("")
    const [errorDirectorNumberSecondModify, setErrorDirectorNumberSecondModify] = useState("")
    const [errorDirectorNumberThirdModify, setErrorDirectorNumberThirdModify] = useState("")

    const functioncloseModifyPopup = () => {
        setOpenLeadsModifyPopUp(false);
        setIsEditProjection(false);
        setOpenFirstDirector(true);
        setOpenSecondDirector(false);
        setOpenThirdDirector(false);
        setFirstPlus(true);
        setSecondPlus(false);
        setOpenThirdMinus(false)
        //fetchData();
        setError('')
        setErrorDirectorNumberFirst("");
        setErrorDirectorNumberSecond("");
        setErrorDirectorNumberThird("");
    }

    const handleUpdateClick = (id) => {
        //console.log(id)
        //Set the selected data ID and set update mode to true
        setSelectedDataId(id);
        setIsUpdateMode(true);
        // setCompanyData(cdata.filter((item) => item.ename === echangename));

        // Find the selected data object

        const dataToFilter = dataStatus === "Unassigned"
            ? unAssignedData
            : dataStatus === "Extracted"
                ? extractedData
                : assignedData;
        const finalFiltering = !isFilter && !isSearching ? data : dataToFilter
        const selectedData = finalFiltering.find((item) => item._id === id);

        //console.log(selectedData["Company Incorporation Date  "])
        //console.log(selectedData)
        // console.log(echangename);

        // Update the form data with the selected data values
        setCompanyEmail(selectedData["Company Email"]);
        setCompanyName(selectedData["Company Name"]);
        //setCompanyIncoDate(new Date(selectedData["Company Incorporation Date  "]));
        setCompnayCity(selectedData["City"]);
        setCompnayState(selectedData["State"]);
        setCompnayNumber(selectedData["Company Number"]);
        setCAddress(selectedData["Company Address"])
        setDirectorNameFirstModify(selectedData["Director Name(First)"])
        setDirectorNumberFirstModify(selectedData["Director Number(First)"])
        setDirectorEmailFirstModify(selectedData["Director Email(First)"])
        setDirectorNameSecondModify(selectedData["Director Name(Second)"])
        setDirectorNumberSecondModify(selectedData["Director Number(Second)"])
        setDirectorEmailSecondModify(selectedData["Director Email(Second)"])
        setDirectorNameThirdModify(selectedData["Director Name(Third)"])
        setDirectorNumberThirdModify(selectedData["Director Number(Third)"])
        setDirectorEmailThirdModify(selectedData["Director Email(Third)"])
        const dateString = selectedData["Company Incorporation Date  "];

        // Parse the date string into a Date object
        const dateObject = new Date(dateString);

        // Check if the parsed Date object is valid
        if (!isNaN(dateObject.getTime())) {
            // Date object is valid, proceed with further processing
            //console.log("Company Incorporation Date:", dateObject);

            // Format the date as dd-mm-yyyy
            const day = dateObject.getDate().toString().padStart(2, "0");
            const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
            const year = dateObject.getFullYear();
            const formattedDate = `${year}-${month}-${day}`;
            setCompanyIncoDate(formattedDate)

            //console.log("Formatted Company Incorporation Date:", formattedDate);

            // Rest of your code...
        } else {
            // Date string couldn't be parsed into a valid Date object
            console.error("Invalid Company Incorporation Date string:", dateString);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const adminName = localStorage.getItem("adminName");
        try {
            let validationError = false;

            if (companyName === "") {
                validationError = true;
                Swal.fire("Please Enter Company Name");
            } else if (!companynumber || !/^\d{10}$/.test(companynumber)) {
                validationError = true;
                Swal.fire("Company Number is required and should be 10 digits");
            } else if (companyEmail === "") {
                validationError = true;
                Swal.fire("Company Email is required");
            } else if (companyCity === "") {
                validationError = true;
                Swal.fire("City is required");
            } else if (companyState === "") {
                validationError = true;
                Swal.fire("State is required");
            } else if (directorNumberFirstModify && !/^\d{10}$/.test(directorNumberFirstModify)) {
                validationError = true;
                Swal.fire("First Director Number should be 10 digits");
            } else if (directorNumberSecondModify && !/^\d{10}$/.test(directorNumberSecondModify)) {
                validationError = true;
                Swal.fire("Second Director Number should be 10 digits");
            } else if (directorNumberThirdModify && !/^\d{10}$/.test(directorNumberThirdModify)) {
                validationError = true;
                Swal.fire("Third Director Number should be 10 digits");
            }

            if (!validationError) {
                const dateObject = new Date(companyIncoDate);

                // Check if the parsed Date object is valid
                if (!isNaN(dateObject.getTime())) {
                    // Date object is valid, proceed with further processing
                    // Format the date as yyyy-mm-ddThh:mm:ss.000
                    const isoDateString = dateObject.toISOString();

                    // Update dataToSendUpdated with the formatted date
                    let dataToSendUpdated = {
                        "Company Name": companyName,
                        "Company Email": companyEmail,
                        "Company Number": companynumber,
                        "Company Incorporation Date ": isoDateString, // Updated format
                        "City": companyCity,
                        "State": companyState,
                        "Company Address": cAddress,
                        'Director Name(First)': directorNameFirstModify,
                        'Director Number(First)': directorNumberFirstModify,
                        'Director Email(First)': directorEmailFirstModify,
                        'Director Name(Second)': directorNameSecondModify,
                        'Director Number(Second)': directorNumberSecondModify,
                        'Director Email(Second)': directorEmailSecondModify,
                        'Director Name(Third)': directorNameThirdModify,
                        'Director Number(Third)': directorNumberThirdModify,
                        'Director Email(Third)': directorEmailThirdModify,
                        "UploadedBy": adminName ? adminName : "Admin"
                    };

                    if (isUpdateMode) {
                        await axios.put(`${secretKey}/company-data/leads/${selectedDataId}`, dataToSendUpdated);
                        Swal.fire({
                            title: "Data Updated!",
                            text: "You have successfully updated the name!",
                            icon: "success",
                        });
                    }

                    // Reset the form and any error messages
                    setIsUpdateMode(false);
                    fetchData(1, latestSortCount)
                    functioncloseModifyPopup();
                } else {
                    // Date string couldn't be parsed into a valid Date object
                    console.error("Invalid Company Incorporation Date string:", companyIncoDate);
                }
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
            });
            console.error("Internal server error", error);
        }
    };


    //------------------filter functions------------------------
    const [openFilterDrawer, setOpenFilterDrawer] = useState(false)
    const stateList = State.getStatesOfCountry("IN")
    const cityList = City.getCitiesOfCountry("IN")
    const [selectedStateCode, setSelectedStateCode] = useState("")
    const [selectedState, setSelectedState] = useState("")
    const [selectedCity, setSelectedCity] = useState(City.getCitiesOfCountry("IN"))
    const [selectedNewCity, setSelectedNewCity] = useState("")
    const [selectedYear, setSelectedYear] = useState("")
    const [selectedMonth, setSelectedMonth] = useState("")
    const [selectedStatus, setSelectedStatus] = useState("")
    const [selectedBDEName, setSelectedBDEName] = useState("")
    const [selectedAssignDate, setSelectedAssignDate] = useState(null)
    const [selectedUploadedDate, setSelectedUploadedDate] = useState(null)
    const [selectedExtractedDate, setSelectedExtractedDate] = useState(null);
    const [selectedAdminName, setSelectedAdminName] = useState("")
    const [daysInMonth, setDaysInMonth] = useState([]);
    const [selectedDate, setSelectedDate] = useState(0)
    const [selectedCompanyIncoDate, setSelectedCompanyIncoDate] = useState(null)
    const [openBacdrop, setOpenBacdrop] = useState(false)
    const [monthIndex, setMonthIndex] = useState(0)

    const currentYear = new Date().getFullYear();
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    //Create an array of years from 2018 to the current year
    const years = Array.from({ length: currentYear - 1969 }, (_, index) => currentYear - index);
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

    console.log(selectedYear)


    useEffect(() => {
        if (selectedYear && selectedMonth && selectedDate) {
            const monthIndex = months.indexOf(selectedMonth) + 1;
            const formattedMonth = monthIndex < 10 ? `0${monthIndex}` : monthIndex;
            const formattedDate = selectedDate < 10 ? `0${selectedDate}` : selectedDate;
            const companyIncoDate = `${selectedYear}-${formattedMonth}-${formattedDate}`;
            setSelectedCompanyIncoDate(companyIncoDate);
        }
    }, [selectedYear, selectedMonth, selectedDate]);

    console.log("inco date", selectedCompanyIncoDate)


    const handleFilterData = async (page = 1, limit = itemsPerPage) => {
        try {
            setIsFilter(true);
            setOpenBacdrop(true)
            const response = await axios.get(`${secretKey}/company-data/filter-leads`, {
                params: {
                    selectedStatus,
                    selectedState,
                    selectedNewCity,
                    selectedBDEName,
                    selectedAssignDate,
                    selectedUploadedDate,
                    selectedExtractedDate,
                    selectedAdminName,
                    selectedYear,
                    monthIndex,
                    selectedCompanyIncoDate,
                    page,  // Start from the first page
                    limit
                }
            });
            if (!selectedStatus &&
                !selectedState &&
                !selectedNewCity &&
                !selectedBDEName &&
                !selectedAssignDate &&
                !selectedUploadedDate &&
                !selectedExtractedDate &&
                !selectedAdminName &&
                !selectedYear &&
                !selectedCompanyIncoDate) {
                // If search query is empty, reset data to mainData
                setIsFilter(false);
                fetchData(1, latestSortCount);
                setOpenBacdrop(false)
            } else {
                console.log("selectedUploadDate", selectedUploadedDate)
                setOpenBacdrop(false)
                setTotalCompaniesAssigned(response.data.totalAssigned)
                setTotalCompaniesUnaasigned(response.data.totalUnassigned)
                setExtractedData(response.data.extracted)
                setTotalExtractedCount(response.data.extractedDataCount)
                setAssignedData(response.data.assigned)
                setunAssignedData(response.data.unassigned)
                setTotalCount(response.data.totalPages);  // Ensure your backend provides the total page count

                //setData(response.data);  // Optionally set all data
                setCurrentPage(response.data.currentPage);  // Reset to the first page
                //setData(response.data.assigned);
                // if (response.data.assigned.length > 0 || response.data.unassigned.length > 0) {
                //     if (response.data.unassigned.length > 0 && response.data.unassigned[0].ename === 'Not Alloted') {
                //         setDataStatus('Unassigned');
                //     } else {
                //         setDataStatus('Assigned');
                //     }
                // }
                setOpenFilterDrawer(false);
            }
        } catch (error) {
            console.log('Error applying filter', error.message);
        }
    };

    const handleClearFilter = () => {
        setIsFilter(false)
        functionCloseFilterDrawer()
        setSelectedStatus('')
        setSelectedState('')
        setSelectedNewCity('')
        setSelectedBDEName('')
        setSelectedAssignDate(null)
        setSelectedUploadedDate(null)
        setSelectedExtractedDate(null);
        setSelectedAdminName('')
        setSelectedYear('')
        setMonthIndex(0)
        setSelectedMonth('')
        setSelectedDate(0)
        setCompanyIncoDate(null)
        setSelectedCompanyIncoDate(null)
        setSelectedRows([])
        fetchData(1, latestSortCount)
    }
    const functionCloseFilterDrawer = () => {
        setOpenFilterDrawer(false)
    }

    const handleCloseBackdrop = () => {
        setOpenBacdrop(false)
    }


    // -----------------update-leads-button-function-for emergency-use-only------------
    const handleFileUploadForChange = async (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const binaryStr = event.target.result;
                const workbook = XLSX.read(binaryStr, { type: 'binary' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const data = XLSX.utils.sheet_to_json(worksheet);

                try {
                    // Send the data to the backend to update the ename
                    const response = await axios.post(`${secretKey}/admin-leads/update-ename`, data);
                    if (response.status === 200) {
                        alert('Leads updated successfully!');
                    } else {
                        alert('Failed to update leads.');
                    }
                } catch (error) {
                    console.error('Error uploading file:', error);
                    alert('An error occurred while uploading the file.');
                }
            };

            reader.readAsBinaryString(file);
        }
    };

    // ---------------call history popup------------------------
    const [showCallHistory, setShowCallHistory] = useState(false);
    const [clientNumber, setClientNumber] = useState("");


    const handleShowCallHistory = (companyName, clientNumber) => {
        setShowCallHistory(true)
        setClientNumber(clientNumber)
        setCompanyName(companyName)
    }

    const hanleCloseCallHistory = () => {
        setShowCallHistory(false);
        // if (activeTabId === "Interested" && interestedTabRef.current) {
        //     interestedTabRef.current.click(); // Trigger the Interested tab click
        // } else if (activeTabId === "Matured" && maturedTabRef.current) {
        //     maturedTabRef.current.click(); // Trigger the Matured tab click
        // } else if (activeTabId === "All" && allTabRef.current) {
        //     allTabRef.current.click(); // Trigger the Matured tab click
        // } else if (activeTabId === "Not Interested" && notInterestedTabRef.current) {
        //     notInterestedTabRef.current.click(); // Trigger the Matured tab click
        // } else if (activeTabId === "Forwarded" && forwardedTabRef.current) {
        //     forwardedTabRef.current.click(); // Trigger the Matured tab click
        // }
    };




    return (
        <div>
            {!openInterestFollowPage && !showCallHistory && (
                <div className="page-wrapper">
                    <div className="page-header d-print-none">
                        <div className="container-xl">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <div className="btn-group mr-2">
                                        <button type="button" className="btn mybtn" onClick={data.length === '0' ? Swal.fire('Please import some data first !') : () => setOpenAddLeadsDialog(true)}>
                                            <TiUserAddOutline className='mr-1' /> Add Leads
                                        </button>
                                    </div>
                                    <div className="btn-group" role="group" aria-label="Basic example">
                                        <button type="button" className={isFilter ? 'btn mybtn active' : 'btn mybtn'} onClick={() => setOpenFilterDrawer(true)}>
                                            <IoFilterOutline className='mr-1' /> Filter
                                        </button>
                                        <button type="button" className="btn mybtn" onClick={() => {
                                            setOpenBulkLeadsCSVPopup(true)
                                            setCsvData([])
                                        }}>
                                            <TbFileImport className='mr-1' /> Import Leads
                                        </button>
                                        <button type="button" className="btn mybtn" onClick={() => exportData()}>
                                            <TbFileExport className='mr-1' /> Export Leads
                                        </button>
                                        <button type="button" className="btn mybtn" onClick={() => setOpenAssignLeadsDialog(true)}>
                                            <MdOutlinePostAdd className='mr-1' />Assign Leads
                                        </button>
                                        <button type="button" className="btn mybtn" onClick={() => handleDeleteSelection()}>
                                            <MdOutlineDeleteSweep className='mr-1' />Delete Leads
                                        </button>
                                        <button type="button" className="btn mybtn" onClick={() => setOpenInterestFollowPage(true)}>
                                            <LiaPagerSolid className='mr-1' />Interested-FollowUp Leads
                                        </button>
                                        {/* <div>
                                            <input type="file" accept=".xlsx, .xls,.csv" onChange={handleFileUploadForChange} style={{ display: 'none' }} id="fileInput" />
                                            <button type="button" className="btn mybtn" onClick={() => document.getElementById('fileInput').click()}>
                                                <LiaPagerSolid className="mr-1" />
                                                Update Leads
                                            </button>
                                        </div>  */}
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
                                            value={searchText}
                                            onChange={(e) => {
                                                setSearchText(e.target.value);
                                                handleFilterSearch(e.target.value)
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
                        </div>
                    </div>
                    <div className="page-body">
                        <div className="container-xl">

                            <div class="card-header  my-tab">
                                <ul
                                    class="nav nav-tabs card-header-tabs nav-fill p-0"
                                    data-bs-toggle="tabs"
                                >
                                    <li class="nav-item data-heading">
                                        <a
                                            href="#tabs-home-5"
                                            className={
                                                dataStatus === "Unassigned"
                                                    ? "nav-link active item-act"
                                                    : "nav-link"
                                            }
                                            data-bs-toggle="tab"
                                            onClick={() => {
                                                setDataStatus("Unassigned")
                                                setCurrentPage(1)
                                            }}
                                        >
                                            UnAssigned
                                            <span className="no_badge">
                                                {totalCompaniesUnassigned}
                                            </span>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a
                                            href="#tabs-home-5"
                                            className={
                                                dataStatus === "Extracted"
                                                    ? "nav-link active item-act"
                                                    : "nav-link"
                                            }
                                            data-bs-toggle="tab"
                                            onClick={() => {
                                                setDataStatus("Extracted")
                                                setCurrentPage(1)
                                            }}>
                                            Extracted Data
                                            <span className="no_badge">
                                                {totalExtractedCount}
                                            </span>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a
                                            href="#tabs-home-5"
                                            className={
                                                dataStatus === "Assigned"
                                                    ? "nav-link active item-act"
                                                    : "nav-link"
                                            }
                                            data-bs-toggle="tab"
                                            onClick={() => {
                                                setDataStatus("Assigned")
                                                setCurrentPage(1)
                                            }}
                                        >
                                            Assigned
                                            <span className="no_badge">
                                                {totalCompaniesAssigned}
                                            </span>
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className="card">
                                <div className="card-body p-0">
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
                                            }}
                                            className="table-vcenter table-nowrap "
                                        >
                                            <thead>
                                                <tr className="tr-sticky">
                                                    <th>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedRows.length === allIds.length && selectedRows.length !== 0}
                                                            onChange={() => handleCheckboxChange("all")}
                                                            defaultChecked={false}
                                                        />
                                                    </th>
                                                    <th>Sr.No</th>
                                                    <th>Company Name</th>
                                                    <th>Company Number</th>
                                                    {(dataStatus === "Assigned" || dataStatus === "Extracted") && <th>Call History</th>}
                                                    <th style={{ cursor: "pointer" }}    >
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div>Incorporation Date</div>
                                                            <div className="short-arrow-div">
                                                                <ArrowDropUpIcon
                                                                    className="up-short-arrow"
                                                                    style={{
                                                                        color: newSortType.incoDate === "descending" ? "black" : "#9d8f8f",
                                                                    }}
                                                                    onClick={() => {
                                                                        let updatedSortType;
                                                                        if (newSortType.incoDate === "ascending") {
                                                                            updatedSortType = "descending";
                                                                        } else if (newSortType.incoDate === "descending") {
                                                                            updatedSortType = "none";
                                                                        } else {
                                                                            updatedSortType = "ascending";
                                                                        }
                                                                        setNewSortType((prevData) => ({
                                                                            ...prevData,
                                                                            incoDate: updatedSortType,
                                                                        }));
                                                                        setSortPattern("IncoDate")
                                                                        fetchData(1, updatedSortType);
                                                                    }}
                                                                />
                                                                <ArrowDropDownIcon className="down-short-arrow"
                                                                    style={{
                                                                        color:
                                                                            newSortType.incoDate === "ascending"
                                                                                ? "black"
                                                                                : "#9d8f8f",
                                                                    }}
                                                                    onClick={() => {
                                                                        let updatedSortType;
                                                                        if (newSortType.incoDate === "ascending") {
                                                                            updatedSortType = "descending";
                                                                        } else if (newSortType.incoDate === "descending") {
                                                                            updatedSortType = "none";
                                                                        } else {
                                                                            updatedSortType = "ascending";
                                                                        }
                                                                        setNewSortType((prevData) => ({
                                                                            ...prevData,
                                                                            incoDate: updatedSortType,
                                                                        }));
                                                                        setSortPattern("IncoDate")
                                                                        fetchData(1, updatedSortType);
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </th>
                                                    <th>City</th>
                                                    <th>State</th>
                                                    <th>Company Email</th>
                                                    {(dataStatus === "Assigned") && <th>Status</th>}
                                                    {(dataStatus === "Assigned") && <th>Remarks</th>}
                                                    <th>Uploaded By</th>
                                                    <th>Uploaded On</th>
                                                    {dataStatus === 'Extracted' && <th>Last Assigned To</th>}
                                                    {dataStatus === "Extracted" && <th>Extracted Date</th>}
                                                    {dataStatus === "Assigned" && <th>Assigned to</th>}
                                                    {dataStatus === "Assigned" && (<th style={{ cursor: "pointer" }}>
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            {/* <div>{dataStatus !== "Unassigned" ? "Assigned On" : "Uploaded On"}</div> */}
                                                            <div>Assigned On</div>
                                                            <div className="short-arrow-div">
                                                                <ArrowDropUpIcon
                                                                    className="up-short-arrow"
                                                                    style={{
                                                                        color: newSortType.assignDate === "descending" ? "black" : "#9d8f8f",
                                                                    }}
                                                                    onClick={() => {
                                                                        let updatedSortType;
                                                                        if (newSortType.assignDate === "ascending") {
                                                                            updatedSortType = "descending";
                                                                        } else if (newSortType.assignDate === "descending") {
                                                                            updatedSortType = "none";
                                                                        } else {
                                                                            updatedSortType = "ascending";
                                                                        }
                                                                        setNewSortType((prevData) => ({
                                                                            ...prevData,
                                                                            assignDate: updatedSortType,
                                                                        }));
                                                                        setSortPattern("AssignDate")
                                                                        fetchData(1, updatedSortType);
                                                                    }}
                                                                />
                                                                <ArrowDropDownIcon className="down-short-arrow"
                                                                    style={{
                                                                        color:
                                                                            newSortType.assignDate === "ascending"
                                                                                ? "black"
                                                                                : "#9d8f8f",
                                                                    }}
                                                                    onClick={() => {
                                                                        let updatedSortType;
                                                                        if (newSortType.assignDate === "ascending") {
                                                                            updatedSortType = "descending";
                                                                        } else if (newSortType.assignDate === "descending") {
                                                                            updatedSortType = "none";
                                                                        } else {
                                                                            updatedSortType = "ascending";
                                                                        }
                                                                        setNewSortType((prevData) => ({
                                                                            ...prevData,
                                                                            assignDate: updatedSortType,
                                                                        }));
                                                                        setSortPattern("AssignDate")
                                                                        fetchData(1, updatedSortType);
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </th>)}


                                                    {/* <th>Assigned On</th> */}
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            {currentDataLoading ? (
                                                <tbody>
                                                    <tr>
                                                        <td colSpan="14" >
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
                                                    {(isFilter || isSearching) && dataStatus === 'Unassigned' && unAssignedData.map((company, index) => (
                                                        <tr
                                                            key={index}
                                                            className={selectedRows.includes(company._id) ? "selected" : ""}
                                                            style={{ border: "1px solid #ddd" }}>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedRows.includes(company._id)}
                                                                    onChange={() => handleCheckboxChange(company._id)}
                                                                    onMouseDown={() => handleMouseDown(company._id)}
                                                                    onMouseEnter={() => handleMouseEnter(company._id)}
                                                                    onMouseUp={handleMouseUp}
                                                                />
                                                            </td>
                                                            <td>{startIndex - 500 + index + 1}</td>
                                                            <td>{company["Company Name"]}</td>

                                                            <td>{company["Company Number"]}</td>
                                                            {(dataStatus === "Extracted" || dataStatus === "Assigned") && (<td>
                                                                <LuHistory
                                                                    onClick={() => {
                                                                        handleShowCallHistory(
                                                                            company["Company Name"],
                                                                            company["Company Number"],


                                                                        );
                                                                    }}
                                                                    style={{
                                                                        cursor: "pointer",
                                                                        width: "15px",
                                                                        height: "15px",
                                                                    }}
                                                                    color="grey"
                                                                />
                                                            </td>)}
                                                            <td>{formatDateFinal(company["Company Incorporation Date  "])}</td>
                                                            <td>{company["City"]}</td>
                                                            <td>{company["State"]}</td>
                                                            <td>{company["Company Email"]}</td>

                                                            {(dataStatus === "Assigned") && <td>{company["Status"]}</td>}
                                                            {(dataStatus === "Assigned") &&
                                                                <td>
                                                                    <AdminRemarksDialog
                                                                        key={`${"Company Name"}-${index}`}
                                                                        currentRemarks={company.Remarks}
                                                                        companyID={company._id}
                                                                        companyStatus={company.Status}
                                                                        secretKey={secretKey}

                                                                    />
                                                                    {/* <div style={{ width: "100px" }} className="d-flex align-items-center justify-content-between">
                                                                    <p className="rematkText text-wrap m-0">
                                                                        {company["Remarks"] ? company.Remarks : "No Remarks Added"}
                                                                    </p>
                                                                    <div
                                                                        onClick={() => {
                                                                            functionopenpopupremarks(company._id, company.Status);
                                                                        }}
                                                                        style={{ cursor: "pointer" }}>
                                                                        <IconEye

                                                                            style={{
                                                                                width: "14px",
                                                                                height: "14px",
                                                                                color: "#d6a10c",
                                                                                cursor: "pointer",
                                                                                marginLeft: "4px",
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div> */}
                                                                </td>}

                                                            <td>{company["UploadedBy"] ? company["UploadedBy"] : "-"}</td>
                                                            <td>{formatDateFinal(company["UploadDate"])}</td>
                                                            {dataStatus === "Extracted" && <td>{company.lastAssignedEmployee}</td>}
                                                            {dataStatus === "Extracted" && <td>{formatDateFinal(company["extractedDate"])}</td>}
                                                            {dataStatus === "Assigned" && <td>{company["ename"]}</td>}
                                                            {(dataStatus === "Assigned") && <td>{formatDateFinal(company["AssignDate"])}</td>}
                                                            <td>
                                                                <button className='tbl-action-btn' onClick={() => handleDeleteClick(company._id)}  >
                                                                    <MdDeleteOutline
                                                                        style={{
                                                                            width: "14px",
                                                                            height: "14px",
                                                                            color: "#bf0b0b",
                                                                            cursor: "pointer",
                                                                        }}
                                                                    />
                                                                </button>
                                                                <button className='tbl-action-btn' onClick={
                                                                    data.length === "0"
                                                                        ? Swal.fire("Please Import Some data first")
                                                                        : () => {
                                                                            setOpenLeadsModifyPopUp(true);
                                                                            handleUpdateClick(company._id);
                                                                        }
                                                                }>
                                                                    < MdOutlineEdit
                                                                        style={{
                                                                            width: "14px",
                                                                            height: "14px",
                                                                            color: "grey",
                                                                            cursor: "pointer",
                                                                        }}
                                                                    />
                                                                </button>

                                                                <button className='tbl-action-btn' to={`/managing-director/leads/${company._id}`} >
                                                                    <IconEye
                                                                        style={{
                                                                            width: "14px",
                                                                            height: "14px",
                                                                            color: "#d6a10c",
                                                                            cursor: "pointer",
                                                                        }}
                                                                    />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}

                                                    {(isFilter || isSearching) && dataStatus === 'Extracted' && extractedData.map((company, index) => (
                                                        <tr
                                                            key={index}
                                                            className={selectedRows.includes(company._id) ? "selected" : ""}
                                                            style={{ border: "1px solid #ddd" }}>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedRows.includes(company._id)}
                                                                    onChange={() => handleCheckboxChange(company._id)}
                                                                    onMouseDown={() => handleMouseDown(company._id)}
                                                                    onMouseEnter={() => handleMouseEnter(company._id)}
                                                                    onMouseUp={handleMouseUp}
                                                                />
                                                            </td>
                                                            <td>{startIndex - 500 + index + 1}</td>
                                                            <td>{company["Company Name"]}</td>
                                                            <td>{company["Company Number"]}</td>
                                                            {(dataStatus === "Extracted" || dataStatus === "Assigned") && (<td>
                                                                <LuHistory
                                                                    onClick={() => {
                                                                        handleShowCallHistory(
                                                                            company["Company Name"],
                                                                            company["Company Number"],


                                                                        );
                                                                    }}
                                                                    style={{
                                                                        cursor: "pointer",
                                                                        width: "15px",
                                                                        height: "15px",
                                                                    }}
                                                                    color="grey"
                                                                />
                                                            </td>)}
                                                            <td>{formatDateFinal(company["Company Incorporation Date  "])}</td>
                                                            <td>{company["City"]}</td>
                                                            <td>{company["State"]}</td>
                                                            <td>{company["Company Email"]}</td>
                                                            {(dataStatus === "Assigned") && <td>{company["Status"]}</td>}
                                                            {(dataStatus === "Assigned") && <td>
                                                                <AdminRemarksDialog
                                                                    key={`${"Company Name"}-${index}`}
                                                                    currentRemarks={company.Remarks}
                                                                    companyID={company._id}
                                                                    companyStatus={company.Status}
                                                                    secretKey={secretKey}

                                                                />
                                                                {/* <div style={{ width: "100px" }} className="d-flex align-items-center justify-content-between">
                                                                    <p className="rematkText text-wrap m-0">
                                                                        {company["Remarks"] ? company.Remarks : "No Remarks Added"}
                                                                    </p>
                                                                    <div
                                                                        onClick={() => {
                                                                            functionopenpopupremarks(company._id, company.Status);
                                                                        }}
                                                                        style={{ cursor: "pointer" }}>
                                                                        <IconEye

                                                                            style={{
                                                                                width: "14px",
                                                                                height: "14px",
                                                                                color: "#d6a10c",
                                                                                cursor: "pointer",
                                                                                marginLeft: "4px",
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div> */}
                                                            </td>}
                                                            <td>{company["UploadedBy"] ? company["UploadedBy"] : "-"}</td>
                                                            <td>{formatDateFinal(company["UploadDate"])}</td>

                                                            {dataStatus === "Extracted" && <td>{company.lastAssignedEmployee}</td>}
                                                            {dataStatus === "Extracted" && <td>{formatDateFinal(company["extractedDate"])}</td>}
                                                            {dataStatus === "Assigned" && <td>{company["ename"]}</td>}
                                                            {(dataStatus === "Assigned") && <td>{formatDateFinal(company["AssignDate"])}</td>}
                                                            <td>
                                                                <button className='tbl-action-btn' onClick={() => handleDeleteClick(company._id)}  >
                                                                    <MdDeleteOutline
                                                                        style={{
                                                                            width: "14px",
                                                                            height: "14px",
                                                                            color: "#bf0b0b",
                                                                            cursor: "pointer",
                                                                        }}
                                                                    />
                                                                </button>
                                                                <button className='tbl-action-btn' onClick={
                                                                    data.length === "0"
                                                                        ? Swal.fire("Please Import Some data first")
                                                                        : () => {
                                                                            setOpenLeadsModifyPopUp(true);
                                                                            handleUpdateClick(company._id);
                                                                        }
                                                                }>
                                                                    < MdOutlineEdit
                                                                        style={{
                                                                            width: "14px",
                                                                            height: "14px",
                                                                            color: "grey",
                                                                            cursor: "pointer",
                                                                        }}
                                                                    />
                                                                </button>

                                                                <button className='tbl-action-btn' to={`/managing-director/leads/${company._id}`} >
                                                                    <IconEye
                                                                        style={{
                                                                            width: "14px",
                                                                            height: "14px",
                                                                            color: "#d6a10c",
                                                                            cursor: "pointer",
                                                                        }}
                                                                    />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}

                                                    {(isFilter || isSearching) && dataStatus === 'Assigned' && assignedData.map((company, index) => (
                                                        <tr
                                                            key={index}
                                                            className={selectedRows.includes(company._id) ? "selected" : ""}
                                                            style={{ border: "1px solid #ddd" }}>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedRows.includes(company._id)}
                                                                    onChange={() => handleCheckboxChange(company._id)}
                                                                    onMouseDown={() => handleMouseDown(company._id)}
                                                                    onMouseEnter={() => handleMouseEnter(company._id)}
                                                                    onMouseUp={handleMouseUp}
                                                                />
                                                            </td>
                                                            <td>{startIndex - 500 + index + 1}</td>
                                                            <td>{company["Company Name"]}</td>
                                                            <td>{company["Company Number"]}</td>
                                                            {(dataStatus === "Extracted" || dataStatus === "Assigned") && (<td>
                                                                <LuHistory
                                                                    onClick={() => {
                                                                        handleShowCallHistory(
                                                                            company["Company Name"],
                                                                            company["Company Number"],


                                                                        );
                                                                    }}
                                                                    style={{
                                                                        cursor: "pointer",
                                                                        width: "15px",
                                                                        height: "15px",
                                                                    }}
                                                                    color="grey"
                                                                />
                                                            </td>)}
                                                            <td>{formatDateFinal(company["Company Incorporation Date  "])}</td>
                                                            <td>{company["City"]}</td>
                                                            <td>{company["State"]}</td>
                                                            <td>{company["Company Email"]}</td>

                                                            {(dataStatus === "Assigned") && <td>{company["Status"]}</td>}
                                                            {(dataStatus === "Assigned") && <td>
                                                                <AdminRemarksDialog
                                                                    key={`${"Company Name"}-${index}`}
                                                                    currentRemarks={company.Remarks}
                                                                    companyID={company._id}
                                                                    companyStatus={company.Status}
                                                                    secretKey={secretKey}

                                                                />
                                                                
                                                            </td>}
                                                            <td>{company["UploadedBy"] ? company["UploadedBy"] : "-"}</td>
                                                            <td>{formatDateFinal(company["UploadDate"])}</td>
                                                            {dataStatus === "Extracted" && <td>{company.lastAssignedEmployee}</td>}
                                                            {dataStatus === "Extracted" && <td>{formatDateFinal(company["extractedDate"])}</td>}
                                                            {dataStatus === "Assigned" && <td>{company["ename"]}</td>}
                                                            {(dataStatus === "Assigned") && <td>{formatDateFinal(company["AssignDate"])}</td>}
                                                            <td>
                                                                <button className='tbl-action-btn' onClick={() => handleDeleteClick(company._id)}  >
                                                                    <MdDeleteOutline
                                                                        style={{
                                                                            width: "14px",
                                                                            height: "14px",
                                                                            color: "#bf0b0b",
                                                                            cursor: "pointer",
                                                                        }}
                                                                    />
                                                                </button>
                                                                <button className='tbl-action-btn' onClick={
                                                                    data.length === "0"
                                                                        ? Swal.fire("Please Import Some data first")
                                                                        : () => {
                                                                            setOpenLeadsModifyPopUp(true);
                                                                            handleUpdateClick(company._id);
                                                                        }
                                                                }>
                                                                    < MdOutlineEdit
                                                                        style={{
                                                                            width: "14px",
                                                                            height: "14px",
                                                                            color: "grey",
                                                                            cursor: "pointer",
                                                                        }}
                                                                    />
                                                                </button>

                                                                <button className='tbl-action-btn' to={`/managing-director/leads/${company._id}`} >
                                                                    <IconEye
                                                                        style={{
                                                                            width: "14px",
                                                                            height: "14px",
                                                                            color: "#d6a10c",
                                                                            cursor: "pointer",
                                                                        }}
                                                                    />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}

                                                    {(!isFilter && !isSearching) && data.map((company, index) => (
                                                        <tr
                                                            key={index}
                                                            className={selectedRows.includes(company._id) ? "selected" : ""}
                                                            style={{ border: "1px solid #ddd" }}>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedRows.includes(company._id)}
                                                                    onChange={() => handleCheckboxChange(company._id)}
                                                                    onMouseDown={() => handleMouseDown(company._id)}
                                                                    onMouseEnter={() => handleMouseEnter(company._id)}
                                                                    onMouseUp={handleMouseUp}
                                                                />
                                                            </td>
                                                            <td>{startIndex - 500 + index + 1}</td>
                                                            <td>{company["Company Name"]}</td>
                                                            <td>{company["Company Number"]}</td>
                                                            {(dataStatus === "Extracted" || dataStatus === "Assigned") && (<td>
                                                                <LuHistory
                                                                    onClick={() => {
                                                                        handleShowCallHistory(
                                                                            company["Company Name"],
                                                                            company["Company Number"],


                                                                        );
                                                                    }}
                                                                    style={{
                                                                        cursor: "pointer",
                                                                        width: "15px",
                                                                        height: "15px",
                                                                    }}
                                                                    color="grey"
                                                                />
                                                            </td>)}
                                                            <td>{formatDateFinal(company["Company Incorporation Date  "])}</td>
                                                            <td>{company["City"]}</td>
                                                            <td>{company["State"]}</td>
                                                            <td>{company["Company Email"]}</td>
                                                            {(dataStatus === "Assigned") && <td>{company["Status"]}</td>}
                                                            {(dataStatus === "Assigned") &&
                                                                <td>
                                                                    <AdminRemarksDialog
                                                                        key={`${"Company Name"}-${index}`}
                                                                        currentRemarks={company.Remarks}
                                                                        companyID={company._id}
                                                                        companyStatus={company.Status}
                                                                        secretKey={secretKey}

                                                                    />
                                                                    {/* <div style={{ width: "100px" }} className="d-flex align-items-center justify-content-between">
                                                                    <p className="rematkText text-wrap m-0">
                                                                        {company["Remarks"] ? company.Remarks : "No Remarks Added"}
                                                                    </p>
                                                                    <div
                                                                        onClick={() => {
                                                                            functionopenpopupremarks(company._id, company.Status);
                                                                        }}
                                                                        style={{ cursor: "pointer" }}>
                                                                        <IconEye

                                                                            style={{
                                                                                width: "14px",
                                                                                height: "14px",
                                                                                color: "#d6a10c",
                                                                                cursor: "pointer",
                                                                                marginLeft: "4px",
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div> */}
                                                                </td>}
                                                            <td>{company["UploadedBy"] ? company["UploadedBy"] : "-"}</td>
                                                            <td>{formatDateFinal(company["UploadDate"])}</td>
                                                            {dataStatus === "Extracted" && <td>{company.lastAssignedEmployee}</td>}
                                                            {dataStatus === "Extracted" && <td>{formatDateFinal(company["extractedDate"])}</td>}
                                                            {dataStatus === "Assigned" && <td>{company["ename"]}</td>}
                                                            {(dataStatus === "Assigned") && <td>{formatDateFinal(company["AssignDate"])}</td>}
                                                            <td>
                                                                <button className='tbl-action-btn' onClick={() => handleDeleteClick(company._id)}  >
                                                                    <MdDeleteOutline
                                                                        style={{
                                                                            width: "14px",
                                                                            height: "14px",
                                                                            color: "#bf0b0b",
                                                                            cursor: "pointer",
                                                                        }}
                                                                    />
                                                                </button>
                                                                <button className='tbl-action-btn' onClick={
                                                                    data.length === "0"
                                                                        ? Swal.fire("Please Import Some data first")
                                                                        : () => {
                                                                            setOpenLeadsModifyPopUp(true);
                                                                            handleUpdateClick(company._id);
                                                                        }
                                                                }>
                                                                    < MdOutlineEdit
                                                                        style={{
                                                                            width: "14px",
                                                                            height: "14px",
                                                                            color: "grey",
                                                                            cursor: "pointer",
                                                                        }}
                                                                    />
                                                                </button>

                                                                <button className='tbl-action-btn' to={`/managing-director/leads/${company._id}`} >
                                                                    <IconEye
                                                                        style={{
                                                                            width: "14px",
                                                                            height: "14px",
                                                                            color: "#d6a10c",
                                                                            cursor: "pointer",
                                                                        }}
                                                                    />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            )}
                                        </table>
                                    </div>
                                </div>

                                {(!isFilter || !isSearching) && data.length === 0 && !currentDataLoading && (
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td colSpan="13" className="p-2 particular">
                                                    <Nodata />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                )}

                                {(isFilter || isSearching) && dataStatus === 'Unassigned' && unAssignedData.length === 0 && !currentDataLoading && (
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td colSpan="13" className="p-2 particular">
                                                    <Nodata />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                )}

                                {(isFilter || isSearching) && dataStatus === 'Extracted' && extractedData.length === 0 && !currentDataLoading && (
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td colSpan="13" className="p-2 particular">
                                                    <Nodata />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                )}

                                {(isFilter || isSearching) && dataStatus === 'Assigned' && assignedData.length === 0 && !currentDataLoading && (
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td colSpan="13" className="p-2 particular">
                                                    <Nodata />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                )}

                                {/* {data.length !== 0 && (
                                <div style={{ display: "flex", justifyContent: "space-between", margin: "10px" }} className="pagination">
                                    <button style={{ background: "none", border: "0px transparent" }} onClick={handlePreviousPage} disabled={currentPage === 1}>
                                        <IconChevronLeft />
                                    </button>
                                    <span>Page {currentPage} /{totalCount}</span>
                                    <button style={{ background: "none", border: "0px transparent" }} onClick={handleNextPage} disabled={data.length < itemsPerPage}>
                                        <IconChevronRight />
                                    </button>
                                </div>
                            )} */}

                                {(data.length !== 0 || ((isFilter || isSearching) && (assignedData.length !== 0 || unAssignedData.length !== 0 || extractedData.length !== 0))) && (
                                    <div style={{ display: "flex", justifyContent: "space-between", margin: "10px" }} className="pagination">
                                        <button style={{ background: "none", border: "0px transparent" }} onClick={handlePreviousPage} disabled={currentPage === 1}>
                                            <IconChevronLeft />
                                        </button>
                                        {(isFilter || isSearching) && dataStatus === 'Assigned' && <span>Page {currentPage} / {Math.ceil(totalCompaniesAssigned / 500)}</span>}
                                        {(isFilter || isSearching) && dataStatus === 'Unassigned' && <span>Page {currentPage} / {Math.ceil(totalCompaniesUnassigned / 500)}</span>}
                                        {(isFilter || isSearching) && dataStatus === 'Extracted' && <span>Page {currentPage} / {Math.ceil(totalExtractedCount / 500)}</span>}
                                        {(!isFilter && !isSearching) && <span>Page {currentPage} / {totalCount}</span>}
                                        <button style={{ background: "none", border: "0px transparent" }} onClick={handleNextPage} disabled={
                                            ((isFilter || isSearching) && dataStatus === 'Assigned' && assignedData.length < itemsPerPage) ||
                                            ((isFilter || isSearching) && dataStatus === 'Unassigned' && unAssignedData.length < itemsPerPage) ||
                                            ((isFilter || isSearching) && dataStatus === 'Extracted' && extractedData.length < itemsPerPage) ||
                                            ((!isFilter || !isSearching) && data.length < itemsPerPage)
                                        }>
                                            <IconChevronRight />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* ---------Interested-FollowUp Leads---------------------------------- */}

            {
                openInterestFollowPage && (
                    <InterestedFollowUpLeads
                        closeOpenInterestedLeads={setOpenInterestFollowPage} />
                )
            }

            {/* -------------------call history page--------------------------------- */}

            {
                showCallHistory &&
                (<CallHistory
                    handleCloseHistory={hanleCloseCallHistory}
                    clientNumber={clientNumber}
                    companyName={companyName}
                // bdenumber={data.number}
                // bdmName={data.bdmName}
                />)
            }

            {/* -------------------- dialog to add leads---------------------------- */}
            <Dialog className='My_Mat_Dialog' open={openAddLeadsDialog} onClose={closeAddLeadsDialog} fullWidth maxWidth="md">
                <DialogTitle>
                    Company Info{" "}
                    <button style={{ background: "none", border: "0px transparent", float: "right" }} onClick={closeAddLeadsDialog} >
                        <IoIosClose style={{
                            height: "36px",
                            width: "32px",
                            color: "grey"
                        }} />
                    </button>
                </DialogTitle>
                <DialogContent>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label className="form-label">Company Name <span style={{ color: "red" }}>*</span></label>
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
                                    </div>
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label className="form-label">Company Number <span style={{ color: "red" }}>*</span></label>
                                            <input
                                                type="number"
                                                placeholder="Enter Company's Phone No."
                                                onChange={(e) => {
                                                    if (/^\d{10}$/.test(e.target.value)) {
                                                        setCnumber(e.target.value);
                                                        setError('');
                                                    } else {
                                                        setError('Please enter a 10-digit number');
                                                        setCnumber()
                                                    }
                                                }}
                                                className="form-control"
                                            />
                                            {error && <p style={{ color: 'red' }}>{error}</p>}
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label className="form-label">Company Email <span style={{ color: "red" }}>*</span></label>
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
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">
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
                                    <div className="col-lg-4">
                                        <div className="mb-3">
                                            <label className="form-label">City<span style={{ color: "red" }}>*</span></label>
                                            <input
                                                onChange={(e) => {
                                                    setCity(e.target.value);
                                                }}
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Your City"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="mb-3">
                                            <label className="form-label">State<span style={{ color: "red" }}>*</span></label>
                                            <input
                                                onChange={(e) => {
                                                    setState(e.target.value);
                                                }}
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Your State"
                                            //disabled={!isEditProjection}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <label className="form-label">Company Address</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="example-text-input"
                                                placeholder="Enter Your Address"
                                                onChange={(e) => {
                                                    setCompanyAddress(e.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label className="form-label">Director's Name(First)</label>
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
                                            <label className="form-label">Director's Number(First)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="example-text-input"
                                                placeholder="Enter Phone No."
                                                onChange={(e) => {
                                                    if (/^\d{10}$/.test(e.target.value)) {
                                                        setDirectorNumberFirst(e.target.value)
                                                        setErrorDirectorNumberFirst("")
                                                    } else {
                                                        setErrorDirectorNumberFirst('Please Enter 10 digit Number')
                                                        setDirectorNumberFirst()
                                                    }
                                                }}
                                            />
                                            {errorDirectorNumberFirst && <p style={{ color: 'red' }}>{errorDirectorNumberFirst}</p>}
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label className="form-label">Director's Email(First)</label>
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
                                {firstPlus && (<div className="d-flex align-items-center justify-content-end gap-2">
                                    <button
                                        onClick={() => { functionOpenSecondDirector() }}
                                        className="btn btn-primary d-none d-sm-inline-block">
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
                                    <button className="btn btn-primary d-none d-sm-inline-block">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon"
                                            width="24"
                                            height="24"
                                            fill="white" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" /></svg>
                                    </button></div>)}

                                {openSecondDirector && (
                                    <div className="row">
                                        <div className="col-4">
                                            <div className="mb-3">
                                                <label className="form-label">Director's Name(Second)</label>
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
                                                <label className="form-label">Director's Number(Second)</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="example-text-input"
                                                    placeholder="Enter Phone No."
                                                    onChange={(e) => {
                                                        if (/^\d{10}$/.test(e.target.value)) {
                                                            setDirectorNumberSecond(e.target.value)
                                                            setErrorDirectorNumberSecond("")
                                                        } else {
                                                            setErrorDirectorNumberSecond('Please Enter 10 digit Number')
                                                            setDirectorNumberSecond()
                                                        }
                                                    }}
                                                />
                                                {errorDirectorNumberSecond && <p style={{ color: 'red' }}>{errorDirectorNumberSecond}</p>}
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="mb-3">
                                                <label className="form-label">Director's Email(Second)</label>
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
                                    </div>)}
                                {secondPlus && (<div className="d-flex align-items-center justify-content-end gap-2">
                                    <button
                                        onClick={() => { functionOpenThirdDirector() }}
                                        className="btn btn-primary d-none d-sm-inline-block">
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
                                    <button className="btn btn-primary d-none d-sm-inline-block"
                                        onClick={() => { functionCloseSecondDirector() }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon"
                                            width="24"
                                            height="24"
                                            fill="white" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" /></svg>
                                    </button></div>)}

                                {openThirdDirector && (<div className="row">
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label className="form-label">Director's Name(Third)</label>
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
                                            <label className="form-label">Director's Number(Third)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="example-text-input"
                                                placeholder="Enter Phone No"
                                                onChange={(e) => {
                                                    if (/^\d{10}$/.test(e.target.value)) {
                                                        setDirectorNumberThird(e.target.value)
                                                        setErrorDirectorNumberThird("")
                                                    } else {
                                                        setErrorDirectorNumberThird('Please Enter 10 digit Number')
                                                        setDirectorNumberThird()
                                                    }
                                                }}
                                            />
                                            {errorDirectorNumberThird && <p style={{ color: 'red' }}>{errorDirectorNumberThird}</p>}
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label className="form-label">Director's Email(Third)</label>
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
                                </div>)}
                                {openThirdMinus && (<button className="btn btn-primary d-none d-sm-inline-block" style={{ float: "right" }}
                                    onClick={() => { functionCloseThirdDirector() }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon"
                                        width="24"
                                        height="24"
                                        fill="white" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" /></svg>
                                </button>)}
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <button className="btn btn-primary bdr-radius-none"
                    onClick={handleSubmitData}
                >
                    Submit
                </button>
            </Dialog>

            {/* ------------------------ dialog to add bulk leads as csv---------------- */}
            <Dialog className='My_Mat_Dialog' open={openBulkLeadsCSVPopup} onClose={closeBulkLeadsCSVPopup} fullWidth maxWidth="sm">
                <DialogTitle>
                    Import CSV DATA{" "}
                    <button style={{ background: "none", border: "0px transparent", float: "right" }} onClick={closeBulkLeadsCSVPopup}>
                        <IoIosClose style={{
                            height: "36px",
                            width: "32px",
                            color: "grey"
                        }} />
                    </button>
                </DialogTitle>
                <DialogContent>
                    <div className="maincon">
                        <div
                            style={{ justifyContent: "space-between" }}
                            className="con1 d-flex"
                        >
                            <div style={{ paddingTop: "9px" }} className="uploadcsv">
                                <label
                                    style={{ margin: "0px 0px 6px 0px" }}
                                    htmlFor="upload"
                                >
                                    Upload CSV File
                                </label>
                            </div>
                            <a href={frontendKey + "/AddLeads_AdminSample.xlsx"} download>
                                Download Sample
                            </a>
                        </div>
                        <div
                            style={{ margin: "5px 0px 0px 0px" }}
                            className="form-control"
                        >
                            <input
                                type="file"
                                name="csvfile
                      "
                                id="csvfile"
                                onChange={handleFileChange}
                            />
                        </div>
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
                                <label htmlFor="direct">Upload To General</label>
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
                    {selectedOption === "someoneElse" && (
                        <div>
                            {empData.length !== 0 ? (
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
                                                    {empData.map((item) => (
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
                <button className="btn btn-primary bdr-radius-none" onClick={handleUploadData}>
                    Submit
                </button>
            </Dialog>


            {/* --------------------------dialog to assign leads--------------------------------------------------------------- */}
            <Dialog className='My_Mat_Dialog' open={openAssignLeadsDialog} onClose={closeAssignLeadsDialog} fullWidth maxWidth="sm">
                <DialogTitle>
                    Assign Data
                    <button style={{ background: "none", border: "0px transparent", float: "right" }} onClick={closeAssignLeadsDialog}>
                        <IoIosClose style={{
                            height: "36px",
                            width: "32px",
                            color: "grey"
                        }} />
                    </button>
                </DialogTitle>
                <DialogContent>
                    {dataStatus === "Unassigned" && <div>
                        {empData.length !== 0 ? (
                            <>
                                <div className="dialogAssign">
                                    <div className="selector form-control">
                                        <select
                                            style={{
                                                width: "inherit",
                                                border: "none",
                                                outline: "none",
                                            }}
                                            value={employeeSelection}
                                            onChange={(e) => {
                                                setEmployeeSelection(e.target.value);
                                            }}
                                        >
                                            <option value="Not Alloted" disabled>
                                                Select employee
                                            </option>
                                            {empData.map((item) => (
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
                    </div>}
                    {dataStatus === "Assigned" && (
                        <div>
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
                                    className="direct form-control">
                                    <input
                                        type="radio"
                                        id="direct"
                                        value="direct"
                                        style={{
                                            display: "none",
                                        }}
                                        checked={selectedOption === "direct"}
                                        onChange={(e) => {
                                            handleOptionChange(e);
                                            setEmployeeSelection("Not Alloted");
                                        }}
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
                                    }}>
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

                                <div
                                    style={
                                        selectedOption === "extractedData"
                                            ? {
                                                backgroundColor: "#e9eae9",
                                                margin: "10px 0px 0px 9px",
                                                cursor: "pointer",
                                            }
                                            : {
                                                backgroundColor: "white",
                                                margin: "10px 0px 0px 9px",
                                                cursor: "pointer",
                                            }
                                    }
                                    className="extractedData form-control"
                                    onClick={() => {
                                        setSelectedOption("extractedData");
                                    }}>
                                    <input
                                        type="radio"
                                        id="extractedData"
                                        value="extractedData"
                                        style={{
                                            display: "none",
                                        }}
                                        checked={selectedOption === "extractedData"}
                                        onChange={(e) => {
                                            handleOptionChange(e);
                                            setEmployeeSelection("Extracted");
                                        }}
                                    />
                                    <label htmlFor="extractedData">Extracted Data</label>
                                </div>
                            </div>
                            <div>
                                {empData.length !== 0 && selectedOption === "someoneElse" && (
                                    <>
                                        <div className="dialogAssign mt-2">
                                            <div className="selector form-control">
                                                <select
                                                    style={{
                                                        width: "inherit",
                                                        border: "none",
                                                        outline: "none",
                                                    }}
                                                    value={employeeSelection}
                                                    onChange={(e) => {
                                                        setEmployeeSelection(e.target.value);
                                                    }}
                                                >
                                                    <option value="Not Alloted" disabled>
                                                        Select employee
                                                    </option>
                                                    {empData.map((item) => (
                                                        <option value={item.ename}>{item.ename}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                    {dataStatus === "Extracted" && (
                        <div>
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
                                    className="direct form-control">
                                    <input
                                        type="radio"
                                        id="direct"
                                        value="direct"
                                        style={{
                                            display: "none",
                                        }}
                                        checked={selectedOption === "direct"}
                                        onChange={(e) => {
                                            handleOptionChange(e);
                                            setEmployeeSelection("Not Alloted");
                                        }}
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
                                    }}>
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
                            <div>
                                {empData.length !== 0 && selectedOption === "someoneElse" && (
                                    <>
                                        <div className="dialogAssign mt-2">
                                            <div className="selector form-control">
                                                <select
                                                    style={{
                                                        width: "inherit",
                                                        border: "none",
                                                        outline: "none",
                                                    }}
                                                    value={employeeSelection}
                                                    onChange={(e) => {
                                                        setEmployeeSelection(e.target.value);
                                                    }}
                                                >
                                                    <option value="Not Alloted" disabled>
                                                        Select employee
                                                    </option>
                                                    {empData.map((item) => (
                                                        <option value={item.ename}>{item.ename}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                    )}
                </DialogContent>

                <div className="btn-list">
                    <button
                        style={{ width: "100vw", borderRadius: "0px" }}
                        onClick={handleconfirmAssign}
                        className="btn btn-primary ms-auto"
                    >
                        Assign Data
                    </button>
                </div>
            </Dialog>

            {/* --------------------------dialog for modify leads------------------------------ */}
            <Dialog className='My_Mat_Dialog' open={openLeadsModifyPopUp} onClose={functioncloseModifyPopup} fullWidth maxWidth="md">
                <DialogTitle className="d-flex align-items-center justify-content-between">
                    <div>
                        Company Info{" "}
                    </div>
                    <div>
                        <button style={{ background: "none", border: "0px transparent" }}
                            onClick={() => { setIsEditProjection(true) }}>
                            <MdOutlineEdit
                                style={{
                                    width: "20px",
                                    height: "20px",
                                    color: "grey"
                                }}
                            />
                        </button>
                        <button style={{ background: "none", border: "0px transparent" }}
                            onClick={functioncloseModifyPopup}>
                            <IoIosClose style={{
                                height: "36px",
                                width: "32px",
                                color: "grey"
                            }} />
                        </button>{" "}
                    </div>

                </DialogTitle>
                <DialogContent>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label className="form-label">Company Name <span style={{ color: "red" }}>*</span></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="example-text-input"
                                                placeholder="Your Company Name"
                                                value={companyName}
                                                onChange={(e) => {
                                                    setCompanyName(e.target.value);
                                                }}
                                                disabled={!isEditProjection}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label className="form-label">Company Number <span style={{ color: "red" }}>*</span></label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="example-text-input"
                                                placeholder="Your Company Number"
                                                value={companynumber}
                                                onChange={(e) => {
                                                    if (/^\d{10}$/.test(e.target.value)) {
                                                        setCompnayNumber(e.target.value);
                                                        setErrorCompnayNumber('');
                                                    } else {
                                                        setError('Please enter a 10-digit number');
                                                        setCompnayNumber()
                                                    }
                                                }}
                                                disabled={!isEditProjection}
                                            />
                                            {errorCompnayNumber && <p style={{ color: 'red' }}>{errorCompnayNumber}</p>}
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label className="form-label">Company Email <span style={{ color: "red" }}>*</span></label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="example-text-input"
                                                placeholder="example@gmail.com"
                                                value={companyEmail}
                                                onChange={(e) => {
                                                    setCompanyEmail(e.target.value);
                                                }}
                                                disabled={!isEditProjection}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Company Incorporation Date
                                            </label>
                                            <input
                                                value={companyIncoDate}
                                                onChange={(e) => {
                                                    setCompanyIncoDate(e.target.value)
                                                }}
                                                type="date"
                                                className="form-control"
                                                disabled={!isEditProjection}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="mb-3">
                                            <label className="form-label">City<span style={{ color: "red" }}>*</span></label>
                                            <input
                                                value={companyCity}
                                                onChange={(e) => {
                                                    setCompnayCity(e.target.value);
                                                }}
                                                type="text"
                                                className="form-control"
                                                disabled={!isEditProjection}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="mb-3">
                                            <label className="form-label">State<span style={{ color: "red" }}>*</span></label>
                                            <input
                                                value={companyState}
                                                onChange={(e) => {
                                                    setCompnayState(e.target.value);
                                                }}
                                                type="text"
                                                className="form-control"
                                                disabled={!isEditProjection}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <label className="form-label">Company Address</label>
                                            <input
                                                value={cAddress}
                                                onChange={(e) => {
                                                    setCAddress(e.target.value);
                                                }}
                                                type="text"
                                                className="form-control"
                                                disabled={!isEditProjection}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label className="form-label">Director's Name(First)</label>
                                            <input
                                                value={directorNameFirstModify}
                                                onChange={(e) => {
                                                    setDirectorNameFirstModify(e.target.value);
                                                }}
                                                type="text"
                                                className="form-control"
                                                disabled={!isEditProjection}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label className="form-label">Director's Number(First)</label>
                                            <input
                                                value={directorNumberFirstModify}
                                                onChange={(e) => {
                                                    if (/^\d{10}$/.test(e.target.value)) {
                                                        setDirectorNumberFirstModify(e.target.value)
                                                        setErrorDirectorNumberFirstModify("")
                                                    } else {
                                                        setErrorDirectorNumberFirstModify('Please Enter 10 digit Number')
                                                        setDirectorNumberFirstModify()
                                                    }
                                                }}
                                                type="number"
                                                className="form-control"
                                                disabled={!isEditProjection}
                                            />
                                            {errorDirectorNumberFirst && <p style={{ color: 'red' }}>{errorDirectorNumberFirst}</p>}
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label className="form-label">Director's Email(First)</label>
                                            <input
                                                value={directorEmailFirstModify}
                                                onChange={(e) => {
                                                    setDirectorEmailFirstModify(e.target.value);
                                                }}
                                                type="email"
                                                className="form-control"
                                                disabled={!isEditProjection}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {firstPlus && (<div className="d-flex align-items-center justify-content-end gap-2">
                                    <button
                                        onClick={() => { functionOpenSecondDirector() }}
                                        className="btn btn-primary d-none d-sm-inline-block">
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
                                    <button className="btn btn-primary d-none d-sm-inline-block">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon"
                                            width="24"
                                            height="24"
                                            fill="white" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" /></svg>
                                    </button></div>)}

                                {openSecondDirector && (
                                    <div className="row">
                                        <div className="col-4">
                                            <div className="mb-3">
                                                <label className="form-label">Director's Name(Second)</label>
                                                <input
                                                    value={directorNameSecondModify}
                                                    onChange={(e) => {
                                                        setDirectorNameSecondModify(e.target.value);
                                                    }}
                                                    type="text"
                                                    className="form-control"
                                                    disabled={!isEditProjection}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="mb-3">
                                                <label className="form-label">Director's Number(Second)</label>
                                                <input
                                                    value={directorNumberSecondModify}
                                                    onChange={(e) => {
                                                        if (/^\d{10}$/.test(e.target.value)) {
                                                            setDirectorNumberSecondModify(e.target.value)
                                                            setErrorDirectorNumberSecondModify("")
                                                        } else {
                                                            setErrorDirectorNumberSecondModify('Please Enter 10 digit Number')
                                                            setDirectorNumberSecondModify()
                                                        }
                                                    }}
                                                    type="number"
                                                    className="form-control"
                                                    disabled={!isEditProjection}
                                                />
                                                {errorDirectorNumberSecondModify && <p style={{ color: 'red' }}>{errorDirectorNumberSecondModify}</p>}
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="mb-3">
                                                <label className="form-label">Director's Email(Second)</label>
                                                <input
                                                    value={directorEmailSecondModify}
                                                    onChange={(e) => {
                                                        setDirectorEmailSecondModify(e.target.value);
                                                    }}
                                                    type="email"
                                                    className="form-control"
                                                    disabled={!isEditProjection}
                                                />
                                            </div>
                                        </div>
                                    </div>)}
                                {secondPlus && (<div className="d-flex align-items-center justify-content-end gap-2">
                                    <button
                                        //onClick={() => { functionOpenThirdDirector() }}
                                        className="btn btn-primary d-none d-sm-inline-block">
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
                                    <button className="btn btn-primary d-none d-sm-inline-block" onClick={() => { functionCloseSecondDirector() }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon"
                                            width="24"
                                            height="24"
                                            fill="white" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" /></svg>
                                    </button></div>)}

                                {openThirdDirector && (<div className="row">
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label className="form-label">Director's Name(Third)</label>
                                            <input
                                                value={directorNameThirdModify}
                                                onChange={(e) => {
                                                    setDirectorNameThirdModify(e.target.value);
                                                }}
                                                type="text"
                                                className="form-control"
                                                disabled={!isEditProjection}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label className="form-label">Director's Number(Third)</label>
                                            <input
                                                value={directorNumberThirdModify}
                                                onChange={(e) => {
                                                    if (/^\d{10}$/.test(e.target.value)) {
                                                        setDirectorNumberThirdModify(e.target.value)
                                                        setErrorDirectorNumberThirdModify("")
                                                    } else {
                                                        setErrorDirectorNumberThirdModify('Please Enter 10 digit Number')
                                                        setDirectorNumberThirdModify()
                                                    }
                                                }}
                                                type="number"
                                                className="form-control"
                                                disabled={!isEditProjection}
                                            />
                                            {errorDirectorNumberThirdModify && <p style={{ color: 'red' }}>{errorDirectorNumberThirdModify}</p>}
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label className="form-label">Director's Email(Third)</label>
                                            <input
                                                value={directorEmailThirdModify}
                                                onChange={(e) => {
                                                    setDirectorEmailThirdModify(e.target.value);
                                                }}
                                                type="email"
                                                className="form-control"
                                                disabled={!isEditProjection}
                                            />
                                        </div>
                                    </div>
                                </div>)}
                                {openThirdMinus && (<button className="btn btn-primary d-none d-sm-inline-block" style={{ float: "right" }} onClick={() => { functionCloseThirdDirector() }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon"
                                        width="24"
                                        height="24"
                                        fill="white" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" /></svg>
                                </button>)}
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <button className="btn btn-primary"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </Dialog>

            {/* ---------------------------dialog to view remarks popup------------------------- */}
            {/* <Dialog className='My_Mat_Dialog'
                open={openRemarks}
                onClose={closepopupRemarks}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Remarks
                    <button style={{ background: "none", border: "0px transparent", float: "right" }}
                        onClick={closepopupRemarks}>
                        <IoIosClose style={{
                            height: "36px",
                            width: "32px",
                            color: "grey"
                        }} />
                    </button>
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
                                                    <pre>{historyItem.remarks || historyItem.bdmRemarks}</pre>
                                                    <pre>{historyItem.bdeName || historyItem.bdmName}</pre>
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
            </Dialog> */}

            {/* ---------------------------drawer for filter----------------------------- */}
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
                                            }}>
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
                                                    //handleSelectState(e.target.value)
                                                }}>
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
                                                }}>
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
                                        <label for="exampleFormControlInput1" class="form-label">Assigned To</label>
                                        <select class="form-select form-select-md" aria-label="Default select example"
                                            value={selectedBDEName}
                                            onChange={(e) => {
                                                setSelectedBDEName(e.target.value)
                                            }}>
                                            <option value=''>Select BDE</option>
                                            {newEmpData && newEmpData.map((item) => (
                                                <option value={item.ename}>{item.ename}</option>))}
                                        </select>
                                    </div>
                                </div>
                                <div className='col-sm-12 mt-2'>
                                    <div className='form-group'>
                                        <label for="assignon" class="form-label">Assign On</label>
                                        <input type="date" class="form-control" id="assignon"
                                            value={selectedAssignDate}
                                            placeholder="dd-mm-yyyy"
                                            defaultValue={null}
                                            onChange={(e) => setSelectedAssignDate(e.target.value)} />
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
                                                }}>
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
                                                }}>
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
                                                onChange={(e) => setSelectedDate(e.target.value)}>
                                                <option value=''>Date</option>
                                                {daysInMonth.map((day) => (
                                                    <option key={day} value={day}>{day}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-sm-12 mt-2'>
                                    <div className='form-group'>
                                        <label for="Uploadedby" class="form-label">Uploaded By</label>
                                        <input type="text" class="form-control" id="Uploadedby" placeholder="Enter Name"
                                            value={selectedAdminName}
                                            onChange={(e) => {
                                                setSelectedAdminName(e.target.value)
                                            }} />
                                    </div>
                                </div>
                                <div className='col-sm-12 mt-2'>
                                    <div className='form-group'>
                                        <label for="Uploadon" class="form-label">Uploaded On</label>
                                        <input type="date" class="form-control" id="Uploadon"
                                            value={selectedUploadedDate}
                                            defaultValue={null}
                                            placeholder="dd-mm-yyyy"
                                            onChange={(e) => setSelectedUploadedDate(e.target.value)} />
                                    </div>
                                </div>
                                <div className='col-sm-12 mt-2'>
                                    <div className='form-group'>
                                        <label for="Uploadon" class="form-label">Extracted On</label>
                                        <input type="date" class="form-control" id="Uploadon"
                                            value={selectedExtractedDate}
                                            defaultValue={null}
                                            placeholder="dd-mm-yyyy"
                                            onChange={(e) => setSelectedExtractedDate(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer-Drawer d-flex justify-content-between align-items-center">
                        <button className='filter-footer-btn btn-clear' onClick={handleClearFilter}>Clear Filter</button>
                        <button className='filter-footer-btn btn-yellow' onClick={handleFilterData}>Apply Filter</button>
                    </div>
                </div>
            </Drawer>

            {/* --------------------------------backedrop------------------------- */}
            {openBacdrop && (<Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBacdrop}
                onClick={handleCloseBackdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>)}
        </div>
    )
}

export default TestLeads