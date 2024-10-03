import React, { useState,useEffect } from 'react';
import { LuHistory } from "react-icons/lu";
import ClipLoader from "react-spinners/ClipLoader";
import Nodata from '../../DataManager/Components/Nodata/Nodata';

function RecruiterSelectdReport({ empName, recruiterData }) {
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
                applicant.mainCategoryStatus === "Selected" &&
                new Date(applicant.jdate) > new Date()
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
                                Selected Employees Report
                            </h2>
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
                                        <th>Designation</th>
                                        <th>Offered Salary</th>
                                        <th>First Salary Condition</th>
                                        <th>Date Of Joining</th>
                                        <th>Branch Preference</th>
                                        <th>Source</th>
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
                                                            <th>{obj.offeredSalary ? (obj.offeredSalary).toLocaleString("en-us") : "-"}</th>
                                                            <th>{obj.firstMonthSalaryCondition ? `${obj.firstMonthSalaryCondition}` : "-"}</th>
                                                            <th>{obj.jdate ? formatDatePro(obj.jdate) : "-"}</th>
                                                            <th>{obj.branchOffice ? obj.branchOffice : "-"}</th>
                                                            <th>{obj.applicationSource}</th>
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

export default RecruiterSelectdReport;
