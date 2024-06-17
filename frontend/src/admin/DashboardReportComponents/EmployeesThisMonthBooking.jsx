import React, { useRef, useState, useEffect } from 'react'
import { debounce } from "lodash";
import { useTheme } from '@mui/material/styles';
import axios from "axios";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Calendar from "@mui/icons-material/Event";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import moment from "moment";
import { StaticDateRangePicker } from "@mui/x-date-pickers-pro/StaticDateRangePicker";
import dayjs from "dayjs";
import { IoClose } from "react-icons/io5";
import Nodata from '../../components/Nodata';
//import { options } from "../components/Options.js";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import ClipLoader from "react-spinners/ClipLoader";
import confetti from 'canvas-confetti';

function EmployeesThisMonthBooking() {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [employeeData, setEmployeeData] = useState([])
    const [employeeDataFilter, setEmployeeDataFilter] = useState([])
    const [employeeInfo, setEmployeeInfo] = useState([])
    const [monthBookingPerson, setMonthBookingPerson] = useState([])
    const [uniqueBDE, setUniqueBDE] = useState([]);
    const [redesignedData, setRedesignedData] = useState([]);
    const [companyData, setCompanyData] = useState([]);
    const [bookingStartDate, setBookingStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    const [bookingEndDate, setBookingEndDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0));
    const [generalStartDate, setGeneralStartDate] = useState(new Date());
    const [generalEndDate, setGeneralEndDate] = useState(new Date());
    const [searchBookingBde, setSearchBookingBde] = useState("")
    const [bdeResegnedData, setBdeRedesignedData] = useState([])
    const [initialDate, setInitialDate] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [loading, setLoading] = useState(false)
    const [newSortType, setNewSortType] = useState({
        maturedcase: "none",
        targetamount: "none",
        achievedamount: "none",
        targetratio: "none",
        lastbookingdate: "none"
    });




    //-----------------------dateformats-------------------------------------
    function formatDateFinal(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function formatDateMonth(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }

    //----------------------fetching employee info----------------------------------------
    const fetchEmployeeInfo = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${secretKey}/employee/einfo`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            setEmployeeData(data.filter((employee) => employee.designation === "Sales Executive" || employee.designation === "Sales Manager"));
            setEmployeeDataFilter(data.filter((employee) => employee.designation === "Sales Executive" || employee.designation === "Sales Manager"));
            setEmployeeInfo(data.filter((employee) => employee.designation === "Sales Executive" || employee.designation === "Sales Manager"));
        } catch (error) {
            console.error('Error Fetching Employee Data ', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (redesignedData.length !== 0) {
            setEmployeeData(employeeDataFilter.sort((a, b) => functionCalculateOnlyAchieved(b.ename) - functionCalculateOnlyAchieved(a.ename)));
        }

    }, [redesignedData])

    const debounceDelay = 300;
    //const debouncedFetchEmployeeInfo = debounce(fetchEmployeeInfo, debounceDelay);

    const uniqueBDEobjects =
        employeeData.length !== 0 &&
        uniqueBDE.size !== 0 &&
        employeeData.filter((obj) => Array.from(uniqueBDE).includes(obj.ename));

    useEffect(() => {
        fetchEmployeeInfo()
        fetchRedesignedBookings()
    }, [])

    //------------------------------fetching redesigned data-------------------------------------------------------------
    const fetchRedesignedBookings = async () => {
        try {
            setLoading(true)
            const response = await axios.get(
                `${secretKey}/bookings/redesigned-final-leadData`
            );
            const bookingsData = response.data;
            setBdeRedesignedData(response.data);

            const getBDEnames = new Set();
            bookingsData.forEach((obj) => {
                // Check if the bdeName is already in the Set

                if (!getBDEnames.has(obj.bdeName)) {
                    // If not, add it to the Set and push the object to the final array
                    getBDEnames.add(obj.bdeName);
                }
            });
            setUniqueBDE(getBDEnames);
            setRedesignedData(bookingsData);
        } catch (error) {
            console.log("Error Fetching Bookings Data", error);
        } finally {
            setLoading(false)
        }
    };

    // ------------------------------------------------------- Redesigned Total Bookings Functions ------------------------------------------------------------------
    let totalMaturedCount = 0;
    const [MaturedCount, setMaturedCount] = useState(0);
    let totalTargetAmount = 0;
    let totalAchievedAmount = 0;
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




    const functionCalculateGeneralMatured = () => {
        const tempStartDate = new Date(generalStartDate);
        const tempEndDate = new Date(generalEndDate);
        tempStartDate.setHours(0, 0, 0, 0);
        tempEndDate.setHours(0, 0, 0, 0);

        let totalCount = 0;
        redesignedData.map((mainBooking) => {
            let date = new Date(mainBooking.bookingDate);

            date.setHours(0, 0, 0, 0);



            let condition = (tempStartDate <= date && tempEndDate >= date)

            if (condition) {

                totalCount += 1;
            }
            mainBooking.moreBookings.length !== 0 && mainBooking.moreBookings.map((moreObject) => {
                let date = new Date(moreObject.bookingDate);
                date.setHours(0, 0, 0, 0);
                let condition2 = tempStartDate <= date && tempEndDate >= date
                if (condition2) {

                    totalCount += 1;
                }
            })

        })

        return totalCount;
    }
    const functionCalculateGeneralRevenue = () => {
        let totalCount = 0;
        const todayDate = new Date();
        const tempStartDate = new Date(generalStartDate);
        const tempEndDate = new Date(generalEndDate);
        tempStartDate.setHours(0, 0, 0, 0);
        tempEndDate.setHours(0, 0, 0, 0);
        redesignedData.map((mainBooking) => {
            let date = new Date(mainBooking.bookingDate);
            date.setHours(0, 0, 0, 0);
            let condition = tempStartDate <= date && tempEndDate >= date
            if (condition) {
                totalCount += Math.floor(mainBooking.receivedAmount);
            }
            else if (mainBooking.remainingPayments.length !== 0) {
                mainBooking.remainingPayments.map((remainingObj) => {
                    let date2 = new Date(remainingObj.paymentDate);
                    date2.setHours(0, 0, 0, 0);
                    let conditionMore = tempStartDate <= date2 && tempEndDate >= date2
                    if (conditionMore) {
                        totalCount += Math.floor(remainingObj.receivedPayment);
                    }

                })

            }
            mainBooking.moreBookings.length !== 0 && mainBooking.moreBookings.map((moreObject) => {
                let date = new Date(moreObject.bookingDate);
                date.setHours(0, 0, 0, 0);
                let condition2 = tempStartDate <= date && tempEndDate >= date
                if (condition2) {
                    totalCount += Math.floor(moreObject.receivedAmount);
                } else if (moreObject.remainingPayments.length !== 0) {
                    moreObject.remainingPayments.map((remainingObj) => {
                        let date2 = new Date(remainingObj.paymentDate);
                        date2.setHours(0, 0, 0, 0);
                        let conditionMore = tempStartDate <= date2 && tempEndDate >= date2
                        if (conditionMore) {
                            totalCount += Math.floor(remainingObj.receivedPayment);
                        }

                    })

                }
            })

        })

        return totalCount;
    }
    const functionCalculateGeneralRemaining = () => {
        let totalCount = 0;
        const todayDate = new Date();
        const tempStartDate = new Date(generalStartDate);
        const tempEndDate = new Date(generalEndDate);
        tempStartDate.setHours(0, 0, 0, 0);
        tempEndDate.setHours(0, 0, 0, 0);
        redesignedData.map((mainBooking) => {

            if (mainBooking.remainingPayments.length !== 0) {
                mainBooking.remainingPayments.map((remainingObj) => {
                    let date = new Date(remainingObj.paymentDate);
                    date.setHours(0, 0, 0, 0);
                    let condition = tempStartDate <= date && tempEndDate >= date
                    if (condition) {
                        totalCount += Math.floor(remainingObj.receivedPayment);
                    }

                })

            }
            mainBooking.moreBookings.length !== 0 && mainBooking.moreBookings.map((moreObject) => {
                if (moreObject.remainingPayments.length !== 0) {
                    moreObject.remainingPayments.map((remainingObj) => {
                        let date2 = new Date(remainingObj.paymentDate);
                        date2.setHours(0, 0, 0, 0);
                        let conditionMore = tempStartDate <= date2 && tempEndDate >= date2
                        if (conditionMore) {
                            totalCount += Math.floor(remainingObj.receivedPayment);
                        }

                    })

                }
            })

        })

        return totalCount;
    }
    const functionCalculateGeneralAdvanced = () => {
        let totalCount = 0;
        const todayDate = new Date();
        const tempStartDate = new Date(generalStartDate);
        const tempEndDate = new Date(generalEndDate);
        tempStartDate.setHours(0, 0, 0, 0);
        tempEndDate.setHours(0, 0, 0, 0);
        redesignedData.map((mainBooking) => {
            let date = new Date(mainBooking.bookingDate);
            date.setHours(0, 0, 0, 0);

            let condition = tempStartDate <= date && tempEndDate >= date
            if (condition) {
                mainBooking.services.forEach((service) => {
                    if (service.paymentTerms === "Full Advanced") {
                        totalCount += Math.floor(service.totalPaymentWGST);
                    } else {
                        totalCount += Math.floor(service.firstPayment);
                    }
                })
            }

            mainBooking.moreBookings.length !== 0 && mainBooking.moreBookings.map((moreObject) => {
                let date = new Date(moreObject.bookingDate);
                date.setHours(0, 0, 0, 0);
                let condition2 = tempStartDate <= date && tempEndDate >= date
                if (condition2) {
                    moreObject.services.forEach((service) => {
                        if (service.paymentTerms === "Full Advanced") {
                            totalCount += Math.floor(service.totalPaymentWGST);
                        } else {
                            totalCount += Math.floor(service.firstPayment);
                        }
                    })
                }
            })

        })

        return totalCount;
    }



    const functionCalculateMatured = (bdeName) => {
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
                if (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName) {
                    if (mainBooking.bdeName === mainBooking.bdmName) {
                        maturedCount = maturedCount + 1
                    } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
                        maturedCount = maturedCount + 0.5;
                    } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
                        if (mainBooking.bdeName === bdeName) {
                            maturedCount = maturedCount + 1;
                        }
                    }
                }
            }
            mainBooking.moreBookings.map((moreObject) => {
                const moreBookingDate = new Date(moreObject.bookingDate);
                moreBookingDate.setHours(0, 0, 0, 0);
                if ((moreBookingDate >= startDate && moreBookingDate <= endDate) || (isSameDayMonthYear(moreBookingDate, startDate) && isSameDayMonthYear(moreBookingDate, endDate))) {
                    if (moreObject.bdeName === bdeName || moreObject.bdmName === bdeName) {
                        if (moreObject.bdeName === moreObject.bdmName) {
                            maturedCount = maturedCount + 1;
                        } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by") {
                            maturedCount = maturedCount + 0.5
                        } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by") {
                            if (moreObject.bdeName === bdeName) {
                                maturedCount = maturedCount + 1;
                            }
                        }
                    }
                }
            })


        })

        totalMaturedCount = totalMaturedCount + maturedCount;

        return maturedCount;
    };



    const functionOnlyCalculateMatured = (bdeName) => {
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
                if (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName) {
                    if (mainBooking.bdeName === mainBooking.bdmName) {
                        maturedCount = maturedCount + 1
                    } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
                        maturedCount = maturedCount + 0.5;
                    } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
                        if (mainBooking.bdeName === bdeName) {
                            maturedCount = maturedCount + 1;
                        }
                    }
                }
            }
            mainBooking.moreBookings.map((moreObject) => {
                const moreBookingDate = new Date(moreObject.bookingDate);
                moreBookingDate.setHours(0, 0, 0, 0);
                if ((moreBookingDate >= startDate && moreBookingDate <= endDate) || (isSameDayMonthYear(moreBookingDate, startDate) && isSameDayMonthYear(moreBookingDate, endDate))) {
                    if (moreObject.bdeName === bdeName || moreObject.bdmName === bdeName) {
                        if (moreObject.bdeName === moreObject.bdmName) {
                            maturedCount = maturedCount + 1;
                        } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by") {
                            maturedCount = maturedCount + 0.5
                        } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by") {
                            if (moreObject.bdeName === bdeName) {
                                maturedCount = maturedCount + 1;
                            }
                        }
                    }
                }
            })


        })

        return maturedCount;
    };

    const functionCalculateAchievedAmount = (bdeName) => {
        let achievedAmount = 0;
        let remainingAmount = 0;
        let expanse = 0;
        let remainingExpense = 0;
        let remainingMoreExpense = 0;


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
                if (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName) {

                    if (mainBooking.bdeName === mainBooking.bdmName) {
                        achievedAmount = achievedAmount + Math.floor(mainBooking.generatedReceivedAmount);
                        mainBooking.services.map(serv => {
                            // console.log(serv.expanse , bdeName ,"this is services");
                            let expanseDate = null
                            if (serv.expanse) {
                                expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

                                expanseDate.setHours(0, 0, 0, 0);
                                const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                expanse = condition ? expanse + serv.expanse : expanse;
                            }

                        });

                    } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
                        achievedAmount = achievedAmount + Math.floor(mainBooking.generatedReceivedAmount) / 2;
                        mainBooking.services.map(serv => {
                            // console.log(serv.expanse , bdeName ,"this is services");
                            let expanseDate = null
                            if (serv.expanse) {
                                expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

                                expanseDate.setHours(0, 0, 0, 0);
                                const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                expanse = condition ? expanse + serv.expanse / 2 : expanse;
                            }

                        });
                    } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
                        if (mainBooking.bdeName === bdeName) {
                            achievedAmount += Math.floor(mainBooking.generatedReceivedAmount);
                            mainBooking.services.map(serv => {
                                // console.log(serv.expanse , bdeName ,"this is services");
                                let expanseDate;
                                if (serv.expanse) {
                                    expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

                                    expanseDate.setHours(0, 0, 0, 0);
                                    const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                    expanse = condition ? expanse + serv.expanse : expanse;
                                }
                            });
                        }
                    }
                }

            } else if (mainBooking.remainingPayments.length !== 0) {
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
                // mainBooking.services.map(serv => {
                //     // console.log(serv.expanse , bdeName ,"this is services");
                //     let expanseDate;
                //     // if (mainBooking["Company Name"] === "DANITUM HEALTHTECH PRIVATE LIMITED") {
                //     //     console.log("Ye wali company He:", bdeName, tempAmount)
                //     // }
                //     if (serv.expanse) {
                //         expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);
                //         expanseDate.setHours(0, 0, 0, 0);
                //         const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                //         if (mainBooking["Company Name"] === "DANITUM HEALTHTECH PRIVATE LIMITED") {
                //             console.log("Ye wali compan:", bdeName, serv.expanse, serv.expanseDate, condition)
                //         }
                //         remainingExpense = condition ? serv.expanse : remainingExpense;
                //         console.log(remainingExpense)

                //     }
                // });
                mainBooking.remainingPayments.map((remainingObj) => {
                    const moreBookingDate = new Date(remainingObj.paymentDate);

                    moreBookingDate.setHours(0, 0, 0, 0);



                    if (((moreBookingDate >= startDate && moreBookingDate <= endDate) || (isSameDayMonthYear(moreBookingDate, startDate) && isSameDayMonthYear(moreBookingDate, endDate))) && (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName)) {
                        const findService = mainBooking.services.find((services) => services.serviceName === remainingObj.serviceName)
                        const tempAmount = findService.withGST ? Math.floor(remainingObj.receivedPayment) / 1.18 : Math.floor(remainingObj.receivedPayment);
                        if (mainBooking.bdeName === mainBooking.bdmName) {

                            remainingAmount += Math.floor(tempAmount);


                        } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
                            remainingAmount += Math.floor(tempAmount) / 2;
                            // mainBooking.services.map(serv => {
                            //     // console.log(serv.expanse , bdeName ,"this is services");
                            //     let expanseDate = null
                            //     if (serv.expanse) {
                            //         expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : moreBookingDate;
                            //         expanseDate.setHours(0, 0, 0, 0);
                            //         const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                            //         remainingExpense = condition ? serv.expanse / 2 : remainingExpense;
                            //     }
                            // });
                        } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
                            if (mainBooking.bdeName === bdeName) {
                                remainingAmount += Math.floor(tempAmount);
                                // mainBooking.services.map(serv => {
                                //     // console.log(serv.expanse , bdeName ,"this is services");
                                //     let expanseDate = null
                                //     if (serv.expanse) {
                                //         expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : moreBookingDate;
                                //         expanseDate.setHours(0, 0, 0, 0);
                                //         const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                //         remainingExpense = condition ? serv.expanse : remainingExpense;
                                //     }
                                // });
                            }
                        }
                    }
                })
            }
            mainBooking.moreBookings.map((moreObject) => {
                const moreBookingDate = new Date(moreObject.bookingDate);
                moreBookingDate.setHours(0, 0, 0, 0);

                if ((moreBookingDate >= startDate && moreBookingDate <= endDate) || (isSameDayMonthYear(moreBookingDate, startDate) && isSameDayMonthYear(moreBookingDate, endDate))) {
                    if (moreObject.bdeName === bdeName || moreObject.bdmName === bdeName) {
                        if (moreObject.bdeName === moreObject.bdmName) {
                            achievedAmount = achievedAmount + Math.floor(moreObject.generatedReceivedAmount);
                            moreObject.services.map(serv => {
                                // console.log(serv.expanse , bdeName ,"this is services");
                                let expanseDate = null
                                if (serv.expanse) {
                                    expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

                                    expanseDate.setHours(0, 0, 0, 0);
                                    const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                    expanse = condition ? expanse + serv.expanse : expanse;

                                }
                            });
                        } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by") {
                            achievedAmount = achievedAmount + Math.floor(moreObject.generatedReceivedAmount) / 2;
                            moreObject.services.map(serv => {
                                // console.log(serv.expanse , bdeName ,"this is services");
                                let expanseDate = null
                                if (serv.expanse) {
                                    expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

                                    expanseDate.setHours(0, 0, 0, 0);
                                    const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                    expanse = condition ? expanse + serv.expanse / 2 : expanse;
                                }
                            });
                        } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by") {
                            if (moreObject.bdeName === bdeName) {
                                achievedAmount += Math.floor(moreObject.generatedReceivedAmount);
                                moreObject.services.map(serv => {
                                    // console.log(serv.expanse , bdeName ,"this is services");
                                    let expanseDate = null
                                    if (serv.expanse) {
                                        expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

                                        expanseDate.setHours(0, 0, 0, 0);
                                        const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                        expanse = condition ? expanse + serv.expanse : expanse;
                                    }
                                });
                            }
                        }
                    }
                } else if (moreObject.remainingPayments.length !== 0) {
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
                            const tempAmount = findService.withGST ? Math.floor(remainingObj.receivedPayment) / 1.18 : Math.floor(remainingObj.receivedPayment);
                            if (moreObject.bdeName === moreObject.bdmName) {
                                remainingAmount += Math.floor(tempAmount);
                                // moreObject.services.map(serv => {
                                //     // console.log(serv.expanse , bdeName ,"this is services");
                                //     let expanseDate = null
                                //     if (serv.expanse) {
                                //         expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : moreRemainingDate;
                                //         expanseDate.setHours(0, 0, 0, 0);
                                //         const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                //         remainingMoreExpense = condition ? serv.expanse : remainingMoreExpense;
                                //     }
                                // });
                            } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by") {
                                remainingAmount += Math.floor(tempAmount) / 2;
                                // moreObject.services.map(serv => {
                                //     // console.log(serv.expanse , bdeName ,"this is services");
                                //     let expanseDate = null
                                //     if (serv.expanse) {
                                //         expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : moreRemainingDate;
                                //         expanseDate.setHours(0, 0, 0, 0);
                                //         const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                //         remainingMoreExpense = condition ? serv.expanse / 2 : remainingMoreExpense;
                                //     }
                                // });
                            } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by") {
                                if (moreObject.bdeName === bdeName) {
                                    remainingAmount += Math.floor(tempAmount);
                                    // moreObject.services.map(serv => {
                                    //     // console.log(serv.expanse , bdeName ,"this is services");
                                    //     let expanseDate = null
                                    //     if (serv.expanse) {
                                    //         expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : moreRemainingDate;
                                    //         expanseDate.setHours(0, 0, 0, 0);
                                    //         const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                    //         remainingMoreExpense = condition ? serv.expanse : remainingMoreExpense;
                                    //     }
                                    // });
                                }
                            }
                        }
                    })
                }
            })

        })


        expanse = expanse + remainingExpense + remainingMoreExpense;
        totalAchievedAmount = totalAchievedAmount + achievedAmount + Math.floor(remainingAmount) - expanse;
        return achievedAmount + Math.floor(remainingAmount) - expanse;
    };

    const functionCalculateOnlyAchieved = (bdeName) => {
        let achievedAmount = 0;
        let remainingAmount = 0;
        let expanse = 0;
        let remainingExpense = 0;
        let remainingMoreExpense = 0;

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
                if (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName) {

                    if (mainBooking.bdeName === mainBooking.bdmName) {
                        achievedAmount = achievedAmount + Math.floor(mainBooking.generatedReceivedAmount);
                        mainBooking.services.map(serv => {
                            // console.log(serv.expanse , bdeName ,"this is services");
                            let expanseDate = null
                            if (serv.expanse) {
                                expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

                                expanseDate.setHours(0, 0, 0, 0);
                                const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                expanse = condition ? expanse + serv.expanse : expanse;
                            }

                        });

                    } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
                        achievedAmount = achievedAmount + Math.floor(mainBooking.generatedReceivedAmount) / 2;
                        mainBooking.services.map(serv => {
                            // console.log(serv.expanse , bdeName ,"this is services");
                            let expanseDate = null
                            if (serv.expanse) {
                                expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

                                expanseDate.setHours(0, 0, 0, 0);
                                const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                expanse = condition ? expanse + serv.expanse / 2 : expanse;
                            }

                        });
                    } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
                        if (mainBooking.bdeName === bdeName) {
                            achievedAmount += Math.floor(mainBooking.generatedReceivedAmount);
                            mainBooking.services.map(serv => {
                                // console.log(serv.expanse , bdeName ,"this is services");
                                let expanseDate;
                                if (serv.expanse) {
                                    expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

                                    expanseDate.setHours(0, 0, 0, 0);
                                    const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                    expanse = condition ? expanse + serv.expanse : expanse;
                                }
                            });
                        }
                    }
                }

            } else if (mainBooking.remainingPayments.length !== 0) {
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
                // mainBooking.services.map(serv => {
                //     // console.log(serv.expanse , bdeName ,"this is services");
                //     let expanseDate;
                //     // if (mainBooking["Company Name"] === "DANITUM HEALTHTECH PRIVATE LIMITED") {
                //     //     console.log("Ye wali company He:", bdeName, tempAmount)
                //     // }
                //     if (serv.expanse) {
                //         expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);
                //         expanseDate.setHours(0, 0, 0, 0);
                //         const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                //         if (mainBooking["Company Name"] === "DANITUM HEALTHTECH PRIVATE LIMITED") {
                //             console.log("Ye wali compan:", bdeName, serv.expanse, serv.expanseDate, condition)
                //         }
                //         remainingExpense = condition ? serv.expanse : remainingExpense;
                //         console.log(remainingExpense)

                //     }
                // });
                mainBooking.remainingPayments.map((remainingObj) => {
                    const moreBookingDate = new Date(remainingObj.paymentDate);

                    moreBookingDate.setHours(0, 0, 0, 0);



                    if (((moreBookingDate >= startDate && moreBookingDate <= endDate) || (isSameDayMonthYear(moreBookingDate, startDate) && isSameDayMonthYear(moreBookingDate, endDate))) && (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName)) {
                        const findService = mainBooking.services.find((services) => services.serviceName === remainingObj.serviceName)
                        const tempAmount = findService.withGST ? Math.floor(remainingObj.receivedPayment) / 1.18 : Math.floor(remainingObj.receivedPayment);
                        if (mainBooking.bdeName === mainBooking.bdmName) {

                            remainingAmount += Math.floor(tempAmount);


                        } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
                            remainingAmount += Math.floor(tempAmount) / 2;
                            // mainBooking.services.map(serv => {
                            //     // console.log(serv.expanse , bdeName ,"this is services");
                            //     let expanseDate = null
                            //     if (serv.expanse) {
                            //         expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : moreBookingDate;
                            //         expanseDate.setHours(0, 0, 0, 0);
                            //         const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                            //         remainingExpense = condition ? serv.expanse / 2 : remainingExpense;
                            //     }
                            // });
                        } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
                            if (mainBooking.bdeName === bdeName) {
                                remainingAmount += Math.floor(tempAmount);
                                // mainBooking.services.map(serv => {
                                //     // console.log(serv.expanse , bdeName ,"this is services");
                                //     let expanseDate = null
                                //     if (serv.expanse) {
                                //         expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : moreBookingDate;
                                //         expanseDate.setHours(0, 0, 0, 0);
                                //         const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                //         remainingExpense = condition ? serv.expanse : remainingExpense;
                                //     }
                                // });
                            }
                        }
                    }
                })
            }
            mainBooking.moreBookings.map((moreObject) => {
                const moreBookingDate = new Date(moreObject.bookingDate);
                moreBookingDate.setHours(0, 0, 0, 0);

                if ((moreBookingDate >= startDate && moreBookingDate <= endDate) || (isSameDayMonthYear(moreBookingDate, startDate) && isSameDayMonthYear(moreBookingDate, endDate))) {
                    if (moreObject.bdeName === bdeName || moreObject.bdmName === bdeName) {
                        if (moreObject.bdeName === moreObject.bdmName) {
                            achievedAmount = achievedAmount + Math.floor(moreObject.generatedReceivedAmount);
                            moreObject.services.map(serv => {
                                // console.log(serv.expanse , bdeName ,"this is services");
                                let expanseDate = null
                                if (serv.expanse) {
                                    expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

                                    expanseDate.setHours(0, 0, 0, 0);
                                    const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                    expanse = condition ? expanse + serv.expanse : expanse;

                                }
                            });
                        } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by") {
                            achievedAmount = achievedAmount + Math.floor(moreObject.generatedReceivedAmount) / 2;
                            moreObject.services.map(serv => {
                                // console.log(serv.expanse , bdeName ,"this is services");
                                let expanseDate = null
                                if (serv.expanse) {
                                    expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

                                    expanseDate.setHours(0, 0, 0, 0);
                                    const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                    expanse = condition ? expanse + serv.expanse / 2 : expanse;
                                }
                            });
                        } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by") {
                            if (moreObject.bdeName === bdeName) {
                                achievedAmount += Math.floor(moreObject.generatedReceivedAmount);
                                moreObject.services.map(serv => {
                                    // console.log(serv.expanse , bdeName ,"this is services");
                                    let expanseDate = null
                                    if (serv.expanse) {
                                        expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

                                        expanseDate.setHours(0, 0, 0, 0);
                                        const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                        expanse = condition ? expanse + serv.expanse : expanse;
                                    }
                                });
                            }
                        }
                    }
                } else if (moreObject.remainingPayments.length !== 0) {
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
                            const tempAmount = findService.withGST ? Math.floor(remainingObj.receivedPayment) / 1.18 : Math.floor(remainingObj.receivedPayment);
                            if (moreObject.bdeName === moreObject.bdmName) {
                                remainingAmount += Math.floor(tempAmount);
                                // moreObject.services.map(serv => {
                                //     // console.log(serv.expanse , bdeName ,"this is services");
                                //     let expanseDate = null
                                //     if (serv.expanse) {
                                //         expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : moreRemainingDate;
                                //         expanseDate.setHours(0, 0, 0, 0);
                                //         const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                //         remainingMoreExpense = condition ? serv.expanse : remainingMoreExpense;
                                //     }
                                // });
                            } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by") {
                                remainingAmount += Math.floor(tempAmount) / 2;
                                // moreObject.services.map(serv => {
                                //     // console.log(serv.expanse , bdeName ,"this is services");
                                //     let expanseDate = null
                                //     if (serv.expanse) {
                                //         expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : moreRemainingDate;
                                //         expanseDate.setHours(0, 0, 0, 0);
                                //         const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                //         remainingMoreExpense = condition ? serv.expanse / 2 : remainingMoreExpense;
                                //     }
                                // });
                            } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by") {
                                if (moreObject.bdeName === bdeName) {
                                    remainingAmount += Math.floor(tempAmount);
                                    // moreObject.services.map(serv => {
                                    //     // console.log(serv.expanse , bdeName ,"this is services");
                                    //     let expanseDate = null
                                    //     if (serv.expanse) {
                                    //         expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : moreRemainingDate;
                                    //         expanseDate.setHours(0, 0, 0, 0);
                                    //         const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                    //         remainingMoreExpense = condition ? serv.expanse : remainingMoreExpense;
                                    //     }
                                    // });
                                }
                            }
                        }
                    })
                }
            })

        })

        expanse = expanse + remainingExpense + remainingMoreExpense;
        return achievedAmount + Math.floor(remainingAmount) - expanse;
    }
    const functionCalculateTotalRevenue = (bdeName) => {
        let achievedAmount = 0;
        let remainingAmount = 0;
        let expanse = 0;
        const filterOne = new Date(bookingStartDate).getDate() === new Date().getDate() && new Date(bookingEndDate).getDate() === new Date().getDate();

        if (filterOne) {
            redesignedData.map((mainBooking) => {

                if (monthNames[new Date(mainBooking.bookingDate).getMonth()] === currentMonth) {
                    if (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName) {

                        if (mainBooking.bdeName === mainBooking.bdmName) {
                            achievedAmount = achievedAmount + Math.floor(mainBooking.receivedAmount);
                            mainBooking.services.map(serv => {
                                // console.log(serv.expanse , bdeName ,"this is services");
                                expanse = serv.expanse ? expanse + serv.expanse : expanse;
                            });
                        } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
                            achievedAmount = achievedAmount + Math.floor(mainBooking.receivedAmount) / 2;
                            mainBooking.services.map(serv => {
                                expanse = serv.expanse ? expanse + serv.expanse / 2 : expanse;
                            })
                        } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
                            if (mainBooking.bdeName === bdeName) {
                                achievedAmount += Math.floor(mainBooking.receivedAmount);
                                mainBooking.services.map(serv => {

                                    expanse = serv.expanse ? expanse + serv.expanse : expanse;
                                })
                            }
                        }
                    }

                } else if (mainBooking.remainingPayments.length !== 0) {
                    mainBooking.remainingPayments.map((remainingObj) => {
                        if (monthNames[new Date(remainingObj.paymentDate).getMonth()] === currentMonth && (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName)) {

                            const tempAmount = Math.floor(remainingObj.receivedPayment);
                            if (mainBooking.bdeName === mainBooking.bdmName) {
                                remainingAmount += Math.floor(tempAmount);
                            } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
                                remainingAmount += Math.floor(tempAmount) / 2;
                            } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
                                if (mainBooking.bdeName === bdeName) {
                                    remainingAmount += Math.floor(tempAmount);
                                }
                            }
                        }
                    })
                }
                mainBooking.moreBookings.map((moreObject) => {
                    if (monthNames[new Date(moreObject.bookingDate).getMonth()] === currentMonth) {
                        if (moreObject.bdeName === bdeName || moreObject.bdmName === bdeName) {
                            if (moreObject.bdeName === moreObject.bdmName) {
                                achievedAmount = achievedAmount + Math.floor(moreObject.receivedAmount);
                                moreObject.services.map(serv => {
                                    expanse = serv.expanse ? expanse + serv.expanse : expanse;
                                })
                            } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by") {
                                achievedAmount = achievedAmount + Math.floor(moreObject.receivedAmount) / 2;
                                moreObject.services.map(serv => {
                                    expanse = serv.expanse ? expanse + serv.expanse / 2 : expanse;
                                })
                            } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by") {
                                if (moreObject.bdeName === bdeName) {
                                    achievedAmount += Math.floor(moreObject.receivedAmount);
                                    moreObject.services.map(serv => {
                                        expanse = serv.expanse ? expanse + serv.expanse : expanse;
                                    })
                                }
                            }
                        }
                    } else if (moreObject.remainingPayments.length !== 0) {

                        moreObject.remainingPayments.map((remainingObj) => {
                            if (monthNames[new Date(remainingObj.paymentDate).getMonth()] === currentMonth && (moreObject.bdeName === bdeName || moreObject.bdmName === bdeName)) {


                                const tempAmount = Math.floor(remainingObj.receivedPayment);
                                if (moreObject.bdeName === moreObject.bdmName) {
                                    remainingAmount += Math.floor(tempAmount);
                                } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by") {
                                    remainingAmount += Math.floor(tempAmount) / 2;
                                } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by") {
                                    if (moreObject.bdeName === bdeName) {
                                        remainingAmount += Math.floor(tempAmount);
                                    }
                                }
                            }
                        })
                    }
                })
            })
        } else {
            redesignedData.map((mainBooking) => {

                if (new Date(mainBooking.bookingDate) >= new Date(bookingStartDate) && new Date(mainBooking.bookingDate) <= new Date(bookingEndDate) || new Date(mainBooking.bookingDate).getDate() == new Date(bookingStartDate).getDate() && new Date(mainBooking.bookingDate).getDate() == new Date(bookingEndDate).getDate()) {
                    if (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName) {

                        if (mainBooking.bdeName === mainBooking.bdmName) {
                            achievedAmount = achievedAmount + Math.floor(mainBooking.receivedAmount);

                            mainBooking.services.map(serv => {
                                // console.log(serv.expanse , bdeName ,"this is services");
                                expanse = serv.expanse ? expanse + serv.expanse : expanse;
                            });
                        } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
                            achievedAmount = achievedAmount + Math.floor(mainBooking.receivedAmount) / 2;
                            mainBooking.services.map(serv => {
                                expanse = serv.expanse ? expanse + serv.expanse / 2 : expanse;
                            })
                        } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
                            if (mainBooking.bdeName === bdeName) {
                                achievedAmount += Math.floor(mainBooking.receivedAmount);
                                mainBooking.services.map(serv => {

                                    expanse = serv.expanse ? expanse + serv.expanse : expanse;
                                })
                            }
                        }
                    }

                } else if (mainBooking.remainingPayments.length !== 0) {
                    mainBooking.remainingPayments.map((remainingObj) => {
                        if (((new Date(remainingObj.paymentDate) >= new Date(bookingStartDate) && new Date(remainingObj.paymentDate) <= new Date(bookingEndDate)) || (new Date(remainingObj.paymentDate).getDate() == new Date(bookingStartDate).getDate() && new Date(remainingObj.paymentDate).getDate() == new Date(bookingEndDate).getDate())) && (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName)) {

                            const tempAmount = Math.floor(remainingObj.receivedPayment);
                            if (mainBooking.bdeName === mainBooking.bdmName) {
                                remainingAmount += Math.floor(tempAmount);
                            } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
                                remainingAmount += Math.floor(tempAmount) / 2;
                            } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
                                if (mainBooking.bdeName === bdeName) {
                                    remainingAmount += Math.floor(tempAmount);
                                }
                            }
                        }
                    })
                }
                mainBooking.moreBookings.map((moreObject) => {
                    if ((new Date(moreObject.bookingDate) >= new Date(bookingStartDate) && new Date(moreObject.bookingDate) <= new Date(bookingEndDate)) || (new Date(moreObject.bookingDate).getDate() == new Date(bookingStartDate).getDate() && new Date(moreObject.bookingDate).getDate() == new Date(bookingEndDate).getDate())) {
                        if (moreObject.bdeName === bdeName || moreObject.bdmName === bdeName) {
                            if (moreObject.bdeName === moreObject.bdmName) {
                                achievedAmount = achievedAmount + Math.floor(moreObject.receivedAmount);
                                moreObject.services.map(serv => {
                                    expanse = serv.expanse ? expanse + serv.expanse : expanse;
                                })
                            } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by") {
                                achievedAmount = achievedAmount + Math.floor(moreObject.receivedAmount) / 2;
                                moreObject.services.map(serv => {
                                    expanse = serv.expanse ? expanse + serv.expanse / 2 : expanse;
                                })
                            } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by") {
                                if (moreObject.bdeName === bdeName) {
                                    achievedAmount += Math.floor(moreObject.receivedAmount);
                                    moreObject.services.map(serv => {
                                        expanse = serv.expanse ? expanse + serv.expanse : expanse;
                                    })
                                }
                            }
                        }
                    } else if (moreObject.remainingPayments.length !== 0) {

                        moreObject.remainingPayments.map((remainingObj) => {
                            if (((new Date(remainingObj.paymentDate) >= new Date(bookingStartDate) && new Date(remainingObj.paymentDate) <= new Date(bookingEndDate)) || (new Date(remainingObj.paymentDate).getDate() == new Date(bookingStartDate).getDate() && new Date(remainingObj.paymentDate).getDate() == new Date(bookingEndDate).getDate())) && (moreObject.bdeName === bdeName || moreObject.bdmName === bdeName)) {

                                const tempAmount = Math.floor(remainingObj.receivedPayment);
                                if (moreObject.bdeName === moreObject.bdmName) {
                                    remainingAmount += Math.floor(tempAmount);
                                } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by") {
                                    remainingAmount += Math.floor(tempAmount) / 2;
                                } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by") {
                                    if (moreObject.bdeName === bdeName) {
                                        remainingAmount += Math.floor(tempAmount);
                                    }
                                }
                            }
                        })
                    }
                })
            })
        }

        return achievedAmount + Math.floor(remainingAmount);
    }

    const Filterby = "This Month"

    //     return achievedAmount + Math.floor(remainingAmount) - expanse;
    // };
    const functionCalculateAdvanceCollected = (data) => {
        let achievedAmount = 0;
        let remainingAmount = 0;
        let expanse = 0;
        const today = new Date();


        redesignedData.map((mainBooking) => {
            let condition = false;
            switch (Filterby) {
                case 'Today':
                    condition = (new Date(mainBooking.bookingDate).toLocaleDateString() === today.toLocaleDateString())
                    break;
                case 'Last Month':
                    condition = (new Date(mainBooking.bookingDate).getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1))
                    break;
                case 'This Month':
                    condition = (new Date(mainBooking.bookingDate).getMonth() === today.getMonth())
                    break;
                default:
                    break;
            }
            if (condition && (mainBooking.bdeName === data.ename || mainBooking.bdmName === data.ename)) {
                mainBooking.services.forEach(service => {
                    if (service.paymentTerms === "Full Advanced") {
                        if (mainBooking.bdeName === mainBooking.bdmName) {
                            achievedAmount += Math.floor(service.totalPaymentWGST)
                        } else if ((mainBooking.bdeName !== mainBooking.bdmName) && mainBooking.bdmType === "Close-by") {
                            achievedAmount += Math.floor(service.totalPaymentWGST) / 2
                        } else if ((mainBooking.bdeName !== mainBooking.bdmName) && mainBooking.bdmType === "Supported-by") {
                            if (mainBooking.bdeName === data.ename) {
                                achievedAmount += Math.floor(service.totalPaymentWGST)
                            }
                        }
                    } else {
                        const payment = Math.floor(service.firstPayment)
                        if (mainBooking.bdeName === mainBooking.bdmName) {

                            achievedAmount += Math.floor(payment);
                        } else if ((mainBooking.bdeName !== mainBooking.bdmName) && mainBooking.bdmType === "Close-by") {

                            achievedAmount += Math.floor(payment) / 2;
                        } else if ((mainBooking.bdeName !== mainBooking.bdmName) && mainBooking.bdmType === "Supported-by") {
                            if (mainBooking.bdeName === data.ename) {
                                achievedAmount += Math.floor(payment)
                            }
                        }
                    }
                });
                // if (mainBooking.bdeName === mainBooking.bdmName) {
                //     achievedAmount = achievedAmount + Math.floor(mainBooking.generatedReceivedAmount);
                //     mainBooking.services.map(serv => {
                //         expanse = serv.expanse ? expanse + serv.expanse : expanse;
                //     })
                // } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
                //     achievedAmount = achievedAmount + Math.floor(mainBooking.generatedReceivedAmount) / 2;
                //     mainBooking.services.map(serv => {
                //         expanse = serv.expanse ? expanse + serv.expanse / 2 : expanse;
                //     })
                // } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
                //     if (mainBooking.bdeName === data.ename) {
                //         achievedAmount = achievedAmount + Math.floor(mainBooking.generatedReceivedAmount);
                //         mainBooking.services.map(serv => {
                //             expanse = serv.expanse ? expanse + serv.expanse : expanse;
                //         })
                //     }
                // }
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
                if (condition && (moreObject.bdeName === data.ename || moreObject.bdmName === data.ename)) {
                    moreObject.services.forEach(service => {
                        if (service.paymentTerms === "Full Advanced") {
                            if (moreObject.bdeName === moreObject.bdmName) {
                                achievedAmount += Math.floor(service.totalPaymentWGST)
                            } else if ((moreObject.bdeName !== moreObject.bdmName) && moreObject.bdmType === "Close-by") {
                                achievedAmount += Math.floor(service.totalPaymentWGST) / 2
                            } else if ((moreObject.bdeName !== moreObject.bdmName) && moreObject.bdmType === "Supported-by") {
                                if (moreObject.bdeName === data.ename) {
                                    achievedAmount += Math.floor(service.totalPaymentWGST)
                                }
                            }
                        } else {
                            const payment = Math.floor(service.firstPayment)
                            if (mainBooking.bdeName === mainBooking.bdmName) {

                                achievedAmount += Math.floor(payment);
                            } else if ((mainBooking.bdeName !== mainBooking.bdmName) && mainBooking.bdmType === "Close-by") {

                                achievedAmount += Math.floor(payment) / 2;
                            } else if ((mainBooking.bdeName !== mainBooking.bdmName) && mainBooking.bdmType === "Supported-by") {
                                if (mainBooking.bdeName === data.ename) {
                                    achievedAmount += Math.floor(payment)
                                }
                            }
                        }
                    });

                    // if (moreObject.bdeName === moreObject.bdmName) {
                    //     achievedAmount = achievedAmount + Math.floor(moreObject.generatedReceivedAmount);
                    //     moreObject.services.map(serv => {
                    //         expanse = serv.expanse ? expanse + serv.expanse : expanse;
                    //     })
                    // } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by") {
                    //     achievedAmount = achievedAmount + Math.floor(moreObject.generatedReceivedAmount) / 2;
                    //     moreObject.services.map(serv => {
                    //         expanse = serv.expanse ? expanse + serv.expanse / 2 : expanse;
                    //     })
                    // } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by") {
                    //     if (moreObject.bdeName === data.ename) {
                    //         achievedAmount = achievedAmount + Math.floor(moreObject.generatedReceivedAmount);
                    //         moreObject.services.map(serv => {
                    //             expanse = serv.expanse ? expanse + serv.expanse : expanse;
                    //         })
                    //     }
                    // }

                }
            })


        })

        console.log(achievedAmount, "of", data.ename)
        return achievedAmount;
    };
    const functionCalculatePendingRevenue = (data) => {
        let remainingAmount = 0;
        const today = new Date();

        redesignedData.map((mainBooking) => {

            if (mainBooking.remainingPayments.length !== 0) {
                mainBooking.remainingPayments.map((remainingObj) => {


                    let condition = false;
                    switch (Filterby) {
                        case 'Today':
                            condition = ((new Date(remainingObj.paymentDate).toLocaleDateString() === today.toLocaleDateString()) && (data.ename === mainBooking.bdeName || data.ename === mainBooking.bdmName))
                            break;
                        case 'Last Month':
                            condition = ((new Date(remainingObj.paymentDate).getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1)) && (data.ename === mainBooking.bdeName || data.ename === mainBooking.bdmName))
                            break;
                        case 'This Month':
                            condition = ((new Date(remainingObj.paymentDate).getMonth() === today.getMonth()) && (data.ename === mainBooking.bdeName || data.ename === mainBooking.bdmName))

                            break;
                        default:
                            break;
                    }

                    if (condition) {

                        const tempAmount = Math.floor(remainingObj.receivedPayment);
                        if (mainBooking.bdeName === mainBooking.bdmName) {
                            remainingAmount += Math.floor(tempAmount);
                        } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
                            remainingAmount += Math.floor(tempAmount) / 2;
                        } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
                            if (mainBooking.bdeName === data.ename) {
                                remainingAmount += Math.floor(tempAmount);
                            }
                        }
                    }
                })
            }
            mainBooking.moreBookings.map((moreObject) => {
                if (moreObject.remainingPayments.length !== 0) {
                    moreObject.remainingPayments.map((remainingObj) => {
                        let condition = false;
                        switch (Filterby) {
                            case 'Today':
                                condition = ((new Date(remainingObj.paymentDate).toLocaleDateString() === today.toLocaleDateString()) && (data.ename === mainBooking.bdeName || data.ename === mainBooking.bdmName))
                                break;
                            case 'Last Month':
                                condition = ((new Date(remainingObj.paymentDate).getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1)) && (data.ename === mainBooking.bdeName || data.ename === mainBooking.bdmName))
                                break;
                            case 'This Month':
                                condition = ((new Date(remainingObj.paymentDate).getMonth() === today.getMonth()) && (data.ename === mainBooking.bdeName || data.ename === mainBooking.bdmName))
                                break;
                            default:
                                break;
                        }

                        if (condition) {

                            const tempAmount = Math.floor(remainingObj.receivedPayment);
                            if (moreObject.bdeName === moreObject.bdmName) {
                                remainingAmount += Math.floor(tempAmount);
                            } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by") {
                                remainingAmount += Math.floor(tempAmount) / 2;
                            } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by") {
                                if (moreObject.bdeName === data.ename) {
                                    remainingAmount += Math.floor(tempAmount);
                                }
                            }
                        }
                    })
                }
            })
        })
        console.log(remainingAmount, data.ename)
        return remainingAmount

    };
    const functionGetAmount = (object) => {
        if (object.targetDetails.length !== 0) {
            const foundObject = object.targetDetails.find(
                (item) =>
                    Math.floor(item.year) === currentYear && item.month === currentMonth
            );
            totalTargetAmount =
                foundObject &&
                Math.floor(totalTargetAmount) + Math.floor(foundObject.amount);

            return foundObject ? foundObject.amount : 0;
        } else {
            return 0;
        }
    };
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

    function functionGetLastBookingDate(bdeName) {
        let tempBookingDate = null;
        // Filter objects based on bdeName
        redesignedData.map((mainBooking) => {

            if (monthNames[new Date(mainBooking.bookingDate).getMonth()] === currentMonth) {
                if (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName) {
                    const bookingDate = new Date(mainBooking.bookingDate);
                    tempBookingDate = bookingDate > tempBookingDate ? bookingDate : tempBookingDate;
                }
            }
            mainBooking.moreBookings.map((moreObject) => {
                if (monthNames[new Date(moreObject.bookingDate).getMonth()] === currentMonth) {
                    if (moreObject.bdeName === bdeName || moreObject.bdmName === bdeName) {
                        const bookingDate = new Date(moreObject.bookingDate);
                        tempBookingDate = bookingDate > tempBookingDate ? bookingDate : tempBookingDate;
                    }
                }
            })


        })
        return tempBookingDate ? formatDateFinal(tempBookingDate) : "No Booking";
    }

    let generatedTotalRevenue = 0;


    function functionCalculateGeneratedTotalRevenue(ename) {
        const filterData = bdeResegnedData.filter(obj => obj.bdeName === ename || (obj.bdmName === ename && obj.bdmType === "Close-by"));
        let generatedRevenue = 0;
        const requiredObj = companyData.filter((obj) => (obj.bdmAcceptStatus === "Accept") && obj.Status === "Matured");
        requiredObj.forEach((object) => {
            const newObject = filterData.find(value => value["Company Name"] === object["Company Name"] && value.bdeName === ename);
            if (newObject) {
                generatedRevenue = generatedRevenue + newObject.generatedReceivedAmount;
            }

        });
        generatedTotalRevenue = generatedTotalRevenue + generatedRevenue;
        return generatedRevenue;
    }

    //-------------------this months booking bde search filter---------------------------


    const filterSearchThisMonthBookingBde = (searchTerm) => {
        setEmployeeData(employeeDataFilter.filter((obj) => obj.ename.toLowerCase().includes(searchTerm.toLowerCase())))
    }
    const debouncedFilterSearchThisMonthBookingBde = debounce(filterSearchThisMonthBookingBde, 100)

    //--------------------------------date range filter function---------------------------------
    const numberFormatOptions = {
        style: "currency",
        currency: "INR", // Use the currency code for Indian Rupee (INR)
        minimumFractionDigits: 0, // Minimum number of fraction digits (adjust as needed)
        maximumFractionDigits: 2, // Maximum number of fraction digits (adjust as needed)
    };
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
        {
            label: "Next Month",
            getValue: () => {
                const today = dayjs();
                const startOfNextMonth = today.endOf("month").add(1, "day");
                return [startOfNextMonth, startOfNextMonth.endOf("month")];
            },
        },
        { label: "Reset", getValue: () => [null, null] },
    ];

    const handleGeneralCollectionDateRange = (values) => {
        if (values[1]) {
            const startDate = values[0].format('MM/DD/YYYY')
            const endDate = values[1].format('MM/DD/YYYY')
            setGeneralStartDate(startDate);
            setGeneralEndDate(endDate);
        }
    }
    const handleThisMonthBookingDateRange = (values) => {
        if (values[1]) {
            const startDate = values[0].format('MM/DD/YYYY')
            const endDate = values[1].format('MM/DD/YYYY')
            setBookingStartDate(startDate);
            setBookingEndDate(endDate);
        }

        // setInitialDate(new Date(values[0].format('MM/DD/YYYY')))
        const fileteredData = redesignedData.filter((product) => {
            const productDate = formatDateMonth(product.bookingDate);
            if (startDate === endDate) {
                return productDate === startDate;

            } else if (startDate !== endDate) {
                return (
                    new Date(productDate) >= new Date(startDate) &&
                    new Date(productDate) <= new Date(endDate)
                )
            } else {
                return false;
            }
        })
    }




    //--------------------------multiple employee selection filter function------------------------------------
    const options = employeeDataFilter.map((obj) => obj.ename);

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    function getStyles(name, personName, theme) {
        return {
            fontWeight:
                personName.indexOf(name) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    }

    const theme = useTheme();

    const handleSelectThisMonthBookingEmployees = (selectedEmployeeNames) => {

        const filteredForwardEmployeeData = employeeDataFilter.filter((company) => selectedEmployeeNames.includes(company.ename));

        //console.log("filtetred", filteredForwardEmployeeData)
        if (filteredForwardEmployeeData.length > 0) {

            setEmployeeData(filteredForwardEmployeeData);
        } else if (filteredForwardEmployeeData.length === 0) {
            setEmployeeData(employeeDataFilter)
        }

    };

    // ----------------------------sorting functions---------------------------------
    const [finalEmployeeData, setFinalEmployeeData] = useState([])
    const handleSortMaturedCases = (sortByForwarded) => {

        setNewSortType((prevData) => ({
            ...prevData,
            recievedcase:
                prevData.maturedcase === 'ascending'
                    ? 'descending'
                    : prevData.maturedcase === 'descending'
                        ? 'none'
                        : 'ascending',
        }));

        switch (sortByForwarded) {
            case 'ascending':
                //console.log("yahan chala ascending");
                const companyDataAscending = {};
                // teamLeadsData.forEach((company) => {
                //     if (company.bdmName) {
                //         companyDataAscending[company.bdmName] = (companyDataAscending[company.bdmName] || 0) + 1;
                //     }
                // });
                employeeData.sort((a, b) => {
                    const countA = Math.floor(functionOnlyCalculateMatured(a.ename)) || 0;
                    const countB = Math.floor(functionOnlyCalculateMatured(b.ename)) || 0;
                    return countA - countB;
                });
                break; // Add break statement here

            case 'descending':
                //console.log("yahan chala descending");
                const companyDataDescending = {};
                // teamLeadsData.forEach((company) => {
                //     if (company.bdmName) {
                //         companyDataDescending[company.bdmName] = (companyDataDescending[company.bdmName] || 0) + 1;
                //     }
                // });
                employeeData.sort((a, b) => {
                    const countA = functionOnlyCalculateMatured(a.ename) || 0;
                    const countB = functionOnlyCalculateMatured(b.ename) || 0;
                    return countB - countA;
                });
                break; // Add break statement here

            case "none":
                //console.log("yahan chala none");
                // if (finalEmployeeData.length > 0) {
                //     // Restore to previous state
                //     setForwardEmployeeData(finalEmployeeData);
                // }
                if (finalEmployeeData.length > 0) {
                    // Restore to previous state
                    setEmployeeData(finalEmployeeData);
                }
                break; // Add break statement here
            default:
                break;
        }
    };
    const handleSortAchievedAmount = (sortByForwarded) => {
        console.log(sortByForwarded, "case");
        setNewSortType((prevData) => ({
            ...prevData,
            achievedamount:
                prevData.achievedamount === 'ascending'
                    ? 'descending'
                    : prevData.achievedamount === 'descending'
                        ? 'none'
                        : 'ascending',
        }));

        switch (sortByForwarded) {
            case 'ascending':
                //console.log("yahan chala ascending");
                const companyDataAscending = {};
                // teamLeadsData.forEach((company) => {
                //     if (company.bdmName) {
                //         companyDataAscending[company.bdmName] = (companyDataAscending[company.bdmName] || 0) + 1;
                //     }
                // });

                employeeData.sort((a, b) => {
                    const countA = Math.floor(functionCalculateOnlyAchieved(a.ename)) || 0;
                    console.log(countA, "a")
                    const countB = Math.floor(functionCalculateOnlyAchieved(b.ename)) || 0;
                    console.log(countB, "b")
                    return countA - countB;
                });
                break; // Add break statement here

            case 'descending':
                //console.log("yahan chala descending");
                const companyDataDescending = {};
                // teamLeadsData.forEach((company) => {
                //     if (company.bdmName) {
                //         companyDataDescending[company.bdmName] = (companyDataDescending[company.bdmName] || 0) + 1;
                //     }
                // });
                employeeData.sort((a, b) => {
                    const countA = Math.floor(functionCalculateOnlyAchieved(a.ename)) || 0;
                    const countB = Math.floor(functionCalculateOnlyAchieved(b.ename)) || 0;
                    return countB - countA;
                });
                break; // Add break statement here

            case "none":
                //console.log("yahan chala none");
                if (finalEmployeeData.length > 0) {
                    // Restore to previous state
                    setEmployeeData(finalEmployeeData);
                }
                break; // Add break statement here
            default:
                break;
        }
    };
    const handleSortTargetAmount = (sortByForwarded) => {
        console.log(sortByForwarded, "case");
        setNewSortType((prevData) => ({
            ...prevData,
            targetamount:
                prevData.targetamount === 'ascending'
                    ? 'descending'
                    : prevData.targetamount === 'descending'
                        ? 'none'
                        : 'ascending',
        }));

        switch (sortByForwarded) {
            case 'ascending':
                //console.log("yahan chala ascending");
                const companyDataAscending = {};
                // teamLeadsData.forEach((company) => {
                //     if (company.bdmName) {
                //         companyDataAscending[company.bdmName] = (companyDataAscending[company.bdmName] || 0) + 1;
                //     }
                // });

                employeeData.sort((a, b) => {
                    const countA = Math.floor(functionGetOnlyAmount(a)) || 0;
                    console.log(countA, "a")
                    const countB = Math.floor(functionGetOnlyAmount(b)) || 0;
                    console.log(countB, "b")
                    return countA - countB;
                });
                break; // Add break statement here

            case 'descending':
                //console.log("yahan chala descending");
                const companyDataDescending = {};
                // teamLeadsData.forEach((company) => {
                //     if (company.bdmName) {
                //         companyDataDescending[company.bdmName] = (companyDataDescending[company.bdmName] || 0) + 1;
                //     }
                // });
                employeeData.sort((a, b) => {
                    const countA = Math.floor(functionGetOnlyAmount(a)) || 0;
                    const countB = Math.floor(functionGetOnlyAmount(b)) || 0;
                    return countB - countA;
                });
                break; // Add break statement here

            case "none":
                //console.log("yahan chala none");
                if (finalEmployeeData.length > 0) {
                    // Restore to previous state
                    setEmployeeData(finalEmployeeData);
                }
                break; // Add break statement here
            default:
                break;
        }
    };
    const handleSortRatio = (sortByForwarded) => {
        console.log(sortByForwarded, "case");
        setNewSortType((prevData) => ({
            ...prevData,
            targetratio:
                prevData.targetratio === 'ascending'
                    ? 'descending'
                    : prevData.targetratio === 'descending'
                        ? 'none'
                        : 'ascending',
        }));

        switch (sortByForwarded) {
            case 'ascending':
                //console.log("yahan chala ascending");
                const companyDataAscending = {};
                // teamLeadsData.forEach((company) => {
                //     if (company.bdmName) {
                //         companyDataAscending[company.bdmName] = (companyDataAscending[company.bdmName] || 0) + 1;
                //     }
                // });

                employeeData.sort((a, b) => {
                    const countA = Math.floor(functionCalculateOnlyAchieved(a.ename)) / Math.floor(functionGetOnlyAmount(a)) || 0;

                    const countB = Math.floor(functionCalculateOnlyAchieved(b.ename)) / Math.floor(functionGetOnlyAmount(b)) || 0;

                    return countA - countB;
                });
                break; // Add break statement here

            case 'descending':
                //console.log("yahan chala descending");
                const companyDataDescending = {};
                // teamLeadsData.forEach((company) => {
                //     if (company.bdmName) {
                //         companyDataDescending[company.bdmName] = (companyDataDescending[company.bdmName] || 0) + 1;
                //     }
                // });

                employeeData.sort((a, b) => {
                    const countA = Math.floor(functionCalculateOnlyAchieved(a.ename)) / Math.floor(functionGetOnlyAmount(a)) || 0;

                    const countB = Math.floor(functionCalculateOnlyAchieved(b.ename)) / Math.floor(functionGetOnlyAmount(b)) || 0;

                    return countB - countA;
                });
                break; // Add break statement here

            case "none":
                //console.log("yahan chala none");
                if (finalEmployeeData.length > 0) {
                    // Restore to previous state
                    setEmployeeData(finalEmployeeData);
                }
                break; // Add break statement here
            default:
                break;
        }
    };
    useEffect(() => {
        setFinalEmployeeData([...employeeData]); // Store original state of employeeData
    }, [employeeData]);


    //  ----------------------------------------------------------- Celebration buttons hadi ----------------------------------------------------------------
    const defaults = {
        disableForReducedMotion: true,
    };

    function confettiExplosion(origin) {
        fire(0.25, { spread: 140, startVelocity: 55, origin });
        fire(0.2, { spread: 140, origin });
        fire(0.35, { spread: 120, decay: 0.91, origin });
        fire(0.1, { spread: 140, startVelocity: 25, decay: 0.92, origin });
        fire(0.1, { spread: 140, startVelocity: 45, origin });
    }

    function fire(particleRatio, opts) {
        confetti(
            Object.assign({}, defaults, opts, {
                particleCount: Math.floor(200 * particleRatio),
            })
        );
    }


    const soundRef = useRef(null); // useRef for optional sound element

    useEffect(() => {
        const sound = soundRef.current;
        if (sound) {
            // Preload the sound only once on component mount
            sound.load();
        }
    }, [soundRef]); // Dependency array for sound preloading

    const handleClick = () => {
        const rect = buttonRef.current.getBoundingClientRect();
        const center = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        };
        const origin = {
            x: center.x / window.innerWidth,
            y: center.y / window.innerHeight,
        };

        if (soundRef.current) {
            soundRef.current.currentTime = 0;
            soundRef.current.play();
        }
        confettiExplosion(origin);
    };

    const buttonRef = useRef(null);




    //  ---------------------------------------------- For Creating Remaining Payments Array   ------------------------------------------------
    const remainingMainObject = [];
    const today = new Date();
    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth();


    redesignedData.forEach((mainObj) => {
        if (mainObj.remainingPayments.length !== 0) {
            mainObj.remainingPayments.forEach((payment) => {
                const paymentDate = new Date(payment.paymentDate);
                if (paymentDate.getFullYear() === thisYear && paymentDate.getMonth() === thisMonth) {
                    remainingMainObject.push({
                        "Company Name": mainObj["Company Name"],
                        bdeName: mainObj.bdeName,
                        bdmName: mainObj.bdmName,
                        totalPayment: payment.totalPayment,
                        receivedPayment: payment.receivedPayment,
                        pendingPayment: payment.pendingPayment,
                        paymentDate: payment.paymentDate,
                        serviceName: payment.serviceName
                    });
                }
            });
        }

        mainObj.moreBookings.length !== 0 && mainObj.moreBookings.map((moreObject) => {
            if (moreObject.remainingPayments.length !== 0) {
                moreObject.remainingPayments.forEach((payment) => {
                    const paymentDate = new Date(payment.paymentDate);
                    if (paymentDate.getFullYear() === thisYear && paymentDate.getMonth() === thisMonth) {
                        remainingMainObject.push({
                            "Company Name": mainObj["Company Name"],
                            bdeName: moreObject.bdeName,
                            bdmName: moreObject.bdmName,
                            totalPayment: payment.totalPayment,
                            receivedPayment: payment.receivedPayment,
                            pendingPayment: payment.pendingPayment,
                            paymentDate: payment.paymentDate,
                            serviceName: payment.serviceName
                        });
                    }
                });
            }
        })
    });


    //  ---------------------------------------------   Exporting Booking function  ---------------------------------------------

    const handleExportBookings = async () => {
        const tempData = [];
        const filteredEmpData = employeeData.filter(
            (item) =>
                item.targetDetails.length !== 0 &&
                item.targetDetails.find(
                    (target) =>
                        target.year === currentYear.toString() &&
                        target.month === currentMonth.toString()
                )
        )
        filteredEmpData.forEach((obj, index) => {
            const tempObj = {
                SrNo: index + 1,
                employeeName: obj.ename,
                branchOffice: obj.branchOffice,
                maturedCases: functionOnlyCalculateMatured(obj.ename),
                targetAmount: functionGetOnlyAmount(obj),
                achievedAmount: functionCalculateOnlyAchieved(obj.ename),
                targetAchievedRatio: ((functionCalculateOnlyAchieved(obj.ename) / functionGetOnlyAmount(obj)) * 100),
                lastbookingdate: functionGetLastBookingDate(obj.ename)
            }

            tempData.push(tempObj);
        });

        const response = await axios.post(
            `${secretKey}/bookings/export-this-bookings`,
            {
                tempData
            }
        );
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "ThisMonthBooking.csv");
        document.body.appendChild(link);
        link.click();
    }

    //-----------------------------function for advance payment table-------------------------------
    const advancePaymentObject = [];

    redesignedData.forEach((mainObj) => {
        const bookingDate = new Date(mainObj.bookingDate)
        if (bookingDate.getFullYear() === thisYear && bookingDate.getMonth() === thisMonth) {
            mainObj.services.forEach((service) => {
                if (service.paymentTerms === 'Full Advanced') {
                    advancePaymentObject.push({
                        "Company Name": mainObj["Company Name"],
                        serviceName: service.serviceName,
                        bdeName: mainObj.bdeName,
                        bdmName: mainObj.bdmName,
                        totalPayment: service.totalPaymentWGST,
                        totalAdvanceRecieved: service.totalPaymentWGST,
                        paymentDate: mainObj.bookingDate
                    })
                } else if (service.paymentTerms === "two-part") {
                    advancePaymentObject.push({
                        "Company Name": mainObj["Company Name"],
                        serviceName: service.serviceName,
                        bdeName: mainObj.bdeName,
                        bdmName: mainObj.bdmName,
                        totalPayment: service.totalPaymentWGST,
                        totalAdvanceRecieved: service.firstPayment,
                        paymentDate: mainObj.bookingDate
                    })
                }
            })
        }
    })

    console.log(advancePaymentObject)


    return (
        <div>{/*------------------------------------------------------ Bookings Dashboard ------------------------------------------------------------ */}

            <div className="employee-dashboard mt-2">
                <div className="card mb-2">
                    <div className="card-header employeedashboard d-flex align-items-center justify-content-between p-1">

                        <div className="dashboard-title">
                            <h2 className="m-0 pl-1">
                                Collection Report
                            </h2>
                        </div>
                        <div className="filter-booking d-flex align-items-center">
                            <label htmlFor="date-filter">Filter By :</label>
                            <div className="date-filter mr-1">

                                <select className='form-select' name="date-filter" id="date-filter-admin" onChange={(e) => {
                                    switch (e.target.value) {
                                        case "Today":
                                            const today = new Date();
                                            setGeneralStartDate(today);
                                            setGeneralEndDate(today);
                                            break;
                                        case "This Month":
                                            const now = new Date();
                                            const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                                            const endOfThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                                            setGeneralStartDate(startOfThisMonth);
                                            setGeneralEndDate(endOfThisMonth);
                                            break;
                                        case "Last Month":
                                            const thisTime = new Date();
                                            const startOfLastMonth = new Date(thisTime.getFullYear(), thisTime.getMonth() - 1, 1);
                                            const endOfLastMonth = new Date(thisTime.getFullYear(), thisTime.getMonth(), 0);
                                            setGeneralStartDate(startOfLastMonth);
                                            setGeneralEndDate(endOfLastMonth);
                                            break;


                                        default:
                                            break;
                                    }
                                }}>
                                    <option value="Today">Today</option>
                                    <option value="This Month">This Month</option>
                                    <option value="Last Month">Last Month</option>
                                </select>
                            </div>
                            <div className="date-range-filter">
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs} >
                                    <DemoContainer
                                        components={["SingleInputDateRangeField"]} sx={{
                                            padding: '0px',
                                            with: '220px'
                                        }}  >
                                        <DateRangePicker className="form-control my-date-picker form-control-sm p-0"
                                            onChange={(values) => {
                                                const startDateEmp = moment(values[0]).format(
                                                    "DD/MM/YYYY"
                                                );
                                                const endDateEmp = moment(values[1]).format(
                                                    "DD/MM/YYYY"
                                                );
                                                handleGeneralCollectionDateRange(values); // Call handleSelect with the selected values
                                            }}
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
                    <div className="card-body">
                        <div className="row mt-1">
                            <div className="col">
                                <div className="dash-card-1">
                                    <div className="dash-card-1-head">No. of Bookings</div>
                                    <div className="dash-card-1-body">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="dash-card-1-num clr-1ac9bd">
                                                {functionCalculateGeneralMatured()}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="dash-card-1">
                                    <div className="dash-card-1-head">Total Revenue</div>
                                    <div className="dash-card-1-body">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="dash-card-1-num clr-1cba19">
                                                ₹{
                                                    functionCalculateGeneralRevenue().toLocaleString()
                                                }/-
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="dash-card-1">
                                    <div className="dash-card-1-head">Advanced Collected</div>
                                    <div className="dash-card-1-body">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="dash-card-1-num clr-ffb900">
                                                ₹{functionCalculateGeneralAdvanced().toLocaleString()
                                                }/-

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="dash-card-1">
                                    <div className="dash-card-1-head">Remaining Collection</div>
                                    <div className="dash-card-1-body">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="dash-card-1-num clr-4299e1">
                                                ₹{functionCalculateGeneralRemaining().toLocaleString()}/-
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* --------------------------------  This Month Bookings  ---------------------------------------------- */}
                <div className="card todays-booking totalbooking" id="totalbooking"   >

                    <div className="card-header employeedashboard d-flex align-items-center justify-content-between p-1">

                        <div className="dashboard-title">
                            <h2 className="m-0 pl-1">
                                This Month's Bookings
                            </h2>
                        </div>
                        <div className="filter-booking d-flex align-items-center">
                            <div className="filter-booking mr-1 d-flex align-items-center" >
                                <div className="export-data">
                                    <button className="btn btn-link" onClick={handleExportBookings}>
                                        Export CSV
                                    </button>
                                </div>
                                <div className="filter-title">
                                    <h2 className="m-0 mr-2">
                                        {" "}
                                        Filter Branch : {"  "}
                                    </h2>
                                </div>
                                <div className="filter-main ml-2">
                                    <select
                                        className="form-select"
                                        id={`branch-filter`}
                                        onChange={(e) => {
                                            if (e.target.value === "none") {
                                                setEmployeeData(employeeDataFilter)
                                            } else {
                                                setEmployeeData(employeeDataFilter.filter(obj => obj.branchOffice === e.target.value))
                                            }

                                        }}
                                    >
                                        <option value="" disabled selected>
                                            Select Branch
                                        </option>

                                        <option value={"Gota"}>Gota</option>
                                        <option value={"Sindhu Bhawan"}>
                                            Sindhu Bhawan
                                        </option>
                                        <option value={"none"}>None</option>
                                    </select>
                                </div>
                            </div>
                            <div class='input-icon mr-1'>
                                <span class="input-icon-addon">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                                        <path d="M21 21l-6 -6"></path>
                                    </svg>
                                </span>
                                <input
                                    value={searchBookingBde}
                                    onChange={(e) => {
                                        setSearchBookingBde(e.target.value)
                                        debouncedFilterSearchThisMonthBookingBde(e.target.value)
                                    }}
                                    className="form-control"
                                    placeholder="Enter BDE Name..."
                                    type="text"
                                    name="bdeName-search"
                                    id="bdeName-search" />
                            </div>
                            <div className="data-filter">
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs} >
                                    <DemoContainer
                                        components={["SingleInputDateRangeField"]} sx={{
                                            padding: '0px',
                                            with: '220px'
                                        }}  >
                                        <DateRangePicker className="form-control my-date-picker form-control-sm p-0"
                                            onChange={(values) => {
                                                const startDateEmp = moment(values[0]).format(
                                                    "DD/MM/YYYY"
                                                );
                                                const endDateEmp = moment(values[1]).format(
                                                    "DD/MM/YYYY"
                                                );
                                                handleThisMonthBookingDateRange(values); // Call handleSelect with the selected values
                                            }}
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
                            <div>
                                <FormControl sx={{ ml: 1, minWidth: 200 }}>
                                    <InputLabel id="demo-select-small-label">Select Employee</InputLabel>
                                    <Select
                                        className="form-control my-date-picker my-mul-select form-control-sm p-0"
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        multiple
                                        value={monthBookingPerson}
                                        onChange={(event) => {
                                            setMonthBookingPerson(event.target.value)
                                            handleSelectThisMonthBookingEmployees(event.target.value)
                                        }}
                                        input={<OutlinedInput label="Name" />}
                                        MenuProps={MenuProps}
                                    >
                                        {options.map((name) => (
                                            <MenuItem
                                                key={name}
                                                value={name}
                                                style={getStyles(name, monthBookingPerson, theme)}
                                            >
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row tbl-scroll">
                            <table className="table-vcenter table-nowrap admin-dash-tbl" style={{ maxHeight: "400px" }}>
                                <thead className="admin-dash-tbl-thead">
                                    <tr  >
                                        <th>SR.NO</th>
                                        <th>BDE/BDM NAME</th>
                                        <th>BRANCH</th>
                                        <th style={{ cursor: "pointer" }}
                                            onClick={(e) => {
                                                let updatedSortType;
                                                if (newSortType.maturedcase === "ascending") {
                                                    updatedSortType = "descending";
                                                } else if (newSortType.maturedcase === "descending") {
                                                    updatedSortType
                                                        = "none";
                                                } else {
                                                    updatedSortType = "ascending";
                                                }
                                                setNewSortType((prevData) => ({
                                                    ...prevData,
                                                    maturedcase: updatedSortType,
                                                }));
                                                handleSortMaturedCases(updatedSortType);
                                            }}><div className="d-flex align-items-center justify-content-between">
                                                <div>MATURED CASES</div>
                                                <div className="short-arrow-div">
                                                    <ArrowDropUpIcon className="up-short-arrow"
                                                        style={{
                                                            color:
                                                                newSortType.maturedcase === "descending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                    <ArrowDropDownIcon className="down-short-arrow"
                                                        style={{
                                                            color:
                                                                newSortType.maturedcase === "ascending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                </div>
                                            </div></th>
                                        <th style={{ cursor: "pointer" }}
                                            onClick={(e) => {
                                                let updatedSortType;
                                                if (newSortType.targetamount === "ascending") {
                                                    updatedSortType = "descending";
                                                } else if (newSortType.targetamount === "descending") {
                                                    updatedSortType
                                                        = "none";
                                                } else {
                                                    updatedSortType = "ascending";
                                                }
                                                setNewSortType((prevData) => ({
                                                    ...prevData,
                                                    targetamount: updatedSortType,
                                                }));
                                                handleSortTargetAmount(updatedSortType);
                                            }}><div className="d-flex align-items-center justify-content-between">
                                                <div>TARGET AMOUNT</div>
                                                <div className="short-arrow-div">
                                                    <ArrowDropUpIcon className="up-short-arrow"
                                                        style={{
                                                            color:
                                                                newSortType.targetamount === "descending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                    <ArrowDropDownIcon className="down-short-arrow"
                                                        style={{
                                                            color:
                                                                newSortType.targetamount === "ascending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                </div>
                                            </div></th>
                                        <th style={{ cursor: "pointer" }}
                                            onClick={(e) => {
                                                let updatedSortType;
                                                if (newSortType.achievedamount === "ascending") {
                                                    updatedSortType = "descending";
                                                } else if (newSortType.achievedamount === "descending") {
                                                    updatedSortType
                                                        = "none";
                                                } else {
                                                    updatedSortType = "ascending";
                                                }
                                                setNewSortType((prevData) => ({
                                                    ...prevData,
                                                    achievedamount: updatedSortType,
                                                }));
                                                handleSortAchievedAmount(updatedSortType);
                                            }}><div className="d-flex align-items-center justify-content-between">
                                                <div>ACHIEVED AMOUNT</div>
                                                <div className="short-arrow-div">
                                                    <ArrowDropUpIcon className="up-short-arrow"
                                                        style={{
                                                            color:
                                                                newSortType.achievedamount === "descending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                    <ArrowDropDownIcon className="down-short-arrow"
                                                        style={{
                                                            color:
                                                                newSortType.achievedamount === "ascending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                </div>
                                            </div></th>
                                        <th style={{ cursor: "pointer" }}
                                            onClick={(e) => {
                                                let updatedSortType;
                                                if (newSortType.targetratio === "ascending") {
                                                    updatedSortType = "descending";
                                                } else if (newSortType.targetratio === "descending") {
                                                    updatedSortType
                                                        = "none";
                                                } else {
                                                    updatedSortType = "ascending";
                                                }
                                                setNewSortType((prevData) => ({
                                                    ...prevData,
                                                    targetratio: updatedSortType,
                                                }));
                                                handleSortRatio(updatedSortType);
                                            }}><div className="d-flex align-items-center justify-content-between">
                                                <div>TARGET/ACHIEVED RATIO</div>
                                                <div className="short-arrow-div">
                                                    <ArrowDropUpIcon className="up-short-arrow"
                                                        style={{
                                                            color:
                                                                newSortType.targetratio === "descending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                    <ArrowDropDownIcon className="down-short-arrow"
                                                        style={{
                                                            color:
                                                                newSortType.targetratio === "ascending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                </div>
                                            </div></th>
                                        <th style={{ cursor: "pointer" }}
                                            onClick={(e) => {
                                                let updatedSortType;
                                                if (newSortType.lastbookingdate === "ascending") {
                                                    updatedSortType = "descending";
                                                } else if (newSortType.lastbookingdate === "descending") {
                                                    updatedSortType
                                                        = "none";
                                                } else {
                                                    updatedSortType = "ascending";
                                                }
                                                setNewSortType((prevData) => ({
                                                    ...prevData,
                                                    lastbookingdate: updatedSortType,
                                                }));
                                                handleSortMaturedCases(updatedSortType);
                                            }}><div className="d-flex align-items-center justify-content-between">
                                                <div>LAST BOOKING DATE</div>
                                                <div className="short-arrow-div">
                                                    <ArrowDropUpIcon className="up-short-arrow"
                                                        style={{
                                                            color:
                                                                newSortType.lastbookingdate === "descending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                    <ArrowDropDownIcon className="down-short-arrow"
                                                        style={{
                                                            color:
                                                                newSortType.lastbookingdate === "ascending"
                                                                    ? "black"
                                                                    : "#9d8f8f",
                                                        }}
                                                    />
                                                </div>
                                            </div></th>
                                    </tr>
                                </thead>
                                {loading ? (
                                    <tbody>
                                        <tr>
                                            <td colSpan="12">
                                                <div className="LoaderTDSatyle">
                                                    <ClipLoader
                                                        color="lightgrey"
                                                        loading
                                                        size={30}
                                                        aria-label="Loading Spinner"
                                                        data-testid="loader"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                ) : (
                                    uniqueBDEobjects ? (
                                        <>
                                            <tbody>
                                                {employeeData &&
                                                    employeeData
                                                        .filter(
                                                            (item) =>

                                                                item.targetDetails.length !== 0 &&
                                                                item.targetDetails.find(
                                                                    (target) =>
                                                                        target.year === currentYear.toString() &&
                                                                        target.month === currentMonth.toString()
                                                                )
                                                        )
                                                        .map((obj, index) => (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{obj.ename}</td>
                                                                <td>{obj.branchOffice}</td>
                                                                <td>{functionCalculateMatured(obj.ename)}</td>
                                                                <td>₹ {Math.floor(functionGetAmount(obj)).toLocaleString()}</td>
                                                                <td>₹ {functionCalculateAchievedAmount(obj.ename).toLocaleString()}</td>
                                                                <td>{((functionCalculateOnlyAchieved(obj.ename) / functionGetOnlyAmount(obj)) * 100).toFixed(2)} %</td>
                                                                <td>{functionGetLastBookingDate(obj.ename)}</td>
                                                            </tr>
                                                        ))}
                                            </tbody>
                                            <tfoot className="admin-dash-tbl-tfoot">
                                                <tr>
                                                    <td colSpan={2}>Total:</td>
                                                    <td>-</td>
                                                    <td>{totalMaturedCount}</td>
                                                    <td>₹ {totalTargetAmount.toLocaleString()}</td>
                                                    <td>₹ {totalAchievedAmount.toLocaleString()}</td>
                                                    <td>{((totalAchievedAmount / totalTargetAmount) * 100).toFixed(2)} %</td>
                                                    <td>-</td>
                                                </tr>
                                            </tfoot>
                                        </>
                                    ) : (
                                        <tbody>
                                            <tr>
                                                <td className="particular" colSpan={9}>
                                                    <Nodata />
                                                </td>
                                            </tr>
                                        </tbody>
                                    )
                                )}

                            </table>
                        </div>
                    </div>
                </div>

                {/* ---------------------------------  Remaining Payments Bookings --------------------------------------- */}
                <div className="card todays-booking mt-2 totalbooking" id="remaining-booking"   >

                    <div className="card-header employeedashboard d-flex align-items-center justify-content-between p-1">

                        <div className="dashboard-title">
                            <h2 className="m-0 pl-1">
                                Remaining Payments
                            </h2>
                        </div>

                    </div>
                    <div className="card-body">
                        <div className="row tbl-scroll">
                            <table className="table-vcenter table-nowrap admin-dash-tbl" style={{ maxHeight: "400px" }}>
                                <thead className="admin-dash-tbl-thead">
                                    <tr  >
                                        <th>SR.NO</th>
                                        <th>COMPANY NAME</th>
                                        <th>SERVICE NAME</th>

                                        <th>BDE NAME</th>
                                        <th>BDM NAME</th>
                                        <th>
                                            <div>REMAINING TOTAL</div>
                                        </th>
                                        <th>
                                            <div>REMAINING RECEIVED</div>
                                        </th>
                                        <th>
                                            PAYMENT DATE
                                        </th>
                                    </tr>
                                </thead>
                                {loading ? (
                                    <tbody>
                                        <tr>
                                            <td colSpan="12">
                                                <div className="LoaderTDSatyle">
                                                    <ClipLoader
                                                        color="lightgrey"
                                                        loading
                                                        size={30}
                                                        aria-label="Loading Spinner"
                                                        data-testid="loader"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                ) : (
                                    remainingMainObject.length !== 0 ? (
                                        <>
                                            <tbody>
                                                {remainingMainObject.map((obj, index) => (
                                                    <>
                                                        <tr  >
                                                            <th>{index + 1}</th>
                                                            <th>{obj["Company Name"]}</th>
                                                            <th>{obj.serviceName}</th>
                                                            <th>{obj.bdeName}</th>
                                                            <th>{obj.bdmName}</th>
                                                            <th>
                                                                <div>₹ {Math.round(obj.totalPayment).toLocaleString()}</div>
                                                            </th>
                                                            <th>
                                                                <div>₹ {Math.round(obj.receivedPayment).toLocaleString()}</div>
                                                            </th>
                                                            <th>
                                                                {formatDateFinal(obj.paymentDate)}
                                                            </th>
                                                        </tr>
                                                    </>
                                                ))}

                                            </tbody>
                                            <tfoot className="admin-dash-tbl-tfoot">
                                                <tr>
                                                    <td colSpan={2}>Total:</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>{remainingMainObject.length}</td>
                                                    <td>₹ {remainingMainObject.length !== 0 ? (Math.round(remainingMainObject.reduce((total, curr) => total + curr.totalPayment, 0))).toLocaleString() : 0}</td>
                                                    <td>₹ {remainingMainObject.length !== 0 ? (Math.round(remainingMainObject.reduce((total, curr) => total + curr.receivedPayment, 0))).toLocaleString() : 0}</td>
                                                    {/* <td>₹ {remainingMainObject.length !== 0 ? (remainingMainObject.reduce((total, curr) => total + curr.pendingPayment, 0)).toLocaleString() : 0}</td> */}
                                                    <td>-</td>
                                                </tr>
                                            </tfoot>
                                        </>
                                    ) : (
                                        <tbody>
                                            <tr>
                                                <td className="particular" colSpan={9}>
                                                    <Nodata />
                                                </td>
                                            </tr>
                                        </tbody>
                                    )
                                )}

                            </table>
                        </div>
                    </div>
                </div>
                {/* ---------------------------------  Advanced Collected Bookings --------------------------------------- */}
                <div className="card todays-booking mt-2 totalbooking" id="remaining-booking" >
                    <div className="card-header employeedashboard d-flex align-items-center justify-content-between p-1">
                        <div className="dashboard-title">
                            <h2 className="m-0 pl-1">
                                Advance Payments
                            </h2>
                        </div>

                    </div>
                    <div className="card-body">
                        <div className="row tbl-scroll">
                            <table className="table-vcenter table-nowrap admin-dash-tbl" style={{ maxHeight: "400px" }}>
                                <thead className="admin-dash-tbl-thead">
                                    <tr  >
                                        <th>SR.NO</th>
                                        <th>COMPANY NAME</th>
                                        <th>SERVICE NAME</th>

                                        <th>BDE NAME</th>
                                        <th>BDM NAME</th>
                                        <th>
                                            <div>TOTAL AMOUNT</div>
                                        </th>
                                        <th>
                                            <div>TOTAL ADVANCE RECIEVED</div>
                                        </th>
                                        <th>
                                            PAYMENT DATE
                                        </th>
                                    </tr>
                                </thead>
                                {loading ? (
                                    <tbody>
                                        <tr>
                                            <td colSpan="12">
                                                <div className="LoaderTDSatyle">
                                                    <ClipLoader
                                                        color="lightgrey"
                                                        loading
                                                        size={30}
                                                        aria-label="Loading Spinner"
                                                        data-testid="loader"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                ) : (
                                    advancePaymentObject.length !== 0 ? (
                                        <>
                                            <tbody>
                                                {advancePaymentObject.map((obj, index) => (
                                                    <>
                                                        <tr  >
                                                            <th>{index + 1}</th>
                                                            <th>{obj["Company Name"]}</th>
                                                            <th>{obj.serviceName}</th>
                                                            <th>{obj.bdeName}</th>
                                                            <th>{obj.bdmName}</th>
                                                            <th>
                                                                <div>₹ {Math.round(obj.totalPayment).toLocaleString()}</div>
                                                            </th>
                                                            <th>
                                                                <div>₹ {Math.round(obj.totalAdvanceRecieved).toLocaleString()}</div>
                                                            </th>
                                                            <th>
                                                                {formatDateFinal(obj.paymentDate)}
                                                            </th>
                                                        </tr>
                                                    </>
                                                ))}

                                            </tbody>
                                            <tfoot className="admin-dash-tbl-tfoot">
                                                <tr>
                                                    <td colSpan={2}>Total:</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>{advancePaymentObject.length}</td>
                                                    <td>₹ {advancePaymentObject.length !== 0 ? (Math.round(advancePaymentObject.reduce((total, curr) => total + curr.totalPayment, 0))).toLocaleString() : 0}</td>
                                                    <td>₹ {advancePaymentObject.length !== 0 ? (Math.round(advancePaymentObject.reduce((total, curr) => total + curr.totalAdvanceRecieved, 0))).toLocaleString() : 0}</td>
                                                    <td>-</td>
                                                </tr>
                                            </tfoot>
                                        </>
                                    ) : (
                                        <tbody>
                                            <tr>
                                                <td className="particular" colSpan={9}>
                                                    <Nodata />
                                                </td>
                                            </tr>
                                        </tbody>
                                    )
                                )}

                            </table>
                        </div>
                    </div>
                </div>


            </div></div>
    )
}

export default EmployeesThisMonthBooking