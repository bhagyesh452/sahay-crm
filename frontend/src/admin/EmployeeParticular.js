import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Header from "./Header";
import { useParams } from "react-router-dom";
import { IconBoxPadding, IconChevronLeft, IconEye } from "@tabler/icons-react";
import { IconChevronRight } from "@tabler/icons-react";
import { IconButton, Dialog, DialogContent, DialogTitle } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import "../../src/assets/styles.css";
// import "./styles/table.css";
import { Drawer } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import Swal from "sweetalert2";
import LoginDetails from "../components/LoginDetails";
import Nodata from "../components/Nodata";
import EditForm from "../components/EditForm";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const secretKey = process.env.REACT_APP_SECRET_KEY;
const frontendKey = process.env.REACT_APP_FRONTEND_KEY;
function EmployeeParticular() {
  const { id } = useParams();
  const [openAssign, openchangeAssign] = useState(false);
  const [openAnchor, setOpenAnchor] = useState(false);
  const [openRemarks, openchangeRemarks] = useState(false);
  const [openlocation, openchangelocation] = useState(false);
  const [loginDetails, setLoginDetails] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [sortOrder, setSortOrder] = useState('asc');
  const [dataStatus, setdataStatus] = useState("All");
  const [moreEmpData, setmoreEmpData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 500;
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
  const [openCSV, openchangeCSV] = useState(false);
  const [maturedCompanyName, setMaturedCompanyName] = useState("");
  const [companies, setCompanies] = useState([]);
  const [month, setMonth] = useState(0);
  // const [updateData, setUpdateData] = useState({});
  const [eData, seteData] = useState([]);
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

      // Filter the response data to find _id values where designation is "Sales Executive"
      const salesExecutivesIds = response.data
        .filter((employee) => employee.designation === "Sales Executive")
        .map((employee) => employee._id);

      // Set eData to the array of _id values
      seteData(salesExecutivesIds);

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

  const functionopenAnchor = () => {
    setOpenAnchor(true);
  };
  const closeAnchor = () => {
    setOpenAnchor(false);
  };
  useEffect(() => {
    if (employeeName) {
      const fetchCompanies = async () => {
        try {
          const response = await fetch(`${secretKey}/companies`);
          const data = await response.json();

          // Filter and format the data based on employeeName
          const formattedData = data.companies
            .filter(
              (entry) =>
                entry.bdeName === employeeName || entry.bdmName === employeeName
            )
            .map((entry) => ({
              "Company Name": entry.companyName,
              "Company Number": entry.contactNumber,
              "Company Email": entry.companyEmail,
              "Company Incorporation Date": entry.incoDate,
              City: "NA",
              State: "NA",
              ename: employeeName,
              AssignDate: entry.bookingDate,
              Status: "Matured",
              Remarks: "No Remarks Added",
            }));

          setCompanies(formattedData);
        } catch (error) {
          console.error("Error fetching companies:", error);
          setCompanies([]);
        }
      };

      fetchCompanies();
    }
  }, [employeeName]);

  // Function to fetch new data based on employee name
  const fetchNewData = async () => {
    try {
      const response = await axios.get(
        `${secretKey}/employees/${employeeName}`
      );

      // Sort the data by AssignDate property
      const sortedData = response.data.sort((a, b) => {
        // Assuming AssignDate is a string representation of a date
        return new Date(b.AssignDate) - new Date(a.AssignDate);
      });

      setmoreEmpData(sortedData);
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
    fetchRemarksHistory();
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
  const handleCheckboxChange = (id, event) => {
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
        // If the Ctrl key is pressed
        if (event.ctrlKey) {
          console.log("pressed");
          const selectedIndex = filteredData.findIndex((row) => row._id === id);
          const lastSelectedIndex = filteredData.findIndex((row) =>
            prevSelectedRows.includes(row._id)
          );

          // Select rows between the last selected row and the current row
          if (lastSelectedIndex !== -1 && selectedIndex !== -1) {
            const start = Math.min(selectedIndex, lastSelectedIndex);
            const end = Math.max(selectedIndex, lastSelectedIndex);
            const idsToSelect = filteredData
              .slice(start, end + 1)
              .map((row) => row._id);

            return prevSelectedRows.includes(id)
              ? prevSelectedRows.filter((rowId) => !idsToSelect.includes(rowId))
              : [...prevSelectedRows, ...idsToSelect];
          }
        }

        // Toggle the selection status of the row with the given id
        return prevSelectedRows.includes(id)
          ? prevSelectedRows.filter((rowId) => rowId !== id)
          : [...prevSelectedRows, id];
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
  const [startRowIndex, setStartRowIndex] = useState(null);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleUploadData = async (e) => {
    console.log("Uploading data");

    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    const csvdata = employeeData
      .filter((employee) => selectedRows.includes(employee._id))
      .map((employee) => ({ ...employee, Status: "Untouched" }));

    // Create an array to store promises for updating CompanyModel
    const updatePromises = [];

    for (const data of csvdata) {
      const updatedObj = {
        ...data,
        date: currentDate,
        time: currentTime,
        ename: newemployeeSelection,
        companyName: data["Company Name"],
      };

      // Add the promise for updating CompanyModel to the array
      updatePromises.push(
        axios.post(`${secretKey}/assign-new`, {
          newemployeeSelection,
          data: updatedObj,
        })
      );
    }

    try {
      // Wait for all update promises to resolve
      await Promise.all(updatePromises);
      console.log("Employee data updated!");

      // Clear the selection
      setnewEmployeeSelection("Not Alloted");

      Swal.fire({
        title: "Data Sent!",
        text: "Data sent successfully!",
        icon: "success",
      });

      // Fetch updated employee details and new data
      fetchEmployeeDetails();
      fetchNewData();
      closepopupAssign();
    } catch (error) {
      console.error("Error updating employee data:", error);

      Swal.fire({
        title: "Error!",
        text: "Failed to update employee data. Please try again later.",
        icon: "error",
      });
    }
  };

  console.log(loginDetails);

  const handleMouseDown = (id) => {
    // Initiate drag selection
    setStartRowIndex(filteredData.findIndex((row) => row._id === id));
  };

  const handleMouseEnter = (id) => {
    // Update selected rows during drag selection
    if (startRowIndex !== null) {
      const endRowIndex = filteredData.findIndex((row) => row._id === id);
      const selectedRange = [];
      const startIndex = Math.min(startRowIndex, endRowIndex);
      const endIndex = Math.max(startRowIndex, endRowIndex);

      for (let i = startIndex; i <= endIndex; i++) {
        selectedRange.push(filteredData[i]._id);
      }

      setSelectedRows(selectedRange);

      // Scroll the window vertically when dragging beyond the visible viewport
      const windowHeight = document.documentElement.clientHeight;
      const mouseY = window.event.clientY;
      const tableHeight = document.querySelector("table").clientHeight;
      const maxVisibleRows = Math.floor(
        windowHeight / (tableHeight / filteredData.length)
      );

      if (mouseY >= windowHeight - 20 && endIndex >= maxVisibleRows) {
        window.scrollTo(0, window.scrollY + 20);
      }
    }
  };

  const handleMouseUp = () => {
    // End drag selection
    setStartRowIndex(null);
  };
  const [cid, setcid] = useState("");
  const [cstat, setCstat] = useState("");
  const [remarksHistory, setRemarksHistory] = useState([]);
  const [filteredRemarks, setFilteredRemarks] = useState([]);
  const fetchRemarksHistory = async () => {
    try {
      const response = await axios.get(`${secretKey}/remarks-history`);
      setRemarksHistory(response.data);
      setFilteredRemarks(response.data.filter((obj) => obj.companyID === cid));

      console.log(response.data);
    } catch (error) {
      console.error("Error fetching remarks history:", error);
    }
  };
  const functionopenpopupremarks = (companyID, companyStatus) => {
    openchangeRemarks(true);
    setFilteredRemarks(
      remarksHistory.filter((obj) => obj.companyID === companyID)
    );
    // console.log(remarksHistory.filter((obj) => obj.companyID === companyID))

    setcid(companyID);
    setCstat(companyStatus);
  };
  const closepopupRemarks = () => {
    openchangeRemarks(false);
    setFilteredRemarks([]);
  };

  const handleChangeUrl = () => {
    const currId = id;
    console.log(eData); // This is how the array looks like ['65bcb5ac2e8f74845bdc6211', '65bde8cf23df48d5fe3227ca']

    // Find the index of the currentId in the eData array
    const currentIndex = eData.findIndex((itemId) => itemId === currId);

    if (currentIndex !== -1) {
      // Calculate the next index in a circular manner
      const nextIndex = (currentIndex + 1) % eData.length;

      // Get the nextId from the eData array
      const nextId = eData[nextIndex];
      window.location.replace(`/admin/employees/${nextId}`);
    } else {
      console.log("Current ID not found in eData array.");
    }
  };
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
              <div className="col d-flex justify-content-between">
                {/* <!-- Page pre-title --> */}
                <div className="d-flex">
                  <Link to={`/admin/employees`}>
                    <IconButton>
                      <IconChevronLeft />
                    </IconButton>
                  </Link>

                  <h2 className="page-title">{employeeName}</h2>
                </div>
                <div className="d-flex">
                  {selectedRows.length !== 0 && (
                    <div className="request">
                      <div className="btn-list">
                        <button
                          onClick={functionOpenAssign}
                          className="btn btn-primary d-none d-sm-inline-block 2"
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
                  <div className="form-control mr-2 sort-by">
                    <label htmlFor="sort-by">Sort By:</label>
                    <select
                      style={{
                        border: "none",
                        outline: "none",
                        color: "#666a66",
                      }}
                      name="sort-by"
                      id="sort-by"
                      onChange={(e) => {
                        const selectedOption = e.target.value;

                        switch (selectedOption) {
                          case "Busy":
                          case "Untouched":
                          case "Not Picked Up":
                            setdataStatus("All");
                            setEmployeeData(
                              moreEmpData
                                .filter((data) =>
                                  [
                                    "Busy",
                                    "Untouched",
                                    "Not Picked Up",
                                  ].includes(data.Status)
                                )
                                .sort((a, b) => {
                                  if (a.Status === selectedOption) return -1;
                                  if (b.Status === selectedOption) return 1;
                                  return 0;
                                })
                            );
                            break;
                          case "Interested":
                            setdataStatus("Interested");
                            setEmployeeData(
                              moreEmpData
                                .filter((data) => data.Status === "Interested")
                                .sort((a, b) =>
                                  a.AssignDate.localeCompare(b.AssignDate)
                                )
                            );
                            break;
                          case "Not Interested":
                            setdataStatus("NotInterested");
                            setEmployeeData(
                              moreEmpData
                                .filter((data) =>
                                  ["Not Interested", "Junk"].includes(
                                    data.Status
                                  )
                                )
                                .sort((a, b) =>
                                  a.AssignDate.localeCompare(b.AssignDate)
                                )
                            );
                            break;
                          case "FollowUp":
                            setdataStatus("FollowUp");
                            setEmployeeData(
                              moreEmpData
                                .filter((data) => data.Status === "FollowUp")
                                .sort((a, b) =>
                                  a.AssignDate.localeCompare(b.AssignDate)
                                )
                            );
                            break;
                          case "AssignDate":
                            setdataStatus("AssignDate");
                            setEmployeeData(
                              moreEmpData.sort((a, b) =>
                                b.AssignDate.localeCompare(a.AssignDate)
                              )
                            );
                            break;
                          case "Company Incorporation Date  ":
                            setdataStatus("CompanyIncorporationDate");
                            setEmployeeData(
                              moreEmpData.sort((a, b) =>
                                b["Company Incorporation Date  "].localeCompare(
                                  a["Company Incorporation Date  "]
                                )
                              )
                            );
                            break;
                          default:
                            // No filtering if default option selected
                            setdataStatus("All");
                            setEmployeeData(
                              moreEmpData.sort((a, b) => {
                                if (a.Status === selectedOption) return -1;
                                if (b.Status === selectedOption) return 1;
                                return 0;
                              })
                            );
                            break;
                        }
                      }}
                    >
                      <option value="" disabled selected>
                        Select Status
                      </option>
                      <option value="Untouched">Untouched</option>
                      <option value="Busy">Busy</option>
                      <option value="Not Picked Up">Not Picked Up</option>
                      <option value="FollowUp">Follow Up</option>
                      <option value="Interested">Interested</option>
                      <option value="Not Interested">Not Interested</option>
                      <option value="AssignDate">Assigned Date</option>
                      <option value="Company Incorporation Date  ">
                        C.Inco. Date
                      </option>
                    </select>
                  </div>
                  <Link
                    to={`/admin/employees/${id}/login-details`}
                    style={{ marginLeft: "10px" }}
                  >
                    <button className="btn btn-primary d-none d-sm-inline-block">
                      Login Details
                    </button>
                  </Link>
                  <div className="nextBtn">
                    <IconButton onClick={handleChangeUrl}>
                      <ArrowForwardIosIcon />
                    </IconButton>
                  </div>
                </div>
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
                <div className="col-2">
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
                </div>

                {visibility === "block" && (
                  <div className="col-2">
                    <input
                      onChange={handleDateChange}
                      style={{ display: visibility }}
                      type="date"
                      className="form-control"
                    />
                  </div>
                )}
                <div className="col-2">
                  {visibilityOther === "block" && (
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
                  )}
                  {visibilityOthernew === "block" && (
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
                          // Set dataStatus based on selected option
                          if (
                            e.target.value === "All" ||
                            e.target.value === "Busy" ||
                            e.target.value === "Not Picked Up"
                          ) {
                            setdataStatus("All");
                          } else if (
                            e.target.value === "Junk" ||
                            e.target.value === "Not Interested"
                          ) {
                            setdataStatus("NotInterested");
                          } else if (e.target.value === "Interested") {
                            setdataStatus("Interested");
                          } else if (e.target.value === "Untouched") {
                            setEmployeeData(
                              moreEmpData.filter(
                                (obj) => obj.Status === "Untouched"
                              )
                            );
                          }
                        }}
                        className="form-select"
                      >
                        <option value="All">All</option>
                        <option value="Busy">Busy</option>
                        <option value="Not Picked Up">Not Picked Up</option>
                        <option value="Junk">Junk</option>
                        <option value="Interested">Interested</option>
                        <option value="Not Interested">Not Interested</option>
                        <option value="Untouched">Untouched</option>
                      </select>
                    </div>
                  )}
                </div>
                <div className="col-2">
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
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                  className="features"
                >
                  <div style={{ display: "flex" }} className="feature1 mb-2">
                    {selectedRows.length !== 0 && (
                      <div className="form-control">
                        {selectedRows.length} Data Selected
                      </div>
                    )}
                    {searchText !== "" && (
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
                    )}
                  </div>
                </div>

                {/* <!-- Page title actions --> */}
              </div>
              <div class="card-header my-tab">
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
                      <span>Interested </span>
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
                      <span>Follow Up </span>

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
                      <span>Matured </span>
                      <span className="no_badge">{companies.length}</span>
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
                      <span>Not Interested </span>
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
                          {dataStatus !== "Matured" && (
                            <th>
                              <input
                                type="checkbox"
                                checked={
                                  selectedRows.length === filteredData.length
                                }
                                onChange={() => handleCheckboxChange("all")}
                              />
                            </th>
                          )}

                          <th className="th-sticky">Sr.No</th>
                          <th className="th-sticky1">Company Name</th>
                          <th>Company Number</th>
                          <th>Status</th>
                          <th>Remarks</th>
                      
                          <th>Incorporation Date</th>
                          <th>City</th>
                          <th>State</th>
                          <th>Company Email</th>
                          <th>
  Assigned On
  <SwapVertIcon
    style={{
      height: "15px",
      width: "15px",
      cursor: "pointer",
    }}
    onClick={() => {
      const sortedData = [...employeeData].sort((a, b) => {
        if (sortOrder === 'asc') {
          return b.AssignDate.localeCompare(a.AssignDate);
        } else {
          return a.AssignDate.localeCompare(b.AssignDate);
        }
      });
      setEmployeeData(sortedData);
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    }}
  />
</th>
                          {dataStatus === "Matured" && <th>Action</th>}
                        </tr>
                      </thead>
                      {currentData.length !== 0 && dataStatus !== "Matured" && (
                        <tbody>
                          {currentData.map((company, index) => (
                            <tr
                              key={index}
                              className={
                                selectedRows.includes(company._id)
                                  ? "selected"
                                  : ""
                              }
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
                                  onChange={(e) =>
                                    handleCheckboxChange(company._id, e)
                                  } // Pass the event object
                                  onMouseDown={() =>
                                    handleMouseDown(company._id)
                                  }
                                  onMouseEnter={() =>
                                    handleMouseEnter(company._id)
                                  }
                                  onMouseUp={handleMouseUp}
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
                                  <span>
                                    <IconEye
                                      onClick={() => {
                                        functionopenpopupremarks(
                                          company._id,
                                          company.Status
                                        );
                                      }}
                                      style={{
                                        width: "18px",
                                        height: "18px",
                                        color: "#d6a10c",
                                        cursor: "pointer",
                                      }}
                                    />
                                  </span>
                                </div>
                              </td>
                             
                              <td>
                                {formatDate(
                                  company["Company Incorporation Date  "]
                                )}
                              </td>
                              <td>{company["City"]}</td>
                              <td>{company["State"]}</td>
                              <td>{company["Company Email"]}</td>
                              <td>{formatDate(company["AssignDate"])}</td>

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
                                    onClick={() => {
                                      functionopenAnchor();
                                      setMaturedCompanyName(
                                        company["Company Name"]
                                      );
                                    }}
                                  >
                                    View
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      )}

                      {dataStatus === "Matured" && companies.length !== 0 && (
                        <tbody>
                          {companies.map((company, index) => (
                            <tr
                              key={index}
                              className={
                                selectedRows.includes(company._id)
                                  ? "selected"
                                  : ""
                              }
                              style={{ border: "1px solid #ddd" }}
                            >
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
                                  <span>
                                    <IconEye
                                      onClick={() => {
                                        functionopenpopupremarks(
                                          company._id,
                                          company.Status
                                        );
                                      }}
                                      style={{
                                        width: "18px",
                                        height: "18px",
                                        color: "#d6a10c",
                                        cursor: "pointer",
                                      }}
                                    />
                                  </span>
                                </div>
                              </td>
                              <td>{company["Company Email"]}</td>
                              <td>
                                {formatDate(
                                  company["Company Incorporation Date"]
                                )}
                              </td>
                              <td>{company["City"]}</td>
                              <td>{company["State"]}</td>
                              <td>{formatDate(company["AssignDate"])}</td>

                              <td>
                                <button
                                  style={{
                                    padding: "5px",
                                    fontSize: "12px",
                                    backgroundColor: "lightblue",
                                    // Additional styles for the "View" button
                                  }}
                                  className="btn btn-primary d-none d-sm-inline-block"
                                  onClick={() => {
                                    functionopenAnchor();
                                    setMaturedCompanyName(
                                      company["Company Name"]
                                    );
                                  }}
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      )}
                      {currentData.length === 0 && dataStatus !== "Matured" && (
                        <tbody>
                          <tr>
                            <td colSpan="11" className="p-2">
                              <Nodata />
                            </td>
                          </tr>
                        </tbody>
                      )}
                      {companies.length === 0 && dataStatus === "Matured" && (
                        <tbody>
                          <tr>
                            <td colSpan="11" className="p-2">
                              <Nodata />
                            </td>
                          </tr>
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

      {/* Remarks History Pop up */}
      <Dialog
        open={openRemarks}
        onClose={closepopupRemarks}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Remarks
          <IconButton onClick={closepopupRemarks} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          <div className="remarks-content">
            {filteredRemarks.length !== 0 ? (
              filteredRemarks
                .slice()
                .reverse()
                .map((historyItem) => (
                  <div className="col-sm-12" key={historyItem._id}>
                    <div className="card RemarkCard position-relative">
                      <div className="d-flex justify-content-between">
                        <div className="reamrk-card-innerText">
                          <pre>{historyItem.remarks}</pre>
                        </div>
                      </div>

                      <div className="d-flex card-dateTime justify-content-between">
                        <div className="date">{historyItem.date}</div>
                        <div className="time">{historyItem.time}</div>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center overflow-hidden">
                No Remarks History
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* View Bookings Page */}
      <Drawer anchor="right" open={openAnchor} onClose={closeAnchor}>
        <div className="container-xl">
          <div className="header d-flex justify-content-between">
            <h1 className="title">LeadForm</h1>
          </div>
          <EditForm companysName={maturedCompanyName} />
        </div>
      </Drawer>
    </div>
  );
}

export default EmployeeParticular;
