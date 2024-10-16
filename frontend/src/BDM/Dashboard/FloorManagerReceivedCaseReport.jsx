import React, { useState, useEffect } from 'react';
import axios from "axios";

function FloorManagerReceivedCaseReport() {

    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const floorManagerName = localStorage.getItem('bdmName');

    const monthOptions = [
        { value: 'total', label: 'Total' },
        { value: 'current_month', label: 'Current Month' },
        { value: 'last_month', label: 'Last Month' }
    ];

    const [summaryData, setSummaryData] = useState({});
    const [currentDateSummeryData, setCurrentDateSummaryData] = useState({});
    const [projectedSummaryData, setProjectedSummaryData] = useState({});
    const [projectedCurrentDateSummaryData, setProjectedCurrentDateSummaryData] = useState({});
    const [selectedMonthOption, setSelectedMonthOption] = useState('total'); // Default to current month

    const fetchFloorManagerReceivedCases = async (monthFilter) => {
        try {
            const res = await axios.get(`${secretKey}/bdm-data/floorManagerReceivedCases/${floorManagerName}`, {
                params: { monthFilter } // Pass the month filter as a query parameter
            });
            const res2 = await axios.get(`${secretKey}/bdm-data/floorManagerReceivedCasesProjectedAmount/${floorManagerName}`, {
                params: { monthFilter } // Pass the month filter as a query parameter
            });
            // console.log("Floor manager received cases are :", res.data);
            // console.log("Floor manager projected data :", res2.data);
            setSummaryData(res.data.summary);
            setProjectedSummaryData(res2.data.summary);

        } catch (error) {
            console.log("Error fetching received cases :", error);
        }
    };

    const fetchFloorManagerReceivedCasesCurrentDate = async () => {
        try {
            const res = await axios.get(`${secretKey}/bdm-data/floorManagerReceivedCasesToday/${floorManagerName}`);
            const res2 = await axios.get(`${secretKey}/bdm-data/floorManagerProjectedAmountToday/${floorManagerName}`);
            // console.log("Floor manager current date received cases are :", res.data);
            // console.log("Floor manager current date projected data :", res2.data);
            setCurrentDateSummaryData(res.data.summary);
            setProjectedCurrentDateSummaryData(res2.data.summary);
            
        } catch (error) {
            console.log("Error fetching received cases :", error);
        }
    };

    useEffect(() => {
        fetchFloorManagerReceivedCasesCurrentDate();
    }, []);

    useEffect(() => {
        fetchFloorManagerReceivedCases(selectedMonthOption);
    }, [selectedMonthOption]);

    const handleMonthChange = (value) => {
        setSelectedMonthOption(value); // Update selected month option state
    };

    return (
        <div className="as-bde-bdm-daSH mt-4 mb-2">
            <div className="container-xl">
                <div className="as-bde-bdm-daSH-inner">

                    <ul class="nav nav-tabs" id="myTab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="receivedAsBDM-tab" data-bs-toggle="tab" data-bs-target="#receivedAsBDM" type="button" role="tab" aria-controls="receivedAsBDM" aria-selected="false">
                                Recieved as BDM cases report
                            </button>
                        </li>
                    </ul>

                    <div class="tab-content" id="myTabContent">
                        <div class="tab-pane fade show active" id="receivedAsBDM" role="tabpanel" aria-labelledby="receivedAsBDM-tab">
                            <div className="mt-3 mb-3">
                                <div className="row m-0">

                                    <div className="dashboard-headings">
                                        <h3 className="m-0">Today's Report</h3>
                                    </div>

                                    {/* recieved bdm report today */}
                                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                                        <div className="dash-card-2">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="dash-card-2-head">TOTAL</div>
                                                <div className="dash-card-2-body">
                                                    <div className="dash-card-2-num">
                                                        {currentDateSummeryData.total || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-2 mb-2 col-md-4 col-sm-6 col-12">
                                        <div className="dash-card-2">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="dash-card-2-head">GENERAL</div>
                                                <div className="dash-card-2-body">
                                                    <div className="dash-card-2-num">
                                                        {currentDateSummeryData.general || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                                        <div className="dash-card-2">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="dash-card-2-head">INTERESTED</div>
                                                <div className="dash-card-2-body">
                                                    <div className="dash-card-2-num">
                                                        {currentDateSummeryData.interested || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                                        <div className="dash-card-2">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="dash-card-2-head">FOLLOW UP</div>
                                                <div className="dash-card-2-body">
                                                    <div className="dash-card-2-num">
                                                        {currentDateSummeryData.followup || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                                        <div className="dash-card-2">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="dash-card-2-head">MATURED</div>
                                                <div className="dash-card-2-body">
                                                    <div className="dash-card-2-num">
                                                        {currentDateSummeryData.matured || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                                        <div className="dash-card-2">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="dash-card-2-head">NOT INTERESTED</div>
                                                <div className="dash-card-2-body">
                                                    <div className="dash-card-2-num">
                                                        {currentDateSummeryData.notInterested || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                                        <div className="dash-card-2">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="dash-card-2-head">PROJECTED REVENUE</div>
                                                <div className="dash-card-2-body">
                                                    <div className="dash-card-2-num">
                                                        ₹ {projectedCurrentDateSummaryData.total?.toFixed(2) || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                                        <div className="dash-card-2">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="dash-card-2-head">GENERATED REVENUE</div>
                                                <div className="dash-card-2-body">
                                                    <div className="dash-card-2-num">
                                                        ₹ {currentDateSummeryData.generatedReceivedAmountTotal?.toFixed(2) || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className="mt-3 mb-3">
                                <div className="row m-0">

                                    <div className="d-flex align-items-center justify-content-between p-0">
                                        <div className="dashboard-headings ">
                                            <h3 className="m-0">Total Report</h3>
                                        </div>
                                        <div className="pr-1">
                                            <select className="pr-2"
                                                style={{
                                                    border: "none",
                                                    outline: "none",
                                                }}
                                                value={selectedMonthOption}
                                                onChange={(e) => handleMonthChange(e.target.value)}
                                            >
                                                <option disabled value="">Select...</option>
                                                {monthOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* recieved bdm report total */}
                                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                                        <div className="dash-card-2">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="dash-card-2-head">TOTAL</div>
                                                <div className="dash-card-2-body">
                                                    <div className="dash-card-2-num">
                                                        {summaryData.total || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-2 mb-2 col-md-4 col-sm-6 col-12">
                                        <div className="dash-card-2">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="dash-card-2-head">GENERAL</div>
                                                <div className="dash-card-2-body">
                                                    <div className="dash-card-2-num">
                                                        {summaryData.general || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                                        <div className="dash-card-2">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="dash-card-2-head">INTERESTED</div>
                                                <div className="dash-card-2-body">
                                                    <div className="dash-card-2-num">
                                                        {summaryData.interested || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                                        <div className="dash-card-2">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="dash-card-2-head">FOLLOW UP</div>
                                                <div className="dash-card-2-body">
                                                    <div className="dash-card-2-num">
                                                        {summaryData.followUp || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                                        <div className="dash-card-2">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="dash-card-2-head">MATURED</div>
                                                <div className="dash-card-2-body">
                                                    <div className="dash-card-2-num">
                                                        {summaryData.matured || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                                        <div className="dash-card-2">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="dash-card-2-head">NOT INTERESTED</div>
                                                <div className="dash-card-2-body">
                                                    <div className="dash-card-2-num">
                                                        {summaryData.notInterested || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                                        <div className="dash-card-2">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="dash-card-2-head">PROJECTED REVENUE</div>
                                                <div className="dash-card-2-body">
                                                    <div className="dash-card-2-num">
                                                        ₹ {projectedSummaryData.total?.toFixed(2) || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                                        <div className="dash-card-2">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="dash-card-2-head">GENERATED REVENUE</div>
                                                <div className="dash-card-2-body">
                                                    <div className="dash-card-2-num">
                                                        ₹ {summaryData.generatedReceivedAmountTotal?.toFixed(2) || 0}
                                                    </div>
                                                </div>
                                            </div>
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

export default FloorManagerReceivedCaseReport;