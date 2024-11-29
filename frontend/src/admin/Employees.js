import React, { useState, useEffect, useRef } from "react";
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
import { MdDelete } from "react-icons/md";
import { MdOutlineAddCircle } from "react-icons/md";
import "../assets/styles.css";
import "../assets/table.css";
import Swal from "sweetalert2";
import ClipLoader from "react-spinners/ClipLoader";
import io from "socket.io-client";
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
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MaleEmployee from "../static/EmployeeImg/office-man.png";
import FemaleEmployee from "../static/EmployeeImg/woman.png";
import { FaWhatsapp } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import { BsFilter } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";
import AddEmployeeDialog from "./ExtraComponent/AddEmployeeDialog";
import EmployeeFilter from "./ExtraComponent/EmployeeFilter.jsx";
import { useQuery } from "@tanstack/react-query";

function Employees({ onEyeButtonClick, openAddEmployeePopup, closeAddEmployeePopup, searchValue, employeeData, setEmployeeData, setEmployeeDataCount, dataToFilterEmployee, completeEmployeeData, filteredDataEmployee, setFilteredDataEmployee, activeFilterFieldEmployee, setActiveFilterFieldEmployee, activeFilterFieldsEmployee, setActiveFilterFieldsEmployee, isLoading, refetchActive, refetchDeleted }) {

  // console.log("Search value from employee list is :", searchValue);
  // console.log("Employee data is :", employeeData);

  const secretKey = process.env.REACT_APP_SECRET_KEY;

  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [companyDdata, setCompanyDdata] = useState([]);
  const [nametodelete, setnametodelete] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState([]);
  const [cdata, setCData] = useState([]);
  const [filteredData, setFilteredData] = useState(employeeData || []);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedDataId, setSelectedDataId] = useState("2024-01-03");
  const [bdeFields, setBdeFields] = useState([]);
  const [ename, setEname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [department, setDepartment] = useState("");
  const [newDesignation, setNewDesignation] = useState("");
  const [jdate, setJdate] = useState(null);
  // const [designation, setDesignation] = useState("");
  const [branchOffice, setBranchOffice] = useState("");
  const [reportingManager, setReportingManager] = useState("");
  const [nowFetched, setNowFetched] = useState(false);
  const [otherdesignation, setotherDesignation] = useState("");
  const [companyData, setCompanyData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isDepartmentSelected, setIsDepartmentSelected] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [empId, setEmpId] = useState("");
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  // Filter states for employees
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [noOfAvailableData, setnoOfAvailableData] = useState(0);
  const [filterPosition, setFilterPosition] = useState({ top: 10, left: 5 });
  const fieldRefs = useRef({});
  const filterMenuRef = useRef(null); // Ref for the filter menu container

  const isActiveField = (field) => activeFilterFieldsEmployee.includes(field);

  const handleFilter = (newData) => {
    // console.log("newData", newData);
    setFilteredDataEmployee(newData);
    setEmployeeData(newData);
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

  const validate = () => {
    const newErrors = {};
    if (!firstName) newErrors.firstName = "First name is required";
    if (!middleName) newErrors.middleName = "Middle name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (!department || department === "Select Department") newErrors.department = "Department is required";
    if (!newDesignation || newDesignation === "Select Designation") newErrors.newDesignation = "Designation is required";
    if (!branchOffice) newErrors.branchOffice = "Branch office is required";
    if (!reportingManager || reportingManager === "Select Manager") newErrors.reportingManager = "Reporting manager is required";
    if (!number) newErrors.number = "Phone number is required";
    if (!jdate) newErrors.jdate = "Joining date is required";

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailPattern.test(email)) newErrors.email = "Invalid email";

    // Phone number validation (Indian phone number)
    const phonePattern = /^(?:\+91|91)?[789]\d{9}$/;
    if (number && !phonePattern.test(number)) newErrors.number = "Invalid phone number";

    return newErrors;
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

  const departmentDesignations = {
    "Start-Up": [
      "Admin Head",
      "Accountant",
      "Data Analyst",
      "Content Writer",
      "Graphic Designer",
      "Company Secretary",
      "Admin Head",
      "Admin Executive",
    ],
    HR: ["HR Manager", "HR Recruiter"],
    Operation: [
      "Finance Analyst",
      "Content Writer",
      "Relationship Manager",
      "Graphic Designer",
      "Research Analyst",
    ],
    IT: [
      "Web Developer",
      "Software Developer",
      "SEO Executive",
      "Graphic Designer",
      "Content Writer",
      "App Developer",
      "Digital Marketing Executive",
      "Social Media Executive",
    ],
    Sales: [
      "Business Development Executive",
      "Business Development Manager",
      // "Sales Manager",
      "Team Leader",
      "Floor Manager",
    ],
    Others: ["Receptionist"],
  };

  const departmentManagers = {
    "Start-Up": [
      "Mr. Ronak Kumar",
      "Mr. Krunal Pithadia",
      "Mr. Saurav Mevada",
      "Miss. Dhruvi Gohel"
    ],
    HR: [
      "Mr. Ronak Kumar",
      "Mr. Krunal Pithadia",
      "Mr. Saurav Mevada",
      "Miss. Hiral Panchal"
    ],
    Operation: [
      "Miss. Subhi Banthiya",
      "Mr. Rahul Pancholi",
      "Mr. Ronak Kumar",
      "Mr. Nimesh Parekh"
    ],
    IT: ["Mr. Nimesh Parekh"],
    Sales: [
      "Mr. Vaibhav Acharya",
      "Mr. Vishal Gohel"
    ],
    Others: ["Miss. Hiral Panchal"],
  }

  const renderDesignationOptions = () => {
    const designations = departmentDesignations[department] || [];
    return designations.map((designation, index) => (
      <option key={index} value={designation}>
        {designation}
      </option>
    ));
  };

  const renderManagerOptions = () => {
    const managers = departmentManagers[department] || [];
    return managers.map((manager, index) => (
      <option key={index} value={manager}>
        {manager}
      </option>
    ));
  };

  const defaultObject = {
    year: "",
    month: "",
    amount: 0,
    achievedAmount: 0,
    ratio: 0,
    result: "N/A"
  };

  const [targetObjects, setTargetObjects] = useState([defaultObject]);
  const [targetCount, setTargetCount] = useState(1);

  const [open, openchange] = useState(false);

  const handleEyeButtonClick = (id) => {
    onEyeButtonClick(id);
    //console.log(id);
  };

  // const updateActiveStatus = async () => {
  //   try {
  //     const response = await axios.get(`${secretKey}/employee/einfo`);
  //     if (adminName === "Saurav" || adminName === "Krunal Pithadia") {
  //       // setData(response.data.filter(obj => obj.designation === "Sales Executive" || obj.designation === "Sales Manager"));
  //       setFilteredData(response.data.filter(obj => obj.designation === "Sales Executive" || obj.designation === "Sales Manager"));

  //     } else {
  //       // setData(response.data);
  //       setFilteredData(response.data);
  //     }

  //   } catch (error) {
  //     console.error('Error fetching employee info:', error);
  //   }
  // };

  useEffect(() => {
    document.title = `Admin-Sahay-CRM`;
  }, []);

  const [dataToDelete, setDataToDelete] = useState([]);

  const handledeletefromcompany = async (filteredCompanyData , ename) => {
    if (filteredCompanyData && filteredCompanyData.length !== 0) {
      // console.log("Filtered company data is :", filteredCompanyData);
      try {
        // Update companyData in the second database
        await Promise.all(
          filteredCompanyData.map(async (item) => {
            // if (item.Status === 'Matured') {
            if (item.Status === "Matured") {
              await axios.put(`${secretKey}/company-data/updateCompanyForDeletedEmployeeWithMaturedStatus/${item._id}`)
            } else {
              await axios.delete(`${secretKey}/company-data/newcompanynamedelete/${ename}`);
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

  const handleDeleteClick = async (itemId, nametochange, dataToDelete, filteredCompanyData) => {
    // Open the confirm delete modal
    // console.log(nametochange)
    // console.log("filtered" , filteredCompanyData)
    setCompanyDdata(filteredCompanyData);
    setItemIdToDelete(itemId);
    // console.log("nameToChange", nametochange)

    // console.log("object");
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to remove ${nametochange}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then(async (result) => {

      // console.log("dataTODELETE", dataToDelete);

      if (result.isConfirmed) {
        try {
          const saveResponse = await axios.put(`${secretKey}/employee/savedeletedemployee`, {
            dataToDelete,
          });

          //deletes_from_main_employee_model--------------------------
          const deleteResponse = await axios.delete(`${secretKey}/employee/einfo/${itemId}`);
          //updates_bookingdata_for_deleted_employee----------------------
          const response3 = await axios.put(`${secretKey}/bookings/updateDeletedBdmStatus/${nametochange}`)




          // Refresh the data after successful deletion
          handledeletefromcompany(filteredCompanyData , nametochange);
          //fetchData();
          refetchActive();
          refetchDeleted();
          setDataToDelete([]);

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
      } else {
        Swal.fire({
          title: 'Cancelled',
          text: 'Employee is safe!',
          icon: 'info',
        });
      }
    });
  };

  const [bdmWork, setBdmWork] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortedFormat, setSortedFormat] = useState({
    ename: "ascending",
    jdate: "ascending",
    addedOn: "ascending",
  });

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

    if (adminName === "Saurav" || adminName === "Krunal Pithadia") {
      setFilteredData(filtered.filter(obj => obj.designation === "Sales Executive" || obj.designation === "Sales Manager"));
    } else {
      setFilteredData(filtered)
    }
  };

  const handleUpdateClick = (id, echangename) => {
    // Set the selected data ID and set update mode to true
    setSelectedDataId(id);
    setIsUpdateMode(true);
    setCompanyData(cdata.filter((item) => item.ename === echangename));
    // Find the selected data object
    const selectedData = employeeData.find((item) => item._id === id);
    console.log("selectedData", selectedData)
    setNowFetched(selectedData.targetDetails.length !== 0 ? true : false);
    setTargetCount(selectedData.targetDetails.length !== 0 ? selectedData.targetDetails.length : 1);
    setTargetObjects(
      selectedData.targetDetails.length !== 0
        ? selectedData.targetDetails
        : [
          {
            year: "",
            month: "",
            amount: 0,
            achievedAmount: 0,
            ratio: 0,
            result: "N/A"
          },
        ]
    );

    // Update the form data with the selected data values
    setEmail(selectedData.email);
    setFirstName((selectedData.empFullName || "").split(" ")[0] || "")
    setMiddleName((selectedData.empFullName || "").split(" ")[1] || "")
    setLastName((selectedData.empFullName || "").split(" ")[2] || "")
    setEname(selectedData.ename);
    setNumber(selectedData.number);
    setPassword(selectedData.password);
    setBdmWork(selectedData.bdmWork);
    setDepartment(selectedData.department);
    setNewDesignation(selectedData.newDesignation);
    setBranchOffice(selectedData.branchOffice);
    setReportingManager(selectedData.reportingManager);

    const dateObject = new Date(selectedData.jdate);
    const day = dateObject.getDate().toString().padStart(2, "0"); // Ensure two-digit day
    const month = (dateObject.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const year = dateObject.getFullYear();
    const formattedDateString = `${year}-${month}-${day}`;

    // setJdate('2004-04-04');
    setJdate(formattedDateString);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${secretKey}/employee/permanentDelete/${id}`);
      // Refresh the data after successful deletion
      // fetchData();
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

  const { data: leadData } = useQuery({
    queryKey: ["companyData"],
    queryFn: () => axios.get(`${secretKey}/company-data/leads`),
    staleTime: 5 * 60 * 1000, // Optional: Cache data for 5 minutes to avoid unnecessary requests
    refetchInterval: 5 * 60 * 1000,  // Refetch every 5 minutes (300,000 milliseconds)
  });

  useEffect(() => {
    if (leadData?.data) {
      setCData(leadData.data);
    }
  }, [leadData?.data]);

  const functionopenpopup = () => {
    openchange(true);
  };

  const closepopup = () => {
    openchange(false);
    setOpenEditPopup(false);
  };

 
  //console.log(new Date("06/02/2024").toLocaleDateString('en-GB'));

  const sortDataByName = () => {
    if (sortedFormat.ename === "ascending") {
      setSortedFormat({
        ...sortedFormat, // Spread the existing properties
        ename: "descending", // Update the jdate property
      });

      const sortedData = [...filteredData].sort((a, b) =>
        a.ename.localeCompare(b.ename)
      );
      if (adminName === "Saurav" || adminName === "Krunal Pithadia") {
        setFilteredData(sortedData.filter(obj => obj.designation === "Sales Executive" || obj.designation === "Sales Manager"));
      } else {
        setFilteredData(sortedData)
      }
    } else {
      setSortedFormat({
        ...sortedFormat, // Spread the existing properties
        ename: "ascending", // Update the jdate property
      });

      const sortedData = [...filteredData].sort((a, b) =>
        b.ename.localeCompare(a.ename)
      );
      if (adminName === "Saurav" || adminName === "Krunal Pithadia") {
        setFilteredData(sortedData.filter(obj => obj.designation === "Sales Executive" || obj.designation === "Sales Manager"));
      } else {
        setFilteredData(sortedData)
      }
    }
  };

  const adminName = localStorage.getItem("adminName")

  const sortDateByAddedOn = () => {
    if (sortedFormat.addedOn === "ascending") {
      setSortedFormat({
        ...sortedFormat, // Spread the existing properties
        addedOn: "descending", // Update the jdate property
      });

      const sortedData = [...filteredData].sort((a, b) =>
        a.AddedOn.localeCompare(b.AddedOn)
      );
      if (adminName === "Saurav" || adminName === "Krunal Pithadia") {
        setFilteredData(sortedData.filter(obj => obj.designation === "Sales Executive" || obj.designation === "Sales Manager"));
      } else {
        setFilteredData(sortedData)
      }
    } else {
      setSortedFormat({
        ...sortedFormat, // Spread the existing properties
        addedOn: "ascending", // Update the jdate property
      });

      const sortedData = [...filteredData].sort((a, b) =>
        b.AddedOn.localeCompare(a.AddedOn)
      );
      if (adminName === "Saurav" || adminName === "Krunal Pithadia") {
        setFilteredData(sortedData.filter(obj => obj.designation === "Sales Executive" || obj.designation === "Sales Manager"));
      } else {
        setFilteredData(sortedData)
      }
    }
  };

  const sortDataByJoiningDate = () => {
    if (sortedFormat.jdate === "ascending") {
      setSortedFormat({
        ...sortedFormat, // Spread the existing properties
        jdate: "descending", // Update the jdate property
      });

      const sortedData = [...filteredData].sort(
        (a, b) => new Date(a.jdate) - new Date(b.jdate)
      );
      if (adminName === "Saurav" || adminName === "Krunal Pithadia") {
        setFilteredData(sortedData.filter(obj => obj.designation === "Sales Executive" || obj.designation === "Sales Manager"));
      } else {
        setFilteredData(sortedData)
      }
    } else {
      setSortedFormat({
        ...sortedFormat, // Spread the existing properties
        jdate: "ascending", // Update the jdate property
      });

      const sortedData = [...filteredData].sort(
        (a, b) => new Date(b.jdate) - new Date(a.jdate)
      );
      if (adminName === "Saurav" || adminName === "Krunal Pithadia") {
        setFilteredData(sortedData.filter(obj => obj.designation === "Sales Executive" || obj.designation === "Sales Manager"));
      } else {
        setFilteredData(sortedData)
      }
    }
  };

  function formatDateFinal(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // -------------------------------------------------    ADD Target Section   --------------------------------------------------
  const handleAddTarget = () => {
    const totalTargets = targetObjects;
    totalTargets.push(defaultObject);
    setTargetCount(targetCount + 1);
    setTargetObjects(totalTargets);
  };

  const handleRemoveTarget = () => {
    const totalTargets = targetObjects;
    totalTargets.pop();
    setTargetCount(targetCount - 1);
    setTargetObjects(totalTargets);
  };

  //console.log("target objects:", targetObjects)

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

  const handleChecked = async (employeeId, bdmWork, item) => {
    // console.log("BDM Condition is :", bdmWork);
    // console.log("Data to be updated :", item);
    const updatedDesignation = "Business Development Executive";

    const dataToUpdate = {
      ...item,
      bdmWork: !bdmWork,
      newDesignation: updatedDesignation
    };

    if (bdmWork === true || bdmWork === false) {
      try {
        const response = await axios.put(`${secretKey}/employee/einfo/${employeeId}`, dataToUpdate);
        // console.log("Updated bdm status is :", response.data);
        // fetchData();
        refetchActive();
      } catch (error) {
        console.log("Errro updating bdm status :", error);
      }
    }

    if (!bdmWork) {
      try {
        const response = await axios.post(`${secretKey}/employee/post-bdmwork-request/${employeeId}`, {
          bdmWork: true
        });

        // fetchData();
        refetchActive();

        //console.log(response.data)
        setTimeout(() => {
          Swal.fire('BDM Work Assigned!', '', 'success');
        }, 500);

      } catch (error) {
        console.log("error message", error.message);
        // Show error message
        Swal.fire('Error', 'An error occurred while assigning BDM work.', 'error');
      }
    } else {
      try {
        const response = await axios.post(`${secretKey}/employee/post-bdmwork-revoke/${employeeId}`, {
          bdmWork: false
        });
        // fetchData(); // Assuming this function fetches updated employee details
        refetchActive();
        setTimeout(() => {
          Swal.fire('BDM Work Revoked!', '', 'success');
        }, 500);

      } catch (error) {
        console.error("Error revoking BDM work:", error);
        // Show error message
        Swal.fire('Error', 'An error occurred while revoking BDM work.', 'error');
      }
    }
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

              {/* <th>Probation Status</th> */}

              {
                (adminName === "Nimesh" ||
                  adminName === "Ronak Kumar" ||
                  adminName === "shivangi" ||
                  adminName === "Karan") && (
                  <>
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
                        {showFilterMenu && activeFilterFieldEmployee === 'AddedOn' && (
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

                    <th>Status</th>

                    <th>BDM Work</th>

                    <th>Action</th>
                  </>
                )}

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
            // ) : (searchValue ? searchResult : filteredData).length !== 0 ? (
          ) : employeeData?.length !== 0 ? (
            <tbody className="table-tbody">
              {/* {(searchValue ? searchResult : filteredData).map((item, index) => { */}
              {employeeData?.map((item, index) => {
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
                            // Split the item.ename string into an array of words based on spaces
                            const names = (item.ename || "").trim().split(/\s+/);

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
                    {/* <td>
                      <span className={getBadgeClass(calculateProbationStatus(item.jdate))}>
                        {calculateProbationStatus(item.jdate)}
                      </span>
                    </td> */}
                    {(adminName === "Nimesh" || adminName === "nisarg" || adminName === "Ronak Kumar" || adminName === "Aakash" || adminName === "shivangi" || adminName === "Karan") && (
                      <>
                        <td>
                          {formattedDate(item.AddedOn) === "Invalid Date"
                            ? "06/02/2024"
                            : formattedDate(item.AddedOn)}
                        </td>
                        {item.Active ? (
                          <td>
                            {(item.Active && item.Active.includes("GMT")) ? (
                              <div>
                                <span style={{ color: "red", marginRight: "5px" }}>●</span>
                                <span style={{ fontWeight: "bold", color: "rgb(170 144 144)" }} title={formatDateWP(item.Active)}>
                                  Offline
                                </span>
                              </div>
                            ) : (
                              <div>
                                <span style={{ color: "green", marginRight: "5px" }}>●</span>
                                <span style={{ fontWeight: "bold", color: "green" }}>Online</span>
                              </div>
                            )}
                          </td>
                        ) : (
                          <td>N/A</td>
                        )}
                        <td>
                          <Stack direction="row" spacing={10} alignItems="center" justifyContent="center">
                            <AntSwitch checked={item.bdmWork} inputProps={{ 'aria-label': 'ant design' }}
                              disabled={item.newDesignation !== "Business Development Executive" && item.newDesignation !== "Business Development Manager"}
                              onClick={(event) => {
                                handleChecked(item._id, item.bdmWork, item)
                              }} />
                          </Stack>
                        </td>
                        <td>
                          <button className="action-btn action-btn-primary">
                            {/* <Link
                              style={{ textDecoration: "none", color: 'inherit' }}
                              to={`/md/employees/${item._id}`}
                            >
                              <FaRegEye />
                            </Link> */}
                            <Link
                              style={{ textDecoration: "none", color: 'inherit' }}
                              to={`/md/employeeProfileView/${item._id}`}
                            >
                              <FaRegEye />
                            </Link>
                          </button>
                          <button className="action-btn action-btn-alert ml-1"
                            onClick={() => {
                              // functionopenpopup();
                              setEmpId(item._id);
                              setOpenEditPopup(true);
                              handleUpdateClick(item._id, item.ename);
                            }}
                          >
                            <MdModeEdit />
                          </button>
                          <button className="action-btn action-btn-danger ml-1"
                            onClick={async () => {
                              const dataToDelete = employeeData.filter(obj => obj._id === item._id);
                              setDataToDelete(dataToDelete);
                              const filteredCompanyData = cdata.filter((obj) => obj.ename === item.ename);
                              // console.log("filteredcompanydata", filteredCompanyData);
                              setCompanyDdata(filteredCompanyData);
                              handleDeleteClick(item._id, item.ename, dataToDelete, filteredCompanyData);
                            }}
                          >
                            <AiFillDelete />
                          </button>
                        </td>
                      </>
                    )}
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
      {/* Employee table */}
      <div
        onCopy={(e) => {
          e.preventDefault();
        }}
        className="mt-2 d-none"
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
                        onClick={sortDataByName}
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
                        onClick={sortDataByJoiningDate}
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
                    {(adminName === "Nimesh" || adminName === "nisarg" || adminName === "Ronak Kumar" || adminName === "Aakash" || adminName === "shivangi" || adminName === "Karan") && <> <th>
                      <button
                        onClick={sortDateByAddedOn}
                        className="table-sort"
                        data-sort="sort-date"
                      >
                        Added on
                      </button>
                    </th>
                      <th>
                        <button className="table-sort" data-sort="sort-date">
                          Status
                        </button>
                      </th>
                      {/* <th>Team Name</th> */}
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
                      </th> </>}
                  </tr>
                </thead>
                {filteredData.length == 0 ? (
                  <tbody>
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
                  <tbody className="table-tbody">
                    {filteredData.map((item, index) => (
                      <tr key={index} style={{ border: "1px solid #ddd" }}>
                        <td className="td-sticky">{index + 1}</td>
                        <td>{(() => {
                          // Split the item.ename string into an array of words based on spaces
                          const names = (item.ename || "").trim().split(/\s+/);



                          // Check if there's only one name or multiple names
                          if (names.length === 1) {
                            return names[0]; // If there's only one name, return it as-is
                          }

                          // Return the first and last name, or an empty string if not available
                          return `${names[0] || ""} ${names[names.length - 1] || ""}`;
                        })()}</td>
                        <td>{item.number}</td>
                        <td>{item.email}</td>
                        <td>{formattedDate(item.jdate)}</td>
                        <td>{item.newDesignation === "Business Development Executive" && "BDE" || item.newDesignation === "Business Development Manager" && "BDM" || item.newDesignation || ""}</td>
                        <td>{item.branchOffice}</td>
                        {(adminName === "Nimesh" || adminName === "Ronak Kumar" || adminName === "shivangi" || adminName === "Karan")
                          &&

                          <>
                            <td>
                              {formattedDate(item.AddedOn) === "Invalid Date"
                                ? "06/02/2024"
                                : formattedDate(item.AddedOn)}
                            </td>
                            {item.designation === "Sales Executive" && <td>
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
                            </td>}
                            {item.designation !== "Sales Executive" && <td>
                              N/A
                            </td>}

                            <td>
                              <Stack direction="row" spacing={10} alignItems="center" justifyContent="center">
                                <AntSwitch checked={item.bdmWork} inputProps={{ 'aria-label': 'ant design' }}
                                  disabled={item.newDesignation !== "Business Development Executive" && item.newDesignation !== "Business Development Manager"}
                                  onClick={(event) => {
                                    handleChecked(item._id, item.bdmWork, item)
                                  }} />
                              </Stack>
                            </td>

                            <td>
                              <div className="d-flex justify-content-center align-items-center">
                                {<div className="icons-btn">
                                  <IconButton
                                    onClick={async () => {
                                      const dataToDelete = data.filter(obj => obj._id === item._id);
                                      setDataToDelete({
                                        ...dataToDelete,
                                        personal_number: "0",
                                        personal_email: "example@gmail.com"
                                      });
                                      const filteredCompanyData = cdata.filter((obj) => obj.ename === item.ename);
                                      setCompanyDdata(filteredCompanyData);
                                      handleDeleteClick(item._id, item.ename, dataToDelete, filteredCompanyData);
                                    }}
                                  >
                                    <IconTrash
                                      style={{
                                        cursor: "pointer",
                                        color: "red",
                                        width: "14px",
                                        height: "14px",
                                      }}
                                    />
                                  </IconButton>

                                </div>}
                                <div className="icons-btn">
                                  <IconButton
                                    onClick={() => {
                                      functionopenpopup();
                                      handleUpdateClick(item._id, item.ename);
                                    }}
                                  >
                                    <ModeEditIcon
                                      style={{
                                        cursor: "pointer",
                                        color: "#a29d9d",
                                        width: "14px",
                                        height: "14px",
                                      }}
                                    />
                                  </IconButton>
                                </div>
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
                                </div>
                              </div>
                            </td>
                          </>
                        }
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>

      <AddEmployeeDialog
        empId={empId}
        openForAdd={openAddEmployeePopup}
        closeForAdd={closeAddEmployeePopup}
        openForEdit={openEditPopup}
        closeForEdit={closepopup}
        refetch={refetchActive}
      />
    </div>
  );
}

export default Employees;