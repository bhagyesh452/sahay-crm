import React, { useState, useEffect } from 'react'
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

function EmployeesThisMonthBooking() {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [employeeData, setEmployeeData] = useState([])
    const [employeeDataFilter, setEmployeeDataFilter] = useState([])
    const [employeeInfo, setEmployeeInfo] = useState([])
    const [monthBookingPerson, setMonthBookingPerson] = useState([])
    const [uniqueBDE, setUniqueBDE] = useState([]);
    const [redesignedData, setRedesignedData] = useState([]);
    const [companyData, setCompanyData] = useState([]);
    const [bookingStartDate, setBookingStartDate] = useState(new Date());
    const [bookingEndDate, setBookingEndDate] = useState(new Date());
    const [searchBookingBde, setSearchBookingBde] = useState("")
    const [bdeResegnedData, setBdeRedesignedData] = useState([])
    const [initialDate, setInitialDate] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
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
        fetch(`${secretKey}/einfo`)
            .then((response) => response.json())
            .then((data) => {
                setEmployeeData(data.filter((employee) => employee.designation === "Sales Executive" || employee.designation === "Sales Manager"));
                setEmployeeDataFilter(data.filter((employee) => employee.designation === "Sales Executive" || employee.designation === "Sales Manager"));
                setEmployeeInfo(data.filter((employee) => employee.designation === "Sales Executive" || employee.designation === "Sales Manager"))
                // setEmployeeDataFilter(data.filter)
            })
            .catch((error) => {
                console.error(`Error Fetching Employee Data `, error);
            });
    };

    useEffect(()=>{
        if(redesignedData.length!==0){
            setEmployeeData(employeeDataFilter.sort((a,b) => functionCalculateOnlyAchieved(b.ename)-functionCalculateOnlyAchieved(a.ename)));  
        }
        
    },[redesignedData])

    const debounceDelay = 300;
    const debouncedFetchEmployeeInfo = debounce(fetchEmployeeInfo, debounceDelay);

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
        }
    };

    // ------------------------------------------------------- Redesigned Total Bookings Functions ------------------------------------------------------------------
    let totalMaturedCount = 0;
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

    const functionCalculateMatured = (bdeName) => {
        let maturedCount = 0;
        const filterOne = new Date(bookingStartDate).getDate() === new Date().getDate() && new Date(bookingEndDate).getDate() === new Date().getDate();
        if(filterOne){
            redesignedData.map((mainBooking) => {

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
        }else{
            redesignedData.map((mainBooking) => {

                if ((new Date(mainBooking.bookingDate) >= new Date(bookingStartDate) && new Date(mainBooking.bookingDate) <= new Date(bookingEndDate)) || (new Date(mainBooking.bookingDate).getDate() == new Date(bookingStartDate).getDate() && new Date(mainBooking.bookingDate).getDate() == new Date(bookingEndDate).getDate()) ) {
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
                })
    
    
            })
        }
        totalMaturedCount = totalMaturedCount + maturedCount;
        return maturedCount;
    };
    const functionOnlyCalculateMatured = (bdeName) => {
        let maturedCount = 0;
        const filterOne = new Date(bookingStartDate).getDate() === new Date().getDate() && new Date(bookingEndDate).getDate() === new Date().getDate();
        if(filterOne){
            redesignedData.map((mainBooking) => {

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
        }else{
            redesignedData.map((mainBooking) => {

                if (new Date(mainBooking.bookingDate) >= new Date(bookingStartDate) && new Date(mainBooking.bookingDate) <= new Date(bookingEndDate)) {
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
                    if (new Date(moreObject.bookingDate) >= new Date(bookingStartDate) && new Date(moreObject.bookingDate) <= new Date(bookingEndDate)) {
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
        }
     
        return maturedCount;
    };

    const functionCalculateAchievedAmount = (bdeName) => {
        let achievedAmount = 0;
        let remainingAmount = 0;
        let expanse = 0;
        const filterOne = new Date(bookingStartDate).getDate() === new Date().getDate() && new Date(bookingEndDate).getDate() === new Date().getDate();
        
        if (filterOne) {
            redesignedData.map((mainBooking) => {

                if (monthNames[new Date(mainBooking.bookingDate).getMonth()] === currentMonth) {
                    if (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName) {

                        if (mainBooking.bdeName === mainBooking.bdmName) {
                            achievedAmount = achievedAmount + Math.round(mainBooking.generatedReceivedAmount);
                            mainBooking.services.map(serv => {
                                // console.log(serv.expanse , bdeName ,"this is services");
                                expanse = serv.expanse ? expanse + serv.expanse : expanse;
                            });
                        } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
                            achievedAmount = achievedAmount + Math.round(mainBooking.generatedReceivedAmount) / 2;
                            mainBooking.services.map(serv => {
                                expanse = serv.expanse ? expanse + serv.expanse / 2 : expanse;
                            })
                        } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
                            if (mainBooking.bdeName === bdeName) {
                                achievedAmount += Math.round(mainBooking.generatedReceivedAmount);
                                mainBooking.services.map(serv => {

                                    expanse = serv.expanse ? expanse + serv.expanse : expanse;
                                })
                            }
                        }
                    }

                } else if (mainBooking.remainingPayments.length !== 0) {
                    mainBooking.remainingPayments.map((remainingObj) => {
                        if (monthNames[new Date(remainingObj.paymentDate).getMonth()] === currentMonth && (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName)) {
                            const findService = mainBooking.services.find((services) => services.serviceName === remainingObj.serviceName)
                            const tempAmount = findService.withGST ? Math.round(remainingObj.receivedPayment) / 1.18 : Math.round(remainingObj.receivedPayment);
                            if (mainBooking.bdeName === mainBooking.bdmName) {
                                remainingAmount += Math.round(tempAmount);
                            } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
                                remainingAmount += Math.round(tempAmount) / 2;
                            } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
                                if (mainBooking.bdeName === bdeName) {
                                    remainingAmount += Math.round(tempAmount);
                                }
                            }
                        }
                    })
                }
                mainBooking.moreBookings.map((moreObject) => {
                    if (monthNames[new Date(moreObject.bookingDate).getMonth()] === currentMonth) {
                        if (moreObject.bdeName === bdeName || moreObject.bdmName === bdeName) {
                            if (moreObject.bdeName === moreObject.bdmName) {
                                achievedAmount = achievedAmount + Math.round(moreObject.generatedReceivedAmount);
                                moreObject.services.map(serv => {
                                    expanse = serv.expanse ? expanse + serv.expanse : expanse;
                                })
                            } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by") {
                                achievedAmount = achievedAmount + Math.round(moreObject.generatedReceivedAmount) / 2;
                                moreObject.services.map(serv => {
                                    expanse = serv.expanse ? expanse + serv.expanse / 2 : expanse;
                                })
                            } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by") {
                                if (moreObject.bdeName === bdeName) {
                                    achievedAmount += Math.round(moreObject.generatedReceivedAmount);
                                    moreObject.services.map(serv => {
                                        expanse = serv.expanse ? expanse + serv.expanse : expanse;
                                    })
                                }
                            }
                        }
                    } else if (moreObject.remainingPayments.length !== 0) {

                        moreObject.remainingPayments.map((remainingObj) => {
                            if (monthNames[new Date(remainingObj.paymentDate).getMonth()] === currentMonth && (moreObject.bdeName === bdeName || moreObject.bdmName === bdeName)) {

                                const findService = moreObject.services.find((services) => services.serviceName === remainingObj.serviceName)
                                const tempAmount = findService.withGST ? Math.round(remainingObj.receivedPayment) / 1.18 : Math.round(remainingObj.receivedPayment);
                                if (moreObject.bdeName === moreObject.bdmName) {
                                    remainingAmount += Math.round(tempAmount);
                                } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by") {
                                    remainingAmount += Math.round(tempAmount) / 2;
                                } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by") {
                                    if (moreObject.bdeName === bdeName) {
                                        remainingAmount += Math.round(tempAmount);
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
                            achievedAmount = achievedAmount + Math.round(mainBooking.generatedReceivedAmount);

                            mainBooking.services.map(serv => {
                                // console.log(serv.expanse , bdeName ,"this is services");
                                expanse = serv.expanse ? expanse + serv.expanse : expanse;
                            });
                        } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
                            achievedAmount = achievedAmount + Math.round(mainBooking.generatedReceivedAmount) / 2;
                            mainBooking.services.map(serv => {
                                expanse = serv.expanse ? expanse + serv.expanse / 2 : expanse;
                            })
                        } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
                            if (mainBooking.bdeName === bdeName) {
                                achievedAmount += Math.round(mainBooking.generatedReceivedAmount);
                                mainBooking.services.map(serv => {

                                    expanse = serv.expanse ? expanse + serv.expanse : expanse;
                                })
                            }
                        }
                    }

                } else if (mainBooking.remainingPayments.length !== 0) {
                    mainBooking.remainingPayments.map((remainingObj) => {
                        if (((new Date(remainingObj.paymentDate) >= new Date(bookingStartDate) && new Date(remainingObj.paymentDate) <= new Date(bookingEndDate)) || (new Date(remainingObj.paymentDate).getDate() == new Date(bookingStartDate).getDate() && new Date(remainingObj.paymentDate).getDate() == new Date(bookingEndDate).getDate())) && (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName)) {
                            const findService = mainBooking.services.find((services) => services.serviceName === remainingObj.serviceName)
                            const tempAmount = findService.withGST ? Math.round(remainingObj.receivedPayment) / 1.18 : Math.round(remainingObj.receivedPayment);
                            if (mainBooking.bdeName === mainBooking.bdmName) {
                                remainingAmount += Math.round(tempAmount);
                            } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
                                remainingAmount += Math.round(tempAmount) / 2;
                            } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
                                if (mainBooking.bdeName === bdeName) {
                                    remainingAmount += Math.round(tempAmount);
                                }
                            }
                        }
                    })
                }
                mainBooking.moreBookings.map((moreObject) => {
                    if ((new Date(moreObject.bookingDate) >= new Date(bookingStartDate) && new Date(moreObject.bookingDate) <= new Date(bookingEndDate)) || (new Date(moreObject.bookingDate).getDate() == new Date(bookingStartDate).getDate() && new Date(moreObject.bookingDate).getDate() == new Date(bookingEndDate).getDate())) {
                        if (moreObject.bdeName === bdeName || moreObject.bdmName === bdeName) {
                            if (moreObject.bdeName === moreObject.bdmName) {
                                achievedAmount = achievedAmount + Math.round(moreObject.generatedReceivedAmount);
                                moreObject.services.map(serv => {
                                    expanse = serv.expanse ? expanse + serv.expanse : expanse;
                                })
                            } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by") {
                                achievedAmount = achievedAmount + Math.round(moreObject.generatedReceivedAmount) / 2;
                                moreObject.services.map(serv => {
                                    expanse = serv.expanse ? expanse + serv.expanse / 2 : expanse;
                                })
                            } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by") {
                                if (moreObject.bdeName === bdeName) {
                                    achievedAmount += Math.round(moreObject.generatedReceivedAmount);
                                    moreObject.services.map(serv => {
                                        expanse = serv.expanse ? expanse + serv.expanse : expanse;
                                    })
                                }
                            }
                        }
                    } else if (moreObject.remainingPayments.length !== 0) {

                        moreObject.remainingPayments.map((remainingObj) => {
                            if (((new Date(remainingObj.paymentDate) >= new Date(bookingStartDate) && new Date(remainingObj.paymentDate) <= new Date(bookingEndDate)) || (new Date(remainingObj.paymentDate).getDate() == new Date(bookingStartDate).getDate() && new Date(remainingObj.paymentDate).getDate() == new Date(bookingEndDate).getDate())) && (moreObject.bdeName === bdeName || moreObject.bdmName === bdeName)) {

                                const findService = moreObject.services.find((services) => services.serviceName === remainingObj.serviceName)
                                const tempAmount = findService.withGST ? Math.round(remainingObj.receivedPayment) / 1.18 : Math.round(remainingObj.receivedPayment);
                                if (moreObject.bdeName === moreObject.bdmName) {
                                    remainingAmount += Math.round(tempAmount);
                                } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by") {
                                    remainingAmount += Math.round(tempAmount) / 2;
                                } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by") {
                                    if (moreObject.bdeName === bdeName) {
                                        remainingAmount += Math.round(tempAmount);
                                    }
                                }
                            }
                        })
                    }
                })
            })
        }
        totalAchievedAmount = totalAchievedAmount + achievedAmount + Math.round(remainingAmount) - expanse;
        return achievedAmount + Math.round(remainingAmount) - expanse;
    };
    const functionCalculateOnlyAchieved = (bdeName) => {
        let achievedAmount = 0;
        let remainingAmount = 0;
        let expanse = 0;
        const filterOne = new Date(bookingStartDate).getDate() === new Date().getDate() && new Date(bookingEndDate).getDate() === new Date().getDate();

        if (filterOne) {
            redesignedData.map((mainBooking) => {

                if (monthNames[new Date(mainBooking.bookingDate).getMonth()] === currentMonth) {
                    if (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName) {

                        if (mainBooking.bdeName === mainBooking.bdmName) {
                            achievedAmount = achievedAmount + Math.round(mainBooking.generatedReceivedAmount);
                            mainBooking.services.map(serv => {
                                // console.log(serv.expanse , bdeName ,"this is services");
                                expanse = serv.expanse ? expanse + serv.expanse : expanse;
                            });
                        } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
                            achievedAmount = achievedAmount + Math.round(mainBooking.generatedReceivedAmount) / 2;
                            mainBooking.services.map(serv => {
                                expanse = serv.expanse ? expanse + serv.expanse / 2 : expanse;
                            })
                        } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
                            if (mainBooking.bdeName === bdeName) {
                                achievedAmount += Math.round(mainBooking.generatedReceivedAmount);
                                mainBooking.services.map(serv => {

                                    expanse = serv.expanse ? expanse + serv.expanse : expanse;
                                })
                            }
                        }
                    }

                } else if (mainBooking.remainingPayments.length !== 0) {
                    mainBooking.remainingPayments.map((remainingObj) => {
                        if (monthNames[new Date(remainingObj.paymentDate).getMonth()] === currentMonth && (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName)) {
                            const findService = mainBooking.services.find((services) => services.serviceName === remainingObj.serviceName)
                            const tempAmount = findService.withGST ? Math.round(remainingObj.receivedPayment) / 1.18 : Math.round(remainingObj.receivedPayment);
                            if (mainBooking.bdeName === mainBooking.bdmName) {
                                remainingAmount += Math.round(tempAmount);
                            } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
                                remainingAmount += Math.round(tempAmount) / 2;
                            } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
                                if (mainBooking.bdeName === bdeName) {
                                    remainingAmount += Math.round(tempAmount);
                                }
                            }
                        }
                    })
                }
                mainBooking.moreBookings.map((moreObject) => {
                    if (monthNames[new Date(moreObject.bookingDate).getMonth()] === currentMonth) {
                        if (moreObject.bdeName === bdeName || moreObject.bdmName === bdeName) {
                            if (moreObject.bdeName === moreObject.bdmName) {
                                achievedAmount = achievedAmount + Math.round(moreObject.generatedReceivedAmount);
                                moreObject.services.map(serv => {
                                    expanse = serv.expanse ? expanse + serv.expanse : expanse;
                                })
                            } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by") {
                                achievedAmount = achievedAmount + Math.round(moreObject.generatedReceivedAmount) / 2;
                                moreObject.services.map(serv => {
                                    expanse = serv.expanse ? expanse + serv.expanse / 2 : expanse;
                                })
                            } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by") {
                                if (moreObject.bdeName === bdeName) {
                                    achievedAmount += Math.round(moreObject.generatedReceivedAmount);
                                    moreObject.services.map(serv => {
                                        expanse = serv.expanse ? expanse + serv.expanse : expanse;
                                    })
                                }
                            }
                        }
                    } else if (moreObject.remainingPayments.length !== 0) {

                        moreObject.remainingPayments.map((remainingObj) => {
                            if (monthNames[new Date(remainingObj.paymentDate).getMonth()] === currentMonth && (moreObject.bdeName === bdeName || moreObject.bdmName === bdeName)) {

                                const findService = moreObject.services.find((services) => services.serviceName === remainingObj.serviceName)
                                const tempAmount = findService.withGST ? Math.round(remainingObj.receivedPayment) / 1.18 : Math.round(remainingObj.receivedPayment);
                                if (moreObject.bdeName === moreObject.bdmName) {
                                    remainingAmount += Math.round(tempAmount);
                                } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by") {
                                    remainingAmount += Math.round(tempAmount) / 2;
                                } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by") {
                                    if (moreObject.bdeName === bdeName) {
                                        remainingAmount += Math.round(tempAmount);
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
                            achievedAmount = achievedAmount + Math.round(mainBooking.generatedReceivedAmount);

                            mainBooking.services.map(serv => {
                                // console.log(serv.expanse , bdeName ,"this is services");
                                expanse = serv.expanse ? expanse + serv.expanse : expanse;
                            });
                        } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
                            achievedAmount = achievedAmount + Math.round(mainBooking.generatedReceivedAmount) / 2;
                            mainBooking.services.map(serv => {
                                expanse = serv.expanse ? expanse + serv.expanse / 2 : expanse;
                            })
                        } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
                            if (mainBooking.bdeName === bdeName) {
                                achievedAmount += Math.round(mainBooking.generatedReceivedAmount);
                                mainBooking.services.map(serv => {

                                    expanse = serv.expanse ? expanse + serv.expanse : expanse;
                                })
                            }
                        }
                    }

                } else if (mainBooking.remainingPayments.length !== 0) {
                    mainBooking.remainingPayments.map((remainingObj) => {
                        if (((new Date(remainingObj.paymentDate) >= new Date(bookingStartDate) && new Date(remainingObj.paymentDate) <= new Date(bookingEndDate)) || (new Date(remainingObj.paymentDate).getDate() == new Date(bookingStartDate).getDate() && new Date(remainingObj.paymentDate).getDate() == new Date(bookingEndDate).getDate())) && (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName)) {
                            const findService = mainBooking.services.find((services) => services.serviceName === remainingObj.serviceName)
                            const tempAmount = findService.withGST ? Math.round(remainingObj.receivedPayment) / 1.18 : Math.round(remainingObj.receivedPayment);
                            if (mainBooking.bdeName === mainBooking.bdmName) {
                                remainingAmount += Math.round(tempAmount);
                            } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
                                remainingAmount += Math.round(tempAmount) / 2;
                            } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
                                if (mainBooking.bdeName === bdeName) {
                                    remainingAmount += Math.round(tempAmount);
                                }
                            }
                        }
                    })
                }
                mainBooking.moreBookings.map((moreObject) => {
                    if ((new Date(moreObject.bookingDate) >= new Date(bookingStartDate) && new Date(moreObject.bookingDate) <= new Date(bookingEndDate)) || (new Date(moreObject.bookingDate).getDate() == new Date(bookingStartDate).getDate() && new Date(moreObject.bookingDate).getDate() == new Date(bookingEndDate).getDate())) {
                        if (moreObject.bdeName === bdeName || moreObject.bdmName === bdeName) {
                            if (moreObject.bdeName === moreObject.bdmName) {
                                achievedAmount = achievedAmount + Math.round(moreObject.generatedReceivedAmount);
                                moreObject.services.map(serv => {
                                    expanse = serv.expanse ? expanse + serv.expanse : expanse;
                                })
                            } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by") {
                                achievedAmount = achievedAmount + Math.round(moreObject.generatedReceivedAmount) / 2;
                                moreObject.services.map(serv => {
                                    expanse = serv.expanse ? expanse + serv.expanse / 2 : expanse;
                                })
                            } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by") {
                                if (moreObject.bdeName === bdeName) {
                                    achievedAmount += Math.round(moreObject.generatedReceivedAmount);
                                    moreObject.services.map(serv => {
                                        expanse = serv.expanse ? expanse + serv.expanse : expanse;
                                    })
                                }
                            }
                        }
                    } else if (moreObject.remainingPayments.length !== 0) {

                        moreObject.remainingPayments.map((remainingObj) => {
                            if (((new Date(remainingObj.paymentDate) >= new Date(bookingStartDate) && new Date(remainingObj.paymentDate) <= new Date(bookingEndDate)) || (new Date(remainingObj.paymentDate).getDate() == new Date(bookingStartDate).getDate() && new Date(remainingObj.paymentDate).getDate() == new Date(bookingEndDate).getDate())) && (moreObject.bdeName === bdeName || moreObject.bdmName === bdeName)) {

                                const findService = moreObject.services.find((services) => services.serviceName === remainingObj.serviceName)
                                const tempAmount = findService.withGST ? Math.round(remainingObj.receivedPayment) / 1.18 : Math.round(remainingObj.receivedPayment);
                                if (moreObject.bdeName === moreObject.bdmName) {
                                    remainingAmount += Math.round(tempAmount);
                                } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by") {
                                    remainingAmount += Math.round(tempAmount) / 2;
                                } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by") {
                                    if (moreObject.bdeName === bdeName) {
                                        remainingAmount += Math.round(tempAmount);
                                    }
                                }
                            }
                        })
                    }
                })
            })
        }

        return achievedAmount + Math.round(remainingAmount) - expanse;
    }



    //     return achievedAmount + Math.round(remainingAmount) - expanse;
    // };

    const functionGetAmount = (object) => {
        if (object.targetDetails.length !== 0) {
            const foundObject = object.targetDetails.find(
                (item) =>
                    Math.round(item.year) === currentYear && item.month === currentMonth
            );
            totalTargetAmount =
                foundObject &&
                Math.round(totalTargetAmount) + Math.round(foundObject.amount);

            return foundObject ? foundObject.amount : 0;
        } else {
            return 0;
        }
    };
    const functionGetOnlyAmount = (object) => {
        if (object.targetDetails.length !== 0) {
            const foundObject = object.targetDetails.find(
                (item) =>
                    Math.round(item.year) === currentYear && item.month === currentMonth
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

    const handleSortMaturedCases = (sortByForwarded) => {
        console.log(sortByForwarded, "case");
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
                    const countA = parseInt(functionOnlyCalculateMatured(a.ename)) || 0;
                    const countB = parseInt(functionOnlyCalculateMatured(b.ename)) || 0;
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
                fetchEmployeeInfo()
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
                    const countA = parseInt(functionCalculateOnlyAchieved(a.ename)) || 0;
                    console.log(countA, "a")
                    const countB = parseInt(functionCalculateOnlyAchieved(b.ename)) || 0;
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
                    const countA = parseInt(functionCalculateOnlyAchieved(a.ename)) || 0;
                    const countB = parseInt(functionCalculateOnlyAchieved(b.ename)) || 0;
                    return countB - countA;
                });
                break; // Add break statement here

            case "none":
                //console.log("yahan chala none");
                fetchEmployeeInfo();
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
                    const countA = parseInt(functionGetOnlyAmount(a)) || 0;
                    console.log(countA, "a")
                    const countB = parseInt(functionGetOnlyAmount(b)) || 0;
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
                    const countA = parseInt(functionGetOnlyAmount(a)) || 0;
                    const countB = parseInt(functionGetOnlyAmount(b)) || 0;
                    return countB - countA;
                });
                break; // Add break statement here

            case "none":
                //console.log("yahan chala none");
                fetchEmployeeInfo();
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
                    const countA = parseInt(functionCalculateOnlyAchieved(a.ename)) / parseInt(functionGetOnlyAmount(a)) || 0;

                    const countB = parseInt(functionCalculateOnlyAchieved(b.ename)) / parseInt(functionGetOnlyAmount(b)) || 0;

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
                    const countA = parseInt(functionCalculateOnlyAchieved(a.ename)) / parseInt(functionGetOnlyAmount(a)) || 0;

                    const countB = parseInt(functionCalculateOnlyAchieved(b.ename)) / parseInt(functionGetOnlyAmount(b)) || 0;

                    return countB - countA;
                });
                break; // Add break statement here

            case "none":
                //console.log("yahan chala none");
                fetchEmployeeInfo();
                break; // Add break statement here
            default:
                break;
        }
    };


    return (
        <div>{/*------------------------------------------------------ Bookings Dashboard ------------------------------------------------------------ */}
            <div className="employee-dashboard mt-2">
                <div className="card todays-booking totalbooking" id="totalbooking"   >
                    <div className="card-header employeedashboard d-flex align-items-center justify-content-between p-1">
                        <div className="dashboard-title">
                            <h2 className="m-0 pl-1">
                                This Month's Bookings
                            </h2>
                        </div>
                        <div className="filter-booking d-flex align-items-center">
                            <div className="filter-booking mr-1 d-flex align-items-center" >
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
                                {uniqueBDEobjects ? (
                                    <>
                                        <tbody>
                                            {employeeData &&
                                                employeeData
                                                    .filter(
                                                        (item) =>
                                                            item.designation ===
                                                            "Sales Executive" &&
                                                            item.targetDetails.length !== 0 && item.targetDetails.find(target => target.year === (currentYear).toString() && target.month === (currentMonth.toString())) 
                                                    )
                                                    .map((obj, index) => (
                                                        <>
                                                            <tr>
                                                                <td>{index + 1}</td>
                                                                <td>
                                                                    {obj.ename}
                                                                </td>
                                                                <td>{obj.branchOffice}</td>
                                                                <td>
                                                                    {functionCalculateMatured(
                                                                        obj.ename
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    ₹{" "}
                                                                    {Math.round(
                                                                        functionGetAmount(obj)
                                                                    ).toLocaleString()}
                                                                </td>
                                                                <td>
                                                                    ₹{" "}
                                                                    {functionCalculateAchievedAmount(
                                                                        obj.ename
                                                                    ).toLocaleString()}
                                                                </td>
                                                                <td>
                                                                    {" "}
                                                                    {(
                                                                        (functionCalculateOnlyAchieved(
                                                                            obj.ename
                                                                        ) /
                                                                            functionGetOnlyAmount(obj)) *
                                                                        100
                                                                    ).toFixed(2)}{" "}
                                                                    %
                                                                </td>
                                                                <td>
                                                                    {functionGetLastBookingDate(
                                                                        obj.ename
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        </>
                                                    ))}
                                        </tbody>
                                        <tfoot className="admin-dash-tbl-tfoot">
                                            <tr>
                                                <td
                                                    colSpan={2}

                                                >
                                                    Total:
                                                </td>
                                                <td>-</td>
                                                <td>
                                                    {" "}
                                                    {totalMaturedCount.toLocaleString()}
                                                </td>
                                                <td>
                                                    ₹{" "}
                                                    {(totalTargetAmount).toLocaleString()}
                                                </td>
                                                <td>
                                                    ₹{" "}
                                                    {(
                                                        totalAchievedAmount
                                                    ).toLocaleString()}
                                                </td>
                                                <td>
                                                    {(
                                                        (totalAchievedAmount /
                                                            totalTargetAmount) *
                                                        100
                                                    ).toFixed(2)}{" "}
                                                    %
                                                </td>
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
                                )}
                            </table>
                        </div>
                    </div>
                </div>
            </div></div>
    )
}

export default EmployeesThisMonthBooking