import React, { useState, useEffect } from 'react';
import { LuHistory } from "react-icons/lu";
import ClipLoader from "react-spinners/ClipLoader";
import Nodata from '../../DataManager/Components/Nodata/Nodata';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from "moment";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

function RecruiterInterviewReport({ empName, recruiterData }) {
    const [isLoading, setisLoading] = useState(false);
    function formatDatePro(inputDate) {
        const date = new Date(inputDate);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month}, ${year}`;
    }

    const [cleared, setCleared] = useState(false);
    const [groupedData, setGroupedData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchText, setSearchText] = useState([])
    const formatDateToDDMMYYYY = (dateString) => {
        return dayjs(dateString).format('DD/MM/YYYY');
    };
    useEffect(() => {
        const upcomingJoinees = recruiterData.filter(applicant => {
            if (!applicant.interViewDate) {
                console.log("Interview Date Missing for:", applicant.empFullName);
                return false;
            }
    
            // Parse interview date and current date
            const interviewDate = new Date(applicant.interViewDate);
            const currentDate = new Date();
    
            // Set both dates' time to midnight (00:00:00) for comparison
            interviewDate.setHours(0, 0, 0, 0);
            currentDate.setHours(0, 0, 0, 0);
    
            console.log("Interview Date:", interviewDate, "Current Date:", currentDate); // Debugging
    
            // Compare only the date part
            return (
                applicant.subCategoryStatus === "InterView Scheduled" &&
                interviewDate >= currentDate
            );
        });
    
        setGroupedData(upcomingJoinees);
        setFilteredData(upcomingJoinees);
    }, [recruiterData]);
    

    const handleSingleDateSelection = (formattedDate) => {
        if (!formattedDate) {
            setFilteredData(groupedData);
            return;
        }
        const filtered = groupedData.filter((applicant) => {
            const formattedInterViewDate = formatDateToDDMMYYYY(applicant.interViewDate);
            return formattedInterViewDate === formattedDate;
        })
        setFilteredData(filtered);
    }

    const handleSearchChange = (searchValue) => {
        if (!searchValue) {
            setFilteredData(groupedData);
            return;
        }
        const filtered = groupedData.filter((data) => {
            return (
                data.empFullName?.toLowerCase().includes(searchValue.toLowerCase()) ||
                data.personal_number?.toLowerCase().includes(searchValue.toLowerCase()) ||
                data.personal_email?.toLowerCase().includes(searchValue.toLowerCase())
            );
        });
        setFilteredData(filtered);
    }

    return (
        <div className='container-xl'>
            <div className="employee-dashboard mt-2">
                <div className="card todays-booking mt-2 totalbooking" id="remaining-booking"   >

                    <div className="card-header d-flex align-items-center justify-content-between p-1">

                        <div className="dashboard-title">
                            <h2 className="m-0 pl-1">
                                Interview Schedule Report
                            </h2>
                        </div>
                        <div className='d-flex align-items-center'>
                            <div class="input-icon mr-1">
                                <span class="input-icon-addon">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon mybtn" width="18" height="18" viewBox="0 0 22 22" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                                        <path d="M21 21l-6 -6"></path>
                                    </svg>
                                </span>
                                <input
                                    className="form-control search-cantrol mybtn"
                                    placeholder="Search…"
                                    type="text"
                                    name="bdeName-search"
                                    id="bdeName-search"
                                    value={searchText}
                                    onChange={(e) => {
                                        setSearchText(e.target.value)
                                        handleSearchChange(e.target.value)
                                    }}
                                />
                            </div>
                            <div className="data-filter">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker']}
                                        sx={{ padding: '0px', width: '220px' }}>
                                        <DatePicker
                                            className="form-control my-date-picker form-control-sm p-0"
                                            onChange={(value) => {
                                                if (value) {
                                                    // Convert the selected date to Moment object
                                                    const selectedDate = moment(value.$d);

                                                    // Format as required
                                                    const formattedDate = selectedDate.format("DD/MM/YYYY");
                                                    // console.log("Formatted Date:", formattedDate); // Debugging

                                                    // Call the function to handle the selected date and fetch data
                                                    handleSingleDateSelection(formattedDate);
                                                }
                                            }}
                                            slotProps={{
                                                field: {
                                                    clearable: true, onClear: () => {
                                                        setCleared(true)
                                                        setFilteredData(groupedData)
                                                    }
                                                },
                                            }}
                                        // label="Basic date picker"
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row tbl-scroll">
                            <table className="table-vcenter table-nowrap admin-dash-tbl" style={{ maxHeight: "400px" }}>
                                <thead className="recruiter-dash-tbl-thead">
                                    <tr  >
                                        <th>SR.NO</th>
                                        <th>Applicant Name</th>
                                        <th>Number</th>
                                        <th>Email Id</th>
                                        <th>Applied For</th>
                                        <th>Interview On</th>
                                        <th>Interview Status</th>
                                        <th>Application Date</th>
                                    </tr>
                                </thead>
                                {isLoading ? (
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
                                    filteredData.length !== 0 ? (
                                        <>
                                            <tbody>
                                                {filteredData.map((obj, index) => (
                                                    <>
                                                        <tr  >
                                                            <th>{index + 1}</th>
                                                            <th>{obj.empFullName}</th>
                                                            <th>{obj.personal_number}</th>
                                                            <th>{obj.personal_email}</th>
                                                            <th>{obj.appliedFor ? obj.appliedFor : "-"}</th>
                                                            <th>{obj.interViewDate ? formatDatePro(obj.interViewDate) : "-"}</th>
                                                            <th>{obj.interViewStatus ? obj.interViewStatus : "-"}</th>
                                                            <th>{formatDatePro(obj.fillingDate)}</th>

                                                        </tr>
                                                    </>
                                                ))}

                                            </tbody>
                                        </>
                                    ) : (
                                        <tbody>
                                            <tr>
                                                <td className="particular" colSpan={9}>
                                                    <Nodata />
                                                </td>
                                            </tr>
                                        </tbody>
                                    )
                                )}
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecruiterInterviewReport;
