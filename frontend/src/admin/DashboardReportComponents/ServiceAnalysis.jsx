import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import ClipLoader from 'react-spinners/ClipLoader';
import Nodata from '../../components/Nodata';

function ServiceAnalysis() {
    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const currentYear = new Date().getFullYear();
    const currentMonth = format(new Date(), 'MMMM'); // e.g., 'August'

    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [isLoading, setIsLoading] = useState(false);
    const [bookingData, setBookingData] = useState([]);

    const formatSalary = (amount) => {
        return new Intl.NumberFormat('en-IN', { minimumFractionDigits: 0 }).format(amount);
    };

    const handleYearChange = (e) => {
        setSelectedYear(Number(e.target.value));
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    const years = [];
    for (let year = 2020; year <= currentYear; year++) {
        years.push(year);
    }

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

    // const getServiceAnalysisData = () => {
    //     // Filter booking data by selected month and year
    //     const filteredData = bookingData.filter(booking => {
    //         const bookingMonth = format(new Date(booking.bookingDate), 'MMMM');
    //         const bookingYear = new Date(booking.bookingDate).getFullYear();
    //         return bookingMonth === selectedMonth && bookingYear === selectedYear;
    //     });

    //     // Initialize an object to store service analysis data
    //     const serviceAnalysis = {};

    //     filteredData.forEach(booking => {
    //         booking.services.forEach(service => {
    //             if (!serviceAnalysis[service.serviceName]) {
    //                 serviceAnalysis[service.serviceName] = {
    //                     timesSold: 0,
    //                     totalPayment: 0,
    //                     advancePayment: 0,
    //                     remainingPayment: 0,
    //                 };
    //             }

    //             // Update the service analysis data
    //             serviceAnalysis[service.serviceName].timesSold += 1;
    //             serviceAnalysis[service.serviceName].totalPayment += service.totalPaymentWOGST;
    //             serviceAnalysis[service.serviceName].advancePayment += service.firstPayment;

    //             // Handle payment terms
    //             if (service.paymentTerms === "Full Advanced") {
    //                 // Ensure totalPayment and advancePayment are the same
    //                 serviceAnalysis[service.serviceName].remainingPayment = 0;
    //                 serviceAnalysis[service.serviceName].advancePayment += service.totalPaymentWOGST;
    //             } else if (service.paymentTerms === "two-part") {
    //                 // Calculate remaining payment as the sum of second, third, and fourth payments
    //                 const secondPayment = service.secondPayment || 0;
    //                 const thirdPayment = service.thirdPayment || 0;
    //                 const fourthPayment = service.fourthPayment || 0;

    //                 serviceAnalysis[service.serviceName].remainingPayment += secondPayment + thirdPayment + fourthPayment;
    //             } else {
    //                 // Calculate remaining payment from remainingPayments array for other payment terms
    //                 booking.remainingPayments.forEach(remaining => {
    //                     if (remaining.serviceName === service.serviceName) {
    //                         serviceAnalysis[service.serviceName].remainingPayment += remaining.totalPayment;
    //                     }
    //                 });
    //             }
    //         });
    //     });

    //     return Object.entries(serviceAnalysis).map(([serviceName, data], index) => ({
    //         id: index + 1,
    //         serviceName,
    //         timesSold: data.timesSold,
    //         totalPayment: data.totalPayment,
    //         advancePayment: data.advancePayment,
    //         remainingPayment: data.remainingPayment,
    //         averageSellingPrice: data.totalPayment / data.timesSold || 0,
    //     }));
    // };



    const getServiceAnalysisData = () => {
        // Initialize an object to store service analysis data
        const serviceAnalysis = {};

        const processServiceData = (booking, service) => {
            if (!serviceAnalysis[service.serviceName]) {
                serviceAnalysis[service.serviceName] = {
                    timesSold: 0,
                    totalPayment: 0,
                    advancePayment: 0,
                    remainingPayment: 0,
                };
            }

            // Update the service analysis data
            serviceAnalysis[service.serviceName].timesSold += 1;
            serviceAnalysis[service.serviceName].totalPayment += service.totalPaymentWOGST;

            // Handle payment terms
            if (service.paymentTerms === "Full Advanced") {
                // Ensure totalPayment and advancePayment are the same
                serviceAnalysis[service.serviceName].remainingPayment = 0;
                serviceAnalysis[service.serviceName].advancePayment = service.totalPaymentWOGST;

            } else if (service.paymentTerms === "two-part") {
                // Deduct 18% GST if withGST is true
                const adjustedFirstPayment = service.withGST
                    ? service.firstPayment / 1.18   // Remove 18% GST from advance payment
                    : service.firstPayment;

                serviceAnalysis[service.serviceName].advancePayment += adjustedFirstPayment;

                // Calculate remaining payment as the sum of second, third, and fourth payments
                const secondPayment = service.secondPayment || 0;
                const thirdPayment = service.thirdPayment || 0;
                const fourthPayment = service.fourthPayment || 0;

                serviceAnalysis[service.serviceName].remainingPayment += (secondPayment + thirdPayment + fourthPayment) / 1.18; // Remove 18% GST from remaining payment
            } else {
                // Calculate remaining payment from remainingPayments array for other payment terms
                booking.remainingPayments.forEach(remaining => {
                    if (remaining.serviceName === service.serviceName) {
                        serviceAnalysis[service.serviceName].remainingPayment += remaining.totalPayment;
                    }
                });
            }
        };

        const processBooking = (booking) => {
            const bookingMonth = format(new Date(booking.bookingDate), 'MMMM');
            const bookingYear = new Date(booking.bookingDate).getFullYear();

            if (bookingMonth === selectedMonth && bookingYear === selectedYear) {
                booking.services.forEach(service => processServiceData(booking, service));
            }
        };

        // Process main booking data
        bookingData.forEach(booking => {
            processBooking(booking);

            // Process moreBookings array
            booking.moreBookings.forEach(moreBooking => {
                processBooking(moreBooking);
            });
        });

        return Object.entries(serviceAnalysis).map(([serviceName, data], index) => ({
            id: index + 1,
            serviceName,
            timesSold: data.timesSold,
            totalPayment: data.totalPayment,
            advancePayment: data.advancePayment,
            remainingPayment: data.remainingPayment,
            averageSellingPrice: data.totalPayment / data.timesSold || 0,
        }));
    };

    const serviceAnalysisData = getServiceAnalysisData();

    return (
        <div className="card">
            <div className="card-header p-1 employeedashboard d-flex align-items-center justify-content-between">
                <div className="dashboard-title pl-1"  >
                    <h2 className="m-0">
                        Service Analysis
                    </h2>
                </div>
                <div className="d-flex align-items-center pr-1">
                    <div className="filter-booking mr-1 d-flex align-items-center">
                        <div className='d-flex align-items-center justify-content-between'>
                            <div className='form-group ml-1'>
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
                                <th>Times Sold</th>
                                <th>Total Payment</th>
                                <th>Advance Payment</th>
                                <th>Remaining Payment</th>
                                <th>Average Selling Price</th>
                            </tr>
                        </thead>

                        {isLoading ? (
                            <tbody>
                                <tr>
                                    <td colSpan="11" >
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
                        ) : serviceAnalysisData.length !== 0 ? (
                            <tbody>
                                {serviceAnalysisData.map((service, index) => (
                                    <tr key={index}>
                                        <td>{service.id}</td>
                                        <td>{service.serviceName}</td>
                                        <td>{service.timesSold}</td>
                                        <td>₹ {formatSalary(service.totalPayment.toFixed(2))}</td>
                                        <td>₹ {formatSalary(service.advancePayment.toFixed(2))}</td>
                                        <td>₹ {formatSalary(service.remainingPayment.toFixed(2))}</td>
                                        <td>₹ {formatSalary(service.averageSellingPrice.toFixed(2))}</td>
                                    </tr>
                                ))}
                            </tbody>
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

export default ServiceAnalysis;