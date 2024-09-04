import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import ClipLoader from 'react-spinners/ClipLoader';
import Nodata from '../../components/Nodata';

function RemainingServiceAnalysis() {
    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const currentYear = new Date().getFullYear();
    const currentMonth = format(new Date(), 'MMMM'); // e.g., 'August'

    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [isLoading, setIsLoading] = useState(false);
    const [bookingData, setBookingData] = useState([]);

    const formatAmount = (amount) => {
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

    // Combine total of all services whose names start with ISO Certificate :
    const getServiceAnalysisData = () => {
        const serviceAnalysis = {};

        const processServiceData = (booking, service) => {
            const serviceNameKey = service.serviceName.startsWith("ISO Certificate") ? "ISO Certificate" : service.serviceName;

            if (!serviceAnalysis[serviceNameKey]) {
                serviceAnalysis[serviceNameKey] = {
                    timesSold: 0,
                    totalRemainingAmount: 0,
                    firstPayment: 0,
                    secondPayment: 0,
                    thirdPayment: 0,
                    totalReceived: 0,
                    totalRemainingReceived: 0,
                    remainingAmount: 0,
                };
            }

            // Increment the count of services sold
            serviceAnalysis[serviceNameKey].timesSold += 1;

            // Calculate the payment values
            const firstPayment = service.withGST ? service.secondPayment / 1.18 : service.secondPayment;
            const thirdPayment = service.withGST ? service.thirdPayment / 1.18 : service.thirdPayment;
            const secondPayment = service.withGST ? service.fourthPayment / 1.18 : service.fourthPayment;

            // Sum of remaining payments
            const remainingAmount = secondPayment + thirdPayment;

            serviceAnalysis[serviceNameKey].totalRemainingAmount += remainingAmount;
            serviceAnalysis[serviceNameKey].secondPayment += firstPayment;
            serviceAnalysis[serviceNameKey].thirdPayment += secondPayment;
            serviceAnalysis[serviceNameKey].fourthPayment += thirdPayment;
            serviceAnalysis[serviceNameKey].totalReceived += service.secondPayment + service.thirdPayment + service.fourthPayment;
            serviceAnalysis[serviceNameKey].remainingAmount += remainingAmount;
        };

        const processBooking = (booking) => {
            const bookingMonth = format(new Date(booking.bookingDate), 'MMMM');
            const bookingYear = new Date(booking.bookingDate).getFullYear();

            if (bookingMonth === selectedMonth && bookingYear === selectedYear) {
                booking.services.forEach(service => processServiceData(booking, service));
            }
        };

        bookingData.forEach(booking => {
            processBooking(booking);

            booking.moreBookings.forEach(moreBooking => {
                processBooking(moreBooking);
            });
        });

        return Object.entries(serviceAnalysis).map(([serviceName, data], index) => {
            return {
                id: index + 1,
                serviceName,
                timesSold: data.timesSold,
                totalRemainingAmount: data.totalRemainingAmount,
                rps: `First: ₹ ${formatAmount(data.firstPayment)}, Second: ₹ ${formatAmount(data.secondPayment)}, Third: ₹ ${formatAmount(data.thirdPayment)}`,
                totalRemainingReceived: data.totalReceived,
                remainingAmount: data.remainingAmount,
            };
        });
    };

    const serviceAnalysisData = getServiceAnalysisData();

    // Calculate totals for footer
    const totalTimesSold = serviceAnalysisData.reduce((total, service) => total + service.timesSold, 0);
    const totalRemainingAmount = serviceAnalysisData.reduce((total, service) => total + service.totalRemainingAmount, 0);
    const totalFirstPayment = serviceAnalysisData.reduce((total, service) => total + service.firstPayment, 0);
    const totalSecondPayment = serviceAnalysisData.reduce((total, service) => total + service.secondPayment, 0);
    const totalThirdPayment = serviceAnalysisData.reduce((total, service) => total + service.thirdPayment, 0);
    const totalRemainingReceived = serviceAnalysisData.reduce((total, service) => total + service.totalRemainingReceived, 0);
    const totalRemainingAmountFooter = serviceAnalysisData.reduce((total, service) => total + service.remainingAmount, 0);


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
                                <th>No. Of Count</th>
                                <th>Total Remaining Amount</th>
                                <th>R.P.S</th>
                                <th>Total Remaining Received</th>
                                <th>Remainign Amount</th>
                            </tr>
                        </thead>

                        <tbody>
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
                        </tfoot>

                        {/* {isLoading ? (
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
                        ) : serviceAnalysisData?.length !== 0 ? (
                            <>
                                <tbody>
                                    {serviceAnalysisData?.map((service, index) => (
                                        <tr key={index}>
                                            <td>{service.id}</td>
                                            <td>{service.serviceName}</td>
                                            <td>{service.timesSold}</td>
                                            <td>₹ {formatAmount(service.totalRemainingAmount.toFixed(2))}</td>
                                            <td>{service.rps}</td>
                                            <td>₹ {formatAmount(service.totalRemainingReceived.toFixed(2))}</td>
                                            <td>₹ {formatAmount(service.remainingAmount.toFixed(2))}</td>
                                        </tr>
                                    ))}
                                </tbody>

                                <tfoot className="admin-dash-tbl-tfoot">
                                    <tr style={{ fontWeight: 500 }}>
                                        <td>Total</td>
                                        <td>{serviceAnalysisData.length}</td>
                                        <td>{totalTimesSold}</td>
                                        <td>₹ {formatAmount(totalRemainingAmount.toFixed(2))}</td>
                                        <td>First: ₹{formatAmount(totalFirstPayment)}, Second: ₹{formatAmount(totalSecondPayment)}, Third: ₹{formatAmount(totalThirdPayment)}</td>
                                        <td>₹ {formatAmount(totalRemainingReceived.toFixed(2))}</td>
                                        <td>₹ {formatAmount(totalRemainingAmountFooter.toFixed(2))}</td>
                                    </tr>
                                </tfoot>
                            </>
                        ) : (
                            <tbody>
                                <tr>
                                    <td colSpan="7" className="text-center"><Nodata /></td>
                                </tr>
                            </tbody>
                        )} */}

                    </table>
                </div>
            </div>
        </div>
    )
}

export default RemainingServiceAnalysis;