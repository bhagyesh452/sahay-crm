import React, { useState, useEffect, useRef } from "react";
import Nodata from "../../components/Nodata";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { IoFilterOutline } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaWhatsapp } from "react-icons/fa";
import { TbRestore } from "react-icons/tb";
import { BsFilter } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";
import EmployeeFilter from "../../admin/ExtraComponent/EmployeeFilter";
import EmpDfaullt from "../../static/EmployeeImg/office-man.png";
import FemaleEmployee from "../../static/EmployeeImg/woman.png";
import { useQuery } from "@tanstack/react-query";
import UpcomingEmployees from "./UpcomingEmployees";
import DialogAddRecentEmployee from "./Extra Components/DialogAddRecentEmployee";

function HrEmployees() {

  useEffect(() => {
    document.title = `HR-Sahay-CRM`;
  }, []);

  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const userId = localStorage.getItem("hrUserId");
  const navigate = useNavigate();

  const [myInfo, setMyInfo] = useState([]);
  const [upcomingEmployees, setUpcomingEmployees] = useState([]);

  // const [isLoading, setIsLoading] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [employeeDataCount, setEmployeeDataCount] = useState(0);
  const [completeEmployeeData, setCompleteEmployeeData] = useState([]);
  const [dataToFilterEmployee, setDataToFilterEmployee] = useState([]);
  const [filteredDataEmployee, setFilteredDataEmployee] = useState([]);
  const [activeFilterFieldsEmployee, setActiveFilterFieldsEmployee] = useState([]);
  const [activeFilterFieldEmployee, setActiveFilterFieldEmployee] = useState(null);

  const [deletedEmployee, setDeletedEmployee] = useState([]);
  const [deletedEmployeeDataCount, setDeletedEmployeeDataCount] = useState(0);
  const [completeDeletedEmployeeData, setCompleteDeletedEmployeeData] = useState([]);
  const [dataToFilterDeletedEmployee, setDataToFilterDeletedEmployee] = useState([]);
  const [filteredDataDeletedEmployee, setFilteredDataDeletedEmployee] = useState([]);
  const [activeFilterFieldsDeletedEmployee, setActiveFilterFieldsDeletedEmployee] = useState([]);
  const [activeFilterFieldDeletedEmployee, setActiveFilterFieldDeletedEmployee] = useState(null);

  const [deletedData, setDeletedData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [recruiterData, setRecruiterData] = useState([]);
  const [page, setPage] = useState(1);
  const [currentDataLoading, setCurrentDataLoading] = useState(false);
  const [openRecruiterWindow, setOpenRecruiterWindow] = useState(false);
  const [hrData, sethrData] = useState([]);
  const [openRecentEmployee, setOpenRecentEmployee] = useState(false);

  // Filter states for employees tab
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [noOfAvailableData, setnoOfAvailableData] = useState(0);
  const [filterPosition, setFilterPosition] = useState({ top: 10, left: 5 });
  const fieldRefs = useRef({});
  const filterMenuRef = useRef(null);

  const isActiveField = (field) => activeFilterFieldsEmployee.includes(field);

  const handleFilter = (newData) => {
    // console.log("newData", newData);
    setFilteredDataEmployee(newData);
    setEmployee(newData);
    setEmployeeDataCount(newData.length);
  };

  const handleFilterClick = (field) => {
    if (activeFilterFieldEmployee === field) {
      setShowFilterMenu(!showFilterMenu);
      setIsScrollLocked(!showFilterMenu);
    } else {
      setActiveFilterFieldEmployee(field);
      setShowFilterMenu(true);
      setIsScrollLocked(true);
      const rect = fieldRefs.current[field].getBoundingClientRect();
      setFilterPosition({ top: rect.bottom, left: rect.left });
    }
  };

  // Close filter menu when clicking outside in employees tab
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

  // Filter states for deleted employees tab
  const [showDeletedEmployeeFilterMenu, setShowDeletedEmployeeFilterMenu] = useState(false);
  const [isDeletedEmployeeScrollLocked, setIsDeletedEmployeeScrollLocked] = useState(false);
  const [noOfAvailableDataForDeletedEmployee, setnoOfAvailableDataForDeletedEmployee] = useState(0);
  const [deletedEmployeefilterPosition, setDeletedEmployeeFilterPosition] = useState({ top: 10, left: 5 });
  const deletedEmployeeFieldRefs = useRef({});
  const deletedEmployeeFilterMenuRef = useRef(null);

  const isDeletedEmployeeActiveField = (field) => activeFilterFieldsDeletedEmployee.includes(field);

  const handleDeletedEmployeeFilter = (newData) => {
    // console.log("newData", newData);
    setFilteredDataDeletedEmployee(newData);
    setDeletedEmployee(newData);
    setDeletedEmployeeDataCount(newData.length);
  };

  const handleDeletedEmployeeFilterClick = (field) => {
    if (activeFilterFieldDeletedEmployee === field) {
      setShowDeletedEmployeeFilterMenu(!showDeletedEmployeeFilterMenu);
      setIsDeletedEmployeeScrollLocked(!showDeletedEmployeeFilterMenu);
    } else {
      setActiveFilterFieldDeletedEmployee(field);
      setShowDeletedEmployeeFilterMenu(true);
      setIsDeletedEmployeeScrollLocked(true);
      const rect = deletedEmployeeFieldRefs.current[field].getBoundingClientRect();
      setDeletedEmployeeFilterPosition({ top: rect.bottom, left: rect.left });
    }
  };

  // Close filter menu when clicking outside in deleted employees tab
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (deletedEmployeeFilterMenuRef.current && !deletedEmployeeFilterMenuRef.current.contains(event.target)) {
        setShowDeletedEmployeeFilterMenu(false); // Close the filter menu
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleAddEmployee = () => {
    navigate("/hr/add/employee");
  };

  const handleAddRecentEmployee = () => {
    setOpenRecentEmployee(true)
  }

  const formatSalary = (amount) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  const formatDate = (dateString) => {
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

  const handleEditClick = (empId) => {
    navigate(`/hr/edit/employee/${empId}`);
  };

  const handleView = (id) => {
    navigate(`hr-employee-profile-details/${id}`);
  }

  const fetchCompanyData = async () => {
    try {
      const res = await axios.get(`${secretKey}/company-data/leads`);
      // console.log("Company data is :", res.data);
      setCompanyData(res.data);
    } catch (error) {
      console.log("Error fetching data:", error.message);
    }
  };

  // const fetchEmployee = async () => {
  //     try {
  //       let res;
  //         res = await axios.get(`${secretKey}/employee/fetchEmployeeFromId/${userId}`);
  //         sethrData(res.data.data)
  //     } catch (error) {
  //       console.log("Error fetching employees data:", error);
  //     } 
  // };

  const fetchRecruiterData = async (searchQuery = "", page = 1) => {
    try {
      setCurrentDataLoading(true);
      const response = await axios.get(`${secretKey}/recruiter/recruiter-data-dashboard`);
      const {
        data,
      } = response.data;


      // If it's a search query, replace the data; otherwise, append for pagination
      if (page === 1) {
        // This is either the first page load or a search operation
        setRecruiterData(data);
      } else {
        // This is a pagination request
        setRecruiterData(prevData => [...prevData, ...data]);
      }
    } catch (error) {
      console.error("Error fetching data", error.message);
    } finally {
      setCurrentDataLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiterData("", page); // Fetch data initially
  }, []);

  // Fetch active employees
  const { data: activeData, isLoading: isLoadingActive, isError: isErrorActive, refetch: refetchActive } = useQuery({
    queryKey: ["activeEmployees"],
    queryFn: () => axios.get(`${secretKey}/employee/einfo`),
    staleTime: 5 * 60 * 1000, // Optional: Cache data for 5 minutes to avoid unnecessary requests
    refetchInterval: 60 * 1000,  // Refetch every 1 minute
  });

  // Active employees filtering and setting
  useEffect(() => {
    if (activeData?.data) {
      const allEmployees = activeData.data;

      if (searchValue) {
        const filteredEmployees = allEmployees.filter((emp) => {
          let designation = emp.newDesignation?.toLowerCase();
          if (designation === "business development executive") {
            designation = "bde";
          } else if (designation === "business development manager") {
            designation = "bdm";
          }
          return (
            emp.ename?.toLowerCase().includes(searchValue) ||
            emp.number?.toString().includes(searchValue) ||
            emp.email?.toLowerCase().includes(searchValue) ||
            emp.department?.toLowerCase().includes(searchValue) ||
            designation.includes(searchValue) ||
            emp.branchOffice?.toLowerCase().includes(searchValue)
          );
        });
        setEmployee(filteredEmployees);
        setEmployeeDataCount(filteredEmployees.length);
        setCompleteEmployeeData(filteredEmployees);
        setDataToFilterEmployee(filteredEmployees);
      } else {
        setEmployee(allEmployees); // Show all employees if no search value
        setEmployeeDataCount(allEmployees.length);
        setCompleteEmployeeData(allEmployees);
        setDataToFilterEmployee(allEmployees);
      }
    }
  }, [activeData?.data, searchValue]);

  // Fetch deleted employees
  const { data: deletedEmployeeData, isLoading: isLoadingDeleted, isError: isErrorDeleted, refetch: refetchDeleted } = useQuery({
    queryKey: ["deletedEmployees"],
    queryFn: () => axios.get(`${secretKey}/employee/deletedemployeeinfo`), // Assuming this is your endpoint for deleted employees
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    refetchInterval: 60 * 1000,  // Refetch every 1 minute
  });

  // Deleted employees filtering and setting
  useEffect(() => {
    if (deletedEmployeeData?.data) {
      const allDeletedEmployees = deletedEmployeeData.data;

      if (searchValue) {
        const filteredDeletedEmployees = allDeletedEmployees.filter((emp) => {
          let designation = emp.newDesignation?.toLowerCase();
          if (designation === "business development executive") {
            designation = "bde";
          } else if (designation === "business development manager") {
            designation = "bdm";
          }
          return (
            emp.ename?.toLowerCase().includes(searchValue) ||
            emp.number?.toString().includes(searchValue) ||
            emp.email?.toLowerCase().includes(searchValue) ||
            emp.department?.toLowerCase().includes(searchValue) ||
            designation.includes(searchValue) ||
            emp.branchOffice?.toLowerCase().includes(searchValue)
          );
        });
        setDeletedEmployee(filteredDeletedEmployees); // Set filtered deleted employees
        setDeletedEmployeeDataCount(filteredDeletedEmployees.length);
        setCompleteDeletedEmployeeData(filteredDeletedEmployees);
        setDataToFilterDeletedEmployee(filteredDeletedEmployees);
      } else {
        setDeletedEmployee(allDeletedEmployees); // Show all deleted employees if no search value
        setDeletedEmployeeDataCount(allDeletedEmployees.length);
        setCompleteDeletedEmployeeData(allDeletedEmployees);
        setDataToFilterDeletedEmployee(allDeletedEmployees);
      }
    }
  }, [deletedEmployeeData?.data, searchValue]);

  const handledeletefromcompany = async (filteredCompanyData) => {
    if (filteredCompanyData && filteredCompanyData.length !== 0) {

      try {
        // Update companyData in the second database
        await Promise.all(
          filteredCompanyData.map(async (item) => {
            // if (item.Status === 'Matured') {
            if (item.Status === "Matured") {
              await axios.put(`${secretKey}/company-data/updateCompanyForDeletedEmployeeWithMaturedStatus/${item._id}`)
            } else {
              await axios.delete(`${secretKey}/company-data/newcompanynamedelete/${item._id}`);
            }
          })
        );
        Swal.fire({
          title: "Data Deleted!",
          text: "You have successfully Deleted the data!",
          icon: "success",
        });

        //console.log("All ename updates completed successfully");
      } catch (error) {
        console.log("Error updating enames:", error.message);
        Swal.fire("Error deleting the employee");
        // Handle the error as needed
      }
    }
  };

  const handleDeleteClick = (empId, ename, dataToDelete, filteredCompanyData) => {
    // console.log("Emp id is :", empId);
    setCompanyData(filteredCompanyData);
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log("Deleted data is :", dataToDelete);
        try {
          const saveDeletedResponse = await axios.put(`${secretKey}/employee/savedeletedemployee`, {
            dataToDelete
          });
          const deleteEmployeeResponse = await axios.delete(`${secretKey}/employee/einfo/${empId}`);

          const updateBdmStatusResponse = await axios.put(`${secretKey}/bookings/updateDeletedBdmStatus/${ename}`);
          handledeletefromcompany(filteredCompanyData);
          // fetchEmployee();
          // fetchDeletedEmployee();
          refetchActive();
          refetchDeleted();
          Swal.fire(
            'Deleted!',
            'Employee has been deleted.',
            'success'
          );
        } catch (error) {
          console.log("Error deleting employee:", error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please try again later!",
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Employee data is safe :)',
          'error'
        );
      }
    });
  };

  const handleRevertBack = async (itemId, name, dataToRevertBack) => {
    // console.log("Reverted employee is :", dataToRevertBack);
    Swal.fire({
      title: `Are you sure you want to restore back ${name}?`,
      text: "This action will move the employee back.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, revert back!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${secretKey}/employee/deleteemployeedromdeletedemployeedetails/${itemId}`);

          const response2 = await axios.put(`${secretKey}/employee/revertbackdeletedemployeeintomaindatabase`, {
            dataToRevertBack
          });
          // fetchDeletedEmployee();
          // fetchEmployee();
          refetchActive();
          refetchDeleted();
          // console.log("Deleted data is :", response.data);
          // console.log("Deleted data is :", response2.data);
          Swal.fire(
            'Reverted!',
            `Employee ${name} has been reverted back.`,
            'success'
          );
        } catch (error) {
          Swal.fire(
            'Error!',
            'There was an error reverting the employee back.',
            'error'
          );

          console.log('Error reverting employee', error);
        }
      }
    });
  };

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
            deletingPerson: myInfo.ename // Sending the deleting person in the request body
          });
          Swal.fire(
            'Deleted!',
            'success'
          );

          refetchActive();
          refetchDeleted();
        } catch (error) {
          console.log('Error deleting employee', error);
          Swal.fire({
            title: "Error",
            text: "There was an error deleting the employee. Please try again.",
            icon: "error",
          });
        }
      }
    })
  };

  useEffect(() => {
    // fetchEmployee();
    fetchCompanyData();
    // fetchDeletedEmployee();
  }, [searchValue]);

  const fetchPersonalInfo = async () => {
    try {
      const res = await axios.get(`${secretKey}/employee/fetchEmployeeFromId/${userId}`);
      // console.log("Fetched details is :", res.data.data);
      setMyInfo(res.data.data);
    } catch (error) {
      console.log("Error fetching employee details :", error);
    }
  };

  useEffect(() => {
    fetchPersonalInfo();
  }, []);

  return (
    <div>
      <div className="page-wrapper">

        <div className="page-header rm_Filter m-0">
          <div className="container-xl">
            <div className="d-flex  justify-content-between">
              <div className="d-flex w-100">
                <div className="d-flex align-items-center justify-content-between">
                  <div class="input-icon ml-1">
                    <span class="input-icon-addon">
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon mybtn" width="18" height="18" viewBox="0 0 22 22" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                        <path d="M21 21l-6 -6"></path>
                      </svg>
                    </span>
                    <input
                      className="form-control search-cantrol mybtn"
                      placeholder="Search…"
                      type="text"
                      name="bdeName-search"
                      id="bdeName-search"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value.toLowerCase())}
                    />
                  </div>
                </div>
                <div className="btn-group ml-1" role="group" aria-label="Basic example">
                  <button type="button" className="btn mybtn"  >
                    <IoFilterOutline className='mr-1' /> Filter
                  </button>
                </div>
              </div>
              <div>
                <DialogAddRecentEmployee
                  refetch={refetchActive} />
              </div>
              {/* <div>
                <button onClick={handleAddEmployee} className="btn btn-primary">+ Add Employee</button>
              </div> */}
            </div>
          </div>
        </div>

        <div className="page-body rm_Dtl_box m-0">
          <div className="container-xl mt-2">
            <div className="my-tab card-header">
              <ul class="nav nav-tabs hr_emply_list_navtabs nav-fill p-0">
                <li class="nav-item hr_emply_list_navitem">
                  <a class="nav-link active" data-bs-toggle="tab" href="#Employees">
                    <div className="d-flex align-items-center justify-content-between w-100">
                      <div className="rm_txt_tsn">
                        Employees
                      </div>
                      <div className="rm_tsn_bdge">
                        {/* {employee.length || 0} */}
                        {employeeDataCount || 0}
                      </div>
                    </div>
                  </a>
                </li>
                <li class="nav-item hr_emply_list_navitem">
                  <a class="nav-link " data-bs-toggle="tab" href="#DeletedEmployees">
                    <div className="d-flex align-items-center justify-content-between w-100">
                      <div className="rm_txt_tsn">
                        Deleted Employees
                      </div>
                      <div className="rm_tsn_bdge">
                        {deletedEmployeeDataCount || 0}
                      </div>
                    </div>
                  </a>
                </li>
                <li class="nav-item hr_emply_list_navitem">
                  <a class="nav-link " data-bs-toggle="tab" href="#UpcommingEmployees">
                    <div className="d-flex align-items-center justify-content-between w-100">
                      <div className="rm_txt_tsn">
                        Upcomming Employees
                      </div>
                      <div className="rm_tsn_bdge">
                        {recruiterData.filter((applicant) => {
                          return applicant.mainCategoryStatus === "Selected" && new Date(applicant.jdate) > new Date();
                        }).length}
                      </div>
                    </div>
                  </a>
                </li>
              </ul>
            </div>

            <div class="tab-content card-body">
              <div class="tab-pane active" id="Employees">
                <div className="RM-my-booking-lists">
                  <div className="table table-responsive table-style-3 m-0">
                    <table className="table table-vcenter table-nowrap">
                      <thead>
                        <tr className="tr-sticky">
                          <th>Sr. No</th>

                          <th>
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                              <div ref={el => fieldRefs.current['ename'] = el}>
                                Employee Name
                              </div>

                              <div className='RM_filter_icon'>
                                {isActiveField('ename') ? (
                                  <FaFilter onClick={() => handleFilterClick("ename")} />
                                ) : (
                                  <BsFilter onClick={() => handleFilterClick("ename")} />
                                )}
                              </div>

                              {/* ---------------------filter component--------------------------- */}
                              {showFilterMenu && activeFilterFieldEmployee === 'ename' && (
                                <div
                                  ref={filterMenuRef}
                                  className="filter-menu"
                                  style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                >
                                  <EmployeeFilter
                                    noofItems={setnoOfAvailableData}
                                    allFilterFields={setActiveFilterFieldsEmployee}
                                    filteredData={filteredDataEmployee}
                                    filterField={activeFilterFieldEmployee}
                                    onFilter={handleFilter}
                                    completeData={completeEmployeeData}
                                    showingMenu={setShowFilterMenu}
                                    dataForFilter={dataToFilterEmployee}
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
                              {showFilterMenu && activeFilterFieldEmployee === 'branchOffice' && (
                                <div
                                  ref={filterMenuRef}
                                  className="filter-menu"
                                  style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                >
                                  <EmployeeFilter
                                    noofItems={setnoOfAvailableData}
                                    allFilterFields={setActiveFilterFieldsEmployee}
                                    filteredData={filteredDataEmployee}
                                    filterField={activeFilterFieldEmployee}
                                    onFilter={handleFilter}
                                    completeData={completeEmployeeData}
                                    showingMenu={setShowFilterMenu}
                                    dataForFilter={dataToFilterEmployee}
                                  />
                                </div>
                              )}
                            </div>
                          </th>

                          <th>
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                              <div ref={el => fieldRefs.current['department'] = el}>
                                Department
                              </div>

                              <div className='RM_filter_icon'>
                                {isActiveField('department') ? (
                                  <FaFilter onClick={() => handleFilterClick("department")} />
                                ) : (
                                  <BsFilter onClick={() => handleFilterClick("department")} />
                                )}
                              </div>

                              {/* ---------------------filter component--------------------------- */}
                              {showFilterMenu && activeFilterFieldEmployee === 'department' && (
                                <div
                                  ref={filterMenuRef}
                                  className="filter-menu"
                                  style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                >
                                  <EmployeeFilter
                                    noofItems={setnoOfAvailableData}
                                    allFilterFields={setActiveFilterFieldsEmployee}
                                    filteredData={filteredDataEmployee}
                                    filterField={activeFilterFieldEmployee}
                                    onFilter={handleFilter}
                                    completeData={completeEmployeeData}
                                    showingMenu={setShowFilterMenu}
                                    dataForFilter={dataToFilterEmployee}
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
                              {showFilterMenu && activeFilterFieldEmployee === 'newDesignation' && (
                                <div
                                  ref={filterMenuRef}
                                  className="filter-menu"
                                  style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                >
                                  <EmployeeFilter
                                    noofItems={setnoOfAvailableData}
                                    allFilterFields={setActiveFilterFieldsEmployee}
                                    filteredData={filteredDataEmployee}
                                    filterField={activeFilterFieldEmployee}
                                    onFilter={handleFilter}
                                    completeData={completeEmployeeData}
                                    showingMenu={setShowFilterMenu}
                                    dataForFilter={dataToFilterEmployee}
                                  />
                                </div>
                              )}
                            </div>
                          </th>

                          <th>
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                              <div ref={el => fieldRefs.current['jdate'] = el}>
                                Date Of Joining
                              </div>

                              <div className='RM_filter_icon'>
                                {isActiveField('jdate') ? (
                                  <FaFilter onClick={() => handleFilterClick("jdate")} />
                                ) : (
                                  <BsFilter onClick={() => handleFilterClick("jdate")} />
                                )}
                              </div>

                              {/* ---------------------filter component--------------------------- */}
                              {showFilterMenu && activeFilterFieldEmployee === 'jdate' && (
                                <div
                                  ref={filterMenuRef}
                                  className="filter-menu"
                                  style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                >
                                  <EmployeeFilter
                                    noofItems={setnoOfAvailableData}
                                    allFilterFields={setActiveFilterFieldsEmployee}
                                    filteredData={filteredDataEmployee}
                                    filterField={activeFilterFieldEmployee}
                                    onFilter={handleFilter}
                                    completeData={completeEmployeeData}
                                    showingMenu={setShowFilterMenu}
                                    dataForFilter={dataToFilterEmployee}
                                  />
                                </div>
                              )}
                            </div>
                          </th>

                          <th>
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                              <div ref={el => fieldRefs.current['salary'] = el}>
                                Monthly Salary
                              </div>

                              <div className='RM_filter_icon'>
                                {isActiveField('salary') ? (
                                  <FaFilter onClick={() => handleFilterClick("salary")} />
                                ) : (
                                  <BsFilter onClick={() => handleFilterClick("salary")} />
                                )}
                              </div>

                              {/* ---------------------filter component--------------------------- */}
                              {showFilterMenu && activeFilterFieldEmployee === 'salary' && (
                                <div
                                  ref={filterMenuRef}
                                  className="filter-menu"
                                  style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                >
                                  <EmployeeFilter
                                    noofItems={setnoOfAvailableData}
                                    allFilterFields={setActiveFilterFieldsEmployee}
                                    filteredData={filteredDataEmployee}
                                    filterField={activeFilterFieldEmployee}
                                    onFilter={handleFilter}
                                    completeData={completeEmployeeData}
                                    showingMenu={setShowFilterMenu}
                                    dataForFilter={dataToFilterEmployee}
                                  />
                                </div>
                              )}
                            </div>
                          </th>
                          <th>Probation Status</th>

                          <th>
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                              <div ref={el => fieldRefs.current['number'] = el}>
                                Official Number
                              </div>

                              <div className='RM_filter_icon'>
                                {isActiveField('number') ? (
                                  <FaFilter onClick={() => handleFilterClick("number")} />
                                ) : (
                                  <BsFilter onClick={() => handleFilterClick("number")} />
                                )}
                              </div>

                              {/* ---------------------filter component--------------------------- */}
                              {showFilterMenu && activeFilterFieldEmployee === 'number' && (
                                <div
                                  ref={filterMenuRef}
                                  className="filter-menu"
                                  style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                >
                                  <EmployeeFilter
                                    noofItems={setnoOfAvailableData}
                                    allFilterFields={setActiveFilterFieldsEmployee}
                                    filteredData={filteredDataEmployee}
                                    filterField={activeFilterFieldEmployee}
                                    onFilter={handleFilter}
                                    completeData={completeEmployeeData}
                                    showingMenu={setShowFilterMenu}
                                    dataForFilter={dataToFilterEmployee}
                                  />
                                </div>
                              )}
                            </div>
                          </th>

                          <th>
                            <div className='d-flex align-items-center justify-content-center position-relative'>
                              <div ref={el => fieldRefs.current['email'] = el}>
                                Official Email ID
                              </div>

                              <div className='RM_filter_icon'>
                                {isActiveField('email') ? (
                                  <FaFilter onClick={() => handleFilterClick("email")} />
                                ) : (
                                  <BsFilter onClick={() => handleFilterClick("email")} />
                                )}
                              </div>

                              {/* ---------------------filter component--------------------------- */}
                              {showFilterMenu && activeFilterFieldEmployee === 'email' && (
                                <div
                                  ref={filterMenuRef}
                                  className="filter-menu"
                                  style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
                                >
                                  <EmployeeFilter
                                    noofItems={setnoOfAvailableData}
                                    allFilterFields={setActiveFilterFieldsEmployee}
                                    filteredData={filteredDataEmployee}
                                    filterField={activeFilterFieldEmployee}
                                    onFilter={handleFilter}
                                    completeData={completeEmployeeData}
                                    showingMenu={setShowFilterMenu}
                                    dataForFilter={dataToFilterEmployee}
                                  />
                                </div>
                              )}
                            </div>
                          </th>

                          <th>Action</th>
                        </tr>
                      </thead>

                      {isLoadingActive ? (
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
                          {employee.length !== 0 ? (
                            <tbody>
                              {employee.map((emp, index) => {
                                const profilePhotoUrl = emp.profilePhoto?.length !== 0
                                  ? `${secretKey}/employee/fetchProfilePhoto/${emp._id}/${emp.profilePhoto?.[0]?.filename}`
                                  : emp.gender === "Male" ? EmpDfaullt : FemaleEmployee;
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
                                            // Split the item.ename string into an array of words based on spaces
                                            const names = (emp.ename || "").trim().split(/\s+/);

                                            // console.log("names", names);

                                            // Check if there's only one name or multiple names
                                            if (names.length === 1) {
                                              return names[0]; // If there's only one name, return it as-is
                                            }

                                            // Return the first and last name, or an empty string if not available
                                            return `${names[0] || ""} ${names[names.length - 1] || ""}`;
                                          })()}
                                        </div>
                                      </div>
                                    </td>
                                    <td>{emp.branchOffice || ""}</td>
                                    <td>{emp.department || ""}</td>
                                    <td>
                                      {emp.newDesignation === "Business Development Executive" ? "BDE"
                                        : emp.newDesignation === "Business Development Manager" ? "BDM"
                                          : emp.newDesignation || ""}
                                    </td>
                                    <td>{formatDate(emp.jdate) || ""}</td>
                                    <td>₹ {formatSalary(emp.salary || 0)}</td>
                                    <td>
                                      <span className={getBadgeClass(calculateProbationStatus(emp.jdate))}>
                                        {calculateProbationStatus(emp.jdate)}
                                      </span>
                                    </td>
                                    <td>
                                      <a
                                        target="_blank"
                                        className="text-decoration-none text-dark"
                                        href={`https://wa.me/91${emp.number}`}
                                      >
                                        {emp.number}
                                        <FaWhatsapp className="text-success w-25 mb-1" />
                                      </a>
                                    </td>
                                    <td>{emp.email || ""}</td>
                                    <td>
                                      <button className="action-btn action-btn-primary">
                                        <Link
                                          style={{ textDecoration: "none", color: 'inherit' }}
                                          to={`/hr-employee-profile-details/${emp._id}`}
                                        >
                                          <FaRegEye />
                                        </Link>
                                      </button>

                                      <button
                                        className="action-btn action-btn-alert ml-1"
                                        onClick={() => handleEditClick(emp._id)}
                                      >
                                        <MdModeEdit />
                                      </button>

                                      <button
                                        className="action-btn action-btn-danger ml-1"
                                        onClick={() => {
                                          const dataToDelete = employee.filter(obj => obj._id === emp._id);
                                          console.log("object is :", dataToDelete);
                                          setDeletedData(dataToDelete);
                                          const filteredCompanyData = companyData.filter(data => data.ename?.toLowerCase() === emp.ename.toLowerCase());
                                          setCompanyData(filteredCompanyData);
                                          handleDeleteClick(emp._id, emp.ename, dataToDelete, filteredCompanyData);
                                        }}
                                      >
                                        <AiFillDelete />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          ) : (
                            <tbody>
                              <tr>
                                <td
                                  className="particular"
                                  colSpan="11"
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
                </div>
              </div>

              <div class="tab-pane" id="DeletedEmployees">
                <div className="table table-responsive table-style-3 m-0">
                  <table className="table table-vcenter table-nowrap">
                    <thead>
                      <tr className="tr-sticky">
                        <th>Sr. No</th>

                        <th>
                          <div className='d-flex align-items-center justify-content-center position-relative'>
                            <div ref={el => deletedEmployeeFieldRefs.current['ename'] = el}>
                              Employee Name
                            </div>

                            <div className='RM_filter_icon'>
                              {isDeletedEmployeeActiveField('ename') ? (
                                <FaFilter onClick={() => handleDeletedEmployeeFilterClick("ename")} />
                              ) : (
                                <BsFilter onClick={() => handleDeletedEmployeeFilterClick("ename")} />
                              )}
                            </div>

                            {/* ---------------------filter component--------------------------- */}
                            {showDeletedEmployeeFilterMenu && activeFilterFieldDeletedEmployee === 'ename' && (
                              <div
                                ref={deletedEmployeeFilterMenuRef}
                                className="filter-menu"
                                style={{ top: `${deletedEmployeefilterPosition.top}px`, left: `${deletedEmployeefilterPosition.left}px` }}
                              >
                                <EmployeeFilter
                                  noofItems={setnoOfAvailableDataForDeletedEmployee}
                                  allFilterFields={setActiveFilterFieldsDeletedEmployee}
                                  filteredData={filteredDataDeletedEmployee}
                                  filterField={activeFilterFieldDeletedEmployee}
                                  onFilter={handleDeletedEmployeeFilter}
                                  completeData={completeDeletedEmployeeData}
                                  showingMenu={setShowDeletedEmployeeFilterMenu}
                                  dataForFilter={dataToFilterDeletedEmployee}
                                />
                              </div>
                            )}
                          </div>
                        </th>

                        <th>
                          <div className='d-flex align-items-center justify-content-center position-relative'>
                            <div ref={el => deletedEmployeeFieldRefs.current['branchOffice'] = el}>
                              Branch
                            </div>

                            <div className='RM_filter_icon'>
                              {isDeletedEmployeeActiveField('branchOffice') ? (
                                <FaFilter onClick={() => handleDeletedEmployeeFilterClick("branchOffice")} />
                              ) : (
                                <BsFilter onClick={() => handleDeletedEmployeeFilterClick("branchOffice")} />
                              )}
                            </div>

                            {/* ---------------------filter component--------------------------- */}
                            {showDeletedEmployeeFilterMenu && activeFilterFieldDeletedEmployee === 'branchOffice' && (
                              <div
                                ref={deletedEmployeeFilterMenuRef}
                                className="filter-menu"
                                style={{ top: `${deletedEmployeefilterPosition.top}px`, left: `${deletedEmployeefilterPosition.left}px` }}
                              >
                                <EmployeeFilter
                                  noofItems={setnoOfAvailableDataForDeletedEmployee}
                                  allFilterFields={setActiveFilterFieldsDeletedEmployee}
                                  filteredData={filteredDataDeletedEmployee}
                                  filterField={activeFilterFieldDeletedEmployee}
                                  onFilter={handleDeletedEmployeeFilter}
                                  completeData={completeDeletedEmployeeData}
                                  showingMenu={setShowDeletedEmployeeFilterMenu}
                                  dataForFilter={dataToFilterDeletedEmployee}
                                />
                              </div>
                            )}
                          </div>
                        </th>

                        <th>
                          <div className='d-flex align-items-center justify-content-center position-relative'>
                            <div ref={el => deletedEmployeeFieldRefs.current['department'] = el}>
                              Department
                            </div>

                            <div className='RM_filter_icon'>
                              {isDeletedEmployeeActiveField('department') ? (
                                <FaFilter onClick={() => handleDeletedEmployeeFilterClick("department")} />
                              ) : (
                                <BsFilter onClick={() => handleDeletedEmployeeFilterClick("department")} />
                              )}
                            </div>

                            {/* ---------------------filter component--------------------------- */}
                            {showDeletedEmployeeFilterMenu && activeFilterFieldDeletedEmployee === 'department' && (
                              <div
                                ref={deletedEmployeeFilterMenuRef}
                                className="filter-menu"
                                style={{ top: `${deletedEmployeefilterPosition.top}px`, left: `${deletedEmployeefilterPosition.left}px` }}
                              >
                                <EmployeeFilter
                                  noofItems={setnoOfAvailableDataForDeletedEmployee}
                                  allFilterFields={setActiveFilterFieldsDeletedEmployee}
                                  filteredData={filteredDataDeletedEmployee}
                                  filterField={activeFilterFieldDeletedEmployee}
                                  onFilter={handleDeletedEmployeeFilter}
                                  completeData={completeDeletedEmployeeData}
                                  showingMenu={setShowDeletedEmployeeFilterMenu}
                                  dataForFilter={dataToFilterDeletedEmployee}
                                />
                              </div>
                            )}
                          </div>
                        </th>

                        <th>
                          <div className='d-flex align-items-center justify-content-center position-relative'>
                            <div ref={el => deletedEmployeeFieldRefs.current['newDesignation'] = el}>
                              Designation
                            </div>

                            <div className='RM_filter_icon'>
                              {isDeletedEmployeeActiveField('newDesignation') ? (
                                <FaFilter onClick={() => handleDeletedEmployeeFilterClick("newDesignation")} />
                              ) : (
                                <BsFilter onClick={() => handleDeletedEmployeeFilterClick("newDesignation")} />
                              )}
                            </div>

                            {/* ---------------------filter component--------------------------- */}
                            {showDeletedEmployeeFilterMenu && activeFilterFieldDeletedEmployee === 'newDesignation' && (
                              <div
                                ref={deletedEmployeeFilterMenuRef}
                                className="filter-menu"
                                style={{ top: `${deletedEmployeefilterPosition.top}px`, left: `${deletedEmployeefilterPosition.left}px` }}
                              >
                                <EmployeeFilter
                                  noofItems={setnoOfAvailableDataForDeletedEmployee}
                                  allFilterFields={setActiveFilterFieldsDeletedEmployee}
                                  filteredData={filteredDataDeletedEmployee}
                                  filterField={activeFilterFieldDeletedEmployee}
                                  onFilter={handleDeletedEmployeeFilter}
                                  completeData={completeDeletedEmployeeData}
                                  showingMenu={setShowDeletedEmployeeFilterMenu}
                                  dataForFilter={dataToFilterDeletedEmployee}
                                />
                              </div>
                            )}
                          </div>
                        </th>

                        <th>
                          <div className='d-flex align-items-center justify-content-center position-relative'>
                            <div ref={el => deletedEmployeeFieldRefs.current['jdate'] = el}>
                              Date Of Joining
                            </div>

                            <div className='RM_filter_icon'>
                              {isDeletedEmployeeActiveField('jdate') ? (
                                <FaFilter onClick={() => handleDeletedEmployeeFilterClick("jdate")} />
                              ) : (
                                <BsFilter onClick={() => handleDeletedEmployeeFilterClick("jdate")} />
                              )}
                            </div>

                            {/* ---------------------filter component--------------------------- */}
                            {showDeletedEmployeeFilterMenu && activeFilterFieldDeletedEmployee === 'jdate' && (
                              <div
                                ref={deletedEmployeeFilterMenuRef}
                                className="filter-menu"
                                style={{ top: `${deletedEmployeefilterPosition.top}px`, left: `${deletedEmployeefilterPosition.left}px` }}
                              >
                                <EmployeeFilter
                                  noofItems={setnoOfAvailableDataForDeletedEmployee}
                                  allFilterFields={setActiveFilterFieldsDeletedEmployee}
                                  filteredData={filteredDataDeletedEmployee}
                                  filterField={activeFilterFieldDeletedEmployee}
                                  onFilter={handleDeletedEmployeeFilter}
                                  completeData={completeDeletedEmployeeData}
                                  showingMenu={setShowDeletedEmployeeFilterMenu}
                                  dataForFilter={dataToFilterDeletedEmployee}
                                />
                              </div>
                            )}
                          </div>
                        </th>

                        <th>
                          <div className='d-flex align-items-center justify-content-center position-relative'>
                            <div ref={el => deletedEmployeeFieldRefs.current['salary'] = el}>
                              Monthly Salary
                            </div>

                            <div className='RM_filter_icon'>
                              {isDeletedEmployeeActiveField('salary') ? (
                                <FaFilter onClick={() => handleDeletedEmployeeFilterClick("salary")} />
                              ) : (
                                <BsFilter onClick={() => handleDeletedEmployeeFilterClick("salary")} />
                              )}
                            </div>

                            {/* ---------------------filter component--------------------------- */}
                            {showDeletedEmployeeFilterMenu && activeFilterFieldDeletedEmployee === 'salary' && (
                              <div
                                ref={deletedEmployeeFilterMenuRef}
                                className="filter-menu"
                                style={{ top: `${deletedEmployeefilterPosition.top}px`, left: `${deletedEmployeefilterPosition.left}px` }}
                              >
                                <EmployeeFilter
                                  noofItems={setnoOfAvailableDataForDeletedEmployee}
                                  allFilterFields={setActiveFilterFieldsDeletedEmployee}
                                  filteredData={filteredDataDeletedEmployee}
                                  filterField={activeFilterFieldDeletedEmployee}
                                  onFilter={handleDeletedEmployeeFilter}
                                  completeData={completeDeletedEmployeeData}
                                  showingMenu={setShowDeletedEmployeeFilterMenu}
                                  dataForFilter={dataToFilterDeletedEmployee}
                                />
                              </div>
                            )}
                          </div>
                        </th>

                        <th>Probation Status</th>

                        <th>
                          <div className='d-flex align-items-center justify-content-center position-relative'>
                            <div ref={el => deletedEmployeeFieldRefs.current['number'] = el}>
                              Official Number
                            </div>

                            <div className='RM_filter_icon'>
                              {isDeletedEmployeeActiveField('number') ? (
                                <FaFilter onClick={() => handleDeletedEmployeeFilterClick("number")} />
                              ) : (
                                <BsFilter onClick={() => handleDeletedEmployeeFilterClick("number")} />
                              )}
                            </div>

                            {/* ---------------------filter component--------------------------- */}
                            {showDeletedEmployeeFilterMenu && activeFilterFieldDeletedEmployee === 'number' && (
                              <div
                                ref={deletedEmployeeFilterMenuRef}
                                className="filter-menu"
                                style={{ top: `${deletedEmployeefilterPosition.top}px`, left: `${deletedEmployeefilterPosition.left}px` }}
                              >
                                <EmployeeFilter
                                  noofItems={setnoOfAvailableDataForDeletedEmployee}
                                  allFilterFields={setActiveFilterFieldsDeletedEmployee}
                                  filteredData={filteredDataDeletedEmployee}
                                  filterField={activeFilterFieldDeletedEmployee}
                                  onFilter={handleDeletedEmployeeFilter}
                                  completeData={completeDeletedEmployeeData}
                                  showingMenu={setShowDeletedEmployeeFilterMenu}
                                  dataForFilter={dataToFilterDeletedEmployee}
                                />
                              </div>
                            )}
                          </div>
                        </th>

                        <th>
                          <div className='d-flex align-items-center justify-content-center position-relative'>
                            <div ref={el => deletedEmployeeFieldRefs.current['email'] = el}>
                              Official Email ID
                            </div>

                            <div className='RM_filter_icon'>
                              {isDeletedEmployeeActiveField('email') ? (
                                <FaFilter onClick={() => handleDeletedEmployeeFilterClick("email")} />
                              ) : (
                                <BsFilter onClick={() => handleDeletedEmployeeFilterClick("email")} />
                              )}
                            </div>

                            {/* ---------------------filter component--------------------------- */}
                            {showDeletedEmployeeFilterMenu && activeFilterFieldDeletedEmployee === 'email' && (
                              <div
                                ref={deletedEmployeeFilterMenuRef}
                                className="filter-menu"
                                style={{ top: `${deletedEmployeefilterPosition.top}px`, left: `${deletedEmployeefilterPosition.left}px` }}
                              >
                                <EmployeeFilter
                                  noofItems={setnoOfAvailableDataForDeletedEmployee}
                                  allFilterFields={setActiveFilterFieldsDeletedEmployee}
                                  filteredData={filteredDataDeletedEmployee}
                                  filterField={activeFilterFieldDeletedEmployee}
                                  onFilter={handleDeletedEmployeeFilter}
                                  completeData={completeDeletedEmployeeData}
                                  showingMenu={setShowDeletedEmployeeFilterMenu}
                                  dataForFilter={dataToFilterDeletedEmployee}
                                />
                              </div>
                            )}
                          </div>
                        </th>

                        <th>Action</th>

                        <th>Revoke Employee</th>
                      </tr>
                    </thead>

                    {isLoadingDeleted ? (
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
                            {deletedEmployee.map((emp, index) => {
                              const profilePhotoUrl = emp.profilePhoto?.length !== 0
                                ? `${secretKey}/employee/fetchProfilePhoto/${emp._id}/${emp.profilePhoto?.[0]?.filename}`
                                : EmpDfaullt;

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
                                          // Split the item.ename string into an array of words based on spaces
                                          const names = (emp.ename || "").trim().split(/\s+/);

                                          // console.log("names", names);

                                          // Check if there's only one name or multiple names
                                          if (names.length === 1) {
                                            return names[0]; // If there's only one name, return it as-is
                                          }

                                          // Return the first and last name, or an empty string if not available
                                          return `${names[0] || ""} ${names[names.length - 1] || ""}`;
                                        })()}
                                      </div>
                                    </div>
                                  </td>
                                  <td>{emp.branchOffice || ""}</td>
                                  <td>{emp.department || ""}</td>
                                  <td>
                                    {emp.newDesignation === "Business Development Executive" ? "BDE"
                                      : emp.newDesignation === "Business Development Manager" ? "BDM"
                                        : emp.newDesignation || ""}
                                  </td>
                                  <td>{formatDate(emp.jdate) || ""}</td>
                                  <td>₹ {formatSalary(emp.salary || 0)}</td>
                                  <td>
                                    <span className={getBadgeClass(calculateProbationStatus(emp.jdate))}>
                                      {calculateProbationStatus(emp.jdate)}
                                    </span>
                                  </td>
                                  <td>
                                    <a
                                      target="_blank"
                                      className="text-decoration-none text-dark"
                                      href={`https://wa.me/91${emp.number}`}
                                    >
                                      {emp.number}
                                      <FaWhatsapp className="text-success w-25 mb-1" />
                                    </a>
                                  </td>
                                  <td>{emp.email || ""}</td>
                                  <td>
                                    <button className="action-btn action-btn-primary">
                                      <Link
                                        style={{ textDecoration: "none", color: 'inherit' }}
                                        to={`/hr-deleted-employee-profile-details/${emp._id}`}
                                      >
                                        <FaRegEye />
                                      </Link>
                                    </button>

                                    <button
                                      className="action-btn action-btn-danger ml-1"
                                      onClick={() => handlePermanentDeleteEmployee(emp._id)}
                                    >
                                      <AiFillDelete />
                                    </button>
                                  </td>
                                  <td>
                                    <button
                                      className="action-btn action-btn-success ml-1"
                                      onClick={() => {
                                        const dataToRevertBack = deletedEmployee.filter(obj => obj._id === emp._id);
                                        handleRevertBack(emp._id, emp.ename, dataToRevertBack);
                                      }}
                                    >
                                      <TbRestore />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        ) : (
                          <tbody>
                            <tr>
                              <td
                                className="particular"
                                colSpan="12"
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
              </div>

              <div class="tab-pane" id="UpcommingEmployees">
                <UpcomingEmployees upcomingEmployees={recruiterData} dataLoading={currentDataLoading} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HrEmployees;