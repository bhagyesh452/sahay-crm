import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import Calendar from "@mui/icons-material/Event";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClipLoader from "react-spinners/ClipLoader";
import Nodata from '../Components/NoData/NoData.jsx';

function FloorManagerLeadsReport({ isAdmin }) {

    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const { userId } = useParams();

    const [leadsReport, setLeadsReport] = useState([]);
    const [originalData, setOriginalData] = useState([]); // State to hold the original data
    const [floorManagerBranch, setFloorManagerBranch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [newSortType, setNewSortType] = useState({
        interestedLeads: "none",
        followUpLeads: "none",
        forwardedLeads: "none",
    });

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

    const fetchFloorManagerDetails = async () => {
        try {
            const res = await axios.get(`${secretKey}/employee/fetchEmployeeFromId/${userId}`);
            // console.log("Fetched details is :", res.data.data);
            setFloorManagerBranch(res.data.data.branchOffice);
        } catch (error) {
            console.log("Error fetching floor manager details :", error);
        }
    };

    useEffect(() => {
        if (!isAdmin) {
            fetchFloorManagerDetails();
        }
    }, []);

    const fetchLeadsReport = async (dates) => {
        if (dates) {
            // console.log("Selected start date :", dates[0]);
            // console.log("Selected end date :", dates[1]);

            const startDate = dates[0] ? dayjs(dates[0]).format("YYYY-MM-DD") : "";
            const endDate = dates[1] ? dayjs(dates[1]).format("YYYY-MM-DD") : "";

            // console.log("Formatted Start Date :", startDate);
            // console.log("Formatted End Date :", endDate);

            setStartDate(startDate);
            setEndDate(endDate);
        }
        try {
            setIsLoading(true);
            const res = await axios.get(`${secretKey}/bdm-data/floorManagerLeadsReport`, {
                params: { startDate, endDate }
            });
            // console.log("Leads report is :", res.data.data);
            setLeadsReport(res.data.data);
            setOriginalData(res.data.data);
        } catch (error) {
            console.log("Error fetching leads report :", error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLeadsReport();
    }, [startDate, endDate]);

    // Function to sort data based on a key
    const sortData = (key, order) => {
        return [...leadsReport].sort((a, b) => {
            if (order === "ascending") {
                return a[key] - b[key];
            } else if (order === "descending") {
                return b[key] - a[key];
            }
            return 0; // Default case, no sorting
        });
    };

    // Sorting interested leads :
    const handleSortInterestedLeads = (sortType) => {
        if (sortType === "none") {
            setLeadsReport(originalData); // Reset to original data
        } else {
            setLeadsReport(sortData('interested', sortType));
        }
    };

    // Sorting follow up leads :
    const handleSortFollowUpLeads = (sortType) => {
        if (sortType === "none") {
            setLeadsReport(originalData); // Reset to original data
        } else {
            setLeadsReport(sortData('followUp', sortType));
        }
    };

    // Sorting forwarded leads :
    const handleSortForwardedLeads = (sortType) => {
        if (sortType === "none") {
            setLeadsReport(originalData); // Reset to original data
        } else {
            setLeadsReport(sortData('forwarded', sortType));
        }
    };

    // Define filtered leads once to use in both <tbody> and <tfoot>
    const filteredLeads = leadsReport.filter((emp) =>
        isAdmin || (
            emp.branchOffice === floorManagerBranch &&
            emp.employeeName !== "Vishnu Suthar" && emp.employeeName !== "Vandit Shah" &&
            emp.employeeName !== "Khushi Gandhi" && emp.employeeName !== "Yashesh Gajjar" &&
            emp.employeeName !== "Ravi Prajapati" && emp.employeeName !== "Yash Goswami"
        )
    );

    return (
        <div>
            <div className="employee-dashboard mt-2">
                <div className="card">
                    <div className="card-header p-1 employeedashboard d-flex align-items-center justify-content-between">
                        <div className="dashboard-title pl-1"  >
                            <h2 className="m-0">
                                Employees Interested, Follow Up & Forwarded Leads Report
                            </h2>
                        </div>

                        <div className="d-flex align-items-center pr-1">
                            <div className="data-filter">
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs} >
                                    <DemoContainer
                                        components={["SingleInputDateRangeField"]} sx={{
                                            padding: '0px',
                                            with: '220px'
                                        }}  >
                                        <DateRangePicker className="form-control my-date-picker form-control-sm p-0"
                                            onChange={(values) => fetchLeadsReport(values)}
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
                        </div>
                    </div>

                    <div className='card-body'>
                        <div className="row tbl-scroll">

                            <table className="admin-dash-tbl">
                                <thead className="admin-dash-tbl-thead">
                                    <tr>
                                        <th>Sr.No</th>
                                        <th>BDE/BDM Name</th>
                                        <th>Branch Name</th>

                                        <th style={{ cursor: "pointer" }}
                                            onClick={(e) => {
                                                let updatedSortType;
                                                if (newSortType.interestedLeads === "ascending") {
                                                    updatedSortType = "descending";
                                                } else if (newSortType.interestedLeads === "descending") {
                                                    updatedSortType = "none";
                                                } else {
                                                    updatedSortType = "ascending";
                                                }
                                                setNewSortType((prevData) => ({
                                                    ...prevData,
                                                    interestedLeads: updatedSortType,
                                                }));
                                                handleSortInterestedLeads(updatedSortType);
                                            }}><div className="d-flex align-items-center justify-content-between">
                                                <div>Interested Leads</div>
                                                <div className="short-arrow-div">
                                                    <ArrowDropUpIcon className="up-short-arrow"
                                                        style={{ color: newSortType.interestedLeads === "descending" ? "black" : "#9d8f8f" }}
                                                    />
                                                    <ArrowDropDownIcon className="down-short-arrow"
                                                        style={{ color: newSortType.interestedLeads === "ascending" ? "black" : "#9d8f8f" }}
                                                    />
                                                </div>
                                            </div>
                                        </th>

                                        <th style={{ cursor: "pointer" }}
                                            onClick={(e) => {
                                                let updatedSortType;
                                                if (newSortType.followUpLeads === "ascending") {
                                                    updatedSortType = "descending";
                                                } else if (newSortType.followUpLeads === "descending") {
                                                    updatedSortType = "none";
                                                } else {
                                                    updatedSortType = "ascending";
                                                }
                                                setNewSortType((prevData) => ({
                                                    ...prevData,
                                                    followUpLeads: updatedSortType,
                                                }));
                                                handleSortFollowUpLeads(updatedSortType);
                                            }}><div className="d-flex align-items-center justify-content-between">
                                                <div>Follow Up Leads</div>
                                                <div className="short-arrow-div">
                                                    <ArrowDropUpIcon className="up-short-arrow"
                                                        style={{ color: newSortType.followUpLeads === "descending" ? "black" : "#9d8f8f" }}
                                                    />
                                                    <ArrowDropDownIcon className="down-short-arrow"
                                                        style={{ color: newSortType.followUpLeads === "ascending" ? "black" : "#9d8f8f" }}
                                                    />
                                                </div>
                                            </div>
                                        </th>

                                        <th style={{ cursor: "pointer" }}
                                            onClick={(e) => {
                                                let updatedSortType;
                                                if (newSortType.forwardedLeads === "ascending") {
                                                    updatedSortType = "descending";
                                                } else if (newSortType.forwardedLeads === "descending") {
                                                    updatedSortType = "none";
                                                } else {
                                                    updatedSortType = "ascending";
                                                }
                                                setNewSortType((prevData) => ({
                                                    ...prevData,
                                                    forwardedLeads: updatedSortType,
                                                }));
                                                handleSortForwardedLeads(updatedSortType);
                                            }}><div className="d-flex align-items-center justify-content-between">
                                                <div>Forwarded Cases</div>
                                                <div className="short-arrow-div">
                                                    <ArrowDropUpIcon className="up-short-arrow"
                                                        style={{ color: newSortType.forwardedLeads === "descending" ? "black" : "#9d8f8f" }}
                                                    />
                                                    <ArrowDropDownIcon className="down-short-arrow"
                                                        style={{ color: newSortType.forwardedLeads === "ascending" ? "black" : "#9d8f8f" }}
                                                    />
                                                </div>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="6">
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
                                    ) : (
                                        <>
                                            {filteredLeads.length > 0 ? (
                                                filteredLeads.map((emp, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{emp.employeeName}</td>
                                                        <td>{emp.branchOffice}</td>
                                                        <td>{emp.interested}</td>
                                                        <td>{emp.followUp}</td>
                                                        <td>{emp.forwarded}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6">
                                                        <Nodata />
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    )}
                                </tbody>

                                {filteredLeads.length > 0 && !isLoading && (
                                    <tfoot className="admin-dash-tbl-tfoot">
                                        <tr>
                                            <td colSpan={3}>Total</td>
                                            <td>{filteredLeads.reduce((sum, emp) => sum + (emp.interested || 0), 0)}</td>
                                            <td>{filteredLeads.reduce((sum, emp) => sum + (emp.followUp || 0), 0)}</td>
                                            <td>{filteredLeads.reduce((sum, emp) => sum + (emp.forwarded || 0), 0)}</td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default FloorManagerLeadsReport;