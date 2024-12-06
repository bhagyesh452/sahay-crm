import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CurrentMonthLeadsReport({ employeeData }) {

    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const [selectedMonthOption, setSelectedMonthOption] = useState('This Month');
    const [interestedLeads, setInterestedLeads] = useState(0);
    const [followUpLeads, setFollowUpLeads] = useState(0);
    const [forwardedLeads, setForwardedLeads] = useState(0);
    const [maturedLeads, setMaturedLeads] = useState(0);

    const fetchCurrentMonthLeadsReport = async () => {
        try {
            const res = await axios.get(`${secretKey}/employee/currentMonthLeadsReport/${employeeData.ename}`, {
                params: {
                    month: selectedMonthOption,
                }
            });
            // console.log("Current month leads report is :", res.data.data);
            setInterestedLeads(res.data.data.interestedLeads);
            setFollowUpLeads(res.data.data.followUpLeads);
            setForwardedLeads(res.data.data.forwardedLeads);
            setMaturedLeads(res.data.data.maturedLeads);
        } catch (error) {
            console.log("Error fetching current month leads report:", error);
        }
    };

    useEffect(() => {
        fetchCurrentMonthLeadsReport();
    }, [employeeData, selectedMonthOption]);

    return (
        <div>
            <div className="dash-card" style={{ minHeight: '299px' }}>
                <div className="dash-card-head d-flex align-items-center justify-content-between">
                    <h2 className="m-0">
                        {selectedMonthOption === "This Month" ? "Current" : "Last"} Month Leads Report
                    </h2>

                    <div className="dash-select-filter">
                        <select class="form-select form-select-sm my-filter-select"
                            aria-label=".form-select-sm example"
                            value={selectedMonthOption}
                            onChange={(e) => setSelectedMonthOption(e.target.value)}
                        >
                            <option value="This Month">This Month</option>
                            <option value="Last Month">Last Month</option>
                        </select>
                    </div>
                </div>

                <div className="dash-card-body">
                    <div className="row">

                        <div className="col-lg-6 mb-1 mt-2">
                            <div className="call-d-card clr-bg-light-ff8800">
                                <div className="call-d-card-head d-flex align-items-center">
                                    <div className="clr-ff8800">
                                        Interested Leads
                                    </div>
                                </div>
                                <div className="call-d-card-body d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <div className="clr-000">
                                            {interestedLeads}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 mb-1 mt-2">
                            <div className="call-d-card clr-bg-light-1cba19">
                                <div className="call-d-card-head d-flex align-items-center">
                                    <div className="clr-1cba19">
                                        FollowUp Leads
                                    </div>
                                </div>
                                <div className="call-d-card-body d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <div className="clr-000">
                                            {followUpLeads}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="dash-card-body">
                    <div className="row">

                        <div className="col-lg-6 mb-1 mt-2">
                            <div className="call-d-card clr-bg-light-e65b5b">
                                <div className="call-d-card-head d-flex align-items-center">
                                    <div className="clr-e65b5b">
                                        Forwarded Leads
                                    </div>
                                </div>
                                <div className="call-d-card-body d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <div className="clr-000">
                                            {forwardedLeads}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 mb-1 mt-2">
                            <div className="call-d-card clr-bg-light-4299e1">
                                <div className="call-d-card-head d-flex align-items-center">
                                    <div className="clr-4299e1">
                                        Matured Leads
                                    </div>
                                </div>
                                <div className="call-d-card-body d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <div className="clr-000">
                                            {maturedLeads}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default CurrentMonthLeadsReport;