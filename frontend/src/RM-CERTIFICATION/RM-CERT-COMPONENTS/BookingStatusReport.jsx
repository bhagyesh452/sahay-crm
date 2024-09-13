import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { styled } from '@mui/material/styles';
import { useDrawingArea } from '@mui/x-charts/hooks';


function BookingStatusReport({ general, inProcess, readyToSubmit, submitted, approved, hold, defaulter, total }) {

    //---------------- function for piew charts----------------------------
    const data_my = [
        { value: general, label: 'General', color: '#1ac9bd' },
        // {value: inProcess, label: 'In Process', color: '#ffb900'},
        { value: readyToSubmit, label: 'Ready To Submit', color: '#4299e1' },
        { value: submitted, label: 'Submitted', color: '#1cba19' },
        { value: approved, label: 'Approved', color: '#e65b5b' },
        { value: hold, label: 'Hold', color: '#ffb900' },
        { value: defaulter, label: 'Defaulter', color: '#ff81f0' },
    ];

    const size = {
        width: 350,
        height: 220,
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
                        Booking Status Report
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
                                            General
                                        </div>
                                    </div>
                                    <div className="call-dr-num">
                                        {general}
                                    </div>
                                </div>

                                {/* <div className="call-dr-card d-flex align-items-center justify-content-between mt-1 mb-1">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="color-dots clr-bg-ffb900">
                                        </div>
                                        <div className="call-dr-name">
                                            In Process
                                        </div>
                                    </div>
                                    <div className="call-dr-num">
                                        {inProcess}
                                    </div>
                                </div> */}

                                <div className="call-dr-card d-flex align-items-center justify-content-between mt-1 mb-1">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="color-dots clr-bg-4299e1">
                                        </div>
                                        <div className="call-dr-name">
                                            Ready to Submit
                                        </div>
                                    </div>
                                    <div className="call-dr-num">
                                        {readyToSubmit}
                                    </div>
                                </div>

                                <div className="call-dr-card d-flex align-items-center justify-content-between mt-1 mb-1">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="color-dots clr-bg-1cba19">
                                        </div>
                                        <div className="call-dr-name">
                                            Submitted
                                        </div>
                                    </div>
                                    <div className="call-dr-num">
                                        {submitted}
                                    </div>
                                </div>

                                <div className="call-dr-card d-flex align-items-center justify-content-between mt-1 mb-1">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="color-dots clr-bg-e65b5b">
                                        </div>
                                        <div className="call-dr-name">
                                            Approved
                                        </div>
                                    </div>
                                    <div className="call-dr-num">
                                        {approved}
                                    </div>
                                </div>

                                <div className="call-dr-card d-flex align-items-center justify-content-between mt-1 mb-1">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="color-dots clr-bg-ffb900">
                                        </div>
                                        <div className="call-dr-name">
                                            Hold
                                        </div>
                                    </div>
                                    <div className="call-dr-num">
                                        {hold}
                                    </div>
                                </div>

                                <div className="call-dr-card d-flex align-items-center justify-content-between mt-1 mb-1">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="color-dots clr-bg-ff81f0">
                                        </div>
                                        <div className="call-dr-name">
                                            Defaulter
                                        </div>
                                    </div>
                                    <div className="call-dr-num">
                                        {defaulter}
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="col-sm-7 align-self-stretch">
                            <div className="call-dr-chart mt-1 ms-5">
                                <div className="chart-container" style={{ width: '100%', height: '250px' }}>
                                    <PieChart series={[{ data: data_my, innerRadius: 80, labelComponent: null }]} {...size} slotProps={{
                                        legend: { hidden: true },
                                    }}>
                                        <PieCenterLabel>Total: {total}</PieCenterLabel>
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

export default BookingStatusReport;