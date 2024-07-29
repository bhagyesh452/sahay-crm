import React, { useRef, useState, useEffect } from 'react';
import axios from "axios";


function EmployeePerformance({ data }) {

    const secretKey = process.env.REACT_APP_SECRET_KEY;



    const [callData, setCallData] = useState([]);
    const [error, setError] = useState(null);

    const [employeeData, setEmployeeData] = useState([])

    const [redesignedData, setRedesignedData] = useState([])
    const [sortedEmployeeData, setSortedEmployeeData] = useState([]);
    const [bookingStartDate, setBookingStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    const [bookingEndDate, setBookingEndDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0));
    const [loading, setLoading] = useState(false)
    const [initialDate, setInitialDate] = useState(new Date());
    const currentYear = initialDate.getFullYear();
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const currentMonth = monthNames[initialDate.getMonth()];
    //console.log("currentMonth", currentMonth)



    //----------------------fetching employee info----------------------------------------
    const fetchEmployeeInfo = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${secretKey}/employee/einfo`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const filteredData = data.filter((employee) => (employee.designation === "Sales Executive" || employee.designation === "Sales Manager") && employee.ename !== "DIRECT")
            setEmployeeData(filteredData);

        } catch (error) {
            console.error('Error Fetching Employee Data ', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRedesignedBookings()
    }, [data])

    useEffect(() => {
        fetchEmployeeInfo()
        if (employeeData) {
            setSortedEmployeeData(employeeData.sort((a, b) => functionCalculateOnlyAchieved(b.ename) - functionCalculateOnlyAchieved(a.ename)));
        }
    }, [redesignedData])


    const fetchRedesignedBookings = async () => {
        try {
            const response = await axios.get(
                `${secretKey}/bookings/redesigned-final-leadData`
            );
            const bookingsData = response.data;


            setRedesignedData(bookingsData);
            //   const sortedEmployeeData = employeeData.sort((a,b)=>functionCalculateOnlyAchieved(b.ename) - functionCalculateOnlyAchieved(a.ename));

            //   setSortedEmployeeData(sortedEmployeeData);

        } catch (error) {
            console.log("Error Fetching Bookings Data", error);
        }
    };



    // ------------------------------------  function for Calculation  -----------------------------------------


    // const functionCalculateOnlyAchieved = (bdeName) => {
    //     let achievedAmount = 0;
    //     let remainingAmount = 0;
    //     let expanse = 0;
    //     redesignedData.map((mainBooking) => {
    //         const bookingDate = new Date(mainBooking.bookingDate);
    //         const startDate = new Date(bookingStartDate);
    //         const endDate = new Date(bookingEndDate);
    //         bookingDate.setHours(0, 0, 0, 0);
    //         startDate.setHours(0, 0, 0, 0);
    //         endDate.setHours(0, 0, 0, 0);

    //         const isSameDayMonthYear = (date1, date2) => {
    //             return (
    //                 date1.getDate() === date2.getDate() &&
    //                 date1.getMonth() === date2.getMonth() &&
    //                 date1.getFullYear() === date2.getFullYear()
    //             );
    //         };

    //         if (bookingDate >= startDate && bookingDate <= endDate || (isSameDayMonthYear(bookingDate, startDate) && isSameDayMonthYear(bookingDate, endDate))) {
    //             if (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName) {

    //                 if (mainBooking.bdeName === mainBooking.bdmName) {
    //                     achievedAmount = achievedAmount + Math.floor(mainBooking.generatedReceivedAmount);
    //                     mainBooking.services.map(serv => {
    //                         console.log(serv.expanse , bdeName ,"this is services");
    //                         let expanseDate = null
    //                         if (serv.expanse) {
    //                             expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

    //                             expanseDate.setHours(0, 0, 0, 0);
    //                             const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
    //                             expanse = condition ? expanse + serv.expanse : expanse;
    //                         }

    //                     });

    //                 } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
    //                     achievedAmount = achievedAmount + Math.floor(mainBooking.generatedReceivedAmount) / 2;
    //                     mainBooking.services.map(serv => {
    //                         console.log(serv.expanse , bdeName ,"this is services");
    //                         let expanseDate = null
    //                         if (serv.expanse) {
    //                             expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

    //                             expanseDate.setHours(0, 0, 0, 0);
    //                             const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
    //                             expanse = condition ? expanse + serv.expanse / 2 : expanse;
    //                         }

    //                     });
    //                 } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
    //                     if (mainBooking.bdeName === bdeName) {
    //                         achievedAmount += Math.floor(mainBooking.generatedReceivedAmount);
    //                         mainBooking.services.map(serv => {
    //                             console.log(serv.expanse , bdeName ,"this is services");
    //                             let expanseDate = null
    //                             if (serv.expanse) {
    //                                 expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

    //                                 expanseDate.setHours(0, 0, 0, 0);
    //                                 const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
    //                                 expanse = condition ? expanse + serv.expanse : expanse;
    //                             }
    //                         });
    //                     }
    //                 }
    //             }

    //         } else if (mainBooking.remainingPayments.length !== 0) {
    //             mainBooking.remainingPayments.map((remainingObj) => {
    //                 const moreBookingDate = new Date(remainingObj.paymentDate);

    //                 moreBookingDate.setHours(0, 0, 0, 0);


    //                 if (((moreBookingDate >= startDate && moreBookingDate <= endDate) || (isSameDayMonthYear(moreBookingDate, startDate) && isSameDayMonthYear(moreBookingDate, endDate))) && (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName)) {
    //                     const findService = mainBooking.services.find((services) => services.serviceName === remainingObj.serviceName)
    //                     const tempAmount = findService.withGST ? Math.floor(remainingObj.receivedPayment) / 1.18 : Math.floor(remainingObj.receivedPayment);
    //                     if (mainBooking.bdeName === mainBooking.bdmName) {
    //                         remainingAmount += Math.floor(tempAmount);
    //                     } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
    //                         remainingAmount += Math.floor(tempAmount) / 2;
    //                     } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
    //                         if (mainBooking.bdeName === bdeName) {
    //                             remainingAmount += Math.floor(tempAmount);
    //                         }
    //                     }
    //                 }
    //             })
    //         }
    //         mainBooking.moreBookings.map((moreObject) => {
    //             const moreBookingDate = new Date(moreObject.bookingDate);
    //             moreBookingDate.setHours(0, 0, 0, 0);

    //             if ((moreBookingDate >= startDate && moreBookingDate <= endDate) || (isSameDayMonthYear(moreBookingDate, startDate) && isSameDayMonthYear(moreBookingDate, endDate))) {
    //                 if (moreObject.bdeName === bdeName || moreObject.bdmName === bdeName) {
    //                     if (moreObject.bdeName === moreObject.bdmName) {
    //                         achievedAmount = achievedAmount + Math.floor(moreObject.generatedReceivedAmount);
    //                         moreObject.services.map(serv => {
    //                             console.log(serv.expanse , bdeName ,"this is services");
    //                             let expanseDate = null
    //                             if (serv.expanse) {
    //                                 expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

    //                                 expanseDate.setHours(0, 0, 0, 0);
    //                                 const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
    //                                 expanse = condition ? expanse + serv.expanse : expanse;
    //                             }
    //                         });
    //                     } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by") {
    //                         achievedAmount = achievedAmount + Math.floor(moreObject.generatedReceivedAmount) / 2;
    //                         moreObject.services.map(serv => {
    //                             console.log(serv.expanse , bdeName ,"this is services");
    //                             let expanseDate = null
    //                             if (serv.expanse) {
    //                                 expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

    //                                 expanseDate.setHours(0, 0, 0, 0);
    //                                 const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
    //                                 expanse = condition ? expanse + serv.expanse : expanse;
    //                             }
    //                         });
    //                     } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by") {
    //                         if (moreObject.bdeName === bdeName) {
    //                             achievedAmount += Math.floor(moreObject.generatedReceivedAmount);
    //                             moreObject.services.map(serv => {
    //                                 console.log(serv.expanse , bdeName ,"this is services");
    //                                 let expanseDate = null
    //                                 if (serv.expanse) {
    //                                     expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

    //                                     expanseDate.setHours(0, 0, 0, 0);
    //                                     const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
    //                                     expanse = condition ? expanse + serv.expanse : expanse;
    //                                 }
    //                             });
    //                         }
    //                     }
    //                 }
    //             } else if (moreObject.remainingPayments.length !== 0) {

    //                 moreObject.remainingPayments.map((remainingObj) => {
    //                     const moreRemainingDate = new Date(remainingObj.paymentDate);
    //                     moreRemainingDate.setHours(0, 0, 0, 0);
    //                     if (((moreRemainingDate >= startDate && moreRemainingDate <= endDate) || (isSameDayMonthYear(moreRemainingDate, startDate) && isSameDayMonthYear(moreRemainingDate, endDate))) && (moreObject.bdeName === bdeName || moreObject.bdmName === bdeName)) {

    //                         const findService = moreObject.services.find((services) => services.serviceName === remainingObj.serviceName)
    //                         const tempAmount = findService.withGST ? Math.floor(remainingObj.receivedPayment) / 1.18 : Math.floor(remainingObj.receivedPayment);
    //                         if (moreObject.bdeName === moreObject.bdmName) {
    //                             remainingAmount += Math.floor(tempAmount);
    //                         } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by") {
    //                             remainingAmount += Math.floor(tempAmount) / 2;
    //                         } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by") {
    //                             if (moreObject.bdeName === bdeName) {
    //                                 remainingAmount += Math.floor(tempAmount);
    //                             }
    //                         }
    //                     }
    //                 })
    //             }
    //         })
    //     })

    //     const amount = achievedAmount + Math.floor(remainingAmount) - expanse;

    //     return amount
    // }

    // const functionCalculateOnlyAchieved = (bdeName) => {
    //     let achievedAmount = 0;
    //     let remainingAmount = 0;
    //     let expanse = 0;
    //     let remainingExpense = 0;
    //     let remainingMoreExpense = 0;
    //     let add_caCommision = 0;
    //     const today = new Date();



    //     // console.log('Starting calculations...');
    //     // console.log('Booking Start Date:', bookingStartDate);
    //     // console.log('Booking End Date:', bookingEndDate);

    //     redesignedData.map((mainBooking) => {
    //         const bookingDate = new Date(mainBooking.bookingDate);
    //         //console.log("bookingDate" , mainBooking.bookingDate)
    //         const startDate = new Date(bookingStartDate);
    //         const endDate = new Date(bookingEndDate);
    //         bookingDate.setHours(0, 0, 0, 0);
    //         startDate.setHours(0, 0, 0, 0);
    //         endDate.setHours(0, 0, 0, 0);

    //         const isSameDayMonthYear = (date1, date2) => {
    //             const d1 = new Date(date1);
    //             const d2 = new Date(date2);
    //             return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
    //         };

    //         // Check if bookingDate is in the range
    //         const bookingDateInRange = (bookingDate >= startDate && bookingDate <= endDate) ||
    //             (isSameDayMonthYear(bookingDate, startDate) && isSameDayMonthYear(bookingDate, endDate));


    //         if (bookingDateInRange && (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName)) {

    //             // Case where BDE and BDM are the same
    //             if (mainBooking.bdeName === mainBooking.bdmName) {
    //                 mainBooking.services.map(serv => {
    //                     if (serv.paymentTerms === "Full Advanced") {
    //                         achievedAmount += serv.totalPaymentWOGST;
    //                     } else {
    //                         achievedAmount += serv.withGST ? Math.round(serv.firstPayment / 1.18) : Math.round(serv.firstPayment);
    //                     }

    //                     let expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : bookingDate;
    //                     expanseDate.setHours(0, 0, 0, 0);

    //                     if (serv.expanse && (expanseDate >= startDate && expanseDate <= endDate)) {
    //                         expanse += serv.expanse;
    //                     }
    //                 });

    //                 if (mainBooking.caCase === "Yes") {
    //                     add_caCommision += parseInt(mainBooking.caCommission);
    //                 }

    //             // Case where BDE and BDM are different and BDM type is "Close-by"
    //             } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
    //                 mainBooking.services.map(serv => {
    //                     if (serv.paymentTerms === "Full Advanced") {
    //                         achievedAmount += serv.totalPaymentWOGST / 2;
    //                     } else {
    //                         achievedAmount += serv.withGST ? Math.round(serv.firstPayment / 1.18) / 2 : Math.round(serv.firstPayment) / 2;
    //                     }

    //                     let expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : bookingDate;
    //                     expanseDate.setHours(0, 0, 0, 0);

    //                     if (serv.expanse && (expanseDate >= startDate && expanseDate <= endDate)) {
    //                         expanse += serv.expanse / 2;
    //                     }
    //                 });

    //                 if (mainBooking.caCase === "Yes") {
    //                     add_caCommision += parseInt(mainBooking.caCommission) / 2;
    //                 }

    //             // Case where BDE and BDM are different and BDM type is "Supported-by"
    //             } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
    //                 if (mainBooking.bdeName === bdeName) {
    //                     mainBooking.services.map(serv => {
    //                         if (serv.paymentTerms === "Full Advanced") {
    //                             achievedAmount += serv.totalPaymentWOGST;
    //                         } else {
    //                             achievedAmount += serv.withGST ? Math.round(serv.firstPayment / 1.18) : Math.round(serv.firstPayment);
    //                         }

    //                         let expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : bookingDate;
    //                         expanseDate.setHours(0, 0, 0, 0);

    //                         if (serv.expanse && (expanseDate >= startDate && expanseDate <= endDate)) {
    //                             expanse += serv.expanse;
    //                         }
    //                     });

    //                     if (mainBooking.caCase === "Yes") {
    //                         add_caCommision += parseInt(mainBooking.caCommission);
    //                     }
    //                 }
    //             }
    //         }

    //         // Remaining payments
    //         if (mainBooking.remainingPayments.length !== 0 && (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName)) {
    //             const remainingExpanseCondition = mainBooking.remainingPayments.some(item => {
    //                 const paymentDate = new Date(item.paymentDate);
    //                 return (paymentDate >= startDate && paymentDate <= endDate) ||
    //                     (isSameDayMonthYear(paymentDate, startDate) && isSameDayMonthYear(paymentDate, endDate));
    //             });

    //             //console.log('Remaining Expanse Condition:', remainingExpanseCondition);

    //             if (remainingExpanseCondition) {
    //                 if (new Date(startDate).getMonth() === new Date(endDate).getMonth() && new Date(startDate).getFullYear() === new Date(endDate).getFullYear()) {
    //                     const startDateMonth = new Date(startDate).setDate(1);
    //                     const endDateMonth = new Date(endDate).setDate(new Date(endDate).getDate());

    //                     mainBooking.services.forEach(serv => {
    //                         if (serv.expanseDate && (new Date(serv.expanseDate) >= startDateMonth && new Date(serv.expanseDate) <= endDateMonth)) {
    //                             if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
    //                                 remainingExpense += serv.expanse / 2;
    //                             } else if (mainBooking.bdeName === mainBooking.bdmName) {
    //                                 remainingExpense += serv.expanse;
    //                             } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by" && mainBooking.bdeName === bdeName) {
    //                                 remainingExpense += serv.expanse;
    //                             }
    //                         }
    //                     });
    //                 }

    //                 mainBooking.remainingPayments.map((remainingObj) => {
    //                     const paymentDate = new Date(remainingObj.paymentDate);
    //                     if ((paymentDate >= startDate && paymentDate <= endDate) ||
    //                         (isSameDayMonthYear(paymentDate, startDate) && isSameDayMonthYear(paymentDate, endDate))) {
    //                         const findService = mainBooking.services.find(service => service.serviceName === remainingObj.serviceName);
    //                         if (findService) {
    //                             const tempAmount = findService.withGST ? Math.round(remainingObj.receivedPayment) / 1.18 : Math.round(remainingObj.receivedPayment);

    //                             if (mainBooking.bdeName === mainBooking.bdmName) {
    //                                 remainingAmount += Math.round(tempAmount);
    //                             } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
    //                                 remainingAmount += Math.round(tempAmount) / 2;
    //                             } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by" && mainBooking.bdeName === bdeName) {
    //                                 remainingAmount += Math.round(tempAmount);
    //                             }
    //                         } else {
    //                             console.warn(`Service with name ${remainingObj.serviceName} not found.`);
    //                         }
    //                     }
    //                 });
    //             }
    //         }

    //         // More bookings
    //         mainBooking.moreBookings.map((moreObject) => {
    //             const bookingDate = new Date(moreObject.bookingDate);
    //             const bookingDateInRange = (bookingDate >= startDate && bookingDate <= endDate) ||
    //                 (isSameDayMonthYear(bookingDate, startDate) && isSameDayMonthYear(bookingDate, endDate));

    //             // console.log('More Booking Date:', bookingDate);
    //             // console.log('More Booking Date In Range:', bookingDateInRange);

    //             if (bookingDateInRange && (moreObject.bdeName === bdeName || moreObject.bdmName === bdeName)) {

    //                 if (moreObject.bdeName === moreObject.bdmName) {
    //                     moreObject.services.map(serv => {
    //                         if (serv.paymentTerms === "Full Advanced") {
    //                             achievedAmount += serv.totalPaymentWOGST;
    //                         } else {
    //                             achievedAmount += serv.withGST ? Math.round(serv.firstPayment / 1.18) : Math.round(serv.firstPayment);
    //                         }

    //                         let expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : bookingDate;
    //                         expanseDate.setHours(0, 0, 0, 0);

    //                         if (serv.expanse && (expanseDate >= startDate && expanseDate <= endDate)) {
    //                             remainingMoreExpense += serv.expanse;
    //                         }
    //                     });

    //                     if (moreObject.caCase === "Yes") {
    //                         add_caCommision += parseInt(moreObject.caCommission);
    //                     }

    //                 } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by") {
    //                     moreObject.services.map(serv => {
    //                         if (serv.paymentTerms === "Full Advanced") {
    //                             achievedAmount += serv.totalPaymentWOGST / 2;
    //                         } else {
    //                             achievedAmount += serv.withGST ? Math.round(serv.firstPayment / 1.18) / 2 : Math.round(serv.firstPayment) / 2;
    //                         }

    //                         let expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : bookingDate;
    //                         expanseDate.setHours(0, 0, 0, 0);

    //                         if (serv.expanse && (expanseDate >= startDate && expanseDate <= endDate)) {
    //                             remainingMoreExpense += serv.expanse / 2;
    //                         }
    //                     });

    //                     if (moreObject.caCase === "Yes") {
    //                         add_caCommision += parseInt(moreObject.caCommission) / 2;
    //                     }

    //                 } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by") {
    //                     if (moreObject.bdeName === bdeName) {
    //                         moreObject.services.map(serv => {
    //                             if (serv.paymentTerms === "Full Advanced") {
    //                                 achievedAmount += serv.totalPaymentWOGST;
    //                             } else {
    //                                 achievedAmount += serv.withGST ? Math.round(serv.firstPayment / 1.18) : Math.round(serv.firstPayment);
    //                             }

    //                             let expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : bookingDate;
    //                             expanseDate.setHours(0, 0, 0, 0);

    //                             if (serv.expanse && (expanseDate >= startDate && expanseDate <= endDate)) {
    //                                 remainingMoreExpense += serv.expanse;
    //                             }
    //                         });

    //                         if (moreObject.caCase === "Yes") {
    //                             add_caCommision += parseInt(moreObject.caCommission);
    //                         }
    //                     }
    //                 }
    //             }
    //         });
    //     });

    //     console.log(achievedAmount - remainingAmount - expanse - remainingExpense - remainingMoreExpense - add_caCommision)
    //     return achievedAmount - Math.round(remainingAmount) - expanse - remainingExpense - remainingMoreExpense - add_caCommision;
    // };

    const isSameDayMonthYear = (date1, date2) => {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
    };
    
    const functionCalculateOnlyAchieved = (ename, Filterby = 'This Month') => {
        //console.log("yahan chla achieved full function")
        let achievedAmount = 0;
        let remainingAmount = 0;
        let expanse = 0;
        let remainingExpense = 0;
        let remainingMoreExpense = 0;
        let add_caCommision = 0;
        const today = new Date();
        const cleanString = (str) => (str ? str.replace(/\s+/g, '').toLowerCase() : '');
      
        redesignedData.map((mainBooking) => {
          let condition = false;
          switch (Filterby) {
            case 'Today':
              condition = (new Date(mainBooking.bookingDate).toLocaleDateString() === today.toLocaleDateString())
              break;
            case 'Last Month':
              condition = (new Date(mainBooking.bookingDate).getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1)) && (new Date(mainBooking.bookingDate).getFullYear() === today.getFullYear())
              break;
            case 'This Month':
              condition = (new Date(mainBooking.bookingDate).getMonth() === today.getMonth()) && (new Date(mainBooking.bookingDate).getFullYear() === today.getFullYear())
              break;
            default:
              break;
          }
          if (condition && (cleanString(mainBooking.bdeName) === cleanString(ename) || cleanString(mainBooking.bdmName) === cleanString(ename))) {
      
            if (cleanString(mainBooking.bdeName) === cleanString(mainBooking.bdmName)) {
              //achievedAmount = achievedAmount + Math.round(mainBooking.generatedReceivedAmount);
              mainBooking.services.map(serv => {
                if (serv.paymentTerms === "Full Advanced") {
                  achievedAmount = achievedAmount + serv.totalPaymentWOGST;
                } else {
                  if (serv.withGST) {
                    achievedAmount = achievedAmount + Math.round(serv.firstPayment / 1.18);
                  } else {
                    achievedAmount = achievedAmount + Math.round(serv.firstPayment);
                  }
                }
                // console.log(serv.expanse , bdeName ,"this is services");
                let expanseDate = null
                if (serv.expanse) {
                  expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);
                  expanseDate.setHours(0, 0, 0, 0);
                  let expanseCondition = false;
                  switch (Filterby) {
                    case 'Today':
                      expanseCondition = (new Date(expanseDate).toLocaleDateString() === today.toLocaleDateString())
                      break;
                    case 'Last Month':
                      expanseCondition = (new Date(expanseDate).getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1)) && (new Date(expanseDate).getFullYear() === today.getFullYear())
                      break;
                    case 'This Month':
                      expanseCondition = (new Date(expanseDate).getMonth() === today.getMonth()) && (new Date(expanseDate).getFullYear() === today.getFullYear())
                      break;
                    default:
                      break;
                  }
                  expanse = expanseCondition ? expanse + serv.expanse : expanse;
                }
              });
              if (mainBooking.caCase === "Yes") {
                add_caCommision += parseInt(mainBooking.caCommission)
              }
            } else if (cleanString(mainBooking.bdeName) !== cleanString(mainBooking.bdmName) && mainBooking.bdmType === "Close-by") {
              //achievedAmount = achievedAmount + Math.floor(mainBooking.generatedReceivedAmount) / 2;
              mainBooking.services.map(serv => {
                // console.log(serv.expanse , bdeName ,"this is services");
                if (serv.paymentTerms === "Full Advanced") {
                  achievedAmount = achievedAmount + serv.totalPaymentWOGST / 2;
                } else {
                  if (serv.withGST) {
                    achievedAmount = achievedAmount + Math.round(serv.firstPayment / 1.18) / 2;
                  } else {
                    achievedAmount = achievedAmount + Math.round(serv.firstPayment) / 2;
                  }
                }
                let expanseDate = null
                expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);
                expanseDate.setHours(0, 0, 0, 0);
                if (serv.expanse) {
                  let expanseCondition = false;
                  switch (Filterby) {
                    case 'Today':
                      expanseCondition = (expanseDate.toLocaleDateString() === today.toLocaleDateString())
                      break;
                    case 'Last Month':
                      expanseCondition = (expanseDate.getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1)) && (expanseDate.getFullYear() === today.getFullYear())
                      break;
                    case 'This Month':
                      expanseCondition = (expanseDate.getMonth() === today.getMonth()) && (expanseDate.getFullYear() === today.getFullYear())
                      break;
                    default:
                      break;
                  }
                  expanse = expanseCondition ? expanse + serv.expanse / 2 : expanse;
                }
              });
              if (mainBooking.caCase === "Yes") {
                add_caCommision += parseInt(mainBooking.caCommission) / 2;
              }
            } else if (cleanString(mainBooking.bdeName) !== cleanString(mainBooking.bdmName) && mainBooking.bdmType === "Supported-by") {
              if (cleanString(mainBooking.bdeName) === cleanString(ename)) {
                //achievedAmount = achievedAmount + Math.round(mainBooking.generatedReceivedAmount);
                mainBooking.services.map(serv => {
                  if (serv.paymentTerms === "Full Advanced") {
                    achievedAmount = achievedAmount + serv.totalPaymentWOGST;
                  } else {
                    if (serv.withGST) {
                      achievedAmount = achievedAmount + Math.round(serv.firstPayment / 1.18);
                    } else {
                      achievedAmount = achievedAmount + Math.round(serv.firstPayment);
                    }
                  }
                  // console.log(serv.expanse , bdeName ,"this is services");
                  let expanseDate = null
                  expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);
                  expanseDate.setHours(0, 0, 0, 0);
                  if (serv.expanse) {
                    let expanseCondition = false;
                    switch (Filterby) {
                      case 'Today':
                        expanseCondition = (expanseDate.toLocaleDateString() === today.toLocaleDateString())
                        break;
                      case 'Last Month':
                        expanseCondition = (expanseDate.getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1)) && (expanseDate.getFullYear() === today.getFullYear())
                        break;
                      case 'This Month':
                        expanseCondition = (expanseDate.getMonth() === today.getMonth()) && (expanseDate.getFullYear() === today.getFullYear())
                        break;
                      default:
                        break;
                    }
                    expanse = expanseCondition ? expanse + serv.expanse : expanse;
                  }
                });
                if (mainBooking.caCase === "Yes") {
                  add_caCommision += parseInt(mainBooking.caCommission);
                }
              }
            }
          }
          if (mainBooking.remainingPayments.length !== 0 && (cleanString(mainBooking.bdeName) === cleanString(ename) || cleanString(mainBooking.bdmName) === cleanString(ename))) {
            let remainingExpanseCondition = false;
            switch (Filterby) {
              case 'Today':
                remainingExpanseCondition = mainBooking.remainingPayments.some(item => new Date(item.paymentDate).toLocaleDateString() === today.toLocaleDateString())
                break;
              case 'Last Month':
                remainingExpanseCondition = mainBooking.remainingPayments.some(item => new Date(item.paymentDate).getMonth() === (today.getMonth() === 0 ? 11 : today.getMonth() - 1))
                break;
              case 'This Month':
                remainingExpanseCondition = mainBooking.remainingPayments.some(item => new Date(item.paymentDate).getMonth() === today.getMonth() && new Date(item.paymentDate).getFullYear() === today.getFullYear())
                break;
              default:
                break;
            }
      
            if (remainingExpanseCondition && Filterby === "This Month") {
              const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
              const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
              mainBooking.services.forEach(serv => {
                if (serv.expanseDate && new Date(serv.expanseDate) >= startDate && new Date(serv.expanseDate) <= endDate) {
                  if (cleanString(mainBooking.bdeName) !== cleanString(mainBooking.bdmName) && mainBooking.bdmType === "Close-by") {
                    remainingExpense += serv.expanse / 2;
                  } else if (cleanString(mainBooking.bdeName) === cleanString(mainBooking.bdmName)) {
                    remainingExpense += serv.expanse;
                  } else if (cleanString(mainBooking.bdeName) !== cleanString(mainBooking.bdmName) && mainBooking.bdmType === "Support-by" && mainBooking.bdemName === cleanString(ename)) {
                    remainingExpense += serv.expanse;
                  }
                }
      
              });
            }
      
            mainBooking.remainingPayments.map((remainingObj) => {
              let condition = false;
              switch (Filterby) {
                case 'Today':
                  condition = (new Date(remainingObj.paymentDate).toLocaleDateString() === today.toLocaleDateString())
                  break;
                case 'Last Month':
                  condition = (new Date(remainingObj.paymentDate).getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1))
                  break;
                case 'This Month':
                  condition = (new Date(remainingObj.paymentDate).getMonth() === today.getMonth())
                  break;
                default:
                  break;
              }
              if (condition) {
                // Find the service from mainBooking.services
                const findService = mainBooking.services.find(service => service.serviceName === remainingObj.serviceName);
                //console.log("findService", mainBooking["Company Name"], findService)
                // Check if findService is defined
                if (findService) {
                  // Calculate the tempAmount based on whether GST is included
                  const tempAmount = findService.withGST
                    ? Math.round(remainingObj.receivedPayment) / 1.18
                    : Math.round(remainingObj.receivedPayment);
      
                  // Update remainingAmount based on conditions
                  if (cleanString(mainBooking.bdeName) === cleanString(mainBooking.bdmName)) {
                    remainingAmount += Math.round(tempAmount);
                  } else if (cleanString(mainBooking.bdeName) !== cleanString(mainBooking.bdmName) && mainBooking.bdmType === "Close-by") {
                    remainingAmount += Math.round(tempAmount) / 2;
                  } else if (cleanString(mainBooking.bdeName) !== cleanString(mainBooking.bdmName) && mainBooking.bdmType === "Supported-by") {
                    if (cleanString(mainBooking.bdeName) === cleanString(ename)) {
                      remainingAmount += Math.round(tempAmount);
                    }
                  }
                } else {
                  // Optional: Handle the case where findService is undefined
                  console.warn(`Service with name ${remainingObj.serviceName} not found.`);
                }
              }
            })
          }
      
          mainBooking.moreBookings.map((moreObject) => {
            let condition = false;
            switch (Filterby) {
              case 'Today':
                condition = (new Date(moreObject.bookingDate).toLocaleDateString() === today.toLocaleDateString())
                break;
              case 'Last Month':
                condition = (new Date(moreObject.bookingDate).getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1))
                break;
              case 'This Month':
                condition = (new Date(moreObject.bookingDate).getMonth() === today.getMonth())
                break;
              default:
                break;
            }
            if (condition && (cleanString(moreObject.bdeName) === cleanString(ename) || cleanString(moreObject.bdmName) === cleanString(ename))) {
      
              if (cleanString(moreObject.bdeName) === cleanString(moreObject.bdmName)) {
                //achievedAmount = achievedAmount + Math.round(moreObject.generatedReceivedAmount);
                moreObject.services.map(serv => {
                  if (serv.paymentTerms === "Full Advanced") {
                    achievedAmount = achievedAmount + serv.totalPaymentWOGST;
                  } else {
                    if (serv.withGST) {
                      achievedAmount = achievedAmount + Math.round(serv.firstPayment / 1.18);
                    } else {
                      achievedAmount = achievedAmount + Math.round(serv.firstPayment);
                    }
                  }
                  // console.log(serv.expanse , bdeName ,"this is services");
                  let expanseDate = null
                  expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);
                  expanseDate.setHours(0, 0, 0, 0);
                  if (serv.expanse) {
                    let expanseCondition = false;
                    switch (Filterby) {
                      case 'Today':
                        expanseCondition = (expanseDate.toLocaleDateString() === today.toLocaleDateString())
                        break;
                      case 'Last Month':
                        expanseCondition = (expanseDate.getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1)) && (expanseDate.getFullYear() === today.getFullYear())
                        break;
                      case 'This Month':
                        expanseCondition = (expanseDate.getMonth() === today.getMonth()) && (expanseDate.getFullYear() === today.getFullYear())
                        break;
                      default:
                        break;
                    }
                    expanse = expanseCondition ? expanse + serv.expanse : expanse;
                  }
                });
                if (moreObject.caCase === "Yes") {
                  add_caCommision += parseInt(moreObject.caCommission);
                }
              } else if (cleanString(moreObject.bdeName) !== cleanString(moreObject.bdmName) && moreObject.bdmType === "Close-by") {
                //achievedAmount = achievedAmount + Math.round(moreObject.generatedReceivedAmount) / 2;
                moreObject.services.map(serv => {
                  if (serv.paymentTerms === "Full Advanced") {
                    achievedAmount = achievedAmount + serv.totalPaymentWOGST / 2;
                  } else {
                    if (serv.withGST) {
                      achievedAmount = achievedAmount + Math.round(serv.firstPayment / 1.18) / 2;
                    } else {
                      achievedAmount = achievedAmount + Math.round(serv.firstPayment) / 2;
                    }
                  }
                  // console.log(serv.expanse , bdeName ,"this is services");
                  let expanseDate = null
                  expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);
                  expanseDate.setHours(0, 0, 0, 0);
                  if (serv.expanse) {
                    let expanseCondition = false;
                    switch (Filterby) {
                      case 'Today':
                        expanseCondition = (expanseDate.toLocaleDateString() === today.toLocaleDateString())
                        break;
                      case 'Last Month':
                        expanseCondition = (expanseDate.getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1)) && (expanseDate.getFullYear() === today.getFullYear())
                        break;
                      case 'This Month':
                        expanseCondition = (expanseDate.getMonth() === today.getMonth()) && (expanseDate.getFullYear() === today.getFullYear())
                        break;
                      default:
                        break;
                    }
                    expanse = expanseCondition ? expanse + serv.expanse / 2 : expanse;
                  }
                });
                if (moreObject.caCase === "Yes") {
                  add_caCommision += parseInt(moreObject.caCommission) / 2;
                }
              } else if (cleanString(moreObject.bdeName) !== cleanString(moreObject.bdmName) && moreObject.bdmType === "Supported-by") {
                if (cleanString(moreObject.bdeName) === cleanString(ename)) {
                  //achievedAmount = achievedAmount + Math.round(moreObject.generatedReceivedAmount);
                  moreObject.services.map(serv => {
                    if (serv.paymentTerms === "Full Advanced") {
                      achievedAmount = achievedAmount + serv.totalPaymentWOGST;
                    } else {
                      if (serv.withGST) {
                        achievedAmount = achievedAmount + Math.round(serv.firstPayment / 1.18);
                      } else {
                        achievedAmount = achievedAmount + Math.round(serv.firstPayment);
                      }
                    }
                    // console.log(serv.expanse , bdeName ,"this is services");
                    let expanseDate = null
                    expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);
                    expanseDate.setHours(0, 0, 0, 0);
                    if (serv.expanse) {
                      let expanseCondition = false;
                      switch (Filterby) {
                        case 'Today':
                          expanseCondition = (expanseDate.toLocaleDateString() === today.toLocaleDateString())
                          break;
                        case 'Last Month':
                          expanseCondition = (expanseDate.getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1)) && (expanseDate.getFullYear() === today.getFullYear())
                          break;
                        case 'This Month':
                          expanseCondition = (expanseDate.getMonth() === today.getMonth()) && (expanseDate.getFullYear() === today.getFullYear())
                          break;
                        default:
                          break;
                      }
                      expanse = expanseCondition ? expanse + serv.expanse : expanse;
                    }
                  });
                  if (moreObject.caCase === "Yes") {
                    add_caCommision += parseInt(moreObject.caCommission);
                  }
                }
              }
            }
            if (moreObject.remainingPayments.length !== 0 && (cleanString(moreObject.bdeName) === cleanString(ename) || cleanString(moreObject.bdmName) === cleanString(ename))) {
      
              let remainingExpanseCondition = false;
              switch (Filterby) {
                case 'Today':
                  remainingExpanseCondition = moreObject.remainingPayments.some(item => new Date(item.paymentDate).toLocaleDateString() === today.toLocaleDateString())
                  break;
                case 'Last Month':
                  remainingExpanseCondition = moreObject.remainingPayments.some(item => new Date(item.paymentDate).getMonth() === (today.getMonth() === 0 ? 11 : today.getMonth() - 1))
                  break;
                case 'This Month':
                  remainingExpanseCondition = moreObject.remainingPayments.some(item => new Date(item.paymentDate).getMonth() === today.getMonth() && new Date(item.paymentDate).getFullYear() === today.getFullYear())
                  break;
                default:
                  break;
              }
      
              if (remainingExpanseCondition && Filterby === "This Month") {
                const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
                const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
                moreObject.services.forEach(serv => {
      
                  if (serv.expanseDate && new Date(serv.expanseDate) >= startDate && new Date(serv.expanseDate) <= endDate) {
                    if (cleanString(moreObject.bdeName) !== cleanString(moreObject.bdmName) && moreObject.bdmType === "Close-by") {
                      remainingMoreExpense += serv.expanse / 2;
                    } else if (cleanString(moreObject.bdeName) === cleanString(moreObject.bdmName)) {
                      remainingMoreExpense += serv.expanse;
                    } else if (cleanString(moreObject.bdeName) !== cleanString(moreObject.bdmName) && moreObject.bdmType === "Support-by" && moreObject.bdemName === cleanString(ename)) {
                      remainingMoreExpense += serv.expanse;
                    }
                  }
      
                });
              }
      
              moreObject.remainingPayments.map((remainingObj) => {
                let condition = false;
                switch (Filterby) {
                  case 'Today':
                    condition = (new Date(remainingObj.paymentDate).toLocaleDateString() === today.toLocaleDateString())
                    break;
                  case 'Last Month':
                    condition = (new Date(remainingObj.paymentDate).getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1))
                    break;
                  case 'This Month':
                    condition = (new Date(remainingObj.paymentDate).getMonth() === today.getMonth())
                    break;
                  default:
                    break;
                }
                if (condition) {
      
                  const findService = moreObject.services.find((services) => services.serviceName === remainingObj.serviceName)
                  const tempAmount = findService.withGST ? Math.round(remainingObj.receivedPayment) / 1.18 : Math.round(remainingObj.receivedPayment);
                  if (cleanString(moreObject.bdeName) === cleanString(moreObject.bdmName)) {
                    remainingAmount += Math.round(tempAmount);
                  } else if (cleanString(moreObject.bdeName) !== cleanString(moreObject.bdmName) && moreObject.bdmType === "Close-by") {
                    remainingAmount += Math.round(tempAmount) / 2;
                  } else if (cleanString(moreObject.bdeName) !== cleanString(moreObject.bdmName) && moreObject.bdmType === "Supported-by") {
                    if (cleanString(moreObject.bdeName) === cleanString(ename)) {
                      remainingAmount += Math.round(tempAmount);
                    }
                  }
                }
              })
            }
          })
        })
        return achievedAmount + Math.round(remainingAmount) - expanse - remainingExpense - remainingMoreExpense - add_caCommision;
      };
    

    // useEffect(() => {
    //     const result = functionCalculateOnlyAchieved(data.ename);
    //     //console.log(`Final Achieved Amount for this month: ${result}`);
    // }, [data.ename])



    const functionGetOnlyAmount = (object) => {
        if (object.targetDetails.length !== 0) {
            const foundObject = object.targetDetails.find(
                (item) =>
                    Math.floor(item.year) === currentYear && item.month === currentMonth
            );

           
            return foundObject ? foundObject.amount : 0;
        } else {
            return 0;
        }
    };

   





    // console.log(data.ename , employeeData)
    return (
        <div>
            <div className="dash-card" style={{ minHeight: '299px' }}>
                <div className="dash-card-head">
                    <h2 className="m-0 d-flex align-items-end justify-content-between flex-wrap">
                        <div>Top 5 Performers</div>
                        <div style={{ fontSize: "11px" }}> (Ranking Is Done Based On Collection)</div>
                    </h2>
                </div>
                <div className="dash-card-body table-responsive">
                    <table class="table top_5_table m-0">
                        <thead>
                            <tr >
                                <th style={{ borderRadius: ' 8px 0 0 0' }}>Rank </th>

                                <th>Name</th>
                                <th>Branch</th>

                                <th style={{ borderRadius: ' 0 8px  0 0' }}>Achievement</th>
                            </tr>
                        </thead>
                        {sortedEmployeeData.length !== 0 && <tbody>
                            <tr className={sortedEmployeeData[0].ename === data.ename ? "clr-bg-light-1cba19 myself " : "clr-bg-light-1cba19 "}  >
                                <td><div className="ranktd clr-fff clr-bg-1cba19">1</div></td>
                                <td>
                                    <div className='My_Text_Wrap'>
                                        {sortedEmployeeData[0].ename === data.ename ? "You" : sortedEmployeeData[0].ename}
                                    </div>
                                </td>
                                <td>{sortedEmployeeData[0].branchOffice === "Gota" ? "Gota" : "SBR"}</td>
                                <td>{((functionCalculateOnlyAchieved(sortedEmployeeData[0].ename) / functionGetOnlyAmount(sortedEmployeeData[0])) * 100).toFixed(2)} %</td>
                            </tr>
                            <tr className={sortedEmployeeData[1].ename === data.ename ? "clr-bg-light-ffb900 myself " : "clr-bg-light-ffb900 "}  >

                                <td><div className="ranktd clr-bg-ffb900 clr-fff">2</div></td>
                                <td>
                                    <div className='My_Text_Wrap'>
                                        {sortedEmployeeData[1].ename === data.ename ? "You" : sortedEmployeeData[1].ename}
                                    </div>
                                </td>
                                <td>{sortedEmployeeData[1].branchOffice === "Gota" ? "Gota" : "SBR"}</td>
                                <td>{((functionCalculateOnlyAchieved(sortedEmployeeData[1].ename) / functionGetOnlyAmount(sortedEmployeeData[1])) * 100).toFixed(2)} %</td>
                            </tr>
                            <tr className={sortedEmployeeData[2].ename === data.ename ? "clr-bg-light-00d19d myself " : "clr-bg-light-00d19d "}  >


                                <td><div className="ranktd  clr-bg-00d19d clr-fff">3</div></td>
                                <td>
                                    <div className='My_Text_Wrap'>
                                        {sortedEmployeeData[2].ename === data.ename ? "You" : sortedEmployeeData[2].ename}
                                    </div>
                                </td>
                                <td>{sortedEmployeeData[2].branchOffice === "Gota" ? "Gota" : "SBR"}</td>
                                <td>{((functionCalculateOnlyAchieved(sortedEmployeeData[2].ename) / functionGetOnlyAmount(sortedEmployeeData[2])) * 100).toFixed(2)} %</td>
                            </tr>
                            <tr className={sortedEmployeeData[3].ename === data.ename ? "clr-bg-light-e65b5b myself " : "clr-bg-light-e65b5b "}  >


                                <td><div className="ranktd clr-bg-e65b5b clr-fff">4</div></td>
                                <td>
                                    <div className='My_Text_Wrap'>
                                        {sortedEmployeeData[3].ename === data.ename ? "You" : sortedEmployeeData[3].ename}
                                    </div>
                                </td>
                                <td>{sortedEmployeeData[3].branchOffice === "Gota" ? "Gota" : "SBR"}</td>
                                <td>{((functionCalculateOnlyAchieved(sortedEmployeeData[3].ename) / functionGetOnlyAmount(sortedEmployeeData[3])) * 100).toFixed(2)} %</td>
                            </tr>
                            <tr className={sortedEmployeeData[4].ename === data.ename ? "clr-bg-light-4299e1 myself " : "clr-bg-light-4299e1 "}  >


                                <td style={{ borderRadius: ' 0 0 0 8px ' }}><div className="ranktd clr-bg-4299e1 clr-fff">5</div></td>
                                <td>
                                    <div className='My_Text_Wrap'>
                                        {sortedEmployeeData[4].ename === data.ename ? "You" : sortedEmployeeData[4].ename}
                                    </div>
                                </td>
                                <td>{sortedEmployeeData[4].branchOffice === "Gota" ? "Gota" : "SBR"}</td>
                                <td style={{ borderRadius: ' 0 0  8px 0 ' }}>{((functionCalculateOnlyAchieved(sortedEmployeeData[4].ename) / functionGetOnlyAmount(sortedEmployeeData[4])) * 100).toFixed(2)} %</td>
                            </tr>
                        </tbody>}
                    </table>
                </div>
            </div>
        </div>
    )
}

export default EmployeePerformance