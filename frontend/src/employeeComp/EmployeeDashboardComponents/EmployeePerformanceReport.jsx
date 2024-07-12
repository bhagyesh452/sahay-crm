import axios from 'axios';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Nodata from '../../components/Nodata';

function EmployeePerformanceReport({ redesignedData, data }) {

    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [achievedAmount, setAchievedAmount] = useState(0);
    const functionCalculateAchievedRevenue = () => {
        let achievedAmount = 0;
        let remainingAmount = 0;
        let expanse = 0;
        let remainingExpense = 0;
        let remainingMoreExpense = 0;
        let add_caCommision = 0;
        const today = new Date();

        redesignedData.map((mainBooking) => {
            let condition = false;
            if ((new Date(mainBooking.bookingDate).getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1)) && (new Date(mainBooking.bookingDate).getFullYear() === today.getFullYear())) {
                condition = true;
            }
            //console.log("condition :", condition);
            if (condition && (mainBooking.bdeName === data.ename || mainBooking.bdmName === data.ename)) {

                if (mainBooking.bdeName === mainBooking.bdmName) {
                    achievedAmount = achievedAmount + Math.round(mainBooking.generatedReceivedAmount);
                    mainBooking.services.map(serv => {
                        let expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);
                        expanseDate.setHours(0, 0, 0, 0);
                        if (serv.expanse) {
                            let expanseCondition = false;
                            if ((expanseDate.getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1)) && (expanseDate.getFullYear() === today.getFullYear())) {
                                expanseCondition = true;
                            }
                            expanse = expanseCondition ? expanse + serv.expanse : expanse;
                        }
                    });
                    if (mainBooking.caCase === "Yes") {
                        add_caCommision += parseInt(mainBooking.caCommission)
                    }
                } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
                    achievedAmount = achievedAmount + Math.round(mainBooking.generatedReceivedAmount) / 2;
                    mainBooking.services.map(serv => {
                        let expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);
                        expanseDate.setHours(0, 0, 0, 0);
                        if (serv.expanse) {
                            let expanseCondition = false;
                            if ((expanseDate.getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1)) && (expanseDate.getFullYear() === today.getFullYear())) {
                                expanseCondition = true;
                            }
                            expanse = expanseCondition ? expanse + serv.expanse / 2 : expanse;
                        }
                    });
                    if (mainBooking.caCase === "Yes") {
                        add_caCommision += parseInt(mainBooking.caCommission) / 2;
                    }
                } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
                    if (mainBooking.bdeName === data.ename) {
                        achievedAmount = achievedAmount + Math.round(mainBooking.generatedReceivedAmount);
                        mainBooking.services.map(serv => {
                            let expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);
                            expanseDate.setHours(0, 0, 0, 0);
                            if (serv.expanse) {
                                let expanseCondition = false;
                                if ((expanseDate.getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1)) && (expanseDate.getFullYear() === today.getFullYear())) {
                                    expanseCondition = true;
                                }
                                expanse = expanseCondition ? expanse + serv.expanse : expanse;
                            }
                        });
                        if (mainBooking.caCase === "Yes") {
                            add_caCommision += parseInt(mainBooking.caCommission);
                        }
                    }
                }
            } else if (mainBooking.remainingPayments.length !== 0 && (mainBooking.bdeName === data.ename || mainBooking.bdmName === data.ename)) {
                let remainingExpanseCondition = mainBooking.remainingPayments.some(item => new Date(item.paymentDate).getMonth() === (today.getMonth() === 0 ? 11 : today.getMonth() - 1));

                if (remainingExpanseCondition) {
                    const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
                    const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
                    mainBooking.services.forEach(serv => {
                        if (serv.expanseDate && new Date(serv.expanseDate) >= startDate && new Date(serv.expanseDate) <= endDate) {
                            if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
                                remainingExpense += serv.expanse / 2;
                            } else if (mainBooking.bdeName === mainBooking.bdmName) {
                                remainingExpense += serv.expanse;
                            } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by" && mainBooking.bdemName === data.ename) {
                                remainingExpense += serv.expanse;
                            }
                        }
                    });
                }

                mainBooking.remainingPayments.map((remainingObj) => {
                    let condition = false;
                    if ((new Date(remainingObj.paymentDate).getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1))) {
                        condition = true;
                    }
                    if (condition) {
                        const findService = mainBooking.services.find((services) => services.serviceName === remainingObj.serviceName)
                        const tempAmount = findService.withGST ? Math.round(remainingObj.receivedPayment) / 1.18 : Math.round(remainingObj.receivedPayment);
                        if (mainBooking.bdeName === mainBooking.bdmName) {
                            remainingAmount += Math.round(tempAmount);
                        } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
                            remainingAmount += Math.round(tempAmount) / 2;
                        } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
                            if (mainBooking.bdeName === data.ename) {
                                remainingAmount += Math.round(tempAmount);
                            }
                        }
                    }
                })
            }

            mainBooking.moreBookings.map((moreObject) => {
                let condition = false;
                if ((new Date(moreObject.bookingDate).getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1))) {
                    condition = true;
                }
                if (condition && (moreObject.bdeName === data.ename || moreObject.bdmName === data.ename)) {
                    if (moreObject.bdeName === moreObject.bdmName) {
                        achievedAmount = achievedAmount + Math.round(moreObject.generatedReceivedAmount);
                        moreObject.services.map(serv => {
                            let expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);
                            expanseDate.setHours(0, 0, 0, 0);
                            if (serv.expanse) {
                                let expanseCondition = false;
                                if ((expanseDate.getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1)) && (expanseDate.getFullYear() === today.getFullYear())) {
                                    expanseCondition = true;
                                }
                                expanse = expanseCondition ? expanse + serv.expanse : expanse;
                            }
                        });
                        if (moreObject.caCase === "Yes") {
                            add_caCommision += parseInt(moreObject.caCommission);
                        }
                    } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by") {
                        achievedAmount = achievedAmount + Math.round(moreObject.generatedReceivedAmount) / 2;
                        moreObject.services.map(serv => {
                            let expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);
                            expanseDate.setHours(0, 0, 0, 0);
                            if (serv.expanse) {
                                let expanseCondition = false;
                                if ((expanseDate.getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1)) && (expanseDate.getFullYear() === today.getFullYear())) {
                                    expanseCondition = true;
                                }
                                expanse = expanseCondition ? expanse + serv.expanse / 2 : expanse;
                            }
                        });
                        if (moreObject.caCase === "Yes") {
                            add_caCommision += parseInt(moreObject.caCommission) / 2;
                        }
                    } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by") {
                        if (moreObject.bdeName === data.ename) {
                            achievedAmount = achievedAmount + Math.round(moreObject.generatedReceivedAmount);
                            moreObject.services.map(serv => {
                                let expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);
                                expanseDate.setHours(0, 0, 0, 0);
                                if (serv.expanse) {
                                    let expanseCondition = false;
                                    if ((expanseDate.getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1)) && (expanseDate.getFullYear() === today.getFullYear())) {
                                        expanseCondition = true;
                                    }
                                    expanse = expanseCondition ? expanse + serv.expanse : expanse;
                                }
                            });
                            if (moreObject.caCase === "Yes") {
                                add_caCommision += parseInt(moreObject.caCommission);
                            }
                        }
                    }
                } else if (moreObject.remainingPayments.length !== 0 && (moreObject.bdeName === data.ename || moreObject.bdmName === data.ename)) {
                    let remainingExpanseCondition = moreObject.remainingPayments.some(item => new Date(item.paymentDate).getMonth() === (today.getMonth() === 0 ? 11 : today.getMonth() - 1));

                    if (remainingExpanseCondition) {
                        const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
                        const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
                        moreObject.services.forEach(serv => {
                            if (serv.expanseDate && new Date(serv.expanseDate) >= startDate && new Date(serv.expanseDate) <= endDate) {
                                if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by") {
                                    remainingMoreExpense += serv.expanse / 2;
                                } else if (moreObject.bdeName === moreObject.bdmName) {
                                    remainingMoreExpense += serv.expanse;
                                } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by" && moreObject.bdemName === data.ename) {
                                    remainingMoreExpense += serv.expanse;
                                }
                            }
                        });
                    }
                    moreObject.remainingPayments.map((remainingObj) => {
                        let condition = false;
                        if ((new Date(remainingObj.paymentDate).getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1))) {
                            condition = true;
                        }
                        if (condition) {
                            const findService = moreObject.services.find((services) => services.serviceName === remainingObj.serviceName)
                            const tempAmount = findService.withGST ? Math.round(remainingObj.receivedPayment) / 1.18 : Math.round(remainingObj.receivedPayment);
                            if (moreObject.bdeName === moreObject.bdmName) {
                                remainingAmount += Math.round(tempAmount);
                            } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by") {
                                remainingAmount += Math.round(tempAmount) / 2;
                            } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by") {
                                if (moreObject.bdeName === data.ename) {
                                    remainingAmount += Math.round(tempAmount);
                                }
                            }
                        }
                    })
                }
            })
        })

        achievedAmount = Math.round(achievedAmount + remainingAmount + add_caCommision);
        expanse = Math.round(expanse + remainingExpense + remainingMoreExpense);
        const totalAchievedAmount = achievedAmount - expanse;

        const achievement = achievedAmount + Math.round(remainingAmount) - expanse - remainingExpense - remainingMoreExpense - add_caCommision - 1;
        //console.log("totalAchievedRevenue is :", achievement);
        setAchievedAmount(achievement);
        return achievement;
    };


    useEffect(() => {
        functionCalculateAchievedRevenue();
    }, [redesignedData]);
    const fetchEmployeeData = async () => {
        try {
            const response = await axios.get(`${secretKey}/employee/einfo`)
            const tempData = response.data;
        } catch (error) {
            console.log("Error")

        }
    }

    const fetchPerformanceData = async () => {
        try {
            const response = await axios.get(`${secretKey}/employee/achieved-details/${data.ename}`)
            console.log("response for performance", response.data)
            console.log("performance report")
        } catch (error) {
            console.log("Error fetching data", error.message)
        }

    }

    useEffect(() => {
        if (data.ename) {
            fetchEmployeeData();
            fetchPerformanceData();
        }

    }, [data.ename])

    const today = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonth = monthNames[today.getMonth()];
    const targetDetailsLength = data.targetDetails?.length || 0;
    const sortedTargetDetails = data.targetDetails ? data.targetDetails.sort((a, b) => {
        const monthA = monthNames.indexOf(a.month); // Get index of month
        const monthB = monthNames.indexOf(b.month);

        // Compare years first, then months
        return b.year - a.year || monthB - monthA; // descending order
    }) : [];

    console.log(sortedTargetDetails)


    return (
        <>
            <div className="dash-card">
                {/* <button onClick={() => addPerformance()}>Submit Performance</button> */}
                <div className="dash-card-head d-flex align-items-center justify-content-between">
                    <h2 className="m-0">Performance Report</h2>
                </div>
                <div className="dash-card-body">
                    <div className="table table-responsive dash  m-0" style={{ maxHeight: '231px' }}>
                        <table className="table table-vcenter top_5_table table-nowrap dash-strip">
                            <thead>
                                <tr className="tr-sticky">
                                    <th>Month</th>
                                    <th id='my-center'>Target</th>
                                    <th>Achievement</th>
                                    <th>Ratio</th>
                                    <th>Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.targetDetails ? (
                                    sortedTargetDetails
                                        .filter((perData) => perData.month !== currentMonth) // Exclude the current month
                                        .map((perData, index) => (
                                            <tr key={`${index + 1}`}>
                                                <td>{`${perData.month} - ${String(perData.year).slice(-2)}`}</td>
                                                <td id='my-center'>₹{new Intl.NumberFormat('en-IN').format(perData.amount)}</td>
                                                <td>₹{new Intl.NumberFormat('en-IN').format(perData.achievedAmount)}</td>
                                                <td>{Math.round(perData.ratio)}%</td>
                                                <td>{perData.result}</td>
                                            </tr>
                                        ))
                                ) : (
                                    <div className="if-n0-dash-data text-center">
                                        <Nodata />
                                    </div>
                                )}
                            </tbody>
                            <tfoot>
                                <tr style={{ position: "sticky", bottom: '0px', padding: '6px 6px' }}>
                                    <td>{targetDetailsLength - 1}</td>
                                    <td id='my-center'>
                                        ₹ {new Intl.NumberFormat('en-IN').format(
                                            data.targetDetails?.filter((perData) => perData.month !== currentMonth)
                                                .reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0) || 0
                                        )}
                                    </td>
                                    <td>
                                        ₹ {new Intl.NumberFormat('en-IN').format(
                                            data.targetDetails?.filter((perData) => perData.month !== currentMonth)
                                                .reduce((acc, curr) => acc + parseFloat(curr.achievedAmount || 0), 0) || 0
                                        )}
                                    </td>
                                    <td>
                                        {(() => {
                                            const totalAmount = data.targetDetails?.filter((perData) => perData.month !== currentMonth)
                                                .reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0) || 0;

                                            const totalAchieved = data.targetDetails?.filter((perData) => perData.month !== currentMonth)
                                                .reduce((acc, curr) => acc + parseFloat(curr.achievedAmount || 0), 0) || 0;

                                            return totalAmount > 0 ? `${Math.round((totalAchieved / totalAmount) * 100)}%` : '0%';
                                        })()}
                                    </td>
                                    <td>
                                        {(() => {
                                            const totalAchieved = data.targetDetails?.filter((perData) => perData.month !== currentMonth)
                                                .reduce((acc, curr) => acc + parseFloat(curr.achievedAmount || 0), 0) || 0;

                                            const totalAmount = data.targetDetails?.filter((perData) => perData.month !== currentMonth)
                                                .reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0) || 0;

                                            const ratio = totalAmount > 0 ? totalAchieved / totalAmount : 0;

                                            if (ratio >= 2.49) return "Exceptional";
                                            if (ratio >= 2.0) return "Outstanding";
                                            if (ratio >= 1.5) return "Extraordinary";
                                            if (ratio >= 1.0) return "Excellent";
                                            if (ratio >= 0.75) return "Good";
                                            if (ratio >= 0.6) return "Average";
                                            if (ratio >= 0.4) return "Below Average";
                                            return "Poor";
                                        })()}
                                    </td>
                                </tr>
                            </tfoot>

                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EmployeePerformanceReport
