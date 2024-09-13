import React, { useEffect, useState } from 'react';
import SwapVertIcon from "@mui/icons-material/SwapVert";
import AddCircle from "@mui/icons-material/AddCircle.js";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import axios from "axios";

const FilterTableThisMonthBooking = ({
    activeTab,
    filteredData,
    data,
    filterField,
    onFilter,
    completeData,
    dataForFilter,
    activeFilters,
    allFilterFields,
    employeeData,
    redesignedData,
    showingMenu,
    bookingStartDate,
    bookingEndDate,
    initialDate }) => {
    const [columnValues, setColumnValues] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState({});
    const [sortOrder, setSortOrder] = useState(null);
    const secretKey = process.env.REACT_APP_SECRET_KEY;


 //-----------------------dateformats-------------------------------------
    const formatDuration = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0'),
        ].join(':');
    };
    const formatDateTime = (dateTime) => {
        // Remove the ' IST' part from the string (or any other timezone indicator)
        const cleanedDateTime = dateTime.replace(' IST', '').replace(' UTC', '');

        // Create a new Date object from the cleaned string
        const date = new Date(cleanedDateTime);

        // If the date is invalid, return the original string (as fallback)
        if (isNaN(date.getTime())) {
            return dateTime; // If it cannot parse the date, return the original value
        }

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    };
    function formatDateFinal(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }


    const handleSort = (order) => {
        if (order === "none") {
            setSortOrder(null); // Clear the sort order
            applyFilters(selectedFilters, filterField); // Reapply filters without sorting
        } else {
            setSortOrder(order);
        }
    };

    useEffect(() => {
        applyFilters(selectedFilters, filterField);
    }, [sortOrder]);


    let totalMaturedCount = 0;
    let totalTargetAmount = 0;
    let totalAchievedAmount = 0;
    //const currentYear = initialDate.getFullYear();
    const filteredDate = new Date(bookingStartDate);
    //const filteredYear = filteredDate.getFullYear();
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
    //const filteredMonth = monthNames[filteredDate.getMonth()]
    
    
    const functionCalculateMatured = (bdeName) => {
        const cleanString = (str) => {
            return str.replace(/\u00A0/g, ' ').trim();
        };

        let maturedCount = 0;

        redesignedData.map((mainBooking) => {
            const bookingDate = new Date(mainBooking.bookingDate);
            const startDate = new Date(bookingStartDate);
            const endDate = new Date(bookingEndDate);
            bookingDate.setHours(0, 0, 0, 0);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);

            const isSameDayMonthYear = (date1, date2) => {
                return (
                    date1.getDate() === date2.getDate() &&
                    date1.getMonth() === date2.getMonth() &&
                    date1.getFullYear() === date2.getFullYear()
                );
            };

            if (bookingDate >= startDate && bookingDate <= endDate || (isSameDayMonthYear(bookingDate, startDate) && isSameDayMonthYear(bookingDate, endDate))) {
                if ((mainBooking.bdeName) === (bdeName) || (mainBooking.bdmName) === (bdeName)) {
                    if ((mainBooking.bdeName) === (mainBooking.bdmName)) {
                        maturedCount = maturedCount + 1;
                    } else if ((mainBooking.bdeName) !== (mainBooking.bdmName) && mainBooking.bdmType === "Close-by") {
                        maturedCount = maturedCount + 0.5;
                    } else if ((mainBooking.bdeName) !== (mainBooking.bdmName) && mainBooking.bdmType === "Supported-by") {
                        if ((mainBooking.bdeName) === (bdeName)) {
                            maturedCount = maturedCount + 1;
                        }
                    }
                }
            }

            mainBooking.moreBookings.map((moreObject) => {
                const moreBookingDate = new Date(moreObject.bookingDate);
                moreBookingDate.setHours(0, 0, 0, 0);
                if ((moreBookingDate >= startDate && moreBookingDate <= endDate) || (isSameDayMonthYear(moreBookingDate, startDate) && isSameDayMonthYear(moreBookingDate, endDate))) {
                    if ((moreObject.bdeName) === (bdeName) || (moreObject.bdmName) === (bdeName)) {
                        if ((moreObject.bdeName) === (moreObject.bdmName)) {
                            maturedCount = maturedCount + 1;
                        } else if ((moreObject.bdeName) !== (moreObject.bdmName) && moreObject.bdmType === "Close-by") {
                            maturedCount = maturedCount + 0.5;
                        } else if ((moreObject.bdeName) !== (moreObject.bdmName) && moreObject.bdmType === "Supported-by") {
                            if ((moreObject.bdeName) === (bdeName)) {
                                maturedCount = maturedCount + 1;
                            }
                        }
                    }
                }
            });
        });

        totalMaturedCount = totalMaturedCount + maturedCount;

        return maturedCount;
    };

    const functionGetAmount = (object) => {
        const thisDate = new Date(bookingStartDate);
        const thisYear = thisDate.getFullYear();
        const thisMonth = monthNames[thisDate.getMonth()];

        if (object.targetDetails.length !== 0) {
            const foundObject = object.targetDetails.find(
                (item) =>
                    Math.floor(item.year) === thisYear && item.month === thisMonth
            );
            totalTargetAmount =
                foundObject &&
                Math.floor(totalTargetAmount) + Math.floor(foundObject.amount);

            return foundObject ? foundObject.amount : 0;
        } else {
            return 0;
        }
    };

    const functionCalculateAchievedAmount = (bdeName) => {
        let achievedAmount = 0;
        let remainingAmount = 0;
        let expanse = 0;
        let remainingExpense = 0;
        let remainingMoreExpense = 0;
        let add_caCommision = 0;
        const cleanString = (str) => (str ? str.replace(/\s+/g, '').toLowerCase() : '');

        redesignedData.map((mainBooking) => {

            const bookingDate = new Date(mainBooking.bookingDate);
            const startDate = new Date(bookingStartDate);
            const endDate = new Date(bookingEndDate);
            bookingDate.setHours(0, 0, 0, 0);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);
            const isSameDayMonthYear = (date1, date2) => {
                return (
                    date1.getDate() === date2.getDate() &&
                    date1.getMonth() === date2.getMonth() &&
                    date1.getFullYear() === date2.getFullYear()
                );
            };
            if (bookingDate >= startDate && bookingDate <= endDate || (isSameDayMonthYear(bookingDate, startDate) && isSameDayMonthYear(bookingDate, endDate))) {
                if (cleanString(mainBooking.bdeName) === cleanString(bdeName) || cleanString(mainBooking.bdmName) === cleanString(bdeName)) {
                    //console.log("Ye add hone ja raha :" ,bdeName, Math.floor(mainBooking.generatedReceivedAmount)/2 )
                    if (mainBooking.bdeName === mainBooking.bdmName) {
                        //achievedAmount = achievedAmount + Math.floor(mainBooking.generatedReceivedAmount);
                        mainBooking.services.map(serv => {
                            if (serv.paymentTerms === "Full Advanced") {
                                //console.log("Ye add hone ja raha :", mainBooking['Company Name'], bdeName, serv.totalPaymentWOGST)
                                achievedAmount = achievedAmount + serv.totalPaymentWOGST;

                            } else {
                                //console.log("Ye add hone ja raha :", mainBooking['Company Name'], bdeName, Math.round(serv.firstPayment))
                                if (serv.withGST) {
                                    achievedAmount = achievedAmount + Math.round(serv.firstPayment / 1.18);
                                } else {
                                    achievedAmount = achievedAmount + Math.round(serv.firstPayment);
                                }
                            }

                            // console.log(serv.expanse , bdeName ,"this is services");
                            let expanseDate = null
                            if (serv.expanse) {
                                // console.log("Ye add hone ja raha expanse :", mainBooking['Company Name'], bdeName, serv.expanse)
                                expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

                                expanseDate.setHours(0, 0, 0, 0);
                                const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                expanse = condition ? expanse + serv.expanse : expanse;
                            }
                        });
                        if (mainBooking.caCase === "Yes") {
                            //console.log("Ye add hone ja raha commision :", mainBooking['Company Name'], bdeName, mainBooking.caCommission)

                            add_caCommision += parseInt(mainBooking.caCommission);
                        }


                    } else if (cleanString(mainBooking.bdeName) !== cleanString(mainBooking.bdmName) && mainBooking.bdmType === "Close-by") {
                        //console.log("Ye add hone ja raha :" ,bdeName, Math.floor(mainBooking.generatedReceivedAmount)/2 )
                        //achievedAmount = achievedAmount + Math.floor(mainBooking.generatedReceivedAmount) / 2;
                        mainBooking.services.map(serv => {
                            if (serv.paymentTerms === "Full Advanced") {
                                //console.log("Ye add hone ja raha :", mainBooking['Company Name'], bdeName, serv.totalPaymentWOGST)
                                achievedAmount = achievedAmount + serv.totalPaymentWOGST / 2;
                            } else {
                                if (serv.withGST) {
                                    //console.log("Ye add hone ja raha :", mainBooking['Company Name'], bdeName, Math.round(serv.firstPayment))

                                    achievedAmount = achievedAmount + Math.round(serv.firstPayment / 1.18) / 2;
                                } else {
                                    achievedAmount = achievedAmount + Math.round(serv.firstPayment) / 2;
                                }
                            }
                            // console.log(serv.expanse , bdeName ,"this is services");
                            let expanseDate = null
                            if (serv.expanse) {
                                //console.log("Ye add hone ja raha expanse :", mainBooking['Company Name'], bdeName, serv.expanse)

                                expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

                                expanseDate.setHours(0, 0, 0, 0);
                                const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                expanse = condition ? expanse + serv.expanse / 2 : expanse;
                            }
                        });
                        if (mainBooking.caCase === "Yes") {
                            //console.log("Ye add hone ja raha commision :", mainBooking['Company Name'], bdeName, mainBooking.caCommission)

                            add_caCommision += parseInt(mainBooking.caCommission) / 2;
                        }

                    } else if (cleanString(mainBooking.bdeName) !== cleanString(mainBooking.bdmName) && mainBooking.bdmType === "Supported-by") {
                        if (mainBooking.bdeName === bdeName) {
                            //console.log("Ye add hone ja raha :" ,mainBooking["Company Name"] ,  bdeName , Math.floor(mainBooking.generatedReceivedAmount) )
                            //achievedAmount += Math.floor(mainBooking.generatedReceivedAmount);
                            mainBooking.services.map(serv => {
                                if (serv.paymentTerms === "Full Advanced") {
                                    //console.log("Ye add hone ja raha :", mainBooking['Company Name'], bdeName, serv.totalPaymentWOGST)

                                    achievedAmount = achievedAmount + serv.totalPaymentWOGST;
                                } else {
                                    //console.log("Ye add hone ja raha :", mainBooking['Company Name'], bdeName, Math.round(serv.firstPayment))
                                    if (serv.withGST === undefined || serv.withGST === true) {
                                        //console.log("Ye add hone ja raha :", mainBooking['Company Name'], bdeName, Math.round(serv.firstPayment))
                                        achievedAmount = achievedAmount + Math.round(serv.firstPayment / 1.18);
                                    } else {
                                        achievedAmount = achievedAmount + Math.round(serv.firstPayment);
                                    }
                                }
                                // console.log(serv.expanse , bdeName ,"this is services");
                                let expanseDate;
                                if (serv.expanse) {
                                    //console.log("Ye add hone ja raha expanse :", mainBooking['Company Name'], bdeName, serv.expanse)
                                    expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);
                                    expanseDate.setHours(0, 0, 0, 0);
                                    const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                    expanse = condition ? expanse + serv.expanse : expanse;
                                }
                            });
                            if (mainBooking.caCase === "Yes") {
                                //console.log("Ye add hone ja raha commision :", mainBooking['Company Name'], bdeName, mainBooking.caCommission)
                                add_caCommision += parseInt(mainBooking.caCommission);
                            }
                        }
                    }
                }

            }
            if (mainBooking.remainingPayments.length !== 0) {
                mainBooking.remainingPayments.map((remainingObj) => {
                    const remainingPaymentDate = new Date(remainingObj.paymentDate);
                    remainingPaymentDate.setHours(0, 0, 0, 0);
                    if (((remainingPaymentDate >= startDate && remainingPaymentDate <= endDate) || (isSameDayMonthYear(remainingPaymentDate, startDate) && isSameDayMonthYear(remainingPaymentDate, endDate))) && (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName) && (new Date(remainingObj.paymentDate).getMonth() !== new Date(mainBooking.bookingDate).getMonth() && new Date(remainingObj.paymentDate).getFullYear() !== new Date(mainBooking.bookingDate).getFullYear())) {
                        mainBooking.services.forEach(serv => {
                            if (serv.expanseDate && new Date(serv.expanseDate) >= startDate && new Date(serv.expanseDate) <= endDate) {
                                if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
                                    remainingExpense += serv.expanse / 2;
                                } else if (mainBooking.bdeName === mainBooking.bdmName) {
                                    remainingExpense += serv.expanse;
                                } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by" && mainBooking.bdeName === bdeName) {
                                    remainingExpense += serv.expanse;
                                }
                            }
                        });
                    }
                });
                mainBooking.remainingPayments.map((remainingObj) => {
                    const moreBookingDate = new Date(remainingObj.paymentDate);
                    moreBookingDate.setHours(0, 0, 0, 0);
                    if (((moreBookingDate >= startDate && moreBookingDate <= endDate) || (isSameDayMonthYear(moreBookingDate, startDate) && isSameDayMonthYear(moreBookingDate, endDate))) && (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName)) {
                        const findService = mainBooking.services.find((services) => services.serviceName === remainingObj.serviceName);
                        mainBooking.services.forEach(service => {
                            //console.log(`Service name: ${service.serviceName}`);
                        });
                        if (findService) { // Check if findService is defined
                            // console.log("findService1", findService, mainBooking["Company Name"])
                            const tempAmount = findService.withGST ? Math.floor(remainingObj.receivedPayment) / 1.18 : Math.floor(remainingObj.receivedPayment);
                            //console.log("yahan add ho rha remianing amount", mainBooking["Company Name"], tempAmount)
                            if (mainBooking.bdeName === mainBooking.bdmName) {
                                remainingAmount += Math.floor(tempAmount);
                            } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
                                remainingAmount += Math.floor(tempAmount) / 2;
                            } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
                                if (mainBooking.bdeName === bdeName) {
                                    remainingAmount += Math.floor(tempAmount);
                                }
                            }
                        } else {
                            console.warn(`Service with name ${remainingObj.serviceName} not found for booking ${mainBooking["Company Name"]}`);
                        }
                    }
                })
            }
            mainBooking.moreBookings.length !== 0 && mainBooking.moreBookings.map((moreObject) => {
                const moreBookingDate = new Date(moreObject.bookingDate);
                moreBookingDate.setHours(0, 0, 0, 0);
                if ((moreBookingDate >= startDate && moreBookingDate <= endDate) || (isSameDayMonthYear(moreBookingDate, startDate) && isSameDayMonthYear(moreBookingDate, endDate))) {
                    if (cleanString(moreObject.bdeName) === cleanString(bdeName) || cleanString(moreObject.bdmName) === cleanString(bdeName)) {
                        if (moreObject.bdeName === moreObject.bdmName) {
                            //console.log("Ye add hone ja raha more booking:",mainBooking["Company Name"], bdeName , Math.floor(moreObject.generatedReceivedAmount) )
                            //achievedAmount = achievedAmount + Math.floor(moreObject.generatedReceivedAmount);
                            moreObject.services.map(serv => {
                                // console.log(serv.expanse , bdeName ,"this is services");
                                if (serv.paymentTerms === "Full Advanced") {
                                    //console.log("Ye add hone ja raha :", mainBooking['Company Name'], bdeName, serv.totalPaymentWOGST)
                                    achievedAmount = achievedAmount + serv.totalPaymentWOGST;
                                } else {
                                    if (serv.withGST) {
                                        //console.log("Ye add hone ja raha :", mainBooking['Company Name'], bdeName, Math.round(serv.firstPayment))

                                        achievedAmount = achievedAmount + Math.round(serv.firstPayment / 1.18);
                                    } else {
                                        achievedAmount = achievedAmount + Math.round(serv.firstPayment);
                                    }
                                }
                                let expanseDate = null
                                if (serv.expanse) {
                                    //console.log("Ye add hone ja raha expanse :", mainBooking['Company Name'], bdeName, serv.expanse)
                                    expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);
                                    expanseDate.setHours(0, 0, 0, 0);
                                    const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                    expanse = condition ? expanse + serv.expanse : expanse;
                                    //console.log("Ye add hone ja raha expanse :", mainBooking['Company Name'] ,bdeName ,serv.expanse )

                                }
                            });
                            if (moreObject.caCase === "Yes") {
                                add_caCommision += parseInt(moreObject.caCommission);
                            }
                        } else if (cleanString(moreObject.bdeName) !== cleanString(moreObject.bdmName) && moreObject.bdmType === "Close-by") {
                            //console.log("Ye add hone ja raha :", bdeName, Math.floor(moreObject.generatedReceivedAmount) / 2)
                            //achievedAmount = achievedAmount + Math.floor(moreObject.generatedReceivedAmount) / 2;
                            moreObject.services.map(serv => {
                                if (serv.paymentTerms === "Full Advanced") {
                                    //console.log("Ye add hone ja raha :", mainBooking['Company Name'], bdeName, serv.totalPaymentWOGST)

                                    achievedAmount = achievedAmount + serv.totalPaymentWOGST / 2;
                                } else {
                                    if (serv.withGST) {
                                        //console.log("Ye add hone ja raha :", mainBooking['Company Name'], bdeName, Math.round(serv.firstPayment))

                                        achievedAmount = achievedAmount + Math.round(serv.firstPayment / 1.18) / 2;
                                    } else {
                                        achievedAmount = achievedAmount + Math.round(serv.firstPayment) / 2;
                                    }
                                }
                                // console.log(serv.expanse , bdeName ,"this is services");
                                let expanseDate = null
                                if (serv.expanse) {
                                    //console.log("Ye add hone ja raha expanse :", mainBooking['Company Name'], bdeName, serv.expanse)

                                    expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

                                    expanseDate.setHours(0, 0, 0, 0);
                                    const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                    expanse = condition ? expanse + serv.expanse / 2 : expanse;
                                }
                            });
                            if (moreObject.caCase === "Yes") {
                                //console.log("Ye add hone ja raha commision :", mainBooking['Company Name'], bdeName, mainBooking.caCommission)

                                add_caCommision += parseInt(moreObject.caCommission) / 2;
                            }
                        } else if (cleanString(moreObject.bdeName) !== cleanString(moreObject.bdmName) && moreObject.bdmType === "Supported-by") {
                            if (cleanString(moreObject.bdeName) === cleanString(bdeName)) {
                                //console.log("Ye add hone ja raha :", bdeName, Math.floor(moreObject.generatedReceivedAmount))
                                //achievedAmount += Math.floor(moreObject.generatedReceivedAmount);
                                moreObject.services.map(serv => {
                                    if (serv.paymentTerms === "Full Advanced") {
                                        //console.log("Ye add hone ja raha :", mainBooking['Company Name'], bdeName, serv.totalPaymentWOGST)

                                        achievedAmount = achievedAmount + serv.totalPaymentWOGST;
                                    } else {
                                        if (serv.withGST) {
                                            //console.log("Ye add hone ja raha :", mainBooking['Company Name'], bdeName, Math.round(serv.firstPayment))

                                            achievedAmount = achievedAmount + Math.round(serv.firstPayment / 1.18);
                                        } else {
                                            achievedAmount = achievedAmount + Math.round(serv.firstPayment);
                                        }
                                    }
                                    // console.log(serv.expanse , bdeName ,"this is services");
                                    let expanseDate = null
                                    if (serv.expanse) {
                                        //console.log("Ye add hone ja raha expanse :", mainBooking['Company Name'], bdeName, serv.expanse)

                                        expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

                                        expanseDate.setHours(0, 0, 0, 0);
                                        const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                        expanse = condition ? expanse + serv.expanse : expanse;
                                    }
                                });
                                if (moreObject.caCase === "Yes") {
                                    //console.log("Ye add hone ja raha commision :", mainBooking['Company Name'], bdeName, mainBooking.caCommission)

                                    add_caCommision += parseInt(moreObject.caCommission);
                                }
                            }
                        }
                    }
                }
                if (moreObject.remainingPayments.length !== 0) {
                    moreObject.remainingPayments.forEach(item => {
                        if (new Date(item.paymentDate) >= startDate && new Date(item.paymentDate) <= endDate && (moreObject.bdeName === bdeName || moreObject.bdmName === bdeName)) {
                            moreObject.services.forEach(serv => {
                                if (serv.expanseDate && new Date(serv.expanseDate) >= startDate && new Date(serv.expanseDate) <= endDate && (new Date(item.paymentDate).getMonth() !== new Date(moreObject.bookingDate).getMonth() && new Date(item.paymentDate).getFullYear() !== new Date(moreObject.bookingDate).getFullYear())) {
                                    if (cleanString(moreObject.bdeName) !== cleanString(moreObject.bdmName) && moreObject.bdmType === "Close-by") {
                                        remainingExpense += serv.expanse / 2;
                                    } else if (cleanString(moreObject.bdeName) === cleanString(moreObject.bdmName)) {
                                        remainingExpense += serv.expanse;
                                    } else if (cleanString(moreObject.bdeName) !== cleanString(moreObject.bdmName) && moreObject.bdmType === "Supported-by" && moreObject.bdemName === bdeName) {
                                        remainingExpense += serv.expanse;
                                    }
                                }
                            });
                        }
                    });
                    moreObject.remainingPayments.map((remainingObj) => {
                        const moreRemainingDate = new Date(remainingObj.paymentDate);
                        moreRemainingDate.setHours(0, 0, 0, 0);
                        if (((moreRemainingDate >= startDate && moreRemainingDate <= endDate) || (isSameDayMonthYear(moreRemainingDate, startDate) && isSameDayMonthYear(moreRemainingDate, endDate))) && (moreObject.bdeName === bdeName || moreObject.bdmName === bdeName)) {
                            const findService = moreObject.services.find((services) => services.serviceName === remainingObj.serviceName)
                            //console.log("findService2", findService, mainBooking["Company Name"])
                            if (findService) {
                                const tempAmount = findService.withGST ? Math.floor(remainingObj.receivedPayment) / 1.18 : Math.floor(remainingObj.receivedPayment);
                                //console.log("yahan add ho rha remianing amount more booking", mainBooking["Company Name"], tempAmount)
                                if (cleanString(moreObject.bdeName) === cleanString(moreObject.bdmName)) {
                                    remainingAmount += Math.floor(tempAmount);

                                } else if (cleanString(moreObject.bdeName) !== cleanString(moreObject.bdmName) && moreObject.bdmType === "Close-by") {
                                    remainingAmount += Math.floor(tempAmount) / 2;

                                } else if (cleanString(moreObject.bdeName) !== cleanString(moreObject.bdmName) && moreObject.bdmType === "Supported-by") {
                                    if (cleanString(moreObject.bdeName) === cleanString(bdeName)) {
                                        remainingAmount += Math.floor(tempAmount);
                                    }
                                }
                            } else {
                                console.warn(`Service with name ${remainingObj.serviceName} not found for booking ${mainBooking["Company Name"]}`);
                            }

                        }
                    })
                }
            })
        });
        const currentDate = new Date();

        const finalexpanse = expanse + remainingExpense + remainingMoreExpense + add_caCommision;
        totalAchievedAmount = totalAchievedAmount + achievedAmount + Math.floor(remainingAmount) - finalexpanse;
        //console.log("totalAchievedAmount", totalAchievedAmount, bdeName)
        const consoleAchievedAmount = achievedAmount + Math.floor(remainingAmount) - finalexpanse
        //console.log("BDE :" , bdeName,  achievedAmount , remainingAmount , expanse , remainingExpense , remainingMoreExpense, add_caCommision)
        //console.log("check krna", bdeName, achievedAmount, Math.floor(remainingAmount), finalexpanse , totalAchievedAmount)
        return consoleAchievedAmount;
    };
    const functionCalculateOnlyAchieved = (bdeName) => {
        let achievedAmount = 0;
        let remainingAmount = 0;
        let expanse = 0;
        let remainingExpense = 0;
        let remainingMoreExpense = 0;
        let add_caCommision = 0;
        const cleanString = (str) => (str ? str.replace(/\s+/g, '').toLowerCase() : '');
        redesignedData.map((mainBooking) => {
            const bookingDate = new Date(mainBooking.bookingDate);
            const startDate = new Date(bookingStartDate);
            const endDate = new Date(bookingEndDate);
            bookingDate.setHours(0, 0, 0, 0);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);
            const isSameDayMonthYear = (date1, date2) => {
                return (
                    date1.getDate() === date2.getDate() &&
                    date1.getMonth() === date2.getMonth() &&
                    date1.getFullYear() === date2.getFullYear()
                );
            };
            if (bookingDate >= startDate && bookingDate <= endDate || (isSameDayMonthYear(bookingDate, startDate) && isSameDayMonthYear(bookingDate, endDate))) {
                if (cleanString(mainBooking.bdeName) === cleanString(bdeName) || cleanString(mainBooking.bdmName) === cleanString(bdeName)) {
                    if (cleanString(mainBooking.bdeName) === cleanString(mainBooking.bdmName)) {
                        //achievedAmount = achievedAmount + Math.floor(mainBooking.generatedReceivedAmount);
                        mainBooking.services.map(serv => {
                            // console.log(serv.expanse , bdeName ,"this is services");
                            if (serv.paymentTerms === "Full Advanced") {
                                achievedAmount = achievedAmount + serv.totalPaymentWOGST;
                            } else {
                                if (serv.withGST) {
                                    achievedAmount = achievedAmount + Math.round(serv.firstPayment / 1.18);
                                } else {
                                    achievedAmount = achievedAmount + Math.round(serv.firstPayment);
                                }
                            }
                            let expanseDate = null
                            if (serv.expanse) {
                                expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);
                                expanseDate.setHours(0, 0, 0, 0);
                                const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                expanse = condition ? expanse + serv.expanse : expanse;
                            }
                        });
                        if (mainBooking.caCase === "Yes") {
                            add_caCommision += parseInt(mainBooking.caCommission);
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
                            if (serv.expanse) {
                                expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

                                expanseDate.setHours(0, 0, 0, 0);
                                const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                expanse = condition ? expanse + serv.expanse / 2 : expanse;
                            }
                        });
                        if (mainBooking.caCase === "Yes") {
                            add_caCommision += parseInt(mainBooking.caCommission) / 2;
                        }

                    } else if (cleanString(mainBooking.bdeName) !== cleanString(mainBooking.bdmName) && mainBooking.bdmType === "Supported-by") {
                        if (cleanString(mainBooking.bdeName) === cleanString(bdeName)) {
                            //achievedAmount += Math.floor(mainBooking.generatedReceivedAmount);
                            mainBooking.services.map(serv => {
                                // console.log(serv.expanse , bdeName ,"this is services");
                                if (serv.paymentTerms === "Full Advanced") {
                                    achievedAmount = achievedAmount + serv.totalPaymentWOGST;
                                } else {
                                    if (serv.withGST) {
                                        achievedAmount = achievedAmount + Math.round(serv.firstPayment / 1.18);
                                    } else {
                                        achievedAmount = achievedAmount + Math.round(serv.firstPayment);
                                    }
                                }
                                let expanseDate;
                                if (serv.expanse) {
                                    expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

                                    expanseDate.setHours(0, 0, 0, 0);
                                    const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                    expanse = condition ? expanse + serv.expanse : expanse;
                                }
                            });
                            if (mainBooking.caCase === "Yes") {
                                add_caCommision += parseInt(mainBooking.caCommission);
                            }

                        }
                    }
                }

            }
            if (mainBooking.remainingPayments.length !== 0) {
                if (mainBooking.remainingPayments.some(item => new Date(item.paymentDate) >= startDate && new Date(item.paymentDate) <= endDate) && (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName)) {
                    mainBooking.services.forEach(serv => {
                        if (serv.expanseDate && new Date(serv.expanseDate) >= startDate && new Date(serv.expanseDate) <= endDate) {
                            if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
                                remainingExpense += serv.expanse / 2;
                            } else if (mainBooking.bdeName === mainBooking.bdmName) {
                                remainingExpense += serv.expanse;
                            } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Support-by" && mainBooking.bdemName === bdeName) {
                                remainingExpense += serv.expanse;
                            }
                        }
                    });
                }
                mainBooking.remainingPayments.map((remainingObj) => {
                    const moreBookingDate = new Date(remainingObj.paymentDate);

                    moreBookingDate.setHours(0, 0, 0, 0);



                    if (((moreBookingDate >= startDate && moreBookingDate <= endDate) || (isSameDayMonthYear(moreBookingDate, startDate) && isSameDayMonthYear(moreBookingDate, endDate))) && (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName)) {
                        const findService = mainBooking.services.find((services) => services.serviceName === remainingObj.serviceName);
                        //console.log("findService3" , findService , mainBooking["Company Name"])
                        if (findService) { // Check if findService is defined
                            const tempAmount = findService.withGST ? Math.floor(remainingObj.receivedPayment) / 1.18 : Math.floor(remainingObj.receivedPayment);

                            if (cleanString(mainBooking.bdeName) === cleanString(mainBooking.bdmName)) {
                                remainingAmount += Math.floor(tempAmount);
                            } else if (cleanString(mainBooking.bdeName) !== cleanString(mainBooking.bdmName) && mainBooking.bdmType === "Close-by") {
                                remainingAmount += Math.floor(tempAmount) / 2;
                            } else if (cleanString(mainBooking.bdeName) !== cleanString(mainBooking.bdmName) && mainBooking.bdmType === "Supported-by") {
                                if (cleanString(mainBooking.bdeName) === cleanString(bdeName)) {
                                    remainingAmount += Math.floor(tempAmount);
                                }
                            }
                        } else {
                            console.warn(`Service with name ${remainingObj.serviceName} not found for booking ${mainBooking["Company Name"]}`);
                        }
                    }

                })
            }
            mainBooking.moreBookings.length !== 0 && mainBooking.moreBookings.map((moreObject) => {
                const moreBookingDate = new Date(moreObject.bookingDate);
                moreBookingDate.setHours(0, 0, 0, 0);

                if ((moreBookingDate >= startDate && moreBookingDate <= endDate) || (isSameDayMonthYear(moreBookingDate, startDate) && isSameDayMonthYear(moreBookingDate, endDate))) {
                    if (cleanString(moreObject.bdeName) === cleanString(bdeName) || cleanString(moreObject.bdmName) === cleanString(bdeName)) {
                        if (cleanString(moreObject.bdeName) === cleanString(moreObject.bdmName)) {
                            //achievedAmount = achievedAmount + Math.floor(moreObject.generatedReceivedAmount);
                            moreObject.services.map(serv => {
                                // console.log(serv.expanse , bdeName ,"this is services");
                                if (serv.paymentTerms === "Full Advanced") {
                                    achievedAmount = achievedAmount + serv.totalPaymentWOGST;
                                } else {
                                    if (serv.withGST) {
                                        achievedAmount = achievedAmount + Math.round(serv.firstPayment / 1.18);
                                    } else {
                                        achievedAmount = achievedAmount + Math.round(serv.firstPayment);
                                    }
                                }
                                let expanseDate = null
                                if (serv.expanse) {
                                    expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

                                    expanseDate.setHours(0, 0, 0, 0);
                                    const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                    expanse = condition ? expanse + serv.expanse : expanse;
                                }
                            });
                            if (moreObject.caCase === "Yes") {
                                add_caCommision += parseInt(moreObject.caCommission);
                            }
                        } else if (cleanString(moreObject.bdeName) !== cleanString(moreObject.bdmName) && moreObject.bdmType === "Close-by") {
                            //achievedAmount = achievedAmount + Math.floor(moreObject.generatedReceivedAmount) / 2;
                            moreObject.services.map(serv => {
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
                                if (serv.expanse) {
                                    expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

                                    expanseDate.setHours(0, 0, 0, 0);
                                    const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                    expanse = condition ? expanse + serv.expanse / 2 : expanse;
                                }
                            });
                            if (moreObject.caCase === "Yes") {
                                add_caCommision += parseInt(moreObject.caCommission) / 2;
                            }
                        } else if (cleanString(moreObject.bdeName) !== cleanString(moreObject.bdmName) && moreObject.bdmType === "Supported-by") {
                            if (cleanString(moreObject.bdeName) === cleanString(bdeName)) {
                                //achievedAmount += Math.floor(moreObject.generatedReceivedAmount);
                                moreObject.services.map(serv => {
                                    // console.log(serv.expanse , bdeName ,"this is services");
                                    if (serv.paymentTerms === "Full Advanced") {
                                        achievedAmount = achievedAmount + serv.totalPaymentWOGST;
                                    } else {
                                        if (serv.withGST) {
                                            achievedAmount = achievedAmount + Math.round(serv.firstPayment / 1.18);
                                        } else {
                                            achievedAmount = achievedAmount + Math.round(serv.firstPayment);
                                        }
                                    }
                                    let expanseDate = null
                                    if (serv.expanse) {
                                        expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

                                        expanseDate.setHours(0, 0, 0, 0);
                                        const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                        expanse = condition ? expanse + serv.expanse : expanse;
                                    }
                                });
                                if (moreObject.caCase === "Yes") {
                                    add_caCommision += parseInt(moreObject.caCommission);
                                }
                            }
                        }
                    }
                }
                if (moreObject.remainingPayments.length !== 0) {
                    if (moreObject.remainingPayments.some(item => new Date(item.paymentDate) >= startDate && new Date(item.paymentDate) <= endDate) && (moreObject.bdeName === bdeName || moreObject.bdmName === bdeName)) {
                        moreObject.services.forEach(serv => {
                            if (serv.expanseDate && new Date(serv.expanseDate) >= startDate && new Date(serv.expanseDate) <= endDate) {
                                if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by") {
                                    remainingMoreExpense += serv.expanse / 2;
                                } else if (moreObject.bdeName === moreObject.bdmName) {
                                    remainingMoreExpense += serv.expanse;
                                } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Support-by" && moreObject.bdemName === bdeName) {
                                    remainingMoreExpense += serv.expanse;
                                }
                            }

                        });
                    }

                    moreObject.remainingPayments.map((remainingObj) => {
                        const moreRemainingDate = new Date(remainingObj.paymentDate);
                        moreRemainingDate.setHours(0, 0, 0, 0);
                        if (((moreRemainingDate >= startDate && moreRemainingDate <= endDate) || (isSameDayMonthYear(moreRemainingDate, startDate) && isSameDayMonthYear(moreRemainingDate, endDate))) && (moreObject.bdeName === bdeName || moreObject.bdmName === bdeName)) {

                            const findService = moreObject.services.find((services) => services.serviceName === remainingObj.serviceName)
                            //console.log("findService4" , findService , mainBooking["Company Name"])
                            const tempAmount = findService.withGST ? Math.floor(remainingObj.receivedPayment) / 1.18 : Math.floor(remainingObj.receivedPayment);
                            if (cleanString(moreObject.bdeName) === cleanString(moreObject.bdmName)) {
                                remainingAmount += Math.floor(tempAmount);
                              
                            } else if (cleanString(moreObject.bdeName) !== cleanString(moreObject.bdmName) && moreObject.bdmType === "Close-by") {
                                remainingAmount += Math.floor(tempAmount) / 2;
                              
                            } else if (cleanString(moreObject.bdeName) !== cleanString(moreObject.bdmName) && moreObject.bdmType === "Supported-by") {
                                if (cleanString(moreObject.bdeName) === cleanString(bdeName)) {
                                    remainingAmount += Math.floor(tempAmount);
                                   
                                }
                            }
                        }
                    })
                }
            })

        })

        expanse = expanse + remainingExpense + remainingMoreExpense + add_caCommision;
        return achievedAmount + Math.floor(remainingAmount) - expanse;
    }
    const functionGetOnlyAmount = (object) => {
        const thisDate = new Date(bookingStartDate);
        const thisYear = thisDate.getFullYear();
        const thisMonth = monthNames[thisDate.getMonth()];
        if (object.targetDetails.length !== 0) {
            const foundObject = object.targetDetails.find(
                (item) =>
                    Math.floor(item.year) === thisYear && item.month === thisMonth
            );
            if (object.ename === "Swapnil Gurjar") {
                //console.log("foundObject", foundObject)
            }

            return foundObject ? foundObject.amount : 0;
        } else {
            return 0;
        }
    };
    const calculateAchievedRatio = (ename, obj) => {
        const achievedValue = functionCalculateOnlyAchieved(ename);
        const totalAmount = functionGetOnlyAmount(obj);
    
        if (totalAmount === 0) return 0; // Avoid division by zero
    
        return ((achievedValue / totalAmount) * 100).toFixed(2);
    };
    function functionGetLastBookingDate(bdeName) {
        let tempBookingDate = null;
        const cleanString = (str) => (str ? str.replace(/\s+/g, '').toLowerCase() : '');
        const currentYear = new Date().getFullYear(); // Get the current year

        // Filter objects based on bdeName
        redesignedData.map((mainBooking) => {
            const mainBookingDate = new Date(mainBooking.bookingDate);
            const mainBookingYear = mainBookingDate.getFullYear();
            const mainBookingMonth = monthNames[mainBookingDate.getMonth()];

            if (mainBookingMonth === currentMonth && mainBookingYear === currentYear) {
                if (cleanString(mainBooking.bdeName) === cleanString(bdeName) || cleanString(mainBooking.bdmName) === cleanString(bdeName)) {
                    tempBookingDate = mainBookingDate > tempBookingDate ? mainBookingDate : tempBookingDate;
                    //console.log("tempBookingDate", mainBooking["Company Name"], tempBookingDate, mainBooking.bdeName);
                }
            }

            mainBooking.moreBookings.map((moreObject) => {
                const moreObjectDate = new Date(moreObject.bookingDate);
                const moreObjectYear = moreObjectDate.getFullYear();
                const moreObjectMonth = monthNames[moreObjectDate.getMonth()];

                if (moreObjectMonth === currentMonth && moreObjectYear === currentYear) {
                    if (cleanString(moreObject.bdeName) === cleanString(bdeName) || cleanString(moreObject.bdmName) === cleanString(bdeName)) {
                        tempBookingDate = moreObjectDate > tempBookingDate ? moreObjectDate : tempBookingDate;
                        //console.log("tempBookingDate", mainBooking["Company Name"], tempBookingDate, moreObject.bdeName);
                    }
                }
            });
        });

        return tempBookingDate ? formatDateFinal(tempBookingDate) : "No Booking";
    }
    
    useEffect(() => {
        const getValues = (dataSource) => {
            console.log("dataSource", dataSource)
            return dataSource.map(item => {
                if (filterField === 'maturedcases') {
                    return functionCalculateMatured(item.ename); // Calculate matured cases for filtering
                }
                if (filterField === 'target') {
                    return functionGetAmount(item); // Calculate matured cases for filtering
                }
                if (filterField === 'achieved') {
                    return functionCalculateAchievedAmount(item.ename); // Calculate matured cases for filtering
                }
                if (filterField === 'achievedratio') {
                    return calculateAchievedRatio(item.ename , item); // Calculate matured cases for filtering
                }
                  if (filterField === 'lastbookingdate') {
                    return functionGetLastBookingDate(item.ename); // Calculate matured cases for filtering
                }
                return item[filterField]; // Return the filtered field's value
            }).filter(Boolean); // Filter out any falsy values (e.g., null)
        };

        if (filteredData && filteredData.length !== 0) {
            const values = getValues(filteredData);
            setColumnValues([...new Set(values)]); // Set unique values
        } else {
            const values = getValues(dataForFilter);
            setColumnValues([...new Set(values)]); // Set unique values
        }
    }, [filterField, filteredData, dataForFilter, employeeData]);

    console.log("values", columnValues)

    const handleCheckboxChange = (e) => {
        const value = e.target.value; // Checkbox value
        const valueAsString = String(value); // Convert to string for consistent comparison

        setSelectedFilters(prevFilters => {
            const updatedFilters = { ...prevFilters };
            const filtersAsString = updatedFilters[filterField] || [];

            if (filtersAsString.includes(valueAsString)) {
                updatedFilters[filterField] = filtersAsString.filter(filter => String(filter) !== valueAsString);
            } else {
                updatedFilters[filterField] = [...filtersAsString, value];
            }

            return updatedFilters;
        });
    };

    const applyFilters = (filters, column) => {
        // Ensure filters is always an object
        const safeFilters = filters || {};
        let dataToSort;
    
        // Combine all filters across different filter fields
        const allSelectedFilters = Object.values(safeFilters).flat();
        // Start with the data to be filtered
        if (filteredData && filteredData.length !== 0) {
            dataToSort = filteredData.map(item => {
                return {
                    ...item,
                    maturedCases: functionCalculateMatured(item.ename),
                    Target:functionGetAmount(item),
                    Achieved:functionCalculateAchievedAmount(item.ename),
                    AchievedRatio:calculateAchievedRatio(item.ename , item),
                    LastBookingDate:functionGetLastBookingDate(item.ename)
                };
            });
    
            // Apply filters if there are selected filters
            if (allSelectedFilters.length > 0) {
                // Update the active filter fields array
                allFilterFields(prevFields => {
                    return [...prevFields, column];
                });
    
                dataToSort = dataToSort.filter(item => {
                    const match = Object.keys(safeFilters).every(column => {
                        const columnFilters = safeFilters[column];
                        if (column === 'maturedcases') {
                            return columnFilters.includes(item.maturedCases.toString()); // Filter based on matured cases
                        }
                        if (column === 'target') {
                            return columnFilters.includes(item.Target.toString()); // Filter based on matured cases
                        }
                        if (column === 'achieved') {
                            return columnFilters.includes(item.Achieved.toString()); // Filter based on matured cases
                        }
                        if (column === 'achievedratio') {
                            return columnFilters.includes(item.AchievedRatio.toString()); // Filter based on matured cases
                        }
                         if (column === 'lastbookingdate') {
                            return columnFilters.includes(item.LastBookingDate.toString()); // Filter based on matured cases
                        }
                        return columnFilters.includes(String(item[column]));
                    });
    
                    return match;
                });
            }
    
            // Apply sorting based on sortOrder
            if (sortOrder && column) {
                dataToSort = dataToSort.sort((a, b) => {
                    let valueA = a[column];
                    let valueB = b[column];
            
                    // Convert values to numbers if they are numeric strings
                    if (!isNaN(valueA) && !isNaN(valueB)) {
                        valueA = parseFloat(valueA);
                        valueB = parseFloat(valueB);
                    }
            
                    // Handle sorting of numeric values
                    if (typeof valueA === 'number' && typeof valueB === 'number') {
                        return sortOrder === 'oldest' ? valueA - valueB : valueB - valueA;
                    }
            
                    // Handle sorting of string values
                    if (typeof valueA === 'string' && typeof valueB === 'string') {
                        return sortOrder === 'oldest' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
                    }
            
                    // If types don't match, return 0 to skip sorting for this pair
                    return 0;
                });
            }
        } else {
            dataToSort = dataForFilter.map(item => {
                return {
                    ...item,
                    maturedCases: functionCalculateMatured(item.ename),
                    Target:functionGetAmount(item), // Call calculateMaturedCases here
                    Achieved:functionCalculateAchievedAmount(item.ename),// Call calculateMaturedCases here
                    AchievedRatio:calculateAchievedRatio(item.ename , item),// Call calculateMaturedCases here
                    LastBookingDate:functionGetLastBookingDate(item.ename)

                };
            });
    
            // Apply filters if there are selected filters
            if (allSelectedFilters.length > 0) {
                allFilterFields(prevFields => {
                    return [...prevFields, column];
                });
                dataToSort = dataToSort.filter(item => {
                    const match = Object.keys(safeFilters).every(column => {
                        const columnFilters = safeFilters[column];
                        if (column === 'maturedcases') {
                            return columnFilters.includes(item.maturedCases.toString()); // Filter based on matured cases
                        }
                        if (column === 'target') {
                            return columnFilters.includes(item.Target.toString()); // Filter based on matured cases
                        }
                        if (column === 'achieved') {
                            return columnFilters.includes(item.Achieved.toString()); // Filter based on matured cases
                        }
                        if (column === 'achievedratio') {
                            return columnFilters.includes(item.AchievedRatio.toString()); // Filter based on matured cases
                        }
                        if (column === 'lastbookingdate') {
                            return columnFilters.includes(item.LastBookingDate.toString()); // Filter based on matured cases
                        }
                        return columnFilters.includes(String(item[column]));
                    });
                    return match;
                });
            }
    
            // Apply sorting based on sortOrder
            if (sortOrder && column) {
                dataToSort = dataToSort.sort((a, b) => {
                    let valueA = a[column];
                    let valueB = b[column];
            
                    // Convert values to numbers if they are numeric strings
                    if (!isNaN(valueA) && !isNaN(valueB)) {
                        valueA = parseFloat(valueA);
                        valueB = parseFloat(valueB);
                    }
            
                    // Handle sorting of numeric values
                    if (typeof valueA === 'number' && typeof valueB === 'number') {
                        return sortOrder === 'oldest' ? valueA - valueB : valueB - valueA;
                    }
            
                    // Handle sorting of string values
                    if (typeof valueA === 'string' && typeof valueB === 'string') {
                        return sortOrder === 'oldest' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
                    }
            
                    // If types don't match, return 0 to skip sorting for this pair
                    return 0;
                });
            }
        }
    
        onFilter(dataToSort);
    };
    
    

    const handleSelectAll = () => {
        setSelectedFilters(prevFilters => {
            const isAllSelected = prevFilters[filterField]?.length === columnValues.length;

            return {
                ...prevFilters,
                [filterField]: isAllSelected ? [] : [...columnValues]  // Deselect all if already selected, otherwise select all
            };
        });
    };

    const handleClearAll = async () => {
        setSelectedFilters(prevFilters => ({
            ...prevFilters,
            [filterField]: []
        }));
        onFilter(completeData);
        allFilterFields([])
        showingMenu(false)
        // noofItems(0)
        // } catch (error) {
        //     console.error("Error fetching complete data", error.message);
        // }
    };


    return (
        <div>
            <div className="inco-filter">
                <div
                    className="inco-subFilter p-2"
                    onClick={(e) => handleSort("oldest")}
                >
                    <SwapVertIcon style={{ height: "16px" }} />
                    {filterField === "bookingDate" ||
                        filterField === "Company Number" ||
                        filterField === "caNumber" ||
                        filterField === "totalPaymentWGST" ||
                        filterField === "receivedPayment" ||
                        filterField === "pendingPayment" ? "Ascending" : "Sort A TO Z"}
                </div>

                <div
                    className="inco-subFilter p-2"
                    onClick={(e) => handleSort("newest")}
                >
                    <SwapVertIcon style={{ height: "16px" }} />
                    {filterField === "bookingDate" ||
                        filterField === "Company Number" ||
                        filterField === "caNumber" ||
                        filterField === "totalPaymentWGST" ||
                        filterField === "receivedPayment" ||
                        filterField === "pendingPayment" ? "Descending" : "Sort Z TO A"}
                </div>
                {/* <div className="inco-subFilter p-2"
                        onClick={(e) => handleSort("none")}>
                        <SwapVertIcon style={{ height: "16px" }} />
                        None
                    </div> */}
                <div className='w-100'>
                    <div className="inco-subFilter d-flex align-items-center">
                        <div className='filter-check' onClick={handleSelectAll}>
                            <input
                                type="checkbox"
                                checked={selectedFilters[filterField]?.length === columnValues.length}
                                readOnly
                                id='Select_All'
                            />
                        </div>
                        <label className="filter-val p-2" for="Select_All" onClick={handleSelectAll}>
                            Select All
                        </label>
                    </div>
                </div>
                <div className="inco_inner">
                    {columnValues.map(value => (
                        <div key={value} className="inco-subFilter d-flex align-items-center">
                            <div className='filter-check'>
                                <input
                                    type="checkbox"
                                    value={value}
                                    onChange={handleCheckboxChange}
                                    checked={selectedFilters[filterField]?.includes(String(value))}
                                    id={value}
                                />
                            </div>
                            <label className="filter-val p-2" for={value}>
                                {value}
                            </label>
                        </div>
                    ))}
                </div>
                <div className='d-flex align-items-center justify-content-between'>
                    <div className='w-50'>
                        <button className='filter-footer-btn btn-yellow'
                            style={{ backgroundColor: "#e7e5e0" }}
                            onClick={() => {
                                applyFilters(selectedFilters, filterField)
                                showingMenu(false)
                            }}>
                            Apply Filters
                        </button>
                    </div>
                    <div className='w-50'>
                        <button className='filter-footer-btn btn-yellow'
                            style={{ backgroundColor: "#e7e5e0" }}
                            onClick={() => {
                                handleClearAll()
                            }}>
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default FilterTableThisMonthBooking;

