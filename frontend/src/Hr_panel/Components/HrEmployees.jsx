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
import EmpDfaullt from "../../static/EmployeeImg/office-man.png";

function HrEmployees() {

  useEffect(() => {
    document.title = `HR-Sahay-CRM`;
  }, []);

  const secretKey = process.env.REACT_APP_SECRET_KEY;

  const navigate = useNavigate();

  const [employee, setEmployee] = useState([]);
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
      console.error("Error fetching data:", error.message);
    }
  };

  const fetchEmployee = async () => {
    try {
      const res = await axios.get(`${secretKey}/employee/einfo`);
      const employeeData = res.data.map((emp) => {
        const profilePhoto = emp.profilePhoto?.[0]?.filename || EmpDfaullt;
        return { ...emp, profilePhoto };
      });
      setEmployee(employeeData);
      console.log("Fetched Employees are:", res.data);
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
        console.error("Error updating enames:", error.message);
        Swal.fire("Error deleting the employee");
        // Handle the error as needed
      }
    }
  };

  const handleDeleteClick = (empId, ename, dataToDelete, filteredCompanyData) => {
    console.log("Emp id is :", empId);
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
          fetchEmployee();
          Swal.fire(
            'Deleted!',
            'Employee has been deleted.',
            'success'
          );
        } catch (error) {
          console.error("Error deleting employee:", error);
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

  useEffect(() => {
    fetchEmployee();
    fetchCompanyData();
  }, []);

  return (
    <div>
      <Header />
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
                        {employee.length}
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
                        20
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
                          return <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="tbl-pro-img">
                                  <img
                                    src={
                                      emp.profilePhoto
                                        ? `${secretKey}/employee/fetchProfilePhoto/${emp._id}/${emp.profilePhoto}`
                                        : EmpDfaullt
                                    }
                                    alt="Profile"
                                    className="profile-photo"
                                  />
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
                            <td>{emp.newDesignation || ""}</td>
                            <td>{formatDate(emp.jdate) || ""}</td>
                            <td>₹ {formatSalary(emp.salary || 0)}</td>
                            <td><span className={getBadgeClass(calculateProbationStatus(emp.jdate))}>{calculateProbationStatus(emp.jdate)}</span></td>
                            <td>{emp.number || ""}</td>
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
                <h1>Deleted Employees</h1>
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