import React, { useState, useEffect, useRef } from 'react'
import { debounce } from "lodash";
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
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Link } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";
import { BsFilter } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";
import FilterableTableEmployeeDataReport from './FilterableTableEmployeeDataReport';


function EmployeeDataReport() {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [dataValue, setDataValue] = useState("")
    const [newName, setNewName] = useState([])
    const [selectedDateRangeEmployee, setSelectedDateRangeEmployee] = useState([]);
    const [sortType, setSortType] = useState({
        untouched: "none",
        busy: "none",
        notPickedUp: "none",
        junk: "none",
        followUp: "none",
        interested: "none",
        notInterested: "none",
        matured: "none",
        totalLeads: "none",
        lastLead: "none",
    })
    const [employeeData, setEmployeeData] = useState([]);
    const [employeeDataFilter, setEmployeeDataFilter] = useState([]);
    const [employeeInfo, setEmployeeInfo] = useState([]);
    const [expand, setExpand] = useState("");
    const [companyData, setCompanyData] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [dateRange, setDateRange] = useState("by-today");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [companyDataFilter, setcompanyDataFilter] = useState([]);
    const [companyDataTotal, setCompanyDataTotal] = useState([])
    const [incoFilter, setIncoFilter] = useState("");
    const [originalEmployeeData, setOriginalEmployeeData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [openEmployeeTable, setOpenEmployeeTable] = useState(false);
    const [mergedData, setMergedData] = useState([]);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [filteredData, setFilteredData] = useState(employeeData);
    const [filterField, setFilterField] = useState("")
    const filterMenuRef = useRef(null); // Ref for the filter menu container
    const [activeFilterField, setActiveFilterField] = useState(null);
    const [filterPosition, setFilterPosition] = useState({ top: 10, left: 5 });
    const fieldRefs = useRef({});
    const [noOfAvailableData, setnoOfAvailableData] = useState(0)
    const [activeFilterFields, setActiveFilterFields] = useState([]); // New state for active filter fields
    const [completeMergedData, setCompleteMergedData] = useState([])
    const [mergedDataForFilter, setMergedDataForFilter] = useState([])
    //-------------------------date formats ------------------------------
    function formatDateMonth(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }

    function formatDateFinal(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        const convertedDate = date.toLocaleDateString();
        return convertedDate;
    };

    //-------fetching employees info--------------------------------------------
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
            setEmployeeInfo(data.filter((employee) => employee.designation === "Sales Executive" || employee.designation === "Sales Manager"));
        } catch (error) {
            console.error('Error Fetching Employee Data ', error);
        } finally {
            setLoading(false);
        }
    };

    const debounceDelay = 300;
    //const debouncedFetchEmployeeInfo = debounce(fetchEmployeeInfo, debounceDelay);

    //----------------------------fetching company data ---------------------------

    // const fetchCompanyData = async () => {
    //     try {
    //         const response = await fetch(`${secretKey}/company-data/leads`);
    //         const data = await response.json();
    //         setLoading(true);
    //         setCompanyData(data.filter((obj) => obj.ename !== "Not Alloted"));
    //         setcompanyDataFilter(data.filter((obj) => obj.ename !== "Not Alloted"));
    //         setCompanyDataTotal(data.filter((obj) => obj.ename !== "Not Alloted"));
    //     } catch (error) {
    //         console.error('Error Fetching Company Data ', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const fetchCompanyData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${secretKey}/company-data/fetchLeads`);
            const data = await response.json();
           
            setCompanyData(data);
            setcompanyDataFilter(data);
            mergeEmployeeAndCompanyData(employeeData, data);
        } catch (error) {
            console.error("Error Fetching Company Data", error);
        } finally {
            setLoading(false);
        }
    };

    const mergeEmployeeAndCompanyData = (employeeData, companyData) => {
     
        const merged = employeeData.map(employee => {
            const companyInfo = companyData.find(company => company._id === employee.ename) || {};
           
            return {
                ...employee,
                statusCounts: companyInfo.statusCounts || [],
                totalLeads: companyInfo.totalLeads || 0,
                lastAssignDate: companyInfo.lastAssignDate || null,
            };
        });
        setMergedData(merged); // Update mergedData state
        setCompleteMergedData(merged); // Update mergedData state
        setMergedDataForFilter(merged); // Update mergedData state
    };

    console.log("mergedData", mergedData)
    //const debouncedFetchCompanyData = debounce(fetchCompanyData, debounceDelay);

    useEffect(() => {
        // fetchCompanyData();
        fetchEmployeeInfo();
        //fetchCompanies();
        //fetchRedesignedBookings();
        // debouncedFetchCompanyData();
        // debouncedFetchEmployeeInfo();
    }, []);

    // -----------------------branch office filter function--------------------------------------------

    // const handleFilterBranchOfficeDataReport = (branchName) => {
    //     if (branchName === "none") {
    //         setEmployeeData(employeeInfo)
    //         setCompanyData(companyDataFilter)
    //     } else {
    //         const filterEmployeeData = employeeDataFilter.filter((obj) => obj.branchOffice === branchName)
    //         setEmployeeData(filterEmployeeData)
    //         const filterCompanyData = companyDataFilter.filter((obj) => employeeInfo.some((empObj) => empObj.branchOffice === branchName && empObj.ename === obj.ename))
    //         setCompanyData(filterCompanyData)
    //     }
    // }

    const handleFilterBranchOfficeDataReport = (branchName) => {
        if (branchName === "none") {
            mergeEmployeeAndCompanyData(employeeInfo, companyDataFilter); // Reset to all data
        } else {
            const filterEmployeeData = employeeDataFilter.filter((obj) => obj.branchOffice === branchName);
            const filterCompanyData = companyDataFilter.filter((obj) => filterEmployeeData.some((empObj) => empObj.ename === obj._id));
            mergeEmployeeAndCompanyData(filterEmployeeData, filterCompanyData); // Merge filtered data
        }
    };

    useEffect(() => {
        fetchCompanyData();
    }, [employeeData]);

    //   -------------------------------multilple employee name filter function--------------------------------

    const options = employeeInfo.map((obj) => obj.ename);

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

    function getStyles(name, personName, theme) {
        return {
            fontWeight:
                personName.indexOf(name) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    }

    const theme = useTheme();

    const handleSelectEmployeeDataReport = (selectedEmployeeNames) => {
        const filteredEmployeeData = employeeInfo.filter((obj) => selectedEmployeeNames.includes(obj.ename))
        const filterCompanyData = companyDataFilter.filter((obj) => employeeDataFilter.some((empObj) => empObj.ename === obj.ename && selectedEmployeeNames.includes(empObj.ename)))

        if (filteredEmployeeData.length > 0) {
            setEmployeeData(filteredEmployeeData)
            setCompanyData(filterCompanyData)
        } else {
            setEmployeeData(employeeDataFilter)
            setCompanyData(companyDataFilter)
        }
    }
    //-----------------------------search by bdename filter function-------------------------------------------------

    const debouncedFilterSearch = debounce(filterSearch, 100);

    // Modified filterSearch function with debounce
    // function filterSearch(searchTerm) {
    //     setSearchTerm(searchTerm);
    //     setEmployeeData(
    //         employeeDataFilter.filter((company) =>
    //             company.ename.toLowerCase().includes(searchTerm.toLowerCase())
    //         )
    //     );
    //     setCompanyData(companyDataFilter.filter((company) => company.ename.toLowerCase().includes(searchTerm.toLowerCase())))
    // }
    function filterSearch(searchTerm) {
        setSearchTerm(searchTerm);
        const filteredData = mergedData.filter((company) =>
            company.ename.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setMergedData(filteredData);
    }

    //--------------------------search by date range filter function-----------------------------------------------

    // const handleSelectEmployee = (values) => {
    //     //console.log(values);
    //     if (values[1]) {
    //         const startDate = values[0].format("MM/DD/YYYY");
    //         const endDate = values[1].format("MM/DD/YYYY");

    //         const filteredDataDateRange = companyDataFilter.filter((product) => {
    //             const productDate = formatDateMonth(product.AssignDate);
    //             // Check if the formatted productDate is within the selected date range
    //             if (startDate === endDate) {
    //                 console.log(startDate, endDate, productDate)

    //                 // If both startDate and endDate are the same, filter for transactions on that day
    //                 return productDate === startDate;
    //             } else if (startDate !== endDate) {
    //                 // If different startDate and endDate, filter within the range
    //                 return (
    //                     new Date(productDate) >= new Date(startDate) &&
    //                     new Date(productDate) <= new Date(endDate)
    //                 );
    //             } else {
    //                 return false;
    //             }
    //         });
    //         console.log(filteredDataDateRange, "fileteredData")
    //         console.log(companyData, "companydata")
    //         setCompanyData(filteredDataDateRange);
    //     } else {
    //         return true;
    //     }
    // };

    const handleSelectEmployee = (values) => {
        if (values[1]) {
            const startDate = values[0].format("MM/DD/YYYY");
            const endDate = values[1].format("MM/DD/YYYY");

            // Filter merged data based on the selected date range
            const filteredDataDateRange = mergedData.filter((employee) => {
                const productDate = formatDateMonth(employee.lastAssignDate);

                // Check if the formatted productDate is within the selected date range
                if (startDate === endDate) {
                    // If both startDate and endDate are the same, filter for transactions on that day
                    return productDate === startDate;
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

            // Update the merged data with the filtered data
            setMergedData(filteredDataDateRange);
        } else {
            return true;
        }
    };

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

    //-------------------------- Sort filteres for different status  -------------------------------------------------------------------------
    // const handleSortUntouched = (sortBy1) => {
    //     setSortType((prevData) => ({
    //         ...prevData,
    //         untouched:
    //             prevData.untouched === "ascending"
    //                 ? "descending"
    //                 : prevData.untouched === "descending"
    //                     ? "none"
    //                     : "ascending",
    //     }));

    //     switch (sortBy1) {
    //         case "ascending":
    //             setIncoFilter("ascending");
    //             const untouchedCountAscending = {};
    //             companyData.forEach((company) => {
    //                 if (company.Status === "Untouched") {
    //                     untouchedCountAscending[company.ename] =
    //                         (untouchedCountAscending[company.ename] || 0) + 1;
    //                 }
    //             });

    //             // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
    //             employeeData.sort((a, b) => {
    //                 const countA = untouchedCountAscending[a.ename] || 0;
    //                 const countB = untouchedCountAscending[b.ename] || 0;
    //                 return countA - countB; // Sort in ascending order of "Untouched" count
    //             });

    //             break;
    //         case "descending":
    //             setIncoFilter("descending");
    //             const untouchedCount = {};
    //             companyData.forEach((company) => {
    //                 if (company.Status === "Untouched") {
    //                     untouchedCount[company.ename] =
    //                         (untouchedCount[company.ename] || 0) + 1;
    //                 }
    //             });

    //             // Step 2: Sort employeeData based on the count of "Untouched" statuses
    //             employeeData.sort((a, b) => {
    //                 const countA = untouchedCount[a.ename] || 0;
    //                 const countB = untouchedCount[b.ename] || 0;
    //                 return countB - countA; // Sort in descending order of "Untouched" count
    //             });
    //             break;
    //         case "none":
    //             setIncoFilter("none");
    //             if (originalEmployeeData.length > 0) {
    //                 // Restore to previous state
    //                 setEmployeeData(originalEmployeeData);
    //             }
    //             break;
    //         default:
    //             break;
    //     }
    // };
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

        let sortedData = [...mergedData];

        switch (sortBy1) {
            case "ascending":
                setIncoFilter("ascending");
                sortedData.sort((a, b) => {
                    const countA = a.statusCounts?.find((status) => status.status === "Untouched")?.count || 0;
                    const countB = b.statusCounts?.find((status) => status.status === "Untouched")?.count || 0;
                    return countA - countB; // Sort in ascending order of "Untouched" count
                });
                break;
            case "descending":
                setIncoFilter("descending");
                sortedData.sort((a, b) => {
                    const countA = a.statusCounts?.find((status) => status.status === "Untouched")?.count || 0;
                    const countB = b.statusCounts?.find((status) => status.status === "Untouched")?.count || 0;
                    return countB - countA; // Sort in descending order of "Untouched" count
                });
                break;
            case "none":
                setIncoFilter("none");
                sortedData = originalEmployeeData; // Restore to previous state
                break;
            default:
                break;
        }

        setEmployeeData(sortedData);
    };


    // const handleSortbusy = (sortBy1) => {
    //     setSortType((prevData) => ({
    //         ...prevData,
    //         busy:
    //             prevData.busy === "ascending"
    //                 ? "descending"
    //                 : prevData.busy === "descending"
    //                     ? "none"
    //                     : "ascending",
    //     }));
    //     switch (sortBy1) {
    //         case "ascending":
    //             setIncoFilter("ascending");
    //             const untouchedCountAscending = {};
    //             companyData.forEach((company) => {
    //                 if (company.Status === "Busy") {
    //                     untouchedCountAscending[company.ename] =
    //                         (untouchedCountAscending[company.ename] || 0) + 1;
    //                 }
    //             });

    //             // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
    //             employeeData.sort((a, b) => {
    //                 const countA = untouchedCountAscending[a.ename] || 0;
    //                 const countB = untouchedCountAscending[b.ename] || 0;
    //                 return countA - countB; // Sort in ascending order of "Untouched" count
    //             });

    //             break;
    //         case "descending":
    //             setIncoFilter("descending");
    //             const untouchedCount = {};
    //             companyData.forEach((company) => {
    //                 if (company.Status === "Busy") {
    //                     untouchedCount[company.ename] =
    //                         (untouchedCount[company.ename] || 0) + 1;
    //                 }
    //             });

    //             // Step 2: Sort employeeData based on the count of "Untouched" statuses
    //             employeeData.sort((a, b) => {
    //                 const countA = untouchedCount[a.ename] || 0;
    //                 const countB = untouchedCount[b.ename] || 0;
    //                 return countB - countA; // Sort in descending order of "Untouched" count
    //             });
    //             break;
    //         case "none":
    //             setIncoFilter("none");
    //             if (originalEmployeeData.length > 0) {
    //                 // Restore to previous state
    //                 setEmployeeData(originalEmployeeData);
    //             }
    //             break;
    //         default:
    //             break;
    //     }
    // };
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

        let sortedData = [...mergedData];

        switch (sortBy1) {
            case "ascending":
                setIncoFilter("ascending");
                sortedData.sort((a, b) => {
                    const countA = a.statusCounts?.find((status) => status.status === "Busy")?.count || 0;
                    const countB = b.statusCounts?.find((status) => status.status === "Busy")?.count || 0;
                    return countA - countB; // Sort in ascending order of "Busy" count
                });
                break;
            case "descending":
                setIncoFilter("descending");
                sortedData.sort((a, b) => {
                    const countA = a.statusCounts?.find((status) => status.status === "Busy")?.count || 0;
                    const countB = b.statusCounts?.find((status) => status.status === "Busy")?.count || 0;
                    return countB - countA; // Sort in descending order of "Busy" count
                });
                break;
            case "none":
                setIncoFilter("none");
                sortedData = originalEmployeeData; // Restore to previous state
                break;
            default:
                break;
        }

        setEmployeeData(sortedData);
    };


    // const handleSortNotPickedUp = (sortBy1) => {
    //     setSortType((prevData) => ({
    //         ...prevData,
    //         notPickedUp:
    //             prevData.notPickedUp === "ascending"
    //                 ? "descending"
    //                 : prevData.notPickedUp === "descending"
    //                     ? "none"
    //                     : "ascending",
    //     }));

    //     switch (sortBy1) {
    //         case "ascending":
    //             setIncoFilter("ascending");
    //             const untouchedCountAscending = {};
    //             companyData.forEach((company) => {
    //                 if (
    //                     company.Status === "Not Picked Up"
    //                 ) {
    //                     untouchedCountAscending[company.ename] =
    //                         (untouchedCountAscending[company.ename] || 0) + 1;
    //                 }
    //             });

    //             // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
    //             employeeData.sort((a, b) => {
    //                 const countA = untouchedCountAscending[a.ename] || 0;
    //                 const countB = untouchedCountAscending[b.ename] || 0;
    //                 return countA - countB; // Sort in ascending order of "Untouched" count
    //             });
    //             break;
    //         case "descending":
    //             setIncoFilter("descending");
    //             const untouchedCount = {};
    //             companyData.forEach((company) => {
    //                 if (company.Status === "Not Picked Up") {
    //                     untouchedCount[company.ename] =
    //                         (untouchedCount[company.ename] || 0) + 1;
    //                 }
    //             });

    //             // Step 2: Sort employeeData based on the count of "Untouched" statuses
    //             employeeData.sort((a, b) => {
    //                 const countA = untouchedCount[a.ename] || 0;
    //                 const countB = untouchedCount[b.ename] || 0;
    //                 return countB - countA; // Sort in descending order of "Untouched" count
    //             });
    //             break;
    //         case "none":
    //             setIncoFilter("none");
    //             if (originalEmployeeData.length > 0) {
    //                 // Restore to previous state
    //                 setEmployeeData(originalEmployeeData);
    //             }
    //             break;
    //         default:
    //             break;
    //     }
    // };
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

        let sortedData = [...mergedData];

        switch (sortBy1) {
            case "ascending":
                setIncoFilter("ascending");
                sortedData.sort((a, b) => {
                    const countA = a.statusCounts?.find((status) => status.status === "Not Picked Up")?.count || 0;
                    const countB = b.statusCounts?.find((status) => status.status === "Not Picked Up")?.count || 0;
                    return countA - countB; // Sort in ascending order of "Not Picked Up" count
                });
                break;
            case "descending":
                setIncoFilter("descending");
                sortedData.sort((a, b) => {
                    const countA = a.statusCounts?.find((status) => status.status === "Not Picked Up")?.count || 0;
                    const countB = b.statusCounts?.find((status) => status.status === "Not Picked Up")?.count || 0;
                    return countB - countA; // Sort in descending order of "Not Picked Up" count
                });
                break;
            case "none":
                setIncoFilter("none");
                sortedData = originalEmployeeData; // Restore to previous state
                break;
            default:
                break;
        }

        setEmployeeData(sortedData);
    };


    // const handleSortJunk = (sortBy1) => {
    //     setSortType((prevData) => ({
    //         ...prevData,
    //         junk:
    //             prevData.junk === "ascending"
    //                 ? "descending"
    //                 : prevData.junk === "descending"
    //                     ? "none"
    //                     : "ascending",
    //     }));
    //     switch (sortBy1) {
    //         case "ascending":
    //             setIncoFilter("ascending");
    //             const untouchedCountAscending = {};
    //             companyData.forEach((company) => {
    //                 if (company.Status === "Junk") {
    //                     untouchedCountAscending[company.ename] =
    //                         (untouchedCountAscending[company.ename] || 0) + 1;
    //                 }
    //             });

    //             // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
    //             employeeData.sort((a, b) => {
    //                 const countA = untouchedCountAscending[a.ename] || 0;
    //                 const countB = untouchedCountAscending[b.ename] || 0;
    //                 return countA - countB; // Sort in ascending order of "Untouched" count
    //             });
    //             break;
    //         case "descending":
    //             setIncoFilter("descending");
    //             const untouchedCount = {};
    //             companyData.forEach((company) => {
    //                 if (company.Status === "Junk") {
    //                     untouchedCount[company.ename] =
    //                         (untouchedCount[company.ename] || 0) + 1;
    //                 }
    //             });

    //             // Step 2: Sort employeeData based on the count of "Untouched" statuses
    //             employeeData.sort((a, b) => {
    //                 const countA = untouchedCount[a.ename] || 0;
    //                 const countB = untouchedCount[b.ename] || 0;
    //                 return countB - countA; // Sort in descending order of "Untouched" count
    //             });
    //             break;
    //         case "none":
    //             setIncoFilter("none");
    //             if (originalEmployeeData.length > 0) {
    //                 // Restore to previous state
    //                 setEmployeeData(originalEmployeeData);
    //             }
    //             break;
    //         default:
    //             break;
    //     }
    // };
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

        let sortedData = [...mergedData];

        switch (sortBy1) {
            case "ascending":
                setIncoFilter("ascending");
                sortedData.sort((a, b) => {
                    const countA = a.statusCounts?.find((status) => status.status === "Junk")?.count || 0;
                    const countB = b.statusCounts?.find((status) => status.status === "Junk")?.count || 0;
                    return countA - countB; // Sort in ascending order of "Junk" count
                });
                break;
            case "descending":
                setIncoFilter("descending");
                sortedData.sort((a, b) => {
                    const countA = a.statusCounts?.find((status) => status.status === "Junk")?.count || 0;
                    const countB = b.statusCounts?.find((status) => status.status === "Junk")?.count || 0;
                    return countB - countA; // Sort in descending order of "Junk" count
                });
                break;
            case "none":
                setIncoFilter("none");
                sortedData = employeeData; // Restore to previous state
                break;
            default:
                break;
        }

        setEmployeeData(sortedData);
    };


    // const handleSortFollowUp = (sortBy1) => {
    //     setSortType((prevData) => ({
    //         ...prevData,
    //         followUp:
    //             prevData.followUp === "ascending"
    //                 ? "descending"
    //                 : prevData.followUp === "descending"
    //                     ? "none"
    //                     : "ascending",
    //     }));
    //     switch (sortBy1) {
    //         case "ascending":
    //             setIncoFilter("ascending");
    //             const untouchedCountAscending = {};
    //             companyData.forEach((company) => {
    //                 if (
    //                     company.Status === "Follow Up"
    //                 ) {
    //                     untouchedCountAscending[company.ename] =
    //                         (untouchedCountAscending[company.ename] || 0) + 1;
    //                 }
    //             });

    //             // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
    //             employeeData.sort((a, b) => {
    //                 const countA = untouchedCountAscending[a.ename] || 0;
    //                 const countB = untouchedCountAscending[b.ename] || 0;
    //                 return countA - countB; // Sort in ascending order of "Untouched" count
    //             });
    //             break;
    //         case "descending":
    //             setIncoFilter("descending");
    //             const untouchedCount = {};
    //             companyData.forEach((company) => {
    //                 if (company.Status === "FollowUp") {
    //                     untouchedCount[company.ename] =
    //                         (untouchedCount[company.ename] || 0) + 1;
    //                 }
    //             });

    //             // Step 2: Sort employeeData based on the count of "Untouched" statuses
    //             employeeData.sort((a, b) => {
    //                 const countA = untouchedCount[a.ename] || 0;
    //                 const countB = untouchedCount[b.ename] || 0;
    //                 return countB - countA; // Sort in descending order of "Untouched" count
    //             });
    //             break;
    //         case "none":
    //             setIncoFilter("none");
    //             if (originalEmployeeData.length > 0) {
    //                 // Restore to previous state
    //                 setEmployeeData(originalEmployeeData);
    //             }
    //             break;
    //         default:
    //             break;
    //     }
    // };
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

        let sortedData = [...mergedData];

        switch (sortBy1) {
            case "ascending":
                setIncoFilter("ascending");
                sortedData.sort((a, b) => {
                    const countA = a.statusCounts?.find((status) => status.status === "FollowUp")?.count || 0;
                    const countB = b.statusCounts?.find((status) => status.status === "FollowUp")?.count || 0;
                    return countA - countB; // Sort in ascending order of "FollowUp" count
                });
                break;
            case "descending":
                setIncoFilter("descending");
                sortedData.sort((a, b) => {
                    const countA = a.statusCounts?.find((status) => status.status === "FollowUp")?.count || 0;
                    const countB = b.statusCounts?.find((status) => status.status === "FollowUp")?.count || 0;
                    return countB - countA; // Sort in descending order of "FollowUp" count
                });
                break;
            case "none":
                setIncoFilter("none");
                sortedData = originalEmployeeData; // Restore to previous state
                break;
            default:
                break;
        }

        setEmployeeData(sortedData);
    };


    // const handleSortInterested = (sortBy1) => {
    //     setSortType((prevData) => ({
    //         ...prevData,
    //         interested:
    //             prevData.interested === "ascending"
    //                 ? "descending"
    //                 : prevData.interested === "descending"
    //                     ? "none"
    //                     : "ascending",
    //     }));
    //     switch (sortBy1) {
    //         case "ascending":
    //             setIncoFilter("ascending");
    //             const untouchedCountAscending = {};
    //             companyData.forEach((company) => {
    //                 if (
    //                     company.Status === "Interested"
    //                 ) {
    //                     untouchedCountAscending[company.ename] =
    //                         (untouchedCountAscending[company.ename] || 0) + 1;
    //                 }
    //             });

    //             // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
    //             employeeData.sort((a, b) => {
    //                 const countA = untouchedCountAscending[a.ename] || 0;
    //                 const countB = untouchedCountAscending[b.ename] || 0;
    //                 return countA - countB; // Sort in ascending order of "Untouched" count
    //             });
    //             break;
    //         case "descending":
    //             setIncoFilter("descending");
    //             const untouchedCount = {};
    //             companyData.forEach((company) => {
    //                 if (company.Status === "Interested") {
    //                     untouchedCount[company.ename] =
    //                         (untouchedCount[company.ename] || 0) + 1;
    //                 }
    //             });

    //             // Step 2: Sort employeeData based on the count of "Untouched" statuses
    //             employeeData.sort((a, b) => {
    //                 const countA = untouchedCount[a.ename] || 0;
    //                 const countB = untouchedCount[b.ename] || 0;
    //                 return countB - countA; // Sort in descending order of "Untouched" count
    //             });
    //             break;
    //         case "none":
    //             setIncoFilter("none");
    //             if (originalEmployeeData.length > 0) {
    //                 // Restore to previous state
    //                 setEmployeeData(originalEmployeeData);
    //             }
    //             break;
    //         default:
    //             break;
    //     }
    // };
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

        let sortedData = [...mergedData];

        switch (sortBy1) {
            case "ascending":
                setIncoFilter("ascending");
                sortedData.sort((a, b) => {
                    const countA = a.statusCounts?.find((status) => status.status === "Interested")?.count || 0;
                    const countB = b.statusCounts?.find((status) => status.status === "Interested")?.count || 0;
                    return countA - countB; // Sort in ascending order of "Interested" count
                });
                break;
            case "descending":
                setIncoFilter("descending");
                sortedData.sort((a, b) => {
                    const countA = a.statusCounts?.find((status) => status.status === "Interested")?.count || 0;
                    const countB = b.statusCounts?.find((status) => status.status === "Interested")?.count || 0;
                    return countB - countA; // Sort in descending order of "Interested" count
                });
                break;
            case "none":
                setIncoFilter("none");
                sortedData = originalEmployeeData; // Restore to previous state
                break;
            default:
                break;
        }

        setEmployeeData(sortedData);
    };


    // const handleSortNotInterested = (sortBy1) => {
    //     setSortType((prevData) => ({
    //         ...prevData,
    //         notInterested:
    //             prevData.notInterested === "ascending"
    //                 ? "descending"
    //                 : prevData.notInterested === "descending"
    //                     ? "none"
    //                     : "ascending",
    //     }));
    //     switch (sortBy1) {
    //         case "ascending":
    //             setIncoFilter("ascending");
    //             const untouchedCountAscending = {};
    //             companyData.forEach((company) => {
    //                 if (
    //                     company.Status === "Not Interested"

    //                 ) {
    //                     untouchedCountAscending[company.ename] =
    //                         (untouchedCountAscending[company.ename] || 0) + 1;
    //                 }
    //             });

    //             // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
    //             employeeData.sort((a, b) => {
    //                 const countA = untouchedCountAscending[a.ename] || 0;
    //                 const countB = untouchedCountAscending[b.ename] || 0;
    //                 return countA - countB; // Sort in ascending order of "Untouched" count
    //             });
    //             break;
    //         case "descending":
    //             setIncoFilter("descending");
    //             const untouchedCount = {};
    //             companyData.forEach((company) => {
    //                 if (company.Status === "Not Interested") {
    //                     untouchedCount[company.ename] =
    //                         (untouchedCount[company.ename] || 0) + 1;
    //                 }
    //             });

    //             // Step 2: Sort employeeData based on the count of "Untouched" statuses
    //             employeeData.sort((a, b) => {
    //                 const countA = untouchedCount[a.ename] || 0;
    //                 const countB = untouchedCount[b.ename] || 0;
    //                 return countB - countA; // Sort in descending order of "Untouched" count
    //             });
    //             break;
    //         case "none":
    //             setIncoFilter("none");
    //             if (originalEmployeeData.length > 0) {
    //                 // Restore to previous state
    //                 setEmployeeData(originalEmployeeData);
    //             }
    //             break;
    //         default:
    //             break;
    //     }
    // };
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

        let sortedData = [...mergedData];

        switch (sortBy1) {
            case "ascending":
                setIncoFilter("ascending");
                sortedData.sort((a, b) => {
                    const countA = a.statusCounts?.find((status) => status.status === "Not Interested")?.count || 0;
                    const countB = b.statusCounts?.find((status) => status.status === "Not Interested")?.count || 0;
                    return countA - countB; // Sort in ascending order of "Not Interested" count
                });
                break;
            case "descending":
                setIncoFilter("descending");
                sortedData.sort((a, b) => {
                    const countA = a.statusCounts?.find((status) => status.status === "Not Interested")?.count || 0;
                    const countB = b.statusCounts?.find((status) => status.status === "Not Interested")?.count || 0;
                    return countB - countA; // Sort in descending order of "Not Interested" count
                });
                break;
            case "none":
                setIncoFilter("none");
                sortedData = originalEmployeeData; // Restore to previous state
                break;
            default:
                break;
        }

        setEmployeeData(sortedData);
    };


    // const handleSortMatured = (sortBy1) => {
    //     setSortType((prevData) => ({
    //         ...prevData,
    //         matured:
    //             prevData.matured === "ascending"
    //                 ? "descending"
    //                 : prevData.matured === "descending"
    //                     ? "none"
    //                     : "ascending",
    //     }));
    //     switch (sortBy1) {
    //         case "ascending":
    //             setIncoFilter("ascending");
    //             const untouchedCountAscending = {};
    //             companyData.forEach((company) => {
    //                 if (
    //                     company.Status === "Matured"
    //                 ) {
    //                     untouchedCountAscending[company.ename] =
    //                         (untouchedCountAscending[company.ename] || 0) + 1;
    //                 }
    //             });

    //             // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
    //             employeeData.sort((a, b) => {
    //                 const countA = untouchedCountAscending[a.ename] || 0;
    //                 const countB = untouchedCountAscending[b.ename] || 0;
    //                 return countA - countB; // Sort in ascending order of "Untouched" count
    //             });
    //             break;
    //         case "descending":
    //             setIncoFilter("descending");
    //             const untouchedCount = {};
    //             companyData.forEach((company) => {
    //                 if (company.Status === "Matured") {
    //                     untouchedCount[company.ename] =
    //                         (untouchedCount[company.ename] || 0) + 1;
    //                 }
    //             });

    //             // Step 2: Sort employeeData based on the count of "Untouched" statuses
    //             employeeData.sort((a, b) => {
    //                 const countA = untouchedCount[a.ename] || 0;
    //                 const countB = untouchedCount[b.ename] || 0;
    //                 return countB - countA; // Sort in descending order of "Untouched" count
    //             });
    //             break;
    //         case "none":
    //             setIncoFilter("none");
    //             if (originalEmployeeData.length > 0) {
    //                 // Restore to previous state
    //                 setEmployeeData(originalEmployeeData);
    //             }
    //             break;
    //         default:
    //             break;
    //     }
    // };
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

        let sortedData = [...mergedData];

        switch (sortBy1) {
            case "ascending":
                setIncoFilter("ascending");
                sortedData.sort((a, b) => {
                    const countA = a.statusCounts?.find((status) => status.status === "Matured")?.count || 0;
                    const countB = b.statusCounts?.find((status) => status.status === "Matured")?.count || 0;
                    return countA - countB; // Sort in ascending order of "Matured" count
                });
                break;
            case "descending":
                setIncoFilter("descending");
                sortedData.sort((a, b) => {
                    const countA = a.statusCounts?.find((status) => status.status === "Matured")?.count || 0;
                    const countB = b.statusCounts?.find((status) => status.status === "Matured")?.count || 0;
                    return countB - countA; // Sort in descending order of "Matured" count
                });
                break;
            case "none":
                setIncoFilter("none");
                sortedData = originalEmployeeData; // Restore to previous state
                break;
            default:
                break;
        }

        setEmployeeData(sortedData);
    };


    // const handleSortTotalLeads = (sortBy1) => {
    //     setSortType((prevData) => ({
    //         ...prevData,
    //         totalLeads:
    //             prevData.totalLeads === "ascending" ? "descending" : "ascending",
    //     }));
    //     switch (sortBy1) {
    //         case "ascending":
    //             setIncoFilter("ascending");
    //             const untouchedCountAscending = {};
    //             companyData.forEach((company) => {
    //                 untouchedCountAscending[company.ename] =
    //                     (untouchedCountAscending[company.ename] || 0) + 1;
    //             });

    //             // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
    //             employeeData.sort((a, b) => {
    //                 const countA = untouchedCountAscending[a.ename] || 0;
    //                 const countB = untouchedCountAscending[b.ename] || 0;
    //                 return countA - countB; // Sort in ascending order of "Untouched" count
    //             });
    //             break;
    //         case "descending":
    //             setIncoFilter("descending");
    //             const untouchedCount = {};
    //             companyData.forEach((company) => {
    //                 untouchedCount[company.ename] =
    //                     (untouchedCount[company.ename] || 0) + 1;
    //             });

    //             // Step 2: Sort employeeData based on the count of "Untouched" statuses
    //             employeeData.sort((a, b) => {
    //                 const countA = untouchedCount[a.ename] || 0;
    //                 const countB = untouchedCount[b.ename] || 0;
    //                 return countB - countA; // Sort in descending order of "Untouched" count
    //             });
    //             break;
    //         case "none":
    //             setIncoFilter("none");
    //             if (originalEmployeeData.length > 0) {
    //                 // Restore to previous state
    //                 setEmployeeData(originalEmployeeData);
    //             }
    //             break;
    //         default:
    //             break;
    //     }
    // };
    const handleSortTotalLeads = (sortBy1) => {
        setSortType((prevData) => ({
            ...prevData,
            totalLeads:
                prevData.totalLeads === "ascending"
                    ? "descending"
                    : prevData.totalLeads === "descending"
                        ? "none"
                        : "ascending",
        }));

        let sortedData = [...mergedData];

        switch (sortBy1) {
            case "ascending":
                setIncoFilter("ascending");
                sortedData.sort((a, b) => {
                    const totalA = a.statusCounts?.reduce((sum, status) => sum + (status.count || 0), 0) || 0;
                    const totalB = b.statusCounts?.reduce((sum, status) => sum + (status.count || 0), 0) || 0;
                    return totalA - totalB; // Sort in ascending order of total leads
                });
                break;
            case "descending":
                setIncoFilter("descending");
                sortedData.sort((a, b) => {
                    const totalA = a.statusCounts?.reduce((sum, status) => sum + (status.count || 0), 0) || 0;
                    const totalB = b.statusCounts?.reduce((sum, status) => sum + (status.count || 0), 0) || 0;
                    return totalB - totalA; // Sort in descending order of total leads
                });
                break;
            case "none":
                setIncoFilter("none");
                sortedData = originalEmployeeData; // Restore to previous state
                break;
            default:
                break;
        }

        setEmployeeData(sortedData);
    };


    // const handleSortLastLead = (sortBy1) => {
    //     setSortType((prevData) => ({
    //         ...prevData,
    //         lastLead:
    //             prevData.lastLead === "ascending"
    //                 ? "descending"
    //                 : prevData.lastLead === "descending"
    //                     ? "none"
    //                     : "ascending",
    //     }));
    //     switch (sortBy1) {
    //         case "ascending":
    //             setIncoFilter("ascending");
    //             const untouchedCountAscending = {};
    //             companyData.forEach((company) => {
    //                 untouchedCountAscending[company.ename] =
    //                     (untouchedCountAscending[company.ename] || 0) + 1;
    //             });

    //             // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
    //             employeeData.sort((a, b) => {
    //                 const countA = untouchedCountAscending[a.ename] || 0;
    //                 const countB = untouchedCountAscending[b.ename] || 0;
    //                 return countA - countB; // Sort in ascending order of "Untouched" count
    //             });
    //             break;
    //         case "descending":
    //             setIncoFilter("descending");
    //             const untouchedCount = {};
    //             companyData.forEach((company) => {
    //                 untouchedCount[company.ename] =
    //                     (untouchedCount[company.ename] || 0) + 1;
    //             });

    //             // Step 2: Sort employeeData based on the count of "Untouched" statuses
    //             employeeData.sort((a, b) => {
    //                 const countA = untouchedCount[a.ename] || 0;
    //                 const countB = untouchedCount[b.ename] || 0;
    //                 return countB - countA; // Sort in descending order of "Untouched" count
    //             });
    //             break;
    //         case "none":
    //             setIncoFilter("none");
    //             if (originalEmployeeData.length > 0) {
    //                 // Restore to previous state
    //                 setEmployeeData(originalEmployeeData);
    //             }
    //             break;
    //         default:
    //             break;
    //     }
    // };
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

        let sortedData = [...employeeData];
        switch (sortBy1) {
            case "ascending":
                setIncoFilter("ascending");
                sortedData.sort((a, b) => {
                    const dateA = new Date(a.lastAssignDate); // Convert assignedLeadsDate to Date object
                    const dateB = new Date(b.lastAssignDate);
                    return dateA - dateB; // Sort in ascending order by date
                });
                break;
            case "descending":
                setIncoFilter("descending");
                sortedData.sort((a, b) => {
                    const dateA = new Date(a.lastAssignDate); // Convert assignedLeadsDate to Date object
                    const dateB = new Date(b.lastAssignDate);
                    return dateB - dateA; // Sort in descending order by date
                });
                break;
            case "none":
                setIncoFilter("none");
                if (originalEmployeeData.length > 0) {
                    // Restore to previous state
                    sortedData = originalEmployeeData;
                }
                break;
            default:
                break;
        }

        setEmployeeData(sortedData);
    };

    useEffect(() => {
        setOriginalEmployeeData([...employeeData]); // Store original state of employeeData
    }, [employeeData]);

    //---------------------------------------employee table open functions------------------------------------
    const functionOpenEmployeeTable = (employee) => {
        setOpenEmployeeTable(true);
        setSelectedEmployee(employee);
    };

    const closeEmployeeTable = () => {
        setOpenEmployeeTable(false);
    };

    // const formattedDates =
    // companyData.length !== 0 &&
    //     selectedEmployee !== "" &&
    //     companyData
    //         .filter((data) => data._id === selectedEmployee) // Filter data based on ename
    //         .map((data) => formatDate(data.AssignDate));

    // const uniqueArray = formattedDates && [...new Set(formattedDates)];

    // const properCompanyData =
    //     selectedEmployee !== "" &&
    //     companyData.filter((obj) => obj._id === selectedEmployee);

    //  ---------------------------------------------   Exporting Booking function  ---------------------------------------------
    const handleExportBookings = async () => {
        const tempData = [];
        employeeData.forEach((obj, index) => {
            const tempObj = {
                SrNo: index + 1,
                employeeName: obj.ename,
                Untouched: companyData
                    .filter(
                        (data) =>
                            data.ename === obj.ename &&
                            data.Status === "Untouched"
                    )
                    .length.toLocaleString(),
                Busy: companyData
                    .filter(
                        (data) =>
                            data.ename === obj.ename &&
                            data.Status === "Busy"
                    )
                    .length.toLocaleString(),
                NotPickedUp: companyData
                    .filter(
                        (data) =>
                            data.ename === obj.ename &&
                            data.Status === "Not Picked Up"
                    )
                    .length.toLocaleString(),
                Junk: companyData
                    .filter(
                        (data) =>
                            data.ename === obj.ename &&
                            data.Status === "Junk"
                    )
                    .length.toLocaleString(),
                FollowUp: companyData
                    .filter(
                        (data) =>
                            data.ename === obj.ename &&
                            data.Status === "FollowUp"
                    )
                    .length.toLocaleString(),
                Interested: companyData
                    .filter(
                        (data) =>
                            data.ename === obj.ename &&
                            data.Status === "Interested"
                    )
                    .length.toLocaleString(),
                NotInterested: companyData
                    .filter(
                        (data) =>
                            data.ename === obj.ename &&
                            data.Status === "Not Interested"
                    )
                    .length.toLocaleString(),
                Matured: companyData
                    .filter(
                        (data) =>
                            data.ename === obj.ename &&
                            data.Status === "Matured"
                    )
                    .length.toLocaleString(),
                TotalLeads: companyData
                    .filter(
                        (data) => data.ename === obj.ename
                    )
                    .length.toLocaleString(),
                LastleadAssignDate: formatDateFinal(
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
                )
            }

            tempData.push(tempObj);
        });

        const response = await axios.post(
            `${secretKey}/bookings/export-this-bookings`,
            {
                tempData
            }
        );
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "LeadReport.csv");
        document.body.appendChild(link);
        link.click();
    }

    // ------------------------------------filter functions-------------------------
    const handleFilter = (newData) => {
        setFilteredData(newData)
        setMergedData(newData);
    };


    const handleFilterClick = (field) => {
        if (activeFilterField === field) {
            setShowFilterMenu(!showFilterMenu);

        } else {
            setActiveFilterField(field);
            setShowFilterMenu(true);
            const rect = fieldRefs.current[field].getBoundingClientRect();
            setFilterPosition({ top: rect.bottom, left: rect.left });
        }
    };
    const isActiveField = (field) => activeFilterFields.includes(field);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            const handleClickOutside = (event) => {
                if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
                    setShowFilterMenu(false);

                }
            };
            document.addEventListener('mousedown', handleClickOutside);

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, []);


    return (
        <div>
            <div className="employee-dashboard" id="employeedashboardadmin">
                <div className="card">
                    <div className="card-header p-1 employeedashboard d-flex align-items-center justify-content-between">
                        <div className="dashboard-title pl-1"  >
                            <h2 className="m-0">
                                Employees Data Report
                            </h2>
                        </div>
                        <div className="d-flex align-items-center pr-1">
                            <div className="filter-booking d-flex align-items-center">
                                <div className="filter-booking mr-1 d-flex align-items-center">
                                    <div className="export-data">
                                        <button className="btn btn-link" onClick={handleExportBookings}>
                                            Export CSV
                                        </button>
                                    </div>
                                    <div className="filter-title mr-1">
                                        <h2 className="m-0">
                                            Filter Branch :
                                        </h2>
                                    </div>
                                    <div className="filter-main">
                                        <select
                                            className="form-select"
                                            id={`branch-filter`}
                                            value={dataValue}
                                            onChange={(e) => {
                                                setDataValue(e.target.value)
                                                handleFilterBranchOfficeDataReport(e.target.value)
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
                            >
                                <DemoContainer components={["SingleInputDateRangeField"]} sx={{
                                    padding: '0px',
                                    with: '220px'
                                }}>
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
                            <FormControl sx={{ ml: 1, minWidth: 200 }}>
                                <InputLabel id="demo-select-small-label">Select Employee</InputLabel>
                                <Select
                                    className="form-control my-date-picker my-mul-select form-control-sm p-0"
                                    labelId="demo-multiple-name-label"
                                    id="demo-multiple-name"
                                    multiple
                                    value={newName}
                                    onChange={(event) => {
                                        setNewName(event.target.value)
                                        handleSelectEmployeeDataReport(event.target.value)
                                    }}
                                    input={<OutlinedInput label="Name" placeholder="Slect" />}
                                    MenuProps={MenuProps}
                                >
                                    {options.map((name) => (
                                        <MenuItem
                                            key={name}
                                            value={name}
                                            style={getStyles(name, newName, theme)}
                                        >
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="tbl-scroll" style={{ width: "100%", height: "500px" }}>
                            <table className="table-vcenter table-nowrap admin-dash-tbl  w-100" style={{ maxHeight: "400px" }}>
                                <thead className="admin-dash-tbl-thead" >
                                    <tr>
                                        <th> Sr. No </th>
                                        <th>
                                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                                <div ref={el => fieldRefs.current['ename'] = el}>
                                                    BDE/BDM Name
                                                </div>
                                                <div className='RM_filter_icon' style={{ color: "black" }}>
                                                    {isActiveField('ename') ? (
                                                        <FaFilter onClick={() => handleFilterClick("ename")} />
                                                    ) : (
                                                        <BsFilter onClick={() => handleFilterClick("ename")} />
                                                    )}
                                                </div>
                                                {/* ---------------------filter component--------------------------- */}
                                                {showFilterMenu && activeFilterField === 'ename' && (
                                                    <div
                                                        ref={filterMenuRef}
                                                        className="filter-menu"
                                                        style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                    >
                                                        <FilterableTableEmployeeDataReport
                                                            //noofItems={setnoOfAvailableData}
                                                            allFilterFields={setActiveFilterFields}
                                                            filteredData={filteredData}
                                                            //activeTab={"None"}
                                                            employeeData={mergedData}
                                                            companyData={companyData}
                                                            data={mergedData}
                                                            filterField={activeFilterField}
                                                            onFilter={handleFilter}
                                                            completeData={completeMergedData}
                                                            showingMenu={setShowFilterMenu}
                                                            dataForFilter={mergedDataForFilter}
                                                            initialDate={new Date()}
                                                            companyDataTotal={companyDataTotal}
                                                            mergedMethod={mergeEmployeeAndCompanyData}
                                                            fetchCompanyData={fetchCompanyData} 
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                        {/* <th
                                            style={{ cursor: "pointer" }}
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
                                        </th> */}
                                        <th>
                                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                                <div ref={el => fieldRefs.current['Untouched'] = el}>
                                                    Untouched
                                                </div>
                                                <div className='RM_filter_icon' style={{ color: "black" }}>
                                                    {isActiveField('Untouched') ? (
                                                        <FaFilter onClick={() => handleFilterClick("Untouched")} />
                                                    ) : (
                                                        <BsFilter onClick={() => handleFilterClick("Untouched")} />
                                                    )}
                                                </div>
                                                {/* ---------------------filter component--------------------------- */}
                                                {showFilterMenu && activeFilterField === 'Untouched' && (
                                                    <div
                                                        ref={filterMenuRef}
                                                        className="filter-menu"
                                                        style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                    >
                                                        <FilterableTableEmployeeDataReport
                                                            //noofItems={setnoOfAvailableData}
                                                            allFilterFields={setActiveFilterFields}
                                                            filteredData={filteredData}
                                                            //activeTab={"None"}
                                                            employeeData={mergedData}
                                                            companyData={companyData}
                                                            data={mergedData}
                                                            filterField={activeFilterField}
                                                            onFilter={handleFilter}
                                                            completeData={completeMergedData}
                                                            showingMenu={setShowFilterMenu}
                                                            dataForFilter={mergedDataForFilter}
                                                            initialDate={new Date()}
                                                            companyDataTotal={companyDataTotal}
                                                            mergedMethod={mergeEmployeeAndCompanyData}
                                                            fetchCompanyData={fetchCompanyData} 
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                        {/* <th
                                            style={{ cursor: "pointer" }}
                                            onClick={(e) => {
                                                let newSortType;
                                                if (sortType.busy === "ascending") {
                                                    newSortType = "descending";
                                                } else if (sortType.busy === "descending") {
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
                                                                sortType.busy === "descending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                    <ArrowDropDownIcon className="down-short-arrow"
                                                        style={{
                                                            color:
                                                                sortType.busy === "ascending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </th> */}
                                        <th>
                                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                                <div ref={el => fieldRefs.current['Busy'] = el}>
                                                    Busy
                                                </div>
                                                <div className='RM_filter_icon' style={{ color: "black" }}>
                                                    {isActiveField('Busy') ? (
                                                        <FaFilter onClick={() => handleFilterClick("Busy")} />
                                                    ) : (
                                                        <BsFilter onClick={() => handleFilterClick("Busy")} />
                                                    )}
                                                </div>
                                                {/* ---------------------filter component--------------------------- */}
                                                {showFilterMenu && activeFilterField === 'Busy' && (
                                                    <div
                                                        ref={filterMenuRef}
                                                        className="filter-menu"
                                                        style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                    >
                                                        <FilterableTableEmployeeDataReport
                                                            //noofItems={setnoOfAvailableData}
                                                            allFilterFields={setActiveFilterFields}
                                                            filteredData={filteredData}
                                                            //activeTab={"None"}
                                                            employeeData={mergedData}
                                                            companyData={companyData}
                                                            data={mergedData}
                                                            filterField={activeFilterField}
                                                            onFilter={handleFilter}
                                                            completeData={completeMergedData}
                                                            showingMenu={setShowFilterMenu}
                                                            dataForFilter={mergedDataForFilter}
                                                            initialDate={new Date()}
                                                            companyDataTotal={companyDataTotal}
                                                            mergedMethod={mergeEmployeeAndCompanyData}
                                                            fetchCompanyData={fetchCompanyData} 
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                        {/* <th
                                            style={{ cursor: "pointer" }}
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
                                        >
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div>Not Picked Up</div>
                                                <div className="short-arrow-div">
                                                    <ArrowDropUpIcon className="up-short-arrow"
                                                        style={{
                                                            color:
                                                                sortType.notPickedUp === "descending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                    <ArrowDropDownIcon className="down-short-arrow"
                                                        style={{
                                                            color:
                                                                sortType.notPickedUp === "ascending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </th> */}
                                        <th>
                                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                                <div ref={el => fieldRefs.current['Not Picked Up'] = el}>
                                                    Not Picked Up
                                                </div>
                                                <div className='RM_filter_icon' style={{ color: "black" }}>
                                                    {isActiveField('Not Picked Up') ? (
                                                        <FaFilter onClick={() => handleFilterClick("Not Picked Up")} />
                                                    ) : (
                                                        <BsFilter onClick={() => handleFilterClick("Not Picked Up")} />
                                                    )}
                                                </div>
                                                {/* ---------------------filter component--------------------------- */}
                                                {showFilterMenu && activeFilterField === 'Not Picked Up' && (
                                                    <div
                                                        ref={filterMenuRef}
                                                        className="filter-menu"
                                                        style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                    >
                                                        <FilterableTableEmployeeDataReport
                                                            //noofItems={setnoOfAvailableData}
                                                            allFilterFields={setActiveFilterFields}
                                                            filteredData={filteredData}
                                                            //activeTab={"None"}
                                                            employeeData={mergedData}
                                                            companyData={companyData}
                                                            data={mergedData}
                                                            filterField={activeFilterField}
                                                            onFilter={handleFilter}
                                                            completeData={completeMergedData}
                                                            showingMenu={setShowFilterMenu}
                                                            dataForFilter={mergedDataForFilter}
                                                            initialDate={new Date()}
                                                            companyDataTotal={companyDataTotal}
                                                            mergedMethod={mergeEmployeeAndCompanyData}
                                                            fetchCompanyData={fetchCompanyData} 
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                        {/* <th
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
                                                                sortType.junk === "descending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                    <ArrowDropDownIcon className="down-short-arrow"
                                                        style={{
                                                            color:
                                                                sortType.junk === "ascending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </th> */}
                                        <th>
                                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                                <div ref={el => fieldRefs.current['Junk'] = el}>
                                                    Junk
                                                </div>
                                                <div className='RM_filter_icon' style={{ color: "black" }}>
                                                    {isActiveField('Junk') ? (
                                                        <FaFilter onClick={() => handleFilterClick("Junk")} />
                                                    ) : (
                                                        <BsFilter onClick={() => handleFilterClick("Junk")} />
                                                    )}
                                                </div>
                                                {/* ---------------------filter component--------------------------- */}
                                                {showFilterMenu && activeFilterField === 'Junk' && (
                                                    <div
                                                        ref={filterMenuRef}
                                                        className="filter-menu"
                                                        style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                    >
                                                        <FilterableTableEmployeeDataReport
                                                            //noofItems={setnoOfAvailableData}
                                                            allFilterFields={setActiveFilterFields}
                                                            filteredData={filteredData}
                                                            //activeTab={"None"}
                                                            employeeData={mergedData}
                                                            companyData={companyData}
                                                            data={mergedData}
                                                            filterField={activeFilterField}
                                                            onFilter={handleFilter}
                                                            completeData={completeMergedData}
                                                            showingMenu={setShowFilterMenu}
                                                            dataForFilter={mergedDataForFilter}
                                                            initialDate={new Date()}
                                                            companyDataTotal={companyDataTotal}
                                                            mergedMethod={mergeEmployeeAndCompanyData}
                                                            fetchCompanyData={fetchCompanyData} 
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                        {/* <th
                                            style={{ cursor: "pointer" }}
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
                                        >
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div> Follow Up</div>
                                                <div className="short-arrow-div">
                                                    <ArrowDropUpIcon className="up-short-arrow"
                                                        style={{
                                                            color:
                                                                sortType.followUp === "descending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                    <ArrowDropDownIcon className="down-short-arrow"
                                                        style={{
                                                            color:
                                                                sortType.followUp === "ascending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </th> */}
                                        <th>
                                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                                <div ref={el => fieldRefs.current['FollowUp'] = el}>
                                                    Follow Up
                                                </div>
                                                <div className='RM_filter_icon' style={{ color: "black" }}>
                                                    {isActiveField('FollowUp') ? (
                                                        <FaFilter onClick={() => handleFilterClick("FollowUp")} />
                                                    ) : (
                                                        <BsFilter onClick={() => handleFilterClick("FollowUp")} />
                                                    )}
                                                </div>
                                                {/* ---------------------filter component--------------------------- */}
                                                {showFilterMenu && activeFilterField === 'FollowUp' && (
                                                    <div
                                                        ref={filterMenuRef}
                                                        className="filter-menu"
                                                        style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                    >
                                                        <FilterableTableEmployeeDataReport
                                                            //noofItems={setnoOfAvailableData}
                                                            allFilterFields={setActiveFilterFields}
                                                            filteredData={filteredData}
                                                            //activeTab={"None"}
                                                            employeeData={mergedData}
                                                            companyData={companyData}
                                                            data={mergedData}
                                                            filterField={activeFilterField}
                                                            onFilter={handleFilter}
                                                            completeData={completeMergedData}
                                                            showingMenu={setShowFilterMenu}
                                                            dataForFilter={mergedDataForFilter}
                                                            initialDate={new Date()}
                                                            companyDataTotal={companyDataTotal}
                                                            mergedMethod={mergeEmployeeAndCompanyData}
                                                            fetchCompanyData={fetchCompanyData} 
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                        {/* <th
                                            style={{ cursor: "pointer" }}
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
                                        >
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div>Interested</div>
                                                <div className="short-arrow-div">
                                                    <ArrowDropUpIcon className="up-short-arrow"
                                                        style={{
                                                            color:
                                                                sortType.interested === "descending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                    <ArrowDropDownIcon className="down-short-arrow"
                                                        style={{
                                                            color:
                                                                sortType.interested === "ascending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </th> */}
                                        <th>
                                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                                <div ref={el => fieldRefs.current['Interested'] = el}>
                                                    Interested
                                                </div>
                                                <div className='RM_filter_icon' style={{ color: "black" }}>
                                                    {isActiveField('Interested') ? (
                                                        <FaFilter onClick={() => handleFilterClick("Interested")} />
                                                    ) : (
                                                        <BsFilter onClick={() => handleFilterClick("Interested")} />
                                                    )}
                                                </div>
                                                {/* ---------------------filter component--------------------------- */}
                                                {showFilterMenu && activeFilterField === 'Interested' && (
                                                    <div
                                                        ref={filterMenuRef}
                                                        className="filter-menu"
                                                        style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                    >
                                                        <FilterableTableEmployeeDataReport
                                                            //noofItems={setnoOfAvailableData}
                                                            allFilterFields={setActiveFilterFields}
                                                            filteredData={filteredData}
                                                            //activeTab={"None"}
                                                            employeeData={mergedData}
                                                            companyData={companyData}
                                                            data={mergedData}
                                                            filterField={activeFilterField}
                                                            onFilter={handleFilter}
                                                            completeData={completeMergedData}
                                                            showingMenu={setShowFilterMenu}
                                                            dataForFilter={mergedDataForFilter}
                                                            initialDate={new Date()}
                                                            companyDataTotal={companyDataTotal}
                                                            mergedMethod={mergeEmployeeAndCompanyData}
                                                            fetchCompanyData={fetchCompanyData} 
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                        {/* <th
                                            style={{ cursor: "pointer" }}
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
                                        >
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div>Not Interested</div>
                                                <div className="short-arrow-div">
                                                    <ArrowDropUpIcon className="up-short-arrow"
                                                        style={{
                                                            color:
                                                                sortType.notInterested === "descending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                    <ArrowDropDownIcon className="down-short-arrow"
                                                        style={{
                                                            color:
                                                                sortType.notInterested === "ascending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </th> */}
                                        <th>
                                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                                <div ref={el => fieldRefs.current['Not Interested'] = el}>
                                                    Not Interested
                                                </div>
                                                <div className='RM_filter_icon' style={{ color: "black" }}>
                                                    {isActiveField('Not Interested') ? (
                                                        <FaFilter onClick={() => handleFilterClick("Not Interested")} />
                                                    ) : (
                                                        <BsFilter onClick={() => handleFilterClick("Not Interested")} />
                                                    )}
                                                </div>
                                                {/* ---------------------filter component--------------------------- */}
                                                {showFilterMenu && activeFilterField === 'Not Interested' && (
                                                    <div
                                                        ref={filterMenuRef}
                                                        className="filter-menu"
                                                        style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                    >
                                                        <FilterableTableEmployeeDataReport
                                                            //noofItems={setnoOfAvailableData}
                                                            allFilterFields={setActiveFilterFields}
                                                            filteredData={filteredData}
                                                            //activeTab={"None"}
                                                            employeeData={mergedData}
                                                            companyData={companyData}
                                                            data={mergedData}
                                                            filterField={activeFilterField}
                                                            onFilter={handleFilter}
                                                            completeData={completeMergedData}
                                                            showingMenu={setShowFilterMenu}
                                                            dataForFilter={mergedDataForFilter}
                                                            initialDate={new Date()}
                                                            companyDataTotal={companyDataTotal}
                                                            mergedMethod={mergeEmployeeAndCompanyData}
                                                            fetchCompanyData={fetchCompanyData} 
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                        {/* <th
                                            style={{ cursor: "pointer" }}
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
                                        >
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div>Matured</div>
                                                <div className="short-arrow-div">
                                                    <ArrowDropUpIcon className="up-short-arrow"
                                                        style={{
                                                            color:
                                                                sortType.matured === "descending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                    <ArrowDropDownIcon className="down-short-arrow"
                                                        style={{
                                                            color:
                                                                sortType.matured === "ascending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </th> */}
                                          <th>
                                            <div className='d-flex align-items-center justify-content-center position-relative'>
                                                <div ref={el => fieldRefs.current['Matured'] = el}>
                                                Matured
                                                </div>
                                                <div className='RM_filter_icon' style={{ color: "black" }}>
                                                    {isActiveField('Matured') ? (
                                                        <FaFilter onClick={() => handleFilterClick("Matured")} />
                                                    ) : (
                                                        <BsFilter onClick={() => handleFilterClick("Matured")} />
                                                    )}
                                                </div>
                                                {/* ---------------------filter component--------------------------- */}
                                                {showFilterMenu && activeFilterField === 'Matured' && (
                                                    <div
                                                        ref={filterMenuRef}
                                                        className="filter-menu"
                                                        style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                                    >
                                                        <FilterableTableEmployeeDataReport
                                                            //noofItems={setnoOfAvailableData}
                                                            allFilterFields={setActiveFilterFields}
                                                            filteredData={filteredData}
                                                            //activeTab={"None"}
                                                            employeeData={mergedData}
                                                            companyData={companyData}
                                                            data={mergedData}
                                                            filterField={activeFilterField}
                                                            onFilter={handleFilter}
                                                            completeData={completeMergedData}
                                                            showingMenu={setShowFilterMenu}
                                                            dataForFilter={mergedDataForFilter}
                                                            initialDate={new Date()}
                                                            companyDataTotal={companyDataTotal}
                                                            mergedMethod={mergeEmployeeAndCompanyData}
                                                            fetchCompanyData={fetchCompanyData} 
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            style={{ cursor: "pointer" }}
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
                                        >
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div>Total Leads</div>
                                                <div className="short-arrow-div">
                                                    <ArrowDropUpIcon className="up-short-arrow"
                                                        style={{
                                                            color:
                                                                sortType.totalLeads === "descending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                    <ArrowDropDownIcon className="down-short-arrow"
                                                        style={{
                                                            color:
                                                                sortType.totalLeads === "ascending"
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
                                                } else if (sortType.lastLead === "descending") {
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
                                                                sortType.lastLead === "descending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                    <ArrowDropDownIcon className="down-short-arrow"
                                                        style={{
                                                            color:
                                                                sortType.lastLead === "ascending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                </div>
                                            </div>
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
                                    (<tbody>
                                        {/* {employeeData.length !== 0 &&
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
                                            ))} */}

                                        {/* {companyData.map((obj, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{obj._id}</td>
                                                <td>{obj.statusCounts?.find((status) => status.status === "Untouched")?.count || 0}</td>
                                                <td>{obj.statusCounts?.find((status) => status.status === "Busy")?.count || 0}</td>
                                                <td>{obj.statusCounts?.find((status) => status.status === "Not Picked Up")?.count || 0}</td>
                                                <td>{obj.statusCounts?.find((status) => status.status === "Junk")?.count || 0}</td>
                                                <td>{obj.statusCounts?.find((status) => status.status === "FollowUp")?.count || 0}</td>
                                                <td>{obj.statusCounts?.find((status) => status.status === "Interested")?.count || 0}</td>
                                                <td>{obj.statusCounts?.find((status) => status.status === "Not Interested")?.count || 0}</td>
                                                <td>{obj.statusCounts?.find((status) => status.status === "Matured")?.count || 0}</td>
                                                <td>{obj.totalLeads?.toLocaleString()}</td>
                                                <td>{formatDateFinal(obj.lastAssignDate)}</td>
                                            </tr>
                                        ))} */}

                                        {mergedData.map((obj, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{obj.ename}</td>
                                                <td>
                                                    <Link
                                                        to={`/employeereport/${obj.ename}/Untouched`}
                                                        style={{
                                                            color: "black",
                                                            textDecoration: "none",
                                                        }}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {obj.statusCounts?.find((status) => status.status === "Untouched")?.count || 0}
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Link
                                                        to={`/employeereport/${obj.ename}/Busy`}
                                                        style={{
                                                            color: "black",
                                                            textDecoration: "none",
                                                        }}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {obj.statusCounts?.find((status) => status.status === "Busy")?.count || 0}
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Link
                                                        to={`/employeereport/${obj.ename}/Not Picked Up`}
                                                        style={{
                                                            color: "black",
                                                            textDecoration: "none",
                                                        }}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {obj.statusCounts?.find((status) => status.status === "Not Picked Up")?.count || 0}
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Link
                                                        to={`/employeereport/${obj.ename}/Junk`}
                                                        style={{
                                                            color: "black",
                                                            textDecoration: "none",
                                                        }}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {obj.statusCounts?.find((status) => status.status === "Junk")?.count || 0}
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Link
                                                        to={`/employeereport/${obj.ename}/FollowUp`}
                                                        style={{
                                                            color: "black",
                                                            textDecoration: "none",
                                                        }}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {obj.statusCounts?.find((status) => status.status === "FollowUp")?.count || 0}
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Link
                                                        to={`/employeereport/${obj.ename}/Interested`}
                                                        style={{
                                                            color: "black",
                                                            textDecoration: "none",
                                                        }}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {obj.statusCounts?.find((status) => status.status === "Interested")?.count || 0}
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Link
                                                        to={`/employeereport/${obj.ename}/Not Interested`}
                                                        style={{
                                                            color: "black",
                                                            textDecoration: "none",
                                                        }}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {obj.statusCounts?.find((status) => status.status === "Not Interested")?.count || 0}
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Link
                                                        to={`/employeereport/${obj.ename}/Matured`}
                                                        style={{
                                                            color: "black",
                                                            textDecoration: "none",
                                                        }}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {obj.statusCounts?.find((status) => status.status === "Matured")?.count || 0}
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Link
                                                        to={`/employeereport/${obj.ename}/complete`}
                                                        style={{
                                                            color: "black",
                                                            textDecoration: "none",
                                                        }}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {obj.totalLeads?.toLocaleString()}
                                                    </Link>
                                                </td>
                                                <td>
                                                    {formatDateFinal(obj.lastAssignDate)}
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
                                        ))}
                                    </tbody>
                                    )}
                                {employeeData.length !== 0 && !loading &&
                                    companyData.length !== 0 && (
                                        <tfoot className="admin-dash-tbl-tfoot"    >
                                            {/* <tr style={{ fontWeight: 500 }}>
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
                                            </tr> */}
                                            <tr style={{ fontWeight: 500 }}>
                                                <td colSpan="2">Total</td>
                                                <td>
                                                    {mergedData.reduce((total, obj) => total + (obj.statusCounts?.find((status) => status.status === "Untouched")?.count || 0), 0).toLocaleString()}
                                                </td>
                                                <td>
                                                    {mergedData.reduce((total, obj) => total + (obj.statusCounts?.find((status) => status.status === "Busy")?.count || 0), 0).toLocaleString()}
                                                </td>
                                                <td>
                                                    {mergedData.reduce((total, obj) => total + (obj.statusCounts?.find((status) => status.status === "Not Picked Up")?.count || 0), 0).toLocaleString()}
                                                </td>
                                                <td>
                                                    {mergedData.reduce((total, obj) => total + (obj.statusCounts?.find((status) => status.status === "Junk")?.count || 0), 0).toLocaleString()}
                                                </td>
                                                <td>
                                                    {mergedData.reduce((total, obj) => total + (obj.statusCounts?.find((status) => status.status === "FollowUp")?.count || 0), 0).toLocaleString()}
                                                </td>
                                                <td>
                                                    {mergedData.reduce((total, obj) => total + (obj.statusCounts?.find((status) => status.status === "Interested")?.count || 0), 0).toLocaleString()}
                                                </td>
                                                <td>
                                                    {mergedData.reduce((total, obj) => total + (obj.statusCounts?.find((status) => status.status === "Not Interested")?.count || 0), 0).toLocaleString()}
                                                </td>
                                                <td>
                                                    {mergedData.reduce((total, obj) => total + (obj.statusCounts?.find((status) => status.status === "Matured")?.count || 0), 0).toLocaleString()}
                                                </td>
                                                <td>
                                                    {mergedData.reduce((total, obj) => total + (obj.totalLeads || 0), 0).toLocaleString()}
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

            {/*Dialog for particular employee status info */}
            <Dialog
                open={openEmployeeTable}
                onClose={closeEmployeeTable}
                fullWidth
                maxWidth="lg">
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
                                    <th style={{ lineHeight: "32px" }}>Sr. No</th>
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
                                {/* {uniqueArray &&
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
                                    ))} */}
                                {mergedData
                                    .filter((obj) => obj.ename === selectedEmployee) // Filter data for selected employee
                                    .map((obj, index) => (
                                        <tr key={index}>
                                            <td style={{ lineHeight: "32px" }}>{index + 1}</td>
                                            <td>{formatDateFinal(obj.lastAssignDate)}</td>
                                            <td>
                                                {obj.statusCounts?.find((status) => status.status === "Untouched")?.count || 0}
                                            </td>
                                            <td>
                                                {obj.statusCounts?.find((status) => status.status === "Busy")?.count || 0}
                                            </td>
                                            <td>
                                                {obj.statusCounts?.find((status) => status.status === "Not Picked Up")?.count || 0}
                                            </td>
                                            <td>
                                                {obj.statusCounts?.find((status) => status.status === "Junk")?.count || 0}
                                            </td>
                                            <td>
                                                {obj.statusCounts?.find((status) => status.status === "FollowUp")?.count || 0}
                                            </td>
                                            <td>
                                                {obj.statusCounts?.find((status) => status.status === "Interested")?.count || 0}
                                            </td>
                                            <td>
                                                {obj.statusCounts?.find((status) => status.status === "Not Interested")?.count || 0}
                                            </td>
                                            <td>
                                                {obj.statusCounts?.find((status) => status.status === "Matured")?.count || 0}
                                            </td>
                                            <td>{obj.totalLeads?.toLocaleString()}</td>
                                        </tr>
                                    ))}

                            </tbody>
                            {/* {uniqueArray && (
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
                            )} */}
                            <tfoot>
                                {mergedData
                                    .filter((obj) => obj.ename === selectedEmployee) // Filter data for selected employee
                                    .map((obj, index) => (
                                        <tr style={{ fontWeight: 500 }} key={index}>
                                            <td colSpan="2" style={{ lineHeight: "32px" }}>Total</td>
                                            <td>
                                                {obj.statusCounts?.find((status) => status.status === "Untouched")?.count || 0}
                                            </td>
                                            <td>
                                                {obj.statusCounts?.find((status) => status.status === "Busy")?.count || 0}
                                            </td>
                                            <td>
                                                {obj.statusCounts?.find((status) => status.status === "Not Picked Up")?.count || 0}
                                            </td>
                                            <td>
                                                {obj.statusCounts?.find((status) => status.status === "Junk")?.count || 0}
                                            </td>
                                            <td>
                                                {obj.statusCounts?.find((status) => status.status === "FollowUp")?.count || 0}
                                            </td>
                                            <td>
                                                {obj.statusCounts?.find((status) => status.status === "Interested")?.count || 0}
                                            </td>
                                            <td>
                                                {obj.statusCounts?.find((status) => status.status === "Not Interested")?.count || 0}
                                            </td>
                                            <td>
                                                {obj.statusCounts?.find((status) => status.status === "Matured")?.count || 0}
                                            </td>
                                            <td>{obj.totalLeads?.toLocaleString()}</td>
                                        </tr>
                                    ))}
                            </tfoot>
                        </table>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default EmployeeDataReport