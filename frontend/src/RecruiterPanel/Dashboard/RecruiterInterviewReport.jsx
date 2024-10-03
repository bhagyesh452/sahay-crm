import React, { useState,useEffect } from 'react';
import { LuHistory } from "react-icons/lu";
import ClipLoader from "react-spinners/ClipLoader";
import Nodata from '../../DataManager/Components/Nodata/Nodata';

function RecruiterInterviewReport({ empName, recruiterData }) {
    const [isLoading, setisLoading] = useState(false);
    function formatDatePro(inputDate) {
        const date = new Date(inputDate);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month}, ${year}`;
    }

    const [groupedData, setGroupedData] = useState([]);

    useEffect(() => {
        // Filter applicants whose status is "Selected" and joining date is in the future
        const upcomingJoinees = recruiterData.filter(applicant => {
            if (
                applicant.subCategoryStatus === "InterView Scheduled" &&
                new Date(applicant.interViewDate) > new Date()
            ) {
                return true;
            }
            return false;
        });

        setGroupedData(upcomingJoinees);
    }, [recruiterData]);


    console.log("recruiterData" , recruiterData)
    console.log("groupedData" , groupedData)

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
                    </div>
                    <div className="card-body">
                        <div className="row tbl-scroll">
                            <table className="table-vcenter table-nowrap admin-dash-tbl" style={{ maxHeight: "400px" }}>
                                <thead className="recruiter-dash-tbl-thead">
                                    <tr  >
                                        <th>SR.NO</th>
                                        <th>Application Name</th>
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
                                    groupedData.length !== 0 ? (
                                        <>
                                            <tbody>
                                                {groupedData.map((obj, index) => (
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
