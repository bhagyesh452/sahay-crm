import React, { useState, useEffect } from 'react';
import { debounce } from "lodash";
import { useTheme } from '@mui/material/styles';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import moment from "moment";
import dayjs from "dayjs";
import Calendar from "@mui/icons-material/Event";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useParams } from 'react-router-dom';
import axios from "axios";
import ClipLoader from 'react-spinners/ClipLoader.js';
import Nodata from '../Components/NoData/NoData.jsx';

function FloorManagerThisMonthBookings() {

    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const { userId } = useParams();
    const theme = useTheme();
    const floorManagerName = localStorage.getItem('bdmName');

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;

    const [floorManagerBranch, setFloorManagerBranch] = useState("");
    const [searchBookingBde, setSearchBookingBde] = useState("");
    const [monthBookingPerson, setMonthBookingPerson] = useState([]);
    const [bookingStartDate, setBookingStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    const [bookingEndDate, setBookingEndDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0));
    const [initialDate, setInitialDate] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [uniqueBDE, setUniqueBDE] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);
    const [redesignedData, setRedesignedData] = useState([]);
    const [employeeDataFilter, setEmployeeDataFilter] = useState([]);
    const [finalThisMonthBookingData, setFinalThisMonthBookingData] = useState([]);
    const [newSortType, setNewSortType] = useState({
        maturedcase: "none",
        targetamount: "none",
        achievedamount: "none",
        targetratio: "none",
        lastbookingdate: "none"
    });

    function formatDateMonth(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }

    function formatDateFinal(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const formatSalary = (amount) => {
        return new Intl.NumberFormat('en-IN').format(amount);
    };

    function getStyles(name, personName, theme) {
        return {
            fontWeight:
                personName.indexOf(name) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    }

    const options = employeeDataFilter
        .filter((obj) => obj.ename !== floorManagerName && obj.branchOffice === floorManagerBranch)
        .map((obj) => obj.ename); // Extract only employee names

    const uniqueBDEobjects =
        employeeData.length !== 0 &&
        uniqueBDE.size !== 0 &&
        employeeData.filter((obj) => Array.from(uniqueBDE).includes(obj.ename));

    let totalMaturedCount = 0;
    let totalTargetAmount = 0;
    let totalAchievedAmount = 0;

    const currentYear = initialDate.getFullYear();
    const filteredDate = new Date(bookingStartDate);
    const filteredYear = filteredDate.getFullYear();
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
    const filteredMonth = monthNames[filteredDate.getMonth()];

    const handleSelectThisMonthBookingEmployees = (selectedEmployeeNames) => {
        const filteredForwardEmployeeData = employeeDataFilter.filter((company) => selectedEmployeeNames.includes(company.ename));
        //console.log("filtetred", filteredForwardEmployeeData)
        if (filteredForwardEmployeeData.length > 0) {
            setEmployeeData(filteredForwardEmployeeData);
        } else if (filteredForwardEmployeeData.length === 0) {
            setEmployeeData(employeeDataFilter);
        }
    };

    const fetchEmployeeInfo = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${secretKey}/employee/einfo`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            setEmployeeData(data.filter((employee) => employee.designation === "Sales Executive" || employee.designation === "Sales Manager"));
            setEmployeeDataFilter(data.filter((employee) => employee.designation === "Sales Executive" || employee.designation === "Sales Manager"));
            setIsLoading(false);
        } catch (error) {
            console.error('Error Fetching Employee Data ', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRedesignedBookings = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get(
                `${secretKey}/bookings/redesigned-final-leadData`
            );
            const bookingsData = response.data;
            // setBdeRedesignedData(response.data);

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
            // setCompleteRedesignedData(bookingsData)
            // setRedesignedDataFilter(bookingsData)
        } catch (error) {
            console.log("Error Fetching Bookings Data", error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchFloorManagerDetails = async () => {
        try {
            const res = await axios.get(`${secretKey}/employee/fetchEmployeeFromId/${userId}`);
            // console.log("Fetched details is :", res.data.data);
            setFloorManagerBranch(res.data.data.branchOffice);
        } catch (error) {
            console.log("Error fetching floor manager details :", error);
        }
    };

    useEffect(() => {
        if (redesignedData.length !== 0) {
            setEmployeeData(employeeDataFilter.sort((a, b) => functionCalculateOnlyAchieved(b.ename) - functionCalculateOnlyAchieved(a.ename)));
        }
    }, [redesignedData]);

    useEffect(() => {
        fetchEmployeeInfo();
        fetchRedesignedBookings();
        fetchFloorManagerDetails();
    }, []);

    const filterSearchThisMonthBookingBde = (searchTerm) => {
        setEmployeeData(employeeDataFilter.filter((obj) => obj.ename.toLowerCase().includes(searchTerm.toLowerCase())));
    };

    const debouncedFilterSearchThisMonthBookingBde = debounce(filterSearchThisMonthBookingBde, 100);

    const handleThisMonthBookingDateRange = (values) => {
        if (values[1]) {
            const startDate = values[0].format('MM/DD/YYYY');
            const endDate = values[1].format('MM/DD/YYYY');
            setBookingStartDate(startDate);
            setBookingEndDate(endDate);
        }
        // setInitialDate(new Date(values[0].format('MM/DD/YYYY')));
    };

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
                if (cleanString(mainBooking.bdeName) === cleanString(bdeName) || cleanString(mainBooking.bdmName) === cleanString(bdeName)) {
                    if (cleanString(mainBooking.bdeName) === cleanString(mainBooking.bdmName)) {
                        maturedCount = maturedCount + 1;
                    } else if (cleanString(mainBooking.bdeName) !== cleanString(mainBooking.bdmName) && mainBooking.bdmType === "Close-by") {
                        maturedCount = maturedCount + 0.5;
                    } else if (cleanString(mainBooking.bdeName) !== cleanString(mainBooking.bdmName) && mainBooking.bdmType === "Supported-by") {
                        if (cleanString(mainBooking.bdeName) === cleanString(bdeName)) {
                            maturedCount = maturedCount + 1;
                        }
                    }
                }
            }

            mainBooking.moreBookings.map((moreObject) => {
                const moreBookingDate = new Date(moreObject.bookingDate);
                moreBookingDate.setHours(0, 0, 0, 0);
                if ((moreBookingDate >= startDate && moreBookingDate <= endDate) || (isSameDayMonthYear(moreBookingDate, startDate) && isSameDayMonthYear(moreBookingDate, endDate))) {
                    if (cleanString(moreObject.bdeName) === cleanString(bdeName) || cleanString(moreObject.bdmName) === cleanString(bdeName)) {
                        if (cleanString(moreObject.bdeName) === cleanString(moreObject.bdmName)) {
                            maturedCount = maturedCount + 1;
                        } else if (cleanString(moreObject.bdeName) !== cleanString(moreObject.bdmName) && moreObject.bdmType === "Close-by") {
                            maturedCount = maturedCount + 0.5;
                        } else if (cleanString(moreObject.bdeName) !== cleanString(moreObject.bdmName) && moreObject.bdmType === "Supported-by") {
                            if (cleanString(moreObject.bdeName) === cleanString(bdeName)) {
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
                                    //console.log("Ye add hone ja raha expanse :", mainBooking['Company Name'] ,bdeName ,serv.expanse);
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
                });
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
                            } else if (cleanString(moreObject.bdeName) !== cleanString(moreObject.bdmName) && moreObject.bdmType === "Close-by") {
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
                            } else if (cleanString(moreObject.bdeName) !== cleanString(moreObject.bdmName) && moreObject.bdmType === "Supported-by") {
                                if (cleanString(moreObject.bdeName) === cleanString(bdeName)) {
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
        expanse = expanse + remainingExpense + remainingMoreExpense + add_caCommision;
        return achievedAmount + Math.floor(remainingAmount) - expanse;
    };

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

    const functionOnlyCalculateMatured = (bdeName) => {
        let maturedCount = 0;
        const filteredRedesignedData = redesignedData.filter(
            (obj) => obj.bdeName === bdeName || (obj.bdmName === bdeName && obj.bdmType === "Close-by") || (obj.moreBookings.length !== 0 && obj.moreBookings.some(mainObj => mainObj.bdmName === bdeName && mainObj.bdmType === "Close-by"))
        );
        const filterOne = new Date(bookingStartDate).getDate() === new Date().getDate() && new Date(bookingEndDate).getDate() === new Date().getDate();
        if (filterOne) {
            filteredRedesignedData.map((mainBooking) => {

                if (monthNames[new Date(mainBooking.bookingDate).getMonth()] === currentMonth) {
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
                    if (monthNames[new Date(moreObject.bookingDate).getMonth()] === currentMonth) {
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
        } else {
            filteredRedesignedData.map((mainBooking) => {
                if ((new Date(mainBooking.bookingDate) >= new Date(bookingStartDate) && new Date(mainBooking.bookingDate) <= new Date(bookingEndDate)) || (new Date(mainBooking.bookingDate).getDate() == new Date(bookingStartDate).getDate() && new Date(mainBooking.bookingDate).getDate() == new Date(bookingEndDate).getDate())) {
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
                    if ((new Date(moreObject.bookingDate) >= new Date(bookingStartDate) && new Date(moreObject.bookingDate) <= new Date(bookingEndDate)) || (new Date(moreObject.bookingDate).getDate() == new Date(bookingStartDate).getDate() && new Date(moreObject.bookingDate).getDate() == new Date(bookingEndDate).getDate())) {
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
                });
            });
        }
        totalMaturedCount = totalMaturedCount + maturedCount;
        return maturedCount;
    };

    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
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

    // Sorting matured cases :
    const handleSortMaturedCasesThisMonthBooking = (sortByForwarded) => {
        //console.log(sortByForwarded, "case");
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
                employeeData.sort((a, b) => {
                    const countA = parseInt(functionOnlyCalculateMatured(a.ename)) || 0;
                    const countB = parseInt(functionOnlyCalculateMatured(b.ename)) || 0;
                    return countA - countB;
                });
                break;

            case 'descending':
                //console.log("yahan chala descending");
                const companyDataDescending = {};
                employeeData.sort((a, b) => {
                    const countA = functionOnlyCalculateMatured(a.ename) || 0;
                    const countB = functionOnlyCalculateMatured(b.ename) || 0;
                    return countB - countA;
                });
                break;

            case "none":
                //console.log("yahan chala none");
                if (finalThisMonthBookingData.length > 0) {
                    // Restore to previous state
                    setEmployeeData(finalThisMonthBookingData);
                }
                //fetchEmployeeInfo()
                break;
            default:
                break;
        }
    };

    // Sorting target amount :
    const handleSortTargetAmount = (sortByForwarded) => {
        //console.log(sortByForwarded, "case");
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
                employeeData.sort((a, b) => {
                    const countA = parseInt(functionGetOnlyAmount(a)) || 0;
                    //console.log(countA, "a")
                    const countB = parseInt(functionGetOnlyAmount(b)) || 0;
                    //console.log(countB, "b")
                    return countA - countB;
                });
                break;

            case 'descending':
                //console.log("yahan chala descending");
                const companyDataDescending = {};
                employeeData.sort((a, b) => {
                    const countA = parseInt(functionGetOnlyAmount(a)) || 0;
                    const countB = parseInt(functionGetOnlyAmount(b)) || 0;
                    return countB - countA;
                });
                break;

            case "none":
                //console.log("yahan chala none");
                if (finalThisMonthBookingData.length > 0) {
                    // Restore to previous state
                    setEmployeeData(finalThisMonthBookingData);
                }
                break;
            default:
                break;
        }
    };

    // Sorting Achieved Amount :
    const handleSortAchievedAmount = (sortByForwarded) => {
        //(sortByForwarded, "case");
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
                employeeData.sort((a, b) => {
                    const countA = parseInt(functionCalculateOnlyAchieved(a.ename)) || 0;
                    //console.log(countA, "a")
                    const countB = parseInt(functionCalculateOnlyAchieved(b.ename)) || 0;
                    //console.log(countB, "b")
                    return countA - countB;
                });
                break;

            case 'descending':
                //console.log("yahan chala descending");
                const companyDataDescending = {};
                employeeData.sort((a, b) => {
                    const countA = parseInt(functionCalculateOnlyAchieved(a.ename)) || 0;
                    const countB = parseInt(functionCalculateOnlyAchieved(b.ename)) || 0;
                    return countB - countA;
                });
                break;

            case "none":
                //console.log("yahan chala none");
                if (finalThisMonthBookingData.length > 0) {
                    // Restore to previous state
                    setEmployeeData(finalThisMonthBookingData);
                }
                break;
            default:
                break;
        }
    };

    // Sorting Target Ratio :
    const handleSortRatio = (sortByForwarded) => {
        //console.log(sortByForwarded, "case");
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
                employeeData.sort((a, b) => {
                    const countA = parseInt(functionCalculateOnlyAchieved(a.ename)) / parseInt(functionGetOnlyAmount(a)) || 0;
                    const countB = parseInt(functionCalculateOnlyAchieved(b.ename)) / parseInt(functionGetOnlyAmount(b)) || 0;
                    return countA - countB;
                });
                break;

            case 'descending':
                //console.log("yahan chala descending");
                const companyDataDescending = {};
                employeeData.sort((a, b) => {
                    const countA = parseInt(functionCalculateOnlyAchieved(a.ename)) / parseInt(functionGetOnlyAmount(a)) || 0;
                    const countB = parseInt(functionCalculateOnlyAchieved(b.ename)) / parseInt(functionGetOnlyAmount(b)) || 0;
                    return countB - countA;
                });
                break;

            case "none":
                //console.log("yahan chala none");
                if (finalThisMonthBookingData.length > 0) {
                    // Restore to previous state
                    setEmployeeData(finalThisMonthBookingData);
                }
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        setFinalThisMonthBookingData([...employeeData]); // Store original state of employeeData
    }, [employeeData]);

    return (
        <div>
            <div className='container-xl mt-3'>
                <div className="employee-dashboard ">
                    <div className="card todays-booking totalbooking" id="totalbooking"   >
                        <div className="card-header employeedashboard d-flex align-items-center justify-content-between p-1">

                            <div className="dashboard-title">
                                <h2 className="m-0 pl-1">
                                    This Month's Bookings
                                </h2>
                            </div>

                            <div className="d-flex align-items-center pr-1">
                                <div class="input-icon mr-1">
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

                                <div className="date-filter">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}  >
                                        <DemoContainer components={["SingleInputDateRangeField"]} sx={{
                                            padding: '0px',
                                            with: '220px'
                                        }}>
                                            <DateRangePicker className="form-control my-date-picker form-control-sm p-0"
                                                onChange={(values) => {
                                                    const startDate = moment(values[0]).format(
                                                        "DD/MM/YYYY"
                                                    );
                                                    const endDate = moment(values[1]).format(
                                                        "DD/MM/YYYY"
                                                    );
                                                    handleThisMonthBookingDateRange(values);
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
                                <table className="table-vcenter table-nowrap admin-dash-tbl">

                                    <thead className="admin-dash-tbl-thead">
                                        <tr>
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
                                                    handleSortMaturedCasesThisMonthBooking(updatedSortType);
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
                                                </div>
                                            </th>

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
                                                </div>
                                            </th>

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
                                                </div>
                                            </th>

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
                                                </div>
                                            </th>
                                            <th>LAST BOOKING DATE</th>
                                        </tr>
                                    </thead>

                                    {isLoading ? (
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
                                                                    item.branchOffice === floorManagerBranch &&
                                                                    item.ename !== floorManagerName &&
                                                                    item.ename !== "Vishnu Suthar" && item.ename !== "Vandit Shah" && item.ename !== "Khushi Gandhi" && item.ename !== "Yashesh Gajjar" && item.ename !== "Ravi Prajapati" && item.ename !== "Yash Goswami" &&
                                                                    item.targetDetails && item.targetDetails.length !== 0 &&
                                                                    item.targetDetails.find(
                                                                        (target) =>
                                                                            target.year === filteredYear.toString() &&
                                                                            target.month === filteredMonth.toString()
                                                                    )
                                                            )
                                                            .map((obj, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{obj.ename}</td>
                                                                    <td>{obj.branchOffice}</td>
                                                                    <td>{functionCalculateMatured(obj.ename)}</td>
                                                                    <td>₹ {formatSalary(functionGetAmount(obj))}</td>
                                                                    <td>₹ {formatSalary(functionCalculateAchievedAmount(obj.ename))}</td>
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
                                                        <td>₹ {formatSalary(totalTargetAmount)}</td>
                                                        <td>₹ {formatSalary(totalAchievedAmount)}</td>
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
                                        ))}

                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FloorManagerThisMonthBookings;