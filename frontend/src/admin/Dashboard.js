import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Header from "./Header";
import axios from "axios";
import Nodata from "../components/Nodata";
import "../assets/styles.css";
import { IconButton } from "@mui/material";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import ViewListIcon from "@mui/icons-material/ViewList";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IconEye } from "@tabler/icons-react";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { FaChevronDown } from "react-icons/fa6";

import AnnouncementIcon from "@mui/icons-material/Announcement";
import { lastDayOfDecade } from "date-fns";
// import LoginAdmin from "./LoginAdmin";

function Dashboard() {
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [dateRangenew, setDateRangenew] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [bookingObject, setBookingObject] = useState([]);
  const [buttonToggle, setButtonToggle] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [openTable, setOpenTable] = useState(false);
  const [openEmployeeTable, setOpenEmployeeTable] = useState(false);
  const [displayDateRange, setDateRangeDisplay] = useState(false);
  const [filteredBooking, setFilteredBooking] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [expand, setExpand] = useState("");
  const [companyData, setCompanyData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [dateRange, setDateRange] = useState("by-today");

  const [filteredDataDateRange, setFilteredDataDateRange] = useState([]);
  const [showUpdates, setShowUpdates] = useState(false);
  const [followData, setfollowData] = useState([]);
  const [openProjectionTable, setopenProjectionTable] = useState(false);
  const [projectedEmployee, setProjectedEmployee] = useState([]);

  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const convertedDate = date.toLocaleDateString();
    return convertedDate;
  };

  // https://startupsahay.in/api
  const fetchCompanyData = async () => {
    fetch(`${secretKey}/leads`)
      .then((response) => response.json())
      .then((data) => {
        setCompanyData(data.filter((obj) => obj.ename !== "Not Alloted"));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const fetchEmployeeInfo = async () => {
    fetch(`${secretKey}/einfo`)
      .then((response) => response.json())
      .then((data) => {
        setEmployeeData(data);
      })
      .catch((error) => {
        console.error(`Error Fetching Employee Data `, error);
      });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make a GET request to fetch recent updates data
        const response = await axios.get(`${secretKey}/recent-updates`);
        // Set the retrieved data in the state
        setRecentUpdates(response.data);
      } catch (error) {
        console.error("Error fetching recent updates:", error.message);
      }
    };

    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${secretKey}/companies`);
        const today = new Date().toLocaleDateString();
        const data = response.data.companies;

        const filteredData = data.filter((company) => {
          // Assuming bookingDate is in the format of a string representing a date (e.g., "YYYY-MM-DD")
          const companyDate = formatDate(company.bookingDate);

          return companyDate === today;
        });

        setBookingObject(data);
        setFilteredBooking(filteredData);
      } catch (error) {
        console.error("Error Fetching Booking Details", error.message);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
    fetchCompanies();
    fetchCompanyData();
    fetchEmployeeInfo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uniqueBdeNames = new Set();

  const formatTime = (date, time) => {
    const currentDate = new Date().toLocaleDateString();
    const newTime = new Date().toLocaleTimeString();
    const pm =
      time !== undefined
        ? time.toLowerCase().includes("pm")
          ? true
          : false
        : newTime;
    const currentDateTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (date === currentDate) {
      const [hour, minute, second] = time.split(/:| /).map(Number);
      const formattedHour = pm ? hour + 12 : hour;
      const formattedTime = `${formattedHour}:${minute}`;
      return formattedTime;
    } else if (date === currentDate - 1) {
      return "Yesterday";
    } else {
      return date;
    }
  };
  const changeUpdate = () => {
    setShowUpdates(!showUpdates);
  };

  const handleChangeDate = (filter) => {
    setDateRange(filter);
    const today = new Date(); // Current date

    if (filter === "by-week") {
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000); // Date 7 days ago

      const newfilteredData = bookingObject.filter((company) => {
        const companyDate = new Date(company.bookingDate);
        return companyDate >= lastWeek && companyDate <= today;
      });
      setFilteredBooking(newfilteredData);
    } else if (filter === "by-month") {
      const lastMonth = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        today.getDate()
      ); // Date 1 month ago

      const newfilteredData = bookingObject.filter((company) => {
        const companyDate = new Date(company.bookingDate);
        return companyDate >= lastMonth && companyDate <= today;
      });
      setFilteredBooking(newfilteredData);
    } else if (filter === "by-year") {
      const lastYear = new Date(
        today.getFullYear() - 1,
        today.getMonth(),
        today.getDate()
      ); // Date 1 year ago

      const newfilteredData = bookingObject.filter((company) => {
        const companyDate = new Date(company.bookingDate);
        return companyDate >= lastYear && companyDate <= today;
      });
      setFilteredBooking(newfilteredData);
    } else if (filter === "by-today") {
      const newfilteredData = bookingObject.filter((company) => {
        const companyDate = new Date(company.bookingDate);
        return companyDate.toLocaleDateString() === today.toLocaleDateString();
      });
      setFilteredBooking(newfilteredData);
    }
  };

  const finalFilteredData = [];

  filteredBooking.forEach((obj) => {
    // Check if the bdeName is already in the Set

    if (!uniqueBdeNames.has(obj.bdeName)) {
      // If not, add it to the Set and push the object to the final array
      uniqueBdeNames.add(obj.bdeName);
      finalFilteredData.push(obj);
    }
  });
  const [expandedRow, setExpandedRow] = useState(null);
  const [tableEmployee, setTableEmployee] = useState("");

  const handleRowClick = (index, tableEmployee) => {
    setExpandedRow(expandedRow === index ? null : index);
    setTableEmployee(tableEmployee);
    functionOpenTable();
  };
  const handleExpandRowClick = (index) => {
    setExpand("");
  };
  // Now finalFilteredData contains an array of objects with unique bdeNames
  console.log("unique bde", uniqueBdeNames);
  const functionOpenTable = () => {
    setOpenTable(true);
  };
  const functionOpenEmployeeTable = (employee) => {
    setOpenEmployeeTable(true);
    setSelectedEmployee(employee);
  };
  const closeEmployeeTable = () => {
    setOpenEmployeeTable(false);
  };
  const closeTable = () => {
    setOpenTable(false);
    setExpand("");
  };

  const formattedDates =
    companyData.length !== 0 &&
    selectedEmployee !== "" &&
    companyData
      .filter((data) => data.ename === selectedEmployee) // Filter data based on ename
      .map((data) => formatDate(data.AssignDate));

  const uniqueArray = formattedDates && [...new Set(formattedDates)];

  const properCompanyData =
    selectedEmployee !== "" &&
    companyData.filter((obj) => obj.ename === selectedEmployee);

  // -----------------------------------projection-data--------------------------------------

  const fetchFollowUpData = async () => {
    try {
      const response = await fetch(`${secretKey}/projection-data`);
      const followdata = await response.json();
      setfollowData(followdata);
      console.log(followData);
    } catch (error) {
      console.error("Error fetching data:", error);
      return { error: "Error fetching data" };
    }
  };

  useEffect(() => {
    fetchFollowUpData();
  }, []);

  const uniqueEnames = [...new Set(followData.map((item) => item.ename))];

  const servicesByEname = followData.reduce((acc, curr) => {
    // Check if ename already exists in the accumulator
    if (acc[curr.ename]) {
      // If exists, concatenate the services array
      acc[curr.ename] = acc[curr.ename].concat(curr.offeredServices);
    } else {
      // If not exists, create a new entry with the services array
      acc[curr.ename] = curr.offeredServices;
    }
    return acc;
  }, []);

  //console.log(servicesByEname)

  const totalservicesByEname = followData.reduce((acc, curr) => {
    // Concatenate all offeredServices into a single array
    acc = acc.concat(curr.offeredServices);
    return acc;
  }, []);

  //console.log(totalservicesByEname);

  const companiesByEname = followData.reduce((accumulate, current) => {
    if (accumulate[current.ename]) {
      if (Array.isArray(accumulate[current.ename])) {
        accumulate[current.ename].push(current.companyName);
      } else {
        accumulate[current.ename] = [
          accumulate[current.ename],
          current.companyName,
        ];
      }
    } else {
      accumulate[current.ename] = current.companyName;
    }
    return accumulate;
  }, []);

  console.log(companiesByEname)


  const totalcompaniesByEname = followData.reduce((accumulate, current) => {
    accumulate = accumulate.concat(current.companyName);
    return accumulate;
  }, []);

  console.log(totalcompaniesByEname.length)

  function calculateSum(data) {
    const initialValue = {};

    const sum = data.reduce((accumulator, current) => {
      const { ename, totalPayment, offeredPrize } = current;

      // If the ename already exists in the accumulator, accumulate the totalPayment and offeredPrize
      if (accumulator[ename]) {
        accumulator[ename].totalPaymentSum += totalPayment;
        accumulator[ename].offeredPaymentSum += offeredPrize;
      } else {
        // If the ename does not exist in the accumulator, initialize it
        accumulator[ename] = {
          totalPaymentSum: totalPayment,
          offeredPaymentSum: offeredPrize,
        };
      }
      return accumulator;
    }, initialValue);

    return sum;
  }

  // Calculate the sums
  const sums = calculateSum(followData);

  let totalTotalPaymentSum = 0;
  let totalOfferedPaymentSum = 0;

  for (const key in sums) {
    totalTotalPaymentSum += sums[key].totalPaymentSum;
    totalOfferedPaymentSum += sums[key].offeredPaymentSum;
  }

  const lastFollowDate = followData.reduce((accumulate, current) => {
    if (accumulate[current.ename]) {
      if (Array.isArray(accumulate[current.ename])) {
        accumulate[current.ename].push(current.lastFollowUpdate);
      } else {
        accumulate[current.ename] = [accumulate[current.ename], current.lastFollowUpdate];
      }
    } else {
      accumulate[current.ename] = current.lastFollowUpdate;
    }
    return accumulate;
  }, []);

  console.log(lastFollowDate)


  //console.log("Total totalPaymentSum:", totalTotalPaymentSum);
  //console.log("Total offeredPaymentSum:", totalOfferedPaymentSum);
  const functionOpenProjectionTable = (ename) => {
    console.log("Ename:" , ename)
    setopenProjectionTable(true);
    const projectedData = followData.filter(obj => obj.ename === ename);
    setProjectedEmployee(projectedData);
  };
  //console.log(projectedEmployee)

  const closeProjectionTable = () => {
    setopenProjectionTable(false);
  };

  function calculateSumPopup(data) {
    const initialValue = { totalPaymentSumPopup: 0, offeredPaymentSumPopup: 0, offeredServicesPopup: [] };
  
    const sum = data.reduce((accumulator, currentValue) => {
      // Concatenate offeredServices from each object into a single array
      const offeredServicesPopup = accumulator.offeredServicesPopup.concat(currentValue.offeredServices);
      
      return {
        totalPaymentSumPopup:
          accumulator.totalPaymentSumPopup + currentValue.totalPayment,
        offeredPaymentSumPopup:
          accumulator.offeredPaymentSumPopup + currentValue.offeredPrize,
        offeredServicesPopup: offeredServicesPopup,
      };
    }, initialValue);

    // // Remove duplicate services from the array
    // sum.offeredServices = Array.from(new Set(sum.offeredServices));

    return sum;
  }

  // Calculate the sums
  const { totalPaymentSumPopup, offeredPaymentSumPopup, offeredServicesPopup } =
    calculateSumPopup(projectedEmployee);
  //console.log(totalPaymentSumPopup)
  //console.log(offeredPaymentSumPopup)
  // console.log(offeredServicesPopup)
  const handleIconClick = () => {
    if (!buttonToggle) {
      setDateRangeDisplay(true);
    } else {
      setDateRangeDisplay(false);
    }
    setButtonToggle(!buttonToggle);
  };

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: 'selection',
  };
  const handleSelect = (date) => {
    const filteredDataDateRange = followData.filter(product => {
      const productDate = new Date(product["lastFollowUpdate"]);
      return (
        productDate >= date.selection.startDate &&
        productDate <= date.selection.endDate
      );
    });
    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);
    setFilteredDataDateRange(filteredDataDateRange);
    //console.log(filteredDataDateRange)
 };



  return (
    <div>
      <Header />
      <Navbar />
      <div className="page-wrapper">
        <div className="recent-updates-icon">
          <IconButton
            style={{ backgroundColor: "#ffb900", color: "white" }}
            onClick={changeUpdate}
          >
            <AnnouncementIcon />
          </IconButton>
        </div>
        <div className="page-header d-print-none">
          <div className="container-xl">
            <div className="row">
              <div
                style={{ display: showUpdates ? "block" : "none" }}
                className="col-sm-4 card recent-updates m-2"
              >
                <div className="card-header">
                  <h2>Recent Updates</h2>
                </div>

                <div className="card-body">
                  {recentUpdates.length !== 0 ? (
                    recentUpdates.map((obj) => (
                      <div className="row update-card ">
                        <div className="col">
                          <div className="text-truncate">
                            <strong>{obj.title}</strong>
                          </div>
                          <div className="text-muted">
                            {" "}
                            {formatTime(obj.date, obj.time)}
                          </div>
                        </div>
                        <div className="col-auto align-self-center">
                          <div className="badge bg-primary"></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>
                      <Nodata />
                    </div>
                  )}
                </div>
              </div>
              <div className="col card todays-booking m-2">
                <div className="card-header d-flex justify-content-between ">
                  <div className="heading">
                    <h2>Total Booking</h2>
                  </div>
                  <div className="filter d-flex align-items-center">
                    <strong>Filter By :</strong>

                    <div className="filter-by">
                      <select
                        value={dateRange}
                        onChange={(e) => {
                          handleChangeDate(e.target.value);
                        }}
                        name="filter-by"
                        id="filter-by"
                        className="form-select"
                      >
                        <option value="by-today" selected>
                          today
                        </option>
                        <option value="by-week">Week</option>
                        <option value="by-month">Month</option>
                        <option value="by-year">Year</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div
                    className="row"
                    style={{
                      overflowX: "auto",
                      overflowY: "auto",
                      maxHeight: "60vh",
                      lineHeight: "32px",
                    }}
                  >
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        border: "1px solid #ddd",
                        marginBottom: "5px",
                        lineHeight: "32px",
                      }}
                      className="table-vcenter table-nowrap"
                    >
                      <thead style={{ lineHeight: "32px" }}>
                        <tr
                          style={{
                            backgroundColor: "#ffb900",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          <th style={{ lineHeight: "32px" }}>SR.NO</th>
                          <th>BDE NAME</th>
                          <th>MATURED CASES</th>
                          <th>NUM OF UNIQUE SERVICES OFFERED</th>
                          <th>TOTAL PAYMENT</th>
                          <th>RECEIVED PAYMENT</th>
                          <th>PENDING PAYMENT</th>
                        </tr>
                      </thead>
                      {finalFilteredData.length !== 0 ? (
                        <>
                          <tbody>
                            {finalFilteredData.map((obj, index) => (
                              <>
                                <tr style={{ position: "relative" }}>
                                  <td style={{ lineHeight: "32px" }}>
                                    {index + 1}
                                  </td>
                                  <td>{obj.bdeName}</td>
                                  <td>
                                    <div className="row">
                                      <div
                                        style={{ textAlign: "right" }}
                                        className="col"
                                      >
                                        {filteredBooking.filter((data) => {
                                          return (
                                            data.bdeName === obj.bdeName &&
                                            data.bdeName === data.bdmName
                                          );
                                        }).length +
                                          filteredBooking.filter((data) => {
                                            return (
                                              data.bdeName === obj.bdeName &&
                                              data.bdeName !== data.bdmName
                                            );
                                          }).length /
                                            2}{" "}
                                      </div>
                                      <div className="col-sm-5">
                                        <IconEye
                                          style={{
                                            cursor: "pointer",
                                            marginLeft: "5px",
                                            height: "17px",
                                          }}
                                          onClick={() =>
                                            handleRowClick(index, obj.bdeName)
                                          }
                                        />
                                      </div>
                                    </div>
                                  </td>

                                  <td>
                                    {
                                      filteredBooking
                                        .filter(
                                          (data) => data.bdeName === obj.bdeName
                                        ) // Filter objects with bdeName same as myName
                                        .reduce((totalServices, obj) => {
                                          // Use reduce to calculate the total number of services
                                          return (
                                            totalServices +
                                            (obj.services && obj.services[0]
                                              ? obj.services[0]
                                                  .split(",")
                                                  .map((service) =>
                                                    service.trim()
                                                  ).length
                                              : 0)
                                          );
                                        }, 0) // Initialize totalServices as 0
                                    }
                                  </td>
                                  <td>
                                    {" "}
                                    {
                                      filteredBooking
                                        .filter(
                                          (data) => data.bdeName === obj.bdeName
                                        ) // Filter objects with bdeName same as myName
                                        .reduce((totalPayments, obj1) => {
                                          // Use reduce to calculate the total of totalPayments
                                          return (
                                            totalPayments +
                                            (obj1.bdeName === obj1.bdmName
                                              ? obj1.totalPayment !== 0
                                                ? obj1.totalPayment
                                                : 0
                                              : obj1.totalPayment !== 0
                                              ? obj1.totalPayment / 2
                                              : 0)
                                          );
                                        }, 0)
                                        .toLocaleString() // Initialize totalPayments as 0
                                    }
                                  </td>
                                  <td>
                                    {
                                      filteredBooking
                                        .filter(
                                          (data) => data.bdeName === obj.bdeName
                                        ) // Filter objects with bdeName same as obj.bdeName
                                        .reduce((totalPayments, obj1) => {
                                          // Use reduce to calculate the total of totalPayments
                                          return (
                                            totalPayments +
                                            (obj1.firstPayment === 0
                                              ? obj1.bdeName === obj1.bdmName
                                                ? obj1.totalPayment / 2 // If bdeName and bdmName are the same
                                                : obj1.totalPayment // If bdeName and bdmName are different
                                              : obj1.bdeName === obj1.bdmName
                                              ? obj1.firstPayment // If bdeName and bdmName are the same
                                              : obj1.firstPayment / 2) // If bdeName and bdmName are different
                                          );
                                        }, 0)
                                        .toLocaleString() // Initialize totalPayments as 0
                                    }
                                  </td>
                                  <td>
                                    {
                                      filteredBooking
                                        .filter(
                                          (data) => data.bdeName === obj.bdeName
                                        ) // Filter objects with bdeName same as obj.bdeName
                                        .reduce((totalPayments, obj1) => {
                                          // Use reduce to calculate the total of totalPayments
                                          return (
                                            totalPayments +
                                            (obj1.firstPayment !== 0
                                              ? obj1.bdeName !== obj1.bdmName
                                                ? (obj1.totalPayment -
                                                    obj1.firstPayment) /
                                                  2 // If bdeName and bdmName are the same
                                                : obj1.totalPayment -
                                                  obj1.firstPayment // If bdeName and bdmName are different
                                              : 0) // If bdeName and bdmName are different
                                          );
                                        }, 0)
                                        .toLocaleString() // Initialize totalPayments as 0
                                    }
                                  </td>
                                </tr>
                              </>
                            ))}
                          </tbody>

                          <tfoot>
                            <tr style={{ fontWeight: "500" }}>
                              <td colSpan={2} style={{ lineHeight: "32px" }}>
                                Total:{finalFilteredData.length}
                              </td>

                              <td>
                                {filteredBooking.filter((data) => {
                                  return data.bdeName === data.bdmName;
                                }).length +
                                  filteredBooking.filter((data) => {
                                    return data.bdeName !== data.bdmName;
                                  }).length /
                                    2}
                              </td>
                              <td>
                                {filteredBooking.reduce((totalLength, obj) => {
                                  // Split the services string by commas and calculate the length of the resulting array
                                  const serviceLength =
                                    obj.services[0].split(",").length;
                                  // Add the length of services for the current object to the total length
                                  return totalLength + serviceLength;
                                }, 0)}
                              </td>

                              <td>
                                {filteredBooking
                                  .reduce((totalPayment, obj) => {
                                    // Add the totalPayment of the current object to the totalPayment accumulator
                                    const finalPayment =
                                      obj.bdeName === obj.bdmName
                                        ? obj.totalPayment
                                        : obj.totalPayment / 2;
                                    return totalPayment + finalPayment;
                                  }, 0)
                                  .toLocaleString()}
                              </td>

                              <td>
                                {filteredBooking
                                  .reduce((totalFirstPayment, obj) => {
                                    // If firstPayment is 0, count totalPayment instead
                                    const paymentToAdd =
                                      obj.firstPayment === 0
                                        ? obj.bdeName === obj.bdmName
                                          ? obj.totalPayment
                                          : obj.totalPayment / 2
                                        : obj.bdeName === obj.bdmName
                                        ? obj.firstPayment
                                        : obj.firstPayment / 2;
                                    // Add the paymentToAdd to the totalFirstPayment accumulator
                                    return totalFirstPayment + paymentToAdd;
                                  }, 0)
                                  .toLocaleString()}
                              </td>
                              <td>
                                {filteredBooking
                                  .reduce((totalFirstPayment, obj) => {
                                    // If firstPayment is 0, count totalPayment instead

                                    const paymentToAdd =
                                      obj.bdeName === obj.bdmName
                                        ? obj.firstPayment === 0
                                          ? 0
                                          : obj.totalPayment - obj.firstPayment
                                        : obj.firstPayment === 0
                                        ? 0
                                        : obj.totalPayment - obj.firstPayment;

                                    // Add the paymentToAdd to the totalFirstPayment accumulator
                                    return totalFirstPayment + paymentToAdd;
                                  }, 0)
                                  .toLocaleString()}
                              </td>
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

              {/* Employee side Dashboard Analysis */}
              <div className="employee-dashboard ">
                <div className="card">
                  <div className="card-header heading">
                    <h2>Employee Dashboard</h2>
                  </div>
                  <div className="card-body">
                    <div
                      className="row"
                      style={{
                        overflowX: "auto",
                        overflowY: "auto",
                        maxHeight: "60vh",
                        lineHeight: "32px",
                      }}
                    >
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          border: "1px solid #ddd",
                          marginBottom: "5px",
                          lineHeight: "32px",
                          position: "relative", // Make the table container relative
                        }}
                        className="table-vcenter table-nowrap"
                      >
                        {/* <thead>
                          <tr
                            style={{
                              backgroundColor: "#ffb900",
                              color: "white",
                              fontWeight: "bold",

                            }}
                          > */}
                        <thead
                          style={{
                            position: "sticky", // Make the header sticky
                            top: "-1px", // Stick it at the top
                            backgroundColor: "#ffb900",
                            color: "black",
                            fontWeight: "bold",
                            zIndex: 1, // Ensure it's above other content
                          }}
                        >
                          <tr>
                            <th
                              style={{
                                lineHeight: "32px",
                              }}
                            >
                              Sr. No
                            </th>
                            <th>BDE/BDM Name</th>
                            <th>Untouched</th>
                            <th>Busy</th>
                            <th>Not Picked Up</th>
                            <th>Junk</th>
                            <th>Follow Up</th>
                            <th>Interested</th>
                            <th>Not Interested</th>
                            <th>Matured</th>
                            <th>Total Leads</th>
                            <th>Last Lead Assign Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {employeeData.length !== 0 &&
                            companyData.length !== 0 &&
                            employeeData.map((obj, index) => (
                              <React.Fragment key={index}>
                                <tr>
                                  <td
                                    style={{
                                      lineHeight: "32px",
                                    }}
                                    key={`row-${index}-1`}
                                  >
                                    {index + 1}
                                  </td>
                                  <td key={`row-${index}-2`}>{obj.ename}</td>
                                  <td key={`row-${index}-3`}>
                                    {
                                      companyData.filter(
                                        (data) =>
                                          data.ename === obj.ename &&
                                          data.Status === "Untouched"
                                      ).length
                                    }
                                  </td>
                                  <td key={`row-${index}-4`}>
                                    {
                                      companyData.filter(
                                        (data) =>
                                          data.ename === obj.ename &&
                                          data.Status === "Busy"
                                      ).length
                                    }
                                  </td>
                                  <td key={`row-${index}-5`}>
                                    {
                                      companyData.filter(
                                        (data) =>
                                          data.ename === obj.ename &&
                                          data.Status === "Not Picked Up"
                                      ).length
                                    }
                                  </td>
                                  <td key={`row-${index}-6`}>
                                    {
                                      companyData.filter(
                                        (data) =>
                                          data.ename === obj.ename &&
                                          data.Status === "Junk"
                                      ).length
                                    }
                                  </td>
                                  <td key={`row-${index}-7`}>
                                    {
                                      companyData.filter(
                                        (data) =>
                                          data.ename === obj.ename &&
                                          data.Status === "FollowUp"
                                      ).length
                                    }
                                  </td>
                                  <td key={`row-${index}-8`}>
                                    {
                                      companyData.filter(
                                        (data) =>
                                          data.ename === obj.ename &&
                                          data.Status === "Interested"
                                      ).length
                                    }
                                  </td>
                                  <td key={`row-${index}-9`}>
                                    {
                                      companyData.filter(
                                        (data) =>
                                          data.ename === obj.ename &&
                                          data.Status === "Not Interested"
                                      ).length
                                    }
                                  </td>
                                  <td key={`row-${index}-10`}>
                                    {
                                      companyData.filter(
                                        (data) =>
                                          data.ename === obj.ename &&
                                          data.Status === "Matured"
                                      ).length
                                    }
                                  </td>
                                  <td key={`row-${index}-11`}>
                                    {
                                      companyData.filter(
                                        (data) => data.ename === obj.ename
                                      ).length
                                    }
                                  </td>
                                  <td key={`row-${index}-12`}>
                                    {formatDate(
                                      companyData
                                        .filter(
                                          (data) => data.ename === obj.ename
                                        )
                                        .reduce(
                                          (latestDate, data) => {
                                            return latestDate.AssignDate >
                                              data.AssignDate
                                              ? latestDate
                                              : data;
                                          },
                                          { AssignDate: 0 }
                                        ).AssignDate
                                    )}
                                    <ViewListIcon
                                      onClick={() => {
                                        functionOpenEmployeeTable(obj.ename);
                                      }}
                                      style={{ cursor: "pointer" }}
                                    />
                                  </td>
                                </tr>
                              </React.Fragment>
                            ))}
                        </tbody>
                        {employeeData.length !== 0 &&
                          companyData.length !== 0 && (
                            <tfoot  style={{
                              position: "sticky", // Make the footer sticky
                              bottom: -1, // Stick it at the bottom
                              backgroundColor: "#f6f2e9",
                              color: "black",
                              fontWeight: 500,
                              zIndex: 2, // Ensure it's above the content
                            }}>
                              <tr style={{ fontWeight: 500 }}>
                                <td style={{ lineHeight: "32px" }} colSpan="2">
                                  Total
                                </td>
                                <td>
                                  {
                                    companyData.filter(
                                      (partObj) =>
                                        partObj.Status === "Untouched"
                                    ).length
                                  }
                                </td>
                                <td>
                                  {
                                    companyData.filter(
                                      (partObj) => partObj.Status === "Busy"
                                    ).length
                                  }
                                </td>
                                <td>
                                  {
                                    companyData.filter(
                                      (partObj) =>
                                        partObj.Status === "Not Picked Up"
                                    ).length
                                  }
                                </td>
                                <td>
                                  {
                                    companyData.filter(
                                      (partObj) => partObj.Status === "Junk"
                                    ).length
                                  }
                                </td>
                                <td>
                                  {
                                    companyData.filter(
                                      (partObj) => partObj.Status === "FollowUp"
                                    ).length
                                  }
                                </td>
                                <td>
                                  {
                                    companyData.filter(
                                      (partObj) =>
                                        partObj.Status === "Interested"
                                    ).length
                                  }
                                </td>
                                <td>
                                  {
                                    companyData.filter(
                                      (partObj) =>
                                        partObj.Status === "Not Interested"
                                    ).length
                                  }
                                </td>
                                <td>
                                  {
                                    companyData.filter(
                                      (partObj) => partObj.Status === "Matured"
                                    ).length
                                  }
                                </td>
                                <td>{companyData.length}</td>
                                <td>-</td>
                              </tr>
                            </tfoot>
                          )}
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pop Up for Expanding the Data */}

      <Dialog open={openTable} onClose={closeTable} fullWidth maxWidth="lg">
        <DialogContent>
          <div
            id="table-default"
            style={{
              overflowX: "auto",
              overflowY: "auto",
              maxHeight: "60vh",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid #ddd",
                marginBottom: "10px",
              }}
              className="table-vcenter table-nowrap"
            >
              <thead stSyle={{ backgroundColor: "grey" }}>
                <tr
                  style={{
                    backgroundColor: "#ffb900",
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  <th style={{ lineHeight: "32px" }}>SR.NO</th>
                  <th>BOOKING DATE & TIME</th>
                  <th>BDE NAME</th>
                  <th>COMPANY NAME</th>
                  <th>COMPANY NUMBER</th>
                  <th>COMPANY EMAIL</th>
                  <th>SERVICES</th>
                  <th>TOTAL PAYMENT</th>
                  <th>RECEIVED PAYMENT</th>
                  <th>PENDING PAYMENT</th>
                  <th>50/50 CASE</th>
                  <th>CLOSED/SUPPORTED BY</th>
                  <th>REMARKS</th>
                </tr>
              </thead>
              <tbody>
                {expand === "" &&
                  filteredBooking
                    .filter((data) => data.bdeName === tableEmployee)
                    .map((mainObj, index) => (
                      <>
                        <tr>
                          <td style={{ lineHeight: "32px" }}>{index + 1}</td>
                          <td>{`${formatDate(mainObj.bookingDate)}(${
                            mainObj.bookingTime
                          })`}</td>
                          <td>{mainObj.bdeName}</td>
                          <td>{mainObj.companyName}</td>
                          <td>{mainObj.contactNumber}</td>
                          <td>{mainObj.companyEmail}</td>
                          <td>{mainObj.services[0]}</td>
                          <td>
                            {(mainObj.bdeName !== mainObj.bdmName
                              ? mainObj.totalPayment / 2
                              : mainObj.totalPayment
                            ).toLocaleString()}
                          </td>
                          <td>
                            {
                              (mainObj.firstPayment !== 0
                                ? mainObj.bdeName === mainObj.bdmName
                                  ? mainObj.firstPayment // If bdeName and bdmName are the same
                                  : mainObj.firstPayment / 2 // If bdeName and bdmName are different
                                : mainObj.bdeName === mainObj.bdmName
                                ? mainObj.totalPayment // If firstPayment is 0 and bdeName and bdmName are the same
                                : mainObj.totalPayment / 2
                              ).toLocaleString() // If firstPayment is 0 and bdeName and bdmName are different
                            }
                          </td>
                          <td>
                            {" "}
                            {(mainObj.firstPayment !== 0
                              ? mainObj.bdeName === mainObj.bdmName
                                ? mainObj.totalPayment - mainObj.firstPayment
                                : (mainObj.totalPayment -
                                    mainObj.firstPayment) /
                                  2
                              : 0
                            ).toLocaleString()}{" "}
                          </td>
                          <td>
                            {mainObj.bdeName !== mainObj.bdmName ? "Yes" : "No"}
                          </td>
                          <td>
                            {mainObj.bdeName !== mainObj.bdmName
                              ? mainObj.bdmType === "closeby"
                                ? `Closed by ${mainObj.bdmName}`
                                : `Supported by ${mainObj.bdmName}`
                              : `Self Closed`}{" "}
                            {mainObj.bdeName !== mainObj.bdmName &&
                              mainObj.bdmType === "closeby" && (
                                <AddCircleIcon
                                  onClick={() => setExpand(mainObj.companyName)}
                                  style={{ cursor: "pointer" }}
                                />
                              )}
                          </td>
                          <td>{mainObj.paymentRemarks}</td>
                        </tr>
                        {expand === index && (
                          <>
                            <tr>
                              <td style={{ lineHeight: "32px" }}>{`${
                                index + 1
                              }(${1})`}</td>
                              <td>{`${formatDate(mainObj.bookingDate)}(${
                                mainObj.bookingTime
                              })`}</td>
                              <td>{mainObj.bdmName}</td>
                              <td>{mainObj.companyName}</td>
                              <td>{mainObj.contactNumber}</td>
                              <td>{mainObj.companyEmail}</td>
                              <td>{mainObj.services[0]}</td>
                              <td>
                                {" "}
                                {(
                                  mainObj.totalPayment / 2
                                ).toLocaleString()}{" "}
                              </td>
                              <td>
                                {(mainObj.firstPayment !== 0
                                  ? mainObj.firstPayment / 2
                                  : mainObj.totalPayment / 2
                                ).toLocaleString()}{" "}
                              </td>
                              <td>
                                {(mainObj.firstPayment !== 0
                                  ? mainObj.bdeName === mainObj.bdmName
                                    ? mainObj.totalPayment -
                                      mainObj.firstPayment
                                    : (mainObj.totalPayment -
                                        mainObj.firstPayment) /
                                      2
                                  : 0
                                ).toLocaleString()}{" "}
                              </td>
                              <td>{"Yes"}</td>
                              <td>{`${mainObj.bdeName}'s Case`}</td>
                              <td>{mainObj.paymentRemarks}</td>
                            </tr>
                          </>
                        )}
                      </>
                    ))}
              </tbody>
              {expand === "" && (
                <tfoot>
                  <tr>
                    <th colSpan={3}>
                      <strong>Total</strong>
                    </th>
                    <th>-</th>
                    <th>-</th>
                    <th>-</th>
                    <th>-</th>
                    <th>
                      {filteredBooking
                        .filter((data) => data.bdeName === tableEmployee)
                        .reduce((total, obj) => {
                          return obj.bdeName === obj.bdmName
                            ? total + obj.totalPayment
                            : total + obj.totalPayment / 2;
                        }, 0)
                        .toLocaleString()}
                    </th>
                    <th>
                      {filteredBooking
                        .filter((data) => data.bdeName === tableEmployee)
                        .reduce((total, obj) => {
                          return obj.bdeName === obj.bdmName
                            ? obj.firstPayment === 0
                              ? total + obj.totalPayment
                              : total + obj.firstPayment
                            : obj.firstPayment === 0
                            ? total + obj.totalPayment / 2
                            : total + obj.firstPayment / 2;
                        }, 0)
                        .toLocaleString()}
                    </th>
                    <th>
                      {filteredBooking
                        .filter((data) => data.bdeName === tableEmployee)
                        .reduce((total, obj) => {
                          return obj.bdeName === obj.bdmName
                            ? obj.firstPayment === 0
                              ? 0
                              : total + (obj.totalPayment - obj.firstPayment)
                            : obj.firstPayment === 0
                            ? 0
                            : total + (obj.totalPayment - obj.firstPayment) / 2;
                        }, 0)
                        .toLocaleString()}
                    </th>
                    <th>-</th>
                    <th>-</th>
                    <th>-</th>
                  </tr>
                </tfoot>
              )}
              <tbody>
                {expand !== "" &&
                  filteredBooking
                    .filter(
                      (obj) =>
                        obj.bdeName === tableEmployee &&
                        obj.companyName === expand
                    )
                    .map((mainObj, index) => (
                      <>
                      <tr key={mainObj._id}>
                        <td style={{ lineHeight: "32px" }}>{`${
                          index + 1
                        }`}</td>
                        <td>{`${formatDate(mainObj.bookingDate)}(${
                          mainObj.bookingTime
                        })`}</td>
                        <td>{mainObj.bdeName}</td>
                        <td>{mainObj.companyName}</td>
                        <td>{mainObj.contactNumber}</td>
                        <td>{mainObj.companyEmail}</td>
                        <td>{mainObj.services}</td>
                        <td>{(mainObj.totalPayment / 2).toLocaleString()}</td>
                        <td>
                          {(mainObj.firstPayment !== 0
                            ? mainObj.firstPayment / 2
                            : mainObj.totalPayment / 2
                          ).toLocaleString()}
                        </td>
                        <td>
                          {(mainObj.firstPayment !== 0
                            ? mainObj.bdeName === mainObj.bdmName
                              ? mainObj.totalPayment - mainObj.firstPayment
                              : (mainObj.totalPayment - mainObj.firstPayment) /
                                2
                            : 0
                          ).toLocaleString()}
                        </td>
                        <td>Yes</td>
                        <td>{`Closed by ${mainObj.bdmName}` } <RemoveCircleIcon style={{cursor:'pointer'}} onClick={()=>{
                          setExpand("")
                        }}/> </td>
                        <td>{mainObj.paymentRemarks}</td>
                      </tr>
                      <tr>
                              <td style={{ lineHeight: "32px" }}>{`${
                                index + 2
                              }`}</td>
                              <td>{`${formatDate(mainObj.bookingDate)}(${
                                mainObj.bookingTime
                              })`}</td>
                              <td>{mainObj.bdmName}</td>
                              <td>{mainObj.companyName}</td>
                              <td>{mainObj.contactNumber}</td>
                              <td>{mainObj.companyEmail}</td>
                              <td>{mainObj.services[0]}</td>
                              <td>
                                {" "}
                                {(
                                  mainObj.totalPayment / 2
                                ).toLocaleString()}{" "}
                              </td>
                              <td>
                                {(mainObj.firstPayment !== 0
                                  ? mainObj.firstPayment / 2
                                  : mainObj.totalPayment / 2
                                ).toLocaleString()}{" "}
                              </td>
                              <td>
                                {(mainObj.firstPayment !== 0
                                  ? mainObj.bdeName === mainObj.bdmName
                                    ? mainObj.totalPayment -
                                      mainObj.firstPayment
                                    : (mainObj.totalPayment -
                                        mainObj.firstPayment) /
                                      2
                                  : 0
                                ).toLocaleString()}{" "}
                              </td>
                              <td>{"Yes"}</td>
                              <td>{`${mainObj.bdeName}'s Case`}</td>
                              <td>{mainObj.paymentRemarks}</td>
                            </tr>
                            
                      </>
                    ))}
              </tbody>
              <tfoot>
              {expand !== "" && 
                  filteredBooking
                    .filter(
                      (obj) =>
                        obj.bdeName === tableEmployee &&
                        obj.companyName === expand
                    )
                    .map((mainObj, index) => (
                      <>
                      
                      <tr key={mainObj._id}>
                       <th colSpan={3}>Total :</th>
                       <th>-</th>
                       <th>-</th>
                       <th>-</th>
                       <th>-</th>
                       <th>{(mainObj.totalPayment).toLocaleString()}</th>
                       <th>{(mainObj.firstPayment!==0 ? mainObj.firstPayment : mainObj.totalPayment ).toLocaleString()}</th>
                       <th>{(mainObj.firstPayment!==0 ? mainObj.totalPayment - mainObj.firstPayment : 0).toLocaleString()}</th>
                       <th>-</th>
                       <th>-</th>
                       <th>-</th>
                      </tr>
                    
                            
                      </>
                    ))}


              </tfoot>
              
            </table>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openEmployeeTable}
        onClose={closeEmployeeTable}
        fullWidth
        maxWidth="lg"
      >
        <DialogContent>
          <div
            id="table-default"
            style={{
              overflowX: "auto",
              overflowY: "auto",
              maxHeight: "60vh",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid #ddd",
                marginBottom: "10px",
              }}
              className="table-vcenter table-nowrap"
            >
              <thead stSyle={{ backgroundColor: "grey" }}>
                <tr
                  style={{
                    backgroundColor: "#ffb900",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  <th
                    style={{
                      lineHeight: "32px",
                    }}
                  >
                    Sr. No
                  </th>
                  <th>Lead Assign Date</th>
                  <th>Untouched</th>
                  <th>Busy</th>
                  <th>Not Picked Up</th>
                  <th>Junk</th>
                  <th>Follow Up</th>
                  <th>Interested</th>
                  <th>Not Interested</th>
                  <th>Matured</th>
                  <th>Total Leads</th>
                </tr>
              </thead>
              <tbody>
                {uniqueArray &&
                  uniqueArray.map((obj, index) => (
                    <tr key={`row-${index}`}>
                      <td>{index + 1}</td>
                      <td>{obj}</td>
                      <td>
                        {
                          properCompanyData.filter(
                            (partObj) =>
                              formatDate(partObj.AssignDate) === obj &&
                              partObj.Status === "Untouched"
                          ).length
                        }
                      </td>
                      <td>
                        {
                          properCompanyData.filter(
                            (partObj) =>
                              formatDate(partObj.AssignDate) === obj &&
                              partObj.Status === "Busy"
                          ).length
                        }
                      </td>
                      <td>
                        {
                          properCompanyData.filter(
                            (partObj) =>
                              formatDate(partObj.AssignDate) === obj &&
                              partObj.Status === "Not Picked Up"
                          ).length
                        }
                      </td>
                      <td>
                        {
                          properCompanyData.filter(
                            (partObj) =>
                              formatDate(partObj.AssignDate) === obj &&
                              partObj.Status === "Junk"
                          ).length
                        }
                      </td>
                      <td>
                        {
                          properCompanyData.filter(
                            (partObj) =>
                              formatDate(partObj.AssignDate) === obj &&
                              partObj.Status === "FollowUp"
                          ).length
                        }
                      </td>
                      <td>
                        {
                          properCompanyData.filter(
                            (partObj) =>
                              formatDate(partObj.AssignDate) === obj &&
                              partObj.Status === "Interested"
                          ).length
                        }
                      </td>
                      <td>
                        {
                          properCompanyData.filter(
                            (partObj) =>
                              formatDate(partObj.AssignDate) === obj &&
                              partObj.Status === "Not Interested"
                          ).length
                        }
                      </td>
                      <td>
                        {
                          properCompanyData.filter(
                            (partObj) =>
                              formatDate(partObj.AssignDate) === obj &&
                              partObj.Status === "Matured"
                          ).length
                        }
                      </td>
                      <td>
                        {
                          properCompanyData.filter(
                            (partObj) => formatDate(partObj.AssignDate) === obj
                          ).length
                        }
                      </td>
                    </tr>
                  ))}
              </tbody>
              {uniqueArray && (
                <tfoot>
                  <tr style={{ fontWeight: 500 }}>
                    <td colSpan="2">Total</td>
                    <td>
                      {
                        properCompanyData.filter(
                          (partObj) => partObj.Status === "Untouched"
                        ).length
                      }
                    </td>
                    <td
                      style={{
                        lineHeight: "32px",
                      }}
                    ></td>
                    <td
                      style={{
                        lineHeight: "32px",
                      }}
                    >
                      {
                        properCompanyData.filter(
                          (partObj) => partObj.Status === "Busy"
                        ).length
                      }
                    </td>
                    <td>
                      {
                        properCompanyData.filter(
                          (partObj) => partObj.Status === "Not Picked Up"
                        ).length
                      }
                    </td>
                    <td>
                      {
                        properCompanyData.filter(
                          (partObj) => partObj.Status === "Junk"
                        ).length
                      }
                    </td>
                    <td>
                      {
                        properCompanyData.filter(
                          (partObj) => partObj.Status === "FollowUp"
                        ).length
                      }
                    </td>
                    <td>
                      {
                        properCompanyData.filter(
                          (partObj) => partObj.Status === "Interested"
                        ).length
                      }
                    </td>
                    <td>
                      {
                        properCompanyData.filter(
                          (partObj) => partObj.Status === "Not Interested"
                        ).length
                      }
                    </td>
                    <td>
                      {
                        properCompanyData.filter(
                          (partObj) => partObj.Status === "Matured"
                        ).length
                      }
                    </td>
                    <td>{properCompanyData.length}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </DialogContent>
      </Dialog>

      {/* -------------------------------------projection-dashboard--------------------------------------------- */}

      <div className="container-xl mt-2">
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between">
            <div>
              <h2>Projection Dashboard</h2>
            </div>
            <div><button onClick={handleIconClick} style={{ border: "none", padding: "0px", backgroundColor: "white" }}>
              <FaChevronDown style={{ width: "14px", height: "14px", color: "#bcbaba", }} />
            </button></div>
            {displayDateRange && (
              <div class="position-absolute" style={{ zIndex: "1", top: "15%", left: "75%" }} >
                <DateRangePicker
                  ranges={[selectionRange]}
                  onClose={() => setDateRangeDisplay(false)}
                  onChange={handleSelect}
                />
              </div>
            )}

          </div>
          <div></div>
          <div className="card-body">
            <div
              id="table-default"
              style={{
                overflowX: "auto",
                overflowY: "auto",
                maxHeight: "60vh",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  border: "1px solid #ddd",
                  marginBottom: "10px",
                }}
                className="table-vcenter table-nowrap"
              >
                <thead stSyle={{ backgroundColor: "grey" }}>
                  <tr
                    style={{
                      backgroundColor: "#ffb900",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    <th
                      style={{
                        lineHeight: "32px",
                      }}
                    >
                      Sr. No
                    </th>
                    <th>Company Name</th>
                    <th>Total Companies</th>
                    <th>Offered Services</th>
                    <th>Total Offered Price</th>
                    <th>Expected Amount</th>
                    <th>Last Followup Date</th>

                  </tr>
                </thead>
                <tbody>
                  {uniqueEnames &&
                    uniqueEnames.map((ename, index) => {
                      // Calculate the count of services for the current ename
                      const serviceCount = servicesByEname[ename] ? servicesByEname[ename].length : 0;
                      const companyCount = companiesByEname[ename] ? companiesByEname[ename].length : 0;
                      const totalPaymentByEname = sums[ename] ? sums[ename].totalPaymentSum : 0;
                      const offeredPrizeByEname = sums[ename] ? sums[ename].offeredPaymentSum : 0;

                      return (
                        <tr key={`row-${index}`}>
                          <td style={{ lineHeight: "32px" }}>{index + 1}</td>
                          <td>{ename}</td>
                          <td>{serviceCount}</td>
                          <td>{totalPaymentByEname.toLocaleString()}</td>
                          <td>{offeredPrizeByEname.toLocaleString()}</td>
                          <td>{companyCount}
                            <ViewListIcon
                              onClick={() => {
                                functionOpenProjectionTable(ename);
                              }}
                              style={{ cursor: "pointer" }}
                            /></td>
                        </tr>
                      );
                    })}
                </tbody>
                {followData && (
                  <tfoot>
                    <tr style={{ fontWeight: 500 }}>
                      <td style={{ lineHeight: '32px' }} colSpan="2">Total</td>
                      <td>{totalservicesByEname.length}
                      </td>
                      <td>{totalTotalPaymentSum.toLocaleString()}
                      </td>
                      <td>{totalOfferedPaymentSum.toLocaleString()}
                      </td>
                      <td>{totalcompaniesByEname.length}
                      </td>
                    </tr>
                  </tfoot>
                )}

              </table>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={openProjectionTable}
        onClose={closeProjectionTable}
        fullWidth
        maxWidth="lg"
      >
        <DialogContent>
          <div
            id="table-default"
            style={{
              overflowX: "auto",
              overflowY: "auto",
              maxHeight: "60vh",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid #ddd",
                marginBottom: "10px",
              }}
              className="table-vcenter table-nowrap"
            >
              <thead stSyle={{ backgroundColor: "grey" }}>
                <tr
                  style={{
                    backgroundColor: "#ffb900",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  <th
                    style={{
                      lineHeight: "32px",
                    }}
                  >
                    Sr. No
                  </th>
                  <th>BDE Name</th>
                  <th>Company Name</th>
                  <th>Offered Services</th>
                  <th>Total Offered Price</th>
                  <th>Expected Amount</th>
                  <th>Employee Projection Date</th>
                </tr>
              </thead>
              <tbody>
                {/* Map through uniqueEnames array to render rows */}
                
                    {projectedEmployee && projectedEmployee.map((obj, Index) => (
                      
                      <tr key={`sub-row-${Index}`}>
                        <td style={{ lineHeight: "32px" }}>{Index + 1}</td>
                        {/* Render other employee data */}
                        <td>{obj.ename}</td>
                        <td>{obj.companyName}</td>
                        <td>{obj.offeredServices.join(',')}</td>
                        <td>{obj.totalPayment.toLocaleString()}</td>
                        <td>{obj.offeredPrize.toLocaleString()}</td> 
                        <td>{obj.estPaymentDate}</td> 
                      </tr>
                    ))}
              </tbody>
              {projectedEmployee && (
                <tfoot>
                <tr style={{ fontWeight: 500 }}>
                  <td style={{ lineHeight: '32px' }} colSpan="2">Total</td>
                  <td>{projectedEmployee.length}</td>
                  <td>{offeredServicesPopup.length}
                  </td>
                  <td>{totalPaymentSumPopup.toLocaleString()}
                  </td>
                  <td>{offeredPaymentSumPopup.toLocaleString()}
                  </td>
                  <td>-</td>
                </tr>
              </tfoot>
              )}
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Dashboard;
