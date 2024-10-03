import React, { useState, useEffect } from 'react';
import { LuHistory } from "react-icons/lu";
import ClipLoader from "react-spinners/ClipLoader";
import Nodata from '../../DataManager/Components/Nodata/Nodata';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from "moment";

function RecruiterApplicantReport({ empName, recruiterData }) {
    const [isLoading, setisLoading] = useState(false);
    const [cleared, setCleared] = useState(false);
    function formatDatePro(inputDate) {
        const date = new Date(inputDate);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month}, ${year}`;
    }

    useEffect(() => {
        if (cleared) {
            const timeout = setTimeout(() => {
                setCleared(false);
            }, 1500);

            return () => clearTimeout(timeout);
        }
        return () => { };
    }, [cleared]);

    const [groupedData, setGroupedData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        // Group data by `fillingDate` and count statuses
        const groupedByDate = recruiterData.reduce((acc, applicant) => {
            const date = new Date(applicant.fillingDate).toLocaleDateString(); // Format date
            if (!acc[date]) {
                acc[date] = {
                    General: 0,
                    UnderReview: 0,
                    "On Hold": 0,
                    Disqualified: 0,
                    Rejected: 0,
                    Selected: 0,
                };
            }

            // Increase the count for the corresponding status
            if (acc[date][applicant.mainCategoryStatus] !== undefined) {
                acc[date][applicant.mainCategoryStatus] += 1;
            }

            return acc;
        }, {});

        // Convert the object to an array to make it easier for mapping
        const dataAsArray = Object.keys(groupedByDate).map((date, index) => ({
            date,
            ...groupedByDate[date],
            total:
                groupedByDate[date].General +
                groupedByDate[date].UnderReview +
                groupedByDate[date]["On Hold"] +
                groupedByDate[date].Disqualified +
                groupedByDate[date].Rejected +
                groupedByDate[date].Selected,
        }));

        setGroupedData(dataAsArray);
        setFilteredData(dataAsArray);
    }, [recruiterData]);

    const formatDate = (dateString) => {
        const [month, date, year] = dateString.split('/');
        console.log(`0${date}/${month}/${year}`)
        return `0${date}/${month}/${year}`;
    }
    const handleSingleDateSelection = (formattedDate) => {
        // console.log("formatted" , formattedDate)
        if (!formattedDate) {
            setFilteredData(groupedData);
            return;
        }

        // Filter grouped data by the selected date
        const filtered = groupedData.filter(

            (data) => {
                // console.log("data" , data)

                return formatDate(data.date) === formattedDate
            }
        );
        setFilteredData(filtered);
    };
    
    


    return (
        <div className='container-xl'>
            <div className="employee-dashboard mt-2">
                <div className="card todays-booking mt-2 totalbooking" id="remaining-booking"   >
                    <div className="card-header d-flex align-items-center justify-content-between p-1">
                        <div className="dashboard-title">
                            <h2 className="m-0 pl-1">
                                Applicants Report
                            </h2>
                        </div>
                        <div className='d-flex align-items-center'>
                           
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
                                        <th>Application Date</th>
                                        <th>General</th>
                                        <th>Under Review</th>
                                        <th>On Hold</th>
                                        <th>Disqualified</th>
                                        <th>Rejected</th>
                                        <th>Selected</th>
                                        <th>Total</th>
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
                                                            <th>{formatDatePro(obj.date)}</th>
                                                            <th>{obj.General}</th>
                                                            <th>{obj.UnderReview}</th>
                                                            <th>{obj["On Hold"]}</th>
                                                            <th>{obj.Disqualified}</th>
                                                            <th>{obj.Selected}</th>
                                                            <th>{obj.Rejected}</th>
                                                            <th>{obj.total}</th>

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

export default RecruiterApplicantReport;
