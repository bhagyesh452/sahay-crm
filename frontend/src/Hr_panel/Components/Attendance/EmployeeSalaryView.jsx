import React, { useState, useEffect } from "react";
import Header from "../../Components/Header/Header";
import Navbar from "../../Components/Navbar/Navbar";
import Nodata from "../../../components/Nodata";
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
import EmpDfaullt from "../../../static/EmployeeImg/office-man.png";
import FemaleEmployee from "../../../static/EmployeeImg/woman.png";

function EmployeeSalaryView({ }) {

  useEffect(() => {
    document.title = `HR-Sahay-CRM`;
  }, []);

  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const userId = localStorage.getItem("hrUserId");
  const [myInfo, setMyInfo] = useState([]);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [deletedEmployee, setDeletedEmployee] = useState([]);
  const [deletedData, setDeletedData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [employeeSearchResult, setEmployeeSearchResult] = useState([]);
  const [deletedEmployeeSearchResult, setDeletedEmployeeSearchResult] = useState([]);

  function getMonthName(monthNumber) {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    return monthNames[monthNumber - 1]; // Subtract 1 since array indices start from 0
  }
  const year = "2024"
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;

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
      setIsLoading(true);
      const res = await axios.get(`${secretKey}/employee/einfo`);
      setEmployee(res.data);
      // console.log("Fetched Employees are:", res.data);

      const result = res.data.filter((emp) => {
        const mappedDesignation = searchValue.toLowerCase() === "bde"
          ? "business development executive"
          : searchValue.toLowerCase() === "bdm"
            ? "business development manager"
            : searchValue.toLowerCase();

        return (
          emp.ename?.toLowerCase().includes(searchValue.toLowerCase()) ||
          emp.number?.toString().includes(searchValue) ||
          emp.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
          emp.newDesignation?.toLowerCase().includes(mappedDesignation) ||
          emp.branchOffice?.toLowerCase().includes(searchValue.toLowerCase()) ||
          emp.department?.toLowerCase().includes(searchValue.toLowerCase())
        );
      });

      // console.log("Search result from employee list is :", result);
      setEmployeeSearchResult(result);
    } catch (error) {
      console.log("Error fetching employees data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDeletedEmployee = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${secretKey}/employee/deletedemployeeinfo`);
      setDeletedEmployee(res.data);
      // console.log("Fetched Deleted Employees are:", res.data);
      const result = res.data.filter((emp) => {
        return (
          emp.ename?.toLowerCase().includes(searchValue) ||
          emp.number?.toString().includes(searchValue) ||
          emp.email?.toLowerCase().includes(searchValue) ||
          emp.newDesignation?.toLowerCase().includes(searchValue) ||
          emp.branchOffice?.toLowerCase().includes(searchValue)
        );
      });
      // console.log("Search result from deleted employee list is :", result);
      setDeletedEmployeeSearchResult(result);
    } catch (error) {
      console.log("Error fetching employees data:", error);
    } finally {
      setIsLoading(false);
    }
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
  const [attendanceData, setAttendanceData] = useState([]);
  const [leaveCount, setLeaveCount] = useState(0);
  const [presentCount, setPresentCount] = useState(0);
  const [halfDayCount, setHalfDayCount] = useState(0);
  const [lcCount, setLcCount] = useState(0);
  const formatDateForHolidayCheck = (year, month, day) => {
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };
  const officialHolidays = [
    '2024-01-14', '2024-01-15', '2024-03-24', '2024-03-25',
    '2024-07-07', '2024-08-19', '2024-10-12',
    '2024-10-31', '2024-11-01', '2024-11-02', '2024-11-03', '2024-11-04', '2024-11-05'
  ]
  const getCurrentMonthName = () => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const currentMonthIndex = new Date().getMonth();
    return months[currentMonthIndex];
  };
  const monthNamesToNumbers = {
    "January": 1,
    "February": 2,
    "March": 3,
    "April": 4,
    "May": 5,
    "June": 6,
    "July": 7,
    "August": 8,
    "September": 9,
    "October": 10,
    "November": 11,
    "December": 12
  };
  const monthNumber = monthNamesToNumbers[month];
  const fetchAttendanceForAllEmployees = async () => {
    try {
      const res = await axios.get(`${secretKey}/attendance/viewAllAttendance`);
      const allAttendanceData = res.data.data;

      const totalDays = new Date(year, new Date(Date.parse(`${month} 1, }`)).getMonth() + 1, 0).getDate();
      const today = new Date().getDate(); // Current date of the month
      const currentMonth = getCurrentMonthName();
      const isCurrentMonth = getMonthName(month) === currentMonth;
      // console.log("Current month is :", currentMonth , getMonthName(month));
      // Store the attendance data for all employees
      const allEmployeeAttendanceData = [];

      // Iterate through each employee in the employee array
      for (const emp of employee) {
        let name = emp.ename;
        let designation = emp.designation;

        const filteredData = [];
        const filledDates = new Set(); // To track dates with existing data

        // Collect all attendance data for this employee
        allAttendanceData.forEach(employee => {
          if (employee._id === emp._id) {  // Check for the specific employee ID
            employee.years.forEach(yearData => {
              if (yearData.year === Number(year)) {  // Check for the specific year
                yearData.months.forEach(monthData => {
                  if (monthData.month === getMonthName(month)) {  // Check for the specific month
                    monthData.days.forEach(dayData => {
                      const { date: dayDate, inTime, outTime, workingHours, status, reasonValue, isAddedManually } = dayData;

                      filledDates.add(dayDate); // Add filled date to the set

                      // Add data for the current month up to today or all data for past months
                      if (isCurrentMonth && dayDate <= today || !isCurrentMonth) {

                        name = employee.employeeName;
                        designation = employee.designation;

                        filteredData.push({
                          _id: employee._id,
                          employeeId: employee.employeeId,
                          employeeName: employee.employeeName,
                          designation: employee.designation,
                          department: employee.department,
                          branchOffice: employee.branchOffice,
                          date: dayDate,
                          inTime,
                          outTime,
                          workingHours,
                          status,
                          reasonValue,
                          isAddedManually
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });

        // Function to find the previous working day (same as before)
        const findPrevWorkingDay = (year, month, startDay) => {
          let currentDay = startDay;
          let currentMonth = month;
          let currentYear = year;
          // console.log("month", month)
          while (true) {
            if (currentDay < 1) {
              currentMonth--;
              if (currentMonth < 1) {
                currentMonth = 12;
                currentYear--;
              }
              const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
              currentDay = daysInPrevMonth;
            }

            const formattedDate = formatDateForHolidayCheck(currentYear, currentMonth, currentDay);
            const dateToCheck = new Date(currentYear, currentMonth - 1, currentDay);
            const isSunday = dateToCheck.getDay() === 0;
            const isHoliday = officialHolidays.includes(formattedDate);
            if (!isSunday && !isHoliday) {
              break;
            }
            currentDay--;
          }
          return { day: currentDay, month: currentMonth, year: currentYear };
        };

        // Function to find the next working day (same as before)
        const findNextWorkingDay = (year, month, startDay) => {
          let currentDay = startDay;
          let currentMonth = month;
          let currentYear = year;

          while (true) {
            const daysInCurrentMonth = new Date(currentYear, currentMonth, 0).getDate();
            if (currentDay > daysInCurrentMonth) {
              currentMonth++;
              if (currentMonth > 12) {
                currentMonth = 1;
                currentYear++;
              }
              currentDay = 1; // Reset to the first day of the next month
            }

            const formattedDate = formatDateForHolidayCheck(currentYear, currentMonth, currentDay);
            const dateToCheck = new Date(currentYear, currentMonth - 1, currentDay);
            const isSunday = dateToCheck.getDay() === 0;
            const isHoliday = officialHolidays.includes(formattedDate);

            if (!isSunday && !isHoliday) {
              break;
            }

            currentDay++;
          }

          return { day: currentDay, month: currentMonth, year: currentYear };
        };

        // Logic to handle empty days for the current month (same as before)
        for (let date = 1; date <= (isCurrentMonth ? today : totalDays); date++) {
          if (!filledDates.has(date)) {
            const monthNumber = new Date(`${month} 1, ${year}`).getMonth() + 1;
            const formattedDate = `${year}-${monthNumber < 10 ? '0' + monthNumber : monthNumber}-${date < 10 ? '0' + date : date}`;
            const isSunday = new Date(`${year}-${monthNumber}-${date}`).getDay() === 0;
            const isHoliday = officialHolidays.includes(formattedDate);

            let status = ''; // Default status for empty days

            if (isSunday) {
              const prevWorkingDate = findPrevWorkingDay(Number(year), monthNumber, date - 1);
              const nextWorkingDate = findNextWorkingDay(Number(year), monthNumber, date + 1);

              const prevDayStatus = allAttendanceData.find(employee => employee._id === emp._id)?.years
                ?.find(yr => yr.year === prevWorkingDate.year)?.months
                ?.find(mn => mn.month === getMonthName(prevWorkingDate.month))?.days
                ?.find(d => d.date === prevWorkingDate.day)?.status;

              const nextDayStatus = allAttendanceData.find(employee => employee._id === emp._id)?.years
                ?.find(yr => yr.year === nextWorkingDate.year)?.months
                ?.find(mn => mn.month === getMonthName(nextWorkingDate.month))?.days
                ?.find(d => d.date === nextWorkingDate.day)?.status;

              // Determine Sunday status
              if (
                (prevDayStatus === "Leave" && nextDayStatus === "Leave") ||
                (prevDayStatus === "Leave" && nextDayStatus === "Half Day") ||
                (prevDayStatus === "Half Day" && nextDayStatus === "Leave")
              ) {
                status = "Sunday Leave"; // Sunday Leave
              } else if (
                (prevDayStatus === "Half Day" && nextDayStatus === "Half Day") ||
                (prevDayStatus === "LCH" && nextDayStatus === "LCH") ||
                (prevDayStatus === "LCH" && nextDayStatus === "Half Day") ||
                (prevDayStatus === "Half Day" && nextDayStatus === "LCH")
              ) {
                status = "Sunday Half Day"; // Sunday Half Day
              } else if (
                prevDayStatus === "Present" || nextDayStatus === "Present"
              ) {
                status = "Sunday"; // Sunday Present
              } else {
                status = "Sunday"; // Regular Sunday
              }
            } else if (isHoliday) {
              const prevWorkingDate = findPrevWorkingDay(Number(year), monthNumber, date - 1);
              const nextWorkingDate = findNextWorkingDay(Number(year), monthNumber, date + 1);

              const prevDayStatus = allAttendanceData.find(employee => employee._id === emp._id)?.years
                ?.find(yr => yr.year === prevWorkingDate.year)?.months
                ?.find(mn => mn.month === getMonthName(prevWorkingDate.month))?.days
                ?.find(d => d.date === prevWorkingDate.day)?.status;

              const nextDayStatus = allAttendanceData.find(employee => employee._id === emp._id)?.years
                ?.find(yr => yr.year === nextWorkingDate.year)?.months
                ?.find(mn => mn.month === getMonthName(nextWorkingDate.month))?.days
                ?.find(d => d.date === nextWorkingDate.day)?.status;

              // Determine Holiday status
              if (
                (prevDayStatus === "Leave" && nextDayStatus === "Leave") ||
                (prevDayStatus === "Leave" && nextDayStatus === "Half Day") ||
                (prevDayStatus === "Half Day" && nextDayStatus === "Leave")
              ) {
                status = "Official Holiday Leave"; // Holiday Leave
              } else if (
                (prevDayStatus === "Half Day" && nextDayStatus === "Half Day") ||
                (prevDayStatus === "LCH" && nextDayStatus === "LCH") ||
                (prevDayStatus === "LCH" && nextDayStatus === "Half Day") ||
                (prevDayStatus === "Half Day" && nextDayStatus === "LCH")
              ) {
                status = "Official Holiday Half Day"; // Holiday Half Day
              } else {
                status = "Official Holiday"; // Regular Holiday
              }
            }
            if (status) {
              filteredData.push({
                employeeName: name,
                designation: designation,
                date: date,
                inTime: '',
                outTime: '',
                workingHours: '',
                status: status ? status : "No Data"
              });
            }
          }
        }

        filteredData.sort((a, b) => new Date(`${year}-${monthNumber}-${a.date}`) - new Date(`${year}-${monthNumber}-${b.date}`));
        const presentDates = new Set(); // Use a Set to store unique dates
        let hasLCH = false;
        //console.log("filteredData :", filteredData);
        let presentCount = 0;
        let lcCount = 0;
        let leaveCount = 0;
        let halfDayCount = 0;
        let lchCount = 0;
        let sundayLeaveCount = 0;
        let officialHolidayLeaveCount = 0;
        let sundayHalfDayCount = 0;
        let officialHolidayHalfDayCount = 0;

        filteredData.forEach(data => {
          if (data.status === "LCH") {
            hasLCH = true;
          }

          // Check for Present, LC statuses, and Sunday
          if (["Present", "LC1", "LC2", "LC3", "Sunday"].includes(data.status)) {
            if (!presentDates.has(data.date)) {
              presentDates.add(data.date); // Add unique date to the Set
              presentCount++; // Increment present count only for unique dates
            }
          }

          if (["LC1", "LC2", "LC3", "LCH"].includes(data.status)) {
            lcCount++;
          }

          if (["Leave", "Sunday Leave", "Official Holiday Leave"].includes(data.status)) {
            leaveCount++;
          }

          if (["Half Day", "LCH", "Sunday Half Day", "Official Holiday Half Day"].includes(data.status)) {
            halfDayCount++;
          }
          if (["LCH"].includes(data.status)) {
            lchCount++;
          }
          if (["Sunday Leave"].includes(data.status)) {
            sundayLeaveCount++;
          }
          if (["Official Holiday Leave"].includes(data.status)) {
            officialHolidayLeaveCount++;
          }
          if (["Sunday Half Day"].includes(data.status)) {
            sundayHalfDayCount++;
          }
          if (["Official Holiday Half Day"].includes(data.status)) {
            officialHolidayHalfDayCount++;
          }
        });

        // Adjust counts based on LCH logic
        if (hasLCH) {
          halfDayCount = Math.min(halfDayCount, lcCount + (halfDayCount - lcCount));
        }
        setPresentCount(presentCount);
        setLcCount(lcCount);
        setLeaveCount(leaveCount);
        setHalfDayCount(halfDayCount);
        // console.log("Final Attendance Data for all Employees:", allEmployeeAttendanceData);
        // Append the current employee's data to allEmployeeAttendanceData
        const getDaysInCurrentMonth = () => {
          const today = new Date();
          const year = today.getFullYear();
          const monthNumber = today.getMonth() + 1; // getMonth() is zero-indexed
          const daysInMonth = new Date(year, monthNumber, 0).getDate(); // Get the total days in the current month
          return daysInMonth;
        };
        allEmployeeAttendanceData.push({
          employeeName: name,
          employeeId: emp._id,
          employeeBranch: emp.branchOffice,
          employeePhoto: emp.profilePhoto && emp.profilePhoto.length !== 0 && emp.profilePhoto[0].filename,
          employeeSalary: emp.salary,
          employeeJoiningDate: emp.jdate,
          attendance: filteredData,
          presentCount: presentCount,
          leaveCount: leaveCount,
          halfDayCount: halfDayCount,
          lcCount: lcCount,
          workingDays: getDaysInCurrentMonth(),
          lchCount: lchCount,
          sundayLeaveCount: sundayLeaveCount,
          sundayHalfDayCount: sundayHalfDayCount,
          officialHolidayLeaveCount: officialHolidayLeaveCount,
          officialHolidayHalfDayCount: officialHolidayHalfDayCount,
        });
      }
      // Process the final counts for all employees
      setAttendanceData(allEmployeeAttendanceData);

    } catch (error) {
      console.log("Error fetching attendance records:", error);
    }
  };


  useEffect(() => {

    fetchPersonalInfo();
  }, []);
  console.log("attendanceData", attendanceData)
  useEffect(() => {
    fetchAttendanceForAllEmployees();
  }, [employee])

  return (
    <>
      <div>
        <Header id={myInfo._id} name={myInfo.ename} empProfile={myInfo.profilePhoto && myInfo.profilePhoto.length !== 0 && myInfo.profilePhoto[0].filename} gender={myInfo.gender} designation={myInfo.newDesignation} />
        <Navbar />
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
                      //value={searchValue}
                      //onChange={(e) => setSearchValue(e.target.value.toLowerCase())}
                      />
                    </div>
                  </div>
                  <div className="btn-group ml-1" role="group" aria-label="Basic example">
                    <button type="button" className="btn mybtn"  >
                      <IoFilterOutline className='mr-1' /> Filter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="page-body rm_Dtl_box m-0">
            <div className="container-xl mt-2">
              <div className="my-tab card-header">
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
                            <th>Fixed Salary</th>
                            <th>Working Days</th>
                            <th>Date Of Joining</th>
                            <th>P</th>
                            <th>L</th>
                            <th>H</th>
                            {/* <th>LC</th>
      <th>LCH</th>
      <th>SL</th>
      <th>SH</th>
      <th>OHL</th>
      <th>OHH</th> */}
                            <th>Deduction</th>
                            <th>Incentive</th>
                            <th>Gross Payable</th>
                            <th>Employee PF</th>
                            <th>Employee PF</th>
                            <th>ESIC</th>
                            <th>PT</th>
                            <th>Net Payable</th>
                            <th>Payment</th>
                          </tr>
                        </thead>

                        {isLoading ? (
                          <tbody>
                            <tr>
                              <td colSpan="19">
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
                            {(searchValue ? employeeSearchResult : attendanceData).length !== 0 ? (
                              <tbody>
                                {(searchValue ? employeeSearchResult : attendanceData).map((emp, index) => {
                                  const employeeRecord = employee.find((employee) => employee._id === emp.employeeId);
                                
                                  const profilePhotoUrl = employeeRecord && employeeRecord.profilePhoto?.length > 0
                                    ? employeeRecord.profilePhoto[0]?.filename
                                    : null;
                              
                                  const profilePhotoUrlFetch = profilePhotoUrl
                                    ? `${secretKey}/employee/fetchProfilePhoto/${emp.employeeId}/${profilePhotoUrl}`
                                    : emp.gender === "Male" ? EmpDfaullt : FemaleEmployee;

                                  return (
                                    <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td>
                                        <div className="d-flex align-items-center">
                                          <div className="tbl-pro-img">
                                            <img
                                              src={profilePhotoUrlFetch}
                                              alt="Profile"
                                              className="profile-photo"
                                            />
                                          </div>
                                          <div className="">
                                            {(() => {
                                              const names = (emp.employeeName || "").trim().split(/\s+/);
                                              return names.length === 1 ? names[0] : `${names[0]} ${names[names.length - 1]}`;
                                            })()}
                                          </div>
                                        </div>
                                      </td>
                                      <td>{emp.branchOffice || ""}</td>
                                      <td>₹ {formatSalary(emp.employeeSalary || 0)}</td>
                                      <td>{emp.workingDays || 0}</td>
                                      <td>{formatDate(emp.employeeJoiningDate) || ""}</td>
                                      <td>{emp.presentCount || 0}</td>
                                      <td>{emp.leaveCount || 0}</td>
                                      <td>{emp.halfDayCount || 0}</td>
                                      <td>-</td>
                                      <td>-</td>
                                      <td>-</td>
                                      <td>-</td>
                                      <td>-</td>
                                      <td>-</td>
                                      <td>-</td>
                                      <td>-</td>
                                      <td>-</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            ) : (
                              <tbody>
                                <tr>
                                  <td colSpan="19" style={{ textAlign: "center" }}>
                                    <div className="no_data_table_inner">
                                      <Nodata />
                                    </div>
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


              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default EmployeeSalaryView;