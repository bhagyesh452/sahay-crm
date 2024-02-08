import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Header from "./Header";
import { useParams } from "react-router-dom";
import { IconBoxPadding, IconChevronLeft } from "@tabler/icons-react";
import { IconChevronRight } from "@tabler/icons-react";
import { IconButton, Dialog, DialogContent, DialogTitle } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import "../components/styles/main.css";
import "../employeeComp/panel.css";
// import "./styles/table.css";

import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import LoginDetails from "../components/LoginDetails";

const secretKey = process.env.REACT_APP_SECRET_KEY;
function EmployeeParticular() {
  const { id } = useParams();
  const [openAssign, openchangeAssign] = useState(false);
  const [openlocation, openchangelocation] = useState(false);
  const [loginDetails, setLoginDetails] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [dataStatus, setdataStatus] = useState("All");
  const [moreEmpData, setmoreEmpData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 100;
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const [searchText, setSearchText] = useState("");
  const [citySearch, setcitySearch] = useState("");
  const [visibility, setVisibility] = useState("none");
  const [visibilityOther, setVisibilityOther] = useState("block");
  const [visibilityOthernew, setVisibilityOthernew] = useState("none");
  const [subFilterValue, setSubFilterValue] = useState("");
  const [selectedField, setSelectedField] = useState("Company Name");
  const [newempData, setnewEmpData] = useState([]);
  const [openLogin, setOpenLogin] = useState(false);

  const [month, setMonth] = useState(0);
  // const [updateData, setUpdateData] = useState({});

  const [year, setYear] = useState(0);
  function formatDate(inputDate) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(inputDate).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  }
  // Function to fetch employee details by id
  const fetchEmployeeDetails = async () => {
    try {
      const response = await axios.get(`${secretKey}/einfo`);

      // Find the employee by id and set the name
      const selectedEmployee = response.data.find(
        (employee) => employee._id === id
      );

      if (selectedEmployee) {
        setEmployeeName(selectedEmployee.ename);
      } else {
        // Handle the case where no employee is found with the given id
        setEmployeeName("Employee not found");
      }
    } catch (error) {
      console.error("Error fetching employee details:", error.message);
    }
  };

  // Function to fetch new data based on employee name
  const fetchNewData = async () => {
    try {
      const response = await axios.get(
        `${secretKey}/employees/${employeeName}`
      );

      setmoreEmpData(response.data);
      setEmployeeData(
        response.data.filter(
          (obj) =>
            obj.Status === "Busy" ||
            obj.Status === "Not Picked Up" ||
            obj.Status === "Untouched"
        )
      );
    } catch (error) {
      console.error("Error fetching new data:", error);
    }
  };

  useEffect(() => {
    // Fetch employee details and related data when the component mounts or id changes
    fetchEmployeeDetails();
    fetchnewData();
    axios
      .get(`${secretKey}/loginDetails`)
      .then((response) => {
        // Update state with fetched login details
        setLoginDetails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching login details:", error);
      });
  }, []);
  useEffect(() => {
    if (employeeName) {
      console.log("Employee found");
      fetchNewData();
    } else {
      console.log("No employees found");
    }
  }, [employeeName]);

  const filteredData = employeeData.filter((company) => {
    const fieldValue = company[selectedField];

    if (selectedField === "State" && citySearch) {
      // Handle filtering by both State and City
      const stateMatches = fieldValue
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const cityMatches = company.City.toLowerCase().includes(
        citySearch.toLowerCase()
      );
      return stateMatches && cityMatches;
    } else if (selectedField === "Company Incorporation Date  ") {
      // Assuming you have the month value in a variable named `month`
      if (month == 0) {
        return fieldValue.includes(searchText);
      } else if (year == 0) {
        return fieldValue.includes(searchText);
      }
      const selectedDate = new Date(fieldValue);
      const selectedMonth = selectedDate.getMonth() + 1; // Months are 0-indexed
      const selectedYear = selectedDate.getFullYear();

      // Use the provided month variable in the comparison
      return (
        selectedMonth.toString().includes(month) &&
        selectedYear.toString().includes(year)
      );
    } else if (selectedField === "Status" && searchText === "All") {
      // Display all data when Status is "All"
      return true;
    } else {
      // Your existing filtering logic for other fields
      if (typeof fieldValue === "string") {
        return fieldValue.toLowerCase().includes(searchText.toLowerCase());
      } else if (typeof fieldValue === "number") {
        return fieldValue.toString().includes(searchText);
      } else if (fieldValue instanceof Date) {
        // Handle date fields
        return fieldValue.includes(searchText);
      }

      return false;
    }
  });
  const handleFieldChange = (event) => {
    if (event.target.value === "Company Incorporation Date  ") {
      setSelectedField(event.target.value);
      setVisibility("block");
      setVisibilityOther("none");
      setSubFilterValue("");
      setVisibilityOthernew("none");
    } else if (event.target.value === "Status") {
      setSelectedField(event.target.value);
      setVisibility("none");
      setVisibilityOther("none");
      setSubFilterValue("");
      setVisibilityOthernew("block");
    } else {
      setSelectedField(event.target.value);
      setVisibility("none");
      setVisibilityOther("block");
      setSubFilterValue("");
      setVisibilityOthernew("none");
    }

    console.log(selectedField);
  };

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    setCurrentPage(0);

    // Check if the dateValue is not an empty string
    if (dateValue) {
      const dateObj = new Date(dateValue);
      const formattedDate = dateObj.toISOString().split("T")[0];
      setSearchText(formattedDate);
    } else {
      // Handle the case when the date is cleared
      setSearchText("");
    }
  };
  const currentData = filteredData.slice(startIndex, endIndex);

  // useEffect(() => {
  //   // Fetch new data based on employee name when the name changes
  //   if (employeeName !== 'Employee not found') {
  //     fetchNewData();
  //   }
  // }, [employeeName]);

  const [selectedRows, setSelectedRows] = useState([]);
  const handleCheckboxChange = (id) => {
    // If the id is 'all', toggle all checkboxes
    if (id === "all") {
      // If all checkboxes are already selected, clear the selection; otherwise, select all

      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.length === filteredData.length
          ? []
          : filteredData.map((row) => row._id)
      );
    } else {
      // Toggle the selection status of the row with the given id
      setSelectedRows((prevSelectedRows) => {
        if (prevSelectedRows.includes(id)) {
          return prevSelectedRows.filter((rowId) => rowId !== id);
        } else {
          return [...prevSelectedRows, id];
        }
      });
    }
  };
  // const [employeeSelection, setEmployeeSelection] = useState("Select Employee");
  const [newemployeeSelection, setnewEmployeeSelection] =
    useState("Not Alloted");

  const fetchnewData = async () => {
    try {
      const response = await axios.get(`${secretKey}/einfo`);

      // Set the retrieved data in the state

      setnewEmpData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const functionOpenAssign = () => {
    openchangeAssign(true);
  };
  const closepopupAssign = () => {
    openchangeAssign(false);
  };
  const functionopenlocation = () => {
    openchangelocation(true);
  };
  const closepopuplocation = () => {
    openchangelocation(false);
  };
  const [selectedOption, setSelectedOption] = useState("direct");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleUploadData = async (e) => {
    console.log("Uploading data");

    const csvdata = employeeData
      .filter((employee) => selectedRows.includes(employee._id))
      .map((employee) => ({ ...employee, Status: "Untouched" }));

    console.log(newemployeeSelection);
    for (const obj of csvdata) {
      try {
        const response = await axios.post(`${secretKey}/assign-new`, {
          newemployeeSelection,
          csvdata,
        });
        console.log("Data posted successfully");
      } catch (err) {
        console.log("Internal server Error", err);
      }
    }
    Swal.fire({
      title: "Data Send!",
      text: "Data sent successfully!",
      icon: "success",
    });
    fetchEmployeeDetails();
    fetchNewData();
    closepopupAssign();
    //  for (const obj of csvdata) {
    //   if (!obj.ename && obj.ename !== "Not Alloted") {
    // try {
    //   const response = await axios.post(`${secretKey}/company`, {
    //     newemployeeSelection,
    //     csvdata,
    //   });
    //   console.log("Data posted successfully");
    // } catch (err) {
    //   console.log("Internal server Error", err);
    // }
    //   } else {
    //     const userConfirmed = window.confirm(
    //       `Data is already assigned to: ${obj.ename}. Do you want to continue?`
    //     );

    //     if (userConfirmed) {
    //       try {
    //         const response = await axios.post(`${secretKey}/postData`, {
    //           newemployeeSelection,
    //           csvdata,
    //         });
    //         window.location.reload();
    //         console.log("Data posted successfully");
    //       } catch (err) {
    //         console.log("Internal server Error", err);
    //       }
    //     } else {
    //       console.log("User canceled the assignation.");
    //     }
    //   }
    // }

    // setLoading(false); // Move setLoading outside of the loop

    // Swal.fire({
    //   title: "Data Send!",
    //   text: "Data successfully sent to the Employee",
    //   icon: "success",
    // });
  };

  console.log(loginDetails);
  return (
    <div>
      <Header />
      <Navbar />
      <div className="page-wrapper">
        <div
          style={{
            margin: "3px 0px 1px 0px",
          }}
          className="page-header d-print-none"
        >
          <div className="container-xl">
            <div className="row g-2 align-items-center">
              <div className="col d-flex">
                {/* <!-- Page pre-title --> */}
                <Link to={`/admin/employees`}>
                  <IconButton>
                    <IconChevronLeft />
                  </IconButton>
                </Link>

                <h2 className="page-title">{employeeName}</h2>
              </div>

              {/* <!-- Page title actions --> */}
              <div className="col-auto ms-auto d-print-none">
                <div className="btn-list">
                  <a
                    href="#"
                    className="btn btn-primary d-sm-none btn-icon"
                    data-bs-toggle="modal"
                    data-bs-target="#modal-report"
                    aria-label="Create new report"
                  >
                    {/* <!-- Download SVG icon from http://tabler-icons.io/i/plus --> */}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {!openLogin && (
          <div
            onCopy={(e) => {
              e.preventDefault();
            }}
            className="page-body"
            style={{ marginTop: "0px " }}
          >
            <div className="container-xl">
              <div className="row g-2 align-items-center">
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                  className="features"
                >
                  <div style={{ display: "flex" }} className="feature1 mb-2">
                    <div
                      className="form-control"
                      style={{ height: "fit-content", width: "auto" }}
                    >
                      <select
                        style={{
                          border: "none",
                          outline: "none",
                          width: "fit-content",
                        }}
                        value={selectedField}
                        onChange={handleFieldChange}
                      >
                        <option value="Company Name">Company Name</option>
                        <option value="Company Number">Company Number</option>
                        <option value="Company Email">Company Email</option>
                        <option value="Company Incorporation Date  ">
                          Company Incorporation Date
                        </option>
                        <option value="City">City</option>
                        <option value="State">State</option>
                        <option value="Status">Status</option>
                      </select>
                    </div>
                    {visibility === "block" ? (
                      <div>
                        <input
                          onChange={handleDateChange}
                          style={{ display: visibility }}
                          type="date"
                          className="form-control"
                        />
                      </div>
                    ) : (
                      <div></div>
                    )}

                    {visibilityOther === "block" ? (
                      <div
                        style={{
                          width: "20vw",
                          margin: "0px 10px",
                          display: visibilityOther,
                        }}
                        className="input-icon"
                      >
                        <span className="input-icon-addon">
                          {/* <!-- Download SVG icon from http://tabler-icons.io/i/search --> */}
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
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                            <path d="M21 21l-6 -6" />
                          </svg>
                        </span>
                        <input
                          type="text"
                          value={searchText}
                          onChange={(e) => {
                            setSearchText(e.target.value);
                            setCurrentPage(0);
                          }}
                          className="form-control"
                          placeholder="Search…"
                          aria-label="Search in website"
                        />
                      </div>
                    ) : (
                      <div></div>
                    )}
                    {visibilityOthernew === "block" ? (
                      <div
                        style={{
                          width: "20vw",
                          margin: "0px 10px",
                          display: visibilityOthernew,
                        }}
                        className="input-icon"
                      >
                        <select
                          value={searchText}
                          onChange={(e) => {
                            setSearchText(e.target.value);
                          }}
                          className="form-select"
                        >
                          <option value="All">All </option>
                          <option value="Busy">Busy </option>
                          <option value="Not Picked Up">Not Picked Up </option>
                          <option value="Junk">Junk</option>
                          <option value="Interested">Interested</option>
                          <option value="Not Interested">Not Interested</option>
                        </select>
                      </div>
                    ) : (
                      <div></div>
                    )}
                    {searchText !== "" ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: "16px",
                          fontFamily: "sans-serif",
                        }}
                        className="results"
                      >
                        {filteredData.length} results found
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center" }}
                    className="feature2"
                  >
                    {selectedField === "State" && (
                      <div style={{ width: "15vw" }} className="input-icon">
                        <span className="input-icon-addon">
                          {/* <!-- Download SVG icon from http://tabler-icons.io/i/search --> */}
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
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                            <path d="M21 21l-6 -6" />
                          </svg>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          value={citySearch}
                          onChange={(e) => {
                            setcitySearch(e.target.value);
                            setCurrentPage(0);
                          }}
                          placeholder="Search City"
                          aria-label="Search in website"
                        />
                      </div>
                    )}
                    {selectedField === "Company Incorporation Date  " && (
                      <>
                        <div
                          style={{ width: "fit-content" }}
                          className="form-control"
                        >
                          <select
                            style={{ border: "none", outline: "none" }}
                            onChange={(e) => {
                              setMonth(e.target.value);
                              setCurrentPage(0);
                            }}
                          >
                            <option value="" disabled selected>
                              Select Month
                            </option>
                            <option value="12">December</option>
                            <option value="11">November</option>
                            <option value="10">October</option>
                            <option value="9">September</option>
                            <option value="8">August</option>
                            <option value="7">July</option>
                            <option value="6">June</option>
                            <option value="5">May</option>
                            <option value="4">April</option>
                            <option value="3">March</option>
                            <option value="2">February</option>
                            <option value="1">January</option>
                          </select>
                        </div>
                        <div className="input-icon">
                          <input
                            type="number"
                            value={year}
                            defaultValue="Select Year"
                            className="form-control"
                            placeholder="Select Year.."
                            onChange={(e) => {
                              setYear(e.target.value);
                            }}
                            aria-label="Search in website"
                          />
                        </div>
                      </>
                    )}
                    {selectedRows.length !== 0 && (
                      <div className="request">
                        <div className="btn-list">
                          <button
                            onClick={functionOpenAssign}
                            className="btn btn-primary d-none d-sm-inline-block"
                          >
                            Assign Data
                          </button>
                          <a
                            href="#"
                            className="btn btn-primary d-sm-none btn-icon"
                            data-bs-toggle="modal"
                            data-bs-target="#modal-report"
                            aria-label="Create new report"
                          >
                            {/* <!-- Download SVG icon from http://tabler-icons.io/i/plus --> */}
                          </a>
                        </div>
                      </div>
                    )}
                    <Link
                      style={{ color: "black" }}
                      to={`/admin/employees/${id}/login-details`}
                      className="btn btn-primary d-none d-sm-inline-block"
                    >
                        
                          Login Details
                    
                    </Link>
                    
                  </div>
                </div>

                {/* <!-- Page title actions --> */}
              </div>
              <div class="card-header">
                <ul
                  class="nav nav-tabs card-header-tabs nav-fill p-0"
                  data-bs-toggle="tabs"
                >
                  <li class="nav-item data-heading">
                    <a
                      href="#tabs-home-5"
                      onClick={() => {
                        setdataStatus("All");
                        setCurrentPage(0);
                        setEmployeeData(
                          moreEmpData.filter(
                            (obj) =>
                              obj.Status === "Busy" ||
                              obj.Status === "Not Picked Up" ||
                              obj.Status === "Untouched"
                          )
                        );
                      }}
                      className={
                        dataStatus === "All"
                          ? "nav-link active item-act"
                          : "nav-link"
                      }
                      data-bs-toggle="tab"
                    >
                      General{" "}
                      <span className="no_badge">
                        {
                          moreEmpData.filter(
                            (obj) =>
                              obj.Status === "Busy" ||
                              obj.Status === "Not Picked Up" ||
                              obj.Status === "Untouched"
                          ).length
                        }
                      </span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      href="#tabs-activity-5"
                      onClick={() => {
                        setdataStatus("Interested");
                        setCurrentPage(0);
                        setEmployeeData(
                          moreEmpData.filter(
                            (obj) => obj.Status === "Interested"
                          )
                        );
                      }}
                      className={
                        dataStatus === "Interested"
                          ? "nav-link active item-act"
                          : "nav-link"
                      }
                      data-bs-toggle="tab"
                    >
                      Interested{" "}
                      <span className="no_badge">
                        {
                          moreEmpData.filter(
                            (obj) => obj.Status === "Interested"
                          ).length
                        }
                      </span>
                    </a>
                  </li>

                  <li class="nav-item">
                    <a
                      href="#tabs-activity-5"
                      onClick={() => {
                        setdataStatus("FollowUp");
                        setCurrentPage(0);
                        setEmployeeData(
                          moreEmpData.filter((obj) => obj.Status === "FollowUp")
                        );
                      }}
                      className={
                        dataStatus === "FollowUp"
                          ? "nav-link active item-act"
                          : "nav-link"
                      }
                      data-bs-toggle="tab"
                    >
                      Follow Up{" "}
                      <span className="no_badge">
                        {
                          moreEmpData.filter((obj) => obj.Status === "FollowUp")
                            .length
                        }
                      </span>
                    </a>
                  </li>

                  <li class="nav-item">
                    <a
                      href="#tabs-activity-5"
                      onClick={() => {
                        setdataStatus("Matured");
                        setCurrentPage(0);
                        setEmployeeData(
                          moreEmpData.filter((obj) => obj.Status === "Matured")
                        );
                      }}
                      className={
                        dataStatus === "Matured"
                          ? "nav-link active item-act"
                          : "nav-link"
                      }
                      data-bs-toggle="tab"
                    >
                      Matured{" "}
                      <span className="no_badge">
                        {
                          moreEmpData.filter((obj) => obj.Status === "Matured")
                            .length
                        }
                      </span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      href="#tabs-activity-5"
                      onClick={() => {
                        setdataStatus("NotInterested");
                        setCurrentPage(0);
                        setEmployeeData(
                          moreEmpData.filter(
                            (obj) =>
                              obj.Status === "Not Interested" ||
                              obj.Status === "Junk"
                          )
                        );
                      }}
                      className={
                        dataStatus === "NotInterested"
                          ? "nav-link active item-act"
                          : "nav-link"
                      }
                      data-bs-toggle="tab"
                    >
                      Not-Interested{" "}
                      <span className="no_badge">
                        {
                          moreEmpData.filter(
                            (obj) =>
                              obj.Status === "Not Interested" ||
                              obj.Status === "Junk"
                          ).length
                        }
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="card">
                <div className="card-body p-0">
                  <div
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
                      }}
                      className="table-vcenter table-nowrap"
                    >
                      <thead>
                        <tr className="tr-sticky">
                          <th>
                            <input
                              type="checkbox"
                              checked={
                                selectedRows.length === filteredData.length
                              }
                              onChange={() => handleCheckboxChange("all")}
                            />
                          </th>

                          <th className="th-sticky">Sr.No</th>
                          <th className="th-sticky1">Company Name</th>
                          <th>Company Number</th>
                          <th>Status</th>
                          <th>Remarks</th>
                          <th>Company Email</th>
                          <th>Incorporation Date</th>
                          <th>City</th>
                          <th>State</th>

                          {dataStatus === "Matured" && <th>Action</th>}
                        </tr>
                      </thead>
                      {currentData.length === 0 ? (
                        <tbody>
                          <tr>
                            <td colSpan="10" style={{ textAlign: "center" }}>
                              No data available
                            </td>
                          </tr>
                        </tbody>
                      ) : (
                        <tbody>
                          {currentData.map((company, index) => (
                            <tr
                              key={index}
                              style={{ border: "1px solid #ddd" }}
                            >
                              <td
                                style={{
                                  position: "sticky",
                                  left: 0,
                                  zIndex: 1,
                                  background: "white",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedRows.includes(company._id)}
                                  onChange={() =>
                                    handleCheckboxChange(company._id)
                                  }
                                />
                              </td>

                              <td className="td-sticky">
                                {startIndex + index + 1}
                              </td>
                              <td className="td-sticky1">
                                {company["Company Name"]}
                              </td>
                              <td>{company["Company Number"]}</td>
                              <td>
                                <span>{company["Status"]}</span>
                              </td>
                              <td>
                                <div
                                  key={company._id}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <p
                                    className="rematkText text-wrap m-0"
                                    title={company.Remarks}
                                  >
                                    {company.Remarks}
                                  </p>
                                </div>
                              </td>
                              <td>{company["Company Email"]}</td>
                              <td>
                                {formatDate(
                                  company["Company Incorporation Date  "]
                                )}
                              </td>
                              <td>{company["City"]}</td>
                              <td>{company["State"]}</td>

                              {dataStatus === "Matured" && (
                                <td>
                                  <button
                                    style={{
                                      padding: "5px",
                                      fontSize: "12px",
                                      backgroundColor: "lightblue",
                                      // Additional styles for the "View" button
                                    }}
                                    className="btn btn-primary d-none d-sm-inline-block"
                                  >
                                    View
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      )}
                    </table>
                  </div>
                  {currentData.length !== 0 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                      className="pagination"
                    >
                      <IconButton
                        onClick={() =>
                          setCurrentPage((prevPage) =>
                            Math.max(prevPage - 1, 0)
                          )
                        }
                        disabled={currentPage === 0}
                      >
                        <IconChevronLeft />
                      </IconButton>
                      <span>
                        Page {currentPage + 1} of{" "}
                        {Math.ceil(filteredData.length / itemsPerPage)}
                      </span>

                      <IconButton
                        onClick={() =>
                          setCurrentPage((prevPage) =>
                            Math.min(
                              prevPage + 1,
                              Math.ceil(filteredData.length / itemsPerPage) - 1
                            )
                          )
                        }
                        disabled={
                          currentPage ===
                          Math.ceil(filteredData.length / itemsPerPage) - 1
                        }
                      >
                        <IconChevronRight />
                      </IconButton>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Login Details */}
        {openLogin && (
          <>
            <LoginDetails loginDetails={loginDetails} />
          </>
        )}
      </div>
      {/* ------------------------------- Assign data -------------------------- */}
      <Dialog
        open={openAssign}
        onClose={closepopupAssign}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Import CSV DATA{" "}
          <IconButton onClick={closepopupAssign} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          <div className="maincon">
            <div className="con2 d-flex">
              <div
                style={
                  selectedOption === "direct"
                    ? {
                        backgroundColor: "#e9eae9",
                        margin: "10px 10px 0px 0px",
                        cursor: "pointer",
                      }
                    : {
                        backgroundColor: "white",
                        margin: "10px 10px 0px 0px",
                        cursor: "pointer",
                      }
                }
                onClick={() => {
                  setSelectedOption("direct");
                }}
                className="direct form-control"
              >
                <input
                  type="radio"
                  id="direct"
                  value="direct"
                  style={{
                    display: "none",
                  }}
                  checked={selectedOption === "direct"}
                  onChange={handleOptionChange}
                />
                <label htmlFor="direct">Move In General Data</label>
              </div>
              <div
                style={
                  selectedOption === "someoneElse"
                    ? {
                        backgroundColor: "#e9eae9",
                        margin: "10px 0px 0px 0px",
                        cursor: "pointer",
                      }
                    : {
                        backgroundColor: "white",
                        margin: "10px 0px 0px 0px",
                        cursor: "pointer",
                      }
                }
                className="indirect form-control"
                onClick={() => {
                  setSelectedOption("someoneElse");
                }}
              >
                <input
                  type="radio"
                  id="someoneElse"
                  value="someoneElse"
                  style={{
                    display: "none",
                  }}
                  checked={selectedOption === "someoneElse"}
                  onChange={handleOptionChange}
                />
                <label htmlFor="someoneElse">Assign to Employee</label>
              </div>
            </div>
          </div>
          {/* <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <button onClick={handleButtonClick}>Choose File</button> */}

          {selectedOption === "someoneElse" && (
            <div>
              {newempData.length !== 0 ? (
                <>
                  <div className="dialogAssign">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        margin: " 10px 0px 0px 0px",
                      }}
                      className="selector"
                    >
                      <label>Select an Employee</label>
                      <div className="form-control">
                        <select
                          style={{
                            width: "inherit",
                            border: "none",
                            outline: "none",
                          }}
                          value={newemployeeSelection}
                          onChange={(e) => {
                            setnewEmployeeSelection(e.target.value);
                          }}
                        >
                          <option value="Not Alloted" disabled>
                            Select employee
                          </option>
                          {newempData.map((item) => (
                            <option value={item.ename}>{item.ename}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <h1>No Employees Found</h1>
                </div>
              )}
            </div>
          )}
        </DialogContent>
        <button onClick={handleUploadData} className="btn btn-primary">
          Submit
        </button>
      </Dialog>

      {/* Dialog for location details */}
      <Dialog
        open={openlocation}
        onClose={closepopuplocation}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Location Details{" "}
          <IconButton onClick={closepopuplocation} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {loginDetails.map((details, index) => (
                <tr key={index}>
                  <td>{details.ename}</td>
                  <td>{details.date}</td>
                  <td>{details.time}</td>
                  <td>{details.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EmployeeParticular;
