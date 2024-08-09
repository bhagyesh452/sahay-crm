import React, { useState, useEffect } from "react";
import Header from "../Components/Header/Header";
import Navbar from "../Components/Navbar/Navbar";
import Nodata from "../../components/Nodata";
import axios from "axios";
import { IoFilterOutline } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaWhatsapp } from "react-icons/fa";
import { TbRestore } from "react-icons/tb";
import EmpDfaullt from "../../static/EmployeeImg/office-man.png";
import FemaleEmployee from "../../static/EmployeeImg/woman.png";

function HrEmployees() {

  useEffect(() => {
    document.title = `HR-Sahay-CRM`;
  }, []);

  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const userId = localStorage.getItem("hrUserId");
  const [myInfo, setMyInfo] = useState([]);

  const navigate = useNavigate();

  const [employee, setEmployee] = useState([]);
  const [deletedEmployee, setDeletedEmployee] = useState([]);
  const [deletedData, setDeletedData] = useState([]);
  const [companyData, setCompanyData] = useState([]);

  const handleAddEmployee = () => {
    navigate("/hr/add/employee");
  };

  const formatSalary = (amount) => {
    return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(amount);
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

  const fetchEmployee = async () => {
    try {
      const res = await axios.get(`${secretKey}/employee/einfo`);
      const employeeData = res.data;
      setEmployee(employeeData);
      // console.log("Fetched Employees are:", employeeData);
    } catch (error) {
      console.log("Error fetching employees data:", error);
    }
  };

  const fetchDeletedEmployee = async () => {
    try {
      const res = await axios.get(`${secretKey}/employee/deletedemployeeinfo`);
      const deletedEmployeeData = res.data;
      setDeletedEmployee(deletedEmployeeData);
      // console.log("Fetched Deleted Employees are:", deletedEmployeeData);
    } catch (error) {
      console.log("Error fetching employees data:", error);
    }
  };

  const handledeletefromcompany = async (filteredCompanyData) => {
    if (filteredCompanyData && filteredCompanyData.length !== 0) {

      try {
        // Update companyData in the second database
        await Promise.all(
          filteredCompanyData.map(async (item) => {
            if (item.Status === 'Matured') {
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
        // console.log("Deleted data is :", dataToDelete);
        try {
          const saveDeletedResponse = await axios.put(`${secretKey}/employee/savedeletedemployee`, {
            dataToDelete
          });
          const deleteEmployeeResponse = await axios.delete(`${secretKey}/employee/einfo/${empId}`);

          const updateBdmStatusResponse = await axios.put(`${secretKey}/bookings/updateDeletedBdmStatus/${ename}`);
          handledeletefromcompany(filteredCompanyData);
          fetchEmployee();
          fetchDeletedEmployee();
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
          fetchDeletedEmployee();
          fetchEmployee();
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
          const response = await axios.delete(`${secretKey}/employee/permanentDelete/${itemId}`);
          Swal.fire(
            'Deleted!',
            'success'
          );
          fetchDeletedEmployee();
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
    fetchEmployee();
    fetchCompanyData();
    fetchDeletedEmployee();
  }, []);

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
      <Header id={myInfo._id} name={myInfo.ename} empProfile={myInfo.profilePhoto && myInfo.profilePhoto.length !== 0 && myInfo.profilePhoto[0].filename} gender={myInfo.gender} designation={myInfo.newDesignation} />
      <Navbar />
      <div className="page-wrapper">
        <div className="page-header rm_Filter m-0">
          <div className="container-xl">
            <div className="d-flex   justify-content-between">
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
                      id="bdeName-search" />
                  </div>
                </div>
                <div className="btn-group ml-1" role="group" aria-label="Basic example">
                  <button type="button" className="btn mybtn"  >
                    <IoFilterOutline className='mr-1' /> Filter
                  </button>
                </div>
              </div>
              <div>
                <button onClick={handleAddEmployee} className="btn btn-primary">+ Add Employee</button>
              </div>
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
                        {employee.length || 0}
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
                        {deletedEmployee.length || 0}
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
                        10
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
                          <th>Employee Name</th>
                          <th>Branch</th>
                          <th>Department</th>
                          <th>Designation</th>
                          <th>Date Of Joining</th>
                          <th>Monthly Salary</th>
                          <th>Probation Status</th>
                          <th>Official Number</th>
                          <th>Official Email ID</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      {employee.length !== 0 ? <tbody>
                        {employee.map((emp, index) => {
                          const profilePhotoUrl = emp.profilePhoto ? `${secretKey}/employee/fetchProfilePhoto/${emp._id}/${emp.profilePhoto?.[0]?.filename}` : EmpDfaullt;

                          return <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="tbl-pro-img">
                                  {emp.profilePhoto.length !== 0 ? <img
                                    src={profilePhotoUrl
                                      // emp.profilePhoto && `${secretKey}/employee/fetchProfilePhoto/${emp._id}/${emp.profilePhoto?.[0]?.filename}`
                                    }
                                    alt="Profile"
                                    className="profile-photo"
                                  /> :
                                    <img
                                      src={emp.gender === "Male" ? EmpDfaullt : FemaleEmployee}
                                      alt="Profile"
                                      className="profile-photo"
                                    />}
                                </div>
                                <div className="">
                                  {/* {emp.ename} */}
                                  {(() => {
                                    const names = (emp.ename || "").split(" ");
                                    return `${names[0] || ""} ${names[names.length - 1] || ""}`;
                                  })()}
                                </div>
                              </div>

                            </td>
                            <td>{emp.branchOffice || ""}</td>
                            <td>{emp.department || ""}</td>
                            <td>{emp.newDesignation === "Business Development Executive" && "BDE" || emp.newDesignation === "Business Development Manager" && "BDM" || emp.newDesignation || ""}</td>
                            <td>{formatDate(emp.jdate) || ""}</td>
                            <td>₹ {formatSalary(emp.salary || 0)}</td>
                            <td><span className={getBadgeClass(calculateProbationStatus(emp.jdate))}>{calculateProbationStatus(emp.jdate)}</span></td>
                            <td><a
                              target="_blank"
                              className="text-decoration-none text-dark"
                              href={`https://wa.me/91${emp.number}`}
                            >{emp.number}
                              <FaWhatsapp className="text-success w-25 mb-1" /></a></td>
                            <td>{emp.email || ""}</td>
                            <td>
                              <button className="action-btn action-btn-primary">
                                <Link style={{ textDecoration: "none", color: 'inherit' }}
                                  to={{
                                    pathname: `/hr-employee-profile-details/${emp._id}`
                                  }} >
                                  <FaRegEye />
                                </Link>
                              </button>
                              <button className="action-btn action-btn-alert ml-1" onClick={() => handleEditClick(emp._id)}><MdModeEdit /></button>
                              <button className="action-btn action-btn-danger ml-1" onClick={() => {
                                const dataToDelete = employee.filter(obj => obj._id === emp._id);
                                setDeletedData(dataToDelete);
                                const filteredCompanyData = companyData.filter(data => data.ename?.toLowerCase() === emp.ename.toLowerCase());
                                setCompanyData(filteredCompanyData);
                                handleDeleteClick(emp._id, emp.ename, dataToDelete, filteredCompanyData)
                              }}
                              ><AiFillDelete /></button>
                            </td>
                          </tr>
                        })}
                      </tbody> : <tbody>
                        <tr>
                          <td
                            className="particular"
                            colSpan="11"
                            style={{ textAlign: "center" }}
                          >
                            <Nodata />
                          </td>
                        </tr>
                      </tbody>}
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
                        <th>Employee Name</th>
                        <th>Branch</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>Date Of Joining</th>
                        <th>Monthly Salary</th>
                        <th>Probation Status</th>
                        <th>Official Number</th>
                        <th>Official Email ID</th>
                        <th>Action</th>
                        <th>Revoke Employee</th>
                      </tr>
                    </thead>
                    {deletedEmployee.length !== 0 ? <tbody>
                      {deletedEmployee.map((emp, index) => {
                        const profilePhotoUrl = emp.profilePhoto ? `${secretKey}/employee/fetchProfilePhoto/${emp._id}/${emp.profilePhoto?.[0]?.filename}` : EmpDfaullt;

                        return <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="tbl-pro-img">
                                {emp.profilePhoto.length !== 0 ? <img
                                  src={profilePhotoUrl
                                    // emp.profilePhoto && `${secretKey}/employee/fetchProfilePhoto/${emp._id}/${emp.profilePhoto?.[0]?.filename}`
                                  }
                                  alt="Profile"
                                  className="profile-photo"
                                /> :
                                  <img
                                    src={EmpDfaullt}
                                    alt="Profile"
                                    className="profile-photo"
                                  />}
                              </div>
                              <div className="">
                                {/* {emp.ename} */}
                                {(() => {
                                  const names = (emp.ename || "").split(" ");
                                  return `${names[0] || ""} ${names[names.length - 1] || ""}`;
                                })()}
                              </div>
                            </div>

                          </td>
                          <td>{emp.branchOffice || ""}</td>
                          <td>{emp.department || ""}</td>
                          <td>{emp.newDesignation === "Business Development Executive" && "BDE" || emp.newDesignation === "Business Development Manager" && "BDM" || emp.newDesignation || ""}</td>
                          <td>{formatDate(emp.jdate) || ""}</td>
                          <td>₹ {formatSalary(emp.salary || 0)}</td>
                          <td><span className={getBadgeClass(calculateProbationStatus(emp.jdate))}>{calculateProbationStatus(emp.jdate)}</span></td>
                          <td><a
                            target="_blank"
                            className="text-decoration-none text-dark"
                            href={`https://wa.me/91${emp.number}`}
                          >{emp.number}
                            <FaWhatsapp className="text-success w-25 mb-1" /></a></td>
                          <td>{emp.email || ""}</td>
                          <td>
                            <button className="action-btn action-btn-primary">
                              <Link style={{ textDecoration: "none", color: 'inherit' }}
                                to={{
                                  pathname: `/hr-employee-profile-details/${emp._id}`
                                }} >
                                <FaRegEye />
                              </Link>
                            </button>
                            <button className="action-btn action-btn-danger ml-1" onClick={() => handlePermanentDeleteEmployee(emp._id)}
                            ><AiFillDelete /></button>
                          </td>
                          <td>
                            <button className="action-btn action-btn-success ml-1" onClick={() => {
                              const dataToRevertBack = deletedEmployee.filter(obj => obj._id === emp._id);
                              handleRevertBack(emp._id, emp.ename, dataToRevertBack);
                            }}>
                              <TbRestore />
                            </button>
                          </td>
                        </tr>
                      })}
                    </tbody> : <tbody>
                      <tr>
                        <td
                          className="particular"
                          colSpan="11"
                          style={{ textAlign: "center" }}
                        >
                          <Nodata />
                        </td>
                      </tr>
                    </tbody>}
                  </table>
                </div>
              </div>

              <div class="tab-pane" id="UpcommingEmployees">
                <h1>Upcoming Employees</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HrEmployees;