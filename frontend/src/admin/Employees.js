import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import Navbar from "./Navbar";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import LoginAdmin from "./LoginAdmin";
import "../dist/css/tabler.min.css?1684106062";
import "../dist/css/tabler-flags.min.css?1684106062";
import "../dist/css/tabler-payments.min.css?1684106062";
import "../dist/css/tabler-vendors.min.css?1684106062";
import "../dist/css/demo.min.css?1684106062";
import { IconTrash } from "@tabler/icons-react";
import "../assets/styles.css";
import "../assets/table.css";
import Swal from "sweetalert2";
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
import Nodata from "../components/Nodata";

function Employees({ onEyeButtonClick }) {
  // const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedin')==='true');
  // const handleLogin = ()=>{
  //   setIsLoggedIn(true)
  // }
  const handleEyeButtonClick = (id) => {
    // Call the callback function provided by the parent component
    onEyeButtonClick(id);
    console.log(id);
  };
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [companyDdata, setCompanyDdata] = useState([]);
  const [nametodelete, setnametodelete] = useState("");
  const [showPassword, setShowPassword] = useState(false)

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
  const [otherdesignation, setotherDesignation] = useState("");
  const [companyData, setCompanyData] = useState([]);

  const [open, openchange] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${secretKey}/einfo`);

      // Set the retrieved data in the state

      setFilteredData(response.data);
      setData(response.data);
      setEmail("");
      setEname("");
      setNumber(0);
      setPassword("");
      setJdate(null);
      setDesignation("");
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
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
    if (
      selectedData.designation !== "Sales Executive" ||
      selectedData.designation !== "Sales Manager" ||
      selectedData.designation !== "Graphics Designer" ||
      selectedData.designation !== "Software Developer" ||
      selectedData.designation !== "Finance Analyst" ||
      selectedData.designation !== "Content Writer" ||
      selectedData.designation !== "Admin Team"
    ) {
      setDesignation("Others");
      setotherDesignation(selectedData.designation);
    } else {
      setDesignation(selectedData.designation);
    }

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
      await axios.delete(`${secretKey}/einfo/${id}`);
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
  useEffect(() => {
    // Fetch data from the Node.js server
    setFilteredData(data);
    // Call the fetchData function
    fetchData();
    fetchCData();
  }, []);

  const fetchCData = async () => {
    try {
      const response = await axios.get(`${secretKey}/leads`);

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
        AddedOn : AddedOn
      };

      // Set designation based on otherDesignation
      if (otherdesignation !== "") {
        dataToSend.designation = otherdesignation;
      } else {
        dataToSend.designation = designation;
      }

      if (isUpdateMode) {
        await axios.put(`${secretKey}/einfo/${selectedDataId}`, dataToSend);
        Swal.fire({
          title: "Name Updated!",
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
                await axios.put(`${secretKey}/newcompanyname/${item._id}`, {
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
        await axios.post(`${secretKey}/einfo`, dataToSend);
        Swal.fire({
          title: "Data Added!",
          text: "You have successfully added the data!",
          icon: "success",
        });
      }

      setEmail("");
      setEname("");
      setNumber(0);
      setPassword("");
      setDesignation("");
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

  return (
    <div>
      <Modal
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
      </Modal>
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
                        <option value="Admin Team">Admin Team</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-lg-6 mb-3">
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

      <Header />
      <Navbar number={1} />
      <div className="page-wrapper">
        <div className="page-header d-print-none">
          <div className="container-xl">
            <div className="row g-2 align-items-center">
              <div className="col">
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
              <div className="col-auto ms-auto d-print-none">
                <div className="btn-list">
                  <button
                    className="btn btn-primary d-none d-sm-inline-block"
                    onClick={functionopenpopup}
                  >
                    {/* <!-- Download SVG icon from http://tabler-icons.io/i/plus --> */}
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
                      stroke-linejoin="round"
                    >
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
                    {/* <!-- Download SVG icon from http://tabler-icons.io/i/plus --> */}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Employee table */}
      <div
        onCopy={(e) => {
          e.preventDefault();
        }}
        className="page-body"
      >
        <div
          style={{ maxWidth: "89vw", overflowX: "auto" }}
          className="container-xl"
        >
          <div className="card">
            <div style={{ padding: "0px" }} className="card-body">
              <div id="table-default" style={{overflow: "auto", maxHeight: "70vh"}}>
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
                        <button className="table-sort" data-sort="sort-city">
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
                        <button className="table-sort" data-sort="sort-date">
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
                          Added on
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
                    <tbody>
                      <tr>
                        <td className="particular" colSpan="10" style={{ textAlign: "center" }}>
                          <Nodata/>
                        </td>
                      </tr>
                    </tbody>
                  ) : (
                    <tbody className="table-tbody">
                   { filteredData.map((item, index) => (
                     
                        <tr key={index} style={{ border: "1px solid #ddd" }}>
                          <td
                           className="td-sticky"
                          >
                            {index + 1}
                          </td>
                          <td >{item.ename}</td>
                          <td>{item.number}</td>
                          <td>{item.email}</td>
                          <td>
                            {formatDate(item.jdate)}
                          </td>
                          <td>{item.designation}</td>
                          <td>{item.AddedOn}</td>
                          <td className="d-flex justify-content-center align-items-center">
                            <div className="icons-btn">
                              <IconTrash
                                style={{
                                  cursor: "pointer",
                                  color: "red",
                                  width: "18px",
                                  height: "18px"
                                }}
                                onClick={() =>
                                  handleDeleteClick(item._id, item.ename)
                                }
                              />
                            </div>

                            <div className="icons-btn m-1">
                              <ModeEditIcon
                                style={{
                                  cursor: "pointer",
                                  color: "#a29d9d",
                                  width: "18px",
                                  height: "18px"
                                }}
                                onClick={() => {
                                  functionopenpopup();
                                  handleUpdateClick(item._id, item.ename);
                                }}
                              />
                              
                            </div>
                            <div className="icons-btn">
                              <Link
                                style={{ color: "black" }}
                                to={`/admin/employees/${item._id}`}
                              >
                                <IconEye
                                  style={{
                                    width: "18px",
                                  height: "18px",
                                  color:"#d6a10c"
                                  }}
                                />
                              </Link>
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
