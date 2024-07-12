import axios from 'axios';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Nodata from '../../components/Nodata';

function EmployeePerformanceReport({ redesignedData, data }) {

    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const [Filterby, setFilterby] = useState("This Month");
    // console.log("Data :", data);
    // console.log("redesigned", redesignedData);

    const [targetDetails, setTargetDetails] = useState([]);
    const [achievedAmount, setAchievedAmount] = useState(0);
    const [dataSent, setDataSent] = useState(false);
    const [performanceData, setPerformanceData] = useState([]);

    useEffect(() => {
        if (data && data.targetDetails && data.targetDetails.length !== 0) {
            setTargetDetails(data.targetDetails);
        } else {
            setTargetDetails([
                {
                    year: "",
                    month: "",
                    amount: 0,
                },
            ]);
        }
    }, [data]); // Ensure this useEffect runs whenever `data` changes


    //console.log("Target Details is :", targetDetails);

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

    // console.log("Achivement amount from useState :", achievedAmount);


    const addPerformance = async () => {
        try {
            if (dataSent) {
                console.log("Performance data already sent.");
                return;
            }

            // Filter out target details for the previous month
            const today = moment();
            const previousMonth = today.clone().subtract(1, 'months').format('MMMM'); // Get full name of previous month
            const previousYear = today.clone().subtract(1, 'months').year(); // Get year of previous month

            const filteredTargets = targetDetails.filter(target => {
                return target.month === previousMonth && parseInt(target.year) === previousYear;
            });

            //console.log("Filtered data is :", filteredTargets);

            if (filteredTargets.length === 0) {
                console.log("No target details found for the previous month.");
                return;
            }

            // Prepare the payload for the update API
            const payload = {
                targetDetails: filteredTargets.map(target => ({
                    month: `${target.month}-${target.year}`, // Combine month and year
                    target: parseFloat(target.amount) || 0,
                    achievement: achievedAmount,
                })),
                email: data.email,
                // Add any other necessary fields like achievement
            };

            // Use axios.put to call the editPerformanceReport API
            const response = await axios.put(`${secretKey}/employee/editPerformanceReport/${data._id}`, payload);
            console.log("Data sent successfully:", response.data.data);
            setDataSent(true); // Set dataSent to true after successful data submission
        } catch (error) {
            console.log("Error sending data:", error);
        }
    };


    const today = moment();
    const currentMonth = today.month(); // Use moment.js to get the current month as a number
    //console.log("Current month:", currentMonth);
    useEffect(() => {
        // Calculate the next run date on the 1st of the next month
        let nextRunDate = today.clone().startOf('month'); // Set to the 1st of current month

        if (!today.isSame(nextRunDate, 'day')) {
            nextRunDate.add(1, 'months'); // Move to the 1st of next month if today is not the 1st
        }

        //console.log("Next running date is:", nextRunDate.format('YYYY-MM-DD'));

        // Calculate milliseconds until next run date
        const delay = nextRunDate.diff(today);

        // Set timeout to trigger addPerformance at nextRunDate
        const timer = setTimeout(() => {
            addPerformance();
        }, delay);

        // Cleanup function to clear timeout if component unmounts
        return () => clearTimeout(timer);
    }, [currentMonth]); // Trigger useEffect when the current month changes


    const fetchPerformanceData = async () => {
        try {
            const response = await axios.get(`${secretKey}/employee/fetchPerformanceReport/${data._id}`);
            setPerformanceData(response.data.data);
            //console.log("Performance data is :", response.data.data);            
        } catch (error) {
            console.log("Error to fetch performance data", error);
        }
    };

    useEffect(() => {
        fetchPerformanceData();
    }, [data]);

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
                                    <th>Target</th>
                                    <th>Achievement</th>
                                    <th>Ratio</th>
                                    <th>Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                {performanceData.length !== 0 ? (
                                    performanceData.map((perData) => {
                                        return perData.targetDetails.map((detail, index) => {
                                            return (
                                                <tr key={`${perData.empId}-${index}`}>
                                                    <td>{detail.month}</td>
                                                    <td>{detail.target}</td>
                                                    <td>{detail.achievement}</td>
                                                    <td>{detail.ratio}</td>
                                                    <td>{detail.result}</td>
                                                </tr>
                                            );
                                        });
                                    })
                                ) : (
                                    <div className="if-n0-dash-data text-center">
                                        <Nodata />
                                    </div>
                                )}

                                {/* <tr>
                                    <td><b>Jun-24</b></td>
                                    <td>₹ 60,000</td>
                                    <td>₹ 35,030 </td>
                                    <td>40%</td>
                                    <td>Poor</td>
                                </tr>
                                <tr>
                                    <td><b>May-24</b></td>
                                    <td>₹ 60,000</td>
                                    <td>₹ 35,030 </td>
                                    <td>60%</td>
                                    <td>Below Average</td>
                                </tr>
                                <tr>
                                    <td><b>Apr-24</b></td>
                                    <td>₹ 60,000</td>
                                    <td>₹ 35,030 </td>
                                    <td>74%</td>
                                    <td>Average</td>
                                </tr>
                                <tr>
                                    <td><b>Mar-24</b></td>
                                    <td>₹ 60,000</td>
                                    <td>₹ 35,030 </td>
                                    <td>99%</td>
                                    <td>Good</td>
                                </tr>
                                <tr>
                                    <td><b>Feb-24</b></td>
                                    <td>₹ 60,000</td>
                                    <td>₹ 35,030 </td>
                                    <td>149%</td>
                                    <td>Excellent</td>
                                </tr>
                                <tr>
                                    <td><b>Jan-24</b></td>
                                    <td>₹ 60,000</td>
                                    <td>₹ 35,030 </td>
                                    <td>199%</td>
                                    <td>Extraordinary</td>
                                </tr>
                                <tr>
                                    <td><b>Dec-23</b></td>
                                    <td>₹ 60,000</td>
                                    <td>₹ 35,030 </td>
                                    <td>251%</td>
                                    <td>Exceptional</td>
                                </tr>
                                <tr>
                                    <td><b>Nov-23</b></td>
                                    <td>₹ 60,000</td>
                                    <td>₹ 35,030 </td>
                                    <td>249%</td>
                                    <td>Outstanding</td>
                                </tr> */}
                            </tbody>
                            {/* <tfoot>
                                <tr style={{ position: "sticky", bottom: '0px', padding: '6px 6px' }}>
                                    <td><b>12 Mon</b></td>
                                    <td>₹ 60,000</td>
                                    <td>₹ 35,030 </td>
                                    <td>249%</td>
                                    <td>Outstanding</td>
                                </tr>
                            </tfoot> */}
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EmployeePerformanceReport
