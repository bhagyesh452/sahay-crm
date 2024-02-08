import React, { useEffect, useState } from "react";
import EmpNav from "./EmpNav.js";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import axios from "axios";
import { IconChevronLeft } from "@tabler/icons-react";
import { IconChevronRight } from "@tabler/icons-react";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import Swal from "sweetalert2";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import Form from "../components/Form.jsx";
import "../assets/table.css";
import "../assets/styles.css";
import Nodata from "../components/Nodata.jsx";


function EmployeePanel() {
  const [moreFilteredData, setmoreFilteredData] = useState([]);
  const [dataStatus, setdataStatus] = useState("All");
  const [open, openchange] = useState(false);
  const [openRemarks, openchangeRemarks] = useState(false);
  const [data, setData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [citySearch, setcitySearch] = useState("");
  const [visibility, setVisibility] = useState("none");
  const [visibilityOther, setVisibilityOther] = useState("block");
  const [visibilityOthernew, setVisibilityOthernew] = useState("none");
  const [subFilterValue, setSubFilterValue] = useState("");
  const [selectedField, setSelectedField] = useState("Company Name");
  const [cname, setCname] = useState("");
  const [cemail, setCemail] = useState("");
  const [cnumber, setCnumber] = useState(0);
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [cidate, setCidate] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [month, setMonth] = useState(0);
  const [updateData, setUpdateData] = useState({});
  const itemsPerPage = 100;
  const [year, setYear] = useState(0);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const { userId } = useParams();
  console.log(userId);

  const functionopenpopup = () => {
    openchange(true);
  };
  const [cid, setcid] = useState("");
  const [cstat, setCstat] = useState("");
  const functionopenpopupremarks = (companyID, companyStatus) => {
    openchangeRemarks(true);
    setFilteredRemarks(
      remarksHistory.filter((obj) => obj.companyID === companyID)
    );
    // console.log(remarksHistory.filter((obj) => obj.companyID === companyID))

    setcid(companyID);
    setCstat(companyStatus);
  };

  const [openNew, openchangeNew] = useState(false);
  const functionopenpopupNew = () => {
    openchangeNew(true);
  };

  const closepopup = () => {
    openchange(false);
  };
  const closepopupNew = () => {
    openchangeNew(false);
  };
  const closepopupRemarks = () => {
    openchangeRemarks(false);
    setFilteredRemarks([]);
  };
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const fetchData = async () => {
    try {
      const response = await axios.get(`${secretKey}/einfo`);

      // Set the retrieved data in the state
      const tempData = response.data;
      const userData = tempData.find((item) => item._id === userId);

      setData(userData);
      setmoreFilteredData(userData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  const [moreEmpData, setmoreEmpData] = useState([]);

  const fetchNewData = async (status) => {
    try {
      const response = await axios.get(`${secretKey}/employees/${data.ename}`);
      const tempData = response.data;
      setmoreEmpData(response.data);
      setEmployeeData(
        tempData.filter(
          (obj) =>
            obj.Status === "Busy" ||
            obj.Status === "Not Picked Up" ||
            obj.Status === "Untouched"
        )
      );
      setdataStatus("All");

      if (status === "Not Interested" || status === "Junk") {
        setEmployeeData(
          tempData.filter(
            (obj) => obj.Status === "Not Interested" || obj.Status === "Junk"
          )
        );
        setdataStatus("NotInterested");
      }
      if (status === "FollowUp") {
        setEmployeeData(tempData.filter((obj) => obj.Status === "FollowUp"));
        setdataStatus("FollowUp");
      }
      if (status === "Interested") {
        setEmployeeData(tempData.filter((obj) => obj.Status === "Interested"));
        setdataStatus("Interested");
      }
      // setEmployeeData(tempData.filter(obj => obj.Status === "Busy" || obj.Status === "Not Picked Up" || obj.Status === "Untouched"))
    } catch (error) {
      console.error("Error fetching new data:", error);
    }
  };

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

  useEffect(() => {
    if (data.ename) {
      console.log("Employee found");
      fetchNewData();
    } else {
      console.log("No employees found");
    }
  }, [data.ename]);

  useEffect(() => {
    fetchData();
  }, [userId]);
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
  // const [locationAccess, setLocationAccess] = useState(false);
  useEffect(() => {
    fetchRemarksHistory();
    // let watchId;
    // const successCallback = (position) => {
    //   const userLatitude = position.coords.latitude;
    //   const userLongitude = position.coords.longitude;

    //   // console.log("User Location:", userLatitude, userLongitude);
    //   if (
    //     Number(userLatitude.toFixed(3)) === 23.114 &&
    //     Number(userLongitude.toFixed(3)) === 72.541
    //   ) {
    //     setLocationAccess(true);
    //     // console.log("Location accessed")
    //   }
    //   // Now you can send these coordinates to your server for further processing
    // };
    // // console.log(localStorage.getItem("newtoken"), locationAccess);
    if (userId !== localStorage.getItem("userId")) {
      localStorage.removeItem("newtoken");
      window.location.replace("/");
    }
    // const errorCallback = (error) => {
    //   console.error("Geolocation error:", error.message);
    //   setLocationAccess(false);
    //   // Handle the error, e.g., show a message to the user
    // };

    // navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

    // // If you want to watch for continuous updates, you can use navigator.geolocation.watchPosition

    // // Cleanup function to clear the watch if the component unmounts
    // return () => {
    //   navigator.geolocation.clearWatch(watchId);
    // };
  }, []);
  // console.log(locationAccess);

  // console.log(employeeData);

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

  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyInco, setCompanyInco] = useState(null);
  const [companyNumber, setCompanyNumber] = useState(0);
  const [companyId, setCompanyId] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  console.log(companyName, companyInco);

  const currentData = filteredData.slice(startIndex, endIndex);

  const handleStatusChange = async (
    employeeId,
    newStatus,
    cname,
    cemail,
    cindate,
    cnum
  ) => {
    if (newStatus === "Matured") {
      setCompanyName(cname);
      setCompanyEmail(cemail);
      setCompanyInco(cindate);
      setCompanyId(employeeId);
      setCompanyNumber(cnum);
      setFormOpen(true);
      return true;
    }

    try {
      // Make an API call to update the employee status in the database
      const response = await axios.post(
        `${secretKey}/update-status/${employeeId}`,
        {
          newStatus,
        }
      );

      // Check if the API call was successful
      if (response.status === 200) {
        // Assuming fetchData is a function to fetch updated employee data

        fetchNewData(newStatus);

        // if(newStatus==="Interested"){
        //   setdataStatus("Interested");
        //   setEmployeeData(moreEmpData.filter(obj => obj.Status === "Interested"))
        // }
      } else {
        // Handle the case where the API call was not successful
        console.error("Failed to update status:", response.data.message);
      }
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error("Error updating status:", error.message);
    }
  };

  const handlenewFieldChange = (companyId, value) => {
    setUpdateData((prevData) => ({
      ...prevData,
      [companyId]: {
        ...prevData[companyId],
        Remarks: value,
        isButtonEnabled: true, // Enable the button when any field changes
      },
    }));
  };

  const handleDeleteRemarks = async (remarks_id) => {
    console.log("Deleting Remarks with", remarks_id);
    try {
      // Send a delete request to the backend to delete the item with the specified ID
      await axios.delete(`${secretKey}/remarks-history/${remarks_id}`);
      // Set the deletedItemId state to trigger re-fetching of remarks history
      Swal.fire("Remarks Deleted");
      fetchRemarksHistory();
    } catch (error) {
      console.error("Error deleting remarks:", error);
    }
  };
  const isUpdateButtonEnabled = (companyId) => {
    return updateData[companyId]?.isButtonEnabled || false;
  };

  const [changeRemarks, setChangeRemarks] = useState("");

  const handleUpdate = async () => {
    // Now you have the updated Status and Remarks, perform the update logic
    console.log(cid, cstat, changeRemarks);
    const Remarks = changeRemarks;

    try {
      // Make an API call to update the employee status in the database
      const response = await axios.post(`${secretKey}/update-remarks/${cid}`, {
        Remarks,
      });
      const response2 = await axios.post(
        `${secretKey}/remarks-history/${cid}`,
        {
          Remarks,
        }
      );

      // Check if the API call was successful
      if (response.status === 200) {
        Swal.fire("Remarks updated!");

        // If successful, update the employeeData state or fetch data again to reflect changes
        fetchNewData(cstat);
        fetchRemarksHistory();
        // setCstat("");
        closepopupRemarks(); // Assuming fetchData is a function to fetch updated employee data
      } else {
        // Handle the case where the API call was not successful
        console.error("Failed to update status:", response.data.message);
      }
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error("Error updating status:", error.message);
    }

    setUpdateData((prevData) => ({
      ...prevData,
      [companyId]: {
        ...prevData[companyId],
        isButtonEnabled: false,
      },
    }));

    // After updating, you can disable the button
  };

  const [freezeIndex, setFreezeIndex] = useState(null);

  const handleFreezeIndexChange = (e) => {
    setFreezeIndex(Number(e.target.value));
  };

  const getCellStyle = (index) => {
    if (index === freezeIndex) {
      return {
        position: "sticky",
        left: 0,
        zIndex: 1,
        backgroundColor: "#f0f0f0",
      };
    }

    return {};
  };

  function formatDate(inputDate) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(inputDate).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  }

  // Request form for Employees

  const [selectedYear, setSelectedYear] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [numberOfData, setNumberOfData] = useState("");

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleCompanyTypeChange = (event) => {
    setCompanyType(event.target.value);
  };

  const handleNumberOfDataChange = (event) => {
    setNumberOfData(event.target.value);
  };
  function formatDateproper(inputDate) {
    const options = { month: "long", day: "numeric", year: "numeric" };
    const formattedDate = new Date(inputDate).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  }
  const handleSubmit = async (event) => {
    const name = data.ename;
    const dateObject = new Date();
    const hours = dateObject.getHours().toString().padStart(2, "0");
    const minutes = dateObject.getMinutes().toString().padStart(2, "0");
    const cTime = `${hours}:${minutes}`;

    const cDate = formatDateproper(dateObject);
    event.preventDefault();
    if (selectedOption === "notgeneral") {
      try {
        // Make API call using Axios
        const response = await axios.post(
          `${secretKey}/requestData`,

          {
            selectedYear,
            companyType,
            numberOfData,
            name,
            cTime,
            cDate,
          }
        );

        console.log("Data sent successfully:", response.data);
        Swal.fire("Request sent!");
        closepopup();
      } catch (error) {
        console.error("Error:", error.message);
        Swal.fire("Please try again later!");
      }
    } else {
      try {
        // Make API call using Axios
        const response = await axios.post(`${secretKey}/requestgData`, {
          numberOfData,
          name,
          cTime,
          cDate,
        });

        console.log("Data sent successfully:", response.data);
        Swal.fire("Request sent!");
        closepopup();
      } catch (error) {
        console.error("Error:", error.message);
        Swal.fire("Please try again later!");
      }
    }
  };

  const [selectedOption, setSelectedOption] = useState("general");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmitData = (e) => {
    e.preventDefault();
    axios
      .post(`${secretKey}/manual`, {
        "Company Name": cname,
        "Company Number": cnumber,
        "Company Email": cemail,
        "Company Incorporation Date  ": cidate,
        City: city,
        State: state,
        ename: data.ename,
        AssignDate: new Date(),
      })
      .then((response) => {
        console.log("Data sent Successfully");
        Swal.fire({
          title: "Data Added!",
          text: "Successfully added new Data!",
          icon: "success",
        });
        fetchNewData();
        closepopupNew();
      })
      .catch((error) => {
        Swal.fire("Please Enter Unique data!");
      });
  };

  return (
    <div>
      <Header name={data.ename} designation={data.designation} />
      <EmpNav userId={userId} />

      {/* Dialog box for Request Data */}
      {!formOpen ? (
        <>
          <div className="page-wrapper">
            <div className="page-header d-print-none">
              <div className="container-xl">
                <div className="row g-2 align-items-center">
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                    className="features"
                  >
                    <div style={{ display: "flex" }} className="feature1">
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
                            <option value="Not Picked Up">
                              Not Picked Up{" "}
                            </option>
                            <option value="Junk">Junk</option>
                            <option value="Interested">Interested</option>
                            <option value="Not Interested">
                              Not Interested
                            </option>
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
                      <div className="request" style={{ marginRight: "15px" }}>
                        <div className="btn-list">
                          <button
                            onClick={functionopenpopup}
                            className="btn btn-primary d-none d-sm-inline-block"
                          >
                            Request Data
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
                      <div className="request">
                        <div className="btn-list">
                          <button
                            onClick={functionopenpopupNew}
                            className="btn btn-primary d-none d-sm-inline-block"
                          >
                            ADD Leads
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
                    </div>
                  </div>

                  {/* <!-- Page title actions --> */}
                </div>
              </div>
            </div>
            <div
              onCopy={(e) => {
                e.preventDefault();
              }}
              className="page-body"
            >
              <div className="container-xl">
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
                            moreEmpData.filter(
                              (obj) => obj.Status === "FollowUp"
                            )
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
                            moreEmpData.filter(
                              (obj) => obj.Status === "FollowUp"
                            ).length
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
                            moreEmpData.filter(
                              (obj) => obj.Status === "Matured"
                            )
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
                            moreEmpData.filter(
                              (obj) => obj.Status === "Matured"
                            ).length
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
                        maxHeight: "66vh",
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
                            <tr className="particular">
                              <td colSpan="10" style={{ textAlign: "center" }}>
                                <Nodata/>
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
                                <td className="td-sticky">
                                  {startIndex + index + 1}
                                </td>
                                <td className="td-sticky1">
                                  {company["Company Name"]}
                                </td>
                                <td>{company["Company Number"]}</td>
                                <td>
                                  {company["Status"] === "Matured" ? (
                                    <span>{company["Status"]}</span>
                                  ) : (
                                    <select
                                      style={{
                                        width: "100px",
                                        background:"none",
                                        padding: ".4375rem .75rem",
                                        border:
                                          "1px solid var(--tblr-border-color)",
                                        borderRadius:
                                          "var(--tblr-border-radius)",
                                      }}
                                      value={company["Status"]}
                                      onChange={(e) =>
                                        handleStatusChange(
                                          company._id,
                                          e.target.value,
                                          company["Company Name"],
                                          company["Company Email"],
                                          company[
                                            "Company Incorporation Date  "
                                          ],
                                          company["Company Number"]
                                        )
                                      }
                                    >
                                      <option value="Untouched">
                                        Untouched{" "}
                                      </option>
                                      <option value="FollowUp">
                                        Follow Up{" "}
                                      </option>
                                      <option value="Busy">Busy </option>
                                      <option value="Not Picked Up">
                                        Not Picked Up
                                      </option>
                                      <option value="Junk">Junk</option>
                                      <option value="Interested">
                                        Interested
                                      </option>
                                      <option value="Matured">Matured</option>
                                      <option value="Not Interested">
                                        Not Interested
                                      </option>
                                    </select>
                                  )}
                                </td>
                                <td>
                                  <div
                                    key={company._id}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      width: "100px",
                                    }}
                                  >
                                    <p
                                      className="rematkText text-wrap m-0"
                                      title={company.Remarks}
                                    >
                                      {!company["Remarks"]
                                        ? "No Remarks"
                                        : company.Remarks}
                                    </p>

                                    <IconButton>
                                      <EditIcon
                                        style={{
                                          width: "12px",
                                          height: "12px",
                                        }}
                                        onClick={() => {
                                          functionopenpopupremarks(
                                            company._id,
                                            company.Status
                                          );
                                        }}
                                      />
                                    </IconButton>
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
                                Math.ceil(filteredData.length / itemsPerPage) -
                                  1
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
          </div>
        </>
      ) : (
        <>
          <div className="page-wrapper">
            <div className="page-header d-print-none">
              <div
                style={{ justifyContent: "space-between" }}
                className="container-xl d-flex"
              >
                <div className="row g-2 align-items-center">
                  <div className="col">
                    {/* <!-- Page pre-title --> */}
                    <h2 className="page-title">Leadform</h2>
                  </div>
                </div>
                <div className="request">
                  <div className="btn-list">
                    <button
                      onClick={() => {
                        setFormOpen(false);
                      }}
                      className="btn btn-primary d-none d-sm-inline-block"
                    >
                      Back
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
              </div>
            </div>
            <div
              onCopy={(e) => {
                e.preventDefault();
              }}
              className="page-body"
            >
              <div className="container-xl">
                <Form
                  matured={true}
                  companysId={companyId}
                  companysName={companyName}
                  companysEmail={companyEmail}
                  companyNumber={companyNumber}
                  companysInco={companyInco}
                  employeeName={data.ename}
                  employeeEmail={data.email}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Request Data popup */}
      <Dialog open={open} onClose={closepopup} fullWidth maxWidth="sm">
        <DialogTitle>
          Request Data{" "}
          <IconButton onClick={closepopup} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          <div className="container">
            
              <div className="con2 row mb-3">
                <div
                  style={
                    selectedOption === "general"
                      ? {
                          backgroundColor: "#ffb900",
                          margin: "10px 10px 0px 0px",
                          cursor: "pointer",
                          color: "white",
                        }
                      : {
                          backgroundColor: "white",
                          margin: "10px 10px 0px 0px",
                          cursor: "pointer",
                        }
                  }
                  onClick={() => {
                    setSelectedOption("general");
                  }}
                  className="direct form-control col"
                >
                  <input
                    type="radio"
                    id="general"
                    value="general"
                    style={{
                      display: "none",
                    }}
                    checked={selectedOption === "general"}
                    onChange={handleOptionChange}
                  />
                  <label htmlFor="general">General Data </label>
                </div>
                <div
                  style={
                    selectedOption === "notgeneral"
                      ? {
                          backgroundColor: "#ffb900",
                          margin: "10px 0px 0px 0px",
                          cursor: "pointer",
                          color: "white",
                        }
                      : {
                          backgroundColor: "white",
                          margin: "10px 0px 0px 0px",
                          cursor: "pointer",
                        }
                  }
                  className="notgeneral form-control col"
                  onClick={() => {
                    setSelectedOption("notgeneral");
                  }}
                >
                  <input
                    type="radio"
                    id="notgeneral"
                    value="notgeneral"
                    style={{
                      display: "none",
                    }}
                    checked={selectedOption === "notgeneral"}
                    onChange={handleOptionChange}
                  />
                  <label htmlFor="notgeneral">Manual</label>
                </div>
              </div>
              {selectedOption === "notgeneral" ? (
                <>
                  <div className="mb-3 row">
                    <label className="col-sm-3 form-label" htmlFor="selectYear">
                      Select Year :
                    </label>
                    <select
                      id="selectYear"
                      name="selectYear"
                      value={selectedYear}
                      onChange={handleYearChange}
                      className="col form-select"
                    >
                      {[...Array(2025 - 1970).keys()].map((year) => (
                        <option key={year} value={1970 + year}>
                          {1970 + year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3 row">
                    <label className="form-label col-sm-3">
                      Company Type :
                    </label>
                    <input
                      type="radio"
                      id="llp"
                      name="companyType"
                      value="LLP"
                      checked={companyType === "LLP"}
                      onChange={handleCompanyTypeChange}
                      className="form-check-input"
                    />
                    <label htmlFor="llp" className="col">
                      LLP
                    </label>
                    <input
                      type="radio"
                      id="pvtLtd"
                      name="companyType"
                      value="PVT LTD"
                      checked={companyType === "PVT LTD"}
                      onChange={handleCompanyTypeChange}
                      className="form-check-input"
                    />
                    <label className="col" htmlFor="pvtLtd">
                      PVT LTD
                    </label>
                  </div>
                </>
              ) : (
                <div></div>
              )}

              <div className="mb-3 row">
                <label className="col-sm-3 form-label" htmlFor="numberOfData">
                  Number of Data :
                </label>
                <input
                  type="number"
                  id="numberOfData"
                  name="numberOfData"
                  className="form-control col"
                  value={numberOfData}
                  onChange={handleNumberOfDataChange}
                  min="1"
                  required
                />
              </div>
            
          </div>
        </DialogContent>
        <div class="card-footer">
          <button
            style={{ width: "100%" }}
            onClick={handleSubmit}
            className="btn btn-primary"
          >
            Submit
          </button>
        </div>
      </Dialog>

      {/* Remarks edit icon pop up*/}
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
                        <div className="dlticon">
                          <DeleteIcon
                            
                            style={{
                              cursor: "pointer",
                              color: "#f70000",
                              width: "14px ",
                            }}
                            onClick={() => {
                              handleDeleteRemarks(historyItem._id);
                            }}
                          />
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

          <div class="card-footer">
            <div class="mb-3 remarks-input">
              <textarea
                placeholder="Add Remarks Here...  "
                class="form-control"
                id="remarks-input"
                rows="3"
                onChange={(e) => {
                  setChangeRemarks(e.target.value);
                }}
              ></textarea>
            </div>
            <button
              onClick={handleUpdate}
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              Submit
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ADD Leads starts here */}
      <Dialog open={openNew} onClose={closepopupNew} fullWidth maxWidth="sm">
        <DialogTitle>
          Company Info{" "}
          <IconButton onClick={closepopupNew} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Company Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="example-text-input"
                    placeholder="Your Company Name"
                    onChange={(e) => {
                      setCname(e.target.value);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Company Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="example-text-input"
                    placeholder="example@gmail.com"
                    onChange={(e) => {
                      setCemail(e.target.value);
                    }}
                  />
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Company Number</label>
                      <input
                        type="number"
                        onChange={(e) => {
                          setCnumber(e.target.value);
                        }}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Company Incorporation Date
                      </label>
                      <input
                        onChange={(e) => {
                          setCidate(e.target.value);
                        }}
                        type="date"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">City</label>
                      <input
                        onChange={(e) => {
                          setCity(e.target.value);
                        }}
                        type="text"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">State</label>
                      <input
                        onChange={(e) => {
                          setState(e.target.value);
                        }}
                        type="text"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <button onClick={handleSubmitData} className="btn btn-primary">
          Submit
        </button>
      </Dialog>
    </div>
  );
}

export default EmployeePanel;
