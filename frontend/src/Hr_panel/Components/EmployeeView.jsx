import React, { useEffect, useState, CSSProperties, useRef } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "./Header/Header.jsx";
import axios from "axios";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
//import { DateRangePicker } from "react-date-range";
import EmpImg1 from "../../static/EmployeeImg/Emp1.jpeg"
import EmpImg2 from "../../static/EmployeeImg/Emp2.jpeg"
import EmpDfaullt from "../../static/EmployeeImg/office-man.png";
import MaleEmployee from "../../static/EmployeeImg/office-man.png";
import FemaleEmployee from "../../static/EmployeeImg/woman.png";
import { MdOutlineCameraAlt } from "react-icons/md";
import logo from "../../static/mainLogo.png"
import { FaCamera } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import { TbPhoneCall } from "react-icons/tb";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { HiOutlineBuildingLibrary } from "react-icons/hi2";
import { MdOutlinePersonPin } from "react-icons/md";
import { GoPerson } from "react-icons/go";
import { GrLocation } from "react-icons/gr";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Calendar } from "@fullcalendar/core";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
} from "@mui/material";
import Swal from 'sweetalert2';
import { GiRelationshipBounds } from "react-icons/gi";
import CloseIcon from "@mui/icons-material/Close";
import Navbar from "./Navbar/Navbar.jsx";
import { HiPencil } from "react-icons/hi";
import { BsGenderTrans } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
import { IoCalendarClearOutline } from "react-icons/io5";
import { FcBusinesswoman } from "react-icons/fc";
import { PiPhoneCall } from "react-icons/pi";
import { MdOutlineMailOutline } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";
import { color } from "@mui/system";
import { FcBriefcase } from "react-icons/fc";
import { IoCall } from "react-icons/io5";
import EmployeeViewAttendance from "./EmployeeView/EmloyeeViewAttendance.jsx";
import EmployeeViewPayrollView from "./EmployeeView/EmployeePayrollView.jsx";
import SalaryCalculationView from "./EmployeeView/SalaryCalculationView.jsx";
import LeaveReportView from "./EmployeeView/LeaveReportView.jsx";
import CallingReportView from "./EmployeeView/CallingReportView.jsx";
import BusinessCardView from "./EmployeeView/BusinessCardView.jsx";
import { MdOutlineBloodtype } from "react-icons/md";

function EmployeeView() {

  const { userId } = useParams();
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const personalUserId = localStorage.getItem("hrUserId");

  const { newtoken } = useParams();
  const [data, setdata] = useState([]);
  const [myInfo, setMyInfo] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [showProfileUploadWindow, setShowProfileUploadWindow] = useState(false);
  const [editField, setEditField] = useState("");

  const [officialEmail, setOfficialEmail] = useState("");
  const [officialNumber, setOfficialNumber] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [department, setDepartment] = useState("");
  const [branchOffice, setBranchOffice] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [reportingManager, setReportingManager] = useState("");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [bloodGroup, setBloodGroup] = useState("")
  const [gender, setGender] = useState("");
  const [personalNumber, setPersonalNumber] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [emergencyContactNumber, setEmergencyContactNumber] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");

  const [empImg1, setEmpImg1] = useState(
    localStorage.getItem("empImg1") || "initial_image_url"
  );

  useEffect(() => {
    document.title = `HR-Sahay-CRM`;
  }, []);

  const [selectedFile, setSelectedFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [editempinfo, setEditEmpInfo] = useState(false);

  // const [personal_email, setPersonalEmail] = useState('');
  // const [personal_number, setPersonalPhone] = useState('');
  // const [personal_contact_person, setContactPerson] = useState('');
  // const [personal_address, setPersonalAddress] = useState('');

  useEffect(() => {
    const savedImage = localStorage.getItem("empImg1");
    if (savedImage) {
      setEmpImg1(savedImage);
    }
  }, []);

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
  };

  const renderManagerOptions = () => {
    const managers = departmentManagers[data.department] || [];
    return managers.map((manager, index) => (
      <option key={index} value={manager}>
        {manager}
      </option>
    ));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.match("image/jpeg|image/png|image/jpg")) {
      setSelectedFile(file);
    } else {
      alert("Please select a valid image file (JPG, JPEG, PNG).");
    }
  };

  const handleSubmit = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("profilePhoto", selectedFile);

      try {
        const response = await axios.put(`${secretKey}/employee/updateEmployeeFromId/${data._id}`, formData, {
          headers: {
            // "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${newtoken}`,
          },
        });
        //console.log("File upload success:", response.data);
        Swal.fire("Success", "Profile photo successfully uploaded", "success");
        const imageUrl = response.data.imageUrl;
        setEmpImg1(imageUrl);
        localStorage.setItem("empImg1", imageUrl);
        fetchEmployeeData();
        setShowProfileUploadWindow(false);
      } catch (error) {
        console.error("Error uploading file:", error);
        Swal.fire("Error", "Error uploading profile photo", "error");
      }
    } else {
      alert("No file selected.");
    }
  };

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const formatDateForInput = (date) => {
    return date ? new Date(date).toISOString().split('T')[0] : "";
  };

  function formatDateNew(timestamp) {
    const date = new Date(timestamp);

    // Day with suffix
    const day = date.getDate();
    const suffix = getDaySuffix(day);

    // Month names array to convert month number to name
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()]; // Get month name

    // Year
    const year = date.getFullYear();

    // Return formatted date string
    return `${day}${suffix} ${month} ${year}`;
  }

  // Function to get the suffix for the day (st, nd, rd, th)
  function getDaySuffix(day) {
    if (day > 3 && day < 21) return "th"; // Special case for 11th to 19th
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  }

  // const handleCameraClick = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  //-----------------fetching employee details----------------------------------
  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(`${secretKey}/employee/einfo`);
      // console.log(response.data, userId);
      const tempData = response.data;
      const data = tempData.find((item) => item._id === userId);
      // console.log(data);
      setEmployeeData(data);

      // set the personal details fields
      // setPersonalEmail(data.personal_email || '')
      // setPersonalPhone(data.personal_number || '');
      // setContactPerson(data.personal_contact_person || '');
      // setPersonalAddress(data.personal_address || '');

      setdata(data);
      setDepartment(data.department);
      setEmploymentType(data.employeementType);
      setDob(data.dob);
      setBloodGroup(data.bloodGroup)
      setGender(data.gender);
      setRelationship(data.relationship);
      setCurrentAddress(data.currentAddress);
      setPermanentAddress(data.permanentAddress);

    } catch (error) {
      console.error("Error fetching employee data", error);
    }
  };

  const fetchPersonalInfo = async () => {
    try {
      const res = await axios.get(`${secretKey}/employee/fetchEmployeeFromId/${personalUserId}`);
      // console.log("Fetched details is :", res.data.data);
      setMyInfo(res.data.data);
    } catch (error) {
      console.log("Error fetching employee details :", error);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
    fetchPersonalInfo();
  }, []);

  const fullNameArray = fullName.split(" ");
  // console.log("Full name array is :", fullNameArray);
  // console.log("Full name is :", fullName);
  let firstName = fullNameArray[0];
  let middleName = fullNameArray[1];
  let lastName = fullNameArray[2];

  const handleSave = async () => {
    const payload = {
      officialEmail: officialEmail,
      officialNo: officialNumber,
      joiningDate: joiningDate,
      department: department,
      branch: branchOffice,
      employeementType: employmentType,
      manager: reportingManager,
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      dob: dob,
      bloodGroup: bloodGroup,
      gender: gender,
      personalPhoneNo: personalNumber,
      personalEmail: personalEmail,
      personName: emergencyContactName,
      relationship: relationship,
      personPhoneNo: emergencyContactNumber,
      currentAddress: currentAddress,
      permanentAddress: permanentAddress
    };
    try {
      const res = await axios.put(`${secretKey}/employee/updateEmployeeFromId/${userId}`, payload);
      //console.log("Updated details is :", res.data.data);
      fetchEmployeeData();
      Swal.fire("Success", "Employee details updated successfully", "success");
    } catch (error) {
      console.log("Error updating employee details :", error);
      Swal.fire("Error", "Error updating employee details", "error");
    }
  };



  return (
    <div>
      <Header id={myInfo._id} name={myInfo.ename} empProfile={myInfo.profilePhoto && myInfo.profilePhoto.length !== 0 && myInfo.profilePhoto[0].filename} gender={myInfo.gender} designation={myInfo.newDesignation} />
      <Navbar />
      <div className="page-wrapper">
        <div className="page-header m-0">
          <div className="container-xl">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item"><Link to="/hr/employees">Employee</Link></li>
                <li class="breadcrumb-item active" aria-current="page">Employee Profile</li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="page-body hr_Dtl_box m-0">
          <div className="container-xl">
            <div className="d-flex mt-1">
              <div className="emply_e_card">
                <div className="my-card">
                  <div className="emply_e_card_profile">
                    <div className="p-3">
                      <label className="emply_e_card_profile_inner_lbl">
                        <div className="emply_e_card_profile_div">
                          {data.profilePhoto?.length !== 0 ? <img src={`${secretKey}/employee/fetchProfilePhoto/${data._id}/${encodeURIComponent(data.profilePhoto?.[0]?.filename)}`} />
                            : <img src={data.gender === "Male" ? MaleEmployee : FemaleEmployee} />
                          }
                          {/* <img src={MaleEmployee}></img> */}
                        </div>
                        <div className="emply_e_card_profile_update">
                          <div className="emply_e_card_profile_update_inner">
                            <MdOutlineCameraAlt className="emply_e_card_profile_update_icon" onClick={() => setShowProfileUploadWindow(true)} />
                            <p className="m-0 emply_e_card_profile_update_text" onClick={() => setShowProfileUploadWindow(true)}>Upload</p>
                          </div>
                        </div>
                      </label>
                    </div>
                    <div className="emply_e_card_profile_name bdr-left-eee">
                      <div className="EP_Name d-flex justify-content-between align-items-center">
                        <h3 className="m-0">
                          <span className="clr-ffb900">{data.ename || "-"}</span>
                          <div className="EP_Designation">{data.newDesignation || "-"}</div>
                        </h3>
                        <div className="employee_active">Active</div>
                      </div>
                      <div className="row m-0 aling-items-start">
                        <div className="col p-0">
                          <div className="EP_Other_info">
                            <div className="EP_Other_info_body">

                              <div className="row m-0 bdr-btm-eee">
                                <div className="col-5  pt-1 pb-1">
                                  <div className="d-flex align-items-center">
                                    <div className="ep_info_icon clr-ffb900">
                                      <FaRegCircleUser />
                                    </div>
                                    <div className="ep_info_h">
                                      Employee Id :
                                    </div>
                                  </div>
                                </div>
                                <div className="col-7  pt-1 pb-1 bdr-left-eee">
                                  <div className="">
                                    <div className="ep_info_t">{data.employeeID || "-"}</div>
                                  </div>
                                </div>
                              </div>

                              <div className="row m-0 bdr-btm-eee">
                                <div className="col-5  pt-1 pb-1">
                                  <div className="d-flex align-items-center">
                                    <div className="ep_info_icon clr-ffb900">
                                      <MdOutlineEmail />
                                    </div>
                                    <div className="ep_info_h">Email :</div>
                                  </div>
                                </div>
                                <div className="col-7 pt-1 pb-1 bdr-left-eee">
                                  {editField !== "officialEmail" ? (
                                    <div className="d-flex align-items-center justify-content-between ep_info">
                                      <div className="ep_info_t">
                                        {data.email || "-"}
                                      </div>
                                      <div className="ep_info_icon">
                                        <MdOutlineEdit onClick={() => {
                                          if (editField !== "") {
                                            Swal.fire("Error", "Please save your changes before editing this field", "error");
                                            return;
                                          }
                                          setOfficialEmail(data.email);
                                          setEditField("officialEmail");
                                        }} />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="d-flex align-items-center justify-content-between">
                                      <div className="ep_info_form">
                                        <input type="email" className="ep_info_input form-control"
                                          value={officialEmail} onChange={(e) => setOfficialEmail(e.target.value)} />
                                      </div>
                                      <div className="ep_info_icon">
                                        <FaRegSave onClick={() => {
                                          setEditField("");
                                          handleSave();
                                        }} />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="row m-0 bdr-btm-eee">
                                <div className="col-5 pt-1 pb-1">
                                  <div className="d-flex align-items-center">
                                    <div className="ep_info_icon clr-ffb900">
                                      <TbPhoneCall />
                                    </div>
                                    <div className="ep_info_h">Phone No :</div>
                                  </div>
                                </div>
                                <div className="col-7 pt-1 pb-1 bdr-left-eee">
                                  {editField !== "officialNumber" ? (
                                    <div className="d-flex align-items-center justify-content-between ep_info">
                                      <div className="ep_info_t">
                                        {data.number || "-"}
                                      </div>
                                      <div className="ep_info_icon">
                                        <MdOutlineEdit onClick={() => {
                                          if (editField !== "") {
                                            Swal.fire("Error", "Please save your changes before editing this field", "error");
                                            return;
                                          }
                                          setOfficialNumber(data.number);
                                          setEditField("officialNumber");
                                        }} />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="d-flex align-items-center justify-content-between">
                                      <div className="ep_info_form">
                                        <input type="text" className="ep_info_input form-control"
                                          value={officialNumber} onChange={(e) => setOfficialNumber(e.target.value)} />
                                      </div>
                                      <div className="ep_info_icon">
                                        <FaRegSave onClick={() => {
                                          setEditField("");
                                          handleSave();
                                        }} />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="row m-0">
                                <div className="col-5  pt-1 pb-1">
                                  <div className="d-flex align-items-center">
                                    <div className="ep_info_icon clr-ffb900">
                                      <MdOutlineCalendarMonth />
                                    </div>
                                    <div className="ep_info_h">
                                      Joining Date :
                                    </div>
                                  </div>
                                </div>
                                <div className="col-7  pt-1 pb-1 bdr-left-eee">
                                  {editField !== "joiningDate" ? (
                                    <div className="d-flex align-items-center justify-content-between ep_info">
                                      <div className="ep_info_t">
                                        {data.jdate ? formatDateNew(data.jdate) : "-"}
                                      </div>
                                      <div className="ep_info_icon">
                                        <MdOutlineEdit onClick={() => {
                                          if (editField !== "") {
                                            Swal.fire("Error", "Please save your changes before editing this field", "error");
                                            return;
                                          }
                                          setJoiningDate(formatDateForInput(data.jdate));
                                          setEditField("joiningDate");
                                        }} />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="d-flex align-items-center justify-content-between">
                                      <div className="ep_info_form">
                                        <input type="date" className="ep_info_input form-control"
                                          value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} />
                                      </div>
                                      <div className="ep_info_icon">
                                        <FaRegSave onClick={() => {
                                          setEditField("");
                                          handleSave();
                                        }} />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <ul class="nav nav-tabs employee_e_info_tab" style={{ fontSize: '12px' }}>
                    <li class="nav-item">
                      <a class="nav-link active" data-bs-toggle="tab" href="#eI">Your Info</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" data-bs-toggle="tab" href="#Emergency_Contact">Emergency Contact</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" data-bs-toggle="tab" href="#PayrollInformation">Payroll Details</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" data-bs-toggle="tab" href="#BusinessCard">Business Card</a>
                    </li>
                  </ul>

                  <div class="tab-content employee_e_info_tab_content">
                    <div class="tab-pane active" id="eI">
                      <div className="my-card mt-2" >
                        {/* <div className="my-card-head">
                          Employment Information
                        </div> */}
                        <div className="my-card-body">

                          <div className="row m-0 bdr-btm-eee">
                            <div className="col-4 pt-1 pb-1">
                              <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                  <HiOutlineBuildingLibrary />
                                </div>
                                <div className="ep_info_h">Department :</div>
                              </div>
                            </div>
                            <div className="col-8 pt-1 pb-1 bdr-left-eee">
                              {editField !== "department" ? (
                                <div className="d-flex align-items-center justify-content-between ep_info">
                                  <div className="ep_info_t">
                                    {data.department || "-"}
                                  </div>
                                  <div className="ep_info_icon">
                                    <MdOutlineEdit onClick={() => {
                                      if (editField !== "") {
                                        Swal.fire("Error", "Please save your changes before editing this field", "error");
                                        return;
                                      }
                                      setDepartment(data.department);
                                      setEditField("department");
                                    }} />
                                  </div>
                                </div>
                              ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="ep_info_form">
                                    <select className="ep_info_select form-control"
                                      value={department} onChange={(e) => setDepartment(e.target.value)}>
                                      <option value="" selected>--Select Department--</option>
                                      <option value="Start-Up">Start-Up</option>
                                      <option value="HR">HR</option>
                                      <option value="Operation">Operation</option>
                                      <option value="IT">IT</option>
                                      <option value="Sales">Sales</option>
                                      <option value="Others">Others</option>
                                    </select>
                                  </div>
                                  <div className="ep_info_icon">
                                    <FaRegSave onClick={() => {
                                      setEditField("");
                                      handleSave();
                                    }} />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="row m-0  bdr-btm-eee">
                            <div className="col-4 pt-1 pb-1">
                              <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                  <HiOutlineBuildingLibrary />
                                </div>
                                <div className="ep_info_h">Branch :</div>
                              </div>
                            </div>
                            <div className="col-8 pt-1 pb-1 bdr-left-eee">
                              {editField !== "branchOffice" ? (
                                <div className="d-flex align-items-center justify-content-between ep_info">
                                  <div className="ep_info_t">
                                    {data.branchOffice || "-"}
                                  </div>
                                  <div className="ep_info_icon">
                                    <MdOutlineEdit onClick={() => {
                                      if (editField !== "") {
                                        Swal.fire("Error", "Please save your changes before editing this field", "error");
                                        return;
                                      }
                                      setBranchOffice(data.branchOffice);
                                      setEditField("branchOffice");
                                    }} />
                                  </div>
                                </div>
                              ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="ep_info_form">
                                    <select className="ep_info_select form-control"
                                      value={branchOffice} onChange={(e) => setBranchOffice(e.target.value)}>
                                      <option value="" selected>--Select Branch--</option>
                                      <option value="Gota">Gota</option>
                                      <option value="Sindhu Bhawan">Sindhu Bhawan</option>
                                    </select>
                                  </div>
                                  <div className="ep_info_icon">
                                    <FaRegSave onClick={() => {
                                      setEditField("");
                                      handleSave();
                                    }} />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="row m-0  bdr-btm-eee">
                            <div className="col-4 pt-1 pb-1">
                              <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                  <MdOutlinePersonPin />
                                </div>
                                <div className="ep_info_h">Employment Type :</div>
                              </div>
                            </div>
                            <div className="col-8 pt-1 pb-1 bdr-left-eee">
                              {editField !== "employmentType" ? (
                                <div className="d-flex align-items-center justify-content-between ep_info">
                                  <div className="ep_info_t">
                                    {data.employeementType || "-"}
                                  </div>
                                  <div className="ep_info_icon">
                                    <MdOutlineEdit onClick={() => {
                                      if (editField !== "") {
                                        Swal.fire("Error", "Please save your changes before editing this field", "error");
                                        return;
                                      }
                                      setEmploymentType(data.employeementType);
                                      setEditField("employmentType");
                                    }} />
                                  </div>
                                </div>
                              ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="ep_info_form">
                                    <select className="ep_info_select form-control"
                                      value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}>
                                      <option value="" selected>--Select Employment Type--</option>
                                      <option value="Full-time">Full-time</option>
                                      <option value="Part-time">Part-time</option>
                                      <option value="Contract">Contract</option>
                                      <option value="Intern">Intern</option>
                                      <option value="Other">Other</option>
                                    </select>
                                  </div>
                                  <div className="ep_info_icon">
                                    <FaRegSave onClick={() => {
                                      setEditField("");
                                      handleSave();
                                    }} />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="row m-0">
                            <div className="col-4 pt-1 pb-1">
                              <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                  <GoPerson />
                                </div>
                                <div className="ep_info_h">Reporting Manager :</div>
                              </div>
                            </div>
                            <div className="col-8 pt-1 pb-1 bdr-left-eee">
                              {editField !== "reportingManager" ? (
                                <div className="d-flex align-items-center justify-content-between ep_info">
                                  <div className="ep_info_t">
                                    {data.reportingManager || "-"}
                                  </div>
                                  <div className="ep_info_icon">
                                    <MdOutlineEdit onClick={() => {
                                      if (editField !== "") {
                                        Swal.fire("Error", "Please save your changes before editing this field", "error");
                                        return;
                                      }
                                      setReportingManager(data.reportingManager);
                                      setEditField("reportingManager");
                                    }} />
                                  </div>
                                </div>
                              ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="ep_info_form">
                                    <select className="ep_info_select form-control"
                                      value={reportingManager} onChange={(e) => setReportingManager(e.target.value)}>
                                      <option value="" selected>--Select Manager--</option>
                                      {data.department === "Sales" && data.newDesignation === "Floor Manager"
                                        ? <option value="Mr. Ronak Kumar">Mr. Ronak Kumar</option>
                                        : <>{renderManagerOptions()}</>
                                      }
                                    </select>
                                  </div>
                                  <div className="ep_info_icon">
                                    <FaRegSave onClick={() => {
                                      setEditField("");
                                      handleSave();
                                    }} />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>

                      <div className="my-card mt-2" >
                        {/* <div className="my-card-head">
                          Personal Information
                        </div> */}
                        <div className="my-card-body">

                          <div className="row m-0 bdr-btm-eee">
                            <div className="col-4 pt-1 pb-1">
                              <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                  <FaRegUser />
                                </div>
                                <div className="ep_info_h">Full Name :</div>
                              </div>
                            </div>
                            <div className="col-8 pt-1 pb-1 bdr-left-eee">
                              {editField !== "empFullName" ? (
                                <div className="d-flex align-items-center justify-content-between ep_info">
                                  <div className="ep_info_t">
                                    {data.empFullName || "-"}
                                  </div>
                                  <div className="ep_info_icon">
                                    <MdOutlineEdit onClick={() => {
                                      if (editField !== "") {
                                        Swal.fire("Error", "Please save your changes before editing this field", "error");
                                        return;
                                      }
                                      setFullName(data.empFullName);
                                      setEditField("empFullName");
                                    }} />
                                  </div>
                                </div>
                              ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="ep_info_form">
                                    <input type="text" className="ep_info_input form-control"
                                      value={fullName} onChange={(e) => setFullName(e.target.value)} />
                                  </div>
                                  <div className="ep_info_icon">
                                    <FaRegSave onClick={() => {
                                      setEditField("");
                                      handleSave();
                                    }} />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="row m-0 bdr-btm-eee">
                            <div className="col-4 pt-1 pb-1">
                              <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                  <IoCalendarClearOutline />
                                </div>
                                <div className="ep_info_h">DOB :</div>
                              </div>
                            </div>
                            <div className="col-8 pt-1 pb-1 bdr-left-eee">
                              {editField !== "dob" ? (
                                <div className="d-flex align-items-center justify-content-between ep_info">
                                  <div className="ep_info_t">
                                    {data.dob ? formatDateNew(data.dob) : "-"}
                                    {/* 2<sup>nd</sup> Dec 2024 */}
                                  </div>
                                  <div className="ep_info_icon">
                                    <MdOutlineEdit onClick={() => {
                                      if (editField !== "") {
                                        Swal.fire("Error", "Please save your changes before editing this field", "error");
                                        return;
                                      }
                                      setDob(formatDateForInput(data.dob));
                                      setEditField("dob");
                                    }} />
                                  </div>
                                </div>
                              ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="ep_info_form">
                                    <input type="date" className="ep_info_input form-control"
                                      value={dob} onChange={(e) => setDob(e.target.value)} />
                                  </div>
                                  <div className="ep_info_icon">
                                    <FaRegSave onClick={() => {
                                      setEditField("");
                                      handleSave();
                                    }} />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="row m-0 bdr-btm-eee">
                            <div className="col-4 pt-1 pb-1">
                              <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                  <MdOutlineBloodtype />
                                </div>
                                <div className="ep_info_h">Blood Group :</div>
                              </div>
                            </div>
                            <div className="col-8 pt-1 pb-1 bdr-left-eee">
                              {editField !== "bloodGroup" ? (
                                <div className="d-flex align-items-center justify-content-between ep_info">
                                  <div className="ep_info_t">
                                    {data.bloodGroup ? data.bloodGroup : "-"}
                                    {/* 2<sup>nd</sup> Dec 2024 */}
                                  </div>
                                  <div className="ep_info_icon">
                                    <MdOutlineEdit onClick={() => {
                                      if (editField !== "") {
                                        Swal.fire("Error", "Please save your changes before editing this field", "error");
                                        return;
                                      }
                                      setBloodGroup(data.bloodGroup);
                                      setEditField("bloodGroup");
                                    }} />
                                  </div>
                                </div>
                              ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="ep_info_form">
                                    <select className="ep_info_select form-control"
                                      value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                                      <option value="" selected>--Select Blood Group--</option>
                                      <option value="A Positive (A+)">A Positive (A+)</option>
                                      <option value="A Negative (A-)">A Negative (A-)</option>
                                      <option value="B Positive (B+)">B Positive (B+)</option>
                                      <option value="B Negative (B-)">B Negative (B-)</option>
                                      <option value="AB Positive (AB+)">AB Positive (AB+)</option>
                                      <option value="AB Negative (AB-)">AB Negative (AB-)</option>
                                      <option value="O Positive (O+)">O Positive (O+)</option>
                                      <option value="O Negative (O-)">O Negative (O-)</option>
                                    </select>
                                  </div>
                                  <div className="ep_info_icon">
                                    <FaRegSave onClick={() => {
                                      setEditField("");
                                      handleSave();
                                    }} />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="row m-0 bdr-btm-eee">
                            <div className="col-4 pt-1 pb-1 ">
                              <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                  <BsGenderTrans />
                                </div>
                                <div className="ep_info_h">Gender :</div>
                              </div>
                            </div>
                            <div className="col-8 pt-1 pb-1 bdr-left-eee">
                              {editField !== "gender" ? (
                                <div className="d-flex align-items-center justify-content-between ep_info">
                                  <div className="ep_info_t">
                                    {data.gender || "-"}
                                  </div>
                                  <div className="ep_info_icon">
                                    <MdOutlineEdit onClick={() => {
                                      if (editField !== "") {
                                        Swal.fire("Error", "Please save your changes before editing this field", "error");
                                        return;
                                      }
                                      setGender(data.gender);
                                      setEditField("gender");
                                    }} />
                                  </div>
                                </div>
                              ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="ep_info_form">
                                    <select className="ep_info_select form-control"
                                      value={gender} onChange={(e) => setGender(e.target.value)}>
                                      <option value="" selected>--Select Gender--</option>
                                      <option value="Male">Male</option>
                                      <option value="Female">Female</option>
                                    </select>
                                  </div>
                                  <div className="ep_info_icon">
                                    <FaRegSave onClick={() => {
                                      setEditField("");
                                      handleSave();
                                    }} />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="row m-0 bdr-btm-eee">
                            <div className="col-4 pt-1 pb-1">
                              <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                  <PiPhoneCall />
                                </div>
                                <div className="ep_info_h">Phone No :</div>
                              </div>
                            </div>
                            <div className="col-8 pt-1 pb-1 bdr-left-eee">
                              {editField !== "personalNumber" ? (
                                <div className="d-flex align-items-center justify-content-between ep_info">
                                  <div className="ep_info_t">
                                    {data.personal_number || "-"}
                                  </div>
                                  <div className="ep_info_icon">
                                    <MdOutlineEdit onClick={() => {
                                      if (editField !== "") {
                                        Swal.fire("Error", "Please save your changes before editing this field", "error");
                                        return;
                                      }
                                      setPersonalNumber(data.personal_number);
                                      setEditField("personalNumber");
                                    }} />
                                  </div>
                                </div>
                              ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="ep_info_form">
                                    <input type="text" className="ep_info_input form-control"
                                      value={personalNumber} onChange={(e) => setPersonalNumber(e.target.value)} />
                                  </div>
                                  <div className="ep_info_icon">
                                    <FaRegSave onClick={() => {
                                      setEditField("");
                                      handleSave();
                                    }} />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="row m-0 bdr-btm-eee">
                            <div className="col-4 pt-1 pb-1">
                              <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                  <MdOutlineMailOutline />
                                </div>
                                <div className="ep_info_h">Email :</div>
                              </div>
                            </div>
                            <div className="col-8 pt-1 pb-1 bdr-left-eee">
                              {editField !== "personalEmail" ? (
                                <div className="d-flex align-items-center justify-content-between ep_info">
                                  <div className="ep_info_t">
                                    {data.personal_email || "-"}
                                  </div>
                                  <div className="ep_info_icon">
                                    <MdOutlineEdit onClick={() => {
                                      if (editField !== "") {
                                        Swal.fire("Error", "Please save your changes before editing this field", "error");
                                        return;
                                      }
                                      setPersonalEmail(data.personal_email);
                                      setEditField("personalEmail");
                                    }} />
                                  </div>
                                </div>
                              ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="ep_info_form">
                                    <input type="email" className="ep_info_input form-control"
                                      value={data.personal_email} onChange={(e) => setPersonalEmail(e.target.value)} />
                                  </div>
                                  <div className="ep_info_icon">
                                    <FaRegSave onClick={() => {
                                      setEditField("");
                                      handleSave();
                                    }} />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>

                    {/* Payroll Information Component */}
                    <div class="tab-pane fade" id="PayrollInformation">
                      <EmployeeViewPayrollView editField={editField} setEditField={setEditField} fetchEmployeeData={fetchEmployeeData} />
                    </div>

                    <div class="tab-pane fade" id="Emergency_Contact">
                      <div className="my-card mt-2" >
                        <div className="my-card-body">

                          <div className="row m-0 bdr-btm-eee">
                            <div className="col-4 pt-1 pb-1">
                              <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                  <GoPerson />
                                </div>
                                <div className="ep_info_h">Emergency Contact :</div>
                              </div>
                            </div>
                            <div className="col-8 pt-1 pb-1 bdr-left-eee">
                              {editField !== "emergencyContact" ? (
                                <div className="d-flex align-items-center justify-content-between ep_info">
                                  <div className="ep_info_t">
                                    {data.personal_contact_person || "-"}
                                  </div>
                                  <div className="ep_info_icon">
                                    <MdOutlineEdit onClick={() => {
                                      if (editField !== "") {
                                        Swal.fire("Error", "Please save your changes before editing this field", "error");
                                        return;
                                      }
                                      setEmergencyContactName(data.personal_contact_person);
                                      setEditField("emergencyContact");
                                    }} />
                                  </div>
                                </div>
                              ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="ep_info_form">
                                    <input type="text" className="ep_info_input form-control"
                                      value={emergencyContactName} onChange={(e) => setEmergencyContactName(e.target.value)} />
                                  </div>
                                  <div className="ep_info_icon">
                                    <FaRegSave onClick={() => {
                                      setEditField("");
                                      handleSave();
                                    }} />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="row m-0 bdr-btm-eee">
                            <div className="col-4 pt-1 pb-1">
                              <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                  <GiRelationshipBounds />
                                </div>
                                <div className="ep_info_h">Relationship  :</div>
                              </div>
                            </div>
                            <div className="col-8 pt-1 pb-1 bdr-left-eee">
                              {editField !== "relationship" ? (
                                <div className="d-flex align-items-center justify-content-between ep_info">
                                  <div className="ep_info_t">
                                    {data.personal_contact_person_relationship || "-"}
                                  </div>
                                  <div className="ep_info_icon">
                                    <MdOutlineEdit onClick={() => {
                                      if (editField !== "") {
                                        Swal.fire("Error", "Please save your changes before editing this field", "error");
                                        return;
                                      }
                                      setRelationship(data.personal_contact_person_relationship);
                                      setEditField("relationship");
                                    }} />
                                  </div>
                                </div>
                              ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="ep_info_form">
                                    <select className="ep_info_select form-control"
                                      value={relationship} onChange={(e) => setRelationship(e.target.value)}>
                                      <option value="" selected>--Select Relationship--</option>
                                      <option value="Father">Father</option>
                                      <option value="Mother">Mother</option>
                                      <option value="Spouse">Spouse</option>
                                    </select>
                                  </div>
                                  <div className="ep_info_icon">
                                    <FaRegSave onClick={() => {
                                      setEditField("");
                                      handleSave();
                                    }} />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="row m-0">
                            <div className="col-4 pt-1 pb-1">
                              <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                  <PiPhoneCall />
                                </div>
                                <div className="ep_info_h">Contect No :</div>
                              </div>
                            </div>
                            <div className="col-8 pt-1 pb-1 bdr-left-eee">
                              {editField !== "emergencyContactNo" ? (
                                <div className="d-flex align-items-center justify-content-between ep_info">
                                  <div className="ep_info_t">
                                    {data.personal_contact_person_number || "-"}
                                  </div>
                                  <div className="ep_info_icon">
                                    <MdOutlineEdit onClick={() => {
                                      if (editField !== "") {
                                        Swal.fire("Error", "Please save your changes before editing this field", "error");
                                        return;
                                      }
                                      setEmergencyContactNumber(data.personal_contact_person_number);
                                      setEditField("emergencyContactNo");
                                    }} />
                                  </div>
                                </div>
                              ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="ep_info_form">
                                    <input type="text" className="ep_info_input form-control"
                                      value={emergencyContactNumber} onChange={(e) => setEmergencyContactNumber(e.target.value)} />
                                  </div>
                                  <div className="ep_info_icon">
                                    <FaRegSave onClick={() => {
                                      setEditField("");
                                      handleSave();
                                    }} />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>

                      <div className="my-card mt-2" >
                        <div className="my-card-body">

                          <div className="row m-0  bdr-btm-eee align-items-center">
                            <div className="col-4 pt-1 pb-1">
                              <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                  <GrLocation />
                                </div>
                                <div className="ep_info_h">Current Address :</div>
                              </div>
                            </div>
                            <div className="col-8 pt-1 pb-1 bdr-left-eee">
                              {editField !== "currentAddress" ? (
                                <div className="d-flex align-items-center justify-content-between ep_info">
                                  <div className="ep_info_t">
                                    {data.currentAddress || "-"}
                                  </div>
                                  <div className="ep_info_icon">
                                    <MdOutlineEdit onClick={() => {
                                      if (editField !== "") {
                                        Swal.fire("Error", "Please save your changes before editing this field", "error");
                                        return;
                                      }
                                      setCurrentAddress(data.currentAddress);
                                      setEditField("currentAddress");
                                    }} />
                                  </div>
                                </div>
                              ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="ep_info_form">
                                    <textarea className="ep_info_textarea form-control"
                                      value={currentAddress} onChange={(e) => setCurrentAddress(e.target.value)} />
                                  </div>
                                  <div className="ep_info_icon">
                                    <FaRegSave onClick={() => {
                                      setEditField("");
                                      handleSave();
                                    }} />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="row m-0  bdr-btm-eee align-items-center">
                            <div className="col-4 pt-1 pb-1">
                              <div className="d-flex align-items-center">
                                <div className="ep_info_icon clr-ffb900">
                                  <GrLocation />
                                </div>
                                <div className="ep_info_h">Permanent Address  :</div>
                              </div>
                            </div>
                            <div className="col-8 pt-1 pb-1 bdr-left-eee">
                              {editField !== "permanentAddress" ? (
                                <div className="d-flex align-items-center justify-content-between ep_info">
                                  <div className="ep_info_t">
                                    {data.permanentAddress || "-"}
                                  </div>
                                  <div className="ep_info_icon">
                                    <MdOutlineEdit onClick={() => {
                                      if (editField !== "") {
                                        Swal.fire("Error", "Please save your changes before editing this field", "error");
                                        return;
                                      }
                                      setPermanentAddress(data.permanentAddress);
                                      setEditField("permanentAddress");
                                    }} />
                                  </div>
                                </div>
                              ) : (
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="ep_info_form">
                                    <textarea className="ep_info_textarea form-control"
                                      value={permanentAddress} onChange={(e) => setPermanentAddress(e.target.value)} />
                                  </div>
                                  <div className="ep_info_icon">
                                    <FaRegSave onClick={() => {
                                      setEditField("");
                                      handleSave();
                                    }} />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>

                    <div class="tab-pane heiitc_inner fade" id="BusinessCard">
                      <BusinessCardView employeeInformation={data} />
                    </div>

                  </div>
                </div>
              </div>


              {/* Right Part */}
              <div className="hr_employee_information">
                <div className="my-card hr_emply_info_inner">
                  <ul class="nav nav-tabs hr_emply_info_inner_tabs">
                    <li class="nav-item hr_emply_info_inner_tab_item">
                      <a class="nav-link active" data-bs-toggle="tab" href="#Attendance">Attendance</a>
                    </li>
                    <li class="nav-item hr_emply_info_inner_tab_item">
                      <a class="nav-link" data-bs-toggle="tab" href="#SalaryCalculation">Salary Calculation</a>
                    </li>
                    <li class="nav-item hr_emply_info_inner_tab_item">
                      <a class="nav-link" data-bs-toggle="tab" href="#LeaveReport">Leave Report</a>
                    </li>
                    <li class="nav-item hr_emply_info_inner_tab_item">
                      <a class="nav-link" data-bs-toggle="tab" href="#CallingReport">Calling Report</a>
                    </li>
                    <li class="nav-item hr_emply_info_inner_tab_item">
                      <a class="nav-link" data-bs-toggle="tab" href="#EmployeeDocuments">Employee Documents</a>
                    </li>
                    <li class="nav-item hr_emply_info_inner_tab_item">
                      <a class="nav-link" data-bs-toggle="tab" href="#Settings">Settings</a>
                    </li>
                  </ul>
                  <div class="tab-content hr_eiinr_tab_content">
                    <div class="tab-pane heiitc_inner active" id="Attendance">
                      <EmployeeViewAttendance data={data} />
                    </div>
                    <div class="tab-pane heiitc_inner fade" id="SalaryCalculation">
                      <SalaryCalculationView />
                    </div>
                    <div class="tab-pane heiitc_inner fade" id="LeaveReport">
                      <LeaveReportView />
                    </div>
                    <div class="tab-pane heiitc_inner fade" id="CallingReport">
                      <CallingReportView employeeInformation={data} />
                    </div>
                    <div class="tab-pane heiitc_inner fade" id="EmployeeDocuments">...</div>
                    <div class="tab-pane heiitc_inner fade" id="Settings">...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Profile upload dialog box */}
      <Dialog
        open={showProfileUploadWindow}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Upload Image
          <IconButton
            onClick={() => setShowProfileUploadWindow(false)}
            style={{ float: "right" }}
          >
            <CloseIcon color="primary" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="maincon">
            <div
              style={{ justifyContent: "space-between" }}
              className="con1 d-flex"
            >
              <div
                style={{ paddingTop: "9px" }}
                className="uploadcsv"
              >
                <label
                  style={{ margin: "0px 0px 6px 0px" }}
                  htmlFor="fileInput"
                >
                  Upload Image File (JPG, PNG, JPEG)
                </label>
              </div>
            </div>
            <div
              style={{ margin: "5px 0px 0px 0px" }}
              className="form-control"
            >
              <input
                type="file"
                id="fileInput"
                name="profilePhoto"
                accept=".jpg, .jpeg, .png"
                onChange={handleImageChange}
              />
            </div>
          </div>
        </DialogContent>
        <Button onClick={handleSubmit} className="btn btn-primary">
          Submit
        </Button>
      </Dialog>
    </div>
  );
}

export default EmployeeView;