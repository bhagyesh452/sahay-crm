import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import ClipLoader from 'react-spinners/ClipLoader';
import Calendar from "@mui/icons-material/Event";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import Nodata from '../../components/Nodata';

function RemainingServiceAnalysis() {
    const secretKey = process.env.REACT_APP_SECRET_KEY;

    // const currentYear = new Date().getFullYear();
    // const currentMonth = format(new Date(), 'MMMM'); // e.g., 'August'

    // const [selectedYear, setSelectedYear] = useState(currentYear);
    // const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [isLoading, setIsLoading] = useState(false);
    const [bookingData, setBookingData] = useState([]);

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-IN', { minimumFractionDigits: 0 }).format(amount);
    };

    // const handleYearChange = (e) => {
    //     setSelectedYear(Number(e.target.value));
    // };

    // const handleMonthChange = (e) => {
    //     setSelectedMonth(e.target.value);
    // };

    // const years = [];
    // for (let year = 2020; year <= currentYear; year++) {
    //     years.push(year);
    // }

    const handleDateRange = () => { };

    const fetchBookings = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${secretKey}/bookings/redesigned-final-leadData`);
            console.log("Fetched bookings are :", res.data);
            setBookingData(res.data);
        } catch (error) {
            console.log("Error fetching bookings data", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchBookings();
    }, []);

    const shortcutsItems = [
        {
            label: "This Week",
            getValue: () => {
                const today = dayjs();
                return [today.startOf("week"), today.endOf("week")];
            },
        },
        {
            label: "Last Week",
            getValue: () => {
                const today = dayjs();
                const prevWeek = today.subtract(7, "day");
                return [prevWeek.startOf("week"), prevWeek.endOf("week")];
            },
        },
        {
            label: "Last 7 Days",
            getValue: () => {
                const today = dayjs();
                return [today.subtract(7, "day"), today];
            },
        },
        {
            label: "Current Month",
            getValue: () => {
                const today = dayjs();
                return [today.startOf("month"), today.endOf("month")];
            },
        },
        { label: "Reset", getValue: () => [null, null] },
    ];

    // Combine total of all services whose names start with ISO Certificate. Display data with gst amount :
    // const getServiceAnalysisData = () => {
    //     const serviceAnalysis = {};

    //     const processServiceData = (service, remainingPayment) => {
    //         const serviceNameKey = service.serviceName.startsWith("ISO Certificate")
    //             ? "ISO Certificate"
    //             : service.serviceName;

    //         if (!serviceAnalysis[serviceNameKey]) {
    //             serviceAnalysis[serviceNameKey] = {
    //                 timesSold: 0,
    //                 totalRemainingAmount: 0,
    //                 totalRemainingReceived: 0,
    //                 remainingAmount: 0,
    //             };
    //         }

    //         // Increment the count of services sold
    //         serviceAnalysis[serviceNameKey].timesSold += 1;

    //         let totalRemainingAmount = 0;
    //         let totalRemainingReceived = 0;

    //         // Calculate total remaining amount based on paymentTerms and withGST conditions
    //         if (service.paymentTerms === "two-part") {
    //             const secondPayment = service.withGST ? (service.secondPayment || 0) / 1.18 : service.secondPayment || 0;
    //             const thirdPayment = service.withGST ? (service.thirdPayment || 0) / 1.18 : service.thirdPayment || 0;
    //             const fourthPayment = service.withGST ? (service.fourthPayment || 0) / 1.18 : service.fourthPayment || 0;
    //             totalRemainingAmount = secondPayment + thirdPayment + fourthPayment;
    //         }

    //         totalRemainingReceived = service.withGST ? remainingPayment.receivedPayment/1.18 : remainingPayment.receivedPayment

    //         // Update the service analysis data with payment details
    //         serviceAnalysis[serviceNameKey].totalRemainingAmount += totalRemainingAmount;
    //         serviceAnalysis[serviceNameKey].totalRemainingReceived += totalRemainingReceived;
    //         serviceAnalysis[serviceNameKey].remainingAmount += totalRemainingAmount - totalRemainingReceived;
    //     };

    //     const processBooking = (booking) => {
    //         booking.services.forEach(service => {
    //             // Filter remaining payments by the selected month and year
    //             booking.remainingPayments.forEach(remainingPayment => {
    //                 const paymentDate = new Date(remainingPayment.paymentDate);
    //                 const paymentMonth = format(paymentDate, 'MMMM');
    //                 const paymentYear = paymentDate.getFullYear();

    //                 if (paymentMonth === selectedMonth && paymentYear === selectedYear && remainingPayment.serviceName === service.serviceName) {
    //                     processServiceData(service, remainingPayment);
    //                 }
    //             });
    //         });
    //     };

    //     // Process all bookings and more bookings
    //     bookingData.forEach(booking => {
    //         processBooking(booking);
    //         booking.moreBookings.forEach(moreBooking => {
    //             processBooking(moreBooking);
    //         });
    //     });

    //     // Return the data in the desired format
    //     return Object.entries(serviceAnalysis).map(([serviceName, data], index) => {
    //         return {
    //             id: index + 1,
    //             serviceName,
    //             timesSold: data.timesSold,
    //             totalRemainingAmount: data.totalRemainingAmount,
    //             totalRemainingReceived: data.totalRemainingReceived,
    //             remainingAmount: data.remainingAmount,
    //         };
    //     });
    // };

    // const serviceAnalysisData = getServiceAnalysisData();

    // // Calculate totals for the footer
    // const totalTimesSold = serviceAnalysisData.reduce((total, service) => total + service.timesSold, 0);
    // const totalRemainingAmount = serviceAnalysisData.reduce((total, service) => total + service.totalRemainingAmount, 0);
    // const totalRemainingReceived = serviceAnalysisData.reduce((total, service) => total + service.totalRemainingReceived, 0);
    // const totalRemainingAmountFooter = serviceAnalysisData.reduce((total, service) => total + service.remainingAmount, 0);


    // Combine total of all services whose names start with ISO Certificate. Display data without gst amount :
    // const getServiceAnalysisData = () => {
    //     const serviceAnalysis = {};

    //     const processServiceData = (service, remainingPayment) => {
    //         const serviceNameKey = service.serviceName.startsWith("ISO Certificate")
    //             ? "ISO Certificate"
    //             : service.serviceName;

    //         if (!serviceAnalysis[serviceNameKey]) {
    //             serviceAnalysis[serviceNameKey] = {
    //                 timesSold: 0,
    //                 totalRemainingAmount: 0,
    //                 totalRemainingReceived: 0,
    //                 remainingAmount: 0,
    //             };
    //         }

    //         // Increment the count of services sold
    //         serviceAnalysis[serviceNameKey].timesSold += 1;

    //         let totalRemainingAmount = 0;
    //         let totalRemainingReceived = 0;

    //         // Calculate total remaining amount based on paymentTerms and withGST conditions
    //         if (service.paymentTerms === "two-part") {
    //             const secondPayment = service.withGST ? (service.secondPayment || 0) / 1.18 : service.secondPayment || 0;
    //             const thirdPayment = service.withGST ? (service.thirdPayment || 0) / 1.18 : service.thirdPayment || 0;
    //             const fourthPayment = service.withGST ? (service.fourthPayment || 0) / 1.18 : service.fourthPayment || 0;
    //             totalRemainingAmount = secondPayment + thirdPayment + fourthPayment;
    //         }

    //         totalRemainingReceived = service.withGST ? remainingPayment.receivedPayment / 1.18 : remainingPayment.receivedPayment;

    //         // Update the service analysis data with payment details
    //         serviceAnalysis[serviceNameKey].totalRemainingAmount += totalRemainingAmount;
    //         serviceAnalysis[serviceNameKey].totalRemainingReceived += totalRemainingReceived;
    //         serviceAnalysis[serviceNameKey].remainingAmount += totalRemainingAmount - totalRemainingReceived;
    //     };

    //     const processBooking = (booking) => {
    //         booking.services.forEach(service => {
    //             booking.remainingPayments.forEach(remainingPayment => {
    //                 if (remainingPayment.serviceName === service.serviceName) {
    //                     processServiceData(service, remainingPayment);
    //                 }
    //             });
    //         });
    //     };

    //     // Process all bookings and more bookings without filtering by month and year
    //     bookingData.forEach(booking => {
    //         processBooking(booking);
    //         booking.moreBookings.forEach(moreBooking => {
    //             processBooking(moreBooking);
    //         });
    //     });

    //     // Return the data in the desired format
    //     return Object.entries(serviceAnalysis).map(([serviceName, data], index) => {
    //         return {
    //             id: index + 1,
    //             serviceName,
    //             timesSold: data.timesSold,
    //             totalRemainingAmount: data.totalRemainingAmount,
    //             totalRemainingReceived: data.totalRemainingReceived,
    //             remainingAmount: data.remainingAmount,
    //         };
    //     });
    // };

    // const serviceAnalysisData = getServiceAnalysisData();

    // // Calculate totals for the footer
    // const totalTimesSold = serviceAnalysisData.reduce((total, service) => total + service.timesSold, 0);
    // const totalRemainingAmount = serviceAnalysisData.reduce((total, service) => total + service.totalRemainingAmount, 0);
    // const totalRemainingReceived = serviceAnalysisData.reduce((total, service) => total + service.totalRemainingReceived, 0);
    // const totalRemainingAmountFooter = serviceAnalysisData.reduce((total, service) => total + service.remainingAmount, 0);



    const getServiceAnalysisData = () => {
        const serviceAnalysis = {};

        const processServiceData = (service, remainingPayment) => {
            const serviceNameKey = service.serviceName.startsWith("ISO Certificate")
                ? "ISO Certificate"
                : service.serviceName;

            if (!serviceAnalysis[serviceNameKey]) {
                serviceAnalysis[serviceNameKey] = {
                    timesSold: 0,
                    totalRemainingAmount: 0,
                    // totalRemainingReceived: 0,
                    // remainingAmount: 0,
                    totalSecondPayment: 0, // Track second payment
                    totalThirdPayment: 0,  // Track third payment
                    totalFourthPayment: 0, // Track fourth payment
                };
            }

            // Increment the count of services sold
            serviceAnalysis[serviceNameKey].timesSold += 1;

            let totalRemainingAmount = 0;
            let totalRemainingReceived = 0;

            // Calculate total remaining amount based on paymentTerms and withGST conditions
            let secondPayment = 0;
            let thirdPayment = 0;
            let fourthPayment = 0;

            if (service.paymentTerms === "two-part") {
                secondPayment = service.withGST ? (service.secondPayment || 0) / 1.18 : service.secondPayment || 0;
                thirdPayment = service.withGST ? (service.thirdPayment || 0) / 1.18 : service.thirdPayment || 0;
                fourthPayment = service.withGST ? (service.fourthPayment || 0) / 1.18 : service.fourthPayment || 0;
                totalRemainingAmount = secondPayment + thirdPayment + fourthPayment;
            }

            // totalRemainingReceived = service.withGST ? remainingPayment.receivedPayment / 1.18 : remainingPayment.receivedPayment;

            // Update the service analysis data with payment details
            serviceAnalysis[serviceNameKey].totalRemainingAmount += totalRemainingAmount;
            // serviceAnalysis[serviceNameKey].totalRemainingReceived += totalRemainingReceived;
            // serviceAnalysis[serviceNameKey].remainingAmount += totalRemainingAmount - totalRemainingReceived;

            // Update the specific payments
            serviceAnalysis[serviceNameKey].totalSecondPayment += secondPayment;
            serviceAnalysis[serviceNameKey].totalThirdPayment += thirdPayment;
            serviceAnalysis[serviceNameKey].totalFourthPayment += fourthPayment;
        };

        const processBooking = (booking) => {
            booking.services.forEach(service => {
                booking.remainingPayments.forEach(remainingPayment => {
                    if (remainingPayment.serviceName === service.serviceName) {
                        // if (service.serviceName && remainingPayment.serviceName === "Website Development") {
                        //     console.log('Remaining Payment for Website Development:', service);
                        // }
                        processServiceData(service, remainingPayment);
                    }
                });
            });
        };

        // Process all bookings and more bookings without filtering by month and year
        bookingData.forEach(booking => {
            processBooking(booking);
            booking.moreBookings.forEach(moreBooking => {
                processBooking(moreBooking);
            });
        });

        // Return the data in the desired format
        return Object.entries(serviceAnalysis).map(([serviceName, data], index) => {
            return {
                id: index + 1,
                serviceName,
                timesSold: data.timesSold,
                totalRemainingAmount: data.totalRemainingAmount,
                // totalRemainingReceived: data.totalRemainingReceived,
                // remainingAmount: data.remainingAmount,
                totalSecondPayment: data.totalSecondPayment,
                totalThirdPayment: data.totalThirdPayment,
                totalFourthPayment: data.totalFourthPayment,
            };
        });
    };

    const serviceAnalysisData = getServiceAnalysisData();

    // Calculate totals for the footer
    const totalTimesSold = serviceAnalysisData.reduce((total, service) => total + service.timesSold, 0);
    const totalRemainingAmount = serviceAnalysisData.reduce((total, service) => total + service.totalRemainingAmount, 0);
    // const totalRemainingReceived = serviceAnalysisData.reduce((total, service) => total + service.totalRemainingReceived, 0);
    // const totalRemainingAmountFooter = serviceAnalysisData.reduce((total, service) => total + service.remainingAmount, 0);

    const totalSecondPayment = serviceAnalysisData.reduce((total, service) => total + service.totalSecondPayment, 0);
    const totalThirdPayment = serviceAnalysisData.reduce((total, service) => total + service.totalThirdPayment, 0);
    const totalFourthPayment = serviceAnalysisData.reduce((total, service) => total + service.totalFourthPayment, 0);


    return (
        <div className="card">
            <div className="card-header p-1 employeedashboard d-flex align-items-center justify-content-between">
                <div className="dashboard-title pl-1"  >
                    <h2 className="m-0">
                        Remaining Payment Service Analysis
                    </h2>
                </div>
                <div className="d-flex align-items-center pr-1">
                    <div className="filter-booking mr-1 d-flex align-items-center">
                        <div className='d-flex align-items-center justify-content-between'>
                            {/* <div className='form-group ml-1'>
                                <select className='form-select' value={selectedYear} onChange={handleYearChange}>
                                    <option disabled>--Select Year--</option>
                                    {years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            <div className='form-group ml-1'>
                                <select className='form-select' value={selectedMonth} onChange={handleMonthChange}>
                                    <option disabled>--Select Month--</option>
                                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(month => (
                                        <option key={month} value={month}>{month}</option>
                                    ))}
                                </select>
                            </div> */}

                            <div className="data-filter">
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs} >
                                    <DemoContainer
                                        components={["SingleInputDateRangeField"]} sx={{
                                            padding: '0px',
                                            with: '220px'
                                        }}  >
                                        <DateRangePicker
                                            className="form-control my-date-picker form-control-sm p-0"
                                            onChange={handleDateRange}
                                            slots={{ field: SingleInputDateRangeField }}
                                            slotProps={{
                                                shortcuts: {
                                                    items: shortcutsItems,
                                                },
                                                actionBar: { actions: [] },
                                                textField: {
                                                    InputProps: { endAdornment: <Calendar /> },
                                                },
                                            }}
                                            calendars={1}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-body">
                <div id="table-default" className="row tbl-scroll">
                    <table className="table-vcenter table-nowrap admin-dash-tbl"  >

                        <thead className="admin-dash-tbl-thead">
                            <tr>
                                <th>Sr. No</th>
                                <th>Service Name</th>
                                <th>No. Of Count</th>
                                <th>R.P.S</th>
                                <th>Total Remaining Amount</th>
                                {/* <th>Total Remaining Received</th>
                                <th>Remainign Amount</th> */}
                            </tr>
                        </thead>

                        {/* <tbody>
                            <tr>
                                <td>1</td>
                                <td>Seed Funding</td>
                                <td>2</td>
                                <td>₹ 8000</td>
                                <td>First : ₹ 8000, Second : ₹ 0, Third : ₹ 0</td>
                                <td>₹ 8000</td>
                                <td>₹ 0</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Startup India Certificate</td>
                                <td>3</td>
                                <td>₹ 15000</td>
                                <td>First : ₹ 8000, Second : ₹ 4000, Third : ₹ 0</td>
                                <td>₹ 12000</td>
                                <td>₹ 3000</td>
                            </tr>
                        </tbody>

                        <tfoot className="admin-dash-tbl-tfoot">
                            <tr style={{ fontWeight: 500 }}>
                                <td>Total</td>
                                <td>2</td>
                                <td>5</td>
                                <td>₹ 23000</td>
                                <td>First : ₹ 16000, Second : ₹ 4000, Third : ₹ 0</td>
                                <td>₹ 20000</td>
                                <td>₹ 3000</td>
                            </tr>
                        </tfoot> */}

                        {isLoading ? (
                            <tbody>
                                <tr>
                                    <td colSpan="7" >
                                        <div className="LoaderTDSatyle w-100" >
                                            <ClipLoader
                                                color="lightgrey"
                                                currentDataLoading
                                                size={30}
                                                aria-label="Loading Spinner"
                                                data-testid="loader"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        ) : serviceAnalysisData?.length !== 0 ? (
                            <>
                                <tbody>
                                    {serviceAnalysisData?.map((service, index) => (
                                        <tr key={index}>
                                            <td>{service.id}</td>
                                            <td>{service.serviceName}</td>
                                            <td>{service.timesSold}</td>
                                            <td>
                                                <strong>Stage-1:</strong> ₹ {formatAmount(service.totalSecondPayment.toFixed(2))},
                                                <strong>Stage-2:</strong> ₹ {formatAmount(service.totalThirdPayment.toFixed(2))},
                                                <strong>Stage-3:</strong> ₹ {formatAmount(service.totalFourthPayment.toFixed(2))},
                                            </td>
                                            <td>₹ {formatAmount(service.totalRemainingAmount.toFixed(2))}</td>
                                            {/* <td>₹ {formatAmount(service.totalRemainingReceived.toFixed(2))}</td>
                                            <td>₹ {formatAmount(service.remainingAmount.toFixed(2))}</td> */}
                                        </tr>
                                    ))}
                                </tbody>

                                {/* <tfoot className="admin-dash-tbl-tfoot">
                                    <tr style={{ fontWeight: 500 }}>
                                        <td>Total</td>
                                        <td>{serviceAnalysisData.length}</td>
                                        <td>{totalTimesSold}</td>
                                        <td>Stage-1: ₹{formatAmount(totalSecondPayment.toFixed(2))}, Stage-2: ₹{formatAmount(totalThirdPayment.toFixed(2))}, Stage-3: ₹{formatAmount(totalFourthPayment.toFixed(2))}</td>
                                        <td>₹ {formatAmount(totalRemainingAmount.toFixed(2))}</td>
                                        <td>₹ {formatAmount(totalRemainingReceived.toFixed(2))}</td>
                                        <td>₹ {formatAmount(totalRemainingAmountFooter.toFixed(2))}</td>
                                    </tr>
                                </tfoot> */}
                            </>
                        ) : (
                            <tbody>
                                <tr>
                                    <td colSpan="7" className="text-center"><Nodata /></td>
                                </tr>
                            </tbody>
                        )}

                    </table>
                </div>
            </div>
        </div>
    )
}

export default RemainingServiceAnalysis;