import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { styled } from '@mui/material/styles';
import { useDrawingArea } from '@mui/x-charts/hooks';

function InProcessReport({ totalInProcess, callBriefPending, dscPending, clientNotResponding, documentsPending, working, needToCall }) {

    //---------------- function for piew charts----------------------------
    const data1 = [
        { label: 'In Process', value: totalInProcess, color: '#ebd58e' },
    ];

    const data2 = [
        { value: callBriefPending, label: 'Call Done Brief Pending', color: '#1ac9bd'},
        { value: dscPending, label: 'All Done DSC Pending', color: '#ffb900'},
        { value: clientNotResponding, label: 'Client Not Responding', color: '#4299e1'},
        { value: documentsPending, label: 'Documents Pending', color: '#1cba19'},
        { value: working, label: 'Working', color: '#e65b5b'},
        { value: needToCall, label: 'Need To Call', color: '#00d19d'},
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
                        Inprocess Status
                    </h2>
                </div>
                <div className="dash-card-body">
                    <div className="row align-items-center">
                        <div className="col-sm-5 align-self-stretch">
                            <div className="call-dr-names mb-2">
                                <div className="call-dr-card d-flex align-items-center justify-content-between mt-1 mb-1">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="color-dots clr-bg-1ac9bd">
                                        </div>
                                        <div className="call-dr-name">
                                            Call Done Brief Pending
                                        </div>
                                    </div>
                                    <div className="call-dr-num">
                                        {callBriefPending}
                                    </div>
                                </div>
                                <div className="call-dr-card d-flex align-items-center justify-content-between mt-1 mb-1">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="color-dots clr-bg-ffb900">
                                        </div>
                                        <div className="call-dr-name">
                                            All Done DSC Pending
                                        </div>
                                    </div>
                                    <div className="call-dr-num">
                                        {dscPending}
                                    </div>
                                </div>
                                <div className="call-dr-card d-flex align-items-center justify-content-between mt-1 mb-1">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="color-dots clr-bg-4299e1">
                                        </div>
                                        <div className="call-dr-name">
                                            Client Not Responding
                                        </div>
                                    </div>
                                    <div className="call-dr-num">
                                        {clientNotResponding}
                                    </div>
                                </div>
                                <div className="call-dr-card d-flex align-items-center justify-content-between mt-1 mb-1">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="color-dots clr-bg-1cba19">
                                        </div>
                                        <div className="call-dr-name">
                                            Documents Pending
                                        </div>
                                    </div>
                                    <div className="call-dr-num">
                                        {documentsPending}
                                    </div>
                                </div>
                                <div className="call-dr-card d-flex align-items-center justify-content-between mt-1 mb-1">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="color-dots clr-bg-e65b5b">
                                        </div>
                                        <div className="call-dr-name">
                                            Working
                                        </div>
                                    </div>
                                    <div className="call-dr-num">
                                        {working}
                                    </div>
                                </div>
                                <div className="call-dr-card d-flex align-items-center justify-content-between mt-1 mb-1">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="color-dots clr-bg-00d19d">
                                        </div>
                                        <div className="call-dr-name">
                                            Need To Call
                                        </div>
                                    </div>
                                    <div className="call-dr-num">
                                        {needToCall}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-7 align-self-stretch">
                            <div className="call-dr-chart mt-1">
                                <div className="chart-container" style={{ width: '100%', height: '262px' }}>
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
                                        <PieCenterLabel>Total: {totalInProcess}</PieCenterLabel>
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

export default InProcessReport;
