import React from "react";
import Papa from "papaparse";
import Header from "./Header";
import Navbar from "./Navbar";
import axios from "axios";
import { IconChevronLeft } from "@tabler/icons-react";
import { IconChevronRight } from "@tabler/icons-react";
import CircularProgress from "@mui/material/CircularProgress";
import UndoIcon from "@mui/icons-material/Undo";
import Box from "@mui/material/Box";
import { IconEye } from "@tabler/icons-react";
import { useRef, useState, useEffect } from "react";
import * as XLSX from "xlsx";
import DatePicker from "react-datepicker";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import "react-datepicker/dist/react-datepicker.css";
import "../assets/styles.css";
import Swal from "sweetalert2";
import AddCircle from "@mui/icons-material/AddCircle.js";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import Modal from "react-modal";
import { Link, json } from "react-router-dom";
import Nodata from "../components/Nodata";
import FilterListIcon from "@mui/icons-material/FilterList";

function NewLeads() {
  const [open, openchange] = useState(false);
  const [dataStatus, setDataStatus] = useState("Unassigned");
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(0);
  const [selectAllChecked, setSelectAllChecked] = useState(true);
  const [dayArray, setDayArray] = useState([]);
  const [year, setYear] = useState();
  const itemsPerPage = 500;
  const [openNew, openchangeNew] = useState(false);
  const [openEmp, openchangeEmp] = useState(false);
  const [openConf, openChangeConf] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [csvdata, setCsvData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState([]);
  const [openAssign, setOpenAssign] = useState(false);
  const fileInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [citySearch, setcitySearch] = useState("");
  const [selectedField, setSelectedField] = useState("Company Name");
  const [employeeSelection, setEmployeeSelection] = useState("Not Alloted");
  const [incoFilter, setIncoFilter] = useState("");

  //   fetching leads function
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const frontendKey = process.env.REACT_APP_FRONTEND_KEY;

  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(itemsPerPage);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${secretKey}/new-leads?startIndex=${startIndex}&endIndex=${endIndex}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  function formatDate(inputDate) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(inputDate).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  }
  const handlePageChange = (increment) => {
    const newStartIndex = Math.max(startIndex + increment, 0);
    const newEndIndex = Math.min(newStartIndex + itemsPerPage, data.length);
    setStartIndex(newStartIndex);
    setEndIndex(newEndIndex);
  };

  useEffect(() => {
    fetchData();
  }, [startIndex, endIndex]);
  // Swal.fire({title:'Unfortunately Your Brain has stopped working! Please try never ' , icon:'error'})
  return (
    <div>
      <Header />
      <Navbar />
      <div className="page-wrapper">
        <div className="page-header d-print-none">
          <div className="container-xl">
            {/* Header of Leads Page */}
            <div className="row g-2 align-items-center">
              <div
                style={{ display: "flex", justifyContent: "space-between" }}
                className="tit"
              >
                {/* <!-- Page pre-title --> */}
                <div className="headtit">
                  <h2 className="page-title">Leads</h2>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  className="feature2"
                >
                  <div
                    style={{ margin: "0px 10px", display: "none" }}
                    className="undoDelete"
                  >
                    <div className="btn-list">
                      <button className="btn btn-primary d-none d-sm-inline-block">
                        <UndoIcon />
                      </button>
                    </div>
                  </div>
                  <div style={{ margin: "0px 10px" }} className="addLeads">
                    <div className="btn-list">
                      <button className="btn btn-primary d-none d-sm-inline-block">
                        Delete Selection
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
                  <div style={{ margin: "0px 10px" }} className="addLeads">
                    <div className="btn-list">
                      <button className="btn btn-primary d-none d-sm-inline-block">
                        AssignLeads
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
                  <div style={{ margin: "0px 10px" }} className="addLeads">
                    <div className="btn-list">
                      <button className="btn btn-primary d-none d-sm-inline-block">
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
                        Add Leads
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
                  <div className="importCSV mr-1">
                    <div className="btn-list">
                      <button className="btn btn-primary d-none d-sm-inline-block">
                        {/* <!-- Download SVG icon from http://tabler-icons.io/i/plus --> */}
                        <svg
                          style={{
                            verticalAlign: "middle",
                          }}
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
                        Import CSV
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
                  <div>
                    <button className="btn btn-primary mr-1">
                      + Export CSV
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Filter Part */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              className="features"
            >
              <div
                style={{ display: "flex", justifyContent: "space-between" }}
                className="features"
              >
                <div style={{ display: "flex" }} className="feature1">
                  <div
                    className="form-control"
                    style={{ height: "fit-content", width: "15vw" }}
                  >
                    <select
                      style={{
                        border: "none",
                        outline: "none",
                        width: "fit-content",
                      }}
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
                      <option value="ename">Assigned To</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            {/* Table Body Part */}
            <div className="page-body">
              <div className="">
                <div class="card-header  my-tab">
                  <ul
                    class="nav nav-tabs card-header-tabs nav-fill p-0"
                    data-bs-toggle="tabs"
                  >
                    <li class="nav-item data-heading">
                      <a
                        href="#tabs-home-5"
                        className={
                          dataStatus === "Unassigned"
                            ? "nav-link active item-act"
                            : "nav-link"
                        }
                        data-bs-toggle="tab"
                        onClick={() => {
                          setDataStatus("Unassigned");
                        }}
                      >
                        UnAssigned
                        <span className="no_badge">{5}</span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a
                        href="#tabs-home-5"
                        className={
                          dataStatus === "Assigned"
                            ? "nav-link active item-act"
                            : "nav-link"
                        }
                        data-bs-toggle="tab"
                        onClick={() => {
                          setDataStatus("Assigned");
                        }}
                      >
                        Assigned
                        <span className="no_badge">{10}</span>
                      </a>
                    </li>
                  </ul>
                </div>
                {/* End of the Tab */}
                <div className="card">
                  <div className="card-body p-0">
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
                        }}
                        className="table-vcenter table-nowrap "
                      >
                        <thead>
                          <tr className="tr-sticky">
                            <th>
                              <input type="checkbox" />
                            </th>
                            <th>Sr.No</th>
                            <th>Company Name</th>
                            <th>Company Number</th>
                            <th>Company Email</th>
                            <th>Incorporation date</th>
                            <th>City</th>
                            <th>State</th>
                            <th>Status</th>
                            <th>Remarks</th>
                            <th>Alloted to</th>
                            <th>Assigned On</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        {data.length === 0 && (
                          <tbody>
                            <tr>
                              <td colSpan="13" className="p-2 particular">
                                <Nodata />
                              </td>
                            </tr>
                          </tbody>
                        )}
                        {data.length !== 0 &&
                          data.map((company, index) => (
                            <tbody className="table-tbody">
                              <tr
                                key={index}
                                style={{ border: "1px solid #ddd" }}
                              >
                                <td>
                                  <input type="checkbox" />
                                </td>
                                <td>{index + 1}</td>
                                <td>{company["Company Name"]}</td>
                                <td>{company["Company Number"]}</td>
                                <td>{company["Company Email"]}</td>
                                <td>
                                  {formatDate(
                                    company["Company Incorporation Date  "]
                                  )}
                                </td>
                                <td>{company["City"]}</td>
                                <td>{company["State"]}</td>
                                <td>{company["Status"]}</td>
                                <td>
                                  {company["Remarks"]}{" "}
                                  <IconEye
                                    style={{
                                      width: "18px",
                                      height: "18px",
                                      color: "#d6a10c",
                                      cursor: "pointer",
                                    }}
                                  />
                                </td>
                                <td>{company["ename"]}</td>
                                <td>{formatDate(company["AssignDate"])}</td>
                                <td>
                                  <IconButton>
                                    <DeleteIcon
                                      style={{
                                        width: "16px",
                                        height: "16px",
                                        color: "#bf0b0b",
                                      }}
                                    >
                                      Delete
                                    </DeleteIcon>
                                  </IconButton>
                                  <Link to={`/admin/leads/${company._id}`}>
                                    <IconButton>
                                      <IconEye
                                        style={{
                                          width: "18px",
                                          height: "18px",
                                          color: "#d6a10c",
                                          cursor: "pointer",
                                        }}
                                      />
                                    </IconButton>
                                  </Link>
                                </td>
                              </tr>
                            </tbody>
                          ))}
                      </table>
                    </div>
                  </div>
                  {/* --------------------Table Ends Here -------------------------------------------------------------------------- */}
                  {data.length !== 0 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "10px",
                      }}
                      className="pagination"
                    >
                      <IconButton
                        onClick={() => handlePageChange(-itemsPerPage)}
                        disabled={startIndex === 0}
                      >
                        <IconChevronLeft />
                      </IconButton>
                      // Other pagination buttons
                      <IconButton
                        onClick={() => handlePageChange(itemsPerPage)}
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
      </div>
    </div>
  );
}

export default NewLeads;
