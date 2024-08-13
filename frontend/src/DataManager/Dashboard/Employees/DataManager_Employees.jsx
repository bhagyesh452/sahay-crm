import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../Components/Header/Header.jsx";
import Navbar from "../../Components/Navbar/Navbar.jsx";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
//import LoginAdmin from "./LoginAdmin";
import '../../../dist/css/tabler.min.css?1684106062';
//import "../../../dist/css/tabler.min.css?1684106062";
import "../../../dist/css/tabler-flags.min.css?1684106062";
import "../../../dist/css/tabler-payments.min.css?1684106062";
import "../../../dist/css/tabler-vendors.min.css?1684106062";
import "../../../dist/css/demo.min.css?1684106062";
import { IconTrash } from "@tabler/icons-react";
import "../../../assets/styles.css";
import "../../../assets/table.css";
import Swal from "sweetalert2";
import io from "socket.io-client";
import { BsFillPersonVcardFill } from "react-icons/bs";
// import EmployeeTable from "./EmployeeTable";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Modal from "react-modal";
import { IconEye } from "@tabler/icons-react";
import { FaWhatsapp } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import MaleEmployee from "../../../static/EmployeeImg/office-man.png";
import FemaleEmployee from "../../../static/EmployeeImg/woman.png";
import ClipLoader from "react-spinners/ClipLoader.js";
import Nodata from "../../Components/Nodata/Nodata.jsx";

function Employees({ onEyeButtonClick, searchValue }) {
  // const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedin')==='true');
  // const handleLogin = ()=>{
  //   setIsLoggedIn(true)
  // }
  const handleEyeButtonClick = (id) => {
    onEyeButtonClick(id);
    console.log(id);
  };

  const updateActiveStatus = async () => {
    try {
      const response = await axios.get(`${secretKey}/employee/einfo`);
      const filterresponse = response.data.filter((employee) => employee.newDesignation === "Business Development Executive" || employee.newDesignation === "Business Development Manager");
      setData(filterresponse);
      setFilteredData(filterresponse);
    } catch (error) {
      console.error('Error fetching employee info:', error);
    }
  };

  useEffect(() => {
    const socket = secretKey === "http://localhost:3001/api" ? io("http://localhost:3001") : io("wss://startupsahay.in", {
      secure: true, // Use HTTPS
      path: '/socket.io',
      reconnection: true,
      transports: ['websocket'],
    });
    socket.on("employee-entered", () => {
      console.log("One user Entered");
      setTimeout(() => {
        updateActiveStatus();
      }, 5000); // Delay execution by 5 seconds (5000 milliseconds)
    });

    socket.on("user-disconnected", () => {
      updateActiveStatus();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    document.title = `Datamanager-Sahay-CRM`;
  }, []);

  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [companyDdata, setCompanyDdata] = useState([]);
  const [nametodelete, setnametodelete] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const formattedDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };


  const handleDeleteClick = (itemId, nametochange) => {
    // Open the confirm delete modal
    setCompanyDdata(cdata.filter((item) => item.ename === nametochange));
    setItemIdToDelete(itemId);
    setIsModalOpen(true);
  };

  const secretKey = process.env.REACT_APP_SECRET_KEY;

  const handleConfirmDelete = () => {
    // Perform the delete operation here (call your delete API, etc.)
    // After deletion, close the modal
    handleDelete(itemIdToDelete);
    handledeletefromcompany();
    setIsModalOpen(false);
  };

  const handledeletefromcompany = async () => {
    if (companyDdata && companyDdata.length !== 0) {
      // Assuming ename is part of dataToSend

      try {
        // Update companyData in the second database
        await Promise.all(
          companyDdata.map(async (item) => {
            await axios.delete(`${secretKey}/newcompanynamedelete/${item._id}`);
            console.log(`Deleted name for ${item._id}`);
          })
        );
        Swal.fire({
          title: "Data Deleted!",
          text: "You have successfully Deleted the data!",
          icon: "success",
        });

        console.log("All ename updates completed successfully");
      } catch (error) {
        console.error("Error updating enames:", error.message);
        Swal.fire("Error deleting the employee");
        // Handle the error as needed
      }
    }
  };

  const handleCancelDelete = () => {
    // Cancel the delete operation and close the modal
    setIsModalOpen(false);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortedFormat, setSortedFormat] = useState({
    ename: "ascending",
    jdate: "ascending",
    addedOn: 'ascending'
  })
  const [data, setData] = useState([]);
  const [cdata, setCData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedDataId, setSelectedDataId] = useState("2024-01-03");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState(0);
  const [ename, setEname] = useState("");
  const [jdate, setJdate] = useState(null);
  const [designation, setDesignation] = useState("");
  const [branchOffice, setBranchOffice] = useState("");
  const [otherdesignation, setotherDesignation] = useState("");
  const [companyData, setCompanyData] = useState([]);

  const [open, openchange] = useState(false);

  


  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter the data based on the search query (case-insensitive partial match)
    const filtered = data.filter((item) =>
      item.email.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredData(filtered);
  };

  const handleUpdateClick = (id, echangename) => {
    // Set the selected data ID and set update mode to true
    setSelectedDataId(id);
    setIsUpdateMode(true);
    setCompanyData(cdata.filter((item) => item.ename === echangename));

    // Find the selected data object
    const selectedData = data.find((item) => item._id === id);
    console.log(echangename);

    // Update the form data with the selected data values
    setEmail(selectedData.email);
    setEname(selectedData.ename);
    setNumber(selectedData.number);
    setPassword(selectedData.password);
    setDesignation(selectedData.designation);
    setBranchOffice(selectedData.branchOffice)

    const dateObject = new Date(selectedData.jdate);
    const day = dateObject.getDate().toString().padStart(2, "0"); // Ensure two-digit day
    const month = (dateObject.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const year = dateObject.getFullYear();
    const formattedDateString = `${year}-${month}-${day}`;

    // setJdate('2004-04-04');
    setJdate(formattedDateString);

    // // Get individual date components

    // // Create the formatted date string in "dd-mm-yyyy" format

    // console.log(formattedDateString); // Output: "04-01-2024"
    //     console.log(jdate);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${secretKey}/employee/einfo/${id}`);
      // Refresh the data after successful deletion
      fetchData();
      Swal.fire({
        title: "Employee Removed!",
        text: "You have successfully removed the employee!",
        icon: "success",
      });
    } catch (error) {
      console.error("Error deleting data:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please try again later!",
      });
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${secretKey}/employee/einfo`);
      const filterresponse = response.data.filter((employee) => employee.newDesignation === "Business Development Executive" || employee.newDesignation === "Business Development Manager");
      //console.log(filterresponse)
      //console.log(response.data)
      // Set the retrieved data in the state

      setFilteredData(filterresponse);
      setData(response.data);
      setEmail("");
      setEname("");
      setNumber(0);
      setPassword("");
      setJdate(null);
      setDesignation("");
      setBranchOffice("")
      const result = filterresponse.filter((emp) => {
        return (
          emp.ename?.toLowerCase().includes(searchValue) ||
          emp.number?.toString().includes(searchValue) ||
          emp.email?.toLowerCase().includes(searchValue) ||
          emp.newDesignation?.toLowerCase().includes(searchValue) ||
          emp.branchOffice?.toLowerCase().includes(searchValue)
        );
      });
      console.log("Search result from employee list is :", result);
      setSearchResult(result);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data from the Node.js server
    setFilteredData(data);
    // Call the fetchData function
    fetchData();
    fetchCData();
  }, [searchValue]);

  function formatDateWP(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (isSameDay(date, today)) {
      // If the date is today, format as "Last seen today on HH:MM AM/PM"
      return `Last seen today on ${formatTime(date)}`;
    } else if (isSameDay(date, yesterday)) {
      // If the date is yesterday, format as "Last seen yesterday on HH:MM AM/PM"
      return `Last seen yesterday on ${formatTime(date)}`;
    } else {
      // Otherwise, format as "Last seen on DD/MM/YYYY"
      return `Last seen on ${formatDateTime(date)}`;
    }
  }

  function isSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  function formatTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  }

  function formatDateTime(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  const fetchCData = async () => {
    try {
      const response = await axios.get(`${secretKey}/company-data/leads`);

      setCData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  const handleSubmit = async (e) => {
    console.log(jdate);
    // const referenceId = uuidv4();
    const AddedOn = new Date().toLocaleDateString();
    try {
      let dataToSend = {
        email: email,
        number: number,
        ename: ename,
        password: password,
        jdate: jdate,
        AddedOn: AddedOn,
        branchOffice: branchOffice,
      };
      let dataToSendUpdated = {
        email: email,
        number: number,
        ename: ename,
        password: password,
        jdate: jdate,
        designation: designation,
        branchOffice: branchOffice

      };

      // Set designation based on otherDesignation
      if (otherdesignation !== "") {
        dataToSend.designation = otherdesignation;
      } else {
        dataToSend.designation = designation;
      }

      if (isUpdateMode) {
        await axios.put(`${secretKey}/employee/einfo/${selectedDataId}`, dataToSendUpdated);
        Swal.fire({
          title: "Data Updated Succesfully!",
          text: "You have successfully updated the name!",
          icon: "success",
        });

        if (companyData && companyData.length !== 0) {
          // Assuming ename is part of dataToSend
          const { ename } = dataToSend;
          try {
            // Update companyData in the second database
            await Promise.all(
              companyData.map(async (item) => {
                await axios.put(`${secretKey}/company-data/newcompanyname/${item._id}`, {
                  ename,
                });
                console.log(`Updated ename for ${item._id}`);
              })
            );

            console.log("All ename updates completed successfully");
          } catch (error) {
            console.error("Error updating enames:", error.message);
            // Handle the error as needed
          }
        }
      } else {
        await axios.post(`${secretKey}/employee/einfo`, dataToSend);
        Swal.fire({
          title: "Data Added!",
          text: "You have successfully added the data!",
          icon: "success",
        });
      }
      console.log("datatosend", dataToSend)

      setEmail("");
      setEname("");
      setNumber(0);
      setPassword("");
      setDesignation("");
      setBranchOffice("")
      setotherDesignation("");
      setJdate(null);
      setIsUpdateMode(false);
      fetchData();
      closepopup();
      console.log("Data sent successfully");
    } catch {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
      console.error("Internal server error");
    }
  };

  const functionopenpopup = () => {
    openchange(true);
  };
  const closepopup = () => {
    openchange(false);
  };

  //   cInfo:{
  //     "Company Name": referenceId + "company",

  // "Company Email": referenceId + "email",
  // "Company Incorporation Date  ": new Date(),
  // "Company Number": Math.floor(Math.random() * 1000000),
  // City: referenceId + "city",
  // State: referenceId + "state",
  //   }

  // const formattedDate = new Date(jdate).toLocaleDateString();
  //   console.log('Formatted Date:', formattedDate);

  function formatDate(inputDate) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(inputDate).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  }
  console.log(new Date("06/02/2024").toLocaleDateString('en-GB'));
  const sortDataByName = () => {
    if (sortedFormat.ename === "ascending") {
      setSortedFormat({
        ...sortedFormat, // Spread the existing properties
        ename: "descending", // Update the jdate property
      });

      const sortedData = [...filteredData].sort((a, b) =>
        a.ename.localeCompare(b.ename)
      );
      setFilteredData(sortedData);

    } else {
      setSortedFormat({
        ...sortedFormat, // Spread the existing properties
        ename: "ascending", // Update the jdate property
      });

      const sortedData = [...filteredData].sort((a, b) =>
        b.ename.localeCompare(a.ename)
      );
      setFilteredData(sortedData);

    }

  };
  const sortDateByAddedOn = () => {
    if (sortedFormat.addedOn === "ascending") {
      setSortedFormat({
        ...sortedFormat, // Spread the existing properties
        addedOn: "descending", // Update the jdate property
      });

      const sortedData = [...filteredData].sort((a, b) =>
        a.AddedOn.localeCompare(b.AddedOn)
      );
      setFilteredData(sortedData);

    } else {
      setSortedFormat({
        ...sortedFormat, // Spread the existing properties
        addedOn: "ascending", // Update the jdate property
      });

      const sortedData = [...filteredData].sort((a, b) =>
        b.AddedOn.localeCompare(a.AddedOn)
      );
      setFilteredData(sortedData);

    }

  };
  const sortDataByJoiningDate = () => {
    if (sortedFormat.jdate === 'ascending') {
      setSortedFormat({
        ...sortedFormat, // Spread the existing properties
        jdate: "descending", // Update the jdate property
      });

      const sortedData = [...filteredData].sort((a, b) =>
        new Date(a.jdate) - new Date(b.jdate)
      );
      setFilteredData(sortedData);
    }
    else {
      setSortedFormat({
        ...sortedFormat, // Spread the existing properties
        jdate: "ascending", // Update the jdate property
      });

      const sortedData = [...filteredData].sort((a, b) =>
        new Date(b.jdate) - new Date(a.jdate)
      );
      setFilteredData(sortedData);

    }

  };
  const dataManagerName = localStorage.getItem("dataManagerName")
  //console.log(dataManagerName)






  return (
    <div>
      {/* <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            width: "fit-content",
            height: "fit-content",
            margin: "auto",
            textAlign: "center",
          },
        }}
      >
        <div className="modal-header">
          <h3 style={{ fontSize: "20px" }} className="modal-title">
            Confirm Delete?
          </h3>
        </div>

        <button
          className="btn btn-primary ms-auto"
          onClick={handleConfirmDelete}
        >
          Yes, Delete
        </button>
        <button
          className="btn btn-link link-secondary"
          onClick={handleCancelDelete}
        >
          Cancel
        </button>
      </Modal> */}

      <Dialog open={open} onClose={closepopup} fullWidth maxWidth="sm">
        <DialogTitle>
          Employee Info{" "}
          <IconButton onClick={closepopup} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Employee Name</label>
                  <input
                    type="text"
                    value={ename}
                    className="form-control"
                    name="example-text-input"
                    placeholder="Your report name"
                    onChange={(e) => {
                      setEname(e.target.value);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    value={email}
                    type="email"
                    className="form-control"
                    name="example-text-input"
                    placeholder="Your report name"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      className="form-control"
                      name="example-text-input"
                      placeholder="Your report name"
                      required
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-6 mb-3">
                    <label className="form-label">Designation</label>
                    <div className="form-control">
                      <select
                        style={{
                          border: "none",
                          outline: "none",
                          width: "fit-content",
                        }}
                        value={designation}
                        required
                        onChange={(e) => {
                          setDesignation(e.target.value);
                        }}
                      >
                        <option value="" disabled selected>
                          Select Designation
                        </option>
                        <option value="Sales Executive">Sales Executive</option>
                        <option value="Sales Manager">Sales Manager</option>
                        <option value="Graphics Designer">
                          Graphics Designer
                        </option>
                        <option value="Software Developer">
                          Software Developer
                        </option>
                        <option value="Finance Analyst">Finance Analyst</option>
                        <option value="Content Writer">Content Writer</option>
                        <option value="Data Manager">Data Manager</option>
                        <option value="Admin Team">Admin Team</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-6 mb-3">
                    <label className="form-label">Branch Office</label>
                    <div className="form-control">
                      <select
                        style={{
                          border: "none",
                          outline: "none",
                          width: "fit-content",
                        }}
                        value={branchOffice}
                        required
                        onChange={(e) => {
                          setBranchOffice(e.target.value);
                        }}
                      >
                        <option value="" disabled selected>
                          Select Branch Office
                        </option>
                        <option value="Gota">Gota</option>
                        <option value="Sindhu Bhawan">Sindhu Bhawan</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* If the designation is others */}
                {designation === "Others" && (
                  <div className="mb-3">
                    <input
                      value={otherdesignation}
                      type="email"
                      className="form-control"
                      name="example-text-input"
                      placeholder="Please enter your designation"
                      onChange={(e) => {
                        setotherDesignation(e.target.value);
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="row">
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label className="form-label">Phone No.</label>
                    <input
                      value={number}
                      type="number"
                      className="form-control"
                      onChange={(e) => {
                        setNumber(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label className="form-label">Joining Date</label>
                    <input
                      value={jdate}
                      type="date"
                      onChange={(e) => {
                        setJdate(e.target.value);
                      }}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </Dialog>

      {/* <Header name={dataManagerName} />
      <Navbar number={1} name={data} /> */}

      <div>
        <div className="table table-responsive table-style-3 m-0">
          <table className="table table-vcenter table-nowrap">
            <thead>
              <tr className="tr-sticky">
                <th>Sr. No</th>
                <th>Name</th>
                <th>Phone No</th>
                <th>Email</th>
                <th>Designation</th>
                <th>Branch</th>
                <th>Joining Date</th>
                <th>Added Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            {isLoading ? (
              <tbody>
                <tr>
                  <td colSpan="12">
                    <div className="LoaderTDSatyle w-100">
                      <ClipLoader
                        color="lightgrey"
                        loading={true}
                        size={30}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (searchValue ? searchResult : filteredData).length !== 0 ? (
              <tbody className="table-tbody">
                {(searchValue ? searchResult : filteredData).map((item, index) => {
                  const profilePhotoUrl = item.profilePhoto?.length !== 0
                    ? `${secretKey}/employee/fetchProfilePhoto/${item._id}/${item.profilePhoto?.[0]?.filename}`
                    : item.gender === "Male" ? MaleEmployee : FemaleEmployee;

                  return (
                    <tr key={index} style={{ border: "1px solid #ddd" }}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="tbl-pro-img">
                            <img
                              src={profilePhotoUrl}
                              alt="Profile"
                              className="profile-photo"
                            />
                          </div>
                          <div className="">
                            {(() => {
                              const names = (item.ename || "").split(" ");
                              return `${names[0] || ""} ${names[names.length - 1] || ""}`;
                            })()}
                          </div>
                        </div>
                      </td>
                      <td>
                        <a
                          target="_blank"
                          className="text-decoration-none text-dark"
                          href={`https://wa.me/91${item.number}`}
                        >
                          {item.number}
                          <FaWhatsapp className="text-success ml-1" style={{ fontSize: '15px' }} />
                        </a>
                      </td>
                      <td>{item.email}</td>
                      <td>{item.newDesignation === "Business Development Executive" && "BDE" || item.newDesignation === "Business Development Manager" && "BDM" || item.newDesignation || ""}</td>
                      <td>{item.branchOffice}</td>
                      <td>{formattedDate(item.jdate)}</td>
                      <td>
                        {formattedDate(item.AddedOn) === "Invalid Date"
                          ? "06/02/2024"
                          : formattedDate(item.AddedOn)}
                      </td>
                      {item.designation !== "Admin Team" ? <td>
                        {(item.Active && item.Active.includes("GMT")) ? (
                          <div>
                            <span
                              style={{ color: "red", marginRight: "5px" }}
                            >
                              ●
                            </span>
                            <span
                              title={formattedDate(item.Active)}
                              style={{
                                fontWeight: "bold",
                                color: "rgb(170 144 144)",
                              }}
                            >
                              offline
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span
                              style={{ color: "green", marginRight: "5px" }}
                            >
                              ●
                            </span>
                            <span
                              style={{ fontWeight: "bold", color: "green" }}
                            >
                              Online
                            </span>
                          </div>
                        )}
                      </td> : <td>
                        <div>
                          <span
                            style={{ color: "red", marginRight: "5px" }}
                          >
                            ●
                          </span>
                          <span
                            style={{
                              fontWeight: "bold",
                              color: "rgb(170 144 144)",
                            }}
                          >
                            {formattedDate("Mon Mar 01 2024 18:25:58 GMT+0530 (India Standard Time)")}
                          </span>
                        </div>
                      </td>}
                      <td>
                        <button className="action-btn action-btn-primary">
                          <Link
                            style={{ color: "black", color: 'inherit' }}
                            to={`/dataanalyst/employeeLeads/${item._id}`}
                          ><FaRegEye />
                          </Link>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan="12" style={{ textAlign: "center" }}>
                    <Nodata />
                  </td>
                </tr>
              </tbody>
            )}

          </table>
        </div>
      </div>



      {/* Old Code for employee view */}
      <div className="d-none">
        <div className="page-header d-print-none m-0">
          <div className="row g-2 align-items-center">
            <div className="col m-0">
              {/* <!-- Page pre-title --> */}
              <h2 className="page-title">Employees</h2>
            </div>
            <div style={{ width: "20vw" }} className="input-icon">
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
                value={searchQuery}
                className="form-control"
                placeholder="Search…"
                aria-label="Search in website"
                onChange={handleSearch}
              />
            </div>

            {/* <!-- Page title actions --> */}
            {/* <div className="col-auto ms-auto d-print-none">
                <div className="btn-list">
                  <button
                    className="btn btn-primary d-none d-sm-inline-block"
                    onClick={functionopenpopup}
                  >
                    
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M12 5l0 14" />
                      <path d="M5 12l14 0" />
                    </svg>
                    Add Employees
                  </button>
                  <a
                    href="#"
                    className="btn btn-primary d-sm-none btn-icon"
                    data-bs-toggle="modal"
                    data-bs-target="#modal-report"
                    aria-label="Create new report"
                  >
                  
                  </a>
                </div>
              </div> */}
          </div>

        </div>
        {/* Employee table */}
        <div
          onCopy={(e) => {
            e.preventDefault();
          }}
          className="mt-2"
        >
          <div className="card">
            <div style={{ padding: "0px" }} className="card-body">
              <div
                id="table-default"
                style={{ overflow: "auto", maxHeight: "70vh" }}
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
                        <button className="table-sort" data-sort="sort-name">
                          Sr.No
                        </button>
                      </th>
                      <th>
                        <button onClick={sortDataByName} className="table-sort" data-sort="sort-city">
                          Name
                        </button>
                      </th>
                      <th>
                        <button className="table-sort" data-sort="sort-type">
                          Phone No
                        </button>
                      </th>
                      <th>
                        <button className="table-sort" data-sort="sort-score">
                          Email
                        </button>
                      </th>
                      <th>
                        <button onClick={sortDataByJoiningDate} className="table-sort" data-sort="sort-date">
                          Joining date
                        </button>
                      </th>
                      <th>
                        <button className="table-sort" data-sort="sort-date">
                          Designation
                        </button>
                      </th>
                      <th>
                        <button className="table-sort" data-sort="sort-date">
                          Branch Office
                        </button>
                      </th>
                      <th>
                        <button onClick={sortDateByAddedOn} className="table-sort" data-sort="sort-date">
                          Added on
                        </button>
                      </th>
                      <th>
                        <button className="table-sort" data-sort="sort-date">
                          Status
                        </button>
                      </th>
                      <th>
                        <button
                          className="table-sort"
                          data-sort="sort-quantity"
                        >
                          Action
                        </button>
                      </th>
                    </tr>
                  </thead>
                  {filteredData.length == 0 ? (
                    <tbody >
                      <tr>
                        <td
                          className="particular"
                          colSpan="10"
                          style={{ textAlign: "center" }}
                        >
                          <Nodata />
                        </td>
                      </tr>
                    </tbody>
                  ) : (
                    <tbody className="table-tbody" style={{ userSelect: "none" }} onContextMenu={(e) => e.preventDefault()}>
                      {filteredData.map((item, index) => (
                        <tr key={index} style={{ border: "1px solid #ddd" }}>
                          <td className="td-sticky">{index + 1}</td>
                          <td>{item.ename}</td>
                          <td>{item.number}</td>
                          <td>{item.email}</td>
                          <td>{formatDate(item.jdate)}</td>
                          <td>{item.designation}</td>
                          <td>{item.branchOffice}</td>
                          <td>{formatDate(item.AddedOn) === "Invalid Date" ? "Feb 6, 2024" : formatDate(item.AddedOn)}</td>
                          {item.designation !== "Admin Team" ? <td>
                            {(item.Active && item.Active.includes("GMT")) ? (
                              <div>
                                <span
                                  style={{ color: "red", marginRight: "5px" }}
                                >
                                  ●
                                </span>
                                <span
                                  style={{
                                    fontWeight: "bold",
                                    color: "rgb(170 144 144)",
                                  }}
                                >
                                  {formatDateWP(item.Active)}
                                </span>
                              </div>
                            ) : (
                              <div>
                                <span
                                  style={{ color: "green", marginRight: "5px" }}
                                >
                                  ●
                                </span>
                                <span
                                  style={{ fontWeight: "bold", color: "green" }}
                                >
                                  Online
                                </span>
                              </div>
                            )}
                          </td> : <td>
                            <div>
                              <span
                                style={{ color: "red", marginRight: "5px" }}
                              >
                                ●
                              </span>
                              <span
                                style={{
                                  fontWeight: "bold",
                                  color: "rgb(170 144 144)",
                                }}
                              >
                                {formatDateWP("Mon Mar 01 2024 18:25:58 GMT+0530 (India Standard Time)")}
                              </span>
                            </div>
                          </td>}

                          <td >
                            <div className="d-flex justify-content-center align-items-center">
                              {/* <div className="icons-btn">
                                  <IconButton onClick={() =>
                                    handleDeleteClick(item._id, item.ename)}>
                                    <IconTrash
                                      style={{
                                        cursor: "pointer",
                                        color: "red",
                                        width: "14px",
                                        height: "14px",
                                      }}

                                    />
                                  </IconButton>
                                </div>
                                <div className="icons-btn">
                                  <IconButton onClick={() => {
                                    functionopenpopup();
                                    handleUpdateClick(item._id, item.ename);
                                  }}>
                                    <ModeEditIcon
                                      style={{
                                        cursor: "pointer",
                                        color: "#a29d9d",
                                        width: "14px",
                                        height: "14px",
                                      }}

                                    />
                                  </IconButton>
                                </div> */}
                              <div className="icons-btn">
                                <Link
                                  style={{ color: "black" }}
                                  to={`/datamanager/employeeLeads/${item._id}`}
                                ><IconButton >
                                    <IconEye
                                      style={{
                                        width: "14px",
                                        height: "14px",
                                        color: "#d6a10c",
                                      }}
                                    /></IconButton>
                                </Link>
                              </div>
                            </div>

                          </td>
                        </tr>
                      ))}
                    </tbody>
                  )}
                  <tbody className="table-tbody"></tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>


    </div>
  );
}

export default Employees;
