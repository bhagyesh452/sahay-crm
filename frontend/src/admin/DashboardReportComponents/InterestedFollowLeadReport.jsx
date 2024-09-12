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
import { Link } from 'react-router-dom';

function InterestedFollowLeadReport() {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [selectedValue, setSelectedValue] = useState("")
    const [finalEmployeeData, setFinalEmployeeData] = useState([])
    const [newSortType, setNewSortType] = useState({
        forwardedcase: "none",
        interestedcase: "none",
        followupcase: "none",

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
    const [leadHistoryData, setLeadHistoryData] = useState([])
    const [filteredLeadHistoryData, setFilteredLeadHistoryData] = useState([])



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
    const [deletedEmployeeData, setDeletedEmployeeData] = useState([])


    const fetchEmployeeInfo = async () => {
        try {
            setLoading(true);

            // Fetch data using fetch and axios
            const response = await fetch(`${secretKey}/employee/einfo`);
            const response3 = await axios.get(`${secretKey}/employee/deletedemployeeinfo`);
            const response2 = await axios.get(`${secretKey}/company-data/leadDataHistoryInterested`);
            const leadHistory = response2.data;

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const deletedData = response3.data;

            // Filter by designations
            const filteredData = data.filter(employee =>
                employee.designation === "Sales Executive" || employee.designation === "Sales Manager"
            );
            const filteredDeletedData = deletedData.filter(employee =>
                employee.designation === "Sales Executive" || employee.designation === "Sales Manager"
            );

            // Combine data from both responses
            const combinedForwardEmployeeData = [...filteredData, ...filteredDeletedData];

            // Set state values
            setDeletedEmployeeData(filteredDeletedData);
            setLeadHistoryData(leadHistory);
            setFilteredLeadHistoryData(leadHistory);
            setEmployeeData(filteredData);
            setEmployeeDataFilter(filteredData);
            setEmployeeInfo(filteredData);
            setForwardEmployeeData(combinedForwardEmployeeData); // Use combined data
            setForwardEmployeeDataFilter(combinedForwardEmployeeData);
            setForwardEmployeeDataNew(combinedForwardEmployeeData);
            setEmployeeDataProjectionSummary(filteredData);

        } catch (error) {
            console.error(`Error Fetching Employee Data `, error);
        } finally {
            setLoading(false);
        }
    };


    // console.log("deletedData", deletedEmployeeData)

    //-------------------------------------fetching company data ----------------

    const fetchCompanyData = async () => {
        fetch(`${secretKey}/company-data/leads/interestedleads`)
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

    // const fetchFollowUpData = async () => {
    //     try {
    //         const response = await fetch(`${secretKey}/projection/projection-data`);
    //         const followdata = await response.json();
    //         setfollowData(followdata);
    //         setFollowDataFilter(followdata)
    //         setFollowDataNew(followdata)
    //         //console.log("followdata", followdata)
    //         setfollowDataToday(
    //             followdata
    //                 .filter((company) => {
    //                     // Assuming you want to filter companies with an estimated payment date for today
    //                     const today = new Date().toISOString().split("T")[0]; // Get today's date in the format 'YYYY-MM-DD'
    //                     return company.estPaymentDate === today;
    //                 })
    //         );
    //         setfollowDataTodayNew(
    //             followdata
    //                 .filter((company) => {
    //                     // Assuming you want to filter companies with an estimated payment date for today
    //                     const today = new Date().toISOString().split("T")[0]; // Get today's date in the format 'YYYY-MM-DD'
    //                     return company.estPaymentDate === today;
    //                 })
    //         );
    //     } catch (error) {
    //         console.error("Error fetching data:", error);
    //         return { error: "Error fetching data" };
    //     }
    // };
    //const debouncedFetchCompanyData = debounce(fetchCompanyData, debounceDelay);

    useEffect(() => {
        //fetchRedesignedBookings();
        fetchEmployeeInfo()
        fetchCompanyData()
        //fetchFollowUpData();
    }, []);


    //------------------------fetching follow data-------------------------------------------


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

    // ------------------------------sorting function employees forwardede data report----------------------------------

    // const handleSortInterestedCases = (sortByForwarded) => {
    //     //console.log(sortByForwarded, "case");
    //     setNewSortType((prevData) => ({
    //         ...prevData,
    //         interestedcase:
    //             prevData.interestedcase === 'ascending'
    //                 ? 'descending'
    //                 : prevData.interestedcase === 'descending'
    //                     ? 'none'
    //                     : 'ascending',
    //     }));

    //     switch (sortByForwarded) {
    //         case 'ascending':
    //             //console.log("yahan chala ascending");
    //             const companyDataAscending = {};
    //             leadHistoryData.forEach((company) => {
    //                 if (company.bdmAcceptStatus === 'Pending' || company.bdmAcceptStatus === 'Accept') {
    //                     companyDataAscending[company.ename] = (companyDataAscending[company.ename] || 0) + 1;
    //                 }
    //             });
    //             forwardEmployeeData.sort((a, b) => {
    //                 const countA = companyDataAscending[a.ename] || 0;
    //                 const countB = companyDataAscending[b.ename] || 0;
    //                 return countA - countB;
    //             });
    //             break; // Add break statement here

    //         case 'descending':
    //             //console.log("yahan chala descending");
    //             const companyDataDescending = {};
    //             companyDataTotal.forEach((company) => {
    //                 if (company.bdmAcceptStatus === "Pending" || company.bdmAcceptStatus === 'Accept') {
    //                     companyDataDescending[company.ename] = (companyDataDescending[company.ename] || 0) + 1;
    //                 }
    //             });
    //             forwardEmployeeData.sort((a, b) => {
    //                 const countA = companyDataDescending[a.ename] || 0;
    //                 const countB = companyDataDescending[b.ename] || 0;
    //                 return countB - countA;
    //             });
    //             break; // Add break statement here

    //         case "none":
    //             //console.log("yahan chala none");
    //             if (finalEmployeeData.length > 0) {
    //                 // Restore to previous state
    //                 setForwardEmployeeData(finalEmployeeData);
    //             }
    //             break; // Add break statement here

    //         default:
    //             break;
    //     }
    // };
    const sortForwardEmployeeData = (sortType) => {
        const sortedData = [...forwardEmployeeData].sort((a, b) => {
            const aInterestedCount = leadHistoryData.filter(company => company.ename === a.ename && company.newStatus === "Interested").length;
            const bInterestedCount = leadHistoryData.filter(company => company.ename === b.ename && company.newStatus === "Interested").length;

            if (sortType === "ascending") {
                return aInterestedCount - bInterestedCount;
            } else if (sortType === "descending") {
                return bInterestedCount - aInterestedCount;
            } else {
                return 0; // No sorting
            }
        });

        return sortedData;
    };
    const handleSortInterestedCases = (sortType) => {
        if (sortType === "none") {
            setForwardEmployeeData(forwardEmployeeDataNew); // Restore original data
        } else {
            const sortedData = sortForwardEmployeeData(sortType);
            setForwardEmployeeData(sortedData); // Update the state with sorted data
        }
    };
    const sortForwardEmployeeDataByFollowUp = (sortType) => {
        const sortedData = [...forwardEmployeeData].sort((a, b) => {
            const aFollowUpCount = leadHistoryData.filter(company => company.ename === a.ename && company.newStatus === "FollowUp").length;
            const bFollowUpCount = leadHistoryData.filter(company => company.ename === b.ename && company.newStatus === "FollowUp").length;

            if (sortType === "ascending") {
                return aFollowUpCount - bFollowUpCount;
            } else if (sortType === "descending") {
                return bFollowUpCount - aFollowUpCount;
            } else {
                return 0; // No sorting
            }
        });

        return sortedData;
    };
    const handleSortFollowUpCase = (sortType) => {
        if (sortType === "none") {
            setForwardEmployeeData(forwardEmployeeDataNew); // Restore original data
        } else {
            const sortedData = sortForwardEmployeeDataByFollowUp(sortType);
            setForwardEmployeeData(sortedData); // Update the state with sorted data
        }
    };

    const sortForwardEmployeeDataByForwarded = (sortType) => {
        const sortedData = [...forwardEmployeeData].sort((a, b) => {
            const aForwardedCount = companyDataTotal.filter(mainObj =>
                leadHistoryData.some(company =>
                    company.ename === a.ename &&
                    (mainObj.bdmAcceptStatus === "Forwarded" ||
                        mainObj.bdmAcceptStatus === "Pending" ||
                        mainObj.bdmAcceptStatus === "Accept") &&
                    mainObj.ename === company.ename
                )
            ).length;

            const bForwardedCount = companyDataTotal.filter(mainObj =>
                leadHistoryData.some(company =>
                    company.ename === b.ename &&
                    (mainObj.bdmAcceptStatus === "Forwarded" ||
                        mainObj.bdmAcceptStatus === "Pending" ||
                        mainObj.bdmAcceptStatus === "Accept") &&
                    mainObj.ename === company.ename
                )
            ).length;

            if (sortType === "ascending") {
                return aForwardedCount - bForwardedCount;
            } else if (sortType === "descending") {
                return bForwardedCount - aForwardedCount;
            } else {
                return 0; // No sorting
            }
        });

        return sortedData;
    };
    const handleSortForwardeCases = (sortType) => {
        if (sortType === "none") {
            setForwardEmployeeData(forwardEmployeeDataNew); // Restore original data
        } else {
            const sortedData = sortForwardEmployeeDataByForwarded(sortType);
            setForwardEmployeeData(sortedData); // Update the state with sorted data
        }
    };


    useEffect(() => {
        setFinalEmployeeData([...forwardEmployeeData]); // Store original state of employeeData
    }, [forwardEmployeeData]);

    const totalFilteredCompanies = forwardEmployeeData.reduce((total, obj) => {
        const filteredCompanies = companyDataTotal.filter(mainObj =>
            leadHistoryData.some(company =>
                (company.ename === obj.ename) &&
                (mainObj.bdmAcceptStatus === "Forwarded" ||
                    mainObj.bdmAcceptStatus === "Pending" ||
                    mainObj.bdmAcceptStatus === "Accept") &&
                mainObj["Company Name"] === company["Company Name"]
            )
        );

        return total + filteredCompanies.length;
    }, 0)

    // ----------------daterangefilterfunction---------------------
    // Function to filter data by date range
    const filterLeadHistoryByDateRange = (data, startDate, endDate) => {
        const start = moment(startDate, "DD/MM/YYYY").startOf('day');
        const end = moment(endDate, "DD/MM/YYYY").endOf('day');

        return data.filter(item => {
            const itemDate = moment(item.date); // Assuming 'date' is in ISO format
            return itemDate.isBetween(start, end, null, '[]'); // '[]' includes start and end dates
        });
    };

    // Function to filter other datasets based on filtered leadHistoryData
    const filterOtherDataByLeadHistory = (dataToFilter, filteredLeadHistoryData) => {
        const filteredNames = new Set(filteredLeadHistoryData.map(item => item.ename));

        return dataToFilter.filter(item =>
            filteredNames.has(item.ename)
        );
    };

    const handleForwardedEmployeeDateRange = (values) => {
        const startDate = moment(values[0]).format("DD/MM/YYYY");
        const endDate = moment(values[1]).format("DD/MM/YYYY");

        // Filter leadHistoryData
        const filteredLeadHistory = filterLeadHistoryByDateRange(filteredLeadHistoryData, startDate, endDate);

        // Filter forwardEmployeeData and companyDataTotal based on filteredLeadHistoryData
        const filteredForwardEmployeeData = filterOtherDataByLeadHistory(forwardEmployeeData, filteredLeadHistoryData);
        const filteredCompanyDataTotal = filterOtherDataByLeadHistory(companyDataTotal, filteredLeadHistoryData);

        setLeadHistoryData(filteredLeadHistory);
        setForwardEmployeeData(filteredForwardEmployeeData);
        setCompanyDataTotal(filteredCompanyDataTotal);
    };
    // console.log("company" , companyDataTotal)

    return (
        <div>
            <div className="employee-dashboard">
                <div className="card">
                    <div className="card-header p-1 employeedashboard d-flex align-items-center justify-content-between">
                        <div className="dashboard-title pl-1"  >
                            <h2 className="m-0">
                                Employees Interested-FollowUp Leads Data Report
                            </h2>
                        </div>
                        <div className="d-flex align-items-center pr-1">
                            <div className="data-filter">
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs} >
                                    <DemoContainer
                                        components={["SingleInputDateRangeField"]} 
                                        sx={{
                                            padding: '0px',
                                            with: '220px'
                                        }}  >
                                        <DateRangePicker 
                                        className="form-control my-date-picker form-control-sm p-0"
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
                                        <th style={{ cursor: "pointer" }}
                                            onClick={(e) => {
                                                let updatedSortType;
                                                if (newSortType.interestedcase === "ascending") {
                                                    updatedSortType = "descending";
                                                } else if (newSortType.interestedcase === "descending") {
                                                    updatedSortType
                                                        = "none";
                                                } else {
                                                    updatedSortType = "ascending";
                                                }
                                                setNewSortType((prevData) => ({
                                                    ...prevData,
                                                    interestedcase: updatedSortType,
                                                }));
                                                handleSortInterestedCases(updatedSortType);
                                            }}
                                        >
                                            <div className="d-flex align-items-center justify-content-center">
                                                <div className='mr-1'>Interested Leads</div>
                                                <div className="short-arrow-div">
                                                    <ArrowDropUpIcon className="up-short-arrow"
                                                        style={{
                                                            color:
                                                                newSortType.interestedcase === "descending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                    <ArrowDropDownIcon className="down-short-arrow"
                                                        style={{
                                                            color:
                                                                newSortType.interestedcase === "ascending"
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
                                                if (newSortType.followupcase === "ascending") {
                                                    updatedSortType = "descending";
                                                } else if (newSortType.followupcase === "descending") {
                                                    updatedSortType
                                                        = "none";
                                                } else {
                                                    updatedSortType = "ascending";
                                                }
                                                setNewSortType((prevData) => ({
                                                    ...prevData,
                                                    followupcase: updatedSortType,
                                                }));
                                                handleSortFollowUpCase(updatedSortType);
                                            }}>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <div className='mr-1'>FolLowUp Leads</div>
                                                <div className="short-arrow-div">
                                                    <ArrowDropUpIcon className="up-short-arrow"
                                                        style={{
                                                            color:
                                                                newSortType.followupcase === "descending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                    <ArrowDropDownIcon className="down-short-arrow"
                                                        style={{
                                                            color:
                                                                newSortType.followupcase === "ascending"
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
                                                handleSortForwardeCases(updatedSortType);
                                            }}>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <div className='mr-1'>Forwarded Cases</div>
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
                                            {forwardEmployeeData.length !== 0 &&
                                                forwardEmployeeData.map((obj, index) => {
                                                    const filteredCompanies = companyDataTotal.filter(mainObj =>
                                                        leadHistoryData.some(company =>
                                                            company.ename === obj.ename &&
                                                            (mainObj.bdmAcceptStatus === "Forwarded" ||
                                                                mainObj.bdmAcceptStatus === "Pending" ||
                                                                mainObj.bdmAcceptStatus === "Accept") &&
                                                            mainObj["Company Name"] === company["Company Name"]
                                                        )
                                                    );
                                                    // Step 1: Calculate total interested companies for the employee
                                                    const totalInterestedCompanies = leadHistoryData.filter(
                                                        (company) => company.ename === obj.ename && company.newStatus === "Interested"
                                                    ).map(company => company["Company Name"]);

                                                    const totalFollowCompanies = leadHistoryData.filter(
                                                        (company) => company.ename === obj.ename && company.newStatus === "FollowUp"
                                                    ).map(company => company["Company Name"]);

                                                    // Step 2: Calculate forwarded companies for the employee
                                                    const forwardedCompaniesFollow = companyDataTotal
                                                        .filter(mainObj =>
                                                            leadHistoryData.some(company =>
                                                                company.ename === obj.ename &&
                                                                (mainObj.bdmAcceptStatus === "Forwarded" ||
                                                                    mainObj.bdmAcceptStatus === "Pending" ||
                                                                    mainObj.bdmAcceptStatus === "Accept") &&
                                                                mainObj["Company Name"] === company["Company Name"]
                                                                && mainObj.Status === "FollowUp"
                                                            )
                                                        ).map(company => company["Company Name"]);

                                                    // Step 2: Calculate forwarded companies for the employee
                                                    const forwardedCompanies = companyDataTotal
                                                        .filter(mainObj =>
                                                            leadHistoryData.some(company =>
                                                                company.ename === obj.ename &&
                                                                (mainObj.bdmAcceptStatus === "Forwarded" ||
                                                                    mainObj.bdmAcceptStatus === "Pending" ||
                                                                    mainObj.bdmAcceptStatus === "Accept") &&
                                                                mainObj["Company Name"] === company["Company Name"]
                                                                && mainObj.Status === "Interested"
                                                            )
                                                        ).map(company => company["Company Name"]);

                                                    // Step 3: Calculate remaining interested companies (interested - forwarded)
                                                    const remainingInterestedCompanies = totalInterestedCompanies.filter(
                                                        (companyName) => !forwardedCompanies.includes(companyName)
                                                    );
                                                    const remainingFollowCompanies = totalFollowCompanies.filter(
                                                        (companyName) => !forwardedCompaniesFollow.includes(companyName)
                                                    );



                                                    // You can now use the `remainingInterestedCompanies` array
                                                    // console.log(`Remaining Interested Companies for ${obj.ename}:`, remainingInterestedCompanies);
                                                    // console.log(`Remaining Follow Companies for ${obj.ename}:`, remainingFollowCompanies);
                                                    return (
                                                        <tr key={`row-${index}`}>
                                                            <td style={{
                                                                color: "black",
                                                                textDecoration: "none",
                                                            }} >{index + 1}</td>
                                                            <td >{obj.ename}</td>
                                                            <td>{obj.branchOffice}</td>
                                                            <td>
                                                                {/* {leadHistoryData.filter((company) => company.ename === obj.ename && company.newStatus === "Interested").length} */}

                                                                {remainingInterestedCompanies.length}
                                                            </td>

                                                            <td >
                                                                {remainingFollowCompanies.length}
                                                                {/* {leadHistoryData.filter((company) => company.ename === obj.ename && company.newStatus === "FollowUp").length} */}

                                                            </td>
                                                            <td>
                                                                {filteredCompanies.length}
                                                            </td>

                                                        </tr>
                                                    )
                                                })}
                                        </tbody>
                                    )}
                                <tfoot className="admin-dash-tbl-tfoot">
                                    <tr>
                                        <td
                                            colSpan="3"
                                        >
                                            Total
                                        </td>
                                        <td>
                                            {forwardEmployeeData.reduce((total, obj) => {
                                                const totalInterestedCompanies = leadHistoryData
                                                    .filter(company => company.ename === obj.ename && company.newStatus === "Interested")
                                                    .map(company => company["Company Name"]);

                                                const forwardedCompanies = companyDataTotal
                                                    .filter(mainObj =>
                                                        leadHistoryData.some(company =>
                                                            company.ename === obj.ename &&
                                                            (mainObj.bdmAcceptStatus === "Forwarded" ||
                                                                mainObj.bdmAcceptStatus === "Pending" ||
                                                                mainObj.bdmAcceptStatus === "Accept") &&
                                                            mainObj["Company Name"] === company["Company Name"] &&
                                                            mainObj.Status === "Interested"
                                                        )
                                                    )
                                                    .map(company => company["Company Name"]);

                                                // Add the remaining interested companies to the total
                                                return total + totalInterestedCompanies.filter(
                                                    companyName => !forwardedCompanies.includes(companyName)
                                                ).length;
                                            }, 0)}
                                        </td>
                                        {/* Total remaining follow-up companies across all employees */}
                                        <td>
                                            {forwardEmployeeData.reduce((total, obj) => {
                                                const totalFollowCompanies = leadHistoryData
                                                    .filter(company => company.ename === obj.ename && company.newStatus === "FollowUp")
                                                    .map(company => company["Company Name"]);

                                                const forwardedCompaniesFollow = companyDataTotal
                                                    .filter(mainObj =>
                                                        leadHistoryData.some(company =>
                                                            company.ename === obj.ename &&
                                                            (mainObj.bdmAcceptStatus === "Forwarded" ||
                                                                mainObj.bdmAcceptStatus === "Pending" ||
                                                                mainObj.bdmAcceptStatus === "Accept") &&
                                                            mainObj["Company Name"] === company["Company Name"] &&
                                                            mainObj.Status === "FollowUp"
                                                        )
                                                    )
                                                    .map(company => company["Company Name"]);

                                                // Add the remaining follow-up companies to the total
                                                return total + totalFollowCompanies.filter(
                                                    companyName => !forwardedCompaniesFollow.includes(companyName)
                                                ).length;
                                            }, 0)}
                                        </td>
                                        <td>
                                            {totalFilteredCompanies}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InterestedFollowLeadReport