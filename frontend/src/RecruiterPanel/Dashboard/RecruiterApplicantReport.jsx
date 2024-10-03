import React, { useState } from 'react';
import { LuHistory } from "react-icons/lu";
import ClipLoader from "react-spinners/ClipLoader";
import Nodata from '../../DataManager/Components/Nodata/Nodata';

function RecruiterApplicantReport({ empName, recruiterData }) {
    const [isLoading, setisLoading] = useState(false)

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
                    </div>
                    <div className="card-body">
                        <div className="table table-responsive">
                            <table className="table" style={{ maxHeight: "400px" }}>
                                <thead>
                                    <tr  >
                                        <th>SR.NO</th>
                                        <th>Application Date</th>
                                        <th>General</th>
                                        <th>Under Review</th>
                                        <th>On Hold</th>
                                        <th>Disqualified</th>
                                        <th>Rejected</th>
                                        <th>Selected</th>
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
                                    recruiterData.length !== 0 ? (
                                        <>
                                            <tbody>
                                                {recruiterData.map((obj, index) => (
                                                    <>
                                                        <tr  >
                                                            <th>{index + 1}</th>
                                                            <th>{obj.fillingDate}</th>
                                                            <th>{obj.serviceName}</th>
                                                            <th>{obj.bdeName}</th>
                                                            <th>{obj.bdmName}</th>
                                                            <th>
                                                                <div>₹ {Math.round(obj.totalPayment).toLocaleString()}</div>
                                                            </th>
                                                            <th>
                                                                <div>₹ {Math.round(obj.receivedPayment).toLocaleString()}</div>
                                                            </th>
                                                            <th>
                                                                {/* {formatDateFinal(obj.paymentDate)} */}
                                                            </th>
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
