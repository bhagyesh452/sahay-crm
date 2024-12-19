import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Header from "./Header";
import Navbar from "./Navbar";
import Stack from '@mui/material/Stack';
import Nodata from "../components/Nodata";
import { styled } from '@mui/material/styles';
import { Link } from "react-router-dom";
import { IconEye } from "@tabler/icons-react";
import Switch from '@mui/material/Switch';
import Swal from "sweetalert2";
import { TbRestore } from "react-icons/tb";
import ClipLoader from "react-spinners/ClipLoader";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { TiArrowBack } from "react-icons/ti";
import MaleEmployee from "../static/EmployeeImg/office-man.png";
import FemaleEmployee from "../static/EmployeeImg/woman.png";
import { FaWhatsapp } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import { BsFilter } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";
import EmployeeFilter from "./ExtraComponent/EmployeeFilter.jsx";

function DeletedEmployeePanel({ searchValue, deletedEmployee, setDeletedEmployee, setDeletedEmployeeDataCount, dataToFilterDeletedEmployee, completeDeletedEmployeeData, filteredDataDeletedEmployee, setFilteredDataDeletedEmployee, activeFilterFieldDeletedEmployee, setActiveFilterFieldDeletedEmployee, activeFilterFieldsDeletedEmployee, setActiveFilterFieldsDeletedEmployee, isLoading, refetchActive, refetchDeleted }) {

  // console.log("Search value from deleted employee is :", searchValue);

  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const adminName = localStorage.getItem("adminName");

  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [searchResult, setSearchResult] = useState([]);

  // Filter states for deleted employees
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [noOfAvailableData, setnoOfAvailableData] = useState(0);
  const [filterPosition, setFilterPosition] = useState({ top: 10, left: 5 });
  const fieldRefs = useRef({});
  const filterMenuRef = useRef(null); // Ref for the filter menu container

  const isActiveField = (field) => activeFilterFieldsDeletedEmployee.includes(field);

  const handleFilter = (newData) => {
    // console.log("newData", newData);
    setFilteredDataDeletedEmployee(newData);
    setDeletedEmployee(newData);
    setDeletedEmployeeDataCount(newData.length);
  };

  const handleFilterClick = (field) => {
    if (activeFilterFieldDeletedEmployee === field) {
      setShowFilterMenu(!showFilterMenu);
      setIsScrollLocked(!showFilterMenu);
    } else {
      setActiveFilterFieldDeletedEmployee(field);
      setShowFilterMenu(true);
      setIsScrollLocked(true);
      const rect = fieldRefs.current[field].getBoundingClientRect();
      setFilterPosition({ top: rect.bottom, left: rect.left });
    }
  };

  // Close filter menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setShowFilterMenu(false); // Close the filter menu
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const formattedDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const calculateProbationStatus = (joiningDate) => {
    const joinDate = new Date(joiningDate);
    const probationEndDate = new Date(joinDate);
    probationEndDate.setMonth(joinDate.getMonth() + 3);

    const currentDate = new Date();
    return currentDate <= probationEndDate ? 'Under Probation' : 'Completed';
  };

  const getBadgeClass = (status) => {
    return status === 'Under Probation' ? 'badge badge-under-probation' : 'badge badge-completed';
  };

  //-----------date formats-----------------------
  function formatDateFinal(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function formatDate(inputDate) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(inputDate).toLocaleDateString("en-US", options);
    return formattedDate;
  }

  //--------------------fetching employee data----------------

  // Old code handle search :
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter the data based on the search query (case-insensitive partial match)
    const filtered = data.filter((item) =>
      item.email.toLowerCase().includes(query.toLowerCase()) ||
      item.ename.toLowerCase().includes(query.toLowerCase()) ||
      item.number.includes(query) ||
      item.branchOffice.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // ----------------------------------------- material ui bdm work switch---------------------------------------
  const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
      '& .MuiSwitch-thumb': {
        width: 15,
      },
      '& .MuiSwitch-switchBase.Mui-checked': {
        transform: 'translateX(9px)',
      },
    },
    '& .MuiSwitch-switchBase': {
      padding: 2,
      '&.Mui-checked': {
        transform: 'translateX(12px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: theme.transitions.create(['width'], {
        duration: 200,
      }),
    },
    '& .MuiSwitch-track': {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor:
        theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
      boxSizing: 'border-box',
    },
  }));

  //--------------function to revertback employee to main database---------------------
  // const handleRevertBackEmployee = async (itemId, name, dataToRevertBack) => {
  //   Swal.fire({
  //     title: `Are you sure you want to restore back ${name}?`,
  //     text: "This action will move the employee back.",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, revert back!',
  //     cancelButtonText: 'Cancel'
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       try {
  //         const response = await axios.delete(`${secretKey}/employee/deleteemployeedromdeletedemployeedetails/${itemId}`);

  //         const response2 = await axios.put(`${secretKey}/employee/revertbackdeletedemployeeintomaindatabase`, {
  //           dataToRevertBack
  //         });

  //         Swal.fire('Reverted!',`Employee ${name} has been reverted back.`,'success');
  //         // fetchData();
  //         refetchActive();
  //         refetchDeleted();
  //       } catch (error) {
  //         Swal.fire('Error!','There was an error reverting the employee back.','error');
  //         console.error('Error reverting employee', error);
  //       }
  //     }
  //   });
  // }

  const handleRevertBackEmployee = async (itemId, name, dataToRevertBack) => {
    Swal.fire({
      title: `Are you sure you want to restore back ${name}?`,
      text: "This action will move the employee back.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, revert back!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.put(
            `${secretKey}/employee/revertbackdeletedemployeeintomaindatabase`,
            { dataToRevertBack, itemId }
          );
  
          Swal.fire(
            "Reverted!",
            `Employee ${name} has been reverted back.`,
            "success"
          );
          refetchActive();
          refetchDeleted();
        } catch (error) {
          Swal.fire(
            "Error!",
            "There was an error reverting the employee back.",
            "error"
          );
          console.error("Error reverting employee", error);
        }
      }
    });
  };
  

  //------------------function to delete employee -------------------------
  const handlePermanentDeleteEmployee = async (itemId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to permanently delete this employee? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.patch(`${secretKey}/employee/permanentDelete/${itemId}`, {
            deletingPerson: adminName // Sending the deleting person in the request body
          });
          Swal.fire('Deleted!', 'success');
          // fetchData();
          refetchActive();
          refetchDeleted();
        } catch (error) {
          console.error('Error deleting employee', error);
          Swal.fire({
            title: "Error",
            text: "There was an error deleting the employee. Please try again.",
            icon: "error",
          });
        }
      }
    })
  };



  return (
    <div>
      <div className="table table-responsive table-style-3 m-0">
        <table className="table table-vcenter table-nowrap">
          <thead>
            <tr className="tr-sticky">
              <th>Sr. No</th>

              <th>
                <div className='d-flex align-items-center justify-content-center position-relative'>
                  <div ref={el => fieldRefs.current['ename'] = el}>
                    Name
                  </div>

                  <div className='RM_filter_icon'>
                    {isActiveField('ename') ? (
                      <FaFilter onClick={() => handleFilterClick("ename")} />
                    ) : (
                      <BsFilter onClick={() => handleFilterClick("ename")} />
                    )}
                  </div>

                  {/* ---------------------filter component--------------------------- */}
                  {showFilterMenu && activeFilterFieldDeletedEmployee === 'ename' && (
                    <div
                      ref={filterMenuRef}
                      className="filter-menu"
                      style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                    >
                      <EmployeeFilter
                        noofItems={setnoOfAvailableData}
                        allFilterFields={setActiveFilterFieldsDeletedEmployee}
                        filteredData={filteredDataDeletedEmployee}
                        filterField={activeFilterFieldDeletedEmployee}
                        onFilter={handleFilter}
                        completeData={completeDeletedEmployeeData}
                        showingMenu={setShowFilterMenu}
                        dataForFilter={dataToFilterDeletedEmployee}
                      />
                    </div>
                  )}
                </div>
              </th>

              <th>
                <div className='d-flex align-items-center justify-content-center position-relative'>
                  <div ref={el => fieldRefs.current['number'] = el}>
                    Phone No
                  </div>

                  <div className='RM_filter_icon'>
                    {isActiveField('number') ? (
                      <FaFilter onClick={() => handleFilterClick("number")} />
                    ) : (
                      <BsFilter onClick={() => handleFilterClick("number")} />
                    )}
                  </div>

                  {/* ---------------------filter component--------------------------- */}
                  {showFilterMenu && activeFilterFieldDeletedEmployee === 'number' && (
                    <div
                      ref={filterMenuRef}
                      className="filter-menu"
                      style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                    >
                      <EmployeeFilter
                        noofItems={setnoOfAvailableData}
                        allFilterFields={setActiveFilterFieldsDeletedEmployee}
                        filteredData={filteredDataDeletedEmployee}
                        filterField={activeFilterFieldDeletedEmployee}
                        onFilter={handleFilter}
                        completeData={completeDeletedEmployeeData}
                        showingMenu={setShowFilterMenu}
                        dataForFilter={dataToFilterDeletedEmployee}
                      />
                    </div>
                  )}
                </div>
              </th>

              <th>
                <div className='d-flex align-items-center justify-content-center position-relative'>
                  <div ref={el => fieldRefs.current['email'] = el}>
                    Email
                  </div>

                  <div className='RM_filter_icon'>
                    {isActiveField('email') ? (
                      <FaFilter onClick={() => handleFilterClick("email")} />
                    ) : (
                      <BsFilter onClick={() => handleFilterClick("email")} />
                    )}
                  </div>

                  {/* ---------------------filter component--------------------------- */}
                  {showFilterMenu && activeFilterFieldDeletedEmployee === 'email' && (
                    <div
                      ref={filterMenuRef}
                      className="filter-menu"
                      style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                    >
                      <EmployeeFilter
                        noofItems={setnoOfAvailableData}
                        allFilterFields={setActiveFilterFieldsDeletedEmployee}
                        filteredData={filteredDataDeletedEmployee}
                        filterField={activeFilterFieldDeletedEmployee}
                        onFilter={handleFilter}
                        completeData={completeDeletedEmployeeData}
                        showingMenu={setShowFilterMenu}
                        dataForFilter={dataToFilterDeletedEmployee}
                      />
                    </div>
                  )}
                </div>
              </th>

              <th>
                <div className='d-flex align-items-center justify-content-center position-relative'>
                  <div ref={el => fieldRefs.current['newDesignation'] = el}>
                    Designation
                  </div>

                  <div className='RM_filter_icon'>
                    {isActiveField('newDesignation') ? (
                      <FaFilter onClick={() => handleFilterClick("newDesignation")} />
                    ) : (
                      <BsFilter onClick={() => handleFilterClick("newDesignation")} />
                    )}
                  </div>

                  {/* ---------------------filter component--------------------------- */}
                  {showFilterMenu && activeFilterFieldDeletedEmployee === 'newDesignation' && (
                    <div
                      ref={filterMenuRef}
                      className="filter-menu"
                      style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                    >
                      <EmployeeFilter
                        noofItems={setnoOfAvailableData}
                        allFilterFields={setActiveFilterFieldsDeletedEmployee}
                        filteredData={filteredDataDeletedEmployee}
                        filterField={activeFilterFieldDeletedEmployee}
                        onFilter={handleFilter}
                        completeData={completeDeletedEmployeeData}
                        showingMenu={setShowFilterMenu}
                        dataForFilter={dataToFilterDeletedEmployee}
                      />
                    </div>
                  )}
                </div>
              </th>

              <th>
                <div className='d-flex align-items-center justify-content-center position-relative'>
                  <div ref={el => fieldRefs.current['branchOffice'] = el}>
                    Branch
                  </div>

                  <div className='RM_filter_icon'>
                    {isActiveField('branchOffice') ? (
                      <FaFilter onClick={() => handleFilterClick("branchOffice")} />
                    ) : (
                      <BsFilter onClick={() => handleFilterClick("branchOffice")} />
                    )}
                  </div>

                  {/* ---------------------filter component--------------------------- */}
                  {showFilterMenu && activeFilterFieldDeletedEmployee === 'branchOffice' && (
                    <div
                      ref={filterMenuRef}
                      className="filter-menu"
                      style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                    >
                      <EmployeeFilter
                        noofItems={setnoOfAvailableData}
                        allFilterFields={setActiveFilterFieldsDeletedEmployee}
                        filteredData={filteredDataDeletedEmployee}
                        filterField={activeFilterFieldDeletedEmployee}
                        onFilter={handleFilter}
                        completeData={completeDeletedEmployeeData}
                        showingMenu={setShowFilterMenu}
                        dataForFilter={dataToFilterDeletedEmployee}
                      />
                    </div>
                  )}
                </div>
              </th>

              <th>
                <div className='d-flex align-items-center justify-content-center position-relative'>
                  <div ref={el => fieldRefs.current['jdate'] = el}>
                    Joining Date
                  </div>

                  <div className='RM_filter_icon'>
                    {isActiveField('jdate') ? (
                      <FaFilter onClick={() => handleFilterClick("jdate")} />
                    ) : (
                      <BsFilter onClick={() => handleFilterClick("jdate")} />
                    )}
                  </div>

                  {/* ---------------------filter component--------------------------- */}
                  {showFilterMenu && activeFilterFieldDeletedEmployee === 'jdate' && (
                    <div
                      ref={filterMenuRef}
                      className="filter-menu"
                      style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                    >
                      <EmployeeFilter
                        noofItems={setnoOfAvailableData}
                        allFilterFields={setActiveFilterFieldsDeletedEmployee}
                        filteredData={filteredDataDeletedEmployee}
                        filterField={activeFilterFieldDeletedEmployee}
                        onFilter={handleFilter}
                        completeData={completeDeletedEmployeeData}
                        showingMenu={setShowFilterMenu}
                        dataForFilter={dataToFilterDeletedEmployee}
                      />
                    </div>
                  )}
                </div>
              </th>

              {(adminName === "Nimesh" || adminName === "Ronak Kumar" || adminName === "Aakash" || adminName === "shivangi" || adminName === "Karan"||  adminName === "Pratik") &&
                <>
                  {/* <th>Probation Status</th> */}
                  <th>
                    <div className='d-flex align-items-center justify-content-center position-relative'>
                      <div ref={el => fieldRefs.current['AddedOn'] = el}>
                        Added Date
                      </div>

                      <div className='RM_filter_icon'>
                        {isActiveField('AddedOn') ? (
                          <FaFilter onClick={() => handleFilterClick("AddedOn")} />
                        ) : (
                          <BsFilter onClick={() => handleFilterClick("AddedOn")} />
                        )}
                      </div>

                      {/* ---------------------filter component--------------------------- */}
                      {showFilterMenu && activeFilterFieldDeletedEmployee === 'AddedOn' && (
                        <div
                          ref={filterMenuRef}
                          className="filter-menu"
                          style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                        >
                          <EmployeeFilter
                            noofItems={setnoOfAvailableData}
                            allFilterFields={setActiveFilterFieldsDeletedEmployee}
                            filteredData={filteredDataDeletedEmployee}
                            filterField={activeFilterFieldDeletedEmployee}
                            onFilter={handleFilter}
                            completeData={completeDeletedEmployeeData}
                            showingMenu={setShowFilterMenu}
                            dataForFilter={dataToFilterDeletedEmployee}
                          />
                        </div>
                      )}
                    </div>
                  </th>

                  <th>
                    <div className='d-flex align-items-center justify-content-center position-relative'>
                      <div ref={el => fieldRefs.current['deletedDate'] = el}>
                        Deleted Date
                      </div>

                      <div className='RM_filter_icon'>
                        {isActiveField('deletedDate') ? (
                          <FaFilter onClick={() => handleFilterClick("deletedDate")} />
                        ) : (
                          <BsFilter onClick={() => handleFilterClick("deletedDate")} />
                        )}
                      </div>

                      {/* ---------------------filter component--------------------------- */}
                      {showFilterMenu && activeFilterFieldDeletedEmployee === 'deletedDate' && (
                        <div
                          ref={filterMenuRef}
                          className="filter-menu"
                          style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                        >
                          <EmployeeFilter
                            noofItems={setnoOfAvailableData}
                            allFilterFields={setActiveFilterFieldsDeletedEmployee}
                            filteredData={filteredDataDeletedEmployee}
                            filterField={activeFilterFieldDeletedEmployee}
                            onFilter={handleFilter}
                            completeData={completeDeletedEmployeeData}
                            showingMenu={setShowFilterMenu}
                            dataForFilter={dataToFilterDeletedEmployee}
                          />
                        </div>
                      )}
                    </div>
                  </th>

                  {/* <th>BDM Work</th> */}

                  <th>Action</th>

                  <th>Revoke Employee</th>
                </>
              }
            </tr>
          </thead>

          {isLoading ? (
            <tbody>
              <tr>
                <td colSpan="11">
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
          ) : (
            <>
              {deletedEmployee.length !== 0 ? (
                <tbody>
                  {deletedEmployee.map((item, index) => {
                    const profilePhotoUrl = item.profilePhoto?.length !== 0
                      ? `${secretKey}/employee/fetchProfilePhoto/${item._id}/${item.profilePhoto?.[0]?.filename}`
                      : item.gender === "Male" ? MaleEmployee : FemaleEmployee;

                    return (
                      <tr key={index}>
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
                        <td>{item.email || ""}</td>
                        <td>
                          {item.newDesignation === "Business Development Executive" ? "BDE"
                            : item.newDesignation === "Business Development Manager" ? "BDM"
                              : item.newDesignation || ""}
                        </td>
                        <td>{item.branchOffice || ""}</td>
                        <td>{formattedDate(item.jdate) || ""}</td>
                        {/* <td>
                          <span className={getBadgeClass(calculateProbationStatus(item.jdate))}>
                            {calculateProbationStatus(item.jdate)}
                          </span>
                        </td> */}
                        {(adminName === "Nimesh" || adminName === "Ronak Kumar" || adminName === "Aakash" || adminName === "shivangi" || adminName === "Karan"|| adminName === "Pratik") &&
                          <>
                            <td>
                              {formattedDate(item.AddedOn) === "Invalid Date"
                                ? "06/02/2024"
                                : formattedDate(item.AddedOn)}
                            </td>
                            <td>{formattedDate(item.deletedDate)}</td>
                            {/* <td>
                              <Stack direction="row" spacing={10} alignItems="center" justifyContent="center">
                                <AntSwitch checked={item.bdmWork} inputProps={{ 'aria-label': 'ant design' }}
                                // onClick={(event) => {
                                //   handlChecked(item._id, item.bdmWork)
                                // }} 
                                />
                              </Stack>
                            </td> */}


                            {/* <td>₹ {formatSalary(item.salary || 0)}</td> */}
                            <td>
                              <button className="action-btn action-btn-primary">
                                <Link
                                  style={{ textDecoration: "none", color: 'inherit' }}
                                  to={`/md/deletedEmployeeProfileView/${item._id}`}
                                >
                                  <FaRegEye />
                                </Link>
                              </button>

                              <button
                                className="action-btn action-btn-danger ml-1"
                                onClick={() => handlePermanentDeleteEmployee(item._id)}
                              >
                                <AiFillDelete />
                              </button>
                            </td>
                            <td>
                              <button
                                className="action-btn action-btn-success ml-1"
                                onClick={() => {
                                  const dataToRevertBack = deletedEmployee.filter(obj => obj._id === item._id);
                                  console.log("Deleted employee data is :", dataToRevertBack);
                                  handleRevertBackEmployee(item._id, item.ename, dataToRevertBack);
                                }}
                              >
                                <TbRestore />
                              </button>
                            </td>
                          </>
                        }
                      </tr>
                    );
                  })}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td
                      className="particular"
                      colSpan="13"
                      style={{ textAlign: "center" }}
                    >
                      <Nodata />
                    </td>
                  </tr>
                </tbody>
              )}
            </>
          )}
        </table>
      </div>


      {/* Deleted employees old code */}
      <div className="d-none">
        <div className="">
          <div className="page-header d-print-none m-0">
            <div className="row g-2 align-items-center">
              <div className="col m-0">
                {/* <!-- Page pre-title --> */}
                <h2 className="page-title">Employees</h2>
              </div>
              <div style={{ width: "20vw" }} className="input-icon">
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
            </div>
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
                        <button
                          //onClick={sortDataByName}
                          className="table-sort"
                          data-sort="sort-city"
                        >
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
                        <button
                          //onClick={sortDataByJoiningDate}
                          className="table-sort"
                          data-sort="sort-date"
                        >
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
                      {(adminName === "Nimesh" || adminName === "Ronak Kumar" || adminName === "Aakash" || adminName === "shivangi" || adminName === "Karan"|| adminName === "Pratik") && <> <th>
                        <button
                          //onClick={sortDateByAddedOn}
                          className="table-sort"
                          data-sort="sort-date"
                        >
                          Added on
                        </button>
                      </th>
                        <th>Deleted Date</th>
                        <th>
                          BDM Work
                        </th>
                        <th>
                          <button
                            className="table-sort"
                            data-sort="sort-quantity"
                          >
                            Action
                          </button>
                        </th>
                        <th>Revoke Employee</th></>}
                    </tr>
                  </thead>
                  {filteredData.length == 0 ? (
                    <tbody>
                      <tr>
                        <td
                          className="particular"
                          colSpan="13"
                          style={{ textAlign: "center" }}
                        >
                          <Nodata />
                        </td>
                      </tr>
                    </tbody>
                  ) : (
                    <tbody className="table-tbody">
                      {filteredData.map((item, index) => (
                        <tr key={index} style={{ border: "1px solid #ddd" }}>
                          <td className="td-sticky">{index + 1}</td>
                          <td>{item.ename}</td>
                          <td>{item.number}</td>
                          <td>{item.email}</td>
                          <td>{formatDateFinal(item.jdate)}</td>
                          <td>{item.designation}</td>
                          <td>{item.branchOffice}</td>
                          {(adminName === "Nimesh" || adminName === "Ronak Kumar" || adminName === "Aakash" || adminName === "shivangi" || adminName === "Karan"||  adminName === "Pratik") &&
                            <>
                              <td>
                                {formatDate(item.AddedOn) === "Invalid Date"
                                  ? "06/02/2024"
                                  : formatDateFinal(item.AddedOn)}
                              </td>
                              <td>{formatDateFinal(item.deletedDate)}</td>
                              <td>
                                <Stack direction="row" spacing={10} alignItems="center" justifyContent="center">
                                  <AntSwitch checked={item.bdmWork} inputProps={{ 'aria-label': 'ant design' }}
                                  // onClick={(event) => {
                                  //   handlChecked(item._id, item.bdmWork)
                                  // }} 
                                  />
                                </Stack>
                              </td>
                              <td>
                                <div className="d-flex justify-content-center align-items-center">
                                  <div className="icons-btn">
                                    <Link
                                      style={{ color: "black" }}
                                      to={`/md/employees/${item._id}`}
                                    >
                                      <IconButton>
                                        {" "}
                                        <IconEye
                                          style={{
                                            width: "14px",
                                            height: "14px",
                                            color: "#d6a10c",
                                          }}
                                        />
                                      </IconButton>
                                    </Link>
                                    <IconButton>
                                      {" "}
                                      <DeleteIcon
                                        style={{
                                          width: "14px",
                                          height: "14px",
                                          color: "red",
                                        }}
                                        onClick={async () => {
                                          handlePermanentDeleteEmployee(item._id)
                                        }
                                        }
                                      />
                                    </IconButton>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <IconButton>
                                  {" "}
                                  <TbRestore
                                    style={{
                                      width: "14px",
                                      height: "14px",
                                      color: "#fbb900",
                                    }}
                                    onClick={async () => {
                                      const dataToRevertBack = filteredData.filter(obj => obj._id === item._id);
                                      handleRevertBackEmployee(item._id, item.ename, dataToRevertBack);
                                    }}
                                  />
                                </IconButton>
                              </td></>}
                        </tr>
                      ))}
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default DeletedEmployeePanel