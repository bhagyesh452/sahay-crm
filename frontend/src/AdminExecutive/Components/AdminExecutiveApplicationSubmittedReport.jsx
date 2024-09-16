import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { styled } from '@mui/material/styles';
import { useDrawingArea } from '@mui/x-charts/hooks';

function AdminExecutiveApplicationSubmittedReport({ kycPending, kycRejected, kycIncomplete, totalApplicationSubmitted, isAdminExecutive }) {

    //---------------- function for piew charts----------------------------
    const data1 = [
        { label: 'Application Submitted', value: totalApplicationSubmitted, color: '#ebd58e' },
    ];

    const data2 = [
        { value: kycPending, label: 'KYC Pending', color: '#ffb900' },
        { value: kycRejected, label: 'KYC Rejected', color: '#ad77f8' },
        { value: kycIncomplete, label: 'KYC Incomplete', color: '#3433ff' },
    ];

    const size = {
        width: 350,
        height: 250,
        viewBox: "0 0 250 200",
    };

    const StyledText = styled('text')(({ theme }) => ({
        fill: theme.palette.text.primary,
        textAnchor: 'middle',
        dominantBaseline: 'central',
        fontSize: 20,
    }));

    function PieCenterLabel({ children }) {
        const { width, height, left, top } = useDrawingArea();
        return (
            <StyledText x={left + width / 2} y={top + height / 2}>
                {children}
            </StyledText>
        );
    }

    return (
        <div>
            <div className="dash-card">
                <div className="dash-card-head">
                    <h2 className="m-0">
                        {isAdminExecutive ? "Application Submitted Report of Admin Executive" : "Application Submitted Report"}
                    </h2>
                </div>
                <div className="dash-card-body">
                    <div className="row align-items-center">
                        <div className="col-sm-5 align-self-stretch">
                            <div className="call-dr-names mb-2">

                                <div className="call-dr-card d-flex align-items-center justify-content-between mt-1 mb-1">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="color-dots clr-bg-ffb900">
                                        </div>
                                        <div className="call-dr-name">
                                            KYC Pending
                                        </div>
                                    </div>
                                    <div className="call-dr-num">
                                        {kycPending}
                                    </div>
                                </div>

                                <div className="call-dr-card d-flex align-items-center justify-content-between mt-1 mb-1">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="color-dots clr-bg-ad77f8">
                                        </div>
                                        <div className="call-dr-name">
                                            KYC Rejected
                                        </div>
                                    </div>
                                    <div className="call-dr-num">
                                        {kycRejected}
                                    </div>
                                </div>

                                <div className="call-dr-card d-flex align-items-center justify-content-between mt-1 mb-1">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="color-dots clr-bg-3433ff">
                                        </div>
                                        <div className="call-dr-name">
                                            KYC Incomplete
                                        </div>
                                    </div>
                                    <div className="call-dr-num">
                                        {kycIncomplete}
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="col-sm-7 align-self-stretch">
                            <div className="call-dr-chart mt-1">
                                <div className="chart-container" style={{ width: '100%', height: '250px' }}>
                                    <PieChart
                                        series={[
                                            {
                                                innerRadius: 0,
                                                outerRadius: 80,
                                                data: data1,
                                            },
                                            {
                                                innerRadius: 100,
                                                outerRadius: 120,
                                                data: data2,
                                            },
                                        ]}
                                        {...size}
                                        slotProps={{
                                            legend: { hidden: true },
                                        }}>
                                        <PieCenterLabel>Total: {totalApplicationSubmitted}</PieCenterLabel>
                                    </PieChart>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminExecutiveApplicationSubmittedReport;