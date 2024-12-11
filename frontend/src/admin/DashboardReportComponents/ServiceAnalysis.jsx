import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import ClipLoader from 'react-spinners/ClipLoader';
import Nodata from '../../components/Nodata';
import RemainingServiceAnalysis from './RemainingServiceAnalysis';


function ServiceAnalysis() {

    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const currentYear = new Date().getFullYear();
    const currentMonth = format(new Date(), 'MMMM'); // e.g., 'August'

    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [expandedService, setExpandedService] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [bookingData, setBookingData] = useState([]);

    const toggleServiceDetails = (serviceName) => {
        setExpandedService(expandedService === serviceName ? null : serviceName);
    };

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
            // console.log("Fetched bookings are :", res.data);
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
    // const getServiceAnalysisData = () => {
    //     // Initialize an object to store service analysis data
    //     const serviceAnalysis = {};

    //     const processServiceData = (booking, service) => {

    //         console.log("Booking data is :", booking);

    //         // Standardize service name for "ISO Certificate" services
    //         const serviceNameKey = service.serviceName.startsWith("ISO Certificate") ? "ISO Certificate" : service.serviceName;

    //         // Initialize the service if not already in serviceAnalysis
    //         if (!serviceAnalysis[serviceNameKey]) {
    //             serviceAnalysis[serviceNameKey] = {
    //                 timesSold: 0,
    //                 totalPayment: 0,
    //                 advancePayment: 0,
    //                 remainingPaymentsArray: [], // Array to store remaining payments
    //                 serviceBriefDetails: [],    // Array to store individual BDE/BDM details
    //             };
    //         }

    //         // Update the service analysis data
    //         serviceAnalysis[serviceNameKey].timesSold += 1;
    //         serviceAnalysis[serviceNameKey].totalPayment += service.totalPaymentWOGST;

    //         // Add individual BDE and BDM details with the payment
    //         serviceAnalysis[serviceNameKey].serviceBriefDetails.push({
    //             bdeName: booking.bdeName,
    //             bdmName: booking.bdmName,
    //             amount: service.totalPaymentWOGST,
    //         });

    //         if (service.paymentTerms === "Full Advanced") {
    //             // Full advanced payment, no remaining payment
    //             serviceAnalysis[serviceNameKey].advancePayment += service.totalPaymentWOGST;

    //         } else if (service.paymentTerms === "two-part") {
    //             // Calculate advance payment (adjusted for GST if applicable)
    //             const adjustedFirstPayment = service.withGST
    //                 ? service.firstPayment / 1.18
    //                 : service.firstPayment;

    //             serviceAnalysis[serviceNameKey].advancePayment += adjustedFirstPayment;

    //             // Collect remaining payments for this service
    //             const secondPayment = service.withGST ? service.secondPayment / 1.18 : service.secondPayment;
    //             const thirdPayment = service.withGST ? service.thirdPayment / 1.18 : service.thirdPayment;
    //             const fourthPayment = service.withGST ? service.fourthPayment / 1.18 : service.fourthPayment;

    //             const remainingPayment = secondPayment + thirdPayment + fourthPayment;

    //             // Push the remaining payment to the array
    //             serviceAnalysis[serviceNameKey].remainingPaymentsArray.push(remainingPayment);
    //         }
    //     };

    //     const processBooking = (booking) => {
    //         const bookingMonth = format(new Date(booking.bookingDate), 'MMMM');
    //         const bookingYear = new Date(booking.bookingDate).getFullYear();

    //         if (bookingMonth === selectedMonth && bookingYear === selectedYear) {
    //             booking.services.forEach(service => processServiceData(booking, service));
    //         }
    //     };

    //     // Process main booking data
    //     bookingData.forEach(booking => {
    //         processBooking(booking);

    //         // Process moreBookings array
    //         booking.moreBookings.forEach(moreBooking => {
    //             processBooking(moreBooking);
    //         });
    //     });

    //     // Calculate total remaining payments for each service
    //     return Object.entries(serviceAnalysis).map(([serviceName, data], index) => {
    //         const totalRemainingPayment = data.remainingPaymentsArray.reduce((sum, payment) => sum + payment, 0);

    //         return {
    //             id: index + 1,
    //             serviceName,
    //             timesSold: data.timesSold,
    //             totalPayment: data.totalPayment,
    //             advancePayment: data.advancePayment,
    //             remainingPayment: totalRemainingPayment,  // Return the total remaining payment
    //             averageSellingPrice: data.totalPayment / data.timesSold || 0,
    //             serviceBriefDetails: data.serviceBriefDetails, // Include the detailed breakdown
    //         };
    //     });
    // };

    const getServiceAnalysisData = () => {
        const serviceAnalysis = {};
    
        const processServiceData = (booking, service) => {
            const serviceNameKey = service.serviceName.startsWith("ISO Certificate")
                ? "ISO Certificate"
                : service.serviceName;
    
            if (!serviceAnalysis[serviceNameKey]) {
                serviceAnalysis[serviceNameKey] = {
                    timesSold: 0,
                    totalPayment: 0,
                    advancePayment: 0,
                    remainingPaymentsArray: [],
                    serviceBriefDetails: [],
                };
            }
    
            serviceAnalysis[serviceNameKey].timesSold += 1;
            serviceAnalysis[serviceNameKey].totalPayment += Math.round(service.totalPaymentWOGST);
    
            const advanceAmount = service.paymentTerms === "Full Advanced"
                ? Math.round(service.totalPaymentWOGST)
                : (service.withGST ? Math.round(service.firstPayment / 1.18) : Math.round(service.firstPayment)) || 0;
    
            serviceAnalysis[serviceNameKey].advancePayment += advanceAmount;
    
            const distributeAmount = (employeeName, factor) => {
                let existingEmployee = serviceAnalysis[serviceNameKey].serviceBriefDetails.find(
                    detail => detail.employeeName === employeeName
                );
    
                if (!existingEmployee) {
                    existingEmployee = {
                        employeeName,
                        timesSold: 0,
                        totalAmount: 0,
                        advance: 0,
                        remaining: 0,
                        average: 0,
                        companyDetails: [],
                    };
                    serviceAnalysis[serviceNameKey].serviceBriefDetails.push(existingEmployee);
                }
    
                existingEmployee.timesSold += factor;
                existingEmployee.totalAmount += Math.round(service.totalPaymentWOGST * factor);
                existingEmployee.advance += Math.round(advanceAmount * factor);
    
                if (service.paymentTerms === "two-part") {
                    const secondPayment = service.withGST ? Math.round(service.secondPayment / 1.18) : Math.round(service.secondPayment);
                    const thirdPayment = service.withGST ? Math.round(service.thirdPayment / 1.18) : Math.round(service.thirdPayment);
                    const fourthPayment = service.withGST ? Math.round(service.fourthPayment / 1.18) : Math.round(service.fourthPayment);
    
                    const remainingPayment = Math.round((secondPayment + thirdPayment + fourthPayment) * factor);
                    existingEmployee.remaining += remainingPayment;
                    serviceAnalysis[serviceNameKey].remainingPaymentsArray.push(remainingPayment);
                }
    
                existingEmployee.average = Math.round(existingEmployee.totalAmount / existingEmployee.timesSold) || 0;
                existingEmployee.companyDetails.push({
                    companyName: booking["Company Name"],
                    bdeName: booking.bdeName,
                });
            };
    
            const isSameName = booking.bdeName === booking.bdmName;
            const isCloseBy = booking.bdmType === "Close-by";
            const isSupportedBy = booking.bdmType === "Supported-by";
    
            if (isSameName) {
                distributeAmount(booking.bdeName, 1);
            } else if (isCloseBy) {
                distributeAmount(booking.bdeName, 0.5);
                distributeAmount(booking.bdmName, 0.5);
            } else if (isSupportedBy) {
                distributeAmount(booking.bdeName, 1);
            }
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
            const totalRemainingPayment = data.remainingPaymentsArray.reduce((sum, payment) => sum + payment, 0);
    
            return {
                id: index + 1,
                serviceName,
                timesSold: data.timesSold,
                totalPayment: Math.round(data.totalPayment),
                advancePayment: Math.round(data.advancePayment),
                remainingPayment: Math.round(totalRemainingPayment),
                averageSellingPrice: Math.round(data.totalPayment / data.timesSold) || 0,
                serviceBriefDetails: data.serviceBriefDetails,
            };
        });
    };
    

    const serviceAnalysisData = getServiceAnalysisData();

    // Calculate total values for the table footer
    const totalTimesSold = serviceAnalysisData.reduce((total, service) => total + service.timesSold, 0);
    const totalTotalPayment = serviceAnalysisData.reduce((total, service) => total + service.totalPayment, 0);
    const totalAdvancePayment = serviceAnalysisData.reduce((total, service) => total + service.advancePayment, 0);
    const totalRemainingPayment = serviceAnalysisData.reduce((total, service) => total + service.remainingPayment, 0);
    const totalAverageSellingPrice = totalTimesSold ? (totalTotalPayment / totalTimesSold) : 0;

    return (
        <>
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
                                <>
                                    <tbody>
                                        {serviceAnalysisData.map((service, index) => (
                                            <>
                                                <tr onClick={() => toggleServiceDetails(service.serviceName)} style={{ cursor: 'pointer' }} key={index}>
                                                    <td>{service.id}</td>
                                                    <td>{service.serviceName}</td>
                                                    <td>{service.timesSold}</td>
                                                    <td>₹ {formatSalary(service.totalPayment)}</td>
                                                    <td>₹ {formatSalary(service.advancePayment)}</td>
                                                    <td>₹ {formatSalary(service.remainingPayment)}</td>
                                                    <td>₹ {formatSalary(service.averageSellingPrice)}</td>
                                                </tr>

                                                {expandedService === service.serviceName && (
                                                    <tr id='expandedId'>
                                                        <td colSpan="7" id='parent-TD-Inner'>
                                                            <div id='table-default' className="table table-default dash w-100 m-0 arrowsudo">
                                                                <table className='table-vcenter table-nowrap admin-dash-tbl w-100 innerTable'  >
                                                                    <thead>
                                                                        <tr>
                                                                            <th className='innerTH'>Sr.No</th>
                                                                            <th className='innerTH'>Employee Name</th>
                                                                            <th className='innerTH'>Times Sold</th>
                                                                            <th className='innerTH'>Total Payment</th>
                                                                            <th className='innerTH'>Advance Payment</th>
                                                                            <th className='innerTH'>Remaining Payment</th>
                                                                            <th className='innerTH'>Average Selling Price</th>
                                                                        </tr>
                                                                    </thead>

                                                                    <tbody>
                                                                        {service.serviceBriefDetails.map((detail, detailIndex) => (
                                                                            <tr key={detailIndex}>
                                                                                <td>{detailIndex + 1}</td>
                                                                                <td>{detail.employeeName}</td>
                                                                                <td>{detail.timesSold}</td>
                                                                                <td>₹ {formatSalary(detail.totalAmount)}</td>
                                                                                <td>₹ {formatSalary(detail.advance)}</td>
                                                                                <td>₹ {formatSalary(detail.remaining)}</td>
                                                                                <td>₹ {formatSalary(detail.average)}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </>
                                        ))}
                                    </tbody>

                                    <tfoot className="admin-dash-tbl-tfoot">
                                        <tr style={{ fontWeight: 500 }}>
                                            <td>Total</td>
                                            <td>{serviceAnalysisData.length}</td>
                                            <td>{totalTimesSold}</td>
                                            <td>₹ {formatSalary(totalTotalPayment)}</td>
                                            <td>₹ {formatSalary(totalAdvancePayment)}</td>
                                            <td>₹ {formatSalary(totalRemainingPayment)}</td>
                                            <td>₹ {formatSalary(totalAverageSellingPrice)}</td>
                                        </tr>
                                    </tfoot>
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

            <div className="mt-2">
                <RemainingServiceAnalysis />
            </div>
        </>
    );
}

export default ServiceAnalysis;