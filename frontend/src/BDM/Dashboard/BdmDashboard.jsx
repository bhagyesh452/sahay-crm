import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import Header from '../Components/Header/Header.jsx'
import Navbar from '../Components/Navbar/Navbar.jsx';
import axios from "axios";
import { debounce } from "lodash";
import Select from "react-select";
import Nodata from '../Components/NoData/NoData.jsx';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import moment from "moment";
import { StaticDateRangePicker } from "@mui/x-date-pickers-pro/StaticDateRangePicker";
import dayjs from "dayjs";
import { IoClose } from "react-icons/io5";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { FcDatabase } from "react-icons/fc";
import Calendar from "@mui/icons-material/Event";

function BdmDashboard() {
  const { userId } = useParams();
  const [data, setData] = useState([])
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const frontendKey = process.env.REACT_APP_FRONTEND_KEY;
  //const bdmName = localStorage.getItem("bdmName")
  const [forwardEmployeeData, setForwardEmployeeData] = useState([])
  const [forwardEmployeeDataFilter, setForwardEmployeeDataFilter] = useState([])
  const [forwardEmployeeDataNew, setForwardEmployeeDataNew] = useState([])



  const fetchData = async () => {
    try {
      const response = await axios.get(`${secretKey}/einfo`);

      // Set the retrieved data in the state
      const tempData = response.data;
      const userData = tempData.find((item) => item._id === userId);
      //console.log(tempData);
      setData(userData);
      setForwardEmployeeData(tempData.filter((employee) => (employee.designation === "Sales Executive" || employee.designation === "Sales Manager") && employee.branchOffice === "Sindhu Bhawan"))
      setForwardEmployeeDataFilter(tempData.filter((employee) => (employee.designation === "Sales Executive" || employee.designation === "Sales Manager") && employee.branchOffice === "Sindhu Bhawan"))
      setForwardEmployeeDataNew(tempData.filter((employee) => (employee.designation === "Sales Executive" || employee.designation === "Sales Manager") && employee.branchOffice === "Sindhu Bhawan"))
      //setmoreFilteredData(userData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const [employeeData, setEmployeeData] = useState([]);
  const [employeeDataFilter, setEmployeeDataFilter] = useState([]);
  const [employeeDataNew, setEmployeeDataNew] = useState([]);

  const fetchEmployeeInfo = async () => {
    fetch(`${secretKey}/einfo`)
      .then((response) => response.json())
      .then((data) => {
        setEmployeeData(data.filter((employee) => (employee.designation === "Sales Executive" || employee.designation === "Sales Manager") && employee.branchOffice === "Sindhu Bhawan"));
        setEmployeeDataFilter(data.filter((employee) =>  (employee.designation === "Sales Executive" || employee.designation === "Sales Manager") && employee.branchOffice === "Sindhu Bhawan"));
        setEmployeeDataNew(data.filter((employee) =>  (employee.designation === "Sales Executive" || employee.designation === "Sales Manager") && employee.branchOffice === "Sindhu Bhawan"));
      })
      .catch((error) => {
        console.error(`Error Fetching Employee Data `, error);
      });
  };

  useEffect(() => {
    fetchData()
    fetchEmployeeInfo()

  }, [])

  console.log("employeedata" , employeeDataNew)

  const [moreEmpData, setmoreEmpData] = useState([])
  const [tempData, setTempData] = useState([]);
  const [teamLeadsDataFilter, setTeamLeadsDataFilter] = useState([])

  const fetchNewData = async () => {
    try {
      const response = await axios.get(`${secretKey}/employees/${data.ename}`);
      const tempData = response.data;
      setTempData(tempData);
      setmoreEmpData(tempData)
    } catch (error) {
      console.error("Error fetching new data:", error);
    }
  };

  useEffect(() => {
    fetchNewData();
    fetchRedesignedBookings();
  }, [data]);

  function formatDateNow(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  const [teamLeadsData, setTeamLeadsData] = useState([])
  const [teamLeadsData2, setTeamLeadsData2] = useState([])
  const [teamData, setTeamData] = useState([])
  const [teamData2, setTeamData2] = useState([])

  const fetchTeamLeadsData = async () => {

    try {
      const response = await axios.get(`${secretKey}/forwardedbybdedata/${data.ename}`)
      const response2 = await axios.get(`${secretKey}/teamleadsdata`)

      setTeamLeadsData(response.data)
      setTeamData(response.data)
      setTeamData2(response2.data)
      setTeamLeadsData2(response2.data)

    } catch (error) {
      console.log("Error fetching data", error.message)
    }
  }

  const [companyData, setCompanyData] = useState([]);
  const [companyDataFilter, setCompanyDataFilter] = useState([]);

  const fetchCompanyData = async () => {
    fetch(`${secretKey}/leads`)
      .then((response) => response.json())
      .then((data) => {
        setCompanyData(data.filter((obj) => obj.ename !== "Not Alloted"));
        setCompanyDataFilter(data.filter((obj) => obj.ename !== "Not Alloted"));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    // Call the fetchData function when the component mounts
    fetchCompanyData()
  }, []);

  //console.log(teamLeadsData)

  useEffect(() => {
    fetchTeamLeadsData()
  }, [data.ename])



  const [followDataToday, setfollowDataToday] = useState([]);
  const [followDataTodayFilter, setfollowDataTodayFilter] = useState([]);
  const [FollowData, setfollowData] = useState([]);
  const [followData, setFollowData] = useState([]);
  const [followDataFilter, setFollowDataFilter] = useState([]);
  const [followDataNew, setFollowDataNew] = useState([]);
  const [uniqueBDE, setUniqueBDE] = useState([]);
  const currentYear = new Date().getFullYear();
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
  const currentMonth = monthNames[new Date().getMonth()];
  function formatDateFinal(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const [completeProjectionData, setCompleteProjectionData] = useState([])
  const [completeProjectionDataNew, setCompleteProjectionDataNew] = useState([])
  const [completeProjectionDataToday, setCompleteProjectionDataToday] = useState([])
  const [completeProjectionDataTodayNew, setCompleteProjectionDataTodayNew] = useState([])

  const fetchCompleteProjectionData = async () => {
    try {
      const response = await fetch(`${secretKey}/projection-data`);
      const followdata = await response.json();
      setCompleteProjectionData(followdata);
      setCompleteProjectionDataNew(followdata)
      const filteredFollowData = followdata.filter((obj)=>employeeDataNew.some((empObj)=>empObj.ename === obj.ename))
      console.log("filetered" , followData)
      setCompleteProjectionDataToday(filteredFollowData.filter((obj) => {
        const today = new Date().toISOString().split("T")[0]; // Get today's date in the format 'YYYY-MM-DD'
        return obj.estPaymentDate === today}))
      setCompleteProjectionDataTodayNew(filteredFollowData.filter((obj) => {
        const today = new Date().toISOString().split("T")[0]; // Get today's date in the format 'YYYY-MM-DD'
        return obj.estPaymentDate === today

      }))
    } catch (error) {
      console.error("Error fetching data:", error);
      return { error: "Error fetching data" };
    }
  }

  const fetchFollowUpData = async () => {
    try {
      const response = await fetch(
        `${secretKey}/projection-data/${data.ename}`
      );
      const followdata = await response.json();
      setfollowData(followdata);
      setFollowDataFilter(followdata);
      setfollowDataToday(
        followdata.filter((company) => {
          // Assuming you want to filter companies with an estimated payment date for today
          const today = new Date().toISOString().split("T")[0]; // Get today's date in the format 'YYYY-MM-DD'
          return company.estPaymentDate === today;
        })
      );
      setfollowDataTodayFilter(
        followdata.filter((company) => {
          // Assuming you want to filter companies with an estimated payment date for today
          const today = new Date().toISOString().split("T")[0]; // Get today's date in the format 'YYYY-MM-DD'
          return company.estPaymentDate === today;
        })
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      return { error: "Error fetching data" };
    }
  };

  useEffect(() => {
    fetchFollowUpData();
    fetchCompleteProjectionData()
  }, [data]);

  const [redesignedData, setRedesignedData] = useState([]);
  const [permanentFormData, setPermanentFormData] = useState([]);

  const fetchRedesignedBookings = async () => {
    try {
      const response = await axios.get(
        `${secretKey}/redesigned-final-leadData`
      );
      const bookingsData = response.data;
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
      setPermanentFormData(bookingsData);
    } catch (error) {
      console.log("Error Fetching Bookings Data", error);
    }
  };

  const [selectedMonthOption, setSelectedMonthOption] = useState("")
  const [selectedMonthOptionForBdm, setSelectedMonthOptionForBdm] = useState("")

  const monthOptions = [
    { value: 'current_month', label: 'Current Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'total', label: 'Total' }
  ];

  //console.log("redesigneddata" , redesignedData)


  const filterTeamLeadsDataByMonth = (teamData, followData, selectedMonthOption) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    let filteredTeamData = [];
    let filteredFollowData = [];

    switch (selectedMonthOption) {
      case 'current_month':
        filteredTeamData = teamData.filter(obj => {
          const objDate = new Date(obj.bdeForwardDate);
          return objDate.getMonth() === currentMonth && objDate.getFullYear() === currentYear;
        });
        filteredFollowData = followDataFilter.filter(obj => {
          const objDate = new Date(obj.estPaymentDate);
          return objDate.getMonth() === currentMonth && objDate.getFullYear() === currentYear;
        });

        setRedesignedData(permanentFormData.filter(obj=> new Date(obj.bookingDate).getMonth() === currentMonth && new Date(obj.bookingDate).getFullYear() === currentYear))
        break;
      case 'last_month':
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = lastMonth === 11 ? currentYear - 1 : currentYear;
        filteredTeamData = teamData.filter(obj => {
          const objDate = new Date(obj.bdeForwardDate);
          return objDate.getMonth() === lastMonth && objDate.getFullYear() === lastMonthYear;
        });
        filteredFollowData = followDataFilter.filter(obj => {
          const objDate = new Date(obj.estPaymentDate);
          return objDate.getMonth() === lastMonth && objDate.getFullYear() === lastMonthYear;
        })
        setRedesignedData(permanentFormData.filter(obj=> new Date(obj.bookingDate).getMonth() === lastMonth && new Date(obj.bookingDate).getFullYear() === lastMonthYear))
        break;
      case 'total':
        filteredTeamData = teamData;
        filteredFollowData = followData;
        setRedesignedData(permanentFormData);
        break;
      default:
        filteredTeamData = teamData;
        filteredFollowData = followData;
        break;
    }

    return { filteredTeamData, filteredFollowData };
  };

  const handleChangeForBdm = (selectedOption) => {
    //console.log(selectedOption);
    setSelectedMonthOptionForBdm(selectedOption.value);

    if (selectedOption === "current_month" || selectedOption === "last_month") {
      const { filteredTeamData, filteredFollowData } = filterTeamLeadsDataByMonth(teamLeadsData, followDataFilter, selectedOption);
      setTeamData(filteredTeamData);
      setFollowData(filteredFollowData);
    } else {
      // Handle 'total' case
      // If 'total', no need to filter, so you can directly set the team data
      setTeamData(teamLeadsData);
      setFollowData(followDataFilter);
    }
  }


  const filterMoreEmpDataDataByMonth = (tempData, followDataFilter, selectedMonthOption) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    let filteredMoreEmpData = [];
    let filteredFollowData = [];

    switch (selectedMonthOption) {
      case 'current_month':
        filteredMoreEmpData = tempData.filter(obj => {
          const objDate = new Date(obj.bdeForwardDate);
          return objDate.getMonth() === currentMonth && objDate.getFullYear() === currentYear;
        });
        filteredFollowData = followDataFilter.filter(obj => {
          const objDate = new Date(obj.estPaymentDate);
          return objDate.getMonth() === currentMonth && objDate.getFullYear() === currentYear;
        });
        break;
      case 'last_month':
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = lastMonth === 11 ? currentYear - 1 : currentYear;
        filteredMoreEmpData = tempData.filter(obj => {
          const objDate = new Date(obj.bdeForwardDate);
          return objDate.getMonth() === lastMonth && objDate.getFullYear() === lastMonthYear;
        });
        filteredFollowData = followDataFilter.filter(obj => {
          const objDate = new Date(obj.estPaymentDate);
          return objDate.getMonth() === lastMonth && objDate.getFullYear() === lastMonthYear
        })
        break;
      case 'total':
        filteredMoreEmpData = tempData;
        filteredFollowData = followDataFilter;
        break;
      default:
        filteredMoreEmpData = tempData;
        filteredFollowData = followDataFilter;
        break;
    }

    return { filteredMoreEmpData, filteredFollowData };
  };

  const handleChange = (selectedOption) => {
    //console.log(selectedOption);
    setSelectedMonthOptionForBdm(selectedOption.value);

    if (selectedOption === "current_month" || selectedOption === "last_month") {
      const { filteredMoreEmpData, filteredFollowData } = filterMoreEmpDataDataByMonth(tempData, followDataFilter, selectedOption);
      setmoreEmpData(filteredMoreEmpData);
      setFollowData(filteredFollowData);
    } else {
      // Handle 'total' case
      // If 'total', no need to filter, so you can directly set the team data
      setmoreEmpData(tempData);
      setFollowData(followDataFilter);
    }
  }

  let generatedTotalRevenue = 0;

  function functionCalculateGeneratedRevenue(isBdm) {

    let generatedRevenue = 0;
    const requiredObj = moreEmpData.filter((obj) => formatDateNow(obj.bdmStatusChangeDate) === new Date().toISOString().slice(0, 10) && (obj.bdmAcceptStatus === "Accept") && obj.Status === "Matured");
    requiredObj.forEach((object) => {
      const newObject = isBdm ? redesignedData.find(value => value["Company Name"] === object["Company Name"] && value.bdmName === data.ename) : redesignedData.find(value => value["Company Name"] === object["Company Name"] && value.bdeName === data.ename);
      if (newObject) {
        generatedRevenue = generatedRevenue + newObject.generatedReceivedAmount;
      }

    });

    return generatedRevenue;
    //  const generatedRevenue =  redesignedData.reduce((total, obj) => total + obj.receivedAmount, 0);
    //  console.log("This is generated Revenue",requiredObj);

  }

  function functionCalculateGeneratedTotalRevenue(isBdm) {
    let generatedRevenue = 0;
    const requiredObj = moreEmpData.filter((obj) => (obj.bdmAcceptStatus === "Accept") && obj.Status === "Matured");
    requiredObj.forEach((object) => {
      const newObject = isBdm ? redesignedData.find(value => value["Company Name"] === object["Company Name"] && value.bdmName === data.ename) : redesignedData.find(value => value["Company Name"] === object["Company Name"] && value.bdeName === data.ename);
      if (newObject) {
        generatedRevenue = generatedRevenue + newObject.generatedReceivedAmount;
      }

    });
    generatedTotalRevenue = generatedTotalRevenue + generatedRevenue;

    return generatedRevenue;
    //  const generatedRevenue =  redesignedData.reduce((total, obj) => total + obj.receivedAmount, 0);
    //  console.log("This is generated Revenue",requiredObj);

  }

  const [selectedValue, setSelectedValue] = useState("")

  const handleFilterForwardCaseBranchOffice = (branchName) => {

    //console.log(branchName)

    if (branchName === "none") {
      setForwardEmployeeData(forwardEmployeeDataFilter)
      setCompanyData(companyDataFilter)
      setfollowData(followDataFilter)
      setTeamLeadsData(teamLeadsDataFilter)
    } else {
      const filteredData = forwardEmployeeDataNew.filter(obj => obj.branchOffice === branchName);

      //console.log("kuch to h" , filteredData , followDataFilter)

      const filteredFollowDataforwarded = followDataFilter.filter((obj) =>
        forwardEmployeeDataNew.some((empObj) =>
          empObj.branchOffice === branchName &&
          (empObj.ename === obj.bdeName)
        )
      );
      const filteredCompanyData = companyDataFilter.filter(obj => (
        (obj.bdmAcceptStatus === "Pending" || obj.bdmAcceptStatus === "Accept") &&
        forwardEmployeeDataNew.some(empObj => empObj.branchOffice === branchName && empObj.ename === obj.ename)
      ));

      const filteredTeamLeadsData = teamLeadsDataFilter.filter((obj) => forwardEmployeeDataNew.some((empObj) => empObj.branchOffice === branchName && (empObj.ename === obj.ename || empObj.ename === obj.bdmName)))


      setForwardEmployeeData(filteredData)
      setCompanyData(filteredCompanyData)
      setfollowData(filteredFollowDataforwarded)
      setFollowDataNew(filteredFollowDataforwarded)
      setTeamLeadsData(filteredTeamLeadsData)
    }
  }


  const debouncedFilterSearchForwardData = debounce(filterSearchForwardData, 100);
  const [searchTermForwardData, setSearchTermForwardData] = useState("")


  // Modified filterSearch function with debounce
  function filterSearchForwardData(searchTerm) {
    setSearchTermForwardData(searchTerm);

    setForwardEmployeeData(
      forwardEmployeeDataFilter.filter((company) =>
        company.ename.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    setCompanyData(
      companyDataFilter.filter(
        (obj) =>
          (obj.bdmAcceptStatus === "Pending" || obj.bdmAcceptStatus === "Accept") &&
          forwardEmployeeDataNew.some((empObj) => (obj.ename === empObj.ename) &&
            empObj.ename.toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
    );

    setTeamLeadsData(
      teamLeadsDataFilter.filter((obj) =>
        forwardEmployeeDataNew.some(
          (empObj) =>
            (obj.bdmName === empObj.ename) &&
            empObj.ename.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
    // setfollowData(
    //   followDataFilter.filter(obj =>
    //     forwardEmployeeDataNew.some(empObj =>
    //       (empObj.ename === obj.ename || empObj.bdeName === obj.ename) &&
    //       (empObj.ename.toLowerCase().includes(searchTerm.toLowerCase()) || empObj.bdeName.toLowerCase().includes(searchTerm.toLowerCase()))
    //     )
    //   )
    // );

  }

  //console.log("followData", followData, followDataFilter)

  const [selectedValues, setSelectedValues] = useState([]);

  const options = forwardEmployeeDataNew.map((obj) => ({ value: obj.ename, label: obj.ename }));

  //console.log("options", options);

  const handleSelectForwardedEmployeeData = (selectedEmployeeNames) => {
    //console.log(selectedEmployeeNames, "selected employees");
    // Assuming you have forwardEmployeeDataFilter, companyDataFilter, and teamLeadsDataFilter defined somewhere

    const filteredForwardEmployeeData = forwardEmployeeDataFilter.filter((company) =>
      selectedEmployeeNames.includes(company.ename)
    );

    setForwardEmployeeData(filteredForwardEmployeeData);

    const filteredCompanyData = companyDataFilter.filter(
      (obj) =>
        (obj.bdmAcceptStatus === "Pending" || obj.bdmAcceptStatus === "Accept") &&
        forwardEmployeeDataNew.some((empObj) => empObj.ename === obj.ename && selectedEmployeeNames.includes(empObj.ename))
    );

    setCompanyData(filteredCompanyData);

    const filteredTeamLeadsData = teamLeadsDataFilter.filter((obj) =>
      selectedEmployeeNames.includes(obj.bdmName)
    );

    setTeamLeadsData(filteredTeamLeadsData);
  };

  let totalMaturedCount = 0;
  let totalTargetAmount = 0;
  let totalAchievedAmount = 0;

  const functionCalculateMatured = (bdeName) => {
    let maturedCount = 0;
    const filteredRedesignedData = redesignedData.filter(
      (obj) => obj.bdeName === bdeName || (obj.bdmName === bdeName && obj.bdmType === "Close-by") || (obj.moreBookings.length !== 0 && obj.moreBookings.some(mainObj => mainObj.bdmName === bdeName && mainObj.bdmType === "Close-by"))
    );

    const moreFilteredData = filteredRedesignedData.filter(obj => monthNames[new Date(obj.bookingDate).getMonth()] === currentMonth)
    moreFilteredData.forEach((obj) => {
      if (obj.moreBookings.length === 0) {
        if (obj.bdeName !== obj.bdmName && obj.bdmType === "Close-by") {
          maturedCount += 0.5;
        } else {
          maturedCount += 1;
        }
      } else {
        if (obj.bdeName === bdeName || obj.bdmName === bdeName) {
          if (obj.bdeName !== obj.bdmName && obj.bdmType === "Close-by") {
            maturedCount += 0.5;
          } else {
            maturedCount += 1;
          }
        }
        obj.moreBookings.forEach((booking) => {
          if (booking.bdeName === bdeName || booking.bdmName === bdeName) {
            if (
              booking.bdeName !== booking.bdmName &&
              booking.bdmType === "Close-by"
            ) {
              maturedCount += 0.5;
            } else if (booking.bdeName === bdeName) {
              maturedCount += 1;
            }
          }
        });
      }
    });
    totalMaturedCount = totalMaturedCount + maturedCount;
    return maturedCount;
  };

  const uniqueBDEobjects =
    employeeData.length !== 0 &&
    uniqueBDE.size !== 0 &&
    employeeData.filter((obj) => Array.from(uniqueBDE).includes(obj.ename));

  const functionGetAmount = (object) => {
    if (object.targetDetails.length !== 0) {
      const foundObject = object.targetDetails.find(
        (item) =>
          parseInt(item.year) === currentYear && item.month === currentMonth
      );
      totalTargetAmount =
        foundObject &&
        parseInt(totalTargetAmount) + parseInt(foundObject.amount);
      return foundObject ? foundObject.amount : 0;
    } else {
      return 0;
    }
  };

  const functionCalculateAchievedAmount = (bdeName) => {
    let achievedAmount = 0;
    const filteredRedesignedData = redesignedData.filter(
      (obj) => obj.bdeName === bdeName || (obj.bdmName === bdeName && obj.bdmType === "Close-by") || (obj.moreBookings.length !== 0 && obj.moreBookings.some(mainObj => mainObj.bdmName === bdeName && mainObj.bdmType === "Close-by"))
    );

    const moreFilteredData = filteredRedesignedData.filter(obj => monthNames[new Date(obj.bookingDate).getMonth()] === currentMonth)

    moreFilteredData.forEach((obj) => {
      if (obj.moreBookings.length === 0) {
        if (obj.bdeName !== obj.bdmName && obj.bdmType === "Close-by") {
          achievedAmount += parseInt(obj.generatedReceivedAmount / 2);
        } else {
          achievedAmount += parseInt(obj.generatedReceivedAmount);
        }
      } else {
        if (obj.bdeName === bdeName || obj.bdmName === bdeName) {
          if (obj.bdeName !== obj.bdmName && obj.bdmType === "Close-by") {
            achievedAmount += parseInt(obj.generatedReceivedAmount / 2);
          } else {
            achievedAmount += parseInt(obj.generatedReceivedAmount);
          }
        }
        obj.moreBookings.forEach((booking) => {
          if (booking.bdeName === bdeName || booking.bdmName === bdeName) {
            if (
              booking.bdeName !== booking.bdmName &&
              booking.bdmType === "Close-by"
            ) {
              achievedAmount += parseInt(booking.generatedReceivedAmount / 2);
            } else {
              achievedAmount += parseInt(booking.generatedReceivedAmount);
            }
          }
        });
      }
    });
    totalAchievedAmount =
      parseInt(totalAchievedAmount) + parseInt(achievedAmount);
    return achievedAmount;
  };

  function functionGetLastBookingDate(bdeName) {
    // Filter objects based on bdeName

    const filteredRedesignedData = redesignedData.filter(
      (obj) => (obj.bdeName === bdeName || (obj.bdmName === bdeName && obj.bdmType === "Close-by")) && monthNames[new Date(obj.bookingDate).getMonth()] === currentMonth
    );

    // Initialize variable to store the latest booking date
    let lastBookingDate = null;

    // Iterate through filtered data
    filteredRedesignedData.forEach((obj) => {
      if (obj.moreBookings && obj.moreBookings.length > 0) {
        // If moreBookings exist, find the latest bookingDate
        const latestBookingDate = obj.moreBookings.reduce(
          (latestDate, booking) => {
            const bookingDate = new Date(booking.bookingDate);
            return bookingDate > latestDate ? bookingDate : latestDate;
          },
          new Date(0)
        ); // Initialize with minimum date

        // Update lastBookingDate if latestBookingDate is later
        if (latestBookingDate > lastBookingDate || !lastBookingDate) {
          lastBookingDate = latestBookingDate;
        }
      } else {
        // If no moreBookings, directly consider bookingDate
        const bookingDate = new Date(obj.bookingDate);
        if (bookingDate > lastBookingDate || !lastBookingDate) {
          lastBookingDate = bookingDate;
        }
      }
    });

    // Return the formatted date string or an empty string if lastBookingDate is null
    return lastBookingDate ? formatDateFinal(lastBookingDate) : "N/A";
  }

  const handleFilterFollowDataTodayRecievedCase = () => {

    const filterFollowDataRecieved = followDataToday.filter((company) => company.bdmName === data.ename && company.caseType === "Recieved")
    const totalPaymentRecieved = filterFollowDataRecieved.reduce((total, obj) => total + obj.totalPayment / 2, 0)
    const finalPayment = totalPaymentRecieved
    //console.log(finalPayment)
    //console.log( filterFollowDataRecieved)

    return finalPayment.toLocaleString();
  }

  const handleFilterFollowDataRecievedCase = () => {


    const filterFollowDataRecieved = FollowData.filter((company) => company.bdmName === data.ename && company.caseType === "Recieved")
    const totalPaymentRecieved = filterFollowDataRecieved.reduce((total, obj) => total + obj.totalPayment / 2, 0)
    const finalPayment = totalPaymentRecieved
    //console.log(finalPayment)
    //console.log( filterFollowDataRecieved)

    return finalPayment.toLocaleString();
  }

  // -----------------------------------employees forwarded case functions--------------------------------------------
  let generatedTotalProjection = 0;

  const functionCaluclateTotalForwardedProjection = (isBdm, employeeName) => {

    const filteredFollowDataForward = isBdm ? completeProjectionData.filter((company) => company.ename === employeeName && company.bdmName !== employeeName && company.caseType === "Forwarded") : completeProjectionData.filter((company) => company.ename === employeeName && company.caseType === "Forwarded")
    const filteredFollowDataRecieved = isBdm ? completeProjectionData.filter((company) => company.ename === employeeName && company.bdmName !== employeeName && company.caseType === "Recieved") : completeProjectionData.filter((company) => (company.ename === employeeName || company.bdeName === employeeName) && company.caseType === "Recieved")
    const totalPaymentForwarded = filteredFollowDataForward.reduce((total, obj) => total + obj.totalPayment, 0)
    const totalPaymentRecieved = filteredFollowDataRecieved.reduce((total, obj) => total + obj.totalPayment / 2, 0)
    const finalPayment = totalPaymentForwarded + totalPaymentRecieved

    generatedTotalProjection = generatedTotalProjection + finalPayment;

    return finalPayment.toLocaleString();

  }

  let generatedTotalProjectionRecieved = 0;

  const functionCalculateTotalProjectionRecieved = (employeeName) => {
    const filterFollowDataRecieved = completeProjectionData.filter((company) => company.bdmName === employeeName && company.caseType === "Recieved")
    const totalPaymentRecieved = filterFollowDataRecieved.reduce((total, obj) => total + obj.totalPayment / 2, 0)
    const finalPayment = totalPaymentRecieved
    //console.log(finalPayment)
    //console.log( filterFollowDataRecieved)
    generatedTotalProjectionRecieved = generatedTotalProjectionRecieved + finalPayment

    return finalPayment.toLocaleString();
  }

  // ---------------------------------functions for projection summary------------------------------------------

  const [sortTypeProjection, setSortTypeProjection] = useState({
    totalCompanies: "ascending",
  });
  const [sortTypeServices, setSortTypeServices] = useState({
    offeredServices: "ascending",
  });

  const [sortTypePrice, setSortTypePrice] = useState({
    offeredPrice: "ascending",
  });

  const [sortTypeExpectedPayment, setSortTypeExpectedPayment] = useState({
    expectedPayment: "ascending",
  });

  const handleSortTotalCompanies = (newSortType) => {
    setSortTypeProjection(newSortType);
  };

  const handleSortOfferedServices = (newSortType) => {
    setSortTypeServices(newSortType);
  };

  const handleSortOffredPrize = (newSortType) => {
    setSortTypePrice(newSortType);
  };

  const handleSortExpectedPayment = (newSortType) => {
    //console.log(newSortType);
    setSortTypeExpectedPayment(newSortType);
  };

  const uniqueEnames = [...new Set(completeProjectionDataToday.map((item) => item.ename))];

  console.log(uniqueEnames,"unique")

  const sortedData = uniqueEnames.slice().sort((a, b) => {
    // Sorting logic for total companies
    if (sortTypeProjection === "ascending") {
      return (
        completeProjectionDataToday.filter((partObj) => partObj.ename === a).length -
        completeProjectionDataToday.filter((partObj) => partObj.ename === b).length
      );
    } else if (sortTypeProjection === "descending") {
      return (
        completeProjectionDataToday.filter((partObj) => partObj.ename === b).length -
        completeProjectionDataToday.filter((partObj) => partObj.ename === a).length
      );
    }

    // Sorting logic for offered services
    if (sortTypeServices === "ascending") {
      return (
        completeProjectionDataToday.reduce((totalServicesA, partObj) => {
          if (partObj.ename === a) {
            totalServicesA += partObj.offeredServices.length;
          }
          return totalServicesA;
        }, 0) -
        completeProjectionDataToday.reduce((totalServicesB, partObj) => {
          if (partObj.ename === b) {
            totalServicesB += partObj.offeredServices.length;
          }
          return totalServicesB;
        }, 0)
      );
    } else if (sortTypeServices === "descending") {
      return (
        completeProjectionDataToday.reduce((totalServicesB, partObj) => {
          if (partObj.ename === b) {
            totalServicesB += partObj.offeredServices.length;
          }
          return totalServicesB;
        }, 0) -
        completeProjectionDataToday.reduce((totalServicesA, partObj) => {
          if (partObj.ename === a) {
            totalServicesA += partObj.offeredServices.length;
          }
          return totalServicesA;
        }, 0)
      );
    }
    if (sortTypePrice === "ascending") {
      return (
        completeProjectionDataToday.reduce((totalOfferedPriceA, partObj) => {
          if (partObj.ename === a) {
            totalOfferedPriceA += partObj.offeredPrize;
          }
          return totalOfferedPriceA;
        }, 0) -
        completeProjectionDataToday.reduce((totalOfferedPriceB, partObj) => {
          if (partObj.ename === b) {
            totalOfferedPriceB += partObj.offeredPrize;
          }
          return totalOfferedPriceB;
        }, 0)
      );
    } else if (sortTypePrice === "descending") {
      return (
        completeProjectionDataToday.reduce((totalOfferedPriceB, partObj) => {
          if (partObj.ename === b) {
            totalOfferedPriceB += partObj.offeredPrize;
          }
          return totalOfferedPriceB;
        }, 0) -
        completeProjectionDataToday.reduce((totalOfferedPriceA, partObj) => {
          if (partObj.ename === a) {
            totalOfferedPriceA += partObj.offeredPrize;
          }
          return totalOfferedPriceA;
        }, 0)
      );
    }
    // Sorting logic for expected amount
    if (sortTypeExpectedPayment === "ascending") {
      return (
        completeProjectionDataToday.reduce((totalExpectedPaymentA, partObj) => {
          if (partObj.ename === a) {
            totalExpectedPaymentA += partObj.totalPayment;
          }
          return totalExpectedPaymentA;
        }, 0) -
        completeProjectionDataToday.reduce((totalExpectedPaymentB, partObj) => {
          if (partObj.ename === b) {
            totalExpectedPaymentB += partObj.totalPayment;
          }
          return totalExpectedPaymentB;
        }, 0)
      );
    } else if (sortTypeExpectedPayment === "descending") {
      return (
        completeProjectionDataToday.reduce((totalExpectedPaymentB, partObj) => {
          if (partObj.ename === b) {
            totalExpectedPaymentB += partObj.totalPayment;
          }
          return totalExpectedPaymentB;
        }, 0) -
        completeProjectionDataToday.reduce((totalExpectedPaymentA, partObj) => {
          if (partObj.ename === a) {
            totalExpectedPaymentA += partObj.totalPayment;
          }
          return totalExpectedPaymentA;
        }, 0)
      );
    }

    // If sortType is "none", return original order
    return 0;
  });

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

  const [selectedDateRange, setSelectedDateRange] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filteredDataDateRange, setFilteredDataDateRange] = useState([]);

  const handleSelect = (values) => {
    // Extract startDate and endDate from the values array
    const startDate = values[0];
    const endDate = values[1];

    // Filter followData based on the selected date range
    const filteredDataDateRange = completeProjectionData.filter((product) => {
      const productDate = new Date(product["estPaymentDate"]);

      // Check if the productDate is within the selected date range
      return productDate >= startDate && productDate <= endDate;
    });

    // Set the startDate, endDate, and filteredDataDateRange states
    setStartDate(startDate);
    setEndDate(endDate);
    setFilteredDataDateRange(filteredDataDateRange);
  };

  useEffect(() => {
    // Filter followData based on the selected date range
    const filteredDataDateRange = completeProjectionData.filter((product) => {
      const productDate = new Date(product["estPaymentDate"]);

      // Convert productDate to the sameformat as startDate and endDate
      const formattedProductDate = dayjs(productDate).startOf("day");
      const formattedStartDate = startDate
        ? dayjs(startDate).startOf("day")
        : null;
      const formattedEndDate = endDate ? dayjs(endDate).endOf("day") : null;

      // Check if the formatted productDate is within the selected date range
      if (
        formattedStartDate &&
        formattedEndDate &&
        formattedStartDate.isSame(formattedEndDate)
      ) {
        // If both startDate and endDate are the same, filter for transactions on that day
        return formattedProductDate.isSame(formattedStartDate);
      } else if (formattedStartDate && formattedEndDate) {
        // If different startDate and endDate, filter within the range
        return (
          formattedProductDate >= formattedStartDate &&
          formattedProductDate <= formattedEndDate
        );
      } else {
        // If either startDate or endDate is null, return false
        return false;
      }
    });

    setCompleteProjectionDataToday(filteredDataDateRange);
  }, [startDate, endDate]);

  //console.log("unique" , uniqueBDEobjects)


  return (
    <div>
      <Header bdmName={data.ename} />
      <Navbar userId={userId} />
      {/*------------------------------------------------------ Bookings Dashboard ------------------------------------------------------------ */}

      <div className='container-xl'>
        <div className="employee-dashboard mt-2">
          <div className="card todays-booking totalbooking" id="totalbooking"   >
            <div className="card-header employeedashboard d-flex align-items-center justify-content-between p-1">
              <div className="dashboard-title">
                <h2 className="m-0 pl-1">
                  This Month's Bookings
                </h2>
              </div>
            </div>
            <div className="card-body">
              <div className="row tbl-scroll">
                <table className="table-vcenter table-nowrap admin-dash-tbl">
                  <thead className="admin-dash-tbl-thead">
                    <tr  >
                      <th>SR.NO</th>
                      <th>BDE/BDM NAME</th>
                      <th>BRANCH</th>
                      <th>MATURED CASES</th>
                      <th>TARGET AMOUNT</th>
                      <th>ACHIEVED AMOUNT</th>
                      <th>TARGET/ACHIEVED RATIO</th>
                      <th>LAST BOOKING DATE</th>
                    </tr>
                  </thead>
                  {uniqueBDEobjects ? (
                    <>
                      <tbody>
                        {employeeData &&
                          employeeData
                            .filter(
                              (item) =>
                                (item.designation ===
                                "Sales Executive" || item.designation === "Sales Manager") && item.branchOffice === "Sindhu Bhawan" &&
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
                                    {parseInt(
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
                                      (functionCalculateAchievedAmount(
                                        obj.ename
                                      ) /
                                        functionGetAmount(obj)) *
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
                            {(totalTargetAmount / 2).toLocaleString()}
                          </td>
                          <td>
                            ₹{" "}
                            {(
                              totalAchievedAmount / 2
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
        </div>
      </div>

      {/* ----------------------------------------------bdm recieved cases report-------------------------------------------------------------- */}

      <div className="as-bde-bdm-daSH mt-4 mb-2">
        <div className="container-xl">
          <div className="as-bde-bdm-daSH-inner">
            <ul class="nav nav-tabs" id="myTab" role="tablist">
              {data.bdmWork && (<li class="nav-item" role="presentation">
                <button class="nav-link active" id="receivedAsBDM-tab" data-bs-toggle="tab" data-bs-target="#receivedAsBDM" type="button" role="tab" aria-controls="receivedAsBDM" aria-selected="false">
                  Recieved as BDM cases report
                </button>
              </li>)}
            </ul>
            <div class="tab-content" id="myTabContent">
              <div class="tab-pane fade show active" id="receivedAsBDM" role="tabpanel" aria-labelledby="receivedAsBDM-tab">
                <div className="mt-3 mb-3">
                  <div className="row m-0">
                    <div className="dashboard-headings">
                      <h3 className="m-0">Today's Report</h3>
                    </div>
                    {/* recieved bdm report today */}
                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">TOTAL</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              {teamData.filter((obj) => formatDateNow(obj.bdeForwardDate) === new Date().toISOString().slice(0, 10)).length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 mb-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">GENERAL</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              {teamData.filter((obj) => formatDateNow(obj.bdeForwardDate) === new Date().toISOString().slice(0, 10) && obj.bdmStatus === "Untouched").length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">INTERESTED</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              {teamData.filter((obj) => formatDateNow(obj.bdmStatusChangeDate) === new Date().toISOString().slice(0, 10) && obj.bdmStatus === "Interested").length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">FOLLOW UP</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              {teamData.filter((obj) => formatDateNow(obj.bdmStatusChangeDate) === new Date().toISOString().slice(0, 10) && obj.bdmStatus === "FollowUp").length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">MATURED</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              {teamData.filter((obj) => formatDateNow(obj.bdmStatusChangeDate) === new Date().toISOString().slice(0, 10) && obj.bdmStatus === "Matured").length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">NOT INTERESTED</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              {teamData.filter((obj) => formatDateNow(obj.bdmStatusChangeDate) === new Date().toISOString().slice(0, 10) && obj.bdmStatus === "Not Interested").length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">PROJECTED REVENUE</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              {/* ₹{(followDataToday
                                .filter(obj => obj.ename === data.ename)
                                .reduce((total, obj) => total + obj.totalPayment, 0)).toLocaleString()} */}
                               ₹{handleFilterFollowDataTodayRecievedCase()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">GENERATED REVENUE</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              ₹ {functionCalculateGeneratedRevenue(true).toLocaleString()}

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 mb-3">
                  <div className="row m-0">
                    <div className="d-flex align-items-center justify-content-between p-0">
                      <div className="dashboard-headings ">
                        <h3 className="m-0">Total Report</h3>
                      </div>
                      <div className="pr-1">
                        <select className="pr-2"
                          style={{
                            border: "none",
                            outline: "none",

                          }}
                          value={monthOptions.find(option => option.value === selectedMonthOption)}
                          onChange={(e) => handleChangeForBdm(e.target.value)}
                        >
                          <option disabled value="">Select...</option>
                          {monthOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {/* <Select
                            options={monthOptions}
                            placeholder="Select..."
                            onChange={handleChangeForBdm}
                            value={monthOptions.find(option => option.value === selectedMonthOptionForBdm)}
                          /> */}
                      </div>
                    </div>

                    {/* recieved bdm report total */}
                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">TOTAL</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              {teamData.length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 mb-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">GENERAL</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              {teamData.filter((obj) => obj.bdmStatus === "Untouched").length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">INTERESTED</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              {teamData.filter((obj) => obj.bdmStatus === "Interested").length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">FOLLOW UP</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              {teamData.filter((obj) => obj.bdmStatus === "FollowUp").length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">MATURED</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              {teamData.filter((obj) => obj.bdmStatus === "Matured").length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">NOT INTERESTED</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              {teamData.filter((obj) => obj.bdmStatus === "Not Interested").length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">PROJECTED REVENUE</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              {/* ₹{(FollowData
                                .filter(obj => (obj.ename === data.ename) && obj.bdeName)
                                .reduce((total, obj) => total + obj.totalPayment, 0)).toLocaleString()} */}
                              ₹{handleFilterFollowDataRecievedCase()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                      <div className="dash-card-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dash-card-2-head">GENERATED REVENUE</div>
                          <div className="dash-card-2-body">
                            <div className="dash-card-2-num">
                              ₹ {functionCalculateGeneratedTotalRevenue(true).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------employess forwarded data report------------------------------------------------ */}

      <div className='container-xl'>
        <div className="employee-dashboard">
          <div className="card">
            <div className="card-header employeedashboard d-flex align-items-center justify-content-between">
              <div className="d-flex justify-content-between">
                <div
                  style={{ minWidth: "14vw" }}
                  className="dashboard-title"
                >
                  <h2 style={{ marginBottom: "5px" }}>
                    Employees Forwaded Data Report
                  </h2>
                </div>
              </div>
              <div className="d-flex gap-2">
                <div className="general-searchbar form-control d-flex justify-content-center align-items-center input-icon mt-1">
                  <span className="input-icon-addon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon"
                      width="20"
                      height="24"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path
                        stroke="none"
                        d="M0 0h24v24H0z"
                        fill="none"
                      />
                      <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                      <path d="M21 21l-6 -6" />
                    </svg>
                  </span>
                  <input
                    value={searchTermForwardData}
                    onChange={(e) =>
                      debouncedFilterSearchForwardData(e.target.value)
                    }
                    placeholder="Enter BDE Name..."
                    style={{
                      border: "none",
                      padding: "0px 0px 0px 21px",
                      width: "100%",
                    }}
                    type="text"
                    name="bdeName-search"
                    id="bdeName-search"
                  />
                </div>
                {/* <div
                  style={{ m: 1, padding: "0px" }}
                  className="filter-booking d-flex align-items-center"
                >
                  <div className="filter-main">
                    <select
                      className="form-select mt-1"
                      id={`branch-filter`}
                      value={selectedValue}
                      onChange={(e) => {
                        setSelectedValue(e.target.value)
                        handleFilterForwardCaseBranchOffice(e.target.value)
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
                </div> */}
                {/* <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            style={{ padding: "0px" }}
                          >
                            <DemoContainer
                              components={["SingleInputDateRangeField"]}
                            >
                              <DateRangePicker
                                onChange={(values) => {
                                  const startDateEmp = moment(values[0]).format(
                                    "DD/MM/YYYY"
                                  );
                                  const endDateEmp = moment(values[1]).format(
                                    "DD/MM/YYYY"
                                  );
                                  setSelectedDateRangeEmployee([
                                    startDateEmp,
                                    endDateEmp,
                                  ]);
                                  handleSelectEmployee(values); // Call handleSelect with the selected values
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
                              //calendars={1}
                              />
                            </DemoContainer>
                          </LocalizationProvider> */}
                {/* <div>
                            <select className="form-select mt-1" 
                              onChange={(e) => {
                                handleSelectForwardedEmployeeData(e.target.value); // You missed passing the value to the function
                              }}>
                              <option disabled value="">Select...</option>
                              {forwardEmployeeDataNew.map((obj) => (
                                <option key={obj.id} value={obj.ename}>
                                  {obj.ename}
                                </option>
                              ))}
                            </select>
                          </div> */}
                <div className="services mt-1 mr-3" style={{ zIndex: "9999" }}>
                  <Select
                    isMulti
                    options={options}
                    onChange={(selectedOptions) => {
                      setSelectedValues(selectedOptions.map((option) => option.value));
                      const selectedEmployeeNames = selectedOptions.map((option) => option.label);
                      handleSelectForwardedEmployeeData(selectedEmployeeNames);
                    }}
                    value={selectedValues.map((value) => ({ value, label: value }))}
                    placeholder="Select..."
                  />
                </div>
              </div>
            </div>
            <div className='card-body'>
              <div className="row"
                style={{
                  overflowX: "auto",
                  overflowY: "auto",
                  maxHeight: "60vh",
                  lineHeight: "32px",
                }}>
                <table style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  border: "1px solid #ddd",
                  marginBottom: "5px",
                  lineHeight: "32px",
                  position: "relative", // Make the table container relative
                }}
                  className="table-vcenter table-nowrap">
                  <thead style={{
                    position: "sticky", // Make the header sticky
                    top: "-1px", // Stick it at the top
                    backgroundColor: "#ffb900",
                    color: "black",
                    fontWeight: "bold",
                    zIndex: 1, // Ensure it's above other content
                  }}>
                    <tr>
                      <th style={{
                        lineHeight: "32px",
                      }}>
                        Sr.No
                      </th>
                      <th>BDE/BDM Name</th>
                      <th >Branch Name</th>
                      <th >Forwarded Cases</th>
                      <th >Recieved Cases</th>
                      <th >Forwarded Case Projection</th>
                      <th >Recieved Case Projection</th>
                      <th >Matured Case</th>
                      <th>Generated Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forwardEmployeeData.length !== 0 &&
                      forwardEmployeeData.map((obj, index) => (
                        <tr key={`row-${index}`}>
                          <td style={{
                            lineHeight: "32px",
                            color: "black",
                            textDecoration: "none",
                          }} >{index + 1}</td>
                          <td >{obj.ename}</td>
                          <td>{obj.branchOffice}</td>
                          <td >
                            {companyData.filter((company) => company.ename === obj.ename && (company.bdmAcceptStatus === "Pending" || company.bdmAcceptStatus === "Accept")).length}
                          </td>
                          <td >
                            {
                              teamLeadsData2.filter((company) =>
                                company.bdmName === obj.ename &&
                                forwardEmployeeDataNew.some(empObj =>
                                  empObj.companyId === company.id
                                )
                              ).length
                            }
                          </td>
                          <td>
                            {/* ₹{(FollowData
                            .filter(company => company.bdeName === obj.ename)
                            .reduce((total, obj) => total + obj.totalPayment, 0)).toLocaleString()} */}
                            {obj.bdmWork ? `₹${functionCaluclateTotalForwardedProjection(true, obj.ename)}` : `₹${functionCaluclateTotalForwardedProjection(false, obj.ename)}`}
                          </td>

                          <td>
                            {/* ₹{followDataNew
                            .filter(company => company.ename === obj.ename && company.bdeName)
                            .reduce((total, obj) => total + obj.totalPayment, 0).toLocaleString()
                          } */}
                            ₹{functionCalculateTotalProjectionRecieved(obj.ename)}
                          </td>

                          <td>
                            {companyData.filter((company) => company.ename === obj.ename && company.bdmAcceptStatus === "Accept" && company.Status === "Matured").length}
                          </td>
                          <td>₹ {functionCalculateGeneratedTotalRevenue(obj.ename).toLocaleString()}</td>
                        </tr>
                      ))}
                  </tbody>

                  <tfoot
                    style={{
                      position: "sticky", // Make the footer sticky
                      bottom: -1, // Stick it at the bottom
                      backgroundColor: "#f6f2e9",
                      color: "black",
                      fontWeight: 500,
                      zIndex: 2, // Ensure it's above the content
                    }}
                  >
                    <tr style={{ fontWeight: 500 }}>
                      <td
                        style={{ lineHeight: "32px" }}
                        colSpan="3"
                      >
                        Total
                      </td>
                      <td>
                        {companyData.filter(company =>
                          (company.bdmAcceptStatus === "Pending" || company.bdmAcceptStatus === "Accept") &&
                          forwardEmployeeDataNew.some(empObj => empObj.branchOffice === "Sindhu Bhawan" && company.ename === empObj.ename)
                        ).length}

                      </td>
                      <td>
                        {teamLeadsData2.filter(obj =>
                          forwardEmployeeDataNew.some(empObj => empObj.branchOffice === "Sindhu Bhawan" && (obj.ename === empObj.ename || obj.bdmName === empObj.ename))
                        ).length}

                      </td>
                      <td>
                        {/* ₹{companyData
                        .filter(company => company.bdmAcceptStatus === "Accept" || company.bdmAcceptStatus === "Pending")
                        .reduce((total, company) => {
                          const totalPayment = followData
                            .filter(followCompany => followCompany.companyName === company["Company Name"] && followCompany.bdeName)
                            .reduce((sum, obj) => sum + obj.totalPayment, 0);
                          return total + totalPayment;
                        }, 0)
                      } */}
                        ₹{generatedTotalProjection.toLocaleString()}
                      </td>
                      <td>
                        {/* ₹{companyData
                          .filter(company => company.bdmAcceptStatus === "Accept")
                          .reduce((total, company) => {
                            const totalPayment = followDataNew
                              .filter(followCompany => followCompany.companyName === company["Company Name"])
                              .reduce((sum, obj) => sum + obj.totalPayment, 0);
                            return total + totalPayment;
                          }, 0)
                        } */}
                        ₹{generatedTotalProjectionRecieved.toLocaleString()}
                      </td>
                      <td>
                        {companyData.filter(company => company.bdmAcceptStatus === "Accept" && company.Status === "Matured").length}
                      </td>
                      <td>
                        ₹{generatedTotalRevenue}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* -------------------------------------------------projection summary------------------------------------------------------------ */}
      <div className='container-xl'>
        <div className="employee-dashboard mt-3"
          id="projectionsummaryadmin"   >
          <div className="card">
            <div className="card-header p-1 employeedashboard d-flex align-items-center justify-content-between">
              <div className="dashboard-title pl-1"  >
                <h2 className="m-0">
                  Projection Summary
                </h2>
              </div>
              <div className="d-flex align-items-center pr-1">
                <div className="date-filter">
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    style={{ padding: "0px" }}
                  >
                    <DemoContainer components={["SingleInputDateRangeField"]}>
                      <DateRangePicker className="form-control my-date-picker form-control-sm p-0"
                        onChange={(values) => {
                          const startDate = moment(values[0]).format(
                            "DD/MM/YYYY"
                          );
                          const endDate = moment(values[1]).format(
                            "DD/MM/YYYY"
                          );
                          setSelectedDateRange([startDate, endDate]);
                          handleSelect(values); // Call handleSelect with the selected values
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
                      //calendars={1}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div id="table-default" className="row tbl-scroll" >
                <table className="table-vcenter table-nowrap admin-dash-tbl"  >
                  <thead className="admin-dash-tbl-thead">
                    <tr>
                      <th>
                        Sr. No
                      </th>
                      <th>Employee Name</th>
                      <th>
                        Total Companies
                        <SwapVertIcon
                          style={{
                            height: "15px",
                            width: "15px",
                            cursor: "pointer",
                            marginLeft: "4px",
                          }}
                          onClick={() => {
                            let newSortType;
                            if (sortTypeProjection === "ascending") {
                              newSortType = "descending";
                            } else if (sortTypeProjection === "descending") {
                              newSortType = "none";
                            } else {
                              newSortType = "ascending";
                            }
                            handleSortTotalCompanies(newSortType);
                          }}
                        />
                      </th>
                      <th>
                        Offered Services
                        <SwapVertIcon
                          style={{
                            height: "15px",
                            width: "15px",
                            cursor: "pointer",
                            marginLeft: "4px",
                          }}
                          onClick={() => {
                            let newSortType;
                            if (sortTypeServices === "ascending") {
                              newSortType = "descending";
                            } else if (sortTypeServices === "descending") {
                              newSortType = "none";
                            } else {
                              newSortType = "ascending";
                            }
                            handleSortOfferedServices(newSortType);
                          }}
                        />
                      </th>
                      <th>
                        Total Offered Price
                        <SwapVertIcon
                          style={{
                            height: "15px",
                            width: "15px",
                            cursor: "pointer",
                            marginLeft: "4px",
                          }}
                          onClick={() => {
                            let newSortType;
                            if (sortTypePrice === "ascending") {
                              newSortType = "descending";
                            } else if (sortTypePrice === "descending") {
                              newSortType = "none";
                            } else {
                              newSortType = "ascending";
                            }
                            handleSortOffredPrize(newSortType);
                          }}
                        />
                      </th>
                      <th>
                        Expected Amount
                        <SwapVertIcon
                          style={{
                            height: "15px",
                            width: "15px",
                            cursor: "pointer",
                            marginLeft: "4px",
                          }}
                          onClick={() => {
                            let newSortType;
                            if (sortTypeExpectedPayment === "ascending") {
                              newSortType = "descending";
                            } else if (
                              sortTypeExpectedPayment === "descending"
                            ) {
                              newSortType = "none";
                            } else {
                              newSortType = "ascending";
                            }
                            handleSortExpectedPayment(newSortType);
                          }}
                        />
                      </th>
                      {/* <th>Est. Payment Date</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData && sortedData.length !== 0 ? (
                      <>
                        {sortedData.map((obj, index) => (
                          <tr key={`row-${index}`}>
                            <td>{index + 1}</td>
                            <td>{obj}</td>
                            <td>
                              {
                                completeProjectionDataToday.filter(
                                  (partObj) => partObj.ename === obj
                                ).length
                              }
                              {/* <FcDatabase
                              onClick={() => {
                                functionOpenProjectionTable(obj);
                              }}
                              style={{
                                cursor: "pointer",
                                marginRight: "-71px",
                                marginLeft: "58px",
                              }}
                            /> */}
                            </td>
                            <td>
                              {completeProjectionDataToday.reduce(
                                (totalServices, partObj) => {
                                  if (partObj.ename === obj) {
                                    totalServices += partObj.offeredServices.length;
                                  }
                                  return totalServices;
                                },
                                0
                              )}
                            </td>
                            <td>
                              {completeProjectionDataToday
                                .reduce((totalOfferedPrize, partObj) => {
                                  if (partObj.ename === obj) {
                                    totalOfferedPrize += partObj.offeredPrize;
                                  }
                                  return totalOfferedPrize;
                                }, 0)
                                .toLocaleString("en-IN", numberFormatOptions)}
                            </td>
                            <td>
                              {completeProjectionDataToday
                                .reduce((totalPaymentSum, partObj) => {
                                  if (partObj.ename === obj) {
                                    totalPaymentSum += partObj.totalPayment;
                                  }
                                  return totalPaymentSum;
                                }, 0)
                                .toLocaleString("en-IN", numberFormatOptions)}
                            </td>
                          </tr>
                        ))}
                        {/* Map employeeData with default fields */}
                        {employeeData
                          .filter((employee) => (employee.designation === "Sales Executive") && !sortedData.includes(employee.ename)) // Filter out enames already included in sortedData
                          .map((employee, index) => (
                            <tr key={`employee-row-${index}`}>
                              <td>{sortedData.length + index + 1}</td>
                              <td>{employee.ename}</td>
                              <td>0
                                {/* <FcDatabase
                              onClick={() => {
                                functionOpenProjectionTable(employee.ename);
                              }}
                              style={{
                                cursor: "pointer",
                                marginRight: "-71px",
                                marginLeft: "58px",
                              }}
                            /> */}
                              </td>
                              <td>0</td>
                              <td>0</td>
                              <td>0</td>
                            </tr>
                          ))}
                      </>
                    ) : (
                      employeeData
                        .filter((employee) => !sortedData.includes(employee.ename)) // Filter out enames already included in sortedData
                        .map((employee, index) => (

                          <tr key={`employee-row-${index}`}>
                            <td>{index + 1}</td>
                            <td>{employee.ename}</td>
                            <td>0
                              {/* <FcDatabase
                            onClick={() => {
                              functionOpenProjectionTable(employee.ename);
                            }}
                            style={{
                              cursor: "pointer",
                              marginRight: "-71px",
                              marginLeft: "58px",
                            }}
                          /> */}
                            </td>
                            <td>0</td>
                            <td>0</td>
                            <td>0</td>
                          </tr>

                        ))
                    )}
                  </tbody>
                  {sortedData && sortedData.length !== 0 && (
                    <tfoot className="admin-dash-tbl-tfoot"    >
                      <tr style={{ fontWeight: 500 }}>
                        <td colSpan="2">
                          Total
                        </td>
                        <td>
                          {
                            completeProjectionDataToday.filter((partObj) => partObj.ename)
                              .length
                          }
                          {/* <FcDatabase
                          onClick={() => {
                            functionCompleteProjectionTable();
                          }}
                          style={{
                            cursor: "pointer",
                            marginRight: "-71px",
                            marginLeft: "55px",
                          }}
                        /> */}
                        </td>
                        <td>
                          {completeProjectionDataToday.reduce(
                            (totalServices, partObj) => {
                              totalServices += partObj.offeredServices.length;
                              return totalServices;
                            },
                            0
                          )}
                        </td>
                        <td>
                          {completeProjectionDataToday
                            .reduce((totalOfferedPrize, partObj) => {
                              totalOfferedPrize += partObj.offeredPrize;
                              return totalOfferedPrize;
                            }, 0)
                            .toLocaleString("en-IN", numberFormatOptions)}
                        </td>
                        <td>
                          {completeProjectionDataToday
                            .reduce((totalPaymentSum, partObj) => {
                              totalPaymentSum += partObj.totalPayment;
                              return totalPaymentSum;
                            }, 0)
                            .toLocaleString("en-IN", numberFormatOptions)}
                        </td>
                      </tr>
                    </tfoot>
                  )}

                  {/* {sortedData && sortedData.length === 0 && (
                  <tbody>
                    <tr>
                      <td className="particular" colSpan={9}>
                        <Nodata />
                      </td>
                    </tr>
                  </tbody>
                )} */}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BdmDashboard