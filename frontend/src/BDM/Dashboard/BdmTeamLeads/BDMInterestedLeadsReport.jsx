import React, { useState, useEffect } from 'react'
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { debounce } from "lodash";
//import Select from "react-select";
import Nodata from '../../Components/NoData/NoData.jsx';
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
import { FcDatabase } from "react-icons/fc";
import Calendar from "@mui/icons-material/Event";
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

function BDMInterestedLeadsReport() {
    const { userId } = useParams();

    const [data, setData] = useState([])
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const frontendKey = process.env.REACT_APP_FRONTEND_KEY;
    //const bdmName = localStorage.getItem("bdmName")
    const [forwardEmployeeData, setForwardEmployeeData] = useState([])
    const [selectedDataRangeForwardedEmployee, setSelectedDateRangeForwardedEmployee] = useState([]);
    const [forwardEmployeeDataFilter, setForwardEmployeeDataFilter] = useState([])
    const [forwardEmployeeDataNew, setForwardEmployeeDataNew] = useState([])
    const [deletedEmployeeData, setDeletedEmployeeData] = useState([])
    const [leadHistoryData, setLeadHistoryData] = useState([])
    const [filteredLeadHistoryData, setFilteredLeadHistoryData] = useState([])
    const [newSortType, setNewSortType] = useState({
        forwardedcase: "none",
        interestedcase: "none",
        followupcase: "none",

    });
    const [finalEmployeeData, setFinalEmployeeData] = useState([])
    const excludedBDENames = [
        "Vishnu Suthar",
        "Vandit Shah",
        "Khushi Gandhi",
        "Yashesh Gajjar",
        "Ravi Prajapati",
        "Yash Goswami"
      ];
    useEffect(() => {
        document.title = `Floor-Manager-Sahay-CRM`;
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${secretKey}/employee/einfo`);
            const response3 = await axios.get(`${secretKey}/employee/deletedemployeeinfo`);
            const response2 = await axios.get(`${secretKey}/company-data/leadDataHistoryInterested`);
            const leadHistory = response2.data;
            // Set the retrieved data in the state
            const tempData = response.data;
            const userData = tempData.find((item) => item._id === userId);
            // const newdata = response.data
            const deletedData = response3.data;
            //console.log("userData", userData)
            // Filter by designations
            const filteredData = tempData.filter(employee =>
                employee.designation === ("Sales Executive" || employee.designation === "Sales Manager") &&
                employee.branchOffice === userData.branchOffice &&
                !excludedBDENames.includes(employee.ename)
            );
            const filteredDeletedData = deletedData.filter(employee =>
                employee.designation === ("Sales Executive" || employee.designation === "Sales Manager") &&
                employee.branchOffice === userData.branchOffice &&
                !excludedBDENames.includes(employee.ename)
            );
            // Combine data from both responses
            const combinedForwardEmployeeData = [...filteredData, ...filteredDeletedData];
            setData(userData);
            setLeadHistoryData(leadHistory);
            setFilteredLeadHistoryData(leadHistory);
            setForwardEmployeeData(combinedForwardEmployeeData); // Use combined data
            setForwardEmployeeDataFilter(combinedForwardEmployeeData);
            setForwardEmployeeDataNew(combinedForwardEmployeeData);
            //setmoreFilteredData(userData);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };

    const [employeeData, setEmployeeData] = useState([]);
    const [employeeDataFilter, setEmployeeDataFilter] = useState([]);
    const [employeeDataNew, setEmployeeDataNew] = useState([]);
    const [companyData, setCompanyData] = useState([]);
    const [companyDataFilter, setCompanyDataFilter] = useState([]);
    const [companyDataTotal, setCompanyDataTotal] = useState([]);

    useEffect(() => {
        fetchData()
        //fetchEmployeeInfo()
    }, [])



    function formatDateNow(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

    const fetchCompanyData = async () => {
        fetch(`${secretKey}/company-data/leads/interestedleads`)
            .then((response) => response.json())
            .then((data) => {
                setCompanyData(data.filter((obj) => obj.ename !== "Not Alloted" && !excludedBDENames.includes(obj.ename)));
                setCompanyDataFilter(data.filter((obj) => obj.ename !== "Not Alloted" && !excludedBDENames.includes(obj.ename)));
                setCompanyDataTotal(data.filter((obj) => obj.ename !== "Not Alloted" && !excludedBDENames.includes(obj.ename)));
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    useEffect(() => {
        // Call the fetchData function when the component mounts
        fetchCompanyData()
    }, []);



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
                (company.ename === obj.ename) &&  // Match employee's name in lead history
                (mainObj.bdmAcceptStatus === "Forwarded" ||
                    mainObj.bdmAcceptStatus === "Pending" ||
                    mainObj.bdmAcceptStatus === "Accept") &&
                mainObj["Company Name"] === company["Company Name"]
            )
        );

        return total + filteredCompanies.length;
    }, 0);

     // ----------------daterangefilterfunction---------------------
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


    //console.log("forwardedEmp", forwardEmployeeData)
    //console.log("totalfiletred", totalFilteredCompanies)

    return (
        <div>
            {/* -------------------------------------------------Interested Leads Report------------------------------------------------------------ */}
            <div className='container-xl mt-3'>
                <div className="employee-dashboard "
                    id="projectionsummaryadmin"   >
                    <div className="card">
                        <div className="card-header p-1 employeedashboard d-flex align-items-center justify-content-between">
                            <div className="dashboard-title pl-1"  >
                                <h2 className="m-0">
                                    Employees Interested & FollowUp Leads Report
                                </h2>
                            </div>
                            <div className="d-flex align-items-center pr-1">
                                <div className="date-filter">
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
                                {/* <div className='services'>
                                    <FormControl sx={{ m: 1, width: 200 }}>
                                        <InputLabel id="demo-select-small-label">Select Employee</InputLabel>
                                        <Select
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
                                </div> */}
                            </div>
                        </div>
                        <div className="card-body">
                            <div id="table-default" className="row tbl-scroll" >
                                <table className="table-vcenter table-nowrap admin-dash-tbl"  >
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
                                                    {
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
                                                    }
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
                                            }}
                                            >
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
                                            }}
                                            >
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
                                            {/* <th>Est. Payment Date</th> */}
                                        </tr>
                                    </thead>
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

                                                // // Extract the company names
                                                // const companyNames = filteredCompanies.map(mainObj => mainObj["Company Name"]); // Adjust the field name if necessary

                                                // // // Log the company names to the console
                                                // console.log("followupcompanies" , companyNames);

                                                // const interestedCompanies = leadHistoryData
                                                //     .filter((company) => company.ename === obj.ename && company.newStatus === "Interested")
                                                //     .map((company) => company["Company Name"]); // Assuming "Company Name" is the field for company names

                                                // console.log("Interested Companies:", interestedCompanies);

                                                return (
                                                    <tr key={`row-${index}`}>
                                                        <td style={{
                                                            color: "black",
                                                            textDecoration: "none",
                                                        }} >{index + 1}</td>
                                                        <td >{obj.ename}</td>
                                                        <td>{obj.branchOffice}</td>
                                                        <td>
                                                            {/* <Link
                                                                to={`/interestedleadreport/${obj.ename}?filtered=${encodeURIComponent(
                                                                    JSON.stringify(
                                                                        leadHistoryData.filter(
                                                                            (company) =>
                                                                                company.ename === obj.ename && company.newStatus === "Interested"
                                                                        )
                                                                    )
                                                                )}`}
                                                                style={{
                                                                    color: "black",
                                                                    textDecoration: "none",
                                                                }}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            > */}
                                                                {/* {
                                                                    leadHistoryData.filter(
                                                                        (company) => company.ename === obj.ename && company.newStatus === "Interested"
                                                                    ).length
                                                                } */}
                                                            {/* </Link> */}
                                                            {remainingInterestedCompanies.length}
                                                        </td>

                                                        <td >
                                                            {/* <Link
                                                                to={`/followupleadreport/${obj.ename}?filtered=${encodeURIComponent(
                                                                    JSON.stringify(
                                                                        leadHistoryData.filter(
                                                                            (company) =>
                                                                                company.ename === obj.ename && company.newStatus === "FollowUp"
                                                                        )
                                                                    )
                                                                )}`}
                                                                style={{
                                                                    color: "black",
                                                                    textDecoration: "none",
                                                                }}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            > */}
                                                                {/* {leadHistoryData.filter((company) => company.ename === obj.ename && company.newStatus === "FollowUp").length} */}
                                                            {/* </Link> */}
                                                            {remainingFollowCompanies.length}
                                                        </td>
                                                        <td>
                                                            {filteredCompanies.length}
                                                        </td>

                                                    </tr>
                                                )
                                            })}
                                    </tbody>
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
                                    {((leadHistoryData && leadHistoryData.length === 0) && employeeData.length === 0) && (
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
            </div>
        </div>
    )
}

export default BDMInterestedLeadsReport