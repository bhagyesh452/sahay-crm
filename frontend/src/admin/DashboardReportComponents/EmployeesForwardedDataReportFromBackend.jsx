import React, { useState, useEffect } from 'react'
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
import axios from "axios";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ClipLoader from "react-spinners/ClipLoader";


function EmployeesForwardedDataReportFromBackend() {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [selectedValue, setSelectedValue] = useState("")
    const [finalEmployeeData, setFinalEmployeeData] = useState([])
    const [newSortType, setNewSortType] = useState({
        forwardedcase: "none",
        recievedcase: "none",
        maturedcase: "none",
        forwardedprojectioncase: "none",
        generatedrevenue: "none",
        recievedprojectioncase: "none",
    });
    const [employeeData, setEmployeeData] = useState([]);
    const [employeeDataFilter, setEmployeeDataFilter] = useState([]);
    const [employeeInfo, setEmployeeInfo] = useState([])
    const [forwardEmployeeData, setForwardEmployeeData] = useState([])
    const [forwardEmployeeDataFilter, setForwardEmployeeDataFilter] = useState([])
    const [forwardEmployeeDataNew, setForwardEmployeeDataNew] = useState([])
    const [employeeDataProjectionSummary, setEmployeeDataProjectionSummary] = useState([])
    const [teamLeadsData, setTeamLeadsData] = useState([])
    const [teamLeadsDataFilter, setTeamLeadsDataFilter] = useState([])
    const [companyDataTotal, setCompanyDataTotal] = useState([])
    const [companyData, setCompanyData] = useState([]);
    const [companyDataFilter, setcompanyDataFilter] = useState([]);
    const [followData, setfollowData] = useState([]);
    const [followDataToday, setfollowDataToday] = useState([]);
    const [followDataTodayNew, setfollowDataTodayNew] = useState([]);
    const [followDataFilter, setFollowDataFilter] = useState([])
    const [followDataNew, setFollowDataNew] = useState([])
    const [selectedDataRangeForwardedEmployee, setSelectedDateRangeForwardedEmployee] = useState([]);
    const [personName, setPersonName] = useState([])
    const [searchTermForwardData, setSearchTermForwardData] = useState("")
    const [bdeResegnedData, setBdeRedesignedData] = useState([])
    const [backendData, setBackendData] = useState([]);
    const [employeeStats, setEmployeeStats] = useState({});
    const [followUpLeads, setFollowUpLeads] = useState([]);
    const [employeeTotalAmount, setEmployeeTotalAmount] = useState({});

    const formatSalary = (amount) => {
        return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(amount);
    };

    const fetchDataFromBackend = async () => {
        try {
            const res = await axios.get(`${secretKey}/company-data/fetchForwaredLeads`);
            setBackendData(res.data);
            // console.log("Data from backend :", res.data);

            const stats = {};

            res.data.forEach(item => {
                const { name, forwardedCases, receivedCases, designation, branchOffice } = item;
                
                // Update forwarded cases for BDEs
                if (designation === "BDE") {
                    if (!stats[name]) {
                        stats[name] = { forwarded: 0, received: 0 };
                    }
                    stats[name].forwarded += forwardedCases;
                    stats[name].branchOffice = branchOffice;
                }

                // Update received cases for BDMs
                if (designation === "BDM") {
                    if (!stats[name]) {
                        stats[name] = { forwarded: 0, received: 0 };
                    }
                    stats[name].received += receivedCases;
                    stats[name].branchOffice = branchOffice;
                }
            });

            setEmployeeStats(stats);
        } catch (error) {
            console.log("Error fetching data from backend :", error);
        }
    };

    const fetchForwardedLeadsData = async () => {
        try {
            const res = await axios.get(`${secretKey}/company-data/fetchForwardedLeadsAmount`);
            setFollowUpLeads(res.data);
            // console.log("Follow up data from backend :", res.data);

            const totalAmountData = {};

            // Process each entry from the backend
            res.data.forEach((item) => {
                const { name, designation, totalAmount } = item;

                // Initialize the object for the employee if it doesn't exist
                if (!totalAmountData[name]) {
                    totalAmountData[name] = { forwardedProjection: 0, receivedProjection: 0 };
                }

                // Add the total amount to either forwarded or received projection
                if (designation === "BDE") {
                    totalAmountData[name].forwardedProjection += totalAmount;
                } else if (designation === "BDM") {
                    totalAmountData[name].receivedProjection += totalAmount;
                }
            });

            setEmployeeTotalAmount(totalAmountData);
        } catch (error) {
            console.log("Error fetching follow up data:", error);
        }
    };

    useEffect(() => {
        fetchDataFromBackend();
        fetchForwardedLeadsData();
    }, []);

    // --------------------------date formats--------------------------------------------
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

    //----------------------fetching employees info--------------------------------------
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
            setForwardEmployeeData(data.filter((employee) => employee.designation === "Sales Executive" || employee.designation === "Sales Manager"))
            setForwardEmployeeDataFilter(data.filter((employee) => employee.designation === "Sales Executive" || employee.designation === "Sales Manager"))
            setForwardEmployeeDataNew(data.filter((employee) => employee.designation === "Sales Executive" || employee.designation === "Sales Manager"))
            setEmployeeDataProjectionSummary(data.filter((employee) => employee.designation === "Sales Executive" || employee.designation === "Sales Manager"))
            // setEmployeeDataFilter(data.filter)

        } catch (error) {
            console.error(`Error Fetching Employee Data `, error);
        } finally {
            setLoading(false)
        }
    };

    //-------------------fetching redesigned data----------------------------------
    const [redesignedData, setRedesignedData] = useState([]);
    const fetchRedesignedBookings = async () => {
        try {
            const response = await axios.get(
                `${secretKey}/bookings/redesigned-final-leadData`
            );
            const bookingsData = response.data;


            setRedesignedData(bookingsData);
        } catch (error) {
            console.log("Error Fetching Bookings Data", error);
        }
    };
    const debounceDelay = 300;

    // Wrap the fetch functions with debounce
    //const debouncedFetchEmployeeInfo = debounce(fetchEmployeeInfo, debounceDelay);

    //--------------------------------------fetching teamleadsdata---------------

    const fetchTeamLeadsData = async () => {
        try {
            const response = await axios.get(`${secretKey}/bdm-data/teamleadsdata`)
            setTeamLeadsData(response.data)
            setTeamLeadsDataFilter(response.data)

            //console.log("teamleadsdata" , response.data)

        } catch (error) {
            console.log(error.messgae, "Error fetching team leads data")
        }
    }
    //console.log("forwardemployeedata" , forwardEmployeeData)

    useEffect(() => {
        fetchTeamLeadsData();
        fetchRedesignedBookings();
    }, [])

    //-------------------------------------fetching company data ----------------

    const fetchCompanyData = async () => {
        fetch(`${secretKey}/company-data/leads`)
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
    //const debouncedFetchCompanyData = debounce(fetchCompanyData, debounceDelay);
    useEffect(() => {
        //fetchRedesignedBookings();
        fetchEmployeeInfo()
        fetchCompanyData()
    }, []);

    //--------------------------------bde search forward data-------------------------

    const filterSearchForwardData = (searchTerm) => {
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
    const debouncedFilterSearchForwardData = debounce(filterSearchForwardData, 100);

    //-------- filter branch office function-------------------------------------


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

    //------------------------fetching follow data-------------------------------------------

    const fetchFollowUpData = async () => {
        try {
            const response = await fetch(`${secretKey}/projection/projection-data`);
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
            setfollowDataTodayNew(
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

    useEffect(() => {
        fetchFollowUpData();
    }, []);
    //-----------------------------date range filter function---------------------------------
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

    const handleForwardedEmployeeDateRange = (values) => {
        if (values[1]) {
            const startDate = values[0].format("MM/DD/YYYY");
            const endDate = values[1].format("MM/DD/YYYY");

            const filteredDataDateRange = companyDataFilter.filter((product) => {
                const productDate = formatDateMonth(product.bdeForwardDate);
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
            const filteredTeamLeadsData = teamLeadsDataFilter.filter((product) => {
                const productDate = formatDateMonth(product.bdeForwardDate);
                if (startDate === endDate) {
                    return productDate === startDate;

                } else if (startDate !== endDate) {
                    return (
                        new Date(productDate) >= new Date(startDate) &&
                        new Date(productDate) <= new Date(endDate)
                    );
                } else {
                    return false;
                }
            })

            const newFollowData = followDataFilter.filter((obj) => obj.caseType === "Forwarded" || obj.caseType === "Recieved")
            const filteredFollowData = newFollowData.filter((product) => {
                //console.log(product.date)
                const productDate = formatDateFinal(product.date);
                //console.log(startDate , endDate , productDate)
                if (startDate === endDate) {
                    return productDate === startDate;
                } else if (startDate !== endDate) {
                    return (
                        new Date(productDate) >= new Date(startDate) &&
                        new Date(productDate) <= new Date(endDate)
                    );
                } else {
                    return false;
                }

            })
            setTeamLeadsData(filteredTeamLeadsData)
            setCompanyDataTotal(filteredDataDateRange);
            setfollowData(filteredFollowData)
        } else {
            return true;
        }
    };

    //---------------------------------multiple bde name filter function---------------------------------

    const options = forwardEmployeeDataNew.map((obj) => obj.ename);

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

    const handleSelectForwardedEmployeeData = (selectedEmployeeNames) => {
        const filteredForwardEmployeeData = forwardEmployeeDataFilter.filter((company) => selectedEmployeeNames.includes(company.ename));
        const filteredCompanyData = companyDataFilter.filter(
            (obj) =>
                (obj.bdmAcceptStatus === "Pending" || obj.bdmAcceptStatus === "Accept") &&
                forwardEmployeeDataNew.some((empObj) => empObj.ename === obj.ename && selectedEmployeeNames.includes(empObj.ename))
        );
        const filteredTeamLeadsData = teamLeadsDataFilter.filter((obj) => selectedEmployeeNames.includes(obj.bdmName));
        if (filteredForwardEmployeeData.length > 0) {
            setForwardEmployeeData(filteredForwardEmployeeData);
            setTeamLeadsData(filteredTeamLeadsData);
            setCompanyDataTotal(filteredCompanyData);
        } else if (filteredForwardEmployeeData.length === 0) {
            setForwardEmployeeData(forwardEmployeeDataNew)
            setTeamLeadsData(teamLeadsDataFilter)
            setCompanyDataTotal(companyDataFilter)
        }
    };

    // ------------------------------sorting function employees forwardede data report----------------------------------

    const handleSortForwardedCases = (sortByForwarded) => {
        //console.log(sortByForwarded, "case");
        setNewSortType((prevData) => ({
            ...prevData,
            forwardedcase:
                prevData.forwardedcase === 'ascending'
                    ? 'descending'
                    : prevData.forwardedcase === 'descending'
                        ? 'none'
                        : 'ascending',
        }));

        switch (sortByForwarded) {
            case 'ascending':
                //console.log("yahan chala ascending");
                const companyDataAscending = {};
                companyDataTotal.forEach((company) => {
                    if (company.bdmAcceptStatus === 'Pending' || company.bdmAcceptStatus === 'Accept') {
                        companyDataAscending[company.ename] = (companyDataAscending[company.ename] || 0) + 1;
                    }
                });
                forwardEmployeeData.sort((a, b) => {
                    const countA = companyDataAscending[a.ename] || 0;
                    const countB = companyDataAscending[b.ename] || 0;
                    return countA - countB;
                });
                break; // Add break statement here

            case 'descending':
                //console.log("yahan chala descending");
                const companyDataDescending = {};
                companyDataTotal.forEach((company) => {
                    if (company.bdmAcceptStatus === "Pending" || company.bdmAcceptStatus === 'Accept') {
                        companyDataDescending[company.ename] = (companyDataDescending[company.ename] || 0) + 1;
                    }
                });
                forwardEmployeeData.sort((a, b) => {
                    const countA = companyDataDescending[a.ename] || 0;
                    const countB = companyDataDescending[b.ename] || 0;
                    return countB - countA;
                });
                break; // Add break statement here

            case "none":
                //console.log("yahan chala none");
                if (finalEmployeeData.length > 0) {
                    // Restore to previous state
                    setForwardEmployeeData(finalEmployeeData);
                }
                break; // Add break statement here

            default:
                break;
        }
    };
    const handleSortRecievedCase = (sortByForwarded) => {
        console.log(sortByForwarded, "case");
        setNewSortType((prevData) => ({
            ...prevData,
            recievedcase:
                prevData.recievedcase === 'ascending'
                    ? 'descending'
                    : prevData.recievedcase === 'descending'
                        ? 'none'
                        : 'ascending',
        }));

        switch (sortByForwarded) {
            case 'ascending':
                //console.log("yahan chala ascending");
                const companyDataAscending = {};
                teamLeadsData.forEach((company) => {
                    if (company.bdmName) {
                        companyDataAscending[company.bdmName] = (companyDataAscending[company.bdmName] || 0) + 1;
                    }
                });
                forwardEmployeeData.sort((a, b) => {
                    const countA = companyDataAscending[a.ename] || 0;
                    const countB = companyDataAscending[b.ename] || 0;
                    return countA - countB;
                });
                break; // Add break statement here

            case 'descending':
                //console.log("yahan chala descending");
                const companyDataDescending = {};
                teamLeadsData.forEach((company) => {
                    if (company.bdmName) {
                        companyDataDescending[company.bdmName] = (companyDataDescending[company.bdmName] || 0) + 1;
                    }
                });
                forwardEmployeeData.sort((a, b) => {
                    const countA = companyDataDescending[a.ename] || 0;
                    const countB = companyDataDescending[b.ename] || 0;
                    return countB - countA;
                });
                break; // Add break statement here

            case "none":
                //console.log("yahan chala none");
                if (finalEmployeeData.length > 0) {
                    // Restore to previous state
                    setForwardEmployeeData(finalEmployeeData);
                }
                break; // Add break statement here
            default:
                break;
        }
    };

    const handleSortForwardedProjectionCase = (sortByForwarded) => {
        // Sort the followData array based on totalPayment for each ename
        setNewSortType((prevData) => ({
            ...prevData,
            forwardedprojectioncase:
                prevData.forwardedprojectioncase === 'ascending'
                    ? 'descending'
                    : prevData.forwardedprojectioncase === 'descending'
                        ? 'none'
                        : 'ascending',
        }));
        switch (sortByForwarded) {
            case 'ascending':
                //console.log("ascending")
                const enameTotalPaymentsAscending = {};
                followData.forEach((company) => {
                    if (company.caseType === 'Recieved' || company.caseType === 'Forwarded') {
                        const ename = company.ename;
                        if (!enameTotalPaymentsAscending[ename]) {
                            enameTotalPaymentsAscending[ename] = 0;
                        }
                        enameTotalPaymentsAscending[ename] += company.totalPayment;
                    }
                });

                const sortedEnameArrayAscending = Object.keys(enameTotalPaymentsAscending).sort((a, b) => {
                    return enameTotalPaymentsAscending[a] - enameTotalPaymentsAscending[b];
                });

                // Rearrange followData based on sortedEnameArray
                const sortedFollowDataAscending = sortedEnameArrayAscending.flatMap((ename) => {
                    return followData.filter((company) => company.ename === ename);
                });

                // Set the sorted followData
                setfollowData(sortedFollowDataAscending);

                // Sort the forwardEmployeeData array based on the sorted followData
                const sortedForwardEmployeeDataAscending = forwardEmployeeData.sort((a, b) => {
                    const totalPaymentA = enameTotalPaymentsAscending[a.ename] || 0;
                    const totalPaymentB = enameTotalPaymentsAscending[b.ename] || 0;
                    return totalPaymentA - totalPaymentB;
                });

                // Set the sorted forwardEmployeeData
                setForwardEmployeeData(sortedForwardEmployeeDataAscending);

                break;
            case 'descending':
                //console.log('descendi')
                const enameTotalPaymentsDescending = {};
                followData.forEach((company) => {
                    if (company.caseType === 'Recieved' || company.caseType === 'Forwarded') {
                        const ename = company.ename;
                        if (!enameTotalPaymentsDescending[ename]) {
                            enameTotalPaymentsDescending[ename] = 0;
                        }
                        enameTotalPaymentsDescending[ename] += company.totalPayment;
                    }
                });

                const sortedEnameArrayDescending = Object.keys(enameTotalPaymentsDescending).sort((a, b) => {
                    return enameTotalPaymentsDescending[b] - enameTotalPaymentsDescending[a];
                });

                // Rearrange followData based on sortedEnameArray
                const sortedFollowDataDescending = sortedEnameArrayDescending.flatMap((ename) => {
                    return followData.filter((company) => company.ename === ename);
                });

                // Set the sorted followData
                setfollowData(sortedFollowDataDescending);

                // Sort the forwardEmployeeData array based on the sorted followData
                const sortedForwardEmployeeDataDescending = forwardEmployeeData.sort((a, b) => {
                    const totalPaymentA = enameTotalPaymentsDescending[a.ename] || 0;
                    const totalPaymentB = enameTotalPaymentsDescending[b.ename] || 0;
                    return totalPaymentB - totalPaymentA;
                });

                // Set the sorted forwardEmployeeData
                setForwardEmployeeData(sortedForwardEmployeeDataDescending);

                break;
            case 'none':
                //console.log('none')
                if (finalEmployeeData.length > 0) {
                    setForwardEmployeeData(finalEmployeeData);
                }
                break;
            default:
                break;
        }
    };

    const handleSortRecievedProjectionCase = (sortByForwarded) => {
        // Sort the followData array based on totalPayment for each ename
        setNewSortType((prevData) => ({
            ...prevData,
            recievedprojectioncase:
                prevData.recievedprojectioncase === 'ascending'
                    ? 'descending'
                    : prevData.recievedprojectioncase === 'descending'
                        ? 'none'
                        : 'ascending',
        }));

        switch (sortByForwarded) {
            case 'ascending':
                //console.log("yahan chala ascending")
                const enameTotalPaymentsAscending = {};
                followData.forEach((company) => {
                    if (company.caseType === 'Recieved') {
                        const ename = company.bdmName;
                        if (!enameTotalPaymentsAscending[ename]) {
                            enameTotalPaymentsAscending[ename] = 0;
                        }
                        enameTotalPaymentsAscending[ename] += company.totalPayment;
                    }
                });

                const sortedEnameArrayAscending = Object.keys(enameTotalPaymentsAscending).sort((a, b) => {
                    return enameTotalPaymentsAscending[a] - enameTotalPaymentsAscending[b];
                });

                // Rearrange followData based on sortedEnameArray
                const sortedFollowDataAscending = sortedEnameArrayAscending.flatMap((ename) => {
                    return followData.filter((company) => company.bdmName === ename);
                });

                // Set the sorted followData
                setFollowDataFilter(sortedFollowDataAscending);

                // Sort the forwardEmployeeData array based on the sorted followData
                const sortedForwardEmployeeDataAscending = forwardEmployeeData.sort((a, b) => {
                    const totalPaymentA = enameTotalPaymentsAscending[a.ename] || 0;
                    const totalPaymentB = enameTotalPaymentsAscending[b.ename] || 0;
                    return totalPaymentA - totalPaymentB;
                });

                // Set the sorted forwardEmployeeData
                setForwardEmployeeData(sortedForwardEmployeeDataAscending);

                break;
            case 'descending':
                console.log("yahan chala descending")
                const enameTotalPaymentsDescending = {};
                followData.forEach((company) => {
                    if (company.caseType === 'Recieved') {
                        const ename = company.bdmName;
                        if (!enameTotalPaymentsDescending[ename]) {
                            enameTotalPaymentsDescending[ename] = 0;
                        }
                        enameTotalPaymentsDescending[ename] += company.totalPayment;
                    }
                });

                const sortedEnameArrayDescending = Object.keys(enameTotalPaymentsDescending).sort((a, b) => {
                    return enameTotalPaymentsDescending[b] - enameTotalPaymentsDescending[a];
                });

                // Rearrange followData based on sortedEnameArray
                const sortedFollowDataDescending = sortedEnameArrayDescending.flatMap((ename) => {
                    return followData.filter((company) => company.bdmName === ename);
                });

                // Set the sorted followData
                setFollowDataFilter(sortedFollowDataDescending);

                // Sort the forwardEmployeeData array based on the sorted followData
                const sortedForwardEmployeeDataDescending = forwardEmployeeData.sort((a, b) => {
                    const totalPaymentA = enameTotalPaymentsDescending[a.ename] || 0;
                    const totalPaymentB = enameTotalPaymentsDescending[b.ename] || 0;
                    return totalPaymentB - totalPaymentA;
                });

                // Set the sorted forwardEmployeeData
                setForwardEmployeeData(sortedForwardEmployeeDataDescending);

                break;
            case 'none':
                console.log("yahan chala none")
                if (finalEmployeeData.length > 0) {
                    setForwardEmployeeData(finalEmployeeData);
                }
                break;
            default:
                break;
        }
    };

    const handleSortMaturedCases = (sortTypeForwarded) => {
        setNewSortType((prevData) => ({
            ...prevData,
            maturedcase:
                prevData.maturedcase === 'ascending'
                    ? 'descending'
                    : prevData.maturedcase === 'descending'
                        ? 'none'
                        : 'ascending',
        }));
        switch (sortTypeForwarded) {
            case 'ascending':
                //console.log("yahan chala ascedning")
                const companyDataAscending = {};
                companyDataTotal.forEach((company) => {
                    if (company.bdmAcceptStatus === 'Accept' && company.Status === 'Matured') {
                        companyDataAscending[company.ename] = (companyDataAscending[company.ename] || 0) + 1;
                    }
                })
                forwardEmployeeData.sort((a, b) => {
                    const A = companyDataAscending[a.ename] || 0;
                    const B = companyDataAscending[b.ename] || 0;
                    return A - B;
                });
                break;
            case 'descending':
                //console.log("yahan chala descending");
                const companyDataDescending = {};
                companyDataTotal.forEach((company) => {
                    if (company.bdmAcceptStatus === 'Accept' && company.Status === 'Matured') {
                        companyDataDescending[company.ename] = (companyDataDescending[company.ename] || 0) + 1;
                    }
                });
                forwardEmployeeData.sort((a, b) => {
                    const countA = companyDataDescending[a.ename] || 0;
                    const countB = companyDataDescending[b.ename] || 0;
                    return countB - countA;
                });
                break; // Add break statement here

            case "none":
                console.log("yahan chala none");
                if (finalEmployeeData.length > 0) {
                    // Restore to previous state
                    setForwardEmployeeData(finalEmployeeData);
                }
                break; // Add break statement here

            default:
                break;

        }
    }

    const handleSortRedesignedData = (sortByForwarded) => {
        console.log(sortByForwarded, "case");
        setNewSortType((prevData) => ({
            ...prevData,
            generatedrevenue:
                prevData.generatedrevenue === 'ascending'
                    ? 'descending'
                    : prevData.generatedrevenue === 'descending'
                        ? 'none'
                        : 'ascending',
        }));

        switch (sortByForwarded) {
            case 'ascending':
                forwardEmployeeData.sort((a, b) => {
                    const countA = functionCalculateGeneratedTotalRevenue(a.ename) || 0;
                    const countB = functionCalculateGeneratedTotalRevenue(b.ename) || 0;
                    return countA - countB;
                });
                break; // Add break statement here

            case 'descending':
                //console.log("yahan chala descending");
                forwardEmployeeData.sort((a, b) => {
                    const countA = functionCalculateGeneratedTotalRevenue(a.ename) || 0;
                    const countB = functionCalculateGeneratedTotalRevenue(b.ename) || 0;
                    return countB - countA;
                });
                break; // Add break statement here

            case "none":
                //console.log("yahan chala none");
                if (finalEmployeeData.length > 0) {
                    // Restore to previous state
                    setForwardEmployeeData(finalEmployeeData);
                }
                break; // Add break statement here

            default:
                break;
        }
    };


    useEffect(() => {
        setFinalEmployeeData([...forwardEmployeeData]); // Store original state of employeeData
    }, [forwardEmployeeData]);

    //              ------------------------------------generated revenue caluclate function--------------------------------------

    let generatedTotalRevenue = 0;
    let getGeneratedMaturedCase = 0;
    function functionCalculateGeneratedRevenue(bdeName) {
        let generatedRevenue = 0;
        const requiredObj = companyData.filter((obj) => (obj.bdmAcceptStatus === "Accept" || obj.bdmAcceptStatus === "Pending") && obj.Status === "Matured");
        requiredObj.forEach((object) => {
            redesignedData.map((mainBooking) => {
                if (object["Company Name"] === mainBooking["Company Name"] && (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName)) {
                    if (mainBooking.bdeName === mainBooking.bdmName) {
                        generatedRevenue += parseInt(mainBooking.generatedReceivedAmount)
                    } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
                        generatedRevenue += parseInt(mainBooking.generatedReceivedAmount) / 2
                    } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
                        if (mainBooking.bdeName === bdeName) {
                            generatedRevenue += parseInt(mainBooking.generatedReceivedAmount)
                        }
                    }

                    mainBooking.moreBookings.length !== 0 && mainBooking.moreBookings.map((moreObject) => {
                        if (moreObject.bdeName === bdeName || moreObject.bdmName === bdeName) {
                            if (moreObject.bdeName === moreObject.bdmName) {
                                generatedRevenue += parseInt(moreObject.generatedReceivedAmount)
                            } else if (moreObject.bdeName !== moreObject.bdmName && mainBooking.bdmType === "Close-by") {
                                generatedRevenue += parseInt(moreObject.generatedReceivedAmount) / 2
                            } else if (moreObject.bdeName !== moreObject.bdmName && mainBooking.bdmType === "Supported-by") {
                                if (moreObject.bdeName === bdeName) {
                                    generatedRevenue += parseInt(moreObject.generatedReceivedAmount)
                                }
                            }
                        }
                    })

                }
            })
        });
        generatedTotalRevenue = generatedTotalRevenue + generatedRevenue;
        return generatedRevenue;
        //  const generatedRevenue =  redesignedData.reduce((total, obj) => total + obj.receivedAmount, 0);
        //  console.log("This is generated Revenue",requiredObj);

    }
    function functionCalculateGeneratedMaturedCase(bdeName) {
        let maturedCase = 0;
        const requiredObj = companyData.filter((obj) => (obj.bdmAcceptStatus === "Accept" || obj.bdmAcceptStatus === "Pending") && obj.Status === "Matured");
        // console.log("boom",  requiredObj , redesignedData)
        requiredObj.forEach((object) => {
            redesignedData.map((mainBooking) => {
                if (object["Company Name"] === mainBooking["Company Name"] && (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName)) {
                    if (mainBooking.bdeName === mainBooking.bdmName) {
                        maturedCase += 1;
                    } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
                        maturedCase += 0.5;
                    } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
                        if (mainBooking.bdeName === bdeName) {
                            maturedCase += 1;
                        }
                    }

                    mainBooking.moreBookings.length !== 0 && mainBooking.moreBookings.map((moreObject) => {
                        if (moreObject.bdeName === bdeName || moreObject.bdmName === bdeName) {
                            if (moreObject.bdeName === moreObject.bdmName) {
                                maturedCase += 1;
                            } else if (moreObject.bdeName !== moreObject.bdmName && mainBooking.bdmType === "Close-by") {
                                maturedCase += 0.5;
                            } else if (moreObject.bdeName !== moreObject.bdmName && mainBooking.bdmType === "Supported-by") {
                                if (moreObject.bdeName === bdeName) {
                                    maturedCase += 1;
                                }
                            }
                        }
                    })

                }
            })



        });
        getGeneratedMaturedCase += maturedCase;
        return maturedCase;
        //  const generatedRevenue =  redesignedData.reduce((total, obj) => total + obj.receivedAmount, 0);
        //  console.log("This is generated Revenue",requiredObj);

    }

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

    //---------------------------function calculate total projection forwared-----------------------------------------
    let generatedTotalProjection = 0;

    const functionCaluclateTotalForwardedProjection = (isBdm, employeeName) => {

        const filteredFollowDataForward = isBdm ? followData.filter((company) => company.ename === employeeName && company.bdmName !== employeeName && company.caseType === "Forwarded") : followData.filter((company) => company.ename === employeeName && company.caseType === "Forwarded")
        const filteredFollowDataRecieved = isBdm ? followData.filter((company) => company.ename === employeeName && company.bdmName !== employeeName && company.caseType === "Recieved") : followData.filter((company) => (company.ename === employeeName || company.bdeName === employeeName) && company.caseType === "Recieved")
        const totalPaymentForwarded = filteredFollowDataForward.reduce((total, obj) => total + obj.totalPayment, 0)
        const totalPaymentRecieved = filteredFollowDataRecieved.reduce((total, obj) => total + obj.totalPayment / 2, 0)
        const finalPayment = totalPaymentForwarded + totalPaymentRecieved

        generatedTotalProjection = generatedTotalProjection + finalPayment;

        return finalPayment.toLocaleString();

    }
    //---------------------------function calculate total projection recieved-----------------------------------------
    let generatedTotalProjectionRecieved = 0;

    const functionCalculateTotalProjectionRecieved = (employeeName) => {
        const filterFollowDataRecieved = followData.filter((company) => company.bdmName === employeeName && company.caseType === "Recieved")
        const totalPaymentRecieved = filterFollowDataRecieved.reduce((total, obj) => total + obj.totalPayment / 2, 0)
        const finalPayment = totalPaymentRecieved
        //console.log(finalPayment)
        //console.log( filterFollowDataRecieved)
        generatedTotalProjectionRecieved = generatedTotalProjectionRecieved + finalPayment

        return finalPayment.toLocaleString();
    }

    //  ---------------------------------------------   Exporting Booking function  ---------------------------------------------

    const handleExportBookings = async () => {
        const tempData = [];
        forwardEmployeeData.forEach((obj, index) => {
            const tempObj = {
                SrNo: index + 1,
                employeeName: obj.ename,
                branchOffice: obj.branchOffice,
                ForwardedCases: companyDataTotal.filter((company) => company.ename === obj.ename && (company.bdmAcceptStatus === "Pending" || company.bdmAcceptStatus === "Accept")).length,
                RecievedCases: teamLeadsData.filter((company) => company.bdmName === obj.ename).length,
                ForwardedCaseProjection: obj.bdmWork ? `₹${functionCaluclateTotalForwardedProjection(true, obj.ename)}` : `₹${functionCaluclateTotalForwardedProjection(false, obj.ename)}`,
                RecievedCaseProjection: functionCalculateTotalProjectionRecieved(obj.ename),
                MaturedCase: functionCalculateGeneratedMaturedCase(obj.ename),
                GeneratedRevenue: Math.round(functionCalculateGeneratedRevenue(obj.ename)).toLocaleString()
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
        link.setAttribute("download", "ForwardedData.csv");
        document.body.appendChild(link);
        link.click();
    }


    return (
        <div>
            <div className="employee-dashboard mt-2">
                <div className="card">
                    <div className="card-header p-1 employeedashboard d-flex align-items-center justify-content-between">
                        <div className="dashboard-title pl-1"  >
                            <h2 className="m-0">
                                Employees Forwaded Data Report From Backend
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
                            <div className="data-filter">
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs} >
                                    <DemoContainer
                                        components={["SingleInputDateRangeField"]} sx={{
                                            padding: '0px',
                                            with: '220px'
                                        }}  >
                                        <DateRangePicker className="form-control my-date-picker form-control-sm p-0"
                                            onChange={(values) => {
                                                const startDateEmp = moment(values[0]).format(
                                                    "DD/MM/YYYY"
                                                );
                                                const endDateEmp = moment(values[1]).format(
                                                    "DD/MM/YYYY"
                                                );
                                                setSelectedDateRangeForwardedEmployee([
                                                    startDateEmp,
                                                    endDateEmp,
                                                ]);
                                                handleForwardedEmployeeDateRange(values); // Call handleSelect with the selected values
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
                                        value={personName}
                                        onChange={(event) => {
                                            setPersonName(event.target.value)
                                            handleSelectForwardedEmployeeData(event.target.value)
                                        }}
                                        input={<OutlinedInput label="Name" />}
                                        MenuProps={MenuProps}
                                    >
                                        {options.map((name) => (
                                            <MenuItem
                                                key={name}
                                                value={name}
                                                style={getStyles(name, personName, theme)}
                                            >
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                    </div>
                    <div className='card-body'>
                        <div className="row tbl-scroll">
                            {/* <table className="table-vcenter table-nowrap admin-dash-tbl">
                                <thead className="admin-dash-tbl-thead">
                                    <tr>
                                        <th>
                                            Sr.No
                                        </th>
                                        <th>BDE/BDM Name</th>
                                        <th >Branch Name</th>
                                        <th style={{ cursor: "pointer" }}
                                            onClick={(e) => {
                                                let updatedSortType;
                                                if (newSortType.forwardedcase === "ascending") {
                                                    updatedSortType = "descending";
                                                } else if (newSortType.forwardedcase === "descending") {
                                                    updatedSortType
                                                        = "none";
                                                } else {
                                                    updatedSortType = "ascending";
                                                }
                                                setNewSortType((prevData) => ({
                                                    ...prevData,
                                                    forwardedcase: updatedSortType,
                                                }));
                                                handleSortForwardedCases(updatedSortType);
                                            }}
                                        >
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div>Forwarded Cases</div>
                                                <div className="short-arrow-div">
                                                    <ArrowDropUpIcon className="up-short-arrow"
                                                        style={{
                                                            color:
                                                                newSortType.forwardedcase === "descending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                    <ArrowDropDownIcon className="down-short-arrow"
                                                        style={{
                                                            color:
                                                                newSortType.forwardedcase === "ascending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </th>
                                        <th style={{ cursor: "pointer" }}
                                            onClick={(e) => {
                                                let updatedSortType;
                                                if (newSortType.recievedcase === "ascending") {
                                                    updatedSortType = "descending";
                                                } else if (newSortType.recievedcase === "descending") {
                                                    updatedSortType
                                                        = "none";
                                                } else {
                                                    updatedSortType = "ascending";
                                                }
                                                setNewSortType((prevData) => ({
                                                    ...prevData,
                                                    recievedcase: updatedSortType,
                                                }));
                                                handleSortRecievedCase(updatedSortType);
                                            }}><div className="d-flex align-items-center justify-content-between">
                                                <div>Recieved Cases</div>
                                                <div className="short-arrow-div">
                                                    <ArrowDropUpIcon className="up-short-arrow"
                                                        style={{
                                                            color:
                                                                newSortType.recievedcase === "descending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                    <ArrowDropDownIcon className="down-short-arrow"
                                                        style={{
                                                            color:
                                                                newSortType.recievedcase === "ascending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </th>
                                        <th style={{ cursor: "pointer" }}
                                            onClick={(e) => {
                                                let updatedSortType;
                                                if (newSortType.forwardedprojectioncase === "ascending") {
                                                    updatedSortType = "descending";
                                                } else if (newSortType.forwardedprojectioncase === "descending") {
                                                    updatedSortType
                                                        = "none";
                                                } else {
                                                    updatedSortType = "ascending";
                                                }
                                                setNewSortType((prevData) => ({
                                                    ...prevData,
                                                    forwardedprojectioncase: updatedSortType,
                                                }));
                                                handleSortForwardedProjectionCase(updatedSortType);
                                            }}>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div>Forwarded Case Projection</div>
                                                <div className="short-arrow-div">
                                                    <ArrowDropUpIcon className="up-short-arrow"
                                                        style={{
                                                            color:
                                                                newSortType.forwardedprojectioncase === "descending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                    <ArrowDropDownIcon className="down-short-arrow"
                                                        style={{
                                                            color:
                                                                newSortType.forwardedprojectioncase === "ascending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </th>
                                        <th style={{ cursor: "pointer" }}
                                            onClick={(e) => {
                                                let updatedSortType;
                                                if (newSortType.recievedprojectioncase === "ascending") {
                                                    updatedSortType = "descending";
                                                } else if (newSortType.recievedprojectioncase === "descending") {
                                                    updatedSortType
                                                        = "none";
                                                } else {
                                                    updatedSortType = "ascending";
                                                }
                                                setNewSortType((prevData) => ({
                                                    ...prevData,
                                                    recievedprojectioncase: updatedSortType,
                                                }));
                                                handleSortRecievedProjectionCase(updatedSortType);
                                            }}><div className="d-flex align-items-center justify-content-between">
                                                <div>Recieved Case Projection</div>
                                                <div className="short-arrow-div">
                                                    <ArrowDropUpIcon className="up-short-arrow"
                                                        style={{
                                                            color:
                                                                newSortType.recievedprojectioncase === "descending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                    <ArrowDropDownIcon className="down-short-arrow"
                                                        style={{
                                                            color:
                                                                newSortType.recievedprojectioncase === "ascending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </th>
                                        <th style={{ cursor: 'pointer' }}
                                            onClick={(e) => {
                                                let updatedSortType;
                                                if (newSortType.maturedcase === 'ascending') {
                                                    updatedSortType = 'descending';
                                                } else if (newSortType.maturedcase === 'descending') {
                                                    updatedSortType = 'none'
                                                } else {
                                                    updatedSortType = 'ascending'
                                                }
                                                setNewSortType((prevData) => ({
                                                    ...prevData,
                                                    maturedcase: updatedSortType,
                                                }));
                                                handleSortMaturedCases(updatedSortType)
                                            }}><div className="d-flex align-items-center justify-content-between">
                                                <div>Matured Case</div>
                                                <div className="short-arrow-div">
                                                    <ArrowDropUpIcon className="up-short-arrow"
                                                        style={{
                                                            color:
                                                                newSortType.recievedprojectioncase === "descending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                    <ArrowDropDownIcon className="down-short-arrow"
                                                        style={{
                                                            color:
                                                                newSortType.recievedprojectioncase === "ascending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                </div>
                                            </div></th>
                                        <th style={{ cursor: "pointer" }}
                                            onClick={(e) => {
                                                let updatedSortType;
                                                if (newSortType.generatedrevenue === "ascending") {
                                                    updatedSortType = "descending";
                                                } else if (newSortType.generatedrevenue === "descending") {
                                                    updatedSortType
                                                        = "none";
                                                } else {
                                                    updatedSortType = "ascending";
                                                }
                                                setNewSortType((prevData) => ({
                                                    ...prevData,
                                                    generatedrevenue: updatedSortType,
                                                }));
                                                handleSortRedesignedData(updatedSortType);
                                            }}><div className="d-flex align-items-center justify-content-between">
                                                <div>Generated Revenue</div>
                                                <div className="short-arrow-div">
                                                    <ArrowDropUpIcon className="up-short-arrow"
                                                        style={{
                                                            color:
                                                                newSortType.generatedrevenue === "descending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                    <ArrowDropDownIcon className="down-short-arrow"
                                                        style={{
                                                            color:
                                                                newSortType.generatedrevenue === "ascending"
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
                                                        {obj.bdmWork ? `₹${functionCaluclateTotalForwardedProjection(true, obj.ename)}` : `₹${functionCaluclateTotalForwardedProjection(false, obj.ename)}`}

                                                    </td>

                                                    <td>
                                                        ₹{functionCalculateTotalProjectionRecieved(obj.ename)}
                                                    </td>

                                                    <td>
                                                        {functionCalculateGeneratedMaturedCase(obj.ename)}
                                                    </td>
                                                    <td>₹ {Math.round(functionCalculateGeneratedRevenue(obj.ename)).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                    </tbody>)}
                                <tfoot className="admin-dash-tbl-tfoot">
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
                                            ₹{generatedTotalProjection}
                                        </td>
                                        <td>
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
                            </table> */}

                            <table className="admin-dash-tbl">
                                <thead className="admin-dash-tbl-thead">
                                    <tr>
                                        <th>Sr.No</th>
                                        <th>BDE/BDM Name</th>
                                        <th>Branch Name</th>
                                        <th>Forwarded Cases</th>
                                        <th>Received Cases</th>
                                        <th>Forwarded Case Projection</th>
                                        <th>Recieved Case Projection</th>
                                        <th>Matured Cases</th>
                                        <th>Generated Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(employeeStats).map(([name, stats], index) => {
                                        const projectionData = employeeTotalAmount[name] || { forwardedProjection: 0, receivedProjection: 0 };

                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{name}</td>
                                                <td>{stats.branchOffice}</td>
                                                <td>{stats.forwarded || '0'}</td>
                                                <td>{stats.received || '0'}</td>
                                                <td>{`₹ ${formatSalary(projectionData.forwardedProjection.toFixed(2))}` || '₹ 0'}</td>
                                                <td>{`₹ ${formatSalary(projectionData.receivedProjection.toFixed(2))}` || '₹ 0'}</td>
                                                <td>-</td>
                                                <td>-</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeesForwardedDataReportFromBackend