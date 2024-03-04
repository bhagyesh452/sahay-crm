import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Header from "./Header";
import axios from "axios";
import Nodata from "../components/Nodata";
import "../assets/styles.css";
import { IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ViewListIcon from "@mui/icons-material/ViewList";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IconEye } from "@tabler/icons-react";

import AnnouncementIcon from "@mui/icons-material/Announcement";
// import LoginAdmin from "./LoginAdmin";

function Dashboard() {
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [bookingObject, setBookingObject] = useState([]);
  const [openTable, setOpenTable] = useState(false);
  const [openEmployeeTable, setOpenEmployeeTable] = useState(false);
  const [filteredBooking, setFilteredBooking] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [expand, setExpand] = useState(null);
  const [companyData, setCompanyData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [dateRange, setDateRange] = useState("by-today");
  const [showUpdates, setShowUpdates] = useState(false);
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const convertedDate = date.toLocaleDateString();
    return convertedDate;
  };

  // https://startupsahay.in/api
  const fetchCompanyData = async () => {
    fetch(`https://startupsahay.in/api/leads`)
      .then((response) => response.json())
      .then((data) => {
        setCompanyData(data.filter((obj) => obj.ename !== "Not Alloted"));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const fetchEmployeeInfo = async () => {
    fetch(`https://startupsahay.in/api/einfo`)
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
    setExpand(index);
  };
  // Now finalFilteredData contains an array of objects with unique bdeNames

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
    setExpand(null);
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
                                        }, 0) // Initialize totalPayments as 0
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
                                        }, 0) // Initialize totalPayments as 0
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
                                        }, 0) // Initialize totalPayments as 0
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
                                {filteredBooking.reduce((totalPayment, obj) => {
                                  // Add the totalPayment of the current object to the totalPayment accumulator
                                  const finalPayment =
                                    obj.bdeName === obj.bdmName
                                      ? obj.totalPayment
                                      : obj.totalPayment / 2;
                                  return totalPayment + finalPayment;
                                }, 0)}
                              </td>

                              <td>
                                {filteredBooking.reduce(
                                  (totalFirstPayment, obj) => {
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
                                  },
                                  0
                                )}
                              </td>
                              <td>
                                {filteredBooking.reduce(
                                  (totalFirstPayment, obj) => {
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
                                  },
                                  0
                                )}
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
                        <thead
                          style={{
                            position: "sticky", // Make the header sticky
                            top: '-1px', // Stick it at the top
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
                                    {index}
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
                <tr>
                  <th>SR.NO</th>
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
                {filteredBooking
                  .filter((data) => data.bdeName === tableEmployee)
                  .map((mainObj, index) => (
                    <>
                      <tr>
                        <td>{index + 1}</td>
                        <td>{`${formatDate(mainObj.bookingDate)}(${
                          mainObj.bookingTime
                        })`}</td>
                        <td>{mainObj.bdeName}</td>
                        <td>{mainObj.companyName}</td>
                        <td>{mainObj.contactNumber}</td>
                        <td>{mainObj.companyEmail}</td>
                        <td>{mainObj.services[0]}</td>
                        <td>
                          {mainObj.bdeName !== mainObj.bdmName
                            ? mainObj.totalPayment / 2
                            : mainObj.totalPayment}
                        </td>
                        <td>
                          {
                            mainObj.firstPayment !== 0
                              ? mainObj.bdeName === mainObj.bdmName
                                ? mainObj.firstPayment // If bdeName and bdmName are the same
                                : mainObj.firstPayment / 2 // If bdeName and bdmName are different
                              : mainObj.bdeName === mainObj.bdmName
                              ? mainObj.totalPayment // If firstPayment is 0 and bdeName and bdmName are the same
                              : mainObj.totalPayment / 2 // If firstPayment is 0 and bdeName and bdmName are different
                          }
                        </td>
                        <td>
                          {" "}
                          {mainObj.firstPayment !== 0
                            ? mainObj.bdeName === mainObj.bdmName
                              ? mainObj.totalPayment - mainObj.firstPayment
                              : (mainObj.totalPayment - mainObj.firstPayment) /
                                2
                            : 0}{" "}
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
                                onClick={() =>
                                  setExpand(expand === index ? null : index)
                                }
                                style={{ cursor: "pointer" }}
                              />
                            )}
                        </td>
                        <td>{mainObj.paymentRemarks}</td>
                      </tr>
                      {expand === index && (
                        <>
                          <tr>
                            <td>{`${index + 1}(${1})`}</td>
                            <td>{`${formatDate(mainObj.bookingDate)}(${
                              mainObj.bookingTime
                            })`}</td>
                            <td>{mainObj.bdmName}</td>
                            <td>{mainObj.companyName}</td>
                            <td>{mainObj.contactNumber}</td>
                            <td>{mainObj.companyEmail}</td>
                            <td>{mainObj.services[0]}</td>
                            <td> {mainObj.totalPayment / 2} </td>
                            <td>
                              {mainObj.firstPayment !== 0
                                ? mainObj.firstPayment / 2
                                : mainObj.totalPayment / 2}{" "}
                            </td>
                            <td>
                              {mainObj.firstPayment !== 0
                                ? mainObj.bdeName === mainObj.bdmName
                                  ? mainObj.totalPayment - mainObj.firstPayment
                                  : (mainObj.totalPayment -
                                      mainObj.firstPayment) /
                                    2
                                : 0}{" "}
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
    </div>
  );
}

export default Dashboard;
